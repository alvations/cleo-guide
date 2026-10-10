# Evaluation round 3 — independent evaluator

> 2026-10-10 · evaluator lane (no build lane) · session_01VDFVuQ72NNS18uAcxwDEou
> **Measured:** R3 is the beta at `83aa1a28`, the W3 build-complete head: the Gallery, Atlas, Guidebook and Insights views,
> with Atlas as the default. `npm run beta:check` passes: 95 pages, 84 place pages, 8,458 places, beta == live.
> `npm run validate` and `npm test` (all suites) are green on that SHA.
> **Baseline:** R2 is the beta at `764dc97b`, the head [ROUND-2](ROUND-2.md) scored. It was read with `git archive 764dc97b beta`.
> **Rubric:** unchanged from ROUND-1 and ROUND-2 so the rounds stay comparable: the same four dimensions and weights, the same
> A/B sub-criteria, the same 35-row feature table for C, and the same D strengths.

## Verdict

**The overall gate is met by a hair; the goal is not met.** R3 scores **80.8 / 100** (R2 78.5), with **A = 71** and
**C = 91**. The goal is ≥ 80 overall with A ≥ 80 and C ≥ 80.

- **Overall clears 80** (+2.3), mostly on C and D. Insights is a strength no leader has. The Atom feeds and QA's offline
  sign-off close two more feature rows.
- **C holds and grows** (91).
- **A is still the blocker** (71, needs 80).
  - The views add real layout range: a covered grid, a chaptered field guide with contents and a drop cap, and a numbers page.
  - The landing finally has hero art and a cross-guide "Signatures" rail.
  - But there are still **0 photographs**.
  - Every Gallery cover in an area repeats the same drawn polygon.
  - The default is still Atlas, so a first visit never sees the Gallery.
  - A new layer of polish defects arrived with the new views, listed under A below.
- **Stretch 90 is not in reach** without photographs.

## Scorecard

| Dimension (weight) | R1 `65e93e9` | R2 `764dc97b` | **R3 `83aa1a28`** | Δ R2→R3 | Goal |
|---|---:|---:|---:|---:|---:|
| A. Look & feel (40 %) | 60 | 67 | **71** | +4 | ≥ 80 ✕ |
| B. UX & ergonomics (25 %) | 74 | 84 | **84** | 0 | — |
| C. Competitor feature coverage (20 %) | 66 | 89 | **91** | +2 | ≥ 80 ✅ |
| D. Unique strengths (15 %) | 72 | 86 | **88** | +2 | — |
| **Overall (weighted)** | **66.5** | **78.5** | **80.8** | **+2.3** | ≥ 80 ✅ |

R3 = 0.4×71 + 0.25×84 + 0.2×91 + 0.15×88 = 28.4 + 21.0 + 18.2 + 13.2 = **80.8**.

## Method

Identical to ROUND-2, plus the four views and the switcher.

1. In a detached worktree at `83aa1a28`, ran `cd tools && npm install`, then `npm run beta:check`, `npm run validate` and
   `npm test`. All PASS.
2. Served that tree on port 8781 (R3). Served a mirror with `beta/` replaced by `764dc97b:beta` on port 8782 (R2). Both
   with `python3 -m http.server`.
3. Took screenshots with [`r3/tools/shots-r3.js`](r3/tools/shots-r3.js), which is ROUND-2's `shots-r2.js` plus the new pages.
   - **Same capture settings as ROUND-2:**
     - 390×844 @2× touch, and 1440×900;
     - light theme, reduced motion, the pre-installed Chromium;
     - every off-origin request aborted;
     - tile requests get a flat 1 px stub, so **the blank or seamed map ground is a sandbox artefact**;
     - the same 4 saved refs seeded.
   - **New pages:**
     - Tokyo and Cleveland in each view (`#view=gallery|atlas|guidebook|insights`);
     - a real **switcher tap** (on phones, through the collapsed "View: Atlas ▾" button);
     - a Gallery deep link to a sheet (`#view=gallery&p=kanda-myojin`).
   - Per-page metrics are in [`r3/shots-r3-log.json`](r3/shots-r3-log.json) and [`r3/shots-r2-log.json`](r3/shots-r2-log.json).
     They cover DOM size, overflow, map share, peek height, targets < 44 px, JS errors, the pressed view and the hash.
   - Composites were built with [`r3/tools/pair.py`](r3/tools/pair.py).
