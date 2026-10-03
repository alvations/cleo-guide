# Chicago (`chicago-il`) — standing agent brief

**Page** `cities/chicago.html` · **dataset** `data/chicago.dataset.json` · **research** `data/chicago-research/` ·
**build** `tools/build-chicago.py` (clone of build-washingtondc/newyork; centre + labels derived from pins) ·
**rebuild** `flock -w 3600 .git/cleo-shared.lock python3 tools/rebuild-city.py chicago-il --build`.
Target density: **New York (~500)** — per-area targets in `RESUME.md`, measured by `python3 tools/density.py chicago-il`.

## Areas (ids ≤5 chars)
| id | area | covers |
|---|---|---|
| `LOOP` | The Loop & Downtown | Loop, River North, Streeterville, Mag Mile, Gold Coast, Old Town(S of North Ave), South Loop, Museum Campus, West Loop & Fulton Market, Greektown, Navy Pier |
| `NORTH` | North Side | Lincoln Park, Old Town, Lakeview/Wrigleyville, Roscoe Village, North Center, Lincoln Square, Ravenswood, Uptown & Argyle, Andersonville, Edgewater, Rogers Park, West Ridge/Devon Ave |
| `NW` | Northwest Side | Wicker Park, Bucktown, Ukrainian Village, West Town, Logan Square, Humboldt Park, Avondale, Irving Park, Albany Park, Portage Park, Jefferson Park, Avondale |
| `WEST` | West Side | Pilsen, Little Village, Little Italy/Taylor St & University Village, Tri-Taylor, Garfield Park, Austin, North Lawndale, Near West |
| `SOUTH` | South Side | Chinatown, Bridgeport, Bronzeville, Hyde Park, Kenwood, Woodlawn, Washington Park, South Shore, Grand Crossing |
| `SW` | Southwest Side | Back of the Yards, McKinley Park, Brighton Park, Archer Heights, Garfield Ridge/Midway, Chicago Lawn/Marquette Park, West Lawn |
| `FAR` | Far South | Pullman, Beverly, Morgan Park, Mount Greenwood, Chatham, Roseland, South Chicago, Hegewisch & the Calumet |
| `SUB` | Suburbs & North Shore | Evanston, Wilmette, Glencoe, Highland Park, Skokie, Oak Park, Forest Park, Berwyn, Cicero, Brookfield, Lisle, Naperville, Rosemont, Schaumburg, Blue Island, Harvey, Oak Lawn, Evergreen Park, Calumet City, Lansing |
| `DAY` | Day trips | Indiana Dunes (NP + state park), Starved Rock, Milwaukee, Lake Geneva, Michigan City/Lake shore, Whiting/Hammond, Racine, Kenosha |

Boundary rule: within city limits use Chicago's community areas; a suburb in Cook/DuPage/Lake County = `SUB`;
anything >45 min = `DAY`. (Hammond/Whiting IN are `DAY` — out of state; Calumet City/Lansing IL are `SUB`.)

## The food canon (opening move — named before searching)
deep-dish (Lou Malnati's, Pequod's caramelized crust, Gino's East, Pizzeria Uno/Due) · stuffed (Giordano's,
Bacino's) · **tavern-style thin / party cut** (Vito & Nick's, Pat's, Marie's, Phil's, Candlelite, Paulie Gee's
Logan Sq) · **Italian beef** (Al's #1, Johnnie's, Mr. Beef, Portillo's, Jay's, Bari) · **Chicago-style hot dog**
(Superdawg, Gene & Jude's, Jim's Original, Wolfy's, Byron's) · **Maxwell Street Polish** (Jim's Original) ·
the **jibarito** (Borinquen, Papa's Cache Sabroso, Jibaritos y Más) · **mild sauce** / Harold's, rib tips
(Lem's, Uncle John's) · **the mother-in-law** (tamale in a bun) · the **Rainbow Cone** (Beverly) · **Garrett
popcorn** · **Chicago mix** · Malört · **pączki** · Swedish (Andersonville) · Polish (Milwaukee Ave) ·
Ukrainian Village · Pilsen/Little Village carnitas & tacos · Chinatown · Devon Ave · Argyle pho.

## Sources (ranked palette)
1. **Institutional (lone OK):** Michelin Guide Chicago (stars + Bib), James Beard (awards, America's Classics),
   NPS (Pullman NM, Indiana Dunes NP), UNESCO (Robie House, Unity Temple — FLW 20th-c. architecture listing).
2. **Editorial of record:** Chicago Tribune (`CHITRIB`), Sun-Times (`SUNTIMES`), Chicago Magazine (`CHIMAG`),
   Chicago Reader (`CHIREADER`), WBEZ, WTTW, Block Club Chicago (`BLOCKCLUB`), Crain's.
3. **Food/travel media:** Eater Chicago (`EATERCHI`), The Infatuation (`INFATUATION`), Time Out Chicago
   (`TIMEOUT`), Choose Chicago (`CHOOSECHI`, CVB), Atlas Obscura (`ATLASOBSCURA`), Chicago Architecture Center
   (`CAC`), Wikipedia (`WIKIPEDIA`, for landmarks), official sites (`OFFICIAL`), NYT, Bon Appétit, Food & Wine.
4. **Creators (1 corroborating source each, vetted in `CREATORS_<tag>.json`):** e.g. Dave Portnoy One Bite,
   Mark Wiens, Best Ever Food Review Show, Chicago-based food creators with verifiable followings.
**Zero:** Yelp, TripAdvisor, Google, OpenTable (measurement only).

## Hard rules (verbatim from docs/AGENT-PROMPTS.md)
≥2 credible or one lone institution; merit bar (measure, don't pad); fact-check open/closed (notable closed →
`closed:true` kept; non-notable closed → drop); NO coordinates in discovery files (geocodes go in
`geo/_geoout_<tag>.json` only, never from memory, place pins only, UNVERIFIED if unresolvable); no duplicates
(check `chi_dataset.json` first); cuisine tag = the kitchen's tradition, named dish.

## Record formats
- `FOOD_<tag>.json`: `[{t,a,cz:[labels],dish,n,address,w,closed,sources:[[KEY,url],…]}]`
- `SIGHTS_<tag>.json`: `{"sights":[{t,a,n,address,w,k,sources}],"sources":[{key,name,url}]}`
- `SOURCES_<tag>.json`: `{"outlets":[{key,name,type,url,credible,rank}],"creators":[]}`
- `CREATORS_<tag>.json`: `{creators:[{key,name,platform,handle,url,scale,niche,credible}],attach:[{place,creatorKey,url}],rejected:[]}`
- `geo/_geoout_<tag>.json`: `[{n,address,lat,lng,geoSource,confidence,status,statusSource,note}]`
