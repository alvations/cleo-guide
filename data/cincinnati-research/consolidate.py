#!/usr/bin/env python3
# Consolidate the Cincinnati research files into one normalized dataset.
# Region = Cincinnati OH proper + the Northern Kentucky riverfront (Covington, Newport, Bellevue) that
# faces downtown across the Ohio River. Mirrors the SF/SV/NYC pipeline.
import json, os, re
D = os.path.dirname(os.path.abspath(__file__))

# ---- AREAS = Cincinnati neighborhoods + the NKY riverfront ----
AREAS = [
 {"id":"DTN","n":"Downtown & The Banks"},
 {"id":"OTR","n":"Over-the-Rhine & Pendleton"},
 {"id":"UPT","n":"Uptown (Clifton, Corryville & CUF)"},
 {"id":"EAST","n":"East Side (Hyde Park, Oakley, Mt. Lookout)"},
 {"id":"WEST","n":"West Side & Northside"},
 {"id":"BURB","n":"Northern Suburbs (Blue Ash, Montgomery, Mason)"},
 {"id":"NKY","n":"Northern Kentucky (Covington, Newport, Bellevue)"},
]
AC = {"DTN":"#E8973A","OTR":"#C0504D","UPT":"#8064A2","EAST":"#4F81BD","WEST":"#9BBB59",
      "BURB":"#4BACC6","NKY":"#7E8FC4"}

# ---- cuisine taxonomy ----
# Cincinnati's food story is genuinely its own: Cincinnati chili (Skyline/Gold Star/Camp Washington),
# goetta and the German heritage of Over-the-Rhine, Montgomery Inn ribs, Findlay Market, Graeter's ice
# cream, LaRosa's pizza, and a craft-beer revival (Rhinegeist, MadTree, Braxton across the river).
CUISINES = [
 {"id":"CHILI","n":"Cincinnati Chili"},{"id":"GERMAN","n":"German & Goetta"},
 {"id":"BBQ","n":"Ribs & Barbecue"},{"id":"PIZZA","n":"Pizza"},
 {"id":"US","n":"American & New American"},{"id":"BURG","n":"Burgers & Diners"},
 {"id":"SOUL","n":"Soul & Southern"},{"id":"MEX","n":"Mexican & Latin"},
 {"id":"ASIAN","n":"Asian"},{"id":"MED","n":"Mediterranean & Middle Eastern"},
 {"id":"ICE","n":"Ice Cream & Bakeries"},{"id":"BREW","n":"Breweries & Beer"},
 {"id":"COF","n":"Coffee & Cafés"},{"id":"VIRAL","n":"Viral / Social"},
]
CMAP = {
 "Cincinnati Chili":"CHILI","Chili":"CHILI","Coney":"CHILI",
 "German":"GERMAN","Goetta":"GERMAN","Bratwurst":"GERMAN","Bavarian":"GERMAN",
 "Barbecue":"BBQ","BBQ":"BBQ","Ribs":"BBQ","Smokehouse":"BBQ",
 "Pizza":"PIZZA","Neapolitan":"PIZZA",
 "American":"US","New American":"US","Californian":"US","Steakhouse":"US","Contemporary":"US",
 "Farm-to-table":"US","Gastropub":"US","French":"US","Seafood":"US","Supper Club":"US",
 "Burgers":"BURG","Diner":"BURG","Breakfast":"BURG","Brunch":"BURG","Sandwiches":"BURG","Deli":"BURG","Hot Dogs":"BURG",
 "Soul Food":"SOUL","Southern":"SOUL","Cajun":"SOUL","Creole":"SOUL","Fried Chicken":"SOUL",
 "Mexican":"MEX","Tacos":"MEX","Taqueria":"MEX","Latin American":"MEX","Peruvian":"MEX","Salvadoran":"MEX","Cuban":"MEX",
 "Vietnamese":"ASIAN","Thai":"ASIAN","Chinese":"ASIAN","Cantonese":"ASIAN","Japanese":"ASIAN","Sushi":"ASIAN",
 "Ramen":"ASIAN","Korean":"ASIAN","Indian":"ASIAN","Filipino":"ASIAN","Dim Sum":"ASIAN","Pho":"ASIAN","Malaysian":"ASIAN",
 "Mediterranean":"MED","Middle Eastern":"MED","Greek":"MED","Lebanese":"MED","Turkish":"MED","Israeli":"MED","Ethiopian":"MED","Halal":"MED",
 "Ice Cream":"ICE","Bakery":"ICE","Dessert":"ICE","Desserts":"ICE","Pastry":"ICE","Donuts":"ICE","Chocolate":"ICE","Custard":"ICE",
 "Brewery":"BREW","Beer":"BREW","Bar":"BREW","Cocktails":"BREW","Cocktail Bar":"BREW","Wine Bar":"BREW","Taproom":"BREW","Distillery":"BREW","Pub":"BREW",
 "Coffee":"COF","Cafe":"COF","Café":"COF","Roaster":"COF",
 "Viral":"VIRAL",
}
def map_cz(raw):
    out=[]
    for c in raw:
        i=CMAP.get(c) or CMAP.get(c.strip())
        if i and i not in out: out.append(i)
    return out or ["US"]

