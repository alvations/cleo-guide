#!/usr/bin/env python3
# Consolidate the Philadelphia research files into one normalized dataset (key philadelphia-pa).
# Region = the City of Philadelphia (10 NYC-style areas) + the Main Line / Montgomery & Bucks suburbs,
# the South Jersey / Camden edge across the Delaware, and Brandywine / Valley Forge day trips.
# Lancaster County / Amish Country is OUT of scope (it belongs to the Harrisburg-York-Lancaster map).
# Deterministic: reads every research JSON in this dir (LIST = food records; DICT {sights,food,sources}),
# de-dups by exact name, maps cuisines + collections, writes phi_dataset.json + phi_worklist.json.
import json, os, re, glob
D = os.path.dirname(os.path.abspath(__file__))

AREAS = [
 {"id":"CC",   "n":"Center City, Old City & the Parkway"},
 {"id":"SPH",  "n":"South Philly (Italian Market, Passyunk, Washington Ave)"},
 {"id":"FISH", "n":"Fishtown, Northern Liberties & Kensington"},
 {"id":"UCW",  "n":"University City & West Philly"},
 {"id":"NPH",  "n":"North Philly, Fairmount Park & Brewerytown"},
 {"id":"NW",   "n":"Northwest (Germantown, Chestnut Hill, Manayunk)"},
 {"id":"NE",   "n":"Northeast Philly (Port Richmond, Little Brazil, Cottman Ave)"},
 {"id":"MAIN", "n":"The Main Line & suburbs"},
 {"id":"SJ",   "n":"South Jersey & the Camden edge"},
 {"id":"DAY",  "n":"Brandywine, Valley Forge & day trips"},
]
AC = {"CC":"#C0504D","SPH":"#E8973A","FISH":"#4F81BD","UCW":"#9BBB59","NPH":"#8064A2",
      "NW":"#4BACC6","NE":"#D99694","MAIN":"#2C7FB8","SJ":"#F2A900","DAY":"#7BA05B"}

