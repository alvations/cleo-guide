#!/usr/bin/env python3
# Append/replace geocode+status records in geo/<FILE> (dedup by name). Never invent coords: a record
# without a sourced place-pin goes in with lat/lng null + confidence "UNVERIFIED" (status still recorded).
# usage: python3 _sf_geo.py _geoout_w3a.json < recs.json
import json, os, sys
D = os.path.dirname(os.path.abspath(__file__)); fn = os.path.join(D, 'geo', sys.argv[1])
cur = json.load(open(fn)) if os.path.exists(fn) else []
idx = {r['n']: i for i, r in enumerate(cur)}
for r in json.load(sys.stdin):
    if r.get('lat') is None: r.update(lat=None, lng=None, confidence='UNVERIFIED')
    if r['n'] in idx: cur[idx[r['n']]] = r
    else: idx[r['n']] = len(cur); cur.append(r)
json.dump(cur, open(fn, 'w'), ensure_ascii=False, indent=1)
print(fn, len(cur), 'pinned', sum(1 for r in cur if r.get('lat') is not None))
