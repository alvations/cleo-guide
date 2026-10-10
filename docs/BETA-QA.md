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
