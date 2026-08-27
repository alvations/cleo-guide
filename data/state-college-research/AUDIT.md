# State College / Penn State (Happy Valley PA) — AUDIT (append-only, one section per stage)

Region = Downtown State College + Penn State University Park + Bellefonte/Boalsburg + Happy Valley
(Centre County PA). Built off the Cleveland engine like every US dataset city; standard theme. Pipeline +
gates identical to the other cities (docs/PIPELINE.md).

## Stage 0 — scaffold (2026-08-27)
- `consolidate.py` — 4 areas (DT Downtown · PSU campus · BVL Bellefonte/Boalsburg · HV Happy Valley),
  college-town cuisine taxonomy (Creamery & Ice Cream, Grilled Stickies & Diners, Wings & Tavern, Pizza,
  Breweries, American, BBQ, Mexican, Asian, Mediterranean, Breakfast & Cafés, Farms & Markets, Viral),
  collections (ICON/CAMPUS/MUS/PARK/OUTDOOR/HIST/SPORT/FAM/ODD/FREE), State-College source-label map.
  Reads separate `SOURCES_*/CREATORS*` for labels. Outputs `sc_dataset.json`.
- `tools/build-statecollege.py` — engine clone (standard theme); map centre + labels DERIVED from pins;
  State-College prose/appendix; storage keys `sc_`; leak guard.
- Registered `state-college-pa` in `tools/research.js` (PAGE_FOR + DATASET_FOR), `tools/geocode-status.py`,
  `tools/rebuild-city.py`. Index.html "building" card added. `_AGENT_BRIEF.md` + `RESUME.md` written.

## Stage 1 — sources & discovery (2026-08-27, in progress)
- Two discovery agents launched: food (signature canon — creamery/stickies/wings/beer + downtown/campus/
  Bellefonte/Boalsburg) and sights (Old Main/Beaver Stadium/Nittany Lion Shrine/Mount Nittany/Penn's Cave/
  Boalsburg/Bellefonte/parks). Ranked local + Penn State source palette in `_AGENT_BRIEF.md`.
- _Fold each agent's report/`_note` in here after the run (sources used, counts, MEASURED & DROPPED, closures)._

## Stage 2+ — geocode → build → gate
- _Pending: geocode wave, `geo-merge.py state-college-pa`, `rebuild-city.py state-college-pa --build`,
  the four gates, render-verify, relink index card, update docs/CITIES.md._
