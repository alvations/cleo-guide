#!/usr/bin/env python3
# Consolidate the Indianapolis research files into one normalized dataset.
# Region = Indianapolis, IN (Marion County) + the north suburbs (Hamilton/Boone Co: Carmel, Fishers,
# Zionsville, Noblesville, Westfield) + the south side (Greenwood, Beech Grove, Southport — the Chin/Burmese
# community) + Speedway. Same pipeline + gates as every US dataset city (docs/PIPELINE.md, docs/CITIES.md).
# Deterministic: globs every FOOD_*/SIGHTS_*/VIRAL_* research file; never hand-patch the dataset.
import json, os, re, glob
from collections import Counter
D = os.path.dirname(os.path.abspath(__file__))

AREAS = [
 {"id":"DTN","n":"Downtown & Wholesale District (Monument Circle, White River State Park, Indiana Ave)"},
 {"id":"MASS","n":"Mass Ave, Lockerbie & the Old Northside"},
 {"id":"FSQ","n":"Fountain Square, Fletcher Place & the near south"},
 {"id":"MID","n":"Midtown (Newfields, Children's Museum, Crown Hill, Butler)"},
 {"id":"BRIP","n":"Broad Ripple, Meridian-Kessler & SoBro"},
 {"id":"WEST","n":"Speedway & the westside (International Marketplace)"},
 {"id":"EAST","n":"Irvington & the east side"},
 {"id":"NORTH","n":"North suburbs (Carmel, Fishers, Zionsville, Noblesville, Westfield)"},
 {"id":"SOUTH","n":"South side (Greenwood, Beech Grove, Southport — 'Chindianapolis')"},
]
AC = {"DTN":"#E8973A","MASS":"#C0504D","FSQ":"#8064A2","MID":"#4F81BD","BRIP":"#9BBB59",
      "WEST":"#4BACC6","EAST":"#D4A017","NORTH":"#7E8FC4","SOUTH":"#A6588C"}

# Indianapolis food canon: the breaded pork tenderloin sandwich, sugar cream (Hoosier) pie, St. Elmo's
# shrimp cocktail, Shapiro's deli, persimmon pudding, fried biscuits & apple butter, the Burmese/Chin
# south side, and the International Marketplace global corridor on the westside.
CUISINES = [
 {"id":"HOOS","n":"Hoosier Classics (tenderloin, fried chicken, biscuits & apple butter)"},
 {"id":"STEAK","n":"Steakhouses & Fine Dining"},
 {"id":"US","n":"American & New American"},
 {"id":"DELI","n":"Delis, Sandwiches & Diners"},
 {"id":"SOUL","n":"Soul, BBQ & Southern"},
 {"id":"ITAL","n":"Pizza & Italian"},
 {"id":"BURMA","n":"Burmese & Chin"},
 {"id":"ASIAN","n":"Asian"},
 {"id":"MEX","n":"Mexican & Latin"},
 {"id":"MED","n":"Mediterranean, Middle Eastern & African"},
 {"id":"PIE","n":"Sugar Cream Pie, Bakeries & Sweets"},
 {"id":"BREW","n":"Breweries, Bars & Cocktails"},
 {"id":"COF","n":"Coffee & Cafés"},
 {"id":"VIRAL","n":"Viral / Social"},
]
CMAP = {
 "Hoosier":"HOOS","Tenderloin":"HOOS","Pork Tenderloin":"HOOS","Fried Chicken":"HOOS","Biscuits":"HOOS","Indiana":"HOOS","Midwestern":"HOOS","Comfort":"HOOS","Tavern":"HOOS",
 "Steakhouse":"STEAK","Fine Dining":"STEAK","Shrimp Cocktail":"STEAK","Tasting Menu":"STEAK",
 "American":"US","New American":"US","Contemporary":"US","Farm-to-table":"US","Gastropub":"US","French":"US","Seafood":"US","Burgers":"US",
 "Deli":"DELI","Jewish Deli":"DELI","Sandwiches":"DELI","Diner":"DELI","Breakfast":"DELI","Brunch":"DELI","Hot Dogs":"DELI",
 "Soul Food":"SOUL","Southern":"SOUL","Barbecue":"SOUL","BBQ":"SOUL","Cajun":"SOUL","Caribbean":"SOUL","Jamaican":"SOUL",
 "Pizza":"ITAL","Italian":"ITAL","Neapolitan":"ITAL",
 "Burmese":"BURMA","Chin":"BURMA","Myanmar":"BURMA",
 "Vietnamese":"ASIAN","Thai":"ASIAN","Chinese":"ASIAN","Sichuan":"ASIAN","Cantonese":"ASIAN","Japanese":"ASIAN","Sushi":"ASIAN","Ramen":"ASIAN","Korean":"ASIAN","Indian":"ASIAN","Nepali":"ASIAN","Filipino":"ASIAN","Dim Sum":"ASIAN","Malaysian":"ASIAN","Taiwanese":"ASIAN","Pan-Asian":"ASIAN","Asian":"ASIAN",
 "Mexican":"MEX","Tacos":"MEX","Taqueria":"MEX","Latin American":"MEX","Peruvian":"MEX","Salvadoran":"MEX","Cuban":"MEX","Venezuelan":"MEX","Colombian":"MEX","Puerto Rican":"MEX",
 "Mediterranean":"MED","Middle Eastern":"MED","Greek":"MED","Lebanese":"MED","Turkish":"MED","Israeli":"MED","Halal":"MED","Ethiopian":"MED","African":"MED","West African":"MED","Nigerian":"MED","Senegalese":"MED","Afghan":"MED","Persian":"MED","Moroccan":"MED","Somali":"MED",
 "Pie":"PIE","Sugar Cream Pie":"PIE","Bakery":"PIE","Dessert":"PIE","Desserts":"PIE","Pastry":"PIE","Donuts":"PIE","Chocolate":"PIE","Candy":"PIE","Ice Cream":"PIE","Persimmon":"PIE",
 "Brewery":"BREW","Beer":"BREW","Bar":"BREW","Cocktails":"BREW","Cocktail Bar":"BREW","Wine Bar":"BREW","Taproom":"BREW","Distillery":"BREW","Pub":"BREW","Winery":"BREW","Meadery":"BREW","Cidery":"BREW",
 "Coffee":"COF","Cafe":"COF","Café":"COF","Roaster":"COF",
 "Viral":"VIRAL",
}
def map_cz(raw):
    out=[]
    for c in raw:
        i=CMAP.get(c) or CMAP.get(c.strip())
        if i and i not in out: out.append(i)
    return out or ["US"]

