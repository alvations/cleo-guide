#!/usr/bin/env python3
# Update existing places in place: python3 _chi_upd.py < upd.json  — upd=[{n, address?, _status?, _statusSource?, _note?}]
# Rewrites the record's address in its research file and writes an (unpinned) status/address row to geo/_geoout_w18.json.
import json, glob, os, sys, subprocess
D = os.path.dirname(os.path.abspath(__file__))
U = json.load(sys.stdin); geo = []
reg = json.load(open(os.path.join(D, '..', 'geocodes.json')))['cities']['chicago-il']
w18p = os.path.join(D, 'geo', '_geoout_w18.json')
for g in (json.load(open(w18p)) if os.path.exists(w18p) else []):  # a pin made this wave wins over the stale registry row
    if g.get('lat'): reg[g['n']] = dict(reg.get(g['n'], {}), lat=g['lat'], lng=g['lng'], source=g['geoSource'], confidence=g['confidence'])
for f in glob.glob(os.path.join(D, '[FS]*_*.json')):
    if 'SOURCES' in f: continue
    d = json.load(open(f)); arr = d if isinstance(d, list) else d['sights']; ch = False
    for x in arr:
        for u in U:
            if x['n'] == u['n']:
                if u.get('address'): x['address'] = u['address']; ch = True
                r = reg.get(u['n'], {})
                g = {'n': u['n'], 'address': x['address'], 'status': u.get('_status', r.get('status', 'open')),
                     'statusSource': u.get('_statusSource', r.get('statusSource', '')), 'note': u.get('_note', '')}
                if r.get('lat'): g.update(lat=r['lat'], lng=r['lng'], geoSource=r['source'], confidence=r['confidence'])
                geo.append(g); u['_done'] = 1
    if ch: json.dump(d, open(f, 'w'), ensure_ascii=False, indent=1)
for u in U:
    if not u.get('_done'): print('NOT FOUND', u['n'])
subprocess.run(['python3', D + '/_chi_geo_add.py', '_geoout_w18.json'], input=json.dumps(geo), text=True, check=True)
