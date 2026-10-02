# Akron · Kent · Canton — RESUME checkpoint (read first)

Resume order: **this file → AUDIT.md → _AGENT_BRIEF.md**. Rebuild: `python3 tools/rebuild-city.py akron-oh --build`
(under the shared lock). Density: `python3 tools/density.py akron-oh`.

## Density targets (Pittsburgh peer ~210; parsed by tools/density.py)
- `AKR` Akron city (downtown, Highland Square, North Hill, Firestone Park, Merriman Valley) ~60
- `NSUM` Cuyahoga Falls / Stow / Hudson / north Summit to the Cuyahoga line ~35
- `KENT` Kent & Portage County ~30
- `BARB` Barberton / Norton / Wadsworth / Green ~20
- `CANT` Canton / North Canton / eastern Stark ~45
- `MASS` Massillon & southern Stark ~20

## Acceptance
- [ ] Every area at target (density.py all OK) — credible places only, no padding.
- [ ] `--sourcecheck` PASS · `--geocheck` PASS · `--statuscheck` CONSISTENT · `--buildcheck` PASS.
- [ ] Pin placement re-verified; UNVERIFIED held for the browser helper.
- [ ] index.html card relinked live; docs/CITIES.md row.

## State
- 2026-10-02 scaffold: consolidate.py (6 areas, Akron-Canton cuisine taxonomy), brief, build-akron.py.
