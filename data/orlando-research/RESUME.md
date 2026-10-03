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

## State (session 4 / wave 3, 2026-10-03)
- **LIVE**: `cities/orlando.html` — **157 sights + 35 food on the map**; 4 gates OK (sourcecheck FAILs only on 9 HELD single-source,
  dropped by the build); npm validate + test green; card `CARD:orlando-fl`, CITIES row, AGENT-PROMPTS run-log row refreshed.
- **390 researched (213 food + 177 sights) — food share 54.6%** (session 3: 46%).
- Per area (food+sights / target): CWALK 5+2/10 · DAK 8+11/22 · DHS 8+9/20 · DSP 18+6/25 · DTO 17+13/50 · EAST 7+2/10 · EPCOT 11+19/35 ·
  EPIC 8+11/20 · IDR 13+11/45 · IOA 5+8/20 · KISS 9+11/35 · MILLS 42+6/60 · MK 14+19/30 OK · SPACE 5+13/25 · SPRNG 14+9/30 · USF 6+8/20 ·
  WEST 5+5/15 · WPK 18+14/45.  NEED: IDR +21 · DTO +20 · KISS +15 · WPK +13 · MILLS +12 · IOA +7 · SPACE +7 · SPRNG +7 · USF +6 ·
  EPCOT +5 · WEST +5 · CWALK/DAK/DHS +3 · DSP/EAST/EPIC +1.
- Food-share per area below 50%: DAK, DHS, DTO(57%✓)… check density.py — sights-heavy: EPCOT 37%, EPIC 42%, IOA 38%, USF 43%, KISS 45%,
  SPACE 28%, WEST 50%, EAST 78%✓; MILLS is food-heavy (88%) → its remaining +12 should be sights (Audubon Park, Ivanhoe Village, Lake Druid).
- ~190 UNVERIFIED (mostly street-address restaurants + park counter-service): addresses in geo/_geoout_*.json → geocode-helper.
- Session 4 files: FOOD/SIGHTS/SOURCES_W3{A,B,C,D,L}.json, CREATORS_W3{A,D}.json, geo/_geoout_w3{a,b,c,d,l,pin,bldg}.json;
  helpers `_orl_pin.py` (lead pin writer; copies status from research geo), `_orl_lib.py`, `_orl_addsrc.py`, `_orl_golive.py`, `_orl_push.sh`.
- Search budget: ≈176 used this session (lead 29 + workers 147).

## In-flight wave
- **W4 (session 5, 2026-10-03)**: step 1 corroborate-or-drop the 9 single-source (Randall Knife Museum, Entertainment McDonald's, Global Convergence, Dr. Phillips House, Osceola Courthouse, Gaylord Palms, Race Through NY, Cocoa Beach Pier, Space View Park) via `_orl_addsrc.py`; step 2 pin held restaurants → `geo/_geoout_w4pin.json`; step 3 NEED areas → `FOOD_W4*/SIGHTS_W4*`. Step 1 DONE (commit c127796, sourcecheck PASS). Step 2: WebSearch pin probe = dead end (logged). Step 3 running: workers W4A (IDR+KISS), W4B (DTO+MILLS+WPK), W4C (parks+SPACE/SPRNG/WEST/EAST) per `_W4_WORKER_BRIEF.md`; logs `_W4_log_<TAG>.md`.

## Next actions (ordered) — wave 4 plan
1. **Pins for restaurants** remain the gap (35 of 213 food pinned): run `tools/geocode-helper.html` over the UNVERIFIED list
   (`python3 tools/geocode-status.py` → docs/GEOCODE-BACKLOG.md, Orlando section). WebSearch only works for venues with their own
   Wikipedia article (`allowed_domains:["en.wikipedia.org"]`, 3 names per query with "coordinates °N °W") and for building-level
   pins (restaurants inside a pavilion/resort that already has a Wikipedia coord). Never land/district/lake/city points.
2. **Corroborate held single-source** (list in AUDIT.md session 4) — one search per 2–3 names (cheapest density wins: Restaurant Row,
   Winter Park, Kissimmee Latin, Sanford, Space Coast).
3. **IDR +21 / DTO +20 / KISS +15** — IDR: Restaurant Row steakhouses & Sand Lake Michelin Recommended, Volcano Bay? (CWALK),
   Madame Tussauds/SEA LIFE, Museum of Illusions, SeaWorld rides (Mako, Manta, Ice Breaker — Wikipedia coords exist), Gatorland? (check);
   DTO: Lake Ivanhoe, Thornton Park, Wall Street Plaza, Cafe Linger, The Wellborn, Ember, Bites & Bubbles, Parramore; KISS: Lake Toho /
   Kissimmee Lakefront Park, Forever Florida, Reptile World, Puerto Rican canon (needs a credible 2nd outlet — try Orlando Sentinel /
   Experience Kissimmee + Visit Florida).
4. **Park sights to balance food** (EPCOT/EPIC/IOA/USF food<50%): add park food first — Connections Eatery, La Cava del Tequila, Schwab's,
   Duff Brewery, Mel's (needs 2nd), TODAY Cafe (needs 2nd); IOA Thunder Falls replacement when open (2027).
5. **Re-checks:** Finnegan's (reopen late 2026?), Shin Jung (post-fire), Tennessee Truffle, Hanamizuki, Willie's Pinchos.
6. Each wave: `flock … python3 tools/rebuild-city.py orlando-fl --build` → 4 gates → npm validate/test → `_orl_golive.py` → `_orl_push.sh`.

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
