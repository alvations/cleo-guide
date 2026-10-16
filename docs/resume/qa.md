# QA lane checkpoint (R7 QA and register keeper)

Session: `session_017FLWXa5zgGWvqNo4C3UsvH`. Orchestrator: `session_01PCNcUkfa5S1N1BKGzZA4xx`.

## Task

- R7 re-sign and YES/NO for deploy. 530dc83b was NO: QA-69 is fixed, but QA-70 (map open about 1.5 s slower, Gallery B-07 pin step) and QA-71 (carousel swipe after a detail round trip) are new regressions. Open High 0.
- Keep `docs/BETA-ISSUES.md` current: verify every claimed fix on a pinned SHA, with the probe and the result.
- Rule on measurement-rule changes that lanes propose.

## Done

- 03f4f402: the W7 full pass (QA-45…59, `tools/beta/qa/w7.js`, `w7-photos.js`, the B-07 map-search path in `metrics.js`).
- Register work:
  - 5f6088a8: register built;
  - 34ecf44c: re-sign on dd2125e3 (NO);
  - 387f1306: pre-measure on b5f0afa1;
  - f00f2312: pre-measure on 0ecf62aa;
  - c5dbeef3: QC rows, QC-01 reproduced.
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
node beta/metrics-qa.js --out <scratch>/mg.json             # Gallery pilots: B-02, B-04, B-05, B-07, B-08, B-20, B-23, G1
node beta/metrics-qa.js --view atlas --out <scratch>/ma.json  # Atlas pilots: G1, B-07, B-08, B-20, B-23
node beta/qa/w7.js --only atlasd,atlasm,detail,nocdn,lens    # QA-45/50/52, credits, the detail, no-CDN, lens totals
QA_PILOTS=Singapore/chinatown.html,cities/tokyo.html node beta/qa/w7.js --only reach   # QA-54 search
node beta/qa/w7-photos.js                                   # photo and credit honesty
node beta/qa/page-eval.js <m|m3|d> '<page#hash>' '<expr>' [shot.jpg] [block]   # one-off probes (examples in the file)
```

Put evidence in `design/beta/eval/w7/qa/resign-<sha>/`. Never overwrite the R7 evidence files at `design/beta/eval/w7/qa/*.jpg`; `w7.js` writes there, so `git checkout --` them before committing.

## In flight

- `metrics.js --all` on 995e2529 (R7-g5, 180 pages) is running in `/home/user/qa-head`. Its output goes to the scratchpad, `head/mall.json`. When it finishes, record the failing-page counts for B-02/04/05/08/20 on R7-g5. If the run is lost, rerun it on the next pin.
- Waiting on QA-70 (Atlas FE-2) and the orchestrator's pin. FE-B claims are coming for R7-g6, R7-g2 (g)/(h) and R7-g5 (hubs, landing).

## Notes

- Before any re-sign, check every claimed SHA with `git merge-base --is-ancestor <sha> <pin>`. FE-A's commits once never reached origin.
- Probe artefacts: QA-66 (fixed), QA-68 (probe fixed; re-check if the straddling state recurs).
- D-42 (hours, label don't strip): when FE-B lands it, both honesty greps must allow exactly the new sentence. Fix the probe to measure what is painted; never exempt an element.
- `/home/user/cleo-guide` has a local backup branch `backup/peaceful-goodall-local-2026-10-03` holding a stale October 3 history, intentionally not pushed.
