# Sources registry & research pipeline

Every place in this guide is meant to be traceable to a credible source. To keep that promise
repeatable for new cities, sources live in one place and the flow for finding them is codified.

## The two pieces

| File | What it is |
|---|---|
| [`data/sources.json`](../data/sources.json) | The **central registry** — a reusable catalogue of *source types*, plus per-city ranked, fact-checked sources and creators. |
| [`tools/research.js`](../tools/research.js) | The **pipeline** — generates the search plan for any city and audits a city's recorded sources. |

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

## Why search, not full-page reads

Direct page fetches are blocked by this environment's network egress policy, so research is done
through **search results** (titles, URLs, snippets), which is enough to find, rank and cross-check
sources. When a full read is needed, open the URL in a normal browser. This limitation is recorded
per city in the registry (`researchedVia`).

## Worked example — Youngstown, Ohio

See `cities["youngstown-oh"]` in the registry. Researched Aug 2026 via search; 11 ranked sources and
5 creators. Fact-checked highlights: the Butler Institute (1919, first U.S. art museum, free), Mill
Creek Park (4,400+ acres), the Rose Melnick Medical Museum (1952 iron lung, an Atlas Obscura oddity),
and the Ward Beecher Planetarium (free public shows). Famous coverage: **Peter Santenello** (4.2M) —
labelled region-scope, because his Ohio video is next-door East Palestine, not Youngstown itself.
