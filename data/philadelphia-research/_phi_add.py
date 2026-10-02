#!/usr/bin/env python3
# _phi_add.py FILE.json < records.json  — append food records (list) to a FOOD_*.json, refusing dup names
# across every research file in this dir. Sights: pass --sights to append into {"sights":[...],"sources":[...]}.
import json, sys, os, glob
D = os.path.dirname(os.path.abspath(__file__))
sights = "--sights" in sys.argv
path = os.path.join(D, [a for a in sys.argv[1:] if not a.startswith("--")][0])
new = json.load(sys.stdin)
names = set()
for p in glob.glob(os.path.join(D, "*.json")):
    b = os.path.basename(p)
    if b.startswith(("_", "phi_", "SOURCES_", "CREATORS")): continue
    d = json.load(open(p))
    for x in (d if isinstance(d, list) else d.get("sights", []) + d.get("food", [])): names.add(x["n"])
if sights:
    cur = json.load(open(path)) if os.path.exists(path) else {"sights": [], "sources": []}
    recs = new.get("sights", []); known = {s["key"] for s in cur["sources"]}
    cur["sources"] += [s for s in new.get("sources", []) if s["key"] not in known]
    tgt = cur["sights"]
else:
    cur = json.load(open(path)) if os.path.exists(path) else []
    recs = new; tgt = cur
n0 = len(tgt); added = 0
for x in recs:
    if x["n"] in names: print("DUP skip:", x["n"]); continue
    for k in ("t", "a", "n", "address", "w", "sources"): assert k in x, (k, x.get("n"))
    if not sights: assert "cz" in x, x["n"]
    names.add(x["n"]); tgt.append(x); added += 1
assert len(tgt) == n0 + added
json.dump(cur, open(path, "w"), indent=1, ensure_ascii=False)
print(f"{os.path.basename(path)}: +{added} -> {len(tgt)}")
