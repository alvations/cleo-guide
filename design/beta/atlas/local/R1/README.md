# Atlas round 1 (SPEC-v3 slice 1): local evidence

These shots use **stub street tiles**: the sandbox can't reach tile hosts. Real-tile shots come from the `beta-atlas-real-shots` workflow into `../../real/R1/`.

- **Probe:** `NODE_PATH=$(npm root -g) node tools/beta/atlas-ms.js` → `probe.json`. 117/117 PASS on Tokyo, Cleveland and Chinatown (390 and 1440, light and dark, stub tiles and tiles blocked).
- **Slice 1 acceptance checks** (SPEC-v3 §1.6):
  - no number on the map;
  - Tokyo's default desktop view shows 18–24 pins from ≥ 6 areas, ≥ 1 food pin and no disc;
  - on phone, ≤ 12 pins and none under the carousel or the chip row;
  - ≤ 25 marker nodes after zoom and pan;
  - `#p=` opens selected and labelled at zoom ≥ 15.
- **Budget** (Tokyo Atlas, network idle + 2 s): 1440 transfer ≈ 614 KB with 2,422–2,695 nodes; 390@3× ≈ 902 KB with stub tiles (1,535 KB with tiles blocked) and 2,453–2,581 nodes.
