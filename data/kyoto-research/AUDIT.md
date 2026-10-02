# Kyoto — AUDIT (append-only, one section per stage/wave)

## 2026-10-02 — scaffold
- Areas (9), Japan taxonomy (`tools/japan_consolidate.py`), wrappers, registry keys. No places yet.

## 2026-10-02 — W1 (HGS) — discovery + fact-check + geocode, PARTIAL (halted by the search budget)
**Sources by channel:** editorial/travel sites: japan-guide.com (8 place pages), Kyoto City Official Travel Guide
kyoto.travel (area + destination pages), Culture Trip; institutional: MICHELIN Guide Kyoto Osaka 2025/2026 (Bib pages
+ ceremony articles); local: Leaf Kyoto; reference: Wikipedia (coordinates + notability). Creators: **0 this wave**.
The §2a creator queries had not run yet when the budget ran out.
**Kept (12):** Kiyomizu-dera, Higashiyama District, Yasaka Shrine, Maruyama Park, Gion & Hanamikoji, Kōdai-ji, Chion-in,
Kennin-ji, Shōren-in, Hōkan-ji (Yasaka Pagoda) [JAPANGUIDE/KYOTOTOURISM/WIKIPEDIA, ≥2 each]; Gion Yorozuya (lone Michelin
Bib, onion udon with Kujō negi); Honke Daiichi-Asahi Takabashi (Leaf Kyoto + Culture Trip; est. 1947).
**Held (single source / incomplete):** see `_PENDING_LEADS.json` — Rokuharamitsu-ji, Sanjūsangen-dō, Tōfuku-ji, Kyoto
National Museum, Shōgunzuka, Sennyū-ji, Rokudō Chinnō-ji, Heian Jingū; Michelin Bib ramen (Touhichi, Rennosuke, Kombu to
Men Kiichi, Fujitora, Muginoyoake, UZU) lack a sourced area/address; Gion Kajisho/Gion Nishikawa lack a sourced dish.
**Measured & dropped:** none. Rejected as sources: cemeterytravel.com, sygic/tripomatic, latitude.to and airbnb pages
(aggregators); gigazine (a news blog, used for status context only).
**Geocode:** Kōdai-ji high (Wikipedia 35.00076,135.78111); Yasaka Pagoda high (Wikipedia 34.99855,135.77925); Yasaka Shrine
med (museum-digital 35.00365,135.77853, re-verify). Kiyomizu-dera, Gion Yorozuya and Daiichi-Asahi are UNVERIFIED: Google
surfaced only a cid link, no `!3d!4d`. Restaurant place-pins do not surface via WebSearch, as in the other cities.
**Correction made:** street numbers first written from memory were replaced with sourced ward/district addresses (rule 4a).
**Closures:** none found. **Blocker:** the session WebSearch budget (200/200, shared across all agents) was exhausted after
about 14 Kyoto searches. Nothing after this point was fabricated, and there is no build or go-live.

## 2026-10-02 — W2 (relaunch, own search budget) — batch 1: W1 finish + UNESCO backbone + CTR sights
**Technique (new, efficient):** the UNESCO WHC `list/688/maps` and `list/870/maps` pages carry per-component
coordinates; two searches returned all 17 Kyoto (minus Kiyomizu-dera 688-004, taken from Wikipedia) and all 7 Nara
components → `SIGHTS_KYOTO_UNESCO.json` (lone authority UNESCO) + `geo/_geoout_kyoto_unesco.json` (high; Enryaku-ji and
Heijō Palace = med, centre of a large precinct). Domain-filtered searches (`allowed_domains` japan-guide.com /
kyoto.travel / en.wikipedia.org) return ~10 citable pages per query; "A; B; C; D; E — Wikipedia coordinates" with the
wikipedia filter returns 4–5 published coordinates per search.
**Kept:** UNESCO 23 (Kyoto 16 + Nara 7); HGS +4 (Tōfuku-ji JAPANGUIDE+ANATRAVEL, Rokuharamitsu-ji WIKIPEDIA+KYOHAKU,
Kyoto National Museum JAPANGUIDE+KYOTOMUSEUMS, Sanjūsangen-dō WIKIPEDIA+JTA); CTR +7 (Nishiki, Pontochō, Higashi
Hongan-ji, Kyoto Station, Kyoto Tower, Railway Museum, Manga Museum — JAPANGUIDE+KYOTOTOURISM/WIKIPEDIA).
**Geocode:** Kiyomizu-dera → high (Wikipedia 34°59′42″N 135°47′06″E); Sanjūsangen-dō med (DMS surfaced with the
Wikipedia article, sygic also in results → re-verify); 6 CTR high/med from Wikipedia. Rejected as coordinate sources:
travel.sygic.com, museum-digital, airbnb.
**Correction:** two street numbers I typed from memory (Sanjūsangen-dō, Kyoto National Museum) were removed before
commit and replaced with chō-level addresses (rule 4a).
**Food:** Michelin venue pages give address + dish two per search ("guide.michelin.com kyoto "A" "B""); three names
in one query fails (one venue dominates). Ramen Touhichi (Sakyō) + Noodle Shop Rennosuke (Kita) confirmed; Menya
Inoichi address only (dish not surfaced → held). Restaurant lat/lng never surfaces (as W1) → food pins UNVERIFIED.
**Searches used this session: 19.**

