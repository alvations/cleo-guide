#!/usr/bin/env python3
"""Real-record loader for the beta design mockups (read-only over the repo).

Every record shown in design/beta/mockups/ comes from here:
- dataset cities (Tokyo, Kyoto, …): data/<city>.dataset.json, gated exactly like the live build — a place is kept
  only if data/geocodes.json holds a sourced lat/lng that is not UNVERIFIED (CLAUDE.md rule 4a). Every place that
  passes is kept: no cap, no trim.
- Cleveland: the data literals of cleveland.html, parsed by extract-cleveland.js (which asserts record counts).
Open/closed status comes from the registry (rule 4c) or the name's "— CLOSED" marker, and is surfaced, never hidden.
Nothing is invented: no ratings, prices, hours, photos or quotes exist in this model because none exist in the data.
"""
import json, math, os, re, subprocess, collections

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
GEO = json.load(open(os.path.join(ROOT, 'data', 'geocodes.json')))['cities']

CJK = r'[぀-ヿ㐀-鿿豈-﫿]'

# Short, sentence-case display labels for source keys. Fallback: registry label, then a cleaned key.
LABELS = {
    'WIKIPEDIA': 'Wikipedia', 'GOTOKYO': 'Go Tokyo', 'TIMEOUT': 'Time Out', 'JAPANGUIDE': 'japan-guide.com',
    'JNTO': 'JNTO', 'ATLASOBSCURA': 'Atlas Obscura', 'MICHELIN': 'Michelin Guide', 'MICHELIN_BIB': 'Michelin Bib Gourmand',
    'MICHELIN_STAR': 'Michelin star', 'MICHELIN_EDITORIAL': 'Michelin Guide (editorial)', 'TOKYOCHEAPO': 'Tokyo Cheapo',
    'JAPANTIMES': 'The Japan Times', 'TOKYOWEEKENDER': 'Tokyo Weekender', 'RAMENADVENTURES': 'Ramen Adventures',
    'WORLD50': "World's 50 Best", 'SAVORJAPAN': 'Savor Japan', 'LONELYPLANET': 'Lonely Planet', 'TABELOG100': 'Tabelog Hyakumeiten',
    'SPRUDGE': 'Sprudge', 'UNESCO': 'UNESCO', 'OFFICIAL': 'Official site', 'JAPANTRAVEL': 'Japan Travel', 'MONOCLE': 'Monocle',
    'FUNJAPAN': 'FUN! Japan', 'INFATUATION': 'The Infatuation', 'INFAT': 'The Infatuation', 'RAMENBEAST': 'Ramen Beast',
    'NIPPONCOM': 'Nippon.com', 'TOFUGU': 'Tofugu', 'ANN': 'Anime News Network', 'KANPAI': 'Kanpai', 'CNN': 'CNN Travel',
    'CULTURETRIP': 'Culture Trip', 'FROMMERS': "Frommer's", 'METROPOLIS': 'Metropolis Japan', 'PUNCH': 'Punch',
    'PAOLOFROMTOKYO': 'Paolo fromTOKYO', 'OTACITY': 'Unique Ota', 'VISITSUMIDA': 'Visit Sumida', 'JAPANFOUNDATION': 'Japan Foundation',
    # Cleveland
    'N5': 'News 5 Cleveland', 'TSG': 'There She Goes Again', 'REQ': 'Asked for by name', 'AO_CLE': 'Atlas Obscura',
    'ADD': 'Added by the guide', 'FADD': 'Added by the guide', 'ECH': 'Encyclopedia of Cleveland History',
    'OHIOORG': 'Ohio.org', 'CLEVHIST': 'Cleveland Historical', 'HERITAGEOHIO': 'Heritage Ohio', 'SCENE': 'Cleveland Scene',
    'METROPARKS': 'Cleveland Metroparks', 'OHIOMAG': 'Ohio Magazine', 'DESTCLE': 'Destination Cleveland',
    'CLEVELANDCOM': 'cleveland.com', 'CLIO': 'Clio', 'OHIOTRAV': 'Ohio Traveler', 'CLEMAG': 'Cleveland Magazine',
    'CLEVMAG': 'Cleveland Magazine', 'FRESH': 'Freshwater Cleveland', 'BOUR': 'Bourdain & food TV', 'FOX8': 'Fox 8 Cleveland',
    'JAMESBEARD': 'James Beard Foundation', 'ESQUIRE': 'Esquire', 'GOLAKEWOOD': 'City of Lakewood',
}
AUTH = re.compile(r'^(MICHELIN|JAMESBEARD|JBF|JAMES_BEARD|NPS)')
ADDED = {'ADD', 'FADD'}

