#!/usr/bin/env python3
"""View-style mockups (Gallery · Atlas · Guidebook · Insights) built from the real generated beta data.

    python3 design/beta/views/tools/make-views.py            # tokyo + cleveland → design/beta/views/mockups/

Reads beta/data/places/<key>.json (read-only; the platform generator owns it). Every place of the page is rendered in
every view, and the script asserts it before writing. No invented places, photos, ratings, prices, hours or quotes:
copy is the record's own write-up (`w`) and note (`k`); every number is computed here from the records.
Art is data-drawn (area pins) or typographic. No CDN: fonts are the beta's self-hosted files, charts are inline SVG.
"""
import html, json, math, os, re, sys, collections

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '../../../..'))
OUT = os.path.join(HERE, '..', 'mockups')
sys.path.insert(0, os.path.join(ROOT, 'design/beta/tools'))
import svgkit as K  # noqa: E402  (icons, tier glyphs, map art)

ASSETS = '../../../../beta/assets/'
VIEWS = [('gallery', 'Gallery', 'heart'), ('atlas', 'Atlas', 'map'), ('guidebook', 'Guidebook', 'guide'), ('insights', 'Insights', 'sliders')]
GLYPH = json.load(open(os.path.join(ROOT, 'design/beta/glyphs.json')))['collections']
SER = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#6250d6']      # validated categorical (light)
SER_D = ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#9085e9']    # validated categorical (dark)
OTHER = '#b4ada2'
CROWNS = {'tokyo': ('Japan', '../../../../beta/Japan/index.html'), 'cleveland': ('United States', '../../../../beta/index.html')}

e = lambda s: html.escape(str(s if s is not None else ''), quote=True)
TIER = {1: 'Must see', 2: 'Worth the detour', 3: 'Deep cut'}


# ---------------------------------------------------------------- model
class Page:
    def __init__(self, key):
        self.d = d = json.load(open(os.path.join(ROOT, 'beta/data/places', key + '.json')))
        self.key, self.name, self.nat = key, d['name'], d.get('nat') or ''
        self.places = d['places']
        self.N = len(self.places)
        assert self.N == d['counts']['total'] == d['stats']['total'], 'record count mismatch'
        self.byid = {p['id']: p for p in self.places}
        self.areas = d['areas']; self.amap = {a['id']: a for a in self.areas}
        self.colors = d['colors']
        self.colls = {c['id']: c['n'].lstrip('★ ').strip() for c in d['collections']}
        self.cz = {c['id']: c['n'] for c in d['cuisines']}
        self.src = {s['id']: s for s in d['sourceIndex']}
        self.guide = d.get('guide') or {}
        for p in self.places:
            p['lat'], p['lng'] = p['la'], p['ln']
            p['open'] = not p.get('closed'); p['closed'] = not p['open']
            p['dn'] = re.sub(r'\s*[—-]+\s*CLOSED\s*$', '', p['n'])
            p['dn_lat'] = re.sub(r'\s*\([^)]*[　-鿿][^)]*\)', '', p['dn']).strip()
            p['pinned'] = (p.get('pv') or {}).get('pin') in ('high', 'med')
        # rank within area: open first, tier, then most named sources, then source order (DESIGN-SYSTEM §5)
        self.by_area = collections.OrderedDict((a['id'], []) for a in self.areas)
        for i, p in enumerate(self.places):
            p['i'] = i
            self.by_area.setdefault(p['a'], []).append(p)
        for aid, lst in self.by_area.items():
            lst.sort(key=lambda p: (not p['open'], p['t'], -len(p['src']), p['i']))
            for r, p in enumerate(lst, 1):
                p['rank'], p['of'] = r, len(lst)
        self.ordered = [p for lst in self.by_area.values() for p in lst]
        assert len(self.ordered) == self.N
        pc = self.guide.get('popCulture') or {}
        self.pop_ids = set(pc.get('c') or [])
        self.last = d['stats'].get('lastChecked', '')

    def area_short(self, aid):
        return re.split(r'\s*[(—]', self.amap[aid]['n'])[0].strip()

    def area_hoods(self, aid):
        m = re.search(r'\(([^)]*)\)', self.amap[aid]['n'])
        if m: return m.group(1)
        parts = re.split(r'\s+—\s+', self.amap[aid]['n'], maxsplit=1)
        return parts[1] if len(parts) > 1 else ''

    def is_pop(self, p):
        return bool(self.pop_ids & set(p['g']))

    def kind3(self, p):
        return 'pop' if p['kind'] == 'sight' and self.is_pop(p) else ('food' if p['kind'] == 'food' else 'sight')

    def src_names(self, p):
        return [self.src[s]['name'] if s in self.src else s for s in p['src']]

    def src_short(self, sid):
        n = self.src[sid]['name'] if sid in self.src else sid
        if sid == 'guide': return 'Added by the guide'
        return re.split(r'\s+[·—(]\s*', n)[0][:34]

    def glyph(self, p):
        for g in p['g']:
            if g in GLYPH: return GLYPH[g]
        return 'forkknife' if p['kind'] == 'food' else 'star4'

    def lens(self, p):
        return ' '.join(p['g'] + ['cz-' + c for c in p['cz']])


def href_src(p, page):
    for k, u in p['s']:
        if isinstance(u, str) and u.startswith('http'): return u
    for sid in p['src']:
        s = page.src.get(sid) or {}
        for en in s.get('entries', []):
            if (en.get('url') or '').startswith('http'): return en['url']
        if s.get('domains'): return 'https://' + s['domains'][0]
    return None


def official(p, page):
    for k, u in p['s']:
        if 'OFFICIAL' in k.upper() and isinstance(u, str) and u.startswith('http'): return u
    return None


def km(a, b):
    R = 6371.0; f1, f2 = math.radians(a['la']), math.radians(b['la'])
    dl = math.radians(b['ln'] - a['ln']); df = f2 - f1
    h = math.sin(df / 2) ** 2 + math.cos(f1) * math.cos(f2) * math.sin(dl / 2) ** 2
    return 2 * R * math.asin(math.sqrt(h))


# ---------------------------------------------------------------- shared chrome
def font_css():
    out = []
    for fam, st, f in [('Bodoni Moda', 'normal', 'bodoni-moda-normal-latin'), ('Bodoni Moda', 'normal', 'bodoni-moda-normal-latin-ext'),
                       ('Bodoni Moda', 'italic', 'bodoni-moda-italic-latin'), ('Figtree', 'normal', 'figtree-normal-latin'),
                       ('Figtree', 'normal', 'figtree-normal-latin-ext')]:
        w = '400 700' if 'bodoni' in f else '300 900'
        out.append(f'@font-face{{font-family:"{fam}";font-style:{st};font-weight:{w};font-display:swap;src:url("{ASSETS}fonts/{f}.woff2") format("woff2")}}')
    return '\n'.join(out)


