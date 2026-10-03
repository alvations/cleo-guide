# Harrisburg · York · Lancaster & Amish Country — RESUME checkpoint (read first)

Resume order: **docs/RUN-2026-10-02.md → this file → AUDIT.md tail → _AGENT_BRIEF.md →
`git log --oneline -20 -- data/harrisburg-research`**. Then:
```bash
python3 tools/density.py harrisburg-pa                       # discovered per area vs targets below
flock -w 3600 /home/user/cleo-guide/.git/cleo-shared.lock python3 tools/rebuild-city.py harrisburg-pa --build
```

## Density targets (Pittsburgh-peer ~210 for a metro; parsed by tools/density.py)
- `HBG` Harrisburg & the West Shore — ~38
- `HER` Hershey & Derry Township — ~24
- `CAR` Carlisle & the Cumberland Valley — ~20
- `YORK` York & York County — ~34
- `LAN` Lancaster city — ~38
- `AMISH` Lancaster County Amish country — ~40
- `GBG` Gettysburg & Adams County — ~22
Total ~216.

## Acceptance
- [x] Every area OK in density.py (W8); every food card names a dish; ≥2 credible per place.
- [ ] Every place status-checked (closures kept-flagged).
- [ ] `--sourcecheck` PASS · `--geocheck` PASS · `--statuscheck` CONSISTENT · `--buildcheck` PASS · npm validate/test.
- [ ] index.html card relinked live with counts; docs/CITIES.md row.

## State
- 2026-10-02 scaffold (consolidate.py, build-harrisburg.py, brief, 29-outlet palette). W1 blocked by budget.
- **2026-10-03 (one session, ~185 searches): W1–W6 done, LIVE.** 120 discovered (38 food + 82 sights, all ≥2
  credible); 55 pinned and rendered on `cities/harrisburg.html`; all 4 gates green; npm validate/test pass;
  index.html card LIVE; docs/CITIES.md row added; 54 new outlets registered with rationale (SOURCES_W1.json).
- Density (discovered / target): AMISH 30/40 · CAR 10/20 · GBG 17/22 · HBG 16/38 · HER 16/24 · LAN 15/38 · YORK 16/34.
- Pinned on page: 55 of 120 — 65 UNVERIFIED (mostly restaurants; WebSearch rarely surfaces restaurant place-pins).
- **2026-10-03 W7 (session_01MjBZJmVPTEPASWdxECDdFx, ~140 searches): FOOD & DRINK FIRST.** +51 food & drink (FOOD_W7.json);
  171 discovered (89 food = 52% + 82 sights), food ≥50% in every area; 98 pinned on page (+41 this wave via restaurantguru
  place pins, med), 73 UNVERIFIED; all 4 gates green; validate/test pass; hub card + CITIES.md refreshed.
- Density (discovered / target): AMISH 37/40 · CAR 15/20 · GBG 24/22 OK · HBG 26/38 · HER 24/24 OK · LAN 22/38 · YORK 23/34.
- Rendered (pinned) per area: AMISH 17 · CAR 7 · GBG 14 · HBG 21 · HER 16 · LAN 8 · YORK 15.

## In-flight wave
- none. NEXT (ordered, wave 9):
  1. **Pins (62 UNVERIFIED)** — biggest remaining gap. Technique that works here: one place per query,
     `"<Name> <street> <town> latitude longitude"` with `allowed_domains:["waze.com","usarestaurants.info","foursquare.com"]`
     (~60% hit). Misses → tools/geocode-helper.html (docs/GEOCODE-BACKLOG.md). Priorities: CAR (13/20 rendered), GBG (17/24),
     YORK (21/34): Gift Horse, Mudhook, Green Bean, Graham Rooftop/Yorktowne, Harley tour, YCHC, AIM, Fire Museum; GBG Farnsworth,
     Hollabaugh, Adams County Winery, Battlefield Brew Works, Shriver House, Culp's Hill; CAR Market Cross, Hamilton, Helena's,
     CCHS, Boiling Springs; Issei (new Orange St site), Proof, Square One, Hands-on House, LMA, Long's Park.
  2. Depth beyond target (optional): Yi Pin (needs a non-Inquirer 2nd source), Citronnelle, Cafe Fresco, Leo's, Central Family,
     Lancaster Puerto Rican canon (J&J Mofongo / El Rincón Ponceño need merit), Broad Street Market stands.
  3. Creators: still none verifiable for this region — try `Lancaster PA food tour youtube` / Amish country vlog with a named piece.
