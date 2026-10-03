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
- none — W6 closed (session 6; workers 178 searches + main 2).

- 2026-10-03 **W6 (session 6)** — 5 workers (A EAST+BAY · B MINAM · C TNJ/SOUTH/NORTH/KNSAI · D ★anime · G geocoder) + main.
  **436 discovered (166 sights + 270 food = 62% food), 309 rendered (136 + 173)**; **ANIME 30** (+9); 4 gates PASS; validate + npm test
  PASS. Per area vs target: KITA 102/80 OK · CHUO 56/45 OK · KNSAI 42/40 OK · MINAM 78/95 (+17) · EAST 24/35 (+11) · BAY 26/35 (+9) ·
  TNJ 47/55 (+8) · SOUTH 32/40 (+8) · NORTH 29/35 (+6). Yield ≈ 0.21/search. Geocoder 0/101 — WebSearch cannot pin the shop backlog.
  Held leads: `_held_W6.json` (+ per-worker `_note_W6*.md`).

## Next actions (W7 plan — supersedes the older lists below where they overlap)
1. **Pins are the bottleneck: 127 discovered-but-unrendered** (MINAM 44). Do NOT spend WebSearch on them again (W5G + W6G ≈ 0.2 pins/search);
   run `tools/geocode-helper.html` in a browser session, or a session with a geocoding channel, over the `lat:null` list
   (regenerate like `_unrendered_W6.json`). Mashino Ken: confirm current address before re-pinning.
2. **Promote `_held_W6.json`** — two-key leads that only lack a dish (Itamae Yakiniku Itto, Shimmachi Adachi, PRESTAU, Ajikitcho,
   tamanegi, Sushi Enishi) are cheapest: one dish-surfacing search each. Then TIMEOUT singles (Hozenji Sanpei, Akaoni, Umineko,
   Derailleur, Yosozake, Otis Blue, Tentomo) via Lmaga / Walkerplus / Mapple (newly accepted key) Japanese queries.
3. **MINAM (+17):** Tabelog 百名店 2025 MINAM picks in `_note_W6B.md` + Michelin Dec-2025 additions + Adomachi Namba 2005 ranking (TVTOKYO)
   paired with Mapple/Walkerplus. **EAST (+11)/BAY (+9):** Mapple area lists (Tsuruhashi, Kyōbashi, Taishō) for the single-source
   cluster. **NORTH (+6):** Mapple/Lmaga for the Ramen Hyakumeiten singles. **SOUTH/TNJ (+8 each):** Time Out JP 南大阪20選 singles + Mapple.
4. Status re-checks: Kijimunā no Mori (address conflict), Rokukakutei, Kaiyodo Hobby Land; re-confirm the Amako Sōbē JATA88 credit.

- 2026-10-03 **W5 (session 5)** — 6 workers (A BAY · B EAST · C TNJ · D MINAM+anime · E SOUTH/NORTH/KNSAI · G geocoder) + main.
  **398 discovered (151 sights + 247 food = 62% food), 297 rendered (126 + 171)**; ANIME 21 (+5: Kinopio's Café, Mandarake Grand
  Chaos, Super Potato, Animate Nipponbashi, Kuidaore Taro); 4 gates PASS; validate + npm test PASS. Per area vs target:
  KITA 100/80 OK · CHUO 56/45 OK · KNSAI 39/40 (+1) · MINAM 63/95 (+32) · TNJ 41/55 (+14) · BAY 24/35 (+11) · EAST 19/35 (+16) ·
  SOUTH 28/40 (+12) · NORTH 28/35 (+7). Yield ≈ 0.15/search. Held leads: `_held_W5.json` (~45, most need ONE more source).

- 2026-10-02 **W3 (session 3)** — 7 parallel workers + main, **200/200 searches**. **319 discovered (114 sights + 205
  food = 64% food), 266 rendered (104 + 162)**; 4 gates PASS; validate + npm test PASS; ANIME 10 (was 0).
  Discovered per area vs target: KITA 95/80 OK · CHUO 55/45 OK · MINAM 47/95 · TNJ 28/55 · KNSAI 26/40 · NORTH 22/35 ·
  EAST 18/35 · SOUTH 17/40 · BAY 11/35. Files W3A–W3G, W3M (+CREATORS_OSAKA_W3, _held_W3C, geo W3A–W3G, W3M).

