# Wave 6 discovery batch A (session 7, 2026-10-03) — every field from this session's WebSearch results.
from _orl_lib import food, sight, outlets, W
T="W6A"
outlets(T,[
 dict(key="ORLTODAY",name="ORL Today (6AM City)",type="local news",url="https://orltoday.6amcity.com/",credible="Daily local newsletter/newsroom (6AM City network) — local history features."),
 dict(key="DOWNTOWNORLANDO",name="Downtown Orlando (Downtown Development Board)",type="municipal",url="https://www.downtownorlando.com/",credible="City of Orlando's Downtown Development Board — official district/neighbourhood pages."),
 dict(key="NPS",name="National Park Service (NRHP / NPGallery)",type="institution",url="https://npgallery.nps.gov/",credible="National Register of Historic Places nomination files."),
 dict(key="PGATOUR",name="PGA TOUR",type="official",url="https://www.pgatour.com/",credible="Official tour site for the Arnold Palmer Invitational at Bay Hill."),
 dict(key="ORANGECOUNTY",name="Orange County Government (OCFL newsroom)",type="municipal",url="https://newsroom.ocfl.net/",credible="Official county government newsroom."),
 dict(key="BLOOLOOP",name="blooloop",type="industry press",url="https://blooloop.com/",credible="Attractions-industry trade publication."),
 dict(key="HOTELSABOVEPAR",name="Hotels Above Par",type="travel site",url="https://www.hotelsabovepar.com/",credible="Luxury hotel & resort-dining review site with bylined reviews."),
 dict(key="AAA",name="AAA TripCanvas",type="travel guide",url="https://www.aaa.com/tripcanvas/",credible="AAA inspected/listed restaurant guide."),
 dict(key="DIRONA",name="DiRōNA (Distinguished Restaurants of North America)",type="award",url="https://dirona.com/",credible="Independent restaurant award with anonymous inspection."),
 dict(key="KENNYTHEPIRATE",name="KennyThePirate",type="creator",url="https://www.kennythepirate.com/",credible="Long-running Disney World planning blog/creator (large following, dated reviews)."),
 dict(key="BLOGMICKEY",name="BlogMickey",type="creator",url="https://blogmickey.com/",credible="Daily Disney parks news blog with dated dining reviews."),
])
# ---------------- DTO (+10) ----------------
# Soco dropped: closed mid-2025 (diners' last-day reviews May 2025; no 2026 activity)
# Hammered Lamb dropped: closed 2025-01-25 (WFTV / Orlando Weekly / WKMG)
# DoveCote Brasserie dropped: downtown location closed 2023-10-01, no reopening found (Orlando Weekly / Scott Joseph / WFTV)
food(T,3,"DTO",["American","Bar"],"neighbourhood-bar burgers and cheap drinks on the patio","Burton's Bar",
 "801 E Washington St, Orlando, FL 32801",
 "Thornton Park's 80-plus-year neighbourhood bar — one of downtown's longest-lived establishments, reopened under the same name in 2017 by The Lodge/The Woods owners; Orlando Weekly: the area's 'cheapest and friendliest' with a prime people-watching patio.",
 [["ORLANDOWEEKLY","https://www.orlandoweekly.com/food-drink/orlandos-neighborhood-hangs-comfy-dives-and-places-to-kick-back-2244661/"],["BUNGALOWER","https://bungalower.com/2017/04/25/burtons-bar-replaced-burtons-bar/"]])
sight(T,2,"DTO","Wall Street Plaza","25 Wall St, Orlando, FL 32801",
 "Downtown's nightlife hub since 1995 — a pedestrian block of locally owned bars and clubs (WaiTiki tiki bar, Hen House, Hooch, Monkey Bar) closed to traffic for weekend block parties (WFTV downtown bar guide; Frommer's).",
 "nightlife bars block party downtown",[["WFTV","https://www.wftv.com/station/search/guide-to-downtown-orlando-bars/807605475/"],["FROMMERS","https://www.frommers.com/destinations/orlando/things-to-do/the-lounge--bar-scene/"]],g=["BAR"])
