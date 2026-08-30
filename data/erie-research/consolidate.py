#!/usr/bin/env python3
# Consolidate the Erie, PA + I-79/US-19 corridor research files into one normalized dataset.
# Region = Erie, PA (Bayfront, Presque Isle, downtown, Millcreek) + the Lake Erie wine belt (North East)
# + the corridor south toward Pittsburgh: Meadville, Edinboro, Cambridge Springs, Conneaut Lake, Grove
# City, Mercer, Slippery Rock, Zelienople/Harmony, Cranberry. Same pipeline + gates as every US city.
import json, os, re, glob
from collections import Counter
D = os.path.dirname(os.path.abspath(__file__))

# ---- AREAS ----
AREAS = [
 {"id":"ERIE","n":"Erie, PA (Bayfront, Presque Isle, downtown, Millcreek)"},
 {"id":"NORTHEAST","n":"North East & the Lake Erie wine belt"},
 {"id":"MEADVILLE","n":"Meadville & Crawford County (Allegheny College, Market House)"},
 {"id":"EDINBORO","n":"Edinboro & Cambridge Springs"},
 {"id":"GROVECITY","n":"Grove City, Mercer & Slippery Rock"},
 {"id":"CORRIDOR","n":"I-79 corridor south to Pittsburgh (Conneaut Lake, Zelienople, Harmony, Cranberry)"},
]
AC = {"ERIE":"#2E6DA4","NORTHEAST":"#8E44AD","MEADVILLE":"#16A085","EDINBORO":"#C0504D","GROVECITY":"#E8973A","CORRIDOR":"#6C7A89"}

# ---- cuisine taxonomy — the Erie / Lake Erie canon ----
# Erie's own food story: the Greek-sauce hot dog (New York Lunch, Sara's), deep-fried pepperoni balls
# (Stanganelli's), sponge candy (Romolo, Pulakos), strong Italian/Federal Hill heritage, Great-Lakes
# perch & walleye fish fries, the Lake Erie wine belt (Mazza, Penn Shore, Arrowhead), and the breweries.
CUISINES = [
 {"id":"ITAL","n":"Italian & Pizza"},{"id":"GREEK","n":"Greek Dogs & Diners"},
 {"id":"FISH","n":"Great-Lakes Fish (Perch & Walleye)"},{"id":"US","n":"American & New American"},
 {"id":"BBQ","n":"BBQ & Smokehouse"},{"id":"BREW","n":"Breweries, Wineries & Beer"},
 {"id":"DESSERT","n":"Sponge Candy & Sweets"},{"id":"ASIAN","n":"Asian"},
 {"id":"CAFE","n":"Cafés & Coffee"},{"id":"MEX","n":"Mexican & Latin"},
 {"id":"VIRAL","n":"Viral / Local Favorite"},
]
CMAP = {
 "Italian":"ITAL","Pizza":"ITAL","Pizzeria":"ITAL","Sicilian":"ITAL","Neapolitan":"ITAL",
 "Greek":"GREEK","Greek Dog":"GREEK","Hot Dogs":"GREEK","Coneys":"GREEK","Diner":"GREEK","Breakfast":"GREEK","Brunch":"GREEK",
 "Fish":"FISH","Seafood":"FISH","Perch":"FISH","Walleye":"FISH","Fish Fry":"FISH","Fish Sandwich":"FISH",
 "American":"US","New American":"US","Contemporary":"US","Steakhouse":"US","Gastropub":"US","Tavern":"US","Pub":"US","Comfort":"US","Fine Dining":"US","Wings":"US","Sandwiches":"US","Deli":"US",
 "Barbecue":"BBQ","BBQ":"BBQ","Smokehouse":"BBQ","Ribs":"BBQ",
 "Brewery":"BREW","Beer":"BREW","Taproom":"BREW","Distillery":"BREW","Winery":"BREW","Wine":"BREW","Cidery":"BREW","Cocktails":"BREW","Bar":"BREW",
 "Dessert":"DESSERT","Ice Cream":"DESSERT","Custard":"DESSERT","Candy":"DESSERT","Sponge Candy":"DESSERT","Chocolate":"DESSERT","Bakery":"DESSERT","Donuts":"DESSERT","Confectionery":"DESSERT","Sweets":"DESSERT",
 "Thai":"ASIAN","Chinese":"ASIAN","Japanese":"ASIAN","Sushi":"ASIAN","Korean":"ASIAN","Indian":"ASIAN","Vietnamese":"ASIAN","Pho":"ASIAN","Ramen":"ASIAN","Asian":"ASIAN",
 "Cafe":"CAFE","Café":"CAFE","Coffee":"CAFE","Roaster":"CAFE",
 "Mexican":"MEX","Tacos":"MEX","Taqueria":"MEX","Latin American":"MEX","Tex-Mex":"MEX",
 "Viral":"VIRAL",
}
def map_cz(raw):
    out=[]
    for c in raw:
        i=CMAP.get(c) or CMAP.get(c.strip())
        if i and i not in out: out.append(i)
    return out or ["US"]

# ---- Collections (CATS) + keyword rules ----
CATS=[{"id":"ICON","n":"Iconic & Must-See"},{"id":"HIST","n":"History & Heritage"},
      {"id":"MARITIME","n":"Bayfront & Maritime"},{"id":"MUS","n":"Museums & Galleries"},
      {"id":"CRAFT","n":"Wine, Glass & Craft"},{"id":"PARK","n":"Parks & Outdoors"},
      {"id":"FAM","n":"Family & Amusement"},{"id":"MKT","n":"Markets & Shopping"},
      {"id":"ODD","n":"Oddities & Hidden Gems"},{"id":"FREE","n":"Free to Visit"}]
