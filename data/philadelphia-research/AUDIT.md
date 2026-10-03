# Philadelphia — AUDIT (append-only ledger; docs/PIPELINE.md audit contract)

## 2026-10-02 · Stage 0 — Scope & taxonomy
- Region: City of Philadelphia (7 in-city areas) + Main Line/suburbs, South Jersey/Camden edge, Brandywine/Valley Forge
  day trips (10 areas total; see _AGENT_BRIEF.md). Lancaster County deliberately excluded (Harrisburg-York-Lancaster map).
- Why these areas: they mirror how Philadelphians and Visit Philadelphia carve the city (Center City/Old City vs South
  Philly vs the river wards vs University City vs the Northwest), NYC-style borough granularity; ~500 target split by
  how dense each is in sights + food (Center City heaviest).
- Cuisines: 21-id Philadelphia taxonomy led by the canon (Cheesesteaks & Roast Pork, Hoagies, Pizza & Tomato Pie,
  Diners/Scrapple, Bakeries/Pretzels/Water Ice) + immigrant kitchens (Mexican, Vietnamese, Cambodian/Indonesian/SEA,
  Chinese, African, Latin/Caribbean, Middle Eastern). Collections: 13 incl. Revolutionary & Colonial History, Murals &
  Public Art, Sports & Rocky.

## 2026-10-02 · Stage 1 — Discover sources (W1) — BLOCKED by the shared WebSearch cap
- Seeded the registry with 27 outlets (SOURCES_core.json → data/sources.json, each with a `credible` rationale):
  Michelin Philadelphia 2025, James Beard, NPS, Inquirer/LaBan, Philly Mag/Foobooz, Eater Philly, Infatuation,
  Visit Philadelphia, Billy Penn/WHYY, PhillyVoice, Atlas Obscura, Hidden City, Mural Arts, Parks & Rec, travel
  (Lonely Planet, Time Out, Condé Nast Traveler), regional (Main Line Today, NJ Monthly, Courier-Post), 6abc.
  These are registered as candidate palette; per-place credibility is still established by search per wave.
- First WebSearch calls returned "this session has used its web search budget (200 of 200 WebSearch calls)" —
  the cap is session-wide and shared by all ~17 concurrent agents, already exhausted before this agent's first
  query. Backed off 10 min and retried (see next entry). NOTHING was added from memory (CLAUDE.md 4a; no-fabrication).
- Retry after a 10-minute back-off (2026-10-02): still "200 of 200 WebSearch calls" — the cap is a hard per-session
  limit (CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION), not a rate limit, so waiting does not restore it. W1 not started;
  0 places discovered, 0 geocoded. Scaffold (consolidate.py, build-philadelphia.py, brief, targets, registry entry)
  is committed and ready; the next launch with search budget starts W1 directly from RESUME.md "Next actions".

