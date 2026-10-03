#!/usr/bin/env python3
# Append/replace geo records (by name) in geo/<file>. usage: python3 _chi_geo_add.py _geoout_w15.json < recs.json
import json, os, sys
D = os.path.dirname(os.path.abspath(__file__))
fn = os.path.join(D, 'geo', sys.argv[1]); new = json.load(sys.stdin)
cur = json.load(open(fn)) if os.path.exists(fn) else []
idx = {x['n']: i for i, x in enumerate(cur)}
for r in new:
    r.setdefault('lat', None); r.setdefault('lng', None)
    if not r.get('lat'): r.setdefault('geoSource', 'UNVERIFIED'); r['confidence'] = 'UNVERIFIED'
    if r['n'] in idx: cur[idx[r['n']]] = r
    else: idx[r['n']] = len(cur); cur.append(r)
json.dump(cur, open(fn, 'w'), ensure_ascii=False, indent=1)
print(fn, len(cur), 'pinned', sum(1 for x in cur if x.get('lat')))
