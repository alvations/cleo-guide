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
(none)

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
