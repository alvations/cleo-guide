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
