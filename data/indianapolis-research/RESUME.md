# Indianapolis — RESUME checkpoint (read first)

Resume order: **this file → AUDIT.md → _AGENT_BRIEF.md**. Rebuild: `python3 tools/rebuild-city.py indianapolis-in`
(prep) then `flock -w 3600 .git/cleo-shared.lock python3 tools/rebuild-city.py indianapolis-in --build`.
Density: `python3 tools/density.py indianapolis-in`.

## Per-area density targets (Pittsburgh peer ~212; parsed by tools/density.py)
- `DTN` Downtown & Wholesale District — ~38
- `MASS` Mass Ave, Lockerbie & Old Northside — ~24
- `FSQ` Fountain Square & Fletcher Place — ~20
- `MID` Midtown (Newfields, Children's Museum, Crown Hill, Butler) — ~22
- `BRIP` Broad Ripple, Meridian-Kessler & SoBro — ~20
- `WEST` Speedway & the westside (International Marketplace) — ~20
- `EAST` Irvington & the east side — ~16
- `NORTH` North suburbs (Carmel, Fishers, Zionsville, Noblesville) — ~30
- `SOUTH` South side (Greenwood, Beech Grove, Southport) — ~20

Total target ≈ 210.

## Acceptance
- [ ] Every area `OK` in `tools/density.py indianapolis-in` (or source exhaustion documented per area).
- [ ] `--sourcecheck` PASS · `--geocheck` PASS · `--statuscheck` CONSISTENT · `--buildcheck` PASS.
- [ ] `npm run validate && npm test` green.
- [ ] index.html card relinked live with counts; docs/CITIES.md row; AGENT-PROMPTS run-log rows.

## In-flight wave
- (none — W3 complete 2026-10-03.)
- **Next (W4), in order:**
  1. Pins — 76 places still UNVERIFIED (incl. Chin Brothers, Turchetti's, Milktooth (540 vs 534 Virginia Ave), Commission Row,
     Chatterbox, Magdalena, Borage, Tlaolli, Corridor, Inferno Room, Oaken Barrel, Good Omen, Okonori, Serliana, Astrea,
     Bocca, Foundry Provisions (236 E 16th St), Tavern on South, Sushi Den, Tiburon, Nyla's, Tipsy Mermaid, Kimu, Ten Cuts).
     Technique that works here: `"latitude longitude of <name> <addr>, <name> <addr>, <name> <addr>"` with
     `allowed_domains:["waze.com","usarestaurants.info","foursquare.com"]` (~2 pins/query). Name-only queries fail — always
     include the street address. Apple Maps does NOT work for Indianapolis. Then `tools/geocode-helper.html` for the remainder.
  2. FSQ +1 (19/20): a Wikipedia-pinned sight (only district centroids found this wave — not used) or one more sourced spot
     (held leads: Rook 501 Virginia Ave status, Upland FSQ, West Fork Social House 1233 Shelby).
  3. Re-verify the 3 low pins (Fort Harrison SP, Broad Ripple Village, Museum of Miniature Houses) and the med building pins.
  4. Held leads needing a 2nd outlet / status: Meridian Restaurant & Bar (IM only), SmockTown Brewery (Daily Journal only),
     Mom's Family Restaurant (IM only), Hinata (IBJ only), Kilroy's (temp. closure), Rick's Cafe Boatyard (fire status),
     Mo's A Place for Steaks Greenwood (opening), Tavern at the Point, Daisy Bar, Wisanggeni Pawon.

## State
- 2026-10-03 — W3: +65 (60 food & drink, 5 sights) → 215 sourced (141 food = 66%; ≥50% in every area), 139 on page
  (65 sights + 74 food; +67 Waze/usarestaurants.info/Wikipedia pins). Density OK in 8/9 areas: BRIP 20, DTN 44, EAST 16, MASS 24,
  MID 22, NORTH 30, SOUTH 20, WEST 20; FSQ 19/20. All 4 gates PASS; validate + test green. Files: FOOD_W3/SIGHTS_W3/SOURCES_W3.json,
  geo/_geoout_w3.json + geo/_geoout_w3pins.json (`_ind_w3_records.py`, `_ind_pins_w3.py`).
- 2026-10-03 — W2: +47 (40 food & drink, 7 sights) → 150 sourced (81 food = 54%), 72 on page (62 sights + 10 food);
  all gates green; density NEED in every area (BRIP 15/20, DTN 30/38, EAST 11/16, FSQ 15/20, MASS 19/24, MID 15/22,
  NORTH 21/30, SOUTH 6/20, WEST 18/20). Files: FOOD_W2/SIGHTS_W2/SOURCES_W2.json, geo/_geoout_w2.json (`_ind_w2_records.py`).
- 2026-10-03 — W1: 103 sourced, 59 on page (53 sights + 6 food); all gates green; density NEED in every area.
- 2026-10-02 — scaffold committed (consolidate.py, brief, audit, resume, tools/build-indianapolis.py,
  sources.json `indianapolis-in` entry with 17 outlets). 0 records discovered; density 0/210 every area NEED.
