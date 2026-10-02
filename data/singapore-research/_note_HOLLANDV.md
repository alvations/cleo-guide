# Holland Village (HLV) — agent note (tag HOLLANDV) — 2026-10-02 run

Page: `Singapore/holland-village.html` (slug `holland-village`, area code `HLV`). Target from
`python3 tools/density.py singapore --area HLV` = **55** (SG_POP 40k → floor 55). Start = 0 HLV-coded
(+2 pre-existing on the page via keywords: `Holland Village` sight [SGWN], `Margaret Drive Sin Kee Chicken
Rice` [SGWN] — both deduped against, never re-added).

Scope: Holland Village (Lorong Mambong, Lorong Liput, Jalan Merah Saga/Chip Bee Gardens, Holland Village
Market & Food Centre, Holland Drive Market & Food Centre, Holland Road/Holland Road Shopping Centre, Holland
V MRT/One Holland Village), Queen Astrid Park, Botanic-Gardens edge (Holland Rd/Tyersall side — NOT the
Gardens itself, which is on bukit-timah), Ghim Moh Market & Food Centre + estate, Taman Warna, the Rail
Corridor stretch by Holland Rd/Ghim Moh. **Excluded:** Dempsey Hill + Bukit Timah (own pages).

Files (this tag only): `FOOD_HOLLANDV*.json`, `SIGHTS_HOLLANDV*.json`, `CREATORS_HOLLANDV*.json`,
`SOURCES_HOLLANDV*.json`, `geo/_wl_hollandv.json`, `geo/_geoout_hollandv_*.json`, this note.

## In-flight wave
- none (W1 closed early — see State). Next agent: start W2 per "Next actions".

## State (2026-10-02, after W1)
- **W1 (HOLLANDV) DONE (truncated):** 27 WebSearch calls, then the **shared session WebSearch cap (200/200)**
  stopped all searching (confirmed by a retry). Kept **13 places** (10 food + 3 sights), every one >=2 credible
  sources or a lone Michelin listing. Density: `HLV 10 food + 3 sights = 13 / target 55 -> NEED +42` (+2
  pre-existing SGWN records on the page: Holland Village, Margaret Drive Sin Kee Chicken Rice).
- **Geocode:** 5 pinned (`med`) by reusing the registry's sourced Holland Drive MFC pin (stall-within-food-centre
  convention, as for Sin Kee); **8 UNVERIFIED** (Ghim Moh MFC + its 6 stalls + Holland Village MFC) — no place pin
  could be read once search was capped; queued for `tools/geocode-helper.html`. Never estimated.
- **Build:** `rebuild-city.py singapore --build --geo-only "_geoout_hollandv_*.json"` -> holland-village.html now
  renders **7 pins** (still greyed — NOT live). Gates: geocheck PASS · statuscheck CONSISTENT · buildcheck PASS ·
  sourcecheck FAIL = 46 pre-existing single-source places in other towns (none HLV; GATE 1 drops them) ·
  `npm run validate` DATA OK · `npm test` ALL PASS.
- **Closure flagged:** Guan Kee Fried Kway Teow — CLOSED (Ghim Moh, Bib 2019; closed 28 Nov 2023 — Eatbook,
  Mothership, Seth Lui, Wikipedia).
- **Go-live NOT done:** 13/55 discovered and 7 rendered is not "dense" — `holland-village` stays out of LIVE_SLUGS.

