# Interim claim checks on 032f1a8e (QA, 2026-10-17)

Pinned worktree at 032f1a8ee, run alone. Real Chromium; tiles stubbed with a 1 × 1 PNG.

- `gates-and-doors.txt`: validate, npm test, beta:check (all PASS), then `w2.js --only doors` 16/16 (QA-84).
- `claims-r8i.js`: `node tools/beta/qa/claims-r8i.js`, 61/62.
  - lead (FE-A adeabcd63): one FAIL, the lead photo is 4:3, not 3:2 (QA-83);
  - np (d6bb8367a): 26/26;
  - fec (f21d3bd97): 7/7;
  - qa82 (975e2bfe4): 14/14.
- `feb-stale-check.txt`: FE-B db9f8a746. Two leftover files were planted (`changes/singapore--hanoi.html`, `data/packs/singapore--hoi-an.json`). `build.js --check` reports both STALE and exits 1; `build.js` removes them; `--check` is clean again.
