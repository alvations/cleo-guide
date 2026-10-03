# W3 records (2026-10-03) — every field from a WebSearch result logged in AUDIT.md (W3). Run: python3 _ind_w3_records.py
# Writes FOOD_W3.json / SIGHTS_W3.json / geo/_geoout_w3.json via _ind_add_w3.py; outlets → SOURCES_W3.json.
# Geo for each place is filled in GEO below (pin stage); places absent from GEO are UNVERIFIED.
import json, subprocess, sys, os
D=os.path.dirname(os.path.abspath(__file__))
def add(kind, rec, geo=None):
    a=[sys.executable,os.path.join(D,"_ind_add_w3.py"),kind,json.dumps(rec,ensure_ascii=False)]
    if geo: a.append(json.dumps(geo,ensure_ascii=False))
    subprocess.run(a,check=True,stdout=subprocess.DEVNULL)
W="https://en.wikipedia.org/wiki/"
IM="https://www.indianapolismonthly.com/"
VI="https://www.visitindy.com/directory/"
GEO={}   # name -> (lat,lng,geoSource,confidence[,note])
def geo_for(n,addr,ss,note_unv):
    if n in GEO:
        v=GEO[n]; d={"n":n,"address":addr,"lat":v[0],"lng":v[1],"geoSource":v[2],"confidence":v[3],"status":"open","statusSource":ss}
        if len(v)>4: d["note"]=v[4]
        return d
    return {"n":n,"address":addr,"lat":None,"lng":None,"geoSource":"UNVERIFIED","confidence":"UNVERIFIED","status":"open","statusSource":ss,"note":note_unv}
def F(t,a,n,addr,cz,dish,w,sources,ss,k=None):
    r={"t":t,"a":a,"cz":cz,"dish":dish,"n":n,"address":addr,"w":w,"closed":False,"sources":sources}
    if k: r["k"]=k
    add("food",r,geo_for(n,addr,ss,"no place-pin coordinate found via WebSearch (Apple/Waze/listing probes); queue for tools/geocode-helper.html"))
def S(t,a,n,addr,w,sources,ss,k=None):
    r={"t":t,"a":a,"n":n,"address":addr,"w":w,"sources":sources}
    if k: r["k"]=k
    add("sight",r,geo_for(n,addr,ss,"no published place coordinate found via WebSearch; queue for tools/geocode-helper.html"))
if os.path.exists(os.path.join(D,"_ind_geo_w3.py")):
    exec(open(os.path.join(D,"_ind_geo_w3.py"),encoding="utf-8").read())

# ===================== DTN — food & drink (W3: DTN food share was 8/30) =====================
F(1,"DTN","Harry & Izzy's","153 S Illinois St, Indianapolis, IN",["American","Steakhouse"],"St. Elmo's shrimp cocktail (the fiery horseradish sauce) and steaks in a less formal room",
 "St. Elmo's sister restaurant and next-door neighbour (1997) — an upscale American grill that shares St. Elmo's famous shrimp cocktail and steaks with a broader menu around a lively bar. On Indianapolis Monthly's Swoon List.",
 [["DOWNTOWNINDY","https://downtownindy.org/go/harry-and-izzys"],["VISITINDY",VI+"harry-izzys/"],["INDYMONTHLY",IM+"food-and-drinks/swoon-list-harry-izzys-the-loft-at-traders-point-and-more/"],["WTHR","https://www.wthr.com/article/news/local/harry-and-izzys-open/531-b3538cc5-947d-4d81-abda-3928a4ecafee"]],
 "Downtown Indy + Visit Indy current listings (open)",k="Wholesale District")
F(2,"DTN","1933 Lounge by St. Elmo","127 S Illinois St (2nd floor of St. Elmo Steak House), Indianapolis, IN",["Cocktail Bar","Steakhouse"],"St. Elmo shrimp cocktail and filet sliders with Prohibition-era cocktails",
 "St. Elmo's upstairs lounge, named for the year Prohibition ended — brick walls, an 1898 back bar, the famous shrimp cocktail and filet sliders with classic cocktails. Indianapolis Monthly's No. 5 best bar.",
 [["INDYMONTHLY",IM+"food-and-drinks/drinks/no-5-1933-lounge/"],["FOX59","https://fox59.com/morning-news/where-is-sherman/where-is-sherman-1933-lounge-by-st-elmo/"],["VISITINDY","https://www.visitindy.com/blog/post/hidden-gems-five-speakeasies-to-visit-in-indianapolis-2/"]],
 "Downtown Indy listing; FOX59/Indy Monthly segment (open)",k="Wholesale District")
F(1,"DTN","Prime 47","47 S Pennsylvania St (Majestic Building), Indianapolis, IN",["Steakhouse"],"Wet-aged prime filet with horseradish–bleu cheese crust; Cajun New York strip",
 "Locally owned steakhouse in the Romanesque Revival Majestic Building, named for its street number — Indianapolis Monthly's 'Indy's Great Steakhouses' pick; WISH has called it Indy's No. 1 steakhouse.",
 [["INDYMONTHLY",IM+"food-and-drinks/dining/indys-great-steakhouses-prime-47/"],["WISH","https://wishtv.com/lifestylelive/prime-47-indys-1-steakhouse/"]],
 "WISH-TV segments 2025 (Pacers Finals boost, culotte steak) (open)")
