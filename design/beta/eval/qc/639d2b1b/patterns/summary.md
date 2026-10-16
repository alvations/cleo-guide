# QC run 639d2b1b-patterns

SHA 639d2b1b · 2026-10-16T15:02:57.318Z → 2026-10-16T15:18:07.680Z · chromium; tiles stubbed 1×1; off-origin aborted; SW blocked

| Id | Check | PASS | WARN | FAIL | N/A |
|---|---|---|---|---|---|
| P-01 | Segmented view switcher | 6 | 0 | 0 | 0 |
| P-02 | Switcher switches | 6 | 0 | 0 | 0 |
| P-03 | Switch focus and announce | 6 | 0 | 0 | 0 |
| P-04 | Defaults omitted from the hash | 12 | 0 | 0 | 0 |
| P-05 | Enums validated (garbage degrades safely) | 6 | 0 | 0 | 0 |
| P-06 | Garbage p= is harmless | 6 | 0 | 0 | 0 |
| P-07 | Round trip: view | 18 | 6 | 0 | 0 |
| P-08 | Round trip: lens | 25 | 19 | 0 | 0 |
| P-09 | Round trip: place | 24 | 0 | 0 | 0 |
| P-10 | Round trip: map view | 6 | 0 | 0 | 0 |
| P-11 | Round trip: page | 10 | 0 | 0 | 0 |
| P-12 | Share writes view= and the place | 6 | 0 | 0 | 0 |
| P-13 | One record set (every view reaches N) | 6 | 0 | 0 | 0 |
| P-14 | Counts agree across views | 0 | 0 | 24 | 0 |
| P-15 | One summary line per view | 15 | 6 | 3 | 0 |
| P-16 | Numbered or clustered pins | 6 | 0 | 0 | 0 |
| P-17 | No-place badge | 0 | 0 | 2 | 4 |
| P-18 | Charts as filters | 46 | 0 | 0 | 0 |
| P-19 | Chart table | 46 | 0 | 0 | 0 |
| P-20 | Every chart accounts for all records | 46 | 0 | 0 | 0 |
| P-21 | Drawer n of N | 24 | 0 | 0 | 0 |
| P-22 | Drawer prev / next | 24 | 0 | 0 | 0 |
| P-23 | Pages, numbers, all N, show-all | 10 | 0 | 0 | 2 |
| P-24 | No silent caps | 21 | 0 | 0 | 3 |
| P-25 | No value-led ranking | 3 | 0 | 3 | 0 |
| P-26 | No invented data | 3 | 0 | 3 | 0 |
| P-27 | Lens yields to a deep link | 6 | 0 | 0 | 0 |
| P-28 | Show all N clears every lens | 6 | 0 | 0 | 0 |

## Journeys

| Id | Page | Viewport | Theme | Success | Steps | Friction |
|---|---|---|---|---|---|---|

## Failures (first 400)