4. Ran `npm run beta:metrics` on the pilot set in the throwaway worktree, so no QA file in the branch was touched. Output:
   [`r3/beta-metrics-r3.md`](r3/beta-metrics-r3.md). It measures the **default view (Atlas)** only.
5. Ran one targeted probe: a census of the targets under 44 px in Guidebook and Insights. No web research and no WebFetch.

**Process note.** QA's W3 views pass (`npm run beta:qa:views`) is running in parallel on the same SHA and is not in yet, so
there is no QA sign-off for the non-default views. The default view is the W2 Atlas, and it scores 24/24 on every pilot.

## Side-by-side (R2 → R3)

Composites are labelled R2 `764dc97b` | R3 `83aa1a28`. R2 had no views, so its "view" pages show the one R2 layout with
the hash ignored.

| Page | Mobile 390×844 | Desktop 1440×900 |
|---|---|---|
| Landing | ![](r3/landing-m-r2-r3.jpg) | ![](r3/landing-d-r2-r3.jpg) |
| Country hub (Japan) | ![](r3/japan-m-r2-r3.jpg) | ![](r3/japan-d-r2-r3.jpg) |
| Tokyo (default = Atlas) | ![](r3/tokyo-m-r2-r3.jpg) | ![](r3/tokyo-d-r2-r3.jpg) |
| Tokyo · Gallery | ![](r3/tokyo-gallery-m-r2-r3.jpg) | ![](r3/tokyo-gallery-d-r2-r3.jpg) |
| Tokyo · Guidebook | ![](r3/tokyo-guidebook-m-r2-r3.jpg) | ![](r3/tokyo-guidebook-d-r2-r3.jpg) |
| Tokyo · Insights | ![](r3/tokyo-insights-m-r2-r3.jpg) | ![](r3/tokyo-insights-d-r2-r3.jpg) |
| Cleveland (default = Atlas) | ![](r3/cleveland-m-r2-r3.jpg) | ![](r3/cleveland-d-r2-r3.jpg) |
| Cleveland · Gallery | ![](r3/cle-gallery-m-r2-r3.jpg) | ![](r3/cle-gallery-d-r2-r3.jpg) |
| Cleveland · Guidebook | ![](r3/cle-guidebook-m-r2-r3.jpg) | ![](r3/cle-guidebook-d-r2-r3.jpg) |
| Cleveland · Insights | ![](r3/cle-insights-m-r2-r3.jpg) | ![](r3/cle-insights-d-r2-r3.jpg) |
| Singapore town (Chinatown & CBD) | ![](r3/chinatown-m-r2-r3.jpg) | ![](r3/chinatown-d-r2-r3.jpg) |
| Place detail (Kanda Myōjin sheet) | ![](r3/sheet-m-r2-r3.jpg) | ![](r3/sheet-d-r2-r3.jpg) |
| Sheet from a Gallery link | ![](r3/galsheet-m-r2-r3.jpg) | ![](r3/galsheet-d-r2-r3.jpg) |
| Switcher tap Atlas → Gallery | ![](r3/switch-m-r2-r3.jpg) | ![](r3/switch-d-r2-r3.jpg) |
| Mobile map (toggle + pin peek) | ![](r3/map-m-r2-r3.jpg) | ![](r3/map-d-r2-r3.jpg) |
| Saved lists | ![](r3/saved-m-r2-r3.jpg) | ![](r3/saved-d-r2-r3.jpg) |
| Day plan (Tokyo `#day=TAITO` · Cleveland rail tile) | ![](r3/day-m-r2-r3.jpg) · ![](r3/daycle-m-r2-r3.jpg) | ![](r3/day-d-r2-r3.jpg) · ![](r3/daycle-d-r2-r3.jpg) |

