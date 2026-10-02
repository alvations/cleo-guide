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
- Target: ~93 (`python3 tools/density.py singapore --area PGL`). Page `Singapore/punggol.html`, slug `punggol`; NOT live.
- Files (PUNGGOL tag only): FOOD_PUNGGOL.json, SIGHTS_PUNGGOL.json, SOURCES_PUNGGOL.json, CREATORS_PUNGGOL.json,
  _note_PUNGGOL.md (full held-lead list + W2 plan). Next files: FOOD_PUNGGOL2.json, SIGHTS_PUNGGOL2.json, geo/_geoout_punggol_w1.json.
- Dedup: Punggol Park, Kampong Lorong Buangkok, Lorong Halus Wetland, Ponggol Nasi Lemak already exist under USG — not re-added.
- **State:** W1 discovered 9 (5 food + 4 sights), all ≥2-credible or lone Michelin; **0 geocoded, 0 rendered** — the
  session's shared WebSearch cap (200/200) was exhausted ~17 searches into W1; no coords/status from memory.
- **In-flight wave:** none.
- **Next (in order):** (1) geocode + status the 9 kept (One Punggol HC, Punggol Coast HC, Coney Island, Punggol Point, Waterway Point)
  -> geo/_geoout_punggol_w1.json; (2) W2 discovery per _note_PUNGGOL.md (held sights' 2nd sources, hawker canon by centre, creator pass);
  (3) `flock -w 3600 .git/cleo-shared.lock python3 tools/rebuild-city.py singapore --build`; (4) density loop until PGL OK;
  (5) go-live = add "punggol" to LIVE_SLUGS in tools/build-singapore-pages.py under the lock, rebuild.
## Balestier (BLS) — checkpoint (agent: Balestier, 2026-10-02)
- Full checkpoint, file list and per-wave notes: `_note_BALESTIER.md`. Target 55 (`python3 tools/density.py singapore --area BLS`).
### In-flight wave (BLS)
- (none) — W1 stopped at the session WebSearch cap: 13 food in FOOD_BALESTIER.json, 0 sights, 0 geocoded; BLS 13 (+2 pre-existing SGWN) vs 55. NEXT: geocode W1 -> sights wave -> 2nd-source HELD list (see _note_BALESTIER.md).

## Holland Village (HLV) — checkpoint (agent: HOLLANDV, 2026-10-02)
- Full checkpoint, file list and per-wave notes: `_note_HOLLANDV.md`. Target 55 (`python3 tools/density.py singapore --area HLV`).
### In-flight wave (HLV)
- none. W1 DONE (truncated by the 200/200 session WebSearch cap): 13 discovered (10 food + 3 sights) / target 55;
  7 pins on the (greyed) page; 8 UNVERIFIED for the helper. Next = W2 plan in `_note_HOLLANDV.md` "Next actions".
