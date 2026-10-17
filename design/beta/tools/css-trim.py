#!/usr/bin/env python3
"""css-trim.py — remove declarations that match but never win (R8 gap #6), from the designer's CSS SOURCES.

Reads design/beta/eval/css-cascade.json (css-cascade.js). A declaration is removed only when:
  - it matched at least MIN_M times across the sweep and won 0 times;
  - it sits in a hand-written designer source (constellation.css, contract.css, views.css, v2.css), never a generated piece;
  - it is not a vendor-prefixed property, nor the unprefixed twin of one in the same rule (other engines need the pair);
  - its property is not declared twice in the same rule (a deliberate fallback, e.g. 100vh then 100dvh);
  - it is not inside @supports or a print / reduced-motion / forced-colors block (the sweep never sees those states).
Then rules left empty, and @media blocks left empty, are removed too.
    python3 design/beta/tools/css-trim.py [--json PATH] [--dry]   # prints KB before → after per file
    python3 design/beta/tools/css-trim.py --coverage PATH [--dry]  # css-coverage.js: drop whole rules never used
Coverage mode keeps every rule that a sweep cannot exercise: dynamic-state selectors (:hover, :focus…, ::selection,
::placeholder), anything inside print / reduced-motion / forced-colors / hover / @supports blocks, keyframes and font
faces, Leaflet's own classes, and transient states (toast, offline, storage, error, empty, loading, skip, sr-only).
"""
import json, os, re, sys, collections
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..')
J = sys.argv[sys.argv.index('--json') + 1] if '--json' in sys.argv else os.path.join(R, 'design/beta/eval/css-cascade.json')
DRY = '--dry' in sys.argv
MIN_M = 1
SRC = {'cc-00-constellation.css': 'beta/assets/constellation.css', 'cc-01-contract.css': 'design/beta/css/contract.css',
       'cc-03-views.css': 'design/beta/css/views.css', 'cc-05-v2.css': 'design/beta/css/v2.css'}
COV = sys.argv[sys.argv.index('--coverage') + 1] if '--coverage' in sys.argv else None
data = json.load(open(J))['decl'] if not COV else {}

def lines_to_offsets(text):
    off, o = [0], 0
    for l in text.split('\n'): o += len(l) + 1; off.append(o)
    return off

def blocks(text):
    """yield (kind, start, open_brace, end, prelude) for every {...} block, skipping comments and strings"""
    out, stack, i, n, q = [], [], 0, len(text), None
    last = 0
    while i < n:
        c = text[i]
        if q:
            if c == '\\': i += 2; continue
            if c == q: q = None
            i += 1; continue
        if c in '"\'': q = c; i += 1; continue
        if text.startswith('/*', i): j = text.find('*/', i + 2); i = n if j < 0 else j + 2; continue
        if c == '{': stack.append((last, i)); last = i + 1
        elif c == '}':
            if stack: s, ob = stack.pop(); out.append((s, ob, i + 1, text[s:ob].strip(), len(stack)))
            last = i + 1
        elif c == ';' and not stack: last = i + 1
        elif c == ';': last = i + 1
        i += 1
    return out

total = collections.Counter()
KEEP_SEL = re.compile(r':(hover|focus|focus-visible|focus-within|active|visited|target|checked|invalid|placeholder-shown|disabled|indeterminate|fullscreen|popover-open|open|modal)|::(selection|placeholder|backdrop|marker|-webkit-|-moz-)|leaflet|toast|offline|storage|error|empty|loading|skeleton|skip|sr-only|visually-hidden|noscript|print|reduced|toolbar|saved|\.sv-|trip|been|\.day\b|share|import|export|results|\.hits|suggest', re.I)
KEEP_AT = re.compile(r'@(supports|keyframes|font-face|page|property|container)|@media[^{]*(print|prefers-reduced-motion|forced-colors|prefers-contrast|hover|pointer)', re.I)
if COV:
    cov = json.load(open(COV))
    for sheet, rel in SRC.items():
        p = os.path.join(R, rel); text = open(p).read(); used = cov['used'].get(sheet, [])
        bl = blocks(text)
        def is_used(a, b):
            lo, hi = 0, len(used)
            while lo < hi:
                mid = (lo + hi) // 2
                if used[mid][1] <= a: lo = mid + 1
                else: hi = mid
            return lo < len(used) and used[lo][0] < b
        drop = []
        for (s0, ob, e, pre, depth) in bl:
            if pre.startswith('@') or not pre: continue
            inner = [b for b in bl if ob < b[0] and b[2] <= e]
            if inner: continue                     # a style rule never contains blocks; skip anything odd
            enc = [b for b in bl if b[1] < s0 and e <= b[2]]
            if any(KEEP_AT.search(b[3]) for b in enc) or KEEP_AT.search(pre): continue
            if KEEP_SEL.search(pre): continue
            sel_start = s0 + (len(text[s0:ob]) - len(text[s0:ob].lstrip()))
            if is_used(sel_start, e): continue
            drop.append((sel_start, e))
        new = text
        for a, b in sorted(drop, reverse=True): new = new[:a] + new[b:]
        for _ in range(4):
            new2 = re.sub(r'@media[^{};]*\{\s*\}', '', new)
            if new2 == new: break
            new = new2
        before, after = len(text.encode()), len(new.encode())
        total['before'] += before; total['after'] += after
        print(f'{rel}: {len(drop)} unused rules, {before/1024:.1f} KB → {after/1024:.1f} KB')
        if not DRY: open(p, 'w').write(new)
    print(f'total: {total["before"]/1024:.1f} KB → {total["after"]/1024:.1f} KB (−{(total["before"]-total["after"])/1024:.1f} KB in sources)')
    sys.exit(0)
