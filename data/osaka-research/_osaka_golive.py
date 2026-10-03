#!/usr/bin/env python3
# Osaka go-live / card refresh: edits ONLY CARD:osaka in Japan/index.html, the "N of 5 maps live" count in
# CARD:japan (index.html), and the Osaka row in docs/CITIES.md. Run under the shared lock. Args: places sights food
import re, sys
n, s, f = sys.argv[1:4]
J = 'Japan/index.html'; h = open(J).read()
card = '''<!-- CARD:osaka -->
    <a class="city" href="../cities/osaka.html">
      <p class="kicker">大阪 · Kita · Minami · the Castle · Tennōji · the Bay · Kansai day trips</p>
      <p class="nm">Osaka</p>
      <p class="desc">Kuidaore: okonomiyaki teppan and kushikatsu counters, Michelin Bib Gourmand udon and soba counters and a deep Kitashinchi bench; Dōtonbori, Hōzen-ji, Shinsekai, Osaka Castle and Ikuno Koreatown — out to Sakai's kofun, Minoo, Kobe and Himeji.</p>
      <p class="stat">%s places · %s sights · %s food · 9 areas · ★ anime layer</p>
      <span class="go">Open Osaka →</span>
    </a>
    <!-- /CARD:osaka -->''' % (n, s, f)
h2 = re.sub(r'<!-- CARD:osaka -->.*?<!-- /CARD:osaka -->', card, h, flags=re.S)
assert h2.count('CARD:') == h.count('CARD:'); open(J, 'w').write(h2)
live = len(re.findall(r'<!-- CARD:\w+ -->\s*<a class="city"', h2))
I = 'index.html'; r = open(I).read()
seg = re.search(r'<!-- CARD:japan -->.*?<!-- /CARD:japan -->', r, re.S).group(0)
seg2 = re.sub(r'\d of 5 maps live', '%d of 5 maps live' % live, seg)
open(I, 'w').write(r.replace(seg, seg2))
C = 'docs/CITIES.md'; c = open(C).read()
row = ('| Osaka (JP) | `cities/osaka.html` (linked from the Japan hub) | `data/osaka.dataset.json` | `data/osaka-research/` | %s | live · 9 areas: KITA, MINAM, CHUO, TNJ, EAST, BAY, SOUTH, NORTH, KNSAI (Kansai day trips; Nara is on the Kyoto map). '
       '**%s rendered** (%s sights + %s food); every place ≥2 credible or lone Michelin/UNESCO; pins from Michelin venue pages, en/ja Wikipedia infoboxes and MapFan spot pages (med). '
       '**499 discovered — every area at density target (W7, 2026-10-03)**, 63%% food, ANIME 34; ~134 discovered places still UNVERIFIED (shop pins → geocode-helper). Continue from `data/osaka-research/RESUME.md`. '
       'Rebuild: `python3 tools/rebuild-city.py osaka --build`. |') % (n, n, s, f)
lines = c.split('\n'); idx = [i for i, l in enumerate(lines) if l.startswith('| Osaka')]
if idx:
    lines[idx[0]] = row
    lines = [l for i, l in enumerate(lines) if i == idx[0] or not l.startswith('| Osaka')]
else:
    t = [i for i, l in enumerate(lines) if l.startswith('| Tokyo')][0]; lines.insert(t + 1, row)
open(C, 'w').write('\n'.join(lines)); print('live maps:', live)