## Key measurements (R2 → R3)

| Measure | R2 | R3 | Source |
|---|---|---|---|
| `beta:metrics` pilot score (default view) | 24/24 ×5, landing 10/10 | **24/24 ×5, landing 10/10** | `r3/beta-metrics-r3.md` |
| Initial DOM, Tokyo: default · Gallery · Guidebook · Insights | 1,739 | **1,805 · 2,497 · 12,431 · 4,829** (mobile) | shots log |
| Initial DOM, Cleveland: default · Gallery · Guidebook · Insights | 1,294 | 1,333 · 1,990 · 4,322 · 2,616 | shots log |
| Transfer, Tokyo | 1.97 MB | **2.16 MB** (+10 %) | metrics |
| FCP at 4× CPU: Tokyo · landing | 1,012 · 1,516 ms | **376 · 1,344 ms** | metrics |
| Desktop map share (Atlas) | 44 % | **48 %** | B-06 |
| Mobile pin peek height | 39 % | 36 % | shots log `map-m` |
| Screens to first card (pilots) | 0.75–0.85 | 0.87–0.97 (switcher row added) | B-01 |
| Controls above first card | 13 | **14** (at budget) | B-03 |
| Targets < 44 px, default view (pilots) | 0 | 0 | B-20 |
| Targets < 44 px, Tokyo Guidebook | — | **≈ 2,800**, of which 488 save hearts at 30 px and 983 "Recommended by" source buttons at 26 px; the rest are inline links | probe |
| Targets < 44 px, Tokyo Insights | — | **183 chart-bar links 18 px tall**, below even the 24 px AA minimum | probe |
| Switcher tap → hash | — | `#view=gallery`, pressed state moves, Gallery mounts; 0 JS errors | shots log `switch-*` |
| Sheet "n of N in this view" | — | "3 of 32 in this Gallery view" / "…Atlas view", with prev/next | `galsheet-m`, `sheet-m` |
| Photographs | 0 | **0** (`CREDITS.json`: no rows) | `beta/assets/img/CREDITS.json` |
| JS errors on 60 captured flows | 0 | **0** | shots log |

## Evidence per dimension

### A. Look & feel — R2 67 → R3 71

