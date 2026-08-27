#!/usr/bin/env python3
# Consolidate the State College / Penn State (Happy Valley, Centre County PA) research files into one
# normalized dataset. Region = Downtown State College + the Penn State University Park campus + the
# historic Centre County towns (Bellefonte, Boalsburg) + the Happy Valley outskirts. Same pipeline +
# gates as every US city; standard engine theme (not pastel).
import json, os, re, glob
from collections import Counter
D = os.path.dirname(os.path.abspath(__file__))

# ---- AREAS ----
AREAS = [
 {"id":"DT","n":"Downtown State College (College & Beaver Ave)"},
 {"id":"PSU","n":"Penn State — University Park campus"},
 {"id":"BVL","n":"Bellefonte & Boalsburg (historic towns)"},
 {"id":"HV","n":"Happy Valley & Centre County (Pine Grove Mills, Lemont, Penns Valley)"},
]
AC = {"DT":"#C0504D","PSU":"#41729F","BVL":"#9BBB59","HV":"#8064A2"}

# ---- cuisine taxonomy — a college town's own canon ----
# Penn State's signature strengths: the Berkey Creamery (its own ice cream), the grilled sticky at
# Ye Olde College Diner, wings, tavern pizza, a real craft-beer scene (Otto's, Happy Valley, Robin Hood,
# Elk Creek), plus the diner/breakfast institutions and a college-town spread of Asian/Mexican/Med.
CUISINES = [
 {"id":"CREAM","n":"Creamery & Ice Cream"},{"id":"STICKY","n":"Grilled Stickies & Diners"},
 {"id":"WINGS","n":"Wings & Tavern"},{"id":"PIZZA","n":"Pizza"},
 {"id":"BREW","n":"Breweries & Beer"},{"id":"US","n":"American & New American"},
 {"id":"BBQ","n":"BBQ & Smokehouse"},{"id":"MEX","n":"Mexican & Latin"},
 {"id":"ASIAN","n":"Asian"},{"id":"MED","n":"Mediterranean & Middle Eastern"},
 {"id":"BREAK","n":"Breakfast & Cafés"},{"id":"FARM","n":"Farms & Markets"},
 {"id":"VIRAL","n":"Viral / Student Favorite"},
]
CMAP = {
 "Ice Cream":"CREAM","Creamery":"CREAM","Dairy":"CREAM","Custard":"CREAM","Gelato":"CREAM",
 "Diner":"STICKY","Grilled Sticky":"STICKY","Stickies":"STICKY","Breakfast Diner":"STICKY","Comfort":"STICKY",
 "Wings":"WINGS","Sports Bar":"WINGS","Tavern":"WINGS","Bar":"WINGS","Pub":"WINGS","Gastropub":"WINGS","Wing":"WINGS",
 "Pizza":"PIZZA","Neapolitan":"PIZZA","Tavern Pizza":"PIZZA","Slice":"PIZZA",
 "Brewery":"BREW","Beer":"BREW","Taproom":"BREW","Cidery":"BREW","Winery":"BREW","Distillery":"BREW","Cocktails":"BREW","Wine Bar":"BREW",
 "American":"US","New American":"US","Contemporary":"US","Steakhouse":"US","Farm-to-table":"US","Seafood":"US","Fine Dining":"US","Austrian":"US","German":"US","Continental":"US",
 "Barbecue":"BBQ","BBQ":"BBQ","Smokehouse":"BBQ","Ribs":"BBQ",
 "Mexican":"MEX","Tacos":"MEX","Taqueria":"MEX","Latin American":"MEX","Tex-Mex":"MEX","Peruvian":"MEX","Salvadoran":"MEX",
 "Thai":"ASIAN","Chinese":"ASIAN","Japanese":"ASIAN","Sushi":"ASIAN","Ramen":"ASIAN","Korean":"ASIAN","Indian":"ASIAN","Vietnamese":"ASIAN","Pho":"ASIAN","Dim Sum":"ASIAN","Malaysian":"ASIAN","Filipino":"ASIAN","Nepali":"ASIAN","Bubble Tea":"ASIAN",
 "Mediterranean":"MED","Middle Eastern":"MED","Greek":"MED","Lebanese":"MED","Turkish":"MED","Israeli":"MED","Falafel":"MED","Halal":"MED",
 "Breakfast":"BREAK","Brunch":"BREAK","Cafe":"BREAK","Café":"BREAK","Coffee":"BREAK","Bakery":"BREAK","Bagels":"BREAK","Donuts":"BREAK","Deli":"BREAK","Sandwiches":"BREAK",
 "Farm":"FARM","Farmers Market":"FARM","Market":"FARM","Orchard":"FARM","Fruit Farm":"FARM","Farm Stand":"FARM",
 "Viral":"VIRAL",
}
def map_cz(raw):
    out=[]
    for c in raw:
        i=CMAP.get(c) or CMAP.get(c.strip())
        if i and i not in out: out.append(i)
    return out or ["US"]

