# W5 designer + imagery review — macrons at DPR 1, motifs by kind, masthead link

Lane: designer + imagery art · Wave 5 (final build round) · 2026-10-10 · brief: `design/beta/eval/W5-BRIEFS.md` → "Lane: designer".
Work list from `design/beta/eval/ROUND-4.md` → "Top 10 remaining gaps": **#4** (macrons invisible at DPR 1), **#6** (cover motif
keyed on the glyph, not the kind), and the CSS half of **#3** (masthead "last checked" link). There were no open designer
defects in BETA-QA.md (the W4 QA sign-off was YES). No photographs were added or faked.

Screenshots: `design/beta/eval/w5/designer/<shot>-{m,d}-{before,after}.jpg` at 390×844 and 1440×900, **DPR 1** (the
evaluator's failing case), reduced motion. Crops: `crop-*-d-{before,after}.png`. Script: `design/beta/tools/w5-shots.js`.

## 1. Macrons at DPR 1 (gap #4)

**Cause, measured.** Bodoni Moda is a variable font with an optical-size axis (`opsz` 6–96; checked in the woff2 `fvar`
table). The macron is a single hairline, and its thickness follows `opsz`. At `opsz` 28 (the W2 cap) and at `auto`, the
hairline falls between two pixel rows at DPR 1 and rasterises to nothing. A matrix of sizes 15–64 px × `opsz` 6/8/11/16/28/auto ×
weight 420–700, on paper and night grounds, showed that only `opsz` 6 (the caption master) keeps a full pixel row at every size from
15 to 36 px. `opsz` 11 still drops "Kyūshū" at 15–17 px italic.

**Change** (`design/beta/css/views.css` § V11 + `build-css.py`):
- Every Bodoni line from 15 to 36 px uses `opsz` 6 with optical sizing off: card and cover names, area titles, section
  titles, deks, notes, leads, Guidebook entry names, Atlas rows and saved lists. Names are set at weight 460, which makes
  up for the caption master's wider, darker set. The Didone contrast stays; the hairlines are just one pixel instead of zero.
  V11 is declared last because a `font:` shorthand resets `font-variation-settings`.
- The phone hero dek moves from 14 px in the secondary night ink to 15 px in the primary night ink. At 14 px, even `opsz` 6
  kept the macron below one full-contrast row.
- The large city names (h1, `.d1`, Guidebook `.hero-t`) keep `auto` everywhere except on the Japan pages, where
  build-css.py caps them at `opsz` 14 (from glyphs.json `"japan"`). Cleveland and NYC heroes keep their high-contrast cut.

**Verified, not eyeballed.** `design/beta/tools/macron-check.js` screenshots each line at DPR 1, then folds the macrons
(ō → o) in place and screenshots again. It counts the pixels that differ strongly (summed RGB delta > 150). Fewer than 4 means FAIL.

| Line (Tokyo) | Before (W4 CSS) | After |
|---|---|---|
| Hero dek "Jōnan · Jōsai · Jōhoku · Jōtō…", desktop | **FAIL 0 px** | PASS 24 px |
| Hero dek, phone | **FAIL 0 px** | PASS 24 px |
| Card name "Kanda Myōjin", desktop | **FAIL 0 px** | PASS 11 px |
| Card name, phone | 5 px | PASS 11 px |
| Gallery cover name "Kanda Myōjin", desktop / phone | 4 px / 4 px (faint) | PASS 10 px / 10 px |
| Area titles "Jōnan", "Jōtō" | pass | pass |

Raw output: `w5/designer/macron-{before,after}.txt`. Crops: `crop-hero-d-*` ("Jonan · Josai" → "Jōnan · Jōsai"),
`crop-kanda-name-d-*`, `crop-kanda-cover-d-*`.

## 2. Cover motif by kind, not glyph (gap #6)

**Before** (`crop-kanda-cover-d-before`, `tokyo-kanda-d-before`): the cover motif was the card glyph, and the glyph is the
*first* collection id. For Kanda Myōjin that id is `ANIME`, so the cover showed a speech bubble with a star, while Yasukuni
(`TEMPLE` first) got the gate.

**After** (`crop-kanda-cover-d-after`, `tokyo-kanda-{m,d}-after`): the cover keys on what the place *is*.
- `imagery.motifOf(rec, glyph)` (`tools/beta/imagery/index.js`) takes the first **kind** id in the record's own collection
  order. Kind ids include `TEMPLE`, `MUS`, `CASTLE`, `PARK`, `NATURE`, `WATER`, `ONSEN`, `MKT`, `VIEW` and `RIDE`.
- Theme ids (`ANIME`, `POP`, `FREE`, `ICON`, `FAM`, `ENT`, `NIGHT`, `UNESCO`…) say why a place is listed. They decide only when
  a record has no kind id.
- Food keeps its cuisine-id glyph. Ids only, never names or descriptions (Wenwen rule). Kanda Myōjin
  (`ANIME TEMPLE POP CASTLE`) → the gate.
- The card carries `data-m`, and the Gallery grid cover copies it. These are one-attribute hooks in FE-A's `render/city.js` and
  `client/gallery.js`, logged in BETA-LOG. build-css.py writes the `[data-m]` mask rules after the glyph rules, so the glyph
  rules remain the fallback.
- `worship` resolves per country. The shrine gate is Shinto-specific, so it is drawn only on Japan pages; elsewhere a generic
  gabled hall with a spire is used. Today no non-Japan page has a `TEMPLE` id, so the gate was never mis-drawn, but the rule now holds by construction.
- Three new original motifs fill kinds that had no art: **waves** (river, canal, lake, beach, boat, maritime, water),
  **spire** (worship outside Japan) and **wheel** (rides). They are generic line art, never a venue (`imagery/kinds.js`), which now has 31 kinds.

**Audit** (`w5/designer/MOTIF-AUDIT.md`, `design/beta/tools/motif-audit.py`): 7,638 cards on 34 city pages. **796 now draw
their kind instead of their glyph**, for example Tokyo 41 (Kanda Myōjin → gate, Akihabara Electric Town → shopfront) and Kyoto
38 (Kiyomizu-dera → gate). The per-city top-5 pairs are in that file.

**Stated gap, not filled:** Cleveland's 148 sights carry **no collection ids** in the live data (`g: []`), so they keep the
compass motif. Composition, tier plate and pin crop still vary them. A keyword guess from the write-up would break the
Wenwen rule, so none was made. Giving these records collection ids is a data task for the live Cleveland page, which is outside beta scope.

## 3. Masthead "last checked" link (gap #3, CSS half)

**Cause:** `contract.css` §5 makes every masthead link `display: inline-flex` for the 44 px target. A flex container drops
its leading white space ("last checked2026-10-03"), and the 44 px box stretched one line box, which made the phone stat
paragraph's line gaps uneven.

**Change** (`views.css` § V12): prose links in the stat line, dek and why line are `display: inline` again. The 44 px
target comes from vertical padding (`calc((var(--tap) - 1.2em) / 2)`), which grows the hit box and the bounding box but not the line box.

**Measured** (390 and 1440, Tokyo Atlas and Gallery, Cleveland): the text reads "last checked 2026-10-03" and the link box is
**44 px** tall. Paragraph height equals lines × line-height exactly (84 = 4 × 21, 81 = 4 × 20.25, 42 = 2 × 21), so the gaps are
even again (`tokyo-gallery-m-after`, `tokyo-hero-m-after`). Moving the link off the first-card path (B-03 ≤ 14) is markup,
which stays with FE-A and platform per the W5 brief.

## Expected effect on A (ROUND-4 rubric)

- Typography 82 → about 85: the macron hairline was the only remaining item.
- Visual polish 77 → about 79: the masthead space and uneven gaps are fixed; the macrons read on the hero and covers.
- Imagery 61 → about 62: the cover now names the kind. The cap without photographs still applies, and gap #1 still needs the owner.

On this lane alone, A goes from about 74 to about 75–76. Reaching 80 still depends on FE-A's Gallery default (gap #2) and on photographs (gap #1).
