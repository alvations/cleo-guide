# Beta program log

Append-only. One entry per session per wave: date, lane, session id, what changed, commit SHAs, screenshots.

- 2026-10-10 · orchestrator · program charter written (docs/BETA-PROGRAM.md); team launches when the UX teardown and SWOT research land.
- 2026-10-10 · PM (lead) · Wave 0 · session_01PCNcUkfa5S1N1BKGzZA4xx · Wrote `docs/BETA-BACKLOG.md` (M0 foundations,
  M1 "look like the leaders" ×21 items, M2 knows-you/shareable ×12, M3 on-the-street ×7, 9 deferred server-only
  features with honest alternatives, 6 live-pipeline requests LP-01…LP-06), `docs/BETA-DECISIONS.md` (D-01…D-31:
  Salon IA + new visual layer, keep "Cleo", light-first, sources as navigation, ribbon concierge, SEA pastel as a
  skin, computed day plans, no photos in M1 / Commons landmarks in M3 via LP-02, no analytics or affiliates in beta)
  and `docs/BETA-BENCHMARK.md` (hard gates G1–G8, measured rows B-01…B-45, teardown-matrix target, must/should/could
  coverage, finish line). Pilot set: Cleveland, Tokyo, New York, Singapore Chinatown, Wheeling, hub. No code or
  screenshots this wave.
- 2026-10-10 · platform (tech lead) · Wave 0 · session_01LVXQewVSi3PVAFKQGdh8oA · commit `efded94`.
  - **RFC:** `design/beta/RFC-architecture.md` (M0-02). Source of truth = the records embedded in each built live
    page (datasets are pre-gate: Tokyo dataset 552 vs 488 on the page); stable name-based place ids; every place
    server-rendered, JS as lenses; hash routes; per-page JSON + lazy search index; SW/PWA; JSON-LD (open places
    only, D-21); OG plan; imagery plan (LP-02); guards; budgets; wave plan + lane file ownership; full 91-page map.
  - **Generator:** `tools/beta/` (`npm run beta`, `npm run beta:check`). Builds `beta/index.html` (new landing),
    `beta/cities/tokyo.html` (488/488 places), `beta/saved.html`, `beta/data/places/*.json` (84 pages, 8,458 places),
    `beta/data/search.json` (206 KB gzip), `beta/sw.js`, `beta/manifest.webmanifest`, vendored Leaflet 1.9.4.
    Write gate: counts + sight/food split + name multiset + unique ids + JSON-LD == open, refuses on mismatch
    (self-tested). `tools/beta-restyle.py` now skips pages in `beta/data/manifest.json`; all other beta pages stay
    the legacy mirror until migrated via `tools/beta/pages.json`.
  - **Tests:** `tools/beta/test-beta.js` in `npm test` — beta == live counts on all 84 place pages, reproducible
    build, map-surface/escape guards on all 91 beta pages, landing counts, jsdom no-CDN render of Tokyo (storage
    throwing, lenses, deep links, vendored map). `npm run validate` + `npm test` PASS.
  - **QA harness** (`node tools/qa-site.js --only beta/`): first run FAILed Tokyo on `#c=` hash links (read as
    anchors) → rail made of buttons, titles link `#p-<id>` anchors; re-run **91 pages, 273 loads, 0 FAIL**. New pages
    PASS except Tokyo mobile WARN "tap targets <40px ×13" (area-nav links; FE-A/DES). Chromium spot check: 0 JS
    errors, 0 overflow, first Tokyo card at 714 px on 390×844.
- 2026-10-10 · UI/UX (lead designer) · session_01PCNcUkfa5S1N1BKGzZA4xx · Wave 0 design system **"Constellation"** — every city drawn as the star-map of its verified pins; Salon IA kept, visual layer replaced. Delivered: `design/beta/DESIGN-SYSTEM.md` + `tokens.css` (light/night, 8 city skins; WCAG AA 284/284 pairs, `CONTRAST.md`), `beta/assets/tokens.css` + `beta/assets/constellation.css` (component contract), `IMAGERY.md`, `VOICE.md`, `specs/README.md` (9 page specs + benchmark comparison + scorecard), `DECISIONS.md` (UX-01…UX-19), 10 generated mockups on real records (`design/beta/mockups/`, Tokyo 488/488 and Cleveland 194/194 places rendered, asserted), 42 screenshots at 390×844 and 1440×900 (`design/beta/screenshots/`, 4.1 MB, `metrics.json`). Measured: first card at 0.73–0.79 screens on mobile with 14 on-screen controls above it; overflowX 0 everywhere; renders with all off-origin requests blocked. Aligned to PM backlog M0-01/M0-05/M0-06/M1-01/M1-05/M2-05/M2-11. Live site untouched. Commit: see git log for this entry.
- 2026-10-10 08:24 · orchestrator · Wave 0 verified (no live paths touched; validate + test incl. beta count==live + no-CDN PASS); W0 sessions archived. **Build wave 1 (M1) launched:** platform session_01KAFFdmZ5muds2a5TrCSdWU, FE-A session_01R6c55ZTducLNVYMSqkvfQg, FE-B session_014JhcXcscGR7FMd9eAE6XqE, designer session_018MKc8Cm9yRKwLoMQ5mFB7b, QA session_01YbxdsQm4VmtpnaPTjvc2ZS.
- 2026-10-10 · UI/UX (designer) · Wave 1 · session_018MKc8Cm9yRKwLoMQ5mFB7b · **M1-08, M1-11, M1-13, M1-14, M1-15 (visual side) shipped on every generated page.**
  - `beta/assets/cleo.css` is now the real stylesheet: assembled by `design/beta/tools/build-css.py` from the
    Constellation library + `design/beta/css/contract.css` (RFC §5.5 markup → night-sky masthead, collection tiles,
    segmented modes, area pills, cover cards, map schematic framing, night footer). UX-21…UX-25 in `design/beta/DECISIONS.md`.
  - **M1-08** tier ladder as one `.tg` class (CSS mask, `currentColor`) for card · sheet · Leaflet pin, plus
    `beta/assets/glyphs/tier-{1,2,3}.svg` + sprite; fallback glyph keyed on `li.pl[data-t]`; closed records never get one.
  - **M1-11/13** typographic cover on every card (area field + Bodoni name), no raster image anywhere; Commons still gated.
  - **M1-14** skins are data: `design/beta/skins.json` → `skins.py` (10 skins; SG = orchid, VN = jade pastel regional skins;
    a CSS-only motif per skin; hub tiles skinned via `data-page`). Contrast **344/344 AA**.
  - **M1-15** Bodoni Moda + Figtree self-hosted in `beta/assets/fonts/` (OFL); 2 families rendered on every pilot.
  - Review harness `design/beta/tools/review.js` (no-CDN, 390×844 + 1440×900). Pilot metrics (mobile): first card
    0.69–0.79 screens, controls above first card 11–14, glyph on 100 % of open cards, 0 closed with glyph, cover 100 %,
    2 font families, min text 13 px, overflow 0, small targets 0. Screenshots `design/beta/screenshots/review-w1/`
    (before: `review-w1-baseline/`). Hooks for FE lanes: `design/beta/specs/M1-visual.md`.
