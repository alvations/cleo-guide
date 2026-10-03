#!/usr/bin/env python3
# Consolidate the Chicago research files into one normalized dataset (cloned from the New York
# consolidate.py; NYC-style area split for Chicago + a Chicago cuisine taxonomy):
# AREAS/AC, CUISINES (normalized), CATS (Collections), sights P, food F, source tables S/FS.
# Generic: reads every research JSON in this dir (array files = food; object files = {sights,food,sources}).
# Skips helper/output files (_*, out_*, chi_*, geo_*, *dataset*, CREATORS*, SOURCES_*).
import json, os, re, glob
from collections import Counter
D = os.path.dirname(os.path.abspath(__file__))

AREAS = [
 {"id":"LOOP", "n":"The Loop & Downtown (River North, Streeterville, Gold Coast, South Loop, Museum Campus, West Loop)"},
 {"id":"NORTH","n":"North Side (Lincoln Park, Lakeview, Lincoln Square, Uptown & Argyle, Andersonville, Rogers Park & Devon)"},
 {"id":"NW",   "n":"Northwest Side (Wicker Park, Bucktown, Ukrainian Village, Logan Square, Humboldt Park, Avondale, Albany Park)"},
 {"id":"WEST", "n":"West Side (Pilsen, Little Village, Little Italy & Taylor St, Garfield Park, Austin)"},
 {"id":"SOUTH","n":"South Side (Chinatown, Bridgeport, Bronzeville, Hyde Park, Woodlawn, South Shore)"},
 {"id":"SW",   "n":"Southwest Side (Back of the Yards, McKinley Park, Brighton Park, Archer Heights, Marquette Park, Midway)"},
 {"id":"FAR",  "n":"Far South (Pullman, Beverly & Morgan Park, Chatham, Roseland, the Calumet)"},
 {"id":"SUB",  "n":"Suburbs & North Shore (Evanston, Oak Park, Skokie, Wilmette, Glencoe, Berwyn, the western suburbs)"},
 {"id":"DAY",  "n":"Day Trips (Indiana Dunes, Starved Rock, Milwaukee, the Lake Michigan shore)"},
]
AC = {"LOOP":"#C0504D","NORTH":"#4F81BD","NW":"#9BBB59","WEST":"#E8973A","SOUTH":"#8064A2",
      "SW":"#D99694","FAR":"#4BACC6","SUB":"#2C7FB8","DAY":"#F2A900"}