GLYPH = {  # collection / cuisine id -> icon id in the sprite (generic glyphs; never a picture of a venue)
    'TEMPLE': 'torii', 'CASTLE': 'castle', 'GARDEN': 'leaf', 'MUS': 'columns', 'NATURE': 'mountain', 'ONSEN': 'steam',
    'MKT': 'awning', 'NIGHT': 'moon', 'ANIME': 'bubble', 'POP': 'bubble', 'VIEW': 'tower', 'FREE': 'ticket', 'ICON': 'star4',
    'UNESCO': 'globe', 'SUSHI': 'sushi', 'RAMEN': 'bowl', 'NOODLE': 'noodles', 'KAISEKI': 'cloche', 'IZAKAYA': 'lantern',
    'TEMPURA': 'forkknife', 'KONAMON': 'forkknife', 'WAGYU': 'flame', 'TEISHOKU': 'forkknife', 'OKINAWA': 'fish',
    'HOKKAIDO': 'fish', 'TOFU': 'leaf', 'SWEET': 'dango', 'CAFE': 'cup', 'SAKE': 'bottle', 'FINE': 'cloche', 'INT': 'globe',
    'VN': 'bowl', 'SG': 'noodles', 'SEA': 'noodles', 'CN': 'dumpling', 'US': 'sandwich', 'EU': 'forkknife', 'LAT': 'flame',
    'ME': 'forkknife', 'DES': 'cake', 'TV': 'tv',
}
GENERIC = {'ICON', 'FREE'}


def strip(html):
    s = re.sub(r'<br\s*/?>', ' ', html or '')
    s = re.sub(r'<[^>]+>', '', s)
    return re.sub(r'\s+', ' ', s).strip()


def label(key, reg):
    if key in LABELS:
        return LABELS[key]
    if key.startswith('AO_'):
        return 'Atlas Obscura'
    e = reg.get(key) or {}
    for f in ('l', 't'):
        v = (e.get(f) or '').strip()
        if v and len(v) <= 28 and not v.isupper():
            return v
    k = (e.get('k') or key).replace('_', ' ')
    return ' '.join(w if len(w) <= 3 and w.isupper() else w.capitalize() for w in k.split())


def is_prose(k):
    k = strip(k)
    return len(k.split()) >= 8 and ('. ' in k or k.endswith('.'))


