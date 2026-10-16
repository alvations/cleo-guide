# Budgets — R8 `b54b3745` (evaluator, idle container)

`metrics.js` rows for Tokyo: three runs in the default view (Gallery) and two with `--view atlas`, run after the 180-page
sweep had finished, with nothing else running. Transfer is gzip for text, and images and fonts as sent; raw
(uncompressed) is in brackets. "First load" means no scroll, network idle + 2 s, each URL once (the D-38 row). R7's figures
are from [`../r7/budgets-r7.md`](../r7/budgets-r7.md).

| Measure | Run 1 | Run 2 | Run 3 | R7 `badcc20d` | Budget | Verdict |
|---|---:|---:|---:|---:|---|---|
| Tokyo default · first load, desktop 1440×900 | 661 KB (1,736) | 661 KB (1,736) | 661 KB (1,736) | 652 KB (1,696) | ≤ 2.0 MB | ✅ |
| Tokyo default · first load, phone 390×844 @3× | 621 KB (1,696) | 621 KB (1,696) | 621 KB (1,696) | 940 KB (1,984) | ≤ 2.0 MB | ✅ (−34 %) |
| Tokyo default · FCP at 4× CPU | 512 ms | 456 ms | 292 ms | 340 ms median | ≤ 1.0 s | ✅ median 456 ms (wide spread; the R7 median sits inside it) |
| Tokyo default · DOM, desktop / phone | 3,074 / 2,443 | | | 2,855 / 2,254 | ≤ 3,000 (M3-06) | ❌ desktop **3,074** (+74, 2.5 %; waived by D-45) · phone ✅ |
| Tokyo default · session bytes (info) | 7,745 KB | | | 3,423 KB | — | information: the reachability scroll now loads 4× more card photos |
| Tokyo Atlas · first load, desktop | 628 KB (1,820) | 628 KB (1,820) | — | 612 KB (1,757) | ≤ 2.0 MB | ✅ |
| Tokyo Atlas · first load, phone @3× | 616 KB (1,809) | 616 KB (1,809) | — | 1,020 KB (2,165) | ≤ 2.0 MB | ✅ (raw now under 2.0 MB too) |
| Tokyo Atlas · FCP at 4× CPU | 344 ms | 256 ms | — | 304 / 348 ms | ≤ 1.0 s | ✅ |
| Tokyo Atlas · DOM, desktop / phone | 2,591 / 2,604 | | | 2,422 / 2,453 | ≤ 3,000 | ✅ |
| Tokyo `#p=kanda-myojin` deep link · DOM, phone | 2,390 | | | 2,208 | ≤ 3,000 | ✅ (`probe-transfer.js`) |

Whole beta ([`beta-metrics-all-r8.md`](beta-metrics-all-r8.md), 180 pages): first-load transfer ≤ 2.0 MB on **180/180**
(largest: Hokkaido phone 883 KB, Chicago desktop 875 KB); FCP at 4× ≤ 1.0 s on **180/180** (slowest: Chicago, 656 ms).

By resource, first load ([`transfer-by-resource-r8.txt`](transfer-by-resource-r8.txt), uncompressed bodies, load + 3 s),
on a phone @3×: Tokyo default R7 2,496 KB → R8 1,880 KB (photos 1,108 → 452 KB); Tokyo Atlas 2,678 → 1,809 KB (photos
1,145 → 224 KB). The cost is sharpness: a card slot 289 CSS px wide on a 3× phone gets the 500w copy (`sizes` caps it at
166 px, D-40a), so it is drawn about 1.7× upscaled ([`probe-r8.json`](probe-r8.json)).
