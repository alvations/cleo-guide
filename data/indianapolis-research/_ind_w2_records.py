# W2 records (2026-10-03) — every field from a WebSearch result logged in AUDIT.md. Run: python3 _ind_w2_records.py
# Writes FOOD_W2.json / SIGHTS_W2.json / geo/_geoout_w2.json via _ind_add_w2.py; outlets → SOURCES_W2.json.
import json, subprocess, sys, os
D=os.path.dirname(os.path.abspath(__file__))
def add(kind, rec, geo=None):
    a=[sys.executable,os.path.join(D,"_ind_add_w2.py"),kind,json.dumps(rec,ensure_ascii=False)]
    if geo: a.append(json.dumps(geo,ensure_ascii=False))
    subprocess.run(a,check=True)
W="https://en.wikipedia.org/wiki/"
IM="https://www.indianapolismonthly.com/"
def g(n,addr,lat,lng,src,conf="high",status="open",ss="",note=None):
    d={"n":n,"address":addr,"lat":lat,"lng":lng,"geoSource":src,"confidence":conf,"status":status,"statusSource":ss}
    if note: d["note"]=note
    return d
UNV=lambda n,addr,ss,note="Apple Maps/Wikipedia searches return no place coordinate for this restaurant; queue for tools/geocode-helper.html": g(n,addr,None,None,"UNVERIFIED",conf="UNVERIFIED",ss=ss,note=note)
def F(t,a,n,addr,cz,dish,w,sources,ss,geo=None,k=None):
    r={"t":t,"a":a,"cz":cz,"dish":dish,"n":n,"address":addr,"w":w,"closed":False,"sources":sources}
    if k: r["k"]=k
    add("food",r,geo or UNV(n,addr,ss))
def S(t,a,n,addr,w,sources,ss,geo=None,k=None):
    r={"t":t,"a":a,"n":n,"address":addr,"w":w,"sources":sources}
    if k: r["k"]=k
    add("sight",r,geo or UNV(n,addr,ss,note="no published place coordinate found via WebSearch; queue for tools/geocode-helper.html"))
STUTZ=(39.78167,-86.16194,"Wikipedia NRHP coords of the Stutz Factory building (1060 N Capitol Ave), which houses this venue: 39°46′54″N 86°9′43″W ("+W+"Stutz_Motor_Car_Company)")

# ---- batch 1 ----
F(1,"WEST","Borage","1609 N Lynhurst Dr, Speedway, IN",["American","Bakery"],"Smash burger, deviled eggs, house pastries (coffee-soaked tart cherry chocolate cookie)",
 "Café-bakery-market a short walk from the Speedway, opened 2024 by ex-Milktooth chefs Josh Kline and Zoë Taylor — European-leaning dishes built on Indiana farm produce. Indianapolis Monthly Best Restaurants 2025.",
 [["INDYMONTHLY",IM+"best-restaurants-of-2025/"],["MIRROR","https://mirrorindy.org/borage-speedway-restaurant-westside-indianapolis-fresh-take-on-classic-food/"],["IBJ","https://www.ibj.com/articles/former-milktooth-chefs-bring-new-perspective-to-speedway-venture"]],
 "Indianapolis Monthly Best Restaurants 2025 (open); Mirror Indy feature",k="Speedway")
F(2,"FSQ","Magdalena","1127 Shelby St, Indianapolis, IN",["Cocktail Bar","Seafood"],"Cocktails with Hoosier brandies and Indiana persimmon; New Orleans-style seafood",
 "Fountain Square cocktail bar-restaurant in the old Thunderbird space from Ben Davis grad Nick Detrich (New Orleans/London bar veteran) — Hoosier-lore cocktails, Gulf-seafood plates, fried-chicken-and-Champagne nights.",
 [["INDYMONTHLY",IM+"best-restaurants/best-restaurants-2026-magdalena-serliana/"],["VISITINDY","https://www.visitindy.com/blog/post/three-new-restaurants-for-your-next-meeting/"]],
 "Indianapolis Monthly Best Restaurants 2026 (open)")
F(1,"DTN","Julieta Taco Shop","1060 N Capitol Ave, Suite 1-103 (Stutz courtyard), Indianapolis, IN",["Mexican","Tacos"],"Al pastor and carnitas on nixtamalized corn tortillas; the broccolini taco",
 "Counter-service taqueria tucked into the Stutz building courtyard (Esteban Rosas & Gabriel Sañudo) — fresh masa tortillas, rotating tacos, lunch only. Named Indiana's best hole-in-the-wall taco joint (Cheapism) and on a national top-100 taco list.",
 [["INDYMONTHLY",IM+"restaurants-2024/best-restaurants-2024-julieta-taco-shop/"],["FOX59","https://digital-release.fox59.com/indiana-news/delicioso-2-indy-taco-spots-land-in-national-top-100-list"],["CHEAPISM","https://www.aol.com/finance/best-hole-wall-taco-joint-140000228.html"]],
 "Indianapolis Monthly Best Restaurants 2025 (Fernando's–Julieta installment, open)",
 geo=g("Julieta Taco Shop","1060 N Capitol Ave, Suite 1-103 (Stutz courtyard), Indianapolis, IN",STUTZ[0],STUTZ[1],STUTZ[2],conf="med",ss="Indianapolis Monthly Best Restaurants 2025 (open)",note="venue is inside the Stutz building; pin = building point"))

