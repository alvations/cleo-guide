# Wave 6 — Typography & style round (owner request, 2026-10-11)

The owner asked for the **fonts, the styles and everything else visual** to be **rated**, and for the improvements to be **built in**, borrowing ideas from the owner's own site **melon-seek** where they help. A snapshot is in `design/reference/melon-seek/`. It self-hosts Inter and uses a small, disciplined token set: `--ms-font`, `--ms-radius`/`-sm`, `--ms-shadow-sm`/`--ms-shadow`/`--ms-shadow-lg`, and light/dark variants.

## Common rules (every lane)

- **Branch and git:** work on branch `claude/peaceful-goodall-i0hsrt` only.
  - Run `git pull --no-rebase` before every push.
  - Never reset or force-push.
  - Commit explicit paths only.
  - End each commit with these trailer lines:
    `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
    `Claude-Session: https://claude.ai/code/session_01PCNcUkfa5S1N1BKGzZA4xx`
- **Checks:** before every commit, `cd tools && npm run validate && npm test && npm run beta:check` must pass.
- **Rules:** CLAUDE.md and `docs/BETA-PROGRAM.md` apply. In particular:
  - **Beta scope only.** Never touch the live site, the live builders or `data/`.
  - **Every place stays reachable.** The view, reachability and count gates must stay green.
  - **No CDN for content.** Fonts must be **self-hosted** woff2 under an open licence (OFL or Apache), with the licence file committed. Do not load fonts from any font service at runtime.
  - **AA contrast** in light and dark. Reduced motion stays respected.
  - **Rule 6.** Never name or allude to any third-party travel, hotel, review or guidebook brand or style in anything new. melon-seek is the owner's own site, so it may be named.
- **Scripts:** the type must still render the scripts in our data. That means Latin with diacritics (macrons and the like) and Vietnamese, plus CJK (Japanese names) through a sensible system fallback stack. Verify all three.
- **Budgets:** stay within the performance budgets. Tokyo's default view must be ≤ 2.0 MB, and FCP at 4× CPU must be ≤ 1.0 s. Subset fonts and use `font-display: swap`.
- **Screenshots:** use Playwright with the preinstalled Chromium. Never run `playwright install`. Capture at 390×844 and 1440×900.

## Lane: designer (type & style)

1. **RATE what ships today.** Write `design/beta/style/AUDIT.md`. Score each item 0–10 with evidence (screenshots in `design/beta/style/audit/`):
   - display face (Bodoni Moda) and UI face (Figtree): legibility at 12–16 px, hierarchy, character, luxury × fun fit, diacritics, CJK fallback, weight/opsz range, file weight;
   - type scale and line-height, measure, letter-spacing, uppercase use;
   - colour tokens and per-city skins, light and dark;
   - spacing rhythm, radius, elevation and shadows, borders;
   - components: cards, chips, pills, buttons, the switcher, the sheet, tray, rails, charts and the masthead;
   - iconography;
   - motion;
   - overall consistency across the four views and the hubs.
2. **Compare.** Score the same items for melon-seek (from the snapshot) and for the leading hotel, experience and booking products' general patterns, described neutrally. Note which melon-seek ideas would help. Examples: one disciplined token set, a 3-step elevation scale, consistent radius, Inter-style UI legibility, and tabular numbers for counts and charts.
3. **Three directions.** Propose three concrete type & style directions as token sets plus static mockups of the landing page, a city in Gallery, Atlas and Insights, and a place sheet, in `design/beta/style/directions/`. For example:
   - (A) refine the current pairing;
   - (B) a serif display face plus an Inter-class UI face with melon-seek-style tokens;
   - (C) another self-hostable pairing of your choice.

   Rate each direction with the same scorecard, and choose the highest-scoring one. Write `design/beta/style/DECISION.md` recording the scores and the rationale.
4. **IMPLEMENT the winner across the whole beta:**
   - `beta/assets/*.css` tokens and fonts;
   - the font files plus licences;
   - any small markup hooks needed, logged in BETA-LOG.

   Regenerate with `npm run beta`. Keep every gate green. Save before and after screenshots in `design/beta/style/after/`. Append to `docs/BETA-LOG.md`.
5. Your final report is ≤ 200 words: the scores before and after, the chosen direction and why, and the SHAs.

## Lane: atlas-map-first (owner request, 2026-10-11)

The owner says that in **Atlas** the **map must be front and centre**, as in the live map-centred guide (`cleveland.html` and the other live city maps) and as in the earlier map-centred beta Cleveland page from Waves 0–1 (`git log -- beta/cleveland.html` and `design/beta/mockups/`). Bring those ideas back into Atlas. Gallery stays the default view, and Guidebook and Insights are unchanged.

**Requirements:**

- **Phones (390×844):**
  - Atlas opens **map-first**. The map fills the viewport under a compact header.
  - The ranked list sits in a bottom tray with a peek → half → full detent; the peek shows the area chip and the first ranked place.
  - Tapping a pin opens the sheet, and Back closes it.
  - This reverses the earlier list-first choice for phones. Re-measure B-01/B-03 and record the decision in BETA-LOG and BETA-DECISIONS (PM-owned file: add one entry).
- **Desktop (1440×900):**
  - The map is the dominant pane, at least 60 % of the width.
  - The ranked list is a slimmer side panel, with numbered pins matching the list ranks and two-way hover/click sync.
  - Fit to the active area, and fly to the open place.
- **Live-guide ideas to reuse (study `cleveland.html`):**
  - area colour pins and the legend;
  - the base-layer switch (OSM/Esri only);
  - locate-me (opt-in, never stored);
  - the must-see / tier filter on the map;
  - pin clustering only at dense zooms.

  Never add Google or key-required tiles; `check-google.py` must pass.
- **Unchanged guarantees:**
  - Everything that worked in Atlas keeps working: deep links, `#view=atlas&map=1`, the day plan route line, saved lists, Near me, and closures flagged.
  - Every place stays reachable (P-04 and G1 gates), and the count asserts hold.
  - No CDN dependency for content; the map mounts progressively.
  - Budgets hold: Tokyo default ≤ 2.0 MB, FCP 4× ≤ 1.0 s.
  - AA contrast is kept.
- **Coordination:** the W6 type & style lane is changing `beta/assets/*.css` at the same time. Keep your CSS in Atlas-scoped selectors, pull often, and log the hooks you add in BETA-LOG.
- **Evidence:** before and after screenshots at both viewports (Tokyo, Cleveland, a Singapore town) in `design/beta/eval/w6/atlas/`.
- **Final report:** at most 200 words.
