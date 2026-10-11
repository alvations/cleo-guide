# Atlas review panel: round 1 evidence pack

This pack covers head `d8b26516b7735e4d8681456cf62b3670ac8fd24d`, pinned in a clean worktree.

**Pages.** All four are opened at `#view=atlas`:
- Tokyo (`beta/cities/tokyo.html`)
- Cleveland (`beta/cleveland.html`)
- Chinatown & CBD (`beta/Singapore/chinatown.html`)
- New York (`beta/cities/newyork.html`)

The method, definitions and probe are the same as in round 0 (`../R0/EVIDENCE.md`). There are two changes:
1. **Numbered labels.** These now count only markers whose text is a bare number (a rank or a count). In round 0
   every marker was a bare number, so round-0 values are the same under both definitions.
2. **Canvas dots.** In this head, places that aren't drawn as named pins are drawn as small dots on a canvas, so they
   aren't DOM markers. The probe reports them separately:
   - `canvas.dotsShown`: dots inside the map bounds;
   - `canvas.discs`: density discs.

## Real-tile shots (new this round)

- **Where:** `design/beta/atlas/real/R1/`, 114 shots. They were made on a CI runner that can reach the real
  OpenStreetMap/Esri tiles, and their commit's parent is this head.
- **What they show:** Tokyo, Cleveland, Chinatown and New York at 1440 and 390, in light and dark. Each covers:
  1. the default view;
  2. zoomed in;
  3. a pin selected;
  4. after a pan;
  5. the phone list or carousel;
  6. the detail;
  7. back from the detail.
  Captions are in `log.json`.
- **Gaps:** `log.json → contexts.tileFail` shows that some tiles failed on the runner, for example 40 of 130 for
  Tokyo 1440. A few tiles may be blank.
- **Basemap:** use these shots to judge it. The shots in `shots/` here use a flat stub tile (no streets) and are for
  interaction states and measurements.

## Files

- `measurements.md` and `measurements.json`: every state, the keyboard runs and the tasks.
- `shots/`: 127 stub-tile shots. Names follow round 0.
- `ms/`: the front-end lane's own acceptance probe on this head. `probe.json` has 117 checks; all PASS.

## Key facts (measured, not judged)

**First screen.** Light and dark gave the same numbers.

| page | vp | map box / clear % | chrome above map px | named pins | bare-number markers | canvas dots shown | density discs | default zoom | nodes |
|---|---|---|---|---|---|---|---|---|---|
| Tokyo | 1440 | 46 / 44 | 208 | 16 (16 must-see) | 0 | 334 | 0 | 13 | 2,604 |
| Tokyo | 390 | 92 / 59 | 126 | 8 | 0 | 358 | 0 | 12 | 2,574 |
| Cleveland | 1440 | 46 / 44 | 208 | 11 | 0 | 86 | 0 | 13.5 | 2,089 |
| Cleveland | 390 | 92 / 59 | 126 | 4 | 0 | 62 | 0 | 13.5 | 2,170 |
| Chinatown | 1440 | 46 / 44 | 208 | 7 | 0 | 15 | 0 | 16 | 1,323 |
| Chinatown | 390 | 92 / 59 | 126 | 3 | 0 | 14 | 0 | 16 | 1,288 |
| New York | 1440 | 46 / 44 | 208 | 16 | 0 | 331 | 0 | 12.5 | 2,638 |
| New York | 390 | 92 / 59 | 126 | 8 | 0 | 296 | 0 | 12.5 | 2,663 |

**What changed since round 0**

| Measure | Round 0 | Round 1 |
|---|---|---|
| Tokyo 1440 markers | 54 bare-number markers (16 rank pins, 38 clusters) | 16 named pins, with every other place a small grey dot; no clusters, no density discs |
| Default zoom, Tokyo / NY | 11.5 | 13 / 12.5, framed on the core |
| Tokyo 1440 targets under 44 px | 64 | 26 |

- **Pins.** Each pin is an icon (a kind glyph: fork-and-knife for eat & drink, a temple, museum or other glyph for
  sights) plus the place name, on a sun or paper pill. Pin text is 13 px and pills are 30 px tall.
- **Phone clear map.** The phone's clear-map share fell from 64 % to 59 %. The attribution chip now wraps to two lines
  ("Leaflet | Tiles © Esri — Esri, HERE, Garmin, © OpenStreetMap contributors") under the chip row.
- **Phone locate control.** The attribution chip overlaps the locate control. In T3-m a real tap on locate-me landed
  on the attribution (`tasks.T3-m.locateCoveredBy`). The same overlap is visible in
  `real/R1/tokyo-390-light-1-default.jpg`.
- **Phone map controls:** locate, map style, key, and a new "Show street detail" button. Zoom ± is not shown on phone.

**Zoomed in two steps**

| Page | Desktop | Phone |
|---|---|---|
| Tokyo | 7 named pins, 24 dots | 8 named pins, 54 dots |
| Cleveland | 10 named pins | 1 named pin |
| New York | 7 named pins | 2 named pins |

