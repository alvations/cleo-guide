# W4 designer + imagery review — cover variety, motion, view polish

Lane: designer + imagery art · Wave 4 · 2026-10-10 · brief: `design/beta/eval/W4-BRIEFS.md` → "Lane: designer".
Work list: ROUND-3 gaps **#3** (Gallery cover monotony), **#5** (motion and delight, CSS side), **#2** (the CSS half of the
new-view polish), plus the open DES defect **QA-35**. No photographs are faked: every cover is still drawn from the
place's own data (area pins, the pin itself, tier, kind) and original generic line art.

Screenshots: `design/beta/eval/w4/designer/<shot>-{m,d}-{before,after}.png` at 390×844 (DPR 2, touch) and 1440×900, shot
by `design/beta/eval/w4/designer/shots.js` against the generated `beta/` (tiles stubbed, everything else off-origin
aborted).

## 1. Gallery covers (gap #3)

**Before** (`tokyo-gallery-grid-d-before`, `tokyo-gallery-rows-d-before`): every cover in an area was the same drawn
polygon at the same size and spot, with only the ringed pin moving. A row of four read as one picture repeated.

**After** (`tokyo-gallery-grid-d-after`, `tokyo-gallery-rows-d-after`, `cle-gallery-grid-d-after`, `-m-after`): each cover is
built from four independent signals:

| Signal | What changes | Source |
|---|---|---|
| **Kind motif** | An original line drawing of the place's kind: shrine gate, noodle bowl, museum portico, keep, trees, cup, dumpling, lantern, ticket, and so on. There are 28 kinds, one per `data-gl` glyph key. Each subject is generic and never depicts a venue. | `tools/beta/imagery/kinds.js` → `beta/assets/img/motifs/kinds/<gl>.svg` (mask art, 0.5–1 KB each) |
| **Plate colour by tier** | Must see: a deep area ink, a solid tier bar along the top edge, and a stronger motif. Worth the detour: the area ink (as before). Deep cut: a lighter ink, with an outlined Didone initial instead of a filled one. | `views.css` § V10, from `data-t` |
| **Crop / zoom by pin** | Compositions 1 and 3 zoom the area art around **this** pin (`transform-origin` = the pin). They show the neighbourhood, not the whole area. The ring counter-scales, so it stays 16 px at full strength. | `--rx/--ry` hook on the art box (gallery.js) |
| **Composition** | Five layouts: **0 map** (pins large, small motif at the foot) · **1 motif hero** (the motif large over a faint 2.6× crop) · **2 band** (a tier-tinted ground band, the motif standing on it, pins small above) · **3 close crop** (1.75× around the pin) · **4 pattern** (the motif as a faint printed ground, pins centred). | `data-comp` = position among the cards on screen, mod 5 |

**No two neighbours share a composition.** `data-comp` counts only the cards on screen. Hidden or paged cards don't count,
so a lens can't line two equal covers up. A cycle of 5 against 1, 2 or 4 columns means a card's right-hand neighbour and
the card below it always differ (i±1 and i±4 are never ≡ 0 mod 5). Row rails count from 0 in each row, and the hero lead
card is composition 1.

**Vertical plate only for CJK.** Row and lead cards now set the native name vertically only when it contains CJK
(Han, kana or Hangul) script. Otherwise they fall back to the initial. As a CSS backstop, a `.pl-vert` / `.plate.v` that
isn't `:lang(ja|zh|ko)` sets horizontally. The live data has one non-CJK native string (Osaka, "Chiikawa Land · Donguri
Republic"), and it was already too long to be vertical.

When a vertical plate holds the left column, the small motif steps right of it. Closed places keep their hatch, and
their motif goes grey. In dark mode every colour comes from `--ac` mixed with `--ink`, so the motif flips with the theme.

## 2. Motion (gap #5, CSS side)

Every effect answers a tap or a scroll. None runs on load, and all of them are off under `prefers-reduced-motion`
(§13 zeroes every animation and transition; the W4 block sits inside `no-preference`). Checked in Chromium with
`reducedMotion: 'reduce'`: bar `animation-name` is `none`, and the hearts are still.

