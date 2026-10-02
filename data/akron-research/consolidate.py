#!/usr/bin/env python3
# Consolidate the Akron · Kent · Canton research files into one normalized dataset.
# Region = Summit / Portage / Stark counties (+ the Wadsworth edge of Medina Co.), up toward the
# Cuyahoga County line. Mirrors the Columbus/Erie dataset pipeline. Deterministic: never hand-patch
# the dataset — edit/add research JSONs and re-run.
#   FOOD_<tag>.json   = list of {t,a,cz,dish,n,address,w,closed,sources}
#   SIGHTS_<tag>.json = {"sights":[{t,a,n,address,w,k?,g?,sources}], "sources":[{key,name,url}]}
#   SOURCES_<tag>.json= {"outlets":[{key,name,type,url,credible,rank}], "creators":[...]}  (registry input)
# Output: akr_dataset.json (copied to data/akron.dataset.json by tools/rebuild-city.py) + _worklist.json
import json, os, re, glob
D = os.path.dirname(os.path.abspath(__file__))

AREAS = [
 {"id":"AKR","n":"Akron (Downtown, Highland Square, North Hill & Firestone Park)"},
 {"id":"NSUM","n":"Cuyahoga Falls, Stow, Hudson & North Summit"},
 {"id":"KENT","n":"Kent & Portage County (Kent State, Ravenna, Aurora)"},
 {"id":"BARB","n":"Barberton, Norton, Wadsworth & Green"},
 {"id":"CANT","n":"Canton, North Canton & eastern Stark"},
 {"id":"MASS","n":"Massillon & southern Stark"},
]
AC = {"AKR":"#E8973A","NSUM":"#4F81BD","KENT":"#9BBB59","BARB":"#C0504D","CANT":"#8064A2","MASS":"#4BACC6"}

# Akron-Canton food canon: Barberton (Serbian) chicken, Swenson's Galley Boy, Strickland's frozen
# custard, Canton's Taggart's "Bittner", Bender's Tavern, North Hill's Nepali/Bhutanese table.
CUISINES = [
 {"id":"CHIX","n":"Barberton Chicken & Fried Chicken"},
 {"id":"BURG","n":"Burgers, Drive-ins & Diners"},
 {"id":"US","n":"American & New American"},
 {"id":"ITAL","n":"Italian & Pizza"},
 {"id":"HIMAL","n":"Nepali, Bhutanese & South Asian"},
 {"id":"ASIAN","n":"East & Southeast Asian"},
 {"id":"EURO","n":"Serbian, Hungarian & Eastern European"},
 {"id":"MED","n":"Greek, Lebanese & Middle Eastern"},
 {"id":"MEX","n":"Mexican & Latin"},
 {"id":"SOUL","n":"BBQ, Soul & Southern"},
 {"id":"ICE","n":"Frozen Custard, Ice Cream & Sweets"},
 {"id":"BREW","n":"Breweries, Wineries & Bars"},
 {"id":"COF","n":"Coffee & Cafés"},
]
CMAP = {
 "Barberton Chicken":"CHIX","Fried Chicken":"CHIX","Chicken":"CHIX","Serbian Chicken":"CHIX",
 "Burgers":"BURG","Diner":"BURG","Drive-in":"BURG","Hot Dogs":"BURG","Breakfast":"BURG","Sandwiches":"BURG","Deli":"BURG","Coney":"BURG",
 "American":"US","New American":"US","Steakhouse":"US","Seafood":"US","Farm-to-table":"US","Contemporary":"US","Gastropub":"US","French":"US","Tavern":"US","Brunch":"US",
 "Italian":"ITAL","Pizza":"ITAL","Italian-American":"ITAL",
 "Nepali":"HIMAL","Bhutanese":"HIMAL","Himalayan":"HIMAL","Indian":"HIMAL","Tibetan":"HIMAL","South Asian":"HIMAL","Pakistani":"HIMAL",
 "Vietnamese":"ASIAN","Thai":"ASIAN","Chinese":"ASIAN","Japanese":"ASIAN","Sushi":"ASIAN","Ramen":"ASIAN","Korean":"ASIAN","Burmese":"ASIAN","Filipino":"ASIAN","Asian":"ASIAN",
 "Serbian":"EURO","Hungarian":"EURO","Polish":"EURO","German":"EURO","Eastern European":"EURO","Slovenian":"EURO","Croatian":"EURO","Ukrainian":"EURO",
 "Greek":"MED","Lebanese":"MED","Middle Eastern":"MED","Mediterranean":"MED","Turkish":"MED","Syrian":"MED","Palestinian":"MED","Halal":"MED",
 "Mexican":"MEX","Tacos":"MEX","Latin American":"MEX","Puerto Rican":"MEX","Salvadoran":"MEX","Cuban":"MEX",
 "BBQ":"SOUL","Barbecue":"SOUL","Soul Food":"SOUL","Southern":"SOUL","Cajun":"SOUL",
 "Frozen Custard":"ICE","Ice Cream":"ICE","Bakery":"ICE","Dessert":"ICE","Candy":"ICE","Chocolate":"ICE","Donuts":"ICE","Pastry":"ICE",
 "Brewery":"BREW","Winery":"BREW","Bar":"BREW","Cocktails":"BREW","Taproom":"BREW","Distillery":"BREW","Pub":"BREW","Wine":"BREW","Cidery":"BREW",
 "Coffee":"COF","Cafe":"COF","Café":"COF","Roaster":"COF","Tea":"COF",
}
def map_cz(raw):
    out=[]
    for c in raw:
        i=CMAP.get(c) or CMAP.get(c.strip())
        if i and i not in out: out.append(i)
    return out or ["US"]

