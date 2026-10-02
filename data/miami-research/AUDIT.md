# Miami · Fort Lauderdale · Everglades — AUDIT ledger (append-only)

Follows docs/PIPELINE.md (stages 0→6) and docs/RUN-2026-10-02.md §5a. One dated section per stage per wave.

## 2026-10-02 · Stage 0 — Scope & taxonomy
- **Region:** Broward (Fort Lauderdale, Hollywood, Dania Beach, Pompano, Davie) → Miami-Dade (the city, Miami
  Beach, Coral Gables/Coconut Grove/Key Biscayne, Hialeah/Doral, South Dade) → the Glades edge: Everglades
  National Park (Ernest Coe/Royal Palm/Flamingo, Shark Valley, Gulf Coast/Everglades City), Biscayne National
  Park, Big Cypress National Preserve + the Tamiami Trail (Miccosukee, airboats).
- **Areas (9, NYC-style by district):** FTL · NMIA · WYN · DTB · LHAV · MBCH · CGCG · SDADE · GLADE — targets in
  RESUME.md sum to 500 (NYC density, per brief). Why: they map to how visitors and locals actually divide the
  metro (Broward vs Dade; the Beach vs the mainland; the Cuban west side; the Haitian/arts north side; the farm
  belt; the parks) and keep tiers graded within comparable ground.
- **Cuisine taxonomy:** canon-first — CUBAN, BAKE (pastelitos/key lime pie), SEAF (stone crab), HAIT, CARIB,
  PERU, VENCO (arepas), LATAM (Nicaraguan/Argentine/Brazilian/Mexican), GLADF (conch/gator/frog legs), FARM
  (Redland tropical fruit), MKT, US, BURG, EU, MED, ASIAN, COF, BAR, VIRAL. Tags name the kitchen's own
  tradition (frita → CUBAN; a Cuban bakery → CUBAN+BAKE).
- **Collections:** ICON, BEACH, DECO (Art Deco/MiMo), ART (murals/galleries), MUS, HIST, PARK, WILD
  (Everglades/wildlife), BOAT (airboats/islands), ENT, FAM, ODD, FREE.
- **Food canon (named before searching):** Cuban sandwich & medianoche, croquetas, pastelitos + ventanita
  cafecito/colada, the frita, stone crab, Haitian griot, Peruvian ceviche, arepas, key lime pie, conch fritters,
  Nicaraguan fritanga, Redland tropical fruit (Robert Is Here milkshakes), gator & frog legs at the Glades edge.

## 2026-10-02 · Stage 1 — Discover sources (wave F1) — BLOCKED
- Seed outlet palette written to `SOURCES_SEED.json` (29 outlets with `credible` rationale; registered into
  data/sources.json on the first `rebuild-city.py` run).
- WebSearch: 1 call succeeded (geocode-method probe, Versailles place pin via google.com `!3d!4d`); every
  subsequent call refused — session budget 200/200 exhausted (shared across the ~16 concurrent agents).
  No places were extracted; nothing fabricated. Discovery resumes when the search budget is raised/reset.

## 2026-10-02 (session 2) · Stages 1–3 — Wave F1/S1 discovery + fact-check
- Search log: `_miami_searchlog.md` (every call). Budget assumed 200/session, shared with any subagent.
- **Food (FOOD_F1.json, 42):** Michelin 2026 — 1×2★ (Robuchon) + 13×1★ Miami + Chef's Counter at MAASS (FTL);
  18 Bib Gourmands (2025 list of 14 + 2026 new Barra Callao/Cotoa/Double Luck; To Be Determined held — location
  unknown). Canon: Versailles (MICHELIN+NT+TimeOut), Havana Harry's (NT+MICHELIN_EDITORIAL), El Mago de las Fritas
  (Eater 38+NT), Joe's Stone Crab (Eater+NT+Infatuation via TripExpert), Chez Le Bebe & Chef Creole (NT+Infatuation),
  Cvi.che 105 (Infatuation+TimeOut+NT Best Ceviche 2024); JBF 2026 semifinalists Recoveco, Amara at Paraiso, Bar Bucce.
- **Key hygiene:** Michelin best-of guides (best Cuban restaurants) → `MICHELIN_EDITORIAL` (one ordinary source);
  JBF semifinalist listings → `JAMESBEARD`.
