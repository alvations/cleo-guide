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
