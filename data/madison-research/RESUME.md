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

## Next (ordered) — needs a fresh WebSearch budget (raise CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION or relaunch)
1. Finish `_PENDING_LEADS.md` (dish/address/status per lead) → append to FOOD_CANON.json in batches of ~10, commit each.
2. Remaining W1 canon queries (list at the bottom of `_PENDING_LEADS.md`) + creator pass → CREATORS_W1.json.
3. W2 sights per area (SIGHTS_<AREA>.json) — every area needs a geocodable tier-1 (Capitol, UW Memorial Union
   Terrace, Olbrich, Arboretum, Mustard Museum/Pheasant Branch, Cave of the Mounds/Little Norway, Taliesin).
4. Iterate `python3 tools/density.py madison-wi` until every area OK → geocode waves (geo/_geoout_*.json) →
   `flock … python3 tools/rebuild-city.py madison-wi --build` → 4 gates → relink CARD:madison-wi, CITIES.md row.

## In-flight wave
- **W2 (2026-10-03, fresh session budget)** — finish _PENDING_LEADS food → FOOD_W2.json; canon queries
  (Infatuation, farmers' market, Babcock, cheese shops, brats, Hmong, custard, New Glarus) → FOOD_W2*.json;
  sights per area → SIGHTS_W2.json; geocodes → geo/_geoout_w2*.json; build + gates; relink CARD:madison-wi.
