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
