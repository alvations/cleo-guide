# Harrisburg · York · Lancaster & Amish Country — RESUME checkpoint (read first)

Resume order: **docs/RUN-2026-10-02.md → this file → AUDIT.md tail → _AGENT_BRIEF.md →
`git log --oneline -20 -- data/harrisburg-research`**. Then:
```bash
python3 tools/density.py harrisburg-pa                       # discovered per area vs targets below
flock -w 3600 /home/user/cleo-guide/.git/cleo-shared.lock python3 tools/rebuild-city.py harrisburg-pa --build
```

## Density targets (Pittsburgh-peer ~210 for a metro; parsed by tools/density.py)
- `HBG` Harrisburg & the West Shore — ~38
- `HER` Hershey & Derry Township — ~24
- `CAR` Carlisle & the Cumberland Valley — ~20
- `YORK` York & York County — ~34
- `LAN` Lancaster city — ~38
- `AMISH` Lancaster County Amish country — ~40
- `GBG` Gettysburg & Adams County — ~22
Total ~216.

## Acceptance
- [ ] Every area OK in density.py; every food card names a dish; ≥2 credible per place.
- [ ] Every place status-checked (closures kept-flagged).
- [ ] `--sourcecheck` PASS · `--geocheck` PASS · `--statuscheck` CONSISTENT · `--buildcheck` PASS · npm validate/test.
- [ ] index.html card relinked live with counts; docs/CITIES.md row.

## State
- 2026-10-02 scaffold: consolidate.py (7 areas), tools/build-harrisburg.py (State College clone, centre derived
  from pins), _AGENT_BRIEF.md, AUDIT.md, RESUME.md, SOURCES_HBG.json; `data/sources.json` cities["harrisburg-pa"] registered (29 outlets).

## In-flight wave
- **W1 food canon — BLOCKED before it started (2026-10-02).** The session's shared WebSearch budget was
  already exhausted (200/200) when this agent began discovery: 1 search returned results, every later call
  returned "session has used its web search budget". No places have been written — nothing was invented.
  On relaunch (fresh budget): run W1 exactly as planned below, writing to `FOOD_CANON.json`.
- W1 plan (tag `CANON`, file `FOOD_CANON.json`): shoofly pie; whoopie pie; PA Dutch chicken pot pie;
  smorgasbords (Shady Maple, Hershey Farm, Miller's, Good 'N Plenty — measure, don't pad); pretzels (Julius
  Sturgis, Tom Sturgis, Hanover/Snyder's); markets (Lancaster Central Market, Broad Street Market, York Central
  Market, Root's, Green Dragon, Bird-in-Hand Farmers Market); Hershey chocolate; Seltzer's Lebanon bologna.
- Leads from the one search that ran (NOT yet ≥2-credible — re-verify before adding): Bird-in-Hand Bakery & Cafe
  (shoofly pie; Al Roker "Family Style" episode; Frommer's "Local Favorites in Lancaster County"); Dutch Haven,
  Ronks ("the place that made shoo-fly pie famous").
- Then W2 sights (Wikipedia + NPS/PHMC/DCNR + CVBs, all 7 areas), W3 Harrisburg/York food, W4 Lancaster city
  food, W5 creators/viral (Peter Santenello Amish videos are in nationalCreators), W6 geocode, W7 build.

## Files
- `FOOD_*.json` / `SIGHTS_*.json` — research records by wave tag. `geo/_geoout_*.json` — geocode results.
- `SOURCES_*.json` outlets; `CREATORS_*.json` creators.
