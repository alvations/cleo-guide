# W7 FE-B evidence: landing, hubs, static pages

- **Shots:** `before/` (R6) and `after/` (W7). Each covers 390×844 (`-m`) and 1440×900 (`-d`), light and dark, captured with
  `NODE_PATH=$(npm root -g) node tools/beta/fe-b-shots.js --out design/beta/eval/w7/fe-b/after --tag after-<scheme> --scheme <scheme> --only …`.
  Every request is served from disk and anything off-origin is aborted, so each shot also shows the page needs no CDN.
- **Metrics:** `after/after-*-metrics.json`. Every captured page has 0 horizontal overflow, 0 targets under 44 px, 0 unnamed controls and 0 JS errors.

## Budgets (measured 2026-10-11: mobile 390×844, CPU throttled 4×, median of 3)

| Page | FCP 4× | Transfer (gzip, everything loaded) |
|---|---:|---:|
| Landing | 480 ms | 277 KB |
| Japan hub | 392 ms | 261 KB |
| Belgium hub | 400 ms | 228 KB |
| Singapore hub | 312 ms | 226 KB |
| How we choose | 352 ms | 218 KB |

- **Landing HTML:** 83 KB raw / 15.9 KB gzip before, 70 KB / 11.1 KB after (gate: ≤ 120 / ≤ 24).
- **Stylesheet:** `assets/fe-b.css` is 5 KB gzip, one cached file shared by the landing, the hubs and the static pages. It replaces the inline CSS each page used to carry.
- **Loading:** photos (when the imagery lane supplies them) and motifs below the fold load lazily. Only the first two landing cards and the hub hero are eager.

## What changed

See the 2026-10-11 FE-B entry in `docs/BETA-LOG.md`.

## With the real Commons photos (72 credited, 2026-10-11 15:30Z)

Default view after load; all off-origin requests aborted. The total counts gzip for text and raw bytes for images and fonts.

| Page | 390 px @3× | 1440 px | FCP 4× (phone) |
|---|---:|---:|---:|
| Landing | 768 KB (11 photos, all 500w) | 1,194 KB (20 photos, 500w) | 268 ms |
| Japan hub | 1,344 KB (hero + cards, 960w) | 815 KB | 420 ms |
| Belgium hub | 1,401 KB | — | 348 ms |

- **Landing on a 3× phone:** the imagery lane's mock measured it at 2,285 KB, because the dense-grid `sizes` (46vw) pushed a 3× phone onto the 960w copy. At 42vw the ~170 px card takes the 500w copy.
- **Lazy loading:** no card is eager; only a hub hero photo is. Scrolling the whole landing still loads all 38 card photos (≈ 2.3 MB), but over time and on demand.
- **Credits:** every photo's TASL credit is visible.
  - Under each card it is a sentence with inline links (`<p class="credit">`, line-height 2, so the links sit ≥ 24 px apart).
  - Under the hub hero it sits below the photo, not over it, with 44 px link targets.
- **Measurements:** 0 targets under 44 px on every captured page, light and dark.
