#!/usr/bin/env python3
# Build cities/siliconvalley.html from the Cleveland engine + the Silicon Valley dataset.
# Data comes from data/siliconvalley.dataset.json; coordinates are injected from
# data/geocodes.json cities["silicon-valley-ca"] (the build FAILS on any missing/UNVERIFIED pin).
import re, os, json
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC  = os.path.join(ROOT, "cleveland.html")
OUT  = os.path.join(ROOT, "cities", "siliconvalley.html")
DS   = json.load(open(os.path.join(ROOT, "data", "siliconvalley.dataset.json"), encoding="utf-8"))
h    = open(SRC, encoding="utf-8").read()

# ── GATE 1: multiple sources of truth — a place needs >=2 CREDIBLE sources.
#    Yelp/TripAdvisor/OpenTable are open-verification only and count as ZERO. Enforced here in code
#    (not asserted): any under-sourced place is dropped-and-logged so the published map provably
#    contains only corroborated places. Mirror of tools/sourcecheck.py.
_OPEN_CHECK_ONLY = {"YELP", "TRIPADVISOR", "OPENTABLE", "GOOGLE", "GOOGLEMAPS"}
_ELITE_SOLO = {"MICHELIN", "MICHELIN_BIB", "MICHELIN_STAR", "MICHELIN_GREEN", "JAMESBEARD", "NPS"}
def _sourced_ok(r):
    c = {t[0] for t in r.get("s", []) if t[0] not in _OPEN_CHECK_ONLY}
    return len(c) >= 2 or bool(c & _ELITE_SOLO)   # >=2 credible, OR a lone institutional authority
_undersourced = [r["n"] for r in DS["P"] + DS["F"] if not _sourced_ok(r)]
DS["P"] = [r for r in DS["P"] if _sourced_ok(r)]
DS["F"] = [r for r in DS["F"] if _sourced_ok(r)]
if _undersourced:
    print("NOTE: %d place(s) dropped — <2 credible sources (MULTIPLE-SOURCES-OF-TRUTH gate; Yelp counts as 0)." % len(_undersourced))
    print("      Re-source them (tools/sourcecheck.py --list) before they can appear.")

# ── GATE 2: verified location — a place needs a sourced place pin in the registry.
_REG = json.load(open(os.path.join(ROOT, "data", "geocodes.json"), encoding="utf-8"))["cities"].get("silicon-valley-ca", {})
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
_GEO = json.load(open(os.path.join(ROOT, "data", "geocodes.json"), encoding="utf-8"))["cities"]["silicon-valley-ca"]
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

# marker colours
ac = "{" + ",".join("%s:'%s'" % (a["id"], DS["ac"][a["id"]]) for a in DS["areas"]) + "}"
rep("const AC = {DT:'#74AE99',UC:'#C89B4A',WS:'#B45B3E',SUB:'#7E8FC4'};", "const AC = %s;" % ac)
# ── Map centre + area labels are DERIVED from the geocoded pins — never hardcoded. A build cloned
#    from another city that forgot to swap coordinates would otherwise land on the wrong city; deriving
#    them makes that class of bug structurally impossible. (see docs/PIPELINE.md Stage 6)
from collections import defaultdict as _dd
_pins = {n: (e["lat"], e["lng"]) for n, e in _GEO.items()
         if e.get("lat") is not None and e.get("lng") is not None}
_lats = [p[0] for p in _pins.values()]; _lngs = [p[1] for p in _pins.values()]
def _pct(vals, q):
    s = sorted(vals); return s[min(len(s) - 1, int(q * len(s)))]
if _lats:
    _clat = round(_pct(_lats, 0.5), 4); _clng = round(_pct(_lngs, 0.5), 4)   # median → centre on the density
    _span = max(_pct(_lats, 0.95) - _pct(_lats, 0.05), (_pct(_lngs, 0.95) - _pct(_lngs, 0.05)) * 0.7)
    _zoom = 13 if _span < 0.05 else 12 if _span < 0.11 else 11 if _span < 0.26 else 10 if _span < 0.55 else 9
else:
    _clat, _clng, _zoom = 37.37, -122.02, 11          # empty-registry fallback only
