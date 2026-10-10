#!/usr/bin/env python3
"""Stamp the prototype city pages from tools/city-template.html with real counts from the extracted data."""
import json, os
D = os.path.dirname(os.path.abspath(__file__)); P = os.path.join(D, '..', 'prototypes')
tpl = open(os.path.join(D, 'city-template.html')).read()
PAGES = {
  'tokyo': dict(COUNTRY='Japan', COUNTRYKEY='japan', LOCAL='<span class="cjk" lang="ja">東京</span>',
                LEDE='Ward by ward — Edomae sushi to Gundam, shrine gardens to yokochō after dark.'),
  'chicago': dict(COUNTRY='United States', COUNTRYKEY='us', LOCAL='',
                  LEDE='Neighborhood by neighborhood — Italian beef to the blues, Prairie School to the lakefront.'),
}
for k, v in PAGES.items():
    s = open(os.path.join(P, 'data', f'{k}.js')).read()
    m = json.loads(s[s.index('=') + 1:s.rstrip().rindex(';')])['meta']
    facts = (f'<li><b>{m["sights"] + m["food"]}</b> places</li><li><b>{m["sights"]}</b> sights</li>'
             f'<li><b>{m["food"]}</b> to eat &amp; drink</li><li><b>{len(m["areas"])}</b> areas</li>'
             f'<li>every one sourced · pinned · status-checked</li>')
    out = tpl
    for a, b in dict(v, NAME=m['name'], KEY=k, FACTS=facts,
                     GATED=f'{m["sights"] + m["food"]} on the map of {m["researched"]} researched').items():
        out = out.replace('{{' + a + '}}', b)
    open(os.path.join(P, f'{k}.html'), 'w').write(out)
    print('wrote', k)