| Sub-criterion | R2 | R3 | Evidence (R3) |
|---|---:|---:|---|
| Visual polish | 74 | 75 | **Fixed since R2:** <br>• the mobile peek title drops "(native)" (`map-m`); <br>• "More days" links are 44 px; <br>• desktop pin labels are area-coloured (`tokyo-d`); <br>• Atlas map share is up to 48 %. <br>**New or still visible:** <br>• the English name loses its macron on Gallery covers, the lead card and the sheet title ("Kanda Myojin", while the CTA says "Myōjin"; `galsheet-m`, `tokyo-gallery-d`); <br>• the Tokyo hero italic still reads "Jonan · Josai · Johoku" next to "Kantō", so this is a data string, not the font; <br>• Guidebook on phones clips its italic dek and stat line at the right edge ("Edo-Tokyo Muse…", "33 named source…"; `tokyo-guidebook-m`); <br>• on the desktop Gallery hero, the "y" descender and a pin dot sit on the subtitle (`tokyo-gallery-d`); <br>• the Gallery switcher button uses the **heart** glyph, which is also Saved; <br>• the Insights "Closed, kept" tile wraps its date mid-token ("2026-10-" / "03"); <br>• on the phone map, the pin peek and the list tray stack as two sheets (`map-m`). |
| Imagery | 52 | 55 | **New:** a line-art hero on the landing (skyline, torii, mountain, sun), drawn 4:3 Gallery covers (area polygon, ring, vertical plate) and Guidebook chapter maps. **But:** still **0 photographs**. Covers within an area are near-identical, with the same polygon and only the pin moving (`tokyo-gallery-d` row), so a grid of 48 reads repetitive. ROUND-1's cap still applies: about 75–80 without photos. |
| Typography | 79 | 81 | Guidebook is the best type in the product: "Chapter 1 of 13", the display chapter head, the area line, a drop-cap intro and a numbered contents list with counts (`tokyo-guidebook-d`). Insights uses display numerals. Macron loss, above, costs points. |
| Layout | 78 | 85 | ROUND-2's "one long list is the only layout" is gone. There are four real layouts: <br>• Gallery: a hero with a lead card, a ★ row, then a grid with a pager; <br>• Atlas: a 48 % split; <br>• Guidebook: contents beside the chapters; <br>• Insights: stat tiles and two stacked-bar panels. <br>The phone switcher collapses to one button, and Guidebook and Insights compact the masthead. |
| Motion / delight | 50 | 52 | Captured with reduced motion, so judged from the code and the flows. A view switch is an instant swap. The save heart and the rail doors have no new tap feedback. The locator pulse is unchanged. |
| Luxury + fun | 74 | 79 | The Gallery hero ("Browse all 488 places" · "Start with Kanda Myōjin") with a floating lead card feels premium. The landing's "Signatures across the guides" rail ("The hawker canon · 269", "Belgian classics · 163") is fun. The Japan hub adds "Read as a guidebook · See it in numbers" on every city. |
| Wanderlust | 62 | 70 | The landing now has a picture above the fold and a cross-country rail, which was ROUND-2 gap #4. Gallery leads with a place, not a list. **Held back by:** <br>• the Signatures cards are flat indigo tiles with 6-line run-on text on phones (`landing-m`); <br>• the default city view is still Atlas, so Gallery is opt-in; <br>• there are no photographs. |
| **A (mean)** | **67** | **71** | (75 + 55 + 81 + 85 + 52 + 79 + 70) / 7 = 71.0 |

How R3 compares with the leader families on look and feel, described neutrally as in ROUND-1 and ROUND-2:
- **Grid-browse booking products.** Gallery now matches their pattern: a covered grid, paging, a total and show-all. Their
  covers are photographs; ours repeat a drawn polygon.
- **Editorial guide publishers.** Guidebook now meets their reading pattern of chapters, contents and print, and it
  attributes every entry.
- **Photo-led luxury and experience products.** The gap is still photographs, plus motion and the last polish defects.

### B. UX & ergonomics — R2 84 → R3 84

| Area | R2 | R3 | Evidence |
|---|---:|---:|---|
| First screen | 87 | 85 | B-01 slipped from 0.75–0.85 to 0.87–0.97. B-03 is 14, at the limit; the switcher costs a row on phones. |
| Discovery | 88 | 91 | There are four ways into one record set. Insights bars open their places. There is a cross-guide Signatures rail, and the Japan hub deep-links each city into Guidebook and Insights. |
| Map ↔ list | 80 | 83 | Map at 48 %, area-coloured labels, and "See these n on the map" switches to Atlas fitted to the area. The phone map stacks the peek over the tray. |
| Filters | 90 | 90 | Lenses and the tray carry across views (`view=` is kept). |
| Detail | 88 | 90 | The sheet adds "3 of 32 in this Gallery view" with prev/next. `#view=gallery&p=` lands on the right page. |
| Mobile | 80 | 79 | The collapsed switcher works. Guidebook clips text at 390 px. Guidebook hearts are 30 px and source buttons 26 px. City pages still have no bottom bar. |
| Accessibility | 86 | 84 | Default view: AA 0/0 in light and night, focus 30/30, landmarks OK. Designer reports axe 0 serious/critical on the Gallery and Atlas samples. Insights bar links are 18 px tall, below WCAG 2.5.8's 24 px. There is no harness measurement of Guidebook or Insights yet. |
| Performance | 72 | 70 | Tokyo FCP at 4× improved to 376 ms. **But:** <br>• Tokyo transfer grew to 2.16 MB; <br>• Guidebook mounts **12.4 k** nodes on Tokyo (budget 3 k), Insights 4.8 k; <br>• the landing FCP at 4× is still 1.34 s (budget 1.0 s). |
| **B (mean)** | **84** | **84** | (85 + 91 + 83 + 90 + 90 + 79 + 84 + 70) / 8 = 84.0 |