CATS=[{"id":"ICON","n":"Iconic & Must-See"},{"id":"RACE","n":"Racing & the Speedway"},
      {"id":"MUS","n":"Museums & Galleries"},{"id":"PARK","n":"Parks, Trails & Gardens"},
      {"id":"ARCH","n":"Architecture, Monuments & History"},{"id":"ENT","n":"Sports, Music & Entertainment"},
      {"id":"SHOP","n":"Markets & Districts"},{"id":"FAM","n":"Family & Kids"},
      {"id":"ODD","n":"Oddities & Hidden Gems"},{"id":"FREE","n":"Free to Visit"}]
KW={
 "ICON":["monument circle","soldiers' and sailors'","soldiers and sailors","speedway","children's museum","newfields","war memorial","cultural trail","crown hill","statehouse"],
 "RACE":["speedway","indy 500","indianapolis 500","racing","motor speedway","brickyard","race"],
 "MUS":["museum","gallery","newfields","eiteljorg","art center","library","historical society","heritage","exhibit"],
 "PARK":["park","garden","trail","canal","arboretum","nature","river","reservoir","greenway","preserve","100 acres","conservatory","forest"],
 "ARCH":["memorial","monument","cemetery","church","cathedral","historic","landmark","theatre","theater","mansion","home","house","statehouse","temple","scottish rite","union station"],
 "ENT":["stadium","fieldhouse","lucas oil","victory field","colts","pacers","indians","concert","music","arena","hall","theatre","theater","hinkle","raceway"],
 "SHOP":["market","district","marketplace","mall","bookstore","shop","antique","city market","mass ave"],
 "FAM":["zoo","children","kids","family","conner prairie","science","interactive","carousel","waterpark","farm"],
}
ODD_SRC={"ATLASOBSCURA","ROADSIDEAMERICA"}
def collections(x, is_food):
    g=list(x.get("g",[]))
    hay=(x.get("n","")+" "+x.get("w","")+" "+x.get("k","")+" "+" ".join(x.get("cz",[]))).lower()
    if is_food:
        if any(k in hay for k in ["city market","food hall","market"]): g.append("SHOP")
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
 "JAMESBEARD":"JAMES BEARD","MICHELIN":"MICHELIN","NPS":"NATIONAL PARK SVC","INDYSTAR":"INDYSTAR",
 "INDYMONTHLY":"INDIANAPOLIS MONTHLY","IBJ":"INDIANAPOLIS BUSINESS JOURNAL","WFYI":"WFYI","VISITINDY":"VISIT INDY",
 "EATER":"EATER","ATLASOBSCURA":"ATLAS OBSCURA","WIKIPEDIA":"WIKIPEDIA","OFFICIAL":"OFFICIAL SITE",
 "INDNR":"INDIANA DNR","YELP":"YELP","TRIPADVISOR":"TRIPADVISOR","WTHR":"WTHR 13","WISH":"WISH-TV 8",
 "FOX59":"FOX59","INDYKIDS":"INDY KIDS","NUVO":"NUVO","INDIANAHISTORY":"INDIANA HISTORICAL SOCIETY",
 "ROADSIDEAMERICA":"ROADSIDE AMERICA","HAMILTONCOUNTY":"VISIT HAMILTON COUNTY","MIRROR":"MIRROR INDY",
}
ALIAS={"INDIANAPOLISMONTHLY":"INDYMONTHLY","INDYSTAR_COM":"INDYSTAR","VISIT_INDY":"VISITINDY","JBF":"JAMESBEARD","JAMES_BEARD":"JAMESBEARD","MIRRORINDY":"MIRROR"}
def canon(k): return ALIAS.get(k,k)

