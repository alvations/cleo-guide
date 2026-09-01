# Density & the iterate-to-density loop

**No guide ships thin.** Every neighbourhood/town/city is driven to the density of its peers before it is
built and announced — and the number is **not fixed**: it is benchmarked to a real comparable and scaled to
the place's size. This is the reusable rule and the measured loop that enforces it.

## The benchmarks (what "dense enough" means)
- **Singapore neighbourhoods** → **at least as dense as Toa Payoh**, scaled to size. Toa Payoh is the
  living benchmark (`python3 tools/density.py singapore` reads its current total and targets every other
  town to it). A physically larger, older town (Ang Mo Kio) should exceed it; a compact one still clears
  ~50–60. You judge the number from the place's real footprint — but never below the Toa Payoh line.
- **Dataset cities / regions** (US cities, Aachen, Saarland, Rhineland, Belgian cities) → the density of
  the established peers: **Pittsburgh (~212)** for a single metro, **the SaarLorLux Greater Region (~287)**
  for a multi-city/cross-border map, **NYC (~500)** where the brief explicitly calls for it. Per-area
  targets live in that guide's `RESUME.md` and are read by `tools/density.py <key>`.

## The loop (sequence, then iterate — do NOT compromise on counts or sources)
1. **Discovery wave** — per area, in-language, ≥2 credible sources (or a lone Michelin/UNESCO/Gault&Millau);
   signature-canon first; creators/TikTok/YouTube only when verifiably popular + a specific findable piece.
   Append NEW places to the research dir; **log held/single-source candidates in `AUDIT.md`** (never pad).
2. **Measure** — `python3 tools/density.py <key>` prints `food + sights = total` per area vs target and
   flags every `NEED +N`. This is the audit trail for density: no eyeballing.
3. **Iterate** — run another discovery wave on each `NEED +N` area. Repeat 1–2 until every area is `OK`.
   The **shared WebSearch budget caps at ~200/run**, so this is inherently multi-wave — sequence the waves,
   don't fire them all at once (they'd starve each other). It is fine to take many waves; we wait.
4. **Fact-check + re-rank** — every place verified open/closed against a real source; tiers graded within
   the area (docs/SOURCES.md merit bar).
5. **Geocode + location-verify** — Wikidata/landmarks pin well; ordinary restaurants that WebSearch can't
   resolve are held UNVERIFIED for the browser geocode-helper — **never town-centroid faked** (CLAUDE.md 4b).
6. **Build + gate** — `rebuild-city.py <key> --build` (or the Singapore per-place build) → all gates green.
7. **Announce** — only relink a card from "being built" to live once the area is dense **and** gated.

## Why discovery is the thing we measure
A place can render only if it was discovered first; geocoding and rendering come later. So density is
measured on the **discovered** research set (`tools/density.py`), and a guide is "done" for a place only
when discovery clears the benchmark, every place is sourced ≥2/fact-checked, and the gated build renders
what has been geocoded (the rest queued for the helper, tracked in `docs/GEOCODE-BACKLOG.md`).
