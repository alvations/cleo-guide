#!/usr/bin/env python3
# _pin.py — upgrade an UNVERIFIED geo record in place (any geo/_geoout_tokyo_*.json) to a sourced pin.
# stdin: [{"n":..., "lat":..., "lng":..., "gs":"<geoSource>", "conf":"high|med"}]
import json, sys, glob, os
D = os.path.dirname(os.path.abspath(__file__))
pins = {p["n"]: p for p in json.load(sys.stdin)}; done = set()
for f in sorted(glob.glob(os.path.join(D, "geo", "_geoout_tokyo_*.json"))):
    d = json.load(open(f, encoding="utf-8")); ch = False
    for r in d:
        p = pins.get(r["n"])
        if p:
            r.update({"lat": p["lat"], "lng": p["lng"], "confidence": p.get("conf", "high"), "geoSource": p["gs"]}); ch = True; done.add(r["n"])
    if ch: json.dump(d, open(f, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
print("pinned", len(done), "missing", sorted(set(pins) - done))
