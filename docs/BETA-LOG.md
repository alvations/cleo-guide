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