F(1,"DTN","Astrea","InterContinental Indianapolis (11th floor), Market St at Monument Circle, Indianapolis, IN",["Cocktail Bar","Small Plates"],"Craft cocktails and chef Craig Baker's shareable small plates over Monument Circle",
 "Indoor-outdoor rooftop lounge on the 11th floor of the InterContinental (opened Feb 2025) — Indy's highest bar, looking straight down on Monument Circle; Axios called it the star of the city's rooftop-bar lineup.",
 [["AXIOS","https://www.axios.com/local/indianapolis/2025/04/11/astrea-intercontinental-hotel-indy-rooftop-bar-lineup"],["INDYMONTHLY",IM+"food-and-drinks/new-indy-rooftop-bar-astrea/"],["VISITINDY","https://www.visitindy.com/blog/post/best-rooftop-views-in-indy/"]],
 "Axios Apr 2025; Visit Indy rooftop guide (open)")
F(2,"DTN","The Eagle's Nest","Hyatt Regency Indianapolis (rooftop), 1 S Capitol Ave, Indianapolis, IN",["American","Steakhouse"],"Steaks and seafood in Indiana's only revolving rooftop dining room",
 "Rotating restaurant atop the 22-storey Hyatt Regency since 1977 — one of fewer than two dozen revolving rooftop restaurants left in North America; 360° views of downtown.",
 [["IBJ","https://www.ibj.com/articles/25865-eagle-s-nest-is-a-survivor-among-rooftop-eateries"],["INDYMONTHLY",IM+"food-and-drinks/dining/mini-review-the-eagles-nest/"],["WRTV","https://www.wrtv.com/news/local-news/5-best-places-for-a-rooftop-view-of-indy"]],
 "Downtown Indy listing (open; WebSearch result dated Dec 2025)")
F(2,"DTN","Nesso Italian Kitchen","339 S Delaware St (The Alexander hotel), Indianapolis, IN",["Italian"],"Coastal Italian pastas (clams-and-broccolini linguine); regional Italian wine list",
 "Coastal-Italian dining room in The Alexander hotel from Cunningham Restaurant Group — scratch pasta and one of Indiana's deepest Italian wine lists (Wine Spectator Award of Excellence 2025).",
 [["INDYMONTHLY",IM+"food-and-drinks/reviews/our-review-nesso-coastal-italia/"],["FOX59","https://fox59.com/morning-news/eating-around-indy/nesso-features-fresh-coastal-italian-in-this-weeks-foodie-spotlight/"],["WISH","https://www.wishtv.com/lifestyle/all-indiana/indianapolis-patio-menu-nesso/"]],
 "Wine Spectator Award of Excellence 2025 listing (open)",k="CityWay")
F(2,"DTN","Taxman CityWay","310 S Delaware St (CityWay), Indianapolis, IN",["Brewery","Belgian"],"Belgian-style frites and Liège waffles with Taxman's Belgian-style house beers",
 "Taxman Brewing's downtown gastropub and beer garden in an 1800s livery building in CityWay — Indiana-beef burgers, Belgian frites, 20 house drafts.",
 [["INDYMONTHLY",IM+"food-and-drinks/introducing-taxman-cityway/"],["IBJ","https://www.ibj.com/articles/71174-taxman-brewing-to-open-restaurantbar-in-historic-downtown-building"],["VISITINDY",VI+"taxman-cityway/"]],
 "Visit Indy current listing (open)",k="CityWay")
F(2,"DTN","Iozzo's Garden of Italy","946 S Meridian St, Indianapolis, IN",["Italian"],"Family-recipe red-sauce Italian (meatballs, lasagna) from a 1930 lineage",
 "Revival (2009) of Indianapolis's first full-service Italian restaurant, opened by Santora 'Fred' Iozzo in 1930 — his great-granddaughter cooks the family recipes in a near-south-side room by Lucas Oil Stadium.",
 [["INDYMONTHLY",IM+"food-and-drinks/the-feed-6/new-restaurants-closures-indianapolis-may/"],["WISH","https://www.wishtv.com/gr8comeback/gr8-comeback-iozzos-garden-of-italy-continues-90-year-tradition-in-downtown-indianapolis/"],["FOX59","https://fox59.com/news/foodie-spotlight-iozzos-garden-of-italy-brings-traditional-recipes-old-world-style-to-circle-city/"]],
 "Indianapolis Monthly 'Iozzo's Grows' (expanding, open); WRTV Franklin 2nd location")
F(2,"DTN","Spoke & Steele","123 S Illinois St (Le Méridien), Indianapolis, IN",["American"],"Dry-aged Duroc pork chop; the Spoke Burger; barrel-aged cocktails",
 "Le Méridien's racing-themed, mid-century-modern restaurant and bar — Midwestern comfort food done ambitiously, with barrel-aged cocktails at a brass-edged bar.",
 [["INDYMONTHLY",IM+"food-and-drinks/dining/cool-comfort-review-spoke-steele/"],["FOX59","https://fox59.com/instagram/foodie-spotlight-spoke-steele/"],["WISH","https://www.wishtv.com/news/chef-greg-hardesty-cooks-up-his-famous-spoke-burger/"],["EDIBLEINDY","https://edibleindy.ediblecommunities.com/eat/le-m-ridien-and-spoke-steele-where-class-meets-comfort"]],
 "Edible Indy feature; 2026 reviews returned by WebSearch (open)",k="Wholesale District")
