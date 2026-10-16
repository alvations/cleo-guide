<!-- simulated composite persona; round 3 return(s), verbatim except rule-6 redactions. The LAST section is the scored return. -->
## FE
### Scores
| Row | Max | Prev | Score | Evidence for each point lost (and for any move > 3) |
|---|---|---|---|---|
| R1 Map-first composition | 15 | 9.5 | 14 | **Move +4.5.** Desktop now clears both bars, so R2's −3 and −1.5 are given back:<br>• The map starts 108 px from the top (chromeAbovePx 108, was 208).<br>• It is 64 % wide (map.wPct 64) and takes 56 / 54 % of the first screen (was 46 / 44).<br>• The first thing you see is 16 sun pins with names (tokyo-1440-light-default.jpg, real/R3/tokyo-1440-light-1-default.jpg).<br>**−1:** on phone the clear map is 63 %, against a 75 % target (mapClearPct 63 on every 390 row). The chip row, credit, List pill and one-card carousel cover the rest (tokyo-390-light-default.jpg). The broken desktop header is scored in R6. |
| R2 Pin/cluster legibility | 20 | 18 | 18 | **Plus:**<br>• Every first screen still has 0 numbered labels and 0 clusters.<br>• Every pin carries a kind glyph, and must-sees use the sun fill.<br>• Closed places are marked on the map: "Heinen's Downtown · Closed" (tasks.T4-closed.pinClassAtPlace), plus slashed dots (cleveland-390-light-pin-selected.jpg).<br>**−1:** dots still form dense, overlapping carpets in central Tokyo and Manhattan (canvas.dotsShown 343 / 354 / 330 / 340; real/R3/tokyo-390-light-1-default.jpg, real/R3/newyork-390-light-1-default.jpg).<br>**−0.5:** zooming in on phone still thins the names. Chinatown shows 1 named pin at z 18, and Cleveland shows 4 among 30 dots (m-light-zoom2 namedLabels, canvas.dotsShown).<br>**−0.5:** the "numbered to match the map" copy is gone, but numbers remain where no pin shows one:<br>• Cards, carousel and preview carry ranks ("★ 7", "37 Must see within Manhattan").<br>• The detail says "pin 39".<br>(T2-tokyo-390-lunch.jpg, real/R3/newyork-1440-light-3-pin.jpg, T4-cleveland-1440-closed-place.jpg) |
| R3 Searching with the map | 15 | 9 | 10.5 | **Plus:** R2's −2.5 is given back. Locate-me now drives the list: "Nearest to me" puts Nonbei Yokochō first at 90 m, and every card shows a distance (tasks.T3-d / T3-m listShows; T3-tokyo-390-food-near.jpg). Live search on desktop is honest after a pan (d-light-pan 27→62), and "Show all" restores every place (probe PASS).<br>**−2:** counts still stack up:<br>• Default view: "359 places in this map area", "129 more outside this area. Show all 488", city-total area chips and "43 places · area 1 of 13" (tokyo-1440-light-default.jpg).<br>• Must see adds "177 places across 13 areas" and a second "Show all" (T1-tokyo-1440-must-see.jpg).<br>• With Eat & drink, "23 places across 1 area" sits above "44 places · area 6 of 13" (T2-tokyo-1440-lunch.jpg).<br>**−1:** the duplicate "Must see ×" chip remains. On desktop, it and "Taitō-ku ×" now render half under the header's view-switch pill (T1-tokyo-1440-must-see.jpg, T2-tokyo-1440-lunch.jpg, T1-tokyo-390-must-see.jpg).<br>**−1:** "in this map area" counts go stale:<br>• On phone they stay 351 / 85 / 11 / 317 after two zoom steps (m-light-zoom2 countLine; tokyo-390-light-list-mode.jpg).<br>• A fresh deep link at z 15 reads "450 places in this map area" (tokyo-1440-deeplink.jpg).<br>**−0.5:** after locate-me, the you-are-here dot is drawn under the "Chūkamen-ten Kiraku" label on both viewports (T3-tokyo-1440-food-near.jpg, T3-tokyo-390-food-near.jpg). |
| R4 Card ↔ pin ↔ preview ↔ detail | 15 | 7 | 12.5 | **Move +5.5.** R2's view, focus, deep-link and share losses are fixed:<br>• viewKept is true, and focusAfterClose is the opening card, on 8 of 8 (d- / m-roundtrip).<br>• pinUnderSheet is false on 8 of 8, with the pin offset 280 px on desktop and 210 px on phone (d- / m-deeplink; tokyo-1440-deeplink.jpg).<br>• mapViewInUrl is true, and the toast copy matches (tasks.T5-d / T5-m; T5-tokyo-1440-reopen-view.jpg).<br>Hover and focus still sync both ways (cardFocusLightsPin true; probe hover PASS).<br>**−1:** coming back doesn't restore the layout. Opening a detail from a card shifts the Atlas up 108 px, and it stays there after Escape, Back or a wheel scroll. The search bar goes under the header, and the "+" zoom button and the count line are cut (EVIDENCE erratum; tokyo-1440-after-detail-close.jpg, newyork-1440-after-detail-close.jpg).<br>**−1:** one place still carries several numbers:<br>• Sensō-ji: "257 of 488 in this Atlas view", "pin 4", "No. 4 of 44 in Taitō-ku" and card "4" (T5-tokyo-1440-share.jpg).<br>• The Met: "214 of 508" next to card "1" (newyork-1440-detail-from-card.jpg).<br>**−0.5:** on the real-tile Tokyo run, selecting Rengatei leaves the list on the city intro and "How this guide was made", not on its card (real/R3/tokyo-1440-light-3-pin.jpg, tokyo-1440-dark-3-pin.jpg). Cleveland and New York do scroll to the card (real/R3/cleveland-1440-light-3-pin.jpg). |
| R5 Phone experience | 15 | 11.5 | 12 | **Plus:**<br>• R2's −0.5 is given back: after locate-me the carousel leads with the nearest place, "90 m · about 1 min walk" (T3-tokyo-390-food-near.jpg).<br>• The deep-linked pin sits above the sheet (tokyo-390-deeplink.jpg).<br>• Carousel and pins sync both ways (T1-tokyo-390-saved.jpg; probe swipe PASS).<br>• Controls are in thumb reach, and overflowX is 0.<br>**−1:** the carousel shows one card per screen, so three names take two swipes (tasks.T1-m log).<br>**−1:** there's no area control on the first screen, so T2 stays city-wide: 187 places in Tokyo, 24 in Cleveland (T2-tokyo-m / T2-cleveland-m areaFound false; T2-tokyo-390-lunch.jpg).<br>**−1:** the clear map is 63 % at 390 and 35 % at 200 % (was 38 %). At 200 % the chip row covers the Key control and the carousel takes the lower third (z200-default mapClearPct 35; tokyo-200pct-default.jpg, newyork-200pct-default.jpg). |
| R6 Visual craft | 10 | 6.5 | 5 | **Plus:** the Esri gray canvas is calm in light and dark and suits the sun and ink pins (real/R3/tokyo-1440-light-1-default.jpg, tokyo-1440-dark-1-default.jpg, tokyo-390-dark-1-default.jpg). Pins, chips, carousel and preview look like one family.<br>**−1.5 (new):** the desktop header is broken on every Atlas page (EVIDENCE "View switch"; tokyo-1440-light-default.jpg, real/R3/cleveland-1440-light-1-default.jpg, chinatown-1440-light-default.jpg):<br>• The view switch sits at y = −17, and its 98 px pill bleeds over the search bar, washing out "Area" and "Filters".<br>• "How we choose" wraps to 2 lines on Tokyo and 3 on Cleveland, Chinatown and New York.<br>• The breadcrumb is cut or garbled: "Japan › To…", "ited State€…", "ingapore China…".<br>**−1.5:** many cards and previews have no photo. Glyph covers fill whole result pages (T2-tokyo-1440-lunch.jpg, T3-tokyo-1440-food-near.jpg). The new preview kind word ("Wagashi", "Teishoku", "Italian") sits flush in the cover's top-left corner with no padding (tokyo-1440-light-pin-selected.jpg, real/R3/tokyo-1440-light-3-pin.jpg, real/R3/newyork-1440-light-3-pin.jpg).<br>**−1:** after a card focus or a detail, the layout shifts up 108 px. The bar ends up under the sticky header, and the offline band shows under the map (tokyo-1440-keyboard-card-focus.jpg, cleveland-1440-keyboard-card-focus.jpg; erratum).<br>**−1:** small layout defects:<br>• The phone breadcrumb collides: "‹ Japan› T…", "ited StatNs.." (T3-tokyo-390-food-near.jpg, real/R3/newyork-390-light-1-default.jpg).<br>• The focus ring on a carousel title is a broken bracket (tokyo-390-after-detail-close.jpg).<br>• An empty band sits under the phone tiles-blocked list (tokyo-390-tiles-blocked.jpg).<br>• "The Metropolitan Museum of Art (official)" runs into the next card (newyork-1440-after-detail-close.jpg). |
| R7 Trust & access | 10 | 7 | 7.5 | **Plus:**<br>• Sources show on the card, the preview and the detail.<br>• Closures are flagged on the card, detail and pin, with source and check date (T4-cleveland-1440-closed-place.jpg).<br>• Contrast fails are 0 on every page.<br>• Reduced motion is respected (city.js `prefers-reduced-motion: reduce`, atlas.js `animate:!e.still()`).<br>• The count line is `aria-live="polite"`.<br>• With tiles or the library blocked, every place is listed (488 / 194 / 16 / 508, 0 errors), with a pin schematic and "Try again" (tokyo-1440-tiles-blocked.jpg, tokyo-1440-library-blocked.jpg).<br>• R2's −1 is given back:<br>&nbsp;&nbsp;– Skip links are stops 1–3, the map is stop 28 and the first pin stop 29.<br>&nbsp;&nbsp;– Every stop has a ring.<br>&nbsp;&nbsp;– Arrow keys pan, "+" zooms, and the count follows ("157 places"; keyboard-tokyo).<br>**−1.5:** card, preview, credit and map-control text is still 12 px at minimum, and 12 px is the card median (fontSizes.card / credit / mapctl min 12; d-light-select preview min 12).<br>**−0.5:** Tokyo 1440 has 31 targets under 44 px, 6 of them under 24: credit links 58 × 15, the search input 284 × 25 and the phone "Map credits" button 20 × 20 (targets.examples).<br>**−0.5:** some focus targets are clipped or out of order:<br>• The view-switch buttons start at y = −17, so their top 17 of 44 px and their focus ring are cut off (EVIDENCE "View switch").<br>• Inside a card, Tab reaches the photo-licence links before Save and the place name (keyboard-tokyo.firstStops 67–69). |
| **TOTAL** | 100 | **68.5** | **79.5** | |

