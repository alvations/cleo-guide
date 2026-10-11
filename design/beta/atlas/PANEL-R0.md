# Atlas review panel: round 0

- **Head scored:** `965b7a5cb091097b10bc1fabb3eacaefdb491ae2`, pinned in a clean worktree.
- **Panel:** eight simulated composite personas played by independent review agents, not real people. Each received
  only its persona card, the rubric with its anchors (PANEL.md §4), the tasks and the evidence pack. No panelist
  saw another's scores.
- **Evidence:** `design/beta/atlas/panel/R0/` holds `EVIDENCE.md`, the measurements, 129 shots and the front-end
  lane's probe output.
- **Raw returns:** `panel/R0/panelists/<id>.md`. Third-party source names are redacted per rule 6.
- **Probe:** `design/beta/atlas/tools/panel-probe.js`.
- **Basemap:** judged **without real tiles**. No `design/beta/atlas/real/R0/` shots existed when this round was
  scored, so every shot uses a flat stub tile. R6 scores pins, cards, the preview, controls and dark mode; they don't
  reflect how the basemap looks.

## Scores

| Panelist | R1 /15 | R2 /20 | R3 /15 | R4 /15 | R5 /15 | R6 /10 | R7 /10 | Total /100 |
|---|---|---|---|---|---|---|---|---|
| UX: product designer, map-search | 9 | 7 | 9 | 8 | 9.5 | 6.5 | 6 | **55.0** |
| FE: front-end & accessibility engineer | 9 | 7 | 8.5 | 8 | 9 | 7 | 5 | **53.5** |
| Z1: Gen Z travel creator, phone-only | 9 | 7 | 10 | 9 | 10 | 7 | 5.5 | **57.5** |
| Z2: Gen Z budget backpacker, food | 10 | 7 | 9 | 9 | 10 | 6.5 | 6.5 | **58.0** |
| X1: Gen X family trip planner | 10 | 8 | 8 | 8.5 | 9.5 | 7 | 6 | **57.0** |
| X2: Gen X business traveller | 9 | 8 | 8 | 8 | 9 | 7 | 6 | **55.0** |
| B1: Boomer wanderluster, reading glasses | 9 | 7 | 9 | 8 | 9 | 7 | 5.5 | **54.5** |
| B2: Boomer couple's planner, cautious | 10 | 9 | 9 | 8.5 | 9.5 | 7 | 5.5 | **58.5** |
| **Row mean** | **9.38** | **7.50** | **8.81** | **8.38** | **9.44** | **6.88** | **5.75** | |
| Row mean as % of row | 63 % | 38 % | 59 % | 56 % | 63 % | 69 % | 58 % | |

- **Panel score** (the mean of the eight totals): **56.1**
- **Minimum:** 53.5 (FE)
- **Maximum:** 58.5 (B2)
- **Standard deviation:** 1.73 across the eight totals (population; the sample SD is 1.85).

**Blocker findings:** none from any panelist. Every hard rule the evidence covers held:
- every place is reachable with the map, without it and with tiles blocked (488/488, 194/194, 16/16, 508/508);
- 0 page errors;
- no off-origin requests needed;
- OSM/Esri tile URLs only;
- 0 contrast failures;
- DOM nodes ≤ 3,000 (Tokyo: 2,693 on desktop, 2,616 on phone).

**First-load bytes** were measured from disk. Tokyo is 1,757 KB raw / 612 KB gzipped text on desktop and 2,045 KB raw
/ 900 KB on phone. The phone raw total exceeds 2,000 KB; the on-the-wire size with compression is lower, but this
round did not measure it on a real host. Axe was not run in this round.

**High findings, and how many panelists raised each:**
- no names on the map, and number soup: 8 of 8;
- the detail round-trip loses the map view: 8 of 8;
- near-me and the list or carousel ignoring proximity: 6 of 8;
- the deep-link pin under the panel: 5 of 8;
- the map not keyboard-reachable: 4 of 8;
- text and targets too small: 2 of 8;
- the share toast overpromising: 2 of 8.

## Findings, merged and de-duplicated, ranked by points recoverable