- 2026-10-03 **W4 (session 4)** — 6 workers (A MINAM food · B anime+sights · C TNJ/EAST · D SOUTH · E BAY · F KNSAI/NORTH)
  + main (W4M Michelin). **372 discovered (140 sights + 232 food = 62% food), 290 rendered (120 + 170)**; ANIME 16 (+6);
  4 gates PASS; validate + npm test PASS. Per area vs target: KITA 100/80 OK · CHUO 56/45 OK · KNSAI 38/40 (+2) ·
  MINAM 57/95 (+38) · TNJ 34/55 (+21) · BAY 18/35 (+17) · EAST 19/35 (+16) · SOUTH 27/40 (+13) · NORTH 23/35 (+12).
  Yield ≈ 0.3 places/search — the English editorial channel is exhausted for the outer areas; held leads in `_held_W4.json`.

## Next actions (W6 plan — supersedes the W5/W4/W3 lists where they overlap)
1. **Promote `_held_W5.json` first** (cheapest gain — each needs ONE more credible key): EAST Tachinomi Shomin (TIMEOUT), Manmasa
   (TABELOG100), Okamuro (WALKERPLUS), Matsui (LMAGA), Yamatoya (OSAKAINFO; try co-trip 152925); BAY Taishō Okinawan cluster
   (Omoro, Usupare Hōnen, Yamaneko, Kijimuna no Mori, Ichariba — WALKERPLUS), Sōjuen (TABELOG100), Atariya (TVTOKYO); TNJ Yosozake,
   Okonomiyaki Den, Niji no Hotoke (find the real Oggi/Lmaga article); NORTH Ramen Hyakumeiten singles + Kajikasō (Lmaga 2024/11/862200);
   SOUTH SAKAITCB singles (Nakai Grill, Nishino, Iwashibune, Hikari); MINAM Jump Shop, Donguri Republic (OSAKAINFO only).
2. **Pins are now the main gap (101 discovered-but-unrendered).** WebSearch cannot pin small shops (OSM/Google `!3d!4d` don't surface;
   Wikipedia only for landmarks). Run `tools/geocode-helper.html` in a browser for the UNVERIFIED list, or a session with a geocoding channel.
   Re-verify Mashino Ken (Michelin coord ~1.5 km off its address).
3. Then fresh discovery: MINAM via Metro NiNE (`metronine.osaka`) + Lmaga area features; EAST via Keihan K-PRESS standing-bar issue and
   osaka-info `special/higashiosakashi-guide`; BAY via TV Tokyo Adomachi Tengoku episode pages (one page per ranked spot).

## Next actions (W5 plan — historical)
1. **Switch channel for the outer areas: Japanese-language queries.** `<区/市> 百名店 2025` (Tabelog Hyakumeiten selection
   pages, `TABELOG100`) paired with OSAKA-INFO `local_journey` / ward-official pages / Kobe Shimbun / Lmaga editorial.
   Every `_held_W4.json` BAY item already holds TABELOG100 (Aabel Curry, Yasubei, Sōjuen, Hige to Boin) — one OSAKA-INFO
   or Time Out hit each makes them pass. Same for EAST (Minzokumura, Yamada Shōten, Tachinomi Shomin) and TNJ (Tengu, Rainbow Buddha, Yosozake).
2. **MINAM (+38):** held GLTJP/SAVORJAPAN/TIMEOUT singles (Kuromon Sanpei, Maguroya Kurogin, Tokisushi, Hatsuse, Hozenji Sanpei,
   Yakiton Center); resolve the Botejyu lineage; Michelin leads with pins but no dish (Ajikitcho Horieten, tamanegi) need a dish.
