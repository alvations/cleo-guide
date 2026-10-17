# Atlas review panel: round 4

- **Head scored:** `7a21f2f60bffb22ce5b7c558e92b9cafba88a7fe`, pinned in a clean worktree. The orchestrator announced it for
  FE-1 and FE-2, and the designer signed it off.
- **Panel:** the same eight simulated composite personas, played by independent review agents. Each saw only:
  - its persona card;
  - the rubric and anchors;
  - the tasks;
  - this round's evidence pack;
  - its own round-3 return.
- **Score moves:** any move of more than 3 points on a row cites new evidence. No row moved by more than 3 this round.
- **Evidence:** `design/beta/atlas/panel/R4/`. It holds:
  - `EVIDENCE.md`, which lists every probe change made for this head;
  - the measurements and 136 stub-tile shots;
  - the front-end lane's probe output (PASS, 394 checks);
  - `views/VIEWS.md` (no regressions).
- **Real-tile shots:** `design/beta/atlas/real/R4/`, 172 shots made on exactly this head (`SHOT-SHA.txt`).
- **Raw returns:** `panel/R4/panelists/<id>.md`. The last section of each file is the scored return.

## Evidence erratum (issued during scoring, to all eight panelists)

**The error.** The pack said Heinen's Downtown's detail "still shows two numbers". Sighted readers see one, "No. 39 of
42 in Downtown & The Flats".
- **Where the other came from:** "42 of 194 in this Atlas view" is screen-reader-only text. It is a `span.vh`, the label
  of the detail's previous / next control, and the probe picked it up because it reads `innerText`.
- **How the lead checked:** in the DOM.

**Also clarified.** Once selected, the closed pin reads "Heinen's Downtown · Closed" in full.

**What the panelists did.** Each re-scored only the rows that used these facts.
- **Z2:** the only change, R4 13.5 → 14 (87 → 87.5).
- **Five others:** "none". X2 had already found the text was screen-reader-only before scoring.
- **B1 and B2:** "none", after a rate-limit pause.
- **Mean:** 85.25 before the erratum; the after-erratum mean is in the table.

## Scores (after the erratum)

| Panelist | R1 /15 | R2 /20 | R3 /15 | R4 /15 | R5 /15 | R6 /10 | R7 /10 | Total | R3 total | Δ |
|---|---|---|---|---|---|---|---|---|---|---|
| UX: product designer, map-search | 14 | 16 | 12.5 | 13.5 | 13 | 7 | 7 | **83.0** | 79.0 | +4.0 |
| FE: front-end & accessibility engineer | 14.5 | 17.5 | 12.5 | 13.5 | 12 | 7.5 | 7 | **84.5** | 80.5 | +4.0 |
| Z1: Gen Z travel creator, phone-only | 14.5 | 17.5 | 13 | 14.5 | 13 | 7 | 8 | **87.5** | 83.0 | +4.5 |
| Z2: Gen Z budget backpacker, food | 14.5 | 18 | 12.5 | 14 | 12 | 9 | 7.5 | **87.5** | 82.0 | +5.5 |
| X1: Gen X family trip planner | 14.5 | 18.5 | 12 | 14 | 12.5 | 8 | 8 | **87.5** | 83.0 | +4.5 |
| X2: Gen X business traveller | 14.5 | 17.5 | 13 | 14 | 12.5 | 8 | 7 | **86.5** | 81.0 | +5.5 |
| B1: Boomer wanderluster, reading glasses | 14 | 17 | 10.5 | 13 | 10 | 8.5 | 6 | **79.0** | 74.0 | +5.0 |
| B2: Boomer couple's planner, cautious | 14.5 | 17 | 13.5 | 14 | 13 | 7.5 | 7.5 | **87.0** | 83.0 | +4.0 |
| **Row mean** | **14.38** | **17.38** | **12.44** | **13.81** | **12.25** | **7.81** | **7.25** | | | |
| Row mean as % of row | 96 % | 87 % | 83 % | 92 % | 82 % | 78 % | 72 % | | | |
| R3 row mean | 13.63 | 17.63 | 11.38 | 12.88 | 11.75 | 6.38 | 7.06 | | | |

