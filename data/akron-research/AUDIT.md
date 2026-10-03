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
