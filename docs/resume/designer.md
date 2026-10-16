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

## Next

1. **QC-14 follow-up.** FE-B is done: fe-b.css 38f57e81, and a re-run of the tool finds 0. FE-A (fe-a.css, 118) and FE-1 (atlas.css, 42) were asked to run `python3 design/beta/tools/snap-spacing.py <file>` *after* their priority rows. Re-measure each lane's file when it pushes. Once all three are at 0, tell the R7 QA lane (session_017FLWXa5zgGWvqNo4C3UsvH) that QC-14 is ready to verify.
2. **When PANEL-R3 lands** (`design/beta/atlas/PANEL-R3.md`):
   - fold the findings into SPEC-v3 §9 plus the affected sections;
   - commit with the finding ids in the message;
   - brief FE-1 (layout, pins, chrome, list) and FE-2 (round-trip, near-me, URL, keyboard);
   - send the panel only "round N ready at <sha>", through FE or the orchestrator.
3. **Verify FE-A's QC-09 build** against §v2.11's acceptance:
   - 4 segments at 390 and at 200 %;
   - `role=group`;
   - with a sheet open, elementFromPoint at each segment returns that segment.
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
