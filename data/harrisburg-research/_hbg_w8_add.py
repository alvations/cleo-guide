#!/usr/bin/env python3
# W8 append helper: python3 _hbg_w8_add.py food|sights <json-file-of-records>; dedups on name.
import json,sys,os,glob
kind,src=sys.argv[1],sys.argv[2]
new=json.load(open(src))
have=set()
for f in glob.glob('FOOD_*.json')+glob.glob('SIGHTS_*.json'):
    d=json.load(open(f)); have|={r['n'] for r in (d if isinstance(d,list) else d['sights'])}
if kind=='food':
    p='FOOD_W8.json'; cur=json.load(open(p)) if os.path.exists(p) else []
    add=[r for r in new if r['n'] not in have]; cur+=add; json.dump(cur,open(p,'w'),indent=1,ensure_ascii=False)
else:
    p='SIGHTS_W8.json'; cur=json.load(open(p)) if os.path.exists(p) else {"sights":[],"sources":[]}
    add=[r for r in new if r['n'] not in have]; cur['sights']+=add; json.dump(cur,open(p,'w'),indent=1,ensure_ascii=False)
print(kind,'added',len(add),'skipped',[r['n'] for r in new if r['n'] in have])
