# Round 8 measurement kit (draft, platform lane)

The R7 evaluator's commands ([ROUND-7 § Reproduce](../ROUND-7.md#reproduce)), re-pointed at the R8 deploy SHA, plus the
probes that landed after R7. With this kit the R8 evaluator can start the moment the deploy merges. Everything here
only **measures**: none of it edits product files. Score with the unchanged rubric
([ROUNDS-6-9](../ROUNDS-6-9.md)); this file holds commands, not scores.

| Name | SHA | Notes |
|---|---|---|
| **R8** (measured) | `$R8` = the deploy SHA the orchestrator names when it merges | the candidate pinned for QA's re-sign is `3ba696e8743112fcc5407e05e5daf6b3184caad4`; use the final one |
| **R7** (baseline) | `badcc20d` | scored in [ROUND-7](../ROUND-7.md) |

Ports: R8 is served on **8811**, R7 on **8812**. Three R7 probes hard-code 8811 (`probe-pin2card.js`, `probe-body.js`,
`probe-transfer.js`), so R8 must be on 8811. `<scratch>` and `<out>` are your own scratch directories. Commit only the
results you cite, never screenshots in bulk.

## 0. Trees and gates

```bash
R8=<deploy sha>; R7=badcc20d
git worktree add --detach ../eval-r8 $R8 && cd ../eval-r8/tools && npm install --no-audit --no-fund
npm run validate && npm test && npm run beta:check      # all green, or stop and report: 180 pages, 84 place pages today
git worktree add --detach ../eval-r7 $R7                # baseline tree, served only
(cd ../eval-r8 && python3 -m http.server 8811 --bind 127.0.0.1 &)   # R8
(cd ../eval-r7 && python3 -m http.server 8812 --bind 127.0.0.1 &)   # R7
```

`npm test` includes, since R7, the CSS `:has()` guard (`beta/test-css-has.js`), the recognition data test, the PERF-08
lens outcome checks (a)–(h) in `test-beta.js`, and the sync-push scratch-repo test. Run **one** `npm test` at a time.

## 1. The R7 commands, re-pointed (run from `../eval-r8/tools` unless noted)

```bash
node beta/metrics.js --all --out <scratch>/all.json                                # every page, default view
node beta/metrics.js --only cities/tokyo --out <scratch>/tokyo-N.json              # ×3, machine idle
node beta/metrics.js --view atlas --only cities/tokyo --out <scratch>/atlas-N.json # ×2, machine idle
NODE_PATH=$(npm root -g) node beta/atlas-ms.js --out <scratch>/atlasms --no-shots  # Atlas lane's probe, unchanged
# from the repo root of ../eval-r8; the R7 tools are the same files R7 used
E=design/beta/eval/r7/tools
node $E/shots-r7.js r8 8811 <out>/r8 && node $E/shots-r7.js r7 8812 <out>/r7
node $E/shots-extra.js 8811 <out>/r8 && node $E/shots-extra.js 8811 <out>/r8 --motion && node $E/shots-extra.js 8812 <out>/r7
python3 design/beta/eval/r8/tools/pair.py <out>/r7 <out>/r8 design/beta/eval/r8 landing,japan,tokyo,... $R8   # R7 | R8 labels
node $E/probe-atlas-r7.js 8811 <out>/atlas.json && node $E/probe-pin2card.js && node $E/probe-day.js 8811 <out>
node $E/probe-axe.js 8811 tools/beta/qa/vendor/axe.min.js <out>/axe-r8.json       # serious/critical; target 0
node $E/probe-type.js 8811 R8 <out>/type-r8.json && python3 $E/probe-css.py ../eval-r8 R8
node $E/probe-transfer.js && node $E/probe-body.js
```

## 2. Probes added since R7 (run from `../eval-r8/tools`; each prints PASS/FAIL against its own target)

| What | Command | Target / R7-era reference |
|---|---|---|
| Core Web Vitals, 4× CPU, median of 3 (LCP, CLS, TBT; INP on Tokyo's main interactions) | `npm run beta:perf` | phone LCP ≤ 2.0 s, phone CLS ≤ 0.05, INP ≤ 200 ms. PERF-06: Gallery CLS phone 0–0.007, desktop 0.001. PERF-08: Tokyo INP phone Atlas switch 1,240 ms, filter 544 ms (still over target; see docs/BETA-PERF-AUDIT.md) |
| Photo sizes per slot + Tokyo first load (phone @3×) | `npm run beta:qa:w8p` | first load ≤ 700 KB (651 KB at 3a0ecfec); no 960w in a < 200 px slot |
| Offline city pack (W9-8), Tokyo phone + desktop | `npm run beta:qa:pack` | kept; survives a deploy; every place offline; size within 10 % |
| QA-70: map pill → first pin, phone Gallery | `beta/qa/first-pin.sh $R8 cities/tokyo.html` (and `cities/newyork.html`, and `$R7` for the baseline) | 3ba696e8: Tokyo 1,653 ms, New York 1,807 ms; be74c82f 1,564 / 1,760 (median of 3, unthrottled) |
| QC sweep (every page × 390/768/1024/1440, light + dark) | `NODE_PATH=$(npm root -g) node beta/qa/qc.js --label r8-$R8 --only sweep --jobs 4` | S-12 (no layout shift): 1440 light 91/91 PASS at 3a0ecfec, max 0.0044. Writes design/beta/eval/qc/<label>/ |
| Lens + reachability (G1) | `node beta/qa/w7.js --only lens,reach` (≈ 20 min; no `timeout` shorter than that, or the browser is killed mid-run) | 21/21 at bcf94510 |
| Views + honesty | `node beta/qa/views.js` | honesty FAILs are register items (D-42); one known at 995e2529 (Cleveland Guidebook, Birdietown) |
| Gallery and Atlas G1 metrics | `node beta/metrics.js --only cities/tokyo` and `--view atlas` | B-07, B-08 (the `.cbar, .mappill` exemption), first-load row ≤ 2 MB (map tiles excluded) |

## 3. Where the numbers to compare live

- Performance audit trail: [docs/BETA-PERF-AUDIT.md](../../../../docs/BETA-PERF-AUDIT.md) (PERF-01 … PERF-16).
- The register: [docs/BETA-ISSUES.md](../../../../docs/BETA-ISSUES.md). An item is closed only when QA verifies it on a SHA.
- R7's own results: [../r7/](../r7/) (`budgets-r7.md`, `axe-summary-r7.txt`, `beta-metrics-all-r7.md`, `metrics-tokyo*-r7.json`).

## 4. Known measurement pitfalls

- Run timing probes (`beta:perf`, `first-pin.sh`, the metrics ×3 runs) alone, never alongside `npm test`, a QC sweep or a
  build. Concurrent load moves INP and first-pin by hundreds of ms.
- Absolute times differ between harnesses: `first-pin.sh` reads lower than QA's harness did (≈ 1.6 s vs 2.45 s on the
  same SHA). Compare deltas between SHAs on one harness, not absolutes across harnesses.
- `perf.js` runs with reduced motion; a probe without it can miss shifts hidden by animation (PERF-06's 0.105 rail shift
  showed only with reduced motion).
- Tiles are stubbed with a 1×1 PNG in every probe; LCP is the rendering share, not network latency.
