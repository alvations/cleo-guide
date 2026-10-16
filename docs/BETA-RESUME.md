# Beta: how to resume (orchestrator checkpoint)

This file is the single place to restart the beta program after a stop: a usage limit, a lost container or a new
session. The orchestrator rewrites it at every check-in, at least every 30–45 min. Each lane keeps its own
checkpoint in `docs/resume/<lane>.md` (see [docs/resume/README.md](resume/README.md)). The full history is in
`docs/BETA-LOG.md`, the session table is `docs/AGENT-LEDGER.md`, and the issue register is `docs/BETA-ISSUES.md`.

**Last updated:** 2026-10-16 15:40Z by the orchestrator (session_01PCNcUkfa5S1N1BKGzZA4xx).

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
- The Atlas map panel ≥ 95. R0 56.1 → R1 63.8 → R2 70.9 → **R3 80.7** (at 537cfb8c).
- Fix all issues, with the melon-seek-style UX QA/QC and the optimization audit, keeping the audit trail
  (`docs/BETA-ISSUES.md`, `docs/BETA-QC.md`, `docs/BETA-PERF-AUDIT.md`).
- The owner delegated decisions: "You decide; if you're asking for permissions then I say just yes".
- Push and compile often, so a limit stop loses little.

## Deploy gate (now)

