# Wave 7: full UI/UX overhaul (owner request, 2026-10-11)

The owner looked at the R6 build and said the colour scheme, the styles and everything else are **still far from the competitors**. They asked for a proper UI/UX overhaul with this target:

- **Modern and minimal**, with the clarity, whitespace and image-first browsing of the leading home-rental marketplace.
- **A colour scheme that is our own**: unique, classy and luxurious, **never tacky**.
- **Reference points:** the restraint of premium athleisure and fashion labels, i.e. calm neutrals, large photography, quiet UI chrome, confident type and very few accents.

This wave replaces the R6 art direction. It does not polish it. Specifically, **retire** the following:
- the navy "night" hero with multicolour particle clouds;
- gold-tinted illustrated plates as the default card cover;
- purple signature tiles;
- the italic display deks;
- any decoration that competes with the content.

Keep everything that makes the guide honest. Every place must stay reachable, attribution and "Recommended by" stay visible, closures stay flagged, and nothing may be fabricated.

## Amendment (owner, 2026-10-11): Gen Z wanderlust that every generation trusts

The owner added:
> "We want th Gen Z wonder lust feel in the beta pages!! But keep it classy and still able to attract the boomer or Gen X. Don't forget to have inviting Gen Z style fonts too."

Every lane applies this on top of the brief below:

- **The feel.** Gen Z wanderlust: it should make you want to go, now. Get there with:
  - big, sun-washed photography;
  - confident and playful display type;
  - small moments of delight, e.g. a satisfying heart "pop", a soft card lift, a "you'd love this" nudge on saved lists, and fun counts like "37 spots locals swear by";
  - sticker-like but tasteful badges ("Must see", "Hidden gem" only where the data says so);
  - warm, sunny accents used sparingly.
- **Keep it classy.** Restraint wins every tie. No gimmicks, slang overload, emoji confetti, neon, gradients or loud animations. One expressive moment per screen, not ten.
- **Every generation trusts it.** Gen X and Boomer readers must find it calm, legible and credible:
  - body text ≥ 16 px with generous line-height;
  - high contrast, plain labels and obvious buttons;
  - nothing that hides behind gestures alone;
  - "Recommended by" and sources always visible, as the trust signal that wins them.
- **Fonts: inviting, Gen Z-style display face plus a supremely legible text face.**
  - The designer compares at least 4 expressive, self-hostable OFL/Apache display faces in the current youthful-editorial vein: soft or "wonky" serifs, characterful grotesques, friendly rounded geometrics. Each must ship Latin-ext **and Vietnamese**.
  - Pair the winner with one highly legible text and UI sans.
  - The display face sets headlines, city names and big numbers. The text face sets everything people read or tap.
  - Verify macrons, Vietnamese and the CJK fallback, and keep budgets: subset, `font-display: swap`, ≤ 2 families and ≤ 4 woff2 files in the critical path.
- **Copy voice.** Inviting and a little playful in headlines and CTAs, e.g. "Where to next?" and "Save it for the trip". Keep it plain and precise everywhere facts live: sources, closures, addresses. Strings go through the i18n catalogue. Never invent facts to sound fun.
- **Scoring.** The designer's direction card adds two items: **Gen Z wanderlust appeal** and **cross-generational trust and legibility**. Both must score ≥ 9/10 for the winning direction.

## Common rules (every lane)

- **Branch and git**
  - Work only on `claude/peaceful-goodall-i0hsrt`.
  - Run `git pull --no-rebase` before every push. Never reset or force-push. Commit explicit paths only.
  - End every commit with:
    `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
    `Claude-Session: https://claude.ai/code/session_01PCNcUkfa5S1N1BKGzZA4xx`
- **Before every commit:** `cd tools && npm run validate && npm test && npm run beta:check` must all pass.
- **Rules from CLAUDE.md and `docs/BETA-PROGRAM.md` apply:**
  - Beta scope only. Never touch the live site, the live builders or `data/`.
  - Every place stays reachable.
  - No CDN for content. Fonts are self-hosted woff2 under OFL or Apache, with the licence committed.
  - OSM and Esri tiles only.
  - Contrast is AA in light and dark. Reduced motion is respected. Targets are at least 44 px.
- **Rule 6.** Never name or allude to a third-party travel, hotel, review, booking, fashion or apparel brand, or its style, in anything committed: code, copy, docs, file names or commit messages. Describe references neutrally, for example "the leading home-rental marketplace" or "premium athleisure labels". melon-seek is the owner's own site, so it may be named.
- **Scripts:** Latin with diacritics (macrons) and Vietnamese must render in the chosen faces. CJK must fall back cleanly to system faces. Verify all three.
- **Budgets:**
  - Tokyo default view ≤ 2.0 MB transfer, FCP at 4× CPU ≤ 1.0 s, eager JS ≤ 40 KB gzip.
  - Photos are lazy below the fold and served as sized `srcset`.
