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
- **Session 3 wave F5/S6 (in progress):** food-first discovery into `FOOD_F5.json` (+ `SIGHTS_S6.json`), every NEED area,
  FTL first; background geocode subagent → `geo/_geoout_w4.json` (23 unpinned sights + notable restaurants, ≤30 searches).
  Search log continues in `_miami_searchlog.md` (§ Session 3). Restaurant pin probes via WebSearch: 4 tries, 0 coords (dead).

## State
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
1. **Restaurant pins (biggest win, no WebSearch):** 95 UNVERIFIED — mostly restaurants (all Michelin stars/Bibs,
   Versailles, Sanguich, El Mago…). Run `tools/geocode-helper.html` in a browser for place pins (`!3d!4d`), write
   `geo/_geoout_helper.json`, rebuild. Also Little Havana sights (Calle Ocho, Domino Park, Tower Theater) + Robert Is Here.
2. Status check the 18 "unknown" (Brasserie Laurel, Cvi.che 105 downtown, Chez Le Bebe, Chef Creole, Michael's Genuine,
   Mandolin, F3 Michelin adds) and Havana Harry's.
3. Promote `_PENDING_LEADS.md` with one corroborating search each (Hialeah, Doral arepas, Kendall, key lime pie, burgers,
   South Beach Infatuation list, FTL Rustic Inn/Steak 954).
4. Discovery waves by need: FTL (+58), MBCH (+48), LHAV (+40), SDADE (+41), DTB (+38) — food first (Broward New Times
   lists, Hollywood/Dania, Nicaraguan fritanga in Sweetwater, conch, Peruvian in Kendall), ≥1 creator query per wave.
5. Budget: size ~1.5–2 searches/place; restaurant geocoding via WebSearch yields ~0 — use the helper.

## Acceptance
- [ ] every area ≥ target · [x] sourcecheck PASS · [x] geocheck PASS · [x] statuscheck CONSISTENT, 0 unchecked
- [x] buildcheck PASS · [x] `npm run validate && npm test` green · [x] index card live · [x] CITIES.md row
