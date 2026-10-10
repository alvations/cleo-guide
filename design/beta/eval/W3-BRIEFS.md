# Wave 3 lane briefs (Round 3 build: view styles)

Issued by the orchestrator on 2026-10-10 from `design/beta/views/PLAN.md`, plus the top-10 gaps in `design/beta/eval/ROUND-2.md`. Each lane session reads **Common**, then its own section.

## Common

You are a lane agent in the cleo-guide BETA program, Wave 3 (build round 3 of 5). Repo branch: claude/peaceful-goodall-i0hsrt — commit and push ONLY there. `git pull --no-rebase origin claude/peaceful-goodall-i0hsrt` before every push; retry on race; never reset --hard, never force-push. Commit with explicit paths (never `git add -A`). Commit trailer:
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01PCNcUkfa5S1N1BKGzZA4xx

Read first: CLAUDE.md → docs/BETA-PROGRAM.md (scope + non-negotiables + evaluation rounds) → design/beta/views/SPEC.md + PLAN.md (THE Wave 3 work list: the four view styles) → design/beta/eval/ROUND-2.md (latest scorecard; its "Top 10 gaps" mapped to your lane are your second work list; goal ≥80 overall with A≥80 and C≥80) → design/beta/views/mockups/ + screenshots/ (the target look) → design/beta/RFC-architecture.md (§5.5 markup contract, §9.1 file ownership — edit ONLY the files your lane owns) → design/beta/DESIGN-SYSTEM.md → docs/BETA-BACKLOG.md → docs/BETA-QA.md (latest W2 section, open defects for your lane — fix those first).

Hard rules: beta-scope only (beta/, tools/beta*, design/beta/, docs/BETA-*) — never the live site, live builders or data/. Keep EVERY place (generator count asserts must hold; never cap/hide/paginate places away). Attribution visible on every card; closed places stay, flagged. No fabrication (places, photos, ratings, prices, hours, quotes). Content renders without CDN; no document.write; every localStorage call in try/catch; OSM/Esri tiles only. No third-party brand names/logos/trade dress. Cuisine/interest keys on cuisine/collection ids, never dish keywords (Wenwen rule). Owner rule 6: never name or allude to any third-party travel, hotel, review or guidebook brand or style in anything you write — docs, code, comments, CSS classes, commits, filenames, UI copy (source attribution chips exempt). WebFetch and Wikimedia hosts are blocked by the environment network policy — do NOT route around it in any way (no GitHub Actions/CI fetchers, no proxies, no mirrors).

Generated files under beta/ are never hand-edited: change source in tools/beta/, run `cd tools && npm run beta`, commit regenerated output with your source. Before EVERY commit: `cd tools && npm run validate && npm test && npm run beta:check` all green. Take Playwright screenshots (Chromium preinstalled; never `playwright install`) at 390×844 and 1440×900 of what you changed into design/beta/eval/w3/<lane>/ and reference them.

Coordinate through files: append one entry per push to docs/BETA-LOG.md (date, lane, what, SHAs, screenshots). Mark your backlog items' status in your lane's notes in docs/BETA-LOG.md (PM owns BETA-BACKLOG.md). Do not stop to ask questions — make the sensible call and log it. Work in small pushed increments (every meaningful slice) so other lanes see it. When done, finish with a ≤250-word report: gaps closed (by ROUND-1 gap #), SHAs, screenshots, what's left.

## Lane: platform

PLATFORM — PLAN.md §1 items P-01…P-06 (rank/kind3 model, Cleo.lens/Cleo.order + count line, insights block, per-view reachability gate in npm test, template chunks per view keeping Tokyo/NYC initial DOM ≤3,000, route key registry), plus the RFC §9.1 ownership rows for the new view files (PLAN §0). Land P-01…P-03 and P-06 FIRST and announce them in BETA-LOG — every other lane builds on them. Then ROUND-2 gaps mapped to platform.

## Lane: fe-a

FRONTEND A — PLAN.md §2 items A-01…A-05: the view switcher + registry (client/views.js; hash → stored preference → default; other lanes plug views in via the registry), Atlas (today's page re-laid out with ranked tray + detents), Gallery (hero, category rows, paged All-N grid with page numbers + show-all + 'all N places' line), the experience page sheet layout, and sheet additions in every view. Build A-01 first (once platform's P-02/P-06 land — read BETA-LOG; stub against the documented API if not yet there) and announce the registry hook in BETA-LOG for FE-B. Then ROUND-2 gaps mapped to FE-A.

## Lane: fe-b

FRONTEND B — PLAN.md §3 items B-01…B-04: Guidebook view module (area chapters, contents, data-templated intros, sections, entries), Insights view module (stat tiles + 7 inline-SVG chart cards from platform's insights block, captions/legends/'Show as a table', every bar a lens link), print stylesheet hooks + sources appendix, hub entry points ('Read as a guidebook' → #view=). Plug into FE-A's view registry (watch BETA-LOG for the hook; build your modules against the SPEC'd interface meanwhile). Then ROUND-2 gaps mapped to FE-B.

## Lane: designer

DESIGNER — PLAN.md §4 items D-01…D-04: beta/assets/views.css from design/beta/views/tools/views.css keyed on html[data-view]; chart tokens (the validated light/dark series sets in PLAN D-02); Gallery cover rules; then a visual review of each view as it lands → design/beta/REVIEW-W3-views.md, filing defects via BETA-LOG notes. Then ROUND-2 look-and-feel gaps (target A ≥ 80).

## Lane: qa

QA — PLAN.md §5 items Q-01…Q-04: metrics.js per-view runs, no-CDN + storage-blocked runs per view, deep-link matrix (#view × #p × lenses × pg/all, Back/Forward), honesty greps (no price/rating/booking/hours strings; no third-party brand outside data-recommender attribution). Build the harness while lanes build; as each view lands, run it and file defects to lanes via BETA-LOG + BETA-QA.md. When all lanes report done, run the full pass and write a W3 section ending in 'QA sign-off: YES' or 'QA sign-off: NO' + named blockers.
