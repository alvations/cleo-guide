# Sources registry & research pipeline

Every place in this guide is meant to be traceable to a credible source. To keep that promise
repeatable for new cities, sources live in one place and the flow for finding them is codified.

## The two pieces

| File | What it is |
|---|---|
| [`data/sources.json`](../data/sources.json) | The **central registry** — a reusable catalogue of *source types*, plus per-city ranked, fact-checked sources and creators. |
| [`tools/research.js`](../tools/research.js) | The **pipeline** — generates the search plan for any city and audits a city's recorded sources. |
| [`data/local-media.json`](../data/local-media.json) | The **local-media map** — each city's local news outlets and TV channels (the source of "best of / hidden gems / fall fun" lists). Living data; keep updated. |

## Three modes

The same research + fact-check flow runs in three directions:

- **Mode A — create a new city.** `node tools/research.js "<City>" "<ST>"` → research → rank →
  fact-check → build a new `cities/<city>.html`, extending the sources registry as you go.
- **Mode B — refresh a published city.** `node tools/research.js --refresh <city-key>` → re-verify
  what's already published, sweep for **closures**, search for **new places**, then update the page.
  Run this regularly: businesses close, hours change, new places open. Closed places **stay, flagged**;
  new fact-checked places get added; the page's "Last verified" stamp and the registry's
  `lastUpdated` both get bumped, and a `refreshLog` entry records what changed.
- **Mode C — seed-place expansion.** `node tools/research.js --seed "<Place>" <city-key>` — when
  someone names one or a few specific places to add to an existing city. See below.

`node tools/research.js --list` shows every city and how long since it was last updated, so you can
see what's going stale.

### Mode C — seed-place expansion (you name a place, we source it and find more)

When a specific place is requested for a city, **never add the bare name.** Run the same
source-first discipline as a build, seeded by that one place:

1. **Confirm & source the seed.** Search the place by name + city and find **credible sources that
   refer to it** — local TV, the metro daily, the nonprofit newsroom, the CVB, a reputable travel
   blog, plus its Tripadvisor/Yelp standing. Confirm it **exists, is open**, and grab the
   address/coords. If it can't clear the bar (below), say so and **stop** — don't add it.
2. **Mine those sources for more places.** A source that ran a piece on the seed almost always
   ranks *other* places; read its list and pull anything genuinely visit-worthy we're missing. Sweep
   the city's local media (`--media <city-key>`) and the authoritative playbook (Tripadvisor / U.S.
   News / PlanetWare / the CVB's must-see) at the same time.
3. **Fact-check** each candidate (exists, open, address/hours right; flag closures, keep them).
4. **Re-rank** within each region (tiers are graded inside a region; keep ≥1 tier-1 per region).
5. **Record every reusable source** in `data/sources.json` (rank + `verified`) so future cities
   inherit it, rebuild the page, and run `--validate <city-key>`.

**The bar (same as everywhere):** only **notable, visit-worthy, highly-reviewed or viral** places,
**publicly accessible**. When in doubt, leave it out. The point of the seed is not just to add that
one place — it's to let a trusted request open a vetted source you then reuse to widen the city.

`node tools/research.js --seed "<Place>" <city-key>` prints this plan with the queries filled in.

> **Worked seed — Past Times Arcade → Youngstown (Aug 2026).** A request to add the retro arcade;
> sourced it, then reused those outlets to widen the Youngstown guide. See
> `cities["youngstown-oh"].refreshLog` for exactly what the seed unlocked.

### Last-updated convention

- Every city page shows a visible **"Last verified YYYY-MM-DD"** stamp (masthead and/or footer).
- The registry stores `lastUpdated` and a `refreshLog: [{date, mode, findings[]}]` per city.
- Bump both whenever you run Mode B (or edit content), so users and agents know the data's age.

## Place categories — Markets (strict rules)

**Markets are a standard category in every city build** — a reusable place category (cuisine id `MKT`,
shown under the "Food, drink & markets" tab). "Markets" means markets **of any kind** — public/indoor
markets and food halls, **maker & vintage markets**, **flea and antique markets**, international
markets, and Amish and farmers markets — not only farmers markets.

The bar is **deliberately high — they must be genuinely visit-worthy.** Apply the same rules everywhere:

