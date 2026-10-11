#!/usr/bin/env python3
"""W7 design system v2 — ROUND-6 gap #3: snap every raw px font size and stray radius in the designer's stylesheet
sources onto the v2 token scale, so the shipped CSS has a short, documented set of steps.
    python3 design/beta/style/v2/tools/normalize-v2.py [--check]
Font sizes (font-size: and the size slot of font:) — nearest v2 step:
    ≤ 12.5 → --fs-xs (12) · 13–13.5 → --fs-meta (13) · 14–15.5 → --fs-sm (14) · 16–16.5 → --fs-body (16)
    17–23 → --fs-lead (17/18) · 24–36 → --fs-d2 (22/28) · 37–56 → --fs-d1 (34/52) · > 56 → --fs-hero (38/60)
    (clamp()/calc() container-query sizes on the retired vertical plates → --fs-d2.)
Radii (single-value border-radius:): 6 → --r-xs · 8–10 → --r-s · 11–14 → --r-m · 15–24 → --r-l · ≥ 99 → --r-pill;
    circles (50%), 0–4 px hairline bars and multi-value radii are left alone.
Also (one-off, W7): cqh plate sizes, the drop cap and the print size moved onto tokens; 4 px bars → 3 px.
Refuses to write if any file's rule count changes. Owned files only (FE-A / FE-B normalise their own)."""
import re, sys, os
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', '..', '..')
FILES = ['beta/assets/constellation.css', 'design/beta/css/contract.css', 'design/beta/css/views.css', 'design/beta/css/v2.css']
def fs_tok(v):
    v = float(v)
    return ('--fs-xs' if v <= 12.5 else '--fs-meta' if v < 14 else '--fs-sm' if v < 16 else '--fs-body' if v < 17 else
            '--fs-lead' if v <= 23 else '--fs-d2' if v <= 36 else '--fs-d1' if v <= 56 else '--fs-hero')
def r_tok(v):
    v = float(v)
    if v <= 4: return None
    return '--r-xs' if v <= 6 else '--r-s' if v <= 10 else '--r-m' if v <= 14 else '--r-l' if v <= 24 else '--r-pill' if v >= 99 else None
N = {'fs': 0, 'r': 0}
def fix(css):
    def fsz(m):
        val = m.group(2)
        nv = re.sub(r'^(\s*)(\d+(?:\.\d+)?)px', lambda x: (N.__setitem__('fs', N['fs'] + 1) or f'{x.group(1)}var({fs_tok(x.group(2))})'), val)
        nv = re.sub(r'^(\s*)clamp\([^;{}]*?\)\)?(?=\s*(!important)?\s*$)', lambda x: (N.__setitem__('fs', N['fs'] + 1) or f'{x.group(1)}var(--fs-d2)'), nv)
        return m.group(1) + nv
    css = re.sub(r'((?<![-\w])font-size\s*:)([^;}]+)', fsz, css)
    def fnt(m):   # the size slot of the font shorthand: the first <n>px followed by "/" or a space + family/var
        val = m.group(2)
        nv = re.sub(r'(?<![\w.(-])(\d+(?:\.\d+)?)px(?=\s*/|\s+(?:var\(|["\'A-Za-z]))', lambda x: (N.__setitem__('fs', N['fs'] + 1) or f'var({fs_tok(x.group(1))})'), val, count=1)
        return m.group(1) + nv
    css = re.sub(r'((?<![-\w])font\s*:)([^;}]+)', fnt, css)
    def rad(m):
        v = m.group(2); t = r_tok(v)
        if not t: return m.group(0)
        N['r'] += 1; return f'{m.group(1)}var({t}){m.group(3)}'
    css = re.sub(r'((?<![-\w])border-radius\s*:\s*)(\d+(?:\.\d+)?)px(\s*(?:!important)?\s*[;}])', rad, css)
    return css
bad = 0
for f in FILES:
    p = os.path.join(R, f); s = open(p).read(); n0 = s.count('{')
    t = fix(s)
    assert t.count('{') == n0, f'{f}: rule count changed — refusing'
    if '--check' in sys.argv:
        if t != s: print('normalize-v2: OUT OF DATE', f); bad = 1
    elif t != s: open(p, 'w').write(t)
print(f'normalize-v2: {N["fs"]} font sizes, {N["r"]} radii → tokens' + (' (check)' if '--check' in sys.argv else ''))
sys.exit(bad)