F(2,"DTN","The Hulman","Hotel Indy, 141 E Washington St, Indianapolis, IN",["American","Italian"],"House pastas (short-rib spaccatelli); tableside king-crab bisque",
 "Hotel Indy's 52-seat restaurant named for the Hulman family of the Speedway — chef Patrick Russ (ex-Next, Chicago) makes the pastas and sausages in house; Indianapolis Monthly 3 stars.",
 [["INDYMONTHLY",IM+"food-and-drinks/hotel-indys-driving-force-is-the-hulman/"],["WISH","https://www.wishtv.com/lifestyle/lifestylelive/the-hulman-at-hotel-indy-showcases-restaurants-amazing-food-connection-to-ims-museum/"],["IBJ","https://www.ibj.com/articles/hulman-new-downtown-restaurant"]],
 "WISH-TV segments (open)")
F(3,"DTN","Cannon Ball Rooftop Lounge","Hotel Indy (6th floor), 141 E Washington St, Indianapolis, IN",["Cocktail Bar"],"Indy-inspired cocktails and Midwest bites on an open-air rooftop",
 "Sixth-floor open-air rooftop bar at Hotel Indy named for racer Erwin 'Cannon Ball' Baker — a slight Art Deco feel and some of the best downtown skyline views.",
 [["VISITINDY",VI+"cannon-ball-rooftop-lounge-at-hotel-indy/"],["AXIOS","https://www.axios.com/local/indianapolis/2025/04/11/astrea-intercontinental-hotel-indy-rooftop-bar-lineup"],["INDYMONTHLY",IM+"lifestyle/5-things-we-love-about-hotel-indy/"]],
 "Visit Indy listing; Axios rooftop lineup Apr 2025 (open)")
F(3,"DTN","Tavern on South","423 W South St, Indianapolis, IN",["American","Pub"],"Smoked prime rib; bison burger with charred-tomato glaze",
 "Pre-game tavern a walk from Lucas Oil Stadium and the Convention Center — 12-tap bar, sky-high ceilings and a skyline deck; a chef-driven menu that avoids bar-food clichés.",
 [["INDYMONTHLY",IM+"food-and-drinks/dining/review-tavern-on-south/"],["WISH","https://www.wishtv.com/news/allindiana/tasty-takeout-tavern-on-south/"],["VISITINDY",VI+"tavern-on-south/"]],
 "Visit Indy + Downtown Indy current listings (open)")
F(3,"DTN","Sushi Den","233 S Delaware St (CityWay), Indianapolis, IN",["Japanese","Sushi"],"Sushi and specialty rolls",
 "CityWay sushi bar (2024) that Axios checked out on opening and Indianapolis Monthly's Feed flagged — a sit-down sushi option by Gainbridge Fieldhouse.",
 [["AXIOS","https://www.axios.com/local/indianapolis/2024/04/03/sushi-restaurant-cityway-sushi-den"],["INDYMONTHLY",IM+"food-and-drinks/the-feed-6/the-feed-beards-bummer-city-way-sushi-parkside-pub/"]],
 "Axios opening review 2024 (open)",k="CityWay")

# ===================== MASS =====================
F(1,"MASS","Bazbeaux Pizza","329 Massachusetts Ave, Indianapolis, IN",["Pizza","Italian"],"Quattro Formaggi pie; thin crust with pine nuts, prosciutto and a mozzarella–provolone–pecorino blend",
 "Indy's pizza institution since 1986 (Broad Ripple), on Mass Ave since 1989 — 'consistently local pizza lovers' favorite', with a string of Best of Indy titles; named Indiana's best family pizza joint.",
 [["INDYMONTHLY",IM+"restaurant-guide/pizza-1/bazbeaux/"],["IBJ","https://www.ibj.com/articles/58933-morris-eating-bazbeaux-pizza-never-gets-old"],["WISH","https://www.wishtv.com/lifestylelive/bazbeaux-pizza-celebrates-30-years-in-indy/"],["FOX59","https://fox59.com/indiana-news/indianapolis-institution-named-best-family-pizza-joint-in-the-state/"]],
 "Visit Indy Mass Ave guide (open)")
F(2,"MASS","Bru Burger Bar","410 Massachusetts Ave, Indianapolis, IN",["American","Burgers"],"Three-meat (sirloin, chuck, brisket) burger; the Bru Burger with taleggio and tomato jam",
 "Mass Ave burger bar from Cunningham Restaurant Group — Reader's Digest named it Indiana's best burger; Indianapolis Monthly Best of Indy No. 9.",
 [["INDYMONTHLY",IM+"best-of-indy/no-9-bru-burger-bar/"],["FOX59","https://fox59.com/indiana-news/readers-digest-names-bru-burger-the-best-burger-in-indiana/"],["IBJ","https://www.ibj.com/articles/31809-dining-et-tu-bru"],["WISH","https://www.wishtv.com/focus-on-food/focus-on-food-stories/indianapolis-best-burger-restaurants-march-2025/"]],
 "WISH-TV top-rated burgers Mar 2025 (open)")
