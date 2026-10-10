# Design review — Wave 1 (M1), pass 1

> UI/UX lane · 2026-10-10 · session_018MKc8Cm9yRKwLoMQ5mFB7b · branch head after `cd1eaf5` + this pass.
> Method: `NODE_PATH=$(npm root -g) node design/beta/tools/review.js --wave=W1 [--dark]`. It serves the generated `beta/`
> from disk, **aborts every off-origin request** (no CDN, no tiles), takes screenshots at 390×844 @2× touch and 1440×900,
> and measures the M1 design rows of [`BETA-BENCHMARK.md`](../../docs/BETA-BENCHMARK.md). Screenshots:
> [`screenshots/review-w1/`](screenshots/review-w1/) (before: [`review-w1-baseline/`](screenshots/review-w1-baseline/)).
> Compared against the Wave 0 mockups ([`mockups/`](mockups/)) and the teardown leaders (Airbnb Experiences, Apple Maps
> Guides, Aman/Rosewood, Eater 38, Michelin).
> QA harness on beta after this pass: **92 pages, 276 loads, 276 PASS** (`node tools/qa-site.js --only beta/`).

## Verdicts

"Look" = does the page hold up next to the leaders as a picture. "M1" = does it meet every M1 design row on the
benchmark. M1 also needs FE-A's sheet, tray and numbers, which are not in yet.

| Page | Look | M1 | Why |
|---|---|---|---|
| Landing `beta/index.html` | **Same league** | Not yet | The Didone night hero, skinned destination tiles with each city's pin constellation, and 4 city cards above the fold on mobile (B-05 ✓). Open: a data-derived signature line per tile and the country switcher (M1-17, FE-B). |
| Japan hub `beta/Japan/index.html` | **Same league** | Not yet | Tiles show the native name in each city's accent and motif. This is the closest page to the mockup. Same open items as the landing. |
| Singapore hub | **Same league** | Not yet | The orchid pastel skin is on every SG tile (D-05). Same open items. |
| Tokyo | **Same league** | **Not yet** | The masthead constellation, cover cards with the Bodoni name and the glyph ladder are all in. B-19 was failing at 19.1 % upper case because of the source labels; after platform `227b955` it is **0.2 %** ✓. **B-03 now fails at 15** (target ≤ 14) since FE-B's breadcrumb was added. Also open: ★ tile not distinguished (B-04), native script still in parentheses, no pin numbers (B-09). |
| Cleveland | **Same league** | Not yet | The lake skin and swell motif are in, with 2 cards per screen after the 3-line write-up preview. The 325-not-525 correction stays visible because know-before is never clamped. Open: area colours from data, numbers, sheet, tray. |
| New York | **Same league** | Not yet | The saffron street-grid motif and the 508-pin constellation are in. The schematic map now fills the pane. Open: same as Cleveland. |
| Singapore Chinatown | **Same league** | Not yet | Orchid pastel regional skin, lavender ground. Open: same as Cleveland. |
| Wheeling (smallest) | **Same league** | Not yet | Moss skin. The page reads as a complete guide even at 35 places. Open: same as Cleveland. |

**Bottom line for the PM.** The visual side of M1-08, M1-11, M1-13, M1-14 and M1-15 is in on all 92 generated
pages. Across the pilot set, every design-owned metric now passes (B-19 was fixed by platform `227b955`). The only
measured miss is **B-03 = 15 on Tokyo and New York** (FE-A A9). "Same league" on look; M1 acceptance still waits on the FE-A defects below.

## Measured (light, no network) — pass 1b, after platform `227b955` and FE-B `e8830d8`

| Page · m | B-01 | B-03 | cards/scr | B-11 | B-12 | B-19 | B-21 min px | B-20 small | B-18 |
|---|---|---|---|---|---|---|---|---|---|
| Tokyo | 0.79 | **15** | 3 | 487/487 | 0 | 0.002 | 13 | 0 | 2 |
| Cleveland | 0.69 | 14 | 2 | 181/181 | 0 | 0 | 13 | 0 | 2 |
| New York | 0.70 | **15** | 3 | 508/508 | 0 | 0.001 | 13 | 0 | 2 |
| Chinatown | 0.72 | 12 | 3 | 16/16 | 0 | 0 | 13 | 0 | 2 |
| Wheeling | 0.77 | 14 | 2 | 34/34 | 0 | 0.043 | 13 | 0 | 2 |
| Landing · Japan hub · SG hub | — | — | — | — | — | 0 | 12 | 0 | 2 + CJK |

