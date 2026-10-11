# Atlas map, spec v3: "places on a map, not numbers on a grid"

- **Owner:** the designer, for the Atlas review loop ([`PANEL.md`](PANEL.md)). The Atlas lane builds it.
- **Status:** slice 1 is ready to build. Slices 2–5 are specified and get refined as the panel's findings land (§9).
- **Prototypes:** [`proto/`](proto/), shot at 1440×900 and 390×844, in light and dark. They use real coordinates on a flat stub basemap; see §6.
- **Rule 6:** no brand names. The owner's reference is written as "the real-estate map-search pattern".
- **Casing** (DESIGN-SYSTEM §v2.6): every map label, chip, pin and legend string in this spec is sentence case. Collection and cuisine labels on pins, cards and filters go through `sentenceCase()`. There are no uppercase eyebrows.

## 0. What is wrong, and the one idea that fixes it

The current map shows three look-alike number systems:
- dark cluster bubbles (2 … 156);
- white rank pills (23, 43 …);
- sun ★ pills.

The first screen is a grid of black discs and says nothing about *what* is where (AO-1, AO-2, AO-5).

**v3 principle: the map shows *places*, the list shows *order*.**
- Rank numbers leave the map entirely; they stay in the list, where order means something.
- A map marker answers two questions at a glance: *what kind of place is it*, and *is it one of the best*.
- Density is drawn as quiet dots, not counted.
- Names appear wherever they fit.
- Everything else is one hover, click or zoom away.

This brings back the live map-centred guide's calm. That guide has one big map, area-coloured markers, a small legend, a base switch and locate-me. v3 adds the map-search interactions the owner asked for: the list follows the map, labelled pills, hover in sync, preview → detail, and a phone carousel.

---

## 1. Slice 1: the pin system, density and the default view (build first)

### 1.1 Three marker levels, chosen per viewport

| Level | What | Drawn as | DOM cost |
|---|---|---|---|
| **Featured pin** | The best places in view (§1.3), up to **N = 16 desktop / 8 phone** (prototype: Tokyo 16 / 7). 24 read as busy in review, so the count was lowered. | A **labelled pill**: one kind glyph + the short name (§1.2) | One divIcon each, so ≤ 16 nodes |
| **Place dot** | Every other place in view | A **7 px dot** in **one quiet neutral**: `--ink` at 38 % for sights, `--ink` at 62 % for eat & drink, and hollow when closed, with a thin surface halo. **No number and no area colours.** Area colour returns only when an area filter is active, and in the Key. | **Zero**: one shared canvas layer (`L.canvas()` circleMarkers) |
| **Density disc** (replaces clusters) | Only where dots would overlap into a blob: more than 12 dots inside 28 px, which in practice means region zoom (≤ 11) | A soft **`--sand` disc at 80 % opacity** with a 1 px `--line` ring, sized by count (24 / 32 / 40 px) and **no number**. It reads as "lots here". | Canvas, zero nodes |

- **No count bubbles and no rank numbers on the map, at any zoom.**
- Counts belong to the list's count line (§2.3). The map's job is *where*.
- Clicking a density disc zooms in one step to its bounds. Clicking a dot selects the place, just as a pin does (§1.4).
- **Dots keep every place visible on the map**: nothing is hidden behind a cluster count.
- **Performance:** 500+ dots on one canvas pan at 60 fps. The DOM holds at most 16 pins plus 1 preview, well under the 3,000-node budget. The current divIcon count bubbles and rank pills are removed.

### 1.2 Pin anatomy (featured pin)

```
 ┌──────────────────────────┐
 │ glyph  Sensō-ji      ♥   │   height 30 px · radius pill · 1 px --line · --surface fill
 └──────────────────────────┘   hit area ≥ 44 px (invisible ::before)
```

- **One glyph, the kind** (16 px, `--ink-2`, 1.5 stroke, from the v2 icon set). There is no area dot and no star. The orchestrator's review found that three leading marks per pill were busy.
  - **Sight:** the place's own kind glyph (`data-gl`: lantern, castle, columns, leaf, tower, wave …).
  - **Eat & drink:** the **fork-and-knife**, or the cup for cafés.
- **Short name on the map:**
  - Inter 600, 13 px, `--ink`, on one line, **never truncated**.
  - The map name is the place name up to the first ", ", " — " or " – ", with any parenthesis dropped. For example, "Nonbei Yokochō, Shibuya" becomes **Nonbei Yokochō**, and "Chess Collection — Cleveland Public Library…" becomes **Chess Collection**.
  - The full name appears in the tooltip, the preview, the card and the detail.
  - If a pill does not fit, it becomes a dot rather than truncating or overlapping (§1.3).
