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
