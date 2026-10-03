#!/usr/bin/env python3
# Madison W4 helper: append verified records to a tagged FOOD_/SIGHTS_ file and UNVERIFIED/pinned geo rows.
# usage: python3 _mad_w4.py food FOOD_W4a.json rec.json | sight SIGHTS_W4a.json rec.json | geo geo/_geoout_w4a.json rec.json
import json, sys, os, glob
kind, path, src = sys.argv[1], sys.argv[2], sys.argv[3]
recs = json.load(open(src)); recs = recs if isinstance(recs, list) else [recs]
D = os.path.dirname(os.path.abspath(__file__))
names = set()
for f in glob.glob(os.path.join(D, '*.json')):
    b = os.path.basename(f)
    if b.startswith(('_', 'mad_', 'SOURCES', 'CREATORS')): continue
    d = json.load(open(f)); L = d if isinstance(d, list) else d.get('sights', []) + d.get('food', [])
    names |= {x['n'] for x in L}
if kind == 'food':
    d = json.load(open(path)) if os.path.exists(path) else []
    for r in recs:
        assert r['n'] not in names, 'dup ' + r['n']
        assert len(r['sources']) >= 2 or r['sources'][0][0] in ('JAMESBEARD', 'NPS', 'UNESCO'), 'needs 2 sources ' + r['n']
        d.append(r)
elif kind == 'sight':
    d = json.load(open(path)) if os.path.exists(path) else {'sights': [], 'sources': []}
    for r in recs:
        assert r['n'] not in names, 'dup ' + r['n']
        assert len(r['sources']) >= 2 or r['sources'][0][0] in ('JAMESBEARD', 'NPS', 'UNESCO'), 'needs 2 sources ' + r['n']
        d['sights'].append(r)
else:
    d = json.load(open(path)) if os.path.exists(path) else []
    have = {x['n'] for x in d}
    d += [r for r in recs if r['n'] not in have]
json.dump(d, open(path, 'w'), indent=1, ensure_ascii=False)
print(kind, path, 'now', len(d) if isinstance(d, list) else len(d['sights']))
