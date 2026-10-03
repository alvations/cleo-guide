#!/usr/bin/env python3
# Append geocode results to geo/<file> (list of {n,address,lat,lng,confidence,geoSource,status,statusSource}); replaces same-name.
import json, sys, os
D=os.path.dirname(os.path.abspath(__file__)); p=os.path.join(D,'geo',sys.argv[1])
cur=json.load(open(p)) if os.path.exists(p) else []
new=json.load(sys.stdin); names={r['n'] for r in new}
cur=[r for r in cur if r['n'] not in names]+new
json.dump(cur, open(p,'w'), indent=1, ensure_ascii=False); print(f'{sys.argv[1]}: {len(cur)} records')
