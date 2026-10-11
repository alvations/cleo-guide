#!/usr/bin/env python3
"""W6: map raw in-between font sizes and stray radii in the beta stylesheet sources onto the token scale.
    python3 design/beta/style/tools/normalize-css.py [--check]
Font sizes (in `font-size:` and `font:` declarations only):
    12.5px → --fs-xs · 13 / 13.5px → --fs-meta (13) · 14 / 14.5px → --fs-sm (14) · 15px → --fs-ui · 16px → --fs-body
    (Inter sets larger than Figtree at the same px, so half-pixel steps round DOWN — the visual size holds.)
Weights (in `font-weight:` and `font:`): 450/460 → 400 · 550 → 500 · 650 → 600 (Inter's static-instance steps; Figtree's
in-between weights read heavier in Inter).
Radii (in `border-radius:` only): 6 → --r-xs · 8/9/10 → --r-s · 12/13/14/16 → --r-m · 20/24 → --r-l · 999 → --r-pill.
A radius equal to half the rule's own width or height is a circle and is left alone; 3–4 px (bars, swatches) too.
Refuses to write if the rule count of any file changes."""
import re, sys, os
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', '..')
FILES = ['beta/assets/constellation.css', 'design/beta/css/contract.css', 'design/beta/css/views.css', 'tools/beta/lib/render/fe-a.css']
FS = {'12.5': '--fs-xs', '13': '--fs-meta', '13.5': '--fs-meta', '14': '--fs-sm', '14.5': '--fs-sm', '15': '--fs-ui', '16': '--fs-body'}
RAD = {'6': '--r-xs', '8': '--r-s', '9': '--r-s', '10': '--r-s', '12': '--r-m', '13': '--r-m', '14': '--r-m', '16': '--r-m',
       '20': '--r-l', '24': '--r-l', '999': '--r-pill'}
stats = {}

def fix_block(body):
    n = {'fs': 0, 'r': 0}
    dims = set(re.findall(r'(?:^|[;{\s])(?:width|height|min-width|min-height)\s*:\s*(\d+(?:\.\d+)?)px', body))
    def fs_decl(m):
        prop, val = m.group(1), m.group(2)
        def px(mm):
            v = mm.group(1)
            if v in FS: n['fs'] += 1; return f'var({FS[v]})'
            return mm.group(0)
        if prop == 'font-size':
            new = re.sub(r'^\s*(\d+(?:\.\d+)?)px(?=\s*(?:!important)?\s*$)', px, val)
        else:   # font shorthand: the size is the token right before "/" or before the family
            new = re.sub(r'(?<=\s)(\d+(?:\.\d+)?)px(?=/|\s+var\(--font|\s+[A-Za-z"])', px, ' ' + val)[1:]
        return f'{prop}:{new}'
    WT = {'450': '400', '460': '400', '550': '500', '650': '600'}
    def wt(m):
        n['fs'] += 1; return m.group(1) + WT[m.group(2)]
    body = re.sub(r'((?:font-weight|font)\s*:\s*(?:italic\s+)?)(450|460|550|650)\b', wt, body)
    body = re.sub(r'(font-size|font)\s*:([^;{}]*)', lambda m: fs_decl(m) if not m.group(0).startswith('font-') or m.group(1) == 'font-size' else m.group(0), body)
    def rad_decl(m):
        def px(mm):
            v = mm.group(1)
            if v in RAD and str(int(float(v)) * 2) not in dims: n['r'] += 1; return f'var({RAD[v]})'
            return mm.group(0)
        return 'border-radius:' + re.sub(r'\b(\d+)px\b', px, m.group(1))
    body = re.sub(r'border-radius\s*:([^;{}]*)', rad_decl, body)
    body = re.sub(r'var\((--[\w-]+),\s*var\(\1\)\)', r'var(\1)', body)      # var(--r-pill, 999px) → var(--r-pill)
    return body, n

def run(path):
    s = open(path, encoding='utf8').read()
    n0 = s.count('{')
    out, tot = [], {'fs': 0, 'r': 0}
    # split into rule bodies (text between { and }) so circle detection sees one rule at a time
    pos = 0
    for m in re.finditer(r'\{([^{}]*)\}', s):
        out.append(s[pos:m.start(1)])
        body, n = fix_block(m.group(1)); out.append(body)
        tot['fs'] += n['fs']; tot['r'] += n['r']; pos = m.end(1)
    out.append(s[pos:])
    new = ''.join(out)
    assert new.count('{') == n0, f'{path}: rule count changed'
    return s, new, tot

if __name__ == '__main__':
    dirty = 0
    for f in FILES:
        p = os.path.join(R, f); old, new, tot = run(p)
        print(f'{f}: {tot["fs"]} font sizes/weights, {tot["r"]} radii → tokens')
        if old != new:
            dirty += 1
            if '--check' not in sys.argv: open(p, 'w', encoding='utf8').write(new)
    if '--check' in sys.argv and dirty: sys.exit('normalize-css: sources not normalized — run without --check')
