'use strict';
/**
 * render/landing.js — the beta LANDING page (lane FE-B: this template + client/landing.js). M1-17, W7.
 * Search-first: one headline in the display face and a big search pill, then the country shortcuts, the ★ signature
 * row, one row of image-first city cards per live country (countries.json order, live only — every place page in it),
 * the cross-city collections, a quiet "How we choose" strip (named sources, pins, closures — computed) and the
 * countries. Links go to the beta copy of each page. Styles: lib/render/fe-b.css (tokens only).
 */
const { esc } = require('../html');
const { head, siteBar, footer, styles } = require('./common');
const { icon } = require('./shell');
const { cityTile, moreRow, countryPages, themeRail, countryCards, ogFor, forYou } = require('./hub');
const { stats: methodStats } = require('./method');
const { t, tn } = require('../i18n');                // W5 gap #7: every landing string comes from the catalogue

function render(reg, ctx) {
  const rows = reg.rows;
  const live = reg.countries.filter(c => c.live).sort((a, b) => a.order - b.order);
  const byLive = Object.fromEntries(rows.map(r => [r.live, r]));
  const places = rows.filter(r => r.kind === 'city');
  const total = places.reduce((s, r) => s + r.counts.P + r.counts.F, 0);
  const hubHref = c => { const h = byLive[c.hub]; return h && h.kind === 'country-hub' && h.gen !== 'none' ? h.beta : null; };
  const fmt = n => n.toLocaleString('en-US');

  const sections = live.map(c => {
    const { main, more, all } = countryPages(c, reg);
    const n = all.reduce((s, r) => s + r.counts.P + r.counts.F, 0);
    const hub = hubHref(c);
    return `<section class="csec" id="${esc(c.key)}" aria-labelledby="c-${esc(c.key)}">
<div class="rail-head"><h2 class="d2" id="c-${esc(c.key)}">${esc(c.name)}<span class="n">${esc(tn('hub.guides', all.length))} · ${esc(n === 1 ? t('hub.places.one') : t('hub.places', { n: fmt(n) }))}</span></h2>
${hub ? `<a class="more" href="${esc(hub)}">${esc(t('land.all', { country: c.name }))} ${icon('chevr', 'ico sm')}</a>` : ''}</div>
<ul class="tiles hub2 cards dense" aria-label="${esc(t('hub.guides.label', { country: c.name }))}">
${main.map((r, i) => cityTile(r, i, { reg, dense: true })).join('\n')}
</ul>
${more.length ? `<h3 class="more-h d3">${esc(t('hub.more', { country: c.name }))}</h3>\n<ul class="morelist">\n${more.map(r => moreRow(r)).join('\n')}\n</ul>` : ''}
</section>`;
  });

  // ROUND-2 gap #4 (FE-B half): one ★ signature per live country, from the guides' own data (lib/guide.js) — the
  // signature shared by the most places across that country's pages. A card opens the page holding most of them,
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
    const where = best.pages.length > 1 ? esc(t('land.sig.across', { n: best.pages.length, country: c.name })) + ' ' + best.pages.slice(0, 3).map(x => `${esc(x.r.name)} ${x.sg.n}`).join(' · ') + (best.pages.length > 3 ? ' …' : '') : esc(t('land.sig.in', { city: top.r.name }));
    return `<a class="rail-i sig" href="${esc(top.r.beta)}#${lens}">${icon(top.sg.kind === 'collection' ? 'star4' : 'forkknife', 'g ico')}<span class="k">★ ${esc(c.name)}</span><span class="t">${esc(top.sg.label || best.title)}</span><span class="d">${where}</span><span class="n">${best.n.toLocaleString('en-US')}</span></a>`;
  }).filter(Boolean);
  const editorialHtml = editorial.length ? `<section class="section editorial-s" aria-labelledby="ed-h"><div class="rail-head"><h2 class="d2" id="ed-h">${esc(t('land.sig.h'))}<span class="n">${esc(t('land.sig.n', { n: editorial.length }))}</span></h2></div>
<nav class="rail editorial" aria-label="${esc(t('land.sig.h'))}">
${editorial.join('\n')}
</nav></section>` : '';

  // W9-2: "<month> in Cleo" — the newest month on record (data/changes.json `month`: re-checks, closures with their
  // source, pin verifications), each guide linking to its What changed page; "Follow changes" = the site Atom feed.
  // Every number is a sum of changes.json rows. No "new openings": records carry no first-seen date.
  const ch = reg.changes || [], mo = ch.month;
  const act = ch.filter(x => x.month && (x.month.checked || x.month.closed)).sort((a, b) => b.month.checked - a.month.checked || (a.name < b.name ? -1 : 1));
  const sum = k => act.reduce((t, x) => t + x.month[k], 0);
  const monthName = mo ? t('land.month.names').split(',')[+mo.slice(5, 7) - 1] + ' ' + mo.slice(0, 4) : '';   // names from the catalogue
  const monthHtml = mo && act.length ? `<section class="section month-s" id="month" aria-labelledby="month-h"><div class="rail-head"><h2 class="d2" id="month-h">${esc(t('land.month.h', { month: monthName }))}</h2>
<a class="more" href="feeds/all.xml" type="application/atom+xml">${esc(t('land.month.follow'))} ${icon('chevr', 'ico sm')}</a></div>
<p class="month-lede" data-month="${esc(mo)}">${esc(t('land.month.lede', { checked: fmt(sum('checked')), closed: fmt(sum('closed')), pins: fmt(sum('pins')), n: act.length }))}</p>
<ul class="morelist month-list">${act.map(x => `<li><a href="${esc(x.changesPage)}" data-checked="${x.month.checked}" data-closed="${x.month.closed}"><span class="dest-n">${esc(x.name)}</span><span class="dest-c">${esc(t('land.month.row', { checked: fmt(x.month.checked), closed: fmt(x.month.closed) }))}</span></a></li>`).join('')}</ul>
<p class="sm muted month-feed">${esc(t('land.month.feed'))}</p></section>` : '';

  // The quiet trust strip: what wins a careful reader. Every figure is computed from the records (method.stats).
  const ms = methodStats(reg);
  const trust = [['seal', 'src', ms.publishers], ['pin', 'pin', ms.pinned], ['info', 'closed', ms.closed]];
  const trustHtml = `<section class="section trust-s" aria-labelledby="trust-h"><div class="rail-head"><h2 class="d2" id="trust-h">${esc(t('land.trust.h'))}</h2>
<a class="more" href="how-we-choose.html">${esc(t('land.trust.more'))} ${icon('chevr', 'ico sm')}</a></div>
<div class="trust">
${trust.map(([ic, k, n]) => `<div class="t">${icon(ic)}<div><p class="tn"><b>${esc(fmt(n))}</b> ${esc(t(`land.trust.${k}.n`))}</p><h3>${esc(t(`land.trust.${k}.h`))}</h3><p>${esc(t(`land.trust.${k}.p`))}</p></div></div>`).join('\n')}
</div></section>`;

  const countries = live.map(c => ({ key: c.key, name: c.name, href: hubHref(c) || '#' + c.key,
    guides: countryPages(c, reg).all.length, places: countryPages(c, reg).all.reduce((s, r) => s + r.counts.P + r.counts.F, 0) }));

  const archive = byLive['Singapore/singapore-old.html'];
  const nGuides = live.reduce((s, c) => s + countryPages(c, reg).all.length, 0);
  const title = t('land.title');
  const nums = { places: fmt(total), guides: places.length, countries: live.length };
  const desc = t('land.desc', nums);
  return `${head({ page: 'landing', title, description: desc, rel: 'index.html', depth: 0, assetsV: ctx.assetsV, css: styles(0), ogImage: ogFor('us') || undefined,   // the default (US) view's share card
    from: 'data/countries.json + every live place page',
    jsonld: { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Cleo', url: ctx.betaBase + '/',
      potentialAction: { '@type': 'SearchAction', target: ctx.betaBase + '/?q={q}', 'query-input': 'required name=q' } } })}
<body class="has-tabbar">
${siteBar({ depth: 0, current: 'landing', rel: 'index.html' })}
<main id="main" class="feb">
<section class="lhero" data-cleo-masthead aria-labelledby="hero-h"><div class="inner">
  <p class="kicker">${esc(t('land.kicker'))}</p>
  <h1 class="d-hero" id="hero-h">${esc(t('land.h1')).replace('{em}', `<em>${esc(t('land.h1.em'))}</em>`)}</h1>
  <p class="sub">${esc(t('land.sub', nums))}</p>
  <form class="search" id="search" role="search" action="index.html" method="get" data-cleo-search>
    ${icon('search')}<label class="vh" for="cleo-q">${esc(t('shell.search'))}</label>
    <input id="cleo-q" name="q" type="search" placeholder="${esc(t('land.search.ph'))}" autocomplete="off" enterkeyhint="search">
    <button class="btn btn-primary" type="submit">${icon('search', 'ico sm')}<span>${esc(t('land.search.go'))}</span></button>
  </form>
  <nav class="countries" aria-label="${esc(t('land.countries'))}">${live.map(c => `<a class="pill" href="#${esc(c.key)}">${esc(c.name)}</a>`).join('')}</nav>
</div></section>
<div class="wrap">
<section class="results" id="results" aria-live="polite" hidden></section>
${forYou()}
<div id="destinations" class="section">
${sections[0] || ''}
</div>
${editorialHtml}
<div class="section">
${sections.slice(1).join('\n')}
</div>
${themeRail(reg, { heading: t('hub.themes.h'), id: 'themes' })}
${monthHtml}
${trustHtml}
<section class="section" aria-labelledby="cc-h"><div class="rail-head"><h2 class="d2" id="cc-h">${esc(t('land.countries'))}</h2></div>
${countryCards(countries, '', reg)}</section>
${archive && archive.gen !== 'none' ? `<p class="archive sm muted">${esc(t('land.archive')).replace('{link}', `<a href="${esc(archive.beta)}">${esc(t('land.archive.link'))}</a>`)}</p>` : ''}
<p class="sr-count vh">${esc(t('land.srcount', { n: nGuides }))}</p>
</div>
</main>
${footer({ depth: 0, tabbar: true, current: 'landing' })}
<script src="assets/js/landing.js?v=${ctx.assetsV.landing}" defer></script>
<script src="assets/js/interests.js?v=${ctx.assetsV.interests}" defer></script>
</body>
</html>
`;
}

module.exports = { render };