sight(T,2,"DTO","Rogers Building (CityArts)","37-39 S Magnolia Ave, Orlando, FL 32801",
 "Downtown's oldest building (1886) — a Queen Anne-style English gentlemen's club built by Gordon Rogers, NRHP 1983; donated to the city in 2018 as the Rogers-Kiene Building and home to CityArts' seven galleries (Clio; Visit Orlando; Orlando Weekly).",
 "historic architecture art gallery 1886 NRHP",[["WIKIPEDIA",W("Rogers_Building_(Florida)")],["CLIO","https://theclio.com/entry/163131"],["ORLANDOWEEKLY","https://www.orlandoweekly.com/arts/downtown-orlandos-historic-rogers-kiene-building-is-now-officially-the-new-cityarts-factory-24849329/"]])
sight(T,3,"DTO","Tinker Building","16-18 W Pine St, Orlando, FL 32801",
 "1925 glazed-brick-and-terracotta commercial building put up for $90,000 by Hall of Fame Cubs shortstop Joe Tinker for his real-estate office; NRHP 1980; later housed the Orlando Magic's and Orlando Weekly's offices (City of Orlando walking tour; NRHP nomination).",
 "historic architecture baseball 1925 NRHP",[["WIKIPEDIA",W("Tinker_Building")],["NPS","https://npgallery.nps.gov/GetAsset/7353b4ec-ae9e-48d0-9ff6-688e5de503a3"],["ORLANDOGOV","https://www.orlando.gov/files/sharedassets/public/v/1/departments/edv/city-planning/historic-preservation/historic-landmarks/walkingtour_brochure_web.pdf"]],
 lat=28.54083,lng=-81.37972,conf="med",note="Wikipedia/NRHP coordinate; consistent with 16 W Pine St (Pine St x Orange Ave block)")
sight(T,3,"DTO","Lake Cherokee Historic District","Lake Cherokee (southeast of the CBD), Orlando, FL 32801",
 "Orlando's second locally designated historic district (1981) — 16 blocks around the former Lake Minnie with 1880s 'Honeymoon Row' homes and 1920s boom-era Craftsman, Mediterranean and Tudor revivals (City of Orlando; Downtown Orlando DDB).",
 "historic district architecture walking homes",[["WIKIPEDIA",W("Lake_Cherokee_Historic_District")],["ORLANDOGOV","https://www.orlando.gov/Our-Government/History/Historic-Preservation-Districts"],["DOWNTOWNORLANDO","https://www.downtownorlando.com/Life/Districts-Neighborhoods/Lake-Cherokee-Historic-District"]])
sight(T,3,"DTO","Ivanhoe Village (Antique Row)","N Orange Ave at Lake Ivanhoe, Orlando, FL 32804",
 "City-funded Main Street district on North Orange Avenue — the old 'Antique Row' of Art Deco-era storefronts across from Lake Ivanhoe, now galleries, vintage shops, bars and eateries (City of Orlando Main Streets; Visit Orlando).",
 "neighborhood shopping antiques galleries bars",[["ORLANDOGOV","https://orlando.gov/Our-Government/Departments-Offices/Economic-Development/Business-Development/Orlando-Main-Streets/Ivanhoe-Village-Main-Street"],["VISITORLANDO","https://www.visitorlando.com/listing/ivanhoe-village-main-street/52203/"]],g=["SHOP"])
sight(T,3,"DTO","Orlando City Hall","400 S Orange Ave, Orlando, FL 32801",
 "Postmodern 1991 city hall whose 1958 predecessor next door was imploded on 24 Oct 1991 for the opening scene of Lethal Weapon 3; the rotunda hosts the Terrace Gallery art shows (City of Orlando; ORL Today).",
 "architecture film history Lethal Weapon civic",[["WIKIPEDIA",W("Orlando_City_Hall")],["ORLANDOGOV","https://www.orlando.gov/files/sharedassets/public/v/1/wpmigrate/2014/04/cityhallbrochureprint.pdf"],["ORLTODAY","https://orltoday.6amcity.com/history/how-lethal-weapon-3-blew-up-old-orlando-city-hall"]],
 lat=28.537590,lng=-81.379596,g=["ODD"])
