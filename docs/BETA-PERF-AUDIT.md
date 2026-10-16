# Beta performance audit (build, data, caching, CI and front end)

**Owner request (2026-10-11):** "all the backend and application front end optimization, and keep the audit trail on all of them". Platform lane.

Every item has these parts:
- the measured **before**;
- the **change**;
- the measured **after**;
- the **commit**;
- the **probe** that proves it.

Each item is mirrored as a `PERF-NN` row in [`BETA-ISSUES.md`](BETA-ISSUES.md). The QA lane verifies those rows.

There is no server, so "backend" here means the build and data side.

**Measurement conditions, unless a row says otherwise:**
- local Chromium (the pre-installed Playwright) with a **4× CPU throttle**;
- phone 390×844 @3× (touch) and desktop 1440×900;
- every off-origin request blocked, with map tiles answered by a 1×1 PNG;
- medians of 3 runs.

**Targets (owner):**
- LCP ≤ 2.0 s and CLS ≤ 0.05 at phone@3×, 4× CPU;
- INP ≤ 200 ms on the main interactions (open a place, switch view, filter, pan Atlas).

**Probes:**
- `npm run beta:perf` (`tools/beta/qa/perf.js`): load LCP/CLS/TBT on the 5 pilots, the landing and two hubs, plus INP on Tokyo's main interactions. Its latest output is in `design/beta/eval/perf/perf-after.{txt,json}`.
- `npm run beta:qa:w8p` (`tools/beta/qa/w8-platform.js`): photo sizes per slot and Tokyo's phone first load.

## Summary

| Id | Area | Before | After | Status |
|---|---|---|---|---|
| PERF-01 | `npm test` wall time | 392 s (serial) | **110–154 s** (4-job pool, same 13 suites) | fixed |
| PERF-02 | `npm run beta` / `beta:check` | 5.6 s / 5.3 s, deterministic | unchanged (measured; no change needed) | no change |
| PERF-03 | INP: collection filter (Tokyo Gallery) | phone 960 ms, desktop 1,064 ms | phone **≈ 450–520 ms**, desktop **≈ 580 ms** | partly fixed; rest = PERF-08 |
| PERF-04 | First "open a place" download | Tokyo 104 KB gzip (+ a 430 KB parse) | **14 KB gzip** | fixed |
| PERF-05 | CI: beta-fetch-unsplash, beta-atlas-real-shots | 5 min 55 s run, gates 4 min 58 s, every push | runs with nothing new skip the rebuild; npm and Playwright cached; gates faster through PERF-01 | fixed (claimed); measure the next runs |
| PERF-06 | CLS: Gallery on phone | 0.29–0.34 (5 pilots); desktop ≈ 0.10 | phone **0–0.007**, desktop **0.001** | fixed (bcf94510, merged df4382d2) |
| PERF-07 | CLS: Atlas on first load | desktop 1.05–1.57, phone 0.18 | — | open → Atlas lane |
| PERF-08 | INP: switch to Atlas; filter remainder | Atlas: phone 2,896 ms, desktop 792 ms; filter phone 712, desktop 896 ms (df4382d2) | Atlas: phone **1,240**, desktop **672**; filter phone **544**, desktop **824** ms | switched OFF again (QA-75, QA-76, QC-26); re-land after the deploy |
| PERF-09 | LCP | ≤ 1.2 s on every page and viewport (local) | — | meets target |
| PERF-10 | Font preload (Inter and Bricolage Latin) | — | tried and measured worse; **reverted** | rejected |
| PERF-11 | CSS after the W8 prune | cleo.css 193.7 KB raw / 34 KB gzip; fe-a.css 114 KB / 22 KB | dead code in the lane sheets is 1.6 KB (reported) | no change |
| PERF-12 | Data payloads | places 9.0 MB raw / 2.2 MB gzip, search 698 KB / 205 KB gzip, 90 share cards 6.7 MB | already compact and lazy; see the rows | no change |
| PERF-13 | Service-worker caching | the cache name is the build hash, so every deploy wipes a reader's offline cities | offline packs live in `cleo-packs`, which a deploy never wipes | fixed (2e4faf42) |
| PERF-14 | Photos on phone @3× (W8) | Tokyo first load 930 KB; 960w photos in 104 px slots | **590 KB**; none | fixed (e83b6cc3) |
| PERF-15 | Eager JS and deep-link DOM (W7) | 40.45 KB gzip; #p= 12,459 nodes | **27.4 KB**; **≈ 2.2 k** | fixed (eb47e76) |
| PERF-16 | `:has()` anchored on html / body / main (QA-70) | map pill → first pin, phone Gallery: Tokyo 1,654 → 2,481 ms (be74c82f → 530dc83b) | guard: `tools/beta/test-css-has.js` in `npm test`; 7 known cleo.css selectors to remove | fixed: FE-2 a7b4a980 (fe-a.css), designer eddbb7b0 (cleo.css); first pin on 3ba696e8 Tokyo 1,653 / NY 1,807 ms vs be74c82f 1,564 / 1,760; lint in `npm test`, no allowlist |

