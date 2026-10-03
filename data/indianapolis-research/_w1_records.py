# W1 records (2026-10-03) — every field from a WebSearch result logged in AUDIT.md. Run: python3 _w1_records.py
import json, subprocess, sys
def add(kind, rec, geo=None):
    a=[sys.executable,"_add.py",kind,json.dumps(rec,ensure_ascii=False)]
    if geo: a.append(json.dumps(geo,ensure_ascii=False))
    subprocess.run(a,check=True)
W="https://en.wikipedia.org/wiki/"
def g(n,addr,lat,lng,src,conf="high",status="open",ss="",note=None):
    d={"n":n,"address":addr,"lat":lat,"lng":lng,"geoSource":src,"confidence":conf,"status":status,"statusSource":ss}
    if note: d["note"]=note
    return d
VI="https://www.visitindy.com/"
IE="https://indyencyclopedia.org/"
SS_PUB="Public landmark in active use; listed in Downtown Indy / Visit Indy directories (2026)"
# ---- sights ----
add("sight",{"t":1,"a":"DTN","k":"Monument Circle","n":"Soldiers' and Sailors' Monument","address":"Monument Circle, Indianapolis, IN",
 "w":"The 284-ft neoclassical monument on Monument Circle, dedicated 1902 — the city's signature structure and literal centre of the original Mile Square plan. Free; observation deck and the Civil War museum below.",
 "sources":[["WIKIPEDIA",W+"Soldiers%27_and_Sailors%27_Monument_(Indianapolis)"],["INDYENCYCLOPEDIA","https://indyencyclopedia.org/?p=14539"],["INDYARTS","https://indyarts.org/public-art/soldiers-and-sailors-monument/"]]},
 g("Soldiers' and Sailors' Monument","Monument Circle, Indianapolis, IN",39.76833,-86.15806,"Wikipedia infobox 39°46′6″N 86°9′29″W ("+W+"Soldiers%27_and_Sailors%27_Monument_(Indianapolis))",ss=SS_PUB))
add("sight",{"t":1,"a":"DTN","n":"Indiana World War Memorial Plaza","address":"Indiana World War Memorial Plaza (N Meridian St), Indianapolis, IN",
 "w":"Five city blocks of memorials — the stepped-pyramid Indiana War Memorial (free military museum + Shrine Room), the Obelisk and the American Legion Mall. One of the largest memorial plazas in the US; free.",
 "sources":[["WIKIPEDIA",W+"Indiana_World_War_Memorial_Plaza"],["VISITINDY","https://www.visitindy.com/directory/indiana-war-memorial-plaza-historic-district/"],["TCLF","https://tclf.org/indiana-war-memorials-historic-district"]]},
 g("Indiana World War Memorial Plaza","Indiana World War Memorial Plaza (N Meridian St), Indianapolis, IN",39.77361,-86.15694,"Wikipedia infobox 39°46′25″N 86°9′25″W ("+W+"Indiana_World_War_Memorial_Plaza)",ss=SS_PUB))
add("sight",{"t":1,"a":"WEST","k":"Speedway","n":"Indianapolis Motor Speedway Museum","address":"4750 W 16th St, Indianapolis, IN 46222",
 "w":"Inside the oval: Indy 500-winning cars, the Borg-Warner Trophy and the grounds tour that ends kissing the Yard of Bricks. The essential racing stop.",
 "sources":[["WIKIPEDIA",W+"Indianapolis_Motor_Speedway_Museum"],["INDYENCYCLOPEDIA",IE+"indianapolis-motor-speedway-hall-of-fame-museum/"]]},
 g("Indianapolis Motor Speedway Museum","4750 W 16th St, Indianapolis, IN 46222",39.790298,-86.233597,"Wikipedia infobox 39°47′25″N 86°14′01″W ("+W+"Indianapolis_Motor_Speedway_Museum)",ss="Operating museum, imsmuseum.org visit FAQ (2026)"))
add("sight",{"t":1,"a":"WEST","k":"Speedway","n":"Indianapolis Motor Speedway","address":"W 16th St (museum entrance at 4750 W 16th St), Speedway, IN",
 "w":"The Brickyard (1909), home of the Indianapolis 500 — a National Historic Landmark with the Pagoda scoring tower, Gasoline Alley and the original yard of bricks at the start/finish line.",
 "sources":[["WIKIPEDIA",W+"Indianapolis_Motor_Speedway"],["NPS","https://npgallery.nps.gov/NRHP/GetAsset/NHLS/75000044_text"],["TCLF","https://www.tclf.org/landscapes/indianapolis-motor-speedway"]]},
 g("Indianapolis Motor Speedway","W 16th St (museum entrance at 4750 W 16th St), Speedway, IN",39.79833,-86.23278,"Wikipedia infobox 39°47′54″N 86°13′58″W ("+W+"Indianapolis_Motor_Speedway)",conf="med",ss="Active race venue (Indy 500 annually)",note="infobox point = centre of the oval infield, not the gate"))
add("sight",{"t":1,"a":"MID","n":"The Children's Museum of Indianapolis","address":"3000 N Meridian St, Indianapolis, IN 46208",
 "w":"The world's largest children's museum (1925) — dinosaurs bursting out of the façade, the Chihuly Fireworks of Glass tower, an 1890s carousel. Over a million visitors a year.",
 "sources":[["WIKIPEDIA",W+"The_Children%27s_Museum_of_Indianapolis"],["SAHARCHIPEDIA","https://sah-archipedia.org/node/12992"],["DOWNTOWNINDY","https://downtownindy.org/go/the-childrens-museum-of-indianapolis-1"]]},
 g("The Children's Museum of Indianapolis","3000 N Meridian St, Indianapolis, IN 46208",39.810604,-86.158028,"latlong.net place record (https://www.latlong.net/place/the-children-s-museum-of-indianapolis-in-usa-466.html) 39.810604,-86.158028",conf="med",ss="Operating museum (Downtown Indy listing 2026)"))
add("sight",{"t":1,"a":"MID","k":"Newfields","n":"Newfields (Indianapolis Museum of Art)","address":"4000 Michigan Rd, Indianapolis, IN",
 "w":"152-acre campus: the encyclopedic Indianapolis Museum of Art (1883, 54,000 works), Lilly House, the gardens and the 100-acre Fairbanks Art & Nature Park; Robert Indiana's LOVE lives here.",
 "sources":[["WIKIPEDIA",W+"Indianapolis_Museum_of_Art"],["IBJ","https://www.ibj.com/articles/65024-update-art-museum-names-campus-with-big-changes-on-drawing-board"],["DOWNTOWNINDY","https://downtownindy.org/go/newfields"]]},
 g("Newfields (Indianapolis Museum of Art)","4000 Michigan Rd, Indianapolis, IN",39.825833,-86.185556,"Wikipedia infobox 39°49′33″N 86°11′08″W ("+W+"Indianapolis_Museum_of_Art)",ss="Operating museum (Downtown Indy listing 2026)"))
add("sight",{"t":1,"a":"DTN","n":"Indiana Statehouse","address":"200 W Washington St, Indianapolis, IN 46204",
 "w":"The 1888 Renaissance Revival capitol with a stained-glass rotunda dome; free self-guided and guided tours on weekdays.",
 "sources":[["WIKIPEDIA",W+"Indiana_Statehouse"],["SAHARCHIPEDIA","https://sah-archipedia.org/node/12973"]]},
 g("Indiana Statehouse","200 W Washington St, Indianapolis, IN 46204",39.76861,-86.16278,"Wikipedia infobox 39°46′07″N 86°09′46″W ("+W+"Indiana_Statehouse)",ss="Seat of state government, in use"))
add("sight",{"t":1,"a":"DTN","n":"Eiteljorg Museum","address":"White River State Park, Indianapolis, IN",
 "w":"Museum of American Indians and Western Art (1989) in White River State Park — Native contemporary art plus Western painting and sculpture.",
 "sources":[["WIKIPEDIA",W+"Eiteljorg_Museum_of_American_Indians_and_Western_Art"],["CLIO","https://theclio.com/entry/17451"]]},
 g("Eiteljorg Museum","White River State Park, Indianapolis, IN",39.7683,-86.1678,"Wikipedia infobox 39°46′06″N 86°10′04″W ("+W+"Eiteljorg_Museum_of_American_Indians_and_Western_Art)",ss="Operating museum"))
add("sight",{"t":2,"a":"DTN","n":"Indiana State Museum","address":"650 W Washington St, Indianapolis, IN 46204",
 "w":"The state's history-and-science museum on the canal in White River State Park, with an IMAX theatre and a sculpture in every Indiana county's limestone on the façade.",
 "sources":[["DOWNTOWNINDY","https://downtownindy.org/go/indiana-state-museum-and-historic-sites"],["WIKIPEDIA",W+"White_River_State_Park"]]},
 g("Indiana State Museum","650 W Washington St, Indianapolis, IN 46204",39.768928,-86.169982,"search-result place coords 39°46'8.141\"N 86°10'11.935\"W (aggregator, not Wikipedia infobox)",conf="med",ss="Operating museum (Downtown Indy listing 2026)"))
add("sight",{"t":1,"a":"MID","k":"Crown Hill","n":"Crown Hill Cemetery & Riley's Tomb","address":"Crown Hill Cemetery, Dr. Martin Luther King Jr. St between 32nd & 42nd Sts, Indianapolis, IN",
 "w":"555-acre cemetery and arboretum, third-largest non-government cemetery in the US; follow the white line to James Whitcomb Riley's tomb on the summit, one of the highest points in Marion County. John Dillinger and Benjamin Harrison are here too.",
 "sources":[["WIKIPEDIA",W+"James_Whitcomb_Riley"],["INDYPL","https://blog.indypl.org/kids/james-whitcomb-riley/"]]},
 g("Crown Hill Cemetery & Riley's Tomb","Crown Hill Cemetery, Dr. Martin Luther King Jr. St between 32nd & 42nd Sts, Indianapolis, IN",39.8198171,-86.1772932,"Riley tomb on the Crown Hill summit, Sec. 61 Lot 1: 39°49′11″N 86°10′38″W (Wikipedia/Find a Grave)",ss="Active cemetery, open to visitors",note="pin = the summit tomb, the visitor's destination inside the cemetery"))
add("sight",{"t":1,"a":"DTN","n":"White River State Park","address":"White River State Park, Indianapolis, IN",
 "w":"267-acre urban state park on both banks of the White River — the Central Canal walk, the zoo, Eiteljorg, Indiana State Museum, Victory Field and the old Washington Street bridge for walking.",
 "sources":[["WIKIPEDIA",W+"White_River_State_Park"],["TCLF","https://www.tclf.org/white-river-state-park"],["OFFICIAL","https://whiteriverstatepark.org/history/"]]},
 g("White River State Park","White River State Park, Indianapolis, IN",39.76667,-86.16972,"Wikipedia infobox 39°46′00″N 86°10′11″W ("+W+"White_River_State_Park)",conf="med",ss="Public park",note="park centroid"))
add("sight",{"t":1,"a":"DTN","n":"Indianapolis Zoo","address":"White River State Park, Indianapolis, IN",
 "w":"Zoo, aquarium and White River Gardens in White River State Park — dolphins, the Bicentennial orangutan centre, and the first triple-accredited zoo in the US.",
 "sources":[["WIKIPEDIA",W+"Indianapolis_Zoo"],["POLIS","https://polis.indianapolis.iu.edu/indianapolis-zoo"]]},
 g("Indianapolis Zoo","White River State Park, Indianapolis, IN",39.76694,-86.17694,"Wikipedia infobox 39°46′1″N 86°10′37″W ("+W+"Indianapolis_Zoo)",ss="Operating zoo"))
add("sight",{"t":2,"a":"DTN","n":"Indianapolis Union Station","address":"39 Jackson Place, Indianapolis, IN",
 "w":"The 1888 Romanesque Revival head-house of the world's first union station, with its barrel-vaulted Grand Hall and rose window.",
 "sources":[["WIKIPEDIA",W+"Indianapolis_Union_Station"],["NPS","https://www.nps.gov/Nr/travel/indianapolis/unionstation.htm"]]},
 g("Indianapolis Union Station","39 Jackson Place, Indianapolis, IN",39.757197,-86.156472,"Wikipedia/latitude.to 39°45'25.91\"N 86°09'23.30\"W ("+W+"Indianapolis_Union_Station)",ss="Building in use (hotel/Amtrak)"))
