#!/usr/bin/env python3
# Consolidate the Silicon Valley research files into one normalized dataset:
# AREAS/AC (municipalities), CUISINES (normalized), CATS (Collections), sights P, food F, source tables S/FS.
# Mirrors data/newyork-research/consolidate.py. Region = Santa Clara Valley municipalities.
import json, os, re
D=os.path.dirname(os.path.abspath(__file__))

# ---- AREAS = the municipalities (the "boroughs" of Silicon Valley) ----
AREAS=[{"id":"PA","n":"Palo Alto & Stanford"},{"id":"MV","n":"Mountain View & Los Altos"},
       {"id":"SUN","n":"Sunnyvale"},{"id":"CU","n":"Cupertino & Saratoga"},
       {"id":"SC","n":"Santa Clara"},{"id":"SJ","n":"San Jose"},{"id":"DAY","n":"Day Trips & Coast"}]
AC={"PA":"#C0504D","MV":"#4F81BD","SUN":"#9BBB59","CU":"#8064A2","SC":"#4BACC6","SJ":"#E8973A","DAY":"#7E8FC4"}

# ---- cuisine normalization: raw label -> id ; plus the CUISINES taxonomy (ordered) ----
# The Valley's unique food story is immigrant density: the best Taiwanese, Vietnamese and South Indian
# eating in the country, plus the American boba scene it invented. That anchors the taxonomy.
CUISINES=[
 {"id":"TWN","n":"Taiwanese"},{"id":"CN","n":"Chinese"},{"id":"CANT","n":"Cantonese & Dim Sum"},
 {"id":"SICH","n":"Sichuan"},{"id":"VN","n":"Vietnamese"},{"id":"KR","n":"Korean"},
 {"id":"JP","n":"Japanese, Sushi & Ramen"},{"id":"IN","n":"Indian & South Indian"},
 {"id":"SEA","n":"Southeast Asian"},{"id":"MX","n":"Mexican & Taqueria"},
 {"id":"US","n":"American & Californian"},{"id":"SEAF","n":"Seafood"},
 {"id":"BOBA","n":"Boba & Tea"},{"id":"DES","n":"Desserts & Bakeries"},
 {"id":"VIRAL","n":"Viral / Social"},
]
CMAP={
 "Taiwanese":"TWN","Taiwanese-American":"TWN",
 "Chinese":"CN","Chinese-American":"CN","Shanghainese":"CN","Noodles":"CN","Hot Pot":"CN","Northern Chinese":"CN",
 "Cantonese":"CANT","Dim Sum":"CANT","Hong Kong":"CANT",
 "Sichuan":"SICH","Szechuan":"SICH",
 "Vietnamese":"VN",
 "Korean":"KR","Korean BBQ":"KR",
 "Japanese":"JP","Sushi":"JP","Ramen":"JP","Izakaya":"JP",
 "Indian":"IN","South Indian":"IN","Dosa":"IN","North Indian":"IN","Pakistani":"IN","Himalayan":"IN","Nepali":"IN",
 "Filipino":"SEA","Thai":"SEA","Burmese":"SEA","Indonesian":"SEA","Malaysian":"SEA","Singaporean":"SEA","Cambodian":"SEA","Lao":"SEA",
 "Mexican":"MX","Tacos":"MX","Taqueria":"MX","Cal-Mex":"MX","Oaxacan":"MX",
 "American":"US","Californian":"US","California":"US","Steakhouse":"US","Sandwiches":"US","Deli":"US",
 "Breakfast":"US","Burgers":"US","Barbecue":"US","BBQ":"US","Farm-to-table":"US","New American":"US","Pizza":"US","Diner":"US",
 "Seafood":"SEAF",
 "Boba":"BOBA","Bubble Tea":"BOBA","Milk Tea":"BOBA","Tea":"BOBA",
 "Dessert":"DES","Desserts":"DES","Bakery":"DES","Ice Cream":"DES","Chocolate":"DES","Cafe":"DES","Coffee":"DES",
 "Viral":"VIRAL",
}
def map_cz(raw):
    out=[]
    for c in raw:
        i=CMAP.get(c) or CMAP.get(c.strip())
        if i and i not in out: out.append(i)
    return out or ["US"]

# ---- Collections (CATS) + keyword rules ----
CATS=[{"id":"TECH","n":"Tech Landmarks & Campuses"},{"id":"MUS","n":"Museums & Galleries"},
      {"id":"PARK","n":"Parks & Gardens"},{"id":"ICON","n":"Iconic & Must-See"},
      {"id":"ARCH","n":"Architecture & History"},{"id":"VIEW","n":"Views & Hikes"},
      {"id":"FAM","n":"Family & Kids"},{"id":"ODD","n":"Oddities & Hidden Gems"},
      {"id":"FREE","n":"Free to Visit"}]