CATS=[{"id":"ICON","n":"Iconic & Must-See"},{"id":"MUS","n":"Museums & Galleries"},
      {"id":"PARK","n":"Parks, Gardens & Trails"},{"id":"ARCH","n":"Architecture & History"},
      {"id":"ENT","n":"Sports, Music & Entertainment"},{"id":"SHOP","n":"Markets & Districts"},
      {"id":"FAM","n":"Family & Kids"},{"id":"ODD","n":"Oddities & Hidden Gems"},{"id":"FREE","n":"Free to Visit"}]
KW={
 "ICON":["hall of fame","stan hywet","may 4","first ladies","mckinley","soap box derby","goodyear"],
 "MUS":["museum","gallery","art center","library","hall of fame","visitors center","visitor center","exhibit"],
 "PARK":["park","garden","arboretum","metro park","metroparks","trail","towpath","gorge","falls","lake","reservation","preserve","ledges","nature"],
 "ARCH":["historic","mansion","estate","landmark","national register","cathedral","church","theatre","theater","tower","quaker square","house","canal","lock"],
 "ENT":["stadium","arena","ballpark","rubberducks","music center","amphitheater","theatre","theater","speedway","raceway","derby","concert"],
 "SHOP":["market","district","main street","village","square","flea","outlet","shops"],
 "FAM":["zoo","children","kids","family","farm","derby","amusement","water park","science","pumpkin"],
}
ODD_SRC={"ATLASOBSCURA","ROADSIDEAMERICA"}
def collections(x, is_food):
    g=list(x.get("g",[]))
    hay=(x.get("n","")+" "+x.get("w","")+" "+x.get("k","")+" "+" ".join(x.get("cz",[]))).lower()
    if is_food:
        if any(k in hay for k in ["market","food hall"]): g.append("SHOP")
    else:
        for cid,kws in KW.items():
            if any(k in hay for k in kws): g.append(cid)
        srcs={t[0] for t in x.get("sources",[])}
        if (srcs & ODD_SRC) or "oddit" in hay or "quirk" in hay or "hidden gem" in hay:
            g.append("ODD")
        if re.search(r'\bfree\b|no admission|free to (enter|visit)|free admission', hay): g.append("FREE")
        if not g: g.append("ARCH")
    out=[]
    for c in g:
        if c not in out: out.append(c)
    return out[:4]