# ---- Collections (CATS) + keyword rules ----
CATS=[{"id":"ICON","n":"Iconic & Must-See"},{"id":"MUS","n":"Museums & Galleries"},
      {"id":"PARK","n":"Parks & Gardens"},{"id":"VIEW","n":"Views & Hills"},
      {"id":"ARCH","n":"Architecture & History"},{"id":"ENT","n":"Sports, Music & Entertainment"},
      {"id":"SHOP","n":"Markets & Districts"},{"id":"FAM","n":"Family & Kids"},
      {"id":"RIVER","n":"Riverfront & Ohio River"},{"id":"ODD","n":"Oddities & Hidden Gems"},
      {"id":"FREE","n":"Free to Visit"}]
KW={
 "ICON":["union terminal","carew tower","roebling","fountain square","tyler davidson","music hall","cincinnati zoo","fiona","ohio river","the banks","great american ball park","paycor"],
 "MUS":["museum","gallery","art museum","taft museum","contemporary arts center","american sign museum","freedom center","museum center","cincinnati museum","betts","weston","aronoff"],
 "PARK":["park","garden","conservatory","eden park","krohn","ault park","smale","washington park","devou","alms park","arboretum","spring grove","nature preserve","gorge"],
 "VIEW":["overlook","view","vista","hill","mt. adams","mount adams","mt adams","devou","eden park overlook","bellevue hill","incline","observatory"],
 "ARCH":["union terminal","art deco","cathedral","basilica","church","historic","landmark","over-the-rhine","italianate","rookwood","music hall","carew","suspension bridge","observatory","taft"],
 "ENT":["stadium","arena","ballpark","paycor","great american ball park","tql","heritage bank","music hall","aronoff","taft theatre","bogart","memorial hall","riverbend","andrew brady","casino","bengals","reds","fc cincinnati"],
 "SHOP":["findlay market","market","the banks","over-the-rhine","otr","vine street","hyde park square","mainstrand","mainstrasse","newport on the levee","rookwood commons","district"],
 "FAM":["zoo","aquarium","museum center","children","carousel","amusement","kings island","coney island","great wolf","playground","duke energy children"],
 "RIVER":["riverfront","ohio river","roebling","suspension bridge","the banks","smale","riverboat","bb riverboats","levee","serpentine wall","newport","sawyer point","purple people bridge"],
}
ODD_SRC={"ATLASOBSCURA"}
def collections(x, is_food):
    g=list(x.get("g",[]))
    hay=(x.get("n","")+" "+x.get("w","")+" "+x.get("k","")+" "+" ".join(x.get("cz",[]))).lower()
    if is_food:
        if any(k in hay for k in ["market","food hall","findlay","brewery district"]): g.append("MKT")
    else:
        for cid,kws in KW.items():
            if any(k in hay for k in kws): g.append(cid)
        srcs={t[0] for t in x.get("sources",[])}
        if (x.get("t")==3 and (srcs & ODD_SRC)) or "oddit" in hay or "quirk" in hay or "hidden gem" in hay:
            g.append("ODD")
        if re.search(r'\bfree\b|no admission|free to (enter|visit)|free admission', hay): g.append("FREE")
        if not g: g.append("ARCH")
    out=[]
    for c in g:
        if c not in out: out.append(c)
    return out[:4]

