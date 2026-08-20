# Washington DC — RESUME checkpoint (read first)

Resume order: **this file → AUDIT.md → _AGENT_BRIEF.md → tasks**. Then
`cd data/washington-dc-research && python3 consolidate.py` and `cp dc_dataset.json ../washingtondc.dataset.json`.

## State @ 2026-08-18 — scaffolded (superseded, see below)
- Infra complete: consolidate.py, build-washingtondc.py (compiles), sources.json (20 sources),
  geocodes.json entry, geo/_merge_geo.py, research.js + geocode-status.py registration, brief/audit.
- **No research files yet** — discovery agents next (food canon, Michelin/JB fine dining, sights + NoVA).

## Next actions (pipeline order — PIPELINE.md)
1. Discovery waves → sourced research JSONs in this dir (each place ≥2 credible + merit-measured + open).
2. `consolidate.py` → `dc_dataset.json` → copy to `../washingtondc.dataset.json`.
3. `node tools/research.js --sourcecheck washington-dc` must PASS.
4. Geocode all candidates into `geocodes.json` (place-pins only; UNVERIFIED if unresolvable) via
   `geo/_geoout_*.json` + `geo/_merge_geo.py`; `--geocheck` + `--statuscheck`.
5. `python3 tools/build-washingtondc.py` → `--buildcheck` (map must centre on DC, not a cloned city).
6. Relink index.html card; update CITIES.md + GEOCODE-BACKLOG.md; append AUDIT.md.

## Acceptance
- Every place ≥2 credible (or lone Michelin/JB/NPS/Smithsonian); no Yelp-only; every place merit-measured.
- Every area (11) has ≥1 tier-1 that survives the gates (build asserts this).
- buildcheck PASS (centre + labels inside DC pins). validate/test green.

---
## State @ 2026-08-20 — LIVE
- Page **live at 92 pins** (61 sights + 31 food) of 118 candidates. All gates PASS (sourcecheck/geocheck/
  statuscheck/buildcheck); validate/test green. index.html card is live.
- **26 UNVERIFIED restaurant pins** → browser geocode-helper (docs/GEOCODE-BACKLOG.md) will grow the page
  toward 118. 3 closed Michelin rooms (Cranes/Kinship/Tail Up Goat) held, gate-dropped (null coords).
- NEXT (optional): helper-geocode the 26 UNVERIFIED restaurants; upgrade the 12 med pins to exact place-pins.

---
## State @ 2026-08-20 — NoVA corridor expanded
- Page **116 pins** (75 sights + 41 food) of **167 candidates**; **12 areas** incl. new FAIRFAX.
  All gates PASS. Sources expanded to 39. 4 vetted NoVA creators registered.
- **51 UNVERIFIED** restaurant pins → browser geocode-helper (Eden Center stalls, NoVA restaurants,
  Dark Star Park). Aracosia, Elephant Jumps, Truong Tien among them.
- NEXT (optional): helper-geocode the 51 UNVERIFIED; upgrade 21 med pins to exact place-pins.
