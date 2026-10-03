# Orlando wave 4 — worker brief (session 5, 2026-10-03)

You are a discovery worker for the cleo-guide Orlando map (key `orlando-fl`). Repo: `/home/user/cleo-guide`.
Work ONLY inside `data/orlando-research/`. Do NOT run git, do NOT run `tools/rebuild-city.py`, do NOT edit any shared file —
the lead commits, builds and gates your output.

## Read first (skim)
`data/orlando-research/_AGENT_BRIEF.md` (areas, theme-park rule, food canon, source palette, schema) ·
`CLAUDE.md` editorial rules · `data/orlando-research/_orl_existing_names.txt` (390 places already in the dataset — area<TAB>name;
**never add a duplicate**, including under a variant name).

## Hard rules
- **≥2 credible sources per place** (distinct keys), or a lone MICHELIN / JAMESBEARD award. Yelp/TripAdvisor/Google/OpenTable = 0.
  `OFFICIAL` (the venue/park's own site) counts once. WIKIPEDIA counts once. A creator (YouTube/TikTok/IG/blog) counts once and only
  if verifiably popular with a specific findable piece. Reject SEO listicles / AI farms.
- **Merit bar**: a mention is not merit — an award/"Best of" vote, a critic's rave, Michelin/JB, a famous creator rave, or a
  notable/historic landmark. Don't pad with near-identical mid-tier places.
- **Food & drink ≥ 50% of what you add per area** unless your task says the area is food-heavy. Every food card names a real dish/drink (`dish`).
- **Open/closed**: only add places shown open in a 2025–2026 source; a closed one may be added flagged `closed=True` with the
  closing source as `stsrc`.
- **Coordinates**: NEVER from memory. Only a coordinate printed in a search result from the place's OWN Wikipedia article
  (`allowed_domains:["en.wikipedia.org"]`, batch 3 names: `"A" "B" "C" Orlando coordinates`) → pass `lat,lng` + `geosrc=<wiki url>`.
  Never a park/land/district/city/lake centroid. Anything else: leave lat/lng None (UNVERIFIED, queued for the browser helper).
  Restaurants on ordinary streets will almost always be UNVERIFIED — don't spend searches trying to pin them.
- Never fabricate an address, source URL, dish or fact. Addresses must come from a search result.
- Use real URLs exactly as returned by the search tool.

## Writing (write-as-you-go, every ~3–5 places)
```python
import sys; sys.path.insert(0,'/home/user/cleo-guide/data/orlando-research')
from _orl_lib import food, sight, outlets
# food(tag,t,a,cz,dish,n,address,w,sources,closed=False,lat=None,lng=None,conf="high",stsrc="",geosrc="")
food("W4A",2,"IDR",["Steakhouse"],"Dry-aged ribeye","Example","123 X St, Orlando, FL","why notable (cite who said what)",
     [["ORLANDOWEEKLY","https://…"],["EATER","https://…"]])
# sight(tag,t,a,n,address,w,k,sources,lat=None,lng=None,conf="high",g=["RIDE"])  k = space-separated keywords
# NOTE: for a pinned sight, put the ["WIKIPEDIA",<article url>] source FIRST — sight() records sources[0] as the coordinate source.
outlets("W4A",[{"key":"NEWKEY","name":"…","type":"…","url":"…","credible":"why credible (scale/track record)"}])
```
- Tier `t`: 1 = must-see within the area, 2 = strong, 3 = good. Grade within the area.
- `cz` labels: use the kitchen's tradition (e.g. "Puerto Rican","Vietnamese","Steakhouse","Seafood","Brewery","Cocktails",
  "Coffee","Bakery","Theme Park","Fine Dining","Italian","Japanese","Mexican","Southern","BBQ","Cuban","Thai","Korean"…).
- Sight `g` categories: RIDE SHOW ICON SPACE SPRNG WILD MUS HIST WATER ARTS MKT FAM ODD FREE BAR.
- Existing source keys you can reuse: ORLANDOWEEKLY ORLANDOSENTINEL ORLANDOMAG EATER INFATUATION TASTYCHOMPS SCOTTJOSEPH WFTV WESH
  CLICKORLANDO FOX35 SPECTRUMNEWS13 WMFE BUNGALOWER VISITORLANDO EXPERIENCEKISSIMMEE VISITFLORIDA ATLASOBSCURA TIMEOUT LONELYPLANET
  FODORS FROMMERS DISNEYFOODBLOG WDWNT TOURINGPLANS ALLEARS INSIDETHEMAGIC THEMEPARKINSIDER ORLANDOINFORMER ATTRACTIONSMAG
  MICHELIN JAMESBEARD WIKIPEDIA OFFICIAL NPS FLSTATEPARKS SPACECOASTLIVING FLORIDARAMBLER HMDB NPR. A NEW key needs an `outlets()` record.
- Also append one line per place to `data/orlando-research/_W4_log_<TAG>.md`: `name | area | sources | pinned? | notes`,
  plus MEASURED & DROPPED lines (`DROP name — reason`) and held single-source (`HELD name — have X, need 2nd`).

## Search budget
Your cap is given in your task. Prefer list-type queries (one "best X in Y 2025" result from a credible outlet names many places;
then one corroborating list from a different outlet). Include ≥1 creator query (YouTube/TikTok/food blogger) for your areas.
Stop at the cap. Final message: ≤150 words — places added per area (food/sights), pinned count, held/dropped, searches used.
