#!/usr/bin/env python3
# Build cities/youngstown.html from the Cleveland engine (cleveland.html) with
# Youngstown data. Reproducible: edit DATA + counts here and re-run.
import re, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # repo root (this file lives in tools/)
SRC = os.path.join(ROOT, "cleveland.html")
OUT = os.path.join(ROOT, "cities", "youngstown.html")
h = open(SRC, encoding="utf-8").read()

DATA = r'''const S = {
  AO:{k:"ATLAS OBSCURA",t:"Atlas Obscura — Ohio / Youngstown oddities",u:"https://www.atlasobscura.com/things-to-do/ohio",l:"Atlas Obscura"},
  T2N:{k:"TRAVEL2NEXT",t:"20 Things To Do in Youngstown, Ohio",u:"https://travel2next.com/things-to-do-youngstown-ohio/",l:"Travel2Next"},
  EXM:{k:"EXPLORE MAHONING",t:"Explore Mahoning — attractions",u:"https://exploremahoning.com/visit/attractions/",l:"Explore Mahoning (Mahoning County CVB)"},
  MEL:{k:"MELNICK MUSEUM",t:"The Rose Melnick Medical Museum (YSU)",u:"https://melnick.ysu.edu",l:"Youngstown State University"},
  WBP:{k:"WARD BEECHER",t:"Ward Beecher Planetarium (YSU)",u:"https://www.wbplanetarium.org",l:"Youngstown State University"},
  MVHS:{k:"MAHONING HISTORY",t:"Mahoning Valley Historical Society",u:"https://mahoninghistory.org",l:"Mahoning Valley Historical Society"},
  MCMP:{k:"MILL CREEK METROPARKS",t:"Mill Creek MetroParks",u:"https://millcreekmetroparks.org",l:"Mill Creek MetroParks"},
  OHIO:{k:"OHIO TOURISM",t:"Ohio — Find It Here",u:"https://ohio.org",l:"Ohio tourism"},
  BJ:{k:"BUSINESS JOURNAL",t:"The Business Journal (Mahoning Valley)",u:"https://businessjournaldaily.com",l:"The Business Journal"},
  OHMAG:{k:"OHIO MAGAZINE",t:"Ohio Magazine",u:"https://www.ohiomagazine.com",l:"Ohio Magazine"},
  WFMJ:{k:"WFMJ 21",t:"WFMJ 21 (NBC) — Youngstown newsroom",u:"https://www.wfmj.com",l:"WFMJ 21"},
  WKBN:{k:"WKBN 27",t:"WKBN 27 (CBS) — Youngstown newsroom",u:"https://www.wkbn.com",l:"WKBN 27"},
  MM:{k:"MAHONING MATTERS",t:"Mahoning Matters (nonprofit newsroom)",u:"https://www.mahoningmatters.com",l:"Mahoning Matters"},
  TRIBCH:{k:"TRIBUNE CHRONICLE",t:"Tribune Chronicle (Warren / Trumbull daily)",u:"https://www.tribtoday.com",l:"Tribune Chronicle"},
  REPLAY:{k:"REPLAY MAG",t:"RePlay Magazine — Berk's Past Times Arcade Opens in Girard",u:"https://www.replaymag.com/berks-past-times-arcade-opens-in-girard-ohio/",l:"RePlay Magazine"},
  TA:{k:"TRIPADVISOR",t:"Tripadvisor — Youngstown / Mahoning Valley attractions",u:"https://www.tripadvisor.com/Attractions-g50376-Activities-Youngstown_Ohio.html",l:"Tripadvisor"},
  TRULY:{k:"TRULY TRUMBULL",t:"Truly Trumbull — Trumbull County CVB",u:"https://www.exploretrumbullcounty.com/things-to-do/",l:"Truly Trumbull (Trumbull County CVB)"},
  OCW:{k:"OLD CARS WEEKLY",t:"Old Cars Weekly — TP Tools opens car museum in Canfield",u:"https://www.oldcarsweekly.com/features/tp-tools-car-museum",l:"Old Cars Weekly"},
  NHS:{k:"NILES HISTORY",t:"Niles Historical Society — Ward-Thomas House Museum",u:"https://nileshistoricalsociety.org/tours.htm",l:"Niles Historical Society"},
  ADD:{k:"ADDED",t:"Well-known local landmarks the oddity lists skip because they are not hidden",u:"",l:"My addition — verify hours before visiting"}
};

const AREAS = [
  {id:"WK", n:"Wick Avenue & YSU",            c:"var(--c-dt)"},
  {id:"MC", n:"Mill Creek Park & West Side",  c:"var(--c-uc)"},
  {id:"DT", n:"Downtown",                     c:"var(--c-ws)"},
  {id:"DY", n:"Mahoning Valley Day Trips",    c:"var(--c-sub)"}
];

const P = [
/* == WICK AVENUE & YSU == */
{t:1,a:"WK",n:"Butler Institute of American Art",ad:"524 Wick Ave",la:41.1065,ln:-80.6478,
 w:"Opened in 1919 as the first museum in the country built solely for American art, with more than 20,000 works from Winslow Homer to the present. Free, and the anchor of the Wick Avenue museum row — the piece of Youngstown that draws visitors from out of state.",
 k:"Free. Open Tuesday–Sunday. Approximate map pin.",s:[["T2N",""],["OHIO",""],["EXM",""]]},
{t:1,a:"WK",n:"Youngstown Historical Center of Industry and Labor",ad:"151 W Wood St",la:41.1028,ln:-80.6488,
 w:"The Steel Museum — an Ohio History Connection site that tells the rise and collapse of the mills that built Youngstown, straight and unsentimental. The essential stop for understanding what this city was and what happened to it.",
 k:"Admission charged. Check open days; often Wed–Sat.",s:[["OHIO",""],["T2N",""]]},
{t:2,a:"WK",n:"Rose Melnick Medical Museum",ad:"Cushwa Hall, Youngstown State University",la:41.1045,ln:-80.6455,
 w:"YSU's history-of-medicine museum: office recreations, nursing and x-ray exhibits, and a bright yellow 1952 Emerson iron lung as its centrepiece. Founded 1985; now in Cushwa Hall. An Atlas Obscura listing.",
 k:"Free. Campus building — check hours; parking is easier on weekends.",s:[["AO",""],["MEL",""]]},
{t:2,a:"WK",n:"Ward Beecher Planetarium",ad:"Ward Beecher Science Hall, 100 Lincoln Ave",la:41.1049,ln:-80.6472,
 w:"A well-regarded university planetarium that has run free public shows since 1967 — typically Friday and Saturday evenings and Saturday afternoons, September through May.",
 k:"Free, no reservations. Doors 30 min early; latecomers cannot enter once dark. Shows Sept–May.",warn:1,s:[["EXM",""],["WBP",""]]},
{t:2,a:"WK",n:"Arms Family Museum",ad:"648 Wick Ave",la:41.1083,ln:-80.6472,
 w:"A 1905 Arts-and-Crafts mansion run by the Mahoning Valley Historical Society, furnished as it was and used to tell the story of the Valley's industrial families.",
 k:"Admission charged. Closed Mondays; check seasonal hours.",s:[["MVHS",""]]},
{t:2,a:"WK",n:"Stambaugh Auditorium",ad:"1000 Fifth Ave",la:41.1112,ln:-80.6543,
 w:"A 1926 neoclassical concert hall with a marble-columned front, one of the finest rooms in the region and still a working venue, just north of Wick Park.",
 k:"Ticketed events; the exterior is worth a look any time.",s:[["T2N",""]]},
{t:3,a:"WK",n:"McDonough Museum of Art",ad:"525 Wick Ave",la:41.1069,ln:-80.6469,
 w:"Youngstown State's contemporary art museum, directly across Wick Avenue from the Butler. Rotating shows of new and student work. Free.",
 k:"Free. Often closed between exhibitions — check the current show.",s:[["ADD",""]]},
{t:3,a:"WK",n:"Clarence R. Smith Mineral Museum",ad:"Moser Hall, Youngstown State University",la:41.1040,ln:-80.6440,
 w:"A quiet hidden gem for rock hounds inside YSU — fluorescent minerals, fossils and crystals, free to walk through. Small, specific, and exactly the kind of thing this guide is for.",
 k:"Free. Campus building; limited hours — check before going.",s:[["EXM",""]]},
{t:3,a:"WK",n:"Wick Park",ad:"Fifth Ave & Park Ave, North Side",la:41.1128,ln:-80.6498,
 w:"A 34-acre 19th-century park ringed by the North Side's grand old mansions. A stroll and some architecture, not a ticket.",
 k:"Free, daylight hours. Nicer by day.",s:[["ADD",""]]},
/* == MILL CREEK PARK & WEST SIDE == */
{t:1,a:"MC",n:"Lanterman's Mill",ad:"1001 Canfield Rd, Mill Creek Park",la:41.0731,ln:-80.6809,
 w:"An 1845–46 grist mill, restored and still grinding corn, wheat and buckwheat with the creek's rushing water, beside a waterfall. The picture-book heart of Mill Creek Park.",
 k:"Seasonal — roughly May through October. Small admission. Approximate pin.",s:[["MCMP",""],["T2N",""],["EXM",""]]},
{t:1,a:"MC",n:"Fellows Riverside Gardens",ad:"123 McKinley Ave, Mill Creek Park",la:41.0921,ln:-80.6816,
 w:"Free formal gardens overlooking Lake Glacier, with the Davis visitor center, a cafe and long seasonal colour. Part of Mill Creek MetroParks and one of the loveliest free things in the Valley.",
 k:"Free. Gardens open daily; Davis Center has its own hours.",s:[["MCMP",""],["EXM",""]]},
{t:2,a:"MC",n:"Mill Creek Suspension Bridge (the Cinderella Bridge)",ad:"Mill Creek Park",la:41.0795,ln:-80.6795,
 w:"The slender 86-foot pedestrian suspension span locals call the Cinderella Bridge, recently restored to its arches-and-spires opulence. The park's signature photo, and an Atlas Obscura listing.",
 k:"Free, always open. Approximate pin — it sits on a park trail.",s:[["AO",""],["MCMP",""]]},
{t:2,a:"MC",n:"Lily Pond",ad:"Mill Creek Park",la:41.0760,ln:-80.6830,
 w:"A restored pond circled by the quarter-mile Lily Pond Circle Trail — a short, flat, genuinely peaceful loop, revived from years of neglect with bioswales and permeable paving.",
 k:"Free. Easy quarter-mile loop; good with kids. Approximate pin.",s:[["MCMP",""]]},
{t:3,a:"MC",n:"Lake Newport & Newport Boathouse",ad:"Mill Creek Park",la:41.0680,ln:-80.6720,
 w:"At 60 acres the largest of the park's three lakes. Kayaks and pedal boats rent from the Newport Boathouse in season — the easiest way to get out on the water in the city.",
 k:"Boat rentals seasonal; the drive around the lakes is open year-round.",s:[["MCMP",""]]},
{t:3,a:"MC",n:"Joanne Beeghly Rose Garden",ad:"Fellows Riverside Gardens, Mill Creek Park",la:41.0925,ln:-80.6810,
 w:"A formal rose garden within Fellows Riverside Gardens, growing many classes of roses — at its best in June and July.",
 k:"Free, within the gardens. Peak bloom early summer.",s:[["MCMP",""]]},
{t:3,a:"MC",n:"Ford Nature Center",ad:"840 Old Furnace Rd, Mill Creek Park",la:41.0705,ln:-80.6890,
 w:"A stone-house nature center and trailhead into the wooded interior of Mill Creek Park, with exhibits and easy walks.",
 k:"Free. Check hours; trails open dawn to dusk.",s:[["MCMP",""]]},
{t:3,a:"MC",n:"Pioneer Pavilion",ad:"Mill Creek Park",la:41.0805,ln:-80.6820,
 w:"An 1821 stone woolen-mill building, one of the oldest structures around, remodeled in 1893 and now a rentable pavilion for reunions and receptions.",
 k:"Free to look; rentable for events. Combine with Lanterman's Mill.",s:[["MCMP",""]]},
{t:3,a:"MC",n:"Mill Creek Golf Course",ad:"1 W Golf Dr, Mill Creek Park",la:41.0600,ln:-80.6650,
 w:"Two 18-hole, par-70 championship courses that opened to the public in 1928, laid through the park's woods — a genuine draw for golfers.",
 k:"Tee times through the MetroParks. Seasonal. Approximate pin.",s:[["MCMP",""]]},
/* == DOWNTOWN == */
{t:1,a:"DT",n:"DeYor Performing Arts Center (Powers Auditorium)",ad:"260 W Federal St",la:41.0982,ln:-80.6510,
 w:"Home of the Youngstown Symphony, behind a 1931 movie-palace facade on West Federal Street. The Valley's main stage for orchestra, ballet and touring shows.",
 k:"Ticketed performances. Lobby worth a peek on show nights.",s:[["ADD",""]]},
{t:2,a:"DT",n:"Tyler History Center",ad:"325 W Federal St",la:41.0987,ln:-80.6520,
 w:"The Historical Society's downtown museum of Mahoning Valley history, in a restored former department store on West Federal Street.",
 k:"Admission charged. Check open days before going.",s:[["MVHS",""]]},
{t:2,a:"DT",n:"Roger & Gloria Jones Children's Center for Science & Technology",ad:"Downtown Youngstown",la:41.1010,ln:-80.6490,
 w:"A hands-on STEM center for kids that opened in 2011, with interactive science and technology exhibits — the family stop downtown.",
 k:"Admission charged; best for children. Check hours. Approximate pin.",s:[["EXM",""]]},
{t:2,a:"DT",n:"The Youngstown Playhouse",ad:"600 Playhouse Ln",la:41.0771,ln:-80.6725,
 w:"Among the oldest continuously operating community theaters in the United States, staging affordable productions on the South Side.",
 k:"Tickets are cheap; check the season's schedule.",s:[["T2N",""]]},
{t:3,a:"DT",n:"Covelli Centre",ad:"229 E Front St",la:41.0956,ln:-80.6468,
 w:"The downtown riverfront arena — Phantoms hockey, concerts and events, and the anchor of the eastern edge of downtown.",
 k:"Event venue; nothing to see when dark. Check the calendar.",s:[["ADD",""]]},
{t:3,a:"DT",n:"Downtown Youngstown murals",ad:"around W Federal St & Central Square",la:41.0985,ln:-80.6500,
 w:"A growing set of large downtown murals, several honoured statewide, that have brightened the old commercial core. Walkable in an afternoon between Central Square and the arts district.",
 k:"Free, outdoors, always up. Ask at a downtown shop for the current mural map. Approximate pin.",s:[["BJ",""]]},
{t:2,a:"DT",n:"Mahoning County Courthouse",ad:"120 Market St, Youngstown, OH",la:41.0975,ln:-80.6495,
 w:"A 1910 Renaissance Revival landmark by Charles F. Owsley whose interior opens into a roughly 100-foot rotunda crowned by a glazed art-glass dome, ringed by marble columns, mahogany and courtroom murals.",
 k:"Working courthouse; the interior is best seen on the periodic free public tours. Security screening applies. Approximate pin.",s:[["MM",""],["BJ",""],["WFMJ",""]]},
/* == MAHONING VALLEY DAY TRIPS == */
{t:1,a:"DY",n:"Dave Grohl Alley",ad:"125 David Grohl Alley, Warren, OH",la:41.2378,ln:-80.8183,
 w:"A brick alley in downtown Warren painted wall-to-wall in tribute to Warren-born Nirvana/Foo Fighters drummer Dave Grohl — murals, a metal figure at a drum kit, and a pair of 900-pound drumsticks billed as the world's largest.",
 k:"Free, outdoors. In Warren, about 20 minutes north; pair with a Modern Methods beer next door.",s:[["OHMAG",""],["BJ",""]]},
{t:1,a:"DY",n:"National McKinley Birthplace Memorial & Museum",ad:"40 N Main St, Niles, OH",la:41.1835,ln:-80.7590,
 w:"A columned memorial and museum to President William McKinley in his birthplace of Niles, a short drive north of Youngstown. Free, and grander than you expect for a small city.",
 k:"Free. In Niles, about 15 minutes away. Check museum hours.",s:[["ADD",""]]},
{t:2,a:"DY",n:"Canfield Fairgrounds",ad:"7265 Columbiana-Canfield Rd, Canfield, OH",la:41.0206,ln:-80.7595,
 w:"Home of the Canfield Fair, Ohio's largest county fair, over Labor Day week. The grounds are quiet off-season.",
 k:"The fair is late Aug–Labor Day. Otherwise little to see. Seasonal.",warn:1,s:[["T2N",""]]},
{t:2,a:"DY",n:"Idora Park Experience",ad:"4450 S Turner Rd, Canfield",la:41.0709,ln:-80.7010,
 w:"The beloved Idora Park amusement park closed in 1984; volunteers now keep a museum of its memorabilia. A piece of vanished Youngstown, opened only on select days.",
 k:"Limited hours — call or check ahead. The park itself is long gone. Approximate pin.",warn:1,s:[["AO",""]]},
{t:1,a:"DY",n:"Past Times Arcade",ad:"419 N State St, Girard, OH",la:41.1565,ln:-80.7020,
 w:"A retro pinball-and-arcade museum in a former Girard supermarket holding roughly 600 largely playable pinball machines plus 200+ classic arcade games from the 1930s on — one of the largest such collections in the country, assembled by Pinball Expo founder Rob Berk.",
 k:"Opened 2023. Thu–Fri from 4pm, Sat–Sun from 11am; ~$20 adults / $10 ages 6–16 for unlimited play; allow 3+ hours. ~10 min north, off I-80. Approximate pin.",s:[["WFMJ",""],["BJ",""],["MM",""],["TRIBCH",""],["REPLAY",""],["TA",""],["EXM",""]]},
{t:1,a:"DY",n:"National Packard Museum",ad:"1899 Mahoning Ave NW, Warren, OH",la:41.2470,ln:-80.8330,
 w:"A 23,000-sq-ft museum on the site where the Packard automobile was born in 1899 — rotating original and restored Packards, classic motorcycles, and the Packard family and company archives.",
 k:"Tue–Sat 12–5, Sun 1–5; closed Mondays and holidays. In Warren, ~20 min north. Approximate pin.",s:[["OHIO",""],["TA",""],["TRULY",""]]},
{t:1,a:"DY",n:"Robins Theatre",ad:"160 E Market St, Warren, OH",la:41.2372,ln:-80.8165,
 w:"A meticulously restored 1923 Art Deco/Mediterranean theatre by C. Howard Crane — a 1,400-seat house that reopened in 2020, ninety-seven years to the day after its debut, and now books national touring music and comedy.",
 k:"Ticketed events; check the schedule. In downtown Warren, ~20 min north. Approximate pin.",s:[["WKBN",""],["TRULY",""],["TA",""]]},
{t:2,a:"DY",n:"Noah's Lost Ark Exotic Animal Sanctuary",ad:"8424 Bedell Rd, Berlin Center, OH",la:41.0300,ln:-80.9500,
 w:"A nonprofit no-kill exotic-animal sanctuary — lions, tigers, bears and 125+ rescued animals — one of the few facilities both state- and federally licensed to give guided public tours.",
 k:"Seasonal, roughly May 15–Oct 31; petting zoo, gift shop, free noon tortoise feeding. ~30 min west. Approximate pin.",warn:1,s:[["EXM",""],["TA",""]]},
{t:2,a:"DY",n:"TP Tools Auto Collection Museum",ad:"7075 State Route 446, Canfield, OH",la:41.0180,ln:-80.7020,
 w:"A free classic-car museum inside the TP Tools complex — 50+ restored autos from 1917 on, staged amid immersive period sets: a 1950s diner, soda bar, country store and service garage.",
 k:"Free; typically Saturdays 10–3, hours limited — confirm ahead. ~20 min south. Approximate pin.",warn:1,s:[["OCW",""],["EXM",""]]},
{t:2,a:"DY",n:"Mill Creek MetroParks Farm",ad:"7574 Columbiana-Canfield Rd, Canfield, OH",la:41.0020,ln:-80.7560,
 w:"A 402-acre working farm run by Mill Creek MetroParks — animal barns, the interactive AgVenture Barn, a free fall corn maze, disc golf and a natural playground — and the trailhead for the 11-mile MetroParks Bikeway.",
 k:"Seasonal, roughly April–October; free admission. Pumpkin harvest and Bug Day in season. ~20 min south. Approximate pin.",warn:1,s:[["OHIO",""],["MCMP",""],["EXM",""]]},
{t:2,a:"DY",n:"Sports World Family Fun Center",ad:"8249 South Ave, Boardman, OH",la:41.0000,ln:-80.6560,
 w:"A long-running outdoor family fun center in Boardman — go-kart tracks, 18-hole adventure golf, batting cages and a redemption arcade — the valley's go-to for arcade-plus-outdoor play.",
 k:"Seasonal outdoor attractions; pay-per-ride or packages. ~15 min south. Approximate pin.",warn:1,s:[["EXM",""],["TA",""]]},
{t:3,a:"DY",n:"Hollywood Gaming at Mahoning Valley Race Course",ad:"655 N Canfield-Niles Rd, Austintown, OH",la:41.1120,ln:-80.7500,
 w:"A racino (2014) pairing a one-mile thoroughbred track with 1,100+ video lottery terminals, dining and events — the region's live horse-racing venue.",
 k:"Gaming areas 21+; live thoroughbred racing roughly Oct–April, free to watch. ~15 min northwest. Approximate pin.",warn:1,s:[["WKBN",""],["EXM",""],["TA",""]]},
{t:3,a:"DY",n:"Ernie Hall Aviation Museum",ad:"4033 North River Rd NE, Warren, OH",la:41.2820,ln:-80.7800,
 w:"A small but rich aviation museum honouring pioneer Ernest C. Hall — his 1947 Piper PA-12, personal letters between Hall and Orville Wright, and a scrap of fabric from the Red Baron's Fokker triplane.",
 k:"Nonprofit, limited hours; hosts Wings-n-Wheels fly-ins. Confirm hours first. ~25 min north. Approximate pin.",warn:1,s:[["OHIO",""],["TA",""]]},
{t:3,a:"DY",n:"Ward-Thomas House Museum",ad:"503 Brown St, Niles, OH",la:41.1830,ln:-80.7610,
 w:"An 1862 fourteen-room Victorian mansion on the National Register, home to the Niles Historical Society's 5,000+ artefacts of local industrial heritage and reproductions of several First Ladies' inaugural gowns.",
 k:"Very limited hours — typically the first Sunday of the month, 2–5, or by appointment. ~15 min north. Approximate pin.",warn:1,s:[["NHS",""],["TRULY",""]]},
{t:3,a:"DY",n:"Newton Falls Covered Bridge",ad:"Covered Bridge, Newton Falls, OH",la:41.1880,ln:-80.9780,
 w:"An 1831 covered bridge over the Mahoning River — the oldest covered bridge still in service in Ohio, with a rare attached covered pedestrian walkway.",
 k:"Free, open to traffic and on foot year-round. ~25 min northwest. Approximate pin.",s:[["TRULY",""]]}
];

const FS = {
  HTP:{k:"HOMETOWN PLATE",t:"Best Restaurants in Youngstown",u:"https://hometownplate.com/list/best-restaurants-in-youngstown-ohio/",l:"HometownPlate"},
  EXM:{k:"EXPLORE MAHONING",t:"Explore Mahoning — food & drink",u:"https://exploremahoning.com",l:"Explore Mahoning"},
  EXM_SLICE:{k:"EXPLORE MAHONING",t:"Where to Grab a Slice in Y-town",u:"https://exploremahoning.com/where-to-grab-a-slice-in-y-town/",l:"Explore Mahoning"},
  GO_BH:{k:"GASTRO OBSCURA",t:"Brier Hill Pizza",u:"https://www.atlasobscura.com/foods/brier-hill-pizza",l:"Gastro Obscura"},
  WIKI_BH:{k:"WIKIPEDIA",t:"Brier Hill-style pizza",u:"https://en.wikipedia.org/wiki/Brier_Hill-style_pizza",l:"Wikipedia"},
  HANDEL:{k:"HANDEL'S HISTORY",t:"Handel's Homemade Ice Cream — history",u:"https://handelsicecream.com/history/",l:"Handel's official history"},
  GD:{k:"BUSINESS JOURNAL",t:"Golden Dawn to reopen",u:"https://businessjournaldaily.com",l:"The Business Journal"},
  YL:{k:"YOUNGSTOWN LIVE",t:"Youngstown Live — The Amish Market",u:"https://youngstownlive.com/venue/the-amish-market/",l:"Youngstown Live (Mahoning County CVB)"},
  YF:{k:"YOUNGSTOWN FLEA",t:"The Youngstown Flea — Market for Makers",u:"http://youngstownflea.com/about/",l:"The Youngstown Flea"},
  ROG:{k:"ROGERS MARKET",t:"Rogers Community Auction & Flea Market",u:"https://rogersohio.com/",l:"Rogers Flea Market · Columbiana County"},
  WKBN:{k:"WKBN 27",t:"WKBN — Mahoning Valley fall farm & events guide",u:"https://www.wkbn.com/community/halloween-and-fall-events/",l:"WKBN 27 (local news)"},
  NEOFF:{k:"NE OHIO FAMILY FUN",t:"Northeast Ohio Family Fun — farms & pumpkin patches",u:"https://northeastohiofamilyfun.com/pumpkin-patches/",l:"Northeast Ohio Family Fun"},
  BJ:{k:"BUSINESS JOURNAL",t:"The Business Journal — food & drink",u:"https://businessjournaldaily.com",l:"The Business Journal"},
  VIND:{k:"THE VINDICATOR",t:"History of brewing beer in Youngstown",u:"https://www.vindy.com",l:"The Vindicator"},
  OHMAG:{k:"OHIO MAGAZINE",t:"Ohio Magazine",u:"https://www.ohiomagazine.com",l:"Ohio Magazine"},
  FADD:{k:"ADDED",t:"Local staples added from general knowledge",u:"",l:"My addition — verify before visiting"}
};

const CUISINES = [
  {id:"PZ",  n:"Brier Hill & Pizza"},
  {id:"IT",  n:"Italian"},
  {id:"DELI",n:"Deli & Sandwiches"},
  {id:"CAF", n:"Cafe & Coffee"},
  {id:"DES", n:"Dessert"},
  {id:"DR",  n:"Drinks & Breweries"},
  {id:"AM",  n:"American"},
  {id:"MKT", n:"Markets"},
  {id:"FARM",n:"Farms & U-Pick"}
];

const F = [
{t:1,a:"DT",cz:["IT","PZ"],n:"Cassese's MVR",ad:"410 N Walnut St",la:41.1039,ln:-80.6519,
 w:"Open since 1927. The dish is a Brier Hill 'Smoky Hollow' pizza — tomato, bell peppers and grated romano — eaten beside the bocce courts out back. As Youngstown as it gets.",
 k:"Italian institution; bocce in season. Confirm hours.",s:[["HTP",""]]},
{t:1,a:"DT",cz:["IT"],n:"Yosteria",ad:"downtown Youngstown",la:41.0975,ln:-80.6510,
 w:"A downtown Italian spot that regularly tops the city's restaurant lists, praised for its ricotta board and made-to-order pastas.",
 k:"Popular; reservations help on weekends. Approximate pin.",s:[["HTP",""],["EXM",""]]},
{t:1,a:"WK",cz:["DELI"],n:"Kravitz Delicatessen",ad:"3135 Belmont Ave, Liberty",la:41.1370,ln:-80.6620,
 w:"A classic Jewish delicatessen north of downtown, widely called the best corned beef in the Valley — plus rye, latkes and the rest of the deli canon.",
 k:"Lunch counter; go for the corned beef. Approximate pin.",s:[["HTP",""]]},
{t:1,a:"MC",cz:["DES"],n:"Handel's Homemade Ice Cream",ad:"7485 South Ave, Boardman",la:41.0642,ln:-80.6543,
 w:"Founded here in the summer of 1945 by Alice Handel at her husband's gas station; the original South Side stand still scoops. Now 175+ stores nationwide, with its HQ in Canfield.",
 k:"Cash-friendly, seasonal lines. The original location marks Handel's roots.",s:[["HANDEL",""]]},
{t:2,a:"WK",cz:["IT"],n:"Golden Dawn",ad:"1245 Logan Ave",la:41.1120,ln:-80.6558,
 w:"A 1932 Brier Hill Italian-American landmark on Logan Avenue. It closed in 2017 and has since reopened — running again, tied to the neighbourhood's pizza lore.",
 k:"Reopened after 2017; confirm current hours before going.",s:[["GD",""]]},
{t:2,a:"MC",cz:["PZ"],n:"Wedgewood Pizza",ad:"Austintown, OH",la:41.1006,ln:-80.7360,
 w:"A local pizzeria since 1967 that makes the classic Brier Hill pie — tomato, bell peppers and grated romano, with little or no mozzarella.",
 k:"In Austintown, west of the city. Ask for the Brier Hill pie by name.",s:[["HTP",""],["WIKI_BH",""]]},
{t:2,a:"DT",cz:["PZ"],n:"Avalon Downtown Pizzeria",ad:"Downtown Youngstown",la:41.0976,ln:-80.6503,
 w:"A brick-walled downtown spot serving Brier Hill pizza alongside inventions like a Pesto Hot Honey pie.",
 k:"Downtown; good lunch stop between museums.",s:[["HTP",""]]},
{t:2,a:"DT",cz:["AM"],n:"The Federal",ad:"101 W Federal St",la:41.0983,ln:-80.6497,
 w:"A bar and gathering spot on Federal Plaza with a patio and frequent live music — the social heart of downtown after dark, with a solid American menu.",
 k:"Bar/venue; check the music calendar. Approximate pin.",s:[["EXM",""]]},
{t:2,a:"DT",cz:["CAF","DES"],n:"The Mocha House",ad:"downtown Youngstown",la:41.0985,ln:-80.6520,
 w:"A long-running cafe known for towering cakes, pastries and coffee, with a comfortable downtown room for a slower stop.",
 k:"Cafe hours; save room for cake. Approximate pin.",s:[["HTP",""]]},
{t:2,a:"DT",cz:["DR"],n:"Noble Creature Wild Ales & Lagers",ad:"101 E Boardman St",la:41.0968,ln:-80.6470,
 w:"A downtown microbrewery in a historic church, all beer made onsite, specialising in wild ales and lagers — a distinctive taproom.",
 k:"Taproom hours vary; check before you go. Approximate pin.",s:[["HTP",""],["VIND",""]]},
{t:2,a:"DT",cz:["DR"],n:"Penguin City Brewing Company",ad:"460 E Federal St",la:41.0968,ln:-80.6440,
 w:"A downtown brewery in a former warehouse, pitched as Youngstown's go-to hometown beer, with a big room, a disco ball and live music. Named for the city's old 'Penguin' nickname.",
 k:"Taproom; check hours and events. Approximate pin.",s:[["BJ",""],["VIND",""]]},
{t:3,a:"WK",cz:["PZ"],n:"St. Anthony of Padua parish pizza",ad:"Brier Hill",la:41.1140,ln:-80.6640,
 w:"The Brier Hill church that sells hundreds of pizzas a week as a parish fundraiser — takeout, cash, and a genuine piece of neighbourhood lore.",
 k:"Fundraiser hours only — call ahead. Cash. Approximate pin.",warn:1,s:[["EXM_SLICE",""]]},
{t:3,a:"DT",cz:["IT"],n:"Casa Di Canzonetta",ad:"downtown Youngstown",la:41.0950,ln:-80.6600,
 w:"A well-liked Italian restaurant that turns up alongside the city's best, for a sit-down red-sauce dinner.",
 k:"Dinner; confirm hours. Approximate pin.",s:[["HTP",""]]},
{t:3,a:"DY",cz:["DR"],n:"Modern Methods Brewing Company",ad:"125 David Grohl Alley, Warren, OH",la:41.2378,ln:-80.8180,
 w:"Warren's first craft brewery since 1880, opened 2018 right on Dave Grohl Alley — IPAs, stouts and pilsners in a mural-wrapped tasting room.",
 k:"In Warren, ~20 min north; pair with Dave Grohl Alley.",s:[["OHMAG",""]]},
{t:3,a:"DY",cz:["DR"],n:"Birdfish Brewing Co.",ad:"140 E Park Ave, Columbiana, OH",la:40.8880,ln:-80.6940,
 w:"A community-minded small brewery in nearby Columbiana with a dozen rotating craft beers on tap — worth the drive south.",
 k:"In Columbiana, ~25 min south. Check taproom hours. Approximate pin.",s:[["FADD",""]]},
/* == MARKETS (selective: notable, permanent or popular-recurring, publicly open) == */
{t:2,a:"MC",cz:["MKT"],n:"The Amish Market",ad:"6121 South Ave, Boardman",la:41.0340,ln:-80.6500,
 w:"A permanent indoor Amish market on South Avenue: bulk foods, baked goods, produce, meats, cheese and dairy, plus Amish furniture and a hot-food restaurant, all under one roof. A genuine fixture, not a pop-up.",
 k:"Thu 9–6, Fri 9–6, Sat 8–4; closed Sun–Wed. Cash-friendly. Approximate pin.",s:[["YL",""]]},
{t:2,a:"WK",cz:["MKT"],n:"Northside Farmers Market",ad:"901 Elm St, North Side",la:41.1085,ln:-80.6510,
 w:"Youngstown's oldest farmers market, running since 2003 near Wick Park — a dozen-plus local growers with produce, preserves, plants and prepared food, and the occasional live music or demo. Small but excellent, and a genuine community institution.",
 k:"Saturday mornings (about 10–1); seasonal, so check the schedule before going. Publicly open.",warn:1,s:[["EXM",""]]},
{t:1,a:"DT",cz:["MKT"],n:"The Youngstown Flea",ad:"365 E Boardman St (downtown)",la:41.0965,ln:-80.6450,
 w:"Downtown's premier 'Market for Makers' — a monthly, tightly curated indoor/outdoor market of local artists, vintage sellers, antique and repurposed furniture, apparel and food that draws treasure-hunters from across the region. One of the best reasons to be downtown on a market day.",
 k:"Monthly during its season — check youngstownflea.com for dates before going. Publicly open.",warn:1,s:[["YF",""]]},
{t:2,a:"DY",cz:["MKT"],n:"Rogers Community Auction & Flea Market",ad:"45625 OH-154, Rogers, OH",la:40.7856,ln:-80.6300,
 w:"The largest open-air flea market in the tri-state area — over five miles of aisles and 1,000-plus vendor spaces of antiques, vintage, tools, produce and famous Amish doughnuts, going strong year-round. A proper day out for treasure hunters.",
 k:"Fridays only, 7:30am to mid-afternoon, year-round. About 35–40 min south; wear walking shoes.",warn:1,s:[["ROG",""]]},
/* == FARMS (visitable: U-pick, animals, education — publicly open, well-reviewed) == */
{t:2,a:"DY",cz:["FARM"],n:"White House Fruit Farm",ad:"9249 Youngstown-Salem Rd, Canfield, OH",la:41.0000,ln:-80.7800,
 w:"A big Canfield orchard and farm market open weekdays and weekends: orchard-fresh and pick-your-own apples, seasonal produce, and a fall gift barn famous for its apple-cider doughnuts and cider. The Valley's autumn tradition.",
 k:"Open much of the year; busiest in fall. About 20 min out. Approximate pin.",s:[["EXM",""],["WKBN",""]]},
{t:2,a:"DY",cz:["FARM"],n:"Detwiler Farm",ad:"4520 Renkenberger Rd, Columbiana, OH",la:40.9200,ln:-80.6600,
 w:"A family fall farm in Columbiana built for a day with kids: a hayride out to a 10-acre pick-your-own pumpkin patch, a straw maze and a 4-acre corn maze, plus a petting zoo and a tractor-tire playground.",
 k:"Seasonal (fall), about $7 admission. ~30 min south. Approximate pin.",warn:1,s:[["WKBN",""],["NEOFF",""]]},
{t:3,a:"DY",cz:["FARM"],n:"Molnar Farms",ad:"3115 E Western Reserve Rd, Poland, OH",la:41.0100,ln:-80.6000,
 w:"A popular Poland fall farm close to the city — a hayride to the pumpkin patch and a corn maze, cheap and cheerful.",
 k:"Seasonal (fall), about $5 per person. ~15 min out. Approximate pin.",warn:1,s:[["WKBN",""]]}
];
'''

