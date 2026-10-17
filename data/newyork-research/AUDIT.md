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

## 2026-10-17 — D-54 wave 2c: tier 2, remaining sights + the city-unique canon (pizza, hot dog, dumplings/noodles), 27 second-sourced

Sequential WebSearch on 2026-10-17. Every URL is in `_source_overlay.json`.

**Sights**

| place | second source added |
|---|---|
| Cosby Show House | New York Sun |
| Royal Tenenbaums House | Time Out + 6sqft |
| Men in Black HQ | Wikipedia (Brooklyn–Battery Tunnel) |
| Greenbelt Nature Center | NYC Tourism |
| Staten Island Museum | NY Landmarks Conservancy + amNY |
| Garibaldi-Meucci Museum | Forgotten NY |
| Moravian Cemetery | Untapped + HDC |
| Wolfe's Pond Park | Wikipedia + Time Out |
| Blue Heron Park | Wikipedia + Time Out |
| Empire Outlets | Wikipedia + amNY |
| El Museo del Barrio | Amsterdam News + WNYC |

**Canon: pizza and hot dog**

| place | second source added |
|---|---|
| Di Fara | Brooklyn Magazine + News 12 |
| Juliana's | Infatuation + Time Out |
| Lombardi's | Wikipedia + Untapped |
| Prince Street Pizza | Adam Kuban, the founder of Slice, a verifiable pizza authority |
| Rubirosa | Time Out |
| Scarr's | Infatuation |
| Patsy's | Scott's Pizza Tours (Scott Wiener) |
| Saraghina | Brooklyn Paper |
| Zero Otto Nove | Time Out + Village Voice |
| Nathan's Famous | NYC Tourism + NY1 |

**Canon: dumplings and noodles**

| place | second source added |
|---|---|
| Joe's Shanghai | Infatuation |
| Tasty Hand-Pulled Noodles | Untapped + amNY |
| Great NY Noodletown | Infatuation + **Michelin Guide** |
| Super Taste | Village Voice + Untapped |
| Joe's Steam Rice Roll | Edible Queens + Explore Parts Unknown |
| Golden Diner | Time Out + ABC7 NY |

**Not counted:**
- Time Out's Deluxe Green Bo listing: the review is negative on the dish we cite.
- Joe & Pat's: the Infatuation and Gayot reviews found are for the East Village outpost, not the Staten Island original. It is carried to the next batch.
- The Friends Building and The Plaza (Home Alone 2): only tour or listing pages again. They are carried to the next batch.

**Counts after wave 2c:** single-source t1 0 · **t2 135** · t3 77.

## 2026-10-17 — D-54 wave 2d: tier 2, food batch 1 (24 second-sourced)

Sequential WebSearch on 2026-10-17. Every URL is in `_source_overlay.json`.

| place | second source added |
|---|---|
| Kashkar Cafe | Time Out + Gayot |
| Peter Pan Donut | Infatuation + Time Out |
| Frankies 457 | Infatuation + Time Out |
| Peaches HotHouse | Infatuation + Time Out |
| Chuko | Infatuation + Time Out |
| Johnny's Reef | News 12 |
| Madonia Brothers | News 12 + 6sqft |
| Feeding Tree | Time Out |
| Papaye | Village Voice + Smithsonian Magazine |
| Yun Nan Flavour Garden | Time Out |
| Ba Xuyen | Brooklyn Magazine + NYC Tourism |
| Native Noodles | Time Out |
| House of Joy | Time Out |
| Nyonya | Time Out |
| Sumatera | Robert Sietsema, a veteran NYC critic |
| Laut | NYC Tourism |
| Kopitiam | Infatuation + ABC7 |
| Urban Hawker | 6sqft + Infatuation |
| Eyval | Wikipedia, which cites the NYT top-100 placings for 2023 and 2024 |
| Dominique Ansel Bakery | NYC Tourism |
| Supermoon Bakehouse | Infatuation + ABC7 |
| Radio Bakery | Infatuation + Brooklyn Magazine |
| 7th Street Burger | Infatuation + Wikipedia |
| Carbone | Time Out |

