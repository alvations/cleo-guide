# Okinawa — AUDIT (append-only, one section per stage/wave)

## 2026-10-02 — scaffold
- Areas (7), Japan taxonomy (`tools/japan_consolidate.py`), wrappers, registry keys. No places yet.

## 2026-10-02 — Wave W1 (Naha sights backbone + canon probe) — TRUNCATED by the shared WebSearch cap
**Searches run:** 17 (EN + JA). The session-wide WebSearch budget (200/200, shared by ~16 concurrent agents) was
exhausted mid-wave; every further call returns "Web search was not performed … 200 of 200". This is a hard
per-session cap (`CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`), not a rate limit — re-tested once, still blocked.
No place below was added from memory; every source URL cited was returned by a search.

### Stage 1 — sources discovered (+ why credible)
- `STRIPES` Stars and Stripes Okinawa — staff-written food/travel desk of the DoD-authorized daily; **prints venue
  GPS (`N 26.xxx, E 127.xxx`) in its listings** → doubles as an outlet-published coordinate for restaurants.
- `PARTSUNKNOWN` CNN / Anthony Bourdain's Explore Parts Unknown (taco-rice origin story).
- `JAPANTRAVEL` japantravel.com (named writers; corroborating). `RAMENADVENTURES` Brian MacDuckston (creator named in
  the Japan brief; 1 corroborating source). `GOVONLINE` Highlighting Japan (Cabinet Office PR). `SAMURAIARCHIVES`
  SamuraiWiki (historian-edited; heritage corroboration only). Reused: UNESCO, JAPANGUIDE, VISITOKINAWA,
  LONELYPLANET, WIKIPEDIA, RYUKYUSHIMPO.
- REJECTED as recommenders: hamoni.jp, taiken.co, his-usa blog, hotels.com/hoteles "best of" pages, trip.com,
  kupi.com, jeepe.jp, onookinawa (personal blog) — SEO/aggregator listicles.

### Stage 2–3 — extracted & fact-checked (13 kept; all PASS sourcecheck — 3 on lone UNESCO)
- NAHA (6 sights): Shuri Castle (t1; Seiden interior reopens 2026-11-23 per japan-guide), Tamaudun (t1), Shikinaen
  (t1), Makishi Public Market (t1; new building open since 2023-03-19), Sonohyan-utaki Ishimon (t2), Naminoue Shrine (t2).
- NANBU: Sefa-utaki (t1). CHUBU: Nakagusuku (t1), Zakimi (t2), Katsuren (t2). HOKBU: Nakijin (t1, lone UNESCO).
- Food canon (HOKBU): Kishimoto Shokudo (est. 1905, ash-lye soba; STRIPES + RAMENADVENTURES), King Tacos Kin (taco
  rice; STRIPES + PARTSUNKNOWN + JAPANTRAVEL). Kin town is 国頭郡 → filed HOKBU (prefecture regioning).
- **Held (single/uncredible source only):** Shuri Soba / Shuri Ukaji Soba, Miyazato Soba (Nago), Yanbaru Soba,
  Tsuboya Yachimun-dōri (only hotels.com/trip.com surfaced before the cap) — re-source next wave.
- Closures found: none.
- Channel mix this wave: institutional 7 (UNESCO), editorial/travel 9 (japan-guide, Visit Okinawa, Lonely Planet,
  Stripes, Parts Unknown, Ryukyu Shimpo, gov-online), creator 1 (Ramen Adventures), local 0.

### Stage 5 — geocode (geo/_geoout_okinawa_W1.json)
- high 4: Tamaudun, Naminoue, Sefa-utaki (Wikipedia infobox), Kishimoto Shokudo (Stripes venue GPS).
- med 2: Shuri Castle (DMS surfaced with japan-guide/japantravel), Sonohyan-utaki Ishimon (Sygic POI DB).
- UNVERIFIED 7 (helper queue): Shikinaen (4 searches, no coord), Makishi Public Market, King Tacos Kin, and
  Nakagusuku/Nakijin/Zakimi/Katsuren (only UNESCO 2–3-dp component centroids — rejected as too coarse).
- Lesson: one-place-per-query "<name> coordinates wikipedia" surfaces infobox DMS ~50% of the time; multi-place
  queries and Japanese "北緯 東経" queries mostly fail; mapcarta/latitude.to queries do not surface.

### Stage 6 — build
Not built: 6 verified pins is not a map. `rebuild-city.py okinawa` (prep) ran: consolidate 11 sights + 2 food,
sourcecheck PASS 13/13. Card stays "Being built"; Japan not flipped live by this agent.

