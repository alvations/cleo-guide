#!/usr/bin/env python3
# Consolidate the Orlando & Central Florida research files into one normalized dataset (orl_dataset.json).
# Region = Orlando proper (Downtown/Thornton Park, Mills 50/Milk District/Audubon Park), Winter Park/Baldwin
# Park/Maitland, International Drive/Dr Phillips/Restaurant Row (+ SeaWorld), Walt Disney World PER PARK,
# Universal Orlando PER PARK, Kissimmee/Celebration/Lake Nona, West Orange (Winter Garden/Windermere),
# Sanford/Lake Mary/Mount Dora + the springs, East Orlando/UCF/Oviedo, and the Space Coast.
# Theme-park attractions are pinned at their own location inside the park (Wikipedia/Wikidata coords),
# never a park centroid. Deterministic: rerun any time; no hand-patched datasets.
import json, os, re, glob
from collections import Counter
D = os.path.dirname(os.path.abspath(__file__))

AREAS = [
 {"id":"DTO","n":"Downtown Orlando & Thornton Park (Lake Eola, Parramore, Church St)"},
 {"id":"MILLS","n":"Mills 50, Milk District, Audubon Park & SoDo"},
 {"id":"WPK","n":"Winter Park, Baldwin Park & Maitland"},
 {"id":"IDR","n":"International Drive, Dr Phillips & Restaurant Row (SeaWorld, Millenia)"},
 {"id":"MK","n":"Magic Kingdom & the Seven Seas Lagoon resorts (Walt Disney World)"},
 {"id":"EPCOT","n":"EPCOT & the BoardWalk resorts (Walt Disney World)"},
 {"id":"DHS","n":"Disney's Hollywood Studios (Walt Disney World)"},
 {"id":"DAK","n":"Disney's Animal Kingdom (Walt Disney World)"},
 {"id":"DSP","n":"Disney Springs & the wider Disney resort area"},
 {"id":"USF","n":"Universal Studios Florida"},
 {"id":"IOA","n":"Universal Islands of Adventure"},
 {"id":"EPIC","n":"Universal Epic Universe"},
 {"id":"CWALK","n":"Universal CityWalk & the Universal resorts (incl. Volcano Bay)"},
 {"id":"KISS","n":"Kissimmee, Celebration, St. Cloud & Lake Nona"},
 {"id":"WEST","n":"Winter Garden, Windermere & West Orange"},
 {"id":"SPRNG","n":"Sanford, Lake Mary, Mount Dora & the springs (Wekiwa, Blue Spring)"},
 {"id":"EAST","n":"East Orlando, UCF & Oviedo"},
 {"id":"SPACE","n":"Space Coast (Kennedy Space Center, Titusville, Cocoa Beach)"},
]
AC = {"DTO":"#C0504D","MILLS":"#E8973A","WPK":"#2E8B57","IDR":"#8E44AD","MK":"#3A6FD8","EPCOT":"#16A0B5",
      "DHS":"#B5446E","DAK":"#6B8E23","DSP":"#5D6DBE","USF":"#D4A017","IOA":"#C76B29","EPIC":"#7A4FB5",
      "CWALK":"#A0522D","KISS":"#D35400","WEST":"#48A868","SPRNG":"#1F9E89","EAST":"#7F8C8D","SPACE":"#34495E"}