add("sight",{"t":2,"a":"DTN","n":"Indianapolis City Market","address":"222 E Market St, Indianapolis, IN",
 "w":"Public market since 1821 in its 1886 D.A. Bohlen & Son hall (NRHP) — now a food hall; the catacombs of the old Tomlinson Hall lie underneath.",
 "sources":[["WIKIPEDIA",W+"Indianapolis_City_Market"],["LOC","https://www.loc.gov/item/in0432"],["VISITINDIANA","https://visitindiana.com/blog/index.php/2016/01/31/indys-modern-city-market-with-a-history/"]]},
 g("Indianapolis City Market","222 E Market St, Indianapolis, IN",39.76861,-86.15333,"Wikipedia infobox 39°46′7″N 86°9′12″W ("+W+"Indianapolis_City_Market)",ss="Operating food hall (Downtown Indy listing 2026)"))
add("sight",{"t":1,"a":"DTN","n":"Scottish Rite Cathedral","address":"650 N Meridian St, Indianapolis, IN 46204",
 "w":"The 1929 Tudor-Gothic Masonic cathedral — the largest Scottish Rite building anywhere, with a 54-bell carillon tower; guided tours.",
 "sources":[["WIKIPEDIA",W+"Scottish_Rite_Cathedral_(Indianapolis)"],["INDYENCYCLOPEDIA",IE+"scottish-rite-cathedral/"],["SAHARCHIPEDIA","https://sah-archipedia.org/node/12988"]]},
 g("Scottish Rite Cathedral","650 N Meridian St, Indianapolis, IN 46204",39.7761306,-86.1579917,"Wikipedia infobox 39°46′34.07″N 86°9′28.77″W ("+W+"Scottish_Rite_Cathedral_(Indianapolis))",ss="Building in use, tours offered"))
add("sight",{"t":1,"a":"DTN","n":"Madam Walker Legacy Center","address":"617 Indiana Ave, Indianapolis, IN",
 "w":"The 1927 Madam C.J. Walker Building (NHL) on historic Indiana Avenue — her company HQ and Art Deco theatre, the heart of Black Indianapolis jazz and culture; reopened 2020 after a $15M restoration.",
 "sources":[["WIKIPEDIA",W+"Madam_Walker_Legacy_Center"],["IPM","https://www.ipm.org/show/journeyindiana/2026-02-26/walkers-legacy-inside-a-historic-theatre-the-hub-of-black-culture-in-indianapolis"],["WISH","https://wishtv.com/?p=1114137"]]},
 g("Madam Walker Legacy Center","617 Indiana Ave, Indianapolis, IN",39.775972,-86.167083,"Wikipedia infobox 39°46′33.5″N 86°10′1.5″W ("+W+"Madam_Walker_Legacy_Center)",ss="Operating venue; Indiana Public Media feature Feb 2026"))
add("sight",{"t":1,"a":"MASS","k":"Lockerbie","n":"The Athenaeum (Das Deutsche Haus)","address":"401 E Michigan St, Indianapolis, IN",
 "w":"The 1893-98 Vonnegut & Bohn German-American clubhouse — the most ornate building of German Indianapolis, still home to the Rathskeller (1894) and its biergarten.",
 "sources":[["WIKIPEDIA",W+"Athen%C3%A6um_(Das_Deutsche_Haus)"],["INDYENCYCLOPEDIA","https://indyencyclopedia.org/?p=1059"],["INDIANAHISTORY","https://discoverindianahistory.org/items/show/46"]]},
 g("The Athenaeum (Das Deutsche Haus)","401 E Michigan St, Indianapolis, IN",39.773333,-86.150278,"Wikipedia infobox 39°46′24″N 86°9′1″W ("+W+"Athen%C3%A6um_(Das_Deutsche_Haus))",ss="Building in use (Rathskeller, YMCA)"))
add("sight",{"t":1,"a":"NORTH","k":"Fishers","n":"Conner Prairie","address":"13400 Allisonville Rd, Fishers, IN",
 "w":"Smithsonian-affiliate living-history museum around William Conner's 1823 house — an 1836 prairie town, Lenape camp and the 1859 balloon voyage.",
 "sources":[["WIKIPEDIA",W+"Conner_Prairie"],["OFFICIAL","https://fishersin.gov/fishers-history-conner-prairie/"],["EXARC","https://exarc.net/venues/conner-prairie-us"]]},
 g("Conner Prairie","13400 Allisonville Rd, Fishers, IN",39.98453,-86.028864,"Wikipedia infobox 39°59′04″N 86°01′44″W ("+W+"Conner_Prairie)",ss="Operating museum (City of Fishers page)"))
# ---- food: canon ----
IM26="https://indianapolismonthly.com/the-best-restaurants-of-2026/"
UNV=lambda n,addr,ss,note="no published place coordinate found via WebSearch; queue for tools/geocode-helper.html": g(n,addr,None,None,"UNVERIFIED",conf="UNVERIFIED",ss=ss,note=note)
add("food",{"t":1,"a":"DTN","cz":["Steakhouse","Shrimp Cocktail"],"dish":"The fiery shrimp cocktail (horseradish-loaded sauce, on the menu since 1947) and dry-aged USDA Prime steaks",
 "n":"St. Elmo Steak House","address":"127 S Illinois St, Indianapolis, IN 46225",
 "w":"Indianapolis' defining restaurant, in the Wholesale District since 1902 — bow-tied career servers, dark-panelled rooms, one of the city's great bourbon lists, and the only James Beard Award ever won in Indy (America's Classics, 2012). On Indianapolis Monthly's 2026 Best Restaurants.",
 "closed":False,"sources":[["WIKIPEDIA",W+"St._Elmo_Steak_House"],["INDYMONTHLY","https://indianapolismonthly.com/best-restaurants/best-restaurants-2026-st-elmo-steak-house-wisanggeni-pawon/"],["AXIOS","https://www.axios.com/local/indianapolis/2026/07/15/30-over-30-st-elmo-steak-houses-history-of-hosting"],["TASTINGTABLE","https://www.tastingtable.com/1457397/st-elmo-steak-house-indianapolis-history"],["INDYTODAY","https://indytoday.6amcity.com/food/a-history-of-james-beard-winners-and-semifinalists-in-indy"]]},
 g("St. Elmo Steak House","127 S Illinois St, Indianapolis, IN 46225",39.764817,-86.159645,"Wikipedia infobox 39°45′53″N 86°09′35″W ("+W+"St._Elmo_Steak_House)",ss="Indianapolis Monthly Best Restaurants 2026 (Sept 2026) + Axios 30-over-30 (Jul 2026)"))
add("food",{"t":1,"a":"DTN","cz":["Jewish Deli","Deli"],"dish":"Corned beef on house rye, the Reuben, potato latkes, matzo ball soup",
 "n":"Shapiro's Delicatessen","address":"808 S Meridian St, Indianapolis, IN 46225",
 "w":"Kosher-style deli-cafeteria opened as a grocery by Louis and Rebecca Shapiro in 1905, on South Meridian since 1912 — one of the few surviving Jewish delis in the Midwest. Order at the counter; carry your tray.",
 "closed":False,"sources":[["ROADFOOD","https://roadfood.com/?p=17062"],["NUVO","https://www.nuvo.net/food/annual-manual-2019-historic-indy-dining/article_f47493c0-0ead-11e9-8794-5382f21e5f90.html"],["INDYENCYCLOPEDIA",IE+"shapiro-s/"],["VISITINDY",VI+"directory/shapiros-delicatessen/"]]},
 UNV("Shapiro's Delicatessen","808 S Meridian St, Indianapolis, IN 46225","Visit Indy + Downtown Indy directory listings (2026)"))
add("food",{"t":1,"a":"WEST","cz":["Tavern","Burgers","Tenderloin"],"dish":"The smash double cheeseburger and the breaded pork tenderloin",
 "n":"Workingman's Friend","address":"234 N Belmont Ave, Indianapolis, IN 46222",
 "w":"Haughville tavern opened in 1918 by Macedonian immigrant Louis Stamatkin and still run by his family — named for the tabs he let striking workers run. Thrillist (2015) and Food & Wine (2022) rated its burger Indiana's best. Cash only, 21+.",
 "closed":False,"sources":[["WIKIPEDIA",W+"The_Workingman%27s_Friend"],["INDYMONTHLY","https://www.indianapolismonthly.com/drinks/old-fashioneds-well-worn-well-loved-dives/"],["WISH","https://wishtv.com/?p=945952"],["FOX59","https://digital-release.fox59.com/morning-news/indys-best/the-workingmans-friend-named-indys-best-burger"]]},
 UNV("Workingman's Friend","234 N Belmont Ave, Indianapolis, IN 46222","WISH-TV 'still serving' feature + Downtown Indy listing"))
add("food",{"t":1,"a":"WEST","k":"Speedway","cz":["Hoosier","Tenderloin","Burgers"],"dish":"House-brewed root beer in a frosted mug, the pork tenderloin, hand-cut onion rings",
 "n":"Mug-n-Bun","address":"5211 W 10th St, Speedway, IN",
 "w":"Speedway's carhop drive-in since 1956 (a Frostop until 1964) a mile from the track — Indy's oldest continuously operating drive-in, with root beer brewed on site to Morris May's sweeter recipe.",
 "closed":False,"sources":[["WIKIPEDIA",W+"Mug-n-Bun"],["INDYENCYCLOPEDIA",IE+"mug-n-bun/"],["ROADFOOD","https://roadfood.com/?p=17198"],["VISITINDIANA","https://visitindiana.in.gov/blog/post/the-greatest-spectacle-in-drive-ins/"]]},
 g("Mug-n-Bun","5211 W 10th St, Speedway, IN",39.7797,-86.2488,"Wikipedia infobox 39°46′47″N 86°14′56″W ("+W+"Mug-n-Bun)",conf="med",ss="IBJ: owner seeking a buyer, restaurant operating (https://www.ibj.com/articles/mug-n-bun-owner-seeks-buyer-for-iconic-speedway-drive-in)",note="4-decimal infobox point"))
add("food",{"t":1,"a":"DTN","cz":["Bar","Southern"],"dish":"Live blues on two stages nightly, with bar food",
 "n":"Slippery Noodle Inn","address":"372 S Meridian St, Indianapolis, IN",
 "w":"Indiana's oldest continuously operating bar (1850, the Tremont House) — an Underground Railroad stop, Prohibition brewery and brothel before becoming the city's great blues bar; 1890 tin ceiling and century-old oak bar.",
 "closed":False,"sources":[["WIKIPEDIA",W+"Slippery_Noodle_Inn"],["INDYENCYCLOPEDIA",IE+"slippery-noodle-inn/"],["INDYMONTHLY","https://www.indianapolismonthly.com/food-and-drinks/slippery-noodle-haunted-history/"]]},
 g("Slippery Noodle Inn","372 S Meridian St, Indianapolis, IN",39.76167,-86.15861,"Wikipedia infobox 39°45′42″N 86°9′31″W ("+W+"Slippery_Noodle_Inn)",ss="Operating venue (jazznearyou/AARP listings)"))
add("food",{"t":1,"a":"WEST","cz":["Donuts","Bakery"],"dish":"Hot glazed yeast donuts (Carl Long's lighter dough, 1955)",
 "n":"Long's Bakery","address":"1453 N Tremont St, Indianapolis, IN 46222",
 "w":"Westside donut counter Carl and Mildred Long opened in 1955; the line for hot glazed is an Indy ritual, and the third generation still runs it. On Indianapolis Monthly's 25 Essential Eats of Indy.",
 "closed":False,"sources":[["WIKIPEDIA",W+"Long%27s_Bakery"],["INDYENCYCLOPEDIA",IE+"longs-bakery/"],["INDYMONTHLY","https://www.indianapolismonthly.com/food-and-drinks/the-25-essential-eats-of-indy/"],["INDIANAHISTORY","https://indianahistory.org/blog/producing-desire-the-heritage-of-doughnut-shops/"]]},
 g("Long's Bakery","1453 N Tremont St, Indianapolis, IN 46222",39.7876,-86.2007,"Wikipedia infobox 39°47′15″N 86°12′03″W ("+W+"Long%27s_Bakery)",conf="med",ss="Inside Indiana Business 'tradition continues' + Indianapolis Monthly 'The Feed'",note="4-decimal infobox point"))
add("food",{"t":1,"a":"BRIP","cz":["Fried Chicken","Hoosier"],"dish":"Skillet-fried chicken family style (lard, tri-flour mix) with biscuits, mashed potatoes, green beans and corn",
 "n":"Hollyhock Hill","address":"8110 N College Ave, Indianapolis, IN",
 "w":"Family-style fried-chicken dinners since 1928 — one of the last of its kind and Indiana's second-oldest restaurant; new owner Kelly Haney kept the 90-year-old recipe.",
 "closed":False,"sources":[["ROADFOOD","https://roadfood.com/?p=17648"],["FOODNETWORK","https://www.foodnetwork.com/restaurants/in/indianapolis/hollyhock-hill-restaurant"],["IBJ","https://www.ibj.com/articles/61835-hollyhock-hill-one-of-citys-oldest-eateries-changes-ownership"]]},
 UNV("Hollyhock Hill","8110 N College Ave, Indianapolis, IN","IBJ ownership change — fried chicken kept on the menu"))
