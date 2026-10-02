#!/usr/bin/env python3
# Build cities/harrisburg.html from the Cleveland engine + the Harrisburg · York · Lancaster & Amish Country
# dataset (South-Central PA: Harrisburg/West Shore, Hershey, Carlisle, York, Lancaster city, Lancaster County
# Amish country, Gettysburg edge). Standard engine theme. Coordinates injected from geocodes.json["harrisburg-pa"];
# the build FAILS on any missing/UNVERIFIED pin. Same GATE 1 (>=2 credible) + GATE 2 (sourced pin).
import re, os, json
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC  = os.path.join(ROOT, "cleveland.html")
OUT  = os.path.join(ROOT, "cities", "harrisburg.html")
DS   = json.load(open(os.path.join(ROOT, "data", "harrisburg.dataset.json"), encoding="utf-8"))
h    = open(SRC, encoding="utf-8").read()
KEY  = "harrisburg-pa"

_OPEN_CHECK_ONLY = {"YELP", "TRIPADVISOR", "OPENTABLE", "GOOGLE", "GOOGLEMAPS"}
_ELITE_SOLO = {"MICHELIN", "MICHELIN_BIB", "MICHELIN_STAR", "MICHELIN_GREEN", "JAMESBEARD", "NPS", "SMITHSONIAN"}
def _sourced_ok(r):
    c = {t[0] for t in r.get("s", []) if t[0] not in _OPEN_CHECK_ONLY}
    return len(c) >= 2 or bool(c & _ELITE_SOLO)
_undersourced = [r["n"] for r in DS["P"] + DS["F"] if not _sourced_ok(r)]
DS["P"] = [r for r in DS["P"] if _sourced_ok(r)]
DS["F"] = [r for r in DS["F"] if _sourced_ok(r)]
if _undersourced:
    print("NOTE: %d place(s) dropped — <2 credible sources (Yelp counts as 0)." % len(_undersourced))

_REG = json.load(open(os.path.join(ROOT, "data", "geocodes.json"), encoding="utf-8"))["cities"].get(KEY, {})
def _has_pin(n):
    e = _REG.get(n)
    return bool(e and e.get("lat") is not None and e.get("lng") is not None and e.get("source") and e.get("source") != "UNVERIFIED")
_dropped = [r["n"] for r in DS["P"] + DS["F"] if not _has_pin(r["n"])]
DS["P"] = [r for r in DS["P"] if _has_pin(r["n"])]
DS["F"] = [r for r in DS["F"] if _has_pin(r["n"])]
if _dropped:
    print("NOTE: %d place(s) not yet geocoded — dropped (queued for the geocode-helper):" % len(_dropped))
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
    return "{\n" + ",\n".join("  %s:{k:%s,t:%s,u:%s,l:%s}" % (js(k), js(v["k"]), js(v["t"]), js(v["u"]), js(v["l"])) for k, v in d.items()) + "\n}"

AREAS = "[\n" + ",\n".join("  {id:%s,n:%s,c:%s}" % (js(a["id"]), js(a["n"]), js(DS["ac"][a["id"]])) for a in DS["areas"]) + "\n]"
CUIS  = "[\n" + ",\n".join("  {id:%s,n:%s}" % (js(c["id"]), js(c["n"])) for c in DS["cuisines"]) + "\n]"
CATS  = "[\n" + ",\n".join("  {id:%s,n:%s}" % (js(c["id"]), js(c["n"])) for c in DS["cats"]) + "\n]"
P = "[\n" + ",\n".join(rec(r) for r in DS["P"]) + "\n]"
F = "[\n" + ",\n".join(rec(r) for r in DS["F"]) + "\n]"
DATA = ("const S = %s;\n\nconst AREAS = %s;\n\nconst P = %s;\n\nconst FS = %s;\n\nconst CUISINES = %s;\n\nconst CATS = %s;\n\nconst F = %s;"
        % (tbl(DS["S"]), AREAS, P, tbl(DS["FS"]), CUIS, CATS, F))

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

start  = h.index("const S = {")
anchor = h.index("P.forEach((p,i)=>{p.id='s'+i")
new = h[:start] + DATA.strip() + "\n\n" + h[anchor:]
def rep(a, b):
    global new
    assert a in new, "rep target missing: " + a[:70]
    new = new.replace(a, b)

ac = "{" + ",".join("%s:'%s'" % (a["id"], DS["ac"][a["id"]]) for a in DS["areas"]) + "}"
rep("const AC = {DT:'#74AE99',UC:'#C89B4A',WS:'#B45B3E',SUB:'#7E8FC4'};", "const AC = %s;" % ac)

