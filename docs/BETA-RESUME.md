# Beta: how to resume (orchestrator checkpoint)

This file is the single place to restart the beta program after a stop: a usage limit, a lost container or a new
session. The orchestrator rewrites it at every check-in, at least every 30–45 min. Each lane keeps its own
checkpoint in `docs/resume/<lane>.md` (see [docs/resume/README.md](resume/README.md)). The full history is in
`docs/BETA-LOG.md`, the session table is `docs/AGENT-LEDGER.md`, and the issue register is `docs/BETA-ISSUES.md`.

**Last updated:** 2026-10-16 19:40Z by the orchestrator (session_01PCNcUkfa5S1N1BKGzZA4xx).

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

- **QA said NO on pin 4aba38b3** (18:56Z, 025bac06), with 0 open High or Blocker. Every row passed except two small regressions:
  - **QA-77 (Med, FE-C):** the recognition badges `a.rb` are only 32 px tall, so B-20 fails on phone in Gallery and Atlas. Fix: a 44 px hit area.
  - **QA-78 (Low, imagery):** the Duquesne Incline credit author is a Flickr URL (CREDITS.json, from 6c007a0d5). Fix: the creator as credited, and a fetcher guard plus a test.
- **The next pin is the release branch `beta-deploy-r7`**, not the dev head. It holds 4aba38b3 plus ported fixes only, so QA's delta stays short and the Atlas rev 5 work that landed since the pin stays out.
  - Worktree: `/home/user/rel-r7` (`tools/node_modules` is a symlink; never commit it).
  - Release head **33a44d167981177bf3f3b901ecc860d0ad61e69f**. It ports, on top of 4aba38b3:
    - QA-74, the motion tokens (af1a0e2a);
    - QC-28, the Erie prose (2bbae5ac);
    - QA-78, the Duquesne credit, with the fetcher guard and the test (9c6cd576, without the run #64 photos);
    - FE-B's honesty-leak fixes (712e746f, aee184d3) and i18n's m.not.p ja (96d46d0b);
    - dev's 8 data commits since the pin: QC-25 closure sources batches 1–5, Sokolowski's 2020, and the Orlando/DC prose (9fa62209, filed as QC-29 on the release);
    - QC-25's closed-card line, from 5d3dc985 without its fe-a.css focus-ring part.
  - Gates on 33a44d16: validate, npm test alone, beta:check and w8p (Tokyo 620 KB, Atlas 392 KB) all pass.
  - Leak sweep of shipped HTML and XML: 0 "kept flagged", "worklist", "per editorial rule" or "verify before publish". beta/data/prov/*.json, the open-data sidecar no client reads, still holds raw coordinate notes, as dev does (Low, follow-up).
  - Not in this release: QC-04 (D-43 labels), Atlas rev 5, PERF-08 and FE-A's 752a77fc. They ship in the next one, from the dev head.
  - Port QA-77 when FE-C sends its SHA: `git diff <sha>^ <sha> -- <source files> | git apply` in the worktree, then `npm run beta`, the gates, commit, push and ls-remote. Then send QA the full SHA.
  - QA's delta: B-20 on the pilots (Gallery and Atlas), w7-photos and the QA-74 motion tokens, plus the regression sweep (metrics ×2, Atlas, w7, views, w8p, the QC-26 A/B).
- **On YES:**
  1. open a PR from `beta-deploy-r7` into `claude/cleveland-page-creation-pant4l` (live is still 9f54587d; check with merge-tree first);
  2. merge with `expectedHeadSha` = the full SHA;
  3. merge `beta-deploy-r7` back into claude/peaceful-goodall-i0hsrt (generated beta/ conflicts: take ours, regenerate);
  4. add a `docs/BETA-CHANGELOG.md` entry;
  5. give the owner https://alvations.github.io/cleo-guide/beta/;
  6. launch the R8 evaluator (`design/beta/eval/r8/README.md`, R8 = the deploy SHA, baseline R7 badcc20d).
- **History:**
  - 530dc83b NO (QA-70/71);
  - 3ba696e8 NO (QC-26, QA-75, QA-76, all from PERF-08);
  - 4aba38b3 NO (QA-77, QA-78). On 4aba38b3, QA verified QC-26, QA-70 (Tokyo first pin 697 ms vs 2,253), QA-71, QA-72, QA-73, QA-75, QA-76, QA-59b, QA-55, R7-g6, W9-6, B-07 5/5, G1 5/5 and w8p.
- **PERF-08 re-lands after the deploy,** behind tools/beta/qa/perf08-regress.sh. FE-A's QA-75 prep (752a77fc9) is on the dev branch only.
- **Not blocking:** W9-2 (no "Checked" line on the first 24 Cleveland cards; QA is still checking), QA-61 and QA-68.

## In flight

| What | State | Next |
|---|---|---|
| Imagery | All 32 run #48 refusals applied. Run #52 (`all`) yield collapsed to about 4%, so no more plain `all` runs (orchestrator, 15:27Z). Candidate wave 1 (cb5dfd79): 20 vetted titles for 10 empty leads and first-row slots, and 6 stated gaps. Push run #54 is running. D-40a: the 720w leads are capped at 45 KB; Tokyo phone@3× is 607 KB | Imagery contact-sheets #54 and sends only the "?" rows. Wave 2 is about 40 targets from the guides with the lowest tier-1 share |
| Location verification | Accepted today: Wheeling 7, SF 112, Orlando 7, Chicago 48, DC 38, Miami 2, Erie 27, Philadelphia 25. Beta is at 8,704 places. The assist rules now treat Wikipedia as not independent of Wikidata, add a moved-place guard, hold extended features, and send closed places to review. Singapore (run 22) is in flight. QC-25 closure sources are done: 55 of 60 closed rows have a URL (batches 1–5, last 9338a4ce). D-44 settles the evidence classes. Sokolowski's corrected to closed 2020 (04026e9d). Decisions sent: Hot Sauce Williams Lee Rd gets one more search to replace a map-listing URL; Uncle Liu's goes UNVERIFIED-status (review sites alone fail 4c) | Batches 3–4 (31 rows). Review Singapore when it commits. Then the 4-row Wikidata re-check (the workflow's re-check mode, a74735f4: SF then Orlando), then `--duplicates` (open plus CLOSED pairs in 4 cities), then Saarland, Okinawa, Rhineland, Aachen |
| Atlas panel | **R3 80.7** (min 74.0, SD 2.86) at 537cfb8c; R0 56.1 → R1 63.8 → R2 70.9 → R3 80.7. SPEC-v3 rev 5 (46f4abe3). Rev 5 work landing: FE-1 R3 #4 dots and glyphs (f51bb0a4); FE-2 #7, the 108 px shift (in progress) | FE-1 and FE-2 finish rev 5, plus R7-g4. The designer signs off the dots on real shots before "round 4 ready". **With the R4 announcement, the orchestrator sends the panel one method note:** the card focus ring is drawn on the parent card (`.pl:has(.pl-n a:focus-visible)`), so a probe that reads only the focused link's own outline will report "no ring". |
| QC | 29 rows: verified 26 (QC-04 verified on 7857f885, 5d2ffb27); open 2 Low (QC-13 FE-1, QC-14 designer); QC-29 (the Orlando/DC prose on the release) was fixed by the port to 33a44d16; Med 0, High 0 | QC runs S-16 and the FE-B leak checks on the release SHA |
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
