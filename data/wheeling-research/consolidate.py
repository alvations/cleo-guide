#!/usr/bin/env python3
# Consolidate the Wheeling WV + National Road / I-70 corridor research files into one normalized dataset.
# Region = Wheeling, WV + nearby Washington, PA + the National Road (US-40 / I-70) corridor west through
# eastern Ohio (St. Clairsville / Belmont County, Cambridge / Guernsey County) to Zanesville / Muskingum
# County, up to where the Columbus guide's eastern edge begins (New Concord, Norwich, Newark/Buckeye Lake).
# Same pipeline + gates as every US city; standard engine theme.
import json, os, re, glob
from collections import Counter
D = os.path.dirname(os.path.abspath(__file__))

# ---- AREAS ----
AREAS = [
 {"id":"WHL","n":"Wheeling, WV (downtown, Centre Market, Oglebay, Wheeling Island)"},
 {"id":"WASH","n":"Washington, PA (Washington & Jefferson, LeMoyne House)"},
 {"id":"OHV","n":"Ohio Valley — St. Clairsville & Belmont County OH"},
 {"id":"CAM","n":"Cambridge & Guernsey County (Dickens Village, Salt Fork)"},
 {"id":"ZAN","n":"Zanesville & the National Road to the Columbus edge (Muskingum, New Concord, Norwich)"},
]
AC = {"WHL":"#C0504D","WASH":"#8064A2","OHV":"#4BACC6","CAM":"#9BBB59","ZAN":"#E8973A"}

# ---- cuisine taxonomy — the Ohio Valley / National Road canon ----
# The valley's own food story: Wheeling-style DiCarlo's pizza (cold cheese on a square), Coleman's fish
# sandwich, WV pepperoni rolls, the strong Italian heritage (Undo's, Figaretti's, Ye Olde Alpha), plus
# Zanesville's Tom's Ice Cream Bowl & Adornetto's, and the corridor diners/breweries.
CUISINES = [
 {"id":"ITAL","n":"Italian & Pizza"},{"id":"FISH","n":"Fish & Seafood"},
 {"id":"WVAPP","n":"WV / Appalachian (Pepperoni Rolls)"},{"id":"DINER","n":"Diners & Breakfast"},
 {"id":"US","n":"American & New American"},{"id":"BBQ","n":"BBQ & Smokehouse"},
 {"id":"MEX","n":"Mexican & Latin"},{"id":"ASIAN","n":"Asian"},
 {"id":"ICE","n":"Ice Cream & Sweets"},{"id":"BREW","n":"Breweries & Beer"},
 {"id":"CAFE","n":"Cafés & Coffee"},{"id":"VIRAL","n":"Viral / Local Favorite"},
]
CMAP = {
 "Italian":"ITAL","Pizza":"ITAL","Pizzeria":"ITAL","Neapolitan":"ITAL","Sicilian":"ITAL","Wheeling Pizza":"ITAL",
 "Fish":"FISH","Seafood":"FISH","Fish Sandwich":"FISH","Fish Fry":"FISH",
 "Appalachian":"WVAPP","Pepperoni Roll":"WVAPP","Pepperoni Rolls":"WVAPP","West Virginia":"WVAPP","Hot Dogs":"WVAPP","Coneys":"WVAPP","Slaw Dog":"WVAPP",
 "Diner":"DINER","Breakfast":"DINER","Brunch":"DINER","Comfort":"DINER","Home Cooking":"DINER",
 "American":"US","New American":"US","Contemporary":"US","Steakhouse":"US","Farm-to-table":"US","Gastropub":"US","Tavern":"US","Pub":"US","Supper Club":"US","Fine Dining":"US","Wings":"US",
 "Barbecue":"BBQ","BBQ":"BBQ","Smokehouse":"BBQ","Ribs":"BBQ",
 "Mexican":"MEX","Tacos":"MEX","Taqueria":"MEX","Latin American":"MEX","Tex-Mex":"MEX",
 "Thai":"ASIAN","Chinese":"ASIAN","Japanese":"ASIAN","Sushi":"ASIAN","Korean":"ASIAN","Indian":"ASIAN","Vietnamese":"ASIAN","Pho":"ASIAN","Ramen":"ASIAN",
 "Ice Cream":"ICE","Custard":"ICE","Bakery":"ICE","Dessert":"ICE","Candy":"ICE","Chocolate":"ICE","Donuts":"ICE","Confectionery":"ICE","Sweets":"ICE",
 "Brewery":"BREW","Beer":"BREW","Taproom":"BREW","Distillery":"BREW","Winery":"BREW","Cidery":"BREW","Cocktails":"BREW","Bar":"BREW",
 "Cafe":"CAFE","Café":"CAFE","Coffee":"CAFE","Roaster":"CAFE","Deli":"CAFE","Sandwiches":"CAFE",
 "Viral":"VIRAL",
}
def map_cz(raw):
    out=[]
    for c in raw:
        i=CMAP.get(c) or CMAP.get(c.strip())
        if i and i not in out: out.append(i)
    return out or ["US"]

