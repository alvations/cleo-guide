# Orlando session-3 discovery worker brief (food & drink first)

You are a discovery worker for the Orlando & Central Florida travel map (repo /home/user/cleo-guide, research dir
data/orlando-research/). Read CLAUDE.md editorial rules + data/orlando-research/_AGENT_BRIEF.md (areas, cuisines).
WebSearch is your only web channel (WebFetch is blocked by policy — do not try it or route around it).
DO NOT git add/commit/push and DO NOT edit any file outside data/orlando-research/. Write only YOUR tagged files.

## Dedup FIRST
Run: `cd /home/user/cleo-guide/data/orlando-research && python3 -c "import json,glob;print(sorted({x['n'] for f in glob.glob('FOOD_*.json') for x in json.load(open(f))}|{x['n'] for f in glob.glob('SIGHTS_*.json') for x in json.load(open(f))['sights']}))"`
and re-run before each write — other workers add places concurrently. Never add a name already present.

## Bar for every place (never fabricate, never from memory)
- >=2 independent credible sources with real URLs that the search results actually showed (Orlando Weekly incl. its
  Best of Orlando readers' poll, Orlando Sentinel incl. Foodie Awards, Orlando Magazine, Visit Orlando, Tasty Chomps,
  Eater, Infatuation, Michelin, James Beard, Spectrum News 13, WFTV, WESH, ClickOrlando/News 6, FOX 35, Scott Joseph
  Orlando, Disney Food Blog, Theme Park Insider, AllEars, Touring Plans, Food Network/DDD, Southern Living, Time Out,
  USA Today 10Best, Florida Rambler, Atlas Obscura, verifiably popular creators/YouTubers/TikTokers with a findable
  piece). A lone MICHELIN or JAMESBEARD award counts alone. Yelp/TripAdvisor/Google/OpenTable/Toast = ZERO; reject SEO
  farms, AI listicles, benable lists, random .univille/.blogbox scraper domains. The OFFICIAL site counts once.
- Merit: a mention is not merit — prefer award/poll winners, critics' picks, Michelin, major-press raves, famous creators.
- A street address (from a source) and ONE named dish/drink (`dish`). Verified OPEN as of 2025-2026 (a closed place:
  only keep if notable, name suffixed ' — CLOSED', closed=True, stsrc=closure-source URL).
- Cuisine labels `cz` must be keys from consolidate.py CMAP (e.g. "Puerto Rican","Cuban","Vietnamese","Brewery",
  "Cocktails","Coffee","Bakery","Tiki","Bar","Seafood","Florida","BBQ","Southern","Mexican","Italian","Japanese",
  "Thai","Korean","Chinese","Indian","Middle Eastern","Theme Park","Fine Dining"...). Tag the KITCHEN's tradition.
- Area `a`: DTO MILLS WPK IDR MK EPCOT DHS DAK DSP USF IOA EPIC CWALK KISS WEST SPRNG EAST SPACE (see brief: MILLS
  includes Mills 50/Milk District/Audubon Park/Ivanhoe Village/SoDo/Curry Ford; WPK includes Baldwin Park/Maitland;
  IDR includes Dr Phillips/Restaurant Row/Millenia/Florida Mall/airport side; SPRNG includes Sanford/Lake Mary/
  Longwood/Altamonte/Mount Dora/DeLand; EAST = UCF/Oviedo/Waterford Lakes; KISS incl. Celebration/St Cloud/Lake Nona/
  Poinciana; DSP = Disney Springs + Disney resorts not on MK/EPCOT lagoons; CWALK = CityWalk + Universal hotels).
- Tier `t` 1-3 graded within the area (1 = award winner / Michelin / signature canon).
- `w`: one factual sentence of why, citing the award/poll/critic (no hype you didn't see).

## Write as you go (every 3-5 places) with the helper
```python
import sys; sys.path.insert(0,'/home/user/cleo-guide/data/orlando-research'); from _orl_lib import food, outlets
food(TAG,t,a,["Puerto Rican"],"Mofongo","Name","123 Street, Kissimmee, FL","why...",
     [["ORLANDOWEEKLY","https://..."],["FOX35","https://..."]])   # optional lat=,lng=,conf=,geosrc= ONLY if a real
# place-pin decimal (Wikipedia coords / Google !3d!4d / latlong.net / OSM node) surfaced in results; NEVER a /@ viewport.
outlets(TAG,[{"key":"NEWKEY","name":"...","type":"press|blog|creator|tourism","url":"https://...","credible":"why credible"}])
```
Any source key not already in data/orlando-research/SOURCES_*.json MUST be registered via outlets() with a
`credible` rationale. Prefer existing keys: ORLANDOWEEKLY ORLANDOSENTINEL ORLANDOMAG VISITORLANDO TASTYCHOMPS EATER
INFATUATION MICHELIN JAMESBEARD SPECTRUMNEWS13 WFTV WESH CLICKORLANDO FOX35 SCOTTJOSEPH DISNEYFOODBLOG
THEMEPARKINSIDER ALLEARS TOURINGPLANS FOODNETWORK TASTINGTABLE TIMEOUT FLORIDARAMBLER ATLASOBSCURA OFFICIAL WIKIPEDIA
INSIDETHEMAGIC LAUGHINGPLACE ORLANDOINFORMER EXPERIENCEKISSIMMEE VISITFLORIDA.

## Efficiency
One search should yield many places: target round-ups/poll results/"best X in Orlando" lists from the outlets above,
then a confirming search per 2-3 places (name + address + second outlet). Include >=1 creator query (YouTube/TikTok/
blogger) per ~10 searches. Use up to ~40 searches. Aim for 20-35 verified places.

## Finish
Return a short report: places added (name, area), searches used, channel mix (editorial/creator/travel/local counts),
dropped/held with reasons (single-source leads list), closures found. The lead writes AUDIT.md from your report.
