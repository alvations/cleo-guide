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
(none — W7 PINS committed 2026-10-03, session_01847XyVQRMAQiVAHDWpaEmS; see State (W7).)

## State (2026-10-03, after W7 — PINS via aggregator listings)
- Discovered + sourced: **518** (unchanged). Page: **363 on map (165 sights + 198 food)**, up from 276. Confidence: 240 high · 123 med.
  4 gates PASS; statuscheck CONSISTENT; npm validate + test PASS; card + CITIES + AGENT-PROMPTS run-log refreshed.
- Pinned / discovered per area: CC 109/126 · SPH 61/85 · FISH 29/56 · UCW 27/40 · NPH 20/33 · NW 26/45 · NE 17/25 · MAIN 25/35 · SJ 15/25 ·
  DAY 34/48. **~155 still UNVERIFIED.**
- **Channel that works now (≈80% hit rate):** one place per WebSearch, `"<Name> <street address> <city> GPS coordinates"` with
  `allowed_domains: ["restaurantguru.com","wanderlog.com","sirved.com","restaurantji.com","menupix.com"]` — the listing's lat/lng comes back in the
  answer. Check the point against the street block (cross-street sanity), grade `med`; Waze `place.*` with matching name+address → `high`.
  Writer: `python3 data/philadelphia-research/_pinw.py philadelphia-pa <tag> < lines` ("Name|lat|lng|conf|source[|corrected address]").
- W7 files: geo/_geoout_w7a.json (34) · _w7b (8) · _w7c (23) · _w7d (22).

## State (2026-10-03, after W6 — PINS)
- Discovered + sourced: **518** (176 sights, 342 food) — unchanged. Page: **276 on map (165 sights + 111 food)**, up from 182.
  Confidence on page: 238 high · 38 med. 4 gates PASS; **statuscheck 0 unchecked** (every on-page place has a sourced status); 10 closed
  flagged; npm validate + test PASS; card + CITIES + AGENT-PROMPTS run-log refreshed.
- Pinned / discovered per area: CC 92/126 · SPH 45/85 · FISH 20/56 · UCW 19/40 · NPH 18/33 · NW 19/45 · NE 11/25 · MAIN 14/35 ·
  SJ 11/25 · DAY 27/48. **~242 still UNVERIFIED** (mostly restaurants; suburbs/NW worst).