# ---- batch 2 (drinks & coffee) ----
AX_BREW="https://www.axios.com/local/indianapolis/2023/10/10/indianapolis-brewery-tour-best-craft-beer"
VI_BREW="https://www.visitindy.com/restaurants/beverages/breweries/"
F(1,"MASS","Coat Check Coffee","401 E Michigan St (The Athenaeum), Indianapolis, IN",["Coffee","Pastry"],"Pistachio latte (house pistachio orgeat, rose water, lemon peel); currywurst croissant",
 "Three-level café in the Athenaeum's old coat-check rooms — grand staircase, stained glass, German-leaning pastries; its pistachio latte is a cult order among Indy coffee people.",
 [["INDYMONTHLY",IM+"food-and-drinks/indys-most-buzzworthy-coffee/"],["AXIOS","https://www.axios.com/local/indianapolis/2023/04/07/indianapolis-coffee-shops-remote-work"]],
 "Indianapolis Monthly 'Indy's Most Buzzworthy Coffee' (open)",
 geo=g("Coat Check Coffee","401 E Michigan St (The Athenaeum), Indianapolis, IN",39.773333,-86.150278,"Wikipedia infobox of the Athenaeum building that houses it, 39°46′24″N 86°9′1″W ("+W+"Athen%C3%A6um_(Das_Deutsche_Haus))",conf="med",ss="Indianapolis Monthly 'Indy's Most Buzzworthy Coffee' (open)",note="café occupies the Athenaeum; pin = building point"),k="Lockerbie")
F(1,"WEST","Guggman Haus Brewing Co.","1701 Gent Ave, Indianapolis, IN",["Brewery","Beer"],"German-style lagers and 15+ house beers with a walk-up kitchen in the beer garden",
 "Family-run near-westside microbrewery on a site steeped in racing history, with a year-round beer garden — voted Indy's Best Brewery (FOX59, 2022) and named among the city's leading breweries by Axios.",
 [["FOX59","https://fox59.com/morning-news/indys-best/guggman-haus-brewing-co-wins-indys-best-brewery/"],["AXIOS",AX_BREW],["IBJ","https://www.ibj.com/blogs/property-lines/74046-guggman-haus-brewing-co-opens-on-near-west-side"]],
 "Visit Indy breweries directory + Axios brewery guide (open)")
F(2,"FSQ","Metazoa Brewing Co.","140 S College Ave, Indianapolis, IN",["Brewery","Beer"],"Hoppopotamus IPA",
 "Dog-friendly brewery with its own dog park off South College Ave that gives 5% of profits to animal and wildlife groups; its Hoppopotamus IPA is on taps all over town. Indianapolis Monthly Best New Breweries.",
 [["INDYMONTHLY",IM+"food-and-drinks/drinks/best-new-breweries-metazoa/"],["AXIOS",AX_BREW],["DOWNTOWNINDY","https://downtownindy.org/go/metazoa-brewing-company"]],
 "Downtown Indy listing + Axios brewery guide (open)",k="Fletcher Place")
F(2,"FSQ","Fountain Square Brewing Co.","1301 Barth Ave, Indianapolis, IN",["Brewery","Beer"],"Workingman's Pilsner, Preacher's Daughter Amber Ale",
 "The neighbourhood's own brewery just south of downtown — solid core lineup (Workingman's Pilsner, Preacher's Daughter Amber, Soul Ride IPA) plus inventive seasonals.",
 [["VISITINDY",VI_BREW],["AXIOS",AX_BREW]],
 "Visit Indy breweries directory (open)")

# ---- batch 3 (IM Best Restaurants 2025/2026 + a 2nd outlet) ----
IM26="https://www.indianapolismonthly.com/the-best-restaurants-of-2026/"
F(1,"EAST","Strange Bird","128 S Audubon Rd, Indianapolis, IN 46219",["Cocktail Bar","Ramen","Seafood"],"Tiki rum cocktails, oysters, scratch ramen; fried shiitakes with black-vinegar honey",
 "Irvington rum-and-oyster bar (2019) from the Warner brothers with Love Handle's Benedyks — woven walls, hanging plants, deep rum list, oysters and house ramen. Indianapolis Monthly Best Restaurants 2026; Imbibe's where-to-drink-in-Indianapolis pick.",
 [["INDYMONTHLY",IM+"food-and-drinks/reviews/review-strange-bird/"],["WISH","https://wishtv.com/gr8comeback/gr8-comeback-strange-bird-tiki-bar-comes-to-irvington"],["IMBIBE","https://imbibemagazine.com/?p=92839"]],
 "Indianapolis Monthly Best Restaurants 2026 (open)",k="Irvington")
