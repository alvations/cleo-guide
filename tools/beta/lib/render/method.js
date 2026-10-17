'use strict';
/**
 * render/method.js — beta/how-we-choose.html (M1-09) and beta/404.html (M1-19 "unknown page"). Lane FE-B.
 * Every number on the method page is computed here from the records every live page renders: nothing typed.
 * The rules it states are the repository's own gates (CLAUDE.md, docs/SOURCES.md, tools/research.js).
 */
const { esc } = require('../html');
const path = require('path');
const { head, siteBar, footer, styles } = require('./common');
const { icon, site } = require('./shell');
const { t } = require('../i18n');   // i18n D-41: the method pages' headings, labels and buttons come from the catalogue

const PAGE_CSS = `
.tablewrap{overflow-x:auto;margin:16px 0 8px}.ctable{border-collapse:collapse;width:100%;min-width:520px;font-size:15px}
.ctable caption{text-align:left;padding-bottom:6px}.ctable th,.ctable td{padding:10px 12px;border-bottom:1px solid var(--line);text-align:left}
.ctable td{font-variant-numeric:tabular-nums}.ctable thead th{font-size:13.5px;color:var(--ink-3);font-weight:650}
.a11y-list{display:grid;gap:10px;padding:0;list-style:none}.a11y-list li{border:1px solid var(--line);border-radius:var(--r-m);padding:12px 14px;background:var(--surface)}
.a11y-list li b{display:block;margin-bottom:2px}.gapstate{font-size:13px;font-weight:650;color:var(--warn,var(--ink-2))}
`;
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


/** Per-country figures for the method page (every number computed from the records). */
function countryTable(reg) {
  const n = v => v.toLocaleString('en-US');
  const rows = reg.countries.filter(c => c.live).sort((a, b) => a.order - b.order).map(c => {
    const recs = reg.rows.filter(r => r.kind === 'city' && r.country === c.key).flatMap(r => r.recs || []);
    const g = reg.rows.filter(r => r.kind === 'city' && r.country === c.key).length;
    const hi = recs.filter(x => x.pv && x.pv.pin === 'high').length;
    return { name: c.name, g, n: recs.length, hi, pct: recs.length ? Math.round(100 * hi / recs.length) : 0, closed: recs.filter(x => x.closed).length };
  }).filter(r => r.n);
  return `<div class="tablewrap" tabindex="0" role="region" aria-label="${t('m.tbl.aria')}"><table class="ctable"><caption class="sm muted">${t('m.tbl')}</caption>
<thead><tr><th scope="col">${t('m.th.country')}</th><th scope="col">${t('m.th.guides')}</th><th scope="col">${t('m.th.places')}</th><th scope="col">${t('m.th.pins')}</th><th scope="col">${t('m.th.closed')}</th></tr></thead>
<tbody>${rows.map(r => `<tr><th scope="row">${esc(r.name)}</th><td>${r.g}</td><td>${n(r.n)}</td><td>${n(r.hi)} (${r.pct} %)</td><td>${n(r.closed)}</td></tr>`).join('')}</tbody></table></div>`;
}

