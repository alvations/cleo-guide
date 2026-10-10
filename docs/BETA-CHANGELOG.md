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
