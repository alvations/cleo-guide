# W7 platform lane: accessibility and performance (R6 gaps #4 and #5)

Measured on 2026-10-11 against the beta tree on `claude/peaceful-goodall-i0hsrt`:
- **Before** = `f768d99`, with the designer's v2 already merged.
- **After** = this lane's commit.

Probes used:
- `design/beta/eval/r6/tools/probe-axe.js` (axe-core 4.10.2, vendored);
- `tools/beta/metrics.js`;
- a node counter that reads `document.getElementsByTagName('*').length` at `load`, on a 390×844 touch phone with every off-origin request blocked.

## Results

| Acceptance (ROUND-6 §Top gaps) | Before | After | |
|---|---:|---:|:-:|
| **#4** axe serious/critical: 15 pages × {390, 1440} × {light, dark}, 60 runs | 72 nodes in 12 runs (56 `nested-interactive` on Insights, 16 `color-contrast` on "Your guide"/"Your day") | **0 nodes in 0 runs** | ✅ |
| **#4** `beta:metrics` B-23 (AA, light and night) on the 84 "What changed" pages | 0 failing pages (the 66 in R6 were fixed by the designer's v2) | **0 / 84** | ✅ |
| **#4** `beta:metrics` B-20 (targets ≥ 44 px) on the 84 "What changed" pages | 18 failing pages (masthead city link 24–43 px wide) | **0 / 84** | ✅ |
| **#5** `metrics.js --view atlas --only cities/tokyo` bytes | 2,006 KB | **1,911 KB** | ✅ |
| **#5** `#p=` deep link on a phone, DOM nodes at load (Tokyo `#p=kanda-myojin`) | 12,459 | **2,228** | ✅ |
| **#5** the same for a place deep in the list (Tokyo `#p=sushi-yuki`, page 10) | 12,775 | **2,423** at load (2,739 after 1.5 s) | ✅ |
| **#5** eager JS for any one page, gzip, unrounded | 40.45 KB | **28.62 KB** | ✅ |

The axe JSON for both runs is in `axe-before.json` and `axe-after.json`. The deep-link node counts on six pages are in `deeplink-nodes-after.txt`.

## What changed

1. **Minify step in the beta build** (`tools/beta/build.js`).
   - `assets/js/*` is emitted through terser, pinned at `5.36.0` in `tools/package.json`.
   - Settings: `minify_sync`, `compress.passes` 2, `mangle` on (top-level names kept, because the files share globals as classic scripts), `quote_style` 3, no comments.
   - No source maps are written or referenced.
   - The output is deterministic, so `beta:check` still proves the tree is reproducible.
   - A missing terser is a build error, not a silent fallback.
2. **Gates made stricter, not weaker.**
   - `test-beta.js` holds eager JS to the exact gzip bytes (`≤ 40.0`, no `Math.round`).
   - `qa/test-contract.js` runs the localStorage-inside-try check on the authored source (`tools/beta/client`) as well as the shipped files. The shipped files are now one line, so a 6-line window there would see the whole file.
   - New `test-beta.js` checks:
     - a Gallery deep link lands on its page and stamps only that page;
     - the Atlas deep link stamps only its card (the old bound was its 40-card chunk).
3. **Deep links stamp only what they show** (core.js is platform-owned; views.js changes were agreed with FE-A first).
   - `Cleo.defer.order()` gives the full view order (stamped cards plus deferred stubs) without stamping anything.
   - `Cleo.defer.stampIds(set)` stamps exact cards, splitting their chunks.
   - The Gallery pager places a `#p=` / `#p-` link or `pg=N` by that order and stamps just that page. Lenses, `all=1` and print still stamp everything.
   - Core's place link stamps one card, not its chunk.
   - The lazy observer holds while the paged Gallery shows (`Cleo.defer.hold`) and resumes on leaving it.
   - The first live chunk went from 32 to 24 cards (one phone page).
   - Every place stays reachable: G1/P-04 reachability, `test-views.js` and `qa/w5.js` all pass.
4. **Bytes.**
   - The map fallback reuses the page's own schematic `<img>`, so `map.svg` is no longer fetched twice when tiles fail.
   - The retired night-hero art (`display:none` in every view) is `loading="lazy"`, so it is no longer fetched (53 KB on Tokyo).
5. **Accessibility.**
   - The Insights chart `<svg>` is `role="group"` with its `aria-labelledby` (FE-A notified). The bars stay links.
   - `.rail-i .k` lost an `opacity:.85` that took `--ink-3` from 6.0:1 to about 4.2:1.
   - The "What changed" masthead city link is now a ≥ 44 × 44 target (fe-b.css; FE-B notified).

## Browser gates (before → after, same machine)

- **`qa/views.js`:** 318 PASS, 2 FAIL → 318 PASS, 2 FAIL. The same two fail on clean HEAD and are unrelated to this lane:
  - Cleveland Atlas `a=DT` with a stored Insights preference gives a `_leaflet_pos` page error;
  - a Cleveland Guidebook honesty string.
- **`qa/w5.js`:** 64/64 PASS.
- **`qa/w2.js`:** 181/188 → 186/188.
  - Fixed here: five `color-contrast` (`.fy > .k`) results, plus how-we-choose `.tablewrap`, which is now a focusable, labelled region. That fix landed after the w2 rerun.
  - Still failing: `[map] probe crashed`, a click timeout on `.map-toggle`. It fails the same way on clean HEAD.

## After merging the Atlas map-search and imagery commits (`cb326ffc`)

This lane's own numbers still hold on the merged tree:
- eager JS **27.38 KB** gzip;
- phone `#p=` deep links 1,932 / 2,759 / 2,053 nodes (Tokyo kanda-myojin / sushi-yuki / amazake), and 2,285 on Cleveland;
- every unit gate green.

Two regressions arrived with the merge. Both are reported to the orchestrator, and neither is in this lane's files:

| Measure | This lane (eb47e76) | Merged (cb326ffc) | Cause |
|---|---:|---:|---|
| `metrics.js --view atlas --only cities/tokyo` | 1,911 KB · 1,650 nodes | **4,352 KB · 12,670 nodes** | `atlas.js` `msArea()` calls `Cleo.defer.stampFor()` for every deferred place inside the map box. At the first fit the box is the whole city, so all 488 cards are built, and their photos then load. |
| `metrics.js --only cities/tokyo` (Gallery) | — | **4,283 KB** · 2,980 nodes | 34 Tokyo card photos at about 60–100 KB (500w) and 70–340 KB (960w). They are lazy and sized, but the harness's reachability scroll loads them all. |

Suggested fixes:
- **Atlas:** cap the stamped area results. Build the first page of in-area cards with `Cleo.defer.stampIds()`, which stamps exact cards rather than chunks, and stamp more as the list scrolls.
- **Imagery:** re-encode the thumbnails, aiming for ≤ 40 KB at 500w.
- **Orchestrator:** decide whether the harness's whole-session byte count, scroll included, is the right budget for a page with photos.

## Open, not this lane's

- B-04 in desktop Atlas: R6 gap #7 (FE-A).
- The sheet's "n of N in this Gallery view" counts stamped cards, not the view. It was already wrong before this change ("k of 72" for a far link); it now reads "25 of 25". FE-A has the pointer to `Cleo.defer.order()`.
- Atlas Tokyo has 89 KB of headroom. The biggest remaining items are the page HTML (743 KB raw, the cards with JS off) and `cleo.css` (248 KB raw, ~30 KB of it comments; it is generated by the designer's `build-css.py`).
