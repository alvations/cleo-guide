#!/usr/bin/env python3
# Build cities/singapore.html from the Cleveland engine + the Singapore/SEA dataset.
# Same engine, same gates as every other dataset city — the ONLY departures are (a) the geography /
# prose, and (b) a PASTEL LIGHT+DARK theme injected over the engine's fixed dark palette. The engine is
# CSS-variable driven (:root), so the theme is a clean :root swap + a prefers-color-scheme:dark override
# + a light-default basemap; nothing else about the engine changes.
# Coordinates are injected from data/geocodes.json cities["singapore"] (build FAILS on any missing pin).
import re, os, json
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC  = os.path.join(ROOT, "cleveland.html")
OUT  = os.path.join(ROOT, "cities", "singapore.html")
DS   = json.load(open(os.path.join(ROOT, "data", "singapore.dataset.json"), encoding="utf-8"))
h    = open(SRC, encoding="utf-8").read()
KEY  = "singapore"

# ── GATE 1: >=2 CREDIBLE sources (Yelp/TripAdvisor/OpenTable/Google = 0), or a lone institutional authority.
_OPEN_CHECK_ONLY = {"YELP", "TRIPADVISOR", "OPENTABLE", "GOOGLE", "GOOGLEMAPS"}
_ELITE_SOLO = {"MICHELIN", "MICHELIN_BIB", "MICHELIN_STAR", "MICHELIN_GREEN", "JAMESBEARD", "NPS", "SMITHSONIAN", "UNESCO"}
def _sourced_ok(r):
    c = {t[0] for t in r.get("s", []) if t[0] not in _OPEN_CHECK_ONLY}
    return len(c) >= 2 or bool(c & _ELITE_SOLO)
_undersourced = [r["n"] for r in DS["P"] + DS["F"] if not _sourced_ok(r)]
DS["P"] = [r for r in DS["P"] if _sourced_ok(r)]
DS["F"] = [r for r in DS["F"] if _sourced_ok(r)]
if _undersourced:
    print("NOTE: %d place(s) dropped — <2 credible sources (Yelp counts as 0)." % len(_undersourced))

# ── GATE 2: verified location — a place needs a sourced place pin in the registry.
_REG = json.load(open(os.path.join(ROOT, "data", "geocodes.json"), encoding="utf-8"))["cities"].get(KEY, {})
def _has_pin(n):
    e = _REG.get(n)
    return bool(e and e.get("lat") is not None and e.get("lng") is not None
                and e.get("source") and e.get("source") != "UNVERIFIED")
_dropped = [r["n"] for r in DS["P"] + DS["F"] if not _has_pin(r["n"])]
DS["P"] = [r for r in DS["P"] if _has_pin(r["n"])]
DS["F"] = [r for r in DS["F"] if _has_pin(r["n"])]
if _dropped:
    print("NOTE: %d place(s) not yet geocoded — dropped from this build (queued for the geocode-helper):" % len(_dropped))
    for n in _dropped: print("   -", n)

def js(v): return json.dumps(v, ensure_ascii=False)

def rec(r):
    parts = ["t:%d" % r["t"], "a:%s" % js(r["a"]), "n:%s" % js(r["n"]), "ad:%s" % js(r["ad"]),
             "la:0.00000", "ln:0.00000", "w:%s" % js(r["w"])]
    if r.get("k"):     parts.append("k:%s" % js(r["k"]))
    if r.get("warn"):  parts.append("warn:1")
    if r.get("closed"):parts.append("closed:1")
    if r.get("cz"):    parts.insert(4, "cz:[%s]" % ",".join(js(c) for c in r["cz"]))
    if r.get("g"):     parts.append("g:[%s]" % ",".join(js(c) for c in r["g"]))
    parts.append("s:[%s]" % ",".join("[%s,%s]" % (js(t[0]), js(t[1])) for t in r["s"]))
    return "{" + ",".join(parts) + "}"

