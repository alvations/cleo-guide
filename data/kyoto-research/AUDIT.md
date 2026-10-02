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