- In pass 1b, FE-B's new tab bar (11.5 px) and footer links (26–38 px wide) broke B-20 and B-21. Both were fixed in CSS: library tab bar and badges at 12 px; footer and crumb links at 44 × 44.
- The third family on the hubs is the CJK native face on `.dest-nat`, which B-18 allows.

### Pass 1 (before those merges)

| Page · viewport | B-01 first card (screens) | B-03 ctrls above | cards / screen | B-11 glyph on open cards | B-12 closed w/ glyph | B-14 cover | B-18 families | B-19 upper | B-21 min px | B-20 small | B-22 overflow | B-24 accent |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Tokyo · m | 0.79 | 14 | 3 | 487/487 | 0 | 100 % | 2 | **0.191** | 13 | 0 | 0 | #C23A1C |
| Tokyo · d | 0.70 | 29 | 6 | 487/487 | 0 | 100 % | 2 | **0.191** | 13 | 1 | 0 | #C23A1C |
| Cleveland · m | 0.69 | 13 | 2 | 181/181 | 0 | 100 % | 2 | 0.007 | 13 | 0 | 0 | #1F5E8A |
| New York · m | 0.70 | 14 | 3 | 508/508 | 0 | 100 % | 2 | 0.009 | 13 | 0 | 0 | #9A5B00 |
| Chinatown · m | 0.72 | 11 | 3 | 16/16 | 0 | 100 % | 2 | 0.013 | 13 | 0 | 0 | #8A3F86 |
| Wheeling · m | 0.77 | 13 | 2 | 34/34 | 0 | 100 % | 2 | 0.062 | 13 | 0 | 0 | #4E6B22 |
| Landing · m | — (4 tiles above fold) | — | — | — | — | — | 2 | 0.004 | 13 | 0 | 0 | — |

- "Cards / screen" counts card tops inside one screen, starting from the first card.
- The one small target on desktop is the Leaflet attribution link. The CSS now gives it 6 px of padding; re-measure next pass.
- Night edition (`--dark`): the same numbers on Tokyo, Chinatown and the landing, with accents switching to the lifted night values.
- Contrast: `design/beta/tools/contrast.py` reports **344/344 pairs AA** (light, night, 10 skins).
- B-24: Tokyo vermilion/seigaiha, Cleveland lake/swell and Chinatown orchid/petals differ in both accent and motif. ✓

## Defects by lane

### FE-A (city page) — open

| # | Defect | Row | Fix (hook in [`specs/M1-visual.md`](specs/M1-visual.md)) |
|---|---|---|---|
| A1 | Area dots on `.areanav` are grey, and card covers use the CSS rotation instead of the data `AC` colours, so a card's colour does not match its pin (`newyork-d.jpg`: Manhattan is a gold dot, red pins). | B-14, B-15 | `style="--area:#hex"` on `section.area` and its `.areanav a` |
| A2 | Native script is embedded in the name ("Imperial Palace East Gardens (皇居東御苑)"), so there is no vertical plate. | M1-11, LP-05 | `<span class="native" lang="ja">` inside `.pl-n` (+ optional `.pl-cover .pl-vert`) |
| A3 | The ★ signature collection is a plain tile with a "★" text character. It is not first-and-larger. | B-04 | `class="rail-i sig"` |
| A4 | No pin numbers on cards or pins. | B-09 | `.pl-num` + `tg-pin <b>N</b>` |
| A5 | No mobile Map toggle. The map pane is hidden below 1024 px (list first) until the toggle lands. | B-07 | `.split[data-view="map"]` |
| A6 | The tier glyph is a CSS fallback: not yet a link to How we choose, and it does not say "within {area}". | B-11, B-26 | `<a class="tier t1" href="…how-we-choose.html"><i class="tg t1"></i><span>Must see</span></a>` |
| A7 | No detail sheet and no filter tray yet. Toolbar = modes + filter + "Showing all N". | B-17, B-10 | M1-12, M1-07 |
| A8 | Copy: "1 areas" (Chinatown). The eyebrow repeats the area name that the section heading already shows. Inside an area section, drop the area from the eyebrow (keep the dish/collection). | M1-11 | render/city.js |
| A9 | **B-03 fails at 15 on Tokyo and NYC on mobile** since the breadcrumb landed. The four visible area pills are the cheapest controls to give back: M1-07 already makes "Area" one toolbar control (pills → tray / Area select), which takes the count to about 12. On desktop, 32 controls sit above the first card versus 16 in the mockup. | B-03, M1-07 | render/city.js toolbar |

