# Cleveland — audit log

This file records sourcing passes for the Cleveland guide. The data itself lives in `cleveland.html` (the engine).

## 2026-10-17 — D-53: sourcing the "No independent source yet" cards

FE-B's D-53 render (QA-87) shows "No independent source yet" on any card whose only sources are the guide's general knowledge (ADD/FADD), the place's own site, or a rating platform. This pass looked for a credible independent recommender for each such card, using sequential `WebSearch` on 2026-10-17 and the merit bar in docs/SOURCES.md. **ADD/FADD is never relabelled.** A found source is *added* as a new per-article registry entry (`D53_<NAME>_<n>` in `S`/`FS`) next to the existing ADD/FADD key, so the card keeps saying the place was added by the guide and also names who independently recommends it. A record that found nothing keeps its honest label and is listed below.

| Place | Source(s) added | Note |
|---|---|---|
| Hope Memorial Bridge & the Guardians of Traffic | [Encyclopedia of Cleveland History (Case Western)](https://case.edu/ech/articles/h/hope-memorial-bridge) + [Cleveland Historical](https://clevelandhistorical.org/items/show/73) + [Wikipedia](https://en.wikipedia.org/wiki/Hope_Memorial_Bridge) |  |
| Beachland Ballroom & Tavern | [Cleveland Magazine](https://clevelandmagazine.com/articles/cindy-barber-on-the-beachland-ballroom-surviving-20-years) + [FreshWater Cleveland](https://freshwatercleveland.com/features/Setting-The-Stage-Beachland-Ballroom-And-Tavern-Marks-25-Years-Of-Music-Friends-And-Collinwood-Advocacy_061225.aspx) |  |
| 78th Street Studios | [Cleveland Scene](https://www.clevescene.com/news/third-fridays-at-78th-street-studios-packs-a-world-of-art-into-one-night-5713238) + [FreshWater Cleveland](https://freshwatercleveland.com/street-level/Third_Fridays_081623.aspx) |  |
| Karamu House | [Wikipedia](https://en.wikipedia.org/wiki/Karamu_House) + [News 5 Cleveland](https://www.news5cleveland.com/news/black-history-month/cleveland-black-history-trailblazers-karamu-house-is-the-oldest-black-theater-in-the-u-s) |  |
| Severance Music Center | [Wikipedia](https://en.wikipedia.org/wiki/Severance_Hall) |  |
| Dunham Tavern Museum & Gardens | [Encyclopedia of Cleveland History](https://case.edu/ech/articles/d/dunham-tavern) + [Cleveland Magazine](https://clevelandmagazine.com/articles/cle-myths-dunham-tavern-museum/) |  |
| Transformer Station | none | ONLY CMA (owner) press + listings; not independent -> none yet |
| Loganberry Books | [Cleveland Magazine (Best of Cleveland 2018)](https://clevelandmagazine.com/articles/best-of-cleveland-book-reunion/) |  |
| Cleveland Institute of Art Cinematheque | [ECH](https://case.edu/ech/articles/c/cleveland-cinematheque) + [Wikipedia](https://en.wikipedia.org/wiki/Cleveland_Cinematheque) |  |
| Hale Farm & Village | [NPS](https://home.nps.gov/cuva/learn/historyculture/hale-farm.htm) + [CLEVHIST](https://clevelandhistorical.org/items/show/344) |  |
| Nature Center at Shaker Lakes | [Wikipedia](https://en.wikipedia.org/wiki/Nature_Center_at_Shaker_Lakes) |  |
| Lakewood Public Library | none | none found (Scene/Cle Mag lists do not include it) 2026-10-17 |
| Madison Park | none | none: only city parks page + a crime news story; no recommender 2026-10-17 |
| Momocho | [Cleveland Magazine (25 Best Restaurants)](https://clevelandmagazine.com/articles/momocho-clevelands-25-best-restaurants/) + [SCENE](https://www.clevescene.com/food-drink/restaurant-of-the-weekend-momocho-1560353/) |  |
| Happy Dog | [Cleveland Magazine (Best of Cleveland 2015 All-time Favorite)](https://clevelandmagazine.com/best-of/articles/best-of-cleveland-2015-all-time-favorite-happy-dog) + [OHIOMAG](https://www.ohiomagazine.com/food-drink/article/cleveland-s-happy-dog-offers-your-choice-of-50-toppings) + [Infatuation](https://www.theinfatuation.com/cleveland/reviews/happy-dog) |  |
| Mabel's BBQ | [Cleveland Magazine (25 Best Restaurants 2022)](https://clevelandmagazine.com/articles/mabels-bbq-clevelands-25-best-restaurants/) |  |
| Banter | none | NONE for THIS record (Van Aken Market Hall, 3441 Tuttle Rd; still open per Shaker Hts 2025 post). CleMag/The Land cover the separate Gordon Square reopening (5426/5428 Detroit) - a different location, not counted. Consider whether the Gordon Square original is the place to list. |
| Mitchell's Ice Cream, Ohio City | [WKYC (Business Insider/Foursquare best in Ohio)](https://wkyc.com/article/news/local/cleveland/mitchells-ice-cream-named-best-in-ohio/95-109916404) + [Cleveland Jewish News (Reader's Digest best in Ohio)](https://www.clevelandjewishnews.com/features/nosh/mitchell-s-ice-cream-named-best-ice-cream-in-ohio/article_0207cb78-3ee2-11ef-9d6b-e373f693057c.html) |  |
| Presti's Bakery | [Cleveland Magazine (Best Bakeries)](https://clevelandmagazine.com/articles/best-bakeries-prestis-bakery-cafe/) |  |
| Corbo's Bakery | [Cleveland Magazine (Best Bakeries)](https://clevelandmagazine.com/articles/best-bakeries-corbos-bakery/) |  |
| Honey Hut Ice Cream | [Cleveland Magazine (50 years of Honey Hut, 2024)](https://clevelandmagazine.com/food-drink/50-years-of-honey-hut-photo-gallery) + [WKYC (10 places for ice cream in NE Ohio)](https://wkyc.com/article/life/food/guide-10-places-to-get-ice-cream-in-northeast-ohio/95-440863362) |  |
| Malley's Chocolates, Lakewood | [Wikipedia](https://en.wikipedia.org/wiki/Malley%27s_Chocolates) + [CLEVHIST](https://clevelandhistorical.org/items/show/920) |  |
| Nate's Deli & Restaurant | [WKYC (Taste of Home feature)](https://wkyc.com/article/life/food/taste-of-home-nates-deli-restaurant-lebanese-cleveland/95-d0682fce-b3da-4145-a388-6421a77840cf) |  |
| Anatolia Cafe | [Cleveland Magazine](https://clevelandmagazine.com/food-drink/turkish-treat) + [SCENE](https://www.clevescene.com/?p=200327) |  |
| El Rinconcito Chapin | [Cleveland Magazine (Best of Cleveland: Garnachas)](https://clevelandmagazine.com/best-of/best-of-cleveland/articles/best-of-cleveland-garnachas) + [SCENE](https://www.clevescene.com/?p=280506) |  |
| Marie's Restaurant | [SCENE](https://www.clevescene.com/?p=269572) |  |
| Tita Flora's | [SCENE](https://www.clevescene.com/food-drink/now-open-tita-floras-filipino-restaurant-in-independence-42351116) + [Inquirer USA](https://usa.inquirer.net/135408/if-you-need-an-introduction-to-filipino-cuisine-visit-tita-floras-in-cleveland) |  |
| Dang Good Foods | [SCENE](https://www.clevescene.com/food-drink/dang-good-foods-brings-well-executed-street-food-from-singapore-to-lakewood-32280718/) + [Cleveland Magazine (takeout guide)](https://clevelandmagazine.com/articles/cle-takeout-guide-dang-good-foods/) + [WKYC](https://wkyc.com/article/life/food/dang-good-foods-lakewood/95-0ffda089-55bd-4c7f-b39d-f5d1650a4319) |  |
| Ty Fun Thai Bistro | [Cleveland Magazine (25 Best Restaurants 2016)](https://clevelandmagazine.com/food-drink/ty-fun-thai-bistro-) + [SCENE](https://www.clevescene.com/?p=221226) |  |
| Siam Cafe | [SCENE](https://www.clevescene.com/?p=196058) | FLAG cuisine: record says Cantonese (cz CN, FADD); Scene review says 'enormous variety of Thai and Vietnamese fare, mostly seafood'. Needs editorial check before re-tagging; do NOT change on one source. |
| Glizzys | [Cleveland Magazine (profile, Jul 2024)](https://clevelandmagazine.com/articles/glizzys-brings-fresh-flavors-to-cleveland-hot-dogs/) | FLAG address: CleMag 4628 W 130th; record + directory 4617 - re-check pin |
| Birdtown Brewing | [Cleveland Magazine](https://clevelandmagazine.com/articles/lakewood-s-birdtown-brewing-to-open-in-a-100-year-old-church-building) + [Crain's Cleveland (opening 2026-04-16)](https://www.crainscleveland.com/restaurants/ccl-birdtown-brewing-20260416/) |  |
| Birdietown | [Infatuation](https://www.theinfatuation.com/cleveland/reviews/birdietown) + [Axios Cleveland](https://www.axios.com/local/cleveland/2025/05/08/lakewood-birdietown-mini-golf) + [SCENE](https://www.clevescene.com/?p=14502) |  |
| The Root Cafe | [Cleveland Magazine](https://clevelandmagazine.com/articles/the-root-cafe/) + [SCENE](https://www.clevescene.com/?p=176791) |  |
| The RainForest, Cleveland Metroparks Zoo — CLOSED | none | skipped: closed place, flagged; a recommender for a closed place adds nothing to a live suggestion |
| Minh Anh Restaurant — CLOSED | none | skipped: closed place, flagged; a recommender for a closed place adds nothing to a live suggestion |
| Sweet Moses Soda Fountain — CLOSED | none | skipped: closed place, flagged; a recommender for a closed place adds nothing to a live suggestion |

The edit was scripted, and the script asserted that the record count (`{t:` literals and `Soldiers`) and the ADD/FADD mark counts were unchanged before writing (ground rule 2).

**Siam Cafe:** the cuisine tag needs an editorial check. The record says Cantonese (`cz CN`, FADD). The Cleveland Scene review describes "an enormous variety of Thai and Vietnamese fare, mostly seafood". It is not re-tagged on one source.