add("food",{"t":2,"a":"BRIP","cz":["Pie","Bakery"],"dish":"Sugar cream pie (Indiana's state pie)",
 "n":"Taylor's Bakery","address":"6216 Allisonville Rd, Indianapolis, IN",
 "w":"Founded 1913 at 38th & Illinois and billed as Indiana's oldest bakery; at 62nd & Allisonville since 1968 — the city's go-to counter for sugar cream pie.",
 "closed":False,"sources":[["IBJ","https://www.ibj.com/articles/new-taylors-bakery-owner-plans-no-changes-at-110-year-old-business"],["CURRENT","https://youarecurrent.com/2013/02/05/hundred-year-hunger/"]]},
 UNV("Taylor's Bakery","6216 Allisonville Rd, Indianapolis, IN","IBJ: new owner plans no changes"))
add("food",{"t":2,"a":"BRIP","cz":["Bar","Tavern"],"dish":"Cold beer and a burger at Kurt Vonnegut's neighbourhood bar (1933 jukebox-and-booths tavern)",
 "n":"Red Key Tavern","address":"5170 N College Ave, Indianapolis, IN 46205",
 "w":"Meridian-Kessler tavern since 1933 (the Red Key from 1935), famous for its house rules and as a Vonnegut haunt; a Piggly Wiggly before that.",
 "closed":False,"sources":[["INDYENCYCLOPEDIA",IE+"red-key-tavern/"],["INDYMONTHLY","https://www.indianapolismonthly.com/news-opinion/a-night-at-the-red-key-tavern/"],["NUVO","https://www.nuvo.net/food/the-red-key-tavern-turns-65/article_51e1d264-adb0-502d-9f37-7523568b511f.html"],["PUNCHDRINK","https://punchdrink.com/articles/kurt-vonnegut-in-indianapolis-bars-indy/"]]},
 UNV("Red Key Tavern","5170 N College Ave, Indianapolis, IN 46205","WRTV 67th-anniversary feature"))
add("food",{"t":2,"a":"EAST","k":"Irvington","cz":["Diner","Burgers"],"dish":"Carhop burgers and the tenderloin at a 1960 drive-in",
 "n":"Historic Steer-In","address":"5130 E 10th St, Indianapolis, IN",
 "w":"Drive-in on the edge of Irvington since the 1930s (Laughner's Steer-In from 1960); Guy Fieri visited twice on Diners, Drive-Ins & Dives (2011, 2025).",
 "closed":False,"sources":[["INDYENCYCLOPEDIA",IE+"steer-in/"],["INDYMONTHLY","https://www.indianapolismonthly.com/food-and-drinks/dining/the-historic-steer-in-brings-back-the-carhop/"],["INDYTODAY","https://indytoday.6amcity.com/food/diners-drive-ins-dives-indianapolis"]]},
 UNV("Historic Steer-In","5130 E 10th St, Indianapolis, IN","Indy Today DDD roundup: still open"))
add("food",{"t":2,"a":"FSQ","cz":["Italian"],"dish":"Red-sauce pasta and meatballs",
 "n":"Iaria's Italian Restaurant","address":"317 S College Ave, Indianapolis, IN 46202",
 "w":"The Iaria family's Holy Rosary institution — a 1916 Italian grocery that became the restaurant, in this building since 1954.",
 "closed":False,"sources":[["DOWNTOWNINDY","https://downtownindy.org/go/iarias-italian-restaurant"],["IBJ","https://www.ibj.com/articles/longtime-restaurant-operator-nick-iaria-dead-at-75"]]},
 UNV("Iaria's Italian Restaurant","317 S College Ave, Indianapolis, IN 46202","Downtown Indy listing with current hours"))
add("food",{"t":1,"a":"MASS","k":"Lockerbie","cz":["German","Bar"],"dish":"Schnitzel, sauerbraten, ochsenschwanz suppe; the biergarten in summer",
 "n":"The Rathskeller","address":"401 E Michigan St, Indianapolis, IN",
 "w":"Indianapolis' oldest restaurant still operating (1894), in the cellar and biergarten of the Athenaeum — German food and a Kellerbar beer list.",
 "closed":False,"sources":[["VISITINDY",VI+"directory/the-rathskeller/"],["THETAKEOUT","https://thetakeout.com/1737075/indiana-bavarian-rathskeller-restaurant"],["WIKIPEDIA",W+"Athen%C3%A6um_(Das_Deutsche_Haus)"]]},
 g("The Rathskeller","401 E Michigan St, Indianapolis, IN",39.773333,-86.150278,"Athenaeum building, Wikipedia infobox 39°46′24″N 86°9′1″W — the Rathskeller occupies this building",conf="med",ss="Visit Indy directory listing (2026)",note="building point, not the entrance"))
add("food",{"t":1,"a":"SOUTH","cz":["Chin","Burmese"],"dish":"Sabuti (Chin white-corn and pork-bone soup) and vok ril (pork blood sausage)",
 "n":"Chin Brothers Restaurant","address":"2318 E Stop 11 Rd, Indianapolis, IN 46227",
 "w":"Than Hre's Chin kitchen — the restaurant Atlas Obscura chose to explain the food of 'Chindianapolis', the largest Chin community outside Myanmar.",
 "closed":False,"sources":[["ATLASOBSCURA","https://atlasobscura.com/articles/burmese-food-in-indianapolis"],["CULINARYCROSSROADS","https://culinarycrossroads.org/welcome-to-little-burma-a-bit-of-asia-in-central-indiana/"]]},
 UNV("Chin Brothers Restaurant","2318 E Stop 11 Rd, Indianapolis, IN 46227","Uber Eats store live (open-check only)"))
# ---- food: James Beard + Indianapolis Monthly honorees ----
JB25="https://www.jamesbeard.org/stories/the-2025-james-beard-award-semifinalists"
JB26="https://www.jamesbeard.org/stories/james-beard-award-semifinalists-2026"
IMJB="https://www.indianapolismonthly.com/food-and-drinks/indiana-nabs-seven-james-beard-nominations/"
JBH="https://indytoday.6amcity.com/food/a-history-of-james-beard-winners-and-semifinalists-in-indy"
add("food",{"t":1,"a":"MASS","k":"Old Northside","cz":["New American","Farm-to-table"],"dish":"Seasonal small plates and the wine list in a 16th Street urban cottage",
 "n":"Tinker Street","address":"402 E 16th St, Indianapolis, IN 46202",
 "w":"Tom Main's restaurant and wine bar between Herron-Morton Place and the Old Northside; Main was a James Beard Outstanding Restaurateur semifinalist (2025, 2026). An Indianapolis Monthly Best Restaurant.",
 "closed":False,"sources":[["JAMESBEARD",JB26],["INDYMONTHLY",IMJB],["WISH","https://wishtv.com/?p=1002185"],["VISITINDY",VI+"directory/tinker-street-restaurant-wine-bar/"]]},
 UNV("Tinker Street","402 E 16th St, Indianapolis, IN 46202","James Beard 2026 semifinalist (owner) + Downtown Indy listing"))
add("food",{"t":1,"a":"MASS","k":"Lockerbie","cz":["Fine Dining","Tasting Menu"],"dish":"The chef's tasting menu with wine pairings",
 "n":"Vida","address":"601 E New York St, Indianapolis, IN",
 "w":"Lockerbie Square fine dining — the city's only AAA Four Diamond restaurant per WRTV. James Beard semifinalists: chef Thomas Melvin (Best Chef: Great Lakes, 2022) and GM/wine director Jared May (beverage/bar service, 2025 & 2026).",
 "closed":False,"sources":[["JAMESBEARD",JB25],["INDYMONTHLY",IMJB],["WRTV","https://www.wrtv.com/lifestyle/food/meet-indianapolis-only-four-diamond-restaurant-vida"],["DOWNTOWNINDY","https://downtownindy.org/go/vida"]]},
 UNV("Vida","601 E New York St, Indianapolis, IN","James Beard 2026 semifinalist (Jared May) — operating"))
add("food",{"t":1,"a":"WEST","cz":["Mexican","Peruvian"],"dish":"Mexican-Peruvian fusion: ceviche, lomo saltado, tacos",
 "n":"Macizo","address":"6335 Intech Commons Dr, Suites C/D, Indianapolis, IN 46278",
 "w":"Luz and Omar Gonzalez's Mexican-Peruvian kitchen in a northwest-side office park — James Beard 2026 semifinalists for Best Chef: Great Lakes and on Indianapolis Monthly's 2026 Best Restaurants.",
 "closed":False,"sources":[["JAMESBEARD",JB26],["INDYMONTHLY","https://www.indianapolismonthly.com/best-restaurants/best-restaurants-2026-freelands-macizo/"],["WISH","https://wishtv.com/?p=1300237"]]},
 UNV("Macizo","6335 Intech Commons Dr, Suites C/D, Indianapolis, IN 46278","Indianapolis Monthly Best Restaurants 2026 (Sept 2026)"))
add("food",{"t":1,"a":"FSQ","k":"Fletcher Place","cz":["New American","Gastropub"],"dish":"The daily-changing New American menu with bread from sister bakery Amelia's",
 "n":"Bluebeard","address":"653 Virginia Ave, Indianapolis, IN",
 "w":"Fletcher Place gastropub in a 1924 warehouse, named for Kurt Vonnegut's 12th novel; Indy's most James Beard-recognised restaurant (Abbi Merriss, Best Chef: Great Lakes semifinalist 2023). Now led by chef Alan Sternberg.",
 "closed":False,"sources":[["JAMESBEARD",JBH],["INDYMONTHLY","https://www.indianapolismonthly.com/food-and-drinks/best-restaurants-2024-bluebeard/"],["IBJ","https://www.ibj.com/articles/bluebeard-chef-abbi-merriss-to-be-succeeded-by-alan-sternberg"],["WIKIPEDIA",W+"Abbi_Merriss"]]},
 UNV("Bluebeard","653 Virginia Ave, Indianapolis, IN","IBJ chef-succession story (operating) + IM Best Restaurants 2025"))
add("food",{"t":1,"a":"EAST","cz":["New American"],"dish":"Jonathan Brooks' seasonal dinner menu",
 "n":"Beholder","address":"1844 E 10th St, Indianapolis, IN",
 "w":"Jonathan Brooks' (Milktooth) dinner restaurant in Windsor Park, opened 2018; Brooks was a James Beard Best Chef: Great Lakes semifinalist in 2025.",
 "closed":False,"sources":[["JAMESBEARD",JB25],["INDYMONTHLY","https://www.indianapolismonthly.com/food-and-drinks/reviews/review-beholder/"],["IBJ","https://www.ibj.com/blogs/property-lines/69222-milktooth-chef-jonathan-brooks-opens-beholder-restaurant"]]},
 UNV("Beholder","1844 E 10th St, Indianapolis, IN","James Beard 2025 semifinalist; Indy Today: Love Handle, Beholder, Bluebeard all still open"))
add("food",{"t":1,"a":"NORTH","k":"Noblesville","cz":["New American"],"dish":"Samir Mohammad's globally inspired small menu",
 "n":"9th Street Bistro","address":"56 S 9th St, Noblesville, IN",
 "w":"Tiny Noblesville bistro opened 2021 by Samir and Rachel Mohammad; Samir was a James Beard Best Chef: Great Lakes semifinalist (2023). On Indianapolis Monthly's Best Restaurants 2025 and 2026.",
 "closed":False,"sources":[["JAMESBEARD",JBH],["INDYMONTHLY","https://www.indianapolismonthly.com/best-restaurants/best-restaurants-2025-9th-street-bistro-bluebeard/"],["CURRENT","https://www.youarecurrent.com/2022/02/07/labor-of-love-couple-own-and-operate-new-noblesville-restaurant-9th-street-bistro/"]]},
 UNV("9th Street Bistro","56 S 9th St, Noblesville, IN","Indianapolis Monthly Best Restaurants 2026 (Sept 2026)"))
