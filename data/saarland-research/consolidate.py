#!/usr/bin/env python3
# Consolidate the Saarbrücken & Greater Region (SaarLorLux) research files into one normalized dataset.
# Region = a cross-border guide anchored on Saarbrücken: Saarland (DE) + French Moselle/Lorraine (FR) +
# Luxembourg (LU) + the German Mosel & Trier (DE). Same pipeline + gates as every guide.
import json, os, re, glob
from collections import Counter
D = os.path.dirname(os.path.abspath(__file__))

# ---- AREAS (cross-border) ----
AREAS = [
 {"id":"SAAR","n":"Saarland (Saarbrücken · Völklingen · Saarschleife)"},
 {"id":"MOSELLE","n":"Moselle & Lorraine, FR (Metz · Sarreguemines)"},
 {"id":"LUX","n":"Luxembourg (Luxembourg City · Moselle · Vianden)"},
 {"id":"MOSEL","n":"Mosel & Trier, DE (Roman Trier · Riesling villages)"},
 {"id":"ALSACE","n":"Alsace, FR (Strasbourg · the Rhine)"},
]
AC = {"SAAR":"#2E6DA4","MOSELLE":"#C0504D","LUX":"#16A085","MOSEL":"#8E44AD","ALSACE":"#E8973A"}

# ---- cuisine taxonomy — the Greater-Region canon ----
CUISINES = [
 {"id":"GER","n":"Saarländisch & German"},{"id":"FR","n":"French & Lorraine"},
 {"id":"LUX","n":"Luxembourgish"},{"id":"WINE","n":"Mosel Wine & Weinstuben"},
 {"id":"FINE","n":"Michelin & Fine Dining"},{"id":"BEER","n":"Beer & Brewpubs"},
 {"id":"SWEET","n":"Bakeries, Pâtisserie & Sweets"},{"id":"INT","n":"International & Other"},
]
CMAP = {
 "Saarländisch":"GER","German":"GER","Regional":"GER","Deutsch":"GER","Hoorische":"GER","Dibbelabbes":"GER",
 "French":"FR","Lorraine":"FR","Alsatian":"FR","Français":"FR",
 "Luxembourgish":"LUX","Luxembourgeois":"LUX","Lëtzebuergesch":"LUX",
 "Wine":"WINE","Mosel":"WINE","Riesling":"WINE","Weinstube":"WINE","Winery":"WINE","Vineyard":"WINE","Crémant":"WINE",
 "Michelin":"FINE","Fine Dining":"FINE","Modern European":"FINE","Gastronomic":"FINE","Contemporary":"FINE",
 "Beer":"BEER","Brewpub":"BEER","Brewery":"BEER","Bière":"BEER","Beer Garden":"BEER","Biergarten":"BEER",
 "Pâtisserie":"SWEET","Patisserie":"SWEET","Bakery":"SWEET","Confiserie":"SWEET","Chocolate":"SWEET","Ice Cream":"SWEET","Dessert":"SWEET",
 "Japanese":"INT","Italian":"INT","Mediterranean":"INT","Roman":"INT","Asian":"INT","Sushi":"INT","Portuguese":"INT",
}
def map_cz(raw):
    out=[]
    for c in raw:
        i=CMAP.get(c) or CMAP.get(c.strip())
        if i and i not in out: out.append(i)
    return out or ["GER"]

# ---- Collections (CATS) + keyword rules ----
CATS=[{"id":"ICON","n":"Iconic & Must-See"},{"id":"UNESCO","n":"UNESCO World Heritage"},
      {"id":"HIST","n":"History & Heritage"},{"id":"ARCH","n":"Churches, Castles & Architecture"},
      {"id":"MUS","n":"Museums & Galleries"},{"id":"CRAFT","n":"Wine, Faïence & Craft"},
      {"id":"PARK","n":"Parks & Nature"},{"id":"MKT","n":"Markets & Squares"},
      {"id":"NIGHT","n":"Nightlife & Quarters"},{"id":"FREE","n":"Free to Visit"}]
