#!/usr/bin/env python3
# Pin existing places: python3 _chi_pin.py < pins.json  (pins = [{n,lat,lng,geoSource,confidence?,note?,address?}])
# Copies address/status/statusSource from the registry row, appends to geo/_geoout_w18.json (sorts last → wins in geo-merge).
import json, os, sys, subprocess
D = os.path.dirname(os.path.abspath(__file__))
reg = json.load(open(os.path.join(D, '..', 'geocodes.json')))['cities']['chicago-il']
out = []
for p in json.load(sys.stdin):
    r = reg.get(p['n']); assert r is not None, 'not in registry: ' + p['n']
    out.append({'n': p['n'], 'address': p.get('address') or r.get('address', ''), 'lat': p['lat'], 'lng': p['lng'],
                'geoSource': p['geoSource'], 'confidence': p.get('confidence', 'high'),
                'status': r.get('status', 'open'), 'statusSource': r.get('statusSource', ''), 'note': p.get('note', '')})
subprocess.run(['python3', D + '/_chi_geo_add.py', '_geoout_w18.json'], input=json.dumps(out), text=True, check=True)
