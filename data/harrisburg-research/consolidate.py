#!/usr/bin/env python3
# Consolidate the Harrisburg · York · Lancaster & Amish Country (South-Central PA) research files into one
# normalized dataset. Region = Harrisburg + the West Shore, Hershey/Derry Twp, Carlisle & the Cumberland
# Valley, York & York County, Lancaster city, Lancaster County Amish country, and Gettysburg as the day-trip
# edge. Same pipeline + gates as every US city; standard engine theme (not pastel). Deterministic — no
# hand-patched datasets; every record comes from a FOOD_*/SIGHTS_* research file in this dir.
import json, os, re, glob
from collections import Counter
D = os.path.dirname(os.path.abspath(__file__))

# ---- AREAS ----
AREAS = [
 {"id":"HBG","n":"Harrisburg & the West Shore (Midtown, Camp Hill, Mechanicsburg)"},
 {"id":"HER","n":"Hershey & Derry Township (Hummelstown, Middletown, Palmyra)"},
 {"id":"CAR","n":"Carlisle & the Cumberland Valley (Boiling Springs, Shippensburg)"},
 {"id":"YORK","n":"York & York County (Hanover, the factory-tour trail)"},
 {"id":"LAN","n":"Lancaster city (Central Market, Penn Square, the Gallery Row)"},
 {"id":"AMISH","n":"Lancaster County Amish country (Intercourse, Bird-in-Hand, Strasburg, Ephrata, Lititz)"},
 {"id":"GBG","n":"Gettysburg & Adams County (the day-trip edge)"},
]
AC = {"HBG":"#C0504D","HER":"#8B5A2B","CAR":"#9BBB59","YORK":"#41729F","LAN":"#E8973A","AMISH":"#8064A2","GBG":"#4BACC6"}

# ---- cuisine taxonomy — the Pennsylvania Dutch canon first ----
# South-central PA's own canon: shoofly pie, whoopie pies, PA Dutch chicken pot pie (the square-noodle
# kind), chow-chow, scrapple, soft pretzels (Lititz — Julius Sturgis), the York/Hanover snack belt (Utz,
# Snyder's of Hanover, York Peppermint Pattie heritage), Hershey chocolate, family-style smorgasbords, and
# the historic standing markets (Lancaster Central Market, Harrisburg Broad Street Market).
CUISINES = [
 {"id":"PADUTCH","n":"Pennsylvania Dutch & Smorgasbords"},{"id":"BAKE","n":"Bakeries, Shoofly & Whoopie Pies"},
 {"id":"PRETZ","n":"Pretzels, Chips & Snack Factories"},{"id":"SWEET","n":"Chocolate, Candy & Ice Cream"},
 {"id":"MKT","n":"Markets"},{"id":"FARM","n":"Farms, Orchards & U-Pick"},
 {"id":"DINER","n":"Diners & Breakfast"},{"id":"US","n":"American & New American"},
 {"id":"BREW","n":"Breweries, Wineries & Distilleries"},{"id":"ITAL","n":"Italian & Pizza"},
 {"id":"BBQ","n":"BBQ & Smokehouse"},{"id":"MEX","n":"Mexican, Puerto Rican & Latin"},
 {"id":"ASIAN","n":"Asian"},{"id":"MED","n":"Mediterranean, Middle Eastern & African"},
 {"id":"CAFE","n":"Coffee & Cafés"},{"id":"VIRAL","n":"Viral / Local Favorite"},
]
CMAP = {
 "Pennsylvania Dutch":"PADUTCH","PA Dutch":"PADUTCH","Amish":"PADUTCH","Smorgasbord":"PADUTCH","Buffet":"PADUTCH","Family-style":"PADUTCH","Scrapple":"PADUTCH","Pot Pie":"PADUTCH",
 "Bakery":"BAKE","Pie":"BAKE","Whoopie Pie":"BAKE","Shoofly Pie":"BAKE","Donuts":"BAKE","Doughnuts":"BAKE","Pastry":"BAKE","Bake Shop":"BAKE",
 "Pretzels":"PRETZ","Pretzel":"PRETZ","Snacks":"PRETZ","Chips":"PRETZ","Potato Chips":"PRETZ","Snack Factory":"PRETZ",
 "Chocolate":"SWEET","Candy":"SWEET","Ice Cream":"SWEET","Creamery":"SWEET","Dairy":"SWEET","Custard":"SWEET","Gelato":"SWEET","Confectionery":"SWEET","Dessert":"SWEET",
 "Market":"MKT","Farmers Market":"MKT","Public Market":"MKT","Flea Market":"MKT","Amish Market":"MKT","Food Hall":"MKT","Antiques":"MKT",
 "Farm":"FARM","Orchard":"FARM","Farm Stand":"FARM","U-Pick":"FARM","Fruit Farm":"FARM",
 "Diner":"DINER","Breakfast":"DINER","Brunch":"DINER","Luncheonette":"DINER",
 "American":"US","New American":"US","Contemporary":"US","Steakhouse":"US","Farm-to-table":"US","Seafood":"US","Fine Dining":"US","Tavern":"US","Pub":"US","Gastropub":"US","Burgers":"US","Hot Dogs":"US","Sandwiches":"US","Deli":"US","Southern":"US","Soul Food":"US","Cheesesteak":"US",
 "Brewery":"BREW","Beer":"BREW","Taproom":"BREW","Cidery":"BREW","Winery":"BREW","Distillery":"BREW","Cocktails":"BREW","Wine Bar":"BREW","Brewpub":"BREW",
 "Italian":"ITAL","Pizza":"ITAL","Neapolitan":"ITAL",
 "Barbecue":"BBQ","BBQ":"BBQ","Smokehouse":"BBQ",
 "Mexican":"MEX","Tacos":"MEX","Latin American":"MEX","Puerto Rican":"MEX","Dominican":"MEX","Cuban":"MEX","Salvadoran":"MEX","Peruvian":"MEX","Colombian":"MEX","Venezuelan":"MEX",
 "Thai":"ASIAN","Chinese":"ASIAN","Japanese":"ASIAN","Sushi":"ASIAN","Ramen":"ASIAN","Korean":"ASIAN","Indian":"ASIAN","Vietnamese":"ASIAN","Pho":"ASIAN","Nepali":"ASIAN","Bhutanese":"ASIAN","Filipino":"ASIAN","Burmese":"ASIAN","Malaysian":"ASIAN",
 "Mediterranean":"MED","Middle Eastern":"MED","Greek":"MED","Lebanese":"MED","Turkish":"MED","Syrian":"MED","Iraqi":"MED","Ethiopian":"MED","African":"MED","Moroccan":"MED","Falafel":"MED","Halal":"MED",
 "Coffee":"CAFE","Cafe":"CAFE","Café":"CAFE","Tea":"CAFE","Coffeehouse":"CAFE",
 "Viral":"VIRAL",
}
def map_cz(raw):
    out=[]
    for c in raw:
        i=CMAP.get(c) or CMAP.get(c.strip())
        if i and i not in out: out.append(i)
    return out or ["US"]

