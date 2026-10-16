# Beta changelog — evaluation rounds

One entry per round: score before → after (A look & feel · B UX · C feature coverage · D unique · overall), shipped (IDs, commits, PR), deferred.

## Round 0 — baseline
- Pending: Round 1 evaluation scores the beta once build wave 1 (M1) lands.

## Round 1 (evaluated 2026-10-10) — 31.1 → 66.5

| Dimension | R0 | R1 |
|---|---|---|
| A. Look & feel (40 %) | 32 | 60 |
| B. UX & ergonomics (25 %) | 25 | 74 |
| C. Feature coverage (20 %) | 30 | 66 |
| D. Unique strengths (15 %) | 40 | 72 |
| **Overall** | **31.1** | **66.5** |

**Shipped (Wave 1):**
- the new generator for all beta pages;
- a city page with collection rails, a tray, a place panel and a split or mobile map;
- hubs, navigation and the method page;
- the "Constellation" design system;
- the QA harness.

Evidence: `design/beta/eval/ROUND-1.md`.

**Not deployed:** QA W1 signed off NO (B-06, B-07, B-16).

## Round 2 (evaluated 2026-10-10) — 66.5 → 78.5

| Dimension | R1 | R2 | Goal |
|---|---|---|---|
| A. Look & feel (40 %) | 60 | 67 | ≥ 80 ✕ |
| B. UX & ergonomics (25 %) | 74 | 84 | — |
| C. Feature coverage (20 %) | 66 | 89 | ≥ 80 ✅ |
| D. Unique strengths (15 %) | 72 | 86 | — |
| **Overall** | **66.5** | **78.5** | ≥ 80 ✕ (−1.5) |

**Shipped (Wave 2, briefs in `design/beta/eval/W2-BRIEFS.md`):**
- **City page:** For you (reorders, never hides), Your day routes, opt-in Near me, the map as a guide (B-06/07/16 fixes) and saved lists with a shared view.
- **Data and performance:** a signature ★ for each city's food canon, progressive rendering, OG images and offline reload.
- **Hubs:** signature tile lines, editorial rails, country heroes, an accessibility page and search.
- **Imagery and design:** original SVG motifs and a credit-gated photo path, plus a polish pass and a motion layer.
- **Owner naming rule:** brand names were removed from new copy.

Evidence: `design/beta/eval/ROUND-2.md`.

**Deferred:** real photographs. The environment's network policy blocks the image hosts and needs the owner's action. Without them the evaluator caps A at about 75.

**Deployed 2026-10-10 14:03Z:** PR alvations/cleo-guide#4 merged the QA-signed SHA `c2a221bd` (QA W2 re-test sign-off: YES) into the Pages branch `claude/cleveland-page-creation-pant4l` (merge `a1a8f327`). The live site is untouched. Live at https://alvations.github.io/cleo-guide/beta/.

## Round 3 (evaluated 2026-10-10) — 78.5 → 80.8

| Dimension | R2 | R3 | Goal |
|---|---|---|---|
| A. Look & feel (40 %) | 67 | 71 | ≥ 80 ✕ |
| B. UX & ergonomics (25 %) | 84 | 84 | — |
| C. Feature coverage (20 %) | 89 | 91 | ≥ 80 ✅ |
| D. Unique strengths (15 %) | 86 | 88 | — |
| **Overall** | **78.5** | **80.8** | ≥ 80 ✅ |

**Shipped:** Wave 3, briefs in `design/beta/eval/W3-BRIEFS.md`, specs in `design/beta/views/`.
- **Owner-requested view styles.** Every city page now switches between four views. The view is shared through the URL hash, and every view keeps every place reachable:
  - **Atlas** (the default): a map with a ranked tray;
  - **Gallery**: covers, rows and a paged grid with show-all;
  - **Guidebook**: area chapters, print and a sources appendix;
  - **Insights**: charts of each city's data, built as inline SVG with lens links.
- **View-agnostic model:** a per-view reachability gate and an honesty test (no prices, ratings or booking strings in UI copy).
- **Accessibility fixes:** QA-22 through QA-34.

Evidence: `design/beta/eval/ROUND-3.md`.

**Deployed 2026-10-10 16:06Z:** PR alvations/cleo-guide#5 merged the QA-signed SHA `83c51890` into the Pages branch (merge `b0ad208c`). The live site is untouched.

**Next, Wave 4:** look & feel only (A 71 → ≥ 80): Gallery cover variety, motion, polish, Gallery as default view, Guidebook weight, i18n scaffolding and a "What changed" page. Photos remain an owner action.

## Round 4 (evaluated 2026-10-10) — 80.8 → 83.4

| Dimension | R3 | R4 | Goal |
|---|---|---|---|
| A. Look & feel (40 %) | 71 | 74 | ≥ 80 ✕ |
| B. UX & ergonomics (25 %) | 84 | 85 | — |
| C. Feature coverage (20 %) | 91 | 96 | ≥ 80 ✅ |
| D. Unique strengths (15 %) | 88 | 89 | — |
| **Overall** | **80.8** | **83.4** | ≥ 80 ✅ |

**Shipped:** Wave 4, briefs in `design/beta/eval/W4-BRIEFS.md`.
- **Gallery covers:** covers now vary (category motifs, tier plates, no two neighbours alike).
- **Motion:** a motion layer that is safe under reduced-motion.
- **Text and navigation:** diacritic names and a new switcher glyph.
- **Performance:** a lighter Tokyo page and a lazy Guidebook.
- **New pages:** 84 "What changed" pages and i18n scaffolding.
- **Gallery-as-default reverted:** it failed the reachability and first-screen gates.

Evidence: `design/beta/eval/ROUND-4.md`.