F(2,"MASS","Bakersfield Mass Ave","334 Massachusetts Ave, Indianapolis, IN",["Mexican","Tacos"],"Achiote-braised pork tacos; 100 tequilas and bourbons",
 "Late-night taco-tequila-whiskey bar of timbers, barrels and Edison bulbs — on Indianapolis Monthly's 25 Best Tacos list.",
 [["INDYMONTHLY",IM+"food-and-drinks/dining/the-25-best-tacos-in-indianapolis/"],["WISH","https://www.wishtv.com/lifestyle/bakersfield-cinco-de-mayo-event/"],["VISITINDY","https://www.visitindy.com/neighborhoods/mass-ave/"]],
 "Visit Indy Mass Ave guide; WISH-TV Cinco de Mayo segment (open)")
F(2,"MASS","St. Joseph Brewery & Public House","540 N College Ave, Indianapolis, IN",["Brewery","Pub"],"Confessional IPA brewed where the pulpit stood",
 "Brewpub inside a 135-year-old former Catholic church — a bar built from old pews and floor joists, the brewhouse where the altar was, award-winning Confessional IPA.",
 [["INDYMONTHLY",IM+"food-and-drinks/dining/making-amens-review-st-joseph-brewery-public-house/"],["WISH","https://www.wishtv.com/news/bibles-traded-for-beers-at-st-josephs-brewery/"],["VISITINDY",VI+"st-joseph-brewery-public-house/"]],
 "Visit Indy breweries directory; WISH family-brewery guide (open)",k="St. Joseph")

# ===================== SOUTH =====================
F(1,"SOUTH","Napoli Villa","758 Main St, Beech Grove, IN",["Italian"],"Three generations of family-recipe Italian (lasagna, veal, house sauce)",
 "Family-run Italian dining room founded in 1960 by military chef Guerino and on Beech Grove's Main Street since 1962 — one of Indianapolis's best locally owned Italian restaurants.",
 [["INDYMONTHLY",IM+"lifestyle/beech-grove-main-street-attractions/"],["WRTV","https://www.wrtv.com/open/were-open-indy-napoli-villa-open-in-beech-grove-since-1962"],["VISITINDY",VI+"napoli-villa/"]],
 "Visit Indy listing; Indianapolis Monthly Beech Grove guide (open)",k="Beech Grove")
F(2,"SOUTH","Beech Grove Pizza Company","702 Main St, Beech Grove, IN",["Pizza"],"The Ron Swanson (double bacon, pepperoni, ham, salami) on a fluffy-chewy crust",
 "Gothic-muralled Main Street pizzeria with a fluffy-yet-chewy hand-tossed crust; beer comes from the Scarlet Lane taproom next door.",
 [["INDYMONTHLY",IM+"lifestyle/beech-grove-main-street-attractions/"],["WISH","https://www.wishtv.com/news/allindiana/tasty-takeout-beech-grove-pizza/"],["VISITINDY",VI+"beech-grove-pizza-company/"]],
 "Visit Indy listing (open)",k="Beech Grove")
F(1,"SOUTH","The Suds","350 Market Plaza, Greenwood, IN",["American","Drive-In"],"Root beer floats, coney dogs and burgers from carhops",
 "1957 Dog 'n Suds drive-in (The Suds since 1973) keeping its '50s look and menu — open April to October, with Saturday cruise-ins of 200–300 classic cars; Car Craft named it a top-five US drive-in.",
 [["IBJ","https://www.ibj.com/property-lines-scott-olson/1548-car-enthusiasts-saving-the-suds"],["DAILYJOURNAL","https://dailyjournal.net/?p=1805917"],["VISITINDIANA","https://visitindiana.in.gov/blog/post/indiana-drive-in-restaurants/"]],
 "Seasonal (Apr–Oct); April reopening reported (Daily Journal via AOL) (open)",k="Greenwood")
F(2,"SOUTH","Burmese Restaurant","7040 Madison Ave, Indianapolis, IN",["Burmese"],"Laphet thoke (tea-leaf salad); mee goreng",
 "Little-Burma counter on the Madison Ave corridor — tea-leaf salad and a light, flavorful Malaysian-style mee goreng; an Indianapolis Monthly Swoon List and best-appetizers pick.",
 [["INDYMONTHLY",IM+"food-and-drinks/dining/swoon-list-kountry-kitchen-burmese-restaurant/"],["CULINARYCROSSROADS","https://culinarycrossroads.org/welcome-to-little-burma-a-bit-of-asia-in-central-indiana/"]],
 "Culinary Crossroads Little Burma guide; menu live on SinglePlatform (open)",k="Little Burma")
F(2,"SOUTH","Kimu Restaurant","1280 US Hwy 31 N, Greenwood, IN",["Burmese"],"Pork with pickled mango; Burmese curries and breakfast",
 "Greenwood Burmese kitchen serving Burmese breakfast, curries and pork with pickled mango to the south side's Chin and Burmese community.",
 [["VISITINDY",VI+"kimu-restaurant/"],["CULINARYCROSSROADS","https://culinarycrossroads.org/welcome-to-little-burma-finding-authentic-flavors-of-asia-in-central-indiana/"]],
 "Visit Indy current listing (open)",k="Greenwood")
