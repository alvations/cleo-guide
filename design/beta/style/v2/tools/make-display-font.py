#!/usr/bin/env python3
"""W7 design system v2: build "Inter Display" — Inter's own optical-size 32 master (the display cut of the one family) —
as self-hosted woff2 subsets for headings ≥ 22 px. Reuses W6 make-fonts.py's ranges, features and instancer.

    npm install --prefix <dir> @fontsource-variable/inter@5.3.0 ; pip install fonttools brotli
    python3 design/beta/style/v2/tools/make-display-font.py <dir>/node_modules beta/assets/fonts

Writes interdisplay-normal-{vietnamese,latin-ext,latin}.woff2 (wght 500–700, opsz pinned at 32) and prints the
@font-face block. Characters outside these three subsets fall through to the Inter text cut (same family design), then
the system stack — so a rare glyph never renders in a foreign face. Licence: SIL OFL 1.1 (OFL-Inter.txt, already shipped)."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'tools'))
import importlib.util
spec = importlib.util.spec_from_file_location('mf', os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'tools', 'make-fonts.py'))
mf = importlib.util.module_from_spec(spec); spec.loader.exec_module(mf)
nm, outdir = sys.argv[1], sys.argv[2]
css = []
for s in ('vietnamese', 'latin-ext', 'latin'):
    src = os.path.join(nm, '@fontsource-variable', 'inter', 'files', f'inter-{s}-opsz-normal.woff2')
    data = mf.build(src, None, {'opsz': 32, 'wght': (500, 700)}, mf.RANGES[s])
    name = f'interdisplay-normal-{s}.woff2'
    open(os.path.join(outdir, name), 'wb').write(data)
    print(f'  {name}: {len(data)/1024:.1f} KB', file=sys.stderr)
    css.append(f'@font-face {{ font-family: "Inter Display"; font-style: normal; font-weight: 500 700; font-display: swap;\n'
               f'  src: url("fonts/{name}") format("woff2");\n  unicode-range: {mf.RANGES[s].replace(",", ", ")}; }}')
print('\n'.join(css))
