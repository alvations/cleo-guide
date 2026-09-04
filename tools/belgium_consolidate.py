#!/usr/bin/env python3
# belgium_consolidate.py — shared consolidator for the four Belgian dataset cities (Antwerp · Ghent ·
# Brussels · Bruges). Each city has its own research dir (data/<city>-research/) with a thin consolidate.py
# wrapper that calls build(D, AREAS, AC): this module holds the ONE Belgium cuisine taxonomy, the sight
# collection rules (Dutch/French/English keywords), the two-layer dedup and the source-table logic so all
# four cities stay consistent. Beer is a first-class grouped cuisine (BEER) — a required layer per the brief.
# Mirrors data/aachen-research/consolidate.py exactly in structure; only the taxonomy/keywords differ.
import json, os, re, glob
from collections import Counter

# ---- cuisine taxonomy — the Belgian canon (shared across all four cities) ----
CUISINES = [
 {"id":"BEL","n":"Belgian & Flemish"},{"id":"FR","n":"French & Brasserie"},
 {"id":"BEER","n":"Beer & Breweries"},{"id":"SWEET","n":"Chocolate, Waffles & Sweets"},
 {"id":"FINE","n":"Michelin & Fine Dining"},{"id":"CAFE","n":"Café & Brown Café"},
 {"id":"SEA","n":"North Sea & Seafood"},{"id":"VEG","n":"Vegetarian & Vegan"},
 {"id":"INT","n":"International & Student"},
]
CMAP = {
 "Belgian":"BEL","Belgisch":"BEL","Flemish":"BEL","Vlaams":"BEL","Vlaamse":"BEL","Regional":"BEL","Local":"BEL",
 "Antwerp":"BEL","Antwerpen":"BEL","Ghent":"BEL","Gentse":"BEL","Bruges":"BEL","Brugse":"BEL","Brussels":"BEL",
 "French":"FR","Frans":"FR","Français":"FR","Walloon":"FR","Waals":"FR","Brasserie":"FR","Bistro":"FR","Bistrot":"FR",
 "Beer":"BEER","Bier":"BEER","Beers":"BEER","Brewery":"BEER","Brouwerij":"BEER","Brasserie Beer":"BEER","Brewpub":"BEER",
 "Lambic":"BEER","Gueuze":"BEER","Geuze":"BEER","Kriek":"BEER","Trappist":"BEER","Abbey":"BEER","Abbey Ale":"BEER",
 "Witbier":"BEER","Saison":"BEER","Beer Bar":"BEER","Brown Cafe":"BEER","Bruin Cafe":"BEER","Bruine Kroeg":"BEER",
 "Michelin":"FINE","Fine Dining":"FINE","Fine":"FINE","Gastronomic":"FINE","Gastronomique":"FINE","Modern European":"FINE",
 "Contemporary":"FINE","Gault&Millau":"FINE","GaultMillau":"FINE","Haute Cuisine":"FINE","Tasting":"FINE",
 "Chocolate":"SWEET","Chocolatier":"SWEET","Praline":"SWEET","Pralines":"SWEET","Waffle":"SWEET","Waffles":"SWEET",
 "Wafel":"SWEET","Gaufre":"SWEET","Sweet":"SWEET","Sweets":"SWEET","Dessert":"SWEET","Patisserie":"SWEET",
 "Pâtisserie":"SWEET","Bakery":"SWEET","Bakkerij":"SWEET","Cuberdon":"SWEET","Neuzekes":"SWEET","Speculoos":"SWEET",
 "Ice Cream":"SWEET","Confiserie":"SWEET","Biscuit":"SWEET","Koek":"SWEET",
 "Cafe":"CAFE","Café":"CAFE","Coffee":"CAFE","Koffie":"CAFE","Specialty Coffee":"CAFE","Kaffee":"CAFE","Tearoom":"CAFE",
 "Wine":"FR","Wine Bar":"FR","Natural Wine":"FR","Vin":"FR","Wijn":"FR","Wijnbar":"FR",
 "Seafood":"SEA","Fish":"SEA","Vis":"SEA","North Sea":"SEA","Noordzee":"SEA","Mussels":"SEA","Moules":"SEA",
 "Moules-Frites":"SEA","Oysters":"SEA","Shrimp":"SEA","Garnaal":"SEA","Poisson":"SEA","Fruits de Mer":"SEA",
 "Vegetarian":"VEG","Vegan":"VEG","Veg":"VEG","Vegetarisch":"VEG","Plant-based":"VEG","Végétarien":"VEG",
 "Italian":"INT","Turkish":"INT","Asian":"INT","Japanese":"INT","Sushi":"INT","Mediterranean":"INT","Vietnamese":"INT",
 "Indian":"INT","Thai":"INT","Levantine":"INT","Middle Eastern":"INT","Moroccan":"INT","Congolese":"INT","African":"INT",
 "Student":"INT","Burger":"INT","Frituur":"BEL","Friture":"BEL","Frietjes":"BEL","Fries":"BEL","Chips":"BEL",
}
def map_cz(raw):
    out=[]
    for c in raw:
        i=CMAP.get(c) or CMAP.get(c.strip()) or CMAP.get(c.strip().title())
        if i and i not in out: out.append(i)
    return out or ["BEL"]

