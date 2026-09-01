#!/usr/bin/env python3
# Consolidate the Aachen & the Dreiländereck (Euregio Maas-Rhein) research files into one normalized
# dataset. Region = a cross-border guide anchored on Aachen: the city + StädteRegion (DE) + the Eifel &
# Düren (DE) + Dutch South Limburg (NL: Maastricht, Vaals, Valkenburg) + Ostbelgien / German-speaking
# Belgium (BE: Eupen, Kelmis, the Hautes Fagnes). Same pipeline + gates as every guide.
import json, os, re, glob
from collections import Counter
D = os.path.dirname(os.path.abspath(__file__))

# ---- AREAS (cross-border Dreiländereck / Euregio Maas-Rhein) ----
AREAS = [
 {"id":"AACHEN","n":"Aachen (Dom · Altstadt · Burtscheid · RWTH)"},
 {"id":"STADT","n":"StädteRegion Aachen (Monschau · Stolberg · Kornelimünster)"},
 {"id":"EIFEL","n":"Eifel & Düren, DE (National Park · Nideggen · Jülich)"},
 {"id":"NL","n":"Dutch South Limburg (Maastricht · Vaals · Valkenburg)"},
 {"id":"BE","n":"Ostbelgien, BE (Eupen · Kelmis · Hautes Fagnes)"},
]
AC = {"AACHEN":"#2E6DA4","STADT":"#C0504D","EIFEL":"#6A8D3F","NL":"#E8973A","BE":"#8E44AD"}

# ---- cuisine taxonomy — the Aachen / tri-border canon ----
CUISINES = [
 {"id":"GER","n":"Rhenish & German"},{"id":"BE","n":"Belgian & Ostbelgien"},
 {"id":"NL","n":"Dutch & Limburgs"},{"id":"FINE","n":"Michelin & Fine Dining"},
 {"id":"BEER","n":"Beer & Brewpubs"},{"id":"SWEET","n":"Printen, Bakeries & Sweets"},
 {"id":"CAFE","n":"Coffee & Kaffeehaus"},{"id":"INT","n":"International & Student"},
]
CMAP = {
 "German":"GER","Rhenish":"GER","Rheinisch":"GER","Regional":"GER","Deutsch":"GER","Öcher":"GER","Aachener":"GER",
 "Eifel":"GER","Sauerbraten":"GER","Öcher Platt":"GER",
 "Belgian":"BE","Belgisch":"BE","Ostbelgien":"BE","Wallonian":"BE","Walloon":"BE","Liège":"BE","Flemish":"BE",
 "Dutch":"NL","Nederlands":"NL","Limburgs":"NL","Limburgish":"NL","Maastricht":"NL","Bourgondisch":"NL",
 "Michelin":"FINE","Fine Dining":"FINE","Modern European":"FINE","Gastronomic":"FINE","Contemporary":"FINE","Fine":"FINE",
 "Beer":"BEER","Brewpub":"BEER","Brewery":"BEER","Bier":"BEER","Beer Garden":"BEER","Biergarten":"BEER","Bräu":"BEER","Brasserie":"BEER",
 "Printen":"SWEET","Pâtisserie":"SWEET","Patisserie":"SWEET","Bakery":"SWEET","Bäckerei":"SWEET","Confiserie":"SWEET",
 "Chocolate":"SWEET","Schokolade":"SWEET","Ice Cream":"SWEET","Dessert":"SWEET","Vlaai":"SWEET","Reisfladen":"SWEET","Waffle":"SWEET",
 "Coffee":"CAFE","Café":"CAFE","Cafe":"CAFE","Kaffeehaus":"CAFE","Kaffee":"CAFE","Specialty Coffee":"CAFE","Koffie":"CAFE",
 "Italian":"INT","Turkish":"INT","Asian":"INT","Japanese":"INT","Sushi":"INT","Mediterranean":"INT","Vietnamese":"INT",
 "Indian":"INT","Vegetarian":"INT","Vegan":"INT","Levantine":"INT","Middle Eastern":"INT","Student":"INT","Burger":"INT",
}
def map_cz(raw):
    out=[]
    for c in raw:
        i=CMAP.get(c) or CMAP.get(c.strip())
        if i and i not in out: out.append(i)
    return out or ["GER"]

# ---- Collections (CATS) + keyword rules ----
CATS=[{"id":"ICON","n":"Iconic & Must-See"},{"id":"UNESCO","n":"UNESCO World Heritage"},
      {"id":"HIST","n":"History & Heritage"},{"id":"ARCH","n":"Churches, Castles & Rathaus"},
      {"id":"MUS","n":"Museums & Galleries"},{"id":"SPA","n":"Thermal Baths & Springs"},
      {"id":"PARK","n":"Parks & Nature"},{"id":"MKT","n":"Markets & Squares"},
      {"id":"NIGHT","n":"Nightlife & Quarters"},{"id":"FREE","n":"Free to Visit"}]
