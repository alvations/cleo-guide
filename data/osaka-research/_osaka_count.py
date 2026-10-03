#!/usr/bin/env python3
# Osaka: discovered vs rendered (verified pin) counts per area + food share + ANIME count.
import json,collections
d=json.load(open('data/osaka.dataset.json')); g=json.load(open('data/geocodes.json'))['cities']['osaka']
ok=lambda n: (g.get(n) or {}).get('lat') is not None
c=collections.Counter()
for kind,L in (('s',d['P']),('f',d['F'])):
    for r in L:
        c[(r['a'],kind,'disc')]+=1
        if ok(r['n']): c[(r['a'],kind,'rend')]+=1
rs=sum(v for k,v in c.items() if k[1]=='s' and k[2]=='rend'); rf=sum(v for k,v in c.items() if k[1]=='f' and k[2]=='rend')
print('discovered',len(d['P'])+len(d['F']),'(sights',len(d['P']),'food',len(d['F']),') rendered',rs+rf,'(sights',rs,'food',rf,')')
for a in sorted({k[0] for k in c}):
    print(f"  {a:6} disc {c[(a,'s','disc')]+c[(a,'f','disc')]:3} (food {c[(a,'f','disc')]})  rendered {c[(a,'s','rend')]+c[(a,'f','rend')]}")
an=[r['n'] for r in d['P']+d['F'] if 'ANIME' in (r.get('g') or r.get('cz') or []) or r.get('anime')]
print('ANIME',len(an))
