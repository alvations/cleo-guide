# Beta issue register and audit trail

Owner request (2026-10-11 20:50Z): *"Fix all the issues! And then run the melon-seek style UI/UX and experience QA QC and all the backend and application front end optimization and keep the audit trail on all of them"*.

This file is the **single register of every open beta issue**, whatever its source:
- QA findings (`docs/BETA-QA.md`);
- the independent evaluator's gaps (`design/beta/eval/ROUND-*.md`);
- the Atlas panel's findings (`design/beta/atlas/PANEL-R*.md`);
- owner requests;
- W8/W9 briefs;
- the melon-seek-style UX QA/QC (`docs/BETA-QC.md`);
- the optimization audit (`docs/BETA-PERF-AUDIT.md`).

Each row is one issue. Detail stays in the source document; the register only links to it.

## Rules (the audit trail)

1. **One row per issue.** It holds:
   - a stable id (QA-NN, R7-gN, PANEL-Rn-#N, OWNER-x, W8-…, W9-N, QC-NN, PERF-NN);
   - the source document;
   - a one-line summary;
   - the owning lane;
   - the status;
   - the fix commit(s);
   - the verification.
2. **Statuses:**
   - `open`;
   - `in progress`;
   - `fixed (claimed)`: the owner pushed a fix and named the commit;
   - `verified`: an independent checker (QA, QC or the panel, never the lane that fixed it) re-ran the acceptance on a pinned SHA and recorded the evidence;
   - `won't fix (owner)`: only with an owner decision;
   - `stated gap`: an honest limit, with the reason.
3. **No status moves without evidence.** "Fixed" needs a SHA. "Verified" needs the pinned SHA, the probe or test that ran, and its result.
4. **The register is append-friendly.** Rows are never deleted; superseded rows point to their successor.
5. **Each round's QA sign-off** lists the register state it was given on: open High and Blocker count = 0.

## Register

The QA lane builds and keeps this table from every source listed above, starting with the R7 QA findings (QA-45…59), the R7 evaluator gaps (R7-g1…g7), PANEL-R0/R1, the owner's casing request and W8/W9.

| Id | Source | Summary | Owner | Status | Fix commit(s) | Verification (pinned SHA · probe · result) |
|---|---|---|---|---|---|---|
| … | | | | | | |
