# Indianapolis — standing brief for every research agent

Region: **Indianapolis, IN** (Marion County) + **Speedway** + the **north suburbs** (Carmel, Fishers,
Zionsville, Noblesville, Westfield — Hamilton/Boone Co.) + the **south side** (Greenwood, Beech Grove,
Southport — home of one of the largest Burmese/Chin communities outside Myanmar, "Chindianapolis").
Key `indianapolis-in` · research dir `data/indianapolis-research/` · dataset `data/indianapolis.dataset.json`
· page `cities/indianapolis.html` · build `tools/build-indianapolis.py`. Benchmark: Pittsburgh (~212).

## The bar (hard, gated)
- **≥2 independent CREDIBLE sources** per place, OR one lone institutional authority (**James Beard**
  win/semifinalist/America's Classics, **NPS** for a unit it runs, Smithsonian). Indianapolis has **no
  Michelin guide**; James Beard is the top food mark. Yelp/TripAdvisor/Google/OpenTable = **ZERO**
  (open-check / popularity *measurement* only).
- **A mention is not merit** — measure (award/vote, critic's pick, JB, famous-creator rave, or high
  rating with volume on ≥2 platforms), re-rank **within area**, don't pad; log MEASURED & DROPPED.
- Fact-check OPEN/CLOSED (2025/2026). Notable closed → kept with `"closed": true` (geo-merge adds the
  `— CLOSED` marker); non-notable closed → drop, log it.
- **No coordinates in discovery.** Geocoding is a separate stage (`geo/_geoout_<tag>.json`; Wikipedia
  infobox / Google `!3d!4d` place pins only; never `/@` viewports; unresolvable = UNVERIFIED).
- Cuisine tag = the kitchen's own tradition + a **named dish**.

## Source palette (ranked)
1. **INDYSTAR** (IndyStar — the daily; dining critic + "best of" lists) · **INDYMONTHLY** (Indianapolis
   Monthly — Best Restaurants / Best of Indy) · **IBJ** (Indianapolis Business Journal — Dining) ·
   **JAMESBEARD**.
2. **WFYI** (NPR/PBS member) · **MIRROR** (Mirror Indy — nonprofit newsroom) · **VISITINDY** (CVB) ·
   **EATER** (national desk: Eater's Indianapolis maps/heatmaps) · **WTHR / WISH / FOX59** (TV) ·
   **NUVO** (alt-weekly, archive) · **HAMILTONCOUNTY** (Visit Hamilton County CVB).
3. Sights: **NPS**, **INDNR** (Indiana DNR), **WIKIPEDIA** (notability + published coords),
   **ATLASOBSCURA**, **INDIANAHISTORY** (Indiana Historical Society / Indiana Landmarks), **OFFICIAL**.
4. Creators only when verifiably popular with a findable piece (log follower scale), e.g. national food
   TV (Diners, Drive-Ins and Dives — Food Network; Andrew Zimmern; Anthony Bourdain) as one corroborating
   source each.

## Food canon — the opening move
Breaded **pork tenderloin** sandwich (Nick's Kitchen in Huntington is the claimed birthplace — out of
region; in-region: Workingman's Friend, Edwards Drive-In, Plump's Last Shot, Red Key/others) ·
**sugar cream pie** (Hoosier pie; Wick's is Winchester — out of region; Indy: Long's? Hoosier Mama?) ·
**St. Elmo Steak House** shrimp cocktail (JB America's Classic) · **Shapiro's Delicatessen** (since 1905) ·
**persimmon pudding** · **fried biscuits & apple butter** (Hollyhock Hill, Shapiro's? — verify) ·
**Long's Bakery** donuts · the **Burmese/Chin** south side · **International Marketplace** (Lafayette Rd
corridor: Mexican, Vietnamese, African, Burmese, Indian) · **Mug 'n' Bun** root-beer drive-in (Speedway).
State gaps honestly — never fill a signature with a mediocre pick.

## Area ids
DTN Downtown & Wholesale District · MASS Mass Ave/Lockerbie/Old Northside · FSQ Fountain Square/Fletcher
Place/near south · MID Midtown (Newfields, Children's Museum, Crown Hill, Butler) · BRIP Broad Ripple/
Meridian-Kessler/SoBro · WEST Speedway & westside (International Marketplace) · EAST Irvington & east side ·
NORTH north suburbs · SOUTH south side (Greenwood/Beech Grove/Southport).

## Artifacts
`FOOD_<tag>.json` (list `{t,a,cz,dish,n,address,w,closed,sources:[[KEY,url],…]}`), `SIGHTS_<tag>.json`
(`{"sights":[{t,a,k?,n,address,w,sources}]}`), `SOURCES_<tag>.json` (`{"outlets":[{key,name,type,url,credible,rank}]}`),
`CREATORS_<tag>.json`, `geo/_geoout_<tag>.json`. Concurrent run: commit only your explicit paths, under the lock.
