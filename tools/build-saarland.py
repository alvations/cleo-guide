#!/usr/bin/env python3
# Build cities/saarland.html from the Cleveland engine + the Saarbrücken / Greater Region (SaarLorLux)
# dataset. Region = a cross-border guide anchored on Saarbrücken: Saarland (DE) + French Moselle/Lorraine
# (FR) + Luxembourg (LU) + the German Mosel & Trier (DE). Coordinates injected from geocodes.json["saarland"];
# build FAILS on any missing/UNVERIFIED pin. Areas with no gated+geocoded place are dropped. Centre is the
# trimmed-bounds midpoint (a cross-border spread, like a corridor — never the median). Same gates as every city.
import re, os, json
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC  = os.path.join(ROOT, "cleveland.html")
OUT  = os.path.join(ROOT, "cities", "saarland.html")
DS   = json.load(open(os.path.join(ROOT, "data", "saarland.dataset.json"), encoding="utf-8"))
h    = open(SRC, encoding="utf-8").read()
KEY  = "saarland"

_OPEN_CHECK_ONLY = {"YELP", "TRIPADVISOR", "OPENTABLE", "GOOGLE", "GOOGLEMAPS"}
_ELITE_SOLO = {"MICHELIN", "MICHELIN_BIB", "MICHELIN_STAR", "MICHELIN_GREEN", "GAULTMILLAU", "UNESCO"}
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

# Only keep areas that still have a gated+geocoded place.
_live_areas = {r["a"] for r in DS["P"] + DS["F"]}
DS["areas"] = [a for a in DS["areas"] if a["id"] in _live_areas]

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

from collections import defaultdict as _dd
_pins = {n: (e["lat"], e["lng"]) for n, e in _GEO.items() if e.get("lat") is not None and e.get("lng") is not None}
_lats = [p[0] for p in _pins.values()]; _lngs = [p[1] for p in _pins.values()]
def _pct(vals, q):
    s = sorted(vals); return s[min(len(s) - 1, int(q * len(s)))]
if _lats:
    # Centre on the MIDPOINT of the (outlier-trimmed P05..P95) pin bounds, NOT the median. This is a
    # cross-border spread (Saarbrücken/Saarland ↔ Metz ↔ Luxembourg ↔ Trier/Mosel); the median would land
    # in whichever area has the most pins and shove the others to the edge. The trimmed-bounds midpoint
    # centres the frame on the geographic middle of the whole Greater Region so every area sits in view.
    _lo_la, _hi_la = _pct(_lats, 0.05), _pct(_lats, 0.95)
    _lo_ln, _hi_ln = _pct(_lngs, 0.05), _pct(_lngs, 0.95)
    _clat = round((_lo_la + _hi_la) / 2, 4); _clng = round((_lo_ln + _hi_ln) / 2, 4)
    _span = max(_hi_la - _lo_la, (_hi_ln - _lo_ln) * 0.7)
    _zoom = 13 if _span < 0.05 else 12 if _span < 0.11 else 11 if _span < 0.26 else 10 if _span < 0.55 else 9 if _span < 1.1 else 8
else:
    _clat, _clng, _zoom = 49.2340, 6.9969, 8   # Saarbrücken
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

for a, b in [("cle_trip","sr_trip"),("cle_seen","sr_seen"),("cle_gkey","sr_gkey"),
             ("cleveland-my-list","saarland-my-list"),("cleveland-field-guide","saarland-field-guide")]:
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
    "<title>Saarbrücken &amp; the Greater Region (SaarLorLux) Field Guide — Sourced</title>")
rep('<p class="eyebrow">Field guide · every place from all seven sources</p>',
    '<p class="eyebrow">Field guide · Saarbrücken &amp; the Greater Region, sourced</p>')
rep('<h1>Cleveland<span class="thin">the complete odd &amp; overlooked</span></h1>',
    '<h1>Saarbrücken<span class="thin">&amp; the Greater Region — Saarland · Lorraine · Luxembourg · Mosel</span></h1>')
rep('<p class="standfirst">143 sights and 40 places to eat, each traceable to the source that named it. <strong>Switch modes below</strong> &mdash; food lives on its own map so it never clutters the sightseeing one. Tick the box on anything to build your own list, then export it to Google or Apple Maps.</p>',
    '<p class="standfirst">%d sights and %d places to eat across the cross-border <strong>Greater Region</strong> &mdash; anchored on <strong>Saarbrücken</strong> and reaching to <strong>Metz &amp; Sarreguemines</strong> (FR), <strong>Luxembourg</strong>, and <strong>Trier &amp; the Mosel</strong> (DE). The UNESCO trio — the <strong>Völklinger Hütte</strong>, Roman <strong>Trier</strong>, and Luxembourg’s fortifications — and a food canon all its own: the Saarland <strong>Schwenker</strong>, Luxembourg’s <strong>Judd mat Gaardebounen</strong>, Lorraine <strong>quiche</strong> &amp; mirabelle, and <strong>Mosel Riesling</strong>, out to a deep Michelin bench. <strong>Switch modes below</strong>, filter by <strong>area</strong> or <strong>collection</strong>, and tick anything to build your own list, then export it to Google or Apple Maps.</p>' % (nP, nF))
