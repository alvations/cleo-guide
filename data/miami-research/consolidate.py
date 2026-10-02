#!/usr/bin/env python3
# Consolidate the Miami · Fort Lauderdale · Everglades research files into one normalized dataset.
# Region = Broward (Fort Lauderdale/Hollywood) → Miami-Dade (the city, the Beach, the Gables/Grove, South Dade)
# → the Glades edge (Everglades NP, Biscayne NP, Big Cypress / Tamiami Trail). Mirrors the NYC / DC pipeline:
# every *.json research file here is merged (arrays = food records; objects carry {sights,food,sources}).
# Deterministic — never hand-patch the dataset; edit research files and re-run.
import json, os, re, glob
from collections import Counter
D = os.path.dirname(os.path.abspath(__file__))

# Areas run north → south: Broward, the north Dade suburbs, the urban core, the Beach, the Gables/Grove/Key,
# South Dade's farm belt, then the two national parks + the Tamiami Trail. ids alphanumeric ≤5 chars.
AREAS = [
 {"id":"FTL",  "n":"Fort Lauderdale, Hollywood & Broward"},
 {"id":"NMIA", "n":"North Miami, Aventura, Sunny Isles & Miami Gardens"},
 {"id":"WYN",  "n":"Wynwood, Design District, Little Haiti & MiMo"},
 {"id":"DTB",  "n":"Downtown, Brickell & Overtown"},
 {"id":"LHAV", "n":"Little Havana, Hialeah, Doral & West Dade"},
 {"id":"MBCH", "n":"Miami Beach, Surfside & Bal Harbour"},
 {"id":"CGCG", "n":"Coral Gables, Coconut Grove & Key Biscayne"},
 {"id":"SDADE","n":"South Dade — Kendall, Homestead, Redland & Florida City"},
 {"id":"GLADE","n":"Everglades NP, Biscayne NP & the Tamiami Trail"},
]
AC = {"FTL":"#4F81BD","NMIA":"#8064A2","WYN":"#E05A8A","DTB":"#E8973A","LHAV":"#C0504D",
      "MBCH":"#2EB5C9","CGCG":"#9BBB59","SDADE":"#D4A017","GLADE":"#3D8B5A"}