# ── Map centre + area labels DERIVED from the geocoded pins (never hardcoded) ──
from collections import defaultdict as _dd
_pins = {n: (e["lat"], e["lng"]) for n, e in _GEO.items() if e.get("lat") is not None and e.get("lng") is not None}
_lats = [p[0] for p in _pins.values()]; _lngs = [p[1] for p in _pins.values()]
def _pct(vals, q):
    s = sorted(vals); return s[min(len(s) - 1, int(q * len(s)))]
if _lats:
    _clat = round(_pct(_lats, 0.5), 4); _clng = round(_pct(_lngs, 0.5), 4)
    _span = max(_pct(_lats, 0.95) - _pct(_lats, 0.05), (_pct(_lngs, 0.95) - _pct(_lngs, 0.05)) * 0.7)
    _zoom = 13 if _span < 0.05 else 12 if _span < 0.11 else 11 if _span < 0.26 else 10 if _span < 0.55 else 9
else:
    _clat, _clng, _zoom = 40.1, -76.6, 9
_byarea = _dd(list)
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

for a, b in [("cle_trip","hbg_trip"),("cle_seen","hbg_seen"),("cle_gkey","hbg_gkey"),
             ("cleveland-my-list","harrisburg-my-list"),("cleveland-field-guide","harrisburg-field-guide")]:
    new = new.replace(a, b)

LEG = "\n".join('  <span><i style="background:%s"></i>%s</span>' % (DS["ac"][a["id"]], a["n"].split(" (")[0]) for a in DS["areas"])
rep('''  <span><i style="background:var(--c-dt)"></i>Downtown</span>
  <span><i style="background:var(--c-uc)"></i>University Circle &amp; East</span>
  <span><i style="background:var(--c-ws)"></i>West Side &amp; Tremont</span>
  <span><i style="background:var(--c-sub)"></i>Suburbs &amp; day trips</span>''', LEG)

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
                  "so subtle area labels still show even if every tile server is unreachable.")

new = new.replace("all 183 places", "all %d places" % TOTAL)
rep("<title>Cleveland Field Guide — 130 Places, Sourced</title>",
    "<title>Harrisburg, York &amp; Lancaster Field Guide</title>")
rep('<p class="eyebrow">Field guide · every place from all seven sources</p>',
    '<p class="eyebrow">Field guide · South-Central Pennsylvania &amp; Amish Country, sourced</p>')
rep('<h1>Cleveland<span class="thin">the complete odd &amp; overlooked</span></h1>',
    '<h1>Harrisburg · York · Lancaster<span class="thin">Hershey, Amish country &amp; the road to Gettysburg</span></h1>')
rep('<p class="standfirst">143 sights and 40 places to eat, each traceable to the source that named it. <strong>Switch modes below</strong> &mdash; food lives on its own map so it never clutters the sightseeing one. Tick the box on anything to build your own list, then export it to Google or Apple Maps.</p>',
    '<p class="standfirst">%d sights and %d places to eat across <strong>Harrisburg</strong> and the West Shore, <strong>Hershey</strong>, <strong>Carlisle</strong>, <strong>York</strong>, <strong>Lancaster</strong> and the <strong>Amish country</strong> of Lancaster County, with <strong>Gettysburg</strong> as the day-trip edge, each traceable to the source that named it. The food canon is Pennsylvania Dutch: <strong>shoofly pie</strong>, <strong>whoopie pies</strong>, square-noodle <strong>chicken pot pie</strong>, chow-chow, scrapple, <strong>Lititz soft pretzels</strong>, the York&ndash;Hanover snack belt, <strong>Hershey chocolate</strong> and the country&rsquo;s oldest farmers&rsquo; markets. <strong>Switch modes below</strong>, filter by <strong>area</strong> or <strong>collection</strong>, and tick anything to build your own list, then export it to Google or Apple Maps.</p>' % (nP, nF))
new = re.sub(r'<meta name="description"[^>]*>',
    '<meta name="description" content="Harrisburg, York, Lancaster &amp; Amish Country field guide — %d sights and %d places to eat across Harrisburg, Hershey, Carlisle, York, Lancaster, Lancaster County (Intercourse, Bird-in-Hand, Strasburg, Ephrata, Lititz) and Gettysburg, each traceable to its source (LancasterOnline/LNP, PennLive, York Daily Record, Discover Lancaster, Visit Hershey &amp; Harrisburg, Explore York, NPS), on one interactive map with area, collection and cuisine filters, a trip builder and exports.">' % (nP, nF), new)
