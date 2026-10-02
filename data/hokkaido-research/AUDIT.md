# Hokkaido — AUDIT (append-only, one section per stage/wave)

## 2026-10-02 — scaffold
- Areas (9), Japan taxonomy (`tools/japan_consolidate.py`), wrappers, registry keys. No places yet.

## 2026-10-02 — W01 Sapporo (SPR) sights — discover → fact-check → geocode → build (TRUNCATED by WebSearch budget)
**Searches run (this agent): ~14** before the session-wide WebSearch cap hit (`200 of 200 WebSearch calls` — the cap is
shared by every agent in this session). Every later query returns "Web search was not performed". Wave stopped there.

**Technique that worked (record for every Japan map):** one batched query `Wikipedia coordinates A; B; C; D; E`
returns, per place, the en.wikipedia article URL + the official tourism / japan-guide URLs + the infobox coordinate
in the result summary — source discovery AND geocode in one call. Hit rate ~50% on coordinates (the summarizer
often omits them); 3 names per query is more reliable than 5. `extended` mode recovered one more (Hitsujigaoka).

**Sources (channel mix this wave):** official tourism 4 (SAPPOROTRAVEL, HOKKAIDOTOURISM, JNTO, OFFICIAL venue/tourism
association) · notable travel site 1 (JAPANGUIDE) · encyclopedia/institutional 3 (WIKIPEDIA, HOKKAIDODIGITALMUSEUM,
TOKYOARTBEAT) · creator 1 (JUSTONECOOKBOOK — Namiko Chen, ~1M+ YT; Sapporo travel guide naming Moiwa, Hokkaido
Shrine, TV Tower, Tanukikoji, Nijō Market). Local-recommendation / viral TikTok channels: not reached (budget).
**Rejected:** agoda travel-guides (booking SEO), sygic/tripomatic/aroundus/latitude.to (aggregators — coordinate
cross-check only), fleemy.com (anonymous listicle), snowmonkeyresorts/japanactivity (tour sellers).

**Extracted + fact-checked (12 sights, all ≥2 credible):** Sapporo Clock Tower (t1), Former Hokkaido Government
Office/Akarenga (t1 — **reopened 2025-07-25** after restoration: rurubu.jp + visit-hokkaido), Ōdōri Park (t1),
Moerenuma Park (t1), Mount Moiwa (t1), Hokkaido Shrine (t1), Historical Village of Hokkaido (t2), Hitsujigaoka
Observation Hill (t2), Sapporo TV Tower (t2), Sapporo Beer Museum (t2), Hokkaido University Botanic Garden (t2),
Jōzankei Onsen (t2). Ranking: t1 = the city's defining icons with the strongest source consensus; t2 = strong but
narrower/secondary.

**Held single-source (NOT added):** Ōkurayama Ski Jump Stadium (Wikipedia only — coords 43°03'2.86"N 141°17'14.40"E
read), Nakajima Park + Hōheikan (Wikipedia/japanvisitor only), Tanukikōji + Nijō Market (Just One Cookbook only),
Shiroi Koibito Park, Maruyama Zoo (no credible source surfaced), Hokkaido University Museum (Wikipedia coord looked
inconsistent with its Kita-10 address — rejected, re-check). Food leads (no address/2nd source yet): Michelin
Hokkaido 2017 Bib (116 venues; guide.michelin.com/sg/en/article/news-and-views/hokkaido-guide-2017) — Tomikawa
Seimensho, MEN-EIJI Hiragishi Base, Fujiya Noodle; Tabelog ラーメン百名店 2025 (announced 2025-11-11, incl. Hokkaido).

**Geocode ledger:** 9 high (Wikipedia infobox coords as reported in WebSearch results — see `geoSource` per record in
`geo/_geoout_hokkaido_w01.json`); 3 UNVERIFIED (Beer Museum, Botanic Garden, Jōzankei) held by the gate. No
viewport/centroid/memory coordinates. **Status:** 12 open (sources per record); 0 closed.

**Build + gates:** `rebuild-city.py hokkaido --build` → 12 discovered, 9 rendered (sights 9, food 0).
sourcecheck PASS · geocheck PASS · statuscheck CONSISTENT · buildcheck PASS (centre 43.0615,141.4024 z11 — Sapporo-only
for now; will widen to the whole island as other areas land) · `npm run validate` DATA OK · `npm test` ALL PASS.
**Not live:** 9 pins is not "substantial density" — Japan hub card + root `CARD:japan` left as "being built".

