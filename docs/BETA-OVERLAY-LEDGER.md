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
| OV-01 | Punggol · Atlas · phone · dark (live r7) | Three stacked fixed bars at the top (site header, view switch, chip row) never compact while the map is panned | from the screenshot: about a quarter of the screen is chrome before the map starts | FE-A (header, switch), FE-1 (chip row) | open |
| OV-02 | same | "Search this area" floats mid-map on the first screen | visible on load | FE-1 | open: rev 5a hides it on the first screen (dev); verify |
| OV-03 | same | Map label pills are large (14 px semibold plus a glyph). A long name ("Punggol Beach Massacre Site") spans about 60 % of the map width and covers pins | 2 pills ≈ 1/6 of the visible map | FE-1, FE-2 | open |
| OV-04 | same | Floating "Map" (base-style switch) and "Near me" text pills stack bottom right over pins; "Map" reads as a view next to "Atlas" | ≈ 2 × 56 px tall, ≈ 30 % of the width | FE-1 | open |
| OV-05 | same | The attribution pill "© OpenStreetMap · Esri ⓘ" spans about half the width on phone | ≈ 50 % of the width | FE-1 | open |
| OV-06 | same | The chip row floats over the top of the map with no scroll affordance; "Top picks" is cut at the edge | the row covers the map's top band | FE-1, designer | open |
| OV-07 | same | None of the overlays respond to the reader's pan or zoom: nothing compacts, so the map stays a strip | behaviour | FE-1, FE-A | open |

QC's S-17 sweep adds rows for every other page, view, viewport and theme. Lanes claim them with their fix SHA.
