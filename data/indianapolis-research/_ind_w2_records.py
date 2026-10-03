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
