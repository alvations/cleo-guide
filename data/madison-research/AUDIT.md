# Madison & Dane County (WI) — AUDIT ledger (append-only)

Pipeline contract: docs/PIPELINE.md. Run protocol: docs/RUN-2026-10-02.md. One dated section per stage per wave.

## 2026-10-02 · Stage 0 — Scope & taxonomy
- **Region:** Madison (the Isthmus between Lakes Mendota & Monona) + Dane County + the classic day trips
  (Spring Green/Taliesin, New Glarus, House on the Rock, Devil's Lake/Baraboo).
- **Areas (7):** `CAP` Isthmus & Capitol Square · `UW` campus & State St · `EAST` Willy St/Atwood/Monona/north
  side · `WEST` Monroe St/Arboretum/Hilldale/Odana · `MVF` Middleton/Verona/Fitchburg · `DANE` county towns ·
  `TRIP` day trips. Why: Madison's neighbourhood identity is isthmus-centred (downtown vs campus vs east vs west);
  Dane County towns are distinct heritage towns (Norwegian Stoughton/Mount Horeb); day trips are the region's
  marquee sights (Taliesin, New Glarus, Devil's Lake) and would otherwise pull the map far out of town — kept in
  their own area so tiers are graded within region.
- **Cuisines:** Wisconsin canon first — CURD (cheese curds), FISH (Friday fish fry), SUPPR (supper clubs + brandy
  old fashioneds), TAV (taverns/brats/burgers), CREAM (Babcock/custard), BAKE (bakeries/kringle), SEA (Hmong/Lao/
  SE Asian), BREW (beer/wine/spirits), FINE (farm-to-table), plus US/PIZZA/MEX/MED/EURO/ASIAN/BREAK/MKT/FARM/VIRAL.
- **Collections:** ICON, FLW (Frank Lloyd Wright — Madison is a Wright city), CAMPUS, MUS, LAKES, OUTDOOR, HIST,
  ARTS, FAM, ODD, FREE.
- **Target:** Pittsburgh-peer ~210 (per-area targets in RESUME.md).

## 2026-10-02 · W1 food canon — Stage 1 (sources) + Stage 2 (places) — TRUNCATED by WebSearch session cap
- **Searches run:** ~22 (curds, fish fry, supper clubs/old fashioned, JB winners/semifinalists 2023–2026, JB "Ask a
  Chef: Tory Miller", Hmong/Lao, + geocode probes). Then WebSearch returned **"200 of 200 calls used"** — the session
  budget is shared by all ~16 concurrent agents and was exhausted. Per protocol: nothing fabricated; leads logged in
  `_PENDING_LEADS.md` with their URLs and what each still needs.
- **Sources accepted (SOURCES_W1.json, 14):** WSJ, CAPTIMES, ISTHMUS, MADMAG, CITYCAST, UPNORTHNEWS (reader-vote,
  corroborating only), WKOW, JAMESBEARD, VISITMADISON, TRAVELWI, INFATUATION, WPR, EXPERIENCEWI, WIKIPEDIA.
  **Rejected:** northshorefamilyadventures.com fish-fry roundup (family blog, unverified popularity — used only as a
  lead), tablejourney.com / atmosfy / joinpearl / overlookmaps (aggregators), fightcancer.org tag page (spam).
  **Note:** JB "Ask a Chef" = one credible chef recommendation, not lone institutional authority.
- **Places kept (FOOD_CANON.json, 3):** Toby's Supper Club (EAST t1 — 2025 reader vote best restaurant/fish fry/old
  fashioned + Cap Times + Isthmus + Travel WI), The Old Fashioned (CAP t1 — 2025 best curds vote + City Cast/Isthmus
  Falkenstein fish-fry pick + Infatuation), Tornado Club Steak House (CAP t2 — JB Ask-a-Chef + 2025 old-fashioned vote).
- **Held (not added):** 19 food leads + 1 sight — see `_PENDING_LEADS.md` (JB honorees lacking a sourced dish/address/
  2026 status; single-source chef picks). **Fairchild** (JB 2023 winner) held only for a sourced dish + street number.
- **Channel mix (W1):** editorial 3/3 places · institutional (JB) 1 · reader vote 3 · creators 0 (creator queries not
  reached) · local-rec 1 (City Cast).
- **Geocode:** The Old Fashioned → latlong.net POI 43.07629,-89.38356 (med; re-verify). Probe showed Google results
  return only place_id links (no !3d!4d) for restaurants; latlong.net/Wikipedia snippets do return decimals.
- **Status:** Toby's, The Old Fashioned, Tornado Club — open per 2025 reader-vote results (statusSource recorded on geocode).

## 2026-10-03 · W2a — finish W1 leads + canon lists + headline sights (fresh session budget)
- **Searches:** ~80 this batch (session-local budget). Channels: Time Out Madison (15 best restaurants; best things
  to do), Travel Wisconsin (first-timer's guide; 8 fish-fry spots), Madison Magazine (18 fish fries; Best of
  Madison 2025; JB semifinalist reports), Isthmus/Cap Times venue pages + reviews, City Cast, Atlas Obscura,
  Visit The USA, Wikipedia (coords), latlong.net POI (restaurant pins).
- **New outlets (SOURCES_W2.json, 17):** TIMEOUT, BRAVA, MADISON365, DAILYCARDINAL (corroborating), WMTV,
  JBF_EDITORIAL, PBSWI, VISITTHEUSA, ATLASOBSCURA, FLWFOUNDATION, WHS, SAHARCHIPEDIA, UNESCO, NPS, LONELYPLANET,
  VISITMIDDLETON, SHOWCAVES. **Rejected:** tablejourney.com (aggregator), wanderlog, atmosfy, northshorefamily-
  adventures (unverified blog), we3travel (affiliate travel blog — lead only), SEO "best fish fry" farms on
  hijacked domains (alzheimers.org.uk/?p=…, rmportal etc.).
- **Key hygiene fix:** Tornado Club's JB "Ask a Chef" source re-keyed `JAMESBEARD` → `JBF_EDITORIAL` (+ TIMEOUT
  added so it still clears ≥2). Ha Long Bay uses JBF_EDITORIAL likewise.
- **Food kept (FOOD_W2a/b/c, 26):** Fairchild (JB 2023 winner), Mint Mark, L'Etoile, Graze, Mickies Dairy Bar,
  Dotty Dumpling's Dowry, A Pig in a Fur Coat, Dane County Farmers' Market, Fromagination, Lao Laan-Xang
  (Atwood; Willy St branch closed 2022 — Madison365), Weary Traveler, Monty's, Ian's Pizza, La Rosita (Monona),
  Short Stack Eatery (**CLOSED** Jan 2025 — WMTV; kept flagged), Lazy Jane's, Madison Sourdough, Osteria
  Papavero (JB 2023 nominee), Lucille, Villa Tap, Ha Long Bay (reopened 2025), Ahan (JB semi 2025), Quivey's
  Grove (NRHP John Mann House), Dexter's Pub, Public Parking (JB Best New Bar semi 2026; Bon Appétit), Buck &
  Honey's (Best of Madison 2025 gold).
- **Measured & dropped / held:** Forequarter — closed Sept 2025 with a vague "new concept next spring"
  (Cap Times/Madison Mag); not added. Natt Spil, Saigon Noodles, Athens Grill, Craftsman Table, Imaginary
  Factory, CocoVaa, Pasture and Plenty — still single-source/unchecked, remain in _PENDING_LEADS.md.
- **Sights kept (SIGHTS_W2.json, 11):** State Capitol (NHL), Monona Terrace (FLW), Memorial Union Terrace,
  Olbrich & Thai Pavilion, UW Arboretum (NHL 2021), Taliesin (UNESCO 2019), House on the Rock, Devil's Lake SP,
  Cave of the Mounds (NNL), National Mustard Museum, Henry Vilas Zoo. Every area now has a tier-1.
- **Geocode (geo/_geoout_w2a/b.json, 25 verified):** 12 high (Wikipedia/NRHP infobox coords, Atlas Obscura
  place coords) · 13 med (latlong.net POI records — third-party POI DB, re-verify in placement pass). Lesson:
  latlong.net POIs only surface when the query carries name + street address + "GPS coordinates latitude";
  `allowed_domains:["latlong.net"]` returns nothing useful (4 searches wasted). Hit rate ~55%.
  Addresses I had first typed from memory for Devil's Lake / Cave of the Mounds / Vilas Zoo were replaced with
  the sourced locality before merge (rule 4a).
- **Not yet pinned (15, dropped by the build until geocoded):** Toby's, Fairchild, Mint Mark, Pig in a Fur Coat,
  Fromagination, Lao Laan-Xang, La Rosita, Short Stack, Madison Sourdough, Lucille, Villa Tap, Ahan, Dexter's,
  Public Parking, Buck & Honey's.
- **Build + gates:** 25 places on the page (11 sights + 14 food). sourcecheck PASS 40/40 · geocheck PASS
  (high 12 · med 13) · statuscheck CONSISTENT · buildcheck PASS · npm validate DATA OK · npm test ALL PASS.
- **Channel mix:** editorial (Time Out/Isthmus/Cap Times/Madison Mag/Travel WI) 37/40 · institutional (JB 6,
  NPS 2, UNESCO 1) · reader vote 5 · creators 0 (creator pass not yet run) · local-rec (City Cast) 4.

## 2026-10-03 · W2b — sights per area + Wright trail + day trips; go-live
- **Searches:** ~35 more (session total ~117). Wikipedia/NRHP infobox coordinates are the reliable pin channel
  (≈90% hit); restaurant pins via latlong.net POIs ≈50% (three attempts each for Toby's/Fairchild/Sourdough failed).
- **Sights added (SIGHTS_W2b.json, 12):** Jacobs House (UNESCO 2019, private — exterior), First Unitarian
  Meeting House (NHL), Chazen Museum of Art, Robert M. Lamp House (Atlas Obscura; exterior), Camp Randall,
  International Crane Foundation, Circus World (NHL), Pendarvis (WHS site), Blue Mound SP, Picnic Point
  (GNIS point), Aldo Leopold Shack (NHL), Overture Center.
- **Food added (FOOD_W2d.json, 1):** Wollersheim Winery (DANE; NRHP; Wikipedia + OnMilwaukee).
- **Held (pinned/sourced partly, not added):** MMoCA (coords 43.07452,-89.38891 from Wikipedia but no 2nd
  recommender yet); Wisconsin Veterans Museum (2026 status unclear — 30 W Mifflin slated for demolition/rebuild,
  WXOW/WDVA; needs a status check before adding); American Players Theatre, Swiss Historical Village, Mount Horeb
  Trollway, Pheasant Branch, Ingersoll Physics Museum, Bascom Hill — sourced, but no place-pin coordinate found.
- **Rule-4a corrections:** street addresses I first typed from memory (Devil's Lake, Cave of the Mounds, Vilas
  Zoo, Wollersheim) replaced with sourced localities before any merge.
- **UNVERIFIED queued (geo/_geoout_w2_unverified.json, 12):** Toby's, Fairchild, Pig in a Fur Coat,
  Fromagination, Lao Laan-Xang, La Rosita, Short Stack (closed), Madison Sourdough, Villa Tap, Ahan, Public
  Parking, Buck & Honey's — each with a sourced 2026 status; coordinates for tools/geocode-helper.html.
- **Build + gates:** 41 on the page (23 sights + 18 food) of 53 researched. sourcecheck PASS 53/53 · geocheck
  PASS (high 25 · med 16) · statuscheck CONSISTENT (Short Stack flagged — CLOSED) · buildcheck PASS · npm
  validate DATA OK · npm test ALL PASS.
- **Go-live:** CARD:madison-wi relinked live ("first wave", 41 mapped / 53 researched); docs/CITIES.md row updated.
