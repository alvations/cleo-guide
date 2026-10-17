# R8 gap #6: CSS weight, measured (platform)

Target (orchestrator): the stylesheets a city page loads ≤ **250 KB raw**, with the R6 layers removed. Measured on this branch
after PERF-23 (the build now minifies the lane stylesheets it builds; `tools/beta/test-css-min.js` proves every rule is unchanged).

| File | Owner | Raw before | Raw now | On a city page |
|---|---|---|---|---|
| assets/cleo.css | designer | 189.8 KB | 189.8 KB (already compact; shipped as written) | yes |
| assets/fe-a.css | FE-A | 173.2 KB | **136.5 KB** (build minify) | yes |
| assets/tokens.css | designer | 12.6 KB | 12.6 KB (shipped as written) | yes |
| assets/fe-b.css | FE-B | 30.8 KB | **23.7 KB** (build minify) | landing, hubs, static pages |
| assets/constellation.css | designer (R6 art) | 40.2 KB | 40.2 KB | **no page links it**: already out of every page; the file can be deleted |

**A city page now loads 338.9 KB raw (cleo + fe-a + tokens), down from 375.6 KB. The target needs about 89 KB more, and that
has to be rule cuts in cleo.css (designer) and fe-a.css (FE-A).** The platform build can't cut further without changing rules.

## Where to cut: rules no page applies (coverage)

`node tools/beta/qa/css-coverage.js --all` (Chromium CSS coverage, unioned over 12 page/views × 390 / 1440 × light / dark with
the sheet, tray, filters, Show all and the phone map exercised, plus all 180 generated pages at 1440). A block below never
applied in any of those runs. These are **candidates, not proof**: print, error and offline states, the dark theme set by
its toggle (`[data-theme]`), other locales and rare widths can still need a rule. Each cut is the owner's call; re-run the
probe and the QC sweep after cutting.

| File | Size | Applied somewhere | Never applied here |
|---|---|---|---|
| assets/cleo.css | 189.8 KB | 118.8 KB | 71.0 KB (37 %) |
| assets/fe-a.css | 136.5 KB | 96.9 KB | 39.6 KB (28 %) |
| assets/fe-b.css | 23.7 KB | 21.2 KB | 2.5 KB (10 %) |
| assets/vendor/leaflet/leaflet.css | 14.5 KB | 5.6 KB | 8.9 KB (61 %) |
| assets/tokens.css | 12.6 KB | 9.6 KB | 3.0 KB (23 %) |

### cleo.css: the largest never-applied blocks (owner: designer)

| Bytes | Starts with |
|---|---|
| 5776 | `.view-gallery .all{margin-top:48px}.view-gallery .grid{display:grid;grid-template-columns:` |
| 4363 | `html .sharebar .btn{min-height:var(--tap);} .interests{display:grid;gap:var(--s-2);grid-te` |
| 3613 | `} .day .more{display:flex;flex-wrap:wrap;align-items:center;gap:var(--s-2) var(--s-2);}.da` |
| 3293 | `.tile .art .bar{background:linear-gradient(90deg,var(--city) 0 72%,var(--city-2) 72%);} #s` |
| 2623 | `.card h3 a{text-decoration:none;}.card h3 a::after{content:"";position:absolute;inset:0;z-` |
| 2445 | `html[data-view="gallery"] .split .pl-cover[data-comp="4"] .g-art{width:62%;right:12%;botto` |
| 2266 | `.countries::-webkit-scrollbar{display:none;} .interest{position:relative;display:grid;grid` |
| 2089 | `.toolbar .row{gap:var(--s-2);}} @font-face{font-family:"Bricolage Grotesque";font-style:no` |
| 1693 | `}:is(.view-insights,[data-cleo-insights]) .ix a:hover{text-decoration:underline}:is(.view-` |
| 1653 | `.plate .glyph{position:absolute;left:12px;bottom:10px;width:26px;height:26px;color:var(--c` |
| 1426 | `.search.compact{min-height:var(--tap);box-shadow:none;padding:0 var(--s-2) 0 var(--s-4);ba` |
| 1351 | `} @media print{.views[data-cleo-views],:is(.vw,[data-cleo-book],[data-cleo-insights]) .pag` |
| 1278 | `:is(.vw,[data-cleo-book],[data-cleo-insights]) .btn.ghost{background:transparent;color:var` |
| 1258 | `html[data-view="gallery"] .split .pl[data-m="sandwich"] > .pl-cover::before,.vw .cover[dat` |
| 1213 | `}:root[data-theme="dark"] :is(.vw,[data-cleo-book],[data-cleo-insights]) .cover{background` |
| 1154 | `html[data-cleo-page="landing"] main > .masthead:first-child h1,.masthead.hero h1{font-size` |
| 1143 | `.g[data-g="awning"]{--g:var(--g-awning);}.g[data-g="bottle"]{--g:var(--g-bottle);}.g[data-` |
| 1061 | `html[data-view="gallery"] .split .pl[data-gl="sandwich"] > .pl-cover::before,.vw .cover[da` |
| 1058 | `.banner.shared{background:var(--night);color:var(--on-night);}.banner.shared .btn{backgrou` |
| 948 | `:is(.vw,[data-cleo-book],[data-cleo-insights]) .cover.photo{background:var(--sand);}:is(.v` |
| 894 | `::view-transition-group(cleo-grow){animation-duration:var(--dur-grow);animation-timing-fun` |
| 874 | `} .hero{position:relative;background:var(--night);color:var(--on-night);overflow:hidden;is` |
| 807 | `@media print{:is(.view-guidebook,[data-cleo-book]) .top,:is(.view-guidebook,[data-cleo-boo` |
| 744 | `:root .pin-n:not(.sel):not(.day){--acq:color-mix(in oklab,var(--ac,var(--ink-3)) var(--are` |
| 679 | `.csec .blurb{color:var(--ink-2);margin:-4px 0 var(--s-4);max-width:70ch;font-size:var(--fs` |

