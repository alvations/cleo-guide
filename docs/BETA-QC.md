# Beta QC: experience, UI and melon-seek pattern audit

> **Owner:** the QC lane (this file; `tools/beta/qa/qc*.js`; `design/beta/eval/qc/**`; the QC-NN rows in
> [`BETA-ISSUES.md`](BETA-ISSUES.md)). The QC lane is independent: it audits and verifies but never changes product code,
> and it never weakens a test or gate.
> **Owner request (2026-10-11):** *"Fix all the issues! And then run the melon-seek style Ui/UX and experience QA QC and
> all the backend and application front end optimization and keep the audit trail on all of them"*.
> **Yardsticks:** the melon-seek patterns adopted in [`STUDY.md` §7](../design/beta/views/STUDY.md) and
> [`SPEC.md`](../design/beta/views/SPEC.md), plus general experience quality (WCAG 2.2 AA, the design system's tokens,
> [`DESIGN-SYSTEM.md`](../design/beta/DESIGN-SYSTEM.md), and the casing rule in `design/beta/casing/`).
> Append a dated "Pass" section per run and never rewrite an earlier one.

## How QC measures

```bash
cd tools && npm install --no-audit --no-fund          # first time only
NODE_PATH=$(npm root -g) node beta/qa/qc.js --label <sha>                  # full pass: patterns + journeys + sweep
NODE_PATH=$(npm root -g) node beta/qa/qc.js --only patterns,journeys      # one or more groups
NODE_PATH=$(npm root -g) node beta/qa/qc.js --only sweep --pages tokyo,cleveland --vps 390,1440   # narrow a sweep
NODE_PATH=$(npm root -g) node beta/qa/qc.js --list                        # print every check id and its title
```

- **Rig.** Real Chromium (preinstalled; never `playwright install`). `beta/` is served from disk by a local static
  server. Map tiles (OpenStreetMap and Esri hosts) are **stubbed** with a 1×1 PNG so the map mounts without the
  network; every other off-origin request is **aborted**. Service workers are blocked so each load is cold.
- **Output.** `design/beta/eval/qc/<label>/qc.json` (every check: id, group, page, viewport, theme, status, evidence),
  `summary.md` (counts and failures by check), and `shots/` (journey key states and every failing state, JPEG).
- **Statuses.** `PASS`, `FAIL` (a measured breach), `WARN` (a measured value outside the target but inside the
  tolerance, or a heuristic that needs a human look), `PENDING` (the feature under test is not present on this page
  yet), `N/A` (does not apply to this page kind).
- **Ground truth** comes from the build, not the page under test: N = `places.length` of `beta/data/places/<page>.json`;
  lens counts = `Cleo.lens.match` over every record after `Cleo.defer.all()`; unpinned = records with no coordinate or
  `pv.pin = low`; closed = `pv.status = closed`.
- **Pages.** Pilots for patterns and journeys: Tokyo, Cleveland, New York, Chinatown (Singapore), Wheeling, plus the
  landing page and the Japan hub. The UI sweep covers all 84 city pages, the 5 country hubs, the archive hub and the
  landing page (91 pages) from `beta/data/manifest.json`.
- **Viewports.** Phone 390×844 (touch, DPR 2), tablet 768×1024, laptop 1024×768, desktop 1440×900. Themes: light, and
  dark via `prefers-color-scheme: dark`.
- **Findings** get stable ids **QC-NN**, a severity, steps, expected vs actual, evidence in `design/beta/eval/qc/`, and
  an owning lane. Every finding is mirrored into [`BETA-ISSUES.md`](BETA-ISSUES.md) as a QC-NN row with status `open`.

### Severity

| Severity | Meaning |
|---|---|
| **Blocker** | A broken promise of the guide: a place unreachable or dropped, invented data, a closed place shown as live, a page that fails to render, or a lost shared link. |
| **High** | A journey fails or needs a workaround; an AA failure on primary text or controls; a melon-seek contract item missing (counts disagree between views, a silent cap, a chart bar that opens nothing). |
| **Med** | A journey succeeds with friction; a contract item partly met; a target under 44 px; clipping of secondary text; layout shift over 0.1. |
| **Low** | Polish: rhythm, widows, casing, token drift, truncation by design that hides useful text. |

### Owning lanes

FE-A (city pages, cards, detail, Gallery, day plans) · FE-B (landing, hubs, Guidebook, Insights) · Atlas FE-1 (map
layout, pins, list) · Atlas FE-2 (map state, URL, keyboard, near-me) · FE-C (trips, base, share cards) · imagery ·
platform (core.js, route, store, build, tokens) · designer (tokens, type, spacing decisions).

## Checklist

55 checks in three groups (28 pattern, 12 journey, 15 sweep), run as roughly 7,000 measurements per full pass (91 pages × 6 sweep loads, 10 pattern runs, 28 journey runs). Each id below is what `qc.js --list` prints and what `qc.json` records. **Auto** = measured
by the harness; **auto + look** = measured, with screenshots a human reads before filing; **manual** = recorded by the
QC reviewer from the screenshots and noted in the pass section.

