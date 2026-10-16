# Evaluation round 8: independent evaluator

> 2026-10-16 · evaluator lane (no build lane)
>
> **Measured:** R8 is the deployed beta at `b54b3745` (live since 2026-10-16 21:34Z through PR alvations/cleo-guide#9,
> merge `4382a187`, same tree). It is the R7 fix round:
> - 598 credited Wikimedia Commons photos (R7: 131) and heroes on 76 of 84 guides;
> - a fixed desktop sheet (scrim, centred, never upscaled) and corrected "No. N of M";
> - "Start with" consistent on every guide;
> - two more motion moments;
> - Insights on muted hues, tabular figures on every Guidebook and Insights number, and 0 raw letter-spacings;
> - an AI-reviewed Japanese interface, labelled as such (D-41);
> - dated labels on quoted prices, ratings and hours (D-39, D-42);
> - closure sources on closed places;
> - recognition badges;
> - lighter phone photos.
>
> **Gates:** in a detached worktree at `b54b3745`, `npm run validate`, `npm test` (all suites) and `npm run beta:check`
> are green: 180 pages, 84 place pages, 8,702 places, beta == live. Nothing after `b54b3745` is scored here.
>
> **Baseline:** R7 at `badcc20d`, scored 88.5 in [ROUND-7](ROUND-7.md).
>
> **Rubric:** unchanged since ROUND-1:
> - the same four dimensions and weights;
> - the same A and B sub-criteria;
> - the same 35-row feature table for C;
> - the same D strengths;
> - the Typography & style sub-scorecard inside A;
> - the 13-row design-conformance checklist ([ROUNDS-6-9](ROUNDS-6-9.md)).

## Verdict

R8 scores **90.7 / 100** (R7 88.5, **+2.2**): A 87, B 92, C 97, D 90.

- **A gains +4.** Photographs moved from a first slice to most of the front door:
  - heroes on 76 of 84 guides (R7 32), and every guide without one is in Vietnam (excluded by rule) except three
    Singapore towns;
  - 517 place photos across 62 guides (R7 94 across 5);
  - 435 of 980 eligible tier-1 sights (44 %) carry a photo.

  The R7 polish list is mostly closed: the desktop sheet, "No. N of M", "Start with", the carousel credit and the
  Insights palette. Two more motion moments landed: photos fade in from their own colour, and the switcher thumb slides
  as the content fades. What holds A back:
  - food-led first rows are still sand boxes;
  - the top bar on the landing page and hubs is still 96 % opaque, so content ghosts through it;
  - every phone masthead breaks "last / checked";
  - the desktop Atlas header is crushed;
  - cards now stack four lines of meta.
- **B gains +1.** Fixed since R7:
  - the floating pill no longer covers titles (B-08: 80 failing pages → 0);
  - the hero no longer pushes the masthead past 0.6 of the screen (B-02: 20 → 4);
  - every hub shows city cards on its first screen (B-05: 7 → 0);
  - a desktop pin click lights a card that is rendered and in view (8/8);
  - the desktop deep link no longer scrolls;
  - a closed place no longer offers Directions;
  - the Tokyo phone first load fell from 940 to 621 KB.

  New since R7:
  - axe finds a serious contrast failure on the Vietnamese sheet (8 nodes in 4 runs; R7 0);
  - B-20 fails on 31 "What changed" pages (17 px "Status source" links);
  - B-03 now counts 16 controls above the first card, over its limit of 14;
  - Tokyo desktop's DOM is 3,074 against 3,000 (waived by D-45, still a miss).
- **C gains +1.** Row 4 returns to ✅: 76 guides now look local through their hero. Row 30 stays ◐: the Japanese interface
  ships and works, but it is AI-reviewed, not human-reviewed. Row 6 stays ◐ (15 % of eligible places).
- **D gains +1**, from closure honesty (sourced closures, "Where it was" instead of Directions, a status date on every
  card) and from the dated labels on quoted prices, ratings and hours.
- **Typography & style: 250 / 300** (R7 241). 3 of 30 items are below 8 (R7: 7).
- **Conformance: ✅ 6 · ◐ 7 · ✕ 0.** The statuses match R7, but several ◐ rows are much closer to ✅ (see the table).
- **Owner-blocked: about 0.4 overall points.** That is a human review of the Japanese interface and the Unsplash top-up.
  The price/rating call is no longer owner-blocked: D-39 and D-42 decided it, and it ships. The team can still earn
  about **2.5 points** through the gaps below.

## Scorecard

| Dimension (weight) | R6 `2f227631` | R7 `badcc20d` | **R8 `b54b3745`** | Δ R7→R8 |
|---|---:|---:|---:|---:|
| A. Look & feel (40 %) | 77 | 83 | **87** | +4 |
| B. UX & ergonomics (25 %) | 88 | 91 | **92** | +1 |
| C. Competitor feature coverage (20 %) | 96 | 96 | **97** | +1 |
| D. Unique strengths (15 %) | 89 | 89 | **90** | +1 |
| **Overall (weighted)** | **85.4** | **88.5** | **90.7** | **+2.2** |

R8 = 0.4×87 + 0.25×92 + 0.2×97 + 0.15×90 = 34.8 + 23.0 + 19.4 + 13.5 = **90.70**.

## Method

The method is ROUND-7's, re-pointed at `b54b3745` through the kit in [`r8/README.md`](r8/README.md).

1. **Gates.** In a detached worktree at `b54b3745`, I ran `npm install --no-audit --no-fund`, then `npm run validate`,
   `npm test` and `npm run beta:check`. Results: `DATA OK`, `ALL SUITES PASS` (including `check-google.py`,
   `test-honesty.js`, the CSS `:has()` guard and the offline-pack probe) and `180 pages, 84 place pages indexed, 8702
   places (beta == live)`.
2. **Servers.** R8 ran on port 8811 and R7 (`badcc20d`) on port 8812.
3. **Screenshots.** I used R7's harness unchanged: [`r7/tools/shots-r7.js`](r7/tools/shots-r7.js) and
   [`shots-extra.js`](r7/tools/shots-extra.js).
   - Settings: 390×844 @2× touch and 1440×900, light and dark, reduced motion, the same 4 saved refs.
   - Every off-origin request is aborted, and tile requests get a flat stub tile. **A blank map ground is a sandbox
     artefact**, not the product's map styling.
   - Both rounds: 114 flows, 0 page errors, 0 failed flows ([`r8/shots-r8-log.json`](r8/shots-r8-log.json),
     [`r8/shots-r7-log.json`](r8/shots-r7-log.json)).
   - Composites from [`r8/tools/pair.py`](r8/tools/pair.py), labelled R7 `badcc20d` | R8 `b54b3745`.
4. **Metrics.** `npm run beta:metrics:all` on all 180 pages, run alone:
   [`r8/beta-metrics-all-r8.md`](r8/beta-metrics-all-r8.md), with per-row failure counts in
   [`r8/metrics-fail-tally-r8.txt`](r8/metrics-fail-tally-r8.txt).
   - **Budget figures:** Tokyo ×3 in the default view and ×2 with `--view atlas`, idle, after the sweep
     ([`r8/budgets-r8.md`](r8/budgets-r8.md)).
   - **Harness rows:** QA re-pointed B-07 to the map-search DOM. It now passes on 81 of 84 pages (R7: 0, stale).
     B-06 and B-09 still report ❌ in the default-view sweep, because Gallery has no split map. With `--view atlas`
     both pass: split true, map 64 %, hover→pin and pin→card true, 16 named pins, ordering stated
     ([`r8/metrics-tokyo-atlas-r8.json`](r8/metrics-tokyo-atlas-r8.json)). I score the Atlas run.