- Channel that worked: WebSearch `allowed_domains:["maps.apple.com"]`, 3 "Name street-address" per query → Apple URLs with
  `coordinate=`/`ll=` (Apple's own place pin). Yield ≈1 coordinate per 2 names in CC/SPH/FISH, ≈1 per 6 in MAIN/SJ/DAY/NW, ~0 on retries.
  Sights: `allowed_domains:["en.wikipedia.org"]` "<name> coordinates", 1–2 per query (infobox coords). Helpers: `_phi_pinurl.py`
  (parses the URL, refuses a high pin when the URL's street number ≠ the record's), `_phi_pin.py`, `_phi_close.py`.
- W6 files: geo/_geoout_w6a.json (49) · _geoout_w6b.json (29) · _geoout_w6c.json (16: 14 sights + CJ & D's + Irwin's) ·
  _geoout_w6s.json (statuses: 9 on-page checks, Max's, + CLOSED Manakeesh, The Olde Bar, Todd House).

## State (2026-10-03, after W5)
- Discovered + sourced: **518** (176 sights, 342 food) — sourcecheck PASS 518/518. Page: **182 on map** (151 sights + 31 food).
  4 gates PASS (statuscheck: 7 closed flagged, 9 on-page places still without a closure check); npm validate + test PASS; card + CITIES refreshed.
- Per area (density.py) — **every area OK**: CC 126/125 · SPH 86/85 · FISH 56/55 · UCW 40/40 · NPH 33/30 · NW 45/45 · NE 25/25 ·
  MAIN 35/35 · SJ 25/25 · DAY 48/35.
- Food & drink share — **every area ≥ 50%**: CC 56% · SPH 86% · FISH 89% · UCW 68% · NPH 52% · NW 60% · NE 80% · MAIN 60% · SJ 52% · DAY 50%.
- **The gap is now pins, not discovery: ~336 sourced places (almost all restaurants) are UNVERIFIED** and held off the page by the
  geocode gate. W5 proved WebSearch can't close it (3/34 pins, all host-building Wikipedia coords) → `tools/geocode-helper.html`.
- W5 files: FOOD_W5.json (58) · SIGHTS_W5.json (4) · SOURCES_W5.json (FOODANDWINE, PHILLYTRIB, PPS, CRAFTBEERBREWING) · CREATORS_W5.json
  (Mark Wiens → Angelo's) · geo/_geoout_w5_pinA.json (34: 3 med) · geo/_geoout_w5_disc.json (Paul Robeson House, high) ·
  geo/_geoout_w5_status.json (6 statuses). Push helper: `_phi_push.sh` (regenerates docs/GEOCODE-BACKLOG.md on merge conflict).
- Corrections: Tony Luke's → "Tony & Nick's Steaks (formerly Tony Luke's)"; Joe's Steaks re-addressed to the Fishtown flagship
  (1 W Girard Ave) and its stale Torresdale pin removed; Tired Hands Brewing Company (16 Ardmore Ave) and Declaration House flagged CLOSED.

## State (2026-10-03, after W4)
- Discovered + sourced: **456** (172 sights, 284 food) — sourcecheck PASS 456/456. Page: **179 on map** (150 sights + 29 food).
  4 gates PASS; npm validate + test PASS; card + CITIES.md refreshed.
- Per area (density.py): CC 122/125 (+3) · SPH 80/85 (+5) · FISH 48/55 (+7) · UCW 34/40 (+6) · NPH 25/30 (+5) · NW 40/45 (+5) ·
  NE 23/25 (+2) · MAIN 29/35 (+6) · SJ 24/25 (+1) · DAY 32/35 (+3). **~43 to go.**
- Food share: CC 54% · SPH 85% · FISH 90% · UCW 68% · NE 78% · NW 55% · MAIN 55% · SJ 50% · **NPH 33% · DAY 25%** (still below bar).
- W4 files: FOOD_W4.json (32) · SIGHTS_W4.json (2) · SOURCES_W4.json (6 outlets) · geo/_geoout_w4_pinA/pinB (8 Wikipedia pins) ·
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

## Next wave (W8) — ordered plan (pins; discovery is at density)
1. **Keep the aggregator channel** (above) for the ~155 UNVERIFIED — it was nowhere near exhausted when W7's budget ran out. Untried names
   first: FISH (Amá, Emilia, Elma, Gilda, Front Street Cafe, Loco Pez, Stock's, Evil Genius, Four Humours, Kostas, Barcade, Bottle Bar East,
   Les & Doreen's, St. Oner's, Mixteca, Boricua #2, Café Tinto, Joe's Steaks 1 W Girard), NPH (Porky's Point, El Coqui, Rybrew, Denise's),
   UCW (Fu-Wah, Terakawa, Franklin's Table, Clarkville, Sabrina's, Local 44, Vietnam Cafe), NW (Töska, Malelani, CinCin, Bar Jawn, Santucci's,
   White Yak, Liberty Kitchen), NE (Bishos, Miracles, Asad's, Taqueria La Patrona, Bell's Market), SPH (Cacia's, Le Caveau, Perla, Scampi),
   CC (Sally, Illata, Little Water, Via Locusta, a.kitchen, Grace Tavern, Bar Cicci, Malooga), MAIN/SJ/DAY remainder (Carlino's, Ripplewood,
   Rosalie, Eshkol, Little Blue Owl, Conshohocken Brewing, Free Will, Levante, Stable 12, Portabello's, River House, Stella, Chaddsford Winery).
2. **Retry the misses with Waze phrasing** (`"<Name> <street> latitude longitude"`, `allowed_domains` waze/usarestaurants/foursquare): The Franklin
   Fountain, Vietnam Restaurant, La Jefa, Ogawa, Sarcone's Bakery + Deli, Di Bruno (9th St), Pop's, Pho 75, Philadelphia Brewing Co, Amy's
   Pastelillos, George's Sandwich Shop, Honeysuckle, Frankford Hall, Teikoku, Nam Phuong (own pin, not the plaza's).
3. **Address/status leads:** Hank's Place (Chadds Ford 1635 Creek Rd vs temporary Kennett site), plus W6's Paesano's, Goldie, Portabello's,
   Holmesburg Bakery, Bell's Market, American Sardine Bar, White Yak, Wyck, Gou; Buna Cafe; Love City Manayunk; Conshohocken Brewing.
4. **Sights (11 left):** Wikipedia/NPS coordinates — Bishop White House, Wyck (real pin), Fillmore, Clay Studio, Taller Puertorriqueño,
   Schuylkill Center, Las Parcelas, Liberty Lands, Main Street Manayunk, Wiggins Park.

## Acceptance checklist
- [x] every area OK in density.py (W5, 2026-10-03) — and every area ≥50% food & drink
- [x] --sourcecheck / --geocheck / --statuscheck / --buildcheck green (2026-10-03, after W5)
- [ ] restaurant pins: ~155 UNVERIFIED (W6 Apple 182 → 276; W7 aggregator listings 276 → 363) — continue W8 plan
- [x] closure check on every on-page place (W6, 2026-10-03 — statuscheck 0 unchecked)
- [x] npm run validate && npm test green (2026-10-03)
- [x] index card live with counts; CITIES.md row; AGENT-PROMPTS run-log rows (2026-10-02)