## 2026-10-02 — Wave W2 (relaunch; all areas) — in progress, appended per batch
**Method.** Stars and Stripes Okinawa (`STRIPES`) is the coordinate workhorse: its staff articles print venue GPS,
and list articles ("12 Battle of Okinawa sites", "List of beaches", soba guide, castle pieces) yield 5–12 GPS per
search. Each Stripes place is then paired with an independent second source — japan-guide, Visit Okinawa, Lonely
Planet, Mapple (Shobunsha まっぷる editorial spot pages; new key `MAPPLE`), Atlas Obscura, Savor Japan — never two
Stripes articles (one outlet = one source; Itokazu Castle was held for exactly this reason). Island coordinates come
from Wikipedia infoboxes and Atlas Obscura place pages. Raw per-search log: `_okinawa_w2_notes.md`.
**Policy call (recorded):** for a sight that *is* a small island (Taketomi 5 km², Kurima 2.8 km², Ikema 2.8 km²)
the island's own Wikipedia coordinate is accepted at `med`/`low` — it is the place's coordinate, not a town
centroid. Ikema (minute precision) is `low` → re-verify queue.
**Batches 1–4 (commits through batch 4):** +52 places (45 sights, 7 food). Channel mix: editorial/travel
(japan-guide, Visit Okinawa/JNTO, Lonely Planet, Mapple, Savor Japan) ~60 citations; Stripes ~40; institutional
(Wikipedia-backed designations, Miyakojima city register) ~5; Atlas Obscura 6; creators 0 (see CREATORS_OKINAWA_W2
rejected list — no vetted creator surfaced a place-specific Okinawa video/post in 4 creator queries).
**Geocode:** 57 W2 records; resolves W1 UNVERIFIED Nakagusuku, Zakimi, Katsuren, Makishi, King Tacos (Stripes GPS).
UNVERIFIED (helper queue): Mikasa, Jack's Steak House, Yūnangi, Sakaemachi, Sunayama, Higashi-hennazaki, Irabu
Bridge, Gangala, Bise Fukugi, Fukushū-en, Hate-no-hama (+ W1 Shikinaen, Nakijin).
**MEASURED & held (single source so far):** Itokazu Castle (Stripes ×2), Ufuya Nago, Sawanoya, Kairo, Heiwaen soba,
Ishigufu, Captain Kangaroo, HAPI TAPI, Orion Happy Park, Kakazu Ridge, Sugar Loaf, Nirai Kanai Bridge, Cape Zanpa
drive-in park, Hanagasa Shokudo, Shuri Soba, Arakaki Zenzai, GATE1 Kin, Tamaya zenzai, Kudaka Island, Aharen Beach,
Kondoi Beach, Urauchi River, court-cuisine Mie / Sui Dunchi (Japan Times only). **Rejected recommenders:** taiken.co,
hamoni.jp, livelyhotels, japanactivity, aumo, veltra, nap-camp, haveagood-holiday, wanderlog, trip.com.
**Closures:** none found so far (statuses from the citing outlets, 2025–26).
**Build (mid-wave, bg agent):** 49/51 rendered; sourcecheck/geocheck/statuscheck/buildcheck PASS; validate+test PASS.
Derived view landed in the sea (25.57,126.16 z8) → opt-in `CFG["VIEW"]` added to tools/belgium_build.py, Okinawa sets
(26.45,127.85,9).
**Batches 5–12 + close (2026-10-02):** +54 more (W2 total 106: 80 sights + 26 food incl. the W2-held Itokazu now on
Wikipedia + Stripes). New outlets: `OKINAWATIMES` 2023 "900人の麺好きが選ぶ うまい沖縄そば" reader-poll editions
(north 1247918 / central 1243603 / south 1240071 / Miyako-Ishigaki 1264469) and profiles (Arayama 1305747, Kintarō
1302875); `KOZAWEB` (Okinawa City official tourism portal — Top-10 is hit-count = measurement only); `JCASTLE`;
`BUNKA_SURVEY` (Agency for Cultural Affairs modern-building survey — ordinary source, NOT a designation, per key
hygiene); `JAPANTIMES` (court cuisine, 2019); `RYUKYUSHIMPO` (Shuri Soba). Atlas Obscura place pages and Wikipedia
infoboxes supplied island coordinates (Hoshizuna, Yonekoyaki, Bise, Tatami-ishi, Yonaguni Monument; Irizaki,
Tamagusuku, Gushikawa (Kume), Nakijin, Yubu, Kurima, Taketomi, Miyara Dunchi, Mt Omoto).
**Fact-check / MEASURED & DROPPED or held:** Okinawa Soba Kintarō — Stripes GPS surfaced without an attributable
article → held (Okinawa Times only). Urasoe Castle/Yōdore Stripes GPS — article unattributable → held. Araha Beach —
summary GPS pointed to Tomigusuku (wrong town) → coordinate rejected, place kept UNVERIFIED. Mt Yaedake — Stripes GPS
also attributed to Nakijin in another summary → Yaedake pin pulled; Nakijin pinned from Wikipedia (agrees ~120 m with
Stripes). Savor Japan "5 must-visit Naha" list (promo-style Gurunavi copy) not used. Yui soba (KozaWeb: closed Aug
2022) not added (non-notable closed). Single-source leads parked in RESUME next actions.
**Channel mix (W2 citations, approx.):** Stripes 55 · Visit Okinawa 40 · japan-guide 22 · Mapple 20 · Lonely Planet 15 ·
Okinawa Times 12 · Wikipedia 9 · Atlas Obscura 8 · KozaWeb 3 · Japan Times/Ryukyu Shimpo/JNTO/Savor Japan/JCastle/
Miyakojima city/Bunka survey 1–2 each · creators 0 (none passed vetting with a place-specific post).
**Geocode (final W2):** 74 verified pins on the page (geocheck: 1 low — Ikema); 45 UNVERIFIED held by the gate.
**Closures:** none among kept places (status from the citing outlet's 2025–26 listing).
**Final build (2026-10-02):** `rebuild-city.py okinawa --build` → sourcecheck PASS (119/119), geocheck PASS,
statuscheck CONSISTENT (0 unchecked), buildcheck PASS (centre 26.45,127.85 z9; 7 labels in bounds); validate DATA OK;
npm test ALL PASS. Not flipped live (74 pins ≈ 15 % of target). WebSearch used this session: ~174.

## 2026-10-02 — Wave W3 (food & drink first + ANIME; relaunch session) — appended per batch
**Batch 1–2 (food 12).** New outlets (SOURCES_OKINAWA_W3): `OKINAWATRAVELER` (Rikka Docca editors' Okinawa Traveler),
`GLTJP`, `MACARONI`, `GIGAZINE`, `OKINAWAPREF` (prefecture 「琉球料理が味わえる店」 certification — ordinary source, NOT
lone authority). Kept: Sennichi zenzai, A&W Makiminato, Steakhouse 88 Tsuji, Nakamura Soba (Onna), EIBUN, Yagiya,
Nanbu Soba, Ufuya (Stripes GPS high), Arakaki Zenzai-ya, Shima-jikan, Kura (Miyako), Urizun. Pairing: Okinawa Times
2023 poll ↔ Okinawa Traveler / Mapple; prefecture certification ↔ Mapple / Okinawa Times column.
**MEASURED & held:** Miyazato Soba (jalan 4.2 = measurement only; OT feature not confirmed to name it), Miyanchi
STUDIO&COFFEE (Okinawa Traveler only — two pages of one outlet), Maeda Shokudo Ogimi (Stripes 'Maeda Shokudo' is near
Camp Schwab — identity unclear), Kaiyo Shokudo, Yanbaru Shokudo, Mikado (OT only), Jimanya (GLTJP directory only —
promotional), Hama Sushi (chain; Stripes reader vote only), Steakhouse Shiki/Chako/Usshisshii (aggregators only),
Sakimoto & Yamakawa distilleries (Stripes only), Tiandaa / Kenpa no Subaya / Hanamura / Kingetsu (OT only so far).
**Rejected recommenders:** tsunagujapan, foodle, hamoni, byfood list pages, resol-hotel blog, wanderlog, hotels.com.
**Geocode (background agent, 40 searches):** 12 coordinates surfaced; **5 rejected at review** (Aharen, Emerald, Gangala,
Araha, Yoshino — the summary gave a coordinate without a confirmable source page → stay UNVERIFIED). Kept 7:
Fukushū-en, Chinen, Tsuboya Museum, Okuma Beach (high); Higashi-hennazaki, Enkaku-ji/Benzaitendō (med); Iriomote (low,
island coordinate). 33 still UNVERIFIED → geocode-helper (restaurants never print GPS in search summaries).
**Batches 3–7.** Rurubu (`RURUBU`, JTB るるぶ&more) ↔ Mapple pairs proved the most efficient channel (one list
search → 4–8 names): Miyako soba (Irabu Soba Kame, Maruyoshi, Yamato, Minato, Jinku-ya), Yaeyama (Kimi Shokudō,
Shiraho Shokudō, Takenoko on Taketomi), Ishigaki beef (Yamamoto, Ishigaki-ya), Kume (Nantō Shokurakuen, Sukeroku
kamaboko), Nakamoto Tempura (Ōjima; Stripes GPS), Tomigusuku Taco Rice, Tacoloco, Itoman Osakana Center, coffee
(Tamagusuku Coffee Roasters, Hibari-ya, rokkan Shuri), drinks (Orion Happy Park — JG + Stripes, Stripes GPS;
Chatan Harbor Brewery — Mapple + Culture Trip; Helios Distillery — Mapple + Beer Tengoku; Dachibin Kumoji).
**ANIME wave:** Aquatope on White Sand → Nanjō named an Anime Tourism Association "88" site (Ryukyu Shimpo): Nirai
Kanai Bridge (new; gov-online + Ryukyu Shimpo; Stripes GPS med) and Azama Sun Sun Beach (W2 record tagged `anime`).
Okitsura (Uruma) manholes and Okinawa's 16 Poké Lids: no per-site location surfaced → held. ANIME count: 2.
**Creator query:** SUSURU TV (ramen YouTuber) — no Okinawa-soba video surfaced → 0 creator attachments again.
**MEASURED & held (single source):** Kihachi & Yan-kō (Kume; Yan-kō only a Ryukyu Shimpo PR entry), Kanifu &
Shidamē-kan (Taketomi), Iriomote cafés, COFFEE potohoto, HUU'S, oHacorté, Transit Café, VONGO & ANCHOR, BEEFY'S,
Kijimunaa (branch mismatch between sources), Tacomaria, Gringo, Sunny Tacos, Kitauchi Bokujō (branch mismatch),
Tsubame (Makishi 2F mochiage — Mapple article not confirmed to name it), Steakhouse Shiki (rurubu only), Sam's
Sailor Inn (chain).
**Build (mid-W3):** `rebuild-city.py okinawa --build` → 155 discovered (93 sights + 62 food = **40 % food**, up from
22 %), 85 pinned; sourcecheck PASS 155/155, geocheck PASS, statuscheck CONSISTENT, buildcheck PASS; validate DATA OK;
npm test ALL PASS. 70 places (mostly restaurants) await coordinates → geocode-helper.
**Batches 8–13 + close (2026-10-02).** +30 more: Tiandaa, Sobaya Yoshiko, Shiki Sonoda (KozaWeb + Rurubu), Highway
Drive-In (KozaWeb + Stripes + japantravel), Kaizoku Kōbō (pref cert + KozaWeb), Blue Seal Makiminato (Okinawa Times
2024 reopening + Rurubu + Okinawa Traveler), Onna no Eki Nakayukui, Michi-no-Eki Kyoda, Gōya & RICCO & Tunkaraya
(Miyako), Milmil & Adan-tei (Ishigaki), Naha drinking (Karakara to Chibugwā, Kozakura — 70 yrs, Okinawa Times;
Nakamura-ya; Benriya Yulinglong), cafés (oHacorté, Rakusui, Kajinhō, Shīsā-en, ichara, Yabusachi), Zamami sights (Ama,
Takatsukiyama), Naha sights (Sueyoshi-gū and Sōgen-ji gate with Wikipedia pins; Ryūtan — MLIT tagengo; Karate Kaikan),
Kouri Ōhashi (Stripes GPS + OCVB), Pokémon Center Okinawa (ANIME; Okinawa Times + Game Watch + official).
**Self-check:** oHacorté's second source was first entered with the wrong rurubu URL (Transit Café's page) — caught and
corrected to rurubu spot 80042843 before the push; Cafe ichara's description trimmed to sourced facts only; Orion Happy
Park address reduced to "Nago" (street address not in a source).
**Restaurant geocoder (bg, 30 searches):** 1/50 resolved (Chatan Harbor Brewery — Stripes cruise boarding point, med);
rejected Charlie's (point in central Naha), Jack's (estimate), unattributed Shuri/Onna/Kadena points.
**Channel mix W3 (citations, approx.):** Rurubu 34 · Mapple 33 · Okinawa Traveler 22 · Okinawa Times 13 · prefecture
certification 8 · KozaWeb 4 · Stripes 6 · japantravel 3 · Wikipedia/Samurai Archives/MLIT 7 · GLTJP/macaroni/GIGAZINE/
Culture Trip/Beer Tengoku/Game Watch/fun-japan/OCVB/gov-online/Ryukyu Shimpo 1–2 each · creators 0.
**Final W3 build:** 186 discovered (101 sights + 85 food = **46 % food**), **89 pinned**; sourcecheck PASS 186/186,
geocheck PASS, statuscheck CONSISTENT, buildcheck PASS; validate DATA OK; npm test ALL PASS. ANIME 3 (1 rendered).
Not flipped live (89 pins; NAHA/CHUBU far below target). Closures: none found among kept places.
WebSearch used this session: ~121 lead + 70 background = ~191.
**Batches 14–18 (after the W3 close, same session, until the WebSearch cap):** +28 → michi-no-eki Kadena (sight),
Yuiyui Kunigami, Toyosaki (Mapple TOP5 + Okinawa Traveler), Takaesu / Kingetsu / Sachichan soba (Rurubu soba-16 ×
Okinawa Times poll / Okinawa Traveler), Makabe Chinā, Ruby, Yanbaru Shokudō, Mikado, Kaiyō Shokudō (Rurubu local-
shokudō 7 × Okinawa Traveler), Mori no Kenja, Hitoshi, KITCHEN inaba, ROCO (Yaeyama), Ishigaki Limestone Cave,
Nishihama (Hateruma), Sugar Road (Kohama — Chura-san location → ANIME/pop layer), Ayahashi-kan, Nuchi Māsu,
Masahiro awamori gallery, Uema/Suppaiman factory, Marumi-ya & Marine Box & Aharen-enchi (Kerama), 17END (Shimoji).
**Closures (4c):** Ayagu Shokudō, Shuri — CLOSED end Oct 2023 after 44 yrs (Okinawa Times 1233368/1235617, Ryukyu Shimpo
entry-2334724); Ichigin Shokudō, Kumoji — CLOSED 23 Jan (Okinawa Times 1514070). Both notable (decades-old shokudō in
current Okinawa Traveler/C-lunch coverage) → kept, flagged, status sourced in geo/_geoout_okinawa_W3.json.
**FINAL W3 build:** 214 discovered (107 sights + 107 food = **50 % food**), 89 pinned; sourcecheck PASS 214/214,
geocheck PASS, statuscheck CONSISTENT, buildcheck PASS; validate DATA OK; npm test ALL PASS. ANIME 4. WebSearch cap
reached (harness: 200/200). Not live: 89 pins (rendered food only 13 — restaurant pins need the geocode-helper).

## W4 (2026-10-02, fresh session) — geocode policy decision (orchestrator)
- **Aggregator listing coordinates** (TripAdvisor / Wanderlog / hotpepper / gnavi venue pages, found via "<name> tripadvisor latitude longitude"):
  not in the 4a list of authoritative pin sources, but they are published venue points (not viewports/centroids). Decision: accept
  only when the point matches the sourced street address and nearby Stripes reference points, graded **`low`** (re-verify list,
  docs/SOURCES.md: "flag for the re-verify pass"), with the aggregator named in geoSource. A point that disagrees with the address
  is rejected (Café Kurukuma: ~5 km off → UNVERIFIED). TripAdvisor stays ZERO as a recommender. Takenoko (Taketomi): coordinate of
  unidentifiable provenance → demoted to UNVERIFIED.
- **Sight geocoder W4G1:** 19 pinned → after review 15 kept (11 high JA-Wikipedia infobox; 4 med: Yaedake summit, Pokémon Center =
  Aeon Mall Rycom infobox, Mamoru-kun (one of ~20 figures, Atlas Obscura), Emerald Beach Stripes lat + beach-on-map ≤20 m);
  Ryūtan / Tamatorizaki / Aragusuku / Azama Sun Sun demoted to UNVERIFIED (coordinate provenance unidentifiable). Tip: one name per
  extended-mode query `<日本語名> wikipedia 座標` surfaces infobox coords; batched names don't.
- **Discovery W4D1 (Naha) / W4D2 (Chūbu+Nanbu) / W4D3 (Hokubu+islands) / W4A (anime):** +13 / +11 / +19 / +2. Orchestrator review:
  Ukishima Garden **moved to held** (its Lonely Planet URL was constructed from a logged place id, not seen in a result → one
  verified source left); Chibichiri Gama pin demoted to UNVERIFIED (provenance unidentifiable). Mutsumibashi Kadoya closure
  (2024-06-20) held — single source (Ryukyu Shimpo); place was a held lead, not on the map. Creators: 4 searches, 0 kept
  (Mark Wiens, Okinawa Hai, two Naha queries — rejections in CREATORS_OKINAWA_W4D*.json). Per-agent notes: `_okinawa_W4*_notes.md`.
- **W4G5 (Kerama/Miyako):** +3 med pins via NAVITIME spot pages (Eef Beach, Aragusuku Beach, 17END). **Final W4 build:** 258 discovered
  (130 food & drink = 50 %), **130 pinned** (high 78 · med 39 · low 13), 129 UNVERIFIED → geocode-helper. sourcecheck PASS 258,
  geocheck PASS, statuscheck CONSISTENT, buildcheck PASS (VIEW override still frames the main island); validate DATA OK; npm test ALL
  PASS. ANIME 6. Searches ≈198 (G1 25, G2 27, G3 22, G4 17, G5 12, D1 30, D2 25, D3 25, A 15). Channel mix (new places): Rurubu/Mapple/
  Okinawa Traveler majority; Ryukyu Shimpo, Stripes, Lonely Planet, japan-guide, Michelin travel article, OCVB, JA-Wikipedia; creators 0.

## W5 (2026-10-03, fresh session, ~200 searches, 8 background subagents; rules `_okinawa_w5_agentrules.md`)
- **Geocoders (pins + status):** W5G1 Naha 21/36 searched → 21 `low` (hotpepper/navitime/Yahoo/gnavi listing coords, each matching
  the sourced street address; pattern `<日本語名> <那覇市 address> 緯度 経度`, extended, 20/23 hits), 2 UNVERIFIED. W5G2 Miyako/Yaeyama
  4 NAVITIME pins (Kondoi, Yukishio Museum, Sobadokoro Takenoko replaces W4's unattributed point; **Tamatorizaki downgraded med→low** by
  orchestrator — provenance only via search summary), 9 UNVERIFIED. W5G3 Chūbu/Nanbu/Hokubu/Kerama 17 (5 high JA-Wikipedia, 2 med,
  10 low), 11 UNVERIFIED; KOURI SHRIMP rejected (listing address 436-1 ≠ sourced 314 Kouri); Charlie's Tacos may have a second "Honten"
  — re-verify.
- **Discovery:** W5D1 Naha +8 (6 food: Pork Tamago Onigiri Honten, Fujiya Tomari zenzai, Tomari Iyumachi, Yatai-mura, Arakaki Kashiten,
  Nuchigafū; sights Sugar Loaf Hill, Shuri Kinjō Akagi trees — **Akagi pin med→low**, coordinate seen only in a search summary). W5D2
  Chūbu +4 food (Kamimura distillery, Mihama Shokudō, Sanchōme no Shima Soba-ya, Tacos-ya Chatan). W5D3 Hokubu/Nanbu +11 (6 food);
  **Todoroki Falls pin demoted → UNVERIFIED** (unattributed search coordinate, W4 policy). W5D4 islands +18 (13 food: awamori — Hateruma
  Awanami, Sakimoto, Yonejima, Tokuyama; soba/shokudō); **CLOSURE: Arakaki Shokudō, Ishigaki — closed after 35 yrs (Yaeyama Mainichi
  y-mainichi 42149)** → kept, flagged "— CLOSED". W5A anime +3 (Kinjō Tetsuo/Ultraman archive, Nanjō Aquatope 88 plate, Nishihara Kira
  Kira Beach/Harukana Receive — anime link via AnimeClick + ciatr, place via OKINAWA41 + Mapple; flagged for a stronger anime source).
- Held leads per agent in `_okinawa_W5*_notes.md` (Señor Taco, Cafe Ocean, Hanaori/Gon/Suke Soba, Gokoku-ji, Parlor Tokuchan, Shirasa
  Shokudō & Sawanoya (Stripes URL, need 2nd), Miyazato Soba, Kihachi, Ninufa, Ikema Shuzō, Okitsura manholes, Poké Lids…).
- Creators: 11 searches across agents, **0 kept** (rejections in CREATORS_OKINAWA_W5*.json). Channel mix (new places): Ryukyu Shimpo,
  Okinawa Times, Yaeyama/Miyako Mainichi, Rurubu, Mapple, Okinawa Traveler, Lonely Planet, Stripes, Walkerplus, prefecture/municipal
  tourism sites, Anime Tourism 88.
- **Build:** 302 discovered (143 sights + 159 food & drink = 53 %), **183 pinned** (high 89 · med 45 · low 49); sourcecheck PASS,
  geocheck PASS, statuscheck CONSISTENT, buildcheck PASS; validate DATA OK; npm test ALL PASS. Pins/area NAHA 42 · CHUBU 38 · NANBU 26 ·
  HOKBU 36 · KRM 8 · MYK 13 · YAEYA 20 → **not live** (go-live bar needs every area ≥10 pins; KRM 8). Session WebSearch cap 200/200 reached.

## 2026-10-03 — W6 (fresh session, 8 bg agents, ~190 searches; rules `_okinawa_w6_agentrules.md`)
- W6A (anime/creators, 12 searches): +2 ANIME sights — KIN Sunrise Beach (Okitsura manhole + Kan-Kin-Bay collab; Ryukyu Shimpo + Kin Town + OCVB film office + official beach site; med NAVITIME pin) and Michi-no-Eki Ginoza (Okitsura manhole; Ryukyu Shimpo + Kin Town + Rurubu + All About + Ginoza village; high ja-WP pin). Creators kept 0 (Haisai Tanteidan: 1.1M subs verified but no video naming a mapped place; 2 rejected). Held: Naha Shureimon Poké Lid (single source).
- W6G2 (main-island food pins, 28 searches): 25 geo records — 2 med (ja-WP), 17 low (aggregator coords matched to street address), 6 UNVERIFIED; 26 not reached (all NAHA). **Fixes applied:** Manmi is in Nago (伊差川251), not Motobu → renamed `Shima-buta Shichirin-yaki Manmi, Nago` and address corrected; 新山そば reads Shinzan → renamed `Shinzan Soba (新山そば)` (all research + geo files).
- W6G1 (KRM + unpinned sights, 22 searches): 7 pinned — high 2 (Shimashi Ōzato Castle, Takanazaki southernmost monument; ja-WP), med 1 (Ama Beach; Stripes GPS), low 4 (Aharen Beach, Yonejima Shuzō, Yan-kō, Sukeroku; aggregator coords matched to address); 9 UNVERIFIED (Kumesen, Ryūtan, Tomari Cemetery, Shinri-hama, Hiyajō Banta, Takatsukiyama, Aharen-enchi, Marine Box, Todoroki); 12 not reached. KRM pins 8→13 (9 at high/med). Sukeroku status rests only on a live listing → recheck next wave.
- W6G3 (Miyako/Yaeyama food pins, 22 searches, cap): 21 pinned, all low (JA name + street address → 2–4 aggregator listings agreeing ≤~100 m); re-verify (4b) Milmil Honpo (listings ~250 m apart) and KITCHEN inaba (single listing). 2 UNVERIFIED (Kura: lat only; ROCO: rounded area coord rejected). 17 not reached (7 distilleries, Takesan-tei, Kingyū, Pengin, Arakaki, Kuninaka, Kōrakuen, Blue Turtle, Nakayoshi, Ishigaki-ya, Shiraho).
- W6D3 (Naha discovery, 24 searches, cap): +8 (4 food: Okinawa Daiichi Hotel yakuzen breakfast, Adachiya senbero, Ryūkyū Shinmen Tondō Oroku Honten, BACAR OKINAWA; 4 sights: Arakaki Family Residence (ICP), Tsushima Maru Memorial Museum, Mekaru Tomb Site (National Historic Site), Gokoku-ji). Pins 5 (2 high ja-WP, 3 low), 3 UNVERIFIED. Creators 2 searches, 0 kept. Held single-source: Oninoude (BRUTUS), Yappari Steak 1st store (branch ambiguous), Teshiraji, Kinjō Bakery, Shima Nakama, Mutsumibashi Kadoya.
- W6D2 (Hokubu discovery, 23 searches): +9 (6 food: Nishikiya Kouri, Sawanoya Motobu Honten (held lead paired), Umi to Mugi to, Yae Shokudō, Sakihama Seimen, Parlor Senri Kin — **CLOSED 2015** (taco-rice birthplace; flagged `— CLOSED`); 3 sights: Busena underwater observatory, Wajī cliffs Ie-jima, Ryukyu Mura). Pins 2 (Sawanoya med Stripes GPS; Ryukyu Mura low Mapion), 7 UNVERIFIED. Most list searches surfaced aggregators only. Creators 0 kept. Held: Miyazato Soba, Shirasa Shokudō, Cafe Hakoniwa, Cafe Kokuu, Iejima rum, Tototo, Agai, Yukuru.
- W6D4 (Nanbu + islands discovery, 26 searches, cap): 12 returned → **11 kept** (NANBU 4: Ōshiro Tempura, Ōjima Imaiyu Market, Jef Yonabaru, Konpaku-no-tō; MYK 2: Utopia Farm, Nakasone Tuyumya tomb (ICP); YAEYA 1: Hateruma Seitō; KRM 4 sights: Uezu House (ICP), Inazaki & Kaminohama observatories, Nishibama Beach). **Held by orchestrator:** Blue Turtle Farm Mango Café — its 2nd source (macaroni 148660 p4) was the agent's inference, not a confirmed mention → single-source, removed from FOOD_W6D4 + geo. All 11 UNVERIFIED pins (status recorded). Creators 2 searches, 0 kept. Held: Tōfu no Higa, Boku no Mise Ojisan, Kihachi, Marukami.
- W6D1 (Chūbu food-first discovery, 30 searches): 12 returned → **11 kept** — food 7: Shinzato Distillery (awamori, 1846), Gordie's Sunabe, Pizza House Honten Urasoe (1958), Miyanchi STUDIO & COFFEE, Tsurukame-dō Zenzai, Hanaori Soba (last 3 = held leads paired), Ploughman's Lunch Bakery; sights 4 (ja-WP high pins): Sakima Art Museum, Futenma-gū, Southeast Botanical Gardens, Koza Music Town. Pins 7 (4 high, 3 low), 4 UNVERIFIED. **Held by orchestrator:** Zhyvago Coffee Works — 2nd source Ryukyu Shimpo gourmet/entry-751034 surfaces on a Zhyvago query (orchestrator re-search, 1 search) but its title/content never showed → not a confirmed mention; single-source (GLTJP) until confirmed. Dropped Kona's Coffee (45-store national chain). Creators 0 kept.
- **W6 build** (`rebuild-city.py okinawa --build`): 343 discovered (162 sights + 181 food = 53 %), 246 pinned (high 98 · med 50 · low 98), every area ≥13 pins → go-live bar (≥150, every area ≥10) met → CARD:okinawa flipped live, root CARD:japan "5 of 5 maps live". Gates: sourcecheck PASS · geocheck PASS (98 pins block-level/low → re-verify pass next) · statuscheck CONSISTENT (0 unchecked) · buildcheck PASS (centre 26.45,127.85 z9). `npm run validate` DATA OK; `npm test` ALL PASS. Source-channel mix W6: editorial/tourism (Rurubu, Mapple, OCVB, Ryukyu Shimpo, Stripes, GLTJP, visitokinawajapan, OTV) ~all kept places; national designations (ICP / National Historic Site) 4; creators 0 kept (~10 searches, all rejected — see CREATORS_OKINAWA_W6*.json).

## 2026-10-03 — W7 (session_01ArZFSzKcMbcHeXLyDAXfRU; 8 bg agents, ~191 of ~200 searches; rules `_okinawa_w7_agentrules.md`)
Per-agent logs `_okinawa_W7*_notes.md` hold every query, kept/dropped/held lead and its source; summary:
- **Discovery (+35 → 378; 21 food & drink):** W7D1 Naha food & drink +8 (Oninoude, Kinjō Bakery, Sakaemachi Bottleneck, Jimanya,
  Daitō Soba Kokusai-dōri, BAR Owl, Yappari Steak 1st Cocktail Plaza, Mutsumibashi Kadoya — CLOSED 2024-06-20 per Ryukyu Shimpo 3146539).
  W7D2 Chūbu food & drink +7 (Señor Taco, Cafe Ocean, Suba-dokoro Wachichi, Daruma Soba, Banjutei, Player's Cafe, Parlor Minato;
  OTV Okitive reader Top-30 ↔ KozaWeb pairing). W7D3 Naha sights +9 (Kume Shiseibyō, Heiwa-dōri, Bin-nu-utaki, Okinawa Gokoku Shrine,
  Mie Gusuku, Yogi Park, Shuri Ryusen, Tenbusu Naha, Naha City Museum of History — CLOSED 2025-08-31). W7H held confirms +6
  (Cafe Hakoniwa, Cafe Kokuu, Iejima Distillery, Tōfu no Higa, Marukami (Kurima, MYK), Zhyvago — 2nd sources RS 2455738 + OT 1513363;
  RS 751034 NOT confirmed and not cited). W7A anime +5 (Poké Lids).
- **Fact-check notes (orchestrator review):** Oninoude's BRUTUS cite is the magazine root URL (No.1005 "Top 100 bars — Naha",
  surfaced W6D3) — still ≥2 without it (OKINAWACLIP + SYUGYOKU, both promo/feature sites = ordinary sources); flagged for a
  stronger 2nd source. Kinjō Bakery's MAPPLE cite is a region list page. Kadoya's MACARONI mention is from a search summary.
  Okinawa Gokoku Shrine is tier 3 with exactly 2 sources (kept).
