# State College / Penn State (Happy Valley PA) — RESUME checkpoint (read first)

Resume order: **this file → AUDIT.md → _AGENT_BRIEF.md → tasks**. Then
`cd data/state-college-research && python3 consolidate.py` and (repo root)
`python3 tools/rebuild-city.py state-college-pa --build`.

## Acceptance (same rigor as the US cities)
- [ ] Coverage across DT / PSU / BVL / HV; every food card names a specific dish; credible places only.
- [ ] Every place fact-checked open/closed (closures kept-flagged).
- [ ] `node tools/research.js --sourcecheck state-college-pa` = PASS (≥2 credible, or lone James Beard; Yelp=0).
- [ ] `--geocheck` PASS · `--statuscheck` CONSISTENT · **`--buildcheck` PASS** · render-verify.
- [ ] index.html card relinked to the live page; docs/CITIES.md updated.

## State
- **2026-08-27 scaffold DONE:** consolidate.py (4 areas: DT/PSU/BVL/HV; college-town cuisine taxonomy —
  Creamery/Stickies/Wings/Pizza/Brew/etc.), tools/build-statecollege.py (engine clone, standard theme,
  map centre DERIVED from pins — safe), keys registered in research.js / geocode-status.py / rebuild-city.py,
  index "building" card, _AGENT_BRIEF/AUDIT.
- **NEXT:** food + sights discovery waves → consolidate + sourcecheck → geocode wave (Wikipedia coords for
  campus landmarks/parks resolve high; restaurants may need the browser helper) → `geo-merge.py
  state-college-pa` → `rebuild-city.py state-college-pa --build` → 4 gates → relink card + docs/CITIES.md.

## Notes
- Map centre fallback (empty registry only) = State College ~[40.7934,-77.8600]; real centre derives from pins.
- Signature canon to anchor: Berkey Creamery, grilled stickies (College Diner), wings, Happy Valley beer;
  iconic sights: Old Main, Beaver Stadium, Nittany Lion Shrine, Mount Nittany, Penn's Cave, Boalsburg.
