#!/usr/bin/env python3
# usage: _tokyo_w6_dup.py "name1" "name2" ... — fuzzy-checks candidates against every Tokyo discovery + held file.
import json,glob,os,re,sys
D=os.path.dirname(os.path.abspath(__file__))
def norm(s): s=re.sub(r'\(.*?\)','',s.lower()); return re.sub(r'[^a-z0-9]+',' ',s).strip()
names=[]
for f in glob.glob(os.path.join(D,'*.json')):
    try: d=json.load(open(f))
    except: continue
    items=d if isinstance(d,list) else (d.get('sights',[])+d.get('food',[])+d.get('held',[])+d.get('items',[]) if isinstance(d,dict) else [])
    for x in items:
        if isinstance(x,dict) and isinstance(x.get('n'),str): names.append((os.path.basename(f),x['n']))
for q in sys.argv[1:]:
    toks=[t for t in norm(q).split() if len(t)>2 and t not in ('tokyo','sushi','soba','ramen','restaurant','the','honten')]
    hits=[f"{f}:{n}" for f,n in names if toks and all(t in norm(n) for t in toks[:2])]
    print(('DUP? ' if hits else 'new  ')+q, hits[:3])
