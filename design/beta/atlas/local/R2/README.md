# Atlas round 2 (PANEL-R1 front-end findings, SPEC-v3 rev 3 §1.1–1.3 and §2.2): local evidence

These shots use **stub street tiles**: the sandbox can't reach tile hosts. Real-tile shots come from the `beta-atlas-real-shots` workflow into `../../real/R2/`.

- **Probe:** `NODE_PATH=$(npm root -g) node tools/beta/atlas-ms.js --out design/beta/atlas/local/R2` → `probe.json`. 128/128 PASS on Tokyo, Cleveland and Chinatown (390 and 1440, light and dark, stub tiles and tiles blocked).
- **What changed since R1** (each finding has a probe check):
  - **R1 #2:** the phone OSM credit is one line ≤ 20 px at the bottom left ("© OpenStreetMap · Esri ⓘ"); the ⓘ opens the full credit. Locate, map style and Key sit at the bottom right. A real tap on every control hits it.
  - **R1 #4:** dots show the kind by shape (sight circle, eat & drink rounded square; dark mode 30 % / 50 %). A non-featured Must-see is a sun dot; a closed dot is hollow with a slash. Labels try four anchors and never overlap. Sight pins without a collection glyph take the type noun in the place's name (Cleveland: 8 distinct sight glyphs). Two zoom steps on the Cleveland phone view show 4 named pins (was 1).
  - **R1 #6:** pins are 32 px pills with 14 px labels and a 44 × 44 hit area. The dot hit circle is 44 px (canvas tolerance 19).
  - **R1 #11 (part):** each pin is a link (`<a href="#view=atlas&p=…">`, the marker element itself, `keyboard: true`). Its aria-label is "full name, sight|eat and drink, [Must see], [Closed], [saved]".
  - **R1 #15:** "@neorsd — not a place" stays listed and never draws on the map.
  - **Platform perf audit:** no layout shift on load. Tokyo Atlas CLS: desktop 1.575 → 0.003, phone 0.184 → 0.
- **Not in this round:** these are FE-2's lane (atlas-nav):
  - the detail round-trip (#1);
  - near me (#3);
  - map focus and keyboard pan (#11);
  - the view in the URL (#13).

  The §2.1 chrome is my next slice.
