import json,re,os,glob
import os; B=os.path.join(os.path.dirname(os.path.abspath(__file__)),'../../../../beta')
r=dict(pages=0,closedpages=0,tile=0,alt_link=0,visible_feed_a=0,follow_txt=0,links_changes=0,changes_page_feed=0)
for f in sorted(glob.glob(B+'/data/places/*.json')):
    d=json.load(open(f)); r['pages']+=1
    h=open(os.path.join(B,d['beta'])).read()
    nc=sum(1 for p in d['places'] if p.get('closed'))
    if nc: r['closedpages']+=1; r['tile']+= 'data-closed="1"' in h
    r['alt_link']+=bool(re.search(r'<link rel="alternate" type="application/atom\+xml"[^>]*feeds/',h))
    r['visible_feed_a']+=bool(re.search(r'<a [^>]*href="[^"]*feeds/[^"]+\.xml"',h))
    r['follow_txt']+=('Follow changes' in h)
    r['links_changes']+=bool(re.search(r'<a [^>]*href="[^"]*changes/[^"]+\.html"',h))
    cp=os.path.join(B,'changes',os.path.basename(d['beta']))
    ch=os.path.join(B,'changes',d['key'].replace('singapore/','').replace('vietnam/','')+'.html')
print(r)
cs=glob.glob(B+'/changes/*.html'); print('changes pages',len(cs), 'with <a> feed', sum(bool(re.search(r'<a [^>]*href="[^"]*feeds/[^"]+\.xml"',open(c).read())) for c in cs))
