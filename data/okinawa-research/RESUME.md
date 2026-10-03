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
- 2026-10-02 **W1** (truncated by the shared cap): 13 discovered (`*_W1.json`).
- 2026-10-02 **W2 done** (relaunch, ~174 WebSearch calls): +106 → **119 discovered (92 sights + 27 food), 74 pinned**,
  45 UNVERIFIED (helper queue). Gates: sourcecheck / geocheck / statuscheck / buildcheck **PASS**; `npm run validate`
  + `npm test` **ALL PASS**. Files: `SIGHTS/FOOD/SOURCES/CREATORS_OKINAWA_W2.json`, `geo/_geoout_okinawa_W2.json`,
  raw per-search log `_okinawa_w2_notes.md` (every surfaced GPS and held lead, numbered — read before searching).
- View: opt-in `CFG["VIEW"]=(26.45,127.85,9)` in `tools/build-okinawa.py` (shared `tools/belgium_build.py` gained the
  backwards-compatible key) — frames the main island; Kerama/Miyako/Yaeyama by pan/zoom.
- **Not live**: hub card stat updated ("119 researched · 74 pinned · still being built"); CITIES.md row refreshed.

### Density (python3 tools/density.py okinawa, discovered set)
| area | have | target | need |
|---|---|---|---|
| NAHA | 21 | 120 | +99 |
| CHUBU | 22 | 95 | +73 |
| HOKBU | 23 | 90 | +67 |
| NANBU | 18 | 65 | +47 |
| YAEYA | 14 | 60 | +46 |
| MYK | 14 | 50 | +36 |
| KRM | 7 | 30 | +23 |

- 2026-10-02 **W3 done** (food & drink first + ANIME; WebSearch budget fully spent — 200/200 incl. two background
  geocoders): +95 → **214 discovered (107 sights + 107 food & drink = 50 % food, was 22 %), 89 pinned**; ANIME 4
  (Nirai Kanai, Azama, Pokémon Center Okinawa, Sugar Road/Chura-san); 2 notable closures flagged (Ayagu, Ichigin). 4 gates PASS, `npm run
  validate` + `npm test` ALL PASS. Files `FOOD/SIGHTS/SOURCES_OKINAWA_W3.json`, `geo/_geoout_okinawa_W3.json` (discovery
  pins), `_W3G` (held-sight geocoder: 7 kept, 5 rejected), `_W3R` (restaurant geocoder: 1/50), raw log `_okinawa_w3_notes.md`
  (120 numbered entries — every held lead and its source; read before searching).

### Density after W3 (python3 tools/density.py okinawa)
| area | food | sights | have | target | need |
|---|---|---|---|---|---|
| NAHA | 25 | 17 | 42 | 120 | +78 |
| CHUBU | 18 | 18 | 36 | 95 | +59 |
| HOKBU | 20 | 18 | 38 | 90 | +52 |
| NANBU | 15 | 17 | 32 | 65 | +33 |
| YAEYA | 13 | 15 | 28 | 60 | +32 |
| MYK | 12 | 12 | 24 | 50 | +26 |
| KRM | 4 | 10 | 14 | 30 | +16 |

## In-flight wave
- **W9** (session_012LmRFpCmy9XHMHT66hkzS3, started 2026-10-03; rules `_okinawa_w9_agentrules.md`): 7 bg agents —
  W9D1 Chūbu food (cap 30) · W9D2 Naha food & drink (28) · W9D3 Hokubu (26) · W9D4 Nanbu+KRM food (24) · W9D5 MYK+YAEYA (26) ·
  W9A anime part 3 + pin 7 unpinned anime (18) · W9G geocoder on `_okinawa_geo_todo_W9G.json` (74 UNVERIFIED; Apple Maps channel) (25).
  Files: `FOOD/SIGHTS/SOURCES/CREATORS_OKINAWA_W9*.json`, `geo/_geoout_okinawa_W9*.json`, `_okinawa_W9*_notes.md`.
  On relaunch: check which notes files exist; rerun only the missing agents, then build → gates → commit.

