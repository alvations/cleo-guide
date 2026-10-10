# Evaluation round 5 (final) — independent evaluator

> 2026-10-10 · evaluator lane (no build lane)
> **Measured:** R5 is the beta at `f2bf7610`, the W5 build-complete head. Gallery is now the default view.
> `npm run validate`, `npm test` (all suites) and `npm run beta:check` are green on that SHA: 179 pages, 84 place pages,
> 8,458 places, beta == live.
> **Baseline:** R4 is the beta at `8aa6fdf4`, read with `git archive 8aa6fdf4 beta`. [ROUND-4](ROUND-4.md) scored it 83.4.
> **Rubric:** unchanged since ROUND-1: the same four dimensions and weights, the same A/B sub-criteria, the same 35-row feature
> table for C, and the same D strengths.
> Program-wide summary: [FINAL-SUMMARY](FINAL-SUMMARY.md).

## Verdict

**The overall gate is met. The goal is not.** R5 scores **84.5 / 100** (R4 83.4), with **A = 76** and **C = 96**. The goal
is ≥ 80 overall with A ≥ 80 and C ≥ 80. The stretch target is 90.

- **A rises +2**, from 74 to 76. Gallery as the default changes the first impression, most of all on phones, where a real place
  card now sits in the first screen. Macrons now read at DPR 1, the masthead link is fixed, and covers draw the kind of place.
  But there are still **0 photographs**, and A stays under the cap ROUND-1 set for a guide without them.
- **B rises +1**, from 85 to 86. The first screen gains a lot (B-01 is about 0.5, B-03 is 7), and Insights rows are 44 px.
  Two things offset that:
  - the **default view now loads more**: the Tokyo transfer goes from 2.06 to 3.03 MB, and FCP at 4× from 396 to 1,124 ms;
  - **the map is further away**: on a phone, from the Gallery, "Show the map" switches to the Atlas list without opening the
    map.
- **C stays at 96** and **D stays at 89**. No feature row changed status.
- **Stretch 90 is not in reach** without photographs.

## Scorecard

| Dimension (weight) | R3 `83aa1a28` | R4 `8aa6fdf4` | **R5 `f2bf7610`** | Δ R4→R5 | Goal |
|---|---:|---:|---:|---:|---:|
| A. Look & feel (40 %) | 71 | 74 | **76** | +2 | ≥ 80 ✕ |
| B. UX & ergonomics (25 %) | 84 | 85 | **86** | +1 | — |
| C. Competitor feature coverage (20 %) | 91 | 96 | **96** | 0 | ≥ 80 ✅ |
| D. Unique strengths (15 %) | 88 | 89 | **89** | 0 | — |
| **Overall (weighted)** | **80.8** | **83.4** | **84.5** | **+1.1** | ≥ 80 ✅ |

R5 = 0.4×76 + 0.25×86 + 0.2×96 + 0.15×89 = 30.4 + 21.5 + 19.2 + 13.35 = **84.45 → 84.5**.

## Method

The method is identical to ROUND-4.

1. **Gates.** In a detached worktree at `f2bf7610`, I ran `cd tools && npm install`, then `npm run validate`, `npm test` and
   `npm run beta:check`. All passed.
2. **Servers.** I served that tree on port 8795 (R5). I served a mirror of it with `beta/` replaced by `8aa6fdf4:beta` on
   port 8796 (R4).
3. **Screenshots.** Taken with [`r5/tools/shots-r5.js`](r5/tools/shots-r5.js), which is ROUND-4's `shots-r4.js` with only
   its header comment changed. The settings were the same:
   - the same 61 flows, at 390×844 @2× touch and at 1440×900;
   - light theme and reduced motion;
   - off-origin requests aborted and tiles stubbed (**a blank map ground is a sandbox artefact**);
   - the same 4 saved refs seeded.

   The logs are in [`r5/shots-r5-log.json`](r5/shots-r5-log.json) and [`r5/shots-r4-log.json`](r5/shots-r4-log.json). I
   built the composites with [`r5/tools/pair.py`](r5/tools/pair.py).
   - The URL list did not change, so a URL with no `view=` now opens **Gallery** in R5. "Tokyo (default)" and
     "Tokyo · Gallery" therefore show the same view. This is intended, since it measures the default.
   - The `tray-m` flow failed in **both** rounds, because the phone has no visible `[data-cleo-tray]`. This is a harness
     limit, the same as in R4.