# ---- Collections (CATS) + keyword rules ----
CATS=[{"id":"ICON","n":"Iconic & Must-See"},{"id":"CIVIL","n":"Civil War & Gettysburg"},
      {"id":"AMISH","n":"Amish & Plain Country"},{"id":"FACT","n":"Factory Tours & Makers"},
      {"id":"MUS","n":"Museums & Galleries"},{"id":"HIST","n":"History & Heritage"},
      {"id":"PARK","n":"Parks, Gardens & Nature"},{"id":"OUTDOOR","n":"Hikes, Trails & Outdoors"},
      {"id":"RAIL","n":"Railroads & Trolleys"},{"id":"FAM","n":"Family & Kids"},
      {"id":"ODD","n":"Oddities & Hidden Gems"},{"id":"FREE","n":"Free to Visit"}]
KW={
 "ICON":["state capitol","hersheypark","hershey's chocolate world","gettysburg national military park","central market","strasburg rail road","sight & sound","eisenhower national","national civil war museum","hershey gardens","the hershey story","landis valley","ephrata cloister","wheatland","american music theatre"],
 "CIVIL":["civil war","gettysburg","battlefield","little round top","cemetery ridge","seminary ridge","pickett","lincoln","union","confederate","1863","underground railroad"],
 "AMISH":["amish","mennonite","plain","intercourse","bird-in-hand","buggy","covered bridge","one-room","quilt","old order","farmland","hex"],
 "FACT":["factory tour","factory","utz","snyder's","harley-davidson","pretzel bakery","sturgis","chocolate world","wilbur","martin's","herr's","kitchen kettle","maker","brewing museum"],
 "MUS":["museum","gallery","art center","heritage center","planetarium","science center","library","historical society"],
 "HIST":["historic","history","1700s","1800s","colonial","national register","national historic","landmark","mansion","cloister","homestead","fort","heritage","courthouse","capitol","wheatland","stevens","revolutionary"],
 "PARK":["park","garden","gardens","arboretum","preserve","nature","zoo","riverfront","island","conservancy"],
 "OUTDOOR":["trail","hike","overlook","state park","appalachian","pinnacle","rail trail","river","lake","falls","kayak","canoe","bike","rock"],
 "RAIL":["railroad","rail road","railway","train","trolley","locomotive","railroad museum"],
 "FAM":["zoo","hersheypark","chocolate world","dutch wonderland","kids","children","family","amusement","carousel","petting","maze","water park","aquarium","science"],
}
ODD_SRC={"ATLASOBSCURA"}
def collections(x, is_food):
    g=list(x.get("g",[]))
    hay=(x.get("n","")+" "+x.get("w","")+" "+x.get("k","")+" "+" ".join(x.get("cz",[]))).lower()
    if is_food:
        return []
    for cid,kws in KW.items():
        if any(k in hay for k in kws): g.append(cid)
    srcs={t[0] for t in x.get("sources",[])}
    if (srcs & ODD_SRC) or "oddit" in hay or "quirk" in hay or "hidden gem" in hay:
        g.append("ODD")
    if re.search(r'\bfree\b|no admission|free to (enter|visit)|free admission', hay): g.append("FREE")
    if not g: g.append("HIST")
    out=[]
    for c in g:
        if c not in out: out.append(c)
    return out[:4]