def head(page, view, title, extra=''):
    return f'''<!doctype html>
<html lang="en" data-city="{page.key}" data-cleo-page="city" data-view="{view}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{e(title)}</title>
<meta name="description" content="Beta view-style mockup ({e(view)}) of {e(page.name)}, built from the real records. Not a generated page.">
<link rel="stylesheet" href="{ASSETS}tokens.css"><link rel="stylesheet" href="views.css">{extra}
</head><body>{K.sprite()}
<a class="skip" href="#main">Skip to the places</a>'''


def switcher(page, view):
    out = ['<nav class="vsw" aria-label="View"><ul>']
    for v, label, ic in VIEWS:
        cur = ' aria-current="page"' if v == view else ''
        out.append(f'<li><a href="{page.key}-{v}.html#view={v}" data-view="{v}"{cur}>{K.icon(ic)}<span>{label}</span></a></li>')
    out.append('</ul></nav>')
    return ''.join(out)


def topbar(page, view):
    country, chref = CROWNS.get(page.key, ('Beta', '../../../../beta/index.html'))
    nat = f' <span class="nat" lang="ja">{e(page.nat)}</span>' if page.nat else ''
    return f'''<header class="top"><div class="top-in">
<a class="mark" href="index.html" aria-label="cleo beta — view mockups">{K.icon('star4')}<i>cleo</i></a>
<p class="crumb"><span>{e(country)}</span> › <b>{e(page.name)}</b>{nat}</p>
{switcher(page, view)}
<button class="ib" type="button" aria-label="Saved places">{K.icon('heart')}</button></div></header>'''


def countline(page):
    st = page.d['stats']; c = page.d['counts']
    closed = f' · {st["closed"]} closed, kept for the record' if st['closed'] else ''
    return (f'<p class="count" data-cleo-count><b>All {page.N} places</b> · {c["sights"]} sights · {c["food"]} eat &amp; drink · '
            f'{len(page.areas)} areas{closed} · status checked to {e(page.last)}</p>')


def toolbar(page, view, chips=True):
    lens = ''
    if chips:
        sig = page.guide.get('signature') or {}
        items = [('All', ''), ('Sights', 'k=s'), ('Eat &amp; drink', 'k=f'), ('Must see', 't=1')]
        if sig.get('kind') == 'collection': items.append((f'★ {e(sig["title"])}', 'c=' + sig['c'][0]))
        elif sig: items.append((f'★ {e(sig["title"])}', 'cz=' + sig['cz'][0]))
        if 'FREE' in page.colls: items.append(('Free to visit', 'c=FREE'))
        lens = '<div class="chips" role="group" aria-label="Quick lenses">' + ''.join(
            f'<button type="button" class="chip" data-lens="{q}" aria-pressed="{"true" if not q else "false"}">{t}</button>' for t, q in items) + '</div>'
    return f'''<div class="tools" data-cleo-toolbar><div class="tools-in">
<label class="search">{K.icon('search')}<span class="sr">Search {e(page.name)}</span><input type="search" placeholder="Search {page.N} places in {e(page.name)}" data-q></label>
<button class="btn ghost" type="button" data-tray>{K.icon('sliders')}<span>Filters</span></button>
{lens}</div></div>'''


def foot(page):
    return f'''<footer class="foot"><p><i>cleo</i> beta · view-style mockup · {page.N} places, every one recommended by name.
No ratings, prices or hours: we hold none. Map art is drawn from verified pins.</p></footer>
<script src="views.js"></script></body></html>'''


# ---------------------------------------------------------------- cards and art
def cover(page, p, w=320, h=240, big=False):
    """Data-drawn cover: area wash + the area's shared verified-pin art (one cached SVG per area), this place ringed,
    and a native-script or initial plate. The pin art is the platform's beta/assets/art/<page>/<AREA>.svg."""
    ac = page.colors.get(p['a'], '#888')
    a = (page.d.get('art') or {}).get('areas', {}).get(p['a'])
    art = ''
    if a:
        me = ''
        if p['pinned']:
            P = a['proj']; x = P['pad'] + (p['ln'] - P['box'][1]) * P['kx']; y = P['pad'] + (P['box'][2] - p['la']) * P['ky']
            if 0 <= x <= P['w'] and 0 <= y <= P['h']:
                me = f'<span class="me" style="left:{100 * x / P["w"]:.1f}%;top:{100 * y / P["h"]:.1f}%"></span>'
        art = f'<span class="pinart"><img src="../../../../beta/{a["src"]}" alt="" loading="lazy" width="{a["w"]}" height="{a["h"]}">{me}</span>'
    if p.get('nat'):
        txt = p['nat'].replace(' ', '')[:4]
        plate = f'<span class="plate v" lang="ja">{e(txt)}</span>'
    else:
        plate = f'<span class="plate i">{e(p["dn_lat"][:1])}</span>'
    closed = ' closed' if not p['open'] else ''
    return (f'<div class="cover{closed}{" big" if big else ""}" style="--ac:{ac}">{art}{plate}'
            f'<span class="gl">{K.icon(page.glyph(p))}</span></div>')


def tier_badge(page, p):
    if not p['open']:
        return '<span class="flag closed">Closed · kept for the record</span>'
    return f'<span class="tier t{p["t"]}" title="{TIER[p["t"]]} within {e(page.area_short(p["a"]))}">{K.tier_svg(p["t"])}<span>{TIER[p["t"]]}</span></span>'


def recby(page, p, n=2):
    ids = p['src']; shown = ids[:n]; more = len(ids) - len(shown)
    chips = ''.join(f'<a class="src{" added" if s == "guide" else ""}" href="#src={e(s)}">{e(page.src_short(s))}</a>' for s in shown)
    if more > 0: chips += f'<span class="more">+{more}</span>'
    return f'<p class="recby"><span>Recommended by</span> {chips}</p>'


def data_attrs(p):
    return (f'data-id="{e(p["id"])}" data-a="{p["a"]}" data-k="{"s" if p["kind"] == "sight" else "f"}" data-t="{p["t"]}" '
            f'data-g="{e(" ".join(p["g"]))}" data-cz="{e(" ".join(p["cz"]))}" data-src="{e(" ".join(p["src"]))}"'
            f'{" data-closed" if not p["open"] else ""} data-n="{e(p["dn_lat"].lower())}"')


