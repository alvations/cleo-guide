# Imagery lane — checkpoint

**Task:** W8 photo coverage for every non-Vietnam guide, in this order: lead card, first rail row, tier-1 open sights. Commons only, high-confidence, complete TASL credit; never food, venues, closed places or Vietnam. Weights: Tokyo phone@3× first load ≤ 700 KB, Tokyo/Cleveland/NY first load ≤ 2.0 MB. Open issues: R7-g1 (run reviews/refusals), D-40 (720w; priority-row decision pending), QA-67 (1280w hero/detail; pending approval).

**Done (pushed):**
- 128c3bac: 7 run-#40 refusals (Pillar of Fire is a stated gap), PNG→JPEG in recompress, all-format size gate, wider NOT_A_PHOTO + a PNG-lead guard (R7-g1, R7-g7).
- run #46 / 67621b28: 720w backfill on 71 rows.
- This push: manifest generator + vetted candidates committed to `tools/beta/imagery/manifest/`. They were previously scratch-only.

**In flight:**
- The `all` budget-1200 run was dispatched by the orchestrator at about 13:36Z on 2026-10-16. **NOT YET REVIEWED.** The baseline before it: CREDITS 309 rows at f47945e9, coverage heroes 76 + 8 stated, leads 20/27, first row 42/56, tier-1 216/1017, 507 targets to try.
- Waiting on the orchestrator: D-40 option (a) or (b) for lead and first-row cards, and QA-67 approval.

**Next:**
1. When the run commits: `git pull` (resolve CREDITS conflicts BY HAND, never `--theirs`). List the new rows, i.e. CREDITS rows whose `commonsTitle` is not in `git show f47945e9:beta/assets/img/CREDITS.json`, grouped by city as `id ← file | depicts`, flagging doubtful ones. Then send the orchestrator: coverage (`node tools/beta/imagery/coverage.js`), remaining (`node tools/beta/imagery/fetch-commons.js --dry-run --scope all`), and `npm run beta:qa:w8p` (Tokyo phone@3×).
2. On the orchestrator's refusals:
   - append each to `tools/beta/imagery/manifest/cands.tsv` as `landmark:<page>#<id>\t<file>\t(lead image)\thigh\tlead image (run #N)\t\trefused by visual review (…): <reason>`, giving a photo-fault reason so it is global;
   - add a stated SKIP in build_manifest.py when nothing honest is left;
   - run `python3 tools/beta/imagery/manifest/build_manifest.py`;
   - remove the CREDITS rows and their files with a count-asserted script;
   - `cd tools && npm run beta && npm run validate && npm test && npm run beta:check`;
   - push and verify with ls-remote.
3. If D-40 (a) is approved: derive a 720w (≤ 55 KB) for priority rows locally from their 960 with sharp (`recompress.js` / `fetch-commons.js deriveWidth`) and add a test. Platform adds the 240px `sizes` clause.

**Notes:**
- sharp for local runs is at `NODE_PATH=<scratch>/sh/node_modules`. In a fresh session: `cd tools && npm install --no-save sharp`.
- The Actions workflow `beta-fetch-unsplash.yml` belongs to the orchestrator; never edit it. Runs: push → scope priority; dispatch → `scope` + `budget`. The image hosts are blocked in this sandbox, so all fetching happens on Actions.
- Refusal scope: a photo-fault reason applies to every target; a slot or duplicate reason stays local (`refusalIsGlobal`).
- Grandfathered PNG leads (Aachen Vogelsang, Erie Waldameer): the orchestrator says keep them (now JPEG).
- Push guard: check git's exit code, never grep the output; then confirm with `git ls-remote origin refs/heads/claude/peaceful-goodall-i0hsrt` = HEAD.