F(2,"FSQ","Monti Aperitivo & Cucina","1110 Shelby St, Indianapolis, IN",["Italian","Cocktails"],"Spritzes and vermouth; house focaccia and scratch pasta",
 "Fountain Square aperitivo bar and trattoria modelled on Rome's Monti district (from Bovaconti Coffee's Minda Balcius; chef Francesco Settanni) — vermouth-forward bar, focaccia, scratch pasta, gelato. Indianapolis Monthly Best Restaurants 2026.",
 [["INDYMONTHLY",IM26],["VISITINDY","https://www.visitindy.com/directory/monti-aperitivo-cucina/"]],
 "Indianapolis Monthly Best Restaurants 2026 (open)")
F(2,"BRIP","Corridor","1134 E 54th St, Indianapolis, IN",["Mediterranean","Italian"],"Falafel sandwich with beet slaw and lemon tahini; fresh pasta (blond puttanesca)",
 "Lunch-only Mediterranean/North African/Arab-world kitchen and pasta market (chefs Erin Kem & Logan McMahan) that replaced Nicole-Taylor's in January 2025; evenings are chef's-table dinners. Indianapolis Monthly Best Restaurants 2025 & 2026.",
 [["INDYMONTHLY",IM+"best-restaurants/best-restaurants-2025-borage-corridor/"],["IBJ","https://www.ibj.com/articles/nicole-taylors-restaurant-to-rebrand-as-corridor-in-2025"]],
 "Indianapolis Monthly Best Restaurants 2026 (open)",k="SoBro")

# ---- batch 4 (east side / westside International Marketplace) ----
F(1,"EAST","Tlaolli","2830 E Washington St, Indianapolis, IN",["Mexican","Tacos"],"Hibiscus-flower tacos, pork carnitas tacos, tamales",
 "Carlos Hutchinson's Mexican kitchen that grew from a tamale takeout window into a full restaurant — traditional carnitas beside slow-cooked hibiscus 'tacos de jamaica' and creative vegan plates. On Diners, Drive-Ins and Dives (2024) and ranked No. 41 on Yelp's 2025 top-100 US taco list.",
 [["MIRROR","https://mirrorindy.org/tlaolli-diners-drive-ins-dives-indianapolis-flavortown-guy-fieri/"],["AXIOS","https://www.axios.com/local/indianapolis/2025/10/03/indy-s-taco-scene-ranks-nationally"],["WISH","https://wishtv.com/?p=1224998"]],
 "Axios Oct 2025 taco ranking (open)")
F(3,"WEST","Al-Rayan Restaurant & Bakery","4857 W 38th St, Indianapolis, IN",["Middle Eastern","Bakery"],"Arabian Peninsula (Yemeni) plates and its own bakery breads",
 "International Marketplace restaurant-bakery cooking the food of the Arabian Peninsula — a stop on WRTV's tour of the 80-restaurant Lafayette Rd/38th St corridor and on Visit Indiana's International Marketplace guide.",
 [["WRTV","https://www.wrtv.com/lifestyle/food/take-a-tour-of-indianapolis-international-marketplace-full-of-global-cuisine"],["VISITINDIANA","https://visitindiana.in.gov/blog/post/international-marketplace-indy/"]],
 "WRTV International Marketplace tour; Visit Indiana guide (open)",k="International Marketplace")
WRTV_PHO="https://www.wrtv.com/entertainment/inside-indy/food/where-to-eat-pho-in-indianapolis"
IM_PHO=IM+"food-and-drinks/dining/top-five-phos/"
F(2,"WEST","King Wok","4150 Lafayette Rd, Indianapolis, IN",["Vietnamese"],"Pho with a light, pristine broth; made-to-order stir-fries and noodle dishes",
 "Lafayette Road Vietnamese long applauded by Indy pho devotees — Indianapolis Monthly's 'Star Player' in its Top Five Phos, and first on WRTV's where-to-eat-pho list.",
 [["INDYMONTHLY",IM_PHO],["WRTV",WRTV_PHO]],"WRTV pho guide lists current hours (open; closed Tuesdays)",k="International Marketplace")
F(2,"WEST","Sizzling Wok Hai","4351 Lafayette Rd, Indianapolis, IN",["Vietnamese"],"Dark, deep pho; lemongrass chicken, rice-paper rolls, clay-pot dishes",
 "International Marketplace Vietnamese with a fortified, dark-broth pho, curries and clay pots — some of Indy's best rice-paper rolls and lemongrass chicken per Indianapolis Monthly's Top Five Phos; on WRTV's pho list.",
 [["INDYMONTHLY",IM_PHO],["WRTV",WRTV_PHO]],"WRTV pho guide lists current hours (open)",k="International Marketplace")
