# Cincinnati — RESUME checkpoint (read first)

Single source of truth for where the Cincinnati build is and what to do next. Resume by reading, in
order: **this file → `AUDIT.md` → `_AGENT_BRIEF.md` → the task list**. Then
`cd data/cincinnati-research && python3 consolidate.py` for the live count, and
`cp cin_dataset.json ../cincinnati.dataset.json`.

Region: **Cincinnati OH + the NKY riverfront (Covington/Newport/Bellevue).** 7 areas — see `_AGENT_BRIEF.md`.

## Acceptance criteria (same rigor as SF/SV/NYC)
- [ ] **Comparable density** across all 7 areas and every cuisine/collection — credible places only.
- [ ] **Every place fact-checked** — open/closed from a real source; closures kept-but-flagged.
- [ ] **MULTIPLE SOURCES OF TRUTH** — `node tools/research.js --sourcecheck cincinnati-oh` = PASS
      (≥2 credible, or a lone James Beard; Yelp = 0). *No Michelin/Eater in this market — lean on
      Enquirer / Cincinnati Magazine / CityBeat / James Beard / TV.*
- [ ] **Location-verified** — sourced place-pin in `data/geocodes.json`; `--geocheck` PASS.
- [ ] **Built + gated** — `tools/build-cincinnati.py`; geocheck PASS · statuscheck CONSISTENT ·
      sourcecheck PASS · **buildcheck PASS** (map centre+labels = Cincinnati's own pins) · render-verify.
- [ ] **Audit complete** in `AUDIT.md`; `index.html` card relinked; `docs/CITIES.md` updated.

## State (update every wave)
- **2026-08-14 scaffold:** `consolidate.py` (7 areas + Cincinnati cuisine/collection taxonomy incl.
  CHILI/GERMAN/BBQ/BREW + RIVER collection), `tools/build-cincinnati.py` (clone of the SF build — DERIVES
  map centre/labels from pins, so no wrong-city risk; Cincinnati copy hand-written), `sources.json` entry
  (9 credible outlets), `_AGENT_BRIEF.md`, geocodes entry, research.js + geocode-status.py registration,
  index "being built" card. **0 places.**
- **NEXT:** discovery waves — signature-first food (Cincinnati chili, goetta, Montgomery Inn ribs, Findlay
  Market, Graeter's, German/OTR, craft beer, modern fine dining, NKY) + sights (Union Terminal/Museum
  Center, Cincinnati Zoo/Fiona, Music Hall, Roebling Bridge, Fountain Square, Art Museum, Eden Park,
  American Sign Museum, Freedom Center, OTR, NKY riverfront). Then sourcing → geocode → build. Budget
  caps ~200/window — wave it; this file + AUDIT.md keep it resumable.

## Pipeline files
`consolidate.py` → `cin_dataset.json` → copy to `../cincinnati.dataset.json` → `build-cincinnati.py`
→ `cities/cincinnati.html`. Gate helpers: `tools/sourcecheck.py`, `research.js
--sourcecheck/--geocheck/--statuscheck/--buildcheck`, `tools/geocode-status.py`.

---
## State @ 2026-08-18 (expansion wave complete)
- Dataset **132 candidates** (P71/F61). Page **live @ 109 pins** (high 76 · med 29 · low 4). Gates:
  sourcecheck PASS · geocheck exit 0 (4 low pins to upgrade) · statuscheck CONSISTENT · buildcheck PASS.
- **23 UNVERIFIED held by the gate** (need `tools/geocode-helper.html` — WebSearch can't surface these
  restaurant place-pins). List in `docs/GEOCODE-BACKLOG.md`. Includes 13 from this wave (St. Francis
  Apizza, Guardia, Quan Hapa, Sundry & Vice, Dusmesh, Sebastian's, Japp's, The Video Archive, Deeper
  Roots Coffee, Sonder Brewing, Pendleton Art Center, Verdin Bell & Clock Museum, Cincinnati Dinner Train).
- NEXT: browser-helper pass on the 23 UNVERIFIED → re-merge → rebuild (page will grow toward 132). Also
  re-verify the 4 low + 29 med pins to exact place-pins (docs/SOURCES.md §re-verify).
- Notes: World Peace Bell in storage 2024 (open, not on display); The Video Archive is OPEN (reservation
  tiki concept), not the CLOSED Yelp listing.
