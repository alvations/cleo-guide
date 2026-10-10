# View styles — build plan for Wave 3

> 2026-10-10 · view-styles design lane · input to the PM's `docs/BETA-BACKLOG.md` (PM owns that file).
> Spec: [`SPEC.md`](SPEC.md) · Study: [`STUDY.md`](STUDY.md) · Mockups: [`mockups/`](mockups/index.html).
> Ownership follows [RFC §9.1](../RFC-architecture.md#91-ownership-each-file-has-exactly-one-writing-lane-shared-files-change-in-small-coordinated-commits);
> new files are assigned below. Every item keeps the program rules: every place in every view, count asserts unchanged,
> attribution and closures visible, no fabrication, no CDN, `Cleo.store` only, OSM / Esri tiles only,
> no third-party brand names.

## 0. Lane split (proposal)

The four views live on **one city page** (one URL per city, `#view=`). The city page is FE-A's, but four views are
too much for one lane in one wave. The split:

| Lane | Owns in Wave 3 | Why |
|---|---|---|
| **Platform** | The view-agnostic model: `rank`, the kind triad, lens predicates, the `insights` block, template chunks per view, the reachability gate | One model and one set of indexes, so the views cannot drift apart. `test-beta.js` is already platform-owned. |
| **FE-A** | The switcher + route + preference, **Atlas** (today's page re-laid out), **Gallery** (cards, rails, pager, experience page), and shared sheet changes | These views reuse FE-A's cards, sheet, tray and map. |
| **FE-B** | **Guidebook** and **Insights**, as view modules plugged into the city page through a registry hook FE-A exposes. Also the print stylesheet hooks and the sources appendix. | These are editorial and data-viz surfaces close to FE-B's method and hub work. Separate files keep ownership single. |
| **Designer** | View CSS (`beta/assets/views.css`, new), chart tokens and contrast, cover art rules, print styles, a visual review per view | `beta/assets/*.css` is designer-owned |
| **QA** | Harness and metrics per view, the no-CDN and storage-blocked runs per view, the visual diffs | `tools/beta/metrics.js`, `tools/beta/qa/**` |

**New files and owners** (to add to RFC §9.1 through the platform lane):

| Path | Lane |
|---|---|
| `tools/beta/lib/views.js` (rank, triad, lens predicates, insights numbers; build time) | Platform |
| `tools/beta/client/core.js` → `Cleo.lens`, `Cleo.order`, `Cleo.view` (small additions) | Platform |
| `tools/beta/client/views.js` (switcher, registry, pager), `tools/beta/client/gallery.js`, `tools/beta/lib/render/gallery.js` | FE-A |
| `tools/beta/client/guidebook.js`, `tools/beta/client/insights.js`, `tools/beta/lib/render/{guidebook,insights}.js` | FE-B |
| `beta/assets/views.css` | Designer |
| `tools/beta/qa/views.js` | QA |

**Order.** P-01–P-03 land first (data and helpers). A-01 (the switcher and registry) lands next, because every view
plugs into it. Then A-02/A-03 and B-01/B-02 run in parallel. The designer reviews each view as it lands. QA's Q-01 must
be green before the PM accepts any view.

## 1. Platform (view-agnostic model and indexes)

| ID | Item | Acceptance criteria |
|---|---|---|
| **P-01** | **Rank and kind in the model.** `rank` and `of` per place (open first, tier, then named sources desc, then live order; closed last). `kind3` = sight / food / pop (pop = in a `guide.popCulture.c` collection). Written to `data/places/<page>.json` and to `li.pl` as `data-rank`, `data-k3`. | Deterministic (`beta:check` byte-identical). Every area's ranks are a permutation of 1…n. Rank 1 is never a closed place when the area has an open one. Count asserts unchanged on all 95 pages. Documented in RFC §12 (or a new §13). |
| **P-02** | **`Cleo.lens` and `Cleo.order`** in `core.js`. One predicate over `a, mode, t, c, cz, src, closed, q` reading `li.pl` data attributes, and the view order (area order, then rank). The **count line** helper returns "All N places" or "n of all N places". | Unit tests in `test-beta.js` (jsdom): every key alone and combined; `t=` excludes closed places; `q` is accent-folded; "Show all" restores exactly N. FE lanes use it (no second predicate anywhere: grep gate). |
| **P-03** | **`insights` block** in `data/places/<page>.json`, computed at build time: tiles, kind triad per area, the top-5 + other source citations per area, places per area, median straight-line spread per area (open, verified pins), closed per area, status checks by month, canon dish counts, tier ladder per area. Every series carries its denominator and a "not counted" note. | Every chart's segments sum to its stated denominator (test). The source-citation total equals the sum of `src.length`. A city with no pop-culture data emits `pop: null`, not 0 (FE shows "absent"). Numbers match the mockup generator's output for Tokyo and Cleveland. |
| **P-04** | **Per-view reachability gate.** jsdom (and `beta:metrics` in Chromium) loads each pilot city in all four views and asserts that every `<page>/<id>` is reachable: by scroll after the templates are stamped, via the pager's show-all (Gallery), via `#p=`, via `q=` (by name), and in the print DOM. | FAILs if any record is missing in any view. Runs in `npm test`. Pilots: Tokyo, Cleveland, NYC, Chinatown SG, Wheeling, Okinawa (`low` pins). |
| **P-05** | **Template chunks per view** (extends RFC §5.3): rails, chapter intros and chart SVGs are not server-rendered into the initial DOM; the client stamps them from `<template>` or JSON. One canonical card set. | Tokyo and NYC initial DOM ≤ 3,000 nodes in **every** view (M3-06). With no JS, the canonical list shows every place. |
| **P-06** | **Route key registry.** Add `view`, `a`, `t`, `closed`, `pg`, `all` to the documented route table (RFC §4.2) and to `Cleo.route` validation: unknown values are dropped with `replaceState`. | Tests: `#view=bogus` → default with no error; `#view=atlas&p=x` opens the sheet over Atlas; `#list=` and `#day=` are unchanged (codec tests still pass). |

## 2. FE-A — switcher, Atlas and Gallery

| ID | Item | Acceptance criteria |
|---|---|---|
| **A-01** | **View switcher + registry** (`client/views.js`). A `nav[data-cleo-views]` of 4 `button[aria-pressed]`, placed per SPEC §2.4. Precedence: hash, then `Cleo.store.get('view')`, then the default (Gallery). Remember the view on each switch. Share always writes `view=`. An inline head script sets `html[data-view]` before paint. `Cleo.views.register(name, {mount, unmount})` for FE-B. | Switching keeps lenses, the saved state, scroll per view and the open sheet. One history entry per switch; Back restores the previous view. Storage blocked → works for the session with no error (QA storage-blocked run). No layout shift on load (CLS < 0.05). 44 px targets. Live region announces "{View} view, N places". |
| **A-02** | **Atlas** = today's city page re-laid out (SPEC §3.2): the desktop split at 46 / 54; the mobile tray with peek / half / full detents (button + swipe; Esc and Back go down one detent); rank badges matching numbered pins; area chips; quick lens chips; the "n without a verified pin" badge; area-head-in-view fits the map; pin ↔ row sync. | Map ≥ 40 % of the desktop width. Pin number == row rank in the focused area, at every zoom. Every row carries Recommended by and the closed flag. Peek ≤ 40 % of the viewport. Every existing FE-A behaviour still passes (sheet, tray, day, near me, `#map=1` mapped to a detent). |
| **A-03** | **Gallery** (SPEC §3.1): the night-sky hero (desktop lead card; none on a phone), the category rows (signature, Must see, canon, up to 3 collections, Recently closed) with "See all n" lenses, the paged grid (24 / 48, page numbers, the "all N" line, show-all, `pg=`/`all=` in the hash), and cards with data-drawn covers (area art + ringed pin + plate + glyph). | The grid holds all N. The pager is visible whenever pages > 1. "Show all N" puts every match on one page. Search and lenses span all pages (a test finds a page-9 record by name). Rails come from templates (no duplicate server nodes). Vertical plates never clip (≤ 4 glyphs; test at 390). Closed cards have hatched covers and no tier. A credited photo replaces the cover art only via the imagery lane's hook. |
| **A-04** | **Experience page** = the sheet's Gallery layout (SPEC §3.1 Detail): nav row with "n of N in this view" + previous / next in view order; art mosaic; Why it's here / Look for / Recommended by (credentials with in-links) / Part of / Close by; Plan your visit (address, 3 directions links, one honest primary deep link, Save · Add to day · Share, the "hours and prices" line, status, pin and rank facts); a mobile bottom bar. | No price, booking, availability or rating anywhere (grep gate on the rendered sheet). The primary link is "Visit the official site" **only** when a source is the official site; otherwise "Read what {source} says". All outbound hrefs are absolute https (R-18). Previous / next walk the lensed set in view order and wrap at the ends. Focus is trapped; Esc and Back close it. |
| **A-05** | **Sheet additions in every view:** "n of N in this view", previous / next, "No. r of n in {area}". | Same order as the visible list in Atlas, Gallery and Guidebook. Tested with a lens on (n counts the lensed set). |

## 3. FE-B — Guidebook and Insights

| ID | Item | Acceptance criteria |
|---|---|---|
| **B-01** | **Guidebook** (SPEC §3.3): cover, contents (mobile chip bar / desktop sticky column), one chapter per area with intro prose from the fixed data template, sections Top picks / See / Eat / Pop culture / Kept for the record, entries with rank, tier, address, `w`, `k`, Recommended by, and the sidebar facts box with the area art. | Every place appears **exactly once** (test: entries == N per page). The intro template contains no word that is not template text, a computed number or a record / source name (test: strip the known template words, and the rest must be names from the data). No section renders empty. Closed entries carry no tier. |
| **B-02** | **Insights** (SPEC §3.4), drawn from P-03: stat tiles; 7 chart cards as inline SVG with captions, legends, value labels, `<title>` tooltips, "Show as a table" and footnotes; narrow and wide renders; every bar a link that applies the lens (Gallery or Atlas, per SPEC); the "All N places" index at the end. | No chart library, no CDN (the no-CDN jsdom test covers the Insights view). Every chart's numbers equal `insights` in the JSON (test). The index lists N names, each opening its entry. Chart text ≥ 12 px at 390 px. Keyboard: every bar link is focusable with a visible ring. |
| **B-03** | **Print**: chapter-per-page, two-column entries, chips as text, chrome hidden; the **sources appendix** (every source of the page with URL and record count) and the method notes verbatim; "Print this guide" stamps every template first. | Print preview (Playwright `emulateMedia('print')`) contains all N entries and every source URL. There is no blank page between chapters. Works with JS off (canonical list prints). |
| **B-04** | **Hub entry points**: a hub city tile can open a city in a named view (for example, "Read as a guidebook"). Writes `#view=`. | Links resolve to existing views. The QA link checker passes (buttons for JS-only actions, real anchors only). |

## 4. Designer

| ID | Item | Acceptance criteria |
|---|---|---|
| **D-01** | `beta/assets/views.css` from the mockup CSS ([`tools/views.css`](tools/views.css)), keyed on `html[data-view]`. Switcher, covers, rails, pager, tray detents, chapters, print, charts. | 0 contrast failures in light and dark (`contrast.py` extended with chart and switcher tokens). Uppercase share < 15 %. No class name, comment or token names a third-party brand. |
| **D-02** | **Chart tokens**: the validated categorical sets (light `#2a78d6 #eb6834 #1baf7a #eda100 #e87ba4 #6250d6`, dark `#3987e5 #d95926 #199e70 #c98500 #d55181 #9085e9`, other `#b4ada2`) as `--series-1…6` / `--series-other`, with dark selected by token, not flipped. | The dataviz validator passes on both surfaces (`#FFFFFF`, `#1B1916`). The light-surface contrast WARN is answered by value labels + a table on every chart. |
| **D-03** | **Cover rules** for Gallery: tint, edge, pin-art placement, ringed pin, plate sizes per breakpoint, glyph chip; the photo-path variant with the credit position. | Native plates never clip at 320–1440 px (visual diff). Covers are legible in night mode. |
| **D-04** | **Visual review** of each view at 390 × 844 and 1440 × 900 against ROUND-1's look-and-feel criteria: `design/beta/REVIEW-W3-views.md` with screenshots and a per-view verdict. | Every defect is filed back through BETA-LOG notes to its lane. |

## 5. QA

| ID | Item | Acceptance criteria |
|---|---|---|
| **Q-01** | **Harness per view.** `metrics.js` gains `view=` runs: B-01/B-03 first-screen metrics, tap targets, overflow at 360/390, and contrast for each view on the pilots. | 0 FAIL per view on mobile and desktop. Results in `docs/BETA-QA.md`. |
| **Q-02** | **No-CDN and storage-blocked runs** per view (Leaflet blocked, tiles blocked, fonts blocked, `localStorage` throwing). | Every view renders every place. The switcher works with no storage, and there are 0 JS errors. |
| **Q-03** | **Deep-link matrix**: `#view=` × `#p=` × lenses × `pg=` / `all=`, plus Back / Forward. Shared links (`view=` explicit) reproduce what the sender saw, including against a receiver whose stored preference differs. | All cases pass in Chromium at both viewports. |
| **Q-04** | **Honesty greps** on the rendered views: no price, currency, rating, star-score, "book now", "booking", "reserve", "availability" or opening-hours strings outside the "Hours and prices aren't in our data" line; no third-party brand outside data-rendered source labels. | 0 hits. Runs in `npm test`. |

## 6. Definition of done (Wave 3, views)

- All four views are on every city page that has a live counterpart, switchable, and shareable by URL.
- `cd tools && npm run validate && npm test && npm run beta:check` is green, and P-04 passes on every pilot in every view.
- The designer's review (D-04) has no open blocker, and QA (Q-01–Q-04) signs off.
- `docs/BETA-LOG.md` has one entry per lane push, and the PM records acceptance in `docs/BETA-BACKLOG.md`.

## 7. Out of scope (stated, not filled)

- Photos beyond the imagery lane's credited path (egress policy; see ROUND-1 Imagery note).
- Any price, booking, availability or hours, even as a placeholder.
- Server-side views or per-view URLs (`/tokyo/gallery`): static hosting, one page per city with `#view=`.
- User ratings, reviews or popularity charts: we hold no such data.

## 8. Mapping to the PM's M4 placeholders

| M4 | Plan items | Note |
|---|---|---|
| M4-01 switcher | A-01, D-01 | The count line is P-02's helper |
| M4-02 `view=` in the hash | A-01, P-06, Q-03 | Precedence: hash, then preference, then default; share writes `view=` explicitly |
| M4-03 paging never hides a place | A-03 (pager), P-04, Q-01 | Only the Gallery grid pages; the other views use area templates |
| M4-04 Gallery | A-03, A-04, D-03 | The union rule is met by the **All N places** grid under the rows, which holds every record. The rows are curated lenses, not the inventory (test: grid == record set). |
| M4-05 Atlas | A-02 | |
| M4-06 Guidebook | B-01, B-03 | Lane proposal: **FE-B** builds it as a view module, not FE-A (§0) |
| M4-07 Insights | P-03, B-02, D-02 | Lane proposal: **FE-B**. Bars are links that apply the lens; the index keeps 100 % reachable. |
| M4-08 sheet n of N | A-05, A-04 | |
| M4-09 QA per view | Q-01–Q-04 | |