add("food",{"t":1,"a":"MASS","cz":["Fried Chicken","Sandwiches"],"dish":"Fried chicken and the meat-forward sandwiches",
 "n":"Love Handle","address":"877 Massachusetts Ave, Indianapolis, IN 46202",
 "w":"Ten-plus years of house-butchered fried chicken and sandwiches, now on Mass Ave after leaving 10th Street; a James Beard semifinalist pick and an Indianapolis Monthly Best Restaurant.",
 "closed":False,"sources":[["JAMESBEARD",JBH],["INDYMONTHLY","https://www.indianapolismonthly.com/food-and-drinks/dining/love-handle-2/"],["EDIBLEINDY","https://edibleindy.ediblecommunities.com/eat/meats-and-sweets"],["DOWNTOWNINDY","https://downtownindy.org/go/love-handle"]]},
 UNV("Love Handle","877 Massachusetts Ave, Indianapolis, IN 46202","Downtown Indy listing at Mass Ave address (2026)"))
add("food",{"t":1,"a":"EAST","cz":["Soul Food","BBQ"],"dish":"Fried chicken and waffles, hickory rib tips, bourbon creamed corn, collards",
 "n":"His Place Eatery","address":"6916 E 30th St, Indianapolis, IN",
 "w":"James and Shawn Jones' soul food since 2009 (at 30th & Shadeland since 2012; second branch on W 86th St) — on Guy Fieri's Diners, Drive-Ins & Dives and Indianapolis Monthly's 2026 Best Restaurants.",
 "closed":False,"sources":[["INDYMONTHLY","https://www.indianapolismonthly.com/food-and-drinks/best-restaurants-2026-commission-row-his-place-eatery/"],["WTHR","https://wthr.com/article/life/food/his-place-eatery-guy-fieri-diners-drive-ins-dives-food-network-soul-food-indianapolis-indiana/531-f8caa555-b01d-4f2e-aae7-0aec12445ddd"],["WRTV","https://www.wrtv.com/lifestyle/black-history-month/his-place-eatery-brings-soul-food-with-a-twist-to-indianapolis"]]},
 UNV("His Place Eatery","6916 E 30th St, Indianapolis, IN","Indianapolis Monthly Best Restaurants 2026 (Sept 2026)"))
# ---- sights batch 2 ----
add("sight",{"t":1,"a":"MASS","k":"Old Northside","n":"Benjamin Harrison Presidential Site","address":"1230 N Delaware St, Indianapolis, IN 46202",
 "w":"The 23rd president's 16-room 1875 Italianate home (NHL 1964) — he ran the 1888 Front Porch Campaign from its porch and died upstairs in 1901. Guided tours.",
 "sources":[["WIKIPEDIA",W+"Benjamin_Harrison_Presidential_Site"],["NPS","https://www.nps.gov/parkhistory/online_books/presidents/site21.htm"],["INDYENCYCLOPEDIA",IE+"benjamin-harrison-presidential-site/"]]},
 g("Benjamin Harrison Presidential Site","1230 N Delaware St, Indianapolis, IN 46202",39.783967,-86.154156,"HMdb marker at the site 39° 47.042′ N, 86° 9.254′ W (https://www.hmdb.org/m.asp?m=122216)",conf="med",ss="Operating house museum (Visit Indiana / Downtown Indy 2026)",note="historical-marker point in front of the house"))
add("sight",{"t":1,"a":"MASS","k":"Lockerbie","n":"James Whitcomb Riley Museum Home","address":"528 Lockerbie St, Indianapolis, IN",
 "w":"The 1872 Lockerbie Square house where the 'Hoosier Poet' lived as a paying guest from 1893 until 1916 — preserved as he left it (NHL 1962), on the cobbled heart of Indy's oldest neighbourhood.",
 "sources":[["WIKIPEDIA",W+"James_Whitcomb_Riley_Museum_Home"],["INDYENCYCLOPEDIA",IE+"james-whitcomb-riley-home"],["SAHARCHIPEDIA","https://sah-archipedia.org/node/12971"]]},
 g("James Whitcomb Riley Museum Home","528 Lockerbie St, Indianapolis, IN",39.77194,-86.14778,"Wikipedia infobox 39°46′19″N 86°8′52″W ("+W+"James_Whitcomb_Riley_Museum_Home)",ss="Operating house museum"))
add("sight",{"t":1,"a":"SOUTH","n":"Garfield Park & Conservatory","address":"2505 Conservatory Dr, Indianapolis, IN 46203",
 "w":"Indianapolis' oldest city park (128 acres, NRHP) — George Kessler's 1916 Sunken Garden with fountains, and the 1954 aluminium-framed conservatory, the first of its kind in the US.",
 "sources":[["WIKIPEDIA",W+"Garfield_Park_(Indianapolis)"],["NPS","https://www.nps.gov/NR/travel/indianapolis/garfieldpark.htm"],["OFFICIAL","https://parks.indy.gov/facilities/garfield-park-conservatory-sunken-garden/"]]},
 g("Garfield Park & Conservatory","2505 Conservatory Dr, Indianapolis, IN 46203",39.7320806,-86.1420194,"Wikipedia infobox 39°43′55.49″N 86°08′31.27″W ("+W+"Garfield_Park_(Indianapolis))",conf="med",ss="Indy Parks facility page (2026)",note="park point; conservatory is on the park's east side"))
add("sight",{"t":1,"a":"FSQ","k":"Fountain Square","n":"Fountain Square Theatre Building","address":"Fountain Square Theatre Building, Shelby St at Virginia Ave, Fountain Square, Indianapolis, IN",
 "w":"1928 theatre block anchoring Fountain Square — a hotel, rooftop, and the Midwest's only duckpin bowling (Atomic Bowl's 1950s lanes, Action Duckpin's 1930s ones).",
 "sources":[["WIKIPEDIA",W+"Fountain_Square_Theatre"],["NPS","https://www.nps.gov/nr/Travel/indianapolis/vaave.htm"],["ROADSIDEAMERICA","https://origin.roadsideamerica.com/tip/8074"]]},
 g("Fountain Square Theatre Building","Fountain Square Theatre Building, Shelby St at Virginia Ave, Fountain Square, Indianapolis, IN",39.7521,-86.1396,"Wikipedia infobox 39°45′08″N 86°08′23″W ("+W+"Fountain_Square_Theatre)",conf="med",ss="Building in use (hotel, bowling)",note="4-decimal infobox point"))
add("sight",{"t":1,"a":"MID","k":"Butler","n":"Hinkle Fieldhouse","address":"510 W 49th St, Indianapolis, IN",
 "w":"Butler's 1928 fieldhouse (NHL), once the largest basketball arena in the US — where Milan beat Muncie Central in 1954, the game that became 'Hoosiers'.",
 "sources":[["WIKIPEDIA",W+"Hinkle_Fieldhouse"],["SAHARCHIPEDIA","https://sah-archipedia.org/node/12986"],["OFFICIAL","https://butlersports.com/sports/2016/5/19/information-facilities-hinkle-fieldhouse.aspx"]]},
 g("Hinkle Fieldhouse","510 W 49th St, Indianapolis, IN",39.84361,-86.16722,"Wikipedia infobox 39°50′37″N 86°10′2″W ("+W+"Hinkle_Fieldhouse)",ss="Active Butler athletics venue"))
add("sight",{"t":1,"a":"WEST","n":"Eagle Creek Park","address":"7840 W 56th St, Indianapolis, IN",
 "w":"One of the largest city parks in the US — a reservoir, nature centre, bird sanctuary, beach and trails on the northwest side.",
 "sources":[["WIKIPEDIA",W+"Eagle_Creek_Park"],["VISITINDIANA","https://visitindiana.in.gov/blog/post/eagle-creek-park/"],["VISITINDY",VI+"directory/eagle-creek-trail/"]]},
 g("Eagle Creek Park","7840 W 56th St, Indianapolis, IN",39.855,-86.2975,"Wikipedia infobox 39°51′18″N 86°17′51″W ("+W+"Eagle_Creek_Park)",conf="med",ss="Indy Parks property, open",note="park centroid"))
add("sight",{"t":2,"a":"WEST","n":"Indiana Medical History Museum","address":"3045 W Vermont St, Indianapolis, IN 46222",
 "w":"The 1895 Old Pathology Building of Central State Hospital — the oldest surviving pathology lab in the US, with its teaching amphitheatre and specimen collection intact.",
 "sources":[["WIKIPEDIA",W+"Indiana_Medical_History_Museum"],["INDYENCYCLOPEDIA",IE+"indiana-medical-history-museum/"],["VISITINDIANA","https://visitindiana.in.gov/blog/post/medical-museum/"]]},
 g("Indiana Medical History Museum","3045 W Vermont St, Indianapolis, IN 46222",39.77,-86.21333,"Wikipedia infobox 39°46′12″N 86°12′48″W ("+W+"Indiana_Medical_History_Museum)",conf="med",ss="Operating museum"))
add("sight",{"t":1,"a":"EAST","k":"Irvington","n":"Irvington Historic District & Bona Thompson Center","address":"5350 E University Ave, Indianapolis, IN",
 "w":"Butler University's first campus village (1875-1928) of curving streets and Victorian houses; the 1903 Bona Thompson Memorial Center holds the Irvington Historical Society. Famous for its October Halloween festival.",
 "sources":[["WIKIPEDIA",W+"Irvington_Historic_District_(Indianapolis)"],["NPS","https://www.nps.gov/nr/Travel/indianapolis/irvington.htm"],["INDYENCYCLOPEDIA",IE+"bona-thompson-center/"]]},
 g("Irvington Historic District & Bona Thompson Center","5350 E University Ave, Indianapolis, IN",39.7665,-86.0768,"Wikipedia infobox (Bona Thompson Memorial Center) 39°45′59″N 86°04′36″W ("+W+"Bona_Thompson_Memorial_Center)",ss="Irvington Historical Society, open"))
add("sight",{"t":2,"a":"EAST","n":"Fort Harrison State Park","address":"Fort Harrison State Park, Lawrence (Marion County), IN",
 "w":"1,700 acres of the former Fort Benjamin Harrison along Fall Creek — trails, a saddle barn and the historic officers' homes; run by Indiana DNR.",
 "sources":[["WIKIPEDIA",W+"Fort_Harrison_State_Park"],["INDYENCYCLOPEDIA","https://indyencyclopedia.org/?p=2071"],["CURRENT","https://www.youarecurrent.com/2022/08/29/city-centerpiece-forts-history-amenities-a-major-draw-for-lawrence/"]]},
 g("Fort Harrison State Park","Fort Harrison State Park, Lawrence (Marion County), IN",39.867,-86.017,"Wikipedia infobox 39°52′N 86°01′W ("+W+"Fort_Harrison_State_Park) — minute precision",conf="low",ss="Indiana DNR state park, open",note="LOW: minute-precision park point; address from DNR not yet search-verified — re-verify"))
# ---- sights batch 3 ----
HC="https://www.visithamiltoncounty.com/"
add("sight",{"t":1,"a":"NORTH","k":"Noblesville","n":"Hamilton County Courthouse Square","address":"Courthouse Square (Logan, 8th, 9th & Conner Sts), Noblesville, IN",
 "w":"1870s Second Empire courthouse and sheriff's residence/jail (NRHP) at the centre of Noblesville's historic square — where Klan Grand Dragon D.C. Stephenson was convicted of murder in 1925, breaking the Indiana Klan.",
 "sources":[["WIKIPEDIA",W+"Hamilton_County_Courthouse_Square"],["NPS","https://npgallery.nps.gov/GetAsset/d8626401-6673-4cc5-b04b-fe7f1e18d34c"],["INDYENCYCLOPEDIA",IE+"noblesville/"]]},
 g("Hamilton County Courthouse Square","Courthouse Square (Logan, 8th, 9th & Conner Sts), Noblesville, IN",40.04583,-86.01417,"Wikipedia infobox 40°2′45″N 86°00′51″W ("+W+"Hamilton_County_Courthouse_Square)",ss="County courthouse in use"))
add("sight",{"t":1,"a":"BRIP","k":"Broad Ripple","n":"Indy Art Center & ARTSPARK","address":"Indy Art Center, White River at Broad Ripple Village, Indianapolis, IN",
 "w":"Michael Graves-designed art centre (1996) on the White River with studios, galleries and the 9.5-acre ARTSPARK sculpture garden; hosts the long-running Broad Ripple Art Fair.",
 "sources":[["WIKIPEDIA",W+"Indy_Art_Center"],["NUVO","https://www.nuvo.net/townnews/art/celebrating-fifty-years-of-a-fine-idea-oneamerica-broad-ripple-art-fair-may-14-and/article_1ad0ea54-c5a9-11ec-a2ee-cb3cf2aed114.html"],["OFFICIAL","https://indyartcenter.org/about-us/"]]},
 g("Indy Art Center & ARTSPARK","Indy Art Center, White River at Broad Ripple Village, Indianapolis, IN",39.877807,-86.143639,"Wikipedia infobox 39°52′40″N 86°08′37″W ("+W+"Indy_Art_Center)",ss="Operating art centre (official site)"))
