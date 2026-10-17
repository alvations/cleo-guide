# QA lane checkpoint (R7 QA and register keeper)

Session: `session_017FLWXa5zgGWvqNo4C3UsvH`. Orchestrator: `session_01PCNcUkfa5S1N1BKGzZA4xx`.

## Task

- R7 re-sign and YES/NO for deploy. 530dc83b was NO: QA-69 is fixed, but QA-70 (map open about 1.5 s slower, Gallery B-07 pin step) and QA-71 (carousel swipe after a detail round trip) are new regressions. Open High 0.
- Keep `docs/BETA-ISSUES.md` current: verify every claimed fix on a pinned SHA, with the probe and the result.
- Rule on measurement-rule changes that lanes propose.

## Done

- Interim claims on 032f1a8e (`tools/beta/qa/claims-r8i.js`, new): QA-82, R8-v27b, R8-FEC, R8-FEB-prune and QA-84 (phone Atlas doors) verified; the adeabcd63 lead card is verified except its photo ratio (QA-83, Low, FE-A: 4:3, not 3:2). Evidence: `design/beta/eval/w7/qa/claims-032f1a8e/`.
- lensPage flip 80a2b3a0 (PERF-21) verified: gates plus perf08-regress green; the current lenspage-accept (row 0) passes 52/52 against the pin. Evidence: `design/beta/eval/w7/qa/lenspage-80a2b3a0/`.
- f03865bf: `w7-photos.js` Flickr duplicate key falls back to the photo id in sourceUrl (fetch-openverse writes no `flickrId`); tested with imagery's example row; imagery told.
- 03f4f402: the W7 full pass (QA-45…59, `tools/beta/qa/w7.js`, `w7-photos.js`, the B-07 map-search path in `metrics.js`).
- Register work:
  - 5f6088a8: register built;
  - 34ecf44c: re-sign on dd2125e3 (NO);
  - 387f1306: pre-measure on b5f0afa1;
  - f00f2312: pre-measure on 0ecf62aa;
  - c5dbeef3: QC rows, QC-01 reproduced.
- **R7 signed off: YES on b54b3745 under D-45** (QA-79 waived for r7; fix 87f814ad on dev, to verify on the next release pin).
- The b54b3745 deploy-pin re-sign (beta-deploy-r7): NO on QA-79 only, the Tokyo desktop DOM at 3,074 (≤ 3,000; be74c82f 2,879). QA-77, QA-78 and QA-74 are verified. The B-07 probe is hardened (settle look, place markers only, id kept on window). A waiver decision for r7 would make it YES with no re-test.
- The 4aba38b3 delta re-sign: NO on QA-77 (W9-1 badges, 32 px links, B-20) and QA-78 (credit author is a URL). QC-26, QA-75, QA-76, QA-72, QA-73, QA-59b, QA-55 and R7-g6 are verified; QA-74 is not in the shipped CSS. The w7 storage row now accepts Top picks (§2.4).
- The 3ba696e8 delta re-sign: NO on QC-26, QA-75 and QA-76 (the last two from PERF-08, 1538974d). QA-70 verified. B-07 probe fix (3 s pin wait) ratified; on the same probe the pin is 5/5 twice, and be74c82f fails 4/5 (QA-69).
- Register hygiene on 995e2529: every "claim not on origin" SHA is on origin. Verified QA-59c, QA-59d, QA-71 and R7-g3. New: QA-72, QA-73, QA-74. The open R7 gap list and owners were sent to the orchestrator.
- The 530dc83b delta re-sign: NO on QA-70 and QA-71; QA-69 verified.
- The 2bfff3fe delta re-sign: NO on QA-69 only; QC-01 and QA-61 verified; QA-68 probe fix in `metrics.js`.
- 3480f399: re-sign on be74c82f. All R7 rows pass. **NO** on QA-69 (Gallery B-07 regression: the phone map pill is hidden at load, FE-A 7c70e821) and on QC-01. The QA-66 B-23 probe fix (`metrics.js` `bgOf`) landed here.
- Rulings:
  - D-40 ratified with a 720w condition; the orchestrator later chose option (a);
  - PERF-08 test change agreed with conditions (e)–(h);
  - QA-64 accepted within the D-32 scope.

## Next

