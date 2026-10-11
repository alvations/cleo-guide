# Evaluation round 6 — independent evaluator

> 2026-10-11 · evaluator lane (no build lane)
> **Measured:** R6 is the beta at `2f227631`, the W6 head: the type & style rebuild (direction B), Atlas map-first, and the
> imagery lane's candidate manifest. It also carries the R5 follow-up `63932912` (Gallery defers the page JSON, one-tap
> phone map), which is what is live now. `npm run validate`, `npm test` (all suites) and `npm run beta:check` are green on
> that SHA: 179 pages, 84 place pages, 8,458 places, beta == live.
> The branch has since moved on to W7 work (`f9263bbc` when this was committed). Nothing after `2f227631` is scored here.
> **Baseline:** R5 is the beta at `f2bf7610`, read with `git archive f2bf7610 beta`. [ROUND-5](ROUND-5.md) scored it 84.5.
> **Rubric:** unchanged since ROUND-1: the same four dimensions and weights, the same A/B sub-criteria, the same 35-row feature
> table for C, and the same D strengths. New this round, as the program defines it: a **Typography & style sub-scorecard**
> inside A, and the **design-conformance checklist D1–D11** from [ROUNDS-6-9](ROUNDS-6-9.md).

## Verdict

R6 scores **85.4 / 100** (R5 84.5): A 77, B 88, C 96, D 89.

- **B gains the most** (+2). Atlas is now what its name says. On a phone the map fills the screen under a compact
  header, with the ranked list in a peek → half → full tray. On desktop the map takes 64 % of the width at full height.
  Hover → pin, pin → card, fly-to, a legend, a map-style switch, an opt-in locate and a Must-see filter all work. The R5
  follow-up also took the default view back under budget and made the phone map one tap away.
  What holds B back is accessibility debt that the full 179-page sweep and axe surfaced for the first time. All of it
  pre-dates W6: a serious axe defect on every Insights chart, and failing light-theme contrast on 66 "What changed" pages.
- **A gains +1.** The new type fixes real defects: Vietnamese names no longer switch typeface mid-word, macrons survive
  without patches, and counts and charts use tabular figures. But the rebuild is not finished. The landing page and the hubs
  still carry the old weights and sizes, and the rendered size scale is still loose. The wider faces also create new widows
  in deks and mastheads. The display voice is sturdier and slightly less couture. There are still **0 photographs**, so
  ROUND-1's imagery cap still applies.
- **C stays at 96** and **D stays at 89.** No feature row changed status.
- **Typography & style, re-scored by the evaluator: 223 / 300**, against the designer's own claim of 240. The gap is
  mostly in scale discipline, consistency across the landing page and the hubs, charts, and the masthead.
- **Conformance: ✅ 5 · ◐ 5 · ✕ 1 (D9, blocked on the owner)** (D1–D11).
- **Owner-blocked: about 3.1 overall points** (photographs, a reviewed second locale, the price/rating prose call). The
  team can still earn about 2.5 points without the owner.

## Scorecard

| Dimension (weight) | R4 `8aa6fdf4` | R5 `f2bf7610` | **R6 `2f227631`** | Δ R5→R6 |
|---|---:|---:|---:|---:|
| A. Look & feel (40 %) | 74 | 76 | **77** | +1 |
| B. UX & ergonomics (25 %) | 85 | 86 | **88** | +2 |
| C. Competitor feature coverage (20 %) | 96 | 96 | **96** | 0 |
| D. Unique strengths (15 %) | 89 | 89 | **89** | 0 |
| **Overall (weighted)** | **83.4** | **84.5** | **85.4** | **+0.9** |

R6 = 0.4×77 + 0.25×88 + 0.2×96 + 0.15×89 = 30.8 + 22.0 + 19.2 + 13.35 = **85.35 → 85.4**.

## Method

The method is ROUND-5's, with additions for this round's new items.

1. **Gates.** In a detached worktree at `2f227631` I ran `npm install`, then `npm run validate`, `npm test` and
   `npm run beta:check`. All passed. (`npm ci` cannot run: `tools/` has no lockfile. Earlier rounds also used
   `npm install`.)
2. **Servers.** I served that tree on port 8801 (R6), `git archive f2bf7610` on 8802 (R5), and `git archive 63932912` on
   8803 (the R5 follow-up, for the transfer comparison only).
3. **Screenshots.** Taken with [`r6/tools/shots-r6.js`](r6/tools/shots-r6.js). It is ROUND-5's `shots-r5.js` with the same
   61 flows and the same settings:
   - 390×844 @2× touch and 1440×900;
   - light theme and reduced motion;
   - off-origin requests aborted and tiles stubbed (**a blank map ground is a sandbox artefact**);
   - the same 4 saved refs seeded.

   It adds R6 flows: Chinatown in Atlas, an Atlas pin, the tray at half and full, an Atlas deep link, Must see on the map,
   and the Vietnamese sheet. Night shots come from [`r6/tools/shots-night.js`](r6/tools/shots-night.js), with the context
   set to dark. Logs are in [`r6/shots-r5-log.json`](r6/shots-r5-log.json) and
   [`r6/shots-r6-log.json`](r6/shots-r6-log.json); composites were made with [`r6/tools/pair.py`](r6/tools/pair.py).
   - `tray-m` fails in both rounds, as in R4 and R5 (no visible `[data-cleo-tray]` on the phone; a harness limit).
   - `daycle-m` timed out in R6 only. A direct probe shows the Cleveland day tile is visible and opens `#view=gallery&day=DT`
     in both rounds, so this is a click-timing artefact, not a regression.
   - My in-flow night toggle did not take effect; the night set was re-shot with `shots-night.js`.
4. **Metrics.** `npm run beta:metrics:all` on all 179 pages of the R6 tree, written to the scratchpad so QA's files are left
   alone. Output: [`r6/beta-metrics-all-r6.md`](r6/beta-metrics-all-r6.md).
   - The sweep measures the **default view** (Gallery).
   - For the budgets I re-ran Tokyo three times on an idle container, and once with `--view atlas`:
     [`r6/budgets-r6.md`](r6/budgets-r6.md).
   - R5 was measured only on the pilots. To tell new failures from old ones, I also ran the R6 harness on three R5
     "What changed" pages.
