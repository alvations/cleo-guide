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
- none (session 6 W6 PINS finished 2026-10-03, session_01847XyVQRMAQiVAHDWpaEmS: 261 → 325 pinned; next = keep pinning the ~184 UNVERIFIED, see Next actions).

## State
- 2026-10-03 session 6 (W6 PINS) — **509 discovered → 325 pinned (124 sights + 201 food)**, 214 high · 109 med · 2 low.
  Pins per area (pinned/discovered): CGCG 43/61 · DTB 36/55 · FTL 46/75 · GLADE 25/41 · LHAV 34/55 · MBCH 40/66 · NMIA 29/41 · SDADE 33/55 · WYN 39/60.
  **Channel (replaces the Apple long tail, ≈75% hit rate):** one place per WebSearch, `"<Name> <street address> <city> GPS coordinates"` with
  `allowed_domains: ["restaurantguru.com","wanderlog.com","sirved.com","restaurantji.com","menupix.com"]` → the listing's lat/lng; check against
  the street address/cross-street, grade `med` (Waze `place.*` matching name+address → `high`). For neighbourhood-only records, the listing's
  street address is written into the geo row (6th field). Writer: `python3 data/miami-research/_pinw.py miami-fl <tag> < lines`.
  Files: geo/_geoout_w6a.json (29) · _w6b (25) · _w6c (10).
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

## Next actions (next wave plan — session 7)
1. **Keep pinning the ~184 UNVERIFIED with the aggregator channel** (it was not exhausted; budget ran out). Untried names, by area:
   FTL (Boatyard, Calypso, Egg N' You, Epazote, GG's, Gulf Stream Brewing, Imperial Moto, Jack's Hollywood Diner, Krakatoa, LauderAle, Nour Thai,
   Old Heidelberg, Peter Pan Diner, Shooters, Tarpon River, Temple Street Eatery, Catch & Cut, Chef's Counter at MAASS), SDADE (Cafe Oriental,
   Pla-Tu, Two Chefs, Yardie Spice, White Lion, La Cruzada, Broadway Subs, Lan, Macita's, Golden Rule, Chefs on the Run, Best Sub, Shibui, Platea),
   LHAV (Bistro Ocho, Franky's Deli, La Fresa Francesa, El Atlacatl, El Cuban Diner, El Rinconcito, La Nueva Fe, Shima, Taquerias El Mexicano,
   Don Maguey, Versailles Bakery), DTB (Better Days, Brasserie Laurel, Claudie, Kaona Room, Kaori, Latin Cafe 2000, Mangrove, Miami Slice,
   Mike's at Venetia, Panamericano), MBCH (Aviv, Sushi Erika, Bebito's, Suite Habana, Crema, Josh's Deli, Las Vacas Gordas, The Joyce),
   CGCG (Carbone Vino, Barracuda, Bouchon, Cafe Demetrio, Elyu, Frenchie's, KoKo, Pauloluigi, Original Daily Bread, Threefold, GROU),
   WYN (ZeyZey, El Bagel, Magdalena), NMIA (Jarana).
2. **Retry the misses with Waze phrasing** (`allowed_domains` waze/usarestaurants/foursquare, "latitude longitude"): El Brazo Fuerte, Le Bouchon
   du Grove, Biscayne Bay Brewing, Ukiah, Julia & Henry's, Topkapi, Panya Thai (520 NE 167th St), Camellia Street Grill (202 Camellia St W),
   Las Arepas de Maria (Doral Yard).
3. **Address / status leads:** Havana Café (pinned, status UNKNOWN — confirm reopening), Taquiza (1351 Collins reported replaced by Coyote
   Taqueria — verify closure; North Beach shop?), Fireman Derek's (Wynwood shop open? aggregator pin was Coconut Grove 3435 Main Hwy),
   The Floridian (1410 vs 1492 E Las Olas), plus session-5 items: Cotoa, Midorie, Rosetta Bakery, Piman Bouk, Drinking Pig BBQ, Laspada's;
   Kush, Sapore di Mare, Two Chefs, Golden Rule, Chefs on the Run, Tower Theater, Medium Cool, Hot Dog Heaven.
4. **Sights (GLADE/FTL trails, parks):** Wikipedia/NPS coordinates — Ernest F. Coe VC, Mahogany Hammock, Pa-hay-okee/West Lake/Pinelands/
   Nine Mile Pond/Paurotis Pond/Eco Pond/Long Pine Key, Big Cypress Bend, Loop Road, Clyde Butcher Gallery, Miccosukee Village, Gator Park,
   Everglades Safari Park, Anne Kolb, Broward Center, Jungle Queen, Young At Art, Domino Park, MiMo district, Black Police Precinct, Ichimura Garden.

## Acceptance
- [x] every area ≥ target (2026-10-03) · [x] sourcecheck PASS · [x] geocheck PASS · [x] statuscheck CONSISTENT, 0 unchecked
- [x] buildcheck PASS · [x] `npm run validate && npm test` green · [x] index card live · [x] CITIES.md row
