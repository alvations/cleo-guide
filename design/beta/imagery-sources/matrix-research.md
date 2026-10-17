# Image-source matrix research (2026-10-17, WebSearch only, 30 searches)

Method note: WebFetch is blocked, so every quote below is the snippet text the search tool returned for that URL. Where the search tool only paraphrased, the item says "(paraphrase)". Items marked **NOT FOUND** were searched for and not confirmed. Items marked **UNVERIFIED (to confirm)** are candidate field names from general knowledge. They are listed only so someone can check them; they are not findings.

---

## 1. Pexels

**Licence**
- "Don't sell unaltered copies of a photo, e.g. don't sell it as a stock photo, poster, print, or on a physical product without adding any value." https://help.pexels.com/hc/en-us/articles/360042332714-What-are-the-rules-for-using-Pexels-photos-or-videos
- "Identifiable people may not appear in a bad light or in a way that is offensive." https://help.pexels.com/hc/en-us/articles/360042332714-What-are-the-rules-for-using-Pexels-photos-or-videos
- "Don't imply endorsement of your product by people or brands on the image." Also: "Don't redistribute or sell the photos on other stock photo or wallpaper platforms." Same URL as above.
- Commercial use is allowed and attribution is not legally required under the licence. **NOT FOUND as a quote**: the search returned no snippet from pexels.com/license, so confirm on that page.

**API**
- Auth header: `curl -H "Authorization: YOUR_API_KEY"` against the v1 search endpoint (`https://api.pexels.com/v1/search`). https://pexels.com/api/documentation/
- "By default, the API is rate-limited to 200 requests per hour and 20,000 requests per month." https://pexels.com/api/documentation/
- "Our API keys come with the default rate limit of 200/hour and 20,000/month." https://help.pexels.com/hc/en-us/articles/900005852323
- Rate-limit headers X-Ratelimit-Limit, X-Ratelimit-Remaining and X-Ratelimit-Reset come only on successful responses, not on 429s. https://pexels.com/api/documentation/
- "abuse of the Pexels API, including but not limited to attempting to work around the rate limit, will lead to termination of your API access." https://pexels.com/api/documentation/
- Key: free, issued after signing up on pexels.com/api. Apps and plug-ins for other platforms need approval via api@pexels.com. https://help.pexels.com/hc/en-us/articles/900005852323 (paraphrase)

**API guidelines / attribution**
- "Whenever you are doing an API request make sure to show a prominent link to Pexels." https://python-pexels.readthedocs.io/en/stable/guidelines.html (mirror of the official guidelines)
- "Always credit our photographers when possible (e.g. "Photo by John Doe on Pexels" with a link to the photo page on Pexels)." Same URL.
- No copying of core functionality, for example a wallpaper app. Same URL (paraphrase).

**TASL mapping.** UNVERIFIED (to confirm): photo object `alt` maps to Title, `photographer` and `photographer_url` to Author, `url` to the Source page, Licence is the fixed "Pexels License", and `src.{original,large2x,...}` holds the image URLs. No date field.

**Image host.** UNVERIFIED (to confirm): `images.pexels.com`. **NOT FOUND**: any hotlink-vs-store rule. Searches turned up no Pexels hotlinking rule.

**Risks**
- Licence laundering. Uploads are user-contributed, and Pexels gives no model or property releases. A microstock blog advises that "if there are identifiable people in the photo, then you should make sure there is a model release on file". https://www.matthughesphoto.com/c-photography/can-you-sell-pexels-photos.html
- The no-endorsement and brands rules matter for storefront and restaurant shots.

---

## 2. Pixabay