- **Must-see:** shown by the pill's **own treatment**: a **`--sun-wash` fill** with a `--sun` border at 55 % and `--on-sun-wash` text and glyph. There is no extra mark. Other featured places keep the surface pill, so the map reads as warm pills (the best) and white pills (good).
- **Saved:** a 14 px `--accent` heart chip sits on the pill's top-right corner, on a surface ring. Saved places are **always featured**: they are added first and count toward N.
- **Closed:**
  - The pill uses a `--line-strong` dashed border and a `--sand` fill; glyph and name are in `--ink-3`.
  - The name is followed by " · Closed".
  - It never gets the Must-see treatment and never counts toward N unless it is saved or selected.
  - A closed dot is hollow.
- **Hover** (on the map, or from its card in the list): the border becomes `--ink`, with `--shadow` and the top z-index. If the place was a dot, it temporarily becomes a labelled pill.
- **Selected:**
  - The fill becomes **`--ink`**, with name and glyph in **`--paper`**. A short stem points to the exact coordinate. This is the only dark marker on the map.
  - A Must-see keeps a 2 px `--sun` ring.
  - The selected place is always labelled.
- **Focus:** a 2 px `--focus` outline at a 2 px offset.
- **Dark mode:** pins are defined by tokens, so they flip automatically. A Must-see pill becomes `#3B2C10` with `#FBE3B0` text.

### 1.3 Which places are featured (the "map priority")

Tiers are graded within each area, which is an editorial rule: Tokyo has 177 Must-sees across 13 areas. So "the best 16 in view" needs one city-wide order. It must be computed at build time and stored per place as `mp` (map priority, an integer, lower is better):

1. tier ascending (1 Must-see → 3 Deep cut);
2. then the number of named sources, descending;
3. then rank within area, ascending;
4. **then a round-robin across areas.** The top Must-see of every area comes before the second Must-see of any area, so the featured set covers the whole viewport and does not cluster downtown.

**Per viewport:**
1. Take the places inside the visible map area (excluding any panel overlay).
2. Add saved places first, then the selected place, then sort the rest by `mp`.
3. Walk the list, placing a pill if its label box does not collide with an already placed pill (a greedy check, with a 4 px gap).
4. Stop at N (16 / 8). A pill that would collide or run off the map edge is skipped and stays a dot. Labels are never truncated.
5. Every place not placed becomes a dot.
6. Recompute on `moveend` and `zoomend`, debounced at 120 ms.

As you zoom in, more places fit, so more names appear. That is the progressive disclosure, with no separate zoom thresholds to tune.

### 1.4 Default view (first open, no `#p=` and no saved view)

- **Fit** the map to the **top 30 places by `mp` (top 12 on phones) inside the city core**:
  - The **city core** is the circle around the median point of all places that holds 60 % of them.
  - Outliers further than 2.5× the median distance from the centroid are then dropped.
  - Padding is 48 px. On phones, the fit uses the band between the chip row and the carousel.
- The round-robin in `mp` deliberately reaches every area, including day-trip areas such as Tama or Kantō from Tokyo, or Bangkok on a Singapore-town page. The core rule keeps those areas from zooming the city out to a region.
- Expected result:
  - **Tokyo** opens on central Tokyo at zoom 13 on desktop (16 labelled pins, 334 dots, no discs) and zoom 12 on phones (7 pins). These counts are measured in the prototype.
  - **Cleveland** opens on Downtown, Ohio City and University Circle.
  - **Chinatown (Singapore)** opens on the town itself (16 places, every one featured).
- **Restore the last Atlas view** (centre and zoom) per city from `sessionStorage`, wrapped in try/catch. Coming back from the detail or from another view never resets the map (R4).
- **`#p=<id>`:** centre on the place at zoom ≥ 15, selected, with its preview open (desktop) or its carousel card active (phone).
- **Click or tap behaviour:**
  - **Pin:** selects the place, opens the preview (desktop) or brings in its carousel card (phone), and lights its card in the list.
  - **Dot:** the same as a pin. The dot becomes a selected pill.
  - **Empty map:** clears the selection.

### 1.5 Legend (the "Key" button, desktop and phone)

The legend opens a small popover with four rows:
- **Sight**: a pill with a lantern glyph;
- **Eat & drink**: a pill with the fork glyph and the sun bar;
- **Must see**: a sun-wash pill;
- **Closed**: a dashed pill.

It ends with a dot row, "More places · zoom in to see their names". With an area filter on, it also shows the area colours. Count bubbles are no longer explained, because they no longer exist.

### 1.6 Acceptance for slice 1 (the FE engineer's checks)

