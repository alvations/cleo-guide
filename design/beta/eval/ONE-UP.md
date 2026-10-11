# One-up: the best of every competitor family, plus what only we have

> 2026-10-11 · product lane (research and specification only; no product code changed) · measured on `29e15808`
> (the W8 head when this was written). `npm run beta` was a PASS that wrote 0 files: 179 pages, 84 place pages,
> 8,458 places, beta == live.
> **Owner direction (2026-10-11 ~20:05Z, brand redacted per rule 6):** *"Remember not to just make it a literal copy of
> [the real-estate map-search product]. The general idea is to take the best features from the competitors and put them
> together to one-up every one of them. But the [real-estate map-search]-style Atlas navigation is super on point, so
> continue to iterate on it, but don't neglect the other features."*
> **Rule 6:** this file names no third-party travel, booking, review, guidebook or fashion brand. Families are described
> neutrally.

## Contents

1. [The short answer](#1-the-short-answer)
2. [Method and evidence](#2-method-and-evidence)
3. [What only we have](#3-what-only-we-have)
4. [Competitor families: their best features, whether we have them, and the one-up](#4-competitor-families)
5. [The other views, one by one](#5-the-other-views-one-by-one)
6. [Ranked one-up opportunities](#6-ranked-one-up-opportunities)
7. [W9 brief proposals (top 10)](#7-w9-brief-proposals-top-10)
8. [Refused, and why](#8-refused-and-why)

---

## 1. The short answer

The beta already matches most of each family's signature features. ROUND-7 has C at 96 (32 ✅, 3 ◐, 0 ✕ on the 35-row
table). **Copying more of them earns little, because C is near its ceiling and its remaining ◐ rows are photos, the
per-city look and a second locale.** The points left are in:
- D's two weakest rows: *"Your guide" and day plans* (79) and the *interest triad* (81);
- D13's two sub-criteria: Gen Z wanderlust appeal (7.5) and cross-generational trust (8.5);
- B's discovery and detail rows (91 and 90).

Those are the rows where a one-up lands. Each one-up below takes a feature a competitor family is known for and rebuilds
it on something that family cannot offer: a named source behind every place, a pin checked to the door, a dated
open/closed check, and closures that stay on the record.

**The top five, in one line each:**
1. **Recognition layer.** The favourites badge from the rental marketplace and the award filter from the map apps, but
   computed from named sources and linked to them. It never uses ratings.
2. **Freshness everywhere.** The editorial guides' "updated" stamp on every card, a "this month" module and a
   "retiring soon" rail, all driven by the dated checks we already hold.
3. **Your interests follow you.** The marketplace's personalised home, rebuilt as the interest picker carried across
   every guide. It reorders and never hides.
4. **Trips, not just a day.** The trip planners' multi-day itinerary, built from your saved places. Closed places can't
   enter, every stop keeps its source, the whole trip travels as one link, and nothing needs an account.
5. **"Close by" from any place.** The real-estate commute filter, rebuilt as a walking radius around any place you
   choose, with the assumption stated. Atlas and the place detail share it.

ROUND-7's top gaps and W8 are still the work in progress: photos, polish, motion, Atlas residuals, first screen, palette
and weight. SPEC-v3 covers the Atlas map itself. The proposals here are **additive** and reference those briefs instead of
repeating them.

## 2. Method and evidence

- **Read:**
  - [CLAUDE.md](../../../CLAUDE.md);
  - [ROUND-7](ROUND-7.md) (88.5; §C, §D, D1–D13, top gaps);
  - [ROUND-1](ROUND-1.md) (the 35-row table in full, the benchmark families, the OOS rows);
  - [specs/README](../specs/README.md) (Wave 0 teardown);
  - [docs/BETA-BENCHMARK.md](../../../docs/BETA-BENCHMARK.md) (§3 teardown target, §4 must/should/could);
  - [atlas/PANEL.md](../atlas/PANEL.md), [PANEL-R0](../atlas/PANEL-R0.md) (56.1) and [SPEC-v3](../atlas/SPEC-v3.md)
    revision 2;
  - [W8-BRIEFS](W8-BRIEFS.md).
- **Built and inspected:** `cd tools && npm run beta` (PASS), then the built `beta/` served locally and captured with
  headless Chromium at 390×844 and 1440×900 in the light theme with reduced motion. Off-origin requests were aborted, so
  **the blank map ground is a sandbox artefact**, as in every round. The harness is
  [`one-up/tools/probe-views.js`](one-up/tools/probe-views.js). It recorded 0 page errors on 22 page loads. Its control census
  is not committed, because it quotes source chip labels verbatim; re-run the harness to regenerate it.
  - Shots: [landing](one-up/landing-m.jpg) · [Japan hub](one-up/japan-m.jpg) · [Tokyo phone](one-up/tokyo-m.jpg) ·
    [Tokyo desktop](one-up/tokyo-d.jpg) · [place detail](one-up/tokyo-sheet-d.jpg) · [day plan](one-up/tokyo-day-d.jpg) ·
    [Guidebook](one-up/tokyo-guidebook-d.jpg) · [Insights](one-up/tokyo-insights-d.jpg) ·
    [Cleveland](one-up/cleveland-m.jpg) · ["What changed"](one-up/changes-m.jpg).
- **Read from the shipped code:** the client headers and the data blobs in `tools/beta/client/*.js` and
  `beta/data/places/*.json`. The facts below come from them.
  - `day.js`: one area per day; 4–6 open, pinned stops; nearest next; move or remove a stop; legs "x km straight-line";
    shared as `#day=AREA&s=…`; KML and a map-app route; print.
  - `saved.js`: named lists (create, rename, delete); Been-there stamps; KML, GeoJSON and JSON backup plus import;
    `#list=` with "Save a copy"; unknown ids reported.
  - `foryou.js`: an interest picker keyed on collection and cuisine ids; reorders within each area with "First because …".
  - Near me: opt-in, never stored.
  - Feeds: per-city RSS (`beta/feeds/*.xml`) and dated "What changed" pages.
- **Data facts (computed on `29e15808`):**
  - 8,458 places; 7,288 (86 %) carry ≥ 2 sources;
  - 1,069 places cite an institutional restaurant-award source, and 65 cite a culinary-foundation award source;
  - 15 source links point to creator videos on short-video platforms;
  - 70 places are closed and flagged;
  - every coordinate in `data/geocodes.json` (10,543 entries) carries `source`, `verified`, `confidence`, `status`,
    `statusSource` and `statusChecked`;
  - **records carry no first-seen or opening date**, so "new" can only come from the dated change log (see §8).
- **Competitor research:** WebSearch only, on 2026-10-11, covering 2024–2026 features. WebFetch is blocked by policy and
  was not used or routed around. Research notes stay private, because they name brands. The neutral findings are in §4.

## 3. What only we have

These are the strengths every one-up is built on. No family in §4 has more than two of them.

| Strength | Where it ships today | R7 D row |
|---|---|---:|
| **Sourced picks.** "Recommended by" on every card, sources as navigation (`#src=`), a published method with live numbers | G6: 0 cards without it on 84 pages | 94 |
| **Verified pins.** Every coordinate sourced, dated and graded | `data/geocodes.json`; "Pinned to the door: high confidence, verified <date>" in the detail | 92 |
| **Closure honesty.** Closed places stay, flagged, dated and sourced, and never enter a day plan | "Closed · kept for the record"; "What changed"; RSS | 95 |
| **The interest triad and the anime layer.** Landmarks × the city's own food canon × pop culture | ★ signature rail (Tokyo: Anime, Manga & Pop Culture; Cleveland: Only in Cleveland) | 81 / 85 |
| **Day plans and "Your guide"** | `day.js`, `foryou.js`, `saved.js` | 79 |
| **Stated gaps.** We say what a city lacks instead of padding | gap tiles and method notes | 89 |
| **No account, no tracking, no key.** Everything is on the device or in the link | `Cleo.store` (try/catch), hash codecs | — |

---

## 4. Competitor families

Legend: ✅ we have it · ◐ partly · ✕ not at all · **OOS** out of scope by a hard rule (§8). "Evidence" points to the
built beta at `29e15808` or to an R7 measurement.

### 4.1 The leading home-rental marketplace (image-first marketplace)

What it is known for in 2024–2026:
- an icon category bar;
- borderless photo cards with a heart;
- a map/list split that updates as you pan;
- a favourites badge for its top listings;
- shared wishlists that people join by link, with notes and votes (2024);
- a 2025 redesign that puts experiences and services next to stays, plus a "trips" tab that lays out your days.

| Their best feature | Us | Evidence | **The one-up** |
|---|:-:|---|---|
| Icon category bar as the front door | ✅ | Line-icon category bar on every city page (R7 K7) | Our ★ signature tile leads, and it is the city's *own* canon (Polish Boy in Cleveland, anime in Tokyo), not a generic category. Keep. |
| Photo cards with a heart | ◐ | Anatomy matches (R7 K1). Photos on 3 % of eligible places, so most rows are sand covers | W8 imagery gap 1 and the FE-A food covers already own this. One-up on top: **no-photo covers that say *who* recommends the place** (§6 #11). |
| Favourites badge | ◐ | The tier ladder (Must see, graded within each area) exists. There is no consensus badge | **Recognition layer** (§6 #1): "Cited by 4 sources" and award badges. Each is computed from named sources and links to them, and none uses ratings. Their badge is a black box; ours shows its working. |
| Shared wishlist with notes and votes | ◐ | Named lists and `#list=` with "Save a copy" ✅; no notes or votes | **Group pick by link** (§6 #12): each friend marks ♥ or ✕ and sends a link back, and the lists merge on your device. No account and no server. It ranks low, because the value is real but niche. |
| A "trips" tab with day-by-day plans | ◐ | One day per area (`day.js`) | **Trips** (§6 #4): several days built from your saved places, grouped by area, closed places kept out, every stop sourced, one link for the whole trip. |
| Map/list split that updates on pan | ✅ | Atlas map-search (R7 B 94; SPEC-v3) | SPEC-v3 owns this. |

### 4.2 Map-led local guides and the big map apps

What they are known for in 2024–2026:
- saved lists, now **collaborative** with emoji votes (2024–25);
- AI that turns screenshots of social posts into a saved list (2025);
- **institutional restaurant-award data inside the map**, with award filters (2025);
- a private, on-device "visited places" log (2025);
- publisher-curated guides;
- KML/CSV import and export in personal map-collection apps.

| Their best feature | Us | Evidence | **The one-up** |
|---|:-:|---|---|
| Saved lists | ✅ | `saved.js`: named lists, map, export | Keep. Our list shows each place's sources and closure state, which theirs don't. |
| Collaborative lists with votes | ✕ (OOS as shared state) | ROUND-1 OOS row X-04 | A link-based group pick (§6 #12) gets most of the value statically. |
| Award filter from an institutional guide | ◐ | The source filter exists in the tray. There is no award badge or one-tap award filter. 1,069 + 65 places cite award sources | **Recognition layer** (§6 #1): award badges *and* "also recommended by" from the other sources. An award is one voice among several, never the only one. |
| Screenshot or social post → saved list (AI) | ✕ (OOS: needs an AI API) | — | **Paste a link** (§6 #6): paste any article or video URL into search. If it is one of our sources, you get every place it recommends, already pinned and checked. The lookup is deterministic, sourced and keyless. |
| Private "visited" log | ✅ | Been-there stamps (`saved.js`, `sheet.js`), on the device only | Keep. Add Been-there to the trip recap card (§6 #7). |
| Publisher-curated guides | ✅ | Source views (`#src=`): "All 100 of its numbered entries are here" | We beat them. Theirs is one publisher per guide; ours cross-references every publisher on one map. |
| Export (KML, GeoJSON) | ✅ | `saved.js`, `day.js` | Keep. |

### 4.3 The real-estate map-search pattern

What it is known for in 2024–2026:
- search as you move the map;
- drawing an area;
- **a commute-time filter**;
- saved searches with alerts;
- risk and data layers;
- searching several areas at once;
- conversational search (2025).

| Their best feature | Us | Evidence | **The one-up** |
|---|:-:|---|---|
| Search as you move, list follows map, pin → preview | ✅ | R7: map ↔ list 94; lane probe 99/99; SPEC-v3 slices 1–3 | SPEC-v3 owns this. It stays the navigation spine, as the owner asked. |
| Commute-time filter | ✕ | Near me gives distances from *your* location (SPEC-v3 §3.4) | **"Close by" from any place** (§6 #5): choose a hotel, a station or any place, and see what is within 5, 10 or 15 minutes' walk. It is straight-line ÷ 80 m/min, and the page says so. Only open, pinned places count. No key, no routing service. |
| Saved search with alerts | ◐ | The view goes in the URL (SPEC-v3 §3.5); per-city RSS and "What changed" exist | **Follow a city** (part of §6 #2): the RSS feed *is* the alert, surfaced as "Follow changes" on each city with a plain explanation. Push, email and accounts stay out of scope. |
| Data layers | ◐ | Street/Satellite and the Key | **Collection lenses on the map** go to SPEC-v3 §10 (W8 named it). The recognition and freshness layers (§6 #1, #2) give Atlas two layers no competitor has. |
| Draw an area | ✕ | — | **Rejected** (§8). Area chips plus "Close by" answer the travel question better than freehand drawing. |
| Compare side by side | ✕ | — | **Parked.** Homes are compared on attributes; places to visit aren't, and we hold no price or hours data to compare. |

### 4.4 Photo-led luxury travel magazines

What they are known for:
- annual, **dated, numbered lists**;
- full-bleed photography;
- a short critic's paragraph with a byline;
- print-like typography;
- "why go now" framing.

| Their best feature | Us | Evidence | **The one-up** |
|---|:-:|---|---|
| Full-bleed photography | ◐ | Heroes on 32 of 84 guides; 94 of 2,901 eligible places (R7) | W8 imagery owns this. |
| Critic's paragraph with a byline | ✅ | "Why it's here" + "Recommended by" + "Your guide's note" in the detail | We beat them: the byline is the *source*, and it links out. |
| Print-like layout | ✅ | Guidebook with chapters and a print stylesheet (D4) | **The dated edition** (§6 #10): a cover page per guide ("Tokyo · October 2026 edition · 488 places · 1 retiring"), credited photos in chapter openers (W8 FE-B 1), and a booklet print with every source URL and the method notes. A magazine prints its list once; ours is re-dated every time a check runs. |
| Dated annual list | ◐ | Status dates in the detail and masthead; "What changed" | The dated edition plus freshness (§6 #2, #10). |
| "Why go now" | ✕ | No sourced seasonal field | **Refused for now** (§8). Seasonal claims need a sourced field; collection ids like gardens don't say *when*. |

### 4.5 Trip-planner apps

What they are known for in 2024–2026:
- drag-and-drop day plans on a map;
- live collaboration;
- route optimisation and offline mode, often in a paid tier;
- export to the map apps;
- budgets and packing lists;
- AI itineraries and email/booking import (2025).

| Their best feature | Us | Evidence | **The one-up** |
|---|:-:|---|---|
| Day plans on a map | ◐ | One area per day; numbered route; move/remove; [day plan shot](one-up/tokyo-day-d.jpg) | **Trips** (§6 #4): several days from your saved places, each day one area, nearest-next order, legs in metres *and* walking minutes (straight-line ÷ 80 m/min, stated), closed and unpinned places refused with a reason. |
| Route optimisation | ◐ | Nearest next within a day | Part of Trips: the order is nearest-neighbour from the first stop, and the page says so. They charge for it; ours is free and explained. |
| Offline | ◐ | A service worker is registered; offline reload exists (`core.js`, `states.js`). Nothing tells you a city is saved for offline | **Offline city pack** (§6 #8): one "Keep Tokyo offline" button with its size and a done state. They charge for this. |
| Export to map apps | ✅ | KML; a map-app route; "Open in maps" | Keep. |
| Collaboration | ✕ (OOS as shared state) | — | Group pick by link (§6 #12). |
| Budget | ✕ (OOS) | We hold no sourced price data | Refused (§8). |
| AI itinerary | ✕ (OOS) | — | Our "suggested by the guide" day is built from sourced picks and says so ("Suggested by the guide from sourced picks — check hours before you go"). That is the honest version. |

### 4.6 Editorial city guides (critic-led city lists, the award guide's app, the hidden-gems atlas)

What they are known for in 2024–2026:
- a monthly heatmap of new openings;
- dated best-of lists and "updated" stamps;
- award markers;
- neighbourhood guides;
- a hidden-gems map with a "nearby" view;
- moderated reader suggestions.

| Their best feature | Us | Evidence | **The one-up** |
|---|:-:|---|---|
| Neighbourhood guides | ✅ | Areas, "A day in <area>", Guidebook chapters per area | Keep. Tiers are graded within each area (an editorial rule), so every neighbourhood has its own best, which city-wide lists don't. |
| "Updated" stamps | ◐ | Dates in the detail and masthead and on "What changed". Cards and the phone Atlas don't show them (R7 D: closure honesty) | **Freshness everywhere** (§6 #2). |
| Award markers | ◐ | Award sources are cited but not badged | **Recognition layer** (§6 #1). |
| New-openings heatmap | ✕ | No first-seen or opening dates in the data | **Refused as specified** (§8). The honest variant is "What changed this month", from the dated log (§6 #2). |
| Hidden gems | ✕ | — | **Local favourites lens** (§6 #9): places recommended *only* by local or independent sources (by source type) and not by the official tourism source. It is computed, labelled with its rule, and never a vibe. |
| Published method | ✅ | `how-we-choose.html` with live numbers (C #14) | We beat them: their method is a paragraph, ours is counted. |
| Moderated suggestions | ✅ | "Suggest a correction" | Keep. |

### 4.7 Short-video travel creators and social discovery

What they are known for in 2024–2026:
- creator attribution;
- location tags in videos;
- booking inside the video (2025–26);
- save-to-collection;
- share to stories;
- third-party apps that turn saved videos into maps.

| Their best feature | Us | Evidence | **The one-up** |
|---|:-:|---|---|
| Creator attribution | ✅ | Vetted creators sit in the sources registry (popularity verified per CLAUDE.md); 15 creator-video links in the data | **Recognition layer** (§6 #1): a "Seen in a creator's video" badge that links to the video, shown only where a vetted creator source exists. |
| Save from a video | ✕ | — | **Paste a link** (§6 #6). |
| Share to stories | ✕ | One OG image per city and country (90; C #27) | **Share cards** (§6 #7): a portrait image of a place, list, day or trip, drawn in the browser. It carries the source line, the photo credit and the "checked <date>" stamp, so the card stays honest after it leaves the site. |
| Trending | ✕ (refused) | We hold no engagement data | Refused (§8). "Most cited" is our honest stand-in. |
| Shareable collections | ✅ | `#list=`, `#day=`, `#src=` links | Keep. |

---

## 5. The other views, one by one

The owner asked that Atlas not take everything. This table checks each view against the best family for that view and
names its one-up. "W8" means a W8 brief already covers it; those aren't repeated in §7.

| View | Best competitor bar | Where we are (evidence) | Already in W8 / SPEC-v3 | **One-up proposed here** |
|---|---|---|---|---|
| **Landing** | The marketplace's destination-led home | Search-first hero, country chips, credited city photos, "Signatures across the guides" ([shot](one-up/landing-m.jpg)). Each city tile reads "194 places · Recommended by News 5 Cleveland · … + 14 more" | Type residue, radii (FE-B) | A **"This month in Cleo"** module: places re-checked, newly closed or retiring, with dates (§6 #2). A **"For you" rail across guides** once interests are set (§6 #3). |
| **Country hubs** | The map apps' curated guides | Hero photo, guides, collections ([shot](one-up/japan-m.jpg)); B-05 fails on 7 hubs (R7) | B-05 grid in the first screen; "Known for" widows (FE-B) | Cross-guide **recognition** counts (Japan today: 442 places cite an institutional restaurant-award source) and the **interest rail** (§6 #1, #3). |
| **Gallery** | The marketplace's grid | Category bar, rows, an "All N" grid, a lead card ([shot](one-up/tokyo-m.jpg)) | Polish a–h, food covers, motion (FE-A); photos (imagery) | **Recognition badges** and the **"checked" stamp** on cards (§6 #1, #2). **Source-led covers** for places without a photo (§6 #11). |
| **Place detail** | The magazine's critic page plus the map app's place card | Large media, Why it's here, Recommended by, Plan your visit, a sticky Save/Directions/Share bar, "No. 3 of 43 in Chiyoda-ku" ([shot](one-up/tokyo-sheet-d.jpg)) | Scrim, upscaling, rank denominator, no Directions on closed places (FE-A) | **"Close by"**: open places within 10 minutes' walk, split into sights and eat & drink (§6 #5). **"Recognised by"** (§6 #1). **Share card** (§6 #7). |
| **Guidebook** | The magazine's print issue | Contents first, lazy chapters, chapter maps, print ([shot](one-up/tokyo-guidebook-d.jpg)) | v2 audit, chapter photos, the price/rating note (FE-B) | **The dated edition**: a cover, a booklet print and a "since the last edition" page (§6 #10). |
| **Insights** | No competitor has this view | Seven SVG charts with tables: "What each area is for", "Who recommends each area", "How far you walk", "Closures, kept for the record" ([shot](one-up/tokyo-insights-d.jpg)) | v2 series tokens, tabular figures (FE-B) | A recognition chart ("Award-listed and most-cited, by area") that links to the lens (§6 #1). Insights stays our own invention. **Don't dilute it.** |
| **Saved / Your lists** | Map-app lists plus the marketplace wishlist | Named lists, Been-there, a map, KML/GeoJSON/JSON, `#list=` with "Save a copy" | Day flow walk-through (FE-A W8 1.2) | **"Make a trip from this list"** (§6 #4). **Group pick** (§6 #12). **Share card** (§6 #7). |
| **Day plans** | Trip-planner apps | One area, 4–6 stops, straight-line legs, share, KML, print, "Edit stops" ([shot](one-up/tokyo-day-d.jpg)) | build → share → reopen probe (FE-A W8 1.2); the Atlas day route | **Trips** spanning several days. **Walking minutes** next to the metres (§6 #4). |
| **"What changed"** | The editorial guides' monthly updates | Dated entries per city ("3 October 2026 · 47 checked"), RSS ([shot](one-up/changes-m.jpg)) | B-20/B-23 on those pages (FE-B) | Surface it: a **"Follow changes"** explainer and a **"retiring soon"** rail on the city page (§6 #2). |
| **Share cards** | Social stories | 90 OG images (city and country) | — | **Portrait share cards** drawn in the browser for a place, list, day or trip (§6 #7). |

---

## 6. Ranked one-up opportunities

**Score = user value (1–5) × evaluator impact (1–5) ÷ effort (S = 1, M = 2, L = 3).**
- *Evaluator impact* cites the R7 rows that move: A/B sub-criteria, the C table, D rows and the D1–D13 checklist.
- **C is fixed at 35 rows and stands at 96.** These items mostly move **D, B and D13**, not C. The ≈ overall figures are my
  estimates from the R7 weights (A 40 %, B 25 %, C 20 %, D 15 %), not evaluator scores. They are optimistic in total.

| # | Opportunity | Families beaten | V | I | E | **Score** | Rows it moves (R7) | ≈ overall |
|---:|---|---|:-:|:-:|:-:|---:|---|---:|
| 1 | **Recognition layer**: award, "most cited" and creator-video badges, computed from source keys, each linking to its source; plus a filter and a lens | rental marketplace, map apps, editorial guides, creators | 4 | 4 | S | **16** | D sourced picks 94; D13 trust 8.5; C #13 kept; K1 | +0.15 |
| 2 | **Freshness everywhere**: "checked <date>" on cards; a "This month" module on the landing; a city "retiring soon / recently closed" rail; "Follow changes" (RSS) | editorial guides, real-estate alerts | 3 | 4 | S | **12** | D closure honesty 95; D13 trust; B mobile 88 (with R7 gap 4d) | +0.15 |
| 3 | **Your interests follow you**: the picker's choices carry across guides; a "For you" rail on the landing and hubs; ★ rails ordered by your interests; every lift says "First because …" | rental marketplace home, map apps | 4 | 4 | M− (1.5) | **10.7** | D interest triad 81; B discovery 91; D13 Gen Z 7.5 | +0.2 |
| 4 | **Trips**: several days from your saved places or a list, one area per day, nearest-next order, walking minutes, closed places refused, one link, booklet print, KML | trip planners, rental marketplace's trips tab | 5 | 4 | M | **10** | D "Your guide" and day plans 79 (the lowest D row); B discovery; D13 | +0.25 |
| 5 | **"Close by" from any place**: a walking radius (5/10/15 min, straight-line ÷ 80 m/min, stated) from any place, in the detail as a section and on Atlas as a ring | real-estate commute filter, hidden-gems "nearby" | 5 | 3 | M− (1.5) | **10** | B detail 90 and map ↔ list 94; D verified pins 92; PANEL T3 (best food within 15 min) | +0.1 |
| 6 | **Paste a link**: search takes an article or video URL; if it is a source, open its source view (every place it recommends, pinned and checked) | map apps' screenshot import, creator-to-map apps | 3 | 3 | S | **9** | D sourced picks; B discovery; C #15 kept | +0.05 |
| 7 | **Share cards**: a 1080×1920 portrait image of a place, list, day or trip, drawn on canvas in the browser, carrying the source line, photo credit and checked date | short-video and social sharing | 4 | 3 | M | **6** | D13 Gen Z 7.5; A wanderlust 83; C #27 kept | +0.1 |
| 8 | **Offline city pack**: "Keep <city> offline" with its size and a done state, using the existing service worker | trip planners' paid offline mode | 3 | 2 | S | **6** | B mobile 88; C #28 kept | +0.05 |
| 9 | **Local favourites lens**: places cited only by local or independent sources (by source type), never by the official tourism source; the rule is labelled | editorial guides' and the hidden-gems atlas's "hidden gems" | 4 | 3 | M | **6** | D interest triad; B discovery; Z2 persona | +0.1 |
| 10 | **The dated edition**: a Guidebook cover per guide, a "since the last edition" page from the change log, a booklet print with photos, sources and method | photo-led magazines' dated lists | 3 | 3 | M | **4.5** | A luxury + fun 85; A imagery; D4 | +0.05 |
| 11 | **Source-led covers**: a no-photo cover that sets the first source's name and the ★/Must-see glyph in display type | marketplace cards, magazine covers | 3 | 3 | M | 4.5 | K1; A imagery 75; D sourced | +0.05 |
| 12 | **Group pick by link**: friends mark ♥ or ✕ on a shared list and send a link back; the lists merge and tally on your device | rental marketplace and map-app collaborative lists | 3 | 2 | M | 3 | D "Your guide"; not scored in C (OOS X-04 is about shared state) | +0.03 |

**Ties and judgement.** #4 Trips scores just under #3 by the formula. It is the single largest D lever, because it lifts
the lowest D row, so if a lane can take only one M item, take Trips. #11 overlaps W8's food-cover brief: hand it to the
designer as an option inside that brief, not as new work.

**Total if 1–10 land: about +1.2 overall**, mostly D (+5–6 dimension points) and B (+1–2), plus D13's two sub-criteria
moving toward 9. That is additive to R7's ≈ 3.0 recoverable through its own gaps, and it doesn't compete with them for
the same lanes in the same order (§7).

### Hand-off to SPEC-v3 §10 "One-up" (Atlas lane)

W8 named §10 but it isn't written yet. From this audit, the Atlas-side one-ups are:
- (a) the **recognition** and **freshness** badges in the preview card and carousel card, not on pins, which keeps §1's
  calm;
- (b) the **"Close by" ring** from a selected place (§7 W9-5);
- (c) **collection lenses** as a map layer;
- (d) a **trip day** drawn on the map with walking minutes per leg;
- (e) the shared view link reopening a trip day.

None of these changes SPEC-v3 slices 1–5. They belong after slice 3.

---

## 7. W9 brief proposals (top 10)

**Shared rules for every brief:**
- the hard rules in CLAUDE.md and W8;
- every place kept, closures flagged, attribution visible;
- no fabrication, no hours or open-now, no prices or budgets;
- no booking, no key, no CDN for content, OSM/Esri tiles only;
- every `localStorage` call through `Cleo.store`;
- rule 6;
- every label through `casing.js` `sentence()`;
- validate, npm test and beta:check green before each push.

**Sequencing:** none of these starts before the lane's W8 / R7-gap items are done. They queue behind W8 and don't
replace it.

### W9-1 · Recognition layer (FE-A, with platform and designer)

- **What:** a build-time `rec` field per place, made only from its source keys:
  - `award` when it cites an institutional-award source. The key list lives in `data/sources.json` or a beta map, never
    in a dish or name heuristic;
  - `video` when it cites a vetted creator-video source;
  - `cited: n` when it has ≥ 3 distinct sources.

  Cards, the detail ("Recognised by"), the preview card (Atlas, via SPEC-v3 §10) and the tray (a "Recognised" filter
  group) show it. Insights gets one chart, "Recognised places by area".
- **Acceptance:**
  1. A test over all 8,458 places: every badge is backed by a source key on that record, and 0 records carry a badge
     without one.
  2. Every badge links to the source (`#src=` or the URL).
  3. A closed place shows its badge only inside the closed treatment, never as a live recommendation.
  4. G6 is unchanged. The filter keeps every place reachable ("Show all").
  5. On every guide, the "award" count equals the count from the platform's source index.
- **Depends on:** platform (the source-key → badge map, and the source types used by W9-9); the designer (the badge, one
  glyph each, sentence case).

### W9-2 · Freshness everywhere (FE-A for cards and the city rail, FE-B for the landing module and "What changed")

- **What:**
  - a quiet "Checked <d Mon>" line on each card (from `pv.checked`);
  - the landing module **"This month in Cleo"**: counts of re-checked, newly closed and retiring places, from
    `changes.json`, each linking to its city's "What changed";
  - a city rail **"Recently closed or retiring"**, from the changes log's `closed` entries and notes such as the Tokyo
    statue's retirement, sourced and dated;
  - a **"Follow changes"** link on each city that explains the RSS feed in one plain line.
- **Acceptance:**
  1. Every rendered card's date equals its record's `pv.checked`. A test samples 84 pages.
  2. Every number in the landing module equals the sum from `changes.json`.
  3. Every rail item carries its source and date.
  4. The feed link resolves to `feeds/<city>.xml`.
  5. No text anywhere implies open now or hours.
- **Depends on:** R7 gap 4d (Atlas phone "last checked") stays with the Atlas lane; use the same string.

### W9-3 · Your interests follow you (FE-B for the landing and hubs, FE-A for the city rail order)

- **What:** the interests set in `foryou.js` (`store 'interests'`) apply on every guide, hub and the landing.
  - The landing and hubs get a **"For you" rail**: the top open places across guides for those interests, keyed on
    collection and cuisine ids only (the Wenwen rule).
  - On city pages, ★ and collection rails order by your interests.
  - Every lifted item says "First because you chose <interest>".
- **Acceptance:**
  1. With interests set, the place set is identical before and after on every page; only the order changes (a test).
  2. 0 lifts come from a dish or name keyword (the test reads the mapping table).
  3. With storage throwing, pages render unchanged.
  4. The rail never includes closed places.
  5. Clearing interests restores the default order exactly.
- **Depends on:** the platform's cross-guide index (`search.json` or a small `fy.json`). FE-A W8 casing helper.

### W9-4 · Trips (FE-A, with the designer; the Atlas lane draws the route)

- **What:** "Make a trip" from Saved or any list. You choose a number of days (1–7). The tool groups open, pinned places
  by area into days of 4–6 stops, ordered nearest-next. Each leg shows "650 m · 8 min walk (straight-line)".
  - Closed or unpinned places are listed under "Left out" with the reason.
  - The whole trip is one link (`#trip=` with ids and day breaks only), plus print as a booklet, KML, and a map-app route
    per day.
  - It builds on `day.js`; a single area still works as today.
- **Acceptance:**
  1. Build → share → reopen in a fresh context restores identical days and order (a probe).
  2. 0 closed places in any day; each left-out place is named with its reason.
  3. Every stop shows its first source.
  4. Walking minutes = round(metres ÷ 80), with the assumption printed once per trip.
  5. Keyboard-complete at 390 and 1440, light and dark.
  6. Print fits one day per page.
  7. Unknown ids are reported, never dropped silently (the `saved.js` rule).
- **Depends on:** FE-A W8 1.2 (the day flow) landed first. The Atlas lane draws a trip day after SPEC-v3 slice 3.

### W9-5 · "Close by" from any place (FE-A for the detail section, Atlas for the ring)

- **What:**
  - **Detail:** a section "Close by · within 10 min walk" with up to 3 sights and 3 places to eat and drink, open and
    pinned, nearest first, each with a distance.
  - **Atlas:** "Show what's within … of here" on a selected place draws a 5/10/15-minute ring and filters the list to
    it. It uses the same distance code as Near me (SPEC-v3 §3.4) with the origin swapped.
- **Acceptance:**
  1. Every listed place is open, has a high- or medium-confidence pin, and lies within 800 m (10 min) straight-line of
     the origin (a test on 84 pages × 5 places).
  2. The section states "straight-line, about 80 m a minute".
  3. Where none qualify, it says so instead of widening silently (stated gaps).
  4. Atlas: the list count equals the in-ring count, and "Show all" still reaches every place.
  5. Under reduced motion, there is no animated ring.
- **Depends on:** SPEC-v3 §3.4 distance helper (Atlas lane). The pin `confidence` must be in the page JSON (platform; it
  is already in `pv.pin`).

### W9-6 · Paste a link (FE-B, search)

- **What:** when the search input holds a URL, normalise it (host and path, no query) and match it against the sources
  index.
  - A match on a source's site opens that source's view: "Everything <source> recommends, in N guides".
  - A match on a specific source URL also lifts the places citing exactly that URL.
  - No match says so plainly and offers "Suggest this source" (the existing issue flow).
- **Acceptance:**
  1. For 20 sampled source URLs, the right source view opens with the right count.
  2. An unknown URL makes 0 network calls beyond the site's own JSON.
  3. Nothing is fetched from the pasted URL (WebFetch-equivalent calls are forbidden).
  4. The empty state follows VOICE.md.
- **Depends on:** `search.json` carrying source URLs (platform, if they aren't there yet).

### W9-7 · Share cards (FE-A, with the designer)

- **What:** "Share as image" on the place detail, a list, a day and a trip. A 1080×1920 PNG is drawn on `<canvas>` from
  local assets only:
  - the photo where one exists, with its credit printed on the card;
  - otherwise the calm cover;
  - the name, area, "Recommended by <source> + n" and "Checked <date>";
  - for a list or day, a stop list and the route drawn from our own pins (no tiles).
- **Acceptance:**
  1. Every card carries the source line and checked date; every photo card carries its credit (pixel probe or alt
     text).
  2. A closed place's card shows "Closed · kept for the record" and no call to visit.
  3. 0 off-origin requests.
  4. Web Share with files where supported, download otherwise.
  5. It works with the map library blocked.
- **Depends on:** imagery (the photo plus its credit available same-origin); designer (layout and type).

### W9-8 · Offline city pack (platform)

- **What:** "Keep <city> offline" on each city page. It caches the page, its JSON, fonts, its photos at 500w and the
  Guidebook, shows the size before you tap, and then "Saved for offline · <date>". "Remove" frees it.
- **Acceptance:**
  1. After keeping Tokyo and going offline, Gallery, Guidebook and detail reload with every place present, and Atlas
     shows "Map unavailable · all N places listed".
  2. The stated size is within 10 % of the bytes cached.
  3. Storage failures leave the page working.
  4. No tiles are cached beyond what the browser already holds (tile policy).
- **Depends on:** `sw.js` and `offline-check.js` (existing).

### W9-9 · Local favourites lens (platform for source types, FE-A for the lens)

- **What:** platform carries each source's type into the page JSON, mapped from the registry's existing `sourceTypes` ids
  (for example `local_creator`, `famous_creator`, `local_newspaper`, `alt_weekly`, `state_tourism`, `local_cvb`) and grouped
  into official · press · local press or writer · vetted creator · institution or award · encyclopaedia. Types come from
  the registry, never guessed.
  - The lens "Local favourites" shows open places whose sources are all local press, local writers or vetted creators,
    and none official.
  - Its rule is printed at the top.
- **Acceptance:**
  1. Every source in the beta has a type, each traceable to `data/sources.json`. Today the page JSON source entries carry no type field. The registry defines 27 `sourceTypes` (local and famous creators, award bodies, tourism offices and more), but its `cities` block covers 31 registry cities, not every beta guide.
  2. Every place in the lens satisfies the printed rule (a test).
  3. A guide where fewer than 5 places qualify shows a stated gap, not a padded lens.
- **Depends on:** data typing in `data/sources.json`. If that file is live-pipeline scope, the owner must approve the
  field; otherwise keep the map beta-side.

### W9-10 · The dated edition (FE-B, with the designer and imagery)

- **What:** each Guidebook opens with an edition cover: the guide name, native name, "October 2026 edition", place
  count, closed count and the newest check date, over the hero photo where one exists.
  - A "Since the last edition" page lists the dated changes from `changes.json`.
  - "Print as booklet" lays out cover, contents, chapters with chapter photos, "Close by" summaries, all sources with
    URLs, and the method notes verbatim.
- **Acceptance:**
  1. Every number on the cover equals the page JSON.
  2. The edition month equals the newest `changes` date.
  3. Print preview: the cover is on its own page, every source URL is printed, and 0 elements are clipped (`test-views`
     print checks extended).
  4. No photo on food places, closed places or Vietnam (the credit gate).
- **Depends on:** W8 FE-B 1 (Guidebook on v2 with chapter photos); imagery coverage.

---

## 8. Refused, and why

These are features the families are known for that we deliberately **don't** build. Each refusal follows a hard rule
(CLAUDE.md, ROUND-1 OOS rows). Saying so is part of the product.

| Feature | Family | Why not | The honest substitute |
|---|---|---|---|
| Opening hours, "open now", "tonight" filters | map apps, editorial guides | Hours aren't sourced; inventing them is fabrication (X-06). PANEL-R0's "tonight" task gap stays unanswered by design | "Check before you go"; "Checked <date>" (W9-2) |
| Prices, budgets, price filters | trip planners, marketplace | No sourced price fields (LP-03); the D-39 note labels quoted prose instead | — |
| Booking, reservations, in-video booking | marketplace, award guide app, short-video platforms | Payments and a server (X-02); affiliate is an owner decision (D-19) | Official-site links |
| Ratings, reviews, UGC scores | marketplace, map apps | Contradicts sourced trust (X-03); ratings may *measure* merit in research but never show as a recommender | Recognition layer (W9-1) |
| "Trending", save counts, popularity | short-video platforms, marketplace | No engagement data; manufactured urgency is ruled out (C #16) | "Most cited" (W9-1) |
| New-openings heatmap | editorial guides | Records carry no first-seen or opening date, so "new" would be invented | "This month in Cleo" from the dated log (W9-2) |
| "Why go now" / seasonal picks | magazines | No sourced seasonal field | Revisit only if the data pipeline adds one, with a source |
| AI concierge, AI itinerary, screenshot import | map apps, trip planners, real-estate search | Needs a backend and an API key; risk of unsourced answers (X-05) | Paste a link (W9-6); "suggested by the guide" days |
| Live collaboration, accounts, sync | marketplace, trip planners | Static hosting (X-01, X-04) | Group pick by link (§6 #12); JSON backup and import |
| Freehand draw-an-area | real-estate search | Low value for travel next to area chips; costly on touch; adds an accessibility path to maintain | "Close by" ring (W9-5) |
| Embedded videos | short-video platforms | Third-party scripts on the page | A plain link to the video (W9-1 badge) |
| Push or email alerts | real-estate search | Server and third party (X-07–X-09) | RSS "Follow changes" (W9-2) |
