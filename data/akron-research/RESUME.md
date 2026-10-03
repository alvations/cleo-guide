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

## In-flight wave — resume here (W2, after the 2026-10-03 W1b first full wave)
- **W1b DONE 2026-10-03** (fresh session, ~156 WebSearch calls): 77 new places (41 sights + 35 food) + Belgrade = 78 in
  dataset, all sourcecheck PASS. Files: `FOOD_W1B.json`, `SIGHTS_W1B.json`, `SOURCES_W1B.json`, `geo/_geoout_w1b.json`
  (generated from the wave's records; edit the JSON directly from now on). Page **built and live** (29 pins).
- **Geocode backlog (do first next session):** 49 UNVERIFIED — all 36 food + 13 sights. Restaurants do not surface
  `!3d!4d` place pins via WebSearch (tried Swensons/Belgrade/Strickland's: viewport/street-level only) → run them through
  `tools/geocode-helper.html` (browser) and merge as a `geo/_geoout_helper_*.json`. Sights still unpinned: Wingfoot Lake
  hangar, Hoover Historical Center, Paul Brown Museum (street number unconfirmed — MassMu is 121 Lincoln Way E), St. Helena
  III, Spring Hill, F.A. Seiberling Nature Realm (address "828 Smith Rd" per one summary — confirm), Canton Museum of Art,
  Tallmadge church, Five Oaks, Twins Days, Liberty Park, Brady's Leap, Kent Stage.
- **Held (need 2nd credible source or status):** Momo House (1548 Home Ave; Signal Akron only) · Nepali Kitchen · Royal
  Palace (Bhutanese, E Tallmadge Ave) · Saffron Patch (1238 Weathervane Ln; Signal Akron ×2 = one outlet) · Kingfish,
  Thyme2, Twisted Olive, The River Merchant (Kent), Richfield Brewing, Stirling, 63 Corks (Akron Life only) · Sweet Mary's
  Bakery, Angel Falls Coffee, The Eye Opener, Lock 15, Constance Fromagerie, Frank's Place (Signal Akron only) · Mike's
  Place, Belleria, Guys Pizza (KentWired only) · Flury's Cafe, Boss ChickNBeer, River Brasserie (Cleveland Magazine only)
  · Papa Gyros (location unclear), Lucca, Francisco's Cantina (Repository panel only) · Blue Habanero, Doug's Classic 57,
  Gregory's, Pete's, Grumpy Troll, Samantha's (Visit Canton only) · Funny Noodle (Beacon Journal only) · Thirsty Dog (Akron
  Life only) · Papa Joe's (OpenTable only) · **Wild Goats Café** (KentWired + Akron Life but Uber Eats shows closed May
  2025 — status unverified) · Mélange (2nd source unclear) · Kent State University Museum, Glamorgan Castle, Hartville
  MarketPlace, West Branch SP, Canton Classic Car Museum (one org / sponsored / directory only).
- **Excluded by dedup rule:** Deep Lock Quarry Metro Park (inside CVNP, represented by the park pin on cleveland.html).
- **Gaps stated:** Himalayan/Nepali (HIMAL) has only Bombay Sitar — North Hill's Nepali-Bhutanese kitchens are held for
  a 2nd source, not filled. No Canton coney place met the bar (no credible coverage surfaced).
- **Next queries (W2):** corroborate the held list above (one search per 2–3 names via Akron Life / Cleveland Magazine /
  Ohio Magazine domain filters) · Hungarian/Serbian (Al's Corner Barberton) · Kent (River Merchant, Mike's Place,
  Laziza, Taco Tontos, Over Easy at the Depot) · NSUM (Hudson: Emilio's; Stow; Peninsula's Winking Lizard/Szalay's) ·
  BARB (Wadsworth, Green: Twisted Olive) · CANT (Lucia's, Samantha's, Blue Smoke, Arcade Market) · MASS (At Your
  Table, Lucca) · sights: Sippo Lake, Ohio Society of Military History, Lake Anna, Hower House, Firestone/Sand Run Metro
  Parks, Akron Children's Museum, Summit Artspace, Sojourner Truth site, John Brown Monument (Atlas Obscura), Stow,
  Aurora, Ravenna, Garrettsville, Alliance, Louisville.

## State
- 2026-10-03 W1b: **78 places, 29 pinned, page live** (`cities/akron.html`, index card relinked). All 4 gates green +
  `npm run validate` + `npm test` green. Density: AKR 30/60 · CANT 16/45 · NSUM 11/35 · KENT 8/30 · MASS 8/20 ·
  BARB 5/20 (78/210).