def tbl(d):
    rows = ["  %s:{k:%s,t:%s,u:%s,l:%s}" % (js(k), js(v["k"]), js(v["t"]), js(v["u"]), js(v["l"]))
            for k, v in d.items()]
    return "{\n" + ",\n".join(rows) + "\n}"

AREAS = "[\n" + ",\n".join("  {id:%s,n:%s,c:%s}" % (js(a["id"]), js(a["n"]), js(DS["ac"][a["id"]]))
                           for a in DS["areas"]) + "\n]"
CUIS  = "[\n" + ",\n".join("  {id:%s,n:%s}" % (js(c["id"]), js(c["n"])) for c in DS["cuisines"]) + "\n]"
CATS  = "[\n" + ",\n".join("  {id:%s,n:%s}" % (js(c["id"]), js(c["n"])) for c in DS["cats"]) + "\n]"
P = "[\n" + ",\n".join(rec(r) for r in DS["P"]) + "\n]"
F = "[\n" + ",\n".join(rec(r) for r in DS["F"]) + "\n]"

DATA = ("const S = %s;\n\nconst AREAS = %s;\n\nconst P = %s;\n\n"
        "const FS = %s;\n\nconst CUISINES = %s;\n\nconst CATS = %s;\n\nconst F = %s;"
        % (tbl(DS["S"]), AREAS, P, tbl(DS["FS"]), CUIS, CATS, F))

# ── inject verified coordinates from the central registry ──
_GEO = _REG
def _decode(raw):
    try: return json.loads('"' + raw + '"')
    except Exception: return raw
def _pf_names(s):
    names = []
    for marker in ("const P = [", "const F = ["):
        i = s.find(marker); j = s.find("\n];", i) if s.find("\n];", i) > 0 else len(s)
        names += re.findall(r'n:"((?:[^"\\]|\\.)*)"', s[i:j])
    return names
_missing = []
for _name in _pf_names(DATA):
    e = _GEO.get(_decode(_name)) or _GEO.get(_name)
    if not e or e.get("lat") is None or e.get("lng") is None or not e.get("source") or e.get("source") == "UNVERIFIED":
        _missing.append(_decode(_name)); continue
    k = 'n:"' + _name + '"'; i = DATA.find(k); j = min(len(DATA), i + 900); seg = DATA[i:j]
    seg = re.sub(r'la:-?\d+\.\d+', "la:%.5f" % e["lat"], seg, count=1)
    seg = re.sub(r'ln:-?\d+\.\d+', "ln:%.5f" % e["lng"], seg, count=1)
    DATA = DATA[:i] + seg + DATA[j:]
assert not _missing, "GEOCODE GATE FAILED — %d place(s) lack a verified geocode: %s" % (len(_missing), _missing[:12])

nP = len(DS["P"]); nF = len(DS["F"]); TOTAL = nP + nF
print("geocodes: injected verified coords for", nP + nF, "places (0 missing)")

# ── splice DATA into the engine ──
start  = h.index("const S = {")
anchor = h.index("P.forEach((p,i)=>{p.id='s'+i")
new = h[:start] + DATA.strip() + "\n\n" + h[anchor:]

def rep(a, b):
    global new
    assert a in new, "rep target missing: " + a[:70]
    new = new.replace(a, b)

# ══════════════════════════════════════════════════════════════════════════════════════════════════
# PASTEL LIGHT + DARK THEME  — the only visual departure from the engine.
# The engine's whole palette is CSS variables in :root, so a light-default swap + a
# prefers-color-scheme:dark override re-skins every element consistently. Soft pastels in both modes.
# ══════════════════════════════════════════════════════════════════════════════════════════════════
rep(
"""  :root{
    --iron:#12171A; --slab:#1B2226; --hair:#2E393E;
    --patina:#74AE99; --patina-dim:#3E5D53;
    --brass:#C89B4A; --rust:#B45B3E;
    --bone:#E9E5DB; --bone-dim:#9AA3A2;
    --c-dt:#74AE99; --c-uc:#C89B4A; --c-ws:#B45B3E; --c-sub:#7E8FC4;
  }""",
"""  /* Pastel theme — LIGHT is the default :root; DARK overrides via prefers-color-scheme.
     Both modes stay soft/pastel. Marker --c-* are overridden per-area by const AC below. */
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
  }}""")
