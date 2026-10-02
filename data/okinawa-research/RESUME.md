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
- 2026-10-02 scaffolded (areas, taxonomy, wrappers, registry keys). Discovery not started.

## In-flight wave
- **W1 (tag NAHA1)** — Naha sights backbone (Shuri/UNESCO gusuku, Tsuboya, Makishi, Naminoue…) → `SIGHTS_OKINAWA_NAHA1.json`,
  geocodes → `geo/_geoout_okinawa_NAHA1.json`. Method: one WebSearch per place for Wikipedia/official coords + a 2nd source
  (japan-guide / Visit Okinawa / Stripes Okinawa). Helper used to append: scratch `add.py` (kind F/S/G, tag, JSON).
- Key finding: **Stars and Stripes Okinawa** (okinawa.stripes.com) food/travel pieces print venue GPS (`N 26.xxx, E 127.xxx`) —
  use as a 2nd source AND as a venue-published coordinate for restaurants.

## Next actions
1. Discovery waves per area (canon first) → `python3 tools/density.py okinawa` → iterate on every `NEED +N`.
2. Geocode waves → `geo/_geoout_okinawa_*.json` → `python3 tools/rebuild-city.py okinawa --build` (under the shared lock).
3. Re-verify pin placement (CLAUDE.md 4b) + closure pass (4c) until statuscheck reports zero unchecked.

## Acceptance
- [ ] every area ≥ target · [ ] sourcecheck PASS · [ ] geocheck PASS · [ ] statuscheck CONSISTENT, 0 unchecked
- [ ] buildcheck PASS · [ ] `npm run validate && npm test` green · [ ] Japan hub card live · [ ] CITIES.md row
