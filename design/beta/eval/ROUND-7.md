# Evaluation round 7 — independent evaluator

> 2026-10-11 · evaluator lane (no build lane)
> **Measured:** R7 is the beta at `badcc20d`, the W7 head: design system v2 (bone, ink and one oxblood accent, Bricolage
> Grotesque + Inter), the city pages and views rebuilt image-first, landing and hubs rebuilt search-first, Atlas rebuilt as
> map-search, the platform lane's accessibility and performance work, and 131 credited Wikimedia Commons photos fetched
> without a key. `npm run validate`, `npm test` (all suites) and `npm run beta:check` are green on that SHA: 179 pages,
> 84 place pages, 8,458 places, beta == live. Nothing after `badcc20d` is scored here.
> **Baseline:** R6 is the beta at `2f227631`, scored 85.4 in [ROUND-6](ROUND-6.md). What is live now is the R5 follow-up `63932912`.
> **Rubric:** unchanged since ROUND-1: the same four dimensions and weights, the same A/B sub-criteria, the same 35-row
> feature table for C and the same D strengths. As in R6, a **Typography & style sub-scorecard** sits inside A, and the
> **design-conformance checklist** now has 13 rows (D1–D13, [ROUNDS-6-9](ROUNDS-6-9.md)).

## Verdict

R7 scores **88.5 / 100** (R6 85.4, **+3.1**): A 83, B 91, C 96, D 89.

- **A gains the most** (+6). The overhaul replaced the art direction rather than polishing it, and it shows on every page
  I captured: a calm bone ground, one quiet accent, borderless image-first cards, a compact header with a search pill, and
  real credited photographs on the landing page, 32 guide heroes, 5 country hubs and the top sights of 5 guides. The type
  rebuild is finished this time: only 400/500/600/700 render anywhere, the landing page and hubs are on the same tokens,
  and 68 % of numeric elements use tabular figures (R6 18 %). The signature motion exists (the tapped card grows into the
  sheet in 340 ms, nothing under reduced motion).
  What holds A back:
  - photographs cover only **94 of the 2,901 eligible places** (3 %), and 52 of 84 guides have no hero, so most rows are
    still sand placeholders;
  - a set of visible polish defects (below);
  - the R6 widows are still there.
- **B gains +3.** Atlas map-search works as designed:
  - desktop: a 60 % map with a 2-column card grid, search as I move the map, "Show all", hover sync both ways and pin →
    preview → detail;
  - phone: a full-screen map with a synced carousel and a List/Map pill.
  The platform lane cleared the R6 accessibility debt: axe finds 0 serious or critical issues in 80 runs (R6: 56 nodes),
  and the light-theme contrast failure on 66 "What changed" pages is gone (0 of 179 pages fail B-23). Every page loads
  under 2.0 MB at first load.
- **C stays at 96.** Row 6 (photos) moves ✕ → ◐. Row 4 moves ✅ → ◐: the per-city skins were retired by design, and
  only the 32 guides with a hero photo still look local.
- **D stays at 89.**
- **Typography & style, re-scored by the evaluator: 241 / 300** (R6 223). The designer scored v2 on a different card
  (11 palette criteria, 100/110). I checked those claims line by line below. I agree on 6 of the 11 and score 5 lower.
- **Conformance: ✅ 6 · ◐ 7 · ✕ 0** (D1–D13).
- **Owner-blocked: about 0.6 overall points** (a reviewed second locale, the price/rating prose call, and a small
  photographic top-up that needs the Unsplash key). The keyless Commons path means **most of the photographic gap is now
  the team's to close**. The team can still earn about **3.0 points** through the gaps below.

## Scorecard

| Dimension (weight) | R5 `f2bf7610` | R6 `2f227631` | **R7 `badcc20d`** | Δ R6→R7 |
|---|---:|---:|---:|---:|
| A. Look & feel (40 %) | 76 | 77 | **83** | +6 |
| B. UX & ergonomics (25 %) | 86 | 88 | **91** | +3 |
| C. Competitor feature coverage (20 %) | 96 | 96 | **96** | 0 |
| D. Unique strengths (15 %) | 89 | 89 | **89** | 0 |
| **Overall (weighted)** | **84.5** | **85.4** | **88.5** | **+3.1** |

R7 = 0.4×83 + 0.25×91 + 0.2×96 + 0.15×89 = 33.2 + 22.75 + 19.2 + 13.35 = **88.50**.

## Method

The method is ROUND-6's, re-pointed at the new DOM where W7 changed it.

1. **Gates.** In a detached worktree at `badcc20d` I ran `npm install --no-audit --no-fund`, then `npm run validate`,
   `npm test` and `npm run beta:check`. All passed: `ALL PASS`, 88 maps clean in `check-google.py`, 179 pages contract
   OK, imagery credit gate OK, i18n OK, `beta == live`. (`npm ci` cannot run because the lockfile is gitignored.)
2. **Servers.** That tree was served on port 8811 (R7) and a detached worktree at `2f227631` on port 8812 (R6).
3. **Screenshots.** Taken with [`r7/tools/shots-r7.js`](r7/tools/shots-r7.js), using R6's settings:
   - 390×844 @2× touch and 1440×900, light theme, reduced motion;
   - off-origin requests aborted and tiles answered with a flat stub tile. **A blank map ground is a sandbox artefact**,
     not the product's map styling;
   - the same 4 saved refs.

   The flows are R6's set plus every pilot (Cleveland, Tokyo, New York, Chinatown, Wheeling) in all four views. The R6
   tray detents are replaced by the Atlas List toggle. A dark-context set and a closed-place sheet are added. Both
   rounds ran the same script; 0 page errors and 0 failed flows in either. Logs: [`r7/shots-r6-log.json`](r7/shots-r6-log.json),
   [`r7/shots-r7-log.json`](r7/shots-r7-log.json). Composites were made with [`r7/tools/pair.py`](r7/tools/pair.py).
   - [`r7/tools/shots-extra.js`](r7/tools/shots-extra.js) covers what the generic harness cannot reach: zoom through the
     cluster bubbles, then pin → carousel (phone) and pin → preview → detail (desktop); the closed sheet; and the motion
     check, with and without reduced motion. The mid-transition frame is blank: Chromium does not paint a view
     transition into a screenshot, so I measured the motion instead (`r7/motion-r7.json`).
