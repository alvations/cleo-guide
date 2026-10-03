import json,glob,os
D=os.path.dirname(os.path.abspath(__file__))
reg=json.load(open(D+'/../geocodes.json'))['cities']['chicago-il']
pinned={k for k,v in reg.items() if v.get('lat')}
for f in glob.glob(D+'/geo/_geoout_*.json'):
    for g in json.load(open(f)):
        if g.get('lat'): pinned.add(g['n'])
out=[]
for f in sorted(glob.glob(D+'/[FS]*_*.json')):
    if 'SOURCES' in f: continue
    d=json.load(open(f)); arr=d if isinstance(d,list) else d['sights']
    for x in arr:
        if x['n'] not in pinned: out.append((x['a'],x['n'],x.get('address','')))
for o in sorted(out): print(' | '.join(o))
print(len(out))