# ---- cuisine normalization: raw label -> id ; plus the CUISINES taxonomy (ordered) ----
# Chicago canon first (deep-dish/tavern pizza, Italian beef, the dog & the Maxwell Street Polish, the
# jibarito, Harold's/mild-sauce chicken, rainbow cone & Garrett popcorn), then the immigrant corridors.
CUISINES = [
 {"id":"PZ",  "n":"Pizza (deep-dish, tavern-style thin, stuffed)"},
 {"id":"BEEF","n":"Italian Beef & Chicago Sandwiches"},
 {"id":"DOG", "n":"Hot Dogs, Maxwell Street Polish & Burgers"},
 {"id":"CHX", "n":"Fried Chicken, Mild Sauce, BBQ & Soul Food"},
 {"id":"US",  "n":"New American, Fine Dining & Steakhouses"},
 {"id":"DELI","n":"Delis, Diners & Breakfast"},
 {"id":"IT",  "n":"Italian"},
 {"id":"MEX", "n":"Mexican (Pilsen & Little Village)"},
 {"id":"PR",  "n":"Puerto Rican, Caribbean & Latin American"},
 {"id":"CN",  "n":"Chinese (Chinatown & beyond)"},
 {"id":"VN",  "n":"Vietnamese, Thai & Southeast Asian (Argyle)"},
 {"id":"KR",  "n":"Korean"},
 {"id":"JP",  "n":"Japanese"},
 {"id":"IN",  "n":"Indian & Pakistani (Devon Ave)"},
 {"id":"ME",  "n":"Middle Eastern, Greek & Mediterranean"},
 {"id":"EEU", "n":"Polish, Ukrainian & Eastern European"},
 {"id":"EU",  "n":"Swedish, German, French & European"},
 {"id":"AF",  "n":"African & Ethiopian"},
 {"id":"SEAF","n":"Seafood & Fish Shacks"},
 {"id":"BAR", "n":"Taverns, Bars, Cocktails & Breweries"},
 {"id":"COF", "n":"Coffee & Cafés"},
 {"id":"DES", "n":"Desserts, Bakeries, Rainbow Cone & Popcorn"},
 {"id":"VIRAL","n":"Viral / Social"},
]
CMAP = {
 "Pizza":"PZ","Deep-Dish":"PZ","Deep Dish":"PZ","Tavern-Style":"PZ","Tavern Pizza":"PZ","Thin Crust":"PZ","Stuffed Pizza":"PZ","Pan Pizza":"PZ","Neapolitan":"PZ","Detroit-Style":"PZ",
 "Italian Beef":"BEEF","Beef":"BEEF","Sandwiches":"BEEF","Sandwich":"BEEF","Subs":"BEEF","Mother-in-Law":"BEEF",
 "Hot Dogs":"DOG","Hot Dog":"DOG","Chicago-Style Hot Dog":"DOG","Maxwell Street Polish":"DOG","Polish Sausage":"DOG","Burgers":"DOG","Burger":"DOG","Fast Food":"DOG","Sausage":"DOG",
 "Fried Chicken":"CHX","Chicken":"CHX","Mild Sauce":"CHX","Wings":"CHX","BBQ":"CHX","Barbecue":"CHX","Rib Tips":"CHX","Soul Food":"CHX","Southern":"CHX","Cajun":"CHX","Creole":"CHX",
 "American":"US","New American":"US","Contemporary":"US","Fine Dining":"US","Tasting Menu":"US","Steakhouse":"US","Steak":"US","Farm-to-table":"US","Gastropub":"US","Modern American":"US","Supper Club":"US","Vegetarian":"US","Vegan":"US",
 "Deli":"DELI","Jewish Deli":"DELI","Diner":"DELI","Breakfast":"DELI","Brunch":"DELI","Bagels":"DELI","Corned Beef":"DELI",
 "Italian":"IT","Italian-American":"IT","Pasta":"IT",
 "Mexican":"MEX","Tacos":"MEX","Taqueria":"MEX","Oaxacan":"MEX","Carnitas":"MEX","Birria":"MEX","Tamales":"MEX","Mexican Bakery":"MEX",
 "Puerto Rican":"PR","Jibarito":"PR","Caribbean":"PR","Cuban":"PR","Jamaican":"PR","Latin American":"PR","Colombian":"PR","Venezuelan":"PR","Peruvian":"PR","Guatemalan":"PR","Salvadoran":"PR","Argentinian":"PR","Ecuadorian":"PR","Haitian":"PR","Belizean":"PR","Brazilian":"PR",
 "Chinese":"CN","Cantonese":"CN","Dim Sum":"CN","Sichuan":"CN","Szechuan":"CN","Hunan":"CN","Shanghainese":"CN","Taiwanese":"CN","Hot Pot":"CN","Dumplings":"CN","Noodles":"CN","Uyghur":"CN","Hong Kong":"CN",
 "Vietnamese":"VN","Pho":"VN","Banh Mi":"VN","Thai":"VN","Lao":"VN","Laotian":"VN","Cambodian":"VN","Filipino":"VN","Indonesian":"VN","Burmese":"VN","Malaysian":"VN","Singaporean":"VN","Southeast Asian":"VN",
 "Korean":"KR","Korean BBQ":"KR",
 "Japanese":"JP","Sushi":"JP","Ramen":"JP","Izakaya":"JP","Omakase":"JP",
 "Indian":"IN","Pakistani":"IN","Bangladeshi":"IN","South Indian":"IN","Nepali":"IN","Himalayan":"IN","Afghan":"IN","Sri Lankan":"IN",
 "Middle Eastern":"ME","Mediterranean":"ME","Greek":"ME","Lebanese":"ME","Palestinian":"ME","Syrian":"ME","Turkish":"ME","Persian":"ME","Assyrian":"ME","Israeli":"ME","Falafel":"ME","Iraqi":"ME","Yemeni":"ME","Moroccan":"ME","Egyptian":"ME",
 "Polish":"EEU","Ukrainian":"EEU","Eastern European":"EEU","Lithuanian":"EEU","Serbian":"EEU","Croatian":"EEU","Bosnian":"EEU","Russian":"EEU","Georgian":"EEU","Czech":"EEU","Hungarian":"EEU","Romanian":"EEU","Pierogi":"EEU",
 "Swedish":"EU","German":"EU","French":"EU","European":"EU","Belgian":"EU","Irish":"EU","Spanish":"EU","Basque":"EU","Portuguese":"EU","British":"EU","Scandinavian":"EU","Austrian":"EU",
 "African":"AF","Ethiopian":"AF","Eritrean":"AF","Nigerian":"AF","West African":"AF","Senegalese":"AF","Ghanaian":"AF","Somali":"AF","Kenyan":"AF",
 "Seafood":"SEAF","Fish":"SEAF","Shrimp":"SEAF","Fish Fry":"SEAF","Oysters":"SEAF","Fish Shack":"SEAF",
 "Bar":"BAR","Tavern":"BAR","Cocktails":"BAR","Cocktail Bar":"BAR","Brewery":"BAR","Beer":"BAR","Taproom":"BAR","Speakeasy":"BAR","Pub":"BAR","Dive Bar":"BAR","Distillery":"BAR","Wine Bar":"BAR","Jazz Club":"BAR","Blues Club":"BAR","Malört":"BAR",
 "Coffee":"COF","Cafe":"COF","Café":"COF","Tea":"COF","Roaster":"COF",
 "Dessert":"DES","Desserts":"DES","Bakery":"DES","Ice Cream":"DES","Rainbow Cone":"DES","Popcorn":"DES","Donuts":"DES","Doughnuts":"DES","Pastry":"DES","Chocolate":"DES","Candy":"DES","Italian Ice":"DES","Gelato":"DES","Paczki":"DES","Pie":"DES","Cheesecake":"DES",
 "Viral":"VIRAL",
}
def map_cz(raw):
    out = []
    for c in raw:
        i = CMAP.get(c) or CMAP.get(c.strip())
        if i and i not in out: out.append(i)
    return out or ["US"]

