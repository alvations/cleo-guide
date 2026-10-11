# Atlas map, spec v3: "places on a map, not numbers on a grid"

- **Owner:** the designer, for the Atlas review loop ([`PANEL.md`](PANEL.md)). The Atlas lane builds it.
- **Status:** revision 2, after PANEL-R0 (56.1 / 100; [`PANEL-R0.md`](PANEL-R0.md)). Every R0 finding has an answer and an acceptance check in this spec; the map is in §9. Slice 1 is ready to build; slices 2, 3 and 5 are specified to the panel's acceptance numbers.
- **Prototypes:** [`proto/`](proto/), shot at 1440×900 and 390×844, in light and dark. They use real coordinates on a flat stub basemap; see §6.
- **Rule 6:** no brand names. The owner's reference is written as "the real-estate map-search pattern".
- **Owner direction:** combine the best patterns of every product kind and don't copy one (§10). The map-search navigation is the frame, not the whole product.
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
| **Featured pin** | The best places in view (§1.3), up to **N = 16 desktop / 8 phone** (prototype: Tokyo 16 / 8). 24 read as busy in review, so the count was lowered. | A **labelled pill**: one kind glyph + the short name (§1.2) | One divIcon each, so ≤ 16 nodes |
| **Place dot** | Every other place in view | A **7 px dot** in **one quiet neutral**: `--ink` at 38 % for sights, `--ink` at 62 % for eat & drink, with a thin surface halo. A **closed** dot is hollow with a 1.5 px diagonal slash, so "closed" is an icon at every zoom, not only a shade (R0 #7). Canvas `tolerance: 19` gives every dot a 44 px hit circle (R0 #5). **No number and no area colours.** Area colour returns only when an area filter is active, and in the Key. | **Zero**: one shared canvas layer (`L.canvas()` circleMarkers) |
| **Density disc** (replaces clusters) | Only where dots would overlap into a blob: more than 12 dots inside 28 px, which in practice means region zoom (≤ 11) | A soft **`--sand` disc at 80 % opacity** with a 1 px `--line` ring, sized by count (24 / 32 / 40 px) and **no number**. It reads as "lots here". | Canvas, zero nodes |

- **No count bubbles and no rank numbers on the map, at any zoom.**
- Counts belong to the list's count line (§2.3). The map's job is *where*.
- Because rank numbers and count bubbles are gone, no two visible markers can carry the same text, which was R0 #1's "★ 2 twice in one view".
- Clicking a density disc zooms in one step to its bounds. Clicking a dot selects the place, just as a pin does (§1.4).
- **Dots keep every place visible on the map**: nothing is hidden behind a cluster count.
- **Performance:** 500+ dots on one canvas pan at 60 fps. The DOM holds at most 16 pins plus 1 preview, well under the 3,000-node budget. The current divIcon count bubbles and rank pills are removed.

### 1.2 Pin anatomy (featured pin)

```
 ┌──────────────────────────┐
 │ glyph  Sensō-ji      ♥   │   height 32 px · radius pill · 1 px --line · --surface fill
 └──────────────────────────┘   hit area ≥ 44 × 44 px on every viewport (invisible ::before)
```

- **One glyph, the kind** (16 px, `--ink-2`, 1.5 stroke, from the v2 icon set). There is no area dot and no star. The orchestrator's review found that three leading marks per pill were busy.
  - **Sight:** the place's own kind glyph (`data-gl`: lantern, castle, columns, leaf, tower, wave …).
  - **Eat & drink:** the **fork-and-knife**, or the cup for cafés.
- **Short name on the map:**
  - Inter 600, **14 px** (raised from 13 for R0 #5: no text under 14 px except credits and the attribution), `--ink`, on one line, **never truncated**.
  - The map name is the place name up to the first ", ", " — " or " – ", with any parenthesis dropped. For example, "Nonbei Yokochō, Shibuya" becomes **Nonbei Yokochō**, and "Chess Collection — Cleveland Public Library…" becomes **Chess Collection**.
  - The full name appears in the tooltip, the preview, the card and the detail.
  - If a pill does not fit, it becomes a dot rather than truncating or overlapping (§1.3).
- **Must-see:** shown by the pill's **own treatment**: a **`--sun-wash` fill** with a `--sun` border at 55 % and `--on-sun-wash` text and glyph. There is no extra mark. Other featured places keep the surface pill, so the map reads as warm pills (the best) and white pills (good).
- **Saved:** a 14 px `--accent` heart chip sits on the pill's top-right corner, on a surface ring. Saved places are **always featured**: they are added first and count toward N.
- **Closed:**
  - The pill uses a `--line-strong` dashed border and a `--sand` fill; glyph and name are in `--ink-3`.
  - The name is followed by " · Closed" as visible text, and the aria-label contains "Closed".
  - It never gets the Must-see treatment and never counts toward N unless it is saved or selected.
  - A closed dot is hollow.
- **Hover** (on the map, or from its card in the list): the border becomes `--ink`, with `--shadow` and the top z-index. If the place was a dot, it temporarily becomes a labelled pill.
- **Selected:**
  - The fill becomes **`--ink`**, with name and glyph in **`--paper`**. A short stem points to the exact coordinate. This is the only dark marker on the map.
  - A Must-see keeps a 2 px `--sun` ring.
  - The selected place is always labelled.
- **Focus:** a 2 px `--focus` outline at a 2 px offset.
- **Markup and name** (R0 #6, #7): each featured pin is a link, `<a href="#p=<id>">`, with `data-kind="sight|food"` and an `aria-label` built as *full name, kind, [Must see], [Closed], [saved]*, for example "Sensō-ji, sight, Must see, saved" or "Heinen's, eat and drink, Closed". The kind is never colour or fill alone: the glyph differs (a place glyph vs the fork-and-knife or cup) and so does the label.
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
  - **Tokyo** opens on central Tokyo at zoom 13 on desktop (16 labelled pins, 340 dots, no discs) and zoom 12 on phones (8 pins). These counts are measured in the prototype.
  - **Cleveland** opens on Downtown, Ohio City and University Circle.
  - **Chinatown (Singapore)** opens on the town itself at zoom 17 (13 places in view: 8 labelled at 14 px, the rest dots that name themselves on hover or one zoom step in).
- **Restore the last Atlas view** (centre and zoom) per city from `sessionStorage`, wrapped in try/catch. Coming back from the detail or from another view never resets the map (R4).
- **`#p=<id>`:** centre on the place at zoom ≥ 15 in the part of the map the detail or preview does not cover (§3.2), selected, with its preview open (desktop) or its carousel card active (phone).
- **`#view=atlas&c=lat,lng,z`:** restore exactly that view (§3.5). It wins over the stored session view.
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

### 1.6 Acceptance for slice 1 (the FE engineer's checks; the R0 numbers are in bold)

- No visible number on the map at any zoom on Tokyo, Cleveland, Chinatown and New York. The map attribution text is the only exception. **Numbered labels: 0** (R0 asked ≤ 20).
- Default Tokyo view (1440×900): between 12 and 16 labelled pills, from at least 5 different areas, Must-sees first; no density disc; ≥ 1 food pill; no truncated label. **Named labels ≥ 5; visible clusters 0** (R0 asked ≤ 15). **No two visible pins carry the same text.**
- Tokyo zoomed in two steps from the default: **named labels ≥ 10**.
- 390×844: ≤ 8 labelled pills, with no pill under the chip row, the peek or the carousel. **No count bubble at all** (R0 asked the largest ≤ 99). **Density discs on the phone first screen ≤ 10** (0 at the default zoom 12; discs only draw at zoom ≤ 11).
- Every pin's hit area is ≥ 44 × 44 px; every dot's canvas hit circle is ≥ 44 px.
- Every featured pin exposes `data-kind` and an aria-label with its kind; a closed pin's aria-label contains "Closed".
- Pan and zoom produce no more than 16 + 1 marker DOM nodes. Page DOM ≤ 3,000. Dots render on canvas in one neutral (two shades by kind).
- `#p=` opens the place selected and labelled at zoom ≥ 15, **clear of the panel** (§3.2).
- Closed places show dashed pills or slashed hollow dots, and " · Closed" on any visible label.
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
- **Split:** the map takes 64 % and the list 36 % (with a minimum list width of 420 px). The map is on the left, so it is the first thing the eye lands on.
- **Acceptance (R0 #3):** the map's clear area starts at ≤ 120 px on all four pages (108 px here), and the map box is ≥ 55 % of the first screen (64 % × 792 / 900 = 56 % at 1440×900).
- **Map controls on desktop:** + / − (top-left of the map), Key (bottom-left), and one stacked locate / layers control (bottom-right). The attribution is one 11 px line at the bottom-right edge; the featured-pin layout treats its box as off-map, so it never covers a pin.

### 2.2 Phone: the map is the screen (AO-6, R0 #3, #9, #12)

- **Header** (52 px): back, the city name, and search and saved icons.
- **One floating chip row** over the map: **All / Sights / Eat & drink / Must see / Filters**. It scrolls sideways if it must; chips carry no counts.
  - **Must see** is one toggle. When it is on, the chip itself turns ink (`--ink` fill, `--paper` text). There is no second "Must see ×" pill.
  - **Filters** opens a sheet whose **first section is Area**, so a neighbourhood is two taps away (Filters → the area). Picking one closes the sheet and fits the map to that area (R0 #12). Source, sort, closed places and the Key follow.
- **Bottom: a 64 px list peek**, not the carousel. It shows the drag handle and one line, "128 places here · Show list". Tapping or dragging it opens the full list sheet. This replaces the floating "List" pill.
- **The carousel appears only after a selection** (a pin, a dot or a search result) or after locate-me (§3.4). It replaces the peek; Escape, the back gesture or a tap on empty map brings the peek back.
- **Controls:** **two**, locate and layers, as one stacked 44 px control at the bottom-right, 28 px above the peek or carousel, so it is in thumb reach. No + / − buttons (pinch zooms). Key lives in Filters. (R0 asked ≤ 3 controls in the bottom 60 %.)
- **Attribution:** a single line of 11 px text in `--ink-2` on a 70 % surface strip at the bottom-left, directly above the peek or carousel. The featured-pin layout and the default fit both treat that strip as off-map, so it never covers a pin.
- **Clear map on the first screen:** 844 − 52 header − 52 chip row − 64 peek = 676 px, **80 %** (R0 asked ≥ 75 %). With the carousel open it is 70 %, which is a selected state, not the first screen.

### 2.3 The list beside the map (AO-4, AO-7)

- **It follows the bounds**, ranked by `mp`, and is **not grouped by area**. There are no "area 1 of 13" counters and no area-chip row; area lives in the Filters tray.
- **One count line:** "128 places here · Show all 488". With "Search as I move the map" off, it reads "128 places in view · Search this area". With a location it reads "31 places here · nearest first · Show all 225".
- **At most two count strings above the first card, and they never disagree** (R0 #8). The count line is the only one on desktop; on phones the peek repeats the same number. Removed: "N more outside", "area n of N", kind-chip counts and area-chip totals. Every visible number is one of three things: the in-bounds total, the filtered total or the all-places total.
- **Card hierarchy:**
  1. **Photo**: 4:3, with a 16 px radius. Without a photo, the calm cover.
  2. **Name**: Inter 600, 17 px.
  3. **Kind line**: [distance ·] area · kind, **16 px**, `--ink-2`. The distance, when located, is `--ink` 600 (§3.4).
  4. **Why**: one line of why it's here, **16 px**, `--ink-2`.
  5. **Sources**: "Recommended by GO Tokyo, Wikipedia +1", **16 px**.
  6. **Credit**: a quiet 12 px `--ink-3` line under the photo. It is always visible, wraps to two lines if it must, and is never clipped (licence). Credits and the map attribution are the only text under 14 px (R0 #5).
- **No photo** (R0 #10): the calm v2 cover (`--sand`, one 30 px kind glyph in `--ink-3`) at exactly the photo's 4:3 box, so a no-photo card is the same height as its neighbours and never reads as a broken image.
- **On the photo:** only the heart (top-right) and the Must-see sticker (top-left).
- **No rank number on Atlas cards.** The list order *is* the ranking. "No. 1" per area read as noise in a city-wide list, so ranks stay in the Guidebook.

---

## 3. Slice 3: preview, carousel, near me, round-trip and sharing (R4, R5; R0 #2, #4, #9, #13)

### 3.1 Desktop preview card

- It sits on the map beside the selected pin and **never covers it**. If the pin is within 352 px of an edge, the preview opens on the other side; only if neither side fits does the map pan, by the minimum needed.
- 320 px wide: photo 16:9 (or the calm cover at the same 16:9 box, never an empty frame), name, kind line, one-line why, sources and credit.
- Actions: **Open details** (primary) and **Save**. It closes on Esc or a map click, and **focus returns to the pin or card that opened it**.
- It is the same card component as the list (one family, R6).

### 3.2 Detail round-trip (R0 #2: 8 of 8 panelists)

- **Opening the detail never moves the map.** There is no flyTo to zoom 15 when the detail opens from a card, a pin or the preview. The detail opens as a side page (desktop, 560 px on the right, over the list) or a sheet (phone) *over* the Atlas.
- **Closing it (Esc, the close button or Back) restores everything that was there**: the map centre and zoom, the selection, the list's scroll position, the page's `scrollY`, the filter and the List count. Focus returns to the element that opened it. Nothing is recomputed from scratch; the Atlas state simply stays alive under the detail.
- **A fresh `#p=<id>` load** centres the place at zoom ≥ 15 **in the part of the map the detail does not cover**: on desktop the centre is offset left by half the panel width (280 px); on phones the place sits in the band above the sheet. The page does not scroll on load.
- **Acceptance:** card → detail → Esc, and → Back, on 4 pages × 2 viewports: centre within 1 px, zoom identical, page `scrollY` and list scroll change by 0, List count unchanged, focus on the opening card. Deep link: `pinUnderSheet: false` on all 8 pairs.

### 3.3 Phone carousel (R0 #9)

- It replaces the peek after a selection or locate-me (§2.2) and is **150 px** tall, handle included.
- **Cards are 282 px wide** with a 72 px square thumbnail, so 1.3 cards show and the next name is always visible. The carousel snaps card by card: one swipe brings cards 2 and 3 into view, so **three names take one swipe**.
- A card holds: thumbnail (or calm cover) with the heart, the name (16 px 600, up to two lines, never truncated), the kind line (14 px, with the distance when located) and sources. The **credit runs under the row at full card width** and wraps; it is never clipped (`scrollWidth ≤ clientWidth` on every credit).
- Swiping lights the pin and pans gently, only if the pin would leave the uncovered band (no pan under reduced motion). Tapping a card opens the detail (§3.2).
- The first card is the selected place, or after locate-me the nearest place **inside the map bounds**. It is never a place outside the viewport.

### 3.4 Near me (R0 #4: 6 of 8 panelists)

- **Locate-me** centres the map on the person at zoom 15 (the uncovered band on phones) and draws a 16 px `--series-1` location dot with a surface ring and a soft 14 px halo.
- It **switches the list and carousel sort to "Nearest first"**, keeping any kind filter, and the count line says so. The sort stays until the person picks "Best first" in Filters → Sort, or turns location off.
- **Every card shows its distance** while location is on: "90 m · 1 min walk", "1.4 km · 18 min walk". Metres are rounded to 10 under 1 km; above that, one decimal of a kilometre. Walking time is distance ÷ 80 m/min, a stated assumption (no routing service).
- On phones the carousel opens on the nearest in-bounds place.
- **Acceptance** (rerun T3: Shibuya 35.6595, 139.7005, then Eat & drink): the first desktop card and the first carousel card are within 1.2 km, Nonbei Yokochō or The Bellwood are in the top 3, every card shows a distance, and the first carousel card is inside the map bounds in 100 % of probe states. The prototype `tokyo-nearme` shows Nonbei Yokochō first at 90 m.

### 3.5 Sharing the view (R0 #13)

- While Atlas is open, the URL carries the view: `#view=atlas&c=<lat>,<lng>,<zoom>` (5 decimals, zoom to 0.1), updated with `history.replaceState` on `moveend`, so it never adds history entries. A selected place adds `&p=<id>`.
- Opening such a URL lands within 1 px and 0.1 zoom of where it was copied, and that wins over the stored session view.
- **The share toast says what the link restores**, and nothing more: "Link copied · opens this map view", or "Link copied · opens Sensō-ji" when a place is selected.

### 3.6 Rank context in the detail (R0 #14)

- On Atlas the detail's rank line reads "No. n of N in <area>", where N is the area's place count in the current data, the same N its area filter shows. It never uses a filtered or in-bounds count.

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

## 5. Slice 5: access for every generation (R7; R0 #5, #11)

- **Panel text:** the card name, kind line, why and sources are ≥ 16 px (§2.3); pill labels 14 px at ≥ 7:1 and duplicated in the list. Nothing is under 14 px except photo credits and the map attribution.
- **Targets:** every pin and dot hit area is ≥ 44 × 44 px on every viewport; every control is 44 px. The first screen has 0 targets under 24 px. Inline links that must stay small (licence links in credits) get 8 px of vertical padding so their hit box reaches 24 px.
- **Keyboard path** (replaces revision 1's "arrow keys move between pins"; R0 #11):
  1. The first Tab stop is a **"Skip to results"** link, visible on focus, which moves focus to the first card (≤ 15 stops in every case, in practice 1).
  2. Then: search, the kind chips, Must see, Saved, Filters, the switch.
  3. Then **the map container** (`tabindex="0"`, labelled "Map of Tokyo, 128 places here"). With it focused, **arrow keys pan and + / − zoom**, and the list and count follow.
  4. Then the **featured pins, in `mp` order** (markers with `keyboard: true`): at most 16 stops, so the first pin is ≤ 12 stops from the top of the page. Enter on a pin opens its preview; Escape closes it and returns focus to the pin.
  5. Then the list.
  - Every stop shows the 2 px `--focus` ring, the search input included (`stopsWithoutVisibleRing = 0`).
- **Announcements:** a visually hidden polite live region announces the count line when it changes (debounced to 500 ms), and the selected place's aria-label when a pin is selected.
- **Reduced motion:** no flyTo or pan animation, and no pin scale. Changes are instant.
- **Without the map library, or with tiles blocked:** the list is complete and ranked, the count line says "Map unavailable · all 488 places listed", and the controls that need the map hide themselves.

## 6. Prototypes

[`proto/make-proto.py`](proto/make-proto.py) renders static pages from the **real** place data, using the coordinates, tiers, kinds, areas, closures and photos. The pages are Tokyo default, Tokyo zoomed (Asakusa/Ueno), Tokyo selected + preview, Cleveland default, Chinatown default and **Tokyo near me** (located at Shibuya with Eat & drink on: nearest first, distances, the location dot, and the phone carousel opening on the nearest place). Revision 2 re-rendered all of them with 14 px pins, aria-labels, the 64/36 split, the phone peek and the 282 px carousel cards. They apply exactly the rules in §1. The basemap is a **flat stub** (`--sand`) with no invented streets, so the pins are judged on their own. Shots are in [`proto/shots/`](proto/shots/).

## 7. Hard rules kept (PANEL.md §7)

- Every place stays reachable: dots plus "Show all", and the list without the map.
- No CDN.
- OSM/Esri no-key tiles only.
- Closures are flagged on pins, dots, cards and the preview.
- Credits and attribution stay visible.
- No brand names.
- DOM ≤ 3,000 and first load ≤ 2.0 MB. The slice 1 change *removes* hundreds of divIcons. R0 measured the Tokyo phone first load at 2,045 KB raw, over budget: on phones only the first 3 carousel and list images may load eagerly (the rest `loading="lazy"`), and the default view no longer needs the cluster plugin's markup.
- Axe: 0 serious or critical. R0 did not run it; the FE engineer runs it from R1.

## 8. Build order and hand-off to the Atlas lane

1. **Slice 1** (pins, dots and discs, `mp`, default view, legend). This is the biggest win on R1, R2 and R6.
2. **Slice 2** (one bar, phone controls, a flat ranked list, the card hierarchy).
3. **Slice 3** (preview, carousel, round-trip, deep links).
4. **Basemap**: settled (§4); ships with slice 1.
5. **Slice 5** (skip link, focusable map and pins, live region, no-map state).
6. **Slice 4, combine** (§10): source and collection lenses, day mode, saved layer and share, Directions and "Near here" in the preview. Build it after slice 3 and before slice 5. Each item reuses an existing beta feature.

The R0 findings sit in these slices: #1, #5 (pins), #6, #7 in slice 1; #3, #8, #10, #12 and the card text of #5 in slice 2; #2, #4, #9, #13, #14 in slice 3; #11 in slice 5.

## 9. Review findings folded in

| Source | Finding | Answer in this spec |
|---|---|---|
| Orchestrator review of slice 1 (2026-10-11) | The pill carried three leading marks (area dot, star, glyph) | §1.2: one glyph only. Must-see is shown by the sun-wash fill. |
| 〃 | Hundreds of dots in six or more area colours read as confetti | §1.1: one neutral, with two shades by kind. Area colour appears only under an area filter and in the Key. |
| 〃 | Truncated labels ("Imperial Palace East …") | §1.2: short names, never truncated. A pill that collides becomes a dot. |
| 〃 | Are 24 pills too many? | §1.1: lowered to N = 16 desktop / 8 phone, measured in the prototype. |
| 〃 | The casing rule | Header: every string is sentence case. |
| Real-tile shots R0 | OSM is too busy, and dark mode shows bright tiles | §4: the basemap is settled (Esri Light/Dark Gray Canvas, following the theme). |
| PANEL-R0 #1 (10.5 pts, 8/8) | No names on the map; number soup; clusters outnumber pins | Already answered by slice 1 (§1.1, §1.2): names on up to 16 pills, no numbers, no count bubbles. Acceptance now carries R0's numbers (§1.6). |
| PANEL-R0 #2 (6.5, 8/8) | Closing the detail loses the view, scroll, count and focus; the deep-link pin hides under the panel | §3.2: opening never moves the map; closing restores centre, zoom, scroll, count and focus; deep links centre clear of the panel. |
| PANEL-R0 #3 (6.1) | 208 px of chrome on desktop; phone 64 % clear, five controls, attribution over pins | §2.1: 108 px, map box 56 %. §2.2: phone 80 % clear (peek instead of carousel), two controls, attribution strip treated as off-map. |
| PANEL-R0 #4 (3.5, 6/8) | Near me isn't near; no distances | §3.4: locate-me sorts nearest first, distances on every card, carousel starts with the nearest in-bounds place. Prototype `tokyo-nearme`. |
| PANEL-R0 #5 (2.8) | Text and targets too small | §1.2 pills 14 px, 44 × 44 hit areas; §2.3 card text 16 px; §5. |
| PANEL-R0 #6 (2.2) | Sight vs eat & drink only by fill | §1.2: different glyphs, `data-kind`, kind in the aria-label. |
| PANEL-R0 #7 (1.9) | Closed not marked on the map | §1.1 slashed hollow dot; §1.2 " · Closed" plus aria. |
| PANEL-R0 #8 (1.5) | Too many, contradictory counts | §2.3: at most two count strings, one source of truth. |
| PANEL-R0 #9 (1.5) | Phone carousel one card per screen; clipped credit; duplicate Must-see pill | §3.3: 282 px cards, three names in one swipe, wrapping credit. §2.2: one Must-see toggle. |
| PANEL-R0 #10 (1.3) | No-photo cards read as placeholders | §2.3 and §3.1: the calm cover at the photo's exact box; no empty frame. |
| PANEL-R0 #11 (1.3, 4/8) | Map not keyboard-reachable | §5: skip link, focusable map with arrow-key pan, pins as Tab stops, visible rings. |
| PANEL-R0 #12 (1.0) | Area buried on phone | §2.2: Area is the first section of Filters, two taps, fits the map. |
| PANEL-R0 #13 (0.5) | Map view not shareable; toast overpromises | §3.5: view in the URL; toast says what the link restores. |
| PANEL-R0 #14 (0.3) | Inconsistent rank context | §3.6: N is always the area's full count. |
| PANEL-R0 task gap | "Tonight" can't be answered | **Decided: no open-now filter.** Opening hours are not in the sourced data, and unsourced or stale hours would break the closed-status promise (CLAUDE.md 4c). The gap is stated, not filled: Atlas offers no "tonight" control rather than a guess. Revisit only if a sourced hours field lands in the data. |
| Owner direction (relayed by the panel, 2026-10-11) | Don't copy one product; combine the best of each, keep the map-search navigation, don't neglect the other features | §10: a combination table built from existing beta features, plus a non-regression rule for Gallery, Guidebook, Insights and the detail (§10.1). |
| PANEL-R0 AO-5 (rejected in part) | Must-sees stand out | Kept: the sun-wash pill stays the Must-see signal. |

## 10. Slice 4: combine the best patterns, don't copy one product (owner direction, 2026-10-11)

> The owner said, in substance: don't make Atlas a literal copy of the real-estate map-search product. Take the best features from each kind of competitor and combine them so the result beats every one of them. Keep iterating on the map-search navigation, which is "super on point", and don't neglect the other features.

**The rule.** The map-search navigation is the frame: the list follows the map, labelled pills, hover in sync, preview → detail, the phone carousel. It stays and keeps improving through the panel rounds. Inside that frame, Atlas surfaces what the other product kinds do best, and **almost all of it already exists in the beta**. Slice 4 brings those features onto the map instead of inventing new ones:

| Pattern (product kind, described neutrally) | Already in the beta | What Atlas does with it | Acceptance |
|---|---|---|---|
| **Why and by whom** (travel-guide products: an editor's reason to go) | Each card has its "Recommended by" sources and a why line | The preview leads with the why line and the named sources (§3.1). Filters → **Source** narrows the map to one publisher's picks, and the count line names it: "23 places · picked by Time Out". No map-search product can show *who* recommends a place. | Choosing a source changes the pins and the count line, and the source chip names it. |
| **Your day on the map** (itinerary and trip-planner products) | `day.js`: a 4–6 stop "Your day" per area, numbered route, legs, a share link (`#day=`) and KML export | With an area filtered, the count line offers **"Plan a day here"**. It draws the day route in `--accent` (the only accent line on the map) with numbered stops. **Numbered markers are allowed only in day mode**, where order means something; this is the single exception to §1.6's "no numbers". Leaving day mode restores the normal pins. | Day mode shows 4–6 numbered stops and the accent route; outside day mode the map has 0 numbers. `#day=` opens Atlas in day mode. |
| **Saved as a map layer, shared as a list** (saving and sharing products) | Saved places, `saved.html`, shareable list links (`listCodec`) | The **Saved ♥** chip filters the map to saved pins and fits them. The count line then reads "6 saved · Share list", which copies the existing list link. A shared list opens in Atlas showing only its places. | Saved chip on: pins = saved places only, fitted; Share copies a `#list=` link that reopens the same set. |
| **Directions handoff** (maps products) | The place sheet already links to directions (OSM, plus the two platform map apps) | The preview gets a third action, **Directions**, which opens the same links as the sheet. Closed places read "Where it was". | Every open place's preview offers Directions; closed ones say "Where it was". |
| **Nearby from here** (maps and local-discovery products) | The coordinates and the near-me distance logic (§3.4) | The preview and the detail add one line, **"Near here: A · B · C"**: the three closest open places within a 10-minute walk, each a link that selects it on the map. | The line lists ≤ 3 open places within 800 m, sorted by distance, and each opens its own preview. |
| **Curated lenses** (editorial city guides: themed lists) | Collections ("Anime, manga and pop culture", "Ramen classics"…) | Filters → **Collection** turns the map into that list. The count line names it ("12 places · Ramen classics", in sentence case per §v2.6). | The collection's places are the only pins and the count line names the collection. |
| **Works without the map** (our own) | Every place is in the list with or without tiles or the map library | Unchanged (§5, §7). | Unchanged. |

**What we deliberately don't copy:** prices, availability calendars, review stars and booking flows. They don't fit a sourced guide, and ratings are never the recommender (CLAUDE.md).

### 10.1 Don't regress the other views

- Atlas work stays in the Atlas lane's files (`atlas.js`, `atlas.css` and the Atlas templates). Changes to **shared** pieces (the card component, the place sheet or detail, `day.js`, `saved.js`, tokens) go through their owners: FE-A for the card, the sheet and day; the designer for tokens and base styles. Such a change also needs a before/after check of **Gallery, Guidebook, Insights and the place detail** at 390 and 1440, in light and dark.
- The panel's evidence pack adds those four views as regression shots from round 1 on. Any visible change there must be intended and named in the round's notes.
- The detail round-trip (§3.2) changes how Atlas *hosts* the detail, not the detail's own layout.