- **P-15** cities/tokyo.html 390 light atlas: `{"N":488,"lines":[]}`
- **P-14** cities/tokyo.html 390 light {}: `{"want":488,"per":{"gallery":{"stated":["488 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["488/488 all"],"bad":[],"mapArea":[]},"insights":{"stated":["487/488 nOfN","1/488 nOfN","488/488 all"],"bad":["Computed from 487 of 488 places: open, with a `
- **P-14** cities/tokyo.html 390 light {"a":"CYD"}: `{"want":43,"per":{"gallery":{"stated":["43/488 nOfN","43 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["43/488 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["43/488 nOfN","0/43 nOfN","43/43 all"],"bad":["0 of 43 places have closed. They stay `
- **P-14** cities/tokyo.html 390 light {"mode":"food"}: `{"want":225,"per":{"gallery":{"stated":["225/488 nOfN","225 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["225/488 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["225/488 nOfN","0/225 nOfN","225/225 all"],"bad":["0 of 225 places have closed. T`
- **P-14** cities/tokyo.html 390 light {"t":"1"}: `{"want":177,"per":{"gallery":{"stated":["177/488 nOfN","177 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["177/488 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["177/488 nOfN","0/177 nOfN","177/177 all"],"bad":["0 of 177 places have closed. T`
- **P-25** cities/tokyo.html 390 light : `{"hits":{"gallery":[],"atlas":[],"guidebook":["One of Ueno's most popular ramen counters: only Japanese duck and leek, simmered for two days into a clear, sweet, ungamey stock with house-made noodles — the anchor of the Okachimachi 'ramen yokochō' cluster."],"insights":[]},"sortOptions":["Top ranked`
- **P-26** cities/tokyo.html 390 light : `{"hits":{"gallery":[],"atlas":[],"guidebook":["Ginza tempura shop in the Michelin selection with affordable lunch tempura (¥1,500–9,000).","Bandai Namco's capsule-toy flagship — about 3,000 gashapon machines across 1,256 m², the most at any single location — dispensing Pokémon, Gundam, Ultraman and `
- **P-14** cities/tokyo.html 1440 light {}: `{"want":488,"per":{"gallery":{"stated":["488 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["488/488 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["488/488 all"],"bad":[],"mapArea":[]},"insights":{"stated":["487/488 nOfN","1/488 nOfN","488/488 all"],"bad":["Computed from 487 of 488 places: `
- **P-14** cities/tokyo.html 1440 light {"a":"CYD"}: `{"want":43,"per":{"gallery":{"stated":["43/488 nOfN","43 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["43/43 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["43/488 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["43/488 nOfN","0/43 nOfN","43/43 all"],"bad":["0 of 43 places have closed.`
- **P-14** cities/tokyo.html 1440 light {"mode":"food"}: `{"want":225,"per":{"gallery":{"stated":["225/488 nOfN","225 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["225/225 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["225/488 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["225/488 nOfN","0/225 nOfN","225/225 all"],"bad":["0 of 225 places h`
- **P-14** cities/tokyo.html 1440 light {"t":"1"}: `{"want":177,"per":{"gallery":{"stated":["177/488 nOfN","177 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["177/177 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["177/488 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["177/488 nOfN","0/177 nOfN","177/177 all"],"bad":["0 of 177 places h`
- **P-15** cleveland.html 390 light atlas: `{"N":194,"lines":[]}`
- **P-14** cleveland.html 390 light {}: `{"want":194,"per":{"gallery":{"stated":["194 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["194/194 all"],"bad":[],"mapArea":[]},"insights":{"stated":["180/194 nOfN","13/194 nOfN","194/194 all"],"bad":["Computed from 180 of 194 places: open, with a`
- **P-14** cleveland.html 390 light {"a":"DT"}: `{"want":42,"per":{"gallery":{"stated":["42/194 nOfN","42 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["42/194 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["42/194 nOfN","4/42 nOfN","42/42 all"],"bad":["4 of 42 places have closed. They stay `
- **P-14** cleveland.html 390 light {"mode":"food"}: `{"want":46,"per":{"gallery":{"stated":["46/194 nOfN","46 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["46/194 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["46/194 nOfN","7/46 nOfN","46/46 all"],"bad":["7 of 46 places have closed. They stay `
- **P-14** cleveland.html 390 light {"t":"1"}: `{"want":47,"per":{"gallery":{"stated":["47/194 nOfN","47 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["47/194 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["47/194 nOfN","0/47 nOfN","47/47 all"],"bad":["0 of 47 places have closed. They stay `
- **P-17** cleveland.html 390 light : `{"unpinned":1,"badge":[]}`
- **P-25** cleveland.html 390 light : `{"hits":{"gallery":[],"atlas":[],"guidebook":["Colombian-Venezuelan, and the arepa place Cleveland actually argues about — 3,300 reviews at 4.6. Arepas, cachapas, empanadas, birria arepa, and mojitos that people order first. Named repeatedly in Infatuation and Yelp's Venezuelan rankings.","One of th`
- **P-26** cleveland.html 390 light : `{"hits":{"gallery":[],"atlas":[],"guidebook":["Look for: Book online in advance — no walk-ups. Check in at the ground-floor desk, ride to 32, transfer to 42. Around $5–6. Weekends only.","Look for: Monday to Friday, 7am–2:30pm. Closed both weekend days. Go early; the queue is real. Roughly $25 a san`
- **P-14** cleveland.html 1440 light {}: `{"want":194,"per":{"gallery":{"stated":["194 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["194/194 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["194/194 all"],"bad":[],"mapArea":[]},"insights":{"stated":["180/194 nOfN","13/194 nOfN","194/194 all"],"bad":["Computed from 180 of 194 places:`
- **P-14** cleveland.html 1440 light {"a":"DT"}: `{"want":42,"per":{"gallery":{"stated":["42/194 nOfN","42 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["42/42 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["42/194 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["42/194 nOfN","4/42 nOfN","42/42 all"],"bad":["4 of 42 places have closed.`
- **P-14** cleveland.html 1440 light {"mode":"food"}: `{"want":46,"per":{"gallery":{"stated":["46/194 nOfN","46 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["46/46 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["46/194 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["46/194 nOfN","7/46 nOfN","46/46 all"],"bad":["7 of 46 places have closed.`
- **P-14** cleveland.html 1440 light {"t":"1"}: `{"want":47,"per":{"gallery":{"stated":["47/194 nOfN","47 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["47/47 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["47/194 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["47/194 nOfN","0/47 nOfN","47/47 all"],"bad":["0 of 47 places have closed.`
- **P-17** cleveland.html 1440 light : `{"unpinned":1,"badge":[]}`
- **P-15** Singapore/chinatown.html 390 light atlas: `{"N":16,"lines":[]}`
- **P-14** Singapore/chinatown.html 390 light {}: `{"want":16,"per":{"gallery":{"stated":["16 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["16/16 all"],"bad":[],"mapArea":[]},"insights":{"stated":["16/16 nOfN","0/16 nOfN","16/16 all"],"bad":["0 of 16 places have closed. They stay in every view, fl`
- **P-14** Singapore/chinatown.html 390 light {"a":"CHINATOWN"}: `{"want":16,"per":{"gallery":{"stated":["16 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["16/16 all"],"bad":[],"mapArea":[]},"insights":{"stated":["16/16 nOfN","0/16 nOfN","16/16 all"],"bad":["0 of 16 places have closed. They stay in every view, fl`
- **P-14** Singapore/chinatown.html 390 light {"mode":"food"}: `{"want":12,"per":{"gallery":{"stated":["12/16 nOfN","12 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["12/16 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["12/16 nOfN","0/12 nOfN","12/12 all"],"bad":["0 of 12 places have closed. They stay in `
- **P-14** Singapore/chinatown.html 390 light {"t":"1"}: `{"want":6,"per":{"gallery":{"stated":["6/16 nOfN","6 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["6/16 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["6/16 nOfN","0/6 nOfN","6/6 all"],"bad":["0 of 6 places have closed. They stay in every vie`
- **P-25** Singapore/chinatown.html 390 light : `{"hits":{"gallery":[],"atlas":[],"guidebook":["The most popular stalls on Lau Pa Sat's evening Satay Street, grilled over charcoal."],"insights":[]},"sortOptions":["Top ranked","Most sources","A–Z","Nearest to me"]}`
- **P-26** Singapore/chinatown.html 390 light : `{"hits":{"gallery":[],"atlas":[],"guidebook":["Artisanal chendol with cold-pressed coconut milk & charcoal-brewed gula melaka, from $2."],"insights":[]},"photos":0,"uncredited":[]}`
- **P-14** Singapore/chinatown.html 1440 light {}: `{"want":16,"per":{"gallery":{"stated":["16 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["16/16 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["16/16 all"],"bad":[],"mapArea":[]},"insights":{"stated":["16/16 nOfN","0/16 nOfN","16/16 all"],"bad":["0 of 16 places have closed. They stay in eve`
- **P-14** Singapore/chinatown.html 1440 light {"a":"CHINATOWN"}: `{"want":16,"per":{"gallery":{"stated":["16 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["16/16 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["16/16 all"],"bad":[],"mapArea":[]},"insights":{"stated":["16/16 nOfN","0/16 nOfN","16/16 all"],"bad":["0 of 16 places have closed. They stay in eve`
- **P-14** Singapore/chinatown.html 1440 light {"mode":"food"}: `{"want":12,"per":{"gallery":{"stated":["12/16 nOfN","12 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["12/12 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["12/16 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["12/16 nOfN","0/12 nOfN","12/12 all"],"bad":["0 of 12 places have closed. Th`
- **P-14** Singapore/chinatown.html 1440 light {"t":"1"}: `{"want":6,"per":{"gallery":{"stated":["6/16 nOfN","6 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["6/6 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["6/16 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["6/16 nOfN","0/6 nOfN","6/6 all"],"bad":["0 of 6 places have closed. They stay in `
