import json,re,os,glob,html as H
import os; B=os.path.join(os.path.dirname(os.path.abspath(__file__)),'../../../../beta')
tot=mis=miss_attr=extra=vis=0; pages=0; noattr_has=0; closed=closed_ok=0; bad_closed=[]; feedbad=[]; vislines=0; dupe=0
for f in sorted(glob.glob(B+'/data/places/*.json')):
    d=json.load(open(f)); pages+=1
    h=open(os.path.join(B,d['beta'])).read()
    by={p['id']:p for p in d['places']}
    # split li.pl
    parts=re.split(r'(?=<li class="pl[ "])',h)
    seen=set()
    for chunk in parts[1:]:
        m=re.match(r'<li class="pl([^"]*)" id="p-([^"]+)"([^>]*)>',chunk)
        if not m: continue
        pid=H.unescape(m.group(2)); attrs=m.group(3)
        if pid in seen: dupe+=1; continue
        seen.add(pid); tot+=1
        body=chunk[:chunk.find('</li>')]
        p=by.get(pid); want=(p.get('pv') or {}).get('checked') if p else None
        c=re.search(r'data-checked="([^"]*)"',attrs); got=c.group(1) if c else None
        if want!=got: mis+=1
        if re.search(r'>\s*Checked\s',body) or 'pl-ck' in body: vislines+=1
        if 'data-closed' in attrs:
            closed+=1
            e=re.search(r'<p class="pl-e">(.*?)</p>',body,re.S).group(1)
            t=re.sub('<[^>]+>','',e)
            if re.search(r'per .+, checked \d{4}-\d\d-\d\d',t): closed_ok+=1
            else: bad_closed.append((d['key'],pid,t.strip()[:80]))
    missing=set(by)-seen
    extra+=len(missing)
    feed=re.search(r'href="([^"]*feeds/[^"]+\.xml)"',h)
    if not feed or not os.path.exists(os.path.normpath(os.path.join(B,os.path.dirname(d['beta']),feed.group(1)))): feedbad.append(d['key'])
    vf='Follow changes' in h
    if not vf: pass
print(dict(pages=pages,cards=tot,mismatch=mis,records_without_card=extra,dupes=dupe,visible_checked_lines=vislines,closed=closed,closed_with_src_and_date=closed_ok,feedbad=feedbad))
print('closed lacking src/date sample',len(bad_closed),bad_closed)
