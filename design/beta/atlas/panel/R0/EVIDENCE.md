# Atlas review panel — round 0 evidence pack

Head under review: `965b7a5cb091097b10bc1fabb3eacaefdb491ae2` (pinned in a clean worktree). Pages: Tokyo
(`beta/cities/tokyo.html`), Cleveland (`beta/cleveland.html`), Chinatown & CBD (`beta/Singapore/chinatown.html`) and
New York (`beta/cities/newyork.html`), opened at `#view=atlas`.

**How it was made.** Headless Chromium (Playwright), the `beta/` tree served from disk on one origin, reduced motion
on. Desktop = 1440×900 at 1×; phone = 390×844 at 2× with touch; 200 % zoom = a 1440×900 window at 200 % (720×450
CSS px at 2×). Every off-origin request is aborted.

**Basemap caveat.** The sandbox cannot reach tile hosts. In `shots/` every map tile is a **flat neutral land colour
(no streets, water or labels)**. The look of the real basemap can't be judged from these shots. No real-tile shots
existed in `design/beta/atlas/real/R0/` when this pack was built. The older shots in `ms/` (made by the front-end
lane's own acceptance probe, `tools/beta/atlas-ms.js`, on the same head) use a *fake street-like* stub tile. They
are not the real basemap either.

## Files

- `measurements.md`: the first-screen table for every page × viewport × theme.
- `measurements.json`: every state the probe recorded:
  - default, zoomed in two steps, a pin selected (with the preview or carousel text), and the list after a pan;
  - phone List mode, tiles blocked, map library blocked;
  - the card → detail → close round-trip, `#p=` fresh loads, 200 % zoom;
  - keyboard-only runs and the persona task runs T1–T5.
- `shots/`: 129 screenshots. Names are `<page>-<1440|390|200pct>-<theme>-<state>.jpg`, plus `T1-…`–`T5-…` for the
  task runs.
- `ms/`: the front-end lane's acceptance probe on the same head. `ms/probe.json` holds its 100 PASS/FAIL checks (all
  PASS), and the `ms/*.jpg` shots include the phone "Search this area" state and dark List mode.
- Probe source: `design/beta/atlas/tools/panel-probe.js`.

## Measurement definitions

- **Map share (box / clear).**
  - *Box* is the share of the first screen covered by the map element.
  - *Clear* is the share of a 12 px sample grid where the map itself is the top element, not a control, chip row,
    card or pill drawn over it.
- **Chrome above the map.** The y-position where the map's clear area starts: the map's top or the bottom of the
  filter bar over it, whichever is lower.
- **Numbered labels.** Visible map markers whose text contains a digit. **Named labels** are markers showing three or
  more letters (a place name).
- **Targets < 44 px.** Visible interactive elements with either side under 44 CSS px. For pins, this is the visible
  pill.
- **Contrast.** WCAG ratios on each visible text node, measured against its first opaque background. Text over
  photos is skipped.
- **First-load KB.** Raw bytes served, and the gzip size of the text assets. Tiles are excluded.

## Key facts (measured, not judged)

**First screen (light; dark gave the same numbers)**

| page | vp | map box / clear % | map width % | chrome above map px | markers (pins / clusters) | numbered | named | nodes |
|---|---|---|---|---|---|---|---|---|
| Tokyo | 1440 | 46 / 45 | 60 | 208 | 54 (16 / 38) | 54 | 0 | 2,693 |
| Tokyo | 390 | 92 / 64 | 100 | 126 | 26 (5 / 21) | 26 | 0 | 2,616 |
| Cleveland | 1440 | 46 / 45 | 60 | 208 | 38 (21 / 17) | 38 | 0 | 2,112 |
| Cleveland | 390 | 92 / 64 | 100 | 126 | 23 (10 / 13) | 23 | 0 | 2,030 |
| Chinatown | 1440 | 46 / 45 | 60 | 208 | 15 (15 / 0) | 15 | 0 | 1,285 |
| Chinatown | 390 | 92 / 64 | 100 | 126 | 15 (15 / 0) | 15 | 0 | 1,281 |
| New York | 1440 | 46 / 45 | 60 | 208 | 55 (18 / 37) | 55 | 0 | 2,648 |
| New York | 390 | 92 / 64 | 100 | 126 | 29 (6 / 23) | 29 | 0 | 2,538 |

**At default zoom**

- **Clusters.** The largest phone clusters are Tokyo 156, 90, 40, 35 and New York 193, 51, 30.
- **Zoomed in two steps.** Tokyo desktop shows 26 pins and 53 clusters. New York desktop shows 15 pins and
  33 clusters. No zoom shows a place name on the map.
- **Pin labels.** Each pin is a rank number. Must-sees show "★ n" on a sun fill. Clusters are ink discs with counts.
  Pin and cluster text is 13–14 px.
- **Phone map controls.** There are five: zoom +, zoom −, locate, base switch and key. The attribution chip sits at
  the top left, under the chip row. The "List · N" pill and a one-card carousel sit at the bottom.

**Text, targets and contrast**

- **Text sizes.** The smallest text is 12 px on cards and credits and 12–13 px in the chrome. Card meta and
  "Recommended by" lines are 12–14 px.
- **Targets.**
  - Pin pills are 30–52 × 26 px; cluster discs are 42 × 42.
  - The "Must see" badge links on cards are 88 × 28.
  - Licence links in credits are about 58 × 15.
  - The Tokyo desktop first screen has 64 visible targets under 44 px; 2 of them are under 24 px.