**Licence** (Content License Summary at https://pixabay.com/en/service/license/, paraphrased by the search tool. The summary itself says only the full licence is binding.)
- Commercial use is allowed. "attribution is not required but is always appreciated." https://pixabay.com/en/service/license/ (via https://ras.ac.uk/licence/pixabay-license)
- Prohibited: selling or distributing content "on a standalone basis", meaning with no creative work added and essentially in its original form.
- Prohibited: commercial use of content showing recognisable trademarks, logos or brands in connection with goods or services, and printing such content on merchandise for sale.
- Prohibited: using content as part of a trademark, business name or service mark; immoral or illegal uses, especially with recognisable people; misleading uses.
- Some content may carry separate copyright, trademark, privacy or moral rights.

**API** (official pixabay.com/api/docs was **not returned** by search. The facts below come from third-party mirrors that quote it.)
- Endpoint: `https://pixabay.com/api/?key=...&q=...`. The key is free after sign-up on the API docs page. https://www.rubydoc.info/gems/pixabay_api/0.0.5 (paraphrase)
- "To keep the Pixabay API fast for everyone, requests must be cached for 24 hours." https://www.rubydoc.info/gems/pixabay_api/0.0.5
- "Systematic mass downloads are not allowed." Same URL.
- Rate limit: current sources say 100 requests per 60 seconds (https://pkg.go.dev/github.com/fdddf/pixa, https://blog.laozhang.ai/en/posts/free-image-api). An older gem README says 5,000 per hour (https://www.rubydoc.info/gems/pixabay_api/0.0.1). **CONFLICT**: confirm on pixabay.com/api/docs.
- Hotlinking: third-party sources say Pixabay CDN URLs expire and the terms forbid hotlinking from a live app, so you download images and serve them yourself. https://pkg.go.dev/github.com/fdddf/pixa and https://blog.laozhang.ai/en/posts/free-image-api. **The exact official wording was NOT FOUND.** Some sources mention a "show your users where the images are from" rule, but that wording was not confirmed.

**TASL mapping.** UNVERIFIED (to confirm): `tags` stands in for Title (there is no real title), `user` and `user_id` map to Author, `pageURL` to Source, Licence is the fixed "Pixabay Content License", and the image URLs are `webformatURL`, `largeImageURL` and similar. No date field.

**Image host.** UNVERIFIED (to confirm): `pixabay.com/get/...` (temporary URLs) and `cdn.pixabay.com`.

**Risks.** This source has the highest licence-laundering risk of the nine, because re-uploaded third-party photos have been a known problem. The licence has no CC fallback and bars the "standalone" redistribution that a photo gallery might resemble. Landmark images are also widely re-uploaded copies.

---

## 3. Smithsonian Open Access

**Licence**
- "Items marked CC0 are dedicated to the public domain." "CC0 only applies to copyright, so you may still need someone else's permission to use a CC0-designated digital asset." https://www.si.edu/openaccess/faq (via https://dashboard.si.edu/openaccess/faq)
- Objects with possible copyright or other limits "have portions of metadata with CC0, but no media file is provided by the Smithsonian." https://www.si.edu/openaccess/devtools
- Public-domain objects get metadata "including a URL to a corresponding image file." https://www.si.edu/openaccess/devtools
- Caution: some Smithsonian Institution Archives pages are not CC0 ("personal and educational use ... welcomed unless otherwise noted. For commercial uses, contact photos@si.edu"). https://siarchives.si.edu/collections/siris_arc_219544

**API**
- "public API hosted on api.data.gov". Register there for a key. https://www.si.edu/openaccess/devtools
- Search endpoint `https://api.si.edu/openaccess/api/v1.0/search?q=...&api_key=...` (this came from an aggregator and was not confirmed on si.edu). https://echo.archivarix.net/es/archive/smithsonian-openaccess
- api.data.gov default limit: "Hourly Limit: 1,000 requests per hour" per key, applied across all APIs. Going over gives an HTTP 429, and the block lifts after an hour. DEMO_KEY allows 30 requests per hour and 50 per day per IP. https://api.data.gov/docs/developer-manual/
- "Data is refreshed at a weekly rate." There is also a bulk dataset on GitHub/AWS. https://www.si.edu/openaccess/devtools

**TASL mapping.** NOT FOUND in search. UNVERIFIED (to confirm): `title` maps to Title; `content.freetext.name` to Author; `content.descriptiveNonRepeating.record_link` to Source (the record_link name is supported by https://mcpservers.org/id/servers/molanojustin/smithsonian-mcp); `content.descriptiveNonRepeating.online_media.media[].usage.access == "CC0"` to Licence; `content.indexedStructured.date` or `freetext.date` to Date.

**Image host.** UNVERIFIED (to confirm): `ids.si.edu/ids/deliveryService?id=...`. No terms forbidding storage were found, and CC0 allows storing copies.

**Risks.** Few city-landmark photos except US/DC (for example the NMAH/Archives photo collections). Filter per media item on usage/access = CC0, not per record. CC0 does not clear publicity or trademark rights.

---

## 4. The Met Collection API

**Licence**
- "The policy utilizes the Creative Commons Zero (CC0) designation." https://www.metmuseum.org/press/news/2017/open-access
- Public-domain images can be "downloaded, shared, and remixed without restriction". Object data for the whole collection is CC0 and can be used "for any purpose, including commercial and noncommercial use, free of charge and without requiring permission from the Museum." https://www.metmuseum.org/policies/image-resources (paraphrase plus quote)
- Only works the Museum believes are in the public domain are covered, marked with the Open Access icon. Same URL.

**API**
- No key needed. https://learn.microsoft.com/en-us/training/modules/use-apis-discover-museum-art/4-query-met-api
- Endpoints: `/objects`, `/objects/{id}` and `/search?q=...` (returns a total and objectIDs). The base `https://collectionapi.metmuseum.org/public/collection/v1/` is UNVERIFIED (to confirm). https://nordicapis.com/how-museums-are-using-apis-to-inspire-art-lovers-worldwide/
- Rate limit: "stay below 80 requests/second" per a connector guide (https://docs.stackone.com/connectors/metmuseum/guides/link-account/no-authentication). **Not confirmed on an official Met page.**
- `hasImages=true` filter. Records can still lack image URLs "due to licensing restrictions". https://github.com/mike-dresser/met-api

**TASL mapping.** `isPublicDomain` and `primaryImage` were confirmed in a sample record (https://nordicapis.com/how-museums-are-using-apis-to-inspire-art-lovers-worldwide/). UNVERIFIED (to confirm): `title`, `artistDisplayName`, `objectURL` as Source, `objectDate` as Date, and `rightsAndReproduction` (the last is mentioned at https://apify.com/compute-edge/met-museum-collection-scraper).

**Image host.** UNVERIFIED (to confirm): `images.metmuseum.org`. CC0 allows storing copies, and no hotlink requirement was found.

**Risks.** These are artworks, not city photos. Expect very low landmark yield, except for historic prints and photos of NYC, Paris and Japanese ukiyo-e views (Edo/Kyoto landmarks).

---

## 5. Europeana Search/Record API

**Licence and rights**
- Mixed rights. Europeana uses RightsStatements.org statements in-copyright (InC, InC-EDU, InC-EU-OW), not-in-copyright (NoC-NC, NoC-OKLR) and not-evaluated (CNE), alongside CC licences and PDM/CC0. https://pro.europeana.eu/page/rights-statements-faq
- "On the Europeana portal we use a fake facet called "REUSABILITY" ... REUSABILITY:open, or REUSABILITY:restricted or REUSABILITY:permission. These are shortcuts for the lengthy queries." https://pro.europeana.eu/blog/can-i-use-it
- "open" groups CC0, CC BY, CC BY-SA and PDM (paraphrase). Same URL. **The open category still includes BY and BY-SA, so attribution, and share-alike for BY-SA, must be honoured.** Store the `rights` URI per item.

**API**
- "Every call to the Search API is an HTTPS request using the following base URL: https://api.europeana.eu/record/v2/search.json" with "reusability: Filter by copyright status. Possible values are open, restricted or permission." https://europeana.atlassian.net/wiki/x/MQBRk
- Key (`wskey`): the terms of use describe it as a confidential code for the user only, "tied to a single software solution". Terms are accepted in the sign-up form. https://europeana.eu/en/rights/terms-of-use (paraphrase). The sign-up steps (pro.europeana.eu form) were NOT FOUND in detail.
- The response includes a per-key count of "the number of request by this API key within the last 24 hours". https://europeana.atlassian.net/wiki/x/EgB0k. **NOT FOUND**: a published numeric rate limit.
- Record API full image: "Use the URL from the "edmIsShownBy" field in the "aggregations" class as the URL of the image file." https://europeana.atlassian.net/wiki/x/EgB0k

**TASL mapping.** `title`, `edmPreview` (thumbnail), `edmIsShownBy` (full image) and `rights` (an edm:rights URI) are supported by the sources above and by https://polymatheia.readthedocs.io/en/latest/recipes/europeana.html. UNVERIFIED (to confirm): `dcCreator` as Author, `guid` / `edmIsShownAt` as Source, `year` as Date.

**Image host.** Images are served from each providing institution's own server (edmIsShownBy), and Europeana periodically checks that links resolve (https://europeana.atlassian.net/wiki/x/EgB0k). Thumbnails come from the Europeana thumbnail API, with the host UNVERIFIED. Hosts vary per item, so expect broken links and download a copy.

**Risks.** Mixed rights. Always pass `reusability=open` and re-check the `rights` URI per item, because NoC-NC is non-commercial only. Metadata quality and image resolution vary. Good European historic coverage, weak Japan and US coverage.

---

## 6. NYPL Digital Collections API

**Licence**
- Out-of-copyright materials are offered as high-resolution downloads with "no permission required". https://live-legacy-admin.nypl.org/blog/2016/01/05/share-public-domain-collections
- Metadata is CC0. Per-item text: "to the extent that a jurisdiction grants The New York Public Library a copyright in this item, NYPL makes this item available under a Creative Commons CC0 1.0 Universal Public Domain Dedication." https://api.repo.nypl.org/api_documentation_v1
- Only part of the collection is public domain. A public-domain-only metadata dump (CSV/JSON) is on GitHub. https://live-legacy-admin.nypl.org/blog/2016/01/05/share-public-domain-collections

**API**
- Auth: a token "you will receive when you sign up for API access", sent as the header `Authorization: Token token="..."`. https://api.repo.nypl.org/api_documentation_v1
- "10,000 requests per day" per token. This figure is from the v1 docs. https://api.repo.nypl.org/api_documentation_v1
- The v1 docs say v1 "is deprecated ... will be removed permanently on January 3rd, 2023" in favour of v2. https://api.repo.nypl.org/api_documentation_v1. **NOT FOUND**: v2 endpoints, auth or limits, and the exact `rightsStatement` / public-domain field names.

**TASL mapping.** NOT FOUND. UNVERIFIED (to confirm): `title`; `name` as Author; `itemLink` / `digitalcollections.nypl.org/items/{uuid}` as Source; `rightsStatement` or `typeOfResource` plus a public-domain flag as Licence; `dateIssued` / `keyDate` as Date.

**Image host.** UNVERIFIED (to confirm): `images.nypl.org/index.php?id=...&t=w`.

**Risks.** Only some items are public domain, so filter per item. The v1-to-v2 migration is undocumented in search results. Strong for historic NYC, weak elsewhere.

---

## 7. Library of Congress (loc.gov JSON API)

**API**
- No key: "The API is accessible to the public with no API key or authentication required. However, rate limiting is enforced." https://www.loc.gov/apis/json-and-yaml/
- "JSON/YAML API for loc.gov: Requests per minute: 20. Time blocked, if rate is exceeded: 1 hour." https://www.loc.gov/apis/json-and-yaml/working-within-limits/. **The "burst 20 per 10s" figure was NOT FOUND.** The official figure is 20 requests per minute.
- "rate limits may decrease and users may encounter 429 status codes or HTML pages with CAPTCHAs even when operating below the rates listed". The same page gives separate limits for image and tile services and storage media, including one 72-hour block whose label was garbled. https://www.loc.gov/apis/json-and-yaml/working-within-limits/
- Item JSON: `https://www.loc.gov/item/{id}/?fo=json` (https://apify.com/crawlergang/library-of-congress-search-scraper). Official response docs are at https://www.loc.gov/apis/json-and-yaml/responses/item-and-resource/. Access-restricted items may give offsite users only a thumbnail.

**Rights**
- "The Library of Congress generally does not own rights to material in its collections and, therefore, cannot grant or deny permission to publish or otherwise distribute the material." It is "the user's obligation to determine and satisfy copyright or other use restrictions". (Search summary of LoC P&P rights pages, for example https://www.loc.gov/pictures/item/2002716779/ and https://iza-server.uibk.ac.at/pywb/dilimag/20210113092156mp_/http://www.loc.gov/rr/print/195_copr.html.)
- "No known restrictions on publication" is a catalogue note, not a clearance. Thumbnails may be restricted because the item "has not been evaluated for rights restrictions". https://guides.loc.gov/digital-scholarship/faq (paraphrase)
- Carol M. Highsmith Archive, as LoC wording mirrored on Commons/Wikipedia (the LoC page itself was not returned): "Publication and other forms of distribution: Permitted. Ms. Highsmith has stipulated that her photographs are in the public domain." Also: "photographs of sculpture or other works of art may be restricted by the copyright of the artist." https://c.enwp.org/wiki/File:%22Statue_of_Civilization,%22_by_Lee_Lawrie,_at_the_Central_Library_in_downtown_Los_Angeles,_California_LCCN2013631250.tif and https://de.wikipedia.org/wiki/Datei:Highsmithbullockswilshirefromstreet.jpg

**TASL mapping.** `contributor` is confirmed in the official docs (https://www.loc.gov/apis/json-and-yaml/responses/item-and-resource/). `title`, `date`, `rights` and `image_url` appear in third-party output (https://apify.com/crawlergang/library-of-congress-search-scraper). Source is the item `url` / `id` (UNVERIFIED, to confirm).

**Image host.** UNVERIFIED (to confirm): `tile.loc.gov` (IIIF / storage-services). No storage prohibition was found, and public-domain items can be stored.

**Risks.** Per-item rights vary ("not evaluated" items), and artworks inside photos may have their own copyright. Highsmith is very strong for US city landmarks (thousands of 1980s–2010s colour photos, explicitly public domain). Very low yield for Europe and Japan apart from historic Photochrom prints.

---

## 8. USGS imagery

- "USGS-authored or produced data and information are considered to be in the U.S. Public Domain. ... Some non-USGS photographs, images, and/or graphics that appear on USGS websites are used by the USGS with permission ... These materials are generally marked as being copyrighted." (USGS copyright policy, quoted via https://pubs.usgs.gov/fs/2005/3024/press-images/1_readme.txt and https://cdn-assets.alltrails.com/attribution/dem/us1aa-license-01.pdf)
- Credit is requested: "Credit: U.S. Geological Survey". "When using information from USGS information products ... we ask that proper credit be given." Same sources.
- Publicity rights may apply to images showing USGS staff. Same sources (paraphrase).
- The M2M API (https://m2m.cr.usgs.gov/) gives "the same options and functions as EarthExplorer" and returns download URLs usable with wget or cURL. It needs an ERS (EarthExplorer) account plus M2M access requested on the ERS profile, then a wait for approval (https://github.com/castuofa/usgs-m2m-api). The "login" endpoint "will be deprecated February 26, 2025" (https://www.usgs.gov/centers/eros/science/earthexplorer-help-index). The current token method was NOT FOUND.
- Landsat data-policy wording was NOT FOUND in search. Landsat is generally a USGS/NASA public-domain product (UNVERIFIED, to confirm).
- Suitability (judgement, not a sourced fact): Landsat's 30 m (15 m pan) resolution only shows a city as a blob, so it is not a usable "city overview" photo. NAIP/aerial orthophotos are US-only and need processing. Example of Landsat city imagery used publicly: https://dlab.epfl.ch/wikispeedia/wpcd/images/190/19085.jpg.htm (Houston Landsat).

---

## 9. OpenStreetMap tiles

- Data licence: "OpenStreetMap is open data, licensed under the Open Data Commons Open Database License (ODbL) by the OpenStreetMap Foundation (OSMF)." https://www.openstreetmap.org/copyright
- "You are free to copy, distribute, transmit and adapt our data, as long as you credit OpenStreetMap and its contributors." https://www.openstreetmap.org/copyright (via search summary). Attribution text: "© OpenStreetMap contributors". https://scripts.nuxt.com/scripts/leaflet/guides/tiles-and-attribution
- Tile cartography licence: older wording said "the cartography in our map tiles, and our documentation, are licensed under the Creative Commons Attribution-ShareAlike 2.0 license (CC BY-SA)". This was removed from the current page (https://git.openstreetmap.org/rails.git/patch/63c0b697a4bcde9db5711c590e462cf87d411576). A 2022 snapshot calls the tiles a "Produced Work" under ODbL (https://webcf.waybackmachine.org/web/20220418221007/http://www.openstreetmap.org/copyright/en).
- Tile usage policy (https://operations.osmfoundation.org/policies/tiles/): "Bulk downloading is any pre-emptive fetching of tiles other than those a user is actively viewing." Offline use is not permitted on tile.openstreetmap.org, and "save area for later" features are prohibited (paraphrase). Users must "clearly display license attribution". A valid identifying User-Agent is required. Heavy use is forbidden without permission. Access may be blocked without notice, and there is no SLA.
- Static image stored or committed: **NOT FOUND explicitly.** Inference (not sourced): fetching tiles in CI to bake a static PNG is pre-emptive and non-interactive, so it conflicts with the bulk/offline rule. To commit a static map, render it yourself from OSM data (ODbL plus attribution, which is fine to store) or use a provider that permits static images. Committing a handful of tiles carries legal risk under the tile-server policy, not under the licence. The OSMF can permit use of a rendered image under ODbL/CC BY-SA, but it does not permit scraping its servers to make one.