### Task results
- **T1: yes on desktop (5 steps), partly on phone (7 steps).**
  - The first screen names must-sees on the map: Imperial Palace East Gardens, Tokyo National Museum and Tsukiji Hongan-ji (tokyo-1440-light-default.jpg).
  - Saving two works: the pins get heart badges and the header reads "Saved 2" (T1-tokyo-1440-saved.jpg).
  - For tonight: cards carry opening hours (T1-d log), but there's no open-now filter, so I had to read card text.
  - Confusing:
    - the duplicate "Must see ×" / "Must see" chips, with the × chip half hidden under the header on desktop;
    - the one-card carousel on phone (T1-tokyo-390-must-see.jpg).
- **T2: yes on desktop (3 steps), partly on phone (2 steps).**
  - Desktop: "Taitō-ku 44" then "Eat & drink" gives Usagiya, Yanaka Ginza and Komagata Dozeu. Cleveland: University Circle 59 → 15. "Your day here · 6 stops" helps plan the half-day.
  - Confusing: "23 places across 1 area" sits above "44 places · area 6 of 13", and the food cards have no photos (T2-tokyo-1440-lunch.jpg).
  - Phone: there's no area control, so the list stays city-wide at 187 in Tokyo and 24 in Cleveland (areaFound false).
- **T3: yes (3 steps on both viewports).**
  - Locate-me, then "Eat & drink", gives "Nearest to me": Nonbei Yokochō 90 m, Ichiran 190 m, Chatei Hatou 220 m.
  - Cards show distance and walking time, and there's a clear privacy note.
  - Snags:
    - the nearest-sorted cards still show rank badges 3 / 32 / 29 / 20;
    - the you-are-here dot sits under a pin label (T3-tokyo-1440-food-near.jpg).
