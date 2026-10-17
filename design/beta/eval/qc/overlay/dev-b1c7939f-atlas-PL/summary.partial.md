# S-17 overlay and chrome · dev-b1c7939f-atlas-PL

500 runs (82 pages; viewports 844x390, 390x844; themes light, dark; views atlas). Errors: 0.

## Distributions (median / p90 / max)

| Metric | All | Atlas | Sheet |
|---|---|---|---|
| chrome bands % of height (load) | 24.6 / 24.6 / 24.6 | 24.6 / 24.6 / 24.6 | — |
| chrome area % (load) | 27.4 / 27.4 / 27.4 | 27.4 / 27.4 / 27.4 | — |
| clear map % of viewport (labels excluded) | 84.8 / 84.8 / 84.8 | 84.8 / 84.8 / 84.8 | — |
| clear map % of pane | 96.7 / 96.7 / 96.7 | 96.7 / 96.7 / 96.7 | — |
| label count | 4 / 6 / 7 | 5 / 6 / 7 | — |
| label coverage % of map | 9.5 / 11 / 11.6 | 9.9 / 11 / 11.6 | — |
| widest label % of map width | 35.5 / 39.7 / 39.7 | 36.5 / 39.7 / 39.7 | — |

## Instance groups (kind · view · viewport): runs, worst, screenshot

| Kind | View | Viewport | Failing runs / of (pages) | Budget | Worst | Page · theme | Owner | Shot |
|---|---|---|---|---|---|---|---|---|
| duplicates | atlas | 390x844 | 86 / 86 (43) | one control per action | search ×2 (search cleveland + Search Cleveland) | cleveland.html · light | FE-B (search.js) + FE-A (city search) + designer | — |
| labelCov | atlas | 844x390 | 74 / 86 (37) | ≤ 8 % of the map | 10.4 | cities/newyork.html · light | Atlas FE-1 + FE-2 | — |
| labelCov | atlas | 390x844 | 74 / 86 (37) | ≤ 8 % of the map | 11.6 | cities/hokkaido.html · light | Atlas FE-1 + FE-2 | — |
| attribution | atlas | 844x390 | 15 / 86 (8) | collapses to ⓘ on the first pan or after 5 s | 174 px wide 1.5 s after a pan | cities/chicago.html · light | Atlas FE-1 | — |
| chromePan | atlas | 390x844 | 12 / 86 (6) | ≤ 8 % at 300 ms into a pan | 24.6 | cities/bruges.html · light | FE-A (header, switch) + Atlas FE-1 (chip row, peek) | — |
| clearPan | atlas | 390x844 | 12 / 86 (6) | ≥ 90 % during a pan | 72.6 | cities/bruges.html · light | Atlas FE-1 | — |
| attribution | atlas | 390x844 | 12 / 86 (6) | collapses to ⓘ on the first pan or after 5 s | 174 px wide 1.5 s after a pan | cities/bruges.html · light | Atlas FE-1 | — |
| controlCollision | atlas | 844x390 | 2 / 86 (1) | none | 日本語 / filters | cities/akron.html · light | Atlas FE-1 | — |
| controlCovered | atlas | 844x390 | 2 / 86 (1) | none: every shown control is reachable | 日本語 under filters | cities/harrisburg.html · light | Atlas FE-1 | — |