new = re.sub(r'<meta name="description"[^>]*>',
    '<meta name="description" content="Saarbrücken &amp; the Greater Region (SaarLorLux) field guide — %d sights and %d places to eat across Saarland, French Moselle/Lorraine (Metz, Sarreguemines), Luxembourg and the German Mosel &amp; Trier, each traceable to its source (Michelin, UNESCO, Saarbrücker Zeitung, Le Républicain Lorrain, Luxembourg Times, DW Travel) on one interactive map with area, collection and cuisine filters, a trip builder and exports.">' % (nP, nF), new)
new = new.replace(", Cleveland OH", ", Saarbrücken")
new = new.replace(">Cleveland — my list<", ">Greater Region — my list<").replace(">Cleveland — my list<", ">Greater Region — my list<")
new = new.replace('placeholder="witchcraft, waterfall, chess, kielbasa…"', 'placeholder="Schwenker, Riesling, Porta Nigra, quiche…"')
new = new.replace("? 'laksa, dim sum, pastrami, cannoli…' : 'witchcraft, waterfall, chess, kielbasa…'",
                  "? 'Schwenker, Judd, quiche lorraine, Riesling…' : 'Völklinger Hütte, Porta Nigra, casemates, Saarschleife…'")
new = new.replace('href="index.html" style="color:var(--bone-dim)', 'href="../index.html" style="color:var(--bone-dim)')

new = new.replace("last verified 2026-08-08", "last verified 2026-08-31")
new = new.replace(
'''  <span style="opacity:.8">Refresh check (Aug 2026, via the pipeline): Sokolowski's University Inn confirmed still closed (kept, flagged); West Side Market open amid a $70M renovation, produce arcade reopened Jan 2026; newly opened since build — Rock &amp; Roll Hall of Fame expansion, Cleveland Metroparks Zoo Primate Forest, Irishtown Bend Park. Findings logged in data/sources.json.</span><br><br>''',
'''  <span style="opacity:.8">Web-researched and fact-checked via the pipeline (data/sources.json, docs/SOURCES.md): sourced in German, French &amp; Luxembourgish across Michelin, UNESCO, Gault&amp;Millau, the Saarbrücker Zeitung, SR, Le Républicain Lorrain, Inspire Metz, the Luxembourg Times/Luxemburger Wort, Visit Luxembourg, the Trierischer Volksfreund and DW Travel. Every coordinate is verified into data/geocodes.json and every place status-checked open. A large batch of restaurants is pending a final coordinate pass before appearing.</span><br><br>''')

SR_APPENDIX = (
 "+ '<div class=\"srcrow\"><span class=\"k\">FOOD RULES</span><div class=\"t\">How the cuisine filters were policed'\n"
 "  + '<span>Every food card names a specific dish — a cuisine label alone doesn’t qualify. The Greater Region’s canon crosses three countries: the Saarland <b>Schwenker</b> and <b>Dibbelabbes/Gefillde</b>, Luxembourg’s <b>Judd mat Gaardebounen</b> and <b>Gromperekichelcher</b>, Lorraine <b>quiche</b> &amp; <b>tarte aux mirabelles</b>, and <b>Mosel Riesling</b> from steep-slope Weinstuben — with a deep Michelin bench (Christian Bau 3★ on the DE/FR/LU tripoint). A cuisine tag names the kitchen’s own tradition, never one dish it happens to serve.</span></div></div>'\n"
 "  + '<div class=\"srcrow\"><span class=\"k\">HOW SOURCED</span><div class=\"t\">Web-searched in-language and fact-checked'\n"
 "  + '<span>Every place is traceable to a credible source — Michelin, UNESCO, Gault&amp;Millau, the Saarbrücker Zeitung, SR, Le Républicain Lorrain, Inspire Metz, the Luxembourg Times/Luxemburger Wort, Visit Luxembourg, the Trierischer Volksfreund, DW Travel, local university &amp; ESN guides and vetted local creators — recorded in data/sources.json. Every coordinate is verified into data/geocodes.json and every place status-checked open. Yelp/TripAdvisor never count toward the two-source bar.</span></div></div>';"
)
new = re.sub(r"\+ '<div class=\"srcrow\"><span class=\"k\">FOOD RULES.*?</div></div>';", lambda m: SR_APPENDIX, new, flags=re.S)

assert not re.search(r"\\u[0-9a-fA-F]{4}", re.sub(r"<script[\s\S]*?</script>", "", new)), "literal \\uXXXX escape leaked into visible HTML — use real characters in page prose, not \\u escapes"
import engine_guard  # no map may ship the Google "API key" base-map surface
new = engine_guard.fix_basemap_tiles(engine_guard.strip_google(new)); engine_guard.assert_no_google(new, OUT)
open(OUT, "w", encoding="utf-8").write(new)
assert "P.forEach((p,i)=>{p.id='s'+i" in new
_leakseg = new[new.index("const S = {"):new.index("const AC =")]
assert "Cleveland" not in re.sub(r"Cleveland Ave(?:nue)?", "", _leakseg), "Cleveland leaked into data"
for a in DS["areas"]:
    n1 = sum(1 for r in DS["P"]+DS["F"] if r["a"]==a["id"] and r["t"]==1)
    if n1 < 1: print("  NOTE: area %s has no tier-1 must-see yet (thin area — will fill as it's geocoded)" % a["id"])
print("sights: %d  food: %d  total: %d" % (nP, nF, TOTAL))
print("OK wrote", OUT)
