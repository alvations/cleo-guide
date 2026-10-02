# Orlando & Central Florida — RESUME (checkpoint; read this first to continue)

Key `orlando-fl` · research dir `data/orlando-research/` · dataset `data/orlando.dataset.json` ·
page `cities/orlando.html` · build `tools/build-orlando.py` · brief `_AGENT_BRIEF.md` · ledger `AUDIT.md`.
Run protocol: `docs/RUN-2026-10-02.md` (shared lock, commit+push every batch, §2a source mix, §5b resumability).

## Density targets (parsed by `python3 tools/density.py orlando-fl`) — total ~517 (NYC density)
- `DTO` Downtown Orlando & Thornton Park ~50
- `MILLS` Mills 50 / Milk District / Audubon Park / SoDo ~60
- `WPK` Winter Park / Baldwin Park / Maitland ~45
- `IDR` International Drive / Dr Phillips / Restaurant Row ~45
- `MK` Magic Kingdom ~30
- `EPCOT` EPCOT ~35
- `DHS` Hollywood Studios ~20
- `DAK` Animal Kingdom ~22
- `DSP` Disney Springs & resorts ~25
- `USF` Universal Studios Florida ~20
- `IOA` Islands of Adventure ~20
- `EPIC` Epic Universe ~20
- `CWALK` CityWalk & Universal resorts ~10
- `KISS` Kissimmee / Celebration / Lake Nona ~35
- `WEST` Winter Garden / Windermere ~15
- `SPRNG` Sanford / Lake Mary / Mount Dora / springs ~30
- `EAST` East Orlando / UCF / Oviedo ~10
- `SPACE` Space Coast ~25

## State
- Scaffolded 2026-10-02 (consolidate.py, brief, AUDIT, RESUME, tools/build-orlando.py, sources.json entry
  `orlando-fl` registered from SOURCES_CORE.json — 22 outlets with `credible` rationale).
- **0 places discovered (0 / ~517).** Wave 1 (Michelin opening move) was cut off after 8 WebSearch calls:
  the session-wide WebSearch cap (`200 of 200`, shared by all ~16 concurrent agents) was exhausted. Retried
  once — hard block ("ask the user to raise CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION"), not a rate limit.
- Leads gathered so far are in `_PENDING_LEADS.md` (Michelin 2026 stars/Bibs/new Recommended with source
  URLs; Space Mountain coordinate). Nothing was promoted to a research record without a sourced address +
  named dish, so nothing builds yet; `cities/orlando.html` is NOT built and the index card stays "being built".

## In-flight wave
- **W1 MICHELIN (food opening move)** — half-done. Remaining queries: full 2026 Orlando Recommended list;
  address + one named dish for each starred/Bib place; Natsu/Capa/Papa Llama status. Then write
  `FOOD_MICHELIN.json` (MICHELIN + a 2nd source where possible), then W2 Mills 50 Vietnamese.

## Next actions (ordered)
1. Discovery waves area by area (food canon first: Mills 50 Vietnamese, Michelin, Puerto Rican Kissimmee,
   Cuban, Florida flavors, park icons; then sights per park from OFFICIAL + Wikipedia + press/creators).
2. Geocode each wave → `geo/_geoout_<tag>.json` (Wikipedia/latitude.to coords for attractions; google
   `!3d!4d`/Apple `coordinate=` for restaurants; else UNVERIFIED).
3. `flock -w 3600 /home/user/cleo-guide/.git/cleo-shared.lock python3 tools/rebuild-city.py orlando-fl --build`
4. `python3 tools/density.py orlando-fl` → iterate on NEED +N areas.

## Commands
```bash
python3 tools/density.py orlando-fl
flock -w 3600 /home/user/cleo-guide/.git/cleo-shared.lock python3 tools/rebuild-city.py orlando-fl --build
```

## Files
- `FOOD_<tag>.json` (list) · `SIGHTS_<tag>.json` ({sights,sources}) · `SOURCES_<tag>.json` ({outlets}) ·
  `CREATORS_<tag>.json` · `geo/_geoout_<tag>.json`.

## Acceptance checklist
- [ ] every area at target (density.py OK)  - [ ] --sourcecheck/--geocheck/--statuscheck/--buildcheck green
- [ ] npm run validate + npm test green       - [ ] index card live with real counts; CITIES.md row
