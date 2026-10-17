# S-17 overlay and chrome · fec-sheet-base

12 runs (2 pages; viewports 390x844, 390x664, 844x390, 768x1024, 1024x768, 1440x900; themes light; views sheet). Errors: 0.

## Distributions (median / p90 / max)

| Metric | All | Atlas | Sheet |
|---|---|---|---|
| chrome bands % of height (load) | 14.6 / 41.1 / 41.1 | — | 14.6 / 41.1 / 41.1 |
| chrome area % (load) | 34 / 47.1 / 47.1 | — | 34 / 47.1 / 47.1 |
| clear map % of viewport (labels excluded) | — | — | — |
| clear map % of pane | — | — | — |
| label count | — | — | — |
| label coverage % of map | — | — | — |
| widest label % of map width | — | — | — |

## Instance groups (kind · view · viewport): runs, worst, screenshot

| Kind | View | Viewport | Failing runs / of (pages) | Budget | Worst | Page · theme | Owner | Shot |
|---|---|---|---|---|---|---|---|---|
| chromeScroll | sheet | 390x664 | 2 / 2 (2) | ≤ 8 % after a 600 px scroll | 20.4 | cleveland.html · light | FE-C (sheet) | `design/beta/eval/qc/overlay/fec-sheet-base/shots/chromeScroll_sheet_390x664_light_cleveland-html.jpg` |
| translucentChrome | sheet | 390x664 | 2 / 2 (2) | opaque, no blur (b2f587a8) | top bar alpha 0.4 | cleveland.html · light | FE-C (sheet) | `design/beta/eval/qc/overlay/fec-sheet-base/shots/translucentChrome_sheet_390x664_light_cleveland-html.jpg` |
| chromeRest | sheet | 844x390 | 2 / 2 (2) | ≤ 13 % | 18.8 | cleveland.html · light | FE-C (sheet) | `design/beta/eval/qc/overlay/fec-sheet-base/shots/chromeRest_sheet_844x390_light_cleveland-html.jpg` |
| chromeScroll | sheet | 844x390 | 2 / 2 (2) | ≤ 13 % after a 600 px scroll | 34.4 | cleveland.html · light | FE-C (sheet) | `design/beta/eval/qc/overlay/fec-sheet-base/shots/chromeScroll_sheet_844x390_light_cleveland-html.jpg` |
| translucentChrome | sheet | 844x390 | 2 / 2 (2) | opaque, no blur (b2f587a8) | top bar alpha 0.4 | cleveland.html · light | FE-C (sheet) | `design/beta/eval/qc/overlay/fec-sheet-base/shots/translucentChrome_sheet_844x390_light_cleveland-html.jpg` |
| chromeScroll | sheet | 390x844 | 2 / 2 (2) | ≤ 7 % after a 600 px scroll | 16.2 | cleveland.html · light | FE-C (sheet) | `design/beta/eval/qc/overlay/fec-sheet-base/shots/chromeScroll_sheet_390x844_light_cleveland-html.jpg` |
| translucentChrome | sheet | 390x844 | 2 / 2 (2) | opaque, no blur (b2f587a8) | top bar alpha 0.4 | cleveland.html · light | FE-C (sheet) | `design/beta/eval/qc/overlay/fec-sheet-base/shots/translucentChrome_sheet_390x844_light_cleveland-html.jpg` |
| chromeScroll | sheet | 768x1024 | 2 / 2 (2) | ≤ 6 % after a 600 px scroll | 13 | cleveland.html · light | FE-C (sheet) | `design/beta/eval/qc/overlay/fec-sheet-base/shots/chromeScroll_sheet_768x1024_light_cleveland-html.jpg` |
| translucentChrome | sheet | 768x1024 | 2 / 2 (2) | opaque, no blur (b2f587a8) | top bar alpha 0.4 | cleveland.html · light | FE-C (sheet) | `design/beta/eval/qc/overlay/fec-sheet-base/shots/translucentChrome_sheet_768x1024_light_cleveland-html.jpg` |
| chromeRest | sheet | 1024x768 | 2 / 2 (2) | ≤ 8 % | 14.6 | cleveland.html · light | FE-C (sheet) | `design/beta/eval/qc/overlay/fec-sheet-base/shots/chromeRest_sheet_1024x768_light_cleveland-html.jpg` |
| chromeScroll | sheet | 1024x768 | 2 / 2 (2) | ≤ 8 % after a 600 px scroll | 22.9 | cleveland.html · light | FE-C (sheet) | `design/beta/eval/qc/overlay/fec-sheet-base/shots/chromeScroll_sheet_1024x768_light_cleveland-html.jpg` |
| translucentChrome | sheet | 1024x768 | 2 / 2 (2) | opaque, no blur (b2f587a8) | top bar alpha 0.4 | cleveland.html · light | FE-C (sheet) | `design/beta/eval/qc/overlay/fec-sheet-base/shots/translucentChrome_sheet_1024x768_light_cleveland-html.jpg` |
| controlCovered | sheet | 1024x768 | 2 / 2 (2) | none: every shown control is reachable | apple maps under share | cleveland.html · light | FE-C (sheet) | — |
| chromeRest | sheet | 1440x900 | 2 / 2 (2) | ≤ 8 % | 41.1 | cleveland.html · light | FE-C (sheet) | — |
| chromeScroll | sheet | 1440x900 | 2 / 2 (2) | ≤ 8 % after a 600 px scroll | 100 | cleveland.html · light | FE-C (sheet) | — |
| translucentChrome | sheet | 1440x900 | 2 / 2 (2) | opaque, no blur (b2f587a8) | top bar alpha 0.4 | cleveland.html · light | FE-C (sheet) | — |
| controlCovered | sheet | 1440x900 | 1 / 2 (1) | none: every shown control is reachable | google maps under div.actions | cleveland.html · light | FE-C (sheet) | — |
| controlCollision | sheet | 1024x768 | 1 / 2 (1) | none | google maps / share | cities/tokyo.html · light | FE-C (sheet) | — |
