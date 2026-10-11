# Rounds 6–9 — build what was designed (owner request, 2026-10-11)

The owner asked for **4 more rounds** and wants to be sure the beta ends up with what was designed. This file is the **design-conformance checklist**. In every round, from Round 6 to Round 9:

- the **evaluator** scores every row (✅ met / ◐ partial / ✕ missing, with evidence);
- the **PM/orchestrator** turns every row that is not ✅ into the next wave's work;
- **QA** must not sign a deploy that regresses a row that was ✅.

Each round runs the same loop as before: **build wave → QA pass on a pinned SHA → independent evaluator (ROUND-N.md with the rubric + Typography & style sub-scorecard + this checklist) → fix wave on gaps → QA YES → deploy (beta-only PR into the Pages branch) → BETA-CHANGELOG entry**.

**Goals:**
- Overall ≥ 80, A (look & feel) ≥ 80 and C ≥ 80.
- Stretch: 90.
- Every conformance row ✅, except rows blocked on the owner, which are marked as such.

## Design-conformance checklist

| # | Designed item | Source of the design | Acceptance |
|---|---|---|---|
| D1 | **Four switchable view styles**: Gallery (default), Atlas, Guidebook and Insights, with the view in the URL hash and the preference remembered | `design/beta/views/SPEC.md`, the owner's request of 2026-10-10 | Every city page has all four. A shared `#view=` link reproduces the view. Every place is reachable in every view (P-04, G1, w5.js). |
| D2 | **Atlas is map-first**, like the live guide and the early map-centred beta | Owner request of 2026-10-11; `W6-BRIEFS.md` (atlas-map-first) | On phones the map fills the viewport, with a tray at peek, half and full. On desktop the map takes ≥ 60 % of the width, with a slim list. Numbered pins match the ranks, with two-way sync. Area pins and a legend, a base switch (OSM/Esri), opt-in locate-me and a tier filter on the map. |
| D3 | **Gallery**: covers, category rows, a paged grid with show-all, and an experience-style place page | `views/SPEC.md` §3.1 | Rows plus an "All N" grid. A lead card sits in the first phone screen. Covers vary by kind. Deep links jump to the right page. |
| D4 | **Guidebook**: area chapters, print, sources appendix | `views/SPEC.md` §3.3 | Contents first, then lazy chapters. Prints cleanly. Every source is listed. |
| D5 | **Insights**: melon-seek-style chart and insight view adapted to our data | `views/SPEC.md` §3.4, `design/reference/melon-seek/` | Inline-SVG charts with a table fallback. Every bar links to its lens. Tabular numerals. 44 px rows. |
| D6 | **Fonts and styles are rated, and the best direction is built** | `W6-BRIEFS.md` (type & style) | `design/beta/style/AUDIT.md` and `DECISION.md` exist. The winning direction ships across the whole beta. Every Typography & style sub-score is ≥ 8/10, or the evaluator gives an explicit reason. Fonts are self-hosted under OFL/Apache. Diacritics, Vietnamese and CJK render correctly. |
| D7 | **melon-seek ideas, where they help**: one disciplined token set, a 3-step elevation scale, consistent radius, a crisp UI face, hash-state views, chart and insight patterns | `design/reference/melon-seek/`, `views/STUDY.md` | Tokens are documented in `design/beta/DESIGN-SYSTEM.md`, and the CSS uses them with no stray one-off values. |
| D8 | **Luxury yet fun, wanderlust**: hubs and landing with signature lines, editorial rails, original art, motion that respects reduced-motion | The owner's brief; ROUND-1…5 | The evaluator's A sub-criteria for "luxury + fun" and "wanderlust" are each ≥ 8/10. |
| D9 | **Real photographs**: Unsplash and/or Wikimedia, credited, only where the photo truly shows the place | Owner request of 2026-10-11; IMAGERY.md | **Blocked on the owner** until `api.unsplash.com` and `images.unsplash.com` (and/or the Wikimedia hosts) are allowed and `UNSPLASH_ACCESS_KEY` is set. Until then, the candidate manifest and the fetch script are ready. When unblocked: hub heroes plus top landmarks get photos, each with a credit. |
| D10 | **Honesty rules**: every place kept, attribution, closures flagged, no fabrication, no brand names in our copy, no CDN for content, OSM/Esri tiles only | CLAUDE.md, BETA-PROGRAM.md | All gates green. The no-brand scan is clean. |
| D11 | **Performance and accessibility** | BETA-BENCHMARK.md | Tokyo default ≤ 2.0 MB, FCP 4× ≤ 1.0 s. Axe reports 0 serious or critical issues. AA in light and night. 44 px targets. |

## Round plan

- **Round 6:** Wave 6 runs the type & style lane, Atlas map-first and the Unsplash candidate manifest. Then QA, then the R6 evaluation, then a fix wave if needed, then deploy.
- **Rounds 7–9:** each wave targets the evaluator's top gaps and every non-✅ checklist row. Expected order:
  - R7: style polish across views and Atlas refinements;
  - R8: photos, if the owner has allowed the hosts, otherwise more art and motion;
  - R9: a final consistency pass.

  At most 4–5 sessions run at once.
- **Close-out after Round 9:** `FINAL-SUMMARY.md` is updated with R6–R9 and the final checklist state.
