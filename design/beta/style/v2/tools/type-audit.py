#!/usr/bin/env python3
"""W7 designer: compare candidate sans faces for design system v2 — coverage of every Latin/Vietnamese character the
beta sets, macron/caron presence, tabular figures, the features we use, and woff2 weight of the latin + latin-ext +
vietnamese subsets at 400–600.
    python3 design/beta/style/v2/tools/type-audit.py <node_modules with the @fontsource packages> > type/audit.json"""
import glob, io, json, os, re, sys, unicodedata
from fontTools.ttLib import TTFont
NM = sys.argv[1]
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', '..', '..')
CANDS = {   # name → (package dir, file glob per subset)
    'Inter':             ('@fontsource-variable/inter', 'inter-{s}-wght-normal.woff2'),
    'Plus Jakarta Sans': ('@fontsource-variable/plus-jakarta-sans', 'plus-jakarta-sans-{s}-wght-normal.woff2'),
    'Hanken Grotesk':    ('@fontsource-variable/hanken-grotesk', 'hanken-grotesk-{s}-wght-normal.woff2'),
    'Manrope':           ('@fontsource-variable/manrope', 'manrope-{s}-wght-normal.woff2'),
    'Be Vietnam Pro':    ('@fontsource/be-vietnam-pro', 'be-vietnam-pro-{s}-500-normal.woff2'),
}
# every non-CJK letter/number/punct the beta pages set (HTML + data JSON)
chars = set()
for f in glob.glob(os.path.join(R, 'beta', '**', '*.html'), recursive=True) + glob.glob(os.path.join(R, 'beta', 'data', '**', '*.json'), recursive=True):
    t = re.sub(r'<script[\s\S]*?</script>|<style[\s\S]*?</style>|<[^>]+>', ' ', open(f, encoding='utf-8').read())
    chars.update(c for c in t if ord(c) > 32 and ord(c) < 0x2E80 and unicodedata.category(c)[0] in 'LNPS' and not 0x2190 <= ord(c) <= 0x2BFF)
vn = {c for c in chars if 0x1EA0 <= ord(c) <= 0x1EF9 or c in 'ĂăĐđĨĩŨũƠơƯư'}
mac = {c for c in chars if c in 'ĀāĒēĪīŌōŪū'}
out = {'chars_checked': len(chars), 'vietnamese_chars': len(vn), 'macron_chars': ''.join(sorted(mac)), 'faces': {}}
for name, (pkg, pat) in CANDS.items():
    cmap, size, feats = set(), 0, set()
    for s in ('latin', 'latin-ext', 'vietnamese'):
        p = os.path.join(NM, pkg, 'files', pat.format(s=s))
        if not os.path.exists(p): continue
        size += os.path.getsize(p); f = TTFont(p); cmap |= set(f.getBestCmap())
        if 'GSUB' in f: feats |= {fr.FeatureTag for fr in f['GSUB'].table.FeatureList.FeatureRecord}
        axes = [(a.axisTag, a.minValue, a.maxValue) for a in f['fvar'].axes] if 'fvar' in f else 'static'
    miss = sorted(c for c in chars if ord(c) not in cmap)
    out['faces'][name] = {'package': pkg, 'missing': ''.join(miss), 'missing_n': len(miss),
                          'vietnamese_missing': ''.join(sorted(c for c in vn if ord(c) not in cmap)),
                          'macrons_ok': all(ord(c) in cmap for c in mac), 'tnum': 'tnum' in feats, 'case': 'case' in feats,
                          'axes': axes, 'kb_latin_ext_vn_one_master': round(size / 1024, 1)}
print(json.dumps(out, ensure_ascii=False, indent=1))
