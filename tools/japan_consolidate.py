#!/usr/bin/env python3
# japan_consolidate.py — shared consolidator for the five Japan dataset maps (Tokyo · Kyoto · Osaka · Okinawa ·
# Hokkaido). Each map has its own research dir (data/<city>-research/) with a thin consolidate.py wrapper that
# calls build(D, AREAS, AC). Cloned from tools/belgium_consolidate.py — the build()/dedup/source-table logic is
# identical; only the taxonomy (Japanese food canon + regional layers: Kyō-ryōri, konamon, Okinawan, Hokkaido),
# the sight collections and the source labels differ.
import json, os, re, glob
from collections import Counter

# ---- cuisine taxonomy — the Japanese canon (shared across all five Japan maps) ----
# Tag the KITCHEN's own tradition / specialty, never a single shared dish. Regional canons (Kyō-ryōri,
# Osaka konamon, Okinawan/Ryūkyū, Hokkaido seafood & Ainu) each get their own layer so the filter surfaces them.
CUISINES = [
 {"id":"SUSHI","n":"Sushi & Kaisen-don"},{"id":"RAMEN","n":"Ramen & Tsukemen"},
 {"id":"NOODLE","n":"Soba & Udon"},{"id":"KAISEKI","n":"Kaiseki, Kyō-ryōri & Ryōtei"},
 {"id":"IZAKAYA","n":"Izakaya, Yakitori & Yokochō"},{"id":"TEMPURA","n":"Tempura, Tonkatsu & Agemono"},
 {"id":"KONAMON","n":"Okonomiyaki, Takoyaki & Kushikatsu"},{"id":"WAGYU","n":"Wagyu, Yakiniku & Sukiyaki"},
 {"id":"TEISHOKU","n":"Teishoku, Curry & Yōshoku"},{"id":"OKINAWA","n":"Okinawan & Ryūkyū"},
 {"id":"HOKKAIDO","n":"Hokkaido Seafood, Jingisukan & Ainu"},{"id":"TOFU","n":"Tofu, Shōjin & Vegetarian"},
 {"id":"SWEET","n":"Wagashi, Matcha & Sweets"},{"id":"CAFE","n":"Kissaten & Coffee"},
 {"id":"SAKE","n":"Sake, Awamori, Whisky & Bars"},{"id":"MKT","n":"Markets, Depachika & Street Food"},
 {"id":"FINE","n":"Michelin & Fine Dining"},{"id":"INT","n":"International & Fusion"},
]
CMAP = {
 "Sushi":"SUSHI","Sashimi":"SUSHI","Omakase":"SUSHI","Edomae":"SUSHI","Kaisen":"SUSHI","Kaisendon":"SUSHI","Kaisen-don":"SUSHI",
 "Conveyor Sushi":"SUSHI","Kaitenzushi":"SUSHI","Saba-zushi":"SUSHI","Oshizushi":"SUSHI","Unagi":"SUSHI","Eel":"SUSHI",
 "Ramen":"RAMEN","Tsukemen":"RAMEN","Tonkotsu":"RAMEN","Shoyu Ramen":"RAMEN","Miso Ramen":"RAMEN","Shio Ramen":"RAMEN",
 "Soba":"NOODLE","Udon":"NOODLE","Noodles":"NOODLE","Noodle":"NOODLE","Somen":"NOODLE","Kitsune Udon":"NOODLE","Nishin Soba":"NOODLE",
 "Kaiseki":"KAISEKI","Kyo-ryori":"KAISEKI","Kyoryori":"KAISEKI","Kyō-ryōri":"KAISEKI","Ryotei":"KAISEKI","Kappo":"KAISEKI",
 "Obanzai":"KAISEKI","Washoku":"KAISEKI","Japanese":"KAISEKI","Traditional Japanese":"KAISEKI","Yudofu":"TOFU",
 "Izakaya":"IZAKAYA","Yakitori":"IZAKAYA","Yokocho":"IZAKAYA","Yokochō":"IZAKAYA","Robatayaki":"IZAKAYA","Oden":"IZAKAYA",
 "Tachinomi":"IZAKAYA","Kushiyaki":"IZAKAYA","Gyoza":"IZAKAYA","Motsunabe":"IZAKAYA","Horumon":"IZAKAYA",
 "Tempura":"TEMPURA","Tonkatsu":"TEMPURA","Katsu":"TEMPURA","Karaage":"TEMPURA","Agemono":"TEMPURA","Kushiage":"TEMPURA",
 "Okonomiyaki":"KONAMON","Takoyaki":"KONAMON","Kushikatsu":"KONAMON","Konamon":"KONAMON","Monjayaki":"KONAMON","Monja":"KONAMON",
 "Wagyu":"WAGYU","Yakiniku":"WAGYU","Sukiyaki":"WAGYU","Shabu-shabu":"WAGYU","Shabu Shabu":"WAGYU","Kobe Beef":"WAGYU",
 "Teppanyaki":"WAGYU","Steak":"WAGYU","Gyukatsu":"WAGYU","Gyudon":"TEISHOKU",
 "Teishoku":"TEISHOKU","Curry":"TEISHOKU","Japanese Curry":"TEISHOKU","Yoshoku":"TEISHOKU","Yōshoku":"TEISHOKU","Omurice":"TEISHOKU",
 "Donburi":"TEISHOKU","Onigiri":"TEISHOKU","Diner":"TEISHOKU","Shokudo":"TEISHOKU","Hamburg":"TEISHOKU","Soup Curry":"HOKKAIDO",
 "Okinawan":"OKINAWA","Okinawa":"OKINAWA","Ryukyu":"OKINAWA","Ryūkyū":"OKINAWA","Okinawa Soba":"OKINAWA","Soki Soba":"OKINAWA",
 "Champuru":"OKINAWA","Chanpuru":"OKINAWA","Taco Rice":"OKINAWA","Rafute":"OKINAWA","Agu":"OKINAWA","Yaeyama Soba":"OKINAWA",
 "Miyako Soba":"OKINAWA","Sata Andagi":"OKINAWA","Blue Seal":"OKINAWA",
 "Hokkaido":"HOKKAIDO","Jingisukan":"HOKKAIDO","Genghis Khan":"HOKKAIDO","Crab":"HOKKAIDO","Kani":"HOKKAIDO","Uni":"HOKKAIDO",
 "Ikura":"HOKKAIDO","Ainu":"HOKKAIDO","Butadon":"HOKKAIDO","Zangi":"HOKKAIDO","Dairy":"HOKKAIDO","Scallop":"HOKKAIDO",
 "Seafood":"SUSHI","Fish":"SUSHI","Fugu":"FINE","Kaisendon Market":"MKT",
 "Tofu":"TOFU","Shojin":"TOFU","Shōjin":"TOFU","Shojin Ryori":"TOFU","Vegetarian":"TOFU","Vegan":"TOFU","Yuba":"TOFU",
 "Wagashi":"SWEET","Matcha":"SWEET","Sweets":"SWEET","Sweet":"SWEET","Dessert":"SWEET","Desserts":"SWEET","Mochi":"SWEET",
 "Dango":"SWEET","Taiyaki":"SWEET","Kakigori":"SWEET","Parfait":"SWEET","Bakery":"SWEET","Patisserie":"SWEET","Ice Cream":"SWEET",
 "Soft Serve":"SWEET","Yatsuhashi":"SWEET","Castella":"SWEET","Tea":"SWEET","Tea House":"SWEET","Teahouse":"SWEET",
 "Kissaten":"CAFE","Coffee":"CAFE","Cafe":"CAFE","Café":"CAFE","Specialty Coffee":"CAFE","Coffee Shop":"CAFE",
 "Sake":"SAKE","Awamori":"SAKE","Whisky":"SAKE","Whiskey":"SAKE","Bar":"SAKE","Cocktail":"SAKE","Cocktail Bar":"SAKE",
 "Brewery":"SAKE","Sake Brewery":"SAKE","Beer":"SAKE","Craft Beer":"SAKE","Distillery":"SAKE","Shochu":"SAKE","Wine":"SAKE",
 "Market":"MKT","Depachika":"MKT","Street Food":"MKT","Food Hall":"MKT","Shotengai":"MKT","Ekiben":"MKT","Konbini":"MKT",
 "Michelin":"FINE","Fine Dining":"FINE","Fine":"FINE","Tasting Menu":"FINE","Innovative":"FINE","French":"FINE","Modern":"FINE",
 "Italian":"INT","Chinese":"INT","Korean":"INT","Indian":"INT","Thai":"INT","Fusion":"INT","International":"INT","Burger":"INT",
 "Pizza":"INT","Nepali":"INT","Taiwanese":"INT","Western":"INT","American":"INT","Chanpon":"INT","Gyoza Chinese":"INT",
}
_CUIS_IDS = {c["id"] for c in CUISINES}
def map_cz(raw):
    out=[]
    for c in raw:
        # accept a token that is ALREADY a valid cuisine id (agents emit bare ids like "SUSHI"/"RAMEN"),
        # else map a human label via CMAP (exact / stripped / title-cased).
        i = (c.strip().upper() if c.strip().upper() in _CUIS_IDS else None) \
            or CMAP.get(c) or CMAP.get(c.strip()) or CMAP.get(c.strip().title())
        if i and i not in out: out.append(i)
    return out or ["KAISEKI"]