# ── Inject fact-checked coordinates from data/geocodes.json (SINGLE SOURCE OF TRUTH) ──
# Every place's lat/lng comes from the central registry (each carries the source it was
# verified against). The build FAILS if any place lacks a sourced entry — no pin from
# memory. See docs/SOURCES.md and CLAUDE.md rule 4a.
import json as _json
_GEO = _json.load(open(os.path.join(ROOT, "data", "geocodes.json"), encoding="utf-8"))["cities"]["youngstown-oh"]
def _pf_names(s):
    names = []
    for marker in ("const P = [", "const F = ["):
        i = s.find(marker)
        if i < 0: continue
        j = s.find("\n];", i)
        names += re.findall(r'n:"((?:[^"\\]|\\.)*)"', s[i:(j if j > 0 else len(s))])
    return names
_missing = []
for _name in _pf_names(DATA):
    _e = _GEO.get(_name)
    if not _e or _e.get("lat") is None or _e.get("lng") is None \
       or not _e.get("source") or _e.get("source") == "UNVERIFIED":
        _missing.append(_name); continue
    _k = 'n:"' + _name + '"'; _i = DATA.find(_k); _j = min(len(DATA), _i + 800)
    _seg = DATA[_i:_j]
    _seg = re.sub(r'la:-?\d+\.\d+', "la:%.5f" % _e["lat"], _seg, count=1)
    _seg = re.sub(r'ln:-?\d+\.\d+', "ln:%.5f" % _e["lng"], _seg, count=1)
    DATA = DATA[:_i] + _seg + DATA[_j:]
