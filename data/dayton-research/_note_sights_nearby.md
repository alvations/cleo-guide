# SIGHTS_NEARBY — Beavercreek & surrounding-Dayton sights (agent note)

Output: `data/dayton-research/SIGHTS_NEARBY.json` — **17 NEW, non-duplicate sights** (checked against the
`P` array in `data/dayton.dataset.json`; 0 collisions). Weighted EAST as asked. NO coordinates.

## By area (17)
- **EAST (6)** — Narrows Reserve (Beavercreek, t2), Creekside Trail (Beavercreek/Xenia rail-trail, t2),
  Oakes Quarry Park (Fairborn Silurian fossil reefs, t2), Downtown Fairborn Historic District (Foy's, t2),
  Wright State Nutter Center (Fairborn arena, t2), Caesar Creek Vineyards (Xenia estate winery, t3).
- **SOUTH (5)** — Rosewood Arts Center (Kettering, t2), Bill Yeck Park (Centerville, t2), Stubbs Park
  (Centerville amphitheater, t2), Grant Park (Washington Twp nature park, t2), Polen Farm (Kettering 1854
  farmstead, t3).
- **NORTH (4)** — Rose Music Center at The Heights (Huber Heights amphitheater, t1), Taylorsville
  MetroPark (Vandalia/Tadmor, t2), Troy Historic Public Square (fountain/NRHP, t2), Troy-Hayner Cultural
  Center (t2).
- **YS / Greene (2)** — Downtown Yellow Springs (arts village + Antioch + Little Art Theatre, t1),
  Caesar Creek State Park (fossils/beach, Warren-Clinton-Greene, t2).

Tier-1 coverage: every area already has a tier-1 in the base dataset (Air Force Museum EAST, Carillon
SOUTH, Aullwood NORTH, Glen Helen YS); additions add fresh t1s in NORTH (Rose) and YS (Downtown YS).

## Sourcing — creators/outlets used (all ≥2 credible, OR lone institutional)
Official park/city/venue sites (Greene County Parks, City of Beavercreek, City of Fairborn, Nutter
Center, Play Kettering, CWPD, City of Centerville, Five Rivers MetroParks, Miami Conservancy District,
Troy-Hayner, Destination Dayton, Yellow Springs Ohio, Ohio DNR); press/editorial (Dayton Daily News,
WDTN, Fairborn Daily Herald, Islands.com travel editorial, Dayton Local/Gem City, Home Grown Great /
Miami County VCB, TourismOhio Ohio.org); Wikipedia (published coords); Ohio Wine Producers Association.
**Yelp/TripAdvisor used for open-check only, ZERO toward the two.**

## Merit notes
- Oakes Quarry Park kept for genuine uniqueness — among the oldest Silurian fossil reefs in the U.S.
- Caesar Creek Vineyards graded t3 (family winery); cleared the bar via official + Ohio Wine Producers
  Association + Dayton Local, not Yelp.
- Polen Farm graded t3 (mostly an events venue) but has 1854 historic merit + Dayton Daily News feature.

## Access / open status
All 17 verified OPEN and publicly accessible (2025/2026). Nutter Center & Rose Music Center are
ticketed-event venues; Downtown Fairborn/Yellow Springs are districts. **Note for build: Oakes Quarry,
Narrows, Caesar Creek Vineyards and Caesar Creek SP addresses are the entrance/tasting-room address —
geocode to the place pin, not the road, at coordinate stage.** No closures found.

## MEASURED & DROPPED
- Brandeberry Winery (Beavercreek-area) — dropped; only Yelp/YellowPages listings, no credible editorial
  (kept Caesar Creek Vineyards instead, which has Ohio Wine Producers Association + Dayton Local).
- Standalone Antioch College entry — folded into Downtown Yellow Springs to avoid padding.

## Remaining / not capped
Deliberately stopped at 17 (target 12-18). Further EAST candidates exist if wanted (Beavercreek
Community Park / Girl Scout Memorial; Bill Yeck is SOUTH by geography despite the brief listing it EAST).
