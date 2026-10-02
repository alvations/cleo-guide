# Chicago — audit ledger (append-only)

Contract: docs/PIPELINE.md (stages 0→6), docs/RUN-2026-10-02.md (§5a audit trail). One dated section per stage per wave.

## 2026-10-02 · Stage 0 — Scope & taxonomy
- **Region:** the City of Chicago (77 community areas grouped NYC-borough-style into 7 city areas) + the inner
  suburbs/North Shore (`SUB`) + day trips (`DAY`: Indiana Dunes, Starved Rock, Milwaukee, lake shore).
- **Why this split:** Chicago's own "sides" (Loop / North / Northwest / West / South / Southwest / Far South)
  are how locals and every outlet (Block Club, Chicago Magazine, Eater maps) carve the city — the analogue of
  NYC's boroughs. Tiers are graded within each side, so the Far South (Pullman, Beverly) never drowns under the Loop.
- **Areas + targets:** see `_AGENT_BRIEF.md` and `RESUME.md` (sum ≈ 510, New-York density).
- **Cuisine taxonomy (23):** Chicago canon first — PZ (deep-dish/tavern/stuffed), BEEF (Italian beef &
  sandwiches), DOG (hot dogs, Maxwell Street Polish, burgers), CHX (mild sauce/Harold's, BBQ rib tips, soul) —
  then US, DELI, IT, MEX, PR (jibarito, Caribbean & Latin), CN, VN (Argyle & SE Asian), KR, JP, IN (Devon),
  ME, EEU (Polish/Ukrainian), EU (Swedish/German), AF, SEAF, BAR, COF, DES (Rainbow Cone, Garrett), VIRAL.
- **Collections (16):** MUS, PARK, ICON, ARCH, **FLW** (Frank Lloyd Wright & Prairie School), MKT, ARTS
  (blues/jazz/theater/comedy), **SPORT**, WATER, FAM, ODD, FREE, ROOF, SPEAK, POP, **MURAL**.

## 2026-10-02 · Stage 1 — Discover sources (wave 1) — BLOCKED by the shared WebSearch cap
- Source palette registered from the editorial-of-record set (SOURCES_BASE.json → data/sources.json `chicago-il`,
  23 outlets each with a `credible` rationale): Michelin, James Beard, NPS, UNESCO (FLW listing), Tribune,
  Sun-Times, Chicago Magazine, Eater Chicago, Infatuation, Block Club, WTTW, WBEZ, Reader, Time Out, Choose Chicago,
  Atlas Obscura, Chicago Architecture Center, Chicago Park District, Chicagoist, NYT, Thrillist, Wikipedia, official sites.
  These are registered as the palette to search; no place yet rests on any of them.
- Searches run: 3 (a Wikipedia-coordinate probe for Wrigley Field; a batch-coordinate probe for 5 Museum-Campus/Loop
  landmarks — batching does NOT return coords, one search per pin is needed; an Al's #1 Italian Beef pin probe —
  latlong.net OSM POIs DO surface decimal pins for Chicago restaurants, a useful channel for the geocode stage).
- 4th search onward refused: "this session has used its web search budget (200 of 200 WebSearch calls)". The cap is
  per session and shared by all ~16 concurrent city agents; it was exhausted before this agent's discovery began.
- **Channel counts this wave:** editorial 0 · creators 0 · travel sites 0 · local 0 — no places extracted.
- **Places added: 0.** Nothing added from memory (hard rule). Partial leads → `_PENDING_LEADS.md`.