| | Round 4 | Round 3 | Round 2 | Round 1 | Round 0 |
|---|---|---|---|---|---|
| Panel score (mean of the eight totals) | **85.31** | 80.7 | 70.9 | 63.8 | 56.1 |
| Minimum | 79.0 (B1) | 74.0 | 67.5 | 60.0 | 53.5 |
| Maximum | 87.5 (Z1, Z2, X1) | 83.0 | 75.0 | 67.5 | 58.5 |
| SD (population / sample) | 2.84 / 3.03 | 2.86 / 3.06 | 2.47 / 2.64 | 2.28 / 2.43 | 1.73 / 1.85 |

**What moved since round 3:**
- **R6 (+1.4).** The desktop header is whole and the layout no longer shifts. No-photo cards are designed quote tiles.
- **R3 (+1.1).** The desktop default shows one count line plus "Show all", and "Top picks" replaced the duplicated
  Must-see controls.
- **R4 (+0.9).** The layout stays put on every round-trip. A selected pin brings its card into the list, and the
  no-photo preview is compact.
- **R1 (+0.75).** Phone clear map is 73 % (was 63 %), now that the peek bar has replaced the carousel.
- **R5 (+0.5).** 200 % zoom is 86 % clear map in the landscape layout (was 35 %).
- **R7 (+0.2).** Targets under 44 px halved (Tokyo desktop 15, was 31), but grid-card attribution is new damage (finding 7).
- **R2 (−0.25).** Must-see pins are no longer styled differently. `pp-1` has no CSS rule; the lead checked. Phone pin
  labels went from 14 to 13 px.

**Blocker findings:** none.
- **Hard rules the evidence covers all held.**
  - Every place is reachable with tiles or the map library blocked (488 / 194 / 16 / 503), with 0 page errors.
  - Tiles are OSM/Esri only, and there are 0 contrast failures.
