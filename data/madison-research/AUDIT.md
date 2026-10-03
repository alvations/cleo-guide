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

## 2026-10-03 · W2c — brats/German canon + NRHP/state-park sights for thin areas
- **Searches:** ~20 more (session total ~137).
- **Food (FOOD_W2e.json, 3):** State Street Brats (UW t1 — red brat; ESPN + On Wisconsin + Daily Cardinal),
  Essen Haus (CAP t2 — German beer hall), Sugar River Pizza (MVF t2 — Best of Madison 2025 pizza). All three
  UNVERIFIED (no place pin surfaced in 4 coordinate searches).
- **Sights (SIGHTS_W2c.json, 8):** Science Hall (NHL), Washburn Observatory, Garver Feed Mill (NRHP 2017),
  Governor Nelson SP (panther effigy mound), Forest Hill Cemetery (effigy mounds; med pin), Natural Bridge SP,
  Lake Kegonsa SP, Allen Centennial Garden.
- **Held — sourced but no usable pin:** Stoughton Opera House (only a town centroid surfaced — rejected),
  Mid-Continent Railway Museum (Wikipedia gives 43.46,-89.87 — 2-decimal, too coarse), Gates of Heaven
  Synagogue, Pope Farm / Pheasant Branch conservancies, Babcock Hall Dairy Store (TRAVELWI + Daily Cardinal
  sourced; 2 pin searches failed), New Glarus Brewing (only an OpenBeerDB point that may be the old Riverside
  brewery — not used).
- **Creator channel:** searched Dave Portnoy One Bite × Madison — no Madison reviews (Racine/Milwaukee only).
  Creator channel still 0 for Madison; next wave should search YouTube/TikTok Madison food creators explicitly.
- **Build + gates:** 49 on the page (31 sights + 18 food) of 64 researched; 15 UNVERIFIED (all restaurants).
  sourcecheck PASS 64/64 · geocheck PASS (high 32 · med 17 · low 0) · statuscheck CONSISTENT · buildcheck PASS ·
  npm validate DATA OK · npm test ALL PASS. Card + CITIES.md counts refreshed.

## 2026-10-03 · W3a — creators + thin-area food + CAP/EAST sights
- **Searches:** ~13 (session total ~150).
- **Creator pass (CREATORS_W3.json):** State Trunk Tour (Kevin Mack — long-running Wisconsin travel show/site;
  dated 2026 pasty-shop guide) ACCEPTED and attached to Red Rooster Cafe. Wisconsin Cheese Please (Sam Buschman,
  press-profiled by Milwaukee Record/The Takeout) PENDING — follower scale unverified, no Madison rating found.
  Rejected: Curd Queen (scale unverifiable), Portnoy (no Madison reviews). AFAR's 2024 Madison food feature found
  but its snippet names no places (registered as an outlet, unused).
- **Food (FOOD_W3a.json, 5):** Der Rathskeller (UW t1 — first public-university beer, 1933; pinned at the Memorial
  Union building, med), Fosdal Home Bakery (DANE — Norwegian rosettes/krumkake), Hubbard Avenue Diner (MVF —
  Munch Madness pie winner), Glarner Stube (TRIP t1 — Swiss), Red Rooster Cafe (TRIP — Cornish pasties).
  Held: Gates & Brovi (only Travel Wisconsin found ×2 — one outlet), Hmong Kitchen / Hmong Legacy Market (only
  608today + aggregator), New Glarus Hotel restaurant (one source).
- **Sights (SIGHTS_W3a.json, 3):** Wisconsin Governor's Mansion, Madison Children's Museum, Orpheum Theater.
  Held: Tenney Park–Yahara Parkway (NRHP; no coordinate surfaced).
- **Build + gates:** 53 on the page (34 sights + 19 food) of 72 researched; 19 UNVERIFIED (all restaurants).
  sourcecheck PASS 72/72 · geocheck PASS (high 35 · med 18 · low 0) · statuscheck CONSISTENT · buildcheck PASS.

