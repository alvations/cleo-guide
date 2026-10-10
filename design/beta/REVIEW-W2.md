# Design review — Wave 2 (designer lane)

> 2026-10-10 · UI/UX lane · measured at `a94edb7` + this push (all W2 lanes merged: platform slice 1, imagery, FE-A slice 1,
> FE-B slices 1–3, designer pushes 1–3). Harness: `design/beta/tools/w2-shots.js` — 390×844 @2x and 1440×900, light,
> reduced motion, off-origin aborted, tiles stubbed (the flat map ground is a sandbox artefact). QA's `npm run beta:metrics`
> on the pilots (qa/ restored after). Judged against the ROUND-1 leader patterns, without naming brands (BETA-PROGRAM rule 6).

## Verdict

The beta now **looks like one designed product on every surface R1 criticised**: plates fit, the sheet is clean and
readable, the rail and hubs have real variety, the saved page is designed, and the two "knows you" features exist.
What still separates it from the photo-led leaders is photography (blocked by policy) and density control on the map.
My estimate for **A (look & feel): ≈ 74–78** (R1 60) — the cap without photos is ~80, so the last points are polish:
map pin decluttering, saved-page covers, day-plan plates.

## Per-gap verdicts (ROUND-1 "Top 10")

| # | Gap | Verdict | Evidence | What is left (owner) |
|---:|---|---|---|---|
| 1 | Imagery / hubs alike | **◐ → mostly closed** | Original per-city motifs in mastheads (Tokyo torii + skyline line, Cleveland swell + skyline), country/collection motifs, photo path with TASL gate ([imagery shots](eval/w2/imagery/)). Hub tiles: four compositions, no two neighbours alike (`rev-landing-d`, `rev-japan-d`). Plates now carry each city's own motif in ink + a second skin accent (`rev-tokyo-m-s1`). | Photos need the owner's files (policy). Imagery: masthead motif sits behind the facts text on phones (`rev-cleveland-m`) — keep it right of 60 % on < 640 px. |
| 2 | No "for you" | **✅** | Rail module "For you", picker (5 interests, ids only), status line "Your guide puts Pop culture · Art & museums first … all 488 places are still here" + Change; lifted cards say "First because…" (`fe-a/w2-foryou-on-m`). Home modules (Your day · Near me · Free to visit · Your list) in the rail. | Designer nit: the status line uses an unstyled sparkle; switch to `.because` (spec §1) for the wash panel. |
| 3 | Hub/landing wanderlust | **✅** | Tile lines are dishes + landmarks from data ("Polish Boy · corned beef · Haserot Angel", "pierogi · fish sandwich · Point State Park"); editorial cross-city rail; country hero with "known for" line (`rev-landing-d`, `rev-japan-d`). | Macrons in the hero "known for" line were vanishing (Goryōkaku) — **fixed here** (opsz cap). Landing is **83 KB > 80 KB budget** (FE-B/PLT/imagery). |
| 4 | Card & sheet polish | **✅** | Vertical plates fit (no clipping, 2 columns for long names); native printed once; Close in its own header row; glyph stroked; sheet body Figtree 17/1.62; "Recommended by" commas glued (`rev-sheet-m`, `rev-sheet-d`, `rev-tokyo-m-s1`); rail module text no longer overlaps (**fixed here** — my `.mod` spec class collided with FE-A's `.rail-i.mod`); area-heading dot stays with the name (**fixed here**). Bodoni macron spacing **root cause**: not a missing glyph (U+014D is in the subset) — Bodoni Moda draws the macron as a hairline that thins away above opsz ≈ 32; display text is capped at opsz 28. | FE-A: "Recommended by" wraps a long 2nd source onto a 44 px line, leaving a tall gap (`rev-cleveland-m-s1`) — let chips wrap tighter (line-height 1.6 + invisible 44 px hit pseudo). |
| 5 | Day plans | **✅** | "Your day" lens: numbered stops, legs "120 m to the next stop, straight-line", total, honest label, reorder/remove, share, KML, dashed route + numbered pins (`fe-a/w2-day-d`). | FE-A: the dotted spine runs through the leg text ("12ʼ0 m"); stops are text rows — use the `.stop` + mini card density from `mockups/w2-components.html` for the luxury feel; eyebrow "YOUR DAY · TOKYO" is caps-only (use sentence case, VOICE). FE-A and platform have **two planners** (170 vs 164 days) — pick one source of truth (PLT `guide.days`). |
| 6 | Map as guide | **◐+** | Map 44 % of 1440 desktop; flies to the area in view and to the open sheet; numbered pins in focus area; mobile peek ≈ 38 % with summary + Close/Open (`rev-map-m`); sheet locator inset from verified pins (`rev-sheet-m`). | FE-A: **numbered pins overlap** at city zoom (Tokyo desktop + mobile: "38/33/31…" stacked) — declutter: numbers only for the focused area *and* collision-hide labels (or cluster) below zoom 14 (P14). |
| 7 | Saved page | **◐+** | Tabs (All saved · Been there · lists), New list / Rename / Delete, Share, Export, Import, map of saved, read-only shared view with Save a copy (`rev-saved-d`, `fe-a/w2-saved-shared-m`). | FE-A: cards have no plates/covers (spec asked for covers); native name glued "Gardens皇居東御苑" (needs a space or `.nat` line); map numbers restart per city ("1" twice) — number across the list or label by city colour. |
| 8 | Static features | **✅** | Near me opt-in (never stored), Recently closed lens, `accessibility.html`. | — |
| 9 | Weight & sharing | **✕ (not yet)** | DOM at load: **Tokyo 12,092 · NYC 11,684** nodes (budget 3,000); `beta/assets/og/` empty (shared OG cover). | Platform. |
| 10 | ★ = canon not publisher | **◐** | Platform exposes `guide.signature` (Cleveland "Only in Cleveland" 18); hub tiles use it. | FE-A: Cleveland city page **still shows ★ News 5 Cleveland** (`rev-cleveland-m`) — read `guide.signature`. |

## Luxury + fun layer (designer, this wave)

- **Skins beyond one accent:** each skin now has `--motif-ink` (its motif in ink, for light grounds) and a decorative
  `--city-2` (never text/action; contrast.py 344 pairs, 0 below AA). Plates, the sheet plate and tile bars carry the
  two-accent edge.
- **Motion** (all behind `prefers-reduced-motion: no-preference`, no opacity on content, ≤ 300 ms on primary paths):
  scroll-linked card rise, sheet slide-up / side-in, save-ring pulse, glyph bob on card hover, tier-star turn,
  signature-tile sheen, tile-constellation twinkle, press scale.
- **Editorial type:** italic Didone deks, drop initial + old-style figures on collection intros, Figtree for reading.
- **Uppercase:** pilots ≤ 6 % (Wheeling), Tokyo 0.3 % (B-19 < 15 %). New caps-only text to fix: FE-A day eyebrow.

## Metrics (pilots, `beta:metrics`, this head)

B-20 0 targets < 44 · B-21 smallest 12 px · B-23 contrast light + night 0 failures on all six · B-03 14 ·
B-16 cards/screen CLE 2.22 · Tokyo 2.33 · NYC 2.29 · Chinatown 2.35 · **Wheeling 1.99** (R1 1.95; long write-ups) · 0 JS errors in my 26 captures.

## Screenshots (this review)

| Surface | Mobile | Desktop |
|---|---|---|
| Landing | ![](eval/w2/designer/rev-landing-m-s1.jpg) | ![](eval/w2/designer/rev-landing-d.jpg) |
| Japan hub | ![](eval/w2/designer/rev-japan-m.jpg) | ![](eval/w2/designer/rev-japan-d.jpg) |
| Tokyo | ![](eval/w2/designer/rev-tokyo-m-s1.jpg) | ![](eval/w2/designer/rev-tokyo-d.jpg) |
| Cleveland | ![](eval/w2/designer/rev-cleveland-m.jpg) | ![](eval/w2/designer/rev-cleveland-d.jpg) |
| Sheet | ![](eval/w2/designer/rev-sheet-m.jpg) | ![](eval/w2/designer/rev-sheet-d.jpg) |
| Map peek / tray | ![](eval/w2/designer/rev-map-m.jpg) | ![](eval/w2/designer/rev-tray-m.jpg) |
| Saved | ![](eval/w2/designer/rev-saved-m.jpg) | ![](eval/w2/designer/rev-saved-d.jpg) |
| Night / Chinatown / method | ![](eval/w2/designer/rev-tokyo-dark-m.jpg) | ![](eval/w2/designer/rev-method-d.jpg) |
| W2 component spec | ![](eval/w2/designer/w2-components-m.jpg) | ![](eval/w2/designer/w2-components-d.jpg) |
| R1 → W2 (designer slice) | ![](eval/w2/designer/r1-sheet-m.jpg) ![](eval/w2/designer/w2a-sheet-m.jpg) | ![](eval/w2/designer/r1-landing-d-s1.jpg) ![](eval/w2/designer/w2a-landing-d-s1.jpg) |

## Fixes sent back (also in docs/BETA-LOG.md)

- **FE-A:** pin-label declutter (#6); Cleveland ★ from `guide.signature` (#10); saved covers + native spacing + numbering (#7);
  day spine through leg text, mini plates, sentence-case eyebrow, one planner (#5); tighter source-chip wrap (#4); use `.because` (#2).
- **FE-B / PLT / imagery:** landing 83 KB > 80 KB budget (npm test red on origin since `aa7b3cc`); OG images (#9); DOM ≤ 3,000 (#9).
- **Imagery:** keep masthead motifs clear of the facts text on phones.
- **Upstreaming:** FEB_CSS / fe-a.css stay lane-owned this wave (they are still moving); designer folds them into cleo.css in W3.
