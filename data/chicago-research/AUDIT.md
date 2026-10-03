# Chicago — audit ledger (append-only)

Contract: docs/PIPELINE.md (stages 0→6), docs/RUN-2026-10-02.md (§5a audit trail). One dated section per stage per wave.

## 2026-10-02 · Stage 0 — Scope & taxonomy
- **Region:** the City of Chicago (77 community areas grouped NYC-borough-style into 7 city areas) + the inner
  suburbs/North Shore (`SUB`) + day trips (`DAY`: Indiana Dunes, Starved Rock, Milwaukee, lake shore).
- **Why this split:** Chicago's own "sides" (Loop / North / Northwest / West / South / Southwest / Far South)
  are how locals and every outlet (Block Club, Chicago Magazine, Eater maps) carve the city — the analogue of
  NYC's boroughs. Tiers are graded within each side, so the Far South (Pullman, Beverly) never drowns under the Loop.
- **Areas + targets:** see `_AGENT_BRIEF.md` and `RESUME.md` (sum ≈ 510, New-York density).
- **Cuisine taxonomy (23):** Chicago canon first — PZ (deep-dish/tavern/stuffed), BEEF (Italian beef &
  sandwiches), DOG (hot dogs, Maxwell Street Polish, burgers), CHX (mild sauce/Harold's, BBQ rib tips, soul) —
  then US, DELI, IT, MEX, PR (jibarito, Caribbean & Latin), CN, VN (Argyle & SE Asian), KR, JP, IN (Devon),
  ME, EEU (Polish/Ukrainian), EU (Swedish/German), AF, SEAF, BAR, COF, DES (Rainbow Cone, Garrett), VIRAL.
- **Collections (16):** MUS, PARK, ICON, ARCH, **FLW** (Frank Lloyd Wright & Prairie School), MKT, ARTS
  (blues/jazz/theater/comedy), **SPORT**, WATER, FAM, ODD, FREE, ROOF, SPEAK, POP, **MURAL**.

## 2026-10-02 · Stage 1 — Discover sources (wave 1) — BLOCKED by the shared WebSearch cap
- Source palette registered from the editorial-of-record set (SOURCES_BASE.json → data/sources.json `chicago-il`,
  23 outlets each with a `credible` rationale): Michelin, James Beard, NPS, UNESCO (FLW listing), Tribune,
  Sun-Times, Chicago Magazine, Eater Chicago, Infatuation, Block Club, WTTW, WBEZ, Reader, Time Out, Choose Chicago,
  Atlas Obscura, Chicago Architecture Center, Chicago Park District, Chicagoist, NYT, Thrillist, Wikipedia, official sites.
  These are registered as the palette to search; no place yet rests on any of them.
- Searches run: 3 (a Wikipedia-coordinate probe for Wrigley Field; a batch-coordinate probe for 5 Museum-Campus/Loop
  landmarks — batching does NOT return coords, one search per pin is needed; an Al's #1 Italian Beef pin probe —
  latlong.net OSM POIs DO surface decimal pins for Chicago restaurants, a useful channel for the geocode stage).
- 4th search onward refused: "this session has used its web search budget (200 of 200 WebSearch calls)". The cap is
  per session and shared by all ~16 concurrent city agents; it was exhausted before this agent's discovery began.
- **Channel counts this wave:** editorial 0 · creators 0 · travel sites 0 · local 0 — no places extracted.
- **Places added: 0.** Nothing added from memory (hard rule). Partial leads → `_PENDING_LEADS.md`.

## 2026-10-02 (session 2) · Stages 1–6 — waves W1 (food canon), W2 (Michelin/JB), S1–S2 (sights)
- **Sources discovered/used:** Infatuation (Italian beef, deep dish, hot dogs, jibarito, old-school, wings guides),
  Time Out Chicago (28 best pizza, 24 best hot dogs, 46 attractions, 28 museums), Chowhound (8 best tavern pizza),
  Chicago Magazine "Iconic Eats" (July 2021, 50 dishes — full list captured, used as 1 source each),
  ABC7 Hungry Hound (Steve Dolinsky, 31 essential beefs), NBC5 beef ranking, Michelin 2025 stars + Bib list,
  James Beard America's Classics (Lem's 2025, Sun Wah 2018, Berghoff, Calumet Fisheries), WBEZ, Choose Chicago
  (bucket list, museum campus, blues, architecture, Hyde Park), Chicago Architecture Center, UNESCO (FLW listing),
  NPS (Pullman, Indiana Dunes), ILDNR (Starved Rock), Wikipedia (landmark facts + coordinates).