5. **Probes.**
   - **R7's evaluator probes, re-run unchanged:**
     - `probe-atlas-r7.js` → [`r8/atlas-probe-r8.json`](r8/atlas-probe-r8.json);
     - `probe-pin2card.js` → [`r8/pin2card-r8.txt`](r8/pin2card-r8.txt);
     - `probe-day.js` → [`r8/day-r8.txt`](r8/day-r8.txt), [`r8/day-atlas-m-r8.jpg`](r8/day-atlas-m-r8.jpg);
     - `probe-axe.js`, axe-core 4.10.2 on 20 pages × 2 viewports × light and dark = 80 runs →
       [`r8/axe-r8.json`](r8/axe-r8.json), [`r8/axe-summary-r8.txt`](r8/axe-summary-r8.txt);
     - `probe-type.js` → [`r8/type-census-r8.json`](r8/type-census-r8.json);
     - `probe-css.py` → [`r8/css-census-r8.json`](r8/css-census-r8.json);
     - `probe-transfer.js` → [`r8/transfer-by-resource-r8.txt`](r8/transfer-by-resource-r8.txt). Its labels are
       hard-coded: "R7" there means port 8811 (R8) and "R6" means port 8812 (R7). The file says so.
     - `probe-body.js` → [`r8/body-r8.txt`](r8/body-r8.txt).
   - **New, in [`tools/`](tools/):**
     - [`probe-r8.js`](tools/probe-r8.js) → [`r8/probe-r8.json`](r8/probe-r8.json). It measures each R7 polish
       defect (top and tab bar opacity, credit overflow, placeholder fit, photo upscale ratio, header wrap and
       truncation), the sheet (scrim, centring, close button vs the switcher, upscale, "No. N of M"), the phone Atlas
       ("last checked" on the first screen), the desktop Atlas (map share, deep-link scroll, rail reachability) and the
       Japanese switch.
     - [`probe-axe-vn-r8.js`](tools/probe-axe-vn-r8.js): contrast detail for the one axe finding.
   - **Static counts:**
     - photo coverage, from `CREDITS.json` against `manifest.json` and the place data
       ([`r8/photo-coverage-r8.txt`](r8/photo-coverage-r8.txt));
     - "Start with" link vs the Gallery lead on all 84 guides (`data/gallery/*.json`).

   No web research and no WebFetch. I read `style/v2/DECISION.md` as claims; it is unchanged since R7. I read
   `BETA-DECISIONS.md` D-39 and D-41 to D-45 as product context, not as scores.

## Side-by-side (R7 → R8)

Composites are labelled R7 `badcc20d` | R8 `b54b3745`. A URL with no `view=` opens Gallery in both rounds.

| Page | Mobile 390×844 | Desktop 1440×900 |
|---|---|---|
| Landing | ![](r8/landing-m-r7-r8.jpg) | ![](r8/landing-d-r7-r8.jpg) |
| Country hub (Japan) | ![](r8/japan-m-r7-r8.jpg) | ![](r8/japan-d-r7-r8.jpg) |
| Tokyo (default: Gallery) · cover grid | ![](r8/tokyo-m-r7-r8.jpg) · ![](r8/tokyo-gallery-p2-m-r7-r8.jpg) | ![](r8/tokyo-d-r7-r8.jpg) · ![](r8/tokyo-gallery-p2-d-r7-r8.jpg) |
| Tokyo · Gallery · Guidebook · Insights | ![](r8/tokyo-gallery-m-r7-r8.jpg) · ![](r8/tokyo-guidebook-m-r7-r8.jpg) · ![](r8/tokyo-insights-m-r7-r8.jpg) | ![](r8/tokyo-gallery-d-r7-r8.jpg) · ![](r8/tokyo-guidebook-d-r7-r8.jpg) · ![](r8/tokyo-insights-d-r7-r8.jpg) |
| **Tokyo · Atlas (map-search)** | ![](r8/tokyo-atlas-m-r7-r8.jpg) | ![](r8/tokyo-atlas-d-r7-r8.jpg) |
| Atlas List toggle | ![](r8/atlas-list-m-r7-r8.jpg) | ![](r8/atlas-list-d-r7-r8.jpg) |
| Atlas pin → carousel (phone) · pin → preview → detail (desktop) | ![](r8/tokyo-atlas-pin-m-r7-r8.jpg) · ![](r8/cle-atlas-pin-m-r7-r8.jpg) | ![](r8/tokyo-atlas-pin-d-r7-r8.jpg) · ![](r8/tokyo-atlas-detail-d-r7-r8.jpg) · ![](r8/cle-atlas-pin-d-r7-r8.jpg) |
| Atlas deep link `#view=atlas&p=kanda-myojin` | ![](r8/atlas-place-m-r7-r8.jpg) | ![](r8/atlas-place-d-r7-r8.jpg) |
| Atlas · Must see / Top picks | ![](r8/atlas-must-m-r7-r8.jpg) | ![](r8/atlas-must-d-r7-r8.jpg) |
| Day route on the phone Atlas (R8) · day plan | ![](r8/day-atlas-m-r8.jpg) · ![](r8/day-m-r7-r8.jpg) | ![](r8/day-d-r7-r8.jpg) |
| Map from the Gallery · switcher → Atlas | ![](r8/map-m-r7-r8.jpg) · ![](r8/switch-m-r7-r8.jpg) | ![](r8/map-d-r7-r8.jpg) · ![](r8/switch-d-r7-r8.jpg) |
| Cleveland · its four views | ![](r8/cleveland-m-r7-r8.jpg) · ![](r8/cle-gallery-m-r7-r8.jpg) · ![](r8/cle-atlas-m-r7-r8.jpg) · ![](r8/cle-guidebook-m-r7-r8.jpg) · ![](r8/cle-insights-m-r7-r8.jpg) | ![](r8/cleveland-d-r7-r8.jpg) · ![](r8/cle-gallery-d-r7-r8.jpg) · ![](r8/cle-atlas-d-r7-r8.jpg) · ![](r8/cle-guidebook-d-r7-r8.jpg) · ![](r8/cle-insights-d-r7-r8.jpg) |
| New York · its four views | ![](r8/newyork-m-r7-r8.jpg) · ![](r8/ny-gallery-m-r7-r8.jpg) · ![](r8/ny-atlas-m-r7-r8.jpg) · ![](r8/ny-guidebook-m-r7-r8.jpg) · ![](r8/ny-insights-m-r7-r8.jpg) | ![](r8/newyork-d-r7-r8.jpg) · ![](r8/ny-gallery-d-r7-r8.jpg) · ![](r8/ny-atlas-d-r7-r8.jpg) · ![](r8/ny-guidebook-d-r7-r8.jpg) · ![](r8/ny-insights-d-r7-r8.jpg) |
| Chinatown & CBD · its four views | ![](r8/chinatown-m-r7-r8.jpg) · ![](r8/chinatown-gallery-m-r7-r8.jpg) · ![](r8/chinatown-atlas-m-r7-r8.jpg) · ![](r8/chinatown-guidebook-m-r7-r8.jpg) · ![](r8/chinatown-insights-m-r7-r8.jpg) | ![](r8/chinatown-d-r7-r8.jpg) · ![](r8/chinatown-gallery-d-r7-r8.jpg) · ![](r8/chinatown-atlas-d-r7-r8.jpg) · ![](r8/chinatown-guidebook-d-r7-r8.jpg) · ![](r8/chinatown-insights-d-r7-r8.jpg) |
| Wheeling · its four views | ![](r8/wheeling-m-r7-r8.jpg) · ![](r8/wheeling-gallery-m-r7-r8.jpg) · ![](r8/wheeling-atlas-m-r7-r8.jpg) · ![](r8/wheeling-guidebook-m-r7-r8.jpg) · ![](r8/wheeling-insights-m-r7-r8.jpg) | ![](r8/wheeling-d-r7-r8.jpg) · ![](r8/wheeling-gallery-d-r7-r8.jpg) · ![](r8/wheeling-atlas-d-r7-r8.jpg) · ![](r8/wheeling-guidebook-d-r7-r8.jpg) · ![](r8/wheeling-insights-d-r7-r8.jpg) |
| **Place detail** (Kanda Myōjin) · from a Gallery link · Cleveland | ![](r8/sheet-m-r7-r8.jpg) · ![](r8/galsheet-m-r7-r8.jpg) · ![](r8/sheet-cle-m-r7-r8.jpg) | ![](r8/sheet-d-r7-r8.jpg) · ![](r8/galsheet-d-r7-r8.jpg) · ![](r8/sheet-cle-d-r7-r8.jpg) |
| Vietnamese sheet · closed place (Lolly the Trolley) | ![](r8/sheet-vn-m-r7-r8.jpg) · ![](r8/sheet-closed-m-r7-r8.jpg) | ![](r8/sheet-vn-d-r7-r8.jpg) · ![](r8/sheet-closed-d-r7-r8.jpg) |
| Saved · What changed | ![](r8/saved-m-r7-r8.jpg) · ![](r8/changes-m-r7-r8.jpg) | ![](r8/saved-d-r7-r8.jpg) · ![](r8/changes-d-r7-r8.jpg) |
| Dark: landing · hub · Gallery · Atlas · Insights · sheet · New York | ![](r8/landing-night-m-r7-r8.jpg) · ![](r8/japan-night-m-r7-r8.jpg) · ![](r8/tokyo-gallery-night-m-r7-r8.jpg) · ![](r8/tokyo-atlas-night-m-r7-r8.jpg) · ![](r8/tokyo-insights-night-m-r7-r8.jpg) · ![](r8/sheet-night-m-r7-r8.jpg) · ![](r8/ny-gallery-night-m-r7-r8.jpg) | ![](r8/landing-night-d-r7-r8.jpg) · ![](r8/japan-night-d-r7-r8.jpg) · ![](r8/tokyo-gallery-night-d-r7-r8.jpg) · ![](r8/tokyo-atlas-night-d-r7-r8.jpg) · ![](r8/tokyo-insights-night-d-r7-r8.jpg) · ![](r8/sheet-night-d-r7-r8.jpg) · ![](r8/ny-gallery-night-d-r7-r8.jpg) |

