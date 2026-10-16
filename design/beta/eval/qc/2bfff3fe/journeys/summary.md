# QC run 2bfff3fe-journeys

SHA 2bfff3fe · 2026-10-16T14:03:04.587Z → 2026-10-16T14:12:07.859Z · chromium; tiles stubbed 1×1; off-origin aborted; SW blocked

| Id | Check | PASS | WARN | FAIL | N/A |
|---|---|---|---|---|---|
| J-01 | Discover → shortlist → plan a day → share → reopen | 10 | 0 | 0 | 0 |
| J-02 | Best food near X | 0 | 0 | 10 | 0 |
| J-03 | Is it still open? (closure honesty) | 6 | 0 | 0 | 4 |
| J-04 | Who recommends this and why? | 10 | 0 | 0 | 0 |
| J-05 | Switch views without losing context | 3 | 7 | 0 | 0 |
| J-06 | Back and Forward | 5 | 5 | 0 | 0 |
| J-07 | Keyboard only | 0 | 9 | 1 | 0 |
| J-08 | 200 % zoom | 10 | 0 | 0 | 0 |
| J-09 | Reduced motion | 10 | 0 | 0 | 0 |
| J-10 | Map library blocked | 10 | 0 | 0 | 0 |
| J-11 | Storage blocked | 10 | 0 | 0 | 0 |

## Journeys

