#!/usr/bin/env python3
"""Generate the high-fidelity static mockups for the beta design system (design/beta/mockups/*.html).

    python3 design/beta/tools/make-mockups.py

Read-only over data/ and cleveland.html. Writes design/beta/mockups/ and syncs design/beta/tokens.css →
beta/assets/tokens.css (the shipped copy). Every place, count, source, date and coordinate on a mockup comes
from the real records via mockdata.py — no invented places, photos, ratings, prices, hours or quotes.
City pages render EVERY gated place (no cap) and assert the count against the loader.
"""
import html, json, os, shutil, sys, urllib.parse, collections
sys.path.insert(0, os.path.dirname(__file__))
import mockdata as D
import svgkit as K

ROOT = D.ROOT
OUT = os.path.join(ROOT, 'design', 'beta', 'mockups')
ASSETS = '../../../beta/assets/'
E = lambda s: html.escape(str(s), quote=True)

# ---------- shared tokens sync ----------
SRC_TOK = os.path.join(ROOT, 'design', 'beta', 'tokens.css')
DST_TOK = os.path.join(ROOT, 'beta', 'assets', 'tokens.css')
shutil.copyfile(SRC_TOK, DST_TOK)
assert open(SRC_TOK).read() == open(DST_TOK).read()

# ---------- data ----------
CITIES = {}
def C(key):
    if key not in CITIES:
        CITIES[key] = D.city(key)
    return CITIES[key]

NAMES = {'tokyo': ('Tokyo', '東京', 'Japan'), 'kyoto': ('Kyoto', '京都', 'Japan'), 'osaka': ('Osaka', '大阪', 'Japan'),
         'okinawa': ('Okinawa', '沖縄', 'Japan'), 'hokkaido': ('Hokkaido', '北海道', 'Japan'),
         'cleveland': ('Cleveland', '', 'United States'), 'newyork': ('New York', '', 'United States'),
         'chicago': ('Chicago', '', 'United States')}
SKIN = {'tokyo': 'vermilion', 'kyoto': 'moss', 'osaka': 'neon', 'okinawa': 'lagoon', 'hokkaido': 'glacier',
        'cleveland': 'lake', 'newyork': 'saffron', 'chicago': 'plum'}
UI_CJK = set('東京都日本浅草寺京大阪沖縄北海道')


def area_name(meta, aid, short=True):
    a = next((x for x in meta['areas'] if x['id'] == aid), {'n': aid})
    head, hoods = D.area_split(a['n'])
    return head if short else (head, hoods)


def first_glyph(r):
    for g in r['g']:
        if g not in D.GENERIC and g in D.GLYPH: return D.GLYPH[g]
    for c in r['cz']:
        if c in D.GLYPH: return D.GLYPH[c]
    return 'star4' if 'ICON' in r['g'] else 'compass'


def cuisine_short(meta, r):
    for c in r['cz']:
        n = next((x['n'] for x in meta['cuisines'] if x['id'] == c), '')
        if n: return n.split(' & ')[0].split(',')[0].strip()
    return ''


# ---------- component renderers ----------
def plate(r, meta, num=None, loc=True, big=False):
    color = meta['ac'].get(r['a'], 'var(--city)')
    inner = []
    if num is not None:
        inner.append(f'<span class="num" aria-hidden="true">{num}</span>')
    if r['jp']:
        long = ' long' if len(r['jp']) > 5 else ''
        inner.append(f'<span class="vert native{long}" lang="ja" aria-hidden="true">{E(r["jp"][:7])}</span>')
    else:
        ch = next((c for c in r['n'].replace('The ', '', 1) if c.isalpha()), '·')
        inner.append(f'<span class="ini" aria-hidden="true">{E(ch)}</span>')
    inner.append(f'<span class="glyph">{K.icon(first_glyph(r))}</span>')
    if loc:
        inner.append(f'<svg class="loc" viewBox="0 0 52 40" aria-hidden="true"><use href="#area-{r["a"]}"/>{LOCME.get(r["id"], "")}</svg>')
    cls = 'plate closed' if r['closed'] else 'plate'
    return f'<div class="{cls}" style="--area:{color}">{"".join(inner)}</div>'


def chips(r, n=2, city=''):
    named = [s for s in r['s'] if not s['added']]
    added = [s for s in r['s'] if s['added']]
    named.sort(key=lambda s: not s['auth'])
    out = []
    for s in named[:n]:
        cls = 'src auth' if s['auth'] else 'src'
        note = f' {E(s["note"])}' if s['note'] else ''
        out.append(f'<a class="{cls}" href="#src-{E(s["key"])}" title="Everything {E(s["label"])} recommends{(" in " + city) if city else ""}">{E(s["label"])}{note}</a>')
    if len(named) > n:
        out.append(f'<span class="src more">+{len(named) - n}</span>')
    if added and not named:
        out.append('<span class="src added" title="Added from general knowledge — not from a cited source">Added by the guide</span>')
    return '<span class="by">Recommended by</span>' + ''.join(out) if named else ''.join(out)


def status_line(r):
    if r['closed']:
        when = f', checked {E(r["statusChecked"])}' if r['statusChecked'] else ''
        return f'<span class="status closed">Closed · kept for the record</span>', f'<span class="closed-note">Closed per our status check{when}</span>'
    return '', ''


def card(r, meta, num=None, saved=False, visited=False, why_first=None, href='place-tokyo.html', focus=False, show_area=True, row=False):
    city = NAMES[meta['key']][0]
    aname = area_name(meta, r['a'])
    tag = aname
    cs = cuisine_short(meta, r)
    if cs: tag += f' · {cs}'
    st, note = status_line(r)
    top = st if r['closed'] else K.tier(r['t'], aname)
    native = f'<span class="native" lang="ja">{E(r["jp"])}</span>' if r['jp'] else ''
    cls = 'card' + (' row' if row else '') + (' closed' if r['closed'] else '') + (' is-focus' if focus else '')
    heart = (f'<div class="save"><button class="btn btn-icon" aria-pressed="{"true" if saved else "false"}" '
             f'aria-label="{"Saved" if saved else "Save"} {E(r["n"])}">{K.icon("heart")}</button></div>')
    stamp = '<span class="stamp" aria-label="Been there">Been<br>there</span>' if visited else ''
    extra = f'<p class="xs" style="margin:0;color:var(--city-ink);font-weight:650">{E(why_first)}</p>' if why_first else ''
    return (f'<article class="{cls}" id="p{r["id"]}">{plate(r, meta, num)}<div class="body">'
            f'<div class="top">{top}{"<span class=area-tag>· " + E(tag) + "</span>" if show_area else ""}</div>'
            f'<h3><a href="{href}">{E(r["n"])}</a>{native}</h3>{extra}'
            f'<p class="why">{E(r["w"])}</p>{note}<div class="rec">{chips(r, 2, city)}</div></div>{heart}{stamp}</article>')


def topbar(active='', on_night=False, saved=None, search=True):
    nav = [('Destinations', 'landing.html'), ('Your guide', 'guide-picker.html'), ('Your day', 'day-plan.html'), ('Saved', 'saved.html')]
    links = ''.join(f'<a href="{h}"{" aria-current=page" if a == active else ""}>{a}</a>' for a, h in nav)
    n = f' data-n="{saved}"' if saved else ''
    return (f'<header class="topbar{" on-night" if on_night else ""}"><div class="wrap">'
            f'<a class="brand" href="landing.html" aria-label="Cleo field guides — home"><svg class="mark" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="{K.STAR}"/></svg><b>cleo</b><small>field guides</small></a>'
            f'<nav class="topnav" aria-label="Primary">{links}</nav><span class="spacer"></span>'
            f'<div class="top-actions">{"<a class=\"btn btn-icon\" href=\"#search\" aria-label=\"Search\">" + K.icon("search") + "</a>" if search else ""}'
            f'<a class="btn btn-icon count-dot" href="saved.html" aria-label="Saved places"{n}>{K.icon("heart")}</a></div></div></header>')


def tabbar(active):
    tabs = [('Explore', 'landing.html', 'compass'), ('Saved', 'saved.html', 'heart'), ('Your day', 'day-plan.html', 'day'), ('Guide', 'guide-picker.html', 'guide')]
    return '<nav class="tabbar" aria-label="Sections">' + ''.join(
        f'<a href="{h}"{" aria-current=page" if t == active else ""}>{K.icon(i)}<span>{t}</span></a>' for t, h, i in tabs) + '</nav>'


def footer(totals):
    return (f'<footer class="footer"><div class="wrap"><div class="cols"><div>'
            f'<a class="brand" href="landing.html"><svg class="mark" viewBox="0 0 24 24" aria-hidden="true" style="color:var(--on-night)"><path fill="currentColor" d="{K.STAR}"/></svg><b>cleo</b></a>'
            f'<p style="max-width:40ch;margin:6px 0 0">Field guides with receipts: {totals} places, each one recommended by named sources, pinned to the door and checked open — or flagged closed.</p></div>'
            '<div><h4>Explore</h4><ul><li><a href="landing.html">Destinations</a></li><li><a href="hub-japan.html">Japan</a></li><li><a href="city-cleveland.html">Cleveland</a></li></ul></div>'
            '<div><h4>Plan</h4><ul><li><a href="guide-picker.html">Your guide</a></li><li><a href="day-plan.html">Your day</a></li><li><a href="saved.html">Saved</a></li></ul></div>'
            '<div><h4>Trust</h4><ul><li><a href="#how-we-choose">How we choose</a></li><li><a href="#accessibility">Accessibility</a></li><li><a href="#suggest">Suggest a city</a></li></ul></div></div>'
            '<div class="legal">Live maps use © OpenStreetMap contributors and Esri tiles. Map art on these pages is drawn from our own verified pins. '
            'Source names belong to their publishers and are cited, not endorsed. No ratings, prices or opening hours are shown because we don\'t hold verified ones.</div></div></footer>')


