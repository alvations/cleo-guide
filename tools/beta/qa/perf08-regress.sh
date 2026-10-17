#!/bin/bash
# PERF-08 re-land gate (platform): the three regressions selective stamping caused on 3ba696e8. Run before turning
# Cleo.defer.selective back on, and after; all must pass. Real Chromium; ≈ 25 min (w7 lens is the long one). Alone.
#   QA-75  a deep-linked tier lens under a remembered Guidebook/Insights view      → views.js --only links, 0 FAIL
#   QA-76  Atlas "N more outside this area · Show all M" read mid-first-fit         → w7.js --only lens, 0 FAIL;
#          FE-2's atlas-nav-ms.js --only tokyo (its "QA-76" block)
#   QC-26  cold Atlas lens deep link: the sheet reads "1 of N" and paging the Atlas list reaches all N (390 and 1440),
#          Tokyo CYD 43 / Cleveland DT 42 — QA's tools/beta/qa/lenspage-accept.js, which also accepts PERF-21 lensPage
set -u; cd "$(git rev-parse --show-toplevel)" || exit 9; F=0
node tools/beta/qa/views.js --only links | tee /dev/stderr | grep -q ', 0 FAIL' || F=1
node tools/beta/qa/w7.js --only lens | tee /dev/stderr | grep -q ', 0 FAIL' || F=1
git checkout -q -- design/beta/eval/w7/qa 2>/dev/null   # the QA probes write their evidence there: leave QA's folder as it was
# QC-26 + PERF-21 lensPage (QA 2026-10-17): a cold Atlas lens deep link reads "1 of N" and paging the list reaches all N
# (FE-1's shed() pages the Atlas list, so li shown < N is expected); the Gallery's paged lens shows every match once, each a
# card on its page, and search, #p=, print and "Keep offline" reach the last page. ≈ 5 min, exit 1 on any FAIL.
(cd tools && node beta/qa/lenspage-accept.js) || F=1
# desktop switch → Atlas INP (797258c2 regression guard; 1,500 ms ceiling at 1× CPU)
node tools/beta/qa/atlas-switch-inp.js || F=1
# the initial-DOM budget (M3-06; selective changes what is built at load)
node tools/beta/qa/test-dom-budget.js || F=1
# FE-2's Atlas interaction probes on Tokyo, incl. its "QA-76" block (plain + lens, 390 / 1440; ≈ 3 min)
NODE_PATH=$(npm root -g 2>/dev/null) node tools/beta/atlas-nav-ms.js --only tokyo || F=1
# FE-2's QC-26 probe (3 pilots × 390/1440), the second area (default) and the first area (AREA_IDX=0)
NODE_PATH=$(npm root -g 2>/dev/null) node tools/beta/fe2/qc26.js || F=1
AREA_IDX=0 NODE_PATH=$(npm root -g 2>/dev/null) node tools/beta/fe2/qc26.js || F=1
# FE-B QC-33: deep-linked Guidebook / Insights load CLS < 0.1 (3 cities x 390 / 1440 x 4 views; ~2 min)
node tools/beta/feb-cls.js || F=1
[ $F = 0 ] && echo ">>> PASS — PERF-08 regressions (QA-75, QA-76, QC-26) + QC-33 clear" || { echo ">>> FAIL — a PERF-08 regression is back"; exit 1; }
