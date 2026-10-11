#!/usr/bin/env python3
"""W7 designer: build design/beta/style/v2/board.html — one self-contained page comparing the palette directions
(swatches light + dark, accent in use, scores) with the real-page mockups (relative links to directions/shots/), the type
specimen, the icon set and the no-photo cover, for the owner's review.
    python3 design/beta/style/v2/tools/board.py"""
import json, os, html
V2 = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
C = json.load(open(os.path.join(V2, 'directions', 'contrast.json')))
S = json.load(open(os.path.join(V2, 'scores.json')))
icons = json.load(open(os.path.join(V2, 'icons', 'icons.json')))
W = S['winner']; ORDER = ['juniper', 'oxblood', 'petrol', 'ember']; LET = dict(zip(ORDER, 'ABCD'))
SW = ['paper', 'surface', 'sand', 'line', 'ink-3', 'ink-2', 'ink', 'accent', 'accent-wash']
VIEWS = [('landing', 'Landing'), ('hub', 'Country hub'), ('gallery', 'City · Gallery'), ('atlas', 'City · Atlas'), ('place', 'Place detail')]
e = html.escape
def swatches(t):
    return ''.join(f'<div class="sw"><i style="background:{t[k]}"></i><span>{k}</span><code>{t[k]}</code></div>' for k in SW)