5. **New probes for this round** (all in `r6/tools/`):
   - [`probe-atlas.js`](r6/tools/probe-atlas.js): D2 acceptance on Tokyo, Cleveland and Chinatown. It measures the map box,
     the three tray detents, pin → sheet → Back, whether geolocation is called before a tap, the map-style switch and the
     legend on the phone, and on desktop the map share, numbered pins against card ranks, hover → pin, pin → card and
     fly-to. Results: [`r6/atlas-probe-*.json`](r6/atlas-probe-tokyo.json).
   - [`probe-axe.js`](r6/tools/probe-axe.js): axe-core 4.10.2 (the copy QA vendors) on 15 pages × 2 viewports × light and
     night, on **both** R5 and R6 ([`r6/axe-r6.json`](r6/axe-r6.json), [`r6/axe-r5.json`](r6/axe-r5.json); summary
     [`r6/axe-summary-r6.txt`](r6/axe-summary-r6.txt)).
   - [`probe-type.js`](r6/tools/probe-type.js): a runtime census of what actually renders on 9 pages × 2 viewports: the
     distinct sizes, letter-spacings, radii, shadows and weights; whether numeric elements use tabular figures; and, through
     CDP, the platform fonts used for macron, Vietnamese and CJK samples
     ([`r6/type-census-r6.json`](r6/type-census-r6.json), [`r6/type-census-r5.json`](r6/type-census-r5.json)).
   - [`probe-css.py`](r6/tools/probe-css.py): a static census of raw values against tokens in `beta/assets/*.css` plus the
     city page's inline style ([`r6/css-census-r6.json`](r6/css-census-r6.json), [`r6/css-census-r5.json`](r6/css-census-r5.json)).
   - [`probe-transfer.js`](r6/tools/probe-transfer.js): bytes by resource, R5 vs R5 follow-up vs R6, default view and Atlas
     ([`r6/transfer-by-resource.txt`](r6/transfer-by-resource.txt)).
   - [`crop-dpr1.js`](r6/tools/crop-dpr1.js): DPR 1 crops of the macron lines ([`r6/crop-dpr1-macron-r5-r6.png`](r6/crop-dpr1-macron-r5-r6.png)).

   No web research and no WebFetch. The designer's AUDIT, DECISION and `scores.json` were read as claims and re-measured.

## Side-by-side (R5 → R6)

Composites are labelled R5 `f2bf7610` | R6 `2f227631`. A URL with no `view=` opens Gallery in both rounds.

| Page | Mobile 390×844 | Desktop 1440×900 |
|---|---|---|
| Landing | ![](r6/landing-m-r5-r6.jpg) | ![](r6/landing-d-r5-r6.jpg) |
| Country hub (Japan) | ![](r6/japan-m-r5-r6.jpg) | ![](r6/japan-d-r5-r6.jpg) |
| Tokyo (default: Gallery) | ![](r6/tokyo-m-r5-r6.jpg) | ![](r6/tokyo-d-r5-r6.jpg) |
| Tokyo · Gallery cover grid | ![](r6/tokyo-gallery-p2-m-r5-r6.jpg) | ![](r6/tokyo-gallery-p2-d-r5-r6.jpg) |
| **Tokyo · Atlas (now map-first)** | ![](r6/tokyo-atlas-m-r5-r6.jpg) | ![](r6/tokyo-atlas-d-r5-r6.jpg) |
| Atlas tray at half · at full (phone) | ![](r6/atlas-half-m-r5-r6.jpg) · ![](r6/atlas-full-m-r5-r6.jpg) | — (no tray on desktop) |
| Atlas deep link `#view=atlas&p=kanda-myojin` | ![](r6/atlas-place-m-r5-r6.jpg) | ![](r6/atlas-place-d-r5-r6.jpg) |
| Atlas · Must see on the map | ![](r6/atlas-must-m-r5-r6.jpg) | ![](r6/atlas-must-d-r5-r6.jpg) |
| Atlas pin → sheet (phone) · pin → card (desktop), R6 only | ![](r6/atlas-pin-sheet-m-r6.jpg) | ![](r6/atlas-pin2card-d-r6.jpg) |
| Mobile map from the Gallery (toggle + pin peek) | ![](r6/map-m-r5-r6.jpg) | ![](r6/map-d-r5-r6.jpg) |
| Tokyo · Guidebook | ![](r6/tokyo-guidebook-m-r5-r6.jpg) | ![](r6/tokyo-guidebook-d-r5-r6.jpg) |
| Tokyo · Insights | ![](r6/tokyo-insights-m-r5-r6.jpg) | ![](r6/tokyo-insights-d-r5-r6.jpg) |
| Cleveland (default: Gallery) | ![](r6/cleveland-m-r5-r6.jpg) | ![](r6/cleveland-d-r5-r6.jpg) |
| **Cleveland · Atlas** | ![](r6/cle-atlas-m-r5-r6.jpg) | ![](r6/cle-atlas-d-r5-r6.jpg) |
| Cleveland · Gallery · Guidebook · Insights | ![](r6/cle-gallery-m-r5-r6.jpg) · ![](r6/cle-guidebook-m-r5-r6.jpg) · ![](r6/cle-insights-m-r5-r6.jpg) | ![](r6/cle-gallery-d-r5-r6.jpg) · ![](r6/cle-guidebook-d-r5-r6.jpg) · ![](r6/cle-insights-d-r5-r6.jpg) |
| Singapore town (Chinatown & CBD) · **its Atlas** | ![](r6/chinatown-m-r5-r6.jpg) · ![](r6/chinatown-atlas-m-r5-r6.jpg) | ![](r6/chinatown-d-r5-r6.jpg) · ![](r6/chinatown-atlas-d-r5-r6.jpg) |
| Place sheet (Kanda Myōjin) · from a Gallery link | ![](r6/sheet-m-r5-r6.jpg) · ![](r6/galsheet-m-r5-r6.jpg) | ![](r6/sheet-d-r5-r6.jpg) · ![](r6/galsheet-d-r5-r6.jpg) |
| **Vietnamese sheet** (Việt Nam Quốc Tự, Ho Chi Minh City) | ![](r6/sheet-vn-m-r5-r6.jpg) | ![](r6/sheet-vn-d-r5-r6.jpg) |
| Switcher tap → Gallery | ![](r6/switch-m-r5-r6.jpg) | ![](r6/switch-d-r5-r6.jpg) |
| Day plan (Tokyo `#day=TAITO`) | ![](r6/day-m-r5-r6.jpg) | ![](r6/day-d-r5-r6.jpg) |
| Saved · What changed | ![](r6/saved-m-r5-r6.jpg) · ![](r6/changes-m-r5-r6.jpg) | ![](r6/saved-d-r5-r6.jpg) · ![](r6/changes-d-r5-r6.jpg) |
| Night: landing · Gallery · Atlas · Insights · sheet | ![](r6/landing-night-m-r5-r6.jpg) · ![](r6/tokyo-gallery-night-m-r5-r6.jpg) · ![](r6/tokyo-atlas-night-m-r5-r6.jpg) · ![](r6/tokyo-insights-night-m-r5-r6.jpg) · ![](r6/sheet-night-m-r5-r6.jpg) | ![](r6/landing-night-d-r5-r6.jpg) · ![](r6/tokyo-gallery-night-d-r5-r6.jpg) · ![](r6/tokyo-atlas-night-d-r5-r6.jpg) · ![](r6/tokyo-insights-night-d-r5-r6.jpg) · ![](r6/sheet-night-d-r5-r6.jpg) |
| Macrons at DPR 1 (card name 21 px, Insights dek 16 px) | ![](r6/crop-dpr1-macron-r5-r6.png) | |

