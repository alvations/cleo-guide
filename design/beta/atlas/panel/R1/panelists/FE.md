<!-- simulated composite persona; round 1 return, verbatim except rule-6 redactions -->
## FE
### Scores
| Row | Max | R0 | Score | Evidence for each point lost (and for any move > 3) |
|---|---|---|---|---|
| R1 Map-first composition | 15 | 9 | 9 | −3: the desktop chrome above the map is still 208 px, against a target of about 120 (measurements.md, every 1440 row; tokyo-1440-light-default.jpg). −1.5: the desktop map takes 46 / 44 % of the first screen (box / clear). Its width of 60 % only just meets the bar. −1.5: the phone's clear map fell from 64 % to 59 %, under the 75 % target. The attribution chip now wraps to two lines under the chip row and adds a slab of chrome (EVIDENCE.md "Phone clear map"; real/R1/tokyo-390-light-1-default.jpg). Plus: you now see named places straight away, not numbers. |
| R2 Pin/cluster legibility | 20 | 7 | 14.5 | **Move +7.5.** Number soup is gone. Every first-screen row shows 0 numbered labels and 0 clusters, and the named pins all carry text (16/16 on Tokyo 1440, 8/8 on Tokyo 390). Each pin has a kind glyph, and must-sees sit on the sun fill (measurements.md first-screen table; tokyo-1440-light-default.jpg, real/R1/tokyo-1440-light-1-default.jpg). Losses: −2: closed places have no mark on the map. Heinen's is only an anonymous canvas dot, with pinClassAtPlace null (tasks.T4-closed). −1.5: the 334 / 358 canvas dots are all grey. Their kind and must-see status can't be read, and they bunch up densely in central Tokyo (canvas.dotsShown; real/R1/tokyo-390-light-1-default.jpg). −1.5: zooming in on phone loses names. After two steps, Cleveland shows 1 named pin and New York 2 (EVIDENCE.md "Zoomed in two steps"). −0.5: the glyph that tells sight from eat & drink is small, at 13 px, beside the label (pin font 13). |
| R3 Searching with the map | 15 | 8.5 | 8.5 | Plus: on desktop, pan and zoom update the list honestly (d-light-pan 23→40; probe "panning changes the list count" PASS), and "Show all" restores every place. Losses: −2.5: after locate-me the list leads with Minato-ku (Toraya Akasaka) on desktop and with Isegen in Chiyoda on phone, while the map is centred on Shibuya. Nonbei Yokochō, 90 m away and tier 1, is named on the map but never comes first. Locate doesn't switch the sort to "Nearest", and cards show no distances (tasks.T3-d / T3-m listShows; T3-tokyo-1440-food-near.jpg). −2: counts still stack up and contradict each other. The zoomed view reads "23 places in this map area" directly above "43 places · area 1 of 13", alongside "465 more outside" and the area-chip counts (tokyo-1440-light-zoomed.jpg). −1: the duplicate "Must see ×" chip sits next to the "Must see" chip (T1-tokyo-390-must-see.jpg). −1: desktop searches live, but phone needs "Search this area", and that pill overlaps the attribution (tokyo-390-light-pin-selected.jpg). |
| R4 Card ↔ pin ↔ preview ↔ detail | 15 | 8 | 7.5 | Plus: hover and focus sync in both directions (cardFocusLightsPin true; probe hover checks PASS). The Tokyo desktop deep link no longer hides its pin (d-deeplink pinUnderSheet false). Losses: −3: closing the detail never restores the view. Tokyo goes from z 14 to z 15 on desktop and from z 13 to z 15 on phone. New York goes from z 13.5 to z 15, and its desktop list scroll jumps to 2,193 px (pages.*.d-roundtrip / m-roundtrip; tokyo-1440-after-detail-close.jpg). −1.5: after Escape, focus lands on BODY on Cleveland phone and on New York desktop and phone (EVIDENCE.md round-trip table). −1: the pin is still under the panel on 7 of 8 deep links. On desktop the page still scrolls, so the map is mostly off-screen behind the sheet (tokyo-1440-deeplink.jpg). −1: the detail rank "No. 1 of 24 in Chiyoda-ku" disagrees with the list's "43 places" (tokyo-1440-deeplink.jpg vs tokyo-1440-light-default.jpg). −1: the share toast says "it opens this exact view", but mapViewInUrl is false, and a link copied at Asakusa z 15 reopens at z 13 (tasks.T5-d). |
| R5 Phone experience | 15 | 9 | 8 | Plus: the carousel and pins sync both ways (probe "swiping the carousel selects the next card's pin" PASS; tokyo-390-light-pin-selected.jpg). List/Map works, and there's no horizontal overflow. Losses: −2.5: the two-line attribution chip now sits on top of the locate control, so a real tap lands on the attribution (tasks.T3-m locateCoveredBy; real/R1/tokyo-390-light-1-default.jpg, where the locate icon is visibly faded under the chip). This hides the only path to locate-me. −1.5: the carousel shows one card per screen, and the "Search this area" pill overlaps the attribution text (real/R1/tokyo-390-dark-3-pin.jpg). −1: the controls are top-right, at y ≈ 280–580 CSS px, out of thumb reach. −1: area is hidden behind Filters (T2-tokyo-m areaFound false), and names thin to 1–2 pins on zoom-in. −1: the clear map is 59 %, and 34 % at 200 % (z200-default mapClearPct). |
| R6 Visual craft | 10 | 7 | 7 | Plus: the real Esri gray canvas is calm and suits the palette in light and dark (real/R1/tokyo-1440-light-1-default.jpg, tokyo-1440-dark-1-default.jpg), and pins, chips and cards now read as one family. Losses: −1.5: many previews and cards show an empty cover with a glyph instead of a photo (real/R1/cleveland-1440-light-3-pin.jpg, T3-tokyo-1440-food-near.jpg, real/R1/tokyo-390-dark-3-pin.jpg). −1: after a detail round-trip the sticky chrome overlaps. The chip row shows through under the header and the count line is cut (tokyo-1440-after-detail-close.jpg, tokyo-1440-keyboard-card-focus.jpg). −0.5: the desktop preview card covers its own selected pin label (real/R1/cleveland-1440-light-3-pin.jpg, tokyo-1440-light-pin-selected.jpg). |
| R7 Trust & access | 10 | 5 | 5.5 | Plus: sources are on cards and in the detail. Closures are flagged in the card and detail ("Closed — kept for the record", T4-closed). There are 0 contrast fails, reduced motion is honoured (`prefers-reduced-motion` in city.js), and the library- and tiles-blocked states list every place (488/194/16/508, 0 errors; tokyo-1440-library-blocked.jpg). Targets under 44 px fell from 64 to 26. Losses: −1.5: card and credit text is still min / median 12 px (measurements.md min text 12; z200 fontSizes card median 12). −0.5: 26 targets on the Tokyo 1440 first screen are under 44 px, 2 of them under 24, and pins are 30 px. −2: the map and pins are still not keyboard-reachable. tabsToFirstPin is −1 and mapFocusableAt is −1, the source still has `keyboard:!1` in atlas.js, there is no keyboard pan, and the first card is Tab stop 39 (tasks.keyboard-tokyo). −0.5: the search input has no focus ring (stopsWithoutVisibleRing 1). |
| **TOTAL** | 100 | **53.5** | **60** | |