# ---------------- IDR (+8) ----------------
food(T,1,"IDR",["Italian","Farm-to-table"],"seasonal Italian from the on-site Primo Garden","Primo by Melissa Kelly",
 "4040 Central Florida Pkwy, Orlando, FL 32837",
 "Two-time James Beard winner Melissa Kelly's farm-to-table Italian in the JW Marriott Grande Lakes (since 2003, redesigned 2021) — MICHELIN Guide Florida listed since the 2022 inaugural edition; produce, honey and eggs from its own garden.",
 [["MICHELIN","https://guide.michelin.com/us/en/florida/orlando/restaurants"],["HOTELSABOVEPAR","https://www.hotelsabovepar.com/articles/restaurants/primo-orlando-restaurant-review-michelin-jw-marriott-grande-lakes"]])
food(T,2,"IDR",["American","Fine dining"],"chef Tony Lopez's seasonal fine dining (grouper with pecan butter)","Chatham's Place",
 "7575 Dr Phillips Blvd, Orlando, FL 32819",
 "Dr. Phillips fine-dining fixture for 30+ years — chef Tony Lopez's locally sourced menu; Orlando Weekly essential Dr. Phillips pick, reviewed and Magical Dining-featured by Scott Joseph.",
 [["ORLANDOWEEKLY","https://www.orlandoweekly.com/orlando-guides/dr-phillips-is-the-perfect-neighborhood-for-restaurant-lovers-12829132/"],["SCOTTJOSEPH","https://scottjosephorlando.com/restaurant_listing/chathams-place/"]])
food(T,2,"IDR",["Lebanese","Middle Eastern"],"baked kibbeh, mezze","Cedar's Restaurant",
 "7732 W Sand Lake Rd, Orlando, FL 32819",
 "Restaurant Row's upscale Lebanese dining room — baked kibbeh and mezze; Orlando Weekly's Dr. Phillips guide, Scott Joseph listing.",
 [["ORLANDOWEEKLY","https://www.orlandoweekly.com/orlando-guides/dr-phillips-is-the-perfect-neighborhood-for-restaurant-lovers-12829132/"],["SCOTTJOSEPH","https://scottjosephorlando.com/restaurant_listing/cedars/"]])
food(T,2,"IDR",["Japanese"],"robatayaki skewers and sushi","Dragonfly Robata Grill & Sushi",
 "7972 Via Dellagio Way, Orlando, FL 32819",
 "Dellagio's Japanese robata grill and sushi bar (from Gainesville) — five-time Florida Trend Golden Spoon winner (2015-19); reviewed by Orlando Weekly ('Mister Robata') and Scott Joseph.",
 [["ORLANDOWEEKLY","https://www.orlandoweekly.com/arts/mister-robata-2317971/"],["SCOTTJOSEPH","https://scottjosephorlando.com/?p=19401"]])
# Slate (8323 W Sand Lake) dropped: permanently closed 2024-01-03 (FOX 35 / News 6 / Orange Observer)
# Skeletons: Museum of Osteology dropped: Atlas Obscura lists it permanently closed
sight(T,3,"IDR","Ripley's Believe It or Not! Orlando","8201 International Dr, Orlando, FL 32819",
 "I-Drive's 'sinking' odditorium — a building in Ripley's disaster architecture tilting into a mock sinkhole, one of the strip's most photographed facades; 600 exhibits in 16 galleries (Orlando Informer review; blooloop).",
 "odd museum architecture photo stop",[["ORLANDOINFORMER","https://orlandoinformer.com/2012/ripleys-believe-it-or-not-orlando-review-photo-gallery/"],["BLOOLOOP","https://blooloop.com/uncategorised/news/visitor-attractions-ripley-entertainment-inc-acquires-orlando-and-branson-believe-it-or-not-odditoriums"]],g=["ODD"])
