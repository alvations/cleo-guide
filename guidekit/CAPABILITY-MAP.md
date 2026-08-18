# guidekit — capability map

Every capability the field-guide pipeline depends on, the **open-source library**
that replaces the hosted/Claude version, and where it lives in guidekit. The
existing `tools/*` scripts are never modified — guidekit **wraps** them
(`guidekit/pipeline.py`).

The pipeline's five human/agent-run capabilities (from `docs/PIPELINE.md`):
(a) an LLM/agent that discovers places & writes JSON, (b) web **search**,
(c) **geocoding** to a place-pin, (d) sub-**agent** orchestration (fan-out),
(e) deterministic pipeline steps (consolidate → sourcecheck → geocode-status →
build → gate).

| # | Capability (today) | guidekit module | Open-source replacement(s) | Hosted/Claude parity | Maturity & notes |
|---|---|---|---|---|---|
| a | LLM that discovers places & emits JSON | `llm.py` (`LLMBackend`, `LocalBackend`) | **Ollama**, **llama.cpp** (`llama-cpp-python`), **vLLM**, **Transformers**, all fronted by **LiteLLM**'s unified router | `ClaudeBackend` (Anthropic SDK) | Mature. Ollama & llama.cpp give **native JSON-schema** structured output; vLLM via its OpenAI-compatible server + LiteLLM `response_format`; raw Transformers is unconstrained, so we extract+validate (wrap with **Outlines**/**lm-format-enforcer** for hard guarantees). |
| b | Web search (source discovery) | `search.py` (`SearchBackend`) | **DuckDuckGo** (`ddgs`), **SearXNG** (self-hosted meta-search), **Tavily** (hosted, optional) | `HostedSearchBackend` (documented hook for WebSearch/Brave/Serper/Google CSE) | Mature. DuckDuckGo = zero-config default; **SearXNG** is the robust choice for volume (self-host, no rate cap). Shared-budget rate limiter built in. |
| c | Geocode to the exact place-pin | `geocode.py` (`GeocodeBackend`) | **Nominatim / OpenStreetMap** (via `geopy`); **Photon** and **Pelias** documented as drop-ins | (any Places API behind the same ABC) | Mature. Enforces CLAUDE.md rule 4a/4b: rejects city/administrative/boundary matches (viewports) and **grades** each kept pin `high`/`med`/`low` from OSM `class`/`addresstype`/house-number. See grading table in `geocode.py`. |
| d | Sub-agent fan-out orchestration | `orchestrator.py` (`Orchestrator`, `Worker`, `Task`) | **this orchestrator** (stdlib `concurrent.futures`, concurrency-capped) | replaces Claude's Agent/Task tool | Working, self-contained, offline-capable. Alternatives if you want a framework: **LangChain** `AgentExecutor`, **CrewAI** `Agent`/`Task`, **AutoGen**, **Llama-Index** agents — the `Worker` shape maps onto all of them. |
| e | Deterministic gates (consolidate → sourcecheck → geocode-status → build → research.js gates) | `pipeline.py` (`Pipeline`) | **the repo's own scripts, unchanged** — shelled out via `subprocess` | n/a (already deterministic) | Mature. `Pipeline` locates the repo root and runs `consolidate.py`, `sourcecheck.py`, `geocode-status.py`, `build-<city>.py`, and `node research.js --{sourcecheck,geocheck,statuscheck,buildcheck,validate}` byte-for-byte. |
| — | Config / provider selection | `config.py` | stdlib `tomllib` + env vars | — | `GUIDEKIT_LLM/SEARCH/GEOCODE` + `guidekit.toml`; args > env > toml > OSS defaults. |
| — | Data contracts + gate preview | `schemas.py` | `pydantic` (degrades to dataclasses) | — | JSON-schema for structured LLM output; `passes_sourcing()` previews the ≥2-sources-of-truth rule in-process (the real gate stays authoritative). |

