'use strict';
/**
 * render/trip.js (FE-C, W9-4): "Trips". The page frame for beta/trip.html. Trips are client-side by nature (built
 * from places saved on this device, or opened from a #trip= link), so this renders the shell, the no-JS message and
 * the page CSS. client/trip.js fills #cleo-trip from the per-page datasets (beta/data/places/<page>.json).
 * Print: a booklet, with the cover and the left-out list on their own pages and one day a page.
 */
const { head, siteBar, footer } = require('./common');

const CSS = require('fs').readFileSync(require('path').join(__dirname, 'fe-c-trip.css'), 'utf8').replace(/\/\*[^]*?\*\//g, '').replace(/\n\s*/g, '');

function render(ctx) {
  return `${head({ page: 'trip', title: 'Trips · Cleo', description: 'Make a trip of several days from places you saved: one area a day, nearest next, walking estimates, closed places left out with the reason. One link, a printable booklet and KML.', rel: 'trip.html', depth: 0, assetsV: ctx.assetsV })
    .replace('</head>', `<link rel="stylesheet" href="${ctx.feaCss}">\n<style>${CSS}</style>\n</head>`)}
<body>
${siteBar({ depth: 0, current: 'saved', rel: 'trip.html' })}
<main id="main" class="trip-page wrap">
<section id="cleo-trip" class="tp-root" aria-live="polite"><p>Trips are made in your browser from places you saved, so this page needs its script. Every guide and your saved list work without it.</p></section>
</main>
${footer({ depth: 0 })}
<script src="assets/js/trip.js?v=${ctx.assetsV.trip}" defer></script>
<script type="application/json" id="cleo-lazy">${JSON.stringify({ base: ctx.assetsV.base, 'share-card': ctx.assetsV['share-card'] })}</script>
</body>
</html>
`;
}
module.exports = { render, CSS };