## Key measurements (R5 → R6)

| Measure | R5 `f2bf7610` | R6 `2f227631` | Source |
|---|---|---|---|
| Default view | Gallery | Gallery | shots log `view` |
| Phone Atlas first screen | ranked list (map one tap away) | **map 390×784 under a 60 px header**, tray at peek (27 % of the screen) | `probe-atlas.js` |
| Phone tray detents (share of the screen) | — | peek 27 % · half 52 % · full 85 % | `probe-atlas.js` |
| Desktop Atlas map width | 48 % (691 px) | **64 %** (922 px, full height under the masthead); list 31 % (442 px) | shots log `mapBox`, `probe-atlas.js` |
| Numbered pins = card ranks (desktop) | ✅ | ✅ 488/488 pins labelled; ranks 1–8 of the first area all found on the map | `probe-atlas.js` |
| Phone pins at the opening zoom | — | **26 cluster bubbles, 0 numbered rank pins** (clustering below z13 with > 40 pins) | `probe-atlas.js` |
| Pin → sheet → Back (phone) | ✅ (from the map toggle) | ✅ on Tokyo, Cleveland and Chinatown | `probe-atlas.js` |
| Hover → pin · pin → card (desktop) | ✅ | ✅ · ✅, but on Cleveland the lit card stays **out of view** | `probe-atlas.js` |
| Hit target of a pin | — | the **10 px (phone) / 14 px (desktop) dot**; the number label is `pointer-events: none` | `probe-atlas.js`, hit test |
| Locate-me | — | 0 geolocation calls at load, 1 after the tap, nothing stored | `probe-atlas.js` (geolocation spy) |
| Map style | — | Street (OSM) · Light (Esri gray) · Satellite (Esri); `check-google.py` 88 maps clean | `probe-atlas.js`, `npm test` |
| Phone: from the default view to the map | 2 taps | **1 tap** (R5 follow-up `63932912`) | `map-m` |
| City title and "last checked" in phone Atlas | visible | **covered by the map at every detent** (hit test) | probe |
| Transfer by resource, phone, Tokyo default | 1,851 KB (incl. 423 KB places JSON) | **1,473 KB** (no places JSON; fonts 189 KB vs 179) | `probe-transfer.js` |
| Transfer by resource, phone, Tokyo Atlas | 1,400 KB | **1,590 KB** (Leaflet 144 KB now loads on the phone at once) | `probe-transfer.js` |
| `beta:metrics` Tokyo default: bytes · FCP 4× | 3.03 MB · 1,124 ms | **1,952 KB · 464 ms (median of 4 runs: 356–508)** | metrics |
| `beta:metrics` Tokyo Atlas: bytes · FCP 4× | — | **2,043 KB · 420 ms** | metrics `--view atlas` |
| axe serious/critical, 60 runs (15 pages × 2 viewports × 2 themes) | 56 nodes in 8 runs | **56 nodes in 8 runs**: all `nested-interactive`, all on Insights (7 chart SVGs with `role="img"` that contain 222 bar links on Tokyo). Everything else: 0. | `probe-axe.js` |
| B-23 contrast, light + night | 0/0 (pilots) | 0/0 on all 84 place pages, the hubs and the landing page | metrics |
| Vietnamese title, platform fonts (CDP) | Bodoni Moda ×24 + **Liberation Serif ×2** (fallback mid-word) | **Playfair ×26**, no fallback; body Inter ×169 | `probe-type.js` |
| Macron at DPR 1 | visible (opsz patch) | visible, sturdier, no patch | `crop-dpr1-macron-r5-r6.png` |
| Rendered weights on place pages | 400 · 450 · 460 · 500 · 600 · 650 · 700 | **400 · 500 · 600 · 700** | `probe-type.js` |
| Rendered weights on the landing page and hubs | 450 · 500 · 600 · 650 | **still 450 · 650** (inline page style, 8.6 KB, not normalized) | `probe-type.js`, `index.html` |
| Numeric-only elements set in tabular figures (18 page × viewport samples) | 0 / 703 | **124 / 695** (18 %); landing and hub counts are still proportional | `probe-type.js` |
| CSS: raw vs token, font-size | 307 raw of 325 · 51 distinct raw | **118 raw of 329** · 44 distinct raw | `probe-css.py` |
| CSS: raw radius · raw letter-spacing · raw shadow | 107 · 42 · 31 | 65 · 41 · 32 (10 / 13 / 21 distinct) | `probe-css.py` |
| Rendered font-size steps between 12 and 17 px on Tokyo (Gallery, Atlas) | 9: 12 · 12.5 · 13 · 13.5 · 14 · 14.5 · 15 · 16 · 17 | **7**: 12 · 12.5 · 13 · 14 · 15 · 16 · 17 | `probe-type.js` |
| Whole beta, default view (`--all`, 179 pages): over 2.0 MB · FCP 4× over 1.0 s | not measured (pilots only) | **0 · 0** (largest Okinawa 1,979 KB; slowest Miami 836 ms) | metrics |
| "What changed" pages failing AA in light (phone) | not measured; with the R6 harness, 2 of 3 sampled R5 pages fail identically (Akron, Erie; Tokyo passes in both) | **66 of 84**: bottom-bar labels 2.86:1 | metrics |
| Photographs | 0 | **0** (`CREDITS.json` 0 rows; manifest 146 targets, 121 with a candidate) | tree |
| JS errors on the captured flows | 0 | 0 | shots log |