- No visible number on the map at any zoom on Tokyo, Cleveland, Chinatown and New York. The map attribution text is the only exception.
- Default Tokyo view (1440×900): between 12 and 16 labelled pills, from at least 5 different areas; no density disc; ≥ 1 food pill; no truncated label.
- 390×844: ≤ 8 labelled pills, with no pill under the carousel or the chip row.
- Pan and zoom produce no more than 16 + 1 marker DOM nodes. Page DOM ≤ 3,000. Dots render on canvas in one neutral (two shades by kind).
- `#p=` opens the place selected and labelled at zoom ≥ 15.
- Closed places show dashed or hollow markers and " · Closed" on any visible label.
- Every place remains reachable through the list's "Show all" and through its dot, with or without tiles. Without the map library, the list is unchanged.

---

## 2. Slice 2: chrome and the list (after slice 1)

### 2.1 Desktop: one bar, map ≤ 120 px from the top (AO-3)

- **The site header shrinks to 56 px:** wordmark, breadcrumb and the view switch (Gallery · **Atlas** · Guidebook · Insights) on the right.
- **One control bar, 52 px**, directly above the map and list, holding left to right:
  - the **search pill**: "Search Tokyo · place, dish, area";
  - kind chips: **All / Sights / Eat & drink**. They are segmented and carry no counts;
  - **Must see** as a toggle chip;
  - **Saved ♥**;
  - **Filters** (area, source, sort and closed places go in the tray);
  - on the far right, **"Search as I move the map"** as a compact switch.
- Total chrome is 56 + 52 = **108 px** before the map.
- **Split:** the map takes 62 % and the list 38 % (with a minimum list width of 420 px). The map is on the left, so it is the first thing the eye lands on.

### 2.2 Phone: the map is the screen (AO-6)

- **Header** (52 px): back, the city name, and search and saved icons.
- **One floating chip row** over the map: All / Sights / Eat & drink / ♥ / Filters.
- **No + / − buttons** (pinch zooms). **Locate** and **layers** sit as one stacked 44 px control at the bottom-right, above the carousel. **Key** moves inside Filters.
- **Attribution:** a single line of 11 px text in `--ink-2` on a 70 % surface strip at the bottom-left, above the carousel. It stays legible but small. It is non-interactive except for its links.

### 2.3 The list beside the map (AO-4, AO-7)

- **It follows the bounds**, ranked by `mp`, and is **not grouped by area**. There are no "area 1 of 13" counters and no area-chip row; area lives in the Filters tray.
- **One count line:** "128 places here · Show all 488". With "Search as I move the map" off, it reads "128 places in view · Search this area".
- **Card hierarchy:**
  1. **Photo**: 4:3, with a 16 px radius. Without a photo, the calm cover.
  2. **Name**: Inter 600, 17 px.
  3. **Why / kind line**: area · kind · one line of why it's here, 15 px, `--ink-2`.
  4. **Sources**: "Recommended by GO Tokyo, Wikipedia +1", 15 px.
  5. **Credit**: a quiet 12 px `--ink-3` line under the photo. It is always visible and never clipped (licence).
- **On the photo:** only the heart (top-right) and the Must-see sticker (top-left).
- **No rank number on Atlas cards.** The list order *is* the ranking. "No. 1" per area read as noise in a city-wide list, so ranks stay in the Guidebook.

---

## 3. Slice 3: preview, carousel, List/Map pill, detail round-trip (R4, R5)

- **Desktop preview card** (on the map, beside the selected pin, never covering it):
  - 320 px wide: photo 16:9, name, kind line, one-line why, sources and credit.
  - Actions: **Open details** (primary) and **Save**. It closes on Esc or a map click.
  - It is the same card component as the list (one family, R6).
- **Phone carousel:**
  - The bottom sheet peeks at 132 px with a horizontal snap carousel of compact cards: 96 px photo, name, kind line and sources, with a heart.
  - Swiping lights the pin and pans gently (no pan under reduced motion). Tapping opens the detail.
- **"List" / "Map" pill:** floating and centred, 44 px, above the carousel. It toggles the full list sheet.
- **Detail round-trip:** the detail opens as a sheet (phone) or a side page (desktop) over the Atlas. Closing it returns to **the same map centre, zoom and selection**, from the saved view in §1.4. Deep links `#p=` and `#view=atlas&c=lat,lng,z` both reopen exactly.

## 4. Basemap: **settled** by the real-tile R0 shots (`real/R0/`). Ship it with slice 1.

- **What R0 showed:**
  - **OSM standard is far too busy under our pins.** Saturated pink, orange and yellow roads and dense labels compete with every pin and with the v2 palette (`tokyo-1440-light-1-default`).
  - **Dark mode currently shows the bright OSM tiles**, a glaring light map in a dark UI (`tokyo-1440-dark-2-zoomed`).
- **The decision:** all hosts below are no-key and on `server.arcgisonline.com`, which `tools/engine_guard.py` already allows. Never use CARTO (`TILE_FORBIDDEN`).