sight(T,3,"IDR","Bay Hill Club & Lodge","9000 Bay Hill Blvd, Orlando, FL 32819",
 "Arnold Palmer's Bay Hill (owned by Palmer from 1974) — host of the PGA TOUR's Arnold Palmer Invitational every March since 1979; the lodge and course sit in the Dr. Phillips lake country.",
 "golf PGA Tour Arnold Palmer sport",[["WIKIPEDIA",W("Arnold_Palmer_Invitational")],["PGATOUR","https://www.pgatour.com/tournaments/2025/arnold-palmer-invitational-presented-by-mastercard/R2025009/course-stats"]])
# ---------------- WPK (+4) ----------------
food(T,2,"WPK",["Chinese","Sichuan"],"family-style Sichuan classics (mapo tofu, dry-fried dishes)","Chuan Fu",
 "1035 N Orlando Ave #105, Winter Park, FL 32789",
 "MICHELIN Guide Florida Recommended (2024-26) — Winter Park's polished Sichuan dining room with a large family-style menu of layered, bold classics; Tasty Chomps inside look.",
 [["MICHELIN","https://guide.michelin.com/pl/en/florida/winter-park/restaurant/chuan-fu"],["TASTYCHOMPS","https://tastychomps.com/2025/06/inside-look-michelin-guide-recommended-chuan-fu-winter-park.html"]])
food(T,2,"WPK",["Seafood"],"smoked fish dip, fish & chips, shrimp 'n' grits","Winter Park Fish Co.",
 "761 N Orange Ave, Winter Park, FL 32789",
 "Former Orlando Weekly Best Seafood Restaurant winner — dockside-casual counter with a fresh-fish case (Orlando Weekly essential Winter Park; Scott Joseph review).",
 [["ORLANDOWEEKLY","https://www.orlandoweekly.com/food-drink/25-essential-winter-park-restaurants-you-shouldve-tried-by-now-30945053/"],["SCOTTJOSEPH","https://scottjosephorlando.com/winter-park-fish-company/"]])
food(T,3,"WPK",["Spanish","Tapas"],"tapas (croquetas, paella) by chef Diego Solano","Bulla Gastrobar",
 "110 S Orlando Ave, Winter Park, FL 32789",
 "Winter Park's Spanish tapas bar — chef Diego Solano's Barcelona-style small plates and cocktails (Orlando Weekly essential Winter Park; Winter Park Magazine 'Bite of Barcelona').",
 [["ORLANDOWEEKLY","https://www.orlandoweekly.com/food-drink/20-essential-winter-park-restaurants-every-orlandoan-needs-to-try-33870557/"],["WINTERPARKMAG","https://winterparkmag.com/?p=1915"]])
food(T,3,"WPK",["Japanese","Sushi"],"sashimi, robata skewers, Japanese-fusion small plates","Umi",
 "525 S Park Ave, Winter Park, FL 32789",
 "Park Avenue sushi and robata bar — Orlando Weekly: 'stellar sashimi and robata offerings'; Scott Joseph review; Visit Orlando listing.",
 [["ORLANDOWEEKLY","https://www.orlandoweekly.com/food-drink/potential-park-avenue-mainstay-umi-dishes-impressive-small-plates-sushi-and-japanese-fusion-2465779/"],["SCOTTJOSEPH","https://scottjosephorlando.com/umi/"],["VISITORLANDO","https://www.visitorlando.com/en/things-to-do/restaurants/Umi-Sushi/46052"]])
# ---------------- MILLS (+5 sights) ----------------
sight(T,2,"MILLS","Loch Haven Park","1001 E Princeton St, Orlando, FL 32803",
 "Orlando's cultural park on Mills & Princeton — one green campus holding the Orlando Museum of Art, Science Center, Mennello Museum, Orlando Shakespeare Theater, Orlando Family Stage and the Fire Museum (Orange County; Orlando Weekly).",
 "park museums culture lakes picnic",[["ORANGECOUNTY","https://newsroom.ocfl.net/media-gallery/video-gallery/2018/10/ocfl-update-harrietts-orlando-ballet-centre-groundbreaking/"],["ORLANDOGOV","https://orlando.gov/Community-Programs-Events/Educational-Programs-for-Schools-and-Organizations/Visit-the-Orlando-Fire-Museum"]],g=["PARK"])
