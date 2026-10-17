# R8 gap #6: CSS weight, measured (platform) — corrected run

Target (orchestrator): the stylesheets a city page loads ≤ **250 KB raw**, with the R6 layers removed.

**Corrected 2026-10-17 (second run).** The first run (PERF-23) missed states only a returning reader sees; the designer's
cut bbaf111a8, made partly on it, lost the saved-heart rules (`.pl-save[aria-pressed="true"]`, found by platform) and a
day-plan rule (found by FE-A), and is being reverted. This run adds: a reader WITH saved places (saved.html, trip.html,
Tokyo Gallery; `cleo:v1:saved` seeded), hover on cards / tiles / rails, phone landscape 844×390, and a landing query —
on top of 12 page/views × 390 / 1440 × light / dark with the sheet, tray, filters, Show all and the phone map exercised,
and every generated page at 1440. The service worker is blocked and each run is one page in its own context, so every
page reports against the real stylesheets. The probe: `node tools/beta/qa/css-coverage.js --all --out <json>`.

Measured on dev at the time of the run, which still carried the designer's cut (cleo.css 149.7 KB). A city page
loaded **317.9 KB raw** (cleo + fe-a + tokens; fe-a ships minified by the build since PERF-23).

| File | Owner | Size | Applied somewhere | Never applied in this run |
|---|---|---|---|---|
| cleo.css | designer | 149.7 KB | 119.5 KB | 30.2 KB (20 %) |
| fe-a.css | FE-A (sources: tools/beta/lib/render/fe-a.css, atlas.css, atlas-nav.css, fe-c.css) | 155.7 KB | 115.7 KB | 40.0 KB (25 %) |
| fe-b.css | FE-B | 25.0 KB | 23.5 KB | 1.5 KB (6 %) |
| tokens.css | designer | 12.6 KB | 9.6 KB | 3.0 KB (23 %) |

Still **candidates, not proof**: states this run does not reach can need a rule — a day plan (`#day=`), For you, Near me,
`#p=` and the sheet's sub-states, share, trip with a plan, print, errors and offline, the `[data-theme]` toggle, other
locales. The orchestrator asked the designer to re-land the cut only with parity on those states too. A rule listed below
must still be checked against them by its owner.

### fe-a.css: the largest never-applied blocks (owner: FE-A (sources: tools/beta/lib/render/fe-a.css, atlas.css, atlas-nav.css, fe-c.css))

| Bytes | Starts with |
|---|---|
| 2369 | `html.atlas-m[data-view=atlas]:not(.ms-list) #cleo-grid li.pl::before{display:none}html.atl` |
| 2038 | `html.atlas-m.ms-nomap[data-view=atlas] .ms-toggle{display:none} html.atlas-m.ms-list[data-` |
| 1533 | `.sv-map .pin-n::before{display:none}[data-cleo-page=saved] .toast{position:fixed;left:50%;` |
| 1483 | `.leaflet-container .m-locate[aria-pressed=true]{background:var(--ink);color:var(--paper);b` |
| 1430 | `html.atlas-m[data-view=atlas]:not(.ms-list) #cleo-grid li.pl>:is(.ms-k,.ms-rec){font-size:` |
| 1416 | `@media (min-width:768px) and (max-width:1023px) and (min-height:500px){html.atlas-m[data-v` |
| 1363 | `html main[data-city] .leaflet-control.day-chip{display:flex;flex-wrap:wrap;align-items:bas` |
| 1325 | `.ms-pv-m .pl-cover{position:relative;width:100%;height:100%;margin:0;border-radius:0;aspec` |
| 1215 | `}@media (min-width:600px) and (max-width:1023px){html.atlas-m.ms-list[data-view=atlas] .li` |
| 987 | `html.atlas-m.ov-c[data-view=atlas]:not(.ms-list):not(.ms-car) .leaflet-bottom.leaflet-righ` |
| 941 | `@media (max-width:1023.98px){html.atlas-m.ms-on[data-view=atlas] body main[data-city] #cle` |
| 915 | `} @media (max-width:299px){html main[data-city]{--cbar-h:98px}html main[data-city] .views[` |
| 856 | `html main[data-city] button.pl-save.heart:focus-visible,html .view-gallery .gc .gc-save:fo` |
| 795 | `html body nav.rail#cleo-rail .rail-i:focus-visible{border-radius:var(--r-s)!important} htm` |
| 775 | `.mappane .poi-sheet.full{max-height:86vh}.poi-sheet .pk-full{display:none}.poi-sheet.full ` |
| 770 | `html.atlas-m[data-view=atlas] main[data-city] .ms-bar .toolbar>.spill:is(:focus-within,.ha` |
| 747 | `.m-styles{display:grid;grid-template-columns:1fr 1fr;gap:2px;padding:2px;margin:0 0 var(--` |
| 722 | `.sv-x summary::-webkit-details-marker{display:none}.sv-x .pop{position:absolute;z-index:20` |
| 707 | `} html.atlas-m.ms-list[data-view=atlas] .ms-head .ms-doors{display:flex;flex-wrap:wrap;gap` |
| 670 | `@media (min-width:1024px){html body #cleo-sheet .sheet.exp .content>.plan{margin-top:0;pad` |
| 617 | `html.atlas-m.ov-c[data-view=atlas]:not(.ms-list):not(.ms-car) .ms-bar{transform:translateY` |
| 611 | `.sv-form{display:flex;flex-wrap:wrap;gap:var(--s-2);align-items:center;padding:var(--s-3);` |
| 602 | `html.atlas-m[data-view=atlas]:not(.ms-list) #cleo-grid li.pl>.pl-n a::after{content:"";pos` |
| 574 | `@media (min-width:1024px){#cleo-sheet .sheet.exp{width:min(1080px,92vw);max-width:none}#cl` |
| 563 | `} html.atlas-m[data-view=atlas]:not(.ms-list) #cleo-grid li.pl>:is(.pl-chk,.pl-approx){pad` |

