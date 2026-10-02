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
- **2026-08-26 RESTRUCTURED to ONE PAGE PER PLACE** (per user): `Singapore/` holds **43 town/city pages**
  + a pastel hub `Singapore/index.html`. `Singapore/toa-payoh.html` = just Toa Payoh (opens on it). Built by
  `tools/build-singapore-pages.py` (assigns each record to a town/city by address, injects only that place's
  records, pastel theme, centres on the place's pins). The repo-root `index.html` stays **US cities only**.
  The old single combined `cities/singapore.html` + `tools/build-singapore.py` were removed. `rebuild-city.py
  singapore --build` now runs the per-place builder. Gates green (buildcheck on toa-payoh.html ✓).
- **2026-08-26 LIVE @ 163 pins** (74 sights + 89 food) — data unchanged; now surfaced as per-place pages.
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

## Punggol (PGL) — checkpoint (agent: Punggol, 2026-10-02)
- Target: ~93 (`python3 tools/density.py singapore --area PGL`). Page `Singapore/punggol.html`, slug `punggol`.
- Files (PUNGGOL tag only): FOOD_PUNGGOL*.json, SIGHTS_PUNGGOL*.json, SOURCES_PUNGGOL*.json, CREATORS_PUNGGOL*.json,
  geo/_geoout_punggol_*.json, _note_PUNGGOL*.md.
- Dedup: Punggol Park, Kampong Lorong Buangkok, Lorong Halus Wetland already exist under USG — not re-added.
### In-flight wave
- W1 (sights + hawker canon): Punggol Waterway/Point/Coney/PDD/settlement/heritage sights; Punggol hawker
  centres (Punggol Coast HC, Oasis Terraces, Northshore, Punggol Plaza), Waterway Point. Writing FOOD_PUNGGOL.json,
  SIGHTS_PUNGGOL.json.
- **NVN Novena & Newton (2026-10-02, NOVENA agent):** in-flight W1 food canon + sights → `FOOD_NOVENA.json`/`SIGHTS_NOVENA.json`; checkpoint + plan in `_note_NOVENA.md`.

## Balestier (BLS) — checkpoint (agent: Balestier, 2026-10-02)
- Full checkpoint, file list and per-wave notes: `_note_BALESTIER.md`. Target 55 (`python3 tools/density.py singapore --area BLS`).
### In-flight wave (BLS)
- W1: canon food (bak kut teh / chicken rice / bakeries) + Whampoa Makan Place + heritage-trail sights -> FOOD_BALESTIER.json, SIGHTS_BALESTIER.json.
