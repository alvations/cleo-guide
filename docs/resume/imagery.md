# Imagery lane — checkpoint

**Task:** W8 photo coverage for every non-Vietnam guide, in this order: lead card, first rail row, tier-1 open sights. Commons only, high-confidence, complete TASL credit; never food, venues, closed places or Vietnam. Weights: Tokyo phone@3× first load ≤ 700 KB, Tokyo/Cleveland/NY first load ≤ 2.0 MB. Open issues: R7-g1 (run reviews/refusals), D-40 option a (approved 2026-10-16: lead/first-row cards 500 + 720 + 960, 720 ≤ 55 KB; Tokyo phone@3× must stay ≤ 700 KB, tighten the cap rather than exceed). QA-67: no 1280w; resolved in layout by FE-A.

**Done (pushed):**
- 128c3bac: 7 run-#40 refusals (Pillar of Fire is a stated gap), PNG→JPEG in recompress, all-format size gate, wider NOT_A_PHOTO + a PNG-lead guard (R7-g1, R7-g7).
- run #46 / 67621b28: 720w backfill on 71 rows.
- 9a7c4819: manifest generator + vetted candidates committed to `tools/beta/imagery/manifest/`. They were previously scratch-only.
- d36f7b49: D-40 (a) code. recompress.js derives a ≤ 55 KB (now 45 KB) 720 for lead/first-row Commons cards from the committed 960 (`needs720`, `priority720`, `P720_KB`). fetch-commons asks priority targets for 500/720/960. Tests are in, with the data check PENDING at the time (`D40A_PENDING` in test-imagery.js).
- df29c10b: run #48 review (`design/beta/imagery-runs/run-48.md`).
- 15bf5685: run #48's 32 refusals applied; D-40a data landed (cap 45 KB, `NO720` exceptions); pending flag off.

- This push: run #52 review; build_manifest fix (a later refusal wins over an earlier vetted line) + test; Gotoku-ji and CMA removed again.

**In flight:**
- Run #48's 32 refusals are APPLIED in this push (orchestrator's final list, recorded in design/beta/imagery-runs/run-48.md). CREDITS 580 → 548.
- D-40a data has LANDED: 38 lead/first-row cards have a 720 copy ≤ 45 KB. 7 are in `NO720` in recompress.js (busy or tall photos that only fit by shrinking below 600 px) and keep 500 + 960. The cap went from 55 to 45 KB because 55 measured Tokyo phone@3× at 703 KB once the 720-aware `sizes` was applied; 45 measures 691 KB. Platform still has to switch `cardSizes()` to the 720 copy (asked); until then phones load the 500 and Tokyo is 649 KB.
- Run #52 (`all` budget 1200, 38918569922) committed e5584852 and is REVIEWED (`design/beta/imagery-runs/run-52.md`): 9 new rows, 2 of them refused files re-fetched by a build_manifest bug (fixed, tested, removed). 1 row flagged '?' for the orchestrator (Pullman Porter Museum). Yield is low: the lead images are used up.

**Next:**
1. When the run commits: `git pull` (resolve CREDITS conflicts BY HAND, never `--theirs`). List the new rows, i.e. CREDITS rows whose `commonsTitle` is not in `git show f47945e9:beta/assets/img/CREDITS.json`, grouped by city as `id ← file | depicts`, flagging doubtful ones. Then send the orchestrator: coverage (`node tools/beta/imagery/coverage.js`), remaining (`node tools/beta/imagery/fetch-commons.js --dry-run --scope all`), and `npm run beta:qa:w8p` (Tokyo phone@3×).
2. On the orchestrator's refusals:
   - append each to `tools/beta/imagery/manifest/cands.tsv` as `landmark:<page>#<id>\t<file>\t(lead image)\thigh\tlead image (run #N)\t\trefused by visual review (…): <reason>`, giving a photo-fault reason so it is global;
   - add a stated SKIP in build_manifest.py when nothing honest is left;
   - run `python3 tools/beta/imagery/manifest/build_manifest.py`;
   - remove the CREDITS rows and their files with a count-asserted script;
   - `cd tools && npm run beta && npm run validate && npm test && npm run beta:check`;
   - push and verify with ls-remote.
3. When platform's `cardSizes` change lands, re-run `npm run beta:qa:w8p`. It should be ≈ 691 KB. If Tokyo phone@3× is over 700 KB, lower `P720_KB`, delete the lead/first-row 720 variants, re-derive with recompress, and add any new skips to `NO720`.
4. Coverage now needs VETTED CANDIDATES: WebSearch for Commons file titles of the top tier-1 gaps (`coverage.js --json`), add them to cands.tsv with depicts and confidence, rebuild the manifest, then a dispatch. Don't dispatch more plain `all` runs; they yield about 4%.
5. Review any dispatched run as in step 1. Write `design/beta/imagery-runs/run-<N>.md` and send the flagged rows to the orchestrator.

**Notes:**
- Known gap: when the runner fetches a new priority row, `store()` derives its 720 at q82 and recompress then re-encodes it to ≤ 45 KB. A busy photo can be scaled below 600 px while keeping its `-720` name. Check new priority rows in each review and add any such row to `NO720`.
- sharp for local runs is at `NODE_PATH=<scratch>/sh/node_modules`. In a fresh session: `cd tools && npm install --no-save sharp`.
- The Actions workflow `beta-fetch-unsplash.yml` belongs to the orchestrator; never edit it. Runs: push → scope priority; dispatch → `scope` + `budget`. The image hosts are blocked in this sandbox, so all fetching happens on Actions.
- Refusal scope: a photo-fault reason applies to every target; a slot or duplicate reason stays local (`refusalIsGlobal`).
- Grandfathered PNG leads (Aachen Vogelsang, Erie Waldameer): the orchestrator says keep them (now JPEG).
- Push guard: check git's exit code, never grep the output; then confirm with `git ls-remote origin refs/heads/claude/peaceful-goodall-i0hsrt` = HEAD.
