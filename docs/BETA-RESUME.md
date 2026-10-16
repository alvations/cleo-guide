# Beta: how to resume (orchestrator checkpoint)

This file is the single place to restart the beta program after a stop: a usage limit, a lost container or a new
session. The orchestrator rewrites it at every check-in, at least every 30–45 min. Each lane keeps its own
checkpoint in `docs/resume/<lane>.md` (see [docs/resume/README.md](resume/README.md)). The full history is in
`docs/BETA-LOG.md`, the session table is `docs/AGENT-LEDGER.md`, and the issue register is `docs/BETA-ISSUES.md`.

**Last updated:** 2026-10-16 13:50Z by the orchestrator (session_01PCNcUkfa5S1N1BKGzZA4xx).

## Resume in five steps

1. `git pull --no-rebase origin claude/peaceful-goodall-i0hsrt`, then read this file and `docs/resume/*.md`.
2. Run `cd tools && npm install && npm run validate && npm test && npm run beta:check`. If anything is red, fix it
   first; a red head blocks every lane.
3. Check what landed while stopped:
   - `git log --since=<last update> --no-merges`;
   - the Actions runs (beta-fetch-unsplash, location-verify, beta-atlas-real-shots);
   - for every claimed SHA, `git merge-base --is-ancestor <sha> origin/claude/peaceful-goodall-i0hsrt`.
4. Wake each lane with one message: "resume from docs/resume/<lane>.md". Lane sessions are in the table below.
5. Re-arm the check-in trigger `trig_01UKDExPpCFXupkoice8CwHo` (run_once_at about 30–45 min ahead).

## Goals (owner)

- The overall independent review ≥ 98. Last measured: R7 88.5 at badcc20d. The R8 evaluator runs after the next deploy.
- The Atlas map panel ≥ 95. R0 56.1 → R1 63.8 → **R2 70.9** (at 40e15601).
- Fix all issues, with the melon-seek-style UX QA/QC and the optimization audit, keeping the audit trail
  (`docs/BETA-ISSUES.md`, `docs/BETA-QC.md`, `docs/BETA-PERF-AUDIT.md`).
- The owner delegated decisions: "You decide; if you're asking for permissions then I say just yes".
- Push and compile often, so a limit stop loses little.

## Deploy gate (now)

- **Step 1:** QA runs the R7 re-sign rows on the pinned **`be74c82f2680009c726ac8ac54731ef97773dfb8`**. validate, npm
  test and beta:check are green on it.
- **Step 2:** **QC-01 (High, FE-B)** is the only open High, and it blocks a YES. When FE-B pushes the fix:
  1. pin a new head that contains it;
  2. QA verifies QC-01 plus a delta check (the gates, plus any re-sign row whose files changed between the SHAs);
  3. YES/NO on that head.
- **On YES:**
  1. `git push origin <sha>:refs/heads/beta-deploy-r7`;
  2. a PR into `claude/cleveland-page-creation-pant4l`;
  3. merge with `expectedHeadSha` = the full SHA;
  4. a `docs/BETA-CHANGELOG.md` entry;
  5. give the owner https://alvations.github.io/cleo-guide/beta/.
- **After the deploy:** launch the R8 independent evaluator (template: the R7 evaluator brief; baseline R7 badcc20d).
- **Decided 13:50Z:**
  - D-40 option (a): lead and first-row cards get a 720w copy, ≤ 55 KB, with Tokyo phone@3× staying ≤ 700 KB;
  - QA-67: fixed in layout (the detail slot takes the source width), with no 1280w fetch;
  - the grandfathered PNG leads are kept.

## In flight

| What | State | Next |
|---|---|---|
| Imagery `all` | dispatched 13:36Z, budget 1200; about 500 targets left before this run | Contact-sheet every new photo, send refusals, then dispatch again |
| Location verification | Wheeling 7 and SF 112 accepted; Orlando run (22 pins); Chicago REQUEST queued | The lane commits each city's report; the orchestrator reviews and runs `--accept`, rebuild and gates |
| Atlas panel | R2 70.9; the designer's SPEC-v3 rev 4 (e08a64b2) | FE-1 and FE-2 agree the R3 head, then "round 3 ready at <sha>" to the panel |
| QC | 14 findings (QC-01 High), routed | QC re-verifies as fixes land |
| Perf | PERF-01/03/04/05/13 fixed; PERF-06 released 13:36Z; PERF-08 core inert | Platform applies PERF-06, then the PERF-08 FE parts |

## Lanes

| Lane | Session | Current task | Checkpoint file |
|---|---|---|---|
| QA, register keeper | session_017FLWXa5zgGWvqNo4C3UsvH | R7 re-sign at be74c82f | docs/resume/qa.md |
| QC | session_01MYsz5PHtY39stLxc8rMmqj | re-verify QC-NN | docs/resume/qc.md |
| FE-A | session_0192s7fEFwRUZrw5ocAEJn9G | QA-59a, QA-61, QC-06/07/08/09/11 | docs/resume/fe-a.md |
| FE-B | session_01BpzJesL1sQZFU5ZfBQtcNG | QC-01 (High), QC-02/03/10 | docs/resume/fe-b.md |
| FE-C | session_01SxU3Mdpo1UAQyJQJmnMFtG | recover `work-fec` onto the branch; W9-5, W9-7 | docs/resume/fe-c.md |
| Platform | session_01USPS1inq7bUDfyw89evKMA | PERF-06, then the PERF-08 FE parts | docs/resume/platform.md |
| Atlas FE-1 | session_01Cuvo7DWhwbWjLpFicvaF5E | SPEC-v3 rev 4 §2.1–2.4, QC-04/05/13 | docs/resume/atlas-fe1.md |
| Atlas FE-2 | session_011SQNDyJMGzR5K32A4y9Udd | PANEL #1 round-trip and deep link, #4 near me | docs/resume/atlas-fe2.md |
| Designer | session_011YjA2jku166RJrUyCiQV6B | QC-14, the QC-09 spec, the food-cover sign-off | docs/resume/designer.md |
| Panel (scores only; never tell it a target) | session_01EKzwLjqF1Z1gwXWgbrrr2S | waiting for R3 | docs/resume/panel.md |
| Imagery | session_011rg9RMooGaKrmENvBZ7MvX | `all` runs and refusals | docs/resume/imagery.md |
| i18n | session_01HB7igqdcuhrau7mUWSauDL | QC-12, then the city-page ja strings | docs/resume/i18n.md |
| Location verify | session_012FeQJjTmiN2MXYQWwe55J2 | city reports (commit=true) | docs/resume/location-verify.md |

## Standing rules

All of CLAUDE.md applies, plus rule 6 (no third-party travel, booking, review or fashion brand names), sentence case, no
CDN for content, OSM/Esri tiles only, and localStorage in try/catch. Never force-push or rewrite history. Push loops
gate on the npm test exit code and verify the push with ls-remote. The orchestrator owns `.github/workflows/*`.
