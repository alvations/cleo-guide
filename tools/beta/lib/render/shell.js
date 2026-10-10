'use strict';
/**
 * render/shell.js — the visible shell every beta page shares (lane FE-B, M1-18): skip link, top bar
 * (wordmark → landing, breadcrumb trail, primary nav, search, "Your list"), the mobile tab bar, the footer
 * (method notes, site links, credits) and the stylesheet links for Constellation pages.
 *
 * Contract:
 *  - any href="#…" points at a real element id; JS-only actions are <button>s (QA's link checker);
 *  - the top bar is ONE component on every page (test-hubs.js snapshots its structure) and ≤ 64 px tall;
 *  - every count is computed from the registry the build passes to setSite() — nothing typed;
 *  - icons are an inline sprite (no network); every control has an accessible name and a ≥ 44 px target.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { esc } = require('../html');
const { t, reviewed, locale } = require('../i18n');   // W4 gap #8: every shell string comes from the catalogue
const LIVE_BASE = 'https://alvations.github.io/cleo-guide';
const ROOT = path.resolve(__dirname, '..', '..', '..', '..');

// ---------------------------------------------------------------- site context (set once by build.js)
let SITE = { countries: [], pages: {}, totals: { places: 0, guides: 0, countries: 0 } };

/** Called by build.js with the registry, before any page renders. Breadcrumbs and footer read it. */
function setSite(reg, assetsV = {}) {
  const rows = reg.rows;
  const cityRows = rows.filter(r => r.kind === 'city');
  const hubRow = c => rows.find(r => r.kind === 'country-hub' && r.live === c.hub && r.gen !== 'none');
  const countries = reg.countries.filter(c => c.live).sort((a, b) => a.order - b.order).map(c => {
    const h = hubRow(c);
    const mine = cityRows.filter(r => r.country === c.key);
    return { key: c.key, name: c.name, href: h ? h.beta : 'index.html#' + c.key,
      guides: mine.length, places: mine.reduce((s, r) => s + r.counts.P + r.counts.F, 0) };
  });
  const byKey = Object.fromEntries(countries.map(c => [c.key, c]));
  const pages = {};
  for (const r of rows) {
    const name = r.data && r.data.meta && r.data.meta.h1Main || r.key;
    pages[r.beta] = { name, country: byKey[r.country] ? r.country : null, kind: r.kind };
  }
  const live = cityRows.filter(r => byKey[r.country]);
  SITE = { countries, pages, assetsV, totals: {
    places: cityRows.reduce((s, r) => s + r.counts.P + r.counts.F, 0), guides: cityRows.length,
    liveGuides: live.length, countries: countries.length } };
  return SITE;
}
const site = () => SITE;

// ---------------------------------------------------------------- stylesheet links (Constellation pages)
const ver = p => { try { return crypto.createHash('sha1').update(fs.readFileSync(p)).digest('hex').slice(0, 10); } catch (e) { return '0'; } };
/** Asset version: the build's (same key the service worker caches), else a hash of the file. */
const assetV = (k, file) => (SITE.assetsV && SITE.assetsV[k]) || ver(file);
/** Stylesheets for a Constellation page, passed as head({ css }): the designer's component sheet + FE-B shell rules
 *  (in place of the Wave 0 baseline cleo.css, whose selectors clash with Constellation's — DES UX-20). */
function styles(depth) {
  const up = '../'.repeat(depth);
  return [`<link rel="stylesheet" href="${up}assets/cleo.css?v=${assetV('css', path.join(ROOT, 'beta', 'assets', 'cleo.css'))}">`];
}


// ---------------------------------------------------------------- icons (inline sprite, no network)
const ICONS = {
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  seal: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.3l1.4 3 3.2.3-2.4 2.2.7 3.1L12 14.3l-2.9 1.6.7-3.1-2.4-2.2 3.2-.3z"/>',
  chevr: '<path d="M9.5 6l6 6-6 6"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  star4: '<path d="M12 2.5l2.1 7.4 7.4 2.1-7.4 2.1-2.1 7.4-2.1-7.4L2.5 12l7.4-2.1z"/>',
  offline: '<path d="M3 3l18 18"/><path d="M7.6 7.6A5 5 0 0 0 7 9.5 4 4 0 0 0 7 17.5h10M10 5a5 5 0 0 1 6.9 3.5h.6a3.5 3.5 0 0 1 2.4 6"/>',
  alert: '<path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 10v4.5M12 17.2v.2"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.2"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
  share: '<path d="M12 15V4M8 8l4-4 4 4"/><path d="M6 12v7h12v-7"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.4a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.6" r="2.4"/>',
};
const sprite = () => `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>${
  Object.entries(ICONS).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join('')}</defs></svg>`;