# ---- Collections (CATS) + keyword rules ----
CATS=[{"id":"ICON","n":"Iconic & Must-See"},{"id":"CAMPUS","n":"Penn State Campus"},
      {"id":"MUS","n":"Museums & Galleries"},{"id":"PARK","n":"Parks, Gardens & Nature"},
      {"id":"OUTDOOR","n":"Hikes & Outdoors"},{"id":"HIST","n":"History & Heritage"},
      {"id":"SPORT","n":"Stadiums & Sports"},{"id":"FAM","n":"Family & Kids"},
      {"id":"ODD","n":"Oddities & Hidden Gems"},{"id":"FREE","n":"Free to Visit"}]
KW={
 "ICON":["old main","beaver stadium","nittany lion shrine","mount nittany","penn's cave","berkey creamery","the arboretum","happy valley"],
 "CAMPUS":["penn state","old main","hub","pattee","paterno library","palmer museum","all-sports museum","nittany lion","university park","willard","schwab","stuckeman"],
 "MUS":["museum","gallery","palmer museum","all-sports museum","frost entomological","pasto agricultural","boal mansion","columbus chapel","military museum","art museum","discovery space"],
 "PARK":["arboretum","garden","park","millbrook marsh","spring creek","duck pond","tudek","walnut springs","nature","marsh","botanic"],
 "OUTDOOR":["mount nittany","rothrock","black moshannon","whipple dam","penn's cave","woodward","trail","hike","state forest","state park","overlook","waterfall","bald eagle","greenwood furnace"],
 "HIST":["bellefonte","boalsburg","memorial day","historic","victorian","talleyrand","gamble mill","curtin","centre furnace","military museum","columbus chapel","national register","1800s","historic district"],
 "SPORT":["beaver stadium","bryce jordan","pegula","medlar field","sports","stadium","arena","nittany lion","white out"],
 "FAM":["penn's cave","creamery","discovery space","zoo","wildlife","arboretum children","carousel","farm","duck pond"],
}
ODD_SRC={"ATLASOBSCURA"}
def collections(x, is_food):
    g=list(x.get("g",[]))
    hay=(x.get("n","")+" "+x.get("w","")+" "+x.get("k","")+" "+" ".join(x.get("cz",[]))).lower()
    if is_food:
        if any(k in hay for k in ["farmers market","market","creamery","farm stand"]): g.append("MKT")
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

# ---- source metadata (labels for filter chips); synthesize for missing keys ----
SRC_LABEL={
 "CDT":"CENTRE DAILY TIMES","STATECOLLEGE":"STATECOLLEGE.COM","ONWARDSTATE":"ONWARD STATE",
 "COLLEGIAN":"THE DAILY COLLEGIAN","PSUNEWS":"PENN STATE NEWS","HVAB":"HAPPY VALLEY ADV. BUREAU",
 "VISITPA":"VISIT PA","UNCOVERINGPA":"UNCOVERING PA","PAEATS":"PA EATS","WTAJ":"WTAJ","WPSU":"WPSU",
 "GOPSU":"GOPSUSPORTS","ATLASOBSCURA":"ATLAS OBSCURA","WIKIPEDIA":"WIKIPEDIA","OFFICIAL":"OFFICIAL SITE",
 "NRHP":"NAT'L REGISTER","DCNR":"PA DCNR (PARKS)","JAMESBEARD":"JAMES BEARD","USATODAY":"USA TODAY 10BEST",
 "YELP":"YELP","TRIPADVISOR":"TRIPADVISOR","GOOGLE":"GOOGLE","OPENTABLE":"OPENTABLE",
}
ALIAS={"CENTREDAILYTIMES":"CDT","STATECOLLEGE_COM":"STATECOLLEGE","ONWARD_STATE":"ONWARDSTATE",
       "DAILYCOLLEGIAN":"COLLEGIAN","HAPPYVALLEY":"HVAB","UNCOVERING_PA":"UNCOVERINGPA","VISITPENNSTATE":"HVAB"}
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
    if base.startswith(("_","out_","sc_","geo_","CREATORS","SOURCES_")) or "dataset" in base: continue
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
json.dump(out,open(os.path.join(D,'sc_dataset.json'),'w'),indent=1,ensure_ascii=False)
work=[{"n":r["n"],"addr":r["ad"],"a":r["a"]} for r in P+F]
json.dump(work,open(os.path.join(D,'sc_worklist.json'),'w'),ensure_ascii=False,indent=0)

print("P(sights):",len(P)," F(food):",len(F)," total:",len(P)+len(F))
print("Area coverage:",dict(Counter(r["a"] for r in P+F)))
print("Cuisine coverage:",dict(Counter(c for r in F for c in r["cz"])))
print("closed flagged:",[r["n"] for r in P+F if r.get("closed")] or "none")
print("wrote sc_dataset.json + sc_worklist.json")
