'use strict';
/**
 * render/changes.js — "What changed" pages (ROUND-3 gap #9, M3-07). Lane FE-B (W4: platform + FE-B).
 * One human-readable page per place page, beta/changes/<page>.html, drawn from the SAME events as its Atom feed
 * (lib/changes.js pageChanges: closures with their status source, status-check days, pin-verification days — every
 * date comes from data/geocodes.json; nothing is inferred or invented). The city masthead's "last checked" line links
 * here (build.js), and the page links back to the feed for anyone who wants to subscribe.
 */
const { esc } = require('../html');
const { head, siteBar, footer, styles } = require('./common');
const { t, tn } = require('../i18n');                // every interface string from the catalogue (gap #8)

const PAGE_CSS = `
.chg{list-style:none;padding:0;margin:0;display:grid;gap:22px}.chg>li{border-top:1px solid var(--line);padding-top:14px}
.chg h2{margin:0 0 8px}.chg ul{margin:0;padding-left:20px;display:grid;gap:6px}.chg .sm{color:var(--ink-2)}
.chg time{font-variant-numeric:tabular-nums}.chg a{min-height:24px}
`;
const rel = r => `changes/${r.fileKey}.html`;
const fmt = (d, loc) => { const [y, m, dd] = d.split('-').map(Number); return new Date(Date.UTC(y, m - 1, dd)).toLocaleDateString(loc === 'en' ? 'en-GB' : loc, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }); };
const { locale } = require('../i18n');

/** Render one page. `r` is a city row after changes.build (r.changes, r.feed) — events newest first. */
function page(r, ctx) {
  const up = '../', city = up + r.beta, ev = r.changes || [];
  const days = [], by = {};
  for (const e of ev) { if (!by[e.d]) { by[e.d] = []; days.push(e.d); } by[e.d].push(e); }
  const closed = ev.filter(e => e.kind === 'closed').length;
  const checked = ev.filter(e => e.kind === 'checked').reduce((s, e) => s + e.n, 0);
  const pins = ev.filter(e => e.kind === 'pins').reduce((s, e) => s + e.n, 0);
  const line = e => e.kind === 'closed'
    ? `<li>${t('chg.closed', { place: `<a href="${esc(city)}#p=${encodeURIComponent(e.id)}">${esc(e.name)}</a>` })}${e.src ? ` <span class="sm"><a href="${esc(e.src)}" rel="noopener">${t('chg.closed.src')}</a></span>` : ''}</li>`
    : e.kind === 'checked'
      ? `<li>${tn('chg.checked', e.n)}${e.closed ? ` <span class="sm">(${t('chg.checked.closed', { n: e.closed })})</span>` : ''}</li>`
      : `<li>${tn('chg.pinsday', e.n)}</li>`;
  const title = t('chg.title', { city: r.name });
  const desc = t('chg.desc', { city: r.name });
  const body = days.length
    ? `<ol class="chg">${days.map(d => `<li><h2 class="d3"><time datetime="${d}">${esc(fmt(d, locale()))}</time></h2><ul>${by[d].map(line).join('')}</ul></li>`).join('')}</ol>`
    : `<p class="state" data-cleo-state="no-changes">${t('chg.none')}</p>`;
  return `${head({ page: 'changes', title, description: desc, rel: rel(r), depth: 1, assetsV: ctx.assetsV, css: styles(1), from: r.live + ' + data/geocodes.json (dated checks)' })
    .replace('</head>', `<link rel="alternate" type="application/atom+xml" title="${esc(r.name)} — what changed" href="${up}${esc(r.feed)}">\n<style>${PAGE_CSS}</style>\n</head>`)}
<body class="has-tabbar">
${siteBar({ depth: 1, current: 'other', rel: rel(r) })}
<main id="main" class="feb">
<section class="masthead" aria-labelledby="mh"><div class="inner">
  <p class="eyebrow"><a href="${esc(city)}">${esc(r.name)}</a></p>
  <h1 class="title d1" id="mh">${t('chg.h1')}</h1>
  <p class="facts">${[tn('chg.closures', closed), t('chg.checks', { n: checked.toLocaleString('en-US') }), t('chg.pins', { n: pins.toLocaleString('en-US') })].join(' · ')}. ${t('chg.lede')} <a href="${up}${esc(r.feed)}">${t('chg.feed')}</a>.</p>
</div><span class="accentbar"></span></section>
<div class="wrap section">
${body}
<p><a class="btn btn-ghost" href="${esc(city)}">${t('chg.back', { city: esc(r.name) })}</a></p>
</div></main>
${footer({ depth: 1, tabbar: true, current: 'other' })}
</body>
</html>
`;
}

module.exports = { page, rel };
