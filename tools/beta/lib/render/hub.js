'use strict';
/**
 * render/hub.js — country hubs (beta/<Country>/index.html) and the Southeast Asia archive
 * (beta/Singapore/singapore-old.html). Lane FE-B owns this template from Wave 1 on; platform wrote this
 * skeleton so M1-22 could put every live page on the new engine (as Wave 0 did for landing and city).
 *
 * Every number is read from the generator's stats (row.stats / country.stats — tools/beta/lib/stats.js),
 * never from the live hub's prose: the live archive still says "Toa Payoh 14 sights · 42 food" for a page
 * that holds 14 + 41. Every place page of the country is linked — the live hub's own links first, then the
 * pages filed under the country that the live hub doesn't link — so nothing is reachable only by URL.
 */
const { esc } = require('../html');
const { head, siteBar, footer } = require('./common');
const { fmt } = require('../stats');

function destCard(row, up) {
  const st = row.stats, m = row.data.meta;
  return `<li class="dest" data-page="${esc(row.key)}" data-gen="${row.gen}">
<a href="${esc(up + row.beta)}"><span class="dest-n">${esc(row.name)}</span>
${row.nat ? `<span class="dest-nat" lang="und">${esc(row.nat)}</span>\n` : ''}${m.h1Thin ? `<span class="dest-d">${esc(m.h1Thin)}</span>\n` : ''}<span class="dest-c">${fmt(st.total)} places · ${fmt(st.sights)} sights · ${fmt(st.food)} to eat &amp; drink</span></a>
</li>`;
}

const plural = (n, one, many) => `${fmt(n)} ${n === 1 ? one : many}`;

function statsLine(s) {
  return `<p class="stats"><strong>${fmt(s.total)}</strong> places · ${plural(s.guides, 'guide', 'guides')} · ${fmt(s.sights)} sights · ${fmt(s.food)} to eat &amp; drink` +
    `${s.lastChecked ? ` · status last checked ${esc(s.lastChecked)}` : ''}</p>`;
}

function page({ row, title, desc, h1, dek, body, ctx }) {
  const depth = row.beta.split('/').length - 1;
  return `${head({ page: 'hub', title, description: desc, rel: row.beta, depth, assetsV: ctx.assetsV, from: row.live + ' + data/countries.json + every place page it lists' })}
<body>
${siteBar({ depth, current: 'hub' })}
<main id="main">
<header class="masthead">
  <h1>${esc(h1)}</h1>
  ${dek ? `<p class="dek">${esc(dek)}</p>` : ''}
  ${body.stats}
</header>
<div id="destinations">
${body.sections}
</div>
</main>
${footer({ depth, liveRel: row.live })}
</body>
</html>
`;
}

/** A live country's hub. Returns { html, expect: [pageKey…] } — guards check every listed page is carded. */
function renderCountry(row, reg, ctx) {
  const c = reg.countries.find(x => x.hub === row.live);
  if (!c) throw new Error(`${row.live}: no data/countries.json entry has this hub`);
  const up = '../'.repeat(row.beta.split('/').length - 1);
  const { linked, more } = c.pages;
  const sections = `<section class="country" id="${esc(c.key)}" aria-label="${esc(c.name)} guides">
<ul class="dests">
${linked.map(r => destCard(r, up)).join('\n')}
</ul>
${more.length ? `<h2 class="more-h">More in ${esc(c.name)}</h2>\n<ul class="dests dests--more">\n${more.map(r => destCard(r, up)).join('\n')}\n</ul>` : ''}
</section>`;
  const s = c.stats;
  return {
    html: page({ row, ctx, h1: c.name, dek: c.blurb || '',
      title: `${c.name} — ${fmt(s.total)} sourced places · Cleo`,
      desc: `${c.name}: ${fmt(s.total)} places across ${plural(s.guides, 'guide', 'guides')}, every one traceable to the source that recommended it, pinned and status-checked.`,
      body: { stats: statsLine(s), sections } }),
    expect: linked.concat(more).map(r => r.key),
  };
}

/** The Southeast Asia archive: every SEA place page, grouped by data/countries.json region, live or not. */
function renderArchive(row, reg, ctx) {
  const up = '../'.repeat(row.beta.split('/').length - 1);
  const sea = reg.rows.filter(r => r.kind === 'city' && /^(Singapore|Vietnam)\//.test(r.live));
  const groups = reg.countries.filter(c => c.kind === 'engine').sort((a, b) => a.order - b.order)
    .map(c => ({ c, pages: sea.filter(r => r.country === c.key) })).filter(g => g.pages.length);
  const rest = sea.filter(r => !groups.some(g => g.pages.includes(r)));
  if (rest.length) groups.push({ c: { key: 'other', name: 'Elsewhere in the region' }, pages: rest });
  const sections = groups.map(({ c, pages }) => {
    const n = pages.reduce((t, r) => t + r.stats.total, 0);
    return `<section class="country" id="${esc(c.key)}" aria-labelledby="c-${esc(c.key)}">
<h2 id="c-${esc(c.key)}">${esc(c.name)} <span class="country-c">${plural(pages.length, 'guide', 'guides')} · ${fmt(n)} places${c.live === false ? ' · preview' : ''}</span></h2>
<ul class="dests">
${pages.map(r => destCard(r, up)).join('\n')}
</ul>
</section>`;
  }).join('\n');
  const all = groups.flatMap(g => g.pages);
  const s = require('../stats').sumStats(all);
  return {
    html: page({ row, ctx, h1: 'Southeast Asia', dek: 'The archived regional index: every Singapore town and every regional preview, including countries not yet live.',
      title: `Southeast Asia (archive) — ${fmt(s.total)} sourced places · Cleo`,
      desc: `Archived Southeast Asia index: ${fmt(s.total)} places across ${plural(s.guides, 'guide', 'guides')}.`,
      body: { stats: statsLine(s), sections } }),
    expect: all.map(r => r.key),
  };
}

module.exports = { renderCountry, renderArchive, destCard };
