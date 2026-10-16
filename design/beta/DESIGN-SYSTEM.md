# Cleo beta design system — v2 "Bone & Oxblood" (W7, current)

> Lane: designer. Wave 7, 2026-10-11. Beta only. Decision and evidence: [`style/v2/DECISION.md`](style/v2/DECISION.md) ·
> board: [`style/v2/board.html`](style/v2/board.html) · tokens: [`tokens.css`](tokens.css) · base components:
> [`css/v2.css`](css/v2.css) (bundled last into `beta/assets/cleo.css`) · icons: [`style/v2/icons/`](style/v2/icons/sheet.html).
> This file documents only what ships. The retired R6 "Constellation" system (night hero, star-field art, gold plates,
> purple signature tiles, per-city skins, Playfair italics) was removed in W8. It is in git history before `34f3988a`.

## v2.1 Principles

1. **Calm, minimal, image-first.** Content and photos carry the colour. The chrome is ground, ink and hairlines.
2. **One accent, spent rarely.** Oxblood is used on four things only: the saved heart, the saved count, the day route and the wordmark star. It is the same for every city.
3. **One sun highlight.** A flat warm wash sits behind data-backed sticker badges and the heart pop. It is never a gradient, never text colour and never chrome.
4. **Ink does the work.** The primary button, the active segment, the pressed chip, the selected pin and the focus ring are all ink.
5. **Two faces, two jobs.** Bricolage Grotesque sets headlines, city names and big numbers. Inter sets everything people read or tap. There are no italics.
6. **Quiet depth.** Resting cards have no shadow. Soft shadows appear only on the search pill, floating controls and sheets.
7. **Honest covers.** Without a credited photo, a place gets the calm cover: a sand ground, one kind glyph and the name in type. The cover never pretends to be a photo.
8. **Trust for every generation.** Body text is 16 px or more, every pair passes AA in light and dark, buttons say what they do, and "Recommended by" is always visible.

## v2.2 Colour

| Token | Light | Dark | Use |
|---|---|---|---|
| `--paper` | `#F9F7F3` | `#131110` | Page ground (warm bone / warm near-black). `--night` aliases here. |
| `--surface` | `#FFFFFF` | `#1C1918` | Sheets, menus, the search pill |
| `--sand` | `#F1EDE7` | `#262220` | Quiet fill: the no-photo cover, the switcher track |
| `--ink` · `--ink-2` · `--ink-3` | `#1C1917` · `#4A4440` · `#68615B` | `#F2EEEA` · `#D0C9C3` · `#A69E97` | Text tiers; ink is also the primary fill and the focus ring. `--gilt` aliases to ink. |
| `--line` · `--line-strong` | `#E7E2DB` · `#CCC5BC` | `#302B28` · `#4B4440` | Hairlines and control borders |
| `--accent` · `--accent-ink` · `--accent-wash` · `--on-accent` | `#7A2A2A` · `#7A2A2A` · `#F5EAE7` · `#FFF` | `#E0A19A` · `#E8B0A9` · `#33201E` · `#1E0E0C` | The one accent. `--city*` aliases here. |
| `--sun` · `--sun-wash` · `--on-sun-wash` | `#E9A93B` · `#FBEBC8` · `#3D2A06` | `#F0BC5E` · `#3B2C10` · `#FBE3B0` | Sticker badge and heart pop only |
| `--open` / `--closed` / `--warn` (+ `-soft`) | green / brick / amber | lifted | Status only |
| `--area-mute`, `--area-mix` | `#948B83`, 50 % | `#766D67` | The data's area colours are mixed toward the palette for pins and dots |

`python3 design/beta/tools/contrast.py` checks **86 pairs: 0 below AA**. The palette generator is
`style/v2/tools/palettes.py`; it writes four directions and exits 1 on any miss.

## v2.3 Type

| Role | Face | Mobile / desktop |
|---|---|---|
| Hero | Bricolage Grotesque 600, −0.035 em | 38 / 60 px |
| Display 1 (city, country) | Bricolage 600, −0.024 em | 34 / 52 |
| Display 2 (sections, sheet titles) | Bricolage 600 | 22 / 28 |
| Card title | **Inter 600** | 16 |
| Lead / body / small = UI / meta / xs | Inter 400–500 | 17·18 / 16 / 14 / 13 / 12 |