## Items

### PERF-01: `npm test` wall time
- **Before:** the chain `a && b && …` ran 13 suites one after another, for a total of **392 s**:
  - test-fe-a 118 s, test-views 116 s, test-honesty 53 s, test-beta 34 s, test-hubs 33 s;
  - the other eight suites together about 37 s.
- **Change:** `tools/run-tests.js`.
  - It runs **the same suites**, read from `package.json` `test:serial` (13 at the time; any suite added there, e.g. `beta/test-fe-c.js` and `location-verify.test.js` since, joins the pool automatically), as a pool of up to 4 jobs, longest first.
  - Each suite's output is buffered and printed in the original order, followed by a timing table.
  - It exits 1 if **any** suite fails; the old chain stopped at the first failure.
  - The suites are independent and read-only. test-beta's builds are `build.js --check` (in memory), and test-imagery writes only to its own `mkdtemp`. No check was removed or changed.
- **After:** wall time **110–154 s** on a 4-core box (two runs). The critical path is test-fe-a or test-views alone.
  - Each makes about 27 / 13 jsdom boots of the 780 KB Tokyo page, at about 4 s each. Sharding them is the next lever, and it's FE-A's call.
- **Commit:** fc861679. **Probe:** the timing table printed by `npm test`.

### PERF-02: build
- **Measured:** `npm run beta` takes 5.6 s and `beta:check` takes 5.3 s. The output is byte-deterministic (`beta:check` is the reproducibility test).
- An incremental or parallel build isn't worth its risk at this size, so there's no change.

### PERF-03: INP, collection filter
- **Before:** tapping "Must see" in Tokyo Gallery took **960 ms** on phone and **1,064 ms** on desktop.
  - Profile: a lens stamps all 464 deferred cards (core `Cleo.defer.all()`), which fired **one `cleo:stamped` per chunk**.
  - Each event re-ran city.js's card adoption (document-wide `querySelectorAll`) and views.js's pager. The style and layout of ≈ 14 k nodes followed.
- **Change:** `all()` and `stampIds()` stamp quietly and emit **one** `cleo:stamped` with every card. Listeners adopt and re-page once. The semantics are unchanged: every card is still stamped before a lens applies, and test-beta still asserts it.
- **After:** phone **≈ 450–520 ms**, desktop **≈ 580 ms** (medians across runs). That still misses 200 ms; the remainder is PERF-08.
- **Commit:** fc861679. **Probe:** `beta:perf`, inp rows "collection filter".

### PERF-04: first "open a place" download
- **Before:** the place detail fetched the whole page dataset (`data/places/tokyo.json`, 431 KB raw / **104 KB gzip**) and parsed it on the main thread. It only needs each source's article URL and the source → publisher map.
- **Change:**
  - The build emits `data/links/<page>.json` = `{g: {sourceKey: groupId}, p: {placeId: [[key, url], …]}}`.
  - core adds `Cleo.links()`, cached.
  - `sheet.js` `deep()` uses it and falls back to the full dataset if it's missing. FE-A was notified first.
  - The service worker serves `data/links/` stale-while-revalidate.
  - test-beta proves on every page that the slice says exactly what the dataset says.
- **After:** Tokyo **14 KB gzip** (86 KB raw); all 84 pages total 378 KB gzip against 2.2 MB. The browser fetches only `data/links/tokyo.json` on open, and the "Read" links fill in.
- **Commit:** fc861679. **Probe:** test-beta, "data/links/<page>.json == the page dataset…".