- 2026-10-02 **W4 done** (fresh session, ~186 searches, 9 background subagents): pin-first + discovery + anime.
  **258 discovered (128 sights + 130 food & drink = 50 % food), 130 pinned (was 89)** — pins per area NAHA 18 · CHUBU 24 ·
  NANBU 21 · HOKBU 34 · KRM 5 · MYK 11 · YAEYA 17. ANIME 6 (+Cape Chinen/Aquatope, Okitsura Gushikawa). 4 gates PASS,
  validate + test ALL PASS. Card stat + CITIES.md refreshed; **not live** (go-live bar: ≥150 pins, every area ≥10).
  Geocoders: W4G1 sights 15/31 (11 high JA-Wikipedia), W4G2 Naha/Chūbu food 2/39, W4G3 south/north food 10/30 (aggregator
  coords → `low`, AUDIT policy), W4G4 islands food 1/25. Discovery: W4D1 Naha +12 (Ukishima → held), W4D2 Chūbu/Nanbu +11,
  W4D3 Hokubu/islands +19, W4A anime +2. Per-agent logs `_okinawa_W4*_notes.md`.

### Density after W4
| area | food | sights | have | target | need |
|---|---|---|---|---|---|
| NAHA | 34 | 20 | 54 | 120 | +66 |
| CHUBU | 18 | 26 | 44 | 95 | +51 |
| HOKBU | 24 | 20 | 44 | 90 | +46 |
| NANBU | 17 | 20 | 37 | 65 | +28 |
| MYK | 14 | 12 | 26 | 50 | +24 |
| YAEYA | 18 | 20 | 38 | 60 | +22 |
| KRM | 5 | 10 | 15 | 30 | +15 |
CHUBU food is only 41 % → next Chūbu discovery is food-only.

- 2026-10-03 **W5 done** (fresh session, 200 searches, 8 bg agents): **302 discovered (143 sights + 159 food & drink = 53 %),
  183 pinned (was 130)** — high 89 · med 45 · low 49. Pins/area NAHA 42 · CHUBU 38 · NANBU 26 · HOKBU 36 · KRM 8 · MYK 13 · YAEYA 20.
  ANIME 9. Closures flagged 3 (Ayagu, Ichigin, Arakaki Shokudō). 4 gates PASS; validate + test ALL PASS. Not live (KRM < 10 pins).

### Density after W5
| area | food | sights | have | target | need |
|---|---|---|---|---|---|
| NAHA | 40 | 22 | 62 | 120 | +58 |
| CHUBU | 22 | 27 | 49 | 95 | +46 |
| HOKBU | 29 | 22 | 51 | 90 | +39 |
| NANBU | 18 | 25 | 43 | 65 | +22 |
| MYK | 18 | 13 | 31 | 50 | +19 |
| YAEYA | 25 | 21 | 46 | 60 | +14 |
| KRM | 7 | 13 | 20 | 30 | +10 |

- 2026-10-03 **W6 done** (fresh session, ~188 searches, 8 bg agents; rules `_okinawa_w6_agentrules.md`): **343 discovered
  (162 sights + 181 food & drink = 53 %), 246 pinned (was 183)** — high 98 · med 50 · low 98. Pins/area NAHA 47 · CHUBU 51 ·
  NANBU 32 · HOKBU 48 · KRM 13 · MYK 24 · YAEYA 31. ANIME 11. **Went LIVE** (CARD:okinawa linked; root CARD:japan "5 of 5").
  4 gates PASS; validate + test ALL PASS. Agent tags: W6G1/G2/G3 geocoders (+7/+19/+21), W6D1 Chūbu +11, W6D2 Hokubu +9
  (Parlor Senri CLOSED), W6D3 Naha +8, W6D4 Nanbu/islands +11, W6A anime +2. Held by orchestrator: Blue Turtle Farm, Zhyvago.