add("sight",{"t":1,"a":"BRIP","k":"Broad Ripple","n":"Broad Ripple Village","address":"Broad Ripple Village (White River, Evanston Ave, Kessler Blvd & Meridian St), Indianapolis, IN",
 "w":"The 1837 canal town six miles north of downtown, annexed in 1922 and now a designated cultural district — bars, the Central Canal towpath and the Monon Trail crossing.",
 "sources":[["WIKIPEDIA",W+"Broad_Ripple_Village,_Indianapolis"],["INDYENCYCLOPEDIA",IE+"broad-ripple/"],["POLIS","https://polis.indianapolis.iu.edu/?p=21"]]},
 g("Broad Ripple Village","Broad Ripple Village (White River, Evanston Ave, Kessler Blvd & Meridian St), Indianapolis, IN",39.866667,-86.141667,"Wikipedia infobox 39°52′00″N 86°8′30″W ("+W+"Broad_Ripple_Village,_Indianapolis)",conf="low",ss="Neighbourhood",note="LOW: neighbourhood centroid at minute/half-minute precision"))
add("sight",{"t":2,"a":"BRIP","n":"Holliday Park & The Ruins","address":"6363 Spring Mill Rd, Indianapolis, IN 46260",
 "w":"Riverside park whose 'Ruins' reassemble Karl Bitter's 'Races of Man' statues from New York's first skyscraper, the St. Paul Building — restored and reopened; nature centre and trails.",
 "sources":[["TCLF","https://www.tclf.org/holliday-park"],["INDYENCYCLOPEDIA",IE+"holliday-park/"],["IPM","https://www.ipm.org/show/theinbox/2019-03-12/revived-ruins-in-indys-holliday-park"],["OFFICIAL","https://parks.indy.gov/?p=1062"]]},
 UNV("Holliday Park & The Ruins","6363 Spring Mill Rd, Indianapolis, IN 46260","Indy Parks page"))
add("sight",{"t":2,"a":"MID","k":"Butler","n":"Holcomb Observatory & Planetarium","address":"4600 Sunset Ave, Indianapolis, IN",
 "w":"Butler's 1954 observatory with a 38-inch Cassegrain reflector — the largest telescope in Indiana open to the public; planetarium shows and public viewing nights.",
 "sources":[["WIKIPEDIA",W+"Holcomb_Observatory_and_Planetarium"],["INDIANAHISTORY","https://digital.library.in.gov/Record/PALNI_BldgsGrnds-2798"]]},
 g("Holcomb Observatory & Planetarium","4600 Sunset Ave, Indianapolis, IN",39.84139,-86.17139,"Wikipedia infobox 39°50′29″N 86°10′17″W ("+W+"Holcomb_Observatory_and_Planetarium)",ss="Wikipedia infobox status: Open"))
add("sight",{"t":1,"a":"DTN","n":"Lucas Oil Stadium","address":"500 S Capitol Ave, Indianapolis, IN",
 "w":"Retractable-roof home of the Colts (2008) and of the NFL Combine, Final Fours and Big Ten title games.",
 "sources":[["WIKIPEDIA",W+"Lucas_Oil_Stadium"],["STRUCTURAE","https://structurae.net/de/bauwerke/lucas-oil-stadium"]]},
 g("Lucas Oil Stadium","500 S Capitol Ave, Indianapolis, IN",39.760056,-86.163806,"Wikipedia infobox 39°45′36.2″N 86°9′49.7″W ("+W+"Lucas_Oil_Stadium)",ss="Active NFL venue"))
add("sight",{"t":2,"a":"DTN","n":"Gainbridge Fieldhouse","address":"125 S Pennsylvania St, Indianapolis, IN",
 "w":"The Pacers' and Fever's retro-styled 1999 fieldhouse, built to evoke Indiana high-school gyms.",
 "sources":[["WIKIPEDIA",W+"Gainbridge_Fieldhouse"],["INDYENCYCLOPEDIA","https://indyencyclopedia.org/?p=58658"]]},
 g("Gainbridge Fieldhouse","125 S Pennsylvania St, Indianapolis, IN",39.76389,-86.15556,"Wikipedia infobox 39°45′50″N 86°9′20″W ("+W+"Gainbridge_Fieldhouse)",ss="Active NBA/WNBA venue"))
add("sight",{"t":2,"a":"DTN","n":"Central Library","address":"40 E St. Clair St, Indianapolis, IN",
 "w":"Paul Cret's 1917 Beaux-Arts library on the War Memorial axis, joined to a six-storey glass atrium (2007); free, with the Vonnegut-era reading rooms.",
 "sources":[["WIKIPEDIA",W+"Central_Library_(Indianapolis)"],["INDYPL","https://indypl.org/locations/central-library"],["NPS","https://npgallery.nps.gov/GetAsset/1356a2c9-be38-44cb-b774-c35c71f3d021"]]},
 g("Central Library","40 E St. Clair St, Indianapolis, IN",39.77833,-86.15667,"Wikipedia infobox 39°46′42″N 86°9′24″W ("+W+"Central_Library_(Indianapolis))",ss="Operating public library (IndyPL locations page)"))
add("sight",{"t":1,"a":"MASS","n":"Landmark for Peace Memorial","address":"Dr. Martin Luther King Jr. Park, 1702 N Broadway St, Indianapolis, IN",
 "w":"Where Robert F. Kennedy broke the news of Martin Luther King Jr.'s assassination to a crowd on April 4, 1968 — Greg Perry's 1994 sculpture shows the two men reaching toward each other. Dedicated by President Clinton in 1995.",
 "sources":[["WIKIPEDIA",W+"Landmark_for_Peace_Memorial"],["INDYARTS","https://indyarts.org/?p=9278"],["INDYENCYCLOPEDIA",IE+"kennedy-king-national-commemorative-site/"],["VISITINDY",VI+"directory/dr-martin-luther-king-jr-park-landmark-for-peace-memorial/"]]},
 g("Landmark for Peace Memorial","Dr. Martin Luther King Jr. Park, 1702 N Broadway St, Indianapolis, IN",39.79077,-86.14637,"Wikipedia infobox 39°47′27″N 86°08′47″W ("+W+"Landmark_for_Peace_Memorial)",ss="Public park memorial"))
add("sight",{"t":1,"a":"DTN","n":"Indianapolis Cultural Trail","address":"Downtown loop (Alabama St / Mass Ave / Virginia Ave / Indiana Ave), Indianapolis, IN",
 "w":"8-mile brick-and-stone bike/walk trail linking the downtown cultural districts with public art along the way — a $63M model for US urban trails. Pin marks a central point on the loop.",
 "sources":[["WIKIPEDIA",W+"Indianapolis_Cultural_Trail"],["INDYENCYCLOPEDIA",IE+"indianapolis-cultural-trail/"],["IBJ","https://www.ibj.com/articles/41145-defining-the-indianapolis-cultural-trail"]]},
 g("Indianapolis Cultural Trail","Downtown loop (Alabama St / Mass Ave / Virginia Ave / Indiana Ave), Indianapolis, IN",39.776861,-86.160944,"Wikipedia infobox 39°46′36.7″N 86°09′39.4″W ("+W+"Indianapolis_Cultural_Trail)",conf="med",ss="Public trail",note="linear feature; infobox point"))
add("sight",{"t":2,"a":"DTN","n":"Christ Church Cathedral","address":"131 Monument Circle, Indianapolis, IN",
 "w":"William Tinsley's 1857 English Gothic Revival church — the oldest building on Monument Circle.",
 "sources":[["WIKIPEDIA",W+"Christ_Church_Cathedral_(Indianapolis)"],["NPS","https://www.nps.gov/Nr/travel/indianapolis/christchurch.html"],["SAHARCHIPEDIA","https://sah-archipedia.org/node/12970"]]},
 UNV("Christ Church Cathedral","131 Monument Circle, Indianapolis, IN","Active Episcopal cathedral"))
add("sight",{"t":1,"a":"DTN","n":"Crispus Attucks Museum","address":"1140 Dr. Martin Luther King Jr. St, Indianapolis, IN",
 "w":"Inside Crispus Attucks High School — Indiana's segregated Black high school, whose Oscar Robertson-led team won the 1955 state title — four galleries of African American history from the Underground Railroad to the Tuskegee Airmen.",
 "sources":[["WIKIPEDIA",W+"Crispus_Attucks_Museum"],["WISH","https://www.wishtv.com/community/celebrating-black-history/celebrating-black-history-crispus-attucks-museum/"],["VISITINDIANA","https://visitindiana.in.gov/basketball/locations/crispus-attucks-museum/"]]},
 g("Crispus Attucks Museum","1140 Dr. Martin Luther King Jr. St, Indianapolis, IN",39.783056,-86.17,"Wikipedia infobox 39°46′59″N 86°10′12″W ("+W+"Crispus_Attucks_Museum)",ss="Operating IPS museum"))
add("sight",{"t":2,"a":"NORTH","k":"Carmel","n":"The Palladium (Center for the Performing Arts)","address":"Center for the Performing Arts, Carmel, IN",
 "w":"Carmel's 1,500-seat Palladium concert hall (2011), a Palladian domed hall at the heart of the Carmel City Center arts campus.",
 "sources":[["WIKIPEDIA",W+"The_Palladium_at_the_Center_for_the_Performing_Arts"],["INDYMONTHLY","https://www.indianapolismonthly.com/arts-and-culture/the-sound-of-money-the-palladium-rises-up-in-carmel/"],["HAMILTONCOUNTY",HC+"things-to-do/arts-and-theater/center-of-performing-arts/"]]},
 UNV("The Palladium (Center for the Performing Arts)","Center for the Performing Arts, Carmel, IN","Visit Hamilton County listing"))
add("sight",{"t":2,"a":"NORTH","k":"Carmel","n":"Coxhall Gardens","address":"11677 Towne Rd, Carmel, IN 46032",
 "w":"125-acre Hamilton County park at 116th & Towne with formal gardens, a carillon bell tower and a historic Woodward-era house.",
 "sources":[["HAMILTONCOUNTY",HC+"blog/stories/post/a-guide-to-coxhall-gardens-in-carmel-indiana/"],["CURRENT","https://youarecurrent.com/type/gallery/page/129/"]]},
 UNV("Coxhall Gardens","11677 Towne Rd, Carmel, IN 46032","Visit Hamilton County guide"))
add("sight",{"t":2,"a":"NORTH","k":"Zionsville","n":"Zionsville Village (brick Main Street)","address":"Main St, Zionsville, IN",
 "w":"The Village's all-brick Main Street — one of the region's few original brick-paved streets, protected as a historic district and an Indiana Main Street town (2025); boutiques and cafés.",
 "sources":[["INDYENCYCLOPEDIA",IE+"zionsville"],["CURRENT","https://www.youarecurrent.com/2025/03/31/it-takes-a-village-zionsville-celebrates-indiana-main-street-designation/"]]},
 UNV("Zionsville Village (brick Main Street)","Main St, Zionsville, IN","Indiana Main Street designation, March 2025"))
# ---- food batch 3 ----
IM25EV="https://www.wrtv.com/?p=2639852"
add("food",{"t":1,"a":"BRIP","k":"Broad Ripple","cz":["Tenderloin","Tavern"],"dish":"The oversized breaded pork tenderloin",
 "n":"Plump's Last Shot","address":"6416 Cornell Ave, Indianapolis, IN",
 "w":"Broad Ripple sports bar run since 1995 by Bobby Plump — whose last-second shot won Milan's 1954 title, the story behind 'Hoosiers' — and now his son Jonathan; its tenderloin has been named Indiana's best.",
 "closed":False,"sources":[["ROADFOOD","https://roadfood.com/?p=17633"],["FOXNEWS","https://foxnews.com/lifestyle/hoops-hero-who-inspired-hoosiers-now-serves-legendarily-large-indiana-style-fried-pork-sandwiches.amp"],["WIKIPEDIA",W+"Bobby_Plump"]]},
 UNV("Plump's Last Shot","6416 Cornell Ave, Indianapolis, IN","Fox News feature: son Jonathan runs the operation"))