### batch 2 (2026-10-02) — HGS pins + SAKYO 13 + Places of Scenic Beauty
- Wikipedia coordinates (high) for Chion-in, Kennin-ji, Shōren-in, Maruyama Park, Yasaka Shrine (upgraded med→high).
- HGS +2: Chishaku-in (WIKIPEDIA + kyoto.travel map guide PDF), Sennyū-ji (WIKIPEDIA + KYOTOTOURISM shrine_temple/181).
- SAKYO +11 / KITA +2 / RKSAI +1: Philosopher's Path, Nanzen-ji, Eikan-dō, Heian Jingū, Hōnen-in, KYOCERA Museum,
  NMMAK, Murin-an, Konchi-in, Shugakuin; Daisen-in, Kyoto Imperial Palace; Katsura Imperial Villa. Places of Scenic
  Beauty (Murin-an, Konchi-in, Shugakuin, Daisen-in, Katsura) cite the designation (BUNKACHO, via the Wikipedia list
  that tabulates it with coordinates) plus the article — always ≥2 keys, so they do not rest on a lone authority.
- **Address policy (rule 4a) tightened:** chō names I had typed from general knowledge were stripped. Sight addresses are now
  ward-level unless a source printed the street address (Tōfuku-ji via ANA, Rokuharamitsu-ji via Wikipedia, Michelin venues).
- Held (one source, coords in hand): Shisen-dō (Wiki 35.04374,135.79623), Shinnyo-dō (35.021894,135.790417), Yoshida Shrine
  (35.025349,135.784632), Kyoto Botanical Garden (35.04833,135.76111), Manshu-in (35.048817,135.80306), Keage Incline
  (35.0078,135.7902); HGS: Gion Shirakawa, Ishibe-kōji, Entoku-in (japan-guide e3902/e3927), Shōgunzuka (e3954), Yasui
  Konpira-gū, Rokudō Chinnō-ji (kyoto.travel map mention only).
- Searches used: 31.

### batch 4 (2026-10-02) — UJI +9, RKHKU +5, KYFU +2
- UJI/Nara: Mimuroto-ji, Manpuku-ji, Nara Park (med), Nara National Museum, Isui-en, Mount Wakakusa (med), Shin-Yakushi-ji,
  Nigatsu-dō, Hōryū-ji (UNESCO 660 + JAPANGUIDE + WIKIPEDIA). All JAPANGUIDE + WIKIPEDIA, Wikipedia pins.
- RKHKU: Sanzen-in, Hōsen-in (JAPANGUIDE e3932 + WIKIPEDIA), Kurama-dera, Kifune Shrine, Jingo-ji (KYOTOTOURISM + WIKIPEDIA).
- KYFU: Amanohashidate (pin from Wikipedia), Ine no Funaya (UNVERIFIED: only the municipality coordinate was published, and a centroid is never used).
- **Removed before commit (honesty):** Jakkō-in. I had paired it with a Wikipedia ward article that does not establish it, so it is
  held on japan-guide alone. Also Sagano Scenic Railway: two japan-guide pages are ONE outlet, so it is held.
- Held (single source): Kōshō-ji (Uji), Tale of Genji Museum, Uji River/bridge, Naramachi, Yoshikien (japan-guide); Ruriko-in
  (kyoto.travel); Miyama Kayabuki-no-Sato (japan-guide e3985; Wikipedia gives only the town centroid); Hozugawa River Cruise (japan-guide e3966);
  Ukimidō/Mangetsu-ji (Wikipedia 35.109806,135.920944); Jōnan-gū (ja-Wikipedia 34.951119,135.746556).
