#!/usr/bin/env python3
"""QC-14: snap off-scale spacing (margin/padding/gap px values) to the 4-pt scale and the --s-* tokens.
Rules: values <= 2 px untouched; nearest multiple of 4; ties round UP for padding (air, touch size) and to the
8-grid for margin/gap; values inside calc()/clamp()/min()/max() untouched; exact token sizes become var(--s-N).
Usage: python3 design/beta/tools/snap-spacing.py <file.css> [...]   (asserts the rule count is unchanged)"""
import re,sys
TOK={4:'--s-1',8:'--s-2',12:'--s-3',16:'--s-4',20:'--s-5',24:'--s-6',32:'--s-7',40:'--s-8',56:'--s-9',72:'--s-10',96:'--s-11'}
PROP=r'(margin|padding|gap|row-gap|column-gap|(?:margin|padding)-(?:top|bottom|left|right|block|inline)(?:-start|-end)?|scroll-padding(?:-top|-bottom)?|scroll-margin(?:-top)?)'
def snapv(x, up=False):
    if x<=2: return None
    if x%4==0: return int(x)
    lo=int(x//4*4); hi=lo+4
    d_lo,d_hi=x-lo,hi-x
    if d_lo<d_hi: return lo or 4
    if d_hi<d_lo: return hi
    if up: return hi                # padding ties round up (keeps air and touch size)
    return lo if lo%8==0 else hi   # margin/gap ties go to the 8-grid
stats={'snapped':0,'tokenised':0}
def fixval(v, up=False):
    def num(m):
        sign,n=m.group(1),float(m.group(2))
        t=snapv(n, up)
        if t is None: return m.group(0)
        if t!=n: stats['snapped']+=1
        if not sign and t in TOK:
            stats['tokenised']+=1; return f'var({TOK[t]})'
        return f'{sign}{t}px'
    return re.sub(r'(?<![\w.(-])(-?)(\d+(?:\.\d+)?)px\b',num,v)
for f in sys.argv[1:]:
    s=open(f).read(); n0=s.count('{')
    def sub(m):
        if 'calc(' in m.group(3) or 'clamp(' in m.group(3) or 'max(' in m.group(3) or 'min(' in m.group(3): return m.group(0)
        return m.group(1)+m.group(2)+fixval(m.group(3))
    s2=re.sub(r'((?<![-\w])'+PROP+r'\s*:\s*)([^;}]+)',lambda m: m.group(1)+fixval(m.group(3), m.group(2).startswith(('padding','scroll-padding'))) if not re.search(r'calc\(|clamp\(|max\(|min\(',m.group(3)) else m.group(0),s)
    assert s2.count('{')==n0
    open(f,'w').write(s2)
print(stats)