## 2026-10-03 · W4 (fresh session) — batch 1: pins attempt + food-first (supper clubs, fish fry, curds, bars)
- **Pins first (held 19):** 10 coordinate searches (Toby's, Fromagination, Essen Haus, Lao Laan-Xang, latlong.net
  domain-restricted batch, mapcarta, Fess Hotel/Wikipedia ×3) → **0 pins**. The summariser no longer surfaces
  latlong.net POIs or Wikipedia infobox coordinates for these; stopped spending the pin budget and kept all 19 +
  every new restaurant UNVERIFIED for `tools/geocode-helper.html` (never estimated).
- **Status re-check:** Essen Haus still OPEN (Oktoberfest 2026; Lotus redevelopment only proposed — city meeting
  2026-08-12, construction would start 2027). Smoky's Club closed 2022 (Channel 3000) — not added.
- **Sources discovered:** Imbibe (Brian Bartels' Madison where-to-drink), Cook's Country, Heavy Table, Milwaukee
  Record (→ SOURCES_W4.json); City Cast list pages (supper clubs, fish fry, dive bars, oldest restaurants,
  'national critics love'); Madison Magazine Best of Madison 2025 category winners; UpNorthNews 2025 reader polls.
- **Food added (FOOD_W4a.json, 15):** Dorf Haus (DANE, t1 fish fry gold), Craftsman Table & Tap (MVF curds),
  Chocolate Shoppe (CAP), Tipsy Cow (CAP), North and South Seafood (WEST), Ishnala (TRIP t1), Kavanaugh's Esquire
  Club — CLOSED (Jan 2026, WMTV/WKOW), Sardine (EAST t1), The Harvey House (CAP t1), Plaza Tavern, Caribou Tavern,
  Le Tigre Lounge (WEST), Turn Key Supper Club (EAST), Village Bar (WEST), Great Dane (CAP).
- **Held single-source:** Rex's Innkeeper, Slices, Woody & Anne's, Laurel Tavern, Paul's, Players (City Cast only);
  Ohio Tavern, Irish Pub (Madison Magazine only); Robin Room (Imbibe only); Lombardino's, Lola's Hi/Lo (City Cast
  only); Gates & Brovi (Travel Wisconsin only); It's Good For You, Little Palace (Infatuation only).
- **Channel mix (batch):** editorial 15/15 · reader vote (MadMag/UpNorth) 9 · local-rec (City Cast) 9 · creators 0.
- **Build + gates:** 87 researched; sourcecheck PASS 87 · geocheck PASS · statuscheck CONSISTENT (Esquire flagged)
  · buildcheck PASS · validate DATA OK · test ALL PASS. 34 UNVERIFIED (all restaurants).

### W4 batch 2 — JB semis, MVF food, held sights re-sourced + Wikipedia pins
- **Pin channel found:** single-name queries with `allowed_domains` = en.wikipedia.org + wikidata.org return the
  infobox coordinate (APT, Fess Hotel, Veterans Museum, Stoughton Opera House, Chalet of the Golden Fleece: 5/6;
  Pheasant Branch has no article → UNVERIFIED; Ishnala → only the state-park centroid, rejected).
- **Food (FOOD_W4b.json, 6):** Babcock Hall Dairy Store (UW t1), CocoVaa (EAST; JB semi 2024), Imaginary Factory
  (EAST; JB semi 2026), Pasture and Plenty (WEST; JB semi 2024), Capital Brewery (MVF t1; State Trunk Tour 2026),
  Clasen's European Bakery (MVF).
- **Sights (SIGHTS_W4a.json, 7):** American Players Theatre (TRIP t1, high), Trollway (DANE t1), Pheasant Branch
  Conservancy (MVF t1), Wisconsin Veterans Museum (CAP; OPEN — replacement planned, no closure date), MMoCA (CAP, 2nd
  source = Destination Madison free list), Stoughton Opera House (DANE, med — two points returned), Chalet of the
  Golden Fleece (TRIP, high).
- **Held:** Wisconsin Brewing Co. (Experience WI only), Imperial Garden (Travel WI only), Matz Farmstead Ruins,
  Sid Boyum sculptures, Forest Products Lab (Atlas Obscura only), Norwegian Heritage Center/Livsreise and UW Geology
  Museum (Destination Madison only) — next wave.
- **Build + gates:** 100 researched (59 food = 59% / 41 sights), 59 pinned; 4 gates PASS; validate + test green.
  Card + CITIES.md refreshed via `_mad_card.py`.

### W4 batch 3 — Best of Madison 2026 × second outlets; effigy-mound sights
- **Key source:** Madison Magazine **Best of Madison 2026** full winners list (49 food & drink categories) —
  counted as ONE outlet (MADMAG) per place; every addition pairs it with a second outlet (City Cast, UpNorthNews,
  Time Out, Cap Times, Travel WI, WMTV/WHS).
- **Food (FOOD_W4c.json, 12):** Lombardino's (WEST t1, est. 1952), Working Draft (EAST), Rex's Innkeeper & Maple
  Tree Supper Club (DANE), Player's Sports Bar (EAST), New Glarus Brewing (TRIP t1; Wikipedia pin high), Greenbush
  Bakery (WEST), Stella's Bakery (CAP t1, farmers'-market spicy cheese bread), Marigold Kitchen (CAP), Tip Top
  Tavern (EAST), Driftless Glen Distillery (TRIP t1), The Del-Bar (TRIP t1; James Dresser/Wright-school building).
