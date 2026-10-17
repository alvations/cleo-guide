# R8 gap #6: CSS weight, measured (platform) — third run (designer's re-cut 69128c498 on dev)

Target (orchestrator): the stylesheets a city page loads ≤ **250 KB raw**, with the R6 layers removed.

**History.** Run 1 (PERF-23) missed states only a returning reader sees; the designer's first cut (bbaf111a8) lost the
saved-heart rules and a day-plan rule and was reverted. Run 2 added a reader WITH saved places, hover, 844×390 and a landing
query. **This run (2026-10-17, dev ef8d5b0d)** is on the designer's re-cut (cleo.css 160.2 KB, state families protected):
the saved heart is back (computed style identical to pre-cut), and none of the 285 removed rules match any element for a
saved reader (saved.html 390 / 1440, trip.html). Probe: `node tools/beta/qa/css-coverage.js --all --out <json>` (service
worker blocked; one page per context).

A city page loads **332.7 KB raw** (cleo + fe-a + tokens; fe-a minified by the build since PERF-23).

| File | Owner | Size | Applied somewhere | Never applied in this run |
|---|---|---|---|---|
| cleo.css | designer | 160.2 KB | 120.4 KB | 39.8 KB (24 %) |
| fe-a.css | FE-A (sources: tools/beta/lib/render/fe-a.css, atlas.css, atlas-nav.css, fe-c.css) | 159.8 KB | 119.4 KB | 40.4 KB (25 %) |
| fe-b.css | FE-B | 25.3 KB | 23.5 KB | 1.8 KB (7 %) |
| tokens.css | designer | 12.6 KB | 9.6 KB | 3.0 KB (23 %) |

Still **candidates, not proof**: states this run does not reach can need a rule — a day plan (`#day=`), For you, Near me,
`#p=` and the sheet's sub-states, share, trip with a plan, print, errors and offline, the `[data-theme]` toggle, other
locales. The designer's widened sweep covers several of them; a cut needs both lists to agree. To verify at 844×390 (Tokyo
Gallery, saved reader): removed rules `.pl-k .lbl` and `:is(.vw,[data-cleo-book],[data-cleo-insights]) .cover…` match there.

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
| 1340 | `html.atlas-m.ov-c[data-view=atlas]:not(.ms-list):not(.ms-car) .leaflet-bottom.leaflet-righ` |
| 1326 | `.ms-pv-m .pl-cover{position:relative;width:100%;height:100%;margin:0;border-radius:0;aspec` |
| 1215 | `}@media (min-width:600px) and (max-width:1023px){html.atlas-m.ms-list[data-view=atlas] .li` |
| 941 | `@media (max-width:1023.98px){html.atlas-m.ms-on[data-view=atlas] body main[data-city] #cle` |
| 915 | `} @media (max-width:299px){html main[data-city]{--cbar-h:98px}html main[data-city] .views[` |
| 856 | `html main[data-city] button.pl-save.heart:focus-visible,html .view-gallery .gc .gc-save:fo` |
| 825 | `html.atlas-m[data-view=atlas] main[data-city] .ms-bar .toolbar>.spill:is(:focus-within,.ha` |
| 795 | `html body nav.rail#cleo-rail .rail-i:focus-visible{border-radius:var(--r-s)!important} htm` |
| 775 | `.mappane .poi-sheet.full{max-height:86vh}.poi-sheet .pk-full{display:none}.poi-sheet.full ` |
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
| 2721 | `html .sharebar .btn{min-height:var(--tap);} .interests{display:grid;gap:var(--s-2);grid-te` |
| 2348 | `@keyframes w4-xf-g{from{opacity:.35;transform:translateY(8px);}to{opacity:1;transform:none` |
| 2266 | `.countries::-webkit-scrollbar{display:none;} .interest{position:relative;display:grid;grid` |
| 2089 | `.toolbar .row{gap:var(--s-2);}} @font-face{font-family:"Bricolage Grotesque";font-style:no` |
| 1548 | `}:is(.view-insights,[data-cleo-insights]) .ix a:hover{text-decoration:underline} @keyframe` |
| 1373 | `.view-gallery .pager .pg[aria-current]{background:var(--ink);color:var(--paper)}.view-gall` |
| 1351 | `} @media print{.views[data-cleo-views],:is(.vw,[data-cleo-book],[data-cleo-insights]) .pag` |
| 1258 | `html[data-view="gallery"] .split .pl[data-m="sandwich"] > .pl-cover::before,.vw .cover[dat` |
| 1247 | `.card h3 .native{display:block;font-size:var(--fs-meta);color:var(--ink-3);margin-top:var(` |
| 1143 | `.g[data-g="awning"]{--g:var(--g-awning);}.g[data-g="bottle"]{--g:var(--g-bottle);}.g[data-` |
| 1065 | `@keyframes w3-pop{0%{transform:scale(1);}35%{transform:scale(1.32);}70%{transform:scale(.9` |
| 941 | `.suggest{margin-top:var(--s-2);background:var(--surface);border:1px solid var(--line);bord` |
| 807 | `@media print{:is(.view-guidebook,[data-cleo-book]) .top,:is(.view-guidebook,[data-cleo-boo` |
| 744 | `html[data-cleo-page="landing"] main > .masthead:first-child h1,.masthead.hero h1{font-size` |
| 704 | `::view-transition-group(cleo-grow){animation-duration:var(--dur-grow);animation-timing-fun` |
| 665 | `.banner{display:flex;gap:var(--s-2);align-items:center;padding:var(--s-3) var(--s-4);borde` |
| 616 | `html[data-view="gallery"] .split .pl[data-gl="tv"] > .pl-cover::before,.vw .cover[data-gl=` |
| 609 | `html[data-view="gallery"] .split .pl[data-m="tv"] > .pl-cover::before,.vw .cover[data-m="t` |
| 539 | `.poi-sheet .grab{width:40px;height:5px;border-radius:var(--r-pill);background:var(--line-s` |
| 474 | `}@media (prefers-reduced-motion:no-preference){html{scroll-behavior:smooth;}} @media print` |
| 448 | `.switch{width:46px;height:28px;border-radius:var(--r-m);background:var(--line-strong);posi` |
| 434 | `.status{display:inline-flex;align-items:center;gap:var(--s-2);font-size:var(--fs-xs);font-` |
| 426 | `html[data-view="gallery"] .split .pl[data-gl="dumpling"] > .pl-cover::before,.vw .cover[da` |
| 422 | `html[data-view="gallery"] .split .pl[data-m="dumpling"] > .pl-cover::before,.vw .cover[dat` |

FE-B checked fe-b.css's never-applied blocks: every one is state-dependent (hover, landscape, search groups, photo-less
hub covers), so FE-B cut nothing. constellation.css (R6 art, 40.2 KB) is linked by no page.