assert not _missing, "GEOCODE GATE FAILED — %d place(s) lack a verified, sourced geocode in data/geocodes.json: %s" % (len(_missing), _missing[:12])
print("geocodes: injected verified coords for", len(_pf_names(DATA)), "places (0 missing)")

# --- record counts (used in copy + asserts) ---
nP = DATA.count("{t:", DATA.index("const P = ["), DATA.index("const FS = {"))
nF = DATA.count("{t:", DATA.index("const F = ["), len(DATA))
TOTAL = nP + nF

# --- splice: keep everything from the id/kind tagging loop onward ---
start = h.index("const S = {")
anchor = h.index("P.forEach((p,i)=>{p.id='s'+i")
new = h[:start] + DATA.strip() + "\n\n" + h[anchor:]

def rep(a, b):
    global new
    assert a in new, "missing: " + a[:70]
    new = new.replace(a, b)

rep("setView([41.4993,-81.6944],11)", "setView([41.0998,-80.6495],12)")
rep("const AC = {DT:'#74AE99',UC:'#C89B4A',WS:'#B45B3E',SUB:'#7E8FC4'};",
    "const AC = {WK:'#74AE99',MC:'#C89B4A',DT:'#B45B3E',DY:'#7E8FC4'};")

# per-city localStorage keys + export filenames
new = new.replace("cle_trip","yt_trip").replace("cle_seen","yt_seen").replace("cle_gkey","yt_gkey")
new = new.replace("cleveland-my-list","youngstown-my-list").replace("cleveland-field-guide","youngstown-field-guide")

