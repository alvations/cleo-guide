#!/usr/bin/env python3
# Pin existing places: python3 _chi_pin.py < pins.json  (pins = [{n,lat,lng,geoSource,confidence?,note?,address?}])
# Copies address/status/statusSource from the registry row, appends to geo/_geoout_w18.json (sorts last → wins in geo-merge).
import json, os, sys, subprocess
D = os.path.dirname(os.path.abspath(__file__))
reg = json.load(open(os.path.join(D, '..', 'geocodes.json')))['cities']['chicago-il']
import glob
REC = {}
for f in glob.glob(os.path.join(D, '[FS]*_*.json')):
    if 'SOURCES' in f: continue
    d = json.load(open(f)); REC.update({x['n']: x for x in (d if isinstance(d, list) else d['sights'])})
W18 = {g['n']: g for g in (json.load(open(os.path.join(D, 'geo', '_geoout_w18.json'))) if os.path.exists(os.path.join(D, 'geo', '_geoout_w18.json')) else [])}
out = []
for p in json.load(sys.stdin):
    r = reg.get(p['n'])
    if r is None:  # older record never geo-rowed: take address from the pin source, status from its own sources
        rec = REC[p['n']]; assert p.get('address'), 'address required: ' + p['n']
        r = {'status': 'open', 'statusSource': rec['sources'][0][1] + ' (current listing; Apple Maps place listing live, search 2026-10-03; no closure reported)'}
    if p['n'] in W18 and W18[p['n']].get('statusSource'): r = dict(r, status=W18[p['n']]['status'], statusSource=W18[p['n']]['statusSource'])
    out.append({'n': p['n'], 'address': p.get('address') or r.get('address', ''), 'lat': p['lat'], 'lng': p['lng'],
                'geoSource': p['geoSource'], 'confidence': p.get('confidence', 'high'),
                'status': r.get('status', 'open'), 'statusSource': r.get('statusSource', ''), 'note': p.get('note', '')})
subprocess.run(['python3', D + '/_chi_geo_add.py', '_geoout_w18.json'], input=json.dumps(out), text=True, check=True)
# keep the research record's address in step with the pin's sourced address
newaddr = {o['n']: o['address'] for o in out if o['address']}
for f in glob.glob(os.path.join(D, '[FS]*_*.json')):
    if 'SOURCES' in f: continue
    d = json.load(open(f)); arr = d if isinstance(d, list) else d['sights']; ch = False
    for x in arr:
        if x['n'] in newaddr and x.get('address') != newaddr[x['n']]: x['address'] = newaddr[x['n']]; ch = True
    if ch: json.dump(d, open(f, 'w'), ensure_ascii=False, indent=1)
