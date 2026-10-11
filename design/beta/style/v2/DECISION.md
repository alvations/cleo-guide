# W7 design system v2 — decision: **Bone & Oxblood + one sun highlight**, set in **Bricolage Grotesque + Inter**

The owner rejected R6 as still far from the competitors. The target was modern, minimal and image-first, with a colour
scheme that is ours: classy, luxurious and never tacky. A later amendment added a Gen Z wanderlust feel that Gen X and
Boomer readers still trust, with inviting Gen Z-style fonts. This decision replaces the R6 art direction
([`../DECISION.md`](../DECISION.md)). It is not a polish of it.

Inputs:
- research: [`RESEARCH.md`](RESEARCH.md);
- four palette directions on the real pages: [`directions/`](directions/README.md);
- the type audits: [`type/audit.json`](type/audit.json) for text, [`type/audit-display.json`](type/audit-display.json) for display;
- display pairings on the real pages: [`type/pairings/`](type/pairings);
- the icon set: [`icons/`](icons/sheet.html);
- the scorecard: [`scores.json`](scores.json);
- the review board: [`board.html`](board.html).

## 1. Palette scores (1–10 per criterion, out of 110)

All four directions use the same component layer and the chosen type pairing. "B + sun" is direction B plus the one
warm highlight that the wanderlust item asked to be tested.

| Criterion | A Juniper | B Bone & Oxblood | **B + sun** | C Mist & Petrol | D Sable & Ember |
|---|---:|---:|---:|---:|---:|
| Modern-minimal | 9 | 9 | **9** | 9 | 8 |
| Marketplace-grade clarity | 9 | 9 | **9** | 9 | 9 |
| Palette uniqueness | 6 | 9 | **9** | 7 | 5 |
| Classy, not tacky | 8 | 9 | **9** | 8 | 7 |
| Luxury feel | 7 | 9 | **9** | 7 | 7 |
| Readability | 9 | 9 | **9** | 9 | 9 |
| AA, light + dark (measured: 52 pairs, 0 fails each) | 10 | 10 | **10** | 10 | 10 |
| Consistency across views | 9 | 9 | **9** | 9 | 9 |
| Photo-friendliness | 7 | 9 | **9** | 8 | 7 |
| Gen Z wanderlust appeal | 6 | 7 | **9** | 6 | 8 |
| Cross-generational trust & legibility | 9 | 9 | **9** | 9 | 9 |
| **Total of 110** | 89 | 98 | **100** | 91 | 88 |

## 2. Why Bone & Oxblood, and why the sun

**The oxblood accent is ours.** It is a tailoring and leather colour: deep, brown-red and low in chroma, not a signal red.
- It sits ΔE76 49 from the marketplace's coral and 38 from the athleisure label's red.
- It sits 37 from the R6 vermilion it replaces.
- Nobody in the travel set uses it as chrome.

**It reads expensive because it is rare.** It appears in four places only:
- the saved heart;
- the saved count;
- the day-route line;
- the wordmark star.

Everything else is soft-black ink on warm bone.

**It is the most photo-friendly direction.**
- The bone ground warms food and city photos without tinting them.
- Green (A) clashes with gardens.
- Blue-green (C) sits next to map water and greys warm food.
- Orange (D) competes with warm food shots, and sits ΔE 21 from the retired vermilion.

**On its own, B read a little evening-formal: 7 for wanderlust.** The fix that won is **one** warm, flat **sun** wash (`#FBEBC8`, dark `#3B2C10`). It is used only:
- behind data-backed sticker badges ("Must see", never on a closed place, never invented);
- as the heart "pop" ring.

There is no gradient, no glow and no confetti. The chrome stays bone, ink and oxblood. The page gains daylight and a wink of delight: B + sun scores 9 on both amendment items, and nothing else does.

**Trust for every generation:**
- Body text is 16 px with 1.55 line height.
- Every text pair passes AA in light and dark.
- Labels are plain, and buttons are obvious: ink fill, or a hairline outline with words.
- "Recommended by" stays visible on every card. The G6 gate is green.

## 3. Type

| | Face | Role | Cut |
|---|---|---|---|
| **Display** | **Bricolage Grotesque** (OFL) | Headlines, city and country names, big numbers | One cut: opsz 72, wght 500–700, tracking −0.024 em (hero −0.035 em). Self-hosted vi + latin-ext + latin, 54.5 KB. |
| **Text / UI** | **Inter** (OFL) | Everything people read or tap: body, card titles, meta, buttons, chips, sources | 400/500/600, tabular figures on every count. Unchanged files. |

**Why Bricolage** (46/50 against Fraunces 33, Unbounded 36, Space Grotesk 41 and Newsreader 41; see the board):
- It is a characterful grotesque with optical sizes: confident, warm and current, and still elegant at 600.
- Its macrons render correctly at DPR 1, and its stacked Vietnamese marks render correctly.
- It pairs naturally with Inter.

**Why the others lost:**
- Fraunces is the most charming, but it still draws the macron one letter late ("Myoj̄in"), the W6 defect. That disqualifies it on a guide with 400+ Japanese names.
- Unbounded is tacky at 52 px.
- Space Grotesk reads as tech.
- Newsreader is classy but not youthful.