add("food",{"t":1,"a":"WEST","cz":["Latin American","Argentine"],"dish":"Choripán (Argentine chorizo, chimichurri), empanadas, milanesas",
 "n":"Che Chori","address":"3124 W 16th St, Indianapolis, IN",
 "w":"Marcos Perera's westside Argentine counter near the Speedway — on Diners, Drive-Ins & Dives (Aug 2024) and Indianapolis Monthly's 2025 Best Restaurants.",
 "closed":False,"sources":[["MIRROR","https://mirrorindy.org/indy-westside-che-chori-diners-drive-ins-dives-guy-fieri/"],["WRTV","https://wrtv.com/news/local-news/local-argentinian-restaurant-chechori-to-appear-on-food-networks-diners-drive-ins-and-dives"],["INDYTODAY","https://indytoday.6amcity.com/culture/diners-drive-ins-and-dives-che-chori"],["WISH","https://wishtv.com/?p=1201100"]]},
 UNV("Che Chori","3124 W 16th St, Indianapolis, IN","Indianapolis Monthly 2025 Best Restaurants event participant (WRTV)"))
add("food",{"t":1,"a":"BRIP","k":"Meridian-Kessler","cz":["Pie","Sugar Cream Pie"],"dish":"The Sugar Crème Brûlée Pie — a torched-top take on Hoosier sugar cream pie",
 "n":"Pots & Pans Pie Co.","address":"4915 N College Ave, Indianapolis, IN",
 "w":"Clarissa Morley's pie shop (farmers markets from 2016, storefront 2018) — the best place for sugar cream pie in the city today; on Indianapolis Monthly's 2025 Best Restaurants.",
 "closed":False,"sources":[["INDYTODAY","https://indytoday.6amcity.com/food/where-to-buy-the-perfect-pie-around-indianapolis"],["WRTV",IM25EV],["FOX59","https://digital-release.fox59.com/indiana-news/indianapolis-bakery-named-best-place-for-pie-in-the-state"]]},
 UNV("Pots & Pans Pie Co.","4915 N College Ave, Indianapolis, IN","Indianapolis Monthly 2025 Best Restaurants event participant (WRTV, Sept 2025)"))
add("food",{"t":1,"a":"BRIP","cz":["Fine Dining","New American"],"dish":"Steven Oakley's seasonal New American menu",
 "n":"Oakleys Bistro","address":"1464 W 86th St, Indianapolis, IN",
 "w":"Northside bistro Steven Oakley opened in 2002; Oakley was a James Beard Best Chef semifinalist four times (2008, 2011, 2018, 2019). Indianapolis Monthly Best Restaurant (2025).",
 "closed":False,"sources":[["INDYMONTHLY","https://www.indianapolismonthly.com/food-and-drinks/dining/four-james-beard-foundation-semifinalist-nominations-for-indianapolis/"],["IBJ","https://www.ibj.com/articles/72702-three-from-indianapolis-named-james-beard-semifinalists"],["VISITINDY",VI+"directory/oakleys-bistro/"],["WRTV",IM25EV]]},
 UNV("Oakleys Bistro","1464 W 86th St, Indianapolis, IN","Indianapolis Monthly 2025 Best Restaurants event participant (WRTV)"))
add("food",{"t":1,"a":"FSQ","k":"Fountain Square","cz":["Sandwiches","Italian","Tenderloin"],"dish":"The 'Triple P' tenderloin (double Berkshire cutlets, pepper jack, candied bacon, bacon jam) and house salumi",
 "n":"Turchetti's Delicatessen","address":"1110 Prospect St, Indianapolis, IN",
 "w":"George Turkette's whole-animal Italian butcher and deli in Fountain Square — house salami and smoked bacon; his Triple P leads Indianapolis Monthly's tenderloin guide.",
 "closed":False,"sources":[["INDYMONTHLY","https://www.indianapolismonthly.com/food-and-drinks/the-best-spots-for-satisfying-indianas-unhealthy-obsession-the-pork-tenderloin/"],["WISH","https://wishtv.com/news/local-news/indiana-grown-turchettis"],["INDYTODAY","https://indytoday.6amcity.com/best-sandwiches-in-indianapolis-in"]]},
 UNV("Turchetti's Delicatessen","1110 Prospect St, Indianapolis, IN","Toast online ordering live (open-check)"))
add("food",{"t":1,"a":"NORTH","k":"Carmel","cz":["Fine Dining","Southern"],"dish":"Shrimp and Jimmy Red corn grits with brandied bisque; escargot vol-au-vent",
 "n":"Freeland's","address":"875 Freeland Way, Carmel, IN",
 "w":"Tom Main's (Tinker Street) fine dining in 'The Maples', an 1845 house at Carmel's North End — a community where 40 apartments are set aside for adults with developmental disabilities, whom the restaurant employs. Main: James Beard restaurateur semifinalist 2025/2026; IM Best Restaurants 2026.",
 "closed":False,"sources":[["JAMESBEARD",JB26],["INDYMONTHLY","https://www.indianapolismonthly.com/best-restaurants/best-restaurants-2026-freelands-macizo/"],["CURRENT","https://youarecurrent.com/2025/01/15/freelands-restaurant-to-open-in-north-ends-historic-house/"],["IBJ","https://www.ibj.com/articles/house-warming"]]},
 UNV("Freeland's","875 Freeland Way, Carmel, IN","Indianapolis Monthly Best Restaurants 2026 (Sept 2026)"))
add("food",{"t":1,"a":"BRIP","cz":["New American","Farm-to-table"],"dish":"Kennebec fries in bone-marrow butter; chicken schnitzel with beurre blanc",
 "n":"Late Harvest Kitchen","address":"8605 River Crossing Blvd, Indianapolis, IN 46240",
 "w":"Ryan Nelson's farm-to-table room near Keystone at the Crossing, 15 years running — on Indianapolis Monthly's Best Restaurants 2025 and 2026.",
 "closed":False,"sources":[["INDYMONTHLY","https://www.indianapolismonthly.com/best-restaurants/best-restaurants-2026-freelands-macizo/"],["WISH","https://wishtv.com/?p=737518"],["WRTV",IM25EV]]},
 UNV("Late Harvest Kitchen","8605 River Crossing Blvd, Indianapolis, IN 46240","Indianapolis Monthly Best Restaurants 2026 (Sept 2026)"))
add("food",{"t":2,"a":"SOUTH","cz":["Hoosier","Tenderloin"],"dish":"The half-pound breaded pork tenderloin (Man v. Food, 2010)",
 "n":"Edwards Drive-In","address":"2126 S Sherman Dr, Indianapolis, IN","closed":True,
 "w":"South-side drive-in opened as a Dog n Suds in 1957 and famous for its half-pound tenderloin (Man v. Food, 2010). CLOSED 8 Jan 2022 after 64 years — pandemic strain; its Dashboard Diner food truck carried on.",
 "sources":[["WTHR","https://wthr.com/article/news/local/edwards-drive-in-permanently-closes-64-years-covid-pandemic-dashboard-diner/531-00cbc76b-3eed-411b-9898-529c8d15cae0"],["IBJ","https://www.ibj.com/articles/pandemic-stresses-and-demands-blamed-in-edwards-drive-in-closure"],["WISH","https://wishtv.com/?p=689037"]]},
 g("Edwards Drive-In","2126 S Sherman Dr, Indianapolis, IN",None,None,"UNVERIFIED",conf="UNVERIFIED",status="closed",ss="WTHR: permanently closed after 64 years, last day Jan 8 2022 (https://wthr.com/article/news/local/edwards-drive-in-permanently-closes-64-years-covid-pandemic-dashboard-diner/531-00cbc76b-3eed-411b-9898-529c8d15cae0)"))
add("food",{"t":1,"a":"DTN","cz":["Brewery"],"dish":"Sunlight Cream Ale and Osiris Pale Ale in the production-floor taproom",
 "n":"Sun King Brewing","address":"135 N College Ave, Indianapolis, IN",
 "w":"Indianapolis' largest brewery (2009) in the Cole-Noble district by Lockerbie — all-ages taproom with 25+ taps and tours.",
 "closed":False,"sources":[["WIKIPEDIA",W+"Sun_King_Brewing"],["DOWNTOWNINDY","https://downtownindy.org/go/sun-king-brewing-co"],["IBJ","https://www.ibj.com/articles/49082-sun-king-plans-8-8m-brewery-tasting-room-in-fishers"]]},
 g("Sun King Brewing","135 N College Ave, Indianapolis, IN",39.769028,-86.144824,"kineticist.com location record for 135 N College Ave (aggregator, not a !3d!4d pin)",conf="med",ss="Downtown Indy listing (2026)",note="aggregator decimal point — re-verify in placement pass"))
# ---- food batch 4 ----
add("food",{"t":2,"a":"EAST","cz":["Pizza"],"dish":"Wood-fired sourdough pies, the hot-honey pizza",
 "n":"King Dough","address":"452 N Highland Ave, Indianapolis, IN 46202",
 "w":"Wood-oven sourdough pizza in a rehabbed Holy Cross building on the near east side — an Indianapolis Monthly Best Restaurant.",
 "closed":False,"sources":[["INDYMONTHLY","https://www.indianapolismonthly.com/food-and-drinks/dining/review-king-dough/"],["IBJ","https://www.ibj.com/blogs/property-lines/71353-king-dough-restaurant-coming-to-long-vacant-holy-cross-property"],["WISH","https://wishtv.com/?p=1002185"]]},
 UNV("King Dough","452 N Highland Ave, Indianapolis, IN 46202","Bloomingtonian: Bloomington closed, Indy location remains open; IM 'top picks' 2025"))
add("food",{"t":1,"a":"NORTH","k":"Carmel","cz":["Steakhouse","New American"],"dish":"Montana-ranch-inspired steaks, duck and lamb",
 "n":"Lone Pine","address":"710 S Rangeline Rd, Carmel, IN",
 "w":"Beholder partner and sommelier Josh Mazanowski's first solo restaurant, inspired by his family's Montana ranch — Indianapolis Monthly Best Restaurants 2025 and 2026.",
 "closed":False,"sources":[["INDYMONTHLY","https://www.indianapolismonthly.com/best-restaurants/best-restaurants-2026-freelands-macizo/"],["IBJ","https://www.ibj.com/articles/carmel-city-center-getting-two-new-steakhouses"],["HAMILTONCOUNTY",HC+"blog/post/hot-new-restaurants-in-hamilton-county/"]]},
 UNV("Lone Pine","710 S Rangeline Rd, Carmel, IN","Indianapolis Monthly Best Restaurants 2026 (Sept 2026)"))
add("food",{"t":1,"a":"FSQ","k":"Fletcher Place","cz":["Brunch","Southern"],"dish":"The Dutch baby pancake and loaded grits; meat-and-three plates",
 "n":"Milktooth (arlene's by Milktooth)","address":"534 Virginia Ave, Indianapolis, IN",
 "w":"Jonathan Brooks' chef-driven brunch room in a converted garage, the restaurant that put Indy brunch on national lists (Brooks: James Beard semifinalist). Briefly became Arlene's meat-and-three in 2026, now back as 'arlene's by Milktooth'; walk-in only, Thu-Mon.",
 "closed":False,"sources":[["IBJ","https://www.ibj.com/topics/fletcher-place"],["INFATUATION","https://www.theinfatuation.com/indianapolis/reviews/milktooth"],["JAMESBEARD",JBH],["INDYMONTHLY","https://www.indianapolismonthly.com/food-and-drinks/the-feed-rail-milktooth-and-more/"]]},
 UNV("Milktooth (arlene's by Milktooth)","534 Virginia Ave, Indianapolis, IN","IBJ 2026: Milktooth returns after Arlene's; Islands.com 2026 operating hybrid"))
add("food",{"t":2,"a":"NORTH","k":"Fishers","cz":["Donuts","Bakery"],"dish":"Mochi (rice-flour) donuts",
 "n":"Mochi Joy","address":"8664 E 96th St, Fishers, IN",
 "w":"Tom Nguyen and Rachel Burnett's mochi-donut shop — Indiana's first — moved from a Noblesville VFW kitchen to Fishers in 2025; an Indianapolis Monthly 2025 Best Restaurants pick.",
 "closed":False,"sources":[["INDYMONTHLY","https://www.indianapolismonthly.com/food-and-drinks/the-feed-6/mochi-doughnuts-vicious-biscuits-keystone-sports-review/"],["INDYTODAY","https://indytoday.6amcity.com/donut-superlatives-indianapolis-in/"],["WRTV",IM25EV],["FOX59","https://digital-release.fox59.com/indy-now/mochi-donuts-noblesville-indiana/amp/"]]},
 UNV("Mochi Joy","8664 E 96th St, Fishers, IN","Indianapolis Monthly 2025 Best Restaurants event participant (WRTV, Sept 2025)"))
