# Wave 4 lane briefs (Round 4 build)

Issued by the orchestrator on 2026-10-10 from `design/beta/eval/ROUND-3.md`: 80.8 overall, with A 71 (look & feel) still below the A ≥ 80 goal. Gap #1 (photographs) needs owner action because the image hosts are blocked by the environment network policy. Every lane reads **Common** first, then its own section. QA continues in its existing session.

## Common

You are a lane agent in the cleo-guide BETA program, Wave 4 (build round 4 of 5). Repo branch: claude/peaceful-goodall-i0hsrt — commit and push ONLY there. `git pull --no-rebase origin claude/peaceful-goodall-i0hsrt` before every push; retry on race; never reset --hard, never force-push. Commit with explicit paths (never `git add -A`). Commit trailer:
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01PCNcUkfa5S1N1BKGzZA4xx

Read first: CLAUDE.md → docs/BETA-PROGRAM.md (scope + non-negotiables + evaluation rounds) → design/beta/eval/ROUND-3.md (latest scorecard 80.8 = A71 B84 C91 D88; its "Top 10 remaining gaps" mapped to your lane are YOUR WORK LIST; the remaining goal is A ≥ 80, i.e. look & feel) → design/beta/views/SPEC.md → design/beta/views/mockups/ + screenshots/ (the target look) → design/beta/RFC-architecture.md (§5.5 markup contract, §9.1 file ownership — edit ONLY the files your lane owns) → design/beta/DESIGN-SYSTEM.md → docs/BETA-BACKLOG.md → docs/BETA-QA.md (latest W3 section, open defects for your lane — fix those first).

Hard rules: beta-scope only (beta/, tools/beta*, design/beta/, docs/BETA-*) — never the live site, live builders or data/. Keep EVERY place (generator count asserts must hold; never cap/hide/paginate places away). Attribution visible on every card; closed places stay, flagged. No fabrication (places, photos, ratings, prices, hours, quotes). Content renders without CDN; no document.write; every localStorage call in try/catch; OSM/Esri tiles only. No third-party brand names/logos/trade dress. Cuisine/interest keys on cuisine/collection ids, never dish keywords (Wenwen rule). Owner rule 6: never name or allude to any third-party travel, hotel, review or guidebook brand or style in anything you write — docs, code, comments, CSS classes, commits, filenames, UI copy (source attribution chips exempt). WebFetch and Wikimedia hosts are blocked by the environment network policy — do NOT route around it in any way (no GitHub Actions/CI fetchers, no proxies, no mirrors).

Generated files under beta/ are never hand-edited: change source in tools/beta/, run `cd tools && npm run beta`, commit regenerated output with your source. Before EVERY commit: `cd tools && npm run validate && npm test && npm run beta:check` all green. Take Playwright screenshots (Chromium preinstalled; never `playwright install`) at 390×844 and 1440×900 of what you changed into design/beta/eval/w4/<lane>/ and reference them.

Coordinate through files: append one entry per push to docs/BETA-LOG.md (date, lane, what, SHAs, screenshots). Mark your backlog items' status in your lane's notes in docs/BETA-LOG.md (PM owns BETA-BACKLOG.md). Do not stop to ask questions — make the sensible call and log it. Work in small pushed increments (every meaningful slice) so other lanes see it. When done, finish with a ≤250-word report: gaps closed (by ROUND-1 gap #), SHAs, screenshots, what's left.

## Lane: designer

DESIGNER + IMAGERY ART — ROUND-3 gaps #3 (Gallery cover variety: a category motif per kind (shrine, noodle bowl, museum, …; original generic SVG, never a specific venue), plate colour by tier, crop/zoom by pin, vertical plate only for CJK names, no two adjacent cards with the same composition) and #5 (motion-safe micro-interactions: save heart + stamp, rail-door press, sheet rise, view-switch cross-fade, Insights bars growing on first view; nothing autoplays; all off under prefers-reduced-motion), plus the CSS half of #2 (Guidebook phone dek/stat-line wrap not clip; Gallery hero title clear of subtitle and pin dots; Insights dates never break mid-token). You may edit beta/assets/**, beta/assets/img/** motif art and tools/beta/imagery/**, and the cover markup hook in tools/beta/lib/render/gallery.js only if needed (log it). Write design/beta/REVIEW-W4.md with before/after screenshots. Target: look & feel A ≥ 80 without photos.

## Lane: fe-a

FRONTEND A — ROUND-3 gap #2 (markup/JS half): one name field with diacritics everywhere ('Kanda Myōjin', hero 'Jōnan · Jōsai · Jōhoku'); a Gallery switcher glyph that isn't the heart; the phone-map items listed in ROUND-3 #2. Gap #4: make Gallery the default view (flip DV) ONLY after confirming beta:qa:views G1 488/488 and B-01 ≤ 1.0 with the lead card visible on phones; if any check fails, keep Atlas and log why. Gap #5 JS hooks for the designer's motion (classes/events only, reduced-motion respected). Coordinate with the designer via BETA-LOG notes.

## Lane: platform-feb

PLATFORM + FRONTEND B (combined lane this wave; you may edit platform- and FE-B-owned files per RFC §9.1) — ROUND-3 gaps #6 (Guidebook lazy chapters: contents first, chapters mounted on approach, Tokyo initial DOM ≤ 3 k with every place still reachable via contents/search/deep link — the P-04 reachability gate must stay green; trim Tokyo transfer < 2.0 MB; landing FCP at 4× CPU ≤ 1.0 s), #8 (multilingual scaffolding: string catalogue, pseudo-locale test, hreflang, switcher hidden until a reviewed locale exists), #9 (human-readable per-city 'What changed' page from the existing Atom data, linked from the masthead's 'last checked' line), and #7 residue if any (Insights bar links ≥ 24 px tall with table fallback).