- **Save heart and stamp.** The W3 pop also played on every already-saved heart when the page painted, which counts as
  autoplay. It now plays only while the control that caused it holds focus (the tap). The Guidebook `.ge-save` and the
  sheet's "Been there" button get the same pop. A card's "Been there" stamp animates only after a button press
  (`html:has(button:focus)`), so stamps painted at load stay still.
- **Rail-door press.** Collection doors, Gallery row cards and the lead card scale to 0.97 on `:active`.
- **Sheet rise.** The bottom sheet rises 32 px with an opacity floor of 0.6. Side sheets keep their slide.
- **View-switch cross-fade.** The new view's roots fade from 0.35 and lift 8 px over 220 ms. This plays only when the
  reader picks a view (`html:has(nav.views :focus)`), never on first paint. Each view has its own keyframe name, so the
  shared `.split` restarts too. `::view-transition-*` is styled for when FE-A wraps the switch in
  `document.startViewTransition` (requested in BETA-LOG).
- **Insights bars grow on first view.** Bars scale in from 0 on a scroll-driven `view()` timeline, finishing when the
  chart's top third is on screen. A chart already on screen at load shows full. Without `animation-timeline` support,
  the bars simply show full. Nothing is timed.

## 3. View polish, CSS half (gap #2)

| Item | Before | After |
|---|---|---|
| Gallery hero title vs. subtitle | The Didone "y" descender and its ball sat on the kicker ("…re●commended"), and pins sat under the text (`tokyo-gallery-d-before`). | The title gets its descent back (`padding-bottom: .16em`, kicker +10 px). The pin sky is masked to 10 % under the text column (desktop: the left 38 %; phone: the left half), with a night halo on the text (`tokyo-gallery-{d,m}-after`). |
| Guidebook phone dek / stat line | Clipped at the right edge in R3. | `.lead`, `.gfacts`, `.gsig`, `.hoods` and `.ge-m` always wrap (`white-space: normal`, `min-width: 0`, `overflow-wrap`) (`tokyo-guidebook-m-after`). |
| Insights dates | "status checked to 2026-10-" / "03" (`tokyo-insights-closed-d-before`). | Tile captions use `text-wrap: balance`, so the break falls at a word: "status checked / to 2026-10-03" (`tokyo-insights-closed-d-after`). Any `<time>` or `.nw` in Insights and Guidebook is `nowrap`. FE-B is asked to wrap the tile date in `<time class="nw">` so the result is guaranteed, not just balanced. |
| **QA-35** Guidebook source URLs | 36 px × 240–528 px slivers on a 390 px phone: the URL list fell into the 36 px first column of the source row's grid. | The list spans the row (`grid-column: 1 / -1`) and each link takes a full line. Measured on Tokyo at 390 px: 952 links, all 326 × 44–48 px, 0 under 44 × 24. |

## 4. Files

- `tools/beta/imagery/kinds.js` (new) and `tools/beta/imagery/index.js` (emits the kind motifs).
- `design/beta/css/views.css` § V10–V12. It also back-ports the W3 fix lane's hand edits to `cleo.css` (QA-32/33), so
  `build-css.py --check` is in sync again.
- `design/beta/tools/build-css.py` writes one mask rule per kind file.
- `tools/beta/client/gallery.js` has a **cover markup hook only**, allowed by the brief and logged: `data-comp` /
  `data-t` / `data-gl` on covers, `--rx/--ry` on the art box, and a CJK test for the vertical plate. Gallery behaviour,
  rows, paging and hearts are unchanged.
- Regenerated: `beta/assets/cleo.css`, `beta/assets/img/motifs/kinds/*.svg`, versioned pages and `sw.js` (`npm run beta`).

## 5. Left / handed on

- FE-A: wrap the view switch in `document.startViewTransition` when available (the CSS is ready). Optionally, the
  `.pl-vert` CJK test in `client/city.js` (the CSS backstop covers it now).
- FE-B: `<time class="nw">` around the Insights "Closed, kept" date.
- Gap #1, photographs, is still an owner action. The cover compositions keep the photo variant (`.cover.photo`)
  untouched, so credited photos slot in unchanged.