3. **SOUTH (+13):** Sakai tourism names (Sankai Ryori Nishino, Hikari, Iwashibune, Nakai Grill, Obaian, Sakai-Tohji Knife Museum)
   + OSAKA-INFO "Sakai Gourmet Recommended by Locals" (detail530) → pair with SAKAITCB. **NORTH (+12):** Minoo momiji tempura
   (Momotaro/Kōsendō/Kajikasō) need a 2nd; Takatsuki/Ibaraki/Hirakata via 百名店. **KNSAI (+2):** Himeji oden, Kobe sobameshi, Akashiyaki.
4. **Pins:** 82 discovered-but-unrendered (MINAM 28) → `tools/geocode-helper.html` / Google `!3d!4d`. W4A five have status
   `unknown` → closure check. Re-pin Abe no Seimei (med, parent-shrine coord), Super Nintendo World (park coord), Nijigen no Mori.
5. Anime held (OSAKA-INFO only): Jump Shop, Donguri Republic Namba, Kiddy Land Umeda, Animate Cafe Nipponbashi; Mandarake (wiki only).

## Search log`.

- 2026-10-03 **W4 (session 4)** — 6 workers (A MINAM food · B anime+sights · C TNJ/EAST · D SOUTH · E BAY · F KNSAI/NORTH)
  + main (W4M Michelin). **372 discovered (140 sights + 232 food = 62% food), 290 rendered (120 + 170)**; ANIME 16 (+6);
  4 gates PASS; validate + npm test PASS. Per area vs target: KITA 100/80 OK · CHUO 56/45 OK · KNSAI 38/40 (+2) ·
  MINAM 57/95 (+38) · TNJ 34/55 (+21) · BAY 18/35 (+17) · EAST 19/35 (+16) · SOUTH 27/40 (+13) · NORTH 23/35 (+12).
  Yield ≈ 0.3 places/search — the English editorial channel is exhausted for the outer areas; held leads in `_held_W4.json`.

## Next actions (W6 plan — supersedes the W5/W4/W3 lists where they overlap)
1. **Promote `_held_W5.json` first** (cheapest gain — each needs ONE more credible key): EAST Tachinomi Shomin (TIMEOUT), Manmasa
   (TABELOG100), Okamuro (WALKERPLUS), Matsui (LMAGA), Yamatoya (OSAKAINFO; try co-trip 152925); BAY Taishō Okinawan cluster
   (Omoro, Usupare Hōnen, Yamaneko, Kijimuna no Mori, Ichariba — WALKERPLUS), Sōjuen (TABELOG100), Atariya (TVTOKYO); TNJ Yosozake,
   Okonomiyaki Den, Niji no Hotoke (find the real Oggi/Lmaga article); NORTH Ramen Hyakumeiten singles + Kajikasō (Lmaga 2024/11/862200);
   SOUTH SAKAITCB singles (Nakai Grill, Nishino, Iwashibune, Hikari); MINAM Jump Shop, Donguri Republic (OSAKAINFO only).
2. **Pins are now the main gap (101 discovered-but-unrendered).** WebSearch cannot pin small shops (OSM/Google `!3d!4d` don't surface;
   Wikipedia only for landmarks). Run `tools/geocode-helper.html` in a browser for the UNVERIFIED list, or a session with a geocoding channel.
   Re-verify Mashino Ken (Michelin coord ~1.5 km off its address).
3. Then fresh discovery: MINAM via Metro NiNE (`metronine.osaka`) + Lmaga area features; EAST via Keihan K-PRESS standing-bar issue and
   osaka-info `special/higashiosakashi-guide`; BAY via TV Tokyo Adomachi Tengoku episode pages (one page per ranked spot).

## Next actions (W5 plan — historical)
1. **Switch channel for the outer areas: Japanese-language queries.** `<区/市> 百名店 2025` (Tabelog Hyakumeiten selection
   pages, `TABELOG100`) paired with OSAKA-INFO `local_journey` / ward-official pages / Kobe Shimbun / Lmaga editorial.
   Every `_held_W4.json` BAY item already holds TABELOG100 (Aabel Curry, Yasubei, Sōjuen, Hige to Boin) — one OSAKA-INFO
   or Time Out hit each makes them pass. Same for EAST (Minzokumura, Yamada Shōten, Tachinomi Shomin) and TNJ (Tengu, Rainbow Buddha, Yosozake).
