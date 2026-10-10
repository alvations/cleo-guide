# M1 visual layer — hooks for FE-A / FE-B / platform (wave 1)

> Lane: UI/UX · 2026-10-10 · Items **M1-08, M1-11, M1-13, M1-14, M1-15**. Stylesheet: `beta/assets/cleo.css`, assembled by
> `python3 design/beta/tools/build-css.py` from `beta/assets/constellation.css` (component library) +
> `design/beta/css/contract.css` (this layer). Skins: `design/beta/skins.json` → `python3 design/beta/tools/skins.py`
> (writes both copies of `tokens.css`). Never hand-edit `cleo.css` or the skin block in `tokens.css`.

**Everything below already renders on today's markup (RFC §5.5).** Each hook is an *upgrade*: add it and the page
gets the full design; leave it out and the CSS fallback still meets the benchmark row. Nothing here hides a place.

## 1. Tier glyphs — M1-08 (one class, identical on card · sheet · map)

| Where | Markup | Notes |
|---|---|---|
| any | `<i class="tg" data-t="1" aria-hidden="true"></i>` (or `.tg.t1`) | drawn as a CSS mask in `currentColor` — no file, no network |
| card eyebrow / sheet | `<a class="tier t1" href="{up}how-we-choose.html" title="Must see within Chiyoda-ku — how we choose"><i class="tg t1" aria-hidden="true"></i><span>Must see</span></a>` | text label always present; when `.tg`/`.tier` is inside `.pl-e` the CSS fallback glyph switches off |
| map | Leaflet `divIcon({ className: 'cg-icon', html: '<span class="tg-pin" data-t="1" style="--area:#E8B04B"><i class="tg" data-t="1"></i><b>3</b></span>', iconSize: [28, 28] })` | `<b>` = the pin number (== card number in the area). Add `.is-sel` for the selected pin; `data-closed` → small grey dot, **no glyph** |
| legend | `<ul class="tg-legend"><li><i class="tg t1"></i>Must see</li>…</ul>` | for the map and How we choose |

Files for anything that needs a URL (OG art, docs): `beta/assets/glyphs/tier-{1,2,3}.svg` and a `<symbol>` sprite
`beta/assets/glyphs/glyphs.svg#tier-1…3` (`currentColor`). **Fallback today:** `.pl[data-t] .pl-e::before` draws the
same glyph; `.pl[data-closed]` never gets one (metrics: `closedWithGlyph` = 0).

## 2. Card cover — M1-11 / M1-13 (typographic, area colour, no photo)

Today: the cover is a pure-CSS field (area tint 15 % + 5 px area edge + dot motif) under the eyebrow + **name set large
in Bodoni Moda**. FE-A upgrades:

1. **Area colour from data** — put `style="--area:<AC hex>"` on each `section.area` (and on its `.areanav a`). The
   CSS falls back to an 8-colour rotation, which will not match the map's markers.
2. **Native script** — split the parenthetical out of the name: `<h3 class="pl-n"><a>Imperial Palace East Gardens</a><span class="native" lang="ja">皇居東御苑</span></h3>`.
3. **Cover element** (optional, first child of `li.pl`, `aria-hidden="true"`):
   ```html
   <div class="pl-cover" aria-hidden="true">
     <span class="pl-vert">皇居東御苑</span>   <!-- CJK native ≤ 7 glyphs; add .long if > 4 -->
     <!-- or, for Latin names: <span class="pl-ini">I</span> -->
     <svg class="pl-glyph"><use href="#g-garden"/></svg>  <!-- optional collection glyph -->
   </div>
   ```
4. **Pin number** — `<span class="pl-num">3</span>` inside `.pl-e` (or the cover). Never before the name (UX-07).
5. **Save** — keep `.pl-x > .pl-save[aria-pressed]`; it sits on the cover's top-right as a heart pill.

Rules held by the CSS: no machinery above the name; closed = hatched grey cover + `Closed — kept for the record` in
`--closed`, no glyph; `.pl.is-target` / `.pl.is-focus` = accent ring (pin selected); whole card is the tap target via
the name link; source links are ≥ 44 × 44.

## 3. City skins — M1-14

- Pages: `main[data-city="<page key>"]` (already emitted) picks the skin. The CSS also lifts it to the root with
  `html:has(main[data-city])`, so the site bar, page ground and footer follow. **Platform/FE-B: please also set
  `data-city` on `<html>`** — then the `:has()` copy can go.
- Hub tiles: `li.dest[data-page="<page key>"]` (already emitted) picks the same skin → each tile has its city's accent + motif.
- Each skin = `--city`, `--city-ink`, `--city-wash`, `--city-on`, `--motif` (+ `--paper` for the pastel regional skins
  **orchid** = `singapore/*` and **jade** = `vietnam/*`, D-05). Tokyo vermilion/seigaiha · Cleveland lake/swell ·
  New York saffron/grid · Chinatown orchid/petals — all different (B-24). AA: 344/344 pairs (`contrast.py`).
- Signature (★) rail tile: add `class="rail-i sig"` to ★ collections (accent fill + motif, larger). Optional glyph:
  `<svg class="g">` first inside the tile; it bobs on hover/tap (off under reduced motion).
- Accent spend (D-06): active/pressed controls, saved heart, signature tile, selected pin, masthead bar, links on hover.
  Not on eyebrows, borders or know-before notes.

## 4. Type — M1-15

- Two families, **self-hosted** (`beta/assets/fonts/`, OFL, latin + latin-ext, 183 KB total, `font-display: swap`):
  Bodoni Moda (display) + Figtree (UI). CJK uses system Mincho/Gothic. Inputs, buttons and `code` inherit — no third face.
- Sizes: body 16, secondary ≥ 13, nothing below 12 (Leaflet credit lifted to 12).
- Uppercase: none in the contract layer. **Remaining uppercase comes from data**: source labels such as `WIKIPEDIA`,
  `GO TOKYO`, `TIME OUT` (19 % of text nodes on Tokyo). Fix in `sourceLabel()` (platform) — M1-10 asks for
  sentence-case source names.
- Night edition: tokens follow the OS; FE-B's toggle sets `html[data-theme="light|dark"]` (`.theme-toggle` styled).

## 5. Map art — M1-13 / M1-06 styling

- `#cleo-map` with no tiles shows a sand ground with a dot grid + graticule (CSS only) behind `.map-fallback`; Leaflet
  circle markers already draw on it, so with tiles blocked the map still reads as a map.
- Platform's `lib/art.js` SVG: wrap in `<div class="mapart">…</div>` inside `#cleo-map`; classes `.pin .pin.t1 .num
  .num.sel .lbl .route .grat` are styled (constellation.css). Credit line `.map-credit` ≥ 12 px.
- Mobile (< 1024 px): the map pane is hidden in the list view; FE-A's Map toggle sets `data-view="map"` on `.split`
  → full-screen map under the site bar. Call `map.invalidateSize()` after showing it.
