#!/usr/bin/env python3
# _phi_geo.py OUTFILE  < lines "name|lat|lng|source|conf|status|statusSource|address(optional)"
import json, sys, os
D = os.path.dirname(os.path.abspath(__file__)); p = os.path.join(D, "geo", sys.argv[1])
cur = json.load(open(p)) if os.path.exists(p) else []
have = {e["n"] for e in cur}
for line in sys.stdin:
    line = line.strip()
    if not line or line.startswith("#"): continue
    f = line.split("|") + [""] * 8
    n, lat, lng, src, conf, st, ss, ad = f[:8]
    if n in have: print("dup", n); continue
    cur.append({"n": n, "address": ad, "lat": float(lat) if lat else None, "lng": float(lng) if lng else None,
                "geoSource": src, "confidence": conf or "high", "status": st or "open", "statusSource": ss, "note": ""})
    have.add(n)
json.dump(cur, open(p, "w"), indent=1, ensure_ascii=False); print(sys.argv[1], len(cur))
