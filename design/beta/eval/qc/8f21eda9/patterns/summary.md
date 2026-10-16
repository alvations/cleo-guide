# QC run 8f21eda9-patterns

SHA 8f21eda9 · 2026-10-16T16:43:02.960Z → 2026-10-16T17:06:38.489Z · chromium; tiles stubbed 1×1; off-origin aborted; SW blocked

| Id | Check | PASS | WARN | FAIL | N/A |
|---|---|---|---|---|---|
| P-01 | Segmented view switcher | 10 | 0 | 0 | 0 |
| P-02 | Switcher switches | 10 | 0 | 0 | 0 |
| P-03 | Switch focus and announce | 10 | 0 | 0 | 0 |
| P-04 | Defaults omitted from the hash | 20 | 0 | 0 | 0 |
| P-05 | Enums validated (garbage degrades safely) | 10 | 0 | 0 | 0 |
| P-06 | Garbage p= is harmless | 10 | 0 | 0 | 0 |
| P-07 | Round trip: view | 30 | 10 | 0 | 0 |
| P-08 | Round trip: lens | 10 | 64 | 0 | 0 |
| P-09 | Round trip: place | 40 | 0 | 0 | 0 |
| P-10 | Round trip: map view | 10 | 0 | 0 | 0 |
| P-11 | Round trip: page | 17 | 0 | 0 | 0 |
| P-12 | Share writes view= and the place | 10 | 0 | 0 | 0 |
| P-13 | One record set (every view reaches N) | 5 | 0 | 5 | 0 |
| P-14 | Counts agree across views | 0 | 0 | 40 | 0 |
| P-15 | One summary line per view | 25 | 10 | 5 | 0 |
| P-16 | Numbered or clustered pins | 10 | 0 | 0 | 0 |
| P-17 | No-place badge | 0 | 0 | 2 | 8 |
| P-18 | Charts as filters | 74 | 0 | 0 | 0 |
| P-19 | Chart table | 74 | 0 | 0 | 0 |
| P-20 | Every chart accounts for all records | 74 | 0 | 0 | 0 |
| P-21 | Drawer n of N | 34 | 0 | 6 | 0 |
| P-22 | Drawer prev / next | 40 | 0 | 0 | 0 |
| P-23 | Pages, numbers, all N, show-all | 17 | 0 | 0 | 3 |
| P-24 | No silent caps | 35 | 0 | 0 | 5 |
| P-25 | No value-led ranking | 7 | 0 | 3 | 0 |
| P-26 | No invented data | 6 | 0 | 4 | 0 |
| P-27 | Lens yields to a deep link | 10 | 0 | 0 | 0 |
| P-28 | Show all N clears every lens | 10 | 0 | 0 | 0 |

## Journeys

| Id | Page | Viewport | Theme | Success | Steps | Friction |
|---|---|---|---|---|---|---|

## Failures (first 400)