- **T4: yes.**
  - Heinen's is marked closed on the card, the detail ("checked 2026-08-10", per Signal Cleveland and TheStreet) and the pin ("· Closed").
  - The view, list scroll and focus are restored (viewKept, focusAfterClose).
  - On desktop, though, the layout stays shifted 108 px after Escape, with the search bar under the header (erratum; tokyo-1440-after-detail-close.jpg).
  - The detail also shows three different numbers: "39 of 194", "pin 39" and "No. 39 of 42" (T4-cleveland-1440-closed-place.jpg).
- **T5: yes.**
  - `#view=atlas&p=senso-ji&at=…,15` reopens the detail with the pin beside the panel.
  - A map-view link reopens Asakusa at z 15, within 0.00002° (mapViewInUrl true; T5-tokyo-1440-reopen-view.jpg).
  - The toast is now true. The only confusion is the stack of numbers on the detail.
- **T6: partly.**
  - **Keyboard.**
    - Works: skip links at stops 1–3, the map at 28 and the first pin at 29, rings on every stop, arrow keys pan, "+" zooms and the count follows. Enter opens the detail with focus on Close, and Escape returns to the card.
    - Snags:
      - The view switch is clipped at y = −17.
      - Within a card, the licence links come before the name.
      - Focusing a card shifts the layout 108 px (tokyo-1440-keyboard-card-focus.jpg).
      - The scan tags all 16 pin stops "[off-screen]" (keyboard-tokyo.firstStops 29–44), and that tag isn't defined. A screenshot of a focused pin is needed to confirm focus is visible.
  - **200 %.** There's no overflow, but only 35 % of the map is clear and the chip row covers the Key control (tokyo-200pct-default.jpg).
  - **Library or tiles blocked.** Excellent: a schematic, a notice and "Try again", with all 488 places listed and 0 errors (tokyo-1440-library-blocked.jpg, tokyo-1440-tiles-blocked.jpg).

