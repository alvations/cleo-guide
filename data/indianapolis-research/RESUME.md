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
- (none — W2 complete 2026-10-03.)
- **Next (W3), in order:**
  1. Pins: the 71 UNVERIFIED restaurants need `tools/geocode-helper.html` (browser) — the Apple-Maps WebSearch technique does
     NOT work for Indianapolis (AUDIT W2 Stage 0). Don't re-spend searches on it.
  2. Food share below 50% in DTN (8/30), MASS (9/19), MID (6/15): DTN — Harry & Izzy's, Nesso, Astrea/Dean's (Axios Devour
     2026 new list), Kilroy's/Bru Burger need IM/Axios pair; Mass Ave — Bazbeaux, Ball & Biscuit (resolve address), Harrison's,
     Bakersfield, Yats; MID — Tarkington-area cafés, Garden Terrace at Newfields (only official so far).
  3. SOUTH (6/20): Burmese/Chin second outlets (Burmese Restaurant 7040 Madison Ave, Kimu status), Napoli Villa (Beech Grove,
     WRTV), Revery (Greenwood, status), Famous Subs (Southport); sights: Southeastway Park, University of Indianapolis.
  4. Resolve held: Daisy Bar address, Wisanggeni Pawon (Irvington vs 71st St), Cheeky Bastards/Open Kitchen/Big Woods 2nd outlet.
  5. Re-verify the 3 low pins (Fort Harrison SP, Broad Ripple Village, Museum of Miniature Houses).

## State
- 2026-10-03 — W2: +47 (40 food & drink, 7 sights) → 150 sourced (81 food = 54%), 72 on page (62 sights + 10 food);
  all gates green; density NEED in every area (BRIP 15/20, DTN 30/38, EAST 11/16, FSQ 15/20, MASS 19/24, MID 15/22,
  NORTH 21/30, SOUTH 6/20, WEST 18/20). Files: FOOD_W2/SIGHTS_W2/SOURCES_W2.json, geo/_geoout_w2.json (`_ind_w2_records.py`).
- 2026-10-03 — W1: 103 sourced, 59 on page (53 sights + 6 food); all gates green; density NEED in every area.
- 2026-10-02 — scaffold committed (consolidate.py, brief, audit, resume, tools/build-indianapolis.py,
  sources.json `indianapolis-in` entry with 17 outlets). 0 records discovered; density 0/210 every area NEED.