# ---- cuisine taxonomy — the Orlando / Central Florida canon ----
# City-unique canon first: the Mills 50 Vietnamese corridor (pho, banh mi, bun bo hue), Puerto Rican
# Kissimmee (mofongo, lechon, pinchos), Cuban, Florida citrus & key lime, gator & swamp-to-table Florida
# flavors, Michelin Florida (stars + Bibs), and the THEME-PARK SIGNATURE EATS as their own layer (Dole Whip,
# Butterbeer, turkey legs, Mickey pretzels, Ronto Wraps...). A tag names the KITCHEN's tradition, never one dish.
CUISINES = [
 {"id":"PARK","n":"Theme-Park Signature Eats"},{"id":"FINE","n":"Michelin & Fine Dining"},
 {"id":"VN","n":"Vietnamese (Mills 50)"},{"id":"PR","n":"Puerto Rican"},{"id":"CUBA","n":"Cuban"},
 {"id":"LAT","n":"Latin American & Caribbean"},{"id":"MEX","n":"Mexican"},
 {"id":"FLA","n":"Florida Flavors (gator, citrus, key lime, Gulf seafood)"},{"id":"SEAF","n":"Seafood"},
 {"id":"BBQ","n":"BBQ & Smokehouse"},{"id":"US","n":"American & Southern"},
 {"id":"JP","n":"Japanese, Sushi & Omakase"},{"id":"CN","n":"Chinese"},{"id":"KR","n":"Korean"},
 {"id":"TH","n":"Thai & Lao"},{"id":"SEA","n":"Southeast Asian (Filipino, Malaysian…)"},{"id":"IN","n":"Indian"},
 {"id":"ME","n":"Middle Eastern & Mediterranean"},{"id":"IT","n":"Italian & Pizza"},{"id":"EU","n":"European"},
 {"id":"DES","n":"Desserts, Bakeries & Coffee"},{"id":"BAR","n":"Breweries, Bars & Cocktails"},
 {"id":"VIRAL","n":"Viral / Social"},
]
CMAP = {
 "Theme Park":"PARK","Theme-Park":"PARK","Park Snack":"PARK","Disney":"PARK","Universal":"PARK","Theme Park Snack":"PARK",
 "Fine Dining":"FINE","Tasting Menu":"FINE","Michelin":"FINE","Contemporary":"FINE",
 "Vietnamese":"VN","Pho":"VN","Banh Mi":"VN",
 "Puerto Rican":"PR","Boricua":"PR",
 "Cuban":"CUBA",
 "Latin American":"LAT","Colombian":"LAT","Venezuelan":"LAT","Peruvian":"LAT","Brazilian":"LAT","Argentinian":"LAT",
 "Caribbean":"LAT","Jamaican":"LAT","Haitian":"LAT","Dominican":"LAT","Salvadoran":"LAT","Nicaraguan":"LAT","Latin":"LAT",
 "Mexican":"MEX","Tacos":"MEX","Taqueria":"MEX","Tex-Mex":"MEX",
 "Florida":"FLA","Gator":"FLA","Citrus":"FLA","Key Lime":"FLA","Cracker":"FLA","Southern Florida":"FLA",
 "Seafood":"SEAF","Oysters":"SEAF","Fish":"SEAF",
 "BBQ":"BBQ","Barbecue":"BBQ","Smokehouse":"BBQ",
 "American":"US","New American":"US","Southern":"US","Soul Food":"US","Steakhouse":"US","Burgers":"US","Diner":"US",
 "Breakfast":"US","Brunch":"US","Gastropub":"US","Sandwiches":"US","Comfort":"US","Hot Dogs":"US","Chicken":"US","Farm-to-table":"US",
 "Japanese":"JP","Sushi":"JP","Omakase":"JP","Ramen":"JP","Izakaya":"JP","Udon":"JP","Kaiseki":"JP",
 "Chinese":"CN","Sichuan":"CN","Cantonese":"CN","Dim Sum":"CN","Taiwanese":"CN","Dumplings":"CN","Hong Kong":"CN",
 "Korean":"KR","Thai":"TH","Lao":"TH","Laotian":"TH","Isan":"TH",
 "Filipino":"SEA","Malaysian":"SEA","Indonesian":"SEA","Burmese":"SEA","Singaporean":"SEA","Southeast Asian":"SEA",
 "Indian":"IN","South Indian":"IN","Pakistani":"IN","Nepalese":"IN",
 "Middle Eastern":"ME","Mediterranean":"ME","Lebanese":"ME","Greek":"ME","Turkish":"ME","Persian":"ME","Moroccan":"ME","Israeli":"ME","Ethiopian":"ME","African":"ME",
 "Italian":"IT","Pizza":"IT","Pasta":"IT",
 "French":"EU","Spanish":"EU","German":"EU","British":"EU","Irish":"EU","European":"EU","Norwegian":"EU","Portuguese":"EU",
 "Dessert":"DES","Desserts":"DES","Bakery":"DES","Ice Cream":"DES","Donuts":"DES","Coffee":"DES","Cafe":"DES","Café":"DES","Chocolate":"DES",
 "Brewery":"BAR","Bar":"BAR","Cocktails":"BAR","Beer":"BAR","Dive Bar":"BAR","Wine":"BAR","Winery":"BAR","Distillery":"BAR","Tiki":"BAR","Speakeasy":"BAR",
 "Viral":"VIRAL",
}
def map_cz(raw):
    out=[]
    for c in raw:
        i=CMAP.get(c) or CMAP.get(c.strip())
        if i and i not in out: out.append(i)
    return out or ["US"]