# static map legend
new = new.replace(
'''  <span><i style="background:var(--c-dt)"></i>Downtown</span>
  <span><i style="background:var(--c-uc)"></i>University Circle &amp; East</span>
  <span><i style="background:var(--c-ws)"></i>West Side &amp; Tremont</span>
  <span><i style="background:var(--c-sub)"></i>Suburbs &amp; day trips</span>''',
'''  <span><i style="background:var(--c-dt)"></i>Wick Ave &amp; YSU</span>
  <span><i style="background:var(--c-uc)"></i>Mill Creek &amp; West Side</span>
  <span><i style="background:var(--c-ws)"></i>Downtown</span>
  <span><i style="background:var(--c-sub)"></i>Mahoning Valley day trips</span>''')

# blocked-map notice place count (dynamic)
new = new.replace("all 183 places", "all %d places" % TOTAL)

# hand-drawn Cleveland backdrop -> Youngstown labels only
new = new.replace(
'''const LABELS=[["Lake Erie",41.5600,-81.7400],["Downtown",41.4985,-81.6880],
 ["Ohio City",41.4845,-81.7080],["Tremont",41.4790,-81.6890],["Asiatown",41.5100,-81.6660],
 ["University Circle",41.5085,-81.6060],["Lakewood",41.4820,-81.7990],["Cuyahoga Valley",41.2600,-81.5600]];

backdrop=L.layerGroup().addTo(map);
L.polygon(SHORE.concat([[41.9000,-81.1000],[41.9000,-82.1000]]),
  {stroke:false,fillColor:'#16303A',fillOpacity:.55,interactive:false}).addTo(backdrop);
L.polyline(SHORE,{color:'#3E5D53',weight:1.6,opacity:.9,interactive:false}).addTo(backdrop);
L.polyline(RIVER,{color:'#2F5560',weight:2.2,opacity:.85,interactive:false}).addTo(backdrop);
ARTERIES.forEach(a=>L.polyline(a,{color:'#2E393E',weight:1.4,opacity:.8,interactive:false}).addTo(backdrop));
LABELS.forEach(''',
'''const LABELS=[["Downtown",41.0985,-80.6490],["Wick Ave / YSU",41.1060,-80.6470],
 ["Mill Creek Park",41.0820,-80.6820],["Brier Hill",41.1130,-80.6600],["Mahoning River",41.0930,-80.6350]];

// Youngstown is inland — no Lake Erie / Cuyahoga backdrop; real geography comes from tiles.
backdrop=L.layerGroup().addTo(map);
LABELS.forEach(''')
new = new.replace("so the map still shows Lake Erie, the\n   Cuyahoga and the main arteries even if every tile server is unreachable.",
                  "so subtle neighbourhood labels still show even if every tile server is unreachable.")

