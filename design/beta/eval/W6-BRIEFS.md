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