def gcard(page, p, href, lazy_ok=True):
    w = e(p['w'])
    return (f'<li class="gc" {data_attrs(p)}><a class="gc-a" href="{href}">{cover(page, p)}'
            f'<span class="gc-b"><span class="eyebrow">{e(page.area_short(p["a"]))} · {"Eat & drink" if p["kind"] == "food" else "See"}</span>'
            f'<span class="gc-n">{e(p["dn_lat"])}</span><span class="gc-w">{w}</span></span></a>'
            f'<div class="gc-f">{tier_badge(page, p)}{recby(page, p)}</div>'
            f'<button class="heart" type="button" aria-label="Save {e(p["dn_lat"])}">{K.icon("heart")}</button></li>')


# ---------------------------------------------------------------- GALLERY
def gallery(page):
    detail = f'{page.key}-gallery-place.html'
    sig = page.guide.get('signature') or {}; canon = page.guide.get('canon') or {}
    rows = []
    def row(title, sub, ps, lens, rid):
        if not ps: return
        cards = ''.join(gcard(page, p, detail) for p in ps[:12])
        rows.append(f'''<section class="row" aria-labelledby="r-{rid}"><div class="row-h"><div><h2 id="r-{rid}" class="d2">{title}</h2>
<p class="sub">{sub}</p></div><button class="btn ghost" type="button" data-lens="{lens}">See all {len(ps)}</button></div>
<ul class="rail" role="list">{cards}</ul></section>''')
    if sig:
        ps = [page.byid[i] for i in sig['ids'] if i in page.byid]
        lens = ('c=' + sig['c'][0]) if sig.get('c') else ('cz=' + sig['cz'][0])
        row(f'★ {e(sig["title"])}', f'{len(ps)} places · the signature of {e(page.name)}', ps, lens, 'sig')
    must = [p for p in page.ordered if p['open'] and p['t'] == 1]
    row('Must see', f'{len(must)} places · the top tier within each area', must, 't=1', 'must')
    if canon and canon.get('title') != sig.get('title'):
        ps = [page.byid[i] for i in canon['ids'] if i in page.byid]
        dishes = ' · '.join(d['t'] for d in canon.get('dishes') or [])
        row(e(canon['title']), f'{len(ps)} places{" · " + e(dishes) if dishes else ""}', ps, 'cz=' + canon['cz'][0], 'canon')
    cnt = collections.Counter(g for p in page.places for g in p['g'])
    for cid, n in cnt.most_common():
        if cid in ('ICON', 'FREE') or cid in (sig.get('c') or []) or len(rows) >= 6: continue
        ps = [p for p in page.ordered if cid in p['g']]
        row(e(page.colls.get(cid, cid)), f'{n} places', ps, 'c=' + cid, cid.lower())
    closed = [page.byid[c['id']] for c in page.guide.get('closed') or [] if c['id'] in page.byid]
    if closed:
        row('Recently closed', f'{len(closed)} places · kept for the record, newest status check first', closed, 'closed=1', 'closed')

    lead = next((page.byid[i] for i in (sig.get('ids') or []) if i in page.byid and page.byid[i]['open']), must[0] if must else page.ordered[0])
    tile = (page.guide.get('tileLine') or {}).get('text') or ''
    hero_pins = [p for p in page.places if p['pinned']]
    sky = K.constellation(hero_pins, 1200, 520, 'gh', lines=True) if hero_pins else ''
    nat = f'<span class="hero-nat" lang="ja">{e(page.nat)}</span>' if page.nat else ''
    hero = f'''<section class="ghero" aria-labelledby="gh-t"><div class="sky" aria-hidden="true">{sky}</div>
<div class="ghero-in"><p class="kicker">A guide in {len(page.areas)} areas · every place recommended by name</p>
<h1 id="gh-t" class="d1">{e(page.name)}{nat}</h1>
<p class="lead">{e(tile)}</p>
<div class="cta"><a class="btn" href="#all">Browse all {page.N} places</a><a class="btn ghost on-night" href="{detail}">Start with {e(lead["dn_lat"])}</a></div></div>
<a class="ghero-card" href="{detail}">{cover(page, lead, 360, 270, big=True)}<span class="eyebrow">{e(page.area_short(lead["a"]))}</span>
<b>{e(lead["dn_lat"])}</b><span class="gc-w">{e(lead["w"])}</span></a></section>'''

    grid = ''.join(gcard(page, p, detail) for p in page.ordered)
    allsec = f'''<section class="all" id="all" aria-labelledby="all-t"><div class="row-h"><div><h2 id="all-t" class="d2">All {page.N} places</h2>
<p class="sub" data-showing>Ranked within each area: tier, then how many sources name it. Closed places last, flagged.</p></div></div>
<ul class="grid" role="list" data-paged data-total="{page.N}">{grid}</ul>
<nav class="pager" aria-label="Pages" data-pager></nav></section>'''
    body = (head(page, 'gallery', f'{page.name} · Gallery — cleo beta mockup') + topbar(page, 'gallery') +
            f'<main id="main" data-city="{page.key}">{hero}<div class="wrap">{countline(page)}</div>{toolbar(page, "gallery")}'
            f'<div class="wrap">{"".join(rows)}{allsec}</div></main>' + foot(page))
    assert body.count('<li class="gc"') >= page.N
    assert len(re.findall(r'<ul class="grid".*?</ul>', body, re.S)[0].split('<li class="gc"')) - 1 == page.N, 'gallery grid lost records'
    return body