KW={
 "ICON":["presque isle","bicentennial tower","us brig niagara","waldameer","bayfront","market house","conneaut lake park"],
 "HIST":["historic","national register","heritage","1800s","harmony","harmonist","market house","erie land lighthouse","land lighthouse","hagen history","fort presque isle","zelienople","nhl","victorian","1892","1927"],
 "MARITIME":["maritime","niagara","brig","lighthouse","bayfront","presque isle","dobbins","perry monument","tall ship"],
 "MUS":["museum","gallery","art museum","hagen","experience children","firefighters","expERIEnce","planetarium","baldwin reynolds"],
 "CRAFT":["forge","wendell august","glass","pottery","winery","wine","vineyard","mazza","penn shore","arrowhead","cidery"],
 "PARK":["presque isle","state park","park","moraine","mcconnells mill","gorge","nature","trail","lake","beach","arboretum","conneaut lake","wintergreen","goddard"],
 "FAM":["waldameer","zoo","amusement","water park","splash","conneaut lake park","experience children","carousel","go-kart"],
 "MKT":["market house","market","shopping","outlets","premium outlets","mall","district","antiques"],
}
ODD_SRC={"ATLASOBSCURA"}
def collections(x, is_food):
    g=list(x.get("g",[]))
    hay=(x.get("n","")+" "+x.get("w","")+" "+x.get("k","")+" "+" ".join(x.get("cz",[]))).lower()
    if is_food:
        if any(k in hay for k in ["market","market house","farmers market","creamery"]): g.append("MKT")
    else:
        for cid,kws in KW.items():
            if any(k in hay for k in kws): g.append(cid)
        srcs={t[0] for t in x.get("sources",[])}
        if (x.get("t")==3 and (srcs & ODD_SRC)) or "oddit" in hay or "quirk" in hay or "hidden gem" in hay:
            g.append("ODD")
        if re.search(r'\bfree\b|no admission|free to (enter|visit)|free admission', hay): g.append("FREE")
        if not g: g.append("HIST")
    out=[]
    for c in g:
        if c not in out: out.append(c)
    return out[:4]

# ---- source metadata (labels for filter chips) ----
SRC_LABEL={
 "GOERIE":"ERIE TIMES-NEWS","ERIETIMESNEWS":"ERIE TIMES-NEWS","ERIEREADER":"ERIE READER","VISITERIE":"VISIT ERIE",
 "POSTGAZETTE":"PITTSBURGH POST-GAZETTE","TRIBLIVE":"TRIBLIVE","VISITPA":"VISIT PA","UNCOVERINGPA":"UNCOVERING PA",
 "MEADVILLETRIBUNE":"MEADVILLE TRIBUNE","VISITCRAWFORD":"VISIT CRAWFORD COUNTY","MERCERCOUNTY":"MERCER CO. PA",
 "DCNR":"PA DCNR (STATE PARKS)","NPS":"NATIONAL PARK SVC","NRHP":"NAT'L REGISTER","WIKIPEDIA":"WIKIPEDIA","OFFICIAL":"OFFICIAL SITE",
 "JAMESBEARD":"JAMES BEARD","USATODAY":"USA TODAY 10BEST","ATLASOBSCURA":"ATLAS OBSCURA","PABUCKETLIST":"PA BUCKET LIST",
 "YELP":"YELP","TRIPADVISOR":"TRIPADVISOR","GOOGLE":"GOOGLE","OPENTABLE":"OPENTABLE",
}
ALIAS={"ERIETIMES":"GOERIE","ERIETIMESNEWS":"GOERIE","THEERIEREADER":"ERIEREADER","PITTSBURGHPOSTGAZETTE":"POSTGAZETTE",
       "VISITERIEPA":"VISITERIE","UNCOVERING_PA":"UNCOVERINGPA","PA_BUCKET_LIST":"PABUCKETLIST"}
def canon(k): return ALIAS.get(k,k)

# ---- source & creator metadata from separate files (labels only) ----
srcmeta={}
for path in sorted(glob.glob(os.path.join(D,"SOURCES_*.json"))):
    try: d=json.load(open(path))
    except Exception: continue
    _outlets = (d.get("outlets", []) if isinstance(d, dict) else d) if d else []
    for o in _outlets:
        if isinstance(o, dict) and o.get("key"): srcmeta.setdefault(canon(o["key"]), {"key":canon(o["key"]),"name":o.get("name",o["key"]),"url":o.get("url","")})
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
    if base.startswith(("_","out_","er_","geo_","CREATORS","SOURCES_")) or "dataset" in base: continue
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
json.dump(out,open(os.path.join(D,'er_dataset.json'),'w'),indent=1,ensure_ascii=False)
work=[{"n":r["n"],"addr":r["ad"],"a":r["a"]} for r in P+F]
json.dump(work,open(os.path.join(D,'er_worklist.json'),'w'),ensure_ascii=False,indent=0)

print("P(sights):",len(P)," F(food):",len(F)," total:",len(P)+len(F))
print("Area coverage:",dict(Counter(r["a"] for r in P+F)))
print("Cuisine coverage:",dict(Counter(c for r in F for c in r["cz"])))
print("closed flagged:",[r["n"] for r in P+F if r.get("closed")] or "none")
print("wrote er_dataset.json + er_worklist.json")
