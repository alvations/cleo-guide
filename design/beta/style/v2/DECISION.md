# W7 design system v2 — decision: **Bone & Oxblood**, one family (Inter + Inter Display)

The owner rejected R6 as still far from the competitors. The target was modern, minimal and image-first, with a colour
scheme that is ours: classy, luxurious and never tacky. This replaces the R6 art direction ([`../DECISION.md`](../DECISION.md),
"Salon Didone + Inter"). It does not polish it.

Inputs:
- research: [`RESEARCH.md`](RESEARCH.md);
- four palette directions on real pages: [`directions/`](directions/README.md);
- the type audit: [`type/`](type/audit.json);
- the icon set: [`icons/`](icons/sheet.html);
- the scorecard: [`scores.json`](scores.json);
- the review board: [`board.html`](board.html).

## 1. Scores (1–10 per criterion, on the same v2 type and component layer)

| Criterion | A Juniper | **B Bone & Oxblood** | C Mist & Petrol | D Sable & Ember |
|---|---:|---:|---:|---:|
| Modern-minimal | 9 | **9** | 9 | 8 |
| Marketplace-grade clarity | 9 | **9** | 9 | 9 |
| Palette uniqueness | 6 | **9** | 7 | 5 |
| Classy, not tacky | 8 | **9** | 8 | 7 |
| Luxury feel | 7 | **9** | 7 | 7 |
| Readability | 9 | **9** | 9 | 9 |
| AA, light + dark (measured: 46 pairs, 0 fails each) | 10 | **10** | 10 | 10 |
| Consistency across views | 9 | **9** | 9 | 9 |
| Photo-friendliness | 7 | **9** | 8 | 7 |
| **Total of 90** | 74 | **82** | 76 | 71 |

## 2. Why Bone & Oxblood

- **It is ours.** Oxblood is a tailoring and leather colour: deep, brown-red and low in chroma. It is not a signal red.
  - It sits ΔE76 49 from the marketplace's coral and 38 from the athleisure label's red.
  - It sits 37 from the R6 vermilion it replaces.
  - Nobody in the travel set uses it as chrome.
- **It reads expensive because it is rare.** The accent appears in four places only:
  - the saved heart;
  - the saved count;
  - the day-route line;
  - the wordmark star.

  Everything else is soft-black ink on warm bone, which gives the "premium label" restraint the owner pointed at.
- **It is the most photo-friendly.**
  - The bone ground warms food and city photos without tinting them.
  - Greens (A) clash with gardens, and blue-greens (C) sit next to map water.
  - Orange (D) competes with warm food shots.
  - A dark red that appears this rarely does none of those things.
- **Dark mode is a true edition.** It uses a warm near-black (`#131110`), not navy, with a rosewood accent (`#E0A19A`) that passes AA as text.

**Why not the others:**
- Juniper is calm but generic.
- Petrol is crisp but cold on photos.
- Ember is warm but the most common travel accent, and it sits only ΔE 21 from the retired vermilion, so it would read as R6 again.

## 3. Type re-decision

- **One family: Inter.**
  - Its **Display** optical size (opsz 32, weights 500–700) sets headings ≥ 22 px, with tracking −0.024 em (hero −0.035 em).
  - The text cut sets UI and body at 400, 500 and 600, with tabular figures on every count.
- **Retired:**
  - Playfair (roman and italic);
  - the italic deks, notes and leads;
  - the Didone initials on plates.
- No serif earns a place. Even the wordmark is set in Inter Display 600.
- **Why Inter over the other OFL faces with Vietnamese** (Plus Jakarta Sans, Hanken Grotesk, Manrope, Be Vietnam Pro; see RESEARCH §4):
  - It has zero missing characters across all 215 non-CJK characters the beta sets.
  - It ships tabular figures.
  - Its Display cut gives the refined headline read without a second family.
- Fonts are self-hosted under `beta/assets/fonts/`, under OFL. CJK falls through to the system sans stack, which is no longer a Mincho, so CJK matches the sans voice.

## 4. Iconography and covers

- **One line-icon set**: 73 inline SVG icons on a 24 px grid, 1.5 px stroke, round caps, generic subjects only.
  - The source of truth is [`icons/icons.json`](icons/icons.json), with a sprite and a sheet alongside.
  - The CSS stroke is 1.5 everywhere (`--icon-stroke`).
- **The calm no-photo cover** (V2.7 in `design/beta/css/v2.css`):
  - a `--sand` ground with the same rounded media box as a photo;
  - one 30 px kind glyph in `--ink-3`, centred;
  - the native-script name set small, bottom-left, in the UI face.
- The cover never draws the pin-art locator, plates, motifs, area edge bars or vertical scripts. It sits beside a credited photo without pretending to be one.

## 5. Built

The build and measurements are recorded in §6, which is filled in when the implementation lands.
