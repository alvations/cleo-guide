#!/usr/bin/env python3
# Refresh Madison counts in index.html CARD:madison-wi and docs/CITIES.md row (run under the shared lock).
import json, re, sys, os
R = '/home/user/cleo-guide'
ds = json.load(open(f'{R}/data/madison.dataset.json'))
recs = ds['P'] + ds['F']
G = json.load(open(f'{R}/data/geocodes.json'))['cities']['madison-wi']
pinned = sum(1 for x in recs if (G.get(x['n']) or {}).get('lat') is not None)
res = len(recs); food = len(ds['F']); sights = len(ds['P'])
h = open(f'{R}/index.html').read()
a, b = h.index('<!-- CARD:madison-wi -->'), h.index('<!-- /CARD:madison-wi -->')
card = re.sub(r'\d+ places mapped \(\d+ researched\)', f'{pinned} places mapped ({res} researched)', h[a:b])
card = card.replace('James Beard, Isthmus, the Cap Times, Madison\n          Magazine, Time Out &amp; Travel Wisconsin', 'James Beard, Isthmus, the Cap Times, Madison\n          Magazine, Imbibe, City Cast, Time Out &amp; Travel Wisconsin')
h = h[:a] + card + h[b:]; open(f'{R}/index.html', 'w').write(h)
c = open(f'{R}/docs/CITIES.md').read().split('\n')
note = sys.argv[1] if len(sys.argv) > 1 else ''
for i, l in enumerate(c):
    if l.startswith('| Madison WI'):
        c[i] = (f"| Madison WI (+ Dane County + day trips) | `cities/madison.html` | `data/madison.dataset.json` | `data/madison-research/` | {pinned} | "
                f"live · 7 areas (CAP/UW/EAST/WEST/MVF/DANE/TRIP), target ~210; {res} researched ({food} food + {sights} sights), {pinned} pinned, "
                f"{res-pinned} UNVERIFIED (mostly restaurants) pending the geocode-helper. {note} Resume: `data/madison-research/RESUME.md`; rebuild: `python3 tools/rebuild-city.py madison-wi --build`. |")
open(f'{R}/docs/CITIES.md', 'w').write('\n'.join(c))
print('pinned', pinned, 'researched', res, 'food', food, 'sights', sights)