# ---- Collections (CATS) + keyword rules (Dutch / French / English) ----
CATS=[{"id":"ICON","n":"Iconic & Must-See"},{"id":"UNESCO","n":"UNESCO World Heritage"},
      {"id":"HIST","n":"History & Heritage"},{"id":"ARCH","n":"Churches, Belfries & Castles"},
      {"id":"MUS","n":"Museums & Galleries"},{"id":"CANAL","n":"Canals & Waterfront"},
      {"id":"PARK","n":"Parks & Nature"},{"id":"MKT","n":"Markets & Squares"},
      {"id":"NIGHT","n":"Nightlife & Quarters"},{"id":"FREE","n":"Free to Visit"}]
KW={
 "ICON":["must-see","landmark","iconic","grote markt","grand-place","grand place","belfry","belfort","gravensteen",
         "atomium","manneken","het steen","cathedral","kathedraal","markt","cogels-osylei","altarpiece","lam gods"],
 "UNESCO":["unesco","world heritage","werelderfgoed","patrimoine mondial","belfry","belfort","béguinage","begijnhof",
           "grand-place","grand place","plantin-moretus","flemish béguinages"],
 "HIST":["historic","heritage","medieval","middeleeuws","roman","romeins","monument","memorial","old town","binnenstad",
         "vieille ville","altstadt","guild house","gildehuis","fortress","citadel","battlefield","waterloo"],
 "ARCH":["church","cathedral","kathedraal","kerk","église","basilica","basiliek","chapel","kapel","belfry","belfort",
         "castle","kasteel","château","citadel","abbey","abdij","abbaye","town hall","stadhuis","hôtel de ville","béguinage","begijnhof"],
 "MUS":["museum","musée","gallery","galerie","art","kunst","mas","smak","msk","groeninge","magritte","fine arts",
        "schone kunsten","beaux-arts","rubenshuis","plantin-moretus","design museum","fomu","m hka"],
 "CANAL":["canal","gracht","reien","quay","kaai","graslei","korenlei","waterfront","harbour","haven","port","dock",
          "eilandje","riverside","leie","schelde","zenne","senne","reie"],
 "PARK":["park","parc","garden","tuin","jardin","nature","natuur","forest","bos","forêt","trail","viewpoint","uitzicht",
         "beach","strand","coast","kust","heath","heide","dunes","duinen","zoo"],
 "MKT":["markt","market","marché","square","plein","place","grote markt","grand-place","vrijdagmarkt","vismarkt",
        "flea market","vlooienmarkt","marolles","sablon","zavel","groentenmarkt"],
 "NIGHT":["nightlife","nachtleven","quarter","kwartier","wijk","quartier","patershol","zuid","overpoort","matongé",
          "bar","pub","club","kroeg","café","nightclub","student"],
}
def collections(x, is_food):
    g=list(x.get("g",[]))
    hay=(x.get("n","")+" "+x.get("w","")+" "+x.get("k","")+" "+" ".join(x.get("cz",[]))).lower()
    if is_food:
        if any(k in hay for k in ["markt","market","marché","vismarkt","groentenmarkt"]): g.append("MKT")
    else:
        for cid,kws in KW.items():
            if any(k in hay for k in kws): g.append(cid)
        if re.search(r'\bfree\b|gratis|gratuit|free admission|no admission|vrij toegang', hay): g.append("FREE")
        if not g: g.append("HIST")
    out=[]
    for c in g:
        if c not in out: out.append(c)
    return out[:4]