SRC_LABEL={
 "JAMESBEARD":"JAMES BEARD","NPS":"NATIONAL PARK SVC","BEACONJOURNAL":"AKRON BEACON JOURNAL",
 "CANTONREP":"CANTON REPOSITORY","RECORDCOURIER":"RECORD-COURIER","SIGNALAKRON":"SIGNAL AKRON",
 "CLEMAG":"CLEVELAND MAGAZINE","CLEVELANDCOM":"CLEVELAND.COM","SCENE":"SCENE MAGAZINE","IDEASTREAM":"IDEASTREAM / WKSU",
 "AKRONLIFE":"AKRON LIFE","SUMMITMETRO":"SUMMIT METRO PARKS","OHIOMAG":"OHIO MAGAZINE","ATLASOBSCURA":"ATLAS OBSCURA",
 "WIKIPEDIA":"WIKIPEDIA","OFFICIAL":"OFFICIAL SITE","VISITAKRON":"AKRON/SUMMIT CVB","VISITCANTON":"VISIT CANTON",
 "DISCOVERPORTAGE":"DISCOVER PORTAGE","ROADFOOD":"ROADFOOD","TAKEOUT":"THE TAKEOUT","FOODNETWORK":"FOOD NETWORK",
 "OHIOHISTORY":"OHIO HISTORY CONNECTION","WKYC":"WKYC 3","FOX8":"FOX 8","ODNR":"OHIO DNR","KSU":"KENT STATE UNIV.",
 "YELP":"YELP","TRIPADVISOR":"TRIPADVISOR",
}
ALIAS={"ABJ":"BEACONJOURNAL","AKRONBEACONJOURNAL":"BEACONJOURNAL","REPOSITORY":"CANTONREP","CANTONREPOSITORY":"CANTONREP",
       "CLEVELANDMAGAZINE":"CLEMAG","WKSU":"IDEASTREAM","CLEVELANDSCENE":"SCENE","PLAINDEALER":"CLEVELANDCOM"}
def canon(k): return ALIAS.get(k,k)

EXCLUDE=set(); sights=[]; food=[]; srcmeta={}; seen_names=set()
def _take(x, bucket):
    n=x.get("n")
    if not n or n in seen_names or n in EXCLUDE: return
    seen_names.add(n); bucket.append(x)
for path in sorted(glob.glob(os.path.join(D,"*.json"))):
    base=os.path.basename(path)
    if base.startswith("SOURCES_"):
        for s in json.load(open(path)).get("outlets",[]): srcmeta.setdefault(s["key"],s)
        continue
    if base.startswith(("_","akr_","geo_","CREATORS")) or "dataset" in base: continue
    d=json.load(open(path))
    if isinstance(d, list):
        for x in d: _take(x, food)
    else:
        for s in d.get('sources',[]): srcmeta.setdefault(s['key'],s)
        for x in d.get('sights',[]): _take(x, sights)
        for x in d.get('food',[]):   _take(x, food)

def norm_sources(x):
    seen=set(); out=[]
    for t in x.get('sources',[]):
        k=canon(t[0]); pair=[k, t[1] if len(t)>1 else ""]
        if (pair[0],pair[1]) in seen: continue
        seen.add((pair[0],pair[1])); out.append(pair)
    return out

P=[]; F=[]; used_S=set(); used_F=set()
for x in sights:
    r={"t":int(x["t"]),"a":x["a"],"n":x["n"],"ad":x["address"],"w":x["w"]}
    if x.get("k"): r["k"]=x["k"]
    if x.get("closed"): r["closed"]=True
    r["g"]=collections(x,False); r["s"]=norm_sources(x)
    used_S.update(t[0] for t in r["s"]); P.append(r)
for x in food:
    r={"t":int(x["t"]),"a":x["a"],"n":x["n"],"ad":x["address"],"w":x["w"]}
    if x.get("k"): r["k"]=x["k"]
    if x.get("closed"): r["closed"]=True
    r["cz"]=map_cz(x.get("cz",[])); g=collections(x,True)
    if g: r["g"]=g
    r["s"]=norm_sources(x)
    used_F.update(t[0] for t in r["s"]); F.append(r)

def mk_table(keys):
    tbl={}
    for k in sorted(keys):
        m=srcmeta.get(k) or {}
        tbl[k]={"k":SRC_LABEL.get(k,k.replace('_',' ').upper()),"t":m.get("name",SRC_LABEL.get(k,k)),"u":m.get("url",""),"l":m.get("name","")}
    return tbl
out={"areas":AREAS,"ac":AC,"cuisines":CUISINES,"cats":CATS,"P":P,"F":F,"S":mk_table(used_S),"FS":mk_table(used_F)}
json.dump(out,open(os.path.join(D,'akr_dataset.json'),'w'),indent=1,ensure_ascii=False)
json.dump([{"n":r["n"],"addr":r["ad"],"a":r["a"]} for r in P+F],open(os.path.join(D,'_worklist.json'),'w'),ensure_ascii=False,indent=0)
from collections import Counter
print("P(sights):",len(P)," F(food):",len(F)," total:",len(P)+len(F))
print("By area:",dict(Counter(r["a"] for r in P+F)))
print("Cuisine coverage:",dict(Counter(c for r in F for c in r["cz"])))
print("closed flagged:",[r["n"] for r in P+F if r.get("closed")] or "none")
print("wrote akr_dataset.json + _worklist.json")