1. On the next pin (with QA-70 and QA-71): run the delta re-sign (`git diff --stat 530dc83b..<pin>`; re-run the touched rows; always Gallery B-07 on 5/5, run twice because it depends on scroll state). Run the commands below; compare with `design/beta/eval/w7/qa/resign-be74c82f/`.
2. QC-01 is verified on 2bfff3fe; re-check it only if `insights.js` changed. Verify QC-01 there: every Insights link opens exactly its count; the canon bars are not links and carry the note.
3. Re-check QA-70 (time to first pin after the pill tap: page-eval expression in `resign-530dc83b`, compare with be74c82f's 2.45 s / 2.72 s) and QA-71 (`w7.js --only atlasm` swipe, plus the open + Back + swipe probe). Run Gallery B-07 twice.
4. Reply YES/NO to the orchestrator with the open High/Blocker count. YES needs: 0 open High/Blocker, every R7 row ✅, and no regression versus be74c82f.
5. Then:
   - PERF-08: re-run reach once platform flips `selective`;
   - D-40 (a): Tokyo phone@3× must stay ≤ 700 KB;
   - QA-67: by layout, the slot takes the source width.

## How to rebuild the worktree from origin

```bash
cd /home/user/cleo-guide && git fetch origin
git worktree add --detach ../qa-pin <SHA>          # a clean checkout of the pinned SHA
cd ../qa-pin/tools && npm install --no-audit --no-fund
npm run validate && npm test && npm run beta:check
cp <latest origin>/tools/beta/metrics.js beta/metrics-qa.js   # only if the pin predates a QA probe fix
node beta/metrics-qa.js --out <scratch>/md.json             # the DEFAULT view (Atlas after D-46): B-01a, B-24, B-07, B-20, B-23, G1
node beta/metrics-qa.js --view gallery --out <scratch>/mg.json   # Gallery pinned: B-01, B-02, B-04, B-05, B-07, B-08, B-20, B-23, G1
# pins before D-46 lands: QA_DEFAULT_VIEW=gallery for w4/w5/views (tools/beta/qa/default-view.js)
node beta/metrics-qa.js --view atlas --out <scratch>/ma.json  # Atlas pilots: G1, B-07, B-08, B-20, B-23
node beta/qa/w7.js --only atlasd,atlasm,detail,nocdn,lens    # QA-45/50/52, credits, the detail, no-CDN, lens totals
QA_PILOTS=Singapore/chinatown.html,cities/tokyo.html node beta/qa/w7.js --only reach   # QA-54 search
node beta/qa/w7-photos.js                                   # photo and credit honesty
node beta/qa/page-eval.js <m|m3|d> '<page#hash>' '<expr>' [shot.jpg] [block]   # one-off probes (examples in the file)
```

Put evidence in `design/beta/eval/w7/qa/resign-<sha>/`. Never overwrite the R7 evidence files at `design/beta/eval/w7/qa/*.jpg`; `w7.js` writes there, so `git checkout --` them before committing.

## In flight

- Nothing running. r7 is live: PR #9 merged b54b3745 as 4382a187 (identical tree), and Pages built at 21:34Z.
- Next on dev:
  1. (done: the lensPage flip 80a2b3a0 is verified; PERF-21's INP is still to re-measure on the release pin)
  2. On the next release pin (after Atlas rev 5 reaches panel R4): QA-79's fix 87f814ad (`w2.js --only dom`), QC-04/D-43, W9-2, QC-30, QC-32, QC-33 and W8-I18N-SEARCH, plus the usual delta and regression sweep against b54b3745.

## Notes

- 1cafc50b (my push, a merge) had test-beta red: aa8ed3958 (FE-B, Singapore/hanoi + hoi-an turned into pointers) left `beta/changes/singapore--{hanoi,hoi-an}.html` behind. FE-B's db9f8a746 prunes them; origin a027955b9 is green on validate, npm test and beta:check. Not a QA change.

- QA-81 guard `tools/beta/qa/test-no-input-sniffing.js` (D-48): fails today on PERF-19 only. Platform wires it into npm test with PERF-19b; verify on the next pin.
- D-47 (w7 storage, Layers or .m-base) is in BETA-DECISIONS; the Layers path is unexercised until FE-1's .m-layers lands.
- Push procedure: run the gates; commit; fetch and merge origin. **If the merge changed product files** (`beta/`, `tools/beta/client`, `tools/beta/lib`), re-run validate and `npm test` and push only if both pass. Never push on a printed warning. Platform's sync-push has a post-merge budget guard (147bd3ba).
- The next pin also verifies: R8-g5a (21fdd6a32, sheet-contrast), R8-g2e (0486bf714), R8-g2c (785d8641e), R8-g3 (09f82449 / 298e21d8), QA-80 (the landscape switch), and atlas-switch-inp (in npm test).

- Before any re-sign, check every claimed SHA with `git merge-base --is-ancestor <sha> <pin>`. FE-A's commits once never reached origin.
- Probe artefacts: QA-66 (fixed), QA-68 (probe fixed; re-check if the straddling state recurs).
- D-42 (hours, label don't strip): when FE-B lands it, both honesty greps must allow exactly the new sentence. Fix the probe to measure what is painted; never exempt an element.
- The untracked raw folder `design/beta/eval/w7/qa/premeasure-0ecf62aa/` was deleted by mistake on 2026-10-16 (never committed). Its findings live in the register rows (QA-67 and others), so nothing cited is lost.
- `/home/user/cleo-guide` has a local backup branch `backup/peaceful-goodall-local-2026-10-03` holding a stale October 3 history, intentionally not pushed.
