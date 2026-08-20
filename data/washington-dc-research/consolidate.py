#!/usr/bin/env python3
# Consolidate the Washington DC research files into one normalized dataset. Region = DC proper + Arlington
# + the Northern Virginia corridor between Dulles (IAD) and DC (Rosslyn/Clarendon, Falls Church, Tysons,
# McLean, Vienna, Reston, Herndon) + Old Town Alexandria as the near edge. Mirrors the Dayton/SF pipeline.
import json, os, re
D = os.path.dirname(os.path.abspath(__file__))

AREAS = [
 {"id":"MALL","n":"National Mall, Tidal Basin & the Monuments"},
 {"id":"DTN","n":"Downtown, Penn Quarter & Chinatown"},
 {"id":"GTWN","n":"Georgetown & Foggy Bottom"},
 {"id":"DUPONT","n":"Dupont, Logan Circle & Adams Morgan"},
 {"id":"USHAW","n":"U Street, Shaw & Columbia Heights"},
 {"id":"CAPHILL","n":"Capitol Hill, H Street, Navy Yard & The Wharf"},
 {"id":"ARL","n":"Arlington & National Landing"},
 {"id":"ALEX","n":"Old Town Alexandria"},
 {"id":"TYSONS","n":"Tysons, McLean & Vienna"},
 {"id":"RESTON","n":"Reston, Herndon & the Dulles Corridor"},
 {"id":"FCITY","n":"Falls Church, Annandale & Eden Center"},
]
AC = {"MALL":"#B0405A","DTN":"#E8973A","GTWN":"#8064A2","DUPONT":"#4F81BD","USHAW":"#C0504D",
      "CAPHILL":"#4BACC6","ARL":"#9BBB59","ALEX":"#D99694","TYSONS":"#2C7FB8","RESTON":"#F2A900","FCITY":"#7BA05B"}

