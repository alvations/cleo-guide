#!/usr/bin/env python3
# Kyoto helper: append records from stdin (JSON list) to a research file, dedup by name.
#   python3 _kyoto_add.py food FOOD_KYOTO_X.json < recs.json
#   python3 _kyoto_add.py sight SIGHTS_KYOTO_X.json < recs.json
#   python3 _kyoto_add.py geo geo/_geoout_kyoto_X.json < recs.json
import json, sys, os
kind, path = sys.argv[1], sys.argv[2]
new = json.load(sys.stdin)
if kind == "sight":
    d = json.load(open(path)) if os.path.exists(path) else {"sources": [], "sights": []}
    lst = d["sights"]
else:
    d = json.load(open(path)) if os.path.exists(path) else []
    lst = d
have = {r["n"] for r in lst}
n0 = len(lst)
for r in new:
    if r["n"] in have:
        lst[:] = [r if x["n"] == r["n"] else x for x in lst]   # replace (update)
    else:
        lst.append(r); have.add(r["n"])
json.dump(d, open(path, "w"), ensure_ascii=False, indent=1)
print(f"{path}: {n0} -> {len(lst)}")
