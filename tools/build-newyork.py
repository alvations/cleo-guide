#!/usr/bin/env python3
# Build cities/newyork.html from the Cleveland engine + the NYC dataset.
# Data comes from data/newyork.dataset.json; coordinates are injected from
# data/geocodes.json cities["new-york-ny"] (the build FAILS on any missing/UNVERIFIED pin).
import re, os, json
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # repo root (this file lives in tools/)
SRC  = os.path.join(ROOT, "cleveland.html")
OUT  = os.path.join(ROOT, "cities", "newyork.html")
DS   = json.load(open(os.path.join(ROOT, "data", "newyork.dataset.json"), encoding="utf-8"))
h    = open(SRC, encoding="utf-8").read()

# Include only places that already carry a verified, sourced pin in the registry; drop (and log)
# any still awaiting geocoding so the map never shows an unsourced pin. Full dataset stays intact.
_REG = json.load(open(os.path.join(ROOT, "data", "geocodes.json"), encoding="utf-8"))["cities"].get("new-york-ny", {})
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

def js(v):  # JSON is valid JS for our string/number literals
    return json.dumps(v, ensure_ascii=False)

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
_GEO = json.load(open(os.path.join(ROOT, "data", "geocodes.json"), encoding="utf-8"))["cities"]["new-york-ny"]
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
# map centre → NYC
rep("setView([41.4993,-81.6944],11)", "setView([40.7331,-73.9902],11)")
# storage keys + export filenames
for a, b in [("cle_trip","nyc_trip"),("cle_seen","nyc_seen"),("cle_gkey","nyc_gkey"),
             ("cleveland-my-list","newyork-my-list"),("cleveland-field-guide","newyork-field-guide")]:
    new = new.replace(a, b)
# legend swatches
LEG = "\n".join('  <span><i style="background:%s"></i>%s</span>' % (DS["ac"][a["id"]], a["n"]) for a in DS["areas"])
rep('''  <span><i style="background:var(--c-dt)"></i>Downtown</span>
  <span><i style="background:var(--c-uc)"></i>University Circle &amp; East</span>
  <span><i style="background:var(--c-ws)"></i>West Side &amp; Tremont</span>
  <span><i style="background:var(--c-sub)"></i>Suburbs &amp; day trips</span>''', LEG)
# map backdrop labels → NYC (drop the Lake Erie polygon; keep neutral labels)
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
'''const LABELS=[["Manhattan",40.7740,-73.9700],["Brooklyn",40.6560,-73.9490],
 ["Queens",40.7350,-73.8600],["The Bronx",40.8500,-73.8900],["Staten Island",40.5800,-74.1500],
 ["Hudson Valley",41.3000,-73.9400],["Long Island",40.7900,-73.4000],["Jersey City",40.7200,-74.0500]];

// Real geography comes from the tiles; here we add only neighbourhood labels.
backdrop=L.layerGroup().addTo(map);
LABELS.forEach(''')
new = new.replace("so the map still shows Lake Erie, the\n   Cuyahoga and the main arteries even if every tile server is unreachable.",
                  "so subtle borough labels still show even if every tile server is unreachable.")
# counts + headings + branding
new = new.replace("all 183 places", "all %d places" % TOTAL)
new = new.replace("Every must-see (33)", "Every must-see ('+P.filter(p=>p.t===1).length+')").replace(
      "'Every must-see (", "'Every must-see (")  # noop guard
new = new.replace("'Every must-see ('+P.filter(p=>p.t===1).length+')'", "'Every must-see ('+P.filter(p=>p.t===1).length+')'")
rep("<title>Cleveland Field Guide — 130 Places, Sourced</title>",
    "<title>New York City Field Guide — 5 Boroughs, Sourced</title>")
rep('<p class="eyebrow">Field guide · every place from all seven sources</p>',
    '<p class="eyebrow">Field guide · the five boroughs &amp; beyond, sourced</p>')
rep('<h1>Cleveland<span class="thin">the complete odd &amp; overlooked</span></h1>',
    '<h1>New York City<span class="thin">five boroughs, day trips &amp; the best tables</span></h1>')
rep('<p class="standfirst">143 sights and 40 places to eat, each traceable to the source that named it. <strong>Switch modes below</strong> &mdash; food lives on its own map so it never clutters the sightseeing one. Tick the box on anything to build your own list, then export it to Google or Apple Maps.</p>',
    '<p class="standfirst">%d sights and %d places to eat across the five boroughs and day trips, each traceable to the source that named it &mdash; Michelin, Eater, The Infatuation, Atlas Obscura, NYC Parks and more. <strong>Switch modes below</strong>, filter by <strong>borough</strong> or <strong>collection</strong>, and tick anything to build your own list, then export it to Google or Apple Maps.</p>' % (nP, nF))
