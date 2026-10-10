# Evaluation round 4 — independent evaluator

> 2026-10-10 · evaluator lane (no build lane) · session_01RFcHDrt3fLoaYNqR4bkKic
> **Measured:** R4 is the beta at `8aa6fdf4`, the W4 build-complete head. `npm run beta:check` passes: 179 pages, 84 place
> pages, 8,458 places, beta == live. `npm run validate` and `npm test` (all suites, including the new i18n gate) are green
> on that SHA.
> **Baseline:** R3 is the beta at `83aa1a28`, the head [ROUND-3](ROUND-3.md) scored. It was read with `git archive 83aa1a28 beta`.
> **Rubric:** unchanged from ROUND-1 to ROUND-3: the same four dimensions and weights, the same A/B sub-criteria, the same
> 35-row feature table for C, and the same D strengths.

## Verdict

**The overall gate is met with more margin. The goal is still not met.** R4 scores **83.4 / 100** (R3 80.8), with
**A = 74** and **C = 96**. The goal is ≥ 80 overall with A ≥ 80 and C ≥ 80.

- **Overall** rises by +2.6, from wins in all four dimensions.
- **C is now near-complete** (96): a human-readable "What changed" page, motion, and i18n scaffolding.
- **B recovers** (85): Guidebook mounts lazily, its small targets are fixed, and the phone map shows one sheet.
- **A is still the blocker** (74, needs 80). Covers now vary and motion exists, but there are still **0 photographs**.
  Gallery is still not the default, and the W4 masthead link added a visible defect on every city page.
- **Stretch 90 is not in reach** without photographs.

## Scorecard

| Dimension (weight) | R2 `764dc97b` | R3 `83aa1a28` | **R4 `8aa6fdf4`** | Δ R3→R4 | Goal |
|---|---:|---:|---:|---:|---:|
| A. Look & feel (40 %) | 67 | 71 | **74** | +3 | ≥ 80 ✕ |
| B. UX & ergonomics (25 %) | 84 | 84 | **85** | +1 | — |
| C. Competitor feature coverage (20 %) | 89 | 91 | **96** | +5 | ≥ 80 ✅ |
| D. Unique strengths (15 %) | 86 | 88 | **89** | +1 | — |
| **Overall (weighted)** | **78.5** | **80.8** | **83.4** | **+2.6** | ≥ 80 ✅ |

R4 = 0.4×74 + 0.25×85 + 0.2×96 + 0.15×89 = 29.6 + 21.25 + 19.2 + 13.35 = **83.4**.

## Method

Identical to ROUND-3, plus the "What changed" pages.

1. In a detached worktree at `8aa6fdf4`, ran `cd tools && npm install`, then `npm run validate`, `npm test` and
   `npm run beta:check`. All PASS.
2. Served that tree on port 8791 (R4). Served a mirror with `beta/` replaced by `83aa1a28:beta` on port 8792 (R3).
3. Took screenshots with [`r4/tools/shots-r4.js`](r4/tools/shots-r4.js). It is ROUND-3's `shots-r3.js` plus three pages:
   - `changes/tokyo.html`;
   - `changes/cleveland.html`;
   - a Gallery scroll to the cover grid (`tokyo-gallery-p2`).

   The capture settings are the same as ROUND-3:
   - 390×844 @2× touch, and 1440×900;
   - light theme and reduced motion;
   - off-origin requests aborted and tiles stubbed. **The blank map ground is a sandbox artefact.**
   - The same 4 saved refs are seeded.

   The 61 flows per round are logged in [`r4/shots-r4-log.json`](r4/shots-r4-log.json) and
   [`r4/shots-r3-log.json`](r4/shots-r3-log.json). Composites were built with [`r4/tools/pair.py`](r4/tools/pair.py).
4. Ran `npm run beta:metrics` on the pilots in the throwaway worktree, without touching QA files. The output is in
   [`r4/beta-metrics-r4.md`](r4/beta-metrics-r4.md). It measures the default view (Atlas) only.
5. Ran one probe: the computed style of the masthead "last checked" link (see A, polish). No web research and no WebFetch.

**Process note.** QA's W4 pass on `8aa6fdf4` runs in parallel and is not in yet. Motion is judged from the code and
REVIEW-W4, because the method captures under reduced motion.

## Side-by-side (R3 → R4)

Composites are labelled R3 `83aa1a28` | R4 `8aa6fdf4`.

