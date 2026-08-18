"""Configuration + provider wiring for guidekit.

Selection precedence (highest wins):

    1. explicit arguments to ``load_config`` / ``build_providers``
    2. environment variables  (GUIDEKIT_LLM, GUIDEKIT_SEARCH, GUIDEKIT_GEOCODE, ...)
    3. a ``guidekit.toml`` file (searched upward from cwd, then the package dir)
    4. built-in OPEN-SOURCE defaults  (Ollama + DuckDuckGo + Nominatim)

The whole point of guidekit is that with **nothing configured** you get a
fully local / open-source stack — no Claude, no paid API keys required. Set
env vars to swap in hosted providers for parity.

Env grammar
-----------
* ``GUIDEKIT_LLM``     — ``<backend>:<model>``, e.g. ``ollama:llama3.1``,
  ``litellm:ollama/llama3.1``, ``llamacpp:/models/qwen.gguf``,
  ``transformers:Qwen/Qwen2.5-7B-Instruct``, ``claude:claude-opus-4-8``.
* ``GUIDEKIT_SEARCH``  — ``ddgs`` (default), ``searxng``, ``tavily``, ``hosted``.
* ``GUIDEKIT_GEOCODE`` — ``nominatim`` (default), ``photon`` (documented).
* Provider-specific: ``OLLAMA_HOST``, ``ANTHROPIC_API_KEY``, ``TAVILY_API_KEY``,
  ``SEARXNG_URL``, ``GUIDEKIT_GEOCODE_USER_AGENT``, ``LITELLM_MODEL`` ...
"""
from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, Optional

# ---- toml loader (stdlib on 3.11+, falls back to tomli, then to no-toml) ----
try:
    import tomllib as _toml  # py3.11+

    def _load_toml(p: Path) -> Dict[str, Any]:
        with open(p, "rb") as fh:
            return _toml.load(fh)
except Exception:  # pragma: no cover
    try:
        import tomli as _toml  # type: ignore

        def _load_toml(p: Path) -> Dict[str, Any]:
            with open(p, "rb") as fh:
                return _toml.load(fh)
    except Exception:
        def _load_toml(p: Path) -> Dict[str, Any]:  # type: ignore
            return {}


DEFAULTS = {
    "llm": "ollama:llama3.1",
    "search": "ddgs",
    "geocode": "nominatim",
}


def find_toml(start: Optional[str] = None) -> Optional[Path]:
    """Search upward from ``start`` (or cwd) for ``guidekit.toml``.

    Falls back to a ``guidekit.toml`` shipped next to this package.
    """
    here = Path(start or os.getcwd()).resolve()
    for d in [here, *here.parents]:
        cand = d / "guidekit.toml"
        if cand.is_file():
            return cand
    packaged = Path(__file__).resolve().parent / "guidekit.toml"
    return packaged if packaged.is_file() else None


@dataclass
class Config:
    """Resolved, source-agnostic configuration."""

    llm: str = DEFAULTS["llm"]
    search: str = DEFAULTS["search"]
    geocode: str = DEFAULTS["geocode"]
    # per-provider option bags, merged from toml + env
    options: Dict[str, Dict[str, Any]] = field(default_factory=dict)
    toml_path: Optional[str] = None

    def opt(self, section: str, key: str, default: Any = None) -> Any:
        return self.options.get(section, {}).get(key, default)


def load_config(
    *,
    llm: Optional[str] = None,
    search: Optional[str] = None,
    geocode: Optional[str] = None,
    toml_path: Optional[str] = None,
    start_dir: Optional[str] = None,
) -> Config:
    """Resolve a :class:`Config` from args > env > toml > defaults."""
    path = Path(toml_path) if toml_path else find_toml(start_dir)
    data: Dict[str, Any] = {}
    if path and path.is_file():
        try:
            data = _load_toml(path)
        except Exception:
            data = {}

    def pick(name: str, arg: Optional[str], env: str) -> str:
        if arg:
            return arg
        if os.environ.get(env):
            return os.environ[env].strip()
        if isinstance(data.get(name), str):
            return data[name]
        if isinstance(data.get(name), dict) and data[name].get("provider"):
            return data[name]["provider"]
        return DEFAULTS[name]

    # option bags: everything under [llm], [search], [geocode], [orchestrator] tables
    options: Dict[str, Dict[str, Any]] = {}
    for section in ("llm", "search", "geocode", "orchestrator", "pipeline"):
        sec = data.get(section)
        if isinstance(sec, dict):
            options[section] = {k: v for k, v in sec.items() if k != "provider"}
        else:
            options.setdefault(section, {})

    cfg = Config(
        llm=pick("llm", llm, "GUIDEKIT_LLM"),
        search=pick("search", search, "GUIDEKIT_SEARCH"),
        geocode=pick("geocode", geocode, "GUIDEKIT_GEOCODE"),
        options=options,
        toml_path=str(path) if path else None,
    )
    _overlay_env(cfg)
    return cfg


def _overlay_env(cfg: Config) -> None:
    """Let a handful of well-known env vars override toml option bags."""
    env_map = {
        ("llm", "ollama_host"): "OLLAMA_HOST",
        ("llm", "api_key"): "ANTHROPIC_API_KEY",
        ("llm", "base_url"): "GUIDEKIT_LLM_BASE_URL",
        ("search", "searxng_url"): "SEARXNG_URL",
        ("search", "tavily_api_key"): "TAVILY_API_KEY",
        ("geocode", "user_agent"): "GUIDEKIT_GEOCODE_USER_AGENT",
        ("geocode", "base_url"): "GUIDEKIT_GEOCODE_URL",
    }
    for (section, key), env in env_map.items():
        if os.environ.get(env):
            cfg.options.setdefault(section, {})[key] = os.environ[env]


@dataclass
class Providers:
    """A wired bundle of the three swappable capabilities + the config."""

    config: Config
    llm: Any            # llm.LLMBackend
    search: Any         # search.SearchBackend
    geocode: Any        # geocode.GeocodeBackend

    def describe(self) -> str:
        return (
            f"guidekit providers:\n"
            f"  llm     = {self.config.llm}  -> {type(self.llm).__name__}\n"
            f"  search  = {self.config.search}  -> {type(self.search).__name__}\n"
            f"  geocode = {self.config.geocode}  -> {type(self.geocode).__name__}\n"
            f"  toml    = {self.config.toml_path or '(none; using defaults)'}"
        )


def build_providers(cfg: Optional[Config] = None, **kwargs: Any) -> Providers:
    """Instantiate the selected LLM / search / geocode adapters.

    Imports the adapter modules lazily so that importing :mod:`guidekit.config`
    never drags in optional third-party deps (litellm, geopy, ...). Each adapter
    is constructed but its heavy client is created lazily too, so this works in a
    sandbox where the backends are not actually installed/reachable.
    """
    cfg = cfg or load_config(**kwargs)
    from . import llm as _llm
    from . import search as _search
    from . import geocode as _geo

    return Providers(
        config=cfg,
        llm=_llm.from_config(cfg),
        search=_search.from_config(cfg),
        geocode=_geo.from_config(cfg),
    )
