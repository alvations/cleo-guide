<!-- simulated composite persona; round 2 returns, verbatim except rule-6 redactions. The LAST section is the scored return (after the keyboard / search-ring erratum); earlier sections are kept for the record. -->
<!-- return 1 of 4 -->
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

---

<!-- return 2 of 4 -->
## FE
### Scores
| Row | Max | Prev | Score | Evidence for each point lost (and for any move > 3) |
|---|---|---|---|---|
| R1 Map-first composition | 15 | 9 | 9.5 | **What's better:** the phone's clear map is back to 64 % (from 59 %), and the credit is now one line at the bottom left (EVIDENCE "Phone clear map"; real/R2/tokyo-390-light-1-default.jpg). You see named places, not controls. **Losses:** −3: the desktop still has 208 px of chrome above the map, against a target of about 120 (chromeAbovePx 208, every 1440 row; tokyo-1440-light-default.jpg). −1.5: the desktop map takes 46 / 44 % of the first screen (box / clear). Its 60 % width only just meets the bar. −1: the phone's clear map is 64 %, under the 75 % target (m-*-default mapClearPct 64). |
| R2 Pin/cluster legibility | 20 | 14.5 | 18 | **Move +3.5, on new evidence:** (a) Closed places are now marked on the map. Heinen's is a `pp-x` pin labelled "· Closed" (tasks.T4-closed.pinClassAtPlace), and at lower zoom closed places are hollow, slashed dots (cleveland-390-after-detail-close.jpg, real/R2/cleveland-390-light-1-default.jpg). This gives back my −2. (b) Dots now differ by kind and tier: sun rings for must-sees, squares for food, grey circles for other sights (real/R2/tokyo-390-light-1-default.jpg). (c) After two zoom steps, phone named pins went from 1 to 4 on Cleveland and from 2 to 5 on New York (EVIDENCE table). (d) Pin labels are 14 px (fontSizes.pin min 14), with a 16 px glyph (`.pp .ico`). 0 clusters and 0 numbered labels on every first screen. **Losses:** −1: dots still pile up and overlap in central Tokyo and New York (canvas.dotsShown 354 / 340 on phone; real/R2/tokyo-390-light-1-default.jpg). −0.5: names still thin on phone zoom, e.g. 4 named pins among 30 dots on Cleveland (m-light-zoom2). −0.5: numbers show up where they don't help. Cards carry "★ 7" and "1…n", and the detail says "pin 4". None of these appear on the map (T3-tokyo-390-food-near.jpg, T5-tokyo-1440-share.jpg). |
| R3 Searching with the map | 15 | 8.5 | 9 | **What's better:** on desktop, pan and zoom update the list (d-light-pan 80→61 on Tokyo, 136→58 on New York), and "Show all" restores every place. The phone "Search this area" pill no longer overlaps the credit, which gives back 0.5. **Losses:** −2.5: after locate-me, the list isn't the map's area. Desktop reads "23 places in this map area" but leads with Toraya Akasaka and Myojaku in Minato-ku. Phone reads "List · 10" but leads with Isegen in Chiyoda-ku. Nonbei Yokochō, 90 m away and tier 1, never comes first. Cards show no distances, and Nearest isn't applied (tasks.T3-d / T3-m listShows; T3-tokyo-1440-food-near.jpg). −2: counts stack up. In T1 the screen shows "146 places in this map area", "31 more", "Show all 177", "177 places across 13 areas", "Show all 488", "43 places · area 1 of 13" and "Filters 1" all together (T1-tokyo-1440-saved.jpg). −1: the duplicate "Must see ×" chip sits next to the "Must see" chip (T1-tokyo-1440-saved.jpg, T1-tokyo-390-must-see.jpg). −0.5: after a phone zoom the label still says "351 places in this map area" while 45 dots are in view, until you tap Search this area (m-light-zoom2 / m-light-list countLine; tokyo-390-light-list-mode.jpg). |
| R4 Card ↔ pin ↔ preview ↔ detail | 15 | 7.5 | 7 | **What's better:** hover and focus sync both ways (cardFocusLightsPin true; probe hover PASS). The preview no longer covers its own pin label (tokyo-1440-light-pin-selected.jpg). The Chiyoda rank now matches: "No. 1 of 43" (tokyo-1440-deeplink.jpg). **Losses:** −3: closing the detail still doesn't restore the view. viewKept is false on 7 of 8 pairs: Tokyo z 13.5→15, Cleveland 14→15, New York 13→15. The desktop list scrolls by 23–51 px (pages.*.d-roundtrip / m-roundtrip; tokyo-1440-after-detail-close.jpg). −1.5: focus lands on BODY after Escape on New York desktop and phone and on Cleveland phone (focusAfterClose). −1.5: the deep-link pin is under the panel on 8 of 8 pairs, a regression from 7 of 8. On desktop, the 560 px sheet covers the pin at the map centre (pinUnderSheet true; tokyo-1440-deeplink.jpg). −1: the detail numbers still contradict each other. Sensō-ji is card 4, "pin 4", "No. 21 of 44 in Taitō-ku" and "257 of 488" (T5-tokyo-1440-share.jpg). −1: the toast still says "it opens this exact view", but mapViewInUrl is false (tasks.T5-d / T5-m). |
| R5 Phone experience | 15 | 8 | 11.5 | **Move +3.5, on new evidence:** a real tap on locate-me now works (tasks.T3-m.locateCoveredBy null), which gives back my −2.5 for the hidden only path. The controls moved bottom-right, at about 58–70 % of the screen height, within thumb reach (real/R2/tokyo-390-light-1-default.jpg), which gives back −1. The carousel and pins sync both ways (probe swipe PASS), List/Map works, and there's no overflow. **Losses:** −1: the carousel shows one card per screen, so reading three names takes two swipes (T1-m log). −1: area isn't reachable on the phone's first screen (T2-tokyo-m / T2-cleveland-m areaFound false). −1: the clear map is 64 %. At 200 % it's 38 %, the chip row covers the Key control, and the carousel covers the lower third (z200-default mapClearPct 38; tokyo-200pct-default.jpg, newyork-200pct-default.jpg). −0.5: after locate, the carousel leads with a card that isn't on the visible map (T3-tokyo-390-food-near.jpg). |
| R6 Visual craft | 10 | 7 | 7 | **What's better:** the Esri gray canvas is calm in light and dark (real/R2/tokyo-1440-light-1-default.jpg, tokyo-1440-dark-1-default.jpg). Pins, chips, controls and the dark pills read as one family. The preview no longer covers its pin, which gives back 0.5. **Losses:** −1.5: many previews and cards still show an empty cover with a glyph instead of a photo. That includes Cleveland's No. 1 carousel card (real/R2/cleveland-1440-light-3-pin.jpg, real/R2/tokyo-1440-dark-3-pin.jpg, real/R2/cleveland-390-light-1-default.jpg, T2-tokyo-1440-lunch.jpg). −1: after a round-trip or a keyboard card focus the page scrolls, and the sticky chrome overlaps. The chip row shows under the header, and the count line and Satellite button are cut off (tokyo-1440-after-detail-close.jpg, newyork-1440-after-detail-close.jpg, tokyo-1440-keyboard-card-focus.jpg). −0.5 (new): the phone breadcrumb separator collides with the text ("United States›New Yo…", "Singapore›Chinatow…") (newyork-390-light-default.jpg, chinatown-390-light-zoomed.jpg, real/R2/newyork-390-light-1-default.jpg). The carousel title's focus ring also renders as broken brackets (tokyo-390-after-detail-close.jpg). |
| R7 Trust & access | 10 | 5.5 | 6 | **What's better:** sources are on cards, previews and the detail. Closures are flagged on the card, the detail and now the map. There are 0 contrast fails. Reduced motion is honoured (`animate:!e.still()` in atlas.js, a matchMedia check in city.js). With tiles or the library blocked, every place is listed (488/194/16/508) with 0 errors (tokyo-1440-library-blocked.jpg). Pins are now `<a>` with a "name, kind, must-see" aria-label and a focus-visible outline (`keyboard:!0`). Their hit area is 44 px through `.pp>span::before{inset:-6px}`. The search input's "no ring" reading looks like a measurement miss: `.spill:focus-within` draws a 2 px ring on its wrapper, so I give back 0.5. **Losses:** −1.5: card, credit and preview text is min and median 12 px (fontSizes.card median 12; d-light-select preview fs 12). −0.5: credit links are 58×15 px, and the first screen has 2 targets under 24 (targets.under24 2). −1.5: the map and pins are still effectively unreachable by keyboard. The map pane comes after the whole list in the DOM (`<aside class="mappane">` at the end of tokyo.html), so tabsToFirstPin and mapFocusableAt are both −1 within 46 stops. There's no skip-to-map link, and the first card is Tab stop 39 (tasks.keyboard-tokyo). Previously −2: the pins are now focusable, but too late to use. −0.5: the copy says cards are "numbered to match the map" and "Numbers on the cards match the pins on the map", but the map has no numbers (T2-tokyo-1440-lunch.jpg, real/R2/tokyo-1440-dark-3-pin.jpg). |
| **TOTAL** | 100 | **60** | **68** | |

