# Atlas review panel: round 1

- **Head scored:** `d8b26516b7735e4d8681456cf62b3670ac8fd24d`, pinned in a clean worktree.
- **Panel:** the same eight simulated composite personas as round 0, played by independent review agents, not real
  people. Each received only:
  - its persona card;
  - the rubric with its anchors;
  - the tasks;
  - this round's evidence pack;
  - its own round-0 return.
- **Moves:** a move of more than 3 points on a row had to cite new evidence. The only such moves were on R2 (+5.5 to
  +8.5, all eight panelists), and each cites the first-screen measurements and the real-tile shots.
- **Evidence:** `design/beta/atlas/panel/R1/` holds `EVIDENCE.md`, the measurements, 127 stub-tile shots, the
  front-end lane's probe, and the non-scoring check of the other views (`views/VIEWS.md`).
- **Real-tile shots:** `design/beta/atlas/real/R1/`, 114 shots made on this head. This round **the basemap was judged
  on real tiles.**
- **Raw returns:** `panel/R1/panelists/<id>.md`, with third-party source names redacted per rule 6.

The owner's direction arrived during this round: "take the best features from the competitors and combine them to
one-up each of them; keep iterating on the real-estate-style map-search navigation, but don't neglect the other
features". It was relayed to the orchestrator, the designer and the front-end engineer. The rubric and personas are
unchanged so the rounds stay comparable. The other views are now checked on every head (see "Other views" below).

## Scores

| Panelist | R1 /15 | R2 /20 | R3 /15 | R4 /15 | R5 /15 | R6 /10 | R7 /10 | Total /100 | R0 total | Δ |
|---|---|---|---|---|---|---|---|---|---|---|
| UX: product designer, map-search | 9 | 15.5 | 8.5 | 8 | 9 | 7 | 6.5 | **63.5** | 55.0 | +8.5 |
| FE: front-end & accessibility engineer | 9 | 14.5 | 8.5 | 7.5 | 8 | 7 | 5.5 | **60.0** | 53.5 | +6.5 |
| Z1: Gen Z travel creator, phone-only | 9.5 | 14.5 | 10 | 9 | 9.5 | 7.5 | 6 | **66.0** | 57.5 | +8.5 |
| Z2: Gen Z budget backpacker, food | 11.5 | 15 | 9 | 9 | 8.5 | 8 | 6.5 | **67.5** | 58.0 | +9.5 |
| X1: Gen X family trip planner | 11 | 15.5 | 8 | 9 | 8 | 7.5 | 6 | **65.0** | 57.0 | +8.0 |
| X2: Gen X business traveller | 9.5 | 15 | 8 | 7.5 | 8 | 7.5 | 6.5 | **62.0** | 55.0 | +7.0 |
| B1: Boomer wanderluster, reading glasses | 9 | 15 | 9 | 8 | 7 | 8 | 6 | **62.0** | 54.5 | +7.5 |
| B2: Boomer couple's planner, cautious | 10.5 | 14.5 | 9 | 8 | 9 | 7.5 | 6 | **64.5** | 58.5 | +6.0 |
| **Row mean** | **9.88** | **14.94** | **8.75** | **8.25** | **8.38** | **7.50** | **6.13** | | | |
| Row mean as % of row | 66 % | 75 % | 58 % | 55 % | 56 % | 75 % | 61 % | | | |
| R0 row mean | 9.38 | 7.50 | 8.81 | 8.38 | 9.44 | 6.88 | 5.75 | | | |

| | Round 1 | Round 0 |
|---|---|---|
| **Panel score** (the mean of the eight totals) | **63.8** | 56.1 (+7.7) |
| Minimum | 60.0 (FE) | 53.5 |
| Maximum | 67.5 (Z2) | 58.5 |
| Standard deviation (population) | 2.28 | 1.73 |
| Standard deviation (sample) | 2.43 | 1.85 |

**What drove the change.**
- **R2 rose +7.4.** Named, glyphed pins replaced the number soup on every page.
- **R6 rose +0.6.** The real basemap was judged as calm in both themes.
- **R5 fell −1.1.** The phone attribution chip now wraps to two lines and covers the locate-me control.
- The other rows moved by less than 0.5.

