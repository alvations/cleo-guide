#!/usr/bin/env python3
"""WCAG contrast for the Salon tokens (light + "Night out"), parsed straight from prototypes/salon.css.
    python3 design/ux-2026-10/tools/contrast.py      (exit 1 if any text pair misses AA)"""
import os, re, sys
css = open(os.path.join(os.path.dirname(__file__), '..', 'prototypes', 'salon.css')).read()
blocks = {'light': css[css.index(':root{'):css.index('@media (prefers-color-scheme:dark)')],
          'night': css[css.index(':root[data-theme="dark"]'):css.index('*{box-sizing')]}
PAIRS = [('ink', 'paper'), ('ink-2', 'paper'), ('ink-3', 'paper'), ('ink-2', 'card'), ('ink-2', 'paper-2'), ('gilt', 'paper'), ('gilt', 'card'),
         ('gilt', 'gilt-wash'), ('jade', 'card'), ('lacquer', 'card'), ('pop', 'card'), ('pop', 'pop-wash'), ('ink', 'gilt-wash'), ('on-lacquer', 'lacquer')]
def lum(h):
    v = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    v = [c / 12.92 if c <= .03928 else ((c + .055) / 1.055) ** 2.4 for c in v]
    return .2126 * v[0] + .7152 * v[1] + .0722 * v[2]
bad = 0
for name, b in blocks.items():
    tok = dict(re.findall(r'--([\w-]+):(#[0-9A-Fa-f]{6})', b))
    print(f'— {name}')
    for fg, bg in PAIRS:
        a, c = lum(tok[fg]), lum(tok[bg]); r = (max(a, c) + .05) / (min(a, c) + .05)
        bad += r < 4.5
        print(f'  {fg:8} on {bg:9} {tok[fg]} / {tok[bg]}  {r:5.2f}  {"AA" if r >= 4.5 else "FAIL"}')
sys.exit(1 if bad else 0)
