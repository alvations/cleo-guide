# S-17 overlay and chrome · dev-c8ec49d8-atlas

1000 runs (82 pages; viewports 390x844, 390x664, 844x390, 768x1024, 1024x768, 1440x900; themes light, dark; views atlas). Errors: 0.

## Distributions (median / p90 / max)

| Metric | All | Atlas | Sheet |
|---|---|---|---|
| chrome bands % of height (load) | 15.3 / 31.3 / 31.3 | 24.6 / 31.3 / 31.3 | — |
| chrome area % (load) | 16.4 / 34.8 / 34.8 | 27.4 / 34.8 / 34.8 | — |
| clear map % of viewport (labels excluded) | 72.6 / 84.8 / 84.8 | 72.6 / 84.8 / 84.8 | — |
| clear map % of pane | 88.1 / 97.9 / 97.9 | 88.1 / 96.7 / 96.7 | — |
| label count | 4 / 8 / 12 | 4 / 10 / 10 | — |
| label coverage % of map | 5.3 / 7 / 7.6 | 6.3 / 7.2 / 7.2 | — |
| widest label % of map width | 34.2 / 39.7 / 39.8 | 38.8 / 39.6 / 39.6 | — |

## Instance groups (kind · view · viewport): runs, worst, screenshot

| Kind | View | Viewport | Failing runs / of (pages) | Budget | Worst | Page · theme | Owner | Shot |
|---|---|---|---|---|---|---|---|---|
| duplicates | atlas | 390x844 | 4 / 4 (2) | one control per action | search ×2 (search cleveland + Search Cleveland) | cleveland.html · light | FE-B (search.js) + FE-A (city search) + designer | — |
| duplicates | atlas | 390x664 | 4 / 4 (2) | one control per action | search ×2 (search cleveland + Search Cleveland) | cleveland.html · light | FE-B (search.js) + FE-A (city search) + designer | — |
| dragFromDot | atlas | 390x844 | 2 / 4 (1) | a drag anywhere on the map pans | 2 start point(s) near the centre did not pan | cleveland.html · light | Atlas FE-1 | — |
| dragFromDot | atlas | 390x664 | 2 / 4 (1) | a drag anywhere on the map pans | 2 start point(s) near the centre did not pan | cleveland.html · light | Atlas FE-1 | — |
| duplicates | atlas | 768x1024 | 2 / 2 (1) | one control per action | search ×2 (search cleveland + Search Cleveland) | cleveland.html · dark | FE-B (search.js) + FE-A (city search) + designer | — |
| dragFromDot | atlas | 1024x768 | 2 / 2 (1) | a drag anywhere on the map pans | 1 start point(s) near the centre did not pan | cleveland.html · light | Atlas FE-1 | — |
| attributionDesk | atlas | 1024x768 | 2 / 2 (1) | one line ≤ 20 px, inside the map pane, over no control or label | 28 px tall; inside the map pane; over: nothing | cleveland.html · light | Atlas FE-1 | — |
