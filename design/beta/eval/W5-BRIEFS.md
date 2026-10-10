# Wave 5 lane briefs (final build round)

Issued by the orchestrator on 2026-10-10 from `design/beta/eval/ROUND-4.md`: 83.4 overall, A 74. This is the last build round. Gap #1 (photographs) is still blocked on owner action. Every lane reads **Common** first, then its own section. QA continues in its existing session, which owns gap #9 (harness blind spots).

## Common

You are a lane agent in the cleo-guide BETA program, Wave 5 (FINAL build round, 5 of 5). Repo branch: claude/peaceful-goodall-i0hsrt — commit and push ONLY there. `git pull --no-rebase origin claude/peaceful-goodall-i0hsrt` before every push; retry on race; never reset --hard, never force-push. Commit with explicit paths (never `git add -A`). Commit trailer:
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01PCNcUkfa5S1N1BKGzZA4xx

Read first: CLAUDE.md → docs/BETA-PROGRAM.md (scope + non-negotiables + evaluation rounds) → design/beta/eval/ROUND-4.md (latest scorecard 83.4 = A74 B85 C96 D89; its "Top 10 remaining gaps" mapped to your lane are YOUR WORK LIST; the remaining goal is A ≥ 80 — look & feel needs +6) → design/beta/views/SPEC.md → design/beta/views/mockups/ + screenshots/ (the target look) → design/beta/RFC-architecture.md (§5.5 markup contract, §9.1 file ownership — edit ONLY the files your lane owns) → design/beta/DESIGN-SYSTEM.md → docs/BETA-BACKLOG.md → docs/BETA-QA.md (latest W4 section, open defects for your lane — fix those first).

Hard rules: beta-scope only (beta/, tools/beta*, design/beta/, docs/BETA-*) — never the live site, live builders or data/. Keep EVERY place (generator count asserts must hold; never cap/hide/paginate places away). Attribution visible on every card; closed places stay, flagged. No fabrication (places, photos, ratings, prices, hours, quotes). Content renders without CDN; no document.write; every localStorage call in try/catch; OSM/Esri tiles only. No third-party brand names/logos/trade dress. Cuisine/interest keys on cuisine/collection ids, never dish keywords (Wenwen rule). Owner rule 6: never name or allude to any third-party travel, hotel, review or guidebook brand or style in anything you write — docs, code, comments, CSS classes, commits, filenames, UI copy (source attribution chips exempt). WebFetch and Wikimedia hosts are blocked by the environment network policy — do NOT route around it in any way (no GitHub Actions/CI fetchers, no proxies, no mirrors).

Generated files under beta/ are never hand-edited: change source in tools/beta/, run `cd tools && npm run beta`, commit regenerated output with your source. Before EVERY commit: `cd tools && npm run validate && npm test && npm run beta:check` all green. Take Playwright screenshots (Chromium preinstalled; never `playwright install`) at 390×844 and 1440×900 of what you changed into design/beta/eval/w5/<lane>/ and reference them.

Coordinate through files: append one entry per push to docs/BETA-LOG.md (date, lane, what, SHAs, screenshots). Mark your backlog items' status in your lane's notes in docs/BETA-LOG.md (PM owns BETA-BACKLOG.md). Do not stop to ask questions — make the sensible call and log it. Work in small pushed increments (every meaningful slice) so other lanes see it. When done, finish with a ≤250-word report: gaps closed (by ROUND-1 gap #), SHAs, screenshots, what's left.

## Lane: fe-a

FRONTEND A — ROUND-4 gap #2: Gallery as default. Give the phone Gallery a real place card inside the first screen (B-01 ≤ 1.0; today 2.4–2.65) and make G1 hold for a paged default (deep link, search, show-all and no-JS reach 100 %; agree the 'scrolled' criterion with QA in BETA-QA.md — never weaken reachability). Flip DV to Gallery ONLY if every gate passes; otherwise keep Atlas and log the evidence. Gap #3: the masthead 'last checked' link — restore the space, 44 px target without breaking line spacing, keep it off the first-card path.

## Lane: designer

DESIGNER + IMAGERY ART — ROUND-4 gap #4 (macrons invisible at DPR 1: give display names a face/weight with visible macrons at 18–24 px, verify at DPR 1 on 'Kanda Myōjin' etc.), gap #6 (cover motif keyed on the place's kind/collection id, never on the generic glyph or description keywords; audit the top glyph→motif pairs per city), plus any remaining look-and-feel polish in ROUND-4 under A that is CSS/art (cite each). Update design/beta/REVIEW-W5.md with before/after. Target A ≥ 80 without photos.

## Lane: platform-feb

PLATFORM + FRONTEND B (combined) — ROUND-4 gap #5 (Tokyo transfer < 2.0 MB: drop the unversioned duplicate art/<key>/map.svg fetch; mount the Insights index lazily to ≤ 3 k nodes), gap #8 (Insights rows: a 44 px row hit area — whole label + bar — or table as the phone default), and gap #7 groundwork only (put landing + hub strings on the catalogue; do NOT ship machine output presented as a reviewed locale — the switcher stays hidden until the owner reviews one).
