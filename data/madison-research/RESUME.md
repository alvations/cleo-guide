# Madison & Dane County (WI) — RESUME checkpoint (read first)

Resume order: **docs/RUN-2026-10-02.md → this file → AUDIT.md tail → _AGENT_BRIEF.md →
`git log --oneline -20 -- data/madison-research`**. Then:
```bash
python3 tools/density.py madison-wi                                   # discovered vs target per area
cd data/madison-research && python3 consolidate.py                     # dataset preview
flock -w 3600 /home/user/cleo-guide/.git/cleo-shared.lock python3 tools/rebuild-city.py madison-wi --build
```

## Density targets (Pittsburgh-peer ~210; parsed by tools/density.py)
- `CAP` the Isthmus & Capitol Square — ~38
- `UW` UW campus & State Street — ~30
- `EAST` east side (Willy St / Atwood / Monona / north side) — ~32
- `WEST` west side (Monroe St / Arboretum / Hilldale / Odana) — ~30
- `MVF` Middleton, Verona & Fitchburg — ~25
- `DANE` Dane County towns — ~25
- `TRIP` day trips (Spring Green, New Glarus, House on the Rock, Devil's Lake) — ~30

## Acceptance
- [x] every area `OK` in `tools/density.py madison-wi` (W7); every place ≥2 credible (or lone JB/NPS); merit-measured
- [ ] every place status-checked (closures kept, flagged)
- [ ] `--sourcecheck` PASS · `--geocheck` PASS · `--statuscheck` CONSISTENT · `--buildcheck` PASS · npm validate/test
- [ ] index.html CARD:madison-wi relinked live with counts; docs/CITIES.md row; AGENT-PROMPTS run-log rows

## State
- 2026-10-02 scaffold: consolidate.py (7 areas, Wisconsin cuisine taxonomy), _AGENT_BRIEF.md, AUDIT.md, this file,
  tools/build-madison.py. Keys were pre-registered (research.js, geocode-status.py, rebuild-city.py, density.py).

- **2026-10-02 W1 (food canon) TRUNCATED** — WebSearch session cap hit (200/200, shared by all agents) after ~22
  Madison searches. Kept 3 food (FOOD_CANON.json); 14 outlets (SOURCES_W1.json, registered); 1 geocode
  (geo/_geoout_w1.json, The Old Fashioned, med). 19 food + 1 sight leads with URLs in `_PENDING_LEADS.md`.
  Density: 3 / ~210. **No page built** (build asserts a geocoded tier-1 in all 7 areas).

- **2026-10-03 W2a** — 26 food + 11 sights added (40 discovered; 25 pinned + on the page). All 4 gates green.
  15 food await a pin (list in AUDIT W2a). Page `cities/madison.html` built.

- **2026-10-03 W2b** — +12 sights +1 food → 53 researched, 41 on the page; 12 UNVERIFIED queued. Card live.
  Per area (discovered): CAP 15/38 · UW 7/30 · EAST 14/32 · WEST 8/30 · MVF 2/25 · DANE 5/25 · TRIP 10/30.
- **2026-10-03 W2c** — +3 food +8 sights → 64 researched (33 food / 31 sights), 49 on the page; 15 UNVERIFIED
  (restaurants). Discovered per area: CAP 16/38 · UW 9/30 · EAST 15/32 · WEST 7+/30 · MVF 3/25 · DANE 6/25 · TRIP 8+/30.
- **2026-10-03 W3a** — +5 food +3 sights, creator pass (State Trunk Tour accepted) → 72 researched (38 food /
  34 sights), 53 on the page; 19 UNVERIFIED (restaurants). Density: CAP 18/38 · UW 10/30 · EAST 16/32 · WEST 7/30 ·
  MVF 4/25 · DANE 7/25 · TRIP 10/30.

- **2026-10-03 W4 (fresh session)** — +62 (72 → 134 researched: 87 food = 65% / 47 sights), 65 pinned.
  Files: FOOD_W4a–e.json, SIGHTS_W4a–b.json, SOURCES_W4.json, geo/_geoout_w4a.json (UNVERIFIED + status),
  geo/_geoout_w4b.json (pins). Kavanaugh's Esquire Club added CLOSED (Jan 2026). Session ended at the WebSearch
  session limit (~125 searches). Density: CAP 30/38 · EAST 28/32 · TRIP 22/30 · DANE 17/25 · WEST 16/30 · UW 14/30 ·
  MVF 9/25.

- **2026-10-03 W5 (same session, after the limit reset)** — +19 (134 → 153 researched: 96 food = 63% / 57 sights),
  74 pinned. Files: FOOD_W5a–b.json, SIGHTS_W5a–b.json, SOURCES_W5.json, geo/_geoout_w5.json (pins),
  geo/_geoout_w5u.json (UNVERIFIED + status). Density: CAP 33/38 · EAST 31/32 · TRIP 25/30 · DANE 18/25 · WEST 17/30 ·
  UW 18/30 · MVF 11/25. W5 items done from the list below: UW Bascom/Ingersoll/Lakeshore; TRIP Wright trail + Al. Ringling
  + Tower Hill; MVF Stone Porch + Imperial Garden; Lake Wingra.

- **2026-10-03 W6 (fresh session, 200/200 searches)** — pin pass first: **+51 pins** (Waze place records /
  usarestaurants listings / Apple `coordinate=`), then +29 places → **182 researched (117 food = 64% / 65 sights),
  140 pinned**. Files: FOOD_W6a–c.json, SIGHTS_W6a–c.json, SOURCES_W6.json (FOX11), geo/_geoout_w6.json (pins + address
  upgrades), _geoout_w6b/c/d.json. Pinned/discovered per area: CAP 26/34 · UW 20/23 · EAST 25/33 · WEST 19/24 ·
  TRIP 22/27 · DANE 13/22 · MVF 15/19. All 4 gates green; validate + test ALL PASS.

- **2026-10-03 W7 (fresh session, ~120 searches)** — +29 places closing every NEED area → **211 researched (135 food = 64% /
  76 sights), ~156 pinned; every area OK in density.py.** Files: FOOD_W7a.json, SIGHTS_W7a.json, SOURCES_W7.json,
  geo/_geoout_w7.json. Closures added flagged: Himal Chuli (Dec 2025), Mariner's Inn (Aug 2025), Paisan's.

## Next (ordered) — W8 (pins + refresh only; density is complete)
1. **Pins:** ~55 UNVERIFIED (`python3 tools/geocode-status.py` → madison-wi). WebSearch is exhausted for the old misses
   (W7 re-try 0/4) → run `tools/geocode-helper.html` in a browser session. New W7 misses with full street addresses
   (Mediterranean Cafe 625 State St, Lucky's 1313 Regent, Fabiola's 1301 Regent, Bavaria Sausage 6317 Nesbitt Rd, Villa Dolce
   1828 Parmenter St, Schumacher Farm Park 5682 WI-19) are the easiest.
2. Re-grade the `med` usarestaurants pins (Jordan's, Swagat, Hop Haus, Brix, Coopers) to exact place pins when a helper runs.
3. Held leads that could graduate with one more outlet / 2026 status: Chaat Cafe, Tapas Rias, Toro y Pampa (2027), Muramoto,
   Kohl Center, Muir Knoll, Tumbled Rock, Popolo (AUDIT W6/W7 "held").

## Next (ordered) — W7 (done)
1. **Pins (42 UNVERIFIED, list = `python3 tools/geocode-status.py` / AUDIT W6):** one place per query,
   `"<Name> <street address> latitude longitude"` + `allowed_domains: [waze.com, usarestaurants.info, foursquare.com]`
   (~70% hit in W6); for misses try an Apple street-level query ("<Name> <street> Madison WI", `maps.apple.com`) —
   it returns `coordinate=` URLs for several neighbours at once. Sights without an article (Trollway, Pheasant Branch,
   Edgewood mounds, Ice Age Complex, Indian Lake, Livsreise) → Waze place query with the park/entrance name.
2. **UW (+7):** Jordan's Big 10 Pub (1330 Regent St; usarestaurants pin 43.0678667,-89.4082639 found — needs a
   verified 2nd outlet + 2026 status) and Lucky's 1313 Brew Pub (Madison Magazine Regent St game-day piece — confirm a
   2nd outlet); Mediterranean Cafe (Isthmus + Badger Herald; needs 2026 status); Union South, Carillon Tower, Muir
   Knoll (need a 2nd source / pin path); Rocky Rococo (founded on Gilman St 1974 — check a surviving State St store).
