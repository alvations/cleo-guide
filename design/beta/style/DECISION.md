# W6 type & style — decision: direction B, "Salon Didone + Inter"

Inputs: the audit ([`AUDIT.md`](AUDIT.md)), three directions as token sets plus mockups
([`directions/`](directions/README.md)), and the scorecard ([`scores.json`](scores.json)). Every direction was scored on
the same 30 items as the audit.

## 1. Scores

| # | Item | Today | A refined | **B Playfair + Inter** | C Fraunces + Manrope | B as built |
|---|---|---:|---:|---:|---:|---:|
| T1 | Display legibility (15–24 px) | 4 | 5 | **8** | 8 | 8 |
| T2 | Display character, luxury × fun | 8 | 8 | **8** | 7 | 8 |
| T3 | UI legibility 12–16 px | 6 | 6 | **9** | 7 | 9 |
| T4 | UI weights, hierarchy, numbers | 5 | 7 | **9** | 7 | 9 |
| T5 | Diacritics (macrons at DPR 1, Vietnamese) | 3 | 3 | **9** | 4 | 9 |
| T6 | CJK fallback | 6 | 6 | **8** | 7 | 8 |
| T7 | Weight / opsz range used well | 4 | 6 | **8** | 7 | 8 |
| T8 | File weight | 8 | 8 | **8** | 9 | 8 |
| S1 | Type scale discipline | 4 | 7 | **8** | 8 | 8 |
| S2 | Line-height & measure | 7 | 7 | **7** | 7 | 7 |
| S3 | Letter-spacing & uppercase | 6 | 6 | **7** | 7 | 7 |
| C1 | Colour, light | 8 | 8 | **8** | 8 | 8 |
| C2 | Colour, dark | 7 | 7 | **8** | 8 | 8 |
| C3 | Skins | 8 | 8 | **8** | 8 | 8 |
| P1 | Spacing | 7 | 7 | **7** | 7 | 7 |
| P2 | Radius | 5 | 7 | **8** | 7 | 8 |
| P3 | Elevation | 6 | 8 | **9** | 8 | 9 |
| P4 | Borders | 7 | 7 | **7** | 7 | 7 |
| K1 | Cards | 8 | 8 | **9** | 8 | 9 |
| K2 | Chips & pills | 7 | 7 | **8** | 8 | 8 |
| K3 | Buttons | 7 | 7 | **8** | 8 | 8 |
| K4 | View switcher | 8 | 8 | **8** | 8 | 8 |
| K5 | Place sheet | 7 | 7 | **8** | 7 | 8 |
| K6 | Filter tray | 7 | 7 | **7** | 7 | 7 |
| K7 | Rails | 7 | 7 | **7** | 7 | 7 |
| K8 | Charts & stat tiles | 6 | 7 | **9** | 8 | 9 |
| K9 | Masthead | 8 | 7 | **8** | 8 | 8 |
| I1 | Iconography | 8 | 8 | **8** | 8 | 8 |
| M1 | Motion | 8 | 8 | **8** | 8 | 8 |
| X1 | Consistency (four views + hubs) | 6 | 7 | **8** | 8 | 8 |
| | **Total of 300** | **196 (65.3 %)** | 209 (69.7 %) | **240 (80.0 %)** | 224 (74.7 %) | **240 (80.0 %)** |

For reference, melon-seek scores 216 (72.0 %) and the leading products' general patterns score 240 (80.0 %) on the same
card (AUDIT §2).

## 2. Why B

- **It fixes the two type defects A cannot fix.**
  - **Vietnamese.** Playfair and Inter both ship a Vietnamese subset. Across every beta page the only character either
    face is missing is "→". Bodoni Moda misses 43 characters and Figtree misses 44 (AUDIT §1.1).
  - **Macrons.** Playfair is pinned at one sturdy optical size (opsz 28) at build time. Its macron is visible at DPR 1 at
    21 px and at 64 px (`audit/macron-opsz-compare-dpr1.png`). Bodoni at default optical size loses it at both, and
    Playfair pinned at opsz 48 or 72 loses it at 21 px. `macron-check.js` passes on every macron line in the default view
    (§4). That retires all 13 Bodoni optical-size patches.
- **It keeps the luxury voice.** Playfair descends from the same high-contrast tradition as Bodoni. The roman, the italic
  (wordmark, deks, notes, initials) and the swash ampersand keep the "luxury × fun" character (T2 stays at 8). At opsz 28
  it reads as a sturdier Didone, not a fashion masthead. That is the right trade for a guide whose names are set at
  19–24 px.
- **Inter is the product-grade UI face.** melon-seek proves it on this owner's own site. It has a large x-height,
  distinct `Il1`, and real tabular figures for counts and charts (T3, T4, K8).
- **melon-seek's discipline comes with it.** One token per font role, a 3-step shadow scale, one radius pair, `--num`
  for figures and `--focus-ring`.

**Why not C.** C is the friendliest pairing and the lightest (≈ 140 KB on Tokyo). But the packaged Fraunces subset draws
the macron one letter late ("Myoj̄in", `audit/fraunces-macron-defect.png`). On a guide with 400+ Japanese names that is
disqualifying. C also reads less luxurious.

**Why not A.** A is the cheapest change, but it leaves Vietnamese broken and keeps patching a hairline face. It gains only
13 points.

## 3. What was built

