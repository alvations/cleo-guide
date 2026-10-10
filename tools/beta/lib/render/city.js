'use strict';
/**
 * render/city.js — the beta CITY page (lane FE-A owns this template and tools/beta/client/city.js).
 *
 * Every place is server-rendered as a card, in area order, so the page is complete with no JS and no
 * network: filters, the map and saved lists are progressive enhancement over this list. The client reads
 * the cards (and a compact geo index) — it never needs a second copy of the content.
 */
const { esc, prose } = require('../html');
const { sourceLabel, TIER } = require('../model');
const { head, siteBar, footer, BETA_BASE } = require('./common');

const shortArea = n => String(n || '').split(/\s+[(—–]\s*|\s+\(/)[0].trim();
const cites = (r, reg) => new Set(r.s.map(x => (reg[x[0]] || {}).k || x[0])).size;

function order(recs, page) {
  const areaIdx = Object.fromEntries((page.AREAS || []).map((a, i) => [a.id, i]));
  return recs.slice().sort((x, y) =>
    (areaIdx[x.a] ?? 999) - (areaIdx[y.a] ?? 999)
    || (x.closed ? 1 : 0) - (y.closed ? 1 : 0)
    || x.t - y.t
    || cites(y, y.kind === 'food' ? page.FS : page.S) - cites(x, x.kind === 'food' ? page.FS : page.S)
    || 0);
}

function card(r, page) {
  const reg = r.kind === 'food' ? page.FS || {} : page.S || {};
  const area = (page.AREAS || []).find(a => a.id === r.a);
  const czN = r.cz.map(id => ((page.CUISINES || []).find(c => c.id === id) || {}).n).filter(Boolean);
  const eyebrow = [r.closed ? 'Closed — kept for the record' : TIER[r.t], r.kind === 'food' && czN[0], area && shortArea(area.n)]
    .filter(Boolean).map(esc).join(' · ');
  const srcs = r.s.map(([k, u]) => {
    const label = esc(sourceLabel(reg, k));
    return u ? `<a href="${esc(u)}" rel="noopener">${label}</a>` : label;
  }).join(', ');
  // BETA-DECISIONS D-16: "Your guide's note" only when k reads as prose (sentence punctuation, > 6 words).
  const kText = String(r.k || '').replace(/<[^>]+>/g, ' ').trim();
  const isProse = /[.!?…)”"]$/.test(kText) && kText.split(/\s+/).length > 6;
  const know = r.k ? `<p class="pl-k"><span class="lbl">${isProse ? 'Your guide’s note' : 'Look for'}</span> ${prose(r.k)}</p>` : '';
  const ll = r.la != null && r.ln != null ? ` data-ll="${r.la},${r.ln}"` : '';
  const checked = r.pv && r.pv.checked ? ` data-checked="${esc(r.pv.checked)}"` : '';
  return `<li class="pl${r.closed ? ' pl--closed' : ''}" id="p-${esc(r.id)}" data-k="${r.kind === 'food' ? 'f' : 's'}" data-t="${r.t}" data-a="${esc(r.a)}"${r.g.length ? ` data-g="${esc(r.g.join(' '))}"` : ''}${r.cz.length ? ` data-cz="${esc(r.cz.join(' '))}"` : ''}${ll}${checked}${r.closed ? ' data-closed' : ''}>
<p class="pl-e">${eyebrow}</p>
<h3 class="pl-n"><a href="#p-${esc(r.id)}">${esc(r.n)}</a></h3>
${r.w ? `<p class="pl-w">${prose(r.w)}</p>` : ''}${know}
${r.ad ? `<p class="pl-ad">${esc(r.ad)}</p>` : ''}
<p class="pl-s"><span class="lbl">Recommended by</span> ${srcs}</p>
<p class="pl-x" hidden><button type="button" class="pl-save" aria-pressed="false">Save</button></p>
</li>`;
}

function jsonLd(row, recs, title) {
  const url = BETA_BASE + '/' + row.beta;
  const open = recs.filter(r => !r.closed);
  return {
    '@context': 'https://schema.org', '@type': 'ItemList', name: title, url, numberOfItems: open.length,
    itemListElement: open.map((r, i) => ({
      '@type': 'ListItem', position: i + 1,
      item: Object.assign({ '@type': r.kind === 'food' ? 'Restaurant' : 'TouristAttraction', name: r.n, url: url + '#p=' + r.id },
        r.ad ? { address: r.ad } : {},
        r.la != null ? { geo: { '@type': 'GeoCoordinates', latitude: r.la, longitude: r.ln } } : {}),
    })),
  };
}

function render(row, recs, ctx) {
  const page = row.data;
  const m = page.meta;
  const name = m.h1Main || row.key;
  const sorted = order(recs, page);
  const nS = recs.filter(r => r.kind === 'sight').length, nF = recs.length - nS;
  const areas = (page.AREAS || []).filter(a => recs.some(r => r.a === a.id));
  const checked = recs.map(r => r.pv && r.pv.checked).filter(Boolean).sort().pop();
  const nSrc = new Set(recs.flatMap(r => r.s.map(x => x[0]))).size;
  const title = `${name} — ${recs.length} sourced places · Cleo`;
  const desc = `${name}: ${nS} sights and ${nF} places to eat and drink, every one traceable to the source that recommended it, pinned and status-checked.`;
  const depth = row.beta.split('/').length - 1;

  const coll = [
    ...(page.CATS || []).map(c => ({ key: 'c', id: c.id, n: c.n, count: recs.filter(r => r.g.includes(c.id)).length })),
    ...(page.CUISINES || []).map(c => ({ key: 'cz', id: c.id, n: c.n, count: recs.filter(r => r.cz.includes(c.id)).length })),
  ].filter(c => c.count > 0);

  const sections = areas.map(a => {
    const list = sorted.filter(r => r.a === a.id);
    return `<section class="area" id="area-${esc(a.id)}" data-area="${esc(a.id)}" aria-labelledby="ah-${esc(a.id)}">
<h2 id="ah-${esc(a.id)}"><span class="area-n">${esc(shortArea(a.n))}</span> <span class="area-c">${list.length}</span></h2>
${a.n !== shortArea(a.n) ? `<p class="area-sub">${esc(a.n.slice(shortArea(a.n).length).replace(/^[\s(—–]+|\)$/g, ''))}</p>` : ''}
<ol class="pls">
${list.map(r => card(r, page)).join('\n')}
</ol>
</section>`;
  });
  // A record whose area id is missing from AREAS still has to be shown: file it under "Elsewhere".
  const orphan = sorted.filter(r => !areas.some(a => a.id === r.a));
  if (orphan.length) sections.push(`<section class="area" id="area-other" data-area="" aria-labelledby="ah-other">
<h2 id="ah-other"><span class="area-n">Elsewhere</span> <span class="area-c">${orphan.length}</span></h2>
<ol class="pls">
${orphan.map(r => card(r, page)).join('\n')}
</ol>
</section>`);

  const geo = {
    v: 1, key: row.key, name, center: ctx.center,
    areas: Object.fromEntries((page.AREAS || []).map(a => [a.id, { n: shortArea(a.n), c: a.c || (page.AC || {})[a.id] || null }])),
  };

  return `${head({ page: 'city', title, description: desc, rel: row.beta, depth, ogImage: ctx.ogImage, jsonld: jsonLd(row, recs, title), assetsV: ctx.assetsV, from: row.live })}
<body>
${siteBar({ depth, current: 'city', rel: row.beta })}
<main id="main" data-city="${esc(row.key)}">
<header class="masthead">
  <p class="eyebrow">${esc(m.eyebrow || '')}</p>
  <h1>${esc(name)}</h1>
  ${m.h1Thin ? `<p class="dek">${esc(m.h1Thin)}</p>` : ''}
  <p class="stats"><strong>${recs.length}</strong> places · ${nS} sights · ${nF} to eat &amp; drink · ${areas.length} areas · ${nSrc} sources${checked ? ` · status last checked ${esc(checked)}` : ''}</p>
</header>
<nav class="rail" aria-label="Collections" data-cleo-rail hidden>
  <button type="button" class="rail-i rail-all" data-cleo-all>All <span class="n">${recs.length}</span></button>
${coll.map(c => `  <button type="button" class="rail-i" data-${c.key}="${esc(c.id)}">${esc(c.n)} <span class="n">${c.count}</span></button>`).join('\n')}
</nav>
<div class="toolbar" data-cleo-toolbar hidden></div>
<div class="split">
<div class="listpane">
<nav class="areanav" aria-label="Areas">
${areas.map(a => `  <a href="#area-${esc(a.id)}">${esc(shortArea(a.n))}</a>`).join('\n')}
</nav>
${sections.join('\n')}
</div>
<aside class="mappane" aria-label="Map">
  <div id="cleo-map" class="map"><p class="map-fallback">The map appears when it can load. Every place is listed here either way.</p></div>
</aside>
</div>
${m.standfirst ? `<section class="about" aria-label="About this guide"><p>${esc(m.standfirst.replace(/\s*Switch modes below[\s\S]*$/, ''))}</p></section>` : ''}
</main>
${footer({ depth, liveRel: row.live, notes: page.notes })}
<script type="application/json" id="cleo-city">${require('../html').jsonInline(geo)}</script>
<script src="${'../'.repeat(depth)}assets/js/city.js?v=${ctx.assetsV.city}" defer></script>
</body>
</html>
`;
}

module.exports = { render, jsonLd, shortArea };
