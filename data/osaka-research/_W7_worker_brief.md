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

## W7 round 2 (G/H/I) — what round 1 learned (read this)
- Round 1 yield ≈ 0.12/search: broad list queries surface single-source leads. What WORKED: **one name per search** against
  a second outlet — e.g. `allowed_domains:["rurubu.jp","mapple.net"]` `<JP shop name> <ward>` (W7B promoted Tsuruichi with
  RURUBU + MAPPLE spot pages). OR-queries with several shop names return nothing.
- Rurubu/Mapple **spot pages count only if they carry an editorial description** (not a bare address/hours stub) — quote
  the dish from it. Mapple article pages (e.g. mapple.net/article/6243 takoyaki, /395908 yakiniku, /5893 okonomiyaki) list
  several shops = one MAPPLE source each.
- **Ramen Walker** editorial (`ramen.walkerplus.com/article/…`, Kansai Walker's ramen magazine, Kadokawa) is accepted as
  `WALKERPLUS` (same key as walkerplus.com/article — so it does NOT pair with Kansai Walker). Shop-database pages
  (`/shop.php`, `/saiai/`) = 0.
- A list *restating* the Tabelog 百名店 (e.g. Ramen Adventures' "100 best ramen in Osaka" translations) is derivative of
  TABELOG100 → does not count as a 2nd source; a creator's own review page of the shop does.
- Two Osaka Metro properties (osakamania.jp + metronine.osaka) = ONE key. `OSAKACITY` (ward-office/municipal pages) accepted
  as an official municipal source.
- **Pins: MapFan works** (`_note_W7E.md`): `allowed_domains:["mapfan.com"]`, `<JP name> MapFan 地図`, ONE place per query;
  accept only if the spot page's name + address match → confidence "med", geoSource with the exact URL. Spend ~30% of your
  cap pinning your own new places this way.
- Only cite URLs that appeared in YOUR search results — never construct or guess a URL (two round-1 records were held for this).

## W7 round 3 (K/L/M) — closing the last gaps (after round 2: 477 discovered)
- Gaps: MINAM +3 · EAST +5 · BAY +3 · NORTH +3 · SOUTH +5 · TNJ +1. `_osaka_names.txt` refreshed (477).
- Food first (pairing method from round 2). **Sight fallback is allowed** once food leads are exhausted: a sight on a lone
  institution (`BUNKACHO` — National Treasure / Important Cultural Property / Special Historic Site / Scenic Beauty; `UNESCO`)
  or ≥2 credible (ja.wikipedia + OSAKA-INFO/japan-guide/Rurubu/Mapple). Sights are also the cheapest pins (ja.wikipedia 座標).
- Time Out 東大阪27選 (Kawachi) single-key names are listed in `_note_W7H.md` — pair them.