- **Five steps between 12 and 17 px:** 12 · 13 · 14 · 16 · 17. Only weights 400 / 500 / 600 / 700 render, and there is no 13.5 px.
  - `style/v2/tools/normalize-v2.py` snaps every raw size and radius in the designer's sources onto tokens, and has a `--check` mode.
  - The probes confirm it: `eval/r6/tools/probe-type.js` and `probe-css.py`. In the designer's CSS the only raw font size left is `.5em` (the native script after a city name), and the only raw radii are `50%` and `3px`.
- **Optical size:** Bricolage ships as one pinned opsz-72 instance (wght axis only, 54.5 KB). That is deliberate: the display face only sets 22 px and up, where opsz 72 is the right cut, and keeping the opsz axis would roughly double the files for no visible gain. Do not set `font-optical-sizing` or `font-variation-settings: 'opsz'` on it. Headlines, deks and subtitles use `text-wrap: balance / pretty`.
- Tabular figures appear wherever we count (`--num`).
- CJK falls back to the system sans.
- Fonts are self-hosted OFL subsets (vi, latin-ext, latin), with `font-display: swap`.

## v2.4 Shape, depth, motion, icons

- **Radius:** 8 px for buttons and controls, 12 px for inputs and small media, 16 px for card media and sheets, and pill for chips, search, the switcher and stickers.
- **Motion:** durations are 120, 200, 280 and 480 ms (every moment ≤ 300 ms, the R7 delight cap; 480 only for non-moment layout); primary paths stay at 200 ms or less. The signature moment is the tapped cover or pin growing into the sheet: `--dur-grow` 300 ms with `--ease-grow`, using view transitions plus a FLIP fallback. The heart pop is the only spring. `prefers-reduced-motion` sets every duration to 0. Spec: [`style/v2/MOTION.md`](style/v2/MOTION.md).
- **Elevation, three steps:** `--shadow-sm` (the switcher thumb and the heart chip), `--shadow` (the search pill, hover, floating controls) and `--shadow-lg` (sheets and dialogs). Resting cards have none (`--e-1: none`).
- **Icons:** one line set of 73 icons on a 24 px grid, with a 1.5 stroke and round caps (`style/v2/icons/icons.json`). Every subject is generic, never a venue.

## v2.5 Components (base layer, `css/v2.css`)

| Component | v2 spec |
|---|---|
| Top bar | Ground + 1 px hairline, no blur. Wordmark in Bricolage 600 with an accent star. The current nav item gets a 2 px ink underline. |
| Buttons | Primary: ink fill with paper text, 8 px radius. Secondary: transparent with a `--line-strong` hairline. Icon buttons: round, sand on hover. Focus: 2 px ink outline, 2 px offset. |
| Chips / pills | Surface with a hairline; pressed = ink fill. Source credits are underlined text, not filled pills. |
| Search pill | White capsule, hairline, `--shadow`, ink search button. |
| Hero / masthead | On the ground: eyebrow in ink-3, name in display, one line, the count. No night, art, particles, motif or accent bar. |
| Card | No frame, border or resting shadow. Rounded media (16 px), heart top-right, then 2–3 lines: name (Inter 600), area · kind (ink-3), Recommended by. Hover dims the media 3 %; pressed scales it to 0.99. |
| No-photo cover | Sand ground, centred 30 px kind glyph in ink-3, native name 13 px bottom-left. |
| Sticker badge `.sticker` | Sun-wash pill with 12 px semibold text, top-left on media (or inline). Data-backed only; never on closed places. |
| Rails / collection tiles | Surface with a hairline, ink text; pressed = ink inset ring. No purple, motif or shimmer. |
| View switcher | Sand track (pill) with a white thumb and `--shadow-sm`; labels in ink-2 / ink. |
| Sheets, tray, dialogs | Surface, `--shadow-lg`, 16 px top radius. |
| Toast | Ink, paper text, 8 px radius. |
| Tab bar | Surface + hairline; current item in ink with a 2 px stroke icon. |
| Map | Pins on surface with a 2 px muted area underline; selected pin = ink. Clusters get a muted ring; the day route uses the accent. |
| Footer | On the ground, hairline above. |

## v2.6 Casing: no superfluous capitals (owner rule, W7)

> Owner: "those capital initials everywhere in the UI I don't think we need them they are superfluous and don't serve any purpose!"

**Rule: every UI label, heading, chip, badge, button and eyebrow is in sentence case.** Capitalise only the first word, plus anything in the list below. Text is never transformed: there is no `text-transform: uppercase | capitalize`, no small caps and no letter-spaced caps. The text starts plainly: there are no drop caps (`::first-letter`) and no decorative cover initials.