- **Closures:** Mutsumibashi Kadoya (2024), Naha City Museum of History (2025) flagged; Gajumaru Shokudō closed 2022-06 (held lead,
  dropped — not notable enough to keep). Ashibiuna possibly closed after a 2019 fire (held, unverified).
- **Held (still single-source / unresolved):** Naha — Naha Soba (Kinjō, reopened 2025-10), Shima Nakama, Kikuya, Yuunami, Angama,
  Senbero Mattchan, The President, Tubarama, Imai Pan, Teshiraji. Chūbu — VONGO & ANCHOR, Cocoroar Cafe, Shirano, Ippe Coppe,
  Pizza Stand NY, Mesilla Kitchen, Kintiti, Gon Soba; Koza steak houses remain a gap. Hokubu — Miyazato Soba, Shirasa, Tototo, Agai,
  Yukuru. Islands — Boku no Mise Ojisan (no dish), Kihachi, Blue Turtle Farm (is in Miyako → MYK, not Nanbu; no real 2nd source).
  Nago Poké Lid already has 2 sources (W7A notes) — next anime win.
- **Geocode:** W7G1 Naha/Chūbu UNVERIFIED → +18 (3 med, 15 low); W7G2 other areas → +7 (1 med Stripes, 6 low); discovery agents pinned
  their own (W7D3 9/9, 7 high). Araha Beach: NAVITIME prints 2-2-1 vs our 2-21 — reconcile. Utahime relocated 2026-03-11 to 東町17-11
  (name/address to update; still UNVERIFIED). Pork Tamago / C&C Breakfast listings conflict → not pinned.
