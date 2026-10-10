# Evaluation round 1 — independent evaluator

> 2026-10-10 · evaluator lane (no build lane) · session_01PCNcUkfa5S1N1BKGzZA4xx
> **Measured:** R1 is the beta at `65e93e9`, after the wave-1 merges (FE-A `ab80b44`, QA run 2 `3fe6526`). `npm run beta`
> regenerated it byte-identically: 94 pages, 84 place pages, 8,458 places, beta == live.
> **Baseline:** R0 is the beta at `ca70e53`, the last deploy, read with `git archive ca70e53 beta`. R0 has no Japan hub, saved
> page, method page or day plan. Those R0 cells show "not in this round".
> **Rubric:** [`docs/BETA-PROGRAM.md` → Evaluation rounds](../../../docs/BETA-PROGRAM.md#evaluation-rounds--5-rounds-to--8090--owner-instruction-2026-10-10),
> [`docs/BETA-BENCHMARK.md`](../../../docs/BETA-BENCHMARK.md), and the research teardown
> ([UX](../../research-2026-10/ux-competitive/README.md), [SWOT](../../research-2026-10/swot/README.md)).

## Verdict

**Goal not met.** R1 scores **66.5 / 100** overall, with **A = 60** and **C = 66**. The goal is ≥ 80 overall, with A ≥ 80 and C ≥ 80.

R1 more than doubles R0 (31). The beta now has the leaders' structure:
- inventory first;
- a collection rail;
- a filter tray with a live count;
- a complete detail sheet;
- source views;
- deep links;
- cross-city search.

It does not yet have their **feel**. There is no photography anywhere. Every hub tile is the same navy constellation. The cards and
sheet still show rough edges: clipped native-script plates, a Close button over the plate, an unstyled black glyph, and an
unstyled saved page. The two "knows you" features the brief is built on, **"for you"** ordering and **day plans**, have not been built.

## Scorecard

| Dimension (weight) | R0 `ca70e53` | **R1 `65e93e9`** | Δ | Goal |
|---|---:|---:|---:|---:|
| A. Look & feel (40 %) | 32 | **60** | +28 | ≥ 80 |
| B. UX & ergonomics (25 %) | 25 | **74** | +49 | — |
| C. Competitor feature coverage (20 %) | 30 | **66** | +36 | ≥ 80 |
| D. Unique strengths (15 %) | 40 | **72** | +32 | — |
| **Overall (weighted)** | **31.1** | **66.5** | **+35.4** | **≥ 80** |

How the overall scores are computed:
- R0 = 0.4×32 + 0.25×25 + 0.2×30 + 0.15×40 = 31.05.
- R1 = 0.4×60 + 0.25×74 + 0.2×66 + 0.15×72 = 66.5.

## Method

1. `cd tools && npm run beta`: PASS, 0 files written (reproducible build).
2. Served the repo root (R1, port 8761) and a mirror of the repo with `beta/` swapped for `ca70e53:beta` (R0, port 8762) with
   `python3 -m http.server`.
3. Captured screenshots with [`tools/shots-round.js`](tools/shots-round.js), using the pre-installed Chromium:
   - Viewports: 390×844 at DPR 2 (touch) and 1440×900, light theme, reduced motion.
   - Network:
     - Every off-origin request is aborted, except the R0 CDN Leaflet, which is served from `tools/node_modules/leaflet` so
       that R0 gets its map.
     - Tile requests get a flat 1 px stub for both rounds. Tile hosts are blocked here, so **the empty-looking map ground is a
       sandbox artefact, not a defect**.
     - R0's Google Fonts are blocked here, so R0 renders in fallback serif faces. That makes R0 look somewhat worse than
       production; its scores allow for this.
   - Saved list: seeded with 4 refs, so the saved page is not empty.
4. Interaction probes (Playwright, mobile):
   - Tokyo sheet from a card and from `#p=senso-ji`.
   - 30 × Tab inside the sheet; Esc; Back.
   - Tray "Must see" → count updates.
   - Hub search for "ramen"; service-worker registration.
5. `npm run beta:metrics` on the pilot set. The run is copied to [`r1/beta-metrics-r1.md`](r1/beta-metrics-r1.md); the QA-owned
   `qa/` files were restored afterwards.
6. One `WebSearch` refresh on the Airbnb Experiences relaunch (below). WebFetch was not used.

**Harness lag (QA lane, important).** `beta:metrics` reports **B-07 "toggle none"**, **B-10 tray ❌** and **B-17 "no sheet"** on all
five city pilots. My probes show all three working on R1:
- **Sheet.** It opens from a card click and from `#p=` on load. Focus stays inside for 30 Tabs (0 escaped). Esc closes it.
  Back closes it and stays on the page.
- **Content.** It holds every source with domain and "All n picks", Apple/OSM/Google directions, "Pinned to the door: high
  confidence, verified 2026-10-02", "Status checked", "Hours and prices aren't in our data", Been there, Suggest a correction,
  and a sticky Save · Directions · Share bar.
- **Tray.** "Show 488 places" becomes "Show 177 places" after "Must see". It has 8 groups.
- **Mobile map.** The `[data-cleo-map]` toggle opens a full-screen map, and a pin opens a peek sheet with Close and Open.

The harness selectors predate FE-A `ab80b44`. **Until QA updates `metrics.js`, its M1 score (19/24) understates the beta.** I
scored what I verified.

## Side-by-side (R0 → R1)

| Page | Mobile 390×844 | Desktop 1440×900 |
|---|---|---|
| Beta landing | ![](r1/landing-m-r0-r1.jpg) | ![](r1/landing-d-r0-r1.jpg) |
| Country hub (Japan) | ![](r1/japan-m-r0-r1.jpg) | ![](r1/japan-d-r0-r1.jpg) |
| Tokyo | ![](r1/tokyo-m-r0-r1.jpg) | ![](r1/tokyo-d-r0-r1.jpg) |
| Cleveland | ![](r1/cleveland-m-r0-r1.jpg) | ![](r1/cleveland-d-r0-r1.jpg) |
| Singapore town (Chinatown & CBD) | ![](r1/chinatown-m-r0-r1.jpg) | ![](r1/chinatown-d-r0-r1.jpg) |
| Place detail (R0 popup → R1 sheet, Kanda Myōjin) | ![](r1/sheet-m-r0-r1.jpg) | ![](r1/sheet-d-r0-r1.jpg) |
| Mobile map (R0 map-on-top → R1 toggle + pin sheet) | ![](r1/map-m-r0-r1.jpg) | ![](r1/map-d-r0-r1.jpg) |
| Saved list | ![](r1/saved-m-r0-r1.jpg) | ![](r1/saved-d-r0-r1.jpg) |
| Method page | ![](r1/method-m-r0-r1.jpg) | ![](r1/method-d-r0-r1.jpg) |
| Day plan | **Not built in either round** (no `Your day` surface; M2-06 todo) | — |

| More views |
|---|
| R1: filter tray · source view (News 5 → "All 100 of its numbered entries are here") · Tokyo cards: ![](r1/r1-flows-m.jpg) |
| R1 scrolled: landing · Japan · Cleveland cards: ![](r1/r1-scroll-m.jpg) |
| R0 scrolled: Tokyo intro wall · Cleveland · landing: ![](r1/r0-scroll-m.jpg) |

## Evidence per dimension

### A. Look & feel — R0 32 → R1 60

| Sub-criterion | R0 | R1 | Evidence (R1) and the leader it is judged against |
|---|---:|---:|---|
| Visual polish | 30 | 62 | Clean grid, 44 px pills, a calm toolbar. **Defects a luxury reader notices at once:** <br>• Vertical native plates are clipped mid-glyph ("皇居東", "靖國神", "東京駅" cut off; `tokyo-m-s1`). <br>• The native name is printed twice (title "(皇居東御苑)" plus the plate). <br>• The sheet's Close button sits on top of the plate ("明神" under the ×; `sheet-m`). <br>• The sheet cover shows an unstyled **black speech-bubble glyph** (`sheet-m/d`). <br>• "Recommended by" puts a space before each comma (QA-18 still open). In the pin sheet the source buttons wrap one per line with stray commas (`map-m`). <br>• Desktop rail tiles have dead space, and "Castles, Pa…" is clipped under the arrows. <br>• The saved page uses a **default browser button** and a plain list (`saved-m`). <br>Aman/Rosewood-grade restraint means none of these would ship. |
| Imagery | 5 | 35 | **0 photographs.** Hubs: city pin constellations. Cards: typographic covers with area tint, dots, a giant italic initial and a generic glyph. This is honest and on-strategy (UX §6 A+B). Against Airbnb Experiences, Marriott/Aman and Booking/Agoda Gallery View, all photo-led, it still reads as a type specimen. Every hub tile is navy with dots, so 21 US tiles look alike (`landing-d`). Map art is limited to a tiny area hull beside each section heading. |
| Typography | 35 | 75 | Two families (Bodoni Moda + Figtree) and 0.3 % uppercase. The Didone hero ("Go where the people who *know* would go.") is in Aman/Ritz territory. Two misses: sheet body copy is set in **Bodoni at reading size**, which is hard to read at 390 px with hairline serifs; and in "Kanda My ojin" the macron breaks the spacing on desktop. |
| Layout | 30 | 70 | Inventory first (0.79–0.85 screens), with ≥ 2 cards per screen on 4 of 5 pilots. Desktop split view. The R0 "map, then 55 controls" stack is gone. Two misses: the desktop map sits at 37 % (target ≥ 40), and it shows the whole city zoomed out instead of the area being read. |
| Motion / delight | 20 | 45 | Save "stamp" and glyph CSS exist and honour reduced motion. Nothing on the primary path surprises in the way Airbnb's 2025 dimensional icons do (P9). Not observed in captures, which run with reduced motion. |
| Luxury + fun | 40 | 65 | Per-city skins differ: Tokyo vermilion/seigaiha, Cleveland lake/swell, Chinatown orchid. ★ tile first and larger. Two misses: the "fun" layer is one accent colour, and US ★ tiles are a **publisher** ("News 5 Cleveland"; Wheeling: "Wikipedia (notability / histo…") rather than something you'd crave. |
| Wanderlust | 20 | 45 | The landing hero copy sells. Below it, the tiles say "194 places · Unique American · Desserts & bakeries · Chinese", which is a data label, not desire. No hero imagery, no "why go" line per city, and no seasonal or editorial collection across cities. Apple Maps Guides covers and Airbnb's destination-led home (2025 relaunch: home tab "dedicated to exploring popular destinations and experiences", 19 experience categories; [TravelPulse](https://www.travelpulse.com/news/hotels-and-resorts/airbnb-launches-new-app-services-and-experiences-features), [Hospitality Design](https://hospitalitydesign.com/news/business-people/airbnb-services-experiences-new-app/)) make you want to go. Ours makes you trust the list. |
| **A (mean)** | **32** | **60** | — |

How R1 compares with each leader on look and feel:
- **Airbnb Experiences.** Structure parity: rail, sheet, heart. Feel gap: photos, depth, motion.
- **Aman / Rosewood.** Type and restraint are close. Polish defects and the lack of imagery separate us.
- **Marriott / Ritz.** Marriott's contextual home and photography are missing.
- **Booking / Agoda.** We are deliberately less dense, which is correct (no urgency). Their Gallery View has no counterpart here.
- **Apple Maps Guides.** We are closest here: source-as-cover and map plus list. The covers are typographic, not photographic.
- **Michelin.** The tier glyph ladder and method match its pattern. Michelin's detail pages are photo-led.

### B. UX & ergonomics — R0 25 → R1 74

| Area | R0 | R1 | Evidence |
|---|---:|---:|---|
| First screen | 15 | 85 | B-01: R1 0.79–0.85 (R0 Cleveland 2.95, NYC 3.53). B-03: R1 14 on-screen on all pilots, exactly at the limit (R0 45–75). Masthead 293–314 px. |
| Discovery | 20 | 75 | Collection rail with computed counts. Source views (News 5 = 103, "All 100 numbered entries"). Cross-city hub search ("ramen" → 10 guides). Two misses: in Cleveland the rail leads Signature → Must see → publishers → Vietnamese 4 · Singaporean 1, before the city-unique canon (QA-16 still open); no "for you". |
| Map ↔ list | 20 | 60 | Split view, sticky map, hover → pin highlight. Misses: map at 37 %; pin → card not confirmed by the harness; numbers on pins only at zoom ≥ 14; the map does not fit the area in view or fly to the place whose sheet is open (`sheet-d`); the mobile map peek sheet covers about 75 % of the screen, so the map behind it is barely visible (`map-m`). |
| Filters | 10 | 90 | Tray: Area, Distinction, Recommended by, Collection, Cuisine, Sort, Been there, Map style. Live "Show N". Applied chip plus count badge. Clear all. FE-A's parity table: 0 live filters missing. |
| Detail | 20 | 85 | Complete sheet (see Method). Desktop side panel with the map visible. Focus trapped; Esc and Back close it. |
| Mobile | 25 | 75 | 0 targets < 44 px. 0 overflow at 360/390. Bottom tab bar on hubs. Gaps: the city page has no bottom bar; the saved page is not mobile-designed. |
| Accessibility | 35 | 80 | AA contrast in light and night, 0 failures on all 6 pilots (was 25/3/5/3/2/3). Skip link, landmarks, 30/30 focus visible. No accessibility statement page (M2-12). |
| Performance | 60 | 45 | Fast FCP (Tokyo 236 ms, 628 ms at 4×). But **DOM is Tokyo 11,650 and NYC 12,669 nodes**, about 4× the 3,000 budget (B-44/M3-06), and it grew from 7.3 k last run. Tokyo transfer is 1.8 MB. |
| **B (mean)** | **25** | **74** | — |

### C. Competitor feature coverage — R0 30 → R1 66

Built from the UX teardown matrix (§3 columns P1–P23, §8 must/should/could) and the SWOT feature matrix (§3.3 A+B) plus gap
ranking (§5). Legend: ✅ shipped (1) · ◐ partial (½) · ✕ missing (0) · OOS out of scope (not counted).

| # | Feature (leaders) | R0 | R1 | R1 evidence / what's missing |
|---|---|---|---|---|
| 1 | Inventory on first screen (Baymard, Klook, Airbnb) | ✕ | ✅ | 0.79–0.85 screens |
| 2 | Collection rail as front door (Airbnb Categories, Apple Guides) | ✕ | ✅ | ★ first and larger, counts computed |
| 3 | Contextual home modules (Marriott, citizenM) | ✕ | ✕ | No "Your list / ★ / Free to visit" module (M2-11) |
| 4 | Restraint plus local skin per city (Hoxton, Belmond) | ◐ | ✅ | 10 skins, B-24 ✓ |
| 5 | Visual anchor without photos: type plus map art (LV, Herb Lester) | ✕ | ◐ | Covers on 100 % of cards. Map art is only a small area hull; no sheet locator inset, no route art |
| 6 | Licensed landmark photos (everyone) | ✕ | ✕ | Blocked: egress policy plus LP-02 (see Imagery) |
| 7 | Desktop split view, two-way sync (Baymard, Kayak) | ◐ | ◐ | Map at 37 %, no fit or fly-to |
| 8 | Mobile list first, map toggle, pin → sheet with detents (NN/g, Airbnb, Trip.com) | ✕ | ✅ | Verified |
| 9 | Numbered pins matching list, ordering stated (Eater 38) | ◐ | ◐ | Ordering stated; numbers on cards; pin numbers only at zoom ≥ 14 |
| 10 | Filter tray, "Show N", applied chips (NN/g) | ✕ | ✅ | Verified |
| 11 | Situational picks from real fields (Infatuation "Perfect for") | ◐ | ◐ | "Free to Visit" is a collection, but not surfaced as a module or rail tile on Tokyo's first screen |
| 12 | Grounded personalisation, reorder-only (Ask Bonvoy, Mindtrip) | ✕ | ✕ | No interest picker (M2-05) |
| 13 | Tier ladder: original glyphs on pin, card and sheet (Michelin, Guest Favourite) | ◐ | ✅ | Glyph plus "within {area}"; closed cards carry no tier (0/13) |
| 14 | Published method behind badges (Trip.Best, Infatuation) | ✕ | ✅ | `how-we-choose.html` with computed numbers |
| 15 | Attribution as navigation (Apple Guides publisher, Atlas Obscura) | ◐ | ✅ | `#src=` view with count, intro, Read the source |
| 16 | No manufactured urgency (CMA/FTC lessons) | ✅ | ✅ | No popularity claims |
| 17 | Saved lists: heart, named lists (Klook, GetYourGuide, Google Lists) | ◐ | ◐ | Heart and one device list. No named lists; the page is unstyled |
| 18 | Share place, list, collection (Google Lists, Michelin) | ◐ | ✅ | Web Share or copy in the sheet; `#list=` share link |
| 19 | "Been there" log (Atlas Obscura, citizenM stamps) | ✅ | ✅ | Mark in sheet plus tray filter |
| 20 | Day plan with route line (Wanderlog, Four Seasons Go Local) | ✕ | ✕ | Not built (M2-06) |
| 21 | Concierge voice and microcopy (Four Seasons, Hoxton, Booking B.Writes) | ◐ | ✅ | "Your guide's note" vs "Look for"; "Hours and prices aren't in our data. Check before you go." |
| 22 | Accessibility: AA plus published statement (Hilton, Booking) | ◐ | ◐ | AA met; no statement page |
| 23 | In-city search | ✅ | ✅ | City-specific placeholder |
| 24 | Cross-city search from the hub (Google, Apple) | ✕ | ✅ | Prebuilt index |
| 25 | Per-place permalink (everyone; SWOT gap #1) | ✕ | ✅ | `#p=<id>` opens the sheet; Back closes it |
| 26 | Structured data JSON-LD (Michelin, OTAs; SWOT #5) | ✕ | ✅ | `ItemList` with 487 items = open records; no rating, price or hours |
| 27 | Per-city social card (SWOT #4) | ✕ | ◐ | OG tags on every page, but **one shared `og-cover.png`**, not per-city data art (B-36) |
| 28 | PWA / offline (Spotted by Locals, Wanderlog Pro; SWOT #7) | ◐ | ◐ | Manifest plus service worker registered. Offline reload of a visited city not yet signed off by QA (B-40) |
| 29 | Near me, opt-in (Michelin near-me, NN/g) | ✕ | ✕ | Not built (M3-02) |
| 30 | Multilingual UI (OTAs, Tokyo Cheapo; SWOT #9) | ✕ | ✕ | Not built (M3-03) |
| 31 | Freshness: status date plus "Recently closed" collection (SWOT roadmap #5) | ◐ | ◐ | Status date in the sheet and masthead; no Recently closed collection (M2-10) |
| 32 | Directions / export to maps (Wanderlog, Google) | ✅ | ✅ | Apple · OSM · Google |
| 33 | Night edition by token (Backpack) | ◐ | ✅ | Toggle; AA at night |
| 34 | "What changed" feed (Atlas Obscura, Eater) | ✕ | ✕ | Not built (M3-07) |
| 35 | Functional delight, reduced-motion safe (Airbnb 2025) | ✕ | ◐ | Save stamp CSS; no collection-glyph tap animation on the primary path |
| — | Booking / checkout / reservations | OOS | OOS | Needs payments and a server (X-02); official-site links instead |
| — | User reviews / UGC / ratings | OOS | OOS | Contradicts the sourced-trust model (X-03) |
| — | Accounts, cross-device sync | OOS | OOS | Static hosting (X-01); share-link and export cover it |
| — | Conversational AI concierge | OOS | OOS | Needs a backend; risk of unsourced answers (X-05) |
| — | Collaborative votes on lists | OOS | OOS | Needs shared state (X-04) |
| — | Opening hours, price level, "open now" | OOS | OOS | No sourced fields; inventing them is fabrication (X-06, LP-03) |
| — | Push notifications, newsletter, analytics, affiliate | OOS | OOS | Third party or server; owner decisions (X-07–X-09, D-19) |

R0 tally:
- ✅ 4 (#16, 19, 23, 32);
- ◐ 13;
- ✕ 18;
- coverage: (4 + 6.5) / 35 = **30 %**.

R1 tally:
- ✅ 18: #1, 2, 4, 8, 10, 13, 14, 15, 16, 18, 19, 21, 23, 24, 25, 26, 32, 33;
- ◐ 10: #5, 7, 9, 11, 17, 22, 27, 28, 31, 35;
- ✕ 7: #3, 6, 12, 20, 29, 30, 34;
- coverage: (18 + 5) / 35 = **65.7 % → 66**.

To reach C ≥ 80, R1 needs **28 / 35 points**: about 5 more. The cheapest route is:
- #12 For you, #20 Day plan, #3 Contextual home and #29 Near me (✕ → ✅): +4;
- plus #7, #17 and #27 (◐ → ✅): +1.5.

### D. Unique strengths — R0 40 → R1 72

| Strength (SWOT §1 "double down") | R0 | R1 | Evidence |
|---|---:|---:|---|
| Sourced picks; attribution as navigation | 45 | 90 | "Recommended by" on 100 % of cards (G6, 84/84). Source chip → "Everything News 5 recommends in Cleveland (103)". "All 100 of its numbered entries are here." The sheet names the "All 188 Tokyo picks citing GO Tokyo". No competitor in the matrix has this. |
| Verified pins | 40 | 80 | The sheet shows "Pinned to the door: high confidence, verified {date}". The method page shows 5,901 / 8,458 at high confidence. Not yet shown on the map: there are no confidence or locator insets. |
| Closure honesty | 50 | 85 | Closed places stay, flagged with source and date, and carry no tier (Cleveland 13/13). The masthead reads "13 closed, kept for the record". Missing: a "Recently closed" collection. |
| Interest triad (landmarks × signature food × pop culture) | 40 | 60 | Japan: the ★ Anime, Manga & Pop Culture tile is the front door (Tokyo 37, Kyoto 9, Osaka 24…). US/SG: ★ is a *publisher*, not a dish or pop-culture collection. Cleveland's food rail leads with Vietnamese/Singaporean, not the city-unique canon (Polish Boy, pierogi; editorial rule in CLAUDE.md). |
| Anime layer | 45 | 80 | First and larger on every Japan page and the Japan hub tiles. Collection view with intro. |
| "Your guide" (interest picker) and day plans | 10 | 15 | Voice is done well ("Your guide's note", "Look for"). The picker and day plans don't exist. These are SWOT gaps #2 and #3 (each 100/125) and the heart of the brief. |
| Stated gaps | 50 | 85 | Gap tiles and verbatim method notes (Cleveland Persian sentence in `#cz=ME`). |
| **D (weighted judgement)** | **40** | **72** | — |

## Top 10 gaps, ranked by expected score impact

Each "gain" is the expected rise in the **overall** score if the change fully lands, computed as weight × dimension points.
Together they project to about 88 overall, which is optimistic; plan on about 80.

| # | Gap | Concrete change | Lane | Expected gain |
|---:|---|---|---|---|
| 1 | **No imagery; the hubs all look alike** | Ship the strongest honest alternative now (see Imagery), and wire the photo path so it lights up when the owner supplies files. <br>**Alternative now:** an original SVG motif per city (Tokyo seigaiha + skyline line, Cleveland lake/swell + bridge line, built from `svgkit.py`), area silhouettes drawn from verified pins at hero scale, and a distinct composition per hub tile (no two navy tiles alike). <br>**Photo path:** `beta/assets/img/CREDITS.json` + `images.json` manifest, built from the 29 % of records with a Wikipedia article (Wikidata P18 filenames listed for the owner to fetch); a build step that renders a photo **only** when a local file with TASL credit exists. | imagery + designer | A +8 → **+3.2** |
| 2 | **No "for you"** (SWOT #2, the brief's core) | Interest picker (History & landmarks · Food & drink · Pop culture · Outdoors · Art) keyed on collection and cuisine ids only (Wenwen rule). It **reorders, never hides** (record set identical). Visible "First because…" line. Stored via `Cleo.store`. Also add the contextual home modules from existing fields: Your list, ★, Free to visit (M2-11). | FE-A + designer | C +5.7, D +8, B +3 → **+3.1** |
| 3 | **Hub and landing lack wanderlust** | Tile line = signature dish or landmark from data ("Polish Boy · pierogi · the chess collection"), not cuisine category labels. A cross-city editorial rail on the landing ("Anime pilgrimage across Japan · 92 places", "Hawker canon"). A country hero per hub. Per-city tile art (gap 1). | FE-B + designer | A +5, B +2 → **+2.5** |
| 4 | **Card and sheet polish defects** | Fix the defects listed under A → polish. Specifically: <br>• vertical plates: fit or abbreviate to 2–3 glyphs, never clip; <br>• drop "(native)" from the title when the plate shows it; <br>• keep Close out of the plate; <br>• style or remove the black sheet glyph; <br>• set sheet body in Figtree; <br>• "Recommended by" commas (QA-18) and wrapping in the pin sheet; <br>• rail tile dead space and arrow overlap; <br>• the macron spacing in the Bodoni title. | designer + FE-A | A +6 → **+2.4** |
| 5 | **No day plans** (SWOT #3) | "Your day" per area: 4–6 open, pinned stops; numbered route line; legs labelled "x km straight-line"; total; shareable via the `#list=` codec. Add a day-plan view to the sheet and the saved page (M2-06). | FE-A + platform | C +2.9, D +8, A +2 → **+2.4** |
| 6 | **The map is not yet a guide** | • Map ≥ 40 % on desktop. <br>• Fit to the area in view and fly to the open sheet's place. <br>• Numbered pins within the focused area at every zoom (cluster dense zooms only, P14). <br>• Confirm pin → card. <br>• Smaller mobile peek detent (≤ 40 %), so the map shows. <br>• A sheet locator inset drawn from pins. | FE-A | B +6, C +1.4, A +1 → **+2.2** |
| 7 | **Saved page is a dev page** | Design it to the `mockups/saved.html` spec: cards with covers, a map of saved places, named lists (create, rename, delete), Been-there stamps, export (KML / Apple / Google), styled share button. Read-only shared view with "Save a copy" (M2-03/04). | FE-A + designer | A +2, B +3, C +1.4 → **+1.9** |
| 8 | **Missing static features** | • Opt-in Near me: distance on cards, sort, never stored (M3-02). <br>• "Recently closed" collection (M2-10). <br>• `accessibility.html` (M2-12). <br>• i18n pseudo-locale (M3-03, next round). | FE-A, FE-B, platform | C +5.7, B +2 → **+1.6** |
| 9 | **Weight and sharing** | • Progressive rendering to ≤ 3,000 initial DOM nodes on Tokyo and NYC, every place still reachable (M3-06). <br>• Per-city 1200×630 OG image from tokens + pins (B-36). <br>• QA signs off offline reload (B-40). | platform + QA | B +3, C +2.9 → **+1.4** |
| 10 | **Signature ★ is a publisher outside Japan; Cleveland food rail order** | ★ = the city's unique food canon or pop culture where data has it (Cleveland: Polish Boy / pierogi dishes; Pittsburgh: pierogi / fish sandwich). Publishers move to source tiles. Order the food rail by the city-unique canon first (QA-16). File LP-06 for pop-culture records beyond Japan. | platform + FE-A (+ PM for LP-06) | D +6, A +1 → **+1.3** |

**Process blocker, outside the score (QA):** update `tools/beta/metrics.js` for FE-A's toggle (`[data-cleo-map]`), sheet
(`#p-` hash and `.pl-n a` click) and tray (`[data-cleo-tray]`). Today it reports B-07, B-10 and B-17 as ❌ although they work,
which would block an honest M1 sign-off.

## Imagery note (egress policy)

**The constraint.** Wikimedia hosts (`commons.wikimedia.org`, `upload.wikimedia.org`) are blocked by this environment's network
policy, and so is WebFetch. No licensed photo can be downloaded or verified from here. This evaluation did not try to route
around the policy.

**What it costs.**
- Every look-and-feel leader in the teardown is photo-led except the design-led guide brands. Without photos, I cap
  **A at about 75–80**, however good the type and art become.
- Real, credited landmark photos on about 29 % of records (sights with a Wikipedia article; none in Vietnam, because Vietnam has
  no freedom of panorama) are worth an estimated **A +8–10**. That is **+3–4 overall** by itself, and it closes C #6.
- A also needs ≥ 80. So without photos the beta needs near-flawless polish, original illustration and map art to clear the bar.

**The honest interim**, in order:
1. **Original illustration per city and collection** (commissioned or in-house SVG; generic subjects, never "this shop's bowl"),
   used once and large: hub tiles, city hero, collection covers (UX §6 C).
2. **Map art from verified pins** at hero scale: area silhouettes, a sheet locator, day-route lines. Pins-only art needs no OSM
   credit (UX §6 B).
3. **A ready asset manifest** for the owner. List the candidate files (from the Wikipedia-linked sights) in `CREDITS.json` /
   `images.json` with the fields `{record, page, commons_file, author?, licence?, depicts, fop_country_ok}`, left `pending` until the
   owner fetches and verifies them on an unrestricted machine.
4. **The build renders a photo only when a local file plus TASL credit exist.** It falls back to the typographic plate
   otherwise, with no layout shift (content never depends on the image).

**Never** stock photos next to a named place, AI-generated images, or hotlinking an unverified file.

## What R1 got right (keep)

- The rebuilt structure: inventory first, rail, tray, sheet and source views.
- 0 tap-target, overflow and contrast failures across 94 pages.
- 100 % attribution; every place reachable by scroll, deep link, search and with JS off (G1 84/84).
- Closed places honest.
- Computed counts and dates everywhere.
- A Didone voice that finally reads as "luxury".
- The method page, which no competitor has with live numbers.

## Reproduce

```bash
cd tools && npm run beta && npm run beta:metrics            # metrics → qa/ (QA-owned; restore after)
python3 -m http.server 8761                                 # from repo root (R1)
# R0: git archive ca70e53 beta | tar -x -C <tmp>/r0; mirror the repo with beta/ → <tmp>/r0/beta; serve on 8762
node design/beta/eval/tools/shots-round.js r1 8761 <out>/r1
node design/beta/eval/tools/shots-round.js r0 8762 <out>/r0
```