F(3,"SOUTH","Egg Roll #1 (Pho #1)","4540 S Emerson Ave, Indianapolis, IN",["Vietnamese"],"Egg rolls and pho",
 "Southeast-side Vietnamese counter on Emerson Ave — an Indianapolis Monthly 'Cheap Eats' pick and on WRTV's where-to-eat-pho list.",
 [["INDYMONTHLY",IM+"food-and-drinks/dining/cheap-eats-24-wallet-friendly-indy-restaurants/"],["WRTV",WRTV_PHO]],"WRTV pho guide (listed as open)")

# ---- batch 5 (bars: Imbibe 'Where to Drink in Indianapolis' + a 2nd outlet) ----
IMBIBE_IND="https://imbibemagazine.com/where-to-drink-in-indianapolis/"
F(1,"FSQ","The Inferno Room","902 Virginia Ave, Indianapolis, IN 46203",["Cocktail Bar"],"Tropical tiki classics and house rum cocktails",
 "High-end tiki bar (2018) in a former Marion County courthouse building — part bar, part museum, holding one of the largest collections of Papua New Guinea tribal art outside a museum. Imbibe's Indianapolis pick; World's 50 Best Discovery listing.",
 [["IMBIBE",IMBIBE_IND],["INDYMONTHLY",IM+"features/isle-of-tiki/"],["VISITINDIANA","https://visitindiana.in.gov/blog/post/inferno-room-tiki-bar/"],["WORLDS50BEST","https://www.theworlds50best.com/discovery/Establishments/US/Indianapolis/The-Inferno-Room.html"]],
 "Visit Indy directory + World's 50 Best Discovery listing (open)",k="Fountain Square")
F(2,"FSQ","The Commodore","1107 Prospect St (Fountain Square Theatre Building), Indianapolis, IN",["Cocktail Bar"],"Clarified milk punches",
 "Signless speakeasy lounge inside the rambling 1928 Fountain Square Theatre Building — leather sofas, dim light and top-notch cocktails (Imbibe; Indianapolis Monthly's pandemic-era cocktail-bar openings).",
 [["IMBIBE",IMBIBE_IND],["INDYMONTHLY",IM+"food-and-drinks/four-indy-cocktail-bars-that-opened-their-doors-during-the-pandemic/"]],
 "Imbibe Indianapolis guide (open)",
 geo=g("The Commodore","1107 Prospect St (Fountain Square Theatre Building), Indianapolis, IN",39.7521,-86.1396,"Wikipedia infobox of the Fountain Square Theatre building that houses it, 39°45′08″N 86°08′23″W ("+W+"Fountain_Square_Theatre)",conf="med",ss="Imbibe Indianapolis guide (open)",note="bar is inside the Fountain Square Theatre Building; pin = building point"),k="Fountain Square")
F(3,"FSQ","Square Cat Vinyl","1054 Virginia Ave, Indianapolis, IN 46203",["Bar","Coffee"],"Coffee bar plus local beer and cider, with in-store live sets",
 "Fountain Square record shop that is also a bar, coffee counter and small live-music room — on Imbibe's where-to-drink list; IBJ covered its expansion with a kitchen.",
 [["IMBIBE",IMBIBE_IND],["IBJ","https://www.ibj.com/articles/fountain-square-record-store-to-add-kitchen-as-part-of-expansion"],["DOWNTOWNINDY","https://downtownindy.org/go/square-cat-vinyl"]],
 "Downtown Indy listing (open)",k="Fountain Square")

# ---- batch 6 (Midtown — Butler-Tarkington) ----
F(2,"MID","Tinker Coffee — The Firehouse","5555 N Illinois St, Indianapolis, IN",["Coffee","Cafe"],"House-roasted Tinker coffee by day; beer, wine and low-ABV cocktails with shareables after 4 pm",
 "Indy roaster Tinker Coffee's café in Butler-Tarkington's 1932 Station 16 firehouse (ex-Chalet) — the Market Street café menu in the morning, a casual dinner-and-drinks room from 4 pm.",
 [["IBJ","https://www.ibj.com/articles/tinker-coffee-to-open-butler-tarkington-cafe-in-former-firehouse"],["AXIOS","https://www.axios.com/local/indianapolis/2024/10/29/tinker-coffee-butler-tarkington-cafe"],["WISH","https://wishtv.com/?p=1312547"]],
 "Axios Oct 2024 opening; WISH 'Monday Jolt' feature (open)",k="Butler-Tarkington")