### W1 records (tier · place · sources)
Food — Ghim Moh MFC: t1 Chuan Kee Boneless Braised Duck (MICHELIN Bib + Seth Lui) · t1 Ghim Moh Chwee Kueh
(MICHELIN + Women's Weekly + Seth Lui) · t2 Guan Kee Fried Kway Teow — CLOSED · t2 Ghim Moh Carrot Cake (Eatbook +
Miss Tam Chiak + Ordinary Patrons) · t2 Hin Fried Hor Fun (ieatishootipost + Seth Lui + Miss Tam Chiak + Women's
Weekly) · t2 Heavens appam & thosai (Seth Lui + ieatishootipost + Women's Weekly). Holland Drive MFC: t1 New Lucky
Claypot Rice (MICHELIN Bib 2024/2025 + Eatbook + HungryGoWhere) · t2 Cheng Heng Kway Chap & Braised Duck Rice
(Seth Lui + SG Food on Foot + Her World; Michelin Plate 2018) · t2 Shima's Kitchen (Eatbook + Women's Weekly + Her
World + HGW) · t3 Hakka Noodle (Eatbook + Women's Weekly).
Sights: t1 Ghim Moh Market & Food Centre (Time Out + Seth Lui + WW + Her World + Ordinary Patrons) · t2 Holland
Village Market & Food Centre (Eatbook + Seth Lui + Her World + WW + HGW) · t2 Holland Drive Market & Food Centre
(same five outlets).
Ranking: t1 = Michelin-recognised standouts within HLV; t2 = multi-outlet consensus; t3 = two-outlet only.

### Channel mix (W1, per §2a) — counts of places each channel contributed a source to
- Institutional (Michelin Guide): 3 · Editorial (Eatbook, Seth Lui, Women's Weekly, Her World, HungryGoWhere,
  Time Out, Mothership, Wikipedia): 13 · Creators/bloggers (ieatishootipost, Miss Tam Chiak, Ordinary Patrons, SG
  Food on Foot): 5 · Viral YouTube/TikTok/IG: **0 — the creator-search queries were next in the plan when the cap
  hit** · Local recommendation: 0. Yelp/TripAdvisor/Google/Burpple/OpenRice = 0 throughout.

### MEASURED & HELD / DROPPED — see `CREATORS_HOLLANDV.json` rejected[] (9 entries)
Held: Thiam Kee 1977 (1 source), Teck Hin Delicacies (1 outlet confirmed), Jiu Jiang Shao La (status unconfirmed
— 2015-17 reviews), Old Teochew mee siam (1 source), Ru Ji Kitchen, Blanco Court Kway Chap (location
unconfirmed), Holland V MFC stalls (Holland V. Fried Bee Hoon, Ming Fa, 363 Katong Laksa, Twirl Pasta),
HV restaurants (Frankie & Fern's, Le Bon Funk, Sourbombe, Sushi Zanmai). Dropped: Kong Shang Hua wanton (Burpple
only, mixed).

## Next actions (W2, when WebSearch budget is available)
1. Confirm per-stall attribution for the Holland Village MFC lists (Her World / WW / Eatbook / Seth Lui) and add.
2. HV café/restaurant canon: Honeycombers + Seth Lui HV guides, One Holland Village (Seth Lui list), Chip Bee /
   Jalan Merah Saga (Original Sin, Da Paolo, Sunday Folks, Michelangelo's), Lorong Mambong/Liput (Wala Wala,
   2am:dessertbar), Holland Road SC (Frankie & Fern's) — each to >=2 credible + 2025/26 open check.
3. Creators pass (YouTube/TikTok/IG: "Holland Village food tiktok", "Ghim Moh youtube") — §2a.
4. Sights: Queen Astrid Park, Chip Bee Gardens / Jalan Merah Saga, Taman Warna, Rail Corridor (Holland Rd /
   Ghim Moh stretch), Tyersall Learning Forest (Botanic Gardens Holland Rd edge — NOT the Gardens), One Holland
   Village, Holland Village Shopping Centre (Lim's), Thambi Magazine Store (check status) — Roots/NParks/Wikipedia.
5. Geocode: Ghim Moh MFC + Holland Village MFC place pins (OneMap/Wikidata via search) -> re-run the 8 UNVERIFIED
   (edit `geo/_geoout_hollandv_w1.json` -> new `_geoout_hollandv_w2.json`), then
   `flock -w 3600 .git/cleo-shared.lock python3 tools/rebuild-city.py singapore --build --geo-only "_geoout_hollandv_*.json"`.
6. Measure: `python3 tools/density.py singapore --area HLV`; go live (LIVE_SLUGS) only at >=55 discovered + gated.

## W2 (2026-10-02 relaunch, 4-town session) — GO-LIVE
- **Outcome:** HLV 52 food + 5 sights = **57 / target 55 -> OK**; `holland-village` added to LIVE_SLUGS; page renders **33 pins**.
  Gates: geocheck PASS · statuscheck CONSISTENT · buildcheck PASS · sourcecheck FAIL only on 46 pre-existing places elsewhere (0 in HLV) ·
  validate DATA OK · npm test ALL PASS.
- **Files:** FOOD_HOLLANDV2.json (37), SIGHTS_HOLLANDV2.json (2: Chip Bee Gardens, Rail Corridor Holland Rd), geo/_geoout_hollandv_w2.json, _w3.json
  (+ shared geo/_geoout_sg4_w2b.json: Ghim Moh MFC building pin from Wikipedia 'Guan Kee Fried Kway Teow' infobox).
- **Added (by venue):** Holland Drive MFC (Ru Ji Kitchen [Bib], Blanco Court Kueh Chap, Aini, Leong Wei, Traditional Carrot Cake, Butter Town,
  Lao Chen Ji, Fifty Year YTF, Yap Kee, Gaziantep, Zhen Ji, Ru Fa Bao Dian, Lin Da Ma); Ghim Moh MFC (Yuan Hokkien, Yuan Thai beef noodle,
  Jiu Jiang Shao La, Thiam Kee 1977, Ah Seng Durian, Teck Hin); HV MFC (Ming Fa, 363 Katong Laksa, Holland V Fried Bee Hoon, Ah Fong);
  restaurants (Warabimochi Kamakura, Cha Cha Cha, La Nonna, 2am:dessertbar, Surrey Hills, Lola's, Original Sin, Sunday Folks, Alt. Pizza,
  British Indian Curry Hut, Wang Dae Bak, 88 Pocha, Ginkyo by Kinki, Tai Cheong Bakery).
- **Channel mix W2:** institutional 1 (Michelin Bib Ru Ji); editorial (Eatbook, Seth Lui, HGW, Honeycombers, WW, Her World, Time Out, LIC);
  creators/bloggers (Daniel Food Diary, Miss Tam Chiak, Johor Kaki, Ordinary Patrons, SG Food on Foot); viral YouTube/TikTok 0 (creator query
  found none naming HV stalls).
- **MEASURED & DROPPED:** One Holland Village chains (Sushi Tei, Tsujiri, Din Tai Fung, Hip Pot, Xiang Xiang Hunan, Lau Wang) = padding.
  Women's Weekly + Her World lists treated as ONE syndicated voice (Headless Baker held; Jiu Jiang kept only after Miss Tam Chiak corroborated).
- **Held (1 source):** Frankie & Fern's, Le Bon Funk, Sourbombe, Mu Parlour, Chimichanga, Fireplace by Bedrock, Mei Di, Golden Swallow,
  Famous Annie's, Kong Shang Hua, Lian He (possible dup of Ghim Moh Carrot Cake), Coffee Break, Daddy Cuisine, Holland Road Shopping Centre
  (Wikipedia only), Thambi Magazine Store (CLOSED 5 May 2024 — TSL; not added).
- **UNVERIFIED pins (helper):** Holland Village MFC building + its 4 stalls; Lorong Mambong/Liput restaurants; One Holland Village; Chip Bee.
- **Next:** geocode HV MFC + Lorong Mambong restaurants + One Holland Village (`tools/geocode-helper.html`); status re-check pass.
