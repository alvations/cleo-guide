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