### Density after W6
| area | food | sights | have | target | need | pins |
|---|---|---|---|---|---|---|
| NAHA | 44 | 26 | 70 | 120 | +50 | 47 |
| CHUBU | 29 | 31 | 60 | 95 | +35 | 51 |
| HOKBU | 35 | 27 | 62 | 90 | +28 | 48 |
| NANBU | 21 | 26 | 47 | 65 | +18 | 32 |
| MYK | 19 | 14 | 33 | 50 | +17 | 24 |
| YAEYA | 26 | 21 | 47 | 60 | +13 | 31 |
| KRM | 7 | 17 | 24 | 30 | +6 | 13 |

- 2026-10-03 **W7 done** (fresh session, ~191 searches, 8 bg agents; rules `_okinawa_w7_agentrules.md`): **378 discovered
  (176 sights + 202 food & drink = 53 %), 295 pinned (was 246)** — high 112 · med 60 · low 123 · UNVERIFIED 86. ANIME 16 (+5 Poké Lids).
  Closures flagged: Mutsumibashi Kadoya, Naha City Museum of History. 4 gates PASS; validate + test ALL PASS. Agent tags: W7D1 Naha food +8,
  W7D2 Chūbu food +7, W7D3 Naha sights +9, W7H held +6, W7A anime +5, W7G1 +18 pins, W7G2 +7 pins, W7R 9 low→high/med. Details: AUDIT.md W7.

### Density after W7
| area | food | sights | have | target | need | pins |
|---|---|---|---|---|---|---|
| NAHA | 52 | 37 | 89 | 120 | +31 | 73 |
| CHUBU | 37 | 34 | 71 | 95 | +24 | 65 |
| HOKBU | 38 | 27 | 65 | 90 | +25 | 52 |
| NANBU | 21 | 26 | 47 | 65 | +18 | 34 |
| MYK | 20 | 14 | 34 | 50 | +16 | 25 |
| YAEYA | 27 | 21 | 48 | 60 | +12 | 33 |
| KRM | 7 | 17 | 24 | 30 | +6 | 13 |

- 2026-10-03 **W8 done** (session_01Df9Wi2VqyzsSc7XCRZBEQz, ~184 searches, 8 bg agents; rules `_okinawa_w8_agentrules.md`): **418 discovered
  (191 sights + 227 food & drink = 54 %), 344 pinned (was 295)** — high 119 · med 72 · low 153. **ANIME 22 found / 15 pinned** (+6 Poké Lids & Anime-88
  West Pier). No new closures. 4 gates PASS; validate + test ALL PASS. Agent tags: W8H +5, W8D1 +2, W8D2 +6, W8D3 +7, W8D4 +5, W8D5 +9, W8A +6, W8G +14 pins.

### Density after W8
| area | food | sights | have | target | need | pins |
|---|---|---|---|---|---|---|
| NAHA | 59 | 42 | 101 | 120 | +19 | 85 |
| CHUBU | 39 | 34 | 73 | 95 | +22 | 68 |
| HOKBU | 43 | 29 | 72 | 90 | +18 | 61 |
| NANBU | 23 | 28 | 51 | 65 | +14 | 40 |
| MYK | 23 | 16 | 39 | 50 | +11 | 32 |
| YAEYA | 30 | 24 | 54 | 60 | +6 | 41 |
| KRM | 10 | 18 | 28 | 30 | +2 | 17 |

## Next actions (W9 plan, ordered)
1. **Chūbu +22 is now the biggest gap, food & drink only.** Koza steak houses: mine Okinawa Times series 「沖縄ステーキ史 since1950」 (W8D1 notes)
   for named houses + pair each with Stripes/KozaWeb/RS; resolve New York Restaurant status. Chūbu held: Mickey, Shimanchu Soba, Churuge Soba, Ippe Coppe.
