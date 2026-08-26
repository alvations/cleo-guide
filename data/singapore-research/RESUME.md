# Singapore & Southeast Asia — RESUME checkpoint (read first)

Resume order: **this file → AUDIT.md → _AGENT_BRIEF.md → tasks**. Then
`cd data/singapore-research && python3 consolidate.py` and (from repo root)
`python3 tools/rebuild-city.py singapore --build`.

## Acceptance (same rigor as the US cities)
- [ ] Depth on Toa Payoh (the opening view) + comparable coverage across SG clusters and each SEA country.
- [ ] Every place fact-checked open/closed (closures kept-flagged); every food card names a specific dish.
- [ ] `node tools/research.js --sourcecheck singapore` = PASS (≥2 credible, or lone Michelin/UNESCO; Yelp=0).
- [ ] `--geocheck` PASS · `--statuscheck` CONSISTENT · **`--buildcheck` PASS** · render-verify in LIGHT + DARK.
- [ ] Pastel theme correct in both modes (no dark-only leftovers); map opens on Toa Payoh.
- [ ] index.html card relinked to the live page; docs/CITIES.md updated.

## State
- **2026-08-26 LIVE @ 163 pins** (74 sights + 89 food) — `cities/singapore.html`, index card relinked.
  183 candidates across 10 areas; opens on Toa Payoh (buildcheck ✓). Gates: geocheck PASS · statuscheck
  CONSISTENT · buildcheck PASS · sourcecheck's 1 single-source place dropped by GATE 1. Pastel light/dark
  theme verified. Sources kept separate per city (11 SOURCES_ + 9 CREATORS_ for SEA; per-cluster for SG).
  **20 UNVERIFIED restaurant pins** held for the browser helper; 4 closures flagged (Eng Seng, Kim Keat
  Hokkien Mee, Hup Chong, Romdeng); 3 block-level pins to re-verify.
  NEXT: browser-helper the 20 UNVERIFIED → deeper per-town food expansion (NYC-level density) → re-run
  `rebuild-city.py singapore --build`.
- **2026-08-26 scaffold DONE:** consolidate.py (10 areas, SEA cuisine taxonomy, pastel `AC`),
  tools/build-singapore.py (**pastel light/dark theme**, Toa-Payoh-anchored map — safe), keys registered in
  research.js / geocode-status.py / rebuild-city.py, index "building" card, _AGENT_BRIEF/AUDIT.
- **2026-08-26 discovery IN PROGRESS:** 3 agents running — Toa Payoh, rest-of-Singapore, SEA cities.
- **NEXT after discovery lands:** `python3 tools/rebuild-city.py singapore` (prep+sourcecheck, no build) to
  confirm the dataset consolidates and passes sourcing → then a **geocode wave** (Wikipedia coords for
  temples/landmarks/parks resolve high; hawker stalls/restaurants often need the browser helper) writing
  `geo/_geoout_*.json` → `python3 tools/geo-merge.py singapore` → `python3 tools/rebuild-city.py singapore
  --build` → 4 gates → open cities/singapore.html and toggle OS light/dark to verify the pastel theme →
  relink the index card + update docs/CITIES.md.

## Notes
- The map is **anchored on Toa Payoh** [1.3343,103.8479] z13 (per the brief); labels derive from pins.
- SEA spans ~ -8..21 lat, 95..127 lng — a continent-scale map; that's expected. Each country is one
  filterable area with its own pastel marker colour and needs ≥1 geocoded tier-1 or the build asserts.
