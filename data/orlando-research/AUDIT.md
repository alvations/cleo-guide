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