| Id | Page | Viewport | Theme | Success | Steps | Friction |
|---|---|---|---|---|---|---|
| J-01 | cities/tokyo.html | 390 | light | yes | 5 |  |
| J-01 | cities/tokyo.html | 1440 | light | yes | 5 |  |
| J-02 | cities/tokyo.html | 390 | light | no | 5 | no area control on the page: opened Filters; the first card on screen (kanda-myojin) is outside the lens |
| J-02 | cities/tokyo.html | 1440 | light | no | 5 | no area control on the page: opened Filters |
| J-03 | cities/tokyo.html | 1440 | light | yes | 1 |  |
| J-04 | cities/tokyo.html | 1440 | light | yes | 2 |  |
| J-05 | cities/tokyo.html | 1440 | light | yes | 4 |  |
| J-06 | cities/tokyo.html | 1440 | light | partial | 3 | Back 1: got {"view":"atlas","sheet":false}, want {"view":"atlas","mode":"sights","sheet":false}; Back 2: got {"view":"gallery","sheet":false}, want {"view":"atlas","sheet":false}; Back 3: got {"view":null,"mode":null,"sheet":false}, want {"view":"gallery","sheet":false}; Forward 2: got {"view":"atla |
| J-03 | cities/tokyo.html | 390 | light | yes | 1 |  |
| J-04 | cities/tokyo.html | 390 | light | yes | 2 |  |
| J-07 | cities/tokyo.html | 1440 | light | partial | 40 | focus after Esc went to "Kanda Myōjin (神田明神)", outside the opener's card |
| J-08 | cities/tokyo.html | 1440@200% | light | yes | 0 |  |
| J-05 | cities/tokyo.html | 390 | light | partial | 4 | atlas: count ≠ 43; guidebook: switcher not reachable with the sheet open; guidebook: 2 taps (collapsed switcher); insights: 2 taps (collapsed switcher); gallery: 2 taps (collapsed switcher) |
| J-06 | cities/tokyo.html | 390 | light | yes | 3 |  |
| J-07 | cities/tokyo.html | 390 | light | partial | 40 | 1 of 40 stops show no focus ring: INPUT ; focus after Esc went to "Kanda Myōjin (神田明神)", outside the opener's card |
| J-08 | cities/tokyo.html | 1440@200% | light | yes | 0 |  |
| J-09 | cities/tokyo.html | 1440 | light | yes | 0 |  |
| J-10 | cities/tokyo.html | 1440 | light | yes | 0 |  |
| J-11 | cities/tokyo.html | 1440 | light | yes | 2 |  |
| J-01 | cleveland.html | 390 | light | yes | 6 |  |
| J-02 | cleveland.html | 390 | light | no | 5 | no area control on the page: opened Filters; visible food cards are not in rank order; the first card on screen (slymans-restaurant-and-deli) is outside the lens |
| J-09 | cities/tokyo.html | 390 | light | yes | 0 |  |
| J-10 | cities/tokyo.html | 390 | light | yes | 0 |  |
| J-11 | cities/tokyo.html | 390 | light | yes | 2 |  |
| J-01 | cleveland.html | 1440 | light | yes | 6 |  |
| J-02 | cleveland.html | 1440 | light | no | 5 | no area control on the page: opened Filters; visible food cards are not in rank order |
| J-03 | cleveland.html | 390 | light | yes | 1 |  |
| J-03 | cleveland.html | 1440 | light | yes | 1 |  |
| J-04 | cleveland.html | 390 | light | yes | 2 |  |
| J-04 | cleveland.html | 1440 | light | yes | 2 |  |
| J-05 | cleveland.html | 1440 | light | yes | 4 |  |
| J-05 | cleveland.html | 390 | light | partial | 4 | atlas: count ≠ 42; guidebook: switcher not reachable with the sheet open; guidebook: 2 taps (collapsed switcher); insights: 2 taps (collapsed switcher); gallery: 2 taps (collapsed switcher) |
| J-06 | cleveland.html | 1440 | light | partial | 3 | Back 1: got {"view":"atlas","sheet":false}, want {"view":"atlas","mode":"sights","sheet":false}; Back 2: got {"view":"gallery","sheet":false}, want {"view":"atlas","sheet":false}; Back 3: got {"view":null,"mode":null,"sheet":false}, want {"view":"gallery","sheet":false}; Forward 2: got {"view":"atla |
| J-06 | cleveland.html | 390 | light | yes | 3 |  |
| J-07 | cleveland.html | 390 | light | partial | 40 | 1 of 40 stops show no focus ring: INPUT ; focus after Esc went to "Slyman's Restaurant and Deli", outside the opener's card |
| J-08 | cleveland.html | 1440@200% | light | yes | 0 |  |
| J-07 | cleveland.html | 1440 | light | partial | 40 | focus after Esc went to "Slyman's Restaurant and Deli", outside the opener's card |
| J-08 | cleveland.html | 1440@200% | light | yes | 0 |  |
| J-09 | cleveland.html | 390 | light | yes | 0 |  |
| J-10 | cleveland.html | 390 | light | yes | 0 |  |
| J-09 | cleveland.html | 1440 | light | yes | 0 |  |
| J-11 | cleveland.html | 390 | light | yes | 2 |  |
| J-10 | cleveland.html | 1440 | light | yes | 0 |  |
| J-11 | cleveland.html | 1440 | light | yes | 2 |  |
| J-01 | cities/newyork.html | 390 | light | yes | 5 |  |
| J-01 | cities/newyork.html | 1440 | light | yes | 5 |  |
| J-02 | cities/newyork.html | 390 | light | no | 5 | no area control on the page: opened Filters; the first card on screen (katzs-delicatessen) is outside the lens |
| J-03 | cities/newyork.html | 390 | light | n/a | 0 | no closed place on this page |
| J-04 | cities/newyork.html | 390 | light | yes | 2 |  |
| J-02 | cities/newyork.html | 1440 | light | no | 5 | no area control on the page: opened Filters |
| J-03 | cities/newyork.html | 1440 | light | n/a | 0 | no closed place on this page |
| J-04 | cities/newyork.html | 1440 | light | yes | 2 |  |
| J-05 | cities/newyork.html | 390 | light | partial | 4 | atlas: count ≠ 264; guidebook: switcher not reachable with the sheet open; guidebook: 2 taps (collapsed switcher); insights: 2 taps (collapsed switcher); gallery: 2 taps (collapsed switcher); close returned to scrollY 1509, was 1400 |
| J-05 | cities/newyork.html | 1440 | light | partial | 4 | atlas: count ≠ 264 |
| J-06 | cities/newyork.html | 390 | light | yes | 3 |  |
| J-06 | cities/newyork.html | 1440 | light | partial | 3 | Back 1: got {"view":"atlas","sheet":false}, want {"view":"atlas","mode":"sights","sheet":false}; Back 2: got {"view":"gallery","sheet":false}, want {"view":"atlas","sheet":false}; Back 3: got {"view":null,"mode":null,"sheet":false}, want {"view":"gallery","sheet":false}; Forward 2: got {"view":"atla |
| J-07 | cities/newyork.html | 390 | light | partial | 40 | 1 of 40 stops show no focus ring: INPUT ; focus after Esc went to "Katz's Delicatessen", outside the opener's card |
| J-08 | cities/newyork.html | 1440@200% | light | yes | 0 |  |
| J-07 | cities/newyork.html | 1440 | light | partial | 40 | 1 of 40 stops show no focus ring: INPUT ; focus after Esc went to "Katz's Delicatessen", outside the opener's card |
| J-08 | cities/newyork.html | 1440@200% | light | yes | 0 |  |
| J-09 | cities/newyork.html | 390 | light | yes | 0 |  |
| J-10 | cities/newyork.html | 390 | light | yes | 0 |  |
| J-11 | cities/newyork.html | 390 | light | yes | 2 |  |
| J-01 | Singapore/chinatown.html | 390 | light | yes | 6 |  |
| J-02 | Singapore/chinatown.html | 390 | light | no | 4 | no area control on the page: opened Filters; not found: area Chinatown & CBD |
| J-03 | Singapore/chinatown.html | 390 | light | n/a | 0 | no closed place on this page |
| J-04 | Singapore/chinatown.html | 390 | light | yes | 2 |  |
| J-09 | cities/newyork.html | 1440 | light | yes | 0 |  |
| J-10 | cities/newyork.html | 1440 | light | yes | 0 |  |
| J-11 | cities/newyork.html | 1440 | light | yes | 2 |  |
| J-05 | Singapore/chinatown.html | 390 | light | partial | 4 | atlas: count ≠ 16; guidebook: switcher not reachable with the sheet open; guidebook: 2 taps (collapsed switcher); insights: 2 taps (collapsed switcher); gallery: 2 taps (collapsed switcher) |
| J-01 | Singapore/chinatown.html | 1440 | light | yes | 6 |  |
| J-06 | Singapore/chinatown.html | 390 | light | yes | 3 |  |
| J-02 | Singapore/chinatown.html | 1440 | light | no | 4 | no area control on the page: opened Filters; not found: area Chinatown & CBD |
| J-03 | Singapore/chinatown.html | 1440 | light | n/a | 0 | no closed place on this page |
| J-07 | Singapore/chinatown.html | 390 | light | partial | 40 | focus after Esc went to "Tian Tian Hainanese Chicken Rice", outside the opener's card |
| J-04 | Singapore/chinatown.html | 1440 | light | yes | 2 |  |
| J-08 | Singapore/chinatown.html | 1440@200% | light | yes | 0 |  |
| J-05 | Singapore/chinatown.html | 1440 | light | partial | 4 | atlas: count ≠ 16 |
| J-06 | Singapore/chinatown.html | 1440 | light | partial | 3 | Back 1: got {"view":"atlas","sheet":false}, want {"view":"atlas","mode":"sights","sheet":false}; Back 2: got {"view":"gallery","sheet":false}, want {"view":"atlas","sheet":false}; Back 3: got {"view":null,"mode":null,"sheet":false}, want {"view":"gallery","sheet":false}; Forward 2: got {"view":"atla |
| J-07 | Singapore/chinatown.html | 1440 | light | partial | 40 | focus after Esc went to "Tian Tian Hainanese Chicken Rice", outside the opener's card |
| J-08 | Singapore/chinatown.html | 1440@200% | light | yes | 0 |  |
| J-09 | Singapore/chinatown.html | 390 | light | yes | 0 |  |
| J-10 | Singapore/chinatown.html | 390 | light | yes | 0 |  |
| J-11 | Singapore/chinatown.html | 390 | light | yes | 2 |  |
| J-01 | cities/wheeling.html | 390 | light | yes | 6 |  |
| J-02 | cities/wheeling.html | 390 | light | no | 5 | no area control on the page: opened Filters; the first card on screen (wheeling-suspension-bridge) is outside the lens |
| J-09 | Singapore/chinatown.html | 1440 | light | yes | 0 |  |
| J-10 | Singapore/chinatown.html | 1440 | light | yes | 0 |  |
| J-11 | Singapore/chinatown.html | 1440 | light | yes | 2 |  |
| J-01 | cities/wheeling.html | 1440 | light | yes | 6 |  |
| J-02 | cities/wheeling.html | 1440 | light | no | 5 | no area control on the page: opened Filters |
| J-03 | cities/wheeling.html | 1440 | light | yes | 1 |  |
| J-04 | cities/wheeling.html | 1440 | light | yes | 2 |  |
| J-03 | cities/wheeling.html | 390 | light | yes | 1 |  |
| J-04 | cities/wheeling.html | 390 | light | yes | 2 |  |
| J-05 | cities/wheeling.html | 1440 | light | yes | 4 |  |
| J-06 | cities/wheeling.html | 1440 | light | partial | 3 | Back 1: got {"view":"atlas","sheet":false}, want {"view":"atlas","mode":"sights","sheet":false}; Back 2: got {"view":"gallery","sheet":false}, want {"view":"atlas","sheet":false}; Back 3: got {"view":null,"mode":null,"sheet":false}, want {"view":"gallery","sheet":false}; Forward 2: got {"view":"atla |
| J-05 | cities/wheeling.html | 390 | light | partial | 4 | atlas: count ≠ 15; guidebook: switcher not reachable with the sheet open; guidebook: 2 taps (collapsed switcher); insights: 2 taps (collapsed switcher); gallery: 2 taps (collapsed switcher) |
| J-07 | cities/wheeling.html | 1440 | light | no | 40 | Enter on the Atlas segment did not switch; Enter on a card opened no sheet |
| J-06 | cities/wheeling.html | 390 | light | yes | 3 |  |
| J-08 | cities/wheeling.html | 1440@200% | light | yes | 0 |  |
| J-07 | cities/wheeling.html | 390 | light | partial | 40 | focus after Esc went to "Wheeling Suspension Bridge", outside the opener's card |
| J-08 | cities/wheeling.html | 1440@200% | light | yes | 0 |  |
| J-09 | cities/wheeling.html | 1440 | light | yes | 0 |  |
| J-10 | cities/wheeling.html | 1440 | light | yes | 0 |  |
| J-11 | cities/wheeling.html | 1440 | light | yes | 2 |  |
| J-09 | cities/wheeling.html | 390 | light | yes | 0 |  |
| J-10 | cities/wheeling.html | 390 | light | yes | 0 |  |
| J-11 | cities/wheeling.html | 390 | light | yes | 2 |  |

## Failures (first 400)

- **J-02** cities/tokyo.html 390 light : `{"success":"no","steps":5,"friction":["no area control on the page: opened Filters","the first card on screen (kanda-myojin) is outside the lens"],"area":"CHUO","want":36,"route":{"view":"gallery","mode":"food","a":"CHUO"},"sheet":null}`
- **J-02** cities/tokyo.html 1440 light : `{"success":"no","steps":5,"friction":["no area control on the page: opened Filters"],"area":"CHUO","want":36,"route":{"view":"gallery","mode":"food","a":"CHUO"},"sheet":null}`
- **J-02** cleveland.html 390 light : `{"success":"no","steps":5,"friction":["no area control on the page: opened Filters","visible food cards are not in rank order","the first card on screen (slymans-restaurant-and-deli) is outside the lens"],"area":"UC","want":15,"route":{"view":"gallery","mode":"food","a":"UC"},"sheet":null}`
- **J-02** cleveland.html 1440 light : `{"success":"no","steps":5,"friction":["no area control on the page: opened Filters","visible food cards are not in rank order"],"area":"UC","want":15,"route":{"view":"gallery","mode":"food","a":"UC"},"sheet":null}`
- **J-02** cities/newyork.html 390 light : `{"success":"no","steps":5,"friction":["no area control on the page: opened Filters","the first card on screen (katzs-delicatessen) is outside the lens"],"area":"BK","want":47,"route":{"view":"gallery","mode":"food","a":"BK"},"sheet":null}`
- **J-02** cities/newyork.html 1440 light : `{"success":"no","steps":5,"friction":["no area control on the page: opened Filters"],"area":"BK","want":47,"route":{"view":"gallery","mode":"food","a":"BK"},"sheet":null}`
- **J-02** Singapore/chinatown.html 390 light : `{"success":"no","steps":4,"friction":["no area control on the page: opened Filters","not found: area Chinatown & CBD"],"area":"CHINATOWN","want":12,"route":{"view":"gallery","mode":"food"},"sheet":"Tian Tian Hainanese Chicken Rice"}`
- **J-02** Singapore/chinatown.html 1440 light : `{"success":"no","steps":4,"friction":["no area control on the page: opened Filters","not found: area Chinatown & CBD"],"area":"CHINATOWN","want":12,"route":{"view":"gallery","mode":"food"},"sheet":null}`
- **J-02** cities/wheeling.html 390 light : `{"success":"no","steps":5,"friction":["no area control on the page: opened Filters","the first card on screen (wheeling-suspension-bridge) is outside the lens"],"area":"WHL","want":5,"route":{"view":"gallery","mode":"food","a":"WHL"},"sheet":null}`
- **J-02** cities/wheeling.html 1440 light : `{"success":"no","steps":5,"friction":["no area control on the page: opened Filters"],"area":"WHL","want":5,"route":{"view":"gallery","mode":"food","a":"WHL"},"sheet":null}`
- **J-07** cities/wheeling.html 1440 light : `{"success":"no","steps":40,"friction":["Enter on the Atlas segment did not switch","Enter on a card opened no sheet"],"firstStops":["A:Skip to content","A:Cleo — all destinations","A:United States","A:Destinations","A:How we choose","BUTTON:English"],"tabsToSwitcher":12}`
