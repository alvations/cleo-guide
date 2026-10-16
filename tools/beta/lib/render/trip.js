'use strict';
/**
 * render/trip.js (FE-C, W9-4): "Trips". The page frame for beta/trip.html. Trips are client-side by nature (built
 * from places saved on this device, or opened from a #trip= link), so this renders the shell, the no-JS message and
 * the page CSS. client/trip.js fills #cleo-trip from the per-page datasets (beta/data/places/<page>.json).
 * Print: a booklet, with the cover and the left-out list on their own pages and one day a page.
 */
const { head, siteBar, footer } = require('./common');

const CSS = `
.trip-page{padding-bottom:48px}.tp-head{display:grid;gap:10px;margin:20px 0 18px}.tp-head h1{margin:0}.tp-head .lede{margin:0;max-width:62ch;color:var(--ink-2)}
.tp-sum{margin:0;font:600 var(--fs-ui)/1.4 var(--font-ui)}.tp-head .caveat{max-width:62ch}
.tp-pick{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px}.tp-pick .n{font-weight:400;color:var(--ink-3)}.tp-pick [aria-disabled=true]{opacity:.55;pointer-events:none}
.tp-from h2,.tp-mine h2,.tp-left h2{font:500 var(--fs-d2)/1.15 var(--font-display);margin:24px 0 10px}
.tp-mine ul{list-style:none;margin:0;padding:0;display:grid;gap:4px}.tp-mine li{display:flex;align-items:center;gap:8px;min-height:var(--tap)}.tp-mine a{min-height:var(--tap);display:inline-flex;align-items:center}
.tp-form{display:grid;gap:12px;max-width:640px;padding:16px;border:1px solid var(--line);border-radius:var(--r-m);background:var(--surface)}
.tp-form fieldset{border:0;margin:0;padding:0;display:grid;gap:10px}.tp-form legend{font-weight:600;padding:0;margin-bottom:8px}.tp-form p{margin:0}
.tp-days-pick{display:flex;flex-wrap:wrap;gap:8px}.tp-days-pick label{position:relative}.tp-days-pick input{position:absolute;opacity:0;inset:0;margin:0;cursor:pointer}
.tp-days-pick span{display:inline-flex;align-items:center;min-height:var(--tap);padding:0 16px;border:1px solid var(--line-strong);border-radius:var(--r-pill);background:var(--paper)}
.tp-days-pick input:checked+span{background:var(--ink);color:var(--paper);border-color:var(--ink)}.tp-days-pick input:focus-visible+span{outline:2px solid var(--focus);outline-offset:2px}
.tp-form input[type=text],.tp-form #tp-n{min-height:var(--tap);font:inherit;padding:0 12px;border:1px solid var(--line-strong);border-radius:var(--r-s);background:var(--paper);color:var(--ink);max-width:420px}
.tp-name{font-weight:600}
.tp-nav{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding:2px}.tp-nav::-webkit-scrollbar{display:none}
.tp-nav a{flex:none;display:inline-flex;align-items:center;min-height:var(--tap);padding:0 14px;border:1px solid var(--line);border-radius:var(--r-pill);background:var(--surface);text-decoration:none;font-size:var(--fs-sm)}
.tday{margin:0 0 20px;padding:16px;border:1px solid var(--line);border-left:4px solid var(--area,var(--city));border-radius:var(--r-m);background:var(--surface);display:grid;gap:12px}
.tday header{display:grid;gap:4px}.tday h2{margin:0;font:500 var(--fs-d2)/1.15 var(--font-display)}.tday-sum{margin:0;color:var(--ink-2)}
.tday-sk{width:100%;max-width:420px;height:auto;background:var(--paper);border-radius:var(--r-s)}.tday-sk text{font:700 11px/1 var(--font-ui);fill:var(--paper)}
.tstops{list-style:none;margin:0;padding:0;display:grid;gap:2px}.tstop{display:grid;grid-template-columns:30px minmax(0,1fr);gap:2px 10px;align-items:start}
.tstop .n{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:var(--area,var(--city));color:var(--paper);font:700 var(--fs-xs)/1 var(--font-ui);margin-top:6px}
.tstop-b{display:grid;gap:2px;min-width:0}.tstop .go{font-weight:600;min-height:var(--tap);display:inline-flex;align-items:center}.tstop .sm{font-size:var(--fs-sm);color:var(--ink-3)}
.tstop-src,.tstop .chk{margin:0;font-size:var(--fs-sm);color:var(--ink-2)}
.tstop .leg{grid-column:2;margin:4px 0 6px;display:flex;flex-wrap:wrap;gap:4px 10px;align-items:center;font-size:var(--fs-sm);color:var(--ink-2)}
.tstop .leg a{min-height:var(--tap);display:inline-flex;align-items:center}
.tday-acts{margin:0}.tp-gone{padding:12px 14px;border-radius:var(--r-m);background:var(--sand);margin:0 0 16px}
.tp-left ul{list-style:none;margin:0;padding:0;display:grid;gap:8px}.tp-left li{padding:10px 12px;border:1px solid var(--line);border-radius:var(--r-m);background:var(--surface)}
.tp-left li p{margin:4px 0 0;font-size:var(--fs-sm);color:var(--ink-2)}.tp-left li a{font-weight:600}.tp-left .sm{color:var(--ink-3);font-size:var(--fs-sm)}
@media (min-width:1024px){.tday{grid-template-columns:minmax(0,1fr) 340px;align-items:start}.tday header,.tday .tstops,.tday-acts{grid-column:1}.tday-sk{grid-column:2;grid-row:1/span 3}}
@media print{
  [data-cleo-shell],.footer,.tabbar,.banners,.skip,.sharebar,.tp-nav,.tday-acts,.tstop .leg a,.toast{display:none!important}
  body{background:#fff;color:#000}.trip-page{padding:0}.tp-cover{min-height:60vh;align-content:center}
  .tday{break-before:page;break-inside:avoid;border:0;border-left:4px solid var(--area,#555);padding:0 0 0 14px;background:none}
  .tday-sk{max-width:300px}.tp-left{break-before:page}.tstop .go{min-height:0}
}`.replace(/\n\s*/g, '');

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