**How "recoverable" is computed:** the mean panel points lost to the finding, summed across rows from the panelists'
cited deductions. It's an estimate; the rows overlap a little. **Owner:** D = designer (SPEC-v3), FE = front-end
engineer. Every acceptance can be checked with `panel-probe.js` or the `ms` probe.

| # | Finding | Rows | ≈ pts | Sev. | Owner | Acceptance (testable) |
|---|---|---|---|---|---|---|
| 1 | **The map never says what's there.** Every marker is a number (Tokyo desktop: 54 of 54 numbered, 0 named). No zoom shows a name. Ranks restart per area, so "★ 2" and "★ 5" each appear twice in one view. Cluster counts and rank pills use the same digits. Clusters are heavy ink discs and outnumber pins: 38 clusters to 16 pins on Tokyo desktop, phone clusters of 156 and 90, and still 53 clusters after zooming in two steps. | R2, R1, R6 | 10.5 | High (8/8) | D + FE | **Tokyo desktop, default view:** named labels ≥ 5 (must-sees first), visible clusters ≤ 15, numbered labels ≤ 20. **Tokyo, zoomed in two steps:** named labels ≥ 10. **Labels:** no two visible pins carry the same text. **Phone first screen:** the largest cluster is ≤ 99, and ≤ 10 clusters are visible. |
| 2 | **Closing the detail doesn't return you to your place.** Opening the detail flies the map to zoom 15, and Escape or Back leaves it there (`viewKept: false` on all 4 pages × 2 viewports). On phone, the List count then drops from 437 to 16. The page scrolls about 100 px, so the filter bar hides under the header, and the list scroll moves 23–51 px. Focus falls to `<body>` on Cleveland and New York. On a `#p=` fresh load the pin sits under the 560 px panel on 7 of 8 page/viewport pairs. | R4, R5, R6, R7 | 6.5 | High (8/8) | FE | **Round-trip** (card → detail → Escape, and → Back, on 4 pages × 2 viewports): the centre is within 1 px, the zoom is identical, page `scrollY` and list scroll change by 0, the List count is unchanged, and focus returns to the opening card. **Deep link:** `pinUnderSheet: false` on all 8 pairs, and the page doesn't scroll on load. |
| 3 | **The desktop map isn't front and centre, and phone overlays eat the map.** Desktop: three bars (header, search + view switch, chips) put 208 px of chrome above the map, so the map box is 46 % of the first screen. Phone: only 64 % is clear map. The attribution chip takes a full-width slot under the chips and covers pins. Five stacked controls (+, −, locate, style, key) sit top-right, out of thumb reach, and two of them are icon-only. | R1, R5 | 6.1 | Medium | D + FE | **Desktop:** the map's clear area starts at ≤ 120 px on all four pages, and map box ≥ 55 %. **Phone:** clear map ≥ 75 %, at most 3 map controls visible, every control within the bottom 60 % of the screen or labelled, and the attribution clears every pin (covered marker centres = 0 for attribution). |
| 4 | **"Near me" isn't near.** After locate-me at Shibuya (35.6595, 139.7005) and "Eat & drink", the desktop list leads with Minato-ku, because the list stays grouped by area in a fixed order. The phone carousel leads with Isegen in Chiyoda-ku, outside the viewport, while the pill reads "List · 10". Cards show no distances. "Nearest to me" exists but locate-me doesn't apply it. | R3, R5 | 3.5 | High (6/8) | FE (+ D for the distance chip) | **Rerun T3:** the first card on desktop and the first carousel card on phone are within 1.2 km, and Nonbei Yokochō or The Bellwood are in the top 3. Every card shows a distance. The first carousel card's coordinate is inside the map bounds in 100 % of probe states. |
| 5 | **Text and targets are too small.** Card meta and "Recommended by" lines are 12–14 px. Tokyo desktop has 64 targets under 44 px on the first screen: pins 26 px tall, "Must see" badge links 88 × 28, licence links about 58 × 15. | R7 | 2.8 | High (2/8) | D + FE | **Text:** card name, why and "Recommended by" are ≥ 16 px, and no text is under 14 px except photo credits. **Targets:** pins and cluster hit areas are ≥ 44 × 44 (the visible pill may stay smaller). The first screen has 0 targets under 24 px. |
| 6 | **You can't tell a sight from a place to eat on the map.** The only difference is a faint sand fill on food pins; there's no glyph. | R2 | 2.2 | Medium | D | A sight pin and an eat & drink pin differ by a glyph or shape, not only fill. A probe-sampled pin exposes its kind in its markup and aria-label. |
| 7 | **Closed places aren't marked on the map.** The pin shows only its number with a dashed strike (Heinen's: "39"). The card and the detail are excellent. | R2, R7 | 1.9 | Medium | D + FE | A closed pin carries a visible "Closed" word or icon at every zoom where it draws, and its aria-label contains "Closed". |
| 8 | **Too many counts, and they contradict each other.** One screen can show "435 places in this map area", "53 more outside", "Show all 488", kind-chip counts, area-chip city totals and "43 places · area 1 of 13". With an area filter on, T2 showed 23, then 23 across 1 area, then 44 places · area 6 of 13. | R3 | 1.5 | Medium | D | At most 2 count strings above the first card. No count on screen contradicts another (probe: every visible count equals the in-bounds total, the filtered total or the all-places total). |
| 9 | **Phone carousel and chips.** The carousel shows one card per screen: reading three must-sees takes two swipes. The thumbnail credit is clipped ("Photo: john…"). An active "Must see ×" pill sits beside the "Must see" chip. | R5, R6 | 1.5 | Medium | D + FE | **Three names:** readable on the phone first screen after "Must see", with ≤ 1 swipe. **Credit:** no clipped text in the carousel (scrollWidth ≤ clientWidth on every credit). **Chips:** exactly one "Must see" control is visible when it's active. |
| 10 | **Places without photos read as placeholders.** Grey glyph tiles fill much of the food list; the Cleveland and New York previews show an empty photo block. | R6, R4 | 1.3 | Low | D | A no-photo card or preview uses a designed cover that matches the photo cards' height. The preview has no empty photo frame. |
| 11 | **The map is not keyboard-reachable.** The markers set `keyboard: false`, so pins and the map container are never in the Tab order, and there's no arrow-key pan. A card is the 39th Tab stop on Tokyo and the 30th on Cleveland. The search input shows no focus ring. | R7 | 1.3 | High (4/8) | FE | **Keyboard probe:** `mapFocusableAt ≥ 0` and the first pin is ≤ 12 Tab stops in. A "Skip to results" link reaches the first card in ≤ 15. Arrow keys pan the focused map and the list count follows. Enter on a pin opens its preview, and Escape returns focus to the pin. `stopsWithoutVisibleRing = 0`. |
| 12 | **Area is buried on phone.** No area chip is on the first screen; it sits behind Filters (T2 phone: `areaFound: false`). | R5, R3 | 1.0 | Medium | D | On phone, a neighbourhood can be chosen in ≤ 2 taps from the first screen, and the map fits it. |
| 13 | **The map view can't be shared, and the toast overpromises.** The URL carries no map view: a URL copied at Asakusa, zoom 15, reopens city-wide at zoom 11.5 on desktop and 10.5 on phone. The share toast still says "it opens this exact view". | R4, R3 | 0.5 | High (2/8) | FE | `#view=atlas` carries the view. Reopening a copied URL lands within 1 px and 0.1 zoom of where it was copied. The toast text matches what the link restores. |
| 14 | **The rank context in the detail is inconsistent** for one place: "No. 1 of 40", "No. 1 of 43" and "No. 1 of 24 in Chiyoda-ku" appear in different shots. | R4 | 0.3 | Low | FE | The detail's "No. n of N in <area>" uses the same N as the area's card count in every state. |
| — | **"Tonight" can't be answered from Atlas** (T1): there's no open-now or evening filter, only scattered card text. | task gap | — | — | D | Decide whether Atlas needs it. No rubric row scores it directly. |

