#!/usr/bin/env python3
# usage: python3 _sf_has.py "name1" "name2" ...  → substring match against every researched name
import json, glob, os, sys
D = os.path.dirname(os.path.abspath(__file__)); names = []
for f in glob.glob(os.path.join(D, '*.json')):
    b = os.path.basename(f)
    if b.startswith(('_', 'sf_', 'SOURCES', 'CREATORS')): continue
    d = json.load(open(f)); names += [r['n'] for r in (d if isinstance(d, list) else d.get('sights', []) + d.get('food', []))]
for q in sys.argv[1:]: print(q, '->', [n for n in names if q.lower() in n.lower()])
