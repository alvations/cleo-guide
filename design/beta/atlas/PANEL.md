# Atlas map review panel: charter, rubric and loop

Owner request (2026-10-11, after W7):

> "Do a ui/UX review on the atlas map version of the beta site. The map is just way off compared to how we
> originally envisioned it and the scoring all too noisy. Make sure you do a thorough review and revising of the
> atlas map view with the ui/UX designer the front end engineer and the panel and add a few Gen Z travel bloggers and
> Gen X travel planners and Boomer wanderluster into the mix during the review and iteratively revise and review the
> atlas map feature until it meets the panels score of >=95 out of 100"

**Exit criterion:** the panel score is **≥ 95 / 100** on the same head, with no open Blocker or High finding. The panel score is the mean of the eight panelists' totals. Iterations continue until the panel score reaches 95. There is no fixed number of iterations.

Rule 6 applies to everything committed here: no third-party travel, booking, review or fashion brand names. The owner's reference is written as "the real-estate map-search pattern". The panelists are **simulated composite personas** played by review agents, not real people, and the write-ups say so.

---

## 1. What we set out to build (the original vision)

1. **The map is the product in Atlas, front and centre** (owner, 2026-10-11 11:17Z). The references are:
   - the live map-centred guide (`cleveland.html` and the other live city maps): one big calm map, area-coloured pins, a legend, a base switch and locate-me;
   - the early map-centred beta Cleveland page from Waves 0–1 (`git log -- beta/cleveland.html`, `design/beta/mockups/`).
2. **"The real-estate map-search pattern, for travel"** (owner, 14:25Z):
   - you search by moving the map;
   - the list follows the map;
   - pins are small labelled pills;
   - hover and select are in sync both ways;
   - a pin opens a preview, and the preview opens the detail;
   - on phones the map is the screen, with a card carousel.
3. **The W7 look**: modern-minimal, image-first, a unique calm palette (Bone & Oxblood + sun, D-37), Gen Z wanderlust that every generation trusts (D13).

## 2. Orchestrator's review of the current Atlas (round 0 seed; not a score)

The current state: head `badcc20d`, evidence in `design/beta/eval/w7/atlas/`. The local shots use stub tiles, because the sandbox cannot reach tile hosts (see §6 for real-tile shots).

| # | Where | What's wrong | Why it matters |
|---|---|---|---|
| AO-1 | Map, all sizes | **Number soup.** The map shows three unrelated number systems that look alike: dark cluster bubbles (2 … 156), white rank pills (23, 43, 28 …) and sun ★ pills (★ 3, ★ 7). At city zoom Tokyo shows about 60 numbered blobs and almost no places. | "The scoring is all too noisy": rank numbers are internal scores, not something a traveller scans a map for. Nothing on the first screen says *what* is there. |
| AO-2 | Map, default view | It opens at whole-city zoom, so clusters dominate and the first impression is a grid of black discs. | Progressive disclosure is missing: the map should show the best places first and reveal more as you zoom. |
| AO-3 | Desktop chrome | Three stacked bars (site header, search + view switcher, filter chips) take about 210 px before the map starts. | The map is not front and centre. Map-search layouts use one compact bar. |
| AO-4 | Desktop list | The list is grouped by area ("Chiyoda-ku · 43 places · area 1 of 13") plus an area-chip row, inside a list that is supposed to follow the map. Counters appear everywhere: "384 places in this map area", "104 more outside", "area 1 of 13", "Top ranked". | It reads like a report, not a search. It duplicates what the map already shows. |
| AO-5 | Pins | Sight, eat & drink, must-see and closed differ only in fill and number. There is no kind glyph and no name until you click. Must-see pins are the only coloured ones and blend into the clusters. | You can't tell a shrine from a ramen counter without clicking. |
| AO-6 | Phone | Five stacked map controls (+, −, locate, layers, info) plus a large attribution chip under the chips. Twenty large dark cluster discs fill the screen. The carousel credit overflows the thumbnail ("Photo: john…"). | Thumb space is wasted on controls a phone doesn't need (pinch zoom). The first screen is noise. |
| AO-7 | Cards in the map list | Every card carries a two-line photo credit and a "Recommended by … +2 more" line. Rank badge, Must-see sticker and heart all sit on the photo. | Attribution must stay visible (licence and honesty), but the card needs a quieter hierarchy so photo → name → why-it's-here reads first. |
| AO-8 | Evidence | Every screenshot so far has stub tiles, so nobody, the owner included, has reviewed the real basemap with our pins on it. | You can't judge a map's look without its map. |