The table recovers about 40 of the 43.9 points lost on average. The rest is spread across single-panelist notes
(see `panelists/`).

## Task outcomes (merged)

| Task | Desktop | Phone | What blocked it |
|---|---|---|---|
| T1: three must-sees, one for tonight, save two | Partly, 5 steps | Partly, 7 steps | Must-sees are read from cards, not the map. One carousel card per screen. No "tonight" signal. Saving works (the Saved count reads 2). |
| T2: half-day in one neighbourhood + lunch | Yes, 3 steps | Partly | Phone has no area chip. Lunch pins overlap and are unnamed. The counts disagree. |
| T3: best food within about 15 minutes' walk | No / partly, 3 steps | No / partly | The list is grouped by area, has no distances, and locate-me doesn't sort by nearest. The phone carousel shows a place outside the viewport. |
| T4: open, read why and by whom, check closed, come back | Partly, about 3 steps | Partly | The why, sources and closure are clear. Coming back loses the view and scroll, and on two pages the focus too. |
| T5: share a place or the current view | Partly, 2 steps | Partly | The place link works, but its pin sits under the panel. The map view isn't shareable. |
| T6: keyboard, 200 %, library blocked | Keyboard partly; 200 % yes, but cramped (41 % clear map) | — | Pins and map aren't keyboard-reachable. With the library blocked every place is listed (488/488) and there are 0 errors. |