# ---- Collections (CATS) + keyword rules ----
CATS=[{"id":"RIDE","n":"Theme-Park Rides & Attractions"},{"id":"SHOW","n":"Shows, Parades & Fireworks"},
      {"id":"ICON","n":"Iconic & Must-See"},{"id":"SPACE","n":"Space & Science"},
      {"id":"SPRNG","n":"Springs, Lakes & Nature"},{"id":"WILD","n":"Wildlife & Gators"},
      {"id":"MUS","n":"Museums & Galleries"},{"id":"HIST","n":"History & Architecture"},
      {"id":"WATER","n":"Beaches & Waterways"},{"id":"ARTS","n":"Performing Arts & Music"},
      {"id":"MKT","n":"Markets, Food Halls & Shopping"},{"id":"FAM","n":"Family & Kids"},
      {"id":"ODD","n":"Oddities & Hidden Gems"},{"id":"FREE","n":"Free to Visit"},
      {"id":"BAR","n":"Bars, Lounges & Speakeasies"}]
KW={
 "RIDE":["roller coaster","coaster","dark ride","ride","flume","simulator","drop tower","attraction","log flume","boat ride","water slide"],
 "SHOW":["show","fireworks","parade","nighttime spectacular","stunt","musical","projection","stage"],
 "ICON":["cinderella castle","spaceship earth","tree of life","hogwarts","tower of terror","lake eola fountain","main street, u.s.a","kennedy space center","icon"],
 "SPACE":["nasa","space","rocket","launch","astronaut","shuttle","apollo","saturn v","planetarium","science center"],
 "SPRNG":["spring","springs","state park","river","lake","preserve","nature","trail","wildlife refuge","manatee","kayak","swamp","forest"],
 "WILD":["gator","alligator","zoo","wildlife","safari","animal","manatee","bird","aquarium","sanctuary","marine"],
 "MUS":["museum","gallery","collection","tiffany","morse","art center","history center"],
 "HIST":["historic","national register","nrhp","1920s","heritage","landmark","mission","architecture","1880s","history"],
 "WATER":["beach","pier","waterpark","water park","lagoon","canal","boat tour","seashore","surf"],
 "ARTS":["theater","theatre","concert","symphony","jazz","performing arts","opera","ballet","music venue","amphitheater"],
 "MKT":["market","food hall","shopping","outlet","marketplace","farmers market","antique"],
 "FAM":["kids","children","family","playground","character","interactive","zoo","aquarium"],
}
ODD_SRC={"ATLASOBSCURA","ROADSIDE"}
SPEAK_KW=["speakeasy","hidden bar","cocktail lounge","tiki bar","lounge"]
def collections(x, is_food):
    g=list(x.get("g",[]))
    hay=(x.get("n","")+" "+x.get("w","")+" "+x.get("k","")+" "+" ".join(x.get("cz",[]))).lower()
    if is_food:
        if any(k in hay for k in ["food hall","market","farmers market"]): g.append("MKT")
        if any(k in hay for k in SPEAK_KW): g.append("BAR")
    else:
        for cid,kws in KW.items():
            if any(k in hay for k in kws): g.append(cid)
        srcs={t[0] for t in x.get("sources",[])}
        if (srcs & ODD_SRC) or "oddit" in hay or "quirk" in hay or "hidden gem" in hay: g.append("ODD")
        if re.search(r'\bfree\b|no admission|free to (enter|visit)|free admission', hay): g.append("FREE")
        if any(k in hay for k in SPEAK_KW): g.append("BAR")
        if not g: g.append("HIST")
    out=[]
    for c in g:
        if c not in out: out.append(c)
    return out[:4]

# ---- source labels (filter chips) ----
SRC_LABEL={
 "MICHELIN":"MICHELIN","MICHELIN_STAR":"MICHELIN ★","MICHELIN_BIB":"MICHELIN BIB","JAMESBEARD":"JAMES BEARD",
 "ORLANDOSENTINEL":"ORLANDO SENTINEL","ORLANDOWEEKLY":"ORLANDO WEEKLY","ORLANDOMAG":"ORLANDO MAGAZINE",
 "EATER":"EATER","WMFE":"WMFE (NPR)","VISITORLANDO":"VISIT ORLANDO","NPS":"NATIONAL PARK SVC","NASA":"NASA",
 "FLSTATEPARKS":"FLORIDA STATE PARKS","OFFICIAL":"OFFICIAL SITE","WIKIPEDIA":"WIKIPEDIA","ATLASOBSCURA":"ATLAS OBSCURA",
 "THEMEPARKINSIDER":"THEME PARK INSIDER","DISNEYFOODBLOG":"DISNEY FOOD BLOG","INSIDETHEMAGIC":"INSIDE THE MAGIC",
 "TASTYCHOMPS":"TASTY CHOMPS","WFTV":"WFTV 9","WESH":"WESH 2","CLICKORLANDO":"NEWS 6 (WKMG)","FOX35":"FOX 35",
 "SPECTRUMNEWS13":"SPECTRUM NEWS 13","TIMEOUT":"TIME OUT","INFATUATION":"INFATUATION","USATODAY":"USA TODAY 10BEST",
 "YELP":"YELP","TRIPADVISOR":"TRIPADVISOR","GOOGLE":"GOOGLE","OPENTABLE":"OPENTABLE",
}
ALIAS={"SENTINEL":"ORLANDOSENTINEL","ORLANDO_SENTINEL":"ORLANDOSENTINEL","ORLANDOMAGAZINE":"ORLANDOMAG",
       "ORLWEEKLY":"ORLANDOWEEKLY","VISITORLANDOCOM":"VISITORLANDO","FLORIDASTATEPARKS":"FLSTATEPARKS",
       "WDW":"OFFICIAL","DISNEY":"OFFICIAL","UNIVERSAL":"OFFICIAL","DFB":"DISNEYFOODBLOG","TPI":"THEMEPARKINSIDER",
       "MICHELINGUIDE":"MICHELIN","NEWS6":"CLICKORLANDO","WKMG":"CLICKORLANDO"}