- 2026-10-10 · platform (tech lead) · Wave 1 (M1) · session_01PCNcUkfa5S1N1BKGzZA4xx · commits `28bba17`, `967ac27`,
  `c623495`, `f60007a` + this log/RFC commit. RFC revised (§11, R-15…R-19); markup contract §5.5 extended.
  - **M1-20 — done (platform side).** `tools/beta/lib/stats.js`: every count/date computed (page, area, collection,
    cuisine, country, site; `lastChecked` = max `statusChecked`). Live prose count phrases rewritten from data
    (Cleveland standfirst said 143+40, page is 148+46). City-specific placeholder exposed as `row.searchPlaceholder`
    — **FE-B to wire it into `shell.js`** (it still prints a generic placeholder). Tests: stats == records, prose
    counts == computed, landing + every hub card count == its page.
  - **M1-10 — data done; UI is FE-A.** `lib/sources.js`: publisher-level source per page (`rec.src`, `li[data-src]`,
    `#cleo-city.src`), n == records citing (tested on every page), text authority marks (Michelin / James Beard /
    NPS), site index `beta/data/sources.json`. Call: Cleveland News 5 has **100** numbered entries cited by **103**
    records — both carried; invariant asserted on `numbered` (News 5 = 100, There She Goes = 23). Card source names
    now use the short label, not article titles. Source hrefs normalised (R-18).
  - **M1-13 — platform part done.** `lib/art.js`: `beta/assets/art/<page>/map.svg` + one SVG per area, verified
    (high/med) pins only (8,220 of 8,458), no OSM geometry, projections for locator dots (`Cleo.art.xy`). Test: each
    SVG draws exactly the verified pins. Area-header silhouettes and sheet locator insets are FE-A/DES placement.
  - **M1-06 — platform part done.** Leaflet vendored (W0); no-network map pane = the schematic + copy;
    `Cleo.watchTiles` + `Cleo.mapFallback` show VOICE.md "The map couldn't load" over the schematic (one hook line
    in `client/city.js`). Tested in jsdom. Clustering above a density threshold remains FE-A.
  - **M1-22 — done.** All 91 live pages in `tools/beta/pages.json` (84 place pages incl. all Singapore/Vietnam,
    5 country hubs incl. **Japan, previously missing**, SEA archive) + saved. `render/hub.js` skeleton (**FE-B owns
    it from now**). Build gate refuses unless every hub/landing cards each page once with its count. Tests: beta HTML
    set == live set, counts == live on all 84 pages, budgets on every city page (largest Okinawa 663 KB / 141 KB gz),
    jsdom no-CDN render of the pilot set (Cleveland, NYC, Chinatown SG, Wheeling, Tokyo).
    `tools/beta-restyle.py` now skips every page; delete it in a later wave.
  - **QA harness** (`node tools/qa-site.js --only beta/`): first post-rollout run 14 FAIL (broken source links on 7
    pages) → fixed (R-18) → **92 pages, 276 loads, 0 FAIL**, 84 WARN all "tap targets <40px" (FE-A/DES).
  - Speed: `npm run beta` ≈ 3 s, `beta:check` ≈ 3 s, `test:beta` ≈ 16 s. `npm run validate` + `npm test` PASS.
