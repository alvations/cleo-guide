#!/usr/bin/env python3
# Build ONE pastel page PER PLACE under Singapore/ — each Singapore town (Singapore/toa-payoh.html = just
# Toa Payoh) and each SEA city (Singapore/bangkok.html, …) gets its own page, plus a Singapore/index.html
# hub linking them all. Each page is the Cleveland engine, filtered to that place's records, pastel-themed
# (light+dark), centred on that place's pins. Data = data/singapore.dataset.json; coords injected from
# data/geocodes.json cities["singapore"] (same GATE 1 ≥2-credible + GATE 2 sourced-pin as every build).
import re, os, json
from collections import defaultdict
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC  = os.path.join(ROOT, "cleveland.html")
OUTDIR = os.path.join(ROOT, "Singapore")
DS   = json.load(open(os.path.join(ROOT, "data", "singapore.dataset.json"), encoding="utf-8"))
GEO  = json.load(open(os.path.join(ROOT, "data", "geocodes.json"), encoding="utf-8"))["cities"]["singapore"]
ENGINE = open(SRC, encoding="utf-8").read()
os.makedirs(OUTDIR, exist_ok=True)

# ── PLACES: slug, display name, region group, address/name keywords (first match wins), map zoom ──
# Order matters only within a region for overlapping substrings.
PLACES = [
 # ---- Singapore ----
 ("toa-payoh","Toa Payoh","Singapore",["__AREA_TPY__"],16),
 ("chinatown","Chinatown & CBD","Singapore",["Chinatown","South Bridge","Smith Street","Pagoda Street","Keong Saik","Telok Ayer","Maxwell","Kadayanallur","Hong Lim","Upper Cross Street","China Street","Far East Square","Riverside Point","Merchant Road","New Bridge Road","Lau Pa Sat","Raffles Quay","Boon Tat"],16),
 ("marina-bay","Marina Bay","Singapore",["Marina Bay","Bayfront","Marina Gardens","Raffles Avenue","Fullerton","Esplanade Drive"],15),
 ("civic-district","Civic District","Singapore",["St Andrew","Empress Place","Stamford Road","Fort Canning","River Valley","1 Beach Road","Civic District"],16),
 ("kampong-glam","Kampong Glam","Singapore",["Kampong Glam","Muscat Street","North Bridge Road","Jalan Pisang"],16),
 ("little-india","Little India","Singapore",["Little India","Serangoon Road","Race Course Road","Buffalo Road","Kerbau Road","Tekka"],16),
 ("tiong-bahru","Tiong Bahru","Singapore",["Tiong Bahru","Seng Poh"],16),
 ("newton-novena","Newton & Novena","Singapore",["Newton Food","Clemenceau Avenue","United Square","Thomson Road","Novena"],15),
 ("jalan-besar","Jalan Besar & Lavender","Singapore",["Jalan Besar","Kitchener","Foch Road","Crawford Lane","Cambridge Road","Kallang Avenue","Pek Kio"],15),
 ("katong-joo-chiat","Katong & Joo Chiat","Singapore",["Katong","Joo Chiat","East Coast Road","Koon Seng"],16),
 ("old-airport-road","Old Airport Road","Singapore",["Old Airport Road"],16),
 ("geylang","Geylang","Singapore",["Geylang"],15),
 ("bedok","Bedok","Singapore",["Bedok"],15),
 ("changi","Changi","Singapore",["Changi","Airport Boulevard"],14),
 ("marine-parade","Marine Parade & East Coast","Singapore",["East Coast Park","Marine Parade","East Coast Parkway","East Coast Lagoon"],14),
 ("dempsey-hill","Dempsey Hill","Singapore",["Dempsey"],16),
 ("bukit-timah","Bukit Timah","Singapore",["Bukit Timah","Cluny","Hindhede","Adam Road"],14),
 ("balestier","Balestier","Singapore",["Balestier"],16),
 ("mandai","Mandai","Singapore",["Mandai"],14),
 ("holland-village","Holland Village","Singapore",["Holland Drive","Holland Village","Lorong Mambong"],16),
 ("southern-ridges","Southern Ridges","Singapore",["Henderson","Mount Faber","Telok Blangah","Pasir Panjang"],15),
 ("queenstown","Queenstown & Redhill","Singapore",["Alexandra Village","Bukit Merah","Redhill","Commonwealth","Depot Road"],15),
 ("jurong","Jurong","Singapore",["Jurong","Boon Lay"],14),
 ("upper-thomson","Upper Thomson & MacRitchie","Singapore",["Thong Soon","Upper Thomson","MacRitchie","Lornie"],14),
 # ---- Malaysia ----
 ("kuala-lumpur","Kuala Lumpur","Malaysia",["Kuala Lumpur","KLCC","Jalan Ampang","Petaling Jaya","Damansara","SS21","Selangor"],12),
 ("penang","Penang (George Town)","Malaysia",["Penang","George Town","Air Itam","Lebuh","Jalan Penang"],13),
 ("malacca","Malacca","Malaysia",["Malacca","Melaka","Jonker","Bandar Hilir","Hang Jebat"],15),
 ("ipoh","Ipoh","Malaysia",["Ipoh"],14),
 # ---- Thailand ----
 ("bangkok","Bangkok","Thailand",["Bangkok"],13),
 ("chiang-mai","Chiang Mai","Thailand",["Chiang Mai"],13),
 # ---- Vietnam ----
 ("ho-chi-minh-city","Ho Chi Minh City","Vietnam",["Ho Chi Minh City","Saigon","Sài Gòn","Thao Dien","Thảo Điền","Cholon","Chợ Lớn"],13),
 ("hanoi","Hanoi","Vietnam",["Hanoi","Quang Ninh","Ha Long"],12),
 ("hoi-an","Hoi An","Vietnam",["Hoi An"],14),
 # ---- Indonesia ----
 ("jakarta","Jakarta","Indonesia",["Jakarta"],12),
 ("bali","Bali","Indonesia",["Bali","Ubud","Uluwatu","Tabanan","Tegallalang","Kuta"],11),
 ("yogyakarta","Yogyakarta","Indonesia",["Yogyakarta","Magelang","Sleman","Prambanan"],11),
 # ---- Philippines ----
 ("manila","Manila","Philippines",["Manila","Intramuros","Ermita","Malate","Makati"],12),
 ("cebu","Cebu","Philippines",["Cebu"],12),
 # ---- Cambodia, Laos & Myanmar ----
 ("siem-reap","Siem Reap (Angkor)","Cambodia, Laos & Myanmar",["Siem Reap","Angkor"],13),
 ("phnom-penh","Phnom Penh","Cambodia, Laos & Myanmar",["Phnom Penh","Street 174"],13),
 ("luang-prabang","Luang Prabang","Cambodia, Laos & Myanmar",["Luang Prabang"],13),
 ("yangon","Yangon","Cambodia, Laos & Myanmar",["Yangon"],13),
 ("bagan","Bagan","Cambodia, Laos & Myanmar",["Bagan"],12),
]
SLUG_ORDER = [p[0] for p in PLACES]
PLACE_META = {p[0]: p for p in PLACES}

