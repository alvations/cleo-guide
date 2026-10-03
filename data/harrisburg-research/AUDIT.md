# Harrisburg · York · Lancaster & Amish Country — AUDIT (append-only, one section per stage per wave)

## Stage 0 — scope & taxonomy (2026-10-02)
- Region: South-Central PA — Harrisburg/West Shore, Hershey/Derry, Carlisle/Cumberland Valley, York County,
  Lancaster city, Lancaster County Amish country, Gettysburg edge. Areas are the travel units a visitor
  actually plans by (each county seat + Hershey + the Amish heartland as its own region because it is the
  single biggest draw and would swamp Lancaster city if merged). State College/Altoona deliberately excluded
  (own map).
- Cuisine taxonomy leads with the PA Dutch canon (PA Dutch & Smorgasbords, Bakeries/Shoofly/Whoopie, Pretzels &
  Snack Factories, Chocolate/Candy/Ice Cream, Markets, Farms) then the general set.
- Collections: Iconic, Civil War & Gettysburg, Amish & Plain Country, Factory Tours & Makers, Museums, History,
  Parks, Outdoors, Railroads, Family, Oddities, Free.
- consolidate.py never synthesizes a source (an unsourced record fails GATE 1 rather than borrowing a
  "WIKIPEDIA" label as the State College template did).

## Stage 1 — sources (2026-10-02)
- Source palette registered in `SOURCES_HBG.json` → `data/sources.json` cities["harrisburg-pa"] (29 outlets, each
  with a `credible` rationale): LNP, PennLive, YDR, York Dispatch, WITF, WGAL, ABC27, FOX43, CBS21, TheBurg, Fly,
  the five CVBs (Discover Lancaster, Visit Hershey & Harrisburg, Explore York, Destination Gettysburg, Visit
  Cumberland Valley), NPS, Smithsonian, James Beard, DCNR, PHMC, Visit PA, Uncovering PA, Atlas Obscura,
  Wikipedia, USA Today 10Best, Travel + Leisure, Food Network, NYT. Creator seed from nationalCreators: Peter
  Santenello (Amish-country videos) — to vet against a findable piece in W5.

## Stage 2 — discovery wave W1 (food canon) — BLOCKED (2026-10-02)
- WebSearch budget for the session was exhausted (200/200, shared across ~16 concurrent agents) at the start of
  W1. 1 query returned results ("best shoofly pie Lancaster County") — leads only: Bird-in-Hand Bakery & Cafe,
  Dutch Haven (sources: frommers.com local-favorites page, lancasterpa.com bakeries page, aol.com article; none
  yet confirmed as a 2nd credible source). 4 further queries refused by the budget cap.
- Channel counts this wave: editorial 0 · creators 0 · travel sites 0 · local 0 — **0 places added**. Nothing
  fabricated; no records written. Per CLAUDE.md, discovery cannot proceed without WebSearch (WebFetch blocked).

## Stage 2–6 — relaunch wave W1 (food canon) + W2 (sights) + first geocode pass (2026-10-03)
- WebSearch budget available again (fresh session). ~98 searches this wave.
- **Method.** Food: discovery searches per canon item (shoofly pie, whoopie pie, pot pie, smorgasbords, pretzels,
  markets, Lebanon bologna, snack factories, creameries) then a pin attempt. Sights: one combined
  "<place> coordinates wikipedia" search per place, yielding the ≥2 sources AND the Wikipedia/official infobox pin.