### cleo.css: the largest never-applied blocks (owner: designer)

| Bytes | Starts with |
|---|---|
| 3205 | `#saved{margin-top:var(--s-5);}#saved h2{font:500 var(--fs-d2)/1.15 var(--font-display);mar` |
| 2348 | `@keyframes w4-xf-g{from{opacity:.35;transform:translateY(8px);}to{opacity:1;transform:none` |
| 2089 | `.toolbar .row{gap:var(--s-2);}} @font-face{font-family:"Bricolage Grotesque";font-style:no` |
| 1548 | `}:is(.view-insights,[data-cleo-insights]) .ix a:hover{text-decoration:underline} @keyframe` |
| 1351 | `} @media print{.views[data-cleo-views],:is(.vw,[data-cleo-book],[data-cleo-insights]) .pag` |
| 1258 | `html[data-view="gallery"] .split .pl[data-m="sandwich"] > .pl-cover::before,.vw .cover[dat` |
| 1143 | `.g[data-g="awning"]{--g:var(--g-awning);}.g[data-g="bottle"]{--g:var(--g-bottle);}.g[data-` |
| 1065 | `@keyframes w3-pop{0%{transform:scale(1);}35%{transform:scale(1.32);}70%{transform:scale(.9` |
| 1061 | `html[data-view="gallery"] .split .pl[data-gl="sandwich"] > .pl-cover::before,.vw .cover[da` |
| 906 | `html .sharebar .btn{min-height:var(--tap);}.modules .modules::-webkit-scrollbar{display:no` |
| 807 | `@media print{:is(.view-guidebook,[data-cleo-book]) .top,:is(.view-guidebook,[data-cleo-boo` |
| 682 | `.suggest{margin-top:var(--s-2);background:var(--surface);border:1px solid var(--line);bord` |
| 616 | `html[data-view="gallery"] .split .pl[data-gl="tv"] > .pl-cover::before,.vw .cover[data-gl=` |
| 609 | `html[data-view="gallery"] .split .pl[data-m="tv"] > .pl-cover::before,.vw .cover[data-m="t` |
| 579 | `html[data-cleo-page="landing"] main > .masthead:first-child h1,.masthead.hero h1{font-size` |
| 477 | `.save .btn-icon:hover{color:var(--ink);}@keyframes stamp{0%{transform:scale(.6);}60%{trans` |
| 474 | `}@media (prefers-reduced-motion:no-preference){html{scroll-behavior:smooth;}} @media print` |
| 441 | `::view-transition-group(cleo-grow){animation-duration:var(--dur-grow);animation-timing-fun` |
| 426 | `html[data-view="gallery"] .split .pl[data-gl="dumpling"] > .pl-cover::before,.vw .cover[da` |
| 422 | `html[data-view="gallery"] .split .pl[data-m="dumpling"] > .pl-cover::before,.vw .cover[dat` |
| 391 | `html:root[data-view=atlas] #cleo-grid li.pl:not(.w7-cards li) > figure.pl-photo figcaption` |
| 373 | `.banner.offline{background:var(--night);color:var(--on-night);}.skeleton{background:linear` |
| 371 | `} .day .more{display:flex;flex-wrap:wrap;align-items:center;gap:var(--s-2) var(--s-2);}.da` |
| 327 | `.map-retry{display:inline-flex;align-items:center;min-height:var(--tap);padding:0 var(--s-` |
| 304 | `/* cleo.css — GENERATED by design/beta/tools/build-css.py — do not edit. Owner: UI/UX lane` |

FE-B checked fe-b.css's never-applied blocks on the first run: every one is state-dependent (hover, landscape, search
groups, photo-less hub covers), so FE-B cut nothing. constellation.css (R6 art, 40.2 KB) is linked by no page.