| Page | Mobile 390×844 | Desktop 1440×900 |
|---|---|---|
| Landing | ![](r4/landing-m-r3-r4.jpg) | ![](r4/landing-d-r3-r4.jpg) |
| Country hub (Japan) | ![](r4/japan-m-r3-r4.jpg) | ![](r4/japan-d-r3-r4.jpg) |
| Tokyo (default = Atlas) | ![](r4/tokyo-m-r3-r4.jpg) | ![](r4/tokyo-d-r3-r4.jpg) |
| Tokyo · Gallery hero | ![](r4/tokyo-gallery-m-r3-r4.jpg) | ![](r4/tokyo-gallery-d-r3-r4.jpg) |
| Tokyo · Gallery cover grid | ![](r4/tokyo-gallery-p2-m-r3-r4.jpg) | ![](r4/tokyo-gallery-p2-d-r3-r4.jpg) |
| Tokyo · Atlas | ![](r4/tokyo-atlas-m-r3-r4.jpg) | ![](r4/tokyo-atlas-d-r3-r4.jpg) |
| Tokyo · Guidebook | ![](r4/tokyo-guidebook-m-r3-r4.jpg) | ![](r4/tokyo-guidebook-d-r3-r4.jpg) |
| Tokyo · Insights | ![](r4/tokyo-insights-m-r3-r4.jpg) | ![](r4/tokyo-insights-d-r3-r4.jpg) |
| Cleveland (default = Atlas) | ![](r4/cleveland-m-r3-r4.jpg) | ![](r4/cleveland-d-r3-r4.jpg) |
| Cleveland · Gallery | ![](r4/cle-gallery-m-r3-r4.jpg) | ![](r4/cle-gallery-d-r3-r4.jpg) |
| Cleveland · Atlas | ![](r4/cle-atlas-m-r3-r4.jpg) | ![](r4/cle-atlas-d-r3-r4.jpg) |
| Cleveland · Guidebook | ![](r4/cle-guidebook-m-r3-r4.jpg) | ![](r4/cle-guidebook-d-r3-r4.jpg) |
| Cleveland · Insights | ![](r4/cle-insights-m-r3-r4.jpg) | ![](r4/cle-insights-d-r3-r4.jpg) |
| Singapore town (Chinatown & CBD) | ![](r4/chinatown-m-r3-r4.jpg) | ![](r4/chinatown-d-r3-r4.jpg) |
| Place detail (Kanda Myōjin sheet) | ![](r4/sheet-m-r3-r4.jpg) | ![](r4/sheet-d-r3-r4.jpg) |
| Sheet from a Gallery link | ![](r4/galsheet-m-r3-r4.jpg) | ![](r4/galsheet-d-r3-r4.jpg) |
| Switcher tap Atlas → Gallery | ![](r4/switch-m-r3-r4.jpg) | ![](r4/switch-d-r3-r4.jpg) |
| Mobile map (toggle + pin peek) | ![](r4/map-m-r3-r4.jpg) | ![](r4/map-d-r3-r4.jpg) |
| Saved lists | ![](r4/saved-m-r3-r4.jpg) | ![](r4/saved-d-r3-r4.jpg) |
| Day plan (Tokyo `#day=TAITO` · Cleveland rail tile) | ![](r4/day-m-r3-r4.jpg) · ![](r4/daycle-m-r3-r4.jpg) | ![](r4/day-d-r3-r4.jpg) · ![](r4/daycle-d-r3-r4.jpg) |
| What changed (Tokyo · Cleveland); R3 is a 404 | ![](r4/changes-m-r3-r4.jpg) · ![](r4/changes-cle-m-r3-r4.jpg) | ![](r4/changes-d-r3-r4.jpg) · ![](r4/changes-cle-d-r3-r4.jpg) |

## Key measurements (R3 → R4)

| Measure | R3 | R4 | Source |
|---|---|---|---|
| `beta:metrics` pilot score (default view) | 24/24 ×5, landing 10/10 | **23/24 ×5**, landing 10/10 | `r4/beta-metrics-r4.md` |
| B-03 controls above first card (≤ 14) | 14 | **15 ✕** on every pilot (the new "last checked" link) | metrics |
| B-01 screens to first card | 0.87–0.97 | 0.90–1.00 (Tokyo exactly 1.0) | metrics |
| Initial DOM, Tokyo: default · Gallery · Guidebook · Insights | 1,805 · 2,497 · 12,431 · 4,829 | 1,813 · 2,505 · **2,730** · 3,796 | shots log (mobile) |
| Initial DOM, Cleveland: Guidebook · Insights | 4,322 · 2,616 | **2,008** · 2,204 | shots log |
| Transfer, Tokyo (default view) | 2.16 MB | **2.06 MB** (target < 2.0) | metrics |
| FCP at 4× CPU: Tokyo · landing | 376 · 1,344 ms | 396 · **540 ms** | metrics |
| Targets < 44 px: Tokyo Guidebook (mobile) | ≈ 2,800 | **18** | shots log |
| Targets < 44 px: Tokyo Insights | 191 (bars 18 px) | 183 (bars **24 px**, meets 2.5.8; "Show as a table" fallback at 44 px) | shots log, BETA-LOG |
| Phone map, pin tap | peek **and** list tray stacked | **one sheet**, tray hidden and `inert` | `map-m` |
| Pages generated | 95 | 179 (+84 "What changed") | beta:check |
| `hreflang` | none | `en` + `x-default` on every page; no switcher (no reviewed 2nd locale) | page head, test-i18n |
| Photographs | 0 | **0** (`assets/img/photos/` has only a README) | `beta/assets/img/` |
| JS errors on 61 captured flows | 0 | 0 | shots log |

