# RESUME — Liège (`liege`)

## Targets (read by `tools/density.py liege`)
- `LIE` Liège city … ~85
- `LIER` around Liège … ~60

## State
- 2026-10-02: scaffolded (consolidate.py, _AGENT_BRIEF.md, AUDIT.md, RESUME.md, tools/build-liege.py). Discovery not started.

## In-flight wave
- (none)

## Next actions
1. Wave 1 discovery (LIE sights, LIE food canon + beer, LIER sights, LIER food).
2. `python3 tools/density.py liege`; iterate on NEED areas.
3. Geocode → geo/_geoout_liege_*.json; `flock $LOCK python3 tools/rebuild-city.py liege --build`.

## Commands
```bash
python3 tools/density.py liege
LOCK=/home/user/cleo-guide/.git/cleo-shared.lock
flock -w 3600 $LOCK python3 tools/rebuild-city.py liege --build
```
