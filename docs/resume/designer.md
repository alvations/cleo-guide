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

1. **QC-14 follow-up.** FE-B is done: fe-b.css 38f57e81, and a re-run of the tool finds 0. FE-A (fe-a.css, 118) and FE-1 (atlas.css, 42) were asked to run `python3 design/beta/tools/snap-spacing.py <file>` *after* their priority rows. Re-measure each lane's file when it pushes. Once all three are at 0, tell the R7 QA lane (session_017FLWXa5zgGWvqNo4C3UsvH) that QC-14 is ready to verify.
2. **PANEL-R3 (80.7) folded into SPEC-v3 rev 5:**
   - no sun on dots or pills;
   - light circle vs dark square, with a sign-off on real shots;
   - the glyph nouns and `glyph-overrides.json`;
   - phone chips: Area, no counts;
   - the desktop switch inside the 56 px header;
   - no rank badges and no "pin N".

   FE-1 and FE-2 have been briefed. **Next:** when a new head lands, the designer signs off on `real/R4/tokyo-390-light-1-default.jpg` dots; then send the panel "round 4 ready" through FE or the orchestrator. Remind FE-A about the "Numbers on the cards match the pins" copy.
3. **QC-09 re-verify.** On 2026-10-16, against head 055e2e6d (build 7e746d9bc):
   - **390 px: PASS.**
   - **200 %: FAIL.** The segments are 29 × 44. The spec is now corrected to a 2 × 2 glyph-only grid under 300 px, and the fe-a.css rule went to FE-A and FE-B.
   - Re-run `scratchpad qc09.js`, or the same check: 195 px viewport at DPR 2, `#p=senso-ji`, segment sizes ≥ 44, and elementFromPoint on each segment.
   - On a pass, tell R7 QA (session_017FLWXa5zgGWvqNo4C3UsvH).
5. **FE-C review (W9-4/5/7).** Ten findings went to FE-C (session_01SxU3Mdpo1UAQyJQJmnMFtG) on 2026-10-16:
   - share-card initial and teal block;
   - coral Must-see;
   - the drifted COL palette and #C23A1C;
   - the wordmark;
   - the trip day stripe and purple;
   - the h1 focus ring;
   - casing;
   - the caveat on sun-wash;
   - spacing;
   - the base sort's pressed state.

   Re-review when FE-C sends new shots.
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