4. **Metrics.** `npm run beta:metrics:all` on all 179 pages: [`r7/beta-metrics-all-r7.md`](r7/beta-metrics-all-r7.md).
   - Part of that sweep overlapped the screenshot runs, so the budget figures come from separate re-runs on an idle
     container: Tokyo ×3 in the default view, ×2 with `--view atlas` ([`r7/budgets-r7.md`](r7/budgets-r7.md)).
   - **Harness rows that no longer see the product:** B-06, B-07 and B-09 still look for the R6 Atlas DOM (`.mappane`,
     the tray, `pin-n` labels). They report ❌ on all 84 place pages. B-06 and B-09 also failed on all 84 in R6's
     default-view sweep. I did not score those three rows. I measured the same behaviour with the Atlas lane's
     acceptance probe and my own probe (next item). QA should re-point them and ratify the change (the W7 brief's rule).
5. **Probes** (in `r7/tools/`):
   - **Atlas lane probe, re-run.** I re-ran the lane's own acceptance probe `tools/beta/atlas-ms.js --no-shots`
     unchanged: 99/99 PASS ([`r7/atlas-ms-rerun.txt`](r7/atlas-ms-rerun.txt)).
   - [`probe-atlas-r7.js`](r7/tools/probe-atlas-r7.js), my independent residual probe. It measures:
     - pin hit-target size;
     - cluster vs rank-pin styling;
     - photo credits clipped in the carousel;
     - "last checked" on the first phone screen;
     - the day route against the carousel;
     - page scroll on a desktop pin click and on a deep link;
     - the desktop rail and the Must see chip.

     Output: [`r7/atlas-probe-r7.json`](r7/atlas-probe-r7.json), with [`probe-day.js`](r7/tools/probe-day.js) and
     [`probe-pin2card.js`](r7/tools/probe-pin2card.js).
   - [`probe-axe.js`](r7/tools/probe-axe.js): axe-core 4.10.2 on 20 pages × 2 viewports × light and dark = 80 runs
     ([`r7/axe-r7.json`](r7/axe-r7.json), [`r7/axe-summary-r7.txt`](r7/axe-summary-r7.txt)).
   - [`probe-type.js`](r7/tools/probe-type.js) (R6's, with Bricolage counted as display, plus New York and Wheeling):
     the rendered type census and CDP platform fonts ([`r7/type-census-r7.json`](r7/type-census-r7.json), compared with
     `r6/type-census-r6.json`).
   - [`probe-css.py`](r7/tools/probe-css.py): the static raw-vs-token census ([`r7/css-census-r7.json`](r7/css-census-r7.json)).
   - [`probe-transfer.js`](r7/tools/probe-transfer.js): bytes by resource, R6 vs R7, phone @3× and desktop
     ([`r7/transfer-by-resource.txt`](r7/transfer-by-resource.txt)).
   - [`probe-body.js`](r7/tools/probe-body.js): font size of running text (D13).

   No web research and no WebFetch. The designer's `style/v2/DECISION.md` and `scores.json` were read as claims and
   re-measured.

## Side-by-side (R6 → R7)

Composites are labelled R6 `2f227631` | R7 `badcc20d`. A URL with no `view=` opens Gallery in both rounds.

| Page | Mobile 390×844 | Desktop 1440×900 |
|---|---|---|
| Landing | ![](r7/landing-m-r6-r7.jpg) | ![](r7/landing-d-r6-r7.jpg) |
| Country hub (Japan) | ![](r7/japan-m-r6-r7.jpg) | ![](r7/japan-d-r6-r7.jpg) |
| Tokyo (default: Gallery) · cover grid | ![](r7/tokyo-m-r6-r7.jpg) · ![](r7/tokyo-gallery-p2-m-r6-r7.jpg) | ![](r7/tokyo-d-r6-r7.jpg) · ![](r7/tokyo-gallery-p2-d-r6-r7.jpg) |
| Tokyo · Gallery · Guidebook · Insights | ![](r7/tokyo-gallery-m-r6-r7.jpg) · ![](r7/tokyo-guidebook-m-r6-r7.jpg) · ![](r7/tokyo-insights-m-r6-r7.jpg) | ![](r7/tokyo-gallery-d-r6-r7.jpg) · ![](r7/tokyo-guidebook-d-r6-r7.jpg) · ![](r7/tokyo-insights-d-r6-r7.jpg) |
| **Tokyo · Atlas (now map-search)** | ![](r7/tokyo-atlas-m-r6-r7.jpg) | ![](r7/tokyo-atlas-d-r6-r7.jpg) |
| Atlas List toggle (phone) · R6 tray at full | ![](r7/atlas-list-m-r6-r7.jpg) | ![](r7/atlas-list-d-r6-r7.jpg) |
| Atlas pin → carousel (phone) · pin → preview → detail (desktop), R7 only | ![](r7/tokyo-atlas-pin-m-r7.jpg) · ![](r7/cle-atlas-pin-m-r7.jpg) | ![](r7/tokyo-atlas-pin-d-r7.jpg) · ![](r7/tokyo-atlas-detail-d-r7.jpg) · ![](r7/cle-atlas-pin-d-r7.jpg) |
| Atlas deep link `#view=atlas&p=kanda-myojin` | ![](r7/atlas-place-m-r6-r7.jpg) | ![](r7/atlas-place-d-r6-r7.jpg) |
| Atlas · Must see | ![](r7/atlas-must-m-r6-r7.jpg) | ![](r7/atlas-must-d-r6-r7.jpg) |
| Day route on the phone Atlas (`#view=atlas&day=TAITO`), R7 · R6 day plan | ![](r7/day-atlas-m-r7.jpg) · ![](r7/day-m-r6-r7.jpg) | ![](r7/day-d-r6-r7.jpg) |
| Map from the Gallery (phone: the floating pill) · switcher → Atlas | ![](r7/map-m-r6-r7.jpg) · ![](r7/switch-m-r6-r7.jpg) | ![](r7/map-d-r6-r7.jpg) · ![](r7/switch-d-r6-r7.jpg) |
| Cleveland · its four views | ![](r7/cleveland-m-r6-r7.jpg) · ![](r7/cle-gallery-m-r6-r7.jpg) · ![](r7/cle-atlas-m-r6-r7.jpg) · ![](r7/cle-guidebook-m-r6-r7.jpg) · ![](r7/cle-insights-m-r6-r7.jpg) | ![](r7/cleveland-d-r6-r7.jpg) · ![](r7/cle-gallery-d-r6-r7.jpg) · ![](r7/cle-atlas-d-r6-r7.jpg) · ![](r7/cle-guidebook-d-r6-r7.jpg) · ![](r7/cle-insights-d-r6-r7.jpg) |
| New York · its four views | ![](r7/newyork-m-r6-r7.jpg) · ![](r7/ny-gallery-m-r6-r7.jpg) · ![](r7/ny-atlas-m-r6-r7.jpg) · ![](r7/ny-guidebook-m-r6-r7.jpg) · ![](r7/ny-insights-m-r6-r7.jpg) | ![](r7/newyork-d-r6-r7.jpg) · ![](r7/ny-gallery-d-r6-r7.jpg) · ![](r7/ny-atlas-d-r6-r7.jpg) · ![](r7/ny-guidebook-d-r6-r7.jpg) · ![](r7/ny-insights-d-r6-r7.jpg) |
| Chinatown & CBD · its four views | ![](r7/chinatown-m-r6-r7.jpg) · ![](r7/chinatown-gallery-m-r6-r7.jpg) · ![](r7/chinatown-atlas-m-r6-r7.jpg) · ![](r7/chinatown-guidebook-m-r6-r7.jpg) · ![](r7/chinatown-insights-m-r6-r7.jpg) | ![](r7/chinatown-d-r6-r7.jpg) · ![](r7/chinatown-gallery-d-r6-r7.jpg) · ![](r7/chinatown-atlas-d-r6-r7.jpg) · ![](r7/chinatown-guidebook-d-r6-r7.jpg) · ![](r7/chinatown-insights-d-r6-r7.jpg) |
| Wheeling · its four views | ![](r7/wheeling-m-r6-r7.jpg) · ![](r7/wheeling-gallery-m-r6-r7.jpg) · ![](r7/wheeling-atlas-m-r6-r7.jpg) · ![](r7/wheeling-guidebook-m-r6-r7.jpg) · ![](r7/wheeling-insights-m-r6-r7.jpg) | ![](r7/wheeling-d-r6-r7.jpg) · ![](r7/wheeling-gallery-d-r6-r7.jpg) · ![](r7/wheeling-atlas-d-r6-r7.jpg) · ![](r7/wheeling-guidebook-d-r6-r7.jpg) · ![](r7/wheeling-insights-d-r6-r7.jpg) |
| **Place detail** (Kanda Myōjin) · from a Gallery link · Cleveland | ![](r7/sheet-m-r6-r7.jpg) · ![](r7/galsheet-m-r6-r7.jpg) · ![](r7/sheet-cle-m-r6-r7.jpg) | ![](r7/sheet-d-r6-r7.jpg) · ![](r7/galsheet-d-r6-r7.jpg) · ![](r7/sheet-cle-d-r6-r7.jpg) |
| Vietnamese sheet · closed place (Lolly the Trolley) | ![](r7/sheet-vn-m-r6-r7.jpg) · ![](r7/sheet-closed-m-r6-r7.jpg) | ![](r7/sheet-vn-d-r6-r7.jpg) · ![](r7/sheet-closed-d-r6-r7.jpg) |
| Saved · What changed | ![](r7/saved-m-r6-r7.jpg) · ![](r7/changes-m-r6-r7.jpg) | ![](r7/saved-d-r6-r7.jpg) · ![](r7/changes-d-r6-r7.jpg) |
| Dark: landing · hub · Gallery · Atlas · Insights · sheet · New York | ![](r7/landing-night-m-r6-r7.jpg) · ![](r7/japan-night-m-r6-r7.jpg) · ![](r7/tokyo-gallery-night-m-r6-r7.jpg) · ![](r7/tokyo-atlas-night-m-r6-r7.jpg) · ![](r7/tokyo-insights-night-m-r6-r7.jpg) · ![](r7/sheet-night-m-r6-r7.jpg) · ![](r7/ny-gallery-night-m-r6-r7.jpg) | ![](r7/landing-night-d-r6-r7.jpg) · ![](r7/japan-night-d-r6-r7.jpg) · ![](r7/tokyo-gallery-night-d-r6-r7.jpg) · ![](r7/tokyo-atlas-night-d-r6-r7.jpg) · ![](r7/tokyo-insights-night-d-r6-r7.jpg) · ![](r7/sheet-night-d-r6-r7.jpg) · ![](r7/ny-gallery-night-d-r6-r7.jpg) |

## Key measurements (R6 → R7)

| Measure | R6 `2f227631` | R7 `badcc20d` | Source |
|---|---|---|---|
| Photographs (credited) | 0 | **131** (Wikimedia Commons, all CC0/PD/CC BY/CC BY-SA): 37 heroes + 94 places (Tokyo 44, New York 28, Cleveland 16, Wheeling 4, Singapore 2) | `CREDITS.json` |
| Guides with a hero photo | 0 / 84 | **32 / 84** (+ 5 country hubs and the landing) | built pages |
| Eligible places with a photo | 0 / 2,901 | **94 / 2,901 (3 %)** | `IMAGERY.md` eligibility, `CREDITS.json` |
| Desktop Atlas | 64 % map, slim list | **60 % map, left, full height; 2-column card grid**; "435 places in this map area"; "53 more outside this area · Show all 488" | `probe-atlas-r7.js`, shots |
| Phone Atlas first screen | map 390×784 under a tray | **map 92 % of the screen** (390×780), chip row, carousel, List pill; city named in the header | `probe-atlas-r7.js` |
| Rank pins vs clusters | clusters drawn like rank pins | **distinct**: pins are white or sun pills with the rank (★ for Must see); clusters are ink discs | `probe-atlas-r7.js` |
| Pin hit target | 10–14 px dot; label not clickable | **the whole pill**, 26 px tall × 30–52 px wide; a tap on its corner selects the card | `probe-atlas-r7.js` |
| Pin → card (desktop) | lit card out of view (Cleveland) | the preview opens and the page does not scroll; **but when the place is outside the 40 cards shown, the lit card is not rendered** (8/8 of my sampled outer pins, Tokyo and Cleveland) | `probe-pin2card.js` |
| Desktop deep link `#view=atlas&p=` | scrolls the page, ~90 px band | **still scrolls 104 px**; a 104 px band under the map | `probe-atlas-r7.js` |
| Day route vs the phone tray/carousel | stop 6 under the tray | **fits**: route y 236–599, carousel top 708 | `probe-day.js` |
| "Last checked" on the phone Atlas screen | hidden | **still not on the Atlas screen** (0 elements) | `probe-atlas-r7.js` |
| axe serious/critical | 56 nodes in 8 runs (60 runs) | **0 in 80 runs** (moderate: `aria-allowed-role` ×56 runs, `heading-order` ×24) | `probe-axe.js` |
| B-23 contrast AA, light + night | fails on 66 pages | **0 / 179 pages fail** | metrics |
| B-20 targets < 44 px (phone) | 14 pages | **9 pages** (Akron 6, Okinawa 8 …) | metrics |
| Rendered weights, all sampled pages | 400 · 450 · 500 · 600 · 650 · 700 | **400 · 500 · 600 · 700** | `probe-type.js` |
| Rendered steps 12–17 px | 6–7 per page; 13.5 px on landing/hubs | **3–6 per page** (landing 4, hub 3–4, Tokyo desktop 4, Tokyo phone Gallery 6) | `probe-type.js` |
| Numeric elements in tabular figures | 124 / 695 (18 %) | **477 / 699 (68 %)**; still proportional in Guidebook (3/35) and Insights (9/46) | `probe-type.js` |
| CSS raw font-size / radius | 118 raw (44 distinct) / 65 raw (10 distinct) | **4 raw (2 distinct, em)** / 53 raw (**2 distinct**: 50 %, 3 px) | `probe-css.py` |
| CSS raw letter-spacing / shadow | 13 / 21 distinct | **16 / 28 distinct** (worse) | `probe-css.py` |
| CSS bytes (raw) | 356 KB | **444 KB** (the old layers are still shipped under v2) | `probe-css.py` |
| Fonts on Tokyo | 189 KB | **88 KB** | `probe-transfer.js` |
| Vietnamese title, platform fonts | Playfair ×26 | **Bricolage ×16**; UI Inter ×26; no fallback | CDP |
| Macrons | correct | correct in Bricolage and Inter (`Kanda Myōjin`, `Chūō-ku`) | CDP, shots |
| Running text size | — | **16–18 px** in sheets, the Guidebook and the landing/hub deks; meta lines 14 px; photo credits 12 px | `probe-body.js` |
| Tokyo default first load (D-38 row) | — (session 1,952 KB) | **652 KB desktop · 940 KB phone @3×** (raw 1,696 / 1,984) | budgets |
| Tokyo default FCP 4× | 464 ms | **340 ms** (median of 3: 300–372) | budgets |
| Tokyo Atlas first load | session 2,043 KB | **612 KB · 1,020 KB** (raw 1,757 / 2,165) | budgets |
| Tokyo `#p=` deep link DOM, phone | 13,928 | **2,208** | `probe-transfer.js` |
| Whole beta, first load ≤ 2.0 MB · FCP 4× ≤ 1 s | 0 over · 0 over (session bytes) | **179/179 · 179/179** (largest New York phone 1,038 KB; session bytes over 2 MB on Tokyo, New York) | metrics |
| Signature motion | none | **the tapped card grows into the sheet**: view transition, `--dur-grow` 340 ms; 0 transitions and 0 animations under reduced motion (phone and desktop) | `motion-r7.json`, `tokens.css` |
| JS errors on the captured flows | 0 | 0 | shots logs |

## Typography & style sub-scorecard (inside A)

The same 30 items and the same areas as R6, so the two rounds compare line by line. **R6** is my R6 score. **R7** is
this round's. The designer did not re-score these 30 items for v2; their claims are on the palette card and are checked in
the next table.

| Area | # | Item | R6 | **R7** | Evidence (R7) |
|---|---|---|---:|---:|---|
| Faces | T1 | Display legibility, 15–24 px | 8 | **9** | Bricolage section heads at 16–28 px and Inter place names stay crisp (`tokyo-gallery-p2-d`). Macrons are correct in both faces (`sheet-m`). |
| | T2 | Display character, luxury × fun | 7 | **8** | The grotesque is confident and warm, and "Where to **next**?" with its sun wash is a real wink (`landing-m`). It is calm rather than couture, which is what the brief asked for. |
| | T3 | UI legibility, 12–16 px | 9 | **9** | Inter on every UI sample (CDP). |
| | T4 | UI weights, hierarchy, numbers | 7 | **8** | Only 400/500/600/700 render, on every sampled page including the landing page and hubs. Tabular figures on 68 % of numeric elements; still not in Guidebook facts (3/35) or Insights axis numbers (9/46). |
| | T5 | Diacritics | 9 | **9** | Vietnamese is set in one face (Bricolage ×16 for the title, Inter ×26 for the UI); macrons hold. |
| | T6 | CJK fallback | 8 | **8** | Intentional sans fallback (IPAGothic here) that matches the grotesque voice. |
| | T7 | Weight / optical-size range | 7 | **7** | A single opsz-72 cut, also used at 16 px (hub "Onsen & sentō"), where it sets tight. |
| | T8 | File weight | 8 | **9** | 65–95 KB of woff2 per page (R6 140–189 KB). |
| Scale & rhythm | S1 | Type-scale discipline | 6 | **8** | Raw font sizes 118 → 4 declarations (2 distinct, both `em`). The rendered 12–17 px band shows 3–6 steps per page (R6 6–7), and 13.5 px is gone. |
| | S2 | Line-height and measure | 6 | **6** | The widows R6 named are still there: "Edo-/Tokyo Museum" (phone dek and Guidebook), "· 1 closed" / "· 13 closed" / "1 / closed" alone on the masthead's second line (Tokyo, Cleveland, Wheeling), and "· jingisukan" on the Japan hub. |
| | S3 | Letter-spacing and uppercase | 6 | **6** | 16 distinct raw letter-spacings (R6 13). Uppercase is down to one eyebrow. |
| Colour & skins | C1 | Colour, light | 8 | **9** | Bone, ink and one oxblood accent; 0 AA failures on 179 pages. |
| | C2 | Colour, night | 8 | **9** | A warm near-black; 0 AA failures in the dark run; photos sit well on it (`tokyo-gallery-night`). |
| | C3 | Per-city skins | 8 | **7** | Retired by design (`ONE_ACCENT`). Local identity now comes from the hero photo (32 of 84 guides) and native-script names; the other 52 guides look alike. |
| Spacing, radius, elevation | P1 | Spacing rhythm | 7 | **8** | Generous and even. Residue: in phone Guidebook and Insights, the filter button sits alone on a second row; on desktop city pages a blank band sits left of the hero photo (`tokyo-d`). |
| | P2 | Radius | 7 | **8** | 8 / 12 / 16 / pill hold. Strays: 3 px (10 declarations) and 6 px on the landing page. |
| | P3 | Elevation | 8 | **8** | Three steps and none at rest. 28 distinct raw shadows remain (rings and insets). |
| | P4 | Borders | 7 | **8** | One hairline system. |
| Components | K1 | Cards | 8 | **8** | Borderless, image-first, with rank and sticker on the media, a heart and "Recommended by" on every card. **But:** <br>• every photo card carries a 2–4-line 12 px credit (`landing-m-s1`); <br>• in the phone Atlas carousel the credit overflows its 104 px thumbnail ("Photo: john w…" cut off, `tokyo-atlas-m`); <br>• food cards are blank sand boxes, which reads as "not loaded" in a 4-column row (`chinatown-d`). |
| | K2 | Chips and pills | 8 | **9** | Hairline pills, ink when pressed, tabular counts. |
| | K3 | Buttons | 8 | **9** | Ink primary and hairline secondary, used consistently. |
| | K4 | View switcher | 8 | **9** | A segmented control on desktop and a labelled pill on phones. |
| | K5 | Place sheet | 8 | **7** | Large media, hairline sections and a sticky Save / Directions / Share bar (`sheet-m`). **But:** <br>• on desktop the sheet is an off-centre panel with no scrim, so the page shows undimmed beside it; <br>• the 960w photo is upscaled to 1,024 px and looks soft; <br>• the close button overlaps the view switcher (`sheet-d`); <br>• "No. 42 of 25 in Downtown & The Flats" (`sheet-closed-m`): the denominator counts only the cards currently in the DOM. It is also wrong in R6 ("No. 3 of 24 in Chiyoda-ku"; Chiyoda has 43). |
| | K6 | Filter tray | 7 | **8** | The desktop Atlas filter bar: Sights, Eat & drink, Area, Filters, Must see, Saved, and a sort. |
| | K7 | Rails | 7 | **8** | A category bar of line icons and labels. Labels truncate ("Anime, Manga & P…", "UNESCO World He…"). |
| | K8 | Charts and stat tiles | 7 | **7** | The axe defect is fixed and stat values are tabular. **But** the bars still use the old saturated blue / orange / green / yellow / pink, off the v2 palette (`tokyo-insights-d`). |
| | K9 | Masthead | 7 | **7** | Quiet and photo-led. The "· N closed" orphan remains. |
| Iconography | I1 | Iconography | 8 | **9** | One 1.5 px line set across the category bar, the map controls and the tab bar. |
| Motion | M1 | Motion | 7 | **8** | The signature grow (340 ms, reduced-motion safe) and a heart pop. Nothing else moves on the primary path. |
| Consistency | X1 | Consistency across the four views and the hubs | 6 | **8** | One system from the landing page to the sheet. `DESIGN-SYSTEM.md` now documents v2 and marks the old one superseded. Open: the Insights palette and the letter-spacing sprawl. |
| | | **Total (of 300)** | **223** | **241** | |

By area: faces 67/80 · scale & rhythm 20/30 · colour & skins 25/30 · spacing, radius & elevation 32/40 ·
components 72/90 · iconography 9/10 · motion 8/10 · consistency 8/10.
**7 of 30 items are below 8**: T7, S2, S3, C3, K5, K8 and K9.

### The designer's v2 claims, checked

| Criterion (designer's card) | Claim | **Evaluator** | Why |
|---|---:|---:|---|
| Modern-minimal | 9 | **9** | Calm ground, one accent, no decoration competing with content. |
| Marketplace-grade clarity | 9 | **8.5** | The anatomy is right: header search pill, category bar, 1/2/3/4-column grid (measured at 390/768/1024/1440), a heart and a map pill. It is let down by the credit clutter, the bars that let content ghost through (top bar 96 % opaque, tab bar 97 %), the clipped search placeholder ("Search Clevelanc") and the desktop sheet without a scrim. |
| Palette uniqueness | 9 | **9** | Oxblood used in four places on bone is unusual in this set and reads as ours. |
| Classy, not tacky | 9 | **9** | Agreed. |
| Luxury feel | 9 | **8** | Restraint reads expensive. The blank food covers and the saturated chart bars cheapen some screens. |
| Readability | 9 | **9** | Running text 16–18 px, Inter UI. |
| AA, light + dark | 10 | **10** | 0 failures on 179 pages (B-23) and 0 axe colour issues. |
| Consistency across views | 9 | **8** | The Insights charts are off-palette. Letter-spacing has 16 raw values. |
| Photo-friendliness | 9 | **9** | Photos sit cleanly on bone and on the dark ground. |
| Gen Z wanderlust appeal | 9 | **7.5** | Where photos exist it works (landing, hubs, Tokyo and New York top sights). On most guides the first rows are sand boxes, and Chinatown's first screen has none. |
| Cross-generational trust & legibility | 9 | **8.5** | Sources are visible on every card, labels are plain and contrast is high. The 12 px credits are dense, and the 26 px map pins are small for older hands. |

## Evidence per dimension

### A. Look & feel — R6 77 → R7 83

| Sub-criterion | R6 | R7 | Evidence (R7) |
|---|---:|---:|---|
| Visual polish | 80 | **85** | **Better:** <br>• one calm system everywhere; <br>• the R6 Vietnamese, macron and weight defects stay fixed; <br>• the night hero, plates and purple tiles are gone. <br>**Still open:** <br>• Cleveland's "Start with" still disagrees with itself (R6 gap #8): the phone lead card under "Start with" is Slyman's, the desktop link says "Start with Larder Delicatessen and Bakery" (`cleveland-m`, `cleveland-d`); <br>• the carousel credit overflows its thumbnail; <br>• content ghosts through the 96 %/97 % opaque top and tab bars (`landing-m-s1`); <br>• the search placeholder is clipped mid-letter ("Search Clevelanc", `cleveland-m`); <br>• the desktop sheet has no scrim, sits off centre, shows an upscaled photo and its close button overlaps the switcher; <br>• "No. 42 of 25"; <br>• the R6 widows. |
| Imagery | 63 | **75** | **The cap lifts in part:** real, credited photos on the landing page, 32 guide heroes, the 5 hubs and 94 top sights, and they are well chosen and well cropped (`japan-m`, `tokyo-m`, `sheet-m`). **But** that is 3 % of the 2,901 eligible places: <br>• 52 guides have no hero; <br>• only 5 guides have any place photo; <br>• the calm no-photo cover (a 30 px glyph on sand) is honest, but in a row it reads as empty (`chinatown-d`, `ny-gallery-d`). <br>ROUND-1 put photos on about 29 % of records at A +8–10; this is a first slice of that. |
| Typography | 87 | **90** | See the sub-scorecard: the rebuild reaches the landing page and hubs, the scale is disciplined, and tabular figures are on 68 % of numbers. The widows remain. |
| Layout | 87 | **90** | A marketplace grid with 1/2/3/4 columns, the map-search split, the full-screen phone map, and a sheet with large media and a sticky action bar. Minus: the 104 px desktop deep-link band, the off-centre desktop sheet, and the lone filter-button row on phones. |
| Motion / delight | 60 | **74** | R6 gap #1 is met: the tapped card's media grows into the sheet through a view transition (340 ms), with 0 transitions and 0 animations under reduced motion on phone and desktop. A heart pop and the sun sticker add small delight. It is still a single moment. |
| Luxury + fun | 81 | **85** | Restraint, bone and oxblood read classy; the sun wash and stickers add a wink. Pulled down by the blank food covers and the off-palette charts. |
| Wanderlust | 78 | **83** | Photo-led landing and hubs and "Where to next?" make you want to go. Most city rows are still sand boxes. |
| **A (mean)** | **77** | **83** | (85 + 75 + 90 + 90 + 74 + 85 + 83) / 7 = 582 / 7 = 83.1 |

How R7 compares with the leader families, described neutrally:
- **Image-first marketplaces.** The anatomy now matches theirs: header search pill, category bar, borderless photo cards,
  a heart and a floating map pill. The gap is photo coverage and a few polish defects.
- **Map-led local and real-estate search.** The map now drives the list, with search as I move, a preview card, hover
  sync both ways and a phone carousel. Ours adds sources on every card and dated closures.
- **Photo-led luxury products.** Restraint and palette are at their level now. Photo depth and a second motion moment
  are not.

### B. UX & ergonomics — R6 88 → R7 91

| Area | R6 | R7 | Evidence |
|---|---:|---:|---|
| First screen | 90 | **90** | **Better:** B-01 and B-03 pass on all 84 place pages, and B-16 now passes (2.2 cards per phone screen; R6 failed it on 84 pages). B-04 fails on 9 pages (R6 23). The lead card has a photo where one exists. <br>**Worse:** B-02 (masthead ≤ 0.6 of the screen) now fails on 20 pages (Tokyo 513 px), because of the hero photo. B-05 (city cards on the first hub screen) fails on 7 hubs (R6 1): the search-first hero pushes the grid below the fold on phones. |
| Discovery | 91 | **91** | The category bar is a better front door than the chip clutter. In desktop Atlas, "For you", "Your day" and "Near me" are still not on screen (R6 gap #7, not done). |
| Map ↔ list | 90 | **94** | **Fixed:** <br>• search as I move the map, with "N more outside this area · Show all"; <br>• hover sync card ↔ pin; <br>• pin → preview → detail with the view kept; <br>• rank pins drawn unlike clusters; <br>• the whole pill is the hit target; <br>• the day route fits above the carousel; <br>• the city is named on the phone map. <br>The lane probe passes 99/99 on re-run. <br>**Open:** <br>• pills are 26 px tall on phones (below 44); <br>• a pin whose card is outside the 40 shown lights a card that is not rendered; <br>• a desktop deep link still scrolls the page 104 px. |
| Filters | 90 | **91** | A filter bar with Must see and Saved chips and a sort; area chips fit the map (lane probe). |
| Detail | 90 | **90** | **Better:** large media, hairline sections (Why it's here, Recommended by, Plan your visit), a sticky action bar, and a calm "Closed · kept for the record" state. "n of N" now counts the whole view (`42 of 194`). <br>**Worse:** "No. N of M in area" has a wrong denominator: it is impossible on the closed sheet ("42 of 25") and understated on Kanda Myōjin ("3 of 24"; Chiyoda has 43). Closed places still offer Directions as the primary action. |
| Mobile | 85 | **88** | A floating "Show map" pill, a full-screen map with carousel and List pill, and the city in the header. **But:** <br>• "last checked" is still absent from the phone Atlas screen; <br>• B-08: the floating pill covers card titles on 80 pages in the default view (R6 0); <br>• B-20 fails on 9 pages; <br>• the search placeholder is clipped. |
| Accessibility | 84 | **92** | **Fixed (R6 gap #4):** <br>• axe reports 0 serious or critical issues in 80 runs (20 pages × 2 viewports × light/dark); <br>• B-23 passes on all 179 pages (R6: 66 "What changed" pages failed); <br>• focus is visible 30/30 on the pilots. <br>**Open:** <br>• B-20 on 9 pages and the 26 px pins; <br>• moderate axe findings: `aria-allowed-role` on 56 runs, `heading-order` on 24. |
| Performance | 84 | **88** | **Met:** <br>• Tokyo default first load is 652 KB desktop and 940 KB phone @3×, with FCP 4× median 340 ms; <br>• Tokyo Atlas first load is 612 / 1,020 KB; <br>• every page in the beta loads under 2.0 MB and paints under 1 s at 4×; <br>• the deep-link DOM is 2,208 (R6 13,928); <br>• eager JS is 28.62 KB gzip. <br>**Open:** <br>• a phone @3× fetches 960w JPEGs (150–340 KB) for 104 px thumbnails and 42vw cards; <br>• session bytes are 3.4 MB on Tokyo; <br>• raw CSS grew to 444 KB because the R6 layers are still shipped; <br>• Tokyo Atlas raw first load on a phone is 2,165 KB. |
| **B (mean)** | **88** | **91** | (90 + 91 + 94 + 91 + 90 + 88 + 92 + 88) / 8 = 724 / 8 = 90.5 → 91 |

### C. Competitor feature coverage — R6 96 → R7 96

On `badcc20d` I re-checked by hand every row the overhaul touches; the rest rest on the gates and harness rows behind
them (G1, G6, B-10, B-12, B-17, the views and FE suites). Two rows changed:

| # | Feature | R6 | R7 | Note |
|---|---|---|---|---|
| 4 | Restraint plus local skin per city | ✅ | **◐** | Restraint is stronger than ever. But the per-city skins were retired (`ONE_ACCENT = True`), so a city looks local only through its hero photo (32 of 84 guides) and native-script name. |
| 5 | Visual anchor without photos | ✅ | ✅ | The calm cover (kind glyph + native name), the sheet's locator map and the Guidebook chapter maps. |
| 6 | Licensed landmark photos | ✕ | **◐** | 131 credited photos, sized `srcset`, a credit on every one, and the gate refuses anything uncredited. Coverage is 3 % of eligible places. |
| 7 / 8 / 9 | Split view with sync, phone map with sheet, numbered pins | ✅ | ✅ | Now the map-search pattern (see B). The harness rows B-06/07/09 are stale (Method §4). |
| 20 | Day plan with route line | ✅ | ✅ | The route fits above the carousel. |
| 27 | Per-city social card | ✅ | ✅ | 90 OG images (one per city and country). |
| 29 | Near me, opt-in | ✅ | ✅ | The locate control is unchanged in behaviour (lane probe). |
| 30 | Multilingual UI | ◐ | ◐ | No reviewed second locale. |
| 33 / 35 | Night edition · functional delight | ✅ | ✅ | AA in dark; the grow and heart pop respect reduced motion. |

R7 tally: ✅ 32 · ◐ 3 (#4, #6, #30) · ✕ 0. Coverage is (32 + 1.5) / 35 = **95.7 % → 96**.

### D. Unique strengths — R6 89 → R7 89

| Strength | R6 | R7 | Evidence |
|---|---:|---:|---|
| Sourced picks; attribution as navigation | 94 | 94 | G6: 0 cards without "Recommended by" on all 84 pages. Each card names its first source as a link, plus "+n more". The price/rating prose call is still open. |
| Verified pins | 92 | 92 | Rank pills on the map with a "Key"; 0 tile hosts other than OSM/Esri (88 maps). |
| Closure honesty | 95 | 95 | The closed sheet is calm but unmistakable. But the phone Atlas still shows no "last checked", and a closed place offers Directions as its primary button. |
| Interest triad | 81 | 81 | Unchanged |
| Anime layer | 85 | 85 | Unchanged (the signature rail leads Tokyo) |
| "Your guide" and day plans | 77 | 79 | The day route now fits on the phone map. The desktop Atlas rail is still off-screen. |
| Stated gaps | 89 | 89 | Unchanged |
| **D (weighted judgement)** | **89** | **89** | The mean is 87.9; sourcing and closure honesty weigh most. |

## Design-conformance checklist (D1–D13)

| # | Designed item | R6 | **R7** | Evidence |
|---|---|---|---|---|
| D1 | Four switchable views, view in the hash, preference remembered | ✅ | **✅** | 84/84 place pages carry all four. `#view=insights` in a fresh context opens Insights. Choosing Guidebook on Tokyo, then opening Cleveland with no hash, opens Guidebook. G1: 488/488 on Tokyo by scroll, deep link, search and no-JS; `test-views*.js` green. |
| D2 | Atlas is map-first (upgraded: **map-search**) | ◐ | **◐** | **Met:** <br>• desktop map 60 % (≥ 58), left, full height, with a 2-column card grid; <br>• search as I move (zoom and pan change the count) and "Show all 488"; <br>• hover card ↔ pin; <br>• pin → preview → detail; <br>• pills with rank and ★, clusters styled unlike them; <br>• zoom, opt-in locate, Street/Satellite (OSM/Esri), Key; <br>• area chip fits the map; <br>• phone: full-screen map (92 %), carousel synced to pins, List/Map pill, "Search this area"; <br>• deep links, day routes, closures; <br>• "Map unavailable" with every place listed when tiles fail. <br>Lane probe 99/99 on re-run. <br>**Not met:** <br>• phone pins are 26 px tall (44 px targets, D11); <br>• pin → card is not shown when the place is outside the 40 cards rendered; <br>• the desktop deep link scrolls the page 104 px; <br>• no "last checked" on the phone Atlas. |
| D3 | Gallery | ✅ | **✅** | Rows plus an "All N" grid (24 per page on phones, 48 from 640 px) with show-all; 1/2/3/4 columns at 390/768/1024/1440; a lead card with a photo in the first phone screen (`tokyo-m`); covers vary by kind (glyph per kind, or a photo); `#view=gallery&p=` opens the right sheet. |
| D4 | Guidebook | ✅ | **✅** | Contents first (13 chapters), then lazy chapters with chapter maps; print checks green in `test-views.js`. |
| D5 | Insights | ✅ | **✅** | Inline-SVG charts with table fallbacks, bars linking to lenses, tabular stat values, and 0 axe serious issues. The off-palette bar colours are a style issue (K8), not a missing feature. |
| D6 | Fonts and styles rated, best direction built | ◐ | **◐** | **Met:** <br>• v2 rated (`style/v2/DECISION.md`, `scores.json`, `board.html`); <br>• built across the whole beta, including the landing page and hubs (weights 400–700 only, no 13.5 px); <br>• self-hosted OFL woff2 with `OFL-Bricolage.txt` and `OFL-Inter.txt`; <br>• Vietnamese, macrons and the CJK fallback verified. <br>**Not met:** 7 of 30 sub-scores are under 8 (T7, S2, S3, C3, K5, K8, K9). I give the reason for each; all but C3 are fixable defects, so they do not excuse the row. |
| D7 | melon-seek ideas: one token set, 3-step elevation, consistent radius, crisp UI face | ◐ | **◐** | **Met:** `DESIGN-SYSTEM.md` documents v2 (faces, radii 8/12/16/pill, three elevation steps); raw font sizes 118 → 4 and raw radii down to 2 distinct values. <br>**Not met:** stray values remain: 16 distinct raw letter-spacings, 28 raw shadows and 17 raw line-heights; 444 KB of CSS with the R6 layers still shipped. |
| D8 | Luxury yet fun, wanderlust: each ≥ 8/10 | ◐ | **✅** | **Luxury + fun 85 → 8.5 ✅. Wanderlust 83 → 8.3 ✅.** |
| D9 | Real photographs | ✕ (owner) | **◐** | **Met:** <br>• keyless Commons photos through GitHub Actions; <br>• 131 rows with full TASL credit, the credit visible under each photo; <br>• the gate refuses any uncredited file, any closed place, any place in Vietnam and any food place; <br>• heroes on 32 guides and 5 hubs, and photos on the top landmarks of Tokyo, New York, Cleveland, Wheeling and Singapore. <br>**Not met:** "hub heroes plus top landmarks" covers 32 of 84 guides and 94 of 2,901 eligible places. The keyless path can extend this, so it is team work now. Unsplash still waits on the owner's key. |
| D10 | Honesty rules | ✅ | **✅** | validate, test and beta:check green; 8,458 places, beta == live; `test-honesty.js` no-brand scan clean; `check-google.py` 88 maps clean; tiles OSM/Esri only; G6 and B-12 green; credits on every photo. |
| D11 | Performance and accessibility | ◐ | **◐** | **Met:** <br>• Tokyo default first load 652 / 940 KB, FCP 4× 340 ms; <br>• all 179 pages ≤ 2.0 MB at first load and ≤ 1 s FCP at 4×; <br>• axe 0 serious/critical in 80 runs; <br>• AA light + night on 179/179 pages. <br>**Not met:** 44 px targets: B-20 fails on 9 place pages, and the phone map pins are 26 px tall. |
| D12 | Modern-minimal, marketplace-grade UI with a palette of our own; minimal clarity and palette ≥ 9/10 | — | **◐** | **Built:** <br>• compact sticky header with a search pill; <br>• category icon bar; <br>• borderless image-first cards in 1/2/3/4 columns with a heart; <br>• floating map/list pill on phones; <br>• detail with large media, hairlines and a sticky action bar; <br>• no night hero, particle art, gold plates or purple tiles (`*-r6-r7` composites). <br>**Sub-criteria:** **minimal clarity 8.5/10 ✕** (credit clutter, ghosting bars, clipped placeholder, the desktop sheet without a scrim). **Palette 8.5/10 ✕** (unique and consistent in light and dark, except the off-palette Insights bars). |
| D13 | Gen Z wanderlust that every generation trusts; both sub-criteria ≥ 9/10 | — | **◐** | **Built:** <br>• an expressive, self-hosted OFL display face with Vietnamese, paired with Inter; <br>• small delights (grow, heart pop, sun sticker); <br>• inviting copy ("Where to next?", "Start with"); <br>• running text 16–18 px, AA everywhere, plain labels, sources on every card. <br>**Not met:** "big photography" stops at 3 % of eligible places. <br>**Sub-criteria:** **Gen Z wanderlust appeal 7.5/10 ✕. Cross-generational trust & legibility 8.5/10 ✕** (12 px credits, 26 px pins). |

**Summary:** ✅ 6 (D1, D3, D4, D5, D8, D10) · ◐ 7 (D2, D6, D7, D9, D11, D12, D13) · ✕ 0.

## Points blocked on the owner

These are my estimates from this round's sub-scores. The big change since R6 is photographs. The keyless Commons path
works: it fetched 131 photos through Actions and they render offline. So extending photo coverage to the 2,901 eligible
places is **team work**, and I count it under the gaps below, not here.

| Owner action | What it unblocks | A | B | C | D | **Overall** |
|---|---|---:|---:|---:|---:|---:|
| **Unsplash key and hosts** (`api.unsplash.com`, `images.unsplash.com`, `UNSPLASH_ACCESS_KEY`) | A quality top-up where Commons has no usable frame of a hero or landmark. The rules that exclude food places, closed places and Vietnam apply to any source, so the key does not open those. | +0.3 | — | — | — | **≈ +0.1** |
| **A reviewed second locale** | C #30 ◐ → ✅; the switcher appears by rule | — | — | +1.4 | — | **≈ +0.3** |
| **The price/rating prose call** (record prose with prices or ratings, shown verbatim; pending since W3, no decision recorded in `BETA-DECISIONS.md`) | Detail and sourced-picks honesty can be closed either way | — | +0.5 | — | +0.5 | **≈ +0.2** |
| **Total owner-blocked** | | **+0.3** | **+0.5** | **+1.4** | **+0.5** | **≈ +0.6** |

Not counted here: food places are excluded from photos by the project's honesty rules ("only where the photo truly shows
the place"). Only the owner could change that, and I do not assume it.

Separately from those, the team can still earn **about 3.0 overall points** through the gaps below. Of the 11.5 points
between R7 and 100, about 0.6 are owner-blocked and about 3.0 are recoverable through named changes. The rest is not tied
to any single change I can name with confidence.

## Top gaps, ranked by points recoverable

Gain = weight × the dimension points if the change fully lands. Each acceptance is a test the next wave can run.

| # | Gap | Acceptance (testable) | Lane | Gain |
|---:|---|---|---|---:|
| 1 | **Photo coverage** (Imagery 75, Wanderlust 83, C #6 ◐, D9 ◐, D13) | (a) Every non-Vietnam guide has a credited hero photo: ≥ 78 of 84 place pages (`grep hero--` in the built pages) or a stated per-guide reason in the manifest. (b) ≥ 60 % of eligible tier-1 sights carry a credited photo (`CREDITS.json` vs `manifest.json`), and the first phone screen of every guide that has eligible sights shows ≥ 1 photo. (c) The credit gate still refuses anything uncredited. | imagery | A +2.1, C +1.4 → **+1.15** |
| 2 | **Polish defects** (Visual polish 85, S2, K1, K5, K9) | (a) No photo credit overflows its box: 0 elements with `scrollHeight > clientHeight` among card credits, carousel included. (b) Top bar and tab bar backgrounds are fully opaque (alpha 1). (c) The search placeholder fits at 390 px ("Search Cleveland" unclipped; no ellipsis mid-letter). (d) Desktop sheet: a scrim dims the page, the panel is centred or docked flush, and the close button does not overlap the switcher. (e) The photo is never upscaled past its source width. (f) "No. N of M" uses the area's full count, with N ≤ M on all 8,458 sheets (a test). (g) No single-word or single-token last line in the dek, the masthead stat line or the hub "Known for" at 390 and 1440. (h) On every city page the phone "Start with" card and the desktop "Start with …" link name the same place (a test over the 84 pages; R6 gap #8). | designer + FE-A + FE-B | A +1.1, B +0.25 → **+0.52** |
| 3 | **A second delight moment** (Motion 74, M1) | At least two more action-driven moments on the primary path, each ≤ 300 ms and absent under reduced motion (a test asserts 0 animations then). For example: photos fade in from a dominant-colour placeholder; the selected pin grows into its preview card; card ↔ pin hover transitions. No autoplay. | designer + FE-A + Atlas | A +1.1 → **+0.46** |
| 4 | **Atlas residuals** (Map ↔ list 94, Mobile 88, Layout, D2 ◐) | (a) Phone pin hit area ≥ 44 px tall (padding the hit box is enough), with no overlap regression. (b) A pin click whose card is outside the shown page brings that card into the list and into view (`probe-pin2card.js` reports a rendered card in view for 8/8 outer pins). (c) The desktop `#view=atlas&p=` deep link leaves `scrollY = 0` and no band under the map. (d) "last checked <date>" is visible on the first phone Atlas screen (hit test). (e) In desktop Atlas, "For you", "Your day" and "Near me" are reachable without horizontal scroll. | Atlas | B +0.9, A +0.3, D +0.4 → **+0.39** |
| 5 | **First screen and targets in the harness** (First screen 90, Accessibility 92, D11 ◐) | `beta:metrics:all`: B-02, B-04, B-05, B-08 and B-20 report 0 failing pages, with B-06/07/09 re-pointed to the map-search DOM and ratified by QA. For example: a shorter hero on phones, the hub grid in the first screen, and the floating pill kept clear of titles. | FE-A + FE-B + QA | B +0.75 → **+0.19** |
| 6 | **Palette and token residue** (K8, S3, X1, D7 ◐, D12 palette) | Insights bars use v2 tokens (muted area hues, no saturated primaries), with contrast still AA. `probe-css.py`: ≤ 6 distinct raw letter-spacings and ≤ 10 raw shadows. Tabular figures on Guidebook facts and Insights axes (≥ 90 % of numeric elements). | designer + FE-B | A +0.4 → **+0.17** |
| 7 | **Photo weight and dead CSS** (Performance 88) | A phone @3× never fetches a 960w photo for a slot under 200 CSS px (`sizes` fixed, or a 320w copy). Every 960w JPEG ≤ 120 KB. Tokyo phone @3× first load ≤ 700 KB transfer. `cleo.css` ≤ 200 KB raw, with the R6 layers removed. | platform + imagery | B +0.6 → **+0.16** |

## What R7 got right (keep)

- **An overhaul, not a polish.** One calm, coherent system from the landing page to the sheet, in light and dark. Every
  R6 retirement target is gone, and nothing that keeps the guide honest was lost: every place is reachable in every view,
  "Recommended by" is on every card and closures are flagged.
- **Atlas really is map-search.** The map drives the list, with every place one tap away ("Show all"), and the list
  renders every place with "Map unavailable" when tiles fail.
- **Photos done honestly.** Keyless, credited, refused when uncredited, closed, in Vietnam or a food place. Each credit
  sits under its photo and is never overlaid.
- **The platform lane cleared the R6 accessibility debt** (axe 0, B-23 0/179) and the deep-link DOM (13.9 k → 2.2 k), and
  kept every page under budget while adding photos.
- **The type rebuild is finished** across the whole beta, with half the font weight of R6.
- 0 JS errors across the captured flows; every gate green.

## Reproduce

```bash
git worktree add --detach ../eval-r7 badcc20d && cd ../eval-r7/tools && npm install --no-audit --no-fund && npm run validate && npm test && npm run beta:check
node beta/metrics.js --all --out <scratch>/all.json                                # all 179 pages, default view
node beta/metrics.js --only cities/tokyo --out <scratch>/tokyo-N.json              # ×3, idle
node beta/metrics.js --view atlas --only cities/tokyo --out <scratch>/atlas-N.json # ×2, idle
NODE_PATH=$(npm root -g) node beta/atlas-ms.js --out <scratch>/atlasms --no-shots  # the lane's probe, unchanged
python3 -m http.server 8811 --bind 127.0.0.1                                       # from ../eval-r7 (R7)
# R6: git worktree add --detach ../eval-r6 2f227631, served on 8812
E=design/beta/eval/r7/tools
node $E/shots-r7.js r7 8811 <out>/r7 && node $E/shots-r7.js r6 8812 <out>/r6
node $E/shots-extra.js 8811 <out>/r7 && node $E/shots-extra.js 8811 <out>/r7 --motion && node $E/shots-extra.js 8812 <out>/r6
python3 $E/pair.py <out>/r6 <out>/r7 design/beta/eval/r7 landing,japan,tokyo,...
node $E/probe-atlas-r7.js 8811 <out>/atlas.json && node $E/probe-pin2card.js && node $E/probe-day.js 8811 <out>
node $E/probe-axe.js 8811 tools/beta/qa/vendor/axe.min.js <out>/axe-r7.json
node $E/probe-type.js 8811 R7 <out>/type-r7.json && python3 $E/probe-css.py <tree> R7
node $E/probe-transfer.js && node $E/probe-body.js
```
