#!/usr/bin/env python3
# Consolidate the Columbus research files into one normalized dataset. Region = Columbus OH + inner
# suburbs. Mirrors the SF/SV/NYC/Cincinnati pipeline.
import json, os, re
D = os.path.dirname(os.path.abspath(__file__))

AREAS = [
 {"id":"DTN","n":"Downtown & Scioto Mile"},
 {"id":"SN","n":"Short North, Victorian & Italian Village"},
 {"id":"GV","n":"German Village & Brewery District"},
 {"id":"OSU","n":"University District, Clintonville & OSU"},
 {"id":"EAST","n":"Bexley, Olde Towne East & Whitehall"},
 {"id":"WEST","n":"Franklinton, Grandview & Hilltop"},
 {"id":"BURB","n":"Suburbs (Dublin, Worthington, Westerville, New Albany)"},
]
AC = {"DTN":"#E8973A","SN":"#C0504D","GV":"#8064A2","OSU":"#4F81BD","EAST":"#9BBB59","WEST":"#4BACC6","BURB":"#7E8FC4"}

# Columbus food: Jeni's (born here), North Market, Columbus-style square-cut pizza, German Village
# sausage, and one of the largest Somali/East-African tables in the US.
CUISINES = [
 {"id":"US","n":"American & New American"},{"id":"BURG","n":"Burgers & Diners"},
 {"id":"PIZZA","n":"Columbus-Style Pizza"},{"id":"GERMAN","n":"German"},
 {"id":"AFRICAN","n":"Somali & East African"},{"id":"ASIAN","n":"Asian"},
 {"id":"MEX","n":"Mexican & Latin"},{"id":"MED","n":"Mediterranean & Middle Eastern"},
 {"id":"SOUL","n":"Soul, BBQ & Southern"},{"id":"ICE","n":"Ice Cream & Bakeries"},
 {"id":"BREW","n":"Breweries & Bars"},{"id":"COF","n":"Coffee & Cafés"},{"id":"VIRAL","n":"Viral / Social"},
]
CMAP = {
 "American":"US","New American":"US","Californian":"US","Steakhouse":"US","Contemporary":"US","Farm-to-table":"US","Gastropub":"US","French":"US","Seafood":"US",
 "Burgers":"BURG","Diner":"BURG","Breakfast":"BURG","Brunch":"BURG","Sandwiches":"BURG","Deli":"BURG","Hot Dogs":"BURG",
 "Pizza":"PIZZA","Columbus-Style":"PIZZA","Neapolitan":"PIZZA",
 "German":"GERMAN","Bratwurst":"GERMAN","Bavarian":"GERMAN",
 "Somali":"AFRICAN","East African":"AFRICAN","Ethiopian":"AFRICAN","Eritrean":"AFRICAN","African":"AFRICAN","Nepali":"AFRICAN","Bhutanese":"AFRICAN","Himalayan":"AFRICAN",
 "Vietnamese":"ASIAN","Thai":"ASIAN","Chinese":"ASIAN","Cantonese":"ASIAN","Japanese":"ASIAN","Sushi":"ASIAN","Ramen":"ASIAN","Korean":"ASIAN","Indian":"ASIAN","Filipino":"ASIAN","Dim Sum":"ASIAN",
 "Mexican":"MEX","Tacos":"MEX","Taqueria":"MEX","Latin American":"MEX","Peruvian":"MEX","Salvadoran":"MEX","Cuban":"MEX",
 "Mediterranean":"MED","Middle Eastern":"MED","Greek":"MED","Lebanese":"MED","Turkish":"MED","Israeli":"MED","Halal":"MED",
 "Soul Food":"SOUL","Southern":"SOUL","Barbecue":"SOUL","BBQ":"SOUL","Fried Chicken":"SOUL","Cajun":"SOUL",
 "Ice Cream":"ICE","Bakery":"ICE","Dessert":"ICE","Desserts":"ICE","Pastry":"ICE","Donuts":"ICE","Chocolate":"ICE","Candy":"ICE",
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

CATS=[{"id":"ICON","n":"Iconic & Must-See"},{"id":"MUS","n":"Museums & Galleries"},
      {"id":"PARK","n":"Parks & Gardens"},{"id":"VIEW","n":"Views & Trails"},
      {"id":"ARCH","n":"Architecture & History"},{"id":"ENT","n":"Sports, Music & Entertainment"},
      {"id":"SHOP","n":"Markets & Districts"},{"id":"FAM","n":"Family & Kids"},
      {"id":"ODD","n":"Oddities & Hidden Gems"},{"id":"FREE","n":"Free to Visit"}]
KW={
 "ICON":["statehouse","short north","german village","cosi","scioto mile","leveque","topiary park","ohio stadium","the oval","columbus zoo"],
 "MUS":["museum","gallery","cosi","columbus museum of art","wexner","art museum","science","kelton","billy ireland","cartoon"],
 "PARK":["park","conservatory","franklin park","goodale","schiller","topiary","park of roses","whetstone","arboretum","gardens","metro park","scioto audubon","highbanks","inniswood"],
 "VIEW":["trail","olentangy","scioto","overlook","view","greenway","quarry"],
 "ARCH":["statehouse","german village","book loft","leveque","cathedral","church","historic","landmark","victorian village","thurber","kelton house","ohio theatre","southern theatre"],
 "ENT":["stadium","arena","nationwide arena","ohio stadium","huntington park","lower.com","crew","blue jackets","buckeyes","clippers","express live","newport music hall","ohio theatre","palace theatre","schottenstein"],
 "SHOP":["north market","short north","german village","easton","gateway","arena district","brewery district","clintonville","grandview","market","district","the book loft"],
 "FAM":["zoo","cosi","science","aquarium","zombie","children","wildlights","conservatory","topiary","carousel","legoland","columbus zoo","zoombezi"],
}
ODD_SRC={"ATLASOBSCURA"}
def collections(x, is_food):
    g=list(x.get("g",[]))
    hay=(x.get("n","")+" "+x.get("w","")+" "+x.get("k","")+" "+" ".join(x.get("cz",[]))).lower()
    if is_food:
        if any(k in hay for k in ["market","food hall","north market"]): g.append("MKT")
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
 "JAMESBEARD":"JAMES BEARD","MICHELIN":"MICHELIN","DISPATCH":"COLUMBUS DISPATCH","COLUMBUSMONTHLY":"COLUMBUS MONTHLY",
 "COLUMBUSUNDERGROUND":"COLUMBUS UNDERGROUND","COLUMBUSALIVE":"COLUMBUS ALIVE","614MAG":"614 MAGAZINE","NBC4":"NBC4",
 "TENTV":"10TV","ABC6":"ABC6","EXPERIENCECBUS":"EXPERIENCE COLUMBUS","USATODAY":"USA TODAY 10BEST",
 "ATLASOBSCURA":"ATLAS OBSCURA","WIKIPEDIA":"WIKIPEDIA","TRIPADVISOR":"TRIPADVISOR","OFFICIAL":"OFFICIAL SITE",
 "OHIOHISTORY":"OHIO HISTORY","NPS":"NATIONAL PARK SVC","YELP":"YELP","OPENTABLE":"OPENTABLE DINERS' CHOICE",
}
ALIAS={"COLUMBUS_DISPATCH":"DISPATCH","THEDISPATCH":"DISPATCH","614":"614MAG","10TV":"TENTV"}
def canon(k): return ALIAS.get(k,k)

import glob
EXCLUDE=set(); sights=[]; food=[]; srcmeta={}; seen_names=set()
def _take(x, bucket):
    n=x.get("n")
    if not n or n in seen_names or n in EXCLUDE: return
    seen_names.add(n); bucket.append(x)
for path in sorted(glob.glob(os.path.join(D,"*.json"))):
    base=os.path.basename(path)
    if base.startswith(("_","out_","col_","geo_")) or "dataset" in base: continue
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
json.dump(out,open(os.path.join(D,'col_dataset.json'),'w'),indent=1,ensure_ascii=False)
json.dump([{"n":r["n"],"addr":r["ad"],"a":r["a"]} for r in P+F],open(os.path.join(D,'col_worklist.json'),'w'),ensure_ascii=False,indent=0)
from collections import Counter
print("P(sights):",len(P)," F(food):",len(F)," total:",len(P)+len(F))
print("Cuisine coverage:",dict(Counter(c for r in F for c in r["cz"])))
print("closed flagged:",[r["n"] for r in P+F if r.get("closed")] or "none")
print("wrote col_dataset.json + col_worklist.json")