### Task results
- **T1: yes on desktop (5 steps), partly on phone (7 steps).**
  - Must-sees are named on the map on the first screen: Imperial Palace East Gardens, Edo-Tokyo Museum, Tsukiji Hongan-ji and Tokyo National Museum (tokyo-1440-light-default.jpg).
  - Saving two works. Saved reads 2, and the saved pins get heart badges on the map (T1-tokyo-1440-saved.jpg).
  - There's no open-now filter, so "tonight" meant reading card text.
  - What confused me: the duplicate "Must see ×" / "Must see" chips, the stacked counts, and on phone a one-card carousel that needs two swipes to read three names.
- **T2: yes on desktop (3 steps), partly on phone (2 steps, no area).**
  - On desktop, Taitō-ku 44 then Eat & drink gives 23 places, led by Usagiya, Yanaka Ginza and Komagata Dozeu. On Cleveland, University Circle 59 then food gives 15.
  - Most of the food cards have no photo.
  - The area card's "numbered to match the map" is false.
  - On phone there's no area chip on the first screen, so the result stayed city-wide at 187 (T2-tokyo-m areaFound false).
- **T3: partly (3 steps).**
  - Locate-me now works with a real tap on phone (locateCoveredBy null) and centres Shibuya at z 15.
  - Nonbei Yokochō and The Bellwood are named pins next to the location dot.
  - The list leads with Toraya Akasaka (Minato-ku), and the phone carousel leads with Isegen (Chiyoda-ku) under "List · 10". Cards show no distances.
  - A "Nearest to me" sort exists but isn't applied.
- **T4: mostly yes.**
  - The card and detail read "Closed — kept for the record · checked 2026-08-10 · per Signal Cleveland and TheStreet" (T4-cleveland-1440-closed-place.jpg).
  - The pin is now labelled "· Closed".
  - Coming back changes the zoom from 14 to 15, the list scrolls by 23 px, and on Cleveland phone focus lands on BODY.
- **T5: partly.**
  - `#view=atlas&p=senso-ji` reopens the detail, but its pin sits under the sheet.
  - A link copied while looking at Asakusa z 15 reopens at z 12.5, the default view, while the toast promises "this exact view" (tasks.T5-d reopenView).
- **T6: partly.**
  - **Keyboard.** The first card is Tab stop 39 on Tokyo and 30 on Cleveland. Enter opens the detail with focus on Close, Escape returns focus to the card on desktop, and focusing a card lights its pin. The pins are now focusable links with a visible outline, but they sit after the whole list, beyond the 46 stops measured. There's no skip-to-map link, and keyboard pan is only reachable at the end.
  - **200 %.** There's no horizontal overflow, but only 38 % of the map is clear and the chip row hides the Key control (tokyo-200pct-default.jpg).
  - **Library or tiles blocked.** Excellent. Every place is listed, with a dot-plot stand-in, a notice and 0 errors. The phone tiles-blocked view leaves an empty band at the bottom (tokyo-390-tiles-blocked.jpg).

### Top three fixes
1. **A real keyboard path into the map.**
   - Put the map pane, or a "Skip to map" link plus a roving-tabindex "places on the map" group, before the results in the DOM.
   - Keep the pins' current aria-labels and focus-visible outline.
   - Acceptance:
     - Tokyo desktop: tabsToFirstPin is between 1 and 15, and mapFocusableAt is between 0 and 15.
     - Arrow keys pan the focused map.
     - Enter on a pin opens its preview, and Escape returns focus to that pin.
     - tabsToFirstCard ≤ 20 via a "Skip to results" link.
