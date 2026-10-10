'use strict';
/** render/saved.js — "Your list" (saved places on this device). The list itself is client-side by nature. */
const { head, siteBar, footer } = require('./common');

function render(ctx) {
  return `${head({ page: 'saved', title: 'Your list · Cleo', description: 'Places you saved on this device, from every Cleo guide.', rel: 'saved.html', depth: 0, assetsV: ctx.assetsV })}
<body>
${siteBar({ depth: 0, current: 'saved' })}
<main id="main">
<header class="masthead"><h1>Your list</h1><p class="stats">Saved on this device only — no account, nothing leaves your browser unless you share the link.</p></header>
<section id="saved" aria-live="polite"><p>Your saved places appear here once the page script runs.</p></section>
</main>
${footer({ depth: 0 })}
<script src="assets/js/saved.js?v=${ctx.assetsV.saved}" defer></script>
</body>
</html>
`;
}
module.exports = { render };
