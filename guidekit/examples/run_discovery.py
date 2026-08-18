#!/usr/bin/env python3
"""End-to-end demo: discovery -> consolidate(shape) -> sourcecheck, no Claude.

Runs one small "city" through the guidekit stack:

    1. build the CONFIGURED providers (open-source defaults: Ollama+DDG+Nominatim)
    2. fan out discovery workers via the Orchestrator (the sub-agent pattern)
    3. normalize the discovered places into the repo's dataset shape
    4. run the REAL `tools/sourcecheck.py` gate on the result (unchanged tool)

It writes only into a throwaway temp directory — it never touches ``data/`` or
the existing ``tools/``.

Modes
-----
* default        : use the configured backends (GUIDEKIT_LLM/SEARCH/GEOCODE or
                   guidekit.toml). If those libraries/servers are not available
                   it AUTO-FALLS-BACK to the offline stubs and says so.
* ``--offline``  : force the deterministic offline stubs (no network, no model)
                   so the full wiring + the real gate run anywhere. This is what
                   makes the demo reproducible in a sandbox.
* ``--live``     : require the real backends; error out instead of falling back.

Run::

    python3 guidekit/examples/run_discovery.py            # auto (offline-safe)
    python3 guidekit/examples/run_discovery.py --offline  # deterministic
"""
from __future__ import annotations

import json
import os
import sys
import tempfile
from pathlib import Path

# make `import guidekit` work when run from the repo root or anywhere
_REPO = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(_REPO))

from guidekit import (  # noqa: E402
    build_providers, Orchestrator, Task, Pipeline, discovery_batch_schema,
    passes_sourcing,
)
from guidekit.llm import LLMBackend, LLMResult  # noqa: E402
from guidekit.search import SearchBackend, SearchResult  # noqa: E402


# --------------------------------------------------------------------------- #
#  A tiny demo "city": two areas, a couple of discovery tasks.                 #
# --------------------------------------------------------------------------- #
DEMO_SYSTEM = (
    "You are a field-guide research agent. Return only credibly-sourced places, "
    "each with a specific dish/claim and >=2 credible source keys (or a lone "
    "Michelin/James Beard). Yelp/TripAdvisor count as ZERO. Never invent an "
    "address or a coordinate. Output must match the given JSON schema."
)

DEMO_TASKS = [
    Task(
        key="food:signature",
        system=DEMO_SYSTEM,
        prompt=(
            "Find 2-3 iconic, well-sourced places for the city's signature dish. "
            "Area id 'MIS'. Tag the kitchen's own cuisine."
        ),
        queries=["best signature dish restaurant michelin bib guide"],
        schema=discovery_batch_schema(),
    ),
    Task(
        key="sights:icons",
        system=DEMO_SYSTEM,
        prompt="Find 2-3 must-see iconic sights. Area id 'DTN'.",
        queries=["top iconic must-see landmark national park service"],
        schema=discovery_batch_schema(),
    ),
]


# --------------------------------------------------------------------------- #
#  Offline stubs — deterministic, so the whole flow + the real gate run with   #
#  no network and no model. They honour the LLMBackend / SearchBackend ABCs.   #
# --------------------------------------------------------------------------- #
class StubSearch(SearchBackend):
    name = "stub"

    def search(self, query, *, max_results=8, region="us-en", safesearch="moderate"):
        return [
            SearchResult("Michelin Guide result", "https://guide.michelin.com/x",
                         "Recommended in the Michelin Guide.", self.name),
            SearchResult("Local paper feature", "https://example-paper.org/x",
                         "The local desk of record profiles the place.", self.name),
        ][:max_results]


class StubLLM(LLMBackend):
    """Returns schema-shaped sample places keyed off the task prompt.

    Stands in for a local model so the pipeline is exercised deterministically.
    The sample data deliberately includes one under-sourced place so the real
    sourcecheck gate has something to flag.
    """

    name = "stub"

    def complete(self, prompt, *, system=None, tools=None, schema=None,
                 temperature=0.2, max_tokens=2048) -> LLMResult:
        if "iconic sights" in prompt:
            places = [
                {"t": 1, "a": "DTN", "n": "Grand Central Landmark",
                 "address": "1 Main St, Demo City, ST 00001",
                 "w": "The defining civic landmark and transit hall.",
                 "sources": [["NPS", "nps.gov/demo"], ["WIKIPEDIA", "en.wikipedia.org/Demo"]]},
                {"t": 2, "a": "DTN", "n": "Old Arcade",
                 "address": "12 Market Ave, Demo City, ST 00001",
                 "w": "A restored 19th-century shopping arcade.",
                 "sources": [["ATLASOBSCURA", "atlasobscura.com/demo"], ["OFFICIAL", "arcade.org"]]},
            ]
        else:
            places = [
                {"t": 1, "a": "MIS", "n": "La Demo Taqueria", "cz": ["Mexican"],
                 "address": "2889 Mission St, Demo City, ST 00002",
                 "w": "The definitive signature burrito; no rice, seared meat.",
                 "sources": [["MICHELIN_BIB", "guide.michelin.com/demo"],
                             ["JAMESBEARD", "James Beard America's Classic 2017"]]},
                {"t": 2, "a": "MIS", "n": "Corner Yelp Special", "cz": ["Mexican"],
                 "address": "500 Demo Blvd, Demo City, ST 00002",
                 "w": "Popular taqueria (single open-check source only — should be flagged).",
                 "sources": [["YELP", "yelp.com/demo"]]},
            ]
        payload = {"places": places, "notes": "demo"}
        return LLMResult(text=json.dumps(payload), parsed=payload, backend=self.name)


