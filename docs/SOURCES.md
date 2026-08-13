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

## Food & drink discovery — start with what the city is FAMOUS for (every city, the opening move)

The **first** question for any city is: *what food and drinks is this city actually famous for?* — its
signature, iconic, uniquely-local canon, the things a visitor comes specifically to eat and drink.
Discovery **starts there**, before any generic "best restaurants" search. This is not an NYC-only or
food-city-only step; **every city gets it**, and it runs before the deeper passes below.

1. **Name the city's signatures first — write the list before you search.** The local canon of dishes
   and drinks. Examples:
   - **Pittsburgh** — pierogi, Primanti-style stacked sandwiches & hoagies, the Friday **fish
     sandwich / fish fry**, chipped-chopped ham, city chicken, haluski, kolbassi, the "Pittsburgh
     salad" (fries *on* the salad), Klondike, Isaly's, Mancini's bread.
   - **Cleveland** — the **Polish Boy**, pierogi, kielbasa, corned beef (Slyman's), West Side Market,
     Barberton fried chicken, Cleveland-style pizza, Bertman Ball Park mustard.
   - **NYC** — the dollar/《regular》slice, bagel & lox, pastrami on rye, soup dumplings & dollar
     dumplings, the halal cart, egg cream, black-and-white cookie, the NY bacon-egg-and-cheese.
2. **Find the hidden-gem places that serve those signatures** — the beloved local institutions *and*
   the up-and-comers, not just the one obvious tourist name. If a signature has no worthy standout,
   **state the gap — never fill it** with a mediocre pick (editorial rule).
3. **Source each from a reference that is genuinely popular, viral, or uniquely credible — and vet the
   reference itself** (next block). Then run the whole pipeline, same as every expansion.

### The source must itself be popular / viral / credible — VET it, don't just cite it
A place earns a pin because a source *that actually carries weight* points to it. Before trusting a
creator or outlet, confirm it **is** what it claims, and record *why* in the source entry's `credible`
field:
- **Local editorial of record** — the city's daily paper, alt-weekly, CVB and regional magazine
  (ranked 1–3 in `data/sources.json`). Always the backbone.
- **Influencers / TikTokers / YouTubers / travel bloggers** — welcome and encouraged, **but only when
  the creator is verifiably popular or genuinely authoritative**: a real, sizable following; a real
  track record on *this* city or cuisine; a **findable piece of content** (the actual video/post/story),
  not trend hearsay. Note the follower scale / beat / notable coverage in `credible`, exactly like any
  other source. Register them in `data/sources.json` creators lists so they're reusable.
- **Reject** anonymous aggregators, SEO "10 best" listicles with no byline, and AI content farms.
  *Virality or popularity you cannot verify is not virality* — drop it.

This is the same credibility bar the cuisine deep-dive and viral-popup passes use — now stated **up
front as the opening move for every city**. After sourcing, the full flow runs as always:
**source (vet credibility) → fact-check open/closed → add → geocode + location-verify → re-rank within
region → rebuild → gate.** Signature-first discovery is applied uniformly — **make sure every city gets
the same treatment**, and re-run it whenever a city is refreshed or extended.

## Food discovery — cuisine deep-dive & viral pop-ups (food-heavy cities)

For cities with a serious food scene (NYC, LA, the Bay, Houston…), the standard "best of" round-ups
under-cover the depth. Two extra discovery passes are **required** for these cities — and, like
everything else, **every place they surface is fact-checked** (exists, currently open, real address →
coordinate + status verified downstream). No compromise.

> **Categorize by the kitchen's cuisine, never by a dish it serves — a hard rule.** A cuisine tag
> describes the restaurant's own tradition, not any single item on its menu. Shared dishes cross
> cuisines: **Hainanese chicken rice** is served by Singaporean, Malaysian, Hainanese, **Thai
> (*khao man kai*)** and **Taiwanese** kitchens; laksa / char kway teow / Hokkien mee span Singapore
> *and* Malaysia. So a Thai *khao man kai* spot or a Taiwanese diner (e.g. **Wenwen**) is **not**
> Singaporean/Malaysian just because it plates a shared dish. **Real bug that happened once:** an
> auto-tagger keyed on dish keywords ("hainanese chicken", "chicken rice") and mis-filed Wenwen
> (Taiwanese) and two Thai spots under *Singaporean*. The fix — and the rule — is that any
> cross-tagging keys on the **cuisine label only**. Malaysian ↔ Singaporean may carry both `SG` and
> `MY` (the Nyonya/Peranakan hawker canon genuinely overlaps — Nyonya, Kopitiam, Taste Good), but the
> trigger is the restaurant *being* Malaysian or Singaporean, never a dish. See
> `data/newyork-research/consolidate.py` (`_is_sgmy`), which is committed so any agent can reproduce
> the categorization on a local machine.

**And the whole-pipeline rule for every expansion:** whenever you expand a city (seed-place / Mode C,
a cuisine deep-dive, a borough top-up — anything), run the *complete* flow, never a partial:
**source (vet credibility) → fact-check open/closed → add → geocode + location-verify every new pin →
re-rank tiers within region → rebuild → gate (`--validate` · `--geocheck` · `--statuscheck`)**. Adding
names without geocoding + status + re-rank is not an expansion, it's a regression.

**1. Targeted-cuisine deep-dive.** Run a dedicated pass per high-value cuisine, not just a generic
"best restaurants" search. Always sweep at least: **Singaporean, Vietnamese, Chinese / Cantonese
(dim sum, Cantonese BBQ), Thai (incl. regional Isan / Northern), Malaysian, wider Southeast Asian
(Indonesian, Filipino, Burmese), and Persian** — plus whatever the city is known for. For each:
- find the genuine standouts via **Michelin (stars + Bib Gourmand)**, Eater, The Infatuation, NYT,
  Time Out — attribute honestly;
- require a **named signature dish** (a cuisine label with no dish doesn't qualify — the editorial
  rule); tag the cuisine in `CUISINES`;
- **state the gap, don't fill it.** If a cuisine has no worthy standout, say so (as Cleveland does for
  Persian) rather than force a mediocre pick. Drop anything that's closed (e.g. NYC: Urban Hawker,
  Rangoon, Adda LIC were all excluded as closed rather than listed).

