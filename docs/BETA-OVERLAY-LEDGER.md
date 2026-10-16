# Overlay and chrome ledger (owner directive, 2026-10-16)

**Owner, on a phone screenshot of live Punggol Atlas (dark):** "Make sure the front end and the UI/UX work to fix this. You
see that in the Atlas mode some layers are not moving and taking up all the space. Improve it but don't just fix this.
Audit the whole beta site properly for these instances, keep a ledger, and make sure you check them doing the QC/QA checks
and patches."

Evidence: [`design/beta/eval/owner/2026-10-16-punggol-atlas-phone-dark.png`](../design/beta/eval/owner/2026-10-16-punggol-atlas-phone-dark.png)
(live r7, `b54b3745`, Singapore / Punggol, phone, dark, Atlas).

## What counts as an instance

Any layer that **stays put while the content under it moves**, or **takes space the reader came for**:

- fixed or sticky chrome (headers, view switches, chip rows, toolbars, trays) that does not compact or step aside while
  the reader pans the map or scrolls;
- floating controls, pills and buttons that sit over the map or content;
- map labels that cover the map, other places or controls;
- banners, toasts and popovers that stay after they're needed;
- duplicated controls (two ways to do the same thing in one screen);
- anything that leaves less clear map or content than its budget, in any orientation.

## How it's measured (QC S-17, QA B-25)

For every page × view (Atlas, Gallery, Guidebook, Insights, place detail, hubs, landing, trip, saved, method) × viewport
(390×844, 390×664 with browser chrome, 844×390 landscape, 768×1024, 1024×768, 1440×900) × theme (light, dark):

1. **Chrome share:** the fixed or sticky top and bottom chrome as a % of the viewport height, at load, after a scroll and
   after a map pan.
2. **Clear map** (map views): the map pane area not covered by any positioned layer except pins, as a % of the pane.
3. **Label coverage** (map views): the union of label pills over the map area. Also the widest label as a % of the map
   width, and label↔label or label↔control overlaps.
4. **Control collisions:** any fixed control overlapping another control, the selected pin or a labelled pin.
5. **Behaviour:** during a pan or scroll, does the chrome compact or hide, and does it come back on idle or tap? Is
   "Search this area" absent on the first screen? Do toasts leave?
6. **Duplicates:** the same action offered twice on one screen.

The designer sets the budgets (OV-00 below). QC's S-17 measures them on every sweep. QA's B-25 gates every release pin
on them. A row closes only when QC verifies it on a SHA.

## Ledger

Status: open → claimed (fix SHA) → verified (QC SHA). Owner: the lane that fixes it.