F(2,"MID","Oh Yumm! Bistro","5615 N Illinois St, Indianapolis, IN",["American","Comfort"],"Fried green tomatoes with pesto and grilled corn; chocolate-chip bread pudding",
 "Butler-Tarkington's neighbourhood bistro since 2001, five minutes from Butler's campus — Southern-leaning small plates and kicked-up comfort food; Indianapolis Monthly's pick for a pre-show dinner on the Illinois St strip.",
 [["IBJ","https://www.ibj.com/articles/14790-dining-appetizing-name-raises-restaurant-expectations"],["INDYMONTHLY",IM+"food-and-drinks/dining/street-savvy-butler-tarkington-neighborhood/"],["VISITINDIANA","https://visitindiana.in.gov/blog/post/yumm/"]],
 "Current hours listed Tue–Sun (open)",k="Butler-Tarkington")
F(2,"MID","The Melody Inn","3826 N Illinois St, Indianapolis, IN",["Bar"],"Cheap beer and Saturday Punk Rock Night (since 2000)",
 "Butler-Tarkington dive that opened as a piano bar in 1935 (original floor, metalwork and back-bar mirror) — home of Punk Rock Night, the world's longest-running weekly punk showcase; 7,000+ acts since 2001.",
 [["WIKIPEDIA",W+"Melody_Inn_(nightclub)"],["INDYMONTHLY",IM+"best-bars/no-24-melody-inn/"],["IBJ","https://www.ibj.com/articles/22348-owners-enjoy-melody-inn-s-niche-as-well-worn-music-venue"]],
 "punkrocknight.com: weekly shows every Saturday at the Melody Inn (current site, checked 2026-10-03)",
 geo=g("The Melody Inn","3826 N Illinois St, Indianapolis, IN",39.825583,-86.159472,"Wikipedia infobox 39°49′32.1″N 86°9′34.1″W ("+W+"Melody_Inn_(nightclub))",ss="punkrocknight.com: weekly shows every Saturday at the Melody Inn (current site, checked 2026-10-03)"),k="Butler-Tarkington")
F(2,"MID","Hoagies & Hops (Chilly Water Taproom)","4155 Boulevard Pl, Indianapolis, IN",["Sandwiches","Brewery"],"Philly cheesesteak on South Jersey Liscio's rolls; hoagies with Chilly Water beer",
 "Kristina Mazza's Southeast-Pennsylvania sandwich shop (2015) sharing a roof with Chilly Water's Butler-Tarkington taproom — imported South Jersey bread, Pennsylvania Dutch meats and sides.",
 [["INDYMONTHLY",IM+"lifestyle/street-savvy-butler-tarkington/"],["WISH","https://wishtv.com/?p=885538"],["EDIBLEINDY","https://edibleindy.ediblecommunities.com/guide/hoagies-hops"]],
 "WISH National Cheesesteak Day feature; current hours listed (open)",k="Butler-Tarkington")

# ---- batch 7 (south side) ----
F(2,"SOUTH","Oaken Barrel Brewing Co.","50 N Airport Pkwy, Suite L, Greenwood, IN 46143",["Brewery","Beer"],"Oaktoberfest (2016 Brewers' Cup gold, European Amber Lager)",
 "Indiana's second-oldest craft brewery (1994) — a Greenwood brewpub with family room, two bars and patio; celebrated 30 years on 4 July 2024.",
 [["WRTV","https://www.wrtv.com/open/oaken-barrels-kwang-casey-on-beer-owning-the-states-second-oldest-brewery-aapi-heritage-month"],["NUVO","https://www.nuvo.net/beerbuzz/in-2024-indianas-craft-breweries-are-celebrating-momentous-anniversaries/article_a1125310-3fae-11ef-9b04-9f52ebcaaf37.html"]],
 "NUVO 2024: 30th anniversary in business (open)",k="Greenwood")

# ---- batch 8 (north suburbs) ----
F(1,"NORTH","Field Brewing","303 E Main St, Westfield, IN",["Brewery","New American"],"Crispy lamb ribs with chimichurri; maple-bacon Brussels sprouts; house beers",
 "Westfield's chef-driven brewpub (2018) — ex-Cerulean/Bluebeard chef Alan Sternberg, twice a James Beard Rising Chef nominee, runs the kitchen beside the Dikos family's house brews. Indianapolis Monthly Best Restaurants 2026.",
 [["INDYMONTHLY",IM+"food-and-drinks/reviews/review-field-brewing"],["CURRENT","https://www.youarecurrent.com/?p=168517"],["TOWNEPOST","https://townepost.com/indiana/westfield/field-brewing/"]],
 "Indianapolis Monthly Best Restaurants 2026 (open)",k="Westfield")
F(1,"NORTH","Good Omen","65 Boone Village, Zionsville, IN 46077",["Italian"],"Duck bolognese; butternut squash ravioli; aperitivo hour",
 "Mother-and-son (Diane & chef Nicholas Gattone) Northern Italian restaurant in Zionsville's Boone Village — seasonal menu, fresh pasta, aperitivo hour 3-5 pm. Indianapolis Monthly review and Best Restaurants 2026.",
 [["INDYMONTHLY",IM+"food-and-drinks/review-good-omen/"],["CURRENT","https://www.youarecurrent.com/2023/05/14/italian-restaurant-to-open-soon-in-zionsville/"]],
 "Indianapolis Monthly Best Restaurants 2026 (open)",k="Zionsville")
