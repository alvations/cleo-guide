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

## Pass 2026-10-11 · f2c39d69 (baseline) + b5f0afa1 (FE-A re-check)

**Pinned:** `f2c39d69ece50a954e922d7705f207daae03bab2` (the orchestrator's baseline, validate and `npm test` green). The
orchestrator then reported that FE-A's gap 2 / 3 / 5 work and the casing helper had landed only at `b5f0afa1`, so the
whole pass ran again on `b5f0afa1`. Each SHA ran in its own clean worktree, with the harness byte-identical to
`tools/beta/qa/qc.js` at 4db273ed. **Every finding below reproduces on both SHAs** unless it says otherwise. The
filed findings were spot-checked again on the head `0ecf62aa` (2026-10-16, 113 commits later) and **all still
reproduce there** (canon bars, kind bars, Insights lens, Cleveland badge, Atlas lens count).

**Outputs:** `design/beta/eval/qc/<sha>/{patterns,journeys,sweep}/{qc.json,summary.md}` for both SHAs.
`design/beta/eval/qc/b5f0afa1/evidence/qc-NN-*.jpg` holds one shot per finding, made by
`node beta/qa/qc-evidence.js --label <sha>`. `design/beta/eval/qc/b5f0afa1/patterns/shots/` holds one Atlas reference
per pilot and viewport. The per-state run shots (≈ 80 MB) were not committed; a re-run reproduces them, and the
`shot` paths in `qc.json` name them.

### Raw counts (harness statuses, before triage)

| Group | f2c39d69 PASS / WARN / FAIL / N/A | b5f0afa1 PASS / WARN / FAIL / N/A |
|---|---|---|
| A. patterns (5 pilots × 390 / 1440) | 533 / 69 / 90 / 11 | 531 / 71 / 90 / 11 |
| B. journeys (7 pages × 2 viewports × 2 themes) | 200 / 60 / 8 / 40 | 200 / 64 / 4 / 40 |
| C. sweep (91 pages × 6 loads) | 4,826 / 876 / 805 / 56 | 4,826 / 683 / 998 / 56 |

**Journeys** (success on b5f0afa1; f2c39d69 is the same except J-02 has 3 more "no" and J-07 has one more "no"):
- J-01: 20/20 yes.
- J-01h: 8/8 yes.
- J-02: 16 partial, 4 no.
- J-03: 12/12 yes.
- J-04: 20/20 yes.
- J-05: 20 partial.
- J-06: 28/28 yes.
- J-07: 28 partial.
- J-08, J-09, J-10, J-11: 28/28 yes each.

Back and Forward, 200 % zoom, reduced motion, the map library blocked and storage blocked all hold on every page,
viewport and theme. Shared links reopen the same place and view; the shortlist survives a reopen. Closures are
honest in every view. "Who recommends this" works from every sheet.

### Triage: every FAIL accounted for

| Raw FAIL | Disposition |
|---|---|
| P-01 (10), J-05 phone switcher | **QC-09** |
| P-03 (WARN 10) | **QC-10** |
| P-10 (10) map view not in the hash | Confirms **PANEL-R1-#13**; not re-filed |
| P-14 (40), P-15 (5 phone Atlas), J-05 counts | **QC-03** (Insights) and **QC-13** (Atlas). The Insights footnote lines that P-14 also listed ("Computed from 487 of 488") are correct sub-counts, so that part is harness strictness. |
| P-17 (2) | **QC-04** |
| P-18 (20 / 22) | **QC-01**, **QC-02** |
| P-25 (1), P-26 Chinatown (1), f2c39d69 only | The price and "most popular" lines are in the record's own write-up. They are labelled under D-39 on b5f0afa1 (P-25 / P-26 PASS); the detail half is QA-65. Not re-filed. |
| P-26 New York 1440 (1) | **Harness artefact.** The cards use `content-visibility:auto`, so off-screen cards report no `innerText`. The credits are present; checked on screen. Probe fixed (reads `textContent`). |
| S-01 token census: raw colour 62, radius 50, letter-spacing 13, shadow 13, font size 3 outside `tokens.css` | Evidence for **R7-g6** (in progress); not re-filed |
| S-05 (10) | **QC-05**. "No switcher to probe" on phones is the collapsed switcher, part of QC-09. |
| S-06 (504) | **Harness artefact.** `button.pl-save` hides its "Save" label with `text-indent: 200%` on purpose. Probe fixed. |
| S-08 (46 / 30) | Data labels (collection and cuisine names, region names): **OWNER-casing**; not re-filed |
| S-10 (84, all at 768) | **QC-06** |
| S-11 (0 / 252) | **Harness artefact**, the same as QA-66. The new sliding indicator under the selected switcher label is a positioned sibling the ancestor walk cannot see; the label reads fine on screen in both themes. The probe now skips visually hidden text; the limit is documented in the harness. |
| S-12 (96 / 51) | **QC-11** (FE-A, extends PERF-06) and **QC-12** (platform, new on b5f0afa1) |
| S-15 (69 / 71), J-07 "INPUT no ring" | **Harness artefact.** The search field's ring is drawn on an outer wrapper, visible on screen (`qc-07` probe shot, not committed). Not filed. |
| J-07 "focused elements off-screen" | **Harness artefact.** Smooth scrolling was still running when the probe measured. The probe now re-measures after 700 ms. |
| J-07 focus after Esc | **QC-07** |
| J-02 | **QC-08** |
| S-03 (WARN 546) | **QC-14** |
| J-07 Wheeling 390 light (1 run, f2c39d69 only: Enter did nothing three times) | Not reproduced in the other 27 runs or on b5f0afa1; flake, not filed |

**Not measured this pass:** P-24 (no silent caps) has no automated probe yet. It is covered indirectly by P-13 (every
view reaches all N) and P-23 (the pager), and gets its own probe before the re-pass.

**Since this pass (2026-10-16):**
- P-24 is automated. Every container that states "n places" must render n items or show a visible control to the rest (See all / Show all / pager).
- A smoke run on Tokyo found no silent caps: Gallery 4 containers measured, Guidebook 13, Insights 1. The phone Atlas list is not shown at load, so it reads N/A there.
- Also fixed: a comment inside the P-26 probe's function body broke that probe after 129eff6b. The f2c39d69 / b5f0afa1 results above predate the edit and are unaffected.

### Findings

Severity rules and lanes as in "How QC measures". All are **open**; each is mirrored in `BETA-ISSUES.md`.

| Id | Sev | Lane | Finding | Steps | Expected | Actual (both SHAs; head 0ecf62aa where checked) | Evidence |
|---|---|---|---|---|---|---|---|
| **QC-01** | **High** | FE-B | The signature-canon chart's dish bars all open one cuisine lens, so a bar opens places it does not count. | Insights → "The signature canon" → tap "soba: 15". | Each bar opens the places it counts (STUDY §7 "charts as filters"; SPEC §3.4). | Every dish bar links `cz=<first cuisine>`. Tokyo: soba 15, tempura 14 and unagi 9 all open `cz=SUSHI` (33 places). Cleveland: "Polish Boy: 1" opens 18. New York: "bagel: 1" opens 23. Chinatown: "laksa: 1" opens 2. | `b5f0afa1/evidence/qc-01-canon-bars.jpg`; `*/patterns/qc.json` P-18 |
| **QC-02** | Med | FE-B | Bars whose measure is not a lens open a broader lens with a different count, and nothing says so. | Insights → "What each area is for" → "All of Tokyo · Sights: 213". | The bar's number equals what opens, or the arrival says why it differs. | Sights 213 opens `mode=sights` with 263 (pop-culture sights are their own segment). "Jōtō · Pop culture: 3" opens 2. Cleveland tier ladder "Downtown · all 38" opens 42 (closed places included). "Other sources: n" segments open the whole area. | `qc-02-kind-bars.jpg`; P-18 |
| **QC-03** | Med | FE-B | Insights ignores the lens in its numbers. | `#view=insights&a=CYD` (also `mode=food`, `t=1`). | "Insights shows the lensed numbers" (SPEC §2.5); the count line reads "43 of all 488". | "Every number below is computed from the 488 places", tiles 488 / 263 / 225, every chart unfiltered, with the "Chiyoda-ku" chip on. 5/5 pilots × 2 widths; J-05 20/20 runs. | `qc-03-insights-lens.jpg`; P-14, J-05 |
| **QC-04** | Med | Atlas FE-1 | No "without a verified pin" badge on a page with an unpinned record. | Cleveland, Atlas. | "1 without a verified pin · listed below" (SPEC §3.2; STUDY §7). | No badge at 390 or 1440. The record is `rocky-river-reservation-and-fort-hill-stairs`, pin `low`. | `qc-04-no-pin-badge.jpg`; P-17 |
| **QC-05** | Med | Atlas FE-1 | A search with no match shows an empty map and "List · 0", with no message and no way out. | `#q=zzqxjv` on any pilot. | An empty state that says nothing matched, with "Clear search" / "Show all N". | A blank map, "List · 0", and the "All 488" chip still pressed. 5/5 pilots × 2 widths. | `qc-05-empty-search.jpg`; S-05 |
| **QC-06** | Med | FE-A | The view switcher is under the 44 px target at tablet width. | Any city page at 768 px. | Every segment ≥ 44 px (SPEC §2.4, §5). | Gallery 100 × 40, Atlas 85 × 40, Guidebook 125 × 40, Insights 105 × 40 on 84/84 city pages. | `qc-06-switcher-768.jpg`; S-10 |
| **QC-07** | Med | FE-A | Esc from the sheet returns focus to a different card for the same place, not to the control that opened it. | Keyboard: Tab to the first card, Enter, Esc. | Focus returns to the opener. | Focus lands on another instance of the place (the lead card or a rail) outside the opener's card. 20/20 city runs on both SHAs. | J-07 in `*/journeys/qc.json` |
| **QC-08** | Med | FE-A | "Best food near X" takes 5 steps through the Filters tray, and the top of the page ignores the lens. | Gallery: Eat & drink → area → open the first. | ≤ 4 steps; the first card on screen is inside the lens. | No area control outside the Filters tray (20/20). After the lens, the lead card ("Start with Kanda Myōjin", a Chiyoda sight) is still the first card (8/20). Visible food cards are out of rank order in 4/20. | `qc-08-food-lens-top.jpg`; J-02 |
| **QC-09** | Low | FE-A + designer | The phone switcher is collapsed into one control, and an open sheet covers it. | 390 px: switch views; open a place, then switch. | A 4-segment control (SPEC §2.4) as `role=group`, reachable with a sheet open. | One "Gallery ▾" control, 2 taps per switch (10/10 phone runs). The sheet covers it, so you must close it first (10/10). `nav[data-cleo-views]` has no `role=group` (10/10). If the dropdown is a deliberate design change, record it in SPEC. | `qc-09-sheet-covers-switcher.jpg`; P-01, J-05 |
| **QC-10** | Low | FE-B | After a switch to Guidebook or Insights, focus stays on the button or body. | Switch views by keyboard. | Focus moves to the view's heading (SPEC §5). | Gallery and Atlas move focus to their h1; Guidebook and Insights do not (2/4 on 10/10). The announcement itself is right. | P-03 |
| **QC-11** | Med | FE-A | Layout shift on load beyond PERF-06: the rail and toolbar arrive late at phone and tablet widths. | Load a city page at 390 or 768. | CLS ≤ 0.1. | b5f0afa1: CLS > 0.1 on 15 pages at 390 light (12 dark), max 0.41 (`#cleo-rail`, `.toolbar`, `.split`), and on 7 pages at 768, max 0.32. f2c39d69: 20 / 16 pages at 390 and 25 at 768, max 0.50 (Ho Chi Minh City at 768). Extends PERF-06 (390 only) to 768. | S-12 in `*/sweep/qc.json` |
| **QC-12** | Med | platform | The top bar shifts on desktop after load; on b5f0afa1 the shifting nodes are the new locale links. | Load a city page at 1440. | CLS ≤ 0.1. | b5f0afa1: `.topnav`, `.locales`, `.area-end` / `.top-actions` shift up to 0.23 on 11 pages at 1440 light (6 dark). f2c39d69: a `.topnav` / `.top-actions` shift up to 0.19 on 9 pages at 1440 and 10 at 1024 (Singapore and Vietnam pages). | S-12 |
| **QC-13** | Low | Atlas FE-1 | The Atlas count line drops the total under a lens, and the phone Atlas has no count line. | `#view=atlas&a=CYD`; phone Atlas. | "43 of all 488 places" (SPEC §2.1). | Desktop says "43 places in this map area" or "All 43 places". The phone shows only "All 488" (chip) and "List · 351" (the map area). Related to PANEL-R1-#8. | `qc-13-atlas-lens-count.jpg`; P-14, P-15 |
| **QC-14** | Low | designer | Spacing is off the 4 px scale. | Sweep, all pages. | Margins, paddings and gaps on the `--s-*` scale (4 px steps). | 46 % of measured values are off-scale; the commonest are 6, 5, 7 and 9 px. | S-03 |

**By severity:** Blocker 0 · High 1 · Med 9 · Low 4.
**By lane:**
- FE-A: 5 (QC-06, 07, 08, 09, 11).
- FE-B: 4 (QC-01, 02, 03, 10).
- Atlas FE-1: 3 (QC-04, 05, 13).
- platform: 1 (QC-12).
- designer: 1 (QC-14), plus a share of QC-09.
- Atlas FE-2, FE-C, imagery: 0.

**Harness changes made during triage** (they only remove false positives; no threshold was loosened):
- S-06 skips text-indent image replacement.
- P-26 reads `textContent`.
- J-07 and S-15 re-measure off-screen focus after smooth scrolling.
- S-11 skips visually hidden text and documents the sliding-indicator limit.