new = new.replace(", Cleveland OH", ", PA")
new = new.replace(">Cleveland — my list<", ">South-Central PA — my list<")
new = new.replace('placeholder="witchcraft, waterfall, chess, kielbasa…"', 'placeholder="shoofly pie, pretzels, Capitol, battlefield…"')
new = new.replace("? 'laksa, dim sum, pastrami, cannoli…' : 'witchcraft, waterfall, chess, kielbasa…'",
                  "? 'shoofly pie, whoopie pie, pretzels, pot pie…' : 'Capitol, Hershey, covered bridge, Little Round Top…'")
new = new.replace('href="index.html" style="color:var(--bone-dim)', 'href="../index.html" style="color:var(--bone-dim)')

new = new.replace("last verified 2026-08-08", "last verified 2026-08-27")
new = new.replace(
'''  <span style="opacity:.8">Refresh check (Aug 2026, via the pipeline): Sokolowski's University Inn confirmed still closed (kept, flagged); West Side Market open amid a $70M renovation, produce arcade reopened Jan 2026; newly opened since build — Rock &amp; Roll Hall of Fame expansion, Cleveland Metroparks Zoo Primate Forest, Irishtown Bend Park. Findings logged in data/sources.json.</span><br><br>''',
'''  <span style="opacity:.8">Web-researched and fact-checked via the pipeline (data/sources.json, docs/SOURCES.md): sourced across LancasterOnline/LNP, PennLive, the York Daily Record, WITF, Discover Lancaster, Visit Hershey &amp; Harrisburg, Explore York, Destination Gettysburg, the National Park Service and PA DCNR. Every coordinate is verified into data/geocodes.json and every place status-checked; closed places stay on the map, flagged. Places still awaiting a verified pin are held back until one is found.</span><br><br>''')

HBG_APPENDIX = (
 "+ '<div class=\"srcrow\"><span class=\"k\">FOOD RULES</span><div class=\"t\">How the cuisine filters were policed'\n"
 "  + '<span>Every food card names a specific dish — a cuisine label alone doesn’t qualify. The canon is Pennsylvania Dutch: <b>shoofly pie</b>, <b>whoopie pies</b>, the square-noodle <b>chicken pot pie</b>, chow-chow, <b>scrapple</b>, <b>Lititz soft pretzels</b> (Julius Sturgis), the York–Hanover snack belt (Utz, Snyder’s), <b>Hershey</b> chocolate, family-style smorgasbords, and the standing markets (<b>Lancaster Central Market</b>, Harrisburg’s <b>Broad Street Market</b>). Amish farm stands often have no web presence; they still need two credible sources. A cuisine tag names the kitchen’s own tradition, never one dish it happens to serve.</span></div></div>'\n"
 "  + '<div class=\"srcrow\"><span class=\"k\">HOW SOURCED</span><div class=\"t\">Web-searched and fact-checked'\n"
 "  + '<span>Every place is traceable to credible sources — LancasterOnline/LNP, PennLive, the York Daily Record, WITF, Discover Lancaster, Visit Hershey &amp; Harrisburg, Explore York, Destination Gettysburg, the National Park Service, PA DCNR, Smithsonian and official sites — recorded in data/sources.json. Every coordinate is verified into data/geocodes.json and every place status-checked. Yelp/TripAdvisor never count toward the two-source bar.</span></div></div>';"
)
new = re.sub(r"\+ '<div class=\"srcrow\"><span class=\"k\">FOOD RULES.*?</div></div>';", lambda m: HBG_APPENDIX, new, flags=re.S)

assert not re.search(r"\\u[0-9a-fA-F]{4}", re.sub(r"<script[\s\S]*?</script>", "", new)), "literal \\uXXXX escape leaked into visible HTML \u2014 use real characters in page prose, not \\u escapes"
import engine_guard  # no map may ship the Google "API key" base-map surface
new = engine_guard.fix_basemap_tiles(engine_guard.strip_google(new)); engine_guard.assert_no_google(new, OUT)
open(OUT, "w", encoding="utf-8").write(new)
assert "P.forEach((p,i)=>{p.id='s'+i" in new
_leakseg = new[new.index("const S = {"):new.index("const AC =")]
assert "Cleveland" not in re.sub(r"Cleveland Ave(?:nue)?", "", _leakseg), "Cleveland leaked into data"
for a in DS["areas"]:
    n1 = sum(1 for r in DS["P"]+DS["F"] if r["a"]==a["id"] and r["t"]==1)
    assert n1 >= 1, "area %s has no tier-1 must-see" % a["id"]
print("sights: %d  food: %d  total: %d" % (nP, nF, TOTAL))
print("OK wrote", OUT)