2. **Naha +19 food-first** (W8D3 added 5 sights / 2 food): awamori bars, min'yō sakaba, kissaten, bakeries. Held: Naha Soba, Shima Nakama, Teshiraji,
   The President, Awamori Souko/A STAND. Oninoude: check BRUTUS EN post-332928 names it before swapping the root URL.
3. **Hokubu +18, Nanbu +14 (food only — 45 % food), MYK +11, YAEYA +6, KRM +2.** Held lists in `_okinawa_W8D2/D4/D5_notes.md`.
4. **Anime:** pin the 7 unpinned (list in AUDIT W8); W8A part 3 not run (Okinawa pilgrimage/collab cafés/Ultraman-Kinjō searches); card notes for
   lids at existing places (Tokashiki, Kumejima, Miyako, Nanjō, Okinawa City Kodomo no Kuni, Ginowan Tropical Beach) and Anime-88 Kabira/Kondoi.
5. **Pins:** ~74 UNVERIFIED; W8G "still unverified" list (Hiyajō Banta, Wajī, Kaminohama, Aharen, Nakanoshima, Yoshino, Chuko-gura, Kumesen, Tokuyama,
   Nishikiya, Ryū no Kura, Utahime @東町17-11) needs a different channel (browser `tools/geocode-helper.html`). 4b: 153 `low` → re-verify flags in AUDIT W8.
6. **Creators:** 0 kept W4–W8 — stop unless a query names a specific shop.
7. Build loop unchanged: `flock -w 3600 /home/user/cleo-guide/.git/cleo-shared.lock python3 tools/rebuild-city.py okinawa --build` → 4 gates →
   `cd tools && npm run validate && npm test` → CARD:okinawa stat + CITIES row + AGENT-PROMPTS row → commit+push
   (`bash data/okinawa-research/_okinawa_push_w8.sh "msg" <extra paths>` — update its session trailer for a new session).

## Older plan (W8)
1. **Held leads (one confirm search each)** — listed in AUDIT.md W7 "Held"; cheapest: Nago Poké Lid (already 2 sources — just pin),
   Naha Soba (Kinjō), Shima Nakama, Imai Pan, Teshiraji, Miyazato Soba, VONGO & ANCHOR, Ippe Coppe. Blue Turtle Farm is MYK.
2. **Discovery:** Naha +31 (food 58 % → balanced), Hokubu +25 (food-first), Chūbu +24 (Koza steak houses = named gap; food-first),
   Nanbu +18 (food 45 % → food-only), MYK +16, YAEYA +12, KRM +6 (food 29 % → food-only: Zamami/Tokashiki/Kume shokudō & soba).
   Best yielding lists in W7: OTV Okitive reader Top-30 ↔ KozaWeb; Ryukyu Shimpo gourmet; Mapple articles.
3. **Pins:** 86 UNVERIFIED (W7G1/W7G2 notes list what was tried). 4b: ~114 `low` food pins never re-verified (W7R reached sights +
   flagged ones only) — NAVITIME venue pages were the productive upgrade channel (med). Reconcile Araha Beach address (2-2-1 vs 2-21),
   update Utahime's relocation (東町17-11), Busena (park-level point), Sakihama Seimen (tabelog-only).
4. **Fact-check follow-ups:** find a real article URL (or replace) for Oninoude's BRUTUS cite; spot page for Kinjō Bakery.
5. **Creators:** 0 kept W4–W7 (~36 searches). Stop generic creator queries; only targeted ones naming a shop.
6. Build loop unchanged: `flock -w 3600 /home/user/cleo-guide/.git/cleo-shared.lock python3 tools/rebuild-city.py okinawa --build`
   → 4 gates → `cd tools && npm run validate && npm test` → CARD:okinawa stat + CITIES row + AGENT-PROMPTS row → commit+push
   (`bash data/okinawa-research/_okinawa_push_w7.sh "msg" <extra paths>` — update its session trailer for a new session).

