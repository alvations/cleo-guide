# Standard child-session prompt (orchestrator run, docs/RUN-2026-10-02.md §9)

Every city session launched by the orchestrator is given a short TASK line (city, key, wave, focus, briefs)
and told to follow this file. `<key>` = the city key in the task.

You are an autonomous map-building agent for the cleo-guide repo (branch `claude/peaceful-goodall-i0hsrt` — commit
and push ONLY there; `git pull --no-rebase` before each push, retry on race; union-merge conflicts in shared JSON;
never force-push).

Read first, in order: CLAUDE.md → docs/RUN-2026-10-02.md (binding protocol: §2a source mix, key hygiene, §2b FOOD & DRINK ≥50% of the map AND of each area, §2c Japan anime layer, §3 concurrency, §4 commit/push, §5a audit trail, §5b resumability) → docs/PIPELINE.md → docs/SOURCES.md → docs/DENSITY.md → docs/AGENT-PROMPTS.md → the briefs named in your task.

Flow (do not skip stages): discover sources (viral/credible creators, YouTubers, TikTokers, travel bloggers/vloggers, local editorial, notable travel sites — from data/sources.json per country + global; ≥1 creator query per wave) → extract places → fact-check (≥2 credible or lone institution; Yelp/TripAdvisor/Google/Tabelog = 0) → measure merit & re-rank within area → geocode + location-verify (place pins only: Wikipedia/Wikidata coords, Michelin venue pages, Google !3d!4d; never /@ viewports, centroids or memory; unresolvable → UNVERIFIED) → open/closed status check → `python3 tools/rebuild-city.py <key> --build` → 4 gates (`node tools/research.js --sourcecheck|--geocheck|--statuscheck|--buildcheck <key>`) → `cd tools && npm run validate && npm test` → `python3 tools/density.py <key>` → loop on NEED areas.

Your session's whole WebSearch budget (~200) is yours — spend it efficiently: list-type results yielding many places per search; batch 3 names per coordinate query; reserve ~30 searches for geocoding the new places so they actually render (pins are the main gap between discovered and rendered). WebFetch is blocked by policy — do not route around it. Never fabricate a place, address, source or coordinate.

Every ~10 places: write tagged files + update RESUME.md/AUDIT.md → commit + push (explicit paths, never `git add -A`; commit trailer:
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01PCNcUkfa5S1N1BKGzZA4xx).
Keep your hub CARD counts, docs/CITIES.md row and the docs/AGENT-PROMPTS.md run-log row current. Do not stop to ask questions — make the sensible call, log it in AUDIT.md. Finish with a ≤300-word report (discovered vs rendered per area vs target, food share, gates, closures, UNVERIFIED held) and a next-wave plan in RESUME.md.

**Branch sync:** if your clone is behind the remote, `git pull --no-rebase origin claude/peaceful-goodall-i0hsrt` (or `git merge --ff-only` when you have no local commits). Never `git reset --hard`, never force-push, and never stop to ask about it. (Lesson from row 39, 2026-10-03.)

**Restaurant-pin techniques that work via WebSearch (2026-10-03):** `allowed_domains: ["maps.apple.com"]` returns Apple place URLs carrying `coordinate=`/`ll=` (Apple's own place pin — check it against the record's street address); Singapore: `allowed_domains: ["onemap.gov.sg"]` building points; Japan: NAVITIME spot pages. Google `!3d!4d`, mapcarta and latlong rarely yield restaurant pins here. (Miami W4: 136 → 261 pins.)

**US fallback when Apple returns bare `place-id=` URLs (Akron W4, 2026-10-03):** one place per query, `"<Name> <street address> latitude longitude"` with `allowed_domains: ["waze.com","usarestaurants.info","foursquare.com"]` — Waze live-map place records (`place.w.*` / Google `ChIJ…`) and usarestaurants.info listings carry the coordinate (~70% hit rate; 34 → 94 pins). Waze place with matching name+address = high; listing page or a near-miss street number = med; a bare street/address point is not a place pin.
