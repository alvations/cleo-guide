#!/usr/bin/env python3
# Append verified records to a FOOD_<tag>.json (list) or SIGHTS_<tag>.json ({sights,sources}) — dedupes by name
# across every research file in this dir. Usage: python3 _hbg_add.py FOOD_CANON.json < records.json
import json, sys, os, glob
D=os.path.dirname(os.path.abspath(__file__))
target=os.path.join(D, sys.argv[1]); recs=json.load(sys.stdin)
have=set()
for p in glob.glob(os.path.join(D,'FOOD_*.json'))+glob.glob(os.path.join(D,'SIGHTS_*.json')):
    d=json.load(open(p)); items=d if isinstance(d,list) else d.get('sights',[])+d.get('food',[])
    have|={x['n'] for x in items}
is_s=os.path.basename(target).startswith('SIGHTS_')
cur=json.load(open(target)) if os.path.exists(target) else ({"sights":[],"sources":[]} if is_s else [])
lst=cur['sights'] if is_s else cur
added=0
for r in recs:
    if r['n'] in have: print('DUP skip:', r['n']); continue
    lst.append(r); have.add(r['n']); added+=1
json.dump(cur, open(target,'w'), indent=1, ensure_ascii=False)
print(f'{sys.argv[1]}: +{added} (now {len(lst)})')