## 2026-10-02 — session 2 · W02–W05 + G01 geocode + build #1 (searches: 73 = 55 discovery + 18 geocode agent)
**Technique upgrade (record for every Japan map):** `allowed_domains:["en.wikipedia.org"]` (or `ja.wikipedia.org` with
Japanese names) + 3 names per query returns the infobox coordinate for ~2–3 of 3 (vs ~1 of 3 unrestricted).
`allowed_domains:["japan-guide.com"]` / `["visit-hokkaido.jp"]` area queries return 10 staff/official URLs per call —
the cheap 2nd source. Restaurants: no lat/lng surfaces for any Sapporo restaurant (G01 tried 3 — gltjp/mapple give
address only) → food held UNVERIFIED for the browser helper.
**Sources by channel (W02–W05):** official tourism (SAPPOROTRAVEL, HOKKAIDOTOURISM, JNTO) · notable travel sites
(JAPANGUIDE, CULTURETRIP, CATHAYPACIFIC, NAVITIMETRAVEL, FUNJAPAN, JAPANTRAVEL, GOODLUCKTRIP, MAPPLE) · award
lists (MICHELIN_BIB Hokkaido 2017, TABELOG100 Ramen HOKKAIDO 2024/25) · encyclopedic (WIKIPEDIA, WIKIPEDIA_JA,
WIKIVOYAGE — corroborating only). **Creators:** 2 queries (Paolo fromTOKYO/Abroad in Japan; Ramen Beast/Only in
Japan/Life Where I'm From) surfaced no findable Hokkaido piece naming a place — 0 creator attachments this round.
**Rejected:** tablejourney.com (unattributed/AI-style listicles), magical-trip.com + japanactivity (tour sellers),
hamoni.jp/wanderlog/foodle.pro (aggregators), livelyhotels (hotel blog), nta tripa / hankyu-travel (agency SEO).
**Extracted + kept (W02 food 8, W03 sights 20, W04 sights 15, W05 9 sights + 1 food):** see the `_w0N_*.py` ledgers —
every record lists its sources inline. Tiers: t1 = area-defining icon with ≥2 strong sources; t2 otherwise.
**Held single-source / not added:** Fujiya Noodle (Michelin Bib 2017, no address in results), Soup Curry Picante
(Tabelog-100 claim only via tablejourney), Soup Curry Yellow / Farm to Table Terra / Sushi Ikko (Cathay only), Kessel
Hall beer garden, Soup Curry Cocoro (Michelin 2017 claim via gltjp only), Tabelog Curry-100 picks Hiri Hiri Ōdōri /
Hige Danshaku / Pole Pole / Delhi Sapporo (one source each), Trappistine Convent (Wikipedia only), Lake Akan Ainu Kotan
(visit-hokkaido only — re-query), Shōwa-shinzan (Wikipedia only), Shikisai-no-oka / Hokusei Hill / Patchwork Road
(japan-guide e6828 only), Rusutsu Resort (japan-guide only).
**Rejected coordinates:** Jigokudani "42°25′N 141°6′E" (= Noboribetsu city article, a centroid); Lake Shikaribetsu
"43.31222,143.09556" (= the volcanic group, not the lake).
**G01 geocode agent:** 12/16 pinned (all 12 sights; 0/4 restaurants). med: Jōzankei (resort-area point), Jigokudani
(Wikipedia photo geotag in the valley), Motomachi (district article), Sakaimachi (junction at south end — source page
unconfirmed, caveat in geoSource → re-verify). Kushiro Marsh pinned to the Hosooka Observatory (ja.wikipedia 細岡展望台).
**Build #1:** 65 discovered → 53 rendered (sights 53, food 0). sourcecheck PASS 65 · geocheck PASS · statuscheck
CONSISTENT (0 unchecked) · buildcheck PASS · `npm run validate` DATA OK · `npm test` ALL PASS. 12 UNVERIFIED held (9 food + 3 TKC/sights).

## 2026-10-02 — session 2 · self-audit: address provenance (CLAUDE.md 4a)
Re-read every W03–W09 address against the result text it came from. 60 addresses carried block numbers / 〒postcodes
that were NOT read in a result (written from general knowledge) → stripped to the locality actually supported
(town/district/chōme), e.g. "44 Goryōkaku-chō … 040-0001" → "Goryōkaku-chō, Hakodate". Kept only numbers read in
results: Ironai 1-11-16 (ja.wikipedia), Hanazono 1-1-1 〒047-0024 (otaru.gr.jp), Inaho 3-15-3 (Otaru sushi results),
Irifune 1-2-3 (Music Box Museum, Wikivoyage — replaced a wrong Sumiyoshi-chō number), the W02 restaurant addresses
(gltjp/rurubu). One fabricated-looking postcode (Kiusu "066-0000") removed. G01 geoout addresses re-synced to the
ledgers. Coordinates were unaffected (all from infobox reads).

## 2026-10-02 — session 2 · W06–W15 + G02 geocode + build #2 (searches ≈139 = me ~106 + G01 18 + G02 15)
**Waves:** W06 SPR sights b2 + regional food canon · W07 Otaru/Shakotan + Biei/Sōunkyō · W08 IBURI/NSK + 6 UNESCO
Jōmon sites (whc.unesco.org/en/list/1632 + jomon-japan.jp; Washinoki is an *associated* site → not tagged UNESCO) ·
W09 Otaru sushi/Kushiro/Picante · W10 SPR parks/zoo/art · W11 SPR beer garden/ramen alley/Kitakaro · W12 Hakodate
Motomachi/Goryōkaku + Hakodate & Asahikawa food · W13 Akan-Mashū/Nemuro/Abashiri + Wakkanai/Rishiri/Rebun · W14
Obihiro butadon/Rokkatei + Muroran curry ramen · W15 Furano/Biei/Asahikawa Ainu museum + Muroran bridge.
**Sources by channel (W06–W15):** official tourism — HOKKAIDOTOURISM, SAPPOROTRAVEL, OTARUTOURISM (otaru.gr.jp),
HAKODATETRAVEL; guidebook editorial — RURUBU (JTB Publishing), MAPPLE (Shobunsha); press — HOKKAIDOSHIMBUN;
notable travel sites — JAPANGUIDE, CULTURETRIP, JAPANTRAVEL, MACARONI; institutional — UNESCO, JOMONJAPAN,
MICHELIN_BIB/STAR (Hokkaido 2017); encyclopedic (corroborating) — WIKIPEDIA_JA/WIKIPEDIA/WIKIVOYAGE.
**Creators:** a youtube.com-restricted query returned Sapporo food-tour videos but no identifiable, vettable channel
naming a specific place in the result text → 0 attachments (stated, not filled). Running total creator queries: 3.
**Held single-source / not added:** Matsuo Jingisukan Sapporo Ekimae, Sapporo Jingisukan Honten, Sumibiyaki Pokke,
Itadakimasu (rurubu only); Teshikaga Ramen (sapporo.travel only); Kinotoya (unconfirmed); Kikuyo Shokudō (MAPPLE only);
Aoba Asahikawa (MAPPLE only); Curry Shop Indian (MAPPLE only); Yakitori Ippei, Aji no Daiō Noboribetsu, Uemura Base,
Lake Hill Farm (MAPPLE only); Fugoppe Cave, Hokkaido Museum, Museum of Modern Art, Cape Tachimachi, Cape Chikyū,
Lake Utonai, Date Jidaimura, Tropical Botanical Garden, Tokachidake (Wikipedia only); Kitaichi Venetian Art Museum,
Otokoyama Sake Museum, Furano Cheese Factory, Ice Pavilion, Noboribetsu Bear Park, Akan Crane Centre, Trappist
Monastery, Yunokawa Onsen, Niseko Goshiki Onsen, Rusutsu, Shinei/Hokusei hills, Seven Stars/Ken & Mary trees
(one outlet only). Rokkatei Sapporo dropped (no named dish in results). Sapporo Ramen Republic not added (ESTA
building closed for redevelopment — no closure source read this session).
**Rejected coordinates:** Sarobetsu "45.1939,141.258" (= national-park/Rishiri point); Sukoton (latitude only);
Lake Shikaribetsu volcanic-group point (W05). G02 rejected Hachimanzaka (Motomachi centroid) and the Magistrate's
Office's *original* Motomachi site coordinate; Shakotan town point for Shimamui.
**Prose hygiene:** removed unsourced numeric colour from W11/W12/W13 descriptions (lengths, dates, temperatures).
**G02:** 13/18 pinned (high 9, med 4: Magistrate's Office = Goryōkaku point; Curb Market = wholesale-market point;
Beer Garden = Sapporo Garden Park point; Susukino = district point).
**Build #2:** 140 discovered → 104 rendered (sights 100, food 4). sourcecheck PASS 140 (1 lone authority — Tonta,
Michelin Bib 2017) · geocheck PASS · statuscheck CONSISTENT (0 unchecked) · buildcheck PASS · validate DATA OK ·
npm test ALL PASS. 36 UNVERIFIED held (mostly restaurants — no lat/lng surfaces via WebSearch).