def hav(a, b):
    R = 6371.0
    la1, lo1, la2, lo2 = map(math.radians, (a['lat'], a['lng'], b['lat'], b['lng']))
    h = math.sin((la2 - la1) / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin((lo2 - lo1) / 2) ** 2
    return 2 * R * math.asin(math.sqrt(h))


def split_native(name):
    m = re.match(r'^(.*?)\s*\(([^()]*' + CJK + r'[^()]*)\)\s*(.*)$', name)
    if m:
        return (m.group(1) + (' ' + m.group(3) if m.group(3) else '')).strip(), m.group(2).strip()
    return name, ''


def _src(entries, reg):
    out, seen = [], set()
    for s in entries:
        key = s[0]
        extra = s[1] if len(s) > 1 else ''
        url = extra if str(extra).startswith('http') else ((reg.get(key) or {}).get('u') or '')
        note = extra if extra and not str(extra).startswith('http') else ''
        lab = label(key, reg)
        if lab in seen:
            continue
        seen.add(lab)
        title = (reg.get(key) or {}).get('t') or ''
        out.append({'key': key, 'label': lab, 'url': url, 'note': note, 'auth': bool(AUTH.match(key)),
                    'added': key in ADDED, 'title': title if title and not title.isupper() else ''})
    return out


def city(key):
    """Return (meta, recs) for a dataset city or Cleveland."""
    if key == 'cleveland':
        return _cleveland()
    d = json.load(open(os.path.join(ROOT, 'data', f'{key}.dataset.json')))
    norm = lambda x: re.sub(r'-[a-z]{2}$', '', x).replace('-', '')
    gk = key if key in GEO else next((x for x in GEO if norm(x) == key), None)
    G = GEO.get(gk, {}) if gk else {}
    recs, dropped = [], 0
    for kind, L, reg in (('sight', d['P'], d['S']), ('food', d['F'], d['FS'])):
        for p in L:
            g = G.get(p['n'])
            if not g or g.get('lat') is None or str(g.get('confidence', '')).upper() == 'UNVERIFIED':
                dropped += 1
                continue
            recs.append(_rec(len(recs), kind, p, g, reg))
    meta = _meta(key, d['areas'], d['ac'], d['cats'], d['cuisines'], recs, dropped)
    return meta, recs


def _rec(i, kind, p, g, reg):
    closed = bool(p.get('closed')) or g.get('status') == 'closed' or '— CLOSED' in p['n']
    closed = closed or bool(re.search(r'—\s*closed\s*$', p['n'], re.I))
    nm = re.sub(r'\s*—\s*CLOSED\s*$', '', p['n'], flags=re.I)
    en, jp = split_native(nm)
    return {
        'id': i, 'kind': kind, 'full': p['n'], 'n': en, 'jp': jp, 't': p.get('t', 2), 'a': p['a'],
        'w': strip(p.get('w', '')), 'k': strip(p.get('k', '')), 'prose': is_prose(p.get('k', '')),
        'ad': strip(p.get('ad') or g.get('address', '')), 'g': p.get('g', []), 'cz': p.get('cz', []),
        's': _src(p.get('s', []), reg), 'lat': g['lat'], 'lng': g['lng'], 'conf': g.get('confidence', ''),
        'closed': closed, 'status': g.get('status', 'unchecked'), 'statusSource': g.get('statusSource', ''),
        'statusChecked': g.get('statusChecked', ''), 'geoSource': g.get('source', ''), 'verified': g.get('verified', ''),
        'warn': bool(p.get('warn')),
    }


def _meta(key, areas, ac, cats, cuisines, recs, dropped):
    checked = [r['statusChecked'] for r in recs if r['statusChecked']]
    return {'key': key, 'areas': areas, 'ac': ac, 'cats': cats, 'cuisines': cuisines,
            'sights': sum(r['kind'] == 'sight' for r in recs), 'food': sum(r['kind'] == 'food' for r in recs),
            'closed': sum(r['closed'] for r in recs), 'notOnMap': dropped,
            'lastChecked': max(checked) if checked else '', 'n': len(recs),
            'sources': len({s['label'] for r in recs for s in r['s'] if not s['added']})}


def _cleveland():
    raw = subprocess.check_output(['node', os.path.join(os.path.dirname(__file__), 'extract-cleveland.js')])
    d = json.loads(raw)
    G = GEO.get('cleveland-oh', {})
    recs = []
    for kind, L, reg in (('sight', d['P'], d['S']), ('food', d['F'], d['FS'])):
        for p in L:
            g = dict(G.get(p['n']) or {})
            g.setdefault('lat', p.get('la')); g.setdefault('lng', p.get('ln'))
            if g['lat'] is None:
                g['lat'], g['lng'] = p['la'], p['ln']
            recs.append(_rec(len(recs), kind, p, g, reg))
    assert len(recs) == len(d['P']) + len(d['F']), 'Cleveland records lost'
    areas = [{'id': a['id'], 'n': a['n']} for a in d['AREAS']]
    cuisines = d['CUISINES']
    return _meta('cleveland', areas, d['AC'], [], cuisines, recs, 0), recs


def order(recs):
    """Within an area: open before closed, tier ascending, then number of named sources (desc). Stated on the page."""
    return sorted(recs, key=lambda r: (r['closed'], r['t'], -len([s for s in r['s'] if not s['added']]), r['id']))


def area_split(name):
    """'Jōnan — Shinagawa · Meguro (Nakameguro · …)' -> ('Jōnan', 'Shinagawa · Meguro · Nakameguro · …')."""
    hoods = []
    m = re.match(r'^(.*?)\s*\((.*)\)\s*$', name)
    if m:
        name, hoods = m.group(1).strip(), [m.group(2).strip()]
    m = re.match(r'^(.*?)\s+—\s+(.*)$', name)
    if m:
        name, hoods = m.group(1).strip(), [m.group(2).strip()] + hoods
    return name.strip(), ' · '.join(hoods)


def all_pins():
    """Every sourced coordinate in the registry (+ Cleveland), for the landing-page world constellation."""
    pts = []
    for ck, entries in GEO.items():
        for nm, g in entries.items():
            if isinstance(g, dict) and g.get('lat') is not None and str(g.get('confidence', '')).upper() != 'UNVERIFIED':
                pts.append((g['lat'], g['lng']))
    return pts
