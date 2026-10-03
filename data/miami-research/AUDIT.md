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

## 2026-10-03 (session 4) · wave F6/S7 batch 1 + geocode w9
- **Sources (channel mix):** GMCVB (Pinecrest Gardens, Amelia Earhart Park, Jungle Island, Bayside, LHCC venue pages), Time Out
  Miami venue pages (Gold Coast RR, Wings Over Miami, Pinecrest Gardens, Taquiza, Papi Steak, CJ's, Abbalé via 24 best SB),
  Wikipedia (sight 2nd source + coords), AFAR (LHCC), Miami New Times (Milly's, Black Point Ocean Grill, Papi Steak, CJ's),
  Infatuation reviews (Milly's, Black Point, Taquiza 8.2, Abbalé 7.7). Creator query: none yet this batch.
- **Added (13):** sights 7 — Gold Coast Railroad Museum, Wings Over Miami, Pinecrest Gardens (SDADE); Amelia Earhart Park (LHAV);
  Bayside Marketplace, Jungle Island (DTB); Little Haiti Cultural Complex (WYN). Food 6 — Milly's Empanada Factory, Black Point
  Ocean Grill (SDADE); Papi Steak, CJ's Crab Shack, Abbalé, Taquiza (MBCH).
- **MEASURED & DROPPED:** Kissaki South Beach (Infatuation: permanently closed, non-notable → drop); Casa Isola (Infatuation 6.7,
  "fusion misses the mark"); Carbone (Infatuation: "average to above average", overpriced); Byblos ("see and be seen").
- **Held single-source:** Gesu Church, Bay of Pigs Museum (1821 SW 9th St), Black Point Marina, Larry & Penny Thompson Park
  (Wikipedia only); Cubaocho (GMCVB only); Two Chefs, Café Pastis, Dr. Limón (NT Best Ceviche 2024), Babe's Meat & Counter,
  Big Pink, Las Olas Cafe, Neya (one outlet each so far).
- **Geocode w9:** 11 high Wikipedia pins — 6 sights (Gold Coast RR, Wings Over Miami, Pinecrest Gardens, Bayside, Jungle Island)
  + 5 RESTAURANTS (Versailles, Mai-Kai, Cap's Place, L'Atelier Robuchon, Rustic Inn). LHCC, Amelia Earhart → UNVERIFIED
  (Wikipedia printed only neighbourhood centroids / no coords). Google `!3d!4d` probe for a restaurant returned nothing (again).
- **Lesson (tooling):** a geoout row WITHOUT status fields overwrote an existing `statusSource` with '' during merge (Versailles,
  L'Atelier, Bayside became "status UNVERIFIED"). Fix applied in data: every w9 row now carries status+statusSource.
  Rule for Miami geo files: never write a coordinate row without status — copy the prior status if unchanged.
- **Gates:** sourcecheck PASS · geocheck PASS · statuscheck CONSISTENT (0 unchecked) · buildcheck PASS · validate DATA OK · test ALL PASS.

## 2026-10-03 (session 4) · batch 2 — FTL + NMIA food, Broward sights
- **Sources:** Infatuation guides (20 classic FTL, 18 Broward, 14 best North Miami Beach) + reviews; New Times Broward-Palm Beach
  (9 best Hollywood, 8 best Pompano, location write-ups); Miami New Times (16 best FTL, Best Restaurant Aventura 2025, NMB pieces);
  Time Out (FTL best, venue pages); Visit Lauderdale (seafood guide, Pompano page, top-10, YAA listing); Wikipedia.
- **Added (16):** FTL food 8 — Egg N' You, Peter Pan Diner, Top Hat Deli, Gabose, Ukiah, Billy's Stone Crab, GG's Waterfront,
  Calypso; FTL sights 2 — NSU Art Museum (high pin), Young At Art (UNVERIFIED: Wikipedia coord is the former Davie building).
  NMIA food 6 — Steve's Pizza (t1), Lutong Pinoy, Perl (NT Best Aventura 2025), Sang's dim sum, Pho Mi 2 Go, Basilic.
- **MEASURED & DROPPED:** Le Tub (Infatuation: "the burger just doesn't taste the same" after renovation — negative review beats a
  local vote, same rule as Dos Croquetas); Bulldog Barbecue (Time Out: closed, non-notable → drop).
- **Held:** Hot Dog Heaven (NT: "for sale after 45 years" — status unclear), Burlock Coast (Fodor's forum only), J&C Oyster (VL
  listing only), Cafe Martorano / Quarterdeck (Fodor's only), U Know Korean Bistro, Sim Sim Cafe, Topkapi, Sichuan Fish (Inf only),
  Fort Lauderdale Antique Car Museum (VL only), Krakatoa / GoBistro / Tipsy Boar / Fish Shack / Cafe La Buca (BPB only).
- **Search note:** sun-sentinel.com is refused by the search tool (like eater.com) — never put it in allowed_domains.
- **Gates:** sourcecheck/geocheck PASS · statuscheck CONSISTENT (0 unchecked) · buildcheck PASS · validate DATA OK · test ALL PASS.

## 2026-10-03 (session 4) · batch 3 — South Dade + Downtown
- **Added (14):** SDADE food 6 — Redland Market Village (t1), Broadway Subs, Lan Pan-Asian Cafe, Two Chefs (t1), Hole in the Wall,
  Macita's; SDADE sights 3 — Cauley Square, Black Point Park & Marina, Larry & Penny Thompson Park (all high Wikipedia pins;
  status from Miami-Dade Parks pages / GMCVB). DTB food 3 — Soya e Pomodoro, LPM, Garcia's (t1); WYN food 1 — Plaza Seafood
  Market (Allapattah → WYN, nearest district); DTB sight 1 — Gesù Church (high pin).
- **MEASURED & DROPPED:** Seaspice (Infatuation: "more for the scene than the food"); Delilah (Infatuation negative).
- **Held:** NAOE (Time Out 2026 world-ranking news only; not confirmed on the Michelin 2026 star list), Felice (Inf; no TO URL),
  Café Pastis — renamed Café Panisse per Infatuation (hold until confirmed), Babe's Meat & Counter, Jamrock, Yafa, Ifra's (Inf only),
  Seminole Theatre / Homestead-Miami Speedway (Wikipedia only), Miami Tower, Lummus Park HD (Wagner House, Fort Dallas) (Wikipedia
  coords in hand; second source not confirmed), Ichimura Miami-Japan Garden (Time Out only).
- **Address hygiene:** street numbers I had not seen printed in a source were reduced to street/area level (Gold Coast RR, Wings
  Over Miami, Amelia Earhart Park, Jungle Island, LHCC, NSU Art Museum, Cauley Square, Gesù) — CLAUDE.md 4a.
- **Michelin check:** every 2026 Miami-area Bib Gourmand / star already in the dataset (2 searches).
- **Gates:** all 4 green, 0 unchecked; validate DATA OK; test ALL PASS.

## 2026-10-03 (session 4) · batch 4 — hidden gems (creator lead) + LHAV/WYN sights
- **Creator channel:** YouTube query (Mark Wiens / Best Ever Food Review / Strictly Dumpling Miami) → no Miami episode; Josiah Eats
  query → NT "Miami's top influencers dish their favorite hidden gems" (picks not in snippet) — used as a pointer to the GMCVB
  and NT hidden-gem lists. Creator-attached places this batch: 0 (no findable creator piece naming a new place).
- **Added (16):** food 7 — L.C. Roti Shop (NMIA t1), Golden Rule Seafood (SDADE), Pauloluigi (CGCG), El Carajo (CGCG t1),
  S&N Vegetables (LHAV pan con bistec), Don Maguey (LHAV), Mangrove (DTB). Sights 7 — Bay of Pigs Museum, American Museum of the
  Cuban Diaspora (high pin), Cubaocho (LHAV); Moore Building, Superblue, Locust Projects, Haitian Heritage Museum (high pin) (WYN).
- **MEASURED & DROPPED:** de la Cruz Collection — permanently CLOSED 2024 (Wikipedia; after Rosa de la Cruz's death) → dropped
  as a non-notable closure rather than a live suggestion.
- **Held:** Mary's Coin Laundry (Inf + NT, location unconfirmed), Matsuri, Happy Wine, Babe's, Butcher Shop & Deli, Guadalajara,
  Big Tomato, Brewing Buddha (NT only); Pronto, Aoko, Gangnam, 5 Esquinas, Taco Time, Green Chicken (GMCVB only);
  El Titan de Bronze, Dot Fiftyone (GMCVB only).
- **Gates:** all green, 0 unchecked; validate DATA OK; test ALL PASS. Density: CGCG 52 · DTB 42 · FTL 60 · GLADE 34 · LHAV 48 ·
  MBCH 49 · NMIA 31 · SDADE 43 · WYN 55.

## 2026-10-03 (session 4) · batch 5 — Miami Beach lists, Everglades/Homestead dining, NPS east-side sights
- **Added (21):** MBCH food 5 — Queen, MILA (Inf 25 ∩ TO 24 South Beach), Las Olas Cafe, True Loaf, Aviv (JBF-winner Solomonov);
  MBCH sights 2 — New World Center & SoundScape Park, Villa Casa Casuarina (both high Wikipedia pins). GLADE food 1 — The Pit
  Bar-B-Q (Fodor's + GMCVB); SDADE food 3 — Everglades Gator Grill, Royal Palm Grill, Chefs on the Run (mofongo — the named dish
  that resolves session 3's hold). GLADE sights 4 (lone NPS) — Long Pine Key, Pinelands Trail, Paurotis Pond, Eco Pond.
- **MEASURED & DROPPED:** Stiltsville Fish Bar (closed Dec, NT — non-notable); Sushi | Bar ("novelty wears off", Inf); Lido Bayside
  Grill ("the view, not the food", Inf); Havana 1957 (tourist chain — padding); Oyster House, Everglades City (Fodor's: no longer
  operating); Chekika (NPS: closed indefinitely).
- **Held:** The Joyce, Vecinos (Inf only); Queen Omakase, Planta, RED, Prime Italian, Joliet (TO only); Farmers' Market Restaurant,
  Suvi Thai (Fodor's only); La Brisa (GMCVB only); Fontainebleau, Art Deco Welcome Center, Faena Theater (GMCVB only).
- **Geocode candidates NOT pinned:** a search extract printed Eco Pond 25.138709,-80.937543 and Paurotis Pond 25.282657,-80.799723,
  but the printing page could be npplan.com rather than nps.gov → left UNVERIFIED; re-verify on an NPS/Wikipedia page.
- **Gates:** all green, 0 unchecked; validate DATA OK; test ALL PASS.

## 2026-10-03 (session 4) · batch 6 — FTL lists + Broward nature + downtown lists
- **Added (17):** FTL food 4 — Epazote (Inf 25 ∩ NT best Mexican FTL), Boatyard, Shooters (NT 16 waterfront ∩ Visit Lauderdale
  dock-and-dine), Temple Street Eatery (NT downtown FTL ∩ VL international); FTL sights 3 — Mizell-Eula Johnson State Park (Fodor's +
  Wikipedia), Anne Kolb Nature Center, Everglades Holiday Park (high pin). DTB food 5 — NAOE (t1; Inf "still its best" + Time Out
  2026 ranking — resolves the batch-3 hold), NIU Kitchen, Drinking Pig BBQ, Eleventh Street Pizza, Miami Slice (TO 19 downtown ∩ Inf).
- **Held:** Red Sea Eritrean, Nove Pasta House (Inf + VL listing only), D's Sports Bar, Yot Bar, Mykonos (one editorial outlet),
  Motek (Inf review found is the NYC branch), Sunkissed (Inf only), Julia & Henry's / PEZ / Giselle / Pollos y Jarras / Meraki (TO only).

## 2026-10-03 (session 4) · batch 7 — North Dade + Little Havana Central American canon
- **Added (7 food):** NMIA — Chéen-Huaye (NT + TO), Topkapi at Hürrem Hammam (Inf + NT), Etzel Itzik Deli (Inf + NT), CY Chinese
  (Inf + NT hot pot); LHAV — Pinolandia (t1, 24-hour fritanga), Yambo (baho), El Atlacatl (pupusas) — Inf ∩ NT.
- **Held:** Sim Sim Cafe, Sichuan Fish, Guayacan, Paseo Catracho, Old's Havana (Inf only); Jarana, Chayhana Oasis, Casa D'Angelo
  Aventura, Fish Fish, Petit Rouge, Doggi's, La Latina, Charlie's, Pisco y Nazca (NT only).
- **Totals:** 448 researched (296 food & drink = 66%) → 124 pinned (107 sights + 17 food). Hub card, CITIES.md row, run-log row updated.

## 2026-10-03 (session 4) · batch 8 — SDADE, MBCH, DTB architecture
- **Added (11):** SDADE food 2 — Babe's Meat & Counter (t1; NT Best Burger 2025 + TO + Inf), Jamrock Cuisine (NT Best Jamaican
  2018 + Inf); SDADE sight 1 — Homestead Historic Downtown District (GMCVB + Wikipedia). MBCH food 3 — Josh's Deli, Las Vacas Gordas,
  The Joyce; MBCH sight 1 — Fontainebleau (high pin). DTB sights 2 — Alfred I. duPont Building, Ingraham Building (high pins).
- **Not added:** Seminole Theatre (only one outlet once the Wikipedia link turned out to be an unrelated 'Seminole Cafe and Hotel'
  article — coordinate discarded); Miami-Dade County Courthouse (current public-access status unverified); Miami Beach Post Office,
  Faena Hotel (Wikipedia only); Florida Pioneer Museum, Town Hall Museum (GMCVB only).
- **Gates:** all green, 0 unchecked; validate DATA OK; test ALL PASS.

## 2026-10-03 (session 4) · batch 9 — WYN sights, Hollywood/Wilton Manors food, Coconut Grove & Coral Gables
- **Added (18):** WYN sights 3 — Margaret Pace Park (high pin), El Espacio 23, MiMo Biscayne Blvd Historic District (t1). FTL food 4 —
  Krakatoa, Jack's Hollywood Diner, Mimi's Ravioli, Dolce Salato (Inf Hollywood 15 / Wilton Manors 10 ∩ New Times Broward-Palm Beach).
  CGCG food 4 — Shore To Door, Midorie (NT Best CG 2023), Loretta & The Butcher, Original Daily Bread (Inf Grove 19 ∩ NT);
  CGCG sights 3 — Merrick House (t1), Coral Gables Congregational Church, Plymouth Congregational Church (all high pins).
- **Held:** Morningside/Bay Shore HD (Wikipedia + unattributed GMCVB text), JP's Bagel, Pupusatime, Le Patio, Stork's, Ophelia,
  Emissary, Da Angelino (one outlet each).

## 2026-10-03 (session 4) · batch 10 — breweries, downtown food hall, Overtown, pins for sourced sights
- **Added (10):** breweries 7 — Tarpon River, LauderAle, 3 Sons (FTL; Visit Lauderdale brewery guide ∩ NT), The Tank, M.I.A. Beer Co.
  (LHAV), Strange Beast (SDADE), Cervecería La Tropical (WYN) (Time Out 16 breweries ∩ NT/Inf); DTB food 1 — Julia & Henry's (TO + Inf
  + NT readers' Best Food Hall 2024); DTB sight 1 — Overtown Historic Folklife Village.
- **Pins:** Tower Theater (high, Wikipedia; status: MFF screenings 2026; MDC takes over 1 Nov 2026, reopening 10 Dec after upgrades),
  Amelia Earhart Park, Mizell-Eula Johnson SP, Bay of Pigs Museum (high, Wikipedia). REJECTED: Máximo Gómez Park value = Little
  Havana neighbourhood centroid.
- **Not added:** Flamingo backcountry trails (Snake Bight, Christian Point, Coastal Prairie, Bear Lake) — NPS says they are not being
  maintained (Cape Sable thoroughwort habitat); Historic Hampton House (Brownsville — outside DTB; area call pending);
  St. John's Baptist Church (Wikipedia only); Sunkissed (Inf only); Spanish Marie, Prison Pals, Unbranded, Gulf Stream (one outlet).

## 2026-10-03 (session 4) · batch 11 — bakeries, Opa-locka, Kendall
- **Added (15):** bakeries 5 — Rosetta (MBCH), Gilbert's (LHAV; NT Best Pastelito 2018 / Best Cortadito 2024–25), Caracas Bakery
  (WYN), Piononos (t1), Flour & Weirdoughs (CGCG) — Time Out 17 ∩ Infatuation 20 / NT. NMIA sights 2 — Opa-locka Museum of Art &
  History (1927 Seaboard station), Opa-locka/Hialeah Flea Market (NT Best Flea Market ×3 + GMCVB). SDADE food 4 — Hungry Bear,
  Best Sub & Sandwich, Shibui, Caribbean Delite (Inf 17 best Kendall ∩ NT; Caribbean Delite also an influencer pick in NT's
  "Miami's top influencers' hidden gems" — the creator-channel corroboration this wave).
- **Documented gap — Haitian food in North Dade:** Infatuation's 19 best Haitian list names Family Bakery, Lakay Food Spot, Bon Bagay,
  Horace Bakery, L'auberge (all North Miami) and Chez Katu (Miramar), but no second credible outlet surfaced for any of them in two
  searches (NT/TO/WLRN/GMCVB) → all held, not added. Gregs Cookout: Infatuation marks it permanently closed → dropped.

## 2026-10-03 (session 4) · batch 12 — bars, Tamiami Trail airboats, last per-area gaps
- **Added (12):** food 10 — Platea (SDADE), Versailles Bakery (LHAV), Palace Bar (MBCH), Sugar, Better Days, Mike's at Venetia (DTB),
  Gulf Stream Brewing (FTL); sights 2 — Everglades Safari Park, Gator Park (GLADE; Fodor's Tamiami Trail + GMCVB).
- **Closure checks:** Medium Cool — NT: closing 22 Aug 2026 at its 17th St location → not added; Stormy Monday — limited-run pop-up
  through July → not added; **Macchialina** (in dataset) — Stormy Monday occupied its "former home", so re-checked: still OPEN, moved
  next door at 820 Alton Rd (old room is sibling Fluke) — no change needed.
- **Held:** El Titan de Bronze (NT 2007 only), Stormy Monday / Water Lion (Inf only), Zaytona, Fonda Sabaneta, El Tambo (Inf only).
- **Density:** CGCG, FTL, GLADE, LHAV, SDADE, WYN now at/over target; DTB 54/55, MBCH 62/65, NMIA 37/40.

## 2026-10-03 (session 4) · batch 13 + wave close — every area at target
- **Added (9):** NMIA food 2 — Jarana (Acurio group; Inf + NT), Chayhana Oasis (Inf + NT); NMIA sights 2 — Aventura Arts & Cultural
  Center (TO + NT), Opa-locka Heritage Trail (WLRN + GMCVB); MBCH sights 4 — Art Deco Welcome Center & Museum (LP + Fodor's),
  Miami Beach Post Office (LP + Wikipedia; high pin), Faena Theater (TO + NT), North Shore Open Space Park (TO + NT); DTB sight 1 —
  Ichimura Miami-Japan Garden (TO + NT).
- **Not added:** Enchanted Forest Elaine Gordon Park (WLRN Apr 2026: residents say it "isn't living up to its name" — merit doubt).
- **Session 4 totals:** 357 → 509 discovered (+152: +101 food & drink, +51 sights), food & drink 66%; 104 → 136 pinned (+32: 27 sights,
  5 restaurants via Wikipedia). Density: CGCG 61/55 · DTB 55/55 · FTL 75/75 · GLADE 41/40 · LHAV 55/55 · MBCH 66/65 · NMIA 41/40 ·
  SDADE 55/55 · WYN 60/60 — **all OK**. Food share per area ≥50% everywhere except GLADE (7/41, park area — noted, not padded).
- **Channel mix (session 4 adds):** local editorial (Miami New Times / New Times Broward-Palm Beach, WLRN) ≈ 95 citations; travel/
  national editorial (Infatuation ≈ 85, Time Out ≈ 70, Fodor's 8, Lonely Planet 3, AFAR 1); tourism boards (GMCVB ≈ 40, Visit Lauderdale
  ≈ 15); institutions (NPS 4 lone; Wikipedia ≈ 40 as 2nd source / coords); creators: 2 creator queries, 1 creator-corroborated pick
  (Caribbean Delite via NT's influencer hidden-gem roundup) — creators remain a thin channel for Miami (no YouTube episode surfaced).
- **Gates (final build):** sourcecheck 509 PASS · geocheck PASS · statuscheck CONSISTENT (1 closed on page, 0 unchecked) · buildcheck PASS ·
  `npm run validate` DATA OK · `npm test` ALL PASS. Hub card, CITIES.md row, AGENT-PROMPTS run-log row and RESUME (next-wave plan) updated.

## 2026-10-03 (session 5 · wave 4 PINS) · batch 1 — Apple Maps place pins + closure audit
- **New geocoding channel (works where google.com/mapcarta/latlong fail):** `WebSearch` with `allowed_domains:["maps.apple.com"]`
  and a query of 3 "Name street-address" items returns Apple Maps place URLs; ~45% of them embed the place pin as
  `coordinate=<lat>,<lng>` (or `ll=` on `q=…&auid=` listings). That value is Apple's own place-pin coordinate for the named
  listing at the stated address → graded **high** (address in the URL checked against our record each time). Listings that
  come back as bare `place-id=` URLs carry no coordinate and re-querying them (ZIP, exact title phrasing) did not help → left
  UNVERIFIED. Helper: `_miami_pin.py` (asserts name ∈ dataset, not already pinned, bbox). Output: `geo/_geoout_x1.json`.
- **Pins (49):** 45 high + Double Luck **med** (same-address pin of predecessor tenant New Schnitzel House, 1085 NE 79th St) + 4
  sights (Rubell Museum, ICA Miami, Museum of Graffiti — high; were on the session-3 UNVERIFIED list). Status for each pin: Apple
  listing active with current hours/no closure marker + 2025–26 discovery sources.
- **Closure audit (6 newly CLOSED, flagged not deleted — `geo/_geoout_x1s.json`):** Itamae AO (final service 2 Aug 2025 — NT +
  Wikipedia), Gramps (closed 4 Jan 2026 — Axios + NT; Gramps Getaway stays open), Wynwood Brewing Company (2024 — Axios), J. Wakefield
  Brewing (28 Oct 2024 — NT; Untappd venue closed), Baby Jane (30 May 2026 — NT/What Now), Havana Harry's (City of Coral Gables ordered
  it closed indefinitely Sep 2025 after the June 2025 DBPR shutdown; no reopening found → treated as closed). All were un-pinned, so
  none had been shown on the map; statuscheck CONSISTENT.
- **Held for a status re-check (Apple shows a closure marker; not pinned):** Taquiza (1351 Collins listing "permanently closed"),
  Lutong Pinoy ("permanently closed"), Knaus Berry Farm (one listing "permanently closed" — probably a stale duplicate of the seasonal
  farm), Havana Café of the Everglades ("temporarily closed"). Papi Steak closed temporarily Sep 2025 for a makeover (reopening Nov
  2025) — re-check before pinning.
- **Build:** 136 → 185 pinned. sourcecheck 509 PASS · geocheck PASS · statuscheck CONSISTENT (0 unchecked) · buildcheck PASS · validate
  DATA OK · npm test ALL PASS.

## 2026-10-03 (session 5 · wave 4 PINS) · batch 2 — Apple Maps pins, tier-1 first
- **Pins (44, `geo/_geoout_x2.json`):** 41 high + 2 med (Laspada's — Apple lists 233 Commercial Blvd, our sources 4346 Seagrape Dr = same
  corner storefront; Bar Kaiju — pin of host building The Citadel, 8300 NE 2nd Ave) + Little Haiti Cultural Complex (sight; was UNVERIFIED).
  Lesson: "Name + neighbourhood" queries (no street number) return coordinate-bearing Apple URLs as often as full-address ones, so
  vague-address records are pinnable too; each URL's own address was checked against the record (rejected: Pack Supermarket's
  15327 NW 7th Ave branch, Drinking Pig's 845 NE 151st St listing — different branches).
- **Closures / moves (`geo/_geoout_x2s.json`):** Jaguar Sun CLOSED (Aug 2024 — Axios + NT; Apple "permanently closed"). Knaus Berry Farm
  MOVED: sold 2025, reopened 22 Dec 2025 at 16790 SW 177th Ave (WLRN, Florida Rambler, NT) — FOOD_F5 address + blurb corrected; old site
  closed; not yet pinned at the new farm.
- **Held, status unresolved (Apple shows a closure marker, no press found):** Kush (Wynwood, 2003 N Miami Ave), Taquiza (1351 Collins),
  Lutong Pinoy (17048 W Dixie Hwy). Two Chefs (South Miami): no Apple listing found → re-check. Havana Café of the Everglades: Apple
  "temporarily closed".
- **Build:** 185 → 229 pinned; sourcecheck/geocheck PASS · statuscheck CONSISTENT · buildcheck PASS · validate DATA OK · npm test ALL PASS.

## 2026-10-03 (session 5 · wave 4 PINS) · batch 3 — long tail
- **Pins (26, `geo/_geoout_x3.json`):** 25 food (CGCG 11 incl. Chug's Diner t1; SDADE 5; NMIA 3; LHAV 3; FTL 3; WYN 2) + Calle Ocho Walk of
  Fame (**med** — Apple point on a linear sidewalk feature). Sights generally come back from Apple as bare place-ids (0/9 in two
  sight-only queries: Black Police Precinct, Ichimura garden, Superblue, Broward Center, Jungle Queen, Young At Art, Clyde Butcher,
  Skunk Ape, Miccosukee Village) → left UNVERIFIED.
- **Rejected mismatches:** Midorie (Apple's only listing is 851 NE 79th St, Upper East Side — our sources put it in Coconut Grove; held
  for an address re-check), Piman Bouk (Apple coordinate is the *bakery* at 46 NE 62nd St, not the restaurant at 5921 NE 2nd Ave),
  Versailles Bakery (only the restaurant's pin surfaced).
- **Status leads (not changed — no press confirmation yet):** Sapore di Mare (one Apple listing "permanently closed"), Golden Rule Seafood
  and Chefs on the Run (no Apple listing).
- **Build:** 229 → 255 pinned; 4 gates + validate + npm test green.

## 2026-10-03 (session 5 · wave 4 PINS) · batch 4 + wave close
- **Pins (6, `geo/_geoout_x4.json`):** retries of bare-place-id listings with re-phrased queries (cuisine/descriptor added) surfaced the
  coordinate variant for Broken Shaker, Yambo, Tropical Chinese, Frankie's Pizza, The Katherine; + Fritanga Caña Brava (2795 NW 7th St).
- **Status checks:** Funky Buddha (Oakland Park) — no closure found, listing active Nov 2025 → stays open (unpinned). Tropical Acres — only the
  2011 fire / 2012 reopening surfaced, no closure → stays open (unpinned).
- **Session 5 totals:** 136 → **261 pinned** (+125: 120 food, 5 sights incl. Rubell, ICA, Museum of Graffiti, Little Haiti Cultural Complex,
  Calle Ocho Walk of Fame). On-page confidence: 213 high · 46 med · 2 low. 7 newly CLOSED flagged (none had been on the map), Knaus Berry
  Farm address corrected. ≈150 WebSearch calls (≈130 geocoding at maps.apple.com, ≈12 closure/status, ≈8 probes of other channels —
  google.com `!3d!4d`, mapcarta, latlong/findlatitudeandlongitude, untappd: none returned usable restaurant pins).
- **Gates (final build):** sourcecheck 509 PASS · geocheck PASS · statuscheck CONSISTENT (0 unchecked) · buildcheck PASS · validate DATA OK ·
  npm test ALL PASS. Hub card, CITIES.md row, AGENT-PROMPTS run-log row and RESUME next-wave plan updated.

## 2026-10-03 (session 5) · batch 5 — orchestrator resume
- **Pin +1:** CY Chinese Restaurant (1242 NE 163rd St, Apple place pin; `geo/_geoout_x5.json`).
- **Pin withdrawn:** Cotoa — the same Apple place-id now resolves to 100 Biscayne Blvd (The B100M, downtown) as well as 12475 NE 6th Ct;
  Miami New Times (B100M opening) puts Cotoa downtown and the Michelin listing shows "temporarily closed". Row removed from `_geoout_x2.json`,
  registry entry reset to UNVERIFIED (`geo/_geoout_x5s.json`); re-check location + status before re-pinning (area may be DTB, not NMIA).
- 3 more retry queries (Steve's Pizza, Panya Thai, Perl, Farofa, Basilic, Chéen-Huaye, Shiver's, Fox's Lounge, Redland Market Village) gave
  only bare place-ids — the long tail is now ~0.3 pins/search with this channel. Net pinned: 261. Gates + validate + test green.

## 2026-10-03 (W6 · PINS ONLY, session_01847XyVQRMAQiVAHDWpaEmS) · batch A
- **Channel switch:** Apple bare-place-id retries were ~0.3 pins/search, so this wave uses the **aggregator technique**: one place per
  WebSearch, `"<Name> <street address> <city> GPS coordinates"` with `allowed_domains` restaurantguru / wanderlog / sirved / restaurantji /
  menupix (listing lat/lng → `med`); Waze place records → `high` (Zak the Baker). Each point checked against the street address/cross-street.
  For records with only a neighbourhood ("North Miami, FL"), the listing's street address is recorded in the geo row (`note`).
  Writer: `_pinw.py miami-fl <tag>` (refuses unknown/pinned names, out-of-bbox points; never flips a CLOSED status).
- **+29 pins** (`geo/_geoout_w6a.json`): Zak the Baker, Chez Le Bebe, Cvi.che 105, Ricky Bakery Coral Way, El Turco, Heritage, Tropical
  Acres, Anthony's Runway 84, Funky Buddha, La Carreta (3632 SW 8th St), Mama Tried, Soya e Pomodoro, The Corner, Georgia Pig, Casa Sensei,
  Coconuts, Lester's Diner, Evelyn's, S3, Knaus Berry Farm (new farm, 16790 SW 177th Ave), Shiver's BBQ, Fox's Lounge, Redland Market
  Village, Apocalypse BBQ (8695 SW 124th Ave), Black Point Ocean Grill, Captain Jim's, Steve's Pizza, Perl by Chef IP, Cafe Prima Pasta.
- **Address corrections (listing-proven):** Georgia Pig BBQ → **1285 S State Rd 7** (record said "W State Road 84"); Captain Jim's → 12950 W
  Dixie Hwy; Steve's Pizza → 12101 Biscayne Blvd; Perl → 2420 NE 186th St; Black Point Ocean Grill → 24775 SW 87th Ave.
- **Not pinned / leads:**
  - Fireman Derek's: aggregator coordinate is the Coconut Grove shop (3435 Main Hwy), not Wynwood — not pinned (area/address mismatch).
  - El Brazo Fuerte: search summary offered only an 'approximate' geocode — rejected.
  - The Floridian: aggregator coordinate tied to 1492 E Las Olas vs record 1410 — not pinned (address mismatch).
  - Taquiza: aggregator says 1351 Collins Ave is now Coyote Taqueria (Taquiza 'permanently closed' there); its coordinate pointed to North Beach (25.8605) — not pinned; STATUS LEAD: verify closure of the South Beach shop.
  - Panya Thai: listing gives 520 NE 167th St, Miami 33162 but no coordinate.
- **Build:** 261 → **290 on map**. sourcecheck PASS 509 · geocheck PASS · statuscheck CONSISTENT · buildcheck PASS · validate DATA OK · npm test ALL PASS.

## 2026-10-03 (W6 · PINS ONLY) · batch B
- **+25 pins** (`geo/_geoout_w6b.json`): Monty's Raw Bar, LoKal, Farofa, Katana, Zaika, Casablanca Café, Milly's Empanada Factory, Papi Steak
  (listing active after the 2025 makeover), CJ's Crab Shack, Lutong Pinoy (listing active — clears the W5 status lead), Basilic, Hole in the
  Wall, Plaza Seafood Market, The Pit Bar-B-Q, Royal Palm Grill, Everglades Gator Grill, Chéen-Huaye, Etzel Itzik, Jamrock Cuisine (listings
  split 12560 vs 12618 N Kendall Dr, same strip → med), Mimi's Ravioli, Dolce Salato, Gilbert's Bakery (5777 Bird Rd = SW 40th St),
  Loretta & The Butcher, Chayhana Oasis, Breadman Bakery.
- **No coordinate surfaced:** Le Bouchon du Grove, Biscayne Bay Brewing, Ukiah, Julia & Henry's, Topkapi (Hürrem Hammam).
- **Build:** 290 → **315 on map**. 4 gates PASS/CONSISTENT · validate DATA OK · npm test ALL PASS.
