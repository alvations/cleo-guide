#!/usr/bin/env python3
"""FE-C i18n: move tools/beta/i18n-fec/pending-en.json (+ pending-ja.json from the i18n lane) into the catalogues in ONE
step. Refuses unless pending-ja has exactly the pending-en keys with the same {placeholders}. FE-C never writes ja.
  python3 tools/beta/i18n-fec/merge.py            # merge, then apply the parked patches (git apply), then npm run beta
  python3 tools/beta/i18n-fec/merge.py --check    # report only"""
import json, re, sys, collections, os
D = os.path.dirname(os.path.abspath(__file__)); CAT = os.path.join(D, '..', 'i18n')
load = lambda p: json.load(open(p), object_pairs_hook=collections.OrderedDict)
pe, pj = load(os.path.join(D, 'pending-en.json'))['strings'], (load(os.path.join(D, 'pending-ja.json'))['strings'] if os.path.exists(os.path.join(D, 'pending-ja.json')) else {})
ph = lambda v: sorted(re.findall(r'\{[a-z]+\}', v))
miss = [k for k in pe if k not in pj]; extra = [k for k in pj if k not in pe]; badph = [k for k in pe if k in pj and ph(pe[k]) != ph(pj[k])]
print(f'{len(pe)} pending en keys; ja missing {len(miss)}, extra {len(extra)}, placeholder mismatches {len(badph)}')
if miss or extra or badph: print('  missing:', miss[:8], '\n  extra:', extra[:8], '\n  placeholders:', badph[:8]); sys.exit(1)
if '--check' in sys.argv: sys.exit(0)
for loc, src in (('en', pe), ('ja', pj)):
    p = os.path.join(CAT, loc + '.json'); j = load(p)
    for k, v in src.items():
        if k in j['strings'] and j['strings'][k] != v: sys.exit(f'{loc}: {k} already set differently')
        j['strings'][k] = v
    open(p, 'w').write(json.dumps(j, ensure_ascii=False, indent=2) + '\n')
print('merged into en.json and ja.json')