### Top three fixes
1. **Stop the Atlas shell from shifting, and fix the desktop header.**
   - Move the "Take <city> with you" offline panel out of the Atlas container, or into the list pane.
   - Use `overflow: clip` on the shell so that focus and `scrollIntoView` can't scroll it. Scroll only the list pane, with `preventScroll` on card focus.
   - Fit the view switch inside the 56 px header or the bar, keep "How we choose" on one line, and show the full city in the breadcrumb.
   - Acceptance:
     - After keyboard-tokyo cardEnter + escape and after every d-roundtrip, the map top stays at 108 px and the search input top is ≥ 56 px on all 4 pages. Record map.top in the round-trip probe.
     - At 1024, 1280 and 1440 px, every view-switch button has rect top ≥ 0 and bottom ≤ 56.
     - The "Must see ×" chip box doesn't intersect the header.
     - The breadcrumb isn't truncated at ≥ 1280 px.
2. **One honest count, and one number per place.**
   - Show a single count line.
   - Area headers show the in-view count for the active filters.
   - Drop the duplicate active-filter chip.
   - On phone, mark the count stale until "Search this area" is tapped.
   - Recompute the count after a deep link's zoom.
   - The detail shows one rank.
   - Draw the you-are-here dot above pin labels.
   - Acceptance:
     - The m-light-zoom2 countLine equals the places in the visible bounds, or reads as stale.
     - The d-deeplink count is ≤ the places inside the z 15 bounds.
     - T1 shows exactly one Must-see control.
     - Sensō-ji's detail shows only "No. 4 of 44 in Taitō-ku": no "pin N" and no "257 of 488".
     - In T3 the locate marker isn't overlapped by any label box.
3. **Readable text and real targets for every generation.**
   - Card and preview body text ≥ 16 px; credits and map controls ≥ 14 px.
   - The phone "Map credits" button ≥ 24 × 24 px, preferably 44.
   - The whole 44 px search pill acts as the input's hit area.
   - In each card, the title link comes first in Tab order.
   - The preview's no-photo cover either collapses or insets its kind word.
   - Acceptance:
     - fontSizes.card median ≥ 16 and min ≥ 14 in every state; preview min ≥ 14.
     - targets.under24 is 0 on every first screen.
     - The input box is ≥ 44 px tall.
     - In keyboard-tokyo, the first stop inside a card is its title.
     - A no-photo preview cover is ≤ 64 px tall, or its kind word is inset ≥ 12 px.

### Blocker / High findings
- **High: the desktop layout shift after a card focus or a detail persists.**
  - Focusing a card or opening its detail moves the whole Atlas up 108 px. It stays after Escape, Back and a wheel scroll.
  - The search and filter bar goes under the header, the "+" zoom button and the count line are cut, and the offline panel slides in under the map.
  - window.scrollY stays 0, so the window-level checks miss it.
  - Evidence: EVIDENCE erratum; tokyo-1440-after-detail-close.jpg, newyork-1440-after-detail-close.jpg, tokyo-1440-keyboard-card-focus.jpg, cleveland-1440-keyboard-card-focus.jpg, T5-tokyo-1440-share.jpg.
- **High: a desktop header regression on every Atlas page at 1024–1440 px.**
  - The view-switch buttons sit at y = −17, with the top 17 of 44 px clipped.
  - Its 98 px pill overlaps the search bar and half-hides the active-filter chips ("Must see ×", "Taitō-ku ×").
  - "How we choose" wraps to 2–3 lines, and the breadcrumb is garbled.
  - Evidence: EVIDENCE "View switch"; tokyo-1440-light-default.jpg, T1-tokyo-1440-must-see.jpg, real/R3/cleveland-1440-light-1-default.jpg.
- **High: card, preview, credit and map-control text is still 12 px** (fontSizes.card / credit / mapctl min 12, card median 12; d-light-select preview min 12). It's unchanged since R2.
- **High (process): the front-end probe passes checks the panel fails.**
  - "No document scroll" and "preview → detail → Escape keeps the view" pass while the 108 px shift happens (ms/probe.json). They check the window and the map view only, not the layout.
  - "First screen ≥ 70 % map" passes on the map box, while the clear map is 63 %, under the rubric's 75 %.
  - The keyboard scan's "[off-screen]" tag on all 16 pin stops (keyboard-tokyo.firstStops 29–44) is undefined. It needs a screenshot of a focused pin before "rings on every stop" can count as visible focus (WCAG 2.4.11).

---

