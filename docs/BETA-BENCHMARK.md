# Beta benchmark — "done" means we match or beat these

> **Owner:** PM lane. This is the bar the beta program is judged against (charter "Done"). It is built from the
> UX teardown's must/should/could (§8) and teardown matrix (§3), the SWOT's ranked gaps (§5) and roadmap (§8),
> and the measured baselines in UX §7. Rows change only through a new entry in
> [`BETA-DECISIONS.md`](BETA-DECISIONS.md).
>
> **Measured by:** `npm run beta:metrics` (M0-04) unless the row says otherwise. Mobile = 390×844 DPR3 touch;
> desktop = 1440×900. A row **passes** when it holds on every page of the pilot set (D-27), and for the program
> to finish, on **every** beta page.
>
> Wave 0 · 2026-10-10.

## 1. Hard gates (any failure blocks a milestone, whatever else passes)

| # | Gate | How it's checked |
|---|---|---|
| G1 | Every beta page carries exactly the P/F records (count **and** names) of its live counterpart | Generator assert; `beta:metrics` reachability = 100% |
| G2 | `npm run validate` and `npm test` pass; `check-google.py` passes on `beta/` | CI commands |
| G3 | QA harness: 0 FAIL on beta, mobile and desktop | `npm run qa` |
| G4 | All content renders with every off-origin request blocked | QA offline loads |
| G5 | No fabricated data: no ratings, reviews, prices, hours, popularity or urgency; no stock/AI/scraped photos | Voice lint (M0-05) + PM code review + DES image audit |
| G6 | "Recommended by" on 100% of cards; closed places present and flagged; stated gaps verbatim | `beta:metrics` card audit |
| G7 | No third-party name, logo, wordmark or trade dress | DES review |
| G8 | Every `localStorage` call in try/catch; works with storage throwing | QA fixture |

## 2. Measured benchmark

Baselines are from UX §7 (live/beta Cleveland and Tokyo, Salon Tokyo). "Leader" is the pattern the row answers.

### M1 — look like the leaders

