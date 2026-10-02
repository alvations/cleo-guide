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
- 208 places researched (153 sights + 55 food); 142 pinned (136 sights + 6 food) on the page (almost all sights — theme-park rides/pavilions/resorts pinned from
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
- **Session 3 (food & drink first, §2b)** — tags FOOD_S3A.. (PR/Cuban/Kissimmee), FOOD_S3B.. (Disney Springs/EPCOT/park),
  FOOD_S3C.. (bars/breweries/coffee/bakeries), FOOD_S3D.. (Winter Park/IDR/DTO). Search count tracked in AUDIT session-3 section.

## Next actions (ordered) — next-wave plan
1. **Restaurant pins (biggest gap)**: run `tools/geocode-helper.html` in a browser over the ~50 UNVERIFIED restaurants
   (addresses are in geo/_geoout_{michelin,michelinrec,vn1,jbf1,ddd1,local1,parkeats1,unieats1}.json) → `_geoout_helper1.json`.
2. **Corroborate HELD single-source** (14; list in State) — one search each or a shared round-up (Orlando Sentinel/
   Visit Orlando "things to do downtown", Atlas Obscura + Orlando Weekly oddities).
3. **Food canon still thin**: Puerto Rican Kissimmee (OW slideshow 30944523 names El Cilantrillo, Achiote, Guavate, Melao —
   find 2nd sources: Orlando Sentinel/Visit Orlando Latin guide), Cuban, Florida flavors (gator/key lime), Mills 50 Thai/
   Korean/Chinese (OW "27 essential Mills 50 restaurants"), Winter Park (Prato etc.), Kissimmee, Disney Springs (Wine Bar
   George, Raglan Road, The Boathouse — DFB + Michelin), creators pass (Disney Food Blog YouTube, Orlando Informer, TikTok).
4. **Sights by NEED**: DTO/MILLS (Thornton Park, Milk District, Audubon Park), IDR (I-Drive: ICON Park, Aquatica,
   WonderWorks, Orlando Eye), KISS (Lake Toho, Kissimmee Lakefront Park, Lake Nona), SPRNG (Sanford Riverwalk, Wekiva
   Island, Alexander/Silver Springs — pins exist in `_geoout_pinpass4.json`, need 2nd source), EAST (UCF Arboretum, Little
   Big Econ, Black Hammock), WEST, DSP/CWALK (resort icons), MK Hall of Presidents/Liberty Square.
5. Closure re-check: Willie's Pinchos (no 2026 confirmation).
6. Each wave: `flock … python3 tools/rebuild-city.py orlando-fl --build` → npm validate/test → `_orl_golive.py` → `_orl_push.sh`.

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
- [x] npm run validate + npm test green       - [x] index card live with real counts; CITIES.md row