CUISINES = [
 {"id":"CHS","n":"Cheesesteaks & Roast Pork"},
 {"id":"HOAG","n":"Hoagies, Delis & Sandwiches"},
 {"id":"PZ","n":"Pizza & Tomato Pie"},
 {"id":"IT","n":"Italian & Italian-American"},
 {"id":"US","n":"American, New American & Fine Dining"},
 {"id":"DIN","n":"Diners, Scrapple & Breakfast"},
 {"id":"SOUL","n":"Soul Food, BBQ & Southern"},
 {"id":"SEAF","n":"Seafood & Oysters"},
 {"id":"MEX","n":"Mexican"},
 {"id":"LAT","n":"Latin American & Caribbean"},
 {"id":"VN","n":"Vietnamese"},
 {"id":"SEA","n":"Cambodian, Indonesian, Thai & Southeast Asian"},
 {"id":"CN","n":"Chinese & Taiwanese"},
 {"id":"JK","n":"Japanese & Korean"},
 {"id":"IN","n":"South Asian"},
 {"id":"ME","n":"Middle Eastern, Israeli & Mediterranean"},
 {"id":"AFR","n":"African"},
 {"id":"DES","n":"Bakeries, Soft Pretzels, Water Ice & Desserts"},
 {"id":"BREW","n":"Bars, Breweries & Cocktails"},
 {"id":"COF","n":"Coffee & Cafés"},
 {"id":"VIRAL","n":"Viral / Social"},
]
CMAP = {
 "Cheesesteak":"CHS","Cheesesteaks":"CHS","Roast Pork":"CHS","Roast pork":"CHS","Steaks":"CHS",
 "Hoagie":"HOAG","Hoagies":"HOAG","Sandwiches":"HOAG","Sandwich":"HOAG","Deli":"HOAG","Jewish Deli":"HOAG","Italian Deli":"HOAG","Bagels":"HOAG",
 "Pizza":"PZ","Tomato Pie":"PZ","Neapolitan":"PZ","Pizzeria":"PZ",
 "Italian":"IT","Italian-American":"IT","Pasta":"IT","Red Gravy":"IT",
 "American":"US","New American":"US","Contemporary":"US","Fine Dining":"US","Tasting Menu":"US","Steakhouse":"US","Steak":"US","French":"US","Gastropub":"US","Farm-to-table":"US","Wine Bar":"US","Vegan":"US","Vegetarian":"US","Burgers":"US","Spanish":"US","European":"US","Brunch":"US",
 "Diner":"DIN","Breakfast":"DIN","Scrapple":"DIN","Pennsylvania Dutch":"DIN","Luncheonette":"DIN",
 "Soul Food":"SOUL","Southern":"SOUL","BBQ":"SOUL","Barbecue":"SOUL","Fried Chicken":"SOUL","Cajun":"SOUL","Hot Dogs":"SOUL",
 "Seafood":"SEAF","Oysters":"SEAF","Raw Bar":"SEAF","Crab":"SEAF","Fish":"SEAF",
 "Mexican":"MEX","Tacos":"MEX","Taqueria":"MEX","Pueblan":"MEX","Oaxacan":"MEX","Barbacoa":"MEX",
 "Latin American":"LAT","Puerto Rican":"LAT","Dominican":"LAT","Brazilian":"LAT","Colombian":"LAT","Venezuelan":"LAT","Peruvian":"LAT","Cuban":"LAT","Caribbean":"LAT","Jamaican":"LAT","Trinidadian":"LAT","Haitian":"LAT","Salvadoran":"LAT",
 "Vietnamese":"VN","Pho":"VN","Banh Mi":"VN",
 "Cambodian":"SEA","Khmer":"SEA","Indonesian":"SEA","Thai":"SEA","Lao":"SEA","Laotian":"SEA","Filipino":"SEA","Malaysian":"SEA","Burmese":"SEA","Southeast Asian":"SEA",
 "Chinese":"CN","Cantonese":"CN","Dim Sum":"CN","Sichuan":"CN","Taiwanese":"CN","Hand-pulled Noodles":"CN","Noodles":"CN","Dumplings":"CN","Hong Kong":"CN","Uyghur":"CN","Fujianese":"CN",
 "Japanese":"JK","Sushi":"JK","Ramen":"JK","Izakaya":"JK","Korean":"JK","Korean BBQ":"JK",
 "Indian":"IN","South Indian":"IN","Pakistani":"IN","Nepali":"IN","Bangladeshi":"IN","Sri Lankan":"IN","Himalayan":"IN",
 "Middle Eastern":"ME","Israeli":"ME","Mediterranean":"ME","Lebanese":"ME","Syrian":"ME","Turkish":"ME","Greek":"ME","Palestinian":"ME","Persian":"ME","Afghan":"ME","Egyptian":"ME","Iraqi":"ME","Falafel":"ME","Georgian":"ME",
 "African":"AFR","Ethiopian":"AFR","Eritrean":"AFR","West African":"AFR","Senegalese":"AFR","Liberian":"AFR","Nigerian":"AFR","Ghanaian":"AFR","Ivorian":"AFR",
 "Bakery":"DES","Bakeries":"DES","Dessert":"DES","Desserts":"DES","Pastry":"DES","Soft Pretzel":"DES","Soft Pretzels":"DES","Pretzels":"DES","Water Ice":"DES","Italian Ice":"DES","Ice Cream":"DES","Gelato":"DES","Donuts":"DES","Cannoli":"DES","Chocolate":"DES","Candy":"DES","Tastykake":"DES","Custard":"DES",
 "Bar":"BREW","Brewery":"BREW","Beer":"BREW","Cocktails":"BREW","Cocktail Bar":"BREW","Taproom":"BREW","Distillery":"BREW","Pub":"BREW","Tavern":"BREW","Speakeasy":"BREW","Dive Bar":"BREW","Beer Garden":"BREW","Winery":"BREW",
 "Coffee":"COF","Cafe":"COF","Café":"COF","Roaster":"COF","Tea":"COF",
 "Viral":"VIRAL",
}
def map_cz(raw):
    out = []
    for c in raw:
        i = CMAP.get(c) or CMAP.get(c.strip())
        if i and i not in out: out.append(i)
    return out or ["US"]

# Philadelphia's marquee is the founding-history core (Independence NHP) + the mural city + Rocky.
CATS = [{"id":"ICON","n":"Iconic & Must-See"},{"id":"HIST","n":"Revolutionary & Colonial History"},
        {"id":"MUS","n":"Museums & Galleries"},{"id":"ART","n":"Murals & Public Art"},
        {"id":"ARCH","n":"Architecture & Landmarks"},{"id":"PARK","n":"Parks, Gardens & Trails"},
        {"id":"MKT","n":"Markets & Food Halls"},{"id":"ARTS","n":"Performing Arts & Music"},
        {"id":"WATER","n":"Riverfront & Waterfront"},{"id":"FAM","n":"Family & Kids"},
        {"id":"SPORT","n":"Sports & Rocky"},{"id":"ODD","n":"Oddities & Hidden Gems"},
        {"id":"FREE","n":"Free to Visit"}]