**Flags:**
- **Feeding Tree (Bronx):** a Fox 5 NY piece says it was taken over and renamed **"Eating Tree"**. Its status and name need a check (rule 4c) before the next refresh.
- **Laut:** its own site says it held a 2011 Michelin star. A blog says the star was lost. That is not counted as a Michelin source.

**Carried forward:** Nargis Cafe, City Island Lobster House, Dominick's, Rasa, Hainan Jones and L'Appartement 4F. No credible second source was found yet.

**Counts after wave 2d:** single-source t1 0 · **t2 111** · t3 77.

## 2026-10-17 — D-54 waves 2e + 2f: tier 2, bars (22 second-sourced)

Same method as 2a–2d: sequential `WebSearch`, a second credible recommender per record, URL in `_source_overlay.json`. The original source for most of these was Atlas Obscura, The Infatuation, Time Out or NYC Tourism. New source labels: PUNCH, POETS.ORG, NATIONAL TRUST FOR HISTORIC PRESERVATION (savingplaces.org), WORLD'S 50 BEST BARS.

| Place | Second source added |
|---|---|
| McSorley's Old Ale House | Time Out + Wikipedia |
| Ear Inn | Time Out + Forgotten NY |
| Old Town Bar | Infatuation + amNY (125th anniversary) |
| King Cole Bar | New York Sun + Untapped Cities (Maxfield Parrish mural) |
| Julius' Bar | NPS (LGBTQ heritage article) |
| White Horse Tavern | Poets.org (Academy of American Poets literary-landmark listing) |
| KGB Bar | Time Out + Wikipedia |
| Please Don't Tell | Wikipedia + 6sqft |
| Attaboy | World's 50 Best Bars (North America list) |
| The Back Room | National Trust for Historic Preservation + Time Out (speakeasies guide) |
| Death & Co | Punch + Time Out + World's 50 Best |
| Apotheke | Time Out |
| The Dead Rabbit | DNAinfo (World's 50 Best Bars No. 1, 2016) |
| Bemelmans Bar | Punch + Wikipedia |
| Employees Only | World's 50 Best (No. 95 world, No. 18 North America, 2025) |
| Angel's Share | Infatuation (review of the Grove St location) |
| Little Branch | Punch + World's 50 Best |
| Bathtub Gin | Infatuation |
| Raines Law Room at The William | Time Out |
| Westlight | Gothamist |
| Overstory | World's 50 Best |
| The Skylark | Time Out |

**Not counted:** Difford's Guide, En Primeur Club, Tasting Table listicles, The Rooftop Guide, Fox News travel, Resy's blog (a booking brand), and hotel or airline marketing pages.

**Flags:**
- **Little Branch:** most sources give **22** Seventh Ave S; the dataset (and En Primeur Club) has 20. The pin needs a placement re-check (rule 4b).
- **Angel's Share:** older Time Out and Village Voice pages describe the closed 8 Stuyvesant St bar. The dataset's 45 Grove St matches the 2020 relocation (Infatuation).

**Carried forward (t2, no credible second source yet):** 230 Fifth, The Polo Bar, Tao Uptown, Peak, Le Bain, Harriet's Rooftop. A food batch (2g/2h) is drafted next.

**Counts after waves 2e + 2f:** single-source t1 0 · **t2 89** · t3 77 (`--sourcecheck`: 166 single-source, 4 Yelp-only held by GATE 0).

## 2026-10-17 — D-54 waves 2g–2i: tier 2, food, rooftops, Queens, Harlem and SG/MY (40 second-sourced, 1 demoted)

Same method: sequential `WebSearch`, a second credible recommender per record, URL in `_source_overlay.json`. New labels: HELL GATE, SAVEUR, NBC NEW YORK. Nintendo New York and FAO Schwarz are also D-53 "no independent source" cards. Wenwen's second source is its Michelin Guide listing; its cuisine stays Taiwanese.

| Place | Second source added |
|---|---|
| Jean-Georges | Michelin Guide |
| Minetta Tavern | Time Out |
| Balthazar | Time Out |
| The Odeon | Punch + Wikipedia |
| Buddakan | Time Out |
| Sadelle's | NYC Tourism |
| Tao Downtown | Time Out |
| The Campbell | Wikipedia + Atlas Obscura |
| Manhatta | Time Out |
| Bar SixtyFive at Rainbow Room | Time Out + Wikipedia |
| Ophelia | NYC Tourism |
| Nubeluz | NYC Tourism |
| The Plaza Hotel (Home Alone 2) | NYC Landmarks Preservation Commission (designation report LP-0265) + Wikipedia |
| Nintendo New York | Wikipedia |
| FAO Schwarz (The Big Piano) | NBC New York |
| Little Pepper | Infatuation + Time Out |
| Hunan Kitchen of Grand Sichuan | Time Out |
| Jackson Diner | Infatuation |
| Kabab Cafe | Infatuation + Village Voice |
| Nepali Bhanchha Ghar | Infatuation + Hell Gate |
| Telly's Taverna | Infatuation + Gothamist |
| Djerdan Burek | amNY + Edible Queens |
| Cheburechnaya | Time Out + Gothamist |
| Ihawan | Infatuation |
| Chao Thai | Infatuation + Hell Gate |
| Leo's Latticini | Infatuation + amNY |
| Eddie's Sweet Shop | Infatuation + Untapped Cities |
| Le Baobab Gouygui | Time Out + Amsterdam News |
| Dinosaur Bar-B-Que | Time Out + Infatuation |
| Malecon | DNAinfo |
| Cafe Sabarsky | Infatuation + Gayot |
| J.G. Melon | Wikipedia + Forgotten NY |
| Royal Crown Bakery | Saveur |
| Tavern on the Green | Time Out + Wikipedia + Central Park Conservancy |
| Wenwen | Michelin Guide |
| Eim Khao Mun Kai | Time Out + DNAinfo |
| Maxi's Noodle | Infatuation + NYC Tourism |
| Beauty & Essex | Gayot |
| Kuih Cafe | Atlas Obscura |
| Kelang | Time Out + Eater NY |

**Demoted (merit bar):** **Deluxe Green Bo**, t2 → t3 within Manhattan (`tier` overlay). Its one recommender is a positive Infatuation review (8.4). Time Out's review is negative on the dish we cite, which counts as evidence against, not a second recommendation. That is a split verdict from a single source, so the record is demoted rather than pruned.

**Not counted:** Tasting Table listicles, Hoodline, En Primeur Club, Fine Dining Lovers, Resy's blog (a booking brand), Frommer's (a travel brand), Wanderlog/Foursquare, Fox News interviews, and coverage of a *different* location of the same brand (Gai Chicken & Rice in Midtown is not Gai Kitchen at 98 Mott St).

**Flags (rule 4c / 4b):**
- **SGD Tofu House & BBQ** (156-16A Northern Blvd, Flushing): no source confirms this branch exists. It needs a status check.
- **New Malaysia** (48 Bowery arcade) vs **West New Malaysia** (69 Bayard): Michelin's `/new-malaysia` Bib Gourmand page now shows "West New Malaysia, 69 Bayard St", so these may be one business that moved. No sources were added to either until the status/duplicate check is done.
- **Nepali Bhanchha Ghar:** the address is disputed. The dataset has 74-15 Roosevelt Ave; City Limits has 37th Rd between 74th and 75th.
- **Bar SixtyFive:** one listing says "private events only". It needs a status check.
- **Golden Lake Pavilion** (6015 Main St): Infatuation has both `/golden-lake-pavilion` and `/new-lake-pavilion` at the same address and phone, and there's no closure report. A rename is likely but no source states it, so this is **unresolved** and the name is kept.

**Carried forward (t2, no credible second source yet):** The Friends Building, The Continental, LEGO Store Fifth Ave, Tiffany Fifth Ave, Nargis Cafe, Dominick's, City Island Lobster House, Rasa, Hainan Jones, L'Appartement 4F, Tao Uptown, The Polo Bar, Peak, Serra by Birreria, 230 Fifth, Refinery Rooftop, The Crown, Magic Hour, Le Bain, Harriet's Rooftop, Robert, Kiki's, Melba's, Noodle Village, Gai Kitchen, Padi D'NYC, San Jeronimo, Abey (directory listing only, so its status also needs a check), plus the SG/MY records still in progress.

**Counts after waves 2g–2i:** single-source t1 0 · **t2 48** · t3 78 (+1 from the Deluxe Green Bo demotion). `--sourcecheck`: 126 single-source, 4 Yelp-only held by GATE 0.
