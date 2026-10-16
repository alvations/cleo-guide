import json,os,re
import os; D=os.path.join(os.path.dirname(os.path.abspath(__file__)),'../../../../beta')+'/'
ch={p['key']:p for p in json.load(open(D+'data/changes.json'))['pages']}
bad=[];n=0;photo_bad=[];nc=0;nch=0;vn=0
for f in sorted(os.listdir(D+'data/places')):
  p=json.load(open(D+'data/places/'+f)); n+=1
  top=max([c['d'] for c in p.get('changes') or []] or ['']);
  c=ch.get(p['key'])
  if not c: bad.append((f,'not in changes.json')); continue
  if top!=c['last']: bad.append((f,'page newest',top,'changes.json last',c['last']))
  if c['closed']!=p['stats']['closed']: bad.append((f,'closed',c['closed'],p['stats']['closed']))
  # the built page's edition line
  h=open(D+p['beta']).read()
  m=re.search(r'<p class="edition" data-edition="([^"]+)">(.*?)</p>',h,re.S)
  if m:
    if m.group(1)!=c['last'][:7]: bad.append((f,'html edition',m.group(1),c['last']))
  ids={x['id']:x for x in p['places']}
  if p.get('coverPhoto'):
    nc+=1
    if p['country']=='vietnam': photo_bad.append((f,'vn cover'))
    for pid,x in ids.items():
      if '--'+pid+'-' in p['coverPhoto']['src'] and (x['kind']!='sight' or x.get('closed')): photo_bad.append((f,'cover',pid))
  for a,cp in (p.get('chapterPhotos') or {}).items():
    nch+=1; x=ids.get(cp['id'])
    if p['country']=='vietnam' or not x or x['kind']!='sight' or x.get('closed'): photo_bad.append((f,'chapter',cp['id']))
  if p['country']=='vietnam': vn+=1
  # any per-place photo field on food/closed
  for x in p['places']:
    if (x['kind']!='sight' or x.get('closed')) and (x.get('ph') or x.get('photo')): photo_bad.append((f,'place photo',x['id']))
print('pages',n,'edition/closed mismatches vs changes.json',len(bad),bad[:6])
print('cover photos',nc,'chapter photos',nch,'vietnam pages',vn,'photo violations',len(photo_bad),photo_bad[:6])
