#!/usr/bin/env python3
"""Atlas SPEC-v3 prototypes: static pages that apply SPEC-v3 §1–§3 to the REAL place data (coordinates, tiers, kinds,
areas, closures, sources, photos) on a flat stub basemap — no invented streets, so pins are judged on their own.
    python3 design/beta/atlas/proto/make-proto.py      → design/beta/atlas/proto/*.html
Then shoot: NODE_PATH=$(npm root -g) node design/beta/atlas/proto/shoot.js"""
import json, math, os, html
H = os.path.dirname(os.path.abspath(__file__))
R = os.path.join(H, '..', '..', '..', '..')
UP = '../../../../'            # proto/ → repo root
ICONS = json.load(open(os.path.join(R, 'design', 'beta', 'style', 'v2', 'icons', 'icons.json')))
GLY = json.load(open(os.path.join(R, 'design', 'beta', 'glyphs.json')))['collections']
PHOTOS = set(os.listdir(os.path.join(R, 'beta', 'assets', 'img', 'photos')))
CRED = {c['file']: c for c in json.load(open(os.path.join(R, 'beta', 'assets', 'img', 'CREDITS.json')))['credits']}
e = html.escape

def load(key):
    d = json.load(open(os.path.join(R, 'beta', 'data', 'places', key + '.json')))
    P = d['places']; col = d.get('colors', {})
    # SPEC §1.3 map priority: tier ↑, sources ↓, rank ↑, then round-robin across areas
    base = sorted(P, key=lambda p: (p['t'], -len(p.get('src', [])), p.get('rank', 99)))
    by = {}
    for p in base: by.setdefault(p['a'], []).append(p)
    order, i = [], 0
    while any(by.values()):
        for a in list(by):
            if by[a]: order.append(by[a].pop(0))
    for n, p in enumerate(order): p['mp'] = n
    for a in d['areas']: AREAN[a['id']] = a['n'].split(' (')[0]
    for p in P:
        p['col'] = col.get(p['a'], '#948B83')
        p['nm'] = p['n'].split(' (')[0].replace(' — CLOSED', '')
        if p['kind'] == 'food': p['gl'] = 'cup' if 'CAFE' in p.get('g', []) else 'forkknife'
        else: p['gl'] = next((GLY[t] for t in p.get('g', []) if t in GLY), 'compass')
        f = f"{key}--{p['id']}-500.jpg"
        p['ph'] = f if f in PHOTOS else None
        c = CRED.get(f"{key}--{p['id']}-960.jpg") or CRED.get(f)
        p['cred'] = (c['author'][:40] + ' · ' + c['licence']) if c else ''
    return d, sorted(P, key=lambda p: p['mp'])

def proj(la, ln, z):
    s = 256 * 2 ** z
    x = (ln + 180) / 360 * s
    y = (1 - math.log(math.tan(math.radians(la)) + 1 / math.cos(math.radians(la))) / math.pi) / 2 * s
    return x, y

