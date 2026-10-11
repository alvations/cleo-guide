# Wave 8 briefs

## Part 1: fan-out started before the R7 results (owner, 2026-10-11 18:40Z)

The owner: *"Meanwhile autonomously continue to work and Fanout on the other agents lane and iteratively work until completion!!"*

The Atlas map is being redesigned in its own loop (design/beta/atlas/PANEL.md). R7 QA and the evaluator are measuring `badcc20d`. While they run, the idle lanes take the gaps that R6 named and W7 did not close. **R7 QA findings routed to a lane take priority over this list.** Every lane keeps the hard rules (CLAUDE.md, rule 6, no CDN for content, OSM/Esri only, localStorage try/catch, every place kept, closures flagged, attribution visible) and runs validate + npm test + beta:check before each push.

Atlas files (`atlas.js`, `atlas.css`, the Atlas parts of the view JS) belong to the Atlas loop. Other lanes don't edit them.

### Lane FE-A (city pages, Gallery, place detail, day plans)

1. **"Start with" matches the lead card** (R6 gap #8, carried from R5 #5).
   - Acceptance: on every city page, the "Start with" button names the place shown on the lead card.
   - A test over all 84 place pages.
2. **"Your guide" and day plans** (R6 D: 77). Walk the flow at 390 and 1440, light and dark: build a day from saved places, see it, reorder or remove, share it (the link reopens it), and print or save.
   - Fix rough edges outside atlas.js.
   - The day summary (stops, distance) is visible without hunting.
   - Every step is reachable by keyboard.
   - A probe test covers build → share → reopen.
3. **Place detail and Gallery polish against D12/D13.**
   - Section rhythm, sticky action bar, sources always visible, closures loud.
   - Category bar behaviour on scroll.
   - Grid density at 1024 / 1280 / 1440 (no orphan columns).
   - Self-review with before/after shots in design/beta/eval/w8/fe-a/ and a list of what changed and why.

### Lane FE-B (landing, hubs, Guidebook, Insights, "What changed")

1. **Guidebook and Insights under design system v2.** Audit both at 390/1440 in light and dark. Then:
   - **Guidebook:** chapters lead with a credited photo where one exists (never on food places, venues, closed places or Vietnam; credit under the media).
   - **Insights:** charts use the v2 palette and tabular figures.
   - **Both:** v2 tokens only. Shots go to design/beta/eval/w8/fe-b/.
2. **Price/rating wording in record prose** (pending since W3; R6 owner-blocked ≈ +0.2). 269 places' record prose (live data) carries price or rating wording, shown verbatim in the Guidebook.
   - The beta will **label rather than strip**: where a record's prose contains price or rating wording, the Guidebook and detail show a quiet note, "Prices and ratings are quoted from the source at the time of research (<date>)".
   - The data stays untouched (live pipeline, out of scope).
   - Record it as **D-39 (proposed; the owner may veto: the alternative is stripping)** in docs/BETA-DECISIONS.md.
   - A test checks that every such record shows the note and that no record without such wording does.
3. **Type rebuild residue** (R6 gap #3), on the landing, hubs, Guidebook and Insights:
   - only the shipped weights render;
   - ≤ 5 rendered steps between 12 and 17 px;
   - no single-word last lines in deks, stat lines or rail subtitles at 390 and 1440 (`text-wrap: balance/pretty` or copy);
   - hero sizes ≥ 40 px use the higher optical size;
   - your CSS has ≤ 12 distinct raw font sizes and ≤ 4 raw radii (tokens instead).
4. **`design/beta/DESIGN-SYSTEM.md` documents what ships** (R6 D7 ◐): the v2 palette (D-37), Bricolage Grotesque + Inter, the type scale, radii, the 3-step elevation, motion tokens (`--dur-grow`), the card anatomy and the credit rules. Remove what no longer ships.
5. **"What changed" pages** (R6 gap #4): bottom-bar labels ≥ 4.5:1 in light and targets ≥ 44 px on all 84 pages (`beta:metrics:all` B-23/B-20). Confirm, and fix if still open.

### Lane imagery (Wikimedia Commons via GitHub Actions)

1. **Coverage.** Credited photos for the places a visitor sees first.
   - In priority order: for every city guide (not Vietnam), the lead card, then the first rail row, then the remaining tier-1 open sights.
   - Never food places, venues or closed places.
   - High-confidence Commons matches only, with the same refusals (signage, close-ups, equipment, winter/overcast heroes) and one file per row.
   - Aim for every non-Vietnam city's first screen to be photographic where an honest match exists. A stated gap is fine.
   - Report coverage per city before and after.
2. **Weight.** New files go through recompress on the runner. Report the Tokyo, Cleveland and New York first-load transfer (desktop and phone@3×) after the run, and keep it ≤ 2.0 MB.
3. After each Actions run, tell the orchestrator. The orchestrator reviews a contact sheet of every new photo.