| Theme / option | Base layer | Labels layer (on top) |
|---|---|---|
| **Light (default)** | `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}` | `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}` |
| **Dark (default when the page is dark)** | `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}` | `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}` |
| Satellite (the one alternative in the base switch) | `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}` | none |
| Street detail (optional third choice, **never the default**) | `https://tile.openstreetmap.org/{z}/{x}/{y}.png` | none |

- **Options:**
  - Both gray canvases use `maxNativeZoom: 16, maxZoom: 19` and upscale beyond 16.
  - The labels layer sits in its own pane, below the marker pane, at `opacity: .85`, so place names never sit on top of our pins.
  - Attribution: "Tiles © Esri — Esri, HERE, Garmin, © OpenStreetMap contributors" for the canvases, and "© OpenStreetMap contributors" for Street.
- **Follow the theme:**
  - The default base is chosen from the current theme: `prefers-color-scheme`, or `data-theme` when it is pinned.
  - It **switches live** when the theme toggles.
  - A stored user choice of Satellite or Street overrides the default. "Map" means the theme's gray canvas.
  - Today's stored default of `street` (`city.js` → `store.get('base', 'street')`) changes to the theme canvas.
- **The base switch control** is one button that cycles **Map ⇄ Satellite**, with Street detail inside the Key / Filters popover. On phones it lives in the stacked locate/layers control.
- The palette needs no tile CSS filter: the gray canvases already sit inside it.
- R1 real-tile shots will confirm this in light and dark.

## 5. Slice 5: access for every generation (R7)

- **Panel text:** body ≥ 16 px; the kind line and sources at 15 px, ≥ 4.5:1. Pill labels are 13 px but have ≥ 7:1 contrast and are duplicated in the list.
- **Targets:** every pin and dot hit area is ≥ 44 px on phones and ≥ 24 px with spacing on desktop. All controls are 44 px.
- **Keyboard path:**
  1. Tab moves through search, chips, Filters, the map and the list.
  2. **On the map, arrow keys move between featured pins in `mp` order**, with Enter to select. A visually hidden live region announces "Sensō-ji, sight, Must see, Taitō-ku, 3 of 16 shown".
  3. Esc closes the preview.
  4. "Skip map" jumps straight to the list.
- **Reduced motion:** no flyTo or pan animation, and no pin scale. Changes are instant.
- **Without the map library, or with tiles blocked:** the list is complete and ranked, the count line says "Map unavailable · all 488 places listed", and the controls that need the map hide themselves.

## 6. Prototypes

[`proto/make-proto.py`](proto/make-proto.py) renders static pages from the **real** place data, using the coordinates, tiers, kinds, areas, closures and photos. The pages are Tokyo default, Tokyo zoomed (Asakusa/Ueno), Tokyo selected + preview, Cleveland default, Chinatown default and the phone carousel. They apply exactly the rules in §1. The basemap is a **flat stub** (`--sand`) with no invented streets, so the pins are judged on their own. Shots are in [`proto/shots/`](proto/shots/).

## 7. Hard rules kept (PANEL.md §7)

- Every place stays reachable: dots plus "Show all", and the list without the map.
- No CDN.
- OSM/Esri no-key tiles only.
- Closures are flagged on pins, dots, cards and the preview.
- Credits and attribution stay visible.
- No brand names.
- DOM ≤ 3,000 and first load ≤ 2.0 MB. The slice 1 change *removes* hundreds of divIcons.

## 8. Build order and hand-off to the Atlas lane

1. **Slice 1** (pins, dots and discs, `mp`, default view, legend). This is the biggest win on R1, R2 and R6.
2. **Slice 2** (one bar, phone controls, a flat ranked list, the card hierarchy).
3. **Slice 3** (preview, carousel, round-trip, deep links).
4. **Basemap**: settled (§4); ships with slice 1.
5. **Slice 5** (keyboard pin navigation, live region, no-map state).

## 9. Review findings folded in

| Source | Finding | Answer in this spec |
|---|---|---|
| Orchestrator review of slice 1 (2026-10-11) | The pill carried three leading marks (area dot, star, glyph) | §1.2: one glyph only. Must-see is shown by the sun-wash fill. |
| 〃 | Hundreds of dots in six or more area colours read as confetti | §1.1: one neutral, with two shades by kind. Area colour appears only under an area filter and in the Key. |
| 〃 | Truncated labels ("Imperial Palace East …") | §1.2: short names, never truncated. A pill that collides becomes a dot. |
| 〃 | Are 24 pills too many? | §1.1: lowered to N = 16 desktop / 8 phone, measured in the prototype. |
| 〃 | The casing rule | Header: every string is sentence case. |
| Real-tile shots R0 | OSM is too busy, and dark mode shows bright tiles | §4: the basemap is settled (Esri Light/Dark Gray Canvas, following the theme). |
| PANEL-R0 | not landed yet | rows will be added when it lands |
