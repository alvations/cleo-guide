# Chicago (`chicago-il`) — RESUME (read first to continue)

## Targets (per area; parsed by tools/density.py — sum ≈ 510, New York density)
- `LOOP` The Loop & Downtown ~110
- `NORTH` North Side ~85
- `NW` Northwest Side ~80
- `WEST` West Side ~50
- `SOUTH` South Side ~60
- `SW` Southwest Side ~25
- `FAR` Far South ~30
- `SUB` Suburbs & North Shore ~50
- `DAY` Day trips ~20

## State
- 2026-10-02: scaffold created (consolidate.py, _AGENT_BRIEF.md, AUDIT.md, RESUME.md, tools/build-chicago.py,
  data/sources.json `chicago-il` entry). No places yet.

## In-flight wave
**W1 FOOD_CANON (BLOCKED, not started)** — 2026-10-02: the session-wide WebSearch cap was already exhausted
("this session has used its web search budget (200 of 200 WebSearch calls)") after only 3 calls by this agent —
the ~16 concurrent agents share one 200-call budget. WebFetch is blocked by policy. No places can be sourced,
status-checked or geocoded without search, and nothing may be added from memory (CLAUDE.md 4a/4c, D1).
- Files it will write: `FOOD_CANON.json`, `geo/_geoout_canon.json`.
- Queries still to run (all): Italian beef (Tribune/Chicago Mag/Eater rankings: Al's #1, Johnnie's, Mr. Beef,
  Bari, Jay's, Portillo's); deep-dish (Lou Malnati's, Pequod's, Gino's East, Uno); tavern-style (Vito & Nick's,
  Pat's, Marie's, Phil's, Candlelite); hot dog + Maxwell St Polish (Superdawg, Gene & Jude's, Jim's Original,
  Wolfy's); jibarito (Borinquen, Papa's Cache Sabroso, Jibaritos y Más); Harold's/mild sauce + rib tips (Lem's,
  Uncle John's); Rainbow Cone; Garrett; Michelin Chicago Bib + stars list; James Beard America's Classics Chicago.
- Partial leads saved in `_PENDING_LEADS.md` (7 places; none complete).
- **Resume condition:** relaunch with a fresh/raised WebSearch budget (CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION)
  — ideally a dedicated session for Chicago, since ~500 places needs ~700–900 searches (discovery + pin + status).

## Next actions (ordered)
1. Wave 1 food canon (FOOD_CANON.json) → wave 2 Michelin/JB (FOOD_MICHELIN.json) → sights per area (SIGHTS_<AREA>.json)
   → immigrant corridors → creators. Measure `python3 tools/density.py chicago-il` after each.
2. Geocode each batch into `geo/_geoout_<tag>.json` (place pins: Wikipedia coords / latlong.net OSM POI /
   Google !3d!4d; never /@; UNVERIFIED if unresolvable) + status.
3. `flock -w 3600 /home/user/cleo-guide/.git/cleo-shared.lock python3 tools/rebuild-city.py chicago-il --build`
4. Go-live: relink `<!-- CARD:chicago-il -->` in index.html + CITIES.md row.

## Commands
```
python3 tools/density.py chicago-il
flock -w 3600 /home/user/cleo-guide/.git/cleo-shared.lock python3 tools/rebuild-city.py chicago-il --build
```

## Acceptance checklist
- [ ] every area OK in density.py
- [ ] --sourcecheck / --geocheck / --statuscheck / --buildcheck green
- [ ] npm run validate && npm test green
- [ ] card live + CITIES.md row + AGENT-PROMPTS run-log rows