# ---- Collections (CATS) + keyword rules ----
CATS=[{"id":"ICON","n":"Iconic & Must-See"},{"id":"HIST","n":"History & National Road"},
      {"id":"ARCH","n":"Bridges & Architecture"},{"id":"MUS","n":"Museums & Galleries"},
      {"id":"GLASS","n":"Glass, Pottery & Craft"},{"id":"PARK","n":"Parks & Outdoors"},
      {"id":"FAM","n":"Family & Kids"},{"id":"MKT","n":"Markets & Districts"},
      {"id":"ODD","n":"Oddities & Hidden Gems"},{"id":"FREE","n":"Free to Visit"}]
KW={
 "ICON":["suspension bridge","oglebay","y-bridge","independence hall","centre market","dickens","salt fork","wheeling suspension"],
 "HIST":["national road","independence hall","historic","victorian","lemoyne","zane grey","national pike","fort henry","centre market","victorian old town","monument","heritage","1800s","national register"],
 "ARCH":["suspension bridge","y-bridge","great stone viaduct","bridge","capitol theatre","victorian","cathedral","courthouse","stifel","arch"],
 "MUS":["museum","gallery","kruger street","toy and train","zane grey","national road museum","stifel fine arts","glass museum","artworks","john & annie glenn","john glenn","hopalong cassidy","degenstein"],
 "GLASS":["glass","pottery","ceramic","mosser","oglebay glass","fostoria","weller","roseville","artworks","alan cottrill","potter"],
 "PARK":["oglebay","salt fork","wheeling heritage trail","park","wheeling island","tomlinson run","dillon","blaine hill","zoo","good zoo","arboretum","nature","trail","state park","lake"],
 "FAM":["oglebay","good zoo","zoo","dickens","festival of lights","carousel","train","toy and train","amusement","wilderness","fantasy in lights"],
 "MKT":["centre market","market","district","downtown","historic district","antiques","artisan"],
}
ODD_SRC={"ATLASOBSCURA"}
def collections(x, is_food):
    g=list(x.get("g",[]))
    hay=(x.get("n","")+" "+x.get("w","")+" "+x.get("k","")+" "+" ".join(x.get("cz",[]))).lower()
    if is_food:
        if any(k in hay for k in ["market","centre market","farmers market","creamery"]): g.append("MKT")
    else:
        for cid,kws in KW.items():
            if any(k in hay for k in kws): g.append(cid)
        srcs={t[0] for t in x.get("sources",[])}
        if (x.get("t")==3 and (srcs & ODD_SRC)) or "oddit" in hay or "quirk" in hay or "hidden gem" in hay or "mail pouch" in hay:
            g.append("ODD")
        if re.search(r'\bfree\b|no admission|free to (enter|visit)|free admission', hay): g.append("FREE")
        if not g: g.append("HIST")
    out=[]
    for c in g:
        if c not in out: out.append(c)
    return out[:4]

