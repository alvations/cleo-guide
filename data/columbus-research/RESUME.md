# Columbus — RESUME checkpoint (read first)

Resume order: **this file → AUDIT.md → _AGENT_BRIEF.md → tasks**. Then
`cd data/columbus-research && python3 consolidate.py` and `cp col_dataset.json ../columbus.dataset.json`.

## Acceptance (same rigor as SF/SV/NYC/Cincinnati)
- [ ] Comparable density across all 7 areas + cuisines/collections; credible places only.
- [ ] Every place fact-checked open/closed (closures kept-flagged).
- [ ] `node tools/research.js --sourcecheck columbus-oh` = PASS (≥2 credible, or lone James Beard; Yelp=0).
- [ ] `--geocheck` PASS · `--statuscheck` CONSISTENT · **`--buildcheck` PASS** · render-verify.
- [ ] index.html card relinked; docs/CITIES.md updated.

## State
- **2026-08-14 scaffold:** consolidate.py (7 areas + Columbus taxonomy incl. AFRICAN=Somali/East-African,
  Columbus-Style PIZZA), tools/build-columbus.py (clone — DERIVES map centre/labels; **map is safe**),
  sources.json (8 outlets), _AGENT_BRIEF.md, geocodes entry, research.js + geocode-status.py registered,
  gitignore. Discovery agent running (FOOD.json + SIGHTS.json).
- **⚠ DEFERRED — before building:** rewrite the per-city PROSE in tools/build-columbus.py (it still
  carries the cloned SF standfirst/appendix/placeholders/footer). Do it exactly as for Cincinnati/SF:
  replace the SF strings (eyebrow "& the Peninsula", "Mission burrito/dim sum/cioppino", meta SF sources,
  placeholders, footer, appendix) with Columbus copy (Jeni's, North Market, Columbus-style pizza,
  Schmidt's, Somali table; sources = Dispatch/Columbus Monthly/Columbus Underground/James Beard). The
  build's MAP centre/labels are already derived+safe; only the prose is outstanding. Then geocode → build → gate.