function methodPage(reg, ctx) {
  const s = stats(reg);
  const n = v => v.toLocaleString('en-US');
  const title = 'How we choose · Cleo';
  const desc = `How ${n(s.places)} places got onto Cleo's maps: named sources, a merit bar, tiers graded within each area, pins checked to the door and closures checked against a source.`;
  const toc = [['merit', t('m.merit')], ['sources', t('m.sources')], ['tiers', t('m.tiers')], ['pins', t('foot.method.pins')], ['closures', t('foot.method.closures')], ['gaps', t('m.gaps')], ['added', t('m.added')]];   // i18n D-41
  return `${head({ page: 'method', title, description: desc, rel: 'how-we-choose.html', depth: 0, assetsV: ctx.assetsV, css: styles(0), from: 'every live place page (computed stats)' }).replace('</head>', `<style>${PAGE_CSS}</style>\n</head>`)}
<body class="has-tabbar">
${siteBar({ depth: 0, current: 'method', rel: 'how-we-choose.html' })}
<main id="main" class="feb">
<section class="page-head" aria-labelledby="mh"><div class="inner">
  <h1 class="title d1" id="mh">${t('page.method')}</h1>
  <p class="lead">Every place on every Cleo map is there because someone credible recommended it — and you can see who. Here is the whole method, with the numbers as they stand today.</p>
</div></section>
<div class="wrap section">
  <div class="stats" role="list" aria-label="${t('m.stats')}">
    <div role="listitem"><b>${n(s.places)}</b><span>${t('m.st.places', { n: s.guides })}</span></div>
    <div role="listitem"><b>${n(s.publishers)}</b><span>${t('m.st.src', { n: n(s.cites) })}</span></div>
    <div role="listitem"><b>${n(s.pinned)}</b><span>${t('m.st.pins', { n: n(s.pinHigh) })}</span></div>
    <div role="listitem"><b>${n(s.closed)}</b><span>${t('m.st.closed')}</span></div>
  </div>
  <p class="sm muted">${n(s.checked)} of ${n(s.places)} places carry a recorded status check${s.last ? `; the most recent was ${esc(s.last)}` : ''}. Computed from the guides when this page was built.</p>
  ${countryTable(reg)}
  <nav class="toc" aria-label="${t('m.toc')}">${toc.map(([id, t]) => `<a class="pill" href="#${id}">${t}</a>`).join('')}</nav>
  <div class="prose">
  <h2 class="d2" id="merit">${t('m.merit')}</h2>
  <p>Being listed somewhere is not a reason to add a place. A mention only earns a place the right to be measured. It goes in when it clears at least one of these:</p>
  <ul>
    <li><b>Institutional authority</b> — a Michelin distinction, a James Beard win or semifinalist nod, a national-park or UNESCO designation.</li>
    <li><b>A real award or vote</b> — a "Best of" category win, a bylined critic's pick, an official landmark designation.</li>
    <li><b>A named rave from a creator or outlet that is itself credible</b> — real following, real track record, a piece you can find.</li>
    <li><b>Measured popularity with quality</b> — a high rating with real volume, cross-checked on at least two platforms.</li>
  </ul>
  <p>Then we keep the standouts. Four near-identical places doing the same thing is padding, and padding is a reason to drop.</p>
  <p>Food starts from what is unique to each city — its own dishes and drinks — before anything else.</p>

  <h2 class="d2" id="sources">${t('m.sources')}</h2>
  <p>A place needs <b>at least two credible sources</b>, or a single Michelin or James Beard recognition. Review sites such as Yelp and TripAdvisor never count as the recommender; they may only help measure popularity. Anonymous listicles and content farms are rejected.</p>
  <p>Every card says <b>Recommended by</b> and names its sources, so you can follow any source to everything else it recommends. Across the guides that is ${n(s.publishers)} named sources and ${n(s.cites)} citations.</p>

  <h2 class="d2" id="tiers">${t('m.tiers.h')}</h2>
  <p>Distinctions are graded inside each area of a city, not across the whole city — otherwise everything would cluster downtown. A place is a must-see <i>in its area</i>.</p>
  <div class="ladder">
    <div><span class="tier t1 lg">${TIER_SVG[1]}<span>Must see</span></span><span class="sm muted">${n(s.t1)} places</span></div>
    <div><span class="tier t2 lg">${TIER_SVG[2]}<span>Worth the detour</span></span><span class="sm muted">${n(s.t2)} places</span></div>
    <div><span class="tier t3 lg">${TIER_SVG[3]}<span>Deep cut</span></span><span class="sm muted">${n(s.t3)} places</span></div>
  </div>
  <p>These are our own marks. They are not ratings, and a closed place never carries one.</p>

  <h2 class="d2" id="pins">${t('m.pins.h')}</h2>
  <p>Every address and coordinate is checked against a real source — the place's official site, a map provider's place pin, OpenStreetMap or Wikipedia's published coordinates — never from memory. Each pin keeps its source, a confidence grade and the date it was verified.</p>
  <p>After every build the pins are audited again for placement. A pin read from a map's viewport instead of the place itself can land a street away, so those are re-checked and fixed. A coordinate we can't verify doesn't go on the map. ${n(s.pinned)} of ${n(s.places)} places are pinned; ${n(s.pinHigh)} at high confidence.</p>

  <h2 class="d2" id="closures">${t('foot.method.closures')}</h2>
  <p>Every place's open or closed status is checked against a real source: its own site or socials, a map listing marked permanently closed, a news story, or an official municipal page. The check date travels with the place.</p>
  <p><b>Closed places stay, flagged.</b> They keep their card so the record is honest, carry "Closed · kept for the record" with the source and date, and never carry a tier. Today that is ${n(s.closed)} places.</p>

  <h2 class="d2" id="gaps">${t('m.gaps')}</h2>
  <p>When a city has nothing that clears the bar for something — a cuisine, a kind of place — the guide says so in plain words instead of filling the slot with a weaker pick. Those notes appear on each city page under "How this guide was made".</p>

  <h2 class="d2" id="added">${t('m.added')}</h2>
  <p>A few places were added from the guide's own general knowledge rather than a named source. They are labelled <b>Added by the guide (general knowledge)</b> and are never relabelled as sourced. That is ${n(s.added)} of ${n(s.places)} places.</p>

  <h2 class="d2" id="not">${t('m.not')}</h2>
  <p>${t('m.not.p')}</p>
  <p>How the site itself is built for every reader — keyboard, screen reader, low vision, no network — is on the <a href="accessibility.html">accessibility page</a>.</p>
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
<main id="main" class="feb" style="min-height:calc(100svh - 64px)"><div class="wrap section">
<div class="state" data-cleo-state="unknown-page">
  ${icon('compass', 'ico lg')}
  <h1 class="d2">${t('nf.h')}</h1>
  <p>It may have been renamed. Every guide is still listed — ${T.places.toLocaleString('en-US')} places across ${T.guides} guides.</p>
  <p><a class="btn btn-primary" href="index.html#destinations">${t('nf.all')}</a></p>${''/* FE-C (QC r4 Med, one search entry point): the header's "Search all guides" is the page's one search */}
</div>
</div></main>
${footer({ depth: 0, tabbar: true, current: 'other' })}
</body>
</html>
`;
}