These are the panel's starting observations. The panel must verify, extend or reject each one with its own evidence.

## 3. The panel (eight simulated panelists)

Each panelist reviews independently, then the panel meets (the review session merges the notes).

| Id | Who (composite persona) | What they bring | Their tasks (§5) |
|---|---|---|---|
| UX | Senior product designer, map-search and marketplace UIs | Information architecture, signal-to-noise, interaction design | All tasks; heuristic review |
| FE | Front-end and accessibility engineer | Performance, keyboard and screen-reader paths, robustness when the map or tiles fail | All tasks; probes |
| Z1 | Gen Z travel creator, 22, plans trips by saving places from short videos, phone-only | Speed, visual appeal, "is this place worth the trip", saving and sharing | T1, T2, T5 |
| Z2 | Gen Z budget backpacker blogger, 25, hunts hidden gems and food | Discovery, food, what's near me now, honest sources | T1, T3, T5 |
| X1 | Gen X family trip planner, 48, desktop at home, phone on the trip | Building a day, neighbourhood logic, opening/closed status, printing or sharing a plan | T2, T3, T4 |
| X2 | Gen X business traveller, 52, two free evenings | Fast "best things near my hotel", trust, no fluff | T1, T3, T4 |
| B1 | Boomer wanderluster, 67, retired, tablet and desktop, reading glasses | Legibility, plain labels, nothing hidden behind gestures, trust in sources | T2, T4, T6 |
| B2 | Boomer couple's planner, 72, cautious with tech, travels slowly | Clear next steps, no accidental map jumps, big targets, the closed-place warnings | T3, T4, T6 |

## 4. Rubric (100 points, anchored)

Every panelist scores every row. Anchors keep scores comparable across panelists and rounds:
- **full marks:** nothing to fix;
- **about 80 % of the row:** works, with polish gaps;
- **about 50 %:** usable but noisy or confusing;
- **about 20 %:** gets in the way.

| Row | Points | What earns full marks |
|---|---|---|
| R1 Map-first composition | 15 | The map dominates the first screen on desktop (≥ 60 % width, chrome ≤ about 120 px above it) and on phone (≥ 75 % of the first screen). Opening Atlas, you immediately see *places on a map*, not controls. |
| R2 Pin and cluster legibility (signal-to-noise) | 20 | At every zoom you can tell what's there at a glance: kind is readable (sight vs eat & drink), must-sees stand out, names appear where they fit, clusters are quiet and few, and numbers appear only where they help. No number soup. Closed places are clearly marked. |
| R3 Searching with the map | 15 | Pan or zoom updates the list honestly; "Search this area" or live search behaves predictably; filters and kind chips work with the map; "Show all" keeps every place reachable; counts are few and plain. |
| R4 Card ↔ pin ↔ preview ↔ detail | 15 | Hover and select stay in sync both ways. The preview card on the map is useful (photo, name, why, sources), and opening the detail and coming back keeps your place on the map. Deep links (`#p=`) centre the map on the place. |
| R5 Phone experience | 15 | Full-screen map, a synced carousel, the List/Map pill, minimal controls within thumb reach, no layout jumps, gestures that never hide the only path to something. |
| R6 Visual craft | 10 | A calm basemap that suits the v2 palette in light and dark; pins, cards, preview and controls look like one family; photography is used well; nothing tacky. |
| R7 Trust and access for every generation | 10 | Sources visible, closures flagged, body text ≥ 16 px, targets ≥ 44 px, AA contrast, a full keyboard path, reduced motion respected. Without the map library or tiles, every place is still listed. |