_byarea = _dd(list); _aname = {a["id"]: a["n"] for a in DS["areas"]}
for _r in DS["P"] + DS["F"]:
    if _r["n"] in _pins: _byarea[_r["a"]].append(_pins[_r["n"]])
_labels = []
for _a in DS["areas"]:                                # one label per area, at its pin centroid
    _pts = _byarea.get(_a["id"])
    if not _pts: continue
    _la = round(sum(p[0] for p in _pts) / len(_pts), 4); _lo = round(sum(p[1] for p in _pts) / len(_pts), 4)
    _short = _a["n"].split(",")[0].split(" & ")[0].split(" &amp; ")[0].strip()
    _labels.append([_short, _la, _lo])
_labels_js = "const LABELS=" + json.dumps(_labels, ensure_ascii=False) + ";"
rep("setView([41.4993,-81.6944],11)", "setView([%s,%s],%d)" % (_clat, _clng, _zoom))
# storage keys + export filenames
for a, b in [("cle_trip","sv_trip"),("cle_seen","sv_seen"),("cle_gkey","sv_gkey"),
             ("cleveland-my-list","siliconvalley-my-list"),("cleveland-field-guide","siliconvalley-field-guide")]:
    new = new.replace(a, b)
# legend swatches
LEG = "\n".join('  <span><i style="background:%s"></i>%s</span>' % (DS["ac"][a["id"]], a["n"]) for a in DS["areas"])
rep('''  <span><i style="background:var(--c-dt)"></i>Downtown</span>
  <span><i style="background:var(--c-uc)"></i>University Circle &amp; East</span>
  <span><i style="background:var(--c-ws)"></i>West Side &amp; Tremont</span>
  <span><i style="background:var(--c-sub)"></i>Suburbs &amp; day trips</span>''', LEG)
# map backdrop labels → Silicon Valley municipalities (drop the Lake Erie polygon; keep neutral labels)
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
                  "so subtle municipality labels still show even if every tile server is unreachable.")
# counts + headings + branding
new = new.replace("all 183 places", "all %d places" % TOTAL)
rep("<title>Cleveland Field Guide — 130 Places, Sourced</title>",
    "<title>Silicon Valley Field Guide — Sourced</title>")
rep('<p class="eyebrow">Field guide · every place from all seven sources</p>',
    '<p class="eyebrow">Field guide · the Santa Clara Valley, sourced</p>')
rep('<h1>Cleveland<span class="thin">the complete odd &amp; overlooked</span></h1>',
    '<h1>Silicon Valley<span class="thin">the South Bay &mdash; tech, trails &amp; the best Asian tables in America</span></h1>')
rep('<p class="standfirst">143 sights and 40 places to eat, each traceable to the source that named it. <strong>Switch modes below</strong> &mdash; food lives on its own map so it never clutters the sightseeing one. Tick the box on anything to build your own list, then export it to Google or Apple Maps.</p>',
    '<p class="standfirst">%d sights and %d places to eat across Palo Alto, Mountain View, Sunnyvale, Cupertino, Santa Clara and San Jose, each traceable to the source that named it. The Valley\\u2019s food is its immigrant density &mdash; arguably the best Taiwanese, Vietnamese and South Indian eating in the country. <strong>Switch modes below</strong>, filter by <strong>city</strong> or <strong>collection</strong>, and tick anything to build your own list, then export it to Google or Apple Maps.</p>' % (nP, nF))
new = re.sub(r'<meta name="description"[^>]*>',
    '<meta name="description" content="Silicon Valley field guide — %d sights and %d places to eat across Palo Alto, Mountain View, Sunnyvale, Cupertino, Santa Clara and San Jose, each traceable to its source (Michelin, Eater SF, The Infatuation, SF Chronicle, Mercury News, Atlas Obscura), on one interactive map with city, collection and cuisine filters, a trip builder and exports.">' % (nP, nF), new)
