#!/usr/bin/env python3
# Consolidate the Madison & Dane County (Wisconsin) research files into one normalized dataset.
# Region = the Isthmus & Capitol Square + UW campus & State Street + the east side (Willy St/Atwood/Monona)
# + the west side (Monroe St, Arboretum, Hilldale, Odana) + Middleton/Verona/Fitchburg + Dane County towns
# (Mount Horeb, Stoughton, Sun Prairie, McFarland, Cross Plains, Mazomanie) + day trips (Taliesin/Spring Green,
# New Glarus, House on the Rock, Devil's Lake/Baraboo). Same pipeline + gates as every US city; standard theme.
# Deterministic: reads every FOOD_*/SIGHTS_*/VIRAL_* research JSON; never hand-patch the dataset.
import json, os, re, glob
from collections import Counter
D = os.path.dirname(os.path.abspath(__file__))

# ---- AREAS (ids alphanumeric, <=5 chars) ----
AREAS = [
 {"id":"CAP","n":"The Isthmus & Capitol Square (downtown, King St, Monona Terrace)"},
 {"id":"UW","n":"UW–Madison campus & State Street (Bascom Hill, Memorial Union, Picnic Point)"},
 {"id":"EAST","n":"East side — Willy Street, Atwood, Schenk-Atwood, Monona & the north side"},
 {"id":"WEST","n":"West side — Monroe Street, the Arboretum, Hilldale & Odana"},
 {"id":"MVF","n":"Middleton, Verona & Fitchburg"},
 {"id":"DANE","n":"Dane County towns (Mount Horeb, Stoughton, Sun Prairie, McFarland, Cross Plains, Mazomanie)"},
 {"id":"TRIP","n":"Day trips (Spring Green & Taliesin, New Glarus, House on the Rock, Devil's Lake & Baraboo)"},
]
AC = {"CAP":"#C0504D","UW":"#41729F","EAST":"#9BBB59","WEST":"#8064A2","MVF":"#E8973A","DANE":"#4BACC6","TRIP":"#B5838D"}

