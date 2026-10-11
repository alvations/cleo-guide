#!/usr/bin/env python3
"""W7 design system v2 — the ONE line-icon set. 24-px grid, 1.5 stroke, round caps and joins, no fills, generic subjects
only (never a venue, logo or mascot). Source of truth for builders: icons/icons.json ({name: inner svg}); also writes
icons/sprite.svg (<symbol id="i-<name>">) and icons/sheet.html (review sheet, self-contained).
    python3 design/beta/style/v2/tools/icons.py
The set = the existing original glyphs (design/beta/tools/svgkit.py ICONS, the W1 additions in build-css.py) + the
category-bar subjects v2 adds. Rendering rule (tokens + V2 layer): .ico { stroke-width: var(--icon-stroke) } = 1.5."""
import json, os, sys
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', '..', '..')
sys.path.insert(0, os.path.join(R, 'design', 'beta', 'tools'))
from svgkit import ICONS
W1 = {
  'wave':  '<path d="M2.5 8.5c2.4 0 2.4-2 4.75-2S9.6 8.5 12 8.5s2.4-2 4.75-2 2.35 2 4.75 2M2.5 13.5c2.4 0 2.4-2 4.75-2s2.35 2 4.75 2 2.4-2 4.75-2 2.35 2 4.75 2M2.5 18.5c2.4 0 2.4-2 4.75-2s2.35 2 4.75 2 2.4-2 4.75-2 2.35 2 4.75 2"/>',
  'train': '<rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 10h14M8.5 21l2-4M15.5 21l-2-4"/><circle cx="9" cy="13.5" r=".9"/><circle cx="15" cy="13.5" r=".9"/>',
  'flag':  '<path d="M5 21V3.5M5 4h12l-2.5 4L17 12H5"/>',
  'plane': '<path d="M21 4.5L3 11l7 2.5 2.5 7z"/><path d="M10 13.5l4-4"/>',
  'frame': '<rect x="3.5" y="4.5" width="17" height="15" rx="1"/><path d="M6.5 16.5l4-5 3 3.5 2-2.2 2 3.7"/><circle cx="15.5" cy="8.5" r="1.3"/>',
}
V2 = {   # category-bar subjects added in W7 — same grid and stroke
  'spire':  '<path d="M12 2.5l3.5 6.5v11.5h-7V9z"/><path d="M5 20.5h14M10.5 20.5v-4a1.5 1.5 0 0 1 3 0v4M12 9.5v2.5"/>',
  'bag':    '<path d="M5 8h14l-1 12.5H6z"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10"/>',
  'eye':    '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  'music':  '<path d="M9 18V5.5l11-2V16"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
  'sun':    '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
  'grid':   '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
  'chart':  '<path d="M4 20V4M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
  'tree':   '<path d="M12 21v-5"/><path d="M12 3l6 9h-3l3 4H6l3-4H6z"/>',
  'cocktail': '<path d="M4.5 4.5h15L12 13z"/><path d="M12 13v7.5M8 20.5h8M16 4.5l2-2"/>',
  'bread':  '<path d="M4 11a4 4 0 0 1 2-6.5c2-1 4 .5 6 .5s4-1.5 6-.5a4 4 0 0 1 2 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19z"/>',
  'ice':    '<path d="M8 10a4 4 0 0 1 8 0"/><path d="M7.5 10h9L12 21.5z"/>',
  'bed':    '<path d="M3 19v-11M3 15h18v4M21 15v-3a3 3 0 0 0-3-3h-7v6"/><circle cx="7" cy="11.5" r="1.8"/>',
}
SET = dict(ICONS); SET.update(W1); SET.update(V2)
out = os.path.join(R, 'design', 'beta', 'style', 'v2', 'icons')
os.makedirs(out, exist_ok=True)
json.dump(dict(sorted(SET.items())), open(os.path.join(out, 'icons.json'), 'w'), indent=1)
sym = ''.join(f'<symbol id="i-{k}" viewBox="0 0 24 24">{v}</symbol>' for k, v in sorted(SET.items()))
open(os.path.join(out, 'sprite.svg'), 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" style="display:none">{sym}</svg>\n')
cells = ''.join(f'<figure><svg viewBox="0 0 24 24"><use href="#i-{k}"/></svg><figcaption>{k}</figcaption></figure>' for k in sorted(SET))
open(os.path.join(out, 'sheet.html'), 'w').write(f'''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Line icons v2</title>
<style>:root{{--paper:#F9F7F3;--ink:#1C1917;--ink-3:#68615B;--line:#E7E2DB}}@media (prefers-color-scheme:dark){{:root{{--paper:#131110;--ink:#F2EEEA;--ink-3:#A69E97;--line:#302B28}}}}
body{{margin:0;padding:32px 16px;background:var(--paper);color:var(--ink);font:15px/1.4 Inter,system-ui,sans-serif}}h1{{font-weight:600;letter-spacing:-.02em;margin:0 0 4px}}p{{color:var(--ink-3);margin:0 0 24px}}
main{{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:1px;background:var(--line);border:1px solid var(--line);max-width:1100px}}
figure{{margin:0;background:var(--paper);display:grid;place-items:center;gap:8px;padding:18px 6px 12px}}svg{{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}}
figcaption{{font-size:12px;color:var(--ink-3)}}</style>{sym.join('') if False else ''}<svg style="display:none">{sym}</svg>
<h1>Line icons · v2</h1><p>{len(SET)} icons · 24 px grid · 1.5 stroke · round caps · generic subjects only</p><main>{cells}</main></html>
''')
print(f'icons: {len(SET)} → icons.json, sprite.svg, sheet.html')