4. **Metrics.** I ran `npm run beta:metrics` on the pilots in the throwaway worktree, writing to the scratchpad and leaving
   QA's files alone. The output is in [`r5/beta-metrics-r5.md`](r5/beta-metrics-r5.md). Like R4's run, it measures the
   **default view**, which is now Gallery.
5. **Probes.** Scripts are in `r5/tools/probe-*.js`.
   - The phone map toggle from the Gallery.
   - The Cleveland lead card compared with its "Start with" button.
   - Transfer by resource.
   - A DPR 1 crop of the Gallery cover names ([`r5/crop-kanda-cover-dpr1-r4-r5.png`](r5/crop-kanda-cover-dpr1-r4-r5.png)).

   No web research and no WebFetch.

**Process note.** QA's W5 pass ran in parallel and landed while this round was being written. It gives **sign-off YES on
`f2bf7610`** and ratifies FE-A's G1 "scrolled" and B-01 card criteria, backed by its own `tools/beta/qa/w5.js` (deep links
1,241/1,241). See `docs/BETA-QA.md` and BETA-LOG. Transfer figures here are `beta:metrics`' **uncompressed** byte totals,
the same basis as R4's 2.06 MB. QA's "Tokyo ≈ 0.55 MB" is gzip on the wire. Both bases show the default view grew.

## Side-by-side (R4 → R5)

Composites are labelled R4 `8aa6fdf4` | R5 `f2bf7610`.

| Page | Mobile 390×844 | Desktop 1440×900 |
|---|---|---|
| Landing | ![](r5/landing-m-r4-r5.jpg) | ![](r5/landing-d-r4-r5.jpg) |
| Country hub (Japan) | ![](r5/japan-m-r4-r5.jpg) | ![](r5/japan-d-r4-r5.jpg) |
| Tokyo (default: Atlas → **Gallery**) | ![](r5/tokyo-m-r4-r5.jpg) | ![](r5/tokyo-d-r4-r5.jpg) |
| Tokyo · Gallery hero | ![](r5/tokyo-gallery-m-r4-r5.jpg) | ![](r5/tokyo-gallery-d-r4-r5.jpg) |
| Tokyo · Gallery cover grid | ![](r5/tokyo-gallery-p2-m-r4-r5.jpg) | ![](r5/tokyo-gallery-p2-d-r4-r5.jpg) |
| Tokyo · Atlas | ![](r5/tokyo-atlas-m-r4-r5.jpg) | ![](r5/tokyo-atlas-d-r4-r5.jpg) |
| Tokyo · Guidebook | ![](r5/tokyo-guidebook-m-r4-r5.jpg) | ![](r5/tokyo-guidebook-d-r4-r5.jpg) |
| Tokyo · Insights | ![](r5/tokyo-insights-m-r4-r5.jpg) | ![](r5/tokyo-insights-d-r4-r5.jpg) |
| Cleveland (default: Atlas → **Gallery**) | ![](r5/cleveland-m-r4-r5.jpg) | ![](r5/cleveland-d-r4-r5.jpg) |
| Cleveland · Gallery | ![](r5/cle-gallery-m-r4-r5.jpg) | ![](r5/cle-gallery-d-r4-r5.jpg) |
| Cleveland · Atlas | ![](r5/cle-atlas-m-r4-r5.jpg) | ![](r5/cle-atlas-d-r4-r5.jpg) |
| Cleveland · Guidebook | ![](r5/cle-guidebook-m-r4-r5.jpg) | ![](r5/cle-guidebook-d-r4-r5.jpg) |
| Cleveland · Insights | ![](r5/cle-insights-m-r4-r5.jpg) | ![](r5/cle-insights-d-r4-r5.jpg) |
| Singapore town (Chinatown & CBD) | ![](r5/chinatown-m-r4-r5.jpg) | ![](r5/chinatown-d-r4-r5.jpg) |
| Place detail (Kanda Myōjin sheet) | ![](r5/sheet-m-r4-r5.jpg) | ![](r5/sheet-d-r4-r5.jpg) |
| Sheet from a Gallery link | ![](r5/galsheet-m-r4-r5.jpg) | ![](r5/galsheet-d-r4-r5.jpg) |
| Switcher tap → Gallery | ![](r5/switch-m-r4-r5.jpg) | ![](r5/switch-d-r4-r5.jpg) |
| Mobile map (toggle + pin peek) | ![](r5/map-m-r4-r5.jpg) | ![](r5/map-d-r4-r5.jpg) |
| Saved lists | ![](r5/saved-m-r4-r5.jpg) | ![](r5/saved-d-r4-r5.jpg) |
| Day plan (Tokyo `#day=TAITO` · Cleveland rail tile) | ![](r5/day-m-r4-r5.jpg) · ![](r5/daycle-m-r4-r5.jpg) | ![](r5/day-d-r4-r5.jpg) · ![](r5/daycle-d-r4-r5.jpg) |
| What changed (Tokyo · Cleveland) | ![](r5/changes-m-r4-r5.jpg) · ![](r5/changes-cle-m-r4-r5.jpg) | ![](r5/changes-d-r4-r5.jpg) · ![](r5/changes-cle-d-r4-r5.jpg) |

