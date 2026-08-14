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

## Stage 2 — Place extraction  (status: IN PROGRESS)
Signature-first food canon + comprehensive sights, each with a full address for geocoding.

**Wave 1 (2026-08-14) — 86 places, `--sourcecheck` PASS 86/86 (0 Yelp-only, 0 single-source).** The
agents followed `_AGENT_BRIEF.md` from the start, so SF sourcing is clean out of the gate (no SV-style
re-sourcing backlog).
- `FOOD_SIGNATURE.json` (18): Mission-burrito belt, old-SF cioppino/crab, Hog Island oysters,
  Boudin/Tartine sourdough, Buena Vista Irish coffee, fortune-cookie factory, It's-It. Closed & flagged:
  The Mill (June 2026 fire).
- `FOOD_ASIAN.json` (22): Cantonese/dim sum (Mister Jiu's ★, Yank Sing Bib, R&G…), Sichuan (Z&Y Bib),
  Vietnamese, Burmese (Mandalay JB), JP/KR/Thai/Filipino (Rintaro Bib, Abacá ★). Excluded closed:
  HK Lounge II (burned 2019) → successor HK Lounge Bistro used; Turtle Tower moved to FiDi.
- `SIGHTS_ICONS.json` (18): Golden Gate, Alcatraz, cable cars, Ferry Building, Coit Tower, Lombard,
  Painted Ladies, Transamerica, Musée Mécanique, Fort Point, Maritime NHP. Caveats: Hyde St Pier
  rebuild, cable-car rehab shuttles.
- `SIGHTS_MUSEUMS_PARKS.json` (28): GG Park museums/gardens, SFMOMA, Exploratorium, Presidio, Mission
  murals, Lands End, Castro Theatre (reopened Feb 2026). Closed & flagged: Contemporary Jewish Museum.
  Excluded closed: Museum of Ice Cream, Cartoon Art Museum.

**Wave 2 (in progress):** North Beach Italian + Cal-cuisine/Michelin fine dining; third-wave coffee +
cocktail bars + viral; the Peninsula/SFO corridor (Daly City Filipino, Millbrae dim sum, Burlingame,
San Mateo + SFO Aviation Museum, Sign Hill, San Bruno Mtn, Pacifica). Fills the PEN area (0 in wave 1)
and the Italian/coffee/bars cuisine gaps. Append results here.

## Stage 3 — Fact-check (open/closed + notability)  ·  Stage 4 — Re-rank  ·  Stage 5 — Location-verify
·  Stage 6 — Build & gate  — all PENDING. Gates (enforced in code): `--sourcecheck` (≥2 credible or
lone Michelin/JB), `--geocheck`, `--statuscheck`, jsdom render-verify.
