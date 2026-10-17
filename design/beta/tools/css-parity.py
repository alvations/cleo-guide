#!/usr/bin/env python3
"""css-parity.py BEFORE AFTER [--thresh 0.001] — compare two css-parity.js shot sets.
Prints every shot whose differing-pixel share exceeds the threshold (default 0.1 %), worst first, and writes a red
overlay diff next to AFTER (<name>.diff.png) for each one. Exit 1 if any shot differs."""
import os, sys
from PIL import Image, ImageChops
a, b = sys.argv[1], sys.argv[2]
th = float(sys.argv[sys.argv.index('--thresh') + 1]) if '--thresh' in sys.argv else 0.001
rows = []
for f in sorted(os.listdir(a)):
    if not f.endswith('.png') or f.endswith('.diff.png') or not os.path.exists(os.path.join(b, f)): continue
    x, y = Image.open(os.path.join(a, f)).convert('RGB'), Image.open(os.path.join(b, f)).convert('RGB')
    if x.size != y.size: rows.append((1.0, f, 'size')); continue
    d = ImageChops.difference(x, y).convert('L').point(lambda v: 255 if v > 24 else 0)
    share = sum(d.histogram()[255:]) / (x.size[0] * x.size[1])
    if share > th:
        rows.append((share, f, ''))
        ov = y.copy(); ov.paste((255, 0, 0), mask=d); ov.save(os.path.join(b, f[:-4] + '.diff.png'))
rows.sort(reverse=True)
for s, f, why in rows: print(f'{s * 100:6.2f} %  {f} {why}')
print(f'css-parity: {len(rows)} shot(s) differ by more than {th * 100:.2f} %')
sys.exit(1 if rows else 0)
