# Location verification on GitHub Actions — feasibility study and proposal

_Lane: location verification · branch `claude/peaceful-goodall-i0hsrt` · 2026-10-11 · answers the owner's question
"Location verify, can we also use Actions for that?"_

## Verdict

**Feasible, as a proposal engine, not as an editor.** A GitHub-hosted runner can reach four key-free open sources:
Wikidata, Wikipedia (GeoData), OpenStreetMap through Nominatim and Overpass, and each place's own website. The
sandbox cannot. A runner job can look up every backlog row, grade what it finds, and write a **report** of proposed
pins and "needs-check" closure flags, each with source URL, retrieval date, matched name and address, distance from
the current pin, grade and licence.

The runner **never writes `data/geocodes.json`**. A person reviews the report row by row, applies the accepted rows
locally with `--accept`, and the existing gates decide (`research.js --geocheck/--statuscheck`, `npm run validate`,
`npm test`). That keeps rules 4a–4c intact. It replaces most of the sequential WebSearch waves for the easy majority:
places with a Wikidata item, a Wikipedia article, an OSM object or schema.org markup on their site. The hard tail
still goes to WebSearch waves or `tools/geocode-helper.html`: small restaurants that are in none of those.

What is in this commit:

| piece | path |
|---|---|
| the script (Node 20, no dependencies) | `tools/location-verify.js` |
| its tests (29 checks, no network) | `tools/location-verify.test.js` |
| synthetic fixtures (fictional places, `.example` URLs, mid-Atlantic coordinates) | `tools/location-verify-fixtures/testville.json` |
| first dry run, Wheeling (offline plan, since the sandbox is blocked) | `docs/geoverify/wheeling-wv.{json,md}` |
| proposed workflow (not committed: workflow files belong to the orchestrator) | [§ Workflow YAML](#workflow-yaml-to-add) |

## 1. Backlog today (from the repo's own data)

Generated with `node tools/location-verify.js --backlog`, which reads `data/geocodes.json` with the same rules as
`tools/geocode-status.py`: UNVERIFIED means `lat` is null or `source` is "UNVERIFIED". The **status unchecked**
column counts rows whose `status` is not `open`/`closed`, or whose `statusSource` is empty.

| city | entries | unverified | low | med | status unchecked | closed |
|---|---|---|---|---|---|---|
| aachen | 205 | 1 | 0 | 46 | 202 | 5 |
| akron-oh | 208 | 58 | 0 | 55 | 0 | 0 |
| antwerp | 138 | 1 | 1 | 15 | 0 | 3 |
| bruges | 125 | 2 | 2 | 9 | 0 | 1 |
| brussels | 141 | 1 | 1 | 13 | 0 | 1 |
| chicago-il | 484 | 117 | 0 | 50 | 18 | 8 |
| cincinnati-oh | 132 | 23 | 4 | 29 | 0 | 2 |
| cleveland-oh | 211 | 17 | 1 | 47 | 0 | 15 |
| columbus-oh | 127 | 41 | 2 | 31 | 0 | 3 |
| dayton-oh | 119 | 45 | 5 | 31 | 0 | 1 |
| erie-pa | 114 | 55 | 0 | 20 | 79 | 3 |
| ghent | 110 | 2 | 2 | 8 | 0 | 2 |
| harrisburg-pa | 210 | 39 | 0 | 85 | 0 | 1 |
| hokkaido | 514 | 102 | 0 | 196 | 0 | 0 |
| indianapolis-in | 217 | 61 | 3 | 63 | 0 | 1 |
| kyoto | 431 | 33 | 0 | 92 | 0 | 0 |
| liege | 152 | 7 | 0 | 91 | 7 | 1 |
| madison-wi | 211 | 55 | 0 | 51 | 0 | 5 |
| miami-fl | 400 | 75 | 2 | 109 | 32 | 11 |
| new-york-ny | 508 | 0 | 0 | 102 | 0 | 0 |
| okinawa | 516 | 91 | 195 | 81 | 7 | 7 |
| orlando-fl | 533 | 134 | 6 | 181 | 9 | 8 |
| osaka | 503 | 130 | 0 | 61 | 11 | 2 |
| philadelphia-pa | 418 | 55 | 0 | 123 | 49 | 10 |
| pittsburgh-pa | 212 | 0 | 1 | 38 | 0 | 4 |
| rhineland | 270 | 2 | 0 | 40 | 270 | 2 |
| saarland | 410 | 118 | 0 | 74 | 409 | 1 |
| san-francisco-ca | 579 | 183 | 0 | 53 | 0 | 4 |
| silicon-valley-ca | 172 | 19 | 0 | 55 | 0 | 0 |
| singapore | 1197 | 360 | 4 | 353 | 649 | 18 |
| state-college-pa | 80 | 30 | 1 | 15 | 2 | 8 |
| tokyo | 553 | 65 | 0 | 83 | 0 | 2 |
| washington-dc | 222 | 88 | 2 | 24 | 0 | 9 |
| wheeling-wv | 57 | 22 | 0 | 6 | 0 | 2 |
| youngstown-oh | 64 | 0 | 5 | 7 | 0 | 0 |
| **total** | **10543** | **2032** | **237** | **2337** | **1744** | **140** |

Plus **347 ship-worthy places not yet in the registry at all** (`docs/GEOCODE-BACKLOG.md`, mostly Miami, Philadelphia,
Kyoto and Chicago). They have no registry row to propose against. A later `--dataset` scope could take them from
`data/<city>.dataset.json`.

**The default scope (unverified ∪ low ∪ status-unchecked) is 3,450 rows**:

- the largest are Singapore 712, Saarland 409, Okinawa 286, Rhineland 270, Aachen 202 and San Francisco 183;
- New York has none;
- Wheeling has 22 and Youngstown 5.

Re-verifying the 2,337 `med` pins is a separate, optional sweep (`--scope med`).

## 2. Sources: what a runner may use, and why

Policies were read on 2026-10-11 through WebSearch (WebFetch is blocked here). They are summarised, with links.
Re-read each live page before the first production run: several say they change without notice.

### In

| source | what it gives | policy we must follow | licence of what we store |
|---|---|---|---|
| **Wikidata** Action API (`wbsearchentities`, `wbgetentities`) | P625 coordinate, P856 official website, P6375 street address, P281 postcode, **P576** dissolved/demolished, **P3999** date of official closure, **P5817** state of use | [User-Agent policy](https://foundation.wikimedia.org/wiki/Policy:Wikimedia_Foundation_User-Agent_Policy): a descriptive UA with contact, or you get blocked. [API etiquette](https://www.mediawiki.org/wiki/API:Etiquette): serial requests, `maxlag=5`, back off on lag errors. [API usage guidelines](https://foundation.wikimedia.org/wiki/Policy:Wikimedia_Foundation_API_Usage_Guidelines): no spreading load over many UAs, no floods of parallel connections. We do not use the SPARQL service (60 s deadline, per-client throttles, [query limits](https://www.wikidata.org/wiki/Wikidata:SPARQL_query_service/query_limits)); the Action API is enough. | **CC0**: structured data is public domain ([Wikidata:Licensing](https://www.wikidata.org/wiki/Wikidata:Licensing)). Best source to store. |
| **Wikipedia** GeoData (`prop=coordinates`) | the article's primary `{{coord}}`: the same "Wikipedia published coordinates" rule 4a already names | Same Wikimedia UA and etiquette rules ([API:Geosearch / GeoData](https://www.mediawiki.org/wiki/Extension:GeoData)) | A coordinate is a fact. Article text is [CC BY-SA 4.0](https://en.wikipedia.org/wiki/Wikipedia:Copyrights), so the `source` field names the article, as the registry already does. |
| **Nominatim** (nominatim.openstreetmap.org) | place search by name + address, address points, OSM tags (`website`, lifecycle prefixes) | [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/): **≤ 1 request/s, one thread, per application**; an identifying UA (library defaults are refused); **cache results**; bulk geocoding discouraged, but "one-time small jobs" are tolerated with caching; **no** systematic/grid queries, autocomplete, scraping or reselling. The service can be withdrawn at any time. The policy also asks that any LLM recommending it link the policy and state these limits, which this row does. | **ODbL**, © OpenStreetMap contributors ([attribution guideline](https://osmfoundation.org/wiki/Attribution)). See § 2.1. |
| **Overpass API** (overpass-api.de) | tags near a pin: lifecycle prefixes `disused:` / `was:` / `abandoned:` / `closed:` / `demolished:` ([Lifecycle prefix](https://wiki.openstreetmap.org/wiki/Lifecycle_prefix), [Key:disused:*](https://wiki.openstreetmap.org/wiki/Key:disused:*)), `shop=vacant` | [Overpass API wiki](https://wiki.openstreetmap.org/wiki/Overpass_API): fine under 10,000 queries and 1 GB per day, **÷100 for anything regular** (≈ 100 queries/day); send a UA, no parallel scripts, wait after 429/406; the main server is overloaded, so "use alternatives if possible". We batch 20 places into one query, so a city costs 1–36 queries. | ODbL, as above. We store only *evidence* (a tag and its OSM URL), never coordinates from it. |
| **The place's official website** | schema.org `GeoCoordinates` / `PostalAddress` (JSON-LD), and a closure notice in the page text | [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309) robots.txt checked before every site (our token `CleoGuideLocationVerify`, else `*`). A 5xx on robots.txt means skip the site. One page per place (the URL from Wikidata P856, the OSM `website` tag or the registry `source`), ≥ 2 s apart per host, identifying UA. | The site states its own address; we store the fact plus the URL (rule 4a's first-choice source). |

### Out (and why)

| source | why it is out |
|---|---|
| Google Maps Platform, Apple Maps, Mapbox, HERE, Bing/Azure Maps | All need a key and a billing account. Google's service terms allow caching lat/lng for at most **30 days**, then require deletion ([Service Specific Terms](https://cloud.google.com/maps-platform/terms/maps-service-terms/index-20240522)), but `data/geocodes.json` stores coordinates permanently. The others have similar storage limits. Reading their pins through WebSearch snippets by hand stays as it is today. |
| Review-aggregator and booking sites (the ones CLAUDE.md names) | Never a source of truth (CLAUDE.md). Many registry rows already cite them for a *pin*; this tool never queries them. Its `NOT_OFFICIAL` filter also stops their URLs being treated as an "official site". |
| openstreetmap.org pages, tile servers, Nominatim "details" scraping | Forbidden by the OSMF policies; we use the APIs only. |
| US Census Geocoder | No key, but it returns **address-range interpolation**, not a place pin: at best `med`, and its terms carry a use restriction that needs a reading. **Phase 2 candidate** for US address corroboration, pending the owner. |
| Singapore OneMap, Japan GSI address search, Belgian/German national registers | Government sources, and attractive. But this lane could not confirm their current key and terms through search: OneMap's token requirement conflicts between sources, and GSI's terms were not found. **Phase 2**, after someone reads each policy. Nominatim covers all of these countries meanwhile. |
| Wikidata Query Service (SPARQL) | Not needed. The per-entity API is lighter and its etiquette clearer. |

### 2.1 ODbL: what storing an OSM-derived coordinate means

The [OSMF attribution guideline](https://osmfoundation.org/wiki/Attribution) says a group of geocoding results need
not carry attribution on each result **unless it forms a Derivative Database**. Whether a registry that accumulates
hundreds of OSM-derived pins is "substantial" is unsettled: mailing-list views differ, and vendors read it as
insubstantial unless it is systematic. The design therefore:

1. **prefers CC0 / own-fact sources:** a Wikidata, Wikipedia or official-site coordinate outranks an OSM one of the
   same grade;
2. records `© OpenStreetMap contributors (ODbL)` in the `source` of every accepted OSM-derived pin (the accept step
   writes the OSM object URL; the report prints the attribution line);
3. relies on the guide pages already crediting OpenStreetMap on every map;
4. raises the ODbL question for the owner (§ 7, Q1) before any bulk acceptance.

## 3. How it fits rules 4a–4c

| rule | how the design keeps it |
|---|---|
| **4a**: every coordinate fact-checked against a real source, recorded with source and date | Every proposal carries `sourceUrl`, `retrieved` (the date the response was fetched, kept in the cache), `matchedName`, `address`, `distanceM`, `grade` and `licence`. With no candidate there is no proposal (`no-match`), and nothing is estimated. The runner writes only `docs/geoverify/<city>.{json,md}`. `--accept` refuses to run when `GITHUB_ACTIONS`/`CI` is set, so the registry changes only on a person's machine. |
| **4b**: place pins not viewports, graded high/med/low | Coordinates come only from place objects: Wikidata P625, Wikipedia's primary `{{coord}}`, an OSM POI or address node, the site's schema.org `geo`. No map viewport exists in any of these APIs. Grades follow docs/SOURCES.md (below). `low` is reported and never proposed; a street or other non-place OSM object is always `low`. |
| **4c**: status verified, closed places stay flagged | Closures are only **proposed**, as `status-needs-check (possible closure)`, with evidence: Wikidata P576/P3999 dates, OSM lifecycle-prefixed tags or `shop=vacant` on the matched object, or a closure sentence on the official site (quoted in context). **An HTTP error, a 404 or a dead domain is never evidence**: the row gets a note saying so. A former name alone (`was:name`) is not evidence either. A reviewer who confirms a closure marks `accept-closed` with their own `statusSource`. `--accept` turns that into a `tools/geo-merge.py` wave file, so the one existing place that applies the "— CLOSED" marker and renames the research record does it. Closed places are never deleted. |
| gates | After `--accept`, the reviewer runs `node tools/research.js --geocheck <city>`, `--statuscheck <city>`, `cd tools && npm run validate && npm test`. |
| audit trail | `--accept` appends one line per applied row to `docs/geoverify/ACCEPTED.md` (date, city, place, before → after, source, reviewer, reason). The accepted pin's `source` field itself names the reviewer and reason. Rows that need `by` + `why` and lack them are refused, as are downgrades (a `med` proposal over a `high` pin) and `conflict` rows without `overrideConflict: true`. Record counts are asserted before writing (CLAUDE.md rule 2). The reviewed report JSON is committed next to the ledger, so the row → decision → registry change chain is in git. |

## 4. Design

### 4.1 Workflow

`workflow_dispatch` only, with no schedule: a periodic job is exactly what the Nominatim policy calls bulk.

| input | values | default |
|---|---|---|
| `city` | a key of `data/geocodes.json`, checked against `^[a-z0-9-]+$` | `wheeling-wv` |
| `scope` | `unverified,low,med,high,status,all` | `unverified,low,status` |
| `limit` | rows this run (0 = all) | `0` |
| `nominatim_max` | Nominatim requests this run | `300` |
| `dry_run` | `true`: report goes to a workflow artifact only. `false`: also commit `docs/geoverify/<city>.{json,md}` to the branch, and nothing else (a guard step fails the job if any other path changed). | `true` |

A `concurrency: location-verify` group queues runs one at a time, which keeps us to one client towards Nominatim and
Overpass. The response cache (`~/.cache/cleo-location-verify`) is persisted with `actions/cache`, so reruns and
neighbouring cities never re-ask the same question.

### 4.2 The script: `tools/location-verify.js`

For each in-scope row it goes cheapest and most authoritative first:

1. **Wikidata.** Use the QID if the registry `source` names one (571 rows do), else search by name. Keep items with
   P625 inside the city radius, and require name similarity ≥ 0.8 unless the item was linked.
2. **Wikipedia.** Fetch the GeoData primary coordinate of the Wikidata sitelink, or of the article already cited in
   `source` (3,701 rows cite Wikipedia).
3. **Nominatim**, only if there is no `high` candidate yet. Query name + address, then the bare address if it has a
   house number, inside a bounded viewbox around the city.
4. **Official site.** Take the URL from Wikidata P856, the OSM `website` tag or the registry `source` (never a
   review, map or social site). Check robots.txt, fetch one page, read the JSON-LD `geo`/`address` and any closure
   notice.
5. **Overpass**, batched 20 rows per query. Fetch named objects within 80 m of each row's point (current or
   proposed pin), including `old_name`/`was:name`/`disused:name`, and keep lifecycle evidence.

**City anchor and radius.** The anchor is the median of the city's `high` pins. The radius is 1.5 × the 95th
percentile spread, kept between 25 and 150 km (regions such as Wheeling → Zanesville are wide). A candidate outside
the radius is discarded as "same name elsewhere". A postcode mismatch lowers the grade by one level.

**Matching heuristics.**

- **Name.** Normalise: drop "— CLOSED", parentheticals and "the"/"a"; `&` becomes "and"; strip diacritics and
  punctuation. Similarity is the higher of token overlap (containment-aware, so "Later Alligator" ≈ "Later Alligator
  Restaurant") and bigram Dice.
- **Address.** Compare house number, the street's core words (with abbreviations normalised) and postcode.
- **Grades.**

| grade | when |
|---|---|
| `high` | a published place coordinate (Wikidata, Wikipedia, official schema.org) with matching name; or an OSM place object whose name **and** house number/street agree; or a `med` corroborated within 40 m by an independent source |
| `med` | an OSM place object whose name matches but address isn't corroborated; or the exact address point (the building, not a named place) |
| `low` | anything else (never proposed); also forced when the house number disagrees |

**Outcomes and distance thresholds.**

| outcome | when |
|---|---|
| `pin` | the registry has no coordinate and the best candidate is ≥ med |
| `confirm` | ≤ 30 m from the current pin (refresh source and date; upgrade confidence if the grade is higher) |
| `move` | 30–250 m away, with a grade ≥ the current confidence (the 4b viewport error was ~200 m) |
| `conflict` | > 250 m away; a person must look, and `--accept` needs `overrideConflict` |
| `ambiguous` | two ≥ med candidates with matching names more than 150 m apart (1.5 km for extended features), and neither outranks the other. Nothing is proposed; both are listed. |
| `no-match` | nothing ≥ med |

**Extended features** (parks, trails, districts, bridges, markets, islands…) are pinned to an entrance or most-visited
point, while Wikidata/Wikipedia give a centroid. For these, a distance under 1.5 km is `confirm` with a note, never a
move.

### 4.3 Rate plan and caching

| host | spacing | cap per run | notes |
|---|---|---|---|
| nominatim.openstreetmap.org | 1.1 s, single thread | `--nominatim-max` (300) | cached; skipped when a high candidate already exists |
| overpass-api.de | 5 s | 1 query per 20 rows | 60 s back-off on 429/503/504 |
| www.wikidata.org / en.wikipedia.org | 0.3 s, serial, `maxlag=5` | — | 30 s back-off on 429/503 |
| official sites | 2 s per host | 2 requests per place (robots.txt + one page) | — |

All requests stop at `--max-requests` (3,000). On a budget stop the report marks the remaining rows `skipped`, and a
rerun resumes from cache. Cache entries are reused for 30 days (`--cache-ttl-days`). 429/5xx responses are never
cached.

### 4.4 Run time and cost

Costs are estimated by the script (`estimate()`): per row ≈ 2 Wikidata + 0.5 Wikipedia + up to 1.5 Nominatim +
1.2 official-site + 0.05 Overpass requests, at the spacings above, so **≤ 6.2 s per row**.

| run | rows | requests | Nominatim | wall time |
|---|---|---|---|---|
| Wheeling, default scope | 22 | ~116 | ≤ 33 | ~3 min |
| Youngstown, all rows | 64 | ~336 | ≤ 96 | ~7 min |
| Singapore, default scope (largest) | 712 | ~3,700 | ≤ 1,070 | ~75 min (four 300-Nominatim runs) |
| **every city, default scope** | **3,450** | **~18,100** | **≤ 5,200** | **~6 h of runner time**, spread over ≥ 18 dispatches |
| every row of every city (`all`) | 10,543 | ~55,000 | ≤ 15,800 | ~18 h; **not recommended** with public Nominatim |

**Cost:** standard GitHub-hosted runners are free and unlimited on public repositories ([Billing and
usage](https://docs.github.com/en/actions/concepts/billing-and-usage)). If the repo is private, ~6 h is ~360 minutes
of the monthly free allowance. Each job must stay under the 6-hour job limit ([Actions
limits](https://docs.github.com/en/actions/reference/limits)), so one city per dispatch it is. **Nominatim pacing:**
keep the whole backlog to ≤ 300 Nominatim requests per run and about one run a day. The ~5,200 are then a one-time
sweep over ~2–3 weeks, cached, which is the "one-time small job" shape the policy tolerates. If the owner wants
faster, or a recurring sweep, the policy's own answer is a self-hosted Nominatim (§ 7, Q3).

### 4.5 Failure modes

| failure | behaviour |
|---|---|
| sources unreachable (the sandbox) | offline plan report: rows `planned`, the queries it would make, an estimate; exit 0 |
| 429/503 or lag | per-host back-off; that source is skipped for the row and the failure listed in `meta.requests.failures`; exit 4 if > 25 % of requests fail (report still written) |
| budget reached | remaining rows `skipped`; rerun resumes from cache |
| official site down or blocking | note only ("NOT closure evidence"); robots.txt 5xx means skip, 4xx means allowed (RFC 9309) |
| a wrong match | defended by the radius, viewbox, name/address agreement, ambiguity rule and grade rules, and finally by the human review: the runner never applies anything |
| registry renamed between run and accept | `--accept` refuses that row ("no longer in the registry") |
| concurrent pushes to the branch (`dry_run=false`) | the workflow only adds `docs/geoverify/<city>.*`; merge-and-retry push as in `beta-fetch-unsplash.yml` |

### 4.6 Ambiguity

When in doubt, nothing is proposed and the candidates are listed (up to six, each with grade, name similarity,
distance and source) so the reviewer can choose. A reviewer may accept a non-best candidate by editing `proposal` in
the JSON; the edited value still needs `by` + `why` and passes the same downgrade and count checks.

## 5. Review flow (what a person does)

1. **Dispatch** `location-verify` with `city=wheeling-wv`, `dry_run=true`. Download the artifact, or rerun with
   `dry_run=false` to get `docs/geoverify/wheeling-wv.{json,md}` on the branch.
2. **Review each row in the `.md`, and decide in the `.json`.** Set `review.decision` to `accept`, `reject`, or
   `accept-closed` (the last only with `review.statusSource`, the evidence you read yourself), plus `review.by`,
   `review.why` and `review.date`. For a closure, check one more independent source if you can, exactly as rule 4c
   asks.
3. **Apply** with `node tools/location-verify.js --accept docs/geoverify/wheeling-wv.json`. Use `--dry-run` first to
   see what it would do. If there are closures, also run
   `python3 tools/geo-merge.py wheeling-wv --only "_geoout_lv_*.json"`.
4. **Run the gates:** `node tools/research.js --geocheck wheeling-wv && node tools/research.js --statuscheck
   wheeling-wv && (cd tools && npm run validate && npm test)`. Then rebuild the city (`python3
   tools/build-wheeling.py`) and run `python3 tools/geocode-status.py`.
5. **Commit** the registry change, the reviewed report JSON and `docs/geoverify/ACCEPTED.md` together. Note the run
   in `data/<city>-research/AUDIT.md` under stage 5 (docs/PIPELINE.md).

## 6. Prototype status and the first dry run

- `node tools/location-verify.test.js` **passes 29/29** with no network. It covers name, address and distance
  matching, grading, every outcome and threshold, RFC 9309 robots, JSON-LD parsing, closure-text false positives
  ("Closed on Mondays"), "404 is not closure", the wrong-town guard, the extended-feature rule, the accept step's
  refusals (no reviewer, a downgrade, a conflict, CI) and a backlog cross-check against an independent count of the
  real registry. **The fixtures are hand-written, synthetic and fictional**, shaped like the real API responses,
  because nothing could be recorded from here. The first live run should keep its cache as the first *recorded*
  fixtures (the cache files are the raw responses).
- **Wheeling** (`docs/geoverify/wheeling-wv.{json,md}`): the 22 default-scope rows are all UNVERIFIED pins, mostly
  food. The run detected that Wikidata is unreachable here (ENOTFOUND) and wrote the **offline plan**: the queries
  per row and an estimate of ~116 requests, ≤ 33 Nominatim, ~3 min. **No proposals exist yet**; they come from the
  first runner dispatch.
- The test file is not yet wired into `npm test`, because `tools/package.json` is outside this lane's commit scope.
  Suggested: append `&& node location-verify.test.js` to the `test` script.

## 7. Risks and open questions for the owner

1. **ODbL.** May accepted OSM-derived coordinates go into `data/geocodes.json` (credited in `source`, with the map
   pages' existing OSM attribution)? Or should OSM be corroboration-only, so that only Wikidata, Wikipedia or
   official coordinates are ever accepted? The latter is legally simplest, but fewer restaurants would resolve.
2. **The reviewer.** Is a person always required, or may an agent review in a later lane, with its session named in
   `review.by`? The design allows either; the CI refusal stays regardless.
3. **Nominatim volume.** Is a ~2–3 week paced sweep at ≤ 300/day acceptable? Or should the ~5,200 backlog lookups go
   to a self-hosted Nominatim, the policy's answer for anything bigger or recurring? A self-hosted container on a
   runner is possible for a single country extract, at a few GB and ~1 h of import.
4. **Auto-commit of reports.** Should `dry_run=false` push report files to the branch, or should reports stay as
   workflow artifacts (90-day retention) with only reviewed ones committed?
5. **Phase-2 sources.** Should someone read the terms of OneMap (Singapore, the largest backlog), GSI (Japan) and the
   US Census Geocoder, so they can be added as government sources?
6. **Status freshness.** Every `statusChecked` today is from 2026-08 to 2026-10. Should a quarterly `--scope status`
   sweep (Wikidata + Overpass + official sites only, with **no Nominatim**: ~34k requests and ~12 h across all cities)
   become routine?

**Risks.**

- **False closure flags.** Mitigated: evidence only, never a status change, and the 404 rule.
- **Same-name places in wide regions** (150 km radius). Mitigated by the bounded viewbox, address agreement and
  ambiguity rule.
- **OSM coverage is thin for small US restaurants.** Expect many `no-match` rows for food; those still need the
  WebSearch or helper path.
- **Policy drift.** Re-read the policies listed in § 2 before production; the Nominatim policy says it may change
  without notice.
- **Website text in another language** (Japanese, German, Dutch, French sites). The closure-phrase detector is
  English-only for now, so it misses closures there; it never produces a false "closed".

## Workflow YAML to add

Path: `.github/workflows/location-verify.yml`. Not committed by this lane; the orchestrator owns workflow files.

```yaml
# Location verification: PROPOSE pin / address / open-closed corrections for one city from open, key-free sources
# (Wikidata, Wikipedia GeoData, OSM Nominatim + Overpass, the place's own website).
#
# Why this runs on GitHub Actions: the authoring sandbox cannot reach those hosts (org egress policy); a GitHub-hosted
# runner can. The job writes a REPORT only (docs/geoverify/<city>.{json,md}). It never touches data/geocodes.json:
# a person reviews the rows and applies accepted ones locally with `node tools/location-verify.js --accept`, then the
# gates run (research.js --geocheck/--statuscheck, npm run validate, npm test). Design: docs/LOCATION-VERIFY-ACTIONS.md.
#
# Manual dispatch only, never on a schedule (the Nominatim usage policy discourages periodic bulk geocoding). One run at
# a time (concurrency group), so we are a single, polite client towards Nominatim and Overpass.
name: location-verify

on:
  workflow_dispatch:
    inputs:
      city:
        description: "City key in data/geocodes.json (e.g. wheeling-wv)"
        required: true
        default: wheeling-wv
      scope:
        description: "Rows to check: unverified,low,med,high,status,all (comma-separated)"
        required: false
        default: unverified,low,status
      limit:
        description: "At most this many rows (0 = all in scope)"
        required: false
        default: "0"
      nominatim_max:
        description: "Nominatim requests this run (policy: <= 1/s, cached; keep the daily total modest)"
        required: false
        default: "300"
      dry_run:
        description: "true = report as a workflow artifact only; false = also commit docs/geoverify/<city>.* to the branch"
        type: boolean
        required: false
        default: true

permissions:
  contents: write

concurrency:
  group: location-verify
  cancel-in-progress: false

jobs:
  verify:
    runs-on: ubuntu-latest
    timeout-minutes: 340
    env:
      CITY: ${{ github.event.inputs.city }}
      SCOPE: ${{ github.event.inputs.scope }}
      LIMIT: ${{ github.event.inputs.limit }}
      NOMINATIM_MAX: ${{ github.event.inputs.nominatim_max }}
      DRY_RUN: ${{ github.event.inputs.dry_run }}
      LV_CACHE_DIR: ${{ github.workspace }}/../lv-cache
    steps:
      - uses: actions/checkout@v4
        with:
          ref: claude/peaceful-goodall-i0hsrt

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Check inputs
        run: |
          [[ "$CITY" =~ ^[a-z0-9-]+$ ]] || { echo "::error::bad city key '$CITY'"; exit 1; }
          [[ "$SCOPE" =~ ^[a-z,]+$ ]] || { echo "::error::bad scope '$SCOPE'"; exit 1; }
          [[ "$LIMIT" =~ ^[0-9]+$ ]] || { echo "::error::bad limit '$LIMIT'"; exit 1; }
          [[ "$NOMINATIM_MAX" =~ ^[0-9]+$ && "$NOMINATIM_MAX" -le 1000 ]] || { echo "::error::nominatim_max must be 0..1000"; exit 1; }
          node -e "const c=require('./data/geocodes.json').cities; if(!c[process.env.CITY]){console.error('::error::unknown city '+process.env.CITY); process.exit(1)}"

      - name: Restore the response cache (the Nominatim policy requires caching; reruns resume)
        uses: actions/cache@v4
        with:
          path: ${{ github.workspace }}/../lv-cache
          key: location-verify-${{ github.event.inputs.city }}-${{ github.run_id }}
          restore-keys: |
            location-verify-${{ github.event.inputs.city }}-
            location-verify-

      - name: Unit tests (no network)
        run: node tools/location-verify.test.js

      - name: Verify (writes docs/geoverify/<city>.json and .md only)
        run: |
          args=(--city "$CITY" --scope "$SCOPE" --nominatim-max "$NOMINATIM_MAX")
          [ "$LIMIT" != "0" ] && args+=(--limit "$LIMIT")
          node tools/location-verify.js "${args[@]}"

      - name: Guard - the registry and everything else are untouched
        run: |
          changed=$(git status --porcelain | awk '{print $2}' | grep -v '^docs/geoverify/' || true)
          if [ -n "$changed" ]; then echo "::error::unexpected changes:"; echo "$changed"; exit 1; fi

      - name: Upload the report
        uses: actions/upload-artifact@v4
        with:
          name: geoverify-${{ github.event.inputs.city }}-${{ github.run_id }}
          path: docs/geoverify/${{ github.event.inputs.city }}.*

      - name: Commit the report (dry_run=false only)
        if: ${{ github.event.inputs.dry_run == 'false' }}
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add "docs/geoverify/$CITY.json" "docs/geoverify/$CITY.md"
          if git diff --cached --quiet; then echo "No report change."; exit 0; fi
          git commit -m "Location-verify report: $CITY (proposals only; review + --accept + gates before any registry change)"
          # Other lanes push to this branch while the job runs. This job adds only docs/geoverify/<city>.*; any merge
          # conflict outside that stops the job; a conflict on our own report keeps ours (it is the fresh run).
          for i in 1 2 3; do
            git fetch origin claude/peaceful-goodall-i0hsrt || { sleep $((i * 10)); continue; }
            if ! git merge --no-edit origin/claude/peaceful-goodall-i0hsrt; then
              conflicted=$(git diff --name-only --diff-filter=U)
              if printf '%s\n' "$conflicted" | grep -v "^docs/geoverify/$CITY\." | grep -q .; then
                echo "::error::merge conflict outside the report:"; printf '%s\n' "$conflicted"; git merge --abort; exit 1
              fi
              git checkout --ours -- "docs/geoverify/$CITY.json" "docs/geoverify/$CITY.md"
              git add "docs/geoverify/$CITY.json" "docs/geoverify/$CITY.md" && git commit --no-edit
            fi
            git push origin HEAD:claude/peaceful-goodall-i0hsrt && exit 0
            sleep $((i * 10))
          done
          exit 1
```
