#!/usr/bin/env python3
"""Regenerate the city-skin block of design/beta/tokens.css from design/beta/skins.json, then copy tokens.css to
beta/assets/tokens.css (the shipped copy). M1-14. Each skin overrides at most 6 tokens (M0-01):
the four --city* accents + --motif (+ --paper for the two pastel regional skins).
    python3 design/beta/tools/skins.py [--check]"""
import json, os, re, sys
D = os.path.join(os.path.dirname(__file__), '..')
TOK = os.path.join(D, 'tokens.css'); SHIP = os.path.join(D, '..', '..', 'beta', 'assets', 'tokens.css')
cfg = json.load(open(os.path.join(D, 'skins.json')))['skins']
W = 'rgba(255,255,255,.075)'   # motif ink — drawn on night / accent grounds only
K = 'rgba(25,22,19,.075)'      # W2: the same motif in ink, for light grounds (card plates, sheet plate) — decorative only
MOTIF = {   # one geometric motif per skin: masthead sky + signature tiles. Pure CSS, no images, no network.
  'vermilion': f"radial-gradient(circle at 50% 100%, transparent 34%, {W} 35% 40%, transparent 41% 54%, {W} 55% 60%, transparent 61%) 0 0 / 30px 15px",  # seigaiha waves
  'moss':      f"repeating-conic-gradient(from 45deg, {W} 0 25%, transparent 0 50%) 0 0 / 18px 18px",                                            # checked leaves
  'neon':      f"radial-gradient({W} 1.6px, transparent 2px) 0 0 / 12px 12px",                                                                # sign dots
  'lagoon':    f"repeating-radial-gradient(circle at 0 100%, transparent 0 9px, {W} 9px 10px)",                                                # ripples
  'glacier':   f"repeating-linear-gradient(60deg, {W} 0 1px, transparent 1px 14px), repeating-linear-gradient(-60deg, {W} 0 1px, transparent 1px 14px)",  # ice
  'lake':      f"repeating-linear-gradient(0deg, {W} 0 1px, transparent 1px 10px)",                                                           # lake swell
  'saffron':   f"repeating-linear-gradient(90deg, {W} 0 1px, transparent 1px 26px), repeating-linear-gradient(0deg, {W} 0 1px, transparent 1px 26px)",  # street grid
  'plum':      f"repeating-linear-gradient(45deg, {W} 0 1px, transparent 1px 12px)",                                                          # prairie rule
  'orchid':    f"radial-gradient(circle at 25% 25%, {W} 2px, transparent 2.5px) 0 0 / 16px 16px, radial-gradient(circle at 75% 75%, {W} 1.5px, transparent 2px) 0 0 / 16px 16px",  # petals
  'jade':      f"linear-gradient({W} 0 1px, transparent 1px) 0 0 / 18px 18px, linear-gradient(90deg, {W} 0 1px, transparent 1px) 0 0 / 18px 18px",  # lattice
  'default':   f"radial-gradient({W} 1px, transparent 1.5px) 0 0 / 22px 22px",
}
#            light: city     city-ink   city-wash  city-on  | dark: city    city-ink   city-wash  city-on   | pastel paper (light)
PAL = {
  'vermilion': ('#C23A1C', '#A9321A', '#FBE8E1', '#FFFFFF', '#FF7A57', '#FF8F70', '#3A1D15', '#1A0B06', None),
  'moss':      ('#4E6B22', '#46601E', '#EBF0DF', '#FFFFFF', '#A8C46A', '#B7D07E', '#1F2914', '#10160A', None),
  'neon':      ('#B8255F', '#A32154', '#F9E3EC', '#FFFFFF', '#FF74AA', '#FF8DBA', '#3A1426', '#1C0711', None),
  'lagoon':    ('#0B7473', '#0A6766', '#DDF1EF', '#FFFFFF', '#4FD1C9', '#6ADBD4', '#0F2E2D', '#041514', None),
  'glacier':   ('#2F5F9E', '#2A558E', '#E3EBF6', '#FFFFFF', '#7FA8EA', '#97B9EF', '#17253B', '#08111F', None),
  'lake':      ('#1F5E8A', '#1B5479', '#E2EDF5', '#FFFFFF', '#6FB2E6', '#8CC2EC', '#142A3A', '#06131D', None),
  'saffron':   ('#9A5B00', '#8A5100', '#FAEBD3', '#FFFFFF', '#F2B54B', '#F5C46D', '#35260D', '#1C1203', None),
  'plum':      ('#6B3A8C', '#61347F', '#EFE5F5', '#FFFFFF', '#C79BEA', '#D3AEF0', '#2C1C38', '#160C1E', None),
  # regional pastel skins (BETA-DECISIONS D-05): the live Singapore/Vietnam pastel edition folded into the one frame
  'orchid':    ('#8A3F86', '#7D3979', '#F6E8F3', '#FFFFFF', '#E3A3DC', '#EAB6E4', '#33182F', '#1A0918', '#FCF8FB'),
  'jade':      ('#2F7458', '#2A684F', '#E1F1E8', '#FFFFFF', '#7FD1AC', '#95DABB', '#13302A', '#06170F', '#F8FAF6'),
}
# W2: a SECOND, decorative accent per skin (plate edge gradient, rule ornaments, tile glow). Never used for text or
# actions, so it carries no contrast duty; the one-accent rule for actions (D-06) is unchanged.
CITY2 = {  # light, dark
  'vermilion': ('#1E3A6B', '#8FA8E0'),   # indigo against vermilion (classic woodblock-print pairing)
  'moss':      ('#B5832A', '#E2B865'),   # autumn ginkgo
  'neon':      ('#2A6CB0', '#7DB4F0'),   # electric blue
  'lagoon':    ('#E07A5F', '#F2A48C'),   # coral
  'glacier':   ('#8C6BB0', '#C2A8E6'),   # aurora violet
  'lake':      ('#B8572E', '#E89A74'),   # rust (steel bridges at sunset)
  'saffron':   ('#2F5F5A', '#7EC2B9'),   # patina green
  'plum':      ('#C08A2E', '#E8C06A'),   # brass
  'orchid':    ('#2F7A6B', '#7FCDBB'),   # pandan
  'jade':      ('#C2452D', '#F08A72'),   # lacquer red
}
def sel(skin, prefix=''):
    out = []
    for k in cfg.get(skin, []):
        for a in ('data-city', 'data-page'):   # data-city: <main> on city pages · data-page: hub destination tiles
            out.append(f'{prefix}[{a}^="{k[:-1]}"]' if k.endswith('/*') else f'{prefix}[{a}="{k}"]')
    return ', '.join(out + [f'{prefix}.skin-{skin}'])