KW = {
 "ICON":["liberty bell","independence hall","art museum","rocky steps","reading terminal","city hall","love park","elfreth","italian market","valley forge","longwood"],
 "HIST":["revolution","colonial","founding","1776","constitution","washington","franklin","betsy ross","historic","historical","declaration","continental","quaker","meeting house","fort","battle","encampment","18th-century","underground railroad","civil war","house museum"],
 "MUS":["museum","gallery","barnes","collection","institute","academy of","athenaeum","library","rodin","mütter","mutter","penn museum","exhibit"],
 "ART":["mural","mosaic","magic gardens","public art","sculpture","street art","clothespin","love statue"],
 "ARCH":["cathedral","church","basilica","synagogue","mansion","estate","architecture","landmark","tower","building","bridge","penitentiary","cemetery","castle","row","alley","shrine","abbey"],
 "PARK":["park","garden","arboretum","trail","wissahickon","conservatory","creek","preserve","boathouse","greenway","square","woods","nature"],
 "MKT":["market","food hall","reading terminal","italian market","bazaar"],
 "ARTS":["theatre","theater","orchestra","opera","kimmel","academy of music","jazz","music hall","concert","venue","ballet","playhouse","club"],
 "WATER":["delaware river","schuylkill","waterfront","riverfront","pier","boathouse row","race street","spruce street harbor","river"],
 "FAM":["zoo","aquarium","franklin institute","please touch","children","science","adventure","playground","carousel","amusement"],
 "SPORT":["rocky","stadium","ballpark","eagles","phillies","flyers","sixers","sports","arena","field"],
}
ODD_SRC = {"ATLASOBSCURA","HIDDENCITY"}
def collections(x, is_food):
    g = list(x.get("g", []))
    hay = (x.get("n","")+" "+x.get("w","")+" "+x.get("k","")+" "+" ".join(x.get("cz",[]))).lower()
    if is_food:
        if any(k in hay for k in ["reading terminal","italian market","food hall","market"]): g.append("MKT")
    else:
        for cid, kws in KW.items():
            if any(k in hay for k in kws): g.append(cid)
        srcs = {t[0] for t in x.get("sources", [])}
        if (srcs & ODD_SRC) or "oddit" in hay or "quirk" in hay or "hidden gem" in hay: g.append("ODD")
        if re.search(r'\bfree\b|no admission|free to (enter|visit)|free admission', hay): g.append("FREE")
        if not g: g.append("ARCH")
    out = []
    for c in g:
        if c not in out: out.append(c)
    return out[:4]

SRC_LABEL = {
 "MICHELIN":"MICHELIN","MICHELIN_BIB":"MICHELIN BIB GOURMAND","MICHELIN_STAR":"MICHELIN STAR","MICHELIN_REC":"MICHELIN RECOMMENDED",
 "JAMESBEARD":"JAMES BEARD","INQUIRER":"PHILADELPHIA INQUIRER","LABAN":"INQUIRER · CRAIG LABAN","PHILLYMAG":"PHILADELPHIA MAGAZINE",
 "FOOBOOZ":"PHILLY MAG FOOBOOZ","EATERPHILLY":"EATER PHILLY","INFATUATION":"THE INFATUATION","BILLYPENN":"BILLY PENN / WHYY",
 "WHYY":"WHYY","VISITPHILLY":"VISIT PHILADELPHIA","PHLCVB":"PHILADELPHIA CVB","NPS":"NATIONAL PARK SVC","ATLASOBSCURA":"ATLAS OBSCURA",
 "HIDDENCITY":"HIDDEN CITY PHILADELPHIA","PHILLYVOICE":"PHILLYVOICE","NYT":"NEW YORK TIMES","TIMEOUT":"TIME OUT","BONAPPETIT":"BON APPÉTIT",
 "WIKIPEDIA":"WIKIPEDIA","OFFICIAL":"OFFICIAL SITE","YELP":"YELP","TRIPADVISOR":"TRIPADVISOR","GOOGLE":"GOOGLE","PORTNOY":"ONE BITE (PORTNOY)",
 "MURALARTS":"MURAL ARTS PHILADELPHIA","FAIRMOUNTPARK":"PHILA. PARKS & REC","UNESCO":"UNESCO","PAHISTORIC":"PA HISTORICAL COMMISSION",
 "NJMONTHLY":"NEW JERSEY MONTHLY","COURIERPOST":"COURIER-POST","MAINLINETODAY":"MAIN LINE TODAY","LONELYPLANET":"LONELY PLANET",
 "CNTRAVELER":"CONDÉ NAST TRAVELER","PHILLYCHITCHAT":"PHILLY CHITCHAT","6ABC":"6ABC ACTION NEWS","NBC10":"NBC10","CBSPHILLY":"CBS PHILADELPHIA",
 "FOODNETWORK":"FOOD NETWORK","USATODAY":"USA TODAY 10BEST","CHESTERCO":"CHESTER COUNTY TOURISM","VALLEYFORGE":"VALLEY FORGE TOURISM",
 "VISITBUCKS":"VISIT BUCKS COUNTY","VISITSJ":"VISIT SOUTH JERSEY","PHILLYTRIB":"PHILADELPHIA TRIBUNE","DELAWARE":"VISIT DELAWARE",
}
ALIAS = {"PHILAMAG":"PHILLYMAG","PHILLYMAGAZINE":"PHILLYMAG","EATER":"EATERPHILLY","VISITPHILADELPHIA":"VISITPHILLY",
         "PHILLYINQUIRER":"INQUIRER","INQ":"INQUIRER","WHYYBILLYPENN":"BILLYPENN","JBF":"JAMESBEARD"}
