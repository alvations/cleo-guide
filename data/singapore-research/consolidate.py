#!/usr/bin/env python3
# Consolidate the Singapore + Southeast Asia research files into one normalized dataset.
# Region = Singapore towns (STARTING with Toa Payoh) + the major cities of Southeast Asia
# (Malaysia, Thailand, Vietnam, Indonesia, Philippines, and Indochina — Cambodia/Laos/Myanmar).
# Same pipeline + gates as the US cities; the ONLY differences are geography, the SEA food canon,
# and the pastel light/dark THEME (applied in tools/build-singapore.py, not here).
import json, os, re, glob
from collections import Counter
D = os.path.dirname(os.path.abspath(__file__))

# ---- AREAS ---------------------------------------------------------------------------------------
# Toa Payoh is its own area and the map's opening view (per the brief). Then the rest of Singapore
# grouped into readable town-clusters, then each SEA country as one filterable area (its cities are
# hundreds of km apart, so a country is the natural cluster + marker colour).
AREAS = [
 {"id":"TPY","n":"Toa Payoh"},
 {"id":"SGC","n":"Singapore Central (Marina Bay, Chinatown, Kampong Glam, Little India, Bugis, Orchard)"},
 {"id":"SGE","n":"Singapore East (Katong/Joo Chiat, Geylang, Bedok, Tampines, Changi)"},
 {"id":"SGWN","n":"Singapore West & North (Jurong, Bukit Timah, Holland V, Ang Mo Kio, Bishan, Woodlands)"},
 {"id":"MY","n":"Malaysia (KL, Penang, Malacca, Ipoh, JB)"},
 {"id":"TH","n":"Thailand (Bangkok, Chiang Mai, Phuket)"},
 {"id":"VN","n":"Vietnam (Ho Chi Minh City, Hanoi, Hoi An)"},
 {"id":"ID","n":"Indonesia (Jakarta, Bali, Yogyakarta)"},
 {"id":"PH","n":"Philippines (Manila, Cebu)"},
 {"id":"IC","n":"Indochina (Cambodia, Laos, Myanmar)"},
]
# Pastel marker palette — soft, distinguishable in both light and dark mode.
AC = {"TPY":"#F2A1A1","SGC":"#BCA7E6","SGE":"#84CBB9","SGWN":"#9CBEEC",
      "MY":"#EAC57C","TH":"#EDA6C7","VN":"#A9D48E","ID":"#F1B389","PH":"#AAB6EE","IC":"#8ED0D6"}