# ---- Miami cuisine taxonomy (the city-unique canon first) ----
CUISINES = [
 {"id":"CUBAN","n":"Cuban — sandwiches, croquetas, ventanita cafecito"},
 {"id":"BAKE", "n":"Bakeries, Pastelitos & Key Lime Pie"},
 {"id":"SEAF", "n":"Seafood, Stone Crab & Raw Bars"},
 {"id":"HAIT", "n":"Haitian — griot, diri ak djon djon"},
 {"id":"CARIB","n":"Caribbean — Jamaican, Bahamian, Trini & Puerto Rican"},
 {"id":"PERU", "n":"Peruvian & Ceviche"},
 {"id":"VENCO","n":"Venezuelan & Colombian — arepas, cachapas"},
 {"id":"LATAM","n":"Nicaraguan, Argentine, Brazilian & Mexican"},
 {"id":"GLADF","n":"Glades & Keys — conch, gator, frog legs"},
 {"id":"FARM", "n":"Tropical Fruit Stands, Farms & U-Pick"},
 {"id":"MKT",  "n":"Markets & Food Halls"},
 {"id":"US",   "n":"American, New American & Steak"},
 {"id":"BURG", "n":"Burgers, BBQ, Diners & Sandwiches"},
 {"id":"EU",   "n":"Italian, French, Spanish & Pizza"},
 {"id":"MED",  "n":"Mediterranean & Middle Eastern"},
 {"id":"ASIAN","n":"Japanese, Chinese, Thai & Asian"},
 {"id":"COF",  "n":"Coffee & Cafés"},
 {"id":"BAR",  "n":"Bars, Breweries & Cocktails"},
 {"id":"VIRAL","n":"Viral / Social"},
]
CMAP = {
 "Cuban":"CUBAN","Cuban sandwich":"CUBAN","Cuban-American":"CUBAN","Ventanita":"CUBAN","Frita":"CUBAN","Croquetas":"CUBAN",
 "Bakery":"BAKE","Pastelitos":"BAKE","Dessert":"BAKE","Desserts":"BAKE","Ice Cream":"BAKE","Gelato":"BAKE","Pastry":"BAKE",
 "Key Lime Pie":"BAKE","Donuts":"BAKE","Chocolate":"BAKE","Helados":"BAKE","Churros":"BAKE",
 "Seafood":"SEAF","Stone Crab":"SEAF","Raw Bar":"SEAF","Oysters":"SEAF","Fish":"SEAF","Fish Market":"SEAF","Crab":"SEAF",
 "Haitian":"HAIT",
 "Caribbean":"CARIB","Jamaican":"CARIB","Bahamian":"CARIB","Trinidadian":"CARIB","Puerto Rican":"CARIB","Dominican":"CARIB","Guyanese":"CARIB",
 "Peruvian":"PERU","Ceviche":"PERU","Nikkei":"PERU",
 "Venezuelan":"VENCO","Colombian":"VENCO","Arepas":"VENCO",
 "Nicaraguan":"LATAM","Argentine":"LATAM","Argentinian":"LATAM","Brazilian":"LATAM","Mexican":"LATAM","Tacos":"LATAM",
 "Salvadoran":"LATAM","Honduran":"LATAM","Uruguayan":"LATAM","Latin American":"LATAM","Ecuadorian":"LATAM","Chilean":"LATAM","Guatemalan":"LATAM",
 "Florida":"GLADF","Glades":"GLADF","Conch":"GLADF","Gator":"GLADF","Alligator":"GLADF","Frog Legs":"GLADF","Keys":"GLADF","Cracker":"GLADF","Native American":"GLADF","Miccosukee":"GLADF",
 "Farm":"FARM","Fruit Stand":"FARM","Tropical Fruit":"FARM","U-Pick":"FARM","Winery":"FARM","Farm Stand":"FARM",
 "Market":"MKT","Food Hall":"MKT","Flea Market":"MKT","Farmers Market":"MKT",
 "American":"US","New American":"US","Contemporary":"US","Steakhouse":"US","Steak":"US","Fine Dining":"US","Tasting Menu":"US",
 "Southern":"US","Soul Food":"US","Farm-to-table":"US","Brunch":"US","Breakfast":"US","Vegan":"US","Vegetarian":"US",
 "Burgers":"BURG","BBQ":"BURG","Barbecue":"BURG","Diner":"BURG","Sandwiches":"BURG","Deli":"BURG","Hot Dogs":"BURG","Fried Chicken":"BURG","Jewish Deli":"BURG",
 "Italian":"EU","French":"EU","Spanish":"EU","Pizza":"EU","Portuguese":"EU","Greek":"MED","European":"EU","Basque":"EU",
 "Mediterranean":"MED","Middle Eastern":"MED","Lebanese":"MED","Israeli":"MED","Turkish":"MED","Persian":"MED",
 "Japanese":"ASIAN","Sushi":"ASIAN","Omakase":"ASIAN","Chinese":"ASIAN","Thai":"ASIAN","Vietnamese":"ASIAN","Korean":"ASIAN",
 "Indian":"ASIAN","Asian":"ASIAN","Ramen":"ASIAN","Izakaya":"ASIAN","Filipino":"ASIAN","Dim Sum":"ASIAN","Taiwanese":"ASIAN","Malaysian":"ASIAN",
 "Coffee":"COF","Cafe":"COF","Café":"COF","Cafecito":"COF","Tea":"COF",
 "Bar":"BAR","Cocktails":"BAR","Cocktail Bar":"BAR","Brewery":"BAR","Beer":"BAR","Dive Bar":"BAR","Speakeasy":"BAR","Distillery":"BAR","Wine Bar":"BAR","Tiki":"BAR",
 "Viral":"VIRAL",
}
def map_cz(raw):
    out = []
    for c in raw:
        i = CMAP.get(c) or CMAP.get(c.strip()) or CMAP.get(c.strip().title())
        if i and i not in out: out.append(i)
    return out or ["US"]

# ---- Collections (CATS) — Miami's marquee is beaches + Art Deco + the Everglades wilderness ----
CATS = [{"id":"ICON","n":"Iconic & Must-See"},{"id":"BEACH","n":"Beaches & Waterfront"},
        {"id":"DECO","n":"Art Deco, MiMo & Architecture"},{"id":"ART","n":"Art, Murals & Galleries"},
        {"id":"MUS","n":"Museums"},{"id":"HIST","n":"History & Heritage"},
        {"id":"PARK","n":"Parks & Gardens"},{"id":"WILD","n":"Everglades, Wildlife & Nature"},
        {"id":"BOAT","n":"Boats, Airboats & Islands"},{"id":"ENT","n":"Music, Nightlife & Performing Arts"},
        {"id":"FAM","n":"Family & Kids"},{"id":"ODD","n":"Oddities & Hidden Gems"},{"id":"FREE","n":"Free to Visit"}]
