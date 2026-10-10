'use strict';
/**
 * render/shell.js — the visible shell every beta page shares: skip link, site bar (brand, site search,
 * nav) and footer (method notes, credits). Lane FE-B owns this file (site-wide navigation).
 * Contract: any href="#…" must point at a real element id — JS-only actions are <button>s (QA's link
 * checker reads every in-page href as an anchor).
 */
const { esc } = require('../html');
const LIVE_BASE = 'https://alvations.github.io/cleo-guide';

function siteBar({ depth, current }) {
  const up = '../'.repeat(depth);
  return `<a class="skip" href="#main">Skip to content</a>
<header class="sitebar" role="banner">
  <a class="brand" href="${up}index.html" aria-label="Cleo — all destinations">CLEO</a>
  <form class="sitesearch" role="search" action="${up}index.html" method="get" data-cleo-search>
    <label class="vh" for="cleo-q">Search every place</label>
    <input id="cleo-q" name="q" type="search" placeholder="Search places, dishes, cities" autocomplete="off">
  </form>
  <nav class="sitenav" aria-label="Site">
    <a href="${up}index.html#destinations"${current === 'landing' ? ' aria-current="page"' : ''}>Destinations</a>
    <a href="${up}saved.html" data-cleo-saved-link>Saved <span class="count" data-cleo-saved-count></span></a>
  </nav>
</header>`;
}

function footer({ depth, liveRel, notes = [] }) {
  const up = '../'.repeat(depth);
  const live = liveRel ? `<a href="${LIVE_BASE}/${esc(liveRel)}">the current live guide</a>` : 'the current live guide';
  const noteHtml = notes.map(n => `<div class="note"><h3>${esc(n.title || n.k)}</h3><p>${esc(n.body)}</p></div>`).join('\n');
  return `<footer class="sitefoot" role="contentinfo">
  ${noteHtml ? `<section class="method" aria-labelledby="method-h"><h2 id="method-h">How this guide was made</h2>\n${noteHtml}\n</section>` : ''}
  <p class="colophon">Cleo beta — every place is carried from ${live}, with its sources. Map tiles: © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>; Esri. <a href="${up}index.html">All destinations</a>.</p>
</footer>`;
}

module.exports = { siteBar, footer };