# ── GATES (same as every build) ──
_OPEN = {"YELP","TRIPADVISOR","OPENTABLE","GOOGLE","GOOGLEMAPS"}
_ELITE = {"MICHELIN","MICHELIN_BIB","MICHELIN_STAR","MICHELIN_GREEN","JAMESBEARD","NPS","SMITHSONIAN","UNESCO"}
def sourced_ok(r):
    c={t[0] for t in r.get("s",[]) if t[0] not in _OPEN}; return len(c)>=2 or bool(c&_ELITE)
def has_pin(n):
    e=GEO.get(n); return bool(e and e.get("lat") is not None and e.get("lng") is not None and e.get("source") and e.get("source")!="UNVERIFIED")

def assign(r):
    hay = (r["n"]+" "+r["ad"]).lower()
    if r["a"]=="TPY": return "toa-payoh"
    for slug,name,region,kws,zoom in PLACES:
        for kw in kws:
            if kw.startswith("__AREA_"): continue
            if kw.lower() in hay: return slug
    return None

# assign every gated record to a place
groups_P=defaultdict(list); groups_F=defaultdict(list); unassigned=[]
for r in DS["P"]:
    if not (sourced_ok(r) and has_pin(r["n"])): continue
    s=assign(r);  (groups_P[s].append(r) if s else unassigned.append(r["n"]))
for r in DS["F"]:
    if not (sourced_ok(r) and has_pin(r["n"])): continue
    s=assign(r);  (groups_F[s].append(r) if s else unassigned.append(r["n"]))

