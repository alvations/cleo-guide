#!/usr/bin/env python3
"""W7 design system v2 — the palette directions as data, one generator for everything colour.

    python3 design/beta/style/v2/tools/palettes.py            # writes directions/<id>.css + directions/contrast.json, exits 1 on any AA miss
    python3 design/beta/style/v2/tools/palettes.py --emit <id> # prints the :root colour block for tokens.css (the winner)

Every direction is a FULL light + dark set over the same primitives: ground (--paper), --surface, --sand (quiet fill),
a three-step ink scale, two lines, ONE signature accent (+ its text-safe ink, a wash and the colour that sits on it),
state colours, and the mute applied to the data's area colours so map pins and area dots sit quietly with the palette.
The legacy R6 names (--night, --gilt, --city …) are aliased onto these primitives by tokens.css, so every rule that
still says "night" now paints the light ground: the navy hero is retired at the token, not by patching 58 rules."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'directions')

STATE_L = {'open': '#2E6A4C', 'open-soft': '#E5F0E9', 'closed': '#8E3B2E', 'closed-soft': '#F6E7E2', 'warn': '#835800', 'warn-soft': '#F8EFD9'}
STATE_D = {'open': '#86C9A3', 'open-soft': '#1C3026', 'closed': '#F0A08C', 'closed-soft': '#3A221C', 'warn': '#EDC06A', 'warn-soft': '#382C12'}

D = {
  'juniper': {
    'name': 'Juniper', 'line': 'Stone ground, near-black ink, a deep juniper green spent only on the saved heart and the one active state.',
    'light': {'paper': '#F7F6F2', 'surface': '#FFFFFF', 'sand': '#EFEEE8', 'ink': '#1A1C1A', 'ink-2': '#464944', 'ink-3': '#62655E',
              'line': '#E3E2DB', 'line-strong': '#C9C8BF', 'accent': '#2C5A4C', 'accent-ink': '#2C5A4C', 'accent-wash': '#E6EEEA', 'on-accent': '#FFFFFF', 'area-mute': '#8A8D86'},
    'dark':  {'paper': '#111312', 'surface': '#191C1A', 'sand': '#222624', 'ink': '#EDEFEB', 'ink-2': '#C9CDC7', 'ink-3': '#9DA39B',
              'line': '#2A2F2C', 'line-strong': '#434A46', 'accent': '#8FC3AF', 'accent-ink': '#9CCDB9', 'accent-wash': '#1B2C26', 'on-accent': '#0C1A15', 'area-mute': '#6E746E'},
  },
  'oxblood': {
    'name': 'Bone & Oxblood', 'line': 'Warm bone ground, soft-black ink, one deep oxblood — a tailoring colour, not a signal red — kept for the saved heart, the saved count, the day route and the wordmark star.',
    'light': {'paper': '#F9F7F3', 'surface': '#FFFFFF', 'sand': '#F1EDE7', 'ink': '#1C1917', 'ink-2': '#4A4440', 'ink-3': '#68615B',
              'line': '#E7E2DB', 'line-strong': '#CCC5BC', 'accent': '#7A2A2A', 'accent-ink': '#7A2A2A', 'accent-wash': '#F5EAE7', 'on-accent': '#FFFFFF', 'area-mute': '#948B83'},
    'dark':  {'paper': '#131110', 'surface': '#1C1918', 'sand': '#262220', 'ink': '#F2EEEA', 'ink-2': '#D0C9C3', 'ink-3': '#A69E97',
              'line': '#302B28', 'line-strong': '#4B4440', 'accent': '#E0A19A', 'accent-ink': '#E8B0A9', 'accent-wash': '#33201E', 'on-accent': '#1E0E0C', 'area-mute': '#766D67'},
  },
  'petrol': {
    'name': 'Mist & Petrol', 'line': 'Cool mist ground, graphite ink, a petrol blue-green accent — the most architectural, least warm of the four.',
    'light': {'paper': '#F5F6F6', 'surface': '#FFFFFF', 'sand': '#ECEEEE', 'ink': '#15191B', 'ink-2': '#42494D', 'ink-3': '#5E666A',
              'line': '#E0E4E5', 'line-strong': '#C3C9CB', 'accent': '#1D5568', 'accent-ink': '#1D5568', 'accent-wash': '#E2ECEF', 'on-accent': '#FFFFFF', 'area-mute': '#87908F'},
    'dark':  {'paper': '#0F1213', 'surface': '#171B1D', 'sand': '#1F2427', 'ink': '#ECEFF0', 'ink-2': '#C6CDD0', 'ink-3': '#9AA3A7',
              'line': '#283033', 'line-strong': '#3F494D', 'accent': '#8EC5D6', 'accent-ink': '#9FD0DF', 'accent-wash': '#16282F', 'on-accent': '#08161B', 'area-mute': '#6A7377'},
  },
  'ember': {
    'name': 'Sable & Ember', 'line': 'Greige sable ground, umber ink, a burnt-ember accent — the warmest, most terracotta-leaning of the four.',
    'light': {'paper': '#F4F1EC', 'surface': '#FBFAF7', 'sand': '#EAE5DD', 'ink': '#211D1A', 'ink-2': '#4C4540', 'ink-3': '#655D56',
              'line': '#E0DAD1', 'line-strong': '#C8C0B5', 'accent': '#9C4423', 'accent-ink': '#953F20', 'accent-wash': '#F5E4DB', 'on-accent': '#FFFFFF', 'area-mute': '#998F86'},
    'dark':  {'paper': '#151312', 'surface': '#1E1B19', 'sand': '#282421', 'ink': '#F3EFEA', 'ink-2': '#D3CBC3', 'ink-3': '#A89F96',
              'line': '#322D29', 'line-strong': '#4D4640', 'accent': '#EE9C7A', 'accent-ink': '#F2AD90', 'accent-wash': '#3A2219', 'on-accent': '#200D06', 'area-mute': '#7A716A'},
  },
}

def lum(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    c = [x / 12.92 if x <= .03928 else ((x + .055) / 1.055) ** 2.4 for x in c]
    return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]

def ratio(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + .05) / (lb + .05)

PAIRS = [('ink', 'paper', 4.5), ('ink', 'surface', 4.5), ('ink', 'sand', 4.5), ('ink-2', 'paper', 4.5), ('ink-2', 'surface', 4.5),
         ('ink-2', 'sand', 4.5), ('ink-3', 'paper', 4.5), ('ink-3', 'surface', 4.5), ('ink-3', 'sand', 4.5), ('paper', 'ink', 4.5),
         ('accent-ink', 'paper', 4.5), ('accent-ink', 'surface', 4.5), ('accent-ink', 'accent-wash', 4.5), ('on-accent', 'accent', 4.5),
         ('ink', 'accent-wash', 4.5), ('accent', 'surface', 3.0), ('accent', 'paper', 3.0), ('line-strong', 'surface', 1.4),
         ('open', 'open-soft', 4.5), ('closed', 'closed-soft', 4.5), ('closed', 'surface', 4.5), ('ink', 'warn-soft', 4.5), ('warn', 'surface', 4.5)]

def full(d, mode):
    t = dict(d[mode]); t.update(STATE_L if mode == 'light' else STATE_D); return t

def check(d):
    rows, fails = [], 0
    for mode in ('light', 'dark'):
        T = full(d, mode)
        for fg, bg, mn in PAIRS:
            r = ratio(T[fg], T[bg]); ok = r >= mn; fails += not ok
            rows.append({'mode': mode, 'pair': f'{fg} on {bg}', 'ratio': round(r, 2), 'min': mn, 'ok': ok})
    return rows, fails

def block(T):
    return ' '.join(f'--{k}:{v};' for k, v in T.items())

ALIAS = ('--night:var(--paper); --night-2:var(--sand); --on-night:var(--ink); --on-night-2:var(--ink-2); --star:transparent; '
         '--gilt:var(--ink); --gilt-soft:var(--sand); --focus:var(--ink); '
         '--city:var(--accent); --city-ink:var(--accent-ink); --city-wash:var(--accent-wash); --city-on:var(--on-accent); --city-2:var(--line-strong); '
         '--motif:none; --motif-ink:none;')

def css(id_, d, scoped_reset=True):
    """A layerable override: the colour primitives + aliases at :root (light, OS-dark, forced dark), plus a reset that
    beats the R6 per-city skins (same values re-declared on every skinned element) — used for mockups on real pages."""
    L, K = block(full(d, 'light')), block(full(d, 'dark'))
    sk = ('[data-city], [data-page], [class*="skin-"], :root:has(main[data-city])')
    skd = (':root:not([data-theme="light"]) :is([data-city], [data-page], [class*="skin-"]), :root:not([data-theme="light"]):has(main[data-city])')
    skf = (':root[data-theme="dark"] :is([data-city], [data-page], [class*="skin-"]), :root[data-theme="dark"]:has(main[data-city])')
    o = [f'/* direction {id_} — {d["name"]} (generated by design/beta/style/v2/tools/palettes.py) */',
         f':root, {sk} {{ {L} {ALIAS} color-scheme: light; }}' if scoped_reset else f':root {{ {L} {ALIAS} color-scheme: light; }}',
         f'@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]){", " + skd if scoped_reset else ""} {{ {K} {ALIAS} color-scheme: dark; }} }}',
         f':root[data-theme="dark"]{", " + skf if scoped_reset else ""} {{ {K} {ALIAS} color-scheme: dark; }}']
    return '\n'.join(o) + '\n'

if __name__ == '__main__':
    if '--emit' in sys.argv:
        id_ = sys.argv[sys.argv.index('--emit') + 1]; print(css(id_, D[id_], scoped_reset=False)); sys.exit(0)
    os.makedirs(OUT, exist_ok=True); report, bad = {}, 0
    for id_, d in D.items():
        open(os.path.join(OUT, id_ + '.css'), 'w').write(css(id_, d))
        rows, fails = check(d); bad += fails
        report[id_] = {'name': d['name'], 'line': d['line'], 'light': d['light'], 'dark': d['dark'], 'fails': fails,
                       'min_text_ratio': min(r['ratio'] for r in rows if r['min'] == 4.5), 'rows': rows}
        print(f'{id_:8} {d["name"]:16} pairs={len(rows)} fails={fails} min-text={report[id_]["min_text_ratio"]}')
        for r in rows:
            if not r['ok']: print('   FAIL', r)
    json.dump({'state_light': STATE_L, 'state_dark': STATE_D, 'directions': report}, open(os.path.join(OUT, 'contrast.json'), 'w'), indent=1)
    sys.exit(1 if bad else 0)
