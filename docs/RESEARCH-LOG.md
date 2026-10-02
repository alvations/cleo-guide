# Research log — every search, fetch, decision and dead end

This is the complete record of how 4 supplied links became 183 verified places. It is written so
that the process can be repeated exactly, and so that nothing learned here is lost.

Read alongside [METHODOLOGY.md](METHODOLOGY.md) (the rules) and [RECREATE.md](RECREATE.md)
(the sequence for a new city).

---

## Part 1 — What was supplied

Seven starting points, of very different value:

| # | Supplied | Type | Yield |
|---|---|---|---|
| 1 | `atlasobscura.com/places/the-percy-skuy-collection-on-the-history-of-contraception-cleveland-ohio` | single entry | 1 place |
| 2 | `atlasobscura.com/places/the-haserot-angel-cleveland-ohio` | single entry | 1 place |
| 3 | `atlasobscura.com/places/west-side-market` | single entry | 1 place |
| 4 | `atlasobscura.com/places/buckland-gallery-of-witchcraft-magick` | single entry | 1 place |
| 5 | `news5cleveland.com/news/hidden-gems/100-hidden-gems-of-cleveland` | **numbered list** | **100 places** |
| 6 | `thereshegoesagain.org/unique-fun-things-to-do-in-cleveland-ohio/` | **numbered list** | **23 places** |
| 7 | "Chess collection at Cleveland Public Library" | name only | 1 place |

**The first lesson.** Four of the seven inputs were single Atlas Obscura entries. Those four were
not the valuable part — they were a *sample* of a catalogue containing roughly 33 Cleveland
entries. See Part 3.

Later additions: one Google Maps short link (Dang Good Foods, Lakewood) which prompted a
neighbourhood cluster; and a request for food coverage with specific cuisine constraints.

## Part 2 — Extracting the numbered lists

### How