# ---- cuisine taxonomy — Madison / Wisconsin's own canon first ----
CUISINES = [
 {"id":"CURD","n":"Cheese Curds & Cheese"},{"id":"FISH","n":"Friday Fish Fry"},
 {"id":"SUPPR","n":"Supper Clubs & Brandy Old Fashioneds"},{"id":"TAV","n":"Taverns, Brats & Burgers"},
 {"id":"CREAM","n":"Ice Cream & Frozen Custard"},{"id":"BAKE","n":"Bakeries & Kringle"},
 {"id":"SEA","n":"Hmong, Lao & Southeast Asian"},{"id":"ASIAN","n":"Asian"},
 {"id":"BREW","n":"Breweries, Wineries & Distilleries"},{"id":"FINE","n":"Farm-to-Table & Fine Dining"},
 {"id":"US","n":"American & New American"},{"id":"PIZZA","n":"Pizza"},
 {"id":"MEX","n":"Mexican & Latin"},{"id":"MED","n":"Mediterranean, Middle Eastern & African"},
 {"id":"EURO","n":"European (Swiss, German, Norwegian, Italian)"},
 {"id":"BREAK","n":"Breakfast, Cafés & Coffee"},{"id":"MKT","n":"Markets & Cheese Shops"},
 {"id":"FARM","n":"Farms & Orchards"},{"id":"VIRAL","n":"Viral / Creator Favorite"},
]
CMAP = {
 "Cheese Curds":"CURD","Cheese":"CURD","Cheese Shop":"CURD","Dairy":"CURD","Creamery":"CURD",
 "Fish Fry":"FISH","Friday Fish Fry":"FISH","Seafood":"FISH",
 "Supper Club":"SUPPR","Old Fashioned":"SUPPR","Steakhouse":"SUPPR",
 "Tavern":"TAV","Bar":"TAV","Pub":"TAV","Brats":"TAV","Burgers":"TAV","Butter Burger":"TAV","Gastropub":"TAV","Sports Bar":"TAV","Dive Bar":"TAV",
 "Ice Cream":"CREAM","Frozen Custard":"CREAM","Custard":"CREAM","Gelato":"CREAM",
 "Bakery":"BAKE","Kringle":"BAKE","Pastry":"BAKE","Donuts":"BAKE","Bread":"BAKE","Chocolate":"BAKE",
 "Hmong":"SEA","Lao":"SEA","Laotian":"SEA","Thai":"SEA","Vietnamese":"SEA","Cambodian":"SEA","Burmese":"SEA","Filipino":"SEA","Malaysian":"SEA","Indonesian":"SEA",
 "Chinese":"ASIAN","Japanese":"ASIAN","Sushi":"ASIAN","Ramen":"ASIAN","Korean":"ASIAN","Indian":"ASIAN","Nepali":"ASIAN","Tibetan":"ASIAN","Taiwanese":"ASIAN","Dumplings":"ASIAN","Pan-Asian":"ASIAN",
 "Brewery":"BREW","Beer":"BREW","Taproom":"BREW","Cidery":"BREW","Winery":"BREW","Distillery":"BREW","Cocktails":"BREW","Cocktail Bar":"BREW","Wine Bar":"BREW","Beer Hall":"BREW",
 "Farm-to-table":"FINE","Fine Dining":"FINE","Tasting Menu":"FINE","French":"FINE","Contemporary":"FINE",
 "American":"US","New American":"US","Southern":"US","BBQ":"US","Barbecue":"US","Soul Food":"US","Diner":"US","Comfort":"US","Sandwiches":"US","Deli":"US","Vegetarian":"US","Vegan":"US",
 "Pizza":"PIZZA","Neapolitan":"PIZZA","Tavern Pizza":"PIZZA",
 "Mexican":"MEX","Tacos":"MEX","Latin American":"MEX","Salvadoran":"MEX","Peruvian":"MEX","Colombian":"MEX","Cuban":"MEX","Puerto Rican":"MEX","Caribbean":"MEX","Jamaican":"MEX",
 "Mediterranean":"MED","Middle Eastern":"MED","Greek":"MED","Lebanese":"MED","Turkish":"MED","Afghan":"MED","Persian":"MED","Ethiopian":"MED","African":"MED","Moroccan":"MED","Somali":"MED",
 "Swiss":"EURO","German":"EURO","Norwegian":"EURO","Scandinavian":"EURO","Italian":"EURO","Spanish":"EURO","Basque":"EURO","Polish":"EURO","Irish":"EURO","British":"EURO","Russian":"EURO","Georgian":"EURO",
 "Breakfast":"BREAK","Brunch":"BREAK","Cafe":"BREAK","Café":"BREAK","Coffee":"BREAK","Bagels":"BREAK","Tea":"BREAK",
 "Market":"MKT","Farmers Market":"MKT","Grocery":"MKT","Food Hall":"MKT","Butcher":"MKT","Meat Market":"MKT","Sausage":"MKT",
 "Farm":"FARM","Orchard":"FARM","U-Pick":"FARM","Farm Stand":"FARM",
 "Viral":"VIRAL",
}
def map_cz(raw):
    out=[]
    for c in raw:
        i=CMAP.get(c) or CMAP.get(c.strip())
        if i and i not in out: out.append(i)
    return out or ["US"]

# ---- Collections (CATS) + keyword rules ----
CATS=[{"id":"ICON","n":"Iconic & Must-See"},{"id":"FLW","n":"Frank Lloyd Wright"},
      {"id":"CAMPUS","n":"UW–Madison Campus"},{"id":"MUS","n":"Museums & Galleries"},
      {"id":"LAKES","n":"Lakes, Parks & Gardens"},{"id":"OUTDOOR","n":"Hikes, Trails & Outdoors"},
      {"id":"HIST","n":"History & Heritage"},{"id":"ARTS","n":"Performing Arts & Music"},
      {"id":"FAM","n":"Family & Kids"},{"id":"ODD","n":"Oddities & Hidden Gems"},{"id":"FREE","n":"Free to Visit"}]
