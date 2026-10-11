# W6 · Atlas map-first — evidence (FE-A, 2026-10-11)

Owner request: in Atlas the map must be front and centre, as in the live map-centred guide and the Wave 0–1 beta
Cleveland page. Brief: `design/beta/eval/W6-BRIEFS.md` → "Lane: atlas-map-first". Decision: `docs/BETA-DECISIONS.md` D-36.

Shots: `NODE_PATH=$(npm root -g) node tools/beta/atlas-shots.js --tag before|after` (390×844 DPR 2 touch, 1440×900;
tiles stubbed, every off-origin request aborted). `before-*` = the head before this lane (`f2dae013`), `after-*` = this lane.

| Shot | What it shows |
|---|---|
| `*-tokyo-m`, `*-cleveland-m`, `*-chinatown-m` | phone Atlas first screen. Before: the list. After: the map under a compact header (switcher + List), the tray at peek (area chip + first ranked place). |
| `*-*-pin-m` | a pin tapped → the pin sheet (Back closes it). |
| `*-*-full-m` | the tray at full (the list, the toolbar, area chips, the rail). |
| `*-tokyo-d`, `*-cleveland-d`, `*-chinatown-d` | desktop Atlas. Before: list 41 % ‖ map 48 % under the masthead and rail. After: map 64 % full height, list panel 36 % holding rail + toolbar, legend, Must see, map style, locate. |
| `*-cleveland-place-*` | `#view=atlas&p=…`: the sheet open, the map flown to the place. |

## Measured (`after-metrics.json`, `after-metrics-atlas.md` = `metrics.js --view atlas` on the pilots)

| | Before | After |
|---|---|---|
| Desktop map width | 48 % | **64 %** (list 36 %) |
| Phone map share of the first screen | 0 % (list first; map one tap away) | **66 %** (map under header + peek tray) |
| B-01 screens to first card (Atlas, phone) | 0.81–0.89 | **0.85** on every pilot |
| B-03 controls above first card (Atlas, phone) | 14 | **10** |
| B-07 map + pin sheet: Close, Esc, Back | ✅ | ✅ (Back now closes the pin sheet with no `map=` route) |
| B-06 split + sticky + two-way sync | ✅ | ✅ (NYC fixed: pin → card lands) |
| G1 reachability (scroll, deep, search, no-JS) | ✅ | ✅ 194/488/508/16/35 |
| B-04 rail on first phone screen | ✅ | ❌ **by design** — the first phone screen is the map; the rail is one swipe up (half) |
| Atlas score, pilots | 24/24 | 23/24 (B-04 only) |
| Tokyo default (Gallery) transfer | 1,932 KB | **1,952 KB** (≤ 2.0 MB; the W6 type lane's fonts are in this figure) |
| Tokyo default FCP 4× (4 runs) | — | 484 / 1,188 / 804 / 680 ms — the 1,188 ran right after a full metrics sweep; noisy, as BETA-LOG notes |
| Eager JS per page (gzip) | 40.11 KB | **40.45 KB** (≤ 40 KB rounded; map tools moved to lazy `atlas.js`, 3.4 KB, loaded with the map) |