L, Dk = [], []
for skin, (c, ci, cw, co, dc, dci, dcw, dco, paper) in PAL.items():
    extra = f' --paper:{paper};' if paper else ''
    L.append(f'{sel(skin)} {{ --city:{c}; --city-ink:{ci}; --city-wash:{cw}; --city-on:{co};{extra} --motif:{MOTIF[skin]}; --motif-ink:{MOTIF[skin].replace(W, K)}; --city-2:{CITY2[skin][0]}; }}')
    Dk.append((skin, f'--city:{dc}; --city-ink:{dci}; --city-wash:{dcw}; --city-on:{dco};' + (' --paper:#141117;' if paper else '') + f' --motif-ink:{MOTIF[skin]}; --city-2:{CITY2[skin][1]};'))
block = ['/* ---------------- City skins (generated by design/beta/tools/skins.py from skins.json — do not hand-edit) ----------------',
         '   A skin overrides ≤ 8 tokens: --city, --city-ink, --city-wash, --city-on, --motif, --motif-ink, --city-2 (decorative) (+ --paper on the pastel regional skins).',
         '   Every pair passes AA (design/beta/tools/contrast.py). Apply with data-city / data-page="<page key>" or class="skin-<name>". */',
         f':root {{ --motif:{MOTIF["default"]}; --motif-ink:{MOTIF["default"].replace(W, K)}; --city-2:var(--gilt); }}'] + L
