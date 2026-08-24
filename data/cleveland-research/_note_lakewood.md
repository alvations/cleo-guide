# Lakewood + inner-ring expansion — research note (Aug 2026)

Discovery agent pass extending the **Cleveland** guide into **Lakewood (focus) + nearby inner-ring**
(Rocky River, Cleveland Heights, Bay Village/Larchmere, Detroit-Shoreway/Gordon Square, Tremont/Ohio
City deeper cuts). Engine page `cleveland.html` was NOT edited. Three research files written here:
`FOOD_LAKEWOOD.json` (12 records), `SIGHTS_LAKEWOOD.json` (11 records), `CREATORS_LAKEWOOD.json`.

All places checked against the existing 143 sights + 45 food to avoid duplicates. Every place carries
**>=2 credible editorial/institutional sources** (Yelp/TripAdvisor/Google counted 0). Open/closed
fact-checked for 2025/2026. **NO coordinates** (geocoding is a separate stage). Merit-measured and
re-ranked within region; padding dropped.

## `_sourcekeys` — every source KEY used (name + url) for the orchestrator to register

- **N5** — News 5 Cleveland (WEWS, local TV numbered lists) — https://www.news5cleveland.com
- **SCENE** — Cleveland Scene (alt-weekly; Essential Lakewood, best breweries, food influencers) — https://www.clevescene.com
- **CLEVMAG** — Cleveland Magazine (city glossy; Lakewood's 24 Best, 25 Best Restaurants, 28 Best Breweries, Best of the West/East, Classic Cleveland Restaurants) — https://clevelandmagazine.com
- **CLEVELANDCOM** — cleveland.com / The Plain Dealer (metro daily) — https://www.cleveland.com
- **DESTCLE** — Destination Cleveland (CVB, thisiscleveland.com) — https://www.thisiscleveland.com
- **OHIOORG** — Ohio.org / TourismOhio (state tourism; also carries OhioDNR birding-trail) — https://ohio.org
- **OHIOMAG** — Ohio Magazine (regional magazine) — https://www.ohiomagazine.com
- **INFATUATION** — The Infatuation Cleveland (digital food desk) — https://www.theinfatuation.com/cleveland
- **ESQUIRE** — Esquire (Best New Restaurants in America) — https://www.esquire.com
- **JAMESBEARD** — James Beard Foundation (award/institutional authority) — https://www.jamesbeard.org
- **CLEVHIST** — Cleveland Historical (Cleveland State Univ. Center for Public History + Digital Humanities) — https://clevelandhistorical.org
- **ECH** — Encyclopedia of Cleveland History (Case Western Reserve University) — https://case.edu/ech
- **METROPARKS** — Cleveland Metroparks (official park authority) — https://www.clevelandmetroparks.com
- **HERITAGEOHIO** — Heritage Ohio (statewide preservation/heritage org) — https://www.heritageohio.org
- **CLIO** — Clio (history & culture education platform) — https://theclio.com
- **GOLAKEWOOD** — City of Lakewood / LakewoodAlive ("Go Lakewood") — https://www.lakewoodoh.gov
- **OHIOTRAV** — Ohio Traveler (regional travel outlet) — https://www.ohiotraveler.com

Creator keys (in `CREATORS_LAKEWOOD.json`): THINGSIVEBEENEATING, CLEVELANDFOOD25, THATSWHATSHEEATS,
FOODSOFJANE.

## Closed / dropped (fact-check outcomes)

- **Melt Bar and Grilled (Lakewood)** — INCLUDED, flagged `— CLOSED`. Flagship closed Jan 1 2025;
  iconic (Man v. Food, DDD), teases return. Kept per closed-places rule.
- **El Carnicero (Lakewood)** — DROPPED. Permanently closed May 2024; same chef (Eric Williams) as the
  guide's existing Momocho.
- **Nighttown (Cleveland Heights)** — DROPPED (closed Aug 2024). EDWINS took the space and is included
  instead.
- **Balaton (Shaker Square)** — DROPPED. Shaker Square location closed; the Hungarian institution
  relocated far out to Bainbridge/Chagrin Falls (out of inner-ring scope).
- **Bookhouse Brewing (Ohio City)** — DROPPED. Yelp shows Permanently Closed (May 2026); would also be
  brewery padding alongside Market Garden + Terrestrial.
- **Thai Thai (Lakewood)** — DROPPED as duplicate (already in the guide).
- **"Ladder 4 Wine Bar"** — DROPPED. The James-Beard / Wikipedia Ladder 4 is in **Detroit, MI**, not
  Cleveland — false lead, not added.
- **Aladdin's Eatery, Cozumel, Bar Italia, India Garden, Borderline, Boom's Pizza, Forage** — MEASURED
  and dropped: chain / generic / couldn't confirm >=2 credible recommenders + open status this pass.
- **Near West Theatre (Gordon Square)** — dropped to avoid theater padding (Capitol + CPT already cover
  the Gordon Square stage cluster, and the district's murals are already in the guide).
