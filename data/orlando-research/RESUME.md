# Orlando & Central Florida — RESUME (checkpoint; read this first to continue)

Key `orlando-fl` · research dir `data/orlando-research/` · dataset `data/orlando.dataset.json` ·
page `cities/orlando.html` · build `tools/build-orlando.py` · brief `_AGENT_BRIEF.md` · ledger `AUDIT.md`.
Run protocol: `docs/RUN-2026-10-02.md` (shared lock, commit+push every batch, §2a source mix, §5b resumability).

## Density targets (parsed by `python3 tools/density.py orlando-fl`) — total ~517 (NYC density)
- `DTO` Downtown Orlando & Thornton Park ~50
- `MILLS` Mills 50 / Milk District / Audubon Park / SoDo ~60
- `WPK` Winter Park / Baldwin Park / Maitland ~45
- `IDR` International Drive / Dr Phillips / Restaurant Row ~45
- `MK` Magic Kingdom ~30
- `EPCOT` EPCOT ~35
- `DHS` Hollywood Studios ~20
- `DAK` Animal Kingdom ~22
- `DSP` Disney Springs & resorts ~25
- `USF` Universal Studios Florida ~20
- `IOA` Islands of Adventure ~20
- `EPIC` Epic Universe ~20
- `CWALK` CityWalk & Universal resorts ~10
- `KISS` Kissimmee / Celebration / Lake Nona ~35
- `WEST` Winter Garden / Windermere ~15
- `SPRNG` Sanford / Lake Mary / Mount Dora / springs ~30
- `EAST` East Orlando / UCF / Oviedo ~10
- `SPACE` Space Coast ~25

## State (session 7 / wave 6, 2026-10-03)
- **LIVE**: `cities/orlando.html` — **207 sights + 166 food = 373 on the map** (was 328); **all 4 gates PASS**; npm validate + test green;
  card, CITIES row, AGENT-PROMPTS run log refreshed.
- **522 researched (294 food + 228 sights) — food share 56.3%.** **Density 18/18 OK** (every area at target). 149 still unpinned.
- Pins per area (pinned/discovered): CWALK 2/10 · DAK 12/24 · DHS 12/20 · DSP 8/25 · DTO 40/50 · EAST 8/10 · EPCOT 29/35 · EPIC 11/20 ·
  IDR 40/45 · IOA 9/20 · KISS 29/35 · MILLS 47/60 · MK 23/33 · SPACE 20/25 · SPRNG 26/30 · USF 9/20 · WEST 13/15 · WPK 35/45.
- **Pin channels for Orlando (ranked):** (1) Waze live-map — `"<Name> <street address> latitude longitude"` with
  `allowed_domains:["waze.com","usarestaurants.info","foursquare.com"]`, ONE place per query → Waze `place.w.*`/`ChIJ…` record with the
  coordinate (~60% this wave; high when name+address match). (2) restaurantguru `"<Name> <street> <City> coordinates"` (med). Apple Maps
  (`maps.apple.com`) = bare `place-id=` for Orlando (0/3 W6, 1/8 W5) — skip it. Waze's bare STREET records ("North Mills Avenue") are not
  place pins. In-park restaurants: still no channel.
- **Closure lesson (W6):** 5 of ~40 new leads from evergreen OW/Scott Joseph lists were already closed (Slate, Hammered Lamb, DoveCote, Soco,
  Skeletons museum) — always status-check a lead (RG "permanently closed" flag / "<name> closed") BEFORE writing it.
- Session 7 files: FOOD_W6A/SIGHTS_W6A/SOURCES_W6A (`_w6a_add.py`), geo/_geoout_w6pin.json (41 pins, helper `_w6pin.py`: wz/rg/ls),
  `_w6_status.py` (status evidence overrides).

- **2026-10-03 P1 PINS ONLY (session_014tccsddAZhWkWHE1pGLan6, ~58 searches):** +14 pins → **387 on page**, 135 unpinned. AUDIT P1.
  Next: status-check Carib Brewery (→ "321 Lime House"?) and Persimmon Hollow DeLand before pinning; Kōri address 741 vs 721;
  Disney Springs remaining (Homecomin' 1602, Polite Pig 1536, Jaleo, Summer House, Gideon's, Enzo's, Dockside, Erin McKenna's)
  and CityWalk venues via Waze `<Name> <complex> <street #> latitude longitude`; in-park → helper.

## In-flight wave
- (none — wave 6 closed cleanly)

## Next actions (ordered) — wave 7 plan
1. **Pins (149 left; ~90 street-address):** Waze channel first for: Will's Pub, Zymarium, Sushi Saint, City Food Hall, AVA, Bar Kada,
   The Chapman, Taste of Chengdu (resolve 2030 W Colonial vs 856 New Broad St first), ÔMO by Jônt, Persimmon Hollow, Wondermade, Carib
   Brewery, Kōri (741 vs 721 N Mills), The Strand, Umi-style RG retries; sights: Ripley's, Bay Hill (Waze place exists, coord not quoted),
   Orlando Fire Museum, Audubon Center for Birds of Prey, The Space Bar (Courtyard Titusville Waze record), Ivanhoe Village, Audubon Park
   Garden District, Lake Cherokee HD (Wikipedia coord is a copy of Lake Eola Heights' — needs a real point). In-park (~60) → helper only.
2. **Re-checks:** Shin Jung (closed vs renamed 'Shinjung Korean BBQ'); Vines Grille → rename to **Vines by H** (H Hospitality, June 2025);
   El Cilantrillo; The Strand (807 vs Side Chik 811 N Mills); Swine & Sons; Jurassic Park River Adventure (reopens 2026-11-20).
3. **Food share per area** (theme-park areas are sight-heavy): SPACE 13/25 ok; IOA 9/20, EPIC 9/20, USF 9/20, MK 14/33, EPCOT 16/35 below 50%
   → next discovery adds park eats (DFB/TouringPlans) there, not rides.
4. **Creator channel**: still no vetted Orlando creator — try named creators directly (≥1 creator query per wave).
5. Each wave: `flock … python3 tools/rebuild-city.py orlando-fl --build` → 4 gates → npm validate/test → `_orl_golive.py` → `_orl_push.sh`.

## Commands
```bash
python3 tools/density.py orlando-fl
flock -w 3600 /home/user/cleo-guide/.git/cleo-shared.lock python3 tools/rebuild-city.py orlando-fl --build
```

## Files
- `FOOD_<tag>.json` (list) · `SIGHTS_<tag>.json` ({sights,sources}) · `SOURCES_<tag>.json` ({outlets}) ·
  `CREATORS_<tag>.json` · `geo/_geoout_<tag>.json`.

## Acceptance checklist
- [x] every area at target (density.py OK)  - [x] --sourcecheck/--geocheck/--statuscheck/--buildcheck green
- [x] npm run validate + npm test green       - [x] index card live with real counts; CITIES.md row
