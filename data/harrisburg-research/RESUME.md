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
- 2026-10-02 scaffold (consolidate.py, build-harrisburg.py, brief, 29-outlet palette). W1 blocked by budget.
- **2026-10-03 W1+W2 (relaunch):** 25 food + 37 sights = 62 discovered (all ≥2 credible); 31 pinned; page
  `cities/harrisburg.html` BUILT, all 4 gates green, npm validate/test pass. Card on index.html still "being built"
  (only 31 pins — relink live once ~100 pins). 43 new outlets registered with rationale (SOURCES_W1.json).
- Density (discovered): AMISH 18/40 · CAR 6/20 · GBG 10/22 · HBG 8/38 · HER 7/24 · LAN 6/38 · YORK 7/34.

## In-flight wave
- none. NEXT (ordered): (1) W3 Harrisburg/York food (dish- and outlet-specific queries — PennLive/TheBurg/YDR/FOX43
  "best <dish>"; Bhutanese/Nepali momo; York City Pretzel Co; Central Family; Cafe 1500…), (2) W4 Lancaster city food
  + sights (LancasterHistory, Demuth Museum, Lancaster Science Factory, Penn Square/Soldiers & Sailors, Rock Ford),
  (3) AMISH sights (Sight & Sound needs 2nd source, Intercourse, Bird-in-Hand village, Lititz, Mount Joy Bube's,
  Columbia National Watch & Clock Museum, Marietta, Dutch Wonderland), (4) HER/CAR/GBG fill, (5) W5 creators,
  (6) helper geocode of `geo/_geoout_w6pending.json` (31 UNVERIFIED), (7) go live on index.html card.
- Held/single-source list + rejected sources: see AUDIT.md 2026-10-03 section.

## Files
- `FOOD_*.json` / `SIGHTS_*.json` — research records by wave tag. `geo/_geoout_*.json` — geocode results.
- `SOURCES_*.json` outlets; `CREATORS_*.json` creators.
