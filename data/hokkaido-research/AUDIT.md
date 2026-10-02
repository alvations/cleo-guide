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
