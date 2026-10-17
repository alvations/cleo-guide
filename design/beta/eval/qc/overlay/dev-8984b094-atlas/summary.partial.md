# S-17 overlay and chrome · dev-8984b094-atlas

500 runs (42 pages; viewports 390x844, 390x664, 844x390, 768x1024, 1024x768, 1440x900; themes light, dark; views atlas). Errors: 0.

## Distributions (median / p90 / max)

| Metric | All | Atlas | Sheet |
|---|---|---|---|
| chrome bands % of height (load) | 15.3 / 31.3 / 31.3 | — | — |
| chrome area % (load) | 16.4 / 34.8 / 34.8 | — | — |
| clear map % of viewport (labels excluded) | 72.6 / 84.8 / 84.8 | — | — |
| clear map % of pane | 88.1 / 98 / 98 | — | — |
| label count | 0 / 0 / 0 | — | — |
| label coverage % of map | 9.3 / 11 / 11.7 | — | — |
| widest label % of map width | 0 / 0 / 0 | — | — |

## Instance groups (kind · view · viewport): runs, worst, screenshot

| Kind | View | Viewport | Failing runs / of (pages) | Budget | Worst | Page · theme | Owner | Shot |
|---|---|---|---|---|---|---|---|---|

> **QC note, 12:10Z: label figures in this partial are void.** A regex escaping bug in the probe (MEASURE is a template-literal body, so `\(` collapsed to `(`) treated each transparent pin wrapper as the painted pill. The label list was empty, so labelCount, labelWidth and labelGap passed vacuously. Fixed at the next QC commit and re-measured on b1c7939f. The cold first-screen readings here (chrome, clear map) don't depend on labels and stand: 500 runs, 0 failing.