- **Re-verify (4b), W7R:** 9 of 98 `low` upgraded — high 7 (Mekaru Tomb Site moved 690 m to the en/ja.wiki infobox point;
  Ikema Island moved 1,222 m from an island-level point to the ja.wiki 池間大橋 point; Michi-no-Eki Kyoda, Itoman Osakana Center,
  Ryukyu Mura, Seaside Drive-In, Nuchi Māsu), med 2 (Milmil Honpo moved 244 m — NAVITIME venue page resolves the 250 m listing
  conflict; KITCHEN inaba 26 m). No wrong pins found. Tamatorizaki / Akagi trees: only the same aggregator point resurfaced → stay low.
  Sukeroku: 2nd status source (rurubu, open). ~80 food low pins not reached.
- **Creators:** ~11 searches across agents (incl. 3 for Haisai Tanteidan) — 0 kept, rejections in `CREATORS_OKINAWA_W7*.json`.
- **Build + gates:** `rebuild-city.py okinawa --build` → sourcecheck PASS · geocheck PASS (123 low pins to re-verify) · statuscheck
  CONSISTENT · buildcheck PASS; `npm run validate` DATA OK; `npm test` ALL PASS. Pins 246 → 295 (high 112 · med 60 · low 123;
  UNVERIFIED 86). Food share 202/378 = 53 % (Naha 58 %, Chūbu 52 %, KRM 29 % ← lowest). **ANIME 16.**
