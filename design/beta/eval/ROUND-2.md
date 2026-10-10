# Evaluation round 2 — independent evaluator

> 2026-10-10 · evaluator lane (no build lane) · session_01PCNcUkfa5S1N1BKGzZA4xx
> **Measured:** R2 is the beta at `764dc97b` (head after the Wave 2 merges: FE-A slices 1–5, platform slices 3–6, designer
> pushes 2–4, imagery W2, FE-B W2). `npm run beta` regenerated it byte-identically: 95 pages, 84 place pages, 8,458 places,
> beta == live. `npm run validate`, `npm test` (all suites) and `npm run beta:check` are green.
> **Baseline:** R1 is the beta at `65e93e9`, the head [ROUND-1](ROUND-1.md) scored, read with `git archive 65e93e9 beta`.
> **Rubric:** unchanged from ROUND-1 so the rounds compare — the same four dimensions and weights, the same A/B sub-criteria,
> the same 35-row feature table for C (row numbers are ROUND-1's) and the same D strengths.

## Verdict

**Goal not met, but close on three of the four gates.** R2 scores **78.5 / 100** overall (R1 66.5), with **A = 67** and
**C = 89**. The goal is ≥ 80 overall with A ≥ 80 and C ≥ 80.

- **C clears its bar** (89 ≥ 80). Wave 2 shipped every "knows you" feature ROUND-1 asked for: For you, Your day, Near me,
  contextual rail modules, Recently closed, named saved lists, per-city share cards and the accessibility statement.
- **B and D are strong** (84, 86). Every pilot now scores 24/24 on `beta:metrics` (R1: harness-limited 19/24), and the
  initial DOM fell from 11.6 k to 1.7 k nodes on Tokyo.
- **A is the blocker** (67, needs 80). Wave 2's art is real — distinct per-city hub compositions, a country hero, city
  skylines, area silhouettes, a sheet locator, day-route art — but the beta still has **0 photographs** (egress policy;
  `CREDITS.json` credits = 0), the landing hero is unchanged, motion is minimal, and a layer of small polish defects remains.
- **Overall misses by 1.5 points.** A alone at 80 would put R2 at 83.7.

## Scorecard

| Dimension (weight) | R0 `ca70e53` | R1 `65e93e9` | **R2 `764dc97b`** | Δ R1→R2 | Goal |
|---|---:|---:|---:|---:|---:|
| A. Look & feel (40 %) | 32 | 60 | **67** | +7 | ≥ 80 |
| B. UX & ergonomics (25 %) | 25 | 74 | **84** | +10 | — |
| C. Competitor feature coverage (20 %) | 30 | 66 | **89** | +23 | ≥ 80 ✅ |
| D. Unique strengths (15 %) | 40 | 72 | **86** | +14 | — |
| **Overall (weighted)** | **31.1** | **66.5** | **78.5** | **+12.0** | **≥ 80** |

R2 = 0.4×67 + 0.25×84 + 0.2×89 + 0.15×86 = 26.8 + 21.0 + 17.8 + 12.9 = **78.5**.

## Method

Identical to ROUND-1, plus the flows that did not exist in R1.

1. `cd tools && npm install && npm run beta`: PASS, 0 files written. `npm run validate`, `npm test`, `npm run beta:check`: PASS.
2. Served the repo root (R2, port 8771) and a mirror with `beta/` swapped for `65e93e9:beta` (R1, port 8772) with
   `python3 -m http.server`.
3. Screenshots with [`r2/tools/shots-r2.js`](r2/tools/shots-r2.js) — ROUND-1's `shots-round.js` with the R2 page set:
   - Same capture settings: 390×844 @2× touch and 1440×900, light, reduced motion, pre-installed Chromium; every off-origin
     request aborted; tile requests get the same flat 1 px stub (**the blank map ground is a sandbox artefact**); saved list
     seeded with the same 4 refs.
   - Pages: landing, Japan hub, Tokyo, Cleveland, Chinatown & CBD (Singapore town), sheet (`#p=kanda-myojin`), mobile map +
     pin, tray, saved, method, source view, **day plan** (`#day=TAITO` and Cleveland's rail tile), **For you**, **Near me**
     (geolocation stubbed at Asakusa), **accessibility statement**, **Recently closed** (`#closed=1`).
   - Per-page metrics (DOM, overflow, map share, peek height, < 44 px targets, JS errors) in
     [`r2/shots-r2-log.json`](r2/shots-r2-log.json) and [`r2/shots-r1-log.json`](r2/shots-r1-log.json).
   - Side-by-side composites built with [`r2/tools/pair.py`](r2/tools/pair.py).
4. `npm run beta:metrics` on the pilot set, copied to [`r2/beta-metrics-r2.md`](r2/beta-metrics-r2.md); the QA-owned `qa/`
   files were restored afterwards.
5. Two targeted probes (day lens tap targets, desktop map frame on Chinatown & CBD). No web research this round;
   WebFetch was not used.

**Process note.** The PM's Round-2 exit criterion 2 (a QA W2 run in `BETA-QA.md`) is not met on this head — the last QA
section is W1 run 3. My `beta:metrics` run stands in for the measurements, but B-40 (offline reload) and the axe-core
criterion (M1-16) still have no QA sign-off, and that is reflected in C #28 below.

**Harness lag (QA).** `beta:metrics` B-12 reports "0 of 0 closed" on Cleveland, though the page carries its 13 closed
records (the masthead says so and `#closed=1` lists them). The check likely looks only at the initially rendered cards and
misses the platform's deferred ones. It needs updating before B-12 can be trusted again.

## Side-by-side (R1 → R2)

| Page | Mobile 390×844 | Desktop 1440×900 |
|---|---|---|
| Beta landing | ![](r2/landing-m-r1-r2.jpg) | ![](r2/landing-d-r1-r2.jpg) |
| Country hub (Japan) | ![](r2/japan-m-r1-r2.jpg) | ![](r2/japan-d-r1-r2.jpg) |
| Tokyo | ![](r2/tokyo-m-r1-r2.jpg) | ![](r2/tokyo-d-r1-r2.jpg) |
| Cleveland | ![](r2/cleveland-m-r1-r2.jpg) | ![](r2/cleveland-d-r1-r2.jpg) |
| Singapore town (Chinatown & CBD) | ![](r2/chinatown-m-r1-r2.jpg) | ![](r2/chinatown-d-r1-r2.jpg) |
| Place detail (Kanda Myōjin sheet) | ![](r2/sheet-m-r1-r2.jpg) | ![](r2/sheet-d-r1-r2.jpg) |
| Mobile map (toggle + pin peek) | ![](r2/map-m-r1-r2.jpg) | ![](r2/map-d-r1-r2.jpg) |
| Saved lists | ![](r2/saved-m-r1-r2.jpg) | ![](r2/saved-d-r1-r2.jpg) |
| Day plan (Tokyo `#day=TAITO`; R1 had none) | ![](r2/day-m-r1-r2.jpg) | ![](r2/day-d-r1-r2.jpg) |
| Day plan (Cleveland, from the rail tile) | ![](r2/daycle-m-r1-r2.jpg) | ![](r2/daycle-d-r1-r2.jpg) |
| For you picker | ![](r2/foryou-m-r1-r2.jpg) | ![](r2/foryou-d-r1-r2.jpg) |
| Near me | ![](r2/near-m-r1-r2.jpg) | ![](r2/near-d-r1-r2.jpg) |
| Recently closed (`#closed=1`) | ![](r2/closed-m-r1-r2.jpg) | ![](r2/closed-d-r1-r2.jpg) |
| Accessibility statement (R1: 404) | ![](r2/a11y-m-r1-r2.jpg) | ![](r2/a11y-d-r1-r2.jpg) |
| Method · source view | ![](r2/method-m-r1-r2.jpg) · ![](r2/source-m-r1-r2.jpg) | ![](r2/method-d-r1-r2.jpg) · ![](r2/source-d-r1-r2.jpg) |

| R2 scrolled, mobile: landing · Japan · Tokyo · Cleveland · Chinatown · day plan · saved |
|---|
| ![](r2/r2-scroll-m.jpg) |

## Key measurements (R1 → R2)

| Measure | R1 | R2 | Source |
|---|---|---|---|
| `beta:metrics` pilot score | 19/24 (harness lag) | **24/24 on all 5 cities, 10/10 landing** | `r2/beta-metrics-r2.md` |
| Initial DOM, Tokyo / NYC / Cleveland | 11,646 / 12,669 / 4,594 | **1,739 / 1,646 / 1,294** | metrics, shots log |
| DOM after opening a sheet or lens (Tokyo) | 11.7 k | 12.2–13.6 k | shots log (deferred cards all stamped) |
| Transfer, Tokyo | 1.8 MB | 1.97 MB | metrics |
| FCP Tokyo, 4× CPU | 628 ms | 1,012 ms | metrics (budget ≤ 1.0 s) |
| Desktop map share | 37 % | **44 %** | B-06 |
| Mobile pin peek height | 63 % | **39 %** | shots log `map-m` |
| Cards per mobile screen (min of pilots) | 1.95 | **2.26** | B-16 |
| Controls above first card | 14 | **13** | B-03 |
| Hub/landing images (motif SVG) · photos | 0 · 0 | **44 motif tiles on the landing, 192 motif files · 0 photos** | shots log, `beta/assets/img/` |
| Share cards | 1 shared | **90** (84 places + 6 countries) | platform slice 3 |
| JS errors on 36 captured flows | 0 | **0** | shots log |
| < 44 px targets | 0 on pilots | 0 on pilots; **10 on the day lens** ("More days" links, 17 px tall) | probe |

## Evidence per dimension

### A. Look & feel — R1 60 → R2 67

| Sub-criterion | R1 | R2 | Evidence (R2) and the pattern it is judged against |
|---|---:|---:|---|
| Visual polish | 62 | 74 | **Fixed since R1:** vertical plates fit (`神田明神` whole, Close no longer on the plate); the black sheet glyph is replaced by a locator inset; "Recommended by" commas hug the name; native name printed once on cards; the saved page is designed (covers, tabs, export bar, map). **Still visible:** <br>• the Tokyo hero's italic line drops macrons ("Jonan · Josai · Johoku", R1 had "Jōnan"; `tokyo-m`); <br>• on phones the hero skyline motif runs through the facts text (Tokyo, Cleveland; designer flagged it in REVIEW-W2); <br>• the mobile pin peek still prints "(皇居東御苑)" after the title (`map-m`); <br>• desktop map labels are bare white number boxes without area colour (`tokyo-d`), and Chinatown's desktop map opens with one label in frame (`chinatown-d`); <br>• the day lens "More days" links are 17 px tall; <br>• the same suspension-bridge line drawing recurs on several US tiles (Youngstown, Pittsburgh, NYC, San Francisco, Columbus). <br>Luxury hotel sites would ship none of these. |
| Imagery | 35 | 52 | Big honest step: every hub tile is now a distinct composition (city line drawing + initial + pin scatter + city colour; `landing-d`), the Japan hub has a full-bleed country hero (mountain, torii, seigaiha; `japan-d`), each city masthead carries a skyline, area silhouettes are drawn from verified pins, and every share card is rendered. **Still 0 photographs** (`CREDITS.json`: 0 credits, egress blocks the image hosts). Leading experience marketplaces and luxury hotel sites are photo-led; a line-drawing system reads as a stylish guidebook, not as a place you can see. The cap from ROUND-1 still applies: about 75–80 without photos. |
| Typography | 75 | 79 | Sheet body is now set in Figtree; the sheet title macron renders ("Kanda Myōjin"). Lost: the italic hero line now drops ō/ū (above). Uppercase ≤ 0.2 %. |
| Layout | 70 | 78 | Desktop map at 44 %; the day plan is a calm card with a stat strip, caveat, actions and a numbered spine (`day-d`); saved page in a split list + map; a 2-tile rail start on phones. No gallery/grid browse mode yet — one long list is the only layout. |
| Motion / delight | 45 | 50 | Map flies to the area in view and to the open sheet's place; the locator dot pulses (motion-safe). Nothing new on tap (save, collection glyph), and no view transitions. |
| Luxury + fun | 65 | 74 | ★ is now something you'd crave: "Only in Cleveland · Polish Boy · corned beef · Barberton chicken", "The hawker canon · chicken rice · laksa · bak chor mee", "New York classics". Per-city colour, art and a friendly "Who's showing you around?" picker. |
| Wanderlust | 45 | 62 | Hub tiles now say what to go for (Cleveland "Polish Boy · corned beef · Haserot Angel"; Tokyo "Edomae sushi · soba · Edo-Tokyo Museum"). The Japan hub has a cross-city "Collections in Japan" rail ("Anime pilgrimage · 115"). "A day in Taitō-ku" invites a plan. Still missing: the **landing hero is unchanged** (navy + type only; `landing-m`), no cross-country editorial rail on the landing, and no photography. |
| **A (mean)** | **60** | **67** | (74 + 52 + 79 + 78 + 50 + 74 + 62) / 7 = 67.0 |

How R2 compares with each family of leaders on look and feel:
- **Leading experience marketplaces.** Feature parity is now close (rail, picker, saved lists, heart, sheet). The feel gap is
  photos, depth and motion.
- **Luxury hotel sites.** Type and restraint are there; the residual polish list above and the missing imagery separate us.
- **Contextual hotel apps.** The rail modules (For you · Your day · Saved here · Near me · Free to visit) now play the
  contextual-home role.
- **Large booking sites.** Still deliberately less dense. Their gallery/grid browse mode has no counterpart yet (Round 3).
- **Map-app curated guides.** Closest family: source-as-cover, map + list, route art. Covers are drawn, not photographed.
- **Restaurant-guide publishers.** Tier ladder and method match; their detail pages are photo-led.

### B. UX & ergonomics — R1 74 → R2 84

| Area | R1 | R2 | Evidence |
|---|---:|---:|---|
| First screen | 85 | 87 | B-01 0.75–0.85; B-03 13 on every pilot; B-04 rail with 2 tiles on the first screen. |
| Discovery | 75 | 88 | For you (5 interests, id-mapped, reorder-only with a "First because…" line), Your day, Near me, Free to visit, Recently closed, ★ = city canon, canon-first food rail (QA-16 fixed), Japan cross-city collections. |
| Map ↔ list | 60 | 80 | Map 44 %; flies to the area being read and to the open sheet's place; numbered pins for the focused area at every zoom with 0 overlapping labels; hover→pin and pin→card both true (B-06); mobile peek 39 %. Labels lack area colour on desktop; Chinatown desktop frame (above). |
| Filters | 90 | 90 | Unchanged; tray verified ("Show 488 places"). |
| Detail | 85 | 88 | Sheet adds the locator inset and "Add to your day"; Close, trap, Esc, Back and focus restore all true (B-17). |
| Mobile | 75 | 80 | Saved page designed for phones; 0 overflow at 360/390; cards per screen ≥ 2.26. City pages still have no bottom bar; the day lens has 10 sub-44 px links. |
| Accessibility | 80 | 86 | Statement page `accessibility.html`; contrast AA 0/0 light + night on all pilots; 30/30 focus; landmarks and skip link. axe-core (M1-16) still not measured by QA. |
| Performance | 45 | 72 | Initial DOM 1.3–1.7 k (budget 3 k) with G1 reachability 100 % (scroll, deep link, search, no-JS). But opening any sheet or lens stamps every deferred card (Tokyo back to 12–13.6 k), Tokyo transfer grew to 1.97 MB, and Tokyo FCP at 4× is 1,012 ms (budget 1.0 s). |
| **B (mean)** | **74** | **84** | (87 + 88 + 80 + 90 + 88 + 80 + 86 + 72) / 8 = 83.9 |

### C. Competitor feature coverage — R1 66 → R2 89

Same 35 rows as ROUND-1 (leaders described neutrally here; ROUND-1 lists them). Legend: ✅ shipped (1) · ◐ partial (½) ·
✕ missing (0) · OOS out of scope (not counted).

| # | Feature | R1 | R2 | R2 evidence / what's missing |
|---|---|---|---|---|
| 1 | Inventory on first screen | ✅ | ✅ | B-01 0.75–0.85 |
| 2 | Collection rail as front door | ✅ | ✅ | ★ first and larger, now the city canon |
| 3 | Contextual home modules | ✕ | ✅ | Rail doors: For you · Your day · Saved here · Near me · Free to visit (`tokyo-d`) |
| 4 | Restraint plus local skin per city | ✅ | ✅ | Skins + per-city art |
| 5 | Visual anchor without photos: type plus map art | ◐ | ✅ | Hub compositions, city skylines, area silhouettes, sheet locator, day-route art (platform `lib/art.js`) |
| 6 | Licensed landmark photos | ✕ | ✕ | Blocked by egress; 0 credits; manifest path exists |
| 7 | Desktop split view, two-way sync | ◐ | ✅ | 44 %, fly-to area and sheet, hover→pin, pin→card |
| 8 | Mobile list first, map toggle, pin → sheet with detents | ✅ | ✅ | Peek 39 %, grabber to full |
| 9 | Numbered pins matching list, ordering stated | ◐ | ✅ | Focused-area numbers at every zoom, decluttered; B-09 pin labels == cards |
| 10 | Filter tray, "Show N", applied chips | ✅ | ✅ | B-10 |
| 11 | Situational picks from real fields | ◐ | ✅ | Free to visit, Near me, Your day as rail doors |
| 12 | Grounded personalisation, reorder-only | ✕ | ✅ | For you; record set identical (test-fe-a) |
| 13 | Tier ladder on pin, card and sheet | ✅ | ✅ | — |
| 14 | Published method behind badges | ✅ | ✅ | — |
| 15 | Attribution as navigation | ✅ | ✅ | `#src=` views |
| 16 | No manufactured urgency | ✅ | ✅ | — |
| 17 | Saved lists: heart, named lists | ◐ | ✅ | All saved · Been there · named lists (new, rename, delete), cards with covers, map |
| 18 | Share place, list, collection | ✅ | ✅ | + share this day, read-only shared list with "Save a copy" |
| 19 | "Been there" log | ✅ | ✅ | Stamp on saved cards + tray |
| 20 | Day plan with route line | ✕ | ✅ | 164 plans; numbered stops, straight-line legs labelled honestly, route on the map, share, KML |
| 21 | Concierge voice and microcopy | ✅ | ✅ | "Who's showing you around?", "Asks once · never stored" |
| 22 | Accessibility: AA plus published statement | ◐ | ✅ | `accessibility.html` + AA metrics |
| 23 | In-city search | ✅ | ✅ | — |
| 24 | Cross-city search from the hub | ✅ | ✅ | — |
| 25 | Per-place permalink | ✅ | ✅ | G1 deep 488/488 |
| 26 | Structured data JSON-LD | ✅ | ✅ | — |
| 27 | Per-city social card | ◐ | ✅ | 90 OG cards 1200×630 (the landing itself still uses the shared cover) |
| 28 | PWA / offline | ◐ | ◐ | Platform's kill-the-server check passes (Tokyo 488/488) but QA has not signed B-40, and there is no "Save this city for offline" button yet |
| 29 | Near me, opt-in | ✕ | ✅ | Asked on tap, in memory only, distance on cards (`near-m`: "10 m away") |
| 30 | Multilingual UI | ✕ | ✕ | No string catalogue or pseudo-locale (M3-03) |
| 31 | Freshness: status date + "Recently closed" | ◐ | ✅ | `#closed=1` lens ordered by check date |
| 32 | Directions / export to maps | ✅ | ✅ | + KML/GeoJSON export |
| 33 | Night edition by token | ✅ | ✅ | AA at night 0/0 |
| 34 | "What changed" feed | ✕ | ✕ | Not built (M3-07) |
| 35 | Functional delight, reduced-motion safe | ◐ | ◐ | Locator pulse, save stamp; no tap animation on the primary path |
| — | Out of scope (booking, reviews/UGC, accounts, chat concierge, list votes, hours/price/open-now, push/newsletter/analytics/affiliate) | OOS | OOS | Same reasons as ROUND-1 (X-01…X-09, LP-03) |

R2 tally:
- ✅ 30: #1–5, 7–27, 29, 31–33;
- ◐ 2: #28, 35;
- ✕ 3: #6, 30, 34;
- coverage: (30 + 1) / 35 = **88.6 % → 89**.

### D. Unique strengths — R1 72 → R2 86

| Strength | R1 | R2 | Evidence |
|---|---:|---:|---|
| Sourced picks; attribution as navigation | 90 | 92 | G6 100 % on every pilot; source chips now 44 px; share cards carry the ★ line. |
| Verified pins | 80 | 88 | Now visible as art: sheet locator from the area's verified pins, area silhouettes, day plans only use high/med pins (test). |
| Closure honesty | 85 | 92 | Recently closed lens with dates; closed stay flagged. |
| Interest triad | 60 | 80 | ★ is the city's food canon outside Japan (Cleveland, Pittsburgh, NYC, Singapore hawker canon); canon-first food rail. Pop culture outside Japan still has no data (LP-06). |
| Anime layer | 80 | 85 | Japan hub "Collections in Japan" leads with "Anime pilgrimage · 115"; ★ on every Japan page. |
| "Your guide" and day plans | 15 | 78 | Picker with live counts, reorder-only, a visible reason on each lifted card; 164 day plans with honest labels ("straight-line, not walking routes"), skipped areas say why. Missing: walking times, a day view on the saved page, a printable day. |
| Stated gaps | 85 | 85 | Unchanged. |
| **D (weighted judgement)** | **72** | **86** | Mean 85.7; sourcing and closure weigh most, as in R1. |

## Top 10 remaining gaps, ranked by expected score impact

Gain = weight × dimension points if the change fully lands. Together they project to about 89; plan on about 84.

| # | Gap | Concrete change | Lane | Expected gain |
|---:|---|---|---|---|
| 1 | **0 photographs** (A imagery cap) | Owner fetches the manifest's Wikipedia-linked landmark files on an unrestricted machine; the existing credit gate renders them on hub heroes, sheet covers and Gallery cards. Until then, keep the drawn system and do not fake it. | imagery + owner | A +9 → **+3.6** |
| 2 | **Polish residue** | Italic hero macrons (font subset); hero motif clear of the facts text on phones; drop "(native)" in the mobile peek title; area-coloured desktop pin labels; Chinatown desktop initial frame; "More days" links ≥ 44 px; vary the US line-drawing subjects so no two tiles share a bridge. | designer + FE-A + imagery | A +5 → **+2.0** |
| 3 | **No gallery/grid browse** (layout, wanderlust) | Round 3 **Gallery** view (default per SPEC): covered cards in a grid with paging, "all N" and show-all; same records and lenses. | FE-A + designer (PLAN A-01…) | A +4, B +2 → **+2.1** |
| 4 | **Landing has no wanderlust above the fold** | Landing hero art (country/city composition from the motif set), a cross-country editorial rail ("Anime pilgrimage across Japan", "Hawker canon", "Only in Cleveland"), and the US share card on the landing. | FE-B + designer | A +4 → **+1.6** |
| 5 | **Motion and delight** | Motion-safe micro-interactions: save heart/stamp, rail door press, sheet rise, view switch transition; nothing autoplaying. | designer + FE-A | A +3, C +0.6 (#35) → **+1.3** |
| 6 | **Weight after first tap** | Open a sheet or lens without stamping every deferred card (DOM stays ≤ 3 k); trim Tokyo transfer below 1.8 MB; FCP 4× ≤ 1.0 s. | platform | B +4 → **+1.0** |
| 7 | **QA W2 run missing** | `BETA-QA.md` W2 section: B-40 offline sign-off (+ "Save this city for offline" button → C #28 ✅), axe-core (M1-16), update B-12 for deferred cards. | QA + FE-A | C +1.4, B +1 → **+0.5** |
| 8 | **Multilingual scaffolding** (C #30) | String catalogue, pseudo-locale test, `hreflang`; switcher hidden until a reviewed locale exists (M3-03). | platform + FE-B | C +2.9 → **+0.6** |
| 9 | **"What changed" feed** (C #34) | Per-city changes page + Atom feed from the live dataset's git history (M3-07). | platform | C +2.9 → **+0.6** |
| 10 | **Triad and day depth** | Pop-culture records beyond Japan (LP-06, live-pipeline request); day plan on the saved page and printable (Guidebook). | PM (LP-06) + FE-A | D +4 → **+0.6** |

## Round 3 view styles — expected effect per dimension

Based on `design/beta/views/SPEC.md` and `PLAN.md` (one record set, one lens predicate set, a `view=` hash, paging only in
Gallery, sheet "n of N in this view").

| View | A | B | C | D | Notes and risks |
|---|---|---|---|---|---|
| **Gallery** (default) | **+3 to +4** (layout, wanderlust, luxury) | +1 (discovery density) | 0 on the R1 table; matches the grid browse mode of large booking sites | 0 | Biggest A lever after photos. Without photos a grid of drawn covers risks monotony — needs the varied compositions from gap 2. Paging must keep G1 reachability 100 %. |
| **Atlas** | +1 (map art at full size) | +2 (map ↔ list) | 0 (rows 7–9 already ✅) | +2 (verified pins as the hero) | Pin labels need area colour first (gap 2). |
| **Guidebook** | +2 (typography, luxury) | +1 (print, reading) | 0 | +1 (sourced prose, stated gaps, printable day) | Closest to the guide-brand feel; print CSS must stay AA. |
| **Insights** | +1 | +1 (discovery by area) | 0 | +3 (method transparency: `guide.areas` charts) | Unique — no leader shows its sourcing as data. Keep charts accessible with table views. |
| **Switcher overall** | — | −1 risk | — | — | Adds a control above the first card (B-03 is at 13 / 14) and, if every view mounts, DOM. Mount views lazily. |

**Projection after Round 3 without photos:** A ≈ 73–75, B ≈ 86, C ≈ 91 (if QA and #28/#35 close), D ≈ 89 → overall
**≈ 82–83**, but **A still < 80**. With photos (gap 1) on top: A ≈ 82, overall ≈ 86. Reaching the 90 stretch needs photos,
polish to zero defects and motion.

## Verdict against the goal

| Gate | Target | R2 | Met? |
|---|---|---:|---|
| Overall | ≥ 80 | 78.5 | ✕ (−1.5) |
| A. Look & feel | ≥ 80 | 67 | ✕ (−13) |
| C. Feature coverage | ≥ 80 | 89 | ✅ |
| Stretch | 90 | 78.5 | ✕ |

**Not met.** R2 is a strong round (+12): the product now covers almost every feature the leaders have that fits a static,
honest guide, and its unique strengths are visible. What remains is almost entirely **look and feel**: photographs (owner
action), a last polish pass, the Gallery view, a landing hero and motion. Round 3 should treat A as its only priority; C needs
only QA's sign-offs to hold.

## What R2 got right (keep)

- Every ROUND-1 "knows you" gap shipped with honest framing: For you reorders and never hides; days say "straight-line,
  not walking"; Near me asks once and never stores.
- ★ is now the city's own canon, never a publisher.
- Progressive rendering cut initial DOM by 85 % while keeping every place reachable with JS off.
- 24/24 on every pilot; 0 JS errors on 36 captured flows; AA in both themes.
- A drawn art system built from verified pins and original line work — no stock, no fabricated images.

## Reproduce

```bash
cd tools && npm install && npm run beta && npm run beta:metrics   # metrics → qa/ (QA-owned; restore after)
python3 -m http.server 8771                                      # from repo root (R2)
# R1: mirror the repo with beta/ → `git archive 65e93e9 beta`; serve on 8772
node design/beta/eval/r2/tools/shots-r2.js r2 8771 <out>/r2
node design/beta/eval/r2/tools/shots-r2.js r1 8772 <out>/r1
python3 design/beta/eval/r2/tools/pair.py <out>/r1 <out>/r2 design/beta/eval/r2 landing,japan,tokyo,...
```