- **Sights (SIGHTS_W4b.json, 6):** Burrows Park, Elmside Park, Vilas Circle Bear and Observatory Hill effigy mounds
  (OnMilwaukee mounds feature + Wikipedia/NRHP; all pinned high), Edgewood College Mound Group (no coordinate in
  the article summary → UNVERIFIED), UW Geology Museum (Destination Madison free list + Wikipedia; high).
- **Rule 4a:** addresses kept to what sources state (street names/localities); a remembered APT road name was
  removed before merge.
- **Held (one outlet so far):** Cento, Osteria Novella, Bar Corallini, Tempest, Eno Vino, Toot & Kate's, Banzo,
  La Taguara, Gail Ambrosius, Candinas, Hook's Cheese, Green Owl, Sa Bai Thong, Swagat, Stone Porch, Karben4,
  Vintage, Delta Beer Lab (area unclear — south side), Mickey's Tavern, Heritage Tavern.
- **Build + gates:** 118 researched (71 food = 60% / 47 sights), 65 pinned; 4 gates PASS; validate + test green.

### W4 batch 4 — day-trip canon (Monroe Limburger, Mount Horeb, pasties) + paired Best-of-Madison checks
- **Food (FOOD_W4d.json, 12):** Baumgartner's Cheese Store & Tavern (TRIP t1; Saveur 100 Limburger), Suzy's Pointer
  Cafe (TRIP; State Trunk Tour pasty guide 2026), Grumpy Troll Brew Pub & Sjölinds Chocolate House (DANE; Milwaukee
  Magazine day trip), Paul's Pel'meni (UW t1; Infatuation), Candinas Chocolatier (MVF t1), Cento & Tempest (CAP),
  Vintage Brewing (WEST), Green Owl Cafe & Gail Ambrosius (EAST), Salvatore's Tomato Pies (DANE t1; Cap Times review).
- **Held:** Teddywedgers (State Trunk Tour only), Skål Public House, Enrique's Market & It's Good For You (Infatuation
  only), Brasserie V (Badger Herald only), Everly (area/address unsourced).
- **Channel mix (W4 so far):** editorial 56 · reader vote (Madison Magazine Best of Madison 2025/26, UpNorthNews) 30 ·
  local-rec (City Cast) 14 · creator (State Trunk Tour) 2 · institutional (JB semis) 3.

### W4 batch 5 + close (WebSearch session limit reached)
- **Food (FOOD_W4e.json, 4):** Firefly Coffeehouse (DANE, Oregon), Drumlin Ridge Winery (DANE, Waunakee), Hook's Cheese
  Company (TRIP t1, Mineral Point), Bailey's Run Vineyard (TRIP, New Glarus).