FONT_CSS = ('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400..700'
            '&family=Figtree:wght@400..700&display=swap')


def page(fname, title, body, city=None, theme=None, tab=None, cjk='', extra_css='', desc=''):
    chars = ''.join(sorted(set(c for c in cjk if '　' <= c <= '鿿' or '豈' <= c <= '﫿') | UI_CJK))
    jp = ''
    if chars:
        u = 'https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@500;600&display=swap&text=' + urllib.parse.quote(chars)
        jp = f'<link rel="stylesheet" href="{E(u)}" media="print" onload="this.media=\'all\'">'
    th = f' data-theme="{theme}"' if theme else ''
    doc = (f'<!doctype html><html lang="en"{th}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
           f'<title>{E(title)}</title><meta name="description" content="{E(desc or title)}">'
           f'<meta name="robots" content="noindex"><!-- design mockup: design/beta — generated by design/beta/tools/make-mockups.py -->'
           f'<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
           f'<link rel="stylesheet" href="{FONT_CSS}" media="print" onload="this.media=\'all\'">{jp}'
           f'<link rel="stylesheet" href="{ASSETS}tokens.css"><link rel="stylesheet" href="{ASSETS}constellation.css">'
           f'<style>{extra_css}</style></head>'
           f'<body class="{"has-tabbar" if tab else ""}"{(" data-city=" + city) if city else ""}>{K.sprite()}{AREADEFS.get(city, "")}'
           f'<a class="skip" href="#main">Skip to places</a>{body}{tabbar(tab) if tab else ""}</body></html>')
    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, fname), 'w') as f:
        f.write(doc)
    return fname


AREADEFS, LOCME = {}, {}
def build_area_defs(key):
    """Per-area locator symbols (dots of that area's verified pins) + each record's highlight dot."""
    meta, recs = C(key)
    syms = []
    for a in meta['areas']:
        rs = [r for r in recs if r['a'] == a['id']]
        if not rs: continue
        P = K.Proj([(r['lat'], r['lng']) for r in rs], 52, 40, pad=.12, clip=.04)
        dots = ''.join(f'<circle class="d" cx="{x:.1f}" cy="{y:.1f}" r="1.2"/>' for x, y in (P(r['lat'], r['lng']) for r in rs) if P.inside(x, y))
        syms.append(f'<symbol id="area-{a["id"]}" viewBox="0 0 52 40">{dots}</symbol>')
        for r in rs:
            x, y = P(r['lat'], r['lng']); x = min(max(x, 4), 48); y = min(max(y, 4), 36)
            LOCME[r['id']] = f'<circle class="me" cx="{x:.1f}" cy="{y:.1f}" r="3.4"/>'
    AREADEFS[key] = f'<svg width="0" height="0" style="position:absolute" aria-hidden="true">{"".join(syms)}</svg>'


# ---------- page builders ----------
def masthead(key, crumbs, extra=''):
    meta, recs = C(key)
    name, native, country = NAMES[key]
    nat = f'<span class="native" lang="ja">{native}</span>' if native else ''
    sky = K.constellation(recs, 1440, 300, f'mh{key}', clip=.05, pad=.06)
    cr = K.icon('chev-r', 'ico sm hide-m').join(f'<a href="{h}"{" class=hide-m" if i < len(crumbs) - 1 else ""}>{E(t)}</a>' for i, (t, h) in enumerate(crumbs))
    facts = (f'<b>{meta["n"]} places</b> · {meta["sights"]} sights · {meta["food"]} to eat &amp; drink · {len(meta["areas"])} areas. '
             f'<span class="short">All sourced, pinned and status-checked. </span>'
             f'<span class="long">Every one recommended by named sources, pinned to the door and status-checked'
             f'{" (last check " + meta["lastChecked"] + ")" if meta["lastChecked"] else ""}. </span>'
             f'<a href="#how-we-choose">How we choose</a>')
    return (f'<section class="masthead" aria-labelledby="cityname"><div class="sky">{sky}</div><div class="inner">'
            f'<nav class="crumbs" aria-label="Breadcrumb">{cr}</nav>'
            f'<div class="title"><h1 class="d1" id="cityname">{name}</h1>{nat}</div><p class="facts">{facts}</p>{extra}</div>'
            f'<span class="accentbar"></span></section>')


def coll_tile(title, n, glyph, kind='', href='#', sky='', badge='', src_mono=''):
    if kind == 'src':   # attribution as navigation: a source is a collection of everything it recommends
        return (f'<a class="coll by-src" href="{href}"><span class="glyph" aria-hidden="true">{E(src_mono)}</span>'
                f'<span class="kicker">Everything recommended by</span><span class="t">{E(title)}</span><span class="n">{n} place{"" if n == 1 else "s"}</span></a>')
    g = f'<span class="glyph">{K.icon(glyph)}</span>'
    b = f'<span class="badge">{badge}</span>' if badge else ''
    s = f'<div class="sky">{sky}</div>' if sky else ''
    return f'<a class="coll {kind}" href="{href}">{s}{b}{g}<span class="t">{E(title)}</span><span class="n">{n} place{"" if n == 1 else "s"}</span></a>'


def src_count(recs, key_pred):
    return sum(1 for r in recs if any(key_pred(s['key']) for s in r['s']))


def city_rail(key):
    meta, recs = C(key)
    tiles = []
    gz = collections.Counter(g for r in recs for g in r['g'])
    star = [c for c in meta['cats'] if c['n'].startswith('★')]
    for c in star:
        sub = [r for r in recs if c['id'] in r['g']]
        tiles.append(coll_tile(c['n'].replace('★', '').strip(), len(sub), D.GLYPH.get(c['id'], 'star4'), 'sig', '#coll-' + c['id'],
                               sky=K.constellation(sub, 236, 196, 'sig' + c['id'], clip=.04, lines=False, glow=False, bg=False), badge='★ Signature'))
    if key == 'cleveland':
        n5 = [r for r in recs if any(s['key'] == 'N5' for s in r['s'])]
        tiles.append(coll_tile("News 5's hidden gems", len(n5), 'star4', 'sig', '#src-N5',
                               sky=K.constellation(n5, 236, 196, 'sigN5', clip=.04, lines=False, glow=False, bg=False), badge='★ Signature'))
        tsg = src_count(recs, lambda k: k == 'TSG')
        tiles.append(coll_tile('There She Goes Again', tsg, '', 'src', '#src-TSG', src_mono='T'))
        cz = collections.Counter(c for r in recs for c in r['cz'])
        for c in meta['cuisines']:
            if cz[c['id']]:
                tiles.append(coll_tile(c['n'], cz[c['id']], D.GLYPH.get(c['id'], 'forkknife'), '', '#cz-' + c['id']))
        ao = src_count(recs, lambda k: k.startswith('AO_'))
        tiles.insert(3, coll_tile('Atlas Obscura', ao, '', 'src', '#src-AO', src_mono='A'))
    else:
        for c in meta['cats']:
            if c['n'].startswith('★') or not gz[c['id']] or c['id'] in ('POP',): continue
            tiles.append(coll_tile(c['n'], gz[c['id']], D.GLYPH.get(c['id'], 'star4'), '', '#coll-' + c['id']))
            if len(tiles) == 4:
                bib = src_count(recs, lambda k: k == 'MICHELIN_BIB')
                tiles.append(coll_tile('Michelin Bib Gourmand', bib, '', 'src', '#src-MICHELIN_BIB', src_mono='M'))
                to = src_count(recs, lambda k: k == 'TIMEOUT')
                tiles.append(coll_tile('Time Out', to, '', 'src', '#src-TIMEOUT', src_mono='T'))
    tiles.append(f'<a class="coll all" href="#all"><span class="glyph">{K.icon("list")}</span><span class="t">Show all</span><span class="n">{meta["n"]} places</span></a>')
    return ''.join(tiles)


