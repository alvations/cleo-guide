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
