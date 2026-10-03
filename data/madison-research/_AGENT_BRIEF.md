# Madison & Dane County (Wisconsin) — standing research brief

Key `madison-wi` · research slug `madison` · dataset `data/madison.dataset.json` · page `cities/madison.html`
· build `tools/build-madison.py`. Standard engine theme. Same pipeline + gates as every US city
(docs/PIPELINE.md, docs/SOURCES.md, docs/RUN-2026-10-02.md §2a source mix + §5b resumability).

## Area ids (use these exact ids in every record's `a`)
- `CAP` — the Isthmus & Capitol Square: downtown, King St, E. Wilson, Monona Terrace, the Capitol, MMoCA, Overture, Tenney/James Madison Park
- `UW` — UW–Madison campus & State Street: Bascom Hill, Memorial Union Terrace, Picnic Point, Chazen, Babcock Hall, Camp Randall, Lakeshore Preserve, Library Mall, State St
- `EAST` — East side: Williamson (Willy) St, Atwood/Schenk-Atwood, Olbrich Gardens, Monona, the north side (Warner Park, Maple Bluff), East Washington, Eastmorland
- `WEST` — West side: Monroe St, UW Arboretum, Vilas/Henry Vilas Zoo, Regent/Hilldale, Odana Rd, Shorewood Hills, Greenbush, Park St
- `MVF` — Middleton (Pheasant Branch, Mustard Museum, Capital Brewery), Verona (Epic campus), Fitchburg
- `DANE` — Dane County towns: Mount Horeb (Trollway, Little Norway area), Stoughton (Norwegian heritage, Syttende Mai), Sun Prairie, McFarland, Cross Plains, Mazomanie, Blue Mounds (Cave of the Mounds, Blue Mound SP), Cottage Grove, DeForest, Waunakee
- `TRIP` — Day trips: Spring Green (Taliesin, American Players Theatre, House on the Rock), New Glarus (brewery, Swiss village), Baraboo & Devil's Lake (Circus World, International Crane Foundation), Monroe (cheese), Wisconsin Dells edge, Mineral Point

Every area needs **≥1 geocoded tier-1 must-see** or the build asserts.

## Food canon (the opening move — done first)
Cheese curds (fresh squeaky + fried); the **Friday fish fry** (cod/perch/bluegill/walleye); **supper clubs** &
the **brandy old fashioned** sweet; **Dane County Farmers' Market** (largest producer-only farmers market in the
US, Capitol Square); **brats** (Brat Fest, taverns); **Babcock Hall** dairy ice cream (UW); **kringle** (Racine
is the source city — state the gap if Madison has none worthy); **Hmong & Laotian Madison** (Lao Laan-Xang,
Ahan…); **New Glarus beer** (Spotted Cow — sold only in Wisconsin); butter burgers/frozen custard (Culver's
roots, Michael's); Swiss (New Glarus) and Norwegian (Stoughton, Mount Horeb) heritage food; cheese shops.
Tag cuisine by the **kitchen's own tradition**, never one dish.

## Ranked source palette (credible = counts toward the ≥2 bar)
- **Local editorial of record:** Wisconsin State Journal (madison.com, `WSJ`), The Cap Times (`CAPTIMES`),
  Isthmus (`ISTHMUS`), Madison Magazine / Channel 3000 (`MADMAG`, incl. Best of Madison reader vote),
  City Cast Madison (`CITYCAST`), WKOW/WMTV/WISC local TV, Tone Madison.
- **Statewide:** Wisconsin Public Radio (`WPR`), PBS Wisconsin (`PBSWI`), Milwaukee Journal Sentinel
  (`JSONLINE`), OnMilwaukee, Travel Wisconsin (`TRAVELWI`), Destination Madison (`VISITMADISON`, the CVB).
- **Institutional (lone-authority-OK only where it applies):** James Beard (`JAMESBEARD` — winners Odessa
  Piper/L'Etoile 2001, Tory Miller 2012, Fairchild 2023; semifinalists), NPS (`NPS` — only sites it designates,
  e.g. NHLs/Ice Age NST), Wisconsin DNR (`WIDNR`, state parks — editorial weight, not lone), Frank Lloyd Wright
  Trust / Taliesin Preservation (`FLWTRUST`), Wisconsin Historical Society (`WHS`), NRHP.
- **Notable travel:** The Infatuation (Madison guide), Atlas Obscura, USA Today 10Best, Lonely Planet,
  Condé Nast/NatGeo where they cover Madison.
- **Creators (one corroborating source each, vetted):** see CREATORS_*.json — verifiable follower scale +
  a findable piece naming the place.
- **NEVER a recommender:** Yelp, TripAdvisor, OpenTable, Google (measure / status-check only = 0).

## Rules (identical to every city)
- ≥2 credible sources per place (or one lone institutional authority). Merit bar — measure before adding.
- Fact-check OPEN/CLOSED (2025/2026). Notable closed → `"closed":true` (kept, flagged); else drop.
- NO coordinates in discovery. No duplicates.

## Artifacts (consumed by `tools/rebuild-city.py madison-wi [--build]`)
- Food: `FOOD_<tag>.json` (array `{t,a,cz,dish,n,address,w,closed,sources}`).
- Sights: `SIGHTS_<tag>.json` (`{"sights":[{t,a,n,address,w,k?,sources}], "sources":[{key,name,url}]}`).
- `SOURCES_<tag>.json` (outlets with `credible`), `CREATORS_<tag>.json`, `geo/_geoout_<tag>.json`.