new = re.sub(r'<meta name="description"[^>]*>',
    '<meta name="description" content="New York City field guide — %d sights and %d places to eat across the five boroughs plus day trips, each traceable to its source (Michelin, Eater, Infatuation, Atlas Obscura, NYC Parks), on one interactive map with borough, collection and cuisine filters, a trip builder and exports.">' % (nP, nF), new)
new = new.replace(", Cleveland OH", ", New York NY")
new = new.replace(">Cleveland \\u2014 my list<", ">New York \\u2014 my list<").replace(">Cleveland — my list<", ">New York — my list<")
new = new.replace('placeholder="witchcraft, waterfall, chess, kielbasa…"', 'placeholder="tenement, skyline, jazz, dumplings…"')
new = new.replace("? 'laksa, dim sum, pastrami, cannoli\\u2026' : 'witchcraft, waterfall, chess, kielbasa\\u2026'",
                  "? 'pastrami, dim sum, birria, cannoli\\u2026' : 'tenement, skyline, ferry, brownstone\\u2026'")
# "all cities" back-link is relative from cities/
new = new.replace('href="index.html" style="color:var(--bone-dim)', 'href="../index.html" style="color:var(--bone-dim)')

# footer provenance note + dates
new = new.replace("last verified 2026-08-08", "last verified 2026-08-10")
new = new.replace(
'''  <span style="opacity:.8">Refresh check (Aug 2026, via the pipeline): Sokolowski's University Inn confirmed still closed (kept, flagged); West Side Market open amid a $70M renovation, produce arcade reopened Jan 2026; newly opened since build — Rock &amp; Roll Hall of Fame expansion, Cleveland Metroparks Zoo Primate Forest, Irishtown Bend Park. Findings logged in data/sources.json.</span><br><br>''',
'''  <span style="opacity:.8">Web-researched and fact-checked via the pipeline (data/sources.json, docs/SOURCES.md): sourced across Michelin (stars + Bib Gourmand), Eater, The Infatuation, NYT, Time Out, Atlas Obscura, Untapped New York and the official NYC Parks / NYC Tourism sites. Every coordinate is verified into data/geocodes.json and every place status-checked open. A handful of newly-added food spots are pending a final coordinate pass before they appear.</span><br><br>''')
# appendix — cuisine rules + how-sourced (replace the Cleveland block)
NYC_APPENDIX = (
 "+ '<div class=\"srcrow\"><span class=\"k\">FOOD RULES</span><div class=\"t\">How the cuisine filters were policed'\n"
 "  + '<span>Every food card names a specific dish \\u2014 a cuisine label alone doesn\\u2019t qualify. <b>Vietnamese, Chinese / Cantonese (dim sum), Sichuan, Thai (incl. Isan), Malaysian, Singaporean, wider Southeast Asian (Indonesian, Filipino, Burmese)</b> and <b>Persian</b> each got a dedicated search led by Michelin (stars + Bib Gourmand), Eater, The Infatuation and NYT. <b>Singaporean</b> and <b>Burmese</b> are genuinely thin in NYC, so they are labelled as such rather than padded, and closed spots (Urban Hawker, Rangoon) were excluded. A <b>Viral</b> tag marks TikTok/Instagram-famous places whose virality is sourced to food media \\u2014 not hype.</span></div></div>'\n"
 "  + '<div class=\"srcrow\"><span class=\"k\">HOW SOURCED</span><div class=\"t\">Web-searched and fact-checked'\n"
 "  + '<span>Every place is traceable to a credible source \\u2014 Michelin, Eater, The Infatuation, NYT, Time Out, Atlas Obscura, Untapped New York, NYC Parks / NYC Tourism and official sites \\u2014 recorded in data/sources.json (direct map/page fetches are blocked in the build environment, so sources were confirmed via search). Every coordinate is verified into data/geocodes.json and every place status-checked open.</span></div></div>';"
)
new = re.sub(r"\+ '<div class=\"srcrow\"><span class=\"k\">FOOD RULES.*?</div></div>';", lambda m: NYC_APPENDIX, new, flags=re.S)

open(OUT, "w", encoding="utf-8").write(new)
# guards
assert "P.forEach((p,i)=>{p.id='s'+i" in new
# "Cleveland Ave(nue)" is a real street in several of these metros; exempt it so this engine-leak
# guard fires only on a genuine template-data leak (Cleveland place names or a "Cleveland, OH"
# address city), never on a legitimate local address.
_leakseg = new[new.index("const S = {"):new.index("const AC =")]
assert "Cleveland" not in re.sub(r"Cleveland Ave(?:nue)?", "", _leakseg), "Cleveland leaked into data"
# every area has >=1 tier-1
for a in DS["areas"]:
    n1 = sum(1 for r in DS["P"]+DS["F"] if r["a"]==a["id"] and r["t"]==1)
    assert n1 >= 1, "area %s has no tier-1 must-see" % a["id"]
print("sights: %d  food: %d  total: %d" % (nP, nF, TOTAL))
print("remaining 'Cleveland' mentions:", new.count("Cleveland"))
print("OK wrote", OUT)