## FE
### Scores
| Row | Max | Prev | Score | Evidence for each point lost (and for any move > 3) |
|---|---|---|---|---|
| R1 Map-first composition | 15 | 9.5 | 14 | **Move +4.5.** On desktop the chrome above the map is now 108 px (it was 208). The map is 64 % wide and fills 56 / 54 % of the first screen, up from 46 / 44 % (chromeAbovePx 108, map.wPct 64 and mapSharePct 56 on every 1440 row; tokyo-1440-light-default.jpg). You open on 16 named pins with no numbers.<br>**−1:** on phone, only 63 % of the map is clear, against a 75 % target (mapClearPct 63 on every 390 row). The chip row, credit chip, List pill and one-card carousel cover 27 % of it (overlayOnMapPct 27; tokyo-390-light-default.jpg). The broken desktop header is scored once, in R6. |
| R2 Pin/cluster legibility | 20 | 18 | 18 | No change from R2.<br>**Plus:**<br>• Every first screen has 0 numbered labels and 0 clusters.<br>• Each pin has a kind glyph, and must-sees have the sun fill (16 of 16 on Tokyo 1440).<br>• Closed places show a "· Closed" pin and slashed dots (tasks.T4-closed.pinClassAtPlace; T4-cleveland-1440-closed-place.jpg).<br>• Pin labels are 14 px.<br>**−1:** dots carpet the centre: 343 / 354 on Tokyo and 330 / 340 on New York, overlapping (canvas.dotsShown; real/R3/tokyo-390-light-1-default.jpg).<br>**−0.5:** zooming in on phone still thins the names. Cleveland shows 4 named pins among 30 dots, and Chinatown 1 at z 18 (m-light-zoom2 namedLabels, canvas.dotsShown).<br>**−0.5:** cards, carousel and preview carry rank numbers that no pin shows ("1…43", "★ 7", "37 Must see within Manhattan"). The detail still says "pin 1" or "pin 39" (tokyo-1440-deeplink.jpg, T4-cleveland-1440-closed-place.jpg, real/R3/newyork-1440-light-3-pin.jpg). |
| R3 Searching with the map | 15 | 9 | 10.5 | **Plus (+2.5 back):** near-me is now honest.<br>• After locate-me, both viewports sort by "Nearest to me". Nonbei Yokochō leads at 90 m, and every card shows a distance (tasks.T3-d / T3-m listShows; T3-tokyo-390-food-near.jpg).<br>• Desktop live search follows a pan (d-light-pan, Tokyo 27→62), and "Show all" restores every place (probe PASS).<br>**−2:** counts still stack up:<br>• The default view shows "359 places in this map area", "129 more outside… Show all 488", city-total area chips and "43 places · area 1 of 13" (tokyo-1440-light-default.jpg).<br>• With Must see on, it shows "141 places", "Show all 177", "177 places across 13 areas" and "Show all 488", while the area header still says "43 places" (T1-tokyo-1440-must-see.jpg).<br>• "23 places across 1 area" sits above "44 places · area 6 of 13" (T2-tokyo-1440-lunch.jpg).<br>**−1:** the duplicate "Must see ×" chip remains. On desktop it, and "Taitō-ku ×", are clipped under the header's view-switch pill (T1-tokyo-1440-must-see.jpg, T2-tokyo-1440-lunch.jpg, T1-tokyo-390-must-see.jpg).<br>**−1:** "in this map area" counts go stale:<br>• On all four phone pages the count doesn't change after two zoom steps (351 / 85 / 11 / 317; m-light-zoom2 countLine; tokyo-390-light-list-mode.jpg).<br>• A fresh desktop deep link at z 15 reads "450 places in this map area" (tokyo-1440-deeplink.jpg).<br>**−0.5:** the you-are-here dot is drawn under the "Chūkamen-ten Kiraku" label on both viewports (T3-tokyo-1440-food-near.jpg, T3-tokyo-390-food-near.jpg). |
| R4 Card ↔ pin ↔ preview ↔ detail | 15 | 7 | 13.5 | **Move +6.5.** Four of my five R2 losses are fixed:<br>• **+3 and +1.5:** the round-trip keeps the view, the list scroll and focus on 8 of 8 pairs (d- / m-roundtrip viewKept true; focusAfterClose is the opening card). It was 1 of 8, with focus on BODY in 3.<br>• **+1.5:** deep-linked pins sit clear of the sheet, offset 280 / 210 px from centre (pinUnderSheet false on 8 of 8; tokyo-1440-deeplink.jpg, tokyo-390-deeplink.jpg).<br>• **+1:** shared links carry `&at=`, and the toast is now true (tasks.T5-d / T5-m mapViewInUrl true; T5-tokyo-1440-reopen-view.jpg).<br>• Hover and focus sync both ways (cardFocusLightsPin true; probe hover PASS).<br>**−1:** one place still carries four numbers. Sensō-ji is card 4, "pin 4", "No. 4 of 44 in Taitō-ku" and "257 of 488 in this Atlas view". The Met is card 1 but "214 of 508" (T5-tokyo-1440-share.jpg, newyork-1440-detail-from-card.jpg).<br>**−0.5:** on real tiles, selecting Rengatei in Tokyo leaves the list on the city intro instead of its card (real/R3/tokyo-1440-light-3-pin.jpg, tokyo-1440-dark-3-pin.jpg). Cleveland and New York do scroll to the card.<br>The 108 px shift on return is scored once, in R6. |
| R5 Phone experience | 15 | 11.5 | 12 | **Plus (+0.5 back):** after locate-me, the carousel leads with Nonbei Yokochō, "90 m · about 1 min walk" (tasks.T3-m). The carousel and pins stay in sync, List/Map works, the locate tap hits, overflowX is 0, and the controls sit bottom-right within thumb reach (probe PASS; tokyo-390-light-pin-selected.jpg).<br>**−1:** the carousel shows one card per screen, so three names take two swipes (tasks.T1-m log).<br>**−1:** there's no area control on the first screen, so the half-day task stays city-wide (T2-tokyo-m / T2-cleveland-m areaFound false; T2-tokyo-390-lunch.jpg).<br>**−1:** the clear map is 63 % at 390 and 35 % at 200 % (down from 38 %). At 200 % the chip row still covers the Key control, and the carousel takes the lower third (z200-default mapClearPct 35; tokyo-200pct-default.jpg, newyork-200pct-default.jpg). |
| R6 Visual craft | 10 | 6.5 | 5 | **Plus:** the Esri gray canvas is calm in light and dark and suits the sun and ink palette (real/R3/tokyo-1440-light-1-default.jpg, tokyo-1440-dark-1-default.jpg, tokyo-390-dark-1-default.jpg). Pins, chips, carousel and preview read as one family.<br>**−1.5 (new):** the desktop header is broken on every page:<br>• The view switch sits at y = −17, and its 98 px pill spreads over the search bar, so Area and Filters look disabled.<br>• "How we choose" wraps to 2 lines on Tokyo, and to 3 lines with the top clipped on Cleveland, New York and Chinatown.<br>• The breadcrumb is garbled: "Japan › To…", "ited State€…", "ingapore China…".<br>• Evidence: EVIDENCE "View switch"; tokyo-1440-light-default.jpg, real/R3/cleveland-1440-light-1-default.jpg, chinatown-1440-light-default.jpg.<br>**−1.5:** many cards and previews still have no photo. The new preview kind word sits flush in the top-left corner of the cover ("Wagashi", "Teishoku", "Italian") (tokyo-1440-light-pin-selected.jpg, real/R3/tokyo-1440-light-3-pin.jpg, real/R3/newyork-1440-light-3-pin.jpg, T2-tokyo-1440-lunch.jpg).<br>**−1:** the 108 px layout shift after a card focus or a detail, which I found before the erratum:<br>• The bar slides under the header.<br>• The + zoom control and the count line are cut off.<br>• "Take <city> with you" appears below the map.<br>• Evidence: tokyo-1440-after-detail-close.jpg, cleveland-1440-keyboard-card-focus.jpg, newyork-1440-after-detail-close.jpg, T5-tokyo-1440-share.jpg.<br>**−1:** small layout defects:<br>• The phone breadcrumb collides ("‹ Japan› T…", "ited StatNs.."; T3-tokyo-390-food-near.jpg, real/R3/newyork-390-light-1-default.jpg).<br>• The carousel title's focus ring is a broken bracket (tokyo-390-after-detail-close.jpg).<br>• An empty band sits under the phone tiles-blocked list (tokyo-390-tiles-blocked.jpg).<br>• The Met's recommender line runs into the next card (newyork-1440-after-detail-close.jpg). |
| R7 Trust & access | 10 | 7 | 7.5 | **Plus:**<br>• Sources show on cards, preview and detail, and closures on card, detail and map.<br>• Every page has 0 contrast fails.<br>• Reduced motion is honoured (city.js `prefers-reduced-motion: reduce`; atlas.js `animate:!e.still()`).<br>• The count line is `aria-live="polite"`.<br>• With tiles or the library blocked, every place is listed (488 / 194 / 16 / 508, 0 errors) beside a pin schematic and "Try again" (tokyo-1440-tiles-blocked.jpg, tokyo-1440-library-blocked.jpg).<br>**Fixed (+1 back):** there are now skip links at stops 1–3. The map is stop 28 and the first pin 29, and every stop has a ring. Arrow keys pan, + zooms, and the count follows (keyboard-tokyo mapFocusableAt 28, tabsToFirstPin 29, stopsWithoutVisibleRing 0, mapKeys.list "157 places").<br>**−1.5:** card, preview, credit and map-control text is still 12 px at the minimum, and card text has a 12 px median (fontSizes.card / credit / mapctl min 12; d-light-select preview min 12).<br>**−0.5:** 31 targets on Tokyo 1440 are under 44 px, 6 of them under 24 px. They include the search input (284 × 25 inside a 44 px pill), credit links (58 × 15) and the phone "Map credits" button (20 × 20) (targets.examples).<br>**−0.5:** focus gaps:<br>• The view-switch buttons are clipped 17 px off the top of the page (EVIDENCE "View switch").<br>• In each card, Tab reaches the photo-licence links before Save and the place name (keyboard-tokyo.firstStops 67–69). |
| **TOTAL** | 100 | **68.5** | **80.5** | |