3. **MVF (+6):** My Sister's Kitchen is Mazomanie (DANE); Tapas Rias, Fuji (Isthmus only); Toro y Pampa (Cap Times +
   IB Madison — re-measure in 2027); Badger Prairie Park, Epic campus, Lake Mendota County Park.
4. **WEST (+6):** Brasserie V (needs 2026 status), Everly (needs editorial), Swad (resolve address), Pikkito
   (Junction Rd), Restaurant Muramoto (Hilldale; Isthmus), Cafe Hollander (Isthmus), Chaat Cafe (Isthmus).
5. **CAP (+4) / DANE (+3) / TRIP (+3):** Coopers Tavern (Best of Madison 2025 restaurant + 2nd), Paisan's (closed
   2022 — check reopening); Skål Public House, Schumacher Farm Park, Mazomanie's My Sister's Kitchen; Popolo
   (Mineral Point), Driftless Depot & Spring Green General Store (status), Tumbled Rock Brewery (Baraboo).

## Next (ordered) — W6 (superseded by W7; W5 list below still applies where not done)
1. **Pins:** ~69 UNVERIFIED (all of geo/_geoout_w2_unverified.json + geo/_geoout_w4a.json) → `tools/geocode-helper.html`.
   WebSearch does NOT surface restaurant coordinates any more (0/10 in W4). For anything with a Wikipedia/Wikidata
   article use `allowed_domains: [en.wikipedia.org, wikidata.org]` + "<name> coordinates" (5/6 hit in W4).
