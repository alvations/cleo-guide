# Imagery lane — checkpoint

**Task:** W8 photo coverage for every non-Vietnam guide, in this order: lead card, first rail row, tier-1 open sights. Commons only, high-confidence, complete TASL credit; never food, venues, closed places or Vietnam. Weights: Tokyo phone@3× first load ≤ 700 KB, Tokyo/Cleveland/NY first load ≤ 2.0 MB. Open issues: R7-g1 (run reviews/refusals), D-40 option a (approved 2026-10-16: lead/first-row cards 500 + 720 + 960, 720 ≤ 55 KB; Tokyo phone@3× must stay ≤ 700 KB, tighten the cap rather than exceed). QA-67: no 1280w; resolved in layout by FE-A.

**Done (pushed):**
- 128c3bac: 7 run-#40 refusals (Pillar of Fire is a stated gap), PNG→JPEG in recompress, all-format size gate, wider NOT_A_PHOTO + a PNG-lead guard (R7-g1, R7-g7).
- run #46 / 67621b28: 720w backfill on 71 rows.
- 9a7c4819: manifest generator + vetted candidates committed to `tools/beta/imagery/manifest/`. They were previously scratch-only.
- This push: D-40 (a) code. recompress.js derives a ≤ 55 KB 720 for lead/first-row Commons cards from the committed 960 (`needs720`, `priority720`, `P720_KB`). fetch-commons asks priority targets for 500/720/960. Tests are in, with the data check PENDING (`D40A_PENDING` in test-imagery.js).

**In flight:**
- The `all` budget-1200 run was dispatched by the orchestrator at about 13:36Z on 2026-10-16. **NOT YET REVIEWED.** The baseline before it: CREDITS 309 rows at f47945e9, coverage heroes 76 + 8 stated, leads 20/27, first row 42/56, tier-1 216/1017, 507 targets to try.
- **Run #48** (Actions id 38908975560, `all` budget 1200) is in progress and NOT YET REVIEWED.
- D-40 (a) data is NOT yet landed: the 45 lead/first-row 720 copies wait for #48 to commit, to avoid a CREDITS conflict. A dry run shows all 45 at ≤ 55 KB; Tokyo is about +30 KB → ≈ 676 KB.
- Asked platform (session_01USPS1inq7bUDfyw89evKMA) to make `cardSizes()` return `CARD_SIZES_720` whenever a 720 copy exists. Waiting on its SHA.

**Next:**
1. When the run commits: `git pull` (resolve CREDITS conflicts BY HAND, never `--theirs`). List the new rows, i.e. CREDITS rows whose `commonsTitle` is not in `git show f47945e9:beta/assets/img/CREDITS.json`, grouped by city as `id ← file | depicts`, flagging doubtful ones. Then send the orchestrator: coverage (`node tools/beta/imagery/coverage.js`), remaining (`node tools/beta/imagery/fetch-commons.js --dry-run --scope all`), and `npm run beta:qa:w8p` (Tokyo phone@3×).
2. On the orchestrator's refusals:
   - append each to `tools/beta/imagery/manifest/cands.tsv` as `landmark:<page>#<id>\t<file>\t(lead image)\thigh\tlead image (run #N)\t\trefused by visual review (…): <reason>`, giving a photo-fault reason so it is global;
   - add a stated SKIP in build_manifest.py when nothing honest is left;
   - run `python3 tools/beta/imagery/manifest/build_manifest.py`;
   - remove the CREDITS rows and their files with a count-asserted script;
   - `cd tools && npm run beta && npm run validate && npm test && npm run beta:check`;
   - push and verify with ls-remote.
3. After #48 lands:
   - run `NODE_PATH=<sharp> node tools/beta/imagery/recompress.js` to add the 45 copies;
   - set `D40A_PENDING = false` in test-imagery.js;
   - run the gates plus `npm run beta:qa:w8p`;
   - push.
   Once platform's `cardSizes` change is in, re-run w8p. If Tokyo phone@3× is over 700 KB, lower `P720_KB` and re-derive.

**Notes:**
- sharp for local runs is at `NODE_PATH=<scratch>/sh/node_modules`. In a fresh session: `cd tools && npm install --no-save sharp`.
- The Actions workflow `beta-fetch-unsplash.yml` belongs to the orchestrator; never edit it. Runs: push → scope priority; dispatch → `scope` + `budget`. The image hosts are blocked in this sandbox, so all fetching happens on Actions.
- Refusal scope: a photo-fault reason applies to every target; a slot or duplicate reason stays local (`refusalIsGlobal`).
- Grandfathered PNG leads (Aachen Vogelsang, Erie Waldameer): the orchestrator says keep them (now JPEG).
- Push guard: check git's exit code, never grep the output; then confirm with `git ls-remote origin refs/heads/claude/peaceful-goodall-i0hsrt` = HEAD.
