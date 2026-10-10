'use strict';
/**
 * render/method.js — beta/how-we-choose.html (M1-09) and beta/404.html (M1-19 "unknown page"). Lane FE-B.
 * Every number on the method page is computed here from the records every live page renders: nothing typed.
 * The rules it states are the repository's own gates (CLAUDE.md, docs/SOURCES.md, tools/research.js).
 */
const { esc } = require('../html');
const { head, siteBar, footer, styles } = require('./common');
const { icon, site } = require('./shell');

const TIER_SVG = {
  1: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle class="s" cx="12" cy="12" r="10.6" fill="none" stroke-width="1.5"/><path class="f" d="M12 4.2l1.75 6.05L19.8 12l-6.05 1.75L12 19.8l-1.75-6.05L4.2 12l6.05-1.75z"/></svg>',
  2: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle class="s" cx="12" cy="12" r="10.6" fill="none" stroke-width="1.5"/><path class="s" d="M12 4.2l1.75 6.05L19.8 12l-6.05 1.75L12 19.8l-1.75-6.05L4.2 12l6.05-1.75z" fill="none" stroke-width="1.4" stroke-linejoin="round"/><circle class="f" cx="12" cy="12" r="1.5"/></svg>',
  3: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path class="s" d="M12 5l7 7-7 7-7-7z" fill="none" stroke-width="1.6" stroke-linejoin="round"/></svg>',
};

/** Site-wide figures for the method page, from the normalised records of every place page. */
function stats(reg) {
  const rows = reg.rows.filter(r => r.kind === 'city');
  const recs = rows.flatMap(r => r.recs || []);
  const pubs = new Set();
  let cites = 0, added = 0;
  for (const r of rows) {
    const regs = Object.assign({}, r.data.S || {}, r.data.FS || {});
    for (const x of r.recs || []) {
      const keys = (x.s || []).map(e => Array.isArray(e) ? e[0] : e);
      cites += keys.length;
      if (keys.some(k => k === 'ADD' || k === 'FADD')) added++;
      for (const k of keys) {
        if (k === 'ADD' || k === 'FADD') continue;
        const s = regs[k]; const label = (s && (s.l || s.k)) || k;
        pubs.add(String(label).trim().toLowerCase());
      }
    }
  }
  const by = f => recs.filter(f).length;
  return {
    places: recs.length, guides: rows.length, sights: by(x => x.kind === 'sight'), food: by(x => x.kind === 'food'),
    publishers: pubs.size, cites, added,
    pinned: by(x => x.la != null), pinHigh: by(x => x.pv && x.pv.pin === 'high'),
    checked: by(x => x.pv && x.pv.checked), closed: by(x => x.closed),
    t1: by(x => x.t === 1), t2: by(x => x.t === 2), t3: by(x => x.t === 3),
    last: recs.map(x => x.pv && x.pv.checked).filter(Boolean).sort().pop() || '',
  };
}