## Evidence per dimension

### A. Look & feel — R3 71 → R4 74

| Sub-criterion | R3 | R4 | Evidence (R4) |
|---|---:|---:|---|
| Visual polish | 75 | 77 | **Fixed since R3:** <br>• the Guidebook phone dek and stat line now wrap (`tokyo-guidebook-m`); <br>• the Gallery hero "y" descender and the pin sky sit clear of the subtitle (`tokyo-gallery-d`); <br>• the Gallery switcher uses a 2×2 grid glyph, not the heart; <br>• the Insights "Closed, kept" date breaks at a word; <br>• the phone map shows one sheet (`map-m`). <br>**New in R4:** the masthead link reads **"last checked2026-10-03"**, with no space. The source has the space, but the link is `display: inline-flex` (for the 44 px target), which drops it. The same 44 px box also opens uneven line gaps in the hero stat paragraph on phones (`cle-gallery-m`). This shows on every city page in every view. <br>**Still visible:** at DPR 1 the Bodoni macron is a hairline, so the desktop hero reads "Jonan · Josai · Johoku" and the cover reads "Kanda Myojin". The data is correct ("Jōnan", "Myōjin"; FE-A verified this), but the reader still sees the macron missing. |
| Imagery | 55 | 61 | **New:** 28 original kind motifs, plate colour by tier (with a tier bar on Must see), crop and zoom around the pin, and five compositions. No two neighbours share one (`tokyo-gallery-p2-d`). A row now reads as different pictures, which was ROUND-3 gap #3. **But:** <br>• still **0 photographs**; ROUND-1's cap of about 75–80 without photos applies; <br>• the motif keys on the card glyph, not on the kind of place. The lead card, Kanda Myōjin (a shrine), shows the "speech bubble with a star" motif, while Yasukuni gets the torii (`tokyo-gallery-d`, `tokyo-gallery-p2-d`). |
| Typography | 81 | 82 | The Guidebook phone dek now wraps. The macron hairline at DPR 1 is still there. |
| Layout | 85 | 85 | Unchanged. The one-sheet phone map is a layout fix, counted under B. |
| Motion / delight | 52 | 60 | These are judged from the code and REVIEW-W4, because the method captures with reduced motion. Each effect answers an action: <br>• the save heart pops; <br>• the "Been there" stamp animates; <br>• the rail door scales on press; <br>• the sheet rises; <br>• a view switch cross-fades through `startViewTransition`; <br>• Insights bars grow on a scroll-driven timeline. <br>None autoplays, and all of it is off under reduced motion. It is still subtle, with no signature moment. |
| Luxury + fun | 79 | 80 | Varied covers make the Gallery rows feel curated. The "What changed" page is an elegant, honest editorial page (`changes-m`). |
| Wanderlust | 70 | 71 | The Gallery is still opt-in. FE-A tried it as the default and reverted it: the pager fails G1 "scrolled", and B-01 is 2.4–2.65 screens. There are no photographs. |
| **A (mean)** | **71** | **74** | (77 + 61 + 82 + 85 + 60 + 80 + 71) / 7 = 73.7 |

How R4 compares with the leader families, described neutrally:
- **Grid-browse products.** Our covers now vary, as theirs do, but theirs are photographs.
- **Editorial publishers.** Guidebook, plus a dated, sourced changelog that none of them publishes.
- **Photo-led luxury products.** The gap is photographs, and the remaining polish.

### B. UX & ergonomics — R3 84 → R4 85