## The orchestrator's round-0 observations, verified

| AO | Verdict | Evidence |
|---|---|---|
| AO-1 Number soup | **Confirmed, and extended.** | 54 of 54 Tokyo desktop markers are numbered and 0 named; no zoom names a place. **Extended:** ranks restart per area, so rank labels repeat in one view ("★ 2" and "★ 5" each appear twice: `tokyo-1440-light-zoomed.jpg`). A rank number doesn't identify a pin. |
| AO-2 Opens at whole-city zoom; clusters dominate | **Confirmed.** | Tokyo opens at zoom 11.5 on desktop (38 clusters, 16 pins) and 10.5 on phone (21 clusters, 5 pins). **Extended:** after two zoom steps, 53 clusters remain on desktop. Chinatown, a single area, opens at zoom 15 with no clusters, so this is a city-page problem. |
| AO-3 Three stacked bars, about 210 px | **Confirmed.** | Measured at 208 px on all four pages. The map box is 46 % of the first screen; the map is 60 % wide. |
| AO-4 The list is grouped by area, with counters everywhere | **Confirmed, and extended.** | The fixed area order is also why T3 fails: the nearest food never surfaces after locate-me. The counters also contradict each other (finding 8). |
| AO-5 Pins differ only by fill and number | **Confirmed in part, rejected in part.** | **Confirmed:** there's no kind glyph and no name, food differs by a faint fill only, and a closed pin is only a dashed, struck-through number. **Rejected:** "must-sees blend into the clusters". All eight panelists said the sun-filled "★ n" pills stand out. |
| AO-6 Phone controls, attribution, discs, credit overflow | **Confirmed.** | Five controls; the attribution chip sits at the top under the chips and covers pins; 21 clusters on the Tokyo phone first screen; the thumbnail credit is clipped ("Photo: john…"). The phone's clear map is 64 %. |
| AO-7 Card hierarchy (two-line credit, "Recommended by … +2 more", badges on the photo) | **Confirmed as observed; low weight with the panel.** | The desktop card shows a rank badge, the Must-see sticker and a heart on the photo, then a credit of up to two lines, then "Recommended by X +n more". No panelist deducted more than about 0.5 for this. Panelists valued visible sources. |
| AO-8 No real-tile evidence | **Confirmed.** | There were still no real-tile shots at round 0. R6 was scored without the basemap, and every panelist said so. |

**New findings not among the AOs:**
- the detail round-trip loses the view, scroll and focus (finding 2);
- the deep-link pin sits under the panel (2);
- near-me ignores proximity (4);
- the map isn't keyboard-reachable (11);
- the map view isn't shareable (13);
- the rank context is inconsistent (14);
- the T2 counts contradict each other (8).