- **P-13** cities/tokyo.html 390 light : `{"N":488,"reach":{"gallery":{"n":488,"extra":[]},"atlas":{"n":0,"extra":[]},"guidebook":{"n":488,"extra":[]},"insights":{"n":488,"extra":[]}}}`
- **P-15** cities/tokyo.html 390 light atlas: `{"N":488,"lines":[]}`
- **P-14** cities/tokyo.html 390 light {}: `{"want":488,"per":{"gallery":{"stated":["488 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["488/488 all"],"bad":[],"mapArea":[]},"insights":{"stated":["487/488 nOfN","1/488 nOfN","488/488 all"],"bad":["Computed from 487 of 488 places: open, with a `
- **P-14** cities/tokyo.html 390 light {"a":"CYD"}: `{"want":43,"per":{"gallery":{"stated":["43/488 nOfN","43 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["43/488 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["43/488 nOfN","0/43 nOfN","43/43 all"],"bad":["0 of 43 places have closed. They stay `
- **P-14** cities/tokyo.html 390 light {"mode":"food"}: `{"want":225,"per":{"gallery":{"stated":["225/488 nOfN","225 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["225/488 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["225/488 nOfN","0/225 nOfN","225/225 all"],"bad":["0 of 225 places have closed. T`
- **P-14** cities/tokyo.html 390 light {"t":"1"}: `{"want":177,"per":{"gallery":{"stated":["177/488 nOfN","177 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["177/488 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["177/488 nOfN","0/177 nOfN","177/177 all"],"bad":["0 of 177 places have closed. T`
- **P-21** cities/tokyo.html 390 light atlas: `{"pos":"1 of 488 in this Atlas view","want":43}`
- **P-25** cities/tokyo.html 390 light : `{"hits":{"gallery":[],"atlas":[],"guidebook":["One of Ueno's most popular ramen counters: only Japanese duck and leek, simmered for two days into a clear, sweet, ungamey stock with house-made noodles — the anchor of the Okachimachi 'ramen yokochō' cluster."],"insights":[]},"sortOptions":["Top ranked`
- **P-26** cities/tokyo.html 390 light : `{"hits":{"gallery":[],"atlas":[],"guidebook":["Ginza tempura shop in the Michelin selection with affordable lunch tempura (¥1,500–9,000).","Bandai Namco's capsule-toy flagship — about 3,000 gashapon machines across 1,256 m², the most at any single location — dispensing Pokémon, Gundam, Ultraman and `
- **P-14** cities/tokyo.html 1440 light {}: `{"want":488,"per":{"gallery":{"stated":["488 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["488/488 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["488/488 all"],"bad":[],"mapArea":[]},"insights":{"stated":["487/488 nOfN","1/488 nOfN","488/488 all"],"bad":["Computed from 487 of 488 places: `
- **P-14** cities/tokyo.html 1440 light {"a":"CYD"}: `{"want":43,"per":{"gallery":{"stated":["43/488 nOfN","43 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["43/43 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["43/488 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["43/488 nOfN","0/43 nOfN","43/43 all"],"bad":["0 of 43 places have closed.`
- **P-14** cities/tokyo.html 1440 light {"mode":"food"}: `{"want":225,"per":{"gallery":{"stated":["225/488 nOfN","225 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["225/225 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["225/488 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["225/488 nOfN","0/225 nOfN","225/225 all"],"bad":["0 of 225 places h`
- **P-14** cities/tokyo.html 1440 light {"t":"1"}: `{"want":177,"per":{"gallery":{"stated":["177/488 nOfN","177 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["177/177 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["177/488 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["177/488 nOfN","0/177 nOfN","177/177 all"],"bad":["0 of 177 places h`
- **P-21** cities/tokyo.html 1440 light atlas: `{"pos":"1 of 488 in this Atlas view","want":43}`
- **P-13** cleveland.html 390 light : `{"N":194,"reach":{"gallery":{"n":194,"extra":[]},"atlas":{"n":0,"extra":[]},"guidebook":{"n":194,"extra":[]},"insights":{"n":194,"extra":[]}}}`
- **P-15** cleveland.html 390 light atlas: `{"N":194,"lines":[]}`
- **P-14** cleveland.html 390 light {}: `{"want":194,"per":{"gallery":{"stated":["194 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["194/194 all"],"bad":[],"mapArea":[]},"insights":{"stated":["180/194 nOfN","13/194 nOfN","194/194 all"],"bad":["Computed from 180 of 194 places: open, with a`
- **P-14** cleveland.html 390 light {"a":"DT"}: `{"want":42,"per":{"gallery":{"stated":["42/194 nOfN","42 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["42/194 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["42/194 nOfN","4/42 nOfN","42/42 all"],"bad":["4 of 42 places have closed. They stay `
- **P-14** cleveland.html 390 light {"mode":"food"}: `{"want":46,"per":{"gallery":{"stated":["46/194 nOfN","46 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["46/194 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["46/194 nOfN","7/46 nOfN","46/46 all"],"bad":["7 of 46 places have closed. They stay `
- **P-14** cleveland.html 390 light {"t":"1"}: `{"want":47,"per":{"gallery":{"stated":["47/194 nOfN","47 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["47/194 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["47/194 nOfN","0/47 nOfN","47/47 all"],"bad":["0 of 47 places have closed. They stay `
- **P-17** cleveland.html 390 light : `{"unpinned":1,"badge":[]}`
- **P-21** cleveland.html 390 light atlas: `{"pos":"4 of 194 in this Atlas view","want":42}`
- **P-25** cleveland.html 390 light : `{"hits":{"gallery":[],"atlas":[],"guidebook":["Colombian-Venezuelan, and the arepa place Cleveland actually argues about — 3,300 reviews at 4.6. Arepas, cachapas, empanadas, birria arepa, and mojitos that people order first. Named repeatedly in Infatuation and Yelp's Venezuelan rankings.","One of th`
- **P-26** cleveland.html 390 light : `{"hits":{"gallery":[],"atlas":[],"guidebook":["Look for: Book online in advance — no walk-ups. Check in at the ground-floor desk, ride to 32, transfer to 42. Around $5–6. Weekends only.","Look for: Monday to Friday, 7am–2:30pm. Closed both weekend days. Go early; the queue is real. Roughly $25 a san`
- **P-14** cleveland.html 1440 light {}: `{"want":194,"per":{"gallery":{"stated":["194 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["194/194 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["194/194 all"],"bad":[],"mapArea":[]},"insights":{"stated":["180/194 nOfN","13/194 nOfN","194/194 all"],"bad":["Computed from 180 of 194 places:`
- **P-14** cleveland.html 1440 light {"a":"DT"}: `{"want":42,"per":{"gallery":{"stated":["42/194 nOfN","42 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["42/42 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["42/194 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["42/194 nOfN","4/42 nOfN","42/42 all"],"bad":["4 of 42 places have closed.`
- **P-14** cleveland.html 1440 light {"mode":"food"}: `{"want":46,"per":{"gallery":{"stated":["46/194 nOfN","46 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["46/46 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["46/194 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["46/194 nOfN","7/46 nOfN","46/46 all"],"bad":["7 of 46 places have closed.`
- **P-14** cleveland.html 1440 light {"t":"1"}: `{"want":47,"per":{"gallery":{"stated":["47/194 nOfN","47 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["47/47 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["47/194 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["47/194 nOfN","0/47 nOfN","47/47 all"],"bad":["0 of 47 places have closed.`
- **P-17** cleveland.html 1440 light : `{"unpinned":1,"badge":[]}`
- **P-21** cleveland.html 1440 light atlas: `{"pos":"4 of 194 in this Atlas view","want":42}`
- **P-13** cities/newyork.html 390 light : `{"N":508,"reach":{"gallery":{"n":508,"extra":[]},"atlas":{"n":0,"extra":[]},"guidebook":{"n":508,"extra":[]},"insights":{"n":508,"extra":[]}}}`
- **P-15** cities/newyork.html 390 light atlas: `{"N":508,"lines":[]}`
- **P-14** cities/newyork.html 390 light {}: `{"want":508,"per":{"gallery":{"stated":["508 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["508/508 all"],"bad":[],"mapArea":[]},"insights":{"stated":["508/508 nOfN","0/508 nOfN","508/508 all"],"bad":["0 of 508 places have closed. They stay in ever`
- **P-14** cities/newyork.html 390 light {"a":"MAN"}: `{"want":264,"per":{"gallery":{"stated":["264/508 nOfN","264 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["264/508 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["264/508 nOfN","0/264 nOfN","264/264 all"],"bad":["0 of 264 places have closed. T`
- **P-14** cities/newyork.html 390 light {"mode":"food"}: `{"want":289,"per":{"gallery":{"stated":["289/508 nOfN","289 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["289/508 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["289/508 nOfN","0/289 nOfN","289/289 all"],"bad":["0 of 289 places have closed. T`
- **P-14** cities/newyork.html 390 light {"t":"1"}: `{"want":97,"per":{"gallery":{"stated":["97/508 nOfN","97 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["97/508 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["97/508 nOfN","0/97 nOfN","97/97 all"],"bad":["0 of 97 places have closed. They stay `
- **P-21** cities/newyork.html 390 light atlas: `{"pos":"1 of 508 in this Atlas view","want":264}`
- **P-14** cities/newyork.html 1440 light {}: `{"want":508,"per":{"gallery":{"stated":["508 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["508/508 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["508/508 all"],"bad":[],"mapArea":[]},"insights":{"stated":["508/508 nOfN","0/508 nOfN","508/508 all"],"bad":["0 of 508 places have closed. They`
- **P-14** cities/newyork.html 1440 light {"a":"MAN"}: `{"want":264,"per":{"gallery":{"stated":["264/508 nOfN","264 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["264/264 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["264/508 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["264/508 nOfN","0/264 nOfN","264/264 all"],"bad":["0 of 264 places h`
- **P-14** cities/newyork.html 1440 light {"mode":"food"}: `{"want":289,"per":{"gallery":{"stated":["289/508 nOfN","289 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["289/289 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["289/508 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["289/508 nOfN","0/289 nOfN","289/289 all"],"bad":["0 of 289 places h`
- **P-14** cities/newyork.html 1440 light {"t":"1"}: `{"want":97,"per":{"gallery":{"stated":["97/508 nOfN","97 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["97/97 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["97/508 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["97/508 nOfN","0/97 nOfN","97/97 all"],"bad":["0 of 97 places have closed.`
- **P-21** cities/newyork.html 1440 light atlas: `{"pos":"1 of 508 in this Atlas view","want":264}`
- **P-13** Singapore/chinatown.html 390 light : `{"N":16,"reach":{"gallery":{"n":16,"extra":[]},"atlas":{"n":0,"extra":[]},"guidebook":{"n":16,"extra":[]},"insights":{"n":16,"extra":[]}}}`
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
- **P-13** cities/wheeling.html 390 light : `{"N":42,"reach":{"gallery":{"n":42,"extra":[]},"atlas":{"n":0,"extra":[]},"guidebook":{"n":42,"extra":[]},"insights":{"n":42,"extra":[]}}}`
- **P-15** cities/wheeling.html 390 light atlas: `{"N":42,"lines":[]}`
- **P-14** cities/wheeling.html 390 light {}: `{"want":42,"per":{"gallery":{"stated":["42 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["42/42 all"],"bad":[],"mapArea":[]},"insights":{"stated":["40/42 nOfN","2/42 nOfN","42/42 all"],"bad":["Computed from 40 of 42 places: open, with a verified pi`
- **P-14** cities/wheeling.html 390 light {"a":"WHL"}: `{"want":15,"per":{"gallery":{"stated":["15/42 nOfN","15 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["15/42 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["15/42 nOfN","1/15 nOfN","15/15 all"],"bad":["1 of 15 places have closed. They stay in `
- **P-14** cities/wheeling.html 390 light {"mode":"food"}: `{"want":14,"per":{"gallery":{"stated":["14/42 nOfN","14 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["14/42 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["14/42 nOfN","2/14 nOfN","14/14 all"],"bad":["2 of 14 places have closed. They stay in `
- **P-14** cities/wheeling.html 390 light {"t":"1"}: `{"want":21,"per":{"gallery":{"stated":["21/42 nOfN","21 range"],"bad":[],"mapArea":[]},"atlas":{"stated":[],"bad":[],"mapArea":[]},"guidebook":{"stated":["21/42 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["21/42 nOfN","0/21 nOfN","21/21 all"],"bad":["0 of 21 places have closed. They stay in `
- **P-26** cities/wheeling.html 390 light : `{"hits":{"gallery":[],"atlas":[],"guidebook":["A cornerstone of Center Wheeling's revival since 2006, set in an 1860 building that won a $50,000 National Trust Backing Historic Small Restaurants grant; known for its wide crepe menu."],"insights":[]},"photos":0,"uncredited":[]}`
- **P-14** cities/wheeling.html 1440 light {}: `{"want":42,"per":{"gallery":{"stated":["42 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["42/42 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["42/42 all"],"bad":[],"mapArea":[]},"insights":{"stated":["40/42 nOfN","2/42 nOfN","42/42 all"],"bad":["Computed from 40 of 42 places: open, with a `
- **P-14** cities/wheeling.html 1440 light {"a":"WHL"}: `{"want":15,"per":{"gallery":{"stated":["15/42 nOfN","15 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["15/15 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["15/42 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["15/42 nOfN","1/15 nOfN","15/15 all"],"bad":["1 of 15 places have closed. Th`
- **P-14** cities/wheeling.html 1440 light {"mode":"food"}: `{"want":14,"per":{"gallery":{"stated":["14/42 nOfN","14 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["14/14 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["14/42 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["14/42 nOfN","2/14 nOfN","14/14 all"],"bad":["2 of 14 places have closed. Th`
- **P-14** cities/wheeling.html 1440 light {"t":"1"}: `{"want":21,"per":{"gallery":{"stated":["21/42 nOfN","21 range"],"bad":[],"mapArea":[]},"atlas":{"stated":["21/21 all"],"bad":[],"mapArea":[]},"guidebook":{"stated":["21/42 nOfN"],"bad":[],"mapArea":[]},"insights":{"stated":["21/42 nOfN","0/21 nOfN","21/21 all"],"bad":["0 of 21 places have closed. Th`
