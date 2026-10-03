# Osaka — AUDIT (append-only, one section per stage/wave)

## 2026-10-02 — scaffold
- Areas (9), Japan taxonomy (`tools/japan_consolidate.py`), wrappers, registry keys. No places yet.

## 2026-10-02 — Wave W1 (TRUNCATED: session WebSearch budget exhausted, 200/200)
**What ran.** ~22 WebSearch calls by this agent before the session-wide WebSearch cap (200 calls, shared by all
~16 concurrent agents) was hit; every further search is refused ("this session has used its web search budget").
Nothing was fabricated to fill the gap.

**Stage 1 — sources discovered (registered via `SOURCES_OSAKA_W1.json`):** MICHELIN_BIB / MICHELIN (Michelin Guide
Japan 2026 Osaka-region venue pages — institutional, lone-solo; the venue pages ALSO expose the place's lat/lng, a
real place pin — the best restaurant-geocoding channel found for Japan), JAPANGUIDE (e4002 Umeda Sky, e4009 Kita),
OSAKAINFO (official bureau: area_kita, Temma spot 204), TIMEOUT (Osaka best-things list), WIKIPEDIA (sight coords).
Rejected as sources: hotel "sightseeing" pages (granbellhotel, hotelkeihan), jw-webmagazine, japankuru, theplanetd,
makemytrip, sygic, haveagood-holiday (SEO/aggregator, unbylined). Inside Osaka and Japan Travel (JAL) noted as
candidate corroborators — not yet vetted.

**Stage 2/3 — extracted & fact-checked (channel counts: Michelin 27 · editorial/official 4 · creators 0 · local 0):**
- FOOD (24 kept, `FOOD_OSAKA_W1.json`): Michelin 2026 Bib Gourmand / Selected, each with the venue-page address:
  udon (Oudon Yomogi, Udondokoro Shigemi, Udonbo Osaka Honten, Udonya Kisuke, Ogimachi Udonya Asuro, Aozora Blue),
  soba (Soba Takama, Sobakiri Gaku, Sobakiri Arabompu, Ayamedo, Sobadokoro Toki, Naniwa Okina), ramen (Chukasoba
  Uemachi, Ramen Kuon, Ramen Hayato), tonkatsu (Minato, Fujii, KATSU Hana, Kyomachibori Nakamura), Tempura Kozaki,
  Kushikatsu Gojoya, Izakaya Tokitame, Yakitori Ichimatsu, Yakitori Torisen. Status: open (listed in the 2026 guide).
- HELD pending address (`_held_W1.json`): Jibundoki, Tanpopo, Oribe (Bib 2026 confirmed; ward not surfaced, so no
  area can be assigned honestly). Also Sumisho Mikuriya / Sumibi Iwata (named as new Bib yakitori, no page/address).
- SIGHTS (4 kept, `SIGHTS_OSAKA_W1.json`): Umeda Sky Building (t1 KITA), Osaka Tenmangū, Japan Mint cherry passage,
  HEP Five Ferris Wheel — each ≥2 credible.
- HELD single-source (`_held_W1.json`): Shitennō-ji (Wikipedia only; coord already verified 34.6539,135.51645),
  Osaka Castle, Dōtonbori, Kuromon Market (Time Out only), Hōzen-ji/Yokochō (non-credible pages only),
  Tenjinbashisuji, Museum of Housing and Living, Nakanoshima Museum of Art, Temma Tenjin Hanjo Tei (OSAKA-INFO only).
- No Michelin takoyaki/yakiniku Bib surfaced — the konamon/horumon canon needs the editorial channel (W2).

**Stage 5 — geocode (`geo/_geoout_osaka_W1.json`):** 4 high (Umeda Sky, Tenmangū, Japan Mint — Wikipedia infobox;
Kushikatsu Gojoya — Michelin venue-page geo), 1 UNVERIFIED (HEP Five). The other 23 Michelin restaurants are not yet
geocoded (each needs one Michelin-domain query; ~1 search/place).

**Stage 6 — build:** NOT built / NOT live. 4 geocodable pins across 2 of 9 areas is not a guide; per protocol §6 the
card stays "Being built" and Japan is not flipped live.

## 2026-10-02 — Wave W2 (session 2) — discovery + geocode, first build
**Searches.** Main agent ~49 + background workers G1 13 (Michelin pins for W1), S1 29 (outer-area sights), M1 45
(Michelin harvest) = ~136; M2 (Michelin leftovers, ≤25) running at time of writing.