Erratum changes: none. No row of mine relied on "the document doesn't scroll". I had already seen the 108 px shift in the shots (tokyo-1440-after-detail-close.jpg, tokyo-1440-keyboard-card-focus.jpg, cleveland-1440-keyboard-card-focus.jpg) and deducted it once, in R6 (−1, as in R2), so I'm not deducting it twice. The erratum also says a wheel scroll doesn't undo the shift. That matches what I read in fe-a.css, where html and body are `overflow:hidden; height:100%` in Atlas, so the High finding below stands as written.

### Task results
- **T1: yes on desktop (5 steps), partly on phone (7 steps).**
  - The first-screen map names must-sees: Imperial Palace East Gardens, Edo-Tokyo Museum, Tsukiji Hongan-ji and Tokyo National Museum (tokyo-1440-light-default.jpg).
  - Saving two works: Saved reads 2, and the saved pins get heart badges (T1-tokyo-1440-saved.jpg).
  - There's no open-now filter or "tonight" sort. Hours and evening words are in the card text, so I had to read cards.
  - On phone, three names take two swipes (one card per screen).
  - What confused me: the duplicate "Must see ×" / "Must see" chips. On desktop the "×" chip is clipped under the header pill (T1-tokyo-1440-must-see.jpg, T1-tokyo-390-must-see.jpg).