- Channel mix (kept): regional press (RS/OT/OTV) ~10 · Japanese travel media (Mapple/Rurubu/Tabirai/GLTJP/Okinawa CLIP) ~14 ·
  official/municipal/OCVB ~8 · national (TV Tokyo, BRUTUS, Tabelog Hyakumeiten selection) 3 · English (Culture Trip, Fun Japan,
  Stripes, Wikipedia) ~8 · creators 0.

## 2026-10-03 — W8 (session_01Df9Wi2VqyzsSc7XCRZBEQz; 8 bg agents, ~184 of ~200 searches; rules `_okinawa_w8_agentrules.md`)
Per-agent logs `_okinawa_W8*_notes.md` hold every query, kept/dropped/held lead and its source; summary:
- **Discovery (+40 → 418; 25 food & drink):** W8H Naha held confirms +5 food (Yuunami Sakashita, Soba-dokoro Kikuya, Okinawa Jiryōri Angama,
  Shima-uta to Jiryōri Tubarama, Imai Pan — 2nd sources OT 2023 reader poll / OTV / Okinawa Traveler / Tabirai / Okinawa CLIP / OCVB).
  W8D1 Chūbu food +2 (Miyoya curry soba, Kadena — OTV 2025 soba 15 #3 + rurubu; TESIO sausages, Koza Gate-dōri — IFFA gold, OTV/RS/Tabirai).
  W8D2 Hokubu +6 (Yaezen, Nakijin Soba, Famille tacos, Nago-magari Restaurant, CAFE FUKURUBI, Kouri Ocean Tower; new outlet NAKIJINKANKO).
  W8D3 Naha +7 (Shikina-gū, Okinogū [2 sources], Asato Hachimangū, Ameku-gū — Ryūkyū Eight Shrines; Gajanbira Park; Kōhī Sakan Inshallah (1974);
  Live House Shimauta). W8D4 Nanbu +2 (Okinawa Soba Kintarō, Minatomachi Parlor) / KRM +3 (Yukui-dokoro Washima, Wayama Mozuku, Boku no Mise
  Ojisan — katsudon now named). W8D5 MYK +5 (Kikunotsuyu, Okinohikari, Ninufa, Painagama Beach, Ikema Wetlands) / YAEYA +4 (Tamanaha Shuzōsho,
  Dunan/Kokusen hanazake, Ishigaki Public Market, Tachigami-iwa). W8A anime +6 (Poké Lids Nago/Hinpun Gajumaru, Itoman, Tomigusuku/Michi-no-Eki
  Toyosaki, Zamami, Ishigaki; Taketomi West Pier — Non Non Biyori, official Anime Tourism 88 page).
- **Orchestrator fact-check:** W8D5 flagged two cites it had *assumed* named the place → removed rather than trusted: Tamanaha's rurubu 22673
  (3 sources remain: Yaeyama VB, Tabirai, NTA awards) and Tachigami-iwa's ja.wiki 与那国島 article (replaced by tabi-mag on0209 立神岩 spot page,
  surfaced by an orchestrator search; OCVB + TABIMAG). New keys TANOSHIMA (publisher unverified) and MIDORIHANA (prefecture greening foundation):
  Ikema Wetlands still has WIKIPEDIA_JA + MIDORIHANA without TANOSHIMA. Uruma Tauros lid address corrected in SIGHTS_OKINAWA_W7A.json
  (1-2 Ishikawa-Ishizaki = gymnasium, 1.1 km off → 2316 Ishikawa, the sports grounds; W8A). BRUTUS EN post-332928 (Top-100 bars, Naha) surfaced
  for Oninoude — not swapped in (no evidence the page names it); candidate for W9.
