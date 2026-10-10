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
- 2026-10-10 · FE-B (landing, hubs, nav, method, states) · W1 · session_01PCNcUkfa5S1N1BKGzZA4xx · commits: see `git log --grep "W1 FE-B"`.
  - **W1 summary — status per ID** (measured by `tools/beta/fe-b-shots.js` → `design/beta/screenshots/w1-feb-metrics.json`, 390×844 DPR3 touch + 1440×900, all off-origin requests aborted; gates in `tools/beta/test-hubs.js`, now in `npm test`):
    - **M1-17 → review.** Landing (`render/landing.js`) = short night hero + site search, sticky country pills (live countries, `countries.json` order), then every live-country place page as a Constellation city tile: computed counts (`lib/stats.js`), native script (`row.nat`), signature line = ★ collection + count, else the 3 largest cuisines (data only), city skin (§3.3; others rotate; SG/VN lagoon), star-field art from the city's own open pins (≤ 44 dots). Mobile: **2 tiles fully above the fold** (2-up grid); desktop 4. Country hubs (`render/hub.js` `renderCountry`/`renderArchive`, incl. **Japan** and the SEA archive): 4 tiles above the fold on mobile, 5–8 desktop. Every live city linked from landing + its hub (test); hub counts == page (platform `assertHubPage` + test-hubs). Landing 66 KB raw (≤ 80).
    - **M1-18 → review.** `render/shell.js`: one top bar on all 94 generated pages (structure snapshot = 1 shape): wordmark → landing, breadcrumb Destinations › Country › City (hidden root on mobile), Destinations · How we choose, search, **"Your list"** heart. 60 px mobile / 68 px desktop (≤ 64 mobile ✓), sticky. Ships its own layout `<style>` so it is the same component on FE-A pages still on `cleo.css` (Tokyo header 60 px, no overflow). Mobile tab bar (Explore · Search · Your list · Method) on FE-B pages.
    - **M1-09 → review.** `beta/how-we-choose.html` (`render/method.js`): merit bar, ≥ 2 credible sources / lone Michelin·JBF, Yelp/TripAdvisor never recommender, within-area tiers (designer glyphs), pins, closures (closed kept), stated gaps, ADD/FADD, what we don't show. Stats computed at build: 8,458 places / 84 guides, named sources + citations, pinned (+ high confidence), closed, per-tier counts, last check. Linked from every footer (test). FE-A: link tier glyphs to `../how-we-choose.html#tiers`.
    - **M1-19 → review.** VOICE.md copy, each with a jsdom fixture (test-hubs) + screenshot: 0 results (`w1-feb-state-no-results-*`), index failed, offline banner (`client/states.js`, clears on reconnect), storage blocked on Your list / first save, unknown page (`beta/404.html` — note GitHub Pages only auto-serves the repo-root 404, which is live; this page is the state, reachable by link). Tiles-failed is platform/FE-A (c623495).
    - **M1-16 → review (FE-B pages).** Tap targets < 44 px: **0** on landing, hubs, archive, method, search, 404, at both viewports; overflowX 0; skip link, header/nav/main/footer landmarks, 0 unnamed controls, 0 JS errors. Not FE-B: `saved.html` (12–14) and city pages (300+) are FE-A body/footer under `cleo.css`. axe-core not run (not installed) — QA.
    - **M2-09 → scaffolded early (doing).** `client/search.js`: header search panel on every page (landing focuses hero search; `/` shortcut; Esc closes, focus restored), results grouped by guide, accent-folded (senso-ji → Sensō-ji `#p=`), lazy index, groups fold at 8 with "Show all N" (every match reachable). Native-name/collection/cuisine indexing is platform's index work.
  - **Coordinated edits outside FE-B files (one line each):** `render/common.js` head() optional `css` (Constellation pages skip `cleo.css`, whose selectors clash — UX-20); `build.js` versions `constellation.css` + SW-caches it, `shell.setSite()`, emits method/404; `render/city.js` + `render/saved.js` pass `rel` to `siteBar` (breadcrumb); `test-beta.js` page-set parity counts generator-declared beta-only pages; `tools/package.json` adds `test-hubs.js` to `npm test`. Merged platform's 967ac27/c623495 (hub skeleton → FE-B design on their `renderCountry`/`renderArchive` + `assertHubPage` contract).
  - **For DES:** shell layout rules live in `shell.js` `SHELL_CSS`/`TOPBAR_CSS` (tokens only) — fold into `constellation.css`. **For FE-A:** pass `css: styles(depth)` to `head()` when city/saved move to Constellation.
  - Checks: `npm run validate` + `npm test` PASS; `qa-site.js --only` each FE-B page: PASS 3/3 loads. Screenshots `design/beta/screenshots/w1-feb-*.jpg` (52, 3.4 MB).