def gallery_place(page):
    sig = page.guide.get('signature') or {}
    p = next((page.byid[i] for i in (sig.get('ids') or []) if i in page.byid and page.byid[i]['open'] and page.byid[i]['t'] == 1), None)
    p = p or next(x for x in page.ordered if x['open'] and x['t'] == 1)
    pos = page.ordered.index(p)
    prev_p, next_p = page.ordered[pos - 1], page.ordered[(pos + 1) % page.N]
    area = page.area_short(p['a']); ac = page.colors.get(p['a'], '#888')
    pins = [r for r in page.places if r['pinned']]
    focus = [r for r in page.by_area[p['a']] if r['pinned']]
    near = sorted((r for r in page.places if r is not p and r['open'] and r['pinned']), key=lambda r: km(p, r))[:4]
    mp = K.mapart(pins, focus, 720, 460, page.colors, numbered=[(p['rank'], p)], sel=p['id'], uid='dp')
    off = official(p, page); rd = href_src(p, page)
    pv = p.get('pv') or {}
    lat, lng = p['la'], p['ln']
    q = e(p['dn_lat'])
    srcs = ''.join(
        f'<li><span class="mono">{e(page.src_short(s)[:1])}</span><span><b>{e(page.src[s]["name"] if s in page.src else s)}</b>'
        f'<a href="{page.key}-gallery.html#view=gallery&amp;src={e(s)}">All {page.src[s]["n"] if s in page.src else ""} {e(page.name)} picks citing it →</a></span></li>'
        for s in p['src'])
    colls = ''.join(f'<a class="pill" href="{page.key}-gallery.html#view=gallery&amp;c={g}">{K.icon(GLYPH.get(g, "star4"))}{e(page.colls.get(g, g))}</a>' for g in p['g'])
    colls += ''.join(f'<a class="pill" href="{page.key}-gallery.html#view=gallery&amp;cz={c}">{K.icon("forkknife")}{e(page.cz.get(c, c))}</a>' for c in p['cz'])
    look = f'<section class="sec"><h2 class="d3">Look for</h2><p class="note">{e(p["k"])}</p></section>' if p.get('k') else ''
    nears = ''.join(f'<li><a href="#">{cover(page, r, 120, 90)}<span><b>{e(r["dn_lat"])}</b><span class="meta">{km(p, r):.1f} km straight-line · {e(page.area_short(r["a"]))}</span></span></a></li>' for r in near)
    primary = (f'<a class="btn" href="{e(off)}" rel="noopener">{K.icon("external")}<span>Visit the official site</span></a>' if off else
               (f'<a class="btn" href="{e(rd)}" rel="noopener">{K.icon("external")}<span>Read what {e(page.src_short(p["src"][0]))} says</span></a>' if rd else ''))
    short = (f'<a class="btn" href="{e(off or rd)}" rel="noopener">{K.icon("external")}<span>{"Official site" if off else "Read the source"}</span></a>' if (off or rd) else '')
    plan = f'''<aside class="plan" aria-labelledby="plan-t"><h2 id="plan-t" class="d3">Plan your visit</h2>
<p class="addr">{K.icon('pin')}<span>{e(p['ad'])}</span></p>
<p class="dirs"><a href="https://maps.apple.com/?ll={lat},{lng}&amp;q={q}">Apple Maps</a> · <a href="https://www.openstreetmap.org/?mlat={lat}&amp;mlon={lng}#map=18/{lat}/{lng}">OpenStreetMap</a> · <a href="https://www.google.com/maps/search/?api=1&amp;query={lat},{lng}">Google Maps</a></p>
{primary}
<div class="plan-row"><button class="btn ghost" type="button">{K.icon('heart')}<span>Save</span></button><button class="btn ghost" type="button">{K.icon('day')}<span>Add to day</span></button><button class="btn ghost" type="button">{K.icon('share')}<span>Share</span></button></div>
<p class="fine">Hours and prices aren't in our data. Check before you go.</p>
<dl class="facts"><dt>Status</dt><dd>{e((pv.get('status') or 'open').capitalize())}, checked {e(pv.get('checked', ''))}</dd>
<dt>Pinned to the door</dt><dd>{e(pv.get('pin', ''))} confidence, verified {e(pv.get('verified', ''))}</dd>
<dt>Where it sits</dt><dd>No. {p['rank']} of {p['of']} in {e(area)}</dd></dl></aside>'''
    nat = f'<p class="dnat" lang="ja">{e(p["nat"])}</p>' if p.get('nat') else ''
    body = (head(page, 'gallery', f'{p["dn_lat"]} · {page.name} — cleo beta mockup') + topbar(page, 'gallery') +
            f'''<main id="main" class="detail" data-city="{page.key}"><div class="wrap">
<nav class="dnav" aria-label="Place navigation"><a href="{page.key}-gallery.html#view=gallery">{K.icon('chev-l')}<span>All {page.N} places</span></a>
<span class="pos">{pos + 1} of {page.N} in this view</span><span class="pn"><a href="#" aria-label="Previous: {e(prev_p['dn_lat'])}">{K.icon('chev-l')}</a><a href="#" aria-label="Next: {e(next_p['dn_lat'])}">{K.icon('chev-r')}</a></span></nav>
<div class="mosaic"><div class="m1">{cover(page, p, 640, 420, big=True)}</div><div class="m2" style="--ac:{ac}">{mp}<span class="cap">Its pin among {len(focus)} in {e(area)}</span></div>
<div class="m3" style="--ac:{ac}"><span class="glbig">{K.icon(page.glyph(p))}</span><span class="cap">{e(page.colls.get(p['g'][0], '') if p['g'] else (page.cz.get(p['cz'][0], '') if p['cz'] else ''))}</span></div></div>
<div class="dgrid"><article class="dmain">
<p class="eyebrow">{e(area)} · {"Eat & drink" if p['kind'] == 'food' else 'See'}</p>
<h1 class="d1">{e(p['dn_lat'])}</h1>{nat}
<div class="dtier">{tier_badge(page, p)}<span class="meta">within {e(area)} · recommended by {len(p['src'])} source{'s' if len(p['src']) != 1 else ''}</span></div>
<section class="sec"><h2 class="d3">Why it's here</h2><p class="lead-w">{e(p['w'])}</p></section>
{look}
<section class="sec host"><h2 class="d3">Recommended by</h2><ul class="srclist">{srcs}</ul></section>
<section class="sec"><h2 class="d3">Part of</h2><p class="pills">{colls}</p></section>
<section class="sec"><h2 class="d3">Close by</h2><ul class="near">{nears}</ul></section>
</article>{plan}</div></div>
<div class="dbar" role="group" aria-label="Actions"><button class="ib" type="button" aria-label="Save">{K.icon('heart')}</button><a class="btn ghost" href="https://www.openstreetmap.org/?mlat={lat}&amp;mlon={lng}#map=18/{lat}/{lng}">{K.icon('directions')}<span>Directions</span></a>{short}</div>
</main>''' + foot(page))
    return body, p