| Id | Where (page · view · viewport · theme) | Instance | Measured | Owner | Status |
|---|---|---|---|---|---|
| OV-00 | all | **Budgets and behaviour rules** (chrome share, clear map, label coverage, auto-hide on pan or scroll, landscape) | **Set (bb2af8732)**, SPEC-v3 §2.0 for Atlas and DESIGN-SYSTEM §v2.12 site-wide:
- Atlas at 390×664 at rest: chrome ≤ 32 %, clear ≥ 64 %. While panning: ≤ 10 % and ≥ 87 %, by auto-compact. The switch and chip rows and the peek hide on a pan and return after 1.2 s idle or a tap.
- One icon-only 44×96 control stack (Locate plus Layers): no "Map" pill, and "Near me" once.
- Attribution collapses to ⓘ after the first pan or 5 s.
- Labels: ≤ 40 % of the width and 13 px, a count from the map area (7 at 390×664), coverage ≤ 8 %.
- "Search this area" appears only after a pan, in a fixed slot.
- Landscape: one 48 px bar, no peek.
- Scroll pages: only the header stays. | designer | **set** |
| OV-01 | Punggol · Atlas · phone · dark (live r7) | Three stacked fixed bars at the top (site header, view switch, chip row) never compact while the map is panned | from the screenshot: about a quarter of the screen is chrome before the map starts | FE-A (header, switch), FE-1 (chip row) | **claimed, FE-A part** (commit "OV-01 …"). The header is 52 px on phones, 56 from 1024, 48 in landscape. The shared `Cleo.chrome` / `html.ov-c` state: the switch row and the sticky category rail slide under the header on a ≥ 24 px scroll down, and return on scroll up, focus, a sheet, or idle. Landscape: the switch sits in the header row (one bar). Desktop scroll pages: only the header is sticky. Measured on Punggol: P2 phone Atlas at rest is 31 % (≤ 32). While panning, the switch row is under the header; FE-1 hides the chip row and peek via `Cleo.chrome.compact(true,'pan')` / `idle(1200)`. Gallery after a scroll: P2 7.8 %, L 12.3 %, D 6.2 % (probe `beta:probe:fe-a:w8`). |
| OV-02 | same | "Search this area" floats mid-map on the first screen | visible on load | FE-1 | open: rev 5a hides it on the first screen (dev); verify |
| OV-03 | same | Map label pills are large (14 px semibold plus a glyph). A long name ("Punggol Beach Massacre Site") spans about 60 % of the map width and covers pins | 2 pills ≈ 1/6 of the visible map | FE-1, FE-2 | open |
| OV-04 | same | Floating "Map" (base-style switch) and "Near me" text pills stack bottom right over pins; "Map" reads as a view next to "Atlas" | ≈ 2 × 56 px tall, ≈ 30 % of the width | FE-1 | open |
| OV-05 | same | The attribution pill "© OpenStreetMap · Esri ⓘ" spans about half the width on phone | ≈ 50 % of the width | FE-1 | open |
| OV-06 | same | The chip row floats over the top of the map with no scroll affordance; "Top picks" is cut at the edge | the row covers the map's top band | FE-1, designer | open |
| OV-07 | same | None of the overlays respond to the reader's pan or zoom: nothing compacts, so the map stays a strip | behaviour | FE-1, FE-A | open |
| OV-08 | trip.html / Tokyo place · share-card preview · 844×390 (landscape) · light, dark | The 9:16 preview was taller than the screen inside a centred dialog that did not scroll: the top of the card (its cover and title) and the dialog heading were cut off | image 478 px in a 390 px viewport; heading off screen | FE-C | claimed (7f88a5ab2): the preview is sized from the viewport height, and short landscape puts it beside the text; whole dialog on screen, 9:16, no scroll at 390×664, 844×390, 768×1024, 1024×768 (probe `card-fit`) |
| OV-09 | Tokyo · Atlas · 1024×768 · light, dark | The place sheet opens as a side panel over the map and leaves a ≈ 70 px strip: the selected pin (senso-ji) is under the sheet | sheet 100 % of height, ≈ 52 % of width; pin covered | FE-A (sheet), FE-1 (map pan) | **claimed, FE-A part** (commit "OV-09/10/11/32/33/34 …"): from 1024 px the Atlas side sheet takes the list column (right, `max(420px,36vw)`), under the header, never the map. At 1024×768 the map pane stays fully clear and the selected pin is visible. FE-1 owns the map panning. |
| OV-10 | Tokyo · Gallery · 390×844, 390×664 · light, dark | With the place sheet open, the site header and the view switch stay above it (they are inert behind the modal) | 116 px = 14 % (844) / 17 % (664) of chrome over an 86 % sheet | FE-A | **claimed** (same commit): outside Atlas, on phones and tablets, a modal sheet (detail, For you, filters) owns the screen (top 0, z 80) under its own back/close bar. Phone Atlas keeps its map band (PANEL-R2 #1). |
| OV-11 | Tokyo · Gallery · 844×390 · light, dark | The place sheet takes 92 % of a landscape screen and slides under the header | sheet top 31 px; header 64 px over it | FE-A | **claimed** (same commit): at 844×390 the Gallery sheet fills the screen under its own bar, with no header above it. |
| OV-12 | Tokyo `#base=` · Gallery / Atlas list · 390×844 · light, dark | The base note ("Your base … Walk times are straight-line …" + "Nearest to my base" / "Clear my base") is in-flow, not fixed, but tall on phone | 133 px = 16 % of the viewport, once, scrolls away | FE-C | measured, awaiting OV-00 (in-flow notices); can compact to one line + two buttons |
| OV-30 | Guidebook (Tokyo, Cleveland, Punggol) · 390×844, 390×664, 844×390, 768×1024 · light + dark | The sticky Contents strip (`nav.toc`, shared `top:105px`) sat under the city bar, which covered its top 20 px (portrait) / 36 px (landscape, tablet) | `tools/beta/feb-ov.js`: strip 105–166 under a bar ending at 125 / 141 | FE-B (+ designer: the shared 105 px in cleo.css) | claimed (1e9ac69ce) |
| OV-31 | Guidebook · 844×390 · light + dark | Header + city bar + sticky Contents strip + "Map" pill stacked to 52 % of the screen once the strip sat right | 52 % after a scroll → 36 % (the strip scrolls away below 500 px tall) | FE-B (strip); the rest is OV-32 | claimed (1e9ac69ce) |
| OV-32 | Guidebook + Insights (Tokyo, Cleveland, Punggol) · 844×390 · light + dark | Header (64) + city bar (77) + "Map" pill (48) never compact on scroll: 36 % of a landscape phone | 36 % at load and after a scroll | FE-A (header, city bar, pill) — per OV-00 | **claimed** (same commit + OV-01 25d4f9ef): landscape has one 48 px header bar; the switch sits in it and nothing else is sticky. Tokyo Insights at 844×390: 12 %. |
| OV-33 | Guidebook + Insights · every viewport · light + dark | A fixed "Map" pill floats bottom centre over the reading text and duplicates the switcher's Atlas segment (two ways to the map on one screen) | 48 px tall, fixed, over content at 390 → 1440 | FE-A | **claimed** (same commit): no Map pill in Guidebook or Insights. |
| OV-34 | Guidebook + Insights · 1024×768, 1440×900 · light + dark | The Gallery toolbar (`div.toolbar`, sticky 72–128) is stuck under the city bar (72–149) in the reading views: a hidden 56 px layer | overlap 56 px | FE-A | **claimed** (same commit): no Gallery toolbar in the reading views. |
| OV-35 | What changed (`changes/*.html`) + How we choose (and the landing / hubs, same shell) · 844×390 + phones · light + dark | Site header (64) + tab bar (64) fixed: 33 % of a landscape phone, never compact | landscape 33 % → 12 % (one 48 px header with the site nav; the tab bar steps aside); P1 15 % → 8 % after a scroll (the tab bar slides away, returns on scroll up / focus). The 8 % left is the 64 px header (OV-37) | FE-B (shell) | claimed (c84fe342c) |
| OV-36 | Guidebook · 390×844, 390×664, 768×1024 · light + dark | The sticky Contents strip stayed put while the reader scrolled (a second sticky row) | after a 600 px scroll it is away (slid up behind the header); back on scroll up or focus. Measured: P1 22 % → 15 % (the 15 % is OV-37 + FE-A's city bar, OV-32) | FE-B | claimed (c84fe342c) |
| OV-37 | every page · phones 64 px / ≥ 1024 72 px · light + dark | The site / city header is taller than OV-00's 52 / 56 px, so even header-only screens miss the after-scroll budget (P1 8 % vs 7 %, T2 / D 9 % vs 8 %) | `feb-ov.js` header.topbar 0–64 / 0–72 | designer (--bar-h) + FE-A | open |

FE-C audit (fe-c-overlay.js, `cd tools && NODE_PATH=$(npm root -g) node beta/qa/overlay/fe-c-overlay.js`), all six ledger viewports ×
light/dark, no other instances on FE-C surfaces: trip.html (builder and a trip) and saved.html carry only the shared site
header (6–16 % of the height; 16 % at 844×390 is OV-01's header, FE-A); toasts (trip "Link copied", base set/clear, the
sheet's) are gone 4 s after they appear, at every viewport; the empty states are in-flow (the Atlas one is FE-1's list head,
QC-05); no FE-C layer collides with another control. Not FE-C's and not measured here: the offline-pack banner (platform,
pack.js) and the language switch (header, i18n / FE-A).

QC's S-17 sweep adds rows for every other page, view, viewport and theme. Lanes claim them with their fix SHA.