# search placeholders
new = new.replace('placeholder="witchcraft, waterfall, chess, kielbasa…"',
                  'placeholder="iron lung, planetarium, brier hill, mill…"')
new = new.replace("? 'laksa, dim sum, pastrami, cannoli…' : 'witchcraft, waterfall, chess, kielbasa…'",
                  "? 'brier hill, corned beef, wild ale, cider…' : 'iron lung, planetarium, brier hill, mill…'")
# dynamic must-see count
new = new.replace("'Every must-see (33)'", "'Every must-see ('+P.filter(p=>p.t===1).length+')'")

# food-mode tab renamed to signal the Markets + Farms categories
new = new.replace("Food, drink &amp; desserts", "Food, drink, markets &amp; farms")

# gmaps() city string + KML list name
new = new.replace(", Cleveland OH", ", Youngstown OH")
new = new.replace(">Cleveland — my list<", ">Youngstown — my list<")
new = new.replace(">Cleveland — my list<", ">Youngstown — my list<")

# meta description
new = re.sub(r'<meta name="description"[^>]*>',
    '<meta name="description" content="Youngstown, Ohio field guide — %d sights and %d places to eat, drink &amp; shop across the Mahoning Valley, each traceable to its source, on one interactive map with filters, a trip builder and exports.">' % (nP, nF),
    new)

