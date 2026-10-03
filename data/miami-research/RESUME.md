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
- none (session 5 wave 4 PINS finished 2026-10-03: 136 → 261 pinned; next = keep pinning the ~240 UNVERIFIED, see Next actions).

## State
- 2026-10-03 session 5 (wave 4 PINS) — **509 discovered (66% food & drink) → 261 pinned (124 sights + 137 food)**, 213 high · 46 med · 2 low.
  Pins per area (pinned/discovered): CGCG 37/61 · DTB 32/55 · FTL 31/75 · GLADE 19/41 · LHAV 30/55 · MBCH 36/66 · NMIA 19/41 · SDADE 22/55 · WYN 35/60.
  **New channel:** WebSearch `allowed_domains:["maps.apple.com"]`, 3 "Name + street/neighbourhood" items per query → Apple place URLs with
  `coordinate=<lat>,<lng>` (or `ll=` on `q=&auid=` listings) = Apple's own place pin; ~1.7 pins/search early, ~0.7 on the long tail. Bare
  `place-id=` results carry no coordinate — a *re-phrased* retry (add cuisine/descriptor, e.g. "Yambo Nicaraguan restaurant SW 1st St") often
  surfaces the coordinate variant (Yambo, Tropical Chinese, Frankie's, Broken Shaker, Katherine came through on retry). Helper:
  `_miami_pin.py` (name ∈ dataset, not already pinned, bbox) → `geo/_geoout_x1–x4.json`. Closures this session: `_geoout_x1s/_x2s.json`.
  4 gates + validate + test green. ≈150 WebSearch calls.
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

## Next actions (next wave plan — session 6)
1. **Keep pinning (≈240 UNVERIFIED, ~210 restaurants).** Same Apple Maps method; first retry the tier-1 bare-place-id ones with re-phrased
   queries: Zak the Baker, El Turco, Chez Le Bebe, Fireman Derek's, La Carreta (3632 SW 8th St), El Brazo Fuerte, Ricky Bakery, Cvi.che 105,
   Mama Tried, The Corner, Soya e Pomodoro, Mangrove, Catch & Cut, Heritage, Funky Buddha (Oakland Park, open per Nov 2025 listing),
   Anthony's Runway 84, Tropical Acres (open — 2012 rebuild), Lester's, Georgia Pig, The Floridian, Casa Sensei, Coconuts, S3, Evelyn's,
   Chef's Counter at MAASS, Jack's Old Fashioned, Billy's Stone Crab, Coopertown, Joanie's, City Seafood, Camellia Street Grill, Triad,
   Shiver's, Apocalypse BBQ (8705 SW 124th Ave per Apple), Fox's Lounge, Redland Market Village, Surf Club Restaurant, Lido, Cafe Prima Pasta,
   Katana, Orilla, La Sandwicherie, Papi Steak, Josh's Deli (9517 Harding Ave), Panya Thai, Steve's Pizza (12101 Biscayne Blvd), Perl,
   Captain Jim's, Farofa, Basilic, Chéen-Huaye, Jarana, Chayhana Oasis, Etzel Itzik, Zaika, Ghee… Sights: Apple gives place-ids only →
   Wikipedia/NPS or the browser `tools/geocode-helper.html`.
2. **Address mismatches to re-verify before pinning:** Midorie (Apple: 851 NE 79th St, Upper East Side vs our "Coconut Grove"), Rosetta Bakery
   (Apple: 1666 Collins Ave vs our 929 Collins), Piman Bouk restaurant (5921 NE 2nd Ave; Apple only pinned the bakery at 46 NE 62nd St),
   Versailles Bakery (3501 SW 8th St), Drinking Pig BBQ (our "Downtown" vs Apple 3444 Main Hwy Coconut Grove / 845 NE 151st St), Knaus Berry
   Farm (new farm 16790 SW 177th Ave — pin it), Laspada's (med; Commercial Blvd vs Seagrape Dr corner).
3. **Status re-checks (Apple closure marker / no listing; press not found yet):** Kush (Wynwood), Taquiza (1351 Collins), Lutong Pinoy (17048 W
   Dixie Hwy), Sapore di Mare (3111 Grand Ave), Havana Café of the Everglades ("temporarily closed"), Two Chefs, Golden Rule Seafood, Chefs on
   the Run, Papi Steak (Sep 2025 makeover — confirm reopened); plus session-4 items: Tower Theater (MDC reopening 10 Dec 2026), Medium Cool,
   Hot Dog Heaven.
4. **Balance:** discovery is done (every area at target); food share per area ≥50% except GLADE. Lowest pinned ratios: FTL 31/75, SDADE 22/55,
   NMIA 19/41 — prioritise those in the next pin wave.
5. **Promote held leads** (_PENDING_LEADS.md + AUDIT "Held" lines) only after the pin backlog shrinks.

## Acceptance
- [x] every area ≥ target (2026-10-03) · [x] sourcecheck PASS · [x] geocheck PASS · [x] statuscheck CONSISTENT, 0 unchecked
- [x] buildcheck PASS · [x] `npm run validate && npm test` green · [x] index card live · [x] CITIES.md row
