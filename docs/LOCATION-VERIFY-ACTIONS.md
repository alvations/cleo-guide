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
| **Overpass API** (overpass-api.de) | tags near a pin: lifecycle prefixes `disused:` / `was:` / `abandoned:` / `closed:` / `demolished:` ([Lifecycle prefix](https://wiki.openstreetmap.org/wiki/Lifecycle_prefix), [Key:disused:*](https://wiki.openstreetmap.org/wiki/Key:disused:*)), `shop=vacant` | [Overpass API wiki](https://wiki.openstreetmap.org/wiki/Overpass_API): fine under 10,000 queries and 1 GB per day, **÷100 for anything regular** (≈ 100 queries/day); send a UA, no parallel scripts, wait after 429/406; the main server is overloaded, so "use alternatives if possible". We batch 20 places into one query, so a city costs 1–36 queries. **Fallback:** a failed batch is retried once on [overpass.private.coffee](https://overpass.private.coffee/) (formerly overpass.kumi.systems): no rate limit, a meaningful User-Agent and POST asked, notice before > 10 req/s or > 10 parallel requests; provided as-is ([wiki list of instances](https://wiki.openstreetmap.org/wiki/Overpass_API)). We send one sequential query per 10 rows. | ODbL, as above. We store only *evidence* (a tag and its OSM URL), never coordinates from it. |
| **The place's official website** | schema.org `GeoCoordinates` / `PostalAddress` (JSON-LD), and a closure notice in the page text | [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309) robots.txt checked before every site (our token `CleoGuideLocationVerify`, else `*`). A 5xx on robots.txt means skip the site. One page per place (the URL from Wikidata P856, the OSM `website` tag or the registry `source`), ≥ 2 s apart per host, identifying UA. | The site states its own address; we store the fact plus the URL (rule 4a's first-choice source). |

### Out (and why)

| source | why it is out |
|---|---|
| Google Maps Platform, Apple Maps, Mapbox, HERE, Bing/Azure Maps | All need a key and a billing account. Google's service terms allow caching lat/lng for at most **30 days**, then require deletion ([Service Specific Terms](https://cloud.google.com/maps-platform/terms/maps-service-terms/index-20240522)), but `data/geocodes.json` stores coordinates permanently. The others have similar storage limits. Reading their pins through WebSearch snippets by hand stays as it is today. |
| Review-aggregator and booking sites (the ones CLAUDE.md names) | Never a source of truth (CLAUDE.md). Many registry rows already cite them for a *pin*; this tool never queries them. Its `NOT_OFFICIAL` filter also stops their URLs being treated as an "official site". |
| openstreetmap.org pages, tile servers, Nominatim "details" scraping | Forbidden by the OSMF policies; we use the APIs only. |
| US Census Geocoder | No key, but it returns **address-range interpolation**, not a place pin. Guard only; see § 2.2. |
| Singapore OneMap, Japan GSI / Address Base Registry, German state house coordinates, BKG | Phase 2. Terms, keys and licences are in § 2.2. |
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

### 2.2 Phase-2 sources: government geodata (terms read 2026-10-11, via WebSearch)

**Status of this table.** WebFetch is blocked here, so these terms come from search excerpts of the official pages
listed. Where an excerpt did not settle a point, the cell says **unconfirmed**. Read every cell marked unconfirmed
on the live page before adding the source.

**The key lesson.** The best government sources here are **bulk downloads, not query APIs**:

- German state house-coordinate files;
- Japan's Address Base Registry.

A runner can download a state or prefecture file once, cache it and match locally. That means no rate limit and no
per-request terms. It also means no place names: these give **address points**, not named places. Under § 4.2 they
grade `med` on their own. Paired with a matching Wikidata, OSM or official candidate within 40 m, they lift that
candidate to `high`.

#### Singapore OneMap

**Data.** Address and building search (postal code, block, road, building name), from the Singapore Land Authority
(SLA).

**Key.** **Yes, a free token.** An SLA workshop deck (Aug 2025) says a token is needed for every endpoint except
basemaps and staticmap. Tokens come from a registered email and password and last 3 days
([OneMap API workshop, SLA](https://www.onemap.gov.sg/apidocs/static/media/OneMap_API_Workshop_Demo_260825.6522ddef4affd370a81a.pdf)).
Older third-party write-ups saying search is open are out of date.

**Rate limit.** A "call rate limit" exists, but the figure is **unconfirmed**. The deck lists it without a number.
Ask onemap@sla.gov.sg ([ask.gov.sg](https://ask.gov.sg/sla/questions/cmbt7ovwe00ahs5f68ql9se2p)).

**Licence and storage.** Datasets are under the **Singapore Open Data Licence v1.0**, which permits use, download,
copy and modification, commercial or not. It requires a conspicuous notice naming the dataset and access date, with a
link to the licence ([API Terms of Service](https://www.onemap.gov.sg/legal/apitermsofservice.html),
[Singapore Open Data Licence](https://www.onemap.gov.sg/legal/opendatalicence.html)). **Storing results looks
allowed** by the licence, but no OneMap clause addresses caching or retention, so that point is **unconfirmed**. The
API terms add: keep credentials confidential; the Agency may monitor use; provided "as is", with no promise of
continued availability.

**Verdict. Usable, if the owner agrees to one free registered account** stored as an Actions secret. That breaks
this lane's "no keys" default, so it needs the owner's yes (§ 7, Q5). It covers Singapore (712 rows, the largest
backlog), which has postal codes on most buildings.

#### Japan: GSI address search (`msearch.gsi.go.jp`)

**Data.** Address to coordinate, as used by 地理院地図.

**Key.** None seen.

**Rate limit.** No published figure. The 地理院地図 terms say access may be blocked without notice under excessive
load ([地理院地図 利用規約](https://maps.gsi.go.jp/help/termsofuse.html)).

**Licence.** GSI content defaults to the **Public Data License 1.0 (PDL1.0)**: commercial use allowed, attribution
「出典：国土地理院ウェブサイト」 required, and edits must be stated
([国土地理院コンテンツ利用規約](https://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html),
[出典の記載](https://www.gsi.go.jp/LAW/2930-meizi.html)). But content fetched by API from an external database follows
**that provider's** terms. **No terms page for AddressSearch itself was found.**

**Verdict. Out for now.** The endpoint is undocumented and its terms are unconfirmed. Prefer the Address Base
Registry below.

#### Japan: Address Base Registry (アドレス・ベース・レジストリ, Digital Agency)

**Data.** The national address database (bulk download). It was built from GSI's 電子国土基本図, the justice
ministry's lot-area data, MLIT's 位置参照情報 and Japan Post postcodes. Town-block (町字) data is complete. Lot numbers
and residential block numbers (地番 / 住居表示) are a **trial release**
([デジタル庁 アドレス・ベース・レジストリ](https://www.digital.go.jp/policies/base_registry_address)).

**Key.** None (download site).

**Rate limit.** None; it is a one-off download.

**Licence.** Published free as open data. The Digital Agency site defaults to **PDL1.0** (attribution, edits stated)
([PDL1.0](https://www.digital.go.jp/resources/open_data/public_data_license_v1.0)). The per-dataset licence on the
download site is **unconfirmed**, as is its terms page
([base_registry_address_tos](https://www.digital.go.jp/policies/base_registry_address_tos)).

**Download.**
- Town master (`mt_town_all.csv.zip`, zipped UTF-8 CSV) is listed on the Digital Agency's registry catalogue
  ([日本 町字マスター](https://registry-catalog.registries.digital.go.jp/dataset/6d580ee7-0633-4942-a794-88b688e4c2e7/resource/0c2a98b1-6c5a-4484-abfa-e7306f3d3087)).
- The download site is [dataset.address-br.digital.go.jp](https://dataset.address-br.digital.go.jp/). Its town data
  became the official version in June 2025.
- The **direct file URL and the exact column headers** (e.g. `代表点_緯度`) were **not confirmed**. `--abr-file`
  fails loudly with the header it found if they differ.

**Verdict. Phase 2, recommended for Japan.** Okinawa (286 rows), Hokkaido, Osaka, Kyoto and Tokyo. Caveat: many
points are **town-block representatives, not buildings**. So it is a **wrong-town / wrong-block guard**, `low`
unless a house-level record exists, never a pin on its own. The Okinawa registry rows carry no postcodes; their
addresses must be matched in Japanese.

#### Germany: NRW (Geobasis NRW, Bezirksregierung Köln): use the open Gebäudereferenzen, not the house coordinates

> **Correction (2026-10-11).** An earlier version of this section said the official NRW **house coordinates** were
> open under dl-de/zero. **They are not.** Hauskoordinaten, with postal data, are obtained and **licensed through the
> Zentrale Stelle Hauskoordinaten und Hausumringe (ZSHH)** under AdV rules
> ([Geobasis NRW: Gebäudereferenzen](https://www.bezreg-koeln.nrw.de/geobasis-nrw/produkte-und-dienste/liegenschaftskataster/aktuelles-liegenschaftskataster/gebaeudereferenzen),
> [AdV-MIS: Hauskoordinaten NW](https://advmis.geodatenzentrum.de/trefferanzeige?docuuid=5cc6fe01-11e7-4293-bf85-1d8320e72022&plugid=%2Fingrid-group%3Aiplug-csw-dsc&docid=ioCm9XYBWW0O27vjPIOA)).
> The nationwide HK-DE product is CSV/UTF-8, but it also comes through ZSHH
> ([HK-DE documentation](https://sg.geodatenzentrum.de/web_public/gdz/dokumentation/deu/hk-de.pdf)). **Out.**

**Data.** The open product is the **Gebäudereferenzen** (building reference points) on **OpenGeodata.NRW**.
- It is a file server organised by product, with the geobasis products under `/produkte/geobasis/`
  ([Geobasis NRW: Open Data](https://www.bezreg-koeln.nrw.de/geobasis-nrw/open-data)).
- The Gebäudereferenzen carry **no postal information** (no postcode, no postal place name).

**Key.** None.

**Rate limit.** None; it is a one-off download.

**Licence.** **Datenlizenz Deutschland – Zero 2.0**: any use, no conditions (Geobasis NRW open-data page; GDI-DE
catalogue record). Municipal house-coordinate sets differ: Essen lists dl-de/zero and CC BY variants; Bottrop is
internal-only. Use the **state** Gebäudereferenzen only.

**Adapter.** Because there is no postcode, `--house-file` keys these on **town + street + house number** (it accepts
either postcode or town columns).

**Download URL.** **Not confirmed.** Search returned the portal and the product page, but no file path. A person
must take the path from the OpenGeodata.NRW listing before a download step is added.

**Verdict. Phase 2, recommended once the path is confirmed.**
- Covers Rhineland (270 rows: Cologne 50xxx, Düsseldorf 40xxx, Bonn 53xxx) and the German part of Aachen (202 rows,
  52xxx).
- These are building points, graded `med`; agreement within 40 m lifts a named candidate to `high`.

#### Germany: Rhineland-Palatinate house coordinates (LVermGeo RLP)

**Data.** Official house coordinates: statewide CSV, EPSG:25832, updated every 6 months
([product sheet](https://lvermgeo.rlp.de/fileadmin/lvermgeo/pdf/produktblaetter/HK.pdf)).

**Key.** None for the open-data download.

**Rate limit.** None; it is a one-off download.

**Licence.** LVermGeo open data is **dl-de/by-2.0**, free of charge. Credit "©GeoBasis-DE / LVermGeoRP, dl-de/by-2-0".
Whether the house-coordinate file itself carries that licence is **unconfirmed**
([geodatenkatalog record](https://gdk.gdi-de.org/geonetwork/srv/api/records/2f3290c3-4ce5-b904-5cc7-49381a2185d8)).

**Verdict. Phase 2.** The Trier / Mosel / Pfalz part of the Saarland region (54xxx, 55–57xxx, 67xxx).

#### Germany: Saarland house coordinates (LVGL Saarland)

**Data.** Official house coordinates and addresses from ALKIS, as WFS/WMS services.

**Key.** None seen for the open services.

**Rate limit.** None published. Each WFS layer is fetched once.

**Licence.** The 2025 metadata lists **CC BY 4.0** ("© GeoBasis DE/LVGL-SL"). The 2023/2024 INSPIRE address services
list **dl-de/by-2.0** ("©LVGL 2022, dl-de/by-2-0"). A 2016 house-coordinate dataset is marked **paid**, so it must be
avoided
([INSPIRE SL Adressen Hauskoordinaten](https://gdk.gdi-de.org/geonetwork/srv/api/records/6ea239e0-256e-ae6e-3d2d-95f75e210150)).

**Verdict. Phase 2.** The Saarland core of the Saarland region (66xxx). Use only the open (CC BY / dl-de/by) services.

#### Germany: BKG / AdV national geocoder

**Data.** OpenSearch and WFS geocoding of addresses and place names.

**Key.** **Licence required.**

**Licence.** Copyright. Free for authorities; **paid** for third parties, from €300 to €6,000+
([BKG-MIS](https://mis.bkg.bund.de/trefferanzeige?docuuid=9eceecf9-8af8-4ee0-b7bf-fac2becc2b80),
[GDZ functional services](https://gdz.bkg.bund.de/index.php/default/webdienste/funktionale-geodatendienste.html)).

**Verdict. Out:** paid and licensed. The state files above cover the same addresses openly.

#### US Census Geocoder

**Data.** Address to coordinate by **address-range interpolation** along TIGER road centrelines, placed at a
standard offset. The coordinates are "in the general vicinity", not at the building
([Census Geocoder documentation](https://www.census.gov/programs-surveys/geography/technical-documentation/complete-technical-documentation/census-geocoder.html),
[LUCA geocoder guide](https://www2.census.gov/programs-surveys/decennial/2030/program-management/luca/luca-geocoder-block-count-list-user-guide.pdf)).

**Key.** None.

**Rate limit.** **None published.** Batch files are capped at 10,000 records and 5 MB
([Geocoding Services API](https://geocoding.geo.census.gov/geocoder/Geocoding_Services_API.html),
[Geocoder FAQ](https://www2.census.gov/geo/pdfs/maps-data/data/Census_Geocoder_FAQ.pdf)).

**Licence and storage.** Federal work. "Public domain" is a third party's description; the official statement is
**unconfirmed**. The Census API terms bar re-identifying individuals or households and allow blocking over-limit use
([Census developer Terms of Service](https://www.census.gov/data/developers/about/terms-of-service.html)). Neither
matters for public businesses.

**Verdict. Phase 2, as a guard only.** Interpolated points are below our `med` bar ("adjacent door"), so it grades
`low`. Useful as a cheap **wrong-town / wrong-street check** for the US backlog (Miami, Orlando, Chicago, DC, Erie…)
using one batch call per city. Never a pin.

#### Luxembourg, France, Belgium, Netherlands (for the Saarland and Aachen regions; researched 2026-10-11)

Same caveat as above: these come from search excerpts, and anything marked **unconfirmed** must be read on the live
page before use. All four are **bulk address files or keyless services**, so they are address points (`gov-address`,
graded `med`), never named places.

##### Luxembourg: CACLR + BD-Adresses (ACT)

**Data.**
- The national register of localities and streets (CACLR) holds official street names, house numbers and
  postcodes, but **no coordinates**.
- **BD-Adresses** is the subset of those addresses enriched with coordinates, georeferenced from the cadastral
  parcel ([data.public.lu: CACLR](https://data.public.lu/en/datasets/registre-national-des-localites-et-des-rues)).

**Key and rate.** No key; a one-off download.

**Licence.**
- CACLR is **CC0** (updated 2025-03-05).
- BD-Adresses is listed as CC0 on its page, but a third party lists CC BY 1.0, so **unconfirmed**.
- The cadastral plan (PCN) it is based on is CC BY 4.0.

**Verdict. Phase 2.** Use BD-Adresses for the Luxembourg part of the Saarland region, after confirming the licence.

##### France: Base Adresse Nationale (BAN)

**Data.**
- National address points, as daily CSV exports on adresse.data.gouv.fr ("données nationales").
- Also a geocoder, now on the IGN Géoplateforme. The old `api-adresse.data.gouv.fr` was **decommissioned at the end
  of January 2026** ([CNIG, June 2026](https://cnig.gouv.fr/IMG/pdf/cnig_gt_assurances_19062026.pdf)).

**Key and rate.**
- No key.
- The old API allowed 50 requests per second per IP; the Géoplateforme quota is **unconfirmed**. Prefer the bulk
  CSV for one département.

**Licence.** API replies label it **ETALAB-2.0**; a 2017 page says ODbL. **Unconfirmed**: read adresse.data.gouv.fr.

**Verdict. Phase 2.** Use the département CSV for Moselle (Metz) in the Saarland region.

##### Belgium: BeST Address (the regional address registers, merged by BOSA)

**Data.**
- Address points for all three regions, in Lambert 72 (EPSG:31370) coordinates
  ([BeST TechSpec](https://urbisdownload.datastore.brussels/BeSt/TechSpec/BeStAddress_TechSpec_EN20240601.pdf)).
- Statbel also publishes a consolidated CSV/SQLite file with X-Y coordinates
  ([Statbel 2024](https://statbel.fgov.be/en/news/open-data-address-files-and-statistical-sectors-2024)).

**Key and rate.** No key; a one-off download.

**Licence. Mixed by region**
([transportdata.be](https://www.transportdata.be/dataset/address-points-belgium-best-address)):
- Brussels: UrbIS licence on the national entry, but **CC0** on the Brussels metadata
  ([Geobru](https://geobru-geonetwork.irisnet.be/geonetwork/srv/api/records/a8c9ccde-5c2b-11ed-913a-900f0cda5d5c)),
  so **unconfirmed**.
- Flanders: free-reuse licence.
- Wallonia: CC BY 4.0.
- In every case, the custodian must be named on public use.

**Verdict. Phase 2.** Covers the Belgian cities (Antwerp, Ghent, Bruges, Brussels, Liège) and the Belgian part of
Aachen. It **needs a Lambert 72 → WGS84 conversion**, which is not built yet.

##### Netherlands: PDOK Locatieserver (BAG)

**Data.** A geocoding service over the national address and building register (BAG) and other sources
([PDOK wiki: API Locatieserver](https://github.com/PDOK/locatieserver/wiki/API-Locatieserver)).

**Key and rate.** No key seen; the rate limit is **unconfirmed**.

**Licence.** Most PDOK data is described as **CC0** by a third-party catalogue
([atlas.co](https://atlas.co/data-portals/pdok/)); **unconfirmed** for the Locatieserver itself.

**Verdict. Phase 2,** after reading PDOK's terms. Covers the Dutch part of the Aachen region (Maastricht, Heerlen,
Vaals).

#### Coverage of the biggest backlogs

| backlog | rows (default scope) | phase-1 sources (in the prototype) | phase-2 addition |
|---|---|---|---|
| Singapore | 712 | Wikidata, Wikipedia, Nominatim, Overpass, official sites | **OneMap**, needs a free token, so the owner decides (§ 7, Q5) |
| Saarland region (Saarland, Rhineland-Palatinate, Luxembourg, France) | 409 | same | **LVGL Saarland** (66xxx) + **LVermGeo RLP** (54–57xxx, 67xxx) + Luxembourg **BD-Adresses** + France **BAN** (Moselle) |
| Okinawa | 286 | same; OSM coverage in Okinawa is uneven | **Address Base Registry**, as a guard only |
| Rhineland (Cologne, Düsseldorf, Bonn) | 270 | same | **Geobasis NRW Gebäudereferenzen** (dl-de/zero; the house coordinates themselves are licensed, not open) |
| Aachen (incl. Belgium and Netherlands) | 202 | same | **Geobasis NRW Gebäudereferenzen** for 52xxx; **BeST** (Belgium, needs Lambert 72) and **PDOK** (Netherlands) |
| San Francisco, Orlando, Chicago and other US cities | 183, 149, 122… | same | **Census Geocoder**, as a guard only |

**Prototype status (59c0144b).**

| adapter | flag | what it does |
|---|---|---|
| German house-coordinate / building-reference files | `--house-file <path>[::licence]` | Header-driven: `STN/HNR/ADZ/PLZ/ONM/OST/NORD` and aliases; UTM 32 or lat/lng. Exact postcode + street + number, or town + street + number when the file has no postcode (NRW Gebäudereferenzen) → `gov-address`, graded `med`. |
| Japan Address Base Registry | `--abr-file <path>` | Wrong-town guard notes only; never proposes a pin |
| OneMap | — | Postal-code search; reads `ONEMAP_EMAIL` / `ONEMAP_PASSWORD` if set. Without them it is skipped with a logged note; the token is never logged or reported. |

The same `gov-address` path will take the French, Luxembourg and Dutch files. The Belgian file first needs a
Lambert 72 converter.

**Not covered by any phase-2 source.** Restaurants without a Wikidata item, an OSM object or schema.org markup. That
tail stays with the WebSearch waves and `tools/geocode-helper.html`.

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
5. **Phase-2 sources** (§ 2.2). Should we register one **free OneMap account** for Singapore? It is stored as an
   Actions secret, which breaks the "no keys" default. And should the open German state house-coordinate files (NRW
   dl-de/zero, RLP dl-de/by, Saarland CC BY) and Japan's Address Base Registry be added as bulk address
   corroboration? Both would carry their attribution in each accepted pin's `source`.
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

## 8. Owner decisions — 2026-10-11

The owner answered the questions in §7 directly to the orchestrator (session_01PCNcUkfa5S1N1BKGzZA4xx, 2026-10-11): *"You
decide the answers to your question if you're asking for permissions then I say just yes."* The orchestrator recorded
these decisions first-hand. An agent lane that only hears them relayed should treat this section as the record.

1. **ODbL: yes.** An accepted OSM-derived coordinate may enter `data/geocodes.json`. Its `source` names the OSM object
   URL. The report and `docs/geoverify/ACCEPTED.md` carry the ODbL credit, and the site keeps its OSM map attribution.
   Rule 4a already lists OpenStreetMap as a verification source.
2. **Reviewer: an agent may review**, named in `review.by` (its session id), with a reason in `review.why`. The bar:
   - **Accept** `high` rows whose match is place-specific: an OSM POI whose name matches, a Wikidata item with P625, or
     the place's official site (JSON-LD).
   - **Accept** `med` rows only with a second, independent source that agrees within 50 m (for example the official site,
     or a map listing found through WebSearch), cited in `review.why`.
   - **Never accept** `low` rows, street-level matches, address-interpolation matches or `shared-object` rows. The tool
     enforces this.
   - **Closures** follow rule 4c: a real `statusSource` (an official notice, a news story, a map's "permanently closed"),
     applied through `tools/geo-merge.py`, and the place keeps its "— CLOSED" marker. A 404 is never evidence.
3. **Pace: yes.** A paced sweep of at most 300 Nominatim requests a day, one city per run, no self-hosting.
4. **Reports are committed** as the audit trail: a `commit=true` line in `docs/geoverify/REQUEST`, or a dispatch with
   `dry_run=false`. Reports are proposals; they never change the registry by themselves.
5. **Phase 2: yes.** Build the NRW, Rhineland-Palatinate and Saarland house-coordinate adapters, plus the Japan Address
   Base Registry as a wrong-town guard only, each with attribution. Research Luxembourg, France, Belgium and the
   Netherlands the same way. OneMap is approved, but it needs a login only the owner can create: the adapter reads
   `ONEMAP_EMAIL` / `ONEMAP_PASSWORD` from Actions secrets if they exist and skips with a logged note if not.
   Credentials are never requested in chat or committed.
6. **Quarterly status sweep: yes.** Status-only, with no Nominatim:
   `node tools/location-verify.js --status-sweep --shard <i>/3 --max-minutes 330`. The three shards run on different days
   and never in parallel. The schedule is added to the workflow and fires once the workflow is on the default branch.

Every accepted change still goes through the gates: `research.js --geocheck` and `--statuscheck` for the city, then
`npm run validate`, `npm test` and `npm run beta:check`, all before the push.

## 9. Incident — Nominatim pace exceeded, 2026-10-16

**What happened.** The agreed pace (§ 8, decision 3) is at most 300 Nominatim requests per UTC day, across all runs. The
tool enforced 300 per run instead. On 2026-10-16 the runs used about **1,570** Nominatim requests:

| city | Nominatim requests |
|---|---|
| singapore | 600 (two runs of 300) |
| washington-dc | 188 |
| philadelphia-pa | 172 |
| chicago-il | 203 (152 dry run + 51 commit run) |
| erie-pa | 144 |
| miami-fl | 136 |
| orlando-fl | 123 (121 + 2 re-check) |
| san-francisco-ca | 4 (re-check) |

These figures are reconstructed from the committed reports' `meta.requests.nominatim` and two superseded runs. Every
request was single-threaded, at most 1 per second, cached, and sent with an identifying User-Agent.

**Fix (c59aca30).** `docs/geoverify/NOMINATIM-LEDGER.json` records the per-day total across all runs and cities, and is
committed with each run. A live run caps `--nominatim-max` at the day's remaining allowance, then appends its own
count; tests cover both.

The ledger is a committed file rather than workflow cache. The cache is keyed per city, so it can't hold a cross-city
daily total. Runs that need Nominatim resume one per day: a daily wake-up pushes one REQUEST within that day's
allowance.

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
