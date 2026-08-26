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

## Stage 2+ — fact-check → re-rank → geocode → build → gate
- _Pending: geocode wave (Wikipedia coords + place-pins; SEA-wide), `geo-merge.py singapore`,
  `rebuild-city.py singapore --build`, the four gates, render-verify in light + dark, relink index card._
