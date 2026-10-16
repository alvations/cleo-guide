# W7 · FE-A — city pages and views overhaul (evidence)

Owner request (2026-10-11): modern and minimal, image-first at the clarity of the leading home-rental marketplace,
a palette of our own, classy and never tacky; amendment: Gen Z wanderlust that every generation trusts.
Brief: `design/beta/eval/W7-BRIEFS.md` → "Lane: FE-A". Log entry: `docs/BETA-LOG.md` (W7 FE-A).

- `before/` — the R6 build (`2f227631` line), light, 390×844 and 1440×900.
- `after/` — this lane, light and dark, 390×844 and 1440×900:
  Tokyo Gallery (first screen + one scroll + grid page 2), Cleveland and Chinatown Gallery, Cleveland
  "Recently closed" lens, Tokyo Atlas, the Kanda Myōjin place detail, Tokyo Guidebook and Insights.
- Re-shoot: `cd tools && NODE_PATH=$(npm root -g) node beta/w7-shots.js --out design/beta/eval/w7/fe-a/after`
  (same-origin files from disk; **map tiles are stubbed offline** with a flat neutral land colour, #F2EFE9 light / the sand token dark, so Atlas shots show pins on a plain ground, not real streets; every other off-origin request is aborted: no CDN).

All colours, radii, shadows, durations and faces in the W7 layer are design-system tokens, so these shots show the
structure on the R6 tokens; design system v2 restyles it without a markup change. Shot on the head with design system v2 and the imagery lane's credited Commons photos; cards without a photo show the calm cover.