KW = {
 "ICON":["ocean drive","calle ocho","wynwood walls","vizcaya","everglades national park","shark valley","south beach","anhinga","coral castle","bayfront park","little havana"],
 "BEACH":["beach","shore","boardwalk","waterfront","bay","lighthouse","sand","inlet","marina","riverwalk"],
 "DECO":["art deco","deco","mimo","architecture","modernist","hotel","streamline","architect","building","tower","fontainebleau","freedom tower"],
 "ART":["mural","art","gallery","street art","sculpture","installation","ica ","pamm","rubell","margulies","bass"],
 "MUS":["museum","frost","collection","exhibit","planetarium","wolfsonian","history miami","historymiami"],
 "HIST":["historic","history","heritage","fort","monastery","cemetery","landmark","seminole","miccosukee","barnacle","stiltsville","pioneer","house","1920s","19th century","missile"],
 "PARK":["park","garden","botanic","arboretum","hammock","preserve","state park","nature center","fairchild","grove"],
 "WILD":["everglades","alligator","gator","crocodile","manatee","wildlife","bird","heron","anhinga","sawgrass","mangrove","slough","pineland","cypress","sanctuary","refuge","marsh","zoo"],
 "BOAT":["airboat","boat","kayak","canoe","ferry","island","key ","keys","snorkel","dive","cruise","water taxi","paddle"],
 "ENT":["theater","theatre","concert","music","jazz","club","arena","stadium","performing","opera","ballet","symphony","nightlife","domino"],
 "FAM":["zoo","aquarium","seaquarium","children","kids","science","frost science","jungle island","monkey","family","playground","carousel"],
}
ODD_SRC = {"ATLASOBSCURA"}
def collections(x, is_food):
    g = list(x.get("g", []))
    hay = (x.get("n","")+" "+x.get("w","")+" "+x.get("k","")+" "+" ".join(x.get("cz",[]))).lower()
    if is_food:
        if any(k in hay for k in ["market","food hall","flea","farmers"]): g.append("MKT")
    else:
        for cid, kws in KW.items():
            if any(k in hay for k in kws): g.append(cid)
        srcs = {t[0] for t in x.get("sources", [])}
        if (srcs & ODD_SRC) or "oddit" in hay or "quirk" in hay or "hidden gem" in hay:
            g.append("ODD")
        if re.search(r'\bfree\b|no admission|free to (enter|visit)|free admission', hay): g.append("FREE")
        if not g: g.append("HIST")
    out = []
    for c in g:
        if c not in out: out.append(c)
    return out[:4]

SRC_LABEL = {
 "MICHELIN":"MICHELIN","MICHELIN_BIB":"MICHELIN BIB GOURMAND","MICHELIN_STAR":"MICHELIN STAR","MICHELIN_GREEN":"MICHELIN GREEN STAR",
 "JAMESBEARD":"JAMES BEARD","MIAMIHERALD":"MIAMI HERALD","MIAMINEWTIMES":"MIAMI NEW TIMES","SUNSENTINEL":"SOUTH FLORIDA SUN SENTINEL",
 "EATERMIAMI":"EATER MIAMI","INFATUATION":"THE INFATUATION","WLRN":"WLRN","TIMEOUT":"TIME OUT MIAMI","GMCVB":"GREATER MIAMI CVB",
 "VISITLAUDERDALE":"VISIT LAUDERDALE","NPS":"NATIONAL PARK SVC","FLSTATEPARKS":"FLORIDA STATE PARKS","ATLASOBSCURA":"ATLAS OBSCURA",
 "WIKIPEDIA":"WIKIPEDIA","OFFICIAL":"OFFICIAL SITE","MIAMIDADE":"MIAMI-DADE COUNTY","LOCAL10":"LOCAL 10 (WPLG)","NBC6":"NBC 6 SOUTH FLORIDA",
 "CBSMIAMI":"CBS NEWS MIAMI","TASTINGTABLE":"TASTING TABLE","FOODWINE":"FOOD & WINE","NYT":"NEW YORK TIMES","BONAPPETIT":"BON APPÉTIT",
 "SOUTHFLA":"SOUTH FLORIDA MAG","MIAMIMAG":"MIAMI MAGAZINE","OCEANDRIVE":"OCEAN DRIVE","SFLMAG":"SOUTH FLORIDA MAG",
 "USATODAY":"USA TODAY 10BEST","THRILLIST":"THRILLIST","CNTRAVELER":"CONDÉ NAST TRAVELER","FODORS":"FODOR'S","FROMMERS":"FROMMER'S",
 "VISITFLORIDA":"VISIT FLORIDA","NATGEO":"NATIONAL GEOGRAPHIC","SMITHSONIAN":"SMITHSONIAN","NRHP":"NATIONAL REGISTER",
 "TRIPADVISOR":"TRIPADVISOR","YELP":"YELP","GOOGLE":"GOOGLE","OPENTABLE":"OPENTABLE",
}
ALIAS = {"EATER":"EATERMIAMI","MIAMI_NEW_TIMES":"MIAMINEWTIMES","NEWTIMES":"MIAMINEWTIMES","HERALD":"MIAMIHERALD",
         "SUN_SENTINEL":"SUNSENTINEL","TIMEOUTMIAMI":"TIMEOUT","INFATUATIONMIAMI":"INFATUATION","MIAMIANDBEACHES":"GMCVB",
         "MIAMIANDTHEBEACHES":"GMCVB","FLORIDASTATEPARKS":"FLSTATEPARKS","BEARD":"JAMESBEARD","JBF":"JAMESBEARD"}
