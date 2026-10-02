# Miami · Fort Lauderdale · Everglades — RESUME checkpoint (read first)

Map: `cities/miami.html` · dataset `data/miami.dataset.json` · key `miami-fl` · research slug `miami` ·
built by `tools/build-miami.py` (clone of the DC/NYC dataset build; centre + labels DERIVED from pins).
Standing brief: `_AGENT_BRIEF.md`. Ledger: `AUDIT.md` (append-only). Protocol: `docs/RUN-2026-10-02.md`.

## Density targets (iterate until met — benchmark = NYC ~500)
Measured by `python3 tools/density.py miami-fl` on the DISCOVERED set. Total = 500.
- `FTL` Fort Lauderdale, Hollywood & Broward (Las Olas, Riverwalk, Dania, Hollywood Broadwalk, Pompano, Davie) — target ~75
- `NMIA` North Miami, Aventura, Sunny Isles, North Miami Beach, Miami Gardens & Opa-locka — target ~40
- `WYN` Wynwood, Design District, Edgewater, Little Haiti, MiMo & Little River — target ~60
- `DTB` Downtown, Brickell, Overtown & the Bayfront (PortMiami, Watson Island) — target ~55
- `LHAV` Little Havana, Hialeah, Doral, Westchester & Sweetwater (West Dade) — target ~55
- `MBCH` Miami Beach (South Beach, Mid & North Beach), Surfside & Bal Harbour — target ~65
- `CGCG` Coral Gables, Coconut Grove, Key Biscayne & Virginia Key — target ~55
- `SDADE` South Dade — Kendall, Pinecrest, Palmetto Bay, Cutler Bay, Homestead, the Redland & Florida City — target ~55
- `GLADE` Everglades NP, Biscayne NP, Big Cypress & the Tamiami Trail (Shark Valley, Everglades City edge) — target ~40

## Regioning
North→south along the Atlantic: Broward (FTL) → the north-Dade suburbs (NMIA) → Miami's urban core split into
its three distinct visitor districts (WYN arts/Haitian north side, DTB downtown/Brickell, LHAV the Cuban west side
incl. Hialeah/Doral) → the barrier island (MBCH) → the old southern suburbs + the Key (CGCG) → the agricultural
South Dade belt (SDADE) → the two national parks + the Tamiami Trail (GLADE). Assign each place by its actual
municipality/neighbourhood (address).

## In-flight wave
- none (session 3 ended cleanly: discovery wave F5/S6 + geocode w4–w8 finished, built, pushed).

## State
- 2026-10-02 session 3 FINAL — 357 discovered (234 food & drink = 66%) → 104 pinned (92 sights + 12 food); 4 gates + validate + test green.
  Density: CGCG 50/55 · DTB 35/55 · FTL 50/75 · GLADE 34/40 · LHAV 42/55 · MBCH 45/65 · NMIA 24/40 · SDADE 28/55 · WYN 49/60.
  Session-3 files: FOOD_F5.json (151), SIGHTS_S6.json (40), CREATORS_F5.json, SOURCES_S3.json, geo/_geoout_w4–w8.json,
  geo/_geoout_zz_status1.json (status-only rows; MUST sort last), _miami_push.sh (commit+pull+push, auto-resolves the
  generated GEOCODE-BACKLOG conflict). Held single-outlet leads: _PENDING_LEADS.md § Session 3.
- 2026-10-02 session 3 build 2 — 340 discovered (218 food & drink, 64%) → 103 pinned (91 sights + 12 food). Gates green.
  Density: CGCG 50/55 · DTB 31/55 · FTL 44/75 · GLADE 34/40 · LHAV 41/55 · MBCH 45/65 · NMIA 23/40 · SDADE 24/55 · WYN 48/60.
- 2026-10-02 session 3 — 277 discovered (177 food & drink, 64%) → 92 pinned (80 sights + 12 food). Gates + validate + test green.
  Density: CGCG 42/55 · DTB 30/55 · FTL 38/75 · GLADE 19/40 · LHAV 35/55 · MBCH 30/65 · NMIA 20/40 · SDADE 23/55 · WYN 40/60.
  New files: FOOD_F5.json, SIGHTS_S6.json, CREATORS_F5.json, SOURCES_S3.json, geo/_geoout_w4.json, _geoout_w5.json, _geoout_zz_status1.json.