Everything is beta-only and generated (`npm run beta`).

**Fonts** (`beta/assets/fonts/`, about 327 KB in all, each page loads only the subsets it sets):

- 12 OFL woff2 subsets, built by [`tools/make-fonts.py`](tools/make-fonts.py) from `@fontsource-variable/playfair@5.3.0`
  and `@fontsource-variable/inter@5.3.0`. The script instances the variable font, subsets it, and writes woff2.
  - Faces: Playfair roman and italic, Inter roman.
  - Weights: 400–700.
  - Subsets: `latin`, `latin-ext` (Latin Extended-A plus the pinyin carons, which covers every macron), `latin-ext-more`
    and `vietnamese`.
- Licences are copied alongside: `OFL-Playfair.txt` and `OFL-Inter.txt`.
- The Bodoni Moda and Figtree files and their licences are removed.
- `font-display: swap` is set. The service worker still precaches every woff2, so offline type matches online type.

**Tokens** (`design/beta/tokens.css` → `beta/assets/tokens.css`):

- Font roles: `--font-display` (Playfair, then a CJK serif stack) and `--font-ui` (Inter, then a CJK sans stack).
- Weights: `--fw-ui` 400 and `--fw-ui-strong` 600.
- Two named interface steps: `--fs-meta` 13 px and `--fs-ui` 15 px.
- Tracking: `--track-display`.
- Figures: `--num` (lining, tabular).
- Radius: `--r-*` is now 6 / 8 / 12 / 20, with the aliases `--radius-sm`, `--radius` and `--radius-lg`.
- Shadows: `--shadow-sm`, `--shadow` and `--shadow-lg`, with `--e-1/2/4` aliased onto them and `--e-3` as the upward
  sheet shadow. There is a full night set.
- Focus: `--focus-ring`.

**Stylesheets:**

- `@font-face` (`design/beta/css/contract.css` §0).
- The Bodoni patches are retired: contract §15.1 and §16.1, views V11, and the `build-css.py` Japan opsz rule.
- New in views V12: tabular figures on counts, ranks, pins, stats and chart values (not on dates); display tracking; the
  phone Gallery dek at 17 px, uncapped, so the masthead keeps its W5 height.
- [`tools/normalize-css.py`](tools/normalize-css.py) maps raw sizes, weights and radii onto tokens in the four
  stylesheet sources, and refuses to write if the rule count changes:
  - 179 font sizes and 42 weights (650 → 600, 460 → 400);
  - 47 radii (circles are detected and left alone).

**Small hooks, logged in BETA-LOG:**

- `tools/beta/lib/render/fe-a.css` (FE-A): the normalization pass, plus the phone lead card's thumbnail (108 → 100 px)
  and its meta line at weight 500, so "Chiyoda-ku · See" stays on one line in Inter.
- `tools/beta/og.js` (platform): the share-card renderer reads the new font files.
- `tools/beta/lib/art.js` still names Figtree inside the map-art SVGs. That has no effect: an SVG used as an image cannot
  load web fonts, so those numerals have always rendered in the system sans. It is left untouched so as not to churn
  hundreds of generated art files.

## 4. Measured after

Same harness and machine, before (`146b7434`) and after. The raw results are in [`after/metrics/`](after/metrics/).

| Tokyo, default view (Gallery) | Before | After | Budget |
|---|---|---|---|
| Bytes, desktop (uncompressed) | 1,932 KB | **1,945 KB** | ≤ 2,000 KB ✅ |
| Bytes, phone | 1,457 KB | 1,470 KB | |
| FCP desktop / phone | 280 / 384 ms | 268 / 260 ms | |
| FCP at 4× CPU | 480 ms | **528 ms** | ≤ 1,000 ms ✅ |
| WCAG AA text contrast, light + night | 0 failures | **0 failures** | ✅ |
| Smallest text | 12 px | 12 px | ≥ 12 ✅ |
| Fonts rendered (CDP) | Figtree, Bodoni Moda, IPAGothic (CJK) | Inter, Playfair, IPAGothic (CJK) | |
| `metrics.js` score | 21/24 | 21/24 | |

- **Scripts.**
  - Latin with macrons: Kanda Myōjin passes `macron-check.js` on the card and the Gallery cover, phone and desktop, with
    5 macron px at DPR 1. The check's other four probes (hero dek, Jōnan / Jōtō area titles) found no macron line in the
    default Gallery view, so they report "?", not a pass.
  - Vietnamese renders in Playfair and Inter with no system-face mixing (`after/sheet-vn-*.jpg`, `after/specimen-dpr1.png`).
  - CJK falls through to the system stack (IPAGothic in this container; Hiragino or Noto on real devices).
- **Gates.** `npm run validate`, `npm test` (including `check-google.py`, P-04 reachability and the count asserts) and
  `npm run beta:check` are green. The generator reports 8,458 places, beta == live.
- **Font naming.** CDP reports the Playfair family as "Playfair 5pt SemiExpanded Light". That is the internal
  name the static instance inherited from the variable font's default master. It is cosmetic only: CSS matches the
  `@font-face` family "Playfair". It can be renamed in `make-fonts.py` next time the fonts are rebuilt.
- **Score.** Type & style goes from 196 to 240 of 300 (65.3 % → 80.0 %), level with the leading products' general patterns
  and above melon-seek's 72.0 %.
