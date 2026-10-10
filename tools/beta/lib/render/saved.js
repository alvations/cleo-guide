'use strict';
/**
 * render/saved.js (FE-A) — "Your lists": places saved on this device, to design/beta/mockups/saved.html.
 * The lists are client-side by nature (no account, no server); this shell renders the frame, the no-JS message and
 * the page glue CSS. client/saved.js fills it from the per-page datasets (beta/data/places/<page>.json).
 */
const { head, siteBar, footer } = require('./common');

const ICONS = {
  heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"/>',
  share: '<path d="M12 3v12M7.5 7.5L12 3l4.5 4.5"/><path d="M5 12.5V20h14v-7.5"/>',
  download: '<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5"/><path d="M5 19.5h14"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
  directions: '<path d="M12 2.8l9.2 9.2-9.2 9.2L2.8 12z"/><path d="M9 14.5v-2.5a1.5 1.5 0 0 1 1.5-1.5h4.5M13 8.5l2 2-2 2"/>',
  stamp: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 12.2l2.3 2.3 4.7-4.8"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
};
const sprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">${Object.entries(ICONS).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join('')}</svg>`;

// page CSS lives in ./fe-a.css (shared with the city page) → beta/assets/fe-a.css

function render(ctx) {
  return `${head({ page: 'saved', title: 'Your lists · Cleo', description: 'Places you saved on this device, from every Cleo guide — named lists, been-there stamps, a map, and export to your maps app.', rel: 'saved.html', depth: 0, assetsV: ctx.assetsV })
    .replace('</head>', `<link rel="stylesheet" href="${ctx.feaCss}">\n</head>`)}
<body>
${sprite}
${siteBar({ depth: 0, current: 'saved', rel: 'saved.html' })}
<main id="main">
<header class="masthead"><p class="eyebrow">Saved</p><h1>Your lists</h1><p class="stats">Saved on this device only — no account, nothing leaves your browser unless you share a link or export a file.</p></header>
<section id="saved" aria-live="polite"><p>Your saved places appear here once the page script runs. Every guide works without it.</p></section>
</main>
${footer({ depth: 0 })}
<script src="assets/js/saved.js?v=${ctx.assetsV.saved}" defer></script>
</body>
</html>
`;
}
module.exports = { render };