**Deployed 2026-10-10 17:38Z:** PR alvations/cleo-guide#6 merged the QA-signed `8aa6fdf4` into the Pages branch (merge `5a323aec`). The live site is untouched.

## Round 5, the final build round (evaluated 2026-10-10): 83.4 → 84.5

| Dimension | R0 | R1 | R2 | R3 | R4 | **R5** | Goal |
|---|---|---|---|---|---|---|---|
| A. Look & feel (40 %) | 32 | 60 | 67 | 71 | 74 | **76** | ≥ 80 ✕ |
| B. UX & ergonomics (25 %) | 25 | 74 | 84 | 84 | 85 | **86** | — |
| C. Feature coverage (20 %) | 30 | 66 | 89 | 91 | 96 | **96** | ≥ 80 ✅ |
| D. Unique strengths (15 %) | 40 | 72 | 86 | 88 | 89 | **89** | — |
| **Overall** | **31.1** | **66.5** | **78.5** | **80.8** | **83.4** | **84.5** | ≥ 80 ✅ |

**Shipped (Wave 5, briefs in `design/beta/eval/W5-BRIEFS.md`):**
- Gallery is the default view. QA ratified it with an independent reachability probe: 1,241/1,241 deep links, 100 % search, show-all, no-JS, and a lead card in the first phone screen.
- Macrons are visible at DPR 1.
- Each cover motif is keyed on the place's kind id.
- The masthead link is fixed.
- The Insights index is lazy and has 44 px rows.
- The i18n catalogue now covers the landing page and hubs.

Evidence: `design/beta/eval/ROUND-5.md`. Whole-program summary: `design/beta/eval/FINAL-SUMMARY.md`.

**Deployed 2026-10-10 19:42Z:** PR alvations/cleo-guide#7 merged the QA-signed `f2bf7610` into the Pages branch (merge `5509b8cc`). The live site is untouched.

**Verdict after 5 rounds:** the overall goal (≥ 80) and the feature goal (C ≥ 80) are met. The look-and-feel goal (A ≥ 80) is **not** met: A is 76.
- The evaluator caps A for a guide with no photographs, and the environment's network policy blocks the licensed image hosts. Fetching the photo manifest (`beta/assets/img/manifest.json`) needs the owner, and the evaluator projects A ≈ 85 and overall ≈ 88 once photos land.
- Feature coverage: 33 of 35 rows are shipped. #30 (multilingual) is partial while it waits for an owner-reviewed locale.

**Follow-up in progress:** one fix lane for ROUND-5 gaps #2 and #3. Making Gallery the default raised Tokyo's initial transfer to 3.03 MB and its FCP to 1.1 s, and it put the map two taps away on phones. The fix targets ≤ 2.0 MB, FCP ≤ 1.0 s, and a one-tap map. It needs a QA re-sign before deploy.

## R5 follow-up (deployed 2026-10-10 21:10Z)

PR alvations/cleo-guide#8 merged the QA-signed `63932912` (merge `9f54587d`). It fixes the two regressions that came with the Gallery default:

| Page | Before | After |
|---|---|---|
| Tokyo (default view) | 3,012 KB | 1,932 KB |
| New York | 5.8 MB | 1.7 MB |

- First contentful paint at 4× CPU is now at most 1 s on every pilot.
- On phones, the map opens in one tap from Gallery.

**Program closed.** Every agent session is archived, and the check-ins have stopped. Open owner actions:
- photographs (blocked by the network policy);
- the price and rating record prose;
- a reviewed second locale.

## R7 fix round (deployed 2026-10-16 21:33Z)

PR alvations/cleo-guide#9 merged the QA-signed `b54b3745` into the Pages branch (merge `4382a187`). QA signed YES at 943d1ce8, with QA-79 waived under D-45. QC passed it at 7c5ea616. The release branch `beta-deploy-r7` is the R7 build (`4aba38b3`) plus ported fixes only.

**Speed.** The first map pin on the Tokyo phone page appears in 701 ms, down from 2,261 ms on the R7 baseline `be74c82f`. New York's takes 1,054 ms, down from 2,438. PERF-08 selective stamping is off; it re-lands next, behind its regression tests.

**Accessibility.**
- Recognition badges are 44 px tap targets that still paint a 32 px pill (QA-77).
- Each card has one focus ring.
- A view switch moves focus to that view's heading.

**Honesty.**
- Closed cards read "Closed — kept for the record", and the detail links the closure source (QC-25).
- What changed pages, feeds and place data carry only the source URL (FE-B).
- The method line and the footer follow D-42.
- Five Erie, Orlando and DC write-ups no longer read like internal notes (QC-28, QC-29).

**Data.**
- Closure-source URLs for 55 of 60 closed places.
- Sokolowski's closed in 2020.
- Verified coordinates from today's location-verify accepts, in 8 cities.

**Photos and motion.**
- The Duquesne Incline credit names its Flickr account, and the fetcher refuses a URL or HTML author (QA-78).
- The motion tokens are within the 300 ms cap and match the design tokens; a test fails on drift (QA-74).

**Waived (D-45).** QA-79: Tokyo desktop's initial DOM is 3,074 nodes against a 3,000 budget. The fix, 87f814ad (2,821 nodes, with w2 dom in npm test), ships next.

**Next release, from the dev branch:**
- Atlas SPEC-v3 rev 5 (panel R4);
- the D-43 "Approximate pin" copy;
- the Japanese search panel (W8-I18N-SEARCH);
- the W9-2 "Status checked" lines;
- QC-30, QC-32 and QC-33;
- the M3-06 DOM fix;
- the lazy offline pack;
- PERF-08.

The R8 independent evaluation scores this deploy.