for sheet, rel in SRC.items():
    p = os.path.join(R, rel); text = open(p).read(); off = lines_to_offsets(text)
    bl = blocks(text)
    def enclosing(pos):
        return [b for b in bl if b[1] < pos < b[2]]
    cand = []
    for k, v in data.items():
        sh, lc = k.split('|');
        if sh != sheet or not v['m'] >= MIN_M or v['w']: continue
        ln, col = map(int, lc.split(':')); start = off[ln] + col
        cand.append((start, v))
    # rule bodies -> property names, to apply the twin / duplicate protections
    drop = []
    for start, v in cand:
        enc = enclosing(start)
        if not enc: continue
        rule = min(enc, key=lambda b: b[2] - b[1])
        if any(re.match(r'@(supports|media\s+print|media[^{]*(prefers-reduced-motion|forced-colors|print))', b[3]) for b in enc): continue
        body = text[rule[1] + 1:rule[2] - 1]
        props = [m.group(1).lower() for m in re.finditer(r'(?:^|[;{\s])(-?[a-zA-Z-]+)\s*:', re.sub(r'/\*.*?\*/', '', body, flags=re.S))]
        # the declaration's own text, from start to the next ';' or '}' at depth 0 (strings respected)
        j, q = start, None
        while j < rule[2] - 1:
            c = text[j]
            if q:
                if c == '\\': j += 2; continue
                if c == q: q = None
            elif c in '"\'': q = c
            elif c == '(':   # skip balanced parens (url(), var(), data URIs with ';')
                d = 1; j += 1
                while j < len(text) and d:
                    if text[j] == '(': d += 1
                    elif text[j] == ')': d -= 1
                    j += 1
                continue
            elif c in ';}': break
            j += 1
        decl = text[start:j]; name = decl.split(':', 1)[0].strip().lower()
        if not name or ':' not in decl: continue
        if name.startswith('-webkit-') or name.startswith('-moz-'): continue
        bare = re.sub(r'^-(webkit|moz)-', '', name)
        if any(re.sub(r'^-(webkit|moz)-', '', x) == bare and x != name for x in props): continue
        if props.count(name) > 1: continue
        end = j + 1 if j < len(text) and text[j] == ';' else j
        drop.append((start, end, name))
    # apply from the end
    new = text
    for s, e, _ in sorted(set(drop), reverse=True): new = new[:s] + new[e:]
    # remove rules and @media blocks left empty (repeat: an empty rule can empty its @media)
    for _ in range(4):
        new2 = re.sub(r'(^|[}\n;])([^{};/]*[^{};\s/][^{};/]*)\{\s*\}', r'\1', new)
        if new2 == new: break
        new = new2
    before, after = len(text.encode()), len(new.encode())
    total['before'] += before; total['after'] += after
    print(f'{rel}: {len(drop)} declarations, {before/1024:.1f} KB → {after/1024:.1f} KB')
    if not DRY: open(p, 'w').write(new)
print(f'total: {total["before"]/1024:.1f} KB → {total["after"]/1024:.1f} KB (−{(total["before"]-total["after"])/1024:.1f} KB in sources, comments included)')