- **DOM nodes** are ≤ 3,000 (Tokyo 2,620 desktop, 2,615 phone).
- **Tokyo phone first load** is 2,407 KB raw / 1,242 KB gzipped text, up from 2,028 / 873 in round 3.
- **New York's total** is 503 (508 in round 3); the dataset changed between the heads.
- **Not run:** axe.
- **Other views:** no regressions (`views/VIEWS.md`, compared with round 3's head).

**High findings after the erratum (number of panelists):**
- desktop grid cards cut the recommender to one letter or nothing: **6 of 8** (UX, FE, Z2, X1, X2, B1). New this round;
- planning a half-day around a neighbourhood only half-works: 1 of 8 (X1; carried from R3);
- the selection can't be seen on no-photo grid cards: 1 of 8 (FE);
- text is 12 px: 1 of 8 (FE; carried).

**Resolved since round 3 (no panelist raises them as open):**
- the desktop header rendering partly off-screen (R3 #5, High 8/8);
- the 108 px layout shift (R3 #7, High 5/8): `layoutKept` on 8 of 8;
- duplicate Must-see controls and the default screen's four count strings (part of R3 #2);
- "pin N" text, and rank badges on cards under "Nearest" (part of R3 #2);
- shared or deep-linked views listing places outside the map (part of R3 #8);
- pin select scrolling the list to the footer (R3 #10);
- phone and desktop breadcrumb collisions;
- the empty no-photo preview cover (part of R3 #6);
- the you-are-here dot under a pin label;
- 200 % zoom crowding (R3 #1, part).

## Findings, merged and de-duplicated, ranked by points recoverable

"≈ pts" is the mean panel points lost to the finding. It is summed across rows from the cited deductions and is an
estimate. Owner: D = designer, FE = front-end engineer.

| # | Finding | Rows | ≈ pts | Sev. | Owner | Acceptance (testable) |
|---|---|---|---|---|---|---|
| 1 | **The phone still hides names and area, and its chrome moves.** <ul><li>73 % of the screen is clear map, against 75 %. The header, the view-switch row and the chip row take 152 px.</li><li>No name is readable on the first screen. The list opens on a full-width lead card, so three names take a scroll (`T1-m`).</li><li>There is no area control on the first screen (`areaFound: false`); Area sits behind Filters at the end of the chip row.</li><li>After a zoom, the view switch, chips, peek and List control all disappear until the map settles. Selecting a pin removes the view-switch row and adds a mid-map List pill.</li><li>Opening a place from the list and pressing Escape lands on the map, not the list (`m-roundtrip.listOpenedFirst`).</li><li>Map controls are icon-only, with no zoom ±. At 200 % the view switch and Filters are icons too (B1, B2).</li><li>The first load is 2,407 KB raw (FE).</li></ul> | R5, R1, R3, R7 | 3.6 | Medium | D + FE | <ul><li>Clear map ≥ 75 % at 390.</li><li>At least 3 names readable after "Show list" without scrolling.</li><li>`T2-*-m.areaFound: true` within 1 tap.</li><li>After two zoom steps, `m-light-zoom2.mapControls` still includes a list control, and the chip row stays or returns within 0.3 s.</li><li>A phone round-trip opened from the list returns to the list.</li><li>Every phone map control has a visible word or text label.</li></ul> |
| 2 | **The dot field is dense and must-sees don't stand out.** <ul><li>330–388 dots on the Tokyo and New York first screens.</li><li>Only must-sees get names (7 of 359 on Tokyo desktop; 8 of 21 at z 15), and every pill is the same white. `pp-1` is unstyled, so a must-see looks like any other named pin under Eat & drink or Near me.</li><li>"Top picks" fits to day-trip outliers (Kamakura, Shibamata), so the central picks pile up: Yasukuni over Imperial Palace East Gardens.</li><li>A selected label covers its neighbour (Shibuya Scramble Crossing over Hachikō).</li><li>Phone pin labels are 13 px and cut at about 15 characters.</li><li>A closed place is only a slashed dot at overview zoom.</li><li>Some Cleveland pins still use the generic compass glyph (Brewboat CLE, The Foundry).</li></ul> | R2, R6 | 2.6 | Medium | D (+ FE) | <ul><li>Must-see pins have a computed style different from other named pins (T3 state).</li><li>Labels fill free space: at z 15 every place in view with room for a label is named.</li><li>The Top picks fit excludes outliers beyond the city, and `T1-tokyo-1440-saved` has 0 label-rect intersections.</li><li>A selected label never covers another label.</li><li>Phone pin labels are ≥ 14 px, with ≤ 1 truncated on each first screen.</li><li>A glyph matches the kind for every named pin in the shots.</li></ul> |
| 3 | **Text and targets are still small** (since R0, improved). <ul><li>Card, preview, credit and map-control text has a 12 px minimum. The card median is 14 px on Tokyo desktop and 16 px elsewhere, and the preview median is 12 px.</li><li>The Tokyo desktop first screen has 15 targets under 44 px, 2 of them under 24 (31 and 6 in R3). They include the view switch (113 × 36), the search input (286 × 25) and credit links (79 × 15).</li><li>The phone "Map credits" button is 24 × 24.</li></ul> | R7, R2 | 2.0 | High (FE) | D + FE | <ul><li>`fontSizes.card` min ≥ 14 and median ≥ 16 on every page; preview median ≥ 14.</li><li>Phone pins ≥ 14 px.</li><li>`targets.under44` excluding pins is 0, or each such target has a 44 px hit area.</li></ul> |
| 4 | **Counts still disagree outside the default screen.** <ul><li>On phone after two zoom steps, the count stays at 351 (Tokyo) with 45 in view, 384 / 80 (New York) and 73 / 20 (Cleveland).</li><li>With Top picks on, the phone peek reads "488 places here" while the list reads "Top 12 picks".</li><li>"187 places here, of all 488" sits beside "Show all 225" (phone T2), and "30 places here, of all 488" beside "Show all 225" (desktop T3).</li><li>T2 adds "23 places across 1 area", and an area filter shows a token, a "Filters 1" badge and a banner.</li><li>After Near me, a "Show 11 more · Show all 47 · 36 of 47" pager sits above the first card.</li></ul> | R3, R5 | 2.0 | Medium | FE (+ D) | <ul><li>`m-light-zoom2.countLine` is within 10 % of `dotsInView`, or reads stale until "Search this area".</li><li>With Top picks on, the peek reads "Top 12 picks".</li><li>No list head shows both "of all N" and "Show all M" with N ≠ M.</li><li>An area filter shows one indicator.</li><li>No pager renders above the first card.</li></ul> |
| 5 | **Small layout defects.** <ul><li>The card focus ring is doubled: a red rim on the photo plus a black box that sits flush on the text. On Cleveland the title overlaps "Recommended by".</li><li>Card hearts paint over the sticky list head.</li><li>The active area token rides up into the header line.</li><li>The open detail pane cuts the bar to "Top" and hides Saved and the sort.</li><li>At 1024 the sort control runs off the right edge, and Cleveland and New York cards overlap their stickers and titles.</li><li>The phone toast covers the photo credit and the Must-see chip.</li><li>A tile seam shows on New York.</li></ul> | R6, R4 | 1.25 | Low | FE | <ul><li>One continuous focus ring per card, with ≥ 2 px of inner padding.</li><li>Nothing paints over the sticky list head.</li><li>Every bar control's top equals the bar's.</li><li>At 1024, 1280 and 1440 no bar control passes the viewport edge, and no card text overlaps a sticker, heart or title.</li><li>The open detail leaves Search through Sort visible, or collapses them on purpose.</li></ul> |
| 6 | **Selection is hard to see, and the preview opens on a number.** <ul><li>When a pin is selected, its no-photo grid card (most cards) shows no selected state. The list pane is pixel-identical before and after (`tokyo-1440-light-zoomed.jpg` vs `-pin-selected.jpg`).</li><li>The preview covers its own pin (`coveredCentres` 1 on every `d-light-select`).</li><li>The preview's first line reads "1 Must see within Minato-ku", which looks like a count.</li></ul> | R4, R2 | 1.1 | High (FE) | FE | <ul><li>The selected card's computed outline or shadow differs from an unselected card's, on photo and quote cards, and a pixel diff of that card is non-zero.</li><li>`coveredCentres` is 0 in every `d-light-select`.</li><li>The preview's first line reads like "Must see · No. 1 in Minato-ku", with no bare leading digit.</li></ul> |
| 7 | **Desktop grid cards cut the recommender to one letter or nothing** (new this round). <ul><li>"Recommended by W +2 more", "T. +2 more", "A. +1 more", "E..", and a blank on Chinatown (Tian Tian). At 1024 several show only "+2 more".</li><li>The lead card, the preview, the detail and the phone list show full names.</li><li>Cause, lead-verified: `#cleo-grid li.pl .pl-s .src{…overflow:hidden;text-overflow:ellipsis;white-space:nowrap}` in `assets/fe-a.css`.</li></ul> | R7, R6 | 0.9 | **High (6/8)** | FE + D | <ul><li>At 1024, 1280 and 1440, on all four pages, every visible `#cleo-grid .pl-s .src` has `scrollWidth ≤ clientWidth`, so the first recommender's full name renders (wrapping if needed).</li><li>No card shows fewer than 3 visible characters after "Recommended by".</li><li>"+N more" drops before the name is cut.</li></ul> |
| 8 | **Places without photos still dominate food results.** <ul><li>Quote cards look designed, but every visible Taitō-ku lunch card and near-me card is one.</li><li>The preview has no photo on 3–4 of 4 pages.</li><li>The no-photo detail cover is a grey box with a mini-map. On a photo cover the mini-map sits over the hero image.</li></ul> | R6 | 0.75 | Low | D | <ul><li>A no-photo detail cover is ≤ 64 px tall or a designed map crop.</li><li>The mini-map never overlaps a hero photo.</li><li>The Eat & drink peek shows at least one thumbnail when any result has a photo.</li></ul> |
| 9 | **The desktop area chip starts off-screen** in a scrolling row. A real tap could not land, so the probe used a scripted click. X1 notes that the bar's Area button opens the tray, a path no shot covers. | R3 | 0.2 | Low | FE | The area chosen in T2 is one real click from the first screen. The probe logs no scripted fallback for T2 on desktop. |
| 10 | **Planning around a place** (carried). <ul><li>"Nearest" ranks only from your own location, with no "best within 15 min".</li><li>Desktop near-me cards show metres, not minutes.</li><li>Cleveland's "University Circle & East Side" chip is a region, so lunch leads with AsiaTown.</li></ul> | R3 | 0.1 | High for X1 | D | <ul><li>From a detail, food sorted by walking time with "N min walk" is within 2 taps.</li><li>A University Circle chip plus Eat & drink lists only places within 1.2 km.</li><li>A "Best within 15 min" sort puts The Bellwood in the top 3 at the T3 spot.</li></ul> |
| 11 | **The closure box says only "source"**, where R3 named the outlets (B1). | R7 | 0.06 | Low | D | The closure line names the reporting outlet. |
| 12 | **"Recommended by Asked for by name"** on Cleveland's No. 1 (X2). | R7 | 0.06 | Low | D | Every recommender label names a source or says plainly that it is a reader request. |
| 13 | **Card Tab order.** The licence links, Save and the tier come before the place name, and "How we choose" is two stops (FE). | R7 | 0.06 | Low | FE | The first Tab stop in each card is its title, and "How we choose" is one stop. |
| — | **"Tonight" can't be answered from Atlas.** There's no open-now signal; this was Z2's and Z1's top fix. | task gap | — | — | D | The product decides; no rubric row scores it directly. |

The table recovers about 14.7 of the 14.7 points lost on average. The ≈ pts above use the after-erratum returns.

## Process notes

- **Probe changes for this head.** D-46 and rev 5 changed the controls, so the probe was adapted. Every change is listed
  in `panel/R4/EVIDENCE.md` → "Probe changes". The lead first dry-ran the probe on two pre-R4 heads so round 4 didn't
  stall.
  - **Three phone-task artefacts** were caught and fixed before panelists saw the pack: T1 saving, T2 top places and T5
    share all opened a card on the map screen, but cards now sit behind "Show list".
- **New probe checks:**
  - `header-<page>-<1440|1280|1024>`: the view switch, "How we choose" lines and breadcrumb cuts.
  - `layoutKept` on every round-trip.
  - A card-level focus ring.
- **innerText includes screen-reader-only text.** It caused this round's erratum. From now on the lead checks
  "visible" claims against a shot or computed visibility.
- **Front-end probe (FE, not lead-verified):** its "hovering a pin highlights its card" check passes on the class, not on
  what renders, while no-photo cards show no visible state (finding 6).
- **Repo gate flake (for QA):** `tools/beta/qa/test-count-lines.js` failed once during the lead's gate run on `a65b2364`.
  The Atlas Must-see line read "177 of all 488 places · Top ranked", another view's wording, at the moment of the read.
  It passed on rerun on the same commit. That commit had been pushed before the rerun.

## Task outcomes (merged)

| Task | Desktop | Phone | Change since round 3 |
|---|---|---|---|
| T1: three must-sees, one for tonight, save two | Partly, 5 steps. Must-sees are named on the map, "Top picks" gives the Top 30, saving two works. The Top picks fit piles labels. | Partly, 7 steps. No names until "Show list", one lead card per screen, and the peek says 488 while the list says Top 12. Saving two works. | The duplicate Must-see controls are gone. "Tonight" is still unanswerable. |
| T2: half-day + lunch | Yes, 3 steps in Tokyo (Taitō-ku → 23 lunch places). Partly in Cleveland (the region is too broad). The area chip started off-screen. | Partly: no area control, so the results are city-wide (187 / 21). | Counts agree on desktop. Phone is unchanged. |
| T3: food within about 15 minutes' walk | Yes, 3 steps. Nearest first with distances. Metres only, no minutes. | Yes, 3 steps, with "90 m · 1 min walk". | The location dot is clear of labels, and no rank badges show. It is still nearest-first, not best-first. |
| T4: open, why and by whom, closed?, come back | Yes, 3 steps. The closure shows a date and "Where it was". The view, layout and focus are kept. The grid card hides "by whom". | Yes, but Escape returns to the map, not the list. | The 108 px shift is fixed. |
| T5: share | Yes, 2 steps. The link carries `at=` and `p=`, and the reopened list matches the map. | Yes. The reopened peek shows Asakusa. | The out-of-view lists are fixed. |
| T6: keyboard, 200 %, library blocked | Keyboard yes: skip links, the map at stop 26, the first card at 43 (was 67), a ring on every stop. 200 % yes: 86 % clear, though the controls are icons only. Library blocked: yes. | — | 200 % improved from 35 % to 86 % clear map. |