# ---- cuisine taxonomy ----------------------------------------------------------------------------
# The heart of any SEA food list is what is UNIQUE/signature to the region: Hainanese chicken rice,
# laksa, char kway teow, Hokkien mee, bak kut teh, nasi lemak, satay, roti prata, chilli crab, pho,
# banh mi, nasi padang, dim sum, kaya toast & kopi, chendol/durian. Tag the KITCHEN's tradition,
# never a single shared dish (chicken rice ≠ automatically Singaporean; categorise by the kitchen).
CUISINES = [
 {"id":"CHICKENRICE","n":"Hainanese Chicken Rice"},
 {"id":"LAKSA","n":"Laksa & Curry Noodles"},
 {"id":"NOODLE","n":"Wok Noodles (Char Kway Teow, Hokkien Mee, Bak Chor Mee)"},
 {"id":"BKT","n":"Bak Kut Teh & Soups"},
 {"id":"HAWKER","n":"Hawker & Zi Char"},
 {"id":"MALAY","n":"Malay & Nasi Padang"},
 {"id":"INDIAN","n":"Indian & Roti Prata"},
 {"id":"CHINESE","n":"Chinese, Dim Sum & Teochew"},
 {"id":"SEAFOOD","n":"Chilli Crab & Seafood"},
 {"id":"THAI","n":"Thai"},
 {"id":"VIET","n":"Vietnamese"},
 {"id":"INDO","n":"Indonesian, Satay & Rendang"},
 {"id":"FILIPINO","n":"Filipino"},
 {"id":"KHMER","n":"Khmer (Cambodian)"},
 {"id":"LAO","n":"Lao"},
 {"id":"BURMESE","n":"Burmese"},
 {"id":"PERANAKAN","n":"Peranakan / Nyonya"},
 {"id":"KOPI","n":"Kaya Toast, Kopitiam & Breakfast"},
 {"id":"DESSERT","n":"Chendol, Kueh & Durian"},
 {"id":"CAFE","n":"Cafés & Modern"},
 {"id":"VIRAL","n":"Viral / Social"},
]
CMAP = {
 "Hainanese Chicken Rice":"CHICKENRICE","Chicken Rice":"CHICKENRICE","Hainanese":"CHICKENRICE",
 "Laksa":"LAKSA","Curry Noodles":"LAKSA","Curry Mee":"LAKSA","Katong Laksa":"LAKSA","Curry Laksa":"LAKSA",
 "Char Kway Teow":"NOODLE","Hokkien Mee":"NOODLE","Bak Chor Mee":"NOODLE","Prawn Noodle":"NOODLE",
 "Wonton Noodle":"NOODLE","Wanton Mee":"NOODLE","Fishball Noodle":"NOODLE","Mee Pok":"NOODLE","Lor Mee":"NOODLE","Noodles":"NOODLE",
 "Bak Kut Teh":"BKT","Herbal Soup":"BKT","Soup":"BKT","Yong Tau Foo":"BKT",
 "Hawker":"HAWKER","Zi Char":"HAWKER","Cai Fan":"HAWKER","Economy Rice":"HAWKER","Tze Char":"HAWKER",
 "Malay":"MALAY","Nasi Lemak":"MALAY","Nasi Padang":"MALAY","Mee Rebus":"MALAY","Mee Siam":"MALAY","Satay":"MALAY","Nasi Goreng":"MALAY",
 "Indian":"INDIAN","Roti Prata":"INDIAN","Prata":"INDIAN","Biryani":"INDIAN","Banana Leaf":"INDIAN","Nasi Biryani":"INDIAN","South Indian":"INDIAN","North Indian":"INDIAN","Indian-Muslim":"INDIAN","Mamak":"INDIAN","Thosai":"INDIAN","Dosa":"INDIAN",
 "Chinese":"CHINESE","Dim Sum":"CHINESE","Cantonese":"CHINESE","Teochew":"CHINESE","Hokkien":"CHINESE","Hakka":"CHINESE","Roast Meats":"CHINESE","Char Siew":"CHINESE","Congee":"CHINESE","Fishball":"CHINESE","Chinese-Vietnamese":"CHINESE",
 "Seafood":"SEAFOOD","Chilli Crab":"SEAFOOD","Chili Crab":"SEAFOOD","Black Pepper Crab":"SEAFOOD","Crab":"SEAFOOD","Fish Head Curry":"SEAFOOD",
 "Thai":"THAI","Boat Noodles":"THAI","Tom Yum":"THAI","Isaan":"THAI","Pad Thai":"THAI","Mango Sticky Rice":"THAI",
 "Vietnamese":"VIET","Pho":"VIET","Banh Mi":"VIET","Bun Cha":"VIET","Vermicelli":"VIET",
 "Indonesian":"INDO","Rendang":"INDO","Padang":"INDO","Sate":"INDO","Satay (Indonesian)":"INDO","Bakso":"INDO","Nasi Campur":"INDO","Gudeg":"INDO","Babi Guling":"INDO","Balinese":"INDO",
 "Filipino":"FILIPINO","Adobo":"FILIPINO","Lechon":"FILIPINO","Sisig":"FILIPINO","Kapampangan":"FILIPINO","Cebuano":"FILIPINO","Kare-Kare":"FILIPINO",
 "Khmer":"KHMER","Cambodian":"KHMER","Amok":"KHMER","Fish Amok":"KHMER","Nom Banh Chok":"KHMER",
 "Lao":"LAO","Laotian":"LAO","Laap":"LAO","Larb":"LAO","Khao Soi (Lao)":"LAO","Or Lam":"LAO",
 "Burmese":"BURMESE","Myanmar":"BURMESE","Mohinga":"BURMESE","Shan":"BURMESE","Tea Leaf Salad":"BURMESE","Laphet":"BURMESE",
 "Peranakan":"PERANAKAN","Nyonya":"PERANAKAN","Baba":"PERANAKAN",
 "Kaya Toast":"KOPI","Kopitiam":"KOPI","Kopi":"KOPI","Breakfast":"KOPI","Toast":"KOPI","Soft-boiled Eggs":"KOPI",
 "Dessert":"DESSERT","Chendol":"DESSERT","Cendol":"DESSERT","Ice Kacang":"DESSERT","Kueh":"DESSERT","Durian":"DESSERT","Ice Cream":"DESSERT","Tau Huay":"DESSERT","Bakery":"DESSERT","Pastry":"DESSERT",
 "Cafe":"CAFE","Café":"CAFE","Coffee":"CAFE","Modern":"CAFE","Brunch":"CAFE","Fusion":"CAFE","Bar":"CAFE","Cocktails":"CAFE","Cocktail Bar":"CAFE","Western":"CAFE",
 "Viral":"VIRAL",
}
def map_cz(raw):
    out=[]
    for c in raw:
        i=CMAP.get(c) or CMAP.get(c.strip())
        if i and i not in out: out.append(i)
    return out or ["HAWKER"]