2. **Keep the user's place, and make "this exact view" true.**
   - Snapshot the centre, zoom, list scroll and opener before opening the detail, restore them on Escape, Close and Back, and don't scroll the page on desktop.
   - Write `&ll=lat,lng,z` into shared links.
   - On desktop, pad the deep-link centre past the 560 px sheet.
   - Acceptance:
     - Round-trip viewKept is true on 8 of 8 pairs, listScrollAfter equals listScrollBefore, and focusAfterClose is the opener card, never BODY.
     - The desktop scrollY is 0 after close, with no sticky overlap.
     - T5-d / T5-m report mapViewInUrl true, and the reopened view is within 0.002° and the same zoom.
     - Desktop deep-link pinUnderSheet is false on all 4 pages.
3. **Make the list honest about the map.**
   - After locate-me, switch the sort to Nearest and show distances on cards.
   - Never list places outside the bounds under an "in this map area" label.
   - On phone, mark the count as stale, or update it live, after a zoom or pan.
   - Remove the "numbered to match the map" copy and the duplicate "Must see ×" chip.
   - Acceptance:
     - T3-d and T3-m listShows.top[0] is Nonbei Yokochō, all of the top 5 are within 1.2 km, and each shows a distance.
     - m-light-zoom2 countLine equals the places in bounds.
     - T1 shows one Must-see control.
     - No "numbered to match" string on the page.

### Blocker / High findings
- **High: map and pins are still effectively not keyboard-reachable.**
  - The pins are now focusable (`keyboard:!0`, aria-label, `a.pp:focus-visible`), but the map pane is the last thing in the DOM.
  - tabsToFirstPin and mapFocusableAt are both −1 within 46 stops, on Tokyo and Cleveland.
  - The visual order (map first) doesn't match the focus order (WCAG 2.4.3).
- **High: the detail round-trip loses the view and sometimes focus.**
  - viewKept is false on 7 of 8 pairs.
  - Focus lands on BODY on New York desktop and phone and on Cleveland phone.
  - The desktop page scrolls and the sticky chrome overlaps (tokyo-1440-after-detail-close.jpg).
- **High: sharing is misleading.**
  - The toast says "it opens this exact view", but mapViewInUrl is false (T5-d / T5-m).
  - The place link's pin is under the sheet on 8 of 8 pairs, a regression from 7 of 8 (pages.*.d-deeplink pinUnderSheet).
- **High: "in this map area" is false after locate-me.** The desktop list leads with Minato-ku places, and the phone carousel leads with Chiyoda-ku Isegen under "List · 10", while the map shows Shibuya (tasks.T3-d / T3-m listShows).
- **High: body text is still 12 px.** Card, credit and preview text is min and median 12 px (fontSizes.card median 12; d-light-select preview fs).
- **High (process): the acceptance probe can still say PASS where the panel fails.**
  - "preview → place detail (#p=, view kept)" PASSes, but it checks only the preview path. The card path the panel measured loses the view on every desktop page, Chinatown included (d-roundtrip viewKept false).
  - "every pin is a link … one Tab stop" PASSes, but a pin is only reached after the entire list.
  - "#view=atlas&p= opens the detail with the place on the map" PASSes, but the pin is under the sheet.
  - The R1 false pass on the phone credit is now genuinely fixed (locateCoveredBy null).
- **Note, not scored:** the phone loads 1,990 KB raw / 862 KB gzipped of text on Tokyo, more than desktop's 1,731 / 603, with 2,577 nodes. That's heavy for a first map screen on a mobile connection.

---

