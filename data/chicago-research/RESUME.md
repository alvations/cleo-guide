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
- 2026-10-02 (session 1): scaffold created. W1 BLOCKED by the shared 200-search cap.
- 2026-10-02 (session 2, this run): **100 places sourced (50 sights + 50 food), 72 pinned & rendered**;
  all 4 gates + validate + test green. Page `cities/chicago.html` builds (SW hidden until a SW pin lands).
  Files: FOOD_CANON.json (30), FOOD_MICHELIN.json (20), SIGHTS_W1.json (33), SIGHTS_W2.json (17);
  geo/_geoout_canon.json, _geoout_michelin.json, _geoout_sights.json.
  UNVERIFIED pins held (28): most restaurants without a Wikipedia article — see docs/GEOCODE-BACKLOG.md.
- **Geocoding lesson:** WebSearch summaries rarely surface latlong/!3d!4d pins for small restaurants
  (13/20 failed at 1 search each). Wikipedia batches of 4 names per query (allowed_domains en.wikipedia.org)
  return published coords reliably — use them for sights and Wikipedia-notable restaurants; leave the rest
  to tools/geocode-helper.html.
- Search count (session 2): ~95 of the session budget used so far (main + 2 geocode subagents).

## In-flight wave
W3 — more sights (Wikipedia-pinned) per area + food canon 2nd-sources (Papa's Cache Sabroso, Uncle Remus,
Harold's, Rainbow Cone, Garrett, Portillo's, Chicago Mag Iconic Eats list in AUDIT) + a creator query.

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
