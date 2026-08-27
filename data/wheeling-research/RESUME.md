# Wheeling WV + National Road corridor — RESUME checkpoint (read first)

Resume order: **this file → AUDIT.md → _AGENT_BRIEF.md → tasks**. Then
`cd data/wheeling-research && python3 consolidate.py` and (repo root)
`python3 tools/rebuild-city.py wheeling-wv --build`.

## Acceptance (same rigor as the US cities)
- [ ] Coverage across WHL / WASH / OHV / CAM / ZAN; every food card names a specific dish; credible places only.
- [ ] Every place fact-checked open/closed (closures kept-flagged).
- [ ] `node tools/research.js --sourcecheck wheeling-wv` = PASS (≥2 credible, or lone James Beard; Yelp=0).
- [ ] `--geocheck` PASS · `--statuscheck` CONSISTENT · **`--buildcheck` PASS** · render-verify.
- [ ] index.html card relinked to the live page; docs/CITIES.md updated.

## State
- **2026-08-27 scaffold DONE:** consolidate.py (5 areas: WHL/WASH/OHV/CAM/ZAN; Ohio-Valley cuisine taxonomy —
  Italian & Pizza, Fish, WV/Appalachian, Diners, Ice Cream & Sweets, etc.), tools/build-wheeling.py (engine
  clone, standard theme, map centre DERIVED from pins — safe), keys registered in research.js /
  geocode-status.py / rebuild-city.py, index "building" card, _AGENT_BRIEF/AUDIT.
- **NEXT:** food + sights discovery waves → consolidate + sourcecheck → geocode wave (Wheeling/Zanesville
  landmarks resolve high via Wikipedia; corridor restaurants may need the browser helper) → `geo-merge.py
  wheeling-wv` → `rebuild-city.py wheeling-wv --build` → 4 gates → relink card + docs/CITIES.md.

## Notes
- Map centre fallback (empty registry only) = Wheeling ~[40.0637,-80.7209] (span is wide across the corridor).
- Signature canon to anchor: DiCarlo's pizza, Coleman's fish sandwich, pepperoni rolls, Tom's Ice Cream Bowl;
  iconic sights: Wheeling Suspension Bridge, Oglebay, WV Independence Hall, Zanesville Y-Bridge, Dickens Village.
- Corridor stops at the Columbus guide's eastern edge (New Concord/Norwich → Newark/Buckeye Lake); don't
  double-cover Columbus's own towns.
