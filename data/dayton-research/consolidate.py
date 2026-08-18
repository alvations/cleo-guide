#!/usr/bin/env python3
# Consolidate the Dayton research files into one normalized dataset. Region = Dayton OH + the Miami
# Valley (+ Yellow Springs day trip). Birthplace of aviation. Mirrors the SF/SV/Cincinnati pipeline.
import json, os, re
D = os.path.dirname(os.path.abspath(__file__))

AREAS = [
 {"id":"DTN","n":"Downtown, Oregon District & Webster Station"},
 {"id":"WD","n":"Wright-Dunbar & West Dayton"},
 {"id":"SOUTH","n":"Kettering, Oakwood & Centerville"},
 {"id":"NORTH","n":"Vandalia, Huber Heights & Troy"},
 {"id":"EAST","n":"Beavercreek, Fairborn & Wright-Patterson"},
 {"id":"YS","n":"Yellow Springs & Greene County"},
]
AC = {"DTN":"#E8973A","WD":"#C0504D","SOUTH":"#8064A2","NORTH":"#4F81BD","EAST":"#4BACC6","YS":"#9BBB59"}

CUISINES = [
 {"id":"US","n":"American & New American"},{"id":"BURG","n":"Burgers & Diners"},
 {"id":"PIZZA","n":"Dayton-Style Pizza"},{"id":"GERMAN","n":"German"},
 {"id":"ASIAN","n":"Asian"},{"id":"MEX","n":"Mexican & Latin"},
 {"id":"MED","n":"Mediterranean & Middle Eastern"},{"id":"SOUL","n":"Soul, BBQ & Southern"},
 {"id":"ICE","n":"Ice Cream, Candy & Bakeries"},{"id":"BREW","n":"Breweries & Bars"},
 {"id":"COF","n":"Coffee & Cafés"},{"id":"VIRAL","n":"Viral / Social"},
]
CMAP = {
 "American":"US","New American":"US","Steakhouse":"US","Contemporary":"US","Farm-to-table":"US","Gastropub":"US","French":"US","Seafood":"US","Supper Club":"US",
 "Burgers":"BURG","Diner":"BURG","Breakfast":"BURG","Brunch":"BURG","Sandwiches":"BURG","Deli":"BURG","Hot Dogs":"BURG",
 "Pizza":"PIZZA","Dayton-Style":"PIZZA","Neapolitan":"PIZZA",
 "German":"GERMAN","Bratwurst":"GERMAN",
 "Vietnamese":"ASIAN","Thai":"ASIAN","Chinese":"ASIAN","Japanese":"ASIAN","Sushi":"ASIAN","Ramen":"ASIAN","Korean":"ASIAN","Indian":"ASIAN","Filipino":"ASIAN","Dim Sum":"ASIAN",
 "Mexican":"MEX","Tacos":"MEX","Taqueria":"MEX","Latin American":"MEX","Peruvian":"MEX","Salvadoran":"MEX","Cuban":"MEX",
 "Mediterranean":"MED","Middle Eastern":"MED","Greek":"MED","Lebanese":"MED","Turkish":"MED","Halal":"MED",
 "Soul Food":"SOUL","Southern":"SOUL","Barbecue":"SOUL","BBQ":"SOUL","Fried Chicken":"SOUL","Cajun":"SOUL",
 "Ice Cream":"ICE","Bakery":"ICE","Dessert":"ICE","Desserts":"ICE","Pastry":"ICE","Donuts":"ICE","Chocolate":"ICE","Candy":"ICE","Custard":"ICE",
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

# Dayton's marquee is aviation — a dedicated AVIATION collection alongside the standard set.
CATS=[{"id":"ICON","n":"Iconic & Must-See"},{"id":"AVIATION","n":"Aviation & the Wright Brothers"},
      {"id":"MUS","n":"Museums & Galleries"},{"id":"PARK","n":"Parks & MetroParks"},
      {"id":"VIEW","n":"Views & Trails"},{"id":"ARCH","n":"Architecture & History"},
      {"id":"ENT","n":"Music & Entertainment"},{"id":"SHOP","n":"Markets & Districts"},
      {"id":"FAM","n":"Family & Kids"},{"id":"ODD","n":"Oddities & Hidden Gems"},{"id":"FREE","n":"Free to Visit"}]
KW={
 "ICON":["air force museum","national museum of the u","carillon","wright flyer","oregon district","dayton arcade","riverscape"],
 "AVIATION":["air force","aviation","wright","wright brothers","flyer","huffman prairie","hawthorn hill","wright cycle","aviation heritage","dunbar","kitty hawk","airplane","aviators","packard"],
 "MUS":["museum","art institute","boonshoft","packard","sunwatch","dayton art","funk music","science","planetarium","carillon historical"],
 "PARK":["park","metropark","riverscape","cox arboretum","five rivers","glen helen","john bryan","clifton gorge","eastwood","island metropark","carriage hill","aullwood","gardens","nature"],
 "VIEW":["trail","overlook","view","gorge","clifton","little miami","bike trail","ridge"],
 "ARCH":["arcade","historic","landmark","dunbar","courthouse","old court house","victoria theatre","cathedral","church","hawthorn hill","memorial","carillon"],
 "ENT":["victoria theatre","schuster","rose music center","fraze","levitt","nutter center","dayton arcade","hara","masonic","memorial hall","riverscape"],
 "SHOP":["oregon district","2nd street market","second street market","the greene","austin landing","front street","yellow springs","downtown","district"],
 "FAM":["boonshoft","cosi","science","young's","dairy","carousel","children","aullwood","sunwatch","zoo","adventure","carillon"],
}
ODD_SRC={"ATLASOBSCURA"}
def collections(x, is_food):
    g=list(x.get("g",[]))
    hay=(x.get("n","")+" "+x.get("w","")+" "+x.get("k","")+" "+" ".join(x.get("cz",[]))).lower()
    if is_food:
        if any(k in hay for k in ["market","food hall","2nd street","second street"]): g.append("MKT")
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

SRC_LABEL={
 "JAMESBEARD":"JAMES BEARD","MICHELIN":"MICHELIN","DAYTONDAILY":"DAYTON DAILY NEWS","DAYTONMAG":"DAYTON MAGAZINE",
 "WHIO":"WHIO 7","WDTN":"WDTN 2","NPS":"NATIONAL PARK SVC","OHIOHISTORY":"OHIO HISTORY","GEMCITY":"DAYTON LOCAL",
 "USATODAY":"USA TODAY 10BEST","ATLASOBSCURA":"ATLAS OBSCURA","WIKIPEDIA":"WIKIPEDIA","TRIPADVISOR":"TRIPADVISOR",
 "OFFICIAL":"OFFICIAL SITE","YELP":"YELP","OPENTABLE":"OPENTABLE DINERS' CHOICE",
}
ALIAS={"DAYTON_DAILY_NEWS":"DAYTONDAILY","DAYTONCOM":"DAYTONDAILY","DAYTON.COM":"DAYTONDAILY"}
def canon(k): return ALIAS.get(k,k)

import glob
EXCLUDE=set(); sights=[]; food=[]; srcmeta={}; seen_names=set()
def _take(x, bucket):
    n=x.get("n")
    if not n or n in seen_names or n in EXCLUDE: return
    seen_names.add(n); bucket.append(x)
for path in sorted(glob.glob(os.path.join(D,"*.json"))):
    base=os.path.basename(path)
    if base.startswith(("_","out_","day_","geo_")) or "dataset" in base: continue
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
        k=canon(t[0]); pair=[k, t[1] if len(t)>1 else ""]
        if (pair[0],pair[1]) in seen: continue
        seen.append((pair[0],pair[1])); out.append(pair)
    return out or [["WIKIPEDIA",""]]

P=[]; F=[]; used_keys_S=set(); used_keys_F=set()
for x in sights:
    r={"t":int(x["t"]),"a":x["a"],"n":x["n"],"ad":x["address"],"w":x["w"]}
    if x.get("k"): r["k"]=x["k"]
    if x.get("closed"): r["closed"]=True
    r["g"]=collections(x,False); r["s"]=norm_sources(x)
    for t in r["s"]: used_keys_S.add(t[0])
    P.append(r)
for x in food:
    r={"t":int(x["t"]),"a":x["a"],"n":x["n"],"ad":x["address"],"w":x["w"]}
    if x.get("k"): r["k"]=x["k"]
    if x.get("closed"): r["closed"]=True
    r["cz"]=map_cz(x.get("cz",[])); g=collections(x,True)
    if g: r["g"]=g
    r["s"]=norm_sources(x)
    for t in r["s"]: used_keys_F.add(t[0])
    F.append(r)

def mk_table(keys):
    tbl={}
    for k in sorted(keys):
        m=srcmeta.get(k) or {}
        tbl[k]={"k":SRC_LABEL.get(k,k.replace('_',' ').upper()),"t":m.get("name",SRC_LABEL.get(k,k)),"u":m.get("url",""),"l":m.get("name","")}
    return tbl
S=mk_table(used_keys_S); FS=mk_table(used_keys_F)
out={"areas":AREAS,"ac":AC,"cuisines":CUISINES,"cats":CATS,"P":P,"F":F,"S":S,"FS":FS}
json.dump(out,open(os.path.join(D,'day_dataset.json'),'w'),indent=1,ensure_ascii=False)
json.dump([{"n":r["n"],"addr":r["ad"],"a":r["a"]} for r in P+F],open(os.path.join(D,'day_worklist.json'),'w'),ensure_ascii=False,indent=0)
from collections import Counter
print("P(sights):",len(P)," F(food):",len(F)," total:",len(P)+len(F))
print("Collections:",dict(Counter(c for r in P for c in r.get("g",[]))))
print("closed flagged:",[r["n"] for r in P+F if r.get("closed")] or "none")
print("wrote day_dataset.json + day_worklist.json")