# title + masthead
rep("<title>Cleveland Field Guide — 130 Places, Sourced</title>",
    "<title>Youngstown Field Guide — The Mahoning Valley, Sourced</title>")
rep('<p class="eyebrow">Field guide · every place from all seven sources</p>',
    '<p class="eyebrow">Field guide · the Mahoning Valley, sourced</p>')
rep('<h1>Cleveland<span class="thin">the complete odd &amp; overlooked</span></h1>',
    '<h1>Youngstown<span class="thin">steel, parks &amp; the odd corners</span></h1>')
rep('<p class="standfirst">143 sights and 40 places to eat, each traceable to the source that named it. <strong>Switch modes below</strong> &mdash; food lives on its own map so it never clutters the sightseeing one. Tick the box on anything to build your own list, then export it to Google or Apple Maps.</p>',
    '<p class="standfirst">%d sights and %d places to eat, drink &amp; shop across the Mahoning Valley, each traceable to the source that named it. <strong>Switch modes below</strong> &mdash; the same map, filters, trip builder and exports as the Cleveland guide. Tick anything to build your own list, then export it to Google or Apple Maps.</p>' % (nP, nF))
rep('<p style="font-family:\'JetBrains Mono\',monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--patina);margin:14px 0 0;">Last verified 2026-08-08 · <a href="index.html" style="color:var(--bone-dim);text-decoration:none;">← all cities</a></p>',
    '<p style="font-family:\'JetBrains Mono\',monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--patina);margin:14px 0 0;">Last verified 2026-08-09 · <a href="../index.html" style="color:var(--bone-dim);text-decoration:none;">← all cities</a> · <a href="youngstown-beta.html" style="color:var(--bone-dim);text-decoration:none;">Google-Maps beta ↗</a></p>')

