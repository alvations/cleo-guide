'use strict';
/**
 * render/landing.js — the beta LANDING page (lane FE-B: this template + client/landing.js). M1-17.
 * Inventory-first: a short night hero with the site search, then every live country (countries.json order,
 * live only) and every place page in it as a city tile with computed counts and its signature line.
 * Links go to the beta copy of each page — the new engine where migrated, the legacy mirror otherwise.
 */
const { esc } = require('../html');
const { head, siteBar, footer, styles } = require('./common');
const { icon } = require('./shell');
const { cityTile, moreRow, countryPages } = require('./hub');

function render(reg, ctx) {
  const rows = reg.rows;
  const live = reg.countries.filter(c => c.live).sort((a, b) => a.order - b.order);
  const byLive = Object.fromEntries(rows.map(r => [r.live, r]));
  const places = rows.filter(r => r.kind === 'city');
  const total = places.reduce((s, r) => s + r.counts.P + r.counts.F, 0);
  const hubHref = c => { const h = byLive[c.hub]; return h && h.kind === 'country-hub' && h.gen !== 'none' ? h.beta : null; };

  const sections = live.map(c => {
    const { main, more, all } = countryPages(c, reg);
    const n = all.reduce((s, r) => s + r.counts.P + r.counts.F, 0);
    const hub = hubHref(c);
    return `<section class="csec" id="${esc(c.key)}" aria-labelledby="c-${esc(c.key)}">
<div class="rail-head"><h2 class="d2" id="c-${esc(c.key)}">${esc(c.name)}<span class="n">${all.length} ${all.length === 1 ? 'guide' : 'guides'} · ${n.toLocaleString('en-US')} places</span></h2>
${hub ? `<a class="more" href="${esc(hub)}">All ${esc(c.name)} ${icon('chevr', 'ico sm')}</a>` : ''}</div>
${c.blurb ? `<p class="blurb">${esc(c.blurb)}</p>` : ''}
<ul class="tiles hub2" aria-label="${esc(c.name)} guides">
${main.map((r, i) => cityTile(r, i)).join('\n')}
</ul>
${more.length ? `<h3 class="more-h d3" style="margin-top:20px">More in ${esc(c.name)}</h3>\n<ul class="morelist">\n${more.map(r => moreRow(r)).join('\n')}\n</ul>` : ''}
</section>`;
  });

  const archive = byLive['Singapore/singapore-old.html'];
  const nGuides = live.reduce((s, c) => s + countryPages(c, reg).all.length, 0);
  const title = 'Cleo — sourced city guides';
  const desc = `${total.toLocaleString('en-US')} places across ${places.length} guides in ${live.length} countries — every one traceable to the source that recommended it, pinned and status-checked.`;
  return `${head({ page: 'landing', title, description: desc, rel: 'index.html', depth: 0, assetsV: ctx.assetsV, css: styles(0), from: 'data/countries.json + every live place page',
    jsonld: { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Cleo', url: ctx.betaBase + '/',
      potentialAction: { '@type': 'SearchAction', target: ctx.betaBase + '/?q={q}', 'query-input': 'required name=q' } } })}
<body class="has-tabbar">
${siteBar({ depth: 0, current: 'landing', rel: 'index.html', onNight: true })}
<main id="main" class="feb">
<section class="hero" aria-labelledby="hero-h"><div class="inner">
  <p class="kicker">Field guides with receipts</p>
  <h1 class="d-hero" id="hero-h">Go where the people who <em>know</em> would go.</h1>
  <p class="sub">${total.toLocaleString('en-US')} places across ${places.length} guides in ${live.length} countries — each recommended by named sources, pinned to the door and checked open.</p>
  <form class="search" id="search" role="search" action="index.html" method="get" data-cleo-search>
    ${icon('search')}<label class="vh" for="cleo-q">Search every place</label>
    <input id="cleo-q" name="q" type="search" placeholder="A city, a dish, a shrine…" autocomplete="off" enterkeyhint="search">
    <button class="btn btn-primary" type="submit">Search</button>
  </form>
</div></section>
<div class="wrap">
<section class="results" id="results" aria-live="polite" hidden></section>
<div id="destinations" class="section">
<div class="stickypills"><nav class="countries" aria-label="Countries">${live.map(c => `<a class="pill" href="#${esc(c.key)}">${esc(c.name)}</a>`).join('')}</nav></div>
${sections.join('\n')}
</div>
<section class="section" aria-labelledby="trust-h"><h2 class="d2" id="trust-h" style="margin-bottom:16px">Why trust a Cleo pick</h2>
<div class="trust">
<div class="t">${icon('seal')}<div><b>Named sources, always</b><p>Every place shows who recommends it. A place needs two credible sources — or one Michelin or James Beard nod. Review sites never count as the recommender.</p></div></div>
<div class="t">${icon('pin')}<div><b>Pinned to the door</b><p>Each pin is checked against an official site, a map provider's place pin or Wikipedia's coordinates, with its source and date kept.</p></div></div>
<div class="t">${icon('info')}<div><b>Closed is said out loud</b><p>Every place's status is checked against a real source. A closed place stays on the page, flagged, so you never go to a shuttered door.</p></div></div>
</div>
<p style="margin-top:16px"><a class="btn btn-ghost" href="how-we-choose.html">How we choose ${icon('chevr', 'ico sm')}</a></p>
</section>
${archive && archive.gen !== 'none' ? `<p class="archive sm muted">Looking for the rest of Southeast Asia? <a href="${esc(archive.beta)}">Southeast Asia preview (archived index)</a></p>` : ''}
<p class="sr-count vh">${nGuides} guides in live countries.</p>
</div>
</main>
${footer({ depth: 0, tabbar: true, current: 'landing' })}
<script src="assets/js/landing.js?v=${ctx.assetsV.landing}" defer></script>
</body>
</html>
`;
}

module.exports = { render };
