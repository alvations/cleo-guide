# Osaka (大阪) — RESUME checkpoint (read first)

Map: `cities/osaka.html` · dataset `data/osaka.dataset.json` · key `osaka` · built by `tools/build-osaka.py`
(thin wrapper over `tools/japan_build.py`; consolidated by `consolidate.py` → `tools/japan_consolidate.py`).
Standing briefs: `data/japan-research/_AGENT_BRIEF.md` (shared Japan rules) + `_AGENT_BRIEF.md` here.

## Density targets (iterate until met — do NOT compromise; benchmark = NYC ~500)
Measured by `python3 tools/density.py osaka` on the DISCOVERED set. Total ≈ 460.
- `KITA` Kita (Umeda · Nakazakichō · Tenma · Tenjinbashi-suji · Nakanoshima · Fukushima) — target ~80
- `MINAM` Minami (Namba · Dōtonbori · Shinsaibashi · Amerikamura · Kuromon · Sennichimae · Ura-Namba) — target ~95
- `CHUO` Chūō & the Castle (Osaka Castle · Honmachi · Kitahama · Tanimachi · Karahori) — target ~45
- `TNJ` Tennōji & Shinsekai (Tsūtenkaku · Shinsekai · Abeno Harukas · Shitennō-ji · Nishinari) — target ~55
- `EAST` East Osaka (Tsuruhashi · Ikuno Koreatown · Kyōbashi · Higashi-Ōsaka) — target ~35
- `BAY` Bay Area (Universal Studios · Kaiyūkan · Tempozan · Taishō Little Okinawa · Sakishima) — target ~35
- `SOUTH` Southern Osaka (Sumiyoshi Taisha · Sakai kofun & knives · Kishiwada · Kansai Airport) — target ~40
- `NORTH` Hokusetsu & Kawachi (Minoo · Expo '70 Park · Ikeda Cupnoodles Museum · Takatsuki · Hirakata) — target ~35
- `KNSAI` Kansai day trips (Kobe · Himeji · Arima Onsen · Kōya-san · Wakayama) — target ~40

## Regioning
Osaka's own **Kita (north) / Minami (south)** downtown split plus its **wards (-ku)**, then the Hokusetsu/Kawachi/Senshū suburbs and the Kansai day-trip ring. Nara belongs to the Kyoto map — don't duplicate it here.

## State
- 2026-10-02 scaffolded (areas, taxonomy, wrappers, registry keys). Discovery not started.

## Next actions
1. Discovery waves per area (canon first) → `python3 tools/density.py osaka` → iterate on every `NEED +N`.
2. Geocode waves → `geo/_geoout_osaka_*.json` → `python3 tools/rebuild-city.py osaka --build` (under the shared lock).
3. Re-verify pin placement (CLAUDE.md 4b) + closure pass (4c) until statuscheck reports zero unchecked.

## Acceptance
- [ ] every area ≥ target · [ ] sourcecheck PASS · [ ] geocheck PASS · [ ] statuscheck CONSISTENT, 0 unchecked
- [ ] buildcheck PASS · [ ] `npm run validate && npm test` green · [ ] Japan hub card live · [ ] CITIES.md row