## Older plan (W7)
1. **Discovery yield is the bottleneck now** (W6: ~2.3 searches per kept place; most JA list searches return aggregators).
   Pair the held leads first — each is ONE confirm search from kept: Naha (Oninoude, Yappari Steak 1st store, Teshiraji, Kinjō
   Bakery, Shima Nakama, Mutsumibashi Kadoya), Hokubu (Miyazato Soba, Shirasa Shokudō, Cafe Hakoniwa, Cafe Kokuu, Iejima rum,
   Tototo, Agai, Yukuru), islands/Nanbu (Tōfu no Higa, Boku no Mise Ojisan, Kihachi, Marukami), Zhyvago (confirm RS 751034),
   Blue Turtle Farm (find a real 2nd source). Notes: `_okinawa_W6D*_notes.md`.
2. **Naha +50 / Chūbu +35:** food-first (Naha food 63 %, Chūbu 48 % → Chūbu food-only). Lists: Stripes "best of", OTV Okitive,
   Okinawa Times soba/shokudō polls, Michelin Guide Okinawa? (none — Japan Michelin doesn't cover Okinawa; confirm), KozaWeb.
3. **Pins:** ~97 UNVERIFIED remain (`geo` records + dataset). W6G2 left all 16 NAHA food + 10 others unreached; W6G3 left 17
   (7 island distilleries etc.); W6G1 left 12. Same pattern: extended `<日本語名> <JA address> 緯度 経度` (→ low).
4. **Re-verify (4b):** 98 `low` pins → upgrade to `!3d!4d`; specifically Milmil Honpo (listings 250 m apart), KITCHEN inaba
   (single listing), Tamatorizaki, Akagi trees. Recheck Sukeroku status (tabelog-only).
5. **Creators:** 0 kept in W4–W6 (~25 searches). Haisai Tanteidan (1.1M subs, verified) is the best candidate — search its
   videos for named shops already on the map. Stop spending on generic creator queries.
6. After each ~40: `flock -w 3600 /home/user/cleo-guide/.git/cleo-shared.lock python3 tools/rebuild-city.py okinawa --build`
   → 4 gates → `cd tools && npm run validate && npm test` → refresh CARD:okinawa stat (live format) + CITIES row → commit+push
   (`bash data/okinawa-research/_okinawa_push_w6.sh "msg" <extra paths>` — update its session trailer for a new session).

## Older plan (W5)
W5 lessons (W4): restaurant GPS almost never surfaces in search → (a) **browser `tools/geocode-helper.html` run on the 132
UNVERIFIED is the fastest way to ~250 pins / go-live**; (b) in search, `site:travel.navitime.com <日本語名> 緯度 経度` (med, one page per point) plus the only other productive patterns were extended-mode ONE name per
query: `<日本語名> wikipedia 座標` (sights, high) and `<name> tripadvisor latitude longitude` (restaurants → `low`, must match the
sourced address); Stripes `GPS` searches rarely hit. (c) Discovery: most Naha list leads were single-source — pair Rurubu ↔ Mapple ↔
Okinawa Traveler deliberately; held leads per agent are in `_okinawa_W4D*_notes.md`. (d) Re-verify the 13 `low` pins to `!3d!4d`.

## Older plan (W4, partly done)
0. **Pins are the bottleneck (89 of 186 render).** ~95 places (≈70 restaurants) are UNVERIFIED: run
   `tools/geocode-helper.html` in a browser on `docs/GEOCODE-BACKLOG.md` → okinawa. Stripes article URLs that print GPS
   for held restaurants are listed in `_okinawa_w3_notes.md` (Mikasa, Yagiya/noodles-nanjo, Jack's, Charlie's, Tacoloco,
   Curcuma). Sights still unpinned: Shikinaen, Sakaemachi, Sunayama, Irabu Bridge, Gangala, Hate-no-hama, Yaedake,
   Tamatorizaki, Kume beaches, Aharen, Araha, Emerald, Yoshino, Aragusuku, Pokémon Center (Aeon Rycom), Ama, Takatsukiyama,
   Ryūtan, Karate Kaikan. Go live at ≥150 pins with every area ≥10 pins.
1. **Food (keep ≥50 % per area):** the Rurubu ↔ Mapple pairing works (1 list search → 4–8 names; 1 confirm search →
   2–4 kept). Held single-source leads to pair next (see notes #): Miyazato Soba, Mutsumibashi Kadoya, Shuri Soba
   Nakada, Teshiraji, George Restaurant, Ishimine Shokudō, Tsubame (Makishi 2F), Adachiya, Sangoza Kitchen, Koshuya,
   COFFEE potohoto, HUU'S, ippe coppe, Cafe Kokuu, CASA SOL, Kissa Agachi-mori, Jef Yonabaru, Seaside Drive-In, Cafe
   Ocean, Kitauchi Bokujō, Hitoshi, Gen, Yaesen/Seifuku distilleries, Kihachi & Yan-kō (Kume), Marumi-ya (Zamami), Kanifu
   & Shidamē-kan (Taketomi), Iriomote cafés, Yukishio Museum, KOURI SHRIMP, Makabe Chinā, Kaiyō Shokudō, Maeda Shokudō.
   Unmined/half-mined lists: Mapple tourism/okinawa/02 (Kokusai 19 — Pork Tamago Onigiri Honten, Okinawa Daiichi Hotel
   breakfast, C&C Breakfast, Ball Donut Park, Sekka no Sato need a 2nd source), rurubu 14269 (cafés 31), KozaWeb bakeries
   280 / senbero 283, Okinawa Traveler 0003 ranking, Hateruma/Kohama/Iriomote food (Mapple-only names in notes #104-108).
2. **Sights for Naha/Chūbu** (largest gaps): Tomari International Cemetery, Mekaru tombs, Shuri Kannondō, Naminoue Beach,
   Urasoe Castle/Yōdore, Kakazu Ridge, Sugar Loaf, Minatogawa Stateside Town (Stripes GPS), Kadena michi-no-eki lookout,
   Okinawa Zoo, Plaza House, Rycom; Ishigaki Limestone Cave & Cape Hirakubo (GLTJP + Stripes '20 things').
3. **ANIME (3 so far):** Okitsura (Uruma — pilgrimage map RS 3833039, manholes RS 4174266), Poké Lids (16 in 12 cities —
   need per-lid sites), One Piece Card Game shop (San-A Naha Main Place), Chura-san (NHK drama, Kohama Island).
4. **Creators:** still 0 vetted attachments (SUSURU TV, Rachel & Jun, LWIF, Tokyo Lens checked). Try Japanese Okinawa
   YouTubers with ≥100k subs naming specific shops.
5. After each ~50: `flock -w 3600 /home/user/cleo-guide/.git/cleo-shared.lock python3 tools/rebuild-city.py okinawa --build`
   → 4 gates → `cd tools && npm run validate && npm test` → commit+push.

## Map-view caveat (RESOLVED 2026-10-02 — VIEW override; keep checking after island pins land)
The centre/zoom is derived from the 5–95 % pin percentiles over ALL Okinawa pins. Once Miyako/Yaeyama hold >5 % of
pins the box spans ~400 km and the derived view lands in the sea at zoom ~7–8. After the first `--build` run
`node tools/research.js --buildcheck okinawa` and eyeball the view; if the main island isn't framed, add a
documented CFG override (e.g. `VIEW`) in tools/belgium_build.py under the lock rather than hardcoding.

## Acceptance
- [ ] every area ≥ target · [x] sourcecheck PASS · [x] geocheck PASS · [x] statuscheck CONSISTENT, 0 unchecked
- [x] buildcheck PASS · [x] `npm run validate && npm test` green · [x] Japan hub card live · [x] CITIES.md row
