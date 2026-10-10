'use strict';
/**
 * render/landing.js — the beta LANDING page (lane FE-B owns this template and client/landing.js).
 * Inventory-first: every live country and every city in it, with counts computed from the live pages.
 * Links go to the beta copy of each page — the new engine where migrated, the legacy mirror otherwise.
 */
const { esc } = require('../html');
const { head, siteBar, footer } = require('./common');

function cityCard(row) {
  const m = row.data.meta;
  const n = row.counts.P + row.counts.F;
  return `<li class="dest" data-page="${esc(row.key)}" data-gen="${row.gen}">
<a href="${esc(row.beta)}"><span class="dest-n">${esc(m.h1Main || row.key)}</span>
${m.h1Thin ? `<span class="dest-d">${esc(m.h1Thin)}</span>` : ''}
<span class="dest-c">${n} places · ${row.counts.P} sights · ${row.counts.F} to eat &amp; drink</span></a>
</li>`;
}

function render(reg, ctx) {
  const rows = reg.rows;
  const live = reg.countries.filter(c => c.live).sort((a, b) => a.order - b.order);
  const byKey = Object.fromEntries(rows.map(r => [r.live, r]));
  const places = rows.filter(r => r.kind === 'city');
  const total = places.reduce((s, r) => s + r.counts.P + r.counts.F, 0);

  const countrySections = live.map(c => {
    const pages = c.cityPages.map(p => byKey[p]).filter(r => r && r.kind === 'city');
    // Live pages of this country that its live hub doesn't link (e.g. thin Singapore towns): still listed,
    // so every place page is reachable from the landing.
    const more = places.filter(r => r.country === c.key && !pages.includes(r));
    const n = pages.concat(more).reduce((s, r) => s + r.counts.P + r.counts.F, 0);
    return `<section class="country" id="${esc(c.key)}" aria-labelledby="c-${esc(c.key)}">
<h2 id="c-${esc(c.key)}">${esc(c.name)} <span class="country-c">${pages.length + more.length} ${pages.length + more.length === 1 ? 'guide' : 'guides'} · ${n} places</span></h2>
${c.blurb ? `<p class="country-b">${esc(c.blurb)}</p>` : ''}
<ul class="dests">
${pages.map(cityCard).join('\n')}
</ul>
${more.length ? `<h3 class="more-h">More in ${esc(c.name)}</h3>\n<ul class="dests dests--more">\n${more.map(cityCard).join('\n')}\n</ul>` : ''}
</section>`;
  });

  const archive = byKey['Singapore/singapore-old.html'];
  const title = 'Cleo — sourced city guides';
  const desc = `${total} places across ${places.length} guides in ${live.length} countries — every one traceable to the source that recommended it, pinned and status-checked.`;
  return `${head({ page: 'landing', title, description: desc, rel: 'index.html', depth: 0, assetsV: ctx.assetsV, from: 'data/countries.json + every live place page',
    jsonld: { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Cleo', url: ctx.betaBase + '/',
      potentialAction: { '@type': 'SearchAction', target: ctx.betaBase + '/?q={q}', 'query-input': 'required name=q' } } })}
<body>
${siteBar({ depth: 0, current: 'landing' })}
<main id="main">
<header class="masthead">
  <h1>Where to go, and who says so</h1>
  <p class="stats"><strong>${total}</strong> places · ${places.length} guides · ${live.length} countries · every place sourced, pinned and status-checked</p>
</header>
<section class="results" id="results" aria-live="polite" hidden></section>
<div id="destinations">
${countrySections.join('\n')}
</div>
${archive && archive.gen !== 'none' ? `<p class="archive"><a href="${esc(archive.beta)}">Southeast Asia preview (archived index)</a></p>` : ''}
</main>
${footer({ depth: 0 })}
<script src="assets/js/landing.js?v=${ctx.assetsV.landing}" defer></script>
</body>
</html>
`;
}

module.exports = { render };
