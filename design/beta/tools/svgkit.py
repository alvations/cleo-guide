"""Icon sprite, tier glyphs and data-drawn art (constellations, map art) for the beta design system.

All glyphs are original line drawings on a 24-px grid (1.75 stroke, round caps). None depicts a specific venue,
and none borrows a third-party mark. All "art" is drawn from verified coordinates only — nothing is invented.
"""
import math

ICONS = {
    'search': '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    'heart': '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"/>',
    'map': '<path d="M3 6.5l6-2.5 6 2.5 6-2.5v13.5l-6 2.5-6-2.5-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
    'list': '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
    'filter': '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
    'close': '<path d="M6 6l12 12M18 6L6 18"/>',
    'directions': '<path d="M12 2.8l9.2 9.2-9.2 9.2L2.8 12z"/><path d="M9 14.5v-2.5a1.5 1.5 0 0 1 1.5-1.5h4.5M13 8.5l2 2-2 2"/>',
    'share': '<path d="M12 3v12M7.5 7.5L12 3l4.5 4.5"/><path d="M5 12.5V20h14v-7.5"/>',
    'check': '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    'chev-r': '<path d="M9.5 6l6 6-6 6"/>', 'chev-l': '<path d="M14.5 6l-6 6 6 6"/>', 'chev-d': '<path d="M6 9.5l6 6 6-6"/>',
    'plus': '<path d="M12 5v14M5 12h14"/>',
    'star4': '<path d="M12 2.5l2.1 7.4 7.4 2.1-7.4 2.1-2.1 7.4-2.1-7.4L2.5 12l7.4-2.1z"/>',
    'pin': '<path d="M12 21s-7-6.2-7-11.4a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.6" r="2.4"/>',
    'day': '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><circle cx="12" cy="15" r="1.4"/>',
    'guide': '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20.5c1.3-3.8 4.2-5.6 7.5-5.6s6.2 1.8 7.5 5.6"/><path d="M17.5 3.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
    'offline': '<path d="M3 3l18 18"/><path d="M7.6 7.6A5 5 0 0 0 7 9.5 4 4 0 0 0 7 17.5h10M10 5a5 5 0 0 1 6.9 3.5h.6a3.5 3.5 0 0 1 2.4 6"/>',
    'info': '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.2"/>',
    'alert': '<path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 10v4.5M12 17.2v.2"/>',
    'external': '<path d="M14 4h6v6M20 4l-8.5 8.5"/><path d="M18 14v5.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 .5-.5H10"/>',
    'globe': '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z"/>',
    'route': '<circle cx="6" cy="18.5" r="2"/><circle cx="18" cy="5.5" r="2"/><path d="M8 18.5h7.5a3.3 3.3 0 0 0 0-6.6h-7a3.3 3.3 0 0 1 0-6.6H16"/>',
    'swap': '<path d="M7 4L4 7l3 3M4 7h13M17 20l3-3-3-3M20 17H7"/>',
    'print': '<path d="M7 9V3.5h10V9M7 17.5H4.5V9h15v8.5H17"/><path d="M7 14h10v6.5H7z"/>',
    'clock': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    'sliders': '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
    'seal': '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.3l1.4 3 3.2.3-2.4 2.2.7 3.1L12 14.3l-2.9 1.6.7-3.1-2.4-2.2 3.2-.3z"/>',
    'compass': '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    'stamp': '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 12.2l2.3 2.3 4.7-4.8"/>',
    # collections
    'torii': '<path d="M3 5.2c4.5 1.3 13.5 1.3 18 0M5 9.5h14M7 6v15M17 6v15M12 9.5V6.6"/>',
    'castle': '<path d="M4.5 21V10.5h3V8h2v2.5h5V8h2v2.5h3V21z"/><path d="M10 21v-3.5a2 2 0 0 1 4 0V21M12 3.5V8M12 3.5l3 1.3-3 1.2"/>',
    'leaf': '<path d="M5 19.5C5 11 10 5 19.5 4.5 19.5 14 14 19 5.5 19.5"/><path d="M5 19.5l8.5-8.5"/>',
    'columns': '<path d="M3 9l9-5 9 5M5.5 9.5v8M9.8 9.5v8M14.2 9.5v8M18.5 9.5v8M3 20.5h18"/>',
    'mountain': '<path d="M2.5 20l6.5-11.5 4 6.5 2.5-3.5 6 8.5z"/><path d="M7.4 11.3l1.6 1.2 1.7-1"/>',
    'steam': '<path d="M3.5 14.5c0 3.2 3.8 5.5 8.5 5.5s8.5-2.3 8.5-5.5z"/><path d="M8.5 11c-1.2-1.6 1.2-2.6 0-4.4M12 11c-1.2-1.6 1.2-2.6 0-4.4M15.5 11c-1.2-1.6 1.2-2.6 0-4.4"/>',
    'awning': '<path d="M3 9l2-5h14l2 5"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M5 12v8.5h14V12M10 20.5v-5h4v5"/>',
    'moon': '<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/><path d="M17 4l.5 1.3 1.3.5-1.3.5L17 7.6l-.5-1.3-1.3-.5 1.3-.5z"/>',
    'bubble': '<path d="M4 4.5h16v11.5H10.5L5.5 20v-4H4z"/><path d="M12 6.8l1.1 2.4 2.6.3-1.9 1.7.5 2.5-2.3-1.3-2.3 1.3.5-2.5-1.9-1.7 2.6-.3z"/>',
    'tower': '<path d="M12 2v3M8.5 21L12 5l3.5 16M9.3 15h5.4M7 21h10M10.2 10h3.6"/>',
    'ticket': '<path d="M3.5 7h17v3a2 2 0 0 0 0 4v3h-17v-3a2 2 0 0 0 0-4z"/><path d="M14.5 7.5v1.5M14.5 11.2v1.6M14.5 15v1.5"/>',
    # food
    'bowl': '<path d="M3 11.5h18a9 9 0 0 1-18 0z"/><path d="M9 20.5h6M13.5 3l6.5 7M9.5 3.5l6.5 7"/>',
    'sushi': '<ellipse cx="12" cy="15" rx="8.5" ry="4"/><path d="M3.5 15v-2.2c0-2.3 3.8-4.3 8.5-4.3s8.5 2 8.5 4.3V15"/><path d="M7.5 10.5c2.5 1.4 6.5 1.4 9 0"/>',
    'noodles': '<path d="M3 12h18a9 9 0 0 1-18 0z"/><path d="M7.5 12c0-4 1.8-6.5 1.8-9M11.5 12c0-4 1.8-6.5 1.8-9M15.5 12c0-4 1.8-6.5 1.8-9"/>',
    'lantern': '<path d="M12 2v2.2M9.2 4.2h5.6M9.2 19.8h5.6M12 19.8V22"/><path d="M8.3 6.2h7.4a3.8 3.8 0 0 1 0 11.6H8.3a3.8 3.8 0 0 1 0-11.6z"/><path d="M5 10.2h14M5 13.8h14"/>',
    'cup': '<path d="M4 8.5h13v4.5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M8.5 3c-1 1.4 1 2 0 3.5M12.5 3c-1 1.4 1 2 0 3.5"/>',
    'dango': '<path d="M4.5 21.5L19.5 2.5"/><circle cx="8.6" cy="16.3" r="2.6"/><circle cx="12" cy="12" r="2.6"/><circle cx="15.4" cy="7.7" r="2.6"/>',
    'flame': '<path d="M12 21.5c4.1 0 7-2.8 7-6.6 0-4-3-6.2-4-10.4-2 2-3 4.2-3 6.2-1-1-1.9-1.6-2-3.2-2.1 2-5 4.2-5 7.4 0 3.8 2.9 6.6 7 6.6z"/>',
    'cloche': '<path d="M3 18.5h18M4.5 18.5a7.5 7.5 0 0 1 15 0M12 8.5v-2M10 6.5h4"/>',
    'forkknife': '<path d="M7 3v7.5M5 3v5a2 2 0 0 0 4 0V3M7 10.5V21M17 21V3c-2 1.4-3 4-3 8h3"/>',
    'fish': '<path d="M3 12c3-4 6.8-6 10.8-6 3 0 5.2 2 7.2 6-2 4-4.2 6-7.2 6C9.8 18 6 16 3 12z"/><path d="M3 12L1.8 8.8M3 12l-1.2 3.2"/><circle cx="16.3" cy="11" r=".9"/>',
    'bottle': '<path d="M10 2.5h4v3l1.5 2.5v13.5h-7V8L10 5.5z"/><path d="M8.5 12.5h7"/>',
    'cake': '<path d="M4 21h16v-7H4z"/><path d="M4 16.5c2 1.4 4 1.4 5.3 0 1.4 1.4 4 1.4 5.4 0 1.3 1.4 3.3 1.4 5.3 0"/><path d="M12 14V9.5M12 6.5v.4"/>',
    'tv': '<rect x="3" y="6.5" width="18" height="13" rx="2"/><path d="M8 3l4 3.5L16 3"/>',
    'dumpling': '<path d="M3 15.5C3 11 7 7.5 12 7.5s9 3.5 9 8z"/><path d="M7 10c.5 1 1 1.6 1 2.6M12 7.5v3.6M17 10c-.5 1-1 1.6-1 2.6"/>',
    'sandwich': '<path d="M3 11.5a9 5.5 0 0 1 18 0z"/><path d="M2.5 14.5h19M4 17.5h16a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z"/>',
}

