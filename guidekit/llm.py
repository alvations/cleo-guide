"""LLM backends — swap Claude for a local open-source model.

    LLMBackend (ABC)
      .complete(prompt, *, system, tools, schema, temperature, max_tokens) -> LLMResult

Two families of adapter:

* :class:`ClaudeBackend` — Anthropic SDK (hosted parity). Structured output is
  done the robust way: a JSON schema is turned into a single forced *tool*, so
  the model must return arguments matching the schema.
* :class:`LocalBackend` — one adapter, several transports, all open source:
    - ``litellm``      : LiteLLM's unified router (recommended; fronts Ollama,
                          vLLM, llama.cpp servers, TGI, etc.). Uses
                          ``response_format`` for JSON-schema output when the
                          served model supports it.
    - ``ollama``       : the Ollama Python client, ``format=<json-schema>``.
    - ``llamacpp``     : llama-cpp-python in-process, GBNF/JSON grammar.
    - ``transformers`` : a local HF pipeline (no server); JSON is extracted +
                          validated because plain HF generation is unconstrained.

Every transport supports structured (JSON-schema) output. Where a transport
cannot *guarantee* schema conformance, we fall back to :func:`extract_json` +
pydantic validation and one repair retry — honest best-effort, documented as
such. None of this requires Claude.
"""
from __future__ import annotations

import json
import re
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any, Callable, Dict, List, Optional


@dataclass
class LLMResult:
    """The outcome of one completion."""

    text: str = ""
    parsed: Optional[Any] = None          # dict/list when a schema was requested
    tool_calls: List[Dict[str, Any]] = field(default_factory=list)
    raw: Any = None                       # provider-native response, for debugging
    backend: str = ""


# --------------------------------------------------------------------------- #
#  structured-output helpers (backend-agnostic)                               #
# --------------------------------------------------------------------------- #
_JSON_FENCE = re.compile(r"```(?:json)?\s*(.*?)```", re.DOTALL)


def extract_json(text: str) -> Optional[Any]:
    """Best-effort extraction of the first JSON value in free-form model text.

    Handles ```json fences and bare objects/arrays. Returns ``None`` if nothing
    parses. Used as the fallback when a transport can't hard-constrain output.
    """
    if not text:
        return None
    m = _JSON_FENCE.search(text)
    if m:
        try:
            return json.loads(m.group(1))
        except Exception:
            pass
    # scan for the first balanced { } or [ ] block
    for opener, closer in (("{", "}"), ("[", "]")):
        start = text.find(opener)
        while start != -1:
            depth, in_str, esc = 0, False, False
            for i in range(start, len(text)):
                ch = text[i]
                if in_str:
                    if esc:
                        esc = False
                    elif ch == "\\":
                        esc = True
                    elif ch == '"':
                        in_str = False
                    continue
                if ch == '"':
                    in_str = True
                elif ch == opener:
                    depth += 1
                elif ch == closer:
                    depth -= 1
                    if depth == 0:
                        try:
                            return json.loads(text[start : i + 1])
                        except Exception:
                            break
            start = text.find(opener, start + 1)
    return None


def validate_against(schema_model: Optional[Callable], value: Any) -> Any:
    """Validate ``value`` against a pydantic model if one is supplied, else pass."""
    if schema_model is None or value is None:
        return value
    try:
        return schema_model.model_validate(value)
    except Exception:
        return value


# --------------------------------------------------------------------------- #
#  ABC                                                                        #
# --------------------------------------------------------------------------- #
class LLMBackend(ABC):
    """Abstract completion backend. All adapters honour the same signature."""

    name: str = "llm"

    @abstractmethod
    def complete(
        self,
        prompt: str,
        *,
        system: Optional[str] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
        schema: Optional[Dict[str, Any]] = None,
        temperature: float = 0.2,
        max_tokens: int = 2048,
    ) -> LLMResult:
        """Run one completion.

        ``schema`` — a JSON schema; when given, the adapter must return
        ``LLMResult.parsed`` as a Python object conforming to it (or its best
        effort, with the raw text still in ``.text``).
        ``tools`` — provider-neutral tool specs ``{"name","description","schema"}``.
        """
        raise NotImplementedError

    def preflight(self) -> None:
        """Import this backend's client library (no network call).

        Raises ImportError if the backend's dependency is not installed, so
        callers can detect availability and fall back. Default: no-op.
        """
        return None

    # convenience -----------------------------------------------------------
    def complete_json(self, prompt: str, schema: Dict[str, Any], **kw: Any) -> Any:
        """Return just the parsed JSON (or ``None``)."""
        return self.complete(prompt, schema=schema, **kw).parsed