2. **MVF (+16):** sights — Pope Farm Conservancy, Military Ridge State Trail, Badger Prairie Park, Middleton Hills;
   food — Stone Porch Alehouse, Wisconsin Brewing Co. (needs 2nd outlet), Imperial Garden, Swagat, Ken's Meats.
3. **UW (+16):** Bascom Hill/Lincoln, Carillon Tower, Lakeshore Nature Preserve, Ingersoll Physics Museum (Atlas
   Obscura + Wikipedia), Union South, Kohl Center, Muir Knoll (Wikipedia pins); food — Teddywedgers (State Trunk
   Tour + 1), Michelangelo's, State St late-night.
4. **WEST (+14):** Lake Wingra/Vilas Park, Hoyt Park, Owen Conservation, Elver Park; food — Everly, Brasserie V,
   Gates & Brovi, Toot & Kate's, Sa Bai Thong, La Taguara, Delta Beer Lab (area?).
5. **TRIP (+8) / DANE (+8) / CAP (+8) / EAST (+4):** Dells of the Wisconsin River, Wyoming Valley School, Tower Hill
   SP, Al. Ringling Theatre, Mid-Continent Railway (precise pin), Arthur's Supper Club, Commerce Street Brewery
   (ex-Brewery Creek); Skål Public House, J. Henry & Sons, Paoli Schoolhouse, Matz Farmstead ruins, Livsreise;
   Eno Vino, Osteria Novella, Bar Corallini, Heritage Tavern, Robin Room, Coopers Tavern; Banzo, State Line
   Distillery, Mickey's Tavern, Karben4.
6. Held-lead list with what each still needs: AUDIT.md W4 batches 1–4 "Held" lines.

## Next (W3 plan — superseded)
1. **Pins first:** run `tools/geocode-helper.html` (or a fresh session) on the 15 UNVERIFIED restaurants in
   `geo/_geoout_w2_unverified.json` (Toby's, Fairchild, Fromagination, Ahan, Lao Laan-Xang, State Street Brats…).
   WebSearch rarely surfaces restaurant place pins; latlong.net POIs hit ~50% with "<name>" <street> GPS coordinates latitude.
2. Held sights needing only a pin or a 2nd source (AUDIT W2b/W2c): MMoCA, Veterans Museum (check 2026 status),
   APT, Swiss Historical Village, Trollway, Pheasant Branch, Pope Farm, Gates of Heaven, Stoughton Opera House,
   Babcock Dairy Store, New Glarus Brewing (Hilltop).
3. Food discovery for thin areas: MVF (Hubbard Ave Diner, Capital Brewery status, Craftsman curds), DANE (Fosdal
   Bakery Stoughton, Grumpy Troll, Sjölinds), TRIP (New Glarus: Glarner Stube/Puempel's; Mineral Point pasties;
   Spring Green), UW (Rathskeller, Babcock), WEST (Monroe St: Gates & Brovi, Pasture and Plenty), Hmong canon.
4. Creator pass (YouTube/TikTok Madison food creators with verifiable scale) → CREATORS_W3.json.
5. Re-verify the 17 med pins (latlong.net POIs) to exact place pins.

## W1-era plan (superseded — steps 1 & 3 done in W2; kept for history)
1. Finish `_PENDING_LEADS.md` (dish/address/status per lead) → append to FOOD_CANON.json in batches of ~10, commit each.
2. Remaining W1 canon queries (list at the bottom of `_PENDING_LEADS.md`) + creator pass → CREATORS_W1.json.
3. W2 sights per area (SIGHTS_<AREA>.json) — every area needs a geocodable tier-1 (Capitol, UW Memorial Union
   Terrace, Olbrich, Arboretum, Mustard Museum/Pheasant Branch, Cave of the Mounds/Little Norway, Taliesin).
4. Iterate `python3 tools/density.py madison-wi` until every area OK → geocode waves (geo/_geoout_*.json) →
   `flock … python3 tools/rebuild-city.py madison-wi --build` → 4 gates → relink CARD:madison-wi, CITIES.md row.

## In-flight wave
- (none — W7 closed 2026-10-03; resume from 'Next (ordered) — W8')
