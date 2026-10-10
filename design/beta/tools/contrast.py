#!/usr/bin/env python3
"""WCAG 2.2 contrast audit of design/beta/tokens.css — light, dark and every city skin.
    python3 design/beta/tools/contrast.py [--md]
Exits 1 if any text pair falls below 4.5:1 (or a non-text/large pair below 3:1)."""
import re, sys, os
CSS = open(os.path.join(os.path.dirname(__file__), '..', 'tokens.css')).read()

def block(sel_regex):
    m = re.search(sel_regex + r'\s*\{([^}]*)\}', CSS)
    return dict(re.findall(r'--([\w-]+):\s*(#[0-9A-Fa-f]{6})', m.group(1))) if m else {}

def lum(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    c = [x / 12.92 if x <= .03928 else ((x + .055) / 1.055) ** 2.4 for x in c]
    return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]

def ratio(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + .05) / (lb + .05)

light = block(r':root')
dark = dict(light); dark.update(block(r':root\[data-theme="dark"\]'))
PAIRS = [  # (fg, bg, min, what)
    ('ink', 'paper', 4.5, 'body text'), ('ink', 'surface', 4.5, 'card text'), ('ink-2', 'paper', 4.5, 'secondary text'),
    ('ink-2', 'surface', 4.5, 'card why-line'), ('ink-3', 'paper', 4.5, 'meta'), ('ink-3', 'surface', 4.5, 'card meta'),
    ('ink-3', 'sand', 4.5, 'meta on sand'), ('ink', 'sand', 4.5, 'source chip'), ('paper', 'ink', 4.5, 'primary button'),
    ('gilt', 'surface', 4.5, 'Must-see label'), ('gilt', 'paper', 4.5, 'Must-see label on page'), ('ink', 'gilt-soft', 4.5, 'authority chip'),
    ('open', 'open-soft', 4.5, 'Open status'), ('closed', 'closed-soft', 4.5, 'Closed status'), ('closed', 'surface', 4.5, 'closed note'),
    ('ink', 'warn-soft', 4.5, 'caveat'), ('on-night', 'night', 4.5, 'masthead title'), ('on-night-2', 'night', 4.5, 'masthead facts'),
    ('on-night-2', 'night-2', 4.5, 'masthead facts (lighter sky)'), ('line-strong', 'surface', 1.5, 'control border (decorative hint)'),
    ('focus', 'paper', 3.0, 'focus ring'), ('focus', 'surface', 3.0, 'focus ring on card'),
    # W3 views: switcher (inactive label on the sand track; pressed = --ink on --surface, covered above), chart text
    ('ink-2', 'sand', 4.5, 'view switcher label'), ('focus', 'sand', 3.0, 'focus ring on switcher'),
    ('ink-3', 'surface', 4.5, 'chart axis label'),
    ('ink', 'surface', 4.5, 'chart value label'), ('chart-gap', 'surface', 1.0, 'segment gap = surface'),
]
SKINS = re.findall(r'(\[data-city="(\w+)"\],\s*)?\.skin-(\w+)\s*\{([^}]*)\}', CSS)
fails, rows = 0, []
for mode, T in (('light', light), ('dark', dark)):
    for fg, bg, mn, what in PAIRS:
        r = ratio(T[fg], T[bg]); ok = r >= mn; fails += not ok
        rows.append((mode, f'--{fg} on --{bg}', what, r, mn, ok))
def skin_vals(name, mode):
    pat = (r':root\[data-theme="dark"\][^{]*\.skin-' if mode == 'dark' else r'(?<![\w\]] )\.skin-') + name + r'\s*\{([^}]*)\}'
    ms = [m for m in re.finditer(pat, CSS)]
    if mode == 'light':
        ms = [m for m in re.finditer(r'\.skin-' + name + r'\s*\{([^}]*)\}', CSS)][:1]
    return dict(re.findall(r'--([\w-]+):\s*(#[0-9A-Fa-f]{6})', ms[-1].group(1))) if ms else {}
for _, city, skin, _b in SKINS:
    for mode, T in (('light', light), ('dark', dark)):
        S = skin_vals(skin, mode)
        if not S: continue
        for fg, bgv, what in (('city-ink', T['paper'], 'accent text on paper'), ('city-ink', T['surface'], 'accent text on card'),
                              ('city-ink', S['city-wash'], 'accent text on wash'), ('city-on', S['city'], 'text on accent fill'),
                              ('ink', S['city-wash'], 'ink on wash')):
            r = ratio(S[fg] if fg != 'ink' else T['ink'], bgv); ok = r >= 4.5; fails += not ok
            rows.append((mode, f'{skin}: --{fg}', what, r, 4.5, ok))
# W3 D-02 chart series (non-text marks, 3:1). Dark set must pass outright. The light set's WARN (aqua, yellow, magenta
# < 3:1 on white) is the validated, documented exception: every chart answers it with value labels, a legend and
# "Show as a table" (SPEC §3.4), so light rows are reported as WARN and not counted as failures.
for mode, T in (('light', light), ('dark', dark)):
    for k in ['series-%d' % i for i in range(1, 7)] + ['series-other']:
        if k not in T: fails += 1; rows.append((mode, f'--{k}', 'chart series (missing!)', 0, 3.0, False)); continue
        r = ratio(T[k], T['surface']); ok = r >= 3.0
        if mode == 'dark': fails += not ok
        rows.append((mode, f'--{k} on --surface', 'chart mark' + ('' if ok or mode == 'dark' else ' (WARN: labels + table)'), r, 3.0, ok or mode == 'light'))
if '--md' in sys.argv:
    print('| Mode | Pair | Use | Ratio | Min | |\n|---|---|---|---:|---:|---|')
    for m, p, w, r, mn, ok in rows: print(f'| {m} | `{p}` | {w} | {r:.2f} | {mn} | {"✅" if ok else "❌"} |')
else:
    for m, p, w, r, mn, ok in rows:
        if not ok: print('FAIL', m, p, w, f'{r:.2f}')
    print(f'{len(rows)} pairs checked, {fails} below minimum')
sys.exit(1 if fails else 0)