def city_page(key, fname):
    meta, recs = C(key)
    name = NAMES[key][0]
    build_area_defs(key)
    seg = (f'<div class="seg" role="tablist" aria-label="What to show"><button role="tab" aria-selected="true">All <span class="n">{meta["n"]}</span></button>'
           f'<button role="tab" aria-selected="false">Sights <span class="n">{meta["sights"]}</span></button>'
           f'<button role="tab" aria-selected="false">Eat &amp; drink <span class="n">{meta["food"]}</span></button></div>')
    rail = (f'<section class="wrap section" style="padding-top:18px" aria-label="Collections"><div class="rail-head">{seg}'
            f'<div class="rail-arrows"><button class="btn btn-icon btn-ghost" aria-label="Previous collections">{K.icon("chev-l")}</button>'
            f'<button class="btn btn-icon btn-ghost" aria-label="Next collections">{K.icon("chev-r")}</button></div></div>'
            f'<div class="rail" style="margin-top:14px">{city_rail(key)}</div></section>')
    toolbar = (f'<div class="toolbar"><div class="wrap"><div class="row">'
               f'<label class="search compact"><span class="vh">Search {name}</span>{K.icon("search")}<input type="search" placeholder="Search {name} — places, dishes, sources"></label>'
               f'<button class="btn btn-ghost">{K.icon("pin")}<span class="lbl">Area</span></button>'
               f'<button class="btn btn-ghost">{K.icon("sliders")}<span class="lbl">Filters</span></button>'
               f'<a class="btn btn-primary map-toggle" href="map-sheet.html" aria-label="Show map">{K.icon("map")}</a></div></div></div>')
    # list, grouped by area chapter — EVERY gated place
    chapters, shown, numbered_first = [], 0, []
    for ai, a in enumerate(meta['areas']):
        rs = D.order([r for r in recs if r['a'] == a['id']])
        if not rs: continue
        head, hoods = D.area_split(a['n'])
        color = meta['ac'].get(a['id'], '#999')
        shape = K.mini_shape(rs, cls='shape')
        cards = ''.join(card(r, meta, num=i + 1, href='place-tokyo.html' if key == 'tokyo' else '#') for i, r in enumerate(rs))
        if key == 'cleveland' and a['id'] == 'UC':
            ana = next(r for r in recs if r['n'] == 'Anatolia Cafe')
            quote = ana['k'].split('On Persian specifically:')[1].strip()
            cards += (f'<aside class="gap" aria-label="Stated gap"><span class="eyebrow">Stated gap · Persian</span>'
                      f'<p class="d3">No Persian restaurant in Cleveland meets the bar.</p><p>“{E(quote)}”</p>'
                      f'<a class="sm" href="#p{ana["id"]}" style="font-weight:650">See Anatolia Cafe →</a></aside>')
        chapters.append(f'<section aria-labelledby="ar-{a["id"]}"><div class="area-head"><span class="eyebrow"><i style="background:{color}"></i>Area {ai + 1} of {len(meta["areas"])} · {len(rs)} places</span>'
                        f'<h2 class="d2" id="ar-{a["id"]}">{E(head)}</h2>{shape}<p class="hoods">{E(hoods)}</p></div>'
                        f'<p class="order-note">Numbered to match the map. Ordered by tier, then by number of named sources — not a popularity ranking. Closed places sit last, flagged.</p>'
                        f'<div class="cards">{cards}</div></section>')
        shown += len(rs)
        if not numbered_first: numbered_first = rs
    assert shown == meta['n'] == len(recs), f'{key}: rendered {shown} of {len(recs)} places'
    first = meta['areas'][0]['id']
    fr = [r for r in recs if r['a'] == first]
    num = [(i + 1, r) for i, r in enumerate(D.order(fr))]
    marts = K.mapart_pair(recs, fr, meta['ac'], desk=(540, 740), uid='city', numbered=num, sel=num[0][1]['id'])
    mappane = (f'<aside class="mappane" aria-label="Map"><div class="mapart">{marts}</div>'
               f'<div class="map-chip"><span class="pill" aria-pressed="true"><span class="swatch" style="background:{meta["ac"].get(first)}"></span>{E(area_name(meta, first))} · {len(fr)}</span></div>'
               f'<div class="map-ctrls"><button class="btn btn-icon" aria-label="Zoom in">{K.icon("plus")}</button><button class="btn btn-icon" aria-label="Zoom out"><svg class="ico" aria-hidden="true"><path d="M5 12h14"/></svg></button>'
               f'<button class="btn btn-icon" aria-label="Near me">{K.icon("compass")}</button></div>'
               f'<div class="map-credit">Map art from our verified pins · live map © OpenStreetMap contributors · Esri</div></aside>')
    result = (f'<p class="resultline">Showing <b>all {meta["n"]}</b> places in {meta_len_areas(meta)} areas'
              f'{" · " + str(meta["closed"]) + " closed, kept for the record" if meta["closed"] else ""}.</p>')
    body = (topbar('Destinations', saved=3, search=False) + f'<main id="main">' + masthead(key, [('All destinations', 'landing.html'), (NAMES[key][2], 'hub-japan.html' if NAMES[key][2] == 'Japan' else 'landing.html')])
            + rail + toolbar + f'<div class="wrap"><div class="split"><div class="listpane">{result}{"".join(chapters)}</div>{mappane}</div></div>'
            + how_we_choose(meta) + '</main>'
            + footer(TOTALS))
    cjk = ''.join(r['jp'] for r in recs)
    return page(fname, f'{name} — Cleo field guide (beta mockup)', body, city=key, tab='Explore', cjk=cjk,
                desc=f'{meta["n"]} sourced places in {name}')


def meta_len_areas(meta):
    return len(meta['areas'])


def how_we_choose(meta):
    return (f'<section class="wrap section" id="how-we-choose" aria-labelledby="hwc"><div class="rail-head"><h2 class="d2" id="hwc">How we choose</h2></div>'
            f'<div class="trust">'
            f'<div class="t">{K.icon("seal")}<div><b>Recommended by name</b><p>Every place needs two credible named sources — or one Michelin or James Beard listing. Review sites can measure popularity; they never count as a recommender.</p></div></div>'
            f'<div class="t">{K.icon("pin")}<div><b>Pinned to the door</b><p>Each pin is read from an official site, OpenStreetMap or Wikipedia coordinates, graded for confidence and dated. {meta["notOnMap"] or "No"} researched places still wait for a verified pin, so they are not shown yet.</p></div></div>'
            f'<div class="t">{K.icon("check")}<div><b>Checked open — or flagged closed</b><p>Status is verified against a real source and dated. Closed places stay, clearly marked, so the record stays honest.</p></div></div></div>'
            f'<div style="display:flex;gap:18px;flex-wrap:wrap;margin-top:18px;align-items:center">'
            f'{K.tier(1)}<span class="sm muted">the standouts in their own area</span>{K.tier(2)}<span class="sm muted">worth crossing town for</span>{K.tier(3)}<span class="sm muted">for the curious</span></div></section>')


def city_tile(key, size=''):
    meta, recs = C(key)
    name, native, _ = NAMES[key]
    sky = K.constellation(recs, 420, 220 if size == 'lg' else 150, 't' + key, clip=.05, pad=.1, glow=True)
    nat = f'<span class="native" lang="ja">{native}</span>' if native else ''
    star = [c for c in meta['cats'] if c['n'].startswith('★')]
    starline = ''
    if star:
        n = sum(star[0]['id'] in r['g'] for r in recs)
        starline = f'<span class="star">{K.icon("star4", "ico sm")}{E(star[0]["n"].replace("★", "").strip())} · {n}</span>'
    elif key == 'cleveland':
        n5 = sum(any(s['key'] == 'N5' for s in r['s']) for r in recs)
        starline = f'<span class="star">{K.icon("star4", "ico sm")}News 5\'s 100 hidden gems · {n5}</span>'
    canon = canon_line(key)
    href = {'tokyo': 'city-tokyo.html', 'cleveland': 'city-cleveland.html'}.get(key, '#')
    return (f'<a class="tile {size} skin-{SKIN[key]}" href="{href}"><div class="art">{sky}{nat}<span class="bar"></span></div>'
            f'<div class="txt"><h3>{name}</h3><span class="counts"><b>{meta["n"]}</b> places · {meta["sights"]} sights · {meta["food"]} to eat &amp; drink</span>'
            f'<span class="canon">{"".join("<span>" + E(c) + "</span>" for c in canon)}</span>{starline}</div></a>')


def canon_line(key):
    """Signature line derived from the data (city-unique food canon first), never hand-written marketing."""
    meta, recs = C(key)
    cz = collections.Counter(c for r in recs if r['kind'] == 'food' for c in r['cz'])
    short = lambda s: s.split(' & ')[0].split(',')[0].split('(')[0].strip()
    if NAMES[key][2] == 'Japan':
        generic = {'FINE', 'INT', 'SAKE', 'MKT', 'CAFE'}
        ids = [c for c, _ in cz.most_common() if c not in generic][:3]
        return [short(next(x['n'] for x in meta['cuisines'] if x['id'] == i)) for i in ids]
    return [short(c['n']) for c in meta['cuisines'] if cz[c['id']] >= 4][:3]


TOTALS, NMAPS = '0', 0
def compute_totals():
    """Sum of gated places over every dataset-built map + Cleveland (Singapore/Vietnam engine pages not counted,
    so the claim 'N places across M maps' stays exactly true)."""
    global TOTALS, NMAPS
    n = 0; maps = 0
    for f in sorted(os.listdir(os.path.join(ROOT, 'data'))):
        if f.endswith('.dataset.json'):
            k = f[:-len('.dataset.json')]
            m, _ = C(k)
            if m['n']: n += m['n']; maps += 1
    n += C('cleveland')[0]['n']; maps += 1
    TOTALS, NMAPS = f'{n:,}', maps


