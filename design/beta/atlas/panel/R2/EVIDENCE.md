# Atlas review panel: round 2 evidence pack

**Head under review:** `40e15601b23fb2efe2e2c711cfb5f7d92a73c674`, pinned in a clean worktree.

**Pages:** Tokyo, Cleveland, Chinatown & CBD and New York, each opened at `#view=atlas`.

**Method:** the same as round 1 (`../R1/EVIDENCE.md`).
- **Named pins** are DOM markers showing a place name.
- **Canvas dots** are the other places, drawn on a canvas. `canvas.dotsShown` counts the dots inside the map bounds.
- **Numbered labels** are markers whose whole text is a number.

## Real-tile shots

`design/beta/atlas/real/R2/` holds 114 shots, made on a CI runner on this head (the commit's parent is `40e15601`).
- **Pages:** Tokyo, Cleveland, Chinatown and New York, at 1440 and 390, in light and dark.
- **States:** default, zoomed, pin, pan, phone list or carousel, detail, and back.
- **Tile gaps:** `log.json → contexts.tileFail` shows that some tiles failed on the runner (for example, 40 of 192 for
  Tokyo 1440).
- **Use them to judge the basemap.** The shots in `shots/` here use a flat stub tile and are for interaction states and
  measurements.

## Files

- `measurements.md` and `measurements.json`: every state, the keyboard runs and the tasks.
- `shots/`: 129 stub-tile shots.
- `ms/`: the front-end lane's own acceptance probe on this head. It passes.
- `views/VIEWS.md`: a non-scoring regression check of Gallery, Guidebook, Insights, the place detail and Saved, compared
  with round 1's head.

## Key facts (measured, not judged)

### First screen

Light and dark gave the same numbers.

| page | vp | map box / clear % | chrome above map px | named pins | bare-number markers | canvas dots shown | default zoom | targets < 44 px (< 24) | nodes |
|---|---|---|---|---|---|---|---|---|---|
| Tokyo | 1440 | 46 / 44 | 208 | 16 | 0 | 363 | 12.5 | 26 (2) | 2,644 |
| Tokyo | 390 | 92 / **64** | 126 | 8 | 0 | 354 | 12 | 15 (2) | 2,577 |
| Cleveland | 1440 | 46 / 44 | 208 | 16 | 0 | 81 | 13 | 24 (1) | 2,107 |
| Cleveland | 390 | 92 / 64 | 126 | 7 | 0 | 85 | 12.5 | 11 (1) | 2,065 |
| Chinatown | 1440 | 46 / 44 | 208 | 11 | 0 | 4 | 16 | 18 (1) | 1,360 |
| Chinatown | 390 | 92 / 64 | 126 | 5 | 0 | 9 | 16 | 9 (1) | 1,319 |
| New York | 1440 | 46 / 44 | 208 | 16 | 0 | 368 | 12 | 26 (3) | 2,548 |
| New York | 390 | 92 / 64 | 126 | 8 | 0 | 340 | 12 | 15 (2) | 2,495 |

### What changed since round 1 (measured)

- **Phone credit.** It's now one line ("© OpenStreetMap · Esri ⓘ") at the bottom left, above the List pill. A "Map
  credits" button opens the full text.
- **Phone clear map.** Back to 64 % (59 % in round 1).
- **Phone controls** (key, base switch, street detail, locate) now sit bottom-right, at roughly 58–70 % of the screen
  height (`real/R2/tokyo-390-light-1-default.jpg`).
- **Locate-me works with a real tap** (`tasks.T3-m.locateCoveredBy: null`); in round 1 the credit caught the tap.
- **Pin labels are 14 px**, up from 13.
- **Dots now differ by kind and tier.** In the real-tile shots, sun-coloured rings mark must-sees, small squares food
  and grey circles other sights (`real/R2/tokyo-390-light-1-default.jpg`, `real/R2/tokyo-1440-dark-2-zoomed.jpg`). The source's `dotStyle` also draws closed places as hollow, slashed dots.
- **Named pins after two zoom steps:**

  | page | desktop | phone | phone in round 1 |
  |---|---|---|---|
  | Tokyo | 16 | 7 | 8 |
  | Cleveland | 14 | 4 | 1 |
  | New York | 16 | 5 | 2 |
  | Chinatown | 3 | 1 | — |

- **Closed places are marked on the map.** At Heinen's Downtown's deep-link zoom the marker is a closed pin (`pp-x`)
  labelled "Heinen's Downtown · Closed" (`tasks.T4-closed.pinClassAtPlace`). In round 1 it was an unmarked dot.

### Unchanged since round 1

**Desktop.**
- 208 px of chrome sits above the map, which takes 46 % of the screen.
- The list is still grouped by area, with chip counts and "N places · area x of 13".

**Detail round-trip** (card → detail → Escape or Back).
- The map stays at z 15 on the place on 7 of 8 page/viewport pairs (Tokyo goes from z 13.5 to z 15). Chinatown phone
  "passes" only within the probe's 0.002° tolerance.
- The desktop list scrolls by 23–51 px.
- Focus goes to `<body>` on New York (both viewports) and on Cleveland phone.

**`#view=atlas&p=` fresh load.**
- The pin is under the detail panel on **8 of 8** pairs. In round 1 it was 7 of 8: Tokyo desktop had been fixed and is
  under the panel again.

**Near me (T3, Shibuya).**
- Locate-me centres the map at z 15.
- After "Eat & drink", the desktop list leads with Minato-ku places (Toraya Akasaka, Myojaku), and the phone carousel
  leads with Isegen (Chiyoda-ku) while the pill reads "List · 10".
- Cards show no distances, and "Nearest to me" isn't applied.

**Keyboard (corrected by the erratum below).**
- The first card is the 39th Tab stop on Tokyo and the 30th on Cleveland.
- The search box shows a visible 2 px focus ring on its wrapper (see erratum item 2).
- Focusing a card lights its pin, and Enter → detail → Escape returns focus to the card.
- The map and the pins *are* in the Tab order, but only after the whole list (see the erratum).

**Map view in the URL.**
- It isn't there: a URL copied at Asakusa z 15 reopens at the default view.
- The share toast still says "it opens this exact view".

**Text.** The smallest is 12 px, on cards, credits and the desktop chrome.

**Targets.**
- The Tokyo desktop first screen has 26 targets under 44 px.
- Pin pills are about 30 px tall.

### Other checks

- **200 % zoom:** the phone layout, with no overflow. 38 % of the map is clear (34 % in round 1).
- **Tiles blocked or map library blocked:** every place is listed (488/488, 194/194, 16/16, 508/508) and there are 0
  page errors.
- **First load, raw / gzipped text (KB):**

  | page | desktop | phone |
  |---|---|---|
  | Tokyo | 1,731 / 603 | 1,990 / 862 |
  | New York | 1,762 / 681 | 1,646 / 564 |

- **Other views:** no regressions (see `views/VIEWS.md`).

## Persona task runs (scripted; `measurements.json → tasks`, `T*` shots)

- **T1, Tokyo.** 5 steps on desktop, 7 on phone.
  - Must-sees are named on the map on the first screen: Imperial Palace East Gardens, Edo-Tokyo Museum, Tsukiji
    Hongan-ji, Tokyo National Museum and others.
  - After "Must see", the phone carousel still shows one card per screen.
  - There's no open-now or "tonight" signal.
  - Saving two works.
- **T2, half-day.** 3 steps on desktop: the area chip, then "Eat & drink" (23 places in Tokyo, 15 in Cleveland). On
  phone, the script found no area chip on the first screen.
- **T3, the fixed spot in Shibuya.** The real phone tap on locate-me now works. The list and carousel order is
  unchanged (see above). Nonbei Yokochō (90 m, tier 1) is a named pin next to the location dot.
- **T4, Heinen's Downtown.**
  - The card and detail say "Closed · kept for the record", with the source and the check date.
  - The pin at its deep-link zoom is labelled "… · Closed".
  - Coming back from the detail doesn't restore the view.
- **T5, sharing.** A place link reopens the detail, but its pin sits under the panel. The map view isn't shareable.
- **T6.** See the keyboard, 200 % and library-blocked facts above.

## Erratum (issued during round-2 scoring, to all eight panelists)

The first keyboard run stopped scanning 6 stops after the first card, so it never reached the map. Its
"`tabsToFirstPin: -1`, `mapFocusableAt: -1`, pins not in the Tab order" was a **probe artefact**.

A full scan of this head (`tasks.keyboard-deep-tokyo` / `-cleveland`) shows the following.

**Where the map sits in the Tab order.**

| Page | Map container | First pin | Before the map |
|---|---|---|---|
| Tokyo | stop 226 | stop 227 | every list card, then "Your day here · 6 stops", "Show 40 more" and "Show all 379 in one list" |
| Cleveland | stop 205 | stop 206 | every list card |

**How the pins behave.**
- Every named pin is one Tab stop, with an aria-label of name, kind and tier (e.g. "Edo-Tokyo Museum, sight, Must
  see"). Each shows a visible focus ring.
- **Enter** on a pin opens its preview, and focus stays on the pin.
- **Escape** closes the preview and returns focus to the pin.
- **Arrow keys** pan the focused map.

**What still holds.**
- There's no skip link to the map or the results.
- The map is about 190 stops after the first card.
- Focus goes to `<body>` after closing the detail on New York and on Cleveland phone.

**Erratum item 2: the search box focus ring.** "The search input has no focus ring" (`stopsWithoutVisibleRing: 1`) was also a probe artefact. The probe checked only the input element. Its wrapper draws a 2 px focus-colour ring while the input has focus (`.spill:focus-within { box-shadow: 0 0 0 2px var(--focus) }` in `assets/fe-a.css`). FE raised this, and the lead verified it in the source.