# ---- source metadata (short chip labels; falls back to KEY.upper()) ----
SRC_LABEL={
 "MICHELIN":"MICHELIN","MICHELINBE":"MICHELIN","GAULTMILLAU":"GAULT&MILLAU","UNESCO":"UNESCO","WIKIPEDIA":"WIKIPEDIA",
 "OFFICIAL":"OFFICIAL SITE","DESTANDAARD":"DE STANDAARD","STANDAARD":"DE STANDAARD","NIEUWSBLAD":"HET NIEUWSBLAD",
 "HLN":"HET LAATSTE NIEUWS","GAZET":"GAZET V. ANTWERPEN","GVA":"GAZET V. ANTWERPEN","BELANGVANLIMBURG":"BELANG V. LIMBURG",
 "VRT":"VRT NWS","VRTNWS":"VRT NWS","CULINAIRE":"CULINAIRE AMBIANCE","CULINAIREAMBIANCE":"CULINAIRE AMBIANCE",
 "VISITANTWERPEN":"VISIT ANTWERPEN","VISITGENT":"VISIT GENT","VISITBRUGES":"VISIT BRUGES","VISITBRUGGE":"VISIT BRUGGE",
 "VISITBRUSSELS":"VISIT.BRUSSELS","VISITFLANDERS":"VISIT FLANDERS","STADGENT":"STAD GENT","STADANTWERPEN":"STAD ANTWERPEN",
 "LESOIR":"LE SOIR","LALIBRE":"LA LIBRE","LADH":"LA DH","RTBF":"RTBF","BX1":"BX1","RESTOBE":"RESTO.BE",
 "BRUSSELSTIMES":"THE BRUSSELS TIMES","RICKSTEVES":"RICK STEVES","TIMEOUT":"TIME OUT","ATLASOBSCURA":"ATLAS OBSCURA",
 "LONELYPLANET":"LONELY PLANET","CNN":"CNN TRAVEL","NATGEO":"NAT GEO","CNTRAVELER":"CONDÉ NAST","DW":"DW TRAVEL",
 "CANTILLON":"CANTILLON","HALVEMAAN":"DE HALVE MAAN","DEKONINCK":"DE KONINCK","GRUUT":"GRUUT","ZYTHOS":"ZYTHOS",
 "TRAPPIST":"ITA TRAPPIST","CAMRA":"CAMRA","KULEUVEN":"KU LEUVEN","UGENT":"UGENT","UANTWERPEN":"UANTWERPEN",
 "ULB":"ULB","VUB":"VUB","ESN":"ESN","YELP":"YELP","TRIPADVISOR":"TRIPADVISOR","GOOGLE":"GOOGLE","OPENTABLE":"OPENTABLE",
}
ALIAS={"DE_STANDAARD":"DESTANDAARD","HET_NIEUWSBLAD":"NIEUWSBLAD","HETNIEUWSBLAD":"NIEUWSBLAD","HETLAATSTENIEUWS":"HLN",
       "GAZETVANANTWERPEN":"GAZET","VRT_NWS":"VRTNWS","LE_SOIR":"LESOIR","LA_LIBRE":"LALIBRE","VISIT_BRUSSELS":"VISITBRUSSELS",
       "GAULT_MILLAU":"GAULTMILLAU","GAULTMILLAUBE":"GAULTMILLAU","DEHALVEMAAN":"HALVEMAAN","MICHELIN_BE":"MICHELINBE",
       "THEBRUSSELSTIMES":"BRUSSELSTIMES","CONDENAST":"CNTRAVELER","CNNTRAVEL":"CNN","NATIONALGEOGRAPHIC":"NATGEO"}