def canon(k): return ALIAS.get(k,k)

srcmeta={}
for path in sorted(glob.glob(os.path.join(D,"SOURCES_*.json"))):
    try: d=json.load(open(path, encoding="utf-8"))
    except Exception: continue
    for o in (d.get("outlets", []) if isinstance(d, dict) else d or []):
        if isinstance(o, dict) and o.get("key"):
            srcmeta.setdefault(canon(o["key"]), {"key":canon(o["key"]),"name":o.get("name",o["key"]),"url":o.get("url","")})
for path in sorted(glob.glob(os.path.join(D,"CREATORS*.json"))):
    try: d=json.load(open(path, encoding="utf-8"))
    except Exception: continue
    for c in (d.get("creators",[]) if isinstance(d,dict) else []):
        if c.get("key"): srcmeta.setdefault(canon(c["key"]), {"key":canon(c["key"]),"name":c.get("name",c["key"]),"url":c.get("url","")})

# places found permanently closed AND non-notable during fact-check — never re-add (notable closures stay flagged)
EXCLUDE=set()
sights=[]; food=[]; seen_names=set()
def _key(n): return re.sub(r"[^a-z0-9]","",n.lower().replace("— closed",""))
def _take(x, bucket):
    n=x.get("n")
    if not n or n in EXCLUDE: return
    k=_key(n)
    if k in seen_names: return
    seen_names.add(k); bucket.append(x)
for path in sorted(glob.glob(os.path.join(D,"*.json"))):
    base=os.path.basename(path)
    if base.startswith(("_","out_","orl_","geo_","CREATORS","SOURCES_")) or "dataset" in base: continue
    d=json.load(open(path, encoding="utf-8"))
    if isinstance(d, list):
        for x in d: _take(x, food)
    else:
        for s in d.get('sources',[]): srcmeta.setdefault(canon(s['key']),s)
        for x in d.get('sights',[]): _take(x, sights)
        for x in d.get('food',[]):   _take(x, food)

def norm_sources(x):
    seen=[]; out=[]
    for t in x.get('sources',[]):
        k=canon(t[0]); pair=[k, t[1] if len(t)>1 else ""]
        if k in [p[0] for p in out]: continue   # one vote per outlet (OFFICIAL counts once)
        out.append(pair)
    return out

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
    if x.get("dish") and x["dish"].lower() not in x["w"].lower(): r["w"]=x["w"].rstrip()+" Order: "+x["dish"].rstrip(".")+"."
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

ids={a["id"] for a in AREAS}
bad=[r["n"] for r in P+F if r["a"] not in ids]
assert not bad, "unknown area code on: %s" % bad[:10]
out={"areas":AREAS,"ac":AC,"cuisines":CUISINES,"cats":CATS,"P":P,"F":F,"S":S,"FS":FS}
json.dump(out,open(os.path.join(D,'orl_dataset.json'),'w',encoding="utf-8"),indent=1,ensure_ascii=False)
work=[{"n":r["n"],"addr":r["ad"],"a":r["a"]} for r in P+F]
json.dump(work,open(os.path.join(D,'orl_worklist.json'),'w',encoding="utf-8"),ensure_ascii=False,indent=0)
print("P(sights):",len(P)," F(food):",len(F)," total:",len(P)+len(F))
print("by area:",dict(Counter(r["a"] for r in P+F)))
print("cuisines:",dict(Counter(c for r in F for c in r["cz"])))
print("closed flagged:",[r["n"] for r in P+F if r.get("closed")] or "none")
print("wrote orl_dataset.json + orl_worklist.json")