# ---- sights batch 4 ----
add("sight",{"t":1,"a":"MASS","k":"Mass Ave","n":"Mass Ave Cultural Arts District","address":"Massachusetts Ave, Delaware St to I-65, Indianapolis, IN",
 "w":"One of the four diagonal avenues of the 1821 plan: theatres, galleries, bars and the Mass Ave commercial historic district (NRHP 1982) — the city's main walking-and-eating strip.",
 "sources":[["WIKIPEDIA",W+"Mass_Ave_Cultural_Arts_District"],["NPS","https://www.nps.gov/nr/travel/indianapolis/massave.htm"],["INDYENCYCLOPEDIA",IE+"massachusetts-avenue/"],["TCLF","https://tclf.org/massachusetts-avenue-commercial-district"]]},
 g("Mass Ave Cultural Arts District","Massachusetts Ave, Delaware St to I-65, Indianapolis, IN",39.775,-86.14861,"Wikipedia infobox 39°46′30″N 86°8′55″W ("+W+"Mass_Ave_Cultural_Arts_District)",conf="med",ss="Active district",note="district point"))
add("sight",{"t":2,"a":"NORTH","k":"Noblesville","n":"Potter's Covered Bridge","address":"Potter's Bridge Park, Noblesville, IN",
 "w":"1871 Howe-truss covered bridge, 260 ft over the White River — the only surviving covered bridge in Hamilton County, now pedestrian-only in its own park.",
 "sources":[["WIKIPEDIA",W+"Potter%27s_Covered_Bridge"],["INDIANAHISTORY","https://www.in.gov/history/state-historical-markers/find-a-marker/potters-covered-bridge/"],["NPS","https://npgallery.nps.gov/AssetDetail/82cc5e62-04b3-42fc-9b33-6e94602c42bb"]]},
 g("Potter's Covered Bridge","Potter's Bridge Park, Noblesville, IN",40.0725,-86.00056,"Wikipedia infobox 40°4′21″N 86°0′2″W ("+W+"Potter%27s_Covered_Bridge)",ss="Pedestrian bridge in a county park"))
add("sight",{"t":2,"a":"MID","n":"Indiana State Fairgrounds & Corteva Coliseum","address":"1202 E 38th St, Indianapolis, IN",
 "w":"Home of the Indiana State Fair every August (since 1892 on this site); the 1939 WPA-era Coliseum hosted the Beatles in 1964.",
 "sources":[["WIKIPEDIA",W+"Corteva_Coliseum"],["LIVINGNEWDEAL","https://livingnewdeal.org/sites/isf-coliseum-indianapolis/"]]},
 g("Indiana State Fairgrounds & Corteva Coliseum","1202 E 38th St, Indianapolis, IN",39.8275,-86.135,"Wikipedia infobox (Corteva Coliseum) 39°49′39″N 86°8′6″W ("+W+"Corteva_Coliseum)",ss="State-run venue in use"))
add("sight",{"t":2,"a":"MASS","k":"Old Northside","n":"Morris-Butler House","address":"1204 N Park Ave, Indianapolis, IN",
 "w":"D.A. Bohlen's c.1864 Second Empire mansion in the Old Northside, restored by Indiana Landmarks as a Victorian house museum.",
 "sources":[["WIKIPEDIA",W+"Morris%E2%80%93Butler_House"],["INDYENCYCLOPEDIA","https://indyencyclopedia.org/?p=1813"],["OFFICIAL","https://www.indianalandmarks.org/morris-butler-house/"]]},
 g("Morris-Butler House","1204 N Park Ave, Indianapolis, IN",39.783278,-86.147944,"Wikipedia infobox 39°46′59.8″N 86°8′52.6″W ("+W+"Morris%E2%80%93Butler_House)",ss="Indiana Landmarks property (official page)"))
add("sight",{"t":2,"a":"SOUTH","k":"Greenwood","n":"Old Town Greenwood","address":"W Main St & S Madison Ave, Greenwood, IN",
 "w":"Greenwood's NRHP commercial historic district (25 buildings on W Main St / S Madison Ave) — the walkable old town of the south suburbs, ringed by the Chin/Burmese restaurants of 'Little Burma'.",
 "sources":[["WIKIPEDIA",W+"Greenwood_Commercial_Historic_District"],["NPS","https://npgallery.nps.gov/AssetDetail/NRIS/100001059"],["IBJ","https://www.ibj.com/articles/60309-greenwood-works-to-get-neighborhood-on-national-register"]]},
 g("Old Town Greenwood","W Main St & S Madison Ave, Greenwood, IN",39.61389,-86.10972,"Wikipedia infobox (Greenwood Commercial Historic District) 39°36′50″N 86°6′35″W ("+W+"Greenwood_Commercial_Historic_District)",ss="Active downtown district"))
# ---- sights batch 5 ----
add("sight",{"t":2,"a":"MASS","k":"Mass Ave","n":"Old National Centre (Murat Shrine)","address":"502 N New Jersey St, Indianapolis, IN",
 "w":"The 1909 Murat Shrine temple, a Moorish-Revival fantasy of minarets and terra cotta — the oldest stage house in Indianapolis, now a concert venue.",
 "sources":[["WIKIPEDIA",W+"Old_National_Centre"],["INDYENCYCLOPEDIA","https://indyencyclopedia.org/?p=14445"],["SAHARCHIPEDIA","https://archipediavm.upress.virginia.edu/buildings/01-097-0050"]]},
 g("Old National Centre (Murat Shrine)","502 N New Jersey St, Indianapolis, IN",39.77417,-86.15111,"Wikipedia infobox 39°46′27″N 86°9′4″W ("+W+"Old_National_Centre)",ss="Active concert venue"))
add("sight",{"t":2,"a":"DTN","n":"Victory Field","address":"White River State Park, Indianapolis, IN",
 "w":"The Indianapolis Indians' 1996 ballpark with its lawn seating and skyline view over the outfield — one of the best-loved minor-league parks in the US.",
 "sources":[["WIKIPEDIA",W+"Victory_Field"],["VISITINDY",VI+"directory/victory-field-located-in-white-river-state-park"],["OFFICIAL","https://whiteriverstatepark.org/venue/victory-field"]]},
 g("Victory Field","White River State Park, Indianapolis, IN",39.765,-86.16833,"Wikipedia infobox 39°45′54″N 86°10′6″W ("+W+"Victory_Field)",ss="Active ballpark (Indians tenant 1996-present)"))
add("sight",{"t":2,"a":"FSQ","n":"Holy Rosary Church & Italian Street Festival","address":"520 Stevens St, Indianapolis, IN",
 "w":"The 1909 church of Indy's Sicilian and Calabrian immigrants; its Italian Street Festival (since 1934) draws ~40,000 people each June for 25+ Italian dishes and a procession.",
 "sources":[["INDYENCYCLOPEDIA","https://indyencyclopedia.org/?p=74526"],["WRTV","https://www.wrtv.com/news/local-news/holy-rosarys-italian-street-festival-returns-for-41st-year"],["WISH","https://wishtv.com/indy-style/italian-street-festival-returns-to-indy-with-more-than-25-italian-dishes"],["CLIO","https://theclio.com/entry/133857"]]},
 UNV("Holy Rosary Church & Italian Street Festival","520 Stevens St, Indianapolis, IN","Active parish; festival covered annually (WRTV/WISH)"))
add("sight",{"t":1,"a":"MASS","n":"Monon Trail (10th Street trailhead)","address":"Monon Trail at E 10th St, Indianapolis, IN",
 "w":"The 28.5-mile rail-trail on the old Monon Railroad, from 10th Street up through Broad Ripple and Carmel to Sheridan — Indy's busiest trail and the spine of the north side.",
 "sources":[["WIKIPEDIA",W+"Monon_Trail"],["TRAILLINK","https://www.traillink.com/trail/monon-trail"],["BACKPACKER","https://www.backpacker.com/trips/indianapolis-in-monon-rail-trail/?scope=anon"]]},
 g("Monon Trail (10th Street trailhead)","Monon Trail at E 10th St, Indianapolis, IN",39.7814164,-86.1401078,"Wikipedia (Monon Trail) southern terminus at 10th St 39.7814164,-86.1401078 ("+W+"Monon_Trail)",conf="med",ss="Public trail",note="southern trailhead point"))
add("sight",{"t":2,"a":"MASS","k":"Old Northside","n":"Indiana Landmarks Center","address":"1201 Central Ave, Indianapolis, IN 46202",
 "w":"The 1891 Romanesque Central Avenue Methodist Church, rescued and reopened in 2011 as the headquarters of Indiana Landmarks — the Cook Theater sanctuary keeps its stained glass.",
 "sources":[["INDYENCYCLOPEDIA","https://indyencyclopedia.org/?p=2107"],["IPM","https://indianapublicmedia.org/momentofindianahistory/life-indianapolis-landmark"],["OFFICIAL","https://www.indianalandmarks.org/our-historic-sites/indiana-landmarks-center-campus/"]]},
 UNV("Indiana Landmarks Center","1201 Central Ave, Indianapolis, IN 46202","Indiana Landmarks campus page (HQ in use)"))
# ---- batch 6 ----
add("sight",{"t":1,"a":"WEST","k":"International Marketplace","n":"International Marketplace (Lafayette Square)","address":"Lafayette Rd & W 38th St, Indianapolis, IN",
 "w":"The 12-block Lafayette Road corridor (34th-46th Sts) around the former Lafayette Square Mall — 80+ restaurants and ~700 immigrant-owned businesses; the New York Times called it the place in Indianapolis where 'the world comes to eat'. The mall itself closed in 2022 and is being redeveloped.",
 "sources":[["WIKIPEDIA",W+"Lafayette_Square_Mall"],["INDYENCYCLOPEDIA",IE+"international-marketplace-coalition/"],["VISITINDIANA","https://visitindiana.in.gov/blog/post/international-marketplace-indy/"],["WRTV","https://www.wrtv.com/lifestyle/food/take-a-tour-of-indianapolis-international-marketplace-full-of-global-cuisine"]]},
 g("International Marketplace (Lafayette Square)","Lafayette Rd & W 38th St, Indianapolis, IN",39.827778,-86.232778,"Wikipedia infobox (Lafayette Square Mall) 39°49′40″N 86°13′58″W ("+W+"Lafayette_Square_Mall)",conf="med",ss="District active; mall closed Aug 2022 (Wikipedia) — pin marks the district hub",note="former-mall point = district centre"))
add("sight",{"t":2,"a":"NORTH","k":"Carmel","n":"Carmel Arts & Design District","address":"W Main St (Seward Johnson sculptures, e.g. 110 W Main St), Carmel, IN",
 "w":"Old Town Carmel's galleries and design shops along Main Street and the Monon Greenway, with the largest collection of J. Seward Johnson's life-size painted-bronze sculptures outside New Jersey.",
 "sources":[["CURRENT","https://www.youarecurrent.com/2018/12/28/carmel-adding-to-its-seward-johnson-sculpture-collection/"],["THEREPORTER","https://readthereporter.com/carmel-unveils-latest-sculpture-in-arts-design-district/"],["OFFICIAL","https://carmelartsanddesign.com/?p=3994"]]},
 UNV("Carmel Arts & Design District","W Main St (Seward Johnson sculptures, e.g. 110 W Main St), Carmel, IN","City of Carmel sculpture unveilings 2023"))
add("food",{"t":2,"a":"DTN","cz":["Steakhouse","Seafood","Cocktail Bar"],"dish":"Chophouse steaks and seafood upstairs; cocktails at Mel's, the basement speakeasy",
 "n":"Commission Row","address":"110 S Delaware St, Indianapolis, IN",
 "w":"Cunningham Restaurant Group's chophouse in a Pacers-owned building beside Gainbridge Fieldhouse, with Mel's speakeasy below — Indianapolis Monthly Best Restaurants 2024 and 2026.",
 "closed":False,"sources":[["INDYMONTHLY","https://www.indianapolismonthly.com/food-and-drinks/best-restaurants-2026-commission-row-his-place-eatery/"],["IBJ","https://www.ibj.com/articles/cunningham-restaurants-set-to-operate-pacers-owned-building"],["VISITINDY",VI+"blog/post/cunningham-restaurant-group-unveils-newest-concept-with-commission-row/"]]},
 UNV("Commission Row","110 S Delaware St, Indianapolis, IN","Indianapolis Monthly Best Restaurants 2026 (Sept 2026)"))
