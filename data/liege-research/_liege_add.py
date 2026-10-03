#!/usr/bin/env python3
# _liege_add.py — append records to a Liège research file (dedup by name). Usage:
#   python3 _liege_add.py SIGHTS_LIEGE_W2.json sights < records.json   (dict file, 'sights' list)
#   python3 _liege_add.py FOOD_LIEGE_W2.json food < records.json       (list file)
#   python3 _liege_add.py geo/_geoout_liege_w2.json geo < records.json (list file)
import json, sys, os
path, kind = sys.argv[1], sys.argv[2]
new = json.load(sys.stdin)
if kind == "sights":
    d = json.load(open(path)) if os.path.exists(path) else {"sources": [], "sights": []}
    lst = d["sights"]
else:
    d = json.load(open(path)) if os.path.exists(path) else []
    lst = d
have = {x["n"] for x in lst}
n0 = len(lst)
for x in new:
    if x["n"] in have: print("  dup skip:", x["n"]); continue
    lst.append(x); have.add(x["n"])
json.dump(d, open(path, "w"), ensure_ascii=False, indent=1)
print(f"{path}: {n0} -> {len(lst)}")
