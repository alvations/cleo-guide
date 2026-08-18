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

---
## State @ 2026-08-18 (expansion wave complete)
- Dataset **93 candidates** (P47/F46). Page **live @ 62 pins** (high 43 · med 18 · low 1). Gates:
  sourcecheck PASS · geocheck exit 0 (1 low pin) · statuscheck CONSISTENT · buildcheck PASS.
- **23 UNVERIFIED held** (browser-helper needed) **+ 8 food never geocoded** (WebSearch budget capped
  mid-run): Lalibela Ethiopian, Stauf's (Grandview), Natalie's Coal-Fired (Grandview), Mazah Mediterranean,
  Café Istanbul, City Barbeque (Upper Arlington), Mikey's Late Night Slice, Preston's: A Burger Joint.
  Those 8 need a WebSearch geocode wave (resumable) THEN the helper for any still-null.
- Closed found + flagged: **Yellow Brick Pizza (245 King Ave)** — permanently closed (relocated to
  415 W Rich / 212 Kelton); null coords so gate-dropped.
- Address flag: **Antiques on High** worklist 741 S High vs Yelp 714 S High — resolve at helper time.
- NEXT: geocode the 8 remaining food → browser-helper the 23 UNVERIFIED → rebuild (toward 93).