# ---- Collections (CATS) + keyword rules ----
CATS = [{"id":"MUS","n":"Museums & Galleries"},{"id":"PARK","n":"Parks, Beaches & Gardens"},
        {"id":"ICON","n":"Iconic Landmarks & Skyline Views"},{"id":"ARCH","n":"Architecture & History"},
        {"id":"FLW","n":"Frank Lloyd Wright & Prairie School"},{"id":"MKT","n":"Markets & Food Halls"},
        {"id":"ARTS","n":"Blues, Jazz, Theater & Comedy"},{"id":"SPORT","n":"Sports & Stadiums"},
        {"id":"WATER","n":"Lakefront, River & Water"},{"id":"FAM","n":"Family & Kids"},
        {"id":"ODD","n":"Oddities & Hidden Gems"},{"id":"FREE","n":"Free to Visit"},
        {"id":"ROOF","n":"Rooftops & Views"},{"id":"SPEAK","n":"Speakeasies & Cocktail Bars"},
        {"id":"POP","n":"Pop Culture & Screen"},{"id":"MURAL","n":"Murals & Public Art"}]
KW = {
 "MUS":["museum","gallery","art institute","collection","planetarium","aquarium","library","cultural center"],
 "PARK":["park","garden","botanic","arboretum","conservatory","nature","preserve","beach","dunes","trail","606","lagoon","woods"],
 "ICON":["willis tower","skydeck","bean","cloud gate","navy pier","buckingham","wrigley","water tower","360 chicago","hancock","magnificent mile","riverwalk","skyline","observation","tribune tower","marina city","chicago theatre"],
 "ARCH":["architecture","historic","landmark","cathedral","church","basilica","temple","synagogue","mansion","house","building","tower","station","cemetery","monument","memorial","district","pullman","boulevard","bridge","rookery","auditorium","bungalow","shrine","mosque"],
 "FLW":["frank lloyd wright","wright","prairie school","robie","unity temple","sullivan"],
 "MKT":["market","food hall","maxwell street","plaza","mercado"],
 "ARTS":["theater","theatre","jazz","blues","opera","symphony","comedy","second city","green mill","music","concert","ballet","improv","ravinia","pavilion","house music"],
 "SPORT":["stadium","field","ballpark","arena","cubs","white sox","bears","bulls","soldier field","united center"],
 "WATER":["lake michigan","lakefront","beach","river","riverwalk","harbor","pier","boat","canal","shoreline","lagoon","dunes"],
 "FAM":["zoo","aquarium","children","science","planetarium","kids","family","farm","playground","maze"],
 "MURAL":["mural","public art","sculpture","picasso","calder","chagall","miró","miro","mosaic","street art"],
}
ODD_SRC = {"ATLASOBSCURA"}
ROOF_KW = ["rooftop","roof deck","roof bar","skyline view","observation deck","panoramic view","with a view","sky-high","skydeck"]
SPEAK_KW = ["speakeasy","hidden bar","password","cocktail bar","secret bar","behind a","unmarked door","cocktail lounge"]
POP_KW = ["blues brothers","ferris bueller","the bear","movie","filmed","film location","tv show","seinfeld","oprah","home alone","batman","dark knight","transformers","pop culture","chicago p.d.","shameless"]
def collections(x, is_food):
    g = list(x.get("g", []))
    hay = (x.get("n","")+" "+x.get("w","")+" "+x.get("k","")+" "+" ".join(x.get("cz",[]))).lower()
    if any(k in hay for k in ROOF_KW): g.append("ROOF")
    if any(k in hay for k in SPEAK_KW): g.append("SPEAK")
    if any(k in hay for k in POP_KW): g.append("POP")
    if is_food:
        if any(k in hay for k in ["market","food hall","maxwell street"]): g.append("MKT")
    else:
        for cid, kws in KW.items():
            if cid == "FLW":
                if any(re.search(r"\b"+re.escape(k)+r"\b", hay) for k in kws) and ("lloyd" in hay or "prairie" in hay or "sullivan" in hay or "robie" in hay or "unity temple" in hay):
                    g.append(cid)
                continue
            if any(k in hay for k in kws): g.append(cid)
        srcs = {t[0] for t in x.get("sources", [])}
        if (srcs & ODD_SRC) or "oddit" in hay or "quirk" in hay or "hidden gem" in hay:
            g.append("ODD")
        if re.search(r'\bfree\b|no admission|free to (enter|visit)|free admission', hay): g.append("FREE")
        if not g: g.append("ARCH")
    out = []
    for c in g:
        if c not in out: out.append(c)
    return out[:4]

