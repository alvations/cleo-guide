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

## In-flight wave — W6 (started 2026-10-03, this session) — resume here
- Files: FOOD_W6*.json, SIGHTS_W6*.json, SOURCES_W6.json, geo/_geoout_w6*.json. Plan: promote held leads with a 2nd outlet, then new
  discovery for CANT, NSUM, AKR, BARB, KENT, MASS (food-first), pins via Apple/Waze/usarestaurants per place. Progress notes appended below.
- **W6 batch 1 DONE:** +9 food → 175 places, 134 pinned. AKR 53 · CANT 38 · NSUM 30 · KENT 24 · MASS 17 · BARB 13. NEED AKR +7, BARB +7,
  CANT +7, KENT +6, NSUM +5, MASS +3.
- **W6 batch 2 DONE:** +6 food +4 sights → 185 places, 137 pinned. AKR 57 · CANT 38 · NSUM 30 · KENT 26 · BARB 17 · MASS 17.
  NEED CANT +7, NSUM +5, KENT +4, AKR +3, BARB +3, MASS +3. Next: CANT + MASS + NSUM, then a pin pass on the 16 W6 UNVERIFIED.

## Previous plan (W6, as written after W5 on 2026-10-03)
- **W5 DONE 2026-10-03:** 124 → **166 places** (68 sights / 98 food = 59%; food ≥50% in every area), pins 94 → **128**. 4 gates green,
  validate + npm test PASS. Density AKR 52/60 · CANT 36/45 · NSUM 26/35 · KENT 23/30 · MASS 16/20 · BARB 13/20.