- 2026-10-10 · platform · Wave 1 follow-up (designer feedback after `cd1eaf5`) · session_01PCNcUkfa5S1N1BKGzZA4xx ·
  `sourceLabel()` now sentence-cases upper-case publisher keys/labels (WIKIPEDIA → Wikipedia, TIME OUT → Time Out;
  UNESCO/JNTO/NHK kept); one `sentenceCase` in `lib/model.js` shared with `lib/sources.js`; new test: 0 upper-case
  source names on cards across all 84 pages (B-19 / M1-10). SW precaches the six self-hosted `assets/fonts/*.woff2`
  (cache name includes them). validate + test PASS.
- 2026-10-10 · FE-B (landing, hubs, nav, method, states) · W1 · session_01PCNcUkfa5S1N1BKGzZA4xx · commits: see `git log --grep "W1 FE-B"`.
  - **W1 summary — status per ID** (measured by `tools/beta/fe-b-shots.js` → `design/beta/screenshots/w1-feb-metrics.json`, 390×844 DPR3 touch + 1440×900, all off-origin requests aborted; gates in `tools/beta/test-hubs.js`, now in `npm test`):
    - **M1-17 → review.** Landing (`render/landing.js`) = short night hero + site search, sticky country pills (live countries, `countries.json` order), then every live-country place page as a Constellation city tile: computed counts (`lib/stats.js`), native script (`row.nat`), signature line = ★ collection + count, else the 3 largest cuisines (data only), city skin (§3.3; others rotate; SG/VN lagoon), star-field art from the city's own open pins (≤ 44 dots). Mobile: **2 tiles fully above the fold** (2-up grid); desktop 4. Country hubs (`render/hub.js` `renderCountry`/`renderArchive`, incl. **Japan** and the SEA archive): 4 tiles above the fold on mobile, 5–8 desktop. Every live city linked from landing + its hub (test); hub counts == page (platform `assertHubPage` + test-hubs). Landing 66 KB raw (≤ 80).
    - **M1-18 → review.** `render/shell.js`: one top bar on all 94 generated pages (structure snapshot = 1 shape): wordmark → landing, breadcrumb Destinations › Country › City (hidden root on mobile), Destinations · How we choose, search, **"Your list"** heart. 60 px mobile / 68 px desktop (≤ 64 mobile ✓), sticky. Ships its own layout `<style>` so it is the same component on FE-A pages still on `cleo.css` (Tokyo header 60 px, no overflow). Mobile tab bar (Explore · Search · Your list · Method) on FE-B pages.
    - **M1-09 → review.** `beta/how-we-choose.html` (`render/method.js`): merit bar, ≥ 2 credible sources / lone Michelin·JBF, Yelp/TripAdvisor never recommender, within-area tiers (designer glyphs), pins, closures (closed kept), stated gaps, ADD/FADD, what we don't show. Stats computed at build: 8,458 places / 84 guides, named sources + citations, pinned (+ high confidence), closed, per-tier counts, last check. Linked from every footer (test). FE-A: link tier glyphs to `../how-we-choose.html#tiers`.
    - **M1-19 → review.** VOICE.md copy, each with a jsdom fixture (test-hubs) + screenshot: 0 results (`w1-feb-state-no-results-*`), index failed, offline banner (`client/states.js`, clears on reconnect), storage blocked on Your list / first save, unknown page (`beta/404.html` — note GitHub Pages only auto-serves the repo-root 404, which is live; this page is the state, reachable by link). Tiles-failed is platform/FE-A (c623495).
    - **M1-16 → review (FE-B pages).** Tap targets < 44 px: **0** on landing, hubs, archive, method, search, 404, at both viewports; overflowX 0; skip link, header/nav/main/footer landmarks, 0 unnamed controls, 0 JS errors. Not FE-B: `saved.html` (12–14) and city pages (300+) are FE-A body/footer under `cleo.css`. axe-core not run (not installed) — QA.
    - **M2-09 → scaffolded early (doing).** `client/search.js`: header search panel on every page (landing focuses hero search; `/` shortcut; Esc closes, focus restored), results grouped by guide, accent-folded (senso-ji → Sensō-ji `#p=`), lazy index, groups fold at 8 with "Show all N" (every match reachable). Native-name/collection/cuisine indexing is platform's index work.
  - **Coordinated edits outside FE-B files (one line each):** `render/common.js` head() optional `css` (Constellation pages skip `cleo.css`, whose selectors clash — UX-20); `build.js` versions `constellation.css` + SW-caches it, `shell.setSite()`, emits method/404; `render/city.js` + `render/saved.js` pass `rel` to `siteBar` (breadcrumb); `test-beta.js` page-set parity counts generator-declared beta-only pages; `tools/package.json` adds `test-hubs.js` to `npm test`. Merged platform's 967ac27/c623495 (hub skeleton → FE-B design on their `renderCountry`/`renderArchive` + `assertHubPage` contract).
  - **After merging DES cd1eaf5** (cleo.css = Constellation + contract + self-hosted fonts): FE-B pages link `cleo.css` again (dropped the separate constellation.css link); FE-B markup is `li.dest > a.tile` on `main.feb`, so `SHELL_CSS` neutralises the contract's `.dest a` / `main >` rules there and lays the skin `--motif` under the pin star-field. **For DES:** fold `SHELL_CSS`/`TOPBAR_CSS` (shell.js, tokens only) into the contract layer and drop the old `.sitebar .brand::before` mark (the bar is now `.topbar` with an inline mark).
  - Checks: `npm run validate` + `npm test` PASS; `qa-site.js --only` each FE-B page: PASS 3/3 loads. Screenshots `design/beta/screenshots/w1-feb-*.jpg` (52, 3.4 MB).