# ---------- pages ----------
def landing():
    keys = ['tokyo', 'kyoto', 'cleveland', 'newyork', 'osaka', 'chicago']
    for k in keys: C(k)
    tm, tr = C('tokyo'); cm, cr = C('cleveland')
    anime = [r for r in tr if 'ANIME' in r['g']]
    bib = [r for r in tr if any(s['key'] == 'MICHELIN_BIB' for s in r['s'])]
    n5 = [r for r in cr if any(s['key'] == 'N5' for s in r['s'])]
    km, kr = C('kyoto')
    kstar = [c for c in km['cats'] if c['n'].startswith('★')]
    feat = K.constellation(tr, 560, 600, 'hero', clip=.05, pad=.08)
    bg = K.constellation(tr, 900, 1200, 'herobg', clip=.05, pad=.0, lines=True)
    hero = (f'<section class="hero" aria-labelledby="h"><div class="sky m-only">{bg}</div><div class="inner hero-grid"><div>'
            f'<p class="kicker">Field guides with receipts</p>'
            f'<h1 class="d-hero" id="h">Go where the people who <em>know</em> would go.</h1>'
            f'<p class="sub">Temples and tasting counters, anime pilgrimages and pierogi — {TOTALS} places across {NMAPS} city maps, each recommended by named sources, pinned to the door and checked open.</p>'
            f'<form class="search" role="search" action="#"><span class="vh">Search destinations, places and dishes</span>{K.icon("search")}'
            f'<input type="search" placeholder="Where to? A city, a dish, a shrine…" aria-label="Search"><button class="btn btn-primary" type="submit">Search</button></form></div>'
            f'<a class="feature skin-vermilion" href="city-tokyo.html" aria-label="Featured: Tokyo, {tm["n"]} places"><div class="fsky">{feat}</div>'
            f'<span class="fk">Featured map</span><span class="fn"><span class="d2">Tokyo</span> <span class="native" lang="ja">東京</span></span>'
            f'<span class="fc">{tm["n"]} verified pins, drawn as stars · lines join each ward\'s must-sees</span></a></div></section>')
    interests = [('History &amp; landmarks', 'columns', 'Temples, castles, museums, monuments'),
                 ('Food &amp; drink', 'bowl', "Each city's own canon first — ramen, pierogi, the Polish Boy"),
                 ('Pop culture', 'bubble', 'Anime pilgrimages, film sets, oddities')]
    guide = ('<section class="wrap section" aria-labelledby="g"><div class="rail-head"><div><span class="eyebrow">Your guide</span><h2 class="d2" id="g">Who\'s showing you around?</h2></div>'
             '<a class="more" href="guide-picker.html">Set up →</a></div><p class="intro">Pick what you love. Your guide puts it first in every city — and never hides a place.</p>'
             '<div class="tiles">' + ''.join(f'<a class="interest" href="guide-picker.html" aria-pressed="false"><span class="glyph">{K.icon(g)}</span><span><b>{t}</b><span class="d">{d}</span></span><span class="tick">{K.icon("plus", "ico sm")}</span></a>' for t, g, d in interests) + '</div></section>')
    countries = ['United States', 'Japan', 'Singapore', 'Vietnam', 'Belgium', 'Germany']
    dest = ('<section class="wrap section" aria-labelledby="d"><div class="rail-head"><h2 class="d2" id="d">Destinations</h2><a class="more" href="hub-japan.html">All Japan →</a></div>'
            '<div class="countries" role="tablist" aria-label="Country">' + ''.join(f'<button class="pill" role="tab" aria-pressed="{"true" if c == "Japan" else "false"}">{c}</button>' for c in countries) + '</div>'
            f'<div class="tiles" style="margin-top:14px">{"".join(city_tile(k) for k in keys)}</div>'
            f'<p class="xs muted" style="margin-top:10px">Counts are computed from the data at build time — never typed by hand.</p></section>')
    sig = ('<section class="wrap section" aria-labelledby="s"><div class="rail-head"><div><span class="eyebrow">Signature collections</span><h2 class="d2" id="s">Only here, and well sourced</h2></div></div><div class="rail">'
           + f'<span class="skin-vermilion">{coll_tile("Anime, manga & pop culture · Tokyo", len(anime), "bubble", "sig", "city-tokyo.html", sky=K.constellation(anime, 236, 196, "ls1", lines=False, glow=False, bg=False), badge="★ Signature")}</span>'
           + f'<span class="skin-lake">{coll_tile("News 5′s hidden gems · Cleveland", len(n5), "star4", "sig", "city-cleveland.html", sky=K.constellation(n5, 236, 196, "ls2", lines=False, glow=False, bg=False), badge="★ Signature")}</span>'
           + (f'<span class="skin-moss">{coll_tile(kstar[0]["n"].replace("★", "").strip() + " · Kyoto", sum(kstar[0]["id"] in r["g"] for r in kr), D.GLYPH.get(kstar[0]["id"], "star4"), "sig", "#", badge="★ Signature")}</span>' if kstar else '')
           + coll_tile('Michelin Bib Gourmand · Tokyo', len(bib), '', 'src', 'city-tokyo.html', src_mono='M')
           + coll_tile('Free to visit · Tokyo', sum('FREE' in r['g'] for r in tr), 'ticket', '', 'city-tokyo.html')
           + '</div></section>')
    hwc = ('<section class="wrap section" id="how-we-choose" aria-labelledby="hw"><div class="rail-head"><h2 class="d2" id="hw">Why trust a Cleo pick</h2></div><div class="trust">'
           f'<div class="t">{K.icon("seal")}<div><b>Recommended by name</b><p>Two credible named sources per place — or one Michelin or James Beard listing. Tap any source to see everything it recommends.</p></div></div>'
           f'<div class="t">{K.icon("pin")}<div><b>Pinned to the door</b><p>Each coordinate carries its source, confidence and date. A pin we can\'t verify doesn\'t go on the map.</p></div></div>'
           f'<div class="t">{K.icon("check")}<div><b>Checked open, or flagged closed</b><p>Every status is dated and sourced. No “trending”, no fake scarcity, no ratings we didn\'t earn.</p></div></div></div></section>')
    css = ('.hero-grid{display:grid;gap:24px;align-items:center}.feature{display:none}.hero .m-only{opacity:.55}'
           '.feature{position:relative;border-radius:var(--r-l);overflow:hidden;text-decoration:none;color:var(--on-night);box-shadow:var(--e-4);border:1px solid rgba(255,255,255,.12);isolation:isolate;min-height:460px}'
           '.feature .fsky{position:absolute;inset:0;z-index:-1}.feature .fsky svg{width:100%;height:100%}'
           '.feature .fk{position:absolute;top:18px;left:20px;font-size:12.5px;font-weight:650;padding:5px 10px;border-radius:var(--r-pill);background:rgba(255,255,255,.12)}'
           '.feature .fn{position:absolute;left:20px;bottom:44px;display:flex;align-items:baseline;gap:10px}.feature .fn .native{font-size:22px;color:var(--on-night-2)}'
           '.feature .fc{position:absolute;left:20px;right:20px;bottom:18px;font-size:12.5px;color:var(--on-night-2)}'
           '.feature::after{content:"";position:absolute;left:0;right:0;bottom:0;height:4px;background:var(--city)}'
           '@media(max-width:899px){.hero .d-hero{font-size:40px}.hero .inner{padding-bottom:22px}}'
           '@media(min-width:900px){.hero-grid{grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:56px}.feature{display:block}.hero .m-only{display:none}}')
    body = topbar('Destinations', on_night=True) + '<main id="main">' + hero + dest + sig + guide + hwc + '</main>' + footer(TOTALS)
    return page('landing.html', 'Cleo — field guides with receipts (beta mockup)', body, tab='Explore', cjk='東京京都大阪', extra_css=css)


def hub_japan():
    keys = ['tokyo', 'kyoto', 'osaka', 'okinawa', 'hokkaido']
    allr = []
    for k in keys: allr += C(k)[1]
    n = len(allr)
    sky = K.constellation(allr, 1440, 360, 'jp', clip=.01, lines=False, pad=.04)
    head = (f'<section class="masthead" aria-labelledby="cn"><div class="sky">{sky}</div><div class="inner" style="padding-top:20px;padding-bottom:22px">'
            f'<nav class="crumbs" aria-label="Breadcrumb"><a href="landing.html">All destinations</a></nav>'
            f'<div class="title"><h1 class="d1" id="cn">Japan</h1><span class="native" lang="ja">日本</span></div>'
            f'<p class="facts"><b>{len(keys)} maps · {n:,} places</b> — Tokyo ward by ward, Kyoto, Osaka, Okinawa and Hokkaido. Every place sourced, pinned and status-checked.</p></div><span class="accentbar" style="background:var(--city)"></span></section>')
    tiles = f'<div class="tiles">{city_tile("tokyo", "lg")}{"".join(city_tile(k) for k in keys[1:])}</div>'
    sigs = []
    for k in keys:
        m, rs = C(k)
        for c in m['cats']:
            if c['n'].startswith('★'):
                sub = [r for r in rs if c['id'] in r['g']]
                sigs.append(f'<span class="skin-{SKIN[k]}">{coll_tile(c["n"].replace("★", "").strip() + " · " + NAMES[k][0], len(sub), D.GLYPH.get(c["id"], "star4"), "sig", "#", sky=K.constellation(sub, 236, 196, "hs" + k, lines=False, glow=False, bg=False), badge="★ Signature")}</span>')
    body = (topbar('Destinations', saved=3) + '<main id="main">' + head
            + f'<section class="wrap section" style="padding-top:16px" aria-label="Cities in Japan">{tiles}</section>'
            + ('<section class="wrap section" aria-labelledby="sj"><div class="rail-head"><h2 class="d2" id="sj">Signature collections in Japan</h2></div><div class="rail">' + ''.join(sigs) + '</div></section>' if sigs else '')
            + '<section class="wrap section" aria-labelledby="oc"><div class="rail-head"><h2 class="d2" id="oc">Elsewhere in Cleo</h2></div><div class="countries">'
            + ''.join(f'<a class="pill" href="landing.html">{c}</a>' for c in ['United States', 'Singapore', 'Vietnam', 'Belgium', 'Germany']) + '</div></section>'
            + '</main>' + footer(TOTALS))
    return page('hub-japan.html', 'Japan — Cleo field guides (beta mockup)', body, city='tokyo', tab='Explore', cjk='日本東京京都大阪沖縄北海道')


