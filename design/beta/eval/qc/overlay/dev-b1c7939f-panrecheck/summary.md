# S-17 overlay and chrome · dev-b1c7939f-panrecheck

52 runs (13 pages; viewports 390x844, 844x390; themes light, dark; views atlas). Errors: 0.

## Distributions (median / p90 / max)

| Metric | All | Atlas | Sheet |
|---|---|---|---|
| chrome bands % of height (load) | 12.4 / 24.6 / 24.6 | 24.6 / 24.6 / 24.6 | — |
| chrome area % (load) | 15.2 / 27.4 / 27.4 | 27.4 / 27.4 / 27.4 | — |
| clear map % of viewport (labels excluded) | 84.8 / 84.8 / 84.8 | 84.8 / 84.8 / 84.8 | — |
| clear map % of pane | 96.7 / 96.7 / 96.7 | 96.7 / 96.7 / 96.7 | — |
| label count | 5 / 6 / 7 | 5 / 6 / 7 | — |
| label coverage % of map | 10.2 / 11.3 / 11.5 | 10.2 / 11.3 / 11.5 | — |
| widest label % of map width | 37.4 / 39.7 / 39.7 | 37.4 / 39.7 / 39.7 | — |

## Instance groups (kind · view · viewport): runs, worst, screenshot

| Kind | View | Viewport | Failing runs / of (pages) | Budget | Worst | Page · theme | Owner | Shot |
|---|---|---|---|---|---|---|---|---|
| labelCov | atlas | 844x390 | 24 / 24 (12) | ≤ 8 % of the map | 10.2 | cities/chicago.html · light | Atlas FE-1 + FE-2 | `design/beta/eval/qc/overlay/dev-b1c7939f-panrecheck/shots/labelCov_atlas_844x390_light_cities-chicago-html.jpg` |
| duplicates | atlas | 390x844 | 24 / 24 (12) | one control per action | search ×2 (search bruges + Search Bruges) | cities/bruges.html · light | FE-B (search.js) + FE-A (city search) + designer | `design/beta/eval/qc/overlay/dev-b1c7939f-panrecheck/shots/duplicates_atlas_390x844_light_cities-bruges-html.jpg` |
| labelCov | atlas | 390x844 | 22 / 24 (11) | ≤ 8 % of the map | 11.5 | cities/madison.html · light | Atlas FE-1 + FE-2 | `design/beta/eval/qc/overlay/dev-b1c7939f-panrecheck/shots/labelCov_atlas_390x844_light_cities-madison-html.jpg` |
| dragFromDot | atlas | 390x844 | 16 / 24 (8) | a drag anywhere on the map pans | 1 start point(s) near the centre did not pan | cities/bruges.html · light | Atlas FE-1 | `design/beta/eval/qc/overlay/dev-b1c7939f-panrecheck/shots/dragFromDot_atlas_390x844_light_cities-bruges-html.jpg` |
| dragFromDot | atlas | 844x390 | 14 / 24 (8) | a drag anywhere on the map pans | 1 start point(s) near the centre did not pan | cities/chicago.html · light | Atlas FE-1 | `design/beta/eval/qc/overlay/dev-b1c7939f-panrecheck/shots/dragFromDot_atlas_844x390_light_cities-chicago-html.jpg` |
| controlCovered | atlas | 844x390 | 2 / 24 (1) | none: every shown control is reachable | 日本語 under filters | cities/harrisburg.html · light | Atlas FE-1 | `design/beta/eval/qc/overlay/dev-b1c7939f-panrecheck/shots/controlCovered_atlas_844x390_light_cities-harrisburg-html.jpg` |