**2. Viral / social-media pop-ups.** Hunt the TikTok/Instagram/YouTube-famous spots — but this is the
**highest-risk category**, so the bar is strict:
- must be a **real, currently-operating** place (fixed spot, standing stall, or a recurring pop-up with
  a findable location) — not a one-night event that's already gone;
- its **virality must be sourced** — a food-media/news story about the moment (Eater, Infatuation,
  Time Out, Grub Street, Gothamist, local news), not trend hearsay;
- tag it `"Viral"` (a first-class cuisine/marker) alongside its actual cuisine, and name the viral item.
- If you can't confirm real + open + sourced, drop it. (NYC dropped an unsourced Bronx smashburger and
  the dated rainbow-bagel for exactly this reason.)

Both passes run as their own agent waves (sequential, shared `WebSearch` budget) and dedupe against the
places already found. `Michelin` (starred + Bib Gourmand) and `James Beard` are registered reusable
source types in `data/sources.json` — lead with them for any food-heavy city.

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
search → rank sources → FACT-CHECK (incl. OPEN/CLOSED) → geocode → build → RE-VERIFY pins + STATUS → publish
```

Fact-checking happens **after** you've decided which sources to rank and **before** any page is
created. A source is only marked `"verified": true` once a specific claim from it has been checked.
The **geocode**, **re-verify & fix pins**, and **open/closed status** stages are not optional
finishing touches — every address and coordinate is fact-checked into `data/geocodes.json` before the
build (the build's gate refuses any place without a sourced entry); every place's **operating status**
(open vs permanently closed) is verified and recorded there too; and after the build the pins are
audited for *placement* and the status for *consistency* before anything goes live. Full procedure:
[Address & coordinate verification](#address--coordinate-verification--a-hard-rule-datageocodesjson),
[The re-verify & fix pass](#the-re-verify--fix-pass--a-required-step-for-every-city-not-a-one-off-cleanup),
and [Open/closed status verification](#openclosed-status-verification--a-hard-rule).

## Using it for a new city

```bash
cd tools
node research.js "Akron" "OH"          # 1. print the search plan (queries + candidate URLs + rubric)
# 2. run those searches with a web-search tool; rank what you find (1 primary … 3 lead-only)
# 3. fact-check the ranked winners (place exists? open? address/hours?)
# 4. record the winners in data/sources.json under cities["akron-oh"]
node research.js --validate akron-oh    # 5. audit coverage before building the page
# 6. fact-check every address + coordinate + OPEN/CLOSED status into data/geocodes.json
node research.js --geocheck akron-oh      # 7. gate: every place has a sourced address+lat/lng
node research.js --statuscheck akron-oh   # 8. gate: every place's open/closed status is verified
# 9. build the page, then RE-VERIFY pin placement + status consistency and fix any that are off —
#    upgrade every `low`/misplaced pin to a `!3d!4d` place coordinate, flag every closed place,
#    before publishing
node research.js --list                 # (any time) list cities already researched
```

`--validate` fails if the required source types are missing, if there's no primary (rank-1)
source, or if nothing has been fact-checked yet — so a page can't be built on thin sourcing.
`--geocheck` fails if any place on the page lacks a sourced address+coordinate in the registry;
`--statuscheck` fails if any permanently-closed place isn't surfaced as closed (or a closed status
lacks a source). Publishing is not done until both the re-verify pass (pin *placement*) and the
closure-check pass (every `statusChecked` filled) have run — not just coverage.

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
4. **VERIFY THE ADDRESS AND MAP COORDINATE — mandatory, never from memory (see below).** Confirm the
   street address and the exact lat/lng against a primary source, and record both with that source in
   `data/geocodes.json`. A place with no verified geocode entry **must not be built.**
5. **Record the check in `data/sources.json`:** set `"verified": true` on the source only once you've
   checked a claim from it, and put the confirmed fact in its `covers` array. Un-checked stays
   `"verified": false`.
6. **Creators:** confirm the creator actually covered the place/city (watch region-vs-city — e.g. a
   video about a neighbouring town is region-scope). Label scope honestly on the page.
7. **Re-run** `node tools/research.js --validate <city-key>`; it must pass before you build.

Honesty rules carry over from the Cleveland methodology: added-from-general-knowledge is `added`,
never relabelled as sourced; a cuisine tag needs a **named dish**; gaps are stated, not filled.

## Address & coordinate verification — a hard rule (`data/geocodes.json`)

> **Every address and every map coordinate MUST be fact-checked against a real source. Never place a
> pin from memory or estimation.** This is not optional and not a one-time cleanup — it is part of
> the fact-check for every place, every build, every refresh, every seed.

**Verify against one of these primary sources**, in order of preference, and record which one:

1. The place's **official website** (its "visit / directions" page — the authority on its own address).
2. **Wikipedia's published coordinates** (the infobox prints DMS + decimal) for notable places.
3. A **maps source** — **Google Maps, Apple Maps, or OpenStreetMap** search — or a reputable listing
   that shows the map pin (Yelp, AAA, the CVB directory). (Note: in this environment direct map/tile
   fetches are blocked, so confirm via WebSearch snippets that surface the maps listing.)

**Rules for the coordinate:**
- Decimal degrees, 5 places, longitude negative in the US. It must land on the **building/block** of
  the confirmed address — a park, trail or district with no single address is pinned to its **main
  entrance or most-visited point**, and the note says which.
- **Sanity-check against the town/neighbourhood:** a coordinate that falls in the wrong town is wrong,
  full stop — redo it. Never "fill in" a coordinate you could not verify; flag it and leave it out.

**The central registry — `data/geocodes.json`.** Every place lives here, keyed by city then name:

```json
{ "cities": { "pittsburgh-pa": {
  "Pennsylvania Trolley Museum": {
    "address": "1 Electric Way, Washington, PA 15301",
    "lat": 40.21134, "lng": -80.24609,
    "source": "https://en.wikipedia.org/wiki/Pennsylvania_Trolley_Museum",
    "verified": "2026-08-09", "confidence": "high" } } } }
