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
W3 (session_013h32337aVQ9QKB7DKgSPdW, 2026-10-02): food discovery by area — FISH → SPH → UCW → NW → MAIN/NE → CC → NPH → SJ → DAY.
Files: FOOD_W3.json, SIGHTS_W3.json, CREATORS_W3.json, geo/_geoout_w3_*.json. Method: two-outlet neighbourhood lists
(Infatuation/Eater/Philly Mag/Inquirer/Visit Philly) — a place on ≥2 outlets is added; 1-outlet → HELD in AUDIT.
NOTE: density.py previously counted phi_worklist.json as food (297 was inflated); fixed — true W2 count = 180.
Searches used this session: ~52 main calls (many fan out to several internal searches — 'max_uses_exceeded' seen once) + 35 status agent. FOOD_W3 101, SIGHTS_W3 18, CREATORS_W3 (Portnoy→Angelo's).

## State (2026-10-02, after W1+W2)
- Discovered + sourced: **180** (116 sights, 64 food) — sourcecheck PASS 180/180. Page: **122 on map** (107 sights + 15 food).
- Per area (sourced / target): CC 65/125 · SPH 37/85 · FISH 13/55 · UCW 7/40 · NPH 9/30 · NW 12/45 · NE 4/25 ·
  MAIN 9/35 · SJ 8/25 · DAY 16/35. Every area has a pinned tier-1 (build assert).
- Gates: --sourcecheck / --geocheck / --statuscheck / --buildcheck all PASS; npm validate + test PASS. Index card LIVE.
- Pins: sights ~95% (Wikipedia infobox via `allowed_domains:["en.wikipedia.org"]` batches); restaurants only 15/64 —
  **~49 food places are UNVERIFIED** (addresses verified, coords null) → finish with `tools/geocode-helper.html` (browser).
- Closures: Hiroki — CLOSED (last service 2026-08-08), Laurel — CLOSED (Nov 2025). Casa Mexico merged into South Philly
  Barbacoa (EXCLUDE). Roxanne status unknown (city cease-ops order, chef says temporary).
- Search budget: this session used its ~200 WebSearch calls (main ≈ 145 incl. tool-internal follow-ups + geocode agent 28).

## Files
FOOD_MICHELIN.json (34) · FOOD_CANON.json (27) · FOOD_W1B.json (4) · SIGHTS_W1.json (73) · SIGHTS_W2.json (33) ·
CREATORS_W1.json · geo/_geoout_w1_food.json · geo/_geoout_w1_sights.json · geo/_geoout_w2_sights.json ·
helpers: _phi_add.py (append + dedupe), _phi_geo.py (append geoout), _phi_sg.py (sight + Wikipedia pin in one step).

## Next actions (ordered)
0. Leads from the last searches (W2c): Philadelphia Brewing Company (2440 Frankford Ave; Visit Philly only — needs a 2nd outlet),
   Syrenka Luncheonette (Port Richmond Polish; Visit Philly only), Pomona Hall (Camden; Wikipedia 39.93083,-75.09444 — needs a 2nd source),
   Cooper River Park (only the river's coordinate surfaced — not a pin), Lemon Hill (Wikipedia 39.97083,-75.18722 — needs 2nd source).
1. Restaurant pins: run `tools/geocode-helper.html` on the UNVERIFIED list in docs/GEOCODE-BACKLOG.md (philadelphia-pa);
   WebSearch does NOT surface Philly restaurant place pins (0/3 single-name probes; latlong.net only has big POIs).
   Restaurants WITH a Wikipedia article pin fine (Kalaya, Friday Saturday Sunday, South Philly Barbacoa, Vedge, Zahav).
2. Status pass for pinned/unpinned food still 'unknown' (George's, Sarcone's Bakery, Iannelli's, John's Water Ice, Tony Luke's,
   Middle Child, Paesano's, Antonio's, Hardena, Roxanne) — one Inquirer/Philly Mag closings query each wave.
3. Sight pairs (2 searches ≈ 4-5 pinned places: Visit Philly query for the 2nd source, then
   `A; B; C; D; E coordinates` on en.wikipedia.org). Queued: Winterthur / Hagley / Nemours (Wikipedia coords already
   found: 39.80583,-75.60083 / 39.78056,-75.57500 / 39.7766,-75.5580 — need a 2nd source), Race/Cherry Street Piers,
   Old St. Joseph's (Wikipedia 39.946445,-75.147597 — needs 2nd source), Lemon Hill (39.97083,-75.18722), Mount Pleasant,
   Cedar Grove, Ryerss (no Wikipedia pin yet), Wyck (Wikipedia point looked ~2 km off — re-verify), Germantown White House,
   Mann Center, Smith Playground, Boathouse Row, Wissahickon, Rocky Statue, Mummers Museum, Washington Ave Pier,
   Barnes Arboretum, Glencairn, Camden Children's Garden, Wiggins Park — all sourced, need pins.
   New areas to grow: NE (Little Brazil/Castor Ave food, Frankford), MAIN (Ardmore/Narberth food), SJ (Collingswood BYOBs,
   Haddonfield), DAY (Kennett Square mushrooms, New Hope, Phoenixville), FISH/Kensington bars + breweries, UCW Baltimore Ave
   (Ethiopian/West African), NPH (Puerto Rican Fairhill), Chinatown (Nan Zhou, Dim Sum Garden held 1-src).
4. HELD single-source leads (AUDIT.md W1): Jean-Georges, Scampi, Griddle & Rice, Amá, Emilia, June BYOB, White Yak, Frida Cantina,
   D'Jakarta Cafe, Corropolese, Liberty Kitchen, Sonny's, Steve's, Nan Zhou, Dim Sum Garden, A&A Soft Pretzels, Down Home Diner,
   Sulimay's, Stockyard, Elwood, Emmett, Aether, Bastia, Amy's Pastelillos, Mawn, Kissho, Ayat — each needs one more credible source.
5. Every ~50 places: `flock … python3 tools/rebuild-city.py philadelphia-pa --build` → gates → npm validate/test → refresh card counts.

## Acceptance checklist
- [ ] every area OK in density.py
- [x] --sourcecheck / --geocheck / --statuscheck / --buildcheck green (2026-10-02)
- [x] npm run validate && npm test green (2026-10-02)
- [x] index card live with counts; CITIES.md row; AGENT-PROMPTS run-log rows (2026-10-02)