# ---- Collections (CATS) + keyword rules (English + romanized Japanese) ----
CATS=[{"id":"ICON","n":"Iconic & Must-See"},{"id":"UNESCO","n":"UNESCO World Heritage"},
      {"id":"TEMPLE","n":"Temples & Shrines"},{"id":"CASTLE","n":"Castles, Palaces & History"},
      {"id":"GARDEN","n":"Gardens & Teahouses"},{"id":"MUS","n":"Museums & Galleries"},
      {"id":"NATURE","n":"Nature, Parks & Coast"},{"id":"ONSEN","n":"Onsen & Sentō"},
      {"id":"MKT","n":"Markets & Shopping Streets"},{"id":"NIGHT","n":"Nightlife, Yokochō & Districts"},
      {"id":"POP","n":"Anime, Pop Culture & Oddities"},{"id":"VIEW","n":"Views & Observation Decks"},
      {"id":"FREE","n":"Free to Visit"}]
KW={
 "ICON":["must-see","landmark","iconic","senso-ji","sensoji","fushimi inari","kinkaku","kiyomizu","shibuya crossing",
         "skytree","tokyo tower","dotonbori","dōtonbori","osaka castle","shuri","churaumi","sapporo clock","odori"],
 "UNESCO":["unesco","world heritage","world cultural heritage","sekai isan","gusuku","shiretoko","nikko","nikkō"],
 "TEMPLE":["temple","-ji","shrine","jinja","taisha","jingu","jingū","tenmangu","pagoda","utaki","utaki","buddhist",
           "zen","hongan","inari","hachiman","torii"],
 "CASTLE":["castle","-jo","palace","gosho","villa","historic","heritage","samurai","ninja","machiya","old town",
           "preserved district","memorial","peace","battle","war","gusuku","residence","ruins","edo"],
 "GARDEN":["garden","teien","-en","tea house","teahouse","tea ceremony","moss","bamboo","rikugien","koishikawa",
           "kenroku","korakuen","sankeien"],
 "MUS":["museum","gallery","art","bijutsukan","hakubutsukan","digital art","teamlab","exhibition","aquarium","science"],
 "NATURE":["park","nature","mountain","mt.","lake","gorge","valley","forest","beach","island","cape","coast","falls",
           "waterfall","national park","trail","hike","flower","lavender","cherry blossom","sakura","koyo","momiji",
           "snorkel","reef","mangrove","caldera","volcano","marsh","wetland","drift ice"],
 "ONSEN":["onsen","sento","sentō","hot spring","bathhouse","ryokan","rotenburo","spa","jigokudani","ashiyu","foot bath"],
 "MKT":["market","ichiba","shotengai","shōtengai","arcade","shopping street","depachika","dori","nishiki","kuromon",
        "tsukiji","toyosu","makishi","nijo","nijō","morning market","asaichi","kappabashi","ameyoko"],
 "NIGHT":["nightlife","yokocho","yokochō","golden gai","kabukicho","kabukichō","susukino","pontocho","pontochō","gion",
          "hanamachi","geisha","maiko","shinsekai","izakaya alley","bar district","red light","entertainment district"],
 "POP":["anime","manga","ghibli","pokemon","pokémon","nintendo","otaku","akihabara","nakano broadway","maid","arcade",
        "game","character","kawaii","robot","retro","oddity","quirky","weird","figure","cosplay","themed"],
 "VIEW":["observation","observatory","view","viewpoint","lookout","skyline","tower","sky","deck","night view","yakei",
         "ropeway","panorama","summit"],
}
def collections(x, is_food):
    g=list(x.get("g",[]))
    hay=(x.get("n","")+" "+x.get("w","")+" "+x.get("k","")+" "+" ".join(x.get("cz",[]))).lower()
    if is_food:
        if any(k in hay for k in ["market","ichiba","depachika","yokocho","yokochō","shotengai"]): g.append("MKT")
    else:
        for cid,kws in KW.items():
            if any(k in hay for k in kws): g.append(cid)
        if re.search(r'\bfree\b|free admission|no admission|free entry|admission free', hay): g.append("FREE")
        if not g: g.append("CASTLE")
    out=[]
    for c in g:
        if c not in out: out.append(c)
    return out[:4]

