# Chicago (`chicago-il`) — RESUME (read first to continue)

## Targets (per area; parsed by tools/density.py — sum ≈ 510, New York density)
- `LOOP` The Loop & Downtown ~110
- `NORTH` North Side ~85
- `NW` Northwest Side ~80
- `WEST` West Side ~50
- `SOUTH` South Side ~60
- `SW` Southwest Side ~25
- `FAR` Far South ~30
- `SUB` Suburbs & North Shore ~50
- `DAY` Day trips ~20

## State
- 2026-10-02 (session 1): scaffold created. W1 BLOCKED by the shared 200-search cap.
- 2026-10-02 (session 2, FINAL): **220 places researched, 191 pinned & rendered (146 sights + 45 food)**; LIVE on the hub
  (`<!-- CARD:chicago-il -->` + CITIES.md row, refreshed by `_chi_counts.sh`). 4 gates + validate + test green.
  Per area (researched food+sights / target, density.py): LOOP 72/110 · NORTH 44/85 · NW 25/80 · WEST 14/50 ·
  SOUTH 22/60 · SW 7/25 · FAR 5/30 · SUB 18/50 · DAY 13/20.
  Files: FOOD_CANON.json (39), FOOD_MICHELIN.json (35), SIGHTS_W1..W9.json (146), CREATORS_W1.json;
  geo/_geoout_canon.json, _geoout_michelin.json, _geoout_sights.json.
  **UNVERIFIED pins held (29)** — restaurants with no Wikipedia article/POI pin: Al's #1, Johnnie's, Pequod's, George's Deep Dish, Milly's, Vito & Nick's, Pat's, Pizz'amici,
  Middle Brow Bungalow, Redhot Ranch (Bucktown), Byron's, Fat Johnnie's, Jim's Original, Borinquen Lounge, Twin Anchors,
  Margie's Candies, Gene & Georgetti, Birrieria Zaragoza, Original Rainbow Cone, Boka, Galit, Boonie's, Cellar Door
  Provisions, Kie-Gol-Lanee, Sochi, Tortello, Mirra, Nadu, Taqueria Chingón (also in docs/GEOCODE-BACKLOG.md) → `tools/geocode-helper.html`.
- Helpers (this dir): `_chi_add.py` (dedup-append), `_chi_sights.py` (append records + Wikipedia pins in one go),
  `_chi_push.sh` (pull/push loop that regenerates conflicting shared files), `_chi_counts.sh` (refresh card/row counts).
