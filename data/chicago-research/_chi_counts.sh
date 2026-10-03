#!/bin/bash
# Refresh the live counts on Chicago's index card + CITIES.md row from the built dataset (run under the lock).
cd /home/user/cleo-guide
python3 - <<'PY'
import json,glob,re
n=0
for f in glob.glob('data/chicago-research/[FS]*_*.json'):
    if 'SOURCES' in f: continue
    d=json.load(open(f)); n+=len(d if isinstance(d,list) else d['sights'])
h=open('cities/chicago.html').read()
P=h[h.index('const P = ['):].split('\n];')[0].count('{t:'); F=h[h.index('const F = ['):].split('\n];')[0].count('{t:')
s=open('index.html').read()
s=re.sub(r'(<!-- CARD:chicago-il -->.*?<p class="stat">)[^<]*(</p>)', lambda m:m.group(1)+f'{P} sights · {F} food on the map ({n} researched) · updated 2026-10-03'+m.group(2), s, flags=re.S)
open('index.html','w').write(s)
c=open('docs/CITIES.md').read()
c=re.sub(r'(\| `data/chicago-research/` \| )\d+( \| \*\*live \(growing\)\*\* )\d{4}-\d\d-\d\d( · )\d+ researched / \d+ pinned \(\d+ sights \+ \d+ food\)', lambda m:m.group(1)+str(P+F)+m.group(2)+'2026-10-03'+m.group(3)+f'{n} researched / {P+F} pinned ({P} sights + {F} food)', c)
open('docs/CITIES.md','w').write(c)
print('counts', n, P, F)
PY
