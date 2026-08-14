#!/usr/bin/env python3
# Consolidate the San Francisco research files into one normalized dataset.
# Region = San Francisco proper + the northern Peninsula down to San Mateo, incl. the SFO corridor
# (Daly City, Brisbane, South SF, San Bruno, Millbrae, Burlingame, San Mateo) — bridging where the
# Silicon Valley guide edges out around Menlo Park/Redwood City. Mirrors the SV/NYC pipeline.
import json, os, re
D = os.path.dirname(os.path.abspath(__file__))

# ---- AREAS = SF neighborhoods grouped + the Peninsula/SFO corridor ----
AREAS = [
 {"id":"DTN","n":"Downtown, SoMa & Union Square"},
 {"id":"NECN","n":"Chinatown, North Beach & the Wharf"},
 {"id":"NOB","n":"Nob Hill, Russian Hill & Polk"},
 {"id":"NW","n":"Marina, Pacific Heights & Presidio"},
 {"id":"AVE","n":"Richmond, Sunset & Golden Gate Park"},
 {"id":"MIS","n":"Mission, Castro & Noe Valley"},
 {"id":"HAI","n":"Haight, Hayes Valley & Divisadero"},
 {"id":"SE","n":"Bayview, Dogpatch & the Southeast"},
 {"id":"PEN","n":"Peninsula & SFO (to San Mateo)"},
]
AC = {"DTN":"#E8973A","NECN":"#C0504D","NOB":"#8064A2","NW":"#4F81BD","AVE":"#4BACC6",
      "MIS":"#9BBB59","HAI":"#D16BA5","SE":"#7E8FC4","PEN":"#5AA469"}

# ---- cuisine taxonomy ----
# SF's food story: Cantonese/dim sum (the oldest Chinatown in North America), the Mission burrito &
# taqueria belt, North Beach Italian, Dungeness-crab/cioppino seafood, Tenderloin Vietnamese, the
# Bay Area's famous Burmese, sourdough, and the third-wave coffee it helped invent.
CUISINES = [
 {"id":"CANT","n":"Chinese & Dim Sum"},{"id":"VN","n":"Vietnamese"},
 {"id":"MX","n":"Mexican & Taqueria"},{"id":"IT","n":"Italian & Pizza"},
 {"id":"SEAF","n":"Seafood & Oysters"},{"id":"JP","n":"Japanese, Sushi & Ramen"},
 {"id":"KR","n":"Korean"},{"id":"SEA","n":"Southeast Asian"},{"id":"BURM","n":"Burmese"},
 {"id":"IN","n":"Indian & South Asian"},{"id":"US","n":"California & New American"},
 {"id":"BAKE","n":"Bakeries & Sourdough"},{"id":"COF","n":"Coffee & Cafés"},
 {"id":"DES","n":"Desserts & Ice Cream"},{"id":"BAR","n":"Bars & Cocktails"},
 {"id":"VIRAL","n":"Viral / Social"},
]
CMAP = {
 "Chinese":"CANT","Cantonese":"CANT","Dim Sum":"CANT","Hong Kong":"CANT","Sichuan":"CANT","Szechuan":"CANT",
 "Shanghainese":"CANT","Hunan":"CANT","Taiwanese":"CANT","Hot Pot":"CANT","Noodles":"CANT","Chinese-American":"CANT",
 "Vietnamese":"VN",
 "Mexican":"MX","Tacos":"MX","Taqueria":"MX","Cal-Mex":"MX","Oaxacan":"MX","Salvadoran":"MX","Latin American":"MX","Peruvian":"MX",
 "Italian":"IT","Pizza":"IT","Pasta":"IT","Sicilian":"IT",
 "Seafood":"SEAF","Oysters":"SEAF","Raw Bar":"SEAF",
 "Japanese":"JP","Sushi":"JP","Ramen":"JP","Izakaya":"JP","Omakase":"JP",
 "Korean":"KR","Korean BBQ":"KR",
 "Thai":"SEA","Filipino":"SEA","Indonesian":"SEA","Malaysian":"SEA","Singaporean":"SEA","Cambodian":"SEA","Lao":"SEA",
 "Burmese":"BURM",
 "Indian":"IN","South Indian":"IN","Pakistani":"IN","Nepali":"IN","Himalayan":"IN","Sri Lankan":"IN",
 "American":"US","Californian":"US","California":"US","New American":"US","Steakhouse":"US","Farm-to-table":"US",
 "Sandwiches":"US","Deli":"US","Breakfast":"US","Burgers":"US","Barbecue":"US","Soul Food":"US","Diner":"US","French":"US",
 "Ethiopian":"US","Mediterranean":"US","Middle Eastern":"US","Persian":"US","Greek":"US","Halal":"US",
 "Bakery":"BAKE","Sourdough":"BAKE","Pastry":"BAKE","Bread":"BAKE",
 "Coffee":"COF","Cafe":"COF","Café":"COF","Espresso":"COF",
 "Dessert":"DES","Desserts":"DES","Ice Cream":"DES","Chocolate":"DES","Gelato":"DES","Boba":"DES","Bubble Tea":"DES",
 "Bar":"BAR","Cocktails":"BAR","Cocktail Bar":"BAR","Wine Bar":"BAR","Brewery":"BAR","Pub":"BAR","Speakeasy":"BAR","Tiki":"BAR",
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
      {"id":"PARK","n":"Parks & Gardens"},{"id":"VIEW","n":"Views & Hikes"},
      {"id":"ARCH","n":"Architecture & History"},{"id":"ENT","n":"Nightlife, Music & Theatre"},
      {"id":"SHOP","n":"Shopping & Districts"},{"id":"FAM","n":"Family & Kids"},
      {"id":"WATER","n":"Waterfront & Piers"},{"id":"ODD","n":"Oddities & Hidden Gems"},
      {"id":"FREE","n":"Free to Visit"}]