- **Next session (W6):** (1) pins for W5 UNVERIFIED — Menches Bros. (3700 Massillon Rd, Uniontown), Boss ChickNBeer (1791 Front St), Summit
  Artspace, KSU Museum (Rockwell Hall), Cast Iron Bar & Grille (2176 Locust St), Maddalena's (252 N Water St, Kent), Towner's Woods, Leather
  Helmet Grill (621 Market Ave N) + the W4 backlog (Taggart's, Fred's, Hoppin' Frog, Bocca Grande…) → geocode-helper.html or Waze retries.
  (2) Fix Crave address, Desert Inn NW/NE, Wally Waffle status; resolve Al's Corner (Barberton) status/address and Tremont Coffee's flagship.
  (3) Discovery NEED: CANT +9, NSUM +9, AKR +8, BARB +7, KENT +7, MASS +4. Leads: Vue + Galaxy (Wadsworth), Great Oaks Tavern, Kraus' Pizza
  (Massillon), Kozmo's Grille, Hartville Chocolate Factory, Good Fortune / Blue Smoke / Samantha's (Canton), Jilly's Music Room, Southern
  Comfort Food Kitchen, Garretts Mill Diner, Good Grief (Hudson), Guido's Ravenna — each needs a 2nd credible outlet. Sights: Canton Arts
  District (needs a pin anchor), Munroe Falls / Furnace Run Metro Parks (needs a 2nd source), Front Street Cuyahoga Falls, Fort Laurens is
  Tuscarawas Co. (out of region). Repository/ABJ only via AOL/Yahoo syndication; beaconjournal.com is blocked as an allowed_domain.

## W5 progress notes
- **W5 batches 2–3 DONE:** 165 places, 127 pinned. AKR 52 · CANT 36 · NSUM 26 · KENT 22 · MASS 16 · BARB 13.
- **W5 batch 1 DONE:** +14 sights +11 food → 149 places, 113 pinned. AKR 48 · CANT 31 · NSUM 24 · KENT 19 · MASS 14 · BARB 13.
  NEED AKR +12, CANT +14, NSUM +11, KENT +11, BARB +7, MASS +6. Held leads in AUDIT W5 batch 1.

## Previous wave plan (W5 as written after W4)
- **W4 DONE 2026-10-03:** pins 34 → **94** (60 new place pins via Waze/usarestaurants — Apple Maps returned no `coordinate=`
  URLs for Ohio; technique in AUDIT W4 batch 1) + **14 food** (124 places, 79 food 64%). All 4 gates green, validate + test PASS.
- **Next session (W5):** (1) pins for the 30 UNVERIFIED — try the Waze query once more with name variants, else
  `tools/geocode-helper.html`: Taggart's, Fred's Diner, Cilantro, Hoppin' Frog, Bombay Sitar, Bocca Grande, Angel Falls, Taco
  Tontos, Social at the Stone House, Rosewood Grill, Café Toscano, McArthur's, Farmer's Rail, Amelia's, Village Inn, New Era,
  Mustard Seed, Momo House, Garrett's Mill, George's Lounge, Muggswigz, Sully's, Missing Mountain, Lake House; sights Five Oaks,
  St. Helena III, Hoover (conflict). (2) Fix: Crave address (156 S Main St?), Desert Inn (12th St NW vs NE), Wally Waffle
  Downtown status. (3) Discovery still NEED: AKR +18, CANT +18, NSUM +17, KENT +13, BARB +11, MASS +9 — promote held leads in
  AUDIT W4 batch 2 with a 2nd outlet (Boss ChickNBeer address; Vue/Bistro of Green; Tremont; Zakee; Arcadia/Fromage need merit),
  mine CLEMAG "These Cuyahoga Falls speakeasy cocktail bars", KentWired Best of Kent 2026, Akron Life Best of the City 2025 list,
  Visit Canton Stark11 lists + Repository for corroboration; sights (Hower House, Akron Children's Museum, Summit Artspace,
  Sand Run/Firestone Metro Parks, Ohio Society of Military History, Canton Classic Car Museum).

## Previous wave notes (W4 plan, after W3b)
- **W3b DONE 2026-10-03** (NSUM+KENT, 38 searches): +7 food — Russo's, McArthur's Brew House, Rosewood Grill (NSUM);
  Brimfield Bread Oven, Scribbles Coffee, Café Toscano, Garrett's Mill (KENT); Amelia's + Ray's Place got extra sources.
  record-courier.com also 400s as an allowed_domain. Held/new leads listed in AUDIT W3b. Gaps: Stow, Tallmadge,
  Macedonia, Bath, Richfield, Ravenna, Streetsboro, Mantua — nothing met the bar yet.
- **Next session (fresh WebSearch budget):** (1) geocode backlog 76 — run all food through tools/geocode-helper.html;
  sights Glamorgan Castle, Sippo Lake, Lake Anna, Seiberling, St. Helena III, Canton Museum of Art, Five Oaks, Liberty
  Park, Brady's Leap, Twins Days, Hoover (conflict). (2) W4 AKR food+sights (+23), CANT (+22), NSUM (+19), KENT (+14),
  BARB (+12), MASS (+10).
- **W3a DONE 2026-10-03** (CANT+MASS, 42 searches): +7 food (Social at the Stone House, Canal Boat Lounge, Papa Gyros,
  Lucca, Lucia's Steakhouse, Walkie Talkie Espresso, Mike's Pizza & Deli) + 3 sights (Glamorgan Castle, Sippo Lake Park,
  Lake Anna Park) — all UNVERIFIED pins. 91 Wood Fired Oven dropped (listings only). Canton Repository is not
  searchable by domain (400); its stories surface only via AOL/Yahoo. New held list for CANT/MASS in AUDIT W3a section.
  Next: W3b NSUM + KENT food (+22/+18), then AKR (+23), BARB (+12); sight pins for Glamorgan Castle, Sippo, Lake Anna.
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
- 2026-10-03 W3a: **103 places (58 food / 45 sights), 34 pinned**; 4 gates green. AKR 37 · CANT 23 · NSUM 13 · KENT 12 ·
  MASS 10 · BARB 8 (103/210).
- 2026-10-03 W3b: **110 places (65 food 59% / 45 sights), 34 pinned**; 4 gates green. AKR 37 · CANT 23 · NSUM 16 · KENT 16 ·
  MASS 10 · BARB 8 (110/210). Session WebSearch use ≈161 (W2a 34 + W2b ≤45 + W3a 42 + W3b 38 + 1) — stopped short of the cap.
- 2026-10-03 W4: **124 places (79 food 64% / 45 sights), 94 pinned**; 4 gates green. AKR 42 · CANT 27 · NSUM 18 · KENT 17 ·
  MASS 11 · BARB 9 (124/210). ≈176 WebSearch.
- 2026-10-03 W5 batch 1: **149 places, 113 pinned**; 4 gates green.
- 2026-10-03 W5 batches 2–3: **165 places, 127 pinned**; 4 gates green.