sight(T,3,"MILLS","Orlando Family Stage (Orlando Rep)","1001 E Princeton St, Orlando, FL 32803",
 "Loch Haven Park's three-stage, 40,000 sq ft theatre for young audiences — the Orlando Repertory Theatre, renamed Orlando Family Stage in 2023 (Wikipedia; UCF partnership).",
 "theatre family performing arts",[["WIKIPEDIA",W("Orlando_Family_Stage")],["ORLANDOWEEKLY","https://www.orlandoweekly.com/orlando-guides/audubon-park-an-eclectic-mix-of-culinary-talents-and-artistic-flair-33955634/"]])
sight(T,3,"MILLS","Randall R. Tuten Orlando Fire Museum","814 E Rollins St, Orlando, FL 32803",
 "Orlando's 1926 Fire Station No. 3, moved from College Park to Loch Haven Park and run by OFD as a free museum — 1911 horse-drawn steam pumper, 1915 and 1919 LaFrance engines (City of Orlando; Clio).",
 "museum history firefighting free family",[["ORLANDOGOV","https://orlando.gov/Community-Programs-Events/Educational-Programs-for-Schools-and-Organizations/Visit-the-Orlando-Fire-Museum"],["CLIO","https://theclio.com/entry/85888"],["BUNGALOWER","https://bungalower.com/venue/orlando-fire-museum/"]])
sight(T,3,"MILLS","Audubon Park Garden District","Corrine Dr, Orlando, FL 32803",
 "Corrine Drive 'ecodistrict' of vintage shops, cafes, bakeries and urban farmlettes — a City of Orlando Main Street since 2008 and 2016 Great American Main Street Award winner (City of Orlando; Orlando Weekly neighbourhood guide).",
 "neighborhood shopping farmers market cafes",[["ORLANDOGOV","https://orlando.gov/Our-Government/Departments-Offices/Economic-Development/Business-Development/Orlando-Main-Streets/Audubon-Park-Garden-District"],["ORLANDOWEEKLY","https://www.orlandoweekly.com/orlando-guides/audubon-park-an-eclectic-mix-of-culinary-talents-and-artistic-flair-33955634/"]],g=["SHOP"])
sight(T,2,"MILLS","Mills 50 District (Little Saigon)","Mills Ave & Colonial Dr (SR 50), Orlando, FL 32803",
 "Orlando's Little Saigon at Mills Ave x SR 50 — settled by Vietnamese refugees from the late 1970s-80s into one of Florida's densest clusters of Vietnamese restaurants, markets and shops, now pan-Asian (Wikipedia; News 6; Visit Florida).",
 "neighborhood Vietnamese food culture murals",[["WIKIPEDIA",W("Mills_50_(Orlando)")],["CLICKORLANDO","https://clickorlando.com/news/local/2022/05/05/how-orlandos-mills-50-district-turning-to-a-thriving-asian-american-community/"],["VISITFLORIDA","https://visitflorida.com/travel-ideas/articles/orlando-little-saigon-vietnamese-restaurants-shops"]])
# ---------------- KISS (+4) — Gastro Obscura x Experience Kissimmee Latin Culinary Trail ----------------
TR=["EXPERIENCEKISSIMMEE","https://www.experiencekissimmee.com/press/press-releases/experience-flavors-kissimmee-new-latin-culinary-trail"]
food(T,2,"KISS",["Dominican","Japanese"],"Dominican-remix sushi rolls","Daddy Ninja",
 "500 E Osceola Pkwy, Kissimmee, FL 34744",
 "Dominican-Japanese sushi hideaway — Gastro Obscura video feature and stop on the Experience Kissimmee × Atlas Obscura Latin Culinary Trail.",
 [["ATLASOBSCURA","https://www.atlasobscura.com/articles/daddy-ninja-kissimmee-video"],TR])
