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

## In-flight wave
- **W1 food canon** (tag `CANON`) → `FOOD_CANON.json`, `SOURCES_W1.json`, `CREATORS_W1.json`. Queries: curds,
  fish fry, supper clubs/old fashioned, farmers' market, brats, Babcock, kringle, Hmong/Lao, New Glarus, JB honorees,
  Infatuation Madison, Madison Mag/Isthmus best-of, creators (YouTube/TikTok Madison food). Then W2 sights per area.