- **T2: yes on desktop (3 steps), partly on phone (2 steps, no area).**
  - On desktop, "Taitō-ku 44" then "Eat & drink" gives 23 places, led by Usagiya, Yanaka Ginza and Komagata Dozeu. Cleveland: University Circle 59 → 15. "Your day here · 6 stops" also helps.
  - What confused me: "23 places across 1 area" sits above "44 places · area 6 of 13". The "Taitō-ku ×" chip is clipped. All four lunch cards have no photo (T2-tokyo-1440-lunch.jpg).
  - On phone there's no area chip, so the results stay city-wide: 187 in Tokyo, 24 in Cleveland (areaFound false).
- **T3: yes on both viewports (3 steps).**
  - Locate-me, then Eat & drink, gives "Nearest to me" with Nonbei Yokochō first at 90 m, then 190 / 220 / 330 / 370 m. Every card shows a distance, and there's a clear privacy note.
  - What confused me: in Nearest mode the cards still show rank badges 3 / 32 / 29 / 20. The you-are-here dot is under a pin label (T3-tokyo-1440-food-near.jpg, T3-tokyo-390-food-near.jpg).
- **T4: yes (3 steps: card → read → Escape).**
  - Heinen's says "Closed — kept for the record · checked 2026-08-10 · per Signal Cleveland and TheStreet" on the card and the detail. The pin reads "Heinen's Downtown · Closed".
  - Escape restores the centre, zoom, list scroll and focus (viewKept 8 of 8).
  - What confused me:
    - The detail shows "39 of 194 in this Atlas view", "pin 39" and "No. 39 of 42".
    - On desktop the whole layout shifts up 108 px: the search bar is hidden and the + zoom control is cut (T4-cleveland-1440-closed-place.jpg, cleveland-1440-after-detail-close.jpg).
- **T5: yes (2 steps: Share, then reopen).**
  - The link is `#view=atlas&p=senso-ji&at=…,15`. It reopens the detail with the pin beside the sheet.
  - A view link reopens Asakusa at z 15 within 0.00002°, and the toast's promise holds (tasks.T5-d / T5-m).
  - What confused me: four different numbers on Sensō-ji. On phone the toast briefly covers Directions (T5-tokyo-390-share.jpg).
