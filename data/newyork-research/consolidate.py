#!/usr/bin/env python3
# Consolidate the 9 NYC research files into one normalized dataset:
# AREAS/AC, CUISINES (normalized), CATS (Collections), sights P, food F, source tables S/FS.
import json, os, re
D=os.path.dirname(os.path.abspath(__file__))
files=['MAN','BK','QNS','BX','SI','DAY']

AREAS=[{"id":"MAN","n":"Manhattan"},{"id":"BK","n":"Brooklyn"},{"id":"QNS","n":"Queens"},
       {"id":"BX","n":"The Bronx"},{"id":"SI","n":"Staten Island"},{"id":"DAY","n":"Day Trips"}]
AC={"MAN":"#C0504D","BK":"#4F81BD","QNS":"#9BBB59","BX":"#8064A2","SI":"#4BACC6","DAY":"#F79646"}

# ---- cuisine normalization: raw label -> id ; plus the CUISINES taxonomy (ordered) ----
CUISINES=[
 {"id":"PZ","n":"Pizza"},{"id":"IT","n":"Italian"},{"id":"JD","n":"Jewish Deli & Bagels"},
 {"id":"US","n":"American & Steakhouse"},{"id":"SEAF","n":"Seafood"},{"id":"MEX","n":"Mexican"},
 {"id":"LAT","n":"Latin American"},{"id":"CN","n":"Chinese"},{"id":"CANT","n":"Cantonese & Dim Sum"},
 {"id":"SICH","n":"Sichuan"},{"id":"TWN","n":"Taiwanese"},{"id":"VN","n":"Vietnamese"},
 {"id":"TH","n":"Thai"},{"id":"MY","n":"Malaysian"},{"id":"SG","n":"Singaporean"},
 {"id":"SEA","n":"Southeast Asian"},{"id":"IN","n":"Indian"},{"id":"HIM","n":"Himalayan"},
 {"id":"LK","n":"Sri Lankan"},{"id":"KR","n":"Korean"},{"id":"GRK","n":"Greek"},
 {"id":"ME","n":"Middle Eastern & Persian"},{"id":"EU","n":"European"},
 {"id":"DES","n":"Desserts & Bakeries"},{"id":"VIRAL","n":"Viral / Social"},
]
CMAP={
 "Pizza":"PZ","Italian":"IT","Italian-American":"IT","Pasta":"IT",
 "Jewish Deli":"JD","Deli":"JD","Jewish Appetizing":"JD","Kosher":"JD","Bagels":"JD",
 "American":"US","Southern":"US","Soul Food":"US","Farm-to-table":"US","Steakhouse":"US",
 "Sandwiches":"US","Hot Dogs":"US","Breakfast":"US","International":"US","Vegetarian":"US",
 "Seafood":"SEAF","Mexican":"MEX","Tacos":"MEX","Oaxacan":"MEX","Colombian":"LAT",
 "Chinese":"CN","Chinese-American":"CN","Shanghainese":"CN","Noodles":"CN",
 "Cantonese":"CANT","Dim Sum":"CANT","Sichuan":"SICH","Taiwanese":"TWN","Taiwanese-American":"TWN",
 "Vietnamese":"VN","Thai":"TH","Malaysian":"MY","Singaporean":"SG",
 "Indonesian":"SEA","Filipino":"SEA","Burmese":"SEA",
 "Indian":"IN","South Indian":"IN","Tibetan":"HIM","Himalayan":"HIM","Sri Lankan":"LK",
 "Korean":"KR","Greek":"GRK","Persian":"ME","Middle Eastern":"ME","Palestinian":"ME",
 "French":"EU","Dessert":"DES","Desserts":"DES","Bakery":"DES","Ice Cream":"DES",
 "Chocolate":"DES","Italian ices":"DES","Viral":"VIRAL",
}
def map_cz(raw):
    out=[]
    for c in raw:
        i=CMAP.get(c) or CMAP.get(c.strip())
        if i and i not in out: out.append(i)
    return out or ["US"]

# ---- Collections (CATS) + keyword rules ----
CATS=[{"id":"MUS","n":"Museums & Galleries"},{"id":"PARK","n":"Parks & Gardens"},
      {"id":"ICON","n":"Iconic Landmarks & Views"},{"id":"ARCH","n":"Architecture & History"},
      {"id":"MKT","n":"Markets & Food Halls"},{"id":"ARTS","n":"Performing Arts & Music"},
      {"id":"WATER","n":"Waterfront & Islands"},{"id":"FAM","n":"Family & Kids"},
      {"id":"ODD","n":"Oddities & Hidden Gems"},{"id":"FREE","n":"Free to Visit"}]
