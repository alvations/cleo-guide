# Orlando & Central Florida — AUDIT (append-only ledger)

## 2026-10-02 · Stage 0 — Scope & taxonomy
- Region: Orlando metro + Walt Disney World (per park) + Universal Orlando (per park incl. Epic Universe,
  opened May 2025) + Kissimmee/Celebration + West Orange + Seminole/Lake (Sanford, Mount Dora, springs) +
  East Orlando/UCF + the Space Coast (KSC, Cocoa Beach). 18 areas (see consolidate.py) — theme parks split
  per park so each park's tiers are graded within itself and its filter is useful; city neighbourhoods
  split along how visitors actually move (Downtown/Thornton Park vs the Mills 50 Vietnamese corridor vs
  Winter Park vs I-Drive/Restaurant Row).
- Cuisine taxonomy: theme-park signature eats are their own layer (`PARK`); Vietnamese (Mills 50),
  Puerto Rican and Cuban are first-class because they are the city-unique canon; `FINE` holds the
  Michelin-starred tasting counters; `FLA` holds Florida-specific flavors (gator, citrus, key lime).
- Collections: theme-park rides/attractions and shows separate from Space & Science, springs/nature and
  wildlife — the four things a Central-Florida visitor filters for.

## 2026-10-02 · Stage 1 — Source discovery (W1, partial)
- Registered 22 outlets (SOURCES_CORE.json → data/sources.json `orlando-fl`) with credible rationale:
  Michelin, James Beard, Orlando Sentinel, Orlando Weekly, Orlando Magazine, Eater, WMFE, Visit Orlando,
  Tasty Chomps, NASA, NPS, Florida State Parks, Wikipedia, OFFICIAL (counts once), Atlas Obscura, Theme Park
  Insider, Disney Food Blog, Inside the Magic, WFTV, News 6, Spectrum News 13, WESH.
- Searches run (8): Michelin 2025 Orlando list; Michelin 2026 Orlando; 2026 star changes; Space Mountain
  coords; 3 restaurant geocode probes (Bánh Mì Boy ×2, Domu). Findings → `_PENDING_LEADS.md`.
- Channel mix this wave: editorial/institutional 4 searches (Michelin via Tasty Chomps, WFTV, Visit Orlando,
  Prevue); creators 0; travel sites 0; local 0 — wave cut off before the §2a creator/travel/local passes.
- STOP: session WebSearch budget exhausted (200/200, shared). No places extracted; nothing fabricated.

