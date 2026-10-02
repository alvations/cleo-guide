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

## State (session 3, 2026-10-02)
- **LIVE**: `cities/orlando.html`; 4 gates OK (sourcecheck FAILs only on 9 HELD single-source records, dropped by the build);
  npm validate + test green; card `CARD:orlando-fl` + CITIES row refreshed.
- **284 researched (131 food + 153 sights) — food share 46%** (session 2: 26%). On page: 141 sights + 6 food pinned.
- Per area (food+sights / target): CWALK 2/10 · DAK 13/22 · DHS 12/20 · DSP 11/25 · DTO 24/50 · EAST 5/10 · EPCOT 25/35 · EPIC 14/20 ·
  IDR 13/45 · IOA 10/20 · KISS 17/35 · MILLS 39/60 · MK 26/30 · SPACE 14/25 · SPRNG 17/30 · USF 10/20 · WEST 6/15 · WPK 26/45.
- Session 3 files: FOOD_S3{BAR,PARK,CITY,PR,SPACE,NORTH,IDR,LOCAL,MICH}.json, SOURCES_S3*.json, geo/_geoout_s3*.json; helper
  `_orl_addsrc.py` (append corroborating sources to an existing record); worker brief `_S3_AGENT_TASK.md` (reuse for next waves).
- Search budget: 200/200 used (hard session cap).

## In-flight wave
- (none — session 3 closed cleanly)

## Next actions (ordered) — next-wave plan (session 4)
0. **Restaurant pins are the #1 gap**: ~125 restaurants UNVERIFIED → run `tools/geocode-helper.html` (addresses in geo/_geoout_*.json).
0b. **Single-search corroborations** from `_PENDING_LEADS.md` Session 3 section (≈60 leads: Kissimmee Latin, @somehowimnotfat list,
   Space Coast, Sanford/Oviedo, Disney resort dining Sanaa/Jiko/Topolino's/'Ohana/Trader Sam's, Universal Hog's Head/Bigfire/
   Toothsome/Duff, Epic Burning Blade/Das Stakehaus) → food share >50% everywhere; then sights for IDR/DSP/CWALK/EAST/WEST.
0c. Re-corroborate Via Napoli, Takumi-Tei, Spice Road Table (Food Network + DisneyBizJournal only).
0d. Run ≥3 creator queries per wave (Disney Food Blog YouTube, Orlando Informer, TikTok) — none vetted in session 3.
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