### Task results
- **T1: yes on desktop (5 steps), partly on phone (7 steps).** The map now names must-sees on the first screen: Imperial Palace East Gardens, Yasukuni, Tsukiji Hongan-ji, Meiji Jingū (tokyo-1440-light-default.jpg). Saving two works (Saved reads 2). For "tonight" there's still no open-now filter, so I had to read card text. On phone the duplicate "Must see ×" / "Must see" chips confused me, and the carousel needs two swipes to read three names (T1-tokyo-390-must-see.jpg).
- **T2: yes on desktop (3 steps), partly on phone (2 steps but no area).**
  - On desktop, "Taitō-ku 44" then "Eat & drink" gives 23 places, led by Usagiya, Yanaka Ginza and Komagata Dozeu.
  - On phone there's no area chip on the first screen. The script stayed city-wide, and "Eat & drink" gave 186 places (T2-tokyo-m areaFound false).
  - Cleveland desktop works the same way: University Circle 59 → 15 food.
- **T3: partly (3 steps).**
  - On desktop, locate-me centres Shibuya at z 15. Nonbei Yokochō and The Bellwood are named pins on the map, but the list leads with Toraya Akasaka (Minato-ku), and cards show no distances.
  - On phone, a real tap on locate hits the attribution chip (locateCoveredBy). After a scripted click the carousel leads with Isegen in Chiyoda.
  - A manual "Nearest to me" sort exists but isn't applied.