## Key measurements (R4 → R5)

| Measure | R4 | R5 | Source |
|---|---|---|---|
| Default view | Atlas | **Gallery** | shots log `view` |
| `beta:metrics` pilot score (default view) | 23/24 ×5, landing 10/10 | **20/24 ×4, 19/24** (Chinatown), landing 10/10 | metrics |
| B-01 screens to first card (≤ 1.0) | 0.90–1.00 | **0.50–0.59** | metrics |
| B-03 controls above first card (≤ 14) | 15 ✕ | **7** | metrics |
| G1 reachability (default view) | 100 % | 100 %: scrolled, deep, search and no-JS on all 5 pilots, using FE-A's criterion, which QA has now ratified | metrics |
| B-06 split + sync · B-07 phone map · B-09 numbered pins (default view) | ✅ | **✕**: these are Atlas rows, and the default is no longer Atlas. Atlas keeps them, one tap away. | metrics |
| B-16 cards per phone screen (≥ 2) | ✅ | ✕ 1.52–1.61, from the 1-column cover grid | metrics |
| B-23 contrast, light + night | 0/0 | 0/0 (Gallery cover initials are now generated content) | metrics |
| Transfer, default view, by harness: Tokyo · New York · Cleveland | 2.06 · 1.82 · 1.20 MB | **3.03 · 5.84 · 1.46 MB** | metrics |
| Transfer by resource (probe, phone, Tokyo) | 1.41 MB, with no places JSON at load | 1.85 MB, including **`data/places/tokyo.json` 423 KB** fetched at load | `probe-transfer.js` |
| FCP at 4× CPU: Tokyo · landing | 396 · 540 ms | **1,124** · 516 ms | metrics |
| Initial DOM, Tokyo Insights | 3,796 | **2,908** (budget 3 k ✅) | shots log |
| Targets < 44 px, Tokyo Insights (phone · desktop) | 183 · 183 | **116 · 46** (chart rows are 44 px; what is left is mostly in-text links) | shots log |
| DOM after a `#p=` deep link on a phone | 2,006 (Atlas) | **12,775** (opens in Gallery) | shots log `sheet-m` |
| Phone: from the default view to the map | 1 tap | **2 taps**. "Show the map" switches to the Atlas list, and a second tap opens the map. | `probe-map-taps.js` |
| Macron at DPR 1, cover "Kanda Myōjin" | faint | visible | `crop-kanda-cover-dpr1-r4-r5.png`; designer's `macron-check` 8/8 |
| Photographs | 0 | **0** (`beta/assets/img/photos/` holds only a README) | tree |
| JS errors on 61 captured flows | 0 | 0 | shots log |

