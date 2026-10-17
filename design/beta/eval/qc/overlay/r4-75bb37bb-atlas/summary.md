# S-17 overlay and chrome · r4-75bb37bb-atlas

2160 runs (98 pages; viewports 390x844, 390x664, 844x390, 768x1024, 1024x768, 1440x900; themes light, dark; views atlas). Errors: 0.

## Distributions (median / p90 / max)

| Metric | All | Atlas | Sheet |
|---|---|---|---|
| chrome bands % of height (load) | 13.5 / 31.3 / 31.3 | 15.3 / 31.3 / 31.3 | — |
| chrome area % (load) | 15.2 / 34.7 / 34.7 | 16.3 / 34.7 / 34.7 | — |
| clear map % of viewport (labels excluded) | 72.7 / 84.8 / 84.8 | 72.7 / 84.8 / 84.8 | — |
| clear map % of pane | 96.8 / 98.3 / 98.3 | 96.8 / 98.3 / 98.3 | — |
| label count | 4 / 8 / 12 | 4 / 8 / 12 | — |
| label coverage % of map | 5.3 / 7 / 7.6 | 5.3 / 7 / 7.6 | — |
| widest label % of map width | 34 / 39.7 / 39.8 | 34 / 39.7 / 39.8 | — |

## Instance groups (kind · view · viewport): runs, worst, screenshot

| Kind | View | Viewport | Failing runs / of (pages) | Budget | Worst | Page · theme | Owner | Shot |
|---|---|---|---|---|---|---|---|---|
| controlCovered | atlas | 768x1024 | 8 / 164 (4) | none: every shown control is reachable | 日本語 under atlas | cities/harrisburg.html · light | Atlas FE-1 | `design/beta/eval/qc/overlay/r4-75bb37bb-atlas/shots/controlCovered_atlas_768x1024_light_cities-harrisburg-html.jpg` |
| controlCollision | atlas | 768x1024 | 6 / 164 (3) | none | 日本語 / atlas | cities/akron.html · light | Atlas FE-1 | `design/beta/eval/qc/overlay/r4-75bb37bb-atlas/shots/controlCollision_atlas_768x1024_light_cities-akron-html.jpg` |
| duplicates | page | 768x1024 | 6 / 32 (3) | one control per action | search ×2 (search all guides + search) | Singapore/hanoi.html · light | FE-B (search.js) + FE-A (city search) + designer | `design/beta/eval/qc/overlay/r4-75bb37bb-atlas/shots/duplicates_page_768x1024_light_Singapore-hanoi-html.jpg` |
| duplicates | page | 1440x900 | 6 / 32 (3) | one control per action | search ×2 (search all guides + search) | Singapore/hanoi.html · light | FE-B (search.js) + FE-A (city search) + designer | `design/beta/eval/qc/overlay/r4-75bb37bb-atlas/shots/duplicates_page_1440x900_light_Singapore-hanoi-html.jpg` |
| duplicates | page | 1024x768 | 4 / 32 (2) | one control per action | search ×2 (search all guides + search) | Singapore/hanoi.html · light | FE-B (search.js) + FE-A (city search) + designer | `design/beta/eval/qc/overlay/r4-75bb37bb-atlas/shots/duplicates_page_1024x768_light_Singapore-hanoi-html.jpg` |