F(2,"SOUTH","Revery","299 W Main St, Greenwood, IN",["American","Gastropub"],"Bone marrow, pig tails and poutine; meatloaf reworked; Bar Rev cocktails in back",
 "Progressive American gastropub that 'put Greenwood on the culinary map' in 2014 — ex-Mesh chefs cooking Indiana-raised meat in a historic Old Town building, with the dapper-divey Bar Rev behind. Indianapolis Monthly Best Restaurants 2018 / 25 Best (No. 24).",
 [["INDYMONTHLY",IM+"food-and-drinks/dining/revery-2018/"],["DAILYJOURNAL","https://dailyjournal.net/2025/10/09/greenwood-plans-designated-outdoor-refreshment-area-in-old-town/"],["VISITINDY",VI+"revery/"]],
 "Daily Journal Oct 2025: applied to join Greenwood's Old Town DORA (open)",k="Old Town Greenwood")
F(3,"SOUTH","Paradise Mx","7045 Emblem Dr, Indianapolis, IN",["Mexican","Dessert"],"Mexico City paletería-style ice cream (guava, tequila); dorilocos; tres leches waffles",
 "Mexican-owned Southport-area ice cream and snack parlour bringing Mexico City street sweets and dorilocos to the south side — an Indianapolis Monthly best-snacks pick; on Mirror Indy's best-ice-cream-flavors list.",
 [["INDYMONTHLY",IM+"global-eats/best-snacks-indianapolis/"],["WTHR","https://www.wthr.com/article/news/community/hispanic-heritage/mexican-owned-ice-cream-shop-brings-authentic-cuisine-to-indianapolis/531-8fb835b2-224f-4546-9c06-8491dd5be182"],["MIRROR","https://mirrorindy.org/the-scoop-on-indy-best-ice-cream-flavors/"],["WISH","https://www.wishtv.com/lifestyle/all-indiana/celebrating-national-ice-cream-month-with-paradise-mx/"]],
 "Mirror Indy ice-cream guide; WISH National Ice Cream Month segment (open)",k="Southport")
F(3,"SOUTH","Beech Bank Brewing Co.","301 Main St, Beech Grove, IN",["Brewery","Beer"],"Chocolate-mint porter, Kanu Bier, Roch Bock",
 "Beech Grove's first brewery — a laid-back Main Street taproom with an eight-barrel brewhouse; stars are a chocolate-mint porter and German-style lagers.",
 [["INDYMONTHLY",IM+"lifestyle/beech-grove-main-street-attractions/"],["IBJ","https://www.ibj.com/articles/70577-beech-bank-brewing-co-opens-in-beech-grove"],["WISH","https://www.wishtv.com/news/new-brewery-opens-in-beech-grove/"]],
 "Indianapolis Monthly Beech Grove Main Street guide (open)",k="Beech Grove")
F(2,"SOUTH","Brozinni Pizzeria","8810 S Emerson Ave, Ste 240, Indianapolis, IN",["Pizza"],"Fold-able New York–style slices; pan-baked Grandma pie; garlic knots",
 "South-side New York–style pizzeria — fermented house dough, slices to fold like a New Yorker and a puffy Grandma pie. Indianapolis Monthly Best Restaurants 2025 and 25 Essential Eats.",
 [["INDYMONTHLY",IM+"restaurant-guide/pizza-1/brozinni-pizzeria/"],["WTHR","https://www.wthr.com/article/news/local/brozinni-pizzeria-coming-to-speedway-indoor-karting-indiana-new-york-style-new-location/531-41319735-876c-47d3-bda1-2e0ef0980c2c"],["IBJ","https://www.ibj.com/articles/29187-inside-dish-pizzeria-novices-hit-their-stride-watch-sales-rise"],["WISH","https://www.wishtv.com/news/local-news/25-indy-pizza-joints-to-add-into-rotation-which-style-reigns-supreme/"]],
 "Indianapolis Monthly Best Restaurants 2025 (open; Speedway 2nd location)",k="Southport")
S(2,"SOUTH","Hannah House","3801 Madison Ave, Indianapolis, IN",
 "1858 Italianate brick mansion of Alexander Hannah on Madison Ave — NRHP-listed, linked by legend to the Underground Railroad and billed as one of Indiana's most haunted houses.",
 [["WIKIPEDIA",W+"Hanna%E2%80%93Ochler%E2%80%93Elder_House"],["INDYENCYCLOPEDIA","https://indyencyclopedia.org/hannah-house/"]],"Historic house (tours/events)")
S(3,"SOUTH","University of Indianapolis","1400 E Hanna Ave, Indianapolis, IN",
 "Methodist-founded (1902) university on land donated by William Elder — a 50-acre campus straddling the University Heights and Carson Heights neighbourhoods.",
 [["WIKIPEDIA",W+"University_of_Indianapolis"],["INDYENCYCLOPEDIA","https://indyencyclopedia.org/hannah-house/"]],"Active university campus",k="University Heights")
