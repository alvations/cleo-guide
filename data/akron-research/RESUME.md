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

## In-flight wave — resume here (W3, after W2a/W2b on 2026-10-03)
- **W2 DONE 2026-10-03:** W2a (FOOD_W2A: New Era, Papa Joe's, Thirsty Dog, Lock 15 promoted/new; 6 dupes of W1b folded
  in as extra sources) + W2b (FOOD_W2B: 11 promoted held leads incl. Momo House, Mike's Place, Taco Tontos, River
  Merchant, Laziza, Flury's, Szalay's, Kingfish, Twisted Olive, Sweet Mary's, Angel Falls; 5 new sight pins). 93 places,
  34 pinned, food 55%.
- **Geocode backlog (59 UNVERIFIED):** all 51 food → `tools/geocode-helper.html` (browser), merge as
  `geo/_geoout_helper_*.json`. Sights: F.A. Seiberling Nature Realm (1828 Smith Rd), Twins Days (Glen Chamberlin Park,
  10260 Ravenna Rd), St. Helena III, Canton Museum of Art, Five Oaks, Liberty Park, Brady's Leap, **Hoover Historical
  Center** (two coords ~280 m apart — resolve with a place pin before re-adding).
- **Still held (need 2nd credible source / dish / status):** Nepali Kitchen, Royal Palace (Bhutanese) · Ken Stewart's
  Grille (2 sources, no dish surfaced) · Saffron Patch, Thyme2, Stirling, 63 Corks, Richfield Brewing, Missing Falls,
  Constance Fromagerie, Frank's Place, The Eye Opener · Belleria, Guys Pizza (KentWired only) · Boss ChickNBeer, River
  Brasserie · Papa Gyros, Lucca, Francisco's Cantina (Repository panel only) · Blue Habanero, Doug's Classic 57,
  Gregory's, Pete's, Grumpy Troll, Samantha's (Visit Canton only) · Funny Noodle · Wild Goats Café (status) · Mélange ·
  Amelia's by The Farmer's Rail (NSUM; Cleveland Magazine + Akron Life reported by W2a — re-confirm URLs and add) ·
  Kent State University Museum, Glamorgan Castle, Hartville MarketPlace, West Branch SP, Canton Classic Car Museum.
- **Next (W3), food-first, biggest gaps first:** CANT (+29: Canton best-of via CantonRep/Visit Canton + 2nd outlet;
  Lucia's, Blue Smoke, Arcade Market; Hartville/Louisville/Alliance) · AKR (+23) · NSUM (+22: Hudson Emilio's, Stow,
  Peninsula, Aurora) · KENT (+18: Ravenna, Garrettsville, Aurora) · BARB (+13: Wadsworth, Green; Al's Corner; target
  Beacon Journal via AOL syndication + Cleveland Magazine since BARB is Akron-Life-heavy) · MASS (+12: At Your Table,
  Canal Fulton). Sights: Sippo Lake, Ohio Society of Military History, Lake Anna, Hower House, Firestone/Sand Run Metro
  Parks, Akron Children's Museum, Summit Artspace, Sojourner Truth site, John Brown Monument, Alliance, Louisville.
- Notes: `allowed_domains=[cleveland.com]` errors (not crawlable); two Signal Akron polls = one outlet.

## State
- 2026-10-03 W1b: **78 places, 29 pinned, page live** (`cities/akron.html`, index card relinked). All 4 gates green +
  `npm run validate` + `npm test` green. Density: AKR 30/60 · CANT 16/45 · NSUM 11/35 · KENT 8/30 · MASS 8/20 ·
  BARB 5/20 (78/210).
- 2026-10-03 W2a+W2b: **93 places (51 food / 42 sights), 34 pinned**; all 4 gates green. Density AKR 37/60 · CANT 16/45 ·
  NSUM 13/35 · KENT 12/30 · MASS 8/20 · BARB 7/20 (93/210).