# ---- source metadata (labels for filter chips); synthesize for missing keys ----
SRC_LABEL={
 "LNP":"LANCASTERONLINE / LNP","PENNLIVE":"PENNLIVE","YDR":"YORK DAILY RECORD","YORKDISPATCH":"YORK DISPATCH",
 "DISCOVERLANC":"DISCOVER LANCASTER","VISITHERSHEY":"VISIT HERSHEY & HARRISBURG","EXPLOREYORK":"EXPLORE YORK",
 "DESTGETTYSBURG":"DESTINATION GETTYSBURG","VISITCUMBERLAND":"VISIT CUMBERLAND VALLEY","NPS":"NATIONAL PARK SERVICE",
 "DCNR":"PA DCNR (PARKS)","WITF":"WITF","SMITHSONIAN":"SMITHSONIAN","JAMESBEARD":"JAMES BEARD",
 "VISITPA":"VISIT PA","UNCOVERINGPA":"UNCOVERING PA","ATLASOBSCURA":"ATLAS OBSCURA","WIKIPEDIA":"WIKIPEDIA",
 "OFFICIAL":"OFFICIAL SITE","NRHP":"NAT'L REGISTER","PHMC":"PA HISTORICAL & MUSEUM COMM.","USATODAY":"USA TODAY 10BEST",
 "ABC27":"ABC27 WHTM","FOX43":"FOX43","WGAL":"WGAL","CBS21":"CBS21","THEBURG":"THEBURG","FLY":"FLY MAGAZINE",
 "TRAVELLEISURE":"TRAVEL + LEISURE","FOODNETWORK":"FOOD NETWORK","EATER":"EATER","NYTIMES":"NEW YORK TIMES",
 "YELP":"YELP","TRIPADVISOR":"TRIPADVISOR","GOOGLE":"GOOGLE","OPENTABLE":"OPENTABLE",
}
ALIAS={"LANCASTERONLINE":"LNP","LANCASTER_ONLINE":"LNP","YORKDAILYRECORD":"YDR","DISCOVERLANCASTER":"DISCOVERLANC",
       "HERSHEYHARRISBURG":"VISITHERSHEY","VISITHERSHEYHARRISBURG":"VISITHERSHEY","EXPLORE_YORK":"EXPLOREYORK",
       "GETTYSBURG_CVB":"DESTGETTYSBURG","UNCOVERING_PA":"UNCOVERINGPA"}
def canon(k): return ALIAS.get(k,k)

# ---- source & creator metadata from separate files (labels only) ----
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

# ---- build unified records ----
sights=[]; food=[]; seen_names=set()
def _take(x, bucket):
    n=x.get("n")
    if not n or n in seen_names: return
    seen_names.add(n); bucket.append(x)
for path in sorted(glob.glob(os.path.join(D,"*.json"))):
    base=os.path.basename(path)
    if base.startswith(("_","out_","hbg_","geo_","CREATORS","SOURCES_")) or "dataset" in base: continue
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
    return out   # never synthesize a source: an unsourced record must fail GATE 1, not borrow a label

P=[]; F=[]; used_S=set(); used_F=set()
for x in sights:
    r={"t":int(x["t"]),"a":x["a"],"n":x["n"],"ad":x["address"],"w":x["w"]}
    if x.get("k"): r["k"]=x["k"]
    if x.get("closed"): r["closed"]=True
    r["g"]=collections(x,False); r["s"]=norm_sources(x)
    for t in r["s"]: used_S.add(t[0])
    P.append(r)
for x in food:
    w=x["w"]
    if x.get("dish") and x["dish"].lower()[:40] not in w.lower():
        w=w.rstrip()+" Order: "+x["dish"].rstrip(".")+"."
    r={"t":int(x["t"]),"a":x["a"],"n":x["n"],"ad":x["address"],"w":w}
    if x.get("k"): r["k"]=x["k"]
    if x.get("closed"): r["closed"]=True
    if x.get("warn"): r["warn"]=1
    r["cz"]=map_cz(x.get("cz",[]))
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
json.dump(out,open(os.path.join(D,'hbg_dataset.json'),'w'),indent=1,ensure_ascii=False)
work=[{"n":r["n"],"addr":r["ad"],"a":r["a"]} for r in P+F]
json.dump(work,open(os.path.join(D,'_hbg_worklist.json'),'w'),ensure_ascii=False,indent=0)

print("P(sights):",len(P)," F(food):",len(F)," total:",len(P)+len(F))
print("Area coverage:",dict(Counter(r["a"] for r in P+F)))
print("Cuisine coverage:",dict(Counter(c for r in F for c in r["cz"])))
print("closed flagged:",[r["n"] for r in P+F if r.get("closed")] or "none")
print("wrote hbg_dataset.json + _hbg_worklist.json")