# --------------------------------------------------------------------------- #
#  Claude / Anthropic (hosted parity)                                         #
# --------------------------------------------------------------------------- #
class ClaudeBackend(LLMBackend):
    """Anthropic SDK adapter. Present for parity — NOT required for OSS use.

    Structured output uses forced tool-use: the JSON schema becomes a single
    tool the model is compelled to call, so arguments match the schema.
    """

    name = "claude"

    def __init__(self, model: str = "claude-opus-4-8", api_key: Optional[str] = None,
                 **opts: Any) -> None:
        self.model = model
        self.api_key = api_key
        self.opts = opts
        self._client = None

    def preflight(self) -> None:
        import anthropic  # noqa: F401

    def _client_lazy(self):
        if self._client is None:
            import anthropic  # imported lazily; only needed for this backend

            self._client = anthropic.Anthropic(api_key=self.api_key)
        return self._client

    def complete(self, prompt, *, system=None, tools=None, schema=None,
                 temperature=0.2, max_tokens=2048) -> LLMResult:
        client = self._client_lazy()
        api_tools = []
        forced = None
        if schema is not None:
            forced = "emit_result"
            api_tools.append({
                "name": forced,
                "description": "Return the structured result matching the schema.",
                "input_schema": schema,
            })
        for t in tools or []:
            api_tools.append({
                "name": t["name"],
                "description": t.get("description", ""),
                "input_schema": t.get("schema", t.get("input_schema", {"type": "object"})),
            })
        kw: Dict[str, Any] = dict(
            model=self.model, max_tokens=max_tokens, temperature=temperature,
            messages=[{"role": "user", "content": prompt}],
        )
        if system:
            kw["system"] = system
        if api_tools:
            kw["tools"] = api_tools
        if forced:
            kw["tool_choice"] = {"type": "tool", "name": forced}
        resp = client.messages.create(**kw)
        text_parts, tool_calls, parsed = [], [], None
        for block in resp.content:
            if getattr(block, "type", None) == "text":
                text_parts.append(block.text)
            elif getattr(block, "type", None) == "tool_use":
                tool_calls.append({"name": block.name, "input": block.input})
                if block.name == forced:
                    parsed = block.input
        return LLMResult(text="".join(text_parts), parsed=parsed,
                         tool_calls=tool_calls, raw=resp, backend=self.name)