food(T,2,"KISS",["Venezuelan"],"Venezuelan arepas and patacones from Paraguaná","Pa' Paraguaná",
 "2381 N Orange Blossom Trl, Kissimmee, FL 34744",
 "Venezuelan kitchen on the Gastro Obscura × Experience Kissimmee Latin Culinary Trail.",
 [["ATLASOBSCURA","https://www.atlasobscura.com/places/pa-paraguana"],TR])
food(T,3,"KISS",["Mexican"],"Mexican tacos and antojitos","La Mexicana (Kissimmee)",
 "2160 W Columbia Ave, Kissimmee, FL 34741",
 "Mexican stop on the Gastro Obscura × Experience Kissimmee Latin Culinary Trail.",
 [["ATLASOBSCURA","https://kissimmee-latin-culinary-trail.atlasobscura.com/"],TR])
food(T,3,"KISS",["Venezuelan"],"Venezuelan llanero grill plates","Mi Llano Grill",
 "3260 Vineland Rd Ste 100, Kissimmee, FL 34746",
 "Venezuelan grill on the Gastro Obscura × Experience Kissimmee Latin Culinary Trail.",
 [["ATLASOBSCURA","https://kissimmee-latin-culinary-trail.atlasobscura.com/"],TR])
# ---------------- SPACE (+2 food) ----------------
food(T,2,"SPACE",["American","Bar"],"space-themed cocktails with launch-pad views","The Space Bar",
 "6245 Riverfront Center Blvd, Titusville, FL 32780",
 "Rooftop bar-restaurant atop the Courtyard Titusville Kennedy Space Center — the closest hotel rooftop to Launch Complexes 39A/39B, open to non-guests (cover on launch nights); Space Coast Living readers' Best Romantic Dinner; WFTV + News 6 coverage.",
 [["WFTV","https://www.wftv.com/news/local/brevard-county/hotel-near-kennedy-space-center-with-rooftop-views-rocket-launches-open-march/HRGKYU2NO5FWJEX2Q6X73BZTZY"],["CLICKORLANDO","https://clickorlando.com/travel/planned-hotel-near-kennedy-space-center-will-offer-launch-viewing-from-rooftop-deck"],["SPACECOASTLIVING","https://spacecoastliving.com/?p=58228"]])
food(T,3,"SPACE",["Seafood"],"fresh seafood on the upper deck as cruise ships sail out","Fishlips Waterfront Bar & Grill",
 "610 Glen Cheek Dr, Cape Canaveral, FL 32920",
 "Port Canaveral channel-side seafood house — the Port's webcam spot for watching cruise sail-aways and rocket launches from its tiki sun deck (FOX 35 'Beach Bites'; AAA).",
 [["FOX35","https://www.fox35orlando.com/video/fmc-2945pfhm1zbiwul5"],["AAA","https://www.aaa.com/tripcanvas/restaurant/fishlips-276240"]])
# ---------------- SPRNG (+2) ----------------
food(T,1,"SPRNG",["Global","Farm-to-table"],"globally inspired, locally sourced tasting-style plates","Cress Restaurant",
 "103 W Indiana Ave, DeLand, FL 32720",
 "Historic downtown DeLand's destination restaurant built by multi-time James Beard nominee Hari Pulapaka (now chef-owner Tom Brandt) — 2025 DiRōNA Award, 2025 Wine Spectator Award of Excellence (Scott Joseph; DiRōNA).",
 [["SCOTTJOSEPH","https://scottjosephorlando.com/pulapaka-steps-away-from-cress-operations-with-minority-ownership/"],["DIRONA","https://dirona.com/cress-restaurant"]])
sight(T,3,"SPRNG","Stetson University Campus Historic District","421 N Woodland Blvd, DeLand, FL 32723",
 "Florida's oldest private university (1883) — a 220-acre NRHP district (1991) whose DeLand Hall is the state's oldest building in continuous use for higher education.",
 "historic campus architecture university",[["WIKIPEDIA",W("Stetson_University_Campus_Historic_District")],["HMDB","https://www.hmdb.org/m.asp?m=45502"],["OFFICIAL","https://www2.stetson.edu/today/2023/08/celebrating-140-years-the-beginning-1883-1892/"]],
 lat=29.03500,lng=-81.30361,note="district coordinate (Wikipedia/NRHP)")
