# Budgets — R7 `badcc20d` (evaluator, idle container)

`metrics.js` rows, Tokyo, measured three times in the default view (Gallery) and twice with `--view atlas`, after the
179-page sweep had finished (no other load on the container). Transfer = gzip for text, as sent for images and fonts;
raw (uncompressed) in brackets. "First load" = the new row proposed in D-38: no scroll, network idle + 2 s, each URL once.
"Session" = everything the harness fetched over all its probes, including the reachability scroll that loads every lazy
card photo (each URL once).

| Measure | Run 1 | Run 2 | Run 3 | Budget (as ROUND-1 framed it) | Verdict |
|---|---:|---:|---:|---|---|
| Tokyo default · first load, desktop 1440×900 | 652 KB (1,696) | 652 KB (1,696) | 652 KB (1,696) | ≤ 2.0 MB page transfer | ✅ |
| Tokyo default · first load, phone 390×844 @3× | 940 KB (1,984) | 940 KB (1,984) | 940 KB (1,984) | ≤ 2.0 MB | ✅ (raw 1,984 KB is 0.8 % under the line) |
| Tokyo default · session (info) | 3,423 KB | 3,423 KB | 3,423 KB | — (information) | over 2.0 MB, because the reachability scroll loads all 34 card photos |
| Tokyo default · FCP at 4× CPU | 340 ms | 372 ms | 300 ms | ≤ 1.0 s | ✅ median 340 ms |
| Tokyo default · DOM (desktop / phone) | 2,855 / 2,254 | | | ≤ 3,000 (B-44) | ✅ |
| Tokyo Atlas · first load, desktop | 612 KB (1,757) | 612 KB (1,757) | — | ≤ 2.0 MB | ✅ |
| Tokyo Atlas · first load, phone @3× | 1,020 KB (2,165) | 1,020 KB (2,165) | — | ≤ 2.0 MB | ✅ (raw is over 2.0 MB) |
| Tokyo Atlas · session (info) | 3,484 KB | 3,484 KB | — | — | information |
| Tokyo Atlas · FCP at 4× CPU | 304 ms | 348 ms | — | ≤ 1.0 s | ✅ |
| Tokyo Atlas · DOM (desktop / phone) | 2,422 / 2,453 | | | ≤ 3,000 | ✅ |
| Tokyo `#p=kanda-myojin` deep link · DOM, phone | 2,208 | | | ≤ 3,000 (R6 gap #5) | ✅ (R6: 13,928) |
| Eager JS, gzip | 28.62 KB (platform figure; `test-beta.js` enforces ≤ 40.0 unrounded and passes) | | | ≤ 40 KB | ✅ |

Whole beta (`beta-metrics-all-r7.md`, 179 pages): first-load transfer ≤ 2.0 MB on **179/179** (largest: New York phone
1,038 KB, raw 2,036 KB); FCP 4× ≤ 1.0 s on **179/179** (slowest 676 ms, Okinawa, during the overlapping run). Session
bytes exceed 2.0 MB on 2 pages (Tokyo 3,423 KB, New York 2,648 KB).

By resource, first load (`probe-transfer.js`, uncompressed bodies, load + 3 s): phone @3× Tokyo default R6 1,473 KB → R7
2,496 KB, of which photos 1,108 KB and fonts 88 KB (R6 189 KB). A phone @3× fetches the **960w** JPEG for 104 px carousel
thumbnails and 42vw cards (e.g. `tokyo--imperial-palace-east-gardens-960.jpg`, 241 KB). See `transfer-by-resource.txt`.