def canon(k): return ALIAS.get(k,k)

def build(D, AREAS, AC):
    """Consolidate every research JSON in dir D into D/sr_dataset.json (+ sr_worklist.json).
    AREAS = [{"id","n"}...]; AC = {id: '#hex'}. All records must carry an "a" in AREAS."""
    _area_ids = {a["id"] for a in AREAS}

    # ---- source & creator metadata from separate files (labels only) ----
    srcmeta={}
    for path in sorted(glob.glob(os.path.join(D,"SOURCES_*.json"))):
        try: d=json.load(open(path))
        except Exception: continue
        _outlets = (d.get("outlets", []) if isinstance(d, dict) else d) if d else []
        for o in _outlets:
            if isinstance(o, dict) and o.get("key"):
                srcmeta.setdefault(canon(o["key"]), {"key":canon(o["key"]),"name":o.get("name",o["key"]),"url":o.get("url","")})
    for path in sorted(glob.glob(os.path.join(D,"CREATORS*.json"))):
        try: d=json.load(open(path))
        except Exception: continue
        for c in (d.get("creators",[]) if isinstance(d,dict) else []):
            if isinstance(c,dict) and c.get("key"):
                srcmeta.setdefault(canon(c["key"]), {"key":canon(c["key"]),"name":c.get("name",c["key"]),"url":c.get("url","")})

    # ---- two-layer dedup (exact name, then normalized key) ----
    _DEDUP_STOP={'le','la','les','l','the','der','die','das','de','het','een','restaurant','ristorante','brasserie',
                 'cafe','café','au','aux','and','en','of','a','d','t','bij','in','den'}
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
        if x.get("a") not in _area_ids: return  # only records for THIS city's areas
        key=_norm_name(n)
        if key and key in seen_norm:
            kept=seen_norm[key]; _merge_sources(kept, x)
            if len(n) < len(kept["n"]): kept["n"]=n
            return
        seen_names.add(n)
        if key: seen_norm[key]=x
        bucket.append(x)
    for path in sorted(glob.glob(os.path.join(D,"*.json"))):
        base=os.path.basename(path)
        if base.startswith(("_","out_","sr_","geo_","CREATORS","SOURCES_")) or "dataset" in base: continue
        try: d=json.load(open(path, encoding="utf-8"))
        except Exception as e:
            print("  !! skip unreadable", base, e); continue
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
    areas_present=[a for a in AREAS if any(r["a"]==a["id"] for r in P+F)]

    out={"areas":AREAS,"ac":AC,"cuisines":CUISINES,"cats":CATS,"P":P,"F":F,"S":S,"FS":FS}
    json.dump(out,open(os.path.join(D,'sr_dataset.json'),'w'),indent=1,ensure_ascii=False)
    work=[{"n":r["n"],"addr":r["ad"],"a":r["a"]} for r in P+F]
    json.dump(work,open(os.path.join(D,'sr_worklist.json'),'w'),ensure_ascii=False,indent=0)

    print("P(sights):",len(P)," F(food):",len(F)," total:",len(P)+len(F))
    print("Area coverage:",dict(Counter(r["a"] for r in P+F)))
    print("Cuisine coverage:",dict(Counter(c for r in F for c in r["cz"])))
    print("closed flagged:",[r["n"] for r in P+F if r.get("closed")] or "none")
    print("wrote sr_dataset.json + sr_worklist.json")