S(3,"SOUTH","Southeastway Park","5624 S Carroll Rd, Indianapolis, IN",
 "188-acre Indy Parks nature park in the far southeast corner of Marion County — 80 acres of forest, Buck Creek, a prairie preserve and a 2.5-mile paved trail.",
 [["WIKIPEDIA",W+"Southeastway_Park"],["INDYENCYCLOPEDIA","https://indyencyclopedia.org/parks-and-greenspaces/"]],"Indy Parks nature park (open)")
S(3,"SOUTH","Beech Grove Shops","Beech Grove, IN",
 "The Big Four railroad's 1904–08 locomotive shops that created Beech Grove as a company town — today Amtrak's primary heavy-maintenance facility.",
 [["WIKIPEDIA",W+"Beech_Grove_Shops"],["INDYENCYCLOPEDIA","https://indyencyclopedia.org/beech-grove-railroad-shop/"]],"Active Amtrak facility (view from outside)",k="Beech Grove")

# ===================== MID =====================
F(1,"MID","Bocca","122 E 22nd St, Indianapolis, IN",["Italian"],"Polpo (octopus), mushroom lasagna, tuna crudo",
 "'Next-generation Italian' in Fall Creek Place (the old Shoefly Public House corner) — modern small plates and handmade pasta; voted among Indy's top restaurants.",
 [["INDYMONTHLY",IM+"food-and-drinks/dining/bocca-brings-next-generation-italian/"],["VISITINDY",VI+"bocca/"],["WISH","https://www.wishtv.com/lifestylelive/indy-restaurant-bocca-offers-modern-italian-cuisine/"]],
 "Visit Indy current listing with hours (open)",k="Fall Creek Place")
F(2,"MID","Foundry Provisions","16th & Alabama Sts (Herron-Morton Place), Indianapolis, IN",["Cafe","Coffee"],"Tinker Coffee affogato; paninis on Amelia's bread with Smoking Goose meats",
 "Breakfast-and-lunch café and coffee bar in the old Herron School metalworking studio ('the Foundry') — Goose the Market alum Kimmie Burton; jazz nights.",
 [["INDYMONTHLY",IM+"food-and-drinks/dining/new-in-town-foundry-provisions/"],["IBJ","https://www.ibj.com/articles/43276-dining-foundry-pushes-geographical-boundaries-on-16th-street"],["WISH","https://www.wishtv.com/news/foundry-provisions-coffee-shop/"],["VISITINDY","https://www.visitindy.com/restaurants/beverages/coffeehouses/"]],
 "WISH-TV jazz-nights segment; Visit Indy coffeehouse list (open)",k="Herron-Morton Place")
F(2,"MID","Tea's Me Cafe","3967 N Illinois St, Indianapolis, IN",["Tea","Cafe"],"Loose-leaf teas and breakfast; First Friday spoken word",
 "Indy's premier tea bar for serious tea drinkers, owned by WNBA great and Fever legend Tamika Catchings — breakfast hours and a First Friday spoken-word series.",
 [["INDYMONTHLY",IM+"food-and-drinks/dining/teas_me_revist/"],["VISITINDY",VI+"teas-me-cafe-butler-tarkington/"]],
 "Visit Indy current listing (open)",k="Butler-Tarkington")

# ===================== NORTH =====================
F(1,"NORTH","Anthony's Chophouse","201 W Main St, Carmel, IN",["Steakhouse"],"Single-sourced Greeley, Colorado corn-fed steaks; the original Glass Chimney bar",
 "Glass-walled 9,000 sq ft Carmel steakhouse from the Ritz Charles family, white tablecloths and green velvet, with the bar salvaged from the beloved Glass Chimney. Indianapolis Monthly Best New Restaurants 2019; 'Face of Steaks' 2025.",
 [["INDYMONTHLY",IM+"food-and-drinks/reviews/review-anthonys-chophouse/"],["CURRENT","https://youarecurrent.com/2024/06/10/anthonys-chophouse-offers-lunch/"],["HAMILTONCOUNTY","https://www.visithamiltoncounty.com/cities/carmel/restaurants/"]],
 "Current 2024 (adds lunch); Indianapolis Monthly Faces 2025 (open)",k="Carmel")
F(2,"NORTH","Monterey Coastal Cuisine","110 W Main St (Sophia Square), Carmel, IN",["Seafood","Steakhouse"],"Fresh seafood and sushi, surf-and-turf",
 "Award-winning surf-and-turf dining room on the ground floor of Sophia Square in Carmel's Arts & Design District, just east of the Monon.",
 [["IBJ","https://www.ibj.com/articles/roundup-monterey-coastal-cuisine-to-open-next-month-in-carmels-sophia-square-building"],["CURRENT","https://youarecurrent.com/2021/03/10/monterey-coastal-cuisine-to-debut-april-3-in-downtown-carmel/"],["HAMILTONCOUNTY","https://www.visithamiltoncounty.com/blog/stories/post/a-luxurious-weekend-getaway-or-staycation-in-carmel-indiana/"]],
 "Visit Hamilton County Carmel guide (open)",k="Carmel")
