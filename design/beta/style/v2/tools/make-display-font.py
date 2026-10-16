#!/usr/bin/env python3
"""W7 design system v2 (owner amendment): build the display face — Bricolage Grotesque, one cut (opsz pinned at 72,
wght 500–700) — as self-hosted woff2 subsets for headlines, city names and big numbers (≥ 22 px). Inter stays the text
and UI face. Reuses W6 make-fonts.py's ranges, features and instancer.

    npm install --prefix <dir> @fontsource-variable/bricolage-grotesque@5.3.0 ; pip install fonttools brotli
    python3 design/beta/style/v2/tools/make-display-font.py <dir>/node_modules beta/assets/fonts

Writes bricolage-normal-{vietnamese,latin-ext,latin}.woff2, copies the licence to OFL-Bricolage.txt and prints the
@font-face block. The two characters the face lacks (ǔ ʼ) fall through to Inter, then the system stack. Licence: SIL OFL 1.1."""
import os, shutil, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'tools'))
import importlib.util
spec = importlib.util.spec_from_file_location('mf', os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'tools', 'make-fonts.py'))
mf = importlib.util.module_from_spec(spec); spec.loader.exec_module(mf)
nm, outdir = sys.argv[1], sys.argv[2]
css = []
for s in ('vietnamese', 'latin-ext', 'latin'):
    src = os.path.join(nm, '@fontsource-variable', 'bricolage-grotesque', 'files', f'bricolage-grotesque-{s}-opsz-normal.woff2')
    data = mf.build(src, None, {'opsz': 72, 'wght': (500, 700)}, mf.RANGES[s])
    name = f'bricolage-normal-{s}.woff2'
    open(os.path.join(outdir, name), 'wb').write(data)
    print(f'  {name}: {len(data)/1024:.1f} KB', file=sys.stderr)
    css.append(f'@font-face {{ font-family: "Bricolage Grotesque"; font-style: normal; font-weight: 500 700; font-display: swap;\n'
               f'  src: url("fonts/{name}") format("woff2");\n  unicode-range: {mf.RANGES[s].replace(",", ", ")}; }}')
shutil.copy(os.path.join(nm, '@fontsource-variable', 'bricolage-grotesque', 'LICENSE'), os.path.join(outdir, 'OFL-Bricolage.txt'))
print('\n'.join(css))
