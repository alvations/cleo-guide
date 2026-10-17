# Atlas review panel: round 4 evidence pack

- **Head under review:** `7a21f2f60bffb22ce5b7c558e92b9cafba88a7fe`, pinned in a clean worktree.
- **Pages:** Tokyo, Cleveland, Chinatown & CBD and New York, each opened at `#view=atlas`. Atlas is now also the default
  view, so a bare city URL lands in Atlas and writes only `#at=…` to the address bar.
- **Method:** the same as rounds 1–3 (see `../R2/EVIDENCE.md`), with the probe adapted to this head's controls. Every
  adaptation is listed under "Probe changes" at the end.

**Real-tile shots.** `design/beta/atlas/real/R4/` has 172 shots made by the CI runner on exactly this head
(`real/R4/SHOT-SHA.txt` = `7a21f2f6…`). Use them to judge the basemap and the overall look in light and dark.
`log.json` gives the captions and tile failures: some tiles failed on the runner, for example 40 of 126 for Tokyo 1440.

**Files:**
- `measurements.md` and `measurements.json`: every state, the full keyboard scan, the header checks and the persona
  tasks.
- `shots/`: the stub-tile screenshots.
- `ms/`: the front-end lane's probe output. It passes on this head.
- `views/VIEWS.md`: the other views compared with round 3's head.

## Key facts (measured, not judged)

### First screen

Light and dark gave the same layout numbers.

| page | vp | map width % | map box / clear % | chrome above map px | named pins | canvas dots | default zoom | targets < 44 px (< 24) | nodes |
|---|---|---|---|---|---|---|---|---|---|
| Tokyo | 1440 | 64 | 57 / 55 | 104 | 7 | 352 | 13 | 15 (2) | 2,620 |
| Tokyo | 390 | 100 | 94 / **73** | 152 | 6 | 355 | 12 | 7 (0) | 2,615 |
| Cleveland | 1440 | 64 | 57 / 55 | 104 | 8 | 80 | 13.5 | 19 (5) | 2,143 |
| Cleveland | 390 | 100 | 94 / 73 | 152 | 6 | 69 | 13 | 7 (0) | 2,084 |
| Chinatown | 1440 | 64 | 57 / 55 | 104 | 6 | 9 | 16 | 17 (5) | 1,381 |
| Chinatown | 390 | 100 | 94 / 73 | 152 | 5 | 9 | 16 | 6 (0) | 1,300 |
| New York | 1440 | 64 | 57 / 55 | 104 | 8 | 332 | 12.5 | 19 (4) | 2,544 |
| New York | 390 | 100 | 94 / 73 | 152 | 6 | 388 | 11.5 | 7 (0) | 2,509 |

Round 3, for comparison:
- **Desktop:** 108 px of chrome, 56 / 54 % map, and 11–16 named pins.
- **Phone:** 92 / 63 % map and 5–8 named pins.
- **Targets on Tokyo:** 31 (6) on desktop and 14 (2) on phone.

**Named pins.** There are fewer of them: labels are now capped by the clear map area.

### Desktop layout

- **Header.** The view switch (Atlas / Gallery / Guidebook / Insights) now sits inside the 56 px header at 1024, 1280
  and 1440 px on all four pages. Its buttons' top is at 10 px and their bottom at 46 px (`tasks.header-*`).
  - **"How we choose":** one line at 1280 and 1440, and not shown at 1024.
  - **Breadcrumb:** whole at 1280 and 1440 ("Japan › Tokyo"). At 1024 the country name is cut (`crumbsCut 1`).
  - **Overlaps:** no breadcrumb overlaps, and no bar control sits under the header.
- **One bar.** Search, All / Sights / Eat & drink, Area, Filters, Top picks, Saved and the sort control. "Must see" is no
  longer a bar control; it shows on pins, as card stickers and as a Filters tier. "Top picks" is the one best-places
  control: on, it shows the top 30 on desktop and the top 12 on phone.
- **List head.**
  - The city name and its sources line.
  - One count line ("359 places here · Top ranked") and "Show all 488".
  - "Search as I move the map".
  - Three doors: For you, Your day and Near me.
  - A large lead card, then a two-column grid (`shots/tokyo-1440-light-default.jpg`).
- **No-photo cards.** They show the place's "why" as a quote card in the grid (`shots/tokyo-1440-after-detail-close.jpg`).
- **Detail.** It opens in the list pane on the right, beside the map. It has back, previous / next, close, and Save /
  Directions / Share (`shots/tokyo-1440-deeplink.jpg`).

### Phone layout

- **Header:** "‹ Tokyo", 日本語, a search icon and Your list. There is one search, behind the header icon.
- **Under the header:** a view-switch row, then a chip row (All, Sights, Eat & drink, Top picks …; Filters at its end).
- **Map controls:** bottom right (Map style and key, Near me). The credit is one line, "© OpenStreetMap · Esri ⓘ".
- **Peek:** a bottom bar with three thumbnails and "351 places here · Show list". It replaces round 3's card carousel.
  "Show list" opens the list sheet (`shots/tokyo-390-light-default.jpg`, `shots/tokyo-390-light-list-mode.jpg`).