F(2,"NORTH","Tiburon Coastal Cuisine","8701 E 116th St, Fishers, IN",["Seafood"],"Coastal-California seafood plates",
 "Monterey's Fishers sister in the Nickel Plate District — a seafood-heavy, coastal-California room that Visit Hamilton County calls one of Fishers' most sought-after dining destinations.",
 [["IBJ","https://www.ibj.com/articles/owners-of-high-end-carmel-seafood-restaurant-plan-sister-eatery-in-fishers"],["CURRENT","https://www.youarecurrent.com/2021/11/03/monterey-coastal-cuisine-co-owners-to-open-new-restaurant/"],["HAMILTONCOUNTY","https://www.visithamiltoncounty.com/cities/fishers/things-to-do/nickel-plate-district/"]],
 "Visit Hamilton County Nickel Plate District guide (open)",k="Fishers")
F(2,"NORTH","Cafe Patachou Nickel Plate","E 116th St (Nickel Plate Trail), Fishers, IN",["American","Breakfast"],"Omelettes, the Cuban breakfast, cinnamon toast",
 "Fishers outpost (2024) of Martha Hoover's Café Patachou — the 1989 Indy breakfast institution Bon Appétit named among the country's top ten breakfast spots — right on the Nickel Plate Trail.",
 [["WTHR","https://www.wthr.com/article/money/business/cafe-patachou-opens-new-location-in-fishers-nickel-plate-trail/531-72fdafbf-ae1c-4905-8865-e56d9082fc58"],["WISH","https://www.wishtv.com/lifestyle/lifestylelive/cafe-patachou-opens-fishers-lifestyle/"],["HAMILTONCOUNTY","https://www.visithamiltoncounty.com/blog/stories/post/hot-new-restaurants-in-hamilton-county/"]],
 "Visit Hamilton County 'Hot & New' (open)",k="Fishers")
F(2,"NORTH","Tipsy Mermaid","135 S Main St, Zionsville, IN",["Caribbean","Seafood"],"Conch fritters, conch ceviche, peel-and-eat shrimp, smoked fish dip",
 "Key West conch house on Zionsville's brick Main Street from restaurateur Shari Jenkins — Cuban, Bahamian and Keys flavours, rare in Indiana.",
 [["IBJ","https://www.ibj.com/articles/zionsville-natives-new-eatery-to-have-key-west-theme"],["FOX59","https://fox59.com/indy-now/new-indy-zionsville-restaurants-may-9/"],["INDYMONTHLY",IM+"food-and-drinks/the-feed-nashville-hot-chicken-tipsy-mermaid-and-more/"],["CURRENT","https://youarecurrent.com/2023/06/07/zionsville-resident-to-bring-key-west-culture-to-the-midwest/"]],
 "Visit Hamilton County / WTHR Yelp-Elites top-25 measurement 2025 (open)",k="Zionsville")
F(3,"NORTH","Nyla's","211 Park St, Westfield, IN",["American"],"Pork chop smothered in tomato-bacon jam; fried green tomatoes",
 "Steak-and-seafood Americana with two cocktail bars in a repurposed barn on Westfield's Restaurant Row (Nyla and Scott Wolf).",
 [["CURRENT","https://www.youarecurrent.com/2021/02/24/nylas-set-to-open-in-westfield-in-may/"],["HAMILTONCOUNTY","https://www.visithamiltoncounty.com/blog/stories/post/hot-new-restaurants-in-hamilton-county/"]],
 "Visit Hamilton County 'Hot & New' (open)",k="Westfield")
F(2,"NORTH","Cheeky Bastards","11210 Fall Creek Rd, Indianapolis (Fishers), IN",["British"],"Fish and chips with house tartar; Yorkshire eggs; scones with clotted cream",
 "British pub-and-tea-room near Geist doing the standards properly — fish and chips, Yorkshire eggs, cream tea. Indianapolis Monthly Best Restaurants 2024 & 2025.",
 [["INDYMONTHLY",IM+"food-and-drinks/best-restaurants-2024-cheeky-bastards/"],["FOX59","https://fox59.com/indy-now/indy-restaurant-news-fishers-westfield/"]],
 "Indianapolis Monthly Best Restaurants 2025 (open)",k="Geist")

# ===================== EAST =====================
F(1,"EAST","Kan-Kan Cinema & Brasserie","1258 Windsor St, Indianapolis, IN",["Japanese","Pizza"],"Japanese tavern-inspired plates; King Dough 'Final Cut' slices",
 "Indy's independent nonprofit art-house cinema and restaurant in Windsor Park — three screens plus a bar-brasserie that switched to a Japanese tavern menu (Axios 2025) and a King Dough slice shop.",
 [["INDYMONTHLY",IM+"food-and-drinks/kan-kan-cinema-and-brasserie-steals-the-show/"],["AXIOS","https://www.axios.com/local/indianapolis/2025/03/24/kan-kans-new-japanese-inspired-menu"],["IBJ","https://www.ibj.com/blogs/property-lines/art-house-movie-theater-and-restaurant-opening-in-windsor-park"],["WISH","https://www.wishtv.com/news/allindiana/tasty-takeout-kan-kan-cinema-and-brasserie/"]],
 "Axios Mar 2025 new menu (open)",k="Windsor Park")