## 2026-10-02 — session 2 · W16–W30 + G03 geocode + final build (session total ≈188 searches: me ~147, G01 18, G02 15, G03 8)
**Waves:** W16 Sapporo crab/sushi + Niseko dairy · W17 Otaru fried chicken, LeTAO, Kitaichi Glass · W18 Pirka Kotan,
Sapporo Factory, Hōheikyō, Yunokawa · W19 Otaru Aquarium, Tokachigawa Onsen, Naitai Ranch, Cape Erimo (Hidaka coast —
filed under TKC as the nearest area; noted) · W20 Kushiro zangi (Torimatsu) & spakatsu (Izumiya), Nemuro escalope (New
Montblanc), Rishiri Ramen Miraku (Michelin Bib) · W21 Hakodate Jōmon Culture Center, Catholic Motomachi Church, Northern
Peoples museum, Trappist Monastery, Kaiyō Maru · W22 Kikuyo Shokudō, Gotōken · W23 Ainu cuisine Poronno (Akan Ainu
Kotan), Utoro fishermen's-wives canteen · W24 Akan Ainu Kotan, Cape Chikyū, Cape Tachimachi, Hokkaido Museum, Lake
Utonai · W25 Museum of Modern Art, Tropical Botanical Garden, Date Jidaimura · W26–W27 Noboribetsu jigoku ramen, Aji no
Sanpei, Keyaki, Shingen · W28 T38, Sapporo Dome, Yuiga Dokuson omu-curry, Furano Cheese Factory · W29 Grand Hirafu,
HANAZONO, Rusutsu · W30 Ueno Farm, Kaze no Garden, Unkai Terrace, Ikeda Wine Castle, Tokachi Hills.
**Attribution caveat (W16, W28):** the result summary merged rurubu + MAPPLE; each place was listed under both outlets'
URLs in the same result set — re-verify per-outlet attribution at refresh.
**Dropped:** Kaiten-zushi Toriton (chain without a named branch in results); Rokkatei Sapporo (no named dish).
**Held single-source:** Asari Honten sukiyaki, Hakodate Beer Hall, Curry no Furanoya, Meisui Udon Nonokasa, Teuchi Soba
Ichimura, Yakitori Ippei, Uemura Base, Lake Hill Farm, Ōkami Soup, Shirakaba Sansō (branch), JR-less: Hokkaido Hakodate
Museum of Art, Hongo Shin sculpture museum, Wakkarium, Arishima Memorial Museum, Tokachidake Bōgakudai, Esan, Komagatake,
Hakodate Park (Wikipedia coords read; no 2nd source yet).
**G03 (Wikidata):** 5/12 — Tropical Botanical Garden, Kamome Island (Kaiyō Maru), Cape Sukoton, Sōya Hills (med, range
point), Date Jidaimura. Not found: Himenuma (town centroid only), Hachimanzaka (shrine item ≠ slope), Momoiwa (youth-hostel
item ≠ observatory); not reached: Herring Mansion, Kihinkan, Shimamui, Kitaichi No. 3.
**Final build:** 192 discovered → 132 rendered (sights 128, food 4). sourcecheck PASS 192 (1 lone authority) · geocheck
PASS · statuscheck CONSISTENT (0 unchecked) · buildcheck PASS · validate DATA OK · npm test ALL PASS. 60 UNVERIFIED held
(46 restaurants + 14 sights). Channel mix this session: official tourism ~45% of second sources (HOKKAIDOTOURISM,
SAPPOROTRAVEL, HAKODATETRAVEL, OTARUTOURISM, JNTO), guidebook editorial ~25% (RURUBU, MAPPLE), travel sites ~15%
(JAPANGUIDE, CULTURETRIP, JAPANTRAVEL, MACARONI, CATHAYPACIFIC, NAVITIMETRAVEL, FUNJAPAN, GOODLUCKTRIP), press (HOKKAIDOSHIMBUN),
institutional (UNESCO, JOMONJAPAN, MICHELIN 2017); creators 0 (3 queries, nothing vettable — stated, not filled).

