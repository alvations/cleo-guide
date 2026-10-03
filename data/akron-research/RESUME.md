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
- 2026-10-03 W7: **207 places (127 food 61% / 80 sights), 150 pinned**; 4 gates green; validate + npm test PASS.
- 2026-10-02 scaffold: consolidate.py (6 areas, Akron-Canton cuisine taxonomy), brief, build-akron.py.

## In-flight wave — none (W7 closed 2026-10-03 — discovery complete, deploy-ready). Next session = W8 (pins only), start here
- **W7 DONE 2026-10-03:** 193 → **207 places** (80 sights / 127 food = 61%; food ≥50% in every area), pins 141 → **150** (57 UNVERIFIED).
  4 gates green, validate + npm test PASS. Density AKR 60/60 · KENT 30/30 · MASS 20/20 · NSUM 34/35 · CANT 44/45 · BARB 19/20 (207/210).
  Files: FOOD_W7, SIGHTS_W7, geo/_geoout_w7 + _w7b. Full log + source-exhaustion notes: AUDIT.md W7 batches 1–2.
- **Resolved in W7:** Hoover Historical Center pin (Waze place at 1875 E Maple St = Remarkable Ohio marker, med); Desert Inn address = 204 12th St NW
  (Repository) — but Waze's place record says 204 12th St **NE**, so the pin stays held; Al's Corner Barberton = CLOSED (now TUSK); Tremont flagship =
  215 Erie St N (added).
- **W8 plan (pins only — discovery is at the bar; do not pad):**
  1. Run `tools/geocode-helper.html` (browser) over the 57 UNVERIFIED in docs/GEOCODE-BACKLOG.md (akron-oh). The WebSearch Waze/usarestaurants channel
     is exhausted for these names (re-tried W4–W7). Priority: canon food (Taggart's, Desert Inn [NW vs NE], Hoppin' Frog, Fred's, Village Inn Chicken,
     Menches), W7 adds (West Side Bakery, Muskellunge, North Water, Tremont, Ignite), sights (KSU Museum/Rockwell Hall, Summit Artspace, Akron History
     Center, Highland Theatre, Nightlight, BLU Jazz+, Towner's Woods, St. Helena III, Five Oaks). Canton Arts District / Acorn Alley need a place anchor.
  2. Optional last +3 (only if a 2nd credible outlet appears): CANT — Blazing Pig (Repository review), Dog Daze (Ohio Mag), Starflyer; NSUM — Vaccaro's
     Trattoria (Bath; Akron Life ×2 + OpenTable 4.8★/1,522), Ocelot Café Richfield (ABJ), Downtown 140 (status); BARB — Angie's Italian (ABJ +
     city), Bistro of Green (Akron Life ×2).

## Previous plan (W7, as written after W6)
- **W6 DONE 2026-10-03:** 166 → **193 places** (78 sights / 115 food = 60%; food ≥50% in every area), pins 128 → **141** (52 UNVERIFIED).
  4 gates green, validate + npm test PASS. Density AKR 59/60 · CANT 40/45 · NSUM 31/35 · KENT 28/30 · MASS 18/20 · BARB 17/20.
  Files: FOOD_W6/W6B/W6C/W6D, SIGHTS_W6/W6B/W6C, SOURCES_W6, geo/_geoout_w6–w6d. Full log: AUDIT.md W6 batches 1–5.
- **W7 plan (ordered):**
  1. **Pins (biggest gap: 52 UNVERIFIED)** — run `tools/geocode-helper.html` (browser) over the backlog, or Waze retries with name variants:
     W6: Green Valley Brewing, Hartville Chocolate Factory, Joey's Kendal Tavern, The Vue, Industry Kitchen, Bell Tower, Horseshoe Diner,
     3 Palms, Akron History Center, BLU Jazz+, Highland Theatre, Nightlight Cinema, Haymaker Market, Acorn Alley; W5/W4 backlog in AUDIT
     (Menches, Boss ChickNBeer, Summit Artspace, KSU Museum, Cast Iron, Maddalena's, Towner's Woods, Leather Helmet, Taggart's, Fred's,
     Hoppin' Frog, Bocca Grande…).
  2. **Fixes:** Crave address (156 S Main St?), Desert Inn NW/NE, Wally Waffle Downtown status, Hoover Historical Center coordinate conflict,
     Al's Corner Barberton status.
  3. **Discovery to close the last 17:** CANT +5, NSUM +4, BARB +3, KENT +2, MASS +2, AKR +1. Each held lead in AUDIT W6 needs one more credible
     outlet or a dated status: Over Easy at the Depot (Kent), Crave Cantina (Cuyahoga Falls), V-Li's Thai (Canal Fulton), Dog Daze (Canton),
     Tree City Coffee, Henry Wahner's, Lala's in the Lakes, Lager & Vine, Good Grief, Lions Lincoln Theatre, Beech Creek Gardens, Clifford's
     Mini Auto Museum. If still single-outlet, state the gap (CLAUDE.md: gaps are stated, not filled).

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