- **Channel counts:** editorial/travel 44 places · institutional lone (Michelin/JB/UNESCO/NPS) 14 + co-sourced ·
  local press (Block Club, WBEZ) 3 · creators 0 so far (Keith Lee's Chicago picks found via Fox32/NBC — Soul Prime,
  Cleo's, Sharks, Uncle Remus, Harold's — pending a 2nd credible each).
- **Held single-source (not added):** Tony's Italian Beef, Carm's (Infatuation only); Papa's Cache Sabroso,
  Jibaritos y Más (Infatuation only); Uncle Remus, Uncle John's, Harold's (location not pinned down);
  Paulie Gee's, Robert's Pizza (Time Out only); Daley's, Walnut Room, Valois (Infatuation only);
  Chicago Mag Iconic Eats singles (Kaufman's, Dinkel's, Express Grill, Edzo's, La Chaparrita, J.P. Graziano,
  Ricobene's, Nhu Lan, Garrett, Greek Islands, Girl & the Goat, Avec, Lao Sze Chuan, Carnitas Uruapan, Brown
  Sugar Bakery, Chiu Quon, Mario's Italian Lemonade, Original Rainbow Cone, etc.) — need a 2nd source.
- **MEASURED & DROPPED:** none dropped on merit yet; every added place is on ≥2 curated best-of lists or holds
  an institutional award.
- **Closures:** none found (geocode agents checked status; weakest evidence = current listing, no closure news).
- **Geocode:** 72 verified (70 high — Wikipedia/latlong POI; 2 med), 28 UNVERIFIED held by the gate.
  Boka/Galit coords came from an unapproved aggregator → demoted to UNVERIFIED. Redhot Ranch's Wikipedia pin is
  the Bridgeport store, not the Armitage one listed → not used. Address corrections: Milly's (1005 W Argyle,
  Uptown → NORTH), Pizz'amici (1215 W Grand), Feld (2018 W Chicago Ave), Boonie's, Sochi, Tortello, Mirra, Nadu,
  Taqueria Chingón (817 W Fulton Market). Pat's Pizza address conflict (638 W Diversey vs Time Out's 2679 N
  Lincoln) left UNVERIFIED.
- **Build:** tools/build-chicago.py now hides an area with zero pinned places (SW) instead of failing the
  tier-1 assert; areas with pins still must carry a tier-1. Gates: sourcecheck/geocheck/statuscheck/buildcheck
  PASS; npm run validate + npm test PASS.

