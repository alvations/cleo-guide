# Beta: how to resume (orchestrator checkpoint)

This file is the single place to restart the beta program after a stop: a usage limit, a lost container or a new
session. The orchestrator rewrites it at every check-in, at least every 30–45 min. Each lane keeps its own
checkpoint in `docs/resume/<lane>.md` (see [docs/resume/README.md](resume/README.md)). The full history is in
`docs/BETA-LOG.md`, the session table is `docs/AGENT-LEDGER.md`, and the issue register is `docs/BETA-ISSUES.md`.

**Last updated:** 2026-10-16 18:52Z by the orchestrator (session_01PCNcUkfa5S1N1BKGzZA4xx).

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

- **The deploy candidate is pinned at `4aba38b3e15c83d40aafbed5f569aa30da5a074b`** (17:58Z). QA is running the delta re-sign (asked 17:58Z).
  - It carries the fixes for QA's NO on 3ba696e8:
    - PERF-08 switched off (platform afb09e74b), which clears QA-75, QA-76 and QC-26;
    - QC-26 fixed forward (FE-2 13b9b6f2e/3929ad4b) and QA-76 fixed forward (FE-2 927c6b011);
    - the w8p fixes (FE-C b8a3a6ae, FE-A 8b06f542);
    - QA-70 and QA-71.
  - Orchestrator checks on the pin: validate ✅, npm test (alone) ✅, beta:check ✅; w8p ✅ (Tokyo 620 KB, Atlas 392 KB); `views.js --only links` 140 PASS / 0 FAIL.
  - It merges into `claude/cleveland-page-creation-pant4l` as before; check with merge-tree before the PR.
- **Since pinning:** QC verified QC-26 and QC-22 on the pin (1d973acc). FE-2 re-gated it green, including atlas-ms and the QC-26/QA-76 probes. QA's delta suite (18:47Z): the w7 no-CDN storage row passes 20/20 on the pin and on 3ba696e8 once the harness accepts "Top picks". That failure was a harness artefact of the ratified spec change. QA is now checking the fix claims QA-72, QA-73, QA-59b and QA-55. No verdict yet.
- **History:** 530dc83b NO (QA-70/71). 3ba696e8 NO (QC-26/QA-75/QA-76, all from PERF-08), though B-07 5/5 on 3ba696e8 beat be74c82f's 1/5.
- **PERF-08 re-lands after the deploy,** behind tests covering QA-75/76 and QC-26.
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
| Location verification | Accepted today: Wheeling 7, SF 112, Orlando 7, Chicago 48, DC 38, Miami 2, Erie 27, Philadelphia 25. Beta is at 8,704 places. The assist rules now treat Wikipedia as not independent of Wikidata, add a moved-place guard, hold extended features, and send closed places to review. Singapore (run 22) is in flight. QC-25 closure sources: batch 1 (15 URLs) and batch 2 (14) landed. Sokolowski's corrected to closed 2020 (04026e9d). Decisions sent: Hot Sauce Williams Lee Rd gets one more search to replace a map-listing URL; Uncle Liu's goes UNVERIFIED-status (review sites alone fail 4c) | Batches 3–4 (31 rows). Review Singapore when it commits. Then the 4-row Wikidata re-check (the workflow's re-check mode, a74735f4: SF then Orlando), then `--duplicates` (open plus CLOSED pairs in 4 cities), then Saarland, Okinawa, Rhineland, Aachen |
| Atlas panel | **R3 80.7** (min 74.0, SD 2.86) at 537cfb8c; R0 56.1 → R1 63.8 → R2 70.9 → R3 80.7. SPEC-v3 rev 5 (46f4abe3). Rev 5 work landing: FE-1 R3 #4 dots and glyphs (f51bb0a4); FE-2 #7, the 108 px shift (in progress) | FE-1 and FE-2 finish rev 5, plus R7-g4. The designer signs off the dots on real shots before "round 4 ready". **With the R4 announcement, the orchestrator sends the panel one method note:** the card focus ring is drawn on the parent card (`.pl:has(.pl-n a:focus-visible)`), so a probe that reads only the focused link's own outline will report "no ring". |
| QC | 27 rows: verified 24; open 3 (Med 1: QC-04; Low 2: QC-13, QC-14); High 0. QC-05 verified on e353df08 (3bc6e602). The P-17 harness follows D-43: "n without a verified pin" plus "n approximate pin(s)" | QC-04: FE-C sends its SHA once i18n's ja batch 6 lands (staged e08d33ec). QC-13 → FE-1, QC-14 → designer |
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
| Location verify (woken daily 03:17 UTC by trig_01P2RWA4kn9SKwApTwLdtSrm; disable when the queue is empty) | session_012FeQJjTmiN2MXYQWwe55J2 | Singapore, the Wikidata re-check, `--duplicates` | docs/resume/location-verify.md |

## Standing rules

All of CLAUDE.md applies, plus rule 6 (no third-party travel, booking, review or fashion brand names), sentence case, no
CDN for content, OSM/Esri tiles only, and localStorage in try/catch. Never force-push or rewrite history. Push loops
gate on the npm test exit code and verify the push with ls-remote. Never run two `npm test` at once in one container: each
runs 4 jobs, and the contention fails test-honesty and test-views spuriously (seen 15:00Z; each passed alone). The orchestrator owns `.github/workflows/*`.
