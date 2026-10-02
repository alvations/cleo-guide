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
- 2026-10-02 scaffolded (areas, taxonomy, wrappers, registry keys).
- 2026-10-02 W1 truncated at the shared 200-call cap: 28 discovered.
- 2026-10-02 **W2 (session 2) — LIVE.** **199 discovered (71 sights + 128 food), 172 rendered (65 sights + 107 food)**;
  sourcecheck PASS · geocheck PASS (high 167 · med 5) · statuscheck CONSISTENT · buildcheck PASS · validate + npm test
  PASS. Japan hub CARD:osaka live, root "2 of 5 maps live", CITIES.md row. ~202 searches this session (main ~90 +
  workers G1 13, S1 29, M1 45, M2 25).
- Density (`python3 tools/density.py osaka`, discovered): KITA 82/80 OK · MINAM 26/95 (+69) · CHUO 23/45 (+22) ·
  TNJ 23/55 (+32) · EAST 9/35 (+26) · BAY 5/35 (+30) · SOUTH 6/40 (+34) · NORTH 10/35 (+25) · KNSAI 15/40 (+25).
- Files: FOOD_OSAKA_W1/W2/M1/M2.json, SIGHTS_OSAKA_W1/W2/S1.json, SOURCES_OSAKA_W1/W2.json, geo/_geoout_osaka_{W1,W2,
  W2u,G1,M1,M2,S1}.json (W2u = UNVERIFIED backlog). Held: `_held_W1.json`, `_held_S1.json`, `_held_M2.json`
  (Michelin, no dish surfaced), `_pending_osaka_W2.json` (single-source Time Out/OSAKA-INFO leads, Michelin names with
  unknown cuisine). Helpers: `_osaka_add.py` (dedup append), `_osaka_sync.sh` (pull/union-merge/push, run under lock),
  `_osaka_golive.py <places> <sights> <food>` (refresh the hub card + root count + CITIES row).

### Proven channels (use first next session)
- `allowed_domains:["guide.michelin.com"]` + "Osaka Bib Gourmand <cuisine> address" → 3–6 venue pages with
  addresses per call; "<name> <street> latitude longitude" on the same domain returns the venue-page lat/lng (a real
  place pin). Hyōgo/Kobe: same with "hyogo-region". Expect ~150+ Osaka-region Michelin places.
- `allowed_domains:["en.wikipedia.org"]` "<A> coordinates; <B> coordinates" → 2 sight coords per call.
- `allowed_domains:["japan-guide.com"]` / `["osaka-info.jp"]` area queries → sight lists (source 1).

## In-flight wave
- none (W2 closed — see State).

## Search log`.

## Search log
- session 2 searches used: ~202 (main ~90 + G1 13 + S1 29 + M1 45 + M2 25). Multi-name queries that MISS fan out into 4-5 sub-searches — batch only names known to be on the target domain.

## Next actions (W3 plan, ordered)
1. **MINAM (+75)** — the biggest gap. Michelin: query `Osaka <genre> Michelin Chuo-ku Namba/Shinsaibashi/Sennichimae`
   per genre (sushi, kappo, yakiniku, Chinese, Italian, bar); Time Out "30 must-go restaurants in Osaka city" +
   "best standing bars" cross-checked against OSAKA-INFO Minami food pages / Inside Osaka / Lonely Planet for ≥2.
   Promote `_pending_osaka_W2.json` Time Out singles (Hanadoko, Takoume, Hoso Udon Kuromon Sakae, Akaoni…) by finding
   a 2nd credible source each. Sights: Glico sign/Ebisubashi, Hōzenji Yokochō shops, Namba Yasaka Shrine (OSAKA-INFO
   + jawiki 難波八阪神社), Shochikuza, NGK, Doguyasuji (2nd source), Ura-Namba.
2. **SOUTH/BAY/EAST/NORTH/TNJ** — Time Out area lists (South/East/North) need a 2nd source per venue; jawiki
   coordinates (3 per query, `allowed_domains:["ja.wikipedia.org"]`, "<名称> 座標; …") for held S1 sights.
3. **KNSAI food** — no Michelin Hyōgo until Feb 2027; use japan-guide e3564/e3551 + Feel KOBE + Time Out for Kobe beef,
   Nankinmachi (Roushouki), Akashiyaki (Kisaku) — ≥2 editorial each.
4. **Geocode UNVERIFIED** (`geo/_geoout_osaka_W2u.json`): Kogaryu, Juhachiban, Matsuba, Daruma Shinsekai, Wanaka,
   Azuma, Aizuya, Tsuruhashi Market + Michelin nulls (Udonya Kisuke, capi, 9 M1) → `tools/geocode-helper.html`.
   Re-verify Tempura Kozaki (med, ~0.5 km off).
5. Fill generic dishes from Michelin "Inspectors' Favorite Dishes … Kyoto Osaka 2026"; resolve `_held_M2.json`.
6. Creator channel: 0 so far — try named creators' Osaka pieces (Ramen Adventures, Inside Osaka, Abroad in Japan
   videos) with specific titles, not broad queries (broad creator queries fan out and burn budget).
Commands: `python3 tools/density.py osaka` · `flock -w 3600 .git/cleo-shared.lock python3 tools/rebuild-city.py osaka
--build` · gates `node tools/research.js --sourcecheck|--geocheck|--statuscheck|--buildcheck osaka` · `cd tools &&
npm run validate && npm test` · `flock … python3 data/osaka-research/_osaka_golive.py <n> <sights> <food>` ·
commit then `flock … data/osaka-research/_osaka_sync.sh`.

## Acceptance
- [ ] every area ≥ target (KITA only) · [x] sourcecheck PASS · [x] geocheck PASS · [x] statuscheck CONSISTENT, 0 unchecked
- [x] buildcheck PASS · [x] `npm run validate && npm test` green · [x] Japan hub card live · [x] CITIES.md row