def sprite():
    syms = ''.join(f'<symbol id="i-{k}" viewBox="0 0 24 24">{v}</symbol>' for k, v in ICONS.items())
    return f'<svg width="0" height="0" style="position:absolute" aria-hidden="true">{syms}</svg>'

def icon(name, cls='ico', label=None):
    a = f' role="img" aria-label="{label}"' if label else ' aria-hidden="true"'
    return f'<svg class="{cls}"{a}><use href="#i-{name}"/></svg>'

STAR = 'M12 4.2l1.75 6.05L19.8 12l-6.05 1.75L12 19.8l-1.75-6.05L4.2 12l6.05-1.75z'
TIER_NAMES = {1: 'Must see', 2: 'Worth the detour', 3: 'Deep cut'}

def tier_svg(t):
    if t == 1:   # filled compass star inside a ring
        return f'<svg viewBox="0 0 24 24" aria-hidden="true"><circle class="s" cx="12" cy="12" r="10.6" fill="none" stroke-width="1.5"/><path class="f" d="{STAR}"/></svg>'
    if t == 2:   # outlined star in a ring, centre dot
        return f'<svg viewBox="0 0 24 24" aria-hidden="true"><circle class="s" cx="12" cy="12" r="10.6" fill="none" stroke-width="1.5"/><path class="s" d="{STAR}" fill="none" stroke-width="1.4" stroke-linejoin="round"/><circle class="f" cx="12" cy="12" r="1.5"/></svg>'
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="s" d="M12 5l7 7-7 7-7-7z" fill="none" stroke-width="1.6" stroke-linejoin="round"/></svg>'