**Excluded before measuring, for shipping no Vietnamese subset:** Young Serif, Gloock, Instrument Serif, DM Serif Display, Syne, Sora, Outfit and Gabarito.

**Text face.** Inter is the only text face with zero missing characters across the 215 non-CJK characters the beta sets, and it has tabular figures.

**Retired:**
- Playfair: 8 woff2 files and their licence are removed.
- Every italic voice: deks, notes, leads and Didone initials. `font-synthesis-style: none` stops any leftover `italic` rule from faking a slant.

**Fallbacks.** The CJK fallback is now the system **sans** stack (Hiragino Sans, Noto Sans JP, IPAGothic), so it matches the voice. The two characters Bricolage lacks (ǔ ʼ) fall through to Inter.

## 4. Iconography and covers

- **One line-icon set**: 73 inline SVG icons on a 24 px grid, 1.5 px stroke (`--icon-stroke`), round caps, generic subjects only.
  - The source of truth is [`icons/icons.json`](icons/icons.json), with a sprite and a sheet alongside.
  - It includes the category-bar subjects FE-A needs: spire, bag, eye, music, sun, grid, tree, cocktail, bread, ice and bed.
- **The calm no-photo cover** (V2.7 in `design/beta/css/v2.css`):
  - a `--sand` ground in the same rounded media box as a photo;
  - one 30 px kind glyph in `--ink-3`, centred;
  - the native-script name set small, bottom-left, in the UI face.
- The cover never draws the pin-art locator, plates, motifs, area edge bars or vertical scripts. It sits beside a credited photo without pretending to be one.

## 5. What was built

All of it is beta-only and generated (`npm run beta`).

**Tokens** (`design/beta/tokens.css` → `beta/assets/tokens.css`, cut from 43 KB to 9 KB):
- the v2 palette, in light and a warm near-black dark;
- `--accent*`, `--sun*`, `--area-mute` and `--area-mix`;
- radius 8 / 12 / 16 / pill;
- soft, rare shadows, with `--e-1` set to none;
- `--icon-stroke`;
- `--font-display` / `--font-ui`;
- the R6 aliases (`--night`, `--on-night`, `--gilt`, `--city*`, `--motif`).

**Skins.** `design/beta/tools/skins.py` has `ONE_ACCENT = True`. The per-city and pastel regional skins are retired, but the `data-city` and `.skin-*` hooks stay.

**Base components** (`design/beta/css/v2.css`, bundled last into `cleo.css` by `build-css.py`). It covers:
- ground and type;
- the top bar: ground plus a hairline, with no blur and no night variant;
- buttons: ink primary, hairline secondary;
- chips and pills: hairline outlines, ink when pressed;
- source credits as underlined text;
- the search pill;
- the light hero and masthead with no art;
- the calm cover;
- frameless cards;
- neutral rails: no purple, no motif, no shimmer;
- a segmented view switcher;
- sheets, the tray, toasts, the tab bar and banners;
- the footer on the ground;
- muted pins and clusters;
- the sun sticker and the heart pop (reduced motion respected);
- 1.5 px icons;
- the ink focus ring.

**Fonts:**
- `beta/assets/fonts/bricolage-normal-{vietnamese,latin-ext,latin}.woff2` and `OFL-Bricolage.txt`, built by [`tools/make-display-font.py`](tools/make-display-font.py);
- `@font-face` in `design/beta/css/contract.css` §0;
- the Playfair files are removed.

**Gates:**
- `contrast.py` follows the aliases and adds the accent and sun pairs: **86 pairs, 0 below AA**;
- `npm run validate`, `npm test` and `npm run beta:check` are green.

## 6. Measured after

Measured with `tools/beta/metrics.js` on the generated beta, served offline.

| | R6 (W6 after) | **v2** | Budget |
|---|---|---|---|
| Tokyo default view, bytes | 1,945 KB | **1,079 KB** | ≤ 2,000 KB ✅ |
| Tokyo FCP at 4× CPU | 528 ms | **424 ms** | ≤ 1,000 ms ✅ |
| Contrast AA, light + night (Tokyo, Cleveland, NYC, Singapore, Wheeling) | 0 failures | **0 failures** | ✅ |
| Overflow at 360 / 390 | 0 | **0** | ✅ |
| G1 reachability, G6 "Recommended by" | ✅ | ✅ | ✅ |
| `metrics.js` score, city pages | 21/24 | 21/24 (Singapore 20/24) | |

**Scripts:**
- Vietnamese renders in Bricolage and Inter: `after/gallery-vn-*.jpg` and `type/display-specimen.png`.
- Macrons render correctly in both faces (specimen).
- CJK falls through to the system sans.

Before/after screenshots: `after/` (390 and 1440, light and dark) against the R6 shots in [`../after/`](../after/).

**Open items, owned by other lanes:**
- The landing's M1-16 focus walk reports 12/30. FE-B draws the focus ring on the card's media child, and the metric only looks at the element and its ancestors. The ring is visible, so either FE-B moves it or QA widens the probe.
- B-06, B-09 and B-16 are FE-A's Atlas and grid work in progress.
- `build.js` still preloads the masthead `map.svg`, which v2 no longer draws.
- `og.js` still looks for Playfair files, so share cards fall back to Inter until the platform repoints it to Bricolage.