- **Held single-source:** see `_PENDING_LEADS.md` (Sarussi — Man v. Food mention only reported second-hand, so not
  counted; Enriqueta's, Latin Cafe 2000, La Carreta Hialeah, Casavana, La Esquina del Lechon, Islas Canarias, Dos
  Croquetas, Cafe La Trova, Samán Arepas, El Arepazo 2, Las Arepas de Maria, Arepa Point, Piman Bouk, Naomi's Garden).
- **Sights (SIGHTS_S1.json, 21):** NPS (Anhinga Trail, Shark Valley, Pa-hay-okee, Flamingo) + NatGeo/Frommer's;
  Lonely Planet (Miami must-sees, South Beach, Fort Lauderdale) + Culture Trip FTL + Time Out + Wikipedia articles.
- **Channel mix so far:** institutional (Michelin/JBF/NPS) 39 · editorial of record (NT/Eater/Infatuation) 8 ·
  travel sites (LP/TimeOut/NatGeo/Frommer's/Culture Trip) 21 · creators 0 (Little Haiti creator query found none).
- Area assignment of Recoveco / Bar Bucce provisional (WYN) — confirm at geocode.

## 2026-10-02 (session 2) · Stages 3–6 — waves 2–7, geocode, build, go-live
- **Discovery total:** 166 places (food 72 · sights 94 incl. closed). Channels: institutional (Michelin stars/Bib/
  recommended 2022–26, JBF 2026 semifinalists, NPS) 31 lone-authority + many corroborating; editorial of record (New
  Times, Infatuation, Eater, Time Out, Caplin News); travel sites (Lonely Planet, Frommer's, Fodor's, NatGeo, Atlas
  Obscura, Roadside America); tourism boards (GMCVB, Visit Lauderdale, Paradise Coast, Visit Florida); creators
  (Mark Wiens → Versailles; Burger Beast registered; Earth Trekkers, Florida Rambler as corroboration).
- **MEASURED & DROPPED / held:** see `_PENDING_LEADS.md` — single-source leads never added (Hialeah & Kendall
  Infatuation picks, Doral GMCVB picks, arepa spots, key lime pie, burgers, South Beach Infatuation list, Sun
  Sentinel critic picks, Rustic Inn). Aventura/Sunny Isles search returned only OpenTable/SEO → nothing kept.
  Sarussi Subs removed (Man v. Food mention only second-hand).
- **Geocode (3 background waves, 101 searches):** w1 30/63 · w2 27/66 · w3 14/49 pinned (Wikipedia published coords
  dominate; med = park-wide or third-party points). 95 UNVERIFIED held by the gate — restaurant place pins never
  surfaced via WebSearch summaries. Rejected: estimated coords for Le Jardinier/Cote, Phuc Yea downtown point,
  Big Cypress Oasis north-of-trail point, Greynolds = Arch Creek point, Stiltsville "approximate", Dante Fascell bay point.
- **Closures:** Miami Seaquarium — CLOSED (12 Oct 2025; Local10/WLRN), Fiola Miami — CLOSED (22 Jun 2025; NT/Time Out),
  Lion & the Rambler — CLOSED (NT listing). Havana Harry's 2025 shutdown, reopening unconfirmed → unknown.
- **Area fix:** Recoveco → SDADE (6000 SW 74th St, South Miami).
- **Build:** `rebuild-city.py miami-fl --build` → 71 on page (59 sights + 12 food); sourcecheck 166 PASS; geocheck PASS
  (2 block-level pins flagged for re-verify: South Pointe Park, Hometown Barbecue); statuscheck CONSISTENT (0 unchecked
  on page); buildcheck PASS; validate + test green. Card relinked live; CITIES.md row added.

## 2026-10-02 (session 3) · Stages 1–6 — wave F5/S6 (food-first, every NEED area) + geocode w4/w5 + build
- **Method (logged per call in `_miami_searchlog.md` §Session 3):** domain-restricted "list every X named in <outlet> <guide>"
  queries return whole lists (Time Out, Infatuation, Fodor's, New Times); places are added only where ≥2 outlets
  intersect (or a lone Michelin listing). This replaced per-place corroboration searches (≈4–10 places/search).
- **Restaurant place pins via WebSearch: dead** — 4 probes for Versailles (google `!3d!4d`, mapcarta, "GPS coordinates",
  raw `!3d25`) returned 0 coordinates. Decision: spend no further budget on restaurant pins; they stay UNVERIFIED for
  `tools/geocode-helper.html`.
- **Added 111 places** (FOOD_F5.json 94 food & drink; SIGHTS_S6.json 17 sights). Channels: editorial of record
  (Miami New Times incl. Best of Miami awards; The Infatuation; Time Out; Fodor's) ∩ pairs; MICHELIN (Bistro Ocho,
  Krüs Kitchen Green Star); tourism boards (Visit Lauderdale breweries, GMCVB); Wikipedia as 2nd for sights;
  creators: Josiah Eats (500K+, NT-profiled) attached to Farofa; Miami Food Porn registered (CREATORS_F5.json).
  Creator query for YouTube Miami food tours (Sonny Side, Mike Chen, Kara & Nate) found no Miami episode → nothing.
- **Canon covered this wave:** frita (El Rey de las Fritas), pan con minuta (La Camaronera), pastelitos (Ricky Coral Way,
  La Nueva Fe, Breadman — Infatuation Pastelito Power Rankings ∩ NT), Nicaraguan fritanga (Madroño, Fritanga Caña Brava),
  Redland (Knaus Berry Farm), stone crab (Catch & Cut, Everglades City: Camellia St Grill, Triad, Havana Café),
  cubano (Puerto Sagua), tiki (Mai-Kai reopened Nov 2024), breweries (Funky Buddha, Invasive Species, Tripping Animals,
  Abbey), 17 cocktail/dive bars (Time Out 23 best bars ∩ Infatuation bar guides).
- **MEASURED & DROPPED / held:** La Sandwicherie first held (NT URL not surfaced) then added on Time Out Brickell list ∩
  Infatuation; Shima (Hialeah) held — no Infatuation URL surfaced; Chefs on the Run dropped (cuisine unknown → no named
  dish); Steve's Pizza, Café Bonjour (NT Best Restaurant S. Dade 2025), Le Tub, Jack's Hamburgers, Top Hat Deli,
  Coconuts, Greek Islands Taverna, Takato, Swizzle-only lists, B&M Market, Awash Ethiopian, Dumpling King — single outlet,
  held. Hollywood/Dania "best restaurants" search returned OpenTable/SEO only → nothing kept.
- **Geocode:** w4 (subagent, 29 searches): 10 kept (1 high Lyric Theater, 9 med); main-agent review downgraded Loop Road
  and ICA Miami to UNVERIFIED (printing page unconfirmed). w5 (subagent, 18 searches): 11 kept (4 high: Arsht, Kaseya,
  Aventura Mall, Hillsboro Inlet Light; 7 med incl. pier points from diveagainstdebris surveys for Deerfield/Pompano/
  Dania — flagged for re-verify); downgraded Broward Center (page unconfirmed), Newport Pier (2-decimal NOAA point),
  Jungle Queen (tide-station point). Wikipedia's Brickell Key coord is ~6 km off (rejected; Carbonell condo point used, med).
- **Closure checks:** `_geoout_zz_status1.json` — 10 pinned places given sourced status (Kirby Storter reopened 4 Nov 2024
  partial; Stiltsville BNPI tours Thu–Sun; Virginia Key Beach hours; Lyric Theater 2026 events; Arch Creek 2026 event).
  Lesson: geo files merge in sorted order, so a status-only file must sort last (`zz_`) or older `unknown` rows win.
- **Build:** 277 discovered (177 food & drink = 64%) → 92 on page (80 sights + 12 food). sourcecheck 277 PASS (31 lone
  authority); geocheck PASS (2 block-level pins flagged); statuscheck CONSISTENT, 0 unchecked; buildcheck PASS;
  `npm run validate` DATA OK; `npm test` ALL PASS. Card + CITIES.md row refreshed.

## 2026-10-02 (session 3, cont.) · waves F5b/S6b + geocode w6/w7 + build 2
- **Added** (since build 1): 41 food & drink + 23 sights. Highlights: Wynwood/downtown breweries (Wynwood Brewing, J. Wakefield,
  Veza Sur, Biscayne Bay — NT ∩ Time Out), 8 coffee shops (Time Out 26 ∩ Infatuation coffee guides), Coconut Grove bars
  (Taurus since 1969, Monty's, Flanigan's), North Beach (Cafe Prima Pasta, Katana, Sushi Erika, Mi Colombia, Silverlake),
  Haitian (Pack Supermarket), arepas (Las Arepas de Maria — NT Best Arepas 2025), key lime pie (Fireman Derek's), Hialeah
  (Franky's Deli, El Rinconcito de Santa Barbara, Shima — Infatuation 15 best Hialeah ∩ NT), north Dade creator-corroborated
  (Awash Ethiopian, Dumpling King, Zaika — Infatuation ∩ Josiah Eats). Sights: 11 NPS Everglades/Biscayne/Big Cypress
  (lone NPS authority), Ted Smallwood Store, Museum of the Everglades, Miccosukee Village, Big Cypress Bend boardwalk,
  Time Out beaches (Lummus Park, North Beach, Surfside, Bal Harbour), Fillmore, Bandshell, Calle Ocho Walk of Fame.
- **MEASURED & DROPPED:** Dos Croquetas (NT Best Croquetas 2024, but Infatuation's review is negative — "too expensive for their
  quality"); Fookem's key lime pie (delivery-only, not a place); Viernes Culturales (monthly event, not a place; GMCVB page
  cited didn't name it). Held single-outlet: Vicky Bakery (NT only ×2), Doggi's Arepa Bar (NT only ×2), Medium Cool, Arepa Point.
- **Geocode w6** (16 searches): 8 pins (4 high: Nike HM-69 Wikipedia, Gulf Coast VC hmdb, H.P. Williams hmdb, Bakehouse Wikipedia;
  4 med). Coe VC / Mahogany Hammock / Nine Mile Pond / West Lake unresolved (only non-allowed map sites printed coords).
  **w7** (12 searches): 3 high (Lummus Park, Ted Smallwood Store, Everglades Laundry/Museum); 8 unverified (centroid-only or
  wrong building — rejected).
- **Build 2:** 340 discovered (218 food & drink = 64%) → 103 on page (91 sights + 12 food). sourcecheck 340 PASS (42 lone
  authority); geocheck PASS; statuscheck CONSISTENT, 0 unchecked; buildcheck PASS; validate DATA OK; test ALL PASS.

## 2026-10-02 (session 3, final) · build 3 + closure + wrap-up
- **Last adds:** FTL classics (Tropical Acres, Jack's Old Fashioned, Old Heidelberg — Infatuation 20 classic FTL ∩ NT/Fodor's),
  S3 + Casablanca Café (NT FTL beach ∩ Fodor's), Nour Thai, Homestead (Yardie Spice, White Lion Cafe, Taqueria Morelia,
  La Cruzada), tacos (Taquerias El Mexicano ∩ NT Best Tacos 2025, Coyo Taco), Brickell bars (Panamericano, Baby Jane),
  seafood (River Oyster Bar, Captain Jim's), D. A. Dorsey House.
- **Closure found:** The Fillmore Miami Beach (Jackie Gleason Theater) — **CLOSED** 31 May 2022 (Miami New Times + WLRN, Mar
  2024; no reopening found). Kept, renamed `— CLOSED`, `closed:true`. Geocode w7 had marked it "open" on a Songkick listing —
  rejected as unconfirmed (lesson: a ticketing listing is not open-status evidence).
- **Geocode w8** (10 searches): D. A. Dorsey House high (Wikipedia 25°46′57″N 80°11′56″W). Rejected: Clippix ETC photo-page
  coords for Coe VC / Mahogany Hammock (not an allowed source), convention-centre coord for the Fillmore.
- **Session totals:** 166 → 357 discovered (+191: +162 food & drink, +29 sights) — food & drink share 66%;
  71 → 104 pinned (+33, all sights; restaurant pins remain blocked on WebSearch). WebSearch ≈ 210 calls this session
  (main ≈ 95 logged + ≈ 30 tool sub-searches; subagents 29 + 18 + 16 + 12 + 10 = 85).
- **Build 3:** sourcecheck 357 PASS (42 lone authority); geocheck PASS; statuscheck CONSISTENT (1 closed on page, 0 unchecked);
  buildcheck PASS; `npm run validate` DATA OK; `npm test` ALL PASS. Card: 92 sights · 12 food on the map (357 researched, 66%).
