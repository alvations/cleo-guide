# Atlas round 4 (SPEC-v3 rev 5, PANEL-R3): local evidence (FE-1 lane)

These shots use **stub street tiles**: the sandbox can't reach tile hosts. Real-tile shots come from the `beta-atlas-real-shots` workflow into `../../real/R4/`. The designer signs off the dots on those (`tokyo-390-light-1-default.jpg`) before round 4 goes to the panel.

- **Probe:** `NODE_PATH=$(npm root -g) node tools/beta/atlas-ms.js --out design/beta/atlas/local/R4` writes `probe.json` here. It covers Tokyo, Cleveland and Chinatown at 390 and 1440, light and dark, with stub tiles and with tiles blocked, and also runs FE-2's `atlas-nav-ms.js`. All checks pass.
- **What changed since R3** (each item has a probe check or a measurement in docs/BETA-LOG.md):
  - **R3 #1, phone first screen:**
    - the view switch is its own 52 px row under the header (QC-09);
    - the chip row reads search (sticky, always visible), All / Sights / Eat & drink, Top picks, Area, Filters, with no counts;
    - two labelled pills, "Near me" and "Map";
    - the Key is in Filters;
    - the 64 px peek reads "N places here · checked <date> · Show list".
  - **R3 #2, counts and numbers:**
    - one list ranked by map priority, with no area grouping, no area chips and no "area n of N";
    - no rank badges;
    - two count strings: the count line and "Show all N";
    - Top picks is the one best-places control;
    - under a lens the count keeps the total ("177 places here, of all 488").
  - **R3 #3, text:** card sources at 16 px, stickers and cover text at 14 px. Only credits are smaller.
  - **R3 #4, dots and glyphs:**
    - no sun on dots or pills;
    - sight dots are light 7 px circles, food dots dark 8 px squares;
    - glyph overrides as step 0, plus new nouns (Great Lakes Brewing → bottle, Free Stamp → frame, The Arcade → bag, Kabuki-za → ticket);
    - the location dot is a placed box;
    - pill gaps are measured at ≥ 4 px.
  - **R3 #5, desktop header:**
    - the switch is a 40 px control inside the 56 px header;
    - links never wrap;
    - the breadcrumb is whole at ≥ 1280 and "‹ City" below;
    - measured on 4 pages at 1024 and 1280 with no overflow.
  - **R3 #6:** a preview or carousel card with no photo has no media block. The preview leads with a 40 px glyph chip.
  - **Also in this round:**
    - QC-05 empty search ("No places match …", Clear search / Show all N);
    - QC-13 lens totals;
    - QC-17 the carousel grows to its tallest card (nothing clipped);
    - R7-g4 (b) pin → off-page card, (d) check date on the first phone screen, (e) For you / Your day / Near me in the desktop list head;
    - QC-14 spacing on the 4-pt scale.
- **Not in this round** (FE-2's lane, atlas-nav.js): the 108 px layout shift (#7) and the desktop deep link (R7-g4 c).
