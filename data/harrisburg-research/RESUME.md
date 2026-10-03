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
- **2026-10-03 (one session, ~185 searches): W1–W6 done, LIVE.** 120 discovered (38 food + 82 sights, all ≥2
  credible); 55 pinned and rendered on `cities/harrisburg.html`; all 4 gates green; npm validate/test pass;
  index.html card LIVE; docs/CITIES.md row added; 54 new outlets registered with rationale (SOURCES_W1.json).
- Density (discovered / target): AMISH 30/40 · CAR 10/20 · GBG 17/22 · HBG 16/38 · HER 16/24 · LAN 15/38 · YORK 16/34.
- Pinned on page: 55 of 120 — 65 UNVERIFIED (mostly restaurants; WebSearch rarely surfaces restaurant place-pins).

## In-flight wave
- **W7 (2026-10-03, food & drink first)** — writing `FOOD_W7.json` + `geo/_geoout_w7.json` + `SOURCES_W7.json`/`CREATORS_W7.json`.
  Goal: food ≥ sights in every area (need ≥ +44 food: HBG+10 HER+8 GBG+7 YORK+6 AMISH+6 CAR+4 LAN+3, more for LAN/HBG density).
  Pin via WebSearch allowed_domains maps.apple.com. If cut off: run density.py, continue from what's in FOOD_W7.json.
- Previous NEXT list (still valid): NEXT (ordered):
  1. **Helper geocode** of the 65 UNVERIFIED (docs/GEOCODE-BACKLOG.md → tools/geocode-helper.html), confirming the
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