### A. melon-seek patterns ([STUDY §7](../design/beta/views/STUDY.md), [SPEC §2](../design/beta/views/SPEC.md))

Run on the five pilot city pages at 390 and 1440, light.

| Id | Check | Pass when | How |
|---|---|---|---|
| **P-01** | Segmented view switcher | `nav[data-cleo-views][role=group]` is visible with exactly *Gallery · Atlas · Guidebook · Insights* in that order, one `aria-pressed=true`, each segment ≥ 44 px tall. | auto |
| P-02 | Switcher switches | A click on each segment sets `html[data-view]`, moves `aria-pressed`, shows that view's host and hides the others. | auto |
| P-03 | Switch focus and announce | After a switch, focus is on the view's heading and the live region names the view and its count (SPEC §5). | auto |
| **P-04** | Defaults omitted | A cold load writes no hash; switching back to Gallery removes `view=`; clearing a lens leaves no empty `k=` pairs; page 1 writes no `pg=`. | auto |
| **P-05** | Enums validated | `#view=zzz&t=9&a=NOPE&pg=0&mode=x&closed=2&all=yes&src=<script>` loads with 0 errors, falls back to Gallery, and the garbage keys are dropped from the hash by `replaceState` (no new history entry). | auto |
| P-06 | Garbage `p=` | `#p=no-such-place` opens no sheet, throws nothing, and the page still lists N. | auto |
| **P-07** | Round trip: view | For each view, the URL from the address bar opened in a fresh context, whose stored view preference differs, reproduces that view. | auto |
| P-08 | Round trip: lens | `a=`, `t=`, `mode=`, `c=`, `cz=`, `src=`, `q=`, `closed=` each reproduce the same lens and the same count in a fresh context. | auto |
| P-09 | Round trip: place | `#p=<id>` in each view opens the same sheet in a fresh context, in that view. | auto |
| P-10 | Round trip: map view | The Atlas map position written to the hash (`map=`) survives a reload and a fresh context. | auto |
| P-11 | Round trip: page | `pg=<n>` and `all=1` reproduce the same Gallery page and range text. | auto |
| P-12 | Share writes state | The sheet's Share writes a URL that carries `view=` explicitly (SPEC §2.4) and the open place. | auto |
| **P-13** | One record set | With no lens, every view reaches all N records (Gallery with show-all, Atlas list, Guidebook entries, Insights index), and none adds a record not in N. | auto |
| **P-14** | Counts agree across views | For the same lens (none, `a=`, `mode=food`, `t=1`), the count each view states equals the ground-truth lens count. | auto |
| **P-15** | One summary line per view | Each view shows one computed count line ("All N places …" or "n of all N places"); its numbers match ground truth. | auto |
| **P-16** | Numbered or clustered pins | Atlas pins carry a number (rank) or a cluster count; no bare anonymous pins at the default zoom. | auto + look |
| **P-17** | No-place badge | When a page has unpinned records, the Atlas shows a badge "n without a verified pin" with n equal to ground truth, and those records are listed. | auto |
| **P-18** | Charts as filters | Every Insights bar or segment is a link; following it applies a lens whose count equals the bar's stated value, in the view it names. | auto |
| P-19 | Chart table | Every chart has "Show as a table", and the table's values equal the chart's. | auto |
| **P-20** | Every chart accounts for all records | Every chart has a footnote; where a chart counts places, its total plus what the footnote excludes equals N. | auto |
| **P-21** | Drawer "n of N" | The sheet shows "i of M" where M equals the lensed count in the current view, with previous and next. | auto |
| P-22 | Drawer prev / next | Next moves to i+1 in the view's order and updates `p=`; the first item's Previous and the last item's Next behave (disabled or wrap, never vanish silently). | auto |
| **P-23** | Pages, numbers, all N, show-all | The Gallery pager has previous, page numbers, next, the "all N places" total and a show-all control; show-all puts every match on one page. | auto |
| P-24 | No silent caps | No list, rail, tray or index stops short of its stated count without a visible control to reach the rest (Gallery rails say "See all n"; the Atlas list has "Show all"). | auto |
| **P-25** | No value-led ranking | No "highest", "top-rated", score, star rating or popularity ranking in any view; sort options rank by tier and named sources only. | auto |
| **P-26** | No invented data | No price, hours, booking, availability, rating or review wording outside the stated-gap line; no demo, sample or placeholder records; every photo carries a credit. | auto |
| P-27 | Lens yields to a deep link | A link to a place hidden by the current lens still opens it (SPEC §2.2). | auto |
| P-28 | "Show all N" clears every lens | One action clears all lens keys and the count returns to N. | auto |

### B. Experience journeys

Run on Tokyo, Cleveland, New York, Chinatown and Wheeling, the landing page and the Japan hub, at phone 390×844 and
desktop 1440×900, in light and dark. Each journey records **success** (yes / no / partial), **steps** (user actions:
clicks, key presses, typed queries), and **friction** (each detour, dead end, ambiguous label or wait).