def tier(t, where='', cls='', href='how-we-choose'):
    title = TIER_NAMES[t] + (f' in {where}' if where else '')
    return f'<a class="tier t{t} {cls}" href="#{href}" title="{title} — how we choose">{tier_svg(t)}<span>{TIER_NAMES[t]}</span></a>'


# ---------------- data-drawn art ----------------

class Proj:
    """Equirectangular projection (cos-lat corrected) fitted into w×h with padding, aspect preserved."""
    def __init__(self, pts, w, h, pad=0.08, clip=None):
        lats = sorted(p[0] for p in pts); lngs = sorted(p[1] for p in pts)
        if clip:   # drop the far tails so a day-trip outlier doesn't shrink the city
            lo, hi = int(len(lats) * clip), int(len(lats) * (1 - clip)) - 1
            lats, lngs = lats[lo:hi + 1], lngs[lo:hi + 1]
        self.la0, self.la1, self.lo0, self.lo1 = lats[0], lats[-1], lngs[0], lngs[-1]
        self.k = math.cos(math.radians((self.la0 + self.la1) / 2))
        dx = max((self.lo1 - self.lo0) * self.k, 1e-6); dy = max(self.la1 - self.la0, 1e-6)
        aw, ah = w * (1 - 2 * pad), h * (1 - 2 * pad)
        self.s = min(aw / dx, ah / dy)
        self.ox = (w - dx * self.s) / 2; self.oy = (h - dy * self.s) / 2
        self.w, self.h = w, h
    def __call__(self, lat, lng):
        return (self.ox + (lng - self.lo0) * self.k * self.s, self.oy + (self.la1 - lat) * self.s)
    def inside(self, x, y, m=0):
        return -m <= x <= self.w + m and -m <= y <= self.h + m


