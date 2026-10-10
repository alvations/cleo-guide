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
  return [`<link rel="stylesheet" href="${up}assets/cleo.css?v=${assetV('css', path.join(ROOT, 'beta', 'assets', 'cleo.css'))}">`,
    `<style>${SHELL_CSS}</style>`];
}

/* The top bar's own layout, emitted with the bar itself so it is the same ≤ 64 px component on every page —
 * including pages still on the Wave 0 baseline sheet (cleo.css). Same values as Constellation's .topbar. */
const TOPBAR_CSS = [
  '[data-cleo-shell=topbar]{position:sticky;top:0;z-index:40;height:var(--bar-h,60px)}',
  ':where([data-cleo-shell=topbar]){background:var(--paper,var(--bg,#F7F4EE));border-bottom:1px solid var(--line,#DDD6CA)}',
  '[data-cleo-shell=topbar]>.wrap{height:100%;display:flex;align-items:center;gap:12px;max-width:var(--maxw,1360px);margin:0 auto;padding:0 var(--gutter,16px);border:0;position:static;background:none}',
  '[data-cleo-shell=topbar] .brand{display:inline-flex;align-items:center;gap:8px;text-decoration:none;min-height:44px;letter-spacing:0;font:inherit}',
  '[data-cleo-shell=topbar] .brand b{font:italic 500 27px/1 var(--font-display,Georgia,serif)}',
  '[data-cleo-shell=topbar] .brand small,[data-cleo-shell=topbar] .topnav{display:none}',
  '[data-cleo-shell=topbar] .spacer{flex:1}[data-cleo-shell=topbar] .top-actions{display:flex;gap:4px}',
  '[data-cleo-shell=topbar] .btn-icon{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%}',
  '[data-cleo-shell=topbar] svg{flex:none}',
  '.topbar .crumbs{display:flex;align-items:center;min-width:0;overflow:hidden;white-space:nowrap;font-size:14px;color:var(--ink-3)}',
  '.topbar .crumbs a{display:inline-flex;align-items:center;min-height:44px;padding:0 8px;border-radius:999px;text-decoration:none;color:var(--ink-2);font-weight:600}',
  '.topbar .crumbs a:hover{background:var(--sand)}',
  '.topbar .crumbs .here{padding:0 8px;color:var(--ink);font-weight:650;overflow:hidden;text-overflow:ellipsis}',
  '.topbar .crumbs .sep{color:var(--ink-3)}',
  '.on-night .crumbs a,.on-night .crumbs .here{color:var(--on-night)}',
  '@media(max-width:899px){.topbar .crumbs a~.sep,.topbar .crumbs a~.here{display:none}.topbar .crumbs a::before{content:"‹";margin-right:4px}[data-cleo-shell=topbar] .theme-toggle{display:none}}',
  '@media(max-width:639px){.topbar .brand b{font-size:24px}}',
  '.footer .theme-toggle{color:var(--on-night);width:auto;padding:0 12px;border-radius:999px;gap:8px;display:inline-flex}',
  '@media(min-width:900px){.topbar .crumbs{margin-left:8px}}',
  '[data-cleo-shell=topbar] .ico{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}',
  '[data-cleo-shell=topbar] .crumbs a{white-space:nowrap}[data-cleo-shell=topbar] .crumbs{flex:0 1 auto}',
  '@media(min-width:900px){[data-cleo-shell=topbar] .topnav{display:flex}[data-cleo-shell=topbar] .brand small{display:inline}}',
].join('');

/* Layout rules the Constellation sheet does not cover yet (breadcrumb in the top bar, mobile 2-up hub tiles,
 * search panel, banners). Tokens only. DES: fold into constellation.css and delete this block. */
