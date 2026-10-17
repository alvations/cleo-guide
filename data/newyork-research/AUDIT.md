# New York — sourcing audit (sources-of-truth)

_Started 2026-10-17. This audit covers the QC finding that "Yelp is shown as a recommender". The rule is CLAUDE.md "Yelp/TripAdvisor are never the recommender": the ≥2-credible gate counts them as 0._

## 2026-10-17 — Yelp/TripAdvisor-only records (9) and one duplicate

`node tools/research.js --sourcecheck new-york-ny` already counts YELP/TRIPADVISOR as 0 and FAILs. **But `tools/build-newyork.py` never applied the gate**, so 0-credible records reached the live page.

**Fix.** The build now has **GATE 0**: a record needs at least one credible recommender, or it is dropped and logged.

Source upgrades are in `_source_overlay.json`, applied by `consolidate.py`. Every URL was found by sequential WebSearch on 2026-10-17.

| place | was | now | evidence | kept? |
|---|---|---|---|---|
| Hainan Chicken House | YELP | + INFATUATION, WIKIPEDIA | The Infatuation review. The Wikipedia article cites a NYT two-star review (Pete Wells, 11 Jul 2023) and NYT's "12 best new restaurants of 2023". | yes; 2 credible |
| Ralph's Famous Italian Ices | TRIPADVISOR | + NYCGO | NYC Tourism listing: the Port Richmond Ave stand is "the original Ralph's" (1928 / 1949). | yes; 1 credible |
| Awang Kitchen | TRIPADVISOR | + GAYOT | Gayot review (Indonesian, Queens Blvd). | yes; 1 credible |
| Kinokuniya Cafe | TRIPADVISOR | + UNTAPPED | Untapped Cities, best specialty bookstores (the in-store café). | yes; 1 credible |
| Wah Fung No 1 | YELP, t1 | **merged** into "Wah Fung No. 1 Fast Food" | Same address, 79 Chrystie St. The canonical record keeps INFATUATION as its source, with Yelp only as a measurement. | merged; tier t3 per the merit bar, since a t1 can't rest on Yelp |
| Gong Cha (W 38th St) | YELP | — | No Eater, Time Out, Infatuation or creator coverage found. A global chain; it does not meet the merit bar. | **held by GATE 0** |
| Yi Fang Taiwan Fruit Tea | YELP | — | Only listings and review aggregators found. | **held by GATE 0** |
| Meet Fresh (Flushing) | YELP | — | No NYC editorial coverage found; chain write-ups are from other cities. | **held by GATE 0** |
| Cha Cha Matcha (Lafayette) | YELP | — | Only ordering and listing pages and a lifestyle directory found. | **held by GATE 0** |

### Open decision for the orchestrator or owner

About **311 NYC dataset places carry one editorial source** (`--sourcecheck`, after this pass). The full ≥2-credible gate that Silicon Valley enforces in `build-siliconvalley.py` would drop them all from the live page. GATE 0 deliberately does not do that. Enforcing ≥2 for NYC is an editorial call.

## 2026-10-17 — Hainan Chicken House: t2 → **t1** (Brooklyn food)

The measure is the same one used for every Brooklyn t1: credible recommenders and institutional or major-press weight.

| Brooklyn food t1 | credible sources |
|---|---|
| The Four Horsemen | Michelin ★ |
| Oxomoco | Michelin ★ |
| Peter Luger | Michelin, Wikipedia |
| Hometown Bar-B-Que | Michelin |
| Sofreh | Michelin |
| Roberta's | Infatuation (+ TripAdvisor, which counts 0) |
| Lucali | Infatuation |
| L'industrie | Infatuation |
| Lilia | Infatuation |

**Hainan Chicken House** has The Infatuation ("some of the best Hainanese chicken and rice in the five boroughs") plus Wikipedia, which cites a **NYT two-star review** (Pete Wells, 11 Jul 2023) and **NYT's "12 best new restaurants of 2023"**.
- That is two credible sources plus major-press acclaim.
- It **outranks the four single-source Infatuation t1s** (Roberta's, Lucali, L'industrie, Lilia) on this measure.
- It does not outrank the Michelin-backed five.

**Promoted to t1** through `_source_overlay.json` "tier".

Note: under D-54 those four single-source t1s are first in line for a second source, and are demoted if none is found.

## 2026-10-17 — D-54 second-source wave 1: tier 1 (30 single-source records)

Orchestrator decision D-54: do not flip the build to ≥2 yet. Instead, give every single-source record a second credible recommender, in order t1, then t2, then the city-unique food canon, then the rest. **A t1 still at one source after its wave is demoted within its region.** Sources were found by about 30 sequential WebSearches, and every URL is in `_source_overlay.json`.

**Second source found (27):**

