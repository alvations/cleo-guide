# Atlas review panel: round 2

- **Head scored:** `40e15601b23fb2efe2e2c711cfb5f7d92a73c674`, pinned in a clean worktree.
- **Panel:** the same eight simulated composite personas, played by independent review agents. Each saw only:
  - its persona card;
  - the rubric and anchors;
  - the tasks;
  - this round's evidence pack;
  - its own round-1 return.
- **Score moves:** any move of more than 3 points on a row cites new evidence.
- **Evidence:** `design/beta/atlas/panel/R2/`. It holds `EVIDENCE.md`, the measurements, 129 stub-tile shots, the
  front-end lane's probe (which passes) and `views/VIEWS.md`.
- **Real-tile shots:** `design/beta/atlas/real/R2/`, 114 shots made on this head (the commit's parent is `40e15601`).
  The basemap was judged on real tiles.
- **Raw returns:** `panel/R2/panelists/<id>.md`. The last section of each file is the scored return.

## Evidence erratum (issued during scoring, to all eight panelists)

The lead's evidence pack had two probe artefacts. Both were corrected mid-round, and every panelist received the
same correction:
1. **Keyboard.** The keyboard run stopped scanning 6 stops after the first card. It reported "pins and map not in the
   Tab order", which was false. A full scan shows:
   - the map is Tab stop 226 and the first pin 227 on Tokyo (205 and 206 on Cleveland), after the whole list;
   - pins carry name, kind and tier labels and visible rings;
   - Enter on a pin opens its preview, and Escape returns focus to the pin;
   - arrow keys pan the map.
2. **Search box.** "Search input has no focus ring" was false. The ring is drawn by its wrapper
   (`.spill:focus-within`). FE raised this, and the lead verified it.

Each panelist re-scored only the rows that used these facts, mostly R7, and the moves were 0 to +1.5 points. Before
the erratum the eight totals averaged 70.1; after it, 70.9. The probe is fixed for later rounds: it scans the whole Tab
order and counts a wrapper's `:focus-within` ring.

## Scores (after the erratum)

| Panelist | R1 /15 | R2 /20 | R3 /15 | R4 /15 | R5 /15 | R6 /10 | R7 /10 | Total | R1 total | Δ |
|---|---|---|---|---|---|---|---|---|---|---|
| UX: product designer, map-search | 10 | 17 | 9.5 | 7 | 11 | 7.5 | 7 | **69.0** | 63.5 | +5.5 |
| FE: front-end & accessibility engineer | 9.5 | 18 | 9 | 7 | 11.5 | 6.5 | 7 | **68.5** | 60.0 | +8.5 |
| Z1: Gen Z travel creator, phone-only | 10.5 | 17.5 | 10 | 9.5 | 12.5 | 7.5 | 6.5 | **74.0** | 66.0 | +8.0 |
| Z2: Gen Z budget backpacker, food | 12.5 | 18 | 9 | 8.5 | 11.5 | 9 | 6.5 | **75.0** | 67.5 | +7.5 |
| X1: Gen X family trip planner | 11.5 | 18 | 8 | 8.5 | 10.5 | 8 | 7 | **71.5** | 65.0 | +6.5 |
| X2: Gen X business traveller | 10.5 | 17.5 | 8 | 7.5 | 11.5 | 7.5 | 7.5 | **70.0** | 62.0 | +8.0 |
| B1: Boomer wanderluster, reading glasses | 10 | 17.5 | 9 | 7.5 | 9.5 | 8 | 6 | **67.5** | 62.0 | +5.5 |
| B2: Boomer couple's planner, cautious | 11 | 17.5 | 9 | 8.5 | 11 | 8 | 6.5 | **71.5** | 64.5 | +7.0 |
| **Row mean** | **10.69** | **17.63** | **8.94** | **8.00** | **11.13** | **7.75** | **6.75** | | | |
| Row mean as % of row | 71 % | 88 % | 60 % | 53 % | 74 % | 78 % | 68 % | | | |
| R1 row mean | 9.88 | 14.94 | 8.75 | 8.25 | 8.38 | 7.50 | 6.13 | | | |

| | Round 2 | Round 1 | Round 0 |
|---|---|---|---|
| Panel score (mean of the eight totals) | **70.9** | 63.8 | 56.1 |
| Minimum | 67.5 (B1) | 60.0 | 53.5 |
| Maximum | 75.0 (Z2) | 67.5 | 58.5 |
| SD (population / sample) | 2.47 / 2.64 | 2.28 / 2.43 | 1.73 / 1.85 |

**What moved since round 1:**
- **R5 (+2.8).** Locate-me can be tapped again. The credit is one line and the controls sit bottom-right.
- **R2 (+2.7).** Closed places are marked on the map, the dots now show kind and tier, and more names survive zooming in on phone.
- **R1 (+0.8)** and **R7 (+0.6).**
- **R4 (−0.25)** is the only row that fell. The detail round-trip is still broken, and the deep-link pin now sits under the panel on 8 of 8 pairs (7 of 8 in round 1).

**Blocker findings:** none.
- **Hard rules the evidence covers all held.** Every place is reachable with tiles or the map library blocked (488 / 194 / 16 / 508), with 0 page errors, OSM/Esri tiles only and 0 contrast failures.
- **DOM nodes** are ≤ 3,000 (Tokyo 2,644 desktop, 2,577 phone).
- **Tokyo phone first load** is 1,990 KB raw (862 KB gzipped text), measured from disk; it was over 2,000 KB raw in rounds 0 and 1.
- **Not run:** axe.
- **Other views:** no regressions (`views/VIEWS.md`).

**High findings after the erratum (number of panelists):**
- the detail round-trip and deep link lose your place: 8 of 8;
- near-me in the list or carousel ignores proximity: 6 of 8;
- the share toast overpromises: 4 of 8;
- text is 12 px: 2 of 8;
- keyboard: map reachable but about 190 stops in with no skip link: 2 of 8 (FE, B2). UX and B1 withdrew their keyboard Highs as Medium after the erratum.

**Resolved since round 1 (no panelist raises them as open):**
- the credit covering locate-me (R1 #2, High 8/8);
- closed places unmarked on the map (R1 #7);
- the phone pill and List counts disagreeing (UX);
- "@neorsd" drawn as a pin (R1 #15);
- the detail rank contradicting the list ("No. 1 of 43" now; R1 #14, partly).

## Findings, merged and de-duplicated, ranked by points recoverable

"≈ pts" is the mean panel points lost to the finding, summed across rows from the cited deductions; it is an estimate.
Owner: D = designer, FE = front-end engineer.

| # | Finding | Rows | ≈ pts | Sev. | Owner | Acceptance (testable) |
|---|---|---|---|---|---|---|
| 1 | **Closing the detail loses your place, and deep links hide the pin.** Unchanged since R1 for the round-trip; the deep link regressed. <ul><li>`viewKept: false` on 7 of 8 pairs (Tokyo z 13.5 → 15).</li><li>The desktop page scrolls, so the sticky header covers the filter row.</li><li>The list moves 23–51 px.</li><li>The phone pill drops from 351 to 15.</li><li>Focus goes to `<body>` on New York (both viewports) and Cleveland phone.</li><li>On a `#p=` fresh load the pin sits under the panel on **8 of 8** pairs (7 of 8 in R1).</li></ul> | R4, R5, R6, R7 | 6.8 | High (8/8) | FE | <ul><li>Card → detail → Escape and → Back on 4 pages × 2 viewports: the centre is within 1 px and the zoom is identical.</li><li>Page `scrollY` and list scroll change by 0, and the List count is unchanged.</li><li>Focus returns to the opening card.</li><li>`pinUnderSheet: false` on 8 of 8.</li></ul> |
| 2 | **The phone first screen is still crowded.** <ul><li>64 % of the screen is clear map, against 75 %.</li><li>The carousel shows one card per screen, so T1 needs 2 swipes.</li><li>There's no area entry on the first screen (`areaFound: false`).</li><li>At 200 %, the Key control sits under the chip row and only 38 % of the map is clear.</li><li>Map controls are icon-only, and there's no zoom ±.</li><li>The breadcrumb collides ("United States›New Y…", "Singapore›Chinato…").</li></ul> | R5, R1, R6 | 3.8 | Medium | D + FE | <ul><li>Clear map is ≥ 75 % at 390 and ≥ 50 % at 200 %.</li><li>Three must-see names are readable after "Must see" with ≤ 1 swipe.</li><li>An area or near-me choice is reachable in ≤ 2 taps from the first screen.</li><li>No control overlaps the chip row at 200 %.</li><li>Every phone map control has a visible label or text tooltip.</li><li>The breadcrumb doesn't overflow or overlap at 390 in either theme.</li></ul> |
| 3 | **Counts and filter state contradict each other.** <ul><li>"379 places in this map area", "109 more outside", "Show all 488", chip counts and "43 places · area 1 of 13" share one screen.</li><li>In T2, "23 places across 1 area" sits beside "44 places · area 6 of 13".</li><li>The detail reads "1 of 488 in this Atlas view".</li><li>"Must see" shows as a token, a pressed chip and a "Filters 1" badge at once, and narrows only to 177 of 488 places.</li><li>"Numbered to match the map" sits beside a map that has no numbers.</li></ul> | R3, R2 | 3.3 | Medium | D | <ul><li>At most 2 count strings above the first card.</li><li>Every visible count equals the in-bounds, filtered or all total.</li><li>Exactly one Must-see control is visible when it's active.</li><li>No "numbered to match the map" copy unless the map shows those numbers.</li></ul> |
| 4 | **"Near me" isn't near** (unchanged since R0). After locate-me in Shibuya plus "Eat & drink": <ul><li>The desktop list leads with Minato-ku places.</li><li>The phone carousel leads with Isegen (Chiyoda-ku) under "List · 10", and before "Eat & drink" with Imperial Palace under "List · 19".</li><li>Cards show no distances, and "Nearest to me" isn't applied.</li></ul>On the map, Nonbei Yokochō is a named pin by the location dot. | R3, R5 | 3.2 | High (6/8) | FE (+ D) | <ul><li>In T3 on both viewports, the first card is within 1.2 km, with Nonbei Yokochō or The Bellwood in the top 3.</li><li>Every card shows a distance.</li><li>The first carousel card is inside the map bounds in every probe state.</li></ul> |
| 5 | **The desktop map isn't front and centre** (unchanged since R0). There are 208 px of chrome above the map, the map box is 46 %, and the page scrolls into editorial copy under the map. | R1 | 3.1 | Medium | D + FE | <ul><li>The clear map starts at ≤ 120 px on all four pages.</li><li>The map box is ≥ 55 %.</li><li>The document doesn't scroll in Atlas.</li></ul> |
| 6 | **The dot field is dense, and must-sees don't stand out.** <ul><li>354–368 dots are drawn on the first screen.</li><li>Must-sees are 177 of 488 places (36 %), so the sun dots don't single anything out.</li><li>3 px squares are hard to tell from 3.5 px circles.</li><li>Phone pills touch (Kūya and Kabuki-za; Tai Wah and Sungei Road).</li><li>Some glyphs are wrong (Kabuki-za, a theatre, gets a castle), and many Cleveland sights still use the generic compass.</li><li>Chinatown shows 1 named pin on phone after zooming in.</li></ul> | R2, R6 | 2.5 | Medium | D | <ul><li>Food and sight dots are distinguishable by eye at 390 (designer sign-off on `real/R*/tokyo-390-light-1-default.jpg`).</li><li>No pin labels touch (label boxes ≥ 4 px apart).</li><li>Glyph matches kind for Kabuki-za and Great Lakes Brewing.</li><li>≥ 3 named pins on every page after two phone zoom steps.</li></ul> |
| 7 | **Text and targets are too small** (since R0). <ul><li>Card meta, preview, credits and "Recommended by" are 12–14 px.</li><li>Credit links are 58 × 15.</li><li>The phone "Map credits" button is 20 × 20.</li><li>There are 26 targets under 44 px on the Tokyo desktop first screen. Pins have a 44 px hit area through `::before`.</li></ul> | R7 | 2.1 | High (2/8) | D + FE | <ul><li>Name, why and sources are ≥ 16 px, and nothing is under 14 px except photo credits.</li><li>Every interactive target is ≥ 44 × 44, or has a hit area that size, with 0 under 24 px.</li></ul> |
| 8 | **Places without photos look like placeholders.** The preview has an empty 170 px cover, and whole food rows and the first Cleveland and Chinatown carousel cards are glyph tiles. | R6, R4 | 1.8 | Low | D | A no-photo card or preview uses a designed cover (typography or a map crop), with no empty frame. |
| 9 | **The keyboard path to the map is long.** The map and pins work by keyboard, but they come about 190 stops after the first card, with no skip link. The DOM order (map last) disagrees with the visual order (map first). | R7 | 0.6 | Medium (High for FE and B2) | FE | <ul><li>A skip link in the first 10 stops reaches the first pin in ≤ 12 stops.</li><li>`tabsToFirstCard` ≤ 20.</li></ul> |
| 10 | **The map view can't be shared, and the toast overpromises** (since R0). | R4 | 0.5 | High (4/8) | FE | `mapViewInUrl: true`: a reopened link lands within 0.002° and the same zoom, and the toast copy matches what the link restores. |
| 11 | **Numbering is inconsistent in the detail.** For Sensō-ji: card 4, "pin 4", "No. 21 of 44 in Taitō-ku", "257 of 488 in this Atlas view". | R4 | 0.3 | Low | FE | One rank system per screen, and every number shown can be found on the map or in the list. |
| 12 | **Focus rings render as broken brackets** on the carousel title, and double up on the desktop card and title. | R6 | 0.3 | Low | FE | Each focused element shows one continuous ring. |
| 13 | **Selecting a pin scrolls the desktop list to the footer, not the card** (`real/R2/tokyo-1440-light-3-pin.jpg`). | R4 | 0.15 | Low | FE | After a pin click, the selected card is fully in the list viewport. |
| 14 | **The recommender is unclear or truncated.** "Recommended by Asked for by name", and phone cards cut off the recommender ("Wikipedia …"). | R7 | 0.15 | Low | D | The recommender name is never truncated on cards, and every recommender label names a source. |
| — | **"Tonight" can't be answered from Atlas.** The guide states that it holds no verified opening hours. | task gap | — | — | D | The product decides; no rubric row scores it directly. |

The table recovers about 28.6 of the 29.1 points lost on average.

**Process note (FE; verified by the lead).** Two front-end-lane probe checks still pass while the panel measures a failure:
- "preview → place detail (view kept)" covers only the preview path, while the card path loses the view;
- "#view=atlas&p= opens the detail with the place on the map" passes while `pinUnderSheet` is true on 8 of 8.

The R1 credit/locate false pass is genuinely fixed.

## Task outcomes (merged)

| Task | Desktop | Phone | Change since round 1 |
|---|---|---|---|
| T1: three must-sees, one for tonight, save two | Yes, 5 steps; must-sees read off the map | Partly, 7 steps: one-card carousel, duplicate Must-see controls | Unchanged structure; must-sees easier to read. "Tonight" still unanswerable. |
| T2: half-day + lunch | Yes, 3 steps; lunch pins are named next to the sights | Partly: no area chip | Unchanged. The counts still contradict each other. |
| T3: food within about 15 minutes' walk | Partly: the answer is on the map, the list leads elsewhere | Partly: locate is tappable again, the carousel is off-map | Phone locate fixed; the list is unchanged. |
| T4: open, why and by whom, closed?, come back | Partly: closure clear in card, detail and now on the map | Partly | The closed pin is labelled. The return still loses the view. |
| T5: share | Partly: the pin is under the panel on 8 of 8 | Partly | Deep-link pin regressed on Tokyo desktop. |
| T6: keyboard, 200 %, library blocked | Keyboard: complete but long (after the erratum). 200 %: 38 % clear, controls collide. Library blocked: yes | — | 200 % improved from 34 % to 38 % clear map. |