- **Screenshots:** Playwright with the preinstalled Chromium; never run `playwright install`. Capture at 390×844 and 1440×900, in light and dark.
- **Coordination:** the orchestrator passes session IDs between lanes. Message a sibling lane (send_message) before you change a file it owns. The designer owns `tokens.css` and the base component styles. FE-A owns the city pages and views (`fe-a.css`, `views.css`, view JS). FE-B owns the hubs, landing and country pages. Imagery owns `beta/assets/img/**` and `tools/beta/imagery/**`.

## Lane: designer (art direction + design system v2)

1. **Research and write it down neutrally.**
   - Study the visual language of the leading home-rental marketplace and of premium athleisure and fashion labels:
     - palette and how sparingly the accent is used;
     - type families, sizes and weights;
     - whitespace and grid;
     - photo treatment and image ratios;
     - card anatomy, buttons, nav and search, icons and motion.
   - Use WebSearch only; WebFetch is blocked by policy.
   - Write it up in `design/beta/style/v2/RESEARCH.md`, describing each reference neutrally.
2. **Palettes.** Propose at least **4 unique palette directions** in `design/beta/style/v2/directions/`.
   - Each one is a full light and dark token set: ground, surface, ink scale, lines, one signature accent, state colours, and map-pin and area colours that sit quietly with the palette.
   - Each needs mockups at 390 and 1440 of the landing page, a country hub, a city page in Gallery and in Atlas, and a place detail.
   - Each must be ours, not a reference's palette.
   - Avoid gold gradients, neon, purple chrome, multi-colour UI chrome and heavy shadows.
3. **Type.** Re-decide it.
   - The default to test is one modern, refined sans across UI and display: tight tracking at large sizes, 400/500/600, tabular numerals.
   - A serif may stay only if it clearly earns its place, for example in the wordmark alone.
   - Compare at least 3 self-hostable OFL faces that ship Vietnamese.
4. **Iconography and covers.**
   - One thin, consistent line-icon set (inline SVG).
   - A calm **no-photo cover**: a quiet neutral ground, a small category icon and a typographic name, never a busy illustration. It must sit gracefully next to real photos.
5. **Score and decide.**
   - Score every direction on one card: modern-minimal, marketplace-grade clarity, palette uniqueness, classy and not tacky, luxury feel, readability, AA in light and dark, consistency across views, and photo-friendliness.
   - Record the winner and why in `design/beta/style/v2/DECISION.md`, with a decision row in `docs/BETA-DECISIONS.md`.
   - Build `design/beta/style/v2/board.html`: a self-contained, single-file page comparing the directions (swatches, type specimens, mockup images inlined or relative) so the owner can review it.
6. **Implement design system v2 across the whole beta.**
   - Tokens (`tokens.css`), base components (buttons, chips, the search pill, cards, sheets, tabs and the view switcher, the tray, toasts), city skins reduced to a quiet accent or none, dark mode, focus rings and motion.
   - Update `design/beta/DESIGN-SYSTEM.md`.
   - Retire the night hero, particle art and gold plates as defaults.
   - Put before/after screenshots in `design/beta/style/v2/after/`.

## Lane: FE-A (city pages + views UX overhaul)

Rebuild the city-page experience with marketplace-grade patterns, using only the designer's tokens (no raw colours).

1. **Header.**
   - Compact and sticky, with a centered **search pill** (place, dish, area).
   - The view switcher (Gallery, Atlas, Guidebook, Insights) becomes an understated segmented control. On phones it becomes a tab bar or a sheet.
2. **Category bar.** A horizontally scrolling bar of line icons plus labels (collections, cuisines, areas), replacing the chip clutter. The active state is an underline.
3. **Image-first grid.**
   - Card = rounded media, about 4:3 or square, with a heart in the corner. Below it sit 2–3 lines: the name, then area · kind, then "Recommended by N".
   - No card frame, border or heavy shadow.
   - Columns: 1 at 390, 2 at 768, 3 at 1024, 4 at 1440.
   - Pressed and hover states.
   - Use real photos where the imagery lane provides them, and the designer's calm no-photo cover otherwise.
4. **Hero.** Quiet: the city name, one line and the count, with an optional photo. No particle art.
5. **Map.**
   - A floating **"Show map / Show list" pill** on the phone Gallery, as in the marketplace pattern, opening the map-first Atlas.
   - Keep everything R6 Atlas delivers: tray, ≥ 60 % desktop map, numbered pins, two-way sync. Restyle the pins and tray in the new system.
