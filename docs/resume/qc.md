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
- P-24 probe (no silent caps) plus the P-26 probe fix: this push.

## Next

1. P-24 is done (see Done). It is first measured for real on the next pass.
2. **Re-pass**, when the orchestrator pins "QC pass at <sha>" or a lane claims a QC fix:
   - check out the SHA in a clean worktree (`git worktree add --detach <dir> <sha>`, symlink `tools/node_modules`);
   - run `NODE_PATH=$(npm root -g) node beta/qa/qc.js --label <sha>` (≈ 70 min for all groups; `--only` narrows it);
   - then `node beta/qa/qc-evidence.js --label <sha>`;
   - update the QC rows' status: `verified` only on a pinned SHA, with the probe and the result.
3. Commit only the outputs' `qc.json`, `summary.md` and the evidence shots, not the per-state run shots (≈ 80 MB).

## In flight

Nothing unpushed. No long run in progress. Waiting on the lanes' QC fix claims and the orchestrator's next pinned head.

## Notes

- The harness has known artefacts, already handled. Don't re-file:
  - S-06: a label hidden by text-indent;
  - S-11: the sliding switcher indicator, the same as QA-66;
  - S-15: the search ring sits on its wrapper;
  - `content-visibility` cards (read `textContent`);
  - smooth scroll during Tab.
- An S-11 FAIL needs a look at a screenshot before it is filed.
- Map view not in the hash is **PANEL-R1-#13**, and data-label casing is **OWNER-casing**: reference them, don't re-file.
- `QC-11` extends PERF-06.
- The QA lane (`session_017FLWXa5zgGWvqNo4C3UsvH`) keeps the register: append only QC rows, 7 columns, escape `|`
  as `\|`.
- Reports go to the orchestrator `session_01PCNcUkfa5S1N1BKGzZA4xx`: counts by severity and lane, the top 10, and
  any Blocker or High at once.