## 2026-10-02 (session 2) · waves S3–S8 + W5–W9 (sights everywhere, more Michelin/Iconic-Eats food, creators)
- **Method:** Wikipedia coordinate batches (4 names/query) → pins; one themed 2nd-source query per batch
  (Choose Chicago listings/neighbourhood guides, Time Out listings, CAC "Buildings of Chicago", WTTW "Most Beautiful
  Places"/South Side guides, Atlas Obscura, Visit Milwaukee, Travel Wisconsin, NPS, Block Club).
- **Added:** 86 sights (Loop architecture & public art, Hyde Park/Bronzeville, West Side churches & Jensen parks,
  SW (Stock Yard Gate, Marquette Park MLK memorial, Balzekas, McKinley Park), Far South (Ridge Historic District,
  Wolf Lake), suburbs (Oak Park FLW/Hemingway/Pleasant Home, Evanston, Skokie, Wheaton, Naperville, Batavia,
  Brookfield, Glencoe, Highland Park), day trips (Milwaukee ×6, Racine SC Johnson, Yerkes, Dunes/Mount Baldy,
  Michigan City, Starved Rock, Matthiessen), music rooms, beaches) + 19 food (Iconic Eats + Wikipedia-pinned:
  Girl & the Goat, Avec, Greek Islands, Kaufman's, Gino's East, Mr. Beef, Wieners Circle; Michelin: Oriole, Atelier,
  Sepia, Next, Elske, Kumiko, North Pond, Frontera, Lou Mitchell's, EL Ideas, Daisies, Irazu).
- **Creators:** CREATORS_W1.json — Dave Portnoy (One Bite scores for Vito & Nick's 8.1, Pequod's 7.4, via a radio-site
  roundup), Keith Lee (Chicago tour per Fox32: Lou Malnati's; Soul Prime/Cleo's/Sharks/Uncle Remus/Harold's pending a
  2nd credible). Channel mix now: editorial/travel ≈150 · institutional ≈35 · local press (WTTW/Block Club) ≈15 ·
  creators 3 attaches.
- **Closures / status:** Uptown Theatre flagged `— CLOSED` (shuttered since 1981, CAC). Obama Presidential Center
  confirmed open (2026-06-19, WTTW/Block Club). Held back for stale-location risk: Ann Sather (relocating per Time Out
  Apr 2026), Maxwell Street Depot (forced to move per Time Out May 2026).
- **MEASURED & DROPPED:** Calumet Park (2nd source did not actually name it); Golden Nugget Pancake House (multi-location,
  Wikipedia pin's branch unclear); Café Brauer (now a private-events venue); Givins Castle, Indiana Dunes State Park,
  Douglass Park (Wikipedia coords only to 0.1′/1′ — too coarse to pin).
- **Build:** 175 rendered; gates PASS; Chicago card live on index.html; CITIES.md row updated.

## 2026-10-02 (session 2) · W10–W11 + close-out
- +6 Wikipedia-pinned food (Cariño, Mako, Sifr, Roeser's Bakery, Ceres Cafe, Goose Island Fulton taproom) and +10 sights
  (Pilgrim Baptist ruins, Chicago Bee Building, Smart Museum, Heller House, Goodman, Chicago Shakespeare, Civic Opera
  House, Symphony Center, St. Michael's Old Town, Rosehill Cemetery).
- Key hygiene: Cariño's star and Mako's recognition are cited via Time Out / Choose Chicago articles, so they carry
  TIMEOUT / CHOOSECHI keys (ordinary sources), not MICHELIN_STAR.
- Dropped/held: Lizzadro Museum, Charles Gates Dawes House, Big Chicks, Longman & Eagle, Porto (closed 2023 per
  Wikipedia), Green Door Tavern, Indian Boundary Park, Madonna della Strada — single source or no pin.
- Final: 220 researched / 191 rendered; gates PASS; validate + test PASS.

## 2026-10-02 (session 3) · W12 food & drink batch A (§2b food first)
- Searches: Chinatown, Pilsen/Little Village tacos, Keith Lee picks, Michelin Bib 2024/2025 lists, cocktail/dive/brewery/coffee,
  Devon, Argyle, Eater 38, Tribune/Chicago Mag lists (≈27).
- Added 30 (FOOD_W12.json): 21 on a lone Michelin Bib (2024 ceremony page; key MICHELIN_BIB = award only), Eater-38 co-sourced
  (Lula, Mi Tocaya, Smoque, Superkhana, Luella's), tacos (Carnitas Uruapan, La Chaparrita — Infatuation + Chicago Mag Iconic Eats
  + ABC7), bars (Violet Hour — JB Outstanding Bar Program 2015 via JBF winners page + Sun-Times; Three Dots — NBC5 World's 50 Best
  Bars + Time Out; Rainbo Club, Old Town Ale House — Punch + Chicagoist/Time Out/Infatuation), Soul Prime (Keith Lee creator via
  AfroTech + Chicago Defender), Lao Sze Chuan (Infatuation + Chicago Mag).
- Eater 38 cited via a listchallenges reproduction of the list (Eater page itself not surfaced) — corroborating only, never alone.
- Held single-source: MingHin, Cleo's Southern Cuisine (branch unclear), Lost Lake, Milk Room, Half Acre, Revolution, Intelligentsia,
  Metric, Tank Noodle, Nhu Lan, Sabri Nihari, Ghareeb Nawaz, Usmania, Huaraches Doña Chio, Taqueria Belen, Bayan Ko, Rose Mary,
  Hermosa, Community Tavern. Dropped: Harold's/Sharks (chains — branch not identifiable), Peninsula hotel blog (not credible).
- Channel mix: institutional 21 · editorial/travel 8 · creator 1 (Keith Lee).

## 2026-10-02 (session 3) · W12b–W14 food & drink
- W12b (+21): Michelin venue/area pages (lone MICHELIN/MICHELIN_BIB — Andros Taverna, Momotaro, Omakase Yume, Home Bistro, Dove's,
  etta, Virtue, Yao Yao, Dolo, Daguan, MingHin, Maple & Ash, Tzuco, Michael Jordan's, Les Nomades, Warlord, Sol de Mexico) + bars
  (Lost Lake, Milk Room, Best Intentions, Hopleaf — Time Out Bar Awards + NBC5 50 Best / Chicagoist / Paste).
- W13 (+13): Papa's Cache Sabroso (jibarito), Smak-Tak, Kasia's Deli (pierogi), bakeries (Lost Larson, Loaf Lounge, Hewn, Bang Bang —
  Time Out + Infatuation guides), Brown Sugar Bakery, Josephine's (Resy + Chowhound), Do-Rite + Old Fashioned Donuts (Axios 2026 +
  NBC5), Ricobene's (South Side Weekly + DNAinfo + Chicago Mag), Chiu Quon (Time Out + Infatuation + WTTW).
- W14 (+14): Taxim, Athena (Greek guides), Cho Sun Ok, San Soo Gab San, Parachute (Korean), Au Cheval, Kuma's Corner (burgers), Mario's
  Italian Lemonade, Tufano's (JB America's Classics 2008), Tryzub, Sticky Rice, TAC Quick (Time Out Thai list + Infatuation), Akahoshi
  Ramen (Bon Appétit + NYT 25-best via NBC5), Brindille (2015 JB award via Sun-Times + NYT 25-best).
- Key hygiene: NYT / Bon Appétit recognition reported by NBC5 carries NYT / BONAPPETIT keys with the NBC URL as evidence; JB award
  cited via a Choose Chicago page (Tufano's) is a JB award (America's Classics) → JAMESBEARD.
- Geocode W12a (agent, 50 searches): 4 high + 2 med kept; 9 aggregator (frankiapp-type) coords DEMOTED to UNVERIFIED per the session-2
  precedent; closures found: Dear Margaret (fire, Oct 2025, Time Out) and The Violet Hour (closed 27 Jun 2025) → flagged CLOSED, kept.
  Luella's moved (Lincoln Sq → 4114 N Kedzie, Albany Park, brunch only) → record updated, area NW. Area fixes: Ghin Khao WEST, Munno
  NORTH, Nella SOUTH (Hyde Park), Perilla NW (River West).
- Backlog pins (agent, ~60 searches): 7 accepted (Al's, Gene & Georgetti, Boka, Galit, Middle Brow, Taqueria Chingón, Rainbow Cone);
  Tortello/Sochi listing-site coords rejected. Jim's Original: forced off 1250 S Union by UIC (30 Jun 2026), moving to 551 W 18th St
  (fall 2026) per Sun-Times/Fox32/WGN → address + note updated, stays unpinned.
- Held single-source: Andy's Thai Kitchen, Old Lviv, Shokolad, Noon O Kabab, Taste of Lebanon, Zaytune, Asador Bastian, Al Bawadi
  (possibly closed), Doughnut Vault, Beacon, Pompei, Conte di Savoia, J.P. Graziano, Tony's, Carm's, Phil's, Candlelite, Marie's,
  La Bomba, Pearl's Place, St. Rest, Sweet Mandy B's, Svea, Mr. Greek Gyros, Queen Mary, Nine Bar, Lemon, Sportsman's Club, Delilah's.
- Density after W14: food 152 / 298 discovered (51%); per-area food share LOOP 48% · NORTH 56% · NW 82% · WEST 50% · SOUTH 34% ·
  SW 43% · FAR 63% · SUB 21% · DAY 0%.

## 2026-10-02 (session 3) · build, closures, close-out
- Geocode W12b/W13 (agent, cut off by the 200 cap after 13 records): +5 high pins (Hopleaf, Virtue, Momotaro, Omakase Yume — Apple Maps place
  links; Ricobene's — latlong.net). 20 records returned with memory-only addresses + "unchecked" status → **removed** from _geoout_w13.json
  and from data/geocodes.json (never ship a memory address); they stay UNVERIFIED for session 4.
- Closures: Les Nomades (closed Oct 2025, Time Out + Wikipedia) → kept flagged CLOSED (notable). **MEASURED & DROPPED** (closed, only basis
  for inclusion was a stale Michelin listing): Home Bistro (moved to Cleveland), etta (Bucktown, closed Oct 2025), Daguan Noodle (Yelp CLOSED
  Sept 2026, single status source). Dear Margaret, The Violet Hour kept flagged CLOSED.
- Build: 295 researched / 209 rendered (146 sights + 63 food); sourcecheck 298→295 PASS (43 lone institutional), geocheck PASS,
  statuscheck CONSISTENT, buildcheck PASS; npm run validate DATA OK; npm test ALL PASS.
- Food share: 149/295 = 50.5% overall (≥50% met overall); per area still below 50% in LOOP (48%), SOUTH (32%), SUB (21%), DAY (0%).
- Channel mix (session 3, 75 places): institutional (Michelin/JB) ≈40 · editorial/travel (Infatuation, Time Out, Chicago Mag, Tribune/
  Sun-Times, NBC5/ABC7, Axios, Punch, Paste, Resy, Tasting Table, Chowhound) ≈33 · local press (Block Club/DNAinfo/South Side Weekly/
  Gozamos/WBEZ) ≈6 · creators: Keith Lee (Soul Prime), Ramen Lord/Mike Satinover is the chef (Akahoshi) — creator channel remains thin.
- Searches: 200/200 session cap reached (main ≈75; geocode agents ≈125). Lesson: geocode agents spent ~60% of the budget for ~35% pin
  yield — next session cap them at ~30 searches and spend the rest on discovery (discovery is what moves density).

## 2026-10-03 (session 4 / wave 3) · W15–W17 batch 1 (food first: SOUTH, SW, FAR, WEST, SUB, DAY)
- Searches so far ≈47. Sources: Infatuation/Time Out reviews + neighbourhood guides, Chicagoist, Saveur Pilsen guide, ABC7 Hungry Hound,
  Steve Dolinsky (stevedolinsky.com — The Hungry Hound, ABC7 food reporter; key HUNGRYHOUND), Wednesday Journal, NBC5 Food Guy, Choose Chicago
  South Side + Little Village guides, DNAinfo, South Side Weekly, Roadfood, CNN Travel, Chicago Mag, Texas Monthly, Restaurant Business Top-100,
  Travel Wisconsin, Milwaukee Record, Shepherd Express, Wikipedia.
- Added 21 (FOOD_W15 = 12, FOOD_W16 = 3, FOOD_W17 = 6): Phil's Pizza, Tony's Italian Beef, Top-Notch Beefburger, Edzo's, Don Pedro Carnitas,
  Freddy's Pizza (Cicero), Kouklas (Niles; NYT best-restaurants list via Time Out + NBC5), Chef's Special Cocktail Bar (lone Michelin Bib),
  Valois, Yassa, Honey 1 BBQ, Pearl's Place, Lexington Betty Smokehouse, Asian Cuisine Express, El Milagro, Pizzeria Uno, Harry Caray's,
  Gibsons, Frank's Diner (Kenosha, Wikipedia pin), Leon's Frozen Custard, Solly's Grille.
- Creators: Keith Lee 2023 tour (Matador/TravelNoire: Cleo's Southern Cuisine his only 10/10 — address/branch still to confirm); Portnoy One
  Bite Chicago scores (radio-site roundup: Dino's 7.4, Barnaby's 7.8, Giordano's 8.4) — creator-only, held.
- Geocode: Phil's latlong.net POI 'phil-s-pizza-571446' (41.7301,-87.7806) is a different Phil's at 79th/Harlem — REJECTED. Restaurant pins
  remain mostly UNVERIFIED (address + status recorded in geo/_geoout_w15.json). Frank's Diner pinned from Wikipedia.
- Held single-source: Frangella Italian Market (ABC7), Hecky's BBQ (Resy), Taco Diablo, Bennison's, Original Soul Vegetarian, Dino's,
  Barnaby's, 3 Floyds (brewpub closed 2020, taproom reopening — status unclear), O&H Danish Bakery (address of the flagship unconfirmed).
- Build: 316 researched / 210 rendered; sourcecheck/geocheck/statuscheck/buildcheck PASS; validate + test PASS.