# leaflet map background follows the theme (was a hardcoded near-black)
rep(".leaflet-container{background:#0E1316;}", ".leaflet-container{background:var(--slab);}")
# the OSM-darkening filter must apply ONLY in dark mode — in light mode light tiles suit the light UI
rep(".osmdark .leaflet-tile-pane{filter:invert(1) hue-rotate(180deg) brightness(.92) contrast(.87) saturate(.55);}",
    ".osmdark .leaflet-tile-pane{filter:none;}\n"
    "  @media (prefers-color-scheme:dark){.osmdark .leaflet-tile-pane{filter:invert(1) hue-rotate(180deg) brightness(.92) contrast(.87) saturate(.55);}}")
# default basemap keyed to the viewer's colour scheme: Positron (light) by day, Carto dark by night
rep("setBase('dark'); markBaseChips();",
    "setBase((window.matchMedia&&window.matchMedia('(prefers-color-scheme:dark)').matches)?'dark':'light'); markBaseChips();")
# derived map labels: theme-neutral colour + soft halo that reads on both light and dark tiles
rep("color:#6E7C7B;white-space:nowrap;text-shadow:0 0 5px #12171A",
    "color:#8C8498;white-space:nowrap;text-shadow:0 1px 3px rgba(0,0,0,.28),0 0 3px rgba(255,255,255,.35)")

# ── marker colours ──
ac = "{" + ",".join("%s:'%s'" % (a["id"], DS["ac"][a["id"]]) for a in DS["areas"]) + "}"
rep("const AC = {DT:'#74AE99',UC:'#C89B4A',WS:'#B45B3E',SUB:'#7E8FC4'};", "const AC = %s;" % ac)

# ── Map centre: ANCHOR on Toa Payoh (the brief's opening view). Labels are still DERIVED from the
#    pins. buildcheck only requires the centre sit inside the pin bounds — Toa Payoh does. ──
from collections import defaultdict as _dd
_pins = {n: (e["lat"], e["lng"]) for n, e in _GEO.items()
         if e.get("lat") is not None and e.get("lng") is not None}
_TOA_PAYOH = (1.3343, 103.8479)   # Toa Payoh Central / Town Park
_clat, _clng, _zoom = _TOA_PAYOH[0], _TOA_PAYOH[1], 13
_byarea = _dd(list); _aname = {a["id"]: a["n"] for a in DS["areas"]}
for _r in DS["P"] + DS["F"]:
    if _r["n"] in _pins: _byarea[_r["a"]].append(_pins[_r["n"]])
_labels = []
for _a in DS["areas"]:
    _pts = _byarea.get(_a["id"])
    if not _pts: continue
    _la = round(sum(p[0] for p in _pts) / len(_pts), 4); _lo = round(sum(p[1] for p in _pts) / len(_pts), 4)
    _short = _a["n"].split("(")[0].split(",")[0].split(" & ")[0].split(" &amp; ")[0].strip()
    _labels.append([_short, _la, _lo])
_labels_js = "const LABELS=" + json.dumps(_labels, ensure_ascii=False) + ";"
rep("setView([41.4993,-81.6944],11)", "setView([%s,%s],%d)" % (_clat, _clng, _zoom))

# ── storage keys + export filenames ──
for a, b in [("cle_trip","sg_trip"),("cle_seen","sg_seen"),("cle_gkey","sg_gkey"),
             ("cleveland-my-list","singapore-my-list"),("cleveland-field-guide","singapore-field-guide")]:
    new = new.replace(a, b)