def place_detail():
    meta, recs = C('tokyo')
    build_area_defs('tokyo')
    r = next(x for x in recs if x['n'] == 'Sensō-ji')
    area = [x for x in recs if x['a'] == r['a']]
    aname = area_name(meta, r['a'])
    art = K.mapart_pair(recs, [x for x in area if D.hav(x, r) < 1.2], meta['ac'], desk=(1280, 340), mob=(390, 220), uid='hp', numbered=[(1, r)], sel=r['id'], pad=.12)
    near = sorted((x for x in recs if x['id'] != r['id'] and not x['closed']), key=lambda x: D.hav(x, r))[:4]
    cats = {c['id']: c['n'] for c in meta['cats']}
    coll = ''.join(f'<a class="pill" href="city-tokyo.html#coll-{g}">{K.icon(D.GLYPH.get(g, "star4"))}{E(cats.get(g, g).replace("★", "").strip())}</a>' for g in r['g'])
    look = ''.join(f'<span class="tag">{E(t.strip())}</span>' for t in r['k'].split(','))
    voice = (f'<div class="note"><span class="eyebrow">Your guide\'s note</span><p>{E(r["k"])}</p></div>' if r['prose'] else
             f'<div><h2 class="section-t">Look for</h2><div class="lookfor">{look}</div></div>')
    srcs = []
    for s in r['s']:
        cnt = src_count(recs, lambda k, kk=s['key']: k == kk)
        dom = urllib.parse.urlparse(s['url']).netloc.replace('www.', '') if s['url'] else ''
        srcs.append(f'<li class="{"auth" if s["auth"] else ""}"><span class="mono" aria-hidden="true">{E(s["label"][0])}</span>'
                    f'<span><span class="nm">{E(s["label"])}</span><span class="ttl">{E(dom)}</span>'
                    f'<a class="sm" href="city-tokyo.html#src-{s["key"]}" style="font-weight:650;color:var(--city-ink)">All {cnt} Tokyo picks citing {E(s["label"])} →</a></span>'
                    f'<a class="go" href="{E(s["url"])}" rel="noopener" aria-label="Read {E(s["label"])} on {E(dom)}">Read {K.icon("external", "ico sm")}</a></li>')
    amap = f'https://maps.apple.com/?q={urllib.parse.quote(r["n"])}&ll={r["lat"]},{r["lng"]}'
    osm = f'https://www.openstreetmap.org/?mlat={r["lat"]}&mlon={r["lng"]}#map=18/{r["lat"]}/{r["lng"]}'
    gdir = f'https://www.google.com/maps/dir/?api=1&destination={r["lat"]},{r["lng"]}'
    aside = (f'<div class="aside"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:6px">'
             f'<button class="btn btn-primary" aria-pressed="false">{K.icon("heart")} Save</button><button class="btn btn-ghost">{K.icon("plus")} Add to day</button></div>'
             f'<div class="fact">{K.icon("pin")}<div><b>{E(r["ad"])}</b><div class="links"><a class="btn btn-ghost" href="{E(gdir)}">{K.icon("directions")} Directions</a>'
             f'<a class="btn btn-quiet" href="{E(amap)}">Apple Maps</a><a class="btn btn-quiet" href="{E(osm)}">OpenStreetMap</a></div></div></div>'
             f'<div class="fact">{K.icon("check")}<div><b>Open</b><span class="muted">Per {E(r["statusSource"])} · checked {E(r["statusChecked"])}</span></div></div>'
             f'<div class="fact">{K.icon("compass")}<div><b>Pinned to the door · {E(r["conf"])} confidence</b><span class="muted">{E(r["geoSource"])} · verified {E(r["verified"])}</span></div></div>'
             f'<div class="fact">{K.icon("info")}<div><b>Hours &amp; prices</b><span class="muted">Not in our data — check the official site before you go.</span></div></div></div>')
    body = (topbar('Destinations', saved=3) + '<main id="main" class="detail-page"><div class="sheet-chrome"><span class="grab"></span>'
            f'<a class="btn btn-icon close" href="city-tokyo.html" aria-label="Close">{K.icon("close")}</a></div>'
            f'<article class="detail wrap"><nav class="crumbs-d sm muted" aria-label="Breadcrumb"><a href="city-tokyo.html">Tokyo</a> / <a href="city-tokyo.html#ar-TAITO">{E(aname)}</a> / {E(r["n"])}</nav>'
            f'<div class="hero-plate" style="--area:{meta["ac"][r["a"]]}"><div class="map mapart" style="background:transparent">{art}</div><span class="vert" lang="ja" aria-hidden="true">{E(r["jp"])}</span></div>'
            f'<div class="layout"><div class="content" style="padding-left:0;padding-right:0">'
            f'<div class="badges">{K.tier(1, aname, "lg")}<span class="xs muted">in {E(aname)}</span><span class="status open">{K.icon("check", "ico sm")} Open · checked {E(r["statusChecked"])}</span></div>'
            f'<h1 class="d1">{E(r["n"])}<span class="native" lang="ja">{E(r["jp"])}</span></h1>'
            f'<p class="why">{E(r["w"])}</p>{voice}'
            f'<div><h2 class="section-t">In collections</h2><div class="lookfor">{coll}</div></div>'
            f'<div><h2 class="section-t">Recommended by</h2><ul class="srclist">{"".join(srcs)}</ul></div>'
            f'<div class="mobile-aside">{aside}</div>'
            f'<div><h2 class="section-t">Close by</h2><p class="xs muted" style="margin:0 0 10px">Straight-line distance from {E(r["n"])}.</p><div class="cards">'
            + ''.join(card(x, meta, why_first=f'{D.hav(x, r) * 1000:.0f} m away' if D.hav(x, r) < 1 else f'{D.hav(x, r):.1f} km away') for x in near)
            + f'</div></div></div><div class="desk-aside">{aside}</div></div></article></main>'
            + f'<div class="actions sheet-actions"><button class="btn btn-icon btn-ghost" aria-label="Save">{K.icon("heart")}</button>'
            f'<a class="btn btn-ghost" href="day-plan.html">{K.icon("plus")} Add to day</a><a class="btn btn-primary" href="{E(gdir)}">{K.icon("directions")} Directions</a></div>'
            + footer(TOTALS))
    css = ('.crumbs-d{padding:14px 0 10px}.crumbs-d a{color:var(--ink-2);text-decoration:none}'
           '.sheet-chrome{display:none}.mobile-aside{display:none}.sheet-actions{display:none}'
           '@media(max-width:899px){body{background:var(--night)}.topbar{display:none}main.detail-page{background:var(--surface);border-radius:var(--r-l) var(--r-l) 0 0;margin-top:24px;position:relative;box-shadow:var(--e-3)}'
           '.sheet-chrome{display:block;height:20px}.sheet-chrome .grab{display:block;width:40px;height:5px;border-radius:3px;background:var(--line-strong);margin:0 auto;transform:translateY(8px)}'
           '.sheet-chrome .close{position:absolute;right:10px;top:10px;z-index:5;background:var(--surface);border:1px solid var(--line)}'
           '.detail.wrap{padding:0}.crumbs-d{padding:10px var(--gutter)}.detail .hero-plate{margin:0}.detail .content{padding:18px var(--gutter)!important}'
           '.desk-aside{display:none}.mobile-aside{display:block}.mobile-aside .aside>div:first-child{display:none!important}'
           '.sheet-actions{display:grid;position:fixed;left:0;right:0;bottom:0;z-index:50;grid-template-columns:auto 1fr 1.2fr;gap:8px;padding:12px var(--gutter) calc(12px + env(safe-area-inset-bottom));background:color-mix(in srgb,var(--surface) 94%,transparent);backdrop-filter:blur(12px);border-top:1px solid var(--line)}'
           'body.has-tabbar .tabbar{display:none}body{padding-bottom:84px}.footer{display:none}}')
    return page('place-tokyo.html', f'{r["n"]} — Tokyo · Cleo (beta mockup)', body, city='tokyo', tab='Explore', cjk=r['jp'] + ''.join(x['jp'] for x in near), extra_css=css)