CUISINES = [
 {"id":"US","n":"American, New American & Steak"},
 {"id":"SEAFOOD","n":"Chesapeake Seafood & Raw Bars"},
 {"id":"ETHIOPIAN","n":"Ethiopian & East African"},
 {"id":"LATIN","n":"Salvadoran, Mexican & Latin"},
 {"id":"SASIAN","n":"South Asian & Afghan"},
 {"id":"VIET","n":"Vietnamese"},
 {"id":"KOREAN","n":"Korean"},
 {"id":"ASIAN","n":"Chinese, Thai, Japanese & More"},
 {"id":"MED","n":"Mediterranean & Middle Eastern"},
 {"id":"BURG","n":"Burgers, Half-Smokes & Diners"},
 {"id":"PIZZA","n":"Pizza & Jumbo Slice"},
 {"id":"BREW","n":"Breweries, Bars & Cocktails"},
 {"id":"COF","n":"Coffee & Cafés"},
 {"id":"ICE","n":"Bakeries, Ice Cream & Desserts"},
 {"id":"VIRAL","n":"Viral / Social"},
]
CMAP = {
 "American":"US","New American":"US","Contemporary":"US","Steakhouse":"US","Steak":"US","Farm-to-table":"US","Gastropub":"US","French":"US","Modern American":"US","Southern":"US","Soul Food":"US","Fine Dining":"US","Tasting Menu":"US","Wine Bar":"US",
 "Seafood":"SEAFOOD","Raw Bar":"SEAFOOD","Oysters":"SEAFOOD","Crab":"SEAFOOD","Crab House":"SEAFOOD","Chesapeake":"SEAFOOD","Fish":"SEAFOOD",
 "Ethiopian":"ETHIOPIAN","Eritrean":"ETHIOPIAN","East African":"ETHIOPIAN","Injera":"ETHIOPIAN",
 "Salvadoran":"LATIN","Pupusas":"LATIN","Mexican":"LATIN","Tacos":"LATIN","Taqueria":"LATIN","Latin American":"LATIN","Peruvian":"LATIN","Bolivian":"LATIN","Cuban":"LATIN","Central American":"LATIN",
 "Indian":"SASIAN","Pakistani":"SASIAN","Afghan":"SASIAN","Nepali":"SASIAN","South Asian":"SASIAN","Bangladeshi":"SASIAN","Sri Lankan":"SASIAN",
 "Vietnamese":"VIET","Pho":"VIET","Banh Mi":"VIET",
 "Korean":"KOREAN","Korean BBQ":"KOREAN","Tofu House":"KOREAN",
 "Chinese":"ASIAN","Thai":"ASIAN","Japanese":"ASIAN","Sushi":"ASIAN","Ramen":"ASIAN","Filipino":"ASIAN","Dim Sum":"ASIAN","Taiwanese":"ASIAN","Sichuan":"ASIAN","Malaysian":"ASIAN","Pan-Asian":"ASIAN","Izakaya":"ASIAN",
 "Mediterranean":"MED","Middle Eastern":"MED","Greek":"MED","Lebanese":"MED","Turkish":"MED","Halal":"MED","Israeli":"MED","Persian":"MED","Falafel":"MED",
 "Burgers":"BURG","Half-Smoke":"BURG","Half-Smokes":"BURG","Diner":"BURG","Breakfast":"BURG","Brunch":"BURG","Sandwiches":"BURG","Deli":"BURG","Hot Dogs":"BURG","Chili":"BURG",
 "Pizza":"PIZZA","Jumbo Slice":"PIZZA","Neapolitan":"PIZZA","Pizzeria":"PIZZA",
 "Brewery":"BREW","Beer":"BREW","Bar":"BREW","Cocktails":"BREW","Cocktail Bar":"BREW","Taproom":"BREW","Distillery":"BREW","Pub":"BREW","Speakeasy":"BREW","Rooftop":"BREW",
 "Coffee":"COF","Cafe":"COF","Café":"COF","Roaster":"COF","Tea":"COF","Boba":"COF","Bubble Tea":"COF",
 "Ice Cream":"ICE","Bakery":"ICE","Dessert":"ICE","Desserts":"ICE","Pastry":"ICE","Donuts":"ICE","Chocolate":"ICE","Custard":"ICE","Gelato":"ICE",
 "Viral":"VIRAL",
}
def map_cz(raw):
    out=[]
    for c in raw:
        i=CMAP.get(c) or CMAP.get(c.strip())
        if i and i not in out: out.append(i)
    return out or ["US"]

# DC's marquee is the monumental core + the free Smithsonians — dedicated MON collection alongside the standard set.
CATS=[{"id":"ICON","n":"Iconic & Must-See"},{"id":"MON","n":"Monuments & Memorials"},
      {"id":"MUS","n":"Museums & Galleries"},{"id":"GOV","n":"Government & Landmarks"},
      {"id":"HIST","n":"History & Architecture"},{"id":"PARK","n":"Parks & Gardens"},
      {"id":"VIEW","n":"Views & Waterfront"},{"id":"ENT","n":"Theaters & Entertainment"},
      {"id":"SHOP","n":"Markets & Districts"},{"id":"FAM","n":"Family & Kids"},
      {"id":"ODD","n":"Oddities & Hidden Gems"},{"id":"FREE","n":"Free to Visit"}]
