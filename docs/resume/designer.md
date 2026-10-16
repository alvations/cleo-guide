# Designer (W7) checkpoint

- **Branch:** `claude/peaceful-goodall-i0hsrt`
- **Orchestrator:** session_01PCNcUkfa5S1N1BKGzZA4xx
- **Lane session ids:** in `docs/BETA-RESUME.md`
- **Updated:** 2026-10-16

## Task

The designer owns three things:
- design system v2: `design/beta/tokens.css`, the `design/beta/css/{contract,views,v2}.css` base layer and `beta/assets/constellation.css`, all built into `beta/assets/cleo.css` by `design/beta/tools/build-css.py`;
- the Atlas spec, `design/beta/atlas/SPEC-v3.md`;
- the casing rule, in `design/beta/casing/`.

Current rows:
- **QC-14** (spacing on the 4-pt scale): the designer files are done. The lanes run the tool after their own priority rows.
- **QC-09** (phone view switcher): the spec is written; FE-A builds it.
- **FE-A food covers** (W8 gap 5): reviewed and signed off with three changes.
- **Atlas review loop**: SPEC-v3 rev 4 folds in PANEL-R2 (70.9). FE-1 and FE-2 are building it toward panel round 3.

## Done (SHAs)

- **QC-14:** 82946f4f (merge). 240 values snapped and 521 tokenised in the designer CSS. The tool is `design/beta/tools/snap-spacing.py`.
- **QC-09 spec, switcher selectors and `--cover-food`/`--cover-sight` tokens:** d90233b8 (merge). The spec is DESIGN-SYSTEM §v2.11.
- **Food-cover review:** sent to the orchestrator, who relayed it to FE-A. The three changes:
  - use `var(--cover-food)`;
  - cap the cover word at `--fs-d2`;
  - the cover word is never a source name, and it never repeats the kind line.
- **SPEC-v3:**
  - rev 4 (PANEL-R2): b22d544e
  - rev 3 (PANEL-R1): 55a43890
  - rev 2 (PANEL-R0): cd327e9f
  - §10 one-up: 195c41ea, 4e9e2051
- **Tokens:** tracking and ring tokens in 8ca6dea6.
- **Views SPEC §3.4 Insights link rule** (plain bars for measures, footnote why, W9-1 recognised chart): f0497626. QC was told.
- **QC-09 verification and the corrected < 300 px spec:** 7878c6f1.

## Next

1. **QC-14 follow-up.** Re-measured on 2026-10-16 with snap-spacing.py:
   - fe-a.css: 0 off-scale (287240c2).
   - fe-b.css: 0.
   - fe-c-trip.css: 0.
   - designer CSS: 0.
   - **Only atlas.css is left: 43 off-scale** (FE-1, after rev 5). When it's 0, tell R7 QA (session_017FLWXa5zgGWvqNo4C3UsvH) that QC-14 is ready.
2. **PANEL-R3 (80.7) folded into SPEC-v3 rev 5:**
   - no sun on dots or pills;
   - light circle vs dark square, with a sign-off on real shots;
   - the glyph nouns and `glyph-overrides.json`;
   - phone chips: Area, no counts;
   - the desktop switch inside the 56 px header;
   - no rank badges and no "pin N".

   FE-1 and FE-2 have been briefed. **Next:** when a new head lands, the designer signs off on `real/R4/tokyo-390-light-1-default.jpg` dots; then send the panel "round 4 ready" through FE or the orchestrator. Remind FE-A about the "Numbers on the cards match the pins" copy.
3. **QC-09: closed.** R7 QA verified it independently on adfb052d. QC-06 (768 px, 44 px segments) was verified with it.
5. **FE-C review (W9-4/5/7): signed off** on 70060b332. All ten findings are fixed. The base `.caveat` is now sand, `--ink-3` icon, 14 px, so the estimate note reads as a note, not a warning.
6. **FE-A reviews (2026-10-16):**
   - **QA-67 detail media:** ≥ 800 w approved. Narrow copies drop the colour-mix bands, and the plate is image-width, centred.
   - **Detail numbering confirmed:** drop "pin N" and the nav "k of N"; keep "No. k of n". FE-A logs the spec change in BETA-LOG.
   - **Food covers (6edb6acb):** OK, except the fallback. The area is not a cover word, so use the cuisine, else a glyph-only cover. V2.21 applies `--cover-food` in the base layer.
7. **PERF-16:** all 8 html-, body- and :root-anchored `:has()` rules in the designer CSS are replaced.
   - `html[data-cleo-page=city]` for the backgrounds and the guidebook hide.
   - `.stamp.stamp-in` for the stamp.
   - `html[data-vx]` for the view cross-fade, which needs views.js (FE-A) to set `data-vx` for about 300 ms on a switch.
   - Platform: remove the 7 entries from the allowlist.
8. **QA-74 and QA-55** (2026-10-16):
   - Motion: `--dur-3` is 280 ms; `--dur-grow` and `--dur-pop` are 300 ms.
   - Every one-shot moment is now ≤ 300 ms. Bob, ring, sheen, stamp, pop and door point at `--dur-pop`.
   - Spring easing is used only for the heart and save pops; the looping tile twinkle is removed.
   - Insights `.fn` footnotes are now `--fs-sm` (14 px).
   - QA has been told.
4. **Reconcile SPEC-v3 §10** with `design/beta/eval/ONE-UP.md` when the product lane lands it.

## In flight

- Nothing. The full `npm test` passed on 82946f4f (exit 0, no FAIL). Nothing is unpushed.

## Notes

- **Gates before every push:** `cd tools && npm run validate && npm test && npm run beta:check`. Rebuild with `python3 design/beta/tools/build-css.py` and `npm run beta` after any CSS change.
- **Merge conflicts in `beta/`:** take theirs, then rebuild.
- **Root-scoped tokens only.** A custom property declared on `:root` that reads a per-element variable (`--ac`, `--acq`, `--area`) resolves at `:root` and breaks, so those values stay raw.
- **Rule 6:** no brand names in anything committed.
- **Commit trailer:** the Co-Authored-By line plus `Claude-Session: https://claude.ai/code/session_01PCNcUkfa5S1N1BKGzZA4xx`.
- **Panel contact:** only "round N ready" notices. Never send targets or ask for scores.