F(2,"NORTH","Convivio Italian Artisan Cuisine","11529 Spring Mill Rd, Carmel, IN 46032",["Italian"],"Fresh pasta made in the open pasta shop",
 "Carmel trattoria (2016) from Cinque Terre-born Andrea Melani, with a glass-walled pasta shop where you watch the day's pasta being made — reviewed by the IBJ and featured by Visit Hamilton County.",
 [["IBJ","https://www.ibj.com/articles/61635-dining-dante-inspired-indulgence-at-carmels-new-pasta-purveyor"],["HAMILTONCOUNTY","https://www.visithamiltoncounty.com/blog/stories/post/hot-new-restaurants-in-hamilton-county/"],["TOWNEPOST","https://townepost.com/indiana/geist/delizioso-convivio-brings-italian-culture-delicious-dishes/"]],
 "Visit Hamilton County restaurant feature (open)",k="Carmel")
F(2,"NORTH","Okonori Japanese High Kitchen","1685 E 116th St, Suite 155 (The Corner), Carmel, IN",["Japanese","Sushi"],"16-course omakase; nigiri with fish from Hokkaido and Toyosu",
 "Upscale Japanese room at The Corner in Carmel (opened 13 Nov 2025) — omakase counter, nigiri, miso cod and soba, designed end-to-end by co-owner Kimmie Chang. Indianapolis Monthly Best Restaurants 2026.",
 [["INDYMONTHLY",IM26],["CURRENT","https://youarecurrent.com/2025/11/13/upscale-japanese-restaurant-okonori-opens-at-the-corner/"],["IBJ","https://www.ibj.com/articles/restaurant-designer-puts-stamp-in-carmel-with-upscale-japanese-eatery"]],
 "Indianapolis Monthly Best Restaurants 2026 (open)",k="Carmel")
F(2,"NORTH","Bub's Burgers & Ice Cream","210 W Main St, Carmel, IN 46032",["Burgers","Ice Cream"],"The Big Ugly — a one-pound fully loaded burger (Man v. Food challenge)",
 "Carmel Arts & Design District burger joint whose one-pound 'Big Ugly' earned a Man v. Food challenge (Adam Richman tapped out on the third) and a wall of fame for finishers; house ice cream too.",
 [["IBJ","https://www.ibj.com/articles/22040-eateries-cash-in-on-tv-appearance"],["VISITINDIANA","https://visitindiana.in.gov/blog/post/bubs-burgers-ice-cream/"]],
 "IM The Feed May 2024: only the Westfield Bub's closed (moving to Park St); FOX59/IBJ: Bub's Café closure left the burger shops open; Carmel online ordering live (open)",k="Carmel")

# ---- batch 9 (canon: IM 25 Essential Eats) ----
F(1,"MASS","Goose the Market","2503 N Delaware St, Indianapolis, IN 46205",["Deli","Sandwiches"],"The Batali — Smoking Goose coppa, soppressata and capocollo with provolone and giardiniera",
 "Chris Eley's butcher-and-charcuterie market in Herron-Morton Place, birthplace of Smoking Goose Meatery (2011); its Batali sandwich is one of Indianapolis Monthly's 25 Essential Eats and Bon Appétit ranked it among the top ten sandwich shops in the US.",
 [["INDYMONTHLY",IM+"food-and-drinks/the-25-essential-eats-of-indy/"],["CURRENT","https://www.youarecurrent.com/?p=197240"],["NUVO","https://www.nuvo.net/food/indys-table-a-look-behind-the-scenes-at-goose-the-market/article_03e2b2d7-a49f-520d-91b9-348d1dadc2da.amp.html"],["VISITINDY","https://www.visitindy.com/directory/goose-the-market/"]],
 "Indianapolis Monthly Best Restaurants 2024; current hours listed (open)",k="Herron-Morton Place")
F(2,"DTN","Serliana","InterContinental Indianapolis (2nd floor), steps from Monument Circle, Indianapolis, IN",["French","Steakhouse"],"Modern boeuf bourguignon, duck cassoulet, beef tartare",
 "French-leaning all-day dining room on the second floor of the InterContinental, a block off Monument Circle — 'an impressive, modern take on boeuf bourguignon, cassoulet, sophisticated beef tartare' (Indianapolis Monthly Best Restaurants 2026); Axios's pick among Indy's best new restaurants for Devour 2026.",
 [["INDYMONTHLY",IM+"best-restaurants/best-restaurants-2026-magdalena-serliana/"],["AXIOS","https://www.axios.com/local/indianapolis/2026/01/20/new-restaurants-devour-indy-winterfest"]],
 "Indianapolis Monthly Best Restaurants 2026; Axios Jan 2026 (open)")

