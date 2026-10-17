# ja interface audit, 2026-10-17 (i18n lane, D-41)

`node tools/beta/i18n-audit.js` renders every page type and view under `?lang=ja` in a real browser, at 390 and
1440 px, with tiles blocked. It serves a **pseudo** catalogue (every string full-width ⟦…⟧) as `ja.json`. Any visible
ASCII word left is either data or hard-coded English.

**Data stays English by design:** place, area, source, guide, country and collection names, addresses, "Look for"
notes, and each guide's own method notes ("How the cuisine filters were policed", "What is thin, and why").

**The language note is bilingual on purpose:** "Japanese interface: …" and "Report a wrong phrase".

The table lists only what is left after that.

| Where | Hard-coded English on a ja page | File (owner) | Weight |
|---|---|---|---|
| **Atlas, the default view under D-46** — **fixed (W8-I18N-ATLAS)** | "Skip to the map" / "Skip to the results", "Top picks", "Top ranked", "Sort places", "Saved", "All", "places ·", "Show 36 more", "Show all 488 in one list", "36 of 488 places", "Must see", "Recommended by", "Map unavailable right now — every place is listed here.", the title "Ordered by tier within each area…", plus the empty state FE-1 is already switching (QC-05) | `client/atlas.js` (Atlas lane), `client/atlas-nav.js` (Atlas FE-2), `Cleo.countLine` in `client/core.js` (platform) | **High**: the first screen every ja reader sees once Atlas is the default |
| Atlas search `aria-label` — **fixed** | "Search and filter the map" is hijacked by the generic `Search {city}` template, so a ja screen reader hears 「and filter the mapを検索」 | `client/atlas.js` | **High** (a11y). It is fixed by cataloguing the string, because the longer literal then wins. |
| **Your lists** (`saved.html`) — **fixed (W8-I18N-LISTS)** | nearly the whole page: "Saved", "All saved", "Been there", "New list", "Take it with you", "Share link", "Share as an image", "Export", "Backup of all lists (JSON)", "Make a trip", "Import backup", "Lists", "No named lists yet…", "Open in maps", "Must see", "Recommended by", the empty states, "A shared list of N places — read only…" | `client/saved.js` (FE-A) | **High**: a whole page |
| The tiles-failed map note | "The map couldn't load. The list still has every place… Try again" | `client/mapfail.js` (platform) | Medium: only when the tiles fail, but then on every page |
| Site notices | the offline and storage-blocked banners | `client/states.js` (FE-B) | Medium: only in those states |
| The count line | "All N places", "n of all N places", "· S sights · F eat & drink…" | `Cleo.countLine`, `client/core.js` (platform) | High: it shows in the Atlas list head |
| Insights footnote | "1 closed place carries no tier…" (the singular the platform writes) | `client/insights.js` | **Fixed in this commit** (`ins.p.tier.one`) |

**Clean apart from data:** the landing, the hubs, What changed, the method pages, 404, trip, Gallery, the place
detail, Your day, Guidebook and Insights.

**Fix pattern** (as done for search.js in W8-I18N-SEARCH):
- the string goes through a local `tt(key, English)` helper that calls `Cleo.t`;
- a new key prefix is added to `swapSkip`;
- the module redraws on `cleo:locale`;
- the English output stays byte-identical;
- a test-i18n pseudo check covers the module;
- an independent review round checks the ja.

**Also fixed in W8-I18N-ATLAS (found while re-auditing):**
- Cards stamped after the swap (Cleo.defer chunks) were partly English in every city view: the tier label and "Recommended by".
- The build's `data-l` templates filled later stayed English: pack.js's "{size} on this device", and mapfail's offline line.
- locale.js now swaps both.

**Open:**
- mapfail.js's own copy (platform);
- states.js's offline and storage banners (FE-B);
- Cleo.countLine in core.js (platform; not reached in Atlas any more, since Atlas has its own count line, but still used elsewhere).
