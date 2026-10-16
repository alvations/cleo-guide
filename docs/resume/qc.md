# QC lane checkpoint

**Lane:** QC (melon-seek-style UI/UX and experience QA/QC). Owns `docs/BETA-QC.md`, the QC-NN rows in
`docs/BETA-ISSUES.md`, `design/beta/eval/qc/**` and `tools/beta/qa/qc*.js`. Audits only: never edits product code and
never weakens a gate.

## Task

- Re-verify QC-01…QC-14 on a pinned SHA as lanes report fixes. Record each in BETA-QC.md and in the register's
  verification column: pinned SHA, probe, result.

## Done

- `4db273ed`: phase 1, the checklist (`docs/BETA-QC.md` § Checklist, 55 checks) and the harness (`tools/beta/qa/qc.js`).
- `ab132670` (merged `129eff6b`): baseline pass on `f2c39d69` + `b5f0afa1`.
  - 14 findings (High 1, Med 9, Low 4), with QC rows in the register after QA-66 / QA-67.
  - Outputs in `design/beta/eval/qc/{f2c39d69,b5f0afa1}/`.
  - `tools/beta/qa/qc-evidence.js` for the evidence shots.
- `bb887a7f`: P-24 probe (no silent caps) plus the P-26 probe fix.
- This push: re-verify on `2bfff3fe`. QC-01, 02 and 03 are **verified**; QC-10 stays **open**. P-18 accepts plain bars that are stated in the footnote.

## Next

1. Open QC rows: 04, 05, 06, 07, 08, 09, 10, 11, 12, 13 and 14. Re-verify each when its lane claims a fix (only the relevant groups: patterns for P-xx, journeys for J-xx, sweep for S-xx).
2. **Re-pass**, when the orchestrator pins "QC pass at <sha>" or a lane claims a QC fix:
   - check out the SHA in a clean worktree (`git worktree add --detach <dir> <sha>`, symlink `tools/node_modules`);
   - run `NODE_PATH=$(npm root -g) node beta/qa/qc.js --label <sha>` (≈ 70 min for all groups; `--only` narrows it);
   - then `node beta/qa/qc-evidence.js --label <sha>`;
   - update the QC rows' status: `verified` only on a pinned SHA, with the probe and the result.
3. Commit only the outputs' `qc.json`, `summary.md` and the evidence shots, not the per-state run shots (≈ 80 MB).

## In flight

- **QC pass at `530dc83b`.** The worktree is in the scratchpad (`qc-530dc83b`).
  - Sweep 768/1440 is done: QC-06 verified (S-10 91/91); QC-12 open (S-12 9 pages at 1440); QC-11 open (768, max 0.48); QC-05 still reproduces (not claimed).
  - Patterns are running. Journeys are re-running with the place-link selector fix (the card's first link is now the tier badge to `#how-we-choose`).
- **New-feature exploration is done.** Draft findings:
  - QC-15: "Set as my base" drops focus to body, so Esc no longer closes the sheet.
  - QC-16: under `?lang=ja` the Insights view is English beyond the banner's stated scope.
  - QC-17: the phone Atlas carousel card clips the base-distance line by 8 px.
  - QC-18: under `ja` at 1440 the switcher indicator is offset 56 px from the pressed button.
  - Trips, near me, share cards and the `base=` / trip links round-trip and pass.
  - Scratch screenshots are in `ex/`.
- **Then:** file the re-verify results and QC-15…18, commit the outputs, and reply to the orchestrator with the SHA and counts.

## Notes

- The harness has known artefacts, already handled. Don't re-file:
  - S-06: a label hidden by text-indent;
  - S-11: the sliding switcher indicator, the same as QA-66;
  - S-15: the search ring sits on its wrapper;
  - `content-visibility` cards (read `textContent`);
  - smooth scroll during Tab.
- An S-11 FAIL needs a look at a screenshot before it is filed.
- The map view is now in the hash as `at=` (FE-2 closed **PANEL-R1-#13**; P-10 accepts `at=`). Before that it was PANEL-R1-#13, and data-label casing is **OWNER-casing**: reference them, don't re-file.
- `QC-11` extends PERF-06.
- The QA lane (`session_017FLWXa5zgGWvqNo4C3UsvH`) keeps the register: append only QC rows, 7 columns, escape `|`
  as `\|`.
- Reports go to the orchestrator `session_01PCNcUkfa5S1N1BKGzZA4xx`: counts by severity and lane, the top 10, and
  any Blocker or High at once.