## 2026-10-02 · Session 2 · W1 MICHELIN (completed) + W3a DISNEY PARKS (sights)
- Searches this session so far: 18 (Michelin list/addresses ×6, restaurant-geocode probes ×3, park coordinates ×6, misc).
- **W1 food → `FOOD_MICHELIN.json` (20)**: 2★ Sorekara; 1★ Camille, Kadence, ÔMO by Jônt, Soseki, Victoria & Albert's;
  14 Bibs (Ravenous Pig, Smokemade, Bánh Mì Boy, Bombay Street Kitchen, Coro, Domu, Isan Zaap, Norigami, Otto's
  High Dive, The Strand, Sushi Saint, Taste of Chengdu, UniGirl, Zaru). Sources: MICHELIN (lone authority) +
  Orlando Weekly/Visit Orlando (stars), ClickOrlando/WFTV (Bibs, with street addresses), Infatuation, Wikipedia (Otto's).
  Dishes: only the Michelin cuisine label / named format (udon, onigiri, bánh mì, omakase) — nothing from memory.
- **Geocode reality**: Apple Maps (place-id URLs only), latlong/mapcarta and plain address queries return NO decimals
  for restaurants → all 20 Michelin places written UNVERIFIED with address to `geo/_geoout_michelin.json` for the
  browser geocode-helper. Decision: spend the search budget on places with published coordinates (Wikipedia) for
  pins, and keep collecting food with addresses (helper backlog).
- **W3a sights → `SIGHTS_PARKS1.json` (22)**: MK 6, EPCOT 6, DHS 4, DAK 6. Sources WIKIPEDIA + OFFICIAL/AllEars/
  Frommer's/DisneyBlog. Pins (Wikipedia published coords via search) 15 high; UNVERIFIED 7 (Haunted Mansion, Test
  Track, Frozen Ever After, Remy, Rise of the Resistance, Tree of Life — no coord surfaced; Slinky Dog Dash —
  summary returned Rock 'n' Roller Coaster's exact coordinate → rejected as a summariser error).
- Closure: Dinosaur (DAK) closed 2026-02-02 per Wikipedia → kept flagged `Dinosaur — CLOSED`.
- Channel mix: institutional 1 (Michelin) · editorial 5 · travel 1 (Frommer's) · creators/fan sites 2 (AllEars, DisneyBlog).

## 2026-10-02 · Session 2 · W3b UNIVERSAL + W4 CITY/NATURE/SPACE sights (+ pin-pass agent)
- Searches: main 13 more (cumulative ~31) + background pin-pass agent 9 → ~40 total this session.
- `SIGHTS_PARKS2.json` (14): USF 3, IOA 5, Epic 6 — WIKIPEDIA + Theme Park Insider/Attractions Magazine (Epic,
  all-11 ranking), TravelPulse, Never Ending Voyage, Orlando Informer.
- Pin-pass agent → `geo/_geoout_parkpins1.json`: 15/15 previously-UNVERIFIED attractions resolved (13 high, 2 med:
  Frozen Ever After, Rise of the Resistance) from Coasterpedia/Wikipedia published coords; all inside per-park
  sanity boxes, all distinct (Slinky Dog Dash no longer shares RnRC's point). Addresses normalised to research records.
- `SIGHTS_CITY1.json` (16: Downtown/Loch Haven/Winter Park/Maitland/Eatonville) — Wikipedia coords + Visit Orlando
  museums page, Time Out, City of Winter Park '25 things', Fathom, VISIT FLORIDA, Orlando Weekly.
  LESSON: street addresses only when a search result printed them; otherwise a sourced locality ("Loch Haven Park,
  Orlando") — 10 memory-typed street addresses were replaced before commit.
- `SIGHTS_NATURE1.json` (6 springs/Sanford/Mount Dora), `SIGHTS_SPACE1.json` (7), `SIGHTS_KISS1.json` (2).
- HELD single-source (build drops): Mount Dora Historic District, Central Florida Zoo, Cocoa Beach Pier, Old Town Kissimmee.
- Channel mix: institutional 1 (NPS) · editorial 3 · travel 8 (Time Out, NatGeo, Lonely Planet, Fathom, Frommer's,
  TravelPulse, TravelMole, Florida Guidebook) · creators 4 (Never Ending Voyage, Orlando Informer, Miss Tourist, Attractions Mag YT) · official 2.

## 2026-10-02 · Session 2 · W5 (Disney batch 2, Universal batch 2, SeaWorld, resorts, Kissimmee, Winter Garden, park eats, Mills 50 VN)
- Searches: main ≈ 75 cumulative; pin-pass agents 9 + 15 + 16 = 40 → ≈ 115 this session.
- Pin-pass agents: `_geoout_parkpins2.json` 40/44 Disney places (Wikipedia/Wikidata/latitude.to; med: Peter Pan's
  Flight, Mad Tea Party (lat published as 28.42), Festival of the Lion King, Coronado Springs); rejected Hall of
  Presidents (2-decimal Wikidata point in Fantasyland), Journey of Water, Smugglers Run (land coord only).
  `_geoout_parkpins3.json` 27/39 Universal/SeaWorld/downtown (rejected Jurassic Park River Adventure "approximate" point).
  Closures seen: Wet 'n Wild Orlando (closed 2017, not added); Fast & Furious – Supercharged (closed Aug 2026, not added).
- New research: `SIGHTS_PARKS3` (30 MK/EPCOT/DHS/DAK — WIKIPEDIA + AllEars park pages + Frommer's), `SIGHTS_RESORTS1`
  (9 — CNN Travel / U.S. News via Disney Food Blog / AllEars hotel rankings; SmarterTravel water parks), `SIGHTS_PARKS4`
  (10 Universal — Frommer's attraction pages), `SIGHTS_SEAWORLD1` (5 coasters — Laughing Place + Orlando Informer),
  `SIGHTS_KISS1` (+5, Experience Kissimmee official + SheBuysTravel), `SIGHTS_WEST1` (2, VISIT FLORIDA),
  `FOOD_PARKEATS1` (8: Aloha Isle Dole Whip, Three Broomsticks Butterbeer, Ronto Roasters, Kringla Bakeri School
  Bread, Be Our Guest, Space 220, Sci-Fi Dine-In, 50's Prime Time — Time Out, DFB, TouringPlans, Food Network, Wikipedia;
  3 pinned from Wikipedia), `FOOD_VN1` (4: Viet-Nomz, Pho 88, Anh Hong — OW Best Pho 2025 1-2-3 — + Mills Market).
- Victoria & Albert's pinned (Wikipedia 28.4111836,-81.5874135).
- HELD single-source (build drops): Disney Springs, Race Through New York, CityWalk, Osceola County Courthouse,
  Gaylord Palms, Central Florida Zoo, Cocoa Beach Pier. Held food leads → `_PENDING_LEADS.md`.
- Channel mix (this wave): creators/fan sites 6 (AllEars, DFB, TouringPlans, Laughing Place, Orlando Informer, MickeyBlog,
  SheBuysTravel) · travel 5 (Frommer's, CNN Travel, SmarterTravel, Time Out, Food Network) · official 2 · editorial 1.

## 2026-10-02 · Session 2 · W6 (downtown venues, Michelin Recommended, James Beard, DDD, creator probe)
- Searches main ≈ 64 cumulative (+40 agents). `SIGHTS_DTO1` (8 downtown venues; Wikipedia coords from pin-pass 3 +
  Brit on the Move / Atlas Obscura / Florida Citrus Sports official; 5 held single-source: Kia Center, Inter&Co, Greenwood
  Cemetery, Dr. Phillips House). Leu Gardens + Atlas Obscura.
- `FOOD_MICHELINREC` (12 MICHELIN Recommended: Four Flamingos, Knife & Spoon, Morimoto Asia, Pizza Bruno, Prato, Citricos,
  + the 6 new 2026 picks) — MICHELIN + Visit Orlando + Bungalower/Tasty Chomps. Street addresses not surfaced → locality only.
- `FOOD_JBF1` (Kaya — Lalicon 2025 JBF Best Chef South semifinalist; Reyes Mezcaleria — Wendy Lopez 2026 semifinalist);
  JAMESBEARD added to Domu (Sonny Nguyen 2025), ÔMO (2025 Best New Restaurant finalist), Sparrow (Lopez 2026).
- `FOOD_DDD1` (Willie's Pinchos — Puerto Rican mofongo, DDD S26E11; Se7en Bites — DDD S26E10): FOX 35 + Orlando Weekly.
  Status NOT re-checked since the 2017 feature → flagged for the closure pass.
- Creator probe ("Orlando food tour YouTube Mark Wiens / Best Ever Food Review / Sonny Side"): no findable Orlando video
  surfaced → dead end recorded; DDD (Food Network TV) used as the creator/TV channel this wave.

## 2026-10-02 · Session 2 · W7 (pin-pass 4: oddities, Epic rest, Space Coast, north springs)
- Pin-pass agent 4 (16 searches) → `_geoout_pinpass4.json` 27/30 (Atlas Obscura place pages, Coasterpedia, Wikipedia,
  hmdb, USFS). Closures: Skeletons: Museum of Osteology (closed, Atlas Obscura); Singing Runway (grooves removed 2008);
  Exploration Tower (Port Canaveral) not reopened as of Jan 2026 per Wikipedia → none added as pins.
- Research: `SIGHTS_EPIC2` (5 → all 11 Epic rides now in), `SIGHTS_SPACE2` (5: Apollo/Saturn V Center, Ron Jon, Brevard
  Zoo, Space View Park, Jetty Park), `SIGHTS_NATURE2` (Cassadaga — Bungalower + Victor Block; Hontoon Island — reopened
  Oct 20 after 3-year closure), `SIGHTS_CITY2` (Kerouac House + 4 Atlas-Obscura-only oddities HELD single-source).
- Re-verify catch: Cocoa Beach Pier's coordinate was identical to Ron Jon Surf Shop's Wikipedia point → pier set UNVERIFIED.
- Status: 79 agent pin records had empty statusSource and sorted after the research geo files (last-write-wins) → patched
  to carry the research record's status source; statuscheck CONSISTENT.
- Main searches ≈ 68; agents 56 → ≈ 124 this session.

## 2026-10-02 · Session 2 · W8 (food pins, local eats, closure checks) + CLOSE-OUT
- Food-pin agent (12 searches): 2/42 resolved — Otto's High Dive (Wikipedia 28.5460,-81.3526), Old Spanish Sugar Mill
  (HMDB marker beside the mill, med). All WDW/Universal restaurants: only land/park centroids published → rejected.
- `FOOD_LOCAL1` (Black Bean Deli — OW Best Cuban Sandwich 2023/2025 + Infatuation + WFTV; Pig Floyd's — OW/Spectrum
  News 13/Scott Joseph; East End Market — ClickOrlando + official; Ethos Vegan Kitchen — CLOSED 2024 (WFTV/OW);
  Old Spanish Sugar Mill), `FOOD_UNIEATS1` (Mythos, Krusty Burger — TouringPlans 2025 awards + Tasting Table).
- Status: Se7en Bites confirmed open 2026 (Tasty Chomps Mar 2026), now 617 N Primrose Dr, also in the MICHELIN Guide.
  Willie's Pinchos — no 2026 confirmation found (status note kept).
- Disney Springs + CityWalk corroborated (Orlando Informer + TouringPlans comparison).
- Dead ends: Oviedo/EAST (only SEO listicles), Maitland/Winter Park nature coords (Mead Garden/Audubon Birds of Prey —
  no attributable coordinate), PR restaurant list (one credible source only).
- FINAL this session: 208 researched (153 sights + 55 food); page 136 sights + 6 food; 52 UNVERIFIED held for the helper;
  14 single-source held; 2 closed flagged. Gates: sourcecheck (held only) / geocheck PASS / statuscheck CONSISTENT /
  buildcheck PASS; npm validate DATA OK; npm test ALL PASS. Searches ≈ 79 main + ≈ 84 agents ≈ 163.

## 2026-10-02 · Session 3 · §2b FOOD & DRINK FIRST (lead + 4 background discovery workers)
- **Searches:** 200/200 session cap reached (lead ≈ 45; workers S3PR 27, S3BAR ≈ 45, S3PARK ≈ 27, S3CITY ≈ 35). Hard cap, not a rate limit.
- **Added 76 food & drink places** (+0 sights): S3BAR 21 (breweries, cocktail/dive bars, coffee roasters, bakeries — OW Best of
  Orlando 2026 winners: Ivanhoe Park Brewing, The Moderne, Hideaway Bar, Glass Knife, Jeff's Bagel Run; Sentinel Central FL Favorites:
  Brewlando), S3PARK 18 (Disney Springs/EPCOT/DAK/MK/USF/Epic dining & snack icons — OW 2025 Best Theme Park Restaurant, Sentinel 2025
  Foodie Awards via DisneyBizJournal, Food Network, TouringPlans, DFB), S3CITY 14 (OW 2026 neighbourhood winners, Michelin Recommended
  Kabooki/Luke's/AVA, Mills 50 essentials), S3PR 9 (Kissimmee Puerto Rican/Cuban/Latin + Lake Nona Wave Hotel Michelin), lead 14
  (S3SPACE Dixie Crossroads, River Rocks; S3NORTH Pisces Rising, Goblin Market, Black Hammock, Hollerbach's, Yellow Dog Eats, Chef's
  Table at the Edgewater; S3IDR A Land Remembered, Norman's; S3LOCAL Beefy King, Linda's La Cantina; S3MICH Capa (Michelin Recommended
  2026, ex-star), Papa Llama — CLOSED (2× Michelin star; OW closure Sept 2026)).
- **Corroborated held sights:** Kia Center, Inter&Co Stadium (Visit Orlando downtown itinerary), Greenwood Cemetery (News 6),
  Lake Nona Sculpture Garden (Visit Orlando), Central Florida Zoo (AAA). Single-source now 9 (build drops them).
- **Channel mix (citations):** editorial/press ≈ 120 (Orlando Weekly incl. Best of Orlando polls, Scott Joseph, Tasty Chomps,
  Infatuation, Time Out, Food Network, Frommer's, Roadfood, Florida Rambler, Space Coast Living, Orange Observer); local TV ≈ 20
  (FOX 35, WFTV, News 6, Spectrum 13); institutional Michelin ≈ 8; tourism ≈ 10 (Visit Orlando, Experience Kissimmee, Visit
  Florida, AAA); creators 4 (@somehowimnotfat via FOX 35 — 61k IG; Burger Beast); Disney/Universal fan press ≈ 25 (DFB, TouringPlans,
  AllEars, MickeyBlog, WDWInfo, WDWMagic-open-check only). Creator queries returned mostly SEO pages — no TikTok/YouTube creator
  vetted this session.
- **New outlets registered (with credible rationale):** SPACECOASTLIVING, ROADFOOD, FLORIDARAMBLER, AAA, LIFEINLAKE, ORANGEOBSERVER,
  SOMEHOWIMNOTFAT, FOX35, BURGERBEAST, WUSF, WINTERPARKMAG, DAILYCOFFEENEWS, SANFORDHERALD, DAYTONABEACHCVB, WDWINFO, WDWMAGIC,
  DISNEYBIZJOURNAL. **Weak-source note:** DISNEYBIZJOURNAL (Substack) is the only reachable report of the Sentinel 2025 Foodie
  Awards (orlandosentinel.com doesn't surface); Via Napoli, Takumi-Tei, Spice Road Table rest on Food Network + it → re-corroborate
  next wave. The Moderne's Tasty Chomps citation and Kōri Bakery's boba award came from summaries (tier 2 / caveat in `w`).
- **Memory hygiene:** lead caught and stripped 3 from-memory details before commit (an Edgewater street number, a Rosen Shingle
  Creek street number, a Norman's signature dish) — only source-shown facts kept.
- **Closures:** Papa Llama (kept, flagged). Seen, not added: Deadwords Brewing (closed Apr 2024), Persimmon Hollow Lake Eola
  taproom (May 2024), Downtown Credo Rollins St (2023), Finnegan's USF (temporary refurb to late 2026). Moved: The Courtesy →
  1288 N Orange Ave Winter Park; Austin's Coffee → 2240 W Fairbanks; Hideaway → 523 Virginia Dr.
- **Geocode:** all 76 new restaurants UNVERIFIED (no place-pin decimals surfaced) → `tools/geocode-helper.html`.
- **Build:** rebuild-city --build OK; sourcecheck FAIL only on 9 HELD single-source (dropped by build), geocheck PASS,
  statuscheck CONSISTENT; npm validate DATA OK; npm test ALL PASS. Page: 141 sights + 6 food pinned; 284 researched.
- **Density / food share:** 131 food / 284 = **46%** (was 26%). Held leads in `_PENDING_LEADS.md` (Session 3 section).

## 2026-10-03 · Session 4 · Wave 3 — lead pin pass (batch 1)
- Repo sync: the local clone had an unrelated pre-rewrite history; reset the working branch to `origin/claude/peaceful-goodall-i0hsrt`
  (local ref kept as `backup-local-d44bb88`; no local work lost — tree was clean).
- **Building-level pins (0 searches)** → `geo/_geoout_w3bldg.json` (med): Kringla Bakeri (Norway Pavilion), Le Cellier (Canada),
  Via Napoli (Italy), Takumi-Tei (Japan), Spice Road Table (Morocco), Citricos (Grand Floridian) — host-building Wikipedia coords
  already in the registry (SF Ferry Building precedent). Land/park/district centroids (Disney Springs, Hogsmeade, Diagon Alley) still rejected.
- **Searched pins** (13 searches) → `geo/_geoout_w3pin.json`: Wikipedia published coords for Sorekara, Kadence, Camille, Capa,
  Soseki, Knife & Spoon, Papa Llama — CLOSED, 50's Prime Time Café, Kraft Azalea Park (high); Downtown Winter Park Historic District
  for Park Avenue (med); Rosen Shingle Creek hotel coords for A Land Remembered (med, building-level). Low (aggregator decimals,
  source page not individually attributable → re-verify): Chef's Table at the Edgewater (Edgewater Hotel), East End Market + Lineage
  + Domu (3201 Corrine Dr), Four Flamingos (Hyatt Regency Grand Cypress).
- **Re-verify catch:** the Cocoa Beach Pier decimal returned again (28.320221,-80.608871) is identical to Ron Jon Surf Shop's →
  rejected again; pier stays UNVERIFIED. Four Seasons aggregator decimal superseded by Capa's own Wikipedia coord.
- Dead end: ordinary street-address restaurants (Dixie Crossroads test) — WebSearch returns no place-pin decimal; keep for helper.
- **Status:** Mythos (IOA) — open; Universal announced (May 2026; DFB, FOX 35, BlogMickey) it closes in 2027 with the Lost Continent →
  note added to card + FOX35 source. Thunder Falls Terrace (IOA) closed summer 2026 for a 2027 replacement (told W3D).
- Build: page 144 sights + 26 food (was 141 + 6); gates sourcecheck (9 held single-source only) / geocheck PASS / statuscheck
  CONSISTENT / buildcheck PASS; npm validate DATA OK, npm test ALL PASS.

## 2026-10-03 · Session 4 · Wave 3 — discovery (4 background workers + lead) + build
- **Searches:** lead ≈ 29 (pins + 3 corroborations + 1 Boma dish) · W3A 34 · W3B 35 · W3C 39 · W3D 39 → ≈ 176 of the session cap.
- **Added 106 places** (research 284 → 390): W3A 28 (IDR 10, DSP 14, CWALK 5 — Raglan Road, Homecomin', Polite Pig, Toledo, Sanaa, Jiko,
  Boma, Toothsome, Bigfire, Strong Water, Twenty Pho Hour, YH Seafood Clubhouse, Nile Ethiopian, Susuru; ICON Park, Discovery Cove,
  Aquatica, WonderWorks, Drawn to Life, Aerophile, Skyliner) · W3B 21 (DTO 6, MILLS 9, WPK 6 — Z Asian Bib, Zymarium, Black Rooster,
  EDOBOY, Sticky Rice, Shin Jung, Tori Tori (lone Michelin listing), Francesco's, The Monroe, Kres; Enzian, Birds of Prey, Annie
  Russell, Hannibal Square, Mead Garden, Milk District) · W3C 20 (SPRNG/WEST/EAST/SPACE/KISS — Old Jailhouse, Tennessee Truffle,
  Wondermade, Copacabana, Olive Branch, Market to Table, Guavate, Las Carretas, Florida's Fresh Grill, Grills, Ossorio; Boggy Creek,
  Fun Spot Kissimmee, Shingle Creek, Plant Street Market, Citrus Tower, Lake Apopka Wildlife Drive, Fort Christmas, Little Big Econ,
  Cocoa Village Playhouse) · W3D 35 park food & drink (MK 7, DAK 6, EPCOT 5, DHS 5, EPIC 5, USF 4, IOA 3) · lead W3L 2 (Fun Spot
  America Orlando — Frommer's/Orlando Informer/Attractions Mag; Alexander Springs — Florida Guidebook/OW/USFS; both pins pre-existed).
- **Channel mix (citations):** theme-park editorial/creators ≈ 95 (DFB, TouringPlans, AllEars, Orlando Informer, WDWNT, Laughing Place,
  Theme Park Insider, Disney Tourist Blog); local press & food writers ≈ 75 (Orlando Weekly incl. Best of Orlando, Scott Joseph, Tasty
  Chomps, Orlando Magazine, Space Coast Living, FOX 35, ClickOrlando, Spectrum, WFTV); travel ≈ 30 (Frommer's, Fodor's, Infatuation,
  Time Out, Visit Orlando/Florida, Experience Kissimmee, Florida Guidebook); institutional ≈ 20 (Michelin, Wikipedia, USFS, SJRWMD, FWC,
  Osceola County). **Creators vetted:** Disney Food Blog (AJ Wolfe, ~1M YouTube), WDWNT, Disney Tourist Blog (Tom Bricker),
  @somehowimnotfat (via FOX 35) → CREATORS_W3A/W3D.json. Creator queries for Mills 50 / Winter Park / Kissimmee / Space Coast TikTok &
  YouTube surfaced no verifiable creator (rejected: ziggyknowsdisney, disneyparknerds, mickeyvisit, benable, undercovertourist).
- **New outlets:** DISNEYTOURISTBLOG, WDWNT, THEPOINTSGUY, FODORS, FLBIRDINGTRAIL, CLIO, PREVUE, WHATNOW (status only), TRIANGLESUN,
  RCDB, FWC, MYSANFORDMAG (each with `credible` rationale in SOURCES_W3*.json).
- **MEASURED & DROPPED:** Roundup Rodeo BBQ (value complaints — AllEars/Kenny the Pirate), Paddlefish (TouringPlans 6.7/10, mixed),
  Teppan Edo (mixed), Comic Strip Cafe / Circus McGurkus (ratings only), Neighbors Artisan Taqueria (no credible outlet), Jinya (chain).
- **Held single-source** (next wave, one search each): The Chapman, Luma on Park, Umi, BoVine, Cocina 214, RusTeak, Banh Mi Nha Trang,
  Lazy Moon, Tasty Wok, Tropico Mofongo, Pal Campo, Achiote, Chimiking, Sofrito, Nona Blue, Park Pizza & Brewing, Wa Ramen, Hook and
  Eagle, Fishlips, Medieval Times (Sentinel Foodie 2016 via WDWInfo/ticket sites only), Caribbean Sunshine Bakery, Taco Norteño,
  Breezeway, Shantell's, Fuel BBQ, Gator's Riverside, Stefano's, Tabla, Crazy Cork, Q's Crackin' Crab, Mel's Drive-In, TODAY Cafe,
  Pizza Moon, Oak & Star, Meteor Astropub, Voodoo Doughnut, Bob Marley, Amorette's, The Edison, Pointe Orlando, Seito Sushi, Bull & Bear,
  Taverna Opa, Q'Kenan, Pio Pio, Tapa Toro.
- **Closures / status:** Gringos Locos — CLOSED (all 4 locations, 4 Aug 2026; hoodline) added flagged. Thunder Falls Terrace closed
  2026-07-20 (not added). Finnegan's refurb since 2026-01-12 (not added; re-check). Chayote Barrio Kitchen replaced by The Grove (not
  added). Murdock's Southern Bistro closed (not added). Mythos open, closing 2027 (noted). Shin Jung reopened after fire (re-check),
  Tennessee Truffle open status rests on undated OW list (re-check), Hanamizuki status unknown (held).
- **Geocode (lead, after the workers):** Wikipedia — ICON Park, Discovery Cove, Enzian, Annie Russell, Hannibal Square Heritage Center,
  Woody's Lunch Box (high); building-level med — Jiko + Boma (AK Lodge Jambo House), Toledo (Gran Destino), Garden Grill (The Land),
  Regal Eagle (American Adventure), Rose & Crown (UK), Biergarten (Germany), Cinderella's Royal Table (castle, by W3D); HMDB marker —
  Shingle Creek Regional Park (med); low — WonderWorks (Pointe Orlando point). Rejected: Liberty Square / Plant Street / Lake Apopka /
  Audubon (Maitland) decimals = land/district/lake/city points. Workers: Fun Spot Kissimmee, Citrus Tower, Little Big Econ (med),
  Cocoa Village Playhouse, Mead Garden (med). Restaurants on ordinary streets: still UNVERIFIED (geocode-helper).
- **Fix:** Boma dish was generic → "turkey bobotie, peri peri chicken, zebra domes" (disneyblog.com + Scott Joseph review added).
- **Build:** rebuild-city --build OK — 390 researched (177 sights + 213 food = **54.6% food**), page **157 sights + 35 food** (was 141 + 6);
  sourcecheck FAIL only on the 9 held single-source (dropped by build; 1 lone-authority Michelin) · geocheck PASS · statuscheck
  CONSISTENT · buildcheck PASS · npm validate DATA OK · npm test ALL PASS. Card + CITIES row + AGENT-PROMPTS run log refreshed.

## 2026-10-03 · Session 5 · Wave 4 — step 1: corroborate the 9 single-source (all kept)
- 9 searches. Each held place got a 2nd credible source (`_orl_addsrc.py`): Randall Knife Museum + WIKIPEDIA (Randall Made Knives);
  World's Largest Entertainment McDonald's + ATTRACTIONSMAG + ORLANDOWEEKLY (2016 rebuild/reopen); Global Convergence + WIKIPEDIA
  (See Art Orlando) + BUNGALOWER; Dr. Phillips House + HMDB + CLIO; Osceola County Courthouse + EXPERIENCEKISSIMMEE; Gaylord Palms +
  FROMMERS; Race Through New York + THEMEPARKINSIDER + ORLANDOINFORMER; Space View Park + FOX35 (reopened after repairs) + NPR;
  Cocoa Beach Pier + OFFICIAL (cocoabeachpier.com history — weakest pairing, OFFICIAL counts once; re-corroborate with press next wave).
- New outlets: HMDB, NPR (SOURCES_W4.json, with credible rationale).
- Pin probe (3 searches): Mapcarta (OSM mirror) snippets carry no decimals; Wikipedia queries for Beefy King / Brown Derby / Oga's
  return only park or land centroids (rejected). Confirms the wave-3 dead end — street restaurants stay UNVERIFIED for
  `tools/geocode-helper.html` (189 unpinned: MILLS 37, DTO 17, WPK 17, DSP 16, SPRNG 13, IDR 12, KISS 10, MK 10 …).
- Build: sourcecheck **PASS** (was FAIL on 9) · geocheck PASS · statuscheck CONSISTENT · buildcheck PASS · validate DATA OK · test PASS.
- Status re-checks (3 searches, lead): **Shin Jung** — reopened 2021 after the 2019 fire (Orlando Weekly) and now carries a Michelin Guide
  Florida listing page (guide.michelin.com …/orlando/restaurant/shin-jung) → open; MICHELIN source added. **The Tennessee Truffle** — only
  undated listings (AAA, Tasty Chomps 2019) surfaced; kept, re-check next wave. **Willie's Pinchos** — DDD/Food Network + FOX 35 lists,
  no 2025–26 closure report; kept, re-check next wave.
