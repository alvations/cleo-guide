# State College / Penn State (Happy Valley, PA) — standing research brief

Region = **Downtown State College** + the **Penn State University Park** campus + the historic Centre
County towns (**Bellefonte, Boalsburg**) + the **Happy Valley** outskirts (Pine Grove Mills, Lemont,
Penns Valley, Rothrock/Black Moshannon). Standard engine theme. Same pipeline + gates as every US city.

## Area ids (use these exact ids in every record's `a`)
- `DT` — Downtown State College (College Ave, Beaver Ave, Allen St, Calder Way)
- `PSU` — Penn State University Park campus (Old Main, Beaver Stadium, HUB, Pattee/Paterno, Palmer Museum, Arboretum, Berkey Creamery)
- `BVL` — Bellefonte & Boalsburg (historic towns; Bellefonte Victorian district, Boalsburg = "birthplace of Memorial Day")
- `HV` — Happy Valley & Centre County (Pine Grove Mills, Lemont, Penns Valley/Millheim, Rothrock SF, Black Moshannon SP, Penn's Cave)

Every area needs **≥1 tier-1 must-see** or the build asserts.

## Food canon (the college-town opening move — do this first)
Name what's unique to Happy Valley, then find the places: **Berkey Creamery** ice cream (Penn State's own),
the **grilled sticky** at **Ye Olde College Diner**, **The Corner Room** / **Waffle Shop** diner classics,
tavern **wings**, tavern **pizza** (Faccia Luna, Canyon, Margarita's), **Happy Valley craft beer** (Otto's
Pub & Brewery, Robin Hood, Elk Creek Café+Aleworks, Happy Valley Brewing, Voodoo), Meyer Dairy, plus the
college-town spread — Zola/Harrison's/Kelly's (New American), Herwig's (Austrian), Indian/Thai/Korean/Med.
Tag cuisine by the **kitchen's own tradition**, never one dish.

## Sights canon
Old Main, Nittany Lion Shrine, Beaver Stadium & the All-Sports Museum, Palmer Museum of Art, The Arboretum
at Penn State, Berkey Creamery, HUB, Pattee/Paterno Library; Mount Nittany (hike), Penn's Cave, Rothrock
State Forest, Black Moshannon State Park, Whipple Dam; Boalsburg (Pennsylvania Military Museum, Boal Mansion
& Columbus Chapel, the Memorial Day story), Bellefonte (Victorian historic district, Talleyrand Park,
Gamble Mill), Centre Furnace Mansion, Millbrook Marsh.

## Ranked source palette (credible = counts toward the ≥2 bar)
- **Local:** Centre Daily Times (CDT — the daily), StateCollege.com, Happy Valley Adventure Bureau (HVAB —
  the CVB/tourism), WTAJ, WPSU.
- **Penn State:** Onward State, The Daily Collegian, Penn State News, GoPSUsports (official athletics).
- **Regional/travel:** Uncovering PA (Jim Cheney — established PA travel writer), PA Eats, Visit PA, USA
  Today 10Best, Atlas Obscura, Wikipedia (coords/notability), the National Register (NRHP), PA DCNR (parks).
- **Institutional / lone-authority-OK:** James Beard, NPS/Smithsonian (rare here).
- **NEVER a recommender:** Yelp, TripAdvisor, OpenTable, Google (measure/fact-check only = 0 toward the two).

## Rules (identical to every city)
- **≥2 credible sources per place** (or one lone institutional authority). **Merit bar** — measure acclaim
  before adding (an award, a famous-creator/major-press rave, or a high rating w/ real volume on ≥2
  platforms). No padding; record MEASURED & DROPPED. Vet creators (real following + findable content).
- **Fact-check OPEN/CLOSED** (2025/2026). Notable closed → `"closed":true` (kept, flagged); else drop.
- **NO coordinates** in discovery. **No duplicates** — read the built dataset's `F`/`P` first.

## Artifacts (consumed by `tools/rebuild-city.py state-college-pa [--build]`)
- Food: `FOOD_<tag>.json` (array `{t,a,cz,dish,n,address,w,closed,sources}`).
- Sights: `SIGHTS_<tag>.json` (`{"sights":[{t,a,n,address,w,k?,sources}], "sources":[{key,name,url}]}`).
- Optional `SOURCES_<tag>.json`, `CREATORS_<tag>.json`, `_note_<tag>.md`. Don't edit shared files.