## 2026-10-02 — session 3 · food-first (RUN §2b) · W31–W33 (searches ≈20)
**Pin-channel test (3 searches):** Hokkaido has no guide.michelin.com venue pages (2017 special edition only — article
pages, no venue geo) and a direct `<shop> 緯度 経度` query returns only city centroids → restaurant pins stay
UNVERIFIED for `tools/geocode-helper.html`. Pinned food & drink comes from **facilities with ja.wikipedia infobox
coords** (breweries, markets) — 3-name batched queries.
**W31 SPR soup curry + jingisukan:** Magic Spice (MAPPLE spot + rurubu), Okushiba Shōten Ekimae (sapporo.travel + rurubu),
Rakkyo Kotoni (sapporo.travel + MAPPLE), Itadakimasu (promoted from held: sapporo.travel + rurubu spot + MAPPLE spot),
Tsukisappu Jingisukan Club, Shibetsu BBQ (sapporo.travel + rurubu 12-list). Held single (sapporo.travel only): Lavi
Hiragishi, Curry Shokudō Kokoro, Aiiro, Curryshop S, Juttetsu, Kiwami Yu-hi.
**W32 drink & markets:** Otokoyama Sake Park, Takasago Shuzō, Kunimare Shuzō (visit-hokkaido + rurubu + ja.wikipedia
pins, high); Otaru Sankaku Market (ja.wikipedia pin + otaru.gr.jp); Kita no Yatai (rurubu + MAPPLE); Daimon Yokochō
(rurubu + MAPPLE). **Rejected coordinate:** Kita no Yatai "42.918000,143.202056" — surfaced via the 帯広駅 article (station
point, not the alley) → UNVERIFIED. Mashike (Rumoi) filed under DHOKU (nearest Dōhoku area). Missed: Hokkaido Wine, Furano
Wine, Akkeshi Distillery have no infobox coords in results (address Akkeshi Miyazono 4-109-2 / Asarigawa Onsen 1-130 read).
**W33 DONAN:** shio ramen Jiyōken, Yūmin, Hōran, Shinano (MAPPLE 53509 + rurubu 10390 — merged result set; per-outlet
attribution caveat recorded in the script); Donburi Yokochō Chamu, Tabiji, Akebono (rurubu spot + **HAKODATEASAICHI** =
the Hakodate Morning Market cooperative's member directory; decision: a market body curating its members counts as one
corroborating local source, not the shop's own site).
**Address hygiene:** three W32 street numbers written from memory were caught on self-review and stripped to the
landmark actually read (Sankaku Market, Kita no Yatai, Daimon Yokochō).
**W34 SPR (2026-10-02, s3):** Ichiryūan (sapporo.travel + rurubu), Menya Yukikaze (MAPPLE TOP30 #3 + MAPPLE spot + GoodLuckTrip),
Ebisoba Ichigen (MAPPLE TOP30 #4 + GoodLuckTrip + Time Out Tokyo branch page), shime-parfait Satō Honten (rurubu +
visit-hokkaido + sapporo.travel BRUTUS magazine + Hokkaido Shimbun), INITIAL (rurubu + sapporo.travel magazine).
Held single: Ōkami Soup (MAPPLE TOP30 #5 only), Toguchi, Baisensha, Misogin, Ozawa, Musashi, Hōryū (sapporo.travel only).
**W35 OTARU:** ankake yakisoba Tororian (otaru.gr.jp + TripEat Hokkaido = Hokkaido Shimbun media), Keien (MAPPLE + TripEat),
Kōzushi (rurubu spot + MAPPLE sushi list). Held: Otaru Nihonbashi (otaru.gr.jp only), Takinami Shokudō (otaru.gr.jp only).
**W36 DHOKU:** Aoba Honten (promoted from held: rurubu spot + MAPPLE 43037), Yoshino Honten, Curry no Furanoya (promoted:
rurubu + MAPPLE curry list), Furano Delice (MAPPLE + rurubu spots). Held: Tenkin (MAPPLE only), Kumagera, KOERU curry udon.
**W37 TKC:** Butadon Ippin Honten (rurubu spot + MAPPLE spot + rurubu butadon-6), Indian Machinaka (rurubu + MAPPLE + TripEat;
promoted from held), Ryūgetsu Sweetpia Garden (visit-hokkaido + MAPPLE). Held: Hanatokachi, Yūtaku, Cranberry (rurubu only), Tontan (MAPPLE only).
**W40 ANIME (background agent, 15 searches):** see `_note_W40.md` — 4 kept (Pokémon Center Sapporo, Hokuchin Memorial Museum
[Golden Kamuy], Hakodate Arena [Love Live! Sunshine!!], Snow Miku Sky Town); dropped Doraemon Sky Park (closed 2025-07-14),
Kita no Kuni kara Museum (closed 2016), Obihiro Agricultural HS (working school; fans asked not to visit).
**NSK dead-end (3 searches):** Japanese guidebooks thin for Niseko restaurants; SAVOR JAPAN = Gurunavi reservation platform → 0.
Held: Soba-dokoro Rakuichi (niseko-ta.jp only), Teuchi Soba Ichimura (MAPPLE only). cntraveler/nytimes/guardian are blocked
to the search agent (400) — don't put them in allowed_domains.
**W38 DOTO:** Kushiro Ramen Kawamura (rurubu + kushiro-lakeakan.com = KUSHIROTOURISM), Fisherman's Wharf MOO & Ganpeki Robata,
Akkeshi Conchiglie, Michi-no-eki Utoro (all ja.wikipedia pins, high). Held: Ginsui (MAPPLE only).
**W39 NSK:** roadside stations with a named signature food — Bōyō Nakayama (age-imo), Niseko View Plaza, Akaigawa (ja.wikipedia pins).
Decision: a michi-no-eki counts as food & drink only when a source names its signature dish/produce.
**W41 IBURI:** Marutoma Shokudō hokki curry (rurubu + MAPPLE + visit-hokkaido plan), Yakitori Ippei Nakajima Honten (promoted:
visit-hokkaido travel-navi + MAPPLE Muroran yakitori list). Held: Restaurant Cowbell Shiraoi beef (rurubu only). Not added:
Michi-no-eki Date Rekishi no Mori (42.47061,140.8755) and Tōya-ko (42.6645,140.82183) — pins read but no signature food sourced.
**W42 SPR coffee:** MORIHICO main store (sapporo.travel + visit-hokkaido "Hometown Coffee"), Baristart (visit-hokkaido + Time Out).
Held: Miyakoshiya Maruyama (sapporo.travel only), Ishida Coffee. Tabelog kissaten-100 query → no Hokkaido names (dead end).
**Build #4 (s3):** 241 discovered → 144 rendered (130 sights + 14 food). sourcecheck PASS 241 · geocheck PASS · statuscheck
CONSISTENT (0 unchecked) · buildcheck PASS · validate DATA OK · npm test ALL PASS. 97 UNVERIFIED held (restaurants → helper).
Searches so far this session ≈ 76 (me ~61 + W40 agent 15).
**W43 SPR drink (Time Out "50 things to do in Sapporo" as the editorial spine):** Bar Yamazaki (Time Out + MAPPLE Susukino),
Jazz Café Bossa (sapporo.travel + Hokkaido Shimbun 50-year profile + Time Out), Miyoshino Tanukikōji gyoza-curry (sapporo.travel
+ Time Out). Held: Iso-chan (Time Out only), M's Space (Time Out only). Time Out "10 things to eat" → no new names (dead end).
**W44 OTARU:** Shakotan uni — Nakamuraya, Shokudō Ushio, Misaki (rurubu spots + visit-hokkaido uni features + MAPPLE; merged
set, caveat in script); Tanaka Shuzō Kikkōgura, Otaru Sōko No.1 (Otaru Beer), Niikuraya Hanazono dango, Amatō cream zenzai
(otaru.gr.jp guidemaps + visit-hokkaido / rurubu / MAPPLE). Prose hygiene: stripped unsourced colour (founding year, a
product name, brewing-law claim) on self-review.
**W45 DONAN:** California Baby Cisco rice (rurubu + MAPPLE B-gourmet), Numa no Ya Ōnuma dango (rurubu + MAPPLE spots), Hakodate Beer
(rurubu + MAPPLE craft-beer list), Hakodate Beer Hall (promoted from held: rurubu + hakodate.travel). Held: Asari Honten sukiyaki
(rurubu only), Misuzu coffee Daimon (MAPPLE only), Snaffle's (MAPPLE only). Two street names from memory stripped on review.
**W46 SOYA:** Rebun — Kaisen-dokoro Kafuka, Robata Chidori (rurubu spots + MAPPLE Rebun list). Held: Satō Shokudō Rishiri (MAPPLE only).
**W47 creators:** Ramen Adventures (Brian MacDuckston; named in the Japan brief) — attached to Menya Saimi and Menya Yukikaze;
Fujiya NOODLE promoted (Michelin Bib 2017 + Ramen Adventures). Rejected attaching the negative airport-branch Ichigen review.
Creator queries this session: 1 (yield 3).
**W47b creators:** Ramen Adventures "Hokkaido best ramen 2024" (top-100) attached to Aoba (#20), Hachiya Gojō (#39), Jiyōken (#29),
Ajisai (#45), Shinano (#97) + Baikōken listing — this also independently corroborates the W33 merged-attribution shio shops.
Held (RA only): Seiryūken Hakodate, Shukoen Kushiro, Tenkin (#33), Tsuruya, Mizuno, RAMEN ROOM 18, Maruhira, Kobo.
**W48:** Curb Market Kita no Gourmet-tei & Marusan-tei (rurubu features + MAPPLE market article), Nijō Uoya no Daidokoro (rurubu +
MAPPLE spot + MAPPLE readers' ranking), Biei Senka (visit-hokkaido + rurubu). Held: Dokushaku Sanshirō (MAPPLE only), Farm Restaurant
Chiyoda. Density after W48: food 116 / 262 discovered = 44% (was 26%).
**W49 IBURI:** ROYCE' Chocolate World (rurubu + visit-hokkaido), Wakasaimo Honpo Tōyako (rurubu + laketoya.com = LAKETOYA, Tōyako Onsen
Tourism Association). Held: Kirin Chitose brewery (MAPPLE list only; address Kaminagatsu 949-1 read), Sapporo Beer Hokkaido
Brewery Eniwa (address only), Fukuan soba Noboribetsu (rurubu only). Wiki-pin miss ×3 (corporate plants have no own infobox).
**W50 TKC:** Cranberry Honten (obikan.jp = OBIKAN, Obihiro Tourism & Convention Assoc. + MAPPLE; promoted from held), Masuya
Honten (rurubu + MAPPLE bakery list). Held: Mugioto, Hanabatake Farm (MAPPLE only).
**W51:** Nanbantei zantare (rurubu + MAPPLE spots), Satō Shokudō Rishiri (rishiri-plus.jp = RISHIRIPLUS island tourism portal + MAPPLE).
Held: Kani no Shōya Nemuro, Rausu no Kaimi Shiretoko Shokudō (MAPPLE only), Senchan Shokudō (kushiro-lakeakan only), Karafuto
Shokudō Wakkanai (rurubu only), Isoyakitei Rishiri (rishiri-plus only). "Otomari" in a result summary = mis-romanised 鴛泊 → address
kept generic ("ferry terminal") rather than correct it from memory.
**W52:** Michi-no-eki Mukawa (shishamo; rurubu + wiki pin), Sarufutsu Kōen (scallops; visit-hokkaido + rurubu + wiki pin). Swan 44
Nemuro pin read (43.26175,145.43847) but no signature food sourced → not added.
**W53:** Shikabe Kanketsusen Kōen (geyser steam-cooking + tarako; visit-hokkaido + rurubu + wiki pin), Pia 21 Shihoro (Shihoro beef;
rurubu + wiki pin). 道の駅しらおい: no wiki coords surfaced. **W54 NSK:** 230 Rusutsu (rurubu feature + MAPPLE + visit-hokkaido + wiki
pin), Makkari Flower Center (yuri-ne; rurubu + visit-hokkaido + wiki pin). Niseko Distillery: no coords (adjacent to Iroha onsen — held).
**W55:** Nanairo Nanae (guaraná soft-serve, Yamakawa beef croquette; rurubu + wiki pin), Ryūhyō Kaidō Abashiri (Abashiri burger,
zangi-don; rurubu + MAPPLE + visit-hokkaido + wiki pin), Mashū Onsen (venison burger; rurubu + wiki pin).
**W56 (0 searches — reuse):** Ekini Ichiba squid-fishing (hakodate.travel gourmet page + rurubu spot, both read in W33/W45 sets),
Hakodate Kaisen Ichiba (hakodate.travel + rurubu spot).
**W57:** Utonai-ko (hokki curry, Tomakomai miso-curry ramen; visit-hokkaido + wiki pin), Biei Shirogane Birke (Biei-wheat burgers;
visit-hokkaido + rurubu + wiki pin). Not added (no signature food sourced): Date Rekishi no Mori, Tōya-ko, Asahikawa (pin 43.75992,
142.34853 read), Okhotsk Monbetsu (44.32839,143.37494). **W58:** Mochigome no Sato Nayoro soft daifuku (rurubu + TripEat + wiki pin; DHOKU).
**W60 sights (background agent, 12 searches):** see `_note_W60.md` — 13 kept (Esan, Komagatake, Hakodate Park, Hakodate Museum of Art,
Bōgakudai, Kamui Kotan, Lake Nukabira [med: dam coord], Mikuni Pass, Arishima Memorial Museum, Hongō Shin museum, Fugoppe Cave,
Cape Noshappu [med: lighthouse coord], Noshappu Aquarium). Held: Hangetsu Lake, Kompira crater (no coords), Wakkanai Youth Science Museum.
**W61:** Hokkaido University campus (sapporo.travel + visit-hokkaido + wiki; med — campus point). Held: Sapporo City Archives
(43.058528,141.337472) and Former Nagayama residence (43.0659111,141.3645167) — pins read, no 2nd source yet.
**Registry:** SOURCES_HOKKAIDO_W61.json gives real `credible` rationales for 12 AUTO-registered keys (OFFICIAL, ANIMETOURISM88,
GAMER4, HAKODATEASAICHI, KUSHIROTOURISM, TIMEOUT, TRAVELJP, TRAVELWATCH, LAKETOYA, NISEKOTOURISM, OBIKAN, RISHIRIPLUS) — patched into
data/sources.json under the lock.
**Build #5 (s3):** 296 discovered → 170 rendered (144 sights + 26 food). sourcecheck PASS 296 · geocheck PASS · statuscheck CONSISTENT ·
buildcheck PASS · validate DATA OK · npm test ALL PASS. 126 UNVERIFIED held (restaurants → helper). Food share 136/296 = 46%
(per area: SPR 54% · OTARU 50% · TKC 44% · DONAN 43% · DHOKU 46% · DOTO 45% · IBURI 35% · NSK 43% · SOYA 33%).
ANIME collection: 4 (W40). Searches ≈ 131 (me ~104 + agents 27).
**W62 IBURI:** Restaurant Bōyōtei (rurubu + laketoya.com). Held: Ushi no Sato Shiraoi beef (shiraoi.net only), Toridatsu Muroran
(MAPPLE only). Michelin Hokkaido 2017 Bib list → no list surfaced (dead end).
**W63 SPR:** GoodLuckTrip "21 Must-Try Restaurants in Susukino" as one source × sapporo.travel: Curry Shop S, Umi Hachikyō Honten,
Night Parfait Nanakamado, Parfaiteria PaL. Held (GoodLuckTrip only): Uni Marukawa, Hakodate Kaiyōtei, Kitaushi, Ginbekoya, Seizan,
Fuhdo, Yukimura (COCONO), Kirin Beer Garden Urban.
**W64 SPR:** sights with ja.wikipedia pins + sapporo.travel facility pages — Maeda Forest Park, Yurigahara Park, Governor's Official
Residence, Former Nagayama Residence; food — Kiwami Yūhi jingisukan (sapporo.travel + GoodLuckTrip jingisukan-12). Held (GoodLuckTrip
only): Matsuo Jingisukan Sapporo Ekimae (also rurubu-held — URL not retained, re-query), Lambsuke, Kitanoki no Kaze, Hitsujiya,
Daikokuya Hakodate, Iidaya; Soup Curry TREASURE. Sapporo City Archives: no 2nd source surfaced.
**W65 SPR:** Sapporo Satoland, Hiraoka Park plum grove, Seikatei (ja.wikipedia pins + sapporo.travel / visit-hokkaido).
**W66 SPR:** Jōzankei Dam & Sapporo Lake, Mt Hakken / Kannon-iwa (ja.wikipedia pins + jozankei.jp = JOZANKEITOURISM, Jōzankei Tourism
Association + visit-hokkaido). Chi-Ka-Ho underground walkway: no own coord (only an adjoining building's) → not added.
**W67 SPR sweets:** Rokkatei Sapporo Honten (rurubu + visit-hokkaido; replaces the s2 drop — dish now named), Kinotoya Ōdōri (rurubu +
sapporo.travel soft-serve feature; promoted from held), Ōdōri BISSE sweets hall (sapporo.travel + visit-hokkaido). Held: ISHIYA Café Ōdōri.
**W68:** Space Apple Yoichi (rurubu + wiki pin), Misogi no Sato Kikonai (visit-hokkaido Dōnan feature + wiki pin). Biei Oka no Kura
(43.59214,142.46378) — no named dish → not added.
**W69 DOTO:** Kushiro Rāmen Maruhira (rurubu + Ramen Adventures top-100 #66), Uocchi Rāmen Kōbō (rurubu + kushiro-lakeakan).
Held: Kadoya, Hokuto, Junsui Harutori (kushiro-lakeakan only); Teshikaga Ramen (only the Kitahiroshima branch surfaced).
**W70 DHOKU:** Tsuruya Asahikawa (rurubu + RA #40). Held: Tenkin Yonjō (RA #33 + unattributed listing), Furarīto shinko-yaki alley
(visit-hokkaido only), Rāmen Kura, Mikazuki, Kusabi (rurubu only).
**NSK food — exhaustion note:** Niseko Cheese Kōbō, Niseko Gelato, Takahashi MANDRIANO / PRATIVO, Ange de Fromage each surfaced in only
ONE outlet (rurubu or niseko-ta.jp) across 4 Niseko food queries this session → held, not filled. visit-hokkaido dish pages
(室蘭やきとり / 白老牛 / 豚丼) name no shops → no 2nd source for Toridatsu / Ushi no Sato / Hanatokachi.
**W71 ANIME overlay (2 searches):** Golden Kamuy notes added to Abashiri Prison Museum (Gendai), Upopoy (kamuy-anime.com official
campaign + Bijutsu Techō exhibition), Noboribetsu Jigokudani (Famitsu: 2024 Hell Festival collab) → ANIME collection 4 → 7.
**Tooling (lesson → code):** `tools/japan_consolidate.py` `_take()` dropped exact-name duplicates silently, so an overlay record
could not add sources/notes to an existing place. New `_overlay()` merges ONLY sources + a missing "anime" note (never prose,
area or pin). Verified behaviour-neutral for Tokyo/Kyoto/Osaka/Okinawa (their consolidated outputs byte-identical).
**W72 DOTO:** Nusamai Bridge (visit-hokkaido + kushiro-lakeakan + wiki pin), Kamuiwakka Hot Falls (visit-hokkaido + ja.wikipedia; no
coords in infobox → UNVERIFIED). Held: Koshimizu Natural Flower Garden (pin 43.94194,144.413417 read; 2nd source not attributable).
**W73 DHOKU:** Asahibashi Bridge, Fukiage Onsen (visit-hokkaido + wiki pins), Biei Shirogane Onsen (visit-hokkaido + wiki; no coords → UNVERIFIED).
**W74 OTARU:** Kama-ei factory store pan-roll (MAPPLE + otaru.gr.jp kamaboko guide), Kitaichi Hall lamp café (rurubu + MAPPLE retro-café
round-up; caveat). Held: Kitakaro Otaru Honkan (unattributed).
**W75 DONAN:** Sushi-dokoro Kihara (hakodate.travel + rurubu). Dropped: Kantarō (chain, branch not named in sources). Held: Uomasa
Goryōkaku (rurubu only), Kaikōbō, Bingoya (hakodate.travel only).
**Final build (session 3):** 327 discovered → 184 rendered (156 sights + 28 food). sourcecheck PASS 327 (1 lone authority) · geocheck
PASS · statuscheck CONSISTENT (0 unchecked) · buildcheck PASS · validate DATA OK · npm test ALL PASS. 143 UNVERIFIED held.
Food share 153/327 = 47% (session start 26%). ANIME 7. JOZANKEITOURISM given a real rationale (SOURCES_HOKKAIDO_W75.json).
Channel mix (session 3 second sources): guidebook editorial ~40% (RURUBU, MAPPLE), official tourism ~35% (HOKKAIDOTOURISM,
SAPPOROTRAVEL, HAKODATETRAVEL, OTARUTOURISM, KUSHIROTOURISM, OBIKAN, LAKETOYA, JOZANKEITOURISM, NISEKOTOURISM, RISHIRIPLUS), encyclopedic
pins (WIKIPEDIA_JA) ~15%, travel media/creators ~10% (TIMEOUT, GOODLUCKTRIP, RAMENADVENTURES creator, HOKKAIDOSHIMBUN/TripEat, FAMITSU).
**W76 IBURI (post-final, 2 searches):** Mt Tarumae (visit-hokkaido + japan-guide + wiki pin), Ōyunuma River footbath (noboribetsu-spa.jp =
NOBORIBETSUTOURISM + visit-hokkaido; "大湯沼" coord rejected — no own article). Held: Koke-no-dōmon moss gorge (no coord).
**W77 IBURI:** Soba-dokoro Fukuan (promoted: rurubu + MAPPLE Noboribetsu list; caveat).
**W78 NSK:** Niseko Goshiki Onsen (promoted from held: visit-hokkaido + wiki pin), Niseko Yumoto Onsen & Ōyunuma (niseko-ta.jp + wiki;
med — onsen-area point). Town names left generic (Rankoshi not read in results). Chisenupuri pin read (42.88806,140.59667) — no 2nd source.
**W79 TKC:** Banei Tokachi / Obihiro Racecourse (visit-hokkaido + wiki pin), Obihiro Centennial City Museum (rurubu + wiki pin).
Sushi Miyakawa (Michelin 3★ 2017) — no address/2nd source surfaced (held).
**Closing build (session 3):** 334 discovered → 189 rendered (161 sights + 28 food). sourcecheck PASS 334 · geocheck PASS · statuscheck
CONSISTENT · buildcheck PASS · validate DATA OK · npm test ALL PASS. 145 UNVERIFIED held. Food 154/334 = 46%. ANIME 7. Searches ≈178.

## 2026-10-02 — session 4 · W85 SPR sights (orchestrator, 9 searches incl. 4 pin-probe)
- **Pin probe (restaurants):** `<shop> 緯度 経度 mapion`, `<shop> google maps !3d`, `openstreetmap node …`, ja.wikipedia coords for
  五島軒/小樽倉庫No.1/ハセガワストア → no restaurant coordinate surfaced (summaries return only addresses; shop articles carry no infobox
  coord). Decision: restaurant pins only via host-landmark wiki coords at `med` (delegated to W80); the rest stay for `tools/geocode-helper.html`.
- **Kept 10 (all ja.wikipedia infobox coords + sapporo.travel / visit-hokkaido / japan-guide):** Kitara (t2), Hokkaido University Museum
  (t2, **med** — infobox second-precision ~150 m W of entrance; was held in W01 as inconsistent, now on-campus), Migishi Kōtarō Museum (t3),
  Hokkaido Museum of Literature (t3), Nopporo Forest Park (t2, med park point), Koganeyu Onsen (t3, med onsen-area point), ES CON FIELD
  HOKKAIDO (t1 — Kitahiroshima, metro Sapporo), Sapporo Teine (t2), Sapporo Kokusai (t2), Sapporo Astronomical Observatory (t3).
- **Held single-source:** Sapporo Science Center (wiki only + thin), Hoshioki Falls (wiki only), Sapporo Salmon Museum (wiki only),
  Watanabe Jun'ichi Literary Museum (no coord, no 2nd source), Sapporo City Archives (still no 2nd source).
- Channel mix: official tourism 3 outlets · notable travel site 1 (japan-guide) · encyclopedia 1. Status: all open (current pages).