new = new.replace(", Cleveland OH", ", San Jose CA")
new = new.replace(">Cleveland \\u2014 my list<", ">Silicon Valley \\u2014 my list<").replace(">Cleveland — my list<", ">Silicon Valley — my list<")
new = new.replace('placeholder="witchcraft, waterfall, chess, kielbasa…"', 'placeholder="dosa, boba, Stanford, dim sum…"')
new = new.replace("? 'laksa, dim sum, pastrami, cannoli\\u2026' : 'witchcraft, waterfall, chess, kielbasa\\u2026'",
                  "? 'beef noodle, dosa, dim sum, boba\\u2026' : 'Apple Park, mission, redwoods, HP garage\\u2026'")
new = new.replace('href="index.html" style="color:var(--bone-dim)', 'href="../index.html" style="color:var(--bone-dim)')

# footer provenance note + dates
new = new.replace("last verified 2026-08-08", "last verified 2026-08-14")
new = new.replace(
'''  <span style="opacity:.8">Refresh check (Aug 2026, via the pipeline): Sokolowski's University Inn confirmed still closed (kept, flagged); West Side Market open amid a $70M renovation, produce arcade reopened Jan 2026; newly opened since build — Rock &amp; Roll Hall of Fame expansion, Cleveland Metroparks Zoo Primate Forest, Irishtown Bend Park. Findings logged in data/sources.json.</span><br><br>''',
'''  <span style="opacity:.8">Web-researched and fact-checked via the pipeline (data/sources.json, docs/SOURCES.md): sourced across Michelin (stars + Bib Gourmand), Eater SF, The Infatuation, the San Francisco Chronicle, the San Jose Mercury News, Atlas Obscura and official municipal / state-park sites. Every coordinate is verified into data/geocodes.json and every place status-checked open. A handful of newly-added spots are pending a final coordinate pass before they appear.</span><br><br>''')
# appendix — cuisine rules + how-sourced
SV_APPENDIX = (
 "+ '<div class=\"srcrow\"><span class=\"k\">FOOD RULES</span><div class=\"t\">How the cuisine filters were policed'\n"
 "  + '<span>Every food card names a specific dish \\u2014 a cuisine label alone doesn\\u2019t qualify. The Valley\\u2019s signature strength is immigrant density: <b>Taiwanese</b> (Cupertino/Sunnyvale), <b>Vietnamese</b> (San Jose\\u2019s Little Saigon, the largest outside Vietnam), <b>South Indian</b> (Sunnyvale/Milpitas) and the American <b>boba</b> scene the region invented each got a dedicated search led by Michelin, Eater SF, The Infatuation and the SF Chronicle. A cuisine tag names the kitchen\\u2019s own tradition, never one dish it happens to serve.</span></div></div>'\n"
 "  + '<div class=\"srcrow\"><span class=\"k\">HOW SOURCED</span><div class=\"t\">Web-searched and fact-checked'\n"
 "  + '<span>Every place is traceable to a credible source \\u2014 Michelin, Eater SF, The Infatuation, SF Chronicle, Mercury News, Atlas Obscura and official sites \\u2014 recorded in data/sources.json (direct map/page fetches are blocked in the build environment, so sources were confirmed via search). Every coordinate is verified into data/geocodes.json and every place status-checked open.</span></div></div>';"
)
new = re.sub(r"\+ '<div class=\"srcrow\"><span class=\"k\">FOOD RULES.*?</div></div>';", lambda m: SV_APPENDIX, new, flags=re.S)

open(OUT, "w", encoding="utf-8").write(new)
assert "P.forEach((p,i)=>{p.id='s'+i" in new
# "Cleveland Ave(nue)" is a real street in several of these metros; exempt it so this engine-leak
# guard fires only on a genuine template-data leak (Cleveland place names or a "Cleveland, OH"
# address city), never on a legitimate local address.
_leakseg = new[new.index("const S = {"):new.index("const AC =")]
assert "Cleveland" not in re.sub(r"Cleveland Ave(?:nue)?", "", _leakseg), "Cleveland leaked into data"
for a in DS["areas"]:
    n1 = sum(1 for r in DS["P"]+DS["F"] if r["a"]==a["id"] and r["t"]==1)
    assert n1 >= 1, "area %s has no tier-1 must-see" % a["id"]
print("sights: %d  food: %d  total: %d" % (nP, nF, TOTAL))
print("remaining 'Cleveland' mentions:", new.count("Cleveland"))
print("OK wrote", OUT)
