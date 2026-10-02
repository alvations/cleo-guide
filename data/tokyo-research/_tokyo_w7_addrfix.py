#!/usr/bin/env python3
# Apply _w7_addrfix.json (sourced street addresses) to the matching geoout + FOOD/SIGHTS records (exact name).
import json,glob,os
D=os.path.dirname(os.path.abspath(__file__))
fx={x['n']:x['address'] for x in json.load(open(os.path.join(D,'_w7_addrfix.json')))}
done=set()
for p in sorted(glob.glob(os.path.join(D,'geo','_geoout_tokyo_*.json'))+glob.glob(os.path.join(D,'FOOD_*.json'))+glob.glob(os.path.join(D,'SIGHTS_*.json'))):
    d=json.load(open(p)); L=d['sights'] if isinstance(d,dict) else d; ch=0
    for r in L:
        if r['n'] in fx and r.get('address')!=fx[r['n']]: r['address']=fx[r['n']]; ch+=1; done.add(r['n'])
    if ch: json.dump(d,open(p,'w'),indent=1,ensure_ascii=False); print(os.path.basename(p),ch)
print('unmatched:',set(fx)-done)
