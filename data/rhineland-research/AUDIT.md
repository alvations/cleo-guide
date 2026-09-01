# The Rhineland (Cologne · Bonn · Düsseldorf) — audit ledger

Append-only, one section per pipeline stage. Target density: as dense as the SaarLorLux region (~287),
deep in each of the three cities. See [docs/PIPELINE.md](../../docs/PIPELINE.md).

## Scaffold (2026-09-01)
- Areas (3, the lower-Rhine triangle, ONE map page): `KOLN` (Cologne/Köln), `BONN`, `DUS` (Düsseldorf).
- Cuisines: GER, BEER (Kölsch/Altbier/Brauhaus), FINE, JP (Little Tokyo), INT, SWEET, CAFE, VEG.
- Collections: ICON, UNESCO (Kölner Dom), HIST, ARCH, MUS, RIVER (the Rhine), PARK, MKT, NIGHT, FREE.
- `consolidate.py` + `tools/build-rhineland.py` cloned from the aachen/saarland pipeline (trimmed-bounds
  midpoint centring, near-duplicate dedup). Registered `rhineland` in research.js, geocode-status.py,
  rebuild-city.py; empty `data/geocodes.json["rhineland"]` entry. Grouped under the Germany country hub.

## Discovery — (append per wave; iterate to density)