# ── legend swatches (one per area, pastel) ──
LEG = "\n".join('  <span><i style="background:%s"></i>%s</span>' % (DS["ac"][a["id"]], a["n"].split(" (")[0]) for a in DS["areas"])
rep('''  <span><i style="background:var(--c-dt)"></i>Downtown</span>
  <span><i style="background:var(--c-uc)"></i>University Circle &amp; East</span>
  <span><i style="background:var(--c-ws)"></i>West Side &amp; Tremont</span>
  <span><i style="background:var(--c-sub)"></i>Suburbs &amp; day trips</span>''', LEG)

# ── map backdrop → area labels only (derived), drop the Lake Erie/Cuyahoga vector geography ──
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
_labels_js + '''

// Real geography comes from the tiles; here we add only area labels (derived from pin centroids).
backdrop=L.layerGroup().addTo(map);
LABELS.forEach(''')
new = new.replace("so the map still shows Lake Erie, the\n   Cuyahoga and the main arteries even if every tile server is unreachable.",
                  "so subtle region labels still show even if every tile server is unreachable.")

# ── counts + headings + branding + prose ──
new = new.replace("all 183 places", "all %d places" % TOTAL)
rep("<title>Cleveland Field Guide — 130 Places, Sourced</title>",
    "<title>Singapore &amp; Southeast Asia — Pastel Field Guide</title>")
rep('<p class="eyebrow">Field guide · every place from all seven sources</p>',
    '<p class="eyebrow">Field guide · Singapore towns &amp; Southeast Asian cities, sourced</p>')
rep('<h1>Cleveland<span class="thin">the complete odd &amp; overlooked</span></h1>',
    '<h1>Singapore<span class="thin">&amp; Southeast Asia &mdash; hawker towns to temple cities</span></h1>')
rep('<p class="standfirst">143 sights and 40 places to eat, each traceable to the source that named it. <strong>Switch modes below</strong> &mdash; food lives on its own map so it never clutters the sightseeing one. Tick the box on anything to build your own list, then export it to Google or Apple Maps.</p>',
    '<p class="standfirst">%d sights and %d places to eat &mdash; opening on <strong>Toa Payoh</strong> and reaching across Singapore\\u2019s towns to the great cities of Southeast Asia. The food canon is the region\\u2019s own: <strong>Hainanese chicken rice</strong>, <strong>laksa</strong>, <strong>char kway teow</strong>, <strong>bak kut teh</strong>, <strong>chilli crab</strong>, <strong>nasi lemak</strong>, roti prata, satay, pho and nasi padang &mdash; each traceable to the source that named it. Renders in soft pastel, <strong>light or dark</strong>. <strong>Switch modes below</strong>, filter by <strong>town/city</strong> or <strong>collection</strong>, and tick anything to build your own list, then export it to Google or Apple Maps.</p>' % (nP, nF))
new = re.sub(r'<meta name="description"[^>]*>',
    '<meta name="description" content="Singapore &amp; Southeast Asia field guide — %d sights and %d places to eat, opening on Toa Payoh and spanning Singapore\'s towns plus Kuala Lumpur, Penang, Bangkok, Ho Chi Minh City, Bali, Manila and more, each traceable to its source (Michelin, The Straits Times, Seth Lui, Eatbook, CNA, Time Out and official sites). One interactive pastel map (light &amp; dark) with town/city, collection and cuisine filters, a trip builder and exports.">' % (nP, nF), new)
new = new.replace(", Cleveland OH", ", Singapore")
new = new.replace(">Cleveland \\u2014 my list<", ">Singapore \\u2014 my list<").replace(">Cleveland — my list<", ">Singapore — my list<")
new = new.replace('placeholder="witchcraft, waterfall, chess, kielbasa…"', 'placeholder="chicken rice, laksa, char kway teow, satay…"')
new = new.replace("? 'laksa, dim sum, pastrami, cannoli\\u2026' : 'witchcraft, waterfall, chess, kielbasa\\u2026'",
                  "? 'chicken rice, laksa, prata, bak kut teh\\u2026' : 'Merlion, Gardens by the Bay, temples, hawker centres\\u2026'")
