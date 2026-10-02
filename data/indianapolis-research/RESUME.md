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

## State
- 2026-10-02 — scaffold (consolidate.py, brief, audit, resume, tools/build-indianapolis.py, sources.json entry).

## In-flight wave
- **W1 (food canon + core sights)** — files: `FOOD_CANON.json`, `SIGHTS_CORE.json`, `SOURCES_W1.json`,
  `CREATORS_W1.json`. Queries: tenderloin (IndyStar/Indy Monthly lists), sugar cream pie, St. Elmo/JB,
  Shapiro's, Burmese/Chin south side, International Marketplace, fried biscuits; sights: Speedway, Children's
  Museum, Newfields, War Memorial, Monument Circle, Cultural Trail, Crown Hill, Eiteljorg, Vonnegut, Conner Prairie.