# ── serialization helpers ──
def js(v): return json.dumps(v, ensure_ascii=False)
def rec(r, e):
    parts=["t:%d"%r["t"],"a:%s"%js(r["a"]),"n:%s"%js(r["n"]),"ad:%s"%js(r["ad"]),
           "la:%.5f"%e["lat"],"ln:%.5f"%e["lng"],"w:%s"%js(r["w"])]
    if r.get("k"):parts.append("k:%s"%js(r["k"]))
    if r.get("closed"):parts.append("closed:1")
    if r.get("cz"):parts.insert(4,"cz:[%s]"%",".join(js(c) for c in r["cz"]))
    if r.get("g"):parts.append("g:[%s]"%",".join(js(c) for c in r["g"]))
    parts.append("s:[%s]"%",".join("[%s,%s]"%(js(t[0]),js(t[1])) for t in r["s"]))
    return "{"+",".join(parts)+"}"
def tbl(d):
    return "{\n"+",\n".join("  %s:{k:%s,t:%s,u:%s,l:%s}"%(js(k),js(v["k"]),js(v["t"]),js(v["u"]),js(v["l"])) for k,v in d.items())+"\n}"

THEME_OLD_ROOT = """  :root{
    --iron:#12171A; --slab:#1B2226; --hair:#2E393E;
    --patina:#74AE99; --patina-dim:#3E5D53;
    --brass:#C89B4A; --rust:#B45B3E;
    --bone:#E9E5DB; --bone-dim:#9AA3A2;
    --c-dt:#74AE99; --c-uc:#C89B4A; --c-ws:#B45B3E; --c-sub:#7E8FC4;
  }"""
THEME_NEW_ROOT = """  /* Pastel theme — LIGHT default :root; DARK via prefers-color-scheme. Marker --c-* set by const AC. */
  :root{
    color-scheme: light dark;
    --iron:#FCF8FB; --slab:#F3ECF6; --hair:#E6DAEA;
    --patina:#3E9A88; --patina-dim:#BFE0D8;
    --brass:#B9863A; --rust:#C56F73;
    --bone:#2E2838; --bone-dim:#6E6480;
    --c-dt:#F2A1A1; --c-uc:#BCA7E6; --c-ws:#84CBB9; --c-sub:#9CBEEC;
  }
  @media (prefers-color-scheme:dark){:root{
    --iron:#191521; --slab:#241E30; --hair:#382E48;
    --patina:#93D6C6; --patina-dim:#3E5D53;
    --brass:#E8C57C; --rust:#E4989B;
    --bone:#ECE7F2; --bone-dim:#A79FB8;
  }}"""