/** An icon from the sprite. width/height attributes keep it 20 px even where no stylesheet sizes it. */
const icon = (k, cls = 'ico') => `<svg class="${cls}" width="20" height="20" aria-hidden="true" focusable="false"><use href="#i-${k}"/></svg>`;
const MARK = '<svg class="mark" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 4.2l1.75 6.05L19.8 12l-6.05 1.75L12 19.8l-1.75-6.05L4.2 12l6.05-1.75z"/></svg>';

// ---------------------------------------------------------------- breadcrumbs
/** Trail for a beta page: Destinations › {country} › {page}. Root and saved/method pages are one level. */
function trail(rel) {
  if (!rel || rel === 'index.html') return [];
  const fixed = { 'saved.html': t('page.saved'), 'how-we-choose.html': t('page.method'), 'accessibility.html': t('page.accessibility'), '404.html': t('page.notfound') };
  const out = [{ name: t('shell.nav.destinations'), href: 'index.html' }];
  if (fixed[rel]) return out.concat({ name: fixed[rel] });
  const pg = SITE.pages[rel];
  if (!pg) return out;
  const c = SITE.countries.find(x => x.key === pg.country);
  if (pg.kind === 'country-hub') return out.concat({ name: c ? c.name : pg.name });
  if (c) out.push({ name: c.name, href: c.href });
  return out.concat({ name: pg.name });
}

function crumbs(rel, up) {
  // The root ("Destinations") is the wordmark's and the nav's job, so the visible trail starts at the country.
  const tr = trail(rel).slice(1);
  if (!tr.length) return '';
  return `<nav class="crumbs" aria-label="${t('shell.crumbs.label')}">${tr.map((c, i) => (i ? '<span class="sep" aria-hidden="true">›</span>' : '') +
    (c.href ? `<a class="c${i}" href="${up}${esc(c.href)}">${esc(c.name)}</a>` : `<span class="here" aria-current="page">${esc(c.name)}</span>`)).join('')}</nav>`;
}

// ---------------------------------------------------------------- locale switcher (M3-03)
/** Rendered only once a second REVIEWED locale exists (tools/beta/i18n/*.json "reviewed": true). Until then: nothing. */
function localeSwitch() {
  const locs = reviewed();
  if (locs.length < 2) return '';
  return `<nav class="locales" aria-label="${t('shell.locale.label')}">${locs.map(l => `<button type="button" class="btn btn-quiet" data-cleo-locale="${esc(l.locale)}" lang="${esc(l.locale)}" aria-pressed="${l.locale === locale()}">${esc(l.name)}</button>`).join('')}</nav>`;
}

// ---------------------------------------------------------------- top bar
/**
 * @param depth   directory depth of the page under beta/ (0 for beta/index.html)
 * @param current 'landing' | 'hub' | 'city' | 'saved' | 'method' | 'other'
 * @param rel     the page's beta-relative path (drives the breadcrumb)
 * @param onNight true when the bar floats over the landing's night hero
 */
function siteBar({ depth, current, rel, onNight = false }) {
  const up = '../'.repeat(depth);
  const cur = k => current === k ? ' aria-current="page"' : '';
  return `${sprite()}<a class="skip" href="#main">${t('shell.skip')}</a>
<header class="topbar${onNight ? ' on-night' : ''}" data-cleo-shell="topbar"><div class="wrap">
  <a class="brand" href="${up}index.html" aria-label="${t('shell.brand.label')}">${MARK}<b>${t('shell.brand.word')}</b><small>${t('shell.brand.tag')}</small></a>
  ${crumbs(rel, up)}
  <nav class="topnav" aria-label="${t('shell.nav.label')}"><a href="${up}index.html#destinations"${cur('landing')}>${t('shell.nav.destinations')}</a><a href="${up}how-we-choose.html"${cur('method')}>${t('shell.nav.method')}</a></nav>${localeSwitch()}
  <span class="spacer"></span>
  <div class="top-actions">
    <button type="button" class="btn btn-icon theme-toggle" aria-pressed="false" aria-label="${t('shell.night')}" data-cleo-theme hidden>${icon('moon')}</button>
    <a class="btn btn-icon" href="${up}index.html#search" aria-label="${t('shell.search')}" data-cleo-search-open>${icon('search')}</a>
    <a class="btn btn-icon count-dot" href="${up}saved.html" aria-label="${t('shell.saved')}" data-cleo-saved-link${cur('saved')}>${icon('heart')}<span class="vh" data-cleo-saved-count></span></a>
  </div>
</div></header>
<div class="banners" data-cleo-banners aria-live="polite"></div>`;
}