KW={
 "TECH":["apple park","googleplex","google campus","computer history","intel museum","nvidia","hp garage","hewlett","nasa ames","moffett","tesla","semiconductor","android","visitor center","the tech interactive","stanford dish","xerox parc","fairchild","facebook","meta","silicon valley"],
 "MUS":["museum","gallery","collection","hall of fame","rosicrucian","cantor","anderson collection","planetarium","egyptian museum"],
 "PARK":["park","garden","gardens","preserve","open space","arboretum","baylands","hakone","japanese garden","municipal rose","overfelt","regional park","redwood grove"],
 "ICON":["winchester","stanford","memorial church","hoover tower","cathedral","mission santa clara","observatory","lick observatory","great mall","iconic","landmark"],
 "ARCH":["mission","historic","landmark","mansion","house","victorian","cathedral","church","temple","gurdwara","adobe","heritage","tower","monument","memorial"],
 "VIEW":["dish","hike","hiking","summit","peak","overlook","ridge","vista","view","fremont older","rancho san antonio","mission peak","stevens creek"],
 "FAM":["zoo","aquarium","carousel","science","children","amusement","great america","happy hollow","raging waters","tech interactive","playground","planetarium"],
}
ODD_SRC={"ATLASOBSCURA"}
POP_KW=["hp garage","birthplace of silicon valley","google","apple","tv show","filmed","film location","movie","pixar","steve jobs","xerox parc","fairchild"]
def collections(x, is_food):
    g=list(x.get("g",[]))
    hay=(x.get("n","")+" "+x.get("w","")+" "+x.get("k","")+" "+" ".join(x.get("cz",[]))).lower()
    if is_food:
        if any(k in hay for k in ["market","food hall","farmers market","public market"]): g.append("MKT")
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
 "MICHELIN_STAR":"MICHELIN ★","MICHELIN_BIB":"MICHELIN BIB","MICHELIN":"MICHELIN",
 "EATERSF":"EATER SF","EATER":"EATER SF","INFATUATION":"INFATUATION","THRILLIST":"THRILLIST",
 "SFCHRON":"SF CHRONICLE","SFGATE":"SFGATE","MERCURY":"MERCURY NEWS","SVSILICON":"SILICONVALLEY.COM",
 "KQED":"KQED","TIMEOUT":"TIME OUT","ATLASOBSCURA":"ATLAS OBSCURA","WIKIPEDIA":"WIKIPEDIA",
 "TRIPADVISOR":"TRIPADVISOR","OFFICIAL":"OFFICIAL SITE","NPS":"NATIONAL PARK SVC",
 "CASTATEPARKS":"CA STATE PARKS","VISITCA":"VISIT CALIFORNIA","SJTOURISM":"VISIT SAN JOSE",
 "YELP":"YELP","TABELOG":"TABELOG","EATERSV":"EATER SF","PALOALTOONLINE":"PALO ALTO ONLINE",
 "MTNVIEWVOICE":"MOUNTAIN VIEW VOICE","METROSV":"METRO SILICON VALLEY","SFSTANDARD":"SF STANDARD",
}
ALIAS={"EATER":"EATERSF","EATERSV":"EATERSF"}
def canon(k): return ALIAS.get(k,k)

# ---- build unified records (generic: any research file in this dir) ----
import glob
EXCLUDE=set()   # places confirmed permanently CLOSED / not visitable during geocoding — never re-add
sights=[]; food=[]; srcmeta={}; seen_names=set()
def _take(x, bucket):
    n=x.get("n")
    if not n or n in seen_names or n in EXCLUDE: return
    seen_names.add(n); bucket.append(x)
for path in sorted(glob.glob(os.path.join(D,"*.json"))):
    base=os.path.basename(path)
    if base.startswith(("_","out_","sv_","geo_")) or "dataset" in base: continue
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
json.dump(out,open(os.path.join(D,'sv_dataset.json'),'w'),indent=1,ensure_ascii=False)
work=[{"n":r["n"],"addr":r["ad"],"a":r["a"]} for r in P+F]
json.dump(work,open(os.path.join(D,'sv_worklist.json'),'w'),ensure_ascii=False,indent=0)

from collections import Counter
print("P(sights):",len(P)," F(food):",len(F)," total:",len(P)+len(F))
print("S keys:",len(S)," FS keys:",len(FS))
print("Collections coverage (sights):",dict(Counter(c for r in P for c in r.get("g",[]))))
print("Cuisine coverage (food):",dict(Counter(c for r in F for c in r["cz"])))
print("closed flagged:",[r["n"] for r in P+F if r.get("closed")] or "none")
print("wrote sv_dataset.json + sv_worklist.json")
