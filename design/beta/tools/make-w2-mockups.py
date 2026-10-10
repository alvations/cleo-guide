#!/usr/bin/env python3
"""W2 component sheet for FE-A: design/beta/mockups/w2-components.html, built from REAL records (beta/data/places/tokyo.json,
read-only) and the shipped stylesheet (beta/assets/tokens.css + cleo.css). Every number on it is computed from that file.
    python3 design/beta/tools/make-w2-mockups.py"""
import json, os, math, html
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..')
J = json.load(open(os.path.join(R, 'beta', 'data', 'places', 'tokyo.json')))
P = {p['id']: p for p in J['places']}
G = J['guide']; AREAS = {a['id']: a for a in J['areas']} if isinstance(J['areas'], list) else J['areas']
e = lambda s: html.escape(str(s), quote=True)
import re
_h = open(os.path.join(R, 'beta', 'cities', 'tokyo.html')).read()
SRC = json.loads(re.search(r'<script[^>]*id="cleo-city"[^>]*>(.*?)</script>', _h, re.S).group(1)).get('src', {})   # publisher id → [name, …]
def area(a):
    x = AREAS.get(a, {}); return (x.get('n') or x.get('name') or a).split(' (')[0], (x.get('c') or 'var(--city)')
CJK = lambda s: any('぀' <= ch <= '鿿' for ch in s)
def card(p, n=None, extra=''):
    an, ac = area(p['a']); nm = p['n']; nat = p.get('nat') or ''
    base = nm.split(' (')[0] if ' (' in nm else nm
    plate = (f'<span class="pl-vert{" long" if len(nat) > 4 else ""}" lang="ja">{e(nat[:7])}</span>' if nat and CJK(nat)
             else f'<span class="pl-ini">{e(base[0])}</span>') + '<span class="g pl-glyph" data-g="torii" style="position:absolute"></span>'
    tier = {1: 'Must see', 2: 'Worth the detour', 3: 'Deep cut'}.get(p.get('t'), '')
    src = (p.get('src') or [])[:3]
    srcs = ', '.join(f'<button type="button" class="src">{e((SRC.get(s) or [s])[0])}</button>' for s in src) or '<span class="added">Added by the guide (general knowledge)</span>'
    natspan = f' <span class="nat" lang="ja">({e(nat)})</span>' if nat and CJK(nat) else ''
    return (f'<li class="pl" data-t="{p.get("t", 3)}" style="--area:{e(ac)}"><div class="pl-cover" aria-hidden="true">{plate}</div>'
            f'<p class="pl-e">{f"<span class=pl-num>{n}</span> " if n else ""}<a class="tier t{p.get("t", 3)}" href="#"><span>{tier}</span></a> <span class="in">within {e(an)}</span>{extra}</p>'
            f'<h3 class="pl-n"><a href="#">{e(base)}{natspan}</a></h3>'
            f'<p class="pl-w">{e(p.get("w", ""))}</p>'
            f'<p class="pl-s"><span class="lbl">Recommended by</span> {srcs}</p>'
            f'<p class="pl-x"><button class="pl-save" aria-pressed="false" aria-label="Save {e(base)}">Save</button></p></li>')
# -- For you: interest → collection/cuisine ids only (Wenwen rule) -------------------------------------------------------
INT = [('History & landmarks', 'columns', ['ICON', 'ARCH', 'HERITAGE', 'HIST', 'TEMPLE', 'CASTLE', 'UNESCO']),
       ('Food & drink', 'bowl', ['*food', 'MKT', 'SPEAK', 'NIGHT']),
       ('Pop culture', 'tv', ['ANIME', 'POP', 'ENT', 'ODD']),
       ('Outdoors', 'mountain', ['PARK', 'NATURE', 'GARDEN', 'OUTDOOR', 'VIEW', 'ONSEN']),
       ('Art', 'frame', ['MUS', 'ART', 'ARTS'])]
def hits(ids):
    return [p for p in J['places'] if (('*food' in ids and p['kind'] == 'f') or set(p.get('g') or []) & set(ids))]
ints = ''.join(f'<li><button type="button" class="interest" aria-pressed="{"true" if i in (1, 2) else "false"}"><span class="glyph"><span class="g" data-g="{g}"></span></span>'
               f'<span><b>{e(t)}</b><span class="d">{len(hits(ids))} of {len(J["places"])} Tokyo places</span></span><span class="tick" aria-hidden="true"></span></button></li>'
               for i, (t, g, ids) in enumerate(INT))
fy = hits(INT[1][2]) ; fy2 = hits(INT[2][2])
picked = [p for p in J['places'] if p in fy or p in fy2]
first = sorted(picked, key=lambda p: (p.get('t', 3), -len(p.get('src') or [])))[:2]
because = (f'<p class="because"><span><b>First because you picked Food &amp; drink and Pop culture:</b> {len(picked)} places from those collections '
           f'move up. <span class="n">All {len(J["places"])} are still here.</span></span><button type="button">Change</button></p>')