/** A city page left in another country's folder (registry kind `moved`, e.g. Singapore/hanoi.html → Vietnam/hanoi.html):
 * a pointer, so old shared links still land — the canonical is the city's own page, a visible link goes there, and it
 * is never a second card, search entry or feed (one city, one page). */
function movedPage(r, ctx) {
  const depth = r.beta.split('/').length - 1, up = '../'.repeat(depth), to = up + r.movedTo;
  const name = (r.data && r.data.meta && (r.data.meta.h1Main || r.data.meta.h1)) || path.posix.basename(r.live, '.html');
  return `${head({ page: 'moved', title: t('moved.title', { name: esc(name) }), description: t('moved.desc', { name: esc(name) }), rel: r.movedTo, depth, assetsV: ctx.assetsV, css: styles(depth) })}
<body class="has-tabbar">
${siteBar({ depth, current: 'other', rel: r.beta })}
<main id="main" class="feb"><div class="wrap section">
<div class="state" data-cleo-state="moved" data-moved-to="${esc(r.movedTo)}">
  ${icon('compass', 'ico lg')}
  <h1 class="d2">${t('moved.h', { name: esc(name) })}</h1>
  <p>${t('moved.p')}</p>
  <p><a class="btn btn-primary" href="${esc(to)}" data-cleo-moved>${t('moved.go', { name: esc(name) })}</a></p>
</div>
</div></main>
${footer({ depth, tabbar: true, current: 'other' })}
</body>
</html>
`;
}

