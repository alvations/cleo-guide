# Beta image sources — source matrix (D-50)

**Owner:** image sources lane (session_013vyq3aW2ChR6a7LBNQufNy). **Last updated:** 2026-10-17.
Research notes with every quote and its URL: [design/beta/imagery-sources/matrix-research.md](../design/beta/imagery-sources/matrix-research.md)
(WebSearch only; page fetches are blocked here, so each quote is search-snippet text and is re-checked by the API at fetch time).
Code: [tools/beta/imagery/sources/](../tools/beta/imagery/sources/README.md). Candidates: `tools/beta/imagery/sources/candidates.tsv`.

Imagery keeps Wikimedia Commons, Flickr CC (Openverse), Unsplash and the credit gate (`photos.js`). This lane's sources
feed the same gate. Nothing here is credited before contact-sheet review.

## Ranking

| Rank | Source | Why |
|---|---|---|
| 1 | **Library of Congress** — Carol M. Highsmith Archive + HABS/HAER | Highest US yield by far (61 candidates, 41 targets in wave 1). Highsmith and U.S. Government work are public domain; modern colour photos, so no "still looks like this?" doubt. No key. Slow: 20 requests a minute |
| 2 | **Europeana** (open rights only) | The only open route to many Belgian and Rhineland landmarks: Rijksmuseum dataset 90402 (public domain 1850–1900 prints). Every row is historic, and most Rijksmuseum creators are "anonymous", which our rule refuses (decision asked below) |
| 3 | **Smithsonian Open Access** | Safest licence (CC0), but few CC0 building exteriors: most Archives photos are "Usage conditions apply". DC only |
| 4 | **The Met** | CC0 and no key, but yield is tiny: a few 19th-century photographs that name a US place |
| 5 | **Pexels** | Large modern yield for famous landmarks (Japan, Europe), stock licence: landmarks and heroes only, needs the gate change |
| 6 | **Pixabay** | As Pexels, with the highest licence-laundering and trademark risk; contact-sheet review must look for re-uploads |
| 7 | **NYPL** | Public-domain items only; v1 API deprecated, v2 not documented in anything we could find. Wave 1 found no usable NY item. Not built |
| — | **USGS** | Public domain, but EarthExplorer imagery (Landsat, 30 m) is not a place photo, and D-50 rejected satellite. One USGS *ground* photo (Battery Weed) is listed as a manual candidate; no fetcher |
| — | **OpenStreetMap** | Maps already use OSM tiles; the tile policy forbids pre-emptive/bulk fetching, so no static map images are baked from tiles |

## Openverse first (orchestrator, 2026-10-17)

Imagery owns `fetch-openverse.js` (licence filter cc0/pdm/by/by-sa). For a source Openverse indexes, the route is Openverse;
this lane then supplies candidate finding, identification evidence and review lists only.

| Source | Indexed by Openverse? (evidence) | Route |
|---|---|---|
| Smithsonian | **Yes** — "Smithsonian Institution" and "Smithsonian Institution Archives" in the sources list (archived openverse.org/sources, 2024-05) | Openverse for search; smithsonian.js kept for exact-record reads by id (CC0 per media item is only in the EDAN record) |
| The Met | **Yes** — "Metropolitan Museum of Art · 387,715" (same list) | Openverse; met.js kept (no key, exact `isPublicDomain` per object) |
| Europeana | **Yes** — "hundreds of valuable sources through a single integration with the Europeana API" (Openverse) | Openverse for the open subset; europeana.js kept for exact `edm:rights` by record (needs the key) |
| Library of Congress | **No** — not in the 2024 list | **loc.js** (dedicated) |
| NYPL | **Not found** in any list seen | not built (v2 API undocumented; 0 NY candidates) |
| Pexels | **Not found** (Openverse lists StockSnap, rawpixel, WordPress Photo Directory, Flickr) | pexels.js, pending the terms check below and a yield sample |
| Pixabay | **Not found** | not mapped (no candidates; no photo ids from search) |

Sources: https://webcf.waybackmachine.org/web/20240530000914/https://openverse.org/sources ·
https://make.wordpress.org/openverse/2022/01/25/everything-you-need-to-know-about-openverse-and-the-wordpress-photo-directory/ ·
https://www.searchengineworld.com/review-openverse-public-domain-works-search-engine

