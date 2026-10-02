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
