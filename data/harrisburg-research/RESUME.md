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
- **2026-10-03 relaunch (fresh WebSearch budget).** W1 food canon + W2 sights running together. Method: sights use ONE
  combined search ("<place> coordinates wikipedia") that yields ≥2 sources + the Wikipedia infobox pin; food uses a
  discovery search, then a separate geocode wave (W6). Files: `FOOD_CANON.json`, `SIGHTS_W2.json`, `geo/_geoout_w2.json`.
  Helpers: `_hbg_add.py <FILE> < records.json` (dedup append), `_hbg_geo.py <geoout> < geo.json`.
- Held single-source / status-unclear (re-check before adding): Good 'N Plenty (Smoketown — conflicting closure
  signal), Hammond's Pretzel Bakery (only Discover Lancaster), Strasburg Creamery, Katie's Kitchen (Amish America only),
  Hershey Pantry + Chocolate Avenue Grill (Tasting Table only), Sight & Sound Theatres (Wikipedia only), Hershey's
  Chocolate World (Wikipedia only), Hershey Gardens (no pin yet), Belvedere Inn / C'est La Vie / Cabalar / Shot & Bottle
  (Lancaster County Magazine Best of 2025 only).
- Pins still needed for: Strasburg Rail Road, Little Round Top, David Wills House (+status — museum operation unclear),
  Kitchen Kettle Village, Amish Farm and House, Hunsecker's Mill Covered Bridge, and every FOOD_CANON record.

## Files
- `FOOD_*.json` / `SIGHTS_*.json` — research records by wave tag. `geo/_geoout_*.json` — geocode results.
- `SOURCES_*.json` outlets; `CREATORS_*.json` creators.