# ---- source metadata (labels for filter chips); synthesize for missing keys ----
SRC_LABEL={
 "JAMESBEARD":"JAMES BEARD","MICHELIN":"MICHELIN","MICHELIN_BIB":"MICHELIN BIB","MICHELIN_STAR":"MICHELIN ★",
 "ENQUIRER":"CINCINNATI ENQUIRER","CINCYMAG":"CINCINNATI MAG","CITYBEAT":"CITYBEAT","WCPO":"WCPO 9",
 "WLWT":"WLWT 5","WKRC":"WKRC 12","FOX19":"FOX19","CINCYREFINED":"CINCINNATI REFINED","SOAPBOX":"SOAPBOX",
 "MOVERSMAKERS":"MOVERS & MAKERS","SPECTRUM":"SPECTRUM NEWS","VISITCINCY":"CINCINNATI USA","USATODAY":"USA TODAY 10BEST",
 "ATLASOBSCURA":"ATLAS OBSCURA","WIKIPEDIA":"WIKIPEDIA","TRIPADVISOR":"TRIPADVISOR","OFFICIAL":"OFFICIAL SITE",
 "NPS":"NATIONAL PARK SVC","OHIOHISTORY":"OHIO HISTORY","YELP":"YELP","OPENTABLE":"OPENTABLE DINERS' CHOICE",
}
ALIAS={"CINCINNATI_ENQUIRER":"ENQUIRER","CINCINNATI_MAGAZINE":"CINCYMAG","CINCINNATIMAGAZINE":"CINCYMAG","10BEST":"USATODAY"}
def canon(k): return ALIAS.get(k,k)

# ---- build unified records (generic: any research file in this dir) ----
import glob
EXCLUDE=set()
sights=[]; food=[]; srcmeta={}; seen_names=set()
def _take(x, bucket):
    n=x.get("n")
    if not n or n in seen_names or n in EXCLUDE: return
    seen_names.add(n); bucket.append(x)
for path in sorted(glob.glob(os.path.join(D,"*.json"))):
    base=os.path.basename(path)
    if base.startswith(("_","out_","cin_","geo_")) or "dataset" in base: continue
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
        k=canon(t[0])
        pair=[k, t[1] if len(t)>1 else ""]
        key=(pair[0],pair[1])
        if key in seen: continue
        seen.append(key); out.append(pair)
    return out or [["WIKIPEDIA",""]]

P=[]; F=[]; used_keys_S=set(); used_keys_F=set()
for x in sights:
    r={"t":int(x["t"]),"a":x["a"],"n":x["n"],"ad":x["address"],"w":x["w"]}
    if x.get("k"): r["k"]=x["k"]
    if x.get("closed"): r["closed"]=True
    r["g"]=collections(x,False)
    r["s"]=norm_sources(x)
    for t in r["s"]: used_keys_S.add(t[0])
    P.append(r)
for x in food:
    r={"t":int(x["t"]),"a":x["a"],"n":x["n"],"ad":x["address"],"w":x["w"]}
    if x.get("k"): r["k"]=x["k"]
    if x.get("closed"): r["closed"]=True
    r["cz"]=map_cz(x.get("cz",[]))
    g=collections(x,True)
    if g: r["g"]=g
    r["s"]=norm_sources(x)
    for t in r["s"]: used_keys_F.add(t[0])
    F.append(r)

def mk_table(keys):
    tbl={}
    for k in sorted(keys):
        m=srcmeta.get(k) or {}
        tbl[k]={"k":SRC_LABEL.get(k,k.replace('_',' ').upper()),
                "t":m.get("name",SRC_LABEL.get(k,k)),
                "u":m.get("url",""),
                "l":m.get("name","")}
    return tbl
S=mk_table(used_keys_S); FS=mk_table(used_keys_F)

out={"areas":AREAS,"ac":AC,"cuisines":CUISINES,"cats":CATS,"P":P,"F":F,"S":S,"FS":FS}
json.dump(out,open(os.path.join(D,'cin_dataset.json'),'w'),indent=1,ensure_ascii=False)
work=[{"n":r["n"],"addr":r["ad"],"a":r["a"]} for r in P+F]
json.dump(work,open(os.path.join(D,'cin_worklist.json'),'w'),ensure_ascii=False,indent=0)

from collections import Counter
print("P(sights):",len(P)," F(food):",len(F)," total:",len(P)+len(F))
print("Collections coverage (sights):",dict(Counter(c for r in P for c in r.get("g",[]))))
print("Cuisine coverage (food):",dict(Counter(c for r in F for c in r["cz"])))
print("closed flagged:",[r["n"] for r in P+F if r.get("closed")] or "none")
print("wrote cin_dataset.json + cin_worklist.json")
