#!/usr/bin/env python3
# Append helper for the W3 wave: python3 _add.py <kind:food|sight> '<json record>' ['<json geo>']
# Writes FOOD_W3.json / SIGHTS_W3.json + geo/_geoout_w3.json (dedup by name, replaces on re-add).
import json, sys, os
D = os.path.dirname(os.path.abspath(__file__))
kind, rec = sys.argv[1], json.loads(sys.argv[2])
geo = json.loads(sys.argv[3]) if len(sys.argv) > 3 else None
def load(p, default):
    return json.load(open(p, encoding="utf-8")) if os.path.exists(p) else default
if kind == "food":
    p = os.path.join(D, "FOOD_W3.json"); L = [x for x in load(p, []) if x["n"] != rec["n"]] + [rec]
    json.dump(L, open(p, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
else:
    p = os.path.join(D, "SIGHTS_W3.json"); d = load(p, {"sights": [], "sources": []})
    d["sights"] = [x for x in d["sights"] if x["n"] != rec["n"]] + [rec]
    json.dump(d, open(p, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
if geo:
    gp = os.path.join(D, "geo", "_geoout_w3.json"); G = [x for x in load(gp, []) if x["n"] != geo["n"]] + [geo]
    json.dump(G, open(gp, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
print("ok", kind, rec["n"], "+geo" if geo else "")