## Stock APIs: storing copies, hotlinking, attribution (D-51 lesson)

- **Pexels.** API guidelines: "Whenever you are doing an API request make sure to show a prominent link to Pexels" and "Always
  credit our photographers when possible (e.g. "Photo by John Doe on Pexels" with a link to the photo page on Pexels)"; no copying
  of core functionality (https://python-pexels.readthedocs.io/en/stable/guidelines.html, a mirror of
  https://www.pexels.com/api/documentation/). **No rule requiring hotlinking or forbidding stored copies was found** in any
  result; the licence itself allows download and modification. Caveat: the official English page was never returned by search, so
  the absence of a hotlink rule is not proven. Our credit already gives "Photo by <name> on Pexels" + a Pexels link.
- **Pixabay.** Secondary sources agree: "requests must be cached for 24 hours", images are to be downloaded to your own server and
  "permanent hotlinking … is not allowed", "Systematic mass downloads are not allowed" (https://www.rubydoc.info/gems/pixabay_api/0.0.1,
  https://pkg.go.dev/github.com/fdddf/pixa, https://blog.laozhang.ai/en/posts/free-image-api). Self-hosting is the expected use.
  Official wording not returned by search.
- Both: the orchestrator ranks them LOW for our gaps (feasibility report); a 20-target yield sample decides. Wave 1+2 found
  33 Pexels candidates for 26 landmarks from about 45 searches; Pixabay 0 (search returns listing pages, never photo ids).

## D-52 decisions applied

- Anonymous creators: allowed only on a public-domain/CC0 row with `era: historic`, where the institution itself catalogues the
  maker as anonymous/unknown; the credit reads "Anonymous (as catalogued by <institution>)". lib.js `itemProblems`, tested.

## Matrix

| Source | Licence (quoted; URL) | API | Key (Actions secret) | Rate limit | Actions? | TASL mapping | Yield for our gaps | Risks |
|---|---|---|---|---|---|---|---|---|
| Library of Congress | Highsmith: "Ms. Highsmith has stipulated that her photographs are in the public domain" (LoC rights page, mirrored on Commons). HABS: "No known restrictions on images made by the U.S. Government". Others: "No known restrictions on publication" — a catalogue note, not a clearance (https://guides.loc.gov/digital-scholarship/faq) | `https://www.loc.gov/item/<id>/?fo=json`; images tile.loc.gov | none | "Requests per minute: 20. Time blocked, if rate is exceeded: 1 hour" (https://www.loc.gov/apis/json-and-yaml/working-within-limits/) | yes (no key; `--delay 3200`) | T `item.title` · A `contributor_names[0]` · S item page · L rights advisory → Public domain / No known restrictions; date `item.date` | US: 41 of 164 tier-1 gaps in wave 1 (DC 7, SF 8, Chicago 8, Philadelphia 8, Miami 4, + 6) | CAPTCHA/429 throttling (the fetcher stops and resumes); artworks inside a Highsmith photo can carry their own copyright (sculpture memorials: review) |
| Europeana | Per item `edm:rights`. Open = CC0, PDM, CC BY, CC BY-SA ("REUSABILITY:open", https://pro.europeana.eu/blog/can-i-use-it). InC, InC-EDU, NoC-NC, NoC-OKLR, CNE refused | `https://api.europeana.eu/record/v2/<ds>/<rec>.json`; full image `edmIsShownBy` | `EUROPEANA_API_KEY` | none published | yes | T `dcTitle` · A `dcCreator` (agent prefLabel) · S europeana.eu/item page · L `edmRights` URI; date `dcDate`; institution `edmDataProvider` | Europe: 17 of 137 gaps (Aachen, Antwerp, Brussels, Ghent, Liège, Rhineland, Saarland day trips), all historic | Most Rijksmuseum creators are "anonymous"; image servers are the providers' own (may be slow/unreachable) |
| Smithsonian | "Items marked CC0 are dedicated to the public domain" (https://www.si.edu/openaccess/faq); restricted items "have … CC0 [metadata], but no media file" | `https://api.si.edu/openaccess/api/v1.0/content/edanmdm:<id>`; images ids.si.edu | `SMITHSONIAN_API_KEY` (api.data.gov) | 1,000 an hour per key (https://api.data.gov/docs/developer-manual/) | yes | T `title.content` · A `freetext.name` (photographer/maker) · S `record_link` · L `metadata_usage.access == CC0`; date `freetext.date` | DC: 4 targets (Patent Office/SAAM, Mount Vernon, Great Falls, Jefferson Memorial); Air & Space and Natural History exteriors are not CC0 | "Usage conditions apply" with "No restrictions" text is NOT CC0 (refused); name traps (pre-1976 "Air and Space Building", pre-1910 "National Museum") |
| The Met | "The policy utilizes the Creative Commons Zero (CC0) designation" (https://www.metmuseum.org/press/news/2017/open-access) | `https://collectionapi.metmuseum.org/public/collection/v1/objects/<id>`; images images.metmuseum.org | none | ~80/s (third-party guide; not official) | yes | T `title` · A `artistDisplayName` · S `objectURL` · L `isPublicDomain` → CC0; date `objectDate` | 2 (Mount Vernon 1889, Great Falls) | Many photographs have no image; objects only on the Met's own page |
| Pexels | "Don't sell unaltered copies …", "Don't imply endorsement …" (https://help.pexels.com/hc/en-us/articles/360042332714); licence https://www.pexels.com/license/ | `https://api.pexels.com/v1/photos/<id>`, header `Authorization` | `PEXELS_API_KEY` | "200 requests per hour and 20,000 requests per month" (https://pexels.com/api/documentation/) | yes | T `alt` / page slug · A `photographer` · S `url` · L Pexels License | Japan and European landmarks (wave 1 under way) | Uploader laundering; no property releases; brands in shot |
| Pixabay | Commercial use allowed, attribution not required; no standalone resale; no commercial use of recognisable trademarks (https://pixabay.com/service/license-summary/) | `https://pixabay.com/api/?key=…&id=<id>` | `PIXABAY_API_KEY` | "requests must be cached for 24 hours"; "Systematic mass downloads are not allowed"; 100 / 60 s (third-party; conflicts) | yes (store copies; no hotlinking) | T page slug / tags · A `user` · S `pageURL` · L Pixabay Content License | as Pexels | Highest laundering risk; AI/illustration uploads (type ≠ photo refused) |
| NYPL | Public-domain items only; "NYPL makes this item available under … CC0" (https://api.repo.nypl.org/api_documentation_v1) | v1 deprecated (Jan 2023); v2 not found | `NYPL_API_TOKEN` | 10,000/day (v1) | not built | — | NY: 0 usable in wave 1 | API shape unknown |
| USGS | "USGS-authored or produced data … are considered to be in the U.S. Public Domain" | M2M needs an ERS login + approval | — | — | no | — | none as place photos | Satellite is not a place photo (D-50) |

## Proposals to the imagery lane (the gate is theirs)

1. **LICENCE_OK:** accept `Pexels License` (licenceUrl `https://www.pexels.com/license/`, sourceUrl `https://www.pexels.com/photo/…`) and
   `Pixabay Content License` (licenceUrl `https://pixabay.com/service/license-summary/`, sourceUrl `https://pixabay.com/…/photos/…`) —
   landmarks and heroes only: refuse them on a record whose kind is not `sight` (and on any `food` record).
2. **"No known restrictions"** (LoC/NYPL catalogue wording) for non-Highsmith, non-government items: either accept it only with
   `era: historic` and a date ≤ 1929 (US public domain by publication date), or keep refusing it. The fetcher already maps
   Highsmith and U.S. Government work to `Public domain`, so most LoC rows do not need this.
3. **Historic caption:** a row with `era: "historic"` carries `date` and `institution`; `captionHtml` should append
   `· <date> · <institution>` (e.g. "1889 · The Metropolitan Museum of Art"), as D-50 requires. Rows also carry `provider`,
   `sourceId`, `evidence` and `reviewed`.
4. **recompress.js:** treat the providers `library-of-congress`, `the-met`, `smithsonian`, `europeana`, `pexels`, `pixabay`
   like `wikimedia-commons` (`eligible` / `needsWork`), so their 500/960 JPEGs meet the same weight caps.
5. **test-imagery:** per-provider sourceUrl host checks, like the Commons File: rule.

## Decisions asked (orchestrator)

- Anonymous creators: decided in D-52 (above).

## Bytes

Each credited photo adds about 866 B to its city page (Tokyo has about 53 KB of headroom under 820 KB). Page sizes are checked
per wave in docs/resume/image-sources.md.