```

This is the **single source of truth for coordinates and addresses.** The build reads lat/lng from it
and **refuses to build any place that has no entry** (`node tools/research.js --geocheck <city-key>`
audits coverage; the build script asserts it). Because each entry carries its `source` and `verified`
date, the map is **auditable and updatable**: when a place closes or moves, re-verify against the same
source, update the entry, and rebuild — the provenance travels with the coordinate.

`node tools/research.js --geocheck <city-key>` lists any place on the page missing (or stale in) the
registry, so verification can't be skipped.

### The re-verify & fix pass — a required step for every city (not a one-off cleanup)

Getting a *sourced* coordinate is not the same as getting the *right* one. A whole batch of
Pittsburgh pins once landed ~200 m off — every one had a real map URL behind it — because they were
built from the map **viewport centre**, not the **place pin**. So re-verification is now a standing
step: after a city builds and `--geocheck` PASSes, **audit the pins for placement**, fix the wrong
ones, and only then publish. Run it for every new city, and re-run it whenever a place is added.

**The one lesson that caused the 200 m error — read the right number out of a Google Maps URL:**

| URL fragment | What it is | Use it? |
|---|---|---|
| `!3d<LAT>!4d<LNG>` (also `!8m2!3d..!4d..`) | the **actual place pin** | ✅ **yes — this is the coordinate** |
| `daddr=...%40<LAT>%2C<LNG>` / `query=...@<LAT>,<LNG>` | the destination pin | ✅ yes |
| `/@<LAT>,<LNG>,17z` | map **viewport centre** (where the camera is aimed) | ❌ **no — systematically ~200 m off** |
| `/@<LAT>,<LNG>,3a,75y,...` | a Street View **camera** position | ⚠️ corroboration only; prefer the place pin |

**How to re-verify autonomously in this locked-down environment** (map/tile fetches are blocked; the
only channel is the `WebSearch` tool — Anthropic-side, so it reaches Google while curl/WebFetch cannot):

1. `WebSearch` with `allowed_domains:["google.com"]` and a query of the bare address plus a nudge:
   `"146 Sixth St, Pittsburgh, PA 15222 !3d40 !4d-79"`. Google Maps result URLs embed `!3d!4d` /
   `daddr@` — read those, **never** the `/@` viewport value.
2. If google.com is dry after ~3 tries, drop `allowed_domains` and try sources that publish decimal
   coordinates WebSearch will surface: **mapcarta.com** (OSM node), **untappd.com** (breweries),
   Yelp map pages, **hometownlocator/topozone** (GNIS), the place's official directions page.
3. **Extraction is stochastic** — the same query may return only a `/@` viewport one call and the
   `!3d!4d` pin the next. Rephrase and retry a couple times before giving up.
4. **Sanity-check** every hit against the town/neighbourhood bounding box, and against neighbours on
   the same street (house numbers must increase monotonically along the block).

**Grade every coordinate with a `confidence`, and record exactly how it was obtained in `source`:**

- **`high`** — exact-address place pin (`!3d!4d` / `daddr@`) or Wikipedia/official published
  coordinate. This is the target for every pin.
- **`med`** — adjacent-door geocode (1–2 storefronts away, ~15–30 m) or a place pin corroborated only
  by a Street View camera position. Acceptable for a map pin; leave a `note` saying so.
- **`low`** — block-level only (address confirmed, exact point not). **Flag for the re-verify pass**;
  do not let `low` be the final state of a published pin if a `high` source can still be found.

**Never fabricate.** If no real published coordinate surfaces, set `lat`/`lng` to `null` and
`source: "UNVERIFIED"` — the build's geocode gate will refuse to place it, which is the correct
outcome. A pin you cannot source does not go on the map.

Batch mechanics that matter: the `WebSearch` budget is **shared across all concurrent subagents**, so
run re-verify agents **sequentially, one wave at a time** — parallel waves starve the later batches.
Feed each wave a small JSON list (`{city, n, addr}`), have it emit `{city, n, lat, lng, source, conf,
note}`, then merge **highest-confidence-wins** into `data/geocodes.json` (an `UNVERIFIED` result must
never overwrite an existing good value). Assert record counts on the merge, per the CLAUDE.md rule.

## Open/closed status verification — a hard rule

> **Every place's operating status MUST be verified against a real source and recorded — a
> permanently-closed place is never presented as a live suggestion.** A pin that points to a shuttered
> business is as wrong as a pin on the wrong street. This is part of the fact-check for every place,
> every build, every refresh — not a one-off.

**Closed places stay, flagged — they are not deleted** (the editorial rule). A closed place is kept
for its story, but its **name carries a closed marker** so it never reads as "go here today":

```
n:"Sokolowski's University Inn — CLOSED"     ad:"1201 University Rd, Tremont (closed 2023)"
n:"Superior Motors — CLOSED"                 ad:"1211 Braddock Ave, Braddock (permanently closed)"
```

**Record status in the same registry entry** (`data/geocodes.json`), alongside the coordinate:

```json
"Superior Motors — CLOSED": {
  "address": "1211 Braddock Ave, Braddock, PA 15104",
  "lat": 40.40300, "lng": -79.86900, "source": "Google Maps", "confidence": "high",
  "status": "closed",
  "statusSource": "Google Maps \"Permanently closed\"; closed 2020, never reopened",
  "statusChecked": "2026-08-10" }