`web_fetch` on each list URL with `text_content_token_limit` raised to 3000–4000. These pages are
long and the default truncation silently drops the tail of the list — the exact place where the
reader-nominated entries (#91–100) live.

```
web_fetch(url, text_content_token_limit=4000)
```

### The extraction rules applied

Every numbered item was transcribed, including four categories most people drop:

1. **Closed businesses.** Lolly the Trolley (#44, closed 2022), Sokolowski's, Hot Sauce Williams.
   Kept and flagged. A reader planning around one of these needs to know it is gone.
2. **Things that are not places.** News 5 #49 is `@neorsd`, a sewer district social media account.
   Kept, pinned to their headquarters, labelled as not-a-place. A missing number reads as an error.
3. **Entries the source combined.** News 5 #6 (moon rock) and #73 (Lucy) are both at the natural
   history museum. Combining them makes 100 sources look like 98 cards and breaks reconciliation.
   **Split anything the source numbered separately.**
4. **Entries with no obvious appeal.** #4 Land of the Warres, a marked doorway. Too odd to cut.

### The reconciliation check

Written as code, not eyeballed:

```js
const found = new Set([...HTML.matchAll(/\["N5","#(\d+)"\]/g)].map(m => +m[1]));
const missing = []; for (let i = 1; i <= 100; i++) if (!found.has(i)) missing.push(i);
```

This now lives in `tools/validate.js`. It caught a genuine gap the first time it ran — the card
count read 115 when it should have read 123, because of combined entries.

## Part 3 — How the sources were extended

This is the part worth copying. Four techniques, in descending order of value.

### 3.1 Mine the source's own index (highest value by far)

The brief supplied four Atlas Obscura links. Atlas Obscura organises by city, so the question is
not "find more sources" but **"what else does this source hold?"**

Search run:

```
"Atlas Obscura Cleveland Ohio all places list Franklin Castle Balto Thinker"
```

The direct index URL `atlasobscura.com/things-to-do/cleveland-ohio/places` **could not be fetched
directly** — the fetch tool refuses URLs that have not appeared in a prior search result. The
workaround: search for the index and known entries, then read the returned snippets and the
public user-list pages, which enumerate entries with one-line descriptions.

This yielded nine additional Atlas Obscura places, tagged `AO_CLE`:

Franklin Castle · Wade Memorial Chapel · The Thinker (bomb-damaged, unrestored) · Balto ·
GE Chandelier · Steamship William G. Mather · International Women's Air & Space Museum ·
Cuyahoga Valley Scenic Railroad · Cleveland Trust Rotunda

> **Wade Memorial Chapel** — a Louis Tiffany interior executed by an all-female workshop, inside
> the cemetery the brief already pointed at — is arguably the best single thing in the entire
> guide, and it came from reading the index rather than from any search.

**Generalise this.** Whenever a brief supplies individual entries from a catalogue site, go to the
catalogue's city index first. It beats any amount of further searching.

### 3.2 Ask the source-type question, not the topic question

The generic search:

```
"Cleveland hidden gems 2026 lesser known attractions locals"
```

returned, in order: a Rice University subdomain hosting scraped content, a Wix blog belonging to a
tree service company, a broke-backpacker listicle, Tripadvisor, TikTok, a car-service marketing
page, and a Johns Hopkins subdomain about *Craigslist*. **None was used.**

What works instead is naming the **kind** of publication you want, because every US metro has the
same set:

| Source type | Cleveland instance | Why it matters |
|---|---|---|
| Local TV numbered list | News 5 *100 Hidden Gems* | reported, photographed, numbered |
| Alt-weekly | Cleveland Scene | best food coverage anywhere |
| City magazine | Cleveland Magazine | neighbourhood dining depth |
| Nonprofit local news | Freshwater Cleveland | long-form neighbourhood pieces |
| National food critic with a city desk | The Infatuation | verified, opinionated |
| University public-history project | Cleveland Historical (CSU) | accurate, unglamorous |

**Rejection rule applied:** no byline, no photographs, no specifics → discard.

### 3.3 Search the neighbourhood, not the cuisine

For food, the productive query was geographic and specific rather than categorical:

```
"Cleveland Asiatown best Vietnamese pho Cantonese dim sum authentic 2025 Superior Pho Wonton Gourmet"
```

Naming the neighbourhood (Asiatown) plus two candidate businesses surfaced four genuine local
sources at once — Freshwater, Cleveland Scene, Cleveland Magazine and The Infatuation — each
with dish-level detail. A query like "best Chinese food Cleveland" returns aggregator spam.

Second food search, deliberately naming the publications wanted:

```
"Cleveland best Thai Filipino Persian Middle Eastern Venezuelan arepa restaurants Cleveland Scene Infatuation 2025"
```

### 3.4 Verify the TV and film claims individually

```
"Anthony Bourdain Parts Unknown Cleveland episode restaurants featured"
```

Findings that changed the output:

- The episode is *No Reservations* S3 (2007), **not** *Parts Unknown*. Cleveland never appeared on
  Parts Unknown. Getting this wrong would have been an obvious error to any local.
- Of four restaurants featured, **three have since closed** — Sokolowski's, Hot Sauce Williams,
  Lola. Only Skyline Chili in Lyndhurst survives.
- Skyline is a *Cincinnati* chain that Bourdain chose specifically to needle his Cleveland guide.
  Locals were annoyed at the time. That context is the reason to include it.
- **No "weird food history" YouTube channel covers specific restaurants in this city.** Those
  channels cover topics, not venues. The requested category does not exist here, and the honest
  answer was to say so rather than invent entries.

## Part 4 — Verification

Every place was resolved through a places API before entry. ~13 batched calls covering ~120
lookups, taking from each: verified coordinates, current address, current opening hours,
permanent-closure status.

### What verification caught

**A wrong address in a published source.** News 5 lists the chess collection at *525 Superior Ave*.
The Cleveland Public Library Main Building is at **325 Superior Ave NE**. A reader following the
article walks to the wrong place. The guide states the correct address and flags the discrepancy.

**Opening hours as the highest-value field.** Roughly a fifth of entries carry constraints severe
enough to wreck a day. Each gets `warn: 1`, rendering a red-barred callout:

- Dittrick / Percy Skuy — Friday 10:30–4 and Saturday 12–4 only
- The Sanctuary Museum — Wednesday mornings, Saturday afternoons
- Terminal Tower deck — weekends only, advance tickets, no walk-ups
- West Side Market — closed Tuesday and Thursday
- Slyman's — weekdays until 2:30pm, closed both weekend days
- Veterans Memorial Bridge streetcar deck — opens roughly one day a year
- Soldiers' & Sailors' tunnels — one day a year

**Businesses closing.** Minh Anh, Cleveland's oldest Vietnamese restaurant (since 1984), had 2025
reviews mentioning the family planning to close. Flagged with "call before you make a trip".

### Fetches that failed, and the workarounds

| Target | Failure | Workaround |
|---|---|---|
| `maps.app.goo.gl/kh9ujWv7YCgxms37A` | `ROBOTS_DISALLOWED` — Google blocks automated access to short links | Asked the user for the place name. They supplied *13735 Madison Ave, Dang Good Foods* |
| `cpl.org/special-collections/` | bot detection | Used search snippets from ChessBase, The Land and Wikipedia to confirm the collection, floor and access rules |
| `atlasobscura.com/things-to-do/cleveland-ohio/places` | tool refuses URLs not seen in prior results | Searched for the index and read result snippets plus public user lists |
| Tile servers, from the sandbox | all 403 — egress proxy allowlist | Could not verify tiles at all. Built four-server failover **plus** a vector backdrop so a blank map is impossible |
| Chromium download for headless testing | host not allowlisted | Ran the real page in jsdom with the real Leaflet library instead |

**Do not paper over a failed fetch.** Each of these produced either a workaround or an explicit
statement of uncertainty in the guide.

## Part 5 — Search queries, verbatim

Every search run, in order, with the outcome.

```
1. "Cleveland Public Library John G. White chess collection visit"
   → Confirmed: world's largest chess collection, 3rd floor Special Collections,
     35,000+ items from the 12th century, photo ID required, one item at a time.
     Sources: ChessBase, The Land, Wikipedia, Cleveland Public Library.

2. "Cleveland hidden gems 2026 lesser known attractions locals"
   → SEO spam. Nothing used. Documented as the negative example.

3. "Atlas Obscura Cleveland Ohio all places list Franklin Castle Balto Thinker"
   → 9 additional Atlas Obscura entries. Highest-yield search of the project.

4. "Anthony Bourdain Parts Unknown Cleveland episode restaurants featured"
   → Corrected show and year; found 3 of 4 restaurants closed.

5. "Cleveland Asiatown best Vietnamese pho Cantonese dim sum authentic 2025
    Superior Pho Wonton Gourmet"
   → Freshwater, Cleveland Scene, Cleveland Magazine, The Infatuation, all with dish detail.

6. "Cleveland best Thai Filipino Persian Middle Eastern Venezuelan arepa restaurants
    Cleveland Scene Infatuation 2025"
   → Thai Thai, Tita Flora's, Barroco, El Rinconcito Chapin. No Persian candidate found.
```

Six searches total. **The two productive patterns were "read this source's own index" and
"name the neighbourhood plus two candidate businesses".** Broad topic searches produced nothing.

## Part 6 — Where each entry came from

| Source key | Count | How obtained |
|---|---|---|
| `N5` | 100 | supplied URL, fully transcribed |
| `TSG` | 23 | supplied URL, fully transcribed |
| `AO_*` (4 keys) | 4 | supplied URLs |
| `AO_CLE` | 9 | **extension** — mined from the Atlas Obscura city index |
| `REQ` | 1 | requested by name |
| `ADD` | 13 | local staples added from general knowledge, tagged honestly |
| `INFAT` `SCENE` `CLEMAG` `FRESH` | 15 | **extension** — local food press |
| `BOUR` | 4 | **extension** — verified TV features, incl. 2 closed |
| `FADD` | 21 | food additions from general knowledge, tagged honestly |

**123 supplied → 183 delivered.** Every extension is attributed; nothing from general knowledge
is disguised as sourced.

### 2026-10-02 — Akron · Kent · Canton (akron-oh)
- Dead end: the WebSearch budget is a **per-session cap (200)** shared by every concurrent agent in the run; it was exhausted before this agent's 2nd query. Retrying does not help (a cap, not a rate limit). Scaffolded + checkpointed; the wave plan is in data/akron-research/RESUME.md so a fresh-budget session resumes immediately.
- Technique: one outlet-anchored canon query ("Barberton chicken <outlet>") returned 6 credible outlets at once — prefer these over per-place searches to stretch the shared budget.

## Chicago (2026-10-02) — scaffold; discovery blocked by the shared search cap
- latlong.net OSM POI pages surface decimal pins for Chicago restaurants via WebSearch (e.g. Al's #1 Italian Beef 41.8693079,-87.6540011) — a good geocode channel for US restaurant pins.
- Batching several landmarks into one coordinate query returns addresses only, never coords: budget one search per pin.
- Dead end: the session's 200-call WebSearch cap was exhausted by concurrent agents after 3 Chicago calls; wave 1 checkpointed in data/chicago-research/RESUME.md.


### 2026-10-02 — Osaka W1 (Japan): Michelin venue pages are a geocoding channel; the session search cap is shared
- `allowed_domains:["guide.michelin.com"]` queries return per-restaurant venue pages with full addresses, and a follow-up "<name> <street> latitude longitude" on that domain surfaces the venue page lat/lng — a real place pin for Japanese restaurants, which otherwise never geocode via WebSearch.
- Dead end: the WebSearch cap (200/session) is shared by ALL concurrent agents in one session; with ~16 agents it ran out ~22 searches into Osaka W1. Plan concurrent runs with a raised `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION` or one session per city.

### 2026-10-02 — Singapore Punggol (PGL), W1
- Productive: Eatbook/SethLui/Her World hawker-centre guides (One Punggol HC, Punggol Coast HC opened 25 Jul 2025) give
  stall-level lists with stall numbers; Roots.gov.sg + SG101 + NHB WWII trail cover the Punggol Beach (Sook Ching) site.
- Dead end / lesson: ~16 concurrent agents share ONE session WebSearch cap (200 calls); it was exhausted ~17 searches into
  this wave, blocking geocode + status entirely. Budget-heavy towns should geocode early in the wave (pins are the
  scarcest stage), and the orchestrator should raise CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION before a 16-agent run.


### 2026-10-02 — Orlando (orlando-fl): the session WebSearch cap is shared and finite
With ~16 concurrent agents in one session, `WebSearch` returned "this session has used its web search budget (200 of 200)" after Orlando's 8th call; a retry confirmed a hard cap (raise `CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION`), not a rate limit. Lesson: a NYC-density (~500) city needs on the order of 500+ discovery and ~500 geocode searches — far beyond a 200-call budget split 16 ways. Budget per agent must be planned (or the cap raised) before launching density targets. Probes also showed park attractions geocode in one call (Wikipedia/latitude.to) while Orlando restaurant place-pins do not surface (Apple returns place-id URLs only).

- 2026-10-02 (Singapore NVN): the session WebSearch cap (200) is shared across all concurrent agents and was exhausted
  after ~14 Novena queries. Lesson: hawker stalls inside an already-pinned hawker centre (Newton FC) can reuse the sourced
  building place pin (med, "stall within") without new searches — the geocode stage cost nothing; discovery is the bottleneck.

## Hokkaido (2026-10-02) — W01 Sapporo sights; discovery blocked by the shared search cap
- Batched landmark query `Wikipedia coordinates A; B; C; D; E` DOES return per-place infobox coords for well-known
  Japanese landmarks (5/5 on the first Sapporo batch: Clock Tower, Hokkaido Shrine, Moiwa, Akarenga, Historical
  Village) plus Wikipedia + japan-guide + sapporo.travel + visit-hokkaido URLs — discovery and geocode in one call.
  Hit rate falls to ~0–50% for less-famous names; `extended` mode recovered one more. Use exact en.wikipedia titles.
- Status catch: the Former Hokkaido Government Office (Akarenga) was closed for restoration 2019→2025 and **reopened
  2025-07-25** (rurubu.jp) — older guides still say "closed for renovation".
- Dead end: the session's 200-call WebSearch cap was exhausted after ~14 Hokkaido calls; W01 checkpointed in
  data/hokkaido-research/RESUME.md (W01b query list).

### 2026-10-02 — Singapore Balestier (BLS) W1: mine NHB food trails + round-up indexes first
- The Roots.gov.sg (NHB) **Balestier Food Trail** names the heritage canon (Loong Fatt, Sing Hon Loong/Ghee Leong, Sweetlands, Lam Yeo, Kai Juan BKT, Tandoori Corner) in one search — an institutional seed list; each still needs a 2nd editorial source.
- For a hawker centre, asking WebSearch for an outlet's "list of stalls" (HGW 15, SethLui 11, WW 10, DFD 10) returns the names in one call — far cheaper than per-stall searches.
- Dead end: hit the shared session WebSearch cap (200/200) after 22 BLS searches; 13 food kept, ~20 single-source leads HELD in `_note_BALESTIER.md`.

### 2026-10-02 — Okinawa W1 (search techniques & dead ends)
- **Stars and Stripes Okinawa** (okinawa.stripes.com) food/travel listings print venue GPS (`N 26.660328, E 127.895893`
  for Kishimoto Shokudo) — the best restaurant-coordinate channel found for Okinawa via WebSearch.
- `"<sight> coordinates wikipedia"` (one place per query) surfaces the infobox DMS about half the time (Tamaudun,
  Naminoue, Sefa-utaki); multi-place queries, `北緯 東経` queries and mapcarta/latitude.to queries did not.
- UNESCO WHC 972 component coordinates are 2–3-dp centroids (Shuri/Tamaudun/Shikinaen all "26.2/127.683") — never pins.
- Dead end: the session WebSearch cap (200, shared across all concurrent agents) ended the wave after 17 searches.

### 2026-10-02 — Singapore Holland Village (HLV), agent HOLLANDV
- Productive: `"<hawker centre>" best stalls` surfaces the Seth Lui / Eatbook / Women's Weekly / Her World lists in one
  call; `"<stall>" <centre> <dish>` then yields stall number + a 2nd outlet (Michelin listing, ieatishootipost, MTC).
- A closed Bib stall (Guan Kee CKT) is findable via `"<stall>" retire closed <year>` — Eatbook/Mothership/Seth Lui.
- A stall inside an already-pinned food centre can reuse that registry pin (med, stall-within-centre) — no new search.
- Dead end: session WebSearch cap (200, shared by ~16 concurrent agents) stopped W1 after 27 calls; Ghim Moh / Holland
  Village MFC pins left UNVERIFIED rather than estimated.

## 2026-10-02 — Tokyo W2 (relaunch, 166 searches → 314 discovered / 294 on the map)
- **Sights: ~3.5 places per search.** `en.wikipedia.org`+`gotokyo.org`(+`timeout.com`) restricted, 4 names as
  "A coordinates; B coordinates; C coordinates; D coordinates" → Wikipedia infobox coords + GO TOKYO spot pages in
  one call. Kantō day trips: swap GO TOKYO for `japan-guide.com`.
- **Food: ~1.5–2.5 per search.** Michelin 3-name venue-page queries (lone authority + pin), and Wikidata P625 pins
  for heritage shops paired with a Time Out / Japan Times / Savor Japan corroboration query.
- **Dead ends:** `google.com`-restricted Maps searches return unrelated places (abandoned after 1); 5–6-name Michelin
  queries and any query containing "cuisine" drop the coordinates; mixed-topic queries ("X? — Y; Z…") waste a call.
- **Rejected pins (logged):** Tsukiji fish market point (demolished inner market, ~400 m off the outer market),
  Daikokuya and Shiseido Parlour (whole-second Wikidata points off the building), Yamashita Park (Wikipedia point
  ~25 km off), Todoroki Ryokuchi (a Kawasaki park, not Todoroki Valley), several district/station points.


### 2026-10-02 — Osaka W2 (search techniques & dead ends)
- **Michelin venue pins, 2–3 per query:** `allowed_domains:["guide.michelin.com"]` + "<A>; <B>; <C> Osaka address latitude longitude" returns each venue page's address + lat/lng (~2.5 pins per search). Mine Michelin *articles* ("N New Bib Gourmands …", "December 2025: latest additions …") for name lists first, then pin them.
- **Fan-out trap:** when names in a batched query are NOT on the restricted domain (street-food stalls on Michelin, creators), the search tool silently runs 4–5 sub-searches — only batch names known to hit.
- **Japanese Wikipedia coordinates:** `allowed_domains:["ja.wikipedia.org"]` "<名称> 座標; <名称> 座標; <名称> 座標" hit 3/3 for markets, arcades and gardens that en.wikipedia lacks (黒門市場, 心斎橋筋商店街, アメリカ村, 慶沢園, 天王寺公園).
- **Dead ends:** mapcarta/OSM search (no venue pages); Tabelog まとめ (user lists — not Hyakumeiten, zero); broad creator queries (Paolo fromTOKYO / Abroad in Japan / Mark Wiens / "Somebody Feed Phil" — no Osaka episode) returned nothing findable; brands.japan-guide.com and japan-guide /ad/ pages are sponsored.
- **Hyōgo:** Michelin's first Kobe & Awaji selection is announced Feb 2027 — no Hyōgo Michelin to lean on until then.
### 2026-10-02 — Philadelphia W1+W2: Wikipedia-domain batches pin sights; restaurant pins don't surface
- `WebSearch` with `allowed_domains:["en.wikipedia.org"]` and `A; B; C; D; E coordinates` (exact article titles) returned
  infobox coords for 4-5 of 5 Philadelphia landmarks per call — pair it with one Visit Philly query (2nd source) and you
  get ~4-5 fully-sourced, pinned sights per 2 searches. When a name misses, the tool silently runs extra follow-up searches
  (up to 5 per call) — keep batches to names that surely have an infobox, and never mix restaurants in.
- Philadelphia restaurant place pins do NOT surface via WebSearch (Michelin venue snippets, OpenTable, latlong.net: 0/3 single
  probes; a geocode agent got 11/61 in 28 calls, all Wikipedia/RTM). Only restaurants with their own Wikipedia article pin
  (Kalaya, Friday Saturday Sunday, South Philly Barbacoa, Vedge, Zahav, Pat's, Geno's, Jim's, John's, Dalessandro's).
  Plan restaurant pins for the browser helper from the start; spend the search budget on discovery + sights.
- Rejected: an 'interpolated' coordinate built from neighbouring addresses on philadelphiabuildings.org (not a place pin).

### 2026-10-02 — Hokkaido session 2 (≈140 searches → 140 discovered / 104 on the map)
- **`allowed_domains:["ja.wikipedia.org"]` + 3 Japanese names + 座標** is the best sight geocoder found so far: ~2.6 of 3
  coordinates per call (infobox DMS quoted in the summary), and it works for minor sights (waterfalls, passes, Jōmon sites,
  museums) that the English Wikipedia lacks. Background geocode workers using it pinned 25 of 34 held sights.
- **Second source cheaply:** domain-restricted area queries to `japan-guide.com`, `visit-hokkaido.jp`, `sapporo.travel`
  return 10 staff/official URLs per call; for food, `rurubu.jp` + `mapple.net` (JTB / Shobunsha guidebook editorial) +
  city tourism bodies (`otaru.gr.jp`, `hakodate.travel`) return named shops with addresses and hours.
- **Dead ends:** restaurant lat/lng never surfaced (gltjp/mapple/rurubu give address only); unrestricted "Wikipedia
  coordinates A; B; C" got ~1/3; creator queries (Paolo fromTOKYO, Abroad in Japan, Ramen Beast, youtube.com domain)
  returned no vettable channel naming a specific Hokkaido place in result text.
- **Lesson (honesty):** writing addresses with block numbers / postcodes "from knowledge" while transcribing sourced
  coordinates is an easy CLAUDE.md 4a slip — audit every address against the result text before committing.


## 2026-10-02 — Okinawa W2 (relaunch, ~174 searches → 119 discovered / 74 on the map)
- **Stars and Stripes Okinawa list articles are the coordinate jackpot**: query the exact article title + "GPS" with
  `allowed_domains=["okinawa.stripes.com"]` ("12 family-friendly Battle of Okinawa sites", "List of beaches", the soba
  guide, castle pieces, "rainy-day", Nago/Yomitan/Nanjo round-ups) → 4–12 printed GPS per search. Pair each with an
  independent outlet; two Stripes articles are one source.
- **Search summaries mis-attribute GPS across articles** (Araha Beach got Tomigusuku's coordinate; one cherry-blossom
  GPS was labelled Yaedake in one summary and Nakijin in another). Sanity-check every Stripes point against the place's
  town; on conflict pull the pin to UNVERIFIED and cross-check with a Wikipedia infobox.
- **Okinawa Times "900人の麺好きが選ぶ うまい沖縄そば" (2023, north/central/south/Miyako-Ishigaki editions)** names 31
  soba shops in four searches — an editorial-of-record food source; pair with Mapple spot pages or KozaWeb (Okinawa City
  tourism portal). Mapple (Shobunsha まっぷる) spot pages carry addresses, hours and editor copy.
- Restaurant coordinates outside Stripes' coverage (Naha, Ishigaki, Miyako) did not surface by search — they are
  discovered + sourced but held UNVERIFIED for `tools/geocode-helper.html`.

## 2026-10-02 · Chicago (session 2)
- Search budget restored for this session; discovery from editorial lists (Infatuation/Time Out/Chowhound/Chicago
  Magazine "Iconic Eats" 50-dish package — captured in full in one query) + Michelin 2025 + JB America's Classics.
- `chicagotribune.com` is blocked for the search user-agent (API 400 on `allowed_domains`) — drop it from domain filters.
- `chicago.eater.com` returned nothing via `allowed_domains`; use Infatuation/Time Out instead.
- Pins: Wikipedia 4-per-query batches (see AGENT-PROMPTS lesson). Restaurant pins via latlong.net mostly fail.
- Watch-outs found: Ann Sather is relocating (Time Out, Apr 2026) and Maxwell Street Depot was forced to move
  (Time Out, May 2026) — Wikipedia coords would be stale; both held back. Obama Presidential Center opened 2026-06-19.


## 2026-10-02 — SG 4-town relaunch (Punggol, Balestier, Novena & Newton, Holland Village)
- Extended-mode queries that NAME the guides ("stalls in Eatbook 13 best, Seth Lui 11 best, Women's Weekly 10 best") return per-guide
  stall lists — 3-6 two-source places per call vs ~1 in standard mode.
- Domain-filtered (`allowed_domains`) OR-queries over held names give exact attribution (see AGENT-PROMPTS lesson).
- Dead end: hawker-centre BUILDING coordinates (Whampoa Makan Place, Balestier Market, Holland Village MFC, Punggol Coast HC, Punggol
  Settlement) are not printed by any search-visible page; 28 geocoder searches yielded 0 → browser helper only. Wikipedia coords of a
  co-located landmark (Punggol Regional Library → One Punggol; Guan Kee Fried Kway Teow infobox → Ghim Moh MFC) worked.
- Food King (NOC) deleted all videos in 2022 — not citable. Timbre exits One Punggol HC management in 2026 (Mothership) — re-check stalls.

## 2026-10-02 — Kyoto W2 (relaunch)
- UNESCO WHC maps pages (688 Kyoto, 870 Nara, 660 Hōryū-ji) → component coordinates for 23 sights in 2 searches.
- `allowed_domains` per outlet (japan-guide.com, kyoto.travel, en/ja.wikipedia.org, guide.michelin.com) makes each search return ~10 citable pages of ONE outlet, so attribution is exact. Mixed-outlet or 8+-name queries cause internal retries costing 3–6 searches.
- Michelin: ward+genre list queries ("Kyoto Nakagyo-ku One MICHELIN Star Japanese restaurant address") give 3–7 venues with addresses. Pins come from a separate "<A>; <B>; <C> Kyoto address latitude longitude" query (3 pins per search). Asking for dish and lat/lng together loses the lat/lng.
- Dead end: creator channel (YouTube-filtered, general, timeout.com) surfaced tour vendors and unattributed videos, with no verifiable Kyoto creator. Time Out's Kyoto coverage on timeout.com sits under /tokyo and is thin.

## 2026-10-02 — Orlando (session 2)
- **Theme parks geocode beautifully via search**: batched `A; B; C coordinates` with `allowed_domains=["en.wikipedia.org"]`
  returns infobox coords for 3–7 attractions per call; Coasterpedia/Wikidata fill most gaps (Epic Universe rides, EPCOT
  pavilions, resorts). 5 background pin-pass agents resolved 111 of 154 requested places.
- **Restaurants do not**: Google `!3d!4d`, Apple Maps (place-id URLs only), mapcarta/latlong — no decimals surfaced for any
  Orlando restaurant; Wikipedia/Wikidata have coords for only ~6 (Be Our Guest, Space 220, Sci-Fi Dine-In, V&A, Otto's).
  Budget food discovery for the helper backlog, not for pins.
- **Summariser borrow check**: two coordinates were copied from a neighbouring result (Slinky Dog Dash ← Rock 'n' Roller
  Coaster; Cocoa Beach Pier ← Ron Jon). Always dedupe coordinates across a wave before merging.
- **Agent pin files must carry statusSource** — geo-merge is last-write-wins by filename, so an agent file with empty
  statusSource that sorts after the research geo file silently blanks the closure check (79 records patched).
- **Addresses**: only use a street address printed in a result; otherwise a sourced locality (10 memory-typed addresses
  were caught and replaced before commit).

### 2026-10-02 · Philadelphia W3 — technique notes
- **density.py double-count bug (fixed):** a research dir with a list-shaped worklist file (phi_worklist.json, _chi_worklist.json,
  …) was counted as food, inflating totals (Philadelphia showed 297 when 180 were real). density.py now skips *worklist* files.
- **Two-outlet neighbourhood method:** pull an Infatuation neighbourhood guide (names only), then ONE domain-restricted query
  (phillymag/inquirer/visitphilly) naming 5-7 of those places — each place the second outlet confirms goes in (~4-6 per search).
- **Award lists are the highest-yield queries:** James Beard semifinalist/finalist round-ups (Inquirer/Philly Mag/Billy Penn) and
  NYT best-in-America notes each cleared 3-8 lone-authority places per search.
- **Long multi-name queries fan out** into up to 7 hidden searches ("max_uses_exceeded" seen) — the 200-search session cap was hit
  after ~125 visible calls + 3 status agents (~91). Keep verification queries to 3-6 names.
- **Restaurant pins:** only restaurants with their own Wikipedia article pin (Meetinghouse, Mish Mish, Her Place, Dalessandro's,
  McGillin's, El Chingón, Max's); the rest stay UNVERIFIED for tools/geocode-helper.html.
- **Rejected pins:** Old City Hall's returned Wikipedia point sat ~150 m off 5th & Chestnut (it matched Todd House) — left unpinned;
  Upsala's returned point was ~4 km east of Germantown Ave.


## 2026-10-02 — Okinawa W3 (food & drink first)
- **Best yield for Japanese regional food:** pair the two big guidebook webs — Rurubu (るるぶ&more, JTB) list articles and Mapple (まっぷる) list/spot pages — each list search returns 4–8 names with addresses; a search on the other domain confirms 2–4 of them. Okinawa Traveler (Rikka Docca editors) features and the prefecture's 「琉球料理が味わえる店」 certification list add independent channels.
- **Restaurant pins are not findable via WebSearch summaries** (geocoder pass: 1 of 50) — Stars and Stripes prints GPS in the article body, but summaries rarely surface it; leave restaurants UNVERIFIED for tools/geocode-helper.html and record the Stripes article URLs in the notes for the helper.
- **Reject summary coordinates without a citable page** — 5 of 12 geocoder hits were dropped for this; also re-check citation URLs before commit (one draft pointed a rurubu URL at the wrong shop).