| place | second source |
|---|---|
| Brooklyn Bridge Park | OFFICIAL (brooklynbridgepark.org) |
| Coney Island Cyclone | 6sqft |
| Smorgasburg | Wikipedia + Brooklyn Paper |
| Yankee Stadium | Wikipedia |
| Arthur Avenue Retail Market | Municipal Art Society + NYC EDC |
| 9/11 Memorial & Museum | Wikipedia |
| Neue Galerie | Time Out |
| Cathedral of St. John the Divine | NYC Landmarks Commission + NY Landmarks Conservancy |
| NY State Pavilion | Wikipedia + World Monuments Fund |
| Staten Island Ferry / St. George Terminal | Wikipedia |
| Snug Harbor | Cultural Landscape Foundation |
| Historic Richmond Town | ABC7 NY |
| Freshkills Park | Wikipedia + 6sqft |
| Chinese Scholar's Garden | Wikipedia + Atlas Obscura + Untapped |
| Staten Island Boat Graveyard | Freshkills Park (NYC Parks) + Wikipedia |
| St. George Theatre | Wikipedia + Untapped |
| Roberta's | Time Out |
| Lucali | Time Out |
| L'industrie Pizzeria | Time Out (254 S 2nd St listing) |
| Lilia | Gayot |
| Mike's Deli | amNY |
| Naks | Time Out |
| Nom Wah Tea Parlor | Village Voice (Critic's Pick / 100 favorite dishes) |
| Sripraphai | Time Out + Edible Queens |
| Lemon Ice King of Corona | Edible Queens + amNY |
| Brother's Pizzeria | Infatuation |
| Killmeyer's Old Bavaria Inn | Forgotten NY + NYC Tourism |

**No second source, so demoted t1 → t2 (3):**
- **Randiwa (SI):** NYC Tourism only. The Infatuation's Staten Island Sri Lankan review is for Lakruwana, a different restaurant.
- **Taste Good Malaysian Cuisine (QNS):** Infatuation only (8.9). A 2015 Village Voice laksa mention was found, but without a citable URL.
- **Golden Lake Pavilion (QNS):** Infatuation only. **Naming flag:** The Infatuation has two pages for the same address, 6015 Main St, titled "Golden Lake Pavilion" and "New Lake Pavilion". The record's name may be wrong; to be checked before any promotion.

**Not counted:** Frommer's (a third-party travel-guide brand) and Roadfood. Several reviews were for a *different* location of the same brand.

**Counts after wave 1:** single-source **t1 0** · t2 207 (incl. the 3 demoted) · t3 77.

## 2026-10-17 — D-54 wave 2a: tier 2, sights batch 1 (18 second-sourced)

Sequential WebSearch on 2026-10-17. Every URL is in `_source_overlay.json`.

| place | second source added |
|---|---|
| New York Aquarium | Time Out |
| Industry City | Wikipedia + Municipal Art Society |
| Pioneer Works | Time Out |
| Brooklyn Children's Museum | Time Out |
| Wave Hill | Wikipedia |
| Grand Concourse Art Deco | Wikipedia + Historic Districts Council |
| Bronx Documentary Center | Norwood News + News 12 |
| 1520 Sedgwick Ave | ABC7 NY (hip-hop 50 landmarks) |
| National Museum of the American Indian | Wikipedia (Heye Center) + Smithsonian Archives |
| Museum of Chinese in America | Wikipedia |
| Federal Hall | NPS |
| Trinity Church | Untapped |
| St. Paul's Chapel | Wikipedia + NPS |
| African Burial Ground | NPS |
| Merchant's House Museum | Wikipedia |
| Charging Bull | Wikipedia |
| Fraunces Tavern Museum | NPS + 6sqft |
| Museum at Eldridge Street | Time Out + Open House New York |

**Not counted:** AFAR, Frommer's, Lonely Planet and AAA (third-party travel brands), plus Mental Floss.

**Counts after wave 2a:** single-source t1 0 · **t2 189** · t3 77.

## 2026-10-17 — D-54 wave 2b: tier 2, sights batch 2 (27 second-sourced)

Sequential WebSearch on 2026-10-17. Every URL is in `_source_overlay.json`. New outlets in this batch:
- Architectural Record, Britannica and Landmark West!;
- Central Park Conservancy, The Bowery Boys, Bronx Times and Scouting NY;
- DNAinfo, WCS (operator), NY1 and HuffPost;
- the 9/11 Memorial & Museum.

The batch also reused Wikipedia, Time Out, 6sqft, Untapped, Atlas Obscura, HDC, NPS and Smithsonian.

| place | second source added |
|---|---|
| Whitehall Terminal | Wikipedia |
| Elizabeth Street Garden | Wikipedia + Time Out |
| Oculus | Architectural Record |
| Little Island | Wikipedia + 6sqft |
| Cooper Hewitt | Time Out + si.edu |
| The Jewish Museum | Time Out |
| New-York Historical Society | Britannica + Landmark West! |
| Morris-Jumel Mansion | Untapped |
| Conservatory Garden | Wikipedia + Central Park Conservancy |
| Hook & Ladder 8 | Wikipedia |
| 55 Central Park West | Untapped |
| Sanctum Sanctorum corner | Wikipedia |
| Carrie Bradshaw's Stoop | Time Out + 6sqft |
| MetLife Building | The Bowery Boys |
| Daily News Building | Forgotten NY |
| The Joker Stairs | Bronx Times |
| The Moonstruck House | Time Out + 6sqft |
| The Godfather Corleone Compound | Scouting NY + DNAinfo |
| Queens Zoo | WCS newsroom |
| King Manor Museum | Untapped + NY1 |
| Kaufman Astoria Studios | HuffPost |
| Astoria Park | Wikipedia + Time Out |
| Flushing Town Hall | Atlas Obscura + Untapped |
| Fort Totten Park | Atlas Obscura + HDC |
| Jacob Riis Park | NPS |
| Alice Austen House | Wikipedia |
| Postcards (SI 9/11 Memorial) | 9/11 Memorial blog + Untapped |

**Still single and carried to the next t2 batch:** The Friends Building and The Plaza (Home Alone 2), where only tour or listing pages were found, and El Museo del Barrio, where only travel brands and CUNY pages were found.

**Counts after wave 2b:** single-source t1 0 · **t2 162** · t3 77.