- 2026-10-02 session 2 — **LIVE (growing)**: 166 discovered (all sourcecheck PASS, 31 on a lone authority) →
  71 pinned on `cities/miami.html` (59 sights + 12 food); 4 gates PASS (sourcecheck/geocheck/statuscheck
  CONSISTENT, 0 unchecked on page/buildcheck); `npm run validate` + `npm test` green. Index card live; CITIES.md row.
- Density (discovered): CGCG 28/55 · DTB 17/55 · FTL 17/75 · GLADE 16/40 · LHAV 15/55 · MBCH 17/65 · NMIA 11/40 ·
  SDADE 14/55 · WYN 31/60. Every area NEEDs more.
- Closures flagged: Miami Seaquarium (12 Oct 2025), Fiola Miami (22 Jun 2025 → Daniel's), Lion & the Rambler (NT "Closed").
  Havana Harry's: 2025 state shutdown, reopening unconfirmed — status unknown, recheck.
- Files: FOOD_F1–F4.json, SIGHTS_S1–S5.json, CREATORS_F1.json, geo/_geoout_w1–w3.json, _PENDING_LEADS.md (~40 single-source
  leads), _miami_searchlog.md (every call), helpers _miami_add.py / _miami_srcrationale.py / _miami_golive.py.
- 2026-10-02 session 1: scaffolded (consolidate.py, build-miami.py, brief, SOURCES_SEED.json).

## Next actions (next wave plan)
1. **Restaurant pins (biggest win; WebSearch cannot do it — 4 probes, 0 coords):** 230+ UNVERIFIED food places. Run
   `tools/geocode-helper.html` in a browser for google `!3d!4d` place pins → `geo/_geoout_helper.json` → rebuild. Food on the
   map is only 12 of 234 discovered.
2. **Sight pins still UNVERIFIED:** Las Olas Blvd, FTL Beach, Domino Park, Tower Theater, Cuban Memorial Blvd, Black Police
   Precinct (NRHP 100004974), Rubell, Margulies, Museum of Graffiti, ICA, Loop Road, Clyde Butcher, Skunk Ape, South Beach,
   Sunny Isles/Surfside/Bal Harbour/Hallandale beaches, Newport Pier, Broward Center, Jungle Queen, Bandshell, Fillmore,
   Miccosukee Village, Big Cypress Bend, Calle Ocho Walk of Fame, Coe VC, Mahogany Hammock, Nine Mile Pond, West Lake.
   Try Wikipedia coord phrasing (`"<name>" coordinates 25°`) and hmdb markers; never Clippix/latlong-style pages unless the
   printing page is named. Re-verify the med pier points (Deerfield/Pompano/Dania from diveagainstdebris) and Hollywood Broadwalk.
3. **Promote held leads** (`_PENDING_LEADS.md` § Session 3) with ONE corroborating domain-restricted query each batch —
   the "list every X named in <outlet> <guide>" phrasing on timeout.com / theinfatuation.com / miaminewtimes.com / fodors.com
   returns whole lists (4–10 places per search). eater.com is NOT accessible to the search tool.
4. **Discovery by need** (targets): SDADE +27 (Kendall/Pinecrest: Infatuation ∩ NT Best-of; Cutler Bay/Palmetto Bay sights),
   FTL +25 (Hollywood/Dania/Pompano food; Broward sights: Fort Lauderdale Antique Car Museum, Bonnet House area, Pompano
   pier), DTB +20 (Overtown/Brickell sights: Bayside, Jungle Island, Gesu Church, Ichimura Japan Garden), MBCH +20,
   NMIA +16 (Aventura Perl ∩ 2nd; FIU Biscayne Bay), LHAV +13 (sights: Cubaocho, Tower Theater pin), WYN +11 (sights:
   Little Haiti Cultural Complex, Moore Building, MiMo district), GLADE +6, CGCG +5. ≥1 creator query per wave
   (Josiah Eats / Miami Food Porn registered in CREATORS_F5.json).
5. Closure re-checks: Broken Shaker, Elliott/Adams Key (NPS access), Dorsey House (visitor access), Havana Harry's.

## Acceptance
- [ ] every area ≥ target · [x] sourcecheck PASS · [x] geocheck PASS · [x] statuscheck CONSISTENT, 0 unchecked
- [x] buildcheck PASS · [x] `npm run validate && npm test` green · [x] index card live · [x] CITIES.md row