```

- `status`: `"open"` or `"closed"`.
- `statusSource`: **how** you know — the place's own site/socials ("we've closed"), Google/Apple
  "Permanently closed", a news obituary of the business, or the official municipal site for a city-run
  venue (e.g. `pittsburghpa.gov` for a farmers market's active season). Never from memory.
- `statusChecked`: the date you checked. A stale check is re-run on every refresh.

**How to verify in this environment:** `WebSearch` the place name plus `permanently closed` /
`closed` / `still open 2026`, and read Google's "Permanently closed" banner, the business's own
"we've closed" post, or a local-news closing story. If sources conflict (a reopening, a relocation),
record what's current and note the history — the same honesty rule as coordinates.

**The gate — `node tools/research.js --statuscheck <city-key>`.** It enforces consistency in both
directions and is required (alongside `--geocheck`) before publishing:

- every place on the page has a `status` in the registry;
- every registry `status:"closed"` is **surfaced on the page** (the name carries a closed marker) and
  carries a `statusSource` — a closed place that still looks live is a **FAIL**;
- every page name flagged closed maps to a `status:"closed"` entry — a stray flag is a **FAIL**;
- it reports how many places have **no closure check yet** (`statusChecked` empty) so coverage can't
  silently lapse. Run the closure-check pass (sequential `WebSearch` waves, same budget rule as the
  geocode re-verify) until that count is zero before calling a city done.

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