- **Dropped / held:** Senbero Mattchan dropped (PR TIMES only). VONGO & ANCHOR dropped (blogs only). Yarazamori Gusuku dropped (inside Naha
  Military Port, no public access). New York Restaurant (Koza, A-lunch origin) not written — Tabelog says closed 2008, Hotpepper/Ekiten list an
  izakaya of that name. Helios Pub renamed/moved (Bacchus no Ibukuro?) — held. Held single-source: Naha Soba, Shima Nakama, The President,
  Teshiraji, Awamori Souko (→ "A STAND"?), Kihachi, Blue Turtle Farm, Mickey, Shimanchu Soba, Churuge Soba, Ippe Coppe, Tototo, Uppama Soba,
  Miyazato Soba (3rd miss), Marutaka, Koja, Doka Doka, KAIHOLO, Furumiya, Kōganeya, Restaurant Ryū, Tokashiki shokudō, Shima Soba Ichiban-chi,
  Yakiniku Kihachi, Kanifu/Shidamē-kan, Ikema Shuzō. Ashibiuna: no closure evidence (the "2019 fire" was likely the Shuri Castle fire) — no record.
- **Closures:** none new.
- **Geocode:** W8G +14 on the UNVERIFIED queue (2 med NAVITIME — Takatsukiyama, Inazaki; 12 low incl. Yaesen/Takamine/Sakimoto/Iejima
  distilleries); re-verify flags: Kingyū (two listings ~250 m apart), Kura (3-decimal longitude), Kōrakuen (inland point), Yaesen/Sakimoto/
  Hakoniwa (listing page not identified). Address updates suggested: Pengin 大川199-1, Kōrakuen 平得1535-19. W8A pinned 3 existing anime
  (Midori no Yakata Sēfā, Tenbusu Arcanine lid, Uruma Tauros lid — all med). Discovery agents pinned 29 of their 40.