# ---- source metadata (labels for filter chips); synthesize for missing keys ----
SRC_LABEL = {
 "MICHELIN":"MICHELIN","MICHELIN_STAR":"MICHELIN ★","MICHELIN_BIB":"MICHELIN BIB","JAMESBEARD":"JAMES BEARD",
 "CHITRIB":"CHICAGO TRIBUNE","SUNTIMES":"CHICAGO SUN-TIMES","CHIMAG":"CHICAGO MAGAZINE","EATERCHI":"EATER CHICAGO",
 "INFATUATION":"INFATUATION","BLOCKCLUB":"BLOCK CLUB CHICAGO","WTTW":"WTTW","TIMEOUT":"TIME OUT CHICAGO",
 "CHOOSECHI":"CHOOSE CHICAGO","NPS":"NATIONAL PARK SVC","WIKIPEDIA":"WIKIPEDIA","ATLASOBSCURA":"ATLAS OBSCURA",
 "CHIREADER":"CHICAGO READER","WBEZ":"WBEZ","OFFICIAL":"OFFICIAL SITE","CHIPARKS":"CHICAGO PARK DISTRICT",
 "CITYCHI":"CITY OF CHICAGO","CAC":"CHICAGO ARCHITECTURE CTR","NYT":"NYT","BONAPPETIT":"BON APPÉTIT",
 "FOODWINE":"FOOD & WINE","UNESCO":"UNESCO","ILDNR":"ILLINOIS DNR","VISITMKE":"VISIT MILWAUKEE",
 "JSONLINE":"MILWAUKEE JOURNAL SENTINEL","CHICAGOIST":"CHICAGOIST","CRAINS":"CRAIN'S CHICAGO","ABC7":"ABC7 CHICAGO",
 "NBC5":"NBC 5 CHICAGO","WGN":"WGN","CBS2":"CBS CHICAGO","YELP":"YELP","TRIPADVISOR":"TRIPADVISOR",
 "TIKTOK":"TIKTOK/SOCIAL","YOUTUBE":"YOUTUBE","CHIGOV":"CITY OF CHICAGO","EATER":"EATER","SERIOUSEATS":"SERIOUS EATS",
 "FLWTRUST":"FLW TRUST","LANDMARKS":"CHICAGO LANDMARKS","NEWCITY":"NEWCITY","THRILLIST":"THRILLIST",
}
ALIAS = {"EATERCHICAGO":"EATERCHI","TIMEOUTCHI":"TIMEOUT","CHICAGOMAG":"CHIMAG","TRIBUNE":"CHITRIB",
         "CHICAGOTRIBUNE":"CHITRIB","SUNTIMESCHI":"SUNTIMES","CHOOSECHICAGO":"CHOOSECHI","MICHELIN_BIB":"MICHELIN",
         "MICHELIN_STAR":"MICHELIN","CHIGOV":"CITYCHI","JBF":"JAMESBEARD"}
