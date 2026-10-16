'use strict';
/**
 * render/common.js — the shared <head> (meta, OG, JSON-LD, manifest, assets). Platform-owned.
 * Contract every beta page keeps:
 *   - content renders with no network: all CSS/JS is same-origin, fonts fall back to system faces;
 *   - the map is never required; no `document.write`; scripts are `defer`;
 *   - <html data-cleo-page="landing|city|hub"> lets QA and the client pick the right behaviour.
 */
const { esc, jsonInline } = require('../html');
const i18n = require('../i18n');                // W4 gap #8: <html lang> + hreflang from the active catalogue

const LIVE_BASE = 'https://alvations.github.io/cleo-guide';
const BETA_BASE = LIVE_BASE + '/beta';

/** W4 gap #6 (weight): an ItemList is carried in its compact form — each ListItem names the place and links its deep
 *  link (schema.org ListItem name + url). Address and coordinates stay on the card and in data/places/<page>.json, so
 *  every place is still listed; Tokyo's head drops ≈ 90 KB. Other JSON-LD types pass through untouched. */
function compactLd(ld) {
  if (!ld || ld['@type'] !== 'ItemList' || !Array.isArray(ld.itemListElement)) return ld;
  return Object.assign({}, ld, { itemListElement: ld.itemListElement.map(e => (e && e.item ? { '@type': 'ListItem', position: e.position, name: e.item.name, url: e.item.url } : e)) });
}

// i18n D-41: a second, offered locale (human- or AI-reviewed) is applied in the browser by client/locale.js. The pre-paint
// snippet reads the remembered choice (try/catch) or ?lang=, sets <html lang>, and holds the paint until the catalogue is
// applied (1.5 s failsafe), so the swap never shows as a layout shift. Japanese uses the existing font stack with Japanese
// system fallbacks (no CDN) and phrase-aware line breaking. Renders nothing while only en is offered.
const L10N_CSS = '.locales{display:flex;gap:2px;align-items:center;flex:none}.locales .btn{min-height:44px;min-width:44px;padding:0 10px;font-size:var(--fs-sm)}' +
  '.locales .btn[aria-pressed="true"]{background:var(--sand)}.on-night .locales .btn{color:var(--on-night)}.on-night .locales .btn[aria-pressed="true"]{background:rgba(255,255,255,.12)}' +
  '@media(max-width:899px){.locales .btn[aria-pressed="true"]{display:none}}html.cleo-l10n-wait body{visibility:hidden}' +
  'html:lang(ja){--font-ui:"Inter",system-ui,-apple-system,"Segoe UI",Roboto,"Hiragino Sans","Hiragino Kaku Gothic ProN","Yu Gothic UI","Yu Gothic",Meiryo,"Noto Sans JP","Noto Sans CJK JP","IPAGothic",sans-serif;' +
  '--font-display:"Bricolage Grotesque","Inter",system-ui,-apple-system,"Segoe UI",Roboto,"Hiragino Sans","Hiragino Kaku Gothic ProN","Yu Gothic UI","Yu Gothic",Meiryo,"Noto Sans JP","Noto Sans CJK JP","IPAGothic",sans-serif}' +
  'html:lang(ja) body{line-break:strict;word-break:normal}@supports (word-break:auto-phrase){html:lang(ja) body{word-break:auto-phrase}}' +
  'html:lang(ja) :is(h1,h2,h3,.btn,.pill,.topnav a,.tabbar a,.fh,.kicker){word-break:keep-all;overflow-wrap:anywhere}' +
  '.l10n-note{margin:0;padding:10px var(--gutter,16px);background:var(--sand);color:var(--ink);font-size:var(--fs-sm);line-height:1.6;text-align:center}.l10n-note span[lang="en"]{display:block;color:var(--ink-2);font-size:var(--fs-meta)}' +
  '.l10n-note a{color:inherit;text-underline-offset:3px;display:inline-flex;align-items:center;min-height:44px}';
function l10nHead(up, assetsV) {
  const others = i18n.offered().map(l => l.locale).filter(l => l !== 'en');
  if (!others.length) return '';
  // locale.js is injected only when a non-en locale is chosen (en pages pay no JS, no hide). On an en page a delegated
  // click on the switcher stores the choice and reloads; on a ja page locale.js owns the switcher.
  const src = `${up}assets/js/locale.js?v=${assetsV.locale}`;
  return `<style data-cleo-l10n>${L10N_CSS}</style>
<script>(function(){var d=document.documentElement,o=${JSON.stringify(others)},l=null,m=/[?&]lang=([a-z-]+)/.exec(location.search);if(m)l=m[1];else try{l=JSON.parse(localStorage.getItem("cleo:v1:locale"))}catch(e){}` +
  `document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-cleo-locale]");if(!b||window.CleoLocale||b.getAttribute("aria-pressed")==="true")return;try{localStorage.setItem("cleo:v1:locale",JSON.stringify(b.getAttribute("data-cleo-locale")))}catch(x){}var u=location.href.replace(/([?&])lang=[a-z-]+&?/,"$1").replace(/[?&](#|$)/,"$1");if(u===location.href)location.reload();else location.href=u});` +
  `if(o.indexOf(l)<0)return;d.lang=l;d.classList.add("cleo-l10n-wait");setTimeout(function(){d.classList.remove("cleo-l10n-wait")},1500);var s=document.createElement("script");s.src=${JSON.stringify(src)};document.head.appendChild(s)})()</script>`;
}

function head({ page, title, description, rel, depth, ogImage, jsonld, assetsV, preload = [], from = 'data', css = null }) {
  const up = '../'.repeat(depth);
  const url = BETA_BASE + '/' + rel.replace(/(^|\/)index\.html$/, '$1');
  const img = ogImage || BETA_BASE + '/assets/og-cover.png';
  return `<!DOCTYPE html>
<!-- generated by tools/beta/build.js from ${esc(from)} — do not edit; run \`npm run beta\` -->
<html lang="${esc(i18n.locale())}" data-cleo-page="${esc(page)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(url)}">
${i18n.offered().map(l => `<link rel="alternate" hreflang="${esc(l.locale)}" href="${esc(l.locale === 'en' ? url : url + '?lang=' + l.locale)}">`).join('\n') /* i18n D-41 */}
<link rel="alternate" hreflang="x-default" href="${esc(url)}">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#F7F4EE">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Cleo">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(img)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(img)}">
<link rel="manifest" href="${up}manifest.webmanifest">
<link rel="icon" href="${up}assets/icon.svg" type="image/svg+xml">
${assetsV.tokens ? `<link rel="stylesheet" href="${up}assets/tokens.css?v=${assetsV.tokens}">\n` : ''}${css ? css.join('\n') /* Constellation pages (FE-B shell.styles) */ : `<link rel="stylesheet" href="${up}assets/cleo.css?v=${assetsV.css}">`}
${preload.join('\n')}
${jsonld ? '<script type="application/ld+json">' + jsonInline(compactLd(jsonld)) + '</script>' : ''}
<script src="${up}assets/js/core.js?v=${assetsV.core}" defer></script>
${l10nHead(up, assetsV) /* i18n D-41 */}
</head>`;
}

// The visible shell (site bar, footer) is lane FE-B's: see render/shell.js. Re-exported for one import site.
const { siteBar, footer, styles } = require('./shell');

module.exports = { compactLd, head, siteBar, footer, styles, LIVE_BASE, BETA_BASE };
