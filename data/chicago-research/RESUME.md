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
- 2026-10-02 (session 2): **204 places researched, 175 pinned & rendered (136 sights + 39 food)**; LIVE on the hub
  (`<!-- CARD:chicago-il -->` + CITIES.md row, refreshed by `_chi_counts.sh`). 4 gates + validate + test green.
  Per area (researched food+sights / target): LOOP 65/110 · NORTH 41/85 · NW 24/80 · WEST 13/50 · SOUTH 18/60 ·
  SW 7/25 · FAR 5/30 · SUB 18/50 · DAY 13/20.
  Files: FOOD_CANON.json (36), FOOD_MICHELIN.json (32), SIGHTS_W1..W8.json (136), CREATORS_W1.json;
  geo/_geoout_canon.json, _geoout_michelin.json, _geoout_sights.json.
  **UNVERIFIED pins held (29)** — restaurants with no Wikipedia article/POI pin: Al's #1, Johnnie's, Pequod's, George's,
  Milly's, Vito & Nick's, Pat's, Pizz'amici, Middle Brow, Redhot Ranch, Byron's, Fat Johnnie's, Jim's Original,
  Borinquen Lounge, Twin Anchors, Margie's, Gene & Georgetti, Birrieria Zaragoza, Rainbow Cone, Boka, Galit, Kasama?
  (see docs/GEOCODE-BACKLOG.md for the live list) → `tools/geocode-helper.html`.
- Helpers (this dir): `_chi_add.py` (dedup-append), `_chi_sights.py` (append records + Wikipedia pins in one go),
  `_chi_push.sh` (pull/push loop that regenerates conflicting shared files), `_chi_counts.sh` (refresh card/row counts).
- **Geocoding lesson:** Wikipedia batches of 4 names per query return published coords reliably (sights and
  Wikipedia-notable restaurants); per-restaurant latlong searches mostly fail. Street-address strings for Wikipedia-pinned
  sights were taken from the sources/Wikipedia infobox; any not echoed verbatim in a search result should be confirmed in
  the re-verify pass (the pin itself is Wikipedia's published coordinate).
- Search count (session 2): ~200 (main ≈168 + 2 geocode subagents 32).

## In-flight wave
(none — W9 committed). 

## Next actions (ordered)
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