# ---- batch 10 (Broad Ripple / SoBro) ----
AX_DEV26="https://www.axios.com/local/indianapolis/2026/08/24/best-devour-summerfest-menus-every-budget-downtown-carmel-broad-ripple"
F(2,"BRIP","Broad Ripple Brewpub","842 E 65th St, Indianapolis, IN 46220",["Brewery","Pub"],"English-style house ales; pub fare in a converted auto-parts store",
 "Indiana's first brewpub (opened 14 Nov 1990 by Englishman John Hill) and the state's oldest operating brewery — the place that spurred Indiana's craft-beer industry; 35th birthday in 2025.",
 [["VISITINDIANA","https://visitindiana.in.gov/blog/post/indianas-first-brewpub-is-celebrating-a-big-birthday-in-2025/"],["NUVO","https://www.nuvo.net/beerbuzz/cheers-to-30-years-how-broad-ripple-brew-pub-spurred-indiana-s-craft-beer-industry/article_ac00312a-25bd-11eb-ba3e-9b370d710a91.html"],["BREWERMAG","https://thebrewermagazine.com/the-early-changes-that-indianas-1st-brewpub-had-to-make-to-thrive/"]],
 "Visit Indiana 2025: celebrating 35 years (open)",k="Broad Ripple")
F(1,"BRIP","Fernando's Mexican & Brazilian Cuisine","834 E 64th St, Indianapolis, IN",["Mexican","Brazilian"],"Feijoada (weekends), Sinaloa tacos, crawfish quesadilla, caipirinhas",
 "Broad Ripple Latin kitchen from Cristiano Rodrigues (Brazil) and Elizabeth Fernandez (Mexico), named for their son — the Brazilian dishes are Rodrigues's mother's recipes, and she runs the kitchen. Indianapolis Monthly Best Restaurants 2024, 2025 and 2026; a second location opened on Mass Ave.",
 [["INDYMONTHLY",IM+"best-restaurants/best-restaurants-2025-fernandos-julieta/"],["IBJ","https://www.ibj.com/articles/fernandos-mexican-brazilian-cuisine-to-add-mass-ave-location"],["TOWNEPOST","https://townepost.com/indiana/north-indy/a-cross-culture-success/"]],
 "Indianapolis Monthly Best Restaurants 2026; Axios Devour Summerfest Aug 2026 (open)",k="Broad Ripple")
F(2,"BRIP","Delicia","5215 N College Ave, Indianapolis, IN",["Latin American"],"Ancho-peach glazed pork medallions; barbacoa with cilantro-lime crema; sancocho amuse-bouche",
 "SoBro New Latin restaurant from the Northside Social group in a converted video store — Caribbean, Cuban and Dominican-inflected seafood and sauced meats; rave reviews from both Indianapolis Monthly and the IBJ.",
 [["INDYMONTHLY",IM+"food-and-drinks/dining/mas-appeal-a-review-of-delicia/"],["IBJ","https://www.ibj.com/articles/41813-dining-delicia-lives-up-to-the-name"],["AXIOS",AX_DEV26]],
 "Axios Devour Summerfest menus, Aug 2026 (open)",k="SoBro")

# ---- batch 11 (Irvington) ----
F(2,"EAST","Jockamo Upper Crust Pizza","5646 E Washington St, Indianapolis, IN",["Pizza"],"Extra-crisp crust pies like the Slaughterhouse Five; weekend huevos rancheros pizza",
 "Mick McGrath's Irvington pizzeria (2007) that helped revive the neighbourhood — extra-crisp crusts and offbeat combos; Thrillist named it Indiana's best pizzeria and Reader's Digest's state pick followed (FOX59).",
 [["INDYMONTHLY",IM+"food-and-drinks/dining/eat-sheet-jockamos-upper-crust-mug/"],["FOX59","https://digital-release.fox59.com/indiana-news/this-is-the-best-pizza-in-indiana-according-to-readers-digest/amp"],["TOWNEPOST","https://townepost.com/indiana/geist/jockamo-upper-crust-pizza-inspires-loyalty-customers-staff/"]],
 "FOX59 Reader's Digest best-pizza story; locations in Irvington, Greenwood, Lawrence (open)",k="Irvington")
F(2,"MID","Pa & Ma's Backyard BBQ","2621 Dr. Martin Luther King Jr. St, Indianapolis, IN",["Barbecue","Soul Food"],"Brisket, fried catfish, fried chicken, candied yams, chicken and dumplings",
 "Family-run cafeteria-style barbecue and soul-food line (moved in 2024 from College Ave to a bigger MLK St space near Crown Hill) — on Diners, Drive-Ins and Dives in October 2024, aired a month after founder George Nelson Sr. died.",
 [["WTHR","https://wthr.com/article/news/local/pa-and-mas-backyard-bbq-to-be-featured-on-food-network-diners-drive-ins-and-dives-guy-fieri-george-nelson-sr-indianapolis/531-f6d63dfd-3aef-468a-a5a8-e4ba34e8f6ca"],["INDYMONTHLY",IM+"food-and-drinks/bbq-restaurant-in-indianapolis/"],["FOX59","https://fox59.com/indiana-news/indy-southern-comfort-restaurant-to-be-featured-on-food-networks-diners-drive-ins-and-dives/amp"]],
 "WTHR/FOX59 Oct 2024 DDD coverage at the new MLK St location (open)")

