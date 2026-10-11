# W7 design system v2 — research

Lane: designer. Date: 2026-10-11. Method: WebSearch only (WebFetch is blocked by policy). Every reference is
described neutrally (Rule 6). The observations below come from third-party teardowns of the live products, not from
official style guides; none of the references publishes one. Hex values and sizes are therefore **observed
approximations**. We use them only to calibrate restraint, never to copy a value.

## 1. What the owner asked for

> The colour scheme, the styles and everything else are still far from the competitors. Make a proper UI/UX overhaul.
> Modern and minimal, like the leading home-rental marketplace. A colour scheme that is unique, classy and luxurious,
> and never tacky. Look at what premium athleisure and fashion labels do.

In practice that means:
- calm, minimal and image-first;
- generous whitespace;
- one refined modern sans;
- near-black ink on a warm or neutral ground;
- one accent that is ours, used sparingly;
- quiet UI chrome and photography-led cards;
- no navy night hero, particle clouds, gold plates, purple tiles, gradients or heavy shadows.

## 2. Reference A: the leading home-rental marketplace

| Topic | Observed | What we take |
|---|---|---|
| **Palette** | Text is a near-black (≈ #222), on white and light-grey grounds. One saturated brand coral-red is kept for a few things: the search button, the active tab marker, the primary action and the wishlist heart. | **One accent, spent on a handful of jobs.** Everything else is ink and neutrals. Our accent must not be a coral-red. |
| **Type** | One custom variable sans with rounded terminals, used at 400, 500 and 700. The brand leans on photos and white space, not on bold type. | **One sans family.** Hierarchy comes from size and weight, not from a second face or italics. |
| **Whitespace & grid** | A dense responsive grid of listings with generous gutters. The page ground stays white. | **A 1 → 2 → 3 → 4 column card grid** with wide gutters (FE-A builds it). Sections sit on the ground with no panels. |
| **Cards** | The card is the photo. It has a rounded photo area (observed 12–20 px) with no frame or border. A heart sits top-right and a small badge top-left. Below come 2–4 short lines: title, location, dates, price. The shadow appears on hover at most. | **Media first, then 2–3 lines** (name, area · kind, "Recommended by N"). No frame. The heart is the only control on the media. |
| **Search** | A full-pill bar about 64 px tall, white with a 1 px hairline and a soft shadow. It is split into segments and ends in a round accent button. | **The search pill** is a white capsule with a hairline and a soft shadow. Our button is ink, not the accent, so the accent stays rare. |
| **Category bar** | A horizontally scrolling row of 24 px line icons with labels. The active item gets a 2 px underline and bold text. | **A line-icon category bar.** The active state is an ink underline (FE-A builds it on the v2 icon set). |
| **Map** | A floating pill toggles between list and map on phones. | FE-A's "Show map / Show list" pill uses our capsule style. |
| **Depth & motion** | Shallow: light shadows, and depth comes from the imagery. Motion is short and functional. | **Three shadow steps, all soft.** Resting cards have none. Motion is 120–220 ms. |

## 3. Reference B: premium athleisure and fashion labels

The searches covered three labels in this space.

**Palette.**
- One label's chrome is almost entirely monochrome: pure black, white and warm greys.
- The colourful accents (hot pink, dusty rose, sage, denim) appear **only inside the photographs**.
- Another label's site keeps a single brand red for the logo symbol. It sets campaign colours (forest, espresso, moss, rosewood) only on campaign tiles.
- Grounds are white or bone-off-white (≈ #FAFAFA).

What we take: **the chrome stays neutral and the photos carry the colour.** A warm bone ground reads as more expensive than pure white. Campaign colours are content, not chrome.

**Type.**
- A single modern grotesque runs across every level, in two weights (≈ book 380 and medium 570 on a variable axis).
- A second label uses an uppercase display style in a geometric sans, with smaller body text.

What we take: **one grotesque at two or three weights.** We keep sentence case: uppercase is limited to tiny eyebrows, at most one per block.

**Layout and photos.**
- Every band is a full-bleed photograph.
- The page reads like a printed catalogue, and the chrome holds back.
- Buttons are rectangular, with square or slightly rounded corners.

What we take: **image-led sections.** Real photos will come from the imagery lane. Until they arrive, we use a calm neutral cover that never pretends to be a photo. Buttons get a small 8 px radius, and pills are kept for chips and search.

**Luxury cues.**
- Restraint: very few colours, a generous measure, thin icons and hairline rules instead of boxes.
- No gradients and no ornament competing with the product.

What we take: hairlines, 1.5 px line icons and **no decorative layer at all**.

## 4. Type candidates (self-hostable, OFL, Vietnamese)

The faces were measured with `tools/type-audit.py` against **every non-CJK character the beta sets** (215 characters,
including 47 Vietnamese and the macrons ā ē ī Ō ō ū). Results are in [`type/audit.json`](type/audit.json) and the
specimen is in [`type/specimen.png`](type/specimen.png).

| Face | Missing characters | Vietnamese | Macrons | Tabular figures in the package | Weight of latin + latin-ext + vi (one master) | Read |
|---|---|---|---|---|---|---|
| **Inter** (+ its opsz-32 Display cut) | **0** | ✅ | ✅ | ✅ | 140 KB (variable); 72 KB for the three Display subsets at 500–700 | Neutral and precise. It has the largest x-height. The Display cut tightens the apertures and spacing at headline sizes, which gives it the "refined" read. |
| Plus Jakarta Sans | 3 (ǎ ǔ ʼ) | ✅ | ✅ | ✅ | 56 KB | Warm and geometric, the closest to the marketplace's rounded sans. Words crowd at display tracking. |
| Hanken Grotesk | 3 (ʼ ′ ″) | ✅ | ✅ | ✗ in the package | 62 KB | Elegant and slightly narrow. The packaged subset lacks `tnum`, so counts and charts would not align. |
| Manrope | 5 | ✅ | ✅ | ✅ | 47 KB | Friendly, but its wide, round forms read less luxurious. |
| Be Vietnam Pro | 5 | ✅ | ✅ | ✗ (static files) | 47 KB per weight | Native Vietnamese design, but it is static (one file per weight) and has no tabular figures. |

**Decision (type), revised for the owner's amendment** ("inviting Gen Z-style fonts"):
- **Inter stays the text and UI face** because of the coverage and figures above.
- The first-round "Inter Display" headline cut was replaced by an **expressive display face**. Five Vietnamese-capable OFL candidates were compared in [`type/audit-display.json`](type/audit-display.json) and [`type/display-specimen.png`](type/display-specimen.png), and shot on the real pages in [`type/pairings/`](type/pairings): Fraunces, Bricolage Grotesque, Unbounded, Space Grotesk and Newsreader.
- **Bricolage Grotesque** won with 46/50. Fraunces was disqualified on macron drift. The scores are in DECISION §3.
- Playfair and every italic voice are retired. The Bricolage subsets (54.5 KB) replace about 140 KB of Playfair on a Japan page.

## 5. What this changes in our system

1. **Retire the R6 art direction as the default.** That means the night hero, the constellation and particle art, the gold-tinted illustrated plates, the purple signature tiles, the italic deks, the motif textures and the gradient washes. The retirement happens in the tokens: `--night` now points at the ground, so every rule that painted "night" paints paper.
2. **One accent site-wide.** The accent is the same for every city, replacing the eight-colour city skins. It is spent only on the saved heart, the saved count, the day-route line and the wordmark star. After the amendment, one flat warm "sun" wash was added behind data-backed sticker badges and the heart pop.
3. **Ink does the work.** The primary button, the active segment and the focus ring are all ink. Distinction ("Must see") is ink with a glyph, not gilt.
4. **Quiet chrome.**
   - The top bar is the ground plus a hairline.
   - Chips are hairline outlines.
   - Source credits are underlined text, not filled pills.
   - The view switcher is a sand track with a white thumb.
   - Shadows exist only on the search pill, floating controls and sheets.
5. **A calm no-photo cover.**
   - The ground is `--sand`.
   - One small kind glyph (30 px, `--ink-3`) sits in the middle.
   - The native-script name is set small, bottom-left, in the UI face.
   - It sits beside a real photo without pretending to be one.
6. **Pins and area colours are muted toward the palette.** Each area colour is mixed 50 % toward a warm grey, so the map reads as one calm surface. Area identity survives as a hue, not as a highlighter.

## Sources (searched 2026-10-11)

The searches were run with WebSearch on 2026-10-11:
- four third-party design-system teardowns of the marketplace;
- two teardowns of one athleisure label;
- two teardowns plus the identity designer's case study for a second label;
- one logo catalogue for a third label. No reliable source on that label's site design turned up, and this file says so instead of guessing.

The type data comes from the OFL @fontsource packages of the five faces named in §4.

Rule 6 applies here: the reference names and URLs are kept out of every committed file, this research note included.
The lane's session log holds the raw queries.