const SHELL_CSS = [
  '.topnav a.on{color:var(--ink);background:var(--sand)}',
  '.tiles.hub2{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}',
  '@media(min-width:640px){.tiles.hub2{grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}}',
  '@media(min-width:1100px){.tiles.hub2{grid-template-columns:repeat(4,minmax(0,1fr))}}',
  '.tiles.hub2 .tile{grid-template-rows:84px auto}.tiles.hub2 .tile .txt{padding:10px 12px 12px;gap:3px}',
  '.tiles.hub2 .tile .txt h3{font-size:20px}.tiles.hub2 .tile .art .native{font-size:18px;right:10px;top:8px}',
  '.tiles.hub2 .tile .canon{font-size:13px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}',
  '@media(min-width:640px){.tiles.hub2 .tile{grid-template-rows:120px auto}.tiles.hub2 .tile .txt h3{font-size:24px}}',
  '.tile .art .dots{stroke:var(--on-night);stroke-linecap:round;fill:none}',
  '.tile .art .dots.t1{stroke:var(--gilt-soft)}',
  '.tile .dest-c{display:block}',
  '.dest a.tile::before{content:none}.dest a.tile>*{padding-inline:0}.dest a.tile>:last-child{padding-bottom:0}.tile .dest-c{padding:0;grid-row:auto;align-self:auto}',
  '.tile .art{background:var(--motif,none),radial-gradient(130% 160% at 100% 0,color-mix(in srgb,var(--city) 40%,transparent),transparent 62%),var(--night)}',
  '.feb .search input,.searchpanel .search input{border:0;background:transparent;box-shadow:none;padding:0 4px;border-radius:0}',
  '@media(min-width:900px){.feb .hero .d-hero{font-size:64px}.feb .hero .inner{padding-top:calc(var(--bar-h) + 40px);padding-bottom:36px}}',
  'html[data-cleo-page] main.feb{padding:0;max-width:none}html[data-cleo-page] main.feb>*{max-width:none;margin-inline:0}',
  'html[data-cleo-page] main.feb>.masthead{padding:0}html[data-cleo-page] main.feb>.wrap{max-width:var(--maxw);margin-inline:auto}',
  'ul.tiles{list-style:none;margin:0;padding:0}ul.tiles>li{display:grid;min-width:0}',
  '.footer a{min-width:var(--tap)}.banner .btn-icon{min-height:var(--tap);width:var(--tap)}',
  '.searchpanel input::-webkit-search-cancel-button{display:none}',
  '.morelist{list-style:none;margin:8px 0 0;padding:0;display:grid;gap:8px;grid-template-columns:repeat(auto-fill,minmax(min(100%,240px),1fr))}',
  '.morelist a{display:flex;justify-content:space-between;align-items:center;gap:12px;min-height:var(--tap);padding:8px 14px;border:1px solid var(--line);border-radius:var(--r-m);background:var(--surface);text-decoration:none}',
  '.morelist .dest-n{font-weight:650}.morelist .dest-c{font-size:13px;color:var(--ink-3);white-space:nowrap}',
  '.csec{scroll-margin-top:calc(var(--bar-h) + 8px)}.csec+.csec{margin-top:36px}',
  '.csec .rail-head .d2 .n{font:500 15px/1 var(--font-ui);color:var(--ink-3);margin-left:8px}',
  '.csec .blurb{color:var(--ink-2);margin:-4px 0 14px;max-width:70ch;font-size:15px}',
  '.hero .search{margin-top:6px}.hero .inner{padding-bottom:22px}',
  '@media(max-width:639px){.hero .d-hero{font-size:34px}.hero .sub{font-size:15px;margin:8px 0 14px}.hero .kicker{margin-bottom:6px}.hero .inner{padding-top:calc(var(--bar-h) + 6px);padding-bottom:16px}.hero .search{min-height:50px}}',
  '.stickypills{position:sticky;top:var(--bar-h);z-index:30;background:color-mix(in srgb,var(--paper) 92%,transparent);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:8px 0}',
  '.searchpanel{position:fixed;left:0;right:0;top:var(--bar-h);z-index:50;max-height:calc(100vh - var(--bar-h));overflow:auto;background:var(--paper);border-bottom:1px solid var(--line);box-shadow:var(--e-2);padding:12px 0 16px}',
  '.results{margin:16px 0}.results h2{margin:0 0 6px}.results .grp{margin:14px 0 0}.results .grp h3{margin:0 0 4px;font:650 15px/1.3 var(--font-ui)}',
  '.results ol{list-style:none;margin:0;padding:0;display:grid;gap:4px}',
  '.results li a{display:flex;flex-wrap:wrap;align-items:center;gap:4px 10px;min-height:var(--tap);padding:6px 12px;border-radius:var(--r-s);background:var(--surface);border:1px solid var(--line);text-decoration:none}',
  '.results li a:hover{border-color:var(--ink)}.results .meta{font-size:13px;color:var(--ink-3)}',
  '.results .state{margin-top:8px}',
  '.banners{position:sticky;top:var(--bar-h);z-index:35}.banners .banner{border-radius:0;justify-content:center}',
  '.stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;background:var(--line);border:1px solid var(--line);border-radius:var(--r-m);overflow:hidden;margin:18px 0}',
  '@media(min-width:900px){.stats{grid-template-columns:repeat(4,minmax(0,1fr))}}',
  '.stats div{background:var(--surface);padding:14px 16px}.stats b{display:block;font:500 28px/1.1 var(--font-display)}.stats span{font-size:13.5px;color:var(--ink-3)}',
  '.prose{max-width:68ch}.prose h2{margin:36px 0 8px}.prose p,.prose li{color:var(--ink-2)}.prose li{margin:6px 0}',
  '.prose a{color:var(--ink);text-underline-offset:3px}',
  '.toc{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 0}',
  '.ladder{display:grid;gap:10px;margin:12px 0}.ladder div{display:flex;gap:12px;align-items:baseline}',
].join('');

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
  const fixed = { 'saved.html': 'Your list', 'how-we-choose.html': 'How we choose', '404.html': 'Page not found' };
  const out = [{ name: 'Destinations', href: 'index.html' }];
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
  const t = trail(rel).slice(1);
  if (!t.length) return '';
  return `<nav class="crumbs" aria-label="Breadcrumb">${t.map((c, i) => (i ? '<span class="sep" aria-hidden="true">›</span>' : '') +
    (c.href ? `<a class="c${i}" href="${up}${esc(c.href)}">${esc(c.name)}</a>` : `<span class="here" aria-current="page">${esc(c.name)}</span>`)).join('')}</nav>`;
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
  return `${sprite()}<a class="skip" href="#main">Skip to content</a>
<style>${TOPBAR_CSS}</style>
<header class="topbar${onNight ? ' on-night' : ''}" data-cleo-shell="topbar"><div class="wrap">
  <a class="brand" href="${up}index.html" aria-label="Cleo — all destinations">${MARK}<b>cleo</b><small>field guides</small></a>
  ${crumbs(rel, up)}
  <nav class="topnav" aria-label="Primary"><a href="${up}index.html#destinations"${cur('landing')}>Destinations</a><a href="${up}how-we-choose.html"${cur('method')}>How we choose</a></nav>
  <span class="spacer"></span>
  <div class="top-actions">
    <button type="button" class="btn btn-icon theme-toggle" aria-pressed="false" aria-label="Night edition" data-cleo-theme hidden>${icon('moon')}</button>
    <a class="btn btn-icon" href="${up}index.html#search" aria-label="Search every place" data-cleo-search-open>${icon('search')}</a>
    <a class="btn btn-icon count-dot" href="${up}saved.html" aria-label="Your list" data-cleo-saved-link${cur('saved')}>${icon('heart')}<span class="vh" data-cleo-saved-count></span></a>
  </div>
</div></header>
<div class="banners" data-cleo-banners aria-live="polite"></div>`;
}