KW={
 "MUS":["museum","gallery","moma","collection","hall of fame","noguchi","frick","whitney","guggenheim","reliquary"],
 "PARK":["park","garden","botanic","greenbelt","conservancy","meadow","reservation","high line","arboretum","grounds for sculpture","wave hill"],
 "ICON":["empire state","statue of liberty","brooklyn bridge","times square","rockefeller","observation","observatory","unisphere","one world","top of","edge","summit","overlook","promenade","skyline","grand central","lighthouse","flatiron","top of the rock"],
 "ARCH":["cathedral","church","temple","synagogue","historic","landmark","mansion","house","cottage","fort","cemetery","heritage","art deco","tenement","manor","richmond town","castle","monument","memorial","brownstone"],
 "MKT":["market","food hall","smorgasburg","chelsea market","arthur avenue","essex","deli"],
 "ARTS":["theater","theatre","jazz","opera","lincoln center","apollo","playhouse","concert","symphony","carnegie hall","broadway","music hall"],
 "WATER":["beach","island","ferry","pier","riverfront","waterfront","bay","harbor","rockaway","coney","gantry","boathouse","promenade"],
 "FAM":["zoo","aquarium","carousel","science","children","amusement","luna park","coney island","playground","hall of science","moving image"],
}
ODD_SRC={"ATLASOBSCURA","UNTAPPED"}
def collections(x, is_food):
    g=[]
    hay=(x.get("n","")+" "+x.get("w","")+" "+x.get("k","")).lower()
    if is_food:
        # food only carries MKT (halls/markets) or VIRAL-adjacent; keep collections sight-focused
        if any(k in hay for k in ["market","food hall","smorgasburg","arthur avenue","essex market"]): g.append("MKT")
        return g
    for cid,kws in KW.items():
        if any(k in hay for k in kws): g.append(cid)
    srcs={t[0] for t in x.get("sources",[])}
    if (x.get("t")==3 and (srcs & ODD_SRC)) or "oddit" in hay or "quirk" in hay or "hidden" in hay:
        if "ODD" not in g: g.append("ODD")
    if re.search(r'\bfree\b|no admission|free to (enter|visit)', hay): g.append("FREE")
    if not g: g.append("ARCH")  # sensible default for an unmatched sight/landmark
    # de-dup, cap at 3 for tidiness (keep first)
    out=[]
    for c in g:
        if c not in out: out.append(c)
    return out[:3]

# ---- source metadata (labels for filter chips); synthesize for missing keys ----
SRC_LABEL={
 "MICHELIN_STAR":"MICHELIN ★","MICHELIN_BIB":"MICHELIN BIB","MICHELIN":"MICHELIN",
 "EATERNY":"EATER NY","EATER":"EATER NY","INFATUATION":"INFATUATION","TIMEOUT":"TIME OUT",
 "TIMEOUTNY":"TIME OUT","NYT":"NYT","ATLASOBSCURA":"ATLAS OBSCURA","UNTAPPED":"UNTAPPED NY",
 "NYCPARKS":"NYC PARKS","NYCGO":"NYC TOURISM","NYCTOURISM":"NYC TOURISM","WIKIPEDIA":"WIKIPEDIA",
 "TRIPADVISOR":"TRIPADVISOR","OFFICIAL":"OFFICIAL SITE","NPS":"NATIONAL PARK SVC","NYSPARKS":"NY STATE PARKS",
 "ILOVENY":"I LOVE NY","VISITNJ":"VISIT NJ","GOTHAMIST":"GOTHAMIST","YELP":"YELP","CORNER":"CORNER",
 "TIKTOK":"TIKTOK/SOCIAL","HOODLINE":"HOODLINE","ABC7":"ABC7 NY","METMUSEUM":"THE MET","HUDSONVALLEY":"HUDSON VALLEY",
 "NYSPARKS":"NY STATE PARKS","STORMKING":"STORM KING","DIAART":"DIA","WALKWAYORG":"WALKWAY","WESTPOINT":"WEST POINT",
 "GFS":"GROUNDS FOR SCULPTURE","PRINCETON":"PRINCETON","PARRISHART":"PARRISH","OLDWESTBURY":"OLD WESTBURY",
 "MONTAUKHS":"MONTAUK HS","WOLFFER":"WOLFFER","BROOKLYNPAPER":"BROOKLYN PAPER","DURYEAS":"DURYEA'S",
}
# alias merges (same k chip)
ALIAS={"TIMEOUTNY":"TIMEOUT","NYCTOURISM":"NYCGO","EATER":"EATERNY"}
def canon(k): return ALIAS.get(k,k)

# ---- build unified records ----
sights=[]; food=[]; srcmeta={}
for f in files:
    d=json.load(open(os.path.join(D,f+'.json')))
    for s in d.get('sources',[]): srcmeta.setdefault(s['key'],s)
    for x in d.get('sights',[]): sights.append(x)
    for x in d.get('food',[]): food.append(x)
for extra in ['EXTRA_michelin','EXTRA_cuisine','EXTRA_viral']:
    for x in json.load(open(os.path.join(D,extra+'.json'))): food.append(x)

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
json.dump(out,open(os.path.join(D,'nyc_dataset.json'),'w'),indent=1,ensure_ascii=False)

# worklist for geocoding + status
work=[{"n":r["n"],"addr":r["ad"],"a":r["a"]} for r in P+F]
json.dump(work,open(os.path.join(D,'nyc_worklist.json'),'w'),ensure_ascii=False,indent=0)

from collections import Counter
print("P(sights):",len(P)," F(food):",len(F)," total:",len(P)+len(F))
print("S keys:",len(S)," FS keys:",len(FS))
gc=Counter(c for r in P for c in r.get("g",[]))
print("Collections coverage (sights):",dict(gc))
czc=Counter(c for r in F for c in r["cz"])
print("Cuisine coverage (food):",dict(czc))
missG=[r["n"] for r in P if not r.get("g")]
print("sights w/o collection:",len(missG))
closed=[r["n"] for r in P+F if r.get("closed")]
print("closed flagged:",closed if closed else "none")
EOF_MARK=1
print("wrote nyc_dataset.json + nyc_worklist.json")
