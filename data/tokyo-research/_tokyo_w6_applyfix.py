#!/usr/bin/env python3
# Apply geo/_geofix_tokyo_w6.json place pins onto the matching geo/_geoout_tokyo_*.json records (by exact name).
import json,glob,os
D=os.path.dirname(os.path.abspath(__file__))
fix={x['n']:x for x in json.load(open(os.path.join(D,'geo','_geofix_tokyo_w6.json')))}
done=set()
for g in sorted(glob.glob(os.path.join(D,'geo','_geoout_tokyo_*.json'))):
    d=json.load(open(g)); ch=0
    for r in d:
        f=fix.get(r['n'])
        if f and r.get('confidence')=='unverified':
            r.update(lat=f['lat'],lng=f['lng'],confidence=f['confidence'],geoSource=f['geoSource'])
            if f.get('address'): r['address']=f['address']+(', Tokyo' if 'Tokyo' not in f['address'] else '')
            ch+=1; done.add(r['n'])
    if ch: json.dump(d,open(g,'w'),indent=1,ensure_ascii=False); print(os.path.basename(g),ch)
print('unmatched:',set(fix)-done)