# --------------------------------------------------------------------------- #
def get_providers(mode: str):
    """Return (llm, search, label). Falls back to stubs unless --live."""
    if mode == "offline":
        return StubLLM(), StubSearch(), "offline stubs (deterministic)"
    try:
        prov = build_providers()
        # a cheap reachability probe so 'auto' can fall back gracefully
        if mode != "live":
            _probe(prov)
        print(prov.describe())
        return prov.llm, prov.search, f"configured ({prov.config.llm} / {prov.config.search})"
    except Exception as exc:
        if mode == "live":
            print(f"--live requested but backends unavailable: {exc}", file=sys.stderr)
            raise
        print(f"[auto] configured backends unavailable ({exc.__class__.__name__}); "
              f"using offline stubs.\n")
        return StubLLM(), StubSearch(), "offline stubs (auto-fallback)"


def _probe(prov) -> None:
    # Import-only probe (no network): raises ImportError if a backend's library
    # isn't installed, so 'auto' mode can fall back to the offline stubs.
    prov.search.preflight()
    prov.llm.preflight()
    prov.geocode.preflight()


def normalize_to_dataset(places, out_path: Path) -> int:
    """Turn discovered place dicts into the minimal dataset shape sourcecheck reads.

    ``tools/sourcecheck.py`` only needs ``{"P":[...], "F":[...]}`` where each
    record has ``n`` and ``s`` (the source list as [[key, note], ...]). The real
    per-city ``consolidate.py`` produces the full dataset; here we emit just the
    slice the gate consumes, so the UNCHANGED gate runs on our output.
    """
    def rec(p):
        return {"n": p["n"], "s": p.get("sources", []),
                "t": p.get("t", 3), "a": p.get("a", ""), "ad": p.get("address", "")}
    P = [rec(p) for p in places if not p.get("cz")]
    F = [rec(p) for p in places if p.get("cz")]
    ds = {"P": P, "F": F}
    out_path.write_text(json.dumps(ds, indent=1, ensure_ascii=False), encoding="utf-8")
    return len(P) + len(F)


def main() -> int:
    mode = "auto"
    if "--offline" in sys.argv:
        mode = "offline"
    elif "--live" in sys.argv:
        mode = "live"

    print(f"== guidekit discovery demo ({mode}) ==\n")
    llm, search, label = get_providers(mode)
    print(f"backends: {label}\n")

    # 1+2. fan out the discovery workers (sub-agent pattern, concurrency-capped)
    orch = Orchestrator(llm, search, concurrency=int(os.environ.get("GUIDEKIT_CONCURRENCY", "1")))
    results = orch.run(DEMO_TASKS, on_result=lambda r: print(
        f"  worker {r.key}: {'ok' if r.ok else 'ERROR'} "
        f"({len(r.places)} sourced place(s), {r.search_hits} search hits)"
        + (f"  !! {r.error.splitlines()[0]}" if r.error else "")
    ))
    merged = Orchestrator.merge_places(results)
    print(f"\ndiscovered (post self-filter): {len(merged)} place(s)")
    for p in merged:
        print(f"   - {p['n']}  [{', '.join(k for k, _ in p.get('sources', []))}]")

    # note: the worker self-filters by sourcing, so the Yelp-only place is
    # already dropped here. To prove the REAL gate also catches it, we run
    # sourcecheck on the UNFILTERED discovery set below.
    unfiltered = []
    for r in results:
        for p in (r.parsed or {}).get("places", []) if isinstance(r.parsed, dict) else []:
            unfiltered.append(p)

    # 3+4. write dataset to a temp dir and run the REAL sourcecheck gate
    tmp = Path(tempfile.mkdtemp(prefix="guidekit-demo-"))
    ds_path = tmp / "demo.dataset.json"
    n = normalize_to_dataset(unfiltered or merged, ds_path)
    print(f"\nwrote {n}-place dataset -> {ds_path}")

    pipe = Pipeline()
    print(f"\n== running the repo's real gate: tools/sourcecheck.py ==")
    res = pipe.sourcecheck(str(ds_path), list_flag=True)
    print(res.stdout.strip() or res.stderr.strip())
    print(f"\nsourcecheck exit={res.returncode} -> {'PASS' if res.passed else 'FAIL (expected: demo has a Yelp-only place)'}")

    # a quick preview of the same rule computed in-process (schemas.passes_sourcing)
    flagged = [p["n"] for p in (unfiltered or merged) if not passes_sourcing(p.get("sources", []))]
    print(f"in-process preview flags: {flagged or '(none)'}")

    print(f"\ntemp artifacts in: {tmp}  (safe to delete)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
