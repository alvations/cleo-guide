# Erie, PA + I-79 corridor — discovery note (research/discovery stage)

Discovery wave to START the Erie corridor guide (Pittsburgh's edge north to Lake Erie), same
dataset-built flow as Wheeling & State College. **WebSearch only** (WebFetch blocked). Sourced
research JSON only — **no coordinates, no scaffolding, no build** (geocode + build are later stages).

## Output files
- `FOOD_ERIE.json` — 18 food/drink (a LIST)
- `SIGHTS_ERIE.json` — 22 sights (a DICT with embedded source registry)
- `SOURCES_ERIE.json` — outlet registry (39 outlets)
- `CREATORS_ERIE.json` — empty (no verifiable social creator cleared the bar this wave; see below)

**Total: 40 places** (18 food + 22 sights) across 6 area codes.

## Area codes
`ERIE` (anchor city) · `NORTHEAST` (North East / Lake Erie wine country) · `MEADVILLE` ·
`EDINBORO` · `GROVECITY` · `CORRIDOR` (the I-79/US-19 places between: Slippery Rock, Harmony,
Conneaut Lake, Cambridge Springs, Portersville).

## Counts by area / type / tier

### FOOD (18)
- **ERIE (11)** — T1: New York Lunch (Greek dog), Sara's (Smith's dogs + twist), Stanganelli's
  (deep-fried pepperoni ball), Romolo Chocolates (sponge candy), Lavery Brewing, The Brewerie at
  Union Station. T2: Pulakos Chocolates, Erie Brewing Co., 1201 Kitchen, Colao's Ristorante,
  Federal Hill Smokehouse.
- **NORTHEAST (3)** — T1: Mazza Vineyards. T2: Penn Shore Winery, Arrowhead Wine Cellars.
- **MEADVILLE (1)** — T1: Voodoo Brewery (The Compound) — birthplace of Voodoo Brewing.
- **CORRIDOR (3)** — T1: North Country Brewing (Slippery Rock). T2: Harmony Inn (Harmony).
  T3: Conneaut Cellars Winery & Distillery (Conneaut Lake).
- EDINBORO / GROVECITY food: none cleared the ≥2-credible-source bar this wave (see dropped).

### SIGHTS (23)
- **ERIE (11)** — T1: Presque Isle State Park, Erie Maritime Museum & U.S. Brig Niagara, Tom Ridge
  Environmental Center, Waldameer Park & Water World. T2: Bicentennial Tower, Erie Art Museum,
  Warner Theatre, Presque Isle Lighthouse. T3: Erie Land Lighthouse, Erie Zoo, Erie Playhouse.
- **NORTHEAST (1)** — T2: Lake Erie Wine Country (Concord Grape Belt) scenic drive.
- **MEADVILLE (2)** — T1: Meadville Market House (oldest continuously-run market in PA). T2:
  Allegheny College.
- **GROVECITY (3)** — T1: Wendell August Forge (oldest/largest U.S. forge). T2: Grove City Premium
  Outlets, Grove City College.
- **CORRIDOR (6)** — T1: Conneaut Lake Park, McConnells Mill State Park, Harmony Historic District.
  T2: Moraine State Park. T3: Riverside Inn — CLOSED.

Every area carries at least one T1 must-see. (EDINBORO has no standalone entry — see below.)

