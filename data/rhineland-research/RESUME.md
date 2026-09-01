# The Rhineland (Cologne · Bonn · Düsseldorf) — RESUME (read first to continue)

## State
Scaffolded 2026-09-01, registered end-to-end (`python3 tools/rebuild-city.py rhineland --build`). Grouped
under the Germany country hub. Discovery iterating toward **SaarLorLux density (~287)** across 3 areas.

## Density targets (iterate until met — do NOT compromise)
- `KOLN` Cologne — ~100 (55 sights + 45 food) · `BONN` — ~65 · `DUS` Düsseldorf — ~80. Total ≥ ~245.
Run discovery in **sequenced waves** (WebSearch budget is shared & caps at 200/run); each wave appends new
places, logs held/single-source candidates in AUDIT.md, and we iterate until the target is met.

## The loop (per docs/DENSITY.md)
1. Discovery wave (in-DE, ≥2 credible, beer/Brauhaus + Michelin + creators). 2. `consolidate.py` →
`cp sr_dataset.json ../rhineland.dataset.json`. 3. `python3 tools/density.py rhineland` to see gaps.
4. Repeat discovery on thin areas until dense. 5. Geocode waves (Wikidata for landmarks; held food to the
helper). 6. `build-rhineland.py` + all gates. 7. Only relink/announce when dense + gated.

## Acceptance
- [ ] Each area ≥ its density target; 0 single-source in the built page. [ ] Every pin verified in
  geocodes.json; UNVERIFIED held, never faked. [ ] Every status checked; closed flagged. [ ] `--buildcheck`
  PASS (centres on the Rhine triangle). [ ] All 3 areas ≥1 tier-1 must-see.