add("food",{"t":2,"a":"WEST","cz":["Vietnamese"],"dish":"Pho with a medium-bodied, gently spiced broth; hu tieu noodle soups",
 "n":"Saigon Restaurant (Pho Saigon)","address":"4760 W 38th St, Indianapolis, IN",
 "w":"One of the longest-running Asian kitchens in the city, on the International Marketplace's 38th Street edge — Indianapolis Monthly's top-five pho and a fixture of every Indy pho guide.",
 "closed":False,"sources":[["INDYMONTHLY","https://www.indianapolismonthly.com/food-and-drinks/dining/top-five-phos/"],["INDYTODAY","https://indytoday.6amcity.com/food/pho-restaurants-indianapolis"],["WRTV","https://www.wrtv.com/entertainment/inside-indy/food/where-to-eat-pho-in-indianapolis"],["NUVO","https://www.nuvo.net/food/a-return-to-saigon/article_5a9efdfc-9451-11e8-9c36-bbc24a5dde51.html"]]},
 UNV("Saigon Restaurant (Pho Saigon)","4760 W 38th St, Indianapolis, IN","Indy Today pho guide (Feb 2025)"))
add("food",{"t":2,"a":"NORTH","k":"Fishers","cz":["Brewery","Tenderloin"],"dish":"The massive breaded tenderloin and house beers",
 "n":"Four Day Ray Brewing","address":"11671 Lantern Rd, Fishers, IN",
 "w":"Fishers brewpub whose scratch kitchen anchors Hamilton County's Tenderloin Tuesdays — Axios followed the tenderloin trail here in 2025.",
 "closed":False,"sources":[["AXIOS","https://www.axios.com/local/indianapolis/2025/10/27/taking-the-tenderloin-trail-to-four-day-ray"],["FOX59","https://digital-release.fox59.com/instagram/foodie-spotlight-four-day-ray"],["OFFICIAL","https://fishersin.gov/four-day-ray-brewing/"]]},
 UNV("Four Day Ray Brewing","11671 Lantern Rd, Fishers, IN","Axios tenderloin-trail visit (Oct 2025)"))
# ---- batch 7 ----
add("sight",{"t":2,"a":"DTN","k":"Monument Circle","n":"Hilbert Circle Theatre","address":"45 Monument Circle, Indianapolis, IN",
 "w":"A 1916 'deluxe movie palace' on Monument Circle, restored as home of the Indianapolis Symphony Orchestra (1,660 seats).",
 "sources":[["WIKIPEDIA",W+"Hilbert_Circle_Theatre"],["OFFICIAL","https://www.indianapolissymphony.org/visit/hilbert-circle-theatre/history/"],["POLIS","https://polis.indianapolis.iu.edu/?p=4234"]]},
 g("Hilbert Circle Theatre","45 Monument Circle, Indianapolis, IN",39.76806,-86.15722,"Wikipedia infobox 39°46′5″N 86°9′26″W ("+W+"Hilbert_Circle_Theatre)",ss="Active ISO venue"))
add("sight",{"t":2,"a":"DTN","n":"Stutz Building","address":"10th St & Capitol Ave, Indianapolis, IN",
 "w":"The 1914 Stutz Motor Car factory (home of the Bearcat), five connected four-storey buildings now full of artist studios — the Stutz Artists Association's open-studio nights fill the halls.",
 "sources":[["INDYENCYCLOPEDIA",IE+"stutz-business-and-art-center/"],["SAHARCHIPEDIA","https://sah-archipedia.org/node/12982"],["INDYTODAY","https://indytoday.6amcity.com/historic-stutz-building-reimagined-indianapolis-in?_amp=true"]]},
 UNV("Stutz Building","10th St & Capitol Ave, Indianapolis, IN","Indy Today: building reimagined; artists remain"))
add("sight",{"t":2,"a":"MASS","k":"Mass Ave","n":"Bottleworks District & The Garage Food Hall","address":"Bottleworks District (Mass Ave & College Ave), Indianapolis, IN",
 "w":"The 1931 Art Deco Coca-Cola bottling plant reborn (2018-) as a hotel, cinema and The Garage food hall with ~18 vendors.",
 "sources":[["WIKIPEDIA",W+"Bottleworks_District"],["INDYENCYCLOPEDIA",IE+"bottleworks-district/"],["WFYI","https://wfyi.org/news/articles/garage-food-hall-opens-at-bw-district"],["TIMEOUT","https://www.timeout.com/usa/news/this-1930s-coca-cola-bottling-plant-has-been-reimagined-as-a-foodie-hotel-032921"]]},
 g("Bottleworks District & The Garage Food Hall","Bottleworks District (Mass Ave & College Ave), Indianapolis, IN",39.7797,-86.1436,"Wikipedia infobox 39°46′47″N 86°08′37″W ("+W+"Bottleworks_District)",conf="med",ss="Operating district (WFYI)"))
add("sight",{"t":2,"a":"NORTH","k":"Carmel","n":"Museum of Miniature Houses","address":"111 E Main St, Carmel, IN 46032",
 "w":"Small, beloved museum of dollhouses and miniature rooms in Carmel's Arts & Design District, open 25+ years.",
 "sources":[["IPM","https://indianapublicmedia.org/theweeklyspecial/miniature-museum-houses"],["OFFICIAL","https://carmelartsanddesign.com/directory/museum-of-miniature-houses/"]]},
 g("Museum of Miniature Houses","111 E Main St, Carmel, IN 46032",39.978333,-86.125833,"search-result coords 39°58'42\"N 86°7'33\"W (trek.zone POI record — aggregator)",conf="low",ss="Carmel Arts & Design directory listing",note="LOW: aggregator arc-second point — re-verify"))
add("sight",{"t":1,"a":"DTN","n":"Central Canal Walk","address":"Canal Walk, from 10th St & Dr. Martin Luther King Jr. St south to White River State Park, Indianapolis, IN",
 "w":"3-mile loop along the rebuilt 1836 Central Canal — paddleboats, the USS Indianapolis and 9/11 memorials, and the lock-gate waterfall at 10th Street.",
 "sources":[["TCLF","https://tclf.org/indianapolis-canal-walk"],["INDYENCYCLOPEDIA",IE+"central-canal-corridor/"],["OFFICIAL","https://whiteriverstatepark.org/venue/canal-walk/"]]},
 UNV("Central Canal Walk","Canal Walk, from 10th St & Dr. Martin Luther King Jr. St south to White River State Park, Indianapolis, IN","Public trail (White River State Park venue page)"))
# ---- batch 8 ----
add("sight",{"t":2,"a":"DTN","n":"NCAA Hall of Champions","address":"White River State Park, Indianapolis, IN",
 "w":"Michael Graves-designed NCAA headquarters and museum (2000) covering all 24 college sports, with a 1930s-style hardwood court upstairs.",
 "sources":[["WIKIPEDIA",W+"NCAA_Hall_of_Champions"],["INDYENCYCLOPEDIA",IE+"ncaa-headquarters-and-hall-of-champions/"],["OFFICIAL","https://michaelgraves.com/project/ncaa-headquarters-and-hall-of-champions/"]]},
 g("NCAA Hall of Champions","White River State Park, Indianapolis, IN",39.76716,-86.169156,"Wikipedia infobox 39°46′02″N 86°10′09″W ("+W+"NCAA_Hall_of_Champions)",ss="Operating museum"))
add("food",{"t":2,"a":"MASS","k":"Mass Ave","cz":["Bar","Cocktails"],"dish":"Live jazz nightly in a tiny Mass Ave bar",
 "n":"Chatterbox Jazz Club","address":"435 Massachusetts Ave, Indianapolis, IN 46204",
 "w":"David Andrichik's narrow Mass Ave jazz bar, running live sets every night for nearly four decades.",
 "closed":False,"sources":[["NUVO","https://www.nuvo.net/culturalvisionawards/chatterbox-jazz-club-david-andrichik/article_6153ab42-6280-11e7-a1d3-4f87d15a21f5.html"],["JAZZJOURNALISTS","https://news.jazzjournalists.org/jazzonlockdown-indianapolis-chatterbox-learning-lessons-after-38-yrs/"],["DOWNTOWNINDY","https://www.Downtownindy.org/go/chatterbox-jazz-club"]]},
 UNV("Chatterbox Jazz Club","435 Massachusetts Ave, Indianapolis, IN 46204","Downtown Indy listing (2026)"))
add("food",{"t":2,"a":"BRIP","k":"SoBro","cz":["Bar","Southern"],"dish":"Dinner with a live jazz set",
 "n":"The Jazz Kitchen","address":"5377 N College Ave, Indianapolis, IN 46220",
 "w":"Jazz club and restaurant at 54th & College since 1994 — Indy's flagship jazz room, keeping the Indiana Avenue tradition alive.",
 "closed":False,"sources":[["WIKIPEDIA",W+"Jazz_Kitchen"],["INDYENCYCLOPEDIA",IE+"jazz-kitchen/"],["IBJ","https://www.ibj.com/articles/47915-indy-s-musical-roots-remain-alive-at-jazz-kitchen"],["VISITINDY",VI+"directory/the-jazz-kitchen/"]]},
 UNV("The Jazz Kitchen","5377 N College Ave, Indianapolis, IN 46220","Visit Indy directory listing; official 'three decades' post"))
add("food",{"t":1,"a":"MASS","cz":["Soul Food"],"dish":"Fried chicken, smothered pork chops, greens and mac and cheese",
 "n":"Kountry Kitchen Soul Food Place","address":"1831 N College Ave, Indianapolis, IN",
 "w":"Near-northside soul food landmark — Barack Obama lunched here on the 2008 campaign and Shaquille O'Neal called it the best soul food ever. Rebuilt on its original site after a 2020 fire, with the 910 North event hall.",
 "closed":False,"sources":[["IBJ","https://www.ibj.com/articles/kountry-kitchen-owners-break-ground-for-new-restaurant-at-original-site"],["FOX59","https://digital-release.fox59.com/news/shaquille-oneal-dubs-indys-kountry-kitchen-the-best-soul-food-spot-ever"],["WISH","https://wishtv.com/?p=755630"],["INDYMONTHLY","https://www.indianapolismonthly.com/food-and-drinks/the-feed-kountry-kitchen-west-coast-nook-and-more/"]]},
 UNV("Kountry Kitchen Soul Food Place","1831 N College Ave, Indianapolis, IN","IBJ: reopened at original site in new building"))
# ---- batch 9 ----
add("sight",{"t":1,"a":"EAST","n":"Woodruff Place","address":"Woodruff Place (Cross, West, Middle & East Drives), Indianapolis, IN",
 "w":"James O. Woodruff's 1870s garden suburb a mile east of downtown — esplanade drives with nine multi-tiered cast-iron fountains (the Cross Drive ones are the city's oldest) and Mott Iron Works statuary. NRHP 1972.",
 "sources":[["WIKIPEDIA",W+"Woodruff_Place,_Indianapolis"],["NPS","https://www.nps.gov/Nr/travel/indianapolis/woodruffplace.htm"],["TCLF","https://www.tclf.org/landscapes/woodruff-place"],["INDYENCYCLOPEDIA",IE+"woodruff-place/"]]},
 g("Woodruff Place","Woodruff Place (Cross, West, Middle & East Drives), Indianapolis, IN",39.77778,-86.128472,"Wikipedia infobox 39°46′40″N 86°7′42.5″W ("+W+"Woodruff_Place,_Indianapolis)",conf="med",ss="Residential historic district (public streets)",note="neighbourhood point"))
add("sight",{"t":2,"a":"MID","k":"Butler","n":"Clowes Memorial Hall","address":"4602 Sunset Ave, Indianapolis, IN",
 "w":"Butler University's 1963 Brutalist performing-arts hall by Evans Woollen III and John Johansen — touring Broadway and the city's big concerts.",
 "sources":[["WIKIPEDIA",W+"Clowes_Memorial_Hall"],["SAHARCHIPEDIA","https://sah-archipedia.org/node/12990"],["INDYENCYCLOPEDIA","https://indyencyclopedia.org/?p=1275"]]},
 g("Clowes Memorial Hall","4602 Sunset Ave, Indianapolis, IN",39.840278,-86.169722,"Wikipedia infobox 39°50′25″N 86°10′11″W ("+W+"Clowes_Memorial_Hall)",ss="Active Butler venue"))
add("sight",{"t":2,"a":"NORTH","k":"Westfield","n":"Grand Park Sports Campus","address":"19000 Grand Park Blvd, Westfield, IN",
 "w":"Westfield's 400-acre youth-sports campus (2014) — and every summer the Indianapolis Colts' training camp, free to watch.",
 "sources":[["WIKIPEDIA",W+"Grand_Park_(Indiana)"],["HAMILTONCOUNTY",HC+"sports/grand-park/"],["INDYENCYCLOPEDIA",IE+"grand-park/"]]},
 g("Grand Park Sports Campus","19000 Grand Park Blvd, Westfield, IN",40.0580029,-86.1489468,"Wikipedia infobox 40°03′29″N 86°08′56″W ("+W+"Grand_Park_(Indiana))",conf="med",ss="City of Westfield-operated campus",note="campus point"))