**Stage 1 — sources discovered / vetted** (`SOURCES_OSAKA_W2.json`): CATHAY (Cathay Pacific inspiration editorial,
named venue per dish — one ordinary source), LONELYPLANET, INSIDEOSAKA (resident-written local English guide —
corroborating), OSAKAINFO incl. Discover Osaka's Japan Konamon Association picks, MICHELIN_STAR, UNESCO, FEELKOBE.
Rejected/zero: mapple / aumo / kinarino / tsunagujapan / gltjp / karaksahotels / haveagood-holiday / byfood /
trazy / foodle.pro / jw-webmagazine (aggregators, SEO, tour sellers); **Tabelog まとめ (user matome) pages are NOT
Hyakumeiten** — zero. osakatourism.org (unofficial, unvetted) — not counted.
**Dead ends:** mapcarta/OSM search for restaurant pins (no venue pages surfaced); Michelin-domain queries for
street-food names not in the current guide (Aizuya, Wanaka, Hanadoko; Gofuso/Sushi Moriya/Kappo Matsuya/Tsunechan)
— each MISS makes the tool fan out into 4–5 sub-searches (budget burn); creator queries (Paolo fromTOKYO / Abroad in
Japan / Best Ever Food Review / Mark Wiens; "Somebody Feed Phil" has no Osaka episode) returned no findable
per-venue piece — creator channel contributed 0 this wave (stated, not filled).

