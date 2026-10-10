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
| Gallery | FE-A | Not landed yet (A-03) — styles are ready in `views.css` (`.ghero .row .rail .gc .cover .pager`) | pending |
| Atlas | FE-A | Not landed yet (A-02) — page-level 46 / 54 split + rank ring ready | pending |

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
