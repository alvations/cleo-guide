# Atlas review panel: round 3

- **Head scored:** `537cfb8c65524a8da72a5fb4f2824bb084cfe399`, pinned in a clean worktree.
- **Panel:** the same eight simulated composite personas, played by independent review agents. Each saw only:
  - its persona card;
  - the rubric and anchors;
  - the tasks;
  - this round's evidence pack;
  - its own round-2 return.
- **Score moves:** any move of more than 3 points on a row cites new evidence.
- **Evidence:** `design/beta/atlas/panel/R3/`. It holds `EVIDENCE.md`, the measurements, 129 stub-tile shots, the
  front-end lane's probe (which passes), `views/VIEWS.md` and one lead check in `lead/`.
- **Real-tile shots:** `design/beta/atlas/real/R3/`, 112 shots made on exactly this head (`real/R3/SHOT-SHA.txt`). The
  basemap was judged on real tiles.
- **Raw returns:** `panel/R3/panelists/<id>.md`. Each file holds the first return and the erratum reply; the last
  section is the scored return.

## Evidence erratum (issued during scoring, to all eight panelists)

The pack said "the document doesn't scroll". That was true only of the window, and only at load. Three panelists
saw otherwise in the shots, and the lead measured it on all four desktop pages:
- Opening a place's detail from a list card shifts the whole Atlas layout up 108 px inside its container. The map's
  top moves from 108 px to 0, the search and filter bar goes under the header, and the offline-download panel slides
  in at the bottom.
- It stays that way after Escape or Back, and after a wheel scroll over the list. Tab-focusing a card does the same.
- `window.scrollY` stays 0, and the map view itself is kept (`viewKept` true).

Every panelist got the same text and re-scored only the rows that relied on the old fact.
- **Six said "none".** UX, Z1, Z2, X1, X2 and B2 had already seen the shift in the shots and deducted it once. Several
  reworded their evidence from "page scroll" to "container shift".
- **B1** had counted only the keyboard case. Its R4 went from 12.5 to 11.5 (total 75 → 74).
- **FE** wrote "none", but its R4 went from 12.5 to 13.5 (total 79.5 → 80.5). Its first return had deducted the
  shift in both R4 and R6; the reply scores it once, in R6.

The eight totals averaged 80.7 both before and after the erratum. The panel's probe now also measures the map's top
after each round-trip (see "Process notes").

## Scores (after the erratum)

| Panelist | R1 /15 | R2 /20 | R3 /15 | R4 /15 | R5 /15 | R6 /10 | R7 /10 | Total | R2 total | Δ |
|---|---|---|---|---|---|---|---|---|---|---|
| UX: product designer, map-search | 13 | 17 | 11.5 | 13 | 12 | 5.5 | 7 | **79.0** | 69.0 | +10.0 |
| FE: front-end & accessibility engineer | 14 | 18 | 10.5 | 13.5 | 12 | 5 | 7.5 | **80.5** | 68.5 | +12.0 |
| Z1: Gen Z travel creator, phone-only | 13.5 | 18 | 12 | 13 | 13.5 | 6 | 7 | **83.0** | 74.0 | +9.0 |
| Z2: Gen Z budget backpacker, food | 14 | 17.5 | 11.5 | 12.5 | 11.5 | 8 | 7 | **82.0** | 75.0 | +7.0 |
| X1: Gen X family trip planner | 14 | 18 | 12 | 13.5 | 11 | 7 | 7.5 | **83.0** | 71.5 | +11.5 |
| X2: Gen X business traveller | 13.5 | 17.5 | 12 | 13 | 11.5 | 6 | 7.5 | **81.0** | 70.0 | +11.0 |
| B1: Boomer wanderluster, reading glasses | 13 | 17.5 | 9.5 | 11.5 | 9.5 | 7 | 6 | **74.0** | 67.5 | +6.5 |
| B2: Boomer couple's planner, cautious | 14 | 17.5 | 12 | 13 | 13 | 6.5 | 7 | **83.0** | 71.5 | +11.5 |
| **Row mean** | **13.63** | **17.63** | **11.38** | **12.88** | **11.75** | **6.38** | **7.06** | | | |
| Row mean as % of row | 91 % | 88 % | 76 % | 86 % | 78 % | 64 % | 71 % | | | |
| R2 row mean | 10.69 | 17.63 | 8.94 | 8.00 | 11.13 | 7.75 | 6.75 | | | |

