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
- **2026-10-03 (one session, ~170 searches): W1–W5 done, LIVE.** 111 discovered (37 food + 74 sights, all ≥2
  credible); 49 pinned and rendered on `cities/harrisburg.html`; all 4 gates green; npm validate/test pass;
  index.html card LIVE; docs/CITIES.md row added; 54 new outlets registered with rationale (SOURCES_W1.json).
- Density (discovered / target): AMISH 29/40 · CAR 10/20 · GBG 17/22 · HBG 14/38 · HER 15/24 · LAN 13/38 · YORK 13/34.
- Pinned on page: 49 of 111 — 62 UNVERIFIED (mostly restaurants; WebSearch rarely surfaces restaurant place-pins).

## In-flight wave
- none. NEXT (ordered):
  1. **Helper geocode** of the 62 UNVERIFIED (docs/GEOCODE-BACKLOG.md → tools/geocode-helper.html), confirming the
     discovery-stage addresses listed in AUDIT.md 2026-10-03 W3–W5 section. Biggest single lift for the map.
  2. **HBG food** (2/~19): outlet-specific — TheBurg, PennLive "best of", Harrisburg Magazine Simply the Best;
     Broad Street Market stands; Bhutanese/Nepali (Mount Everest, Momo Hunt — need 2 sources); Progress Grill,
     Greystone Public House (PA Eats + 1 more); Jackson House (needs non-SEO source).
  3. **LAN food + sights** (13/38): Belvedere Inn (2nd outlet), Norbu, Awash, Long's Horseradish/Central Market
     stands, Lancaster Museum of Art, Long's Park, Lancaster Cathedral; LNP "Best of Lancaster"; Fly Magazine.
  4. **YORK** (13/34): YDR/YorkMix/York Dispatch lists; Hanover (Hanover Shoe Farms 2nd source); Wrightsville
     (Zimmerman Center); Indian Steps Museum; York County History Center Smalls campus museum; Roburrito's.
  5. HER/CAR/AMISH fill (Hotel Hershey 2nd source; Colonel Denning; Hammond's Pretzel 2nd source; Good 'N Plenty
     status; Intercourse Pretzel Factory; Countryside Road Stand; Strasburg Creamery; Choo Choo Barn).
  6. Creators: find a Lancaster-place-naming piece for Santenello; verify Uriot scale.
- Held/single-source + rejected sources: AUDIT.md 2026-10-03 sections.

## Files
- `FOOD_*.json` / `SIGHTS_*.json` — research records by wave tag. `geo/_geoout_*.json` — geocode results.
- `SOURCES_*.json` outlets; `CREATORS_*.json` creators.
