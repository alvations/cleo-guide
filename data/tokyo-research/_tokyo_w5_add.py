#!/usr/bin/env python3
# _add.py — Tokyo agent's append helper (write-as-you-go, resumability §5b). Reads a JSON object on stdin:
#   {"file":"SIGHTS_TOKYO_W1.json"|"FOOD_TOKYO_W1.json", "geo":"_geoout_tokyo_w1.json",
#    "recs":[{...record..., "lat":..,"lng":..,"conf":"high|med|low|unverified","gs":"<geoSource>",
#             "st":"open|closed","sts":"<statusSource>"}]}
# Splits each combined record into the discovery record (no coords) and the geoout record, appends both,
# de-duplicating by name. Files starting with "_" are ignored by consolidate.py.
import json, sys, os
D = os.path.dirname(os.path.abspath(__file__))
req = json.load(sys.stdin)
fp = os.path.join(D, req["file"]); gp = os.path.join(D, "geo", req["geo"])
is_sight = os.path.basename(fp).startswith("SIGHTS")
if os.path.exists(fp): data = json.load(open(fp, encoding="utf-8"))
else: data = {"sources": [], "sights": []} if is_sight else []
geo = json.load(open(gp, encoding="utf-8")) if os.path.exists(gp) else []
items = data["sights"] if is_sight else data
have = {x["n"] for x in items}; ghave = {x["n"] for x in geo}
GEOK = ("lat", "lng", "conf", "gs", "st", "sts")
added = 0
for r in req["recs"]:
    rec = {k: v for k, v in r.items() if k not in GEOK}
    rec.setdefault("closed", r.get("st") == "closed")
    if rec["n"] not in have:
        items.append(rec); have.add(rec["n"]); added += 1
    if rec["n"] not in ghave and ("lat" in r or "conf" in r):
        geo.append({"n": rec["n"], "address": rec["address"], "lat": r.get("lat"), "lng": r.get("lng"),
                    "confidence": r.get("conf", "unverified" if r.get("lat") is None else "high"),
                    "geoSource": r.get("gs", "UNVERIFIED"), "status": r.get("st", "open"),
                    "statusSource": r.get("sts", "")})
        ghave.add(rec["n"])
json.dump(data, open(fp, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
json.dump(geo, open(gp, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
print(f"{req['file']}: +{added} (now {len(items)}); geo {req['geo']}: {len(geo)}")
