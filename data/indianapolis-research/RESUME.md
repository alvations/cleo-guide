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
- **W1 (food canon + core sights) — BLOCKED at 5 searches** by the shared WebSearch session budget (200/200
  used across all concurrent agents). Leads + source URLs in `_PENDING_LEADS.md`; no records written yet.
  Remaining W1 queries (run in order once search budget is available):
  1. IM Best Restaurants 2025/2026 installments (full names) · IndyStar best restaurants / dining critic picks
  2. tenderloin: Workingman's Friend, Edwards Drive-In, Plump's Last Shot, Turchetti's, Daredevil Hall (2nd source each)
  3. sugar cream pie (Hoosier Mama? / Long's Bakery / Shapiro's) · St. Elmo Steak House (JB America's Classics?) ·
     Shapiro's Delicatessen · persimmon pudding · Hollyhock Hill fried chicken / fried biscuits & apple butter
  4. Burmese/Chin south side (IndyStar/WFYI/Mirror Indy "Chindianapolis") · International Marketplace (Lafayette Rd)
  5. sights: IMS Museum, Children's Museum, Newfields + 100 Acres, Indiana War Memorial, Soldiers' & Sailors'
     Monument, Cultural Trail, Crown Hill, Eiteljorg, Kurt Vonnegut Museum, Conner Prairie (Wikipedia coords each)
  6. creators/viral (§2a): Diners Drive-Ins & Dives Indianapolis, YouTube "Indianapolis food tour", TikTok Indy food

## State
- 2026-10-02 — scaffold committed (consolidate.py, brief, audit, resume, tools/build-indianapolis.py,
  sources.json `indianapolis-in` entry with 17 outlets). 0 records discovered; density 0/210 every area NEED.