## Evidence per dimension

### A. Look & feel — R4 74 → R5 76

| Sub-criterion | R4 | R5 | Evidence (R5) |
|---|---:|---:|---|
| Visual polish | 77 | 80 | **Fixed:** <br>• the masthead reads "last checked 2026-10-03" with even line gaps (`tokyo-m`, `cleveland-m`); <br>• the hero dek and cover names show their macrons at DPR 1; <br>• the phone hero is compact and no longer a wall of stat text. <br>**Still visible:** <br>• the Cleveland hero lead card shows **Slyman's**, but the button beside it reads "**Start with Larder Delicatessen and Bakery**" (`cle-gallery-d`). It is pre-existing, but it now sits in the default first screen. <br>• the desktop Gallery hero is a large, mostly empty navy field (`tokyo-d`, `chinatown-d`). |
| Imagery | 61 | 63 | Covers now draw the kind of place: Kanda Myōjin gets the gate, and Akihabara gets a shopfront (`tokyo-gallery-p2-d`). There are three new motifs; 796 of 7,638 cards changed. **But:** <br>• still **0 photographs**, so the cap applies; <br>• Cleveland's 148 sights have no collection ids and all keep the compass motif. That is a stated gap, correctly not keyword-guessed. |
| Typography | 82 | 85 | The macron hairline was fixed by measurement (opsz 6 on 15–36 px Bodoni), and I confirmed it on the DPR 1 crop. Nothing else is open. |
| Layout | 85 | 86 | The phone first screen has a hero, then a "Start with" card, then the ★ row (`tokyo-m`, `cleveland-m`). Desktop is unchanged from the R4 Gallery. |
| Motion / delight | 60 | 60 | Unchanged. There is still no signature moment. |
| Luxury + fun | 80 | 82 | The first thing a visitor sees is now curated cover cards, not a map tray. |
| Wanderlust | 71 | 77 | Gallery is the default, and the phone shows a place to go inside the first screen. There are no photographs, so the art carries all of it. |
| **A (mean)** | **74** | **76** | (80 + 63 + 85 + 86 + 60 + 82 + 77) / 7 = 76.1 |

How R5 compares with the leader families, described neutrally:
- **Grid-browse products.** Our default now opens on cover cards, as theirs do. Theirs are photographs.
- **Editorial publishers.** Comparable, and ahead on dated provenance.
- **Photo-led luxury products.** The gap is still photographs and a signature motion moment.

### B. UX & ergonomics — R4 85 → R5 86

| Area | R4 | R5 | Evidence |
|---|---:|---:|---|
| First screen | 82 | 90 | B-01 0.50–0.59, B-02 391–466 px, B-03 7 on every pilot. A real place card is in view on phones. |
| Discovery | 92 | 92 | Lens links keep their counts: a URL with a lens opens Atlas, and a lens tap inside Gallery stays in Gallery. |
| Map ↔ list | 86 | 80 | The default has no map. On a phone, the toolbar's "Show the map" from Gallery lands on the Atlas **list**, and only a second tap opens the map (`probe-map-taps.js`; `map-m` shows the list). Desktop needs the Atlas tab for the split view. Atlas itself is unchanged (B-06/07/09 ✅ there). |
| Filters | 90 | 90 | "Show N places" on every pilot. |
| Detail | 90 | 90 | B-17 is complete. The sheet adds a "Why it's here" label (`sheet-m`). |
| Mobile | 82 | 85 | The lead card. Insights rows are 44 px. B-16 is 1.5–1.6 in the 1-column cover grid (SPEC §4; not counted against Gallery in R3–R4). |
| Accessibility | 86 | 88 | AA 0/0 in light and night, and focus 30/30 in the new default. Decorative initials are out of the text tree. Insights targets under 44 px fell from 183 to 46 on desktop. |
| Performance | 76 | 70 | **Regressed in the default view.** <br>• Tokyo transfer is 3.03 MB (R4 2.06; target < 2.0) and New York 5.84 MB. <br>• Gallery fetches the full places JSON at load (423 KB on Tokyo). <br>• FCP at 4× on Tokyo is 1,124 ms (budget 1.0 s). <br>• A `#p=` deep link on a phone builds 12.8 k nodes. <br>**Gains:** Insights is down to 2.9 k nodes, and `map.svg` is fetched once. |
| **B (mean)** | **85** | **86** | (90 + 92 + 80 + 90 + 90 + 85 + 88 + 70) / 8 = 85.6 |