2. **MINAM (+38):** held GLTJP/SAVORJAPAN/TIMEOUT singles (Kuromon Sanpei, Maguroya Kurogin, Tokisushi, Hatsuse, Hozenji Sanpei,
   Yakiton Center); resolve the Botejyu lineage; Michelin leads with pins but no dish (Ajikitcho Horieten, tamanegi) need a dish.
3. **SOUTH (+13):** Sakai tourism names (Sankai Ryori Nishino, Hikari, Iwashibune, Nakai Grill, Obaian, Sakai-Tohji Knife Museum)
   + OSAKA-INFO "Sakai Gourmet Recommended by Locals" (detail530) → pair with SAKAITCB. **NORTH (+12):** Minoo momiji tempura
   (Momotaro/Kōsendō/Kajikasō) need a 2nd; Takatsuki/Ibaraki/Hirakata via 百名店. **KNSAI (+2):** Himeji oden, Kobe sobameshi, Akashiyaki.
4. **Pins:** 82 discovered-but-unrendered (MINAM 28) → `tools/geocode-helper.html` / Google `!3d!4d`. W4A five have status
   `unknown` → closure check. Re-pin Abe no Seimei (med, parent-shrine coord), Super Nintendo World (park coord), Nijigen no Mori.
5. Anime held (OSAKA-INFO only): Jump Shop, Donguri Republic Namba, Kiddy Land Umeda, Animate Cafe Nipponbashi; Mandarake (wiki only).

## Search log
- session 2 searches used: ~202 (main ~90 + G1 13 + S1 29 + M1 45 + M2 25). Multi-name queries that MISS fan out into 4-5 sub-searches — batch only names known to be on the target domain.

## Next actions (W4 plan, ordered — supersedes the W3 list below where they overlap)
1. **MINAM food (+48)** — Michelin Minami is EXHAUSTED. Use Time Out/Inside Osaka/OSAKA-INFO/LP pairings; promote the
   Time Out singles (Bible Club Osaka + 50Best Discovery; Tachinomi Shomin, Winestand Perche, Tiger Lily, Stand Umineko 3tR,
   Bar Shiki/Juniper/Hiramatsu); Shokudōen (yakiniku origin, Sennichimae).
2. **SOUTH food** — mine Time Out "20 must-go restaurants in Southern Osaka" (Tsunechan, Babbaluci, Agatha, Bosco Risaia,
   Trattoria Almo, Yuko) for 2nd sources. **BAY food (0)** — OSAKA-INFO Little Okinawa article for Taishō restaurant names.
   TNJ: Yaekatsu, Tengu, Yakko (Inside Osaka only) need a 2nd. NORTH: Kajikasō momiji tempura.
3. **Pins**: ~53 discovered-but-unrendered (all non-Michelin canon + Mashino Ken, Yoshinosushi, Kitahama Anagoya) →
   `tools/geocode-helper.html` / Google `!3d!4d`. Kōyasan Danjō Garan pin rejected (wrong side of Kongōbu-ji).
4. **Held Michelin, pinned but no dish** (W3A list in AUDIT): find dishes via the Michelin "Inspectors' Favorite Dishes" articles.
5. Anime: Mandarake Grand Chaos, Jump Shop, Animate Nipponbashi, Shinsaibashi PARCO, Sanrio Gallery need 2nd sources.

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
- [ ] every area ≥ target (KITA, CHUO, KNSAI OK; 6 to go) · [x] sourcecheck PASS · [x] geocheck PASS · [x] statuscheck CONSISTENT, 0 unchecked
- [x] buildcheck PASS · [x] `npm run validate && npm test` green · [x] Japan hub card live · [x] CITIES.md row