| Id | Journey | Success when | Step budget |
|---|---|---|---|
| **J-01** | Discover → shortlist → plan a day → share → reopen | From the page top: save two places, add one to a day, share, and the shared link opened cold shows the same place, view and day; Saved lists both. | ≤ 10 |
| J-01h | Discover from a hub | From the landing page or the Japan hub, reach a named city's guide and one of its places. | ≤ 4 |
| **J-02** | "Best food near X" | From the page top, show food places in one named area, ordered by rank, and open the first. | ≤ 4 |
| **J-03** | "Is it still open?" | A closed place reads "Closed · kept for the record" in every view, carries no tier, and its sheet states the status and the check date; an open place's sheet states its check date. | ≤ 3 |
| **J-04** | "Who recommends this and why?" | The sheet shows "Recommended by" with named, linked sources and the record's own write-up; a source opens the source lens with its count. | ≤ 3 |
| **J-05** | Switch views without losing context | With a lens and an open place, a switch keeps the lens (same count), keeps or re-opens the place, and Close returns to the same scroll position. | 1 per switch |
| **J-06** | Back and Forward | Back undoes a view switch, then a lens change, then closes a sheet, in that order; Forward redoes each; Back never leaves the page while state remains. | — |
| **J-07** | Keyboard only | Skip link first; switcher, cards, sheet, pager and tray reachable by Tab; Enter and Space activate; the sheet traps focus; Esc closes and returns focus to the opener; every focus is visible. | Tabs to the switcher ≤ 12 |
| **J-08** | 200 % zoom | At 1440 with 200 % zoom (720 CSS px) no horizontal scroll, no clipped control, the switcher and the sheet still work. | — |
| **J-09** | Reduced motion | With `prefers-reduced-motion: reduce` the sheet, tray, detents and view switch run with no transition or animation over 10 ms; smooth scrolling is off. | — |
| **J-10** | Map library blocked | With the map library, tiles and fonts blocked: 0 errors, every record listed, the Atlas states the map is unavailable, and the sheet still works. | — |
| **J-11** | Storage blocked | With `localStorage` and `sessionStorage` throwing: 0 errors, saving and view switching work in memory, and the page says saved items will not persist. | — |

### C. UI QC sweep

Run on all 91 pages at 390, 768, 1024 and 1440 in light, plus 390 and 1440 in dark (contrast and token checks).

| Id | Check | Pass when | How |
|---|---|---|---|
| **S-01** | Token discipline (static) | `probe-css.py` census: no raw colour, font size, radius, shadow or letter-spacing outside `tokens.css`. Reported as raw-value counts per property, diffed against the last pass. | auto |
| S-02 | Token discipline (runtime) | No inline `style` attribute sets a raw colour, font size, radius, shadow or letter-spacing (data-driven custom properties such as `--ac` are allowed). | auto |
| **S-03** | Spacing rhythm | Computed margins, paddings and gaps of visible elements sit on the 4 px scale (share off-scale ≤ 5 %). | auto (WARN) |
| S-04 | Alignment | The main column's blocks share left edges: distinct left edges among top-level blocks ≤ 3 per breakpoint. | auto (WARN) + look |
| **S-05** | Component states | Buttons and chips show distinct hover, focus-visible and pressed styles; disabled controls look disabled and are not focusable as active; empty (`q=` with no match), loading (delayed page data) and error (page data aborted) states each show a message and a way forward. | auto |
| **S-06** | Truncation and clipping | No text box clips its content without an ellipsis; truncation with an ellipsis is listed for a look (WARN). | auto |
| S-07 | Widows and orphans | No heading, card title or lead ends with a single short word alone on its last line. | auto (WARN) |
| **S-08** | Sentence case | Interface labels (headings, buttons, chips, tabs, labels, table heads) follow the casing rule (`design/beta/casing/`); place and source names are exempt. | auto |
| **S-09** | Credits visible | Every photo has a visible credit, not clipped, not covered, with contrast ≥ 4.5:1. | auto |
| **S-10** | 44 px targets | Every interactive element has a ≥ 44×44 hit area (pseudo-element hit areas count, probed by hit testing); links in running prose are exempt. | auto |
| **S-11** | AA contrast | Every visible text node ≥ 4.5:1 (≥ 3:1 for large text) against its composited background, in light and dark; text over images is reported as unknown. | auto |
| **S-12** | No layout shift on load | Cumulative layout shift (no input) ≤ 0.1 by 2.5 s; WARN over 0.05. | auto |
| **S-13** | No horizontal overflow | `scrollWidth ≤ innerWidth` at every width; offenders named. | auto |
| S-14 | No errors | 0 page errors and 0 console errors (blocked-network noise excluded) on every load. | auto |
| S-15 | Focus visible | The first 30 Tab stops each show an outline or a box shadow. | auto |

## Pass log

No pass yet. The first full pass runs when the orchestrator sends "QC pass at &lt;sha&gt;".
