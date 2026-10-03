#!/usr/bin/env python3
# _liege_w4geo.py — append W4 pins: lines "name|address|lat|lng|conf|source-url" on stdin
import json,sys,subprocess
recs=[]
for line in sys.stdin:
    line=line.strip()
    if not line: continue
    n,a,la,ln,c,u=[x.strip() for x in line.split('|')]
    recs.append({"n":n,"address":a,"lat":float(la),"lng":float(ln),"confidence":c,
      "geoSource":f"{u} — venue lat/lng printed in WebSearch summary (2026-10-03, W4)",
      "status":"open","statusSource":f"{u} — listing live 2026-10-03 (no closure notice)"})
p=subprocess.run(["python3","_liege_add.py","geo/_geoout_liege_w4.json","geo"],input=json.dumps(recs),text=True,capture_output=True)
print(p.stdout,p.stderr)
# fill vague discovery addresses (town-only) with the venue street address from the pin source
import glob,re
for f in glob.glob('FOOD_*.json')+glob.glob('SIGHTS_*.json'):
    d=json.load(open(f)); lst=d['sights'] if isinstance(d,dict) else d; ch=False
    for x in lst:
        for r in recs:
            if x['n']==r['n'] and not re.search(r'\d',x.get('address','')):
                x['address']=r['address']; ch=True; print('  addr ->',x['n'],r['address'])
    if ch: json.dump(d,open(f,'w'),ensure_ascii=False,indent=1)