<!-- return 3 of 4 -->
## FE
### Scores
| Row | Max | Prev | Score | Evidence for each point lost (and for any move > 3) |
|---|---|---|---|---|
| R1 Map-first composition | 15 | 9 | 9.5 | **Plus:** on phone the credit is now one line and the controls moved to the bottom-right. That takes the phone's clear map from 59 % back to 64 % (EVIDENCE first-screen table). You see named places, not numbers.<br>**−3:** the desktop chrome above the map is still 208 px, against about 120 (chromeAbovePx 208 on every 1440 row; tokyo-1440-light-default.jpg).<br>**−1.5:** the desktop map is 46 / 44 % of the first screen (box / clear). Its 60 % width only just meets the bar.<br>**−1:** the phone's clear map is 64 % against a 75 % target, though the map box is 92 % (mapClearPct 64 on every 390 row). |
| R2 Pin/cluster legibility | 20 | 14.5 | 18 | **Move +3.5.** Fixed since R1:<br>• Closed places are marked on the map. The pp-x pin is labelled "Heinen's Downtown · Closed" (tasks.T4-closed.pinClassAtPlace), and closed dots are slashed (cleveland-390-after-detail-close.jpg, real/R2/cleveland-390-light-1-default.jpg).<br>• Dots now show kind and tier: sun rings for must-sees, squares for food, grey circles for sights (real/R2/tokyo-390-light-1-default.jpg).<br>• On phone, names survive zooming better: Cleveland went from 1 to 4, New York from 2 to 5 (EVIDENCE zoom table).<br>• Labels are 14 px, with 16 px glyphs (fontSizes.pin min 14; fe-a.css `.pp .ico{width:16px}`).<br>• Every first screen still has 0 numbered labels and 0 clusters.<br>**−1:** dense carpets of dots in central Tokyo and Manhattan, with dots overlapping each other (canvas.dotsShown 354 / 340 at 390; real/R2/tokyo-390-light-1-default.jpg, real/R2/newyork-390-light-1-default.jpg).<br>**−0.5:** zooming in on phone still thins the names: Cleveland shows 4 names among 30 dots, Chinatown 1 (m-light-zoom2 namedLabels, canvas.dotsShown).<br>**−0.5:** cards and the carousel carry rank numbers ("1…n", "★ 7") that the pins don't show, yet the area card says "numbered to match the map" (T2-tokyo-1440-lunch.jpg, T2-tokyo-390-lunch.jpg). |
| R3 Searching with the map | 15 | 8.5 | 9 | **Plus:** on desktop, live search is honest after a pan (d-light-pan Tokyo 80→61, New York 136→58), and "Show all" restores every place. On phone, "Search this area" no longer collides with the credit (tokyo-390-light-zoomed.jpg).<br>**−2.5:** after locate-me in Shibuya, the list isn't the map's area (tasks.T3-d / T3-m listShows vs truth; T3-tokyo-1440-food-near.jpg, T3-tokyo-390-food-near.jpg):<br>• Desktop reads "23 places in this map area" and leads with Toraya Akasaka and Myojaku in Minato-ku.<br>• Phone reads "List · 10" and leads with Isegen in Chiyoda-ku.<br>• Nonbei Yokochō (90 m, tier 1) is a named pin next to the location dot but never comes first.<br>• Cards show no distances, and "Nearest to me" isn't applied.<br>**−2:** counts stack up. One view shows "379 places in this map area", "109 more outside", "Show all 488", the chip counts and "43 places · area 1 of 13" (tokyo-1440-light-default.jpg). With Must see on, it adds "177 places across 13 areas", "Show all 177" and a second "Show all 488" (T1-tokyo-1440-saved.jpg).<br>**−1:** a duplicate "Must see ×" chip sits beside the "Must see" toggle (T1-tokyo-1440-saved.jpg, T1-tokyo-390-must-see.jpg).<br>**−0.5:** on phone, the count still says "351 places in this map area" after two zoom steps with only 45 dots in view, until you tap "Search this area" (m-light-zoom2 countLine; tokyo-390-light-list-mode.jpg). |
| R4 Card ↔ pin ↔ preview ↔ detail | 15 | 7.5 | 7 | **Plus:**<br>• Hover and focus sync both ways (cardFocusLightsPin true; probe hover checks PASS).<br>• The preview no longer covers its pin (tokyo-1440-light-pin-selected.jpg).<br>• Enter on a pin opens its preview with focus kept on the pin, and Escape returns to it (keyboard-deep-tokyo).<br>• The detail rank now agrees with the list ("No. 1 of 43", tokyo-1440-deeplink.jpg).<br>**−3:** closing the detail never restores the view. Tokyo goes from z 13.5 to 15 on desktop and z 13 to 15 on phone, Cleveland z 14 to 15, New York z 13 to 15, and Chinatown desktop shifts about 280 m (viewKept false on 7 of 8). The desktop page also scrolls (tokyo-1440-after-detail-close.jpg).<br>**−1.5:** focus lands on BODY after closing, on New York desktop and phone and on Cleveland phone (focusAfterClose).<br>**−1.5:** the deep-linked pin sits under the panel on 8 of 8 pairs, up from 7 of 8. On desktop the 560 px sheet covers the map centre, where the pin is (pinUnderSheet true, pinOffsetFromCentrePx 1; tokyo-1440-deeplink.jpg).<br>**−1:** one place carries four different numbers. Sensō-ji is card 4, "pin 4", "No. 21 of 44 in Taitō-ku" and "257 of 488 in this Atlas view" (T5-tokyo-1440-share.jpg).<br>**−1:** the toast says "it opens this exact view", but mapViewInUrl is false. The link reopens at z 12.5 instead of Asakusa at z 15 (tasks.T5-d / T5-m). |
| R5 Phone experience | 15 | 8 | 11.5 | **Move +3.5.** Fixed since R1:<br>• A real tap on locate-me now hits it (tasks.T3-m.locateCoveredBy null; in R1 the attribution caught it).<br>• The credit is one line at the bottom-left.<br>• Key, base switch and locate sit bottom-right at about 58–70 % of the screen height, within thumb reach (real/R2/tokyo-390-light-1-default.jpg).<br>• "Search this area" clears the credit.<br>• The carousel and pins stay in sync both ways (probe swipe and pin checks PASS; tokyo-390-light-pin-selected.jpg), List/Map works, and overflowX is 0.<br>**−1:** the carousel shows one card per screen, so it takes two swipes to read three names (tasks.T1-m log).<br>**−1:** there's no area control on the first screen, so the half-day task stays city-wide (T2-tokyo-m and T2-cleveland-m areaFound false; T2-tokyo-390-lunch.jpg).<br>**−1:** the clear map is 64 % at 390 and 38 % at 200 %. At 200 % the chip row covers the Key control and the carousel takes the lower third (z200-default mapClearPct 38; tokyo-200pct-default.jpg, newyork-200pct-default.jpg).<br>**−0.5:** after locate-me, the carousel leads with Isegen (Chiyoda-ku), which isn't on the map you're looking at (T3-tokyo-390-food-near.jpg). |
| R6 Visual craft | 10 | 7 | 6.5 | **Plus:** the Esri gray canvas is calm in light and dark and suits the sun/ink palette (real/R2/tokyo-1440-light-1-default.jpg, tokyo-1440-dark-1-default.jpg, tokyo-390-dark-3-pin.jpg). Pins, chips, carousel and preview read as one family.<br>**−1.5:** many previews and cards show an empty cover with a glyph instead of a photo (real/R2/cleveland-1440-light-3-pin.jpg, real/R2/tokyo-1440-dark-3-pin.jpg, T3-tokyo-1440-food-near.jpg, T2-tokyo-1440-lunch.jpg).<br>**−1:** after a detail round-trip or a keyboard card focus, the desktop page scrolls and the sticky chrome overlaps. The chip row shows through under the header, and the count line and Satellite button are cut (tokyo-1440-after-detail-close.jpg, newyork-1440-after-detail-close.jpg, tokyo-1440-keyboard-card-focus.jpg).<br>**−1:** small layout defects on phone:<br>• In the header, the breadcrumb chevron runs into the country name ("United States›New Yo…") on New York, Cleveland and Chinatown (newyork-390-light-default.jpg, real/R2/newyork-390-light-1-default.jpg, chinatown-390-light-zoomed.jpg).<br>• The focus ring on a carousel card title renders as a broken bracket (tokyo-390-after-detail-close.jpg).<br>• An empty band sits under the tiles-blocked list (tokyo-390-tiles-blocked.jpg). |
| R7 Trust & access | 10 | 5.5 | 6.5 | **Plus:**<br>• Sources show on cards, preview and detail.<br>• Closures are flagged on the card, the detail and now the map.<br>• Every page has 0 contrast fails.<br>• Reduced motion is honoured (city.js `matchMedia('(prefers-reduced-motion: reduce)')`, atlas.js `animate:!e.still()`).<br>• With tiles or the library blocked, every place is still listed (488 / 194 / 16 / 508, 0 errors; tokyo-1440-library-blocked.jpg).<br>• Corrected keyboard facts: every named pin is a Tab stop with a name, kind and tier label and a visible ring, and arrow keys pan the focused map (keyboard-deep-tokyo, keyboard-deep-cleveland).<br>**−1.5:** card, preview and credit text is still 12 px at min and median (fontSizes.card median 12; d-light-select preview fs 12).<br>**−0.5:** 26 targets on the Tokyo 1440 first screen are under 44 px. The 16 pins have a 44 px hit area (fe-a.css `.pp>span::before{inset:-6px -2px}`), but credit links are only 15 px tall (targets.examples "CC BY 2.0 58×15").<br>**−1:** there's no skip link to the map or the results. The map is Tab stop 226 and the first pin 227, about 190 stops after the first card, while the map comes first visually (keyboard-deep-tokyo mapFocusableAt 226, tabsToFirstPin 227).<br>**−0.5:** the search input has no focus ring (stopsWithoutVisibleRing 1, reconfirmed in the erratum). |
| **TOTAL** | 100 | **60** | **68** | |

