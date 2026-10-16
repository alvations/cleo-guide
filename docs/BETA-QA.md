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
| `npm run beta:qa:w2` (`beta/qa/w2.js`, W2) | The Wave 2 features against their acceptance criteria: For you, Your day, Near me, the map as a guide, saved lists and the shared view, ★, the DOM budget, OG cards, hub tile lines, motifs and the editorial rail, the storage-blocked render on every place page. It also runs **axe-core 4.10** (vendored at `beta/qa/vendor/`, offline, MPL-2.0) on hubs, pilots, saved, accessibility, method and 404, light and night. Use `--only foryou,day,…` to run a subset. | `qa/beta-w2/w2.json` + `qa/beta-w2/*.jpg` |

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

---

## 2026-10-10 · QA · Build wave 1 run 3 (final M1 sign-off) · session_01PCNcUkfa5S1N1BKGzZA4xx

**State measured:** `66c252b` (FE-A `ab80b44` city page: rail, tray, sheet, source views, split/mobile map; DES review pass 2;
W1 lanes archived). No beta or `tools/beta` change since, up to `7510539`.

**Harness changes:** the probes now use FE-A's contract hooks (`.map-toggle`, `[data-cleo-tray]`, `.tray`, `[data-tr=go]`,
`li.pl.is-focus`, `.leaflet-tooltip.pin-n`). Pins are tapped with real pointer events. B-07 measures map toggle → pin
sheet (Close, Esc, Back). B-17 measures card → detail sheet (content, focus trap, Esc, Back, focus restored). Text covered
by another element (e.g. the rail's arrow buttons) is skipped for contrast instead of failing.

### Gates — all PASS

| Gate | Result |
|---|---|
| G1 counts | generator 582 files / 94 pages / 8,458 places beta == live; `test-beta.js` 84/84; `test-contract.js` 94/94 |
| G1 reachability | **84/84 place pages**: scroll, every deep link (e.g. Tokyo 488/488, NYC 508/508), search sample, JS off |
| G2 | `npm run validate` DATA OK; `npm test` ALL PASS |
| G3 harness | **94 pages, 282 loads, 282 PASS** (0 WARN, 0 FAIL) — `qa/beta-harness-summary.json` |
| G4 no-CDN | 94/94, 0 load errors, 0 local 404; machine-speed deep-link stress now **0 errors** (QA-17 fixed) |
| G6 | 84/84: attribution 100 %, Cleveland's 13 closed places all flagged, none tiered |
| G8 storage · tiles | PASS · OSM/Esri only on 84/84 |

### M1 criteria × pilot page

| Criterion | hub | cleveland | tokyo | newyork | chinatown | wheeling | All pages |
|---|---|---|---|---|---|---|---|
| B-01 first card ≤ 1.0 | — | ✅ 0.79 | ✅ 0.85 | ✅ 0.78 | ✅ 0.75 | ✅ 0.83 | 84/84 |
| B-02 masthead ≤ 506 px | — | ✅ 294 | ✅ 314 | ✅ 293 | ✅ 293 | ✅ 294 | 84/84 |
| B-03 controls above ≤ 14 | — | ✅ 14 | ✅ 14 | ✅ 14 | ✅ 14 | ✅ 14 | 84/84 |
| B-04 rail, ★ first | — | ✅ | ✅ | ✅ | ✅ | ✅ | 84/84 |
| B-05 hub cards above fold | ✅ 2 | — | — | — | — | — | 5/7 (❌ Vietnam hub 1, archived `singapore-old` 0) |
| B-06 split + sticky + 2-way sync, map ≥ 40 % | — | ❌ **map 37 %** (split ✓ sticky ✓ hover→pin ✓ pin→card ✓) | ❌ same | ❌ same | ❌ same | ❌ same | 0/84 |
| B-07 map toggle + pin sheet: Close, Esc, Back | — | ❌ **Esc doesn't close** (toggle 44×44 ✓, full map ✓, Close ✓, Back ✓) | ❌ same | ❌ same | ❌ same | ❌ same | 0/84 |
| B-08 floaters = 0 | — | ✅ | ✅ | ✅ | ✅ | ✅ | 84/84 |
| B-09 numbered pins + ordering line | — | ✅ 194 | ✅ 488 | ✅ 508 | ✅ 16 | ✅ 35 | 84/84 |
| B-10 tray + "Show N places" | — | ✅ Show 194 | ✅ Show 488 | ✅ Show 508 | ✅ Show 16 | ✅ Show 35 | 84/84 |
| B-12 closed tiered = 0 | — | ✅ 0/13 | ✅ 0/1 | ✅ | ✅ | ✅ 0/1 | 84/84 |
| B-16 cards / screen ≥ 2 | — | ✅ 2.11 | ✅ 2.33 | ✅ 2.22 | ✅ 2.38 | ❌ **1.95** | 61/84 |
| B-17 detail sheet: content, trap, Esc, Back, focus restore | — | ✅ | ✅ | ✅ | ✅ | ✅ | 84/84 |
| B-18 ≤ 2 families | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 94/94 |
| B-19 uppercase < 15 % | ✅ 0 % | ✅ 0 % | ✅ 0.3 % | ✅ 0.1 % | ✅ 0 % | ✅ 6 % | 94/94 |
| B-20 targets < 44 = 0 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 94/94 |
| B-21 ≥ 12 px | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 94/94 |
| B-22 overflow 0 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 94/94 |
| B-23 AA light + night | ✅ 0/0 | ✅ 0/0 | ✅ 0/0 | ✅ 0/0 | ✅ 0/0 | ✅ 0/0 | 93/94 (❌ `404.html`) |
| M1-16 focus · landmarks · names | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 94/94 |
| Perf KB · DOM · FCP · FCP 4× | 355 · 1,036 · 248 · 428 | 1,004 · 5,023 · 372 · 572 | 1,812 · **11,650** · 288 · 472 | 1,602 · **11,616** · 388 · 544 | 557 · 872 · 384 · – | 638 · 1,405 · 240 · 480 | — |
| **Score** | **10/10** | **22/24** | **22/24** | **22/24** | **22/24** | **21/24** | |

**Trend:** Tokyo went 14 → 17 → **22**/24 across runs 1–3; the mirror pilots went 5–7 → 17–18 → **21–22**. Retested and fixed:
QA-01…QA-09, QA-11, QA-12 (method headings), QA-13 (hub list names), QA-14, QA-17. Still open: QA-10 (DOM grew to 11.6 k on
Tokyo/NYC once sheets and tray landed; budget ≤ 3,000 is M3-06), QA-15 (map 37 %), QA-16, QA-18.

### New defects (run 3)

| ID | Sev | Defect | Evidence | Lane |
|---|---|---|---|---|
| QA-19 | High | **Esc doesn't close the map pin sheet** (`.poi-sheet`) on mobile or desktop, even with focus on its Close button. Back and Close work. M1-05 needs Esc. | metrics `sheetFlow.pinSheet.escCloses=false` on every page; hand repro (2× Esc, sheet stays, `#map=1`) | FE-A |
| QA-20 | Med | **B-16 regression: 23 pages under 2 cards per mobile screen** (Wheeling 1.95, Cebu 1.6, Changi 1.63, Geylang 1.64…). Cards grew when "Recommended by" links became 44 px block targets, one per line (also visible in the pin sheet). | `qa/beta-metrics-all.md`; `qa/beta-shots/cities__wheeling.mobile.jpg` | FE-A + DES (inline 44 px hit area without stacking) |
| QA-21 | Med | **"★ Signature" tile is a source, not a signature collection** where a city has no ★ collection: Wheeling's is "Wikipedia (notability / …)", Bangkok's "Tourism Authority of Thailand", NYC's "NYC Tourism + Conventions". M1-02 wants ★ to mean a signature collection (anime, city-unique dishes, Must see). Labelling an encyclopedia or a tourism board as the city's signature misreads the editorial rule. | rail first tile per page (metrics `railFirst`); `qa/beta-shots/Singapore__bangkok.rail.desktop.jpg` | DES + FE-A (rail ordering rule) |
| QA-22 | Med | **Vietnam hub shows 1 city card above the fold** (B-05 needs ≥ 2). The archived `Singapore/singapore-old.html` shows 0; QA treats it as out of M1 scope unless the PM says otherwise. | metrics | FE-B |
| QA-23 | Low | `404.html` bottom tab labels (Explore / Search / Your list) are 2.86:1. | metrics `contrastFailList` | FE-B |

### QA sign-off: **NO for M1**

Hard gates G1–G4, G6 and G8 hold on all 94 beta pages. The harness is at 282/282 PASS, every place is reachable, and no
record is lost. 19 of the 21 M1 rows QA measures pass on every pilot. M1 still needs every row on every pilot page, and
two fail on all five city pilots:

1. **B-06**: the desktop map is 37 % of the viewport; M1-04 needs ≥ 40 % (QA-15). Sync itself works both ways.
2. **B-07**: Esc doesn't close the map pin sheet (QA-19).

A third fails on one pilot:

3. **B-16**: Wheeling shows 1.95 cards per mobile screen, and 23 pages overall are under 2 (QA-20).

All three are small, local FE-A/DES fixes. QA will re-sign at **YES** once `npm run beta:metrics` shows B-06, B-07 and
B-16 green on the pilot set with the gates unchanged. QA-21 and QA-22 should land before the M1-22 rollout is
accepted, but they don't block the pilot sign-off.

---

## 2026-10-10 · QA · Wave 2 (Round 2 exit run) · session_012XtSjToyAdhBzVDZmhPP1u

**State measured:** `764dc97b` (FE-A W2 slices 1–5 and the rule-6 sweep, platform W2 slices 1–6, FE-B W2, DES W2 pushes 2–4,
imagery W2). Real Chromium (preinstalled), every off-origin request blocked, 390×844 and 1440×900.

**Harness changes (QA-owned):**
- **New `tools/beta/qa/w2.js`** (`npm run beta:qa:w2`): 218 checks on the W2 features (see "How QA measures").
  **axe-core 4.10.2 is vendored** at `tools/beta/qa/vendor/axe.min.js` (MPL-2.0, licence alongside) and runs offline.
  This closes M1 blocker 5 ("the axe check has never run").
- **`metrics.js` contrast fix (a false failure, not a weaker check):** B-23 graded the **disabled** "Share link" button on an
  empty `saved.html` (opacity .45 by design) at 1.11:1. WCAG 1.4.3 exempts text in an inactive UI component, so disabled
  controls (`:disabled`, `aria-disabled=true`) are now skipped. Every enabled control is still graded. With a populated list
  the same button is cream on ink and legible (`qa/beta-w2/saved-m.jpg`). `saved.html` was re-measured with the fix and spliced
  into the all-pages run. The run was then regraded (`--regrade`) without re-measuring the other 94 pages.
- **Two of my own W2 probe checks were wrong; I fixed them before grading.** (1) The tile-line check read the Singapore hub's
  compact "more towns" `ul.morelist` rows as tiles. Those rows have no tile and no line by design, so the check now reads only
  `.tile` rows. (2) The adjacency check compared the last tile of one country's list with the first tile of the next section,
  so it now compares neighbours within one `ul.tiles` only. Neither change loosens what is asserted about real tiles.

### Gates

| Gate | Result |
|---|---|
| G2 | `npm run validate` DATA OK · `npm test` ALL PASS (incl. `test-beta`, `test-hubs`, `test-contract`, `test-imagery`, `test-fe-a`) · `npm run beta:check` PASS: 95 pages, 84 place pages, **8,458 places, beta == live** |
| G1 counts + reachability | **84/84** place pages: data == DOM == scrolled == every deep link == JS-off; search sample 100 %. Tokyo 488/488, NYC 508/508, Cleveland 194/194 |
| G3 / G4 no-CDN | **95/95** pages render with all off-origin requests blocked: 0 JS errors, 0 local 404, machine-speed deep-link stress 0 errors |
| G6 attribution · closed | 84/84: "Recommended by" on 100 % of cards; Cleveland's closed places all flagged, none tiered (B-12 84/84) |
| G8 storage · tiles | **Storage throwing on every place page: 84/84 render every card, 0 errors** (w2 `storage`); saved page and shared view render with storage throwing. Tiles OSM/Esri only 84/84 |
| Offline reload (B-40, M3-01) | `npm run beta:offline` on all 5 city pilots at 390 and 1440, with the server killed: Tokyo 488/488, Cleveland 194/194, NYC 508/508, Chinatown 16/16, Wheeling 35/35; deep link ✓, saved ✓, unvisited page → landing + banner, 0 errors. **QA signs B-40.** Shots `qa/beta-w2/offline/` |
| Counts == live | equal on every page (generator assert + `test-contract` + metrics G1) |

### M1 blockers and the 4 items awaiting re-measure

| Item | Benchmark | Pilots (cle · tokyo · nyc · chinatown · wheeling) | All pages | Verdict |
|---|---|---|---|---|
| M1-04 / QA-15 desktop map | B-06 ≥ 40 % | **44 %** on all 5 · split, sticky, hover→pin, pin→card ✓ | 84/84 | ✅ fixed |
| M1-05 / QA-19 Esc closes the pin sheet | B-07 | Esc ✓ Close ✓ Back ✓ toggle 44×44 on all 5 | 84/84 | ✅ fixed |
| M1-11 / QA-20 cards per mobile screen | B-16 ≥ 2 | 2.26 · 2.47 · 2.35 · 2.71 · **2.58** (Wheeling was 1.95) | **83/84** (❌ `Singapore/cebu` 1.98) | ✅ on pilots; 1 page off-pilot |
| M1-03 / QA-16 city-unique food first | editorial rule | Cleveland ★ = "Only in Cleveland · Polish Boy · corned beef · Barberton chicken" (18); the lens opens on those 18; first food chip "Unique American 18"; the Persian gap is stated verbatim | — | ✅ fixed |
| M1-16 / B-23 axe 0 serious/critical | M1 blocker 5 | **fails**: footer link-in-text-block on every page (QA-24) | 0/13 page types clean | ❌ QA-24 |
| QA-21 ★ = a publisher | M2-18 | ★ is a canon lens (55 pages) or a collection (5); **never a publisher on 84/84**; the 24 pages with no ★ data show no ★ tile | 84/84 | ✅ fixed |
| QA-18 commas | M1-10 | 0 "Name ," occurrences in 95 pages | 95/95 | ✅ fixed |

Pilot scores from `npm run beta:metrics`: **hub 10/10 and every city pilot 24/24** (`qa/beta-metrics.md`, shots `qa/beta-shots/`).
All pages: `qa/beta-metrics-all.md`. Every row passes except B-05 on the Vietnam hub (1, QA-22) and the archived `singapore-old` (0),
B-23 on `404.html` (QA-23) and `saved.html` night (QA-25), and B-16 on Cebu (1.98).

### Wave 2 features × acceptance criteria (`qa/beta-w2/w2.json`: 184/218 PASS)

| Item | What was driven | Result | Evidence |
|---|---|---|---|
| M2-05 For you | All 5 pilots: pick every interest. Tokyo and Cleveland also run with storage throwing. | ✅ Same id set and same per-area counts before and after (e.g. Tokyo 488 = 488), 0 cards hidden, "First because…" line and `.pl-why` pills present. Picker offers ≤ 5 interests. `INTERESTS` keys on ids only. Works with storage throwing. The choice persists across reloads (cards still lifted, line shown). ❌ **QA-27**: after a reload the rail tile reads `aria-pressed="false"` while the lens is on. | `foryou-picker-m`, `foryou-on-m`, `foryou-reload-m` |
| M2-06 Your day | Cleveland, Tokyo, NYC and Wheeling × 2 viewports | ✅ 4–6 stops, all open with a verified pin and in one area. Every leg says "straight-line". Total and honest label shown. A shared `#day=A&s=` link (order reversed) reproduces the stops in that order. The plans come from `guide.days.plans` (one computation). | `day-tokyo-m`, `day-tokyo-d` |
| M3-02 Near me | Tokyo, geolocation granted (a test point), then denied | ✅ Distance on all 488 pinned cards, nearest first, "never stored or sent" note. The position appears **nowhere** in localStorage, sessionStorage, cookies, IndexedDB, the URL or any request URL. A reload drops the distances. Denied → nothing changes and a calm message shows. | `near-tokyo-m` |
| M2-13 map as a guide | 5 pilots × 2 viewports | ✅ Map 44 %. Opening a sheet puts its place in view on the map. Numbered pins drawn. Mobile pin peek ≤ 40 %. Esc closes. Sheet locator inset present. 0 JS errors. | `map-sheet-tokyo-d`, `map-peek-tokyo-m`, `sheet-locator-tokyo-m` |
| M2-03 saved + shared view | Save 3 places from the sheet, then exercise the saved page | ✅ 3 covered cards and a map. Create, rename and delete a list (the places stay saved). Been there stamp. KML, GeoJSON and JSON export, share and import controls. "Open in maps" on each card. A shared link is read-only (no new, rename or delete) with Save a copy, which creates a named list. **An unknown id is reported, not dropped.** Renders with storage throwing. ❌ **QA-25**: the night map note is 1.38:1. | `saved-m`, `saved-shared-d`, `saved-nostorage-m`, `saved-empty-d-m` |
| M2-18 ★ signature | static, all 84 pages, plus the Cleveland lens | ✅ (see the M1 table above) | `sig-cleveland-m` |
| M3-06 progressive rendering | Tokyo and NYC × 2 viewports | ✅ Initial DOM **Tokyo 1,735 / 2,752 · NYC 1,642 / 2,699** (≤ 3,000; was 11.6 k). Every place is reachable by stamp-all, scroll, deep link, search and JS-off (G1 84/84). Largest desktop DOM site-wide: Orlando 2,754. | `w2.json` `dom` |
| M2-08 share images | static, 95 pages | ✅ Every `og:image` is a local 1200×630 PNG ≤ 300 KB. 84 distinct place cards. | `beta/assets/og/` |
| M2-16 hubs + landing | static and driven | ✅ 67 hub tiles carry signature lines, no category labels. 14 compositions, and no two neighbouring tiles in a list match. ❌ **QA-28**: 7 of 38 editorial-rail deep links open on more cards than they promise (closed places count in the lens but not in the rail). ❌ QA-22: Vietnam hub B-05. | `landing-rail-d`, `hub-japan-m` |
| M2-14 motifs | static and `test-imagery` | ✅ Every motif a hub tile references exists. Each is ≤ 6 KB (largest 5.9 KB). Every file says it is original, generic art. | — |
| M2-15 credit-gated photos | end to end in a throwaway worktree (deleted afterwards; nothing committed) | ✅ An **uncredited** file makes the build refuse. **CC BY-NC** is refused. A **closed place** is refused. A complete TASL row renders `figure.pl-photo` with the visible credit and licence links. With 0 files the layout is unchanged. Nothing was fetched. | `photo*.log` (scratch) |
| M2-12 accessibility page | axe, plus a link check | ✅ It exists and is linked from all 95 pages. It carries the same footer defect (QA-24). | `accessibility-m` |
| Keyboard | Tokyo desktop | ✅ The first Tab reaches the skip link. Enter on a card opens the sheet with focus inside, and Esc closes it and returns focus to the card. The For you picker traps focus, and Esc returns focus to its tile. Focus is visible on 30/30 on every page (M1-16f 190/190). | `w2.json` `a11y` |

### axe-core results (serious/critical; moderate in the notes)

| Rule | Impact | Where | Defect |
|---|---|---|---|
| `link-in-text-block` | serious | footer colophon on **every** beta page ("the current live guide", "OpenStreetMap contributors": cream links at 1.74:1 against the surrounding text, with no underline) | QA-24 |
| `color-contrast` | serious | `saved.html` night: map placeholder `.note`, #d2cabe on #ecebf7, 1.37:1 | QA-25 |
| `scrollable-region-focusable` | serious | `how-we-choose.html` mobile: `.tablewrap` scrolls but can't be focused | QA-26 |
| `heading-order` | moderate | 21 page/viewport runs | not blocking |

### New defects (W2 run)

The PM copies these rows into the `BETA-BACKLOG.md` QA table (QA edits only its own files this wave).

| ID | Sev | Defect | Evidence | Lane |
|---|---|---|---|---|
| QA-24 | High | Footer colophon links are told apart from the text by colour alone (axe `link-in-text-block`, serious; WCAG 1.4.1) on every beta page. Fix: underline the links in `.footer .legal`. | `w2.json` a11y, every page type | DES (`cleo.css` `.footer a`) |
| QA-25 | Med | `saved.html` night: the map placeholder note is 1.37:1 (night ink on a light wash). B-23 fails on saved night. | `qa/beta-w2/saved-empty-d-m.jpg`; metrics `saved.html` night | DES + FE-A |
| QA-26 | Low | `how-we-choose.html` comparison table scrolls horizontally on phones but has no keyboard focus (`tabindex=0` + `role=region` + label). | axe mobile | FE-B |
| QA-27 | Low | For you rail tile keeps `aria-pressed="false"` after a reload restores stored interests (the lens is visibly on). | `foryou-reload-m.jpg`; 5/5 pilots | FE-A |
| QA-28 | Low | Landing editorial rail: per-city counts leave out closed places, but the deep link opens the lens with them, flagged. 7 of 38 links differ: Tokyo ANIME 36 → 37, Punggol HAWKER 18 → 20, Liège FINE 58 → 59, Okinawa UNESCO 29 → 30, Rhineland BEER 23 → 24, Antwerp BEER 17 → 19, Saarland FREE 87 → 88. Fix: count what the lens shows, or label the count "open". | `w2.json` `railMismatch` | FE-B |
| QA-20 (rest) | Low | `Singapore/cebu.html` 1.98 cards per mobile screen (off the pilot set) | `qa/beta-metrics-all.md` | FE-A + DES |

Still open from earlier runs: **QA-22** (Vietnam hub B-05 = 1; archived `singapore-old` 0) and **QA-23** (`404.html` tab labels 2.86:1), both FE-B.

### Round 2 exit criterion 2

B-06, B-07 and B-16 were re-measured on this head and are **green on the pilot set**. `beta:metrics:all` was run. G1, G3, G4, G6 and G8 are at **100 % / 0 FAIL**. Every remaining ❌ is named with its owning lane below.

QA sign-off: NO
Blockers: **QA-24** (DES — axe serious on every page: footer links told apart by colour only; M1-16 needs 0 serious/critical) · **QA-25** (DES + FE-A — `saved.html` night contrast, B-23) · **QA-22** (FE-B — Vietnam hub B-05) · **QA-23** (FE-B — `404.html` contrast, B-23). The pilot rows B-06, B-07 and B-16 are fixed, and so are QA-16, QA-18, QA-19 and QA-21. QA-24 is a one-rule CSS fix. QA re-signs YES once `npm run beta:qa:w2 -- --only a11y` and `beta:metrics:all` show these four green with the gates unchanged.

## 2026-10-10 · QA · W2 re-test (blockers QA-22, QA-23, QA-24, QA-25, QA-28) · session_015bFMDrayu1fp3qp2cKD3xm

**Tested SHA: `c2a221bd`** (full: `git rev-parse c2a221bd`), checked out clean in a separate worktree. It carries designer `432c01ce` (QA-24, QA-25) and FE-B `d71e3831` (QA-22, QA-23, QA-28), and it predates FE-A's view registry (`tools/beta/client/views.js`).

| Blocker | Re-test | Result |
|---|---|---|
| QA-24 footer links told apart by colour only | `beta:qa:w2 --only a11y`: axe on hubs, pilots, saved, accessibility and method pages, light + night | ✅ no `link-in-text-block` on any page. 43/44 rows are 0 serious/critical. The one left is QA-26 (Low, `how-we-choose` `.tablewrap`), which was never a blocker. |
| QA-25 `saved.html` night note 1.37:1 | axe saved (3 rows) + `metrics --only saved` | ✅ axe 0. B-23 light 0/0 · night 0/0 |
| QA-22 Vietnam hub B-05 | `metrics --only Vietnam/index` | ✅ B-05 = 2. Score 10/10. |
| QA-23 `404.html` tab labels 2.86:1 | `metrics --only 404` | ✅ B-23 light 0/0 · night 0/0. Score 9/9. |
| QA-28 rail counts ≠ lens | `beta:qa:w2 --only hubs` | ✅ all 38 editorial-rail deep links open with the promised count |

Gates on `c2a221bd`: `npm run validate` ✅, `npm test` ✅, `npm run beta:check` ✅ (95 pages, 8,458 places, beta == live). Pilot metrics (regression guard): landing 10/10, and Cleveland, Tokyo, NYC, Chinatown and Wheeling 24/24 each. G1, B-23 and every hard gate are green.
Evidence: `qa/beta-w2-retest-c2a221bd-{a11y-hubs.json,pilots.md,Vietnam_index.md,404.md,saved.md}`.

**Do not deploy the later head `498629e1`** (`c2a221bd` + FE-A's in-progress view registry + QA tooling). With Gallery as the default view, the pilots drop to 14–15/24: `qa/beta-w2-retest-pilots-498629e1.md`.
- **QA-29 (High, FE-A):** G1 hard-gate FAIL on Cleveland and Tokyo, because the page opens on the paged Gallery and only 48 of N places are reached by scroll or `#p=` (Cleveland deep 48/194, Tokyo 48/488).
- **QA-30 (Med, FE-A/DES):** B-23 night 1/1 on every place page.
- **QA-31 (Med, FE-A):** the W2 page metrics (B-01–B-04, B-06–B-09) regress, because the default view is no longer the split list + map. Either the Atlas view keeps them, or the default view changes.
- The landing rail links (`#c=TEMPLE` etc.) open 48 cards instead of the promised count under Gallery paging (QA-28 regresses).

These are W3 work-in-progress defects. They do not block the W2 deploy of `c2a221bd`.

QA sign-off: YES

## 2026-10-10 · QA · Wave 3 (views) full pass · session_015bFMDrayu1fp3qp2cKD3xm

**Tested SHA: `83aa1a28`**, checked out clean in a separate worktree. All W3 lanes reported done (platform, FE-B, designer `982c3ba7`, FE-A `83aa1a28`).

Gates: `npm run validate` ✅, `npm test` ✅ (P-04 reachability per view and the Q-04 honesty gate included), `npm run beta:check` ✅ (95 pages, 8,458 places, beta == live).

| Item | Run | Result |
|---|---|---|
| Q-01 per-view metrics | `metrics.js --view {atlas,gallery,guidebook,insights}`, 6 pilots × 390/360/1440 → `qa/beta-w3/beta-w3-metrics-*.md` | **Atlas** (default) 24/24 on every pilot, so the W2 page metrics hold (QA-29/30/31 fixed). In every view: B-22 overflow 0 at 360 and 390, and B-23 contrast 0/0 light and night. **Gallery:** the first rail card sits on the first phone screen (checked by screenshot). The B-01/B-03/B-16 ❌ come from the probe measuring the paged All-N grid, a harness limit, not a defect. ❌ **QA-32:** Guidebook B-20, 598 (Cleveland) / 2,801 (Tokyo) small targets. ❌ **QA-33:** Insights M1-16 focus visible 13/30 and 12/30, plus B-20 62/188. The map/rail rows (B-04, B-06, B-07, B-09) are Atlas-only and don't apply to the other views. |
| G1 reachability, every view | `test-views.js` P-04 in npm test (scroll, `#p=`, `q=`, print DOM) + `views.js` | ✅ every place on every pilot in every view. The Gallery reaches all of them through the pager and Show all (`#p=` 194/194, 488/488). The metrics G1 row reads 0/N in Guidebook and Insights because it probes `li.pl` only; P-04 covers those views. |
| Q-02 no-CDN + storage blocked | `views.js --only nocdn`: Leaflet, tiles and fonts blocked and `localStorage`/`sessionStorage` throwing, 5 pilots × 4 views × 2 viewports | ✅ **160/160**. The view is applied, every place id is in the DOM, there are 0 JS errors, and the switcher switches (phone disclosure + aria-pressed) with no storage. |
| Q-03 deep-link matrix | `views.js --only links`: #view × #p × lens (a, t, q) × pg/all, receiver's stored preference ≠ the link, Back/Forward | ✅ 140 + 70 cases. The sender's view wins over the stored preference, the lens counts equal `Cleo.lens`, `#p=` opens the sheet in every view, and one switch is one history entry. |
| Q-04 honesty | `test-honesty.js` (npm test) + mounted views with the sheet open | ✅ 0 hits in view copy. INFO (PM): record prose from the live data carries prices and ratings (269 places, e.g. Cleveland golf "Around $13 for nine holes", shown verbatim in the Guidebook). It is data, not view copy, and needs a PM call. |
| W2 regression | `beta:qa:w2` (full) | 216/218. ❌ **QA-34:** Chinatown phone map, a pin tap opens no sheet (2/2 runs; it was 36 % in W2). ❌ QA-26 (Low, carried over). |

### New defects (W3)

| ID | Sev | What | Evidence | Lane |
|---|---|---|---|---|
| QA-32 | Med | **Guidebook tap targets.** Save hearts `.ge-save` are 30 px tall (194 on Cleveland), source chips `.recby .src` are 26 px (229), and the `.urls` links are under 44 px. Hearts and chips should match the 44 px card chrome. The entry-name links in `h4` are text links (exempt). | `beta-w3-metrics-guidebook.md` B-20 | FE-B (guidebook markup) + DES (views.css) |
| QA-33 | Med | **Insights keyboard focus.** Tab walk: 13/30 focus stops have no visible focus ring. These are the SVG chart bar links (`<a>` around `rect.bar`), which also measure 18 px tall. Add a `:focus-visible` outline on the bar or link. The 18 px height is acceptable *only* because "Show as a table" and the index give equivalent 44 px targets; keep both. | `beta-w3-metrics-insights.md` M1-16, B-20 | DES (views.css) + FE-B |
| QA-34 | Med | **Chinatown phone map: a pin tap opens no sheet** (M2-13 peek detent). Other pilots pass. It was 36 % in W2, so this regresses with FE-A slice 3 (list-first phones). | `qa/beta-w3/w2-map-83aa1a28.json` | FE-A |

Harness notes: `views.js` opens the phone switcher disclosure before switching (fixed in this commit). Per-view metrics evidence: `qa/beta-w3/`.

QA sign-off: NO
Blockers: **QA-33** (keyboard focus not visible on Insights chart links: M1-16 a11y on a new view) · **QA-32** (Guidebook hearts and source chips under 44 px: Q-01 B-20 per view) · **QA-34** (Chinatown phone pin sheet regression: W2 M2-13). All three are small. Every other W3 criterion passes on `83aa1a28`: Q-02 160/160, Q-03 210/210, Q-04 0 hits, P-04 reachability in every view, Atlas 24/24 on every pilot. QA re-signs YES once `metrics.js --view guidebook|insights` (B-20, focus) and `beta:qa:w2 --only map` show these three green with the gates unchanged.

## 2026-10-10 · QA · W3 re-test (blockers QA-32, QA-33, QA-34) · session_015bFMDrayu1fp3qp2cKD3xm

**Tested SHA: `83c51890`**, pinned in a clean worktree (Wave 4 lanes are pushing to the branch head). It carries the fix commit `b5a95f6c`.

| Blocker | Re-test | Result |
|---|---|---|
| QA-33 Insights focus | `metrics.js --view insights`, 6 pilots | ✅ M1-16 focus visible **30/30** on every pilot (was 13/30) |
| QA-32 Guidebook tap targets | `metrics.js --view guidebook` + a probe of what is left | ✅ hearts and source chips are now 44 px. The remaining B-20 count (Cleveland 175) is 155 `h4` entry-name text links (exempt, as ruled in W3) plus 20 appendix URL links (below) |
| QA-34 Chinatown phone pin sheet | `beta:qa:w2 --only map` | ✅ **35/35**, pin tap → sheet on all 5 pilots |

Insights' remaining B-20 count is the SVG chart bars (18 px), accepted in W3 because "Show as a table" and the index give 44 px equivalents, plus one index link at 41×44.
Regression: Atlas (default) is 24/24 on every pilot. Overflow (B-22) and contrast (B-23) are 0 in all three views. `views.js --only nocdn` (Tokyo + Chinatown) is 64/64. Gates: validate ✅, `npm test` ✅, `beta:check` ✅.
Evidence: `qa/beta-w3/retest-83c51890/`.

New, Low, not blocking: **QA-35** (FE-B/DES). The Guidebook's sources appendix `.urls` links render 36 px wide × ~528 px tall on a 390 px phone (a URL wrapping in a squeezed column). The target is still ≥ 24 px both ways. Fix: `overflow-wrap:anywhere` on a full-width line.
Still open, Low: QA-26. PM call pending: record prose with prices and ratings, shown verbatim in the Guidebook (see "Wave 3").

QA sign-off: YES

## 2026-10-10 · QA · Wave 4 full pass · session_015bFMDrayu1fp3qp2cKD3xm

**Tested SHA: `8aa6fdf41f7651a29fe6f23a9f35cb48c279834b`**, pinned in a clean worktree. Gates verified there: validate ✅, `npm test` ✅ (P-04 reachability per view, Q-04 honesty gate), `beta:check` ✅ (179 pages, 84 place pages, 8,458 places, beta == live).

### W4 features: `tools/beta/qa/w4.js` → 45/45 PASS (`qa/beta-w4/w4.json`)

| Area | Result |
|---|---|
| Default view | ✅ **Atlas** with no hash and no stored preference (`Cleo.view.DEFAULT = 'atlas'`), phone and desktop. This is consistent with FE-A's revert. |
| Switcher glyph | ✅ Gallery no longer uses the heart glyph |
| Diacritics | ✅ "Kanda Myōjin" in Atlas, the sheet, the Guidebook and the Gallery, with the folded spelling 0 times. An unaccented `q=myojin` finds it. No folded "Jonan/Josai/Johoku". |
| Gallery covers | ✅ 0 neighbouring grid covers share a composition (32 desktop / 24 phone). 62 row covers use 20 distinct motif/plate combinations. Screenshots `gallery-{desktop,mobile}.jpg`. |
| Motion | ✅ under reduced motion, 0 running animations after a save and a view switch, and nothing autoplays. With motion on, the micro-interactions run (heart pop, view cross-fade) and nothing loops. |
| Guidebook lazy chapters | ✅ Tokyo initial DOM **2,730** (≤ 3,000) on phone and desktop. Contents lists all 13 chapters. A deep link to the last place of the last chapter mounts it. Reachability via contents, search and deep link is green in P-04 (npm test) and `views.js`. |
| Tokyo weight | ✅ default view ≈ **0.43 MB** gzip (1.45 MB raw), under 2.0 MB |
| i18n scaffolding | ✅ `hreflang` en + x-default. No language switcher is shown. |
| What changed | ✅ all 84 place pages link "last checked" to an existing page. Tokyo, Cleveland and Wheeling render with 0 errors, axe 0 serious/critical (phone, desktop light and night) and no price/rating wording. |
| Insights bars | ✅ every bar link is ≥ 24 px (min 24) and the table fallback is present |

### Regressions

| Run | Result |
|---|---|
| Q-02 no-CDN + storage throwing / Q-03 deep links / Q-04 honesty (`views.js`, 5 pilots × 4 views) | ✅ 319/320. The one FAIL is the known record-prose INFO (Cleveland golf "Around $13…", live data, PM call pending). It is not view copy. |
| Q-01 per view (`metrics.js --view`, 6 pilots) | B-22 overflow 0 and M1-16 focus 30/30 in **all four views**. B-23 contrast is 0 in Atlas, Guidebook and Insights. Atlas G1 ✅ every pilot. |
| W2 harness (`beta:qa:w2`, full) | ✅ 217/218. The one FAIL is QA-26 (Low, carried over). The map is 35/35. |

Judged non-defects (harness limits, checked by hand):
- **Gallery B-23** "1.00:1" on `span.pl-ini` / `span.plate.i`: these cover initials are `aria-hidden` (decorative). Their real colours are dark red on pale pink. The metrics contrast parser can't read CSS `color(srgb …)` values (QA harness fix to follow).
- **Atlas B-03** reads 15 (≤ 14): the 15th is the new in-sentence "last checked" link to What changed (required by the W4 brief). With "How we choose", the masthead stat line carries 2 prose links, which B-20 already exempts. Without them, 13 controls.
- **Guidebook B-20**: only the `h4` entry-name text links remain (exempt). The appendix URL links of QA-35 no longer show up.
- **Insights B-20**: the bars are now ≥ 24 px with the table fallback (accepted).
- **G1 in the non-Atlas views**: the metrics probe walks `li.pl`; P-04 covers reachability there.

Open, Low, non-blocking: QA-26. PM call pending on record prose with prices and ratings.

QA sign-off: YES

## 2026-10-10 · FE-A proposal for QA to ratify · W5 "Gallery as default" — the G1 "scrolled" and B-01 card criteria

Written by FE-A (W5 brief: "agree the 'scrolled' criterion with QA in BETA-QA.md — never weaken reachability"). It follows
QA's own W3 rulings ("the B-01/B-03/B-16 ❌ come from the probe measuring the paged All-N grid, a harness limit"; "the
Gallery reaches all of them through the pager and Show all"). Implemented in `tools/beta/metrics.js` as two small,
commented edits so the numbers can be reproduced; QA owns the file and may revert or tighten them.

| Criterion | Before | Proposed (implemented) | Why it does not weaken G1 |
|---|---|---|---|
| G1 "scrolled" | after "All" (`[data-mode=all]`/`[data-cleo-all]`), scroll; every `li.pl` must be visible | the same, plus, **in a paged view only**, one tap on the pager's own visible "Show all N on one page" (`.g-pager [data-pg=all]`) before scrolling | DOM = data, deep links (every id, with a hiding lens first), search and no-JS stay 100 % and unchanged. The reader's path is the same one tap + scroll. |
| B-01 / B-03 "first card" | first visible `li.pl` | in Gallery only, the first visible **place card**: `li.pl` or `li.gc[data-id]` (the lead or a row card — cover, name, tier, Recommended by, heart, opens the place) | B-16 still measures `li.pl`; G6 already requires Recommended by on every `li.gc`. Atlas, Guidebook and Insights are unchanged. |

Not claimed: B-04/B-06/B-07/B-09 are Atlas map/rail rows (QA W3: "Atlas-only, don't apply to the other views") and
B-16 is 1.53–1.61 in Gallery (SPEC §4: a 1-column, cover-led phone grid). Atlas keeps all of them (`--view atlas`).

## 2026-10-10 · QA · Wave 5 (final) full pass · session_015bFMDrayu1fp3qp2cKD3xm

**Tested SHA: `f2bf7610ccebadfac31f893542b0eb23b63892d8`**, pinned in a clean worktree. Gates verified there: validate ✅, `npm test` ✅, `beta:check` ✅ (179 pages, 84 place pages, 8,458 places, beta == live).

### Ruling on "Gallery as default" (FE-A's two `metrics.js` edits): **ratified**

I checked reachability with an independent probe, `tools/beta/qa/w5.js`, which doesn't use the edited rules. It covers the 5 pilots with the Gallery as the actual default (no hash, no stored preference):

| Path to a place | Result |
|---|---|
| Deep link | ✅ `#p=<id>` opens that place's sheet, with the Gallery kept, for **every** place: 194 + 488 + 508 + 16 + 35 |
| Search | ✅ typing the name in the page filter shows the place (25 spread samples per pilot) |
| Show all | ✅ "Show all N on one page" shows every record (visible == N), phone and desktop. Wheeling (35) fits one page and shows all 35 after scrolling. |
| No-JS | ✅ every record is listed and displayed on all 5 pilots |
| Phone first screen | ✅ a real place card on every pilot: lead card with cover, name, tier, heart, "Recommended by" and a link that opens the place (screenshot `first-cities_tokyo.jpg`: Kanda Myōjin at ≈ 0.5 screens) |

Ratified as QA rules: in a paged view, one tap on the pager's own visible "Show all" counts as part of "All" for G1; and in the Gallery, the first visible place card (`li.pl` or `li.gc[data-id]`) counts as the "first card" for B-01/B-03. With these rules, metrics on the Gallery default read B-01 0.50–0.59, B-03 7, and G1 ✅ on every pilot. The Gallery-default rows that still fail are the Atlas-only map rows (B-06, B-07, B-09) and B-04 on Chinatown (rail top 936 px), plus B-16 at 1.52–1.61 (the 1-column cover grid from SPEC §4). The Atlas view keeps all of them: `--view atlas` is 24/24 on every pilot.

### W5 items (`w5.js` 64/64)
- **Macrons at DPR 1:** "ō" draws visibly different pixels from "o" in the display-name face at 18 and 24 px (`macron-dpr1.jpg`).
- **Motif by kind:** every sight card carries a `data-m` motif. `motifOf` keys only on collection ids (and food on its cuisine id), never on description or name text (code read).
- **Masthead "last checked":** ≥ 44 px target on phone and desktop. B-03 is back to ≤ 14 in Atlas (14) and 7 in Gallery.
- **Tokyo weight:** ≈ 0.55 MB gzip (1.9 MB raw) on the Gallery default. A single `art/tokyo/map.svg` fetch, no duplicate.
- **Insights:** Tokyo initial DOM ≤ 3,000 and every chart link has a ≥ 44 px hit area, on phone and desktop.
- **i18n:** the `en` catalogue is present, no other locale is shipped, hreflang en + x-default, and the switcher is hidden.

### Regressions
- `views.js` (no-CDN + storage throwing, deep-link matrix, honesty; 5 pilots × 4 views): **319/320**. The one is the known record-prose INFO (live data, PM call).
- Per view: B-22 overflow 0, B-23 contrast 0 and M1-16 focus 30/30 in **all four views**. Guidebook and Insights B-20 are only the exempt text links and the ≥ 24 px bars.
- W2 harness: 192/218 as written, because 25 map checks opened the page with no hash and landed on the Gallery. The map belongs to the Atlas view, so `w2.js` now runs the map probe at `#view=atlas` (QA harness fix): **35/35**. Remaining: QA-26 (Low).
- Atlas Tokyo B-07 missed once at concurrency 3 and passed 2/2 when re-run alone (timing, not reproducible).

Open, Low: QA-26. PM call pending on record prose with prices and ratings.

QA sign-off: YES

## 2026-10-10 · QA · R5 follow-up re-test · session_015bFMDrayu1fp3qp2cKD3xm

**Tested SHA: `63932912265fa83e23addc65c5f65b63112a7007`**, pinned in a clean worktree. `metrics.js` is unchanged since the W5 ruling.

| Check | Result |
|---|---|
| Gates | validate ✅, `npm test` ✅ (P-04 reachability in every view), `beta:check` ✅ |
| W5 probe `w5.js` | ✅ **64/64**. Deep link opens all 1,241 places, search, show-all and no-JS reach 100 %, and every pilot has a real place card in the first phone screen. |
| G1, all four views | ✅ Gallery default and Atlas: G1 on every pilot (metrics). Guidebook and Insights: P-04 in npm test + `views.js` (319/320; the one is the known record-prose INFO). |
| Atlas | ✅ **24/24** on every pilot |
| Weight, default (Gallery) | ✅ Tokyo **1,932 KB** raw / ≈ 0.45 MB gzip (≤ 2.0 MB); New York 1,678 KB. One `map.svg` per page. |
| FCP at 4× CPU, default | ✅ landing 968 ms, Cleveland 388, Tokyo 532, New York 420, Chinatown 580, Wheeling 356 (all ≤ 1.0 s) |
| One tap to the map (phone) | ✅ from the Gallery, the map button opens `#view=atlas&map=1`: the map at 93 % of the screen, 488 pins on Tokyo, and Back returns to the Gallery. B-07 now passes on the default view too. |
| Gallery JSON unavailable | ✅ with `data/gallery/*.json` blocked, the Gallery still shows every place (Tokyo 488, Chinatown 16) and 0 errors |
| W2 harness | ✅ 217/218 (QA-26 Low). The map runs in Atlas: Chinatown 16 numbered pins, peek 36 %. |

On the Gallery default, the rows still failing are the Atlas-only map/rail rows (B-04, B-06, B-09) and B-16, as ratified in W5. Open: QA-26 (Low); the PM call on record-prose prices/ratings.

QA sign-off: YES

## 2026-10-11 · QA · Wave 6 full pass · session_01RX4nPDtmV2V1kHSaN6tG7z

**Tested SHA: `2f227631252db2a90fd7e76541365a151871ac99`**, pinned in a clean worktree (`git worktree add ../qa-r6 2f22763`); nothing after it was measured.

**Gates** (on the pin):
- validate ✅.
- `npm test` ✅. It includes `check-google.py`, test-contract, test-honesty (with the rule-6 brand scan) and P-04 reachability in every view.
- `beta:check` ✅: 179 pages, 84 place pages, 8,458 places, beta == live.

`npm ci` cannot run in `tools/`: `package-lock.json` is gitignored. The gates ran after `npm install` (see QA-39).

**New harness:** `tools/beta/qa/w6.js` (QA). It is independent of `metrics.js`.
- It runs real Chromium with every off-origin request blocked. Tile images are stubbed 1×1, and their hosts are recorded.
- Output and screenshots go to `design/beta/eval/w6/qa/`. Metrics tables for all four views (W6 rules) are there as `metrics-{atlas,gallery,guidebook,insights}.md`, plus `metrics-atlas-r5rules.md`: the same build graded with the R5 `metrics.js`.
- Regression outputs are in `design/beta/eval/w6/qa/regression/`.

### Rulings on the Atlas lane's measurement edits and D-36

On this build, the R5 `metrics.js` grades Atlas **19–20/24**. The W6 `metrics.js` grades it **23/24**. The difference is exactly B-02, B-06, B-07 and B-08 (`metrics-atlas-r5rules.md`). I ruled on each edit with my own probe.

| Edit | Ruling | Independent evidence (`w6.js`, 5 pilots) |
|---|---|---|
| `metrics.js` B-07: on an Atlas phone already on the map, measure the visible "List" control and don't tap it first. The pin probe skips count bubbles and pins under the tray. | **Ratified.** Same outcome (map up, one tap to a pin sheet, Close/Esc/Back), and the pin rule is stricter. | Map 390×784 at load. "List" 92×44. Pin tap → sheet with Close; Esc closes; Back closes and stays in Atlas (4/5; Wheeling had no pin outside my stricter band, and metrics passes it). `w2.js` map probe 35/35 (below). |
| `metrics.js` B-06: "sticky" scrolls the list's own pane; "split" accepts a list under 40 % | **Ratified.** Same outcome: the map stays in view while the list scrolls. The B-06 grade still needs the map ≥ 40 %; `w6.js` grades the W6 ≥ 60 %. | A real mouse wheel over the list moves the pane 3,000 px, the window 0, and the map stays at 160/181–900 px (5/5). The map is 64 %, the list 36 %, and the map fills the screen (5/5). |
| `metrics.js` B-08: skip titles wholly outside their own scroll pane | **Ratified as a rule**: such a title is invisible, not covered. **But** B-08 only scrolls the window, and in map-first Atlas the window doesn't move, so the tray list is never scrolled. In Atlas, B-08 is graded by `w6.js` until `metrics.js` scrolls the pane, and **it fails: QA-37**. | `w6.js` "independent B-08" cuts each title by its clipping ancestors, then hit-tests what is on top. It finds a covered title on 5/5 pilots at half-scrolled and at full-scrolled. |
| `metrics.js` B-02: a masthead collapsed to 0 px on the Atlas phone map reads as 0 | **Ratified.** 0 px is the true on-screen height. The identity the masthead carried is lost, though: **QA-40**. | The masthead is 1×1 px. `h1` is in the DOM for assistive tech (AT) and not visible. |
| `test-beta.js`: "one marker per pinned place" = pins drawn + bubble counts | **Ratified.** A sum alone can't tell one place counted twice from one lost, so `w6.js` checks the partition. | Real Chromium, phone, default zoom: drawn ∪ clustered == shown, overlap 0, lost 0, bubble sum == clustered. Cleveland 49 + 145 (12 bubbles), Tokyo 64 + 424 (26), New York 54 + 454 (30), Chinatown 16 + 0, Wheeling ✓. At zoom 13: 0 bubbles, every pin drawn. A bubble tap zooms in. |
| **D-36**: B-04 (rail on the first phone screen) ❌ by design in Atlas | **Ratified.** The owner's brief defines the phone peek (area chip + first ranked place). The rail is one step up, and B-04 keeps grading the default view. | The rail is on screen at the half detent, 5/5 (e.g. y 631–780). The Gallery default passes B-04 on 4/5 (Chinatown 857 px, a ❌ known since W5). |

### W6 acceptance (W6-BRIEFS, both lanes) and D1–D11

**Atlas, phone 390×844** (`phone-*.jpg`):
- ✅ Map-first.
- ✅ The peek shows the area chip and the rank-1 place (Tokyo: "Chiyoda-ku 43" · Imperial Palace East Gardens).
- ✅ Keyboard: Enter on the grab goes peek → half → full; Esc steps back down. Tray top is 620 → 405 → 124. The focus ring is visible.
- ✅ "List" opens the full tray with every card (194/488/508/16/35), and Back steps it down.
- ✅ Map and tray controls are ≥ 44 px.
- ✅ The pin sheet works with Esc and Back.
- ❌ QA-37 (tray head), QA-40 (city not named), QA-41 (bubbles read as ranks).

**Atlas, desktop 1440×900** (`desktop-*.jpg`): 5/5 on every check.
- Map 64 %, list 36 %; the map fills the screen.
- **Every** numbered pin carries its card's rank: 194/488/508/16/35, 0 mismatches.
- Card hover lights its pin; a pin click focuses its card in the pane.
- The area lens fits the map to that area; a deep link flies to the pin.
- Legend; base switch cycles Street (OSM) → Light → Satellite (Esri).
- Must see: list and pins follow `t=1`, and a second tap restores all.
- Locate-me reads the position only on a tap (0 reads on load, then 1), draws it, and stores nothing.

**Reachability in Atlas:**
- ✅ `#view=atlas&p=` opens the sheet for **every** place, view kept, phone and desktop (1,241 × 2).
- ✅ Search by name: 25 samples per pilot.
- ✅ The list holds every card.

**Leaflet blocked (no CDN):** ✅ 5/5 × phone/desktop.
- Every card is present, a card is on screen, there are 0 JS errors, and only the map is missing.
- The map area says "The map appears when it can load. Every place is listed here…".

**Storage throws:** ✅ 5/5 × 2. Atlas, map, base switch, Must see and tray all work, with 0 errors.

**Tiles:** ✅ only `tile.openstreetmap.org` and `server.arcgisonline.com` were requested. `check-google.py` ✅.

**Type:**

| Check | Result |
|---|---|
| Glyph coverage (CDP platform fonts, every character on the page) | ✅ Playfair and Inter draw every letter on all 4 Vietnam pages (Ho Chi Minh City: 47 Vietnamese characters), the pilots and the landing. The only fallback is "→" in the display face, as recorded in DECISION.md. |
| CJK | ✅ falls back to a CJK system face (here IPAGothic, 600/600 characters on Tokyo) |
| Macrons at DPR 1 | ✅ "ō" draws its macron at 18 and 24 px in **both** faces (`type-macron-vn-cjk-dpr1.jpg`) |
| Fonts | ✅ 12 woff2 subsets, self-hosted, with OFL text committed, `font-display: swap` on all 12, and no font service referenced |
| Contrast, all four views | ✅ AA: B-23 0/0 light and night, phone and desktop, every pilot |
| Focus, all four views | ✅ M1-16 30/30 in every view, plus every Atlas map/tray control (`w6.js` focus 10/10) |
| Targets | ✅ B-20 0 in Atlas and Gallery. Guidebook and Insights are only the ratified exemptions: entry-name text links, and chart bars that have 44 px equivalents (`w5.js` insights ✅). |

**Axe (4.10, vendored, all four views × 5 pilots × phone/desktop × light/night = 80 rows):** 60/80.
- Gallery, Atlas and Guidebook: 0 serious/critical.
- ❌ **QA-38**: Insights `nested-interactive` (serious) on all 20 Insights rows. It was already present at R5 (Tokyo 4/4 on `6393291`); this is the first axe run on Insights.

**Imagery:**
- ✅ 146-target / 250-candidate manifest, `fetch-unsplash.js`, the credit gate (`test-imagery.js` in `npm test`).
- ✅ No photo ships, and no page loads an Unsplash host.
- ❌ QA-39: the workflow ran `npm ci`. Fixed after the pin in `49deb0a7` (diff read; not run, no key).

| Row | State on `2f22763` |
|---|---|
| D1 four views | ✅ (`views.js` + `w5.js` + P-04). One `#view=atlas&a=` link throws: QA-36. |
| D2 Atlas map-first | ◐: QA-36, QA-37, QA-40, QA-41. Everything else in the row is ✅ (above). |
| D3 Gallery | ✅ unchanged: B-01 0.50–0.56, B-03 7, G1 ✅ (QA-42 is the lead card's heart, already present at R5) |
| D4 Guidebook | ✅ unchanged |
| D5 Insights | ✅ (charts, table fallback, 44 px hit areas); the axe defect is counted under D11 |
| D6 type | ✅ (QA scope: self-hosted OFL, Vietnamese, macrons, CJK). Sub-scores belong to the evaluator. |
| D7 tokens | Not measured by QA (evaluator) |
| D8 luxury × fun | Not measured by QA (evaluator) |
| D9 photos | Owner-blocked; plumbing ✅ after `49deb0a7` |
| D10 honesty | ✅ every place kept (beta == live 8,458), attribution (G6 0 without), closures flagged (B-12, contract), brand scan clean, no `document.write`, OSM/Esri only. QA-36 is a JS error, not an honesty defect. |
| D11 perf + a11y | ◐ budgets ✅, AA ✅, 44 px ✅, focus ✅; **axe ❌ QA-38** |

### Budgets

| Page | Transfer | FCP at 4× CPU |
|---|---|---|
| Tokyo default (Gallery), phone | **1,462 KB raw / 446 KB gzip est.** (`w6.js` response bodies). `metrics.js`, which counts more resources: **1,952 KB**. Both ≤ 2.0 MB. ✅ | runs 616 / 540 / 372 ms, median **540 ms** (metrics 596 ms) ≤ 1.0 s ✅ |
| Tokyo Atlas, phone (records Leaflet + `atlas.js`) | 1,590 KB raw / 480 KB gzip est. `metrics.js`: 2,043 KB. Under 2.0 MiB, but over 2.0 MB decimal. Atlas is not the budgeted default; recorded only. | median **668 ms** ✅ |
| Tokyo Atlas, desktop | Same transfer | runs 556 / 1,312 / 456 ms, median 556 ms (one noisy run) |

**Eager JS:**
- **41,425 B gzip** on the heaviest page (`Singapore/ang-mo-kio.html`), which is 40.454 KB.
- The gate is `Math.round(bytes / 1024) ≤ 40`, so it passes up to 41,471 B: **exact headroom 46 B** (the lane reported 47).
- That is 465 B over a literal 40 KB (40,960 B). R5 was 41,077 B (117 B over); W6 adds 348 B (`city.js` +355, `views.js` −7). QA-43.

### No regression (vs W5 full pass + R5 follow-up)

| Check | Result |
|---|---|
| `w5.js` | ✅ **64/64**: Gallery default, deep link to all 1,241, search, show-all, no-JS, a first-screen card, macrons, mast, Insights DOM, weight, i18n |
| `views.js` | **318/320**. The record-prose INFO is known (PM call). ❌ **QA-36** is new: `cleveland.html mobile #view=atlas&a=DT (pref insights)` throws a Leaflet page error. It passed at R5. |
| `w2.js` map probe at `#view=atlas` | **35/35** after a QA harness fix (below). The rest of `w2.js` (For you, day, Near me, saved, ★, DOM, OG, hubs, axe on the default views) passes, except QA-26 (Low, carried). |
| G1 on the Gallery default | ✅ 5/5 (metrics: deep 194/488/508/16/35, search, no-JS) |
| B-01/B-03 first-screen rules ratified in W5 | ✅ Gallery B-01 0.50–0.56 (W5 0.50–0.59), B-03 7 (W5 7). Atlas B-01 0.85, B-03 10. |
| Atlas metrics | 23/24 on every pilot (R5 24/24). The one miss is B-04, by design (D-36, ratified above). |
| `w4.js` | 2 FAILs are the W4 "Atlas is the default" assertion, which W5 superseded. Its motion section times out at R5 too: the click on the first heart is intercepted, which is QA-42. Not a W6 regression. |

**QA harness edits** (no gate weakened):
- **`w2.js` map:** an Atlas phone that is already on the map is not sent to "Show the map" first.
- **`w2.js` pin:** the tapped pin must be one a finger can reach (on screen, hit-tests to itself) and must not be a count bubble. The measured outcome is unchanged: a pin tap gives a peek ≤ 40 % and Esc closes it.
- **New `w6.js`.**

### Findings

| ID | Sev | Finding | Steps → expected vs actual | Evidence | Owner |
|---|---|---|---|---|---|
| QA-36 | **High** (regression) | Uncaught Leaflet `Cannot read properties of undefined (reading '_leaflet_pos')` (`_getMapPanePos` ← `_getNewPixelOrigin`) when the Atlas phone map opens on an area lens and the tiles can't load. | Phone 390×844, tiles blocked, open `cleveland.html#view=atlas&a=DT` (or `a=SUB`). **Expected:** 0 JS errors (G4; `views.js` passed at R5). **Actual:** the error on **20/20** loads; R5 `6393291` 0/20. With tiles loading: 0/3. Same root cause on `cities/newyork.html#view=atlas&map=1` with tiles blocked (3/3, and already at R5, never in a harness). Likely a fit (`fitArea` in a rAF) running after the dead-tile fallback has replaced the map. Same class as QA-17: guard with `map.stop()` / skip the fit once the map has fallen back. | `regression/views.json` · `node beta/qa/repro-qa36.js` | FE-A Atlas |
| QA-37 | **High** | **The Atlas phone tray's sticky head is about 370 px and hides the list.** The head holds the grab, mode chips, search/filter/map row, area chips and the whole rail (~140 px). | Phone, `#view=atlas`, Enter on the grab. **Expected:** the half detent shows ranked places; titles scrolling under the head are not covered (B-08). **Actual:** at half the tray is 439 px, the sticky head covers 405–775 px, and **about 70 px of list is visible: no complete place**. At full the head takes about half the tray. Titles scroll under the head: `w6.js` finds a covered title on **5/5** pilots at half-scrolled and full-scrolled (e.g. "chip over Isegen", "toolbar over Rock & Roll Hall of Fame"). `metrics.js` B-08 never scrolls the tray, so it reads 0. | `phone-half-*.jpg`, `phone-full-*.jpg`, `w6-phone-desktop-reach-nocdn-focus.json` | FE-A Atlas (+ designer) |
| QA-38 | **High** | Insights charts fail axe `nested-interactive` (serious): the chart `<svg>` carries a role, and its bar links are focusable descendants. | axe on `#view=insights`, any pilot, phone/desktop, light/night. **Expected:** 0 serious/critical (D11). **Actual:** 6–7 nodes per page on all 20 rows. Already at R5 (Tokyo 4/4); first axe run on Insights. | `w6-axe.json` | FE-B (+ designer) |
| QA-39 | High → **fixed after the pin** | `beta-fetch-unsplash.yml` ran `cd tools && npm ci`, but `package-lock.json` is gitignored. The first keyed run would fail with EUSAGE before fetching anything. | Confirmed here: `npm ci` exits EUSAGE. **Fixed in `49deb0a7`** (`npm install --no-audit --no-fund`), after `2f22763`; diff read, not run (no key). | `git show 49deb0a7` | imagery |
| QA-40 | Med | The Atlas phone first screen doesn't name the city. The masthead collapses to 0 px and the header shows only "‹ Japan". | Phone, `#view=atlas`. **Expected:** the reader can see which city this is (wayfinding). **Actual:** not named on Cleveland, Tokyo and New York. It is named on Chinatown and Wheeling only because the area chip contains the name. | `phone-peek-cities_tokyo.jpg` | FE-A Atlas + designer |
| QA-41 | Med | On phones at the default zoom, **no pin shows a rank number**: `.pin-n` is hidden below z14. The count bubbles (area-coloured ring + number) look just like the cards' rank badge, so "17", "44", "65" read as ranks. | Phone, `#view=atlas`, Tokyo. **Expected (D2):** numbered pins match the ranks. **Actual:** the numbers appear only after zooming in; desktop is ✅. | `phone-peek-cities_tokyo.jpg` | FE-A Atlas + designer |
| QA-42 | Med | **The save heart on the Gallery lead card can't be tapped.** `span.pl-e` from the card link is on top, so only about 9 % of the 44 px heart receives the tap. A tap opens the place sheet instead of saving. | Phone, Tokyo default, tap the first card's heart. **Expected:** the place is saved. **Actual:** `#p-kanda-myojin` opens, 0 saved. Same at R5 (8 %); `w4.js` motion times out on it. | `gallery-lead-heart-w6.jpg` | FE-A (Gallery) + designer |
| QA-43 | Low | Eager JS sits **46 B** under the rounded gate and 465 B over a literal 40 KB (numbers above). The next small change to `city.js`/`views.js` breaks the budget. | — | `test-beta.js` budgets | FE-A (minify step, or gate on bytes) |
| QA-44 | Low | Singapore Chinatown lists **Nai Ek Roll Noodle** at Yaowarat, **Bangkok** (13.740, 100.510). The desktop Atlas fits that area at **zoom 6** over the Gulf of Thailand, with 15 Singapore pins stacked under "1". | Desktop, `Singapore/chinatown.html#view=atlas`. Same zoom at R5; live data, so out of beta scope. Now front and centre in map-first Atlas. | `desktop-Singapore_chinatown.jpg` | PM → live data owner |

Carried, Low: QA-26. PM call pending on record prose with prices and ratings.

**Why NO:**
- QA-36 regresses a check that passed at R5 (`views.js` deep-link matrix, G4 0 JS errors).
- QA-37 and QA-38 are High against the D2 and D11 acceptance criteria.

QA re-signs when, on a pinned SHA:
- `views.js` is back to 319/320;
- `w6.js` `--only phone` shows independent B-08 green with a half detent that shows a place;
- `w6.js` `--only axe` is 80/80.

QA sign-off: NO

## 2026-10-11 · QA · Wave 7 full pass · session_017FLWXa5zgGWvqNo4C3UsvH

**Tested SHA: `badcc20dbae7f4e4f47023048e85a58552cede24`**, pinned in a clean worktree (`git worktree add ../qa-r7 badcc20`). Nothing after it was measured. The W6 baseline for regressions is the R6 pin `2f22763`, measured in its own worktree with **the same `metrics.js`** (`metrics-gallery-W6pin-same-harness.md`), so every before/after pair below uses one harness.

**Gates** (on the pin, after `npm install --no-audit --no-fund`; `npm ci` still can't run, QA-39):
- validate ✅.
- `npm test` ✅: 552 PASS, 0 FAIL. Includes `check-google.py`, test-contract, test-honesty (rule-6 brand scan), test-imagery, test-fe-a and P-04.
- `beta:check` ✅: 179 pages, 84 place pages, 8,458 places, beta == live.
- Eager JS **28.1 KB gzip** on the heaviest page (cleveland.html), now gated unrounded at ≤ 40.0 KB.

**New QA harnesses** (no existing gate or test weakened):
- `tools/beta/qa/w7.js`: the W7 probe, independent of `metrics.js` and `atlas-ms.js`. It supersedes `w6.js` for Atlas, because the R6 tray that `w6.js` drives is retired. `w6.js` is left as it was.
- `tools/beta/qa/w7-photos.js`: a static photo and credit honesty audit, plus a contact sheet of every photo.
- `metrics.js` B-07: the map-search path, **added** (rule below).

Evidence is in `design/beta/eval/w7/qa/`: screenshots, JSON, `contact-*.jpg` and `logs/`.

### Ratification of the W7 rule changes

| # | Rule change (lane) | Verdict | Reason | Independent probe |
|---|---|---|---|---|
| 1 | `test-beta.js` "one marker per pinned place" counts `.leaflet-marker-icon.pp` label pins + bubble counts (Atlas) | **Ratified** | Same invariant, new selector. QA checks the partition, not only the sum. | `w7.js cluster`, phone, default zoom, 5/5: drawn ∪ clustered == pinned, overlap 0, lost 0, bubble sum == clustered, `.pp` in DOM == drawn. Cleveland 21 + 173, Tokyo 14 + 474, New York 21 + 487, Chinatown 16 + 0, Wheeling 1 + 34. |
| 2 | `test-fe-a.js` W6 tray checks replaced by W7 map-search checks (Atlas) | **Ratified** | Every retired tray check has a W7 counterpart that measures the same outcome: List adds one history entry and Back closes it; a pin selects exactly one card; Esc closes the preview; map-first with nothing over the map; the chip row holds the switcher. | `w7.js atlasm` 5/5: List → list, Back → map, still in Atlas. Pin → one selected card. Desktop preview: Esc closes. |
| 3 | `w2.js` mobile flow: the pin "peek" is the carousel holding the selected card (≤ 40 %); bubbles are tapped until a pin shows (Atlas) | **Ratified** | Same outcome: a pin shows its place in a bounded overlay and the map stays usable. Tapping a bubble is what a reader does. Note: the "Esc closes the pin sheet" assertion is now vacuous on phones (no sheet opens), so B-07 (row 12) carries the close and Back checks. | `w7.js atlasm` 5/5: a real touch on a reachable pin selects **its own** card, wholly on screen (y 708–832), with the pin marked `sel`. `w2.js` map 35/35. |
| 4 | `metrics.js` B-06 `split`: the map may sit on either side of the cards (Atlas) | **Ratified** | Same outcome: map and list side by side, with no overlap. The ≥ 40 % grade is unchanged, and `w7.js` grades the 58 %. | `w7.js atlasd` 5/5: map 60 %, left 0, reaches the bottom of the screen, 2-column grid. `metrics --view atlas` B-06 ✅ 5/5. |
| 5 | `w2.js` hubs: a lens link into Atlas reads the results header total, not the rendered cards (Atlas) | **Ratified** | The header is a true count. QA checked it against the cards a reader can actually page to. | `w7.js lens`: 38 landing-rail links × 3 ways (as shared, remembered Atlas view, `&view=atlas`) = **114/114**. Header == promise == cards reached via Show all + "Show 40 more", unique ids, 0 errors. Every lens link opens Atlas (implied view). |
| 6 | B-08 exempts the sticky city bar `.cbar` and the floating `.mappill`, as it exempts the site header (FE-A) | **Ratified** (to be implemented in `metrics.js` exactly as worded; until then QA grades it with `w7.js b08`) | Same outcome as the header exemption. Titles pass under a 70 px sticky bar and a 137 × 48 pill while scrolling, but none is covered at reading position. All Gallery B-08 hits are these two elements and nothing else (Cleveland 6, Tokyo 1, New York 6, Chinatown 6, Wheeling 3; W6 pin 0). | `w7.js b08`: every sampled title scrolled to the centre hit-tests to itself, 5 pilots × phone/desktop (16–48 titles each). Note: on the phone first screen the pill does cover the lead card's area · kind line (`gallery-tokyo-390-dark.jpg`); that line is not a title. |
| 7 | B-08 in phone Atlas treats a title beneath **its own scroll pane's sticky head** as clipped (FE-A) | **Rejected → QA-46 (High)** | It weakens the gate. Under this rule the R6 defect QA-37 (a 370 px sticky tray head covering the list, ~70 px of list visible) would have graded B-08 green. A title under a sticky head is covered, not clipped. Moot today (the tray is retired and the rule was never coded), but it must not be adopted. | W6 `w6.js` independent B-08 found 5/5 pilots covered. That is exactly the case this rule would exempt. |
| 8 | `w2.js` map probe skips the `.map-toggle` tap when `html.atlas-m` and the map is already on screen (FE-A) | **Ratified** | Same rule QA ratified for `metrics.js` B-07 in W6. The map is measured, not assumed: `fullMap` is still required. | `w2.js` map 35/35. `w7.js atlasm`: map box 92 % of the first screen. |
| 9 | Gallery cards hide `.pl-w`, `.pl-k`, `.pl-ad` (kept in the DOM, detail, Atlas rows, Guidebook) (FE-A) | **Ratified** | Nothing honesty-bearing is hidden. "Recommended by" stays on every card, and closures still read "Closed". Search and AT still see the text. | `w7.js gallery` 5 × 2: every visible card shows "Recommended by"/"Added by"; every closed place (e.g. Tokyo's Unicorn Gundam statue) reads "Closed" on its card. `metrics` G6 0 without; G1 ✅ 5/5. |
| 10 | `metrics.js` counts each URL once (platform) | **Ratified** | `ctx.route()` disables Chromium's cache, so repeats were double-counted. A real browser fetches a URL once per load. | `w7.js perf` counts unique URLs from response bodies. It matches `metrics.js` first load to the KB (Tokyo Gallery 652 / 940 KB both). |
| 11 | **D-38**: the budget is first-load transfer (no scroll, network idle + 2 s, gzip for text), gated ≤ 2.0 MB on desktop **and** phone@3×; whole-session bytes as information (platform) | **Ratified** | This is how W6 QA itself measured the budget (`w6.js` first-load bodies), and how ROUND-1 framed it. It adds a gate: before W7 the `metrics.js` bytes row was information only. It also adds phone@3×. **Condition:** tile bytes are off-origin and excluded (stubbed or blocked in every harness), so the row must say so. QA records the tile count: Tokyo Atlas loads 44 tiles (desktop) and 27 (phone). At a typical ~20–25 KB per OSM tile that adds ≈ 0.6–1.1 MB, which still keeps Tokyo Atlas under 2.0 MB. | `w7.js perf` (below). |
| 12 | **B-07 rewritten for map-search** (QA; specified here, implemented in `metrics.js` as an addition) | **New rule** | **B-07 (W7):** the map is up (phones: at load in Atlas, or after the map pill elsewhere), and the visible map/list control is ≥ 44 × 44. A real tap on a reachable pin, its label hit-testing to itself (a bubble is tapped to zoom in when no pin is in reach), shows **that** place: its own card, selected and wholly on screen in the carousel, with no sheet over the map. One tap on that card opens the detail with a visible Close. Esc closes it. Re-opened, Back closes it, and the reader is still in Atlas on the same page. The row passes on the W6 path (pin sheet: Close, Esc, Back) **or** the complete W7 path. Nothing in the W6 path is relaxed, and the W7 path has one more step. | `metrics.js` B-07 ✅ 5/5 in Gallery and in Atlas. Before this change, Tokyo read "pin sheet none" (all pins clustered), and on the W6 pin `metrics.js` gave New York ❌ "pin sheet none". `w7.js` grades the same rule independently: desktop pin → preview naming the place → detail → Esc → Back, 5/5; phone pin → own card → detail → Esc → Back, 5/5. |
| 13 | **B-04** (rail on the first phone screen) in Atlas under map-search | **Ratified as by design** (D-36 carried) | B-04 keeps grading the default view (Gallery). In map-search Atlas there is **no** rail on the phone, in map or list. The collection lenses (e.g. Anime, Free) are one tap away under Filters, but "A day in …" and "For you" have no entry point in Atlas: **QA-57**. | `w7.js atlasm` B-04 recorded `false` on 5/5. Filters tray contents probed on Tokyo phone and desktop. |

Out of scope for ratification but recorded: `test-beta.js` tightened its Gallery and deep-link stamping limits (24 live; a deep link stamps only its card), and `test-contract.js` now also scans the client source for `localStorage` outside try. Both are stricter.

### W7 acceptance (W7-BRIEFS, every lane and both amendments)

**Atlas map-search (Amendment 2): `w7.js atlasd/atlasm`, 5 pilots, plus `atlas-ms.js` 98/98**

Desktop 1440 × 900, 5/5:
- ✅ Map 60 %, on the left, full height.
- ✅ 2-column image-first grid.
- ✅ Zoom and pan change the count, with "N more outside this area" offered (Tokyo 435 → 198 → 161).
- ✅ "Show all" + "Show 40 more" lists every place exactly once (194/488/508/16/35).
- ✅ Real-mouse hover works both ways: card → pin `hot`, pin → card `is-hover`.
- ✅ A pin click puts its card in view in the list pane, and the window never scrolls.
- ✅ Pin → preview naming the place → detail.
- ✅ OSM attribution: visible at 12 px, hit-tests to itself, clear of every control.
- ✅ 0 JS errors.

Phone 390 × 844, 5/5:
- ✅ The map is 92 % of the first screen; 69 % stays uncovered by the chip row and the carousel.
- ✅ The city is named on the first screen (QA-40).
- ✅ The List pill is ≥ 44 × 44, with no horizontal overflow.
- ✅ Pin → own card in the carousel → detail.
- ✅ A carousel swipe selects the centred card and marks its pin.
- ✅ List → image-first list; Back → map.
- ✅ OSM attribution sits clear of the pill, the carousel and the chip row.
- ❌ **QA-52**: carousel photo credits are clipped.

Reachability:
- ✅ `#view=atlas&p=` opens the detail for **every** place with Atlas kept: 1,241 × phone + desktop, 0 misses.
- ✅ Search by name: 25 samples per pilot.
- ◐ Search: one exception, the off-map outlier (**QA-54**).
- ❌ **QA-45**: the `metrics.js` G1 "scroll to every place" hard gate regressed in Atlas.

Map library blocked:
- ✅ 5 × 2: "Map unavailable right now — every place is listed here."
- ✅ A card is on screen.
- ✅ Every place is pageable.
- ✅ 0 JS errors.

Storage throws:
- ✅ 5 × 2: Atlas and the map render.
- ✅ The base switch goes to Satellite.
- ✅ Must see → `t=1`.
- ✅ The List pill works.
- ✅ 0 errors.

Tiles:
- ✅ Only `tile.openstreetmap.org` (25,585 requests) and `server.arcgisonline.com` (191).
- ✅ `check-google.py`.

**Cards, motion and detail (FE-A): `npm run beta:probe:fe-a` 33/33**
- ✅ Credits are never ellipsised in Gallery or the detail (6 cases).
- ✅ Phone `#p=` deep link holds 2,204–2,322 nodes for 3 s.
- ✅ The sheet count reads "7 of 488 in this Gallery view".
- ✅ The card face has no repeated area and no dangling separator.
- ✅ Motion: 1 view transition at `--dur-grow` 340 ms. Under reduced motion: 0 transitions, 0 animations, 0 ms.
- ✅ Grid columns are 1 / 2 / 3 / 4 at 390 / 768 / 1024 / 1440, borderless (border 0, no shadow), media 16:10 / 4:3, heart on every card.
- ✅ Place detail on 5 × 2: the photo fills its slot with `object-fit: cover` (no letterbox).
- ✅ The sticky Save · Directions · Share bar stays on screen when the detail scrolls, with 48 px buttons.
- ✅ Esc closes the detail; Back closes it and stays on the page.
- ❌ **QA-50**: the detail shows a wrong rank count.
- ❌ **QA-51**: the desktop detail photo is upscaled.

**Landing and hubs (FE-B)**
- ✅ Hub hero photo first on phones, one primary CTA ("See all 5 guides"), short credit under it (`hub-japan-390-light.jpg`).
- ✅ The Japan "Known for" line is built from the guides' signatures (Edomae sushi · Okinawa soba · jingisukan).
- ✅ No hub hero file is reused as a card on the same page (`w7-photos.js`, server-rendered).
- ✅ `w2.js` hubs: 70 tiles, signature lines; landing editorial rail 38/38.
- ✅ Landing first load 731 KB desktop / 559 KB phone@3×.
- ❌ **QA-49**: B-05 regressed.

**Imagery (D9).** 131 credit rows: 37 heroes and 94 cards. Licences: CC BY-SA 4.0 ×47, 3.0 ×22, 2.0 ×10, 1.0 ×3; CC BY 2.0 ×17, 3.0 ×4, 4.0 ×4, 2.5 ×3; PD ×13; CC0 ×8.

`w7-photos.js` passes 12 of 13 checks:
- ✅ Every licence is free, and every licence URL is its CC deed.
- ✅ Every source is the Commons File: page of its title.
- ✅ Every file and variant exists.
- ✅ No Commons file appears in two rows (title or sha1).
- ✅ No photo on a food place, a venue (bar/shop/market/mall/hawker/theatre/arena/nightlife/stadium/music tags), a closed place, or anything in Vietnam. Vietnam pages show only other countries' cards.
- ✅ Every server-rendered photo `<img>` across 179 pages is followed by its own credit: author, licence deed link and File: page link.
- ❌ **QA-56**: the author field is not a clean name (author check).

Visual review of **every** photo (37 heroes + 94 cards, `contact-0…5.jpg`):
- Most truly show their place.
- ❌ **QA-53**: some don't, or are flagged under the brief's rules.

Other imagery results:
- ✅ `test-imagery.js` passes in `npm test`.
- ✅ Credits are whole in Gallery and the detail (FE-A probe).

**Type: `w7.js type` 19/19**
- ✅ Bricolage Grotesque and Inter draw every letter on all 4 Vietnam pages (Ho Chi Minh City: 47 Vietnamese characters), the 5 pilots, the landing and the Japan hub, with **no** fallback glyph.
- ✅ CJK falls back to a CJK system face (IPAGothic 603/603 on Tokyo).
- ✅ The "ō" macron is drawn at DPR 1, 18 and 24 px, in both faces (`type-macron-vn-cjk-dpr1.jpg`).
- ✅ 2 families and 7 subset woff2 files, all `font-display: swap`, OFL texts committed, no font service. Tokyo first load fetches 88 KB of fonts.

**Accessibility: `w7.js a11y`, 104 rows** (4 views × 5 pilots × phone/desktop × light/dark, plus the landing and 5 country hubs × 2 × 2)
- ✅ **Axe serious/critical = 0 on all 104** (QA-38 fixed: Insights 20/20).
- ✅ `metrics.js` B-23 contrast AA is 0/0 in light and night on every pilot and the landing, B-20 is 0 targets under 44 px, and M1-16 focus is 30/30.
- ✅ Focus: `w7.js`'s ring heuristic flags only `#cleo-filter`. That is a false positive: its pill shows a 2 px ink ring via `:focus-within`.
- ✅ Targets: the heuristic's flags are Atlas card-name links (the whole card is the link, checked by hit-test), desktop stickers at 28 px (desktop), and the ratified Guidebook and Insights exemptions.
- ❌ **QA-55**: body text under 16 px.

**Budgets (`w7.js perf`, independent, run alone; D-38 first load, each URL once, gzip for text)**

| Page | Desktop 1440: transfer (raw) | Phone 390@3×: transfer (raw) | FCP 4×, median of 3 (desktop / phone) | DOM at first load | Tiles requested (stubbed) |
|---|---|---|---|---|---|
| Tokyo default (Gallery) | **652 KB** (1,696) | **940 KB** (1,984) | 268 / 268 ms | 2,855 / 2,254 | — |
| Tokyo Atlas | **612 KB** (1,757); tiles blocked 612 | **900 KB** (2,045); tiles blocked **1,020** | 332 / 304 ms | **2,693 / 2,616**; blocked 2,422 / 2,453 | 44 / 27 |
| Landing | **731 KB** (1,057) | **559 KB** (885) | 448 / 404 ms | 1,836 | — |
| Japan hub | **439 KB** (701) | **705 KB** (967) | 300 / 316 ms | 575 | — |

All ✅: ≤ 2.0 MB (2,000,000 B), FCP 4× ≤ 1.0 s, Tokyo Atlas ≤ 3,000 nodes, eager JS 28.1 KB ≤ 40 KB, axe 0. `metrics.js` agrees (Gallery initial 652 / 940, Atlas 612 / 1,020).

Whole-session bytes, for information (`metrics.js`, every probe and stress loop, each URL once): Tokyo Gallery 3,423 KB, Cleveland 1,735 KB, landing 1,603 KB.

### Re-test of the R6 findings

| ID | Status on `badcc20` | Evidence |
|---|---|---|
| QA-36 `_leaflet_pos` | **Fixed** | `repro-qa36.js` 0/20. `views.js` 319/320 (the one FAIL is the known record-prose INFO, as at R5). 0 JS errors in every `w7.js` Atlas load, tiles stubbed or Leaflet blocked. |
| QA-37 370 px tray head | **Fixed (tray retired)** | `metrics --view atlas` B-08 0 on 5/5; `atlas-ms.js` independent B-08 for carousel and list ✅. The rule that would have hidden it is rejected (QA-46). |
| QA-38 Insights axe | **Fixed** | Axe 0 serious/critical on all 20 Insights rows. |
| QA-39 workflow `npm ci` | **Fixed** | `beta-fetch-unsplash.yml:56` runs `npm install --no-audit --no-fund`. Runs #11–#19 landed photos (BETA-LOG). |
| QA-40 city not named | **Fixed** | City named on the first phone screen, 5/5 (header crumb). |
| QA-41 bubbles read as ranks | **Fixed** | At default zoom, pins are light pills carrying their number (★ for Must see); clusters are dark round count bubbles (`atlas-390-cities_tokyo.jpg`). |
| QA-42 lead-card heart | **Fixed** | A real tap on the lead card's heart saves it (`aria-pressed=true`, no sheet) on 5/5. The 44 × 44 button receives 82–84 % of its box. |
| QA-43 eager JS headroom | **Fixed** | 28.1 KB gzip, gated unrounded at 40.0. |
| QA-44 Chinatown fit | **Fixed for the fit** (phone zoom 15). The Bangkok record stays a live-data issue (PM), and it now surfaces as QA-54. | `w7.js cluster` |

### No regression (vs W5 full pass, R5 follow-up and W6 pass)

| Check | Result |
|---|---|
| `w5.js` | ✅ **64/64** |
| `views.js` | ✅ **319/320** (the known record-prose INFO only; QA-36 gone) |
| `w2.js` | ✅ map + hubs **39/39**, everything else **179/179** (For you, day, near, saved, ★, DOM, OG, a11y on hubs, storage). QA-26 is no longer reproduced. |
| G1 on the Gallery default | ✅ 5/5 (deep 194/488/508/16/35, search, scroll, no-JS) |
| B-01 / B-03 first-screen rules (W5) | ✅ B-01 0.42–0.64 (W6 0.50–0.56), B-03 7–9 (W6 7), both within the ratified ≤ 1.0 / ≤ 14 |
| `metrics.js` Gallery, same harness, W6 pin → W7 | Cleveland 22 → 21, Tokyo 22 → 19 (20 after the B-07 bubble step, re-run `--only cities/tokyo`), New York 21 → 22, Chinatown 21 → 22, Wheeling 22 → 22 of 25. Landing 11 → 10 of 11. ❌ regressions: **QA-47** B-02, **QA-48** B-04 Tokyo, **QA-49** B-05. B-08 hits are the ratified exemption (row 6). |
| `metrics.js` Atlas | 21–23/25. ❌ **QA-45** G1 (hard gate) on Cleveland, Tokyo and New York, which was ✅ in W6. B-04 by design (row 13). |

### Design-conformance checklist D1–D13

| Row | State on `badcc20` | Evidence |
|---|---|---|
| D1 four views | ✅ | `views.js` 319/320, `w5.js` 64/64, P-04 in `npm test`; `#view=` links reproduce the view (lens × 3 ways). |
| D2 Atlas map-search | ◐ | All Amendment 2 acceptances ✅ (above, `atlas-ms.js` 98/98, `w7.js` 107/111 Atlas checks). Open: QA-45 (G1 regression), QA-52, QA-54, QA-57. |
| D3 Gallery | ◐ | Rows + All N grid, lead card on the first phone screen (B-01 ✅), covers vary by kind, deep links land (G1 ✅). Open: QA-47, QA-48. |
| D4 Guidebook | ✅ | Unchanged behaviour; axe 0; `views.js` ✅. |
| D5 Insights | ✅ | Axe 0 (QA-38 fixed); table fallback and 44 px hit areas as ratified. Its small prose is counted under D13 (QA-55). |
| D6 type | ✅ (QA scope) | Self-hosted OFL Bricolage + Inter; Vietnamese, macrons and CJK verified. Sub-scores belong to the evaluator. |
| D7 tokens | Not measured by QA | (evaluator; FE-A reports tokens-only CSS) |
| D8 luxury × fun | Not measured by QA | (evaluator) |
| D9 photos | ◐ | 131 credited Commons photos shipped keylessly; TASL and licence honesty ✅. Open: QA-53 (subjects), QA-56 (authors), QA-51 (detail resolution). |
| D10 honesty | ✅ | Every place kept (beta == live 8,458); attribution (G6 0 without); closures flagged (B-12, contract, the "Closed" card check); brand scan clean on every page; no `document.write`; no CDN; OSM/Esri only. Rule-6 slips in committed **docs** are QA-58 (Low). |
| D11 perf + a11y | ✅ | Budgets above; axe 0/104; B-23 AA 0/0 light and night; B-20 0; focus 30/30. |
| D12 modern-minimal, marketplace-grade | ◐ | Structure ✅: compact sticky city bar with a search pill, category icon bar with underline, borderless image-first 1/2/3/4 grid with a heart, floating map pill, detail with large media, hairline sections and a sticky action bar. Night hero, particles, gold plates and purple tiles retired (0 found). Open: QA-49 (landing first screen), QA-51 (soft detail photo), QA-59 (layout nits). Palette and clarity scores belong to the evaluator. |
| D13 Gen Z × every generation | ◐ | Expressive display + legible text face, heart pop and the grow motion (reduced-motion safe), sources always visible. Open: QA-55 (prose under 16 px). Sub-scores belong to the evaluator. |

### Findings

| ID | Sev | Finding | Steps → expected vs actual | Evidence | Owner |
|---|---|---|---|---|---|
| QA-45 | **High** (regression, hard gate) | **Atlas G1 "every place reachable by scrolling" fails.** The Atlas list pages by 40 (map area, or the whole lens after "Show all"). Reaching every place takes "Show all" plus up to 12 "Show 40 more" taps (Tokyo). Gallery solved the same trade-off in W5 with one "Show all N on one page" tap; Atlas has no equivalent. | `metrics.js --view atlas`. **Expected:** G1 ✅, as on the W6 pin. **Actual:** "scrolled 42 / 43 / 264" of 194 / 488 / 508 (Cleveland, Tokyo, New York): HARD-GATE FAIL. Deep links (100 %), search and the pager do reach everything (`w7.js`), but a 12-tap pager is not the ratified one tap + scroll. Fix: a one-tap "Show all N in one list" in Atlas (DOM grows only on request, as in Gallery), or bring a reach rule to QA that measures the same outcome. | `logs/metrics-atlas.log`, `metrics-atlas.md` | Atlas |
| QA-46 | **High** (rule) | **FE-A's proposed B-08 rule for phone Atlas is rejected.** "A title beneath its own scroll pane's sticky head counts as clipped" would have graded QA-37 green. Not implemented in any gate. | Do not adopt it. A title under a sticky head is covered. No product change is needed while the tray stays retired; it is listed so that the rule is not merged later. | Ratification row 7 | FE-A |
| QA-47 | Med (regression, blocks sign-off) | **Gallery B-02 masthead is over 0.6 of the phone screen** on Cleveland and Tokyo: 513 px > 506. The W7 quiet hero with the 3:1 photo strip and its two-line credit is taller. | Phone, the default view. **Expected:** ≤ 506 px, as on the W6 pin (429 / 407). **Actual:** 513 / 513. New York 468 ✅. | `metrics-gallery.md` vs `metrics-gallery-W6pin-same-harness.md` | FE-A |
| QA-48 | Med (regression, blocks sign-off) | **Gallery B-04 Tokyo: the category bar starts below the first phone screen**, at 859 px > 844. It moved under the lead card in W7. | Phone, Tokyo default. **Expected:** on the first screen, as on the W6 pin (800). **Actual:** 859. The count is still 4/5 (Chinatown now passes), but Tokyo's cell regressed. | same | FE-A |
| QA-49 | Med (regression, blocks sign-off) | **Landing B-05: no city card is wholly above the phone fold.** The search-first hero, the country pills and the row header push the first cards to y ≈ 522, and the cards are taller than the space left. | Phone 390, the landing. **Expected:** ≥ 2 cards (W6 ✅ 2). **Actual:** 0. | `landing-390-light.jpg`, `metrics-gallery.md` | FE-B |
| QA-50 | Med | **The detail's rank line is wrong on a deep link:** "No. 2 of 1 in Jōhoku" (data: 2 of 37); Cleveland "No. 3 of 1" (3 of 52); New York "No. 15 of 24 in Manhattan" (15 of 264). `sheet.js` counts the stamped `li.pl` in the area. Since W7, a deep link stamps only its own card. | Open `cities/tokyo.html#p=asukayama-park`. **Expected:** "No. 2 of 37". **Actual:** "No. 2 of 1". A false fact in our own copy. Use the area count from the page data (`stats.perArea`), as "n of N" now does. | `detail-390-cleveland.jpg`, `logs/w7-func.log` | FE-A |
| QA-51 | Med | **The desktop detail photo is upscaled about 2×.** `sheet.js` copies the card's `img` with the card `sizes` (`… 25vw`), so the 1,024 px media slot shows the 500 w file. | Desktop 1440, `#p=` any photo place. **Expected:** the 960 w file or larger, not a soft image. **Actual:** `currentSrc` `…-500.jpg` at 1,024 CSS px, on 5/5 pilots (`detail-1440-top-tokyo.jpg` is visibly soft). | `logs/w7-func.log` | FE-A (+ imagery for the widths) |
| QA-52 | Med | **Phone Atlas carousel credits are clipped.** The `figcaption` renders in a 4 px wide column inside the 104 × 104 thumb: "Photo:" and part of an author name show over the photo, and the rest is cut. | Phone, `#view=atlas`. **Expected:** a whole credit under the media, or the © link as the visible credit with the caption hidden (brief: credit visible and never clipped). **Actual:** 4/5 pilots (Chinatown has no carousel photo). The grid and the phone list are fine. | `atlas-390-cities_tokyo.jpg`, `w7-atlasd-atlasm.json` | Atlas |
| QA-53 | Med | **Some photos don't show their place, or break the fetch rules.** Not the place: **Tokyo Tower** (tour buses and people), **Rockaway Beach & Boardwalk** (construction site), **MoMA** (a delivery van in the street), **Nihonbashi Bridge** (a Hiroshige woodblock print, not a photograph of today's bridge). Weak or flagged: Dia Beacon (lawn, no building); Rockefeller Center (blurred night close-up); Cuyahoga Valley NP (a weir close-up); Ueno Park (dead lotus close-up); Gōtoku-ji (figurines close-up); Meadowcroft (rock close-up); Pennsylvania Trolley Museum (equipment); Cleveland Museum of Art ("OPEN" banner dominates). Heroes, grey or overcast: Kyoto (white sky), Orlando, Madison, Ghent, Hokkaido; Erie (hazy). Akron is a highway and parking deck. No near-duplicate hero pair. | Visual review of all 131 (`contact-*.jpg`). **Expected (IMAGERY / brief):** the photo truly shows the place; no close-ups, equipment or signage; no overcast heroes. **Actual:** above. Swap or drop them; a dropped photo leaves the calm cover. | `contact-1…5.jpg` | imagery |
| QA-54 | Med | **Atlas search can show "0 places in this map area" for an exact name.** A matching place outside the first fit stays filtered out by the map area. | `Singapore/chinatown.html#view=atlas`, search "Nai Ek Roll Noodle". **Expected:** the match shown, with the map fitted to the results, as a lens deep link does. **Actual:** "0 places in this map area · 1 more outside this area. Show all 1" (phone and desktop). Reachable with one more tap, but it reads as "not found". | `atlas-1440-search-outlier-chinatown.jpg` | Atlas |
| QA-55 | Med | **Prose under 16 px** against D13 (body ≥ 16 px for every generation): Insights subtitles (14 px) and footnotes such as "Citations, not places: …" (12 px); the city facts line (14 px); Guidebook chapter facts (14 px); card write-ups where shown (14 px). The detail prose is 17 px ✅. | Any pilot. **Expected:** ≥ 16 px for sentences people read. **Actual:** 12–14 px (`w7-a11y.json` `smallBody`). | `logs/w7-a11y.log` | designer + FE-A |
| QA-56 | Low | **Author fields that are not clean names:** "User:LimoWreck" (Ghent hero), "User:Piotrus" (Zōjō-ji), "J. Miers - User: (WT-shared) Jtesla16 at wts wikivoyage" (A Christmas Story House, shown in full in the detail), "Petri Krohn (English Wikipedia)" (Chrysler Building). | `w7-photos.js` author check. Credit the person as the source page names them, without wiki markup. | `logs/w7-photos.log`, `detail-390-cleveland.jpg` | imagery |
| QA-57 | Low | **No entry point to "A day in …" or "For you" from Atlas.** The collections rail is not rendered in phone or desktop Atlas, and Filters carries the collection lenses but not the day plans or For you. Day routes still draw from a `#day=` link (`w2.js` day ✅). | Atlas, look for a day plan. **Expected:** the brief's "day routes drawn on the map" reachable from the Atlas UI. **Actual:** only via another view or a link. | Tray probe in this run | Atlas |
| QA-58 | Low | **Rule 6 in committed docs:** a real-estate brand is quoted in `W7-BRIEFS.md:187` and `BETA-LOG.md:865` (the owner's message, verbatim); a home-rental brand in `DESIGN-SYSTEM.md:93` and `BETA-DECISIONS.md` D-09; a booking brand in `BETA-DECISIONS.md`. The page scan (test-honesty) is clean. These are docs, so the owning lanes should paraphrase them. | `grep -i` over files changed since `2f22763` | orchestrator (+ designer for DESIGN-SYSTEM) |
| QA-59 | Low | Layout nits: (a) a desktop Atlas card's 2-line name clamp lets a third line (the native name) peek over "Recommended by" (Tokyo "Katsushika Shibamata Tora-san Museum"); (b) the phone detail meta row runs off the right edge ("… Ohio City & Tremont · pin"); (c) desktop category-bar labels are ellipsised ("Anime, Manga & P…", "UNESCO World He…"); (d) the detail's "Read" chevron wraps onto its own line; (e) the Japan hub copy says "each driven to New York density" (internal jargon). | Screenshots as named | `atlas-1440-preview-cities_tokyo.jpg`, `detail-390-cleveland.jpg`, `gallery-tokyo-1440-light.jpg`, `detail-1440-cities_tokyo.jpg`, `hub-japan-390-light.jpg` | FE-A (a–d), FE-B (e) |

Carried: the PM call on record prose with prices and ratings (the `views.js` INFO).

**Why NO:**
- QA-45 regresses a hard gate (G1 in Atlas) that passed in W6.
- QA-46 is a High (a proposed rule that weakens B-08).
- QA-47, QA-48 and QA-49 each regress a `metrics.js` cell that was ✅ on the W6 pin with the same harness.

QA re-signs when, on a pinned SHA:
- `metrics.js --view atlas` shows G1 ✅ on 5/5;
- `metrics.js` Gallery shows B-02 ✅ on 5/5, B-04 ✅ on Tokyo, and B-05 ✅ on the landing (or the owning lane brings a re-measured rule that QA ratifies, as in W5);
- QA-50 and QA-52 pass in `w7.js --only detail,atlasm`.

QA sign-off: NO

## 2026-10-11 · QA · R7 re-sign check (QA-45 reported fixed) · session_017FLWXa5zgGWvqNo4C3UsvH

**Tested SHA: `63805e3e681ea60da1ce78326d302812717c2c9b`** (branch head, pinned in the clean `qa-r7` worktree).

Gates:
- validate ✅.
- `npm test` ✅: 565 PASS.
- `beta:check` ✅: 179 pages, 8,458 places, beta == live.
- Eager JS: 28.8 KB gzip.

Logs, and the full per-issue state, are in `design/beta/eval/w7/qa/register-63805e3e/` and `docs/BETA-ISSUES.md`.

| Re-sign row (from the W7 pass) | Result on `63805e3e` |
|---|---|
| `metrics.js --view atlas` G1 ✅ 5/5 (QA-45) | ✅ 5/5: scrolled 194/488/508/16/35, deep 100 %, search 100 %, no-JS 100 % (a852a4e1) |
| Gallery B-02 ✅ 5/5 (QA-47) | ❌ Cleveland 513, Tokyo 513 (FE-A's fix b244f104 is not on the branch) |
| Tokyo B-04 ✅ (QA-48) | ❌ top 859 (same) |
| Landing B-05 ✅ (QA-49) | ✅ 2 (d1790787) |
| QA-50 in `w7.js --only detail` | ❌ **re-opened**: a fresh `#p=` load now reads "No. 37 of 37 in Jōhoku" (the data says 2 of 37) and "No. 52 of 52" on Cleveland. The count N is fixed; the rank k comes from `Cleo.defer.order()`, where the deep-linked card sits last. After load the same sheet reads "No. 2 of 37". |
| QA-52 in `w7.js --only atlasm` | ✅ credits whole on the carousel and the list, 5/5 |

New on this head:
- **QA-60** (Med, regression): Gallery B-04 Wheeling, the category bar starts at 852 px (it was 687 on `badcc20`).
- **QA-61** (Low): the phone Atlas search input is 52 × 42 px (B-20 ❌ on 5/5 pilots). It has been present since `badcc20`, and I missed it in the R7 write-up.

Verified as fixed:
- QA-45, QA-49, QA-51, QA-52, QA-54 and QA-56;
- QA-53 for the routed photos;
- QA-58 for the named lines;
- QA-59e;
- R7-g7;
- the platform's B-08, D-38 and B-06/07/09 implementations.

Axe still reports 0 serious/critical. `atlas-ms.js` 117/117, `beta:probe:fe-a` 33/33, `beta:probe:fe-a:w8` 44/44, `beta:qa:w8p` 4/4.

**Why NO:** QA-47, QA-48 and QA-60 regress cells that were ✅ on the W6 pin or on `badcc20`. QA-50 fails its re-sign row.

QA sign-off: NO

## 2026-10-11 · QA · R7 re-sign on the orchestrator's pinned SHA · session_017FLWXa5zgGWvqNo4C3UsvH

**Tested SHA: `dd2125e3be6769c776aa1633ed96b17db69181d8`**, in a clean worktree. It contains `63805e3e`, FE-B's c5cfce4d, d979b3e9 and 08289aa7, and Atlas's 7fef2dec. It does **not** contain FE-A's b244f104 or 6733a233.

Gates:
- validate ✅.
- `npm test` ✅.
- `beta:check` ✅.

Evidence: `design/beta/eval/w7/qa/resign-dd2125e3/`.

| Re-sign row | Result | Owner |
|---|---|---|
| Atlas G1 5/5 (QA-45) | ✅ 5/5 | Atlas FE-1 |
| Gallery B-02 5/5 (QA-47) | ❌ Cleveland 513, Tokyo 513 (New York 468, Chinatown 492, Wheeling 489) | FE-A |
| Tokyo B-04 (QA-48) | ❌ top 859 | FE-A |
| Landing B-05 (QA-49) | ✅ 2 | FE-B |
| QA-50 (`w7.js --only detail`) | ❌ a fresh `#p=` load reads "No. 37 of 37 in Jōhoku" (data: 2 of 37) and "No. 52 of 52" (Cleveland, 3 of 52) | FE-A |
| QA-52 (`w7.js --only atlasm`) | ✅ credits whole on 5/5; B-07 real pin tap ✅ | Atlas FE-1 |
| QA-54 (search refit) | ✅ Chinatown search 16/16, phone and desktop | Atlas FE-1 |
| No regression | ❌ QA-60: Wheeling B-04 top 852 (badcc20: 687) | FE-A |

Register state on this SHA: **0 open High/Blocker**. The rows above that fail are Med regressions or a factual error. They block the sign-off under ROUNDS-6-9's rule that QA must not sign a deploy that regresses a ✅ row.

QA sign-off: NO

## 2026-10-11 · QA · Ratification addendum: D-40 and the D-39 check · session_017FLWXa5zgGWvqNo4C3UsvH

Head `8e526c48`.

| Rule | Verdict | Reason | Probe |
|---|---|---|---|
| **D-40**: on phones at ≥ 2.5 dppx, card and rail thumbnails take the 500w copy (`sizes` capped at 166px); heroes, Guidebook figures, 2× phones, tablets and desktop are unchanged (platform; designer ratified) | **Ratified, with a condition** | No QA gate measures image density, so the cap weakens no gate. It is the R7 gap-7 acceptance ("never a 960w photo for a slot under 200 CSS px"). The cost is real but bounded: 3× phone cards drop from about 2.7 to 1.5–1.7 image px per CSS px, and the designer reviewed the crops. **Condition:** the next photo re-fetch adds a ≈ 720w copy so the cap can become a true 2×. The budget then still holds (D-38). | Browser at 390@3×, Tokyo: cards 500w at 289–326 px = 1.53–1.73; hero 960w = 2.94. `beta:qa:w8p` 4/4 (first load 591 / 553 KB). |
| **D-39** (ratified by the orchestrator): verify FE-B's note test | **Guidebook ✅, detail ❌ → QA-65** | `test-views-b` passes. QA's own regex finds 192 records quoting a figure, and all 192 carry the note. The detector also labels 43 wording-only records, which errs on the safe side. The place detail, which D-39 says reads the same field, never shows the note. | `npm test`; Tokyo Guidebook 2/2 notes in the browser; `#p=tempura-abe-honten` shows "¥1,500–9,000" with no note |

New finding **QA-65** (Med, honesty) · FE-A (`sheet.js`), with FE-B as the D-39 owner: the place detail shows quoted prices and ratings without the dated note.

## 2026-10-16 · QA · R7 re-sign on be74c82f · session_017FLWXa5zgGWvqNo4C3UsvH

**Tested SHA: `be74c82f2680009c726ac8ac54731ef97773dfb8`**, in a clean worktree. Using `merge-base --is-ancestor`, QA checked that it contains FE-A dbd6d87d, b244f104, 6733a233, the gap-2, 3 and 5 commits, and FE-B 20e9a8e7.

Gates:
- validate ✅.
- `npm test` ✅.
- `beta:check` ✅: 180 pages, 8,577 places, beta == live.

Evidence is in `design/beta/eval/w7/qa/resign-be74c82f/`.

**Test edits since the last pin**, read and accepted:
- The "No. k of n" test now requires k to equal the data's rank, including on a fresh deep link. That is stricter.
- Two casing edits match ★ display labels without case, because labels are now sentence case. They check the same totals.

| Re-sign row | Result |
|---|---|
| Atlas G1 (QA-45) | ✅ 5/5 (Gallery G1 also ✅ 5/5) |
| Gallery B-02 (QA-47) | ✅ 5/5: 482 / 482 / 458 / 482 / 458 |
| Tokyo B-04 (QA-48) | ✅ top 482 |
| Wheeling B-04 (QA-60) | ✅ top 458 |
| Landing B-05 (QA-49) | ✅ 2 |
| QA-50 rank on a fresh `#p=` load | ✅ 5/5, phone + desktop |
| QA-52 carousel credits, B-07 real pin tap | ✅ 5/5 |
| QA-54 search refit | ✅ 8/8 |
| QA-65 D-39 note in the detail | ✅ |
| Casing | ✅ |
| QA-66 B-23 (probe fixed: painted `pointer-events:none` layers are hit-tested for the reading) | ✅ light 0/0, night 0/0 on 6/6 pages, Gallery + Atlas |
| **No regression** | ❌ **QA-69**: Gallery B-07 "toggle none" on 4/5 pilots. The phone map pill is hidden at load and while scrolling down (FE-A 7c70e821). It was ✅ on dd2125e3 and b5f0afa1. |
| Register open High/Blocker | ❌ **1**: QC-01 (FE-B, Insights dish bars all open `cz=SUSHI`) |

Also recorded:
- **QA-68**: a `metrics.js` B-08 artefact in phone Atlas (one title straddling the scrolled list pane's edge). 0/90 titles are covered at reading position.
- **QA-67**: the desktop detail photo matte, Low, still present.
- **QA-61**: phone Atlas search 52 × 42, Low, still present.

**Ratification:** the QA-66 probe fix to `metrics.js` `bgOf` measures what is actually painted under text, and nothing is exempted. A `pointer-events:none` layer above text now counts as covering it, so the change is stricter where it applies.

QA sign-off: NO