KW={
 "ICON":["aachener dom","aachen cathedral","must-see","landmark","rathaus aachen","vrijthof","porta","dreiländereck","drielandenpunt","elisenbrunnen"],
 "UNESCO":["unesco","world heritage","weltkulturerbe","aachener dom","aachen cathedral","palatine chapel","pfalzkapelle","werelderfgoed"],
 "HIST":["historic","heritage","medieval","roman","römisch","carolingian","karolingisch","charlemagne","karl der große","monument","memorial","old town","altstadt","binnenstad","vieille ville"],
 "ARCH":["church","cathedral","dom","kirche","basilika","basilica","chapel","kapelle","castle","schloss","kasteel","château","burg","citadel","fortress","festung","palace","palais","rathaus","town hall","stadhuis","abbey","abtei","propstei"],
 "MUS":["museum","musée","gallery","galerie","art","kunst","couven","ludwig forum","centre charlemagne","printen museum","bonnefanten"],
 "SPA":["therme","thermal","thermen","spa","carolus","bad ","kurpark","quelle","spring","elisenbrunnen","kaiserquelle","rosenquelle","bathhouse","kneipp"],
 "PARK":["park","garten","garden","tuin","nature","natur","trail","wanderweg","eifel","national park","nationalpark","hohes venn","hautes fagnes","forest","wald","viewpoint","aussicht","stausee","see","lake","rurstausee","dreiländereck"],
 "MKT":["markt","market","marché","square","platz","plein","vrijthof","münsterplatz","katschhof","wochenmarkt","covered market","elisenbrunnen"],
 "NIGHT":["nightlife","nachtleben","viertel","quarter","pontviertel","pontstrasse","student","bar","pub","club","kneipe","nightclub"],
}
def collections(x, is_food):
    g=list(x.get("g",[]))
    hay=(x.get("n","")+" "+x.get("w","")+" "+x.get("k","")+" "+" ".join(x.get("cz",[]))).lower()
    if is_food:
        if any(k in hay for k in ["markt","market","marché","wochenmarkt","covered market","vrijthof"]): g.append("MKT")
    else:
        for cid,kws in KW.items():
            if any(k in hay for k in kws): g.append(cid)
        if re.search(r'\bfree\b|kostenlos|frei zugäng|gratis|gratuit|free admission|no admission', hay): g.append("FREE")
        if not g: g.append("HIST")
    out=[]
    for c in g:
        if c not in out: out.append(c)
    return out[:4]

# ---- source metadata (labels for filter chips) ----
SRC_LABEL={
 "MICHELIN":"MICHELIN","GAULTMILLAU":"GAULT&MILLAU","UNESCO":"UNESCO","WIKIPEDIA":"WIKIPEDIA","OFFICIAL":"OFFICIAL SITE",
 "AZ":"AACHENER ZEITUNG","AN":"AACHENER NACHRICHTEN","WDR":"WDR LOKALZEIT","ROUTEAACHEN":"ROUTE AACHEN","AACHENTOURIST":"AACHEN TOURISTIK",
 "STAEDTEREGION":"STÄDTEREGION AACHEN","EIFELTOURISMUS":"EIFEL TOURISMUS","MONSCHAU":"MONSCHAU-TOURISTIK","NORDEIFEL":"NORDEIFEL TOURISTIK",
 "DW":"DW TRAVEL","RWTH":"RWTH AACHEN","ESNAACHEN":"ESN AACHEN","EUREGIO":"EUREGIO MAAS-RHEIN",
 "VISITMAASTRICHT":"VISIT MAASTRICHT","VVVMAASTRICHT":"VVV MAASTRICHT","DELIMBURGER":"DE LIMBURGER","L1":"1LIMBURG",
 "VISITZUIDLIMBURG":"VISIT ZUID-LIMBURG","MAASTRICHTUNI":"MAASTRICHT UNIVERSITY",
 "GRENZECHO":"GRENZ-ECHO","BRF":"BRF (OSTBELGIEN)","OSTBELGIEN":"OSTBELGIEN.EU","VISITWALLONIA":"VISIT WALLONIA","EUPEN":"EUPEN.BE",
 "ATLASOBSCURA":"ATLAS OBSCURA","RICKSTEVES":"RICK STEVES","LONELYPLANET":"LONELY PLANET","TIMEOUT":"TIME OUT","NATGEO":"NAT GEO",
 "YELP":"YELP","TRIPADVISOR":"TRIPADVISOR","GOOGLE":"GOOGLE","OPENTABLE":"OPENTABLE",
}
ALIAS={"AACHENERZEITUNG":"AZ","AACHENERNACHRICHTEN":"AN","GAULT_MILLAU":"GAULTMILLAU","DWTRAVEL":"DW",
       "ROUTE_AACHEN":"ROUTEAACHEN","1LIMBURG":"L1","VISIT_MAASTRICHT":"VISITMAASTRICHT","GRENZ_ECHO":"GRENZECHO",
       "OSTBELGIENEU":"OSTBELGIEN","BELGISCHERRUNDFUNK":"BRF"}