KW={
 "ICON":["state capitol","capitol square","memorial union terrace","monona terrace","taliesin","house on the rock","devil's lake","picnic point","arboretum","bascom hill","farmers' market","olbrich","new glarus brewing","camp randall"],
 "FLW":["frank lloyd wright","taliesin","monona terrace","first unitarian","meeting house","jacobs house","usonian","seth peterson","wright-designed","wright designed"],
 "CAMPUS":["uw–madison","uw-madison","university of wisconsin","bascom","memorial union","union south","camp randall","chazen","geology museum","picnic point","lakeshore path","babcock","observatory","kohl center","allen centennial","lakeshore nature preserve"],
 "MUS":["museum","gallery","chazen","mmoca","historical society","veterans museum","art center","exhibit","collection"],
 "LAKES":["lake","park","garden","conservatory","olbrich","arboretum","beach","preserve","marsh","botanical","lakeshore","boathouse","prairie"],
 "OUTDOOR":["trail","hike","state park","bluff","cave","glacial","bike","paddle","kayak","ski","overlook","drumlin","ice age","natural area","springs","gorge","rock"],
 "HIST":["historic","history","heritage","1800s","19th-century","national register","national historic","landmark","mound","effigy","pioneer","norwegian","swiss","settlers","cemetery","capitol"],
 "ARTS":["theater","theatre","overture","orpheum","concert","music","opera","symphony","shakespeare","stage","performing"],
 "FAM":["zoo","children","kids","family","farm","carousel","maze","water park","playground","troll"],
}
ODD_SRC={"ATLASOBSCURA"}
def collections(x, is_food):
    g=list(x.get("g",[]))
    hay=(x.get("n","")+" "+x.get("w","")+" "+x.get("k","")+" "+" ".join(x.get("cz",[]))).lower()
    if is_food:
        if any(k in hay for k in ["farmers' market","farmers market","cheese shop","market","creamery","orchard"]): g.append("MKT")
    else:
        for cid,kws in KW.items():
            if any(k in hay for k in kws): g.append(cid)
        srcs={t[0] for t in x.get("sources",[])}
        if (srcs & ODD_SRC) or "oddit" in hay or "quirk" in hay or "hidden gem" in hay: g.append("ODD")
        if re.search(r'\bfree\b|no admission|free to (enter|visit)|free admission', hay): g.append("FREE")
        if not g: g.append("HIST")
    out=[]
    for c in g:
        if c not in out: out.append(c)
    return out[:4]

# ---- source labels (filter chips); unknown keys get a synthesized label ----
SRC_LABEL={
 "WSJ":"WISCONSIN STATE JOURNAL","CAPTIMES":"CAP TIMES","ISTHMUS":"ISTHMUS","MADMAG":"MADISON MAGAZINE",
 "WPR":"WPR","PBSWI":"PBS WISCONSIN","VISITMADISON":"DESTINATION MADISON","TRAVELWI":"TRAVEL WISCONSIN",
 "JSONLINE":"MILWAUKEE JOURNAL SENTINEL","JAMESBEARD":"JAMES BEARD","WIDNR":"WISCONSIN DNR","NPS":"NPS",
 "FLWTRUST":"FLW TRUST","WHS":"WISCONSIN HIST. SOCIETY","CITYCAST":"CITY CAST MADISON","INFATUATION":"THE INFATUATION",
 "ATLASOBSCURA":"ATLAS OBSCURA","WIKIPEDIA":"WIKIPEDIA","OFFICIAL":"OFFICIAL SITE","NRHP":"NAT'L REGISTER",
 "UWNEWS":"UW–MADISON NEWS","WKOW":"WKOW 27","WMTV":"WMTV 15","CH3000":"CHANNEL 3000","EATER":"EATER",
 "TENBEST":"USA TODAY 10BEST","ONMILWAUKEE":"ONMILWAUKEE","USATODAY":"USA TODAY",
 "YELP":"YELP","TRIPADVISOR":"TRIPADVISOR","GOOGLE":"GOOGLE","OPENTABLE":"OPENTABLE",
}
ALIAS={"STATEJOURNAL":"WSJ","MADISONCOM":"WSJ","CAPTIMES_COM":"CAPTIMES","MADISONMAGAZINE":"MADMAG","CHANNEL3000":"CH3000",
       "DESTINATIONMADISON":"VISITMADISON","TRAVELWISCONSIN":"TRAVELWI","JOURNALSENTINEL":"JSONLINE","DNR":"WIDNR"}
def canon(k): return ALIAS.get(k,k)