**What keeps its capitals:**
1. **Proper nouns and demonyms:** place names (Tokyo, Kanda Myōjin, Ohio River, Little Tokyo) and nationalities or cuisines of a people (Japanese, Polish, Southeast Asian). This also covers named styles, events and things: Art Deco, Prairie School, Civil War, World Heritage, Frank Lloyd Wright, Rainbow Cone.
2. **Acronyms and initialisms:** UNESCO, NPS, JNTO, BBQ, TV, UW. Words with an internal capital also stay as written: MiMo, MetroParks, YouTube.
3. **Source and publisher names, exactly as each publisher writes them:** Time Out, The Japan Times, Atlas Obscura, Michelin. Source names never pass through the casing helper. A generic label is not a publisher name, so "Official Site" becomes "Official site".

**How it is applied to data:** collection and cuisine labels come from page data (`beta/data/places/*.json`), and 259 of 368 are Title Case. **The data is not edited.** A shared display-time helper, `sentenceCase(label)`, applies the rule:
- it keeps the first word;
- it keeps allowlisted phrases and words;
- it keeps all-caps words, single capital letters (U-pick) and words with an internal capital;
- it lowercases every other word, handling hyphenated words per segment (must-see, Italian-American, sub-Saharan).

**A page's own place names (QC-30).** On a city page the helper also gets that page's city name, native name and area names, and keeps their capitals in three ways:
1. **Whole names**, with or without a trailing parenthetical: "A day in District 1", "A day in The Loop & Downtown".
2. **Runs of capitalised words** inside a name: "Ohio City", "Wicker Park", "Omoide Yokochō", "New York".
3. **Single words** from a name, unless the word is generic geography or position (`allowlist.json` → `generic`: park, river, lakefront, yokochō, north, old, downtown …). So "Havana" and "SoDo" keep their capitals, while generic words used on their own go lower case: "Theme-park rides", "Lakefront, river & water", "Izakaya, yakitori & yokochō".

`own_words()` in `sentence_case.py` and `ownWords()` in `tools/beta/lib/casing.js` implement it identically (2,745 page labels cross-checked, 0 mismatches).

The executable spec and allowlist are in [`casing/`](casing/):
- `allowlist.json`: the phrases and words to keep, and the `generic` geography words that a page's own place names don't protect;
- `sentence_case.py`: the reference implementation, whose `--check` mode lists every change;
- `labels.md`: every label before and after, for review.

When a label lowercases a proper noun, add the noun to `allowlist.json`, never to code.

| Before | After |
|---|---|
| Iconic & Must-See | Iconic & must-see |
| Free to Visit | Free to visit |
| Temples & Shrines | Temples & shrines |
| ★ Anime, Manga & Pop Culture | ★ Anime, manga & pop culture |
| Aviation & the Wright Brothers | Aviation & the Wright brothers |
| Art Deco, MiMo & Architecture | Art Deco, MiMo & architecture |
| Polish, Ukrainian & Eastern European | Polish, Ukrainian & Eastern European |
| START WITH (CSS uppercase) | Start with |

## v2.7 Photos and credits

- **Source and gate:** only credited Wikimedia Commons (or Unsplash) photos, as local files. Every one needs a complete TASL row in `beta/assets/img/CREDITS.json` and a free licence (CC0, PD, CC BY, CC BY-SA; NC and ND are refused). The build and `test-imagery.js` refuse anything else.
- **Never photographed:** food places, venues, closed places, or anything in Vietnam (no freedom of panorama).
- **Same box as the cover:** a photo sits in exactly the box of the calm cover (rounded `--r-l`, no frame), so a page mixes them gracefully. It has no glyph and no name plate on top.
- **Credit under the media:**
  - The credit always sits under the media, never over it, and is never clipped.
  - Short form (imagery `captionHtml`): "Photo: ⟨author⟩ · ⟨licence⟩ · Wikimedia Commons (resized)".
  - The licence and the source are links. The work's title sits in the source link's accessible name and title, which satisfies CC 2.0/3.0 "title if supplied".
  - The credit is one sentence in ink-3 at `--fs-xs`, line-height 1.6. Its links get a 44 px hit area from inline padding, so the line box doesn't grow.
- **Inside a link:** a card that is itself one link puts the credit *after* the link (`li > a.card + p.credit`), because a credit's own links may not nest inside an `<a>`.
- **Loading and weight:**
  - Lazy and `decoding="async"` everywhere except a hub's hero, which is eager with `fetchpriority="high"`.
  - `srcset` comes from the imagery widths (500 / 960 for cards, 640 / 1280 for heroes). `sizes` matches the real column width, so a 3× phone takes the 500 w copy for a ~170 px card.
  - Budget (D-38): a page's default first load stays ≤ 2.0 MB on desktop and on a 390 px phone at 3×.