| Area | R3 | R4 | Evidence |
|---|---:|---:|---|
| First screen | 85 | 82 | B-03 regresses to 15 (budget 14) on all 5 pilots, because of the new masthead link. B-01 Tokyo is at exactly 1.0. |
| Discovery | 91 | 92 | "What changed" is reachable from every masthead and links each closure to its place. |
| Map ↔ list | 83 | 86 | The phone pin sheet replaces the tray instead of stacking on it. The tray returns on Close, Esc or Open. |
| Filters | 90 | 90 | Unchanged |
| Detail | 90 | 90 | Unchanged |
| Mobile | 79 | 82 | Guidebook targets dropped from ≈ 2,800 to 18 (QA-35 fixed; source URLs are 326 × 44 px). The text wraps. City pages still have no bottom bar, though the What-changed page has one. |
| Accessibility | 84 | 86 | Default view: AA 0/0 in light and night, and focus 30/30. Insights bars are 24 px, which meets 2.5.8, with a 44 px table fallback. `<html lang>` follows the locale. |
| Performance | 70 | 76 | Guidebook DOM on Tokyo fell from 12.4 k to 2.7 k. Landing FCP at 4× is 540 ms (budget 1.0 s). **Still over budget:** Tokyo transfer is 2.06 MB (target < 2.0), and Tokyo Insights mounts 3.8 k nodes (budget 3 k). |
| **B (mean)** | **84** | **85** | (82 + 92 + 86 + 90 + 90 + 82 + 86 + 76) / 8 = 85.5, rounded down to 85 for the B-03 gate regression |

### C. Competitor feature coverage — R3 91 → R4 96

All 35 rows were re-scored on `8aa6fdf4`. The 31 rows ✅ in R3 are unchanged; their evidence still holds (beta:metrics, G1
488/488, sheet B-17). Only these rows moved:

| # | Feature | R3 | R4 | R4 evidence / what's missing |
|---|---|---|---|---|
| 6 | Licensed landmark photos | ✕ | ✕ | 0 credits. The image hosts are blocked by the environment network policy (owner action). |
| 30 | Multilingual UI | ✕ | ◐ | A string catalogue (`en.json`) drives the shell and the What-changed pages. A pseudo-locale gate is in `npm test`, and every page has `hreflang`. **Missing:** a reviewed second locale. The landing, hubs and city content are not on the catalogue yet. |
| 34 | "What changed" feed | ◐ | ✅ | One human page per city (`changes/<page>.html`) shows dated closures with their status source, plus check and verification days. It is linked from the masthead's "last checked" and has a feed link. |
| 35 | Functional delight, reduced-motion safe | ◐ | ✅ | Six action-driven micro-interactions, all off under `prefers-reduced-motion`. |