# ---- Collections (CATS) + keyword rules ----------------------------------------------------------
CATS=[{"id":"ICON","n":"Iconic & Must-See"},{"id":"HERITAGE","n":"Heritage & Culture"},
      {"id":"TEMPLE","n":"Temples, Mosques & Shrines"},{"id":"MKT","n":"Markets & Hawker Centres"},
      {"id":"PARK","n":"Parks, Gardens & Nature"},{"id":"MUS","n":"Museums & Galleries"},
      {"id":"VIEW","n":"Views & Skyline"},{"id":"ARCH","n":"Architecture & Landmarks"},
      {"id":"FAM","n":"Family & Kids"},{"id":"ODD","n":"Oddities & Hidden Gems"},
      {"id":"FREE","n":"Free to Visit"}]
KW={
 "ICON":["marina bay sands","merlion","gardens by the bay","petronas","grand palace","angkor","borobudur","ha long","supertree","esplanade","sentosa","wat arun","batu caves"],
 "HERITAGE":["heritage","conservation","shophouse","peranakan","kampong","old town","chinatown","little india","kampong glam","george town","hoi an old town","intramuros","colonial","unesco"],
 "TEMPLE":["temple","mosque","masjid","wat","pagoda","shrine","church","cathedral","buddha","hindu","gurdwara","monastery"],
 "MKT":["market","hawker","food centre","food court","bazaar","night market","wet market","pasar","warorot","ben thanh","chatuchak","damnoen"],
 "PARK":["park","garden","gardens","botanic","reservoir","nature reserve","hill","beach","island","waterfall","rice terrace","macritchie","southern ridges"],
 "MUS":["museum","gallery","art museum","national gallery","gallery singapore","gillman","gallery of"],
 "VIEW":["observation","skypark","view","skyline","tower","rooftop","deck","peak","2020","263"],
 "ARCH":["landmark","tower","bridge","architecture","colonial","art deco","raffles","building","hall","dome","monument","statue"],
 "FAM":["zoo","aquarium","bird","safari","science centre","universal studios","theme park","children","playground","dragon playground","sea aquarium","adventure"],
}
ODD_SRC={"ATLASOBSCURA"}
def collections(x, is_food):
    g=list(x.get("g",[]))
    hay=(x.get("n","")+" "+x.get("w","")+" "+x.get("k","")+" "+" ".join(x.get("cz",[]))).lower()
    if is_food:
        if any(k in hay for k in ["market","hawker","food centre","food court","bazaar","night market"]): g.append("MKT")
    else:
        for cid,kws in KW.items():
            if any(k in hay for k in kws): g.append(cid)
        srcs={t[0] for t in x.get("sources",[])}
        if (x.get("t")==3 and (srcs & ODD_SRC)) or "oddit" in hay or "quirk" in hay or "hidden gem" in hay:
            g.append("ODD")
        if re.search(r'\bfree\b|no admission|free to (enter|visit)|free admission', hay): g.append("FREE")
        if not g: g.append("HERITAGE")
    out=[]
    for c in g:
        if c not in out: out.append(c)
    return out[:4]