6. **Place detail.**
   - A clean detail page or sheet: large media at the top, then the title, a meta row, and sections divided by hairlines (Why it's here, Recommended by, Practical).
   - A sticky action bar with Save, Directions and Share.
   - Closed places show a calm but unmistakable "Closed" state.
7. **Guidebook and Insights.** Restyled in the same system.
8. **Gates.** Every existing gate stays green: P-04/G1 reachability, views.js, w5.js and the w2 map probe. Never weaken a test. If a measurement rule must change because the UI changed, record the change in BETA-LOG for QA to ratify.
9. **Evidence:** `design/beta/eval/w7/fe-a/`.

## Lane: FE-B (landing, hubs and country pages)

The orchestrator launches this lane once the R6 review sessions finish.

1. **Landing.** Search-first: a large search pill. Below it sit rows of destination cards (image-first, same card anatomy as FE-A), a quiet "How we choose" strip and the countries.
2. **Country and region hubs.** An image-first city grid and editorial rails as image cards. Retire the purple signature tiles and the night hero.
3. **Static pages** (method, accessibility, etc.): the same type and spacing system.
4. **Evidence:** `design/beta/eval/w7/fe-b/`.

## Lane: imagery (real photos through GitHub Actions, no key needed)

Photos are what make a marketplace-grade, image-first page. Unsplash still waits on the owner's key. Wikimedia Commons needs **no key**, and a GitHub-hosted runner can reach it.

1. **Manifest.** Build `beta/assets/img/commons-candidates.json` with WebSearch (allowed_domains commons.wikimedia.org / wikipedia.org).
   - Cover city and hub heroes, and the top sights (tier-1 first) on every page.
   - Each candidate records the File: title, what it depicts and a confidence grade.
   - High confidence = the file title or description names that exact place.
2. **Fetch script.** Write `tools/beta/imagery/fetch-commons.js`.
   - Use the Commons API (`action=query&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=…`).
   - Keep free licences only: CC0, PD, CC BY and CC BY-SA. Refuse NC and ND.
   - Re-check that the file's title, description or categories name the place.
   - Download sized thumbnails, writing two widths for `srcset` if the gate is extended to allow size variants of one credited record.
   - Write TASL credit rows to CREDITS.json.
   - Respect the API etiquette: set a descriptive User-Agent and throttle requests.
   - With no network, exit 0 and print the plan.
3. **Rules.**
   - **Never** a photo for food places or venues.
   - Never for closed places or Vietnam (no freedom of panorama).
   - Only where the photo truly shows the place.
   - The credit gate and `test-imagery.js` keep refusing anything uncredited.
4. **Workflow.** Do **not** edit `.github/workflows/`. Tell the orchestrator the exact command and it will wire it into `beta-fetch-unsplash.yml`, which runs on a GitHub runner, rebuilds and gates the beta, and commits.
5. **Render.** Make sure the builder renders credited photos into heroes and cards: lazy, sized, with alt text, and with a small credit line or a credit in the sheet. Coordinate the card markup with FE-A.

## Added 2026-10-11 14:20Z: Round 6 evaluator gaps folded into Wave 7

[ROUND-6](ROUND-6.md) scored R6 at **85.4** (A 77, B 88, C 96, D 89). Its ranked gaps, each with a testable acceptance in ROUND-6 §"Top gaps", are now W7 work:

| R6 gap | Owner in W7 |
|---|---|
| #1 Signature motion moment: tapped cover or pin grows into the sheet, ≤ 400 ms, nothing under reduced motion. Doubles as the Gen Z "delight" moment. | designer (spec + tokens) + FE-A (build) |
| #2 Atlas residuals: number labels open the place, clusters look unlike rank pins, pin → card in view, no page scroll on desktop pin, day route above the peek, city name visible at peek. Plus R6 QA's two Highs: the Leaflet `_leaflet_pos` error and the 370 px tray head. | FE-A |
| #3 Type rebuild unfinished: rendered weights and steps, widows, optical size, raw sizes and radii, DESIGN-SYSTEM.md. | designer (v2 rollout must meet these probes) |
| #4 Accessibility debt from the full sweep: Insights `role="img"` wrapping links; light-theme contrast and targets on the 84 "What changed" pages. | platform (new lane) |
| #5 Performance residue: Atlas Tokyo ≤ 2,000 KB, `#p=` deep link ≤ 3,000 nodes, eager JS ≤ 40.0 KB gzip via a minify step. | platform (new lane) |
| #6 Cleveland sights on the compass motif | live pipeline, out of beta scope; stays in the PM backlog |
| #7 Desktop Atlas rail reachable without horizontal scroll | FE-A |
| #8 "Start with" button names the lead-card place | FE-A |

## Lane: platform (accessibility + performance), added 2026-10-11

1. **R6 gap #4: accessibility.** Acceptance: `probe-axe.js` reports 0 serious/critical on every page, viewport and theme. `beta:metrics:all` reports B-23 ✅ and B-20 ✅ on all 84 "What changed" pages.
2. **R6 gap #5: performance.** Acceptance:
   - Atlas Tokyo ≤ 2,000 KB, e.g. by loading Leaflet after first paint.
   - A `#p=` deep link on a phone builds ≤ 3,000 nodes at load.
   - Eager JS ≤ 40.0 KB gzip with no rounding. Add a minify step to the beta build, with source maps not shipped.
3. **Ownership.** This lane owns the build pipeline's minify step and the performance changes. FE-A owns view markup and behaviour, so coordinate any atlas.js or view-JS change with FE-A first.
4. **Evidence:** `design/beta/eval/w7/platform/`.

## Amendment 2 (owner, 2026-10-11 14:25Z): Atlas is map-search, "the real-estate map-search pattern, for travel"

The owner asked: *"Where is the map front and center in the atlas mode?! Think Zillow for travel kinda!"*

Rule 6: in anything committed, call it "the real-estate map-search pattern".

The R6 Atlas made the map bigger. It did not make the map the way you search, and it never reached the live beta. Atlas is now its own lane (**Lane: Atlas map-search**, below). FE-A hands off atlas.js, the Atlas-scoped CSS and the Atlas parts of the view JS, and keeps the shared card component, which Atlas reuses.

### Lane: Atlas map-search

**Desktop (≥ 1024 px): split screen, the map leads.**
- The **map fills the left ~60 %** at full viewport height, sticky under a compact header.
- A **filter bar** sits on top: the search pill; chips for Sights, Eat & drink, Must see, Area and Saved; and Sort (Top ranked).
- The **right side is a scrollable 2-column grid** of image-first cards: photo or calm cover, heart, rank badge, name, area · kind, and "Recommended by N". This is the same card component as Gallery.
- A results header reads e.g. "86 places in this map area · Top ranked".
- **"Search as I move the map"** is on by default. The list shows only the places inside the current map bounds and updates on pan or zoom. A persistent "N more outside this area. Show all" link keeps every place one tap away (reachability gate).
- **Pins are label pills**, the way listing maps show prices. Each shows the rank number, with ★ for Must see. The colour is muted: sight vs eat & drink in the v2 palette.
  - A hovered or selected pin turns ink-filled and grows. A saved place shows a heart.
  - **Card hover ↔ pin highlight works both ways.**
  - Clicking a pin opens a **preview card on the map** (photo, name, one line, sources). Clicking that opens the place detail.
- **Clusters** below a zoom threshold are count bubbles styled unlike rank pins. Clicking one zooms in.
- **Map controls:** zoom, opt-in locate-me, a base switch (Street / Satellite, OSM/Esri no-key only) and a minimal legend.
- **Choosing an area** chip fits the map to that area.

**Phone (< 768 px): the map is the screen.**
- Atlas opens with a **full-screen map** under the compact header, with one horizontally scrolling chip row (filters).
- A **swipeable card carousel** sits at the bottom, synced to the pins. Tapping a pin scrolls its card into view. Swiping a card highlights its pin and pans the map gently.
- A floating **"List" pill** (bottom centre) switches to a full-screen image-first list of the places in the map area. Its floating **"Map" pill** returns. The R6 peek/half/full tray is retired, which also closes the 370 px tray-head High.
- After a pan, a **"Search this area"** button refreshes the carousel and list. There is no live jank on phones.

**Must keep:**
- `#view=atlas` and `#p=` deep links: the detail opens with the map centred on that place.
- Day routes drawn on the map.
- Near me (opt-in, in memory).
- Closures flagged on pins and cards.
- Only OSM/Esri tiles.
- **Content never depends on the map library.** If Leaflet or the tiles fail, the list grid renders every place with a quiet "Map unavailable" note, and no page error. Fix the R6 `_leaflet_pos` High.
- Leaflet loads after first paint, so Tokyo Atlas is ≤ 2,000 KB.
- 500+ pins stay smooth. Use clustering and avoid per-pin heavy DOM; canvas or a lightweight DOM is fine.

**Acceptance (probes run by QA and the evaluator):**
- On desktop, the map is ≥ 58 % of the width at full height, and the list is a 2-column card grid.
- Panning changes the list count, and "Show all" restores N.
- Hovering a card highlights its pin, and hovering a pin highlights its card.
- Pin → preview → detail works.
- On phone, the first screen is ≥ 70 % map. Pin → carousel card is in view, and the List/Map toggle works.
- Every place is reachable in Atlas, with the map and without it.
- Atlas Tokyo ≤ 2,000 KB, FCP 4× ≤ 1.0 s, 0 page errors (including tiles blocked), axe 0 serious/critical.

**Evidence:** `design/beta/eval/w7/atlas/` (390 and 1440, light and dark, with tiles and with tiles blocked).
