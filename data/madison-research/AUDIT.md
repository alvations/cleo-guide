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