/** Mobile tab bar (hidden ≥ 900 px by the stylesheet). Pages that show it add class="has-tabbar" to <body>. */
function tabBar({ depth, current }) {
  const up = '../'.repeat(depth);
  const cur = k => current === k ? ' aria-current="page"' : '';
  return `<nav class="tabbar" aria-label="${t('shell.tab.label')}">
<a href="${up}index.html"${cur('landing')}>${icon('compass')}<span>${t('shell.tab.explore')}</span></a>
<a href="${up}index.html#search" data-cleo-search-open>${icon('search')}<span>${t('shell.tab.search')}</span></a>
<a href="${up}saved.html"${cur('saved')}>${icon('heart')}<span>${t('shell.tab.saved')}</span></a>
<a href="${up}how-we-choose.html"${cur('method')}>${icon('seal')}<span>${t('shell.tab.method')}</span></a>
</nav>`;
}

// ---------------------------------------------------------------- footer
/**
 * @param notes  the live page's method notes (city pages) — rendered verbatim in .method .note (RFC §5.5)
 * @param tabbar render the mobile tab bar (pages that also put class="has-tabbar" on <body>)
 */
function footer({ depth, liveRel, notes = [], tabbar = false, current }) {
  const up = '../'.repeat(depth);
  const live = liveRel ? `<a href="${LIVE_BASE}/${esc(liveRel)}">${t('foot.live.one')}</a>` : `<a href="${LIVE_BASE}/">${t('foot.live.all')}</a>`;
  const noteHtml = notes.map(n => `<div class="note"><h3>${esc(n.title || n.k)}</h3><p>${esc(n.body)}</p></div>`).join('\n');
  const T = SITE.totals;
  const v = f => assetV(f.replace(/\.js$/, ''), path.join(__dirname, '..', '..', 'client', f));
  return `${noteHtml ? `<section class="method wrap section" aria-labelledby="method-h"><h2 id="method-h" class="d2">${t('foot.method.h')}</h2>\n${noteHtml}\n</section>` : ''}
<footer class="footer" role="contentinfo"><div class="wrap">
  <div class="cols">
    <div><a class="brand" href="${up}index.html" aria-label="${t('shell.brand.label')}">${MARK}<b>${t('shell.brand.word')}</b></a>
      <p>${t('foot.about', { places: T.places.toLocaleString('en-US'), guides: T.guides })}</p></div>
    <div><h4>${t('foot.destinations')}</h4><ul>${SITE.countries.map(c => `<li><a href="${up}${esc(c.href)}">${esc(c.name)}</a></li>`).join('')}</ul></div>
    <div><h4>${t('foot.method')}</h4><ul><li><a href="${up}how-we-choose.html">${t('foot.method.how')}</a></li><li><a href="${up}how-we-choose.html#closures">${t('foot.method.closures')}</a></li><li><a href="${up}how-we-choose.html#pins">${t('foot.method.pins')}</a></li><li><a href="${up}accessibility.html">${t('foot.method.a11y')}</a></li></ul></div>
    <div><h4>${t('foot.yours')}</h4><ul><li><a href="${up}saved.html">${t('foot.yours.saved')}</a></li><li><a href="${up}index.html#search">${t('foot.yours.search')}</a></li><li><button type="button" class="btn theme-toggle" aria-pressed="false" data-cleo-theme hidden>${icon('moon')}<span>${t('shell.night')}</span></button></li></ul></div>
  </div>
  <p class="legal colophon">${t('foot.colophon', { live, osm: `<a href="https://www.openstreetmap.org/copyright">${t('foot.osm')}</a>` })}</p>
</div></footer>
${tabbar ? tabBar({ depth, current }) : ''}
<script src="${up}assets/js/states.js?v=${v('states.js')}" defer></script>
<script src="${up}assets/js/search.js?v=${v('search.js')}" defer></script>`;
}

module.exports = { localeSwitch, siteBar, footer, tabBar, styles, setSite, site, trail, icon, MARK, LIVE_BASE };