R4 tally:
- ✅ 33;
- ◐ 1 (#30);
- ✕ 1 (#6);
- coverage: (33 + 0.5) / 35 = **95.7 % → 96**.

### D. Unique strengths — R3 88 → R4 89

| Strength | R3 | R4 | Evidence |
|---|---:|---:|---|
| Sourced picks; attribution as navigation | 94 | 94 | Unchanged |
| Verified pins | 90 | 91 | "What changed" lists the pin verifications by day ("441 addresses and map pins verified against a sourced coordinate"). |
| Closure honesty | 92 | 95 | The closure is now a dated, readable event with its source: Unicorn Gundam "has closed — it stays in the guide, flagged". No leader publishes this. |
| Interest triad | 80 | 80 | Unchanged. Insights still says "Pop culture 50" while ★ says 37, and no label explains why. |
| Anime layer | 85 | 85 | Unchanged |
| "Your guide" and day plans | 78 | 78 | Unchanged |
| Stated gaps | 87 | 88 | "Every entry is a dated check on record — nothing here is estimated." |
| **D (weighted judgement)** | **88** | **89** | The mean is 87.3, and sourcing and closure honesty weigh most. |

## Top 10 remaining gaps, ranked by expected score impact

Gain = weight × the dimension points if the change fully lands. A ≥ 80 needs **+6 on A**.

| # | Gap | Concrete change | Lane | Expected gain |
|---:|---|---|---|---|
| 1 | **0 photographs** (imagery cap) | Fetch the manifest's landmark files on an unrestricted machine and complete the `CREDITS.json` rows. The credit gate and the `.cover.photo` variant are ready. Do not fake photos meanwhile. | owner action + imagery | A +9 → **+3.6** |
| 2 | **Gallery is not the default** | Make a SPEC call on G1 "scrolled" for a paged default (deep, search and no-JS are 100 %). Give the phone Gallery a place card inside the first screen (B-01 ≤ 1.0; it is 2.4–2.65 now). Then flip `DV`. | PM + QA (SPEC) → FE-A | A +3 → **+1.2** |
| 3 | **Masthead "last checked" link** | Restore the space ("last checked 2026-10-03"). Get the 44 px target without an inline-flex box, so it no longer breaks line spacing. Move the link off the first-card path, or fold it into an existing control, so B-03 is back to ≤ 14. | platform (`build.js` injection) + designer | A +1, B +2 → **+0.9** |
| 4 | **Macrons invisible at DPR 1** | Give display names a face or weight with a visible macron at 18–24 px. One option: Bodoni at a heavier weight for those sizes. Another: set the macron vowels in a fallback face. Verify at DPR 1 on "Kanda Myōjin" and "Jōnan". | designer | A +1.5 → **+0.6** |
| 5 | **Weight still over budget** | Get Tokyo transfer under 2.0 MB (2.06 now): drop the unversioned duplicate `art/<key>/map.svg` fetch (≈ 36 KB). Mount the Insights index lazily, down to ≤ 3 k nodes (3.8 k now). | platform + designer + FE-B | B +2 → **+0.5** |
| 6 | **Cover motif keyed on the glyph, not the kind** | Map motifs from the place's kind or collection id (a shrine gets the gate), never from the generic "bubble" glyph. Audit the most common glyph-to-motif pairs per city. Key on the id, never on description keywords. | designer + imagery | A +1 → **+0.4** |
| 7 | **No reviewed second locale** (C #30) | Put the landing and hub on the catalogue. Ship one reviewed locale (owner-reviewed, no machine output presented as reviewed), and the switcher appears by rule. | platform + FE-B + owner review | C +1.4 → **+0.3** |
| 8 | **Insights targets under 44 px** (183) | Keep the 24 px bars, but add a 44 px row hit area (the whole row label plus bar), or make the table the phone default. | FE-B | B +1 → **+0.25** |
| 9 | **Harness blind spots** | Add `beta:metrics --view` for the four views (B-03, B-20, DOM per view). Motion needs a no-reduced-motion capture pass. B-12 still reads "0 of 0 closed". QA's W4 sign-off is still owed. | QA | B +1 → **+0.25** |
| 10 | **Pop-culture count mismatch** | Label Insights "Pop culture 50 (trail)" and ★ "37 (collection)", or reconcile the two sets. | FE-B | D +1 → **+0.15** |

**Projection.**
- Gaps 2–6 without photographs: A ≈ 78, overall ≈ 85. **A stays below 80.**
- Adding photographs (gap 1): A ≈ 85+, overall ≈ 88.
- Stretch 90 needs photographs, Gallery as the default, zero polish defects, and B at about 88.

## Verdict against the goal

| Gate | Target | R4 | Met? |
|---|---|---:|---|
| Overall | ≥ 80 | 83.4 | ✅ (+3.4) |
| A. Look & feel | ≥ 80 | 74 | ✕ (−6) |
| C. Feature coverage | ≥ 80 | 96 | ✅ |
| Stretch | 90 | 83.4 | ✕ |

**Not met.** W4 closed most of what ROUND-3 asked of it:
- cover variety;
- motion;
- Guidebook weight and targets;
- the one-sheet phone map;
- "What changed";
- i18n scaffolding.

That bought A +3, B +1, C +5 and D +1. But A is capped by the absence of photographs and by a Gallery that is still not
the default. The new masthead link also introduced a polish defect and a B-03 gate regression on every pilot.

**Without photographs, the honest ceiling for A is about 78. The A ≥ 80 goal now depends on the owner.**

## What R4 got right (keep)

- The Guidebook lazy mount keeps every place reachable: P-04 is green, and G1 is 488/488 on deep links and search.
- Covers vary without inventing anything. Each is built from the place's own pins, tier and kind.
- Motion is action-driven only and off under reduced motion.
- "What changed" is generated from the same dated provenance as the feeds and shows its sources.
- The i18n switcher stays hidden until a reviewed locale exists, which is the right restraint.
- FE-A reverted the Gallery default on measured failures and logged why, rather than shipping it.
- 0 JS errors across 61 flows; AA in both themes; validate, test and beta:check all green.

## Reproduce

```bash
git worktree add ../ev 8aa6fdf4 && cd ../ev/tools && npm install && npm run validate && npm test && npm run beta:check && npm run beta:metrics
python3 -m http.server 8791                     # from ../ev (R4)
# R3: a mirror with beta/ from `git archive 83aa1a28 beta`, served on 8792
node design/beta/eval/r4/tools/shots-r4.js r4 8791 <out>/r4
node design/beta/eval/r4/tools/shots-r4.js r3 8792 <out>/r3
python3 design/beta/eval/r4/tools/pair.py <out>/r3 <out>/r4 design/beta/eval/r4 landing,japan,tokyo,tokyo-gallery,...
```
