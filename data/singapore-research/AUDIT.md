# Singapore & Southeast Asia — AUDIT (append-only, one section per stage)

Region = Singapore towns (opening on **Toa Payoh**) + the major cities of Southeast Asia. Built off the
Cleveland engine like every dataset city; the only visual departure is a **pastel light/dark theme** in
`tools/build-singapore.py`. Pipeline + gates are identical to the US cities (docs/PIPELINE.md).

## Stage 0 — scaffold (2026-08-26)
- `consolidate.py` — 10 areas (TPY Toa Payoh · SGC/SGE/SGWN Singapore clusters · MY/TH/VN/ID/PH/IC SEA
  countries), pastel marker palette (`AC`), a Southeast-Asian cuisine taxonomy (Hainanese chicken rice,
  laksa, wok noodles, bak kut teh, hawker/zi char, Malay, Indian/prata, Chinese/dim sum, seafood, Thai,
  Vietnamese, Indonesian, Peranakan, kopitiam, dessert, café, viral), collections (ICON/HERITAGE/TEMPLE/
  MKT/PARK/MUS/VIEW/ARCH/FAM/ODD/FREE), and a SEA source-label map. Outputs `sg_dataset.json`.
- `tools/build-singapore.py` — clone of the engine build with: the **pastel `:root` swap + a
  `@media (prefers-color-scheme:dark)` override** (both modes soft-pastel), a light-default basemap keyed to
  the viewer's colour scheme, a light-mode tile fix, the map **anchored on Toa Payoh** (labels still derived
  from pins; buildcheck only needs the centre inside pin bounds), pastel legend, SEA prose/appendix.
- Registered `singapore` in `tools/research.js` (PAGE_FOR + DATASET_FOR), `tools/geocode-status.py`
  (DATASETS), `tools/rebuild-city.py` (CITY). Index.html "building" card added.
- `_ELITE_SOLO` in the build adds `UNESCO` (World-Heritage sights) alongside Michelin/JamesBeard/NPS/Smithsonian.

## Stage 1 — sources & discovery (2026-08-26, in progress)
- Three discovery agents launched (write distinct files + `_note_<tag>.md`; no shared-file edits):
  Toa Payoh (`FOOD_TOAPAYOH`/`SIGHTS_TOAPAYOH`), the rest of Singapore (`FOOD_SINGAPORE`/`SIGHTS_SINGAPORE`),
  and SEA cities (`FOOD_SEA`/`SIGHTS_SEA`). Ranked SG/SEA source palette in `_AGENT_BRIEF.md`.
- _Fold each agent's `_note_*.md` summary in here after the run (sources used, counts, MEASURED & DROPPED,
  closures)._

## Stage 1 — sources & discovery (DONE 2026-08-26)
- **Toa Payoh:** 20 food + 7 sights; creators Ghib Ojisan (~354K), Dr Leslie Tay/ieatishootipost, Clara
  Chua/Exploding Belly (~112K). **Rest of Singapore (SGC/SGE/SGWN):** 60 food + 32 sights; Michelin
  stars/Bibs, ieatishootipost/Miss Tam Chiak/Seth Lui/Daniel Ang. **SEA cities (MY/TH/VN/ID/PH/IC):** 29
  food + 35 sights; **sources kept SEPARATE per city** — 11 `SOURCES_<city>.json` + 9 `CREATORS_<city>.json`,
  namespaced keys; vetted Mark Wiens (11.7M), Nex Carlos (5.2M), Erwan Heussaff (4.6M + James Beard), KL
  Foodie (~2M), Vietnam Coracle, Wander-Lush. **Total 183 candidates.** register-sources: 76 sources;
  merge-creators: 17 creators + 23 attachments. Yelp/TripAdvisor/Google = 0 throughout; SEO farms rejected.

## Stage 2 — geocode → build → gate (DONE 2026-08-26)
- 4 geocode waves (WebSearch: Wikipedia coords / Google `!3d!4d` / Apple `coordinate=` / OneMap): SGC 48/49,
  TPY+SGE 45/46, SGWN+MY+TH 44/48, VN/ID/PH/IC 26/40 → **163 pinned**, 20 UNVERIFIED held for the browser
  helper. Viewport-traps caught (Kok Kee, Dragon Playground, Babi Guling Ibu Oka). 4 closures flagged &
  kept (Eng Seng, Kim Keat Hokkien Mee, Hup Chong, Romdeng).
- `geo-merge.py singapore` → `rebuild-city.py singapore --build` → **LIVE @ 163 pins** (74 sights + 89 food).
  Gates: sourcecheck FAIL = 1 single-source place (GATE 1 drops it, page clean) · geocheck PASS (3
  block-level to re-verify) · statuscheck CONSISTENT · **buildcheck PASS** (centre 1.3343,103.8479 z13 =
  Toa Payoh, inside pin bounds). Pastel light/dark theme verified in the built HTML; index card relinked live.
- **Tool fixes made this build:** `merge-creators.py` now accepts both `creator`/`creatorKey` attach fields;
  `geo-merge.py` detects the `— CLOSED` marker anywhere in a name (not just as a suffix) to avoid double-marking.
- **NEXT (extension):** browser-helper the 20 UNVERIFIED restaurant pins → deeper per-town food expansion
  toward NYC-level density → re-run `rebuild-city.py singapore --build`.