- **Channel mix (places contributed, counting each place once by its strongest channel):** editorial of record
  (Inquirer, NPR, Spotlight PA, LebTown, CPBJ, WFMZ, 6abc, CBS21, Stars & Stripes, Lancaster County Magazine) 14 ·
  tourism boards / official (Discover Lancaster, Visit Hershey & Harrisburg, Destination Gettysburg, Visit Cumberland
  Valley, Visit PA, NPS, PHMC, DCNR, PA Dept of Agriculture, City of Harrisburg) 21 · travel sites (Uncovering PA,
  Atlas Obscura, Frommer's, Tasting Table, Islands, Roadside America, PA Bucket List) 16 · Wikipedia + heritage
  bodies (notability + pins) 11 · creators 0 (Peter Santenello searched — no Lancaster-specific findable piece
  naming a place; none attached) · awards 1 (Luca — 2026 James Beard finalist, Best Chef: Mid-Atlantic, via PA Eats).
- **Discovered: 25 food + 37 sights = 62**, every one ≥2 credible (Luca on lone JB authority). sourcecheck PASS 62/62.
- **MEASURED & DROPPED / HELD:**
  - Stoltzfus Farm Restaurant (Intercourse) — CLOSED per Amish365; non-notable closed → dropped.
  - Good 'N Plenty (Smoketown) — conflicting closure signal (Airbnb "permanently closed" vs current listings) → held
    until a real status source is found.
  - Held single-source: Hammond's Pretzel Bakery (Discover Lancaster only), Strasburg Creamery (LancasterPA survey),
    Katie's Kitchen (Amish America only), Hershey Pantry + Chocolate Avenue Grill (Tasting Table only), Sight & Sound
    Theatres (Wikipedia only), Boyer Nurseries (Destination Gettysburg only), Neptune Diner / Gracie's (Discover
    Lancaster only), Lancaster Brewing / Bube's / Cartel (one outlet each), Wilbur Chocolate (no credible source).
  - Lancaster County Magazine Best of 2025 names (Belvedere Inn, C'est La Vie, Cabalar, Shot & Bottle) need a 2nd source.
  - Rejected as sources: Stacker (Yelp-derived), Hoodline (Yelp-derived), unearththevoyage / fightcancer.org / spam-
    hosted "best restaurants" pages (SEO farms), Only In Your State, Airbnb/Expedia/Travelocity/wanderlog.
  - Generic "best restaurants <city>" queries for Harrisburg/York returned SEO farms only — dead end; use outlet-
    specific or dish-specific queries next wave.
- **Geocode (W6 partial):** 31 verified pins (high 26 · med 5) from Wikipedia infoboxes / official GPS; 0 low.
  Restaurant pins essentially do NOT surface through WebSearch (1 of 9 attempts) → 31 places queued UNVERIFIED in
  `geo/_geoout_w6pending.json` for `tools/geocode-helper.html` (listed in docs/GEOCODE-BACKLOG.md). Rejected pins:
  Lancaster Central Market (Wikipedia minute-precision ≈700 m off), Bird-in-Hand Hotel pin (wrong longitude),
  Carlisle Barracks pin for USAHEC (different campus), Strasburg Rail Road (unattributed search-snippet coord).
- **Status:** every record open per a current listing (statusSource recorded); 0 closed flagged.
- **Build:** cities/harrisburg.html built, 31 pins rendered; --sourcecheck PASS · --geocheck PASS · --statuscheck
  CONSISTENT · --buildcheck PASS · npm validate DATA OK · npm test ALL PASS.
- **Address note:** addresses for Shady Maple, Miller's, Bird-in-Hand Bakery, Green Dragon, Utz confirmed by search
  results; Snyder's, Lapp Valley, Fox Meadows, Root's, Hollabaugh, Luca, Millworks, Martin's, Spring House,
  Harley-Davidson are discovery-stage addresses to confirm in the helper geocode pass.

## Stage 2–7 — waves W3/W4/W5 + go-live (2026-10-03, same session)
- ~72 further searches (total ≈170 this session). Same method: sights via one combined source+pin search; food via
  outlet- or dish-specific queries (generic "best restaurants <city>" = SEO farms — abandoned).
- **Added:** W3 food (Hershey Pantry, Jigger Shop, York City Pretzel Co., Tröegs) · W4 (Stevens & Smith Center,
  Demuth, Rock Ford, Penn Square monument, Science Factory, Watch & Clock Museum, Dutch Wonderland, Bube's, Hershey/
  Harrisburg/York/Gettysburg sights, Cabalar, Lancaster Brewing) · W5 (Carlisle Fairgrounds, Hamilton Restaurant
  Hot-Chee dog, Market Cross, Kings Gap, Lititz Church Square, York Barbell, Pinnacle Overlook, Mount Pisgah,
  Ma & Pa village, Midtown Scholar, Pride of the Susquehanna, Ned Smith Center, Jennie Wade House, Aaron & Jessica's,
  Adams County Winery, Mason Dixon Distillery, Kreider Farms, Cornwall Iron Furnace, Union Canal Tunnel).
- **Totals:** 111 discovered (37 food + 74 sights), sourcecheck PASS 111/111 (1 lone JB authority — Luca).
- **Channel mix (W3–W5 adds, 49 places):** editorial of record 12 · tourism boards/official 17 · travel sites 9 ·
  Wikipedia + heritage/landmark bodies 10 · awards 1 (USA Today 10Best reader vote — Tröegs) · creators 0.
- **MEASURED & DROPPED / HELD:** Good 'N Plenty — now one source says "closed, victim of Covid" vs live delivery
  listings → still held pending a dated news/official status. Wilbur Chocolate Lititz store — plant closed 2016,
  retail status unclear → held. Turkey Hill Experience (Columbia) — a 2024 InPark piece reports a NEW attraction;
  the Columbia address is stale → held. Hotel Hershey (Wikipedia only), PA National Fire Museum (Wikipedia only),
  Wildwood Park (Greenway only), Hanover Shoe Farms (Wikipedia only), Colonel Denning SP / Hellenic Kouzina /
  Watershed Pub / Mt Airy Orchards (Visit Cumberland Valley only), Norbu / Awash Ethiopian (one outlet each), Jackson
  House (SEO-only sources), Belvedere Inn (Lancaster County Magazine only — two LCM pieces = one outlet),
  Countryside Road Stand (LancasterPA only), Abe's Buggy Rides (Discover Lancaster only), Progress Grill / Greystone
  Public House (PA Eats only). Craig LaBan 2026 Lancaster piece: not retrievable → dead end.
- **Creators (CREATORS_W5.json):** Peter Santenello and Shane Uriot held — no place-naming piece / unverified scale.
- **Geocode:** 49 verified pins (Wikipedia infobox, DCNR/official GPS, HMDB marker for Jennie Wade = med). Fulton
  Theatre pin DOWNGRADED to UNVERIFIED (the 40.038000,-76.308194 snippet was returned for both the Fulton and the
  Penn Square monument). 62 UNVERIFIED → helper backlog (docs/GEOCODE-BACKLOG.md).
- **Discovery-stage addresses to confirm in the helper pass (from memory/partial snippets):** Dutch Wonderland,
  Middletown & Hummelstown RR (Brown St), Adams County Winery (Peach Tree Rd), Mason Dixon Distillery (E Water St),
  Lancaster Brewing (N Plum St), Spring House (Hazel St), Millworks (Verbeke St), Sight & Sound (Hartman Bridge Rd),
  Middle Creek (Museum Rd), Snyder's, Lapp Valley, Fox Meadows, Root's, Hollabaugh, Luca, Martin's, Harley-Davidson.
- **Build:** 49 pins on page; --sourcecheck PASS · --geocheck PASS · --statuscheck CONSISTENT · --buildcheck PASS ·
  npm validate DATA OK · npm test ALL PASS. **index.html card relinked LIVE** (49 mapped / 111 researched);
  docs/CITIES.md row added.

## Stage 2–7 — wave W6 (2026-10-03, same session, ~13 searches)
- Added 9: Lancaster Museum of Art, Long's Park (LAN); Indian Steps Museum, Columbia–Wrightsville Bridge & Zimmerman
  Center, Hanover Junction station (YORK); Riverfront Park & Holocaust Memorial, 1700 Degrees Steakhouse (HBG — Mashed
  "best steakhouse in PA" 2025 via abc27); Choo Choo Barn (AMISH); The Hotel Hershey (HER — Hershey Archives +
  Historic Hotels of America + SAH Archipedia; Wikipedia used only for the pin).
- Held: Mount Everest Nepali & Indian (CPBJ + CBS21 opening news only — a mention is not merit), Momo Hunt (no 2nd
  source), Agricultural & Industrial Museum / Fire Museum of York County (nonprofit directory only), Harrisburg
  Magazine Simply the Best 2025 list (not retrievable).
- Totals: 120 discovered (38 food + 82 sights), 54 pinned; all gates green; card + CITIES.md counts refreshed.
- Discovery-stage addresses to confirm in the helper pass: Choo Choo Barn (226 Gap Rd), Hotel Hershey (100 Hotel Rd).

## Stage 2–7 — wave W7 FOOD & DRINK FIRST (2026-10-03, session_01MjBZJmVPTEPASWdxECDdFx, ~140 searches)
- **Goal:** protocol §2b — food & drink ≥50% of the map and of every area (was 38 food / 82 sights = 31%).
- **Discovery method:** outlet-restricted `allowed_domains` queries (generic "best restaurants" = SEO farms, abandoned again).
  Lists that yielded many places per search: Craig LaBan, Philadelphia Inquirer "15 places that prove Lancaster's food
  scene is in full bloom" (2026-05-02) · Lancaster County Magazine Best of Lancaster 2025 · TravelAwaits Gettysburg 15
  · PA Eats (York fine dining, York ice cream, Harrisburg coffee/BBQ, Hershey/Harrisburg region) · Uncovering PA
  (Hershey restaurants, Harrisburg & York breweries) · Tasting Table Chocolate Avenue 6 · The Sentinel Best of Cumberland
  County 2025/2026 + Visit Cumberland Valley Meal Madness 2026 · Visit PA getaway guides (Harrisburg, Mount Gretna) ·
  Amish America 10 + Discover Lancaster PA Dutch dishes · TheBurg (Harrisburg) · LebTown Lebanon Valley Food Critics.
- **Added 51 food & drink (FOOD_W7.json):** LAN 7 (Passerine, Chellas, Rice & Noodles, Pizzeria LUCA, Belvedere Inn,
  Himalayan Curry & Grill, Hammond's Pretzel) · YORK 7 (Viet Thai Cafe, Tutoni's, Hamir's, Wyndridge Farm, Collusion Tap
  Works, Perrydell Farm Dairy, John Wright) · HBG 10 (Pizza Boy, Ever Grain, Little Amps, Elementary Coffee, Note,
  Valley Bistro, Greystone Public House, Raising the Bar, Queen's BBQ, Isabelle's) · HER 8 (Fenicci's, Chocolate Avenue
  Grill, Alfred's Victorian, Snitz Creek Palmyra, Desserts Etc., Hershey Social, Porch & Pantry, Mount Gretna Hideaway)
  · GBG 8 (Mr. G's, Garryowen, Lincoln Diner, Hickory Bridge Farm, Gettysburg Baking Co., Hunt's Battlefield Fries,
  Battlefield Brew Works) · CAR 5 (Helena's, Fay's, Redd's, Little Mexico Tacos, Pitt Street Station) · AMISH 7 (Hershey
  Farm Restaurant, Stoll & Wolfe, Cavolo, Rise Bake Shoppe, Plain & Fancy, Dienner's, Katie's Kitchen).
  PA Dutch canon covered: whoopie pies (Hershey Farm — LNP taste-test winner), chicken pot pie (Plain & Fancy, Dienner's,
  Katie's), sourdough pretzels (Hammond's), smorgasbord/family-style; drinks: 7 breweries/distillery/cidery + 2 coffee roasters.
- **Channel mix (51 adds):** local editorial of record 24 (LNP, TheBurg, YDR, York Dispatch, Sentinel, Gettysburg Times,
  LebTown, CPBJ, WITF, FOX43, abc27) · regional/national press & awards 11 (Inquirer/LaBan, NYT via WNEP, USA Today
  Restaurants of the Year, Wine Spectator, Tasting Table, LCM Best of) · tourism boards 30 (Discover Lancaster, Visit
  Hershey, Destination Gettysburg, Visit Cumberland Valley, Visit PA, Visit Lebanon Valley) · travel/food sites 25 (PA Eats,
  Uncovering PA, TravelAwaits, Amish America) · creators 0 (no new verifiable creator piece surfaced; Santenello/Uriot still held).
- **Food share after W7:** 89 food / 82 sights = **52%**; per area AMISH 19/18 · CAR 8/7 · GBG 12/12 · HBG 13/13 · HER
  12/12 · LAN 13/9 · YORK 12/11 — every area ≥50%.
- **MEASURED & DROPPED / HELD:** Char's at Tracy Mansion — CLOSED May 2021 (abc27) → dropped (non-notable closed). Intercourse
  Pretzel Factory — closed 2015 (LNP) → dropped. Sugar Whipped Bakery (Lititz) — closed, replaced by Erica Joy Bakes (LNP) →
  dropped. Smoked Bar & Grill (Hummelstown) — restaurantguru flags "may be permanently closed", OpenTable shows hours →
  status unresolved → HELD (not added). The Left Bank (York) — closed end 2023 → not added. Zeroday Brewing — 3rd St taproom
  closed 2025-12-28 (outposts remain) → not added. Bird-in-Hand Family Restaurant — fire Dec 2023, reopening unconfirmed →
  held. Good 'N Plenty — LNP confirms owners closed it and put it up for sale (2022) → still not added (needs a 2nd source
  to add as a flagged CLOSED landmark). Single-source holds: Yi Pin, Passenger Coffee, Mekatos/Pizzeria 211 (Southern
  Market), Lapp's Food Trailer (no fixed address) — LaBan only; Lisa's Cafe on Chocolate (Tasting Table only); Appalachian
  Brewing HBG flagship (Uncovering PA only); Camp Curtin BBQ (PA Eats only, status unknown); Timbers, Funck's (one outlet);
  Leo's Ice Cream, Miseno's II (Sentinel only); Bistro Barberet (Discover Lancaster only); Raising-the-Bar-era Broad Street
  Market stands (Hummer's, Evanilla — TheBurg only). New 2026 openings (Eleve, Aunt Hocker's, Crispy Halal) — a mention is
  not merit → not added.
- **Geocode (geo/_geoout_w7.json + _geoout_w7old.json):** new channel `allowed_domains:["restaurantguru.com"]`, one place per
  query (`<Name> <street> <town> coordinates`) — ~70% hit rate; each pin's listing address checked against the record →
  **med**. Apple Maps (`maps.apple.com`) returned only bare `place-id=` URLs for this region (no `coordinate=`), so it was used
  for open-status (current hours) only. 37 new places pinned + 4 older UNVERIFIED upgraded (Luca, Miller's Smorgasbord,
  Horse Inn, The Millworks). Same-address building pins (noted, med): Passerine (predecessor Beer Wall on Prince),
  Hershey Social (predecessor Houlihan's), Plain & Fancy (on-site Smokehouse BBQ & Brews listing). Addresses corrected from
  listings: Gettysburg Baking Co. → 17 Lincoln Square; Redd's → 109 N Hanover St; Pitt Street Station → 10 N Pitt St;
  Valley Bistro → 4520 Valley Rd; Greystone → 2120 Colonial Rd (Colonial Park); Raising the Bar → 1507 N 3rd St; Hideaway →
  40 Boulevard Ave; Dienner's → 2855 Lincoln Hwy E; Pizzeria LUCA → 1200 Christopher Pl.
  **UNVERIFIED (14 new → helper):** Chellas, Rice & Noodles, Hamir's, Hunt's Battlefield Fries, Battlefield Brew Works,
  Katie's Kitchen, Hammond's, Helena's, Snitz Creek Palmyra, Little Mexico Tacos, Porch & Pantry, Queen's BBQ (+ older:
  Bird-in-Hand Bakery, Spring House, Seltzer's — restaurantguru misses).
- **Status:** every W7 record status-checked (statusSource in geoout) — 0 closed among the added; closures above dropped.
- **Build:** rebuild-city --build → 171 places, 98 pinned on page, 73 UNVERIFIED held; --sourcecheck PASS 171/171 ·
  --geocheck PASS · --statuscheck CONSISTENT · --buildcheck PASS · npm validate DATA OK · npm test ALL PASS.

## Stage 1–7 — wave W8 close every NEED + pins (2026-10-03, session_014zSqoUsvHc6U5mJKtpL7hf, ~160 searches)
- **Goal:** density.py NEED LAN +16, HBG +12, YORK +11, CAR +5, AMISH +3 (food ≥50% per area), then pin the unpinned.
- **Discovery (≈45 searches, outlet-restricted `allowed_domains`):** LNP (hidden gems, speakeasy bars, readers' cocktails,
  Passenger/Food & Wine, OpenTable romantic 2025, Wilbur, Trinity Lutheran, ice-cream lists) · Discover Lancaster (downtown
  dining, fine dining, coffee, outdoor dining, family attractions, Gallery Row, Penn Medicine Park, Amish experiences) ·
  Inquirer/LaBan "15 places" (May 2026) + Inquirer Lancaster weekend (May 2026) · Lancaster County Magazine · VisitPA ·
  TheBurg (bakeries, High Dive, Bacco, Mount Everest, Governor's Residence) · FOX43 "Matt vs. Food: Harrisburg" · Visit Hershey
  & Harrisburg (uniquely Harrisburg, cool cocktails, Farm Show, Statue of Liberty kayak trail) · Atlas Obscura · WITF · Uncovering PA
  (Harrisburg free things, Fire Museum, Farm Show, downtown York itinerary, York breweries, York County History Center,
  Fire Museum of York County, Dickinson) · Explore York (beer guide, AIM, Brown's) · DCNR · Historic Hotels of America ·
  The Sentinel (Watershed Pub, Caffe 101, Something's Brewing) · Visit Cumberland Valley (West Shore, beer trail, CCHS) · abc27.
- **Added 47 (FOOD_W8.json 33 food & drink + SIGHTS_W8.json 14 sights):**
  LAN 16 — Issei Noodle & Hi-Fi Izakaya, Southern Market, Proof, Tellus360, Annie Bailey's, Passenger Coffee, Prince Street Cafe,
  Square One, Josephine's Downtown, Thistle Finch, Lombardo's · North Museum, Hands-on House, Gallery Row, Penn Medicine Park,
  Holy Trinity Lutheran. HBG 12 — Jackson House, Alvaro Bread & Pastry, Anna Rose Bakery, High Dive, Watershed Pub (Camp Hill),
  Mount Everest Nepali (now 2 credible: TheBurg feature review + abc27 — W1 hold lifted), Bacco · Dauphin Narrows Statue of Liberty,
  Wildwood Park, PA National Fire Museum, Governor's Residence, Farm Show Complex. YORK 11 — Gift Horse, Mudhook, Liquid Hero,
  Graham Rooftop Lounge (Yorktowne Hotel, merged with the hotel to avoid a duplicate pin), Green Bean, Brown's Orchards,
  Stony Run · York County History Center Museum (2024 steam-plant campus), Gifford Pinchot SP, Fire Museum of York County,
  Agricultural & Industrial Museum. CAR 5 — Caffe 101, Desperate Times, Molly Pitcher Brewing · Cumberland County Historical
  Society, Dickinson College & Trout Gallery. AMISH 3 — Strasburg Creamery, Countryside Road-Stand, Wilbur Chocolate Store.
- **Channel mix (47):** local editorial of record 27 (LNP, TheBurg, FOX43, abc27, WITF, Sentinel) · regional/national press 6
  (Inquirer ×3, Historic Hotels of America, LCM ×2) · tourism boards 33 (Discover Lancaster, Visit Hershey, Explore York, VCV,
  VisitPA, DCNR) · travel sites 21 (Uncovering PA, Atlas Obscura, Amish America) · creators 0 (none surfaced; still held).
- **MEASURED & DROPPED / HELD:** Appalachian Brewing HBG flagship — first-floor restaurant CLOSED (abc27) → not added ·
  Accomac Inn — closed 2018 (WITF) → not added · Wolfgang Candy — retail store closed 2016, B2B now → not added · Boiling Springs
  Tavern — closed for multi-year renovation (Sentinel) → not added · Café Bruges — status unresolved → not added · Yi Pin — LaBan
  + LNP-about-LaBan only (1 outlet) → held · Citronnelle, 401 Prime (Vescor padding), Cafe Fresco, Home 231, Mangia Qui, Federal
  Taphouse (TripAdvisor-only measurement) → held · Leo's, Inside Scoop, King Tut, Jewels of India (Sentinel only) → held · Broad
  Street Market stands (TheBurg only, share the market pin) → held · J&J Mofongo / El Rincón Ponceño (opening news only) → held ·
  Central Family Restaurant (Explore York listing only) → held · Wacker Brewing (taproom moved to Willow Street) → not added.
- **Food share after W8:** 120 food / 98 sights = **55%**; per area AMISH 22/18 · CAR 11/9 · GBG 12/12 · HBG 20/18 · HER 12/12 ·
  LAN 24/14 · YORK 19/15 — every area ≥50%. density.py: **every area OK** (218 vs ~216 target).
- **Geocode (geo/_geoout_w8.json, ≈110 searches):** sights via Wikipedia/NPS coordinates, 2 names per query (3-name batches
  conflated coordinates once — Penn Square monument got Fulton's coords → rejected); restaurants via Waze live-map place records /
  usarestaurants.info listings (`"<Name> <street> <town> latitude longitude"`, allowed_domains waze/usarestaurants/foursquare;
  Apple Maps still gives bare place-id= URLs here). **58 new pins** (W8 + older UNVERIFIED): 41 high (Waze place with matching
  name+address, Wikipedia/NPS) · 17 med (listing pins, park/campus coordinates, same-address building pins: Chellas = Cabalar's
  former 325 N Queen building; Science Factory = 454 New Holland Ave building). Rejected: Lancaster Central Market wiki coord
  (minute-precision centroid → used Waze place instead), Countryside Road-Stand waze hit (out of region), Sight & Sound
  snippet coord without a source (later pinned from Waze). **Address corrections:** Josephine's → 50 W Grant St; Liquid Hero →
  50 E North St; Watershed Pub → 2129 Market St; Caffe 101 → 101 Front St; Anna Rose → 100 N 2nd St; Cabalar Meat Co. → moved to
  501 W Lemon St (LNP 2024; Chellas took 325 N Queen); Snyder's of Hanover → 1350 York St. Issei: only the pre-2024 44 N Queen
  listing pin surfaced; LaBan says it moved to Orange St → kept UNVERIFIED rather than pin the old site.
- **UNVERIFIED (62 → helper):** new — Issei, Proof, Square One, Anna Rose, Mount Everest, High Dive, Gift Horse, Mudhook, Green Bean,
  Graham Rooftop, Strasburg Creamery, Countryside Road-Stand, Cabalar (new site), Snyder's + W8 sights Hands-on House, Gallery Row,
  YCHC museum, Fire Museum of York County, AIM, CCHS, PA National Fire Museum; plus the older backlog (docs/GEOCODE-BACKLOG.md).
- **Status:** every W8 record status-checked (statusSource in geoout); Little Round Top confirmed reopened 2024-06-24 (WNEP);
  Governor's Residence stays on tour after the April 2025 arson (TheBurg); 0 closed among the added.
- **Build:** rebuild-city --build → 218 places, **156 on page** (was 98); --sourcecheck PASS · --geocheck PASS · --statuscheck
  CONSISTENT · --buildcheck PASS · npm validate DATA OK · npm test ALL PASS. Rendered per area: AMISH 30 · CAR 13 · GBG 17 ·
  HBG 29 · HER 20 · LAN 26 · YORK 21.

## 2026-10-03 P1 — PINS ONLY (session_014tccsddAZhWkWHE1pGLan6, ~58 searches, no discovery)
- **Channels:** restaurantguru listing pages via `allowed_domains:["restaurantguru.com"]` with the query shape
  `<Name> <town> GPS coordinates latitude longitude` (one place per query; the page's 8-decimal listing coordinate is
  quoted back — ~55% hit rate on food) · Wikipedia infobox coords (`<article> coordinates`, `allowed_domains:["en.wikipedia.org"]`).
  Apple Maps returned bare `place-id=` URLs only; Waze/usarestaurants/foursquare returned no coordinates for these leftovers.
- **+15 pins (156 → 171 on page; 62 → 47 UNVERIFIED)** in `geo/_geoout_pins1003.json`: high — Bube's Brewery (Central Hotel
  wiki), Farnsworth House Inn (wiki); med — Culp's Hill tower (summit coord, tower stands on summit), Wolf Sanctuary of PA
  (Speedwell Forge wiki, same 465 Speedwell Forge Rd property), Hamilton Restaurant, Hamir's, Hunt's, Battlefield Brew Works,
  Mudhook, 1700 Degrees, Katie's Kitchen (address → 200 Hartman Bridge Rd, Ronks), Cabalar (501 W Lemon), Proof, Issei
  (**new 38 W Orange St site** — resolves the W8 hold), Countryside Road-Stand (2966 Stumptown Rd) — every listing coordinate
  checked against the record's street address.
- **Closure found:** Hunt's Battlefield Fries & Cafe → **CLOSED** (abc27: owner retired, closed end of the Nov 2024 season;
  restaurantguru marks it permanently closed). geo-merge renamed it "— CLOSED"; --statuscheck surfaces it.
- **Rejected:** Soldiers & Sailors Monument wiki snippet (returned 40.038,-76.308194 = the Fulton Theatre's coordinate, not
  Penn Square → not trusted); Strasburg Creamery (only a 226 Gap Rd creamery surfaced ≠ 1 W Main St); Fox Meadows (2475 W Main
  St listing ≠ record's 193 Crooked Ln farm); Snitz Creek (only the Lebanon branch); PA National Fire Museum wiki coord found
  (40.2764,-76.8923, 1820 N 4th St) but the place has no registry entry/status check yet → held; township/borough centroids
  offered for Ned Smith Center, Long's Park, Pine Grove Furnace, Snyder's, AIM → refused (never centroids).
- **Still UNVERIFIED (47):** see docs/GEOCODE-BACKLOG.md (harrisburg-pa) — misses this pass: Amish Farm & House, Seltzer's,
  Market Cross, Queen's BBQ, Rice & Noodles (no Lititz Pike listing), Anna Rose, Square One, Mount Everest, Gift Horse, High Dive,
  Graham Rooftop, Green Bean, York City Pretzel, Little Mexico, Porch & Pantry, Helena's, Stony Run, Hollabaugh, Adams County
  Winery, Snyder's, Kreider (listing shows 286 Doe Run Rd — address check needed), Pine Grove store + museums.
- **Build:** rebuild-city --build → 218 places, **171 on page**; --sourcecheck PASS · --geocheck PASS (high 86 · med 85 · low 0)
  · --statuscheck CONSISTENT (1 closed) · --buildcheck PASS · npm validate DATA OK · npm test ALL PASS. Rendered per area:
  AMISH 34/40 · CAR 14/20 · GBG 21/24 · HBG 30/38 · HER 20/24 · LAN 29/38 · YORK 23/34.
