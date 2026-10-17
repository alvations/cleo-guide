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

56 checks in three groups (28 pattern, 12 journey, 16 sweep), run as roughly 7,000 measurements per full pass (91 pages × 6 sweep loads, 10 pattern runs, 28 journey runs). Each id below is what `qc.js --list` prints and what `qc.json` records. **Auto** = measured
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
| S-16 | No internal editorial phrases | No visible or deferred card text contains pipeline or editorial jargon ("kept flagged", "worklist", "per editorial rule", "geocoded", "UNVERIFIED", TODO/FIXME, placeholder text). Added 2026-10-16 at the orchestrator's suggestion. | auto |

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

## Re-verify 2026-10-16 · 2bfff3fe (FE-B claims for QC-01, 02, 03, 10)

**Pinned:** `2bfff3fe9886d1939e5b3994fb0bc329d2b62175`, the deploy candidate containing FE-B's 68b442c0. Clean worktree,
harness = `tools/beta/qa/qc.js` at bb887a7f. Ran patterns on the 5 pilots × 390 / 1440 and journeys on the 5 pilots ×
390 / 1440 in light. Outputs are in `design/beta/eval/qc/2bfff3fe/{patterns,journeys}/`.

| Id | Result | Evidence |
|---|---|---|
| QC-01 | **verified** | P-18: no bar opens a lens that differs from its value. The canon bars are now plain, and the footnote says why ("Each dish is named inside a place's write-up and no filter selects it, so these bars count without opening places"). Wrong places are no longer reachable. |
| QC-02 | **verified** | P-18: 0 count mismatches on 74 charts. Every remaining plain bar is stated in its chart's footnote ("Plain bars have no filter that opens exactly the places they count; linked bars open exactly theirs"). |
| QC-03 | **verified** | P-14: Insights reads "43 of all 488 places match this lens. Every number below is computed from the 43 places in this lens" for `a=`, `mode=` and `t=` on 5/5 pilots × 2 widths. J-05: the Insights count friction is 0/10. |
| QC-10 | **open** | P-03 is still 2/4 on 10/10: after a switch to Guidebook or Insights, focus is on BODY or the button, not the view heading. |

**Notes:**
- The raw P-18 FAILs in this run (42) are the plain bars above; the harness predates the plain-bar rule. P-18 now accepts an unlinked bar only when the chart's footnote states why (harness change in this push), so the next run grades them PASS.
- Deviation for the designer to ratify: SPEC §3.4 lists "How far you walk → Atlas `a=`", but those bars are now plain ("Distances are measures, not lists of places"). Not a defect, because the reason is stated, but SPEC and build now differ. The same goes for the new "Recognised places by area" chart (W9-1).
- P-24 (first run): 35 PASS, 5 N/A (phone Atlas list not shown at load), 0 silent caps.

## Pass 2026-10-16 · 530dc83b (re-verify + new features)

**Pinned:** `530dc83b6e45c88afe764779b1451f201a883410`, the orchestrator's QC pin and deploy candidate (gates green), in a
clean worktree. Harness: `qc.js` at 91fb6634, which adds P-10 `at=` and fixes the place-link clicks (a card's first
link is now the tier badge to `#how-we-choose`, so J-02, J-06 and J-07 click the place link). Ran:
- patterns: 5 pilots × 390 / 1440;
- journeys: 5 pilots × 390 / 1440, light;
- sweep: 91 pages × 768 / 1440, light;
- exploration of the features that landed since the first pass, at 390 and 1440.

**Supplementary:** FE-B's QC-10 fix (78e4ab74) and the QC-09 200 % follow-up (639d2b1b) are **not** in 530dc83b. So
patterns also ran on `639d2b1b` (Tokyo, Cleveland, Chinatown × 390 / 1440). Outputs are in
`design/beta/eval/qc/{530dc83b,639d2b1b}/`, with evidence in `530dc83b/evidence/`.

### Re-verification

| Id | 530dc83b | Probe · result |
|---|---|---|
| QC-01 | **verified** (holds) | P-18 74/74 PASS; canon bars plain with a stated footnote |
| QC-02 | **verified** (holds) | P-18 74/74 PASS. The designer ratified the plain-bar rule (SPEC §3.4, f0497626 / 49bb7f4c), which closes the "How far you walk" deviation noted on 2bfff3fe. |
| QC-03 | **verified** (holds) | P-14: Insights states "n of all N" under every lens; J-05 0 Insights count friction |
| QC-04 | open (no claim) | P-17 FAIL 2/2 Cleveland: no "without a verified pin" badge |
| QC-05 | open (no claim) | S-05: `q=` with no match still shows no message and no clear on 5/5 pilots × 2 |
| QC-06 | **verified** | S-10 at 768: 91/91 PASS; switcher segments ≥ 44 px |
| QC-07 | **verified** | J-07: 0/10 runs lose focus after Esc (was 20/20) |
| QC-08 | **verified** | J-02: 3 steps on Tokyo, New York and Wheeling (both widths); the lead card steps aside under the lens (`qc-08-food-lens-top.jpg`); the sheet opens on a food place in the area. Chinatown has one area, so there is no area step. Residue (not a defect of the claim): the Cleveland UC food grid is ordered by rank 2, 3, 6, 13, 15, 42, 43, 45, 16, 44. |
| QC-09 | **verified** | P-01 10/10 (four segments in a `role=group`, ≥ 44 px); J-05 0/10 "switcher not reachable with the sheet open", 0/10 extra taps; J-08 (200 %) 10/10 |
| QC-10 | **open on 530dc83b**, **verified on 639d2b1b** | 530dc83b: P-03 3/4 (Guidebook leaves focus on BODY). 639d2b1b: P-03 4/4 on 6/6 runs (Atlas, Guidebook, Insights and Gallery each focus their h1). |
| QC-11 | open (no claim) | S-12 at 768: 11 pages > 0.1, max 0.48 (`.toolbar`, `.split`) |
| QC-12 | open | S-12 at 1440: 9 pages > 0.1, max 0.29; `.topnav` among the shifted nodes on 5 |
| QC-13 | open (no claim) | P-14: Atlas under a lens still reads "All 43 places", not "43 of all 488" |
| QC-14 | open (no claim) | S-03 WARN 168/182 |

