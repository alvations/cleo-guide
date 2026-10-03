# Osaka W7 worker brief (session 7, 2026-10-03) — read fully

**Read `_W6_worker_brief.md` first — every rule there still applies** (hard limits, source bar, output schema,
`_osaka_add.py` usage, geo record rules, creator channel, Japanese + English queries). This file only adds W7 specifics.

## W7 state
- 436 discovered, 309 rendered, ANIME 30. `_osaka_names.txt` refreshed (436 "AREA | name") — never duplicate.
- Need per area (discovered): MINAM +17 · EAST +11 · BAY +9 · TNJ +8 · SOUTH +8 · NORTH +6. Aim ~20% above the gap
  (some leads will drop). **Food & drink first**: BAY (8 food / 26), NORTH (11/29), SOUTH (12/32), TNJ (25/47) are
  below 50% food — your additions there should be mostly food & drink (restaurants, kissaten/coffee, bars, tachinomi,
  sweets, markets).
- Held leads already found (promote by finding ONE more credible key with a DIFFERENT key): `_held_W6.json`,
  `_held_W5.json`, `_held_W4.json`, `_note_W6{A,B,C,D}.md`. Cheapest gains — do those first.
- `MAPPLE` (mapple.net editor spot/article pages), `JALONTRIP`, `LMAGA`, `WALKERPLUS` (/article/ only), `METRONINE`,
  `OSAKAMETRO`, `TVTOKYO`, `SAKAITCB`, `RURUBU`, `MEETS`, `KOBENP`, `DANCYU`, `TABELOG100` (award.tabelog.com
  hyakumeiten selection page only), `OSAKAINFO`, `TIMEOUT` are registered keys. Partner/sponsored content = 0.
- Every new place gets a geo record in `geo/_geoout_osaka_W7<X>.json` (pin if a legitimate one surfaces; else
  `lat:null` + `confidence:"unverified"`) with `status` + `statusSource`.
- Write a `_note_W7<X>.md` with queries run, kept, MEASURED & DROPPED, held (that file is your audit trail).
- Your files: `FOOD_OSAKA_W7<X>.json`, `SIGHTS_OSAKA_W7<X>.json`, `SOURCES_OSAKA_W7<X>.json`, `CREATORS_OSAKA_W7<X>.json`,
  `geo/_geoout_osaka_W7<X>.json`, `_note_W7<X>.md`, `_tmp_W7<X>_*.json` (delete at end). Nothing else.
