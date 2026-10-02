#!/usr/bin/env python3
"""Append records to an Osaka wave file. Usage:
  python3 _osaka_add.py food FILE.json  < records.json   (list of food dicts)
  python3 _osaka_add.py sight FILE.json < records.json   (list of sight dicts)
  python3 _osaka_add.py geo FILE.json   < records.json   (list of geo dicts)
Dedups on normalized name across ALL wave files of the same kind."""
import json, os, sys, re, glob
D = os.path.dirname(os.path.abspath(__file__))
kind, fn = sys.argv[1], sys.argv[2]
new = json.load(sys.stdin)
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.split('(')[0].lower())
def names(pattern, key=None):
    out = set()
    for p in glob.glob(os.path.join(D, pattern)):
        d = json.load(open(p))
        if isinstance(d, dict): d = d.get(key or 'sights', [])
        out |= {norm(x['n']) for x in d}
    return out
path = os.path.join(D, fn) if kind != 'geo' else os.path.join(D, 'geo', fn)
if kind == 'food':
    seen = names('FOOD_OSAKA_*.json'); cur = json.load(open(path)) if os.path.exists(path) else []
elif kind == 'sight':
    seen = names('SIGHTS_OSAKA_*.json'); cur = json.load(open(path)) if os.path.exists(path) else {"sources": [], "sights": []}
else:
    seen = names('geo/_geoout_osaka_*.json'); cur = json.load(open(path)) if os.path.exists(path) else []
lst = cur['sights'] if kind == 'sight' else cur
added = 0
for r in new:
    if norm(r['n']) in seen:
        print('DUP skip:', r['n']); continue
    seen.add(norm(r['n'])); lst.append(r); added += 1
json.dump(cur, open(path, 'w'), ensure_ascii=False, indent=1)
print(f'{kind}: +{added} -> {fn} ({len(lst)} in file)')