- **No area chip** on the first screen (T2 phone `areaFound: false`). Area is reached through Filters.

### Fixed since round 3 (measured)

**Layout shift (R3 #7).** The layout stays put on all 8 page/viewport pairs (`*-roundtrip.layoutKept: true`).
- **Measured:** after card → detail → Escape and → Back, the map's top stays at 104 px on desktop, the search input stays
  at 67 px, and every ancestor of the map has `scrollTop` 0.
- **Shot:** `shots/tokyo-1440-after-detail-close.jpg`.

**Detail round-trip.** The view is kept on 8 of 8 pairs, with the same centre and zoom, and the list scroll is
unchanged. Focus returns to the opening card on all 8.

**Deep link (`#view=atlas&p=` fresh load).**
- **Desktop:** the detail opens in the list pane, and the pin sits at the map's centre (1 px off), clear of the panel.
- **Phone:** the pin is 191 px above centre, clear of the sheet.
- **All pairs:** `pinUnderSheet: false` on 8 of 8.

**Counts.**
- **Desktop default:** one count line and "Show all", instead of round 3's four count strings. Area-chip counts and
  "N places · area x of 13" are not on the first screen.
- **Detail:** shows "No. 1 of 43 in Chiyoda-ku" (`shots/tokyo-1440-deeplink.jpg`).

**Keyboard** (`tasks.keyboard-tokyo` / `-cleveland`).
- **Order:** skip links at stops 1–3, the map at stop 26, the first pin at 27, and the first card at 43 (Tokyo) and 44
  (Cleveland). In round 3 they were 28, 29 and 67 / 58.
- **Rings:** every stop shows one (`stopsWithoutVisibleRing: 0`). The card ring is counted on the card (see "Probe
  changes").
- **Keys:** arrows pan, + zooms and the list follows ("158 places here"). Enter on a card opens the detail with focus on
  Close, and Escape returns focus to the card.

**200 % zoom (720 × 450 CSS px).** The new landscape layout is used, with no overflow.
- **Bar:** one 48 px bar holds the back link, 日本語, a Filters icon, an icon-only view switch, search and Your list.
- **Controls:** a stack on the right (Map style and key, Near me, List).
- **Clear map:** 86 % (35 % in round 3).
- **No chip row:** the kind chips are behind Filters.
- **Shot:** `shots/tokyo-200pct-default.jpg`.

**Desktop targets.** Tokyo has 15 targets under 44 px, 2 of them under 24 px (31 and 6 in round 3).

### Unchanged or still open (measured)

**Phone counts after zooming.** After two zoom steps the count still reads the pre-zoom number until "Search this area"
is tapped:

| page | count shown | dots in view |
|---|---|---|
| Tokyo | 351 | 45 |
| New York | 384 | 80 |
| Cleveland | 73 | 20 |

Source: `m-light-zoom2.countLine` and `canvas.dotsInView`.

**Dots.** 332–388 dots show on the Tokyo and New York first screens.

**Preview without a photo.** It is now a compact card (300 × 183 px) with no empty cover. Its text begins "1 Must see
within Minato-ku", which includes a rank number (`d-light-select.preview`; `shots/tokyo-1440-light-pin-selected.jpg`).

**Text.**
- Card text has a 12 px minimum. The median is 14 px on Tokyo desktop and 16 px on the other desktop pages.
- Credit and map-control text is 12 px.
- Pin labels are 14 px on desktop and 13 px on phone (14 on both in round 3).

**Detail numbers.** Corrected by the erratum at the end. The detail shows one number, "No. 39 of 42 in Downtown & The
Flats". "42 of 194 in this Atlas view" is screen-reader-only text.

**First load** (raw / gzipped text, KB):

| page | desktop | phone |
|---|---|---|
| Tokyo | 1,846 / 682 | 2,407 / 1,242 (2,028 / 873 in round 3) |
| New York | 1,793 / 681 | 2,349 / 1,238 |

**Tiles or library blocked.**
- **Listed:** every place, Tokyo 488, Cleveland 194, Chinatown 16 and New York 503, with 0 page errors.
- **Notice:** "Map unavailable right now — every place is listed here".
- **New York's total is 503.** It was 508 in round 3; the dataset changed between the heads.

**Contrast:** 0 fails on every page.

**Other views:** no regressions (`views/VIEWS.md`, compared with round 3's head).

## Persona task runs (scripted; `measurements.json → tasks`, `T*` shots)

**T1, Tokyo.**
- **Desktop, 5 steps.**
  - The first-screen map names 7 places, 5 of them must-sees: Edo-Tokyo Museum, Imperial Palace East Gardens,
    Tsukiji Hongan-ji, Toraya Akasaka and Suga Shrine stairs.
  - "Top picks" gives "Top 30 picks", led by Imperial Palace East Gardens, Yasukuni Shrine, Kanda Myōjin and Tsukiji
    Hongan-ji.
  - Saving two works ("Saved 2").
- **Phone, 7 steps.**
  - The map names 6 places. No card shows until "Show list". "Top picks" gives "Top 12 picks".
  - The list shows one name per screen at the top (the lead card), so reading three names takes a scroll.
  - Saving two works (`shots/T1-tokyo-390-list.jpg`, `T1-tokyo-390-saved.jpg`).
- **Tonight:** there is no open-now or "tonight" control. Card text mentions hours and evening words.

**T2, half-day plus lunch.**
- **Desktop, 3 steps:** the area chip, then "Eat & drink".
  - **Tokyo:** "Taitō-ku 44", then 23 places, led by Usagiya, Yanaka Ginza, Komagata Dozeu, Sasanoyuki and Onigiri
    Asakusa Yadoroku.
  - **Cleveland:** "University Circle & East Side 59", then 15 places, led by Superior Phở, Li Wah, Wonton Gourmet,
    Presti's Bakery and Bo Loong.
  - The area chip sits in a scrolling row, off-screen at first, so the probe scrolled it into view. A real tap could not
    land, so the probe clicked it by script.
- **Phone:** there is no area control on the first screen.
  - "Eat & drink" alone gives 187 places in Tokyo, led by Isegen in Kanda, and 21 in Cleveland, led by Slyman's.
  - The phone list shots are `shots/T2-*-390-lunch-list.jpg`.
- **"Your day here" route entry:** on the page in both cities (`dayRouteEntryOnPage`).

**T3, near me (Shibuya 35.6595, 139.7005).** Desktop uses the list head's "Near me" door; phone uses the map's Near me
control.
- **Both viewports, 3 steps:** locate, then "Eat & drink", gives "Nearest to me" and a distance on every card. The order
  is Nonbei Yokochō 90 m, Ichiran 190 m, Chatei Hatou 220 m, Chūkamen-ten Kiraku 330 m and Meikyoku Kissa Lion 370 m.
- **The Bellwood** (640 m, tier 1) is not in the first five.

**T4, Heinen's Downtown.**
- **Detail:** "Closed · Kept for the record, not as a suggestion · checked 2026-10-16 · source", the title "— CLOSED"
  and "Recommended by News 5 Cleveland" (`shots/T4-cleveland-1440-closed-place.jpg`).
- **Pin:** labelled "Heinen's Down… · Closed" (class `pp-x`).
- **Numbers:** the detail shows "No. 39 of 42 in Downtown & The Flats". The probe text also contains "42 of 194 in this
  Atlas view", but that is screen-reader-only (see the erratum).
- **Coming back:** keeps the view, the layout and focus (see the round-trip above).

**T5, sharing.**
- **Both viewports:** Share copies a link with `&at=…&p=senso-ji`. The toast reads "Link copied · opens Sensō-ji on this
  map view".
- **Reopening:** a fresh load opens the detail. A view-only link (`#at=35.7148,139.7967,15`) reopens within 0.00002° at
  the same zoom (`mapViewInUrl: true`).

**T6.**
- **Keyboard:** skip links, the map at stop 26, a ring on every stop, arrow-key pan, Enter / Escape round-trip.
- **200 %:** 86 % clear map in the landscape layout.
- **Library or tiles blocked:** every place is listed.

## Probe changes this round (so the numbers compare)

- **T1:** this head has no "Must see" bar control, so T1 taps "Top picks", the one best-places control, and the log says
  so.
- **T3:** locate-me is the list head's "Near me" door on desktop, or the map's Near me control on phone.
- **Phone list:** cards live in the list sheet behind "Show list", so the phone round-trip, T1 (reading and saving), T2
  (reading the top places) and T5 (opening a place to share) open the list first. Each logs it.
- **T1 saving:** it taps the first two hearts on cards that are shown, not hidden by the filter.
- **Share check:** a share hash may now start `#at=…` with no `view=`, and the check accepts that.
- **T4:** a closed place is found from the page's records when its card is not on the first page of cards.
- **Header check (new):** `tasks.header-<page>-<1440|1280|1024>` records the view-switch rects, the "How we choose"
  text lines, breadcrumb cuts and overlaps, and any bar control under the header.
- **Layout check (new):** `layoutKept` on every round-trip records the map's top, the search input's top and every
  ancestor's `scrollTop`.
- **Card focus ring:** a focused card counts as ringed when its outline or shadow differs from an unfocused card's. The
  ring is drawn on the card while its name link has focus.
- **Tap fallback:** when a real tap can't land within 3 s (still animating, or off-screen), the probe clicks by script and
  logs it.

## Erratum (issued during round-4 scoring, to all eight panelists)

The pack said Heinen's Downtown's detail "still shows two numbers". That was wrong.
- **What sighted readers see:** one number, "No. 39 of 42 in Downtown & The Flats" (`shots/T4-cleveland-1440-closed-place.jpg`).
- **What the probe also recorded:** "42 of 194 in this Atlas view". The probe reads `innerText`, which includes visually
  hidden text. This string sits in a `span.vh` (clipped to 1 × 1 px), which is the screen-reader label of the detail's
  previous / next control.
- **How the lead checked:** a DOM check of the open detail on this head.
- **Pin label:** the pin reads "Heinen's Downtown · Closed" in full once selected, as in the same shot. The probe's
  "Heinen's Down… · Closed" was read before the label widened.
