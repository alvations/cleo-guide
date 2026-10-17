# Saves a panelist's returns (assistant output only), with rule-6 redactions.
# usage: TASKS_DIR=<agent output dir> python3 save-return.py <round> <ID> <agentId>   -> writes design/beta/atlas/panel/R<round>/panelists/<ID>.md (all distinct returns; last = scored)
import json,sys,re,os
rnd,k,aid=sys.argv[1],sys.argv[2],sys.argv[3]
src=os.path.join(os.environ.get('TASKS_DIR','.'),f'{aid}.output')   # the Agent tool's output JSONL for that panelist
found=[]
def walk(x):
  if isinstance(x,str):
    if ('## '+k) in x and '### Scores' in x and x not in found: found.append(x)
  elif isinstance(x,dict): [walk(v) for v in x.values()]
  elif isinstance(x,list): [walk(v) for v in x]
for line in open(src):
  try: d=json.loads(line)
  except Exception: continue
  m=d.get('message') if isinstance(d,dict) else None
  if not (isinstance(m,dict) and m.get('role')=='assistant'): continue  # skip tool results (prev-round files read by the panelist)
  walk(m.get('content'))
parts=[]
for f in found:
  p=f[f.index('## '+k):].strip()
  if p not in parts: parts.append(p)
if not parts: print(k,'NOT FOUND'); sys.exit(1)
txt=f'<!-- simulated composite persona; round {rnd} return(s), verbatim except rule-6 redactions. The LAST section is the scored return. -->\n'+'\n\n---\n\n'.join(parts)
red=[(r'GO Tokyo','[city tourism source]'),(r'Japan-guide','[guide site]'),(r'Michelin( Guide| G…)?','[restaurant guide]'),(r'Time Out','[listings magazine]'),(r'NYC Tourism \+ Conventions \(official\)','[official city tourism board]'),(r'Atlas Obscura','[curiosities guide]'),(r'Savor Japan','[food guide site]'),(r'Lone(ly Planet|l…|…)','[guidebook]…')]
for a,b in red: txt=re.sub(a,b,txt)
out=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','panel',f'R{rnd}','panelists'); os.makedirs(out,exist_ok=True)
open(f'{out}/{k}.md','w').write(txt+'\n')
tot=re.findall(r'\|\s*\**TOTAL\**\s*\|[^\n]*',parts[-1])
print(k,len(parts),'returns;',tot[-1] if tot else 'no total')