- Lesson: a 6-name Wikipedia-coordinate query costs 1 search only when every name has an enwiki article. A name with no article
  (Giō-ji) makes the tool retry internally, costing about 6 searches. Names are now pre-screened.
- Searches used: 61.

### batch 5 (2026-10-02) — FOOD W2: 29 food records, all lone Michelin authority (MICHELIN_STAR / MICHELIN_BIB / MICHELIN)
- **Technique:** a `allowed_domains=["guide.michelin.com"]` query naming a ward + genre ("Kyoto Bib Gourmand udon soba
  Sakyo-ku Higashiyama-ku address") returns 3–5 venue summaries with address + distinction + dish. Quoting 2–3 exact venue names
  also works. Ceremony articles (2025 "9 New Bib Gourmands", 2026 "12 New Bib Gourmands") supplied the newest names.
- Kept: 6 three-star kaiseki (Gion Sasaki, Kikunoi Honten, Mizai, Hyotei, Isshisoden Nakamura, Miyamaso — new 3★ 2026);
  Bib: Kyogoku Kaneyo (unagi kinshi-don), Izuu (saba-zushi, est. 1781), Shigetsu (Tenryū-ji shōjin), Juu-go, Okakita,
  Gombei, Choshoku Kishin, UZU, Muginoyoake, Komedokoro Inamoto, Hiiragitei, Shutei Bankara, Fuyacho Kuraku, Fujitora,
  Saryo Tesshin, Kombu to Men Kiichi, Jukuseibuta Kawamura, Touhichi, Rennosuke; Selected: Teuchisoba Kanei, Soba Rojina,
  sonoba, Chikuyuan Taro no Atsumori.
- **Correction:** Noodle Shop Rennosuke has relocated from Murasakino (Kita-ku) to Kamigyō-ku per Michelin's page; the W1 street
  address was withdrawn and the record is now ward-level (area KITA unchanged).
- Held: KOKAGE (new 2026 Bib, 100% buckwheat soba; no address surfaced); Menya Inoichi (address only, no dish).
- Geocode: all food UNVERIFIED (the Michelin page gives the address, but no place-pin coordinate surfaces via WebSearch) → queued for
  tools/geocode-helper.html. Food therefore counts as discovered but is not yet rendered.
- **Creator channel (§2a):** 3 searches (a general creator query, youtube.com-filtered, timeout.com-filtered). Results were tour vendors or unattributed
  video titles: no creator with a verifiable following or a findable place-specific piece, so **0 creators vetted** and none
  attached. Time Out Kyoto coverage via timeout.com is Tokyo-heavy. Noted (one source each, not added): Café Violon, Kissa Kishin,
  Flow by Nozy Coffee, Blue Bottle Kyoto (Time Out); Kazariya aburi-mochi, Inoda Coffee, Kasagiya, François (kyoto.travel).
- Lesson: an over-stuffed food query (8+ names) makes the tool retry internally, costing 3–4 searches for little gain. Keep queries to ≤5
  names or one ward+genre.
- Searches used: 86.

### batch 6 (2026-10-02) — held leads corroborated + CTR/KITA/RKSAI sights
- Corroborated with kyoto.travel (2nd source): Shisen-dō (shrine_temple/146), Manshu-in, Shinnyo-dō (KT FAQ 1056), Kyoto Botanical
  Gardens (KT guide sheet 152) → SAKYO +4, pins from Wikipedia.
- CTR +4: Nishiki Tenmangū, Museum of Kyoto, Rokkaku-dō (KYOTOTOURISM + WIKIPEDIA), Kyoto Aquarium (JAPANGUIDE e3971 + WIKIPEDIA).
  KITA +1 Sentō Imperial Palace (JG e3935 + WIKI); RKSAI +1 Toei Kyoto Studio Park (JG e3934 + WIKI).
- New pins: Kyoto Station (Wikipedia 34.985444,135.757778), Kyoto National Museum (Wikipedia 34.99,135.773056).
- Held (Wikipedia coords only, need 2nd source): Honnō-ji (35.010294,135.768281), Shinsen-en (35.011381,135.748372), Tōji-in
  (35.031550,135.723469), Shōkoku-ji (35.03306,135.762347), Rozan-ji (35.0232,135.7640), Daihōon-ji (35.0319,135.7399),
  Umekōji Steam Locomotive Museum (now part of the Railway Museum — not separate). Myōshin-ji (JG mention only).
- Searches used: 92.

### batch 7 (2026-10-02) — Nara/Uji food, Fushimi, held corroborations
- UJI food: Kiminami (soba), Kushizukushi (kushiage), toi Inshokuten (Indian thali) — MICHELIN_BIB (Nara region pages);
  Tsuen Tea (est. 1160) and Nakamura Tokichi Honten (est. 1859) — JAPANGUIDE e3977 + WIKIPEDIA_JA (new key).
- FSHMI: Jikkokubune Canal Cruise (JAPANGUIDE e3938 + KYOTOTOURISM); pin held (pier coordinate not surfaced).
- HGS: Mimizuka (national Historic Site list + Wikipedia; pin from Wikipedia). SAKYO: Keage Incline (JG e3951 + Wikipedia).
- Held: Taihōan municipal tea house (japan-guide only; the Japanese mention could not be tied to a specific page), Kizakura Kappa Country and
  Fushimi Yume Hyakushu (could not tell which outlet said what → not attributed), Myōshin-ji (JG e3961; no coordinate yet),
  Shimabara/Sumiya (Wikipedia only), Ike Edoyakiunagi Asahitei (Nara, no address).
- Searches used: 100.

### batch 8 (2026-10-02) — Michelin starred kaiseki + izakaya (FOOD_KYOTO_W3) and KYFU ring
- FOOD W3 (16): One-star Nakagyō kaiseki ×7 (Ogawa, Tsujifusa, Kiyama, Miyawaki, Nijo Minami, Muromachi Wakuden, Jiki Miyazawa);
  Gion: Gion Maruyama ★★, Gion Nishikawa ★★, Gion Fukushi/Kida/Owatari ★; Sushi Kappo Nakaichi ★; Kyokaiseki Kichisen ★★ (Shimogamo);
  Pontocho Masuda (obanzai, MICHELIN); Saketosakana DNA (Bib izakaya).
- **MEASURED & DROPPED (padding):** Gion Nishimura and Gion Rohan are Michelin-listed only, with no distinction surfaced. They would have been
  a fifth and sixth near-identical Gion kaiseki counter, so they were dropped. **Held (no named dish / cuisine unclear):** Sambongi Shoten, Eitaroya, Muromachi Kaji
  (izakaya, no dish); Higashiyama Yoshihisa ★★, Kyoboshi, TOKI, Kyo Seika ★, Higashiyama Ogata ★, Nishijin Hashimoto, Shimogamo
  Saryo, Shimogamo Ichima, middle, ristorante DONO. Their cuisine or dish was not stated in the summary, and guessing would risk a cuisine mis-tag.
- KYFU +7: Ishiyama-dera, Mii-dera, Hiyoshi Taisha (National Treasure designations via the Wikipedia NT lists + articles),
  Nariai-ji (JG e3995 + WIKI), Kono Shrine (JG e3990 + WIKI), Jōruri-ji, Kaijūsen-ji (NT + WIKI). Pins from Wikipedia.
- Rejected coordinate: "Kasagi-dera" was offered the Siege-of-Kasagi coordinate, which is not the temple, so it was not used. Held: Ōmi Jingū
  (35.032444,135.851222), Ukimidō, Fukuchiyama Castle (35.296753,135.129625) — Wikipedia only.
- Searches used: 117.

### batch 9 (2026-10-02) — FSHMI +4, RKHKU +4, HGS +3 (ja-Wikipedia coordinates)
- **Technique:** `allowed_domains=["ja.wikipedia.org"]` with 5–6 Japanese names + 座標 returns up to 5 published coordinates per search.
  This works where enwiki has no article (Jakkō-in, Rurikō-in, Saimyō-ji, Miyama, Yasui Konpira-gū, Rokudō Chinnō-ji, Entoku-in).
- FSHMI: Zuishin-in, Kajū-ji (KYOTOTOURISM + WIKI), Hōkai-ji (NT list + WIKI), Jōnan-gū (KYOTOTOURISM + WIKIPEDIA_JA).
- RKHKU: Jakkō-in (JG e3932 + WIKIPEDIA_JA), Saimyō-ji (JG e2158_north + JA), Rurikō-in (KT + JA), Miyama Kayabuki-no-Sato
  (JG e3985 + JA; the pin is the village, not the town centroid).
- HGS: Yasui Konpira-gū, Rokudō Chinnō-ji (kyoto.travel map guide + JA), Entoku-in (JG e3927 + JA).
- Held: Bishamon-dō (kyoto.travel only), Kurama Onsen (JA coords 35.11925,135.776456; one source).
- Searches used: 121.

### batch 10 (2026-10-02) — pins for 4 unpinned HGS records; CTR +5, KITA +3
- Pins: Tōfuku-ji (ja-Wikipedia, high), Rokuharamitsu-ji (Wikipedia, from the W1 lead, high), Gion & Hanamikoji (Gion Kōbu Kaburenjō
  on Hanami-kōji, med), Higashiyama District (Sannenzaka, med). These are real place pins on the street or theatre, not district centroids.
- CTR: Mibu-dera, Shōsei-en (KYOTOTOURISM + WIKIPEDIA_JA), Nijō Jinya (JG e3926 + JA), Shimabara & Sumiya (KT + Wikipedia, med),
  Teramachi & Shinkyōgoku arcades (JG e3958 + KT; UNVERIFIED, since a street has no single pin).
- KITA: Genkō-an, Shōden-ji (KT + JA), Kōetsu-ji (japan-guide autumn report + JA).
- Held: Seigan-ji (35.007361,135.767722), Funaoka Onsen (35.036911,135.744578), Goō Shrine (35.02222,135.75861): one source each.
- Searches used: 127.

### batch 11 (2026-10-02) — Michelin food pins + FOOD_KYOTO_W4 (10)
- **Breakthrough (lesson borrowed from the Osaka log):** `allowed_domains=["guide.michelin.com"]` + "<A>; <B>; <C> Kyoto address
  latitude longitude" returns each venue page's lat/lng. That gives 3 restaurant place-pins per search, so food is now renderable. The 46 remaining
  W2/W3 Michelin food pins are delegated to a background worker (writes `geo/_geoout_kyoto_mpins.json` only). Main agent pinned
  Gion Yorozuya, Izuu, Kyogoku Kaneyo and all W4 venues except Bistro Cerisier.
- Asking for dish + coordinates in one query loses the coordinates. Do it in two steps: (1) ward list or dish query, (2) pin query.
- W4: Higashiyama Yoshihisa ★★ (2026), Kyo Seika ★ (Chinese → INT), Higashiyama Ogata ★, Kokyu, Tenjaku (tempura), Sambongi Shoten
  (char-grill izakaya), Sushizen (kyō-zushi), Ryoriya Otaya, Washoku Haru (saba-zushi roll), Bistro Cerisier — Bib unless noted.
- Held: Bistro Yanagihara, BOCCA del VINO (dish not surfaced).
- Searches used (main): 136; plus the background pin worker (≤20).

### batch 12 (2026-10-02) — background pin worker + go-live + UJI/FSHMI sights
- **Pin worker** (18 searches): 44/46 Michelin venues pinned from Michelin venue-page lat/lng (`geo/_geoout_kyoto_mpins.json`).
  Spot-checked: all fall in the stated ward/chō. UNVERIFIED: Kyoudon Kisoba Okakita and Shutei Bankara (no venue page surfaced; not
  marked closed, since no source said so). Rennosuke's new Michelin address (116-2 Higashitate-chō, Kamigyō-ku) was written into the food record.
- **Build:** 208 discovered / 198 rendered; sourcecheck, geocheck, statuscheck and buildcheck PASS; `npm run validate` and `npm test` ALL PASS.
- **GO-LIVE:** the Japan hub CARD:kyoto now links to cities/kyoto.html; root CARD:japan reads "4 of 5 maps live"; docs/CITIES.md has a Kyoto row; prose in
  tools/build-kyoto.py was rewritten (no "vetted creators" claim, since none were vetted).
- UJI +5: Kōshō-ji, Tale of Genji Museum, Uji Bridge, Yoshiki-en (JG + WIKIPEDIA_JA pins); Naramachi (JG e2165 + JA; UNVERIFIED,
  because only an approximate district centre surfaced).
- FSHMI +3: Fushimi Momoyama Mausoleum, Sekihō-ji (KT map guide + JA), Fujinomori Shrine (KT taxi-tips feature + JA).
- Held: Gokō-no-miya (34.934722,135.7675; the kyoto.travel plaque found covers the shrine's ORIGINAL site, so it was not used as the 2nd source).
- Searches used: main 149 + worker 18 = 167.

### batch 13 (2026-10-02) — held leads corroborated + non-Michelin canon
- KITA +3: Daihōon-ji/Senbon Shakadō (kyoto.travel plaque 2230 + WIKI), Shōkoku-ji, Rozan-ji (KT map guide + WIKI). CTR +2:
  Shinsen-en (KT plaque 2192 + WIKI), Honnō-ji (KT map guide + WIKI). Pins from Wikipedia.
- Food canon (non-Michelin, ≥2 editorial): Inoda Coffee Honten (ja.kyoto.travel listing + WIKIPEDIA_JA; pin from ja-Wikipedia),
  Sōhonke Nishin Soba Matsuba (kyoto.travel restaurant page + ja-Wikipedia にしんそば article for its 1882 invention; pin held).
- Held (single editorial source): Honke Owariya (KT, est. 1465), Nanzenji Junsei (KT, yudofu), Ippodō (ja-Wiki address only),
  Ichiwa/Ichimonjiya Wasuke (ja-Wiki only), Kazariya (KT only).
- Searches used: main 155 + worker 18 = 173.

### batch 14 (2026-10-02) — KYFU/RKHKU fill + Owariya
- KYFU +2: Kasamatsu Park (JG e3992 + WIKIPEDIA_JA), Hozugawa River Cruise (JG e3966 + ja-Wikipedia Hozu Gorge; med, a point on the route).
- RKHKU +1: Kurama Onsen (JG e3933 + JA; reopened Nov 2024 per japan-guide → status open).
- Food: Honke Owariya (est. 1465) — KYOTOTOURISM restaurant page + Time Out (Tokyo edition travel piece); pin held.
- Held: Gansen-ji (ja coords 34.72025,135.885806, one source), Fukuchiyama Castle (en+ja Wikipedia = one outlet), Eizan Railway
  'kōyō tunnel' (KT only), Shōrin-in, Raigō-in (JG only), Nanzenji Junsei, Okutan (yudofu; one source each).
- Searches used: main 158 + worker 18 = 176.

### batch 15 (2026-10-02) — final W2 build
- HGS +1: Toyokuni Shrine (KT FAQ 1039 + WIKIPEDIA_JA; med, an arc-second-rounded coordinate). Held: Hōkō-ji (ja coords 34.992106,
  135.772064; the matching kyoto.travel page could not be identified with certainty), Yōgen-in (34.987861,135.773639), Ryōzen Gokoku Shrine
  (35.0,135.78306, rounded), Kawai Kanjirō House and Minami-za (no coords).
- **Build:** 228 discovered / 215 rendered (152 sights + 63 food); 13 UNVERIFIED held; all 4 gates PASS; validate + test ALL PASS.
  CARD:kyoto counts and the CITIES.md row were refreshed.
- **Closures found this wave:** none. Every place carries a 2026 status source. Kurama Onsen was confirmed reopened (Nov 2024).
- Searches used: main 160 + worker 18 = 178.
- Close-out: NARA NIKON ★★ (Nara, Michelin venue pin) added. Not added: SÉN (Tenkawa) and Da terra (Asuka), which are far outside the Uji & Nara area;
  Gen and le content have no dish or are out of canon. Last build: 229 discovered / 216 rendered; all gates and tests PASS. W2 closed at about 180 searches
  (main 162 + worker 18) because yields had fallen to about one place per search.

## W3 (2026-10-02, relaunch with own budget) — FOOD & DRINK FIRST (§2b) + ANIME (§2c)

### Sources discovered this wave (SOURCES_KYOTO_W3.json, CREATORS_KYOTO_W3.json)
- LEAFKYOTO (Leaf KYOTO, Kyoto's city/food magazine since 1997), INSIDEKYOTO (Chris Rowthorn — expert creator; never paired
  alone with Lonely Planet, same author), MATCHA, SAVORJAPAN, MAPPLE, JALONTRIP, KANSAIAIRPORT, VISITNARA, FODORS.
- Creators: Inside Kyoto (attached via its per-venue pages); ONLY in JAPAN (John Daub) vetted, not attached (no findable
  place-specific Kyoto URL). Rejected: byfood blog (tour-booking platform), magical-trip / triptojapan (tour-operator SEO).

### batches 1–5 (main) — FOOD_KYOTO_W5.json, 50 food & drink places, every one ≥2 credible
- Ramen: Shinpuku Saikan Honten, Takayasu, Menya Inoichi, Kyoto Ramen Koji. Kissaten/coffee: François, Rokuyōsha,
  Weekenders, Kurasu Kyoto Stand, % Arabica Higashiyama, Vermillion, Ninenzaka Starbucks. Wagashi/sweets: Kagizen Yoshifusa,
  Kazariya + Ichiwa (aburi-mochi), Nakamuraken, Demachi Futaba, Bunnosuke Chaya, Itohkyuemon & Tsujiri (Uji), Nakatanidou (Nara).
  Tofu/shōjin: Nanzenji Junsei, Okutan (Nanzen-ji + Kiyomizu), Yudōfu Sagano, Izusen. Noodles: Suba, Omen, Kendonya, Arashiyama
  Yoshimura, Hirobun (Kibune nagashi-sōmen). Drink: Kizakura Kappa Country, Fushimi Yume Hyakushu, Kyoto Brewing Co., Mukai
  Shuzō (Ine), Sake Bar Yoramu, Bar K6, Gion Finlandia, L'Escamoteur, Bar Rocking Chair. Nishiki: Miki Keiran, Uoriki, Kai,
  Konnamonja. Other: Kyo Unawa (unagi), Grill Hasegawa (yōshoku), Gyoza Hohei, Shizuka (Nara kamameshi), + 3 Michelin
  (Torisaki ★, Tempura Mizuki ★, Yakitori Kyoto Tachibana).
- Channel mix (50): Leaf 25 · Inside Kyoto 16 · Time Out 15 · MATCHA 14 · Lonely Planet 11 · Kyoto City Official 10 · Savor 6 ·
  japan-guide 4 · others (Japan Times, Fodor's, Asia's 50 Best, Visit Nara, JAL, KIX, Mapple) 9.
- HELD single-source (need a 2nd): Tenkaippin Sōhonten, Menya Gokkei, Tentenyu, Menshō Takamatsu, Karako, Ramen Muraji,
  Smart Coffee, Bee's Knees, Atlantis, Nokishita711, Kyoto Beer Lab, BEFORE9, Spring Valley Kyoto,
  Nishijin Beer, Kikkoya, Akagakiya, Renkon-ya, Nontei, Tanpopo, Mamehachi, Kasagiya, Gion Tokuya, Umezono Sanjō, Yoshūji
  (Kurama), Yamamoto Menzou, Nezameya, Taihōan, Fukujuen Uji Kōbō, Kanbayashi Sannyū, Saga Tofu Morika, % Arabica Arashiyama,
  Honke Tsuruki Soba (Ōtsu; Biwako Visitors Bureau only), Hashidate Chaya, Coffee Cattleya, Izasa (Nara), Kyoto Tower Sando,
  Le Petit Mec, Shinshindō.
- MEASURED & DROPPED: Japan Times izakaya reviews 2014–17 (Tsugu, Ajikyu) — too old to confirm open; tour-operator lists.
- Dead ends: Tabelog 百名店 list queries return image pages, not names (2 searches wasted); "lat/lng" queries for non-Michelin
  shops return addresses only → those pins are UNVERIFIED for tools/geocode-helper.html.
- Rule-4a hygiene: three details first drafted from memory (a chō name, a founding year, a sub-temple) were removed before commit; addresses are as the sources state.

### Michelin worker (40 searches) — FOOD_KYOTO_MICH5.json: 43 (17 starred, 8 Bib, 18 Selected); 15 venue-page pins
- See `_note_mich5.md`. CTR 18 · HGS 11 · KITA 6 · UJI(Nara) 3 · RKSAI 2 · SAKYO 2 · FSHMI 1. The Michelin Kyoto guide covers
  Kyoto city (+ Nara) only — RKHKU/KYFU yielded nothing. Held (no named dish): Shimogamo Saryo, middle, Kenya, Nakazen,
  Germoglio ★, ima ★, Itsutsu, Shuhaku, Kentan Horibe ★, Gion Matayoshi ★★, Wa Yamamura.

### ANIME worker (22 searches) — SIGHTS_KYOTO_ANIME1.json: 3 kept
- Nintendo Museum (Uji; Wikipedia coords), Marufukuro (former Nintendo HQ; UNVERIFIED pin), Demachi Masugata Shōtengai
  (Tamako Market model; KITA; UNVERIFIED pin). Held: Daikichiyama deck (Euphonium), Nintendo KYOTO store, Pokémon Center
  Kyoto (moved 2019 to SUINA Muromachi). See `_note_anime1.md`. KyoAni Studio 1 deliberately not added (sensitive; no sourced memorial).

### Build (W3 checkpoint)
- **325 discovered (161 sights + 164 food = 50.5% food) / 232 rendered (153 + 79).** sourcecheck PASS · geocheck PASS (high 217,
  med 15) · statuscheck CONSISTENT, 0 unchecked · buildcheck PASS · `npm run validate` DATA OK · `npm test` ALL PASS.
- Closures found: none. Searches: main ~52 + anime 22 + Michelin 40 = ~114.

### W3 batches 6–8 + pin worker (2026-10-02)
- Sights +19 (SIGHTS_KYOTO_W3S.json, all ja-Wikipedia pins + JG/KT/LP/IK/Visit Nara/UNESCO): Ōhara Jikkō-in, Shōrin-in, Raigō-in;
  Jissō-in (Iwakura); Enkō-ji; Yoshida Shrine; Yoshimine-dera; Jizō-in (Bamboo Temple); Suzumushi-dera; Hōrin-ji; Hōgon-in;
  Bishamon-dō; Kanshū-ji; Gokō-no-miya (held lead resolved via KT feature); Chōken-ji; Saidai-ji; Uji Shrine; Agata Shrine (med);
  Kasugayama Primeval Forest (UNESCO component, med). Held: Hōkyō-in (no 2nd source surfaced), Akishino-dera, Hokke-ji (Visit Nara page not surfaced).
- Food +4: Torisei Honten (Fushimi), Menya Gokkei, Kitchō Arashiyama, % Arabica Arashiyama. Held: Unagi Hirokawa (Inside Kyoto calls
  it Michelin-starred, but it is not in the current Michelin guide → not claimed), Tentenyu Honten, Tenkaippin Sōhonten (address
  not surfaced), Fushimi Sakagura Kōji, Abura-chō, Animate Kyoto (Avanti).
- ANIME: Uji Bridge now carries `anime` (Sound! Euphonium — Anime News Network + Keihan official collaboration page). ANIME
  collection on the page: 7 places tagged (Nintendo Museum, Marufukuro, Demachi Masugata, Manga Museum, Kōzan-ji/Chōjū-giga,
  Uji Bridge, + keyword matches).
- PIN WORKER (30 searches): 72 pins (66 Michelin venue-page lat/lng, 6 ja-Wikipedia) applied to the geoout files by exact name
  (`geo/_repin_kyoto_w3.json`, `_note_repin_w3.md`). Placement checks: Torisaki/shiro/Muromachi Yui within ~30 m (Takoyakushi
  block — plausible, flagged for re-verify); Gion Yorozuya/Chōshoku Kishin 6 m apart (Komatsu-chō 555-1 / 555 — consistent).
- **Build: 348 discovered (180 sights + 168 food = 48%) / 288 rendered (175 + 113).** All 4 gates PASS (high 269 · med 19);
  validate DATA OK; npm test ALL PASS. Searches: main ~72 + workers 92 (anime 22, Michelin 40, pins 30) ≈ 164.
- Correction (batch 9→10): "Wabiya Korekidō" (Gion, Hanami-kōji; Inside Kyoto) was first cited with the MICHELIN "wabiya" page — the
  Michelin venue is a DIFFERENT shop (554 Sangen-chō, Shimogyō-ku). Korekidō was removed (held: Inside Kyoto only; the Savor Japan
  "Wabiya Korekido" listing is an Osaka-Namba branch). Michelin "wabiya (Shimogyō)" added on its own, pinned from its venue page.
  Kikunoi Roan ★★ added (Michelin pin + Inside Kyoto).

### W3 batches 9–11 (2026-10-02)
- Food +11: Taihōan, Fukujuen Uji Kōbō, Kanbayashi Sannyū (Uji tea), Katsukura Sanjō, wabiya (Michelin, Shimogyō), Kikunoi Roan ★★,
  DODICI ★, Takocho (oden), Torisho sai (yakitori) — Michelin ones pinned from venue pages; Hashidate Chaya (asari-don) and
  Tsuruya Shokudō (Tango Jewel kaisen-don) — first KYFU food beyond Mukai Shuzō (Amanohashidate official + JG / MATCHA).
- Sights +3 KYFU: Chion-ji (Amanohashidate), Moto-Ise Naikū Kōtai Jinja, Fukuchiyama Castle (held W2 lead → resolved with the
  Kyoto Online Tourist Information Center FAQ as 2nd source). ja-Wikipedia pins.
- Dead ends: Japanese pickles query (Nishiri/Daian) returned generic pages; Michelin query for Tokuo/Takohachi/TAKAYAMA/DONO/Izumi
  returned addresses but no lat/lng and no dish → held.
- **Build: 362 discovered (183 + 179 = 49% food) / 296 rendered (178 + 118)**; all 4 gates PASS (high 277 · med 19); validate +
  test ALL PASS. ANIME 7. Searches ≈ 185 total this session.
