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
- **Wave F1 (food canon, all areas)** — planned, NOT started: 0 places written. Blocked at the first query:
  the WebSearch tool returned "this session has used its web search budget (200 of 200 WebSearch calls)" —
  the per-session cap (CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION) is shared by every concurrent agent in this
  session and was already exhausted when Miami discovery began. One search succeeded (a geocode probe that
  confirmed google.com `!3d!4d` place pins surface for US restaurants, e.g. Versailles 25.7650774,-80.2527872).
- Queries to run first when budget is available: Michelin Florida Miami stars/Bib list · Miami New Times best
  Cuban sandwich / croquetas / ventanita · Eater Miami 38 · Infatuation Miami Cuban · stone crab (Joe's) ·
  Haitian griot Little Haiti · Peruvian ceviche · arepas Doral · key lime pie · frita · Robert Is Here/Redland ·
  Everglades NP things to do (NPS) · Coopertown frog legs · Biscayne NP.

## State
- 2026-10-02 scaffolded: consolidate.py (9 areas, Miami cuisine taxonomy, 13 collections), build-miami.py,
  _AGENT_BRIEF.md, AUDIT.md, SOURCES_SEED.json (outlets + rationale). Discovery not started.

## Next actions
1. Discovery waves per area, food canon first (`FOOD_<tag>.json`, `SIGHTS_<tag>.json`, `CREATORS_<tag>.json`).
2. `python3 tools/density.py miami-fl` → iterate on every `NEED +N`.
3. Geocode waves → `geo/_geoout_<tag>.json` (google.com `!3d!4d` place pins / Wikipedia coords; never `/@`).
4. `flock -w 3600 /home/user/cleo-guide/.git/cleo-shared.lock python3 tools/rebuild-city.py miami-fl --build`
5. Re-verify placement + closure pass; relink `<!-- CARD:miami-fl -->`; CITIES.md row.

## Acceptance
- [ ] every area ≥ target · [ ] sourcecheck PASS · [ ] geocheck PASS · [ ] statuscheck CONSISTENT, 0 unchecked
- [ ] buildcheck PASS · [ ] `npm run validate && npm test` green · [ ] index card live · [ ] CITIES.md row