/** beta/accessibility.html (M2-12): the commitment, what is measured, the known gaps, and how to report one. */
function accessibilityPage(reg, ctx) {
  const T = site().totals;
  const issue = 'https://github.com/alvations/cleo-guide/issues/new?labels=accessibility&title=' + encodeURIComponent('Accessibility: ');
  const title = 'Accessibility · Cleo';
  const desc = 'What Cleo commits to for every reader: WCAG 2.2 AA, measured on every build, with the known gaps stated and a way to report one.';
  const li = (b, t) => `<li><b>${b}</b>${t}</li>`;
  return `${head({ page: 'method', title, description: desc, rel: 'accessibility.html', depth: 0, assetsV: ctx.assetsV, css: styles(0), from: 'docs/BETA-QA.md (latest run) + design/beta/eval/ROUND-1.md' }).replace('</head>', `<style>${PAGE_CSS}</style>\n</head>`)}
<body class="has-tabbar">
${siteBar({ depth: 0, current: 'other', rel: 'accessibility.html' })}
<main id="main" class="feb">
<section class="page-head" aria-labelledby="ah"><div class="inner">
  <h1 class="title d1" id="ah">${t('page.accessibility')}</h1>
  <p class="lead">A guide is only useful if you can read it. Cleo aims to meet <b>WCAG 2.2 level AA</b> on every page, for every one of its ${T.places.toLocaleString('en-US')} places — and to say plainly where it doesn't yet.</p>
</div></section>
<div class="wrap section prose">
  <h2 class="d2" id="commit">${t('a.commit')}</h2>
  <ul class="a11y-list">
    ${li('Everything is readable without the map.', 'Every place is in the list as text — name, write-up, address, who recommends it, open or closed. The map is an extra; if it fails to load, nothing is lost.')}
    ${li('Everything is readable without a network or script.', 'Pages are plain HTML with system-font fallbacks; search, saving and filters add to it but are never needed to read a guide.')}
    ${li('Contrast at AA, in both editions.', 'Text and controls meet the AA contrast minimums in the day edition and the night edition. Colour is never the only signal: closed places say “Closed” in words, tiers have a name next to the glyph.')}
    ${li('Targets you can hit.', 'Every button and link outside running prose is at least 44 by 44 pixels.')}
    ${li('Keyboard all the way.', 'A skip link goes straight to the content; focus is always visible; dialogs (place details, filters, search) keep focus inside, close with Esc or Back, and return focus to where you were. In search results, the arrow keys move between results.')}
    ${li('Landmarks and names.', 'Each page has a header, navigation, main content and footer; every control has an accessible name.')}
    ${li('Motion only if you want it.', 'With “reduce motion” set on your device, nothing animates.')}
    ${li('Storage is optional.', 'If your browser blocks storage, your list still works for the session and the page tells you so.')}
  </ul>
  <h2 class="d2" id="measured">${t('a.measured')}</h2>
  <p>Each build is checked by an automated harness at a phone size (390 × 844) and a desktop size (1440 × 900) across every page: contrast in both editions, tap-target size, overflow, visible focus, landmarks, skip link, accessible names, and that every place can be reached by scrolling, by deep link, by search and with scripts off. The latest results are kept in the project's QA log alongside the evidence.</p>
  <h2 class="d2" id="gaps">${t('a.gaps')}</h2>
  <p>These are open today. We list them instead of claiming conformance we haven't measured.</p>
  <ul class="a11y-list">
    ${li('Map pins are not a keyboard list.', 'Pins on the map can be reached with a pointer; with a keyboard or screen reader, use the list, which carries every place the map shows, in the same order and numbering.')}
    ${li('The biggest guides are long pages.', 'Tokyo and New York hold close to 500 places each on one page, which can be slow to move through with a screen reader. Use the area links, the filters or search to jump. Lighter progressive loading is being built.')}
    ${li('Native-script names are not yet language-tagged.', 'Names such as 浅草寺 are shown beside the English name but are not yet marked as Japanese, so some screen readers may mispronounce them.')}
    ${li('English only.', 'The interface is in English. Place names stay in their own script.')}
    ${li('Not yet audited by a person.', 'The checks above are automated. A manual audit with assistive-technology users has not been done yet.')}
  </ul>
  <h2 class="d2" id="contact">${t('a.contact')}</h2>
  <p>If something on Cleo is hard to use, please <a href="${esc(issue)}">open an issue on GitHub</a> with the page and what happened. You don't need to know the technical cause — “I couldn't reach the Close button with the keyboard on the Tokyo page” is exactly the kind of report we need.</p>
</div>
<div class="wrap" style="padding-bottom:32px"><p><a class="btn btn-primary" href="${esc(issue)}">${t('a.report')}</a> <a class="btn btn-ghost" href="how-we-choose.html">${t('a.how')}</a></p></div>
</main>
${footer({ depth: 0, tabbar: true, current: 'other' })}
</body>
</html>
`;
}

/** Pages this module owns, keyed by beta-relative path. */
const pages = (reg, ctx) => ({ 'how-we-choose.html': methodPage(reg, ctx), 'accessibility.html': accessibilityPage(reg, ctx), '404.html': notFound(reg, ctx) });

module.exports = { pages, movedPage, stats, TIER_SVG };