# ---------------- DAK (+1, food share) ----------------
food(T,3,"DAK",["Pan-Asian"],"honey chicken, Korean fried chicken sandwich, egg rolls","Yak & Yeti Local Food Cafes",
 "Asia, Disney's Animal Kingdom, Bay Lake, FL 32830",
 "Asia's walk-up counter beside the Yak & Yeti restaurant (Landry's-run, no mobile order) — TouringPlans review ranks it in WDW's top half of 111 quick-service spots; KennyThePirate review.",
 [["TOURINGPLANS","https://touringplans.com/blog/review-yak-and-yeti-local-food-cafes-brings-quick-asian-flavors-at-decent-prices/"],["KENNYTHEPIRATE","https://www.kennythepirate.com/2020/08/21/review-of-yak-and-yeti-local-food-cafes-at-disneys-animal-kingdom/"]])
food(T,3,"DAK",["American"],"mac and cheese bowls","Eight Spoon Café",
 "Discovery Island, Disney's Animal Kingdom, Bay Lake, FL 32830",
 "Discovery Island kiosk famous for its mac-and-cheese variations (TouringPlans 'comfort food haven'; Disney Food Blog).",
 [["TOURINGPLANS","https://touringplans.com/blog/?p=467998"],["DISNEYFOODBLOG","https://disneyfoodblog.com/2021/06/28/whats-new-at-animal-kingdom-a-mac-and-cheese-hot-spot-reopens-and-a-souvenir-cup-bargin"]])
food(T,3,"DAK",["American"],"burgers and nuggets in a dig-site HQ (closed)","Restaurantosaurus — CLOSED",
 "DinoLand U.S.A., Disney's Animal Kingdom, Bay Lake, FL 32830",
 "DinoLand's paleontology-camp counter — permanently closed 2 Feb 2026 for the Pueblo Esperanza land construction (Disney Food Blog; WDWInfo; BlogMickey 'final review').",
 [["DISNEYFOODBLOG","https://www.disneyfoodblog.com/restaurantosaurus"],["BLOGMICKEY","https://blogmickey.com/restaurantosaurus-review-dinoland-usa/"]],closed=True,
 stsrc="Permanently closed 2026-02-02 per https://www.disneyfoodblog.com/restaurantosaurus")
# ---------------- IOA (+1 food) ----------------
food(T,3,"IOA",["Greek","Mediterranean"],"lamb and chicken kebabs, gyros, hummus","Fire-Eater's Grill",
 "The Lost Continent, Universal Islands of Adventure, Orlando, FL 32819",
 "Lost Continent counter for kebabs and gyros — TouringPlans' 'This Not That' Universal dining pick; ranked in Islands.com's IOA restaurants list.",
 [["TOURINGPLANS","https://touringplans.com/blog/this-not-that-universal-orlando-dining/"],["ISLANDS","https://www.islands.com/2189458/best-islands-of-adventure-restaurants-ranked/"]])
print("ok")
# ---- DTO replacements (after closure sweep): College Park + Ivanhoe Village classics with 2025-26 evidence ----
food(T,2,"DTO",["American","Cafe"],"giant cinnamon rolls, weekend brunch among antiques","White Wolf Cafe",
 "1829 N Orange Ave, Orlando, FL 32804",
 "Ivanhoe Village's 30-plus-year 'Orlando Classic' (Scott Joseph) — an antique shop turned cafe-bar, named for the owners' white shepherd; Orlando Weekly readers' #2 Ivanhoe Village restaurant 2025; Food Network's $40 a Day stop; Tasty Chomps snapshots.",
 [["SCOTTJOSEPH","https://scottjosephorlando.com/white-wolf-cafe-bar/"],["ORLANDOWEEKLY","https://www.orlandoweekly.com/best-of/the-best-restaurant-in-every-part-of-orlando-according-to-our-readers/"],["TASTYCHOMPS","https://tastychomps.com/2015/08/snapshots-from-white-wolf-cafe-in-ivanhoe-village.html"]])
