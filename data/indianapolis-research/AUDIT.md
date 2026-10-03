# Indianapolis — AUDIT ledger (append-only)

Key `indianapolis-in`. Contract: docs/PIPELINE.md. Run protocol: docs/RUN-2026-10-02.md.
Research channel: WebSearch only (WebFetch blocked by org egress policy) — `researchedVia: WebSearch`.

## 2026-10-02 · Stage 0 — Scope & taxonomy
- **Region:** Indianapolis/Marion County + Speedway + north suburbs (Carmel, Fishers, Zionsville,
  Noblesville, Westfield) + south side (Greenwood, Beech Grove, Southport). Out of region: Huntington
  (Nick's Kitchen, tenderloin birthplace), Winchester (Wick's Pies) — noted for context, not pinned.
- **Areas (9):** DTN, MASS, FSQ, MID, BRIP, WEST, EAST, NORTH, SOUTH. MID added beyond the brief's list
  because Newfields, the Children's Museum, Crown Hill and Butler sit in neither Downtown nor Broad Ripple;
  the Kurt Vonnegut Museum (543 Indiana Ave) is DTN.
- **Cuisines:** HOOS (Hoosier classics: tenderloin, fried chicken, biscuits & apple butter) · STEAK (St. Elmo
  & fine dining) · US · DELI (Shapiro's) · SOUL · ITAL · BURMA (Burmese & Chin) · ASIAN · MEX · MED · PIE
  (sugar cream pie, bakeries) · BREW · COF · VIRAL.
- **Collections:** ICON, RACE (Speedway & racing — Indy's defining collection), MUS, PARK, ARCH, ENT, SHOP,
  FAM, ODD, FREE.

## 2026-10-02 · W1 Stage 1 (source discovery) — TRUNCATED by the shared WebSearch session budget
- Ran 5 WebSearch calls (tenderloin ×2, Indianapolis Monthly Best Restaurants 2025, James Beard 2026
  semifinalists, IM installments). The 6th returned **"this session has used its web search budget (200 of
  200 WebSearch calls)"** — the cap is shared by the ~16 concurrent agents in this session and is not a
  transient rate limit (the tool instructs not to retry; raising it requires `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`).
- Per the never-fabricate rule, **no places were written from memory**; no coordinates, no addresses.
- Credible sources discovered (logged with URLs in `_PENDING_LEADS.md`): Indianapolis Monthly (tenderloin
  guide; Best Restaurants 2025 + 2026), James Beard Foundation (2026 semifinalists: Macizo, Vida/Jared May,
  Tom Main/Tinker Street & Freeland's), Axios Indianapolis (tenderloin trail — add `AXIOS` outlet next wave).
- Rejected: cozymeal (booking-platform listicle), internxt/montecitofire/unearththevoyage (content farms);
  lifeinindy.com held as lead-only until vetted.
- Channel mix this wave: editorial 4 (IM ×3, Axios) · institutional 1 (JB) · creators 0 · travel sites 0 ·
  local-rec 0 (lead only). Places extracted to records: 0 (all held as leads, see `_PENDING_LEADS.md`).

## 2026-10-03 · W1 (full wave, own session) — discovery → fact-check → geocode → build
Channel: WebSearch only (`researchedVia: WebSearch`), ~158 calls this session. Every record is written by
`_w1_records.py` (re-runnable; one `add()` per place carrying its sources, address and geo/status provenance)
→ `FOOD_W1.json`, `SIGHTS_W1.json`, `geo/_geoout_w1.json`; new outlets in `SOURCES_W1.json`.

**Stage 1 — sources.** Editorial of record: Indianapolis Monthly (Best Restaurants 2024/2025/2026 installments,
tenderloin guide, 25 Essential Eats, reviews), IBJ, WISH/WRTV/WTHR/FOX59, Mirror Indy, NUVO archive, Indy Today,
Axios Indianapolis. Institutional: James Beard (St. Elmo America's Classics 2012 — Indy's only JB win; semifinalists
2022-2026: Vida/Melvin & Jared May, Tom Main [Tinker Street, Freeland's], Macizo, Bluebeard/Merriss, 9th Street
Bistro/Mohammad, Beholder & Milktooth/Brooks, Oakleys, Love Handle, Martha Hoover). National: Roadfood, Atlas
Obscura, Food Network/DDD, Tasting Table, PUNCH, Infatuation. Sights: Wikipedia (infobox coords), NPS NRHP
itineraries, Encyclopedia of Indianapolis, SAH Archipedia, TCLF, Indiana Historical Bureau, Visit Indy/Visit
Hamilton County/Visit Indiana, Downtown Indy. Registered 35 new outlet keys (SOURCES_W1.json).
**Rejected:** cozymeal (booking-platform listicle), hoodline (Yelp-derived), tablejourney/enprimeurclub/wanderlog
(aggregators), zabihah/autoreserve (directories), lifeinindy (unvetted lifestyle site), Yelp-based "best pie" claim
used only as context, never as a source.

**Stage 2-3 — extract + fact-check (merit + status).** 103 places kept (63 sights, 40 food). Merit basis per food
record: JB honour and/or IM Best Restaurants list and/or national-guide rave (Roadfood/DDD/Atlas Obscura) with a
2nd independent outlet. Status sources recorded per place (IM 2026 list = Sept 2026 open check; IBJ/WTHR/WISH news).
- **CLOSED, kept flagged:** Edwards Drive-In (tenderloin, Man v. Food) — last day 8 Jan 2022 (WTHR/IBJ/WISH).
- **CLOSED, dropped (no pin + not canon-defining):** Acapulco Joe's (closed 2019, Indy Encyclopedia).
- **Status changes logged:** Milktooth → briefly Arlene's (2026), now "arlene's by Milktooth" (IBJ); Kountry Kitchen
  rebuilt on its original site after the 2020 fire; Love Handle moved to 877 Mass Ave; Bluebeard chef Merriss →
  Alan Sternberg; Lafayette Square Mall closed 2022 (pin kept as the International Marketplace district hub).
- **MEASURED & HELD (not added):** Wisanggeni Pawon (IM 2026 says Irvington; directories say 2450 E 71st — address
  unresolved); Kimu (Greenwood Burmese; NUVO/Culinary Crossroads/NYT mention but no 2025-26 open check); Borage,
  Serliana, Corridor, Julieta, Fernando's, Magdalena, Good Omen, Open Kitchen, The Flatiron (IM only so far — need a
  2nd outlet); Bazbeaux (one outlet); Al-Rayan (only directories + Visit Indiana mention); Bub's Burgers (no street
  address found); Cafe Patachou (original 49th & Penn site status unclear after IM "big change" note); Metazoa,
  Fountain Square Brewing, Upland FSQ (Axios brewery guide only).
- **Gaps stated, not filled:** persimmon pudding — no Indy restaurant found serving it with a credible source this
  wave; Midtown (MID) has no food yet (searches returned no credible MID-specific list); SOUTH Burmese/Chin beyond
  Chin Brothers lacks current status checks.

**Stage 4 — geocode.** Wikipedia infobox coordinates (or HMdb/latlong.net/aggregator points, graded med/low and
noted) for 59 places: high 36 · med 20 · low 3 (Fort Harrison SP minute-precision, Broad Ripple Village centroid,
Museum of Miniature Houses aggregator). Rathskeller pinned on the Athenaeum building (it occupies it). **44 places
UNVERIFIED** — WebSearch returns no place-pin coordinates for most restaurants (Mapcarta/latlong.net domain-restricted
retries also failed); they are in the dataset and held off the map by the gate until `tools/geocode-helper.html`.
Several addresses first drafted from recall were replaced with the address text actually stated by a source
(e.g. Monument Circle, War Memorial, Speedway) before build — no address or coordinate comes from memory.

**Stage 5 — build + gates.** `rebuild-city.py indianapolis-in --build`: sourcecheck PASS (103/103) · geocheck PASS ·
statuscheck CONSISTENT · buildcheck PASS; `npm run validate && npm test` green. Page live on the US hub card.
Density (`tools/density.py`): every area still NEED — DTN 27/38, MASS 16/24, NORTH 14/30, BRIP 11/20, WEST 11/20,
MID 7/22, EAST 7/16, FSQ 6/20, SOUTH 4/20.

## 2026-10-03 · W2 (own session) — pins attempt → food & drink first → sight pins → build
Channel: WebSearch only (~170 calls). Records generated by `_ind_w2_records.py` (re-runnable; `_ind_add_w2.py` writes
`FOOD_W2.json` / `SIGHTS_W2.json` / `geo/_geoout_w2.json`); W1 sight pins by `_ind_geo_w2.py`; new outlets in `SOURCES_W2.json`.

**Stage 0 — pin the 44 UNVERIFIED (task item 1).** Apple Maps technique (`allowed_domains:["maps.apple.com"]`) FAILED for
Indianapolis: 3 probes (Shapiro's, Workingman's Friend + OSM, extended retry) returned only `place-id=`/`auid=` URLs with no
`coordinate=`/`ll=`; Wikipedia/Wikidata and no-domain "latitude longitude" probes (Shapiro's, Red Key) also returned no place pin.
Stopped after 5 searches (logged as a lesson in docs/AGENT-PROMPTS.md). Pinned the W1 sights that Wikipedia covers instead:
Christ Church Cathedral, Stutz Building, The Palladium (high). Holliday Park / Indiana Landmarks Center / Holy Rosary: no
infobox coordinate returned (Holy Rosary offered only the Latin School point — not used). Restaurants stay UNVERIFIED → geocode-helper.

**Stage 1 — sources.** Editorial of record: Indianapolis Monthly (Best Restaurants 2025 + full 2026 list, 25 Essential Eats,
Top Five Phos, Cheap Eats, Street Savvy Butler-Tarkington, reviews), IBJ, Axios Indianapolis (brewery guide, coffee guide,
taco ranking, Devour 2026 new-restaurant list), Mirror Indy, WRTV (pho guide, International Marketplace tour), WISH, WTHR,
FOX59, NUVO, Current, Visit Indy, Visit Indiana, Visit Hamilton County, Downtown Indy, Edible Indy, Culinary Crossroads.
National: Imbibe (Where to Drink in Indianapolis), World's 50 Best Discovery, Cheapism (via AOL), The Brewer Magazine,
Inside Indiana Business, Towne Post. New keys: CHEAPISM, IMBIBE, WORLDS50BEST, TOWNEPOST, BREWERMAG, INSIDEINDIANABUSINESS.
**Creators:** 1 creator query ("Indianapolis food tour YouTube … food vlogger") found no verifiable creator with an
Indianapolis piece — none attached (stated, not filled). Rejected: OpenTable/Yelp/wanderlog/tablejourney/enprimeurclub/
joinpearl/atmosfy/hoodline/lifeinindy/myglobalviewpoint (aggregators/SEO) — used only as context, never as sources.
Channel mix: editorial 40 places · national travel/drinks 5 · institutional 0 · creators 0 · local-rec 0.

**Stage 2-3 — extract + fact-check.** 47 places kept (40 food & drink, 7 sights), each ≥2 credible outlets:
- FOOD — DTN: Julieta Taco Shop, Serliana, Bee Coffee Roasters · MASS: Coat Check Coffee, Goose the Market (IM 25 Essential
  Eats), Livery · FSQ: Magdalena, Metazoa, Fountain Square Brewing, Monti, The Inferno Room, The Commodore, Square Cat Vinyl,
  Hotel Tango · MID: Tinker Coffee Firehouse, Oh Yumm! Bistro, The Melody Inn, Hoagies & Hops, Pa & Ma's Backyard BBQ (DDD),
  Kincaid's Meat Market · BRIP: Corridor, Broad Ripple Brewpub, Fernando's, Delicia · WEST: Borage, Guggman Haus, Al-Rayan,
  King Wok, Sizzling Wok Hai · EAST: Strange Bird, Tlaolli (DDD), Jockamo Upper Crust · NORTH: Field Brewing, Good Omen,
  Convivio, Okonori, Bub's Burgers, Vivante, Juniper on Main · SOUTH: Egg Roll #1, Oaken Barrel.
- SIGHTS — Major Taylor Velodrome, Allison Mansion (WEST); Arsenal Technical HS (EAST); Fletcher Place HD (FSQ);
  Riverside Park, Holcomb Gardens (MID). All pinned from Wikipedia infoboxes.
- **Closures found:** Black Acre Brewing's Irvington flagship taproom (permanently closed; IBJ — Scarlet Lane taking over)
  and Libertine Liquor Bar (did not reopen after 2020; IBJ) — both non-notable now → dropped, not added. Rocket 88 Doughnuts
  closed (WISH/WRTV) — not added. Bub's: only the Westfield store (2024) and Bub's Café closed; Carmel burger shop open.
- **MEASURED & HELD (not added):** Daisy Bar (Axios says Windsor Park, another result 1125 Mass Ave — address conflict);
  Wisanggeni Pawon (IM 2026 "Irvington" vs IM 2024/Culinary Crossroads 2450 E 71st St — unresolved); Kimu (no 2025-26 status);
  Cheeky Bastards, Open Kitchen, Big Woods, The Mug, Revery, Black Acre, CourtHouse Club, Napoli Villa, Famous Subs,
  Burmese Restaurant (7040 Madison), Baan Thai Bistro, Four Seasons Diner, Karachi Kabab, Pho Real/Pho 21/Long Thanh/Pho Tasty
  (one outlet each); Ball & Biscuit (address conflict 331 Mass Ave vs biscuit-shop confusion); Saraga (westside address not
  found); Quills downtown (no street address); Ruoff Music Center, Holy Rosary pin (one source / no pin); Gray Bros. (Mooresville —
  out of region); Shoyu Shop (inside Strange Bird — same venue).
- Single-venue-in-notable-building pins (med): Julieta (Stutz), Coat Check (Athenaeum), The Commodore (Fountain Square Theatre).

**SOUTH source exhaustion (documented).** Searched: IndyStar (domain blocked to the crawler), Mirror Indy/WFYI/IM/WTHR/WRTV/
Axios for Burmese/Chin Perry Township, Culinary Crossroads Little Burma, Atlas Obscura Chindianapolis, Greenwood Daily
Journal, Greenwood/Beech Grove/Southport iconic restaurants, IM Street Savvy Garfield Park, Mirror Indy Wanamaker. Result: most
south-side places have a single outlet (IM or Mirror or WRTV); kept only Egg Roll #1 and Oaken Barrel. Gap stated.

**Stage 5 — build + gates.** `rebuild-city.py indianapolis-in --build`: sourcecheck PASS · geocheck PASS · statuscheck
CONSISTENT · buildcheck PASS; `npm run validate && npm test` green. 150 sourced (69 sights, 81 food = 54%); 72 on the map
(62 sights + 10 food). Density: BRIP 15/20, DTN 30/38, EAST 11/16, FSQ 15/20, MASS 19/24, MID 15/22, NORTH 21/30,
SOUTH 6/20, WEST 18/20 — all NEED. Per-area food share: ≥50% in BRIP, EAST, FSQ, NORTH, SOUTH, WEST; below in DTN (8/30),
MASS (9/19), MID (6/15).

## 2026-10-03 · W3 (own session) — close every NEED area, then pin the unpinned
Channel: WebSearch only (~150 calls). Records: `_ind_w3_records.py` (re-runnable; `_ind_add_w3.py` writes FOOD_W3/SIGHTS_W3 +
geo/_geoout_w3.json); pins: `_ind_pins_w3.py` → geo/_geoout_w3pins.json (geo-merge never lets UNVERIFIED clobber a verified pin).

**Stage 1 — sources.** Editorial of record again led: Indianapolis Monthly (Best Restaurants 2025/26, Swoon List, Devour Downtown,
Street Savvy Butler-Tarkington/Prospect St, Beech Grove Main Street, Chindianapolis, Best of Indy, reviews), IBJ, Axios Indianapolis,
WISH, WTHR, FOX59, WRTV, Mirror Indy, Visit Indy, Downtown Indy, Visit Hamilton County, Current, Edible Indy, Culinary Crossroads,
Encyclopedia of Indianapolis, Wikipedia. New outlet key: DAILYJOURNAL (Johnson County daily). Rejected as recommenders: OpenTable,
Yelp-Elites list (used only as a popularity measurement for Tipsy Mermaid/Bocca), singleplatform, wanderlog, trip.com, thevendry.
**Creators:** no creator query this wave — the W2 creator query found no verifiable Indianapolis food creator; budget went to the
NEED areas and pins (stated, not filled).

**Stage 2-3 — extract + fact-check (65 kept, each ≥2 credible outlets).**
- DTN (food 8→22): Harry & Izzy's, 1933 Lounge by St. Elmo, Prime 47, Astrea, The Eagle's Nest, Nesso Italian Kitchen, Taxman CityWay,
  Iozzo's Garden of Italy, Spoke & Steele, The Hulman, Cannon Ball Rooftop Lounge, Tavern on South, Sushi Den, Doc Crow's.
- MASS: Bazbeaux (329 Mass Ave per Waze; the old lead's 333 was wrong), Bru Burger Bar, Bakersfield, St. Joseph Brewery, Harrison's.
- SOUTH (6→20): Napoli Villa (758 Main St), Beech Grove Pizza Co., Beech Bank Brewing, The Suds, Revery (status via Daily Journal
  Oct 2025 DORA application), Burmese Restaurant (7040 Madison), Kimu, Paradise Mx, Brozinni, Ten Cuts; sights Hannah House,
  University of Indianapolis, Southeastway Park, Beech Grove Shops (Wikipedia + Encyclopedia of Indianapolis).
- BRIP: Petite Chou, Mama Carolla's, Twenty Tap, Napolese (49th St flagship open; Fashion Mall branch closed June 2026), Marrakesh.
- MID: Bocca, Foundry Provisions, Tea's Me Cafe, Illinois Street Food Emporium, The Flying Cupcake (original), Command Coffee;
  sight Herron–Morton Place HD.
- NORTH: Anthony's Chophouse, Monterey Coastal Cuisine, Tiburon, Cafe Patachou Nickel Plate, Tipsy Mermaid, Nyla's, Cheeky Bastards,
  The CourtHouse Club, Niku. EAST: Kan-Kan, The Med, Smash'd Burger Bar, Your Local Deli, Rock-Cola 50s Cafe.
  FSQ: La Margarita (reopened July 2025 at 501 Virginia Ave), Siam Square, Kuma's Corner, Easy Rider Diner.
  WEST: Dawson's on Main (tenderloin canon), Daredevil Brewing.
- **Closed / inactive (not added):** Happy Brewing (closed 2018), Shoefly Public House, Chalet (→ Tinker Firehouse, already listed),
  Santorini Greek Kitchen (2018), B's Po Boy, Mikado (2021), Three Carrots (closing), Scarlet Lane Beech Grove (sold to Greek's
  Pizzeria; brand closed), Napolese downtown (2021), Bar One Fourteen (private events only — not a live suggestion).
- **MEASURED & HELD:** Meridian Restaurant & Bar (IM only), SmockTown Brewery (Daily Journal only), Mom's Family Restaurant (IM only),
  Hinata (IBJ only), Kilroy's (temporary closure), Rick's Cafe Boatyard (fire), Mo's A Place for Steaks (not yet open), West Fork
  Social House (two conflicting addresses), Rook (status), Lincoln Square Pancake House (chain, no merit mark).

**Stage 4 — geocode.** Apple Maps still returns bare place-ids for Indy, so the Waze fallback was used with three places per query
(`"latitude longitude of <name> <addr>, …"`, `allowed_domains:["waze.com","usarestaurants.info","foursquare.com"]`): 67 pins in
geo/_geoout_w3pins.json (39 high, 28 med; 63 Waze/listing + 4 Wikipedia). high = Waze place record with matching name + address
(or Wikipedia infobox); med = usarestaurants.info listing, near-miss street number, or the
hotel/building Waze place for in-hotel venues: The Hulman, Cannon Ball, Eagle's Nest, Nesso, Doc Crow's, 1933 Lounge (St. Elmo's
Wikipedia point), Tinker Firehouse (IFD Station 16 building); shared-address building points: La Margarita, Monti, King Wok,
Marrakesh). Rejected: parking/address-only Waze records (Tavern on South, Inferno Room, Sizzling Wok Hai, Macizo, Kimu, Bocca,
Milktooth street point) and a Ten Cuts coordinate whose longitude duplicated Doc Crow's in the same answer (summariser slip).
Wikipedia pins: Hannah House, University of Indianapolis, Herron–Morton Place (high). 76 places stay UNVERIFIED.

**Stage 5 — build + gates.** sourcecheck PASS (215/215) · geocheck PASS (139 on page) · statuscheck CONSISTENT · buildcheck PASS;
`npm run validate && npm test` green. Density: BRIP 20/20, DTN 44/38, EAST 16/16, FSQ 19/20, MASS 24/24, MID 22/22, NORTH 30/30,
SOUTH 20/20, WEST 20/20. Food share 141/215 = 66%; per area BRIP 85% · DTN 50% · EAST 75% · FSQ 84% · MASS 58% · MID 55% ·
NORTH 70% · SOUTH 70% · WEST 65%.
