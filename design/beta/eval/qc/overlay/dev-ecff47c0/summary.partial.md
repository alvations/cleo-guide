# S-17 overlay and chrome · dev-ecff47c0

500 runs (42 pages; viewports 390x844, 390x664, 844x390, 768x1024, 1024x768, 1440x900; themes light, dark; views atlas, gallery, guidebook, insights, sheet). Errors: 0.

## Distributions (median / p90 / max)

| Metric | All | Atlas | Sheet |
|---|---|---|---|
| chrome bands % of height (load) | 24.6 / 39 / 39 | — | — |
| chrome area % (load) | 27.4 / 41.6 / 41.6 | — | — |
| clear map % of viewport (labels excluded) | 65.2 / 83.6 / 83.6 | — | — |
| clear map % of pane | 77.4 / 97.4 / 97.4 | — | — |
| label count | 5 / 10 / 12 | — | — |
| label coverage % of map | 9.8 / 11.6 / 12.6 | — | — |
| widest label % of map width | 36.9 / 64.6 / 90.8 | — | — |

## Instance groups (kind · view · viewport): runs, worst, screenshot

| Kind | View | Viewport | Failing runs / of (pages) | Budget | Worst | Page · theme | Owner | Shot |
|---|---|---|---|---|---|---|---|---|
| firstScreenChrome | default | 844x390 | 84 / 84 (42) | ≤ 13 % | 39 | cleveland.html · light | FE-A (header, switch) + Atlas FE-1 (chip row, peek) | — |
| firstScreenClear | default | 844x390 | 84 / 84 (42) | ≥ 80 % | 58.4 | cleveland.html · light | FE-A (header, switch) + Atlas FE-1 (chip row, peek) | — |
