#!/usr/bin/env python3
# Emit UNVERIFIED geo rows (with sourced status) for W4 records lacking a pin. usage: _mad_w4_geo.py <FOOD/SIGHTS file> <geo out> <status json {name:[status,statusSource]}>
import json, sys, os
src, out, st = sys.argv[1], sys.argv[2], json.load(open(sys.argv[3]))
d = json.load(open(src)); L = d if isinstance(d, list) else d['sights']
g = json.load(open(out)) if os.path.exists(out) else []
have = {x['n'] for x in g}
for r in L:
    if r['n'] in have: continue
    s = st.get(r['n'])
    if not s: print('NO STATUS', r['n']); continue
    g.append({"n": r['n'], "address": r['address'], "lat": None, "lng": None, "confidence": "unverified",
              "geoSource": "UNVERIFIED", "status": s[0], "statusSource": s[1],
              "note": "W4: no place-pin coordinate surfaced via WebSearch — queue for tools/geocode-helper.html"})
json.dump(g, open(out, 'w'), indent=1, ensure_ascii=False); print(out, len(g))