- **Build + gates:** `rebuild-city.py okinawa --build` → sourcecheck PASS (418) · geocheck PASS (high 119 · med 72 · low 153) · statuscheck
  CONSISTENT (0 unchecked) · buildcheck PASS; `npm run validate` DATA OK; `npm test` ALL PASS. Pins 295 → 344. Food share 227/418 = 54 %.
  **ANIME 22 found / 15 pinned** (unpinned: Ryūtan lid, Kinjō Tetsuo/Shōfūen, Azama Sun Sun, Sugar Road, Zamami lid, Ishigaki lid, West Pier).
- **Creators:** ~10 searches across agents — 0 kept (rejections in `CREATORS_OKINAWA_W8*.json`).

## 2026-10-03 — W9 (session_012LmRFpCmy9XHMHT66hkzS3; 7 bg agents, ~190 of ~200 searches; rules `_okinawa_w9_agentrules.md`)
Per-agent logs `_okinawa_W9*_notes.md` hold every query, kept/dropped/held lead and source; summary:
- **Discovery (+33 → 451; 26 food & drink = 79 % of additions):** W9D1 Chūbu food +6 (Taishū Shokudō Mickey, Sam's Anchor Inn Ginowan [1970 first
  branch], Maeda Soba Enobi, Subaya Yūbaru Menkata, Ippe Coppe, Okinawa Soba-dokoro Minami — 3 held leads paired; new key URASOENAVI).
  W9D2 Naha food +5 (Hiikiya shellfish sakaba, Hoshi no Shizuku kokutō zenzai, Kameshima Pan Nichūmae, Charu Soba, Teshiraji Soba [held paired]).
  W9D3 Hokubu +8 (Marutaka Soba [held paired], Anettai Chaya, BLOOM HOUSE, CASA SOL; JUNGLIA Okinawa, Ta-taki Falls, Kuina no Mori,
  OKINAWA Fruits Land; new keys NAGOKANKO, YAMBARU3KANKO). W9D4 Nanbu +3 (Taco Rice Café Kijimunā, Oyaji no Maguro — Umikaji Terrace;
  Hawaiian Pancake Cafe KOA) / KRM +1 (Restaurant Namiji, Kume prawns). W9D5 MYK +6 (Koshibaru Shokudō, Cafe Uesuya [moved to 下里43],
  Miyanohana, Miyako Jinja, Imgya Marine Garden, Cape Nishi-hennazaki) / YAEYA +3 (Shima Soba Ichiban-chi, Shidamē-kan [held paired],
  Ikehara Shuzō; new key ISHIGAKIKEIZAI). W9A anime +1 (Chiikawa Restaurant Okinawa, PARCO CITY Urasoe — RS + KAI-YOU + Mynavi + AnimeAnime).
- **Orchestrator fact-check (removed, held):** Māsā no Mise (Tokashiki — OT cite inferred, tuna-bowl dish unconfirmed), Ikema Shuzō (2nd source
  = prefecture link list), Okinawa Jiryōri Hateruma (JNTO cite inferred; confirm search aggregators only), Yaeyama Soba-dokoro Komatsu — CLOSED
  (closure from one blog title; non-notable closed → drop). KOA's Stripes cite confirmed by a site-limited search. Kojasobaya: "古謝本店 closed"
  signal not confirmed (rurubu 80042987 current hours) → stays open.
- **Held (single-source):** Chūbu — Kawaraya, Shirahamaya, Yomitanzan Soba, Sobe, Cocoroar Cafe, Churuge Soba; Naha — Naha Soba Kinjō, Kugani
  zenzai, Stand Suehiro, Senbero-ya, BOULANGERIE BZ, Chonchon, Kingetsu Soba (moved); Hokubu — Tototo, Uppama, Miyazato, Ichifuji, British Wine &
  Tea Shop; Nanbu/KRM — Kōganeya, Tenten, Iibaru-ya, Kihachi, Restaurant Ryū, Māsā no Mise; MYK/YAEYA — Ikema Shuzō, Eifuku "Tony Soba",
  Tōrin-ji/Gongen-dō (needs BUNKACHO URL), Kato Soba, Mengatē; anime — Gushikawa Soba Ai-chan, Animate Naha, Mangasouko.