**Erratum changes:** only R7 used the keyboard facts. I hadn't returned yet, so I scored it on the corrected facts directly. The keyboard loss is −1, not the −2 that a "no keyboard path" reading carries: the path is complete and well labelled, but it sits about 190 stops in with no skip link. R4 keeps its score, with pin Enter/Escape counted as a plus. I reworded T6 and the keyboard High finding, and dropped "one Tab stop per pin" from the list of false probe passes.

### Task results
- **T1: yes on desktop (5 steps), partly on phone (7 steps).**
  - The first screen names must-sees on the map: Imperial Palace East Gardens, Edo-Tokyo Museum, Tsukiji Hongan-ji, Tokyo National Museum (tokyo-1440-light-default.jpg).
  - Saving two works. Saved reads 2, and the saved pins get heart badges on the map (T1-tokyo-1440-saved.jpg).
  - There's no open-now or "tonight" signal, so I had to read card text to pick one for tonight.
  - On phone, the duplicate "Must see ×" / "Must see" chips confused me, and reading three names took two swipes (T1-tokyo-390-must-see.jpg).
- **T2: yes on desktop (3 steps), partly on phone (2 steps, no area).**
  - On desktop, "Taitō-ku 44" then "Eat & drink" gives 23 places, led by Usagiya, Yanaka Ginza and Komagata Dozeu. Cleveland: University Circle 59 → 15.
  - The area card's "numbered to match the map" confused me, because the map has no numbers. Most food cards have no photo (T2-tokyo-1440-lunch.jpg).
  - On phone there's no area control on the first screen, so the results stayed city-wide: 187 in Tokyo, 24 in Cleveland (T2-tokyo-m areaFound false).
- **T3: partly (3 steps).**
  - Locate-me is now tappable on phone (locateCoveredBy null) and centres Shibuya at z 15.
  - Nonbei Yokochō and The Bellwood are named pins next to the location dot.
  - But the desktop list leads with Toraya Akasaka (Minato-ku), and the phone carousel leads with Isegen (Chiyoda-ku) under "List · 10".
  - Cards show no distances, and the "Nearest to me" sort exists but isn't applied (T3-tokyo-1440-food-near.jpg, T3-tokyo-390-food-near.jpg).
- **T4: partly.**
  - The card and detail are clear: "Closed — kept for the record · checked 2026-08-10 · per Signal Cleveland and TheStreet".
  - The map now marks the place: a "· Closed" pin at the deep-link zoom, and slashed dots when zoomed out.
  - Coming back doesn't restore the view (Cleveland z 14 to 15, list scroll +23 px), and on Cleveland phone focus drops to BODY (T4-cleveland-1440-closed-place.jpg, cleveland d- / m-roundtrip).
- **T5: partly.**
  - The place link (`#view=atlas&p=senso-ji`) reopens the detail, but its pin is under the panel (8 of 8).
  - A map-view link isn't possible. The toast still promises "this exact view", but the link reopens at z 12.5 instead of Asakusa at z 15 (T5-tokyo-1440-reopen-view.jpg; mapViewInUrl false).
- **T6: partly.**
  - **Keyboard.** The first card is Tab stop 39 on Tokyo and 30 on Cleveland. Enter opens the detail with focus on Close, Escape returns to the card, and focusing a card lights its pin. Per the erratum, the map (stop 226) and the pins (from 227) are fully usable: labelled, ringed, Enter opens the preview, Escape returns to the pin, and arrow keys pan. But there's no skip link, so you Tab through every card first. The search input shows no ring.
  - **200 %.** There's no overflow, but only 38 % of the map is clear, and the chip row covers the Key control (tokyo-200pct-default.jpg).
  - **Library blocked.** Excellent: every place is listed, there's a dot-plot stand-in with a notice, and 0 errors (tokyo-1440-library-blocked.jpg).

### Top three fixes
1. **Put the map within reach of the keyboard.**
   - Add "Skip to map" and "Skip to results" links, or move the map pane ahead of the list in DOM order so that it matches the visual order.
   - Give the search wrapper a visible ring.
   - Acceptance:
     - On Tokyo desktop, from page top, the first pin is reached in 12 or fewer Tab stops (keyboard-deep-tokyo tabsToFirstPin ≤ 12, mapFocusableAt ≤ 15).
     - tabsToFirstCard is ≤ 20, and stopsWithoutVisibleRing is 0.
     - focusAfterClose is the opening card on all 8 round-trip pairs, never BODY.
2. **Keep the user's place, and make "this exact view" true.**
   - Snapshot the centre, zoom, list scroll and opener before opening the detail, and restore all of them on Escape, Close and Back, without scrolling the page.
   - Write `&ll=lat,lng,z` into shared links.
   - Offset the deep-link centre so the pin sits in the map area the sheet doesn't cover.
   - Acceptance:
     - viewKept is true on 8 of 8 round-trips, listScrollAfter equals listScrollBefore, and desktop scrollY is 0 after closing.
     - T5-d / T5-m report mapViewInUrl true, and the reopened view is within 0.002° at the same zoom.
     - pinUnderSheet is false on all 4 desktop deep links.
3. **Make the list honest about the map after locate and zoom.**
   - Locate-me should switch the sort to Nearest and show distances on cards.
   - The phone count shouldn't claim "in this map area" while it's stale.
   - Remove the "numbered to match the map" copy and the duplicate "Must see ×" chip.
   - Acceptance:
     - T3-d and T3-m listShows.top[0] is Nonbei Yokochō, all top 5 are within 1.2 km, and every card shows a distance.
     - The m-light-zoom2 countLine matches the places in view, or reads as stale until "Search this area" is tapped.
     - T1 shows exactly one Must-see control.

### Blocker / High findings
- **High: the detail round-trip loses the map view, and sometimes focus.**
  - viewKept is false on 7 of 8 pairs, focus lands on BODY on 3 pairs, and the desktop page scrolls under the sticky chrome.
  - Evidence: d- / m-roundtrip; tokyo-1440-after-detail-close.jpg, newyork-1440-after-detail-close.jpg.
