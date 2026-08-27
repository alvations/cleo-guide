# Wheeling WV & the National Road corridor — standing research brief

Region = **Wheeling, WV** + nearby **Washington, PA** + the **National Road (US-40 / I-70) corridor** west
through eastern Ohio — **St. Clairsville / Belmont County**, **Cambridge / Guernsey County** — to
**Zanesville / Muskingum County**, up to where the Columbus guide's eastern edge begins (New Concord,
Norwich, toward Newark/Buckeye Lake). Standard engine theme. Same pipeline + gates as every US city.

## Area ids (use these exact ids in every record's `a`)
- `WHL` — Wheeling, WV (downtown, Centre Market, Oglebay, Wheeling Island, Suspension Bridge, Independence Hall)
- `WASH` — Washington, PA (Washington & Jefferson College, LeMoyne House, Pony League, Bradford House)
- `OHV` — Ohio Valley: St. Clairsville & Belmont County OH (Barnesville, Great Stone Viaduct, National Road)
- `CAM` — Cambridge & Guernsey County (Dickens Victorian Village, Mosser Glass, Salt Fork SP, Hopalong Cassidy, Kennedy's Bakery)
- `ZAN` — Zanesville & the National Road to the Columbus edge (Y-Bridge, pottery, Tom's Ice Cream Bowl,
  Lorena Sternwheeler; New Concord = John & Annie Glenn Museum; Norwich = National Road/Zane Grey Museum)

Every area needs **≥1 tier-1 must-see** or the build asserts.

## Food canon (the Ohio Valley opening move — do this first)
Name what's unique, then find the places: **DiCarlo's Pizza** (Wheeling-style — cold shredded cheese on a
crisp square, cheese added after baking), **Coleman's Fish Market** fish sandwich (Centre Market, Wheeling),
**WV pepperoni rolls**, the valley's deep **Italian** heritage (Undo's, Figaretti's, Ye Olde Alpha, Later
Alligator, Ihlenfeld/Vagabond), and Zanesville's **Tom's Ice Cream Bowl** & **Adornetto's** pizza; plus
corridor diners, breweries and Washington PA institutions. Tag cuisine by the **kitchen's own tradition**.

## Sights canon
**Wheeling Suspension Bridge** (oldest major long-span in the US), **West Virginia Independence Hall**,
**Oglebay Resort & Park** (Good Zoo, Festival of Lights, glass museum), **Centre Market**, Capitol Theatre,
Kruger Street Toy & Train Museum, Wheeling Heritage Trail; Washington PA — LeMoyne House (NRHP), Bradford
House, the David Bradford; **Zanesville Y-Bridge**, the pottery/ceramics legacy (Alan Cottrill Studio,
Zanesville Museum of Art), Lorena Sternwheeler; **Cambridge** — Dickens Victorian Village, Mosser Glass,
**Salt Fork State Park**, the Great Guernsey Trail; **Norwich** — National Road/Zane Grey Museum; **New
Concord** — John & Annie Glenn Museum; the Great Stone Viaduct (Bellaire), Mail Pouch barns, Blaine Hill.

## Ranked source palette (credible = counts toward the ≥2 bar)
- **Wheeling:** The Intelligencer / Wheeling News-Register (Ogden), **Weelunk** (Wheeling culture site),
  Wheeling Heritage, Visit Wheeling WV (CVB), WTRF-7, WV Tourism.
- **Washington PA:** Observer-Reporter (the daily), Washington County PA tourism, Uncovering PA.
- **Zanesville / Cambridge:** Zanesville Times Recorder, Visit Zanesville-Muskingum County, The Daily
  Jeffersonian, Visit Guernsey County / Dickens Victorian Village, Ohio.org, Ohio Magazine.
- **Regional/institutional:** Atlas Obscura, Wikipedia (coords/notability), National Register (NRHP), NPS
  (National Road), Ohio DNR / WV State Parks. **Lone-authority-OK:** James Beard, NPS.
- **NEVER a recommender:** Yelp, TripAdvisor, OpenTable, Google (measure/fact-check only = 0 toward the two).

## Rules (identical to every city)
- **≥2 credible sources per place** (or one lone institutional authority). **Merit bar** — measure acclaim
  before adding; no padding; record MEASURED & DROPPED. Vet creators (real following + findable content).
- **Fact-check OPEN/CLOSED** (2025/2026). Notable closed → `"closed":true` (kept, flagged); else drop.
- **NO coordinates** in discovery. **No duplicates** — read the built dataset's `F`/`P` first.

## Artifacts (consumed by `tools/rebuild-city.py wheeling-wv [--build]`)
- Food: `FOOD_<tag>.json` (array `{t,a,cz,dish,n,address,w,closed,sources}`).
- Sights: `SIGHTS_<tag>.json` (`{"sights":[{t,a,n,address,w,k?,sources}], "sources":[{key,name,url}]}`).
- Optional `SOURCES_<tag>.json`, `CREATORS_<tag>.json`, `_note_<tag>.md`. Don't edit shared files.