def build_page(slug):
    name=PLACE_META[slug][1]; region=PLACE_META[slug][2]; zoom=PLACE_META[slug][4]
    P=groups_P.get(slug,[]); F=groups_F.get(slug,[])
    if not (P or F): return None
    pins=[(GEO[r["n"]]["lat"],GEO[r["n"]]["lng"]) for r in P+F]
    clat=round(sorted(x[0] for x in pins)[len(pins)//2],5); clng=round(sorted(x[1] for x in pins)[len(pins)//2],5)
    # single area = this place. AID must be a VALID bare JS object key (alnum only) — a hyphen in the
    # slug (toa-payoh, chiang-mai, …) would make `const AC = {TOA-PAYOH:..}` a syntax error and blank
    # the whole page. Every record's `a` is rewritten to AID so AC[p.a] resolves.
    AID=re.sub(r'[^A-Za-z0-9]','',slug).upper()
    color="#BCA7E6"
    AREAS="[\n  {id:%s,n:%s,c:%s}\n]"%(js(AID),js(name),js(color))
    def wa(r): r=dict(r); r["a"]=AID; return r
    used_S=set(t[0] for r in P for t in r["s"]); used_F=set(t[0] for r in F for t in r["s"])
    S={k:DS["S"][k] for k in DS["S"] if k in used_S}; FS={k:DS["FS"][k] for k in DS["FS"] if k in used_F}
    Pjs="[\n"+",\n".join(rec(wa(r),GEO[r["n"]]) for r in P)+"\n]" if P else "[]"
    Fjs="[\n"+",\n".join(rec(wa(r),GEO[r["n"]]) for r in F)+"\n]" if F else "[]"
    CUIS="[\n"+",\n".join("  {id:%s,n:%s}"%(js(c["id"]),js(c["n"])) for c in DS["cuisines"])+"\n]"
    CATS="[\n"+",\n".join("  {id:%s,n:%s}"%(js(c["id"]),js(c["n"])) for c in DS["cats"])+"\n]"
    DATA=("const S = %s;\n\nconst AREAS = %s;\n\nconst P = %s;\n\nconst FS = %s;\n\nconst CUISINES = %s;\n\nconst CATS = %s;\n\nconst F = %s;"
          %(tbl(S),AREAS,Pjs,tbl(FS),CUIS,CATS,Fjs))
    start=ENGINE.index("const S = {"); anchor=ENGINE.index("P.forEach((p,i)=>{p.id='s'+i")
    new=ENGINE[:start]+DATA+"\n\n"+ENGINE[anchor:]
    def rep(a,b):
        nonlocal new
        if a in new: new=new.replace(a,b)
    # theme
    rep(THEME_OLD_ROOT,THEME_NEW_ROOT)
    rep(".leaflet-container{background:#0E1316;}",".leaflet-container{background:var(--slab);}")
    rep(".osmdark .leaflet-tile-pane{filter:invert(1) hue-rotate(180deg) brightness(.92) contrast(.87) saturate(.55);}",
        ".osmdark .leaflet-tile-pane{filter:none;}\n  @media (prefers-color-scheme:dark){.osmdark .leaflet-tile-pane{filter:invert(1) hue-rotate(180deg) brightness(.92) contrast(.87) saturate(.55);}}")
    rep("setBase('dark'); markBaseChips();","setBase((window.matchMedia&&window.matchMedia('(prefers-color-scheme:dark)').matches)?'dark':'light'); markBaseChips();")
    # ── Strip ALL Google base-map machinery ──────────────────────────────────────────────────
    # These pastel place pages use only free, no-key tiles (CARTO / OSM / Esri). The Cleveland engine
    # ships a full Google base-layer system (key-required g_* layers, an "ADD GOOGLE API KEY" button,
    # setGoogle()/promptKey()/GoogleMutant loader, and a mountMap comment) — every piece carries the
    # words "API key", and a stale saved base id can still route into it. So we remove the whole thing,
    # not just the visible buttons, and the assert below FAILS the build if any Google surface survives
    # (so a future engine edit can never silently re-introduce "API key required").
    # 1) the three key-required base layer entries
    rep("""\n {id:'g_road',l:'Google Roads',    free:0, gtype:'roadmap'},
 {id:'g_sat', l:'Google Satellite',free:0, gtype:'hybrid'},
 {id:'g_ter', l:'Google Terrain',  free:0, gtype:'terrain'}""", "")
    # 2) the "ADD GOOGLE API KEY" chip appended to the base filter
    rep("""').join('')
 +'<button class="chip warnchip" id="keyBtn">ADD GOOGLE API KEY</button>';""", "').join('');")
    # 3) the gchip class marker on the chip builder (no non-free bases remain)
    rep("'<button class=\"chip'+(b.free?'':' gchip')+'\" data-v=\"'", "'<button class=\"chip\" data-v=\"'")
    # 4) the mountMap base-layers comment (mentions the API key)
    rep("""/* ── Base layers ────────────────────────────────────────────────────────────
   Free layers need no key. Google needs your own Maps JavaScript API key and
   is loaded through the officially sanctioned GoogleMutant plugin, because
   scraping Google's raster tiles directly breaks their terms. Apple Maps has
   no equivalent: MapKit JS needs a signed developer token, which a static
   file cannot produce. The per-place \"Apple Maps\" links handle Apple instead. */""",
        "/* Base layers — free, no-key tiles only (CARTO / OpenStreetMap / Esri). */")
    # 5) the GKEY localStorage read (only Google code used it)
    new = re.sub(r"let GKEY=''; try\{GKEY=localStorage\.getItem\('[a-z]+_gkey'\)\|\|'';\}catch\(e\)\{\}\n", "", new)
    # 6) the setBase() branch that hands non-free bases to Google
    rep("  if(!b.free){ return setGoogle(b,manual); }\n", "")
    # 7) the entire Google loader: setGoogle() + promptKey() (comment through promptKey's close)
    new = re.sub(r"/\* Google, via the official Maps JavaScript API \+ GoogleMutant \*/\n"
                 r".*?function promptKey\(\)\{.*?\n\}\n", "", new, flags=re.S)
    # 8) the keyBtn click branch in the base-filter handler
    rep("  if(b.id==='keyBtn'){promptKey();return;}\n", "")
    # 9) simplify markBaseChips to the aria-pressed loop (drop g_/keyBtn logic)
    new = re.sub(r"function markBaseChips\(\)\{.*?\n\}\n",
                 "function markBaseChips(){\n"
                 "  document.querySelectorAll('#baseFilter .chip').forEach(c=>{\n"
                 "    c.setAttribute('aria-pressed', c.dataset.v===curBase);\n"
                 "  });\n}\n", new, flags=re.S, count=1)
    rep("color:#6E7C7B;white-space:nowrap;text-shadow:0 0 5px #12171A","color:#8C8498;white-space:nowrap;text-shadow:0 1px 3px rgba(0,0,0,.28)")
    rep("const AC = {DT:'#74AE99',UC:'#C89B4A',WS:'#B45B3E',SUB:'#7E8FC4'};","const AC = {%s:'%s'};"%(AID,color))
    rep("setView([41.4993,-81.6944],11)","setView([%s,%s],%d)"%(clat,clng,zoom))
    for a,b in [("cle_trip","sg_trip"),("cle_seen","sg_seen"),("cle_gkey","sg_gkey"),
                ("cleveland-my-list","singapore-my-list"),("cleveland-field-guide","singapore-field-guide")]:
        new=new.replace(a,b)
    rep('''  <span><i style="background:var(--c-dt)"></i>Downtown</span>
  <span><i style="background:var(--c-uc)"></i>University Circle &amp; East</span>
  <span><i style="background:var(--c-ws)"></i>West Side &amp; Tremont</span>
  <span><i style="background:var(--c-sub)"></i>Suburbs &amp; day trips</span>''',
        '  <span><i style="background:%s"></i>%s</span>'%(color,name))
    # backdrop → no vector geography, no labels (tiles carry it)
    rep('''const LABELS=[["Lake Erie",41.5600,-81.7400],["Downtown",41.4985,-81.6880],
 ["Ohio City",41.4845,-81.7080],["Tremont",41.4790,-81.6890],["Asiatown",41.5100,-81.6660],
 ["University Circle",41.5085,-81.6060],["Lakewood",41.4820,-81.7990],["Cuyahoga Valley",41.2600,-81.5600]];

backdrop=L.layerGroup().addTo(map);
L.polygon(SHORE.concat([[41.9000,-81.1000],[41.9000,-82.1000]]),
  {stroke:false,fillColor:'#16303A',fillOpacity:.55,interactive:false}).addTo(backdrop);
L.polyline(SHORE,{color:'#3E5D53',weight:1.6,opacity:.9,interactive:false}).addTo(backdrop);
L.polyline(RIVER,{color:'#2F5560',weight:2.2,opacity:.85,interactive:false}).addTo(backdrop);
ARTERIES.forEach(a=>L.polyline(a,{color:'#2E393E',weight:1.4,opacity:.8,interactive:false}).addTo(backdrop));
LABELS.forEach(''',
        'const LABELS=[];\n\nbackdrop=L.layerGroup().addTo(map);\nLABELS.forEach(')
    new=new.replace("so the map still shows Lake Erie, the\n   Cuyahoga and the main arteries even if every tile server is unreachable.",
                    "so the guide still reads even if every tile server is unreachable.")
    # prose
    nP=len(P); nF=len(F)
    # a page with NO sights must open in FOOD mode, or the default sights view is blank on load.
    # The engine calls setMode('sights') at init (line ~1527) which overrides `let MODE=`, so retarget
    # THAT standalone init call (newline-prefixed to avoid touching the button onclick handlers).
    if nP==0 and nF>0:
        new=new.replace("\nsetMode('sights');","\nsetMode('food');")
        rep('<button id="modeSights" class="modebtn" aria-pressed="true">','<button id="modeSights" class="modebtn" aria-pressed="false">')
        rep('<button id="modeFood" class="modebtn" aria-pressed="false">','<button id="modeFood" class="modebtn" aria-pressed="true">')
    rep("<title>Cleveland Field Guide — 130 Places, Sourced</title>",
        "<title>%s — Singapore &amp; SEA field guide</title>"%name)
    rep('<p class="eyebrow">Field guide · every place from all seven sources</p>',
        '<p class="eyebrow">Field guide · %s · %s</p>'%(name,region))
    rep('<h1>Cleveland<span class="thin">the complete odd &amp; overlooked</span></h1>',
        '<h1>%s<span class="thin">%s — sights &amp; hawker food, sourced</span></h1>'%(name,region))
    rep('<p class="standfirst">143 sights and 40 places to eat, each traceable to the source that named it. <strong>Switch modes below</strong> &mdash; food lives on its own map so it never clutters the sightseeing one. Tick the box on anything to build your own list, then export it to Google or Apple Maps.</p>',
        '<p class="standfirst">%d sights and %d places to eat in <strong>%s</strong>, each traceable to the source that named it (Michelin, local news &amp; vetted local/viral creators). Renders in soft pastel, <strong>light or dark</strong>. <strong>Switch modes below</strong>, filter by cuisine or collection, and tick anything to build your own list, then export it to Google or Apple Maps. <a href="index.html" style="color:var(--patina)">← all Singapore &amp; SEA towns</a></p>'%(nP,nF,name))
    new=re.sub(r'<meta name="description"[^>]*>',
        '<meta name="description" content="%s (%s) field guide — %d sights and %d places to eat, each sourced (Michelin, local news, vetted creators) on one pastel interactive map (light &amp; dark) with cuisine, collection and source filters, a trip builder and Google/Apple exports.">'%(name,region,nP,nF), new)
    new=new.replace(", Cleveland OH", ", %s"%name)
    new=new.replace(">Cleveland — my list<",">%s — my list<"%name).replace(">Cleveland — my list<",">%s — my list<"%name)
    new=new.replace('placeholder="witchcraft, waterfall, chess, kielbasa…"','placeholder="chicken rice, laksa, temple, market…"')
    new=new.replace("? 'laksa, dim sum, pastrami, cannoli…' : 'witchcraft, waterfall, chess, kielbasa…'",
                    "? 'chicken rice, laksa, satay, prata…' : 'temples, markets, museums, parks…'")
    new=new.replace('href="index.html" style="color:var(--bone-dim)','href="../index.html" style="color:var(--bone-dim)')
    new=new.replace("last verified 2026-08-08","last verified 2026-08-26")
    new=new.replace(
'''  <span style="opacity:.8">Refresh check (Aug 2026, via the pipeline): Sokolowski's University Inn confirmed still closed (kept, flagged); West Side Market open amid a $70M renovation, produce arcade reopened Jan 2026; newly opened since build — Rock &amp; Roll Hall of Fame expansion, Cleveland Metroparks Zoo Primate Forest, Irishtown Bend Park. Findings logged in data/sources.json.</span><br><br>''',
'''  <span style="opacity:.8">Web-researched and fact-checked via the pipeline (data/sources.json, docs/SOURCES.md): Michelin, UNESCO, local news &amp; magazines and vetted local/viral creators. Coordinates verified into data/geocodes.json; every place status-checked open. Some spots are pending a final coordinate pass.</span><br><br>''')
    # scrub the "BASE MAPS / why not Google" methodology prose (now false — the Google buttons are gone)
    base_note=("+ '<div class=\"srcrow\"><span class=\"k\">BASE MAPS</span><div class=\"t\">Free, no-key tiles'"
               "  + '<span>This edition uses only free base layers that need no key &mdash; OpenStreetMap for streets, "
               "CARTO for the pastel light &amp; dark maps, and Esri for satellite &amp; terrain. Every place also carries "
               "its own Google Maps and Apple Maps links for directions.</span></div></div>'")
    new=re.sub(r"\+ '<div class=\"srcrow\"><span class=\"k\">BASE MAPS</span>.*?All are licensed for this use\.</span></div></div>'",
        lambda m: base_note, new, flags=re.S)   # lambda repl -> no escape processing on the replacement
    # appendix trimmed to a generic note
    new=re.sub(r"\+ '<div class=\"srcrow\"><span class=\"k\">FOOD RULES.*?</div></div>';",
        lambda m: "+ '<div class=\"srcrow\"><span class=\"k\">HOW SOURCED</span><div class=\"t\">Web-searched &amp; fact-checked'"
                  "  + '<span>Every place is traceable to a credible source — Michelin, UNESCO, local news &amp; magazines, and vetted local/viral creators — in data/sources.json. Coordinates are verified into data/geocodes.json and every place status-checked open. Yelp/TripAdvisor never count toward the two-source bar.</span></div></div>';",
        new, flags=re.S)
    # guards
    assert "P.forEach((p,i)=>{p.id='s'+i" in new
    assert "Cleveland" not in new[new.index("const S = {"):new.index("const AC =")], "Cleveland leaked into %s"%slug
    lo=min(x[0] for x in pins); hi=max(x[0] for x in pins); lo2=min(x[1] for x in pins); hi2=max(x[1] for x in pins)
    assert lo-0.001<=clat<=hi+0.001 and lo2-0.001<=clng<=hi2+0.001, "centre outside pins for %s"%slug
    assert not re.search(r"\\u[0-9a-fA-F]{4}", re.sub(r"<script[\s\S]*?</script>","",new)), "literal \\uXXXX escape leaked into visible HTML of "+slug
    # No Google base-map surface may survive — a stray one means "API key required" can reappear.
    # (fonts.googleapis.com stylesheet links are allowed; the Maps *tile* API and its key UI are not.)
    forbidden=["API key","maps.googleapis.com","GoogleMutant","googleMutant","promptKey","setGoogle","g_road","ADD GOOGLE"]
    hit=[t for t in forbidden if t in new]
    assert not hit, "Google base-map surface survived in %s: %s — the strip in build-singapore-pages.py no longer matches the engine; fix it (see the 'Strip ALL Google base-map machinery' block)."%(slug,hit)
    open(os.path.join(OUTDIR,slug+".html"),"w",encoding="utf-8").write(new)
    return {"slug":slug,"name":name,"region":region,"nP":nP,"nF":nF,"total":nP+nF}

built=[]
for slug in SLUG_ORDER:
    r=build_page(slug)
    if r: built.append(r)

print("built %d place pages, %d total places"%(len(built),sum(b["total"] for b in built)))
if unassigned: print("UNASSIGNED (no place matched):", ", ".join(unassigned))
# emit a manifest for the hub builder
json.dump(built, open(os.path.join(OUTDIR,"_pages.json"),"w"), indent=1, ensure_ascii=False)
for b in built: print("  %-22s %-26s S%d F%d"%(b["slug"],b["region"],b["nP"],b["nF"]))

# ── Singapore/index.html — the pastel hub ──
# Only these slugs are clickable for now; everything else is greyed while we populate it.
LIVE_SLUGS={"toa-payoh","ho-chi-minh-city"}
LIVE_SLUG="toa-payoh"   # back-compat single check
REGION_ORDER=["Singapore","Malaysia","Thailand","Vietnam","Indonesia","Philippines","Cambodia, Laos & Myanmar"]
byreg=defaultdict(list)
for b in built: byreg[b["region"]].append(b)
TOTAL=sum(b["total"] for b in built)
def esc(s): return s.replace("&","&amp;").replace("<","&lt;")
cards=[]
for reg in REGION_ORDER:
    items=byreg.get(reg,[])
    if not items: continue
    # For now ONLY Toa Payoh is live/clickable; everything else is greyed while we populate it.
    region_has_live = any(b["slug"] in LIVE_SLUGS for b in items)
    hdr = esc(reg) if region_has_live else esc(reg)+' <span class="regnote">· expanding soon</span>'
    cards.append('<h2 class="reg">%s</h2>\n<div class="grid">'%hdr)
    for b in items:
        bits=[]
        if b["nP"]: bits.append("%d sight%s"%(b["nP"],"" if b["nP"]==1 else "s"))
        if b["nF"]: bits.append("%d food"%b["nF"])
        meta=" · ".join(bits)
        live = (b["slug"] in LIVE_SLUGS)
        if live:
            cards.append('<a class="pcard" href="%s.html"><span class="pn">%s</span>'
                         '<span class="pc">%s</span></a>'%(b["slug"],esc(b["name"]),meta))
        else:
            # non-Singapore regions are not yet well populated — greyed out + unclickable for now
            cards.append('<div class="pcard disabled" aria-disabled="true"><span class="pn">%s</span>'
                         '<span class="pc">%s</span><span class="soon">Expanding soon</span></div>'
                         %(esc(b["name"]),meta))
    cards.append("</div>")
HUB="""<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Singapore &amp; Southeast Asia — Pastel Field Guide</title>
<meta name="description" content="A pastel field guide (light &amp; dark) to Singapore's towns and the great cities of Southeast Asia — one page per place, opening on Toa Payoh. %d places, each sourced to Michelin, local news, UNESCO and vetted local/viral creators.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@400;600&family=Newsreader:wght@300;400;500&display=swap" rel="stylesheet">
<style>
 :root{color-scheme:light dark;--iron:#FCF8FB;--slab:#F3ECF6;--hair:#E6DAEA;--patina:#3E9A88;--brass:#B9863A;--rust:#C56F73;--bone:#2E2838;--bone-dim:#6E6480;}
 @media (prefers-color-scheme:dark){:root{--iron:#191521;--slab:#241E30;--hair:#382E48;--patina:#93D6C6;--brass:#E8C57C;--rust:#E4989B;--bone:#ECE7F2;--bone-dim:#A79FB8;}}
 *{box-sizing:border-box;} html{-webkit-text-size-adjust:100%%;}
 body{margin:0;background:var(--iron);color:var(--bone);font-family:"Newsreader",Georgia,serif;font-weight:300;font-size:17px;line-height:1.6;-webkit-font-smoothing:antialiased;}
 .wrap{max-width:1040px;margin:0 auto;padding:0 20px 80px;}
 header{padding:54px 0 8px;}
 .eyebrow{font-family:"JetBrains Mono",monospace;font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--patina);margin:0 0 18px;}
 h1{font-family:"Archivo Black",sans-serif;font-size:clamp(34px,7vw,68px);line-height:.95;letter-spacing:-.03em;text-transform:uppercase;margin:0;}
 h1 .thin{display:block;font-family:"Instrument Serif",serif;font-style:italic;font-weight:400;text-transform:none;color:var(--patina);font-size:clamp(22px,4.6vw,44px);margin-top:8px;}
 .lead{max-width:64ch;color:var(--bone-dim);font-size:18px;margin:22px 0 6px;}
 .lead strong{color:var(--bone);font-weight:500;}
 .back{font-family:"JetBrains Mono",monospace;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--bone-dim);text-decoration:none;}
 .reg{font-family:"JetBrains Mono",monospace;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--brass);margin:38px 0 14px;padding-bottom:8px;border-bottom:1px solid var(--hair);}
 .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px;}
 .pcard{display:flex;flex-direction:column;gap:6px;padding:16px 16px 15px;background:var(--slab);border:1px solid var(--hair);border-radius:12px;text-decoration:none;color:var(--bone);transition:transform .12s,border-color .12s;}
 .pcard:hover{transform:translateY(-2px);border-color:var(--patina);}
 .pcard.disabled{opacity:.5;filter:grayscale(.85);cursor:not-allowed;pointer-events:none;}
 .pcard.disabled:hover{transform:none;border-color:var(--hair);}
 .soon{font-family:"JetBrains Mono",monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--rust);margin-top:3px;}
 .regnote{font-family:"JetBrains Mono",monospace;font-size:10px;letter-spacing:.06em;color:var(--bone-dim);text-transform:none;}
 .pn{font-family:"Archivo Black",sans-serif;font-size:15px;letter-spacing:-.01em;line-height:1.15;}
 .pc{font-family:"JetBrains Mono",monospace;font-size:10.5px;letter-spacing:.04em;color:var(--bone-dim);}
 footer{margin-top:46px;font-family:"JetBrains Mono",monospace;font-size:10.5px;color:var(--bone-dim);}
</style></head>
<body><div class="wrap">
<header>
 <p class="eyebrow">Pastel field guide · light &amp; dark · %d places</p>
 <h1>Singapore<span class="thin">&amp; Southeast Asia — one page per town &amp; city</span></h1>
 <p class="lead">Opening on <strong>Toa Payoh</strong> and reaching across Singapore's towns to the great cities of Southeast Asia. Each place is its own page — the region's food canon (<strong>chicken rice, laksa, char kway teow, bak kut teh, chilli crab, nasi lemak, prata, pho</strong>) and its landmarks — each traceable to the source that named it: Michelin, UNESCO, local news and vetted local/viral creators. Yelp/TripAdvisor never count.</p>
 <p><a class="back" href="../index.html">← all cities (US)</a></p>
</header>
%s
<footer>Sourced &amp; fact-checked via the pipeline · data/sources.json · last verified 2026-08-26</footer>
</div></body></html>"""%(TOTAL,TOTAL,"\n".join(cards))
assert not re.search(r"\\u[0-9a-fA-F]{4}", re.sub(r"<script[\s\S]*?</script>","",HUB)), "literal \\uXXXX escape leaked into the Singapore hub"
open(os.path.join(OUTDIR,"index.html"),"w",encoding="utf-8").write(HUB)
print("wrote Singapore/index.html hub (%d places across %d pages)"%(TOTAL,len(built)))