- **T4: partly.** From the list, the why, the sources ("per Signal Cleveland and TheStreet") and "Closed — kept for the record" are all clear. On the map, though, the closed place is an unmarked dot (pinClassAtPlace null). Coming back doesn't restore the map view, and the list scroll jumps on New York.
- **T5: partly.** The place link (`#view=atlas&p=`) copies and reopens the detail. A map-view link isn't possible: the toast promises "it opens this exact view", but the reopen lands at z 13 / z 12 instead of Asakusa z 15 (T5-d / T5-m mapViewInUrl false; T5-tokyo-1440-reopen-view.jpg).
- **T6: partly.**
  - **Keyboard.** A card is reached at Tab 39 on Tokyo and Tab 30 on Cleveland. Enter opens the detail with focus on Close, and Escape returns focus to the card on desktop. Pins and the map can't be reached, there's no pan, and the search input has no ring.
  - **200 %.** There's no horizontal overflow, but only 34 % of the map is clear. The carousel covers the lower half, and the attribution spans the top (tokyo-200pct-default.jpg).
  - **Library blocked.** Excellent. Every place is listed, there's a dot-plot stand-in with a "Map unavailable" note, and 0 errors (tokyo-1440-library-blocked.jpg).

### Top three fixes
1. **A real keyboard path into the map.**
   - Make the named pins focusable: drop `keyboard:!1`, or add a roving-tabindex "places on the map" group, with aria-label = name + kind + must-see/closed.
   - Add "Skip to results" and arrow-key pan and zoom on the focused map.
   - Acceptance:
     - Tokyo desktop: tabsToFirstPin is between 1 and 12, tabsToFirstCard ≤ 15, mapFocusableAt ≥ 0, and stopsWithoutVisibleRing is 0.
     - Enter on a pin opens its preview, and Escape returns focus to that pin.
2. **Keep the user's place, and make "this exact view" true.**
   - Snapshot the centre, zoom, list scroll and opener before opening the detail, and restore all of them on Escape, Close and Back.
   - Write `&ll=lat,lng,z` into the shared URL.
   - Acceptance:
     - Round-trip viewKept is true on all 4 pages × 2 viewports, listScrollAfter equals listScrollBefore, and focusAfterClose is the opening card, never BODY.
     - T5-d / T5-m report mapViewInUrl true, and the reopened view is within 0.002° and the same zoom.
     - Deep-link pinUnderSheet is false on all 8 pairs, and the desktop page doesn't scroll (scrollY 0).
3. **Clear the phone map's top-right.**
   - Collapse the attribution to a one-line "ⓘ ©" chip at the bottom-left above the carousel, and move locate, style and key to a bottom-right stack above the carousel.
   - Acceptance:
     - T3-m locateCoveredBy is null, so a real tap works.
     - The phone mapClearPct is ≥ 70 % on all 4 pages.
     - The "Search this area" pill doesn't intersect any control.
     - The control centres sit at y ≥ 55 % of the viewport.
   - Also mark closed places on the map with a "Closed" glyph and aria-label, even when drawn as a dot. Acceptance: T4 pinClassAtPlace is not null and contains "closed".

### Blocker / High findings
- **High: map pins are not keyboard-reachable.** atlas.js still sets `keyboard:!1`, and tabsToFirstPin and mapFocusableAt are both −1 on Tokyo and Cleveland (tasks.keyboard-tokyo, keyboard-cleveland). This is unchanged since round 0.
- **High: the phone attribution chip covers the locate-me control.** A real tap hits `leaflet-control-attribution` (tasks.T3-m locateCoveredBy; real/R1/tokyo-390-light-1-default.jpg). This is a regression: the chip went to two lines.
- **High: the detail round-trip loses the map view, and sometimes focus and list scroll.**
  - viewKept is false on all pages; Chinatown phone only passes the probe's 0.002° tolerance after drifting about 160 m.
  - Focus lands on BODY on Cleveland phone and New York desktop and phone.
  - The New York desktop list scroll jumps to 2,193 px.
  - Evidence: EVIDENCE.md round-trip table; tokyo-1440-after-detail-close.jpg.
- **High: the share toast is misleading.** It says "it opens this exact view", but mapViewInUrl is false and a copied link reopens at the default view (tasks.T5-d / T5-m).
- **High: the front-end lane's acceptance probe gives false passes.** In ms/probe.json:
  - "preview → place detail (#p=, view kept)" PASSes on every page, but the panel's d-roundtrip shows the view changed on every page.
  - "the OSM credit is visible and clear of the pill, the carousel and the chip row" PASSes, but the credit covers the locate control (T3-m).
  - The gate checks need to measure what the panel measures before they can be trusted.
- **High: body text is still 12 px.** Card text has min and median 12 px, and so do credits (measurements.md; z200-default fontSizes).