block += ['@media (prefers-color-scheme: dark) {'] + [f'  {sel(s, ":root:not([data-theme=\"light\"]) ")} {{ {v} }}' for s, v in Dk] + ['}']
block += [f'{sel(s, ":root[data-theme=\"dark\"] ")} {{ {v} }}' for s, v in Dk]
# Root-level copy keyed on :has(main[data-city]) — separate rules, because :has() is unforgiving in a selector list.
def hsel(skin, prefix=''):
    return ', '.join(f'{prefix}html:has(main[data-city^="{k[:-1]}"])' if k.endswith('/*') else f'{prefix}html:has(main[data-city="{k}"])' for k in cfg.get(skin, []))
block += ['/* root copies: the site bar, page ground and footer take the city skin too (html:has(main[data-city])) */']
for skin, (c, ci, cw, co, dc, dci, dcw, dco, paper) in PAL.items():
    if not cfg.get(skin): continue
    extra = f' --paper:{paper};' if paper else ''
    block.append(f'{hsel(skin)} {{ --city:{c}; --city-ink:{ci}; --city-wash:{cw}; --city-on:{co};{extra} --motif:{MOTIF[skin]}; --motif-ink:{MOTIF[skin].replace(W, K)}; --city-2:{CITY2[skin][0]}; }}')
block += ['@media (prefers-color-scheme: dark) {'] + [f'  {hsel(s, ":root:not([data-theme=\"light\"])")} {{ {v} }}'.replace(':root:not([data-theme="light"])html', 'html:not([data-theme="light"])') for s, v in Dk if cfg.get(s)] + ['}']
for s_, v in Dk:
    if cfg.get(s_): block.append(', '.join(x.replace('html:has', 'html[data-theme="dark"]:has') for x in hsel(s_).split(', ')) + f' {{ {v} }}')
block += ['/* ---------------- end city skins ---------------- */']
# W7 design system v2 (design/beta/style/v2/DECISION.md): ONE accent site-wide — the per-city skins are retired. The
# generated block is replaced by a marker; skins.json and the data-city / .skin-* hooks stay (harmless, and a quiet
# per-city accent can come back by setting ONE_ACCENT = False).
ONE_ACCENT = True
if ONE_ACCENT:
    block = ['/* ---------------- City skins (generated by design/beta/tools/skins.py from skins.json — do not hand-edit) ----------------',
             '   Retired in design system v2 (W7): one accent site-wide, no per-city skin. data-city / data-page / .skin-* stay as hooks. */',
             '/* ---------------- end city skins ---------------- */']
css = open(TOK).read()
# strip any previous skin rules (old hand-written ones too) and re-insert the generated block before reduced-motion
css = re.sub(r'/\* -+ City skins \(generated.*?/\* -+ end city skins -+ \*/\n', '', css, flags=re.S)
css = re.sub(r'/\* -+ City skins \(light\).*?(?=/\* -+ Night edition)', '', css, flags=re.S)
css = re.sub(r'^\s*(:root(:not\(\[data-theme="light"\]\)|\[data-theme="dark"\]) )?(\[data-city="\w+"\],\s*)?(:root[^{]*)?\.skin-\w+\s*\{[^}]*\}\n', '', css, flags=re.M)
css = re.sub(r'\n{3,}', '\n\n', css).replace('\n\n@media (prefers-reduced-motion: reduce)', '\n@media (prefers-reduced-motion: reduce)')
new = css.replace('\n@media (prefers-reduced-motion: reduce)', '\n' + '\n'.join(block) + '\n\n@media (prefers-reduced-motion: reduce)', 1)
if '--check' in sys.argv:
    ok = open(TOK).read() == new and open(SHIP).read() == new
    print('skins: tokens.css', 'in sync' if ok else 'OUT OF DATE — run python3 design/beta/tools/skins.py'); sys.exit(0 if ok else 1)
open(TOK, 'w').write(new); open(SHIP, 'w').write(new)
n = sum(len(v) for v in cfg.values())
print(f'skins: {len(PAL)} skins, {n} city/region keys → design/beta/tokens.css + beta/assets/tokens.css')
