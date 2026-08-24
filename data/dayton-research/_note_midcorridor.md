# Mid-corridor pass — I-70 between Columbus & Dayton (Springfield midpoint)

Food-discovery + creator/viral pass for the corridor towns, split across the two existing maps.
No coordinates recorded (per task). All places fact-checked OPEN/CLOSED for 2025–26 via WebSearch.
Files written: `data/dayton-research/FOOD_MIDCORRIDOR.json` + `CREATORS_MIDCORRIDOR.json`;
`data/columbus-research/FOOD_MIDCORRIDOR.json` + `CREATORS_MIDCORRIDOR.json`.

## Places kept (8 total — quality over quantity; rural corridor, did NOT pad)

### Dayton map (6)
| Place | Town | Area | Merit / ≥2 credible | Open |
|---|---|---|---|---|
| The Winds Cafe | Yellow Springs | **YS** | Columbus Monthly full review (Jan 2025) + Dayton937; farm-to-table since 1977 | Yes |
| Cecil and Lime | Springfield | SPRINGFIELD* | Springfield News-Sun best-of + Visit Greater Springfield CVB; "best in Springfield" | Yes |
| Mike & Rosy's Deli | Springfield | SPRINGFIELD* | Dayton Daily News (steamed-sandwich method) + News-Sun + CVB; institution since 1977 | Yes (reopened under E&T Mader) |
| The Last Queen | Enon | SPRINGFIELD* | Springfield News-Sun photo feature + Hub Springfield + Go To Destinations; authentic English pub, immigrant-owned 2022 | Yes |
| Mother Stewart's Brewing | Springfield | SPRINGFIELD* | BeerAdvocate "34 best new US breweries" + Pellicle mag feature + News-Sun; Ohio.org | Yes |
| The Hickory Inn | Springfield | SPRINGFIELD* | News-Sun "long roots" + Ohio.org + CVB; log-cabin icon since 1947 | Yes |

\* SPRINGFIELD records carry `"_newarea":"Springfield, Enon & Clark County"` for the orchestrator to add centrally.

### Columbus map (2)
| Place | Town | Area | Merit / ≥2 credible | Open |
|---|---|---|---|---|
| Ann & Tony's | West Jefferson | **MADISON** | CMH Gourmand (est. Columbus food blog) + Columbus Underground community; Italian institution since 1950, TA #1/19 | Yes |
| The Red Brick Tavern | Lafayette / London | **MADISON** | Ohio Historical Marker (HMDB) + touring-ohio + National Road blog; Ohio's 2nd-oldest stagecoach inn, hosted 6 presidents, still a restaurant | Yes (Tue–Sat) |

MADISON records carry `"_newarea":"Madison County (London, West Jefferson)"`.

## Creators vetted (2 registered)
- **BWNICK** — Nick Dekker / Breakfast With Nick (Columbus/Ohio food blogger, History Press author; ~14K IG, blog since 2008). Findable content: The Last Queen full English (Feb 2024). → attached to The Last Queen. (Dayton file.)
- **CMHGOURMAND** — CMH Gourmand (central-Ohio food blog since ~2007). Findable content: Ann & Tony's, West Jefferson (2009). → attached to Ann & Tony's. (Columbus file.)

Creators REJECTED / not registered: Go To Destinations & Hub Springfield used only as corroborating editorial (Hub is a local outlet, not a creator; Go To Destinations following unverifiable). No qualifying YouTube/TikTok creator with a *findable video at a named corridor place* surfaced — the corridor's coverage is press/blog, not video-viral.

## MEASURED & DROPPED
- **Fountain on Main** (Springfield, 50s soda shop) — **CLOSED**. Yelp marks CLOSED (Apr 2026); Springfield News-Sun (May 2026) reported it closing after 19 years over a lease cancellation. Not added (new discovery; nothing pre-existing to preserve-as-flagged).
- **Acapulco / Victor's Taco** (Xenia Mexican) — only rating-platform mentions (Yelp/TripAdvisor "little gem"); NO editorial or verified-creator citation → fails ≥2-credible gate. Dropped.
- **Bambino's, Todd's Pizza, M&M Diner, Eat Greek, Main Street Deli** (West Jefferson/London) — directory/aggregator listings only, no credible recommender. Dropped.
- **Cedarville cluster** (Beans-n-Cream, Colonial Pizza, Mom & Dad's Dairy Bar, Speakeasy Ramen) — college-town listicle/aggregator only; no credible source cleared the bar. Dropped.
- **Linardos Villa, Casey's, Coffee Expressions** (Springfield) — single News-Sun/listicle mention only; measured but not enough corroboration + not distinctive vs the 6 kept. Dropped to avoid padding.

Skipped (already on Dayton map): **Young's Jersey Dairy** (FOOD.json, YS) and **Clifton Mill** (a sight). Did not duplicate.

## NEW SOURCE OUTLETS to register in data/sources.json
- **SPRINGFIELDNS** — Springfield News-Sun (springfieldnewssun.com) — Clark County daily of record.
- **VISITSPRINGFIELD** — Visit Greater Springfield CVB (visitgreaterspringfield.com).
- **HUBSPRINGFIELD** — Hub Springfield (hubspringfield.com) — local Springfield news/features.
- **COLMONTHLY** — Columbus Monthly (columbusmonthly.com) — restaurant reviews (if not already registered for Columbus).
- **PELLICLE** — Pellicle Magazine (pelliclemag.com) — respected beer/food long-form (corroboration).
- **BEERADVOCATE** — BeerAdvocate (award/measurement, corroboration only).
- **OHIOORG** — Ohio.org state tourism (ohio.org) — CVB-grade listings.
- **HMDB** — Historical Marker Database (hmdb.org) — landmark verification.
- **TOURINGOHIO / NATLROADBLOG** — National Road travel histories (touring-ohio.com; blog.jimgrey.net).
- Creators: **CMHGOURMAND**, **BWNICK** (see CREATORS_MIDCORRIDOR.json — run `tools/merge-creators.py` per map).

## Next steps for orchestrator
- Add areas centrally: Dayton **SPRINGFIELD** = "Springfield, Enon & Clark County"; Columbus **MADISON** = "Madison County (London, West Jefferson)".
- `python3 tools/merge-creators.py dayton-oh` and `... columbus-oh` (globs CREATORS*_MIDCORRIDOR.json).
- Then geocode + `--geocheck`/`--statuscheck` these 8 (no coords set by this pass).
