# W9 audit: acceptances in ONE-UP.md §7

FE-C ran this audit on 2026-10-16 against the built `beta/`. The acceptance pass ran at head `f8b2a0ce2`. W9-1 was then re-checked at `b8a3a6ae2`, after the w8p fix.

**Reproduce:**
- `npm test` covers W9-1, W9-4, W9-5 and W9-7 (via test-fe-c).
- `npm run beta:probe:fe-c` covers trip, base, rec-pv and cards.
- `npm run beta:qa:pack` covers W9-8.
- The one-off audit scripts are in [`tools/beta/qa/w9-audit/`](../../../../tools/beta/qa/w9-audit/). Run them from `tools/`.
  - The Python scripts read `beta/`.
  - The `.js` probes need Playwright: `NODE_PATH=$(npm root -g)`, with Chromium at `/opt/pw-browsers/chromium`.

| Item | Verdict | Evidence | SHA |
|---|---|---|---|
| **W9-1** Recognition layer | **PASS** | test-fe-c REC: 84 pages, attributes equal platform's data. Of 8,702 places, 0 have a badge without a source key. Award counts equal the source index on every guide. `#rec=award` shows 147 on Tokyo, and "Show all" works. Badges appear on Gallery (29/62), Guidebook (250/488) and Atlas previews, each equal to the data. A closed place shows its recognition only in the detail, under "Before it closed". `beta:qa:w8p`: Tokyo phone first load is 618 KB (cap 700). | b8a3a6ae2 |
| **W9-2** Freshness everywhere | **PARTIAL** | `w92.py`, `w92b.py`. **acc1:** `data-checked` equals the data on 8,702 of 8,702 cards; since the audit every card shows "Status checked <d Mon>" (FE-C fresh.js, 38228322b; test-fe-c FRESH). **acc2:** landing numbers equal changes.json (0 mismatches), but there is no "retiring" count, and the heading reads "October 2026 in Cleo" (FE-B). **acc3:** 7 of 71 closed places lack a `statusSource` (platform, data/geocodes.json). These are aachen zum-goldenen-einhorn, rhineland kaspars and brauerei-zum-schiffchen, singapore/ang-mo-kio grub, singapore/bishan canopy-garden-dining and denzy-gelato-bishan, and singapore/upper-serangoon amber-ember. **acc4:** since the audit every city page has "Follow changes" → its feeds/<page>.xml (FE-C, test-fe-c FRESH checks all 84). **acc5:** the HOURS regex in lib/quoted.js misses "Open 24h" (6 Singapore places) and "open later" (Miami) (FE-B). | f8b2a0ce2 |
| **W9-3** Your interests follow you | **PASS** (5/5) | `w93.js` on 84 pages: setDiff 0, lifted 8,272, liftNoId 0, liftClosed 0, whyBad 0, throwsDiff 0, clearDiff 0, errs 0. Two notes: the landing rail ranks guides, not places, and rail tiles aren't reordered (railReordered 0). | f8b2a0ce2 |
| **W9-4** Trips | **PASS** (7/7) | test-fe-c PLAN, LINK, PAGE, SAVED→TRIP and PRINT, plus `beta:probe:fe-c` trip. | f8b2a0ce2 |
| **W9-5** "Set as my base" | **PASS** (7/7) | acc1–4 and acc7: test-fe-c BASE (84×5 haversine, QC-15 focus and Escape) plus the probe's base run. acc5: Atlas FE-2's ring checks in atlas-nav-ms.js (fb71fc52a). acc6 holds by construction: the ring uses animate:false and has no CSS transition. | f8b2a0ce2 |
| **W9-6** Paste a link | **FAIL** (acc1), **PARTIAL** (acc4) | `w96.js`, `w96b.js`. **acc1:** source-hosts.json is built only from `domains`, so a gotokyo.org link reads "No guide cites". It also does no exact-URL lift or path normalisation, and the header wording is off (FE-B build.js ~L263–276, search.js). **acc4:** there is no "Suggest this source", and the page makes false "no guide" claims. acc2 and acc3 PASS. | f8b2a0ce2 |
| **W9-7** Share cards | **PASS** (5/5) | `beta:probe:fe-c` cards (1080×1920, light tokens, calm cover, tier pills, Web Share or download) plus test-fe-c CARD. | f8b2a0ce2 |
| **W9-8** Offline city pack | **PASS** (4/4) | `npm run beta:qa:pack` (tools/beta/qa/offline-pack.js). The Tokyo pack includes 6 photos at 720w. Note: this probe is not in `npm test`. | f8b2a0ce2 |
| **W9-9** Local favourites lens | **LIVE** (acc1 PARTIAL upstream) | Merged with its ja after the audit: test-fe-c LF — 8 guides show the lens (304 places, each meeting the printed rule), 76 state the gap with no door; Cleveland `#lf=1` shows exactly its local favourites; "Show all". acc1 PARTIAL upstream: platform has typed 1,777 of 2,512 publishers. | see docs/resume/fe-c.md |
| **W9-10** The dated edition | **PASS** (4/4) | `w910static.py`: 0 edition or closed mismatches against changes.json on 84 pages, and 0 photo violations. `w910print.js` checked the print PDFs of Tokyo, Cleveland, Brussels, Chinatown and Ho Chi Minh City. | f8b2a0ce2 |

## Who closes what

- **FE-C (next):**
  - done after the audit: the W9-2 card line and "Follow changes" link; W9-9 live.
- **FE-B:**
  - W9-2 acc2 (retiring count, heading) and acc5 (HOURS regex);
  - W9-6 acc1 and acc4.
- **Platform:**
  - W9-2 acc3 (7 statusSource);
  - W9-9 publisher typing;
  - optionally, putting `beta:qa:pack` in `npm test`.
