#!/usr/bin/env python3
"""FE-C i18n (D-41) helper: rewrites client/server string literals to Cleo.t / t() and records the en strings.
Run once per file; each replacement asserts it matched exactly once. The en strings land in tools/beta/i18n/en.json."""
import json, sys, re, collections
EN = 'tools/beta/i18n/en.json'
def add_keys(keys):
    j = json.load(open(EN), object_pairs_hook=collections.OrderedDict)
    for k, v in keys.items():
        if k in j['strings'] and j['strings'][k] != v: raise SystemExit(f'key clash {k}: {j["strings"][k]!r} != {v!r}')
        j['strings'][k] = v
    open(EN, 'w').write(json.dumps(j, ensure_ascii=False, indent=2) + '\n')
def apply(path, reps):
    s = open(path).read()
    for a, b in reps:
        n = s.count(a)
        if n != 1: raise SystemExit(f'{path}: {n} matches for {a[:80]!r}')
        s = s.replace(a, b)
    open(path, 'w').write(s)
def keys_in(path):
    """every Cleo.t('k', 'English') literal in a file → {k: English}"""
    s = open(path).read(); out = {}
    for m in re.finditer(r"Cleo\.t\(\s*'([^']+)'\s*,\s*'((?:\\.|[^'\\])*)'", s):
        v = m.group(2).replace("\\'", "'")
        if m.group(1) in out and out[m.group(1)] != v: raise SystemExit(f'{path}: {m.group(1)} has two defaults')
        out[m.group(1)] = v
    return out
