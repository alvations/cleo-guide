# QC run f2c39d69-journeys

SHA f2c39d69 · 2026-10-11T22:06:25.291Z → 2026-10-11T22:30:17.672Z · chromium; tiles stubbed 1×1; off-origin aborted; SW blocked

| Id | Check | PASS | WARN | FAIL | N/A |
|---|---|---|---|---|---|
| J-01 | Discover → shortlist → plan a day → share → reopen | 20 | 0 | 0 | 0 |
| J-01h | Discover from a hub | 8 | 0 | 0 | 0 |
| J-02 | Best food near X | 0 | 13 | 7 | 8 |
| J-03 | Is it still open? (closure honesty) | 12 | 0 | 0 | 16 |
| J-04 | Who recommends this and why? | 20 | 0 | 0 | 8 |
| J-05 | Switch views without losing context | 0 | 20 | 0 | 8 |
| J-06 | Back and Forward | 28 | 0 | 0 | 0 |
| J-07 | Keyboard only | 0 | 27 | 1 | 0 |
| J-08 | 200 % zoom | 28 | 0 | 0 | 0 |
| J-09 | Reduced motion | 28 | 0 | 0 | 0 |
| J-10 | Map library blocked | 28 | 0 | 0 | 0 |
| J-11 | Storage blocked | 28 | 0 | 0 | 0 |

## Journeys