**Desktop pin preview.** It's unchanged: the kind or area line, the name, the why, "Recommended by …" and the photo
credit, 300 px wide, with text at 12–18 px. Where a place has no photo, the photo block is an empty cover with a
glyph (`cleveland-1440-light-pin-selected.jpg`, `tokyo-1440-light-pin-selected.jpg`).

**List and counts.**
- Search-as-you-move is on.
- The list is still grouped by area with area chips, and counts sit at several levels ("18 places in this map area",
  "176 more outside this area. Show all 194", "52 places · area 3 of 4").

**Text and targets.**
- The smallest text is 12 px on cards, credits and chrome. Card meta is 12–14 px.
- Pin pills are 30 px tall.

**Detail round-trip** (card → detail → Escape, and Back)

| Page | Map after closing | Focus after Escape | Note |
|---|---|---|---|
| Tokyo | z 14 at 35.676, 139.740 → z 15 at 35.688, 139.758; not restored | the card | |
| Cleveland | not restored | the card on desktop, `<body>` on phone | |
| New York | not restored | `<body>` on desktop and phone | desktop list scroll jumped to 2,193 px |
| Chinatown | starts at z 17, the detail stays at z 17 and moves about 160 m | the card | the probe's 0.002° tolerance counts phone as "kept" |

- The URL becomes `#p-<id>` while the detail is open.

**`#view=atlas&p=` fresh load.**
- The detail opens and centres the map on the place.
- The pin is no longer under the panel on Tokyo desktop.
- It is still under the panel on the other 7 page/viewport pairs (`pinUnderSheet`).

**Tiles blocked, or map library blocked.**
- Every place is listed (488/488, 194/194, 16/16, 508/508) on both viewports.
- There's a "Map unavailable right now" note, and 0 page errors.

**200 % zoom.**
- The phone layout is used, with no horizontal overflow.
- Clear map is 34 % (it was 41 % in round 0). 1–4 named pins show.

**Keyboard (desktop): unchanged.**
- The first card is the 39th Tab stop on Tokyo and the 30th on Cleveland.
- Pins and the map are not in the Tab order, and there's no keyboard pan.
- The search input has no focus ring.
- Card focus lights its pin. Enter opens the detail, and Escape returns focus to the card.

**First load** (raw / gzip text, KB):

| Page | Desktop | Phone |
|---|---|---|
| Tokyo | 1,771 / 616 | 2,041 / 886 |
| New York | 1,899 / 779 | 1,955 / 834 |

## Persona task runs (scripted; `measurements.json → tasks`, `T*` shots)

**Probe artefact.** The T1 log line "must-see pins on map show only """ is wrong for this round. The probe's
visibility check missed the pin labels. Use the first-screen table: Tokyo 1440 shows 16 named must-see pins, and
390 shows 7. This has been fixed in the probe for later rounds.

**T1 (Tokyo).**
- Phone took 7 steps, desktop 5.
- On the first screen the map now names must-sees, for example Imperial Palace East Gardens, Tsukiji Hongan-ji,
  Yasukuni Shrine and Meiji Jingū.
- After "Must see", the phone carousel still shows one card per screen.
- There's no open-now or "tonight" filter.
- Saving two works (Saved reads 2).

**T2 (half-day plus lunch).**
- Desktop takes 3 steps:
  1. the area chip, which fits the map: "Taitō-ku 44" or "University Circle & East Side 59";
  2. "Eat & drink";
  3. read the list (23 in Tokyo, 15 in Cleveland).
- Phone: the script found no area chip on the first screen; area is behind Filters.

**T3 (fixed spot in Shibuya, 35.6595, 139.7005).**
- **The truth:** 12 food places within 1.2 km. The best are Nonbei Yokochō (90 m, tier 1) and The Bellwood (640 m,
  tier 1).
- **Desktop:** locate-me centres at z 15. After "Eat & drink" the first cards are Minato-ku places (Toraya Akasaka,
  Myojaku …), because the list stays grouped by area. Cards show no distances.
- **Phone:** the locate tap is blocked by the attribution chip. After a scripted click and "Eat & drink", the carousel
  and list lead with Isegen (Chiyoda-ku), while the pill reads "List · 10".
- **On the map:** Nonbei Yokochō is now a named pin on the Tokyo phone and desktop first screens
  (`real/R1/tokyo-390-light-1-default.jpg`).

**T4 (closed place: Cleveland, Heinen's Downtown).**
- The card and detail say "Closed — kept for the record", with the source.
- At its deep-link zoom the place is drawn as a canvas dot, not a named pin. There's no DOM pin to inspect for a
  closed mark (`pinClassAtPlace: null`).
- Returning from the detail doesn't restore the map view.

**T5 (sharing).**
- Share copies `…#view=atlas&p=<id>` with "Link copied — it opens this exact view.", and the link reopens the detail.
- The map view is still not in the URL. A URL copied at Asakusa, z 15, reopens at the default view (z 13 on desktop,
  z 12 on phone).

**T6 (keyboard, 200 %, library blocked).** See above.
