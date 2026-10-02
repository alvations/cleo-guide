#!/usr/bin/env python3
# _tokyo_w7_fix.py — append place pins for UNVERIFIED records to geo/_geofix_tokyo_w7.json.
# stdin: JSON list of {"q":"<unique substring of the record name>","lat":..,"lng":..,"conf":"high|med",
#   "gs":"<source: Google !3d!4d URL / Michelin venue page / Wikipedia article>","address":optional}
# Resolves q against unverified geoout names (must match exactly one), refuses a Google gs whose !3d!4d != lat/lng.
import json,glob,os,re,sys
D=os.path.dirname(os.path.abspath(__file__)); fp=os.path.join(D,'geo','_geofix_tokyo_w7.json')
unv=[r['n'] for g in sorted(glob.glob(os.path.join(D,'geo','_geoout_tokyo_*.json'))) for r in json.load(open(g)) if r.get('confidence')=='unverified']
fix=json.load(open(fp)) if os.path.exists(fp) else []; have={f['n'] for f in fix}
for x in json.load(sys.stdin):
    m=[n for n in unv if x['q'].lower() in n.lower()]
    if len(m)!=1: print('SKIP',x['q'],'matches',m); continue
    if not (34.9<=x['lat']<=37.0 and 138.4<=x['lng']<=140.4): print('SKIP box',x['q']); continue
    g=re.search(r'!3d(-?[\d.]+)!4d(-?[\d.]+)',x['gs'])
    if g and (abs(float(g.group(1))-x['lat'])>1e-4 or abs(float(g.group(2))-x['lng'])>1e-4): print('SKIP !3d!4d mismatch',x['q']); continue
    if not g and not re.search(r'michelin|wikipedia|wikidata',x['gs'],re.I): print('SKIP no place-pin evidence',x['q']); continue
    if m[0] in have: print('dup',m[0]); continue
    rec={'n':m[0],'lat':x['lat'],'lng':x['lng'],'confidence':x['conf'],'geoSource':x['gs']}
    if x.get('address'): rec['address']=x['address']
    fix.append(rec); have.add(m[0]); print('ok',m[0][:50],x['conf'])
json.dump(fix,open(fp,'w'),indent=1,ensure_ascii=False); print(len(fix),'fixes')