KW={
 "ICON":["lincoln memorial","washington monument","us capitol","white house","national mall","jefferson memorial","air and space","tidal basin","arlington national","mount vernon"],
 "MON":["memorial","monument","tomb","cemetery","statue","wall","veterans","tidal basin","cenotaph","carillon"],
 "MUS":["museum","smithsonian","gallery","national gallery","portrait","hirshhorn","natural history","american history","air and space","spy museum","phillips","newseum","building museum","udvar-hazy","planetarium"],
 "GOV":["capitol","white house","supreme court","library of congress","national archives","pentagon","federal","treasury","embassy","court","bureau of engraving","kennedy center"],
 "HIST":["historic","landmark","house","old town","fort","heritage","founding","colonial","civil war","hall","church","cathedral","basilica","mansion","estate","mount vernon","gadsby"],
 "PARK":["park","garden","arboretum","gardens","great falls","rock creek","botanic","meridian","theodore roosevelt island","tidal basin","c&o canal","glen echo","meadowlark","conservatory"],
 "VIEW":["view","overlook","waterfront","wharf","potomac","river","rooftop","observation","old post office tower","washington monument","key bridge","gravelly point"],
 "ENT":["kennedy center","theatre","theater","wolf trap","9:30 club","anthem","arena","capital one","warner","national theatre","filene","strathmore","birchmere","music"],
 "SHOP":["market","eastern market","union market","the wharf","georgetown","mosaic district","reston town center","eden center","district","boutique","shops"],
 "FAM":["zoo","air and space","natural history","science","children","carousel","aquarium","glen echo","planetarium","building museum","udvar-hazy"],
}
ODD_SRC={"ATLASOBSCURA"}
def collections(x, is_food):
    g=list(x.get("g",[]))
    hay=(x.get("n","")+" "+x.get("w","")+" "+x.get("k","")+" "+" ".join(x.get("cz",[]))).lower()
    if is_food:
        if any(k in hay for k in ["market","food hall","union market","eastern market","the wharf"]): g.append("MKT")
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

SRC_LABEL={
 "MICHELIN":"MICHELIN","MICHELIN_BIB":"MICHELIN BIB GOURMAND","MICHELIN_STAR":"MICHELIN STAR","MICHELIN_GREEN":"MICHELIN GREEN STAR",
 "JAMESBEARD":"JAMES BEARD","RAMW":"RAMMY AWARDS","WASHINGTONIAN":"WASHINGTONIAN","WAPO":"WASHINGTON POST","EATERDC":"EATER DC","DCIST":"DCIST / WAMU",
 "NOVAMAG":"NORTHERN VIRGINIA MAG","ARLNOW":"ARLNOW","TYSONSREPORTER":"TYSONS REPORTER","FFXNOW":"FFXNOW","WTOP":"WTOP",
 "NPS":"NATIONAL PARK SVC","SMITHSONIAN":"SMITHSONIAN","WASHINGTONORG":"DESTINATION DC","VISITALEX":"VISIT ALEXANDRIA","FXVA":"FAIRFAX CVB",
 "USATODAY":"USA TODAY 10BEST","ATLASOBSCURA":"ATLAS OBSCURA","WIKIPEDIA":"WIKIPEDIA","TRIPADVISOR":"TRIPADVISOR",
 "OFFICIAL":"OFFICIAL SITE","YELP":"YELP","OPENTABLE":"OPENTABLE DINERS' CHOICE","GOOGLE":"GOOGLE",
}
ALIAS={"WASHINGTONPOST":"WAPO","EATER":"EATERDC","DESTINATIONDC":"WASHINGTONORG","NOVAMAGAZINE":"NOVAMAG","VISITALEXANDRIA":"VISITALEX"}
def canon(k): return ALIAS.get(k,k)

import glob
EXCLUDE=set(); sights=[]; food=[]; srcmeta={}; seen_names=set()
def _take(x, bucket):
    n=x.get("n")
    if not n or n in seen_names or n in EXCLUDE: return
    seen_names.add(n); bucket.append(x)
for path in sorted(glob.glob(os.path.join(D,"*.json"))):
    base=os.path.basename(path)
    if base.startswith(("_","out_","dc_","geo_")) or "dataset" in base: continue
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
json.dump(out,open(os.path.join(D,'dc_dataset.json'),'w'),indent=1,ensure_ascii=False)
json.dump([{"n":r["n"],"addr":r["ad"],"a":r["a"]} for r in P+F],open(os.path.join(D,'dc_worklist.json'),'w'),ensure_ascii=False,indent=0)
from collections import Counter
print("P(sights):",len(P)," F(food):",len(F)," total:",len(P)+len(F))
print("Areas:",dict(Counter(r["a"] for r in P+F)))
print("Cuisine coverage:",dict(Counter(c for r in F for c in r.get("cz",[]))))
print("closed flagged:",[r["n"] for r in P+F if r.get("closed")] or "none")
print("wrote dc_dataset.json + dc_worklist.json")
