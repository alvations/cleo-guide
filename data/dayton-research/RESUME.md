# Dayton — RESUME checkpoint (read first)

Resume order: **this file → AUDIT.md → _AGENT_BRIEF.md → tasks**. Then
`cd data/dayton-research && python3 consolidate.py` and `cp day_dataset.json ../dayton.dataset.json`.

## Acceptance (same rigor as SF/SV/NYC/Cincinnati)
- [ ] Comparable density across all 6 areas + cuisines/collections; credible places only.
- [ ] Every place fact-checked open/closed (closures kept-flagged).
- [ ] `node tools/research.js --sourcecheck dayton-oh` = PASS (≥2 credible, or lone James Beard; Yelp=0).
- [ ] `--geocheck` PASS · `--statuscheck` CONSISTENT · **`--buildcheck` PASS** · render-verify.
- [ ] index.html card relinked; docs/CITIES.md updated.

## State
- **2026-08-14 scaffold:** consolidate.py (6 areas + Dayton taxonomy incl. AFRICAN=Somali/East-African,
  Dayton-Style PIZZA), tools/build-dayton.py (clone — DERIVES map centre/labels; **map is safe**),
  sources.json (8 outlets incl. NPS for the Wright sites), _AGENT_BRIEF.md, geocodes entry, research.js + geocode-status.py registered,
  gitignore. Discovery agent running (FOOD.json + SIGHTS.json).
- **⚠ DEFERRED — before building:** rewrite the per-city PROSE in tools/build-dayton.py (it still
  carries the cloned SF standfirst/appendix/placeholders/footer). Do it exactly as for Cincinnati/SF:
  replace the SF strings (eyebrow "& the Peninsula", "Mission burrito/dim sum/cioppino", meta SF sources,
  placeholders, footer, appendix) with Dayton copy (Jeni's, North Market, Dayton-style pizza,
  Schmidt's, Somali table; sources = Dispatch/Dayton Monthly/Dayton Underground/James Beard). The
  build's MAP centre/labels are already derived+safe; only the prose is outstanding. Then geocode → build → gate.

---
## State @ 2026-08-18 (expansion wave complete)
- Dataset **74 candidates** (P38/F36). Page **live @ 55 pins** (high 30 · med 20 · low 5). Gates:
  sourcecheck FAIL at dataset = 2 single-source (Aullwood [OFFICIAL] held for 2nd source; Third Perk
  [DAYTONDAILY]) — **build GATE 1 drops both, page clean**. geocheck exit 0 (5 low pins) · statuscheck
  CONSISTENT · buildcheck PASS.
- **19 UNVERIFIED held** (browser-helper needed — mostly restaurants/breweries).
- Closed found + flagged: **Third Perk Coffeehouse (146 E 3rd St)** — permanently closed Dec 2023
  (Dayton Daily News); null coords so gate-dropped.
- Data trap: **The Dayton Beer Company** = 41 Madison St (OPEN); the 912 E Dorothy Ln, Kettering location
  is permanently closed — don't conflate.
- NEXT: browser-helper the 19 UNVERIFIED + upgrade 5 low/20 med to exact place-pins → rebuild (toward 74).
  A 2nd credible source for Aullwood + Third Perk would let both build.

---
## State @ 2026-08-18 (Asian food deep-dive)
- Added 7 Asian places (Wat Da Pho, Little Saigon, Pho District, Pho Mi, China Cottage, Ginger and Spice,
  Kabuki) — each ≥2 credible (Dayton937/Dayton Local/Destination Dayton/Best of Dayton/official), open-verified.
  New source keys registered: DAYTON937, DESTDAYTON, OFFICIAL.
- Page **56 pins**; **Wat Da Pho pinned**, the other 6 UNVERIFIED (WebSearch can't read their place-pins) →
  in the 25-pin helper backlog. Excluded **Get The Pho Out** (permanently closed June 2026, flagged in AUDIT).
- NEXT: browser-helper the 6 new Asian pins (+ the other 19 UNVERIFIED) → rebuild (page grows toward 81).