| | Round 3 | Round 2 | Round 1 | Round 0 |
|---|---|---|---|---|
| Panel score (mean of the eight totals) | **80.7** | 70.9 | 63.8 | 56.1 |
| Minimum | 74.0 (B1) | 67.5 | 60.0 | 53.5 |
| Maximum | 83.0 (Z1, X1, B2) | 75.0 | 67.5 | 58.5 |
| SD (population / sample) | 2.86 / 3.06 | 2.47 / 2.64 | 2.28 / 2.43 | 1.73 / 1.85 |

**What moved since round 2:**
- **R4 (+4.9).** The detail round-trip keeps the view on 8 of 8 pairs (it was 1 of 8). Focus returns to the opening
  card on 8 of 8. On a deep link the pin sits clear of the panel on 8 of 8 (it was 0 of 8).
- **R1 (+2.9).** The desktop map starts 108 px from the top (it was 208) and is 64 % wide, with one bar for search,
  chips and sort.
- **R3 (+2.4).** Locate-me now sorts the list and the carousel by "Nearest to me", with a distance on every card.
- **R5 (+0.6)** and **R7 (+0.3)**, the latter from skip links and the map at Tab stop 28.
- **R2 (0.0).**
- **R6 (−1.4)** is the only row that fell, because of the new desktop header (finding 5).

**Blocker findings:** none.
- **Hard rules the evidence covers all held.**
  - Every place is reachable with tiles or the map library blocked (488 / 194 / 16 / 508), with 0 page errors.
  - Tiles are OSM/Esri only, and there are 0 contrast failures.
- **DOM nodes** are ≤ 3,000 (Tokyo 2,643 desktop, 2,604 phone).
- **Tokyo phone first load** is 2,028 KB raw (873 KB gzipped text), measured from disk. It is above 2,000 KB again;
  it was 1,990 in round 2.