srcmeta={}
for path in sorted(glob.glob(os.path.join(D,"SOURCES_*.json"))):
    try: d=json.load(open(path))
    except Exception: continue
    for o in d.get("outlets", d if isinstance(d,list) else []):
        if o.get("key"): srcmeta.setdefault(canon(o["key"]), {"key":canon(o["key"]),"name":o.get("name",o["key"]),"url":o.get("url","")})
for path in sorted(glob.glob(os.path.join(D,"CREATORS*.json"))):
    try: d=json.load(open(path))
    except Exception: continue
    for c in (d.get("creators",[]) if isinstance(d,dict) else []):
        if c.get("key"): srcmeta.setdefault(canon(c["key"]), {"key":canon(c["key"]),"name":c.get("name",c["key"]),"url":c.get("url","")})

sights=[]; food=[]; seen_names=set()
def _take(x, bucket):
    n=x.get("n")
    if not n or n in seen_names: return
    seen_names.add(n); bucket.append(x)
for path in sorted(glob.glob(os.path.join(D,"*.json"))):
    base=os.path.basename(path)
    if base.startswith(("_","mad_","geo_","CREATORS","SOURCES_")) or "dataset" in base or "worklist" in base: continue
    d=json.load(open(path))
    if isinstance(d, list):
        for x in d: _take(x, food)
    else:
        for s in d.get('sources',[]): srcmeta.setdefault(s['key'],s)
        for x in d.get('sights',[]): _take(x, sights)
        for x in d.get('food',[]):   _take(x, food)

def norm_sources(x):
    seen=[]; out=[]
    for t in x.get('sources',[]):
        k=canon(t[0]); pair=[k, t[1] if len(t)>1 else ""]; key=(pair[0],pair[1])
        if key in seen: continue
        seen.append(key); out.append(pair)
    return out or [["WIKIPEDIA",""]]

P=[]; F=[]; used_S=set(); used_F=set()
for x in sights:
    r={"t":int(x["t"]),"a":x["a"],"n":x["n"],"ad":x["address"],"w":x["w"]}
    if x.get("k"): r["k"]=x["k"]
    if x.get("warn"): r["warn"]=1
    if x.get("closed"): r["closed"]=True
    r["g"]=collections(x,False); r["s"]=norm_sources(x)
    for t in r["s"]: used_S.add(t[0])
    P.append(r)
for x in food:
    r={"t":int(x["t"]),"a":x["a"],"n":x["n"],"ad":x["address"],"w":x["w"]}
    if x.get("dish") and x["dish"].lower() not in x["w"].lower(): r["w"]=x["w"].rstrip()+" <strong>Order:</strong> "+x["dish"]+"."
    if x.get("k"): r["k"]=x["k"]
    if x.get("warn"): r["warn"]=1
    if x.get("closed"): r["closed"]=True
    r["cz"]=map_cz(x.get("cz",[]))
    g=collections(x,True)
    if g: r["g"]=g
    r["s"]=norm_sources(x)
    for t in r["s"]: used_F.add(t[0])
    F.append(r)

def mk_table(keys):
    tbl={}
    for k in sorted(keys):
        m=srcmeta.get(k) or {}
        tbl[k]={"k":SRC_LABEL.get(k,k.replace('_',' ').upper()),"t":m.get("name",SRC_LABEL.get(k,k)),
                "u":m.get("url",""),"l":m.get("name","")}
    return tbl
S=mk_table(used_S); FS=mk_table(used_F)

out={"areas":AREAS,"ac":AC,"cuisines":CUISINES,"cats":CATS,"P":P,"F":F,"S":S,"FS":FS}
json.dump(out,open(os.path.join(D,'mad_dataset.json'),'w'),indent=1,ensure_ascii=False)
work=[{"n":r["n"],"addr":r["ad"],"a":r["a"]} for r in P+F]
json.dump(work,open(os.path.join(D,'_worklist.json'),'w'),ensure_ascii=False,indent=0)

print("P(sights):",len(P)," F(food):",len(F)," total:",len(P)+len(F))
print("Area coverage:",dict(Counter(r["a"] for r in P+F)))
print("Cuisine coverage:",dict(Counter(c for r in F for c in r["cz"])))
print("closed flagged:",[r["n"] for r in P+F if r.get("closed")] or "none")
print("wrote mad_dataset.json + _worklist.json")
