# Mid-corridor SIGHTS pass (I-70 between Columbus & Dayton) — 2026-08-24

Agent: SIGHTS-discovery, I-70 corridor between Columbus and Dayton. Places to VISIT/SEE (no food, no coords).

## Output files (distinct names, no shared-file edits)
- `data/dayton-research/SIGHTS_MIDCORRIDOR.json` — 10 Springfield/Clark County sights, area `SPRINGFIELD` / `_newarea` "Springfield, Enon & Clark County" (Dayton map).
- `data/columbus-research/SIGHTS_MIDCORRIDOR.json` — 3 Madison County sights, area `MADISON` / `_newarea` "Madison County (London, West Jefferson)" (Columbus map).
- `SOURCES_MIDCORRIDOR.json` in both dirs — new outlets to register.

## Springfield / Clark County -> DAYTON map (10)
Tier-1 (both geocodable via published data):
- **Frank Lloyd Wright's Westcott House** — 1340 E High St. Wikipedia published NRHP coords 39.9548 / -83.7891, NRHP #74001413. Marquee. GEOCODABLE t1 CONFIRMED.
- **Hartman Rock Garden** — 1905 Russell Ave. Atlas Obscura + Kohler Foundation preserved folk-art landmark. Geocodable.

Tier-2: Springfield Museum of Art (only Smithsonian Affiliate art museum in Ohio), Heritage Center of Clark County (1890 Romanesque City Hall/Market House), Pennsylvania House Museum (1839 National Road tavern, NRHP, DAR-run), George Rogers Clark Park & Battle of Peckuwe site (1780 battle, NTPRD), Madonna of the Trail (first of 12 DAR National Road monuments, 1928), Snyder Park Gardens & Arboretum (NTPRD), Buck Creek State Park / C.J. Brown Reservoir (ODNR), Enon Adena Mound / Knob Prairie (Ohio's 2nd-largest conical mound).

## Madison County -> COLUMBUS map (3, not padded)
- **Red Brick Tavern** (Lafayette, US-40) — 1836-37 National Road inn, hosted 6 presidents, LOC/HABS documented. Historic-landmark sight (working tavern; framed as the building, not food).
- **Madison County Historical Society Museum** (London) — official + See Ohio First.
- **Prairie Oaks Metro Park** (West Jefferson) — Madison/Franklin line on Big Darby; NOT a duplicate of Battelle Darby (that is separate/downstream, already in Columbus).

## Sourcing / creators
All places clear >=2 credible OR a lone institutional authority (NRHP/DAR/NPS-class/LOC-HABS/official museum/state park). Credible outlets used: Wikipedia (published coords+notability), ohio.org (TourismOhio), Visit Greater Springfield CVB, Springfield News-Sun, Atlas Obscura, Kohler Foundation, FLW Trust, DAR, HMDB, Clio, NTPRD, ODNR, Enon Community Historical Society, Library of Congress HABS, See Ohio First, Metro Parks. No standalone travel-blogger/YouTuber cleared the vetting bar with a *findable* named piece at these specific places, so none was attached as a corroborating source — the institutional/editorial base already meets the gate. (Rejected anonymous SEO/aggregator hits: airial.travel, mindtrip.ai, topbrunchspots, lasr.net, Yelp/TripAdvisor as recommenders.)

## Open/access
All confirmed open/accessible. Red Brick Tavern: closed 2020 (COVID), reopened Feb 14 2023, operating 2026. Nothing closed/permanently shuttered in this batch.

## Measured & dropped
- **Yellow Springs edge** — skipped; already saturated in Dayton dataset (Young's, Clifton Gorge/John Bryan, Glen Helen, Clifton Mill all present). No non-duplicate mid-corridor add worth it.
- **Battelle Darby Creek** — already in Columbus dataset; excluded (Prairie Oaks is the distinct Madison-County substitute).
- London courthouse square / Madison Co. courthouse — real but thin as a standalone sight vs. the historical society; did not add, to avoid padding.

## New outlets to register (see SOURCES_MIDCORRIDOR.json in both dirs)
Dayton: VISIT_SPRINGFIELD, NTPRD, SPRINGFIELD_NEWSSUN, ENON_HISTORICAL, KOHLER_FOUNDATION, FLW_TRUST, OHIO_ORG, CLIO.
Columbus: SEEOHIOFIRST, LOC, METROPARKS, BIRDING_HOTSPOTS.
(Existing keys WIKIPEDIA, OFFICIAL, DAR, HMDB, ODNR, ATLAS_OBSCURA assumed already registered / auto-caught by register-sources.py.)

## New map areas needed before build
- Dayton consolidate.py: add area `SPRINGFIELD` = "Springfield, Enon & Clark County" (+ AC colour). Has 2 geocodable tier-1s.
- Columbus consolidate.py: add area `MADISON` = "Madison County (London, West Jefferson)" (+ AC colour). Tier-2 only — Red Brick Tavern / Prairie Oaks / Madison Co. Historical Society all geocodable; if a tier-1 is required per-area, promote Red Brick Tavern (LOC-HABS institutional authority) to t1.
