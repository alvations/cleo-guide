# Philadelphia — RESUME (read this first to continue)

Key `philadelphia-pa` · slug `philadelphia` · page `cities/philadelphia.html` · dataset `data/philadelphia.dataset.json`.
Brief: `_AGENT_BRIEF.md`. Ledger: `AUDIT.md` (append-only). Protocol: `docs/RUN-2026-10-02.md`.

## Density targets (NYC-dense, ~500 total; parsed by tools/density.py)
- `CC` Center City, Old City & the Parkway — ~125
- `SPH` South Philly — ~85
- `FISH` Fishtown, Northern Liberties & Kensington — ~55
- `UCW` University City & West Philly — ~40
- `NPH` North Philly, Fairmount Park & Brewerytown — ~30
- `NW` Northwest (Germantown, Chestnut Hill, Manayunk) — ~45
- `NE` Northeast Philly — ~25
- `MAIN` The Main Line & suburbs — ~35
- `SJ` South Jersey & the Camden edge — ~25
- `DAY` Brandywine, Valley Forge & day trips — ~35

## Commands
```bash
python3 tools/density.py philadelphia-pa                       # discovered per area vs target
LOCK=/home/user/cleo-guide/.git/cleo-shared.lock
flock -w 3600 $LOCK python3 tools/rebuild-city.py philadelphia-pa           # prep + sourcecheck
flock -w 3600 $LOCK python3 tools/rebuild-city.py philadelphia-pa --build   # + geo-merge, build, 4 gates, backlog
```

## In-flight wave
(none — W3 complete and committed 2026-10-02, session_013h32337aVQ9QKB7DKgSPdW; ended at the 200-search session cap)

## State (2026-10-02, after W3)
- Discovered + sourced: **422** (170 sights, 252 food) — sourcecheck PASS 422/422. Page: **170 on map** (149 sights + 21 food).
- Per area (discovered / target, from `python3 tools/density.py philadelphia-pa`): CC 117/125 (+8) · SPH 74/85 (+11) ·
  FISH 41/55 (+14) · UCW 31/40 (+9) · NPH 23/30 (+7) · NW 35/45 (+10) · NE 18/25 (+7) · MAIN 28/35 (+7) · SJ 24/25 (+1) ·
  DAY 32/35 (+3). **~80 to go.** (density.py previously double-counted phi_worklist.json — fixed in W3; numbers above are real.)
- Gates: --sourcecheck / --geocheck / --statuscheck / --buildcheck all PASS; npm validate + test PASS; card + CITIES refreshed.
- Closures flagged: Hiroki — CLOSED, Laurel — CLOSED, Tony's Place — CLOSED (Mayfair 2022). Dropped (non-notable closed): Cheu
  Fishtown, Jansen, Italiano's, Pizza Brain Fishtown, Lunar Inn, Martha, Syrenka, Krakus, Nam Son, Rangoon, Earth Bread, Bing Bing.
- Food status: geo/_geoout_w3_food.json holds 98 W3 statuses (41 open · 56 unknown · 1 closed); **~88 W3 food records still have
  no status/address check** (list = FOOD_W3 names not in geo/_geoout_w3_food.json or _geoout_w3_foodpins.json).
- Search budget: this session's 200 WebSearch calls are used (~125 main visible calls, many fanning out; 3 status agents ~91).

