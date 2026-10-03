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
