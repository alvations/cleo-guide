# Aachen & the Dreiländereck — RESUME (read this first to continue)

## State
Scaffolded 2026-09-01. Pipeline registered end-to-end (`python3 tools/rebuild-city.py aachen --build`).
Discovery in progress toward Pittsburgh density (~200+ places) across 5 areas.

## Next actions
1. Run the discovery waves (per-area food + sights), emit `FOOD_<AREA>.json` / `SIGHTS_<AREA>.json` +
   `SOURCES_*` / `CREATORS_*` under `data/aachen-research/`. In-language (DE/NL/FR), ≥2 credible each.
2. `python3 data/aachen-research/consolidate.py` → `cp sr_dataset.json ../aachen.dataset.json`.
3. Geocode waves (Wikidata for landmarks; restaurants held for the browser helper). `python3
   tools/geo-merge.py aachen`.
4. `python3 tools/build-aachen.py` then the gates: `node tools/research.js --geocheck/--statuscheck/
   --buildcheck aachen`, `python3 tools/check-google.py`, `cd tools && npm run validate && npm test`.
5. Relink the index.html card from "being built" to live once gates pass.

## Acceptance checklist
- [ ] ≥2 credible sources per place (Yelp=0); 0 single-source in the built page.
- [ ] Every rendered pin verified in `data/geocodes.json["aachen"]`; UNVERIFIED held, never faked.
- [ ] Every place status-checked open/closed; closed flagged with "— CLOSED".
- [ ] `--buildcheck` PASSES (map centre + labels sit on Aachen/Dreiländereck pins, not the cloned city).
- [ ] All 5 areas have ≥1 tier-1 must-see.
