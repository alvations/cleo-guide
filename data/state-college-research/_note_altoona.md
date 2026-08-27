# Altoona / Blair County + Alleghenies day-trip belt — discovery note (ALT + REG)

Discovery agent for the two outer areas of the State College guide. WebSearch only (WebFetch blocked).
No coordinates written — addresses include the town for the geocode stage.

## Output files
- `SIGHTS_ALTOONA.json` — 16 sights (9 ALT, 7 REG) + outlet registry
- `FOOD_ALTOONA.json` — 7 food (6 ALT, 1 REG)
- `SOURCES_ALTOONA.json` — outlet registry

## Counts by area + tier

### SIGHTS (16)
**ALT — Altoona & Blair County (9)**
- Tier 1: Horseshoe Curve NHL; Altoona Railroaders Memorial Museum
- Tier 2: Lakemont Park & Leap-the-Dips (NHL coaster, rides closed — see below); Baker Mansion (Blair County Historical Society, NRHP); DelGrosso's Park & Laguna Splash (Tipton); Canoe Creek State Park
- Tier 3: Fort Roberdeau (NRHP); Historic Mishler Theatre (NRHP); Peoples Natural Gas Field / Altoona Curve

**REG — Alleghenies day trips (7)**
- Tier 1: Raystown Lake & Lake Raystown Resort (Huntingdon); East Broad Top Railroad (NHL, Rockhill Furnace)
- Tier 2: Lincoln Caverns & Whisper Rocks (Huntingdon); Trough Creek State Park — Balanced Rock & Rainbow Falls; Greenwood Furnace State Park; Bilger's Rocks (Clearfield Co.)
- Tier 3: Indian Caverns (Spruce Creek) — **CLOSED, kept flagged**

Both areas have their required ≥1 tier-1 must-see.

### FOOD (7)
**ALT (6)**
- Tier 1: Tom & Joe's (diner/hotcakes); Texas Hot Dogs (Greek-chili coney, est. 1918); 29th Street Pizza Subs & More (Altoona-style pizza — the city-unique canon dish)
- Tier 2: Boyer Candy Co. (Mallo Cup); U.S. Hotel Tavern (Hollidaysburg, 1835); The Meadows Frozen Custard (Altoona-born, 1950)

**REG (1)**
- Tier 2: Standing Stone Coffee Company (Huntingdon roaster)

## Food canon logic (start with what's unique)
Altoona's own canon drove the food list: the **Texas hot dog / Greek-chili coney**, **Altoona-style
("Altoona Hotel") pizza** — Sicilian square with salami and green pepper *under* yellow American cheese,
a genuinely city-unique, nationally-covered oddity — the **Mallo Cup** (Boyer, invented in Altoona 1936,
America's first cup candy), and **Meadows frozen custard** (invented in Altoona 1950). Tom & Joe's anchors
the classic-diner slot; U.S. Hotel covers the historic-tavern slot. Cuisine tagged by kitchen tradition
(diner, hot dogs, pizza, sweets, American/tavern, ice cream, cafe).

## Sources used (all ≥2 credible, or a lone institutional authority)
Altoona Mirror (local daily), Explore Altoona / Allegheny Mtns CVB, Uncovering PA (Jim Cheney), Spotlight
PA, Visit PA, Raystown Lake Region CVB, Visit Central PA, Visit Clearfield County, PA DCNR (state parks),
NRHP/NHL (via Wikipedia/NPS), Wikipedia, Trains Magazine/Railway Age, TribLIVE, PA DCED, Pittsburgh City
Paper, The Takeout, Lancaster Farming, PA Center for the Book, Atlas Obscura, plus official sites
(Railroaders Museum, Mishler Theatre, Blair County Historical Society, MiLB). **Yelp / TripAdvisor /
OpenTable / Google counted ZERO** — used only to fact-check hours/existence, never as a recommender.

Lone-institutional-authority entries (one credible source is sufficient): Canoe Creek State Park (PA DCNR).
All NHL/NRHP entries additionally carry 2+ editorial/CVB sources.

## MEASURED & DROPPED
- **Marzoni's Brick Oven & Brewing (Duncansville/Altoona)** — measured: Visit PA listing (1 credible) +
  BeerAdvocate/TripAdvisor (not credible). Popular regional brewpub but tied to the Hoss's family group and
  only one credible recommender; no city-unique dish. Dropped (padding / short of ≥2 credible).
- **Original Italian Pizza (OIP) as a standalone card** — the OIP franchise is Altoona-canon but sourcing
  for any single OIP location is Yelp/TripAdvisor-only. The Altoona-style-pizza phenomenon it helped spread
  is instead captured, correctly sourced, via 29th Street Pizza (The Takeout + Pgh City Paper + Uncovering
  PA name it the style's standard-bearer). OIP dropped as a place; the dish is covered.
- **Knickerbocker Tavern, Jack & George's, The Stone Cellar, Villa Capri, Mama Randazzo's, Tim's American
  Cafe, Jethro's (Altoona)** — appear only on Yelp/TripAdvisor/OpenTable and SEO listicles
  (familydestinationsguide, restaurantji, culturetrip). No ≥2 credible recommender and no city-unique dish.
  Dropped.
- **Red's Diner (Lewistown, 1954)** and **Boxer's Cafe (Huntingdon, wing night / craft beer)** — genuine
  local institutions but credible-source coverage not found (TripAdvisor / BeerAdvocate / blogs only).
  Dropped for want of ≥2 credible; revisit if Altoona Mirror / CDT / PA Eats / raystown.org editorial turns up.
- **Tussey Mountain (Boalsburg)** — listed in the brief under REG, but it sits in Boalsburg, Centre County,
  which the standing brief assigns to the BVL/HV agent. Left to that agent to avoid a cross-area duplicate.

## Closures / access flags
- **Indian Caverns (Spruce Creek)** — PERMANENTLY CLOSED since 2016 (open to the public 1929–2016).
  Kept in the dataset with `"closed": true` and a `— CLOSED` name marker; do not present as a live visit.
- **Lakemont Park / Leap-the-Dips (Altoona)** — the PARK is OPEN (2026 season opened April 17) but **all
  RIDES, including the NHL coaster Leap-the-Dips, have been closed since 2024** (attendance/insurance costs);
  2026 is mini-golf, batting cages, courts and events only. Coaster's future uncertain (2025 save-the-rides
  petition). Entry left `"closed": false` (park operates) with the ride closure stated plainly in the blurb.
- **Horseshoe Curve funicular** runs intermittently — when it's down, the trackside viewing area is reachable
  only by the 194 steps. Noted in the blurb.
- **East Broad Top Railroad** operates a growing but partial main line (revived 2020–2023, expanding south);
  steam vs. diesel and seasonal schedules vary — noted as an active heritage line, not year-round.

## Sourcing caveat for the re-rank/gate stage
- **Standing Stone Coffee Company (REG)** rests on two Raystown Lake CVB pieces (a culinary feature + a
  listing) — credible, but a single outlet. It's a well-established regional roaster (open since 2008, ~22k
  lbs/yr, 40+ wholesale clients), so it clears the merit bar, but a second distinct credible outlet (PA Eats,
  Uncovering PA, or CDT) would strengthen it. Flagged for the gate.
