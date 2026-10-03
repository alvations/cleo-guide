# Harrisburg · York · Lancaster & Amish Country — AUDIT (append-only, one section per stage per wave)

## Stage 0 — scope & taxonomy (2026-10-02)
- Region: South-Central PA — Harrisburg/West Shore, Hershey/Derry, Carlisle/Cumberland Valley, York County,
  Lancaster city, Lancaster County Amish country, Gettysburg edge. Areas are the travel units a visitor
  actually plans by (each county seat + Hershey + the Amish heartland as its own region because it is the
  single biggest draw and would swamp Lancaster city if merged). State College/Altoona deliberately excluded
  (own map).
- Cuisine taxonomy leads with the PA Dutch canon (PA Dutch & Smorgasbords, Bakeries/Shoofly/Whoopie, Pretzels &
  Snack Factories, Chocolate/Candy/Ice Cream, Markets, Farms) then the general set.
- Collections: Iconic, Civil War & Gettysburg, Amish & Plain Country, Factory Tours & Makers, Museums, History,
  Parks, Outdoors, Railroads, Family, Oddities, Free.
- consolidate.py never synthesizes a source (an unsourced record fails GATE 1 rather than borrowing a
  "WIKIPEDIA" label as the State College template did).

## Stage 1 — sources (2026-10-02)
- Source palette registered in `SOURCES_HBG.json` → `data/sources.json` cities["harrisburg-pa"] (29 outlets, each
  with a `credible` rationale): LNP, PennLive, YDR, York Dispatch, WITF, WGAL, ABC27, FOX43, CBS21, TheBurg, Fly,
  the five CVBs (Discover Lancaster, Visit Hershey & Harrisburg, Explore York, Destination Gettysburg, Visit
  Cumberland Valley), NPS, Smithsonian, James Beard, DCNR, PHMC, Visit PA, Uncovering PA, Atlas Obscura,
  Wikipedia, USA Today 10Best, Travel + Leisure, Food Network, NYT. Creator seed from nationalCreators: Peter
  Santenello (Amish-country videos) — to vet against a findable piece in W5.

## Stage 2 — discovery wave W1 (food canon) — BLOCKED (2026-10-02)
- WebSearch budget for the session was exhausted (200/200, shared across ~16 concurrent agents) at the start of
  W1. 1 query returned results ("best shoofly pie Lancaster County") — leads only: Bird-in-Hand Bakery & Cafe,
  Dutch Haven (sources: frommers.com local-favorites page, lancasterpa.com bakeries page, aol.com article; none
  yet confirmed as a 2nd credible source). 4 further queries refused by the budget cap.
- Channel counts this wave: editorial 0 · creators 0 · travel sites 0 · local 0 — **0 places added**. Nothing
  fabricated; no records written. Per CLAUDE.md, discovery cannot proceed without WebSearch (WebFetch blocked).

## Stage 2–6 — relaunch wave W1 (food canon) + W2 (sights) + first geocode pass (2026-10-03)
- WebSearch budget available again (fresh session). ~98 searches this wave.
- **Method.** Food: discovery searches per canon item (shoofly pie, whoopie pie, pot pie, smorgasbords, pretzels,
  markets, Lebanon bologna, snack factories, creameries) then a pin attempt. Sights: one combined
  "<place> coordinates wikipedia" search per place, yielding the ≥2 sources AND the Wikipedia/official infobox pin.
