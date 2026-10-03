#!/usr/bin/env python3
# W8 geocode recorder: python3 _hbg_w8_geo.py '<json list of geo records>' ; upserts by name into geo/_geoout_w8.json
import json,sys,os
p=os.path.join(os.path.dirname(os.path.abspath(__file__)),'geo','_geoout_w8.json')
cur=json.load(open(p)) if os.path.exists(p) else []
idx={r['n']:i for i,r in enumerate(cur)}
for r in json.loads(sys.argv[1]):
    r.setdefault('statusChecked','2026-10-03')
    if r['n'] in idx: cur[idx[r['n']]]=r
    else: idx[r['n']]=len(cur); cur.append(r)
json.dump(cur,open(p,'w'),indent=1,ensure_ascii=False)
print(len(cur),'records; pinned',sum(1 for r in cur if r.get('lat') is not None))