food(T,2,"DTO",["American","Diner"],"breakfast plates and daily quiche under a wall of salt-and-pepper shakers","Shakers American Cafe",
 "1308 Edgewater Dr, Orlando, FL 32804",
 "College Park's breakfast-and-lunch diner (since the 1990s) named for its salt-and-pepper-shaker collection — Scott Joseph 'bona fide Orlando Classic' and Foodster Best Breakfast 2017; Orlando Weekly Edgewater essential + Best of Orlando 2026 entry.",
 [["SCOTTJOSEPH","https://scottjosephorlando.com/2017-foodster-award-for-best-breakfast-shakers-american-cafe/"],["ORLANDOWEEKLY","https://community.orlandoweekly.com/best-of/2026/food-dining/best-salt-and-pepper-shakers-american-cafe-41108051"]],
 stsrc="Open — Orlando Weekly Best of Orlando 2026 entry https://community.orlandoweekly.com/best-of/2026/food-dining/best-salt-and-pepper-shakers-american-cafe-41108051")
food(T,3,"DTO",["American","Sandwiches"],"cooked-to-order subs and shakes from the original milkshake machine","Gabriel's Submarine Sandwich Shop",
 "3006 Edgewater Dr, Orlando, FL 32804",
 "Paul Gabriel's family-run College Park sub shop (1958) — one of Orlando's oldest restaurants, still with its original milkshake machine and dining furniture (News 6 'last remaining iconic restaurants of Orlando' 2023; Orlando Weekly Edgewater essential).",
 [["CLICKORLANDO","https://www.clickorlando.com/news/local/2023/11/23/here-are-the-last-remaining-iconic-restaurants-of-orlando"],["ORLANDOWEEKLY","https://www.orlandoweekly.com/orlando/24-essential-edgewater-drive-restaurants-you-shouldve-tried-by-now/Slideshow/30946705"]])
sight(T,3,"IDR","Orange County Convention Center","9860 Universal Blvd, Orlando, FL 32819",
 "The second-largest convention center in the US after Chicago's McCormick Place (opened 1983; 7 million sq ft, 2.1 million of exhibit space) — the anchor of International Drive's south end (Wikipedia; I-Drive district).",
 "landmark architecture conventions",[["WIKIPEDIA",W("Orange_County_Convention_Center")],["OFFICIAL","https://www.internationaldriveorlando.com/visitor-information/orange-county-convention-center/"]],
 lat=28.4271846,lng=-81.4639235,conf="med",note="Wikipedia coordinate for a multi-building campus (West/North-South concourses)")
outlets(T,[dict(key="CFLIFESTYLE",name="Central Florida Lifestyle",type="local magazine",url="https://www.centralfloridalifestyle.com/",credible="Regional lifestyle magazine with bylined local dining coverage.")])
food(T,2,"IDR",["Steakhouse","Mediterranean"],"Mediterranean-inspired prime cuts and seafood","The H Orlando",
 "7512 Dr Phillips Blvd #80, Orlando, FL 32819",
 "Dr. Phillips' Mediterranean-leaning modern steakhouse — Orlando Weekly readers' Best Sand Lake/Dr. Phillips Restaurant 2026 (ahead of DOMU and Seito); its group took over Restaurant Row's Vines Grille as Vines by H in 2025 (Central Florida Lifestyle).",
 [["ORLANDOWEEKLY","https://www.orlandoweekly.com/best-of/the-best-restaurant-in-every-part-of-orlando-according-to-our-readers/"],["CFLIFESTYLE","https://www.centralfloridalifestyle.com/?p=71375"]],
 stsrc="Open — Orlando Weekly Best of Orlando 2026 winner https://www.orlandoweekly.com/best-of/the-best-restaurant-in-every-part-of-orlando-according-to-our-readers/")
