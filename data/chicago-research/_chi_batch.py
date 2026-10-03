#!/usr/bin/env python3
# usage: python3 _chi_batch.py FOOD_W15.json batch.json [_geoout_<tag>.json] — batch.json = [{record..., "_status":"open","_statusSource":"...","_note":"..."}]
# Appends records (dedup via _chi_add.py) and UNVERIFIED/sourced geo rows to geo/_geoout_w15.json (status + address only unless _lat given).
import json, subprocess, sys, os
D = os.path.dirname(os.path.abspath(__file__))
fn, bf = sys.argv[1], sys.argv[2]
gf = sys.argv[3] if len(sys.argv) > 3 else '_geoout_w15.json'
B = json.load(open(bf))
recs, geo = [], []
for x in B:
    g = {'n': x['n'], 'address': x.get('address', ''), 'status': x.pop('_status', 'open'),
         'statusSource': x.pop('_statusSource', (x['sources'][0][1] + ' (current listing, search 2026-10-03; no closure reported)')),
         'note': x['a'] + (' | ' + x.pop('_note') if x.get('_note') else '')}
    if x.get('_lat'): g.update(lat=x.pop('_lat'), lng=x.pop('_lng'), geoSource=x.pop('_geoSource'), confidence=x.pop('_conf', 'high'))
    recs.append(x); geo.append(g)
subprocess.run(['python3', D + '/_chi_add.py', fn], input=json.dumps(recs), text=True, cwd=D, check=True)
subprocess.run(['python3', D + '/_chi_geo_add.py', gf], input=json.dumps(geo), text=True, cwd=D, check=True)
