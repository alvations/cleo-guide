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
(none — the 2026-10-02 modernisation session closed cleanly; see State.)

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
