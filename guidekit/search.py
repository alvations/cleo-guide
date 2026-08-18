"""Search backends — an open-source stand-in for the operator's WebSearch tool.

    SearchBackend (ABC)
      .search(query, *, max_results, region, safesearch) -> list[SearchResult]

The pipeline's Stage 1/2 (discover sources, then extract the places they name)
runs on a web-search tool. This module provides that capability without any
proprietary dependency:

* :class:`DDGSSearchBackend`  — DuckDuckGo via the ``ddgs`` package (formerly
  ``duckduckgo_search``). No API key. The default.
* :class:`SearxngSearchBackend` — a self-hosted **SearXNG** meta-search JSON API
  (fully open source; the most robust option for volume).
* :class:`TavilySearchBackend` — Tavily's search API (optional; needs a key;
  included because the brief lists it, but it is a hosted service).
* :class:`HostedSearchBackend` — interface-only placeholder documenting how a
  proprietary search tool (the repo's WebSearch, Brave, Serper, Google CSE)
  would slot in. It raises unless a ``call`` hook is supplied.

All adapters share :class:`SearchResult` and a courteous rate limiter so a
discovery wave does not hammer a public endpoint (mirrors the repo's "WebSearch
budget is shared" caution).
"""
from __future__ import annotations

import threading
import time
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, Callable, List, Optional


@dataclass
class SearchResult:
    title: str
    url: str
    snippet: str = ""
    source: str = ""      # which backend produced it

    def as_line(self) -> str:
        return f"- {self.title} — {self.url}\n  {self.snippet}".rstrip()


class _RateLimiter:
    """Simple min-interval limiter, thread-safe (shared budget discipline)."""

    def __init__(self, min_interval: float) -> None:
        self.min_interval = float(min_interval)
        self._lock = threading.Lock()
        self._last = 0.0

    def wait(self) -> None:
        if self.min_interval <= 0:
            return
        with self._lock:
            dt = time.monotonic() - self._last
            if dt < self.min_interval:
                time.sleep(self.min_interval - dt)
            self._last = time.monotonic()


class SearchBackend(ABC):
    name = "search"

    def __init__(self, min_interval: float = 1.0) -> None:
        self._rl = _RateLimiter(min_interval)

    @abstractmethod
    def search(self, query: str, *, max_results: int = 8, region: str = "us-en",
               safesearch: str = "moderate") -> List[SearchResult]:
        raise NotImplementedError

    def search_many(self, queries: List[str], *, max_results: int = 8,
                    **kw: Any) -> List[SearchResult]:
        """Run several queries, de-duplicating by URL (keeps first seen)."""
        seen, out = set(), []
        for q in queries:
            for r in self.search(q, max_results=max_results, **kw):
                if r.url and r.url not in seen:
                    seen.add(r.url)
                    out.append(r)
        return out


# --------------------------------------------------------------------------- #
class DDGSSearchBackend(SearchBackend):
    """DuckDuckGo search — no API key. Uses ``ddgs`` (new) or ``duckduckgo_search``."""

    name = "ddgs"

    def __init__(self, min_interval: float = 1.5, **_: Any) -> None:
        super().__init__(min_interval)
        self._impl = None

    def _client(self):
        if self._impl is None:
            try:
                from ddgs import DDGS  # current package name
            except Exception:
                from duckduckgo_search import DDGS  # legacy name
            self._impl = DDGS
        return self._impl

    def search(self, query, *, max_results=8, region="us-en", safesearch="moderate"):
        self._rl.wait()
        DDGS = self._client()
        results: List[SearchResult] = []
        with DDGS() as ddgs:
            # ddgs.text yields dicts with title/href/body (key names vary slightly
            # across versions; handle both).
            for row in ddgs.text(query, region=region, safesearch=safesearch,
                                 max_results=max_results):
                results.append(SearchResult(
                    title=row.get("title", ""),
                    url=row.get("href") or row.get("url", ""),
                    snippet=row.get("body") or row.get("snippet", ""),
                    source=self.name,
                ))
        return results


