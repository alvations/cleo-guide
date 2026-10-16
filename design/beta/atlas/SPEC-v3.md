# Atlas map, spec v3: "places on a map, not numbers on a grid"

- **Owner:** the designer, for the Atlas review loop ([`PANEL.md`](PANEL.md)). The Atlas lane builds it.
- **Status:** Atlas is the **default city view** (owner decision D-46; switcher order Atlas, Gallery, Guidebook, Insights; first screen in §1.7). Revision 5a (FE-1 conflicts, 2026-10-16), revision 5 after PANEL-R3 (80.7 / 100; R2 70.9, R1 63.8, R0 56.1; [`PANEL-R3.md`](PANEL-R3.md)). Earlier revisions folded in R0 to R2. Revision 2 folded in PANEL-R0 ([`PANEL-R0.md`](PANEL-R0.md)). Every R0 finding has an answer and an acceptance check in this spec; the map is in §9. Slice 1 is ready to build; slices 2, 3 and 5 are specified to the panel's acceptance numbers.
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
| **Place dot** | Every other place in view | A **7 px marker** in **one quiet neutral**, with a thin surface halo. **Kind by shape** (R1 #4; R2 #6, where 3 px squares beside 3.5 px circles couldn't be told apart at 390): a sight is a **7 px circle** (`--ink` at 30 %); eat & drink is an **8 px square** with a 1 px radius (`--ink` at 72 %). That makes it light-round versus dark-square, distinguishable by eye at 390, which is rev 5's fix after R3's sign-off check failed. Both carry a 1.5 px surface halo. The sizes are diameters and side lengths, the same on every viewport, never radii. In dark mode the alphas are 45 % / 80 % (rev 5a: at 30 % / 50 % the real dark canvas swallowed the circle fill, about 1.2:1, so sights read as rings); measured on the real tile, a dark circle is ≥ 2:1 against the canvas and a square ≥ 4.5:1. **No tier colour on dots** (rev 5, R3 #4): must-sees are 36 % of places, so sun-coloured dots turned the light map into confetti and singled out nothing. All dots are neutral. A **closed** dot is hollow with a 1.5 px diagonal slash, so "closed" is an icon at every zoom, not only a shade (R0 #7). **There is no third dot state** (D-43 declined): a low-confidence pin (`pv.pin` 'low') draws like any other dot, because an outlined dot can't be told from the slashed closed dot at 7 px. Its honesty lives in words instead: the card, preview and detail say "Approximate pin" (the shared catalogue string), and the data lane's re-verify pass (CLAUDE.md 4b) upgrades or drops the pin. Canvas `tolerance: 19` gives every dot a 44 px hit circle (R0 #5). **No number and no area colours.** Area colour returns only when an area filter is active, and in the Key. | **Zero**: one shared canvas layer (`L.canvas()` circleMarkers) |
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
  - **Sight:** the place's own kind glyph (`data-gl`: lantern, castle, columns, leaf, tower, wave …). It is resolved in this order (R1 #4, "Cleveland sights share one glyph"):
    1. the **type noun in the place's own name** (it wins, because a name is specific and a collection is broad: R2 #6 found Kabuki-za drawn as a castle via its "Castles, palaces and history" collection);
    2. otherwise, the glyph of the place's first collection (`glyphs.json`);
    3. otherwise, `compass`.
    - The name table, English nouns: museum, gallery, library, hall, institute → `columns`; church, cathedral, chapel, basilica → `spire`, the kit glyph in `design/beta/style/v2/icons/icons.json` (a plain pointed tower and door, **no cross or other faith mark**). Synagogue, mosque, and a temple or shrine outside Japan get **no noun glyph**; they fall through to the place's own kind glyph. The spire is never stretched to stand for every faith, and the torii and lantern stay on Japan pages, per `glyphs.json`; park, garden, reservation, preserve, arboretum, conservatory, trail → `leaf`; beach, lake, river, falls, pier, harbor → `wave`; tower, lighthouse, observatory, bridge → `tower`; theatre or theater, playhouse, stadium, arena → `ticket`; market, shop, bookstore → `bag`; cemetery, memorial, monument → `flag`.
    - More English nouns (rev 5, R3 #4): brewing, brewery, distillery, winery, taproom → `bottle` (Great Lakes Brewing); arcade → `bag`; statue, sculpture → `frame`.
    - **Step 0, per-place overrides:** [`glyph-overrides.json`](glyph-overrides.json), for the few places whose name and collections say nothing about the kind (Free Stamp is public art → `frame`). It is designer-owned, and every entry carries its reason.
    - **Romanised Japanese suffixes** (Japan pages): -ji, -dera, -in → `lantern`; -jinja, -gū, -taisha → `torii`; -jō → `castle`; -za → `ticket` (so Kabuki-za is a theatre); -en, -teien → `leaf`; yokochō, -dōri, -gai → `bag`. A suffix matches only at the end of a word, so Asakusa doesn't match -sa.
    - Only the name is read, never the description. This picks a pictogram, not a category or cuisine tag, so the cuisine rule in CLAUDE.md is untouched.
    - Measured: Cleveland gets 8 distinct sight glyphs (75 of 148 sights matched), Pittsburgh 8 (57 of 111). **R2 found Cleveland still drawing the compass for every sight, so the name step isn't built yet.** It is a build-time field (`gl` per place) in the Atlas data, so the client does no regex work.
  - **Eat & drink:** the **fork-and-knife**, or the cup for cafés.
- **Short name on the map:**
  - Inter 600, **14 px** (raised from 13 for R0 #5: no text under 14 px except credits and the attribution), `--ink`, on one line, **never truncated**.
  - The map name is the place name up to the first ", ", " — " or " – ", with any parenthesis dropped. For example, "Nonbei Yokochō, Shibuya" becomes **Nonbei Yokochō**, and "Chess Collection — Cleveland Public Library…" becomes **Chess Collection**.
  - The full name appears in the tooltip, the preview, the card and the detail.
  - If a pill does not fit, it becomes a dot rather than truncating or overlapping (§1.3).
- **Must-see on the map** (rev 5): **no sun treatment on pills.** The featured set is drawn from the top of `mp`, and nearly every featured place is a must-see, so in R3's real shots every pill was sun-wash and the map read beige. **All pills use the surface treatment.** Must-see shows in the preview, the card sticker and Filters → Tier. The map's job is names and where.
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
3. Walk the list, placing a pill if its label box does not collide with an already placed pill (a greedy check, with a 4 px gap). **Try four anchors in turn** before giving up: above the point (the default, with the stem), right, left, then below (R1 #4: overlaps, and phones thinning to 1–2 names). A pill on a side anchor drops its stem and keeps a 4 px gap from the point.
4. Stop at N (16 / 8). A pill that collides at all four anchors, or runs off the map edge, is skipped and stays a dot. Labels are never truncated, and **no two placed pills overlap**. The collision test pads every box by 2 px on each side, so two pills are always **≥ 4 px apart** (R2 #6 found them touching). Test the pill's real rendered width, not an estimate.
5. **Records that are not a physical place** (`warn: 1` in the data, e.g. Cleveland's "@neorsd — not a place, but on the list") **never draw on the map**, neither as a pin nor as a dot. They stay in the list with their own note, so the source count is untouched (R1 #15).
6. Every place not placed becomes a dot.
7. Recompute on `moveend` and `zoomend`, debounced at 120 ms.

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
- **(R1)** Sight and eat & drink dots differ by shape. **(R3)** Before shipping, the designer signs off on `real/R*/tokyo-390-light-1-default.jpg`. On R3's shot the sign-off **failed**: about 40 % of the dots were sun-coloured, and the squares and circles were too alike. **No pin label box covers the location marker:** the location dot counts as a placed box in the collision walk. **Phone, two zoom steps in from the default: ≥ 4 named pins** on Tokyo, Cleveland and New York. **0 overlapping labels.** **Cleveland shows ≥ 3 distinct sight glyphs.** No `warn` record draws on the map.
- Every featured pin exposes `data-kind` and an aria-label with its kind; a closed pin's aria-label contains "Closed".
- Pan and zoom produce no more than 16 + 1 marker DOM nodes. Page DOM ≤ 3,000. Dots render on canvas in one neutral (two shades by kind).
- `#p=` opens the place selected and labelled at zoom ≥ 15, **clear of the panel** (§3.2).
- Closed places show dashed pills or slashed hollow dots, and " · Closed" on any visible label.
- Every place remains reachable through the list's "Show all" and through its dot, with or without tiles. Without the map library, the list is unchanged.

---

### 1.7 Atlas is the default view: the cold first screen (D-46)

The owner made Atlas the default city view (D-46): "make atlas the default view then the list". The R5 evaluator rewarded Gallery's art-led first screen. A cold Atlas load (no hash, no saved view) has to earn that back without giving up the map. The R4 real shots show the gap. At 390 the first screen is a grey map, eight text pills and one line of text: no photo, and nothing about the city beyond its name. At 1440 the list column has photos, but the page never introduces the city.

**Phone (390):**
- **Photos in the peek.** The 56 px peek's 44 px row leads with up to **3 thumbnails** (40 × 40, `--r-s`) of the top in-bounds places by `mp` that have an honest photo. Then comes the line, "351 places here · Show list". If fewer places have photos, show fewer; a glyph tile is never used as a fill-in here. The peek height doesn't change, so clear map stays at 75.4 %. Only these 3 images load eagerly (the §7 budget). The thumbnails are decoration (`alt=""`); the row's accessible name is the line.
- **The city intro opens the list.** The list sheet (from the peek) starts with the intro Gallery's masthead used to carry:
  - the city name in display type;
  - the page's one-line dek;
  - "N places picked by M sources".
  It scrolls away with the list.
- **The lead place.** The first card in the list sheet is the top place by `mp` with an honest photo, drawn full-width at 3:2. That holds on the cold, unfiltered load only; every other state uses the normal card.

**Desktop (1440):**
- **A compact intro tops the list column**, not the map: the city name (`--font-display`, `--fs-d2`), the dek (one line, clamped) and "N places picked by M sources". At most 88 px; it scrolls away with the list. The count line sits under it unchanged.
- **The lead card.** On the cold, unfiltered load, the first card spans both list columns at 3:2. It's the lead place, the top place by `mp` with an honest photo. Every other state uses the two-column grid.
- **No photos on the map itself.** Pills stay text plus glyph (§1.2).

**Without the map** (tiles blocked or no map library):
- **Phone:** falls back to the photo list. The R4 shot `tokyo-390-light-8-tiles-blocked.jpg` gets this right, and it is the most art-led Atlas state there is.
- **Desktop map art**, three fixes from that shot:
  - (a) it uses §1.1's neutral circle and square dots, **not area colours** (rev 5 removed them, and the fallback still draws a rainbow);
  - (b) places outside the fitted bounds are dropped, not stacked as rings on the left edge;
  - (c) one "Map unavailable" notice, not two (the duplicate is FE-1's pending QC-05 item).

**Acceptance (cold load, no hash and no saved view, on Tokyo, Cleveland and Chinatown):**
- At 390, at least one photo is visible on the first screen (the peek thumbnails), and clear map is still ≥ 75 %.
- At 1440, the city name, its dek and the lead place's photo sit above the fold of the list column.
- With tiles blocked, no area colour and no edge-stacked marker is drawn.

## 2. Slice 2: chrome and the list (after slice 1)

### 2.0 Overlay and chrome budgets, auto-compact and label rules (OV-00, owner directive 2026-10-16)

The owner's Punggol screenshot (`design/beta/eval/owner/2026-10-16-punggol-atlas-phone-dark.png`; ledger OV-01–07) shows a real phone (P2, 390×664 once the browser bars are taken) with three fixed bars, a mid-map "Search this area", a 60 %-wide label, two text pills named "Map" and "Near me", a half-width attribution, a cut chip row, and none of it moving when the map moves. Rev 5a's numbers were set at 390×844 with no browser bars, and only at rest. These rules replace §2.2's chrome numbers wherever they conflict, and DESIGN-SYSTEM §v2.12 holds the site-wide part.

**1. Budgets** (P1 390×844 · P2 390×664 · L 844×390 · T1 768×1024 · T2 1024×768 · D 1440×900):
- **Chrome share** is the top plus bottom chrome bars (header, view switch, chip row, peek or carousel) as a % of the viewport height.
- **Clear map** is the viewport area (phone and T1) or the map pane (T2 and D, the split layout) left after chrome, floating controls, attribution and any other overlay, but **not** labels, which have their own budget.

| Viewport | Chrome at rest | Chrome while panning | Clear map at rest | Clear map while panning | Labels: max count | Labels: max coverage |
|---|---|---|---|---|---|---|
| P1 390×844 | ≤ 25 % | ≤ 8 % | ≥ 72 % | ≥ 90 % | 8 | ≤ 8 % of the map |
| P2 390×664 | ≤ 32 % | ≤ 10 % | ≥ 64 % | ≥ 87 % | 7 | ≤ 8 % |
| L 844×390 | ≤ 13 % | ≤ 13 % | ≥ 80 % | ≥ 80 % | 10 | ≤ 8 % |
| T1 768×1024 | ≤ 18 % | ≤ 8 % | ≥ 78 % | ≥ 90 % | 12 | ≤ 7 % |
| T2 1024×768 | ≤ 15 % | ≤ 15 % | ≥ 90 % of the pane | ≥ 90 % | 16 | ≤ 6 % |
| D 1440×900 | ≤ 12 % | ≤ 12 % | ≥ 92 % of the pane | ≥ 92 % | 16 | ≤ 6 % |

B-01a (≥ 75 % at P1 at rest, chrome only) stays ratified. Rev 5a meets it at 75.4 %.

**2. Auto-compact while the reader explores** (phone portrait and T1):
- **Trigger:** the reader's own drag or pinch moves the map more than 8 px. A programmatic fit or fly does not count.
- **What hides:**
  - the view-switch row and the chip row slide up together under the header (`transform`, `--dur-2` 200 ms ease-out);
  - the peek slides down out of view;
  - the header stays (back, city, search, saved);
  - the control stack (§2.0.3) moves down with the peek, keeping its 12 px gap from the bottom edge;
  - the carousel, once a place is selected, does **not** hide: a selection is the reader's focus.
- **What brings them back:**
  - 1,200 ms after the last map movement ends (idle);
  - a tap on empty map;
  - keyboard focus entering a hidden bar;
  - opening a sheet or the search;
  - never mid-gesture.
- **Layout:** the map pane fills the whole viewport under the header, and the bars are overlays with their own backgrounds, so hiding or showing them never resizes the map or shifts its content (no Leaflet `invalidateSize` on compact).
- **Reduced motion:** the same states, swapped instantly with no slide.
- **At P1:** while panning, chrome is 52 px, so 6.2 %, and clear map is ≈ 92 %.
- **At P2:** chrome is 7.8 % and clear map ≈ 90 %. At rest P2 is 208 px of chrome (31.3 %), which is why it must compact.

**3. Floating map controls:**
- **Phone (P1, P2, T1):** **one stack**, bottom-right, 12 px from the edge and 12 px above the peek or carousel. **Icon-only 44×44** surface circles (`--shadow-sm`), 8 px apart, at most **two**:
  - **Locate** (⌖, `aria-label="Near me"`);
  - **Layers** (`aria-label="Map style and key"`), which opens a small popover with Map / Satellite as a radio pair and then the Key.
  The footprint is fixed at ≤ 44 × 96 px. Each icon shows a visible tooltip on press-and-hold and on focus. The base switch is **never a pill named "Map"**, which read as a fifth view next to Atlas. This supersedes R2 #2's text pills by owner direction; the tooltips and aria-labels keep them understandable. No + / − on phones.
- **Landscape (L):** the same stack on the right edge, vertically centred in the map.
- **Desktop (T2, D):** + / −, then Layers, top-left of the map. **"Near me" appears once per screen:** the list column's "Near me" (§3.4) is it, and the map has no second locate button.
- **Attribution:**
  - **Phone:** on the first map load, the one-line credit "© OpenStreetMap · Esri" at 11 px (≤ 20 px tall, bottom-left) is visible without interaction. On the reader's first pan, or after 5 s, it **collapses to an ⓘ** (24 px visual, 44 px hit), which opens the full credit with links. That follows the OSMF attribution guidance: visible without interaction at first, and findable after it collapses.
  - **Desktop:** the full one-line credit, bottom-right.

**4. Map labels** (featured pills, §1.2):
- **Size:**
  - Phone: 13 px / 600 text, 28 px tall, a 14 px glyph, 8 px side padding, with a transparent hit area grown to 44 px.
  - Desktop: 14 px / 600, 32 px tall.
- **Max width:** phone **40 % of the map width** (156 px at 390); desktop **220 px**. Longer names end in an ellipsis. The full name is in `aria-label` and `title`. The pill expands to the full name while it is focused, hovered or selected, and is drawn above the others then.
- **Count from the map area, not a fixed number:**
  - phone `floor(map area / 24,000 px²)`, clamped to 3–8, with 10 in landscape;
  - T1 `floor(area / 26,000)`, clamped to 12;
  - desktop `floor(area / 30,000)`, clamped to 16.
  - The area is the clear map at rest. So P2 gets 7 and a short map gets fewer.
- **Coverage:** the union of label pills is at most the table's % of the map. Where adding a label would breach it, the lowest `mp` label drops to a dot.
- **Collisions:** labels keep ≥ 4 px from each other (§1.6), and never touch a chrome bar, the control stack, the attribution or the "Search this area" slot.

**5. "Search this area"** (only when "Search as I move the map" is off, which is the phone default):
- **Never on the first screen.** It appears only after a reader pan or zoom changes the bounds by more than 25 %.
- **Fixed slot:** centred, 8 px under the lowest visible top bar. It's a compact 36 px pill with a 44 px hit area.
- **It leaves** on tap (after use), when the next map move starts, or when the bounds return. Labels avoid its slot.

**6. Chip row** (OV-06): a 24 px fade on each overflowing edge (`var(--mask)`), scroll-snap to chip starts, and no chip cut mid-word with no fade.

**7. Landscape (L, height < 500):**
- **One 48 px top bar:** back, city, the view switch (labels), search, saved. The chips collapse into one "Filters" button in that bar, so the sheet holds kind, Top picks and Area.
- **No peek.** "List" is a third icon in the control stack.
- **The carousel** becomes a 320 px side card on the right after a selection.
- Chrome is 12.3 % and doesn't compact; it is already one bar.

**Acceptance:**
- QC S-17 measures every row of the table on Punggol, Tokyo, Cleveland, Chinatown and New York, in light and dark: at load, during a scripted 200 px pan (sampled at 300 ms), and 1.5 s after it.
- Also checked:
  - the hidden bars return;
  - "Search this area" is absent at load and in its slot after a pan;
  - no label is wider than its cap;
  - label coverage is within budget;
  - the control stack is ≤ 44 × 96 on phones;
  - no control is named "Map";
  - "Near me" appears once.


### 2.1 Desktop: one bar, map ≤ 120 px from the top (AO-3)

- **The site header shrinks to 56 px:** wordmark, breadcrumb and the view switch (Gallery · **Atlas** · Guidebook · Insights) on the right.
  - **The switch lives inside the header** (R3 #5, High 8/8): it was rendered at y = −17 with a 98 px pill over the header and the bar. It is a 40 px segmented control, vertically centred in the 56 px header (top 8, bottom 48). It never overlaps the 52 px control bar or the filter tokens.
  - **Header links never wrap.** "How we choose" moves into the footer and the overflow menu below 1280 px, rather than wrapping.
  - **The breadcrumb fits or shortens whole segments.** At ≥ 1280 it reads "Japan › Tokyo" in full. Below that, only the city shows ("‹ Tokyo"), and segments are never clipped mid-word or overprinted.
- **One control bar, 52 px**, directly above the map and list, holding left to right:
  - the **search pill**: "Search Tokyo · place, dish, area";
  - kind chips: **All / Sights / Eat & drink**. They are segmented and carry no counts;
  - **Top picks** as a toggle chip (see §2.4);
  - **Saved ♥**;
  - **Filters** (area, source, sort and closed places go in the tray);
  - on the far right, **"Search as I move the map"** as a compact switch.
- Total chrome is 56 + 52 = **108 px** before the map.
- **Split:** the map takes 64 % and the list 36 % (with a minimum list width of 420 px). The map is on the left, so it is the first thing the eye lands on.
- **Acceptance (R0 #3, R1 #5):** the map's clear area starts at ≤ 120 px on all four pages (108 px here), and the map box is ≥ 55 % of the first screen (64 % × 792 / 900 = 56 % at 1440×900).
- **The document doesn't scroll in Atlas.** The map and list fill the viewport below the 108 px of chrome; only the list scrolls, inside its own column. The site footer is not part of the Atlas view: it sits at the end of the list column.
- **Map controls on desktop:** + / − (top-left of the map), Key (bottom-left), and one stacked locate / layers control (bottom-right). The attribution is one 11 px line at the bottom-right edge; the featured-pin layout treats its box as off-map, so it never covers a pin.

### 2.2 Phone: the map is the screen (AO-6, R0 #3, #9, #12)

- **Header** (52 px): back, the city name, and search and saved icons. **The header's search icon is the phone search** (as in DESIGN-SYSTEM §v2.11), and it is always visible because the header is sticky. **No breadcrumb on phones** (R1 #15, R2 #2: it collided). The city name truncates only if it alone exceeds the row, which no current city does.
- **The view switcher** (DESIGN-SYSTEM §v2.11, QC-09) is its own 52 px row under the header, as on every view.
- **One floating chip row** over the map, **48 px** (44 px chips plus a 4 px gap to the map): **All / Sights / Eat & drink / Top picks / Area / Filters**. It scrolls sideways if it must.
  - **No search chip in this row (rev 5a).** The header already carries search, and a second search icon here pushed the phone chrome to 15 controls above the first card (B-03 allows 14). Header 4 + switcher 4 + chips 6 = 14.
  - **Chips carry no counts.** R3 still showed "All 488 · Sights 263 · Eat & drink 225", which are three more count strings.
  - **Area is a chip on the 390 first screen** (R3 #1, `areaFound`). It opens the area list directly.
  - **Search stays visible** whichever chip is selected, because it lives in the sticky header.
  - **Top picks** is one toggle (§2.4). When it is on, the chip itself turns ink (`--ink` fill, `--paper` text). There is no second "×" pill and no badge echoing it.
  - **Filters** opens a sheet whose **first section is Area**, so a neighbourhood is two taps away (Filters → the area). Picking one closes the sheet and fits the map to that area (R0 #12). Source, sort, closed places and the Key follow.
- **Bottom: a 56 px list peek** (rev 5a; 8 px top, a 4 px handle, a 44 px tap row), not the carousel. It shows the drag handle and one line, "128 places here · Show list". Tapping or dragging it opens the full list sheet. This replaces the floating "List" pill.
- **The carousel appears only after a selection** (a pin, a dot or a search result) or after locate-me (§3.4). It replaces the peek; Escape, the back gesture or a tap on empty map brings the peek back.
- **Controls:** **two labelled pills**, "Near me" (locate glyph + text) and "Map" (layers glyph + text, which cycles Map ⇄ Satellite). They are 44 px tall, stacked at the bottom-right, 28 px above the peek or carousel, in thumb reach (R2 #2 asked for labelled controls). No + / − on phones, because pinch zooms. **The Key is never on the map on phones:** it is the last section of Filters. At 200 % zoom the pills drop their text and keep a visible tooltip and an aria-label; they never move above y = 55 %.
- **Attribution** (R1 #2: it wrapped to two lines and covered locate, so real taps landed on the attribution):
  - On phones it is **one line that cannot wrap**: "© OpenStreetMap · Esri" plus an **ⓘ button**, at 11 px in `--ink-2` on a 70 % surface strip, `white-space: nowrap`, at most 20 px tall, at the **bottom-left**, directly above the peek or carousel.
  - The ⓘ has a 44 × 44 hit area. It opens a small popover with the full credit ("Tiles © Esri — Esri, HERE, Garmin, © OpenStreetMap contributors", with links), so the licence text stays one tap away and nothing is hidden.
  - On desktop it is the full credit on one line at the bottom-right edge of the map. If the map is narrower than the credit, it falls back to the phone form.
  - **It never shares a corner with a control.** Locate and layers are bottom-*right*; the attribution is bottom-*left*. The featured-pin layout and the default fit both treat the strip as off-map, so it never covers a pin.
- **"Search this area"** (shown only when "Search as I move the map" is off; that switch lives in Filters on phones). **On phones the switch defaults to off** (rev 5a), because a live refresh would re-rank the carousel under the reader's thumb and change the peek count on every pan. The pill appears only after a pan or zoom, never on the first screen. It is a 40 px pill centred **under the chip row** (top 160 px: header 52 + switcher 52 + chips 48 + 8). It never sits at the bottom, where the attribution and controls are.
- **At 200 % zoom** (a 195 CSS px wide viewport) the header and switcher stay 52 px each, the chip row stays one 48 px line and scrolls sideways, and the peek stays 56 px. That is 208 of 422 px, so 50.7 % clear map. (With the old 52 px chips and 64 px peek it would have been 47.9 %, under the bar.)
- **Acceptance (R1 #2):** a real tap on locate hits locate (`locateCoveredBy` null). The attribution is one line ≤ 20 px. Clear map ≥ 75 % at 390 and ≥ 50 % at 200 %. No two overlays overlap. Every map control sits at y ≥ 55 % of the screen or carries a text label.
- **Clear map on the first screen (rev 5a):** 844 − 52 header − 52 switcher − 48 chip row − 56 peek = 636 px, **75.4 %** (R0 asked ≥ 75 %). Rev 4's 80 % left out the switcher row that QC-09 added later; with it and the old sizes, the first screen fell to 73.9 %. With the carousel open it is 70 %, which is a selected state, not the first screen.

### 2.3 The list beside the map (AO-4, AO-7)

- **It follows the bounds**, ranked by `mp`, and is **not grouped by area**. There are no "area 1 of 13" counters and no area-chip row; area lives in the Filters tray.
- **One count line:** "128 places here · Show all 488". With "Search as I move the map" off, it reads "128 places in view · Search this area". With a location it reads "31 places here · nearest first · Show all 225".
- **At most two count strings above the first card, and they never disagree** (R0 #8). The count line is the only one on desktop; on phones the peek repeats the same number. Removed: "N more outside", "area n of N", kind-chip counts and area-chip totals. Every visible number is one of three things: the in-bounds total, the filtered total or the all-places total.
- **Card hierarchy:**
  1. **Photo**: 4:3, with a 16 px radius. Without a photo, the calm cover.
  2. **Name**: Inter 600, 17 px.
  3. **Kind line**: [distance ·] area · kind, **16 px**, `--ink-2`. The distance, when located, is `--ink` 600 (§3.4).
  4. **Why**: one line of why it's here, **16 px**, `--ink-2`.
  5. **Sources**: "Recommended by GO Tokyo, Wikipedia +1", **16 px**. It is **never truncated** (R2 #14): it wraps to a second line, shows at most two names, and anything more becomes "+n more". "Recommended by" is the label every time; never "via", "from" or a bare list.
  6. **Credit**: a quiet 12 px `--ink-3` line under the photo. It is always visible, wraps to two lines if it must, and is never clipped (licence). Credits and the map attribution are the only text under 14 px (R0 #5).
- **No photo** (R0 #10, R2 #8):
  - **List cards:** the calm v2 cover at exactly the photo's 4:3 box (`--sand` ground, the place's kind glyph at 30 px in `--ink-3`, and the area name at 13 px `--ink-2` bottom-left). It is designed, not empty, and a no-photo card is the same height as its neighbours.
  - **The desktop preview and phone carousel cards have no media block at all** when there's no photo. The preview becomes a text card that leads with a 40 px `--sand` glyph chip beside the name. There are no empty 16:9 or 170 px frames anywhere.
- **On the photo:** only the heart (top-right) and the Must-see sticker (top-left).
- **No rank number on Atlas cards or carousel cards**, in any sort. R3 still showed "★ 1" badges, which read as a star rating, and kept them under "Nearest". The list order *is* the ranking. "No. 1" per area read as noise in a city-wide list, so ranks stay in the Guidebook and in the detail's single rank line (§3.6).
- **No "pin N" anywhere.** Pins carry no numbers, so the detail never says "pin 4". The Gallery and lens copy "Numbers on the cards match the pins on the map" in `cities/*.html` goes (FE-A).

### 2.4 One control for the best places: "Top picks" (R2 #3)

- **The problem:** Must-see is an editorial tier graded **within each area**, so it covers 177 of Tokyo's 488 places (36 %). As a one-tap filter it barely narrows the map. It also appeared three ways at once: a token, a chip and a badge.
- **The fix:** the bar's toggle becomes **Top picks**, the first N places by `mp` (§1.3): **30 on desktop, 12 on phones**, the same set as the default fit. Because `mp` round-robins across areas, Top picks covers the whole city and never collapses into downtown. The count line reads "Top 30 picks · Show all 488".
- **Must see stays as information:** the sun-wash pill treatment on the map, the sticker on cards, and a "Tier" section in Filters (Must see / Worth a look / Deep cut). There, the honest count reads "Must see · 177 across 13 areas". It is never a second bar control.
- **Copy:** drop "— numbered to match the map" everywhere (the lens intro in `tools/beta/client/city.js`, FE-A). Map markers carry no numbers outside day mode (§1.1, §10), so the sentence is false.
- **Acceptance:** exactly one best-places control is visible; with Top picks on, ≤ 30 pins and dots (desktop) or ≤ 12 (phone) and a count line that names it; the string "numbered to match the map" appears nowhere in Atlas.

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
- **One numbering in the detail** (R2 #11 counted four): the rank line above is the only number that ranks the place. Source citations keep their publishers' own list numbers, written as the source does ("News 5 #17"), inside the sources block only. There are no day-stop or map numbers in the detail.
- **Selecting a pin never scrolls the list to the footer** (R2 #13): the list scrolls only enough to bring the place's card into view (`scrollIntoView({block: 'nearest'})`), and only if it's off-screen.

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
  - **The ring is never clipped** (R2 #12, broken "brackets"). Inside any `overflow: hidden` or scroll container (cards, the carousel, the list column, chip rows), the ring is drawn inset (`outline-offset: -2px`) or the container gets 4 px of padding, so all four sides show. The designer's base layer ships the inset rule for `.card`, `.cc`, `.chips` and `.list`; lanes use those classes or copy the rule.
  - **Skip link** (R2 #9: the map sat about 190 stops in): the first Tab stop on the page is "Skip to map", and the second is "Skip to results".
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
| PANEL-R1 (63.8; head d8b26516) | Score context | R2 14.94 / 20 (from 7.50): the names-on-the-map finding is resolved. Down: R5 8.38 (from 9.44), from the phone overlay regression below. |
| PANEL-R1 #1 (6.0, 8/8) | The round-trip still loses the view | Not built yet; §3.2 already specifies it with R1's exact acceptance. FE engineer. |
| PANEL-R1 #2 (5.0, 8/8, regression) | The phone attribution wraps over locate; 59 % clear map; "Search this area" overlaps | §2.2: one-line attribution plus an ⓘ popover, opposite corner from the controls, "Search this area" under the chip row, the 200 % rule and acceptance. |
| PANEL-R1 #3 (3.8, 6/8) | Near me isn't near; the pill count ≠ the List count | §3.4 (not built yet). The pill and peek read the same in-bounds total as List mode (§2.3: one source of truth). |
| PANEL-R1 #4 (3.7) | Anonymous dot field; phone zoom thins names; Cleveland sights share one glyph; labels overlap | §1.1: dots differ by shape, quieter in dark mode, a sun tier hint. §1.2: glyph fallback from the name's type noun. §1.3: four-anchor placement, no overlaps. §1.6: R1 acceptance. |
| PANEL-R1 #5 (3.2) | Desktop chrome 208 px | §2.1 (slice 2, not built yet), plus "the document doesn't scroll". |
| PANEL-R1 #6, #7, #8 | Text and targets; closed on the map; counts | Already in revision 2 (§1.1, §1.2, §2.3, §5); not built yet. |
| PANEL-R1 #9–#14 | As in R0 | Unchanged answers: §3.3, §2.3, §5, §2.2, §3.5, §3.6. |
| PANEL-R1 #15 | "@neorsd — not a place" drawn as a pin; phone breadcrumb collisions | §1.3 step 5: `warn` records never draw. The breadcrumb is FE chrome; on phones §2.2's header shows only back + city, with no breadcrumb. |
| PANEL-R1 process note | Two `atlas-ms.js` checks pass while the panel measures a failure | For the FE engineer: the round-trip check must compare centre and zoom, and the credit check must include the locate control. The acceptances in §2.2 and §3.2 are the spec. |
| PANEL-R2 (70.9; head 40e15601) | Score context | R2 17.63 / 20 and R5 11.13 / 15 are up. Resolved since R1: the credit over locate, closed places unmarked on the map, pill vs List count, the @neorsd pin. |
| PANEL-R2 #1 (6.8, 8/8) | Round-trip and deep link; the deep-link pin under the panel on 8 of 8 is a regression | §3.2 is unchanged and still unbuilt. FE-2. |
| PANEL-R2 #2 (3.8) | Phone first screen: 64 % clear, one-card carousel, no area, Key under the chips at 200 %, icon-only controls, breadcrumb | §2.2: labelled "Near me" and "Map" pills, Key inside Filters, no breadcrumb on phones, the 200 % rule; §3.3 carousel; Area first in Filters. |
| PANEL-R2 #3 (3.3) | Counts; Must see as token, chip and badge; it narrows to only 36 %; the "numbered" copy | New §2.4: the "Top picks" control (top 30 / 12 by `mp`), Must see moves to a Filters tier section, drop the "numbered to match the map" copy (FE-A, city.js). |
| PANEL-R2 #4 (3.2, 6/8) | Near me | §3.4, unchanged and unbuilt. FE-2. |
| PANEL-R2 #5 (3.1) | Desktop chrome 208 px | §2.1, unchanged and unbuilt. FE-1. |
| PANEL-R2 #6 (2.5) | Dot sizes; touching pills; wrong glyphs (Kabuki-za castle, Cleveland compass) | §1.1: 8 px circle vs 8 px square. §1.3: boxes ≥ 4 px apart, measured. §1.2: the name noun wins over the collection, plus Japanese suffixes; built as a data field. |
| PANEL-R2 #7 (2.1) | Text and targets; credit links 58×15; Map credits button 20×20 | §2.2: the ⓘ has a 44 px hit area. §5: licence links padded to ≥ 24 px. The §2.3 sizes are unchanged. |
| PANEL-R2 #8 (1.8) | Empty preview covers, glyph-tile rows | §2.3: list covers designed with glyph + area; previews and carousel cards drop the media block when there's no photo. |
| PANEL-R2 #9, #12 | Skip link; broken focus-ring brackets | §5: "Skip to map" and "Skip to results" first; rings inset in overflow containers. |
| PANEL-R2 #10 | View not in the URL; the toast | §3.5, unchanged. FE-2. |
| PANEL-R2 #11, #13 | Four numbering systems in the detail; pin select scrolls the list to the footer | §3.6: one numbering; `scrollIntoView` nearest. |
| PANEL-R2 #14 | Recommender label unclear or truncated | §2.3: "Recommended by", never truncated, two names + "+n more". |
| PANEL-R3 (80.7; head 537cfb8c) | Score context | R1, R3 and R4 are up sharply. Resolved: round-trip view and focus, deep-link pin, near-me, the desktop map's position, skip links, shareable view. R6 fell (−1.4) because of the desktop header (#5). |
| PANEL-R3 #1 (4.5) | Phone first screen | §2.2: Area is a chip on the first screen, chips carry no counts, search stays visible. The labelled controls and the Key in Filters are unchanged, but R3 shots still show three icon-only controls including a map ⓘ. |
| PANEL-R3 #2 (2.9) | Counts and numbers contradict; Must see shown 4 ways; "pin N" copy; rank badges under Nearest | §2.2: no chip counts. §2.3: no rank badges in any sort, no "pin N", drop the "numbers match the pins" copy. §2.4: Top picks. §3.6: one rank number. |
| PANEL-R3 #3 (2.5) | Text and targets | §2.3 and §5, unchanged; still unbuilt in places (12 px text). |
| PANEL-R3 #4 (2.4) | Dot field confetti; glyph errors; location dot under a label | §1.1 rev 5: no sun on dots, light circle vs dark square, sign-off failed on R3. §1.2: no sun on pills; more nouns plus `glyph-overrides.json` (Free Stamp, The Arcade). §1.6: the location marker counts as a box. |
| PANEL-R3 #5 (1.9, High 8/8) | Desktop header off-screen; header link wraps; breadcrumb clipped | §2.1 rev 5: the switch sits inside the 56 px header, the link doesn't wrap, whole-segment breadcrumb. |
| PANEL-R3 #6 (1.8) | No-photo covers | §2.3 (rev 4) unchanged: designed list cover; previews and carousel have no media block. R3's preview still had an empty 170 px cover. |
| PANEL-R3 #7 (1.3, High 5/8), #8 | 108 px layout shift; stale counts | FE-2, §3.2 and §2.3 count rule. Process note: the FE probe must measure the map's top and ancestor scrollTop, not window scroll. |
| FE-1 rev 5 conflicts (2026-10-16) | The required switcher row puts the phone first screen at 73.9 % clear and 15 controls above the first card (B-03 ≤ 14); the spire glyph drew a cross and stood for every faith | §2.2 rev 5a: search only in the header, a 48 px chip row and a 56 px peek give 75.4 % clear (50.7 % at 200 %) and 14 controls. §1.2: the kit spire with no faith mark, for churches only; other houses of worship fall through to their kind glyph. |
| Owner directive OV-00 (2026-10-16, Punggol phone screenshot) | Fixed layers that don't move and take the space: three bars, a mid-map pill, wide labels, "Map" and "Near me" text pills, a wide attribution, a cut chip row | §2.0: budgets per viewport at rest and while panning, auto-compact, an icon-only control stack, collapsing attribution, label caps and coverage, the "Search this area" slot, chip-row fades, landscape. DESIGN-SYSTEM §v2.12 for every other view. Ledger: docs/BETA-OVERLAY-LEDGER.md. |
| Owner decision D-46 (2026-10-16) | Atlas becomes the default view, ahead of Gallery | §1.7: photos in the phone peek, a city intro and a lead card on the cold load, and no-map fixes. Order and labels are in DESIGN-SYSTEM §v2.11. |
| Owner direction (relayed by the panel, 2026-10-11) | Don't copy one product; combine the best of each, keep the map-search navigation, don't neglect the other features | §10: a combination table built from existing beta features, plus a non-regression rule for Gallery, Guidebook, Insights and the detail (§10.1). |
| PANEL-R0 AO-5 (rejected in part) | Must-sees stand out | Kept: the sun-wash pill stays the Must-see signal. |

## 10. Slice 4, "one-up": combine the best patterns, don't copy one product (owner direction, 2026-10-11)

> The owner said, in substance: don't make Atlas a literal copy of the real-estate map-search product. Take the best features from each kind of competitor and combine them so the result beats every one of them. Keep iterating on the map-search navigation, which is "super on point", and don't neglect the other features.

**The rule.** The map-search navigation is the frame: the list follows the map, labelled pills, hover in sync, preview → detail, the phone carousel. It stays and keeps improving through the panel rounds. Inside that frame, Atlas surfaces what the other product kinds do best, and **almost all of it already exists in the beta**. Slice 4 brings those features onto the map instead of inventing new ones:

| Pattern (product kind, described neutrally) | Already in the beta | What Atlas does with it | Acceptance |
|---|---|---|---|
| **Why and by whom** (travel-guide products: an editor's reason to go) | Each card has its "Recommended by" sources and a why line | The preview leads with the why line and the named sources (§3.1). Filters → **Source** narrows the map to one publisher's picks, and the count line names it: "23 places · picked by Time Out". No map-search product can show *who* recommends a place. | Choosing a source changes the pins and the count line, and the source chip names it. |
| **Your day on the map** (itinerary and trip-planner products) | `day.js`: a 4–6 stop "Your day" per area, numbered route, legs, a share link (`#day=`) and KML export | With an area filtered, the count line offers **"Plan a day here"**. It draws the day route in `--accent` (the only accent line on the map) with numbered stops. **Numbered markers are allowed only in day mode**, where order means something; this is the single exception to §1.6's "no numbers". Each leg shows its **walking time** (straight-line distance at 80 m/min, labelled as such), with the total in the count line. Stops can be **reordered** (drag, plus up and down buttons for keyboard users) or removed. Any open, pinned place's preview offers **"Add to your day"**. Leaving day mode restores the normal pins. | Day mode shows 4–6 numbered stops, the accent route, a walking time on every leg and a total. Reordering redraws the route and the times. Outside day mode the map has 0 numbers. `#day=` opens Atlas in day mode. |
| **Saved as a map layer, shared as a list** (saving and sharing products) | Saved places, `saved.html`, shareable list links (`listCodec`) | The **Saved ♥** chip filters the map to saved pins and fits them. The count line then reads "6 saved · Share list", which copies the existing list link **plus the current map view** (`&c=lat,lng,z`, §3.5). A shared list opens in Atlas showing only its places, at the sender's view. | Saved chip on: pins = saved places only, fitted. Share copies a `#list=…&c=…` link that reopens the same set within 1 px and 0.1 zoom of the sender's view. |
| **Directions handoff** (maps products) | The place sheet already links to directions (OSM, plus the two platform map apps) | The preview gets a third action, **Directions**, which opens the same links as the sheet. Closed places read "Where it was". | Every open place's preview offers Directions; closed ones say "Where it was". |
| **Nearby from here** (maps and local-discovery products) | The coordinates and the near-me distance logic (§3.4) | The preview and the detail add one line, **"Near here: A · B · C"**: the three closest open places within a 10-minute walk, each a link that selects it on the map. | The line lists ≤ 3 open places within 800 m, sorted by distance, and each opens its own preview. |
| **Curated lenses** (editorial city guides: themed lists) | Collections ("Anime, manga and pop culture", "Free to visit", "Iconic and must-see"…) | **One tap:** the top three lenses for the city sit as chips in the desktop bar's overflow and at the top of the phone Filters sheet, and every other collection is in Filters → **Collection**. A lens turns the map into that list, and the count line names it ("12 places · Free to visit", in sentence case per §v2.6). | One tap from the first screen (desktop) or two (phone) applies a lens. The collection's places are then the only pins, and the count line names the collection. |
| **Honest closures, dated** (our own sourcing rule, CLAUDE.md 4c) | Each place carries `pv.checked` (the date its status was verified) and `pv.ss` (the closure source) | The preview and the detail show "Open when last checked · 10 Aug 2026", or "Closed · checked 10 Aug 2026" with the source line. Closed places stay on the map, flagged (§1.1, §1.2), and never enter day mode. No map-search or listing product dates its own data. | Every preview shows the checked date when `pv.checked` exists; a closed place's preview shows the source line. |
| **Works without the map** (our own) | Every place is in the list with or without tiles or the map library | Unchanged (§5, §7). | Unchanged. |

**What we deliberately don't copy:** prices, availability calendars, review stars and booking flows. They don't fit a sourced guide, and ratings are never the recommender (CLAUDE.md).

### 10.1 Don't regress the other views

- Atlas work stays in the Atlas lane's files (`atlas.js`, `atlas.css` and the Atlas templates). Changes to **shared** pieces (the card component, the place sheet or detail, `day.js`, `saved.js`, tokens) go through their owners: FE-A for the card, the sheet and day; the designer for tokens and base styles. Such a change also needs a before/after check of **Gallery, Guidebook, Insights and the place detail** at 390 and 1440, in light and dark.
- The panel's evidence pack adds those four views as regression shots from round 1 on. Any visible change there must be intended and named in the round's notes.
- The detail round-trip (§3.2) changes how Atlas *hosts* the detail, not the detail's own layout.
