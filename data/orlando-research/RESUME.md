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

## State (session 6 / wave 5 PINS, 2026-10-03)
- **LIVE**: `cities/orlando.html` — **192 sights + 136 food = 328 on the map** (was 226); **all 4 gates PASS**; npm validate + test green;
  card, CITIES row, AGENT-PROMPTS run log refreshed.
- **483 researched (270 food + 213 sights) — food share 55.9%**. 155 still unpinned (mostly in-park counter-service + 2024-26 openings).
- Pins per area (pinned/discovered): CWALK 2/10 · DAK 12/21 · DHS 12/20 · DSP 8/25 · DTO 30/40 · EAST 7/10 · EPCOT 29/35 · EPIC 11/20 ·
  IDR 31/37 · IOA 9/19 · KISS 23/31 · MILLS 39/55 · MK 23/33 · SPACE 18/23 · SPRNG 24/28 · USF 9/20 · WEST 12/15 · WPK 29/41.
- Density: 9/18 OK. NEED: DTO +10 · IDR +8 · MILLS +5 (sights) · KISS +4 · WPK +4 · SPACE +2 · SPRNG +2 · DAK +1 · IOA +1.
- **Pin channel that works for Orlando:** WebSearch `allowed_domains:["restaurantguru.com"]`, query `<Name> <street/neighbourhood> <City>
  coordinates`, ONE place per search → the summary quotes the RG page's lat/lng + street address (~70% hit for venues >=2 yrs old;
  2024-26 openings mostly absent). Accept only when the street address matches → **med**. Apple Maps (`maps.apple.com`) returned the
  `coordinate=` variant only 1/8 here (Orlando listings are bare `place-id=`). Wanderlog/Foursquare add little. Food-hall vendors:
  pin at the host building via a vendor's listing (med, noted). In-park restaurants: NO channel works (no own coordinate anywhere).
- Session 6 files: FOOD_W5A.json, SIGHTS_W5A.json, SOURCES_W5A.json, geo/_geoout_w5pin.json (102 pins), helper `_orl_pin.py`
  (env `ORL_PIN_OUT`, optional corrected address). Search budget: ≈200 used (≈150 pinning, ≈40 discovery/corroboration, ≈10 status).

## In-flight wave
- (none — wave 4 closed cleanly)

## Next actions (ordered) — wave 6 plan
1. **Pins (155 left):** restaurantguru channel for the remaining street-address places that failed once — retry with RG-only domain and
   the RG title phrasing ("<Name>, <City> - Restaurant menu"): Pho 88, Zymarium, Will's Pub, The Monroe, Sushi Saint, City Food Hall,
   Hideaway, Courtesy, AVA, Francesco's, Nile, Taverna Opa, Kabooki (E Colonial), Shin Jung, Ivanhoe Park Brewing, Moon Wok, Bar Kada,
   The Chapman, Persimmon Hollow, Wondermade, Carib Brewery, Q's Crackin' Crab, Osteria Ester, June, Sparrow, Reyes, Kappo Tsan.
   In-park restaurants (≈60, MK/EPCOT/DHS/DAK/DSP/USF/IOA/EPIC/CWALK) → `tools/geocode-helper.html` only.
2. **Re-checks:** El Cilantrillo (Kissimmee, RG "may be permanently closed"); The Strand (807 N Mills — Apple shows Side Chik at 811);
   Taste of Chengdu (RG = 2030 W Colonial vs record 856 New Broad St); Vines Grille (7585 vs 7533 W Sand Lake); Swine & Sons location;
   Tennessee Truffle/Canvas/Nikki's/La Cava/Smiling Bison undated status; Jurassic Park River Adventure (reopens 2026-11-20).
3. **NEED areas:** DTO +10 (Wall St Plaza/Church St bars, Parramore, Burton's, Anthony's — need a 2nd credible source each; Tinker Building
   needs a 2nd source), IDR +8 (Primo by Melissa Kelly — Michelin, no RG listing; Restaurant Row), MILLS +5 SIGHTS (Loch Haven Park,
   Orlando Repertory Theatre, Orlando Fire Museum — find own coords), KISS +4 (Tropico Mofongo needs a non-OW 2nd source; Gastro
   Obscura trail stops Daddy Ninja, Pa'Paraguana, La Mexicana, Mi Llano Grill), WPK +4 (Chuan Fu — Michelin), SPACE +2, SPRNG +2
   (Stetson University Campus HD), DAK +1, IOA +1 (Pteranodon Flyers — Wikipedia gave only the park coord).
4. **Creator channel**: still no vetted Orlando creator — try named creators directly.
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
- [ ] every area at target (density.py OK)  - [x] --sourcecheck/--geocheck/--statuscheck/--buildcheck green
- [x] npm run validate + npm test green       - [x] index card live with real counts; CITIES.md row