### C. Competitor feature coverage — R2 89 → R3 91

Same 35 rows as ROUND-1. Every row was re-scored on `83aa1a28`. Legend: ✅ shipped (1) · ◐ partial (½) · ✕ missing (0).

| # | Feature | R2 | R3 | R3 evidence / what's missing |
|---|---|---|---|---|
| 1 | Inventory on first screen | ✅ | ✅ | B-01 0.87–0.97 (≤ 1.0) |
| 2 | Collection rail as front door | ✅ | ✅ | ★ first, plus the landing Signatures rail |
| 3 | Contextual home modules | ✅ | ✅ | Rail doors unchanged |
| 4 | Restraint plus local skin per city | ✅ | ✅ | — |
| 5 | Visual anchor without photos | ✅ | ✅ | + landing hero art, Gallery covers, chapter maps |
| 6 | Licensed landmark photos | ✕ | ✕ | 0 credits; egress |
| 7 | Desktop split view, two-way sync | ✅ | ✅ | Atlas 48 %, B-06 true |
| 8 | Mobile list first, map toggle, detents | ✅ | ✅ | QA-31 fix: list-first, tray over the full map |
| 9 | Numbered pins matching the list | ✅ | ✅ | B-09 488 == 488 |
| 10 | Filter tray, "Show N", chips | ✅ | ✅ | B-10 |
| 11 | Situational picks | ✅ | ✅ | — |
| 12 | Grounded personalisation | ✅ | ✅ | — |
| 13 | Tier ladder | ✅ | ✅ | — |
| 14 | Published method | ✅ | ✅ | + Insights "every number is computed from the 488 places" |
| 15 | Attribution as navigation | ✅ | ✅ | + "Who recommends each area" chart |
| 16 | No manufactured urgency | ✅ | ✅ | — |
| 17 | Saved lists | ✅ | ✅ | — |
| 18 | Share place, list, collection | ✅ | ✅ | Shares go through `Cleo.views.shareUrl`, which writes `view=` |
| 19 | "Been there" log | ✅ | ✅ | — |
| 20 | Day plan with route line | ✅ | ✅ | `#day=` opens Atlas |
| 21 | Concierge voice | ✅ | ✅ | — |
| 22 | Accessibility AA + statement | ✅ | ✅ | Default view; see the B notes on non-default targets |
| 23 | In-city search | ✅ | ✅ | Gallery search reaches last-page records |
| 24 | Cross-city search | ✅ | ✅ | — |
| 25 | Per-place permalink | ✅ | ✅ | G1 deep 488/488; in Gallery, `#p=` moves the pager |
| 26 | JSON-LD | ✅ | ✅ | — |
| 27 | Per-city social card | ✅ | ✅ | — |
| 28 | PWA / offline | ◐ | ✅ | **QA signed B-40** (server killed; all 5 pilots 100 %); the SW precaches the view modules. There is still no explicit "Save for offline" control; noted, not scored. |
| 29 | Near me | ✅ | ✅ | — |
| 30 | Multilingual UI | ✕ | ✕ | No string catalogue, pseudo-locale or `hreflang` |
| 31 | Freshness + Recently closed | ✅ | ✅ | — |
| 32 | Directions / export | ✅ | ✅ | — |
| 33 | Night edition | ✅ | ✅ | QA-30 fixed; B-23 night 0/0 |
| 34 | "What changed" feed | ✕ | ◐ | **Atom feeds** per city plus `all.xml` (170 entries), from dated provenance, and linked in `<head>`. There is no human-readable "What changed" page or visible link. |
| 35 | Functional delight, reduced-motion safe | ◐ | ◐ | Unchanged |

