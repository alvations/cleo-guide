# Atlas review panel: round 3 evidence pack

- **Head under review:** `537cfb8c65524a8da72a5fb4f2824bb084cfe399`, pinned in a clean worktree.
- **Pages:** Tokyo, Cleveland, Chinatown & CBD and New York, each opened at `#view=atlas`.
- **Method:** the same as rounds 1–2 (see `../R2/EVIDENCE.md`).
- **Probe fixes since round 2:**
  - The keyboard run now scans the full Tab order.
  - A wrapper's `:focus-within` ring counts as a visible focus ring.
  - The share check reads the `at=` map-view hash.

**Real-tile shots.** `design/beta/atlas/real/R3/` has 112 shots made by the CI runner on exactly this head
(`real/R3/SHOT-SHA.txt` = `537cfb8c…`). Use them to judge the basemap and the overall look in light and dark.
`log.json` gives the captions and any tile failures.

**Files:**
- `measurements.md` and `measurements.json`: every state, the full keyboard scan and the persona tasks.
- `shots/`: 129 stub-tile screenshots.
- `ms/`: the front-end lane's probe output. Both suites pass.
- `views/VIEWS.md`: the other views compared with round 2's head. No regressions were flagged.

## Key facts (measured, not judged)

### First screen

Light and dark gave the same numbers.

| page | vp | map width % | map box / clear % | chrome above map px | named pins | canvas dots | default zoom | targets < 44 px (< 24) | nodes |
|---|---|---|---|---|---|---|---|---|---|
| Tokyo | 1440 | **64** | **56 / 54** | **108** | 16 | 343 | 13 | 31 (6) | 2,643 |
| Tokyo | 390 | 100 | 92 / 63 | 126 | 8 | 354 | 12 | 14 (2) | 2,604 |
| Cleveland | 1440 | 64 | 56 / 54 | 108 | 16 | 71 | 13.5 | 29 (6) | 2,160 |
| Cleveland | 390 | 100 | 92 / 63 | 126 | 7 | 85 | 12.5 | 10 (1) | 2,078 |
| Chinatown | 1440 | 64 | 56 / 54 | 108 | 11 | 4 | 16 | 20 (2) | 1,382 |
| Chinatown | 390 | 100 | 92 / 63 | 126 | 5 | 9 | 16 | 8 (1) | 1,341 |
| New York | 1440 | 64 | 56 / 54 | 108 | 16 | 330 | 12.5 | 29 (5) | 2,669 |
| New York | 390 | 100 | 92 / 63 | 126 | 8 | 340 | 12 | 14 (2) | 2,525 |

### Desktop layout (new this round)

- **One bar.** The search pill, chips and sort share a single row.
- **Map.** It starts 108 px from the top (was 208) and takes 64 % of the width (was 60 %), against a 36 % list. The
  window doesn't scroll (`docScroll 0`), but see the erratum at the end: an inner container does.
- **View switch.** Gallery / Atlas / Guidebook / Insights moved into the header, and it is **partly off-screen**:
  - At 1440, 1280 and 1024 px wide the switch buttons sit at y = −17 px, so their top 17 of 44 px is clipped. The
    pill's background (98 px tall) overlaps the 56 px header and the bar below it.
  - At 1024–1280 px, "How we choose" wraps to two lines.
  - In Atlas, the header breadcrumb is truncated ("Japan › To…").
  - Evidence: `shots/tokyo-1440-light-default.jpg`, lead-verified with a DOM probe at 1024 / 1280 / 1440.
  - The Gallery view's header is unaffected (`views/tokyo-1440-gallery.jpg`).
- **Language switch.** A new English / 日本語 switch sits in the header.
- **Search input.** It measures 284 × 25 px on desktop; its wrapper pill is about 44 px tall. On phone it's 44 px.

### Fixed since round 2 (measured)

**Detail round-trip.** The view is kept on **8 of 8** page/viewport pairs (it was 1 of 8).
- Card → detail → Escape and → Back return the same centre and zoom.
- List scroll and page scroll don't change, and the List count is unchanged.
- Focus returns to the opening card on all 8, including New York and Cleveland phone.
- The URL carries the view: `#view=atlas&at=lat,lng,z`.

**Deep link (`#view=atlas&p=` fresh load).**
- The pin sits clear of the detail panel on **8 of 8** pairs (`pinUnderSheet: false`).
- The pin is offset 280 px from centre on desktop and 210 px on phone.

**Share.**
- The link carries `&at=`, and the toast reads "Link copied · opens Sensō-ji on this map view".
- A copied URL reopens within 0.00002° and at the same zoom (`tasks.T5-*.mapViewInUrl: true`).

**Near me (T3, Shibuya 35.6595, 139.7005).** After locate-me and "Eat & drink":
- Both the list and the phone carousel sort by "Nearest to me".
- Every card shows a distance: "Nonbei Yokochō … · 90 m away", then Ichiran 190 m, Chatei Hatou 220 m, Chūkamen-ten
  Kiraku 330 m and Meikyoku Kissa Lion 370 m.