## 2026-10-02 · W1 relaunch — Stage 1-3 discover/extract/fact-check (fresh search budget)
- Sources found per query (researchedVia WebSearch; WebFetch blocked): Michelin 2025 Philadelphia list via FOX29 + Billy Penn
  (3 stars, 10 Bib, 1 Green Star, 21 Selected — Pietramala counted once) → 34 places, lone-authority MICHELIN_* keys.
  Inquirer 2023 cheesesteak bracket + LaBan 2002/2008; Visit Philly + Philly Mag roast pork; Inquirer + Philly Mag tomato pie;
  Visit Philly + Billy Penn water ice; Infatuation + Inquirer Reading Terminal Market vendors; Visit Philly + Philly Mag
  hoagies (+ LaBan on Castellino's); Infatuation + Philly Mag pho/Vietnamese; JBF 2022 (Cristina Martinez) + Time Out +
  Visit Philly tacos; NPS Independence 'Places to go'; Visit Philly Old City / Historic District / Parkway guides.
- MEASURED (cheesesteak): Inquirer 2023 reader bracket (Dalessandro's 23%, John's 19.2%, Angelo's 17%) + Michelin Bib
  (Angelo's, Dalessandro's, Del Rossi's) = the standouts (t1). Pat's kept t1 as the historic ORIGIN (1930s, CBS + Wikipedia),
  explicitly described as history-not-best; Geno's / Jim's South St / Tony Luke's kept t2 as icons. Steve's Prince of Steaks
  HELD (only an SEO/blog listing; no credible 2nd source yet). Sonny's HELD (GQ 2014 claim seen only second-hand).
- Creators: Mark Wiens Taste Tour USA Philadelphia Pt 2 (Tubi) → attached to Angelo's (CREATORS_W1.json).
- HELD single-source (not added): Jean-Georges Philadelphia (Infatuation), Scampi, Griddle & Rice (Infatuation 2025 new),
  Amá + Emilia (Eater 38 summer 2026 mention only), June BYOB + White Yak (Philly Mag 50 Best mention only), Frida Cantina
  (6abc only), D'Jakarta Cafe (Food Republic 2015 only), Corropolese (Inquirer only — 2 Inquirer pieces = 1 outlet),
  Liberty Kitchen (Visit Philly roast pork only), Sonny's, Steve's.
- Address note: discovery addresses are best-known street addresses; several Michelin addresses were left partial
  (Provenance, Ambra, Illata, Little Water, Roxanne, Del Rossi's) — the geocode pass verifies/corrects every address.
- Counts after batch 1: food 60 (Michelin 34, canon 26), sights 24 (CC). Channel mix: institutional 37, editorial 47, creator 1.
- Dead end: 'Wikipedia coordinates A; B; C' for PMA/Barnes/ESP returned addresses only (no coords) — budget 1 search/pin.

## 2026-10-02 · W1 batch 2 + W2 — discover, fact-check, geocode, build
- Sources (researchedVia WebSearch): Atlas Obscura Philadelphia; Visit Philly area guides (Fairmount Park, West Philly,
  University City, Northwest, Germantown, Bella Vista, East Passyunk, South Philly, Fishtown, Northeast, Media, Jenkintown,
  sacred-sites trail, Black-history guide, Underground Railroad guide, historic district, Parkway, Penn's Landing, day trips,
  road trips, theater venues, architecture); NPS Independence 'Places to go'; Frommer's + Uncovering PA (Bucks County);
  SJ Magazine + Rutgers–Camden (Camden); Main Line Today + Valley Forge Tourism (Main Line, Bryn Athyn); Northeast Times;
  Philly Mag Best of Philly 2024 + Inquirer (soft pretzel); Infatuation/Visit Philly (Fishtown).
- Creator channel: Philly food TikTok scan (Inquirer 2023 + Philly Mag 2022 influencer pieces): @tanaradoublechocolate (3.7M,
  cooking — no place content), @chefchrischo (2.2M, owns Serabol — not independent), @phillyfoodladies (33K — below scale bar),
  @godfatherofmeat (302K — no findable place video found). None attached this wave; Mark Wiens (Tubi Taste Tour USA) → Angelo's.
- DROPPED: East Passyunk Singing Fountain (only Visit Philly; 2 VP pages = 1 outlet). Casa Mexico merged into South Philly
  Barbacoa (same building/business per geocode W1) — EXCLUDE in consolidate.py.
- CLOSED (flagged, kept): Hiroki — CLOSED (Inquirer 2026-08-02), Laurel — CLOSED (Inquirer 2025-11-19).
- Address/area corrections from geocode W1 agent: Honeysuckle → 631 N Broad St (NPH); Provenance 408 S 2nd St (CC);
  Little Water 261 S 20th St (CC); Illata 2241 Grays Ferry Ave (CC); Roxanne 607 S 2nd St (SPH); Ambra 705 S 4th St;
  Del Rossi's 538 N 4th St; Siddiq's 264 S 60th St; Castellino's 1255 E Palmer St; Antonio's 1014 Federal St;
  Farina Di Vita 250 Catharine St; South Philly Barbacoa 1134 S 9th St.
- Geocode results: sights 89 pinned (high 81 · med 8) via Wikipedia infobox coords (en.wikipedia.org-restricted batches) +
  1 latlong.net (PMA); Wyck + Germantown White House left unpinned (Wyck's Wikipedia point sits ~2 km south of 6026
  Germantown Ave — rejected). Food 15 pinned (6 Wikipedia high, 3 more Wikipedia high in W2, 5 RTM stalls med on the
  market building pin, Valley Green Inn med via Commons geotag); ~49 food UNVERIFIED (no place pin surfaced by WebSearch).
  REJECTED: Vetri Cucina 'interpolated' coordinate from neighbouring philadelphiabuildings.org addresses (interpolation ≠ pin).
- Build: 170 sourced → 106 on page (91 sights + 15 food); 4 gates PASS; npm validate + test PASS. Card live ('first edition').
- Channel mix (170): institutional (Michelin 34, NPS 9, JBF 3, UNESCO 1) · editorial/tourism (Visit Philly, Inquirer,
  Philly Mag, Infatuation, Billy Penn, Main Line Today, SJ Mag, Northeast Times…) · travel (Atlas Obscura, Frommer's,
  Lonely Planet, Time Out, Uncovering PA) · creator 1 (Mark Wiens) · reference (Wikipedia, every sight).

## 2026-10-02 · W2b — day trips + Bucks + Brandywine pins, rebuild
- Added (2 credible + Wikipedia pin each): Winterthur, Hagley, Nemours (Lonely Planet + Visit Delaware), Bucks County Playhouse,
  Peddler's Village, Sesame Place, Andalusia (Visit Philly New Hope + Visit Bucks County), Colonial Theatre Phoenixville
  (Visit Philly main streets). Pins added for already-sourced Smith Playground, Wissahickon (park point, med), Mann Center,
  Glencairn, Rocky Statue (Rocky Steps point, med), Ryerss (Ryerss Mansion).
- Rejected: New Hope borough point (town centroid — not a place pin); Race Street 'pier' hit was the street's own coordinate.
- Build: 178 sourced → 120 on page (105 sights + 15 food); 4 gates PASS; validate + test PASS; card + CITIES refreshed.

## 2026-10-02 · W2c — South Jersey + River Wards (final searches of the session budget)
- Added: Walt Whitman's Tomb / Harleigh Cemetery (SJ Magazine + NJ Monthly + Wikipedia pin, med — cemetery point),
  Hadrosaurus Foulkii Leidy Site (NJ Monthly + Wikipedia pin). HELD: Pomona Hall (Wikipedia only), Philadelphia Brewing Co.
  and Syrenka Luncheonette (Visit Philly only), Cooper River Park (river coordinate, not a park pin — rejected).
- Final build of the session: 180 sourced → 122 on page (107 sights + 15 food); 4 gates PASS; validate + test PASS.

## 2026-10-02 · W3 (session_013h32337aVQ9QKB7DKgSPdW) — food discovery by area, batches 1-2
- TOOL FIX: tools/density.py counted `phi_worklist.json` (a list) as food → the "297 discovered" figure was inflated;
  true post-W2 count = 180. density.py now skips any `*worklist*` file (same bug latent for akron/chicago/madison/... worklists).
- Method: candidate-name queries restricted to credible domains (Infatuation / Inquirer / Philly Mag / Visit Philly / Billy Penn);
  a place is added only when ≥2 distinct outlets confirm it in-result. Leads come from neighbourhood guides; nothing from memory
  is presented as sourced (addresses not seen in a result are left partial for the geocode pass).
- Sources used: Infatuation Fishtown/West Philly/Old-school Italian/Classic/Chestnut Hill/Mt Airy/Manayunk guides; Visit Philly Fishtown,
  Baltimore Ave, halal, Chinatown, Indian, first-timers, bakeries, Mexican, Latino-owned, alt-cheesesteak guides; Philly Mag
  Where to Eat in Fishtown, halal, Chinatown, Italian Market Bible 2026, Chestnut Hill, Best of Philly archive, 50 Best; Inquirer
  (LaBan reviews, The 76 2025, Chinatown guide, BBQ survey); Billy Penn (Ethiopian/Eritrean, Italian bakeries 2026, Port Richmond).
- Added batch 1-2: FISH Wm. Mulherin's Sons, Fette Sau, Loco Pez, Sulimay's (HELD lead cleared), Gilda, Front Street Cafe,
  Frankford Hall, Czerw's Kielbasy, Hello Vietnam · UCW Dahlak, Abyssinia, Gojjo, Kilimandjaro, Vientiane Cafe, Dock Street,
  Fu-Wah, Saad's, Hadramout, Manakeesh, Dim Sum House · CC Dim Sum Garden + Nan Zhou (HELD leads cleared), Sang Kee, Tom's Dim Sum,
  Ting Wong, Amma's, Franklin Fountain, McGillin's, Oyster House, Parc, Amada · SPH Ralph's, Dante & Luigi's, Villa di Roma,
  Termini Bros, Isgro, Di Bruno Bros, Le Virtù, Mike's BBQ, Ray's Happy Birthday Bar, Los Cuatro Soles, Mole Poblano,
  Café y Chocolate · NW McNally's (Schmitter), Jansen, Cake, El Poquito, Töska, Night Kitchen, Bredenbeck's, White Yak +
  Liberty Kitchen (HELD leads cleared).
- Sights batch: CC Wanamaker Building & Organ, Walnut Street Theatre, The Rosenbach, Franklin Square · NW Stenton, Ebenezer
  Maxwell Mansion, Awbury Arboretum, Concord School House, Thomas Mill Covered Bridge (all Wikipedia infobox pins, high).
- CLOSED → DROPPED (non-notable): Cheu Fishtown + Bing Bing Dim Sum (Philly Mag/Inquirer 2024-05), Pizza Brain Fishtown (Philly Mag
  2024-05), Lunar Inn (Philly Mag 2023-11), Martha (Infatuation 'permanently closed'), Krakus Market (2018), Syrenka (late 2019 per
  philadelphianeighborhoods.com 2024 — the HELD lead is now dropped), Nam Son Bakery (2019 → became Hello Vietnam), Rangoon (2021
  closing), Earth Bread + Brewery (→ Töska).
- HELD single-source: Izakaya Fishtown, Jean, Emmett, Nunu (Infatuation only); Shane Confectionery, Federal Donuts, Penang, Bai Wei,
  Plaza Garibaldi, Pho Ha, Cafe Diem (Visit Philly only); Monk's Cafe, Tacos Don Memo, Eda's, Manayunk Indian Grille, Smiley's
  (Infatuation only); Stock's Bakery (student outlet only); El Compadre (status conflict 2018 closure vs 2021 activity); Upsala
  (Wikipedia coordinate looked wrong — ~4 km east of 6430 Germantown Ave; rejected).

## 2026-10-02 · W3 batches 3-4 — MAIN, DAY edge, NE + status pass
- Added MAIN: Hymie's, Lark, Ripplewood, Eshkol, Little Blue Owl, Tired Hands, Teresa's Next Door, Malooga (Narberth) — Infatuation
  Near Main Line guide × Main Line Today × Inquirer/Philly Mag/Visit Philly. DAY: Pica's (West Chester) — the Upper Darby original
  CLOSED Oct 2025 (Inquirer/Philly Mag); the upside-down pie continues in West Chester (Main Line Today).
- Added NE: The Dining Car, Tony's Place, Georgian Bread, La Nova, Bell's Market, Picanha — Inquirer (LaBan NE guide) × Infatuation
  20 best NE × Visit Philly NE guide × Northeast Times 2026 cheesesteaks × Philly Mag.
- HELD: Ipanema, Passage (single outlet each in-result); Sergio's (Infatuation only); Teresa's Cafe (MLT only).
- Status pass (background agent, 35 searches): 60 W3 food → 27 open, 33 unknown, 0 pins (no Wikipedia/!3d!4d pins exist for these).
  CLOSED → DROPPED: Jansen (Inquirer closings 2025, 2025-12-30). Address corrections: Gilda → 300 E Girard Ave (moved; 6abc/Inquirer
  2026-05), Kilimandjaro → 4301 Chestnut St (reopened 2024-09), Café y Chocolate → 1532 Snyder Ave, Hello Vietnam → 722 N 2nd St.
  Fette Sau Philly open (only Williamsburg closed 2025-12); Sang Kee reopened after a Dec 2024 city shutdown.

## 2026-10-02 · W3 batches 5-8 — SJ, DAY, NPH, CC classics, FISH bars, sights
- SJ (Infatuation South Jersey section × Inquirer Cherry Hill/Collingswood guides × NJ Monthly × SJ Magazine): Donkey's Place, Corinne's
  Place, June BYOB (HELD lead cleared), Hearthside, Kiko's, Norma's, Farm and Fisherman, Indeblue, Radin's, Steak 38, Gass & Main, Nan Xiang.
- DAY: Andiario, Talula's Table, Bluebird Distilling, Sly Fox (Inquirer × Main Line Today × Philly Mag × Visit Philly).
  HELD: Marsha Brown (Visit Philly only), Longwood's 1906 (Inquirer only), Portabello's (unattributed).
- NPH (Visit Philly El Centro de Oro list × Inquirer/Billy Penn/Infatuation): Max's Steaks (sale in progress Jan 2026 — status to
  re-check), Tierra Colombiana, Freddy & Tony's, Porky's Point, El Coqui. MEASURED & DROPPED: Hops Brewerytown (2019 opening news only
  — a mention, not merit). HELD: El Bohio, La Sierra, La Caribeña, Delicias, El Principe, Taqueria La Raza, Vivaldi (Visit Philly only).
- CC: Shane Confectionery + Federal Donuts + Monk's Cafe (HELD leads cleared), Butcher and Singer, Barclay Prime, Talula's Garden,
  Double Knot, Goldie (Philly Mag Best of Philly × Inquirer × Infatuation).
- FISH: Johnny Brenda's, Middle Child Clubhouse, Emmett (HELD lead cleared; Esquire Best New 2025), Philadelphia Brewing Co (HELD lead
  cleared), Cafe La Maude, Standard Tap. HELD: Jean (opened 2026 above Emmett — preview coverage only).
- Sights (Visit Philly / Atlas Obscura / Inquirer × Wikipedia infobox pins): Fort Mifflin, American Swedish Historical Museum, Girard
  College Founder's Hall, Frankford Avenue Bridge (1697), Simeone Automotive Museum, John Heinz NWR (med — refuge point), 30th Street
  Station, Fisher Fine Arts Library, Mount Moriah Cemetery (med — cemetery point). Dead end: FISH-sight Wikipedia batch (Graffiti Pier,
  Johnny Brenda's) returned no pins; Frankford Arsenal measured & dropped (office park now — no visitor merit).
- Creator channel: Dave Portnoy One Bite → Angelo's (9.1 in 2019, region's highest, per Inquirer 2026-08-05) — CREATORS_W3.json.
  His 2026 Philly stops (Johnny's Bryn Mawr, Marina's Fishtown, Liguria) not attached: scores not in-result.
- Channel mix so far W3 (101 food + 18 sights): editorial of record (Inquirer, Philly Mag) ~95 · Infatuation ~65 · Visit Philly ~60 ·
  regional (Main Line Today 14, NJ Monthly 4, SJ Mag 1, Northeast Times 1) · travel (Atlas Obscura 3) · Billy Penn ~10 · creator 1.

## 2026-10-02 · W3 batches 9-24 — canon, award lists, neighbourhood guides, sights, pins
- Food canon: hoagies (Inquirer 20 best × Philly Mag 25 essential): Cosmi's, Ricci's, Sarcone's Deli, Campo's, Cacia's (Chickie's is
  now Antonio's — already listed). Water ice: Pop's (Best of Philly) added; Italiano's added then DROPPED (closed, Inquirer 2013/2021).
- Award lists (lone-authority JAMESBEARD, recorded with the reporting outlet's URL): JBF 2026 finalists/semifinalists → Fiore, Amá,
  Almanac (+JB on Radin's); JBF 2025 semifinalists → Mawn (WON Emerging Chef 2025), Vernick Fish, Bolo, Little Fish, Càphê Roasters,
  Machine Shop, Kampar; JBF 2024 → Cantina La Martina, a.kitchen + bar (+JB on Isgro, Gass & Main); JBF 2023 → Gabriella's Vietnam,
  Heavy Metal Sausage, Denise's Delicacies, Mighty Bread, Le Caveau (+JB on Monk's); America's Classics 2024 → Vietnam Restaurant.
  NYT best-in-America: Bomb Bomb Bar (2026, Philly's only entry), Meetinghouse + Mawn (2025), Amá (NYT greatest Mexican 2026).
  Michelin: no 2026 Philadelphia edition yet — the Nov-2025 list is what W1 already holds.
- Neighbourhood guides crossed with a 2nd outlet: Northeast Times 2026 lists × Infatuation NE (Steve's — HELD lead cleared, Giannone's,
  La Patrona, Bishos, Asad's, Marinucci's, Café Carmela); Infatuation Germantown/Mt Airy × Philly Mag/Visit Philly (Deke's, Uncle
  Bobbie's, Nile Cafe, Malelani, Attic Brewing) + Manayunk Brewing; Infatuation University City × Inquirer/Visit Philly (Terakawa,
  Walnut Street Cafe, Franklin's Table, Clarkville, Renata's, Sabrina's) + Doro Bet, Vietnam Cafe; Infatuation Old City/Rittenhouse ×
  Visit Philly/Inquirer (Malooga, Khyber Pass, Ogawa, Fork, Sonny's — HELD lead cleared, Buk Chon, Tequilas, La Jefa); Infatuation East
  Passyunk/South Philly × Philly Mag/Inquirer/Visit Philly (Sao, Tesiny, Irwin's, Palizzi, Perla, CJ & D's, Blue Corn, Scampi — HELD
  lead cleared); Delco (Inquirer × 6abc/Main Line Today): Phil & Jim's, Ro-Lynn.
- MEASURED & DROPPED: Wit or Witout (only the Northeast Times citing a 2009 Philly Mag award — one real source); Guido's / Stoli's
  (Yelp-ranking basis only); McMenamin's (a mention, not merit); Fireman's Hall Museum (two Visit Philly pages = one outlet); Hops.
- HELD: Penang, Bai Wei, Plaza Garibaldi, Pho Ha, Cafe Diem, Ipanema, Passage, Buna Cafe, Trattoria Carina, Uchi, Prunella, Little
  Nonna's, Barbuzzo, Buddakan, Morimoto, Han Dynasty, Lucky's Last Chance, Goat's Beard, Jean, Emilia, Mancuso's, D'Emilio's, Grey Towers
  Castle, Church of the Advocate, Rail Park, Graffiti Pier (2024 partial collapse; park plans in limbo — not presented as a visit).
- Status pass 2 (background agent, 30 searches, 22 checked): CLOSED → Tony's Place (Mayfair, 2022; Philly Grub 2026-03-30) kept FLAGGED
  as "Tony's Place — CLOSED" (notable: 'probably the best tomato pie in the city'); Italiano's dropped. 20 address corrections applied
  (Goldie → 1911 Sansom; Le Caveau → 614 S 7th St, moved to SPH; Kampar, Fiore, Amá, Almanac, Denise's, Mighty Bread, Cherry Hill/
  Haddonfield/Collingswood addresses …). Federal Donuts: July 2026 CookNSolo closures hit several shops — address left generic.
- Sights (Visit Philly / Valley Forge Tourism / Visit Bucks / Hidden City / Atlas Obscura / NPS × Wikipedia pins): NPS Independence
  (Declaration House, Todd House, Bishop White House, Kosciuszko NM, Old City Hall — its Wikipedia point sat ~150 m off 5th & Chestnut,
  REJECTED, left unpinned); Hopewell Furnace NHS; New Hope Railroad; Bowman's Hill; Pearl S. Buck House; Keswick Theatre, Graeme Park
  (med, minute precision), Hope Lodge, Harriton House; Cave of Kelpius; Main Street Manayunk; Lemon Hill, Woodford, Laurel Hill Mansion
  (the 4 park houses open for tours incl. Strawberry Mansion); Neumann Shrine; Clay Studio; Divine Lorraine (med), Horticulture Center,
  The Met, Taller Puertorriqueño; African American Museum, Weitzman NMAJH, National Liberty Museum.
- Restaurant place pins (Wikipedia infoboxes, geo/_geoout_w3_foodpins.json): Meetinghouse, Mish Mish, Her Place, Dalessandro's,
  McGillin's, El Chingón, Max's (status unknown — sale in progress Jan 2026). Pat's/Geno's/Jim's were already pinned (W1).
- Build (after batch 14): 341 sourced → 152 on page; 4 gates PASS; validate + test PASS; card + CITIES refreshed.

## 2026-10-02 · W3 batches 25-29 + final build (session ended at the 200-search cap)
- FISH: Bastia (HELD lead cleared — #1 Philly Mag 50 Best 2025 + LaBan), R&D, Les & Doreen's, Kostas, Lloyd, Barcade (Philly Mag Where
  to Drink in Fishtown × Infatuation/Inquirer/Visit Philly). DAY: Vecchia, Domani Star, River House at Odette's; Washington Memorial
  Chapel, Mill Grove, Newlin Grist Mill, Baldwin's Book Barn (pinned). MAIN: Coyote Crossing, Conshohocken Brewing, Autograph, Rosalie,
  La Belle Epoque (Main Line Today every-town guide × Inquirer/Infatuation/Philly Mag). CC: Han Dynasty, K'Far, Via Locusta, DanDan,
  Heung Fa Chun, Bud & Marilyn's, The Olde Bar (Philly Mag Center City guide × Infatuation/Inquirer/Visit Philly). NW: Santucci's
  (Roxborough), Schuylkill Center. SJ: Pomona Hall (pinned), Red Bank Battlefield, Cooper River Park, Barclay Farmstead (Visit NJ ×
  Inquirer/NJ Monthly/SJ Magazine). New registry outlets: VISITNJ (SOURCES_W3.json).
- NOT presented: Devil's Pool (swimming is illegal — pollutant levels), Graffiti Pier (2024 partial collapse).
- Status pass 3 (26 searches before the cap): 21 checked → 12 open, 9 unknown, 0 closed (3 closings round-ups clean); 15 address fixes
  applied (Sao 1710 E Passyunk, Tesiny 719 Dickinson, La Jefa 1605 Latimer, Kostas 15 W Girard, Vietnam Cafe 814 S 47th, …).
- FINAL BUILD: 422 sourced → 170 on page (149 sights + 21 food); --sourcecheck/--geocheck/--statuscheck/--buildcheck PASS; npm
  validate + test PASS; index card + CITIES row refreshed; AGENT-PROMPTS run-log row + RESEARCH-LOG notes added.
- W3 channel mix (242 new places): editorial of record (Inquirer ~120, Philly Mag ~95), Infatuation ~110, Visit Philly ~85, award
  bodies (James Beard 30, NYT 4, NPS 7), regional (Main Line Today 20, Northeast Times 9, NJ Monthly 5, SJ Mag 3, Visit NJ 4, Valley
  Forge Tourism 6, Visit Bucks 4), travel (Atlas Obscura 5), local (Billy Penn ~12, Hidden City 5, 6abc 1, PhillyVoice 1), creator 1
  (Portnoy). Wikipedia = coordinates/notability for ~50 sights + 7 restaurants.

## 2026-10-03 · W4 — food & drink first density wave (session_01ECt8nbbQXGgxskj1179NHd)
**Plan.** Close NEED areas food & drink first (RUN §2b), plus a pin pass on ~230 unpinned restaurants and a status pass on 183
'unknown'/unchecked places — the two passes delegated to 3 background agents capped at 30 WebSearch calls each.
**Discovery (main thread, ~90 searches) — +33 places (31 food & drink, 2 sights), FOOD_W4.json / SIGHTS_W4.json:**
- FISH: Evil Genius Beer Co. (Northeast Times 2026 taproom roundup + Billy Penn + Inquirer), Four Humours (Infatuation + Philly Mag best
  Fishtown bars), Bottle Bar East (Philly Mag + Hop Culture), Emilia (LaBan "phenomenal" Apr 2026 + Philly Mag + Eater 38 summer 2026),
  Stock's Bakery (Inquirer ×2 + PhillyVoice), Mixteca (Inquirer Aug 2026 + Eater heatmap Sep 2026); sight Las Parcelas (WHYY + Smithsonian
  Community of Gardens + 6abc).
- NPH: Rybrew (Philly Mag Brewerytown guide + Inquirer). CC: The Boozy Mutt (Philly Mag review + Inquirer + Billy Penn; 27th & Poplar is
  south of Girard → CC per the brief), Bar Cicci (Inquirer + Eater), Ray's Cafe, EMei, Nom Wah (Infatuation Chinatown + Visit Philly).
- NW: CinCin (Philly Mag + Infatuation + Time Out + Chestnut Hill Local), Bar Jawn + Love City Manayunk (Infatuation + Philly Mag; Love
  City also Inquirer/PhillyVoice 2026), Mount Airy Tap Room (Infatuation + Chestnut Hill Local), Young American Hard Cider (Inquirer + NBC10).
- UCW: Local 44 (Time Out + Inquirer + Philly Mag), Booker's (LaBan + Visit Philly + Inquirer 2023 new-owner story), Buna Cafe (LaBan + Infatuation).
- NE: Northeast Sandwich Co., China Gourmet (Infatuation NE 20 + Northeast Times), Gaeta's Tomato Pies (Inquirer + Infatuation + Billy Penn +
  Northeast Times), Chaikhana Uzbekistan, Miracles Jamaican (Philly Mag NE guide + Visit Philly).
- MAIN: Bam Bam Kitchen (Inquirer Ardmore map 2025 + Philly Mag). SPH: Anh Em (Inquirer + Eater), Manatawny Still Works & Barcelona Wine Bar
  East Passyunk (Philly Mag where-to-drink + Billy Penn / Time Out / PhillyVoice), Bob & Barbara's (Inquirer + WHYY + Visit Philly + Philly Mag),
  American Sardine Bar (Inquirer + Infatuation); sight Sparks Shot Tower (Wikipedia pin + Inquirer + PhillyHistory).
- Channel mix: editorial of record (Inquirer/LaBan, Philly Mag, WHYY, Billy Penn) 33/33 · travel/food sites (Infatuation, Eater, Time Out,
  Visit Philly) 22 · local press (Northeast Times, Chestnut Hill Local) 8 · creators 0 (no new verifiable-scale Philly creator surfaced this wave).
**MEASURED & DROPPED / HELD.** Crime & Punishment Brewing (closed Apr 2025, Inquirer) and Majolica (closed Dec 2019) dropped — non-notable
closed. Graffiti Pier skipped: Conrail-owned, trespass-only after the 2024 partial collapse, sale/park stalled (FOX29/WHYY/Inquirer) — not a
place to send visitors. HELD single-source (Visit Philly El Centro de Oro guide only; Star News Philly echoes it): El Bohio (2746 N 5th St),
La Sierra (3401 N Front St), La Caribeña Bakery (3447 N 2nd St), El Príncipe (115 W Lehigh Ave). Held for no address/second source:
Ramen MNYK, Zion's Cuisine, Next of Kin (Fishtown vs 2025 Wash Sq W move unclear), Asadero Los Tios, Four Seasons Diner, Lipkin's, Passage,
Broncos, Green Eggs Brewerytown (conflicting addresses), Indiya + Cafe Antonio's (Collingswood — sources unattributable), Black Bass Hotel
(OpenTable 4.8/4,966 = measurement only), Portabello's (regional blogs only), Iron Hill/Side Bar West Chester (County Lines only).
**Background passes.** Pin A/B (56 searches): 8 pins, all Wikipedia-infobox coords (Provenance, Vedge, Barclay Prime [ground floor of
The Barclay — recheck], Tony Luke's, Sly Fox, Steve's, Talula's Table, Joe's Steaks) graded med. Google `!3d!4d` place URLs, OSM nodes and
Michelin coordinates NEVER surface through WebSearch — restaurant pins need tools/geocode-helper.html. Status pass (29 searches): 10 open
(Michelin/76/NYT/JBF 2026 lists), 2 CLOSED: Kensington Quarters (16 Mar 2024; PhillyVoice + Philly Mag) and Dock Street Brewing West Philly
(31 May 2022; Billy Penn + Philly Mag) — kept, flagged. Federal Donuts: 3 Center City shops closed Jul 2026, Fairmount Ave + South St remain.
**Build.** rebuild-city --build: sourcecheck PASS 455/455 · geocheck PASS · statuscheck CONSISTENT · buildcheck PASS; page 179 on map
(150 sights + 29 food); npm validate DATA OK; npm test ALL PASS. Card + CITIES row refreshed.
- Addendum (end of W4): La Caribeña Bakery (NPH) promoted from held → added with a 2nd source, Temple University's Philadelphia
  Neighborhoods newsroom (registered as PHILLYNEIGHBORHOODS, corroborating only). Rebuild: 456 sourced, 4 gates PASS, validate + test PASS.
  Searches this session: ~95 main thread + 86 in background passes. DAY food searches (LaBan Chester County, Lambertville/New Hope,
  Kennett, Phoenixville, West Chester) returned only OpenTable/County Lines/regional blogs — no 2-credible place; DAY stays NEED +3.

## 2026-10-03 · W5 — pins first, then NEED areas (session_01MqoZKuTGYq8oSdEz2K3dLu)
**Pin probe.** Re-tested the restaurant pin channels before spending: `"1625 Sansom St" !3d39 !4d-75` on google.com returns only
`maps?cid=` / `data=!4m2!3m1!1s…` links (no `!3d!4d`); mapcarta-restricted queries for Zahav/Dizengoff return nothing. The W4 lesson
stands — so the pin pass is limited to restaurants with their own Wikipedia article or a Wikipedia-listed host building (background
agent, ≤50 searches → geo/_geoout_w5_pinA.json). The rest stay UNVERIFIED for tools/geocode-helper.html.
**Batch 1 (UCW + NPH, food first) — FOOD_W5.json / SIGHTS_W5.json:**
- UCW: Cleo Bagels (Infatuation West Philly 20 + Philly Mag ×2), Indian Char House (Infatuation review + Visit Philly 12 best Indian),
  Alif Brew & Mini Mart (Billy Penn + Inquirer Cedar Park guide + Philadelphia Tribune; Food & Wine best lunch); sights Paul Robeson
  House & Museum (Wikipedia pin 39.95667,-75.22139 high + WHYY + 6abc), Malcolm X Park (Wikipedia + PhillyVoice + Phila Tribune; pin not surfaced).
- NPH: Gou (Infatuation + Inquirer + 6abc + WHYY 2026), Down North Pizza (NYT 2021 list via Inquirer + LaBan + Philly Mag Best of Philly
  + Infatuation), Sid Booker's Shrimp Corner (Infatuation + Inquirer 2025 obit + Philly Mag), El Bohio + Delicias Bakery (HELD leads
  cleared: Visit Philly El Centro de Oro + Inquirer El Bloque de Oro neighbourhood guide), Baby's Kusina & Market (LaBan review 2025 +
  Philly Mag + Infatuation), Champs Diner (Infatuation + Philly Mag Temple guide + Inquirer), Kim's BBQ (Inquirer + Philly Mag + Infatuation).
- MEASURED & DROPPED: Aksum (4630 Baltimore Ave) — permanently closed (Infatuation), non-notable → dropped. Kabobeesh (4201 Chestnut)
  — Inquirer page + 2011 Philly Mag only, delivery listing closed 2022, current status unclear → HELD.
- New outlets: FOODANDWINE, PHILLYTRIB (SOURCES_W5.json). NPH now 33/30 OK (food 17/33 = 52% — over the §2b bar for the first time).
**Pin pass A (background agent, 44 searches) → geo/_geoout_w5_pinA.json (34 records):** 0 high · 3 med · 31 UNVERIFIED.
Med = Wikipedia coordinates of the host building: Vernick Fish (Comcast Technology Center 39.9549,-75.1704), Walnut Street Cafe
(FMC Tower 39.952114,-75.18351; the page's rougher 39.957,-75.182 point lies north of Walnut and was rejected), Talula's Garden (Ayer
Building 39.94726,-75.15354). Di Bruno Bros. NOT pinned to the Italian Market's Wikipedia point (a street-length market — a centroid).
Shane Confectionery / Philadelphia Brewing Co. / Tired Hands have articles but no coordinates surfaced. CLOSURE: Tired Hands Brewing
Company, 16 Ardmore Ave — renamed Ardmore Brewing Co. (spring 2025), private events only, no public hours (Inquirer 2026-02-20) →
status closed, kept flagged; the Fermentaria (35 Cricket Terrace) added as the live Tired Hands entry. **Verdict: WebSearch pinning
for restaurants is exhausted (3/34 this wave, 8/56 in W4) — remaining restaurant pins need tools/geocode-helper.html.**
**Batch 2 (DAY + MAIN):**
- DAY: Victory Brewing (Downingtown) (Visit Philly 15 essential breweries + Time Out + Wikipedia), Free Will Brewing (Perkasie)
  (Visit Philly + Inquirer + Visit Bucks), Levante Brewing (Visit Philly + Philly Mag + Inquirer). DAY now 35/35 OK (food 11/35 = 31%).
- MAIN: Carlino's Market (MLT Best Deli 2026 + Inquirer 2026 + 6abc), The Bakery House (MLT Best Bakery 2026 + Philly Mag Best of Philly
  + Inquirer suburban bakeries), Minella's Diner (MLT Best Diner 2026 vote + PhillyVoice), Teikoku (MLT Best Japanese/Sushi 2026 + Philly
  Mag), Tired Hands Fermentaria (Inquirer 2025 + Main Line Today + Visit Philly + LaBan best brewpubs).
- MEASURED & DROPPED: Kennett Brewing Co. (closed, ~9 yrs in), Iron Hill West Chester (closed — becoming Magerk's, Inquirer 2026-05),
  Inn at Phillips Mill (2590 N River Rd listed for sale/redevelopment — not presented), Aksum. HELD single-outlet: The Hawke, Hamilton's
  Grill Room, Lambertville Station (NJ Monthly only); Osushi (MLT only); Locust Lane, Will's + Bill's, Bald Birds, Animated (Inquirer only).
**Batch 3 (FISH) — built.** Boricua #2 (Philly Mag Best of Philly + Inquirer + Infatuation), Amy's Pastelillos (Esquire best new 2024 via
PhillyVoice + Infatuation + Philly Mag + Inquirer 2026), St. Oner's (Inquirer + Philly Mag + PhillyVoice; open per Inquirer 2026-02),
Café Tinto Fishtown (Infatuation + Inquirer 2026 hot-dog map + 6abc), Elma (LaBan 2024 + Infatuation), Pizza Shackamaxon (Philly Mag BoP
+ Visit Philly + Infatuation), Tulip Pasta & Wine Bar (LaBan review + Infatuation); sight Liberty Lands Park (Temple Philadelphia
Neighborhoods + Project for Public Spaces [new key PPS] + PhillyVoice). FISH 56/55 OK.
Build: rebuild-city --build → sourcecheck PASS 485/485 · geocheck PASS · statuscheck CONSISTENT (6 closed flagged incl. Tired Hands
Brewing Company — CLOSED; 14 on-page places with no closure check) · buildcheck PASS; page 183 on map; npm validate DATA OK, npm test ALL PASS.
Push race with other agents: docs/GEOCODE-BACKLOG.md (generated) conflicted twice → resolved by regenerating (tools/geocode-status.py);
helper data/philadelphia-research/_phi_push.sh now does pull→regen-backlog-on-conflict→push with retry.
**Batch 4 (NW + SPH + CC):**
- NW (Infatuation Germantown & Mount Airy 20 × second outlet): Salam Cafe (Philly Mag Best of Philly Best Ethiopian), Downtime Bakery
  (Inquirer ×2 + PhillyVoice + Chestnut Hill Local), Doho (Inquirer + 6abc + Chestnut Hill Local), Tranzilli's Real Italian Water Ice
  (Inquirer + Visit Philly best water ice), Hot Clucks (Inquirer halal hot chicken). HELD: Zion's Cuisine (Infatuation + 6abc crime story
  — mention, no address number), Tyemeka's (Infatuation only), Das Good Cafe (Inquirer only).
