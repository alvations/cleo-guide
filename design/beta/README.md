# design/beta — Cleo beta design system ("Constellation")

UI/UX lane deliverables (Wave 0, 2026-10-10). Beta only; the live site is untouched.

| File | What |
|---|---|
| [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) | Direction, principles, tokens, every component with states and sizes |
| [tokens.css](tokens.css) | Canonical tokens (copied to `beta/assets/tokens.css` by the mockup generator) |
| [`beta/assets/constellation.css`](../../beta/assets/constellation.css) | Component stylesheet engineers build against |
| [CONTRAST.md](CONTRAST.md) | WCAG AA proof: 284 pairs, light + dark + 8 skins, 0 failures |
| [IMAGERY.md](IMAGERY.md) | Honest imagery strategy (plates, map art, glyphs now; Commons later behind a gate) |
| [VOICE.md](VOICE.md) | Copy rules, urgency lint list, microcopy for every state |
| [specs/README.md](specs/README.md) | Page specs + benchmark comparison + scorecard |
| [DECISIONS.md](DECISIONS.md) | Design calls with rejected alternatives |
| [mockups/](mockups/) | 10 generated high-fidelity pages on real records |
| [screenshots/](screenshots/) | 390×844 @2x and 1440×900, JPEG q70, + `metrics.json` |
| [tools/](tools/) | `make-mockups.py`, `mockdata.py`, `svgkit.py`, `extract-cleveland.js`, `shots.js`, `contrast.py` |

```bash
python3 design/beta/tools/make-mockups.py && NODE_PATH=$(npm root -g) node design/beta/tools/shots.js && python3 design/beta/tools/contrast.py
```