## Key measurements (R7 → R8)

| Measure | R7 `badcc20d` | R8 `b54b3745` | Source |
|---|---|---|---|
| Photographs (credited, Commons, CC0/PD/CC BY/CC BY-SA) | 131 | **598** (81 hero/hub slots + 517 places) | `CREDITS.json` |
| Guides with a hero photo | 32 / 84 | **76 / 84**. The 8 without: the 5 Vietnam guides (3 under `Vietnam/`, Hanoi and Hoi An under `Singapore/`), excluded by the FoP rule, and **3 Singapore towns with no stated reason** (Dempsey Hill, Jalan Besar, Queenstown) | built pages |
| Guides with any place photo | 5 | **62** | `CREDITS.json` |
| Eligible places with a photo | 74 / 2,901 (2.6 %) | **447 / 2,901 (15.4 %)** | `manifest.json` ∩ `CREDITS.json` |
| Eligible tier-1 sights with a photo | — | **435 / 980 (44 %)**; all open tier-1 sights: 503 / 1,326 (38 %) | place data |
| "Start with" link = Gallery lead card | 61 / 84 (Cleveland: Larder vs Slyman's) | **84 / 84** | `data/gallery/*.json` vs the built link |
| "No. N of M in area" | "42 of 25", "3 of 24" | **"42 of 42", "3 of 43"** | `probe-r8.json`, shots |
| Desktop sheet | off-centre, no scrim, upscaled photo, close over the switcher | **centred (180 px each side), scrim rgba(28,25,23,0.4), photo 960 CSS px from a 1,024 px source, close clear** | `probe-r8.json` |
| Closed place, primary action | Directions | **"Where it was"** (secondary style) and a closure source link | `sheet-closed-m` |
| Top bar opacity | 96 % everywhere | **100 % on city pages; still 96 % on the landing page and hubs** (content ghosts, `landing-d` scrolled) | `probe-r8.json` |
| Phone masthead stat line | "· 1 closed" orphan | **"last / checked 2026-10-16" breaks on every phone masthead**; the dek line starts with "·" ("· Edo-Tokyo Museum") | shots |
| Desktop Atlas header (1440) | one line | **"field / guides" and "How we / choose" wrap; the crumb truncates to "To…"** | `tokyo-atlas-d` |
| Desktop Atlas | 60 % map, deep link scrolls 104 px, outer pin → unrendered card | **64 % map; deep link scrollY 0, no band; pin → card rendered and in view 8/8** | `atlas-probe-r8.json`, `pin2card-r8.txt` |
| Phone Atlas pins | 26 px pills, clusters | **32 px named pills** (8 per screen) and **18 px dots** for the rest; no clusters | `atlas-probe-r8.json`, `day-r8.txt` |
| "Last checked" on the phone Atlas first screen | 0 | **0** (a status date shows on each carousel card after a tap) | `atlas-probe-r8.json` |
| Desktop Atlas: For you / Your day / Near me | off-screen | **still off-screen** (all three "not in view") | `atlas-probe-r8.json` |
| axe serious/critical (80 runs) | 0 | **8 nodes in 4 runs**: Vietnamese sheet, "Read what Wikipedia says", #68615b on #1c1917 = 2.87:1 at 13 px (light and dark, phone and desktop). Moderate: `landmark-contentinfo-is-top-level` ×8 (R7: `aria-allowed-role` ×56, `heading-order` ×24) | `axe-summary-r8.txt`, `probe-axe-vn-r8.js` |
| B-23 contrast AA (metrics) | 0 / 179 fail | **0 / 180 fail** | metrics |
| B-20 targets < 44 px (phone) | 9 place pages | **0 place pages; 31 "What changed" pages** ("Status source" links 91×17 px) | metrics |
| B-08 floaters over titles | 80 pages | **0** | metrics |
| B-02 / B-04 / B-05 | 20 / 9 / 7 pages | **4 / 0 / 0** | metrics |
| B-03 controls above first card ≤ 14 | 0 pages | **76 pages (16 controls)** | metrics |
| Numeric elements in tabular figures | 477 / 699 (68 %) | **791 / 807 (98 %)**; Guidebook 70/71, Insights 101/101 | `type-census-r8.json` |
| Rendered weights · steps 12–17 px per page | 400–700 · 3–6 | 400–700 · **3–5** | `type-census-r8.json` |
| CSS raw letter-spacing / shadow / radius / line-height (distinct) | 16 / 28 / 2 / 17 | **0 / 7 / 4 / 16** | `css-census-r8.json` |
| CSS bytes (raw) | 444 KB | **427 KB** | `css-census-r8.json` |
| Insights bars | saturated blue/orange/green/yellow/pink | **muted earth hues** (slate, rust, teal, ochre, plum) | `tokyo-insights-d` |
| Motion | the grow (340 ms) and a heart pop | **+ photo fade from its dominant colour (280 ms) + switcher thumb slide and content fade (240 ms)**; 0 animations and 0 view transitions under reduced motion on phone and desktop | `motion-r8.json`, `fe-a.css` §19 |
| Second locale | none | **Japanese interface, 703 strings, switcher in the header, visible "machine-translated and checked by a second AI review" note; `reviewed: false`** | `probe-r8.json` (locale), `assets/i18n/ja.json` |
| Quoted price/rating/hours prose | undecided | **labelled "quoted from the source at the time of research (<date>)"** (D-39, D-42) | `sheet.js`, `guidebook.js` |
| Tokyo default first load (desktop · phone @3×) | 652 · 940 KB | **661 · 621 KB** | budgets |
| Tokyo default FCP at 4× | 340 ms (median of 3) | **456 ms** (median of 3: 292–512) | budgets |
| Tokyo Atlas first load (desktop · phone) | 612 · 1,020 KB | **628 · 616 KB** | budgets |
| Tokyo desktop DOM | 2,855 | **3,074** (budget 3,000; waived by D-45) | budgets |
| Whole beta: first load ≤ 2.0 MB · FCP 4× ≤ 1 s | 179/179 · 179/179 | **180/180 · 180/180** (largest 883 KB; slowest 656 ms) | metrics |
| Phone card photos (3×) | 960w for small slots (heavy) | **500w drawn into 289 CSS px slots: ≈ 1.7× upscaled** (D-40a caps `sizes` at 166 px) | `probe-r8.json` |
| JS errors on the captured flows | 0 | 0 | shots logs |

## Typography & style sub-scorecard (inside A)

The same 30 items as R6 and R7. **R7** is my R7 score; **R8** is this round's.

| Area | # | Item | R7 | **R8** | Evidence (R8) |
|---|---|---|---:|---:|---|
| Faces | T1 | Display legibility, 15–24 px | 9 | **9** | Unchanged and crisp; macrons correct in both faces (`sheet-m`). |
| | T2 | Display character, luxury × fun | 8 | **8** | Unchanged voice. |
| | T3 | UI legibility, 12–16 px | 9 | **9** | Inter on every UI sample (CDP). |
| | T4 | UI weights, hierarchy, numbers | 8 | **9** | 400/500/600/700 only. **Tabular figures on 98 % of numeric elements** (791/807), including Guidebook facts (70/71) and Insights (101/101). |
| | T5 | Diacritics | 9 | **9** | "Việt Nam Quốc Tự" in Bricolage ×16, UI Inter ×26. |
| | T6 | CJK fallback | 8 | **8** | IPAGothic fallback, now also for the 日本語 switch label. |
| | T7 | Weight / optical-size range | 7 | **7** | Still a single opsz-72 cut, also at 16–22 px. |
| | T8 | File weight | 9 | **9** | 65–88 KB of woff2 per page. |
| Scale & rhythm | S1 | Type-scale discipline | 8 | **8** | 3–5 steps in the 12–17 px band per page (R7 3–6); 2 distinct raw font sizes. |
| | S2 | Line-height and measure | 6 | **6** | The R6/R7 widows changed shape but did not go: "last / checked 2026-10-16" breaks on every phone masthead (Tokyo, Cleveland, Wheeling, Chinatown); the dek line starts with "· Edo-Tokyo Museum"; desktop "status- / checked". 16 distinct raw line-heights. |
| | S3 | Letter-spacing and uppercase | 6 | **8** | **0 raw letter-spacings** (R7 16 distinct); the uppercase eyebrow is now sentence case ("Sourced city guides"). |
| Colour & skins | C1 | Colour, light | 9 | **9** | Unchanged; 0/180 B-23 failures. One axe contrast failure on a sheet button (B-side). |
| | C2 | Colour, night | 9 | **9** | Unchanged (`*-night`). |
| | C3 | Per-city skins | 7 | **8** | Skins stay retired, but 76/84 guides now carry a local hero photo and the native name; only 3 non-Vietnam guides look generic. |
| Spacing, radius, elevation | P1 | Spacing rhythm | 8 | **8** | The blank band left of the desktop hero is gone (`tokyo-d`). The lone filter button on its own row in phone Guidebook and Insights remains (`tokyo-guidebook-m`). |
| | P2 | Radius | 8 | **8** | 4 distinct raw radii (50 %, 3, 2, 1 px), R7 2. |
| | P3 | Elevation | 8 | **9** | Raw shadows 28 → **7** distinct. |
| | P4 | Borders | 8 | **8** | One hairline system. |
| Components | K1 | Cards | 8 | **8** | **Better:** the carousel credit is no longer clipped (QC-17); food covers now name the dish ("Hainanese chicken rice", "Pizza") instead of a lone glyph. **But:** <br>• a card now stacks credit + "Cited by N sources" + "Recommended by … +2 more" + "Status checked" (the badge and "+2 more" say the same thing twice, `tokyo-gallery-p2-d`); <br>• credits are still 12 px over 2–3 lines; <br>• on a 3× phone, card photos are drawn ≈ 1.7× upscaled and look soft (`atlas-list-m`). |
| | K2 | Chips and pills | 9 | **9** | Hairline pills; the sun "Award · Michelin" badge reads well. |
| | K3 | Buttons | 9 | **9** | Consistent. |
| | K4 | View switcher | 9 | **9** | Segmented on desktop; now a full segmented row on phones; the thumb slides. |
| | K5 | Place sheet | 7 | **8** | **Fixed (all four R7 defects):** a scrim, centred, no upscale, the close button clear of the switcher, and "No. 3 of 43". The closed sheet leads with "Where it was". **New:** "Read what Wikipedia says" fails contrast (2.87:1) on the Vietnamese sheet. The Flickr ID in a credit title ("(5618203831)") is noise. |
| | K6 | Filter tray | 8 | **8** | Desktop Atlas bar adds "Top picks"; the Area and Filters chips read greyed-out next to the others (`tokyo-atlas-d`). |
| | K7 | Rails | 8 | **9** | Category labels now wrap to two lines instead of truncating ("Anime, manga / & pop culture", "UNESCO / World Heritage"). |
| | K8 | Charts and stat tiles | 7 | **8** | Bars moved to muted earth hues; stat values tabular. Still five hues outside the bone/oxblood family. |
| | K9 | Masthead | 7 | **7** | Photo-led on 76 guides; the stat line still breaks badly at 390 px (S2). |
| Iconography | I1 | Iconography | 9 | **9** | One line set; Atlas glyphs per kind on the named pins. |
| Motion | M1 | Motion | 8 | **9** | Three action-driven moments now (grow 340 ms, photo fade 280 ms, switcher slide plus content fade 240 ms) and the heart pop, all off under reduced motion (measured 0/0). |
| Consistency | X1 | Consistency across the four views and the hubs | 8 | **8** | Insights palette and letter-spacing fixed. Open: the desktop Atlas header breaks the shared header (wrapping links, a truncated crumb), and the landing page and hubs keep a translucent bar that city pages dropped. |
| | | **Total (of 300)** | **241** | **250** | |

By area: faces 68/80 · scale & rhythm 22/30 · colour & skins 26/30 · spacing, radius & elevation 33/40 ·
components 75/90 · iconography 9/10 · motion 9/10 · consistency 8/10.
**3 of 30 items are below 8**: T7, S2 and K9 (R7: 7).

### The designer's v2 claims, checked

[`style/v2/DECISION.md`](../style/v2/DECISION.md) is unchanged since R7. I re-checked each claim against R8.

| Criterion (designer's card) | Claim | R7 eval | **R8 eval** | Why |
|---|---:|---:|---:|---|
| Modern-minimal | 9 | 9 | **9** | Calm ground, one accent. |
| Marketplace-grade clarity | 9 | 8.5 | **8.5** | **Fixed:** the sheet, the carousel credit, the clipped placeholder ("Search Cleveland" needs 134 of 370 px). **Still:** content ghosts through the landing and hub bar (96 %); the desktop Atlas header wraps and truncates; cards carry four meta lines. |
| Palette uniqueness | 9 | 9 | **9** | Agreed. |
| Classy, not tacky | 9 | 9 | **9** | Agreed. |
| Luxury feel | 9 | 8 | **8.5** | The charts no longer cheapen Insights, and named dish covers beat blank glyphs. The sand covers still lead food-led first rows (`newyork-d`, `chinatown-d`), and the phone photos are soft. |
| Readability | 9 | 9 | **9** | Running text 16–18 px (`body-r8.txt`). |
| AA, light + dark | 10 | 10 | **9.5** | 0/180 B-23 failures, but axe finds one serious contrast failure (2.87:1) on a sheet button in both themes. |
| Consistency across views | 9 | 8 | **8.5** | Insights and letter-spacing fixed; the Atlas header and the hub bar diverge. |
| Photo-friendliness | 9 | 9 | **9** | Agreed. |
| Gen Z wanderlust appeal | 9 | 7.5 | **8.5** | Heroes on 76 guides, the Fuji hub, a photo on Chinatown's first screen. Food-led signature rows are still sand. |
| Cross-generational trust & legibility | 9 | 8.5 | **8.5** | **Better:** sources everywhere, dated labels on quoted prices and hours, status dates per card. **Still:** 12 px credits over 2–3 lines; 32 px pills and 18 px dots on the phone map; the landing shows internal source labels as the recommender ("Official company/institution site", "Wikipedia (published facts/coords)"). |

## Evidence per dimension

### A. Look & feel: R7 83 → R8 87

| Sub-criterion | R7 | R8 | Evidence (R8) |
|---|---:|---:|---|
| Visual polish | 85 | **88** | **Fixed:** <br>• "Start with" agrees on 84/84 guides; <br>• "No. N of M" is right; <br>• the desktop sheet has a scrim, is centred, isn't upscaled and its close button clears the switcher; <br>• the carousel credit is whole; <br>• the placeholder fits; <br>• the closed sheet leads with "Where it was". <br>**Still open:** <br>• the landing and hub top bar is 96 % opaque, so photos ghost behind it (`landing-d` scrolled); <br>• "last / checked" breaks on every phone masthead; <br>• **new:** at 1440 the desktop Atlas header wraps "field / guides" and "How we / choose" and truncates the crumb to "To…" (`tokyo-atlas-d`); <br>• the landing names internal labels as recommenders ("Official company/institution site"); <br>• "Cited by 3 sources" repeats "+2 more"; <br>• phone photos ≈ 1.7× upscaled. |
| Imagery | 75 | **82** | 598 credited photos: <br>• heroes on 76/84 guides, and the 8 without are the 5 Vietnam guides (by rule) plus 3 Singapore towns with no stated reason; <br>• place photos in 62 guides; <br>• 44 % of eligible tier-1 sights; <br>• 15.4 % of all eligible places. <br>The photos are well chosen and cropped (`japan-m`, `chinatown-d`, `wheeling-m`). **But:** <br>• food is excluded by rule, so the first row of food-led guides is all sand ("New York classics", "The hawker canon", `newyork-d`, `chinatown-d`); <br>• ROUND-1's photo-led benchmark (photos on ~29 % of records) is still about half met: 517 of 8,702 records (6 %). |
| Typography | 90 | **92** | See the sub-scorecard: tabular 98 %, letter-spacing clean, sentence-case eyebrow. The S2 widows remain. |
| Layout | 90 | **91** | Atlas map 64 % with no deep-link band; a centred sheet; a full segmented view row on phones. Minus: <br>• the crushed desktop Atlas header; <br>• the lone filter-button row; <br>• B-03 (16 controls above the first card). |
| Motion / delight | 74 | **80** | R7 gap 3 is partly met: <br>• two action-driven moments added (photo fade from its dominant colour, 280 ms; switcher slide plus content fade, 240 ms); <br>• all off under reduced motion (0 animations, 0 view transitions, phone and desktop, `motion-r8.json`). <br>No map motion yet: the pin → preview and card ↔ pin hover are instant. |
| Luxury + fun | 85 | **87** | Insights on muted hues, sun "Award" badges and restraint read classy. The busier cards and the sand rows on food-led guides pull it down. |
| Wanderlust | 83 | **87** | Photo-led hubs and guides almost everywhere; Chinatown's first phone screen now has a photo (R7 none). Food-led rows remain the gap. |
| **A (mean)** | **83** | **87** | (88 + 82 + 92 + 91 + 80 + 87 + 87) / 7 = 607 / 7 = 86.7 → 87 |

How R8 compares with the leader families, described neutrally:
- **Image-first marketplaces.** The anatomy and the photo density of hubs and guide heroes now match. The gap is the card
  rows: their cards are all photos, ours are photos on sights and sand on food.
- **Map-led local and real-estate search.** Pin → card, preview and deep links are at their level. Their pins are
  larger touch targets, and their headers never wrap.
- **Photo-led luxury products.** Palette and restraint are at their level. They have more motion moments on the map,
  and their photos stay sharp at 3×.

### B. UX & ergonomics: R7 91 → R8 92

| Area | R7 | R8 | Evidence |
|---|---:|---:|---|
| First screen | 90 | **91** | **Better:** <br>• B-02 fails on 4 pages (R7 20); <br>• B-04 on 0 (R7 9); <br>• B-05 on 0 hubs (R7 7); <br>• B-01 and B-16 pass on 84/84 (Tokyo: 0.73 screens to the first card, 2.42 cards per phone screen). <br>**Worse:** B-03 fails on 76 pages: 16 controls above the first card against ≤ 14, mainly because the language switch and the full view row were added. |
| Discovery | 91 | **92** | A "Top picks" chip, recognition badges, and a "Recognised" filter driven by the place's own data. In desktop Atlas, "For you", "Your day" and "Near me" are still not on screen (R7 gap 4e). |
| Map ↔ list | 94 | **95** | **Fixed:** <br>• a desktop pin lights a rendered card in view (8/8; R7 0/8 for outer pins); <br>• the deep link no longer scrolls (scrollY 0, no band); <br>• day route fits on the phone (`day-atlas-m-r8.jpg`); <br>• named pins are 32 px tall (R7 26). <br>**Open:** <br>• the other places are 18 px dots; <br>• no "last checked" on the phone Atlas first screen; <br>• B-07 fails on Wheeling, Bruges and Potong Pasir (the map-search card is not found after a pin tap). |
| Filters | 91 | **92** | Recognised filter, Top picks, Saved count; "Show 488 places" (B-10). |
| Detail | 90 | **93** | **Better:** <br>• "No. N of M" is right; <br>• a closed place offers "Where it was" and links its closure source; <br>• quoted prices, ratings and hours carry a dated "quoted from the source" label (D-39, D-42), and the sheet says "We don't track opening hours or prices"; <br>• the desktop sheet is a proper centred dialog. <br>**New:** the "Read what Wikipedia says" button fails contrast on the Vietnamese sheet. |
| Mobile | 88 | **89** | B-08 is 0 (R7 80 pages); a full segmented view row; the first load is lighter. **Open:** <br>• no "last checked" on the phone Atlas first screen; <br>• soft 1.7× photos; <br>• 18 px dots. |
| Accessibility | 92 | **91** | **Better:** <br>• B-20 is clean on all 84 place pages (R7 9); <br>• recognition badges are 44 px targets; <br>• focus moves to the view's heading on a switch; <br>• one focus ring per card; <br>• the R7 moderate axe findings (`aria-allowed-role` ×56, `heading-order` ×24) are gone. <br>**Regressed:** <br>• axe reports **8 serious nodes in 4 runs** (R7 0), the Vietnamese sheet button at 2.87:1; <br>• B-20 fails on **31 "What changed" pages** ("Status source" links 91×17 px). |
| Performance | 88 | **90** | **Better:** <br>• Tokyo phone first load 940 → 621 KB; <br>• Atlas phone 1,020 → 616 KB, and raw is now under 2 MB too; <br>• 180/180 pages ≤ 2.0 MB and ≤ 1 s FCP at 4×; <br>• phone photo bytes on Tokyo 1,108 → 452 KB. <br>**Open:** <br>• Tokyo desktop DOM is 3,074 against 3,000 (D-45 waives it; it is still a miss); <br>• CSS is 427 KB raw with old layers shipped; <br>• session bytes are 7.7 MB on Tokyo; <br>• the byte savings cost sharpness. |
| **B (mean)** | **91** | **92** | (91 + 92 + 95 + 92 + 93 + 89 + 91 + 90) / 8 = 733 / 8 = 91.6 → 92 |

### C. Competitor feature coverage: R7 96 → R8 97

I re-checked by hand every row R8 touches. The rest rest on the gates and harness rows behind them (G1, G6, B-10, B-12,
B-17, the views and FE suites, all green).

| # | Feature | R7 | R8 | Note |
|---|---|---|---|---|
| 4 | Restraint plus local skin per city | ◐ | **✅** | R7 kept this ◐ because only 32 guides looked local. 76 of 84 now carry a local hero plus the native-script name. The 5 Vietnam guides are excluded by rule and still look local through their native names; 3 Singapore towns have no hero. |
| 5 | Visual anchor without photos | ✅ | ✅ | The calm cover now names the dish; locator map in the sheet. |
| 6 | Licensed landmark photos | ◐ | ◐ | 598 credited photos and a credit on every one; the gate refuses anything uncredited (`test-imagery.js` green). Coverage: 15 % of eligible places, 44 % of eligible tier-1 sights. |
| 7 / 8 / 9 | Split view with sync, phone map with sheet, numbered pins | ✅ | ✅ | The map-search pattern. With `--view atlas`, B-06 and B-09 pass (B-09 now accepts named pins with the order stated; the cards carry the rank numbers). |
| 20 | Day plan with route line | ✅ | ✅ | Fits on the phone map. |
| 30 | Multilingual UI | ◐ | **◐** | **The feature now exists:** a Japanese interface with 703 strings and a working switch, `lang="ja"`, and the views translated (ギャラリー …). It shows an honest "machine-translated and checked by a second AI review" note. It is still not a **reviewed** second locale in the sense every earlier round used (a human sign-off; the catalogue itself says `reviewed: false`), so the row stays ◐. |
| 33 / 35 | Night edition · functional delight | ✅ | ✅ | AA in dark (B-23); three reduced-motion-safe moments. |

R8 tally: ✅ 33 · ◐ 2 (#6, #30) · ✕ 0. Coverage is (33 + 1) / 35 = 97.1 % → **97**.

### D. Unique strengths: R7 89 → R8 90

| Strength | R7 | R8 | Evidence |
|---|---:|---:|---|
| Sourced picks; attribution as navigation | 94 | **95** | G6 is 0 cards without "Recommended by" on 84/84 pages. Quoted prices, ratings and hours are now dated labels rather than undated claims (D-39, D-42). Recognition badges come from each place's own data. **Minus:** the landing names internal source labels ("Official company/institution site", "Wikipedia (published facts/coords)") as the recommender. |
| Verified pins | 92 | **92** | 0 tile hosts other than OSM/Esri (`check-google.py`). The D-43 "Approximate pin" label is not in this deploy (the changelog lists it for the next release), so the 235 low-confidence pins still draw as ordinary pins. |
| Closure honesty | 95 | **97** | Closure source links on closed places (55 of 60 per the changelog; I checked the Cleveland closed sheet, not the count); "Closed — kept for the record"; "Where it was" instead of Directions; a "Status checked <date>" line on every card, including the phone Atlas carousel. The phone Atlas first screen still has no guide-level "last checked". |
| Interest triad | 81 | 81 | Unchanged. |
| Anime layer | 85 | 85 | Unchanged (it still leads Tokyo). |
| "Your guide" and day plans | 79 | 79 | The day route fits on the phone. The desktop Atlas rail is still off-screen. |
| Stated gaps | 89 | 89 | Unchanged. |
| **D (weighted judgement)** | **89** | **90** | The mean is 88.3. Sourcing and closure honesty weigh most, as in every earlier round. |

## Design-conformance checklist (D1–D13)

| # | Designed item | R7 | **R8** | Evidence |
|---|---|---|---|---|
| D1 | Four switchable views, view in the hash, preference remembered | ✅ | **✅** | All four views on 84/84 place pages. G1 on Tokyo: 488/488 by scroll, deep link, search and no-JS (metrics). `test-views*.js` green. A view switch now moves focus to the view heading. |
| D2 | Atlas is map-first (map-search) | ◐ | **◐** | **Met:** <br>• desktop map 64 % (≥ 58), left, full height, with a 2-column card grid; <br>• search as I move, and "Show all 488"; <br>• hover sync both ways; <br>• pin → preview → detail, with the lit card rendered and in view 8/8; <br>• deep link without page scroll; <br>• named pills with a kind glyph, dots for the rest (no cluster confusion); <br>• Satellite (Esri) and Key; <br>• phone: a full-screen map (86 % of the screen), a synced carousel and a List · N pill; <br>• the day route fits; <br>• "Map unavailable" when tiles fail (`test-i18n` tiles-blocked check). <br>**Not met:** <br>• phone targets: named pills are 32 px tall and dots 18 px (44 px, D11); <br>• no "last checked" on the phone Atlas first screen; <br>• For you, Your day and Near me are off-screen on the desktop Atlas; <br>• B-07 fails on 3 small guides; <br>• the desktop Atlas header wraps and truncates. |
| D3 | Gallery | ✅ | **✅** | Rows plus an "All N" grid; 1/2/3/4 columns; a lead card on the first phone screen (B-01 0.73), with "Start with" consistent on 84/84; covers vary by kind and name the dish; `#view=gallery&p=` opens the right sheet. |
| D4 | Guidebook | ✅ | **✅** | Contents first (13 chapters), lazy chapters with maps and chapter photos; print checks green; tabular facts. |
| D5 | Insights | ✅ | **✅** | Inline-SVG charts with tables; bars link to lenses; values tabular (101/101); muted hues; 0 axe serious issues on Insights. |
| D6 | Fonts and styles rated, best direction built | ◐ | **◐** | **Met:** v2 built across the whole beta; self-hosted OFL faces; Vietnamese, macrons and CJK verified; **27 of 30 sub-scores ≥ 8** (R7 23). <br>**Not met:** <br>• T7 is 7: a single optical cut, so the display face sets tight at 16–22 px. Fixable by adding a text-size cut or switching to the variable opsz axis. <br>• S2 is 6: the widows ("last / checked", a leading "·"). Fixable with `nowrap` on the date phrase and balanced wrapping. <br>• K9 is 7: the masthead stat line, the same defect. <br>All three are fixable, so they do not excuse the row. |
| D7 | melon-seek ideas: one token set, 3-step elevation, consistent radius, crisp UI face | ◐ | **◐** | **Met:** <br>• 0 raw letter-spacings (R7 16); <br>• 7 raw shadows (R7 28); <br>• 2 raw font sizes; <br>• `DESIGN-SYSTEM.md` documents v2. <br>**Not met:** <br>• 64 raw line-height declarations (16 distinct); <br>• raw radii are now 4 distinct values (1 and 2 px added); <br>• 427 KB of CSS with the R6 layers still shipped. |
| D8 | Luxury yet fun, wanderlust: each ≥ 8/10 | ✅ | **✅** | **Luxury + fun 87 → 8.7 ✅. Wanderlust 87 → 8.7 ✅.** |
| D9 | Real photographs | ◐ | **◐** | **Met:** <br>• keyless Commons photos through Actions: 598 rows with full TASL credit, each credit visible under its photo; <br>• the gate refuses any uncredited file, closed place, Vietnam place or food place; the fetcher refuses URL or HTML authors (QA-78); <br>• hub heroes on all 5 hubs and 76 guides; <br>• top landmarks: 44 % of eligible tier-1 sights. <br>**Not met:** <br>• "hub heroes plus top landmarks" still misses 3 Singapore heroes and 545 eligible tier-1 sights; <br>• Unsplash still waits on the owner's key. |
| D10 | Honesty rules | ✅ | **✅** | validate, test and beta:check green; 8,702 places, beta == live; the `test-honesty.js` no-brand scan is clean; `check-google.py` clean; OSM/Esri tiles only; G6 and B-12 green; a credit on every photo; quoted prices, ratings and hours labelled with their research date (D-39, D-42); the AI-reviewed locale labelled as such (D-41). |
| D11 | Performance and accessibility | ◐ | **◐** | **Met:** <br>• Tokyo default 661/621 KB, FCP at 4× 456 ms (median); <br>• 180/180 pages ≤ 2.0 MB and ≤ 1 s; <br>• AA light and night on 180/180 (B-23); <br>• B-20 clean on 84/84 place pages. <br>**Not met:** <br>• axe: **8 serious nodes** (Vietnamese sheet button, 2.87:1); <br>• B-20 fails on 31 "What changed" pages; <br>• phone map pills 32 px and dots 18 px; <br>• Tokyo desktop DOM 3,074 > 3,000 (waived, not met). |
| D12 | Modern-minimal, marketplace-grade UI with a palette of our own; minimal clarity and palette ≥ 9/10 | ◐ | **◐** | **Built:** <br>• compact sticky header; <br>• category bar; <br>• borderless image-first cards with a heart in 1/2/3/4 columns; <br>• floating map pill; <br>• a centred detail dialog with large media, hairlines and a sticky action bar; <br>• no retired motifs. <br>**Sub-criteria:** <br>• **minimal clarity 8.5/10 ✕**: the ghosting landing and hub bar, the desktop Atlas header, four-line card meta; <br>• **palette 9/10 ✅**: unique, consistent in light and dark, and the Insights bars are back in family. |
| D13 | Gen Z wanderlust that every generation trusts; both sub-criteria ≥ 9/10 | ◐ | **◐** | **Built:** big photography on hubs and 76 guide heroes, the expressive self-hosted display face, three delight moments, an inviting voice, running text 16–18 px, sources on every card. <br>**Sub-criteria:** <br>• **Gen Z wanderlust appeal 8.5/10 ✕**: food-led first rows are sand; phone photos soft; <br>• **cross-generational trust & legibility 8.5/10 ✕**: 12 px multi-line credits, 32 px pills and 18 px dots, internal source labels on the landing, one contrast failure. |

**Summary:** ✅ 6 (D1, D3, D4, D5, D8, D10) · ◐ 7 (D2, D6, D7, D9, D11, D12, D13) · ✕ 0. No row regressed. D6
(27/30 ≥ 8) and the D12 palette half are much closer than in R7.

## Points blocked on the owner

These are my estimates from this round's sub-scores. Changes since R7:
- **The price/rating prose call is no longer owner-blocked.** D-39 and D-42 decided it under the owner's delegation,
  and the dated label ships. It is counted in B (Detail) and D (Sourced picks) above.
- **Photographs:** the keyless Commons path delivered 598 photos. Every remaining sight gap is team work (gap 1).

| Owner action | What it unblocks | A | B | C | D | **Overall** |
|---|---|---:|---:|---:|---:|---:|
| **A human review of the Japanese interface** (`reviewed: true` by a person, per D-41) | C #30 ◐ → ✅ | — | — | +1.4 | — | **≈ +0.3** |
| **Unsplash key and hosts** (`api.unsplash.com`, `images.unsplash.com`, `UNSPLASH_ACCESS_KEY`) | A quality top-up where Commons has no usable frame (the 3 Singapore heroes may need it). Food, closed and Vietnam exclusions apply to every source. | +0.3 | — | — | — | **≈ +0.1** |
| **Total owner-blocked** | | **+0.3** | — | **+1.4** | — | **≈ +0.4** |

**Not counted:** photos of food places are excluded by the project's honesty rule ("only where the photo truly shows
the place"; IMAGERY.md). Food-led first rows are the largest visual gap left in A: they are all sand on New York,
Chinatown and Tokyo's signature row. Only the owner could change that rule (for example, a licensed photo of the
venue's own frontage). I do not assume it. If it were allowed and filled, I estimate about A +1.2 (≈ +0.5 overall).

Separately from those, the team can still earn **about 2.5 overall points** through the gaps below. Of the 9.3 points
between R8 and 100:
- about 0.4 are owner-blocked;
- about 2.5 are recoverable through named changes;
- the rest is not tied to any single change I can name with confidence.

## Top gaps, ranked by points recoverable

Gain = weight × the dimension points if the change fully lands. Each acceptance is a test the next wave can run.

| # | Gap | Acceptance (testable) | Lane | Gain |
|---:|---|---|---|---:|
| 1 | **Photo coverage of sights** (Imagery 82, Wanderlust 87, C #6 ◐, D9 ◐, D13) | (a) Dempsey Hill, Jalan Besar and Queenstown carry a credited hero, or the manifest states a per-guide reason: 79/84 place pages with `photos/hero--`, the other 5 being the Vietnam guides (by rule). (b) ≥ 70 % of eligible tier-1 sights carry a photo (today 435/980 = 44 %; `CREDITS.json` ∩ `manifest.json` ∩ `t == 1`). (c) ≥ 30 % of all eligible places (today 15.4 %). (d) On every guide whose signature row is sights, the first 4 cards of that row have photos. (e) The credit gate still refuses anything uncredited (`test-imagery.js`). | imagery | A +1.6, C +1.4 → **+0.92** |
| 2 | **Polish defects** (Visual polish 88, S2, K1, K9, X1, marketplace clarity 8.5) | (a) Top bar background alpha = 1 on the landing page and hubs (`probe-r8.js` `topAlpha`). (b) At 1440×900 the desktop Atlas header has no wrapped item and no truncated crumb (`headerWrapped`/`headerTruncated` empty, visually one line). (c) At 390 px no line in the masthead stat line or dek starts with "·", and "last checked <date>" never breaks inside (a test over the 84 pages). (d) The landing and hub "Recommended by" never shows an internal label: no "Official company/institution site", no "(published facts/coords)" (a grep over the built pages). (e) A card shows either "Cited by N sources" or "+N more", not both. (f) On a 3× phone no card photo is drawn more than 1.25× its source width, with the Tokyo phone first load still ≤ 700 KB. (g) The phone Guidebook and Insights filter button sits in the chip row. | designer + FE-A + FE-B | A +1.1, B +0.13 → **+0.47** |
| 3 | **Map motion** (Motion 80, M1) | Two moments on the Atlas, each ≤ 300 ms and absent under reduced motion (a test asserts 0 animations then): the selected pin grows into its preview card (desktop) or the carousel card lifts (phone), and card ↔ pin hover is a short transition. No autoplay. | Atlas + designer | A +0.86 → **+0.34** |
| 4 | **Atlas residuals** (Map ↔ list 95, Mobile 89, D2 ◐, Your guide 79) | (a) Every phone map target (named pill and dot) has a hit box ≥ 44 px (padding is enough), with no overlap regression. (b) "Last checked <date>" is visible on the first phone Atlas screen (hit test). (c) In desktop Atlas, For you, Your day and Near me are in view at 1440×900 without scrolling (`probe-atlas-r7.js` rail: 3 × "in view"). (d) B-07 passes on 84/84 (today Wheeling, Bruges and Potong Pasir fail). (e) The D-43 approximate marker ships, so low pins draw unlike exact pins. | Atlas | B +0.6, D +0.5, A +0.15 → **+0.30** |
| 5 | **Accessibility regressions** (Accessibility 91, First screen 91, D11 ◐) | (a) axe: 0 serious or critical issues in the 80-run probe, and every sheet's "Read what <source> says" button ≥ 4.5:1 in light and dark (a test over all sheets with that button). (b) B-20: 0 failing pages of 180 ("Status source" links get a 44 px tap area). (c) B-03: ≤ 14 controls above the first card on 84/84, or QA re-points B-03 for the language switch and ratifies it. | FE-B + FE-C + QA | B +0.75 → **+0.19** |
| 6 | **DOM and CSS weight** (Performance 90) | Tokyo desktop initial DOM ≤ 3,000 (the 87f814ad fix, w2 `--only dom` in `npm test`). `cleo.css` + layers ≤ 250 KB raw with the R6 layers removed. Tokyo session bytes ≤ 4 MB (e.g. no eager decode of off-screen card photos during reachability). | platform | B +0.5 → **+0.13** |
| 7 | **Token residue and optical size** (D7 ◐, T7) | `probe-css.py`: ≤ 6 distinct raw line-heights and ≤ 2 distinct raw radii. A text-size optical cut, or the variable opsz axis, used below 24 px. | designer + FE-B | A +0.2 → **+0.08** |

## What R8 got right (keep)

- **Photos at scale, still honest.** 598 keyless, credited photos, refused when uncredited, closed, in Vietnam or food;
  76 guide heroes; a fetcher that refuses an HTML or URL author.
- **The R7 polish list was taken seriously.** The sheet, "No. N of M", "Start with", the carousel credit, the
  placeholder, the Insights palette, letter-spacing and tabular figures are each fixed and measurable.
- **Map-search is now correct where it was wrong:** the lit card is rendered and in view, the deep link stays put, and
  the day route fits.
- **Honesty grew:** dated labels on quoted prices, ratings and hours; closure sources; "Where it was"; an AI-reviewed
  locale that says so on the page.
- **Lighter and still fast:** the Tokyo phone first load fell by a third, and 180/180 pages stay under budget.
- 0 JS errors across 114 captured flows in both rounds; every gate green.

## Reproduce

```bash
git worktree add --detach ../eval-r8 b54b3745ce28166bd072808f3e5f3fdbf05b9d49 && cd ../eval-r8/tools && npm install --no-audit --no-fund && npm run validate && npm test && npm run beta:check
git worktree add --detach ../eval-r7 badcc20d
(cd ../eval-r8 && python3 -m http.server 8811 --bind 127.0.0.1 &) ; (cd ../eval-r7 && python3 -m http.server 8812 --bind 127.0.0.1 &)
npm run beta:metrics:all                                                          # all 180 pages, alone
node beta/metrics.js --only cities/tokyo --out <scratch>/tokyo-N.json              # ×3, idle
node beta/metrics.js --view atlas --only cities/tokyo --out <scratch>/atlas-N.json # ×2, idle
# from the root of ../eval-r8
E=design/beta/eval/r7/tools
node $E/shots-r7.js r8 8811 <out>/r8 && node $E/shots-r7.js r7 8812 <out>/r7
node $E/shots-extra.js 8811 <out>/r8 && node $E/shots-extra.js 8811 <out>/r8 --motion && node $E/shots-extra.js 8812 <out>/r7
python3 design/beta/eval/r8/tools/pair.py <out>/r7 <out>/r8 design/beta/eval/r8 landing,japan,tokyo,... b54b3745
node $E/probe-atlas-r7.js 8811 <out>/atlas.json && node $E/probe-pin2card.js && node $E/probe-day.js 8811 <out>
node $E/probe-axe.js 8811 tools/beta/qa/vendor/axe.min.js <out>/axe-r8.json && node design/beta/eval/tools/probe-axe-vn-r8.js
node $E/probe-type.js 8811 R8 <out>/type-r8.json && python3 $E/probe-css.py ../eval-r8 R8
node $E/probe-transfer.js && node $E/probe-body.js
node design/beta/eval/tools/probe-r8.js 8811 <out>/probe-r8.json                  # run from any tree; needs global playwright
```