- SPH: Bok Bar (Inquirer rooftops 2025 + Infatuation + Visit Philly), Café Ynez + Sidecar Bar & Grille (Philly Mag + Visit Philly Graduate
  Hospital guide), Schmaltz (Inquirer 2026 + Infatuation), Griddle & Rice (Philly Mag + Inquirer + Infatuation), Lillian's (Inquirer 2026 +
  Infatuation hit list). CC: Grace Tavern (reopened Sept 2025 — Inquirer + Philly Mag + Infatuation).
**Batch 5 (NE + CC + creator):** NE: Holmesburg Bakery (Philly Mag NE guide + Infatuation + Northeast Times; since 1900), Four Seasons
Diner (Infatuation review + best-diners guide; 6abc). CC: Barbuzzo (Visit Philly + Philly Mag BoP Best Dessert + Inquirer), Little Nonna's
(Infatuation + Philly Mag BoP + Visit Philly + Thrillist via PhillyVoice), Morimoto (HELD lead cleared — Inquirer + Infatuation + Philly
Mag BoP Best Japanese + Visit Philly). NE 25/25 OK, CC 126/125 OK.
- Creator query (§2a): Mark Wiens — Taste Tour USA S1 E15–16 Philadelphia (Tubi) → CREATORS_W5.json, attached to Angelo's Pizzeria (Part 2
  names it); Part 1 names no restaurant → rejected. Creator channel contributes 0 new places this wave (corroboration only).
