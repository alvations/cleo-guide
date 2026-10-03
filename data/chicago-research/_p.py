import json,sys,subprocess
# compact: name|lat|lng|apple-url|note  per line
rows=[]
for l in sys.stdin.read().strip().split('\n'):
    n,la,lo,u,note=[s.strip() for s in l.split('|')]
    rows.append({'n':n,'lat':float(la),'lng':float(lo),'geoSource':u+' — Apple Maps place pin (address matches record; WebSearch 2026-10-03)','note':'sanity: '+note})
subprocess.run(['python3','_chi_pin.py'],input=json.dumps(rows),text=True,check=True)
