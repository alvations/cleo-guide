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
- `9fba196e`: QC-27 verified.
- `dev cceabd64` (FE-C heads-ups): QC-05 holds under the single Atlas empty state; S-05 now runs in every view; W9-2 date line is search-safe; new QC-34 (Low, FE-B: Guidebook Contents ignores the lens).
- `r7-b54b3745` (final release pin): PASS. Sweep 4 FAIL = filed QC-30/31; S-16 91/91; leaks 0; m.not.p en/ja; QA-77 badges ≥ 44 px, 0 in-view overlaps, no shift. New QC-33 (Med): Guidebook/Insights deep-link CLS ≈ 0.5 at 1440, pre-existing.
- `r7-33a44d16` (release): QC-29 verified (S-16 91/91); every sweep FAIL accounted for: S-15 and part of S-08/S-01 were probe bugs (fixed in 6a93f81d); new QC-30 (casing ownWords), QC-31 (raw colours/radii), QC-32 (prov sidecar notes). Clean sweep: 4 FAIL, all filed.
- `r7-19af6d81` (release branch pre-check): FE-B leaks PASS; m.not.p en/ja PASS; QC-28 PASS; S-16 FAIL on 4 pages → new QC-29 (ports 9fa622096 + 5d3dc9850 missing).
- `7857f885`: QC-04 verified (D-43 approximate pins).
- `cc127fb1`: QC-28 verified (S-16 91/91; TODO/FIXME now case-sensitive).
- `edf94546`: new sweep check S-16 (internal editorial phrases, incl. deferred cards); QC-28 (Low, data: Erie "Kept flagged").
- `e353df08`: QC-05 verified. P-17 follows D-43 (approximate pins); QC-04 waits on FE-C's SHA.
- `e1503766`: QC-25 verified (city pages). Pending: FE-B's "What changed" pages and how-we-choose D-42 line, to re-check when FE-B sends the SHA.
- `3a0ecfec`: QC-11 and QC-12 verified (S-12 all 91 pages at 390, 768 and 1440).

## In flight

**Owner directive: overlay audit.** `docs/BETA-OVERLAY-LEDGER.md` is QC's (Severity column for QA's B-25; 7 cells per row; S-17 rows OV-100+).
- **Dev S-17 audit RUNNING** on ecff47c0e (resumed 10:29Z after the usage-limit stop). Label `dev-ecff47c0`, worktree `scratchpad/qc-dev-ecff47c0`, log `scratchpad/ov-dev3.log`. The probe has all fixes:
  - chrome = fixed layers + sticky bars ≥ 60 % of the frame;
  - sheet bands are measured inside the dialog;
  - controls are shown only inside every clipping ancestor;
  - one search per form;
  - D-46 "default" cold-load runs.
- When it finishes:
  1. `node tools/beta/qa/qc-overlay-ledger.js --label dev-ecff47c0 --write`.
  2. Re-run r7 (`--root scratchpad/qc-b54b3745 --label r7-b54b3745-v2`), then `qc-overlay-ledger.js --label r7-b54b3745-v2 --write`.
  3. Run `qc-ov-verify.js` for FE-1 OV-02..07 (+ OV-03 labels from the audit), FE-B OV-107..110/121..123 (landing: 1 search, 1 "Your list"), FE-C OV-111/112 (sheet column; audit sheet rows).
  4. Send the orchestrator counts by owner with the SHA; the r8 pin depends on them.
- Already verified: OV-01/02/05/06/07 (c24dd319), OV-08/12/40 (046f2d7c), OV-09 (FE-A part)/11/30/31/32/33/34/35/36 (c14306d9). QC-35 verified.
- `npm test` under audit load is flaky in test-fe-a ("Back restores the search", "search spans every page"); alone it passes 133/133. Commits during audits say so in the message.

Next harness work:
- Add a Contents-vs-lens count check to the COUNTS probe (QC-34 class) once FE-B fixes it.
- Fold deep-link view CLS (qc-view-cls.js) into S-12 for city pages at 1440.
- P-25 and P-26 must discount entries that carry the D-42 note.
- J-10 and J-11 should also run under `?lang=ja`.

## Notes

- The harness has known artefacts, already handled. Don't re-file:
  - S-06: a label hidden by text-indent;
  - S-11: the sliding switcher indicator, the same as QA-66;
  - S-15: the wrapper ring is now handled in the probe (6a93f81d); a new S-15 FAIL is real;
  - `content-visibility` cards (read `textContent`);
  - smooth scroll during Tab.
- An S-11 FAIL needs a look at a screenshot before it is filed.
- The map view is now in the hash as `at=` (FE-2 closed **PANEL-R1-#13**; P-10 accepts `at=`). Before that it was PANEL-R1-#13, and data-label casing is **OWNER-casing**: reference them, don't re-file.
- `QC-11` extends PERF-06.
- The QA lane (`session_017FLWXa5zgGWvqNo4C3UsvH`) keeps the register: append only QC rows, 7 columns, escape `|`
  as `\|`.
- Reports go to the orchestrator `session_01PCNcUkfa5S1N1BKGzZA4xx`: counts by severity and lane, the top 10, and
  any Blocker or High at once.

### Checkpoint 2026-10-17 (after compaction)
- Round-4 views run `r4-75bb37bb-views` is in progress, log `scratchpad/ovR4b.log`. Sheet: 0 failing. Pages: search ×2 (FE-B) only. Gallery, Guidebook and Insights are pending. When it finishes: `qc-overlay-ledger.js --label r4-75bb37bb-views --views sheet,gallery,guidebook,insights --write`.
- FE-A 768 fix verified on 7de1297bd (OV-124/125, 0/56 runs).
- QC-36 filed: a count-line race makes npm test red under load (test-count-lines).
- Next: re-grade FE-B search ×2 when its SHA lands; r7 re-run with the corrected probe.
