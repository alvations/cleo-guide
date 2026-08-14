# San Francisco & Peninsula — audit trail

Follows `docs/PIPELINE.md`: discover sources → extract places → fact-check → re-rank → location-verify →
build. Every stage recorded here so any agent can reproduce or continue. Mirrors the SV audit.

## Stage 0 — Scaffold  (status: DONE 2026-08-14)
Region = SF proper + northern Peninsula to San Mateo + SFO corridor (bridges the SV guide at Menlo
Park/Redwood City). Built: `consolidate.py` (9 areas DTN/NECN/NOB/NW/AVE/MIS/HAI/SE/PEN; SF cuisine
taxonomy incl. Cantonese/dim sum, Mission Mexican, Burmese, seafood, North Beach Italian, third-wave
coffee; collections incl. WATER waterfront/piers); `tools/build-sanfrancisco.py` (clone of the SV
build — same GATE 1 sources-of-truth + GATE 2 geocode drops); `data/sources.json` san-francisco-ca
entry with 11 credible SF outlets (Michelin, James Beard, Infatuation, KQED, SF Standard, Hoodline,
Mission Local, 7x7, The Bold Italic, Time Out, Atlas Obscura); `_AGENT_BRIEF.md`; research.js
PAGE_FOR + DATASET_FOR; geocodes.json empty entry; index.html "being built" card.

## Stage 1 — Source discovery  (status: registry seeded)
Credible palette registered (see sources.json). Crawler-BLOCKED (cite only if a title surfaces):
EATERSF, SFCHRON, THRILLIST. Rule (same as SV): Yelp/TripAdvisor = open-verification only, never the
sole recommender; exhaust the credible palette + vetted creators first.

## Stage 2 — Place extraction  (status: PENDING — waves #30 food, #31 sights)
Signature-first food canon + comprehensive sights, each with a full address for geocoding. Log counts
+ exclusions per wave here.

## Stage 3 — Fact-check (open/closed + notability)  ·  Stage 4 — Re-rank  ·  Stage 5 — Location-verify
·  Stage 6 — Build & gate  — all PENDING. Gates (enforced in code): `--sourcecheck` (≥2 credible or
lone Michelin/JB), `--geocheck`, `--statuscheck`, jsdom render-verify.
