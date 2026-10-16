#!/usr/bin/env python3
"""W6 type & style: build the self-hosted woff2 subsets for a type direction from the OFL @fontsource-variable packages.

    npm install --prefix <dir> @fontsource-variable/inter@5.3.0 @fontsource-variable/playfair@5.3.0 \
        @fontsource-variable/fraunces@5.3.0 @fontsource-variable/manrope@5.3.0
    pip install fonttools brotli
    python3 design/beta/style/tools/make-fonts.py <dir>/node_modules <direction: a|b|c> <outdir> [--css <fonts.css>] [--url-prefix fonts/]

What it does, per face × script subset (latin, latin-ext, latin-ext-more, vietnamese):
  1. instance the variable font: pin the optical size (one sturdy cut; DPR-1 macrons hold at display sizes) and keep
     only the weight range the tokens use (400–700);
  2. subset to the script's unicode range and the layout features we use (kern, ligatures, marks for stacked
     Vietnamese diacritics, tabular/lining figures, case, Inter's disambiguation variants);
  3. write woff2 + the @font-face block (font-display: swap; ranges ordered vietnamese → latin-ext-more → latin-ext → latin, as the
     packages declare them).
Nothing is fetched at runtime; the source packages are only read at build time. Licence: SIL OFL 1.1 (copied next to
the fonts by this script from each package's LICENSE)."""
import io, os, sys, shutil
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

RANGES = {
    'vietnamese': 'U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB',
    # latin-ext is split in two so a page pays only for what it sets. "latin-ext" = Latin Extended-A (macrons: ō ū ā;
    # most European letters) + the pinyin carons ǎ ǔ — what Japan and most pages need; "latin-ext-more" = the rest of
    # Extended-B, spacing modifiers, Latin Extended Additional outside the Vietnamese block, currency. Phonetic and
    # Latin-C/-D blocks are left to the system.
    'latin-ext-more': 'U+0180-01CC,U+01DD-0217,U+021C-024F,U+0259,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113',
    'latin-ext': 'U+0100-017F,U+01CD-01DC,U+0218-021B,U+0304,U+0308,U+0329',
    'latin': 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
}
FEATURES = ['kern', 'liga', 'calt', 'ccmp', 'locl', 'mark', 'mkmk', 'tnum', 'lnum', 'pnum', 'onum', 'case', 'frac', 'rlig',
            'cv05', 'cv08', 'ss02']          # Inter: cv05 = l with tail, cv08 = upper-case i with serifs, ss02 = disambiguation
# direction → [(css family, package, file stem, style, axis limits)]
DIRECTIONS = {
    'b': [('Playfair', 'playfair', 'playfair-{s}-opsz-normal', 'normal', {'opsz': 28, 'wght': (400, 700)}),
          ('Playfair', 'playfair', 'playfair-{s}-opsz-italic', 'italic', {'opsz': 28, 'wght': (400, 700)}),
          ('Inter', 'inter', 'inter-{s}-wght-normal', 'normal', {'wght': (400, 700)})],
    'c': [('Fraunces', 'fraunces', 'fraunces-{s}-full-normal', 'normal', {'opsz': 36, 'wght': (400, 700), 'SOFT': 50, 'WONK': 0}),
          ('Fraunces', 'fraunces', 'fraunces-{s}-full-italic', 'italic', {'opsz': 36, 'wght': (400, 700), 'SOFT': 50, 'WONK': 0}),
          ('Manrope', 'manrope', 'manrope-{s}-wght-normal', 'normal', {'wght': (400, 700)})],
}


def parse_ranges(r):
    out = set()
    for part in r.split(','):
        a, _, b = part.strip()[2:].partition('-')
        out.update(range(int(a, 16), int(b or a, 16) + 1))
    return out


def build(src, stem, limits, rng):
    f = TTFont(src, lazy=False)
    axes = {a.axisTag for a in f['fvar'].axes} if 'fvar' in f else set()
    f = instancer.instantiateVariableFont(f, {k: v for k, v in limits.items() if k in axes}, updateFontNames=False)
    b = io.BytesIO(); f.save(b); b.seek(0); f = TTFont(b, lazy=False)            # re-load: subsetter needs eager gvar
    want = parse_ranges(rng) & set(f.getBestCmap())
    o = subset.Options(); o.layout_features = FEATURES; o.flavor = 'woff2'; o.name_IDs = ['*']; o.hinting = False
    o.notdef_outline = True
    s = subset.Subsetter(o); s.populate(unicodes=want); s.subset(f)
    out = io.BytesIO(); f.flavor = 'woff2'; f.save(out); return out.getvalue()


def main():
    nm, d, outdir = sys.argv[1], sys.argv[2], sys.argv[3]
    css_path = sys.argv[sys.argv.index('--css') + 1] if '--css' in sys.argv else None
    prefix = sys.argv[sys.argv.index('--url-prefix') + 1] if '--url-prefix' in sys.argv else ''
    os.makedirs(outdir, exist_ok=True)
    css, total = [], 0
    for fam, pkg, stem, style, lim in DIRECTIONS[d]:
        base = os.path.join(nm, '@fontsource-variable', pkg)
        for s in ('vietnamese', 'latin-ext-more', 'latin-ext', 'latin'):
            src = os.path.join(base, 'files', stem.format(s='latin-ext' if s == 'latin-ext-more' else s) + '.woff2')
            if not os.path.exists(src):
                print('  (no', s, 'subset for', fam, style + ')'); continue
            name = f'{pkg}-{style}-{s}.woff2'
            data = build(src, stem, lim, RANGES[s]); total += len(data)
            open(os.path.join(outdir, name), 'wb').write(data)
            w = '{} {}'.format(*lim['wght'])
            css.append(f'@font-face {{ font-family: "{fam}"; font-style: {style}; font-weight: {w}; font-display: swap;\n'
                       f'  src: url("{prefix}{name}") format("woff2");\n  unicode-range: {RANGES[s].replace(",", ", ")}; }}')
            print(f'  {name:42s} {len(data) / 1024:6.1f} KB')
        lic = os.path.join(base, 'LICENSE')
        if os.path.exists(lic): shutil.copy(lic, os.path.join(outdir, f'OFL-{fam}.txt'))
    print(f'  total {total / 1024:.1f} KB')
    if css_path:
        open(css_path, 'w').write('/* generated by design/beta/style/tools/make-fonts.py — self-hosted OFL faces, no CDN */\n' + '\n'.join(css) + '\n')


if __name__ == '__main__':
    main()