### FE-B (hubs, nav, search) — open

| # | Defect | Row | Fix |
|---|---|---|---|
| B5 | Pass 1c: the night toggle added one more control above the first card (Tokyo B-03 = 16). On mobile the crumb truncates the current city ("Tok…"). On desktop "Destinations" appears twice (in the crumb and in the nav). Suggestion: on phones, put the theme toggle in the footer or tab bar and drop the current-page crumb. | B-03, M1-18 | render/shell.js |
| B1 | `data-city` is only on `<main>`. The site bar gets the skin through an `html:has()` fallback, which works in current Chromium and Safari but not in older browsers. | B-24 | `data-city` on `<html>` |
| B2 | Destination tiles have no data-derived signature line (★ collection or dish canon), and there is no country switcher on the landing. | M1-17 | landing / hub renderer |
| B3 | No night-edition toggle (tokens follow the OS only). | M1-15 | `<button class="theme-toggle">` → `html[data-theme]` |
| B4 | The landing search is the site-bar field only. The mockup's hero search pill (`.search`) is missing. | P1 (feel) | render/landing.js |

### Platform — closed in this wave

| # | Defect | Row | Status |
|---|---|---|---|
| P1 | `sourceLabel()` emitted upper-case labels (WIKIPEDIA, GO TOKYO…), giving Tokyo 19.1 % upper case. | B-19, M1-10 | **Fixed** in `227b955`; now 0.2 % |
| P2 | The SW shell list did not include the self-hosted fonts. | B-40 | **Fixed** in `227b955` |

### Design — fixed in this pass (CSS only)

| # | Was | Now |
|---|---|---|
| D1 | The generated pages were styled by the 5 KB platform placeholder: 5 font families, 9.5 px text, a text-only card, 1306 small targets on Tokyo (`review-w1-baseline/tokyo-m.jpg`). | The full Constellation layer: 2 families, min 13 px, cover cards, 0 small targets on mobile. |
| D2 | The tier glyph sat on its own line when the eyebrow wrapped (Chinatown). | Inline glyph inside the eyebrow text. |
| D3 | The map schematic was a small boxed image inside the pane. | It fills `#cleo-map`, with the caption as a pill. |
| D4 | The mobile "Saved" link overlapped the search field. | A 44 px heart icon, with the text kept for screen readers. |
| D5 | Desktop sticky toolbar was offset by a negative margin. | Aligned to the content column. |
| D6 | Leaflet zoom buttons rendered a third font. | House UI font. |
| D7 | Short source names ("JNTO") were 40 px wide. | ≥ 44 × 44. |
| D8 | Know-before boxes used the city accent on every card (breaks D-06). | Neutral sand, with an area-colour rule. |
| D9 | Hub tiles: the grid auto-placed children into columns. | Fixed. Each tile now also shows the city's verified-pin constellation and native name. |
| D10 | Masthead was a flat colour. | The city's own pin constellation as the night sky, plus a skin motif and the accent bar. |
| D11a | FE-B's tab bar was 11.5 px; footer and crumb links were narrower than 44 px. | 12 px, and every link 44 × 44. |
| D11 | Cleveland: 1 card per mobile screen, because the write-ups are long. | The write-up previews 3 lines on phones and opens when the card is targeted or focused. Know-before is never clamped. Now 2 cards per screen. |

### Design — open

- **D12 — fixed (pass 1c):** collection glyphs are shipped as CSS masks generated from `svgkit.py` plus 5 new
  original glyphs (wave, train, flag, plane, frame). `design/beta/glyphs.json` maps 57 collection ids to 31 glyphs.
  Every `.rail-i[data-c]` tile shows its glyph with no markup change. Japan pages get the torii for TEMPLE; other
  cities get the lantern. Cuisine tiles get fork-and-knife. `.g[data-g]` works anywhere.
- **D13** Vietnamese letters U+1EA0–1EF1 (ạ, ả, ấ…) are outside the Bodoni/Figtree latin-ext subsets and fall back to
  the system serif and sans. A Vietnamese subset is not offered for Bodoni Moda. Stated, not hidden (UX-23).

## Next review

Next pass after FE-A lands A1–A6 (or in about 45 minutes): the same harness, plus the sheet, tray and map toggle states.
