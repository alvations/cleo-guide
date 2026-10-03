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
(none — W4 batches 1-3 committed 2026-10-03, session_01ECt8nbbQXGgxskj1179NHd; see State (W4).)

## State (2026-10-03, after W4)
- Discovered + sourced: **455** (172 sights, 283 food) — sourcecheck PASS 455/455. Page: **179 on map** (150 sights + 29 food).
  4 gates PASS; npm validate + test PASS; card + CITIES.md refreshed.
- Per area (density.py): CC 122/125 (+3) · SPH 80/85 (+5) · FISH 48/55 (+7) · UCW 34/40 (+6) · NPH 24/30 (+6) · NW 40/45 (+5) ·
  NE 23/25 (+2) · MAIN 29/35 (+6) · SJ 24/25 (+1) · DAY 32/35 (+3). **~44 to go.**
- Food share: CC 54% · SPH 85% · FISH 90% · UCW 68% · NE 78% · NW 55% · MAIN 55% · SJ 50% · **NPH 33% · DAY 25%** (still below bar).
- W4 files: FOOD_W4.json (31) · SIGHTS_W4.json (2) · SOURCES_W4.json (5 outlets) · geo/_geoout_w4_pinA/pinB (8 Wikipedia pins) ·
  geo/_geoout_w4_status.json (11 statuses) · geo/_geoout_w4_sights.json (Shot Tower). Worklists: _phi_pinlist_A/B.txt, _phi_statuslist.txt.
- Closures now flagged: Hiroki, Laurel, Tony's Place, Kensington Quarters, Dock Street Brewing (West Philly 50th St).
- PIN LESSON (W4): WebSearch never surfaces Google `!3d!4d` URLs, OSM nodes or Michelin coordinates — only Wikipedia infobox coords.
  ~250 restaurant pins can only be finished with tools/geocode-helper.html (browser). Don't spend more search budget on pin passes.

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

## Next wave (W5) — ordered plan (food & drink first in NPH and DAY)
1. **DAY +3 and food share (8/32)**: needs ≥2 credible per place — try Inquirer LaBan suburban reviews / Main Line Today "Best of" /
   Philly Mag for: Victory Brewing Downingtown (address needed), Iron Hill West Chester (3 W Gay St), Side Bar (10 E Gay St), Portabello's
   (Kennett), Black Bass Hotel (3774 River Rd, Lumberville — OpenTable 4.8/4,966 measured), Lambertville Station, d'floret, Dilworthtown Inn,
   Kennett Brewing, Triumph New Hope, 1906 at Longwood, Marsha Brown.
2. **NPH +6 (food 8/24)**: second source for the Fairhill held four (El Bohio, La Sierra, La Caribeña, El Príncipe — try Al Día, WHYY,
   Inquirer "El Centro de Oro"); Isla Verde Cafe; Brewerytown: Boozy Mutt done, try Brewerytown Beats/Taproom, Fairmount Park Parks on Tap;
   Temple: Iron Hill N Broad (1700 N Broad St). Sights: Church of the Advocate, Smith Memorial Arch, Uptown Theater.
3. **FISH +7**: Next of Kin (confirm location), Dock Street Fishtown, St. Oner's (Tired Hands), Brewery ARS Frankford Ave, Philly Style Bagels,
   Cake Life, Sor Ynez; sights: Liberty Lands Park, St. Michael's (NoLibs), Palmer Cemetery, Penn Treaty Museum, Fishtown shad signs.
4. **UCW +6 / MAIN +6 / NW +5 / SPH +5 / CC +3 / NE +2 / SJ +1**: UCW Aksum, Lil Pop Shop, Tacos Don Memo, Kabobeesh, City Tap House, Distrito;
   sights Paul Robeson House, Malcolm X Park. MAIN Villa Artigiano, McCloskey's, Izzy's (Inquirer Ardmore map) + Lassan/Narberth; sights Grey
   Towers, Ambler Theater. NW Zion's Cuisine, Ramen MNYK, Biryani Bowl, Trolley Car. SPH Schmaltz, Grace Tavern, The Sidecar, Café Ynez; Bok
   rooftop. CC Lillian's, Little Nonna's, Barbuzzo, Morimoto. NE Lipkin's (8013 Castor), Passage (10783 Bustleton), Four Seasons Diner.
   SJ Indiya (612 Haddon), Cafe Antonio's (827 Haddon) — need a 2nd attributable source.
5. Status pass on ~170 still-unchecked places: use 2026 closings round-ups by month, then current best-of lists (efficient multi-name hits).
6. Pins: tools/geocode-helper.html on the UNVERIFIED backlog (~250 restaurants).
7. Every ~50 places: `flock … python3 tools/rebuild-city.py philadelphia-pa --build` → gates → npm validate/test →
   `python3 data/philadelphia-research/_phi_card.py <sights_on> <food_on> <sourced> <date> "<note>"` (under the lock).

## Acceptance checklist
- [ ] every area OK in density.py (W4: ~44 short — SJ/NE/CC nearly there)
- [x] --sourcecheck / --geocheck / --statuscheck / --buildcheck green (2026-10-03)
- [x] npm run validate && npm test green (2026-10-03)
- [x] index card live with counts; CITIES.md row; AGENT-PROMPTS run-log rows (2026-10-02)