# ---------------------------------------------------------------- ATLAS
def atlas(page):
    pins = [r for r in page.places if r['pinned']]
    first = page.areas[0]['id']
    focus = [r for r in page.by_area[first] if r['pinned']]
    numbered = [(r['rank'], r) for r in focus]
    sel = numbered[0][1]['id'] if numbered else None
    mp_d = K.mapart(pins, focus, 820, 900, page.colors, numbered=numbered, sel=sel, uid='ad')
    mp_m = K.mapart(pins, focus, 390, 520, page.colors, numbered=numbered, sel=sel, uid='am')
    unpinned = page.N - len(pins)
    badge = f'<span class="mbadge">{unpinned} without a verified pin · listed below</span>' if unpinned else ''
    groups = []
    for aid, lst in page.by_area.items():
        ac = page.colors.get(aid, '#888')
        items = []
        for p in lst:
            items.append(f'''<li class="ar" {data_attrs(p)}><a href="{page.key}-gallery-place.html" class="ar-a"><span class="rk" style="--ac:{ac}">{p['rank']}</span>
<span class="ar-b"><span class="ar-n">{e(p['dn_lat'])}</span><span class="ar-m">{tier_badge(page, p)}<span class="kind">{"Eat & drink" if p['kind'] == 'food' else 'See'}</span>{'' if p['pinned'] else '<span class="flag">No verified pin</span>'}</span>
<span class="ar-w">{e(p['w'])}</span></span></a>{recby(page, p, 3)}</li>''')
        groups.append(f'''<section class="ag" id="area-{aid}" aria-labelledby="ag-{aid}"><header class="ag-h"><i style="background:{ac}"></i>
<h2 id="ag-{aid}" class="d3">{e(page.area_short(aid))}</h2><span class="meta">{len(lst)} places · ranked</span></header><ol class="arl">{''.join(items)}</ol></section>''')
    areachips = ''.join(f'<button type="button" class="chip" aria-pressed="{"true" if a["id"] == first else "false"}"><i style="background:{page.colors.get(a["id"])}"></i>{e(page.area_short(a["id"]))} <b>{len(page.by_area[a["id"]])}</b></button>' for a in page.areas)
    body = (head(page, 'atlas', f'{page.name} · Atlas — cleo beta mockup') + topbar(page, 'atlas') +
            f'''<main id="main" class="atlas" data-city="{page.key}">
<div class="amap" role="region" aria-label="Map of {e(page.name)}"><div class="mq-d">{mp_d}</div><div class="mq-m">{mp_m}</div>
<div class="mctl"><button class="ib" type="button" aria-label="Zoom in">{K.icon('plus')}</button><button class="ib" type="button" aria-label="Near me">{K.icon('compass')}</button></div>
{badge}<p class="mcredit">Map art from {len(pins)} verified pins · tiles © OpenStreetMap contributors; Esri</p></div>
<section class="tray" data-detent="half" aria-label="Ranked places"><button class="grab" type="button" aria-label="Expand the list" data-grab><span></span></button>
<div class="tray-h">{countline(page)}<p class="order">In <b>{e(page.area_short(first))}</b>: {len(page.by_area[first])} places. Numbers are the rank within each area: tier, then how many sources name it; closed last.</p>
<div class="chips area" role="group" aria-label="Areas">{areachips}</div>
{toolbar(page, 'atlas')}</div>
<div class="tray-b">{''.join(groups)}</div></section></main>''' + foot(page))
    assert body.count('<li class="ar"') == page.N, 'atlas lost records'
    return body


# ---------------------------------------------------------------- GUIDEBOOK
def plural(n, w, pl=None):
    return f'{n} {w if n == 1 else (pl or w + "s")}'


def intro(page, aid, lst):
    """Intro prose assembled only from computed facts and record names."""
    op = [p for p in lst if p['open']]
    s = [p for p in op if p['kind'] == 'sight']; f = [p for p in op if p['kind'] == 'food']
    t1 = [p for p in op if p['t'] == 1]
    srcs = collections.Counter(x for p in lst for x in p['src'] if x != 'guide')
    top = srcs.most_common(1)
    pop = [p for p in op if page.is_pop(p)]
    parts = [f'{page.area_short(aid)} holds {plural(len(lst), "place")} in this guide: {plural(len(s), "sight")} and {plural(len(f), "place")} to eat or drink.']
    if t1:
        parts.append(f'{"Its must-see is" if len(t1) == 1 else "Its must-sees start with"} {t1[0]["dn_lat"]}' + (f' and {t1[1]["dn_lat"]}' if len(t1) > 1 else '') + '.')
    if pop: parts.append(f'{plural(len(pop), "place")} here belong to the pop-culture trail.')
    if top: parts.append(f'The source that names the most of them is {page.src_short(top[0][0])} ({top[0][1]}).')
    cl = len(lst) - len(op)
    if cl: parts.append(f'{plural(cl, "place")} here {"has" if cl == 1 else "have"} closed; {"it stays" if cl == 1 else "they stay"} at the end of the chapter, flagged.')
    return ' '.join(parts)


def gentry(page, p):
    nat = f' <span class="nat" lang="ja">{e(p["nat"])}</span>' if p.get('nat') else ''
    k = f'<span class="gk">Look for: {e(p["k"])}</span>' if p.get('k') else ''
    return (f'<li class="ge" {data_attrs(p)} id="p-{e(p["id"])}"><h4><span class="rk">{p["rank"]}</span>{e(p["dn_lat"])}{nat}</h4>'
            f'<p class="ge-m">{tier_badge(page, p)}<span class="ad">{e(p["ad"])}</span></p><p>{e(p["w"])}</p>{k}{recby(page, p, 4)}</li>')


