"""guidekit — pluggable providers for the field-guide pipeline.

Every capability the repo's pipeline depends on is behind an interface with at
least one working **open-source** adapter, so the whole flow can run with a
**local model in place of Claude** and open tools for search / geocode /
orchestration. The existing ``tools/*`` scripts are never modified — they are
*wrapped* (see :mod:`guidekit.pipeline`).

Capabilities → modules
----------------------
* LLM / agent that discovers places  -> :mod:`guidekit.llm`     (Ollama, llama.cpp,
                                        transformers, vLLM via LiteLLM; Claude for parity)
* web search                          -> :mod:`guidekit.search`  (DuckDuckGo, SearXNG, Tavily)
* geocoding to a place pin            -> :mod:`guidekit.geocode` (Nominatim / OSM via geopy)
* sub-agent fan-out orchestration     -> :mod:`guidekit.orchestrator`
* deterministic gates (unchanged)     -> :mod:`guidekit.pipeline`
* config / provider wiring            -> :mod:`guidekit.config`
* data contracts + gate previews      -> :mod:`guidekit.schemas`

Quick start (fully open-source defaults; no Claude, no API keys)::

    from guidekit import build_providers
    prov = build_providers()          # Ollama + DuckDuckGo + Nominatim
    print(prov.describe())
"""
from __future__ import annotations

__version__ = "0.1.0"

from .config import Config, Providers, build_providers, load_config
from .llm import LLMBackend, LLMResult, ClaudeBackend, LocalBackend
from .search import (
    SearchBackend, SearchResult, DDGSSearchBackend, SearxngSearchBackend,
    TavilySearchBackend, HostedSearchBackend,
)
from .geocode import GeocodeBackend, GeoResult, NominatimGeocoder
from .orchestrator import Orchestrator, Worker, Task, WorkerResult
from .pipeline import Pipeline, ProcResult, repo_root, CITY_MAP
from .schemas import (
    PlaceRecord, ResearchFile, passes_sourcing, credible_source_keys,
    place_json_schema, discovery_batch_schema,
)

__all__ = [
    "__version__",
    # config
    "Config", "Providers", "build_providers", "load_config",
    # llm
    "LLMBackend", "LLMResult", "ClaudeBackend", "LocalBackend",
    # search
    "SearchBackend", "SearchResult", "DDGSSearchBackend", "SearxngSearchBackend",
    "TavilySearchBackend", "HostedSearchBackend",
    # geocode
    "GeocodeBackend", "GeoResult", "NominatimGeocoder",
    # orchestration
    "Orchestrator", "Worker", "Task", "WorkerResult",
    # pipeline
    "Pipeline", "ProcResult", "repo_root", "CITY_MAP",
    # schemas
    "PlaceRecord", "ResearchFile", "passes_sourcing", "credible_source_keys",
    "place_json_schema", "discovery_batch_schema",
]
