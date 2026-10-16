#!/bin/bash
# PERF-08 re-land gate (platform): the three regressions selective stamping caused on 3ba696e8. Run before turning
# Cleo.defer.selective back on, and after; all must pass. Real Chromium; ≈ 25 min (w7 lens is the long one). Alone.
#   QA-75  a deep-linked tier lens under a remembered Guidebook/Insights view      → views.js --only links, 0 FAIL
#   QA-76  Atlas "N more outside this area · Show all M" read mid-first-fit         → w7.js --only lens, 0 FAIL
#   QC-26  cold Atlas lens deep link: the sheet reads "1 of 43", 43 shown (390 and 1440); FE-2's tools/beta/fe2/qc26.js,
#          first and second area, Tokyo / Cleveland / New York × 390 / 1440
set -u; cd "$(git rev-parse --show-toplevel)" || exit 9; F=0
node tools/beta/qa/views.js --only links | tee /dev/stderr | grep -q ', 0 FAIL' || F=1
node tools/beta/qa/w7.js --only lens | tee /dev/stderr | grep -q ', 0 FAIL' || F=1
git checkout -q -- design/beta/eval/w7/qa 2>/dev/null   # the QA probes write their evidence there: leave QA's folder as it was
for vp in m d; do
  R=$(node tools/beta/qa/page-eval.js $vp 'cities/tokyo.html#view=atlas&a=CYD&p=imperial-palace-east-gardens' "(async()=>{await new Promise(r=>setTimeout(r,2500));const g=document.querySelector('[role=dialog]:not([hidden])');const t=g?g.innerText.match(/\d+ of \d+/):null;return [document.querySelectorAll('li.pl:not([hidden])').length,t&&t[0]].join('|')})()" 2>/dev/null)
  echo "QC-26 $vp: $R"; [ "$R" = '"43|1 of 43"' ] || F=1
done
# FE-2's QC-26 probe (3 pilots × 390/1440), the second area (default) and the first area (AREA_IDX=0)
NODE_PATH=$(npm root -g 2>/dev/null) node tools/beta/fe2/qc26.js || F=1
AREA_IDX=0 NODE_PATH=$(npm root -g 2>/dev/null) node tools/beta/fe2/qc26.js || F=1
[ $F = 0 ] && echo ">>> PASS — PERF-08 regressions (QA-75, QA-76, QC-26) clear" || { echo ">>> FAIL — a PERF-08 regression is back"; exit 1; }