## Food canon logic (signature-first)
Led with what Erie/the corridor is famous for, then the hidden gems that serve it:
- **Greek dog** (Smith's skinless wiener + slow-cooked Greek meat sauce) — New York Lunch, est. 1927,
  claims the original; Sara's char-grills Smith's at the Presque Isle gate.
- **Deep-fried pepperoni ball** — Erie's own version (not the WV baked pepperoni roll); Stanganelli's
  since 1961, so iconic the SeaWolves rebrand as the "Pepperoni Balls."
- **Sponge candy** — Erie sits in the "Sponge Candy Crescent"; Romolo (4 generations) and Pulakos
  (since 1889) are the benchmark chocolatiers.
- **Lake Erie wine** (Concord grape belt) — Mazza, Penn Shore (a first-two post-Prohibition PA
  winery), Arrowhead in North East.
- **Erie brewery scene** — Lavery, The Brewerie at Union Station, Erie Brewing (GABF medalist); plus
  the corridor's craft-beer origin story, Voodoo Brewing (Meadville, 2005).

## OPEN/CLOSED fact-check (2025/2026)
- All open places default `closed:false`, verified against official sites / CVBs / current news.
- **Riverside Inn (Cambridge Springs) — CLOSED**, kept + flagged: destroyed by fire May 2, 2017
  (Erie News Now, Meadville Tribune, Wikipedia). Riverside Brewing Company now occupies the site, but
  the historic inn is gone.
- **Conneaut Lake Park** — kept as a live sight but the note states its operating season has run
  hot-and-cold under successive owners; the geocode/status stage should confirm the current season
  before publish.

## Sources used (all ≥2-credible or lone institutional/award; Yelp/TripAdvisor/Google = 0 toward bar)
Local press: Erie Reader (incl. Best of Erie awards), Erie Times-News/GoErie, YourErie (WJET/WFXP),
Erie News Now (WICU/WSEE), Meadville Tribune, Keystone Newsroom. CVB/official: VisitErie, Visit
Crawford, Visit Mercer, Experience Butler, PA DCNR state parks, official museum/brewery/forge/college
sites. Editorial/national: NPR, PBS, The National Herald, PA Eats, Pittsburgh Magazine, NWIRC, MLB.com.
Named PA travel writers (real track records): Uncovering PA (Jim Cheney), Interesting Pennsylvania,
Discover the Burgh, Travel Addicts, Wandering Educators. Wikipedia for sights/institutional facts.

## Creators
**None.** No individual social creator (YouTube/TikTok/blog) with a verifiable following AND a findable
Erie/corridor clip surfaced this wave. Per the anti-fabrication rule, none were invented.
`CREATORS_ERIE.json` is intentionally empty with an explanatory note; a deeper pass could vet Erie
food-TikTok/YouTube personalities if real follower scale can be confirmed.

## MEASURED & DROPPED (mention ≠ merit; single-source or listicle-only this wave)
- **Oliver's / Oliver's Rooftop (Erie)** — cited for Times-News/Erie Reader/OpenTable reader awards,
  but only via an aggregator listicle here; no primary award page confirmed. Re-measure and add if the
  Erie Reader/Times-News award is confirmed.
- **Stefanelli's Candies (Erie)** — sponge candy/meltaways; only one credible mention (Wandering
  Educators). Add on a second credible source. (Romolo + Pulakos already carry the sponge-candy canon.)
- **Julian's Bar & Grill (Meadville)** — downtown American mainstay; only rating-site/listicle mentions.
- **Della Terra (Zelienople)** — Italian trattoria; single-attribution coverage this wave; re-measure.
- **Erie pizza / "Erie-style"** — Erie has a lively pizzeria scene (Erie Reader's "A Slice Above"
  #WeekOfPizza bracket) but does NOT own a single defined style the way Wheeling owns cold-cheese
  square pizza; "Pontillo's/rectangular" in the brief is a Rochester NY chain, not an Erie signature.
  No single pizzeria cleared the merit bar as a must-add over the stronger Greek-dog / pepperoni-ball /
  sponge-candy canon, so pizza was intentionally NOT padded. Candidates to measure next: Valerio's,
  Firestone's Kitchen (Erie Reader-cited). Add only what clears the bar; state the gap, don't fill it.
- **EDINBORO** — the university town (now PennWest Edinboro) yielded no place with ≥2 credible sources
  this wave beyond generic "collegiate vibe / soccer scene" mentions. Left empty rather than padded;
  a follow-up pass should look for Edinboro Lake, a sourced campus landmark, or a sourced local eatery.
- **Cranberry Township / Mercer town** — no distinctive, well-sourced destination surfaced above the
  corridor's stronger picks; not padded.

## Next stage
Hand off to geocoding + location-verify (per docs/SOURCES.md 4a/4b) then the dataset build
(`consolidate.py` → `data/erie.dataset.json` → `tools/build-erie.py`). No coordinates were written
here by design.