def canon(k): return ALIAS.get(k, k)

# places confirmed permanently CLOSED and non-notable (or not a visitable business) — never re-add
EXCLUDE = set()

sights = []; food = []; srcmeta = {}; seen_names = set()
def _take(x, bucket):
    n = x.get("n")
    if not n or n in seen_names or n in EXCLUDE: return
    seen_names.add(n); bucket.append(x)
for path in sorted(glob.glob(os.path.join(D, "*.json"))):
    base = os.path.basename(path)
    if base.startswith(("_","out_","chi_","geo_","CREATORS","SOURCES_")) or "dataset" in base or "worklist" in base: continue
    d = json.load(open(path, encoding="utf-8"))
    if isinstance(d, list):
        for x in d: _take(x, food)
    else:
        for s in d.get('sources', []): srcmeta.setdefault(s['key'], s)
        for x in d.get('sights', []): _take(x, sights)
        for x in d.get('food', []):   _take(x, food)
for path in sorted(glob.glob(os.path.join(D, "SOURCES_*.json"))):
    for o in json.load(open(path, encoding="utf-8")).get("outlets", []):
        if o.get("key"): srcmeta.setdefault(o["key"], o)

def norm_sources(x):
    seen = []; out = []
    for t in x.get('sources', []):
        k = canon(t[0])
        pair = [k, t[1] if len(t) > 1 else ""]
        if (pair[0], pair[1]) in seen: continue
        seen.append((pair[0], pair[1])); out.append(pair)
    return out or [["WIKIPEDIA", ""]]

P = []; F = []; used_S = set(); used_F = set()
for x in sights:
    r = {"t":int(x["t"]),"a":x["a"],"n":x["n"],"ad":x["address"],"w":x["w"]}
    if x.get("k"): r["k"] = x["k"]
    if x.get("closed"): r["closed"] = True
    r["g"] = collections(x, False)
    r["s"] = norm_sources(x)
    for t in r["s"]: used_S.add(t[0])
    P.append(r)
for x in food:
    r = {"t":int(x["t"]),"a":x["a"],"n":x["n"],"ad":x["address"],"w":x["w"]}
    if x.get("k"): r["k"] = x["k"]
    if x.get("closed"): r["closed"] = True
    r["cz"] = map_cz(x.get("cz", []))
    g = collections(x, True)
    if g: r["g"] = g
    r["s"] = norm_sources(x)
    for t in r["s"]: used_F.add(t[0])
    F.append(r)

def mk_table(keys):
    tbl = {}
    for k in sorted(keys):
        m = srcmeta.get(k) or {}
        tbl[k] = {"k":SRC_LABEL.get(k, k.replace('_',' ').upper()),
                  "t":m.get("name", SRC_LABEL.get(k, k)), "u":m.get("url",""), "l":m.get("name","")}
    return tbl
S = mk_table(used_S); FS = mk_table(used_F)

bad_area = [r["n"] for r in P + F if r["a"] not in AC]
assert not bad_area, "unknown area id on: %s" % bad_area[:10]
out = {"areas":AREAS,"ac":AC,"cuisines":CUISINES,"cats":CATS,"P":P,"F":F,"S":S,"FS":FS}
json.dump(out, open(os.path.join(D,'chi_dataset.json'),'w'), indent=1, ensure_ascii=False)
work = [{"n":r["n"],"addr":r["ad"],"a":r["a"]} for r in P + F]
json.dump(work, open(os.path.join(D,'_chi_worklist.json'),'w'), ensure_ascii=False, indent=0)

print("P(sights):", len(P), " F(food):", len(F), " total:", len(P) + len(F))
print("S keys:", len(S), " FS keys:", len(FS))
print("by area:", dict(Counter(r["a"] for r in P + F)))
print("Collections coverage (sights):", dict(Counter(c for r in P for c in r.get("g", []))))
print("Cuisine coverage (food):", dict(Counter(c for r in F for c in r["cz"])))
closed = [r["n"] for r in P + F if r.get("closed")]
print("closed flagged:", closed if closed else "none")
print("wrote chi_dataset.json + _chi_worklist.json")