### PERF-05: CI workflows
- **Before:**
  - beta-fetch-unsplash ran 5 min 55 s on a push: checkout 18 s, installs 6 s, fetch 21 s, **rebuild + gates 4 min 58 s**, commit 2 s. It ran on every push that touched imagery paths, even when it fetched nothing.
  - beta-atlas-real-shots downloaded Chromium (~150 MB) on every run.
- **Change** (the orchestrator permitted editing the workflow files):
  - setup-node caches npm, keyed on `tools/package.json` (there's no lockfile);
  - fetch-unsplash: a "did this run fetch or re-encode anything?" step skips the rebuild, gates and commit when `beta/assets/img/` is unchanged (lanes gate their own source changes before pushing);
  - real-shots: `actions/cache` for `~/.cache/ms-playwright`, keyed on the pinned 1.56.1;
  - `npm test` inside the job now uses the pool (PERF-01).
- **After:** to be measured on the next runs. Expected: a nothing-new push run takes ≈ 1 min, and a run with photos has gates of ≈ 2–2.5 min.
- **Commit:** fc861679. **Probe:** the Actions run timings (`actions_list` jobs/steps).

### PERF-06: CLS, Gallery on phone (fixed, platform marked blocks in FE-A's files)
- **Measured:** Tokyo 0.315, New York 0.341, Wheeling 0.341, Chinatown 0.312, Cleveland 0.294. Desktop is ≈ 0.04 (Wheeling 0.059).
- **Cause (element timeline):**
  - at ≈ 1.2 s, JS reveals `#cleo-rail` and `.toolbar`, which were hidden;
  - at ≈ 1.6 s and 1.9 s, `.g-rows` is built client-side (0 → 465 → 975 px) above the grid.
- **Suggested fix (sent to FE-A):** show the rail and toolbar by CSS keyed on `html[data-view=gallery]`, which the head boot script already sets, and server-render the rows or reserve their height.
- **Fix (platform, marked `PERF-06` blocks, agreed with FE-A):**
  - render/city.js puts `data-lead` on `#cleo-lead` and `data-rows="N"` on `#cleo-rows-host` only where `lib/gallery.js rowsOf()` gives a lead / rows (3 Singapore pages have none);
  - fe-a.css: phones reserve the lead slot (320 px) until `.g-lead-on`, an empty `#cleo-rows-host[data-rows]` reserves 470 px, and the hidden phone `#cleo-rail` keeps its box (`visibility:hidden`) while JS is on (`html[data-view]`) until city.js unhides it. None applies under `.lens-on`.
  - After FE-A's QA-48/60 move put the rail above the phone lead, the rail reveal alone was 0.105 (Tokyo, New York); the rail line took it to 0.007.
- **Result (`beta:perf`, 4× CPU, median of 3):** phone Cleveland 0.228 → 0.000, Tokyo 0.323 → 0.007, New York 0.234 → 0.007, Chinatown 0.192 → 0.000, Wheeling 0.255 → 0.000; desktop ≈ 0.10 → 0.001.
- **Commits:** bcf94510, merged df4382d2. G1 `w7.js --only lens,reach` 21/21 on bcf94510; views.js 315/320, the same 5 honesty FAILs as the pre-change head f47945e9.
- **Probe:** `beta:perf`, load rows.

### PERF-07: CLS, Atlas on first load (open, Atlas lane)
- **Measured:** desktop 1.05–1.57, phone 0.18.
- **Cause:** first paint uses the Gallery layout. The Atlas layout lands at ≈ 1.2 s, when atlas.js adds `atlas-m`/`ms-on`. Then `.ms-head` and the chips insert at ≈ 2.2 s.
- **Suggested fix (sent):** key the structural Atlas layout on `html[data-view=atlas]` plus a media query, and reserve the list head.
- **Probe:** `beta:perf`.

### PERF-08: INP, switch to Atlas and the filter remainder (open)
- **Measured:**
  - switch to Atlas: phone ≈ 1.6 s, desktop ≈ 0.5 s;
  - collection filter after PERF-03: ≈ 0.5 s.
- **Causes:**
  - Atlas builds the map and `msArea()` stamps every in-area card at first fit (Atlas lane).
  - A lens still stamps every card, although only the matching ones are shown.
- **Proposal (now landed, see Result):** "a lens stamps only the cards it shows" (`Cleo.defer.stampIds` over `Cleo.lens.match` on the stubs; a `q` text lens keeps stamping everything). It touches core (platform), views.js and city.js (FE-A), atlas.js pins for unstamped stubs (Atlas), and test-beta's "a lens stamps every card", which would be restated as "every matching card is stamped and shown; every other place stays reachable". To be agreed with FE-A and the Atlas lane before it lands.
- **Landed (1538974d, merged 455b8b05), `Cleo.defer.selective = true`:**
  - core.js: a lens-only route — and a lens link on load — stamps just the matching cards (`stampLens`), plus its `#p=` place and every view chunk. While a lens is on, the lazy observer waits and the list spacers fold; both resume when it clears. The rail "Show all" still builds every card at once; a typed search (focus) and print still build everything.
  - city.js (FE-A, agreed): counts and "Showing n of N", sections, every marker (a stamped card or a stub, through `Cleo.lens.shows`) and `fitLens` read the unstamped stubs. views.js: the Gallery pager stamps through `stampLens` under a lens. atlas.js: FE-1 at 7831b0c5.
  - test-beta: the two "a lens stamps every card" checks became QA's outcome checks (a)–(h) — shown == F, every food place is a card, cards + stubs == total, "Show all" builds every card, clearing the lens then scrolling (Atlas) or paging (Gallery) reaches every card, the visible count == F, a `#p=` link and a typed search reach a place outside the lens, markers == pinned. A food lens on Tokyo now builds 290 of 488 cards.
- **Result (`beta:perf --only inp`, Tokyo, 4× CPU, median of 3; before = df4382d2, after = 455b8b05, same session):** phone — filter 712 → 544, open a place 360 → 400 (noise band), Guidebook 320 → 240, Atlas 2,896 → 1,240 ms; desktop — filter 896 → 824, open 248 → 264, Guidebook 304 → 224, Atlas 792 → 672 ms. Every row still misses 200 ms: the rest is the Atlas map build (Atlas lane, TBT) and `apply()` over the stamped cards. Both heads carry the QA-70 `:has()` rules, so they are compared like for like.
- **Switched off again (2026-10-16, `Cleo.defer.selective = false`, the code kept behind the flag):** QA's verdict on pin 3ba696e8 was NO, and 1538974d bisected for:
  - **QA-75:** a deep-linked tier lens was dropped under a remembered Guidebook/Insights view (`views.js --only links` 70/70 → 62/8);
  - **QA-76:** Atlas "N more outside this area. Show all M" was read mid-first-fit from the stamped cards only (`w7.js --only lens` 33/114 failing);
  - **QC-26 (same cause):** the sheet's "1 of 488" on a cold Atlas lens deep link.
  With the flag off: `views.js --only links` 140/140, QC-26 probe "1 of 43" at 390 and 1440. The INP gains above are given back until it re-lands.
- **To re-land:** the lens must be applied before selective stamping is observed. Every consumer that counts "shown" or "all" (atlas.js ms-more, sheet.js "n of N", views.js remembered-view routing) must read `Cleo.defer.peek({lens})`. Add QA-75 / QA-76 / QC-26 as probes first.
- **Probe:** `beta:perf`, inp rows.

### PERF-16: `:has()` anchored on html / body / main (QA-70)
- **Measured** (`tools/beta/qa/first-pin.sh`: phone Gallery 390, tap the map pill, time to the first `.leaflet-marker-icon`, median of 3, unthrottled): Tokyo be74c82f 1,654 ms → 530dc83b 2,481 ms. Bisect: first bad 7e746d9b (parent c54e55d1: Tokyo 1,502 → 2,602 ms, New York 1,790 → 2,757 ms).
- **Mechanism:** a `:has()` on `<main>` is re-checked on every DOM change inside it (each card stamped, each pin). 7e746d9b added `main[data-city]:has(.views[data-cleo-views]:not([hidden]))>.overlay…` (2 rules): without them 7e746d9b is 1,529 ms. On tip addeb1f7 a second pair, `main[data-city]:has(>.overlay…)>.cbar…`, costs as much: removing only the first pair leaves 2,485 ms, both pairs 1,666 ms. A direct-child `:has(>…)` is no cheaper here.
- **Fix:** FE-2 keys the rules on attributes the script sets (`main[data-views-on]`). **Guard:** `tools/beta/test-css-has.js` (in `npm test`) fails on any `:has()` (incl. `:not(:has(`) anchored on html / body / main in the shipped CSS; the designer removed the 7 pre-existing cleo.css selectors (+1 `:root`) in eddbb7b0 (worth ≈ 100 ms here), so the lint has no allowlist.
- **Verified (`first-pin.sh`, median of 3):** be74c82f Tokyo 1,564 / New York 1,760 ms; deploy candidate 3ba696e8 (FE-2's fix a7b4a980) Tokyo 1,653 / New York 1,807 ms — back at the good level (530dc83b was 2,481 / ≈ 2,760).

### PERF-09: LCP (meets target)
- Every page and viewport is ≤ 1.2 s at 4× CPU (phone Tokyo Atlas 1,168 ms is the worst).
- Caveat: a local server has no network latency, so this is the rendering share of LCP. The weight side is covered by the D-38 first-load budget (Tokyo phone 590 KB).

### PERF-10: font preload (rejected)
- **Tried:** `<link rel=preload as=font>` for `inter-normal-latin` and `bricolage-normal-latin` on every page.
- **Measured, 4× CPU, median of 3:**
  - landing LCP phone 372 → 620 ms, desktop 732 → 1,028 ms;
  - Tokyo phone 612 → 672 ms;
  - CLS unchanged.
  - The preloads compete with the LCP image.
- **Reverted.** The fonts stay `font-display: swap`, unicode-range-subset (Latin, Latin-ext, Vietnamese) and self-hosted.

### PERF-11: CSS (no change)
- After the W8 prune (`tools/beta/css-dead.py`; e83b6cc3): cleo.css is 193.7 KB raw / 34 KB gzip, and fe-a.css (FE-A + Atlas) is 114 KB / 22 KB gzip.
- `css-dead.py --files=` (new) finds 1.6 KB dead in fe-a.css and 0 in atlas.css / fe-b.css. That's too small to churn other lanes' files; the report is available to them.

### PERF-12: data payloads (measured; no change)
- **`data/places/*.json`** (84 files): 9.0 MB raw / 2.2 MB gzip. It's already compact JSON, and it's the open dataset, loaded only by Guidebook, Insights and saved lists. The first place open no longer needs it (PERF-04).
- **`data/search.json`:** 698 KB raw / 205 KB gzip, lazy (fetched on the first search query, `search.js`) and already positional arrays.
- **Share cards:** 90 PNGs, 6.7 MB, fetched only by link unfurlers, never by a page. They're held to ≤ 300 KB each by test-beta.

### PERF-13: service-worker caching (fixed in W9-8, 2e4faf42)
- **Today:**
  - the cache name is `cleo-<build hash>` and `activate` deletes every other `cleo-*` cache;
  - shell precache; navigations network-first; `?v=` assets cache-first; `data/` stale-while-revalidate; cross-origin never intercepted.
- **Problem:** every deploy (many per day) wipes the cities a reader saved for offline.
- **Done (W9-8, 2e4faf42):**
  - The versioned shell cache `cleo-<hash>` is still retired on activate.
  - Offline packs live in `cleo-packs`, which activate never touches. A pack is pruned only by "Remove" (keeping files that another kept city still lists) and refreshes itself on an online visit.
  - Navigations stay network-first, so a pack never serves a stale page while online.
- **Probe:** `npm run beta:qa:pack`. It deletes every non-pack cache, as a deploy does, and kills the server; Tokyo then reloads with 488/488 places.
- **GitHub Pages limits:** a fixed `Cache-Control: max-age=600`; no `immutable` and no custom headers. Assets are cache-busted by `?v=<hash>`, and photos by content-addressed file names.

### PERF-14 and PERF-15: earlier platform work, for the record
- **PERF-14:** photos on phone @3× (W8, e83b6cc3). See `design/beta/eval/w8/platform/README.md`.
- **PERF-15:** eager JS and deep-link DOM (W7, eb47e76). See `design/beta/eval/w7/platform/README.md`.