## Typography & style sub-scorecard (inside A)

The program defines eight areas: the display and UI faces; scale and rhythm; colour and skins; spacing, radius and
elevation; components; iconography; motion; and consistency. I scored them on the designer's own 30 items, so that each
claim can be checked line by line. **"Claim"** is the designer's "B as built" column in
[`style/scores.json`](../style/scores.json). **"Before"** is the designer's score for the pre-W6 tree; I spot-checked it and
accept it as the baseline (the Vietnamese fallback, the 450/460/650 weights and the 0 tabular figures all reproduce on R5).

| Area | # | Item | Before | Claim | **Evaluator R6** | Evidence (R6) |
|---|---|---|---:|---:|---:|---|
| Faces | T1 | Display legibility, 15–24 px | 4 | 8 | **8** | Macrons visible at DPR 1 on the 21 px card name and the 16 px italic dek (`crop-dpr1-macron-r5-r6.png`). Playfair at opsz 28 holds its hairlines at running sizes. |
| | T2 | Display character, luxury × fun | 8 | 8 | **7** | The italic and the swash ampersand keep the fun. But one opsz-28 instance is also used at 64–112 px, where the hero reads heavier and more bookish than R5's Didone (`tokyo-d`, `landing-m`). |
| | T3 | UI legibility, 12–16 px | 6 | 9 | **9** | Inter on every UI sample (CDP), crisp at 12–15 px. |
| | T4 | UI weights, hierarchy, numbers | 5 | 9 | **7** | Place pages render only 400/500/600/700. The landing page and hubs still render **450 and 650** (38 and 29 elements). Only **18 %** of numeric-only elements use tabular figures; landing and hub counts are proportional. |
| | T5 | Diacritics | 3 | 9 | **9** | Vietnamese is set in one face (Playfair ×26, Inter ×169, no fallback; R5 fell back to Liberation Serif mid-word). Macrons hold at DPR 1. |
| | T6 | CJK fallback | 6 | 8 | **8** | The stacks name a Mincho / Noto Serif JP chain for display and a Hiragino Sans / Noto Sans JP chain for UI. In this container, display CJK falls to a sans because no CJK serif is installed: a sandbox artefact. |
| | T7 | Weight / optical-size range | 4 | 8 | **7** | Four weights used well, but a single static optical size for 15–112 px (see T2). |
| | T8 | File weight | 8 | 8 | **8** | 189 KB of woff2 on Tokyo (R5 179 KB); only the subsets a page sets are fetched. |
| Scale & rhythm | S1 | Type-scale discipline | 4 | 8 | **6** | Tokenisation improved a lot: 118 raw font-size declarations of 329 (R5: 307). But the scale itself did not shrink: 44 distinct raw sizes (R5 51), and Tokyo still renders 7 steps between 12 and 17 px (R5: 9): 12, 12.5, 13, 14, 15, 16 and 17, plus 13.5 px on the landing page and hubs. |
| | S2 | Line-height and measure | 7 | 7 | **6** | The wider faces create widows the R5 type did not have: "· 1 / closed" in the phone masthead, "6 / countries" under the landing rail title, "Edo-Tokyo / Museum" in the desktop dek, "How we / choose" in the compact desktop masthead (Atlas, Guidebook, Insights) and "of / Tokyo" under the ★ row. |
| | S3 | Letter-spacing and uppercase | 6 | 7 | **6** | 13 distinct raw letter-spacings, as in R5. Uppercase stays disciplined. |
| Colour & skins | C1 | Colour, light | 8 | 8 | **8** | Unchanged; AA. |
| | C2 | Colour, night | 7 | 8 | **8** | The shadow set is now complete in the night edition; AA 0/0 on all 84 place pages, the hubs and the landing page. |
| | C3 | Per-city skins | 8 | 8 | **8** | Unchanged. |
| Spacing, radius, elevation | P1 | Spacing rhythm | 7 | 7 | **7** | Unchanged. |
| | P2 | Radius | 5 | 8 | **7** | Cards 12, sheets 20 and pills 999 now hold. Still stray: 13 px (20 elements in the sheet), 3 px, and 16 px on the landing page; 10 distinct raw radii (R5 17). |
| | P3 | Elevation | 6 | 9 | **8** | A real 3-step token set with night values. 32 raw shadow declarations remain (21 distinct), mostly focus rings and insets. |
| | P4 | Borders | 7 | 7 | **7** | Unchanged. |
| Components | K1 | Cards | 8 | 9 | **8** | Better meta legibility and tabular ranks. Structure unchanged. The Cleveland lead card still shows Slyman's next to "Start with Larder Delicatessen and Bakery" (`cleveland-d`). |
| | K2 | Chips and pills | 7 | 8 | **8** | Tabular counts on the toolbar chips. |
| | K3 | Buttons | 7 | 8 | **8** | One radius family. |
| | K4 | View switcher | 8 | 8 | **8** | Unchanged. |
| | K5 | Place sheet | 7 | 8 | **8** | The Vietnamese title is now one face (`sheet-vn`). |
| | K6 | Filter tray | 7 | 7 | **7** | Unchanged. |
| | K7 | Rails | 7 | 7 | **7** | Unchanged on Gallery. In desktop Atlas the slim list panel shows only the signature tile. |
| | K8 | Charts and stat tiles | 6 | 9 | **7** | Tabular stat and chart values ✅. The legend wraps ("Other sources" on its own line, `tokyo-insights-d`). Every chart SVG fails axe `nested-interactive` (serious, pre-existing). |
| | K9 | Masthead | 8 | 8 | **7** | New orphans on the desktop compact masthead ("How we / choose") and the phone masthead ("1 / closed"). |
| Iconography | I1 | Iconography | 8 | 8 | **8** | Unchanged. The new map controls reuse the icon set. |
| Motion | M1 | Motion | 8 | 8 | **7** | Tokenised and reduced-motion safe, and the tray detents are a good addition. There is still no signature moment. |
| Consistency | X1 | Consistency across the four views and the hubs | 6 | 8 | **6** | Place pages are on the new tokens. The landing page and hubs are not (450/650 weights, 13.5 px). `DESIGN-SYSTEM.md` still documents Bodoni Moda + Figtree, 16/24 radii and four elevations. |
| | | **Total (of 300)** | **196** | **240** | **223** | |

