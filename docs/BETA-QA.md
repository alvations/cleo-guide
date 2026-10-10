# Beta QA

> **Owner:** QA lane (`docs/BETA-QA.md`, `tools/beta/metrics.js`, `tools/beta/qa/**`, `qa/beta-*`).
> Append a dated section each run; never rewrite an earlier one. Each section holds the per-criterion pass/fail
> table for the pilot set (D-27), the count asserts, and the defects (evidence, screenshot, owning lane). Defects
> are also filed as rows in the "QA defects" table at the end of [`BETA-BACKLOG.md`](BETA-BACKLOG.md).
> **No deploy without a "QA sign-off: YES" line in the latest section** (D-30).

## How QA measures

| Command (from `tools/`) | What it proves | Output |
|---|---|---|
| `npm run validate` · `npm test` | Content integrity; behaviour with and without the map; `check-google.py`; `test-beta.js` (beta == live counts on all place pages, reproducible build, jsdom no-CDN render); **`beta/qa/test-contract.js`** (QA): every generated city page has one card per live record (count + sight/food split), unique stable ids, "Recommended by" on 100% of cards, closed cards flagged and tier-free, no off-origin render resource, `localStorage` only inside `try` in shipped JS | console |
| `npm run qa:beta` (`qa-site.js --only beta/ --shots`) | Site harness on every beta page: mobile offline, desktop offline, desktop + map. Now also runs **`beta/qa/contract.js`** on engine pages (`<html data-cleo-page>`): count != live, missing attribution, closed unflagged or tiered = **FAIL**; targets < 44 px = WARN | `qa/partial/summary.json` |
| `npm run beta:metrics` (`beta/metrics.js`) | Every M1 acceptance metric on the pilot set, 390×844 DPR3 touch + 1440×900 (+ 360 px overflow), **all off-origin requests blocked** | `qa/beta-metrics.json` + `.md`, `qa/beta-shots/` |
| `npm run beta:metrics:all` | Same on every beta page (M1-22); `node beta/metrics.js --regrade <json>` re-grades a saved run | `qa/beta-metrics-all.json` (not committed, 1.4 MB) + `qa/beta-metrics-all.md` |