# ---- source metadata (short chip labels; falls back to KEY.upper()) ----
SRC_LABEL={
 "MICHELIN":"MICHELIN","MICHELIN_BIB":"MICHELIN BIB","MICHELIN_STAR":"MICHELIN ★","MICHELIN_GREEN":"MICHELIN GREEN",
 "MICHELINJP":"MICHELIN","UNESCO":"UNESCO","BUNKACHO":"AGENCY FOR CULTURAL AFFAIRS","WIKIPEDIA":"WIKIPEDIA",
 "OFFICIAL":"OFFICIAL SITE","JNTO":"JNTO","GOTOKYO":"GO TOKYO","KYOTOTOURISM":"KYOTO CITY TOURISM",
 "OSAKAINFO":"OSAKA INFO","VISITOKINAWA":"VISIT OKINAWA","HOKKAIDOTOURISM":"HOKKAIDO TOURISM","ENV":"MINISTRY OF ENVIRONMENT",
 "TABELOGAWARD":"TABELOG AWARD","TABELOG100":"TABELOG HYAKUMEITEN","ASAHI":"ASAHI SHIMBUN","YOMIURI":"YOMIURI",
 "MAINICHI":"MAINICHI","NIKKEI":"NIKKEI","KYOTOSHIMBUN":"KYOTO SHIMBUN","RYUKYUSHIMPO":"RYUKYU SHIMPO",
 "OKINAWATIMES":"OKINAWA TIMES","HOKKAIDOSHIMBUN":"HOKKAIDO SHIMBUN","NHK":"NHK","JAPANTIMES":"THE JAPAN TIMES",
 "TIMEOUT":"TIME OUT","TIMEOUTTOKYO":"TIME OUT TOKYO","EATER":"EATER","INFATUATION":"THE INFATUATION",
 "LONELYPLANET":"LONELY PLANET","ATLASOBSCURA":"ATLAS OBSCURA","CNN":"CNN TRAVEL","NATGEO":"NAT GEO",
 "CNTRAVELER":"CONDÉ NAST","NYT":"NYT","BBC":"BBC TRAVEL","GUARDIAN":"THE GUARDIAN","JAPANGUIDE":"JAPAN-GUIDE",
 "TOKYOCHEAPO":"TOKYO CHEAPO","SAVORJAPAN":"SAVOR JAPAN","TASTEATLAS":"TASTEATLAS","WORLD50":"WORLD'S 50 BEST",
 "ASIA50":"ASIA'S 50 BEST","LETTERSTOTOKYO":"LETTERS FROM TOKYO","YELP":"YELP","TRIPADVISOR":"TRIPADVISOR",
 "GOOGLE":"GOOGLE","TABELOG":"TABELOG","RETTY":"RETTY","OPENTABLE":"OPENTABLE",
}
ALIAS={"MICHELIN_JP":"MICHELINJP","MICHELINGUIDE":"MICHELIN","JAPAN_TIMES":"JAPANTIMES","TIME_OUT":"TIMEOUT",
       "TIMEOUT_TOKYO":"TIMEOUTTOKYO","GO_TOKYO":"GOTOKYO","JAPAN_GUIDE":"JAPANGUIDE","JAPANGUIDECOM":"JAPANGUIDE",
       "TABELOG_AWARD":"TABELOGAWARD","TABELOG_100":"TABELOG100","HYAKUMEITEN":"TABELOG100","CONDENAST":"CNTRAVELER",
       "CNNTRAVEL":"CNN","NATIONALGEOGRAPHIC":"NATGEO","ATLAS_OBSCURA":"ATLASOBSCURA","LONELY_PLANET":"LONELYPLANET",
       "AGENCYFORCULTURALAFFAIRS":"BUNKACHO","BUNKA":"BUNKACHO","ASAHISHIMBUN":"ASAHI","YOMIURISHIMBUN":"YOMIURI",
       "THEJAPANTIMES":"JAPANTIMES","50BEST":"WORLD50","ASIAS50BEST":"ASIA50"}
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
    _DEDUP_STOP={'the','restaurant','cafe','café','and','of','a','honten','main','store','shop','branch','ten','ya','tei','no'}
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