KW={
 "ICON":["golden gate bridge","alcatraz","cable car","painted ladies","coit tower","lombard","ferry building","fisherman's wharf","pier 39","transamerica","full house","postcard row","chinatown gate"],
 "MUS":["museum","gallery","sfmoma","de young","legion of honor","exploratorium","academy of sciences","asian art","contemporary jewish","cartoon art","walt disney","glbt","beat museum","cable car museum","aquarium"],
 "PARK":["park","garden","gardens","presidio","golden gate park","dolores park","alamo square","botanical","conservatory of flowers","japanese tea garden","lands end","sutro","yerba buena","glen canyon","stern grove","open space"],
 "VIEW":["twin peaks","tank hill","bernal heights","corona heights","grand view","hawk hill","view","vista","overlook","lands end","sutro baths","baker beach","battery","grandview","mount davidson","sign hill","san bruno mountain","sweeney ridge"],
 "ARCH":["victorian","mission dolores","grace cathedral","saints peter and paul","palace of fine arts","cathedral","church","historic","landmark","ferry building","city hall","painted ladies","fort point","cliff house"],
 "ENT":["theater","theatre","club","music","venue","comedy","fillmore","warfield","castro theatre","great american music hall","bimbo","jazz","opera","symphony","nightlife"],
 "SHOP":["union square","hayes valley","ferry building marketplace","chinatown","haight street","valencia","fillmore street","market","japantown","ghirardelli square","westfield","stonestown"],
 "FAM":["zoo","aquarium","exploratorium","academy of sciences","musée mécanique","musee mecanique","cable car museum","carousel","playground","children","randall museum"],
 "WATER":["pier","wharf","embarcadero","ferry","marina","harbor","waterfront","aquatic park","fisherman's wharf","bay","crissy field","ocean beach","sausalito ferry"],
}
ODD_SRC={"ATLASOBSCURA"}
def collections(x, is_food):
    g=list(x.get("g",[]))
    hay=(x.get("n","")+" "+x.get("w","")+" "+x.get("k","")+" "+" ".join(x.get("cz",[]))).lower()
    if is_food:
        if any(k in hay for k in ["market","food hall","farmers market","public market","ferry building"]): g.append("MKT")
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
 "MICHELIN_STAR":"MICHELIN ★","MICHELIN_BIB":"MICHELIN BIB","MICHELIN":"MICHELIN","MICHELIN_GREEN":"MICHELIN GREEN STAR",
 "JAMESBEARD":"JAMES BEARD","INFATUATION":"INFATUATION","KQED":"KQED BAY AREA","EATERSF":"EATER SF","THRILLIST":"THRILLIST",
 "SFCHRON":"SF CHRONICLE","SFGATE":"SFGATE","SFSTANDARD":"SF STANDARD","HOODLINE":"HOODLINE","MISSIONLOCAL":"MISSION LOCAL",
 "SEVENXSEVEN":"7X7","BOLDITALIC":"THE BOLD ITALIC","TIMEOUT":"TIME OUT","SFTRAVEL":"SF TRAVEL","KToday":"KRON4",
 "KRON4":"KRON4","KTVU":"KTVU","NBCBAY":"NBC BAY AREA","ABC7":"ABC7 BAY AREA","LOCALNEWSMATTERS":"LOCAL NEWS MATTERS",
 "ATLASOBSCURA":"ATLAS OBSCURA","WIKIPEDIA":"WIKIPEDIA","TRIPADVISOR":"TRIPADVISOR","OFFICIAL":"OFFICIAL SITE",
 "NPS":"NATIONAL PARK SVC","CASTATEPARKS":"CA STATE PARKS","VISITCA":"VISIT CALIFORNIA","SFPARKS":"SF REC & PARK",
 "YELP":"YELP","OPENTABLE":"OPENTABLE DINERS' CHOICE","EATER":"EATER SF",
}
ALIAS={"EATER":"EATERSF","SFCHRONICLE":"SFCHRON","7X7":"SEVENXSEVEN"}
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
    if base.startswith(("_","out_","sf_","geo_")) or "dataset" in base: continue
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
json.dump(out,open(os.path.join(D,'sf_dataset.json'),'w'),indent=1,ensure_ascii=False)
work=[{"n":r["n"],"addr":r["ad"],"a":r["a"]} for r in P+F]
json.dump(work,open(os.path.join(D,'sf_worklist.json'),'w'),ensure_ascii=False,indent=0)

from collections import Counter
print("P(sights):",len(P)," F(food):",len(F)," total:",len(P)+len(F))
print("Collections coverage (sights):",dict(Counter(c for r in P for c in r.get("g",[]))))
print("Cuisine coverage (food):",dict(Counter(c for r in F for c in r["cz"])))
print("closed flagged:",[r["n"] for r in P+F if r.get("closed")] or "none")
print("wrote sf_dataset.json + sf_worklist.json")
