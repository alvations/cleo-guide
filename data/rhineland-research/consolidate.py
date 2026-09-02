#!/usr/bin/env python3
# Consolidate the Rhineland (Cologne · Bonn · Düsseldorf) research files into one normalized dataset.
# Region = the lower-Rhine metropolitan triangle: Köln/Cologne (DE) + Bonn (DE) + Düsseldorf (DE), on ONE
# map page. Same pipeline + gates as every guide. Dense as the SaarLorLux region.
import json, os, re, glob
from collections import Counter
D = os.path.dirname(os.path.abspath(__file__))

# ---- AREAS (the lower-Rhine triangle) ----
AREAS = [
 {"id":"KOLN","n":"Cologne / Köln (Dom · Altstadt · Ehrenfeld · Südstadt)"},
 {"id":"BONN","n":"Bonn (Beethoven · Museumsmeile · Bad Godesberg)"},
 {"id":"DUS","n":"Düsseldorf (Altstadt · Kö · MedienHafen · Little Tokyo)"},
 {"id":"RHEIN","n":"The Rhine Corridor (Brühl · Bergisch Gladbach · Leverkusen · Neuss · Zons)"},
]
AC = {"KOLN":"#C0504D","BONN":"#2E6DA4","DUS":"#E8973A","RHEIN":"#16A085"}

# ---- cuisine taxonomy — the Rhineland canon ----
CUISINES = [
 {"id":"GER","n":"Rhenish & German"},{"id":"BEER","n":"Kölsch, Altbier & Brauhaus"},
 {"id":"FINE","n":"Michelin & Fine Dining"},{"id":"JP","n":"Japanese & Little Tokyo"},
 {"id":"INT","n":"International & Immigrant"},{"id":"SWEET","n":"Bakeries, Konditorei & Sweets"},
 {"id":"CAFE","n":"Coffee & Café"},{"id":"VEG","n":"Vegan & Vegetarian"},
]
CMAP = {
 "German":"GER","Rhenish":"GER","Rheinisch":"GER","Regional":"GER","Deutsch":"GER","Kölsch":"GER","Rhineland":"GER",
 "Sauerbraten":"GER","Brauhaus":"BEER","Beer":"BEER","Bier":"BEER","Kölsch Beer":"BEER","Altbier":"BEER",
 "Brewpub":"BEER","Brewery":"BEER","Beer Garden":"BEER","Biergarten":"BEER",
 "Michelin":"FINE","Fine Dining":"FINE","Modern European":"FINE","Gastronomic":"FINE","Contemporary":"FINE","Fine":"FINE",
 "Japanese":"JP","Sushi":"JP","Ramen":"JP","Izakaya":"JP","Udon":"JP","Little Tokyo":"JP",
 "Italian":"INT","Turkish":"INT","Asian":"INT","Vietnamese":"INT","Thai":"INT","Korean":"INT","Chinese":"INT",
 "Mediterranean":"INT","Levantine":"INT","Middle Eastern":"INT","Indian":"INT","Spanish":"INT","Portuguese":"INT",
 "Bakery":"SWEET","Bäckerei":"SWEET","Konditorei":"SWEET","Pâtisserie":"SWEET","Patisserie":"SWEET","Confiserie":"SWEET",
 "Chocolate":"SWEET","Schokolade":"SWEET","Ice Cream":"SWEET","Eis":"SWEET","Dessert":"SWEET",
 "Coffee":"CAFE","Café":"CAFE","Cafe":"CAFE","Kaffee":"CAFE","Kaffeehaus":"CAFE","Specialty Coffee":"CAFE","Brunch":"CAFE",
 "Vegan":"VEG","Vegetarian":"VEG","Veggie":"VEG","Plant-based":"VEG",
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
      {"id":"MUS","n":"Museums & Galleries"},{"id":"RIVER","n":"The Rhine & Riverfront"},
      {"id":"PARK","n":"Parks & Gardens"},{"id":"MKT","n":"Markets & Squares"},
      {"id":"NIGHT","n":"Nightlife & Quarters"},{"id":"FREE","n":"Free to Visit"}]