def canon(k): return ALIAS.get(k, k)

# places confirmed not visitable / not real during fact-check — never re-add (record why in AUDIT.md)
EXCLUDE = set()
sights = []; food = []; srcmeta = {}; seen_names = set()
def _take(x, bucket):
    n = x.get("n")
    if not n or n in seen_names or n in EXCLUDE: return
    seen_names.add(n); bucket.append(x)
for path in sorted(glob.glob(os.path.join(D, "*.json"))):
    base = os.path.basename(path)
    if base.startswith(("_","out_","mia_","geo_","CREATORS","SOURCES_")) or "dataset" in base or "worklist" in base: continue
    d = json.load(open(path, encoding="utf-8"))
    if isinstance(d, list):
        for x in d: _take(x, food)
    else:
        for s in d.get('sources', []): srcmeta.setdefault(s['key'], s)
        for x in d.get('sights', []): _take(x, sights)
        for x in d.get('food', []):   _take(x, food)
# outlet metadata from SOURCES_*.json (names/urls for the source tables)
for path in sorted(glob.glob(os.path.join(D, "SOURCES_*.json"))):
    j = json.load(open(path, encoding="utf-8"))
    for o in j.get("outlets", []):
        if o.get("key"): srcmeta.setdefault(o["key"], {"key":o["key"],"name":o.get("name",o["key"]),"url":o.get("url","")})

def norm_sources(x):
    seen = []; out = []
    for t in x.get('sources', []):
        k = canon(t[0]); pair = [k, t[1] if len(t) > 1 else ""]
        if (pair[0], pair[1]) in seen: continue
        seen.append((pair[0], pair[1])); out.append(pair)
    return out or [["WIKIPEDIA", ""]]

P = []; F = []; used_S = set(); used_F = set()
for x in sights:
    r = {"t":int(x["t"]),"a":x["a"],"n":x["n"],"ad":x["address"],"w":x["w"]}
    if x.get("k"): r["k"] = x["k"]
    if x.get("warn"): r["warn"] = True
    if x.get("closed"): r["closed"] = True
    r["g"] = collections(x, False); r["s"] = norm_sources(x)
    for t in r["s"]: used_S.add(t[0])
    P.append(r)
for x in food:
    r = {"t":int(x["t"]),"a":x["a"],"n":x["n"],"ad":x["address"],"w":x["w"]}
    k = x.get("k") or (("Order: " + x["dish"]) if x.get("dish") else "")
    if k: r["k"] = k
    if x.get("warn"): r["warn"] = True
    if x.get("closed"): r["closed"] = True
    r["cz"] = map_cz(x.get("cz", [])); g = collections(x, True)
    if g: r["g"] = g
    r["s"] = norm_sources(x)
    for t in r["s"]: used_F.add(t[0])
    F.append(r)

def mk_table(keys):
    tbl = {}
    for k in sorted(keys):
        m = srcmeta.get(k) or {}
        tbl[k] = {"k":SRC_LABEL.get(k, k.replace('_',' ').upper()),"t":m.get("name", SRC_LABEL.get(k, k)),
                  "u":m.get("url",""),"l":m.get("name","")}
    return tbl
S = mk_table(used_S); FS = mk_table(used_F)
out = {"areas":AREAS,"ac":AC,"cuisines":CUISINES,"cats":CATS,"P":P,"F":F,"S":S,"FS":FS}
json.dump(out, open(os.path.join(D, 'mia_dataset.json'), 'w', encoding="utf-8"), indent=1, ensure_ascii=False)
os.makedirs(os.path.join(D, "geo"), exist_ok=True)
json.dump([{"n":r["n"],"addr":r["ad"],"a":r["a"]} for r in P+F],
          open(os.path.join(D, "geo", "_worklist_all.json"), 'w', encoding="utf-8"), ensure_ascii=False, indent=0)
print("P(sights):", len(P), " F(food):", len(F), " total:", len(P)+len(F))
print("Areas:", dict(Counter(r["a"] for r in P+F)))
print("Cuisine coverage:", dict(Counter(c for r in F for c in r.get("cz", []))))
bad = [r["n"] for r in P+F if r["a"] not in AC]
assert not bad, "records with unknown area id: %s" % bad[:10]
print("closed flagged:", [r["n"] for r in P+F if r.get("closed")] or "none")
print("wrote mia_dataset.json + geo/_worklist_all.json")