**Stage 2/3 — extracted & fact-checked (channel counts):** Michelin (lone authority) 42 (M1) + 9 (main: 4
okonomiyaki Bibs incl. the 3 held W1 Bibs now addressed, 5 new-2026 Bibs) · editorial/official ≥2 sources: food 6
(Kogaryu Honten, Juhachiban Dotonbori, Matsuba Sohonten, Kushikatsu Daruma Shinsekai Sohonten, Wanaka Sennichimae,
Azuma Ikeda) · sights 24 (main) + 33 (S1) · creators 0 · local (Inside Osaka) 2 corroborations.
- MEASURED & DROPPED / HELD single-source → `_pending_osaka_W2.json` (Time Out-only: Hanadoko, Takoriki, Akaoni,
  Takotako King, Takonotetsu, Hoso Udon Kuromon Sakae, Takoume, Kadoya Shokudo, Tonkatsu Koshiro, Nose Arata, Yugen,
  Teppan Sakaba Hiro, Koala Shokudo, Ikemen Tomikura, Time Out South list (Sushi Moriya, Tsunechan, Babbaluci, Yuko,
  Gofuso, Cochon d'Or Kitano, Kappo Matsuya, Sushiyoshi), Time Out East (Yakiniku Queen, Kanmi Ichi…); OSAKA-INFO-only:
  Yukari Sennichimae, Hontonpei, Okonomiyaki Den, AT THE 21, Kinguemon Dotonbori, Tsuruhashi Market, Doguyasuji);
  `_held_S1.json` (Sakai crafts museum, Rikyū/Akiko plaza, Danjiri Kaikan, EXPOCITY, Santa Maria, Tempozan Market).
- Chains dropped as padding: Botejyu, Daiki Suisan, Yamachan, Chibo, Fugetsu.
- **Closures:** Osaka Museum of Housing and Living closed for renovation until 2027-01-05 (japan-guide e4024) —
  not added as live. No permanent closures among added places.
- Michelin distinctions cited from the 2025 guide for 5 M1 venues (Oimatsu Kitagawa, Shokudo Akari, Shitennoji
  Hayauchi, Sakeya Sakana Yoshimura, KushinGarando) — venue pages live; statusSource says so honestly.
- Kobe/Hyōgo: Michelin's first Kobe & Awaji selection is announced Feb 2027 — no current Hyōgo Michelin; KNSAI food
  needs editorial sources (gap stated).

**Stage 4 — re-rank:** Teruya, bistrot neuf, Yakitori Matsuoka moved MINAM→CHUO (Tohei/Ueshio = Tanimachi side).
**Stage 5 — geocode:** Michelin venue-page lat/lng (G1 24/25, M1 35/44, main 6), Wikipedia infobox (sights).
med: Tempura Kozaki (~0.5 km S of expected block — re-verify), Kitashinchi & Nakazakichō (station pins inside the
district), Grand Green (3-decimal). UNVERIFIED (held for helper): Udonya Kisuke, 9 M1 venues, non-Michelin
street-food (Kogaryu, Juhachiban, Matsuba, Daruma, Wanaka, Azuma), Shinsaibashi-suji, Amerikamura, Kuromon, Tenjinbashi-suji,
Nada breweries, KIX Sky View, Little Okinawa.
**Stage 6 — build:** `rebuild-city.py osaka --build` → 140 discovered, 115 pins on page; sourcecheck PASS,
geocheck PASS (high 112 · med 3), statuscheck CONSISTENT, buildcheck PASS; `npm run validate` + `npm test` PASS.

## 2026-10-02 — W2 close-out (M2 + Michelin article mining + go-live)
- M2 worker: 37 Michelin venues (36 pinned); 3 held to `_held_M2.json` (LE PONT DE CIEL, Kosai Fukumimi, Hachidori —
  no cuisine/dish surfaced; a food card must name a dish). Caveats kept from the worker: SUSHI/TEMPURA tags for
  name-evident sushi-/tempura-ya; "Japanese" → KAISEKI (M1 convention); Souikufu Bib cited from 2023.
- Main: Michelin "9 New Bib Gourmands 2025" → Ueroku Wine (TNJ), Daidokoro Kamiya (CHUO) pinned; "December 2025
  latest additions" → Tempura Sakugetsu, Tempura Fukana, Osteria Ottanta Sette, JIANG NAN CHUN, Wagyuchugokusai
  Kumanohanare pinned (Kushikatsu Daibon was already in M1); Nishideria/RiVi held (cuisine not surfaced), PRESTAU held
  (address not surfaced). jawiki coords: Kuromon, Shinsaibashi-suji, Amerikamura, Nakanoshima Museum of Art, Keitakuen,
  Tennōji Park, Tenjinbashi-suji (med, north-end station). Aizuya added (Lonely Planet + ja.wikipedia 会津屋), pin UNVERIFIED.
- Kobe food: japan-guide e3564 Kobe beef page names only a sponsored (brands.japan-guide) venue — not counted; gap stated.
- **Build:** 189 discovered, 166 rendered (61 sights + 105 food), high 161 · med 5; 4 gates PASS; validate + test PASS.
- **Go-live:** Japan hub CARD:osaka → live link; root CARD:japan "2 of 5 maps live"; CITIES.md row.
- Channel mix (W2 total): Michelin 102 · editorial/official (japan-guide, OSAKA-INFO, Time Out, Lonely Planet, Cathay,
  Wikipedia) 63 sights + 7 food · local (Inside Osaka) 2 corroborations · creators 0 (searched, none findable — stated).

## 2026-10-02 — W2 tail (Minami canon + sights)
- jawiki "<名称> 座標" ×3 per query + OSAKA-INFO spot pages as the 2nd source: Ebisubashi & Glico sign, Namba Yasaka
  Shrine, NGK, Jan Jan Yokochō (pinned); Sennichimae Doguyasuji (UNVERIFIED pin). Shochikuza held (jawiki only).
- Canon food via OSAKA-INFO features + ja.wikipedia shop articles: **Usamitei Matsubaya** (kitsune udon birthplace),
  **Jiyuken Namba Honten** (1910 mixed curry) — pins UNVERIFIED. Held single-source: Dotonbori Imai (OSAKA-INFO),
  551 Hōrai honten (jawiki).
- Audit fix: street numbers typed without a source were stripped to the sourced locality (31 address fields across
  W2 sight/geo files); Michelin / OSAKA-INFO / jawiki-sourced addresses kept.
- Rebuild: 196 discovered, 170 rendered (65 sights + 105 food); high 165 · med 5; 4 gates PASS.
- Final adds: 551 Hōrai Honten (Time Out "10 things you must eat" + ja.wikipedia; pin UNVERIFIED), Tempura Urakami
  and PRESTAU (Michelin, pinned). Held (cuisine not surfaced): Shunsaiten Tsuchiya, Hiraishi, OIMATSU Tempura Suzuki,
  Numata; Roushouki (Kobe) single-source. **Final: 199 discovered, 172 rendered (65 sights + 107 food); high 167 · med 5;
  4 gates PASS.** Session closed at ~202 searches (main ~90 + workers 112); next wave per RESUME "Next actions".

## 2026-10-02 — W3 (session 3): parallel workers + main drinks/canon
Workers (brief `_W3_worker_brief.md`, no git; main consolidates):
- **W3A** MINAM Michelin (30 searches): Michelin Minami is **exhausted** — every Namba/Shinsaibashi/Sennichimae venue
  returned was already in the dataset. +24 Michelin (MINAM 4, CHUO 12, KITA 8), 28 high pins. Held 15 (pinned, no dish
  surfaced): Rakushin, Empathie, Naniwakappo NOBORU, xiang hua, isolata, Ajikitcho Bumbuan, Ajikitcho Horieten, Macauda,
  Fujiichi, Fujiya 1935, NELU KORAIBASHI, Chi-Fu, DuKKAh, P greco, La bonne tâche. DROPPED: Chukasoba Mugen (venue page
  shows only "Bib Gourmand 2024" — may have left the selection).
- **W3B** ANIME (25): +4 sights (LUCUA Characters World — Pokémon Center Osaka & Nintendo OSAKA moved there 2026-04;
  Tezuka Osamu Manga Museum, closes 2026-12-01→2027-03-04; Tetsujin-28 monument; Kobe Anpanman Museum) + 2 cafés
  (Pokémon Café, Kirby Café — both Daimaru Shinsaibashi 9F). Tagged existing USJ, Den Den Town, Tower of the Sun,
  CupNoodles Museum with `anime`. Held: Mandarake Grand Chaos, Jump Shop, Animate (single-source); dropped Gundam Base
  Osaka (doesn't exist; KITTE Gundam Café was a finished pop-up). New key SILICONERA (major games-news outlet).
- **W3D** outer Michelin (30): +23 (CHUO 18, TNJ 4, NORTH 1). Michelin search by suburb (Sakai, Toyonaka, Suita…) returns
  only Osaka-wide list pages — **dead end for SOUTH/EAST/BAY/NORTH**; those need editorial sources (W3F). Yoshinosushi's
  hakozushi dish corroborated by Mark Wiens (Migrationology) — added as CREATOR_MARKWIENS.
- **W3E** pin backlog (18): 17 high from Michelin venue pages. **Mashino Ken rejected**: venue-page coord sits ~1.3 km
  from its 1-3-6 Awajimachi address → UNVERIFIED (helper). Unresolved: Yoshinosushi, Kitahama Anagoya.
  Fixes: gastroteka bimendi → MICHELIN_BIB; Nishishinsaibashi Yuno URL → /nishishinsaibashi-yuno.
Main W3M (~27 searches): drinks/coffee/canon with ≥2 keys — Craftroom & Bar Nayuta (Time Out + Asia's 50 Best Bars),
Izakaya Toyo (Time Out + Netflix Street Food: Asia), Ult Coffee Roasters (Time Out + World's 100 Best Coffee Shops 2026
No. 24), Marufuku Coffee (Time Out + OSAKA-INFO), Hanadako (Time Out + Inside Osaka; promoted from pending),
Dotonbori Imai (OSAKA-INFO + Inside Osaka + Lonely Planet; promoted), Chibo, Mimiu (udon-suki), Hokkyokusei (omurice,
1925), Misono Kobe (teppanyaki origin 1945; Feel Kobe + Daily Sports), Roushouki (Visit Hyogo + ja.wikipedia; promoted).
Held single-source: Bible Club Osaka(→W3G), Bar Shiki, Bar Juniper, Bar Hiramatsu (50Best Discovery only), Bar Bota,
Tachinomi Shomin, Matsuura Liquor, Winestand Perche, Uoyaki, Tiger Lily, Make One Two (Time Out only), Beer Belly
Tosabori (Time Out JP only), Minoh Beer Warehouse (rurubu only), Takoyaki Yoriyabunzaemon (LP only), Yukari (branch
mismatch: OSAKA-INFO Sennichimae vs Inside Osaka Kita). Dead ends: Tabelog 百名店 list pages (image-only results), Mark
Wiens video search (use migrationology.com domain instead — works). Creator channel now live: Mark Wiens (Migrationology,
~11M YouTube) — attached to Yoshinosushi; his guide also names Kogaryu, Kushikatsu Daruma, Endo Sushi, Ramen Yashichi.
Restaurant pins for non-Michelin W3M places: UNVERIFIED (no place pin surfaced) → geocode helper.
Mid-wave rebuild: 293 discovered; 4 gates PASS; validate + npm test PASS.

**W3 close-out:** W3C +41 sights (held back Nanshū-ji, Mizuma-dera → `_held_W3C.json`: their OSAKA-INFO pages did not name
them; Osaka Museum of Housing and Living card notes renovation closure until 2027-01-05). W3F +5 (Daiko Sushi, Tsuruhashi
Fugetsu, Minoh Beer WAREHOUSE, Kanbukuro, Kappo Matsuya — SERAI (Shogakukan) accepted as a national magazine), all pins
UNVERIFIED; stopped at the cap. W3G (MINAM editorial) partial. Session hit **200/200 searches**.
**Final build:** 319 discovered (114 sights + 205 food, 64% food), 266 rendered (104 + 162); sourcecheck PASS, geocheck PASS,
statuscheck CONSISTENT, buildcheck PASS; validate + npm test PASS. ANIME 10. Channel mix W3: Michelin 64 · editorial/
official (Time Out, OSAKA-INFO, Inside Osaka, LP, japan-guide, Feel Kobe, Visit Hyogo, Wikipedia, Asia's 50 Best, World's
100 Best Coffee Shops, Netflix) ~70 · creators 1 (Mark Wiens, 3 attachments).
W3G (MINAM editorial, 13 searches before the cap): +10 — Meoto Zenzai, Kani Doraku Dōtonbori Honten, Kinryu Ramen,
Harijyu (high pin, jawiki), Dōtonbori Kamukura, Kinguemon Dōtonbori (promoted), Chitose (nikusui birthplace), Rikuro
Ojisan Namba Honten, Takoya Dōtonbori Kukuru, Bible Club Osaka (promoted). Caveats to re-verify next wave: Meoto Zenzai's
2nd source is the ja.wikipedia 夫婦善哉 page (may be the novel/disambiguation, weakest link); the Time Out Dōtonbori guide
URL for Kani Doraku/Harijyu/Kukuru came from a search summary. Held (single-source): Dotonbori Akaoni (Bib 2016–18 lapsed),
Takotako King, Daitako, Tiger Lily, Winestand Perche, Stand Umineko, Bar Jazz, Ajinoya, Shimauchi Fujimaru Brewery,
Sennariya, Kurogin Maguroya.

## 2026-10-03 — Wave W4 (session 4): 6 background workers × 28 searches + main
**Stage 1 — new outlets vetted (`SOURCES_OSAKA_W4.json`, `SOURCES_OSAKA_W4A.json`):** NIPPONCOM (nippon.com), RURUBU and
GLTJP (JTB Publishing), INSIDEKYOTO (Chris Rowthorn), SAKAITCB (Sakai official tourism), WAKAYAMATOURISM, ARIMATOURISM,
HYOGOTOURISM/VISITHYOGO, JNTO, KOBENP (Kobe Shimbun), KUMANICHI (Kyodo wire). Decision: all accepted as ordinary credible
sources (official tourism bodies / established publishers / newspapers); none is a lone authority.
**Stage 2/3 — written (+49; channel counts in worker reports: Michelin 1 · editorial ~30 · official/municipal ~15 ·
Wikipedia ~15 · Tabelog100 2 · creator 1 (Ramen Adventures, Ide Shoten) · local press 3):**
- W4A MINAM food 5 (Takoume Honten, Fukutaro, Mizuno, Ajinoya, Kushinobo) — status `unknown` (not yet closure-checked), pins UNVERIFIED.
- W4B 13 sights: anime +6 (Super Nintendo World, Nijigen no Mori, Takarazuka Grand Theater, Hello Kitty Smile, Kissa-ya Dream
  [Haruhi], Niteko Pond Grave-of-the-Fireflies memorial) + Central Public Hall, Ohatsu Tenjin, Mitsu-dera, Kamigata Ukiyo-e,
  Orange Street, Ura-Namba (sponsored japan-guide /ad/ source replaced by Inside Osaka Minami page — main search), Osaka
  Shochikuza **— CLOSED** (last show 26 May 2026, ja.wikipedia + Kyodo).
- W4C TNJ/EAST 7 (Yaekatsu, Yakiniku Sora, Kissa Doremi, Isshin-ji, Abe no Seimei, Imamiya Ebisu, Smartball New Star).
- W4D SOUTH 10 (Kojimaya, Yaogen Raikodo, Tsuboichi, Tsunechan, Gofuso, Toretore Ichi; Densho-kan & Rishō no Mori promoted
  from `_held_S1`, Nisanzai Kofun, Sumiyoshi Park).
- W4E BAY 6 (RODDA group; municipal ferries, Nanko Bird Sanctuary, Santa Maria, ATC, LEGOLAND Discovery Center).
- W4F KNSAI/NORTH food 8 (Mouriya, Steakland, Wakkoqu, Freundlieb, Nishimura Coffee, Ide Shoten, Mitsumori Honpo; Ichiju
  Nisai Ueno Minoten — recorded as MICHELIN (listed) not STAR: the venue page only said "listed").
- HELD single-source + MEASURED & DROPPED → `_held_W4.json`.
**Channel lessons:** Michelin is dead for the suburbs/bay wards (search returns only central Osaka; Hyōgo guide not until
2027-02-16). asahi/mainichi/nhk/sankei/yomiuri/cntraveler are rejected as `allowed_domains`. Yield ≈ 0.3 places/search.
**Geocode:** W4 high 15 · med 3 · unverified 31. **Build:** 368 discovered (140 sights + 228 food = 62% food), 286 rendered;
sourcecheck PASS · geocheck PASS · statuscheck CONSISTENT · buildcheck PASS · validate + npm test PASS. ANIME 16.

### 2026-10-03 — W4M (main): +4 Michelin food (Man-u, Yoshiko 1★, Macauda, il luogo di TAKEUCHI), all 4 pinned from Michelin
venue pages (high); dish from Michelin editorial ("Naniwa on a Plate", "casual lunches under ¥2,000"). Ura-Namba: sponsored
japan-guide /ad/ source replaced with Inside Osaka (Minami area). Searched & missed: Tengu (OSAKA-INFO kushikatsu pages don't
name it), Hozenji Sanpei. Held 14 Michelin leads with no dish surfaced; dropped Tominoya (see `_held_W4.json`).
Final W4 build: 372 discovered / 290 rendered; 4 gates PASS; validate + npm test PASS. Main searches ~17; session total ~185.

## 2026-10-03 — Wave W5 (session 5): 6 background workers + main
Brief: `_W5_worker_brief.md` (W4 brief + Japanese-language channel, 25% pin reserve, closure status per record).
**Stage 1 — outlets proposed/vetted (`SOURCES_OSAKA_W5{A-E}.json`):** LMAGA (Lmaga.jp / Keihanshin L Magazine), WALKERPLUS
(Kansai Walker, KADOKAWA — `/article/` pieces only, not `/release/`), TVTOKYO (Adomachi Tengoku broadcaster pages), OSAKAMETRO /
METRONINE (Osaka Metro's own OsakaMania / Metro NiNE guides), COTRIP (Shobunsha), ALLABOUT (named-expert guides), OGGI & WARAKU
(Shogakukan magazines), DAILY (Daily Sports), OSAKACITY (municipal PDF), YAHOOEXPERT (corroborating only — weaker). Accepted as
ordinary credible sources. **Rejected by main: KANPAI** (enthusiast blog) → Hozenji Sanpei back to held.
**Stage 2/3 — written (+26 net: 372 → 398):**
- W5A BAY +6: Yasubei (TABELOG100 + TVTOKYO), Aabel Curry, Sawashi Shoten 沢志商店 (sata andagi; romanization of 沢志 is the
  worker's own reading), TUGBOAT_TAISHO, ★ Kinopio's Café (Super Nintendo World; WIKIPEDIA + TIMEOUT), Kirara Kujō.
- W5B EAST 0 — every Tsuruhashi/Kyōbashi lead single-source (13 held).
- W5C TNJ +7: Tengu (promoted), Tsuriganeya Honpo, Sennariya Coffee (status unknown — changed hands 2018–19), Chausuyama Kofun,
  Yasui Shrine, Sankō Shrine, Hinode-yu.
- W5D MINAM +6: Sennichimae Hatsuse; ★ Mandarake Grand Chaos, ★ Super Potato, ★ Animate Nipponbashi (street number dropped —
  unclear source), ★ Kuidaore Taro; Misono Building **— CLOSED** (5 Jul 2025; OSAKAINFO + TIMEOUT + jawiki).
- W5E +7: NORTH Hisakuni Kōsendō, Momotaro (momiji tempura, promoted), Menya Hakkaisan, Saishiki Ramen Kinsei, Le Sucré-Coeur;
  KNSAI Okonomiyaki Aomori (sobameshi birthplace; FEELKOBE + KOBENP); SOUTH Shin-an & Ōbai-an tea houses.
**Main review — held back:** Niji no Hotoke (Oggi URL could not be confirmed to name it, 1 search), Mentokokoro 7 (two creators
only + status unknown), Taishō Salon Hige to Boin (the "TABELOG100" link was the shop's own Tabelog page), Hozenji Sanpei (KANPAI).
Manmasa/Tsuruichi: Walkerplus 217892 checked by main — does not name them. All held → `_held_W5.json`.
**Closure re-check:** Osaka Shochikuza stays **CLOSED** — Time Out's "last-minute reprieve" (Apr 2026) is a plan to rebuild in another
form; last performance 26 May 2026, demolition planned (Kumanichi/Kyodo). Zuboraya (2020) and Futami no butaman (2024) closures
noted as candidate CLOSED cards (single source).
**Geocode (W5G + workers):** +8 high (HEP Five wheel, Sakai Densho-kan = 堺HAMONOミュージアム, capi [Michelin], Super Nintendo World
re-pinned to the Mario Kart ride coord (4b), Chausuyama, Yasui, Sankō, Misono Bldg); Mashino Ken's Michelin coord is ~1.5 km off
its own address → kept UNVERIFIED. W4A five closure-checked → open (addresses corrected). Channels tested & dropped: openstreetmap.org
(no node pages in results), Google `!3d!4d` (none surface). Rejected district coords for Doguyasuji, Tsuruhashi market, Danjō Garan, KIX.
**Build:** 398 discovered (151 sights + 247 food = 62% food), 297 rendered (126 + 171); ANIME 21 (+5); sourcecheck PASS ·
geocheck PASS · statuscheck CONSISTENT · buildcheck PASS · validate + npm test PASS.
**Channel mix W5:** Michelin 0 · Tabelog100 5 · editorial ~45 · official/municipal ~15 · Wikipedia ~10 · creators 2 (Ramen Adventures).
**Yield:** ≈ 0.15 places/search (26 places / ~175 searches) — the outer areas are near single-source exhaustion on the WebSearch
channel; most shops have exactly one credible editorial mention. Searches: workers 171 + main ~5.
**W5M (main, ~18 searches incl. reviews):** promotion attempts, 0 cleared — Kajikasō (Lmaga 2024/11/862200 compares Kōsendō vs
Momotaro only; Lmaga is a usable 3rd source for those two), Tachinomi Shomin (no 2nd key in Lmaga/Walkerplus/OSAKA-INFO), Taishō
Okinawan cluster (Walkerplus 107265 + osaka-info `local_journey/stopby-osaka/little-okinawa` — whether the latter names Omoro/Usupare
is unconfirmed, next wave should check it), Ryukyu Shimpo entry-819474 says Osaka "Sōkiya" (ソーキ家, Takushi Tsutomu) got a Michelin
listing for Okinawan cuisine — no Michelin venue page found, held. Jump Shop / Donguri / Kiddy Land Umeda: only OSAKA-INFO + a
japan-guide forum (0) → held; Metro NiNE spot pages exist for Gashapon Department Store HEP FIVE (1 key). Ikuno Koreatown: OSAKA-INFO
/ Metro NiNE pages name no individual shops. Sawashi Shoten: the reading of 沢志 (possibly Okinawan "Takushi") is unconfirmed —
re-check and rename if a source gives the reading. Session total ≈ 190/200 searches.

## 2026-10-03 — W6 (session 6): held promotions + JP/EN Kansai editorial + ★anime + geocode attempt (5 bg workers + main)
Workers: W6A EAST+BAY (39 searches), W6B MINAM (45), W6C TNJ/SOUTH/NORTH/KNSAI (38), W6D ★anime (27), W6G geocoder (29); main 2.
Per-worker detail (queries, MEASURED & DROPPED, held): `_note_W6{A,B,C,D,G}.md`; consolidated held list `_held_W6.json`.
**Added (+38 discovered; 398 → 436):**
- W6A +7 food — EAST Katamachi Kawaguchi (Michelin ★ 2025, kaiseki, pinned), Yamada Shōten, Manmasa, Okamuro Saketen (promoted),
  Izakaya Marushin (dancyu + Walkerplus); BAY Omoro Taishō Honten, Kijimunā no Mori (promoted; status unknown — Lmaga 2020 says
  inside TUGBOAT_TAISHO 1-11-14 Sangenya-nishi vs a Hot Pepper 1-6-4 listing; resolve before trusting the address).
- W6B +11 food +1 sight (MINAM) — Junkissa American, Naniwa Menjiro (Michelin + 百名店, pinned), Shōben Tango-tei, Creo-Ru, Jūtei,
  Okonomiyaki Yukari Sennichimae (promoted W2 pending), Rokukakutei (status unknown — star only in a 2009 Michelin editorial),
  Menya Joroku, Meijiken, Grill Baranoki, Daimaru Shinsaibashi Main Building (Vories; pinned).
- W6C +6 food +5 sights — TNJ Okonomiyaki Den (promoted) + Aizen-dō Shōman-in, Abe Ōji, Abeno Shrine, Spa World (4 jawiki pins),
  Tennōji Seven Slopes; SOUTH Fukase-zushi, Nakai Grill, Iwashibune (promoted SAKAITCB singles), Torimi kashimin-yaki; KNSAI Honke
  Arochi Marutaka (Wakayama ramen).
- W6D +9 ★anime sights — Jump Shop Shinsaibashi + Kiddy Land Umeda (promoted), Shinsaibashi PARCO character floors (Chiikawa Land,
  Donguri Republic), Joshin Super Kids Land, Volks Osaka Showroom, Gashapon Department Store HEP FIVE (inside Bandai Namco Cross Store
  since 2023), Kaiyodo Hobby Land Kadoma (status unknown), Amako Sōbē Manga Gallery Amagasaki (Nintama Rantarō; JATA88 credit seen
  in a search summary — re-confirm), Tomogashima (Summer Time Rendering; JATA88 2023).
**Main review:** Grill Baranoki — Walkerplus 181940 (関西の洋食店 グラタン4選) confirmed by a main search. Horumon Jibie Myōjō — TABELOG100
tachinomi 2025 confirmed, but its 2nd source (Lmaga × Caption by Hyatt shop list) is partner/sponsored content → 0; **moved to held**.
New outlets accepted: `MAPPLE` (Shobunsha's guidebook web arm, editor-written spot pages — same standing as RURUBU; W6C had treated
it as an aggregator, overruled), `JALONTRIP` (JAL's bylined travel magazine), `WAKAYAMATOURISM`, `VISITWAKAYAMA`. Spa World's OSAKA-INFO
page is the e-Pass facility page — still the official tourism body, accepted.
**Flags checked, no change:** W6D noted the Daimaru Umeda → LUCUA SOUTH conversion; the LUCUA Characters World card already cites
japan-guide (7 Apr 2026) for the April 2026 opening — kept. W6G read Mandarake at Amerikamura from en.wikipedia; that article predates
the Dec 2020 move to 4-12-6 Nipponbashi (Metro NiNE) — kept.
**Geocode:** W6G 0/101 pins in 29 searches (ja.wikipedia articles exist for 道具屋筋, 鶴橋商店街, 公営渡船, 自由軒, 金龍, かに道楽, 神座, 金久右衛門,
にしむら珈琲店, 灘五郷, 大仙公園 but none surfaced a place coordinate; Michelin gave none for Kisuke/Yoshino/Matsubaya/Mimiu/Anagoya);
rejected parent/district coords (Kōya, Maishima, KIX, 千日前, 鶴橋, 大仙公園, 法善寺). Mashino Ken Michelin coord 34.673359,135.517416 is
~1.5 km SE of 1-3-6 Awajimachi — stays UNVERIFIED. Workers pinned 12 new (high 7, med 5 = building-level jawiki coords for shops).
**Build:** 436 discovered (166 sights + 270 food = 62% food), 309 rendered (136 + 173); **ANIME 30** (+9); sourcecheck PASS · geocheck
PASS · statuscheck CONSISTENT · buildcheck PASS · validate + npm test PASS. Density: KITA 102/80 OK · CHUO 56/45 OK · KNSAI 42/40 OK
(newly OK) · MINAM 78/95 (+17) · EAST 24/35 (+11) · BAY 26/35 (+9) · TNJ 47/55 (+8) · SOUTH 32/40 (+8) · NORTH 29/35 (+6).
**Channel mix W6:** Michelin 3 · Tabelog100 ~8 · editorial ~45 (Walkerplus, Lmaga, Mapple, Rurubu, TV Tokyo, Time Out, Savor Japan,
dancyu, Metro NiNE/OsakaMania) · official/municipal ~10 · Wikipedia ~10 · JATA88 2 · creators 1 (Ramen Adventures, corroborating).
**Yield:** ≈ 0.21 places/search (38 / ~180). Session total ≈ 180/200 searches.

## 2026-10-03 — W7 (session 7) round 1: workers A MINAM · B EAST+BAY · C TNJ+SOUTH · D NORTH+★anime · E/F MapFan geocoders
Searches: A 38 · B 39 · C 37 · D 32 · E 22 · F 50 · main 5. Per-worker detail (queries, MEASURED & DROPPED, held): `_note_W7{A,B,C,D,E,F}.md`.
**Added (+19 discovered; 436 → 455):**
- W7A +5 food (MINAM 4 + CHUO 1) — Arabiya Coffee (TABELOG100 kissaten + OSAKAMETRO junkissa_09, URL confirmed by a main search),
  Men no Yōji (TABELOG100 + Ramen Beast), Tonkatsu Kōshirō (TIMEOUT + TABELOG100), Dotonbori Akaoni (TIMEOUT + MAPPLE 6243),
  Ikareta Noodle Fishtons (TABELOG100 + Ramen Adventures; Shinmachi → CHUO for consistency with Oribe).
  **Main review → held (`_held_W7.json`):** Menshō Shisei (Ramen Beast URL was guessed; no page on recheck), Maguroya Kurogin
  (Time Out Kuromon page doesn't name it; Savor Japan "Kuragin" identity unconfirmed).
- W7B +5 food — EAST Tsuruichi Honten, Yakiniku Yoshida Shinkan (RURUBU + MAPPLE); BAY Taishō Salon Hige to Bōin (OSAKAMETRO +
  TABELOG100), Sakamoto Sushi (MICHELIN_BIB 2026, pinned high), Akamaru Shokudō (OSAKAMETRO + OSAKACITY — Minato ward office,
  accepted as official municipal). Kijimunā no Mori: address street number withheld (1-1-14 vs 1-11-14 conflict). W7B's
  "Yoshiko is in Minato-ku" flag NOT applied — our Yoshiko is the Kitashinchi fugu star (1-8-5 Sonezakishinchi); different venue.
- W7C +6 food +1 sight — TNJ Itamae Yakiniku Itto (promoted, dish surfaced), Abeno Takoyaki Yamachan, Shinsekai Market & yatai;
  Kiyomizu-dera Osaka (pinned); SOUTH Sushi Moriya (Sakai), Yamato (kashimin-yaki origin; JALONTRIP accepted in W6), Izumisano
  Aozora Ichiba. Dropped: Mentokokoro 7 (closed 2022), Horumon Ready Go (owned by a YouTuber → not independent).
- W7D +2 ★anime sights — Taiyoshi Hyakuban (Demon Slayer Entertainment District pilgrimage; MAPPLE + OSAKAINFO + jawiki, pinned high),
  Capcom Store & Cafe Umeda (promoted; now LUCUA SOUTH 13F; LMAGA + GAMEBUSINESS). Expo '70 Tower of the Sun record gained an
  `anime` note (Crayon Shin-chan Otona Teikoku / 20th Century Boys; ja.wikipedia). NORTH food: 0 — all leads single-key (held list in note).
**Geocode:** new channel **MapFan** spot pages (Degree lat/lng in the search summary; map-provider place pin → `med`): W7E 9/14,
W7F 12/50 (MINAM 10). Wikidata (P625 missing on small items) and NAVITIME route coords (old Tokyo datum) rejected.
Mashino Ken: Michelin + Tabelog still list 1-3-6 Awajimachi → the Michelin pin is wrong; stays UNVERIFIED.
**Build:** 455 discovered (169 sights + 286 food = 63% food), 334 rendered; **ANIME 32**; 4 gates PASS; validate + npm test PASS.
**Channel mix (round 1):** Michelin 1 · Tabelog100 7 · editorial ~20 (Time Out, Mapple, Rurubu, Lmaga, Walkerplus, Osaka Metro, Savor
Japan, JAL) · official/municipal 4 · Wikipedia 2 · creators 3 (Ramen Beast 1, Ramen Adventures 1 — corroborating only).
**Yield:** ≈ 0.12 places/search — held-lead promotion mostly fails (small shops rarely named by two different outlets).
