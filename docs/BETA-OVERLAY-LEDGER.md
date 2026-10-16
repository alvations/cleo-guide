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
| OV-00 | all | **Budgets and behaviour rules** (chrome share, clear map, label coverage, auto-hide on pan or scroll, landscape) | to be set | designer | open |
| OV-01 | Punggol · Atlas · phone · dark (live r7) | Three stacked fixed bars at the top (site header, view switch, chip row) never compact while the map is panned | from the screenshot: about a quarter of the screen is chrome before the map starts | FE-A (header, switch), FE-1 (chip row) | open |
| OV-02 | same | "Search this area" floats mid-map on the first screen | visible on load | FE-1 | open: rev 5a hides it on the first screen (dev); verify |
| OV-03 | same | Map label pills are large (14 px semibold plus a glyph). A long name ("Punggol Beach Massacre Site") spans about 60 % of the map width and covers pins | 2 pills ≈ 1/6 of the visible map | FE-1, FE-2 | open |
| OV-04 | same | Floating "Map" (base-style switch) and "Near me" text pills stack bottom right over pins; "Map" reads as a view next to "Atlas" | ≈ 2 × 56 px tall, ≈ 30 % of the width | FE-1 | open |
| OV-05 | same | The attribution pill "© OpenStreetMap · Esri ⓘ" spans about half the width on phone | ≈ 50 % of the width | FE-1 | open |
| OV-06 | same | The chip row floats over the top of the map with no scroll affordance; "Top picks" is cut at the edge | the row covers the map's top band | FE-1, designer | open |
| OV-07 | same | None of the overlays respond to the reader's pan or zoom: nothing compacts, so the map stays a strip | behaviour | FE-1, FE-A | open |
| OV-30 | Guidebook (Tokyo, Cleveland, Punggol) · 390×844, 390×664, 844×390, 768×1024 · light + dark | The sticky Contents strip (`nav.toc`, shared `top:105px`) sat under the city bar, which covered its top 20 px (portrait) / 36 px (landscape, tablet) | `tools/beta/feb-ov.js`: strip 105–166 under a bar ending at 125 / 141 | FE-B (+ designer: the shared 105 px in cleo.css) | claimed (1e9ac69ce) |
| OV-31 | Guidebook · 844×390 · light + dark | Header + city bar + sticky Contents strip + "Map" pill stacked to 52 % of the screen once the strip sat right | 52 % after a scroll → 36 % (the strip scrolls away below 500 px tall) | FE-B (strip); the rest is OV-32 | claimed (1e9ac69ce) |
| OV-32 | Guidebook + Insights (Tokyo, Cleveland, Punggol) · 844×390 · light + dark | Header (64) + city bar (77) + "Map" pill (48) never compact on scroll: 36 % of a landscape phone | 36 % at load and after a scroll | FE-A (header, city bar, pill) — per OV-00 | open |
| OV-33 | Guidebook + Insights · every viewport · light + dark | A fixed "Map" pill floats bottom centre over the reading text and duplicates the switcher's Atlas segment (two ways to the map on one screen) | 48 px tall, fixed, over content at 390 → 1440 | FE-A | open |
| OV-34 | Guidebook + Insights · 1024×768, 1440×900 · light + dark | The Gallery toolbar (`div.toolbar`, sticky 72–128) is stuck under the city bar (72–149) in the reading views: a hidden 56 px layer | overlap 56 px | FE-A | open |
| OV-35 | What changed (`changes/*.html`) + How we choose · 844×390 · light + dark | Site header (64) + tab bar (64) fixed: 33 % of a landscape phone, never compact | 33 % at load and after a scroll; 13–19 % portrait / tablet | FE-B (shell) — per OV-00 | open |

QC's S-17 sweep adds rows for every other page, view, viewport and theme. Lanes claim them with their fix SHA.
