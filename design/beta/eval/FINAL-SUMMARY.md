# Beta program — final summary (Rounds 0–5)

> 2026-10-10 · independent evaluator, Round 5 · scored on `f2bf7610`, the W5 build-complete head.
> Detail for this round: [ROUND-5](ROUND-5.md). Earlier rounds: [ROUND-1](ROUND-1.md) · [ROUND-2](ROUND-2.md) ·
> [ROUND-3](ROUND-3.md) · [ROUND-4](ROUND-4.md). The rubric, weights, 35-row feature table and D strengths did not change
> between rounds.

## Bottom line

The beta went from **31.1 to 84.5** in five build waves. It passes the overall gate (≥ 80) and the feature gate (C ≥ 80).
It does **not** meet the full goal, because **look & feel is 76 and the goal needs 80**. The stretch target of 90 is not met.

The one thing most likely to close that gap is photographs. The photo pipeline is already built and gated, but the image hosts
are blocked by this environment's network policy. **Fetching them is an owner action.** Without photographs, A has stayed
under the cap that ROUND-1 set, and five rounds of polish moved it only from 60 to 76.

## Scores by round

| Round | SHA scored | A. Look & feel (40 %) | B. UX (25 %) | C. Features (20 %) | D. Unique (15 %) | **Overall** | Gate |
|---|---|---:|---:|---:|---:|---:|---|
| R0 | baseline beta | 32 | 25 | 30 | 40 | **31.1** | ✕ |
| R1 | W1 | 60 | 74 | 66 | 72 | **66.5** | ✕ |
| R2 | `764dc97b` | 67 | 84 | 89 | 86 | **78.5** | ✕ (−1.5) |
| R3 | `83aa1a28` | 71 | 84 | 91 | 88 | **80.8** | overall ✅ · A ✕ |
| R4 | `8aa6fdf4` | 74 | 85 | 96 | 89 | **83.4** | overall ✅ · A ✕ |
| **R5** | **`f2bf7610`** | **76** | **86** | **96** | **89** | **84.5** | overall ✅ · C ✅ · **A ✕ (−4)** |

Goal: overall ≥ 80 with A ≥ 80 and C ≥ 80. Stretch: 90.

## What shipped each round

- **Wave 1 → R1 (+35.4).**
  - A new generator builds every beta page from the live data, with count asserts.
  - City pages got collection rails, a tray, a place panel and a split or phone map.
  - Hubs, navigation, the method page, the design system and the QA harness.