- **High: deep links and sharing mislead.**
  - The deep-linked pin is under the detail panel on 8 of 8 pairs, a regression from 7 of 8.
  - The share toast promises "this exact view", but mapViewInUrl is false (d-deeplink; tasks.T5-d / T5-m).
- **High: after locate-me, the list and carousel aren't the map's area.**
  - "23 places in this map area" leads with Minato-ku places, and "List · 10" leads with Isegen in Chiyoda.
  - The nearest tier-1 place, 90 m away, never comes first (tasks.T3-d / T3-m listShows vs truth).
- **High: map and pins are keyboard-usable but only after the whole list.**
  - They're about 190 stops after the first card (Tab stop 226 / 227), with no skip link. The visual order (map first) and the DOM order (map last) disagree (keyboard-deep-tokyo).
  - The pins themselves are well built: labelled, ringed, Enter/Escape and arrow-key pan all work.
- **High: card, preview and credit text is still 12 px** (fontSizes.card median 12; d-light-select preview fs 12).
- **High (process): the front-end acceptance probe still passes a view check the panel fails.**
  - "preview → place detail (#p=, view kept)" PASSes on every page, but it only covers the preview path. The card path the panel measured loses the view on every desktop page (d-roundtrip viewKept false).
  - "#view=atlas&p= opens the detail with the place on the map" PASSes while pinUnderSheet is true on 8 of 8.
  - The R1 credit/locate false pass is now genuinely fixed (locateCoveredBy null).

---

<!-- return 4 of 4 -->
## FE
### Scores
| Row | Max | Prev | Score | Evidence for each point lost (and for any move > 3) |
|---|---|---|---|---|
| R1 Map-first composition | 15 | 9 | 9.5 | **Plus:** on phone the credit is now one line and the controls moved to the bottom-right. That takes the phone's clear map from 59 % back to 64 % (EVIDENCE first-screen table). You see named places, not numbers.<br>**−3:** the desktop chrome above the map is still 208 px, against about 120 (chromeAbovePx 208 on every 1440 row; tokyo-1440-light-default.jpg).<br>**−1.5:** the desktop map is 46 / 44 % of the first screen (box / clear). Its 60 % width only just meets the bar.<br>**−1:** the phone's clear map is 64 % against a 75 % target, though the map box is 92 % (mapClearPct 64 on every 390 row). |
| R2 Pin/cluster legibility | 20 | 14.5 | 18 | **Move +3.5.** Fixed since R1:<br>• Closed places are marked on the map. The pp-x pin is labelled "Heinen's Downtown · Closed" (tasks.T4-closed.pinClassAtPlace), and closed dots are slashed (cleveland-390-after-detail-close.jpg, real/R2/cleveland-390-light-1-default.jpg).<br>• Dots now show kind and tier: sun rings for must-sees, squares for food, grey circles for sights (real/R2/tokyo-390-light-1-default.jpg).<br>• On phone, names survive zooming better: Cleveland went from 1 to 4, New York from 2 to 5 (EVIDENCE zoom table).<br>• Labels are 14 px, with 16 px glyphs (fontSizes.pin min 14; fe-a.css `.pp .ico{width:16px}`).<br>• Every first screen still has 0 numbered labels and 0 clusters.<br>**−1:** dense carpets of dots in central Tokyo and Manhattan, with dots overlapping each other (canvas.dotsShown 354 / 340 at 390; real/R2/tokyo-390-light-1-default.jpg, real/R2/newyork-390-light-1-default.jpg).<br>**−0.5:** zooming in on phone still thins the names: Cleveland shows 4 names among 30 dots, Chinatown 1 (m-light-zoom2 namedLabels, canvas.dotsShown).<br>**−0.5:** cards and the carousel carry rank numbers ("1…n", "★ 7") that the pins don't show, yet the area card says "numbered to match the map" (T2-tokyo-1440-lunch.jpg, T2-tokyo-390-lunch.jpg). |
| R3 Searching with the map | 15 | 8.5 | 9 | **Plus:** on desktop, live search is honest after a pan (d-light-pan Tokyo 80→61, New York 136→58), and "Show all" restores every place. On phone, "Search this area" no longer collides with the credit (tokyo-390-light-zoomed.jpg).<br>**−2.5:** after locate-me in Shibuya, the list isn't the map's area (tasks.T3-d / T3-m listShows vs truth; T3-tokyo-1440-food-near.jpg, T3-tokyo-390-food-near.jpg):<br>• Desktop reads "23 places in this map area" and leads with Toraya Akasaka and Myojaku in Minato-ku.<br>• Phone reads "List · 10" and leads with Isegen in Chiyoda-ku.<br>• Nonbei Yokochō (90 m, tier 1) is a named pin next to the location dot but never comes first.<br>• Cards show no distances, and "Nearest to me" isn't applied.<br>**−2:** counts stack up. One view shows "379 places in this map area", "109 more outside", "Show all 488", the chip counts and "43 places · area 1 of 13" (tokyo-1440-light-default.jpg). With Must see on, it adds "177 places across 13 areas", "Show all 177" and a second "Show all 488" (T1-tokyo-1440-saved.jpg).<br>**−1:** a duplicate "Must see ×" chip sits beside the "Must see" toggle (T1-tokyo-1440-saved.jpg, T1-tokyo-390-must-see.jpg).<br>**−0.5:** on phone, the count still says "351 places in this map area" after two zoom steps with only 45 dots in view, until you tap "Search this area" (m-light-zoom2 countLine; tokyo-390-light-list-mode.jpg). |
| R4 Card ↔ pin ↔ preview ↔ detail | 15 | 7.5 | 7 | **Plus:**<br>• Hover and focus sync both ways (cardFocusLightsPin true; probe hover checks PASS).<br>• The preview no longer covers its pin (tokyo-1440-light-pin-selected.jpg).<br>• Enter on a pin opens its preview with focus kept on the pin, and Escape returns to it (keyboard-deep-tokyo).<br>• The detail rank now agrees with the list ("No. 1 of 43", tokyo-1440-deeplink.jpg).<br>**−3:** closing the detail never restores the view. Tokyo goes from z 13.5 to 15 on desktop and z 13 to 15 on phone, Cleveland z 14 to 15, New York z 13 to 15, and Chinatown desktop shifts about 280 m (viewKept false on 7 of 8). The desktop page also scrolls (tokyo-1440-after-detail-close.jpg).<br>**−1.5:** focus lands on BODY after closing, on New York desktop and phone and on Cleveland phone (focusAfterClose).<br>**−1.5:** the deep-linked pin sits under the panel on 8 of 8 pairs, up from 7 of 8. On desktop the 560 px sheet covers the map centre, where the pin is (pinUnderSheet true, pinOffsetFromCentrePx 1; tokyo-1440-deeplink.jpg).<br>**−1:** one place carries four different numbers. Sensō-ji is card 4, "pin 4", "No. 21 of 44 in Taitō-ku" and "257 of 488 in this Atlas view" (T5-tokyo-1440-share.jpg).<br>**−1:** the toast says "it opens this exact view", but mapViewInUrl is false. The link reopens at z 12.5 instead of Asakusa at z 15 (tasks.T5-d / T5-m). |
| R5 Phone experience | 15 | 8 | 11.5 | **Move +3.5.** Fixed since R1:<br>• A real tap on locate-me now hits it (tasks.T3-m.locateCoveredBy null; in R1 the attribution caught it).<br>• The credit is one line at the bottom-left.<br>• Key, base switch and locate sit bottom-right at about 58–70 % of the screen height, within thumb reach (real/R2/tokyo-390-light-1-default.jpg).<br>• "Search this area" clears the credit.<br>• The carousel and pins stay in sync both ways (probe swipe and pin checks PASS; tokyo-390-light-pin-selected.jpg), List/Map works, and overflowX is 0.<br>**−1:** the carousel shows one card per screen, so it takes two swipes to read three names (tasks.T1-m log).<br>**−1:** there's no area control on the first screen, so the half-day task stays city-wide (T2-tokyo-m and T2-cleveland-m areaFound false; T2-tokyo-390-lunch.jpg).<br>**−1:** the clear map is 64 % at 390 and 38 % at 200 %. At 200 % the chip row covers the Key control and the carousel takes the lower third (z200-default mapClearPct 38; tokyo-200pct-default.jpg, newyork-200pct-default.jpg).<br>**−0.5:** after locate-me, the carousel leads with Isegen (Chiyoda-ku), which isn't on the map you're looking at (T3-tokyo-390-food-near.jpg). |
| R6 Visual craft | 10 | 7 | 6.5 | **Plus:** the Esri gray canvas is calm in light and dark and suits the sun/ink palette (real/R2/tokyo-1440-light-1-default.jpg, tokyo-1440-dark-1-default.jpg, tokyo-390-dark-3-pin.jpg). Pins, chips, carousel and preview read as one family.<br>**−1.5:** many previews and cards show an empty cover with a glyph instead of a photo (real/R2/cleveland-1440-light-3-pin.jpg, real/R2/tokyo-1440-dark-3-pin.jpg, T3-tokyo-1440-food-near.jpg, T2-tokyo-1440-lunch.jpg).<br>**−1:** after a detail round-trip or a keyboard card focus, the desktop page scrolls and the sticky chrome overlaps. The chip row shows through under the header, and the count line and Satellite button are cut (tokyo-1440-after-detail-close.jpg, newyork-1440-after-detail-close.jpg, tokyo-1440-keyboard-card-focus.jpg).<br>**−1:** small layout defects on phone:<br>• In the header, the breadcrumb chevron runs into the country name ("United States›New Yo…") on New York, Cleveland and Chinatown (newyork-390-light-default.jpg, real/R2/newyork-390-light-1-default.jpg, chinatown-390-light-zoomed.jpg).<br>• The focus ring on a carousel card title renders as a broken bracket (tokyo-390-after-detail-close.jpg).<br>• An empty band sits under the tiles-blocked list (tokyo-390-tiles-blocked.jpg). |
| R7 Trust & access | 10 | 5.5 | 7 | **Plus:**<br>• Sources show on cards, preview and detail.<br>• Closures are flagged on the card, the detail and now the map.<br>• Every page has 0 contrast fails.<br>• Reduced motion is honoured (city.js `matchMedia('(prefers-reduced-motion: reduce)')`, atlas.js `animate:!e.still()`).<br>• With tiles or the library blocked, every place is still listed (488 / 194 / 16 / 508, 0 errors; tokyo-1440-library-blocked.jpg).<br>• Per the erratum: every named pin is a Tab stop with a name, kind and tier label and a visible ring, and arrow keys pan the focused map (keyboard-deep-tokyo, keyboard-deep-cleveland).<br>• The search box shows a 2 px ring through `.spill:focus-within` (fe-a.css; erratum item 2).<br>**−1.5:** card, preview and credit text is still 12 px at min and median (fontSizes.card median 12; d-light-select preview fs 12).<br>**−0.5:** 26 targets on the Tokyo 1440 first screen are under 44 px. The 16 pins have a 44 px hit area (fe-a.css `.pp>span::before{inset:-6px -2px}`), but credit links are only 15 px tall (targets.examples "CC BY 2.0 58×15").<br>**−1:** there's no skip link to the map or the results. The map is Tab stop 226 and the first pin 227, about 190 stops after the first card, while the map comes first visually (keyboard-deep-tokyo mapFocusableAt 226, tabsToFirstPin 227). |
| **TOTAL** | 100 | **60** | **68.5** | |

