# S-17 overlay and chrome · dev-b1c7939f-atlas-PL

720 runs (98 pages; viewports 844x390, 390x844; themes light, dark; views atlas). Errors: 0.

## Distributions (median / p90 / max)

| Metric | All | Atlas | Sheet |
|---|---|---|---|
| chrome bands % of height (load) | 12.3 / 24.6 / 24.6 | 24.6 / 24.6 / 24.6 | — |
| chrome area % (load) | 15.2 / 27.4 / 27.4 | 27.4 / 27.4 / 27.4 | — |
| clear map % of viewport (labels excluded) | 84.8 / 84.8 / 84.8 | 84.8 / 84.8 / 84.8 | — |
| clear map % of pane | 96.7 / 96.7 / 96.7 | 96.7 / 96.7 / 96.7 | — |
| label count | 4 / 6 / 7 | 4 / 6 / 7 | — |
| label coverage % of map | 9.2 / 10.9 / 11.6 | 9.2 / 10.9 / 11.6 | — |
| widest label % of map width | 35.1 / 39.7 / 39.7 | 35.1 / 39.7 / 39.7 | — |

## Instance groups (kind · view · viewport): runs, worst, screenshot

| Kind | View | Viewport | Failing runs / of (pages) | Budget | Worst | Page · theme | Owner | Shot |
|---|---|---|---|---|---|---|---|---|
| duplicates | atlas | 390x844 | 164 / 164 (82) | one control per action | search ×2 (search cleveland + Search Cleveland) | cleveland.html · light | FE-B (search.js) + FE-A (city search) + designer | `design/beta/eval/qc/overlay/dev-b1c7939f-atlas-PL/shots/duplicates_atlas_390x844_light_cleveland-html.jpg` |
| labelCov | atlas | 844x390 | 100 / 164 (50) | ≤ 8 % of the map | 10.4 | cities/newyork.html · light | Atlas FE-1 + FE-2 | `design/beta/eval/qc/overlay/dev-b1c7939f-atlas-PL/shots/labelCov_atlas_844x390_light_cities-newyork-html.jpg` |
| labelCov | atlas | 390x844 | 94 / 164 (47) | ≤ 8 % of the map | 11.6 | cities/hokkaido.html · light | Atlas FE-1 + FE-2 | `design/beta/eval/qc/overlay/dev-b1c7939f-atlas-PL/shots/labelCov_atlas_390x844_light_cities-hokkaido-html.jpg` |
| attribution | atlas | 844x390 | 15 / 164 (8) | collapses to ⓘ on the first pan or after 5 s | 174 px wide 1.5 s after a pan | cities/chicago.html · light | Atlas FE-1 | `design/beta/eval/qc/overlay/dev-b1c7939f-atlas-PL/shots/attribution_atlas_844x390_light_cities-chicago-html.jpg` |
| controlCollision | atlas | 844x390 | 14 / 164 (7) | none | 日本語 / filters | cities/akron.html · light | Atlas FE-1 | `design/beta/eval/qc/overlay/dev-b1c7939f-atlas-PL/shots/controlCollision_atlas_844x390_light_cities-akron-html.jpg` |
| chromePan | atlas | 390x844 | 12 / 164 (6) | ≤ 8 % at 300 ms into a pan | 24.6 | cities/bruges.html · light | FE-A (header, switch) + Atlas FE-1 (chip row, peek) | `design/beta/eval/qc/overlay/dev-b1c7939f-atlas-PL/shots/chromePan_atlas_390x844_light_cities-bruges-html.jpg` |
| clearPan | atlas | 390x844 | 12 / 164 (6) | ≥ 90 % during a pan | 72.6 | cities/bruges.html · light | Atlas FE-1 | `design/beta/eval/qc/overlay/dev-b1c7939f-atlas-PL/shots/clearPan_atlas_390x844_light_cities-bruges-html.jpg` |
| attribution | atlas | 390x844 | 12 / 164 (6) | collapses to ⓘ on the first pan or after 5 s | 174 px wide 1.5 s after a pan | cities/bruges.html · light | Atlas FE-1 | `design/beta/eval/qc/overlay/dev-b1c7939f-atlas-PL/shots/attribution_atlas_390x844_light_cities-bruges-html.jpg` |
| controlCovered | atlas | 844x390 | 8 / 164 (4) | none: every shown control is reachable | 日本語 under filters | cities/harrisburg.html · light | Atlas FE-1 | `design/beta/eval/qc/overlay/dev-b1c7939f-atlas-PL/shots/controlCovered_atlas_844x390_light_cities-harrisburg-html.jpg` |