### fe-a.css: the largest never-applied blocks (owner: FE-A (sources: tools/beta/lib/render/fe-a.css, atlas.css, atlas-nav.css, fe-c.css))

| Bytes | Starts with |
|---|---|
| 2369 | `html.atlas-m[data-view=atlas]:not(.ms-list) #cleo-grid li.pl::before{display:none}html.atl` |
| 2211 | `html.atlas-m.ms-list[data-view=atlas] .split::after{content:"";position:fixed;z-index:34;l` |
| 1761 | `.sv-map .pin-n{background:var(--ink);color:var(--paper);border:2px solid var(--surface);bo` |
| 1448 | `html.atlas-m[data-view=atlas] .ms-bar.ms-fl{-webkit-mask-image:linear-gradient(90deg,trans` |
| 1430 | `html.atlas-m[data-view=atlas]:not(.ms-list) #cleo-grid li.pl>:is(.ms-k,.ms-rec){font-size:` |
| 1337 | `html main[data-city] .leaflet-control.day-chip{display:flex;flex-wrap:wrap;align-items:bas` |
| 1325 | `.ms-pv-m .pl-cover{position:relative;width:100%;height:100%;margin:0;border-radius:0;aspec` |
| 1215 | `}@media (min-width:600px) and (max-width:1023px){html.atlas-m.ms-list[data-view=atlas] .li` |
| 1057 | `} @media (max-height:499px) and (orientation:landscape){html:root{--bar-h:48px}html body m` |
| 1032 | `html main[data-city] button.pl-save.heart[aria-pressed=true] .ico,html .view-gallery .gc .` |
| 1005 | `.listmenu{margin:0}.sv-x .btn{min-height:var(--tap);padding:0 var(--s-3);font-size:var(--f` |
| 945 | `.lf-rule{max-width:62ch;color:var(--ink-2)} .lens .empty-st{display:grid;gap:var(--s-2)}.l` |
| 924 | `@media (min-width:1024px){#cleo-sheet .sheet.exp{width:min(1080px,92vw);max-width:none}#cl` |
| 906 | `} @media (max-width:299px){html main[data-city]{--cbar-h:98px}html main[data-city] .views[` |
| 903 | `.leaflet-container .m-legend summary::-webkit-details-marker{display:none}:is(.leaflet-con` |
| 901 | `@media (min-width:768px) and (max-width:1023px) and (min-height:500px){html.atlas-m[data-v` |
| 795 | `html body nav.rail#cleo-rail .rail-i:focus-visible{border-radius:var(--r-s)!important} htm` |
| 770 | `html.atlas-m[data-view=atlas] main[data-city] .ms-bar .toolbar>.spill:is(:focus-within,.ha` |
| 767 | `.mappane .poi-sheet.full{max-height:86vh}.poi-sheet .pk-full{display:none}.poi-sheet.full ` |
| 662 | `@media (min-width:1024px){html body #cleo-sheet .sheet.exp .content>.plan{margin-top:0;pad` |
| 603 | `.sv-form{display:flex;flex-wrap:wrap;gap:var(--s-2);align-items:center;padding:var(--s-3);` |
| 602 | `html.atlas-m[data-view=atlas]:not(.ms-list) #cleo-grid li.pl>.pl-n a::after{content:"";pos` |
| 534 | `html.atlas-m.ov-c[data-view=atlas]:not(.ms-list):not(.ms-car) .ms-bar{transform:translateY` |
| 529 | `}.sv-city{margin:0 0 var(--s-5)}.sv-city>h2{display:flex;align-items:baseline;gap:var(--s-` |
| 455 | `} html.atlas-m[data-view=atlas] .leaflet-control-attribution.m-attr.m-attr-c{padding:0;bac` |

Full data (every block, with offsets): re-run the probe with `--out <file>.json`. Constellation.css is not counted: no page loads it.