**Erratum changes:**
- **Keyboard (item 1).** My first return (68.0) already used the corrected facts. I scored the keyboard loss in R7 at −1 (a complete, labelled path, but about 190 stops in with no skip link), and R4 counted the pin Enter/Escape behaviour as a plus.
- **Search ring (item 2).** This one moves a score. I've removed the −0.5 for the search input having no focus ring, because the wrapper's `.spill:focus-within` ring is now verified (fe-a.css).
- **Result.** R7 goes from 6.5 to 7 and the total from 68.0 to 68.5. No other row changed. In T6 and Top fix 1, I dropped the search-ring claim.

### Task results
- **T1: yes on desktop (5 steps), partly on phone (7 steps).**
  - The first screen names must-sees on the map: Imperial Palace East Gardens, Edo-Tokyo Museum, Tsukiji Hongan-ji, Tokyo National Museum (tokyo-1440-light-default.jpg).
  - Saving two works. Saved reads 2, and the saved pins get heart badges on the map (T1-tokyo-1440-saved.jpg).
  - There's no open-now or "tonight" signal, so I had to read card text to pick one for tonight.
  - On phone, the duplicate "Must see ×" / "Must see" chips confused me, and reading three names took two swipes (T1-tokyo-390-must-see.jpg).
- **T2: yes on desktop (3 steps), partly on phone (2 steps, no area).**
  - On desktop, "Taitō-ku 44" then "Eat & drink" gives 23 places, led by Usagiya, Yanaka Ginza and Komagata Dozeu. Cleveland: University Circle 59 → 15.
  - The area card's "numbered to match the map" confused me, because the map has no numbers. Most food cards have no photo (T2-tokyo-1440-lunch.jpg).
  - On phone there's no area control on the first screen, so the results stayed city-wide: 187 in Tokyo, 24 in Cleveland (T2-tokyo-m areaFound false).
