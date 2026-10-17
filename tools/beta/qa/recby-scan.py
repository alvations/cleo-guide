#!/usr/bin/env python3
"""QA independent check of D-53 ("Recommended by" names only independent recommenders), on the built beta/.

Reads every "Recommended by" paragraph (<p class="pl-s"><span class="lbl">Recommended by</span> ...</p>) in the built
pages and the place/pack JSON, and reports anything after the label that is not an independent recommender:
  - a rating platform or the place's own site (chip id or text: yelp, tripadvisor, google, foursquare, opentable, zomato,
    facebook, instagram, reddit, "official", "own site", "website");
  - the guide's general knowledge ("Added by the guide (general knowledge)", ADD/FADD): honest as attribution, but it is not
    a recommender, so it must not sit after "Recommended by" (a card with no recommender reads "No independent source yet").
Also counts the "No independent source yet" cards per page.
Usage: python3 tools/beta/qa/recby-scan.py [beta-dir]   (exit 1 on a platform, general knowledge or an unreviewed official chip)
"""
import collections, glob, os, re, sys

BETA = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', '..', '..', 'beta')
PLAT = re.compile(r'yelp|tripadvisor|google|foursquare|opentable|zomato|facebook|instagram|reddit', re.I)
# "official" can be the place's own site (fails D-53) or an independent public body (a city, a tourism bureau): reviewed public bodies are
# listed below (QA-87, 2026-10-17); any other "official" chip after the label FAILs until it is reviewed
OFFICIAL = re.compile(r'\bofficial\b|own[- ]?site|\bwebsite\b', re.I)
PUBLIC_BODY = {'osakacity', 'feelkobe', 'yuirail'}   # Osaka City, the Kobe Tourism Bureau, the Yui Rail guide: independent
GK = re.compile(r'general knowledge|Added by the guide|\bF?ADD\b|data-src="guide"|class="added"')
os.chdir(BETA)
files = sorted(f for f in glob.glob('**/*.html', recursive=True) if not f.startswith(('assets/', 'changes/'))) + sorted(glob.glob('data/places/*.json')) + sorted(glob.glob('data/packs/*.json'))
plat, off, gk, gk_only, noind, tiered, n = [], [], collections.Counter(), collections.Counter(), collections.Counter(), [], 0
for f in files:
    s = open(f, encoding='utf8').read().replace('\\"', '"').replace('\\/', '/').replace('\\u003c', '<').replace('\\u003e', '>')
    noind[f] += s.count('No independent source yet')
    if f.endswith('.html'):   # a card with no independent recommender shows its kind, never a tier badge (orchestrator ruling, QA-87)
        for m in re.finditer(r'<li class="pl[^"]*" id="(p-[^"]+)"(.*?)</li>', s, re.S):
            if 'No independent source yet' in m.group(2) and re.search(r'class="tier\b', m.group(2)):
                tiered.append((f, m.group(1)))
    for m in re.finditer(r'<p class="pl-s"[^>]*><span class="lbl">Recommended by</span>(.*?)</p>', s, re.S):
        n += 1
        body = m.group(1)
        for k, t in re.findall(r'data-src="([^"]+)"[^>]*>([^<]*)<', body):
            if PLAT.search(k) or PLAT.search(t):
                plat.append((f, k, t))
            elif OFFICIAL.search(t) and f.endswith('.html'):
                off.append((f, k, t))
        if GK.search(re.sub(r'<[^>]+>', ' ', body)) or GK.search(body):
            gk[f] += 1
            if 'data-src=' not in body:
                gk_only[f] += 1
html = lambda c: {k: v for k, v in c.items() if v and k.endswith('.html')}
print(f'"Recommended by" paragraphs scanned: {n} in {len(files)} files')
print(f'  {"FAIL" if plat else "PASS"}  rating platform after the label: {len(plat)} {plat[:5]}')
print(f'  {"FAIL" if gk else "PASS"}  general knowledge after the label (built pages): {sum(html(gk).values())} {html(gk)}; with no independent recommender at all: {sum(html(gk_only).values())} {html(gk_only)}')
own = [x for x in off if x[1] not in PUBLIC_BODY]
print(f'  {"FAIL" if own else "PASS"}  "official" chip after the label that is not a reviewed public body (own site): {len(own)} {own[:5]}')
for k, c in collections.Counter((f, k, t) for f, k, t in off if k in PUBLIC_BODY).items():
    print(f'  INFO  reviewed public body after the label: {k[0]} {k[1]} "{k[2]}" ×{c}')
print(f'  {"FAIL" if tiered else "PASS"}  a "No independent source yet" card with a tier badge: {len(tiered)} {tiered[:5]}')
print(f'  INFO  "No independent source yet" cards (built pages): {sum(html(noind).values())} {html(noind)}')
sys.exit(1 if plat or gk or own or tiered else 0)
