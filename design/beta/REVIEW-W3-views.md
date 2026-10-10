# Wave 3 visual review — the four view styles (D-04)

> UI/UX lane · 2026-10-10 · against ROUND-1's look-and-feel criteria (polish, imagery, typography, layout, motion, luxury +
> fun, wanderlust) at 390 × 844 (DPR 2, touch) and 1440 × 900, served from disk with every off-origin request aborted.
> Shots: `design/beta/eval/w3/designer/` (tool: `design/beta/tools/w3-shots.js`, `--mount=<view>` previews a module
> before FE-A's switcher lands). Defects go to their lane through `docs/BETA-LOG.md`.

## Status per view

| View | Lane | State on review | Verdict |
|---|---|---|---|
| Guidebook | FE-B | Module landed (slice 1); previewed by mounting `guidebook.js` into a `.vw.view-guidebook` host | ◐ **Good** — reads as a field guide; 2 defects below |
| Insights | FE-B | Module landed (slice 1); previewed the same way | ✅ **Ship** after 2 small fixes; charts meet the D-02 rules in light and night |
| Gallery | FE-A | Landed (FE-A W3 slices 1–2); reviewed on the live head | ◐ → ✅ after this round's designer fixes (below); 3 asks for FE-A |
| Atlas | FE-A | Landed; reviewed on the live head | ✅ **Ship** — 46 / 54 split, map + tray detents on phones |

## Insights — `ins-cle-{m,d}.jpg`, `ins-cle-chart-night-d.jpg`

- ✅ Stat tiles 2 / 6 columns, Didone numerals, the "no pop-culture collection in this city's data" gap stated in its tile.
- ✅ Charts: one axis each, value labels at the bar ends, legend above, 2 px segment gaps, "Show as a table" and a
  footnote on every card; the dark set is **selected by token** in night mode (no filter), as D-02 requires.
- ✅ Area colours only on the area-identity charts (Where the places are, How far you walk); Closures use `--closed`.
- **Fixed here (DES):** the stat tiles inherited the hub tile's 150 px art row (`.tile` from the component library) and
  stood ~235 px tall with the number at the bottom. `views.css` now resets them (rows none, no hover lift, equal heights).
- **For FE-B:** (1) "The signature canon" is a single series drawn in `--series-2` (orange); a single series takes
  `--series-1` (dataviz rule: fixed order, first slot first). (2) Desktop area labels truncate at ~22 characters
  ("University Circle & Eas…") although the 640 viewBox has room — widen the label column to ~200 px on the wide render,
  or wrap to two lines; keep the full name in the `<title>`.

## Guidebook — `gb-tokyo-{m,d}.jpg`

- ✅ Cover in Didone at hero size with the native name, the italic tile line, computed facts and the ★ line; the
  contents column is sticky on desktop and a chip bar on phones; chapter heads carry the area colour rule.
- ✅ No uppercase beyond one eyebrow per block ("CONTENTS", "CHAPTER 1 OF 13").
- **For FE-A (host):** on phones the Guidebook's first line sits at ~1.9 screens because the collection rail and the
  list toolbar stay above it. In Guidebook and Insights, collapse the rail to its ★ tile or move it below the module
  (the lenses still apply), so the cover is the first screen.
- **For FE-B:** the contents chip bar leaves ~90 px of empty paper before the cover on phones (sticky bar margin + cover
  padding); drop the cover's top padding to 12 px under 640 px.

## Gallery — `gal-tokyo-{m,d}.jpg`, `gal-cle-d.jpg`, `gal-grid-{m,d}.jpg`, `gal-rows-{m,d}.jpg`

- ✅ Rows in SPEC order with Didone titles, computed subtitles and "See all n"; the night hero draws the city's verified
  pins at full size; the pager, the "all N" line and show-all are present.
- **Fixed here (DES, `views.css` V1c):**
  - **Grid cards are cover-led** (FE-A's ask): a 4:3 cover on top (area tint, pin art, ringed pin, vertical plate or
    Didone initial, glyph), then eyebrow, name in ink at 21 px, a 2-line write-up and Recommended by. "Look for" and the
    address stay on the experience page.
  - **Lead card cover was blank (0 px wide)**: size containment on a shrink-wrapped card. Covers now take the card's
    width, and the lead card stacks cover over text.
  - **Cover plates collided with the component library's `.plate`** (tint, 5 px edge, overflow hidden), so initials
    showed as clipped slivers in a stripe. Reset inside views.
  - **Phone hero went from ≈ 1.7 screens to ≈ 0.9**: the min-height is dropped on phones, the dek is hidden (the italic
    lead already says it; on desktop it collided with the kicker), the facts are set at 13.5 px, and the platform's
    duplicate masthead art steps back behind FE-A's sky. The sky is masked behind the text.
  - Phone row heads wrap, with titles at 24 px, so "See all" no longer squeezes them to 3 lines.
  - The grid's vertical plates were < 4.5:1 on the tint in light mode (axe, 13 nodes); they now use a darker area mix.
- **For FE-A:** (1) the lead card and rows still print the place's English name without its macron where the record has
  one (`Kanda Myojin` vs the button's `Kanda Myōjin`); use the same name field everywhere. (2) Tokyo's row cards ship 12
  per rail on phones; consider 8 on phones to keep the DOM well under budget after the first scroll. (3) With
  off-origin tiles blocked, the Atlas map shows the pin art only (expected); the "Try again" control is now styled
  (QA-30).

## Atlas — `atlas-tokyo-{m,d}.jpg`

- ✅ The desktop split is 46 / 54 with area chips in the toolbar, rank badges and the numbered pins. On phones it's a
  full-bleed map with a tray, and the toolbar and chips sit in the tray head. Pin labels take the area colour (`--ac`).
- **QA-30 (night contrast on every place page)** was the map fallback's unstyled "Try again" button (a browser-grey
  face under night ink). It is now a styled 44 px pill. axe night: 0 serious/critical on Cleveland Atlas 1440, Cleveland
  Gallery 1440, Tokyo Gallery 390 and 1440, and Chinatown 390.

## Cross-view (designer, this wave)

- `views.css` matches **both** root conventions: `.vw.view-<name>` (announced) and FE-B's `[data-cleo-book]` /
  `[data-cleo-insights]`, so no lane has to rename.
- Polish residue (ROUND-2 gap #2) closed on the designer side: italic masthead macrons, motif clear of the facts on
  phones (`mast-*-m.jpg`), "More days" 44 px pills, area-coloured map labels once FE-A passes `--ac`.
- Motion (gap #5): save pop, been-there stamp, door glyph nudge, mode-pill and selected-pin pop, the view-switch rise,
  Gallery cover lift — all behind `prefers-reduced-motion: no-preference`; nothing autoplays.
- Landing (gap #4): a night panorama of the six country motifs under the hero (`landing-hero-{m,d}.jpg`).
- QA-24 (footer links underlined) and QA-25 (saved night map note on its own surface chip) fixed; axe 0 serious /
  critical on saved (night, 390), saved (1440), Tokyo (390) and the landing (night, 1440).