- **The candidate 530dc83b is NO** (QA 566d606e, 15:05Z). QA-69 and QC-01 are verified, and open High is 0. Two Med regressions against be74c82f block the re-sign:
  - **QA-70** (the phone Gallery map open is about 1.5 s slower; the B-07 pin step fails on Tokyo/NY).
    - Cause, bisected by both FE-2 and platform: 7e746d9b, FE-B's switcher CSS. **Four** `:has()` rules on `<main>` in fe-a.css (197–198 and 201–202) are re-checked on every mutation in main.
    - Fix (FE-2, briefed 15:33Z): key them on `main[data-views-on]` and `main[data-overlay-on]`, attributes the script sets. Platform measured Tokyo with all four removed at 1,666 ms, against 1,654 ms on be74c82f.
    - Platform lands a `:has()` lint right after, with a shrink-only allowlist for 7 cleo.css selectors (PERF-16, the designer's).
  - **QA-71** (the carousel swipe after the `#p=` round trip): FE-2 has it green locally and is confirming the probe catches the bug.
- **Next:** when FE-2 pushes (both fixes, or QA-71 first), verify the SHAs and gate the head, then pin it. QA runs a delta re-sign: time to first pin, the swipe after a round trip, Gallery B-07 twice, and the touched rows. FE-2 suggests B-07's fixed 900 ms wait should poll up to about 3 s; that is QA's call.
- Not blocking: QA-61 and QA-68. QA-67 is fixed (f08f892d).
- **On YES:**
  1. `git push origin <sha>:refs/heads/beta-deploy-r7`;
  2. a PR into `claude/cleveland-page-creation-pant4l`. The live branch is still 9f54587d (R5 follow-up), and the pin merges cleanly (merge-tree checked on 530dc83b);
  3. merge with `expectedHeadSha` = the full SHA;
  4. a `docs/BETA-CHANGELOG.md` entry;
  5. give the owner https://alvations.github.io/cleo-guide/beta/.
- **After the deploy:** launch the R8 independent evaluator (template: the R7 evaluator brief; baseline R7 badcc20d).

## In flight

| What | State | Next |
|---|---|---|
| Imagery | All 32 run #48 refusals applied. Run #52 (`all`) yield collapsed to about 4%, so no more plain `all` runs (orchestrator, 15:27Z). Candidate wave 1 (cb5dfd79): 20 vetted titles for 10 empty leads and first-row slots, and 6 stated gaps. Push run #54 is running. D-40a: the 720w leads are capped at 45 KB; Tokyo phone@3× is 607 KB | Imagery contact-sheets #54 and sends only the "?" rows. Wave 2 is about 40 targets from the guides with the lowest tier-1 share |
| Location verification | Accepted today: Wheeling 7, SF 112, Orlando 7, Chicago 48, DC 38, Miami 2, Erie 27, Philadelphia 25. Beta is at 8,704 places. The assist rules now treat Wikipedia as not independent of Wikidata, add a moved-place guard, hold extended features, and send closed places to review. Singapore (run 22) is in flight | Review Singapore when it commits. Then the 4-row Wikidata re-check (the workflow's re-check mode, a74735f4: SF then Orlando), then `--duplicates` (open plus CLOSED pairs in 4 cities), then Saarland, Okinawa, Rhineland, Aachen |
| Atlas panel | **R3 80.7** (min 74.0, SD 2.86) at 537cfb8c; R0 56.1 → R1 63.8 → R2 70.9 → R3 80.7. SPEC-v3 rev 5 (46f4abe3) | FE-1 and FE-2 build rev 5 toward R4, after QA-70/71. The designer signs off the dots on real shots before "round 4 ready" |
| QC | 20 rows: verified 7 (01, 02, 03, 06, 07, 08, 09); QC-10 fixed, verified on 639d2b1b; open 12 (Med 9, Low 3, High 0). QC-15 → FE-C; QC-16 → i18n (fixed 7bd091cd, claimed); QC-17 → FE-1 with FE-C; QC-18 → FE-B; QC-19/20 → FE-B under D-42 | QC re-verifies on the next pin |
| Perf | PERF-06 landed (bcf94510). QA-70 is the `:has()` cause; PERF-16 is the designer's cleo.css selectors | Platform: re-measure QA-70, the `:has()` lint, then the PERF-08 FE parts, PERF-14, and the "1 closed places" plural |

## Lanes

| Lane | Session | Current task | Checkpoint file |
|---|---|---|---|
| QA, register keeper | session_017FLWXa5zgGWvqNo4C3UsvH | waiting for the QA-70/71 pin; the delta re-sign | docs/resume/qa.md |
| QC | session_01MYsz5PHtY39stLxc8rMmqj | re-verify on the next pin | docs/resume/qc.md |
| FE-A | session_0192s7fEFwRUZrw5ocAEJn9G | §3.6 one numbering (with the designer), QC-11 (768 CLS), QC-14 snap-spacing on fe-a.css | docs/resume/fe-a.md |
| FE-B | session_01BpzJesL1sQZFU5ZfBQtcNG | D-42 (QC-19/20: quoted.js hours and ratings, the note, the sheet line), QC-18 | docs/resume/fe-b.md |
| FE-C | session_01SxU3Mdpo1UAQyJQJmnMFtG | QC-15 (base focus/Esc), the designer's (a)–(j), then W9-1, W9-9 | docs/resume/fe-c.md |
| Platform | session_01USPS1inq7bUDfyw89evKMA | QA-70 re-measure, the `:has()` lint, PERF-08 FE parts, PERF-14 | docs/resume/platform.md |
| Atlas FE-1 | session_01Cuvo7DWhwbWjLpFicvaF5E | SPEC-v3 rev 5 (#1–#6), QC-17, the .ms-bar switcher, QC-04/05/13, atlas.css snap | docs/resume/atlas-fe1.md |
| Atlas FE-2 | session_011SQNDyJMGzR5K32A4y9Udd | **QA-70 + QA-71 (deploy blockers)**, then rev 5 #7 (the 108 px shift) and #8 (stale counts) | docs/resume/atlas-fe2.md |
| Designer | session_011YjA2jku166RJrUyCiQV6B | dot sign-off on R4 real shots, FE-C re-review, FE-A frame sign-off, PERF-16 | docs/resume/designer.md |
| Panel (scores only; never tell it a target) | session_01EKzwLjqF1Z1gwXWgbrrr2S | waiting for "round 4 ready at <sha>" | docs/resume/panel.md |
| Imagery | session_011rg9RMooGaKrmENvBZ7MvX | vetted-candidate waves (WebSearch, about 40 per wave); run #54 review | docs/resume/imagery.md |
| i18n | session_01HB7igqdcuhrau7mUWSauDL | all lanes catalogued; review rounds on new keys; QC-16 | docs/resume/i18n.md |
| Location verify | session_012FeQJjTmiN2MXYQWwe55J2 | Singapore, the Wikidata re-check, `--duplicates` | docs/resume/location-verify.md |

## Standing rules

All of CLAUDE.md applies, plus rule 6 (no third-party travel, booking, review or fashion brand names), sentence case, no
CDN for content, OSM/Esri tiles only, and localStorage in try/catch. Never force-push or rewrite history. Push loops
gate on the npm test exit code and verify the push with ls-remote. Never run two `npm test` at once in one container: each
runs 4 jobs, and the contention fails test-honesty and test-views spuriously (seen 15:00Z; each passed alone). The orchestrator owns `.github/workflows/*`.