def guidebook(page):
    chapters, toc = [], []
    canon_ids = set((page.guide.get('canon') or {}).get('ids') or [])
    for n, (aid, lst) in enumerate(page.by_area.items(), 1):
        if not lst: continue
        ac = page.colors.get(aid, '#888')
        op = [p for p in lst if p['open']]
        top = [p for p in op if p['t'] == 1]
        pop = [p for p in op if p['t'] != 1 and page.is_pop(p)]
        see = [p for p in op if p['t'] != 1 and p['kind'] == 'sight' and not page.is_pop(p)]
        eat = [p for p in op if p['t'] != 1 and p['kind'] == 'food' and not page.is_pop(p)]
        gone = [p for p in lst if not p['open']]
        assert len(top) + len(pop) + len(see) + len(eat) + len(gone) == len(lst)
        secs = []
        for title, ps in [('Top picks', top), ('See', see), ('Eat', eat), ('Pop culture', pop), ('Kept for the record', gone)]:
            if ps: secs.append(f'<section class="gs"><h3 class="d3">{title} <span class="meta">{len(ps)}</span></h3><ol class="gl">{"".join(gentry(page, p) for p in ps)}</ol></section>')
        area = [r for r in lst if r['pinned']]
        art = (page.d.get('art') or {}).get('areas', {}).get(aid)
        sil = f'<img class="sil" src="../../../../beta/{art["src"]}" alt="" width="{art["w"]}" height="{art["h"]}" loading="lazy">' if art else ''
        srcs = collections.Counter(x for p in lst for x in p['src'])
        canon_here = [p for p in op if p['id'] in canon_ids]
        side = f'''<aside class="facts-box" style="--ac:{ac}">{sil}<dl>
<dt>Places</dt><dd>{len(lst)}</dd><dt>Sights · eat &amp; drink</dt><dd>{sum(p['kind'] == 'sight' for p in lst)} · {sum(p['kind'] == 'food' for p in lst)}</dd>
<dt>Must see</dt><dd>{len(top)}</dd>{f'<dt>{e(page.guide["canon"]["title"])}</dt><dd>{len(canon_here)}</dd>' if canon_here else ''}
<dt>Closed, kept</dt><dd>{len(gone)}</dd><dt>Most-cited source</dt><dd>{e(page.src_short(srcs.most_common(1)[0][0]))} ({srcs.most_common(1)[0][1]})</dd>
<dt>Pins verified</dt><dd>{len(area)} of {len(lst)}</dd><dt>Status checked</dt><dd>to {e(max((p.get('pv') or {}).get('checked', '') for p in lst))}</dd></dl></aside>'''
        hoods = page.area_hoods(aid)
        chapters.append(f'''<article class="ch" id="area-{aid}" aria-labelledby="ch-{aid}" style="--ac:{ac}">
<header class="ch-h"><p class="eyebrow">Chapter {n} of {len(page.areas)}</p><h2 id="ch-{aid}" class="d1">{e(page.area_short(aid))}</h2>{f'<p class="hoods">{e(hoods)}</p>' if hoods else ''}</header>
<div class="ch-g"><div class="ch-main"><p class="ch-intro">{e(intro(page, aid, lst))}</p>{''.join(secs)}</div>{side}</div></article>''')
        toc.append(f'<li><a href="#area-{aid}"><span class="n">{n}</span><span>{e(page.area_short(aid))}</span><span class="meta">{len(lst)}</span></a></li>')
    st = page.d['stats']
    sig = page.guide.get('signature') or {}
    cover_ = f'''<header class="gcover"><p class="kicker">A field guide · {len(page.areas)} chapters · {page.N} places</p>
<h1 class="hero-t">{e(page.name)}{f' <span lang="ja">{e(page.nat)}</span>' if page.nat else ''}</h1>
<p class="lead">{e((page.guide.get('tileLine') or {}).get('text') or '')}</p>
<p class="gfacts">{st['sights']} sights · {st['food']} places to eat and drink · {st['sources']} named sources · {st['verifiedPins']} of {st['pins']} pins verified · status checked to {e(page.last)}</p>
{f'<p class="gsig">★ {e(sig["title"])}: {sig["n"]} places, marked through the chapters.</p>' if sig else ''}</header>'''
    body = (head(page, 'guidebook', f'{page.name} · Guidebook — cleo beta mockup') + topbar(page, 'guidebook') +
            f'''<main id="main" class="book" data-city="{page.key}"><div class="wrap bk">
<nav class="toc" aria-label="Chapters"><p class="eyebrow">Contents</p><ol>{''.join(toc)}</ol>
<button class="btn ghost" type="button" onclick="window.print()">{K.icon('print')}<span>Print this guide</span></button></nav>
<div class="bk-main">{cover_}{''.join(chapters)}</div></div></main>''' + foot(page))
    assert body.count('<li class="ge"') == page.N, 'guidebook lost records'
    return body


# ---------------------------------------------------------------- INSIGHTS
def hbar_stack(rows, series, total_label, link, uid, pct=True):
    return _both(_hbar_stack, rows, series, total_label, link, uid, pct)


def _hbar_stack(rows, series, total_label, link, uid, pct=True, W=640, LW=168, narrow=False):
    """rows: [(label, key, {series: n})]; series: [(id, name, colour)]. One axis (share or count), legend + table."""
    RH, G = 30, 2
    mx = max(sum(v.values()) for _, _, v in rows) or 1
    out = [f'<svg class="chart" viewBox="0 0 {W} {len(rows) * RH + 26}" role="img" aria-labelledby="{uid}-t {uid}-d">']
    for t in (0, .25, .5, .75, 1):
        x = LW + t * (W - LW - 44)
        out.append(f'<line class="grid" x1="{x:.1f}" x2="{x:.1f}" y1="0" y2="{len(rows) * RH}"/>'
                   f'<text class="ax" x="{x:.1f}" y="{len(rows) * RH + 16}" text-anchor="middle">{int(t * 100) if pct else int(t * mx)}{"%" if pct else ""}</text>')
    for i, (lab, key, v) in enumerate(rows):
        y = i * RH + 6; tot = sum(v.values()) or 1; x = LW
        out.append(f'<text class="lb" x="{LW - 10}" y="{y + 13}" text-anchor="end">{e(_clip(lab, 15 if narrow else 24))}</text>')
        span = (W - LW - 44) * (1 if pct else tot / mx)
        for sid, name, col in series:
            n = v.get(sid, 0)
            if not n: continue
            w = span * n / tot
            out.append(f'<a href="{link(key, sid)}"><rect class="bar" x="{x:.1f}" y="{y}" width="{max(w - G, 1):.1f}" height="18" rx="3" fill="{col}">'
                       f'<title>{e(lab)} · {e(name)}: {n} of {tot} ({100 * n / tot:.0f}%)</title></rect></a>')
            x += w
        out.append(f'<text class="vl" x="{x + 6:.1f}" y="{y + 13}">{tot}</text>')
    out.append('</svg>')
    legend = '<ul class="legend">' + ''.join(f'<li><i style="background:{c}"></i>{e(n)}</li>' for _, n, c in series) + '</ul>'
    table = ('<details class="tbl"><summary>Show as a table</summary><table><thead><tr><th scope="col">' + e(total_label) + '</th>' +
             ''.join(f'<th scope="col">{e(n)}</th>' for _, n, _ in series) + '<th scope="col">Total</th></tr></thead><tbody>' +
             ''.join(f'<tr><th scope="row">{e(l)}</th>' + ''.join(f'<td>{v.get(s, 0)}</td>' for s, _, _ in series) + f'<td>{sum(v.values())}</td></tr>' for l, _, v in rows) +
             '</tbody></table></details>')
    return legend + ''.join(out) + table


def hbars(rows, link, uid, unit=''):
    return _both(_hbars, rows, link, uid, unit)