## Files
W1/W2: FOOD_MICHELIN.json (34) · FOOD_CANON.json (27) · FOOD_W1B.json (4) · SIGHTS_W1.json (73) · SIGHTS_W2.json (43) · CREATORS_W1.json
W3: FOOD_W3.json (188) · SIGHTS_W3.json (54) · SOURCES_W3.json (Visit NJ, Northeast Times, Valley Forge Tourism) · CREATORS_W3.json
(Portnoy → Angelo's) · geo/_geoout_w3_food.json (statuses) · geo/_geoout_w3_sights.json (42 Wikipedia pins) ·
geo/_geoout_w3_foodpins.json (7 restaurant Wikipedia pins). Helpers: _phi_add.py (append + dedupe), _phi_w3f.py (pipe-line → records),
_phi_sg.py (sight + pin), _phi_geo.py (geoout append), _phi_card.py (index card + CITIES row), _phi_docs_w3.py (run-log/notes).

## W4 binding rule — food & drink share (RUN-2026-10-02 §2b, orchestrator message 05:33Z)
Keep ≥50% of each area FOOD & DRINK (restaurants, markets/street food, bakeries, cafés, bars/cocktail/wine bars, breweries,
distilleries). Food share after W3: CC 61/117 (52%) · SPH 63/74 (85%) · FISH 37/41 (90%) · UCW 20/31 (65%) · NE 13/18 (72%) ·
MAIN 15/28 (54%) · SJ 12/24 (50%) · **NPH 7/23 (30%) · NW 17/35 (49%) · DAY 8/32 (25%)** — below the bar.
→ W4 spends food/drink first in NPH (Temple/Brewerytown/Fairhill: El Bohio, La Sierra, La Caribeña, Delicias, El Principe,
Taqueria La Raza held), DAY (Marsha Brown, 1906 at Longwood, Portabello's, Kennett Square, Phoenixville/West Chester bars,
Chaddsford Winery), NW (Chestnut Hill Brewing, Mt Airy Tap Room, Bar Lizette, Downtime Bakery, Hot Clucks, Tyemeka's, Zion's),
then UCW drinks, FISH breweries, NE, MAIN. W3 did not apply this rule — the session's search budget was spent before it arrived.

## Next wave (W4) — ordered plan
1. **Status/address pass on the ~88 unchecked W3 food** (short 1-2-name queries; start with 2026 closings round-ups). Several
   addresses are partial (Bastia, Fiore-area done, White Yak, Liberty Kitchen, Eshkol, Phil & Jim's, Federal Donuts, Hello Vietnam…).
2. **FISH +14** (fewest sights: 4): Graffiti Pier (re-check access after the 2024 partial collapse), Liberty Lands, St. Adalbert,
   Norris Square / Las Parcelas, Penn Treaty Museum; food leads HELD: Izakaya Fishtown, Nunu, Jean, Ekta, Primary Plant Based,
   Cake Life, Philly Style Bagels, Stock's Bakery (Port Richmond), Sor Ynez, Next of Kin, Caletta, Bottle Bar East, Interstate Drafthouse.
3. **SPH +11**: Little Saigon (Pho Ha, Cafe Diem, BB Tee House), Point Breeze/Newbold, Pennsport (2nd Street Brewhouse, Pennsport Beer
   Boutique), Mancuso's, D'Emilio's, Stina, La Llorona, Barcelona Wine Bar, Juana Tamale; sights: Shot Tower, Bok Building rooftop.
4. **NW +10**: Chestnut Hill Brewing, New Era Indian, CinCin, Tokyo Sushi, Trolley Car Cafe, Mt Airy Tap Room, Bar Lizette, Downtime
   Bakery, Hot Clucks, Tyemeka's, Zion's Cuisine; sights: Germantown White House + Wyck pins, Woodward houses, Andorra.
5. **UCW +9**: Buna Cafe, Tacos Don Memo, Lil Pop Shop, Green Line Cafe, Mood Cafe, Kabobeesh, Nafi, Corio; sights: Paul Robeson
   House, Malcolm X Park, Penn campus (Fisher done), Cira Green, Woodland Ave African corridor.
6. **CC +8 / NPH +7 / NE +7 / MAIN +7 / DAY +3 / SJ +1**: CC — Little Nonna's, Barbuzzo, El Vez, Morimoto, Buddakan, Trattoria
   Carina, Uchi, Rail Park (2nd source), Fireman's Hall (2nd outlet), Old St. Joseph's, Cherry/Race St Piers; NPH — Church of the
   Advocate, Smith Memorial Arch, Uptown Theater, Temple; NE — Ipanema, Passage, Sergio's, Insectarium, Holy Redeemer; MAIN — Grey Towers
   Castle, Manorah, Mary (Ambler), Daisy Tavern, Ambler Theater; DAY — Marsha Brown, 1906 at Longwood, Portabello's; SJ — Collingswood
   Farmers Market, Haddonfield downtown.
7. Creator channel: Portnoy 2026 Philly stops (Johnny's Bryn Mawr, Marina's Fishtown, Liguria) — attach only if scores are findable;
   Mark Wiens Philly Pt 1; Philly TikTok food creators with verifiable scale (W1 scan found none qualifying).
8. Restaurant pins: run tools/geocode-helper.html on the UNVERIFIED backlog (~230) — WebSearch only pins restaurants with Wikipedia articles.
9. Every ~50 places: `flock … python3 tools/rebuild-city.py philadelphia-pa --build` → gates → npm validate/test →
   `python3 data/philadelphia-research/_phi_card.py <sights_on> <food_on> <sourced> <date> "<note>"` (under the lock).

## Acceptance checklist
- [ ] every area OK in density.py (W3: ~80 short — SJ/DAY nearly there)
- [x] --sourcecheck / --geocheck / --statuscheck / --buildcheck green (2026-10-02)
- [x] npm run validate && npm test green (2026-10-02)
- [x] index card live with counts; CITIES.md row; AGENT-PROMPTS run-log rows (2026-10-02)