| Id | Page | Viewport | Theme | Success | Steps | Friction |
|---|---|---|---|---|---|---|
| J-01 | cities/tokyo.html | 390 | dark | yes | 5 |  |
| J-01 | cities/tokyo.html | 390 | light | yes | 5 |  |
| J-02 | cities/tokyo.html | 390 | dark | partial | 5 | no area control on the page: opened Filters; the first card on screen (kanda-myojin) is outside the lens |
| J-02 | cities/tokyo.html | 390 | light | partial | 5 | no area control on the page: opened Filters; the first card on screen (kanda-myojin) is outside the lens |
| J-03 | cities/tokyo.html | 390 | dark | yes | 1 |  |
| J-03 | cities/tokyo.html | 390 | light | yes | 1 |  |
| J-04 | cities/tokyo.html | 390 | dark | yes | 2 |  |
| J-04 | cities/tokyo.html | 390 | light | yes | 2 |  |
| J-05 | cities/tokyo.html | 390 | dark | partial | 4 | atlas: count ≠ 43; guidebook: switcher not reachable with the sheet open; guidebook: 2 taps (collapsed switcher); insights: 2 taps (collapsed switcher); insights: count ≠ 43; gallery: 2 taps (collapsed switcher) |
| J-05 | cities/tokyo.html | 390 | light | partial | 4 | atlas: count ≠ 43; guidebook: switcher not reachable with the sheet open; guidebook: 2 taps (collapsed switcher); insights: 2 taps (collapsed switcher); insights: count ≠ 43; gallery: 2 taps (collapsed switcher) |
| J-06 | cities/tokyo.html | 390 | dark | yes | 3 |  |
| J-06 | cities/tokyo.html | 390 | light | yes | 3 |  |
| J-07 | cities/tokyo.html | 390 | dark | partial | 40 | 1 of 40 stops show no focus ring: INPUT ; focus after Esc went to "Kanda Myōjin (神田明神)", outside the opener's card |
| J-07 | cities/tokyo.html | 390 | light | partial | 40 | 1 of 40 stops show no focus ring: INPUT ; focus after Esc went to "Kanda Myōjin (神田明神)", outside the opener's card |
| J-08 | cities/tokyo.html | 1440@200% | dark | yes | 0 |  |
| J-08 | cities/tokyo.html | 1440@200% | light | yes | 0 |  |
| J-09 | cities/tokyo.html | 390 | dark | yes | 0 |  |
| J-09 | cities/tokyo.html | 390 | light | yes | 0 |  |
| J-10 | cities/tokyo.html | 390 | dark | yes | 0 |  |
| J-10 | cities/tokyo.html | 390 | light | yes | 0 |  |
| J-11 | cities/tokyo.html | 390 | dark | yes | 2 |  |
| J-11 | cities/tokyo.html | 390 | light | yes | 2 |  |
| J-01 | cities/tokyo.html | 1440 | light | yes | 5 |  |
| J-01 | cities/tokyo.html | 1440 | dark | yes | 5 |  |
| J-02 | cities/tokyo.html | 1440 | light | partial | 5 | no area control on the page: opened Filters |
| J-02 | cities/tokyo.html | 1440 | dark | no | 4 | no area control on the page: opened Filters; could not click first food place in CHUO: locator.click: Timeout 3000ms exceeded. |
| J-03 | cities/tokyo.html | 1440 | light | yes | 1 |  |
| J-03 | cities/tokyo.html | 1440 | dark | yes | 1 |  |
| J-04 | cities/tokyo.html | 1440 | light | yes | 2 |  |
| J-04 | cities/tokyo.html | 1440 | dark | yes | 2 |  |
| J-05 | cities/tokyo.html | 1440 | light | partial | 4 | atlas: count ≠ 43; insights: count ≠ 43; close returned to scrollY 3660, was 2875 |
| J-05 | cities/tokyo.html | 1440 | dark | partial | 4 | atlas: count ≠ 43; insights: count ≠ 43; close returned to scrollY 3217, was 2397 |
| J-06 | cities/tokyo.html | 1440 | light | yes | 3 |  |
| J-06 | cities/tokyo.html | 1440 | dark | yes | 3 |  |
| J-07 | cities/tokyo.html | 1440 | light | partial | 40 | 1 of 40 stops show no focus ring: INPUT ; focus after Esc went to "Kanda Myōjin (神田明神)", outside the opener's card |
| J-07 | cities/tokyo.html | 1440 | dark | partial | 40 | focus after Esc went to "Kanda Myōjin (神田明神)", outside the opener's card |
| J-08 | cities/tokyo.html | 1440@200% | light | yes | 0 |  |
| J-08 | cities/tokyo.html | 1440@200% | dark | yes | 0 |  |
| J-09 | cities/tokyo.html | 1440 | light | yes | 0 |  |
| J-09 | cities/tokyo.html | 1440 | dark | yes | 0 |  |
| J-10 | cities/tokyo.html | 1440 | light | yes | 0 |  |
| J-10 | cities/tokyo.html | 1440 | dark | yes | 0 |  |
| J-11 | cities/tokyo.html | 1440 | light | yes | 2 |  |
| J-11 | cities/tokyo.html | 1440 | dark | yes | 2 |  |
| J-01 | cleveland.html | 390 | light | yes | 6 |  |
| J-01 | cleveland.html | 390 | dark | yes | 6 |  |
| J-02 | cleveland.html | 390 | light | partial | 5 | no area control on the page: opened Filters; visible food cards are not in rank order; the first card on screen (slymans-restaurant-and-deli) is outside the lens |
| J-02 | cleveland.html | 390 | dark | partial | 5 | no area control on the page: opened Filters; visible food cards are not in rank order; the first card on screen (slymans-restaurant-and-deli) is outside the lens |
| J-03 | cleveland.html | 390 | light | yes | 1 |  |
| J-03 | cleveland.html | 390 | dark | yes | 1 |  |
| J-04 | cleveland.html | 390 | light | yes | 2 |  |
| J-04 | cleveland.html | 390 | dark | yes | 2 |  |
| J-05 | cleveland.html | 390 | light | partial | 4 | atlas: count ≠ 42; guidebook: switcher not reachable with the sheet open; guidebook: 2 taps (collapsed switcher); insights: 2 taps (collapsed switcher); insights: count ≠ 42; gallery: 2 taps (collapsed switcher) |
| J-05 | cleveland.html | 390 | dark | partial | 4 | atlas: count ≠ 42; guidebook: switcher not reachable with the sheet open; guidebook: 2 taps (collapsed switcher); insights: 2 taps (collapsed switcher); insights: count ≠ 42; gallery: 2 taps (collapsed switcher) |
| J-06 | cleveland.html | 390 | light | yes | 3 |  |
| J-06 | cleveland.html | 390 | dark | yes | 3 |  |
| J-07 | cleveland.html | 390 | light | partial | 40 | 1 of 40 stops show no focus ring: INPUT ; 6 focused elements were off-screen (not scrolled into view); focus after Esc went to "Slyman's Restaurant and Deli", outside the opener's card |
| J-07 | cleveland.html | 390 | dark | partial | 40 | 6 focused elements were off-screen (not scrolled into view); focus after Esc went to "Slyman's Restaurant and Deli", outside the opener's card |
| J-08 | cleveland.html | 1440@200% | light | yes | 0 |  |
| J-08 | cleveland.html | 1440@200% | dark | yes | 0 |  |
| J-09 | cleveland.html | 390 | light | yes | 0 |  |
| J-09 | cleveland.html | 390 | dark | yes | 0 |  |
| J-10 | cleveland.html | 390 | light | yes | 0 |  |
| J-10 | cleveland.html | 390 | dark | yes | 0 |  |
| J-11 | cleveland.html | 390 | light | yes | 2 |  |
| J-11 | cleveland.html | 390 | dark | yes | 2 |  |
| J-01 | cleveland.html | 1440 | light | yes | 6 |  |
| J-01 | cleveland.html | 1440 | dark | yes | 6 |  |
| J-02 | cleveland.html | 1440 | light | partial | 5 | no area control on the page: opened Filters; visible food cards are not in rank order |
| J-02 | cleveland.html | 1440 | dark | partial | 5 | no area control on the page: opened Filters; visible food cards are not in rank order |
| J-03 | cleveland.html | 1440 | light | yes | 1 |  |
| J-03 | cleveland.html | 1440 | dark | yes | 1 |  |
| J-04 | cleveland.html | 1440 | light | yes | 2 |  |
| J-04 | cleveland.html | 1440 | dark | yes | 2 |  |
| J-05 | cleveland.html | 1440 | light | partial | 4 | insights: count ≠ 42 |
| J-05 | cleveland.html | 1440 | dark | partial | 4 | atlas: count ≠ 42; insights: count ≠ 42; close returned to scrollY 2218, was 1400 |
| J-06 | cleveland.html | 1440 | light | yes | 3 |  |
| J-06 | cleveland.html | 1440 | dark | yes | 3 |  |
| J-07 | cleveland.html | 1440 | light | partial | 40 | focus after Esc went to "Slyman's Restaurant and Deli", outside the opener's card |
| J-07 | cleveland.html | 1440 | dark | partial | 40 | 1 of 40 stops show no focus ring: INPUT ; focus after Esc went to "Slyman's Restaurant and Deli", outside the opener's card |
| J-08 | cleveland.html | 1440@200% | light | yes | 0 |  |
| J-08 | cleveland.html | 1440@200% | dark | yes | 0 |  |
| J-09 | cleveland.html | 1440 | light | yes | 0 |  |
| J-09 | cleveland.html | 1440 | dark | yes | 0 |  |
| J-10 | cleveland.html | 1440 | light | yes | 0 |  |
| J-10 | cleveland.html | 1440 | dark | yes | 0 |  |
| J-11 | cleveland.html | 1440 | light | yes | 2 |  |
| J-11 | cleveland.html | 1440 | dark | yes | 2 |  |
| J-01 | cities/newyork.html | 390 | light | yes | 5 |  |
| J-01 | cities/newyork.html | 390 | dark | yes | 5 |  |
| J-02 | cities/newyork.html | 390 | light | partial | 5 | no area control on the page: opened Filters; the first card on screen (katzs-delicatessen) is outside the lens |
| J-03 | cities/newyork.html | 390 | light | n/a | 0 | no closed place on this page |
| J-02 | cities/newyork.html | 390 | dark | no | 4 | no area control on the page: opened Filters; the first card on screen (katzs-delicatessen) is outside the lens; could not click first food place in BK: locator.click: Timeout 3000ms exceeded. |
| J-03 | cities/newyork.html | 390 | dark | n/a | 0 | no closed place on this page |
| J-04 | cities/newyork.html | 390 | light | yes | 2 |  |
| J-04 | cities/newyork.html | 390 | dark | yes | 2 |  |
| J-05 | cities/newyork.html | 390 | light | partial | 4 | atlas: count ≠ 264; guidebook: switcher not reachable with the sheet open; guidebook: 2 taps (collapsed switcher); insights: 2 taps (collapsed switcher); insights: count ≠ 264; gallery: 2 taps (collapsed switcher); close returned to scrollY 1488, was 1400 |
| J-05 | cities/newyork.html | 390 | dark | partial | 4 | atlas: count ≠ 264; guidebook: switcher not reachable with the sheet open; guidebook: 2 taps (collapsed switcher); insights: 2 taps (collapsed switcher); insights: count ≠ 264; gallery: 2 taps (collapsed switcher); close returned to scrollY 1488, was 1400 |
| J-06 | cities/newyork.html | 390 | light | yes | 3 |  |
| J-06 | cities/newyork.html | 390 | dark | yes | 3 |  |
| J-07 | cities/newyork.html | 390 | light | partial | 40 | 1 of 40 stops show no focus ring: INPUT ; focus after Esc went to "Katz's Delicatessen", outside the opener's card |
| J-07 | cities/newyork.html | 390 | dark | partial | 40 | 1 of 40 stops show no focus ring: INPUT ; focus after Esc went to "Katz's Delicatessen", outside the opener's card |
| J-08 | cities/newyork.html | 1440@200% | light | yes | 0 |  |
| J-08 | cities/newyork.html | 1440@200% | dark | yes | 0 |  |
| J-09 | cities/newyork.html | 390 | light | yes | 0 |  |
| J-09 | cities/newyork.html | 390 | dark | yes | 0 |  |
| J-10 | cities/newyork.html | 390 | light | yes | 0 |  |
| J-11 | cities/newyork.html | 390 | light | yes | 2 |  |
| J-10 | cities/newyork.html | 390 | dark | yes | 0 |  |
| J-11 | cities/newyork.html | 390 | dark | yes | 2 |  |
| J-01 | cities/newyork.html | 1440 | light | yes | 5 |  |
| J-01 | cities/newyork.html | 1440 | dark | yes | 5 |  |
| J-02 | cities/newyork.html | 1440 | light | partial | 5 | no area control on the page: opened Filters |
| J-03 | cities/newyork.html | 1440 | light | n/a | 0 | no closed place on this page |
| J-02 | cities/newyork.html | 1440 | dark | partial | 5 | no area control on the page: opened Filters |
| J-03 | cities/newyork.html | 1440 | dark | n/a | 0 | no closed place on this page |
| J-04 | cities/newyork.html | 1440 | light | yes | 2 |  |
| J-04 | cities/newyork.html | 1440 | dark | yes | 2 |  |
| J-05 | cities/newyork.html | 1440 | light | partial | 4 | atlas: count ≠ 264; insights: count ≠ 264 |
| J-06 | cities/newyork.html | 1440 | light | yes | 3 |  |
| J-07 | cities/newyork.html | 1440 | light | partial | 40 | focus after Esc went to "Katz's Delicatessen", outside the opener's card |
| J-08 | cities/newyork.html | 1440@200% | light | yes | 0 |  |
| J-05 | cities/newyork.html | 1440 | dark | partial | 4 | atlas: count ≠ 264; insights: count ≠ 264; close returned to scrollY 3580, was 2423 |
| J-06 | cities/newyork.html | 1440 | dark | yes | 3 |  |
| J-09 | cities/newyork.html | 1440 | light | yes | 0 |  |
| J-10 | cities/newyork.html | 1440 | light | yes | 0 |  |
| J-11 | cities/newyork.html | 1440 | light | yes | 2 |  |
| J-01 | Singapore/chinatown.html | 390 | light | yes | 6 |  |
| J-02 | Singapore/chinatown.html | 390 | light | no | 4 | no area control on the page: opened Filters; not found: area Chinatown & CBD |
| J-03 | Singapore/chinatown.html | 390 | light | n/a | 0 | no closed place on this page |
| J-07 | cities/newyork.html | 1440 | dark | partial | 40 | focus after Esc went to "Katz's Delicatessen", outside the opener's card |
| J-04 | Singapore/chinatown.html | 390 | light | yes | 2 |  |
| J-08 | cities/newyork.html | 1440@200% | dark | yes | 0 |  |
| J-05 | Singapore/chinatown.html | 390 | light | partial | 4 | atlas: count ≠ 16; guidebook: switcher not reachable with the sheet open; guidebook: 2 taps (collapsed switcher); insights: 2 taps (collapsed switcher); gallery: 2 taps (collapsed switcher); close returned to scrollY 1532, was 1400 |
| J-06 | Singapore/chinatown.html | 390 | light | yes | 3 |  |
| J-07 | Singapore/chinatown.html | 390 | light | partial | 40 | focus after Esc went to "Tian Tian Hainanese Chicken Rice", outside the opener's card |
| J-08 | Singapore/chinatown.html | 1440@200% | light | yes | 0 |  |
| J-09 | cities/newyork.html | 1440 | dark | yes | 0 |  |
| J-10 | cities/newyork.html | 1440 | dark | yes | 0 |  |
| J-11 | cities/newyork.html | 1440 | dark | yes | 2 |  |
| J-01 | Singapore/chinatown.html | 390 | dark | yes | 6 |  |
| J-02 | Singapore/chinatown.html | 390 | dark | no | 4 | no area control on the page: opened Filters; not found: area Chinatown & CBD |
| J-03 | Singapore/chinatown.html | 390 | dark | n/a | 0 | no closed place on this page |
| J-09 | Singapore/chinatown.html | 390 | light | yes | 0 |  |
| J-04 | Singapore/chinatown.html | 390 | dark | yes | 2 |  |
| J-10 | Singapore/chinatown.html | 390 | light | yes | 0 |  |
| J-11 | Singapore/chinatown.html | 390 | light | yes | 2 |  |
| J-05 | Singapore/chinatown.html | 390 | dark | partial | 4 | atlas: count ≠ 16; guidebook: switcher not reachable with the sheet open; guidebook: 2 taps (collapsed switcher); insights: 2 taps (collapsed switcher); gallery: 2 taps (collapsed switcher); close returned to scrollY 1532, was 1400 |
| J-01 | Singapore/chinatown.html | 1440 | light | yes | 6 |  |
| J-06 | Singapore/chinatown.html | 390 | dark | yes | 3 |  |
| J-02 | Singapore/chinatown.html | 1440 | light | no | 4 | no area control on the page: opened Filters; not found: area Chinatown & CBD |
| J-03 | Singapore/chinatown.html | 1440 | light | n/a | 0 | no closed place on this page |
| J-04 | Singapore/chinatown.html | 1440 | light | yes | 2 |  |
| J-07 | Singapore/chinatown.html | 390 | dark | partial | 40 | focus after Esc went to "Tian Tian Hainanese Chicken Rice", outside the opener's card |
| J-08 | Singapore/chinatown.html | 1440@200% | dark | yes | 0 |  |
| J-05 | Singapore/chinatown.html | 1440 | light | partial | 4 | atlas: count ≠ 16 |
| J-06 | Singapore/chinatown.html | 1440 | light | yes | 3 |  |
| J-07 | Singapore/chinatown.html | 1440 | light | partial | 40 | 1 of 40 stops show no focus ring: INPUT ; focus after Esc went to "Tian Tian Hainanese Chicken Rice", outside the opener's card |
| J-08 | Singapore/chinatown.html | 1440@200% | light | yes | 0 |  |
| J-09 | Singapore/chinatown.html | 390 | dark | yes | 0 |  |
| J-10 | Singapore/chinatown.html | 390 | dark | yes | 0 |  |
| J-11 | Singapore/chinatown.html | 390 | dark | yes | 2 |  |
| J-01 | Singapore/chinatown.html | 1440 | dark | yes | 6 |  |
| J-02 | Singapore/chinatown.html | 1440 | dark | no | 4 | no area control on the page: opened Filters; not found: area Chinatown & CBD |
| J-03 | Singapore/chinatown.html | 1440 | dark | n/a | 0 | no closed place on this page |
| J-04 | Singapore/chinatown.html | 1440 | dark | yes | 2 |  |
| J-09 | Singapore/chinatown.html | 1440 | light | yes | 0 |  |
| J-10 | Singapore/chinatown.html | 1440 | light | yes | 0 |  |
| J-11 | Singapore/chinatown.html | 1440 | light | yes | 2 |  |
| J-05 | Singapore/chinatown.html | 1440 | dark | partial | 4 | atlas: count ≠ 16 |
| J-01 | cities/wheeling.html | 390 | light | yes | 6 |  |
| J-06 | Singapore/chinatown.html | 1440 | dark | yes | 3 |  |
| J-02 | cities/wheeling.html | 390 | light | partial | 5 | no area control on the page: opened Filters; the first card on screen (wheeling-suspension-bridge) is outside the lens |
| J-07 | Singapore/chinatown.html | 1440 | dark | partial | 40 | 1 of 40 stops show no focus ring: INPUT ; focus after Esc went to "Tian Tian Hainanese Chicken Rice", outside the opener's card |
| J-08 | Singapore/chinatown.html | 1440@200% | dark | yes | 0 |  |
| J-03 | cities/wheeling.html | 390 | light | yes | 1 |  |
| J-04 | cities/wheeling.html | 390 | light | yes | 2 |  |
| J-09 | Singapore/chinatown.html | 1440 | dark | yes | 0 |  |
| J-10 | Singapore/chinatown.html | 1440 | dark | yes | 0 |  |
| J-11 | Singapore/chinatown.html | 1440 | dark | yes | 2 |  |
| J-05 | cities/wheeling.html | 390 | light | partial | 4 | atlas: count ≠ 11; guidebook: switcher not reachable with the sheet open; guidebook: 2 taps (collapsed switcher); insights: 2 taps (collapsed switcher); insights: count ≠ 11; gallery: 2 taps (collapsed switcher) |
| J-01 | cities/wheeling.html | 390 | dark | yes | 6 |  |
| J-06 | cities/wheeling.html | 390 | light | yes | 3 |  |
| J-07 | cities/wheeling.html | 390 | light | no | 40 | 26 focused elements were off-screen (not scrolled into view); Enter on the Atlas segment did not switch; Enter on a card opened no sheet; Enter on pager "2" did not page |
| J-02 | cities/wheeling.html | 390 | dark | no | 1 | could not click Eat & drink lens: locator.click: Timeout 3000ms exceeded.; no area control on the page: opened Filters; could not click Filters: [2m    - element is not stable[22m; not found: area Wheeling, WV; the first card on screen (wheeling-suspension-bridge) is outside the lens |
| J-08 | cities/wheeling.html | 1440@200% | light | yes | 0 |  |
| J-09 | cities/wheeling.html | 390 | light | yes | 0 |  |
| J-10 | cities/wheeling.html | 390 | light | yes | 0 |  |
| J-11 | cities/wheeling.html | 390 | light | yes | 2 |  |
| J-03 | cities/wheeling.html | 390 | dark | yes | 1 |  |
| J-04 | cities/wheeling.html | 390 | dark | yes | 2 |  |
| J-01 | cities/wheeling.html | 1440 | light | yes | 6 |  |
| J-05 | cities/wheeling.html | 390 | dark | partial | 4 | atlas: count ≠ 11; guidebook: switcher not reachable with the sheet open; guidebook: 2 taps (collapsed switcher); insights: 2 taps (collapsed switcher); insights: count ≠ 11; gallery: 2 taps (collapsed switcher) |
| J-02 | cities/wheeling.html | 1440 | light | partial | 5 | no area control on the page: opened Filters |
| J-06 | cities/wheeling.html | 390 | dark | yes | 3 |  |
| J-03 | cities/wheeling.html | 1440 | light | yes | 1 |  |
| J-04 | cities/wheeling.html | 1440 | light | yes | 2 |  |
| J-07 | cities/wheeling.html | 390 | dark | partial | 40 | 1 of 40 stops show no focus ring: INPUT ; 8 focused elements were off-screen (not scrolled into view); focus after Esc went to "Wheeling Suspension Bridge", outside the opener's card |
| J-08 | cities/wheeling.html | 1440@200% | dark | yes | 0 |  |
| J-05 | cities/wheeling.html | 1440 | light | partial | 4 | insights: count ≠ 11 |
| J-06 | cities/wheeling.html | 1440 | light | yes | 3 |  |
| J-07 | cities/wheeling.html | 1440 | light | partial | 40 | 1 of 40 stops show no focus ring: INPUT ; focus after Esc went to "Wheeling Suspension Bridge", outside the opener's card |
| J-08 | cities/wheeling.html | 1440@200% | light | yes | 0 |  |
| J-09 | cities/wheeling.html | 390 | dark | yes | 0 |  |
| J-10 | cities/wheeling.html | 390 | dark | yes | 0 |  |
| J-11 | cities/wheeling.html | 390 | dark | yes | 2 |  |
| J-01 | cities/wheeling.html | 1440 | dark | yes | 6 |  |
| J-02 | cities/wheeling.html | 1440 | dark | partial | 5 | no area control on the page: opened Filters |
| J-09 | cities/wheeling.html | 1440 | light | yes | 0 |  |
| J-03 | cities/wheeling.html | 1440 | dark | yes | 1 |  |
| J-10 | cities/wheeling.html | 1440 | light | yes | 0 |  |
| J-04 | cities/wheeling.html | 1440 | dark | yes | 2 |  |
| J-11 | cities/wheeling.html | 1440 | light | yes | 2 |  |
| J-01h | index.html | 390 | light | yes | 3 |  |
| J-05 | cities/wheeling.html | 1440 | dark | partial | 4 | atlas: count ≠ 11; insights: count ≠ 11 |
| J-06 | index.html | 390 | light | yes | 2 |  |
| J-02 | index.html | 390 | light | n/a | 0 | city-page journey |
| J-03 | index.html | 390 | light | n/a | 0 | city-page journey |
| J-04 | index.html | 390 | light | n/a | 0 | city-page journey |
| J-05 | index.html | 390 | light | n/a | 0 | city-page journey |
| J-07 | index.html | 390 | light | partial | 40 | 21 focused elements were off-screen (not scrolled into view) |
| J-08 | index.html | 1440@200% | light | yes | 0 |  |
| J-09 | index.html | 390 | light | yes | 0 |  |
| J-06 | cities/wheeling.html | 1440 | dark | yes | 3 |  |
| J-10 | index.html | 390 | light | yes | 0 |  |
| J-11 | index.html | 390 | light | yes | 0 |  |
| J-01h | index.html | 390 | dark | yes | 3 |  |
| J-06 | index.html | 390 | dark | yes | 2 |  |
| J-02 | index.html | 390 | dark | n/a | 0 | city-page journey |
| J-03 | index.html | 390 | dark | n/a | 0 | city-page journey |
| J-04 | index.html | 390 | dark | n/a | 0 | city-page journey |
| J-05 | index.html | 390 | dark | n/a | 0 | city-page journey |
| J-07 | cities/wheeling.html | 1440 | dark | partial | 40 | 1 of 40 stops show no focus ring: INPUT ; focus after Esc went to "Wheeling Suspension Bridge", outside the opener's card |
| J-07 | index.html | 390 | dark | partial | 40 | 21 focused elements were off-screen (not scrolled into view) |
| J-08 | index.html | 1440@200% | dark | yes | 0 |  |
| J-09 | index.html | 390 | dark | yes | 0 |  |
| J-08 | cities/wheeling.html | 1440@200% | dark | yes | 0 |  |
| J-10 | index.html | 390 | dark | yes | 0 |  |
| J-11 | index.html | 390 | dark | yes | 0 |  |
| J-01h | index.html | 1440 | light | yes | 3 |  |
| J-06 | index.html | 1440 | light | yes | 2 |  |
| J-02 | index.html | 1440 | light | n/a | 0 | city-page journey |
| J-03 | index.html | 1440 | light | n/a | 0 | city-page journey |
| J-04 | index.html | 1440 | light | n/a | 0 | city-page journey |
| J-05 | index.html | 1440 | light | n/a | 0 | city-page journey |
| J-07 | index.html | 1440 | light | partial | 40 | 21 focused elements were off-screen (not scrolled into view) |
| J-08 | index.html | 1440@200% | light | yes | 0 |  |
| J-09 | index.html | 1440 | light | yes | 0 |  |
| J-10 | index.html | 1440 | light | yes | 0 |  |
| J-11 | index.html | 1440 | light | yes | 0 |  |
| J-01h | index.html | 1440 | dark | yes | 3 |  |
| J-09 | cities/wheeling.html | 1440 | dark | yes | 0 |  |
| J-06 | index.html | 1440 | dark | yes | 2 |  |
| J-02 | index.html | 1440 | dark | n/a | 0 | city-page journey |
| J-03 | index.html | 1440 | dark | n/a | 0 | city-page journey |
| J-04 | index.html | 1440 | dark | n/a | 0 | city-page journey |
| J-05 | index.html | 1440 | dark | n/a | 0 | city-page journey |
| J-07 | index.html | 1440 | dark | partial | 40 | 21 focused elements were off-screen (not scrolled into view) |
| J-10 | cities/wheeling.html | 1440 | dark | yes | 0 |  |
| J-08 | index.html | 1440@200% | dark | yes | 0 |  |
| J-09 | index.html | 1440 | dark | yes | 0 |  |
| J-11 | cities/wheeling.html | 1440 | dark | yes | 2 |  |
| J-10 | index.html | 1440 | dark | yes | 0 |  |
| J-11 | index.html | 1440 | dark | yes | 0 |  |
| J-01h | Japan/index.html | 390 | light | yes | 2 |  |
| J-01h | Japan/index.html | 390 | dark | yes | 2 |  |
| J-06 | Japan/index.html | 390 | light | yes | 2 |  |
| J-02 | Japan/index.html | 390 | light | n/a | 0 | city-page journey |
| J-03 | Japan/index.html | 390 | light | n/a | 0 | city-page journey |
| J-04 | Japan/index.html | 390 | light | n/a | 0 | city-page journey |
| J-05 | Japan/index.html | 390 | light | n/a | 0 | city-page journey |
| J-07 | Japan/index.html | 390 | light | partial | 40 | 26 focused elements were off-screen (not scrolled into view) |
| J-06 | Japan/index.html | 390 | dark | yes | 2 |  |
| J-02 | Japan/index.html | 390 | dark | n/a | 0 | city-page journey |
| J-03 | Japan/index.html | 390 | dark | n/a | 0 | city-page journey |
| J-04 | Japan/index.html | 390 | dark | n/a | 0 | city-page journey |
| J-05 | Japan/index.html | 390 | dark | n/a | 0 | city-page journey |
| J-08 | Japan/index.html | 1440@200% | light | yes | 0 |  |
| J-07 | Japan/index.html | 390 | dark | partial | 40 | 26 focused elements were off-screen (not scrolled into view) |
| J-09 | Japan/index.html | 390 | light | yes | 0 |  |
| J-08 | Japan/index.html | 1440@200% | dark | yes | 0 |  |
| J-10 | Japan/index.html | 390 | light | yes | 0 |  |
| J-09 | Japan/index.html | 390 | dark | yes | 0 |  |
| J-11 | Japan/index.html | 390 | light | yes | 0 |  |
| J-10 | Japan/index.html | 390 | dark | yes | 0 |  |
| J-11 | Japan/index.html | 390 | dark | yes | 0 |  |
| J-01h | Japan/index.html | 1440 | light | yes | 2 |  |
| J-01h | Japan/index.html | 1440 | dark | yes | 2 |  |
| J-06 | Japan/index.html | 1440 | light | yes | 2 |  |
| J-02 | Japan/index.html | 1440 | light | n/a | 0 | city-page journey |
| J-03 | Japan/index.html | 1440 | light | n/a | 0 | city-page journey |
| J-04 | Japan/index.html | 1440 | light | n/a | 0 | city-page journey |
| J-05 | Japan/index.html | 1440 | light | n/a | 0 | city-page journey |
| J-07 | Japan/index.html | 1440 | light | partial | 40 | 24 focused elements were off-screen (not scrolled into view) |
| J-06 | Japan/index.html | 1440 | dark | yes | 2 |  |
| J-02 | Japan/index.html | 1440 | dark | n/a | 0 | city-page journey |
| J-03 | Japan/index.html | 1440 | dark | n/a | 0 | city-page journey |
| J-04 | Japan/index.html | 1440 | dark | n/a | 0 | city-page journey |
| J-05 | Japan/index.html | 1440 | dark | n/a | 0 | city-page journey |
| J-08 | Japan/index.html | 1440@200% | light | yes | 0 |  |
| J-07 | Japan/index.html | 1440 | dark | partial | 40 | 24 focused elements were off-screen (not scrolled into view) |
| J-09 | Japan/index.html | 1440 | light | yes | 0 |  |
| J-08 | Japan/index.html | 1440@200% | dark | yes | 0 |  |
| J-09 | Japan/index.html | 1440 | dark | yes | 0 |  |
| J-10 | Japan/index.html | 1440 | light | yes | 0 |  |
| J-11 | Japan/index.html | 1440 | light | yes | 0 |  |
| J-10 | Japan/index.html | 1440 | dark | yes | 0 |  |
| J-11 | Japan/index.html | 1440 | dark | yes | 0 |  |

## Failures (first 400)

- **J-02** cities/tokyo.html 1440 dark : `{"success":"no","steps":4,"friction":["no area control on the page: opened Filters","could not click first food place in CHUO: locator.click: Timeout 3000ms exceeded."],"area":"CHUO","want":36,"route":{"view":"gallery","mode":"food","a":"CHUO"},"sheet":null}`
- **J-02** cities/newyork.html 390 dark : `{"success":"no","steps":4,"friction":["no area control on the page: opened Filters","the first card on screen (katzs-delicatessen) is outside the lens","could not click first food place in BK: locator.click: Timeout 3000ms exceeded."],"area":"BK","want":47,"route":{"view":"gallery","mode":"food","a"`
- **J-02** Singapore/chinatown.html 390 light : `{"success":"no","steps":4,"friction":["no area control on the page: opened Filters","not found: area Chinatown & CBD"],"area":"CHINATOWN","want":12,"route":{"view":"gallery","mode":"food"},"sheet":"Tian Tian Hainanese Chicken Rice"}`
- **J-02** Singapore/chinatown.html 390 dark : `{"success":"no","steps":4,"friction":["no area control on the page: opened Filters","not found: area Chinatown & CBD"],"area":"CHINATOWN","want":12,"route":{"view":"gallery","mode":"food"},"sheet":"Tian Tian Hainanese Chicken Rice"}`
- **J-02** Singapore/chinatown.html 1440 light : `{"success":"no","steps":4,"friction":["no area control on the page: opened Filters","not found: area Chinatown & CBD"],"area":"CHINATOWN","want":12,"route":{"view":"gallery","mode":"food"},"sheet":"Tian Tian Hainanese Chicken Rice"}`
- **J-02** Singapore/chinatown.html 1440 dark : `{"success":"no","steps":4,"friction":["no area control on the page: opened Filters","not found: area Chinatown & CBD"],"area":"CHINATOWN","want":12,"route":{"view":"gallery","mode":"food"},"sheet":"Tian Tian Hainanese Chicken Rice"}`
- **J-07** cities/wheeling.html 390 light : `{"success":"no","steps":40,"friction":["26 focused elements were off-screen (not scrolled into view)","Enter on the Atlas segment did not switch","Enter on a card opened no sheet","Enter on pager \"2\" did not page"],"firstStops":["A:Skip to content","A:Cleo — all destinations","A:United States","A:`
- **J-02** cities/wheeling.html 390 dark : `{"success":"no","steps":1,"friction":["could not click Eat & drink lens: locator.click: Timeout 3000ms exceeded.","no area control on the page: opened Filters","could not click Filters: \u001b[2m    - element is not stable\u001b[22m","not found: area Wheeling, WV","the first card on screen (wheeling`