# ---- source metadata (labels for filter chips); synthesize for missing keys ----------------------
SRC_LABEL={
 "MICHELIN":"MICHELIN","MICHELIN_BIB":"MICHELIN BIB","MICHELIN_STAR":"MICHELIN ★","MICHELIN_GREEN":"MICHELIN GREEN",
 # Singapore
 "STRAITSTIMES":"THE STRAITS TIMES","CNA":"CHANNEL NEWS ASIA","TODAYSG":"TODAY","TIMEOUTSG":"TIME OUT SINGAPORE",
 "SETHLUI":"SETH LUI","EATBOOK":"EATBOOK","MISSTAMCHIAK":"MISS TAM CHIAK","DANIELFOOD":"DANIEL FOOD DIARY",
 "HUNGRYGOWHERE":"HUNGRYGOWHERE","SGMAGAZINE":"SG MAGAZINE","TATLERSG":"TATLER SINGAPORE","VISITSG":"VISIT SINGAPORE (STB)",
 "ROOTSSG":"ROOTS.GOV.SG (NHB)","NPARKS":"NPARKS","HDB":"HDB",
 # Malaysia
 "EATDRINKKL":"EAT DRINK KL","KLFOODIE":"KL FOODIE","TIMEOUTKL":"TIME OUT KL","PENANGFOODIE":"PENANG FOODIE","TOURISMMY":"TOURISM MALAYSIA",
 # Thailand
 "BKMAG":"BK MAGAZINE","TIMEOUTBKK":"TIME OUT BANGKOK","TATNEWS":"TAT (TOURISM THAILAND)",
 # Vietnam
 "VIETNAMCORACLE":"VIETNAM CORACLE","THEWORDVN":"VIETCETERA / THE WORD","VNEXPRESS":"VNEXPRESS",
 # Indonesia / Philippines / regional
 "TIMEOUTJKT":"TIME OUT JAKARTA","INDONESIATRAVEL":"WONDERFUL INDONESIA","SPOTPH":"SPOT.PH","GUIDETOPH":"GUIDE TO THE PHILIPPINES",
 # cross-region
 "CNN":"CNN TRAVEL","CNNTRAVEL":"CNN TRAVEL","LONELYPLANET":"LONELY PLANET","BBCTRAVEL":"BBC TRAVEL",
 "NYT":"NEW YORK TIMES","THEGUARDIAN":"THE GUARDIAN","EATER":"EATER","TIMEOUT":"TIME OUT",
 "ATLASOBSCURA":"ATLAS OBSCURA","WIKIPEDIA":"WIKIPEDIA","UNESCO":"UNESCO","OFFICIAL":"OFFICIAL SITE",
 "YELP":"YELP","TRIPADVISOR":"TRIPADVISOR","GOOGLE":"GOOGLE","OPENTABLE":"OPENTABLE",
}
ALIAS={"SETH_LUI":"SETHLUI","THESTRAITSTIMES":"STRAITSTIMES","STRAITS_TIMES":"STRAITSTIMES",
       "CHANNELNEWSASIA":"CNA","TIMEOUT_SG":"TIMEOUTSG","DANIELFOODDIARY":"DANIELFOOD",
       "VISITSINGAPORE":"VISITSG","EAT_DRINK_KL":"EATDRINKKL","CNN_TRAVEL":"CNNTRAVEL"}
def canon(k): return ALIAS.get(k,k)

# ---- source & creator metadata from the SEPARATE per-city files ----------------------------------
# The Asian cities keep their sources SEPARATE: each city writes its own SOURCES_<city>.json and
# CREATORS_<city>.json. We read them ALL here (globbed) purely for on-page labels/urls — the keys stay
# namespaced per city so they never collide, which is what "kept separate" means at the record level.
srcmeta={}
for path in sorted(glob.glob(os.path.join(D,"SOURCES_*.json"))):
    try: d=json.load(open(path))
    except Exception: continue
    for o in d.get("outlets", d if isinstance(d,list) else []):
        if o.get("key"): srcmeta.setdefault(canon(o["key"]), {"key":canon(o["key"]),"name":o.get("name",o["key"]),"url":o.get("url","")})
for path in sorted(glob.glob(os.path.join(D,"CREATORS*.json"))):
    try: d=json.load(open(path))
    except Exception: continue
    for c in (d.get("creators",[]) if isinstance(d,dict) else []):
        if c.get("key"):
            nm=c.get("name",c["key"])
            plat=c.get("platform"); nm=f"{nm} ({plat})" if plat and plat.lower() not in nm.lower() else nm
            srcmeta.setdefault(canon(c["key"]), {"key":canon(c["key"]),"name":nm,"url":c.get("url","")})

# ---- build unified records (generic: any research file in this dir) ------------------------------
EXCLUDE=set()
sights=[]; food=[]; seen_names=set()
def _take(x, bucket):
    n=x.get("n")
    if not n or n in seen_names or n in EXCLUDE: return
    seen_names.add(n); bucket.append(x)
for path in sorted(glob.glob(os.path.join(D,"*.json"))):
    base=os.path.basename(path)
    if base.startswith(("_","out_","sg_","geo_","CREATORS","SOURCES_")) or "dataset" in base: continue
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
json.dump(out,open(os.path.join(D,'sg_dataset.json'),'w'),indent=1,ensure_ascii=False)
work=[{"n":r["n"],"addr":r["ad"],"a":r["a"]} for r in P+F]
json.dump(work,open(os.path.join(D,'sg_worklist.json'),'w'),ensure_ascii=False,indent=0)

print("P(sights):",len(P)," F(food):",len(F)," total:",len(P)+len(F))
print("Area coverage:",dict(Counter(r["a"] for r in P+F)))
print("Cuisine coverage (food):",dict(Counter(c for r in F for c in r["cz"])))
print("closed flagged:",[r["n"] for r in P+F if r.get("closed")] or "none")
print("wrote sg_dataset.json + sg_worklist.json")
