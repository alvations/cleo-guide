# W8 · FE-A — "Start with", day plans, place detail, Gallery polish, R7 gaps (evidence)

Brief: `design/beta/eval/W8-BRIEFS.md`. Part 1 is "Lane FE-A"; part 2 is "FE-A: R7 gap 2, gap 3, gap 5". The owner's
casing request is in the same file. R7 QA rows routed to FE-A are in `docs/BETA-QA.md`. Log: `docs/BETA-LOG.md` (W8 FE-A).

- `before/` — the head at the start of W8 (`b2bc746a` line), light and dark, at 390×844 and 1440×900. The grid
  shots are at 1024, 1280 and 1440.
- `after/` — this lane's head, same sets, plus `day-gallery`, `day-shared`, `food-grid` and `food-rows`.
- Re-shoot: `cd tools && NODE_PATH=$(npm root -g) node beta/w8-shots.js --out design/beta/eval/w8/fe-a/after`.
  Files come from disk and map tiles are stubbed with a flat colour, so Atlas shots show pins on a plain ground.
  Shots taken mid-scroll can show a blank band above the sticky top bar; that is the smooth scroll in flight, not the
  page.
- `probe.txt` — `npm run beta:probe:fe-a:w8`, which runs in real Chromium and exits 1 on any FAIL.

## What changed, and why

| # | Change | Why (the gap) | Proof |
|---|---|---|---|
| 1 | "Start with" takes the lead from `lib/gallery.js` `rowsOf().lead`, the record the lead card draws | Two near-identical pickers had drifted apart on 17 of the 21 US/EU pages (R6 gap #8) | `test-fe-a`: link id and name equal `data/gallery/<page>.json` lead on all 84 pages |
| 2 | "Your list" → **Plan a day from these**; the day lens offers **Use my N saved places** | No path from saved places to a day (R6 D 77) | probe: saved → plan, 390 and 1440 |
| 3 | **Print** beside Share; print CSS keeps the summary and stops and drops the buttons | "print or save" step | probe: Enter → `print()`; print media check |
| 4 | The day summary (area · stops · km) is a map control: top-left on desktop, above the list pill on phones | The summary sat below the Atlas tray's peek | probe: the chip is in view and uncovered at 390 and 1440 |
| 5 | Jumping to the day lands the heading clear of the sticky bars and focuses it; a shared link says "A day shared with you" | The heading landed under the city bar; the copy said "Your version" for someone else's day | probe: in view and focused |
| 6 | Every day control is reached with Tab: plan, share, print, KML, edit, move, remove | Keyboard path | probe: Tab walks from the heading |
| 7 | "No. k of n in {area}" ranks over the whole view order; n is the area's full count | "No. 42 of 25", "No. 2 of 1", "3 of 24" (R7 2f, QA-50) | `test-fe-a`: k ≤ n and n = the full count on all 8,458 places |
| 8 | A closed place opens on a **Closed** banner (date and source); its map button is a ghost "Where it was" | A closed place offered Directions as its primary action (closure honesty) | `test-fe-a` and the probe |
| 9 | "Recommended by X and n more" sits under the name; the full list follows "Why it's here" | Sources sat 1.5 screens down on phones (D12/D13) | probe and `test-fe-a` |
| 10 | Outside Atlas the desktop sheet is a centred dialog over a full-viewport scrim | No scrim, off-centre, close button over the switcher (R7 2d); main's `> *` max-width had boxed the overlay to 1,280 px | probe: centred, full scrim |
| 11 | The detail photo asks for its slot's width and never shows wider than its file | The 500 w file was stretched to 1,024 px (QA-51) | probe: 960 w at 960 px |
| 12 | Detail fact buttons wrap; a source link's icon rides with its last word | A nowrap "Add to your day in West Side, Ohio City & Tremont" button widened the column off the sheet (QA-59b); a lone chevron wrapped (QA-59d) | probe: nothing past the edge, no lone icon |
| 13 | Phone hero strip 4:1; balanced dek and stat line; facts and write-ups at 16 px | B-02 513 > 506 (QA-47); Tokyo bar at 859 > 844 (QA-48); widows (R7 2g); prose under 16 px (QA-55) | metrics.js: 482 and 829; probe: no single-word last line |
| 14 | Category-bar labels wrap to two balanced lines | Ellipsised labels (QA-59c) | shots |
| 15 | `lib/casing.js` `sentence()` is applied to every city-page label; `test-casing.js` runs in `npm test` | Owner: "superfluous capitals" | JS equals the designer's `sentence_case.py` on all 368 labels; 4,919 labels on 84 pages; no uppercase or styled first letters |
| 16 | Opaque top bar; the placeholder falls back from "Search {city}" to "Search" to none | Content ghosted through the 96 % bar; "Search Clevelanc" (R7 2b/c) | probe: alpha 1, the placeholder fits |
| 17 | Food covers: the dish in display type on an eat-and-drink tint, under the glyph | Blank sand boxes read as "not loaded" (K1, Luxury) | `food-grid-*` and `food-rows-*`, for the designer's review |
| 18 | The map pill steps aside while scrolling down and returns only where no title is under it | B-08: the pill over card titles | metrics.js: 0 pill hits (`.cbar` exempt, ratified) |
| 19 | The desktop hero photo takes the text column's height (≥ 300 px) | A blank band under the facts beside a fixed 4:3 photo | shots |
| 20 | An area's end actions fill the rest of its last card row | A lone card on the last row at 1024 / 1280 / 1440 | checked on every Tokyo and Cleveland area |
| 21 | The sticky category bar drops v2's edge mask | Cards ghosted through its right edge at 1024 | `gallery-bar-scrolled-*` |
| 22 | Photos fade in (≤ 280 ms) from their dominant colour; the switcher's selection slides and the content cross-fades | Two more delight moments (R7 gap 3) | probe: durations, reduced motion = none, no-JS = never hidden |

Not FE-A's (reported to the orchestrator):
- the Atlas carousel credit (fixed by the Atlas lane, f5efbc66);
- the landing tab bar at 97 % (FE-B);
- QA-59a, the Atlas card clamp (Atlas);
- QA-59e, the hub copy (FE-B).