- **No repeats:** a hub card never repeats its hub's hero photo (render guard plus `test-hubs.js`).

## v2.8 Page patterns

| Page | Pattern |
|---|---|
| **Landing** | **Search first.** Sentence-case kicker in ink-2. One headline in the display face, "Where to next?", where the single expressive moment is a flat `--sun-wash` swipe under one word. Then the facts line, the search pill and the country pills. Then one row of city cards per live country (2 columns on phones, 3 at 768, 4 at 1024), the ★ signature row and collections as image cards (a scroll row on phones, a grid from 1024), a quiet "How we choose" strip (computed counts: named sources, places pinned, closed places kept) and the country cards. |
| **City card (hub / landing)** | `li.dest > a.tile.card` is one link: media, then name (display face), counts, "Known for" (the guide's own signature line) and "Recommended by ⟨top sources⟩ + n more". The credit goes after the link. A ★ collection shows as the design system's `.sticker` on the media. Cover tones `c-0…c-3` rotate so neighbours never match. |
| **Country hub** | **Photo first on phones.** Hero media in a reserved 3:2 box under the header, then the name, "Known for" (the first signature item of the three largest guides, deduped by dish synonyms from the canon table), the stats line and **one** primary CTA. Share and "How we choose" sit on a quiet secondary row; the dek comes last. Desktop is two columns, top-aligned, with the photo above the fold. No hero photo means the calm cover, with the place count as the big number. Then the city card grid (1 / 2 / 3 / 4 columns), the collections and "Elsewhere in Cleo". |
| **Static pages** (method, accessibility, 404) | Light page head (display h1, a `--fs-lead` dek), prose at `--fs-lead` / 1.6, `max-width: 68ch`, numbers in the display face. |
| **Guidebook** | Chapters per area. A chapter leads with a credited photo where an honest one exists: the first open sight in view order, never food, never Vietnam, 3:2, credit under it. Each entry shows its tier or "Closed · kept for the record", address, write-up, "Look for", Recommended by and Save. **D-39 (proposed):** a record whose own prose quotes a price or rating carries a quiet line under it: "Prices and ratings are quoted from the source at the time of research (⟨date⟩)". The prose is never edited. |
| **Insights** | Every chart reads `--series-1…6` / `--series-other` in fixed order: calm slate, clay, teal, ochre, plum and sage, validated on the surface in light and dark. Oxblood stays out. Every count uses tabular figures (`--num`). Every bar opens those places. |

Copy voice: inviting in headlines and CTAs ("Where to next?", "See all 5 guides"), plain wherever facts live (sources, closures, addresses, dates). Every interface string goes through `tools/beta/i18n/en.json`.

Wrapping: headings and short hero lines use `text-wrap: balance`, deks and subtitles `pretty`, and a date is glued to its label with a no-break space. The result has no single-word last lines at 390 or 1440.

## v2.9 Rules engineers must keep

- Tokens only. No raw colours or family names in component CSS. Font sizes come from `--fs-*`, radii from `--r-*`.
- Never render a tier glyph on a closed record; a closed record sorts last within its area and says "Closed" in words.
- Every number on screen is computed from the data at build time, never typed.
- Pin numbers equal card numbers within an area. The order is tier, then number of named sources, and the UI says so.
- A collection or interest **reorders or filters a view, never deletes**: "Show all N" restores exactly N.
- Map art draws only verified pins. OSM geometry, if ever drawn, carries a visible "© OpenStreetMap contributors".
- `localStorage` always goes in try/catch; the storage-blocked banner is the fallback copy.
- Targets are ≥ 44 px, and text pairs are AA in light and dark. Nothing moves under `prefers-reduced-motion`. Content never depends on a CDN.

## v2.11 The view switcher on phones (QC-09; FE-A builds it)

**Today:** under 640 px the four views collapse into one "View: Gallery ▾" control, so every switch takes two taps, and an open sheet covers it. `nav[data-cleo-views]` holds toggle buttons, so it has no valid group role (axe rejects `role=group` on `<nav>`).

**Spec:**
- **Order and default (D-46, 2026-10-16):** Atlas, Gallery, Guidebook, Insights. Atlas is the default view, so it's the pressed segment on a cold load. The labels stay as they are. "Gallery" keeps its name rather than "List", because phone Atlas already has a "Show list" peek, and two different things called "list" one tap apart would confuse readers. Gallery says what that view is: the photo-led grid.
- **Markup:** `<div class="views" data-cleo-views role="group" aria-label="View">` holding four `<button type="button" data-view="…" aria-pressed="true|false">` (glyph + label).
  - The four are mutually exclusive toggles, not links, so a labelled group of pressed buttons is the right pattern; the `<nav>` element goes.
  - The base CSS (`views.css`, `v2.css`) now targets `.views[data-cleo-views]` whatever the element, so the swap needs no CSS change.
  - FE-A's own `nav.views…` selectors in `fe-a.css` need the same change.
- **Always four segments, never collapsed:** one tap per switch at every width. Drop the `:not(.open)` single-column collapse and the "View:" prefix.
  - **≥ 400 px:** glyph + label.
  - **< 400 px:** label only, 14 px (`--fs-sm`), four equal columns. At 390, a segment is 87 px and "Guidebook" fits in 70 px.
  - **< 300 px (200 % zoom on a 390 phone):** a **2 × 2 grid** of glyph-only segments (each at least 60 × 44 px). The label stays as the button's accessible name, with a visible tooltip on focus and press. It is still one tap per switch. *(Corrected 2026-10-16: a single row cannot work here. The 195 px viewport less the 16 px main gutters leaves 163 px, and four 44 px segments plus the track need 180 px. The build measured 29 × 44 px segments.)*
  - The track is `--sand` with a `--surface` thumb on the pressed segment (v2 §v2.5). The thumb slides (`--dur-2`), and there's no slide under reduced motion.
- **Placement on phones:** a 52 px row directly under the 52 px header. It is sticky with the header, so the switcher is always at `top: 52px`.
  - The search pill doesn't share this row on phones: search is the header's search icon (which opens the search sheet). The row is the switcher alone, full width less the 16 px gutters.
- **Reachable with a sheet open:**
  - Every phone sheet (place detail, filters, list) stops below the switcher: `max-height: calc(100dvh - 104px)`, with its top edge at ≥ 104 px. Its scrim also starts at 104 px, so header and switcher stay visible and hit-testable.
  - Tapping a segment while a sheet is open closes the sheet and switches view in the same tap.
  - Focus moves to the new view's heading.
  - The sheet's own close button and Escape still work.
- **Verification on 2026-10-16, head 055e2e6d (FE-B's build 7e746d9bc):**
  - **390 px: PASS.** `div[role=group][aria-label=View]`, 4 buttons each 78 × 44, one pressed. With `#p=senso-ji` open (sheet top at 116 px), `elementFromPoint` returns each segment.
  - **200 % (195 px): FAIL.** There are 4 segments in one row, each 29 × 44, which is under the 44 px target, and the labels still render. Sheet reachability passes.
  - The fix belongs in `fe-a.css` (the `html main[data-city] .views[data-cleo-views]` rules near lines 194–203): add the < 300 px 2 × 2 glyph-only grid above.
- **Re-verification on 2026-10-16, head after 639d2b1be: PASS at both widths.**
  - **390 px:** 4 segments, each 78 × 44.
  - **195 px (DPR 2):** a 2 × 2 grid of 61 × 44 glyph-only segments.
  - **Both:** `role=group`, one pressed. With `#p=senso-ji` open, elementFromPoint returns every segment; the sheet top is 116 px at 390 and 162 px at 195.
  - FE-B also pins the row under the header while a sheet is open, so reachability holds wherever the page is scrolled. Accepted.
- **Acceptance (qc.js P-01, J-05):**
  - at 390 and at 200 % zoom, four segments are visible and each switch is 1 tap;
  - every segment is ≥ 44 × 44 px;
  - `role="group"` with `aria-label="View"`, exactly one `aria-pressed="true"`;
  - with the place-detail sheet open, `document.elementFromPoint` at each segment's centre returns that segment;
  - axe reports no `aria-allowed-role`.

## v2.10 Reproduce and probe

```bash
python3 design/beta/tools/contrast.py                                   # WCAG gate over the tokens (light + dark)
python3 design/beta/eval/r6/tools/probe-css.py .                        # raw vs token sizes, radii, shadows across beta/assets/*.css
node design/beta/eval/r6/tools/probe-type.js <port> <label> <out.json>  # rendered sizes, weights, radii, figures per page
NODE_PATH=$(npm root -g) node tools/beta/fe-b-shots.js --scheme dark    # landing + hubs + static pages, 390 / 1440
NODE_PATH=$(npm root -g) node tools/beta/w8-feb-shots.js                # Guidebook + Insights, 390 / 1440, light + dark
cd tools && npm run validate && npm test && npm run beta:check          # the gates
```