R3 tally:
- ✅ 31: #1–5, 7–29, 31–33;
- ◐ 2: #34, 35;
- ✕ 2: #6, 30;
- coverage: (31 + 1) / 35 = **91.4 % → 91**.

### D. Unique strengths — R2 86 → R3 88

| Strength | R2 | R3 | Evidence |
|---|---:|---:|---|
| Sourced picks; attribution as navigation | 92 | 94 | Insights "Who recommends each area" (983 citations over 488 places, by source per area). No leader publishes its sourcing as data. |
| Verified pins | 88 | 90 | Guidebook's colophon line: "488 of 488 pins verified · status checked to 2026-10-03". Atlas map at 48 %. |
| Closure honesty | 92 | 92 | Insights "Closed, kept: 1". Unchanged otherwise. |
| Interest triad | 80 | 80 | Insights splits sights, eat & drink and pop culture per area. There is still no pop-culture data outside Japan (LP-06). One inconsistency: Insights says "Pop culture 50" while ★ says 37, because the trail and the collection are different sets, and neither label says so. |
| Anime layer | 85 | 85 | Unchanged |
| "Your guide" and day plans | 78 | 78 | Unchanged. The Guidebook print path exists, but no printable day was tested. |
| Stated gaps | 85 | 87 | Insights states its denominators ("All 488 places counted once"). |
| **D (weighted judgement)** | **86** | **88** | Mean 86.6. Sourcing weighs most, and Insights is the round's most distinctive addition. |

## Top 10 remaining gaps, ranked by expected score impact

Gain = weight × dimension points if the change fully lands. A ≥ 80 needs about +9 on A, so gaps 1–5 together are required.