function methodPage(reg, ctx) {
  const s = stats(reg);
  const n = v => v.toLocaleString('en-US');
  const title = 'How we choose · Cleo';
  const desc = `How ${n(s.places)} places got onto Cleo's maps: named sources, a merit bar, tiers graded within each area, pins checked to the door and closures checked against a source.`;
  const toc = [['merit', 'The merit bar'], ['sources', 'Sources'], ['tiers', 'Tiers'], ['pins', 'Pins'], ['closures', 'Closed places'], ['gaps', 'Stated gaps'], ['added', 'Added by the guide']];
  return `${head({ page: 'method', title, description: desc, rel: 'how-we-choose.html', depth: 0, assetsV: ctx.assetsV, css: styles(0), from: 'every live place page (computed stats)' })}
<body class="has-tabbar">
${siteBar({ depth: 0, current: 'method', rel: 'how-we-choose.html' })}
<main id="main" class="feb">
<section class="masthead" aria-labelledby="mh"><div class="inner">
  <h1 class="title d1" id="mh">How we choose</h1>
  <p class="facts">Every place on every Cleo map is there because someone credible recommended it — and you can see who. Here is the whole method, with the numbers as they stand today.</p>
</div><span class="accentbar"></span></section>
<div class="wrap section">
  <div class="stats" role="list" aria-label="The guide in numbers">
    <div role="listitem"><b>${n(s.places)}</b><span>places in ${s.guides} guides</span></div>
    <div role="listitem"><b>${n(s.publishers)}</b><span>named sources, ${n(s.cites)} citations</span></div>
    <div role="listitem"><b>${n(s.pinned)}</b><span>pinned places (${n(s.pinHigh)} at high confidence)</span></div>
    <div role="listitem"><b>${n(s.closed)}</b><span>closed places kept, flagged</span></div>
  </div>
  <p class="sm muted">${n(s.checked)} of ${n(s.places)} places carry a recorded status check${s.last ? `; the most recent was ${esc(s.last)}` : ''}. Computed from the guides when this page was built.</p>
  <nav class="toc" aria-label="On this page">${toc.map(([id, t]) => `<a class="pill" href="#${id}">${t}</a>`).join('')}</nav>
  <div class="prose">
  <h2 class="d2" id="merit">The merit bar</h2>
  <p>Being listed somewhere is not a reason to add a place. A mention only earns a place the right to be measured. It goes in when it clears at least one of these:</p>
  <ul>
    <li><b>Institutional authority</b> — a Michelin distinction, a James Beard win or semifinalist nod, a national-park or UNESCO designation.</li>
    <li><b>A real award or vote</b> — a "Best of" category win, a bylined critic's pick, an official landmark designation.</li>
    <li><b>A named rave from a creator or outlet that is itself credible</b> — real following, real track record, a piece you can find.</li>
    <li><b>Measured popularity with quality</b> — a high rating with real volume, cross-checked on at least two platforms.</li>
  </ul>
  <p>Then we keep the standouts. Four near-identical places doing the same thing is padding, and padding is a reason to drop.</p>
  <p>Food starts from what is unique to each city — its own dishes and drinks — before anything else.</p>

  <h2 class="d2" id="sources">Sources</h2>
  <p>A place needs <b>at least two credible sources</b>, or a single Michelin or James Beard recognition. Review sites such as Yelp and TripAdvisor never count as the recommender; they may only help measure popularity. Anonymous listicles and content farms are rejected.</p>
  <p>Every card says <b>Recommended by</b> and names its sources, so you can follow any source to everything else it recommends. Across the guides that is ${n(s.publishers)} named sources and ${n(s.cites)} citations.</p>

  <h2 class="d2" id="tiers">Tiers, graded within each area</h2>
  <p>Distinctions are graded inside each area of a city, not across the whole city — otherwise everything would cluster downtown. A place is a must-see <i>in its area</i>.</p>
  <div class="ladder">
    <div><span class="tier t1 lg">${TIER_SVG[1]}<span>Must see</span></span><span class="sm muted">${n(s.t1)} places</span></div>
    <div><span class="tier t2 lg">${TIER_SVG[2]}<span>Worth the detour</span></span><span class="sm muted">${n(s.t2)} places</span></div>
    <div><span class="tier t3 lg">${TIER_SVG[3]}<span>Deep cut</span></span><span class="sm muted">${n(s.t3)} places</span></div>
  </div>
  <p>These are our own marks. They are not ratings, and a closed place never carries one.</p>

  <h2 class="d2" id="pins">Pins, checked to the door</h2>
  <p>Every address and coordinate is checked against a real source — the place's official site, a map provider's place pin, OpenStreetMap or Wikipedia's published coordinates — never from memory. Each pin keeps its source, a confidence grade and the date it was verified.</p>
  <p>After every build the pins are audited again for placement. A pin read from a map's viewport instead of the place itself can land a street away, so those are re-checked and fixed. A coordinate we can't verify doesn't go on the map. ${n(s.pinned)} of ${n(s.places)} places are pinned; ${n(s.pinHigh)} at high confidence.</p>

  <h2 class="d2" id="closures">Closed places</h2>
  <p>Every place's open or closed status is checked against a real source: its own site or socials, a map listing marked permanently closed, a news story, or an official municipal page. The check date travels with the place.</p>
  <p><b>Closed places stay, flagged.</b> They keep their card so the record is honest, carry "Closed · kept for the record" with the source and date, and never carry a tier. Today that is ${n(s.closed)} places.</p>

  <h2 class="d2" id="gaps">Stated gaps</h2>
  <p>When a city has nothing that clears the bar for something — a cuisine, a kind of place — the guide says so in plain words instead of filling the slot with a weaker pick. Those notes appear on each city page under "How this guide was made".</p>

  <h2 class="d2" id="added">Added by the guide</h2>
  <p>A few places were added from the guide's own general knowledge rather than a named source. They are labelled <b>Added by the guide (general knowledge)</b> and are never relabelled as sourced. That is ${n(s.added)} of ${n(s.places)} places.</p>

  <h2 class="d2" id="not">What we don't show</h2>
  <p>No star ratings, review counts, prices or opening hours — they aren't in our data, and we don't guess. Check hours before you go.</p>
  </div>
</div>
</main>
${footer({ depth: 0, tabbar: true, current: 'method' })}
</body>
</html>
`;
}

function notFound(reg, ctx) {
  const T = site().totals;
  return `${head({ page: 'notfound', title: 'Page not found · Cleo', description: 'We couldn\'t find that page. Every Cleo guide is still listed.', rel: '404.html', depth: 0, assetsV: ctx.assetsV, css: styles(0) })}
<body class="has-tabbar">
${siteBar({ depth: 0, current: 'other', rel: '404.html' })}
<main id="main" class="feb"><div class="wrap section">
<div class="state" data-cleo-state="unknown-page">
  ${icon('compass', 'ico lg')}
  <h1 class="d2">We couldn't find that page.</h1>
  <p>It may have been renamed. Every guide is still listed — ${T.places.toLocaleString('en-US')} places across ${T.guides} guides.</p>
  <p><a class="btn btn-primary" href="index.html#destinations">See every destination</a> <a class="btn btn-ghost" href="index.html#search">Search every place</a></p>
</div>
</div></main>
${footer({ depth: 0, tabbar: true, current: 'other' })}
</body>
</html>
`;
}

/** Pages this module owns, keyed by beta-relative path. */
const pages = (reg, ctx) => ({ 'how-we-choose.html': methodPage(reg, ctx), '404.html': notFound(reg, ctx) });

module.exports = { pages, stats, TIER_SVG };