- The phone card reads "90 m · about 1 min walk" (`shots/T3-tokyo-390-food-near.jpg`).
- The Bellwood (640 m, tier 1) is a named pin on the map.

**Keyboard.**
- There are skip links ("Skip to content", "Skip to the map", "Skip to the results") at stops 1–3.
- The map is stop 28 and the first pin stop 29. The first card is stop 67 on Tokyo and 58 on Cleveland.
- Every stop shows a visible ring (`stopsWithoutVisibleRing: 0`).
- Arrow keys pan the focused map, + zooms, and the list count follows.
- Enter on a card opens the detail. Escape returns focus to the card.

**Lens copy.** "Numbered to match the map" is gone from the lens copy.

### Unchanged or still open (measured)

**Phone first screen.**
- 63 % of the screen is clear map, under the chip row, credit chip, List pill and a one-card carousel.
- There's no area chip on the first screen (T2 phone: `areaFound: false`).
- The phone header breadcrumb still collides ("‹ Japan› T…", `shots/T3-tokyo-390-food-near.jpg`).

**Phone counts.** After two zoom steps the phone still says "351 places in this map area" (45 dots in view) until you
tap "Search this area".

**Counts on desktop.** "359 places in this map area", "129 more outside this area. Show all 488", city-total area-chip
counts and "43 places · area 1 of 13" all show together.

**Must see.** It narrows Tokyo to 141 of 488 on desktop and 138 on phone; 177 of 488 places are must-sees.

**Text.**
- Card, credit and map-control text has a minimum of 12 px.
- Pin labels are 14 px.
- The preview text is 12–18 px.

**Targets.**
- The Tokyo desktop first screen has 31 targets under 44 px, 6 of them under 24 px. These include credit links (about
  58 × 15) and the search input (284 × 25).
- The phone "Map credits" button is 20 × 20.
- Pins are 32 px tall, with a 44 px hit area through `::before`.

**Dots.** 330–354 dots show on the first screens, with shapes for kind and tier.

**Photos.** No-photo places still show a glyph cover. The Tokyo desktop preview now adds a kind word, e.g. "Wagashi".

**200 % zoom.** The phone layout is used, with no overflow. 35 % of the map is clear (38 % in round 2).

**Tiles or library blocked.** Every place is listed (488 / 194 / 16 / 508), with 0 page errors.

**First load** (raw / gzipped text, KB):

| page | desktop | phone |
|---|---|---|
| Tokyo | 1,769 / 614 | 2,028 / 873 (raw is above 2,000 again; it was 1,990 in R2) |
| New York | 1,800 / 691 | 1,684 / 575 |

**Phone storage line.** The phone shows a new "3.8 MB on this device" line (an offline or storage note).

**Other views.** No regressions.

## Persona task runs (scripted; `measurements.json → tasks`, `T*` shots)

**T1, Tokyo.**
- 5 steps on desktop, 7 on phone.
- Must-sees are named on the first-screen map.
- After "Must see", the phone carousel still shows one card per screen.
- There's no open-now or "tonight" signal.
- Saving two works.

**T2, half-day plus lunch.**
- Desktop takes 3 steps: area chip, then "Eat & drink" (23 places in Tokyo, 15 in Cleveland).
- On phone the script found no area chip on the first screen.

**T3, near me.** It works on both viewports: Nonbei Yokochō is first, at 90 m, and every card shows a distance.

**T4, Heinen's Downtown.**
- The card and detail say it's closed, with the source and check date.
- The pin is labelled "… · Closed".
- Coming back restores the view, the scroll and focus.

**T5, sharing.**
- The place link carries the view.
- It reopens the detail with the pin visible beside the panel.
- The toast copy matches what the link restores.

**T6.**
- Keyboard: skip links, the map at stop 28, rings on every stop, and arrow-key pan.
- 200 %: 35 % clear map.
- Library blocked: every place is listed.

## Erratum (issued during round-3 scoring, to all eight panelists)

"The document doesn't scroll" was true only of the window, and only at load. Three panelists spotted this in the shots;
the lead then measured it on all four desktop pages (`scrollY` stays 0 throughout).
- **The shift.** Opening a place's detail from a list card shifts the whole Atlas layout up by 108 px inside its
  container: the map's top moves from 108 to 0. The search and filter bar goes under the header, and the
  offline-download panel ("Take <city> with you … 3.8 MB on this device") slides in at the bottom.
- **It persists.** It stays that way after Escape or Back, and after a mouse-wheel scroll over the list.
- **The map view is still kept.** `viewKept` is true, and the centre, zoom, list scroll and focus are restored.
- **Keyboard focus too.** Tab-focusing a card shows the same shift in `shots/tokyo-1440-keyboard-card-focus.jpg`.
- **Evidence:** `shots/tokyo-1440-after-detail-close.jpg`, `cleveland-1440-after-detail-close.jpg`,
  `tokyo-1440-detail-from-card.jpg`.