| # | Gap | Concrete change | Lane | Expected gain |
|---:|---|---|---|---|
| 1 | **0 photographs** (imagery cap) | Fetch the manifest's Wikipedia-linked landmark files on an unrestricted machine and complete the `CREDITS.json` rows. The credit gate already renders them on hub heroes, Gallery covers and sheets. Do not fake them meanwhile. | owner action + imagery | A +9 → **+3.6** |
| 2 | **New-view polish residue** | One name field with diacritics everywhere ("Kanda Myōjin"; hero "Jōnan · Jōsai · Jōhoku"). Guidebook phone dek and stat line wrap, not clip. Gallery hero title clear of the subtitle and pin dots. Gallery switcher glyph is not the heart. Insights dates don't break mid-token. Phone map shows one sheet, not peek plus tray. | FE-A (Gallery/Atlas, data string) + FE-B (Guidebook/Insights) + designer | A +5 → **+2.0** |
| 3 | **Gallery cover monotony** | Vary covers within an area: a category motif (shrine, noodle bowl, museum), plate colour by tier, crop and zoom by pin, and the vertical plate only for CJK names. No two adjacent cards may share the same composition. | designer + imagery | A +4 → **+1.6** |
| 4 | **Gallery is not the default** | Once QA signs `beta:qa:views` (G1 in Gallery is 488/488 per FE-A), flip `DV` to Gallery as SPEC intends. Keep B-01 ≤ 1.0 with the lead card visible on phones. | FE-A + QA | A +3 → **+1.2** |
| 5 | **Motion and delight** (C #35) | Motion-safe micro-interactions: save heart and stamp, rail-door press, sheet rise, a cross-fade on the view switch, and Insights bars growing on first view. Nothing autoplays; all off under reduced motion. | designer + FE-A | A +3, C +1.4 → **+1.5** |
| 6 | **Guidebook / Insights weight** | Guidebook mounts 12.4 k nodes on Tokyo; render chapters lazily (contents first, then chapters on approach) to stay ≤ 3 k. Trim Tokyo transfer back under 2.0 MB. Landing FCP at 4× ≤ 1.0 s. | platform + FE-B | B +4 → **+1.0** |
| 7 | **Small targets in the new views** | Guidebook hearts 30 → 44 px, source buttons 26 → 44 px (or inline text links, as the cards use), Insights bar links ≥ 24 px tall with a table fallback. | FE-B | B +3 → **+0.75** |
| 8 | **Multilingual scaffolding** (C #30) | String catalogue, pseudo-locale test and `hreflang`, with the switcher hidden until a reviewed locale exists (M3-03). | platform + FE-B | C +2.9 → **+0.6** |
| 9 | **"What changed" is feed-only** (C #34) | A human-readable per-city "What changed" page from the same Atom data, linked from the masthead's "last checked" line. | platform + FE-B | C +1.4 → **+0.3** |
| 10 | **Harness and sign-off for non-default views** | `beta:metrics --view` for all four views in the scored run (B-20, B-23, DOM per view). Update B-12, which still reads "0 of 0 closed". Get QA's W3 views sign-off on `83aa1a28`. | QA | B +1, protects C → **+0.25** |

Not ranked, but worth doing: label Insights "Pop culture 50 (trail)" against "★ 37 (collection)" (FE-B), and get pop-culture
records beyond Japan (LP-06, owner action on the live pipeline).

**Projection.**
- Gaps 2–5 without photographs: A ≈ 75–76, overall ≈ 83. **A stays below 80.**
- Adding photographs (gap 1): A ≈ 84, overall ≈ 86–87.
- The 90 stretch needs photographs, zero polish defects, motion, and B back up to about 88 (weight and targets).

## Verdict against the goal

| Gate | Target | R3 | Met? |
|---|---|---:|---|
| Overall | ≥ 80 | 80.8 | ✅ (+0.8) |
| A. Look & feel | ≥ 80 | 71 | ✕ (−9) |
| C. Feature coverage | ≥ 80 | 91 | ✅ |
| Stretch | 90 | 80.8 | ✕ |

**Not met.** A is still 9 points short.

The views did what ROUND-2 predicted. They added layout and editorial range (A +4), and Insights made sourcing visible as
data (D +2). Feeds and QA's offline sign-off moved C. But the round shipped the Gallery behind the Atlas default, added new
polish defects and weight in the new views, and could not add photographs.

The A gate is now an owner decision (photographs) plus a focused polish, cover-variety and motion pass. Without
photographs, the honest ceiling for A is about 76.

## What R3 got right (keep)

- One record set and one lens predicate set across four views.
- `view=` on shares.
- Deep links land on the right Gallery page.
- An unknown `view=` falls back silently.
- G1 stays 100 %.
- Guidebook reads like a real field guide, and every entry keeps "Recommended by".
- Insights is honest: every chart states its denominator, and every bar opens its places.
- The phone switcher collapses to one control, which keeps B-03 at 14.
- 24/24 on every pilot, AA in both themes, and 0 JS errors across 60 captured flows.

## Reproduce

```bash
git worktree add ../ev 83aa1a28 && cd ../ev/tools && npm install && npm run beta:check && npm run beta:metrics
python3 -m http.server 8781                     # from ../ev (R3)
# R2: mirror ../ev with beta/ → `git archive 764dc97b beta`; serve on 8782
node design/beta/eval/r3/tools/shots-r3.js r3 8781 <out>/r3
node design/beta/eval/r3/tools/shots-r3.js r2 8782 <out>/r2
python3 design/beta/eval/r3/tools/pair.py <out>/r2 <out>/r3 design/beta/eval/r3 landing,japan,tokyo,tokyo-gallery,...
```
