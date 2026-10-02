# Okinawa (沖縄) — RESUME checkpoint (read first)

Map: `cities/okinawa.html` · dataset `data/okinawa.dataset.json` · key `okinawa` · built by `tools/build-okinawa.py`
(thin wrapper over `tools/japan_build.py`; consolidated by `consolidate.py` → `tools/japan_consolidate.py`).
Standing briefs: `data/japan-research/_AGENT_BRIEF.md` (shared Japan rules) + `_AGENT_BRIEF.md` here.

## Density targets (iterate until met — do NOT compromise; benchmark = NYC ~500)
Measured by `python3 tools/density.py okinawa` on the DISCOVERED set. Total ≈ 510.
- `NAHA` Naha (Kokusai-dōri · Makishi Public Market · Tsuboya · Shuri Castle · Naminoue · Sakaemachi) — target ~120
- `CHUBU` Chūbu — Central Okinawa (Chatan & American Village · Okinawa City/Koza · Ginowan · Urasoe · Yomitan) — target ~95
- `NANBU` Nanbu — Southern Okinawa (Itoman · Nanjō & Sēfa-utaki · Peace Memorial Park · Tomigusuku) — target ~65
- `HOKBU` Hokubu — Northern Okinawa (Nago · Motobu & Churaumi · Kouri Island · Onna · Yanbaru) — target ~90
- `KRM` Kerama & nearby islands (Tokashiki · Zamami · Aka · Kume-jima · Iheya) — target ~30
- `MYK` Miyako Islands (Miyako-jima · Irabu · Ikema · Kurima) — target ~50
- `YAEYA` Yaeyama Islands (Ishigaki · Iriomote · Taketomi · Hateruma · Yonaguni) — target ~60

## Regioning
Okinawa Prefecture's own regional division: the main island's **Hokubu / Chūbu / Nanbu** (north/central/south) with **Naha** as its own area, then the outlying island groups — **Kerama**, **Miyako** and **Yaeyama**.

## State
- 2026-10-02 scaffolded (areas, taxonomy, wrappers, registry keys).
- 2026-10-02 **W1 done (truncated)** — 13 places discovered & sourced (NAHA 6 · CHUBU 3 · NANBU 1 · HOKBU 3 · KRM 0 ·
  MYK 0 · YAEYA 0); 6 verified pins + 7 UNVERIFIED in `geo/_geoout_okinawa_W1.json` (NOT yet merged into
  data/geocodes.json — merge happens on the first `--build`). Files: `SIGHTS_OKINAWA_W1.json`, `FOOD_OKINAWA_W1.json`,
  `SOURCES_OKINAWA_W1.json`. **Stopped because the session WebSearch cap (200/200, shared by all agents) was hit
  after 17 of this agent's searches** — every further search is refused. Relaunch with a fresh search budget.
- Build-script prose (`tools/build-okinawa.py`) rewritten for real Okinawa content.
- Append helper: `python3 _okinawa_add.py F|S|G <TAG> < records.json` (dedups by name; F/S/G = food/sights/geo).

## In-flight wave
- none (W1 closed, truncated by the shared WebSearch cap — see State).

## Next actions
0. Held leads to re-source first: Tsuboya Yachimun-dōri, Shuri Soba, Miyazato Soba (Nago), Yanbaru Soba; re-geocode
   Shikinaen, Makishi Market, King Tacos, and Nakagusuku/Nakijin/Zakimi/Katsuren (Wikipedia infobox, one place per query).
   Cheap channel to try: `allowed_domains` searches on visitokinawajapan.com / japan-guide.com / okinawa.stripes.com
   (Stripes prints venue GPS).
1. Discovery waves per area (canon first) → `python3 tools/density.py okinawa` → iterate on every `NEED +N`.
2. Geocode waves → `geo/_geoout_okinawa_*.json` → `python3 tools/rebuild-city.py okinawa --build` (under the shared lock).
3. Re-verify pin placement (CLAUDE.md 4b) + closure pass (4c) until statuscheck reports zero unchecked.

## Map-view caveat (check at first build)
The centre/zoom is derived from the 5–95 % pin percentiles over ALL Okinawa pins. Once Miyako/Yaeyama hold >5 % of
pins the box spans ~400 km and the derived view lands in the sea at zoom ~7–8. After the first `--build` run
`node tools/research.js --buildcheck okinawa` and eyeball the view; if the main island isn't framed, add a
documented CFG override (e.g. `VIEW`) in tools/belgium_build.py under the lock rather than hardcoding.

## Acceptance
- [ ] every area ≥ target · [ ] sourcecheck PASS · [ ] geocheck PASS · [ ] statuscheck CONSISTENT, 0 unchecked
- [ ] buildcheck PASS · [ ] `npm run validate && npm test` green · [ ] Japan hub card live · [ ] CITIES.md row
