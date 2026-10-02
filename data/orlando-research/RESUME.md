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

## State (session 2, 2026-10-02)
- **LIVE**: `cities/orlando.html` built, 4 gates green (sourcecheck FAILs only on HELD single-source records, which the
  build drops by design), `npm run validate` + `npm test` green; index card `CARD:orlando-fl` live; CITIES.md row LIVE.
- ~210 places researched; ~140 pinned on the page (almost all sights — theme-park rides/pavilions/resorts pinned from
  Wikipedia/Wikidata/Coasterpedia; Atlas Obscura; city museums/springs/Space Coast). Restaurants: ~60 researched, few
  pinned — WebSearch never surfaces restaurant place-pin decimals (Google/Apple/mapcarta tested) → UNVERIFIED with
  address for `tools/geocode-helper.html`; only Wikipedia-article restaurants get pins (pin-pass agent `foodpins1`).
- Search budget: ≈ 75 main + ≈ 70 by pin-pass agents (parkpins1-3, pinpass4, foodpins1) ≈ 145 used this session.
- Files: FOOD_{MICHELIN,MICHELINREC,VN1,PARKEATS1,JBF1,DDD1,LOCAL1,UNIEATS1}.json · SIGHTS_{PARKS1-4,EPIC2,RESORTS1,
  SEAWORLD1,CITY1-2,DTO1,NATURE1-2,SPACE1-2,KISS1,WEST1}.json · SOURCES_W2..W15.json · geo/_geoout_*.json (agent pin
  files: parkpins1-3, pinpass4, foodpins1). Helpers: `_orl_lib.py` (append records), `_orl_push.sh` (commit+push),
  `_orl_golive.py` (refresh card + CITIES row from the built page).
- HELD single-source (need a 2nd credible source): Disney Springs, Race Through New York, CityWalk, Kia Center, Inter&Co
  Stadium, Greenwood Cemetery, Dr. Phillips House, Osceola County Courthouse, Gaylord Palms, Central Florida Zoo,
  Cocoa Beach Pier (also UNVERIFIED), Lake Nona Sculpture Garden, Randall Knife Museum, Epic McD, Global Convergence.
- Closures flagged: Dinosaur (DAK, Feb 2026), Ethos Vegan Kitchen (2024). Seen but not added: Fast & Furious –
  Supercharged (closed Aug 2026), Wet 'n Wild (2017), Skeletons museum, Exploration Tower (not reopened Jan 2026).
- Status to re-check: Willie's Pinchos (DDD 2017; no 2026 confirmation found).

## In-flight wave
- W8 FOOD PINS: pin-pass agent writing `geo/_geoout_foodpins1.json` (Wikipedia/Wikidata coords for ~45 WDW/Universal/
  Orlando restaurants). On relaunch: if the file exists, write research records for its names (Disney ones: DFB
  'eaten at every WDW restaurant' + Wikipedia), then rebuild.

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
