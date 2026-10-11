# W8 platform: R7 gap 7 (photo weight and dead CSS) + shared-shell axe moderates

Measured on 2026-10-11. **Before** = the branch head before this lane's change; **after** = this commit. Probe: `npm run beta:qa:w8p` (`tools/beta/qa/w8-platform.js`). Its conditions:
- phone 390×844 @3×, touch;
- off-origin requests blocked, with map tiles answered by a 1×1 PNG so the phone Atlas shows its carousel;
- first load = the default view, no scroll, network idle + 2 s, each URL once; gzip for text, images and fonts as sent.

## Results

| Acceptance (ROUND-7 § Top gaps, row 7) | Before | After | |
|---|---:|---:|:-:|
| Phone @3× never fetches 960w for a slot < 200 CSS px (13 page/views, scrolled, Atlas carousel walked) | 5 × 104 px Atlas carousel thumbs on 960w | **0** | ✅ |
| Tokyo phone @3× first load ≤ 700 KB, Gallery | 930 KB | **590 KB** | ✅ |
| Tokyo phone @3× first load ≤ 700 KB, Atlas | 1,021 KB | **549 KB** | ✅ |
| `cleo.css` ≤ 200 KB raw | 255,666 B | **193 KB** (≈ 193,200 B) | ✅ |
| axe `aria-allowed-role` (60 runs) | 44 runs | **0** | ✅ |
| axe `heading-order` (60 runs) | 16 runs | **0** | ✅ |
| Pilots in light and dark at 390 and 1440, pixel diff vs before | — | **0 px on all 28 shots** | ✅ |

The probe was verified to fail on the old code: with the `sizes` fixes reverted it reports the five 104 px thumbs at 960w and first loads of 904 KB and 864 KB.

**Pixel diff scope.** The 28 shots cover the landing, Cleveland, Tokyo (Gallery and Atlas), New York, Chinatown and Wheeling. Each is full-page except Atlas, with lazy images forced to load. Before/after differ only by this lane's CSS edits, both on the same head. See `pixel-diff-pilots.txt`.

## What changed

1. **`sizes` per slot: a density cap for 3× phones (proposed D-40).**
   - The site ships two widths, 500w and 960w, so a 3× phone picks 960w for any slot wider than 166 CSS px. Card and rail thumbnails now start with `(min-resolution: 2.5dppx) and (max-width: 1023px) 166px`, so a ≥ 2.5 dppx phone takes 500w for them (about 1.4–1.7 image px per CSS px).
   - Unchanged: 2× phones, tablets, desktop, the hero and the Guidebook figures.
   - Where it's set:
     - imagery `CARD_SIZES`;
     - the gallery.js rail;
     - atlas.js's phone-list override, `'240px'` → `'166px'` (240 × 3 had still selected 960w, and re-fetched over the 500w).
   - Crops at 3× device pixels, 960w on the left and 500w on the right: `density-cap-card-960w-vs-500w.jpg` and `density-cap-rail-960w-vs-500w.jpg`. **For the designer to review.**
2. **Dead CSS:** a new conservative coverage tool, `tools/beta/css-dead.py`.
   - A selector is dead only when a class or id in its top-level compounds appears nowhere in:
     - the built pages;
     - any JS under tools/beta (client, templates, tests, qa, shots);
     - tools/*.js, the evaluator probes and Leaflet.
   - Dynamic prefixes count as live, and the contents of `:not()`/`:is()`/`:where()`/`:has()` never kill a selector.
   - Removed 20.0 KB from the designer's sources (237 selectors): mostly the R6 `.view-atlas`, `.coll`, `.dests`, `.mapart`, `.ghero`, `.tg-pin`, `.sitefoot`, `.mod`, `.pinart` and `.areanav` layers. Re-running the tool reports 0 KB (`css-dead-after.txt`).
3. **`build-css.py`:** the shipped `cleo.css` has no comments (the header stays), no indentation and no whitespace around `{ } ;`. The sources keep every comment.
4. **Axe moderates in the shared shell:**
   - The view switcher `<nav>` drops `role="group"`, which a nav may not take; four CSS selectors moved from `[role=group]` to `[aria-label]`.
   - The footer column heads go from h4 to h3, with `.footer h3` styled exactly like the old h4.
5. **Tests:**
   - test-beta has a `cleo.css ≤ 200 KB raw` budget.
   - `beta:qa:w8p` covers the per-slot and first-load acceptances.

Coordinated before editing: imagery (`CARD_SIZES`), FE-A (gallery.js, city.js, fe-a.css), the Atlas lane (atlas.js, the `.view-atlas` removal), the designer (CSS sources, build-css.py) and FE-B (shared CSS; letter-spacing and shadows are theirs).

## Not done yet

- R7 item 5, re-pointing B-06/07/09 to the map-search DOM in metrics.js, waits for R7 QA to ratify it.
- On a 2× phone the Atlas carousel's 104 px thumbs can still start a 960w fetch before atlas.js sets their `sizes`. The Atlas lane has the suggested fix: set them before first layout.