F(2,"EAST","The Med","5614 E Washington St, Indianapolis, IN",["Greek","Mediterranean"],"Falafel (Axios: some of Indy's best), gyros, baked lamb, spanakopita",
 "Greek-Mediterranean kitchen in the old Legend Classic Irvington Cafe space — Axios rates its falafel among the city's best.",
 [["AXIOS","https://www.axios.com/local/indianapolis/2023/09/25/meatless-monday-the-med-irvington-indianapolis"],["WISH","https://www.wishtv.com/news/tasty-takeout-the-med-in-irvington/"],["IBJ","https://www.ibj.com/articles/mediterranean-restaurant-planned-for-former-site-of-the-legend-cafe-in-irvington"]],
 "WISH Tasty Takeout (open)",k="Irvington")
F(2,"EAST","Smash'd Burger Bar","10 Johnson Ave, Indianapolis, IN",["American","Burgers"],"Smashed-patty burgers (PBJ Time with honey-roasted peanut butter; Big Kahuna)",
 "Irvington smashburger counter that sold out of 500 patties by 6pm on opening day — an Indianapolis Monthly taste-test pick in Indy's smashburger boom.",
 [["AXIOS","https://www.axios.com/local/indianapolis/2023/07/12/irvington-burger-restaurants"],["INDYMONTHLY",IM+"food-and-drinks/indy-must-eat-burger-spots/"],["FOX59","https://fox59.com/indy-now/indy-monthly/taste-test-tuesday-with-indy-monthly-ft-smashd-burger-bar/"]],
 "Indianapolis Monthly smashburger taste test (open)",k="Irvington")
F(2,"EAST","Your Local Deli and Market","5543 E Washington St, Indianapolis, IN",["Deli","American"],"Cranturkey, Drunkin Radish and Beer and Bacon sandwiches",
 "Family-owned Irvington staple — meat-and-cheese counter, local-goods grocery and sandwich shop; an Indianapolis Monthly best-specialty-markets pick.",
 [["INDYMONTHLY",IM+"lifestyle/shopping/best-specialty-markets-of-indy/"],["IBJ","https://www.ibj.com/articles/54062-dining-your-local-deli-meets-meat-expectations"]],
 "Indianapolis Monthly specialty markets / east-side guide (open)",k="Irvington")
F(3,"EAST","Rock-Cola 50s Cafe","5730 Brookville Rd, Indianapolis, IN",["American","Diner"],"Burgers, onion rings, flavored Cokes and cinnamon shakes",
 "900 sq ft checkered-floor '50s diner in a 1961 Peppy Grill building — a handful of booths and counter stools facing the flat-top. WRTV historic restaurants that still hold up; IM Cheap Eats.",
 [["WRTV","https://www.wrtv.com/lifestyle/food/7-historic-indianapolis-restaurants-that-have-stood-the-test-of-time"],["INDYMONTHLY",IM+"restaurant-guide/diner-1/rock-cola-50s-cafe/"],["WISH","https://www.wishtv.com/news/dick-wolfsie-stops-by-rock-cola-50s-cafe/"],["VISITINDY",VI+"rock-cola-cafe/"]],
 "Visit Indy listing; WISH top breakfast list (open)")

# ===================== FSQ / WEST =====================
F(1,"FSQ","La Margarita","501 Virginia Ave, Indianapolis, IN",["Mexican","Tacos"],"Tacos and margaritas",
 "Fountain Square's beloved family Mexican spot, which closed unexpectedly in early 2025 and rose again in July 2025 on Virginia Ave in Fletcher Place (ground floor of the Slate apartments).",
 [["AXIOS","https://www.axios.com/local/indianapolis/2025/05/07/la-margarita-finds-new-home-in-fletcher-place"],["INDYMONTHLY",IM+"food-and-drinks/the-feed-6/the-feed-kan-kan-king-dough-la-margarita-reopens/"],["IBJ","https://www.ibj.com/articles/la-margarita-restaurant-to-move-to-factory-arts-district"]],
 "Indianapolis Monthly 'La Margarita reopens' July 2025 (open)",k="Fletcher Place")
F(2,"FSQ","Siam Square","936 Virginia Ave, Indianapolis, IN",["Thai"],"Thai curries and noodle dishes",
 "Ed Rudisell's locally owned Thai restaurant in historic Fountain Square, long rated one of Indy's best ethnic restaurants.",
 [["INDYMONTHLY",IM+"restaurant-guide/thai-1/siam-square/"],["IBJ","https://www.ibj.com/articles/2479-dining-iphone-app-leads-us-to-siam-square"],["VISITINDY",VI+"siam-square/"]],
 "Visit Indy current listing; Indianapolis Monthly Feed (open)")
F(2,"WEST","Dawson's on Main","1464 Main St, Speedway, IN",["American","Tenderloin"],"Breaded pork tenderloin (outsells everything else four to one)",
 "Speedway Main Street grill (Hill family, 2006) a few blocks from the Speedway — its Hoosier breaded tenderloin is the runaway best seller; a race-week institution.",
 [["WTHR","https://www.wthr.com/article/news/local/whats-cooking-dawsons-on-main/531-3bddb929-4a4d-441f-b6b6-97ce729a3981"],["FOX59","https://fox59.com/video/wheres-sherman-dawsons-on-main/8675118/"],["WISH","https://www.wishtv.com/sports/indy-500/10-off-track-escapes-for-local-flavor-on-speedways-main-street/"]],
 "WISH Indy 500 Main Street guide (open)",k="Speedway")
