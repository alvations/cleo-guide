# QC lane checkpoint

**Lane:** QC (melon-seek-style UI/UX and experience QA/QC). Owns `docs/BETA-QC.md`, the QC-NN rows in
`docs/BETA-ISSUES.md`, `design/beta/eval/qc/**` and `tools/beta/qa/qc*.js`. Audits only: never edits product code and
never weakens a gate.

## Task

- Re-verify QC-01…QC-14 on a pinned SHA as lanes report fixes. Record each in BETA-QC.md and in the register's
  verification column: pinned SHA, probe, result.

## Done

- `4db273ed`: phase 1, the checklist and the harness.
- `129eff6b`: baseline pass on `f2c39d69` + `b5f0afa1` (QC-01…14).
- `bb887a7f`: P-24 probe. `2ed1ddce`: re-verify on `2bfff3fe` (QC-01, 02, 03).
- `48cf146d`, `91fb6634`: checkpoints; harness P-10 `at=` and the place-link selector.
- This push: **pass on `530dc83b`** plus supplementary `639d2b1b` patterns.
  - Verified: QC-06, 07, 08, 09. QC-01, 02, 03 hold. QC-10 is verified on 639d2b1b only.
  - New: QC-15…20.
  - Outputs in `design/beta/eval/qc/{530dc83b,639d2b1b}/`.

## Next

1. QC-10: set it `verified` on the next pinned head that contains 78e4ab74 (patterns P-03, 5 pilots).
2. Re-verify QC-04, 05, 11, 12, 13, 14 and 15…20 as lanes claim fixes, with only the relevant groups:
   - P-xx → `--only patterns`;
   - J-xx → `--only journeys`;
   - S-xx → `--only sweep --vps …`;
   - QC-15…20 → `qc-evidence.js --only qc-15,…` plus the exploration script logic recorded in BETA-QC.md.
3. For each pass: a clean worktree on the pinned SHA, then commit only `qc.json`, `summary.md` and the evidence.

- `f7fa616d`: QC-16 verified; new QC-21 (Low, i18n); QC-18 observed fixed (unclaimed).
- `a498adf5`: QC-21 verified.
- `995e2529`: QC-18 and QC-20 verified; QC-19 still open (2 Cleveland records); new QC-22 (Low).
- `8f21eda9`: QC-10, 15, 17 and 19 verified; QC-22 still open; new QC-23 to QC-26 (W9-1 recognition pass plus the QC-26 regression).
- `9c133152`: QC-23 and QC-24 verified.
- `4aba38b3` (deploy pin): QC-26 and QC-22 verified; new QC-27 (Low, i18n: tier translated as 評価).
- `3a0ecfec`: QC-11 and QC-12 verified (S-12 all 91 pages at 390, 768 and 1440).

## In flight

Nothing unpushed and no long run. Waiting on lane claims and the next pin.

Next harness work:
- P-25 and P-26 must discount entries that carry the D-42 note.
- P-13 and P-15 must open the phone Atlas "Show list" before measuring.
- J-10 and J-11 should also run under `?lang=ja`.

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