KW={
 "ICON":["völklinger","porta nigra","saarschleife","fortification","casemates","bock","landmark 81","must-see","cathédrale saint-étienne","pompidou"],
 "UNESCO":["unesco","world heritage","völklinger hütte","roman monument","porta nigra","kaiserthermen","konstantinbasilika","amphitheater","fortifications of luxembourg","old town of luxembourg","echternach"],
 "HIST":["historic","heritage","medieval","roman","römisch","1416","abbey","abtei","monument","national","memorial","old town","altstadt","vieille ville"],
 "ARCH":["church","cathedral","dom","basilika","basilique","temple","chapel","castle","schloss","château","burg","citadel","citadelle","fortress","palace","palais","abbey","art deco","byzantine"],
 "MUS":["museum","musée","gallery","galerie","art","faïence","faience","kunst","pompidou","mudam"],
 "CRAFT":["wine","weingut","weinstube","vineyard","riesling","winery","crémant","faïence","faience","villeroy","boch","ceramic","glass","forge","distillery","brewery"],
 "PARK":["park","garten","garden","jardin","nature","trail","wanderweg","mullerthal","treetop","baumwipfelpfad","saarschleife","viewpoint","aussicht","promenade","river","lake","see"],
 "MKT":["markt","market","marché","square","platz","place","wochenmarkt","bauernmarkt","marché couvert","covered market"],
 "NIGHT":["nightlife","nachtleben","viertel","quarter","quartier","rives de clausen","grund","clausen","nauwieser","bar","pub","student"],
}
ODD_SRC=set()
def collections(x, is_food):
    g=list(x.get("g",[]))
    hay=(x.get("n","")+" "+x.get("w","")+" "+x.get("k","")+" "+" ".join(x.get("cz",[]))).lower()
    if is_food:
        if any(k in hay for k in ["markt","market","marché","wochenmarkt","covered market"]): g.append("MKT")
    else:
        for cid,kws in KW.items():
            if any(k in hay for k in kws): g.append(cid)
        if re.search(r'\bfree\b|kostenlos|frei zugäng|gratuit|free admission|no admission', hay): g.append("FREE")
        if not g: g.append("HIST")
    out=[]
    for c in g:
        if c not in out: out.append(c)
    return out[:4]

# ---- source metadata (labels for filter chips) ----
SRC_LABEL={
 "MICHELIN":"MICHELIN","GAULTMILLAU":"GAULT&MILLAU","UNESCO":"UNESCO","WIKIPEDIA":"WIKIPEDIA","OFFICIAL":"OFFICIAL SITE",
 "SAARBRUECKERZEITUNG":"SAARBRÜCKER ZEITUNG","SR":"SR (SAARLAND)","VOLKSFREUND":"TRIER. VOLKSFREUND","DW":"DW TRAVEL",
 "REPUBLICAINLORRAIN":"RÉPUBLICAIN LORRAIN","FRANCEBLEU":"FRANCE BLEU","INSPIREMETZ":"INSPIRE METZ","MOSL":"MOSELLE TOURISME",
 "LUXTIMES":"LUXEMBOURG TIMES","LUXEMBURGERWORT":"LUXEMBURGER WORT","TAGEBLATT":"TAGEBLATT","VISITLUXEMBOURG":"VISIT LUXEMBOURG",
 "VISITPA":"VISIT PA","URLAUBSAARLAND":"TOURISMUS SAARLAND","MOSELLANDTOURISTIK":"MOSELLAND TOURISTIK","KACHEN":"KACHEN",
 "PUDLOWSKI":"GILLES PUDLOWSKI","PAPERJAM":"PAPERJAM","ELLELU":"ELLE.LU","QUATTROPOLE":"QUATTROPOLE",
 "YELP":"YELP","TRIPADVISOR":"TRIPADVISOR","GOOGLE":"GOOGLE","OPENTABLE":"OPENTABLE",
}
ALIAS={"SAARBRUCKERZEITUNG":"SAARBRUECKERZEITUNG","LEREPUBLICAINLORRAIN":"REPUBLICAINLORRAIN",
       "LUXEMBOURGTIMES":"LUXTIMES","WORT":"LUXEMBURGERWORT","GAULT_MILLAU":"GAULTMILLAU","DWTRAVEL":"DW"}
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
sights=[]; food=[]; seen_names=set()
def _take(x, bucket):
    n=x.get("n")
    if not n or n in seen_names: return
    seen_names.add(n); bucket.append(x)
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
    # a Michelin-tagged place also gets the FINE bucket so the fine-dining filter surfaces it
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
