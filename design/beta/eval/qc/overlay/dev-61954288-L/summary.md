# S-17 overlay and chrome · dev-61954288-L

360 runs (98 pages; viewports 844x390; themes light, dark; views atlas). Errors: 0.

## Distributions (median / p90 / max)

| Metric | All | Atlas | Sheet |
|---|---|---|---|
| chrome bands % of height (load) | 12.3 / 12.3 / 12.3 | 12.3 / 12.3 / 12.3 | — |
| chrome area % (load) | 15.2 / 15.2 / 15.2 | 15.2 / 15.2 / 15.2 | — |
| clear map % of viewport (labels excluded) | 84.8 / 84.8 / 84.8 | 84.8 / 84.8 / 84.8 | — |
| clear map % of pane | 96.7 / 96.7 / 96.7 | 96.7 / 96.7 / 96.7 | — |
| label count | 3 / 5 / 6 | 3 / 5 / 6 | — |
| label coverage % of map | 9.4 / 10.6 / 11.2 | 9.4 / 10.6 / 11.2 | — |
| widest label % of map width | 25.9 / 34.7 / 41.9 | 25.9 / 34.7 / 41.9 | — |

## Instance groups (kind · view · viewport): runs, worst, screenshot

| Kind | View | Viewport | Failing runs / of (pages) | Budget | Worst | Page · theme | Owner | Shot |
|---|---|---|---|---|---|---|---|---|
| labelCov | atlas | 844x390 | 102 / 164 (51) | ≤ 8 % of the map | 11.2 | cities/newyork.html · dark | Atlas FE-1 + FE-2 | `design/beta/eval/qc/overlay/dev-61954288-L/shots/labelCov_atlas_844x390_dark_cities-newyork-html.jpg` |
| controlCollision | atlas | 844x390 | 14 / 164 (7) | none | 日本語 / filters | cities/akron.html · light | Atlas FE-1 | `design/beta/eval/qc/overlay/dev-61954288-L/shots/controlCollision_atlas_844x390_light_cities-akron-html.jpg` |
| attribution | atlas | 844x390 | 13 / 164 (8) | collapses to ⓘ on the first pan or after 5 s | 174 px wide 1.5 s after a pan | cities/chicago.html · light | Atlas FE-1 | `design/beta/eval/qc/overlay/dev-61954288-L/shots/attribution_atlas_844x390_light_cities-chicago-html.jpg` |
| controlCovered | atlas | 844x390 | 8 / 164 (4) | none: every shown control is reachable | 日本語 under filters | cities/harrisburg.html · light | Atlas FE-1 | `design/beta/eval/qc/overlay/dev-61954288-L/shots/controlCovered_atlas_844x390_light_cities-harrisburg-html.jpg` |
| labelWidth | atlas | 844x390 | 4 / 164 (2) | ≤ 40 % of the map width | 41.9 % (Youngstown Historical Center of Industry and Labor) | cities/youngstown.html · light | Atlas FE-1 + FE-2 | `design/beta/eval/qc/overlay/dev-61954288-L/shots/labelWidth_atlas_844x390_light_cities-youngstown-html.jpg` |
