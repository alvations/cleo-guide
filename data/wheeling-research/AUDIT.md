# Wheeling WV + National Road corridor — AUDIT (append-only, one section per stage)

Region = Wheeling WV + Washington PA + the National Road (I-70) corridor west through eastern Ohio
(St. Clairsville, Cambridge) to Zanesville, up to the Columbus guide's eastern edge. Built off the
Cleveland engine like every US dataset city; standard theme. Pipeline + gates identical (docs/PIPELINE.md).

## Stage 0 — scaffold (2026-08-27)
- `consolidate.py` — 5 areas (WHL Wheeling · WASH Washington PA · OHV Ohio Valley/St. Clairsville ·
  CAM Cambridge/Guernsey · ZAN Zanesville/Muskingum to the Columbus edge), Ohio-Valley cuisine taxonomy
  (Italian & Pizza, Fish & Seafood, WV/Appalachian, Diners, American, BBQ, Mexican, Asian, Ice Cream &
  Sweets, Breweries, Cafés, Viral), National-Road collections (ICON/HIST/ARCH/MUS/GLASS/PARK/FAM/MKT/ODD/
  FREE), Ohio-Valley source-label map. Outputs `wh_dataset.json`.
- `tools/build-wheeling.py` — engine clone (standard theme); map centre + labels DERIVED from pins;
  Ohio-Valley prose/appendix; storage keys `wh_`; leak guard.
- Registered `wheeling-wv` in `tools/research.js` (PAGE_FOR + DATASET_FOR), `tools/geocode-status.py`,
  `tools/rebuild-city.py`. Index.html "building" card + `_AGENT_BRIEF.md` + `RESUME.md`.

## Stage 1 — sources & discovery (2026-08-27, in progress)
- Two discovery agents launched: food (DiCarlo's/Coleman's/pepperoni rolls/Italian + corridor) and sights
  (Suspension Bridge/Oglebay/Independence Hall/Y-Bridge/Dickens Village/Salt Fork/National Road museums).
- _Fold each agent's report/`_note` in here after the run (sources used, counts, MEASURED & DROPPED, closures)._

## Stage 2+ — geocode → build → gate
- _Pending: geocode wave, `geo-merge.py wheeling-wv`, `rebuild-city.py wheeling-wv --build`, the four gates,
  render-verify, relink index card, update docs/CITIES.md._