def demo(t, mode):
    # the accent where it is spent, on the direction's own ground: wordmark star, a card with a saved heart, the count dot
    return f'''<div class="demo" style="--p:{t['paper']};--s:{t['sand']};--i:{t['ink']};--i2:{t['ink-2']};--i3:{t['ink-3']};--a:{t['accent']};--l:{t['line']};--su:{t['surface']}">
<div class="dbar"><b><svg viewBox="0 0 24 24" class="star"><path d="M12 2.5l2.2 7.3 7.3 2.2-7.3 2.2L12 21.5l-2.2-7.3L2.5 12l7.3-2.2z"/></svg>cleo</b><span class="seg"><em>Gallery</em><span>Atlas</span></span><span class="hc">♥<sup>3</sup></span></div>
<div class="dcard"><div class="dcov"><svg viewBox="0 0 24 24">{icons['torii']}</svg><small>神田明神</small><span class="hrt"><svg viewBox="0 0 24 24"><path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10C19.5 15.4 12 20 12 20z"/></svg></span></div>
<b>Kanda Myōjin</b><span>Chiyoda-ku · Shrine</span><span class="rb">Recommended by 3</span></div>
<div class="dbtn"><span class="pri">Directions</span><span class="sec">Share</span></div><div class="mode">{mode}</div></div>'''
dirs = ''
for k in ORDER:
    d = C['directions'][k]; sc = S['directions'][k]; tot = sum(sc['scores'])
    shots = ''.join(f'<figure><figcaption>{lab}</figcaption><div class="pair"><a href="directions/shots/{k}/{v}-d-light.jpg"><img loading="lazy" src="directions/shots/{k}/{v}-d-light.jpg" alt="{e(d["name"])} — {lab}, desktop, light"></a>'
                    f'<a href="directions/shots/{k}/{v}-m-light.jpg"><img loading="lazy" class="m" src="directions/shots/{k}/{v}-m-light.jpg" alt="{e(d["name"])} — {lab}, phone, light"></a>'
                    f'<a href="directions/shots/{k}/{v}-m-dark.jpg"><img loading="lazy" class="m" src="directions/shots/{k}/{v}-m-dark.jpg" alt="{e(d["name"])} — {lab}, phone, dark"></a></div></figure>' for v, lab in VIEWS)
    dirs += f'''<section class="dir{' win' if k == W else ''}" id="{k}"><header><h2><span class="let">{LET[k]}</span>{e(d['name'])}{' <span class="badge">Chosen</span>' if k == W else ''}</h2>
<p class="score"><b>{tot}</b>/90 · AA {('0 fails' if d['fails'] == 0 else str(d['fails']) + ' fails')} · lowest text ratio {d['min_text_ratio']}:1</p></header>
<p class="line">{e(d['line'])}</p><p class="note">{e(sc['note'])}</p>
<div class="modes"><div><h3>Light</h3><div class="sws">{swatches(d['light'])}</div>{demo(d['light'], 'light')}</div>
<div><h3>Dark</h3><div class="sws">{swatches(d['dark'])}</div>{demo(d['dark'], 'dark')}</div></div>
<details><summary>Mockups on the real pages · 1440 light, 390 light, 390 dark</summary><div class="shots">{shots}</div></details></section>'''
rows = ''.join(f'<tr><th>{c}</th>' + ''.join(f'<td{" class=w" if k == W else ""}>{S["directions"][k]["scores"][i]}</td>' for k in ORDER) + '</tr>' for i, c in enumerate(S['criteria']))
rows += '<tr class="tot"><th>Total of 90</th>' + ''.join(f'<td{" class=w" if k == W else ""}>{sum(S["directions"][k]["scores"])}</td>' for k in ORDER) + '</tr>'
icon_cells = ''.join(f'<figure><svg viewBox="0 0 24 24">{v}</svg><figcaption>{n}</figcaption></figure>' for n, v in icons.items())
w = C['directions'][W]['light']
page = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Design system v2</title><meta name="description" content="W7 palette directions, type, icons and covers for the Cleo beta, scored, with the chosen direction.">
<style>
@font-face{{font-family:"Inter";src:url("../../../../beta/assets/fonts/inter-normal-latin.woff2") format("woff2");font-weight:400 700}}
@font-face{{font-family:"Inter";src:url("../../../../beta/assets/fonts/inter-normal-latin-ext.woff2") format("woff2");font-weight:400 700;unicode-range:U+0100-017F,U+01CD-01DC,U+0218-021B,U+0304,U+0308,U+0329}}
@font-face{{font-family:"Inter";src:url("../../../../beta/assets/fonts/inter-normal-vietnamese.woff2") format("woff2");font-weight:400 700;unicode-range:U+0102-0103,U+0110-0111,U+0128-0129,U+0168-0169,U+01A0-01A1,U+01AF-01B0,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+1EA0-1EF9,U+20AB}}
@font-face{{font-family:"Inter Display";src:url("../../../../beta/assets/fonts/interdisplay-normal-latin.woff2") format("woff2");font-weight:500 700}}
:root{{--paper:{w['paper']};--surface:{w['surface']};--sand:{w['sand']};--ink:{w['ink']};--ink-2:{w['ink-2']};--ink-3:{w['ink-3']};--line:{w['line']};--accent:{w['accent']}}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--paper:#131110;--surface:#1C1918;--sand:#262220;--ink:#F2EEEA;--ink-2:#D0C9C3;--ink-3:#A69E97;--line:#302B28;--accent:#E0A19A}}}}
:root[data-theme="dark"]{{--paper:#131110;--surface:#1C1918;--sand:#262220;--ink:#F2EEEA;--ink-2:#D0C9C3;--ink-3:#A69E97;--line:#302B28;--accent:#E0A19A}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--paper);color:var(--ink);font:16px/1.5 Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased}}
.wrap{{max-width:1240px;margin:0 auto;padding:40px 16px 80px}}h1,h2{{font-family:"Inter Display",Inter,sans-serif;font-weight:600;letter-spacing:-.025em;margin:0}}
h1{{font-size:clamp(32px,5vw,52px);line-height:1.05}}h2{{font-size:26px;display:flex;align-items:center;gap:12px;flex-wrap:wrap}}h3{{font-size:13px;font-weight:600;color:var(--ink-3);margin:0 0 8px}}
.lede{{color:var(--ink-2);max-width:62ch;font-size:18px;margin:12px 0 28px}}a{{color:inherit}}
nav.toc{{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 40px}}nav.toc a{{text-decoration:none;border:1px solid var(--line);border-radius:999px;padding:10px 16px;min-height:44px;display:inline-flex;align-items:center;font-weight:500;font-size:15px}}
section{{border-top:1px solid var(--line);padding:36px 0}}.let{{display:inline-grid;place-items:center;width:34px;height:34px;border-radius:50%;border:1px solid var(--line);font-size:15px;font-family:Inter}}
.badge{{font:600 12px/1 Inter;letter-spacing:.04em;border:1px solid var(--accent);color:var(--accent);padding:6px 10px;border-radius:999px}}
.score{{color:var(--ink-2);margin:6px 0 0}}.score b{{color:var(--ink);font-size:20px}}.line{{font-size:17px;margin:14px 0 4px;max-width:70ch}}.note{{color:var(--ink-2);margin:0 0 20px;max-width:70ch}}
.modes{{display:grid;gap:24px;grid-template-columns:1fr}}@media(min-width:900px){{.modes{{grid-template-columns:1fr 1fr}}}}
.sws{{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:8px;margin-bottom:12px}}.sw{{font-size:12px;display:grid;gap:2px}}.sw i{{display:block;height:44px;border-radius:8px;border:1px solid rgba(128,128,128,.25)}}.sw span{{color:var(--ink-2)}}.sw code{{color:var(--ink-3);font-size:11px}}
.demo{{background:var(--p);color:var(--i);border-radius:16px;padding:16px;border:1px solid var(--l);position:relative}}.dbar{{display:flex;align-items:center;justify-content:space-between;gap:8px;padding-bottom:12px;border-bottom:1px solid var(--l);margin-bottom:14px}}
.dbar b{{font:600 20px/1 "Inter Display",Inter;letter-spacing:-.035em;display:flex;align-items:center;gap:6px}}.star{{width:16px;height:16px;fill:var(--a)}}
.seg{{background:var(--s);border-radius:999px;padding:3px;display:flex;font-size:13px}}.seg>*{{padding:6px 12px;border-radius:999px;font-style:normal;color:var(--i2)}}.seg em{{background:var(--su);color:var(--i);font-weight:500}}
.hc{{font-size:18px;position:relative}}.hc sup{{background:var(--a);color:var(--p);border-radius:999px;font-size:10px;padding:2px 5px;margin-left:2px}}
.dcard{{display:grid;gap:1px;max-width:260px;font-size:14px}}.dcard span{{color:var(--i2)}}.dcard .rb{{color:var(--i3)}}.dcard b{{font-weight:600;font-size:15px;margin-top:8px}}
.dcov{{position:relative;aspect-ratio:4/3;background:var(--s);border-radius:14px;display:grid;place-items:center}}.dcov svg{{width:30px;height:30px;fill:none;stroke:var(--i3);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}}
.dcov small{{position:absolute;left:14px;bottom:12px;font-size:12px;color:var(--i3);letter-spacing:.04em}}.hrt{{position:absolute;top:10px;right:10px;width:34px;height:34px;border-radius:50%;background:var(--su);display:grid;place-items:center}}.hrt svg{{width:18px;height:18px;fill:var(--a);stroke:var(--a)}}
.dbtn{{display:flex;gap:8px;margin-top:14px}}.dbtn span{{padding:10px 16px;border-radius:8px;font-size:14px;font-weight:500}}.pri{{background:var(--i);color:var(--p)}}.sec{{border:1px solid var(--l)}}.mode{{position:absolute;right:14px;bottom:12px;font-size:11px;color:var(--i3)}}
details{{margin-top:20px}}summary{{cursor:pointer;font-weight:600;min-height:44px;display:flex;align-items:center}}.shots{{display:grid;gap:22px;margin-top:12px}}
figure{{margin:0}}figcaption{{font-size:13px;color:var(--ink-3);margin-bottom:6px}}.pair{{display:grid;grid-template-columns:4fr 1fr 1fr;gap:10px;align-items:start}}.pair img{{width:100%;height:auto;border-radius:10px;border:1px solid var(--line);display:block}}
@media(max-width:700px){{.pair{{grid-template-columns:1fr 1fr}}.pair a:first-child{{grid-column:1/-1}}}}
table{{border-collapse:collapse;width:100%;font-size:15px;font-variant-numeric:tabular-nums}}th,td{{padding:10px 8px;border-bottom:1px solid var(--line);text-align:right}}th{{text-align:left;font-weight:500;color:var(--ink-2)}}td.w{{font-weight:600;color:var(--ink)}}tr.tot td,tr.tot th{{font-weight:600;color:var(--ink);font-size:17px}}
thead th{{text-align:right;color:var(--ink)}}thead th:first-child{{text-align:left}}.tbl{{overflow-x:auto}}
.icons{{display:grid;grid-template-columns:repeat(auto-fill,minmax(84px,1fr));gap:1px;background:var(--line);border:1px solid var(--line);border-radius:12px;overflow:hidden}}
.icons figure{{background:var(--paper);display:grid;place-items:center;gap:6px;padding:14px 4px 10px}}.icons svg{{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}}.icons figcaption{{font-size:11px;margin:0}}
.spec img{{max-width:100%;height:auto;border-radius:12px;border:1px solid var(--line)}}
.covers{{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:20px}}.cv{{display:grid;gap:1px;font-size:14px}}.cv .m{{aspect-ratio:4/3;border-radius:14px;background:var(--sand);display:grid;place-items:center;position:relative}}
.cv .m svg{{width:30px;height:30px;fill:none;stroke:var(--ink-3);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}}.cv .m small{{position:absolute;left:14px;bottom:12px;font-size:12px;color:var(--ink-3);letter-spacing:.04em}}
.cv .m.ph{{background:repeating-linear-gradient(135deg,var(--line) 0 1px,transparent 1px 12px),var(--sand)}}.cv .m.ph span{{font-size:12px;color:var(--ink-3);background:var(--paper);padding:4px 8px;border-radius:999px}}
.cv b{{font-weight:600;margin-top:8px}}.cv span.s{{color:var(--ink-2)}}.cv .closed{{display:inline-block;margin-top:4px;font-size:12px;font-weight:600;border:1px solid var(--line);border-radius:999px;padding:2px 8px;width:max-content}}
.toggle{{position:fixed;right:16px;bottom:16px;border:1px solid var(--line);background:var(--surface);color:var(--ink);border-radius:999px;min-height:44px;padding:0 16px;font:500 14px Inter}}
</style></head><body><div class="wrap">
<h1>Design system v2</h1><p class="lede">Four palette directions on the real beta pages. Each has the same single sans, the same quiet components and one accent spent sparingly. The scores, the type re-decision, the icon set and the calm no-photo cover follow. <b>Chosen: B · Bone &amp; Oxblood.</b></p>
<nav class="toc">{''.join(f'<a href="#{k}">{LET[k]} · {e(C["directions"][k]["name"])}</a>' for k in ORDER)}<a href="#scores">Scores</a><a href="#type">Type</a><a href="#icons">Icons</a><a href="#covers">No-photo cover</a></nav>
{dirs}
<section id="scores"><h2>Scores</h2><p class="note">1–10 per criterion, on the same v2 type and component layer. AA is measured: 46 pairs per direction across light and dark, with 0 fails for each direction.</p>
<div class="tbl"><table><thead><tr><th>Criterion</th>{''.join(f'<th>{LET[k]} {e(C["directions"][k]["name"])}</th>' for k in ORDER)}</tr></thead><tbody>{rows}</tbody></table></div></section>
<section id="type"><h2>Type: one family</h2><p class="note"><b>Inter</b> sets UI and body at 400, 500 and 600 with tabular figures. <b>Inter Display</b> (opsz 32) sets headings ≥ 22 px at −0.024 em. Playfair and every italic voice are retired. Five OFL faces with Vietnamese were compared against all 215 non-CJK characters the beta sets: Inter is the only one with zero missing characters plus tabular figures.</p>
<div class="spec"><img loading="lazy" src="type/specimen.png" alt="Specimen: Inter, Plus Jakarta Sans, Hanken Grotesk, Manrope and Be Vietnam Pro, with Vietnamese, macrons, figures and weights"></div></section>
<section id="icons"><h2>Line icons</h2><p class="note">{len(icons)} icons on a 24 px grid with a 1.5 stroke and round caps. Every subject is generic, never a venue.</p><div class="icons">{icon_cells}</div></section>
<section id="covers"><h2>The calm no-photo cover</h2><p class="note">A quiet sand ground with one small kind glyph and the name set in type. It uses the same rounded box as a credited photo, so the two sit side by side without either pretending to be the other. Closed places keep a calm, unmistakable label.</p>
<div class="covers">
<div class="cv"><div class="m"><svg viewBox="0 0 24 24">{icons['torii']}</svg><small>神田明神</small></div><b>Kanda Myōjin</b><span class="s">Chiyoda-ku · Shrine</span><span class="s">Recommended by 3</span></div>
<div class="cv"><div class="m ph"><span>Credited photo slot</span></div><b>A place with a photo</b><span class="s">Area · Kind</span><span class="s">Recommended by 2</span></div>
<div class="cv"><div class="m"><svg viewBox="0 0 24 24">{icons['noodles']}</svg><small>Phở Hòa Pasteur</small></div><b>Phở Hòa Pasteur</b><span class="s">Quận 3 · Phở</span><span class="s">Recommended by 4</span></div>
<div class="cv"><div class="m"><svg viewBox="0 0 24 24">{icons['columns']}</svg></div><b>A closed place</b><span class="s">Area · Museum</span><span class="closed">Closed · kept for the record</span></div>
</div></section>
<p class="note">Sources: RESEARCH.md · directions/README.md · scores.json · DECISION.md. Generated by tools/board.py.</p></div>
<button class="toggle" type="button" onclick="var r=document.documentElement;r.dataset.theme=r.dataset.theme==='dark'?'light':'dark'">Light / dark</button>
</body></html>'''
open(os.path.join(V2, 'board.html'), 'w').write(page)
print('board.html', len(page) // 1024, 'KB')
