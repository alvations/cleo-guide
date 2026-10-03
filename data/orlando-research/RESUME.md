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

## State (session 5 / wave 4, 2026-10-03)
- **LIVE**: `cities/orlando.html` — **186 sights + 35 food = 221 on the map**; **all 4 gates PASS** (sourcecheck now PASS — the 9 held
  single-source were corroborated); npm validate + test green; card, CITIES row, AGENT-PROMPTS run log refreshed.
- **471 researched (263 food + 208 sights) — food share 55.8%**.
- Per area (food+sights / target): CWALK 8+2/10 OK · DAK 9+12/22 · DHS 10+10/20 OK · DSP 19+6/25 OK · DTO 21+16/50 · EAST 8+2/10 OK ·
  EPCOT 16+19/35 OK · EPIC 9+11/20 OK · IDR 19+15/45 · IOA 8+11/20 · KISS 14+13/35 · MILLS 45+10/60 · MK 14+19/30 OK · SPACE 10+13/25 ·
  SPRNG 15+12/30 · USF 9+11/20 OK · WEST 7+8/15 OK · WPK 22+18/45.
  NEED: DTO +13 · IDR +11 · KISS +8 · MILLS +5 (sights) · WPK +5 · SPRNG +3 · SPACE +2 · DAK +1 · IOA +1.
- **250 UNVERIFIED** (mostly street-address restaurants + park counter-service): MILLS 42, DTO 22, WPK 22, IDR 18, DSP 17, KISS 16, SPRNG 14 …
  WebSearch cannot pin them (probed again W4: Mapcarta/Wikipedia return only land/park centroids) → `tools/geocode-helper.html`.
- Session 5 files: FOOD/SIGHTS/SOURCES_W4{A,B,C,L}.json, geo/_geoout_w4{a,b,c,l}.json, logs `_W4_log_W4{A,B,C,L}.md`, worker brief
  `_W4_WORKER_BRIEF.md`, names list `_orl_existing_names.txt` (regenerate from orl_dataset.json before a new wave).
- Search budget: ≈187 used this session (lead 29 + workers 158).

## In-flight wave
- (none — wave 4 closed cleanly)

## Next actions (ordered) — wave 5 plan
1. **Restaurant pins** (250 UNVERIFIED) are the gap between discovered (471) and rendered (221). NEW technique (docs/RESEARCH-LOG.md,
   Liège W4, ≈85% hit): WebSearch `allowed_domains:["restaurantguru.com","foursquare.com","wanderlog.com","viamichelin.com"]` +
   `<name> <street> Orlando coordinates`, ONE place per search; accept only when the returned address matches the record. Spend the
   W5 budget here first (biggest render win), then `tools/geocode-helper.html` for the rest. Mapcarta/Wikipedia = dead end for restaurants.
2. **Held leads** (one search each for a 2nd credible source): Tropico Mofongo, Susana's Cafe, Sol de Borinquen (KISS); Vault 5421 (IDR);
   Parea, The Osprey (WPK); Nona Blue (KISS); Fishlips, Rusty's (SPACE); Neighbors Taqueria, Mister O1; Walala (Michelin Rec. — decide area).
3. **NEED areas**: DTO +13 (Wall Street Plaza bars, Thornton Park cafés, Parramore, Church St; sights: Orlando City Hall has a coord),
   IDR +11 (Restaurant Row/Sand Lake — Michelin Rec., Dr Phillips bars), KISS +8 (Puerto Rican canon via Sentinel/Spectrum 13),
   MILLS +5 SIGHTS, WPK +5, SPRNG +3, SPACE +2, DAK +1, IOA +1.
4. **Re-checks:** Tennessee Truffle, Willie's Pinchos, Canvas, Nikki's Place, La Cava del Tequila, The Smiling Bison (undated open status);
   Jurassic Park River Adventure (reopens 2026-11-20), Finnegan's (late 2026); Cocoa Beach Pier needs a press 2nd source.
5. **Creator channel**: 4 waves of creator queries found no vetted Orlando YouTube/TikTok creator — try named creators directly
   (e.g. "Orlando foodie" YouTube channel with subscriber count) rather than generic queries.
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
- [ ] every area at target (density.py OK)  - [x] --sourcecheck/--geocheck/--statuscheck/--buildcheck green
- [x] npm run validate + npm test green       - [x] index card live with real counts; CITIES.md row