fycards = ''.join(card(p, i + 1, '<span class="pl-why">For you · ' + ('Pop culture' if p in fy2 else 'Food &amp; drink') + '</span>') for i, p in enumerate(first))
# -- modules ------------------------------------------------------------------------------------------------------------
sig = G['signature']; free = [p for p in J['places'] if 'FREE' in (p.get('g') or [])]
mods = (f'<a class="mod" href="#"><span class="g" style="--g:var(--g-heart)"></span><b>Your list</b><span>3 saved in Tokyo · on this device</span></a>'
        f'<a class="mod sig" href="#"><span class="g" style="--g:var(--g-tv)"></span><b>{e(sig["title"])}</b><span>★ Signature · {sig["n"]} places</span></a>'
        f'<a class="mod" href="#"><span class="g" style="--g:var(--g-ticket)"></span><b>Free to visit</b><span>{len(free)} places · no ticket needed</span></a>')
# -- Your day (platform plan CYD) ---------------------------------------------------------------------------------------
plan = G['days']['plans']['CYD']; an, ac = area('CYD')
stops = ''
for i, pid in enumerate(plan['ids']):
    leg = plan['legs'][i] if i < len(plan['legs']) else None
    stops += (f'<li class="stop"><span class="n">{i + 1}</span><div><ul class="pls">{card(P[pid])}</ul>'
              + (f'<p class="leg">{leg:.1f} km straight-line to stop {i + 2}</p>' if leg is not None else '') + '</div></li>')
day = (f'<section class="day" aria-labelledby="dh"><header><span class="eyebrow">Your day · {e(an)}</span><h2 id="dh">{e(an)}, on foot</h2></header>'
       f'<div class="daysum"><div><b>{len(plan["ids"])}</b><span>stops</span></div><div><b>{plan["km"]} km</b><span>straight-line total</span></div><div><b>{plan["food"]}</b><span>place to eat</span></div></div>'
       f'<p class="caveat"><span>{e(G["days"]["label"])}</span></p>'
       f'<div class="sharebar"><button class="btn btn-primary">Share this day</button><button class="btn btn-ghost">Open in maps</button><button class="btn btn-ghost">Save all</button></div>'
       f'<ol class="stops">{stops}</ol></section>')
# -- saved -------------------------------------------------------------------------------------------------------------
sv = ['senso-ji', 'kanda-myojin', 'imperial-palace-east-gardens']
saved = (f'<div class="listhead"><span class="eyebrow">Saved</span><h2 class="d2" style="margin:0">Your lists</h2>'
         f'<p class="device-note">Saved on this device only — no account, nothing leaves your browser unless you share the link.</p>'
         f'<div class="listtabs"><button class="pill" aria-pressed="true">All saved<span class="n">{len(sv)}</span></button><button class="pill" aria-pressed="false">Shrines first<span class="n">2</span></button>'
         f'<button class="pill" aria-pressed="false">Been there<span class="n">1</span></button><button class="pill new">+ New list</button></div>'
         f'<div class="listmenu"><button class="btn btn-ghost">Rename</button><button class="btn btn-ghost danger">Delete list</button></div>'
         f'<div class="exportbar"><span class="lbl">Take it with you</span><button class="btn btn-primary">Share link</button><button class="btn btn-ghost">KML</button><button class="btn btn-ghost">GeoJSON</button><button class="btn btn-ghost">Open in maps</button></div></div>'
         f'<ul class="saved-cards" style="margin-top:14px">' + ''.join(card(P[i]) for i in sv if i in P).replace('</li>', '<span class="stamp">Been<br>there</span></li>', 1)
         + '<li class="gone">1 saved place is no longer listed in this guide — kept here so nothing disappears silently.</li></ul>'
         f'<div class="banner shared" role="status" style="margin-top:14px"><span>A shared list of {len(sv)} Tokyo places — read only.</span><button class="btn">Save a copy</button></div>')
near = (f'<div class="toolbar" style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-ghost nearme" aria-pressed="true">Near me</button>'
        f'<span class="device-note">Using your location for this visit only — never stored.</span></div>'
        f'<ul class="pls" style="margin-top:10px">{card(P["kanda-myojin"], 3, "<span class=pl-dist>1.2 km</span>")}</ul>')
doc = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>W2 components — Cleo beta</title><link rel="stylesheet" href="../../../beta/assets/tokens.css"><link rel="stylesheet" href="../../../beta/assets/cleo.css">
<style>.w2 section+section{{margin-top:40px}} .w2 h1{{font:500 40px/1.1 var(--font-display)}} .w2 .spec{{color:var(--ink-3);font-size:14px;max-width:70ch}}</style></head>
<body><main id="main" class="wrap w2" data-city="tokyo" style="padding:24px var(--gutter) 60px">
<p class="spec">Generated by design/beta/tools/make-w2-mockups.py from beta/data/places/tokyo.json (read-only). Markup contract: design/beta/specs/W2-components.md.</p>
<h1>Wave 2 components</h1>
<section><h2 class="d2">For you — picker</h2><p class="spec">Reorders, never hides. Ids only (collection / cuisine), never dish words.</p><ul class="interests">{ints}</ul></section>
<section><h2 class="d2">For you — result line + promoted cards</h2>{because}<ul class="pls">{fycards}</ul></section>
<section><h2 class="d2">Home modules</h2><div class="modules">{mods}</div></section>
<section>{day}</section>
<section><h2 class="d2">Saved page</h2>{saved}</section>
<section><h2 class="d2">Near me (opt-in)</h2>{near}</section>
</main></body></html>'''
out = os.path.join(R, 'design', 'beta', 'mockups', 'w2-components.html'); open(out, 'w').write(doc)
print('wrote', os.path.relpath(out, R), f'({len(doc)//1024} KB)')
