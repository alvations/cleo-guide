#!/bin/bash
# Refresh the live counts on SF's index card + CITIES.md row from the built page (run under the lock).
cd /home/user/cleo-guide
python3 - <<'PY'
import json,glob,re,datetime
n=0
for f in glob.glob('data/san-francisco-research/*.json'):
    b=f.rsplit('/',1)[1]
    if b.startswith(('_','sf_','SOURCES','CREATORS')) or 'dataset' in b: continue
    d=json.load(open(f)); n+=len(d) if isinstance(d,list) else len(d.get('sights',[]))+len(d.get('food',[]))
h=open('cities/sanfrancisco.html').read()
P=h[h.index('const P = ['):].split('\n];')[0].count('{t:'); F=h[h.index('const F = ['):].split('\n];')[0].count('{t:')
today=datetime.date.today().isoformat()
s=open('index.html').read()
m=re.search(r'<!-- CARD:san-francisco-ca -->.*?<!-- /CARD:san-francisco-ca -->', s, re.S)
print('card found' if m else 'NO CARD MARKERS')
if m:
    card=re.sub(r'(<p class="stat">)[^<]*(</p>)', lambda k:k.group(1)+f'{P} sights · {F} food on the map ({n} researched) · updated {today}'+k.group(2), m.group(0), count=1)
    s=s[:m.start()]+card+s[m.end():]; open('index.html','w').write(s)
c=open('docs/CITIES.md').read()
c=re.sub(r'(\| `data/san-francisco-research/` \| )[^|]*\|[^|\n]*\|', lambda k:k.group(1)+f'{P+F} | **live (growing)** {today} · {n} researched / {P+F} pinned ({P} sights + {F} food); 2026-10 modernisation run (food-first, Michelin/JB, 4 gates green) |', c, count=1)
open('docs/CITIES.md','w').write(c)
print('counts researched',n,'pinned sights',P,'food',F)
PY