- Lipkin's Bakery: closed on Castor Ave 2022, merged into Lipkin's Best (Overbrook Park) — address not surfaced → HELD. Passage (10783
  Bustleton) — summary could not be attributed to a specific outlet → still HELD. Seorabol Olney closed 2025-06-25 (not in dataset).
- Note: Gou's address (5734 Old 2nd St) came from a search summary; Seorabol's Olney strip mall was at 2nd & Grange — confirm the unit
  number before pinning (geocode-helper).
- Dish-line hygiene: every W5 `dish` was re-checked against the cited text; memory-only dish names (e.g. mofongo, longsilog, butter
  cake) were removed before commit.
**Batch 6 (last gaps) — every area now OK in density.py (506 discovered / 505 sourced).** SJ: Zeppoli (LaBan review + Inquirer Collingswood
guide + Philly Mag + 6abc). UCW: Kabobeesh (HELD lead cleared — moved to 3748 Lancaster Ave, reopened 2026-04-10, Inquirer 2026-04-23 +
Philly Mag). MAIN: Grey Towers Castle (HELD lead cleared — National Historic Landmark; Wikipedia + Atlas Obscura; pin not surfaced).
**Status pass (on-page places with no closure check, 3 searches):**
- Thaddeus Kosciuszko NM → open (NPS hours: weekends, closes for the season 2026-11-01).
- Declaration House (Graff House) → CLOSED to the public per NPS place page — flagged "— CLOSED" (exterior still viewable; noted).
- Talula's Garden → open (PhillyVoice 2025). Max's Steaks → unknown (sale to Rob LaScala in progress, Inquirer 2026-01-12).
- **Tony Luke's (39 E Oregon Ave) renamed → "Tony & Nick's Steaks (formerly Tony Luke's)"**: the original stand was forced to drop the
  name in 2022 (Inquirer 2022-07-11, 6abc); still open. Record, geoout files and registry key renamed; Wikipedia pin kept (same building).
- **Joe's Steaks + Soda Shop — PIN REMOVED**: the W4 Wikipedia pin (40.018443,-75.058081) was the Torresdale Ave original, which CLOSED
  Labor Day 2022 after 73 years (Inquirer 2022-07-01, PhillyVoice). The live shop is the Fishtown flagship, 1 W Girard Ave (Star News
  Philly 2022-07-07, Philly Mag) → record re-addressed, coordinate set UNVERIFIED for the geocode-helper (registry edited under the lock,
  geoout w1/w4 records corrected so the merge can't restore the stale pin). A pin on a closed branch is a wrong pin.
- Build: sourcecheck PASS 505 · geocheck PASS · statuscheck CONSISTENT (7 closed flagged; 9 on-page places still unchecked) · buildcheck
  PASS; page 182 on map; npm validate DATA OK, npm test ALL PASS.
**Batch 7 (DAY food share 31% → 50%):** Jolene's (Inquirer top 2025 openings + MLT Best French 2026); Phoenixville — Stable 12 Brewing
(Visit Philly Craft Beer Trail + MLT), Steel City Coffeehouse & Brewery (Visit Philly + MLT + Inquirer), Root Down Brewing (Inquirer 2017 +
Craft Beer & Brewing 'Breakout Brewer' [new key CRAFTBEERBREWING]); Kennett Square — Portabello's (HELD lead cleared: Inquirer Kennett
guide + MLT), Philter Coffee, La Michoacana Homemade Ice Cream (Inquirer + MLT), Sweet Amelia's (LaBan review 2023 + MLT); Chadds Ford —
Hank's Place (reopened 2025-07-15 after Ida: Inquirer + 6abc + MLT + CBS), Chaddsford Winery (MLT + Visit Philly wine guide + Inquirer);
New Hope — Stella of New Hope (Inquirer + 6abc + Visit Bucks), Ferry Market, Nektar (Inquirer New Hope guide + Visit Philly [+ Visit Bucks]).
DROPPED/HELD: The Hattery Stove & Still (replaced by The Still on State); Heirloom, Terrain Café (Doylestown — no address surfaced);
Pietro's Prime (OpenTable/MLT only); Rivertown Taps, Sedona Taphouse (single outlet / opening notice only).
**W5 FINAL BUILD:** rebuild-city --build → sourcecheck PASS 518/518 (0 lone-authority) · geocheck PASS · statuscheck CONSISTENT (7 closed
flagged; 10 on-page places without a closure check — listed in RESUME) · buildcheck PASS; page 182 on map (151 sights + 31 food); npm
validate DATA OK; npm test ALL PASS. density.py: every area OK; food share ≥50% in every area (DAY exactly 50%).
**W5 channel mix (62 new places):** editorial of record (Inquirer/LaBan ~45, Philly Mag ~22, WHYY/Billy Penn/Phila Tribune ~6) ·
food/travel sites (Infatuation ~30, Visit Philly ~22, Time Out 1, Food & Wine 1, Craft Beer & Brewing 1, Atlas Obscura 1) · regional
(Main Line Today ~14, Visit Bucks 3, Chestnut Hill Local 2, Northeast Times 1) · local TV (6abc ~10, CBS 1) · creators 1 (Mark Wiens,
corroborating Angelo's only) · Wikipedia (2 sights). Searches: ~122 main thread + 44 background pin agent.

## 2026-10-03 (W6 · PINS, session_01DsVQh4xSMpquswxCXqQqid) · batch 1 — Apple Maps place pins, tier-1 first
- **Channel:** `WebSearch` with `allowed_domains:["maps.apple.com"]` (technique from Miami W4). Queries of 3 "Name street-address"
  items (address-style beat "Name + cuisine + neighbourhood" here); results whose URL carries `coordinate=`/`ll=` give Apple's own
  place pin. New helpers: `_phi_pin.py` (asserts name ∈ dataset, not already pinned, Philly-region bbox) and `_phi_pinurl.py` (parses
  coordinate + address from the Apple URL and refuses a **high** pin when the URL's street number ≠ the record's). Output
  `geo/_geoout_w6a.json`. Bare `place-id=` URLs carry no coordinate → left UNVERIFIED (never inferred).
- **Pins (49 · 48 high, 1 med):** CC — Dizengoff, Vernick Food & Drink, Vetri Cucina, Fork, Almanac, Oyster House, Butcher and Singer,
  Nom Wah Tea Parlor, Shane Confectionery, Amada, Middle Child, My Loup, Sang Kee Peking Duck House, Parc, Double Knot · SPH — Gabriella's
  Vietnam, Ba Le Bakery, Angelo's Pizzeria, Famous 4th Street Delicatessen, Fiorella, Royal Sushi & Izakaya, Ralph's, Dante & Luigi's,
  Le Virtù, Cosmi's Deli, Ricci's Hoagies, Mawn, Little Fish, Kampar, Sao, Ambra · FISH — Suraya, Pizzeria Beddia, Laser Wolf, Wm.
  Mulherin's Sons, Castellino's, Pietramala, Middle Child Clubhouse, Fiore, Càphê Roasters, Bastia (**med** — Apple query-listing URL has
  no street address; point at Susquehanna & Belgrade = Hotel Anna & Bel) · UCW — Abyssinia, Doro Bet · NW — The Nile Cafe · NE —
  Marinucci's Deli, China Gourmet · NPH — Down North Pizza · SJ — Corinne's Place · DAY — Andiario.
  Status for each: Apple listing active (no closure marker) + 2025–26 discovery sources.
- **Held / leads:** Paesano's — Apple lists "Paesano's Philly Style" at 943 S 9th St (record: 1017 S 9th St) → not pinned; address
  re-check. Han Dynasty (Old City) — an Infatuation snippet says 110 Chestnut vs record 123 Chestnut → not pinned. Franklin Fountain —
  only the sibling Franklin Ice Cream Bar (112 Market) surfaced with a coordinate → not used.
- **Build:** 182 → 231 on map (151 sights + 80 food). sourcecheck PASS 518 · geocheck PASS · statuscheck CONSISTENT (7 closed; 9 on-page
  unchecked) · buildcheck PASS · validate DATA OK · npm test ALL PASS. ~33 WebSearch calls so far.

## 2026-10-03 (W6 · PINS) · batch 2 — Apple Maps pins, tier-2 across areas + 1 closure
- **Pins (29, `geo/_geoout_w6b.json` · 28 high, 1 med):** CC — Sonny's Famous Steaks, K'Far, Bud & Marilyn's, Little Nonna's (**med** —
  Apple's coordinate is identical to sibling Bud & Marilyn's at the same 1234 Locust St address, i.e. an address-level point), EMei,
  Barbuzzo, Morimoto · FISH — Del Rossi's, Murph's Bar, Café La Maude, Standard Tap, Pizza Shackamaxon, Tulip Pasta & Wine Bar · SPH —
  River Twice, Roxanne, Barcelona Wine Bar (East Passyunk), Café y Chocolate, Heavy Metal Sausage Co., Mighty Bread Co., Tesiny, Bob &
  Barbara's · UCW — Renata's Kitchen, Booker's, Cleo Bagels · NE — Giannone's Steaks, Northeast Sandwich Co., Café Carmela · NPH — Sid
  Booker's Shrimp Corner · NW — Uncle Bobbie's.
- **CLOSED (flagged, kept):** Manakeesh Cafe Bakery & Grill (4420 Walnut St) — West Philly Local: permanently closed after 15 years, last
  day 17 Feb 2026 (rent); cloud-kitchen only while it seeks a new site; Apple listing "permanently closed". It was never on the map.
  Helper `_phi_close.py` (renames the research record "— CLOSED", writes `geo/_geoout_w6s.json`).
- **Status leads (not changed — no press confirmation yet):** Buna Cafe (5121 Baltimore Ave) — Apple listing shows "permanently closed".
- **Address mismatches (not pinned):** Goldie — Apple's coordinate listing is 1526 Sansom St (record 1911 Sansom); Holmesburg Bakery —
  Apple says 7935 Frankford Ave (record 7933; no coordinate surfaced anyway); Bell's Market — 8336 vs 8330 Bustleton.
- **Yield note:** suburban (MAIN/SJ/DAY) and Germantown/Chestnut Hill listings come back almost entirely as bare `place-id=` URLs
  (≈1 coordinate per 6 names) vs ≈1 per 2 in Center City / South Philly / Fishtown.
- **Build:** 231 → 260 on map (151 sights + 109 food). 4 gates PASS (statuscheck CONSISTENT, 8 closed flagged, 9 on-page unchecked);
  validate DATA OK; npm test ALL PASS. ~70 WebSearch calls so far.

## 2026-10-03 (W6 · PINS) · batch 3 — sights via Wikipedia coords, closure pass on every on-page place
- **Sight pins (14, `geo/_geoout_w6c.json`, Wikipedia infobox coordinates via WebSearch `allowed_domains:["en.wikipedia.org"]`, one or
  two per query):** Boathouse Row, The Met Philadelphia, National Shrine of St. John Neumann, Germantown White House (cross-checked: 30 m
  from the Apple pin of Uncle Bobbie's across the street at 5445 Germantown Ave), Red Bank Battlefield Park, Grey Towers Castle, Barclay
  Farmstead (Barclay Farm House article), Malcolm X Park, National Liberty Museum, Washington Avenue Pier (Washington Avenue Immigration
  Station = Pier 53 article), Barnes Arboretum, Camden Children's Garden — all high; Old City Hall (**med** — point ~100 m south of the
  Chestnut St frontage at 1″ precision) and Mummers Museum (**med** — Wikimedia Commons photo geotag at 2nd & Washington, not an infobox
  coordinate). + 1 Apple food pin: CJ & D's Trenton Tomato Pie (inside Cartesian Brewing, 1326 E Passyunk Ave).
- **Rejected sight coordinates:** Wyck (Wikipedia point 40.0217 is ~2 km south of 6026 Germantown Ave — Nile Cafe at 6008 pins at
  40.0395 — so the infobox value is wrong/low-precision; left UNVERIFIED); Schuylkill Center (only the Upper Roxborough Historic District
  centroid surfaced); Liberty Lands, Wiggins Park (search summary gave a coordinate without a citable infobox); Fillmore (only the former
  TLA venue's coordinate); Bishop White House, Taller Puertorriqueño, Clay Studio (no coordinates surfaced).
- **Closure check — every on-page place now has a sourced status (statuscheck: 0 unchecked, was 9):** Vedge (own site, Michelin 2025),
  Talula's Table (Tock bookings live + 6abc), Steve's Prince of Steaks (Time Out listing/hours), Barclay Prime and Vernick Fish (Apple
  listings active + OpenTable / Four Seasons press; no closure in a 2026 news search), Walnut Street Cafe (Apple listing active; no
  closure in a 2026 University City closures search), Sly Fox (Pottstown tasting room operating), Hopewell Furnace (NPS hours Wed–Sun),
  Max's Steaks (operating through the Jan 2026 sale — Inquirer).
- **CLOSED (flagged, kept):** Todd House — interior closed to the public since at least July 2022 (Wikipedia "Dolley Todd House"; NPS
  page lists no tours); pin kept, name carries "— CLOSED" (same treatment as Declaration House). The Olde Bar — restaurant closed 9 Nov
  2024, events venue closed by 9 Aug 2025 (Inquirer 2024-11-11, 2025-06-17; PhillyVoice); never on the map.
- **Apple retries:** re-phrasing bare-`place-id` tier-1 listings (Dim Sum Garden, Forsythia, Hardena, Pho 75) with cuisine/neighbourhood/ZIP
  never surfaced a coordinate variant here — unlike Miami — so the remaining budget went to new names, sights and status.
- **Build:** 260 → 275 on map (165 sights + 110 food). sourcecheck PASS 518 · geocheck PASS · statuscheck CONSISTENT (10 closed, 0
  unchecked) · buildcheck PASS · validate DATA OK · npm test ALL PASS. ~120 WebSearch calls so far.

## 2026-10-03 (W6 · PINS) · batch 4 + wave close
- **Pin +1:** Irwin's (Apple listing at 800 Mifflin St = the Bok Building's other street address; record 1901 S 9th St, 8th floor) — high,
  noted. Final Apple probes of DAY (Phoenixville, West Chester, Kennett Square, New Hope), NW (Attic, Young American, White Yak) and the
  remaining city sights (Clay Studio, Fillmore, Taller Puertorriqueño) returned only bare `place-id` listings.
- **Address leads logged in RESUME (not changed):** Portabello's (Apple 108 E State St vs record 108-112 W State St), White Yak (Apple
  6118 Ridge Ave), American Sardine Bar (1800 vs 1801 Federal St).
- **W6 totals:** 182 → **276 on map** (+94: 80 food, 14 sights) · on-page confidence 238 high / 38 med · 3 closures flagged (Manakeesh,
  The Olde Bar, Todd House) · statuscheck 0 unchecked (was 9) · ≈135 WebSearch calls (≈105 maps.apple.com, ≈18 en.wikipedia.org, ≈12
  closure/status news).
- **Gates (final build):** sourcecheck PASS 518 · geocheck PASS · statuscheck CONSISTENT · buildcheck PASS · validate DATA OK · npm test
  ALL PASS. density.py: every area OK (unchanged). Hub card, CITIES.md row, AGENT-PROMPTS run-log row, RESUME (State W6 + W7 plan) updated.

## 2026-10-03 (W7 · PINS ONLY, session_01847XyVQRMAQiVAHDWpaEmS) · batch A
- **Channel switch:** Apple re-phrasings were exhausted in W6, so W7 uses the **aggregator technique**: one place per WebSearch,
  `"<Name> <street address> Philadelphia GPS coordinates"` with `allowed_domains` restaurantguru / wanderlog / sirved / restaurantji / menupix
  (listings carry the place's lat/lng; ~65% hit rate on tier-1s). Waze (`place.ChIJ…`) used where it surfaced (Dim Sum Garden, Amma's → high).
  Every coordinate was checked against the record's street number/block (cross-street sanity) before it was written; aggregator pins are `med`.
  Writer: `_pinw.py philadelphia-pa <tag>` (refuses unknown/pinned names, out-of-bbox points; never flips a CLOSED status).
- **+34 pins** (`geo/_geoout_w7a.json`): Dim Sum Garden, Amma's, Monk's Cafe, Forsythia, Bolo, Nan Zhou, High Street Philly, Tequilas,
  Han Dynasty (Old City — listings disagree 123 vs 110 Chestnut; both on the same block, med), Iannelli's, John's Water Ice, Hardena, Termini
  Bros., Isgro, Mike's BBQ, Antonio's Deli, Blue Corn, Bomb Bomb Bar, Farina Di Vita, Southwark, Machine Shop, Sulimay's, Czerw's, Johnny
  Brenda's, Emmett, R&D, Cantina La Martina, Dahlak, Kilimandjaro, The Dining Car, Georgian Bread, Gaeta's, Freddy & Tony's, Tierra Colombiana.
- **No coordinate surfaced:** The Franklin Fountain, Vietnam Restaurant, La Jefa, Ogawa, Sarcone's Bakery/Deli, Di Bruno (9th St), Pop's,
  Pho 75, Philadelphia Brewing Co, Amy's Pastelillos, Amá, Emilia, Denise's Delicacies. Status: none of these listings showed a closure marker.
- **Build:** 276 → **310 on map**. sourcecheck PASS 518 · geocheck PASS · statuscheck CONSISTENT · buildcheck PASS · validate DATA OK · npm test ALL PASS.
