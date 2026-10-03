"""Append helper for the 4-town Singapore session (PGL/BLS/NVN/HLV). Usage:
   python3 _sg4_add.py food FOOD_PUNGGOL2.json '<json list of records>'
   python3 _sg4_add.py sight SIGHTS_PUNGGOL2.json '<json list>'
   python3 _sg4_add.py geo geo/_geoout_punggol_w2.json '<json list>'
Dedupes on name (n) within the file and against data/singapore.dataset.json + all FOOD_/SIGHTS_ files."""
import json, sys, os, glob
os.chdir(os.path.dirname(os.path.abspath(__file__)))
kind, path, payload = sys.argv[1], sys.argv[2], json.loads(sys.argv[3])
def names_everywhere(exclude):
    s=set()
    for f in glob.glob('FOOD_*.json'):
        if f==exclude: continue
        for r in json.load(open(f)): s.add(r['n'].lower())
    for f in glob.glob('SIGHTS_*.json'):
        if f==exclude: continue
        for r in json.load(open(f)).get('sights',[]): s.add(r['n'].lower())
    ds=json.load(open('../singapore.dataset.json'))
    for k in ('P','F'):
        for r in ds.get(k,[]): s.add(r['n'].lower())
    return s
if kind=='geo':
    cur=json.load(open(path)) if os.path.exists(path) else []
    have={r['n'] for r in cur}
    for r in payload:
        if r['n'] in have: cur=[x for x in cur if x['n']!=r['n']]
        cur.append(r)
    json.dump(cur,open(path,'w'),indent=1,ensure_ascii=False); print(path,len(cur)); sys.exit()
seen=names_everywhere(path)
if kind=='food':
    cur=json.load(open(path)) if os.path.exists(path) else []
else:
    cur=json.load(open(path)) if os.path.exists(path) else {"sights":[],"sources":[]}
lst=cur if kind=='food' else cur['sights']
mine={r['n'].lower() for r in lst}
for r in payload:
    if r['n'].lower() in seen: print('DUP elsewhere, skipped:',r['n']); continue
    if r['n'].lower() in mine: lst[:]=[x for x in lst if x['n'].lower()!=r['n'].lower()]
    ok={s[0] for s in r['sources'] if s[0] not in ('YELP','TRIPADVISOR','GOOGLE','BURPPLE')}
    assert len(ok)>=2 or ok&{'MICHELIN','MICHELIN_BIB','UNESCO'}, ('under-sourced',r['n'])
    lst.append(r)
json.dump(cur,open(path,'w'),indent=1,ensure_ascii=False)
print(path,len(lst))
