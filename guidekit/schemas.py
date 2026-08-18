"""Shared data contracts for guidekit.

These mirror the JSON shapes the *existing* pipeline already reads and writes so
that guidekit can feed the unchanged deterministic tools (``consolidate.py`` →
``sourcecheck.py`` → ``build-<city>.py``). Nothing here rewrites those tools; it
describes the schema they expect so an open-source LLM can produce it.

The canonical shapes, learned from the repo:

* A *research file* an agent drops in ``data/<city>-research/`` is either
    - a **sights file**: ``{"sights": [...], "food": [...], "sources": [...]}``
    - or a **food file**: a bare JSON list ``[{...}, {...}]``
* Each place record uses these keys (see ``data/san-francisco-research/*.json``)::

    {
      "t": 1,                     # tier 1/2/3, graded WITHIN area & cuisine
      "a": "MIS",                 # area id
      "n": "La Taqueria",         # name (append " — CLOSED" if permanently closed)
      "address": "2889 Mission St, San Francisco, CA 94110",
      "w": "why it matters, with the specific dish/claim",
      "k": "practical note (optional)",
      "cz": ["Mexican"],          # food only: the KITCHEN's own tradition(s)
      "closed": false,
      "g": ["ICON","VIEW"],       # optional collection ids (consolidate also derives these)
      "sources": [["MICHELIN_BIB","guide.michelin.com/... note"], ...]
    }

The ``sources`` list is the provenance spine the whole repo is built around:
each entry is ``[SOURCE_KEY, "url or quote / what it said"]``. The sourcing gate
(``tools/sourcecheck.py``) passes a place only with **>=2 credible source keys**,
or a lone institutional authority (Michelin/James Beard); Yelp/TripAdvisor/
OpenTable/Google count as ZERO.

Pydantic is used when available (validation + JSON-schema generation for
structured LLM output); if it is not installed the module degrades to plain
dataclasses so the package still imports.
"""
from __future__ import annotations

from typing import Any, Dict, List, Optional

# Keep these in lockstep with tools/sourcecheck.py and build-<city>.py.
OPEN_CHECK_ONLY = {"YELP", "TRIPADVISOR", "OPENTABLE", "GOOGLE", "GOOGLEMAPS"}
ELITE_SOLO = {"MICHELIN", "MICHELIN_BIB", "MICHELIN_STAR", "MICHELIN_GREEN", "JAMESBEARD"}


def credible_source_keys(sources: List[List[str]]) -> set:
    """The distinct CREDIBLE source keys in a record's ``sources`` list.

    Mirrors the gate logic exactly: open-verification sites are stripped out.
    """
    return {t[0] for t in sources if t and t[0] not in OPEN_CHECK_ONLY}


def passes_sourcing(sources: List[List[str]]) -> bool:
    """True iff a record would clear the multiple-sources-of-truth gate.

    >=2 credible sources, OR a single institutional authority (Michelin/JB).
    This is a *preview* of the gate so a discovery worker can self-filter; the
    real gate is still ``tools/sourcecheck.py`` run via ``pipeline.sourcecheck``.
    """
    c = credible_source_keys(sources)
    return len(c) >= 2 or bool(c & ELITE_SOLO)


try:  # ---- pydantic path (preferred: validation + JSON schema for LLMs) ----
    from pydantic import BaseModel, Field

    class PlaceRecord(BaseModel):
        """One sight or food record, in the exact shape the research files use."""

        t: int = Field(ge=1, le=3, description="Tier 1..3, graded within area & cuisine")
        a: str = Field(description="Area id, e.g. 'MIS' — must be one of the city's AREAS")
        n: str = Field(description="Place name; append ' — CLOSED' if permanently closed")
        address: str = Field(description="Full street address, fact-checked, never invented")
        w: str = Field(description="Why it matters — name the specific dish/claim")
        k: Optional[str] = Field(default=None, description="Practical note (hours, tips)")
        cz: Optional[List[str]] = Field(
            default=None,
            description="FOOD ONLY: the kitchen's own tradition(s), e.g. ['Vietnamese']. "
            "Never a single shared dish — tag by the kitchen's origin.",
        )
        closed: bool = Field(default=False, description="True if permanently closed (kept, flagged)")
        g: Optional[List[str]] = Field(default=None, description="Optional collection ids")
        sources: List[List[str]] = Field(
            description="Provenance: [[SOURCE_KEY, 'url/quote'], ...]. Need >=2 credible "
            "keys (or lone Michelin/James Beard). Yelp/TripAdvisor count as ZERO.",
            min_length=1,
        )

        def is_sourced(self) -> bool:
            return passes_sourcing(self.sources)

    class ResearchFile(BaseModel):
        """A sights research file: sights + food + the source metadata table."""

        sights: List[PlaceRecord] = Field(default_factory=list)
        food: List[PlaceRecord] = Field(default_factory=list)
        sources: List[Dict[str, Any]] = Field(
            default_factory=list,
            description="Source metadata rows: {'key','name','url',...} for chip labels",
        )

    _HAVE_PYDANTIC = True

except Exception:  # pragma: no cover - pydantic not installed in this sandbox
    from dataclasses import dataclass, field

    @dataclass
    class PlaceRecord:  # type: ignore[no-redef]
        t: int
        a: str
        n: str
        address: str
        w: str
        sources: List[List[str]]
        k: Optional[str] = None
        cz: Optional[List[str]] = None
        closed: bool = False
        g: Optional[List[str]] = None

        def is_sourced(self) -> bool:
            return passes_sourcing(self.sources)

        def model_dump(self, exclude_none: bool = True) -> Dict[str, Any]:
            d = {
                "t": self.t, "a": self.a, "n": self.n, "address": self.address,
                "w": self.w, "k": self.k, "cz": self.cz, "closed": self.closed,
                "g": self.g, "sources": self.sources,
            }
            return {k: v for k, v in d.items() if not (exclude_none and v is None)}

    @dataclass
    class ResearchFile:  # type: ignore[no-redef]
        sights: List[PlaceRecord] = field(default_factory=list)
        food: List[PlaceRecord] = field(default_factory=list)
        sources: List[Dict[str, Any]] = field(default_factory=list)

    _HAVE_PYDANTIC = False


def place_json_schema() -> Dict[str, Any]:
    """A JSON schema for one PlaceRecord, for structured LLM output.

    Uses pydantic's generator when present; otherwise a hand-written schema that
    is equivalent for the fields the models must emit.
    """
    if _HAVE_PYDANTIC:
        return PlaceRecord.model_json_schema()
    return {
        "type": "object",
        "properties": {
            "t": {"type": "integer", "minimum": 1, "maximum": 3},
            "a": {"type": "string"},
            "n": {"type": "string"},
            "address": {"type": "string"},
            "w": {"type": "string"},
            "k": {"type": "string"},
            "cz": {"type": "array", "items": {"type": "string"}},
            "closed": {"type": "boolean"},
            "g": {"type": "array", "items": {"type": "string"}},
            "sources": {
                "type": "array",
                "items": {"type": "array", "items": {"type": "string"}},
            },
        },
        "required": ["t", "a", "n", "address", "w", "sources"],
    }


def discovery_batch_schema() -> Dict[str, Any]:
    """JSON schema for a discovery worker's answer: a list of place records.

    Wrapped in an object because most structured-output engines (and the
    Anthropic tool-use path) require an object at the top level.
    """
    return {
        "type": "object",
        "properties": {
            "places": {"type": "array", "items": place_json_schema()},
            "notes": {"type": "string", "description": "exclusions and why (optional)"},
        },
        "required": ["places"],
    }
