# Madison & Dane County (WI) — RESUME checkpoint (read first)

Resume order: **docs/RUN-2026-10-02.md → this file → AUDIT.md tail → _AGENT_BRIEF.md →
`git log --oneline -20 -- data/madison-research`**. Then:
```bash
python3 tools/density.py madison-wi                                   # discovered vs target per area
cd data/madison-research && python3 consolidate.py                     # dataset preview
flock -w 3600 /home/user/cleo-guide/.git/cleo-shared.lock python3 tools/rebuild-city.py madison-wi --build
```

## Density targets (Pittsburgh-peer ~210; parsed by tools/density.py)
- `CAP` the Isthmus & Capitol Square — ~38
- `UW` UW campus & State Street — ~30
- `EAST` east side (Willy St / Atwood / Monona / north side) — ~32
- `WEST` west side (Monroe St / Arboretum / Hilldale / Odana) — ~30
- `MVF` Middleton, Verona & Fitchburg — ~25
- `DANE` Dane County towns — ~25
- `TRIP` day trips (Spring Green, New Glarus, House on the Rock, Devil's Lake) — ~30

## Acceptance
- [ ] every area `OK` in `tools/density.py madison-wi`; every place ≥2 credible (or lone JB/NPS); merit-measured
- [ ] every place status-checked (closures kept, flagged)
- [ ] `--sourcecheck` PASS · `--geocheck` PASS · `--statuscheck` CONSISTENT · `--buildcheck` PASS · npm validate/test
- [ ] index.html CARD:madison-wi relinked live with counts; docs/CITIES.md row; AGENT-PROMPTS run-log rows

## State
- 2026-10-02 scaffold: consolidate.py (7 areas, Wisconsin cuisine taxonomy), _AGENT_BRIEF.md, AUDIT.md, this file,
  tools/build-madison.py. Keys were pre-registered (research.js, geocode-status.py, rebuild-city.py, density.py).

- **2026-10-02 W1 (food canon) TRUNCATED** — WebSearch session cap hit (200/200, shared by all agents) after ~22
  Madison searches. Kept 3 food (FOOD_CANON.json); 14 outlets (SOURCES_W1.json, registered); 1 geocode
  (geo/_geoout_w1.json, The Old Fashioned, med). 19 food + 1 sight leads with URLs in `_PENDING_LEADS.md`.
  Density: 3 / ~210. **No page built** (build asserts a geocoded tier-1 in all 7 areas).

- **2026-10-03 W2a** — 26 food + 11 sights added (40 discovered; 25 pinned + on the page). All 4 gates green.
  15 food await a pin (list in AUDIT W2a). Page `cities/madison.html` built.

- **2026-10-03 W2b** — +12 sights +1 food → 53 researched, 41 on the page; 12 UNVERIFIED queued. Card live.
  Per area (discovered): CAP 15/38 · UW 7/30 · EAST 14/32 · WEST 8/30 · MVF 2/25 · DANE 5/25 · TRIP 10/30.
- **2026-10-03 W2c** — +3 food +8 sights → 64 researched (33 food / 31 sights), 49 on the page; 15 UNVERIFIED
  (restaurants). Discovered per area: CAP 16/38 · UW 9/30 · EAST 15/32 · WEST 7+/30 · MVF 3/25 · DANE 6/25 · TRIP 8+/30.
- **2026-10-03 W3a** — +5 food +3 sights, creator pass (State Trunk Tour accepted) → 72 researched (38 food /
  34 sights), 53 on the page; 19 UNVERIFIED (restaurants). Density: CAP 18/38 · UW 10/30 · EAST 16/32 · WEST 7/30 ·
  MVF 4/25 · DANE 7/25 · TRIP 10/30.

## Next (ordered) — W3
1. **Pins first:** run `tools/geocode-helper.html` (or a fresh session) on the 15 UNVERIFIED restaurants in
   `geo/_geoout_w2_unverified.json` (Toby's, Fairchild, Fromagination, Ahan, Lao Laan-Xang, State Street Brats…).
   WebSearch rarely surfaces restaurant place pins; latlong.net POIs hit ~50% with "<name>" <street> GPS coordinates latitude.
2. Held sights needing only a pin or a 2nd source (AUDIT W2b/W2c): MMoCA, Veterans Museum (check 2026 status),
   APT, Swiss Historical Village, Trollway, Pheasant Branch, Pope Farm, Gates of Heaven, Stoughton Opera House,
   Babcock Dairy Store, New Glarus Brewing (Hilltop).
3. Food discovery for thin areas: MVF (Hubbard Ave Diner, Capital Brewery status, Craftsman curds), DANE (Fosdal
   Bakery Stoughton, Grumpy Troll, Sjölinds), TRIP (New Glarus: Glarner Stube/Puempel's; Mineral Point pasties;
   Spring Green), UW (Rathskeller, Babcock), WEST (Monroe St: Gates & Brovi, Pasture and Plenty), Hmong canon.
4. Creator pass (YouTube/TikTok Madison food creators with verifiable scale) → CREATORS_W3.json.
5. Re-verify the 17 med pins (latlong.net POIs) to exact place pins.

## W1-era plan (superseded — steps 1 & 3 done in W2; kept for history)
1. Finish `_PENDING_LEADS.md` (dish/address/status per lead) → append to FOOD_CANON.json in batches of ~10, commit each.
2. Remaining W1 canon queries (list at the bottom of `_PENDING_LEADS.md`) + creator pass → CREATORS_W1.json.
3. W2 sights per area (SIGHTS_<AREA>.json) — every area needs a geocodable tier-1 (Capitol, UW Memorial Union
   Terrace, Olbrich, Arboretum, Mustard Museum/Pheasant Branch, Cave of the Mounds/Little Norway, Taliesin).
4. Iterate `python3 tools/density.py madison-wi` until every area OK → geocode waves (geo/_geoout_*.json) →
   `flock … python3 tools/rebuild-city.py madison-wi --build` → 4 gates → relink CARD:madison-wi, CITIES.md row.

## In-flight wave
- **W4 (2026-10-03, fresh session)** — (1) pin the 19 held restaurants in geo/_geoout_w2_unverified.json →
  geo/_geoout_w4pins.json; (2) food-first expansion every area (supper clubs, fish fry, curds, brewpubs) →
  FOOD_W4a.json…, sights → SIGHTS_W4a.json…, pins → geo/_geoout_w4*.json; build + gates per batch.
- ~~W2 plan~~ — finish _PENDING_LEADS food → FOOD_W2.json; canon queries
  (Infatuation, farmers' market, Babcock, cheese shops, brats, Hmong, custard, New Glarus) → FOOD_W2*.json;
  sights per area → SIGHTS_W2.json; geocodes → geo/_geoout_w2*.json; build + gates; relink CARD:madison-wi.
