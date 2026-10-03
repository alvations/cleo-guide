#!/usr/bin/env python3
"""Extract REAL records for the 2026-10 UX prototypes (read-only over the repo; writes only under
design/ux-2026-10/prototypes/data/).

Mirrors the live build's gate: a place is included only if data/geocodes.json holds a sourced lat/lng
for it that is not UNVERIFIED (rule 4a) — so the prototype shows exactly the set a visitor can see
today, never a fabricated pin. Every place that passes is kept (no cap, no trim). Closed status comes
from the registry (rule 4c) and is surfaced, not hidden.

Also writes hub.js: per-city counts computed from the same gate, so hub cards carry real numbers.

    python3 design/ux-2026-10/tools/extract.py
"""
import json, os, re, collections

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
OUT = os.path.join(ROOT, 'design', 'ux-2026-10', 'prototypes', 'data')
GEO = json.load(open(os.path.join(ROOT, 'data', 'geocodes.json')))['cities']

CITIES = {  # dataset key -> (geocodes key, display name, local name, country)
    'tokyo': ('tokyo', 'Tokyo', '東京', 'Japan'),
    'kyoto': ('kyoto', 'Kyoto', '京都', 'Japan'),
    'osaka': ('osaka', 'Osaka', '大阪', 'Japan'),
    'okinawa': ('okinawa', 'Okinawa', '沖縄', 'Japan'),
    'hokkaido': ('hokkaido', 'Hokkaido', '北海道', 'Japan'),
    'chicago': ('chicago-il', 'Chicago', '', 'United States'),
    'newyork': ('new-york-ny', 'New York', '', 'United States'),
    'pittsburgh': ('pittsburgh-pa', 'Pittsburgh', '', 'United States'),
    'washingtondc': ('washington-dc', 'Washington, DC', '', 'United States'),
    'sanfrancisco': ('san-francisco-ca', 'San Francisco', '', 'United States'),
}
FULL = ['tokyo', 'chicago']  # cities whose full record set the prototypes render


def gkey(k):
    if k in GEO:
        return k
    c = [x for x in GEO if x.startswith(k.split('-')[0])]
    return c[0] if c else None


def label(reg, key):
    e = reg.get(key) or {}
    t = (e.get('t') or e.get('k') or key).strip()
    return t if t and not t.isupper() or len(t) <= 4 else t.title().replace('Of ', 'of ')


def build(ds_key):
    gk, name, local, country = CITIES[ds_key]
    gk = gkey(gk)
    d = json.load(open(os.path.join(ROOT, 'data', f'{ds_key}.dataset.json')))
    G = GEO.get(gk, {}) if gk else {}
    recs, dropped = [], 0
    for kind, L, reg in (('sight', d['P'], d['S']), ('food', d['F'], d['FS'])):
        for p in L:
            g = G.get(p['n'])
            if not g or g.get('lat') is None or str(g.get('confidence', '')).upper() == 'UNVERIFIED':
                dropped += 1
                continue
            closed = bool(p.get('closed')) or g.get('status') == 'closed' or '— CLOSED' in p['n']
            nm = re.sub(r'\s*—\s*CLOSED\s*$', '', p['n'])
            m = re.match(r'^(.*?)\s*\(([^()]*[぀-ヿ一-鿿][^()]*)\)\s*(.*)$', nm)
            en, jp = (m.group(1) + (' ' + m.group(3) if m.group(3) else ''), m.group(2)) if m else (nm, '')
            recs.append({
                'id': len(recs), 'kind': kind, 'n': en.strip(), 'jp': jp, 't': p.get('t', 2), 'a': p['a'],
                'w': p.get('w', ''), 'k': p.get('k', ''), 'ad': p.get('ad') or g.get('address', ''),
                'g': p.get('g', []), 'cz': p.get('cz', []),
                's': [[label(reg, s[0]), s[1] if len(s) > 1 else ''] for s in p.get('s', [])],
                'lat': g['lat'], 'lng': g['lng'], 'conf': g.get('confidence', ''),
                'closed': closed, 'status': g.get('status', 'unchecked'),
                'statusSource': g.get('statusSource', ''), 'statusChecked': g.get('statusChecked', ''),
                'geoSource': g.get('source', ''), 'verified': g.get('verified', ''),
            })
    meta = {'key': ds_key, 'name': name, 'local': local, 'country': country,
            'areas': d['areas'], 'ac': d['ac'], 'cats': d['cats'], 'cuisines': d['cuisines'],
            'sights': sum(r['kind'] == 'sight' for r in recs), 'food': sum(r['kind'] == 'food' for r in recs),
            'closed': sum(r['closed'] for r in recs), 'researched': len(d['P']) + len(d['F']), 'notOnMap': dropped}
    return meta, recs