def _hbars(rows, link, uid, unit='', W=640, LW=168, narrow=False):
    """rows: [(label, key, n, colour)] — single series, value labels on every bar end (small n)."""
    RH = 28
    mx = max(n for _, _, n, _ in rows) or 1
    out = [f'<svg class="chart" viewBox="0 0 {W} {len(rows) * RH + 6}" role="img" aria-labelledby="{uid}-t {uid}-d">']
    for i, (lab, key, n, col) in enumerate(rows):
        y = i * RH + 4; w = (W - LW - 70) * n / mx
        out.append(f'<text class="lb" x="{LW - 10}" y="{y + 13}" text-anchor="end">{e(_clip(lab, 15 if narrow else 24))}</text>'
                   f'<a href="{link(key)}"><rect class="bar" x="{LW}" y="{y}" width="{max(w, 2):.1f}" height="18" rx="3" fill="{col}"><title>{e(lab)}: {n}{unit}</title></rect></a>'
                   f'<text class="vl" x="{LW + w + 6:.1f}" y="{y + 13}">{n}{unit}</text>')
    out.append('</svg>')
    table = ('<details class="tbl"><summary>Show as a table</summary><table><tbody>' +
             ''.join(f'<tr><th scope="row">{e(l)}</th><td>{n}{unit}</td></tr>' for l, _, n, _ in rows) + '</tbody></table></details>')
    return ''.join(out) + table


def _clip(s, n):
    return s if len(s) <= n else s[:n - 1].rstrip() + '…'


def _both(fn, *a):
    """Two renders at the real width of each breakpoint so chart text stays ≥ 12 px (CSS shows one)."""
    wide = fn(*a)
    narrow = fn(*a, W=360, LW=104, narrow=True)
    # the legend and the table are identical in both renders: keep them once
    svg = lambda h: re.search(r'<svg class="chart".*?</svg>', h, re.S).group(0)
    return wide.replace(svg(wide), f'<div class="cw">{svg(wide)}</div><div class="cn">{svg(narrow)}</div>')


def card_chart(uid, title, sub, body, foot_=''):
    return (f'<section class="icard" aria-labelledby="{uid}-t"><h2 class="d3" id="{uid}-t">{title}</h2><p class="sub" id="{uid}-d">{sub}</p>'
            f'{body}{f"<p class=fn>{foot_}</p>" if foot_ else ""}</section>')