Metric definitions (`tools/beta/metrics.js` header has the full list):
- **Screens to first card** = top of the first visible `li.pl` ÷ viewport height. **Masthead** = bottom of `.masthead`.
- **Controls above first card** = visible `a[href]`, buttons, inputs, `[role=button]`, focusable elements whose top is above the first card; "on-screen" excludes rail tiles scrolled out horizontally (the benchmark's ≤ 14 is graded on on-screen).
- **Tap targets** = the same controls under 44×44 CSS px; links inside running prose are exempt (parent text ≥ 15 chars longer than the link).
- **Uppercase share** = visible text nodes that are `text-transform: uppercase` or all-caps (≥ 2 letters).
- **Fonts** = first family of every computed `font-family` stack in use (graded), plus the platform fonts Chromium actually rasterised via CDP (reported; this container lacks the web fonts, so "rendered here" shows fallbacks).
- **Contrast** = WCAG 2.x ratio of every visible text node against its composited ancestor background (text over images/gradients counted as "unknown", not passed); large text = ≥ 24 px or ≥ 18.66 px bold. Run in **light and night** (`prefers-color-scheme`).
- **Focus visible** = Tab through the first 30 focusables; each must show an outline or box-shadow.
- **Reachability** = data records (manifest) vs cards in DOM vs cards visible after "All" + full scroll vs **deep link to every id** with a hiding lens applied first vs search (every ~N/25th name through the page's filter) vs cards present **with JavaScript disabled**.
- **Map/list sync** (desktop, vendored Leaflet, tiles stubbed 1×1): split view, map ≥ 40 % width, sticky after 2,500 px scroll, card hover changes a pin, pin click scrolls its card into view, numbered pins, ordering stated.
- **Sheet** (mobile): a "Map" toggle ≥ 44 px opens a ≥ 70 %-height map; a pin (or card) opens `[role=dialog]`/`.sheet` with visible Close; 25 Tabs stay inside; Esc closes; Back closes and stays on the page; content shows sources, directions, pin, status, save, share.
- **Floaters** = fixed/sticky elements (not the site header) intersecting a visible card title, over 20 scroll positions.
- **Performance** = same-origin bytes, DOM nodes, FCP, and FCP at 4× CPU throttle (mobile).

---

## 2026-10-10 · QA · Build wave 1 run 1 · session_01PCNcUkfa5S1N1BKGzZA4xx

**State measured:** `1e852b2` (W0 verified, wave 1 launched). New-engine pages: `beta/index.html`, `beta/cities/tokyo.html`,
`beta/saved.html`. Every other beta page (including pilots Cleveland, New York, Chinatown, Wheeling) is still the
legacy mirror, so M1 is measured on 1 city pilot + the hub; the mirror pilots are measured as the "before".

### Gates

| Gate | Result | Evidence |
|---|---|---|
| G1 counts (generator) | **PASS** — `npm run beta`: 84 place pages, 8,458 places, beta == live | build log |
| G1 counts (test) | **PASS** — `test-beta.js` beta == live on all 84; `test-contract.js` Tokyo 488/488 (263/225) | `npm test` |
| G1 reachability, Tokyo | **PASS** — data 488 · DOM 488 · visible after scroll 488 · deep links 488/488 · search 26/26 · JS off 488 | `qa/beta-metrics.json` |
| G2 validate + test | **PASS** | `npm run validate` DATA OK; `npm test` all PASS incl. beta + contract |
| G3 QA harness 0 FAIL | **PASS** — 91 beta pages, 273 loads: 0 FAIL, 267 WARN, 6 PASS | `qa/partial/summary.json` |
| G4 no-CDN render | **PASS** on all 91 pages, 0 JS errors, 0 local 404 | metrics, harness |
| G6 attribution / closed | **PASS** on Tokyo (488/488 attributed; 1 closed, flagged, no tier). Mirrors not measurable by contract | metrics |
| G8 storage | **PASS** — shipped JS has no `localStorage` outside `try`; jsdom fixture with throwing storage passes | `test-contract.js`, `test-beta.js` |
| Tiles | **PASS** — only `tile.openstreetmap.org` requested (Esri on base switch) | metrics map run |

### M1 criteria × pilot page

Mobile 390×844 unless noted. ✅ pass · ❌ fail · "mirror" = legacy page not yet on the new engine.

| Criterion (target) | hub `index` | `cities/tokyo` | `cleveland` (mirror) | `cities/newyork` (mirror) | `Singapore/chinatown` (mirror) | `cities/wheeling` (mirror) |
|---|---|---|---|---|---|---|
| B-01 screens to first card ≤ 1.0 | — | ✅ 0.85 | ❌ 2.95 | ❌ 3.53 | ❌ 3.01 | ❌ 4.19 |
| B-02 masthead ≤ 506 px | — | ✅ 287 | ✅ 462 | ❌ 551 | ❌ 573 | ❌ 794 |
| B-03 controls above first card ≤ 14 | — | ❌ 24 on-screen (53 incl. rail tiles scrolled out) | ❌ 45 | ❌ 71 | ❌ 44 | ❌ 75 |
| B-04 rail on first screen | — | ✅ 31 tiles, ★ first | ❌ none | ❌ | ❌ | ❌ |
| B-05 hub city cards above fold ≥ 2 | ✅ 4 | — | — | — | — | — |
| B-06 split view + sticky map + 2-way sync (desktop) | — | ❌ split ✓ sticky ✓ 48 % ✓ pin→card ✓, **card hover→pin ✗** | ❌ no map offline | ❌ | ❌ | ❌ |
| B-07 map toggle + sheet, Close/Esc/Back | — | ❌ no toggle, no sheet | ❌ | ❌ | ❌ | ❌ |
| B-08 floaters over titles = 0 | — | ✅ 0 | ✅ | ✅ | ✅ | ✅ |
| B-09 numbered pins == cards, ordering stated | — | ❌ 0 numbered, not stated | ❌ | ❌ | ❌ | ❌ |
| B-10 tray + "Show N places" | — | ❌ no Filters control | ❌ | ❌ | ❌ | ❌ |
| B-12 closed with tier = 0 | — | ✅ 0/1 | ✅ 0/0 | ✅ | ✅ | ✅ |
| B-16 cards per screen ≥ 2 | — | ✅ 2.58 | ✅ 2.26 | ❌ 1.75 | ❌ 1.91 | ❌ 1.5 |
| B-17 sheet content + focus trap | — | ❌ no sheet | ❌ | ❌ | ❌ | ❌ |
| B-18 families ≤ 2 | ✅ system-ui, Georgia | ❌ system-ui, Georgia, **Arial** (6 form controls) | ❌ 5 | ❌ 5 | ❌ 6 | ❌ 5 |
| B-19 uppercase < 15 % | ✅ 0.4 % | ❌ **21 %** (950/4,532) | ❌ 59 % | ❌ 67 % | ❌ 59 % | ❌ 63 % |
| B-20 tap targets < 44 = 0 | ❌ 1 | ❌ **416** | ❌ 679 | ❌ 1,076 | ❌ 79 | ❌ 280 |
| B-21 smallest text ≥ 12 px | ✅ 14 | ✅ 13 | ❌ 9 | ❌ 8.5 | ❌ 8.5 | ❌ 8.5 |
| B-22 overflow 0 at 360 + 390 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| B-23 AA contrast, light / night | ❌ 0 / **86** | ❌ 0 / **2,783** | ❌ 161 / 161 | ❌ 235 / 235 | ❌ 97 / 15 | ❌ 43 / 43 |
| M1-16 focus visible | ✅ 30/30 | ✅ 30/30 | ✅ | ✅ | ✅ | ✅ |
| M1-16 landmarks + skip + names | ✅ | ✅ | ❌ no nav, no skip | ❌ | ❌ | ❌ |
| G1 reachability 100 % | — | ✅ | ❌ mirror | ❌ mirror | ❌ mirror | ❌ mirror |
| G4 no-CDN, 0 errors | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Perf: KB · DOM · FCP · FCP 4× | 50 · 423 · 216 ms · 256 ms | 830 · **7,170** · 340 ms · 512 ms | 151 · 3,142 · 372 · 268 | 223 · 5,496 · 288 · 956 | 79 · 405 · 392 · 496 | 99 · 1,305 · 240 · 500 |
| **Score** | 8/10 | 14/24 | 7/23 | 5/23 | 5/23 | 5/23 |

Every beta page (M1-22 baseline, `qa/beta-metrics-all.md`, 91 pages): B-22 overflow passes on 91/91, focus visible 91/91,
G4 91/91, B-08 84/84, B-12 84/84; B-05 1/5 hubs; B-01 1/84; G1 + G6 1/84 (only Tokyo is on the contract). Every other M1 row passes only on the new-engine pages (Tokyo, hub, saved);
B-23 contrast fails on 91/91 (night on new pages, light + night on mirrors).

### Count asserts (beta == live)

`npm run beta` → `PASS — 104 checked: 3 pages, 84 place pages indexed, 8458 places (beta == live)`. `test-beta.js`
re-asserts per page (84/84 PASS). `test-contract.js` re-asserts on the rendered HTML of every generated city page
(Tokyo 488 = 263 sights + 225 food). The harness contract (`qa-site.js` + `contract.js`) re-asserts in the browser.
No record lost anywhere.

### Defects

Screenshots in `qa/beta-shots/`. IDs continue in the backlog's "QA defects" table.

| ID | Sev | Defect | Evidence | Lane |
|---|---|---|---|---|
| QA-01 | **Blocker** | **Night theme is unreadable on every new-engine page.** `tokens.css` flips ink to light under `prefers-color-scheme: dark`, but `cleo.css` keeps light surfaces (body `rgb(247,244,238)`, cards `#fff`), so text is `#F3EEE6` on near-white: wordmark, place names and rail labels vanish. Any visitor with OS dark mode gets a blank-looking page. | Tokyo 2,783 AA failures at 1.05:1 (light: 0); hub 86. `qa/beta-shots/cities__tokyo.night.mobile.jpg`, `index.night.mobile.jpg` | DES (`beta/assets/cleo.css`) |
| QA-02 | High | **Tap targets < 44 px: 416 on Tokyo.** "Recommended by" source links (~32 px tall) and the 13 area-jump links (32 px); hub has 1 (304×20 link). | `qa/beta-metrics.json` → `tapSmallList` | FE-A (city), FE-B (hub) |
| QA-03 | High | **Uppercase share 21 % on Tokyo** (target < 15 %): 949 nodes are source names printed in data caps ("TIME OUT", "JAPAN-GUIDE", "UNESCO"). M1-10 asks for sentence-case source names. | `up.js` probe: `A.` ×949 | FE-A (render source display names) |
| QA-04 | High | **24 on-screen controls above the first card** on Tokyo mobile (target ≤ 14; 53 counting the scrolled rail): header 4 + rail 3 + duplicate "All" mode row 3 + filter + **13 area links**. Moving area jump into the tray/Area control fixes it. | `controlsAboveList` | FE-A |
| QA-05 | High | **M1 city interactions not built yet:** no card-hover → pin highlight, no numbered pins / ordering line (B-06, B-09); no mobile Map toggle, detail sheet or focus trap (B-07, B-17); no Filters tray (B-10). | metrics `sync`, `sheetFlow`, `tray` | FE-A |
| QA-06 | High | **4 of 5 city pilots still legacy mirror** (Cleveland, New York, Chinatown, Wheeling): they fail B-01–B-04, B-16, B-18–B-21, B-23 and can't be contract-checked (no `li.pl`). | metrics table above | PLT + FE-A (`pages.json`) |
| QA-07 | Med | **Font system not applied.** New pages render `system-ui` + `Georgia`, not the Constellation pair in `tokens.css` (`--font-ui` Figtree, `--font-display` Bodoni Moda); `constellation.css` isn't linked by any page. 6 form controls fall back to Arial (no `font: inherit`), making 3 families. | `fontsDeclared` Tokyo `{system-ui, Georgia, Arial}` | DES + FE-A |
| QA-08 | Med | **Header search placeholder truncated** on mobile ("Search pla"). | `qa/beta-shots/cities__tokyo.mobile.jpg` | FE-B |
| QA-09 | Med | **Country hubs not on the new engine** (4 legacy country hubs fail B-05; no `beta/Japan/index.html`). | `qa/beta-metrics-all.md` | FE-B |
| QA-10 | Low | **Tokyo initial DOM 7,170 nodes / 830 KB** same-origin transfer (budget ≤ 3,000 nodes is M3-06; FCP 512 ms at 4× is fine). New York mirror FCP 956 ms at 4× is close to the 1.0 s B-44 limit. | metrics perf row | PLT |
| QA-11 | Low | Legacy mirror light-theme contrast fails (`.ctrl-label` 4.23:1, eyebrow 3.85:1) and 8.5 px badges. Closed by migration (M1-22), not by patching mirrors. | metrics | PLT (migration) |

### QA sign-off: **NO for M1**

Reasons: M1's exit needs every M1 benchmark row on every pilot page. Today only 1 of 5 city pilots runs on the new
engine, and even Tokyo fails B-03, B-06, B-07, B-09, B-10, B-17, B-18, B-19, B-20 and B-23. QA-01 (night theme
unreadable) blocks any deploy by itself, since it hits every OS-dark-mode visitor. The hard gates do hold: counts,
reachability, attribution, closed-flagging, no-CDN render, storage and tiles. The beta is safe as data, but it isn't
yet M1.

---

## 2026-10-10 · QA · Build wave 1 run 2 · session_01PCNcUkfa5S1N1BKGzZA4xx

**State measured:** `b953141` (origin after FE-B/DES/PLT wave-1 merges). **All 94 beta pages now come from the new
engine** (`npm run beta`: 581 files checked, 94 pages, 84 place pages, 8,458 places, beta == live).

**Harness changes this run:** contrast now samples what's actually painted under on-screen text (`elementsFromPoint`),
so a light header over a dark hero isn't a false failure. Focus counts a ring drawn on a close ancestor (`.pl:has(a:focus-visible)`).
Load errors (G4) are split from errors raised by the machine-speed deep-link loop (reported as info). Masthead is
measured on `.masthead`, not the shell header. The split-view check is now "map to the right of the cards"; run 2's
Chinatown `split false` was a harness false negative (the screenshot shows a correct split).

### Gates

| Gate | Result | Evidence |
|---|---|---|
| G1 counts | **PASS**: generator, `test-beta.js` 84/84, `test-contract.js` **94/94 generated pages**, harness contract | `npm test` |
| G1 reachability | **PASS on 84/84 place pages**: scroll, every deep link, search sample and JS-off all reach every record (Tokyo 488, NYC 508, Cleveland 194, Chinatown 16, Wheeling 35) | `qa/beta-metrics-all.md` |
| G2 validate + test | **PASS** (incl. FE-B `test-hubs.js`, QA `test-contract.js`) | console |
| G3 harness | **PASS**: 94 pages, 282 loads, **282 PASS, 0 WARN, 0 FAIL** | `qa/beta-harness-summary.json` |
| G4 no-CDN | **PASS 94/94**, 0 load errors, 0 local 404 | metrics |
| G6 attribution / closed | **PASS 84/84** (Cleveland 13 closed, all flagged, none tiered) | metrics, contract |
| G8 storage | **PASS** | `test-contract.js` |
| Tiles | **PASS 84/84**: OSM only by default, Esri on switch | metrics |

### M1 criteria × pilot page

| Criterion (target) | hub | `cleveland` | `tokyo` | `newyork` | `chinatown` | `wheeling` | All 94 pages |
|---|---|---|---|---|---|---|---|
| B-01 first card ≤ 1.0 screen | — | ✅ 0.69 | ✅ 0.81 | ✅ 0.70 | ✅ 0.72 | ✅ 0.77 | 84/84 |
| B-02 masthead ≤ 506 px | — | ✅ 235 | ✅ 256 | ✅ 235 | ✅ 235 | ✅ 256 | 84/84 |
| B-03 controls above ≤ 14 | — | ✅ 13 | ❌ **15** | ❌ **15** | ✅ 12 | ✅ 14 | 77/84 |
| B-04 rail first screen | — | ✅ | ✅ ★ first | ✅ | ✅ | ✅ | 84/84 |
| B-05 hub cards above fold ≥ 2 | ✅ 2 | — | — | — | — | — | 7/7 hubs |
| B-06 split + sticky + sync | — | ❌ map 37 %, hover→pin ✗ | ❌ same | ❌ same | ❌ same | ❌ same | 0/84 |
| B-07 map toggle + sheet | — | ❌ none | ❌ | ❌ | ❌ | ❌ | 0/84 |
| B-08 floaters = 0 | — | ✅ | ✅ | ✅ | ✅ | ✅ | 84/84 |
| B-09 numbered pins + ordering | — | ❌ | ❌ | ❌ | ❌ | ❌ | 0/84 |
| B-10 tray + Show N | — | ❌ | ❌ | ❌ | ❌ | ❌ | 0/84 |
| B-12 closed with tier = 0 | — | ✅ 0/13 | ✅ 0/1 | ✅ | ✅ | ✅ 0/1 | 84/84 |
| B-16 cards/screen ≥ 2 | — | ✅ 2.32 | ✅ 2.56 | ✅ 2.35 | ✅ 2.46 | ✅ 2.04 | 84/84 |
| B-17 sheet content + trap | — | ❌ | ❌ | ❌ | ❌ | ❌ | 0/84 |
| B-18 ≤ 2 families | ✅ Bodoni Moda + Figtree | ✅ | ✅ | ✅ | ✅ | ✅ | 94/94 |
| B-19 uppercase < 15 % | ✅ 0 % | ✅ 0 % | ✅ 0.3 % | ✅ 0.1 % | ✅ 0 % | ✅ 7.3 % | 94/94 |
| B-20 targets < 44 = 0 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 94/94 |
| B-21 smallest ≥ 12 px | ✅ 12 | ✅ 13 | ✅ 13 | ✅ 13 | ✅ 13 | ✅ 13 | 94/94 |
| B-22 overflow 0 (360/390) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 94/94 |
| B-23 AA light / night | ❌ 24 / 1 | ❌ 3 / 0 | ❌ 5 / 0 | ❌ 3 / 0 | ❌ 2 / 0 | ❌ 3 / 0 | 5/94 |
| M1-16 focus visible | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 94/94 |
| M1-16 landmarks, skip, names | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 94/94 |
| Perf KB · DOM · FCP · FCP 4×¹ | 369 · 1,036 · 496 · 1,008 | 766 · 2,568 · 376 · 816 | 1,280 · **7,266** · 764 · 1,020 | 1,141 · **7,034** · 752 · 1,120 | 489 · 420 · 416 · 872 | 527 · 729 · 348 · 536 | — |
| **Score** | 9/10 | 18/24 | 17/24 | 17/24 | 18/24 | 18/24 | |

¹ FCP measured with 3 pages in parallel on a shared container, so it's noisy (Tokyo was 412 ms at 4× in a quieter run). Transfer
now includes the two web fonts and `contract.css`.

**Run 1 → run 2:** the hub went 8/10 → 9/10 and Tokyo 14/24 → 17/24. The four mirror pilots went from 5–7/23 to 17–18/24. QA-01 (night unreadable) is **fixed**:
night contrast is 0 failures on all city pilots (1 on the hub). QA-02, QA-03, QA-06, QA-07, QA-08, QA-09 and QA-11 are **fixed** (re-measured
above). QA-04 is **partly fixed** (15 on Tokyo/NYC, target 14). QA-05 is **open** (no sheet, tray, hover sync or numbered pins). QA-10 is open (DOM 7.3 k).

### Count asserts (beta == live)

Generator `PASS — 581 checked: 94 pages, 84 place pages, 8,458 places (beta == live)`; `test-beta.js` 84/84;
`test-contract.js` 94/94 generated pages, each city page one card per live record with the sight/food split, unique ids,
100 % attribution, closed flagged and tier-free; harness contract on every load. **0 records lost.**

### New defects (run 2)

| ID | Sev | Defect | Evidence | Lane |
|---|---|---|---|---|
| QA-12 | High | **Method section headings are invisible on every city page** (light theme): "How this guide was made" (`h2#method-h`, 1.09:1) and each note's `h3` (1.01–1.03:1) are cream text on the cream page. The styles look meant for a dark band that isn't rendered. 168 + 244 failures across 84 pages. | `qa/beta-shots/cities__tokyo.method.mobile.jpg` | DES (`cleo.css` / `contract.css`) |
| QA-13 | High | **Hub "More in {country}" list: names are invisible** (`span.dest-n` 1.16:1, cream on white cards; 128 failures) and the counts read **"1 places"**. Masthead also reads "1 areas" on single-area towns (Chinatown). | hub mobile scroll; `qa/beta-metrics.json` → `contrastFailList` | FE-B (hub), FE-A (masthead plural) |
| QA-14 | Med | **Night hero: italic "know" is 1.48:1** (dark olive on navy). | `qa/beta-shots/index.night.mobile.jpg` | DES |
| QA-15 | Med | **Desktop map is 37 % wide** (M1-04 needs ≥ 40 %) and card hover/focus doesn't highlight its pin (pin → card works). | metrics `sync` | FE-A |
| QA-16 | Med | **Cleveland rail leads with "Vietnamese 4 · Singaporean 1"**; the city-unique "Unique American 18" comes 5th, and no sight collection appears in the rail. This goes against the editorial rule (food starts from what's unique to the city) and M1-02/M1-03. | `beta/cleveland.html` rail order | FE-A (order); PLT if collections are missing from the extract |
| QA-17 | Low | Leaflet throws `_leaflet_pos`/`appendChild` errors, about 2 per place, when every deep link fires back-to-back at machine speed (marker removal during a `setView` animation). **Not reproduced at human speed** (5 click → filter → all sequences at 150 ms: 0 errors). Guard: `map.stop()` before re-filtering, or `setView(..., {animate:false})`. | metrics info row; repro script in this log | FE-A |
| QA-18 | Low | "Recommended by" links render with a space before each comma ("Michelin Guide , Daniel Food Diary ,"). | `qa/beta-shots/Singapore__chinatown.desktop.jpg` | FE-A |

### QA sign-off: **NO for M1**

Reasons. Every hard gate holds on all 94 pages: counts, reachability, attribution, closed-flagging, no-CDN, storage,
tiles and harness 0 FAIL. The type, tap-target, uppercase, overflow, first-screen and rail rows now pass everywhere.
M1 is still not met, because these rows fail on every pilot:
- **B-06** (hover → pin sync, map ≥ 40 %), **B-07** (mobile map toggle and sheet), **B-09** (numbered pins and ordering
  line), **B-10** (filter tray) and **B-17** (detail sheet): the QA-05 interactions FE-A hasn't shipped.
- **B-23**: QA-12 (method headings invisible on every city page) and QA-13 (hub list names invisible) are user-visible
  readability failures.
- **B-03**: Tokyo and New York show 15 controls above the first card (target 14).

QA would sign YES once B-06/07/09/10/17 measure green on the pilot set, B-23 is 0 in both themes, and B-03 ≤ 14.