**Per-panelist output:** row scores with one evidence line each, the persona's task results (§5), the top three fixes and any Blocker or High findings.
**Panel score:** the mean of the eight totals. The report also shows the minimum, the standard deviation and the row means.

**Noise control:**
- Fixed rubric and anchors.
- The same evidence pack for every panelist in a round.
- Every point lost cites evidence.
- From round 1 on, each panelist sees their own previous scores and must justify any change of more than 3 points on a row with new evidence.
- Panelists never see the other panelists' scores before submitting.
- The panel never sees any target score.

## 5. Tasks (run on the real page in headless Chromium, desktop 1440×900 and phone 390×844)

- **T1:** Open Tokyo Atlas. Within 30 seconds, name three must-sees and find one you'd go to tonight. Save two.
- **T2:** Plan a half-day in one neighbourhood (Cleveland: University Circle; Tokyo: Asakusa or Ueno area) with lunch nearby.
- **T3:** You're at a given spot (use a fixed coordinate). Find the best food within about 15 minutes' walk.
- **T4:** Open a place from the list, read why it's recommended and by whom, check it isn't closed, and come back to the same map view.
- **T5:** Share a place or the current map view with a friend (`#p=` / `#view=atlas` link) and confirm the link reopens it.
- **T6:** Use Atlas with the keyboard only (desktop) and at 200 % zoom; then with the map library blocked.

## 6. Evidence pack for every round

- **Real-tile screenshots.** `.github/workflows/beta-atlas-real-shots.yml` runs `tools/beta/atlas-real-shots.js` on a GitHub runner, which can reach OpenStreetMap/Esri tiles. It commits the shots to `design/beta/atlas/real/<round>/`. Trigger it by editing `design/beta/atlas/SHOTS-REQUEST` (one line: the round label) or from workflow_dispatch.
- **Local interaction runs** with stub tiles (the sandbox can't reach tiles): `tools/beta/atlas-ms.js` and any panel probe in `design/beta/atlas/tools/`.
- Both use the same pages: Tokyo, Cleveland, Chinatown (Singapore) and New York, at 1440×900 and 390×844, light and dark. They cover:
  - the default view, zoomed in, a pin selected with its preview, the list following a pan, the phone carousel and list, and the detail;
  - tiles blocked, and the map library blocked.

## 7. The loop and who does what

| Role | Session | Does |
|---|---|---|
| Orchestrator | the main session | Runs the loop, keeps the log, never tells the panel a target |
| UI/UX designer | the designer lane (W7 designer, reopened) | Writes `design/beta/atlas/SPEC-v3.md` from the panel's findings, with annotated prototypes and pin, cluster and card specs; attends each review; keeps rule 6 |
| Front-end engineer | the Atlas lane | Builds the spec, keeps every gate green, writes `atlas-real-shots.js`, re-shoots the evidence pack |
| Panel | the Atlas panel session | Scores each round independently into `design/beta/atlas/PANEL-R<n>.md`, with findings ranked by points recoverable |

Each round:
1. The panel scores head H(n) into PANEL-R<n>.md.
2. The designer revises SPEC-v3 for the top findings and confirms with the FE engineer.
3. The FE engineer ships H(n+1) and the evidence pack.
4. The panel scores round n+1.
5. The loop stops at a panel score ≥ 95 with no open Blocker or High. If two rounds in a row gain < 1 point, the orchestrator reports to the owner with what is blocking.

**Must keep (hard rules; any break is a Blocker):**
- Every place reachable, with and without the map.
- Content never depends on the map library or a CDN.
- OSM/Esri no-key tiles only, no "API key required".
- No `document.write`.
- localStorage wrapped in try/catch.
- Closures flagged.
- Attribution and photo credits visible.
- The validate/test/beta:check gates green.
- Tokyo Atlas first-load transfer ≤ 2.0 MB on both viewports, with ≤ 3,000 DOM nodes.
- Axe 0 serious/critical.