**Blocker findings:** none.
- **Hard rules the evidence covers held:** every place is reachable with tiles or the map library blocked, there were
  0 page errors and 0 contrast failures, only OSM/Esri tiles are used, and DOM nodes are ≤ 3,000 (Tokyo: 2,604 on
  desktop, 2,574 on phone).
- **Page weight:** the Tokyo phone first load is 2,041 KB raw / 886 KB gzipped text, measured from disk. As in round 0,
  the raw total is above 2,000 KB, and the compressed transfer on a real host was not measured.
- **Not run:** axe.

**High findings, and how many panelists raised each:**
- the detail round-trip loses the map view: 8 of 8;
- the phone attribution chip covers locate-me: 8 of 8;
- near-me and the list or carousel ignoring proximity: 6 of 8;
- the map not keyboard-reachable: 4 of 8;
- the deep-link pin under the panel: 4 of 8;
- the share toast overpromising: 4 of 8;
- text and targets too small: 2 of 8.

**Resolved since round 0.** "No names on the map, and number soup" (R0 finding 1, High 8/8) is closed. No panelist
raised it again. Tokyo 1440 now shows 0 bare-number markers, 16 named pins and 0 clusters. UX records it explicitly
as resolved.

## Findings, merged and de-duplicated, ranked by points recoverable

"≈ pts" is the mean panel points lost to the finding, summed across rows from the panelists' cited deductions. It's an
estimate. **Owner:** D = designer, FE = front-end engineer. Every acceptance can be checked with
`design/beta/atlas/tools/panel-probe.js`.

