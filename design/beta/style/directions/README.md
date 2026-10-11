# W6 type & style — three directions

Each direction is a **token set** (`a.css`, `b.css` and `c.css`) on top of a shared discipline layer (`discipline.css`:
tabular figures and shadow aliases). `*.bundle.css` is what was injected for the mockups.

The **static mockups** are real beta pages re-rendered with the direction's CSS appended to `cleo.css`, so each one is
the guide's own content and not a lookalike:

- `<d>/shots/landing-*`, `hub-*`
- Tokyo in `gallery-*`, `atlas-*`, `guidebook-*` and `insights-*`
- the place sheets `sheet-*` (Kanda Myōjin) and `sheet-vn-*` (Việt Nam Quốc Tự)
- `specimen-dpr1/2.png`

Each set is at 390×844 and 1440×900, with dark variants for the landing page, Gallery, the sheet and Insights.

| | Display | UI | Shape | Character |
|---|---|---|---|---|
| **A — Didone, refined** | Bodoni Moda (kept), opsz pinned low below 30 px | Figtree (kept); deks in roman UI | radius 8/12/20, 3 shadows | Keeps today's voice and fixes how it is used. Cannot fix Vietnamese |
| **B — Salon Didone + Inter** | Playfair, one optical cut (opsz 28), 400–700, roman + italic | Inter 400–700 | melon-seek discipline: `--radius`/`-sm`, `--shadow-sm`/`--shadow`/`--shadow-lg`, `--num` | A sturdier Didone-descended voice; product-grade UI legibility |
| **C — Soft serif + rounded grotesk** | Fraunces (opsz 36, SOFT 50, no wonk) | Manrope | radius 12/18/28 | The most playful option. The packaged Fraunces subset misplaces macrons (`../audit/fraunces-macron-defect.png`) |

To re-render the mockups, first rebuild the fonts. Direction B's fonts are the shipped `beta/assets/fonts`. C's are not
committed, because C was not chosen.

```
npm install --prefix /tmp/f @fontsource-variable/inter@5.3.0 @fontsource-variable/playfair@5.3.0 \
    @fontsource-variable/fraunces@5.3.0 @fontsource-variable/manrope@5.3.0
python3 design/beta/style/tools/make-fonts.py /tmp/f/node_modules c design/beta/style/directions/c/fonts \
    --css design/beta/style/directions/c/fonts.css --url-prefix /design/beta/style/directions/c/fonts/
(cat discipline.css c/fonts.css c.css) > c.bundle.css     # in this folder
NODE_PATH=$(npm root -g) node design/beta/style/tools/style-shots.js design/beta/style/directions/c/shots \
    --css design/beta/style/directions/c.bundle.css
```

Dates are kept out of the tabular-figure selectors (Inter's tabular hyphen would space "2026-10-03" apart). The scores and the choice are in [`../DECISION.md`](../DECISION.md).
