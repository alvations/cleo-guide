# Atlas round 1 (SPEC-v3 slice 1): local evidence

These shots use **stub street tiles**: the sandbox can't reach tile hosts. Real-tile shots come from the `beta-atlas-real-shots` workflow into `../../real/R1/`.

- **Probe:** `NODE_PATH=$(npm root -g) node tools/beta/atlas-ms.js` → `probe.json`. 117/117 PASS on Tokyo, Cleveland and Chinatown (390 and 1440, light and dark, stub tiles and tiles blocked).
- **Slice 1 acceptance checks** (SPEC-v3 §1.6, as refined in b62cce9a):
  - no number on the map;
  - Tokyo's default desktop view shows 12–16 pins from ≥ 5 areas, ≥ 1 food pin, no disc and no truncated label;
  - on phone, ≤ 8 pins and none under the carousel or the chip row;
  - ≤ 17 marker nodes after zoom and pan;
  - `#p=` opens selected and labelled at zoom ≥ 15.
- **Budget** (Tokyo Atlas, network idle + 2 s): 1440 transfer ≈ 616 KB with 2,422–2,604 nodes; 390@3× ≈ 904 KB with stub tiles (1,536 KB with tiles blocked) and 2,453–2,574 nodes.
- **Basemap** (§4): the Esri Light / Dark Gray Canvas follows the theme, with reference labels in their own pane. Satellite is the one alternative; street detail lives in the Key. The stub tiles here stand in for it.
