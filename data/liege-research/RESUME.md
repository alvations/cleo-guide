# RESUME — Liège (`liege`)

## Targets (read by `tools/density.py liege`)
- `LIE` Liège city … ~85
- `LIER` around Liège … ~60

## State
- 2026-10-02: scaffolded + wave 1 PARTIAL. Discovered 5 (LIE 3 sights + 2 food; LIER 0) vs target 145.
  1 geocoded (Grand Curtius). **Blocked: WebSearch session budget (200/200) exhausted after 11 searches** — needs a
  fresh session / raised CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION. Not built; card still "being built".

## In-flight wave
- W1 remainder (resume here): run the "Not yet searched" list in `_PENDING_LEADS.md`, then corroborate/address the
  held leads there. Append to FOOD_LIEGE_LIE.json / SIGHTS_LIEGE_LIE.json and create *_LIER.json files.

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