def insights(page):
    G = f'{page.key}-gallery.html#view=gallery'
    st = page.d['stats']
    k3 = collections.Counter(page.kind3(p) for p in page.places)
    tiles = [('Places', page.N, f'in {len(page.areas)} areas'),
             ('Sights', k3['sight'] + k3['pop'], f'{100 * (k3["sight"] + k3["pop"]) / page.N:.0f}% of the guide'),
             ('Eat & drink', k3['food'], f'{100 * k3["food"] / page.N:.0f}% of the guide'),
             ('Pop culture', k3['pop'], 'sights on the pop-culture trail' if page.pop_ids else 'no pop-culture collection in this city\'s data'),
             ('Named sources', st['sources'], f'{sum(len(p["src"]) for p in page.places)} citations'),
             ('Closed, kept', st['closed'], f'status checked to {page.last}')]
    tiles_h = '<div class="tiles">' + ''.join(f'<div class="tile"><span class="tl">{e(a)}</span><b>{b}</b><span class="ts">{e(c)}</span></div>' for a, b, c in tiles) + '</div>'
    # 1 · mix per area
    ser = [('sight', 'Sights', SER[0]), ('food', 'Eat & drink', SER[1]), ('pop', 'Pop culture', SER[2])]
    if not page.pop_ids: ser = ser[:2]
    rows = [(page.area_short(a), a, collections.Counter(page.kind3(p) for p in lst)) for a, lst in page.by_area.items() if lst]
    rows.insert(0, (f'All of {page.name}', '', k3))
    kq = {'sight': 'k=s', 'food': 'k=f', 'pop': 'c=' + (sorted(page.pop_ids)[0] if page.pop_ids else '')}
    c1 = card_chart('mix', 'What each area is for', f'Share of sights, places to eat and pop-culture places, per area. All {page.N} places counted once; tap a bar to open those places.',
                    hbar_stack(rows, ser, 'Area', lambda a, s: f'{G}{"&amp;a=" + a if a else ""}&amp;{kq[s]}', 'mix'),
                    'Pop culture = sights in the city\'s pop-culture collections; a place counts in one segment only.' if page.pop_ids else 'This city has no pop-culture collection in its data, so the third segment is absent rather than zero-filled.')
    # 2 · source mix per area
    cites = collections.Counter(s for p in page.places for s in p['src'])
    top = [s for s, _ in cites.most_common(5)]
    sser = [(s, page.src_short(s), SER[i]) for i, s in enumerate(top)] + [('_o', 'Other sources', OTHER)]
    srows = []
    for a, lst in page.by_area.items():
        c = collections.Counter()
        for p in lst:
            for s in p['src']: c[s if s in top else '_o'] += 1
        srows.append((page.area_short(a), a, c))
    c2 = card_chart('src', 'Who recommends each area', f'Citations per area by source: the {len(top)} most-cited sources, then all others. A place named by three sources counts three times ({sum(cites.values())} citations over {page.N} places).',
                    hbar_stack(srows, sser, 'Area', lambda a, s: f'{G}&amp;a={a}' + (f'&amp;src={s}' if s != '_o' else ''), 'src'),
                    f'{len(cites)} sources in all. "Added by the guide" marks general-knowledge additions and is never relabelled as sourced.')
    # 3 · density
    drows = []
    for i, (a, lst) in enumerate(page.by_area.items()):
        pin = [p for p in lst if p['pinned']]
        drows.append((page.area_short(a), a, len(lst), page.colors.get(a, '#888')))
    spread = []
    for a, lst in page.by_area.items():
        pin = [p for p in lst if p['pinned'] and p['open']]
        if len(pin) < 2: continue
        c = {'la': sorted(p['la'] for p in pin)[len(pin) // 2], 'ln': sorted(p['ln'] for p in pin)[len(pin) // 2]}
        d = sorted(km(c, p) for p in pin)[len(pin) // 2]
        spread.append((page.area_short(a), a, round(d, 1), page.colors.get(a, '#888')))
    c3 = card_chart('den', 'Where the places are', 'Places per area (bars use each area\'s map colour). Tap to open the area.',
                    hbars(drows, lambda a: f'{G}&amp;a={a}', 'den'))
    c3b = card_chart('spr', 'How far you walk', 'Median straight-line distance from each area\'s middle pin to its open, verified pins. Small = a walkable cluster.',
                     hbars(spread, lambda a: f'{page.key}-atlas.html#view=atlas&amp;a={a}', 'spr', ' km'),
                     f'Computed from {sum(1 for p in page.places if p["pinned"] and p["open"])} open places with a verified pin; straight-line, not walking routes.')
    # 4 · closures
    cl = [p for p in page.places if not p['open']]
    crow = [(page.area_short(a), a, sum(1 for p in lst if not p['open']), '#9b4a3c') for a, lst in page.by_area.items()]
    crow = [r for r in crow if r[2]]
    months = collections.Counter((p.get('pv') or {}).get('checked', '')[:7] for p in page.places)
    mrows = ''.join(f'<tr><th scope="row">{e(m)}</th><td>{n}</td></tr>' for m, n in sorted(months.items()))
    c4 = card_chart('cls', 'Closures, kept for the record', f'{len(cl)} of {page.N} places have closed. They stay in every view, flagged, and never carry a tier.',
                    (hbars(crow, lambda a: f'{G}&amp;a={a}&amp;closed=1', 'cls') if crow else '<p class="empty">No closures on record.</p>') +
                    f'<details class="tbl"><summary>When each place\'s status was last checked</summary><table><tbody>{mrows}</tbody></table></details>')
    # 5 · signature canon
    canon = page.guide.get('canon') or {}
    if canon.get('dishes'):
        dr = [(d['t'], d['t'], d['n'], SER[1]) for d in canon['dishes']]
        named = len({i for d in canon['dishes'] for i in d['ids']})
        c5 = card_chart('can', f'The signature canon: {e(canon["title"])}', f'{canon["n"]} places in the canon\'s cuisines ({canon["open"]} open). Bars count places whose own write-up names the dish.',
                        hbars(dr, lambda t: f'{G}&amp;cz={canon["cz"][0]}', 'can'),
                        f'{named} of {canon["n"]} canon places name one of these dishes; the rest serve the canon cuisine without naming a dish, so they are not counted here.')
    else:
        c5 = card_chart('can', 'The signature canon', 'This city has no food canon in its data yet.', '<p class="empty">Stated, not filled.</p>')
    # 6 · tier ladder
    tser = [(1, 'Must see', SER[5]), (2, 'Worth the detour', SER[0]), (3, 'Deep cut', OTHER)]
    trows = [(page.area_short(a), a, collections.Counter(p['t'] for p in lst if p['open'])) for a, lst in page.by_area.items()]
    c6 = card_chart('tier', 'The tier ladder per area', 'Open places by tier. Tiers are graded within each area, so every area has its own must-sees.',
                    hbar_stack(trows, tser, 'Area', lambda a, t: f'{G}&amp;a={a}&amp;t={t}', 'tier'),
                    f'{len(cl)} closed places carry no tier and are counted in the closures card instead.')
    idx = ''.join(f'<section class="ix"><h3 class="d3"><i style="background:{page.colors.get(a, "#888")}"></i>{e(page.area_short(a))} <span class="meta">{len(lst)}</span></h3><ul>' +
                  ''.join(f'<li {data_attrs(p)} class="ixi"><a href="{page.key}-guidebook.html#p-{e(p["id"])}">{e(p["dn_lat"])}</a>{"" if p["open"] else " <span class=\"flag closed\">Closed</span>"}</li>' for p in lst) +
                  '</ul></section>' for a, lst in page.by_area.items() if lst)
    index_ = f'<section class="icard ixall" aria-labelledby="ix-t"><h2 class="d3" id="ix-t">All {page.N} places</h2><p class="sub">Every place the charts count, by area in rank order. Each opens its entry.</p><div class="ixg">{idx}</div></section>'
    body = (head(page, 'insights', f'{page.name} · Insights — cleo beta mockup') + topbar(page, 'insights') +
            f'''<main id="main" class="ins" data-city="{page.key}"><div class="wrap">
<header class="ins-h"><h1 class="d2">{e(page.name)} in numbers</h1>{countline(page)}
<p class="sub">Every number below is computed from the {page.N} places in this guide. Every chart accounts for all of them, and every bar opens those places in the Gallery.</p></header>
{tiles_h}<div class="igrid">{c1}{c2}{c3}{c3b}{c4}{c5}{c6}</div>{index_}</div></main>''' + foot(page))
    assert body.count('class="ixi"') == page.N, 'insights index lost records'
    return body


# ---------------------------------------------------------------- index
def index(pages):
    rows = ''.join(
        f'<li><b>{e(p.name)}</b> · {p.N} places · ' + ' · '.join(f'<a href="{p.key}-{v}.html#view={v}">{l}</a>' for v, l, _ in VIEWS) +
        f' · <a href="{p.key}-gallery-place.html">Gallery detail</a></li>' for p in pages)
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>View-style mockups</title><link rel="stylesheet" href="{ASSETS}tokens.css"><link rel="stylesheet" href="views.css"></head>
<body><main id="main" class="wrap idx"><h1 class="d2">View-style mockups</h1><p>Static mockups from the real generated records
(<code>beta/data/places/*.json</code>). Spec: <a href="../SPEC.md">SPEC.md</a> · plan: <a href="../PLAN.md">PLAN.md</a>.</p><ul>{rows}</ul></main></body></html>'''


def main():
    os.makedirs(OUT, exist_ok=True)
    keys = sys.argv[1:] or ['tokyo', 'cleveland']
    pages = []
    for key in keys:
        page = Page(key); pages.append(page)
        files = {f'{key}-gallery.html': gallery(page), f'{key}-atlas.html': atlas(page),
                 f'{key}-guidebook.html': guidebook(page), f'{key}-insights.html': insights(page)}
        files[f'{key}-gallery-place.html'], dp = gallery_place(page)
        for fn, h in files.items():
            assert 'document.write' not in h
            open(os.path.join(OUT, fn), 'w').write(h)
        print(f'{key}: {page.N} places in every view · detail = {dp["id"]}')
    open(os.path.join(OUT, 'index.html'), 'w').write(index(pages))
    css = open(os.path.join(HERE, 'views.css')).read()
    open(os.path.join(OUT, 'views.css'), 'w').write(font_css() + '\n' + css)
    open(os.path.join(OUT, 'views.js'), 'w').write(open(os.path.join(HERE, 'views.js')).read())


if __name__ == '__main__':
    main()
