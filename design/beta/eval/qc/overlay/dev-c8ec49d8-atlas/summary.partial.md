# S-17 overlay and chrome · dev-c8ec49d8-atlas

1500 runs (82 pages; viewports 390x844, 390x664, 844x390, 768x1024, 1024x768, 1440x900; themes light, dark; views atlas). Errors: 0.

## Distributions (median / p90 / max)

| Metric | All | Atlas | Sheet |
|---|---|---|---|
| chrome bands % of height (load) | 15.3 / 31.3 / 31.3 | 15.3 / 31.3 / 31.3 | — |
| chrome area % (load) | 16.4 / 34.8 / 34.8 | 16.4 / 34.8 / 34.8 | — |
| clear map % of viewport (labels excluded) | 72.6 / 84.8 / 84.8 | 72.6 / 84.8 / 84.8 | — |
| clear map % of pane | 88.1 / 97.9 / 97.9 | 88.1 / 97.9 / 97.9 | — |
| label count | 4 / 9 / 12 | 5 / 9 / 12 | — |
| label coverage % of map | 5.5 / 7.1 / 7.6 | 6.1 / 7.2 / 7.6 | — |
| widest label % of map width | 34.4 / 39.7 / 39.8 | 34.7 / 39.7 / 39.8 | — |

## Instance groups (kind · view · viewport): runs, worst, screenshot

| Kind | View | Viewport | Failing runs / of (pages) | Budget | Worst | Page · theme | Owner | Shot |
|---|---|---|---|---|---|---|---|---|
| duplicates | atlas | 390x844 | 87 / 87 (44) | one control per action | search ×2 (search cleveland + Search Cleveland) | cleveland.html · light | FE-B (search.js) + FE-A (city search) + designer | — |
| duplicates | atlas | 390x664 | 86 / 86 (43) | one control per action | search ×2 (search cleveland + Search Cleveland) | cleveland.html · light | FE-B (search.js) + FE-A (city search) + designer | — |
| duplicates | atlas | 768x1024 | 86 / 86 (43) | one control per action | search ×2 (search cleveland + Search Cleveland) | cleveland.html · dark | FE-B (search.js) + FE-A (city search) + designer | — |
| attributionDesk | atlas | 1024x768 | 86 / 86 (43) | one line ≤ 20 px, inside the map pane, over no control or label | 28 px tall; inside the map pane; over: nothing | cleveland.html · light | Atlas FE-1 | — |
| attributionDesk | atlas | 1440x900 | 85 / 85 (43) | one line ≤ 20 px, inside the map pane, over no control or label | 28 px tall; inside the map pane; over: nothing | cleveland.html · light | Atlas FE-1 | — |
| dragFromDot | atlas | 390x844 | 29 / 87 (15) | a drag anywhere on the map pans | 2 start point(s) near the centre did not pan | cleveland.html · light | Atlas FE-1 | — |
| dragFromDot | atlas | 390x664 | 29 / 86 (15) | a drag anywhere on the map pans | 2 start point(s) near the centre did not pan | cleveland.html · light | Atlas FE-1 | — |
| dragFromDot | atlas | 1024x768 | 23 / 86 (12) | a drag anywhere on the map pans | 2 start point(s) near the centre did not pan | cities/philadelphia.html · light | Atlas FE-1 | — |
| dragFromDot | atlas | 844x390 | 22 / 86 (12) | a drag anywhere on the map pans | 2 start point(s) near the centre did not pan | cities/philadelphia.html · light | Atlas FE-1 | — |
| dragFromDot | atlas | 1440x900 | 18 / 85 (10) | a drag anywhere on the map pans | 2 start point(s) near the centre did not pan | cities/newyork.html · light | Atlas FE-1 | — |
| dragFromDot | atlas | 768x1024 | 9 / 86 (6) | a drag anywhere on the map pans | 1 start point(s) near the centre did not pan | cities/miami.html · light | Atlas FE-1 | — |
| controlCollision | atlas | 768x1024 | 2 / 86 (1) | none | 日本語 / atlas | cities/akron.html · light | Atlas FE-1 | — |
| controlCovered | atlas | 768x1024 | 2 / 86 (1) | none: every shown control is reachable | 日本語 under atlas | cities/harrisburg.html · dark | Atlas FE-1 | — |
