# W6 type & style audit — what ships today, rated

Owner request (2026-10-11): rate the fonts, the styles and everything else visual, then build the improvements in.
This audit rates the beta as it stood at `146b7434` (W5 + R5 follow-up, the Constellation look). It compares it with
melon-seek (the owner's own site, snapshot in `design/reference/melon-seek/`) and with the general patterns of the leading
hotel, experience and booking products, described neutrally. Scores are 0–10 per item; the machine-readable card is
[`scores.json`](scores.json). The three directions and the choice are in [`DECISION.md`](DECISION.md).

**Evidence.** Screenshots are in [`audit/`](audit/). They were taken with
`NODE_PATH=$(npm root -g) node design/beta/style/tools/style-shots.js design/beta/style/audit`, with Playwright on the
preinstalled Chromium, every off-origin request aborted, at DPR 1 and with reduced motion. The set covers:

- pages: the landing page, the Japan hub, and Tokyo in Gallery, Atlas, Guidebook and Insights;
- two place sheets: Kanda Myōjin, and Việt Nam Quốc Tự in Ho Chi Minh City;
- sizes and themes: 390×844 and 1440×900, light everywhere, plus dark for the landing page, Gallery, the sheet and Insights;
- a type specimen at DPR 1 and DPR 2 (`specimen-dpr*.png`): 64/38/28/21 px display, 16/14/13/12 px UI, macrons,
  Vietnamese, CJK, figures and weights.

Two crops come from extra probes: `macron-opsz-compare-dpr1.png` and `fraunces-macron-defect.png`. The counts come from
greps over `beta/assets/cleo.css` + `fe-a.css`. Coverage comes from fontTools cmaps against every non-ASCII character in
`beta/**/*.html`. The weights come from `tools/beta/metrics.js --only cities/tokyo`.

## 1. Headline findings

1. **Vietnamese breaks in both faces.** Neither Bodoni Moda nor Figtree ships the Vietnamese block. Across the beta,
   **43 display characters / 805 occurrences** and **44 UI characters / 842 occurrences** (ư ơ ế ệ ủ ả ị ầ ờ ậ ớ ở ề ạ ố
   ồ ợ ứ ộ ấ …) fall back to a system face, mid-word. "Việt Nam Quốc Tự" is set in two typefaces at once
   (`audit/sheet-vn-m.jpg`, `audit/specimen-dpr1.png` rows "disp 28" and "ui 14"). It is the most visible type defect on
   any Vietnam page.
2. **Bodoni's macrons survive only through patches.** The Didone hairline macron disappears at DPR 1 whenever optical size
   runs automatically. In `macron-opsz-compare-dpr1.png`, "Ōsaka" loses its macron at 64 px and "Jōnan" loses it at
   21 px. W2–W5 answered this with **13 optical-size overrides** across three files: opsz 6, 11, 14 and 28, weight 460,
   `font-kerning: none` and per-page generated rules. They work, but they are fragile and they flatten the face's
   contrast exactly where the voice should be strongest.
3. **The type scale has drifted.** There are **73 distinct `font-size` values**. **204 declarations** sit on eight raw
   steps between 12 and 16 px: 12, 12.5, 13, 13.5, 14, 14.5, 15 and 16. The tokens define only 12.5 / 14 / 16. Weights
   come in 400 / 460 / 500 / 600 / **650** / 700.
4. **Radius and elevation are tokenised but not obeyed.** There are **27 distinct radii**, with 62 raw px uses (9, 10, 12,
   13, 14, 16, 20, 24) next to the 6/10/16/24 tokens. There are four elevation tokens, but the night edition redefines only
   three: `--e-4` keeps a light-mode navy shadow on a dark page.
5. **Numbers don't line up.** Only 3 rules use tabular figures. Chip counts, ranks, pins, Insights stat tiles and chart
   value labels use proportional figures. The stat tiles use Didone figures (`audit/insights-d.jpg`), which have high
   contrast and hairline joins and are hard to scan as data.
6. **Colour, skins, icons and motion are in good shape.** All text pairs are AA in light and dark
   (`design/beta/tools/contrast.py`). There are 12 per-city skins with AA-checked night variants. There is one icon grid
   (24 px, 1.75 stroke, round caps). Motion runs on tokens and collapses to 0 under reduced motion. Nothing here needs a
   redesign.

## 2. Scorecard — what ships today vs melon-seek vs the leading products

The **leaders** column is a neutral description of general patterns, not of any one product:

- **Hotel sites:** a large, high-contrast serif display over a quiet sans, and generous whitespace.
- **Experience marketplaces:** one rounded grotesk at 3–4 weights, image-first cards, 12–16 px radii and soft one-layer
  shadows.
- **Booking products:** a dense UI sans tuned for 12–14 px, tabular prices and counts, small radii, and strict token
  discipline.

| # | Item | Today | melon-seek | Leaders | Evidence (today) |
|---|---|---:|---:|---:|---|
| T1 | Display face: legibility at running sizes (15–24 px) | 4 | 7 | 8 | Didone hairlines at 21 px card names and 15–19 px italic deks; legible only with opsz patches (`specimen-dpr1.png`) |
| T2 | Display face: character, luxury × fun | 8 | 4 | 7 | Bodoni Moda is a real fashion voice. Luxury is high; fun comes from italics and initials |
| T3 | UI face: legibility at 12–16 px | 6 | 9 | 9 | Figtree is geometric with a small x-height; `Il1` is ambiguous at 12 px ("ui 12" row); metrics report it rendered as "Figtree Light" |
| T4 | UI face: weights, hierarchy, numbers | 5 | 8 | 8 | 6 weights including 460/650 in-betweens; proportional figures; 3 tabular rules |
| T5 | Diacritics: macrons at DPR 1, Vietnamese | 3 | 6 | 9 | §1.1 and §1.2. melon-seek ships Inter latin + latin-ext only (it needs no Vietnamese) |
| T6 | CJK fallback stack | 6 | 5 | 8 | The UI stack names Hiragino / Noto Sans JP / IPA; the display stack has no CJK serif, so 東京 in a Didone line drops to the generic serif |
| T7 | Weight / optical-size range, used well | 4 | 8 | 8 | The opsz 6–96 axis ships and is then pinned four different ways by overrides |
| T8 | Font file weight | 8 | 8 | 7 | Tokyo loads about 183 KB of woff2 (6 files); melon-seek loads 133 KB (2 files) |
| S1 | Type scale discipline | 4 | 6 | 8 | 73 distinct sizes; 204 raw 12–16 px declarations on 8 steps (melon-seek has 19 distinct) |
| S2 | Line-height and measure | 7 | 7 | 8 | Prose is capped at 62–64ch and line-heights are tokenised. The Gallery dek caps at `30ch`, which depends on the face |
| S3 | Letter-spacing and uppercase | 6 | 7 | 8 | 19 distinct letter-spacings. Uppercase is disciplined (≤ 1 eyebrow per block, metrics B-19) |
| C1 | Colour tokens, light | 8 | 8 | 8 | Paper / ink / gilt plus one city accent, all AA |
| C2 | Colour tokens, dark | 7 | 8 | 7 | The night edition is AA, but its shadow set is incomplete (`--e-4`) |
| C3 | Per-city skins | 8 | 5 | 6 | 12 skins with motifs and night variants; melon-seek has one accent |
| P1 | Spacing rhythm | 7 | 7 | 8 | A 4-pt token scale, but many raw px paddings |
| P2 | Radius | 5 | 8 | 8 | 27 distinct radii; tokens of 6/10/16/24 versus raw 9/12/13/14/20 |
| P3 | Elevation and shadows | 6 | 9 | 8 | 4 tokens of 2 different families; melon-seek has a crisp 3-step `--ms-shadow-sm/-/-lg` |
| P4 | Borders and hairlines | 7 | 8 | 8 | `--line` / `--line-strong` are used consistently |
| K1 | Cards | 8 | 7 | 9 | Art plates, tier glyphs and a visible "Recommended by" line. Strong |
| K2 | Chips and pills | 7 | 8 | 8 | 44 px targets; counts set in proportional figures |
| K3 | Buttons | 7 | 8 | 9 | Pill buttons, one primary fill; two radius families |
| K4 | View switcher | 8 | 8 | 8 | Segmented control on desktop, select on phone |
| K5 | Place sheet | 7 | 7 | 9 | Good structure; the Vietnamese title mixes faces |
| K6 | Filter tray | 7 | 7 | 8 | "Show N places" is clear |
| K7 | Rails | 7 | 6 | 8 | Signature tiles are vivid; mixed radii |
| K8 | Charts and stat tiles | 6 | 8 | 7 | Didone stat figures; proportional value labels |
| K9 | Masthead | 8 | 6 | 8 | Night ground with map art; the italic dek is charming but depends on patches |
| I1 | Iconography | 8 | 8 | 8 | One line-icon grid; glyph masks |
| M1 | Motion | 8 | 7 | 8 | Tokens, view transitions, reduced motion respected |
| X1 | Consistency across the four views and the hubs | 6 | 8 | 9 | Each view carries its own raw sizes and radii and its own opsz patch |
| | **Total (of 300)** | **196 (65.3 %)** | **216 (72.0 %)** | **240 (80.0 %)** | |

## 3. melon-seek ideas that help (and are adopted)

| Idea | In melon-seek | What it fixes here |
|---|---|---|
| One font token per role | `--ms-font`, `--ms-mono` | `--font-display` / `--font-ui` stay the only families; the 13 per-selector face patches go |
| A 3-step elevation scale | `--ms-shadow-sm` / `--ms-shadow` / `--ms-shadow-lg` | `--shadow-sm` / `--shadow` / `--shadow-lg`, with `--e-1/2/4` aliased onto them and a full night set (P3, C2) |
| A consistent radius pair | `--ms-radius` 10 / `--ms-radius-sm` 7 | `--radius` 12 / `--radius-sm` 8 (+ `--radius-lg` 20 for sheets); 47 raw radii mapped onto tokens (P2) |
| Inter-style UI legibility | Inter, variable, self-hosted, `font-display: swap`, latin / latin-ext split | Inter replaces Figtree, with a Vietnamese subset added (T3, T5) |
| Tabular figures for counts and charts | 9 `tabular-nums` rules | One `--num` token on every count, rank, pin, stat and chart value (T4, K8) |
| A focus ring as a token | `--ms-focus` | `--focus-ring` |

Not adopted: melon-seek's green and pink accent and its single-accent palette. The guide's per-city skins are one of its
strengths (C3).

## 4. After (direction B, as implemented)

The final column of [`scores.json`](scores.json) is direction B as built. The before / after screenshots are in
[`after/`](after/), with the same names as `audit/`. The measured results are in [`DECISION.md`](DECISION.md) §4.
