# QC run 530dc83b-journeys2

SHA 530dc83b · 2026-10-16T14:57:58.131Z → 2026-10-16T15:07:30.872Z · chromium; tiles stubbed 1×1; off-origin aborted; SW blocked

| Id | Check | PASS | WARN | FAIL | N/A |
|---|---|---|---|---|---|
| J-01 | Discover → shortlist → plan a day → share → reopen | 10 | 0 | 0 | 0 |
| J-02 | Best food near X | 6 | 2 | 2 | 0 |
| J-03 | Is it still open? (closure honesty) | 6 | 0 | 0 | 4 |
| J-04 | Who recommends this and why? | 10 | 0 | 0 | 0 |
| J-05 | Switch views without losing context | 3 | 7 | 0 | 0 |
| J-06 | Back and Forward | 5 | 5 | 0 | 0 |
| J-07 | Keyboard only | 6 | 4 | 0 | 0 |
| J-08 | 200 % zoom | 10 | 0 | 0 | 0 |
| J-09 | Reduced motion | 10 | 0 | 0 | 0 |
| J-10 | Map library blocked | 10 | 0 | 0 | 0 |
| J-11 | Storage blocked | 10 | 0 | 0 | 0 |

## Journeys

| Id | Page | Viewport | Theme | Success | Steps | Friction |
|---|---|---|---|---|---|---|
| J-01 | cities/tokyo.html | 390 | light | yes | 5 |  |
| J-01 | cities/tokyo.html | 1440 | light | yes | 5 |  |
| J-02 | cities/tokyo.html | 390 | light | yes | 3 |  |
| J-02 | cities/tokyo.html | 1440 | light | yes | 3 |  |
| J-03 | cities/tokyo.html | 1440 | light | yes | 1 |  |
| J-04 | cities/tokyo.html | 1440 | light | yes | 2 |  |
| J-05 | cities/tokyo.html | 1440 | light | yes | 4 |  |
| J-03 | cities/tokyo.html | 390 | light | yes | 1 |  |
| J-06 | cities/tokyo.html | 1440 | light | partial | 3 | Back 1: got {"view":"atlas","sheet":false}, want {"view":"atlas","mode":"sights","sheet":false}; Back 2: got {"view":"gallery","sheet":false}, want {"view":"atlas","sheet":false}; Back 3: got {"view":null,"mode":null,"sheet":false}, want {"view":"gallery","sheet":false}; Forward 2: got {"view":"atla |
| J-04 | cities/tokyo.html | 390 | light | yes | 2 |  |
| J-05 | cities/tokyo.html | 390 | light | partial | 4 | atlas: count ≠ 43; close returned to scrollY 1409, was 1400 |
| J-07 | cities/tokyo.html | 1440 | light | partial | 40 | 1 of 40 stops show no focus ring: INPUT  |
| J-08 | cities/tokyo.html | 1440@200% | light | yes | 0 |  |
| J-06 | cities/tokyo.html | 390 | light | yes | 3 |  |
| J-07 | cities/tokyo.html | 390 | light | yes | 40 |  |
| J-08 | cities/tokyo.html | 1440@200% | light | yes | 0 |  |
| J-09 | cities/tokyo.html | 1440 | light | yes | 0 |  |
| J-10 | cities/tokyo.html | 1440 | light | yes | 0 |  |
| J-11 | cities/tokyo.html | 1440 | light | yes | 2 |  |
| J-09 | cities/tokyo.html | 390 | light | yes | 0 |  |
| J-01 | cleveland.html | 390 | light | yes | 6 |  |
| J-10 | cities/tokyo.html | 390 | light | yes | 0 |  |
| J-11 | cities/tokyo.html | 390 | light | yes | 2 |  |
| J-02 | cleveland.html | 390 | light | partial | 3 | visible food cards are not in rank order |
| J-01 | cleveland.html | 1440 | light | yes | 6 |  |
| J-02 | cleveland.html | 1440 | light | partial | 3 | visible food cards are not in rank order |
| J-03 | cleveland.html | 1440 | light | yes | 1 |  |
| J-04 | cleveland.html | 1440 | light | yes | 2 |  |
| J-03 | cleveland.html | 390 | light | yes | 1 |  |
| J-05 | cleveland.html | 1440 | light | partial | 4 | close returned to scrollY 2335, was 1400 |
| J-04 | cleveland.html | 390 | light | yes | 2 |  |
| J-05 | cleveland.html | 390 | light | partial | 4 | atlas: count ≠ 42; close returned to scrollY 1471, was 1400 |
| J-06 | cleveland.html | 1440 | light | partial | 3 | Back 1: got {"view":"atlas","sheet":false}, want {"view":"atlas","mode":"sights","sheet":false}; Back 2: got {"view":"gallery","sheet":false}, want {"view":"atlas","sheet":false}; Back 3: got {"view":null,"mode":null,"sheet":false}, want {"view":"gallery","sheet":false}; Forward 2: got {"view":"atla |
| J-06 | cleveland.html | 390 | light | yes | 3 |  |
| J-07 | cleveland.html | 390 | light | yes | 40 |  |
| J-07 | cleveland.html | 1440 | light | partial | 40 | 1 of 40 stops show no focus ring: INPUT  |
| J-08 | cleveland.html | 1440@200% | light | yes | 0 |  |
| J-08 | cleveland.html | 1440@200% | light | yes | 0 |  |
| J-09 | cleveland.html | 390 | light | yes | 0 |  |
| J-10 | cleveland.html | 390 | light | yes | 0 |  |
| J-09 | cleveland.html | 1440 | light | yes | 0 |  |
| J-11 | cleveland.html | 390 | light | yes | 2 |  |
| J-10 | cleveland.html | 1440 | light | yes | 0 |  |
| J-11 | cleveland.html | 1440 | light | yes | 2 |  |
| J-01 | cities/newyork.html | 390 | light | yes | 5 |  |
| J-01 | cities/newyork.html | 1440 | light | yes | 5 |  |
| J-02 | cities/newyork.html | 390 | light | yes | 3 |  |
| J-03 | cities/newyork.html | 390 | light | n/a | 0 | no closed place on this page |
| J-04 | cities/newyork.html | 390 | light | yes | 2 |  |
| J-02 | cities/newyork.html | 1440 | light | yes | 3 |  |
| J-03 | cities/newyork.html | 1440 | light | n/a | 0 | no closed place on this page |
| J-04 | cities/newyork.html | 1440 | light | yes | 2 |  |
| J-05 | cities/newyork.html | 390 | light | partial | 4 | atlas: count ≠ 264; close returned to scrollY 1500, was 1400 |
| J-06 | cities/newyork.html | 390 | light | yes | 3 |  |
| J-05 | cities/newyork.html | 1440 | light | yes | 4 |  |
| J-07 | cities/newyork.html | 390 | light | yes | 40 |  |
| J-08 | cities/newyork.html | 1440@200% | light | yes | 0 |  |
| J-06 | cities/newyork.html | 1440 | light | partial | 3 | Back 1: got {"view":"atlas","sheet":false}, want {"view":"atlas","mode":"sights","sheet":false}; Back 2: got {"view":"gallery","sheet":false}, want {"view":"atlas","sheet":false}; Back 3: got {"view":null,"mode":null,"sheet":false}, want {"view":"gallery","sheet":false}; Forward 2: got {"view":"atla |
| J-07 | cities/newyork.html | 1440 | light | partial | 40 | 1 of 40 stops show no focus ring: INPUT  |
| J-08 | cities/newyork.html | 1440@200% | light | yes | 0 |  |
| J-09 | cities/newyork.html | 390 | light | yes | 0 |  |
| J-10 | cities/newyork.html | 390 | light | yes | 0 |  |
| J-11 | cities/newyork.html | 390 | light | yes | 2 |  |
| J-01 | Singapore/chinatown.html | 390 | light | yes | 6 |  |
| J-02 | Singapore/chinatown.html | 390 | light | no | 4 | no area control on the page: opened Filters; not found: area Chinatown & CBD |
| J-03 | Singapore/chinatown.html | 390 | light | n/a | 0 | no closed place on this page |
| J-04 | Singapore/chinatown.html | 390 | light | yes | 2 |  |
| J-05 | Singapore/chinatown.html | 390 | light | partial | 4 | atlas: count ≠ 16 |
| J-09 | cities/newyork.html | 1440 | light | yes | 0 |  |
| J-10 | cities/newyork.html | 1440 | light | yes | 0 |  |
| J-06 | Singapore/chinatown.html | 390 | light | yes | 3 |  |
| J-11 | cities/newyork.html | 1440 | light | yes | 2 |  |
| J-07 | Singapore/chinatown.html | 390 | light | yes | 40 |  |
| J-08 | Singapore/chinatown.html | 1440@200% | light | yes | 0 |  |
| J-01 | Singapore/chinatown.html | 1440 | light | yes | 6 |  |
| J-02 | Singapore/chinatown.html | 1440 | light | no | 4 | no area control on the page: opened Filters; not found: area Chinatown & CBD |
| J-03 | Singapore/chinatown.html | 1440 | light | n/a | 0 | no closed place on this page |
| J-04 | Singapore/chinatown.html | 1440 | light | yes | 2 |  |
| J-05 | Singapore/chinatown.html | 1440 | light | partial | 4 | atlas: count ≠ 16 |
| J-06 | Singapore/chinatown.html | 1440 | light | partial | 3 | Back 1: got {"view":"atlas","sheet":false}, want {"view":"atlas","mode":"sights","sheet":false}; Back 2: got {"view":"gallery","sheet":false}, want {"view":"atlas","sheet":false}; Back 3: got {"view":null,"mode":null,"sheet":false}, want {"view":"gallery","sheet":false}; Forward 2: got {"view":"atla |
| J-09 | Singapore/chinatown.html | 390 | light | yes | 0 |  |
| J-10 | Singapore/chinatown.html | 390 | light | yes | 0 |  |
| J-07 | Singapore/chinatown.html | 1440 | light | yes | 40 |  |
| J-11 | Singapore/chinatown.html | 390 | light | yes | 2 |  |
| J-08 | Singapore/chinatown.html | 1440@200% | light | yes | 0 |  |
| J-01 | cities/wheeling.html | 390 | light | yes | 6 |  |
| J-02 | cities/wheeling.html | 390 | light | yes | 3 |  |
| J-09 | Singapore/chinatown.html | 1440 | light | yes | 0 |  |
| J-10 | Singapore/chinatown.html | 1440 | light | yes | 0 |  |
| J-11 | Singapore/chinatown.html | 1440 | light | yes | 2 |  |
| J-01 | cities/wheeling.html | 1440 | light | yes | 6 |  |
| J-03 | cities/wheeling.html | 390 | light | yes | 1 |  |
| J-02 | cities/wheeling.html | 1440 | light | yes | 3 |  |
| J-04 | cities/wheeling.html | 390 | light | yes | 2 |  |
| J-05 | cities/wheeling.html | 390 | light | partial | 4 | atlas: count ≠ 15 |
| J-03 | cities/wheeling.html | 1440 | light | yes | 1 |  |
| J-04 | cities/wheeling.html | 1440 | light | yes | 2 |  |
| J-06 | cities/wheeling.html | 390 | light | yes | 3 |  |
| J-07 | cities/wheeling.html | 390 | light | yes | 40 |  |
| J-05 | cities/wheeling.html | 1440 | light | yes | 4 |  |
| J-08 | cities/wheeling.html | 1440@200% | light | yes | 0 |  |
| J-06 | cities/wheeling.html | 1440 | light | partial | 3 | Back 1: got {"view":"atlas","sheet":false}, want {"view":"atlas","mode":"sights","sheet":false}; Back 2: got {"view":"gallery","sheet":false}, want {"view":"atlas","sheet":false}; Back 3: got {"view":null,"mode":null,"sheet":false}, want {"view":"gallery","sheet":false}; Forward 2: got {"view":"atla |
| J-07 | cities/wheeling.html | 1440 | light | partial | 40 | 1 of 40 stops show no focus ring: INPUT  |
| J-08 | cities/wheeling.html | 1440@200% | light | yes | 0 |  |
| J-09 | cities/wheeling.html | 390 | light | yes | 0 |  |
| J-10 | cities/wheeling.html | 390 | light | yes | 0 |  |
| J-11 | cities/wheeling.html | 390 | light | yes | 2 |  |
| J-09 | cities/wheeling.html | 1440 | light | yes | 0 |  |
| J-10 | cities/wheeling.html | 1440 | light | yes | 0 |  |
| J-11 | cities/wheeling.html | 1440 | light | yes | 2 |  |

## Failures (first 400)

- **J-02** Singapore/chinatown.html 390 light : `{"success":"no","steps":4,"friction":["no area control on the page: opened Filters","not found: area Chinatown & CBD"],"area":"CHINATOWN","want":12,"route":{"view":"gallery","mode":"food"},"sheet":"Tian Tian Hainanese Chicken Rice"}`
- **J-02** Singapore/chinatown.html 1440 light : `{"success":"no","steps":4,"friction":["no area control on the page: opened Filters","not found: area Chinatown & CBD"],"area":"CHINATOWN","want":12,"route":{"view":"gallery","mode":"food"},"sheet":"Tian Tian Hainanese Chicken Rice"}`