new = new.replace('href="index.html" style="color:var(--bone-dim)', 'href="../index.html" style="color:var(--bone-dim)')

# ── footer provenance note + dates ──
new = new.replace("last verified 2026-08-08", "last verified 2026-08-26")
new = new.replace(
'''  <span style="opacity:.8">Refresh check (Aug 2026, via the pipeline): Sokolowski's University Inn confirmed still closed (kept, flagged); West Side Market open amid a $70M renovation, produce arcade reopened Jan 2026; newly opened since build — Rock &amp; Roll Hall of Fame expansion, Cleveland Metroparks Zoo Primate Forest, Irishtown Bend Park. Findings logged in data/sources.json.</span><br><br>''',
'''  <span style="opacity:.8">Web-researched and fact-checked via the pipeline (data/sources.json, docs/SOURCES.md): sourced across the Michelin Guide, The Straits Times, CNA, Seth Lui, Eatbook, Miss Tam Chiak, Time Out, Visit Singapore and each city\\u2019s credible outlets. Every coordinate is verified into data/geocodes.json and every place status-checked open. Some newly-added spots are pending a final coordinate pass before they appear.</span><br><br>''')

# ── appendix — cuisine rules + how-sourced ──
SG_APPENDIX = (
 "+ '<div class=\"srcrow\"><span class=\"k\">FOOD RULES</span><div class=\"t\">How the cuisine filters were policed'\n"
 "  + '<span>Every food card names a specific dish \\u2014 a cuisine label alone doesn\\u2019t qualify. Southeast Asia\\u2019s food story is its own: <b>Hainanese chicken rice</b>, <b>laksa</b>, <b>char kway teow</b>, <b>Hokkien mee</b>, <b>bak kut teh</b>, <b>nasi lemak</b>, <b>satay</b>, <b>roti prata</b>, <b>chilli crab</b>, <b>nasi padang</b>, <b>pho</b> and <b>banh mi</b>. A cuisine tag names the KITCHEN\\u2019s own tradition, never a single shared dish \\u2014 chicken rice is cooked by Hainanese, Malay and Thai kitchens alike, so categorise by the kitchen\\u2019s origin. Sourced to the Michelin Guide, The Straits Times, Seth Lui, Eatbook, Miss Tam Chiak and each city\\u2019s outlets.</span></div></div>'\n"
 "  + '<div class=\"srcrow\"><span class=\"k\">HOW SOURCED</span><div class=\"t\">Web-searched and fact-checked'\n"
 "  + '<span>Every place is traceable to a credible source \\u2014 Michelin, The Straits Times, CNA, Seth Lui, Eatbook, Time Out, Atlas Obscura, UNESCO and official sites \\u2014 recorded in data/sources.json (direct fetches are blocked in the build environment, so sources were confirmed via search). Every coordinate is verified into data/geocodes.json and every place status-checked open. Yelp/TripAdvisor never count toward the two-source bar.</span></div></div>';"
)
new = re.sub(r"\+ '<div class=\"srcrow\"><span class=\"k\">FOOD RULES.*?</div></div>';", lambda m: SG_APPENDIX, new, flags=re.S)

open(OUT, "w", encoding="utf-8").write(new)
assert "P.forEach((p,i)=>{p.id='s'+i" in new
# engine-leak guard: no Cleveland data should survive. (No 'Cleveland Ave' in SEA, so the bare check is fine.)
_leakseg = new[new.index("const S = {"):new.index("const AC =")]
assert "Cleveland" not in _leakseg, "Cleveland leaked into data"
for a in DS["areas"]:
    n1 = sum(1 for r in DS["P"]+DS["F"] if r["a"]==a["id"] and r["t"]==1)
    assert n1 >= 1, "area %s has no tier-1 must-see" % a["id"]
print("sights: %d  food: %d  total: %d" % (nP, nF, TOTAL))
print("OK wrote", OUT)