/** Mobile tab bar (hidden ≥ 900 px by the stylesheet). Pages that show it add class="has-tabbar" to <body>. */
function tabBar({ depth, current }) {
  const up = '../'.repeat(depth);
  const cur = k => current === k ? ' aria-current="page"' : '';
  return `<nav class="tabbar" aria-label="Sections">
<a href="${up}index.html"${cur('landing')}>${icon('compass')}<span>Explore</span></a>
<a href="${up}index.html#search" data-cleo-search-open>${icon('search')}<span>Search</span></a>
<a href="${up}saved.html"${cur('saved')}>${icon('heart')}<span>Your list</span></a>
<a href="${up}how-we-choose.html"${cur('method')}>${icon('seal')}<span>Method</span></a>
</nav>`;
}

// ---------------------------------------------------------------- footer
/**
 * @param notes  the live page's method notes (city pages) — rendered verbatim in .method .note (RFC §5.5)
 * @param tabbar render the mobile tab bar (pages that also put class="has-tabbar" on <body>)
 */
function footer({ depth, liveRel, notes = [], tabbar = false, current }) {
  const up = '../'.repeat(depth);
  const live = liveRel ? `<a href="${LIVE_BASE}/${esc(liveRel)}">the current live guide</a>` : `<a href="${LIVE_BASE}/">the current live guides</a>`;
  const noteHtml = notes.map(n => `<div class="note"><h3>${esc(n.title || n.k)}</h3><p>${esc(n.body)}</p></div>`).join('\n');
  const T = SITE.totals;
  const v = f => assetV(f.replace(/\.js$/, ''), path.join(__dirname, '..', '..', 'client', f));
  return `${noteHtml ? `<section class="method wrap section" aria-labelledby="method-h"><h2 id="method-h" class="d2">How this guide was made</h2>\n${noteHtml}\n</section>` : ''}
<footer class="footer" role="contentinfo"><div class="wrap">
  <div class="cols">
    <div><a class="brand" href="${up}index.html" aria-label="Cleo — all destinations">${MARK}<b>cleo</b></a>
      <p>${T.places.toLocaleString('en-US')} places across ${T.guides} guides — every one traceable to the source that recommended it, pinned and status-checked.</p></div>
    <div><h4>Destinations</h4><ul>${SITE.countries.map(c => `<li><a href="${up}${esc(c.href)}">${esc(c.name)}</a></li>`).join('')}</ul></div>
    <div><h4>The method</h4><ul><li><a href="${up}how-we-choose.html">How we choose</a></li><li><a href="${up}how-we-choose.html#closures">Closed places</a></li><li><a href="${up}how-we-choose.html#pins">Pins</a></li></ul></div>
    <div><h4>Yours</h4><ul><li><a href="${up}saved.html">Your list</a></li><li><a href="${up}index.html#search">Search</a></li><li><button type="button" class="btn theme-toggle" aria-pressed="false" data-cleo-theme hidden>${icon('moon')}<span>Night edition</span></button></li></ul></div>
  </div>
  <p class="legal colophon">Cleo beta — every place is carried from ${live}, with its sources. Map tiles: © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>; Esri. No ratings, prices or hours are shown because they aren't in our data — check before you go.</p>
</div></footer>
${tabbar ? tabBar({ depth, current }) : ''}
<script src="${up}assets/js/states.js?v=${v('states.js')}" defer></script>
<script src="${up}assets/js/search.js?v=${v('search.js')}" defer></script>`;
}

module.exports = { siteBar, footer, tabBar, styles, setSite, site, trail, icon, MARK, LIVE_BASE };