By area: faces 63/80 · scale & rhythm 18/30 · colour & skins 24/30 · spacing, radius & elevation 29/40 ·
components 68/90 · iconography 8/10 · motion 7/10 · consistency 6/10.

**Reading.** W6 is a real improvement: +27 on this card, from 196 to 223 (65 % → 74 %). The claim of 240 overstates it by
17 points. The difference is concentrated in three things:
- the rebuild stops at the place pages (T4, X1);
- the scale was tokenised but not reduced, and the wider faces reflow lines (S1, S2, K9);
- the charts carry a serious accessibility defect (K8).

**15 of 30 items are below 8.** This is how the sub-scorecard feeds A: Typography R5 85 → R6 87, and Visual polish is held
at 80 (the Vietnamese and macron gains are offset by the new widows).

## Evidence per dimension

### A. Look & feel — R5 76 → R6 77

| Sub-criterion | R5 | R6 | Evidence (R6) |
|---|---:|---:|---|
| Visual polish | 80 | 80 | **Better:** <br>• Vietnamese names no longer switch typeface mid-word, which showed on every Vietnam page (`sheet-vn`); <br>• macrons hold without patches; <br>• one weight and radius family on the place pages; <br>• Atlas reads as one calm map surface (`tokyo-atlas-d`, `chinatown-atlas-m`). <br>**Worse or still open:** <br>• new widows from the wider faces (S2 above); <br>• the Cleveland lead card (Slyman's) still disagrees with its "Start with Larder…" button, which sits in the default first screen (`cleveland-d`); <br>• on the phone map, the zoom and locate buttons sit over cluster bubbles, and the stacked controls (view, List, Must see, Street, Legend) reach 232 px down an 844 px screen (`tokyo-atlas-m`); <br>• on desktop, a pin click or an Atlas deep link scrolls the page, which leaves a ~90 px band of page content under the map (`atlas-pin2card-d-r6`, `atlas-place-d`). |
| Imagery | 63 | 63 | Unchanged: **0 photographs**, so the cap applies. The candidate manifest and the fetch workflow are ready but blocked on the owner. |
| Typography | 85 | 87 | See the sub-scorecard: real fixes (Vietnamese, macrons, tabular figures, one UI face that reads well at 12–15 px), offset by a loose scale, unfinished landing and hub pages, and new widows. |
| Layout | 86 | 87 | Atlas is map-first on both form factors: a 390×784 map under a 60 px header, and a 64 % full-height map on desktop. Minus the desktop scroll band and the crowded phone controls. |
| Motion / delight | 60 | 60 | Unchanged. The tray detents are welcome, but there is still no signature moment. |
| Luxury + fun | 82 | 81 | The sturdier display face reads less couture at hero sizes (`landing-m`, `tokyo-d`). The fun layer is unchanged. |
| Wanderlust | 77 | 78 | The map-first Atlas invites wandering: the city's pins fill the phone screen with an area legend. There are still no photographs. |
| **A (mean)** | **76** | **77** | (80 + 63 + 87 + 87 + 60 + 81 + 78) / 7 = 536 / 7 = 76.6 |

How R6 compares with the leader families, described neutrally:
- **Map-led local guides.** Our Atlas now opens on the map, with a ranked tray, as theirs do. Ours adds sources on every card
  and dated closures on the legend.
- **Grid-browse products.** Unchanged since R5: our cover cards against their photographs.
- **Photo-led luxury products.** The gap is still photographs and a signature motion moment. The display face is now
  sturdier and a little less couture than theirs.

### B. UX & ergonomics — R5 86 → R6 88

| Area | R5 | R6 | Evidence |
|---|---:|---:|---|
| First screen | 90 | 90 | The default view is unchanged. Tokyo: B-01 0.52, B-03 7. B-01, B-02 and B-03 pass on all 84 place pages. B-04 (rail on the first phone screen) fails on 23 of 84 pages in the default view (Chinatown already failed in R5). B-16 is 1.5–1.6 in the cover grid, as in R5. |
| Discovery | 92 | 91 | Unchanged in Gallery. In Atlas the rail is one swipe up on phones (B-04 ❌ by design, D-36), and on desktop the slim panel shows only the signature tile, so "For you", "Your day" and "Near me" sit behind a horizontal scroll. |
| Map ↔ list | 80 | 90 | **Fixed:** <br>• one tap from Gallery to the map (R5 follow-up); <br>• map-first Atlas with peek/half/full on phones; <br>• a 64 % map on desktop, hover → pin, pin → card, fly-to (Kanda Myōjin's pin lands at the map centre, `atlas-place-d`); <br>• legend, map style, opt-in locate and Must see on the map. <br>**Open:** <br>• the number label is not clickable: the hit target is a 10–14 px dot beside it; <br>• on phones at the opening zoom every marker is a cluster bubble drawn like a rank pin (a ring with a number), so "17" can read as place no. 17; <br>• on Cleveland, pin → card lights a card that stays out of view; <br>• a day route does not fit above the tray (stop 6 sits under it, `day-m`). |
| Filters | 90 | 90 | Unchanged. Must see on the map uses the same `t=1` lens, so the list follows. |
| Detail | 90 | 90 | Unchanged. The phone pin sheet has Close and Open, and Back closes it. |
| Mobile | 85 | 85 | The map-first phone Atlas works, and the phone map is one tap from the default. **But** in phone Atlas the city title and the "last checked" line are hidden under the map at every detent, so the page has no visible name and no dated provenance. On the first screen, 24 targets are under 44 px: the cluster bubbles (34 and 40 px). Individual pins are 10 px dots. |
| Accessibility | 88 | 84 | axe was run on every view for the first time: **0 serious or critical outside Insights**, but `nested-interactive` (serious) on every Insights chart, 7 per page, because `role="img"` SVGs contain the bar links. The same defect is in R5. It is newly measured, not a regression. <br>The full sweep adds two more defects. Both pre-date W6: they reproduce with this harness on the R5 pages I sampled. on **66 of 84 "What changed" pages** the phone bottom-bar labels (Explore, Search, Your list, Method) are **2.86:1 in light** (AA needs 4.5:1), and 14 of them have a target under 44 px. Place pages, hubs and the landing page: AA 0/0 in light and night, focus 30/30. R5 would have scored about the same on this evidence, so the drop from 88 is measurement, not regression. |
| Performance | 70 | 84 | **Back within budget** (mostly the R5 follow-up): Tokyo default 1,952 KB and FCP 4× median 464 ms (R5 3.03 MB and 1,124 ms). Across the whole beta, 0 of 179 pages are over 2.0 MB or over 1.0 s FCP 4× (largest Okinawa 1,979 KB; slowest Miami 836 ms). **Still open:** Tokyo Atlas is 2,043 KB in the harness, over the 2.0 MB line the default view is held to. By resource, phone Atlas grew from 1,400 to 1,590 KB because Leaflet now loads at once; a `#p=` deep link on a phone still builds 12.8 k nodes in Gallery; eager JS is 40.45 KB gzip against a 40 KB budget (FE-A's figure). |
| **B (mean)** | **86** | **88** | (90 + 91 + 90 + 90 + 90 + 85 + 84 + 84) / 8 = 704 / 8 = 88.0 |

### C. Competitor feature coverage — R5 96 → R6 96

On `2f227631` I re-checked the rows that W6 touches by hand, and the rest through the harness rows behind them (B-06/07/09/10/17, G1, G6 and the gates). No status changed. The rows that Atlas map-first touches all still hold:

| # | Feature | R5 | R6 | Note |
|---|---|---|---|---|
| 6 | Licensed landmark photos | ✕ | ✕ | 0 credits. The candidate manifest (146 targets) and the fetch workflow are ready; the hosts and the key are an owner action. |
| 7 | Desktop split view, two-way sync | ✅ | ✅ | Stronger: a 64 % map, hover → pin, pin → card, fly-to. |
| 8 | Mobile list first, map toggle, pin → sheet with detents | ✅ | ✅ | The default view (Gallery) is still list-first, with the map one tap away. Atlas is now map-first with a list tray, and pin → sheet → Back works. |
| 9 | Numbered pins matching the list | ✅ | ✅ | 488/488 on desktop. On phones the opening zoom shows clusters (see B). |
| 20 | Day plan with route line | ✅ | ✅ | The route draws on the map-first Atlas (`day-m`). |
| 29 | Near me, opt-in | ✅ | ✅ | The new locate control is opt-in: 0 calls before the tap and nothing stored. |
| 30 | Multilingual UI | ◐ | ◐ | Unchanged: no reviewed second locale. |

R6 tally: ✅ 33 · ◐ 1 (#30) · ✕ 1 (#6). Coverage is (33 + 0.5) / 35 = **95.7 % → 96**.

### D. Unique strengths — R5 89 → R6 89

| Strength | R5 | R6 | Evidence |
|---|---:|---:|---|
| Sourced picks; attribution as navigation | 94 | 94 | G6: 0 cards without "Recommended by" (metrics). |
| Verified pins | 91 | 92 | The pins are now the hero of Atlas, with a legend that explains area colours, Must see and closed pins. |
| Closure honesty | 95 | 95 | The legend says "Grey pin = closed, kept for the record". But phone Atlas hides the "last checked" line (see B). |
| Interest triad | 81 | 81 | Unchanged |
| Anime layer | 85 | 85 | Unchanged |
| "Your guide" and day plans | 78 | 77 | Day routes draw on the map-first Atlas. On phones, the day summary card (stops, km) now sits below the tray's peek, and on desktop the "Your day" tile is off-screen in the slim panel. |
| Stated gaps | 89 | 89 | Unchanged |
| **D (weighted judgement)** | **89** | **89** | The mean is 87.6, and sourcing and closure honesty weigh most. |

## Design-conformance checklist (D1–D11)

| # | Designed item | R6 | Evidence |
|---|---|---|---|
| D1 | Four switchable views, view in the hash, preference remembered | ✅ | 84/84 place pages carry all four view buttons. A `#view=insights` link in a fresh browser context opens Insights. Switching Tokyo to Guidebook and then opening Tokyo and Cleveland with no hash opens Guidebook (remembered). `test-views.js`: every place by scroll, `#p=`, `q=` and print in every view, 0 errors. |
| D2 | Atlas is map-first | ◐ | **Met:** phone map 390×784 under a 60 px header; tray peek 27 % → half 52 % → full 85 %; the peek shows the area chip ("Chiyoda-ku 43"), "All 488" and the rank-1 card; desktop map 64 % with a 31 % list; 488 numbered pins matching card ranks; hover → pin; pin → card; fly-to; area legend; map style (OSM/Esri only); opt-in locate; Must see on the map; clustering only below z13. **Not met:** on phones there are no numbered rank pins at the opening zoom (26 count bubbles drawn like rank pins); the number label is not the hit target; Cleveland pin → card does not bring the card into view; phone Atlas hides the city title and "last checked". |
| D3 | Gallery | ✅ | Rows plus an "All N" grid; a lead card in the first phone screen; covers vary by kind (Cleveland's sights stay on the compass motif, a stated gap); `#view=gallery&p=` opens the right sheet (`galsheet`). |
| D4 | Guidebook | ✅ | Contents first (13 chapter links), lazy chapters plus a lazily mounted "Sources and method" appendix (`#gb-sources`), print styles present; `test-views.js` print check 0 errors. |
| D5 | Insights | ✅ | 7 inline-SVG charts on Tokyo with 7 table fallbacks (`<details>`), 222 bar links into lenses (`#view=gallery&mode=…`), tabular values, 44 px rows. Its axe defect is counted under D11. |
| D6 | Fonts and styles rated, best direction built | ◐ | AUDIT and DECISION exist; direction B ships on the place pages; the fonts are self-hosted OFL woff2 with both licence files; Vietnamese, macrons and the CJK stacks verified. **But** the landing page and hubs are not rebuilt (450/650 weights, 13.5 px), and 15 of 30 sub-scores are under 8. The sub-scorecard gives the reason for each, and every one is fixable, so none of them excuses the row. |
| D7 | melon-seek ideas: one token set, 3-step elevation, consistent radius, crisp UI face, tabular charts | ◐ | The tokens exist and most CSS uses them (raw font sizes 307 → 118). **But** `DESIGN-SYSTEM.md` was not updated (it still documents Bodoni Moda + Figtree, 16/24 radii and four elevations), and stray values remain: 44 raw font sizes, 10 raw radii, 21 raw shadows, 13 raw letter-spacings. |
| D8 | Luxury yet fun, wanderlust: each ≥ 8/10 | ◐ | Luxury + fun 81 (8.1 ✅). Wanderlust 78 (7.8 ✕). |
| D9 | Real photographs | ✕ (owner) | 0 photos and 0 credit rows. **Blocked on the owner:** `api.unsplash.com` and `images.unsplash.com` (and/or the Wikimedia hosts) must be allowed and `UNSPLASH_ACCESS_KEY` set. Ready: the manifest (146 targets, 121 with a candidate, 72 high confidence), `fetch-unsplash.js`, the Actions workflow and the credit gate. |
| D10 | Honesty rules | ✅ | validate, test (13 suites) and beta:check green; 8,458 places, beta == live; `test-honesty.js` no-brand scan 0 hits; `check-google.py` 88 maps clean; tiles OSM and Esri only; closures flagged (G6, B-12). |
| D11 | Performance and accessibility | ◐ | **Met:** Tokyo default 1,952 KB ≤ 2.0 MB and FCP 4× 464 ms ≤ 1.0 s; every page of the beta within both. AA 0/0 in light and night on place pages, hubs and the landing page. **Not met:** axe reports serious `nested-interactive` on every Insights page (56 nodes over 8 runs, pre-existing); AA fails in light on 66 "What changed" pages (bottom-bar labels 2.86:1, pre-existing); 14 "What changed" pages have a target under 44 px; phone map pins are 10 px dots. |

**Summary:** ✅ 5 (D1, D3, D4, D5, D10) · ◐ 5 (D2, D6, D7, D8, D11) · ✕ 1 (D9, owner).

## Points blocked on the owner

These points cannot be earned by any build wave. Estimates are mine, using this round's sub-scores.

| Owner action | What it unblocks | A | B | C | D | **Overall** |
|---|---|---:|---:|---:|---:|---:|
| **Real photographs** (D9): allow `api.unsplash.com` + `images.unsplash.com` (and/or the Wikimedia hosts) and set `UNSPLASH_ACCESS_KEY`, then run the ready workflow | The imagery cap lifts (Imagery 63 → ~85), Wanderlust 78 → ~86, Luxury + fun 81 → ~85, Visual polish +1; C #6 ✕ → ✅ | +5.0 | — | +2.9 | — | **≈ +2.6** |
| **A reviewed second locale** | C #30 ◐ → ✅; the switcher appears by rule | — | — | +1.4 | — | **≈ +0.3** |
| **The price/rating prose call** (269 places whose record prose carries prices or ratings, shown verbatim in the Guidebook; pending since W3) | Detail and sourced-picks honesty can be closed either way, by stripping or by labelling as dated quotes | — | +0.5 | — | +0.5 | **≈ +0.2** |
| **Total owner-blocked** | | **+5.0** | **+0.5** | **+4.3** | **+0.5** | **≈ +3.1** |

Separately from those, the team can still earn **about 2.5 overall points** (the gaps below). Of the 14.6 points between
R6 and 100, about 3.1 (a fifth) are owner-blocked and about 2.5 are recoverable through the gaps below. The rest is not
tied to any single change I can name with confidence.

## Top gaps, ranked by points recoverable

Gain = weight × the dimension points if the change fully lands. Each acceptance is a test that the next wave can run.

| # | Gap | Acceptance (testable) | Lane | Gain |
|---:|---|---|---|---:|
| 1 | **No signature motion moment** (Motion 60, M1 7) | One action-driven moment on the primary path, for example the tapped cover or pin growing into the sheet. It must be visible in a capture **without** reduced motion, run ≤ 400 ms, and do nothing under `prefers-reduced-motion` (a test asserts 0 animations then). No autoplay. | designer + FE-A | A +1.7 → **+0.69** |
| 2 | **Atlas residuals** (Map ↔ list 90, Mobile 85, D2 ◐) | (a) The visible number label opens the place: `pointer-events` on, and a hit target of ≥ 44 px on phones (≥ 24 px with spacing on desktop). (b) Cluster bubbles are drawn differently from rank pins (no ringed number that can read as a rank). (c) `probe-atlas.js` pin → card reports `cardInView: true` on Tokyo, Cleveland and Chinatown. (d) A desktop pin click or `#view=atlas&p=` does not scroll the page (no band under the map). (e) A day route fits above the tray's peek. (f) In phone Atlas the city name and "last checked" are visible at peek (hit test passes). | FE-A | B +1.3, A +0.3, D +1 → **+0.57** |
| 3 | **Type rebuild unfinished** (T4, S1, S2, K9, X1; D6/D7 ◐) | (a) `probe-type.js` on the landing page and hubs renders only 400/500/600/700, and no 13.5 px. (b) ≤ 5 rendered steps between 12 and 17 px on every sampled page. (c) No single-word last line in the dek, the masthead stat line, the compact desktop masthead and the rail subtitle at 390 and 1440 (`text-wrap: balance/pretty` or copy). (d) Hero sizes ≥ 40 px use a higher optical-size instance. (e) `probe-css.py`: ≤ 12 distinct raw font sizes and ≤ 4 raw radii. (f) `DESIGN-SYSTEM.md` documents the shipped faces, radii and the 3-step elevation. | designer | A +1.0 → **+0.40** |
| 4 | **Accessibility debt found by the full sweep** (Accessibility 84, D11 ◐; all pre-existing) | `probe-axe.js` reports **0 serious/critical** on every page, viewport and theme: the Insights bars stay links, but no `role="img"` element contains them (for example `role="group"` with a label). `beta:metrics:all` reports B-23 ✅ and B-20 ✅ on all 84 "What changed" pages (bottom-bar labels ≥ 4.5:1 in light, targets ≥ 44 px). | FE-B + platform + QA | B +1.25 → **+0.31** |
| 5 | **Performance residue** (Performance 84) | `metrics.js --view atlas --only cities/tokyo` ≤ 2,000 KB (load Leaflet after first paint, or trim it). A `#p=` deep link on a phone builds ≤ 3,000 nodes at load. Eager JS ≤ 40.0 KB gzip with no rounding. | platform + FE-A | B +0.75 → **+0.19** |
| 6 | **Cleveland sights on the compass motif** (Imagery) | The 148 sights get collection ids through the live pipeline (PM backlog; out of beta scope), and the motif follows by rule. | PM → live pipeline | A +0.4 → **+0.17** |
| 7 | **Atlas rail on desktop** (Discovery, "Your guide") | In desktop Atlas, "For you", "Your day" and "Near me" are reachable without a horizontal scroll (a second row, or a compact list), and B-04 is reported for Atlas desktop. | FE-A | B +0.1, D +0.5 → **+0.10** |
| 8 | **Cleveland lead card ≠ "Start with" button** (carried from R5 #5) | On every city page, the "Start with" button names the place shown on the lead card (a test over the 84 pages). | FE-A | A +0.1 → **+0.06** |

## What R6 got right (keep)

- **Atlas is the map, as the owner asked**, without losing anything that worked: deep links, `#view=atlas&map=1`, day
  routes, saved lists, Near me and closures all still work. The map tools load lazily in `atlas.js`, so other views pay
  nothing for them.
- **Locate-me is genuinely opt-in**: no geolocation call until the tap, and nothing stored.
- **Only no-key tiles** (OSM and Esri) behind the new map-style switch; `check-google.py` stays clean on 88 maps.
- **The type change fixed the defects it set out to fix**, and the designer measured them: Vietnamese in one face, macrons
  without patches, tabular figures on counts and charts, and self-hosted OFL fonts with their licence files.
- **The R5 follow-up** took the default view back under budget (Tokyo 1,851 → 1,473 KB by resource) and made the phone map
  one tap away.
- **The imagery lane stayed honest.** It built a candidate manifest and a fetch workflow, but shipped no photograph it could
  not credit.
- 0 JS errors across the captured flows; every gate green; every place reachable in every view.

## Reproduce

```bash
git worktree add ../eval-r6 2f227631 && cd ../eval-r6/tools && npm install && npm run validate && npm test && npm run beta:check
npm run beta:metrics:all -- --out <scratch>/all.json                          # all 179 pages, default view
node beta/metrics.js --only cities/tokyo --out <scratch>/tokyo.json           # default-view budget re-runs
node beta/metrics.js --view atlas --only cities/tokyo --out <scratch>/atlas.json
python3 -m http.server 8801                                                    # from ../eval-r6 (R6)
# R5: `git archive f2bf7610 | tar -x` served on 8802; R5 follow-up: `git archive 63932912` on 8803
E=design/beta/eval/r6/tools
node $E/shots-r6.js r6 8801 <out>/r6 && node $E/shots-r6.js r5 8802 <out>/r5
node $E/shots-night.js 8801 <out>/r6 && node $E/shots-night.js 8802 <out>/r5
python3 $E/pair.py <out>/r5 <out>/r6 design/beta/eval/r6 landing,japan,tokyo,tokyo-atlas,...
node $E/probe-atlas.js 8801 cities/tokyo.html      # also cleveland.html, Singapore/chinatown.html
node $E/probe-axe.js 8801 tools/beta/qa/vendor/axe.min.js <out>/axe-r6.json   # and 8802 for R5
node $E/probe-type.js 8801 R6 <out>/type-r6.json   # and 8802 R5
python3 $E/probe-css.py <tree> R6
node $E/probe-transfer.js && node $E/crop-dpr1.js <out>
```
