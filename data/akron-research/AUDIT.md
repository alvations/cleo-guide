# Akron · Kent · Canton — AUDIT ledger (append-only)

## 2026-10-02 · Stage 0 — Scope & taxonomy
- Region: Summit + Portage + Stark counties (+ Wadsworth, Medina Co.), north to the Cuyahoga County line.
- Areas (6): AKR, NSUM, KENT, BARB, CANT, MASS — municipal clusters so tiers grade within each and the
  must-see filter never empties a region (CLAUDE.md "tiers within region").
- Cuisines: CHIX (Barberton chicken is the region's signature), BURG (Swenson's drive-in canon), US, ITAL,
  HIMAL (North Hill's Nepali/Bhutanese refugee community), ASIAN, EURO (Serbian/Hungarian roots), MED, MEX,
  SOUL, ICE (Strickland's custard, Taggart's Bittner), BREW, COF.
- Collections: ICON, MUS, PARK, ARCH, ENT, SHOP, FAM, ODD, FREE.
- Dedup against the Cleveland engine: CVNP, Brandywine Falls, Ledges, Blossom, CVSR, Hale Farm, White House
  Chicken, Hopocan Gardens are already on cleveland.html → excluded here. youngstown.html: no overlap.

## 2026-10-02 · W1 food canon — Stage 1/2 (sources → places) · BLOCKED after 1 search
- Search run: "Barberton chicken Belgrade Gardens Akron Beacon Journal" → Wikipedia (Barberton chicken), The
  Takeout (Barberton fried chicken feature), Cleveland Magazine ("fried chicken is Barberton's defining food"),
  Akron Life ("Taste of Tradition"), Roadfood, Atlas Obscura (best fried chicken), Yahoo-syndicated obituary of
  Belgrade's Kosta Papich, iHeart radio listicles (rejected — radio-network SEO roundups, not editorial).
- Extracted: **Belgrade Gardens** (BARB, t1) — 1933 origin of Barberton chicken (Topalsky family); sources
  WIKIPEDIA + TAKEOUT + CLEMAG + SCENE (Scene carried from data/cleveland-research/barberton-chicken.json).
  Dedup: not on cleveland.html (only White House + Hopocan are) nor youngstown.html. Milich's Village Inn named
  by Wikipedia only → held (needs a 2nd credible source).
- Channel mix this wave: editorial 3 (Takeout, Cleveland Magazine, Scene) · reference 1 (Wikipedia) · creators 0
  (not reached) · local 0.
- Status: open per cleveland-research fact-check (official site + Yelp, Aug 2026). Geocode: UNVERIFIED (not read).
- **BLOCKER:** every further WebSearch returned "session has used its web search budget (200 of 200)". The cap is
  shared by the ~16 concurrent agents and was exhausted at this agent's 2nd query. WebFetch is policy-blocked and
  must not be routed around; nothing may be added from memory. Wave halted honestly; RESUME.md carries the exact
  remaining query plan.
- Tooling fix (lesson → code): `tools/density.py` listed only areas that already had records, so 5 of 6 empty
  areas were invisible; it now reports every RESUME-targeted area (0-count areas show NEED +N).

## 2026-10-03 · W2a food AKR+BARB
Budget: 34 WebSearch calls (cap 40; one, a `allowed_domains=[cleveland.com]` call, was rejected by the API as
not crawlable — counted anyway). WebFetch not used (policy). Nothing from memory: every address/dish/status
below is from a search-result snippet.

**Queries run (in order)**
1. `Village Inn Chicken Barberton Milich's open` → Wikipedia (1955 Milich; closed 12/2014; reopened as Village Inn Chicken), Akron Life Barberton page.
2. `Swenson's Galley Boy original Akron drive-in history Beacon Journal` → Wikipedia, Signal Akron 2025 best-burger, Food Republic, ABJ via AOL.
3. `signalakron.org "best of city 2025" winner restaurant` → Signal Akron 2025 winners (Cilantro, Swensons, Sweet Mary's, Angel Falls, 750ml, Eye Opener).
4. `Signal Akron 2026 best of the city winners …` → 2026 winners (Papa Joe's, Ken Stewart's, Frank's Place on Market, Sweet Mary's, Angel Falls).
5. `Akron Life best of the city 2025 readers' choice winners restaurant` → only Signal pages (wasted).
6. `James Beard semifinalist Akron Ohio restaurant chef` → only Vinnie Cimino (Cordelia, Cleveland — Akron native, not an Akron restaurant). **No Akron JBF semifinalist surfaced — gap stated.**
7. `Strickland's Frozen Custard Akron … 1936` → Wikipedia + WKYC (2022/2023 season coverage); original at 1809 Triplett Blvd.
8. `North Hill Akron Nepali Bhutanese restaurant momo best Beacon Journal` → Signal Akron "Taste this chicken momo at Momo House".
9. `clevescene Akron North Hill Nepali … Momo House address` → Momo House 1548 Home Ave (Signal); Scene momo piece names Akron's "Everest Restaurant and Nepali Kitchen" without addresses.
10. `"Nepali Kitchen" OR "Everest Restaurant" Akron …` → Café Everest is Cleveland west side (not Akron); nothing usable.
11. `Luigi's Restaurant Akron North Main pizza since 1949` → Scene Classic Eats, Signal Akron 2025 best pizza, Akron Life pizza.
12. `Akron classic restaurants Papa Joe's … Akron Life OR cleveland.com` → OpenTable only (0, wasted).
13. `cleveland.com best restaurants in Akron list` (allowed_domains cleveland.com) → API 400, domain not accessible.
14. `Akron Beacon Journal best restaurants Akron 2025 Papa Joe's Ken Stewart's Diamond Grille` → OpenTable/TripAdvisor + Signal 2026 (weak).
15. `Akron Life dining iconic Akron restaurants must try classic dishes` (akronlife.com) → "Classic 330 Dishes" (New Era, Fiesta, Luigi's, Waterloo, Papa Joe's, Diamond Grille, Swensons), "Luxe Legacy: Ken Stewart's".
16. `Akron Life Flavor Awards winners best restaurants in the 330` → 330 Flavor Awards 2026 (Kingfish/Diamond Grille best; Amelia's best new; Cilantro best downtown; Luigi's best Summit Co.).
17. `Barberton chicken … Akron Life Taste of Tradition` → Akron Life, Tasting Table, Scene, CLEMAG, Takeout (five houses incl. Terrace Gardens, Milich's Village Inn).
18. `"Village Inn Chicken" Barberton Ohio address hours 2025` → no address/status.
19. `Akron Life "Best of the City 2025" winners Barberton Wadsworth Green Fairlawn` → Akron Life BOTC 2025 (Pancho's, D&M Grille, La Loma, Big Eu'es BBQ, Jilly's, Tip Top, Kingfish…) — areas not given.
20. `Akron Life "20 Best Restaurants for 2026"` → list (River Merchant, Diamond Grille, Cilantro, Amelia's, Industry, Ken Stewart's, Twisted Olive, Kingfish, Luciano's …).
21. `clevescene.com Akron restaurant review Diamond Grille OR Kingfish …` → OpenTable only (wasted).
22. `Signal Akron 2026 … pizza bar brewery …` (signalakron.org) → DeCheco's (pizza 2026), Lock 15 (bar/brewery 2025+2026), Saffron Patch, Mustard Seed.
23. `Akron breweries Hoppin' Frog Thirsty Dog Missing Falls Lock 15 …` → Visit Akron-Summit Summit Brew Path (addresses), BeerAdvocate mag, Ohio Magazine, Akron Life beer buzz.
24. `Ohio Magazine Akron beer sampler Hoppin' Frog B.O.R.I.S. …` → Ohio Magazine "Sample Akron Beer on the Summit Brew Path" (Hoppin' Frog, Thirsty Dog details).
25. `"Amelia's" "Farmer's Rail" Fairlawn restaurant` → it is **Cuyahoga Falls** (2231 Front St) → NSUM, out of this wave's scope (lead below).
26. `Barberton OR Wadsworth OR Norton OR Green … Akron Life dining` → Akron Life: Milich's Village Inn at 4444 S. Cleveland-Massillon Rd, Norton; Remarkable Diner (Barberton); Kasai, Twisted Olive (Green).
27. `Diners Drive-ins and Dives Akron … Barberton` → ABJ (via AOL): Fieri **has never filmed in Summit County** — DDD gap stated.
28. `Akron Beacon Journal New Era chicken paprikash OR Waterloo … Fiesta jojos OR Diamond Grille` → Scene "New Era, Old Style", Akron Life.
29. `New Era Restaurant Akron Croatian address Massillon Road open` → 10 Massillon Rd; hours Tue–Sat.
30. `Terrace Gardens Barberton chicken restaurant closed OR open Wooster Road` → no longer operating, no address, no dated closure source.
31. `"Twisted Olive" Green Ohio Southgate …` → OpenTable 4.8 (measurement), 5430 Massillon Rd, Green; no 2nd editorial outlet.
32. `mapcarta Akron Luigi's Restaurant North Main Street` → no coordinates (geocode attempt).
33. `Strickland's Frozen Custard Triplett 2026 season opening flavor` → opens Mar 6 2026; 90-cent cones for 90 years (ABJ via AOL).
34. `Milich's Village Inn Norton Cleveland-Massillon Road … 2025 OR 2026` → no current-status evidence.
Total: 34 WebSearch calls (incl. the rejected cleveland.com call), under the 40 cap.

**Kept (10 new; AKR 9, BARB 1)** — all ≥2 independent credible outlets
- AKR t1 Swensons Drive-In (original, 40 S Hawkins Ave) — WIKIPEDIA + SIGNALAKRON (2025 best burger vote) + AKRONLIFE (Classic 330).
- AKR t1 Strickland's Frozen Custard (1809 Triplett Blvd) — WIKIPEDIA + WKYC.
- AKR t1 Luigi's Restaurant (105 N Main St) — SCENE + SIGNALAKRON (2025 best pizza) + AKRONLIFE (Classic 330; Flavor Awards 2026).
- AKR t2 New Era Restaurant (10 Massillon Rd) — SCENE + AKRONLIFE. Chicken paprikash.
- AKR t2 Papa Joe's Iacomini's (1561 Akron Peninsula Rd) — SIGNALAKRON (2026 best restaurant) + AKRONLIFE.
- AKR t2 Cilantro Thai & Sushi (326 S Main St) — SIGNALAKRON (2025 best restaurant) + AKRONLIFE (Flavor 2026 best downtown).
- AKR t2 Hoppin' Frog Brewery (1680 E Waterloo Rd) — OHIOMAG + VISITAKRON; GABF gold ×2 (B.O.R.I.S.).
- AKR t3 Thirsty Dog Brewing Co. Taphouse (587 Grant St) — OHIOMAG + VISITAKRON.
- AKR t3 Lock 15 Brewing Co. (21 W North St) — SIGNALAKRON (2025+2026 vote) + VISITAKRON.
- BARB t2 Village Inn Chicken (Milich's Village Inn) (4444 S Cleveland-Massillon Rd, Norton) — WIKIPEDIA + AKRONLIFE. **Status unverified for 2025/26** — must clear the closure-check pass before publishing.

**Held leads (1 credible outlet, or missing dish/address)**
- Ken Stewart's Grille, 1970 W Market St — SIGNALAKRON (2026 best fine dining) + AKRONLIFE ("Luxe Legacy") = 2 outlets, but **no dish surfaced** → held until a named dish is sourced.
- Diamond Grille / Kingfish — AKRONLIFE only (Classic 330, Flavor 2026 best restaurant, 20 Best 2026); no address in results.
- Fiesta Pizza & Chicken (jojos, Ohio House recognition) — AKRONLIFE only; no address.
- Waterloo Restaurant (sauerkraut balls, since 1957) — AKRONLIFE only; no address.
- Momo House, 1548 Home Ave (North Hill, Nepali; jhol momo) — SIGNALAKRON only. Everest Restaurant / Nepali Kitchen (Akron) — named by SCENE only, no address. **North Hill Nepali/Bhutanese table still needs a 2nd outlet.**
- Sweet Mary's Bakery (76 E Mill St), Angel Falls Coffee (792 W Market St), Saffron Patch, Mustard Seed, DeCheco's, Frank's Place on Market, The Eye Opener (1688 W Market St), 750ml Wine — SIGNALAKRON vote only.
- Missing Falls Brewery, 540 S Main St — VISITAKRON only.
- Twisted Olive, 5430 Massillon Rd, Green (BARB) — AKRONLIFE only (+ OpenTable 4.8 measurement). Kasai (Wadsworth/Green), Remarkable Diner (Barberton) — AKRONLIFE only.
- Amelia's by The Farmer's Rail, 2231 Front St, **Cuyahoga Falls** — CLEMAG review + AKRONLIFE (Flavor 2026 best new) → ready for the **NSUM** wave (not added here: out of scope).
- Akron Life BOTC 2025 names (Pancho's, D&M Grille, La Loma, Big Eu'es BBQ, Jilly's, Tip Top, Wil's Grille) — one outlet, areas unknown.

**Rejected / skipped**
- Terrace Gardens (Barberton chicken) — no longer operating, no address or dated closure source → not added (could return as `— CLOSED` if a source surfaces).
- White House Chicken, Hopocan Gardens — on cleveland.html. Lou & Hy's — never surfaced in results.
- OpenTable / TripAdvisor / Wanderlog / onlyinyourstate / familydestinationsguide / unearththevoyage — 0 (listings / SEO).
- DDD: none in Summit County (gap). James Beard: no Akron restaurant semifinalist surfaced (gap).

**Channel mix:** reader votes 2 (Signal Akron BOTC, Akron Life Flavor/BOTC) · editorial 4 (Akron Life, Scene, Ohio Magazine, Signal features) · TV 1 (WKYC) · reference 1 (Wikipedia) · CVB 1 (corroborating) · creators 0.
**Geocoding:** 1 search spent; no attributable place-pin coordinate surfaced → all 10 UNVERIFIED in `geo/_geoout_w2a.json` (for the browser helper). **BARB yield low (1)**: Barberton/Wadsworth/Green coverage is mostly Akron Life alone — the next BARB wave should target Beacon Journal (via AOL syndication), Cleveland Magazine and Scene directly.

## 2026-10-03 · W1b — first full wave (food canon + sights backbone) · Stages 1–6
- Fresh session WebSearch budget; ~156 calls used (discovery ~120, address/status/geocode ~36). WebFetch not used
  (policy). Gannett domains (beaconjournal.com, cantonrep.com) refuse the crawler → Beacon Journal / Repository stories
  cited via their AOL/Yahoo syndication URLs (same bylined articles).
- **Merit lists used (measurement):** Signal Akron Best of the City 2025/2026 (reader vote) · Akron Life 330 Flavor Awards
  2026 (reader vote) + "20 Best Restaurants for 2026" + Best of the City 2025 · Canton Repository foodie panel "11 Stark
  County restaurants" · Cleveland Magazine Cuyahoga Falls 18 best / Highland Square 12 / Canton 21 must-go · Ohio Magazine
  Akron features · KentWired Best of Kent 2024–26 (reader vote) · Beacon Journal burger/pizza brackets + Local Flavor.
- **Kept:** 35 food (+ Belgrade) and 41 sights, each ≥2 independent credible sources (CVB listings count only as
  corroboration of a place measured elsewhere). Tiers graded within area; every area has a pinned tier-1 (AKR Stan Hywet
  /Dr. Bob's/Derby Downs…, NSUM Gorge + Hudson, KENT May 4 + Kent Dam + Nelson-Kennedy, BARB Anna-Dean barns, CANT Pro
  Football HOF/First Ladies/McKinley, MASS Massillon Museum).
- **Status:** all kept places open per 2025/2026 coverage; specific checks — Parasson's (WKYC: Akron dining room reopened
  while Stow/Barberton closed), Bob's Hamburg (WKYC fire story → Yelp listing updated Aug 2026 with current hours: open),
  Village Inn Chicken (Milich's closed 2014, reopened as Village Inn Chicken). Wild Goats Café held (Uber Eats closed
  May 2025).
- **Geocode:** 29 sights pinned from Wikipedia infobox / HMDB / Remarkable Ohio coords (high 21 · med 8). Restaurants: tried
  3 (Swensons, Belgrade, Strickland's) — no place pin surfaces → all food UNVERIFIED for the browser helper; never estimated.
- **MEASURED & DROPPED / held:** see RESUME.md "Held" (single-outlet or status-unverified). Deep Lock Quarry excluded
  (CVNP interior). Ohio Magazine *sponsored* Gervasi/Hartville posts not counted.
- **Tooling:** `tools/build-akron.py` Cleveland-leak exemption widened for legit regional names that appeared in data
  (Cleveland-Massillon Rd, Cleveland Guardians, Cleveland Jewish News, Cleveland Historical, Encyclopedia of Cleveland
  History, News 5 Cleveland) — still fires on a real template leak.
- **Build:** `rebuild-city.py akron-oh --build` → 29 pins; sourcecheck PASS · geocheck PASS · statuscheck CONSISTENT ·
  buildcheck PASS; `npm run validate` + `npm test` green. Index card relinked live; CITIES.md row updated.

## 2026-10-03 · W2a ↔ W1b reconciliation
- W2a (above) ran in parallel with W1b (two sessions on the same branch). Merged on pull: 6 W2a places were already in
  W1b → their extra sources folded into the W1b records (Swensons +AKRONLIFE; Hoppin' Frog +OHIOMAG +VISITAKRON); the
  other 4 duplicates added nothing new. W2a now holds only the 4 genuinely new/promoted places: New Era Restaurant,
  Papa Joe's Iacomini's (was held — OpenTable only; now Signal Akron + Akron Life), Thirsty Dog Taphouse (was held —
  Akron Life only; now Ohio Magazine + Visit Akron-Summit), Lock 15 Brewing (was held — Signal only; now + Visit Akron).

## 2026-10-03 · W2b pins + promotions + KENT/NSUM food
Budget: **43 WebSearch calls** (cap 45). Two were rejected by the API for a blocked domain in `allowed_domains`
(`beaconjournal.com`, `record-courier.com`) and are counted. WebFetch not used (policy). Nothing from memory.
Note: KentWired's Best of Kent pages now resolve on **kentstater.com** (same student paper), cited under KENTWIRED.
Housekeeping: committed merge-conflict markers (`<<<<<<< HEAD` / `=======` / `>>>>>>>`) between the W2a and W1b
sections of this file were removed. Both sections were kept intact.

**Queries (in order)**
1. `Wingfoot Lake Airship Hangar Suffield Ohio coordinates wikipedia` → Wikipedia infobox 41°00′34.2″N 81°21′28.4″W. **Pinned high.**
2. `Hoover Historical Center North Canton coordinates wikipedia Boyhood Home` → 40.8752990,-81.3699230 (alongside Remarkable Ohio 9-76 / trek.zone), plus a conflicting 40°52′40″N 81°22′14″W (~280 m off). **Pinned med (flagged for re-verify).**
3. `Spring Hill Historic Home Massillon coordinates wikipedia` → Wikipedia 40.81213,-81.50610. **Pinned high.**
4. `Five Oaks Massillon NRHP coordinates wikipedia` → NRIS 73001535, 210 4th St NE. No coordinate.
5. `"Five Oaks" Massillon "210 4th" coordinates` → no coordinate. Dead end.
6. `F.A. Seiberling Nature Realm Akron coordinates Smith Road` → **address correction 828 → 1828 Smith Rd** (Canalway / Visit Akron-Summit). No coordinate.
7. `St. Helena III canal boat Canal Fulton hmdb` → HMDB markers for other Canal Fulton sites (Public Square, Heritage Park) and none at the 123 Tuscarawas St dock. Not used.
8. `Paul Brown Museum Massillon address Lincoln Way East hmdb` → 121 Lincoln Way E.
9. `"Paul Brown Museum" Massillon … address 2025` → Visit Canton + **Ohio Magazine**: a permanent space *inside the Massillon Museum*, 121 Lincoln Way E. Address fixed. Pinned med to MassMu's HMDB 269469 coordinate (same building). Ohio Magazine added to the record's sources.
10. `Canton Museum of Art … coordinates` → Wikipedia article surfaced, but no coordinate in the snippet.
11. `First Congregational Church Tallmadge wikipedia coordinates` → no article coordinates. Ideastream 2025-10-29 bicentennial (status).
12. `Kent Stage … coordinates` → Wikipedia infobox 41°9′14.12″N 81°21′23.83″W. **Pinned high.**
13. `Brady's Leap … hmdb coordinates` → only the Kent Bicentennial marker (a relief referencing Brady's Leap). No coordinate.
14. `"Tallmadge Church" OR "Old Town Hall" … remarkableohio` → Remarkable Ohio 9-77 (Old Town Hall & Academy, south end of the Circle) 41.1010610,-81.4414550. **Pinned med** (on the Circle, not the church door).
15. `Liberty Park Twinsburg … coordinates` → addresses only (9999 / 9385 Liberty Rd). No coordinate.
16. `Glen Chamberlin Park Twinsburg mapcarta` → venue address 10260 Ravenna Rd (mapcarta 22657278). The coordinate was not exposed. Address updated.
17. (rejected 400: beaconjournal.com in allowed_domains)
18. North Hill Nepali, domain-filtered → Signal "Taste This: chicken momo at Momo House". Akron Life North Hill (Ben Gage) profile. Nepali Kitchen at 399 E Cuyahoga Falls Ave. Royal Palace, 134 E Tallmadge Ave, is an **event venue/ballroom** → rejected.
19. `"Nepali Kitchen" OR "Momo House"` (akronlife/signal) → Nepali Kitchen dishes (chicken tikka, veg thukpa, bhatura) and "one of Akron's favorites in ethnic/international food". **The outlet for that line could not be pinned down** → Nepali Kitchen still held.
20. (rejected 400: record-courier.com in allowed_domains)
21. Kent `"Mike's Place" OR "River Merchant" OR "Wild Goats"` → Scene "We Like Mike", Ideastream "Beyond the Dish: Mike's Place", Akron Life River Merchant feature (911 N Mantua St), Wild Goats 319 W Main St (Akron Life; no status).
22. Kent `"Taco Tontos" OR "Laziza" OR "Over Easy" OR "Bricco"` → Scene First Look Taco Tonto's, Akron Life listing (123 Franklin Ave), Laziza 195 E Erie St, Over Easy 152 Franklin Ave (Yahoo listing only), Bricco (KentWired COVID mention only).
23. `KentWired Best of Kent 2026 winners` (kentwired.com) → mostly old years. Lucci's (already in), Guys Pizza recognition (year unclear), Over Easy nominations.
24. `"Flury's Cafe" OR "River Brasserie" OR "Richfield Brewing"` → Signal Flury's croissant sandwich. River Brasserie 2291 Riverfront Pkwy (Akron Life *listing*). Richfield Brewing 3871 Broadview Rd (Akron Life ×2 = one outlet).
25. `Flury's Cafe Front Street … address` → **2202 Front St**, Cuyahoga Falls 44221. Signal Taste This (Wed–Sun 8–2). **Roadfood**, Scene all-day breakfast slideshow, Akron Life breakfast blog.
26. `Akron "Sweet Mary's" OR "Angel Falls Coffee" OR "Saffron Patch" OR "Missing Falls"` → Akron Life Angel Falls feature (since 1996), Akron Life Missing Falls feature, Akron Life BOTC 2024 readers' picks (Sweet Mary's), Saffron Patch Akron Life *listing*.
27. `Signal Akron best of the city Sweet Mary's Saffron Patch Missing Falls dish` → Sweet Mary's Best Bakery 2026 (repeat of 2025; macarons, cheesecakes). Saffron Patch Best Ethnic 2026 (chicken makhani, samosas). Missing Falls: no named beer.
28. `best restaurants Hudson Ohio downtown` → Cleveland Magazine "Downtown 140" (140 N Main St), Flip Side, Dave's Cosmic Subs, Hudson's (Scene listings).
29. `"Downtown 140" Hudson 2025 OR 2026` → Trip.com Sept 2026 listing only (open-check). **Held**: no named dish, single editorial outlet.
30. `Taco Tontos Kent Franklin Ave 2025 OR 2026 burrito` → **Kent Stater BOK '26 and BOK '25 Best Mexican (first)**, BOK '24 first. **Cleveland Magazine taco guide** (black bean & sweet potato taco).
31. `Best of Kent 2026 BOK 26` (kentstater.com) → Over Easy at the Depot best breakfast (year attribution unclear). Mike's Place "best restaurant" (old link). Nut House Pub best new business.
32. `Szalay's Farm Peninsula sweet corn` → **4563 Riverview Rd, Peninsula**. Signal "Aw shucks", Akron Life "Making Summer Sweeter", Cleveland 19.
33. `"River Merchant" Kent OR "Laziza" Kent review` → **Kent Stater BOK '25 Best date spot: The River Merchant** (Szechuan short rib, prime rib cheesesteak). **Beacon Journal Local Flavor (via Yahoo): Laziza's Lebanese entrées.**
34. `Laziza Kent Erie Street … 2025 OR 2026` → OpenTable reviews Feb–Mar 2026 (open-check), 4.5/537 (measurement). KentWired gift guide.
35. `Stow OR Tallmadge OR Munroe Falls best restaurant readers favorite` → only Akron Life 2013/2014 lists. Too old, not used.
36. `"Local Flavor" Beacon Journal Hudson OR Stow …` (yahoo/aol) → Garretts Mill Diner (Stow), Lager & Vine (Hudson) and others: one outlet each. Leads only.
37. `Momo House 1548 Home Ave … OR Nepali Kitchen 399 E Cuyahoga Falls Ave … 2026` → both addresses. No dated 2025/26 article (Uber Eats/SEO only).
38. `"Momo House" Akron` (akronlife.com) → confirms the Akron Life North Hill (Ben Gage) piece names Momo House (momos, chow mein, fried rice). **Momo House promoted.**
39. `Wild Goats Cafe Kent closed OR reopen 2025` → only UK Kent results. Wasted. **Status still unverified → held.**
40. `"Mike's Place" Kent 1700 S Water St 2025` → **Kent Stater BOK '25 Best Restaurant (first)**. Spectrum News. Dishes (Hog Wild Horseshoe, Mother Clucker, Reuben).
41. `"Twisted Olive" Green OR "Kingfish" Akron review` → **WKYC** (OpenTable 100 best outdoor dining 2022), **Ohio Magazine** listing, **Cleveland Magazine review "Kingfish Hooks Us"** (grilled bigeye tuna).
42. `Kingfish seafood restaurant Akron address` → **115 Montrose West Ave, Copley 44321** (Akron Life listing + "Kingfish fine dining" blog).
43. `Akron Sweet Mary's / Angel Falls / Saffron Patch addresses` → Sweet Mary's 76 E Mill St 44308. Angel Falls 792 W Market St 44303. **Saffron Patch's address was not confirmed** (1238 Weathervane Ln returned as *Spice of India*) → Saffron Patch held.

**Kept: 11 new food** (sourcecheck PASS, all ≥2 independent credible outlets)
- AKR t2 **Momo House** (1548 Home Ave, Nepali; chicken momo): SIGNALAKRON + AKRONLIFE. *First North Hill Nepali kitchen; the HIMAL gap is now partly filled.* Status evidence is thin (Signal July 2024 hours; nothing dated 2025/26 surfaced) → re-check in the closure pass.
- AKR t3 **Sweet Mary's Bakery** (76 E Mill St; macarons, cheesecakes): SIGNALAKRON (2025+2026 vote) + AKRONLIFE (BOTC 2024).
- AKR t3 **Angel Falls Coffee Company** (792 W Market St; house roasts since 1996): SIGNALAKRON (2025 vote) + AKRONLIFE feature.
- KENT t2 **Mike's Place** (1700 S Water St): KENTWIRED (BOK '25 Best Restaurant) + SCENE + IDEASTREAM + AKRONLIFE.
- KENT t2 **Taco Tontos** (123 Franklin Ave; black bean & sweet potato taco): KENTWIRED (BOK '24/'25/'26 Best Mexican) + CLEMAG + SCENE + AKRONLIFE.
- KENT t2 **The River Merchant** (911 N Mantua St; Szechuan short rib): AKRONLIFE (feature + 20 Best 2026) + KENTWIRED (BOK '25 date spot).
- KENT t3 **Laziza** (195 E Erie St; Lebanese entrées, chicken shawarma): BEACONJOURNAL (Local Flavor via Yahoo) + KENTWIRED. OpenTable 4.5/537 measured only.
- NSUM t2 **Flury's Cafe** (2202 Front St, Cuyahoga Falls; croissant breakfast sandwich): SIGNALAKRON + ROADFOOD + SCENE.
- NSUM t2 **Szalay's Farm Market** (4563 Riverview Rd, Peninsula; roasted sweet corn, seasonal): SIGNALAKRON + AKRONLIFE + CLEVELAND19. Not on cleveland.html. A business, not a CVNP landmark, so the dedup rule does not apply.
- BARB t2 **Kingfish Seafood** (115 Montrose West Ave, Copley; grilled bigeye tuna): AKRONLIFE (Flavor 2026 Best Restaurant) + CLEMAG review.
- BARB t2 **The Twisted Olive** (5430 Massillon Rd, Green; wood-fired pizza): AKRONLIFE (20 Best 2026) + WKYC + OHIOMAG.
Promoted from the held list: Momo House, Sweet Mary's, Angel Falls, Mike's Place, River Merchant, Flury's, Kingfish, Twisted Olive. New: Taco Tontos, Laziza, Szalay's.
Amelia's by The Farmer's Rail was already in the dataset (W1b), so it was not re-added.

**Still held**
- Nepali Kitchen (399 E Cuyahoga Falls Ave): the second outlet could not be attributed with confidence. Royal Palace: an event venue, rejected.
- Saffron Patch: two Signal votes plus an Akron Life listing, but its **address is unconfirmed**.
- Missing Falls Brewery: Akron Life feature + Visit Akron, but **no named beer**.
- Richfield Brewing (Akron Life only). River Brasserie (CLEMAG + Akron Life *listing* only).
- Wild Goats Café: status still unverified. Belleria, Guys Pizza, Over Easy at the Depot, Bricco: KentWired only.
- Downtown 140 / Flip Side (Hudson): one editorial outlet, no dish. Garretts Mill Diner (Stow), Lager & Vine (Hudson): Beacon Journal only.
- Ken Stewart's Grille was already in the dataset with a dish; no action needed.

**Pins (sights)**: 6 added. Wingfoot Lake hangar, Spring Hill and Kent Stage are high (Wikipedia infobox). Hoover Historical Center, Tallmadge Circle and Paul Brown Museum are med (search-result coordinate with a conflict; Remarkable Ohio 9-77; co-located MassMu HMDB 269469).
Still UNVERIFIED: F.A. Seiberling Nature Realm (address fixed to 1828 Smith Rd), Twins Days (venue address 10260 Ravenna Rd), St. Helena III, Canton Museum of Art, Five Oaks, Liberty Park, Brady's Leap. All 11 new food are unverified too (geocode-helper).
**Build:** `rebuild-city.py akron-oh --build` → 93 places, **35 pins** (was 29). sourcecheck PASS · geocheck PASS · statuscheck CONSISTENT · buildcheck PASS · check-escapes PASS. `npm run validate` + `npm test` green.
Tooling: `tools/build-akron.py` Cleveland-leak exemption widened for the outlet name "Cleveland 19" (it still fires on a real template leak).
Density: AKR 37/60 · CANT 16/45 · NSUM 13/35 · KENT 12/30 · MASS 8/20 · BARB 7/20.

## 2026-10-03 · W2b pins + promotions + KENT/NSUM food
(Written by the orchestrator: the W2b agent hit an API rate limit after writing its JSON outputs but before
writing this section, so its per-query log is lost; outcomes below are reconstructed from its files.)
- **Promoted held leads → kept (11 food, FOOD_W2B.json):** AKR Momo House (Signal Akron + Akron Life; North Hill
  Nepali; partly closes the HIMAL gap), Sweet Mary's Bakery, Angel Falls Coffee (Signal + Akron Life) · KENT Mike's
  Place (KentWired + Scene + Ideastream + Akron Life), Taco Tontos (KentWired + Cleveland Magazine + Scene + Akron Life),
  The River Merchant (Akron Life + KentWired), Laziza (Beacon Journal + KentWired) · NSUM Flury's Cafe (Signal +
  Roadfood + Scene), Szalay's Farm Market (Signal + Akron Life + Cleveland 19; not on cleveland.html) · BARB Kingfish
  Seafood (Akron Life + Cleveland Magazine), The Twisted Olive (Akron Life + WKYC + Ohio Magazine).
- New source keys: SOURCES_W2B.json (CLEVELAND19 + 1). build-akron.py Cleveland-leak exemption extended to the
  outlet name "Cleveland 19" (a TV station, not template data).
- **Sight fixes (SIGHTS_W1B.json):** Paul Brown Museum address = 121 Lincoln Way E inside the Massillon Museum (+OHIOMAG);
  F.A. Seiberling Nature Realm = 1828 Smith Rd (not 828); Twins Days venue = Glen Chamberlin Park, 10260 Ravenna Rd.
- **Pins added (5):** Wingfoot Lake hangar, Spring Hill, The Kent Stage (Wikipedia infobox, high) · Tallmadge Circle
  & church (Remarkable Ohio marker 9-77 on the Circle, med) · Paul Brown Museum (HMdb marker 269469 at MassMu, med).
- **Held pin:** Hoover Historical Center — the two search coordinates disagree by ~280 m → set UNVERIFIED in
  geocodes.json (CLAUDE.md 4b: a conflicted pin is not shipped) until a place pin resolves it.
- Still unpinned sights: Seiberling Nature Realm, Twins Days, St. Helena III, Canton Museum of Art, Five Oaks,
  Liberty Park, Brady's Leap, Hoover. All 11 W2b food → browser geocode-helper queue.
- Search count unknown (≤45 cap).

## 2026-10-03 · W3a CANT+MASS food
(in progress, written incrementally)

**Queries**
1. `Papa Gyros Canton Ohio` → Visit Canton directory (2045 Cleveland Ave NW; huge gyros, since 2001) + **Akron Life Flavor "papa of all gyros"** → 2nd outlet for the Repository-panel lead → KEPT.
2. `best restaurants Canton Ohio` [visitcanton.com] → downtown dining (Lucca, Bender's, Basil), International (Blue Habanero), breakfast Stark11 (Gregory's).
3. `Canton Stark County restaurants best` [ohiomag/clemag/akronlife] → Akron Life "Winning Eats in Canton", Good Fortune (Akron Life only), Muskellunge Brewing (Akron Life). Ohio Magazine Visit Canton post = *sponsored*, not counted.
4. `Lucca Canton … address` → 228 4th St NW (OpenTable listing used for the address only, not as a source).
5. `Canton restaurants Lucia's Blue Smoke Arcade Market` [6 editorial domains] → Akron Life "Winning Eats in Canton": Lucia's (4769 Belpar St NW, filet/veal), Blue Smoke (Belden Village Mall food court, Texas BBQ); WKYC Mélange opening (221 Market Ave N).
6. `"A Clevelander's Guide to Canton" 21 must-go` [clemag] → new leads: Dough Co. Doughnuts, Fronimo's Downtown, Smoosh Cookies, Starflyer Brewing, Tremont Coffee, Twisted Cafe, Walkie Talkie Espresso.
7. `330 Flavor Awards winners 2026 Canton…` [akronlife] → no Stark-specific winners surfaced (Canton Importing mentioned, Best Artisan Food Shop honourable mention).
8. `Canton Repository Stark County best coney dog` → nothing credible (delivery listings, Dog Daze). 
9. `Canton Ohio coney island hot dog … history` → nothing for Canton OH. **GAP STATED:** no Canton coney-dog place surfaced that meets the bar in this wave.
10. (allowed_domains with cantonrep.com → 400 error; not counted as a result.) `Canton Repository … Blue Habanero Gregory's Doug's` [aol/yahoo] → nothing usable.
11. `Stark County favorite restaurants readers poll Repository` [aol/yahoo] → Repository foodie panel (re-confirms Francisco's Cantina: nachos/tacos); USA Today Restaurants of the Year Stark lead.
12. `USA TODAY Restaurants of the Year Stark County` → Mahoning Matters: **Social at the Stone House**, Massillon, USA Today best restaurants 2025.
13. `"Great lunch spot…" 10 in Stark County` → Repository lunch list (Deli Ohio, BAM! Healthy Cuisine) — single outlet, not pursued.
14. `"Social at the Stone House" Massillon USA TODAY … address` → 824 Lincoln Way E, opened July 2021.
15. `Massillon restaurant Social Stone House dish OR "At Your Table"` → Akron Life feature (tuna tartare avocado stack, chef Jeff Herman) → KEPT MASS t1. At Your Table: nothing surfaced.
16. `Francisco's Cantina Lucia's Steakhouse Blue Smoke Canton` [visitcanton] → Lucia's Steakhouse directory (Hob Nob lineage, 4769 Belpar) → KEPT (Akron Life + Visit Canton). Francisco's / Blue Smoke: no 2nd source.
17. `Stark County breweries Starflyer … Muskellunge` → Visit Canton directories; Starflyer (500 Cleveland Ave NW; CLEMAG + VISITCANTON, but **no named beer** → HELD, same rule as Missing Falls); Muskellunge (Akron Life feature + Visit Canton + News 5 HOF Hops trail; Tiger Musky Double IPA) → address not surfaced → HELD.
18. `Canton "Walkie Talkie" OR "Dough Co" OR Fronimo's OR "Smoosh Cookies"` [7 editorial domains] → **Walkie Talkie**: Ohio Magazine + Akron Life ×2 (+ CLEMAG) → KEPT. Dough Co., Smoosh: nothing. Fronimo's: event listing only.
19. `Alliance … OR Hartville … OR Louisville … OR Canal Fulton restaurant` [ohiomag/akronlife/clemag] → Akron Life *directory listings* only (Grinders Alliance, Hartville Pie Factory) — not merit; Hartville Kitchen already in dataset.
20. `Canal Fulton Massillon things to do eat weekend` [ohiomag/clemag/wkyc] → Chloe's Diner (already in), Royal Docks lead.
21. `Royal Docks Brewing Canton Jackson Township` → **WKYC: Jackson Twp brewhouse/taproom (7162 Fulton Dr NW) CLOSED Sept 21**; Foeder House at Oakwood Square status/address not confirmed → not added (logged).
22. `Walkie Talkie … address hours 2025` → 504 15th St NW, Canton 44703; current hours (Akron Life/Ohio Mag) → status open.
23. `Muskellunge Brewing … address` → no street address surfaced → HELD.
24. `Canton "Blue Habanero" OR "Gregory's…" OR "Doug's Classic 57" OR "Grumpy Troll" OR "Samantha's"` [8 editorial] → Samantha's Downtown (217 Market Ave; peach pecan pancakes, tuna melt) in Akron Life "Winning Eats in Canton" → with Visit Canton = 2 sources, but street direction/status unconfirmed → HELD. Blue Habanero: the CLEMAG/Scene coverage is the **Cleveland** (Gordon Square) restaurant — cannot be transferred to the Canton listing → still HELD. Gregory's, Doug's, Grumpy Troll, Pete's: nothing → HELD.
25. `Massillon restaurant review Lincoln Way …` → re-confirms Social at the Stone House, Chloe's (in). Mary Ann Donuts: delivery listing only.
26. `"renaissance of downtown Massillon" …` → Paradigm Shift Craft Brewery, Downtown by Hecks (Visit Canton only).
27. `Paradigm Shift Craft Brewery Massillon … address` → no street address, no 2nd outlet → HELD.
28. `Canton OR "North Canton" OR Massillon OR Alliance food-drink` [ohiomag] → Ohio Magazine "12 Reasons to Visit Canton": Fourth Street Collective (Woodshop, Deli Ohio, Mike's Pizza NY-style); Newman Creek Cellars (Massillon, Camelot-themed wines; Ohio Mag wine regions — single outlet → HELD); Canton Food Tours.
29. `Deli Ohio Woodshop Mike's Pizza Fourth Street Collective … address` → Repository (AOL) opening story: 328 Walnut Ave NE.
30. `"What's for dinner? HOF visitors … 15 must-visit eateries"` → Repository list: Mike's Pizza (fermented-dough NY pies), Heritage Bistro (new; single outlet), Jerzee's → **Mike's Pizza & Deli Ohio KEPT** (Repository ×2 = one outlet + Ohio Magazine + Visit Canton).
31. `Canton Stark County restaurant closed 2025 OR 2026 … Lucia's OR Lucca OR "Papa Gyros" OR "Samantha's"` → no closure for any kept place (Nacho Mama's Canton closed Jan 2025: not a candidate). Samantha's Sunny Corner (Hills & Dales, 1991 original) is open, but the held lead is Samantha's Downtown.
32. `Canton OR Massillon … restaurant worth the drive` [scene/clemag] → 91 Wood Fired Oven (CLEMAG guide), The Butcher, Fedeli (attribution unclear → HELD).
33. `"91 Wood Fired Oven" OR "The Butcher" OR "Fedeli" Canton address` → 91 WFO: 5570 Fulton Dr NW + 1983 E Maple St (N. Canton) → KEPT t3 (CLEMAG restaurant guide + Visit Canton). The Butcher / Fedeli: no address → HELD.
34. `Sippo Lake Park … coordinates` → Stark Parks (5300 Tyner St NW, 300 acres, 1977) + Trek Ohio + Repository (kayak launch) → KEPT sight; coordinate truncated → unverified.
35. `Ohio Society of Military History museum Massillon` → "Ohio Military Museum", 316 Lincoln Way E (Clio + directories).
36. `"Ohio Military Museum" Massillon 316 Lincoln Way` → no 2nd credible source and no 2025/26 status → HELD.
37. `Glamorgan Castle Alliance … NRHP` → NPS NRHP asset (1025 S Union Ave, listed 1972) + Visit Canton + News 5 → KEPT sight (CANT t1, the Alliance anchor). No coordinate → unverified.
38. `Lake Anna Barberton …` → Wikipedia Lake Anna Park + Barberton library history + Canalway Magic City quest → KEPT sight (BARB). No coordinate in snippet → unverified.
39. `Stark County best burgers OR pizza OR wings … Repository` [aol/yahoo] → Yahoo Local directory junk only.
40. `Canal Fulton … restaurant brewery coffee` [6 domains] → Visit Canton Canal Fulton Stark11 (Speakeasy Coffee, The Exchange, Barrel Room, **At Your Table Cafe & Catering** — directory only, no 2nd outlet → HELD), Ohio Magazine "3 Just-Off-The-Trail Breweries and Bars".
41. `"Canal Boat Lounge" Canal Fulton towpath burger` → Ohio Magazine (photo caption + text: family-owned since 1994, burgers) + Visit Canton Stark11 (+ Islands) → KEPT.
42. `Canal Boat Lounge … address` → 119 S Canal St, Canal Fulton 44614.

**Kept (8 food + 3 sights):**
- MASS t1 **Social at the Stone House** (824 Lincoln Way E; tuna tartare avocado stack): MAHONINGMATTERS (USA Today Restaurants of the Year 2025) + AKRONLIFE.
- MASS t3 **Canal Boat Lounge** (119 S Canal St, Canal Fulton; burgers): OHIOMAG + VISITCANTON.
- CANT t2 **Papa Gyros (Cleveland Ave)** (2045 Cleveland Ave NW; huge gyro): CANTONREP panel + AKRONLIFE + VISITCANTON. *Promoted from held.*
- CANT t2 **Lucca** (228 4th St NW; hand-made pasta, double-boned pork chop): CANTONREP panel + VISITCANTON. *Promoted from held* (same standard as Desert Inn / Bocca Grande).
- CANT t3 **Lucia's Steakhouse** (4769 Belpar St NW; filet, veal): AKRONLIFE + VISITCANTON.
- CANT t2 **Walkie Talkie Espresso & Coffee** (504 15th St NW; habanero latte): OHIOMAG + AKRONLIFE + CLEMAG.
- CANT t2 **Mike's Pizza & Deli Ohio (Fourth Street Collective)** (328 Walnut Ave NE; fermented-dough NY pizza): CANTONREP ×2 + OHIOMAG + VISITCANTON.
- CANT t3 **91 Wood Fired Oven** (5570 Fulton Dr NW; wood-fired pizza): CLEMAG guide + VISITCANTON (weakest keep, mention-level; revisit if a rave or award surfaces).
- Sights: CANT t1 **Glamorgan Castle** (NPS NRHP), CANT t2 **Sippo Lake Park** (Stark Parks), BARB t2 **Lake Anna Park** (Wikipedia).
**Still held:** Francisco's Cantina (Repository panel only), Blue Habanero (Canton listing; editorial coverage is the Cleveland restaurant), Gregory's, Doug's Classic 57, Pete's, Grumpy Troll, Samantha's Downtown (Akron Life + VC, address/status), Starflyer Brewing (no named beer), Muskellunge Brewing (address), Paradigm Shift (address/2nd), Newman Creek Cellars (Ohio Mag only), At Your Table (VC only), Blue Smoke (Akron Life only), Good Fortune (Akron Life only), Heritage Bistro (Repository only), The Butcher / Fedeli (attribution), Dough Co. / Smoosh / Tremont Coffee / Twisted Cafe / Fronimo's (CLEMAG only), Ohio Military Museum (2nd source/status), Royal Docks Foeder House (status).
**Rejected / logged:** Royal Docks Jackson Twp taproom (CLOSED Sept 21, WKYC). Ohio Magazine sponsored Visit Canton posts (not counted). Yahoo Local / OpenTable / Toast (address-only). **Canton coney GAP stated:** no Canton coney-dog place met the bar this wave (searches 8–9).
**Pins:** 0 new. All 8 food → geocode-helper queue; the 3 sights have no attributable coordinate yet (Sippo snippet was truncated, so it was not used). Nothing was estimated.
**Searches used: 42 of 45** (plus 1 rejected call to the cantonrep.com domain filter, which returned a 400 error).
New source keys: MAHONINGMATTERS, BARBERTONLIBRARY (SOURCES_W3A.json).
- **Orchestrator review (W3a):** dropped **91 Wood Fired Oven** — its two sources are a Cleveland Magazine
  restaurant-guide listing + a Visit Canton directory entry; a listing is not merit (SOURCES.md merit bar: no award,
  vote, rave or measured rating). Back to held. W3a nets 10 places (7 food + 3 sights).

## 2026-10-03 · W3b NSUM+KENT food
(in progress, written incrementally. Note: Amelia's by the Farmer's Rail is already in the dataset — skipped.)

**Queries**
1. `Richfield Brewing Company Richfield Ohio beer restaurant` [7 editorial] → Akron Life ×2 (opened late 2024, 3871 Broadview Rd; Minuteman lager Reuben, Golden Café ale) — one outlet → still HELD.
2. `330 Flavor Awards winners 2026 Cuyahoga Falls Hudson Kent Stow` [akronlife] → 2026 winners: Best New = Amelia's (already in dataset); Best Restaurant Portage Co. = Ray's Place (in), River Merchant (in), **The Lake House Kitchen & Bar** (3rd).
3. `"330 Flavor Awards" 2026 best brewery/breakfast/coffee/ice cream` [akronlife] → **Best Brewery 2026: McArthur's Brew House** (1st), Eighty-Three Brewery, Hoppin' Frog.
4. `McArthur's Brew House Stow Ohio` [8 editorial] → it is Cuyahoga Falls, 2721 Front St; Cleveland Magazine Beer Guide feature (Blueberry Wheat Ale, Hillside Daze Blonde) + Ohio Mag Craft Beer Guide 2019 + Scene "19 Akron-area breweries" → **KEPT** (CLEMAG + AKRONLIFE award).
5. (record-courier.com in allowed_domains → 400; not crawlable, dropped from filters.) `"Lake House Kitchen" Portage County` [6 editorial] → Akron Life feature (East Lake / Twin Lakes, Kent; New England clam chowder, grouper bites, buoy burger) + Akron Life award = one outlet → HELD (no street address surfaced either).
6. `KentWired best of Kent … Bricco Over Easy Guys Pizza Belleria` [kentwired] → Bricco Kent 210 S Depeyster (opened 2014, KentWired news only); Over Easy 152 Franklin Ave (Best of Kent nominations); Guys Pizza #2 Best drunk food (KentWired only). No 2nd outlets.
7. `"Over Easy" Kent Ohio Franklin Ave breakfast` [7 editorial] → nothing for Over Easy; leads: Franklin Hotel Bar (Scene feature), Scene "30 destination restaurants worth the drive".
8. `"Destination Restaurants Worth The Drive From Cleveland" Kent Hudson…` [scene] → Scene: **Brimfield Bread Oven** (3956 OH-43, Kent/Brimfield), Dave's Cosmic Subs (186 N Main St, Hudson), Emilio's (Hudson), **Café Toscano** (215 W Garfield Rd, Aurora; wild-boar Bolognese pappardelle), Ray's (in).
9. `Hudson … Emilio's OR Dave's Cosmic Subs OR Café Toscano` [6 editorial] → Akron Life "A Taste of Italy" feature on Café Toscano (pork-shank osso buco) → 2 outlets; Dave's Cosmic Subs: Akron Life listing + CLEMAG chain-growth news (20 locations) — business news, not a rave → HELD.
10. `"Brimfield Bread Oven" wood-fired bakery` [7 editorial] → CLEMAG Best Bakeries + CLEMAG Food Lovers' Guide + WKYC "Behind the Menu" (+ Scene) → **KEPT** (country sourdough, German pretzels, wood-fired pizza).
11. `Emilio's Restaurant Hudson Ohio …` [open] → Scene review (owner Fernando Nunez, ex-Mallorca) + Foods & Wines from Spain certified-restaurant entry; no address/status → HELD.
12. `Cuyahoga Falls OR Stow OR Tallmadge restaurant best favorite` [signal/ohiomag/clemag] → CLEMAG "Cuyahoga Falls' 18 Best Restaurants and Bars", CLEMAG review "The River Brasserie & Bar: Room With a View" (one of the region's best fish sandwiches), CLEMAG "Down South: Russo's" (jambalaya/étouffée), Ohio Mag Best Hometowns 2023 Cuyahoga Falls; leads Leo's Italian Social, Shawarma Brothers.
13. `"Cuyahoga Falls' 18 Best…" River Brasserie Russo's Leo's…` [clemag] → River Brasserie (1914 hydro plant) and Leo's Italian Social (Sicilian mule, limoncello) on the list; also Boss ChickNBeer, Butcher & Sprout, El Meson. All CLEMAG = one outlet.
14. `"River Brasserie" OR "Boss ChickNBeer" OR "Butcher & Sprout"` [6 editorial] → River Brasserie 2291 Riverfront Pkwy Ste 100 (Akron Life *listing* only); Boss ChickNBeer 1791 Front St (Scene opening news Jan 2024 + Scene "new restaurants this year"); Butcher & Sprout (Akron Life only). Opening news + a CLEMAG list mention is not merit → all three still HELD.
15. `Hudson Ohio downtown restaurant feature dish chef` [4 editorial] → **Downtown 140** (CLEMAG "A Taste of Downtown" + Akron Life Flavor feature; chef Shawn Monday; duck-confit spring rolls) — status/address unconfirmed; One Red Door (Monday's Meatball; single outlet); Peachtree Southern Kitchen (Scene only); Revival Room (Scene opening).
16. `"Downtown 140" Hudson Ohio 140 N Main St 2025` [open] → nothing (real-estate noise) → Downtown 140 HELD (no address/status evidence).
17. `Peninsula Ohio OR Garrettsville OR Aurora OR Ravenna restaurant worth the trip` [ohiomag/akronlife/clemag] → CLEMAG "Down South: Russo's" (Peninsula); Christopher's Aurora Bistro, The Cabin (Akron Life listings only).
18. `Russo's restaurant Peninsula Ohio Cajun …` [open] → **Russo's** 4895 State Rd, Peninsula 44264 (in Cuyahoga Falls; opened Aug 2002, chef David Russo, Emeril-trained): CLEMAG review + Akron Life feature + Scene "Russo's on the Rise" review + Food Network restaurant page → KEPT pending status.
19. `"Eating Your Way Through Kent" OR … Bricco Belleria Franklin Hotel Wild Goats` [4 editorial] → Akron Life Kent round-up: Wild Goats Café 319 W Main St, Belleria 135 E Erie St Ste 202, Bricco (pub/brick-oven); Scene feature on Franklin Hotel Bar; CLEMAG "Downtown Kent".
20. `Belleria pizza Kent OR "Franklin Hotel Bar" OR "Wild Goats" 2025` [kentwired] → Belleria won KentWired-covered student "Pizza Wars" (pierogi pizza); Franklin Hotel Bar (KentWired: chile-cumin lamb meatballs, shrimp/chorizo flatbread); Wild Goats = home of Front Door Burger / Flash Bagels / FizziMoo ghost kitchens; Pufferbelly closed (KentWired). No 2025/26 dated evidence for any.
21. `"Franklin Hotel Bar" Kent Ohio address hours` [open] → Franklin Hotel 176 E Main St (Wikipedia); Tue–Sat hours (undated). Scene + KentWired = 2 outlets but no dated 2025/26 status → HELD.
22. `"330 Flavor Awards" 2026 … brunch/bakery/wings/Italian/Mexican/cocktails` [akronlife] → Best Brunch Rosewood Grill; Best Cocktails Thyme2; Best Doughnuts Jubilee Donuts; Best Cake West Side Bakery (locations not stated in snippet).
23. `"Best of Kent" 2025 best restaurant/pizza/breakfast/coffee` [kentwired] → Scribbles Coffee Co. Best Coffee 2023 + 2024 (KentWired BOK reader vote); Lucci's (in) best pizza ×4.
24. `Scribbles Coffee Kent Ohio` [7 editorial] → 237 N Water St; CLEMAG "Cleveland Coffee Guide: 34 Shops and Cafes We Love" + Akron Life "Bean Buzz" (Black Squirrel, hot honey latte) → **KEPT**.
25. `Kent Ohio "Scribbles Coffee" OR "Brimfield Bread Oven" 2026` [open] → Kent Stater (= KentWired outlet) **BOK '26 Best Coffee: Scribbles** (since 2007); The Portager: **Brimfield Bread Oven 10th anniversary Jan 6 2026**, added Tuesdays → both status OPEN 2026.
26. `"Russo's" Peninsula OR "Cafe Toscano" Aurora 2025 OR 2026` [open] → Café Toscano current OpenTable listing w/ hours + March 2026 reviews (status evidence only) → **Café Toscano KEPT** (Scene + Akron Life). Russo's: no dated status.
- Extra sources for EXISTING records (FOOD_W1B.json, edited in place): Amelia's ← CLEMAG feature "Amelia's Lounge Solidifies Cuyahoga Falls' Status as a Dining Destination" (ahi tuna nachos); Ray's Place ← Scene destination list (MoFo burger) + Akron Life 2026 Flavor Awards (Best Restaurant in Portage County).
27. `Russo's restaurant State Road … David Russo 2025` [7 editorial] → re-confirms 4895 State Rd (Cuyahoga Falls, Peninsula mailing address), Scene "Ready for Russo's" + "Russo's on the Rise", Akron Life feature, and the Akron Life 2026 330 Flavor Awards page surfaces for Russo's → status OPEN (2026) → **Russo's KEPT** NSUM t1 (CLEMAG + SCENE + AKRONLIFE).
28. `Stow Ohio restaurant review OR best …` [5 editorial] → Akron Life listings only (Skyway Drive-In, El Campesino, StowNut, Bellacino's); Akron Life "A Good Bistro on Main" (Bistro on Main, 1313 W Main St, Kent; single outlet) → nothing kept. **Stow gap stated** for this wave.
29. `Garrettsville OR Ravenna OR Mantua OR Streetsboro … feature` [6 editorial] → Akron Life "Water wheel dining at Garrett's Mill" (Ma Barker birch beer); Candlelight Winery, Lager and Vine (Hudson), Riverside Wine (listings).
30. `"Garrett's Mill" Garrettsville brewing restaurant` [7 editorial] → Ohio Magazine "3 Historic Ohio Mills You Can Visit" (8148 Main St; 1804 mill, 1977 waterwheel) → 2nd outlet. Scene: Main Street Grille & Brewing (Garrettsville) chef story; Scene "Retro Burger and Pizzeria DiLauro" feature (location not stated).
31. `"Garrett's Mill" Garrettsville 2026 OR 2025` [open] → kent.edu: KSU 2026 Coaches Caravan at Garrett's Mill, July 14 2026 → OPEN; Restaurant Impossible feature noted. **KEPT** KENT t2. Main Street Grille & Brewing → Brewbound "Out of Business" → REJECTED (closed).
32. `Richfield Brewing OR Twinsburg OR Macedonia OR Hudson new restaurant review chef` [4 editorial] → Blue Canyon Kitchen & Tavern (Twinsburg; CLEMAG 2006 Silver Spoon Awards); Revival Room (Hudson; Scene opening only); One Red Door alumni mention. Richfield Brewing: nothing beyond Akron Life.
33. `"Blue Canyon Kitchen" Twinsburg` [open] → 8960 Wilcox Dr; CLEMAG review "Red Hot and Blue" + Scene (opened 2004, chef Brandt Evans, national-park-lodge room). No named dish and only undated booking pages for status → HELD.
34. `"BOK '26" best brewery/breakfast/pizza/restaurant Kent` [kentstater/kentwired] → BOK '26: Best Breakfast **Over Easy at the Depot**, Best Restaurant Mike's Place (in), Best New Business The Nut House Pub and Grille. Over Easy: KentWired only → HELD (needs 2nd outlet).
35. `"Rosewood Grill" Hudson Ohio` [5 editorial] → 36 E Streetsboro St, Hudson (the original location; no reservations); CLEMAG "Worth the Wait"; Scene news on Hospitality Restaurants building on its success.
36. `Rosewood Grill Hudson signature dish brunch review` [3 editorial] → Akron Life: Maine lobster frittata with triple-cream Brie + quinoa hash browns; voted #1 Best Brunch in the 2023 Flavor Awards (and the 2026 Best Brunch, search 22) → **KEPT** NSUM t2 (AKRONLIFE + CLEMAG + SCENE). Not on cleveland.html.
37. `"BOK '25" best pizza Belleria OR Guys OR Lucci's` [kentstater] → BOK '25: Lucci's #1 (9th straight year, already in), **Belleria #2**, Guys Pizza #3. Belleria now = KentWired vote + Akron Life Kent round-up mention, with 2025 status — but it would be a second Kent pizza behind Lucci's, which already holds that niche → HELD as padding (SOURCES.md merit bar). Guys Pizza: KentWired only → HELD.

**Kept (7 food, FOOD_W3B.json):**
- NSUM t1 **Russo's** (4895 State Rd, Peninsula — in Cuyahoga Falls; crawfish Monica, jambalaya): CLEMAG + SCENE + AKRONLIFE; status via 2026 Flavor Awards page.
- NSUM t2 **McArthur's Brew House** (2721 Front St, Cuyahoga Falls; Blueberry Wheat Ale): AKRONLIFE (2026 Best Brewery, a reader vote) + CLEMAG Beer Guide.
- NSUM t2 **Rosewood Grill** (36 E Streetsboro St, Hudson; lobster frittata brunch): AKRONLIFE (Best Brunch 2023 + 2026) + CLEMAG review + SCENE.
- KENT t2 **Brimfield Bread Oven** (3956 State Route 43, Kent/Brimfield; wood-fired sourdough, pretzels): CLEMAG Best Bakeries + WKYC + SCENE; 10th anniversary Jan 2026.
- KENT t2 **Scribbles Coffee Co.** (237 N Water St, Kent; Black Squirrel): KENTWIRED (Best of Kent coffee 2023/24/26 vote) + CLEMAG coffee guide + AKRONLIFE.
- KENT t2 **Café Toscano** (215 W Garfield Rd, Aurora; wild-boar Bolognese pappardelle): SCENE destination list + AKRONLIFE feature.
- KENT t2 **Garrett's Mill & Brewing Co.** (8148 Main St, Garrettsville; Ma Barker birch beer): AKRONLIFE + OHIOMAG (+ KSU 2026 event).
- Extra sources for existing records: Amelia's (+CLEMAG feature), Ray's Place (+SCENE, +AKRONLIFE 2026 award).
**Promoted from held:** none of the W2 held list cleared the bar in this wave (Amelia's was already in the dataset).
**Still held:** Richfield Brewing (Akron Life ×2 only), The Lake House Kitchen & Bar (Akron Life ×2 only; no street address), River Brasserie (CLEMAG ×2 + Akron Life listing), Boss ChickNBeer (opening news + CLEMAG list mention), Butcher & Sprout, Leo's Italian Social, Shawarma Brothers (one outlet each), Downtown 140 (CLEMAG + Akron Life; no address/status), One Red Door, Peachtree Southern Kitchen, Revival Room (one outlet), Emilio's (Scene + Spain trade certification; no address/status), Dave's Cosmic Subs (chain-growth news, not a rave), Franklin Hotel Bar (Scene + KentWired; no dated status), Bricco Kent (KentWired news + Akron Life mention), Belleria (padding behind Lucci's), Guys Pizza, Over Easy at the Depot (KentWired only), Wild Goats Café (no dated status), Blue Canyon (no dish/status), Bistro on Main, Christopher's Aurora Bistro, The Cabin (Akron Life only), Ken Stewart's (not searched; budget).
**Rejected / logged:** Main Street Grille & Brewing, Garrettsville (Brewbound "Out of Business"); Pufferbelly, Kent (closed, KentWired). Ohio Magazine "Central Portage County" result is *sponsored* (not counted).
**Gaps stated:** Stow, Tallmadge, Macedonia, Bath, Richfield, Ravenna, Streetsboro and Mantua produced no food place that met the bar in this wave.
**Pins:** 0 new. All 7 food are UNVERIFIED and queued for geocode-helper.html (`geo/_geoout_w3b.json`). Nothing was estimated.
**New source keys:** none. Kent Stater URLs (kentstater.com) are filed under the existing KENTWIRED outlet, which is the same student newsroom.
**Searches used: 38 of 40** (37 logged queries; entry 5 covers two calls), including one call that failed with a 400 error because record-courier.com is not crawlable.

## 2026-10-03 W4 · batch 1 — PIN PASS (Waze / usarestaurants place pins)
- **Channel finding:** `allowed_domains:["maps.apple.com"]` returns Apple place URLs for Ohio but almost all are bare
  `place-id=` (no `coordinate=`) — 0 usable of ~8 probes. What works here: one place per query,
  `"<Name> <street address> latitude longitude"` with `allowed_domains:["waze.com","usarestaurants.info","foursquare.com"]`.
  Waze live-map place records (`place.w.*` / Google `ChIJ…` place ids) and usarestaurants.info listing pages carry the
  place coordinate; ~70% hit rate. Waze place with matching name+address = **high**; usarestaurants listing or a Waze
  place whose number differs slightly (Ray's 153 vs 135 Franklin; Mr. Zub's 812 vs 795 W Market) = **med**.
  Every point sanity-checked against the street (bbox + neighbourhood). `geo/_geoout_w4pins.json`.
- **+51 pins** (46 food + 9 sights… incl. Glamorgan Castle & Lake Anna from Wikipedia coords, Canton Museum of Art,
  Seiberling Nature Realm, Brady's Leap, Liberty Park, Twins Days/Glen Chamberlin, Sippo Lake): **34 → 85 rendered**
  (high 58 · med 27 · low 0). ≈98 WebSearch calls.
- **Held / rejected (UNVERIFIED stays):** Desert Inn (Waze place lists 204 12th St **NE**, point on Market Ave centreline
  vs our 12th St NW) · Crave (Apple + Foursquare list **156 S Main St** vs our 57 E Market St — address re-check; may
  have moved) · Wally Waffle Downtown (Foursquare: 845 W Market "Now Closed" + 3997 Medina Rd; Locust St unconfirmed —
  status check) · Momo House (only coordinate surfaced belonged to another listing) · Hoover Historical Center
  (Wikipedia 40.874177,-81.397228 vs Waze "Hoover Park" 40.875385,-81.37004 — still conflicting) · St. Helena III
  (only 3-decimal coords) · Five Oaks · Garrett's Mill (8148 Main St = former Main Street Grill & Brewing on Foursquare;
  no pin). No result: Taggart's, Fred's Diner, Cilantro, Hoppin' Frog, Bombay Sitar, Bocca Grande, Angel Falls, Taco
  Tontos, Social at the Stone House, Rosewood Grill, Café Toscano, McArthur's, Farmer's Rail/Amelia's, Village Inn,
  New Era, Mustard Seed.
- Gates: sourcecheck PASS · geocheck PASS (85/85) · statuscheck CONSISTENT · buildcheck PASS · validate + npm test PASS.