| # | Benchmark | Target | Beta today | Salon | Leader (research) |
|---|---|---|---|---|---|
| B-01 | Screens to first place card (mobile) | **≤ 1.0** | 3.1 | 0.9 | Baymard, Klook, Airbnb (UX P1, M1) |
| B-02 | Masthead height (mobile) | **≤ 0.6 screen** | ~1 screen | — | UX M1 |
| B-03 | Interactive controls above first card (mobile) | **≤ 14** | 55 | 14 | UX M4 (≤ 15) |
| B-04 | Collection rail visible on first mobile screen; ★ first and larger; counts computed | **Yes** | No (chips) | No (dropdown) | Airbnb Categories, Apple Guides, Eater (P2, M2) |
| B-05 | Hub: city cards visible above the fold (mobile) | **≥ 2** | — | 0 | UX M1, §7.2(2) |
| B-06 | Desktop split view with sticky map, two-way hover/click sync | **Yes** at ≥ 1024 px | No | Yes | Baymard split view, Kayak (P11, M3) |
| B-07 | Mobile: list first, full-screen map toggle, pin → sheet with detents + visible Close; Back closes | **Yes** | No | Partly | NN/g, WWDC21, Trip.com/Airbnb (P13) |
| B-08 | Floating elements covering card titles | **0** over 20 scroll positions | — | > 0 ("Map · 488" pill) | UX M8 |
| B-09 | Pin numbers match card numbers in an area; ordering rule stated | **Yes** | No | No | Eater 38 (P12) |
| B-10 | Filters in a tray with "Show N places" and removable applied chips; every live filter reachable | **Yes**, parity 100% | Always-open wall | Partly | NN/g faceted (P15, M4) |
| B-11 | Tier shown as 3 original glyphs on pin, card and sheet, linked to "How we choose" | **Yes** | Text badge | Word | Michelin, Guest Favourite, Trip.Best (P18, P19, M5) |
| B-12 | Closed records showing a tier badge | **0** | > 0 (Heinen's) | > 0 | UX §7.1(7), M5 |
| B-13 | Source → "Everything {source} recommends here (n)" view, shareable URL | **Yes**; Cleveland News 5 = 100, There She Goes = 23 | No | No | Apple Maps Guides, Atlas Obscura (P20, M6) |
| B-14 | Visual anchor on every card with no photo: typographic cover + area colour + glyph | **100% of cards** | 0% | 0% | Louis Vuitton, Wallpaper*, Herb Lester (P10, S1) |
| B-15 | Map art from verified pins (area silhouettes, sheet locator) | **Yes**, OSM credit where OSM geometry is drawn | No | Schematic | Herb Lester; OSMF (UX §6 B) |
| B-16 | Cards per mobile screen in the list | **≥ 2** | ~1 | ~2 | Klook, Airbnb |
| B-17 | Detail sheet: all sources, directions, pin confidence + date, status date, sticky Save · Directions · Share, focus trap | **Yes** | Popups | Mostly | Salon §4(c); UX §5 |
| B-18 | Font families rendered | **≤ 2** (+ CJK fallback) | 4 | 2 | Time Out, Aman (P6, M7) |
| B-19 | Uppercase text-node share | **< 15%** | 701 nodes (high) | 134 nodes | UX M7 |
| B-20 | Tap targets < 44×44 px (prose links exempt) | **0** | 832 / 841 | 99 / 207 | UX M8; QA D1 |
| B-21 | Smallest text | **≥ 12 px** (body ≥ 16 px) | 9.5 px | — | QA D2 |
| B-22 | Horizontal overflow at 360 and 390 px | **0** | > 0 | 0 | UX M8 |
| B-23 | Contrast, both themes (token script + axe) | **AA**; axe serious/critical = 0 | — | — | Hilton, Booking, Airbnb (S8) |
| B-24 | Per-city skin: Tokyo ≠ Cleveland ≠ Chinatown (accent + motif differ); accent only on actions/distinctions | **Yes** | Same brass | Same | The Hoxton, Belmond, Expedia (P7, P8, S2) |
| B-25 | Every count and date on screen computed by the generator; hub counts == page counts | **100%** | Hand-typed "last verified" | Drift found | UX §5 counts; SWOT roadmap #6 |
| B-26 | Method page live, linked from every tier glyph | **Yes** | No | No | Trip.Best, Infatuation (P19) |
| B-27 | Every live beta-scope page regenerated by the new engine | **100%** of live counterparts | 15 / 33 cities mirrored (QA D7) | 4 prototypes | — |

### M2 — knows you, shares well

| # | Benchmark | Target | Leader (research) |
|---|---|---|---|
| B-30 | Per-place deep link `#p=<id>` opens the sheet; 100% of records have a stable id | **Yes** | Everyone (SWOT gap #1) |
| B-31 | Share place / collection / source / list (Web Share or copy) restores the same view | **Yes** | Google Lists, Michelin (P22) |
| B-32 | Saved lists on device: heart, named lists, been-there, export/import, works with storage blocked | **Yes** | Klook heart, GetYourGuide wishlists, Atlas Obscura (P22) |
| B-33 | Interest picker reorders, never hides (record set identical with and without), with "First because" line | **Yes** | Ask Bonvoy, Mindtrip (P17, S6) |
| B-34 | Day plan per area: 4–6 stops, numbered route line, straight-line legs labelled, closed and unpinned excluded, shareable | **Yes** | Wanderlog, Four Seasons Go Local (P23) |
| B-35 | JSON-LD `ItemList` valid; item count == open records; no rating, review, price or hours fields | **Yes** | Michelin, OTAs (SWOT gap #5) |
| B-36 | OG/Twitter card on every city and hub page, 1200×630, data-derived image | **100%** | SWOT gap #4 |
| B-37 | Cross-city search from the hub, diacritic-insensitive, ≤ 100 ms per keystroke | **Yes** | SWOT §2 |
| B-38 | Status-checked date in sheet; "Recently closed" collection per city | **Yes** | SWOT roadmap #5 |

### M3 — on the street

| # | Benchmark | Target | Leader (research) |
|---|---|---|---|
| B-40 | Offline reload of a visited city: every place, list and sheet works; no bulk tile prefetch | **Pass** | Spotted by Locals; Wanderlog Pro (UX C2; SWOT gap #7) |
| B-41 | Opt-in "Near me": distance on cards, sort by distance, graceful on denial, position never stored | **Yes** | NN/g; Michelin near-me (P3, S7) |
| B-42 | i18n: pseudo-locale shows 0 hard-coded strings; `lang`/`hreflang` correct | **Pass** | SWOT gap #9 |
| B-43 | Commons landmark images: TASL on 100%, 0 licence defects, none in Vietnam | **Pass**, or explicitly blocked on LP-02 | UX §6 D; SWOT gap #6 |
| B-44 | Largest page (NYC): first card ≤ 1.0 s at 4× CPU throttle; initial DOM ≤ 3,000 nodes; reachability 100% | **Pass** | QA D4, D5 |
| B-45 | Reduced motion respected on every animation | **Pass** | Airbnb accessibility (P9) |

### M4 — Round 3 view styles (added by D-33, 2026-10-10)

| # | Benchmark | Target | Pattern |
|---|---|---|---|
| B-46 | View switcher: 4 labelled views; switching keeps filters, search, open sheet and count | **Yes**; controls above first card still ≤ 14 | Segmented view control over one record set |
| B-47 | `view=` in the hash: default omitted, validated, round-trips with every other key | **Pass** (round-trip test, every view × lens) | Shareable view state |
| B-48 | Every view reaches every record: scroll/Show all, deep link, search, filter, print, JS-off | **100 %** per view on 84/84 pages; paged views show page numbers, "all N places" and Show all | Rule 1 (keep every place) |
| B-49 | Insights charts account for 100 % of records (closed/unpinned footnoted), act as filters, chart only data fields | **Yes**; 0 rating/price/popularity fields | Captioned hand-built charts |

## 3. Teardown-matrix target

The UX §3 matrix scored our beta ✕ or ◐ on all 12 columns. **Done** = the beta row reads ● on every column we can
deliver statically, and the remainder is explicitly deferred.

| Column | Beta today | Salon | **Target** | Delivered by |
|---|---|---|---|---|
| P1 inventory first | ✕ 3.1 screens | ● 0.9 | **●** ≤ 1.0 screen, hub ≥ 2 cities | M1-01, M1-17 |
| P2 collection rail | ✕ chips | ◐ | **●** ★ rail in hero | M1-02, M1-03 |
| P3 contextual home | ✕ | ◐ | **●** Your list / ★ / Near you (data-backed only) | M2-11, M3-02 |
| P7 restraint / local skin | ◐ | ● | **●** per-city skin | M1-14 |
| P10 imagery strategy | ✕ none | ✕ | **●** type + map art; Commons later | M1-13, M3-04 |
| P11 map–list sync | ◐ | ● | **●** | M1-04, M1-05 |
| P13 POI sheet | ◐ popups | ● | **●** | M1-05, M1-12 |
| P18 badge ladder | ◐ text | ◐ seal | **●** 3 glyphs + method | M1-08, M1-09 |
| P20 attribution as navigation | ✕ | ◐ | **●** source views | M1-10 |
| P22 save/share | ◐ | ● | **●** lists + share URLs | M2-02 – M2-04 |
| P23 itinerary | ✕ | ● | **●** day plans | M2-06 |
| P17 AI/personalisation (grounded) | ✕ | ● reorder-only | **●** reorder-only, never hides | M2-05 |

## 4. Must / should / could coverage (UX §8)

| Research item | Backlog | Milestone |
|---|---|---|
| M1 inventory-first | M1-01, M1-17 | M1 |
| M2 collections front door | M1-02, M1-03 | M1 |
| M3 map and list as one | M1-04, M1-05, M1-06 | M1 |
| M4 filter tray | M1-07 | M1 |
| M5 tier ladder + method | M1-08, M1-09 | M1 |
| M6 attribution as navigation | M1-10 | M1 |
| M7 type and colour system | M0-01, M1-15 | M0–M1 |
| M8 mobile ergonomics | M1-16 | M1 |
| M9 no manufactured urgency | G5, M0-05 | always |
| S1 visual anchor without photos | M1-11, M1-13 | M1 |
| S2 per-city skin | M1-14 | M1 |
| S3 functional delight | M1-14, M3-05 | M1/M3 |
| S4 your list and your day | M2-03, M2-04, M2-06 | M2 |
| S5 voice guide | M0-05, M1-19 | M0–M1 |
| S6 "for you" reorders | M2-05 | M2 |
| S7 contextual modules | M2-11, M3-02 | M2–M3 |
| S8 accessibility statement | M2-12 | M2 |
| C1 Commons images | M3-04 (LP-02) | M3 |
| C2 offline pack | M3-01 | M3 |
| C3 night edition | M0-01, M1-15 (D-03) | M1 |
| C4 conversational concierge | X-05 deferred | — |
| C5 collaborative votes | X-04 deferred | — |

**SWOT gaps:** #1 permalinks → M2-01/02 · #2 concierge → M2-05 · #3 itineraries → M2-06 · #4 mobile → M1 ·
#5 structured data → M2-07/08 · #6 photos → M1-13 + M3-04 · #7 PWA → M3-01 · #8 hours/price → X-06 + LP-03 ·
#9 multilingual → M3-03 · #10 affiliate → D-19 (not in beta) · #11 changelog → M3-07 · #12 accounts → X-01 ·
#13 UGC → X-03 · #14 checkout → X-02.

## 5. Finish line

The program is **done** when:
1. Hard gates G1–G8 hold on every beta page.
2. Every B-row in §2 passes on every beta page (B-43 may instead be "blocked on LP-02", stated).
3. The §3 matrix target row is all ● (or deferred with a reason in the backlog).
4. The designer and PM sign a side-by-side review of the pilot set against the teardown leaders (Airbnb
   Experiences, Apple Maps Guides, Aman/Rosewood, Eater 38, Michelin, Wanderlog) and record it in BETA-LOG.