Also passing on 530dc83b:
- P-10, the map view round-trip via `at=`, 10/10 (FE-2 closed PANEL-R1-#13);
- P-24, no silent caps, 35 PASS and 5 N/A;
- J-01, J-03, J-04 and J-08…J-11, 100 %;
- S-11, S-13 and S-14, 0 FAIL.

The J-06 desktop "partial" results (5) are a harness artefact: the step-3 card click hit a non-link part of the card,
and clicking the name link opens the sheet (checked by hand). J-06 at 390 is 5/5 yes.

### New features: melon-seek pass

Exploration at 390 and 1440, with off-origin requests aborted and 0 off-origin requests observed:
- **Trips** (`trip.html`): four saved Tokyo places fill one day, with stated limits ("more days than that stay empty rather than padded"). The `#trip=` link round-trips in a fresh context. Share this trip, Share as an image, Print as a booklet, Export KML and the "check opening times" honesty line are all present. ✅
- **Set as my base:**
  - every card reads "620 m from Kanda Myōjin · 8 min walk", with the assumption stated once ("straight-line, about 80 m a minute — an estimate, not a route");
  - `base=` sits in the hash and survives a view switch;
  - a cold `#base=` link reproduces it;
  - the Atlas shows the 5 / 10 / 15 min ring;
  - "Nearest to my base" and "Clear my base" are present;
  - it works in memory with storage blocked. ✅ But see QC-15 and QC-17.
- **Near me:**
  - granted: distances on cards, `#sort=near`, and "Using your location for this visit only — never stored or sent";
  - denied: "Location is off for this site, so nothing changed. Every place is still listed." ✅
- **Share cards** (place): a 1080 × 1920 PNG drawn on the device, alt text naming the place, sources, check date and photo credit; Download PNG works (`cleo-kanda-myojin.png`); 0 network requests. ✅
- **View switcher:** QC-06 and QC-09 are verified above. ✅ Under `ja`, see QC-18.
- **Japanese locale** (`?lang=ja`):
  - `html[lang=ja]` is set, with the bilingual banner;
  - the chrome is translated (switcher, chips, crumbs, "Show map");
  - there is no overflow at either width. ✅ See QC-16 and QC-18.

### New findings

| Id | Sev | Lane | Finding | Steps | Expected | Actual | Evidence |
|---|---|---|---|---|---|---|---|
| **QC-15** | Med | FE-C | "Set as my base" drops focus to `<body>`, so Esc no longer closes the sheet. | Open `#p=kanda-myojin`, press **Set as my base**, press Esc. | Focus stays in the sheet (on the button, now "Your base"); Esc closes the sheet. | Focus moves to BODY; the sheet stays open with `p=` in the hash. 390 and 1440. "Mark as been there" and "Add to your day" keep focus and close normally. | `530dc83b/evidence/qc-15-base-esc.jpg` |
| **QC-16** | Med | i18n | Under `?lang=ja` the whole Insights view stays in English, though the banner says only place write-ups do. | `cities/tokyo.html?lang=ja#view=insights`. | The view's chrome is translated, or the banner names Insights as English. | "Tokyo in numbers", all chart titles, captions, tiles, footnotes and "Show as a table" are in English (17 untranslated UI strings on the Tokyo page); the method section's headings are in English too. | `qc-16-ja-insights.jpg` |
| **QC-17** | Med | Atlas FE-1 (+ FE-C base line) | The phone Atlas carousel card clips the base distance line. | 390, `#base=kanda-myojin&view=atlas`. | The full "1.9 km from Kanda Myōjin · 23 min walk" line is visible. | The line's box ends at 840 px and the card (`li.pl`, overflow hidden) at 832, so the line is cut through its middle on every carousel card. | `qc-17-base-card-clip.jpg` |
| **QC-18** | Low | FE-B (switcher §v2.11) | Under `?lang=ja` at 1440 the sliding indicator is not under the selected segment. | `cities/tokyo.html?lang=ja#view=insights`. | The white pill sits under the pressed segment. | The indicator is at x 1133 (width 111), the pressed button at x 1189 (width 127): it straddles ガイドブック and インサイト and stays put after 1.5 s. It is correct in English. | `qc-18-ja-switcher.jpg` |
| **QC-19** | Med | FE-B (D-39) + FE-A (sheet) | Rating and popularity wording in record prose appears **without** the D-39 dated note. | Guidebook or the sheet for `cleveland.html#p=barroco-arepa-bar`; Tokyo `kamo-to-negi-ueno-okachimachi`; Chinatown `best-satay-7-and-8-lau-pa-sat-satay-street`. | D-39: quoted prices and ratings carry "quoted from the source at the time of research (date)". | Barroco: "3,300 reviews at 4.6" with no note, in the Guidebook and the sheet. "One of Ueno's most popular ramen counters" and "The most popular stalls" have no note. Other entries do carry it (Slyman's). The note is keyed too narrowly. | `qc-19-rating-no-note.jpg` |
| **QC-20** | Med | owner decision (FE-B D-39 owner) | Opening hours are quoted in records' "Look for" text while the sheet says "Hours and prices aren't in our data". D-39 covers prices and ratings, not hours. | Guidebook: New York `central-park` ("6am"), `empire-state-building` ("11pm"); Cleveland `slymans-restaurant-and-deli` ("Monday to Friday, 7am–2:30pm"), `rockefeller-park-greenhouse` ("Closes at 4pm"). | Hours carry a dated note like D-39, or the "Hours … aren't in our data" line is reworded. SPEC §1.4 says no hours. | Hours wording without a note on 5/5 New York matches and 14 of 19 Cleveland matches (prices and hours together), plus Tokyo ("7am", "4pm"). | `qc-20-hours-in-text.jpg` |

**Totals after this pass:**
- **Open:** 13. Med 9 (QC-04, 05, 11, 12, 15, 16, 17, 19, 20) · Low 4 (QC-10 on the pin, 13, 14, 18) · High 0 · Blocker 0.
- **Verified:** QC-01, 02, 03, 06, 07, 08, 09; QC-10 on 639d2b1b (it will verify on the next pin that contains 78e4ab74).

## Re-verify 2026-10-16 · f7fa616d (i18n claim for QC-16)

Clean worktree at `f7fa616d`. The QC ja probe (`?lang=ja`, 1440) lists every visible UI text node with no kana or kanji
outside card entries. Output: `design/beta/eval/qc/f7fa616d/ja-probe.json`.

| Id | Result | Evidence |
|---|---|---|
| QC-16 | **verified** | Tokyo and Cleveland Insights: only 3 English nodes each, all data or stated (city name, tagline, the method intro sentence). Titles, captions, tiles, footnotes and "Show as a table" are in Japanese (`qc-16-ja-insights.jpg`). The banner now says the method pages' longer explanations stay in English. In the Guidebook only data remains English (area names, neighbourhood lines). |
| QC-18 | observed fixed, **not yet claimed** | The switcher indicator sits under インサイト in `qc-16-ja-insights.jpg`; it will be verified on the next pin. |
| **QC-21** (new, Low, i18n) | open | how-we-choose.html under `ja`: the stats table headers (Country, Guides, Places, Pins at high confidence, Closed, kept) and the h2 "Added by the guide" are English UI labels. The long paragraphs are stated English and not counted. `qc-21-ja-method-table.jpg`. |

## Re-verify 2026-10-16 · a498adf5 (i18n claim for QC-21)

| Id | Result | Evidence |
|---|---|---|
| QC-21 | **verified** | The QC ja probe on how-we-choose.html at 390 and 1440 (`design/beta/eval/qc/a498adf5/ja-probe-how-we-choose.json`, `qc-21-ja-method-table.jpg`): the five column headers and the h2 "Added by the guide" are now in Japanese. Still in English: the stated long paragraphs, and the country names used as row labels (proper nouns, not UI labels). |

## Re-verify 2026-10-16 · 995e2529 (FE-B claims for QC-18, QC-19, QC-20)

Clean worktree at `995e25294`, which contains 6583673c. Outputs are in `design/beta/eval/qc/995e2529/`.

| Id | Result | Evidence |
|---|---|---|
| QC-18 | **verified** | Indicator vs the pressed segment: dx 0, dw 0 in ja Insights, en Atlas, ja Atlas and en Guidebook at 1440 (`qc-18-ja-indicator.png`). |
| QC-19 | **open** | D-42 scan of the 5 pilot Guidebooks for price, rating, popularity or time wording without the note. Tokyo 0/5, New York 0/5, Chinatown 0/2 and Wheeling 0/1 are missing it; the named records (Barroco, kamo-to-negi, best-satay) now carry it. **Cleveland: 2/19 still lack it:** `cain-park` ("nationally top-rated juried outdoor art fair") and `tita-floras` ("the highest-rated Asian …", closed). |
| QC-20 | **verified** | Hours wording carries "Prices, ratings and times are quoted from the source at the time of research (date)". The sheet's gap line now reads "We don’t track opening hours or prices · Check before you go." |
| **QC-22** (new, Low) | open | Every city page's "How we choose" section (`section#how-we-choose p.sm`) still reads "No ratings, prices or opening hours are shown, because the guide doesn’t hold verified ones", which contradicts the D-42 quotes now shown with a dated note. Lane: FE-A (city page copy) with FE-B (D-42). `qc-22-method-copy.json`. |

## Re-verify 2026-10-16 · 3a0ecfec (platform claim for QC-12; QC-11 measured alongside)

Clean worktree at `3a0ecfec`. QC re-ran its own sweep (light, all 91 pages) at 390, 768 and 1440. Outputs are in
`design/beta/eval/qc/3a0ecfec/sweep-390/` and `sweep-768-1440/`.

| Id | Result | Evidence |
|---|---|---|
| QC-12 | **verified** | S-12 at 1440: 91/91 PASS, max CLS 0.0028; no `.topnav` / `.top-actions` shift recorded. Fix: PERF-06 (df4382d2). |
| QC-11 | **verified** | S-12 at 390: 91/91 PASS, max CLS 0.0002. At 768: 91/91 PASS, max 0.0002. Fixed by the same PERF-06 change, though FE-A never claimed it. |

Other sweep FAILs on this SHA are the known classes: S-15 (the search ring on its wrapper, a harness artefact), S-08
(data-label casing, OWNER-casing) and S-01 (the token census, R7-g6).

## Re-verify 2026-10-16 · 8f21eda9 (current head) + W9-1 recognition pass

**Pinned:** origin head `8f21eda9514104e294f61d7083b20a5b2d099c01`, in a clean worktree. It contains 70060b33, 96c94c42,
78e4ab74, a8d30a16, 4cf7d7eb and df4382d2. The deploy pin `3ba696e8` contains only some of these, so this head is used,
as the orchestrator asked. Ran `qc.js --only patterns` (5 pilots × 390 / 1440) plus targeted QC probes. Outputs are in
`design/beta/eval/qc/8f21eda9/`.

| Id | Result | Evidence |
|---|---|---|
| QC-10 | **verified** | P-03 4/4 on 10/10 (each view's h1 takes focus after a switch). |
| QC-11, QC-12 | verified earlier on 3a0ecfec | — |
| QC-15 | **verified** | After "Set as my base", focus is on "Clear my base" and Esc closes the sheet, at 390 and 1440. |
| QC-17 | **verified (superseded)** | The phone Atlas carousel was replaced by a peek tray ("351 places here · Show list"). In the list, no base line has a clipping ancestor. |
| QC-19 | **verified** | D-42 scan: 0 of 32 matching entries in the 5 pilot Guidebooks lack the note; `cain-park` and `tita-floras` now carry it. |
| QC-22 | open | The FE-A change has not landed: 117 built pages still say "No ratings, prices or opening hours are shown". |
| QC-04 | open (no claim) | P-17 ❌ 2/2 Cleveland. |
| QC-13 | open (no claim) | Desktop Atlas reads "All 43 places" under a lens. |

**W9-1 recognition (FE-C 4cf7d7eb), melon-seek pass.** Tokyo (250 recognised of 488), Cleveland (4) and Toa Payoh (22),
at 1440. Output: `w9-1-recognition.json`.
- ✅ **No badge without data:** 0 places show a badge without `rec`; 0 recognised open places lack one.
- ✅ **The badges are honest:**
  - "Cited by N sources" equals the record's named sources, with "guide" excluded (0 mismatches);
  - "Award · Michelin Guide — Bib Gourmand" links to `#src=michelin-bib`, the source lens;
  - "Cited by" links to the place's own sheet.
- ✅ **The `#rec=any` lens:**
  - it shows exactly the recognised open places (Tokyo 250, Toa Payoh 20 of 22: the 2 closed are excluded);
  - the section heading states the count ("Awards and much-cited places (250)");
  - a fresh context reproduces it.
- ❌ **QC-23:** "Before it closed" is never visible. See below.
- ❌ **QC-24:** the lens chip label is the raw "any".

**Regression found by the re-run.** P-21 FAILs 6/40: **QC-26**, the cold Atlas deep link with a lens.

**Harness notes (not findings):**
- P-25 and P-26 still list D-42-labelled lines; the probe does not yet discount entries that carry the D-42 note. QC-19's own scan covers them.
- P-13 and P-15 at 390 Atlas count 0 because the new phone Atlas keeps its list behind "Show list".

Both probes will be updated before the next pass.

### New findings

| Id | Sev | Lane | Finding | Steps | Expected | Actual | Evidence |
|---|---|---|---|---|---|---|---|
| **QC-23** | Med | FE-C | "Before it closed" recognition is never shown. | Toa Payoh: the card and the sheet for `kim-keat-hokkien-mee` (closed; `rec.cited` 3). | The closed card and the sheet show "Before it closed: Cited by 3 sources" (the W9-1 brief). | `.pl-rec.closed` is rendered with `hidden` (display none) on the card; the sheet shows only "Closed". Same for `hup-chong-hakka-yong-tau-foo`. | `evidence/qc-23-closed-no-rec.jpg` |
| **QC-24** | Low | FE-C | The `#rec=any` lens chip shows the raw hash value. | Open `cities/tokyo.html#rec=any`. | A chip that names the lens ("Recognised" or "Awards and much-cited"), with a matching accessible name. | The chip reads "any ✕"; its aria-label is "Remove any". | `evidence/qc-24-rec-chip.jpg` |
| **QC-25** | Low | FE-A + data | A closed card prints the raw status-source note. | Toa Payoh `kim-keat-hokkien-mee` card. | "Closed — kept for the record · checked 2026-09-02", with the source in plain words. | "… · per Flagged closed per worklist designation (kept, flagged per editorial rule); building geocoded, checked 2026-09-02". | `evidence/qc-23-closed-no-rec.jpg` |
| **QC-26** | Med | Atlas FE-2 | **Regression since 530dc83b:** a cold Atlas deep link with a lens does not apply the lens. | Fresh load of `cities/tokyo.html#view=atlas&a=CYD&p=imperial-palace-east-gardens`; then Next. | 43 shown; the sheet reads "1 of 43 in this Atlas view" (as on 530dc83b). | 488 shown; "1 of 488". After Next it reads "2 of 43". Tokyo, Cleveland and New York, at 390 and 1440. Gallery is correct. | `qc-26-atlas-lens-deeplink.json`; P-21 |

**Register after this pass:**
- Verified 17: QC-01, 02, 03, 06, 07, 08, 09, 10, 11, 12, 15, 16, 17, 18, 19, 20, 21.
- Open 9: Med 4 (QC-04, 05, 23, 26), Low 5 (QC-13, 14, 22, 24, 25). High 0 · Blocker 0.

## Re-verify 2026-10-16 · 9c133152 (FE-C claims for QC-23, QC-24)

Clean worktree at `9c1331525`. QC probe at 390 and 1440. Output: `design/beta/eval/qc/9c133152/qc-23-24-probe.json`.

| Id | Result | Evidence |
|---|---|---|
| QC-23 | **verified** | Toa Payoh `kim-keat-hokkien-mee` and `hup-chong-hakka-yong-tau-foo`, both closed: the sheet shows "Before it closed: Cited by 3 sources" / "… 6 sources" (a 32 px row) on a cold deep link and on the card-click path. The closed card's own copy is display:none by class (the design: shown in the detail) (`qc-23-before-it-closed.jpg`). |
| QC-24 | **verified** | The `#rec=any` chip reads "Recognised" (aria "Remove Recognised"); under `?lang=ja` it reads "注目" ("注目を外す"). The new `#lf=1` chip reads "Local favourites" (`qc-24-chip.jpg`). |

**Register:**
- Verified 19: QC-01–03, 06–12, 15–21, 23, 24.
- Open 7: Med 3 (QC-04, 05, 26), Low 4 (QC-13, 14, 22, 25). High 0.

## Re-verify 2026-10-16 · 4aba38b3 (deploy pin; QC-26, QC-22)

Clean worktree at `4aba38b3e15c83d40aafbed5f569aa30da5a074b`. Outputs are in `design/beta/eval/qc/4aba38b3/`.

| Id | Result | Evidence |
|---|---|---|
| QC-26 | **verified** | A cold `#view=atlas&a=…&p=…` at 390 and 1440: Tokyo CYD "1 of 43" (43 shown), Cleveland DT "4 of 42" (42), New York MAN "1 of 264" (264); Next stays in the lens. Fix: PERF-08 switched off (afb09e74) plus FE-2's sheet.js fix (13b9b6f2). |
| QC-22 | **verified** | 0 built pages carry "No ratings, prices or opening hours are shown". The line now reads "We don’t add ratings, prices or opening hours of our own. Any quoted in a write-up are the source’s, dated." and is translated in ja. The footer colophon is FE-A's separate follow-up, outside this row. |
| **QC-27** (new, Low, i18n) | open | The ja line renders "ordered by tier" as 「評価順」, which reads as "rating order", and so contradicts the same sentence and the method page ("our own marks. They are not ratings"). Suggest a term for tier that is not 評価 (rating). |

**Register:**
- Verified 21: QC-01–03, 06–12, 15–24, 26.
- Open 6: Med 2 (QC-04, 05), Low 4 (QC-13, 14, 25, 27). High 0.

## Re-verify 2026-10-16 · 9fba196e (i18n claim for QC-27)

| Id | Result | Evidence |
|---|---|---|
| QC-27 | **verified** | The catalogue has 0 strings with 評価 other than 星評価. Tokyo and Cleveland `?lang=ja` (Gallery and Insights): How we choose reads 「各エリアでは、ランク順、…」; the tray reads 「ランク — エリアごとにランク付け」 and 「ガイドの順(ランク、次に出典数)」; no rendered 評価 outside 星評価. `design/beta/eval/qc/9fba196e/qc-27-ja-tier.json`. |

**Register:**
- Verified 22.
- Open 5: Med 2 (QC-04, 05), Low 3 (QC-13, 14, 25). High 0.

## Re-verify 2026-10-16 · e1503766 (FE-A claim for QC-25)

| Id | Result | Evidence |
|---|---|---|
| QC-25 | **verified** | A static scan of all 71 closed cards on the built city pages (excluding `changes/`) finds no status-source jargon after "Closed — kept for the record". Rendered: Toa Payoh `kim-keat-hokkien-mee`, Cleveland `barroco-arepa-bar` and Orlando `dinosaur` read "Closed — kept for the record, checked <date>" (`qc-25-closed-card.jpg`, `qc-25-closed-status.json`). Note: Orlando `dinosaur`'s own write-up says "kept flagged so it never reads as open". That is verbatim record prose (SPEC §1.4), not the status line, and is not filed. The "What changed" pages (FE-B) are re-checked when FE-B sends its SHA. |

**Register:**
- Verified 23.
- Open 4: Med 2 (QC-04, 05), Low 2 (QC-13, 14). High 0.

## Re-verify 2026-10-16 · e353df08 (FE-C claim for QC-05); harness P-17 follows D-43

| Id | Result | Evidence |
|---|---|---|
| QC-05 | **verified** | QC probe on `#view={gallery,atlas}&q=zzqxjv`, 5 pilots × 390 / 1440, 20 cases. Every case shows "No places match “zzqxjv”", plus "Clear search" and "Show all N". The only pressed controls are the view (and the language); no "All N" chip stays pressed. "Clear search" removes `q=` and keeps the view. Evidence: `qc-05-empty-*.json`, `qc-05-empty-gallery-390.jpg`, `qc-05-empty-atlas-1440.jpg`. |

**Harness:** P-17 now follows D-43 (ratified 2026-10-16). Records with no coordinate need "n without a verified pin";
low-confidence pins need "n approximate pin(s)". Both counts come from the JSON. QC-04 is re-run with it when FE-C
sends its SHA.

**Register:**
- Verified 24.
- Open 3: Med 1 (QC-04), Low 2 (QC-13, 14). High 0.

## Sweep S-16 (new) · edf94546 · internal editorial phrases

The orchestrator fixed 6 Orlando and DC write-ups that said "kept flagged …" (after QC's QC-25 note) and suggested a
sweep for this class, which is now **S-16**. Run: `qc.js --only sweep --vps 1440 --themes light` on `edf94546`. The first
version scanned visible text only and gave 91/91 PASS. It now also scans deferred card markup
(`noscript[data-cleo-defer]`), and the re-check finds 1:

| Id | Sev | Lane | Finding | Evidence |
|---|---|---|---|---|
| **QC-28** | Low | data (orchestrator) | Erie: a record write-up still carries the editorial phrase "… was destroyed by fire on May 2, 2017. **Kept flagged:** the site now hosts the Riverside Brewi…", the same class as the 6 fixed in Orlando and DC. The source is `beta/data/places/erie.json` and its research dataset. | `design/beta/eval/qc/edf94546/s16-recheck/qc.json` (S-16 FAIL, cities/erie.html); a static grep of `beta/**/*.html` finds 1 page. |

**Register:**
- Verified 24.
- Open 4: Med 1 (QC-04), Low 3 (QC-13, 14, 28). High 0.

## Re-verify 2026-10-16 · cc127fb1 (QC-28) · S-16 joins the pin checks

| Id | Result | Evidence |
|---|---|---|
| QC-28 | **verified** | S-16 at 1440, all 91 pages: PASS after a probe fix. The first run flagged Hokkaido for "Todo firs", a tree species (*Abies sachalinensis*); S-16 now matches TODO, FIXME and UNVERIFIED case-sensitively. A static grep of every built page finds 0 matches for "kept flagged", "worklist", "per editorial rule" or "building geocoded". Erie, Orlando and DC pass. Evidence: `design/beta/eval/qc/cc127fb1/sweep-1440/`, `s16-recheck/`. |

**Register:**
- Verified 25.
- Open 3: Med 1 (QC-04), Low 2 (QC-13, 14). High 0.

## Re-verify 2026-10-16 · 7857f885 (FE-C claim for QC-04, under D-43)

| Id | Result | Evidence |
|---|---|---|
| QC-04 | **verified** | `qc.js --only patterns --pages cleveland`, P-17 with the D-43 rule: PASS at 390 and 1440 (0 records without a coordinate; 1 low pin; the badge reads "1 approximate pin" and is on screen: x 12, y 176 on phone; x 779, y 836 on desktop). Okinawa: "195 approximate pins" matches its 195 low pins. The Cleveland card carries "Approximate pin"; the detail reads "Approximate map pin: the coordinate we hold is not yet verified to the door". Tokyo has 0 low pins and no badge. `qc-04-badge-*.json`, `qc-04-atlas-1440.jpg`. |

**Register:**
- Verified 26.
- Open 2: Low 2 (QC-13 FE-1, QC-14 designer). Med 0 · High 0 · Blocker 0.

Pending on the next pin (orchestrator): FE-B's honesty-leak fixes (712e746f, aee184d3).
- "What changed" pages, Atom feeds and `data/places/*.json` carry only a "Status source" link.
- how-we-choose carries the new m.not.p line.


## Release pre-check 2026-10-16 · `beta-deploy-r7` @ 19af6d81 (before the release SHA is cut)

The deploy pin is the release branch: 4aba38b3 plus ported fixes. The orchestrator's checklist for it is FE-B's leak checks, m.not.p in en and ja, S-16 and QC-28. Outputs are in `design/beta/eval/qc/r7-19af6d81/`. The sweep ran with `qc.js --only sweep --vps 1440` (2205 PASS · 35 FAIL · 28 WARN).

| Check | Result | Evidence |
|---|---|---|
| FE-B leaks: What changed, feeds, `data/places/*.json` | **PASS** | grep over `beta/changes`, `beta/feeds`, `beta/data/places`: 0 "verify before publish", 0 "worklist", 0 `statusSource`, 0 `UNVERIFIED`. "Status source:" appears 22 times, always followed by a URL; 11 more are the link label "Status source" with an href. |
| m.not.p (how-we-choose) en / ja | **PASS** | Browser: the en paragraph "We don’t add ratings, review counts, prices or opening hours of our own; any quoted in a write-up are the source’s, dated. …" is visible, and the ja paragraph「星評価・レビュー件数・価格・営業時間を独自に付け加えることはありません。…」 is visible under `?lang=ja`. `evidence/m-not-p-{en,ja}.jpg`. |
| QC-28 (Erie) | **PASS** | S-16 has no Erie hit. |
| S-16 | **FAIL, 4 pages** → QC-29 | orlando and washingtondc: "kept flagged" (dev fixed this in 9fa622096; not ported). statecollege and Singapore/toa-payoh: "worklist" in the raw status note printed on closed cards, 3 hits each (dev fixed this in 5d3dc9850, QC-25; not ported). |
| other sweep FAILs | known, as on dev | S-15 ×24: the search ring sits on its wrapper (harness artefact). S-08 ×6: OWNER-casing. S-01: token census. |

The orchestrator has been asked to port 9fa622096 and 5d3dc9850 into r7. Re-check them on the release SHA.

## Release pass 2026-10-16 · `beta-deploy-r7` @ 33a44d16 (QC-29 ported) · every known sweep FAIL accounted for

Outputs are in `design/beta/eval/qc/r7-33a44d16/`. The sweep ran with `qc.js --only sweep --vps 1440` and the harness at 6a93f81d: 2236 PASS · 4 FAIL · 28 WARN · 18 N/A.

| Check | Result | Evidence |
|---|---|---|
| S-16 | **PASS 91/91** → QC-29 **verified** | The orchestrator ported 9fa622096 (Orlando/DC prose) and the city-page half of 5d3dc9850. Closed cards on statecollege and toa-payoh now read "Closed — kept for the record, checked <d>". |
| FE-B leaks | **PASS** | Shipped html, xml and json, excluding `data/prov`: 0 "verify before publish", "worklist", "kept flagged", "per editorial rule", `statusSource` and `UNVERIFIED`. "Status source:" appears 132 times, always followed by a URL. |
| m.not.p en / ja | PASS on 19af6d81 (previous section) | This line wasn't touched by the port; re-confirm it on the final pin. |
| S-12 | PASS (the Cebu FAIL from the first run doesn't reproduce) | The first run read CLS 0.33 on Singapore/cebu while my probe tests ran in parallel. The clean re-run reads CLS 0. It was CPU contention and isn't filed. |

**Every sweep FAIL class from the previous runs, with where it now stands:**

| Class | Verdict | Change |
|---|---|---|
| S-15 ×24–27 "INPUT has no ring" | **The probe was wrong** | The search field draws a 2px ring on its `.spill` wrapper via `:focus-within`. It transitions in, and `keyboard()` read it before the transition ended. The probe now waits 400 ms, compares the wrapper's settled style focused and blurred, and accepts a ring that appears on focus and goes on blur. Result: 0 FAIL. Retires the "S-15 search ring on its wrapper" artefact note. |
| S-08: South Dade, Ohio Valley, Cambodia/Laos/Myanmar, Mills 50/Milk District/Audubon Park/SoDo | **The probe was wrong** (proper nouns) | Added to `QC_EXEMPT`. |
| S-08: "Theme-Park …" ×2 (Orlando), "Lakefront, River & water" (Chicago), "… Yokochō …" ×2 (Tokyo) | **The page is wrong** → **QC-30** | `tools/beta/lib/casing.js` `ownWords` keeps any capitalised word from an area name, so generic words (Park, River, Yokochō) stay capitalised mid-label. |
| S-01 token census | Partly **the probe was wrong**; the rest → **QC-31** | The probe no longer counts a `50%` radius (circles), em-relative font sizes, or box-shadows whose every colour is a `var()` token. What's left is real: 66 raw colours and 11 px radii outside `tokens.css` (cleo.css 49/5, constellation.css 5/4, fe-a.css 12/2). R7-g6 covered letter-spacing and shadow counts, not these. |
| Raw coordinate notes in `beta/data/prov/*.json` | **The data is wrong** → **QC-32** | Raised by the orchestrator; confirmed: 7 of 84 sidecars, 21 "worklist" mentions. Not shipped UI, but `data/places/*.json` links to them, so they're public open data. |

**Register:**
- Verified 27.
- Open 5: Low 5 (QC-13 FE-1, QC-14 designer, QC-30 designer + FE-A, QC-31 designer + FE-B, QC-32 FE-B). Med 0 · High 0 · Blocker 0.

## Final-pin pass 2026-10-16 · `beta-deploy-r7` @ b54b3745 (33a44d16 + QA-77 badge hit area + trip.html status-source link)

Outputs are in `design/beta/eval/qc/r7-b54b3745/`. Sweep: `qc.js --only sweep --vps 1440` (harness 6a93f81d): **2236 PASS · 4 FAIL · 28 WARN · 18 N/A**. The 4 FAILs are exactly the filed ones (S-08 on Chicago, Orlando and Tokyo → QC-30; S-01 → QC-31).

| Check | Result | Evidence |
|---|---|---|
| S-16 | **PASS 91/91** | QC-28 and QC-29 hold. |
| FE-B leaks | **PASS** | Shipped html, xml, json and js, excluding `data/prov` (QC-32): 0 "verify before publish", "worklist", "kept flagged", "per editorial rule", `statusSource` and `UNVERIFIED`. "Status source:" appears 132 times, always with a URL. trip.js now draws a closed place's status source as a link named by its host: built from escaped parts, `rel="noopener"`, only for `https?://` URLs. |
| m.not.p en / ja | **PASS** | Visible on how-we-choose in both languages. `evidence/m-not-p-{en,ja}.jpg`. |
| QA-77 tap targets | **PASS** | Every `a.rb` hit area is ≥ 44 px tall (`qc-badges.js`, `qc-sheet-badges.js`). |
| QA-77 overlap | **PASS** | With the Gallery scrolled so each card is laid out, badge hit areas overlap 0 times, with each other or with another link or button in the card. Checked on San Francisco, Tokyo, Chicago and Osaka at 390 and 1440 (46–109 badges in view per run). In the sheet (Tokyo, 3 places with 2 badges, 390 and 1440, scrolled into view), each badge is 44 px and overlaps no target. A first, whole-page pass reported overlaps between badges in *different* cards at the same coordinates. Those came from off-screen `content-visibility` cards with stale rects, and the same pass on 33a44d16 (before QA-77) showed them too. Not a finding. The sheet showed 2 overlaps until the badges were scrolled into view: that was the sticky action bar covering them, not an overlap. |
| QA-77 layout shift | **PASS** | Gallery load CLS on badge-heavy pages: 0–0.0001, and no shift sources in badge rows (`badges-page.json`). S-12 at 1440: 91/91 PASS. |

**A pre-existing finding, outside the release delta → QC-33 (Med):** opening a city page directly on **Guidebook or Insights at 1440** (`#view=guidebook`, `#view=insights`, the shareable deep links) shifts the layout by **CLS 0.42–0.53**. The shift sources are the method section and footer (`method wrap section`, `footer`), at 140–340 ms. It's the same on the dev head and on r7, it doesn't happen at 390, and Gallery and Atlas are 0. S-12 missed it because it loads only the default view; `qc-view-cls.js` covers the deep links (`evidence/qc-33-view-cls-{r7,dev}.json`). It isn't caused by QA-77 (identical on 33a44d16), so it isn't a release blocker; it goes to the next release.

**Verdict for r7:** PASS, nothing in the release delta fails.

**Register:**
- Verified 27.
- Open 6: Med 1 (QC-33), Low 5 (QC-13, 14, 30, 31, 32). High 0 · Blocker 0.

## Dev check 2026-10-16 · cceabd64 (FE-C heads-ups: the Atlas empty state from 70ddc1c9, "Status checked" as real text from 86b7558e)

Evidence is in `design/beta/eval/qc/dev-cceabd64/`.

| Check | Result | Evidence |
|---|---|---|
| QC-05 under FE-1's single Atlas empty state | **holds** | `#view=<v>&q=zzqxjv` on Tokyo, Cleveland and New York at 390 and 1440. Gallery: "No places match “…”" + Show all N, and the way out restores the cards. Atlas 1440: `.ms-head` "No places match “…”" + Clear search + Show all N; Clear search returns the map list ("450 places here"). Atlas 390: the peek tray says "No places match · Show the list"; following it shows the same head, and Clear search works. Guidebook: summary line "0 of all N places match this lens." + Show all N. |
| Harness S-05 | **widened** (not weakened) | The empty-state probe now runs in each of Gallery, Atlas and Guidebook, not only the default view. It reads the Guidebook's "0 of all N places match" line and follows Atlas's phone "Show the list" step before looking for the way out. Pilots pass in every view (Tokyo, Cleveland × 390/1440). |
| W9-2 "Status checked <d Mon>" as real text | **OK** | Tokyo: 61 `.pl-chk` elements, all `[data-nosearch]`, and the text is in the card's `innerText`. Search: "status checked" → "No places match"; "checked" → 1, "Oct" → 6, "2026" → 40 cards. Every match is explained by the card's other text: 0 cards matched only through the date line. The sweep at 1440 on 3 pages shows no new S-08, S-16 or S-06 hits from the line. |
| Guidebook Contents under a lens | **FAIL** → **QC-34** | Contents keeps the chapter totals whatever the lens. `q=ramen`: the summary says "34 of all 488 places match" and the body shows 34, but Contents lists Chiyoda-ku 43 / Chūō-ku 49 / Minato-ku 54 while those chapters show 1 / 2 / 1. `a=CHUO`: Contents still lists every ward at full count, though only Chūō-ku is shown. `q=zzqxjv`: 0 match, Contents unchanged. Cause: `client/guidebook.js:153` writes `lst.length` once, at build. The same code is on r7 (b54b3745) and 4aba38b3, so it's pre-existing. `qc-34-guidebook-contents-1440.jpg`. |

## S-17 (new) · overlay and chrome probe (owner directive 2026-10-16) · first finding

S-17 is `tools/beta/qa/qc-overlay.js` (9a2a10c8). It measures the ledger's §1–6 (`docs/BETA-OVERLAY-LEDGER.md`, which QC keeps). The method is in the file header: an 8 px point grid classified by the topmost element, at load, during a pan or scroll, and at idle. Every page × view × 6 viewports × light/dark is 5,172 runs per SHA. qc.js runs S-17 on the default view in every sweep. The full audits of r7 b54b3745 and dev are running; their ledger rows (OV-08+) follow.

**QC-35 (Med, Atlas FE-1)**, found in the Punggol test on dev 9a2a10c8: the phone Atlas peek tray renders "17places here ·checked 3 Oct· Show list". Rev 5a's `.ms-toggle>span{display:flex}` (648aa9c3) makes the count, the new `.ms-chk` date (dfd5e652) and the text flex items, and the whitespace between them collapses. r7 shows "17 places here · Show list". Evidence: `design/beta/eval/qc/overlay/qc-35-tray-{dev,r7}.png`.

## S-17 audit · live r7 (`beta-deploy-r7` @ b54b3745) · graded against OV-00 (bb2af873)

`qc-overlay.js --root <r7 worktree>` covered every page × view × 6 viewports × light/dark: 5,172 runs, 0 errors, 128 failing groups. Outputs are in `design/beta/eval/qc/overlay/r7-b54b3745/` (`summary.md`, `groups.json`, `s17.json.gz`, 128 shots of the worst run per group). Ledger rows OV-101 to OV-123 come from `qc-overlay-ledger.js --label r7-b54b3745 --skip controlCollision`: 23 rows, 16 High and 7 Med.

| Metric (r7, all pages) | median / p90 / max | Budget (P1 phone) |
|---|---|---|
| Atlas chrome at rest, % of height | 28.6 / 59.4 / 59.4 (landscape 59 %) | ≤ 25 (L ≤ 13) |
| Atlas clear map, % of viewport, labels excluded | 58.5 / 75.9 / 75.9 | ≥ 72 |
| Atlas label coverage, % of map | 9.5 / 22.7 / 36.6 | ≤ 8 |
| Atlas widest label, % of map width | 38.9 / 65.3 / 84.2 | ≤ 40 |
| Sheet chrome at rest | 27.7 / 41.1 / 60.7 | ≤ 13 |

Notes on the method:
- **Control collisions are not in these rows.** The r7 run counted the bounding box of an inline link that wraps (a photo credit in the sheet) as a collision. The probe now tests collisions per line box (`getClientRects`); collisions are re-measured on dev and in a re-run of r7.
- **The grader treats rule budgets ("collapses to ⓘ … after 5 s") as rules, Med**, not as numbers.
- **The live-site worst cases match the owner's screenshot:**
  - Atlas chrome is 28.6 % on P1, 36.1 % on P2 and 59.4 % in landscape;
  - nothing hides during a pan (all 168 Atlas runs per viewport);
  - the map credit stays 170 px wide on phones and 458 px on desktop after a pan;
  - the widest label is up to 84 % of the map width.
- **Not seen on r7: QA-80 / OV-100** (the landscape switch under the header) is a dev-only regression. S-17's new `controlCovered` check reproduces it on dev.
- `npm test` under the audit's CPU load failed twice in test-fe-a, on different assertions each time (search, view switch). Alone on a quiet machine it passes 133/133. That's load-sensitive timing, not a regression.

## Overlay ledger re-verify · dev c14306d9 (contains 399119259) · claimed rows

`tools/beta/qa/qc-ov-verify.js` runs one targeted check per claim, measuring exactly what the claim says; chrome shares use S-17's MEASURE. Evidence is in `design/beta/eval/qc/overlay/verify-c14306d9/`.

**Verified:**
- OV-08: share card wholly on screen, 9:16, no scroll at 4 viewports.
- OV-09: FE-A part; at 1024 the sheet covers 0 px² of the map and the selected pin is visible.
- OV-11: the 844×390 sheet owns the top band.
- OV-30: the Contents strip is not covered.
- OV-31, OV-32: landscape Guidebook and Insights at 12.5 %, at rest and after a scroll.
- OV-33: no Map pill.
- OV-34: no Gallery toolbar in the reading views.
- OV-35: L 12.5 %; P1 5.7 % after a scroll.
- OV-36: the strip is away after a scroll (5.7 / 7.2 / 4.7 %).
- OV-40: the toast is clear of the sheet's action bar at 6 viewports. Left over: at 1440 it sits over "Clear my base" for up to 4 s.

**Back to open:**
- **OV-01:** a pan doesn't reach `Cleo.chrome.compact` (FE-1's hook is missing). Called by hand, `compact()` hides the switch, but its 52 px band stays as an empty dark strip, so chrome is 31.3 % → 31.3 %.
- **OV-12:** the base note is 117 px on phone, against ≤ 100.

**QC-35 verified** (the tray reads "17 places here · checked 3 Oct · Show list").

Ledger format: FE-C's OV-12 and OV-40 edits had dropped the Severity cell, which is now restored (OV-12 Low, OV-40 High). A "Format" note in the ledger says every row keeps 7 cells.

**Addendum on c24dd319** (contains FE-1's f2babf91):
- **OV-01** is now verified: chrome during a pan is 7.2 % (P2) and 5.7 % (P1), with the switch hidden; at rest it is 31.3 / 24.8 %.
- **OV-02** verified: "Search this area" is absent at load, offered after a pan 8 px under the bar and centred, and gone on the next move.
- **OV-05** verified: the credit is 174 px at load and 34 px after a pan.
- **OV-06** verified: the chip row has a mask fade.
- **OV-07** verified: chrome is back at idle and the map never resizes.

`qc-ov-verify.js` gained these checks. The full dev S-17 audit runs on c24dd319.

## S-17 rulings and probe fixes (2026-10-17)

The probe header in `tools/beta/qa/qc-overlay.js` is S-17's README, and every ruling is encoded there.

**OV-03 label coverage: painted pill, not tap area** (orchestrator ruling 12:18Z). A tap area drawn as a pseudo-element hit-tests to its host span. So a label point must also fall inside the painted element's own box; tap-area points count as pin. Hand checks on c8ec49d8:

| Page and viewport | Label coverage | Labels | Widest |
|---|---|---|---|
| New York 844×390 dark | 6.5 % (was 10.4 %); matches FE-2's painted 6.5 % | 4 | 242 px = 28.7 % |
| Youngstown 844×390 light | 6.2 % | 3 | 36.5 % |
| Youngstown 390×844 light | 7.1 % | 6 | 39.7 % |

The tap area stays under B-07 and the collision checks.

**Probe fixes this session, each found in a reading that didn't add up:**
- **Escaping:** MEASURE runs as a template-literal body, so `\(`, `\b` and `\s` collapsed. The transparent test dropped every label (count, width and gap passed vacuously on the 8984b094 partial, now annotated); the "clear" exclusion never applied. Now there are no escapes, and alpha is parsed numerically.
- **Scrolling panes:** a pane that scrolls on its own is content on a non-scrolling page. This was the desktop Atlas list column, raised by FE-1: T2 now reads 14.1 %, not 16.7–18.8 %.
- **Row sampling:** rows every 4 px, so band edges are exact.
- **Drag start:** the pan drag starts on free map and retries if the map doesn't move. A press inside a canvas dot's tap tolerance selects instead of panning; that's reported as dragFromDot on 8 pages.

## Round 4 follow-ups (2026-10-17)

**FE-A 768 header (31cc58b79, head 7de1297bd) verified.** S-17 re-grade of the 7 pages flagged on round 4 (Harrisburg, Marine Parade, Potong Pasir–MacPherson, Upper Thomson, Akron, Jalan Besar, Queenstown) at T1 768×1024 and L 844×390, light and dark, Atlas plus the cold default: 0 of 56 runs flag. OV-124 (日本語 covered) and OV-125 (日本語 over the switch) are verified. Evidence: `design/beta/eval/qc/overlay/fe-a-768-7de1297b/`.

**QC-36 (Low, Atlas FE-1 + the PERF-24b test owner): the Atlas lens count line rewrites itself after the map settles, and `test-count-lines.js` races it.** On `view=atlas&t=1` (Tokyo, Must see) the list head first reads "177 of all 488 places · Top ranked" (the lens branch, `atl.c.of`) and changes to "177 places here, of all 488 · Top ranked" (`atl.c.here.of`) once the map reports its area. The test reads `.ms-count` once and expects the second form. Measured on d261b11aa: 1 pass and 2 fails in 3 runs while an S-17 audit loads the CPU. On 7de1297bd: 1 pass and 1 fail. Atlas JS is unchanged between the two heads, so this is a race, not a regression. Two things follow. (1) The reader sees the line change wording under them on a slow device, the same count in two phrasings. (2) `npm test` is red whenever the box is busy. Proposed fix (owners decide): render one phrasing from the first paint, or have the test wait for the map's first idle. QC does not edit the test and does not weaken it.

**Round-4 views S-17 (75bb37bb), complete.** 4,128 runs: 98 pages × 6 viewports × light/dark × sheet, Gallery, Guidebook, Insights and the shell pages. 0 errors. Only one group fails: search ×2, the "Search all guides" control next to the page's own search, on the Hanoi and Hoi An hubs, trip.html and changes/singapore--punggol at T1, T2 and D (16 of 96 runs). That is OV-123 (Med, FE-B with FE-A and the designer), still open. Not reproduced and now verified on 75bb37bb: OV-107–110 (FE-B reading-view chrome and the Contents strip), OV-113/114 (FE-A Gallery switch row), OV-115–117 (search ×2 in the Gallery, Guidebook and Insights views). Verified earlier this round: OV-111/112 and OV-121/122. Evidence: `design/beta/eval/qc/overlay/r4-75bb37bb-views/`.