def canon(k): return ALIAS.get(k, k)

# places confirmed permanently CLOSED + non-notable, or not a visitable place, during fact-check/geocode
EXCLUDE = set()
sights = []; food = []; srcmeta = {}; seen_names = set()
def _take(x, bucket):
    n = x.get("n")
    if not n or n in seen_names or n in EXCLUDE: return
    seen_names.add(n); bucket.append(x)
for path in sorted(glob.glob(os.path.join(D, "*.json"))):
    base = os.path.basename(path)
    if base.startswith(("_","out_","phi_","geo_","CREATORS","SOURCES_")) or "dataset" in base: continue
    d = json.load(open(path, encoding="utf-8"))
    if isinstance(d, list):
        for x in d: _take(x, food)
    else:
        for s in d.get("sources", []): srcmeta.setdefault(s["key"], s)
        for x in d.get("sights", []): _take(x, sights)
        for x in d.get("food", []):   _take(x, food)

def norm_sources(x):
    seen = []; out = []
    for t in x.get("sources", []):
        k = canon(t[0]); pair = [k, t[1] if len(t) > 1 else ""]
        if (pair[0], pair[1]) in seen: continue
        seen.append((pair[0], pair[1])); out.append(pair)
    return out or [["WIKIPEDIA", ""]]

AIDS = {a["id"] for a in AREAS}
P = []; F = []; used_S = set(); used_F = set()
for x in sights:
    assert x["a"] in AIDS, "unknown area %s on %s" % (x["a"], x["n"])
    r = {"t":int(x["t"]),"a":x["a"],"n":x["n"],"ad":x["address"],"w":x["w"]}
    if x.get("k"): r["k"] = x["k"]
    if x.get("closed"): r["closed"] = True
    r["g"] = collections(x, False); r["s"] = norm_sources(x)
    for t in r["s"]: used_S.add(t[0])
    P.append(r)
for x in food:
    assert x["a"] in AIDS, "unknown area %s on %s" % (x["a"], x["n"])
    r = {"t":int(x["t"]),"a":x["a"],"n":x["n"],"ad":x["address"],"w":x["w"]}
    if x.get("k"): r["k"] = x["k"]
    if x.get("closed"): r["closed"] = True
    r["cz"] = map_cz(x.get("cz", [])); g = collections(x, True)
    if g: r["g"] = g
    r["s"] = norm_sources(x)
    for t in r["s"]: used_F.add(t[0])
    F.append(r)

def mk_table(keys):
    tbl = {}
    for k in sorted(keys):
        m = srcmeta.get(k) or {}
        tbl[k] = {"k":SRC_LABEL.get(k, k.replace('_',' ').upper()),"t":m.get("name", SRC_LABEL.get(k, k)),
                  "u":m.get("url",""),"l":m.get("name","")}
    return tbl
S = mk_table(used_S); FS = mk_table(used_F)
out = {"areas":AREAS,"ac":AC,"cuisines":CUISINES,"cats":CATS,"P":P,"F":F,"S":S,"FS":FS}
json.dump(out, open(os.path.join(D, "phi_dataset.json"), "w"), indent=1, ensure_ascii=False)
json.dump([{"n":r["n"],"addr":r["ad"],"a":r["a"]} for r in P+F], open(os.path.join(D, "phi_worklist.json"), "w"), ensure_ascii=False, indent=0)
from collections import Counter
print("P(sights):", len(P), " F(food):", len(F), " total:", len(P)+len(F))
print("Areas:", dict(Counter(r["a"] for r in P+F)))
print("Cuisine coverage:", dict(Counter(c for r in F for c in r.get("cz", []))))
print("closed flagged:", [r["n"] for r in P+F if r.get("closed")] or "none")
print("wrote phi_dataset.json + phi_worklist.json")