- **Wave 2 → R2 (+12.0).**
  - "For you" (it reorders and never hides), day routes, opt-in "Near me", and saved lists with a shared view.
  - A signature ★ for each city's food canon; progressive rendering; social cards; offline reload.
  - Hub rails and search; original line-art motifs; a credit-gated photo path; brand names removed from copy.
  - Deployed (PR #4).
- **Wave 3 → R3 (+2.3).**
  - Four switchable views over the same full record set: **Gallery**, **Atlas**, **Guidebook** and **Insights**. Each is shared
    through the URL hash.
  - A reachability gate for every view, and an honesty test (no prices, ratings or booking copy). Accessibility fixes QA-22 to
    QA-34. Deployed (PR #5).
- **Wave 4 → R4 (+2.6).**
  - Covers vary (kind motifs, tier plates, no two neighbours alike) and a motion layer that respects reduced motion.
  - A lighter Tokyo page and a lazy Guidebook (DOM 12.4 k → 2.7 k).
  - 84 "What changed" pages and i18n scaffolding. The Gallery default was tried and reverted on measured failures.
  - Deployed (PR #6).
- **Wave 5 → R5 (+1.1).**
  - **Gallery is the default view**, with a real place card in the phone's first screen. B-01 went from 2.4–2.7 screens to
    about 0.5.
  - Macrons are visible at DPR 1, and checked by a pixel test.
  - Cover art keys on what a place is (a shrine gets the gate), never on the glyph or on description words.
  - The masthead link reads "last checked 2026-10-03" again, with even line gaps.
  - Insights rows have 44 px targets and a smaller DOM. The city map art is fetched once.
  - The landing and hub strings are on the catalogue.
  - **Cost:** the default view got heavier (Tokyo 2.06 → 3.03 MB; FCP at 4× 396 → 1,124 ms). On phones, the map is now one
    tap further away.
  - QA signed W5 off YES on `f2bf7610` and ratified the Gallery reachability criteria. Deployed via PR #7 (merge `5509b8cc`).

## Competitor feature rows (C)

The table has 35 rows that apply to a static, honest guide. **33 are shipped, 1 is partial and 1 is missing**, the same as R4.

| Status | Rows | Why |
|---|---|---|
| ✅ Shipped (33) | 1–5, 7–29, 31–35 | Each has evidence in ROUND-1 to ROUND-5: inventory on the first screen, collection rails, a split map with numbered pins, filters, situational picks, grounded personalisation, tiers, a published method, attribution as navigation, saved lists, sharing, a "Been there" log, day plans, AA accessibility, search, permalinks, JSON-LD, social cards, offline use, "Near me", freshness and closures, directions, a night edition, "What changed", and reduced-motion delight. |
| ◐ Partial (1) | #30 Multilingual UI | The catalogue, a pseudo-locale gate and `hreflang` have shipped, and the landing and hubs are on the catalogue. **Missing:** a reviewed second locale. Machine output must not be presented as reviewed, so this waits on an owner review. |
| ✕ Missing (1) | #6 Licensed landmark photos | 0 credits. The image hosts are blocked by the environment's network policy. The manifest, the credit gate and the photo cover variant are ready. **Owner action.** |
| Out of scope (not counted) | Booking and checkout; user reviews and ratings; accounts and sync; a conversational concierge; collaborative votes; opening hours, prices and "open now"; push, newsletter, analytics and affiliate links | Each needs a server or shared state, contradicts the sourced-trust model, or would mean inventing data. See ROUND-1 (X-01 to X-09) and BETA-PROGRAM rule 8. Honest stubs exist where they help: links to the venue's own site, share links and export. |

## Our unique strengths (D, 89)

These are things no leader product in the teardown does:

- **Sourced picks, with attribution as navigation.** Every card names who recommended it, and every source is a lens.
- **Verified pins.** Every coordinate has a source and a date; "What changed" lists the verification days.
- **Closure honesty.** Closed places stay in the guide, flagged, with a dated source. "What changed" turns each closure into a
  readable event.
- **The interest triad.** Landmarks, a signature food canon (★) and pop culture, with an anime layer on the Japan pages.
- **"Your guide" and day plans.** These work on the device, with no account.
- **Stated gaps.** Where nothing meets the bar, the guide says so and does not fill the slot.

## What still stands between the beta and the goal

1. **Photographs, an owner action.** This is worth about +9 on A by itself (A +3.6 overall). It is the only change on the
   board that crosses A ≥ 80 alone. The tooling is done: the manifest, `CREDITS.json`, the credit gate and the `.cover.photo`
   variant. Someone needs to fetch the listed files on an unrestricted machine and fill in the credit rows. The environment's
   policy blocks this here, and it must not be routed around.
2. **The rest of A without photographs.** Motion is still subtle, with no signature moment (60). The desktop Gallery hero is
   mostly empty navy. Cleveland's 148 sights carry no collection ids, so every one keeps the compass motif. That is a
   live-data task outside beta scope. Together these are worth A +2 to +3, which is not enough on its own.
3. **Default-view weight and the map (B).** Gallery fetches the full places JSON at load. Tokyo is 3.03 MB, and FCP at 4× is
   1.1 s. On a phone, "Show the map" from the Gallery lands on the Atlas list, and a second tap opens the map. See ROUND-5
   gaps #2 and #3.
4. **A reviewed second locale (C #30).** This needs an owner review.

**Honest ceiling.** Without photographs, A tops out at about 78–79 and the overall score at about 85–86. With photographs and
the two smaller fixes above, A reaches about 85+ and the overall score about 88. Reaching the stretch target of 90 also needs a
signature motion moment and B at 88 or more.

## Recommended next step

**W5 is shipped. Next, have the owner fetch the landmark photographs. Apart from the one small fix in step 1, no further polish wave until then.**

1. W5 is deployed (PR #7). Next, make one small fix head that defers the places JSON and opens the map in one tap from the Gallery (ROUND-5 gaps #2 and #3).
2. The owner runs the photo manifest on an unrestricted machine, commits the files and `CREDITS.json` rows, and re-runs
   `npm run beta` and `beta:check`. The credit gate refuses any photo without a licence row.
3. Re-score once (a Round 6) on that head with this same rubric. Expected: A ≈ 85, overall ≈ 88. Only then decide whether a
   stretch wave (signature motion, a reviewed locale, Cleveland collection ids through the live pipeline) is worth it.
