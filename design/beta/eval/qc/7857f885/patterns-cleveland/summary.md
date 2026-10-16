# QC run 7857f885-patterns

SHA 7857f885 · 2026-10-16T19:07:02.737Z → 2026-10-16T19:11:48.803Z · chromium; tiles stubbed 1×1; off-origin aborted; SW blocked

| Id | Check | PASS | WARN | FAIL | N/A |
|---|---|---|---|---|---|
| P-01 | Segmented view switcher | 2 | 0 | 0 | 0 |
| P-02 | Switcher switches | 2 | 0 | 0 | 0 |
| P-03 | Switch focus and announce | 2 | 0 | 0 | 0 |
| P-04 | Defaults omitted from the hash | 4 | 0 | 0 | 0 |
| P-05 | Enums validated (garbage degrades safely) | 2 | 0 | 0 | 0 |
| P-06 | Garbage p= is harmless | 2 | 0 | 0 | 0 |
| P-07 | Round trip: view | 6 | 2 | 0 | 0 |
| P-08 | Round trip: lens | 2 | 12 | 0 | 0 |
| P-09 | Round trip: place | 8 | 0 | 0 | 0 |
| P-10 | Round trip: map view | 2 | 0 | 0 | 0 |
| P-11 | Round trip: page | 4 | 0 | 0 | 0 |
| P-12 | Share writes view= and the place | 2 | 0 | 0 | 0 |
| P-13 | One record set (every view reaches N) | 1 | 0 | 1 | 0 |
| P-14 | Counts agree across views | 0 | 0 | 8 | 0 |
| P-15 | One summary line per view | 5 | 2 | 1 | 0 |
| P-16 | Numbered or clustered pins | 2 | 0 | 0 | 0 |
| P-17 | No-place badge | 2 | 0 | 0 | 0 |
| P-18 | Charts as filters | 16 | 0 | 0 | 0 |
| P-19 | Chart table | 16 | 0 | 0 | 0 |
| P-20 | Every chart accounts for all records | 16 | 0 | 0 | 0 |
| P-21 | Drawer n of N | 8 | 0 | 0 | 0 |
| P-22 | Drawer prev / next | 8 | 0 | 0 | 0 |
| P-23 | Pages, numbers, all N, show-all | 4 | 0 | 0 | 0 |
| P-24 | No silent caps | 7 | 0 | 0 | 1 |
| P-25 | No value-led ranking | 1 | 0 | 1 | 0 |
| P-26 | No invented data | 1 | 0 | 1 | 0 |
| P-27 | Lens yields to a deep link | 2 | 0 | 0 | 0 |
| P-28 | Show all N clears every lens | 2 | 0 | 0 | 0 |

## Journeys

| Id | Page | Viewport | Theme | Success | Steps | Friction |
|---|---|---|---|---|---|---|

## Failures (first 400)

- **P-13** cleveland.html 390 light : `{"N":194,"reach":{"gallery":{"n":194,"extra":[]},"atlas":{"n":0,"extra":[]},"guidebook":{"n":194,"extra":[]},"insights":{"n":194,"extra":[]}}}`
- **P-15** cleveland.html 390 light atlas: `{"N":194,"lines":[]}`
- **P-14** cleveland.html 390 light {}: `{"want":194,"per":{"gallery":{"stated":["194 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["194/194 all"],"bad":[],"mapArea":[]},"insights":{"stated":["180/194 nOfN","13/194 nOfN","194/194 all"],"bad":["Computed from 180 of 194 places: open, with a`
- **P-14** cleveland.html 390 light {"a":"DT"}: `{"want":42,"per":{"gallery":{"stated":["42/194 nOfN","42 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["42/194 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["42/194 nOfN","4/42 nOfN","42/42 all"],"bad":["4 of 42 places have closed. They stay `
- **P-14** cleveland.html 390 light {"mode":"food"}: `{"want":46,"per":{"gallery":{"stated":["46/194 nOfN","46 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["46/194 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["46/194 nOfN","7/46 nOfN","46/46 all"],"bad":["7 of 46 places have closed. They stay `
- **P-14** cleveland.html 390 light {"t":"1"}: `{"want":47,"per":{"gallery":{"stated":["47/194 nOfN","47 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["47/194 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["47/194 nOfN","0/47 nOfN","47/47 all"],"bad":["0 of 47 places have closed. They stay `
- **P-25** cleveland.html 390 light : `{"hits":{"gallery":[],"atlas":[],"guidebook":["Colombian-Venezuelan, and the arepa place Cleveland actually argues about — 3,300 reviews at 4.6. Arepas, cachapas, empanadas, birria arepa, and mojitos that people order first. Named repeatedly in Infatuation and Yelp's Venezuelan rankings.","One of th`
- **P-26** cleveland.html 390 light : `{"hits":{"gallery":[],"atlas":[],"guidebook":["Look for: Book online in advance — no walk-ups. Check in at the ground-floor desk, ride to 32, transfer to 42. Around $5–6. Weekends only.","Look for: Monday to Friday, 7am–2:30pm. Closed both weekend days. Go early; the queue is real. Roughly $25 a san`
- **P-14** cleveland.html 1440 light {}: `{"want":194,"per":{"gallery":{"stated":["194 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["194/194 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["194/194 all"],"bad":[],"mapArea":[]},"insights":{"stated":["180/194 nOfN","13/194 nOfN","194/194 all"],"bad":["Computed from 180 of 194 places:`
- **P-14** cleveland.html 1440 light {"a":"DT"}: `{"want":42,"per":{"gallery":{"stated":["42/194 nOfN","42 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["42/42 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["42/194 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["42/194 nOfN","4/42 nOfN","42/42 all"],"bad":["4 of 42 places have closed.`
- **P-14** cleveland.html 1440 light {"mode":"food"}: `{"want":46,"per":{"gallery":{"stated":["46/194 nOfN","46 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["46/46 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["46/194 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["46/194 nOfN","7/46 nOfN","46/46 all"],"bad":["7 of 46 places have closed.`
- **P-14** cleveland.html 1440 light {"t":"1"}: `{"want":47,"per":{"gallery":{"stated":["47/194 nOfN","47 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["47/47 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["47/194 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["47/194 nOfN","0/47 nOfN","47/47 all"],"bad":["0 of 47 places have closed.`
