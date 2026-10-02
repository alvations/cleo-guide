# San Francisco & Peninsula — RESUME checkpoint (read first)

## Targets (per area; parsed by tools/density.py — sum = 500, New York density)
- `DTN` Downtown, SoMa & Union Square ~80
- `NECN` Chinatown, North Beach & the Wharf ~75
- `NOB` Nob Hill, Russian Hill & Polk/Tenderloin ~40
- `NW` Marina, Pacific Heights, Japantown & Presidio ~50
- `AVE` Richmond, Sunset & Golden Gate Park ~70
- `MIS` Mission, Castro & Noe Valley ~75
- `HAI` Haight, Hayes Valley & Divisadero ~45
- `SE` Bayview, Dogpatch, Bernal & the Southeast ~30
- `PEN` Peninsula & SFO (Daly City → San Mateo) ~35

## Session 2026-10-02 (modernisation run) — search counter
- WebSearch used this session: ~173 main (per tool call) + 18 pin agent A ≈ 191+ (fan-out may push the platform count to the cap).

## In-flight wave
**W5 (wave 3 of 2026-10-02, session_013SchN5xr8QFAgVqjZY37dr)** — (1) background pin agent (≤30 searches) on the
87 unpinned listed in `_sf_unpinned_w5.txt` → `geo/_geoout_w5pin.json`; (2) main: sights-first discovery per area
(MIS, AVE, DTN, NECN, HAI, NOB, NW, PEN, SE) via batched Wikipedia-coordinate queries + a 2nd outlet → `SIGHTS_W5.json`
+ `geo/_geoout_w5.json`; food top-ups → `FOOD_W5.json`; creators → `CREATORS_W5.json` if any qualify.
Search counter (main): 93 (several multi-name queries fanned out internally — platform count likely higher) · pin agent: 30 (done — 5/87 pinned → geo/_geoout_w5pin.json).
Build W5-1 (after batch 4): 430 researched / 328 on map (146 sights + 182 food); 4 gates + validate + test green. Density: AVE+13 DTN+12 HAI+7 MIS+12 NECN+10 NOB+6 NW+4 PEN+3 SE+3.
Build W5-2 (after batch 14): 482 researched / 349 on map (166 sights + 183 food); 4 gates + validate + test green; 15 AUTO source keys given real rationales. Density: AVE+5 DTN+4 HAI+1 MIS+2 NECN+3 NOB+1 PEN+2 (NW, SE OK).
Progress: batch 15 = AVE +3 sights (Lake Merced, Mountain Lake Park, Mount Sutro) · PEN +1 food (Royal Feast) +2 sights (Pacifica State Beach, San Pedro Valley Park). batch 14 = MIS +2 food (La Torta Gorda, El Buen Sabor) +2 sights (Calle 24, Rainbow Honor Walk). batch 13 = HAI +3 sights (Duboce Park, Patricia's Green, Haight Street Art Center) +1 food (Absinthe). batch 12 = NOB +2 sights (Flood Mansion, Golden Gate Theatre) +2 food (Bob's Donuts, Leopold's). batch 11 = NECN +2 sights (Club Fugazi, Kong Chow Temple) +3 food (Caffe Trieste, Eastern Bakery, Red Blossom). batch 10 = +2 food +3 sights (DTN). batch 9 = +4 food (AVE: Toyose, Pizzetta 211, Kingdom of Dumpling, Joe's Ice Cream) + W5 copy audit. batch 8 = +7 food (SE 3 Dogpatch bars; NW 2 Japantown; HAI 2 NoPa). batch 7 = +4 food (PEN Koi Palace; NW Greens [med, Fort Mason Bldg A], Spruce; NOB Harris'). batch 6 = +3 food (MIS) +5 sights (MIS 3, NECN 2); Atlas pins for CHSA + Vermont St. batch 5 = +7 sights (AVE 4 Lands End/GG Park, DTN 3). batch 4 = +9 food (HAI 3, NOB 2, DTN 2, NECN 2) + CREATORS_W5 (Bourdain, 4 attachments). batch 3 = 10 food (FOOD_W5.json; 2 pinned via Atlas Obscura). batch 2 = +10 sights (NOB 2, NW 2, SE 3, PEN 3) → 26 in SIGHTS_W5. batch 1 = 16 sights (SIGHTS_W5.json) — NECN 4, MIS 4, AVE 3, DTN 2, HAI 2, NW 1.

## State — W4 FINAL (2026-10-02 wave 2, session_0159tKUL6tQ8pvUJRBHa67Nx)
- **385 researched / 298 on the map (122 sights + 176 food)** (+Prubechu, Tartine Manufactory, unpinned); 4 gates + validate + test green. Food ≈67% overall, ≥50% per area.
- Per area (food+sights=total/target): AVE 31+21=52/70 · DTN 42+20=62/80 · HAI 21+12=33/45 · MIS 42+13=55/75 ·
  NECN 41+16=57/75 · NOB 21+9=30/40 · NW 28+15=43/50 · PEN 18+11=29/35 · SE 16+8=24/30.
- Registry: 262 high / 35 med / 1 low / 85 UNVERIFIED (≈70 new W4 restaurants + 12 old held) → docs/GEOCODE-BACKLOG.md.
- Files: FOOD_W4.json (77), SIGHTS_W4.json (16), geo/_geoout_w4.json, geo/_geoout_w4pin.json, geo/_geoout_w4pin2.json
  (force-added — geo/_*.json is gitignored, so `git add -f`).
- Searches: ~113 main + 52 pin agents.

## Next-wave plan (ordered)
1. **Pins via the browser helper** (`tools/geocode-helper.html`) for the ~85 UNVERIFIED — WebSearch cannot place-pin small
   SF restaurants (4/46 hit rate). This is the biggest lever on what's *on the map* (383 researched vs 298 shown).
2. **Discovery, weakest gap first:** MIS +22 (Infatuation Mission/Castro guides; Mission Local; held: Thorough Bread, Butter &
   Crumble [NECN], Craftsman & Wolves status), AVE +18 (held: Hook Fish Co, Dumpling Specialist, Mini Potstickers, Anh Hong,
   Bread n' Chu, HK Lounge II — each needs a 2nd outlet/full address), DTN +18 (Infatuation SoMa/FiDi; Saluhall vendors;
   John's Grill address), NECN +18 (Bocconcino, 15 Romolo after its Oct-2026 reopening, Cold Drinks Bar), HAI +12 (Beretta
   Divisadero, Hinodeya address, Katsuo + Kombu, Kezar Stadium 2nd source), NOB +10 (sights: Flood Mansion/Pacific-Union Club,
   Glide, Vallejo St steps — Wikipedia pins + SF Travel), NW/SE/PEN +6–7 (Millbrae openings Falafio/Han Sang/Stick & Steam need
   a 2nd source; Bayview Oyster Bar, Radio Africa).
3. Sights are under-weight in MIS/NOB/SE/NECN (food 64–80%) — next sights batch: Wikipedia-coordinate queries ×
   SF Travel/Atlas Obscura (826 Valencia Pirate Store has Atlas Obscura coords 37.759602,-122.421382 — needs a 2nd source).
4. Creators: still none qualifying — try named SF creators with verifiable scale and a findable place video.

## State — 2026-10-02 modernisation session (FINAL)
- **290 researched / 265 rendered** (was 148 / 141). Food 181 = 62.4% (food-first ✓). 4 gates + validate + test green.
  Per area (food+sights = total / target): AVE 16+18=34/70 · DTN 29+17=46/80 · HAI 13+8=21/45 · MIS 32+11=43/75 ·
  NECN 31+16=47/75 · NOB 15+8=23/40 · NW 20+12=32/50 · PEN 18+11=29/35 · SE 7+8=15/30.
- Searches: ~173 main (counted per tool call; several multi-name queries visibly fanned out internally, so the
  platform count is likely higher) + 18 (pin agent A).
- New files: FOOD_W3A (16 stars/Bibs), FOOD_W3B (55 Michelin by ZIP/cuisine), FOOD_W3C (19 JB/editorial/bars),
  SIGHTS_W3A (52); geo/_geoout_w3a/_w3b/_w3c/_s3a/_fixold; helpers _sf_add/_sf_geo/_sf_mich/_sf_sights/_sf_fix_m2/
  _sf_rerank/_sf_push.sh/_sf_counts.sh.
- Pins: 265 on the map (registry: 236 high / 28 med / 1 low / 25 UNVERIFIED held) held (docs/GEOCODE-BACKLOG.md): old 6 (Boudin, It's-It, Chibog, Bread Basket,
  Basque CC, Wursthall) + new non-Michelin restaurants/bars + 7 sights. ~20 old med pins (non-Michelin) remain med.
- Closed flagged (unchanged): PEZ Museum, Contemporary Jewish Museum, The Mill, Wursthall. Newly found closed and NOT
  added: Prelude (Sept 2026), Auntie April's, Café Jacqueline, Lord Stanley.

## Next-wave plan (ordered)
1. **Pins first (cheap, all on the map):** Michelin-page pin retry for 3rd Cousin, Noodle in a Haystack (+ any new
   Michelin adds); then `tools/geocode-helper.html` (browser) for the 28 UNVERIFIED.
2. **Michelin channel is ~exhausted by ZIP**; next food sources: Infatuation neighbourhood guides × SF Standard
   "panel of pros" lists (2 independent outlets), SF Travel "iconic eats every neighborhood" + "oldest bars" +
   "best bakeries by neighborhood", Michelin inspector/editorial articles (MICHELIN_EDITORIAL = 1 source) for the
   held list in AUDIT.md (Rosamunde, St. Francis Fountain, Wing Lee, Noe Valley Bakery, Hon's Wun-Tun, Hing Lung,
   Little Swan, Spicy Shrimp, Lai Hong, House of Dim Sum, Dol Ho, Zeitgeist, Toronado, Elixir, Long Bridge Pizza,
   Old Skool Cafe, Bayview Oyster Bar, Happy Crane, Anchovy Bar, Jane the Bakery, Rize Up).
3. **Thin areas:** HAI (+26), SE (+17), AVE (+39), NOB (+18): sights via SF Travel neighbourhood page × Wikipedia
   coordinate batch (2 searches → 4–6 pinned sights): Japantown (Japan Center, Peace Plaza done), Fillmore Auditorium,
   St. Mary's Cathedral, Alamo Square (done), Lafayette Park, Haas-Lilienthal, Holy Virgin Cathedral, Columbarium,
   Spreckels Temple of Music, Bison Paddock, Beach Chalet, McLaren Park, Candlestick Point SRA, Glide Memorial,
   Tenderloin Museum, Portsmouth Square, Tin How Temple (pins already found: 37.79457,-122.40710).
4. **Creators:** two creator queries this run found no qualifying SF creator piece — try named creators next
   (e.g. SF Travel's "How I See San Francisco: YouTuber Joey Yee" surfaced — vet following + a findable video).
5. Give the 13 remaining AUTO-registered keys real rationales in data/sources.json.

## Commands
```
python3 tools/density.py san-francisco-ca
flock -w 3600 /home/user/cleo-guide/.git/cleo-shared.lock python3 tools/rebuild-city.py san-francisco-ca --build
python3 data/san-francisco-research/_sf_add.py FOOD_W3A.json < recs.json     # dedup-append
bash data/san-francisco-research/_sf_push.sh                                  # pull+push loop
flock -w 3600 /home/user/cleo-guide/.git/cleo-shared.lock bash data/san-francisco-research/_sf_counts.sh
```


Single source of truth for where the SF build is and what to do next. Resume deterministically by
reading, in order: **this file → `AUDIT.md` → `_AGENT_BRIEF.md` → the task list (#29 scaffold, #30 food,
#31 sights)**. Then `cd data/san-francisco-research && python3 consolidate.py` for the live count, and
`cp sf_dataset.json ../sanfrancisco.dataset.json`.

Region: **SF proper + northern Peninsula to San Mateo + SFO corridor.** Bridges the SV guide (which
starts ~Menlo Park/Redwood City). 9 areas — see `_AGENT_BRIEF.md`.

## Acceptance criteria (same rigor as SV & NYC)
- [ ] **NYC/SV-comparable density** across all 9 areas and every cuisine/collection — credible places only.
- [ ] **Every place fact-checked** — open/closed from a real source; closures kept-but-flagged, non-places out.
- [ ] **MULTIPLE SOURCES OF TRUTH** — `node tools/research.js --sourcecheck san-francisco-ca` = PASS
      (≥2 credible, or a lone Michelin/James Beard; Yelp = 0).
- [ ] **Every place location-verified** — sourced place-pin in `data/geocodes.json`; `--geocheck` PASS.
- [ ] **Built + gated** — `tools/build-sanfrancisco.py`; geocheck PASS · statuscheck CONSISTENT ·
      sourcecheck PASS · npm test unaffected · jsdom render-verify (markers>0, 0 JS errors, degrades w/o CDN).
- [ ] **Audit complete** in `AUDIT.md`; `index.html` card relinked & counts finalized.

## State history (Aug 2026 build, superseded by the State section above)
- **2026-08-14 scaffold:** `consolidate.py`, `build-sanfrancisco.py`, `sources.json` (11 SF outlets),
  `_AGENT_BRIEF.md`, geocodes entry, research.js + geocode-status.py registration, index "being built" card.
- **2026-08-14 discovery wave 1: 86 places, `--sourcecheck` PASS 86/86** (46 sights + 40 food). Files:
  FOOD_SIGNATURE(18), FOOD_ASIAN(22), SIGHTS_ICONS(18), SIGHTS_MUSEUMS_PARKS(28). Clean sourcing from
  the start (agents used the brief). See AUDIT.md Stage 2 for the ledger + closures.
- **2026-08-14 discovery wave 2 (running):** Italian/Cal-cuisine fine dining, coffee/cocktail bars/viral,
  Peninsula/SFO corridor (fills PEN + Italian/coffee/bars gaps).
- **2026-08-14 BUILT + LIVE:** 141 places (57 sights + 84 food); geocheck PASS · statuscheck CONSISTENT · sourcecheck PASS · render-verify ALL PASS; index card relinked. 7 UNVERIFIED pins (Boudin, It's-It, 4 Peninsula spots + closed Wursthall) → browser helper via docs/GEOCODE-BACKLOG.md. Optional next: density waves (more neighborhoods/cuisines) + helper geocode of the 7.
- **(historical) NEXT after wave 2:** consolidate → any re-sourcing needed (should be minimal) → **geocode + status
  waves** (WebSearch place-pins for sights/landmarks work well; restaurant pins may need the browser
  helper — track in `docs/GEOCODE-BACKLOG.md`) → `build-sanfrancisco.py` → gates → render-verify →
  relink index card. Budget caps ~200/window — wave it; this file + AUDIT.md keep it resumable.

## Pipeline files
`consolidate.py` → writes `sf_dataset.json` → copy to `../sanfrancisco.dataset.json` → `build-sanfrancisco.py`
→ `cities/sanfrancisco.html`. Research files: any `*.json` in this dir (sights = object w/ sights[]/sources[];
food = array). Gate helpers: `tools/sourcecheck.py`, `research.js --sourcecheck/--geocheck/--statuscheck`.
