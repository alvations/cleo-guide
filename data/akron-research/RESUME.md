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

## In-flight wave (BLOCKED — resume here)
- **W1 food canon** started 2026-10-02 and was cut off by the **session WebSearch cap (200/200, shared by
  ~16 concurrent agents — exhausted before this agent's 2nd search)**. WebFetch is blocked by policy; nothing
  may be added from memory. Done: 1 search (Barberton chicken) → Belgrade Gardens recorded (BARB, 4 sources).
- Files: `FOOD_W1CANON.json` (1), `SOURCES_W1.json` (5 outlets, registered in data/sources.json akron-oh),
  `geo/_geoout_w1_canon.json` (Belgrade UNVERIFIED, status open).
- **Queries still to run (W1, in order):** Milich's Village Inn (Barberton chicken; White House + Hopocan are on
  cleveland.html — skip) · Swenson's Galley Boy (original Akron drive-in) · Strickland's frozen custard ·
  Taggart's Bittner (Canton) · Bender's Tavern (Canton) · North Hill Nepali/Bhutanese (Little Asia) · Akron
  Italian (Luigi's, Papa Joe's) · Canton coney / Kennedy's · Kent college-town canon (Ray's Place…) · ABJ /
  CantonRep / Akron Life / Signal Akron best-of lists · creators (YouTube/TikTok "Akron food", "Canton Ohio food").
- **Then W2 sights:** Pro Football Hall of Fame · Stan Hywet · Akron Art Museum · Goodyear/Soap Box Derby
  (Derby Downs) · McKinley Presidential Library & Memorial · First Ladies NHS (NPS = lone authority) · Kent State
  May 4 Visitors Center (+ May 4 NHL) · Gervasi Vineyard · Akron Zoo · Summit Metro Parks (Gorge, F.A. Seiberling,
  Firestone) · Canal Fulton / Ohio & Erie Canal · Hudson green · Atlas Obscura Ohio index (Akron/Canton/Kent).
- Then W3+ per `NEED +N` area until `python3 tools/density.py akron-oh` is all OK; geocode waves
  (Wikipedia coords for sights; `!3d!4d` place pins only) → `flock … rebuild-city.py akron-oh --build`.

## State
- 2026-10-02 scaffold DONE + committed: consolidate.py (6 areas, Akron-Canton taxonomy), _AGENT_BRIEF.md,
  AUDIT.md, tools/build-akron.py (clone of build-erie.py; centre/labels derived; Cleveland-leak guard exempts
  regional outlet names), data/sources.json `akron-oh` entry (5 outlets). Dataset: 1 candidate (sourcecheck PASS).
  Page NOT built (0 geocoded pins) — the index card stays "being built".
- Density now: AKR 0/60 · NSUM 0/35 · KENT 0/30 · BARB 1/20 · CANT 0/45 · MASS 0/20 (1/210).
- Relaunch needs a session with fresh WebSearch budget (or CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION raised).