def map_sheet():
    meta, recs = C('tokyo')
    build_area_defs('tokyo')
    area = D.order([r for r in recs if r['a'] == 'TAITO'])
    core = [r for r in area if D.hav(r, area[0]) < 2.2]
    num = [(i + 1, r) for i, r in enumerate(area) if r in core][:14]
    sel = next(r for r in area if r['n'] == 'Sensō-ji')
    selnum = next(n for n, r in num if r['id'] == sel['id']) if any(r['id'] == sel['id'] for _, r in num) else 1
    art = K.mapart_pair(recs, core, meta['ac'], desk=(1440, 900), mob=(390, 844), uid='ms', mob_inset=(120, 10, 380, 10), numbered=num, sel=sel['id'], pad=.1)
    art = art.replace('<div class="mq-d">', '<div class="mq-d" style="left:456px">')
    nxt = [r for _, r in num if r['id'] != sel['id']][:2]
    peek = card(sel, meta, num=selnum, focus=True, row=True) + ''.join(card(r, meta, num=next(n for n, q in num if q['id'] == r['id']), row=True) for r in nxt)
    desk_list = ''.join(card(r, meta, num=n, focus=(r['id'] == sel['id'])) for n, r in num)
    body = (f'<main id="main" class="mapview"><div class="mapart">{art}</div>'
            f'<div class="mtop"><a class="btn btn-icon" href="city-tokyo.html" aria-label="Back to list">{K.icon("chev-l")}</a>'
            f'<label class="search compact"><span class="vh">Search this map</span>{K.icon("search")}<input type="search" placeholder="Search Taitō-ku"></label>'
            f'<button class="btn btn-icon" aria-label="Filters">{K.icon("sliders")}</button></div>'
            f'<div class="map-chip" style="top:70px;max-width:none;right:12px"><span class="pill" aria-pressed="true"><span class="swatch" style="background:{meta["ac"]["TAITO"]}"></span>Taitō-ku · {len(area)}</span>'
            f'<span class="pill">Sights</span><span class="pill">Eat &amp; drink</span></div>'
            f'<div class="map-ctrls" style="top:auto;bottom:330px"><button class="btn btn-icon" aria-label="Near me">{K.icon("compass")}</button></div>'
            f'<section class="poi-sheet" aria-label="Selected place"><div class="grab"></div><div class="hdr"><span class="sm"><b>{len(num)}</b> of {len(area)} Taitō-ku places in view</span>'
            f'<a class="btn btn-icon btn-quiet" href="city-tokyo.html" aria-label="Close map">{K.icon("close")}</a></div>'
            f'<div class="peek">{peek}</div><div class="row-actions"><a class="btn btn-ghost" href="city-tokyo.html">{K.icon("list")} List</a>'
            f'<a class="btn btn-primary" href="place-tokyo.html">Open {E(sel["n"])}</a></div></section>'
            f'<aside class="desk-list" aria-label="Places in view"><div class="dl-head"><h1 class="d2">Taitō-ku</h1><p class="sm muted" style="margin:4px 0 0">{len(num)} of {len(area)} places in view · numbered to match the pins</p></div><div class="cards one">{desk_list}</div></aside>'
            f'<div class="map-credit">Map art from our verified pins · live map © OpenStreetMap contributors · Esri</div></main>')
    css = ('.desk-list{display:none}.mapview .map-credit{z-index:4;bottom:auto;top:auto}'
           '.poi-sheet .peek .card{grid-template-columns:96px minmax(0,1fr)}.poi-sheet .peek .card .plate{aspect-ratio:auto}.poi-sheet .peek .card .plate .loc{display:none}'
           '@media(min-width:640px){.poi-sheet .peek .card{width:420px}}'
           '@media(min-width:1024px){.poi-sheet{display:none}.desk-list{display:block;position:absolute;z-index:6;left:16px;top:16px;bottom:16px;width:440px;overflow:auto;background:var(--surface);border-radius:var(--r-l);box-shadow:var(--e-4);padding:0 14px 14px}'
           '.dl-head{position:sticky;top:0;background:var(--surface);padding:16px 2px 12px;z-index:3;border-bottom:1px solid var(--line);margin-bottom:12px}.cards.one{grid-template-columns:1fr}.cards.one .card{grid-template-columns:120px minmax(0,1fr);grid-template-rows:auto}.cards.one .card .plate{aspect-ratio:auto}'
           '.mapview .mtop{left:472px;right:16px;top:16px}.mapview .mtop .btn-icon:first-child{display:none}.map-chip{left:472px!important;top:76px!important}.mapview .map-ctrls{bottom:40px!important}}'
           '.mapview .map-credit{position:absolute;bottom:0}')
    return page('map-sheet.html', 'Map — Taitō-ku, Tokyo · Cleo (beta mockup)', body, city='tokyo', cjk=''.join(r['jp'] for r in area), extra_css=css)


INTEREST = {'history': {'TEMPLE', 'CASTLE', 'UNESCO'}, 'pop': {'ANIME', 'POP'}, 'outdoors': {'NATURE', 'GARDEN', 'VIEW'}, 'art': {'MUS'}}


def guide_picker():
    meta, recs = C('tokyo')
    build_area_defs('tokyo')
    hist = [r for r in recs if INTEREST['history'] & set(r['g'])]
    pop = [r for r in recs if INTEREST['pop'] & set(r['g'])]
    food = [r for r in recs if r['kind'] == 'food']
    picks = {'history', 'pop'}
    def score(r):
        why = []
        s = 0
        if INTEREST['history'] & set(r['g']): s += 10; why.append('History & landmarks')
        if INTEREST['pop'] & set(r['g']): s += 10; why.append('Pop culture')
        if r['t'] == 1: s += 5; why.append('Must see in ' + area_name(meta, r['a']))
        s += len([x for x in r['s'] if not x['added']]) * .5
        return s, why
    top = sorted((r for r in recs if not r['closed']), key=lambda r: (-score(r)[0], r['id']))[:5]
    outd = [r for r in recs if INTEREST['outdoors'] & set(r['g'])]
    art = [r for r in recs if INTEREST['art'] & set(r['g'])]
    opts = [('history', 'History &amp; landmarks', 'torii', f'Temples, shrines, castles, UNESCO sites · {len(hist)} places'),
            ('food', 'Food &amp; drink', 'bowl', f'Ramen and sushi first — the city\'s own canon · {len(food)} places'),
            ('pop', 'Pop culture', 'bubble', f'Anime, manga, film and oddities · {len(pop)} places'),
            ('outdoors', 'Outdoors', 'mountain', f'Gardens, parks, views · {len(outd)} places'),
            ('art', 'Art &amp; museums', 'columns', f'Museums and galleries · {len(art)} places')]
    picker = ''.join(f'<button class="interest" aria-pressed="{"true" if k in picks else "false"}"><span class="glyph">{K.icon(g)}</span>'
                     f'<span><b>{t}</b><span class="d">{d}</span></span><span class="tick">{K.icon("check" if k in picks else "plus", "ico sm")}</span></button>' for k, t, g, d in opts)
    moods = ''.join(f'<button class="pill" aria-pressed="{"true" if m == "The icons" else "false"}">{K.icon(i)}{m}</button>' for m, i in [('The icons', 'star4'), ('Hidden gems', 'compass'), ('Nightlife &amp; yokochō', 'moon')])
    prev = ''.join(card(r, meta, why_first='First because: ' + ' · '.join(score(r)[1])) for r in top)
    body = (topbar('Your guide', saved=3) + '<main id="main" class="wrap gp">'
            f'<section class="pick"><span class="eyebrow">Your guide · Tokyo</span><h1 class="d1" style="margin-top:6px">Who\'s showing you around?</h1>'
            f'<p class="lead">Tell your guide what you\'re into. It puts those places first — all {meta["n"]} places stay in the list and on the map.</p>'
            f'<h2 class="section-t" style="margin-top:20px">I\'m into…</h2><div style="display:grid;gap:10px">{picker}</div>'
            f'<h2 class="section-t" style="margin-top:22px">Lean towards…</h2><div class="mood">{moods}</div>'
            f'<div class="gp-cta"><button class="btn btn-primary btn-block">Show me Tokyo my way</button><button class="btn btn-quiet">Reset</button></div>'
            f'<p class="device-note">{K.icon("info", "ico sm")}Remembered on this device only. No account, nothing sent anywhere.</p></section>'
            f'<section class="preview" aria-labelledby="pv"><div class="rail-head"><div><span class="eyebrow">Preview</span><h2 class="d2" id="pv">Your first five</h2></div></div>'
            f'<p class="sm muted" style="margin:-4px 0 12px">Reordered, never filtered. Each card says why it moved up.</p><div class="cards one">{prev}</div></section></main>' + footer(TOTALS))
    css = ('.gp{display:grid;gap:28px;padding-top:22px;padding-bottom:24px}.gp-cta{display:grid;grid-template-columns:1fr auto;gap:8px;margin:24px 0 10px}'
           '.cards.one{grid-template-columns:1fr}@media(min-width:640px){.cards.one .card{grid-template-columns:150px minmax(0,1fr);grid-template-rows:auto}.cards.one .card .plate{aspect-ratio:auto}}'
           '@media(min-width:1024px){.gp{grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:56px;padding-top:44px}.preview{background:var(--sand);border-radius:var(--r-l);padding:24px}}')
    return page('guide-picker.html', 'Your guide — Tokyo · Cleo (beta mockup)', body, city='tokyo', tab='Guide', cjk=''.join(r['jp'] for r in top), extra_css=css)


def day_stops(meta, recs, aid='TAITO'):
    pool = [r for r in recs if r['a'] == aid and not r['closed'] and r['t'] <= 2]
    start = D.order([r for r in pool if r['kind'] == 'sight'])[0]
    stops = [start]
    for kind in ['food', 'sight', 'sight', 'food', 'sight']:
        cand = [r for r in pool if r['kind'] == kind and r not in stops]
        stops.append(min(cand, key=lambda r: (D.hav(stops[-1], r), r['t'])))
    return stops