- **T6: partly.**
  - **Keyboard: yes, with gaps.**
    - Skip links come first; the map is stop 28 and the first pin 29, and there's a ring on every stop. Arrow keys pan and + zooms, and the count follows ("157 places"). Enter on a card opens the detail with focus on Close, and Escape returns focus to the card.
    - Gaps:
      - The view-switch buttons are clipped at y = −17.
      - Tab-focusing a card shifts the layout 108 px, hiding the search field and chips under the header (tokyo-1440-keyboard-card-focus.jpg).
      - Card Tab order puts the licence links before the name.
      - All 16 pin stops are tagged "[off-screen]" in keyboard-tokyo.firstStops. The pack doesn't define the tag, so it needs a focused-pin screenshot.
  - **200 %: partly.** There's no overflow, but only 35 % of the map is clear, the chip row covers Key, and the carousel takes the lower third (tokyo-200pct-default.jpg).
  - **Library or tiles blocked: yes.** Every place is listed beside a pin schematic, a notice and "Try again", with 0 errors (tokyo-1440-library-blocked.jpg, tokyo-1440-tiles-blocked.jpg).

### Top three fixes
1. **Lock the Atlas shell and repair the desktop header.**
   - Pin the Atlas grid to the viewport, and move the "Take <city> with you" panel out of the Atlas container (or into the list pane), so that focus and scrollIntoView can't scroll an overflow-hidden ancestor. Use `focus({preventScroll:true})` and scroll the list pane only.
   - Keep the view switch inside the 56 px header. Stop "How we choose" from wrapping, and keep the breadcrumb ungarbled.
   - Acceptance:
     - After keyboard-tokyo cardEnter + Escape, and after every d-roundtrip, the map's top is 108 px and the search input is fully visible (rect.top ≥ 56).
     - The probe checks the scrollTop of every ancestor of the map, not only window.scrollY.
     - At 1024, 1280 and 1440, every view-switch button has rect.top ≥ 0, "How we choose" is on one line, and the breadcrumb shows the full city name.
     - Active filter chips don't intersect the header.
2. **Make the counts few, plain and true.**
   - Use one count line. Area headers show in-view counts for the active filter. Remove the duplicate "Must see ×" chip.
   - The phone count updates after a zoom, or reads as stale until "Search this area" is tapped. A deep link recomputes the count after it zooms.
   - The detail shows one rank, with no "pin N" and no "X of 488 in this Atlas view".
   - Acceptance:
     - m-light-zoom2 countLine matches the places in view (about 45 on Tokyo) or says it is out of date.
     - d-deeplink's count is no more than the places within the z 15 bounds.
     - T1 shows exactly one Must-see control.
     - T5 detail text contains exactly one number for Sensō-ji's rank.
3. **Raise text and target sizes for every generation, and fix the card Tab order.**
   - Card and preview body text 16 px, with nothing under 14 px.
   - Credit links at least 24 px tall, the phone "Map credits" button at least 24 × 24 (44 preferred), and the search input's hit area equal to its 44 px pill.
   - In each card, the title link comes before the licence links in Tab order.
   - Acceptance:
     - fontSizes.card median ≥ 16 and min ≥ 14; the d-light-select preview min is ≥ 14.
     - targets.under24 is 0 on every first screen.
     - The first Tab stop inside the first card is its title link.

### Blocker / High findings
- **High: the desktop layout shifts 108 px and the user can't undo it.**
  - A card focus, a detail round-trip or Share shifts the Atlas layout up 108 px inside its container. The search and filter bar goes under the header, the + zoom control and the count line are cut, and the offline panel appears below the map.
  - Html and body are `overflow:hidden` in Atlas (fe-a.css), so a mouse user can't scroll it back. Per the erratum, a wheel scroll over the list doesn't undo it either. The search field and chips stay hidden until reload or a Shift+Tab.
  - Evidence: tokyo-1440-after-detail-close.jpg, cleveland-1440-after-detail-close.jpg, tokyo-1440-keyboard-card-focus.jpg, T5-tokyo-1440-share.jpg.
- **High: the desktop header renders partly off-screen at 1024–1440 px.**
  - The view-switch buttons sit at y = −17, with the top 17 of 44 px clipped. The pill's background spreads over the search bar.
  - "How we choose" wraps to 2–3 lines, and the breadcrumb is garbled.
  - The active filter chips ("Must see ×", "Taitō-ku ×") are clipped under the pill.
  - Evidence: EVIDENCE "View switch"; tokyo-1440-light-default.jpg, real/R3/cleveland-1440-light-1-default.jpg, T1-tokyo-1440-must-see.jpg.
- **High: card, preview, credit and map-control text is still 12 px.** This is unchanged since R2 (fontSizes.card median 12; d-light-select preview min 12).
- **High (process): the probe has blind spots.**
  - It measures scroll on the window only, so "chrome ≤ 120 px… no document scroll" passes while the layout shift happens.
  - Its phone check "first screen ≥ 70 % map" passes on the map box (92 %), against the rubric's 75 % clear (mapClearPct 63).
  - The keyboard scan tags all 16 pin stops "[off-screen]" without defining the tag (keyboard-tokyo.firstStops 29–44). If focused pins really are outside the viewport, that fails WCAG 2.4.11. It needs a check with a screenshot of a focused pin.