- **Not run:** axe.
- **Other views:** no regressions (`views/VIEWS.md`, compared with round 2's head).

**High findings after the erratum (number of panelists):**
- the desktop header renders partly off-screen and overlaps the bar: **8 of 8**;
- the desktop Atlas layout shifts 108 px after a card focus or a detail, and stays shifted: 5 of 8 (UX, FE, Z1, Z2,
  B2);
- text is 12 px: 1 of 8 (FE);
- planning a half-day around one neighbourhood only half-works: 1 of 8 (X1);
- process: the front-end probe passes checks the panel fails: FE (see "Process notes").

**Resolved since round 2 (no panelist raises them as open):**
- closing the detail loses your place, and deep links hide the pin (R2 #1, High 8/8). The layout part of it remains
  as finding 7;
- "near me" isn't near (R2 #4, High 6/8);
- the desktop map isn't front and centre (R2 #5);
- the keyboard path to the map is long (R2 #9): there are skip links at stops 1–3, the map is stop 28 and the first
  pin 29;
- the map view can't be shared, and the toast overpromises (R2 #10, High 4/8);
- focus falling to `<body>` after closing the detail on New York and Cleveland phone.

## Findings, merged and de-duplicated, ranked by points recoverable

"≈ pts" is the mean panel points lost to the finding. It is summed across rows from the cited deductions and is an
estimate. Owner: D = designer, FE = front-end engineer.

| # | Finding | Rows | ≈ pts | Sev. | Owner | Acceptance (testable) |
|---|---|---|---|---|---|---|
| 1 | **The phone first screen is still crowded.** <ul><li>63 % of the screen is clear map, against 75 %. The chip row, credit chip, List pill and a one-card carousel cover the rest.</li><li>The carousel shows one card per screen, so T1 needs 2 swipes.</li><li>There's no area entry on the first screen (`areaFound: false`; `.area-btn` is hidden under 1024 px).</li><li>At 200 % only 35 % of the map is clear (38 % in R2), and the Key control sits under the chip row.</li><li>Map controls are icon-only, and there's no zoom ± (B1).</li><li>Picking a chip scrolls the chip row so the search button is clipped at the left edge.</li><li>The share toast covers Directions.</li></ul> | R5, R1, R7 | 4.5 | Medium | D + FE | <ul><li>Clear map is ≥ 75 % at 390 and ≥ 50 % at 200 %.</li><li>Three must-see names are readable after "Must see" with ≤ 1 swipe.</li><li>An area control is visible on the 390 first screen (`T2-*-m.areaFound: true`).</li><li>No control overlaps the chip row at 200 %.</li><li>Every phone map control has a visible label or text tooltip.</li><li>Selecting a chip leaves the search button fully visible.</li></ul> |
| 2 | **Counts, numbers and filter state contradict each other.** <ul><li>The default view shows "359 places in this map area", "129 more outside this area. Show all 488", city-total area-chip counts and "43 places · area 1 of 13".</li><li>T2 adds "23 places across 1 area" over "44 places · area 6 of 13". T4 shows "87", "39 of 194", "No. 39 of 42" and "40 of 87".</li><li>One "Must see" shows as a token, a pressed chip, a "Filters 1" badge and a banner. It narrows only to 141 of 488, because 177 of 488 places are must-sees.</li><li>The detail says "pin 4" and "pin 39", but no pin shows a number. Sensō-ji carries card 4, "pin 4", "No. 4 of 44 in Taitō-ku" and "257 of 488 in this Atlas view".</li><li>Rank badges (3, 32, 29, 20) stay on cards under "Nearest", and "★ 3" reads as a rating.</li><li>`cities/tokyo.html` still says "Numbers on the cards match the pins on the map".</li></ul> | R3, R2, R4, R5, R6 | 2.9 | Medium | D (+ FE) | <ul><li>At most 2 count strings above the first card in the default, T2 and T4 desktop states.</li><li>Exactly one Must-see indicator is visible when it's active.</li><li>No "pin N" text, and no "numbers match the pins" copy, while the map shows no numbers.</li><li>The T5 detail shows exactly one rank number for Sensō-ji.</li><li>No rank badge under "Nearest".</li></ul> |
| 3 | **Text and targets are too small** (since R0). <ul><li>Card, preview, credit and map-control text has a 12 px minimum, and the card median is 12 px.</li><li>There are 31 targets under 44 px on the Tokyo desktop first screen, 6 of them under 24. They include credit links (58 × 15) and the search input (284 × 25 inside a 44 px pill).</li><li>The phone "Map credits" button is 20 × 20.</li><li>Pins have a 44 px hit area through `::before`.</li></ul> | R7, R4, R2 | 2.5 | High (1/8) | D + FE | <ul><li>`fontSizes.card` median ≥ 16 and min ≥ 14 in every state; preview min ≥ 14.</li><li>`targets.under24` is 0 on every first screen, and every non-pin target is ≥ 44 × 44 or has a hit area that size.</li><li>The search input's hit area is its 44 px pill.</li></ul> |
| 4 | **The dot field is dense, and pins have small errors.** <ul><li>330–354 dots are drawn on the first screens and read as confetti on the light phone map.</li><li>Must-sees are 36 % of places, so the sun dots don't single anything out.</li><li>Kabuki-za, a theatre, gets a castle glyph. Many Cleveland sights (Free Stamp, The Arcade, Great Lakes Brewing) use the generic compass.</li><li>After two phone zoom steps, Cleveland names 4 pins and Chinatown 1.</li><li>At overview zoom, a closed place is only a small slashed dot.</li><li>The you-are-here dot is half hidden under the Chūkamen-ten Kiraku label in T3.</li><li>Phone pills nearly touch (Kūya and Kabuki-za, about 13 px apart).</li></ul> | R2, R6, R3 | 2.4 | Medium | D | <ul><li>Food and sight dots are distinguishable by eye at 390 (designer sign-off on `real/R*/tokyo-390-light-1-default.jpg`).</li><li>The glyph matches the kind for Kabuki-za, Great Lakes Brewing and Free Stamp.</li><li>≥ 3 named pins on every page after two phone zoom steps.</li><li>No label box overlaps the locate marker, and pin label boxes are ≥ 4 px apart.</li></ul> |
| 5 | **The desktop header renders partly off-screen** (new this round). <ul><li>At 1024, 1280 and 1440 px the Gallery / Atlas / Guidebook / Insights buttons sit at y = −17 px, so their top 17 of 44 px is clipped.</li><li>The switch's 98 px pill covers the 56 px header and the bar. It washes out Area and Filters, and clips the active "Must see ×" and "Taitō-ku ×" tokens.</li><li>"How we choose" wraps to 2–3 lines.</li><li>The breadcrumb is cut or overprinted on desktop and phone ("Japan › To…", "ited StatesCle…", "‹ Japan› T…").</li><li>On New York, "The Metropolitan Museum of Art (official)" runs into the next card's "+1 more".</li><li>The Gallery view's header is unaffected.</li></ul> | R6, R5, R7, R1 | 1.9 | **High (8/8)** | FE + D | <ul><li>At 1024, 1280 and 1440, every view-switch button has `top ≥ 0` and `bottom ≤` the header's bottom, and the switch doesn't intersect the bar.</li><li>Active filter tokens don't intersect the header.</li><li>"How we choose" is one line.</li><li>The breadcrumb reads "Japan › Tokyo" and "United States › Cleveland" in full at ≥ 1280, and no breadcrumb glyphs overlap at 390, in either theme.</li><li>No card's recommender line overlaps the next card.</li></ul> |
| 6 | **Places without photos look like placeholders.** <ul><li>The preview has an empty 170 px cover. The new kind word ("Wagashi", "Teishoku") sits unpadded in its top-left corner.</li><li>Whole result pages are glyph tiles: all four Taitō-ku lunch cards, all four near-me cards, and the first Cleveland and Chinatown carousel cards.</li></ul> | R6, R4 | 1.8 | Low | D | <ul><li>A no-photo card or preview uses a designed cover (typography or a map crop), with no empty frame.</li><li>Or the cover is ≤ 64 px tall, with the kind word inset ≥ 12 px.</li></ul> |
| 7 | **The desktop Atlas layout shifts 108 px and stays shifted** (the erratum). <ul><li>It happens after a card focus, a card → detail, or Share, on all four pages.</li><li>The search bar and chips go under the header, the + zoom button and the count line are cut, and the offline panel slides in.</li><li>Escape, Back and a wheel scroll don't undo it. `html` and `body` are `overflow:hidden` in Atlas, so a mouse user can't scroll it back.</li><li>The map view itself is kept. Panelists deducted it once each, which keeps ≈ pts low, but 5 of 8 rate it High.</li></ul> | R4, R6, R1, R7 | 1.3 | **High (5/8)** | FE | <ul><li>After `keyboard-*` card focus, card → detail → Escape and → Back (every `d-roundtrip`), and Share on all four pages: the map's top stays at 108 px, and the search input's top is ≥ 56 px and visible.</li><li>Every ancestor of the map has `scrollTop` 0.</li><li>The offline panel never enters the Atlas first screen.</li></ul> |
| 8 | **Counts and cards go stale against the map.** <ul><li>After two phone zoom steps the pill still reads "List · 351" with 45 dots in view, and the carousel still leads with Imperial Palace East Gardens, now off the map.</li><li>A fresh `#view=atlas&p=` load at z 15 says "450 places in this map area".</li><li>A reopened shared Asakusa view leads the phone carousel with Imperial Palace East Gardens (about 5 km away). The desktop list includes Usagiya and Yanaka Ginza, 0.4 and 0.9 km past the map's edge.</li></ul> | R3, R5, R4 | 1.1 | Medium | FE | <ul><li>`m-light-zoom2.countLine` equals the places in view, or reads as stale until "Search this area".</li><li>The `d-deeplink` count is ≤ the places inside the z 15 bounds.</li><li>The first carousel card and every desktop list card are inside the visible bounds on a fresh `#view=atlas&at=35.7148,139.7967,15` load.</li></ul> |
| 9 | **Focus rings render as broken brackets** on the phone carousel title, and double up on the desktop card and title. | R6, R4 | 0.4 | Low | FE | Each focused element shows one continuous ring. |
| 10 | **Selecting a pin scrolls the desktop list to the footer, not the card** (Rengatei in `real/R3/tokyo-1440-light-3-pin.jpg` and `-dark-3-pin.jpg`; unchanged since R2). Cleveland and New York scroll to the card. | R4 | 0.3 | Low | FE | After a pin click on real tiles, the selected card is fully in the list viewport. |
| 11 | **Planning around a place, not only around me.** <ul><li>"Nearest" ranks only from your own location, with no "near this place".</li><li>The list is nearest-first, not best-first, and has no walking-time cut-off.</li><li>Desktop near-me cards show metres but not minutes.</li><li>Cleveland's "University Circle & East Side" chip is a region, so "Eat & drink" leads with places at its far west edge.</li><li>"Your day here · 6 stops" appears only after a group's cards.</li></ul> | R3 | 0.1 | High for X1 | D | <ul><li>From a detail, "Food nearby" lists places by walking time, each with "N min walk", within 2 taps.</li><li>A University Circle chip plus "Eat & drink" lists only places within 1.2 km of its centre.</li><li>Desktop near-me cards show walking minutes.</li></ul> |
| 12 | **The recommender is unclear or truncated.** Cleveland's No. 1 reads "Recommended by Asked for by name", and phone cards cut the recommender off ("Wikipedia …"). | R7 | 0.1 | Low | D | The recommender name is never truncated on cards, and every recommender label names a source. |
| 13 | **Fractional-zoom tile seams.** New York at z 12.5 shows straight seams between tiles on stub and real tiles. | R6 | 0.1 | Low | FE | No visible tile seams at the default zoom on any page. |
| 14 | **Card Tab order.** Inside a card, Tab reaches the photo-licence links before Save and the place name. | R7 | < 0.1 | Low | FE | The first Tab stop inside each card is its title link. |
| — | **"Tonight" can't be answered from Atlas.** There's no open-now chip or signal. This was Z2's top fix. | task gap | — | — | D | The product decides; no rubric row scores it directly. |

The table recovers about 19.3 of the 19.3 points lost on average.

## Process notes

- **The front-end lane's probe passes checks the panel fails** (FE; verified by the lead):
  - "No document scroll" and "card → detail → Escape keeps the view" pass while the layout shifts 108 px. They read
    `window.scrollY` and the map view only.
  - "First screen ≥ 70 % map" passes on the map box (92 %), while the clear map is 63 % against the rubric's 75 %.
- **The panel probe's "[off-screen]" tag on pin stops was a probe artefact** (raised by FE and B2).
  - A pin's anchor element is 0 × 0, so the on-screen test failed. Its visible pill is the first child.
  - The lead focused the first three Tokyo pins at 1440. Each pill was fully on screen, `:focus-visible` matched, and
    it drew a 2 px dark outline (`panel/R3/lead/tokyo-1440-pin-keyboard-focus*.jpg`; `tools/pin-focus-check.js`).
  - The probe now uses the first child's rect when the anchor is 0 × 0. No score used the tag.
- **The panel probe now checks the layout on every round-trip** (`layoutKept`). It records the map's top, the search
  input's top and the largest `scrollTop` on any ancestor of the map. A re-run on this head reproduces the erratum on
  Tokyo desktop: the map's top goes from 108 px to 0, the search input from 69 px to −39, and an ancestor scrolls
  108 px, after both Escape and Back. Tokyo phone is unchanged (`panel/R3/lead/layout-check.json`).

## Task outcomes (merged)

| Task | Desktop | Phone | Change since round 2 |
|---|---|---|---|
| T1: three must-sees, one for tonight, save two | Partly, 5 steps. Must-sees read off the map, and saving two works. | Partly, 7 steps: one-card carousel, duplicate Must-see controls. | Unchanged. "Tonight" is still unanswerable. On desktop the "Must see ×" token is clipped under the header. |
| T2: half-day + lunch | Yes in Tokyo, 3 steps (Taitō-ku 44 → Eat & drink → 23). Partly in Cleveland: the area chip is a whole region. | Partly: no area chip, so the results stay city-wide. | Unchanged. The counts still contradict each other. |
| T3: food within about 15 minutes' walk | **Yes, 3 steps.** "Nearest to me" leads with Nonbei Yokochō at 90 m, and every card shows a distance. | **Yes, 3 steps**, with "90 m · about 1 min walk". | Fixed. Snags: nearest isn't best, rank badges stay on the cards, and the location dot is under a label. |
| T4: open, why and by whom, closed?, come back | Yes, 3 steps. The closure shows on the card, the detail and the pin. The view, list scroll and focus are kept, but the layout stays shifted 108 px (B1: "mostly yes"). | Yes. | The return keeps the view (it was lost in R2). |
| T5: share | **Yes, 2 steps.** The link carries `&at=` and reopens within 0.00002° at the same zoom, with the pin beside the panel. The toast is true. | **Yes**, but the reopened carousel leads with a place out of view. | Fixed. |
| T6: keyboard, 200 %, library blocked | Keyboard: yes. Skip links, the map at stop 28, a ring on every stop (pins verified by the lead), arrow-key pan, Enter/Escape round-trip. The view switch is clipped, and a card focus shifts the layout. 200 %: 35 % clear, and Key sits under the chips. Library blocked: yes. | — | Keyboard fixed. 200 % went from 38 % to 35 % clear map. |