def day_plan():
    meta, recs = C('tokyo')
    build_area_defs('tokyo')
    stops = day_stops(meta, recs)
    legs = [D.hav(a, b) for a, b in zip(stops, stops[1:])]
    total = sum(legs)
    art = K.mapart_pair(recs, stops, meta['ac'], desk=(540, 740), mob=(358, 260), uid='day', numbered=[(i + 1, r) for i, r in enumerate(stops)], route=stops, pad=.14)
    items = []
    for i, r in enumerate(stops):
        leg = f'<p class="leg">{K.icon("route", "ico sm")}{legs[i] * 1000:.0f} m to the next stop, straight-line</p>' if i < len(legs) else ''
        items.append(f'<li class="stop"><span class="n">{i + 1}</span><div>{card(r, meta)}{leg}</div></li>')
    wps = '/'.join(f'{r["lat"]},{r["lng"]}' for r in stops)
    gurl = f'https://www.google.com/maps/dir/{wps}'
    head = (f'<section class="masthead" aria-labelledby="dp"><div class="sky">{K.constellation([r for r in recs if r["a"] == "TAITO"], 1440, 260, "dps", clip=.05)}</div>'
            f'<div class="inner"><nav class="crumbs" aria-label="Breadcrumb"><a href="city-tokyo.html">Tokyo</a></nav><span class="eyebrow" style="color:var(--on-night-2)">A day with your guide</span>'
            f'<h1 class="d1" id="dp">Taitō-ku, on foot</h1><p class="facts">Asakusa to Ueno: built from the guide\'s own must-sees and worth-the-detours, nearest next. Swap any stop.</p></div><span class="accentbar"></span></section>')
    body = (topbar('Your day', saved=3) + '<main id="main">' + head + '<div class="wrap"><div class="split" style="margin-top:22px"><div class="listpane">'
            f'<div class="daysum"><div><b>{len(stops)}</b><span>stops</span></div><div><b>{total:.1f} km</b><span>straight-line total</span></div><div><b>{sum(r["kind"] == "food" for r in stops)}</b><span>places to eat</span></div></div>'
            f'<div class="caveat" style="margin:14px 0 18px">{K.icon("info")}<span>Opening hours and prices aren\'t in our data — check each place before you go. Distances are straight lines, not walking routes. Closed places are never added.</span></div>'
            f'<div class="sharebar" style="margin-bottom:18px"><a class="btn btn-primary" href="{E(gurl)}">{K.icon("directions")} Open route in Google Maps</a><a class="btn btn-ghost" href="#">Apple Maps</a>'
            f'<button class="btn btn-ghost">{K.icon("swap")} Swap a stop</button><button class="btn btn-ghost">{K.icon("share")} Share</button></div>'
            f'<ol class="stops">{"".join(items)}</ol></div>'
            f'<aside class="mappane" aria-label="Route map"><div class="mapart">{art}</div><div class="map-credit">Route line joins stops in order; map art from our verified pins · live map © OpenStreetMap contributors · Esri</div></aside></div></div>'
            '<div class="mob-map"><div class="mapart">' + art.replace('id="wbday', 'id="x').replace('url(#wbday', 'url(#x').replace('id="grday', 'id="y').replace('url(#grday', 'url(#y') + '</div></div>'
            '</main>' + footer(TOTALS))
    css = ('.mob-map{display:none}@media(max-width:1023px){.mob-map{display:block;position:relative;height:260px;margin:0 var(--gutter) 0;border-radius:var(--r-l);overflow:hidden;border:1px solid var(--line);order:-1}'
           'main{display:flex;flex-direction:column}main>.masthead{order:-2}.mob-map{margin-top:16px}}'
           '.stops .card{grid-template-columns:96px minmax(0,1fr)}@media(min-width:640px){.stops .card{grid-template-columns:150px minmax(0,1fr);grid-template-rows:auto}.stops .card .plate{aspect-ratio:auto}}')
    return page('day-plan.html', 'A day in Taitō-ku · Cleo (beta mockup)', body, city='tokyo', tab='Your day', cjk=''.join(r['jp'] for r in stops), extra_css=css)


def saved():
    meta, recs = C('tokyo')
    build_area_defs('tokyo')
    want = ['Sensō-ji', 'Ghibli Museum, Mitaka', 'Chukasoba Ginza Hachigou', 'Nakano Broadway']
    picks = [next(r for r in recs if r['n'] == w) for w in want if any(r['n'] == w for r in recs)]
    picks += [r for r in recs if r['closed']][:1]
    extra = [r for r in D.order([r for r in recs if r['kind'] == 'food' and r['a'] == 'TAITO'])][:2]
    picks += [r for r in extra if r not in picks]
    visited = {picks[0]['id'], picks[2]['id']}
    cards = ''.join(card(r, meta, num=i + 1, saved=True, visited=r['id'] in visited) for i, r in enumerate(picks))
    art = K.mapart_pair(recs, picks, meta['ac'], desk=(540, 740), uid='sv', numbered=[(i + 1, r) for i, r in enumerate(picks)], pad=.12)
    body = (topbar('Saved', saved=len(picks)) + '<main id="main" class="wrap" style="padding-top:20px">'
            f'<div class="banner offline" role="status">{K.icon("offline")}<span>You\'re offline. Your list and every place\'s details are on this device; map tiles return when you reconnect.</span></div>'
            f'<div class="split" style="margin-top:18px"><div class="listpane"><div class="listhead"><span class="eyebrow">Saved</span><h1 class="d1">Your Tokyo list</h1>'
            f'<p class="device-note">{K.icon("heart", "ico sm")}{len(picks)} places · saved on this device only — no account needed.</p>'
            f'<div class="listtabs"><button class="pill" aria-pressed="true">All saved · {len(picks)}</button><button class="pill" aria-pressed="false">Been there · {len(visited)}</button><button class="pill">{K.icon("plus")} New list</button></div>'
            f'<div class="sharebar"><button class="btn btn-primary">{K.icon("share")} Share link</button><button class="btn btn-ghost">Apple Maps</button><button class="btn btn-ghost opt">Google Maps</button>'
            f'<a class="btn btn-ghost" href="day-plan.html">{K.icon("day")} Make a day</a><button class="btn btn-quiet opt">{K.icon("print")} Print</button></div>'
            f'<p class="xs muted" style="margin:0">Mockup state: a sample selection of real places to show saved, “been there” and closed-since-saved treatments. The share link encodes place ids in the URL — nothing is stored on a server.</p></div>'
            f'<div class="cards" style="margin-top:16px">{cards}</div></div>'
            f'<aside class="mappane" aria-label="Map of saved places"><div class="mapart">{art}</div><div class="map-credit">Map art from our verified pins · live map © OpenStreetMap contributors · Esri</div></aside></div></main>' + footer(TOTALS))
    return page('saved.html', 'Saved — Cleo (beta mockup)', body, city='tokyo', tab='Saved', cjk=''.join(r['jp'] for r in picks))