### C. Competitor feature coverage — R4 96 → R5 96

I re-checked all 35 rows on `f2bf7610`, and no status changed.

| # | Feature | R4 | R5 | Note |
|---|---|---|---|---|
| 1 | Inventory on the first screen | ✅ | ✅ | Stronger: B-01 is 0.5. |
| 6 | Licensed landmark photos | ✕ | ✕ | 0 credits. The image hosts are blocked by the environment's network policy, so this is an owner action. |
| 7 / 8 / 9 | Split view, phone map toggle, numbered pins | ✅ | ✅ | All are in Atlas, one tap from the default. The phone map takes one extra tap from Gallery (see B). |
| 30 | Multilingual UI | ◐ | ◐ | The landing and hub strings are on the catalogue now (+78 keys, with the pseudo-locale gate). There is still no reviewed second locale. |

R5 tally: ✅ 33 · ◐ 1 (#30) · ✕ 1 (#6). Coverage is (33 + 0.5) / 35 = **95.7 % → 96**.

### D. Unique strengths — R4 89 → R5 89

| Strength | R4 | R5 | Evidence |
|---|---:|---:|---|
| Sourced picks; attribution as navigation | 94 | 94 | G6: 0 cards without "Recommended by", including the new lead card. |
| Verified pins | 91 | 91 | Unchanged |
| Closure honesty | 95 | 95 | Unchanged |
| Interest triad | 80 | 81 | Insights now reads "Pop culture (trail)". The ★ row still says 37 with no "(collection)" label, so the mismatch is only half explained. |
| Anime layer | 85 | 85 | Unchanged. Kanda Myōjin's cover now shows the shrine, not the anime bubble, which is correct, because the place *is* a shrine. |
| "Your guide" and day plans | 78 | 78 | Unchanged |
| Stated gaps | 88 | 89 | The Cleveland motif gap is stated in REVIEW-W5 and not filled by guessing. |
| **D (weighted judgement)** | **89** | **89** | The mean is 87.6, and sourcing and closure honesty weigh most. |

## Top 10 remaining gaps, ranked by expected score impact

Gain = weight × the dimension points if the change fully lands. A ≥ 80 needs **+4 on A**.

| # | Gap | Concrete change | Lane | Expected gain |
|---:|---|---|---|---|
| 1 | **0 photographs** (imagery cap) | Fetch the manifest's landmark files on an unrestricted machine and complete `CREDITS.json`. The gate and the `.cover.photo` variant are ready. Never fake them. | **owner action** + imagery | A +9 → **+3.6** |
| 2 | **Default-view weight** | Don't fetch `data/places/<city>.json` before first paint in Gallery. Defer it to idle or the first pager or search use, and never hide places. Bring Tokyo under 2.0 MB and FCP 4× under 1.0 s. Find out why New York is 5.8 MB. Keep `#p=` deep links in Gallery near the R4 DOM. | platform + FE-A | B +6 → **+1.5** |
| 3 | **Map from the default on phones** | Make "Show the map" in Gallery open Atlas **with the map open** (`#view=atlas&map=1`) in one tap. Add the same map affordance to the desktop Gallery hero. | FE-A | B +5 → **+1.25** |
| 4 | **Signature motion moment** | One action-driven, reduced-motion-safe moment, for example a cover that unfolds into the sheet. | designer + FE-A | A +3 → **+1.2** |
| 5 | **Lead-card mismatch and empty desktop hero** | The "Start with" button must name the place the lead card shows (Cleveland: Slyman's vs Larder). Use the empty desktop navy field, for example by setting the city schematic at a legible scale. | FE-A + designer | A +2 → **+0.8** |
| 6 | **Cleveland sights on the compass motif** | Give the 148 sights collection ids through the **live** pipeline (a PM backlog request; out of beta scope), and the motif follows by rule. | PM → live pipeline | A +1 → **+0.4** |
| 7 | **No reviewed second locale** (C #30) | The owner reviews one locale, and the switcher appears by rule. | owner review + platform | C +1.4 → **+0.3** |
| 8 | **Harness view rows** | QA has ratified the Gallery criteria and signed W5. Still to do: `beta:metrics` reports the Atlas rows (B-06/07/09) under `--view atlas`, so the default-view table does not read as a regression. | QA | B +1 → **+0.25** |
| 9 | **B-16 in Gallery on phones** (1.5–1.6) | A 2-up compact grid below the first rows on phones, or accept the cover-led grid in SPEC with QA. | designer + QA | B +1 → **+0.25** |
| 10 | **★ count label** | Label the ★ row "37 (collection)", which completes the R4 gap #10. | FE-A | D +1 → **+0.15** |

**Projection.**
- Gaps 2–6 without photographs: A ≈ 79, B ≈ 89, overall ≈ 86. **A still misses 80.**
- Adding photographs: A ≈ 86, overall ≈ 89.
- Stretch 90 needs photographs **and** gaps 2–4.

## Verdict against the goal

| Gate | Target | R5 | Met? |
|---|---|---:|---|
| Overall | ≥ 80 | 84.5 | ✅ (+4.5) |
| A. Look & feel | ≥ 80 | 76 | ✕ (−4) |
| C. Feature coverage | ≥ 80 | 96 | ✅ |
| Stretch | 90 | 84.5 | ✕ |

**Not met, after five rounds.**

W5 did what ROUND-4 asked of it:
- Gallery is the default;
- the masthead link is fixed;
- macrons read at DPR 1;
- covers draw the kind of place;
- Insights has 44 px rows and a smaller DOM.

That moved A from 74 to 76. The Gallery default also made the first screen heavier and put the map one tap further away, so B
gained only +1.

**A is capped by the lack of photographs, which are an owner action. The A ≥ 80 goal is now the owner's to unlock.**

## What R5 got right (keep)

- FE-A flipped the Gallery default only after every gate passed on the pilots, and it says plainly which rows it does not claim.
- Every place stays reachable in the new default: G1 deep, search and no-JS are 100 % on every pilot, and QA ratified it.
- The macron fix was verified by a pixel test, not by eye, and it holds at DPR 1.
- Motifs key on collection ids. Where Cleveland has no ids, the gap is stated and not guessed (the Wenwen rule).
- The i18n groundwork rebuilt the landing and hubs byte-identically, and no unreviewed locale shipped.
- 0 JS errors across 61 flows. AA holds in both themes. validate, test and beta:check are all green.

## Reproduce

```bash
git worktree add ../ev f2bf7610 && cd ../ev/tools && npm install && npm run validate && npm test && npm run beta:check && npm run beta:metrics
python3 -m http.server 8795                     # from ../ev (R5)
# R4: a mirror with beta/ from `git archive 8aa6fdf4 beta`, served on 8796
node design/beta/eval/r5/tools/shots-r5.js r5 8795 <out>/r5
node design/beta/eval/r5/tools/shots-r5.js r4 8796 <out>/r4
python3 design/beta/eval/r5/tools/pair.py <out>/r4 <out>/r5 design/beta/eval/r5 landing,japan,tokyo,tokyo-gallery,...
node design/beta/eval/r5/tools/probe-map-taps.js   # and probe-map-lead.js, probe-transfer.js
```