- **T3: partly (3 steps).**
  - Locate-me is now tappable on phone (locateCoveredBy null) and centres Shibuya at z 15.
  - Nonbei Yokochō and The Bellwood are named pins next to the location dot.
  - But the desktop list leads with Toraya Akasaka (Minato-ku), and the phone carousel leads with Isegen (Chiyoda-ku) under "List · 10".
  - Cards show no distances, and the "Nearest to me" sort exists but isn't applied (T3-tokyo-1440-food-near.jpg, T3-tokyo-390-food-near.jpg).
- **T4: partly.**
  - The card and detail are clear: "Closed — kept for the record · checked 2026-08-10 · per Signal Cleveland and TheStreet".
  - The map now marks the place: a "· Closed" pin at the deep-link zoom, and slashed dots when zoomed out.
  - Coming back doesn't restore the view (Cleveland z 14 to 15, list scroll +23 px), and on Cleveland phone focus drops to BODY (T4-cleveland-1440-closed-place.jpg, cleveland d- / m-roundtrip).
- **T5: partly.**
  - The place link (`#view=atlas&p=senso-ji`) reopens the detail, but its pin is under the panel (8 of 8).
  - A map-view link isn't possible. The toast still promises "this exact view", but the link reopens at z 12.5 instead of Asakusa at z 15 (T5-tokyo-1440-reopen-view.jpg; mapViewInUrl false).
- **T6: partly.**
  - **Keyboard.** The first card is Tab stop 39 on Tokyo and 30 on Cleveland. Enter opens the detail with focus on Close, Escape returns to the card, and focusing a card lights its pin. The search box shows its ring on the wrapper.
    - The map (stop 226) and the pins (from 227) are fully usable: labelled, with a visible ring. Enter opens the preview, Escape returns to the pin, and arrow keys pan.
    - But there's no skip link, so you Tab through every card first.
  - **200 %.** There's no overflow, but only 38 % of the map is clear, and the chip row covers the Key control (tokyo-200pct-default.jpg).
  - **Library blocked.** Excellent: every place is listed, there's a dot-plot stand-in with a notice, and 0 errors (tokyo-1440-library-blocked.jpg).

### Top three fixes
1. **Put the map within reach of the keyboard.**
   - Add "Skip to map" and "Skip to results" links, or move the map pane ahead of the list in DOM order so that it matches the visual order.
   - Restore focus to the opener after the detail closes.
   - Acceptance:
     - On Tokyo desktop, from page top, the first pin is reached in 12 or fewer Tab stops (keyboard-deep-tokyo tabsToFirstPin ≤ 12, mapFocusableAt ≤ 15).
     - tabsToFirstCard is ≤ 20.
     - focusAfterClose is the opening card on all 8 round-trip pairs, never BODY.
2. **Keep the user's place, and make "this exact view" true.**
   - Snapshot the centre, zoom, list scroll and opener before opening the detail, and restore all of them on Escape, Close and Back, without scrolling the page.
   - Write `&ll=lat,lng,z` into shared links.
   - Offset the deep-link centre so the pin sits in the map area the sheet doesn't cover.
   - Acceptance:
     - viewKept is true on 8 of 8 round-trips, listScrollAfter equals listScrollBefore, and desktop scrollY is 0 after closing.
     - T5-d / T5-m report mapViewInUrl true, and the reopened view is within 0.002° at the same zoom.
     - pinUnderSheet is false on all 4 desktop deep links.
3. **Make the list honest about the map after locate and zoom.**
   - Locate-me should switch the sort to Nearest and show distances on cards.
   - The phone count shouldn't claim "in this map area" while it's stale.
   - Remove the "numbered to match the map" copy and the duplicate "Must see ×" chip.
   - Acceptance:
     - T3-d and T3-m listShows.top[0] is Nonbei Yokochō, all top 5 are within 1.2 km, and every card shows a distance.
     - The m-light-zoom2 countLine matches the places in view, or reads as stale until "Search this area" is tapped.
     - T1 shows exactly one Must-see control.

### Blocker / High findings
- **High: the detail round-trip loses the map view, and sometimes focus.**
  - viewKept is false on 7 of 8 pairs, focus lands on BODY on 3 pairs, and the desktop page scrolls under the sticky chrome.
  - Evidence: d- / m-roundtrip; tokyo-1440-after-detail-close.jpg, newyork-1440-after-detail-close.jpg.
- **High: deep links and sharing mislead.**
  - The deep-linked pin is under the detail panel on 8 of 8 pairs, a regression from 7 of 8.
  - The share toast promises "this exact view", but mapViewInUrl is false (d-deeplink; tasks.T5-d / T5-m).
- **High: after locate-me, the list and carousel aren't the map's area.**
  - "23 places in this map area" leads with Minato-ku places, and "List · 10" leads with Isegen in Chiyoda.
  - The nearest tier-1 place, 90 m away, never comes first (tasks.T3-d / T3-m listShows vs truth).
- **High: map and pins are keyboard-usable but only after the whole list.**
  - They're about 190 stops after the first card (Tab stop 226 / 227), with no skip link. The visual order (map first) and the DOM order (map last) disagree (keyboard-deep-tokyo).
  - The pins themselves are well built: labelled, ringed, Enter/Escape and arrow-key pan all work.
- **High: card, preview and credit text is still 12 px** (fontSizes.card median 12; d-light-select preview fs 12).
- **High (process): the front-end acceptance probe still passes a view check the panel fails.**
  - "preview → place detail (#p=, view kept)" PASSes on every page, but it only covers the preview path. The card path the panel measured loses the view on every desktop page (d-roundtrip viewKept false).
  - "#view=atlas&p= opens the detail with the place on the map" PASSes while pinUnderSheet is true on 8 of 8.
  - The R1 credit/locate false pass is now genuinely fixed (locateCoveredBy null).

---

<!-- final confirmation: R7 re-score for erratum item 2 -->
FE confirmed R7 = 7 and TOTAL = 68.5 after erratum item 2: the wrapper's `.spill:focus-within` ring counts, and the
Atlas `box-shadow:none!important` override applies only to `#cleo-filter`. The keyboard loss stays at −1, for the
missing skip link, with the map about 190 stops in. Nothing else changes.