# ---- batch 12 (Mass Ave / Lockerbie) ----
F(2,"MASS","Livery","720 N College Ave, Indianapolis, IN 46202",["Latin American"],"Ceviche, paella, arroz con pollo, skirt steak — shared plates",
 "Central and South American shared plates in a restored 1890s horse stable off Mass Ave — ranked No. 91 on Yelp's 2023 Top 100 US restaurants and among its top Midwest picks (as reported by Axios and WRTV; Yelp counted only as a popularity measure).",
 [["AXIOS","https://www.axios.com/local/indianapolis/2024/01/23/livery-yelp-best-restaurants-list"],["WRTV","https://www.wrtv.com/news/local-news/5-indianapolis-restaurants-ranked-among-yelps-top-100-in-the-midwest"]],
 "Current hours listed Mon–Sun from 4 pm (open)",k="Lockerbie")

# ---- batch 13 (sights with Wikipedia infobox pins — thin-sight areas) ----
IE="https://indyencyclopedia.org/"
S(2,"WEST","Major Taylor Velodrome","Cold Spring Rd, immediately north of the Marian University campus, Indianapolis, IN",
 "Outdoor concrete velodrome (1982, 28° banked turns) named for 1899 world cycling champion Major Taylor — the first publicly funded building in Indianapolis named for an African American; Thursday-night racing April-Sept, plus BMX and MTB trails at the Indy Cycloplex.",
 [["WIKIPEDIA",W+"Major_Taylor_Velodrome"],["INDYENCYCLOPEDIA",IE+"marshall-w-major-taylor/"]],"Marian University-run; weekly racing programme April–September",
 geo=g("Major Taylor Velodrome","Cold Spring Rd, immediately north of the Marian University campus, Indianapolis, IN",39.821444,-86.199361,"Wikipedia infobox 39°49′17.2″N 86°11′57.7″W ("+W+"Major_Taylor_Velodrome)",ss="Marian University-run; weekly racing programme April–September"))
S(3,"WEST","Allison Mansion (Riverdale)","3200 Cold Spring Rd, Indianapolis, IN",
 "Arts & Crafts estate (1911-14) of Speedway co-founder James A. Allison — sunken conservatory, white-marble aviary, Moravian tiles; since 1936 the heart of Marian University and on the NRHP (1970).",
 [["WIKIPEDIA",W+"Allison_Mansion"],["INDYENCYCLOPEDIA",IE+"marian-college-mansions/"]],"In use as Marian University president's offices",
 geo=g("Allison Mansion (Riverdale)","3200 Cold Spring Rd, Indianapolis, IN",39.80611,-86.20139,"Wikipedia infobox 39°48′22″N 86°12′5″W ("+W+"Allison_Mansion)",ss="In use as Marian University president's offices"))
S(2,"EAST","Arsenal Technical High School (U.S. Arsenal)","1500 E Michigan St, Indianapolis, IN",
 "A Civil War U.S. Arsenal (1864-1903) turned high school in 1912 — the oldest military installation in central Indiana, with the 1864 Arsenal building and barracks still in school use on a 76-acre NRHP campus.",
 [["WIKIPEDIA",W+"Arsenal_Technical_High_School"],["INDYENCYCLOPEDIA",IE+"u-s-arsenal/"]],"Operating IPS high school (NRHP 1976)",
 geo=g("Arsenal Technical High School (U.S. Arsenal)","1500 E Michigan St, Indianapolis, IN",39.77778,-86.13306,"Wikipedia infobox 39°46′40″N 86°7′59″W ("+W+"Arsenal_Technical_High_School)",ss="Operating IPS high school (NRHP 1976)"))
S(2,"FSQ","Fletcher Place Historic District","Fletcher Place (between Virginia Ave, East St and I-65/70), Indianapolis, IN",
 "40-acre NRHP district (1982) of Irish and German worker cottages and Italianate/Queen Anne rows (Briggs Flats 1893, Fletcher Place Methodist) — now the restaurant strip of Bluebeard, Iaria's and Milktooth.",
 [["WIKIPEDIA",W+"Fletcher_Place"],["INDYENCYCLOPEDIA",IE+"fletcher-place/"]],"Public historic neighbourhood",
 geo=g("Fletcher Place Historic District","Fletcher Place (between Virginia Ave, East St and I-65/70), Indianapolis, IN",39.75750,-86.14611,"Wikipedia infobox 39°45′27″N 86°8′46″W ("+W+"Fletcher_Place)",conf="med",ss="Public historic neighbourhood",note="district centroid"),k="Fletcher Place")