EXCLUDE=set(); sights=[]; food=[]; srcmeta={}; seen_names=set()
def _take(x, bucket):
    n=x.get("n")
    if not n or n in seen_names or n in EXCLUDE: return
    seen_names.add(n); bucket.append(x)
for path in sorted(glob.glob(os.path.join(D,"*.json"))):
    base=os.path.basename(path)
    if base.startswith(("_","out_","ind_","geo_","CREATORS","SOURCES_")) or "dataset" in base: continue
    d=json.load(open(path,encoding="utf-8"))
    if isinstance(d, list):
        for x in d: _take(x, food)
    else:
        for s in d.get('sources',[]): srcmeta.setdefault(s['key'],s)
        for x in d.get('sights',[]): _take(x, sights)
        for x in d.get('food',[]):   _take(x, food)
for path in sorted(glob.glob(os.path.join(D,"SOURCES_*.json"))):
    d=json.load(open(path,encoding="utf-8"))
    for s in d.get("outlets",[])+d.get("creators",[]): srcmeta.setdefault(s['key'],s)

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
    w=x["w"]
    if x.get("dish") and x["dish"].lower()[:20] not in w.lower(): w = "Order: " + x["dish"] + ". " + w
    r={"t":int(x["t"]),"a":x["a"],"n":x["n"],"ad":x["address"],"w":w}
    if x.get("k"): r["k"]=x["k"]
    if x.get("closed"): r["closed"]=True
    r["cz"]=map_cz(x.get("cz",[])); g=collections(x,True)
    if g: r["g"]=g
    r["s"]=norm_sources(x)
    for t in r["s"]: used_keys_F.add(t[0])
    F.append(r)

ids={a["id"] for a in AREAS}
bad=[r["n"] for r in P+F if r["a"] not in ids]
assert not bad, "records with unknown area ids: %s" % bad[:10]

def mk_table(keys):
    tbl={}
    for k in sorted(keys):
        m=srcmeta.get(k) or {}
        tbl[k]={"k":SRC_LABEL.get(k,k.replace('_',' ').upper()),"t":m.get("name",SRC_LABEL.get(k,k)),"u":m.get("url",""),"l":m.get("name","")}
    return tbl
S=mk_table(used_keys_S); FS=mk_table(used_keys_F)
out={"areas":AREAS,"ac":AC,"cuisines":CUISINES,"cats":CATS,"P":P,"F":F,"S":S,"FS":FS}
json.dump(out,open(os.path.join(D,'ind_dataset.json'),'w',encoding="utf-8"),indent=1,ensure_ascii=False)
json.dump([{"n":r["n"],"addr":r["ad"],"a":r["a"]} for r in P+F],open(os.path.join(D,'_worklist.json'),'w',encoding="utf-8"),ensure_ascii=False,indent=0)
print("P(sights):",len(P)," F(food):",len(F)," total:",len(P)+len(F))
print("by area:",dict(Counter(r["a"] for r in P+F)))
print("Cuisine coverage:",dict(Counter(c for r in F for c in r["cz"])))
print("closed flagged:",[r["n"] for r in P+F if r.get("closed")] or "none")
print("wrote ind_dataset.json + _worklist.json")