# ---- source metadata (labels for filter chips); synthesize for missing keys ----
SRC_LABEL={
 "INTELLIGENCER":"WHEELING INTELLIGENCER","NEWSREGISTER":"WHEELING NEWS-REGISTER","WEELUNK":"WEELUNK",
 "WHEELINGHERITAGE":"WHEELING HERITAGE","VISITWHEELING":"VISIT WHEELING WV","WVTOURISM":"WV TOURISM",
 "OBSERVERREPORTER":"OBSERVER-REPORTER","WASHINGTONCOUNTY":"WASHINGTON CO. PA TOURISM","UNCOVERINGPA":"UNCOVERING PA",
 "TIMESRECORDER":"ZANESVILLE TIMES RECORDER","VISITZANESVILLE":"VISIT ZANESVILLE-MUSKINGUM","DAILYJEFFERSONIAN":"DAILY JEFFERSONIAN",
 "VISITGUERNSEY":"VISIT GUERNSEY COUNTY","DICKENSVICTORIAN":"DICKENS VICTORIAN VILLAGE","OHIOORG":"OHIO.ORG","OHIOMAG":"OHIO MAGAZINE",
 "WTRF":"WTRF 7","WVNEWS":"WV NEWS","ATLASOBSCURA":"ATLAS OBSCURA","WIKIPEDIA":"WIKIPEDIA","OFFICIAL":"OFFICIAL SITE",
 "NPS":"NATIONAL PARK SVC","NRHP":"NAT'L REGISTER","ODNR":"OHIO DNR (PARKS)","WVSTATEPARKS":"WV STATE PARKS",
 "JAMESBEARD":"JAMES BEARD","USATODAY":"USA TODAY 10BEST","YELP":"YELP","TRIPADVISOR":"TRIPADVISOR","GOOGLE":"GOOGLE","OPENTABLE":"OPENTABLE",
}
ALIAS={"WHEELINGINTELLIGENCER":"INTELLIGENCER","WHEELINGNEWSREGISTER":"NEWSREGISTER","THEINTELLIGENCER":"INTELLIGENCER",
       "VISITWHEELINGWV":"VISITWHEELING","ZANESVILLETIMESRECORDER":"TIMESRECORDER","OBSERVER_REPORTER":"OBSERVERREPORTER",
       "VISITZANESVILLEMUSKINGUM":"VISITZANESVILLE","UNCOVERING_PA":"UNCOVERINGPA"}
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
    if base.startswith(("_","out_","wh_","geo_","CREATORS","SOURCES_")) or "dataset" in base: continue
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
    if x.get("closed"): r["closed"]=True
    r["g"]=collections(x,False); r["s"]=norm_sources(x)
    for t in r["s"]: used_S.add(t[0])
    P.append(r)
for x in food:
    r={"t":int(x["t"]),"a":x["a"],"n":x["n"],"ad":x["address"],"w":x["w"]}
    if x.get("k"): r["k"]=x["k"]
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
json.dump(out,open(os.path.join(D,'wh_dataset.json'),'w'),indent=1,ensure_ascii=False)
work=[{"n":r["n"],"addr":r["ad"],"a":r["a"]} for r in P+F]
json.dump(work,open(os.path.join(D,'wh_worklist.json'),'w'),ensure_ascii=False,indent=0)

print("P(sights):",len(P)," F(food):",len(F)," total:",len(P)+len(F))
print("Area coverage:",dict(Counter(r["a"] for r in P+F)))
print("Cuisine coverage:",dict(Counter(c for r in F for c in r["cz"])))
print("closed flagged:",[r["n"] for r in P+F if r.get("closed")] or "none")
print("wrote wh_dataset.json + wh_worklist.json")
