# R6 budgets (evaluator) — tree `2f227631`

Harness: `tools/beta/metrics.js` (uncompressed bytes; FCP with 4× CPU throttle), run on an otherwise idle container after
the full sweep. Budget: Tokyo default view ≤ 2.0 MB, FCP 4× ≤ 1.0 s.

| Run | View | Bytes | DOM | FCP | FCP 4× |
|---|---|---:|---:|---:|---:|
| `--all` sweep (concurrency 2) | default (Gallery) | 1,952 KB | 2,534 | 260 ms | 464 ms |
| `--only cities/tokyo` #1 | default (Gallery) | 1,952 KB | 2,534 | 268 ms | 356 ms |
| `--only cities/tokyo` #2 | default (Gallery) | 1,952 KB | 2,534 | 280 ms | 508 ms |
| `--only cities/tokyo` #3 | default (Gallery) | 1,952 KB | 2,534 | 280 ms | 464 ms |
| `--view atlas --only cities/tokyo` | **Atlas** | **2,043 KB** | 1,835 | 220 ms | 420 ms |

- **Tokyo default: 1,952 KB ✅ (48 KB headroom), FCP 4× median 464 ms ✅.** R5 `f2bf7610`: 3.03 MB and 1,124 ms.
- **Atlas view weight: 2,043 KB** for Tokyo, over 2.0 MB (the budget is set on the default view). By resource on a phone
  (`transfer-by-resource.txt`, tiles blocked): Tokyo Atlas 1,590 KB in R6 vs 1,400 KB in R5, because Leaflet (144 KB) now
  loads at once on phones.
- **Whole beta, default view (`--all`):** 0 of 179 pages over 2,000 KB (largest: Okinawa 1,979, Tokyo 1,952, Hokkaido
  1,889 KB); 0 pages with FCP 4× over 1,000 ms (slowest: Miami 836 ms).
- **B-07 is flaky on large cities.** It is ✅ in run #1 and in Atlas, and "pin sheet none" in runs #2 and #3: at the phone
  map's opening zoom every marker is a cluster bubble, and the probe only taps an individual pin.