def canon(k): return ALIAS.get(k,k)

# ---- source & creator metadata from separate files (labels only) ----
srcmeta={}
for path in sorted(glob.glob(os.path.join(D,"SOURCES_*.json"))):
    try: d=json.load(open(path))
    except Exception: continue
    _outlets = (d.get("outlets", []) if isinstance(d, dict) else d) if d else []
    for o in _outlets:
        if isinstance(o, dict) and o.get("key"): srcmeta.setdefault(canon(o["key"]), {"key":canon(o["key"]),"name":o.get("name",o["key"]),"url":o.get("url","")})
for path in sorted(glob.glob(os.path.join(D,"CREATORS*.json"))):
    try: d=json.load(open(path))
    except Exception: continue
    for c in (d.get("creators",[]) if isinstance(d,dict) else []):
        if isinstance(c,dict) and c.get("key"): srcmeta.setdefault(canon(c["key"]), {"key":canon(c["key"]),"name":c.get("name",c["key"]),"url":c.get("url","")})

# ---- build unified records ----
# Dedup is two-layer: exact name, then a normalized key that collapses the same place written two ways
# across waves (parentheticals like "(Maastricht)", French/Dutch articles). Near-dupes MERGE: sources
# union into the first-seen record and the shorter (cleaner) name wins — never double-counted or stacked.
_DEDUP_STOP={'le','la','les','l','the','der','die','das','de','het','restaurant','ristorante','brasserie',
             'cafe','café','au','aux','and','of','a','d','t'}
def _norm_name(n):
    s=n.lower()
    s=re.sub(r'\(.*?\)','',s)
    s=s.replace('’',' ').replace("'",' ').replace('`',' ')
    s=re.sub(r'[^a-z0-9]+',' ',s)
    return ' '.join(t for t in s.split() if t and t not in _DEDUP_STOP)
sights=[]; food=[]; seen_names=set(); seen_norm={}
def _merge_sources(dst, src):
    have={(t[0], t[1] if len(t)>1 else '') for t in dst.get('sources',[])}
    for t in src.get('sources',[]):
        k=(t[0], t[1] if len(t)>1 else '')
        if k not in have: dst.setdefault('sources',[]).append(t); have.add(k)
def _take(x, bucket):
    n=x.get("n")
    if not n or n in seen_names: return
    key=_norm_name(n)
    if key and key in seen_norm:
        kept=seen_norm[key]
        _merge_sources(kept, x)
        if len(n) < len(kept["n"]): kept["n"]=n
        return
    seen_names.add(n)
    if key: seen_norm[key]=x
    bucket.append(x)
for path in sorted(glob.glob(os.path.join(D,"*.json"))):
    base=os.path.basename(path)
    if base.startswith(("_","out_","sr_","geo_","CREATORS","SOURCES_")) or "dataset" in base: continue
    d=json.load(open(path))
    if isinstance(d, list):
        for x in d: _take(x, food)
    else:
        for x in d.get('sights',[]): _take(x, sights)
        for x in d.get('food',[]):   _take(x, food)

def norm_sources(x):
    seen=[]; out=[]
    for t in x.get('sources',[]):
        k=canon(t[0]); pair=[k, t[1] if len(t)>1 else ""]; key=(pair[0],pair[1])
        if key in seen: continue
        seen.append(key); out.append(pair)
    return out

P=[]; F=[]; used_S=set(); used_F=set()
for x in sights:
    r={"t":int(x.get("t",2)),"a":x["a"],"n":x["n"],"ad":x["address"],"w":x["w"]}
    if x.get("k"): r["k"]=x["k"]
    if x.get("closed"): r["closed"]=True
    r["g"]=collections(x,False)
    r["s"]=norm_sources(x)
    for t in r["s"]: used_S.add(t[0])
    P.append(r)
for x in food:
    r={"t":int(x.get("t",2)),"a":x["a"],"n":x["n"],"ad":x["address"],"w":x["w"]}
    if x.get("k"): r["k"]=x["k"]
    if x.get("closed"): r["closed"]=True
    r["cz"]=map_cz(x.get("cz",[]))
    if x.get("michelin") and "FINE" not in r["cz"]: r["cz"].append("FINE")
    r["g"]=collections(x,True)
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
json.dump(out,open(os.path.join(D,'sr_dataset.json'),'w'),indent=1,ensure_ascii=False)
work=[{"n":r["n"],"addr":r["ad"],"a":r["a"]} for r in P+F]
json.dump(work,open(os.path.join(D,'sr_worklist.json'),'w'),ensure_ascii=False,indent=0)

print("P(sights):",len(P)," F(food):",len(F)," total:",len(P)+len(F))
print("Area coverage:",dict(Counter(r["a"] for r in P+F)))
print("Cuisine coverage:",dict(Counter(c for r in F for c in r["cz"])))
print("closed flagged:",[r["n"] for r in P+F if r.get("closed")] or "none")
print("wrote sr_dataset.json + sr_worklist.json")
