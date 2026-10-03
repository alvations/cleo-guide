#!/usr/bin/env python3
# Append place records to a Chicago research file, dedup by name (case-insensitive) across ALL research files.
# usage: python3 _chi_add.py FILE.json < records.json   (FOOD_* = array; SIGHTS_* = {"sights":[...],"sources":[]})
import json, os, sys, glob
D = os.path.dirname(os.path.abspath(__file__))
fn = os.path.join(D, sys.argv[1]); new = json.load(sys.stdin)
seen = set()
for f in glob.glob(os.path.join(D, '*.json')):
    b = os.path.basename(f)
    if b.startswith(('_', 'SOURCES', 'CREATORS', 'chi_')) or f == fn: continue
    d = json.load(open(f)); arr = d if isinstance(d, list) else d.get('sights', []) + d.get('food', [])
    seen |= {x['n'].lower() for x in arr}
issight = os.path.basename(fn).startswith('SIGHTS')
cur = json.load(open(fn)) if os.path.exists(fn) else ({"sights": [], "sources": []} if issight else [])
arr = cur['sights'] if issight else cur
have = {x['n'].lower() for x in arr}
added = 0
for r in new:
    k = r['n'].lower()
    if k in seen: print('DUP elsewhere, skipped:', r['n']); continue
    if k in have:
        arr[[x['n'].lower() for x in arr].index(k)] = r; continue
    arr.append(r); have.add(k); added += 1
json.dump(cur, open(fn, 'w'), ensure_ascii=False, indent=1)
print(f'{fn}: +{added}, total {len(arr)}')
