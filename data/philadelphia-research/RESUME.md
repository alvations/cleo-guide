# Philadelphia — RESUME (read this first to continue)

Key `philadelphia-pa` · slug `philadelphia` · page `cities/philadelphia.html` · dataset `data/philadelphia.dataset.json`.
Brief: `_AGENT_BRIEF.md`. Ledger: `AUDIT.md` (append-only). Protocol: `docs/RUN-2026-10-02.md`.

## Density targets (NYC-dense, ~500 total; parsed by tools/density.py)
- `CC` Center City, Old City & the Parkway — ~125
- `SPH` South Philly — ~85
- `FISH` Fishtown, Northern Liberties & Kensington — ~55
- `UCW` University City & West Philly — ~40
- `NPH` North Philly, Fairmount Park & Brewerytown — ~30
- `NW` Northwest (Germantown, Chestnut Hill, Manayunk) — ~45
- `NE` Northeast Philly — ~25
- `MAIN` The Main Line & suburbs — ~35
- `SJ` South Jersey & the Camden edge — ~25
- `DAY` Brandywine, Valley Forge & day trips — ~35

## Commands
```bash
python3 tools/density.py philadelphia-pa                       # discovered per area vs target
LOCK=/home/user/cleo-guide/.git/cleo-shared.lock
flock -w 3600 $LOCK python3 tools/rebuild-city.py philadelphia-pa           # prep + sourcecheck
flock -w 3600 $LOCK python3 tools/rebuild-city.py philadelphia-pa --build   # + geo-merge, build, 4 gates, backlog
```

## In-flight wave
(none)

## State
- 2026-10-02 scaffold: consolidate.py, _AGENT_BRIEF.md, AUDIT.md, RESUME.md, tools/build-philadelphia.py.

## Next actions (ordered)
1. W1 sights backbone (Wikipedia/NPS/Visit Philly) per area — anchors a tier-1 per area.
2. W1 food canon (cheesesteak/roast pork/hoagie/tomato pie/pretzel/water ice/scrapple, RTM, Italian Market).
3. Michelin Philadelphia 2025 + James Beard bench; then cuisine deep-dives (Mexican S 9th, Vietnamese Washington Ave, Cambodian/Indonesian).
4. Geocode waves → rebuild --build → gates → go-live card. Iterate density.

## Acceptance checklist
- [ ] every area OK in density.py
- [ ] --sourcecheck / --geocheck / --statuscheck / --buildcheck green
- [ ] npm run validate && npm test green
- [ ] index card live with counts; CITIES.md row; AGENT-PROMPTS run-log rows
