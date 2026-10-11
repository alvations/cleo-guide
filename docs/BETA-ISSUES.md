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
| PERF-01 | BETA-PERF-AUDIT | `npm test` wall 392 s serial → parallel pool of the same 13 suites | platform | fixed (claimed) | fc861679 | probe: `npm test` timing table (110–154 s) |
| PERF-02 | BETA-PERF-AUDIT | Build 5.6 s / `beta:check` 5.3 s, deterministic — measured, no change | platform | stated gap (no change needed) | — | `npm run beta`, `beta:check` |
| PERF-03 | BETA-PERF-AUDIT | INP collection filter (Tokyo, 4× CPU) 960/1,064 ms → ≈ 450–520/580 ms (one batched `cleo:stamped`) | platform | in progress (rest = PERF-08) | fc861679 | `npm run beta:perf` inp rows |
| PERF-04 | BETA-PERF-AUDIT | First "open a place" download 104 KB → 14 KB gzip (`data/links/<page>.json`) | platform (+ FE-A sheet.js) | fixed (claimed) | fc861679 | test-beta "data/links … == the page dataset"; browser fetch list |
| PERF-05 | BETA-PERF-AUDIT | CI: npm/Playwright caches; fetch-unsplash skips rebuild when nothing new (was 4 m 58 s of 5 m 55 s) | platform (orchestrator owns workflows) | fixed (claimed) | fc861679 | next Actions run step timings |
| PERF-06 | BETA-PERF-AUDIT | CLS Gallery phone 0.29–0.34 (rail/toolbar revealed by JS; rows built client-side) | FE-A | open | — | `npm run beta:perf` load rows |
| PERF-07 | BETA-PERF-AUDIT | CLS Atlas first load desktop 1.05–1.57, phone 0.18 (layout keyed on classes added after load) | Atlas lane | open | — | `npm run beta:perf` load rows |
| PERF-08 | BETA-PERF-AUDIT | INP switch to Atlas phone ≈ 1.6 s / desktop ≈ 0.5 s; filter ≈ 0.5 s (lens stamps every card; msArea stamps the area) | Atlas lane + FE-A + platform | open | — | `npm run beta:perf` inp rows |
| PERF-09 | BETA-PERF-AUDIT | LCP ≤ 1.2 s on every page/viewport at 4× CPU (local, rendering share) | platform | meets target | — | `npm run beta:perf` load rows |
| PERF-10 | BETA-PERF-AUDIT | Font preload tried: landing LCP worse (372→620 ms phone) — reverted | platform | won't fix (measured worse) | — | `beta:perf` before/after in the audit |
| PERF-11 | BETA-PERF-AUDIT | CSS after prune: cleo 193.7 KB / 34 KB gz; lane sheets 1.6 KB dead (reported) | platform | stated gap (no change) | e83b6cc3 | `css-dead.py`, test-beta cleo.css budget |
| PERF-12 | BETA-PERF-AUDIT | Data payloads (places 2.2 MB gz lazy, search 205 KB gz lazy, share cards unfurl-only) — measured, compact | platform | stated gap (no change) | — | sizes in the audit |
| PERF-13 | BETA-PERF-AUDIT | SW cache keyed by build hash wipes offline cities on every deploy | platform (W9-8) | open | — | to add: offline-pack survives a rebuild test |
| PERF-14 | BETA-PERF-AUDIT | Phone @3× photos: Tokyo first load 930 → 590 KB; no 960w in < 200 px slots | platform + imagery | fixed (claimed) | e83b6cc3 | `npm run beta:qa:w8p` |
| PERF-15 | BETA-PERF-AUDIT | Eager JS 40.45 → 27.4 KB gzip; #p= deep link 12,459 → ≈ 2.2 k nodes | platform | fixed (claimed) | eb47e76 | test-beta budgets; `beta:qa:w8p`/perf probes |
