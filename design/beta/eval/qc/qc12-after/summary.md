# QC run qc12-after

SHA 94ef2555 · 2026-10-16T13:41:05.764Z → 2026-10-16T13:42:00.941Z · chromium; tiles stubbed 1×1; off-origin aborted; SW blocked

| Id | Check | PASS | WARN | FAIL | N/A |
|---|---|---|---|---|---|
| S-01 | Token discipline (static census) | 0 | 0 | 1 | 0 |
| S-02 | Token discipline (runtime inline styles) | 12 | 0 | 0 | 0 |
| S-03 | Spacing rhythm | 0 | 12 | 0 | 0 |
| S-04 | Alignment | 12 | 0 | 0 | 0 |
| S-05 | Component states | 0 | 3 | 3 | 0 |
| S-06 | Truncation and clipping | 12 | 0 | 0 | 0 |
| S-07 | Widows and orphans | 12 | 0 | 0 | 0 |
| S-08 | Sentence case | 5 | 0 | 1 | 0 |
| S-09 | Credits visible | 12 | 0 | 0 | 0 |
| S-10 | 44 px targets | 12 | 0 | 0 | 0 |
| S-11 | AA contrast | 0 | 0 | 12 | 0 |
| S-12 | No layout shift on load | 11 | 0 | 1 | 0 |
| S-13 | No horizontal overflow | 12 | 0 | 0 | 0 |
| S-14 | No errors | 12 | 0 | 0 | 0 |
| S-15 | Focus visible | 0 | 0 | 6 | 0 |

## Journeys

| Id | Page | Viewport | Theme | Success | Steps | Friction |
|---|---|---|---|---|---|---|

## Failures (first 400)

- **S-01** beta/assets/*.css   : `{"font-size":3,"border-radius":50,"letter-spacing":12,"box-shadow":13,"colour":62}`
- **S-11** cities/indianapolis.html 1440 dark : `{"tested":0,"unknown":0,"fails":1,"sample":[{"t":"Gallery","cr":1.19,"need":4.5,"px":14,"cls":"span.","fg":"rgb(19, 17, 16)"}]}`
- **S-11** cities/indianapolis.html 1440 light : `{"tested":0,"unknown":0,"fails":1,"sample":[{"t":"Gallery","cr":1.09,"need":4.5,"px":14,"cls":"span.","fg":"rgb(249, 247, 243)"}]}`
- **S-11** cleveland.html 1440 dark : `{"tested":0,"unknown":0,"fails":1,"sample":[{"t":"Gallery","cr":1.19,"need":4.5,"px":14,"cls":"span.","fg":"rgb(19, 17, 16)"}]}`
- **S-11** cleveland.html 1440 light : `{"tested":0,"unknown":0,"fails":1,"sample":[{"t":"Gallery","cr":1.09,"need":4.5,"px":14,"cls":"span.","fg":"rgb(249, 247, 243)"}]}`
- **S-15** cities/indianapolis.html 1440 light : `{"stops":30,"noRing":["INPUT "]}`
- **S-15** cleveland.html 1440 light : `{"stops":30,"noRing":["INPUT "]}`
- **S-11** cities/newyork.html 1440 light : `{"tested":0,"unknown":0,"fails":1,"sample":[{"t":"Gallery","cr":1.09,"need":4.5,"px":14,"cls":"span.","fg":"rgb(249, 247, 243)"}]}`
- **S-11** cities/newyork.html 1440 dark : `{"tested":0,"unknown":0,"fails":1,"sample":[{"t":"Gallery","cr":1.19,"need":4.5,"px":14,"cls":"span.","fg":"rgb(19, 17, 16)"}]}`
- **S-11** cities/osaka.html 1440 light : `{"tested":0,"unknown":0,"fails":1,"sample":[{"t":"Gallery","cr":1.09,"need":4.5,"px":14,"cls":"span.","fg":"rgb(249, 247, 243)"}]}`
- **S-11** cities/osaka.html 1440 dark : `{"tested":0,"unknown":0,"fails":1,"sample":[{"t":"Gallery","cr":1.19,"need":4.5,"px":14,"cls":"span.","fg":"rgb(19, 17, 16)"}]}`
- **S-11** cities/statecollege.html 1440 light : `{"tested":0,"unknown":0,"fails":1,"sample":[{"t":"Gallery","cr":1.09,"need":4.5,"px":14,"cls":"span.","fg":"rgb(249, 247, 243)"}]}`
- **S-12** cities/statecollege.html 1440 light : `{"cls":0.2194,"shifts":[{"v":0.217,"t":373,"n":[".topnav","#area-DT",".area-end"]}]}`
- **S-15** cities/newyork.html 1440 light : `{"stops":30,"noRing":["INPUT "]}`
- **S-15** cities/statecollege.html 1440 light : `{"stops":30,"noRing":["INPUT "]}`
- **S-11** cities/statecollege.html 1440 dark : `{"tested":0,"unknown":0,"fails":1,"sample":[{"t":"Gallery","cr":1.19,"need":4.5,"px":14,"cls":"span.","fg":"rgb(19, 17, 16)"}]}`
- **S-15** cities/osaka.html 1440 light : `{"stops":30,"noRing":["INPUT "]}`
- **S-11** cities/tokyo.html 1440 light : `{"tested":0,"unknown":0,"fails":1,"sample":[{"t":"Gallery","cr":1.09,"need":4.5,"px":14,"cls":"span.","fg":"rgb(249, 247, 243)"}]}`
- **S-08** cities/tokyo.html 1440 light : `{"n":2,"sample":[{"t":"Nightlife, Yokochō & districts","want":"Nightlife, yokochō & districts"},{"t":"Izakaya, yakitori & Yokochō","want":"Izakaya, yakitori & yokochō"}]}`
- **S-11** cities/tokyo.html 1440 dark : `{"tested":0,"unknown":0,"fails":1,"sample":[{"t":"Gallery","cr":1.19,"need":4.5,"px":14,"cls":"span.","fg":"rgb(19, 17, 16)"}]}`
- **S-15** cities/tokyo.html 1440 light : `{"stops":30,"noRing":["INPUT "]}`
- **S-05** cities/tokyo.html 390 light : `{"disabled":{"cursor":"default","opacity":"0.4","focusable":false},"empty":{"said":"Japan Tokyo 東京 ward by ward · Jōnan · Jōsai · Jōhoku · Jōtō · Tama · Kantō day trips 488 places · 13 areas · last checked 2026-10-03 · 1 closed Search Tokyo All","msg":null,"action":false},"loading":{"busy":true,"tex`
- **S-05** cleveland.html 390 light : `{"disabled":{"cursor":"default","opacity":"0.4","focusable":false},"empty":{"said":"United States Cleveland the complete odd & overlooked 194 places · 4 areas · last checked 2026-08-24 · 13 closed Search Cleveland All 194 Sights 148 Eat & drink","msg":null,"action":false},"loading":{"busy":true,"tex`
- **S-05** cities/newyork.html 390 light : `{"disabled":{"cursor":"default","opacity":"0.4","focusable":false},"empty":{"said":"United States New York City five boroughs, day trips & the best tables 508 places · 6 areas · last checked 2026-08-13 Search New York City All 508 Sights 219 Ea","msg":null,"action":false},"loading":{"busy":true,"tex`