## Fully-offline / open-source path (no Claude, no API keys)

With **nothing configured**, `build_providers()` wires:

```
LLM     = ollama:llama3.1        (guidekit.llm.LocalBackend, transport=ollama)
search  = ddgs                   (guidekit.search.DDGSSearchBackend)
geocode = nominatim              (guidekit.geocode.NominatimGeocoder)
orchestration = guidekit.orchestrator.Orchestrator
gates   = the repo's own tools, unchanged
```

`guidekit/examples/run_discovery.py` runs the whole discovery → normalize →
**real `tools/sourcecheck.py`** flow end-to-end. It ships deterministic offline
**stubs** (that honour the ABCs) so the wiring + the real gate run even where
Ollama/ddgs aren't installed — `--offline` forces them, `--live` requires the
real backends, default auto-falls-back and says which path it took.

### Structured-output support per LLM transport

| Transport | Schema enforcement | How |
|---|---|---|
| Ollama | native | pass JSON schema as `format=` |
| llama.cpp | native | `response_format={"type":"json_object","schema":…}` (GBNF under the hood) |
| vLLM / TGI / others via LiteLLM | native where the server supports it | LiteLLM `response_format` json_schema; else extract+validate |
| Transformers (raw) | best-effort | prompt-inlined schema → `extract_json` → pydantic validate → one repair retry; add **Outlines**/**lm-format-enforcer** for a hard grammar |
| Claude (parity) | native | JSON schema → a single **forced tool**, args match the schema |

## Sub-agents delegated to write missing adapters

**None.** Every capability the pipeline needs maps to a mature, clean
open-source library (table above), so no adapter had to be delegated to a
sub-agent to author a from-scratch library. The one genuinely fiddly area —
guaranteed schema-constrained decoding for *raw* Transformers — is already
covered by existing OSS (Outlines, lm-format-enforcer, jsonformer); guidekit
integrates against them rather than reimplementing a constrained decoder, and
ships an honest extract-and-validate fallback for the no-extra-deps case.

(Operational note: in this sandbox a spawned sub-agent runs in a separate
container/checkout, so it could not land files directly in this working tree
without a git round-trip — another reason delegation was neither necessary nor
appropriate here. Had a real gap existed, the delegation target would have been
that constrained-decoding adapter.)

## Tests & fixes (audit, 2026-08-18)

`guidekit/tests/` — 42 offline unit tests (`python3 -m unittest discover -s guidekit/tests`),
no network / Ollama / API keys. They cover config precedence, the JSON extractor, the sourcing-gate
preview (incl. parity with `tools/sourcecheck.py`), search de-dup, Nominatim place-pin grading, the
fan-out orchestrator, and a live drive of the **real** `tools/sourcecheck.py` through the wrapper.

Two genuine bugs fixed during the audit (both in guidekit; the `tools/*` scripts were left unchanged):

* `llm.py` `from_config` kept the `litellm:` prefix in the model id
  (`litellm:ollama/llama3.1` → `model="litellm:ollama/llama3.1"`, an id LiteLLM rejects). Fixed to
  emit the provider-qualified `ollama/llama3.1`.
* `schemas.py` `ELITE_SOLO` was missing **`NPS`**, so the in-process `passes_sourcing` preview
  disagreed with the real gate (it would drop a lone-NPS place like Alcatraz that the gate keeps).
  Now matches all five authoritative definitions.

Full write-up + the documented-not-fixed `sourcecheck.py` worklist-path quirk: [`../docs/TOOLS.md`](../docs/TOOLS.md).

## What is NOT abstracted (by design)

* The **deterministic gates themselves** — they are the source of truth and run
  unchanged; guidekit only *invokes* them.
* The **browser geocode helper** (`tools/geocode-helper.html`) for restaurant
  place-pins that public geocoders miss — a self-hosted **Nominatim** or
  **Photon** instance (documented in `geocode.py`) is the open-source way to
  raise that ceiling for bulk work.