- Prior NEXT (ordered):
  1. **Pins**: restaurantguru (`allowed_domains:["restaurantguru.com"]`, one place per query, `<Name> <street> <town>
     coordinates`) for the remaining food UNVERIFIED in geo/_geoout_w6pending.json (Bird-in-Hand Farmers Market, Root's,
     Green Dragon, Lapp Valley, Fox Meadows, Seltzer's, Spring House, Hollabaugh, Martin's, Utz, Snyder's) + the 14 W7
     UNVERIFIED (AUDIT W7) — misses go to tools/geocode-helper.html. LAN has only 8 pins — biggest map gap.
  2. **LAN** (22/38, sights only 9): Lancaster Museum of Art / Long's Park exist; add Southern Market food hall (LaBan),
     Passenger Coffee (2nd source), Yi Pin (2nd source), Issei (address 38 W Orange vs 44 N Queen — resolve), Bistro Barberet
     (2nd source), Lancaster Cathedral, Fulton (pin), Hands-on House, F&M North Museum.
  3. **HBG** (26/38): sights — Fort Hunter, Dauphin Narrows/Statue of Liberty replica, John Harris–Simon Cameron Mansion,
     Pennsylvania National Fire Museum (2nd source), Wildwood Park (2nd source); food — Appalachian Brewing flagship
     (2nd source), Mount Everest Nepali (merit), Broad Street Market stands (Hummer's, Evanilla).
  4. **YORK** (23/34): Mudhook/Liquid Hero/Gift Horse (2nd sources), Central Family Restaurant, Blue Heron, Accomac Inn,
     Wolfgang Candy (2nd source), Haines Shoe House pin, York County History Center Smalls campus.
  5. **CAR** (15/20): Boiling Springs Tavern, Café Bruges (status — structural closure), Leo's Ice Cream, Shippensburg.
  6. Keep food ≥ sights per area when adding sights. Creators: still none verifiable — try `Lancaster PA food tour youtube`.
- Previous NEXT list (wave 1, partly done):
  1. **Helper geocode** of the 65 UNVERIFIED (docs/GEOCODE-BACKLOG.md → tools/geocode-helper.html), confirming the
     discovery-stage addresses listed in AUDIT.md 2026-10-03 W3–W5 section. Biggest single lift for the map.
  2. **HBG food** (2/~19): outlet-specific — TheBurg, PennLive "best of", Harrisburg Magazine Simply the Best;
     Broad Street Market stands; Bhutanese/Nepali (Mount Everest, Momo Hunt — need 2 sources); Progress Grill,
     Greystone Public House (PA Eats + 1 more); Jackson House (needs non-SEO source).
  3. **LAN food + sights** (13/38): Belvedere Inn (2nd outlet), Norbu, Awash, Long's Horseradish/Central Market
     stands, Lancaster Museum of Art, Long's Park, Lancaster Cathedral; LNP "Best of Lancaster"; Fly Magazine.
  4. **YORK** (13/34): YDR/YorkMix/York Dispatch lists; Hanover (Hanover Shoe Farms 2nd source); Wrightsville
     (Zimmerman Center); Indian Steps Museum; York County History Center Smalls campus museum; Roburrito's.
  5. HER/CAR/AMISH fill (Hotel Hershey 2nd source; Colonel Denning; Hammond's Pretzel 2nd source; Good 'N Plenty
     status; Intercourse Pretzel Factory; Countryside Road Stand; Strasburg Creamery; Choo Choo Barn).
  6. Creators: find a Lancaster-place-naming piece for Santenello; verify Uriot scale.
- Held/single-source + rejected sources: AUDIT.md 2026-10-03 sections.

- **2026-10-03 W8 (session_014zSqoUsvHc6U5mJKtpL7hf, ~160 searches): every area OK.** +47 (33 food + 14 sights; FOOD_W8 /
  SIGHTS_W8) → 218 discovered (120 food = 55%, ≥50% every area); +58 pins (Wikipedia/NPS + Waze/usarestaurants) → **156 on page**;
  62 UNVERIFIED; 4 gates green; validate/test pass; hub card + CITIES.md + AGENT-PROMPTS row refreshed.
- Density (discovered / target): AMISH 40/40 · CAR 20/20 · GBG 24/22 · HBG 38/38 · HER 24/24 · LAN 38/38 · YORK 34/34 — all OK.
- Rendered (pinned) per area: AMISH 30 · CAR 13 · GBG 17 · HBG 29 · HER 20 · LAN 26 · YORK 21.

## Files
- `FOOD_*.json` / `SIGHTS_*.json` — research records by wave tag. `geo/_geoout_*.json` — geocode results.
- `SOURCES_*.json` outlets; `CREATORS_*.json` creators.