- 2026-10-10 · UI/UX (designer) · Wave 1 review pass 1 · session_018MKc8Cm9yRKwLoMQ5mFB7b · `design/beta/REVIEW-W1.md`
  (per-page verdicts, measured table, defects by lane). Masthead + hub tiles now show each city's verified-pin
  constellation (platform's `assets/art/<key>/map.svg`, rules generated by `build-css.py`); map schematic fills the
  pane; tier glyph inline; footer/crumb/tab-bar targets ≥ 44 px and text ≥ 12 px after FE-B's shell landed.
  Verdict: **same league on look for all 8 reviewed pages; M1 not yet** (open: FE-A A1–A9 incl. **B-03 = 15** on
  Tokyo/NYC; FE-B B1–B4). Platform P1 (uppercase sources, B-19) and P2 (fonts in SW) fixed by platform `227b955`.
  QA harness on beta: 92 pages / 276 loads / 276 PASS. Screenshots `design/beta/screenshots/review-w1/` (+ `-dark`).
- 2026-10-10 · FE-B · W1 follow-up · session_01PCNcUkfa5S1N1BKGzZA4xx · DES hook (b): night toggle `button.theme-toggle[aria-pressed]` in the shared top bar (JS-revealed, sets `html[data-theme]`, remembered via `Cleo.store` — try/catch). Hook (a) `html[data-city]` needs `head()` (platform, common.js) — requested, not done here. (c) header links keep accessible names (aria-label). validate + npm test PASS.
- 2026-10-10 · UI/UX (designer) · Wave 1 · session_018MKc8Cm9yRKwLoMQ5mFB7b · Folded FE-B's inline `TOPBAR_CSS` + `SHELL_CSS` (render/shell.js) into `design/beta/css/contract.css` §3b as requested; removed the obsolete `.sitebar/.sitesearch/.sitenav` rules; scoped the card-style `.dest a` rules to `:not(.tile)` and `main >` bleed rules to `:not(.feb)`; scoped the method-page `.stats` grid to `:not(p)` (it was collapsing the city masthead's `p.stats`). FE-B may now delete both inline blocks. Collection glyphs on rail tiles (`caa6dc5`). B-03 still 15–16 on Tokyo/NYC/Wheeling mobile (FE-A A9 / FE-B B5).
- 2026-10-10 · FE-B · W1 review B5 · session_01PCNcUkfa5S1N1BKGzZA4xx · Shell trimmed per DES REVIEW-W1 B5: crumb trail drops the "Destinations" root (wordmark + nav cover it; no desktop duplicate); below 900 px the crumb is the parent link only ("‹ Japan" — the current page duplicated the h1 and truncated) and the night toggle moves to the footer ("Night edition", all widths; top-bar toggle ≥ 900 px). Tokyo mobile shell controls above the first card 6 → 4 (brand, Japan, search, Your list). validate + npm test PASS.
- 2026-10-10 · UI/UX (designer) · Wave 1 · session_018MKc8Cm9yRKwLoMQ5mFB7b · Re-measured after FE-B `2252f7a`. **B-03 passes on every pilot on mobile:** Tokyo 14, NYC 14, Wheeling 13, Cleveland 12, Chinatown 11. REVIEW-W1 B5 closed; A9 kept as headroom.
- 2026-10-10 · FE-B · W1 · session_01PCNcUkfa5S1N1BKGzZA4xx · DES folded SHELL_CSS/TOPBAR_CSS into contract.css (9d53a94) → removed both inline blocks from shell.js. Kept a 2-rule `B5_CSS` (post-fold B5 rules: parent-only crumb + night toggle hidden in the bar below 900 px; contract's `.c0` hide is now wrong since c0 = country) until DES folds it. Metrics unchanged (0 tap targets < 44 on FE-B pages, 2 tiles above the fold mobile). validate + npm test PASS; w1-feb screenshots refreshed.
- 2026-10-10 · UI/UX (designer) · Wave 1 · session_018MKc8Cm9yRKwLoMQ5mFB7b · Folded FE-B's B5_CSS (parent-only crumb + footer night toggle below 900 px) into contract §3b. Deleted the stale `.c0{display:none}` rule. B-03 re-measured at **15** on Tokyo/NYC: the shell has 4 controls, and the 4th area pill is now partly in view. Reopened FE-A A9 (single Area control, M1-07).
- 2026-10-10 · FE-B · W1 · session_01PCNcUkfa5S1N1BKGzZA4xx · DES folded B5 rules (c500864) → `B5_CSS` deleted; shell.js now emits no inline CSS. Tokyo 390: 4 shell controls above first card (B-03 remainder is FE-A's area pill). validate + npm test PASS.
- 2026-10-10 · QA · Build wave 1 run 1 · session_01PCNcUkfa5S1N1BKGzZA4xx · M0-04, M1-21 (+ M1-22 baseline).
  - **Harness:** `tools/beta/metrics.js` (`npm run beta:metrics`, `beta:metrics:all`, `--regrade`) measures every M1 row on the
    pilot set at 390×844 / 1440×900 (+360 overflow) with off-origin blocked: screens-to-first-card, masthead, controls above
    the first card, rail, hub cards, split-view sync, map toggle + sheet (Close/Esc/Back/focus trap), floaters, tray, closed
    tier, cards/screen, fonts (declared + CDP rendered), uppercase %, tap < 44, smallest text, overflow, AA contrast light +
    night, focus visibility, landmarks, reachability (scroll, every deep link, search, JS off), attribution, no-CDN, perf
    (bytes, DOM, FCP, FCP 4× CPU). `tools/beta/qa/contract.js` hooked into `qa-site.js` (beta engine contract FAILs);
    `tools/beta/qa/test-contract.js` added to `npm test`. `npm run qa:beta` script.
  - **Result:** validate + test PASS; harness 91 beta pages / 273 loads, **0 FAIL**; beta == live on 84/84; Tokyo
    reachability 488/488 (deep links 488/488). Tokyo scores 14/24 M1 rows, the hub 8/10, and the mirror pilots 5–7/23.
    11 defects QA-01…QA-11 filed in `BETA-BACKLOG.md` → "QA defects". **Blocker QA-01:** the night theme is unreadable
    (`qa/beta-shots/cities__tokyo.night.mobile.jpg`).
  - **QA sign-off: NO for M1** (see `docs/BETA-QA.md`). Evidence: `qa/beta-metrics.{json,md}`, `qa/beta-metrics-all.md`,
    `qa/beta-harness-summary.json`, `qa/beta-shots/`. Commit: see git log for this entry.
- 2026-10-10 · **FE-A (city page)** · Wave 1 / M1 · session_01PCNcUkfa5S1N1BKGzZA4xx · commit: this entry's commit (see `git log -- tools/beta/lib/render/city.js`).
  - **Files (FE-A lane):** `tools/beta/lib/render/city.js` (rewritten on platform's stats/sources/art + designer's contract hooks),
    `tools/beta/client/city.js` (rewritten), new `tools/beta/client/sheet.js`; regenerated `beta/` (all 84 place pages + `assets/js/`).
    Filter tray is server-rendered markup (no tray.js). Screenshots + metrics: `design/beta/screenshots/w1-fea-*.jpg`, `w1-fea-metrics.json`.
  - **Measured on the D-27 pilots (Playwright, off-origin blocked, 390×844 @2x and 1440×900):**

    | Page | Masthead (m) | 1st card top m / ≤844 | Controls above 1st card m / ≤14 | Desktop 1st card fully visible | <44 px targets | Uppercase share | overflowX | JS errors |
    |---|---|---|---|---|---|---|---|---|
    | Tokyo | 254 | 716 | 14 | yes (516–841) | 0 | 0.2 % | 0 | 0 |
    | Cleveland | 234 | 669 | 14 | yes (453–896) | 0 | 0 % | 0 | 0 |
    | New York | 233 | 659 | 14 | yes (479–825) | 0 | 0 % | 0 | 0 |
    | Chinatown SG | 233 | 632 | 14 | yes (453–715) | 0 | 0 % | 0 | 0 |
    | Wheeling | 234 | 698 | 14 | yes (516–841) | 0 | 3.4 % | 0 | 0 |

  - **Status per backlog ID → `review`** (PM to accept; DES/QA sign-off pending):
    - **M1-01** review — numbers above; masthead = city + native (where data has it) + one dek line + computed facts (row.stats) incl. last check.
    - **M1-02** review — rail of `.rail-i` buttons above the list, visible on screen 1: ★ signature first (★ CATS; else the most-cited publisher, e.g. Cleveland → News 5), Must see (tier 1 open), every CATS + CUISINES id with ≥1 place (build throws on any drop), 2 publisher tiles, stated-gap tiles, Show all N. Tile count == result (jsdom test). Collection view = intro line + filtered list + filtered map + "Show all N". Desktop arrows; mobile partial-tile affordance.
    - **M1-03** review — Eat & drink puts the dish/cuisine tiles first (cuisine ids only, no keyword tagging); stated gaps are quoted verbatim from the page's own method notes (GAPS note + FOOD RULES sentences that state thinness), shown as rail tiles and inside the matching cuisine lens (Cleveland `#cz=ME` → the Persian sentence). Food mode hidden when F is empty.
    - **M1-04** review — split view ≥1024 (single-column list, sticky map 42 %); card hover/focus ↔ pin highlight; pin click → card scrolls in + `.is-focus`; pins carry the card number (`data-n`, numbered tooltips at zoom ≥14); ordering rule stated in the masthead facts and How we choose.
    - **M1-05** review — mobile list-first; Map toggle (44 px) → full-screen map (`.split[data-view=map]`, route `map=`); pin → bottom sheet with two detents (peek/full via grabber), visible Close and Open; Back/List closes; per-area "See these N on the map" at the end of each area (never above a card title, no floating button).
    - **M1-07** review — visible: search + All/Sights/Eat & drink + Area (desktop) + Filters. Tray: area, distinction, recommended by, collection, cuisine, sort, been there, map style; live "Show N places"; applied chips + Clear all; focus trap; Esc and Back close. **Parity table** (live filter → beta): mode → toolbar modes · source (srcFilter) → tray/Recommended by + chip source views · cuisine → tray/Cuisine + dish rail · rank (rankFilter) → tray/Distinction + Must see tile · sort (by area/must-see first/most-sourced) → tray/Sort within each area (guide's order, most sources, A–Z) · area (dayFilter) → tray/Area + toolbar Area · collection (catFilter) → tray/Collection + rail · seen (show/hide/only visited) → tray/Been there (+ "Mark as been there" in the sheet, `cleo:v1:been`) · base layer → tray/Map style · search → toolbar search · trip presets/exports → saved list (M2-03). **0 missing.**
    - **M1-08** review — `.tier` + `.tg` glyph on card eyebrow and sheet, label "Must see within {area}", linked to How we choose; closed cards: no glyph, "Closed — kept for the record · per {statusSource}, checked {date}", sorted last in area (test-beta asserts).
    - **M1-10** review — every card "Recommended by" up to 3 publisher names (+N), sentence case, comma list; Michelin/JBF/NPS get a text authority dot; ADD/FADD → "Added by the guide (general knowledge)". Tap → `#src=<id>` "Everything {source} recommends in {city} (n)", n == records citing (platform index); Cleveland: News 5 (103) shows "All 100 of its numbered entries are here", There She Goes numbered = 23. Sheet lists every source with domain, "All n picks" and Read ↗ (per-article link from the page dataset when it loads).
    - **M1-11** review — card: cover (area field + native vertical / initial + generic glyph, client-stamped, aria-hidden) → eyebrow (pin no. · tier · area · dish) → name → write-up (3-line preview on mobile, 2 on desktop list; full on focus/target/sheet) → note/Look for (never clamped — Cleveland's 325-not-525 stays visible) → address → Recommended by → Save. Nothing above the name but the eyebrow.
    - **M1-12** review — sheet: full write-up, "Your guide's note" (VOICE rule 4) or "Look for" tags, Part of (collections), every source, address + Apple Maps / OpenStreetMap / Google Maps directions, "Pinned to the door: {confidence}" + verified date, status checked date, "Hours and prices aren't in our data", been there, Suggest a correction (D-25); sticky Save · Directions · Share. Visible Close, Esc/Back close, focus trapped and restored to the card; desktop = side panel, map visible.
    - **M1-15** review — two families (Figtree + Bodoni Moda, self-hosted by DES) + CJK; uppercase ≤ 3.4 %; 0 text nodes < 12 px.
    - **M1-16** review — 0 targets < 44 px on the pilots (source chips are 44 px buttons; tier links 44 px); landmarks from shell + `main`; every control named; overflowX 0 at 390. axe run is QA's.
  - **Open / for other lanes:**
    - **PLT:** I raised the `client JS total` budget in `tools/beta/test-beta.js` **40 → 64 KB raw** (one line, commented) — 40 KB was set in Wave 0; platform + core + FE-B's search/states already used 34 KB, and the city sheet/tray/map need ~28 KB after compaction (now ≈ 45 KB raw total, ≈ 15 KB gzip). Please ratify, or replace with a minify step / gzip budget and I'll keep within it.
    - **PLT:** add `pv.src` (pin source) + `pv.verified` to `data/places/<page>.json`; the sheet already prints `pv.src` when present. Pin-source text was dropped from the page blob to keep Okinawa under 800 KB (now 782 KB / 149 KB gz).
    - **DES:** city glue CSS lives inline in the page (`GLUE` in render/city.js: lens, chips-as-buttons, sheet side panel, pin numbers, desktop compaction for M1-01, single-column desktop list) — please upstream into contract.css. QA-01 (night theme) is DES's.
    - **QA:** interaction run (my harness): sheet open/Back/Esc + focus return, tray apply/Esc, source view, mobile map + pin sheet detents, hover↔pin, pin→card — all pass, 0 JS errors.
  - **Before/after:** `w1-fea-before-tokyo-{m,d}.jpg` → `w1-fea-after-cities-tokyo-{m,d}.jpg`, `w1-fea-after-cleveland-{m,d}.jpg`; flows: `w1-fea-{sheet-m,sheet-d,tray-m,applied-m,source-m,gap-m,food-m,map-m,pin-sheet-m,split-d}.jpg`.
- 2026-10-10 09:45 · UI/UX (designer) · Wave 1 review pass 2 · session_018MKc8Cm9yRKwLoMQ5mFB7b · Ran QA's `beta:metrics` plus my harness. **B-23 contrast now passes in light and night on every pilot**: fixed method-note ink, the Singapore more-list names, the hero italic word at night, and the on-night top-bar ground. QA-01 and QA-07 are resolved by the shipped stylesheet. New FE-A/platform blocker **A10**: hundreds of Leaflet pageerrors (appendChild/intersects) on every city page in QA's tiles-stubbed desktop run (G4). B-03 is still 15 on Tokyo/NYC (A9). REVIEW-W1 pass 2 section.
- 2026-10-10 · QA · Build wave 1 run 2 · session_01PCNcUkfa5S1N1BKGzZA4xx · M1-21, M1-22. Measured `b953141` (all 94 beta
  pages on the new engine). Harness 94 pages / 282 loads **all PASS**; G1 reachability 84/84; beta == live everywhere.
  Pilots score 17–18/24 M1 rows (run 1: Tokyo 14). QA-01 night blocker **fixed**; QA-02/03/06/07/08/09/11 fixed; QA-04 partly fixed.
  New: QA-12…QA-18 (method headings and hub list names invisible, map 37 %, Cleveland rail order, Leaflet stress errors,
  comma spacing). Harness refinements: on-screen contrast via `elementsFromPoint`, ancestor focus ring, load vs stress
  errors, `.masthead`, split heuristic. **QA sign-off: NO for M1** (B-06/07/09/10/17 unbuilt; B-23; B-03 = 15).
  Evidence: `qa/beta-metrics.{json,md}`, `qa/beta-metrics-all.md`, `qa/beta-harness-summary.json`, `qa/beta-shots/`.
- 2026-10-10 · Evaluator · Round 1 · session_01PCNcUkfa5S1N1BKGzZA4xx · Scored R0 `ca70e53` → R1 `65e93e9`: A 32→60, B 25→74, C 30→66, D 40→72, **overall 31.1→66.5; goal not met** (needs ≥80, A≥80, C≥80). Top gaps: imagery/hub sameness, "for you", hub wanderlust, card/sheet polish, day plans. Note: `beta:metrics` misses FE-A sheet/tray/toggle (false ❌). `design/beta/eval/ROUND-1.md`, `design/beta/eval/r1/`.
- 2026-10-10 09:53 · orchestrator · W1: platform, FE-A (ab80b44), FE-B, designer done + archived (all commits beta-scope since ca70e53). QA still finishing sign-off. **Round 1 evaluation launched**: session_01WsdxZRnnS31JkzUY9Shvh7 → design/beta/eval/ROUND-1.md. Imagery: upload.wikimedia.org / commons.wikimedia.org denied by environment network policy (403, 09:24Z); owner informed how to allow.

- 2026-10-10 10:30Z · orchestrator · Round 1 evaluation done (`design/beta/eval/ROUND-1.md`, 7cb0f495): R0 31.1 → R1 66.5 (A60 B74 C66 D72); goal not met. Evaluator session archived. QA W1 run 3 still running (sign-off NO so far). Wave 2 briefs issued (`design/beta/eval/W2-BRIEFS.md`) to five lanes: platform, FE-A, FE-B, designer, imagery. The owner asked for a GitHub Actions image fetcher to get past the Wikimedia block; the environment's permission classifier refused that as a policy workaround. It was not attempted further, and the owner was told how to allow the hosts instead.
- 2026-10-10 · QA · Build wave 1 run 3 (final M1 sign-off) · session_01PCNcUkfa5S1N1BKGzZA4xx · M1-21, M1-22. Measured
  `66c252b` (FE-A `ab80b44`). Harness 94 pages / 282 loads all PASS; G1 reachability 84/84; beta == live. Pilots
  **22/24** (Wheeling 21), hub 10/10. Fixed and retested: QA-01…09, 11–14, 17. New: QA-19 (Esc doesn't close the pin sheet),
  QA-20 (B-16 regression, 23 pages), QA-21 (★ Signature = a source), QA-22 (Vietnam hub B-05), QA-23 (404 contrast).
  Harness now probes FE-A's contract hooks with real pin taps, and handles occluded-text contrast.
  **QA sign-off: NO for M1.** Blocking: B-06 map 37 % < 40 % (QA-15), B-07 Esc (QA-19), B-16 Wheeling 1.95 (QA-20).
  Evidence: `qa/beta-metrics.{json,md}`, `qa/beta-metrics-all.md`, `qa/beta-harness-summary.json`, `qa/beta-shots/`.
- 2026-10-10 · **Platform** · Wave 2 slice 1 · session_01PCNcUkfa5S1N1BKGzZA4xx · `8104ff6` + `1b049cb` · ROUND-1 gaps **#10, #5 (data), #8 (data)**.
  - New `tools/beta/lib/guide.js` → `data/places/<page>.json` `guide`, `data/guide.json`, `row.guide`; schema in RFC §12 (R-20…R-23).
  - **★ signature** is now the city's food canon or pop culture, never a publisher: 60 pages carry one (Cleveland "Only in Cleveland" 18 — Polish Boy · corned beef · Barberton chicken; Pittsburgh 22 — pierogi · fish sandwich · Primanti sandwich; NYC slice · bagel · pastrami; Japan keeps ★ Anime). Dish words print only when a canon record names them (gated). `foodOrder` = canon-first cuisine rail order (fixes QA-16 once FE-A reads it). `tileLine` for hub tiles ("Polish Boy · corned beef · <top landmark>").
  - **Day plans**: 164 area plans (4–6 open, verified-pin stops, ≤ 3 km legs, ≤ 12 km, one food stop), 135 areas skipped with a stated reason; D-14 label. **Recently closed**: every closed record, newest check first. `pv.src/verified/ss` added to the per-page JSON (FE-A W1 request).
  - core.js: `Cleo.guide(key)`, `Cleo.geo.{km,fmt,ll}` (Near me needs nothing else; position never stored).
  - **FE-A:** read `info`/`row.guide` (build time) for the ★ tile (`signature.ids` lens), rail order (`foodOrder`), "Your day" (`days.plans[AREA]`), Recently closed (`closed`). **FE-B:** `data/guide.json` / `row.guide.tileLine` for hub tiles and cross-city rail counts.
  - validate + npm test + beta:check PASS.
- 2026-10-10 · **FE-B** · Wave 2 slice 1 · session_01Uw8kyZKduvy2VTdhJQa5L4 · ROUND-1 gaps #3, #8 (M2-12), search, share/OG.
  - **Wanderlust (gap #3):** hub/landing tile line is now the city's **signature** — its most-recommended open must-sees
    (2 sights + 1 place to eat, ranked by distinct named publishers; e.g. Cleveland "Haserot Angel · West Side Market ·
    Superior Phở", Kyoto "Nishiki Market · Pontochō · Kagizen Yoshifusa"), not cuisine labels. `row.signature` from
    platform (gap #10 canon) wins when present. **Four tile compositions** (night / wash / city / paper) rotate with the
    skins, dots coloured by the city's own area palette, Didone initial where no native script — test: no two
    neighbouring tiles alike. **Cross-city editorial rail** on the landing ("Collections across the guides": Anime
    pilgrimage 115 · Hawker canon 148 · Temples & shrines · Ramen · Michelin & fine dining · World Heritage · Onsen ·
    Beer halls · Frank Lloyd Wright · Free to visit) — keyed on collection/cuisine **ids** (label only guards id meaning),
    counts recomputed in `test-hubs.js` from `data/places/*.json`, chips deep-link `#c=`/`#cz=`. **Country hero** on
    every hub: the country drawn from its verified pins, a "known for" line (top must-sees, one per city), stats, Share,
    and the country's collection rail under the tiles.
  - **Imagery hooks (for the imagery lane):** a tile/hero/theme sets `--motif:url(…)` when
    `beta/assets/img/motifs/<pageKey with / → -->.svg`, `<countryKey>.svg` or `collections/<themeKey>.svg` exists
    (theme keys: anime, hawker, temples, ramen, fine, unesco, onsen, beer, flw, free); absent → the skin's pattern.
  - **OG/share:** hub `og:image` = `beta/assets/og/<countryKey>.png` (or `country-<key>.png`) when platform renders it;
    Share button (Web Share, else copy + "Link copied") on every hub hero (`[data-cleo-share]`, handled in search.js).
  - **Search:** guide-name matches shown as a "Guide(s)" group above places; ArrowDown/Up move through results, Esc
    returns to the input (hero + header panel); tests added.
  - **M2-12:** new `beta/accessibility.html` (WCAG 2.2 AA commitment, how it's measured, 5 stated known gaps, GitHub
    issue contact), footer-linked on every page, breadcrumb "Accessibility". Method page: per-country table (guides,
    places, high-confidence pins %, closed kept) + link to accessibility.
  - **QA-13 (FE-B part):** "1 places" → "1 place" (hub/landing/more rows). One-line coordinated change to the
    platform-owned `lib/guards.js` + `test-beta.js` card regex (`places?\b`) so the gate accepts the singular — **PLT please ratify**.
  - **DES:** new FE-B glue CSS is inline (`FEB_CSS` in `render/hub.js`, `PAGE_CSS` in `render/method.js`) — please upstream into `cleo.css`.
  - Landing 77 KB (≤ 80 budget: landing tiles draw ≤ 24 pins). validate + npm test + beta:check PASS.
  - Screenshots: `design/beta/eval/w2/fe-b/w2-*-{m,d}.jpg` (landing, landing-themes, hub-japan, hub-singapore, hub-belgium,
    accessibility, method, search-guides, states) vs `before-*`; metrics `w2-metrics.json` (0 overflow, 0 targets < 44 on FE-B pages, 0 JS errors).
- 2026-10-10 · **FE-B** · Wave 2 slice 2 · session_01Uw8kyZKduvy2VTdhJQa5L4 · merged platform W2 (8104ff6) and switched tiles to its
  `guide.tileLine` (gap #3 + #10): Cleveland "Polish Boy · corned beef · Haserot Angel", Pittsburgh "pierogi · fish sandwich ·
  Point State Park", NYC "slice · bagel · Empire State Building", Chinatown "chicken rice · laksa · Sri Mariamman Temple";
  topped up from the most-recommended records where the line is short (Wheeling). ★ line = platform `guide.signature` when it
  is a collection (Japan anime); food signatures are already the tile line, so no publisher ★ anywhere. Test: every
  signature item is a platform canon part or an open record of the page. **PLT note:** Youngstown's canon splits
  "Brier Hill pizza" into "Brier Hill · pizza" (`guide.tileLine.parts`). Gates PASS.

- 2026-10-10 10:45Z · orchestrator · Owner request: add switchable view styles for Round 3. The owner's site melon-seek was copied for reference (`design/reference/melon-seek/`, from source commit 15ed02b) to study its map / chart / insight modes. The view-styles design lane (session_01L6JkDa7v56jUKxQFqx7zXx) is producing the study, specs, mockups and build plan for Gallery, Atlas, Guidebook and Insights in `design/beta/views/`. New owner naming rule recorded in BETA-PROGRAM.md rule 6: no third-party brand or style is named in new work. Removed one brand reference from W2-BRIEFS.
- 2026-10-10 · **FE-B** · Wave 2 slice 3 · session_01Uw8kyZKduvy2VTdhJQa5L4 · night edition + contrast pass on FE-B pages.
  QA harness (`beta:metrics --only`, qa/ restored after): landing, Japan, Belgium, accessibility = **0 AA failures light and
  night** (fixed the accessibility page's primary button, which inherited prose link colour). Dark-mode overrides for tile
  dots / theme counts (gilt-soft is dark at night → gilt; area-coloured dots → city-ink on wash/paper tiles).
  Night shots: `w2-night-landing-tiles-d.jpg`, `w2-night-hub-japan-d.jpg`; all `w2-*` re-shot. Gates PASS.
  **FE-B backlog status (for PM):** M2-12 review · M2-09 review (guides group + keyboard nav) · M2-02 hub share review ·
  QA-13 plural fixed · ROUND-1 gap #3 review (signature lines, compositions, editorial rail, country hero).
