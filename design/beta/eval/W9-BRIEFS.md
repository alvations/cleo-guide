# Wave 9 briefs: one-up features across every view

Source: `design/beta/eval/ONE-UP.md` §7 (product lane), answering the owner's direction to take the best features from the competitors and put them together to one-up every one of them, keep the map-search navigation, and not neglect the other features.

The full acceptance for each item is in ONE-UP.md §7 (W9-1 … W9-10). §8 lists what we refuse and why:
- hours, open-now and "tonight";
- prices and budgets, booking, ratings and reviews;
- trending and save counts;
- new openings (no first-seen dates);
- unsourced seasonal "go now";
- AI itineraries, live collaboration, freehand draw, embedded video, push alerts.

The refusals stand. The hard rules apply as always (CLAUDE.md, rule 6, sentence case).

**Order of work in each lane:**
1. R7 QA re-sign rows.
2. Atlas panel findings.
3. W8 parts 1–2.
4. W9.

W9 is never a reason to delay the first three. Each W9 item ships behind its own test and lands only with all gates green.

| Item | Owner | Notes |
|---|---|---|
| **W9-1 Recognition layer** (award, "cited by n" and creator badges from source keys only, each linked to its source; a filter; an Insights chart) | platform (data: badge derivation from source keys, tests) → FE-A (card and detail UI) → FE-B (Insights chart) | Badges come only from data we hold. Nothing inferred. |
| **W9-2 Freshness everywhere** ("Checked <date>" on cards; landing module "This month in Cleo" from changes.json; city "recently closed" rail; "Follow changes" RSS) | FE-A (cards, city rail), FE-B (landing module, RSS) | No invented "new openings". |
| **W9-3 Your interests follow you** (the picker carries across guides; a "For you" rail on landing and hubs; reorder only, with "First because …") | FE-B (landing, hubs), FE-A (city rail order) | Keyed on ids; storage in try/catch; never hides a place. |
| **W9-4 Trips** (multi-day plans from Saved or a list; one area per day, nearest-next; closed places refused with a reason; one `#trip=` link; booklet print; KML) | **FE-C** (new lane), with the designer; the Atlas lane opens a trip day in day mode | Reuses the §10 walking-time helper (straight-line, labelled). |
| **W9-5 "Set as my base"** (any place becomes your base; every card shows distance and walk time from it; Atlas ring filter 5/10/15 min, with the assumption stated) | **FE-C** (cards and detail via FE-A's hooks), Atlas FE-2 (ring) | The persistent form of §10 "Near here". |
| **W9-6 Paste a link** (a source URL opens that source's places; nothing fetched from the URL) | FE-B (+ platform for the source index) | |
| **W9-7 Share cards** (portrait PNG drawn on canvas for a place, list, day or trip, with the source line, photo credit and checked date; 0 off-origin requests) | **FE-C**, with the designer (+ imagery for credit text) | |
| **W9-8 Offline city pack** ("Keep <city> offline" with its size and a done state, using the existing service worker) | platform | Content must never depend on it. |
| **W9-9 Local favourites lens** (only places cited by local press, writers or vetted creators; the rule printed) | platform (source types) + FE-A (lens) | Beta scope only. Where the source-type registry doesn't cover a guide, the lens is absent for that guide, with a stated gap. Typing more sources in live `data/` waits for the owner. |
| **W9-10 Dated edition** (Guidebook cover "October 2026 edition · N places · n retiring"; a "since the last edition" page; booklet print with photos, sources and method) | FE-B, with the designer and imagery | |

**FE-C (new lane):** W9-4, W9-5 and W9-7. Build in new modules (`trip.js`, `base.js`, `share-card.js` or similar) with small documented hooks into FE-A's card, detail, day and saved code, and the Atlas lanes' map code. Agree file ownership with FE-A, Atlas FE-1 and Atlas FE-2 before editing shared files.
