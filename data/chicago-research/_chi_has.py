import json,glob,os,sys
names=[]
for f in glob.glob(os.path.dirname(os.path.abspath(__file__))+'/*.json'):
    b=os.path.basename(f)
    if b.startswith(('_','SOURCES','CREATORS','chi_')): continue
    d=json.load(open(f)); arr=d if isinstance(d,list) else d.get('sights',[])
    names+= [(x['n'],x['a'],b) for x in arr]
for q in sys.argv[1:]:
    hits=[n for n in names if q.lower() in n[0].lower()]
    print(q,'->',hits or '-')
