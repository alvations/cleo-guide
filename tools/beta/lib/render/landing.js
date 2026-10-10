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
const { cityTile, moreRow, countryPages, themeRail, FEB_CSS, ogFor } = require('./hub');

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
<div class="rail-head"><h2 class="d2" id="c-${esc(c.key)}">${esc(c.name)}<span class="n">${all.length} ${all.length === 1 ? 'guide' : 'guides'} · ${n.toLocaleString('en-US')} ${n === 1 ? 'place' : 'places'}</span></h2>
${hub ? `<a class="more" href="${esc(hub)}">All ${esc(c.name)} ${icon('chevr', 'ico sm')}</a>` : ''}</div>
${c.blurb ? `<p class="blurb">${esc(c.blurb)}</p>` : ''}
<ul class="tiles hub2" aria-label="${esc(c.name)} guides">
${main.map((r, i) => cityTile(r, i, { cap: 16 }))   /* lighter star-field (the imagery motif carries the art) keeps the landing ≤ 80 KB */.join('\n')}
</ul>
${more.length ? `<h3 class="more-h d3" style="margin-top:20px">More in ${esc(c.name)}</h3>\n<ul class="morelist">\n${more.map(r => moreRow(r)).join('\n')}\n</ul>` : ''}
</section>`;
  });

  // ROUND-2 gap #4 (FE-B half): one ★ signature per live country, from the guides' own data (lib/guide.js) — the
  // signature shared by the most places across that country's pages. A tile opens the page holding most of them,
  // with its ★ lens on. No copy beyond titles, place counts and city names.
  const editorial = live.map(c => {
    const groups = new Map();
    const seen = new Set();                         // the SEA archive mirrors some pages under another folder: count a city once
    for (const r of countryPages(c, reg).all.filter(r => !seen.has(r.name) && seen.add(r.name))) {
      const sg = r.guide && r.guide.signature; if (!sg || !sg.n) continue;
      const g = groups.get(sg.title) || { title: sg.title, n: 0, pages: [] };
      g.n += sg.n; g.pages.push({ r, sg }); groups.set(sg.title, g);
    }
    const best = [...groups.values()].sort((a, b) => b.n - a.n || (a.title < b.title ? -1 : 1))[0];
    if (!best) return null;
    best.pages.sort((a, b) => b.sg.n - a.sg.n || (a.r.name < b.r.name ? -1 : 1));
    const top = best.pages[0], lens = top.sg.kind === 'collection' && top.sg.c && top.sg.c[0] ? 'c=' + encodeURIComponent(top.sg.c[0]) : 'sig=1';
    const where = best.pages.length > 1 ? `across ${best.pages.length} ${esc(c.name)} guides: ` + best.pages.slice(0, 3).map(x => `${esc(x.r.name)} ${x.sg.n}`).join(' · ') + (best.pages.length > 3 ? ' …' : '') : `in ${esc(top.r.name)}`;
    return `<a class="rail-i sig" href="${esc(top.r.beta)}#${lens}">${icon(top.sg.kind === 'collection' ? 'star4' : 'forkknife', 'g ico')}<span class="k">★ ${esc(c.name)}</span><span class="t">${esc(best.title)}</span><span class="d">${where}</span><span class="n">${best.n.toLocaleString('en-US')}</span></a>`;
  }).filter(Boolean);
  const editorialHtml = editorial.length ? `<section class="section editorial-s" aria-labelledby="ed-h"><div class="rail-head"><h2 class="d2" id="ed-h">Signatures across the guides<span class="n">${editorial.length} countries · counts from the guides</span></h2></div>
<nav class="rail editorial" aria-label="Signatures across the guides">
${editorial.join('\n')}
</nav></section>` : '';

  const archive = byLive['Singapore/singapore-old.html'];
  const nGuides = live.reduce((s, c) => s + countryPages(c, reg).all.length, 0);
  const title = 'Cleo — sourced city guides';
  const desc = `${total.toLocaleString('en-US')} places across ${places.length} guides in ${live.length} countries — every one traceable to the source that recommended it, pinned and status-checked.`;
  return `${head({ page: 'landing', title, description: desc, rel: 'index.html', depth: 0, assetsV: ctx.assetsV, css: styles(0), ogImage: ogFor('us') || undefined,   // the default (US) view's share card from: 'data/countries.json + every live place page',
    jsonld: { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Cleo', url: ctx.betaBase + '/',
      potentialAction: { '@type': 'SearchAction', target: ctx.betaBase + '/?q={q}', 'query-input': 'required name=q' } } }).replace('</head>', `<style>${FEB_CSS}</style>\n</head>`)}
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
${editorialHtml}
<div id="destinations" class="section">
<div class="stickypills"><nav class="countries" aria-label="Countries">${live.map(c => `<a class="pill" href="#${esc(c.key)}">${esc(c.name)}</a>`).join('')}</nav></div>
${sections[0] || ''}
</div>
${themeRail(reg, { heading: 'Collections across the guides', id: 'themes' })}
<div class="section">
${sections.slice(1).join('\n')}
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