- **Held:** Arthur's Supper Club (Travel WI ×2 = one outlet + APT's own area guide), Commerce Street Brewery & Hotel
  (Brewery Creek renamed — Isthmus coverage predates the change; re-check).
- **Session totals:** ~125 WebSearch calls; W4 +62 places (72 → 134; 87 food = 65%); pins +12 (all via Wikipedia/
  Wikidata-restricted queries); UNVERIFIED now ~69 (restaurants + Pheasant Branch, Edgewood mounds, Trollway).

## 2026-10-03 · W5 (same session, after the usage-limit reset) — batch 1
- **Searches:** ~25 (WebSearch available again after the session limit reset).
- **Sights (SIGHTS_W5a.json, 8, all Wikipedia-pinned):** Bascom Hill & Lincoln statue (UW t1), Ingersoll Physics Museum
  (UW; Atlas Obscura), Lakeshore Nature Preserve (UW, med — area point), Wyoming Valley School & A. D. German Warehouse
  (TRIP; FLW Trail per Chicago Sun-Times; German Warehouse med — round-minute latitude), Seth Peterson Cottage (TRIP;
  FLW Foundation + DNR), Al. Ringling Theatre (TRIP t1), Tower Hill State Park (TRIP).
- **Food (FOOD_W5a.json, 4):** Stone Porch Alehouse (MVF; Cap Times), Imperial Garden (MVF; Best of Madison since 1984),
  The Nitty Gritty (UW t1; birthday bar since 1985), La Taguara (EAST; Venezuelan).
- **MEASURED & DROPPED:** 1847 at the Stamm House (MVF) — two Cap Times reviews call it "beautiful but uneven" /
  "still hit or miss": below the merit bar despite the 1847 building. Eno Vino — Cap Times reports it closing (not added).
- **Held:** Brasserie V (Cap Times/Isthmus/Hop Culture, but no 2026 open-status evidence found), Sa-Bai Thong (Destination
  Madison listing + reader vote only), Hoyt Park & Lake Wingra (Wikipedia pins found, need a 2nd recommender),
  Military Ridge State Trail (only trail endpoints in the article), Dhaba / Monk's (Visit Middleton just relays the vote).
- **Channel note:** OpenTable-dominated results for Verona/Fitchburg — no credible list coverage of Fitchburg found; MVF
  remains the thinnest area by source exhaustion, not by effort.

### W5 batch 2
- **Searches:** ~17 more (W5 total ~45).
- **Food (FOOD_W5b.json, 5):** The Robin Room (CAP t1; Imbibe + City Cast), Heritage Tavern (CAP), Natt Spil (CAP;
  Madison Magazine 'thirty bars' + City Cast), Madison Public Market (EAST t1; opened July 2026 — WMTV/WKOW/Madison365/
  Cap Times), Sern Sapp (EAST; Lao, Isthmus review).
- **Sights (SIGHTS_W5b.json, 2):** Lake Wingra & Vilas Park beach (WEST; Wikipedia lake point, med), Ice Age Complex at
  Cross Plains (DANE; NPS lone authority + Wikipedia; UNVERIFIED pin).
- **Held:** Coopers Tavern, Alchemy Café, Eldorado Grill, The Malt House (Madison Magazine only); Oasis Cafe (Fitchburg),
  King of Falafel, Bierock (City Cast only); Owen Conservation Park, Elver Park, Livsreise (Destination Madison only);
  Indian Lake County Park (no source surfaced); new 2025–26 openings (One Social Food Hall, Begonia, Taj) — too new to
  measure. Eno Vino reported closing (Cap Times) — not added.