# --------------------------------------------------------------------------- #
class SearxngSearchBackend(SearchBackend):
    """Self-hosted SearXNG meta-search (JSON API). Fully open source.

    Point ``base_url`` at your instance (``.../search``). Enable the JSON format
    in the instance's ``settings.yml`` (``formats: [html, json]``).
    """

    name = "searxng"

    def __init__(self, base_url: str, min_interval: float = 0.5, **_: Any) -> None:
        super().__init__(min_interval)
        self.base_url = base_url.rstrip("/")

    def search(self, query, *, max_results=8, region="us-en", safesearch="moderate"):
        self._rl.wait()
        import requests

        ss = {"off": 0, "moderate": 1, "strict": 2}.get(safesearch, 1)
        url = self.base_url if self.base_url.endswith("/search") else self.base_url + "/search"
        resp = requests.get(url, params={
            "q": query, "format": "json", "safesearch": ss,
            "language": region.split("-")[0] if "-" in region else region,
        }, timeout=20)
        resp.raise_for_status()
        rows = resp.json().get("results", [])[:max_results]
        return [SearchResult(title=r.get("title", ""), url=r.get("url", ""),
                             snippet=r.get("content", ""), source=self.name)
                for r in rows]


# --------------------------------------------------------------------------- #
class TavilySearchBackend(SearchBackend):
    """Tavily search API (hosted; needs ``TAVILY_API_KEY``). Optional."""

    name = "tavily"

    def __init__(self, api_key: str, min_interval: float = 0.5, **_: Any) -> None:
        super().__init__(min_interval)
        self.api_key = api_key

    def search(self, query, *, max_results=8, region="us-en", safesearch="moderate"):
        self._rl.wait()
        from tavily import TavilyClient

        client = TavilyClient(api_key=self.api_key)
        data = client.search(query=query, max_results=max_results)
        return [SearchResult(title=r.get("title", ""), url=r.get("url", ""),
                             snippet=r.get("content", ""), source=self.name)
                for r in data.get("results", [])]


# --------------------------------------------------------------------------- #
class HostedSearchBackend(SearchBackend):
    """Interface-only adapter for a proprietary search tool (documentation).

    A hosted tool (the repo's WebSearch, Brave Search API, Serper, Google CSE)
    is wired by passing a ``call(query, max_results) -> list[dict]`` hook whose
    dicts carry ``title``/``url``/``snippet``. Without a hook it raises, on
    purpose — guidekit's *working* defaults are the open-source backends above.
    """

    name = "hosted"

    def __init__(self, call: Optional[Callable[..., Any]] = None,
                 min_interval: float = 0.0, **_: Any) -> None:
        super().__init__(min_interval)
        self._call = call

    def search(self, query, *, max_results=8, region="us-en", safesearch="moderate"):
        if self._call is None:
            raise NotImplementedError(
                "HostedSearchBackend is an interface placeholder. Supply a "
                "`call(query, max_results)` hook that wraps your search tool, or "
                "use GUIDEKIT_SEARCH=ddgs for the open-source default."
            )
        self._rl.wait()
        rows = self._call(query, max_results) or []
        return [SearchResult(title=r.get("title", ""), url=r.get("url", ""),
                             snippet=r.get("snippet", r.get("body", "")), source=self.name)
                for r in rows]


# --------------------------------------------------------------------------- #
def from_config(cfg) -> SearchBackend:
    """Build a :class:`SearchBackend` from config; defaults to DuckDuckGo."""
    opts = dict(cfg.options.get("search", {}))
    kind = (cfg.search or "ddgs").lower()
    if kind == "searxng":
        base = opts.get("searxng_url") or opts.get("base_url")
        if not base:
            raise ValueError("GUIDEKIT_SEARCH=searxng needs SEARXNG_URL / [search].searxng_url")
        return SearxngSearchBackend(base_url=base, **_clean(opts, {"searxng_url", "base_url"}))
    if kind == "tavily":
        key = opts.get("tavily_api_key")
        if not key:
            raise ValueError("GUIDEKIT_SEARCH=tavily needs TAVILY_API_KEY / [search].tavily_api_key")
        return TavilySearchBackend(api_key=key, **_clean(opts, {"tavily_api_key"}))
    if kind == "hosted":
        return HostedSearchBackend(**_clean(opts, set()))
    return DDGSSearchBackend(**_clean(opts, {"searxng_url", "base_url", "tavily_api_key"}))


def _clean(d, drop):
    return {k: v for k, v in d.items() if k not in drop}