- **Geocoding lesson:** Wikipedia batches of 4 names per query return published coords reliably (sights and
  Wikipedia-notable restaurants); per-restaurant latlong searches mostly fail. Street-address strings for Wikipedia-pinned
  sights were taken from the sources/Wikipedia infobox; any not echoed verbatim in a search result should be confirmed in
  the re-verify pass (the pin itself is Wikipedia's published coordinate).
- Search count (session 2): ~218 (main ≈186 + 2 geocode subagents 32). Stopped when yield fell to ~1 place/search
  (the remaining Wikipedia-pinnable landmarks are mostly used up; the next wave must be food + the geocode helper).

- 2026-10-02 (session 3, FOOD & DRINK FIRST, FINAL): **295 researched (149 food = 50.5%), 209 rendered (146 sights + 63 food)**;
  4 gates + validate + test green; card + CITIES.md refreshed. Per area (food+sights / target): LOOP 42+46=88/110 · NORTH 30+24=54/85 ·
  NW 45+10=55/80 · WEST 10+10=20/50 · SOUTH 10+21=31/60 · SW 3+4=7/25 · FAR 5+3=8/30 · SUB 4+15=19/50 · DAY 0+13=13/20.
  New files: FOOD_W12.json (48), FOOD_W13.json (13), FOOD_W14.json (14); geo/_geoout_w12.json, _geoout_w13.json, _geoout_backlog.json;
  lead ledger _chi_w12_leads.md + held list in AUDIT.md. Searches: 200/200 session cap (main ≈75, 3 geocode agents ≈125) — stopped by the cap.
  **86 places UNVERIFIED (not on map yet)** — see docs/GEOCODE-BACKLOG.md `chicago-il`; 20 of them (W12b tail + all of W13 except Ricobene's)
  have NO address/status check yet: MingHin, Maple & Ash, Tzuco, Michael Jordan's, Warlord, Sol de Mexico, Lost Lake, Milk Room, Papa's Cache,
  Smak-Tak, Kasia's, Lost Larson, Loaf Lounge, Hewn, Bang Bang, Brown Sugar, Josephine's, Do-Rite, Old Fashioned Donuts, Chiu Quon
  (+ all of FOOD_W14.json, never geocoded).
- 2026-10-03 (session 4 / wave 3, FINAL): **415 researched (241 food & drink = 58%), 228 rendered (160 sights + 68 food)**; 4 gates +
  validate + test green; card + CITIES.md + AGENT-PROMPTS run-log refreshed. ~190 searches, no sub-agents.
  Per area (food+sights / target, density.py): LOOP 54+46=100/110 · NORTH 45+28=73/85 · NW 55+11=66/80 · WEST 21+12=33/50 · SOUTH 23+26=49/60 ·
  SW 6+10=16/25 · FAR 11+10=21/30 · SUB 19+18=37/50 · DAY 7+13=20/20 **OK**.
  New files: FOOD_W15.json (SUB/SW/FAR/SOUTH food, 30), FOOD_W16.json (WEST/SOUTH, 20), FOOD_W17.json (NORTH/NW/LOOP/DAY, 42),
  SIGHTS_W10.json (27), CREATORS_W2.json; geo/_geoout_w15.json (food rows: address + status, 5 pinned) and geo/_geoout_w15s.json (sights, 14 pinned);
  lead ledger _chi_w15_leads.md; helpers _chi_batch.py (records + geo rows in one go), _chi_geo_add.py, _chi_has.py (dup check — also grep old names!).
  **187 unpinned** (UNVERIFIED in docs/GEOCODE-BACKLOG.md): nearly all restaurants — WebSearch surfaces no Wikipedia/latlong POI/Apple place pin for them;
  aggregator coords (frankiapp/thatch/mapstr) are rejected per precedent.
  **Status still unchecked (11):** Janson's Drive-In (owner died Dec 2024), Piece, Spinning J, Peach's on 47th, Chi Cafe, Nine Bar, FEW Spirits,
  Lindy's & Gertie's (Archer), Chief O'Neill's, Sobelman's, The Plant. **Street number pending:** Simon's Tavern, J.P. Graziano, Garrett (Michigan Ave),
  Bob Chinn's, Jimmy's Woodlawn Tap, Ramova Grill, Gayety's, Gale Street Inn, Temperance, Mader's, Cindy's, LH Rooftop, Sabri Nihari, Piece, Spinning J,
  Chief O'Neill's, Chi Cafe, Nine Bar.

- 2026-10-03 (session 5 / wave 4, FINAL; +4 on resume → 502 researched, SUB now OK): **498 researched (293 food & drink = 59%), 318 rendered (206 sights + 112 food)**; 4 gates +
  validate + test green; card + CITIES.md + AGENT-PROMPTS run-log refreshed. ~167 searches, no sub-agents.
  Per area (food+sights / target): LOOP 54+56=110/110 OK · NORTH 49+36=85/85 OK · SOUTH 31+29=60/60 OK · DAY 20/20 OK · NW 56+23=79/80 ·
  WEST 32+15=47/50 · FAR 16+13=29/30 · SUB 24+24=48/50 · SW 10+10=20/25.
  **Food share watch:** LOOP 49% and SW 50% — next LOOP/SW adds must be food & drink.
  New files: FOOD_W18.json (38), SIGHTS_W11.json (45), geo/_geoout_w18.json (pins + status rows; sorts last so it wins in geo-merge);
  helpers _chi_pin.py (pin existing places, copies registry status), _chi_upd.py (address/status updates), _p.py (compact pin rows),
  _chi_batch.py now takes the geo file as 3rd arg.
  **Pin channel:** Apple Maps place links (`maps.apple.com` allowed_domains, 3 names + street per query) → ~90 new pins this wave.
  Closures: Edzo's (Dec 2024), Parachute (Mar 2024) flagged — CLOSED; Milly's Uptown original closed → record moved to West Town shop.
  Status unchecked: Hema's Kitchen (+ the session-4 list below that still lacks a check: Janson's, Piece, Spinning J, Peach's, FEW, Lindy's,
  Chief O'Neill's, Sobelman's, The Plant). ~150 UNVERIFIED (docs/GEOCODE-BACKLOG.md).

## In-flight wave
(none — session 5 closed cleanly; remaining budget kept as slack.)

## Next actions (ordered)
**Session-6 plan (next wave):**
  (a) Close the last NEED (≈12): SW +5 (food — Taqueria San Julian / Sputnik Coffee / Somos Monos need a 2nd source; Back of the Yards,
      Brighton Park, Archer Heights Polish), WEST +1 (Little Village Arch pin, Douglass Park, Nuevo Leon status),
      NW +1, FAR +1 (Wabash YMCA is SOUTH; FAR: Pullman Market Hall pin,
      Hotel Florence precise pin). LOOP/SW food share ≥ 50%: add LOOP food, not sights.
  (b) Apple Maps pin pass on the ~150 UNVERIFIED (3 names + full street address per query; accept coordinate= links whose address matches):
      start with the names the last pass returned place-id-only for (retry with full street address), then FOOD_W12/W13/W14 (never geo-rowed).
  (c) Status: Hema's Kitchen + the session-4 unchecked list; re-verify Walker Bros Wilmette, Huck Finn (Apple calls it a restaurant), Cocoa Chili
      (removed), Pat's Pizza address conflict (Lincoln Ave vs Diversey).
  (d) Re-verify (4b) the med pins (district/park centroids are med by nature; upgrade Lincoln Park, Millennium Park to a named feature if desired).
**Session-5 plan (next wave):**
  (a) PINS are now the main gap (187 unpinned, 228 rendered of 415): run `tools/geocode-helper.html` on the UNVERIFIED list, or a pin pass that tries
      Wikipedia/Wikidata first, then latlong.net POI / Apple Maps place links (accept only these + Google !3d!4d); grid-check every coordinate.
  (b) Close the 11 unchecked statuses + 18 street numbers above (batch 3 names per query: "<name> <neighbourhood> address hours 2026").
  (c) Discovery for the remaining NEED: WEST +17 (Little Italy — Pompei/Rosebud reopening, Conte di Savoia; Pilsen — HaiSous, La Mejikana, Cerdito Muerto;
      Little Village — La Catedral, Nuevo Leon; Garfield Park/Austin), NW +14 (sights: Logan Square boulevards, Wicker Park district, Northwest Tower;
      food: Map Room, Staropolska, Red Apple Norwood Park, Resi's/Laschet's 2nd source), SUB +13 (Oak Park/Evanston/Berwyn — Hemmingway's, Kinderhook,
      Graue Mill + Elmhurst Art Museum sights), NORTH +12 (Ann Sather reopens Oct 2026 at 3042 N Broadway; Gene's Sausage; Devon — Ghareeb Nawaz/Usmania),
      SOUTH +11 (Qing Xiang Yuan 2nd source; Medici 2nd source; Bronzeville Winery; Oak Woods Cemetery precise coord), LOOP +10 (Portillo's River
      North 2nd source; Xoco; Time Out Market), SW +9 (Nagrant's Apachee Grill/Don Jose 2nd source; Marz, Whiner; Five Holy Martyrs), FAR +9 (Cork & Kerry 2nd source,
      Pullman sights; Hegewisch; Rosangela's → SUB).
  (d) Re-verify (4b) the med pins: Lou Malnati's Lincolnwood, Old Town School, Couch Tomb, Garfield Park Fieldhouse, Pilsen HD, Griffin Place,
      FitzGerald's, Dawes House, Bubbly Creek.
0. **Session-4 plan (next wave):** (a) geocode + status agent for the 20 unchecked + FOOD_W14 (34 places; accepted pin sources:
   latlong.net POI, Wikipedia, Apple Maps place links, Atlas Obscura, OSM/mapcarta, Google !3d!4d — NOT frankiapp-type aggregators);
   (b) food discovery for the thin areas: SUB (Lou Malnati's Lincolnwood, Edzo's, Scatchell's, Bob Chinn's, Al Bawadi, Oak Park/Evanston/
   Berwyn/Forest Park — Hungry Hound suburban lists), SOUTH (Pearl's Place, Chinatown: Dolo/MingHin done → Nine Bar, Qing Xiang Yuan;
   Bridgeport: Phil's Pizza, Kimski, Maria's), WEST (Pilsen/Little Village: 5 Rabanitos, El Milagro, Don Pedro, Nuevo Leon; Carm's, J.P.
   Graziano), SW (Tony's Italian Beef, Marie's/Vito's, Archer Heights Polish), FAR (St. Rest, Lem's done, Calumet Fisheries done; Beverly
   taverns), DAY (Milwaukee custard/Kopp's, Lake Geneva) — corroborate the held list in AUDIT.md first (cheapest wins);
   (c) re-verify (4b) the med pins (Giant, Rainbo, Middle Brow).
1. Pin the 29 UNVERIFIED restaurants with `tools/geocode-helper.html` (browser) → re-run `--build`; that alone lifts
   food on the map from 39 to ~68 and un-hides nothing (SW now has pins).
2. Food density (biggest gap): Infatuation/Time Out neighbourhood guides for NW (Logan Sq/Wicker/Avondale), WEST
   (Pilsen/Little Village taquerias — Carnitas Uruapan, La Chaparrita, El Milagro from Iconic Eats need a 2nd source),
   SOUTH (Chinatown — Chiu Quon, Lao Sze Chuan; Bronzeville soul food — Keith Lee's picks Soul Prime, Cleo's), Devon
   (IN), Argyle (VN — Nhu Lan), Polish (Milwaukee Ave), Swedish (Andersonville). Held single-source list in AUDIT.md.
3. Sights still thin: FAR (Pullman sub-sites, Beverly), SW, SUB (Evanston/North Shore), SOUTH (Bronzeville, Kenwood).
   Use the Wikipedia-4 pattern + one themed 2nd-source query.
4. Re-verify pass (4b) on med/low pins; confirm street addresses flagged in geo notes (e.g. Irazu).

## Commands
```
python3 tools/density.py chicago-il
flock -w 3600 /home/user/cleo-guide/.git/cleo-shared.lock python3 tools/rebuild-city.py chicago-il --build
```

## Acceptance checklist
- [ ] every area OK in density.py
- [x] --sourcecheck / --geocheck / --statuscheck / --buildcheck green
- [x] npm run validate && npm test green
- [x] card live + CITIES.md row + AGENT-PROMPTS run-log rows