## 2026-10-03 · W6 (fresh session) — pin pass first
- **Channel:** Apple Maps (`allowed_domains: maps.apple.com`) mostly returned bare `place-id=` URLs for single-place queries
  (Toby's), but a *street-level* query ("A Pig in a Fur Coat Madison Williamson") returned Apple URLs carrying `coordinate=`
  for several places at once (Pig in a Fur Coat, Sardine). The workhorse was the Akron-W4 fallback: one place per query,
  `"<Name> <street address> latitude longitude"` + `allowed_domains: [waze.com, usarestaurants.info, foursquare.com]`.
- **Searches:** ~68 → **48 new pins** (geo/_geoout_w6.json): 37 `high` (Waze place record or Apple pin with matching
  name + address), 11 `med` (usarestaurants.info listing coordinate; Ahan = same-address listing of predecessor tenant
  Eldorado Grill at 744 Williamson). Page: **74 → 122 pinned** of 153.
- **Addresses upgraded** (vague → street address, from Waze/Foursquare records): Rex's Innkeeper, Maple Tree, Capital
  Brewery, Clasen's, Lombardino's, Player's, Greenbush Bakery, Marigold Kitchen, Driftless Glen, Del-Bar, Baumgartner's,
  Paul's Pel'meni (414 W Gilman), Firefly, Drumlin Ridge, Bailey's Run, Heritage Tavern, Tipsy Cow, Ishnala, Dorf Haus;
  address only (still UNVERIFIED): Stone Porch (950 Kimball Ln), Imperial Garden (2039 Allen Blvd), Natt Spil (211 King St),
  Tip Top Tavern (601 North St), Harvey House (644 W Washington Ave), Chocolate Shoppe (468 State St).
- **No pin surfaced (31 left):** State St Brats, Villa Tap, Public Parking, Le Tigre, Caribou, North & South, Tempest,
  Robin Room, Sern Sapp, Salvatore's (Sun Prairie), Sjölinds, Fosdal, Glarner Stube, Red Rooster, CocoVaa, Hook's,
  Candinas, Turn Key, Stella's, Kavanaugh's (closed), Trollway, Edgewood mounds, Pheasant Branch, Ice Age Complex,
  Madison Public Market, + the address-only six. Wikipedia queries for the three sight areas returned only parent-article
  points (college / city) — not used.

### W6 batch a — discovery (MVF / WEST / UW)
- **Searches:** ~32 (session ~100).
- **Food (FOOD_W6a.json, 12):** MVF — Taigu (t1; Isthmus + Madison Magazine ×2 + Cap Times + PBS Wisconsin Life),
  Dhaba Indian Bistro (Isthmus + Cap Times biryani showdown + Best of Madison 2025), Rolling Pin Bake Shop (Fitchburg;
  Isthmus + Cap Times strip-mall list), Curry in the Box (Fitchburg; t3, Isthmus + Cap Times). WEST — Saigon Noodles
  (Cap Times + MadMag + Isthmus), Petra Bakery & Restaurant (Isthmus + MadMag + Cap Times), El Panzon (Isthmus + Cap
  Times), Osteria Novella (opened Nov 2025; Cap Times + MadMag + City Cast best new). UW — Teddywedgers (pasty, since
  1976; MadMag + State Trunk Tour pasty guide + Badger Herald), The Kollege Klub (since 1953; Wisconsin Alumni Assn +
  OnMilwaukee), Library Mall food carts (t1 campus institution; Isthmus + WAA; 2025-26 ranking leaders Surco/Braisin' Hussies).
- **Sights (SIGHTS_W6a.json, 3):** Pope Farm Conservancy (MVF; Cap Times + TMJ4), Frank W. Hoyt Park (WEST; Wikipedia +
  WHS NRHP + SAH Archipedia), The Red Gym (UW; NHL — NPS + Wikipedia).
- **Pins (geo/_geoout_w6b.json):** 10 of 15 — Pope Farm (Waze, high), Hoyt Park + Red Gym (Wikipedia, high), Taigu,
  Curry in the Box, Petra, Teddywedgers (usarestaurants, med), Dhaba / Rolling Pin / Osteria Novella (same-address
  building Waze records, med). UNVERIFIED: Saigon Noodles, El Panzon, Kollege Klub, Library Mall food carts.
- **MEASURED & HELD:** Toro y Pampa (Middleton, Cap Times + IB Madison only — too new to measure), Pikkito (moved/
  second site unclear), Orchard (Verona; Isthmus review mixed — "prices feel high", seasoning off), Me & Julio (Isthmus
  "Fitchburg fail"), Namio's (Isthmus: "isn't a game-changer"), Everly (Travel Wisconsin only), Brasserie V (still no
  2026 open evidence beyond listings), Tex Tubb's (Best of Madison 2026 tacos gold; EAST, needs a 2nd editorial),
  Muir Knoll & Carillon Tower (no pin path / single source), Jordan's Big Ten Pub (OnMilwaukee only).

### W6 batch b
- **Searches:** ~30 (session ~130). Creator query run ("Madison food TikTok creator…") — surfaced only UpNorthNews
  reader-poll guides (already registered), no new verifiable creator; logged, no creator added this wave.
- **Food (FOOD_W6b.json, 6):** J. Henry & Sons (DANE; Cap Times + Destination Madison), Banzo (EAST; Best of Madison
  2026 gold + Isthmus Mad Faves), RED (CAP; Best of Madison 2026 East Asian gold + Mad Faves Japanese), Oakcrest Tavern
  (WEST; Isthmus burger survey + Doug Moe/MadMag + UpNorthNews 2025), Driftless Café (TRIP t1; 2017 JB semifinalist —
  WPR + OnMilwaukee + Travel Wisconsin; ~2 h, Viroqua), Bar Corallini (EAST; Isthmus + Cap Times).
- **Sights (SIGHTS_W6b.json, 4):** Livsreise Norwegian Heritage Center (DANE; FOX11 + Travel Wisconsin; FOX11 registered
  in SOURCES_W6.json), Indian Lake County Park & St. Mary of the Oaks Chapel (DANE; Dane County Parks + Destination
  Madison + WHS), Capital Springs SRA (MVF; DNR + Wikipedia, med area point), Military Ridge State Trail (MVF; DNR +
  Wikipedia, med endpoint point).
- **Pins:** Banzo (Waze high), Oakcrest (usarestaurants med), Capital Springs + Military Ridge (Wikipedia med).
  UNVERIFIED: J. Henry, Livsreise, Indian Lake, RED, Driftless Café, Bar Corallini.
- **Held / dropped:** Swad (Mad Faves Indian, but listings conflict — Monona address vs a west-side coordinate; not
  pinned or added), Skål Public House (student paper + 2015 'Burbs vote only), Paoli Schoolhouse (OpenTable only),
  Spring Green General Store (WSJ: owner selling after 33 years — status unclear), Driftless Depot (Isthmus only),
  Eloura / Rokuaji / The Perch (2026 openings, too new), Schumacher Farm Park (Travel Wisconsin + own site only).

### W6 batch c
- **Searches:** ~25 (session ~160).
- **Food (FOOD_W6c.json, 4):** Wisconsin Brewing Company (MVF; Isthmus + Experience Wisconsin; Waze pin high),
  Taqueria Guadalajara (WEST; Isthmus + Cap Times + Daily Cardinal + Mad Faves; Waze pin high), Puempel's Olde Tavern
  (TRIP; OnMilwaukee + Travel Wisconsin; UNVERIFIED pin), Viking Brew Pub (DANE t3; Isthmus + Travel Wisconsin; UNVERIFIED).
- **Sights (SIGHTS_W6c.json, 1):** North Hall (UW; NHL — NPS + Wikipedia; Wikipedia pin high).
- **Pin upgrade:** The Robin Room — Apple Maps `coordinate=` (high).
- **Status checks:** Tempest Oyster Bar — absent from an Apple street query, so checked: still taking reservations
  (OpenTable/Tock, 2026) → stays open. Fresco (MMoCA rooftop) — Cap Times: rooftop now hosts Tall Grass / dome pop-ups →
  not added (closed). Liliana's (Fitchburg) — closed 2022 (WKOW) → not added.
- **Held:** Mediterranean Cafe (Isthmus + Badger Herald, but no 2026 status evidence), Popolo (Mineral Point; Isthmus
  only), My Sister's Kitchen (it is in Mazomanie, Isthmus only), Tapas Rias / Fuji (Isthmus only), Tumbled Rock Brewery,
  Little Village Cafe, Jen's Alpine Cafe (Baraboo; climbing-guide blog only), Wisconsin Field House (NRHP only).
