#!/usr/bin/env python3
# Append records to a Miami research file (dedup by name across all research files). Usage:
#   python3 _miami_add.py FOOD_F1.json food < records.json     (array of food records)
#   python3 _miami_add.py SIGHTS_S1.json sights < records.json
import json, sys, os, glob
D = os.path.dirname(os.path.abspath(__file__))
fn, kind = sys.argv[1], sys.argv[2]
new = json.load(sys.stdin)
names = set()
for p in glob.glob(os.path.join(D, "*.json")):
    b = os.path.basename(p)
    if b.startswith(("_", "mia_", "CREATORS", "SOURCES_")) or "dataset" in b: continue
    d = json.load(open(p))
    for x in (d if isinstance(d, list) else d.get("sights", []) + d.get("food", [])): names.add(x["n"])
path = os.path.join(D, fn)
if kind == "food":
    cur = json.load(open(path)) if os.path.exists(path) else []
else:
    cur = json.load(open(path)) if os.path.exists(path) else {"sights": []}
added = 0
for x in new:
    assert x.get("n") and x.get("a") and x.get("w") and x.get("sources"), x
    if x["n"] in names: print("dup skip:", x["n"]); continue
    x.setdefault("closed", False)
    (cur if kind == "food" else cur["sights"]).append(x); names.add(x["n"]); added += 1
json.dump(cur, open(path, "w"), indent=1, ensure_ascii=False)
print("added", added, "->", fn, "total", len(cur if kind == "food" else cur["sights"]))