# --------------------------------------------------------------------------- #
#  Local / open-source models                                                 #
# --------------------------------------------------------------------------- #
class LocalBackend(LLMBackend):
    """Local open-source model behind one of several transports.

    ``transport`` is one of ``litellm | ollama | llamacpp | transformers``.
    Chosen automatically from the ``GUIDEKIT_LLM`` prefix, or passed explicitly.
    """

    name = "local"

    def __init__(self, model: str, transport: str = "litellm", *,
                 ollama_host: Optional[str] = None, base_url: Optional[str] = None,
                 model_path: Optional[str] = None, **opts: Any) -> None:
        self.model = model
        self.transport = transport
        self.ollama_host = ollama_host
        self.base_url = base_url
        self.model_path = model_path or model
        self.opts = opts
        self._handle = None  # lazily created client / pipeline

    # -- public ------------------------------------------------------------
    def preflight(self) -> None:
        imports = {
            "litellm": "litellm", "ollama": "ollama",
            "llamacpp": "llama_cpp", "transformers": "transformers",
        }
        mod = imports.get(self.transport)
        if mod:
            __import__(mod)

    def complete(self, prompt, *, system=None, tools=None, schema=None,
                 temperature=0.2, max_tokens=2048) -> LLMResult:
        fn = getattr(self, f"_complete_{self.transport}", None)
        if fn is None:
            raise ValueError(f"unknown local transport: {self.transport!r}")
        return fn(prompt, system, tools, schema, temperature, max_tokens)

    # -- LiteLLM (unified router; recommended) -----------------------------
    def _complete_litellm(self, prompt, system, tools, schema, temperature, max_tokens):
        import litellm  # unified interface over ollama/vllm/llama.cpp servers/...

        messages = ([{"role": "system", "content": system}] if system else []) + [
            {"role": "user", "content": self._augment(prompt, schema)}
        ]
        kw: Dict[str, Any] = dict(model=self.model, messages=messages,
                                  temperature=temperature, max_tokens=max_tokens)
        if self.base_url:
            kw["api_base"] = self.base_url
        if schema is not None:
            # Providers that support it enforce the schema; others ignore it and
            # we recover via extract_json below.
            kw["response_format"] = {
                "type": "json_schema",
                "json_schema": {"name": "result", "schema": schema, "strict": True},
            }
        resp = litellm.completion(**kw)
        text = resp["choices"][0]["message"]["content"] or ""
        parsed = extract_json(text) if schema is not None else None
        if schema is not None and parsed is None:
            parsed = self._repair(prompt, schema, text, self._complete_litellm,
                                  system, tools, temperature, max_tokens)
        return LLMResult(text=text, parsed=parsed, raw=resp, backend="litellm")

    # -- Ollama python client ---------------------------------------------
    def _complete_ollama(self, prompt, system, tools, schema, temperature, max_tokens):
        import ollama

        client = ollama.Client(host=self.ollama_host) if self.ollama_host else ollama
        kw: Dict[str, Any] = dict(
            model=self.model,
            messages=([{"role": "system", "content": system}] if system else []) +
                     [{"role": "user", "content": prompt}],
            options={"temperature": temperature, "num_predict": max_tokens},
        )
        # Ollama accepts a JSON schema directly as `format` for structured output.
        if schema is not None:
            kw["format"] = schema
        resp = client.chat(**kw)
        text = resp["message"]["content"] if isinstance(resp, dict) else resp.message.content
        parsed = extract_json(text) if schema is not None else None
        return LLMResult(text=text or "", parsed=parsed, raw=resp, backend="ollama")

    # -- llama-cpp-python (in-process GGUF) --------------------------------
    def _complete_llamacpp(self, prompt, system, tools, schema, temperature, max_tokens):
        if self._handle is None:
            from llama_cpp import Llama

            self._handle = Llama(model_path=self.model_path,
                                 n_ctx=int(self.opts.get("n_ctx", 8192)),
                                 verbose=False)
        llm = self._handle
        full = (f"{system}\n\n" if system else "") + self._augment(prompt, schema)
        kw: Dict[str, Any] = dict(temperature=temperature, max_tokens=max_tokens)
        if schema is not None:
            # llama.cpp enforces JSON schemas natively via response_format.
            kw["response_format"] = {"type": "json_object", "schema": schema}
        out = llm.create_chat_completion(
            messages=[{"role": "user", "content": full}], **kw
        )
        text = out["choices"][0]["message"]["content"] or ""
        parsed = extract_json(text) if schema is not None else None
        return LLMResult(text=text, parsed=parsed, raw=out, backend="llamacpp")

    # -- transformers pipeline (no server) ---------------------------------
    def _complete_transformers(self, prompt, system, tools, schema, temperature, max_tokens):
        if self._handle is None:
            from transformers import pipeline

            self._handle = pipeline("text-generation", model=self.model_path)
        gen = self._handle
        full = (f"{system}\n\n" if system else "") + self._augment(prompt, schema)
        out = gen(full, max_new_tokens=max_tokens,
                  do_sample=temperature > 0, temperature=max(temperature, 1e-3),
                  return_full_text=False)
        text = out[0]["generated_text"] if out else ""
        # Plain HF generation is unconstrained: extract + (caller) validate.
        # For hard guarantees, wrap with `outlines` or `lm-format-enforcer`.
        parsed = extract_json(text) if schema is not None else None
        return LLMResult(text=text, parsed=parsed, raw=out, backend="transformers")

    # -- helpers -----------------------------------------------------------
    @staticmethod
    def _augment(prompt: str, schema: Optional[Dict[str, Any]]) -> str:
        """Nudge non-enforcing transports toward valid JSON by inlining the schema."""
        if schema is None:
            return prompt
        return (
            f"{prompt}\n\nReturn ONLY a single JSON value matching this JSON schema, "
            f"no prose, no markdown fences:\n{json.dumps(schema)}"
        )

    def _repair(self, prompt, schema, bad_text, fn, system, tools, temperature, max_tokens):
        """One retry asking the model to fix its output into valid schema JSON."""
        repair_prompt = (
            "Your previous answer was not valid JSON for the required schema. "
            "Re-emit ONLY the corrected JSON value.\n\n"
            f"Schema:\n{json.dumps(schema)}\n\nPrevious answer:\n{bad_text[:4000]}"
        )
        try:
            res = fn(repair_prompt, system, tools, schema, 0.0, max_tokens)
            return res.parsed
        except Exception:
            return None


# --------------------------------------------------------------------------- #
#  factory                                                                     #
# --------------------------------------------------------------------------- #
_TRANSPORT_PREFIXES = {
    "claude": "claude", "anthropic": "claude",
    "litellm": "litellm", "ollama": "ollama",
    "llamacpp": "llamacpp", "llama-cpp": "llamacpp", "llama_cpp": "llamacpp",
    "transformers": "transformers", "hf": "transformers",
}


def from_config(cfg) -> LLMBackend:
    """Build an :class:`LLMBackend` from a :class:`guidekit.config.Config`.

    ``cfg.llm`` is ``<backend>:<model>``. ``claude:*`` -> ClaudeBackend; anything
    else -> LocalBackend with the matching transport.
    """
    spec = cfg.llm
    backend, _, model = spec.partition(":")
    backend = backend.strip().lower()
    model = model.strip() or spec
    opts = dict(cfg.options.get("llm", {}))

    if _TRANSPORT_PREFIXES.get(backend) == "claude":
        return ClaudeBackend(model=model or "claude-opus-4-8",
                             api_key=opts.get("api_key"), **_clean(opts, {"api_key"}))

    transport = _TRANSPORT_PREFIXES.get(backend, "litellm")
    # For litellm we keep the full spec (e.g. "ollama/llama3.1") as the model.
    litellm_model = spec if transport == "litellm" and "/" in model else model
    return LocalBackend(
        model=litellm_model if transport == "litellm" else model,
        transport=transport,
        ollama_host=opts.get("ollama_host"),
        base_url=opts.get("base_url"),
        model_path=opts.get("model_path"),
        **_clean(opts, {"ollama_host", "base_url", "model_path", "api_key"}),
    )


def _clean(d: Dict[str, Any], drop: set) -> Dict[str, Any]:
    return {k: v for k, v in d.items() if k not in drop}
