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
- none (session 4 wave F6/S7 finished: every area at/over target; closing work = restaurant pins via Wikipedia articles).

## State
- 2026-10-03 session 4 (wave F6/S7) — **509 discovered (335 food & drink = 66%) → 136 pinned (119 sights + 17 food)**; every area at or
  over its density target: CGCG 61/55 · DTB 55/55 · FTL 75/75 · GLADE 41/40 · LHAV 55/55 · MBCH 66/65 · NMIA 41/40 · SDADE 55/55 ·
  WYN 60/60. Pins per area: CGCG 21 · DTB 20 · FTL 19 · GLADE 19 · LHAV 7 · MBCH 17 · NMIA 10 · SDADE 13 · WYN 10.
  4 gates + validate + test green (sourcecheck 509 PASS; statuscheck CONSISTENT, 0 unchecked; 1 closed on page).
  Files: FOOD_F6.json (101), SIGHTS_S7.json (51), geo/_geoout_w9.json; ≈160 WebSearch calls (log: _miami_searchlog.md § Session 4).
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

## Next actions (next wave plan — session 5)
1. **Restaurant pins (the gap: 17 of 335 food pinned).** Run `tools/geocode-helper.html` in a browser for google `!3d!4d` place pins →
   `geo/_geoout_helper.json` → rebuild. WebSearch never surfaces restaurant place pins (re-probed this session: 0); only restaurants with
   a Wikipedia article can be pinned that way (done: Versailles, Mai-Kai, Cap's Place, Rustic Inn, L'Atelier Robuchon + earlier ones).
   Every geo row must carry status + statusSource (a row without them blanks the stored statusSource on merge — see AUDIT session 4).
2. **Sight pins still UNVERIFIED** (Wikipedia gave none / centroid only): LHCC, Superblue, Moore Building, Locust Projects, El Espacio 23,
   MiMo district, Overtown Folklife Village, Ichimura garden, Young At Art (moved to Broward Mall), Anne Kolb, Opa-locka museum/flea
   market/Heritage Trail, Aventura Arts Center, Art Deco Welcome Center, Faena Theater, North Shore Open Space Park, Cubaocho,
   Homestead downtown, Long Pine Key, Pinelands, Paurotis Pond, Eco Pond (candidate coords in AUDIT — re-verify on nps.gov), Domino Park
   (Wikipedia value = neighbourhood centroid, rejected), plus the session-3 list (Las Olas, FTL Beach, Rubell, Margulies, ICA, Loop Road…).
3. **Balance:** food share ≥50% overall and in every area EXCEPT GLADE (7 food / 41 — park area; Everglades City/Tamiami Trail food is
   thin and mostly in) and the inverse risk in LHAV/WYN (sights 10 / 15). Next waves: LHAV & WYN sights; GLADE food only if a 2nd outlet
   appears (Farmers' Market Restaurant, La Brisa held).
4. **Promote held leads** (_PENDING_LEADS.md + AUDIT session 4 "Held" lines): Haitian North Dade (Family Bakery, Lakay, Bon Bagay, Horace —
   Infatuation only), Sim Sim, Sichuan Fish, Red Sea Eritrean, Nove Pasta House, Seminole Theatre, Miami Tower, Lummus Park HD, St. John's
   Baptist, El Titan de Bronze, Morningside HD.
5. **Closure re-checks:** Tower Theater (MDC takeover 1 Nov 2026, reopening 10 Dec — re-check after), Miami-Dade County Courthouse
   (public access?), Medium Cool (closing Aug 2026 — confirm relocation), Hot Dog Heaven (for sale).

## Acceptance
- [x] every area ≥ target (2026-10-03) · [x] sourcecheck PASS · [x] geocheck PASS · [x] statuscheck CONSISTENT, 0 unchecked
- [x] buildcheck PASS · [x] `npm run validate && npm test` green · [x] index card live · [x] CITIES.md row
