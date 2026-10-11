#!/usr/bin/env python3
"""W7 amendment: instance + subset each expressive display candidate (one cut, the axes we would ship) so the pairings
can be shot on the real pages. Writes design/beta/style/v2/type/fonts/<id>-<subset>.woff2 and candidates.css
(@font-face, family "Disp <Name>"). Reuses W6 make-fonts.py (ranges, features, instancer). Review assets only — the
winner is rebuilt into beta/assets/fonts/ by make-display-font.py.
    python3 design/beta/style/v2/tools/make-display-candidates.py <node_modules with @fontsource-variable packages>"""
import importlib.util, os, sys
H = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('mf', os.path.join(H, '..', '..', 'tools', 'make-fonts.py'))
mf = importlib.util.module_from_spec(spec); spec.loader.exec_module(mf)
CANDS = {   # id: (family, package, file pattern, axis pins) — the cut that reads "inviting, youthful, still classy"
  'fraunces':  ('Fraunces', 'fraunces', 'fraunces-{s}-full-normal.woff2', {'opsz': 96, 'SOFT': 100, 'WONK': 1, 'wght': (400, 650)}),
  'bricolage': ('Bricolage Grotesque', 'bricolage-grotesque', 'bricolage-grotesque-{s}-opsz-normal.woff2', {'opsz': 96, 'wght': (400, 700)}),
  'unbounded': ('Unbounded', 'unbounded', 'unbounded-{s}-wght-normal.woff2', {'wght': (400, 600)}),
  'spacegrotesk': ('Space Grotesk', 'space-grotesk', 'space-grotesk-{s}-wght-normal.woff2', {'wght': (400, 700)}),
  'newsreader': ('Newsreader', 'newsreader', 'newsreader-{s}-opsz-normal.woff2', {'opsz': 72, 'wght': (400, 650)}),
}
nm = sys.argv[1]; out = os.path.join(H, '..', 'type', 'fonts'); os.makedirs(out, exist_ok=True)
css, sizes = [], {}
for cid, (fam, pkg, pat, pins) in CANDS.items():
    tot = 0
    for s in ('vietnamese', 'latin-ext', 'latin'):
        src = os.path.join(nm, '@fontsource-variable', pkg, 'files', pat.format(s=s))
        data = mf.build(src, None, pins, mf.RANGES[s]); tot += len(data)
        name = f'{cid}-{s}.woff2'; open(os.path.join(out, name), 'wb').write(data)
        lo, hi = pins['wght']
        css.append(f'@font-face {{ font-family: "Disp {fam}"; font-weight: {lo} {hi}; font-display: swap; src: url("/design/beta/style/v2/type/fonts/{name}") format("woff2"); unicode-range: {mf.RANGES[s]}; }}')
    lic = os.path.join(nm, '@fontsource-variable', pkg, 'LICENSE')
    if os.path.exists(lic): open(os.path.join(out, f'OFL-{cid}.txt'), 'w').write(open(lic).read())
    sizes[cid] = round(tot / 1024, 1); print(f'{cid:13} {fam:20} {sizes[cid]:6} KB (vi + latin-ext + latin, one cut)')
open(os.path.join(out, 'candidates.css'), 'w').write('\n'.join(css) + '\n')