def fit(P, W, Hh, pad=48, k=30):
    # SPEC §1.4: the city core = the circle around the median point holding 60 % of all places; fit to the top-k (by mp)
    # inside it, after dropping outliers > 2.5× the median distance — day trips never zoom the city out to a region
    mx = sorted(p['ln'] for p in P)[len(P) // 2]; my = sorted(p['la'] for p in P)[len(P) // 2]
    dd = sorted(math.hypot(p['la'] - my, p['ln'] - mx) for p in P); r60 = dd[int(len(dd) * .6)]
    top = [p for p in P if math.hypot(p['la'] - my, p['ln'] - mx) <= r60][:k] or P[:k]
    cx = sorted(p['ln'] for p in top)[len(top) // 2]; cy = sorted(p['la'] for p in top)[len(top) // 2]
    dist = [math.hypot(p['la'] - cy, p['ln'] - cx) for p in top]; med = sorted(dist)[len(dist) // 2] or 1e-6
    core = [p for p, d_ in zip(top, dist) if d_ <= 2.5 * med]
    for z in range(17, 3, -1):
        xs, ys = zip(*[proj(p['la'], p['ln'], z) for p in core])
        if max(xs) - min(xs) <= W - 2 * pad and max(ys) - min(ys) <= Hh - 2 * pad:
            return ((max(xs) + min(xs)) / 2, (max(ys) + min(ys)) / 2, z)
    return (0, 0, 4)

def layout(P, W, Hh, view, N, saved=(), sel=None):
    cx, cy, z = view
    ox, oy = cx - W / 2, cy - Hh / 2
    pts = []
    for p in P:
        x, y = proj(p['la'], p['ln'], z); x -= ox; y -= oy
        if -10 <= x <= W + 10 and -10 <= y <= Hh + 10: pts.append((p, x, y))
    first = [t for t in pts if t[0]['id'] in saved or t[0]['id'] == sel]
    rest = [t for t in pts if t not in first and not t[0].get('closed')] + [t for t in pts if t not in first and t[0].get('closed')]
    boxes, pins = [], []
    for p, x, y in first + rest:
        if len(pins) >= N and p['id'] not in saved and p['id'] != sel: continue
        w = 46 + 7.1 * min(len(p['nm']), 22) + (14 if p.get('closed') else 0) + (16 if p['t'] == 1 else 0)
        b = (x - w / 2 - 2, y - 36, x + w / 2 + 2, y - 2)
        if b[0] < 4 or b[2] > W - 4 or b[1] < 4: continue
        if any(not (b[2] < c[0] or b[0] > c[2] or b[3] < c[1] or b[1] > c[3]) for c in boxes) and p['id'] != sel: continue
        boxes.append(b); pins.append((p, x, y, w))
    pinned = {p['id'] for p, *_ in pins}
    dots = [(p, x, y) for p, x, y in pts if p['id'] not in pinned]
    return pts, pins, dots, z

def svg(name, cls='g'):
    return f'<svg class="{cls}" viewBox="0 0 24 24" aria-hidden="true">{ICONS.get(name, ICONS["compass"])}</svg>'

def mix(col):  # muted area colour, SPEC §1.2 (rendered with color-mix in CSS)
    return f'color-mix(in oklab, {col} 50%, var(--area-mute))'

def pin_html(p, x, y, w, saved, sel):
    c = ['pin']
    if p['kind'] == 'food': c.append('food')
    if p['t'] == 1 and not p.get('closed'): c.append('must')
    if p.get('closed'): c.append('closed')
    if p['id'] == sel: c.append('sel')
    nm = p['nm'] if len(p['nm']) <= 22 else p['nm'][:21] + '…'
    return (f'<a class="{" ".join(c)}" style="left:{x:.0f}px;top:{y:.0f}px" title="{e(p["nm"])}">'
            f'<i class="ad" style="background:{mix(p["col"])}"></i>{svg("star4", "st") if "must" in c else ""}{svg(p["gl"])}'
            f'<b>{e(nm)}</b>{"<em>· Closed</em>" if p.get("closed") else ""}{"<span class=sv>" + svg("heart") + "</span>" if p["id"] in saved else ""}</a>')

def dot_html(p, x, y):
    c = 'dot' + (' m' if p['t'] == 1 else '') + (' x' if p.get('closed') else '')
    return f'<i class="{c}" style="left:{x:.0f}px;top:{y:.0f}px;--c:{mix(p["col"])}"></i>'

AREAN = {}
def card(p, key, rank, big=True):
    kind = 'Eat &amp; drink' if p['kind'] == 'food' else 'Sight'
    ph = (f'<img src="{UP}beta/assets/img/photos/{p["ph"]}" alt="">' if p['ph'] else f'<span class="cov">{svg(p["gl"], "cg")}</span>')
    srcs = ', '.join(s.replace('-', ' ').title() for s in p.get('src', [])[:2]) + (f' +{len(p["src"]) - 2}' if len(p.get('src', [])) > 2 else '')
    why = e((p.get('k') or '')[:70])
    return (f'<article class="card{" closed" if p.get("closed") else ""}"><div class="med">{ph}'
            f'{"<span class=stk>" + svg("star4", "si") + "Must see</span>" if p["t"] == 1 and not p.get("closed") else ""}'
            f'<span class="hrt">{svg("heart")}</span></div>'
            + (f'<p class="cred">Photo: {e(p["cred"])}</p>' if p['ph'] and p['cred'] else '') +
            f'<h3>{e(p["nm"])}</h3><p class="kl">{e(AREAN.get(p["a"], p["a"]))} · {kind}{" · Closed, kept for the record" if p.get("closed") else ""}</p>'
            + (f'<p class="why">{why}</p>' if big and why else '') + f'<p class="src">Recommended by {e(srcs)}</p></article>')

CSS = open(os.path.join(H, 'proto.css')).read()

def page(title, body, theme):
    ff = ''.join(f'@font-face{{font-family:"{f}";src:url("{UP}beta/assets/fonts/{n}") format("woff2");font-weight:{w}}}'
                 for f, n, w in [('Inter', 'inter-normal-latin.woff2', '400 700'), ('Inter', 'inter-normal-latin-ext.woff2', '400 700'),
                                 ('Bricolage Grotesque', 'bricolage-normal-latin.woff2', '500 700'), ('Bricolage Grotesque', 'bricolage-normal-latin-ext.woff2', '500 700')])
    return (f'<!doctype html><html lang="en" data-theme="{theme}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            f'<title>{e(title)}</title><link rel="stylesheet" href="{UP}beta/assets/tokens.css"><style>{ff}{CSS}</style></head><body>{body}</body></html>')

def desktop(key, city, P, view=None, saved=(), sel=None, name=''):
    W, Hh = int(1440 * .62), 900 - 108
    view = view or fit(P, W, Hh)
    pts, pins, dots, z = layout(P, W, Hh, view, 24, saved, sel)
    inview = sorted([p for p, _, _ in pts], key=lambda p: p['mp'])
    m = ''.join(dot_html(*d) for d in dots) + ''.join(pin_html(p, x, y, w, saved, sel) for p, x, y, w in pins)
    prev = ''
    if sel:
        s = next((t for t in pins if t[0]['id'] == sel), None)
        if s:
            px, py, pw = s[1], s[2], s[3]; left = px + pw / 2 + 16 if px + pw / 2 + 352 < W else px - pw / 2 - 352
            prev = f'<div class="preview" style="left:{left:.0f}px;top:{max(16, py - 140):.0f}px">{card(s[0], key, s[0]["rank"])}<div class="pa"><span class="b1">Open details</span><span class="b2">{svg("heart")} Save</span></div></div>'
    cards = ''.join(card(p, key, p['rank']) for p in inview[:6])
    body = f'''<header class="top"><b class="wm">{svg("star4","mk")}cleo</b><span class="crumb">Japan › {e(city)}</span>
<nav class="vs"><span>Gallery</span><span class="on">{svg("map","vi")}Atlas</span><span>Guidebook</span><span>Insights</span></nav></header>
<div class="bar"><span class="search">{svg("search","vi")}Search {e(city)} <em>place · dish · area</em></span>
<span class="seg"><span class="on">All</span><span>Sights</span><span>Eat &amp; drink</span></span><span class="chip">{svg("star4","vi")}Must see</span>
<span class="chip">{svg("heart","vi")}Saved</span><span class="chip">{svg("sliders","vi")}Filters</span><span class="sw"><i></i>Search as I move the map</span></div>
<main class="split"><section class="map" style="width:{W}px;height:{Hh}px">{m}{prev}<span class="key">{svg("info","vi")}Key</span>
<span class="loc">{svg("compass","vi")}</span><span class="attr">Basemap stub (prototype) · real build: Esri Light Gray Canvas · © OpenStreetMap contributors</span></section>
<section class="list"><p class="count"><b>{len(inview)} places here</b> · <u>Show all {len(P)}</u></p><div class="cards">{cards}</div></section></main>
<p class="note">{e(name)} — zoom {z}: {len(pins)} labelled pins, {len(dots)} dots, 0 numbers on the map.</p>'''
    return body, len(pins), len(dots), z

def phone(key, city, P, view=None, saved=(), sel=None, name=''):
    W, Hh = 390, 844 - 52
    view = view or fit(P, W, Hh - 260, 40, 12)
    # the uncovered map band: below the chip row (52 px) and above the carousel (180 px)
    cx, cy, z = view; view = (cx, cy + (180 - 52) / 2, z)
    pts, pins, dots, z = layout(P, W, Hh, view, 12, saved, sel)
    pins = [t for t in pins if 60 < t[2] < Hh - 196]
    m = ''.join(dot_html(*d) for d in dots) + ''.join(pin_html(p, x, y, w, saved, sel) for p, x, y, w in pins)
    first = next((p for p, *_ in pins if p['id'] == sel), pins[0][0] if pins else P[0])
    nxt = next((p for p, *_ in pins if p['id'] != first['id']), P[1])
    body = f'''<header class="top ph"><span class="bk">{svg("chev-l","vi")}</span><b class="cn">{e(city)}</b><span class="ic">{svg("search","vi")}{svg("heart","vi")}</span></header>
<section class="map ph" style="width:{W}px;height:{Hh}px">{m}
<div class="chips"><span class="on">All</span><span>Sights</span><span>Eat &amp; drink</span><span>{svg("heart","vi")}</span><span>{svg("sliders","vi")}</span></div>
<span class="ctl">{svg("compass","vi")}{svg("grid","vi")}</span><span class="pill">{svg("list","vi")}List</span>
<span class="attr ph">© OpenStreetMap contributors · Esri</span>
<div class="car"><div class="cc">{card(first, key, first["rank"], False)}</div><div class="cc">{card(nxt, key, nxt["rank"], False)}</div></div></section>
<p class="note">{e(name)} — {len(pins)} labelled pins, {len(dots)} dots.</p>'''
    return body, len(pins), len(dots), z

if __name__ == '__main__':
    out = []
    T = load('tokyo'); C = load('cleveland'); S = load('singapore--chinatown')
    saved = ('senso-ji', 'kanda-myojin')
    asakusa = proj(35.7148, 139.7967, 15) + (15,)
    cases = [('tokyo-default', T, 'Tokyo', None, None), ('tokyo-asakusa', T, 'Tokyo', asakusa, None),
             ('tokyo-selected', T, 'Tokyo', asakusa, 'senso-ji'), ('cleveland-default', C, 'Cleveland', None, None),
             ('chinatown-default', S, 'Chinatown', None, None)]
    for nm, (d, P), city, view, sel in cases:
        for theme in ('light', 'dark'):
            b, np_, nd, z = desktop(nm, city, P, view, saved, sel, nm) if False else desktop(d['key'], city, P, view, saved, sel, nm)
            open(os.path.join(H, f'{nm}-d-{theme}.html'), 'w').write(page(f'{nm} desktop', b, theme))
            b2, np2, nd2, z2 = phone(d['key'], city, P, view, saved, sel, nm)
            open(os.path.join(H, f'{nm}-m-{theme}.html'), 'w').write(page(f'{nm} phone', b2, theme))
        out.append(f'{nm}: desktop z{z} {np_} pins / {nd} dots · phone z{z2} {np2} pins / {nd2} dots')
    print('\n'.join(out))