def components():
    meta, recs = C('tokyo')
    cm, cr = C('cleveland')
    build_area_defs('tokyo'); build_area_defs('cleveland')
    sen = next(r for r in recs if r['n'] == 'Sensō-ji')
    bib = next(r for r in recs if any(s['key'] == 'MICHELIN_BIB' for s in r['s']))
    t3 = next(r for r in D.order(recs) if r['t'] == 3)
    closed = next(r for r in cr if r['n'] == "Sokolowski's University Inn")
    added = next((r for r in cr if r['s'] and all(s['added'] for s in r['s'])), None)
    sw = [('paper', 'Page ground'), ('surface', 'Cards, sheets'), ('sand', 'Secondary ground'), ('ink', 'Text, primary action'), ('ink-2', 'Secondary text'),
          ('ink-3', 'Meta text'), ('line', 'Hairline'), ('night', 'Night ground'), ('gilt', 'Distinction'), ('open', 'Open'), ('closed', 'Closed'), ('city', 'City accent')]
    swatches = ''.join(f'<div class="sw"><span style="background:var(--{k})"></span><b>--{k}</b><small>{d}</small></div>' for k, d in sw)
    skins = ''.join(f'<div class="sw skin-{s}"><span style="background:var(--city)"></span><b>{s}</b><small>{c}</small></div>'
                    for s, c in [('vermilion', 'Tokyo'), ('moss', 'Kyoto'), ('neon', 'Osaka'), ('lagoon', 'Okinawa'), ('glacier', 'Hokkaido'), ('lake', 'Cleveland'), ('saffron', 'New York'), ('plum', 'Chicago')])
    type_rows = ''.join(f'<div class="tr"><span class="xs muted">{l}</span><span class="{c}">{t}</span></div>' for l, c, t in [
        ('Hero · Bodoni Moda 76/44', 'd-hero', 'Go where they’d go.'), ('Display 1 · 64/38', 'd1', 'Tokyo <span class="native" style="font-size:.5em">東京</span>'),
        ('Display 2 · 36/28', 'd2', 'Taitō-ku'), ('Display 3 · 22/21 (card name)', 'd3', 'Sensō-ji'),
        ('Lead · Figtree 20/18', 'lead', 'Tokyo’s oldest temple — through the thunder gate to the main hall.'),
        ('Body · Figtree 16', '', 'Every place recommended by named sources, pinned to the door and status-checked.'),
        ('Small · 14', 'sm', 'Ordered by tier, then by number of named sources.'), ('Eyebrow · 12.5, tracked caps (≤1 per card)', 'eyebrow', 'Area 6 of 13')])
    body = (topbar('', saved=3) + '<main id="main" class="wrap cs">'
            '<h1 class="d1" style="margin:28px 0 4px">Constellation — components</h1><p class="lead" style="margin:0 0 8px">The beta design system on real records. Spec: design/beta/DESIGN-SYSTEM.md.</p>'
            f'<h2 class="d2 h">Colour</h2><div class="grid sws">{swatches}</div><h3 class="sm h3">City skins (one accent per city)</h3><div class="grid sws">{skins}</div>'
            f'<h2 class="d2 h">Type</h2><div class="types">{type_rows}</div>'
            f'<h2 class="d2 h">Buttons</h2><div class="row"><button class="btn btn-primary">{K.icon("directions")} Directions</button><button class="btn btn-ghost">{K.icon("plus")} Add to day</button>'
            f'<button class="btn btn-quiet">Reset</button><button class="btn btn-city">Show me Tokyo</button><button class="btn btn-icon btn-ghost" aria-label="Save">{K.icon("heart")}</button><button class="btn btn-primary" disabled>Disabled</button></div>'
            f'<h2 class="d2 h">Distinction ladder</h2><div class="row">{K.tier(1, "", "lg")}{K.tier(2, "", "lg")}{K.tier(3, "", "lg")}<span class="authority">{K.icon("seal")}Michelin Bib Gourmand</span><span class="status open">Open · checked 2026-10-02</span><span class="status closed">Closed · kept for the record</span></div>'
            f'<h2 class="d2 h">Recommended by — source chips</h2><div class="row rec" style="font-size:12.5px">{chips(sen, 3, "Tokyo")}</div><div class="row rec" style="font-size:12.5px">{chips(bib, 3, "Tokyo")}</div>'
            + (f'<div class="row rec" style="font-size:12.5px">{chips(added, 3)}</div>' if added else '')
            + f'<h2 class="d2 h">Place card — states</h2><div class="cards">'
            + card(sen, meta, num=1, focus=True) + card(bib, meta, num=2, saved=True) + card(t3, meta, num=3, visited=True)
            + card(closed, cm, num=4, href='#') + '</div><p class="xs muted">Selected (focus ring = pin selected on map) · Saved · Been there · Closed (no tier glyph, desaturated hatched plate, status + check date).</p>'
            + f'<h2 class="d2 h">Collection rail</h2><div class="rail">{city_rail("tokyo")}</div>'
            + '<h2 class="d2 h">Category pills</h2><div class="row">' + ''.join(f'<button class="pill" aria-pressed="{"true" if i == 0 else "false"}">{K.icon(D.GLYPH.get(c["id"], "forkknife"))}{E(c["n"].split(" & ")[0])}</button>' for i, c in enumerate(meta['cuisines'][:6])) + '</div>'
            + f'<h2 class="d2 h">Search</h2><div style="max-width:640px"><form class="search" role="search">{K.icon("search")}<input type="search" value="ramen" aria-label="Search"><button class="btn btn-primary">Search</button></form>'
            + '<div class="suggest" role="listbox"><h4>Places</h4>' + ''.join(f'<a role="option" href="#"{" aria-selected=true" if i == 0 else ""}>{K.icon("bowl")}<span><mark>Ramen</mark> · {E(r["n"])}</span><span class="meta">{E(area_name(meta, r["a"]))}</span></a>' for i, r in enumerate([r for r in recs if "RAMEN" in r["cz"]][:3]))
            + f'<h4>Collections</h4><a role="option" href="#">{K.icon("bowl")}<span><mark>Ramen</mark> &amp; Tsukemen</span><span class="meta">{sum("RAMEN" in r["cz"] for r in recs)} places</span></a>'
            + f'<h4>Sources</h4><a role="option" href="#">{K.icon("seal")}<span><mark>Ramen</mark> Adventures recommends</span><span class="meta">{src_count(recs, lambda k: k == "RAMENADVENTURES")} places</span></a></div></div>'
            + filter_tray(meta, recs)
            + f'<h2 class="d2 h">Stated gap</h2><div style="max-width:520px"><aside class="gap"><span class="eyebrow">Stated gap · Persian</span><p class="d3">No Persian restaurant in Cleveland meets the bar.</p><p>We say so instead of padding the list with a mediocre pick.</p></aside></div>'
            + f'<h2 class="d2 h">Empty, error and offline</h2><div class="grid states">'
            + f'<div class="state"><svg class="art" viewBox="0 0 120 90" aria-hidden="true"><path d="M20 70 L60 20 L100 70" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3 6"/><path fill="currentColor" d="{K.STAR}" transform="translate(48 8)"/></svg><h3>Nothing saved yet</h3><p>Tap the heart on any place. Your list lives on this device — no account needed.</p><a class="btn btn-primary" href="city-tokyo.html">Explore Tokyo</a></div>'
            + f'<div class="state"><svg class="art" viewBox="0 0 24 24" aria-hidden="true" style="width:56px;height:56px"><use href="#i-search"/></svg><h3>No places match “matcha” in Kōtō</h3><p>Try all of Tokyo — 23 places match there. Filters never hide places for good.</p><button class="btn btn-ghost">Search all of Tokyo</button></div>'
            + f'<div class="state"><svg class="art" viewBox="0 0 24 24" aria-hidden="true" style="width:56px;height:56px"><use href="#i-map"/></svg><h3>The map couldn\'t load</h3><p>The list still has every place, address and source. We\'re showing map art from our own pins until tiles return.</p><button class="btn btn-ghost">Try again</button></div>'
            + '</div><div style="display:grid;gap:10px;margin-top:14px">'
            + f'<div class="banner offline">{K.icon("offline")}<span>You\'re offline — the guide still works.</span><button class="btn btn-night">Got it</button></div>'
            + f'<div class="banner warn">{K.icon("alert")}<span>Storage is blocked here, so saves last until you close the tab.</span></div>'
            + '<div class="cards"><div class="card" aria-hidden="true"><div class="plate skeleton" style="border-radius:0"></div><div class="body"><div class="skeleton" style="height:14px;width:40%"></div><div class="skeleton" style="height:22px;width:80%"></div><div class="skeleton" style="height:14px;width:95%"></div><div class="skeleton" style="height:14px;width:60%"></div></div></div></div></div>'
            + f'<h2 class="d2 h">Hub city tiles</h2><div class="tiles">{city_tile("tokyo")}{city_tile("cleveland")}{city_tile("kyoto")}</div>'
            + '</main>' + footer(TOTALS))
    css = ('.cs .h{margin:44px 0 14px}.cs .h3{margin:16px 0 8px;font-weight:650}.grid{display:grid;gap:12px}.sws{grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}'
           '.sw{display:grid;gap:2px;font-size:13px}.sw span{height:56px;border-radius:var(--r-s);border:1px solid var(--line)}.sw small{color:var(--ink-3)}'
           '.types{display:grid;gap:14px}.tr{display:grid;gap:4px;border-top:1px solid var(--line);padding-top:10px}.row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:8px 0}'
           '.states{grid-template-columns:repeat(auto-fill,minmax(280px,1fr))}.tray-demo{max-width:560px}')
    return page('components.html', 'Components — Cleo beta design system', body, city='tokyo', tab='Explore', cjk=''.join(r['jp'] for r in recs[:40]), extra_css=css)


def filter_tray(meta, recs):
    areas = ''.join(f'<button class="pill" aria-pressed="{"true" if a["id"] == "TAITO" else "false"}"><span class="swatch" style="background:{meta["ac"][a["id"]]}"></span>{E(D.area_split(a["n"])[0])}</button>' for a in meta['areas'][:8])
    src = collections.Counter(s['label'] for r in recs for s in r['s'] if not s['added'])
    srcs = ''.join(f'<button class="pill" aria-pressed="false">{E(l)} <span class="n">{n}</span></button>' for l, n in src.most_common(6))
    n_taito = sum(r['a'] == 'TAITO' for r in recs)
    return ('<h2 class="d2 h">Filters &amp; sort tray</h2><div class="tray tray-demo" role="dialog" aria-label="Filters">'
            f'<header><h2>Filters</h2><button class="btn btn-icon btn-quiet" aria-label="Close">{K.icon("close")}</button></header><div class="scroll">'
            f'<fieldset><legend>Area</legend><div class="opts">{areas}<button class="pill">+ 5 more</button></div></fieldset>'
            f'<fieldset><legend>Distinction</legend><div class="opts"><button class="pill" aria-pressed="false">{K.tier_svg(1)}Must see</button><button class="pill">Worth the detour</button><button class="pill">Deep cut</button></div></fieldset>'
            f'<fieldset><legend>Recommended by</legend><div class="opts">{srcs}</div></fieldset>'
            '<fieldset><legend>Sort</legend><label class="radio-row">Guide\'s order (tier, then sources)<input type="radio" name="s" checked></label><label class="radio-row">Nearest to me<input type="radio" name="s"></label><label class="radio-row">A–Z<input type="radio" name="s"></label></fieldset>'
            '<fieldset style="border:0"><legend>More</legend><div class="radio-row">Hide places I\'ve been<button class="switch" role="switch" aria-checked="false" aria-label="Hide places I\'ve been"></button></div>'
            '<div class="radio-row">Free to visit only<button class="switch" role="switch" aria-checked="true" aria-label="Free to visit only"></button></div>'
            '<div class="radio-row">Map style<span class="sm muted">Light · Dark · Satellite · Terrain</span></div></fieldset></div>'
            f'<footer><button class="btn btn-quiet">Clear all</button><button class="btn btn-primary">Show {n_taito} places</button></footer></div>')


def main():
    compute_totals()
    out = [landing(), hub_japan(), city_page('tokyo', 'city-tokyo.html'), city_page('cleveland', 'city-cleveland.html'),
           place_detail(), map_sheet(), guide_picker(), day_plan(), saved(), components()]
    for f in out:
        print('wrote design/beta/mockups/' + f, os.path.getsize(os.path.join(OUT, f)) // 1024, 'KB')


if __name__ == '__main__':
    main()