KW={
 "ICON":["kölner dom","cologne cathedral","must-see","landmark","königsallee","medienhafen","rheinturm","hohenzollern","beethoven","drachenfels","altstadt"],
 "UNESCO":["unesco","world heritage","weltkulturerbe","kölner dom","cologne cathedral"],
 "HIST":["historic","heritage","medieval","roman","römisch","carolingian","beethoven","monument","memorial","old town","altstadt","denkmal"],
 "ARCH":["church","cathedral","dom","kirche","basilika","basilica","romanesque","romanisch","chapel","kapelle","castle","schloss","burg","palace","palais","rathaus","town hall","synagogue","abbey","abtei"],
 "MUS":["museum","musée","gallery","galerie","art","kunst","ludwig","wallraf","richartz","römisch-germanisch","schokolade","kolumba","k20","k21","bundeskunsthalle","haus der geschichte","beethoven-haus"],
 "RIVER":["rhine","rhein","rheinufer","rheinpromenade","riverfront","hafen","medienhafen","rheinauhafen","kaiser","promenade","boat"],
 "PARK":["park","garten","garden","rheinaue","stadtgarten","volksgarten","botanic","botanisch","hofgarten","poppelsdorf","forstbotanisch","grüngürtel","see","lake"],
 "MKT":["markt","market","alter markt","heumarkt","carlsplatz","wochenmarkt","weihnachtsmarkt","christmas market","square","platz"],
 "NIGHT":["nightlife","nachtleben","viertel","quarter","belgisches viertel","ehrenfeld","kwartier","longest bar","altstadt","bar","pub","kneipe","club","zülpicher"],
}
def collections(x, is_food):
    g=list(x.get("g",[]))
    hay=(x.get("n","")+" "+x.get("w","")+" "+x.get("k","")+" "+" ".join(x.get("cz",[]))).lower()
    if is_food:
        if any(k in hay for k in ["markt","market","carlsplatz","wochenmarkt","weihnachtsmarkt"]): g.append("MKT")
    else:
        for cid,kws in KW.items():
            if any(k in hay for k in kws): g.append(cid)
        if re.search(r'\bfree\b|kostenlos|frei zugäng|gratis|free admission|no admission', hay): g.append("FREE")
        if not g: g.append("HIST")
    out=[]
    for c in g:
        if c not in out: out.append(c)
    return out[:4]

# ---- source metadata (labels for filter chips) ----
SRC_LABEL={
 "MICHELIN":"MICHELIN","GAULTMILLAU":"GAULT&MILLAU","UNESCO":"UNESCO","WIKIPEDIA":"WIKIPEDIA","OFFICIAL":"OFFICIAL SITE",
 "KSTA":"KÖLNER STADT-ANZEIGER","EXPRESS":"EXPRESS KÖLN","KOELNTOURISMUS":"KÖLN TOURISMUS","WDR":"WDR",
 "RP":"RHEINISCHE POST","DUSTOURISMUS":"DÜSSELDORF TOURISMUS","ANTENNEDUS":"ANTENNE DÜSSELDORF",
 "GA":"GENERAL-ANZEIGER BONN","BONNTOURISMUS":"BONN TOURISMUS","KStA":"KÖLNER STADT-ANZEIGER",
 "DW":"DW TRAVEL","RS":"RICK STEVES","ATLASOBSCURA":"ATLAS OBSCURA","LONELYPLANET":"LONELY PLANET","TIMEOUT":"TIME OUT",
 "FEINSCHMECKER":"DER FEINSCHMECKER","FALSTAFF":"FALSTAFF","GUSTO":"GUSTO","MITVERGNUEGEN":"MIT VERGNÜGEN",
 "COUPLEOFMEN":"COUPLE OF MEN","UNI":"UNIVERSITY/ESN","NATGEO":"NAT GEO",
 "YELP":"YELP","TRIPADVISOR":"TRIPADVISOR","GOOGLE":"GOOGLE","OPENTABLE":"OPENTABLE",
}
ALIAS={"KOELNERSTADTANZEIGER":"KSTA","KOELNER_STADT_ANZEIGER":"KSTA","STADTANZEIGER":"KSTA","RHEINISCHEPOST":"RP",
       "GENERALANZEIGER":"GA","GENERAL_ANZEIGER":"GA","GAULT_MILLAU":"GAULTMILLAU","DWTRAVEL":"DW","RICKSTEVES":"RS",
       "MITVERGNUGEN":"MITVERGNUEGEN","KOELN_TOURISMUS":"KOELNTOURISMUS"}
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

# ---- build unified records (two-layer dedup: exact + normalized name; near-dupes merge sources) ----
_DEDUP_STOP={'le','la','les','l','the','der','die','das','de','restaurant','ristorante','brauhaus',
             'cafe','café','zum','zur','im','am','and','of','a','d'}
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