- **Channel mix (places contributed, counting each place once by its strongest channel):** editorial of record
  (Inquirer, NPR, Spotlight PA, LebTown, CPBJ, WFMZ, 6abc, CBS21, Stars & Stripes, Lancaster County Magazine) 14 ·
  tourism boards / official (Discover Lancaster, Visit Hershey & Harrisburg, Destination Gettysburg, Visit Cumberland
  Valley, Visit PA, NPS, PHMC, DCNR, PA Dept of Agriculture, City of Harrisburg) 21 · travel sites (Uncovering PA,
  Atlas Obscura, Frommer's, Tasting Table, Islands, Roadside America, PA Bucket List) 16 · Wikipedia + heritage
  bodies (notability + pins) 11 · creators 0 (Peter Santenello searched — no Lancaster-specific findable piece
  naming a place; none attached) · awards 1 (Luca — 2026 James Beard finalist, Best Chef: Mid-Atlantic, via PA Eats).
- **Discovered: 25 food + 37 sights = 62**, every one ≥2 credible (Luca on lone JB authority). sourcecheck PASS 62/62.
- **MEASURED & DROPPED / HELD:**
  - Stoltzfus Farm Restaurant (Intercourse) — CLOSED per Amish365; non-notable closed → dropped.
  - Good 'N Plenty (Smoketown) — conflicting closure signal (Airbnb "permanently closed" vs current listings) → held
    until a real status source is found.
  - Held single-source: Hammond's Pretzel Bakery (Discover Lancaster only), Strasburg Creamery (LancasterPA survey),
    Katie's Kitchen (Amish America only), Hershey Pantry + Chocolate Avenue Grill (Tasting Table only), Sight & Sound
    Theatres (Wikipedia only), Boyer Nurseries (Destination Gettysburg only), Neptune Diner / Gracie's (Discover
    Lancaster only), Lancaster Brewing / Bube's / Cartel (one outlet each), Wilbur Chocolate (no credible source).
  - Lancaster County Magazine Best of 2025 names (Belvedere Inn, C'est La Vie, Cabalar, Shot & Bottle) need a 2nd source.
  - Rejected as sources: Stacker (Yelp-derived), Hoodline (Yelp-derived), unearththevoyage / fightcancer.org / spam-
    hosted "best restaurants" pages (SEO farms), Only In Your State, Airbnb/Expedia/Travelocity/wanderlog.
  - Generic "best restaurants <city>" queries for Harrisburg/York returned SEO farms only — dead end; use outlet-
    specific or dish-specific queries next wave.
- **Geocode (W6 partial):** 31 verified pins (high 26 · med 5) from Wikipedia infoboxes / official GPS; 0 low.
  Restaurant pins essentially do NOT surface through WebSearch (1 of 9 attempts) → 31 places queued UNVERIFIED in
  `geo/_geoout_w6pending.json` for `tools/geocode-helper.html` (listed in docs/GEOCODE-BACKLOG.md). Rejected pins:
  Lancaster Central Market (Wikipedia minute-precision ≈700 m off), Bird-in-Hand Hotel pin (wrong longitude),
  Carlisle Barracks pin for USAHEC (different campus), Strasburg Rail Road (unattributed search-snippet coord).
- **Status:** every record open per a current listing (statusSource recorded); 0 closed flagged.
- **Build:** cities/harrisburg.html built, 31 pins rendered; --sourcecheck PASS · --geocheck PASS · --statuscheck
  CONSISTENT · --buildcheck PASS · npm validate DATA OK · npm test ALL PASS.
- **Address note:** addresses for Shady Maple, Miller's, Bird-in-Hand Bakery, Green Dragon, Utz confirmed by search
  results; Snyder's, Lapp Valley, Fox Meadows, Root's, Hollabaugh, Luca, Millworks, Martin's, Spring House,
  Harley-Davidson are discovery-stage addresses to confirm in the helper geocode pass.

## Stage 2–7 — waves W3/W4/W5 + go-live (2026-10-03, same session)
- ~72 further searches (total ≈170 this session). Same method: sights via one combined source+pin search; food via
  outlet- or dish-specific queries (generic "best restaurants <city>" = SEO farms — abandoned).
- **Added:** W3 food (Hershey Pantry, Jigger Shop, York City Pretzel Co., Tröegs) · W4 (Stevens & Smith Center,
  Demuth, Rock Ford, Penn Square monument, Science Factory, Watch & Clock Museum, Dutch Wonderland, Bube's, Hershey/
  Harrisburg/York/Gettysburg sights, Cabalar, Lancaster Brewing) · W5 (Carlisle Fairgrounds, Hamilton Restaurant
  Hot-Chee dog, Market Cross, Kings Gap, Lititz Church Square, York Barbell, Pinnacle Overlook, Mount Pisgah,
  Ma & Pa village, Midtown Scholar, Pride of the Susquehanna, Ned Smith Center, Jennie Wade House, Aaron & Jessica's,
  Adams County Winery, Mason Dixon Distillery, Kreider Farms, Cornwall Iron Furnace, Union Canal Tunnel).
- **Totals:** 111 discovered (37 food + 74 sights), sourcecheck PASS 111/111 (1 lone JB authority — Luca).
- **Channel mix (W3–W5 adds, 49 places):** editorial of record 12 · tourism boards/official 17 · travel sites 9 ·
  Wikipedia + heritage/landmark bodies 10 · awards 1 (USA Today 10Best reader vote — Tröegs) · creators 0.
- **MEASURED & DROPPED / HELD:** Good 'N Plenty — now one source says "closed, victim of Covid" vs live delivery
  listings → still held pending a dated news/official status. Wilbur Chocolate Lititz store — plant closed 2016,
  retail status unclear → held. Turkey Hill Experience (Columbia) — a 2024 InPark piece reports a NEW attraction;
  the Columbia address is stale → held. Hotel Hershey (Wikipedia only), PA National Fire Museum (Wikipedia only),
  Wildwood Park (Greenway only), Hanover Shoe Farms (Wikipedia only), Colonel Denning SP / Hellenic Kouzina /
  Watershed Pub / Mt Airy Orchards (Visit Cumberland Valley only), Norbu / Awash Ethiopian (one outlet each), Jackson
  House (SEO-only sources), Belvedere Inn (Lancaster County Magazine only — two LCM pieces = one outlet),
  Countryside Road Stand (LancasterPA only), Abe's Buggy Rides (Discover Lancaster only), Progress Grill / Greystone
  Public House (PA Eats only). Craig LaBan 2026 Lancaster piece: not retrievable → dead end.
- **Creators (CREATORS_W5.json):** Peter Santenello and Shane Uriot held — no place-naming piece / unverified scale.
- **Geocode:** 49 verified pins (Wikipedia infobox, DCNR/official GPS, HMDB marker for Jennie Wade = med). Fulton
  Theatre pin DOWNGRADED to UNVERIFIED (the 40.038000,-76.308194 snippet was returned for both the Fulton and the
  Penn Square monument). 62 UNVERIFIED → helper backlog (docs/GEOCODE-BACKLOG.md).
- **Discovery-stage addresses to confirm in the helper pass (from memory/partial snippets):** Dutch Wonderland,
  Middletown & Hummelstown RR (Brown St), Adams County Winery (Peach Tree Rd), Mason Dixon Distillery (E Water St),
  Lancaster Brewing (N Plum St), Spring House (Hazel St), Millworks (Verbeke St), Sight & Sound (Hartman Bridge Rd),
  Middle Creek (Museum Rd), Snyder's, Lapp Valley, Fox Meadows, Root's, Hollabaugh, Luca, Martin's, Harley-Davidson.
- **Build:** 49 pins on page; --sourcecheck PASS · --geocheck PASS · --statuscheck CONSISTENT · --buildcheck PASS ·
  npm validate DATA OK · npm test ALL PASS. **index.html card relinked LIVE** (49 mapped / 111 researched);
  docs/CITIES.md row added.