# footer
rep('Compiled August 2026 · <strong>last verified 2026-08-08</strong>. Map tiles © OpenStreetMap contributors.<br>\n  <span style="opacity:.8">Refresh check (Aug 2026, via the pipeline): Sokolowski\'s University Inn confirmed still closed (kept, flagged); West Side Market open amid a $70M renovation, produce arcade reopened Jan 2026; newly opened since build — Rock &amp; Roll Hall of Fame expansion, Cleveland Metroparks Zoo Primate Forest, Irishtown Bend Park. Findings logged in data/sources.json.</span><br><br>',
    'Compiled August 2026 · <strong>last verified 2026-08-09</strong>. Map tiles © OpenStreetMap contributors.<br>\n  <span style="opacity:.8">Web-researched and fact-checked via the pipeline (see data/sources.json and docs/SOURCES.md). Coordinates are approximate pending a places-API pass; confirm addresses and hours before a drive. A Google-Maps rendering of the same guide is kept as a <a href="youngstown-beta.html">beta</a>.</span><br><br>')

# Cleveland-specific sources appendix -> Youngstown
YT_APPENDIX = (
    "+ '<div class=\"srcrow\"><span class=\"k\">FOOD RULES</span><div class=\"t\">How the food list works'\n"
    "  + '<span>Youngstown&#39;s signature is Brier Hill pizza — a pepper-and-romano pie with little or no mozzarella. A cuisine tag needs a named dish, not a label. Anything tagged ADDED is from general knowledge and should be verified before a visit.</span></div></div>'\n"
    "  + '<div class=\"srcrow\"><span class=\"k\">HOW SOURCED</span><div class=\"t\">Web-searched and fact-checked'\n"
    "  + '<span>Sources were found and cross-checked with web search. Direct page fetches are blocked in the build environment, so sourcing relied on search results, not full-page reads. The ranked sources for this city live in data/sources.json; the process is documented in docs/SOURCES.md.</span></div></div>'\n"
    "  + '<div class=\"srcrow\"><span class=\"k\">COVERED BY</span><div class=\"t\">YouTube &amp; creators'\n"
    "  + '<span>Peter Santenello (4.2M) covered next-door East Palestine — regional, not the city itself; Phil Kidd walks downtown Youngstown; Explore Mahoning covers the Valley. The Google-Maps beta page carries the full creator panel.</span></div></div>';"
)
new = re.sub(r"\+ '<div class=\"srcrow\"><span class=\"k\">FOOD RULES.*?</div></div>';",
             lambda m: YT_APPENDIX, new, flags=re.S)

assert not re.search(r"\\u[0-9a-fA-F]{4}", re.sub(r"<script[\s\S]*?</script>", "", new)), "literal \\uXXXX escape leaked into visible HTML \u2014 use real characters in page prose, not \\u escapes"
open(OUT, "w", encoding="utf-8").write(new)

# --- asserts ---
assert ", Cleveland OH" not in new, "gmaps city not swapped"
assert "P.forEach((p,i)=>{p.id='s'+i" in new, "id/kind tagging loop missing"
# "Cleveland Ave(nue)" is a real street in several of these metros; exempt it so this engine-leak
# guard fires only on a genuine template-data leak (Cleveland place names or a "Cleveland, OH"
# address city), never on a legitimate local address.
_leakseg = new[new.index("const S = {"):new.index("const ALL")]
assert "Cleveland" not in re.sub(r"Cleveland Ave(?:nue)?", "", _leakseg), "Cleveland leaked into data"
print("sights:", nP, "food:", nF, "total:", TOTAL)
print("remaining 'Cleveland' mentions (expect 1 parity note):", new.count("Cleveland"))
print("OK wrote", OUT)
