#!/usr/bin/env python3
"""css-dead.py — platform W8 (R7 gap 7): find (and with --apply, remove) CSS selectors that can never match.

Conservative by construction. A selector is DEAD only when one of the class (.x) or id (#x) tokens in its top-level
compounds appears nowhere in the live universe:
  * every generated page under beta/ (all markup, incl. <noscript> deferred cards and inline scripts),
  * every JS file under tools/beta (client, templates, lib, tests, qa, shots), tools/*.js and the evaluator probes,
  * the vendored Leaflet (its own leaflet-* classes).
A token counts as live if it appears as a whole word anywhere in that text, or if any string literal there ends in a
prefix it starts with ('pg-' + n). Tokens inside :not() :is() :where() :has() never make a selector dead. A rule is
removed only when EVERY selector in its list is dead; a list with some live selectors loses just the dead ones.
@media/@supports/@container blocks are kept unless they end up empty; @keyframes/@font-face/@property are never touched.

  python3 tools/beta/css-dead.py                 # report per source file (bytes that would go)
  python3 tools/beta/css-dead.py --apply         # rewrite the designer's SOURCE files, then run build-css.py
  python3 tools/beta/css-dead.py --list          # also print every dead selector
"""
import os, re, sys, glob
R = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SOURCES = ['beta/assets/constellation.css', 'design/beta/css/contract.css', 'design/beta/css/views.css', 'design/beta/css/v2.css']

def universe():
    txt = []
    for f in glob.glob(os.path.join(R, 'beta', '**', '*.html'), recursive=True): txt.append(open(f, encoding='utf8').read())
    for f in glob.glob(os.path.join(R, 'tools', 'beta', '**', '*.js'), recursive=True):
        if '/node_modules/' in f: continue
        txt.append(open(f, encoding='utf8').read())      # incl. tests, qa/ and shot scripts: a rule a test reads stays
    for f in glob.glob(os.path.join(R, 'tools', '*.js')) + glob.glob(os.path.join(R, 'design', 'beta', 'eval', '*', 'tools', '*.js')):
        txt.append(open(f, encoding='utf8').read())
    for f in ['beta/assets/vendor/leaflet/leaflet.js']: txt.append(open(os.path.join(R, f), encoding='utf8').read())
    big = '\n'.join(txt)
    words = set(re.findall(r'[A-Za-z_][\w-]*', big))
    prefixes = set(m for m in re.findall(r"""['"`]([A-Za-z][\w-]*-)['"`]""", big)) | set(re.findall(r"""([A-Za-z][\w-]*-)['"`]\s*\+""", big)) | set(re.findall(r"""([A-Za-z][\w-]*-)\$\{""", big))
    return words, prefixes

def strip_functional(sel):
    out, i = [], 0
    while i < len(sel):
        m = re.match(r':(?:not|is|where|has|matches|-webkit-any)\(', sel[i:])
        if m:
            d, j = 1, i + m.end()
            while j < len(sel) and d: d += {'(': 1, ')': -1}.get(sel[j], 0); j += 1
            out.append(' '); i = j; continue
        out.append(sel[i]); i += 1
    s = ''.join(out)
    s = re.sub(r'\[[^\]]*\]', ' ', s)           # attribute selectors never make a selector dead
    s = re.sub(r'::?[\w-]+(\([^)]*\))?', ' ', s)  # other pseudos
    return s

def dead_selector(sel, words, prefixes):
    for tok in re.findall(r'[.#](-?[A-Za-z_][\w-]*)', strip_functional(sel)):
        if tok in words: continue
        if any(tok.startswith(p) for p in prefixes): continue
        return tok
    return None

def split_list(s):
    out, d, cur = [], 0, ''
    for ch in s:
        if ch in '([': d += 1
        elif ch in ')]': d -= 1
        if ch == ',' and d == 0: out.append(cur); cur = ''
        else: cur += ch
    out.append(cur); return out

def blank_comments(css):
    return re.sub(r'/\*.*?\*/', lambda m: re.sub(r'[^\n]', ' ', m.group(0)), css, flags=re.S)

def walk(css, words, prefixes, edits, dead_list, lo=0, hi=None):
    """Scan [lo,hi) of the comment-blanked text; append (start,end,replacement) edits. Returns live-rule count."""
    c = BL; hi = len(c) if hi is None else hi; i = lo; live = 0
    while i < hi:
        j = c.find('{', i)
        if j < 0 or j >= hi: break
        k = c.rfind(';', i, j); k2 = c.rfind('}', i, j); start = max(i, k + 1, k2 + 1)
        prelude = c[start:j].strip()
        d, e = 1, j + 1
        while e < len(c) and d:
            if c[e] == '{': d += 1
            elif c[e] == '}': d -= 1
            e += 1
        if prelude.startswith('@'):
            if re.match(r'@(media|supports|container|layer)\b', prelude):
                n0 = len(edits); inner_live = walk(css, words, prefixes, edits, dead_list, j + 1, e - 1)
                if inner_live == 0:
                    del edits[n0:]; edits.append((start, e, ''))
                else: live += 1
            else: live += 1
        else:
            sels = split_list(prelude)
            dead = [(s, dead_selector(s, words, prefixes)) for s in sels]
            keep = [s for s, t in dead if not t]
            for s, t in dead:
                if t: dead_list.append((s.strip(), t))
            if not keep: edits.append((start, e, ''))
            else:
                live += 1
                if len(keep) < len(sels):
                    # rebuild the selector list from the ORIGINAL text (comments may sit in a prelude: keep it simple — only
                    # rewrite when the prelude has no comment)
                    if css[start:j] == c[start:j]:
                        lead = re.match(r'\s*', css[start:j]).group(0)
                        edits.append((start, j, lead + ', '.join(s.strip() for s in keep) + ' '))
        i = e
    return live

if __name__ == '__main__':
    words, prefixes = universe()
    total = 0
    for rel in SOURCES:
        p = os.path.join(R, rel); css = open(p, encoding='utf8').read(); BL = blank_comments(css)
        edits, dl = [], []
        walk(css, words, prefixes, edits, dl)
        out = css
        for s, e, rep in sorted(edits, reverse=True): out = out[:s] + rep + out[e:]
        out = re.sub(r'\n{3,}', '\n\n', out)
        saved = len(css.encode()) - len(out.encode()); total += saved
        print(f'{rel}: {len(css.encode())/1024:.1f} KB -> {len(out.encode())/1024:.1f} KB  ({saved/1024:.1f} KB dead, {len(dl)} dead selectors)')
        if '--list' in sys.argv:
            for s, t in dl: print(f'    dead (.{t}): {s[:140]}')
        if '--apply' in sys.argv: open(p, 'w', encoding='utf8').write(out)
    print(f'total dead: {total/1024:.1f} KB')