| # | Finding | Rows | ≈ pts | Sev. | Owner | Acceptance (testable) |
|---|---|---|---|---|---|---|
| 1 | **Closing the detail loses your place** (carried over from R0 #2; unchanged). Escape or Back leaves the map at z 15 on the place: `viewKept: false` on 7 of 8 pairs, and Chinatown phone "passes" only within the 0.002° tolerance after drifting about 160 m. Other symptoms: <ul><li>The page scrolls about 100 px, so the filter bar hides under the header.</li><li>On phone the pill drops from "List · 348" to "List · 15".</li><li>The New York desktop list scroll jumps to 2,193 px.</li><li>Focus falls to `<body>` on New York (both viewports) and Cleveland phone.</li><li>A `#p=` fresh load puts the pin under the panel on 7 of 8 pairs (fixed only on Tokyo desktop), and the desktop page loads scrolled.</li></ul> | R4, R5, R6, R7 | 6.0 | High (8/8) | FE | **Round-trip** (card → detail → Escape, and → Back, on 4 pages × 2 viewports): <ul><li>the centre is within 1 px and the zoom is identical;</li><li>page `scrollY` and list scroll change by 0, and the List count is unchanged;</li><li>focus returns to the opening card, never `<body>`.</li></ul>**Deep link:** `pinUnderSheet: false` on all 8 pairs, and `scrollY` is 0 after load. |
| 2 | **The phone map's top is crowded, and locate-me can't be tapped** (new regression). <ul><li>The attribution chip now wraps to two lines under the chip row and covers the locate control: a real tap lands on `leaflet-control-attribution` (`tasks.T3-m.locateCoveredBy`; visible in `real/R1/tokyo-390-light-1-default.jpg`).</li><li>Clear map fell from 64 % to 59 %, and to 34 % at 200 %.</li><li>"Search this area" overlaps the attribution.</li><li>The controls sit top-right, out of thumb reach, and two are icon-only.</li></ul> | R5, R1, R6 | 5.0 | High (8/8) | D + FE | **Attribution:** a real tap on locate-me hits the button (`locateCoveredBy: null`), and the attribution is one line of ≤ 20 px or sits behind an ⓘ. **Clear map:** ≥ 75 % at 390 and ≥ 50 % at 200 %. **Overlaps:** "Search this area" intersects no control or attribution. **Controls:** every map control's centre is at y ≥ 55 % of the viewport, or the control has a visible text label. |
| 3 | **"Near me" isn't near** (carried over from R0 #4; unchanged in the list, better on the map). After locate-me at Shibuya plus "Eat & drink": <ul><li>The desktop list leads with Minato-ku (Toraya Akasaka, Myojaku), because it stays grouped by area.</li><li>The phone carousel leads with Isegen (Chiyoda-ku) while the pill reads "List · 10".</li><li>Cards show no distances, and locate-me doesn't apply "Nearest to me".</li><li>The phone pill count goes stale after zooming: "List · 348" against 50 in List mode.</li></ul>On the map, Nonbei Yokochō is now a named pin next to the location dot. | R3, R5 | 3.8 | High (6/8) | FE (+ D for the distance chip) | **Rerun T3:** the first card on desktop and the first carousel card on phone are within 1.2 km, with Nonbei Yokochō or The Bellwood in the top 3. **Distances:** every card shows one. **Carousel:** the first card's coordinate is inside the map bounds in 100 % of probe states. **Counts:** the phone pill equals the List-mode count in every state. |
| 4 | **The anonymous dot field** (new). <ul><li>The 334 / 358 unnamed places on Tokyo are identical grey dots, with no kind, tier or must-see cue. They're dense and peppery on phone and glare in dark mode.</li><li>Zooming in on phone thins the names: after two steps, Cleveland shows 1 named pin and New York 2.</li><li>Cleveland sights mostly share one compass glyph.</li><li>Phone pills nearly touch or overlap; Yasukuni sits on the Imperial Palace label.</li></ul> | R2, R6 | 3.7 | Medium | D | **Dots:** sight and eat & drink dots differ by shape or tint at default zoom. **Phone names:** after two zoom steps, ≥ 4 named pins on every page. **Overlap:** no two pin labels overlap (covered centres = 0, including label boxes). **Glyphs:** ≥ 3 distinct sight glyphs on the Cleveland first screen. **Calm:** dot opacity in dark mode is no heavier than the basemap's road strokes (a designer sign-off on `real/R*/…-dark-1-default`). |
| 5 | **The desktop map isn't front and centre** (carried over from R0 #3; unchanged). There's 208 px of chrome above the map, and the map box is 46 % of the first screen. The page also scrolls into editorial copy under the map. | R1 | 3.2 | Medium | D + FE | The map's clear area starts at ≤ 120 px on all four pages, and the map box is ≥ 55 %. Atlas doesn't scroll the document; the list pane scrolls. |
| 6 | **Text and targets are too small** (carried over from R0 #5). <ul><li>Card meta, credits and "Recommended by" are 12–14 px; pin labels are 13 px.</li><li>The Tokyo desktop first screen has 26 targets under 44 px, down from 64. Pins are 30 px tall, and licence links are 58 × 15.</li></ul> | R7 | 2.3 | High (2/8) | D + FE | **Text:** name, why and sources are ≥ 16 px, pin labels ≥ 14 px, and nothing is under 14 px except photo credits. **Targets:** pin and badge hit areas are ≥ 44 × 44, and the first screen has 0 targets under 24 px. |
| 7 | **Closed places aren't marked on the map** (carried over from R0 #7; worse in practice). Heinen's Downtown is now an anonymous canvas dot at its deep-link zoom (`pinClassAtPlace: null`). Round 0 at least drew a struck-through pin. | R2, R7 | 1.7 | Medium | D + FE | At every zoom where a closed place is drawn, its marker shows a "Closed" word or icon, and its aria-label or title contains "Closed". The T4 probe finds a closed marker at Heinen's. |
| 8 | **Too many counts, and they contradict each other** (carried over from R0 #8). For example, "23 places in this map area", "23 places across 1 area" and "44 places · area 6 of 13" appear together, and the area-chip counts are city totals. | R3 | 1.6 | Medium | D | At most 2 count strings above the first card, and every visible count equals the in-bounds, filtered or all-places total. |
| 9 | **The phone carousel and chips** (carried over from R0 #9; the credit clipping is fixed). The carousel shows one card per screen, so reading three names takes two swipes, and an active "Must see ×" pill sits beside the "Must see" chip. | R3, R5 | 1.3 | Medium | D + FE | Three names are readable on the phone first screen after "Must see", with ≤ 1 swipe. Exactly one "Must see" control shows when it's active. |
| 10 | **Places without photos read as placeholders** (carried over from R0 #10). The preview shows an empty 170 px cover, and whole rows of food and Cleveland cards are glyph tiles. | R6, R4 | 1.6 | Low | D | A no-photo card or preview uses a designed cover (name, kind and area typography, or a map crop). There's no empty photo frame. |
| 11 | **The map isn't keyboard-reachable** (carried over from R0 #11; unchanged). `keyboard: false` is still set on the markers, so pins and the map are never in the Tab order and there's no keyboard pan. The first card is the 39th Tab stop, and the search input has no focus ring. | R7 | 1.3 | High (4/8) | FE | **Map:** `mapFocusableAt ≥ 0`, the first pin is ≤ 12 Tab stops in, and arrow keys pan the map with the list following. **Skip link:** "Skip to results" reaches the first card in ≤ 15 stops. **Pins:** Enter on a pin opens its preview, and Escape returns focus to the pin. **Rings:** `stopsWithoutVisibleRing = 0`. |
| 12 | **Area is buried on phone** (carried over from R0 #12). | R3, R5 | 0.9 | Medium | D | A neighbourhood can be chosen in ≤ 2 taps from the phone first screen (T2 phone: `areaFound: true`). |
| 13 | **The map view can't be shared, and the toast overpromises** (carried over from R0 #13). | R4 | 0.4 | High (4/8) | FE | A copied URL reopens within 1 px and the same zoom, and the toast text matches what the link restores. |
| 14 | **The detail's rank context is inconsistent** (carried over from R0 #14). It reads "No. 1 of 24 in Chiyoda-ku" on a deep link while the list says 43. | R4 | 0.25 | Low | FE | "No. n of N in <area>" uses the same N as the area's card count in every state. |
| 15 | **Small content and layout defects.** <ul><li>The Cleveland data item "@neorsd — not a place, but on the list" is drawn as a named map pin.</li><li>The phone breadcrumb is clipped or collides on Cleveland, and on New York in dark mode.</li></ul> | R6, R5 | 0.2 | Low | FE | Entries marked "not a place" are not drawn on the map. The breadcrumb fits at 390 px in both themes, with no overflow and no overlap. |

The table recovers about 33 of the 36.2 points lost on average. The rest is single-panelist notes (see `panelists/`).

**Process note: the front-end lane's acceptance probe, raised by FE and verified by the lead.**
- Two `tools/beta/atlas-ms.js` checks pass while the panel measures a failure.
  - "Preview → place detail (#p=, view kept)" checks only that the hash still carries `view=atlas`, not the map's
    centre and zoom.
  - "The OSM credit is … clear of the pill, the carousel and the chip row" doesn't test the locate control.
- These aren't product defects. Aligning those checks with the acceptances above would let the gate catch findings 1
  and 2 before a round.

## Task outcomes (merged)

| Task | Desktop | Phone | Change since round 0 |
|---|---|---|---|
| T1: three must-sees, one for tonight, save two | Yes for the must-sees, which can be read off the map; 5 steps | Partly, 7 steps: names are on the map, but there's the duplicate chip and the one-card carousel | Better: must-sees are named on the first screen. "Tonight" still can't be answered: there's no open-now signal. |
| T2: half-day in one neighbourhood + lunch | Yes, 3 steps. Named fork pills sit next to the sights. | Partly: no area chip | Better on desktop. Phone is unchanged. The counts still contradict each other. |
| T3: best food within about 15 minutes' walk | Partly: the answer is a named pin by the location dot, but the list leads elsewhere | Partly / blocked: the locate tap is intercepted | The map got better. The list didn't, and the phone regressed. |
| T4: open, read why and by whom, check closed, come back | Partly | Partly | The closure is clear in the card and detail but unmarked on the map. The return still loses the view. |
| T5: share a place or the view | Partly | Partly | Unchanged. The pin is beside the panel on the Tokyo desktop deep link only. |
| T6: keyboard, 200 %, library blocked | Keyboard partly (unchanged); 200 % cramped (34 % clear map); library blocked yes | — | 200 % is worse (41 % → 34 %). The rest is unchanged. |

## Other views: a non-scoring regression check (owner direction)

`panel/R1/views/VIEWS.md` covers Gallery, Guidebook, Insights, a place detail and Saved, for Tokyo and Cleveland at
1440 and 390, on this head against round 0's head.

**Result: no regressions.** There are 0 page errors, every place is listed (488/488 and 194/194), there's no
horizontal overflow, and the detail opens in every state. The only differences are +5 to +7 DOM nodes in Guidebook.
This check runs on every later head.