- **Koza post-war steak houses:** still a stated gap — no surviving house with ≥2 credible sources (W8D1 + W9D1, ~10 searches).
- **Closures:** none new written.
- **Geocode:** W9G +6 low (Nakijin Soba, Player's Cafe, Yappari Steak 1st — ≥2 listings agree within 12 m; Boku no Mise Ojisan, Zhyvago,
  Shima Gourmet ROCO — single unattributed listing → re-verify). **Apple Maps `allowed_domains` channel: 0 coordinates in ~10 tries across agents**
  (Okinawa results are `place?place-id=`/`auid=` URLs with no `coordinate=`/`ll=`); NAVITIME/MapFan also 0 this wave. W9A: West Pier high
  (ja.wiki), Azama Sun Sun low. Address corrections (W9G notes): Hateruma Shuzōsho 波照間156; Kokusen Awamori → どなん酒造.
  Discovery agents pinned ~22 of 33 (high 4, med 3 incl. Stripes GPS / host-mall ja.wiki point for Chiikawa, rest low).
- **Build + gates:** `rebuild-city.py okinawa --build` → sourcecheck PASS (451) · geocheck PASS (high 124 · med 76 · low 178) · statuscheck
  CONSISTENT · buildcheck PASS; `npm run validate` DATA OK; `npm test` ALL PASS. Pins 344 → 378. Food share 253/451 = 56 %.
  **ANIME 23 found / 18 pinned** (unpinned: Ryūtan lid, Kinjō Tetsuo/Shōfūen, Sugar Road, Zamami lid, Ishigaki lid).
- **Channel mix (kept):** regional press (RS/OT/OTV) ~12 · Japanese travel media (Tabirai/Mapple/Rurubu/Okinawa CLIP/KozaWeb/Smart Magazine/
  cotrip) ~16 · official/municipal tourism (OCVB, Nago, Yanbaru, Urasoe, Kumejima, Taketomi) ~7 · national/anime press (KAI-YOU, Mynavi,
  AnimeAnime, JSS) ~4 · English (Stripes, Feel Japan) ~3 · creators 0 (~7 searches, all rejected).

## 2026-10-03 — W10 (session_01SNdRN4VTyvqgJyuKThEgUA; 6 bg agents + orchestrator, ~196 of ~200 searches; rules `_okinawa_w10_agentrules.md`)
Per-agent logs `_okinawa_W10*_notes.md` hold every query, kept/dropped/held lead and source; summary:
- **Discovery (+62 → 513; 47 food & drink = 76 % of additions) — density CLOSED in every area.**
  W10D1 Chūbu +15 (7 food: Higa Distillery/ZANPA, RuLer's TACORiCE, Rotary Drive-In Kadena, Jimmy's Ōyama, Uehara Zenzai, Gaburi Shokudō,
  Kuwachii Shokudō Aozora; 8 sights: Bios Hill, National Theatre Okinawa, Agena Castle ruins, Nakabaru ruins (Ikei), Shirumichu (Hamahiga),
  Urasoe Art Museum, Yuntanza Museum, Histreet). W10D2 Naha +15 food (Stand Suehiro, Senbero-ya, BOULANGERIE BZ [held paired], Ryōtei Naha,
  Tantei, Shuzen Maeda, Arakaki Chinsukō Honpo, Matsubaraya Seika, Amuro andāgī, KANEHIDE & Sakurazaka breweries, Takara Shokudō, Ikariya,
  Kiraku [Makishi 2F mochiage], Oden Tōdai — CLOSED 2022-09-26, RS). W10D3 Nanbu +10 (9 food incl. Kōganeya [held paired], Yonabaru-ya,
  Inamine shirokuma; Ryukyu Glass Village). W10D4 Hokubu +12 (7 food: Captain Kangaroo, HEY, Nago fishing-port diner, Kaneyan, GATE1,
  Ōgimi Shīkwāsā Park, Bookcafe Okinawa Rail; 5 sights: Minna Island, Nyatiya Cave, Bashōfu Hall, Kin Kannon-ji, Fukuji Dam).
  W10D5 MYK +5 food, YAEYA +2 (Taira Shōten; Tōrin-ji & Gongen-dō — BUNKACHO), KRM +1 food (YUNAMI FACTORY).
  Orchestrator (tag W10O) +2 to close the last gaps: Okinawa Soba Cafe Tenten, Yaese (OTV ×2 + TAGOO — held lead paired) and Kato Soba,
  Kabira (Mapple 29568 + Tabirai 0008549 — held lead paired; Mapple attribution read from the search summary of an exact-name query).
- **Orchestrator fact-check:** Bīdoro (Naha) REMOVED → held (Tabelog Izakaya WEST Hyakumeiten 2025 claim not confirmed by a search).
  Inamine: SuperTaste cite (unconfirmed) replaced by Ryukyu Shimpo 'Uchinā Aji Māi' 92 entry-2425513 + OCVB 600013256. Kōganeya: street
  number 兼城756 came from a summary only → address now 'near Haerun Park, Haebaru' (pin UNVERIFIED). Ōbanmai: Rurubu 8870 confirmed by a
  site-limited search; address → 伊良部前里添1. Kiraku RS URL corrected (style/gourmet/entry-933592) and confirmed; Sakurazaka's Feel Japan
  + OCVB cites confirmed. KITANAKAGUSUKUKANKO = Kitapo, Kitanakagusuku Commerce & Industry Association portal (confirmed, RS PR 204567).
- **Held (single-source):** Chūbu — Kawaraya, Shirahamaya (RS only), Yomitanzan Soba, Sobe, Cocoroar, Churuge, Nankuru 796, New Royal, IMUA;
  Naha — Bīdoro, Kugani, Chonchon, Kingetsu (moved to Makishi 2-5-14); Hokubu — Tototo, Uppama, Miyazato, British Wine & Tea, Ichifuji (+12 in
  W10D4 notes); Nanbu — Iibaru-ya (RS only), Café Bean's, Kalu; islands — Eifuku, Ikema Shuzō, Kihachi, Nanbika, Kanifu, Noriba Shokudō,
  Māsā no Mise. Chūbu closures seen (not on map): Sankaku Shokudō (closed 2024-05-31), Oden Ikoi.
- **Duplicate caught:** held 'Naha Soba' = existing Naha-tei (RS 4699630: reopened 2025-10-17).
- **ANIME:** 0 new (Animate Naha, Mangasouko, Ani-Mall dropped — blog/JapanTravel only; Gushikawa Soba Ai-chan held, Mapple only).
  5 unpinned lids/sites stay UNVERIFIED (no venue coordinate surfaced in 14 searches). Okitsura/Gushikawa confirmed in Anime Tourism 88
  2026 edition (Weekly ASCII 4375764). **ANIME 23 found / 18 pinned.**
- **Build + gates:** `rebuild-city.py okinawa --build` → sourcecheck PASS (513) · geocheck PASS (high 132 · med 80 · low 196 = 408 pins) ·
  statuscheck CONSISTENT · buildcheck PASS; `npm run validate` DATA OK; `npm test` ALL PASS. Food share 300/513 = 58 %.