- **Contrast.** The probe found 0 failures, in both themes.

**Selecting places**

- **Desktop pin preview** (300 px wide), as the text reads: "2 Must see within Chiyoda-ku · Yasukuni Shrine ·
  one-line why · Recommended by Wikipedia, [city tourism source], [guide site] · Photo credit". It has a photo when the place has
  one; Cleveland's and New York's samples had none. Its text is 12–18 px.
- **Phone pin tap** selects the pin (ink fill) and scrolls its carousel card into view. A one-card carousel shows
  ★ rank, the photo, the name, "area · kind" and "Recommended by X +n". The thumbnail credit is clipped
  ("Photo: john…").
- **Search as I move the map** is on by default on desktop.
  - Panning changes the count, for example Cleveland 83 → 53 and New York 174 → 44.
  - "N more outside this area. Show all N" is always shown.
  - The list stays grouped by area ("Chiyoda-ku · 43 places · area 1 of 13"), with an area-chip row above it.

**Detail round-trip (card → detail → Escape, and Back)**

- **Desktop.** The detail opens as a 560 px panel over the left part of the map (x ≈ 80–640). The page scrolls about
  100 px, so the filter bar slips under the header. The URL changes to `#p-<id>`.
- **Map view.** Opening the detail flies the map to the place at zoom 15. After Escape or Back the map **stays**
  there; it does not return to the view you had. Tokyo went from z 12.5 at 35.674, 139.716 to z 15 at 35.688,
  139.758. The same happens on phone and on all four pages.
- **List scroll.** The desktop list moved 23–51 px.
- **Focus after Escape.** It went back to the card on Tokyo and Chinatown. On Cleveland and New York it was lost to
  `<body>`.

**Links and failure states**

- **`#view=atlas&p=` fresh load.** The detail opens and the map centres on the place (0–1 px off centre). On every
  page and both viewports except Cleveland desktop, the pin sits **under** the detail panel.
- **Tiles blocked / map library blocked.** On all four pages and both viewports: "Map unavailable right now — every
  place is listed here", every place is in the list (Tokyo 488/488, New York 508/508), and 0 page errors. On phone
  the page opens straight in List mode.
- **200 % zoom.** The phone layout is used. There's no horizontal overflow. 41 % of the screen is clear map. The
  chip row, attribution chip, controls, List pill and a two-card carousel take the rest, and the attribution chip
  overlaps pins.
- **First load** (raw / gzip text): Tokyo 1,757 / 612 KB on desktop and 2,045 / 900 KB on phone; New York 1,891 /
  778 KB on desktop and 1,977 / 864 KB on phone.

**Keyboard (desktop)**

- **Reaching the list.** A card is the 39th Tab stop on Tokyo and the 30th on Cleveland. The path passes the header,
  search, view switch, filter chips, sort, the "Search as I move" checkbox, "Show all" and each area chip. One
  stop (the search input) showed no focus ring.
- **The map.** Map pins and the map itself are **not** in the Tab order. There's no keyboard pan or zoom except the
  zoom buttons.
- **Cards.** Focusing a card lights its pin. Enter opens the detail with focus on Close, and Escape returns focus to
  the card.

## Persona task runs (scripted; see `measurements.json → tasks` and the `T*` shots)

- **T1, Tokyo.** Must-sees, one for tonight, save two.
  - **Phone, 7 steps.** One name is readable on the first screen. After "Must see", the carousel shows one card at a
    time, so reading three names takes two swipes. Two hearts tapped; the Saved count reads 2.
  - **Desktop, 5 steps.** Two names are readable on the first screen.
  - **On the map.** Must-see pins show only "★ n", with no names.
  - **"Tonight".** Some card text mentions hours or evening words, but there's no "open now" filter.
- **T2, half-day in one neighbourhood plus lunch.**
  - **Desktop, 3 steps.** The area chip ("University Circle & East Side 59", "Taitō-ku 44") fits the map and the list.
    "Eat & drink" then gives 15 in Cleveland and 23 in Tokyo.
  - **Phone.** The script found no area chip on the phone first screen; area lives behind the Filters control. A
    day-route entry exists on the page.
- **T3, at a fixed spot in Shibuya (35.6595, 139.7005), the best food within about 15 minutes' walk.**
  - **Locate-me** centres the map there at z 15.
  - **Truth.** There are 12 food places within 1.2 km, the best being Nonbei Yokochō (90 m, tier 1) and The Bellwood
    (640 m, tier 1).
  - **What the list shows.** After "Eat & drink" the desktop list's first cards are in **Minato-ku** (Toraya
    Akasaka, Myojaku …), because the list stays grouped by area in a fixed order. Cards show no distances.
    "Nearest to me" exists in the sort menu and the Filters tray, but locate-me doesn't apply it.
- **T4, a closed place (Cleveland, Heinen's Downtown).**
  - The pin carries a closed class (`pp-x`) but shows only its number, "39".
  - The card and detail say "Closed — kept for the record", with the source.
  - Returning from the detail does not restore the map view (see the round-trip above).
- **T5, sharing.**
  - Share in the detail copies `…tokyo.html#view=atlas&p=<id>` and shows "Link copied — it opens this exact view."
    Reopening it shows the detail with the map centred.
  - The **map view is not in the URL**: a URL copied while looking at Asakusa (z 15) reopens at the city-wide
    default (z 11.5 desktop, 10.5 phone).
- **T6, keyboard, 200 % and library blocked.** See the sections above.