def canon(meta, recs):
    """Signature line from the data itself, never hand-written marketing: each dataset lists its
    cuisines canon-first (the city-unique food rule), so take the first two that carry >=5 places,
    (the shared Japan taxonomy is ranked by volume instead), then the city's starred collection if it has one (e.g. Tokyo's ★ anime layer), else its
    most-populated distinctive collection."""
    cz = collections.Counter(c for r in recs if r['kind'] == 'food' for c in r['cz'])
    gz = collections.Counter(c for r in recs if r['kind'] == 'sight' for c in r['g'])
    short = lambda s: re.split(r'\s*[(,&/]|\s+and\s', s.replace('★', '').strip())[0].strip()
    if meta['country'] == 'Japan':  # the five Japan maps share one taxonomy, so order says nothing — use volume
        generic = {'FINE', 'INT', 'SAKE', 'MKT', 'CAFE'}
        out = [short(n) for c, _ in cz.most_common() if c not in generic
               for n in [x['n'] for x in meta['cuisines'] if x['id'] == c]][:2]
    else:
        out = [short(c['n']) for c in meta['cuisines'] if cz[c['id']] >= 5][:2]
    star = [c for c in meta['cats'] if c['n'].startswith('★') and gz[c['id']]]
    if star:
        out.append(short(star[0]['n']))
    else:
        skip = {'FREE', 'ICON', 'MUS', 'NATURE', 'PARK', 'FAM'}
        top = [c for c, _ in gz.most_common() if c not in skip][:1]
        out += [short(c['n']) for c in meta['cats'] if c['id'] in top]
    return out


os.makedirs(OUT, exist_ok=True)
hub = []
for k in CITIES:
    if not os.path.exists(os.path.join(ROOT, 'data', f'{k}.dataset.json')):
        continue
    meta, recs = build(k)
    meta['canon'] = canon(meta, recs)
    meta['page'] = f'cities/{k}.html'
    meta['areasN'] = len(meta['areas'])
    h = {x: meta[x] for x in ('key', 'name', 'local', 'country', 'sights', 'food', 'closed', 'researched', 'canon', 'page', 'areasN')}
    h['must'] = sum(r['t'] == 1 for r in recs)
    star = [c for c in meta['cats'] if c['n'].startswith('★')]
    h['star'] = [star[0]['n'].replace('★ ', ''), sum(star[0]['id'] in r['g'] for r in recs)] if star else None
    h['colors'] = [meta['ac'][a['id']] for a in meta['areas'] if a['id'] in meta['ac']]
    lat = sorted(r['lat'] for r in recs); lng = sorted(r['lng'] for r in recs)
    h['center'] = [round(lat[len(lat) // 2], 2), round(lng[len(lng) // 2], 2)]
    hub.append(h)
    if k in FULL:
        with open(os.path.join(OUT, f'{k}.js'), 'w') as f:
            f.write('/* generated by design/ux-2026-10/tools/extract.py — real records, geocode-gated */\n')
            f.write('window.CLEO_CITY=' + json.dumps({'meta': meta, 'recs': recs}, ensure_ascii=False, separators=(',', ':')) + ';\n')
        print(k, meta['sights'], 'sights', meta['food'], 'food', meta['closed'], 'closed', '| not on map (no sourced pin):', meta['notOnMap'])
countries = [c for c in json.load(open(os.path.join(ROOT, 'data', 'countries.json')))['countries'] if c.get('live')]
countries = [{k: c.get(k) for k in ('key', 'name', 'order', 'hub', 'blurb')} for c in sorted(countries, key=lambda c: c['order'])]
with open(os.path.join(OUT, 'hub.js'), 'w') as f:
    f.write('/* generated by design/ux-2026-10/tools/extract.py */\nwindow.CLEO_HUB=' + json.dumps(hub, ensure_ascii=False, indent=0) + ';\n')
    f.write('window.CLEO_COUNTRIES=' + json.dumps(countries, ensure_ascii=False, indent=0) + ';\n')
for h in hub:
    print(h['name'], h['sights'] + h['food'], h['canon'])
