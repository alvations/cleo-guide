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
- Scaffolded 2026-10-02 (consolidate.py, brief, AUDIT, RESUME, tools/build-orlando.py, sources.json entry).

## In-flight wave
(none yet)

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
