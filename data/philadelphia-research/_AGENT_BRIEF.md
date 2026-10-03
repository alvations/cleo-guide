# Philadelphia, PA — standing agent brief (key `philadelphia-pa`, slug `philadelphia`)

Page `cities/philadelphia.html` · dataset `data/philadelphia.dataset.json` · build `tools/build-philadelphia.py`
(cloned from build-washingtondc.py; centre + labels DERIVED from pins) · consolidate `consolidate.py` → `phi_dataset.json`.
Density benchmark: **New York (~500)** — per-area targets in RESUME.md, measured by `python3 tools/density.py philadelphia-pa`.

## Scope
City of Philadelphia + the Main Line / Montgomery / Delaware / lower Bucks suburbs, the South Jersey edge
(Camden waterfront, Collingswood, Haddonfield, Cherry Hill), and Brandywine / Valley Forge / New Hope day trips.
**OUT of scope: Lancaster County / Amish Country, Reading, Hershey** — they belong to the Harrisburg-York-Lancaster map.
Wilmington DE is a Brandywine day-trip edge only (Winterthur, Nemours, Hagley).

## Areas (id ≤5 chars)
| id | area | covers |
|---|---|---|
| `CC` | Center City, Old City & the Parkway | Independence NHP, Old City, Society Hill, Washington Sq W, Gayborhood, Chinatown, Rittenhouse, Fitler Sq, Logan Sq/Parkway, Art Museum/Fairmount (south of Girard), Spring Garden, Callowhill, Penn's Landing |
| `SPH` | South Philly | Queen Village, Bella Vista, Italian Market/S 9th St, East Passyunk, Little Saigon/Washington Ave, Point Breeze, Pennsport, Girard Estate, Stadium District, Navy Yard, SW Philly/Bartram's edge (south of Washington Ave… Bartram's goes UCW) |
| `FISH` | Fishtown, Northern Liberties & Kensington | NoLibs, Fishtown, Kensington, East Kensington, Olde Kensington, Port Richmond (Polish), Bridesburg |
| `UCW` | University City & West Philly | Penn/Drexel, Spruce Hill, Cedar Park, Baltimore Ave, Malcolm X Park, Bartram's Garden, Kingsessing, Southwest (Woodland Ave African corridor), Overbrook, Wynnefield |
| `NPH` | North Philly, Fairmount Park & Brewerytown | Temple, Brewerytown, Strawberry Mansion, East/West Fairmount Park (Please Touch, Mann, Shofuso, Smith Memorial), Girard College, Hunting Park, Fairhill/El Centro de Oro (Puerto Rican), Nicetown, Tioga |
| `NW` | Northwest | Germantown, Mt Airy, Chestnut Hill, Manayunk, Roxborough, East Falls, Wissahickon Valley |
| `NE` | Northeast Philly | Frankford, Oxford Circle, Castor Ave, Cottman Ave, Rhawnhurst/Bustleton (Little Brazil, Russian/Ukrainian, Chinese), Fox Chase, Pennypack, Holmesburg, Tacony |
| `MAIN` | The Main Line & suburbs | Ardmore, Bryn Mawr, Wayne, Narberth, Merion (Barnes Arboretum), Conshohocken, Jenkintown, Glenside, Elkins Park, Willow Grove, King of Prussia mall, Upper Darby (69th St), Media, Swarthmore, Bensalem/Levittown, Bristol |
| `SJ` | South Jersey & the Camden edge | Camden waterfront (Adventure Aquarium, Battleship NJ, Walt Whitman House), Collingswood, Haddonfield, Cherry Hill, Westmont, Pennsauken, Mount Laurel |
| `DAY` | Brandywine, Valley Forge & day trips | Valley Forge NHP, Longwood Gardens, Brandywine River Museum, Winterthur, Hagley, Nemours, Kennett Square (mushrooms), West Chester, Phoenixville, New Hope/Lambertville, Doylestown (Mercer, Michener), Washington Crossing, Pennsbury Manor, Bucks County |

## Food canon (the opening move — name it before searching)
Cheesesteak (MERIT-MEASURE: Pat's/Geno's are famous rivals but critics/locals rank Dalessandro's, John's Roast Pork,
Angelo's, Steve's, Max's, Jim's, Woodrow's, Cleavers, Del Frisco's? — measure, keep standouts, record the call),
roast pork Italian (DiNic's, John's Roast Pork, George's), the hoagie (Liberty Kitchen, Cosmi's, Primo's, Antonio's,
Sarcone's Deli, Campo's, Hoagie City…), tomato pie (Iannelli's, Sarcone's, Corropolese, Tacconelli's (pizza)),
soft pretzels (Center City Pretzel Co., Philly Pretzel Factory origin, Miller's Twist at RTM), water ice (John's Water Ice,
Rita's origin, Siddiq's), scrapple (Dutch Eating Place at RTM, Hershel's), Tastykake / butterscotch krimpet (factory —
not visitable: record as gap/note), pork roll edge (South Jersey), Reading Terminal Market stalls, Italian Market,
South 9th St Mexican (South Philly Barbacoa, Los Cuatro Soles, El Compadre), Washington Ave Vietnamese
(Pho 75, Pho Ha, Café Nhan, Hung Vuong), Cambodian (Kalaya is Thai; Cambodian: Khmer Kitchen, Sophie's Kitchen? measure),
Indonesian (Hardena), Michelin Philadelphia 2025 guide (stars, Bib, Recommended), James Beard winners/semifinalists.

## Source palette (ranked; §2a mix: editorial · viral creators · travel sites · local picks)
1 — MICHELIN (Philadelphia guide 2025; lone OK), JAMESBEARD (lone OK), NPS (lone OK for NPS-operated sites),
INQUIRER / LABAN (Craig LaBan, critic of record), PHILLYMAG / FOOBOOZ (50 Best, Best of Philly), EATERPHILLY,
INFATUATION, VISITPHILLY (official tourism), WIKIPEDIA (sights, coords).
2 — BILLYPENN / WHYY, PHILLYVOICE, NYT, BONAPPETIT, ATLASOBSCURA, HIDDENCITY, TIMEOUT, LONELYPLANET, CNTRAVELER,
MURALARTS (official), local TV (6ABC, NBC10, CBSPHILLY) for status/news, MAINLINETODAY, NJMONTHLY, COURIERPOST.
Creators (corroborating only, vetted): Dave Portnoy One Bite (nationalCreators), Mark Wiens / Migrationology,
Philly food TikTokers with verifiable scale — record in CREATORS_<tag>.json with follower scale + findable URL.
Yelp / TripAdvisor / Google / OpenTable = ZERO (measurement only).

## Rules (HARD-RULES block from docs/AGENT-PROMPTS.md applies verbatim)
≥2 credible sources or a lone Michelin/JB/NPS · measure merit before adding · fact-check open/closed (notable closed →
keep with `closed:true`; non-notable closed → drop) · NO coordinates in discovery files · no duplicates · cuisine tag =
kitchen's own tradition + a named dish · gaps stated, not filled.

## Record schema
Food file `FOOD_<tag>.json` = array of `{t,a,cz,dish,n,address,w,closed,sources:[[KEY,url],…]}`.
Sights file `SIGHTS_<tag>.json` = `{"sights":[{t,a,n,address,w,k?,sources}],"sources":[{key,name,url}]}`.
Geocode output `geo/_geoout_<tag>.json` = list of `{n,address,lat,lng,geoSource,confidence,status,statusSource,note}`.
