# 4-town session search log (PGL/BLS/NVN/HLV) — 2026-10-02 relaunch
Count is cumulative WebSearch calls for this session.
1-7 PGL: SethLui Punggol hawker; Eatbook Punggol Coast; Michelin Punggol (thin); Oasis Terraces (thin: no hawker guide);
   TimeOut Punggol Coast; Her World One Punggol; Eatbook One Punggol -> +4 food (FOOD_PUNGGOL2)
8-12 PGL: Matilda House (+1 sight); TSL Punggol things-to-do (Waterway Park/bridges still TSL-only); LIC/Eatbook Punggol restaurants; Punggol Settlement status; Eatbook 30-best -> +4 food
13-21 BLS: Roots Balestier trail; NHB booklet/wonderwall; Goh Chor TPK (+REMEMBERSINGAPORE+URA); Eatbook Balestier guide; Honeycombers Balestier&Novena; BKT; Zhongshan Mall (Eatbook-only, held); TimeOut Balestier; Roots food trail (bakeries Roots-only, held) -> +5 sights, +2 food, +1 NVN food
22-27 NVN: SethLui Novena/Thomson; Eatbook/LIC Novena; Newton guides; Novena Church; SG101 Novena; Goodwood Park -> +3 food, +2 sights
(geocoder #1 used 12 searches -> geo/_geoout_punggol_w2.json, 13 pins)
28-38 HLV: HV food guide; HV MFC; HV Michelin (Ru Ji Bib); HV MFC stalls; Honeycombers HV; Eatbook HV; creator query (no creator hits); HV heritage (Chip Bee); Holland Drive FC -> +4 food +1 sight
39-41 NVN Newton: Eatbook/WW Newton; EXTENDED x2 (multi-guide stall extraction — better yield) -> +3 food
(geocoder #2 launched: buildings — Whampoa Makan Place, Ghim Moh, HV MFC, Punggol Coast, Settlement, BLS/NVN sights)
42-46: EXTENDED Whampoa (+4 BLS), EXTENDED Ghim Moh (+2 HLV kept, 2 held as WW/HerWorld-only = one syndicated voice), EXTENDED Punggol (+4 PGL), Ghim Moh 2nd-source check
(geocoder #2 used 16 searches -> geo/_geoout_sg4_w2b.json: Ghim Moh building + 4 sights pinned; Whampoa/HV MFC/Punggol Coast unpinned)
BUILD 1 (after ~49 own + 28 geocoder searches): PGL 27/116, BLS 29/55, NVN 16/55, HLV 24/55; gates geocheck PASS, statuscheck CONSISTENT, buildcheck PASS, sourcecheck FAIL only on 46 pre-existing single-source places elsewhere.
47-48 BLS geocode attempts for Whampoa Makan Place building (dead end: only street/estate centroids) -> stop geocoding hawker buildings via search
49-58: EXTENDED Balestier restaurants (mostly single-source; Ah Hak = MTC); BLS heritage (+Malay Film Productions, Art Deco shophouses, Zhongshan Park, Whampoa Makan Place sight); EXTENDED BLS names (+Kim BCM, Xin Mei Xiang); creator pass (Food King deleted all videos 2022 -> rejected as a source); EXTENDED Whampoa lists (HGW 15 names; mostly HGW-only); EXTENDED Michelin NVN/BLS (+Alma, Gordon Grill, Iru Den); Michelin Novena region page (dead end)
59-64: EXTENDED NVN heritage (+Old Police Academy, TTSH Heritage Museum, 1 Moulmein Rise, Polo Club); EXTENDED HLV landmarks (+Rail Corridor; Thambi closed 5 May 2024; Shuang Long Shan out of scope); EXTENDED Holland Drive (+5); EXTENDED Novena restaurants (low yield)
65-75: EXTENDED Punggol restaurants (+Georges, Hakka Leipopo, Uncle Penyet); EXTENDED Punggol Coast lists (+Kedai Salima, Huay Kwang); EXTENDED Punggol sights (+Waterway Park, Regional Library); EXTENDED Whampoa cross-lists (+4); EXTENDED Balestier institutions (+Sweetlands, Bao Er, Tanjong Rhu Pau, Lam Yeo); Zhongshan Mall (Eatbook-only, dead end); Balestier trail landmarks (low yield); WW/SethLui Whampoa (+2 source attaches); Balestier Food Centre (+Ah Hui, Soon Kee Long House); EXTENDED HV restaurants (+6)
NOTE: Mothership Dec 2025 — Timbre stops managing One Punggol HC in 2026: One Punggol stall line-up must be re-checked.
NOTE: Women's Weekly (Blk 91 list) still places 545 Whampoa Prawn Noodles at Whampoa while Seth Lui places it at Tekka / a Novena food court (Sep 2025) — held, status unresolved.
76-84: Balestier names (+Miao Sin CLOSED 26 Feb 2026); Honeycombers Newton (+Buona Terra, Indocafe, Waffletown); Newton/Novena malls (chain-heavy -> dropped as padding; +545 Whampoa & Tai Seng at Hawkers' Street Square 2); Ghim Moh cross-check (+Jiu Jiang via MTC); Chip Bee (+Original Sin, Sunday Folks); One Holland Village (chains only -> MEASURED & DROPPED: Sushi Tei, Tsujiri, Din Tai Fung, Hip Pot, Xiang Xiang, Lau Wang); HV HGW/SethLui/D65 (+6)
(geocoder #3 used 12 searches -> geo/_geoout_sg4_w2d.json: 8 pins incl. Goodwood Park (Wikipedia), Old Police Academy (closed 2005), Waterway Park)
BUILD 2: PGL 34, BLS 46, NVN 28, HLV 44 discovered; rendered pins punggol 16 / balestier 5 / newton-novena 19 / holland-village 23. Gates: geocheck PASS, statuscheck CONSISTENT, buildcheck PASS, sourcecheck FAIL only on 46 pre-existing single-source places (none in these 4 towns); validate DATA OK; npm test ALL PASS.