def mst(pts):
    """Prim's minimum spanning tree over (x, y) points → list of index pairs (constellation lines)."""
    n = len(pts)
    if n < 2: return []
    inT = [False] * n; d = [float('inf')] * n; par = [-1] * n; d[0] = 0; out = []
    for _ in range(n):
        u = min((i for i in range(n) if not inT[i]), key=lambda i: d[i]); inT[u] = True
        if par[u] >= 0: out.append((par[u], u))
        for v in range(n):
            if not inT[v]:
                dd = (pts[u][0] - pts[v][0]) ** 2 + (pts[u][1] - pts[v][1]) ** 2
                if dd < d[v]: d[v] = dd; par[v] = u
    return out


def constellation(recs, w, h, uid, clip=0.03, lines=True, accent_ids=(), glow=True, pad=0.08, max_line=None, bg=True):
    """Night-sky art: one star per verified pin (size by tier), MST lines joining each area's must-sees."""
    P = Proj([(r['lat'], r['lng']) for r in recs], w, h, pad=pad, clip=clip)
    out = [f'<svg viewBox="0 0 {w} {h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">',
           f'<defs><radialGradient id="g{uid}" cx="70%" cy="30%" r="80%"><stop offset="0" stop-color="#22305A"/>'
           f'<stop offset=".55" stop-color="#121A30"/><stop offset="1" stop-color="#0B1020"/></radialGradient>'
           f'<filter id="b{uid}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter></defs>',
           f'<rect width="{w}" height="{h}" fill="url(#g{uid})"/>' if bg else '']
    if max_line is None: max_line = max(w, h) * .14
    if lines:
        by = {}
        for r in recs:
            if r['t'] == 1 and not r['closed']:
                x, y = P(r['lat'], r['lng'])
                if P.inside(x, y): by.setdefault(r['a'], []).append((x, y))
        segs = []
        for a, pts in by.items():
            for i, j in mst(pts):
                (x1, y1), (x2, y2) = pts[i], pts[j]
                if max_line and math.hypot(x2 - x1, y2 - y1) > max_line: continue
                segs.append(f'M{x1:.1f} {y1:.1f}L{x2:.1f} {y2:.1f}')
        out.append(f'<path d="{"".join(segs)}" stroke="#F5EEDF" stroke-opacity=".26" stroke-width=".8" fill="none"/>')
    dots = {1: [], 2: [], 3: []}
    for r in recs:
        x, y = P(r['lat'], r['lng'])
        if P.inside(x, y, 2): dots[r['t'] if r['t'] in (1, 2, 3) else 2].append((x, y, r))
    for x, y, r in dots[3]: out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r=".8" fill="#F5EEDF" fill-opacity=".45"/>')
    for x, y, r in dots[2]: out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="1.1" fill="#F5EEDF" fill-opacity=".7"/>')
    if glow:
        out.append(f'<g filter="url(#b{uid})">' + ''.join(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="2.6" fill="#F7E3B0" fill-opacity=".55"/>' for x, y, r in dots[1]) + '</g>')
    for x, y, r in dots[1]:
        c = 'var(--city)' if r['id'] in accent_ids else '#FFF8E8'
        out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="1.6" fill="{c}"/>')
    out.append('</svg>')
    return ''.join(out)


def world_sky(pts, w, h, uid='w'):
    """Landing hero: every sourced pin in the registry on an equirectangular strip; arcs join the clusters."""
    lng0, lng1, lat0, lat1 = -128.0, 150.0, -2.0, 58.0
    sx = w / (lng1 - lng0); sy = h / (lat1 - lat0)
    s = min(sx, sy * 1.25)
    ox = (w - (lng1 - lng0) * s) / 2
    P = lambda la, lo: (ox + (lo - lng0) * s, h * .12 + (lat1 - la) * s * .8)
    out = [f'<svg viewBox="0 0 {w} {h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">',
           f'<defs><radialGradient id="g{uid}" cx="62%" cy="20%" r="90%"><stop offset="0" stop-color="#25335F"/><stop offset=".5" stop-color="#121A30"/>'
           f'<stop offset="1" stop-color="#0A0F1E"/></radialGradient><filter id="b{uid}"><feGaussianBlur stdDeviation="3"/></filter></defs>',
           f'<rect width="{w}" height="{h}" fill="url(#g{uid})"/>']
    # graticule — a quiet nod to an atlas
    for lo in range(-120, 151, 30):
        x, _ = P(0, lo); out.append(f'<path d="M{x:.0f} 0V{h}" stroke="#F5EEDF" stroke-opacity=".05"/>')
    for la in (0, 20, 40):
        _, y = P(la, 0); out.append(f'<path d="M0 {y:.0f}H{w}" stroke="#F5EEDF" stroke-opacity=".05"/>')
    seen = set(); dots = []
    for la, lo in pts:
        x, y = P(la, lo); key = (round(x * 2), round(y * 2))
        if key in seen or not (0 <= x <= w and 0 <= y <= h): continue
        seen.add(key); dots.append((x, y))
    hubs = {'cle': (41.5, -81.69), 'nyc': (40.73, -73.99), 'sf': (37.77, -122.42), 'tyo': (35.68, 139.76),
            'kyo': (35.01, 135.77), 'bru': (50.85, 4.35), 'sg': (1.35, 103.82), 'chi': (41.88, -87.63)}
    arcs = [('cle', 'bru'), ('bru', 'sg'), ('sg', 'tyo'), ('sf', 'cle'), ('nyc', 'bru'), ('chi', 'tyo')]
    for a, b in arcs:
        (x1, y1), (x2, y2) = P(*hubs[a]), P(*hubs[b])
        mx, my = (x1 + x2) / 2, min(y1, y2) - abs(x2 - x1) * .18
        out.append(f'<path d="M{x1:.0f} {y1:.0f}Q{mx:.0f} {my:.0f} {x2:.0f} {y2:.0f}" fill="none" stroke="#E9C877" stroke-opacity=".35" stroke-width="1" stroke-dasharray="2 5"/>')
    out.append(f'<g filter="url(#b{uid})">' + ''.join(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="2.2" fill="#F7E3B0" fill-opacity=".18"/>' for x, y in dots[::3]) + '</g>')
    out.append('<g fill="#FFF6E0">' + ''.join(f'<circle cx="{x:.1f}" cy="{y:.1f}" r=".9" fill-opacity=".8"/>' for x, y in dots) + '</g>')
    out.append('</svg>')
    return ''.join(out)


def mini_shape(recs, w=72, h=56, hi=None, cls=''):
    """Small area silhouette / locator: dots of the area's own verified pins; `hi` highlighted."""
    P = Proj([(r['lat'], r['lng']) for r in recs], w, h, pad=.1, clip=.04)
    dots = []
    for r in recs:
        x, y = P(r['lat'], r['lng'])
        if P.inside(x, y): dots.append(f'<circle class="d" cx="{x:.1f}" cy="{y:.1f}" r="1.3"/>')
    me = ''
    if hi is not None:
        x, y = P(hi['lat'], hi['lng'])
        x = min(max(x, 3), w - 3); y = min(max(y, 3), h - 3)
        me = f'<circle class="me" cx="{x:.1f}" cy="{y:.1f}" r="3.6"/>'
    return f'<svg class="{cls}" viewBox="0 0 {w} {h}" aria-hidden="true">{"".join(dots)}{me}</svg>'


def mapart_pair(recs, focus, ac, desk=(640, 760), mob=(390, 300), uid='m', mob_inset=None, **kw):
    """Two renders at the real aspect of each breakpoint so pins keep their size (CSS toggles .mq-m / .mq-d)."""
    d = mapart(recs, focus, desk[0], desk[1], ac, uid=uid + 'd', **kw)
    m = mapart(recs, focus, mob[0], mob[1], ac, uid=uid + 'm', inset=mob_inset, **kw)
    return f'<div class="mq-d">{d}</div><div class="mq-m">{m}</div>'


def mapart(recs, focus, w, h, ac, numbered=(), sel=None, route=None, labels=None, uid='m', pad=.1, dim_other=True, inset=None):
    """Offline-first map art: blurred area washes + pins from verified coordinates, viewport fitted to `focus`.
    numbered: [(n, rec)] pins drawn as numbered markers; route: [rec] joined in order."""
    t_, r_, b_, l_ = inset or (0, 0, 0, 0)
    P0 = Proj([(r['lat'], r['lng']) for r in focus], w - l_ - r_, h - t_ - b_, pad=pad)
    class _P:   # shift the fitted projection into the inset box; inside() tests the full canvas
        def __call__(s, la, lo):
            x, y = P0(la, lo); return x + l_, y + t_
        def inside(s, x, y, m=0):
            return -m <= x <= w + m and -m <= y <= h + m
    P = _P()
    out = [f'<svg viewBox="0 0 {w} {h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">',
           f'<defs><filter id="wb{uid}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="16"/></filter>'
           f'<pattern id="gr{uid}" width="48" height="48" patternUnits="userSpaceOnUse"><path class="grat" d="M48 0H0V48" fill="none"/></pattern></defs>',
           f'<rect width="{w}" height="{h}" fill="url(#gr{uid})"/>']
    inview = [(r, *P(r['lat'], r['lng'])) for r in recs]
    inview = [(r, x, y) for r, x, y in inview if P.inside(x, y, 20)]
    out.append(f'<g filter="url(#wb{uid})" opacity=".55">' + ''.join(
        f'<circle cx="{x:.0f}" cy="{y:.0f}" r="26" fill="{ac.get(r["a"], "#999")}" fill-opacity=".55"/>' for r, x, y in inview) + '</g>')
    if labels:
        for txt, la, lo in labels:
            x, y = P(la, lo)
            if P.inside(x, y): out.append(f'<text class="lbl" x="{x:.0f}" y="{y:.0f}" text-anchor="middle">{txt}</text>')
    if route:
        pts = [P(r['lat'], r['lng']) for r in route]
        out.append('<path class="route" d="M' + 'L'.join(f'{x:.1f} {y:.1f}' for x, y in pts) + '"/>')
    nids = {r['id'] for _, r in numbered}
    for r, x, y in inview:
        if r['id'] in nids: continue
        rr = 4.2 if r['t'] == 1 else 3.2
        op = '' if not dim_other else ''
        out.append(f'<circle class="pin{" t1" if r["t"] == 1 else ""}" cx="{x:.1f}" cy="{y:.1f}" r="{rr}"{op}/>')
    for n, r in numbered:
        x, y = P(r['lat'], r['lng'])
        s = ' sel' if sel is not None and r['id'] == sel else ''
        rad = 15 if s else 12
        out.append(f'<g class="num{s}"><circle cx="{x:.1f}" cy="{y:.1f}" r="{rad}"/><text x="{x:.1f}" y="{y + .5:.1f}">{n}</text></g>')
    out.append('</svg>')
    return ''.join(out)