- **Only well-reviewed, popular, or genuinely viral markets** people specifically travel for or rave
  about. A market merely existing is not enough.
- **Prefer permanent fixtures** (a standing indoor/public market, an Amish market, a year-round hall).
- **Recurring markets can qualify** if they're frequent (weekly/monthly) AND a well-established,
  celebrated institution — but decide carefully; most recurring markets do **not** clear the bar.
- **Must be publicly accessible** — open to anyone, not members-only or private.
- **Reject:** temporary / pop-up / one-off / event markets, and generic run-of-the-mill markets.
  When in doubt, leave it out.
- **Seasonality:** many markets are seasonal or run on set days. Include one **only** if it's a
  standout (largest / oldest / most-loved / viral); flag it with `warn:1` and state the schedule in `k`.
- **Discovery:** during research, run a market pass — e.g. `"<city> best flea / maker / public /
  antique market popular"` — and vet each hit against the rules above.

Youngstown examples that cleared the bar: **The Youngstown Flea** (downtown's curated monthly Market
for Makers, a regional draw), **Rogers Community Auction & Flea Market** (largest open-air market in the
tri-state area, year-round Fridays), **The Amish Market** (permanent indoor, Thu–Sat), and the
**Northside Farmers Market** (the city's oldest, since 2003). Generic Boardman/Canfield seasonal
farmers markets were **rejected**.

## Place categories — Farms (agricultural regions)

For **agriculturally-minded regions** (much of Ohio, Pennsylvania, the rural Midwest, etc.), add
**visitable farms** as a category (cuisine id `FARM`, "Farms & U-Pick", in the Food/markets/farms tab).
A farm qualifies only if it is **publicly visitable with real activities** — pick-your-own fruit /
vegetables / flowers, animal feeding or a petting zoo, an educational tour, a corn maze or hayride —
**and** clears the same visit-worthy bar as markets:

- **Well-reviewed and popular**, and ideally **named by local news / TV or a popular travel or family
  blog.** Local TV stations are a prime source — e.g. WKBN's Mahoning-Valley fall-farm guide, Fox 8's
  Northeast-Ohio pumpkin-patch guide. This is the same move as reading a station's "best places to
  visit" list (see the local-media map below).
- **Publicly accessible** — a real u-pick / agritourism operation open to visitors, not a private or
  wholesale-only farm.
- **Seasonal is expected** (orchards, pumpkin patches, mazes run in autumn) — include a seasonal farm
  only if it's genuinely popular, and **flag it** with `warn:1` and state the season/schedule in `k`.
- **Skip** farms with no public visiting, or generic roadside stands with no reviews or activities.
- Only add this category where it makes sense — a dense urban city with no agritourism nearby won't
  have qualifying farms, and that's fine.

Youngstown examples: **White House Fruit Farm** (Canfield orchard + cider + doughnuts), **Detwiler
Farm** (Columbiana — petting zoo, u-pick pumpkins, corn maze) and **Molnar Farms** (Poland — pumpkin
patch, corn maze), all covered by WKBN and regional family blogs, all flagged seasonal.

## Local-media map — tap local news to find & refresh sites

`data/local-media.json` maps each city to its **local news outlets and TV channels**, because that's
where the useful lists live ("100 hidden gems", "fall fun on the farm", "best patios"). Use it to know
what to search for a city, and to **refresh** — those lists get re-published every year.

```bash
node tools/research.js --media <city-key>     # print a city's outlets (tv, papers, nonprofit, CVB, blogs)
```

Every city plan (`node research.js "City" "ST"`) also prints an **A2. LOCAL MEDIA** block: the recorded
outlets if the city is in the map, or a prompt to add it if not. **This is living data** — stations
rebrand, papers fold, new nonprofit newsrooms and blogs appear — so when you notice a change, update the
entry and bump its `updated` (and `_meta.updated`).

## The pipeline order (do not reorder)

```
search  →  rank sources  →  FACT-CHECK the ranked winners  →  build the page
```

Fact-checking happens **after** you've decided which sources to rank and **before** any page is
created. A source is only marked `"verified": true` once a specific claim from it has been checked.

## Using it for a new city

```bash
cd tools
node research.js "Akron" "OH"          # 1. print the search plan (queries + candidate URLs + rubric)
# 2. run those searches with a web-search tool; rank what you find (1 primary … 3 lead-only)
# 3. fact-check the ranked winners (place exists? open? address/hours?)
# 4. record the winners in data/sources.json under cities["akron-oh"]
node research.js --validate akron-oh    # 5. audit coverage before building the page
node research.js --list                 # (any time) list cities already researched
```

`--validate` fails if the required source types are missing, if there's no primary (rank-1)
source, or if nothing has been fact-checked yet — so a page can't be built on thin sourcing.

## Source types (reusable across cities)

Defined in `data/sources.json → sourceTypes`. The spine the methodology leans on:

- **Local TV numbered list**, **Atlas Obscura** / **Roadside America** (oddities), **alt-weekly**
  and **city magazine** (food/features), **regional business news** & **nonprofit local news**
  (what's current), **historical society**, **metroparks**, **state tourism**, **local CVB**.
- **Famous creator** and **local creator** coverage — popular/ground-level video. Rank these by
  whether they covered *the city itself* or only *the region*, and label that honestly on the page.
- **Aggregator/review** (Tripadvisor, U.S. News, PlanetWare), **national guidebook** (Fodor's,
  Frommer's, Lonely Planet, National Geographic), **encyclopedic** (Britannica, Wikipedia),
  **university page** (.edu visitor/student-life guides), **official attraction** (the institution's
  own site), **heritage org** (industrial-heritage / land-trust / landmarks bodies), and **county
  tourism** (suburban day-trip coverage). See the discovery playbook below.

## Finding more sources — the discovery playbook (repeatable)

The registry is only as good as the sources feeding it, and a city-name-only search misses three big
seams: the **authoritative rankings** that anchor the marquee institutions, the **university guides**
that a college town publishes, and the **suburban/county** coverage outside the core city. Run these
passes for every city and record the winners in `data/sources.json`. Every query uses `<city>` /
`<institution>` / `<county>` as placeholders, so the method carries to the next city unchanged.

**1. Authoritative rankings (anchor the marquee institutions).** The big museums, zoo and aviary
should be cited to a real ranked list, not to a generic "added" note. These queries reliably surface
one stable, reusable URL each:
- `"<city>" top attractions tripadvisor things to do`
- `best things to do in <city> US News Travel`
- `PlanetWare top-rated tourist attractions in <city>`
- `Visit<City> must-see attractions top 10`  (the official CVB's own must-see page)
- `Fodor's / Frommer's / Lonely Planet <city> things to do` · `National Geographic guide <city>`
- `Britannica <city> <state> cultural life` · `Wikipedia List of museums in <city>` (best long-tail index)

**2. Official institution sites (the primary source).** Confirm the marquee places against their own
site — authoritative address, hours and claims — and note which parent org runs several museums:
- `<parent museum org> official site <city>` · `<institution> official site .org <city>`

**3. University guides (highest-yield in a college town).** Official admissions/student-life `.edu`
pages each link a reusable cluster of named attractions, and the campus itself often holds visitable
sights (chapels, observatories, sculpture, botanical collections):
- `<university> things to do in <city> students explore the city`
- `site:.edu things to do in <city> student guide off campus`  (also finds student papers + blogs)

**4. Suburban & county coverage (the places a city search misses).** Reach the suburbs and day-trip
counties through their own tourism body and weekly papers:
- `visit <county> county <state>` · `<county> tourism hidden gems`
- the suburban weeklies and county dailies (an *Almanac*, an *Observer-Reporter*), plus **heritage
  bodies** for industrial sites and historic houses (`<region> industrial heritage tours`,
  `<region> land trust / Audubon`, `<city> history & landmarks foundation`).

**5. Confirm + geocode.** `<proper noun> address` or `<proper noun> visit` pulls the institution's own
`.edu`/`.org` page — which doubles as the citable source and the factual record — and
`<institution> coordinates latitude longitude` pulls lat/lng from an encyclopedic snippet.

Worked pass — **Pittsburgh, Aug 2026.** The marquee institutions (Carnegie Museum of Natural History &
Art, the Pittsburgh Zoo, the National Aviary) were under-sourced. Pass 1–2 re-cited them: CMNH →
`carnegiemnh.org` + PlanetWare + Tripadvisor + Britannica; CMoA → `cmoa.org` + U.S. News + PlanetWare;
Zoo → `pittsburghzoo.org` + U.S. News (ranked #5) + PlanetWare; Aviary → `aviary.org` + National
Geographic ("hugely underrated") + PlanetWare. Pass 3 added Pitt/CMU/Duquesne/Chatham guides (and the
campus sights they name — Heinz Chapel, the Nationality Rooms, Walking to the Sky). Pass 4 added Visit
Washington County, the Observer-Reporter, The Almanac, Rivers of Steel and PHLF, which unlocked the
Pennsylvania Trolley Museum, the Whiskey-Rebellion houses, the Carrie Blast Furnaces and the whole
South-Hills / Mon-Valley long tail. The registry grew from 12 to 45 Pittsburgh sources this way.

## Web access in this environment (read this before researching)

- **`WebSearch` works.** It runs on Anthropic's server-side search backend, not through the
  sandbox's network path, so it returns real results (titles, URLs, snippets, summaries).
- **`WebFetch` / `curl` to arbitrary sites are blocked.** Outbound HTTP goes through a
  policy-enforcing **org egress proxy** that allowlists only a few hosts (GitHub, package
  registries, Anthropic). General sites (`youtube.com`, `wikipedia.org`, news sites, `maps.google.com`)
  return **403 CONNECT** — an organization policy denial. The proxy's own docs say *"Do not retry or
  route around it."* **Do not attempt to bypass it** (no reader proxies, tunnels, or alternate hosts).
- **Consequence:** research and fact-checking are done from **search results**, cross-checking a
  claim across two or more independent results rather than reading one page in full. When a genuine
  full read is required, a human opens the URL in a normal browser. Record `researchedVia` per city.

## Fact-checking procedure (explicit, step by step)

Do this **after** ranking sources and **before** building or editing the page. For every place that
will appear:

1. **Search the place by name + city**, e.g. `Rose Melnick Medical Museum Youngstown`. Prefer queries
   that surface an official/primary page (the museum, the park authority, the university, the CVB).
2. **Cross-check the key facts across ≥2 independent results.** Confirm, at minimum:
   - it **exists** and is **open** (watch for "permanently closed" / "reopened" / relocations);
   - the **name/address** are right;
   - any **specific claim** you print — founding year, "free admission", hours, "largest/first",
     a named dish — appears in a credible result. If two sources disagree, prefer the primary
     (official site, historical society) and soften the wording.
3. **Closed or moved?** Keep the entry, **flag it** honestly (`closed`, `reopened`, `call ahead`) —
   never silently drop it (a missing item reads as an error).
4. **Record the check in `data/sources.json`:** set `"verified": true` on the source only once you've
   checked a claim from it, and put the confirmed fact in its `covers` array. Un-checked stays
   `"verified": false`.
5. **Creators:** confirm the creator actually covered the place/city (watch region-vs-city — e.g. a
   video about a neighbouring town is region-scope). Label scope honestly on the page.
6. **Re-run** `node tools/research.js --validate <city-key>`; it must pass before you build.

Honesty rules carry over from the Cleveland methodology: added-from-general-knowledge is `added`,
never relabelled as sourced; a cuisine tag needs a **named dish**; gaps are stated, not filled.

### Worked fact-check examples (Youngstown, Aug 2026)

| Claim printed | Confirmed via search | Result |
|---|---|---|
| Butler Institute — 1919, first U.S. art museum, free | Travel2Next + multiple | ✓ printed |
| Handel's — founded summer 1945, Youngstown | handelsicecream.com/history + Wikipedia + Mahoning Matters | ✓ printed |
| Golden Dawn — still open? | Business Journal "to reopen" + Yelp hours 2026 | ✓ printed as "closed 2017, reopened" |
| Peter Santenello "toured Youngstown" | His Ohio video is East Palestine (next door) | ✗ downgraded to region-scope |

## Worked example — Youngstown, Ohio

See `cities["youngstown-oh"]` in the registry. Researched Aug 2026 via search; 11 ranked sources and
5 creators. Fact-checked highlights: the Butler Institute (1919, first U.S. art museum, free), Mill
Creek Park (4,400+ acres), the Rose Melnick Medical Museum (1952 iron lung, an Atlas Obscura oddity),
and the Ward Beecher Planetarium (free public shows). Famous coverage: **Peter Santenello** (4.2M) —
labelled region-scope, because his Ohio video is next-door East Palestine, not Youngstown itself.
