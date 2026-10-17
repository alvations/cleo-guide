# Place photos from Google Maps: feasibility, and what to build instead

- **Date:** 2026-10-17.
- **Branch:** `claude/peaceful-goodall-i0hsrt`.
- **Scope:** research only. Nothing was fetched from any image host, nothing was committed, and no repo file was edited.
- **Method:** I read the repo and used WebSearch for everything outside it. WebFetch is blocked here by the org egress policy. So every quote below is taken from a WebSearch summary of the named page, not from my own reading of the full page. Where a search could not confirm the exact wording, I mark it **(wording unconfirmed)**. Check those clauses on the live page before relying on them.

---

## 0. What to build (for the orchestrator)

1. **Do not fetch photos from Google Maps.** It is not allowed (§1). The beta already builds a no-key `google.com/maps/search/?api=1&query=` link in `tools/beta/client/` (sheet, day and saved views). That link may be labelled "See photos on Google Maps". It stores nothing and needs no key, so it is compliant.
2. **First, fetch what is already vetted. This needs no new code and no secret.**
   - 340 of the 389 tier-1 photo gaps already have an unflagged, high-confidence Commons candidate (waves 5a–5d, commits `41b2d11a6` … `c09acb203`).
   - Push-triggered runs fetch only `scope=priority`, so these candidates wait for a manual dispatch of `beta-fetch-unsplash.yml` with `scope=all` and `budget=1500`, run twice if needed.
   - Then review the run as usual.
   - **Estimate:** at past keep rates (runs #60 and #64 kept about 75–80 %), about 240–270 photos. That takes tier-1 coverage from 57 % to about 85 %.
3. **Add a `--wikidata` mode to `fetch-commons.js`.** It needs no key and no gate change.
   - It tries, in order: the Wikidata image (P18); files in the place's Commons category (P373); Commons files tagged as depicting the place (P180); and files geotagged near the verified pin (geosearch).
   - Every file goes through the existing checks.
   - It targets the roughly 130 gaps that remain after step 2, plus whatever step 2 refuses (§8.2).
4. **Add `fetch-openverse.js` to pull Flickr Creative Commons photos through Openverse.**
   - It works in three stages: the runner finds candidates and commits metadata only; a person vets them; a fetch then stores the approved files.
   - No secret is required. Three are optional: `OPENVERSE_CLIENT_ID` and `OPENVERSE_CLIENT_SECRET` for higher limits, and `FLICKR_API_KEY` to re-check each photo at its source.
   - The gate gains `provider: "flickr"` (§8.3).
5. **Unsplash: do not run the storing path of `fetch-unsplash.js` as written.**
   - It downloads and self-hosts files obtained through the API. That breaks the API Guidelines' hotlinking rule, and the API Terms call non-compliance with that section a "material breach" (§5).
   - `CREDITS.json` has **0** Unsplash rows, so there is nothing to undo.
   - The owner picks one fix: (a) download each photo in a browser and write its credit row by hand, with the script reduced to a planner (recommended); (b) hotlink the photos, which needs an explicit exception to the repo's self-hosting and privacy rules; or (c) get written permission from Unsplash to self-host.
6. **Not worth building now:** Mapillary, Pexels, Pixabay, Geograph (there are no UK or Irish guides), tourism-board libraries and venue press kits (§6).

---

## 1. Google Maps — verdict: **not allowed**

| Question | Verdict | Decisive source |
|---|---|---|
| Download Places photos on Actions, commit them to a public repo, serve them from Pages | **Not allowed** | Google Maps Platform ToS §3.2.3 "(a) No Scraping, (b) No Caching" ([cloud.google.com/maps-platform/terms](https://cloud.google.com/maps-platform/terms)). The EEA version lists what is barred: "(i) pre-fetch, index, store, reshare, or rehost Google Maps Content outside of the Services; (ii) bulk download Google Maps Content; or (iii) copy and save business names, addresses, or user reviews" ([cloud.google.com/terms/maps-platform/eea](https://cloud.google.com/terms/maps-platform/eea)). |
| Can a photo be cached at all? | No. Only place IDs may be kept indefinitely, and Places latitude/longitude for up to 30 days. | Service Specific Terms, Places §5.4: lat/lng "for up to 30 consecutive days"; place IDs exempt ([maps-service-terms](https://cloud.google.com/maps-platform/terms/maps-service-terms)). Place Photos (New): a photo name "can't be cached" and can expire; it cites ToS §3.2.3(b) ([place-photos](https://developers.google.com/maps/documentation/places/web-service/place-photos)). Maps JS: do not cache photo URIs or photos; take photo data from a fresh Place object ([javascript/place-photos](https://developers.google.com/maps/documentation/javascript/place-photos)). |
| Who owns user-contributed Maps photos? | The contributor. Google holds a licence to run its services. Nobody grants *us* a licence, so a photo could never pass the repo's free-licence gate. | Google ToS, "Permission to use your content": your content remains yours, and you grant Google a worldwide, royalty-free licence for operating its services ([policies.google.com/terms](https://policies.google.com/terms?hl=en-US)). Maps content falls under that licence ([google.com/help/terms_maps](https://www.google.com/help/terms_maps/)). |
| Scraping Maps web pages | **Not allowed** | It is the same no-scraping clause, §3.2.3(a). A scraped file would also carry no licence. |
| Attribution and display rules, *if* photos were shown live | Each photo's `authorAttributions` must be shown "wherever you display the image". Places data shown without a Google map needs the Google Maps logo (or the text "Google Maps" where space is short). Places content may not be used with a non-Google map. | [Place Photos (New)](https://developers.google.com/maps/documentation/places/web-service/place-photos). [Places API policies](https://developers.google.com/maps/documentation/places/web-service/policies). Service Specific Terms §5.3 "No use with a non-Google map" ([2024 version](https://cloud.google.com/maps-platform/terms/maps-service-terms/index-20240522)). |

### 1.1 Is there a compliant Google route?

**Loading Places photos live in the browser, with a key and attribution.** The terms allow this, but it conflicts with the repo's rules at five points:
- **Rule 4-ai.** `engine_guard.FORBIDDEN` contains `"maps.googleapis.com"` and `"API key"`. `check-google.py` (in `npm test`) and the pre-commit hook would block the Maps JS loader. Places photo media URLs also need `key=` in the URL.
- **SST §5.3.** Every beta view sits next to a Leaflet map on OSM or Esri tiles, which is a non-Google map; the Atlas view places photos beside it.
- **The `photos.js` gate.** It requires a local file and a free licence.
- **DECISIONS UX-23.** The beta makes no third-party requests, for privacy.
- **Rule 4.** The photo slot would depend on a third-party host. A key, quota or billing failure would also show Google error states.

**Verdict:** not compatible with this repo.

**A link out to the place's Google Maps page.** This is compliant.
- [Maps URLs](https://developers.google.com/maps/documentation/urls/get-started): "You don't need a Google API key to use Maps URLs". `api=1` is mandatory and `query` is required.
- `query_place_id` is optional, and getting a place ID would need the Places API. So keep the existing name-and-address query.
- The beta already emits `https://www.google.com/maps/search/?api=1&query=…`. Relabelling or duplicating it as "See photos on Google Maps" stores and shows no Google content.

---

## 2. What the gaps actually are (repo numbers, 2026-10-17)

- **Credits:** `beta/assets/img/CREDITS.json` has 604 rows, all `provider: "wikimedia-commons"` and none from Unsplash. The licences are CC BY-SA 4.0 (212), CC BY-SA 3.0 (127), CC BY 2.0 (71), PD (39), CC BY-SA 2.0 (39), CC0 (30), and others.
- **Coverage:** `node tools/beta/imagery/coverage.js` reports 79 guides, 77 heroes, sight leads 25/25, first rows 51/51, and **tier-1 508/897 (57 %)**.
- **The 389 tier-1 gaps:**
  - **340** have a vetted, unflagged, high-confidence Commons candidate that has not been fetched yet;
  - **26** have only a cited article's lead image to try;
  - **23** have nothing.
  - The residual 49 by country: US 35, Germany 5, Belgium 4, Japan 4, Singapore 1.
- **Skips:** the manifest marks 426 targets `skip`.
  - About 287 are excluded by policy: venues, brand stores, food.
  - About 51 are excluded for copyright or freedom of panorama, and 5 because they are in Vietnam.
  - **No source can change these, and they are where Google Maps photos would mostly have helped.**
  - About 67 (plus about 15 one-off reasons) are skipped because no free photo was found: "no file found", "only close-ups", "only interiors".
- **The pool for any new source:** the about 80 scarcity skips plus the 49 residual tier-1 gaps, roughly **130 targets**, plus whatever the step-2 dispatch refuses (perhaps 70–100 more).

---

## 3. Flickr Creative Commons (deep dive)

### 3.1 Licence → gate mapping

- Map by the **licence URL**, never by the numeric ID, and read the list at run time with `flickr.photos.licenses.getInfo`.
- Flickr added the CC 4.0 suite in June 2025 and the documentation lagged. A developer found photos returning codes 11–16 before `getInfo` listed them ([cogdogblog](https://cogdogblog.com/?p=75623)). See also the [Flickr blog, 2025-06-18](https://blog.flickr.net/all/2025/06/18/creative-commons-4-0-has-arrived-on-flickr/).
- Flickr now defaults new uploads to CC 4.0 ([Flickr Help, Copyright licenses](https://www.flickrhelp.com/hc/en-us/articles/40048459562388-Copyright-Licenses-on-Flickr)).
- The classic IDs 0–10 in the table are from memory. **Verify them at run time.**

| Flickr licence | ID (verify at run time) | Gate `licence` string (matches `LICENCE_OK` in photos.js) | `licenceUrl` | Decision |
|---|---|---|---|---|
| All Rights Reserved | 0 | — | — | refuse |
| CC BY-NC-SA 2.0, BY-NC 2.0, BY-NC-ND 2.0 | 1, 2, 3 | — | — | refuse (NC) |
| CC BY 2.0 | 4 | `CC BY 2.0` | https://creativecommons.org/licenses/by/2.0/ | **accept** |
| CC BY-SA 2.0 | 5 | `CC BY-SA 2.0` | https://creativecommons.org/licenses/by-sa/2.0/ | **accept** (resized copies stay BY-SA) |
| CC BY-ND 2.0 | 6 | — | — | refuse (ND) |
| No known copyright restrictions | 7 | *not accepted by `LICENCE_OK` today* | https://www.flickr.com/commons/usage/ | **refuse in v1.** This is an institution's statement, not a licence. Accept it later only from verified Flickr Commons institution accounts, with a gate change and review of each file. |
| United States Government Work | 8 | `PD-USGov` (matches `PD(?:-[\w.-]+)?`) | https://commons.wikimedia.org/wiki/Template:PD-USGov | accept only after a person has looked. The uploader asserts this label, and it is a known laundering vector. |
| CC0 1.0 | 9 | `CC0 1.0` | https://creativecommons.org/publicdomain/zero/1.0/ | **accept** |
| Public Domain Mark 1.0 | 10 | `Public domain` | https://creativecommons.org/publicdomain/mark/1.0/ | accept when the date and author make public domain plausible. PDM is a label, not a licence. |
| CC BY 4.0, CC BY-SA 4.0 | in 11–16 (order per ID unconfirmed) | `CC BY 4.0`, `CC BY-SA 4.0` | …/by/4.0/, …/by-sa/4.0/ | **accept** |
| CC BY-ND, BY-NC, BY-NC-SA, BY-NC-ND 4.0 | in 11–16 | — | — | refuse |

**TASL mapping:**
- **Title:** the Flickr photo title.
- **Author:** the owner's real name or username, linked to `https://www.flickr.com/photos/<nsid>/`.
- **Source:** `https://www.flickr.com/photos/<nsid>/<id>/`. This also meets Flickr's link-back rule.
- **Licence:** as in the table.
- **Caption:** `captionHtml()` then reads "Photo: <author> · CC BY 2.0 · flickr.com (resized)" with no change. The file title rides on the source link as today, which covers CC 2.0/3.0's title term.

### 3.2 Flickr API terms

- **A key is needed, and only Pro subscribers can get one.** "The ability to request API keys is available exclusively to Pro subscribers." You choose a non-commercial or commercial key; Flickr reviews it and tracks the app ([Flickr Help, Flickr API](https://www.flickrhelp.com/hc/en-us/articles/4404070036884-Flickr-API)).
- **Commercial or not:** "If the primary purpose of your application is to derive revenue, it is considered a commercial application" ([Flickr APIs Terms of Use](https://www.flickr.com/help/terms/api)). An older page says the API is "available for non-commercial use by outside developers. Commercial use is possible by prior arrangement" ([flickr.com/services/api](https://www.flickr.com/services/api/)). The guide sells nothing and shows no ads in the repo, so a **non-commercial key** fits. CC BY and BY-SA allow commercial use anyway; the key type is about the API contract, not the photos.
- **Rate limit:** "If your application stays under 3600 queries per hour across the whole key … you'll be fine." Flickr also says "we also routinely block screen scrapers" and revokes keys that break its terms ([Flickr Developer Guide, API](https://www.flickr.com/services/developer/api/)).
- **Caching. This is the one real tension.**
  - The developer guide says "Your application can cache API results and images for up to 24 hrs to help reduce API load" (same page).
  - The API terms limit caching to reasonable periods (wording unconfirmed). A 2022 university guide paraphrases them as "data cannot be … cached for an unreasonable amount of time" ([MSU PDF](https://copeid.ssrc.msstate.edu/wp-content/uploads/2022/06/FINAL-Flickr-Documentation.pdf)).
  - Committing a permanent copy of a file obtained *through the API* sits uneasily with this, even though the CC licence itself allows copying.
- **Display:** the terms bar "displaying more than 30 Flickr user photos per page" ([flickr.com/services/api/tos](https://www.flickr.com/services/api/tos/)). When posting a photo elsewhere, "you must link to the original Flickr photo page" ([Developer Guide, Community](https://www.flickr.com/services/developer/community/)).
- **The owner's licence governs:** "Neither SmugMug's provision of the Flickr APIs to you nor your use of the Flickr APIs override the photo owners' requirements and restrictions … you are solely responsible" (API terms).
- **Size:** downloading "original and large-size photos (larger than 1024px) from Free accounts is restricted via the Flickr API" (Flickr Help, Flickr API). The repo's largest card width is 960 px, so take the 1024 px size and resize it.
- **General Flickr Terms:** they prohibit "scraping or otherwise using any data mining, robots or similar data gathering or extraction methods". They also restrict downloading Flickr Materials except User Content that users have made available for download ([flickr.com/help/terms](https://www.flickr.com/help/terms)). So: never scrape pages, and download only files whose owner allows downloads.

**Licence-wise**, storing CC BY, BY-SA, CC0 and PDM copies in a public repo and serving them from Pages is fine, provided the TASL credit is shown. **Contract-wise**, the open question is the API caching clause. Three mitigations:
1. Before going past a pilot, ask Flickr API support in writing whether a non-commercial guide may store CC-licensed files it found through the API.
2. Find photos through Openverse (§4) and download one file per credited photo, only when the owner allows downloads.
3. Use the **Flickr → Commons** route (§3.4).

### 3.3 Licence laundering ("Flickr washing") and practical checks

- **The problem:** Commons calls it "Flickr washing": a Flickr account posts other people's photos under a false free licence. Commons keeps a list of questionable Flickr users, and its FlickreviewR bot tags files from them with `{{FlickreviewR/bad-author}}`. Commons also notes that Flickr "doesn't verify rights" ([Commons:Questionable Flickr images](https://commons.wikimedia.org/wiki/Commons:Questionable_Flickr_images), [Commons:Flickr files](https://commons.wikimedia.org/wiki/Commons:Flickr_files)).
- **Openverse does not verify licences either** (§4).

**Checks.** "Auto" means automatic with `FLICKR_API_KEY`; "Human" means a person checks during vetting or the run review.

| # | Check | How | Refuse when |
|---|---|---|---|
| 1 | The licence at source, at fetch time | Auto: `flickr.photos.getInfo` → licence, matched by URL | not in the accept list. Record the date: CC licences are irrevocable, and the row proves what applied when it was fetched. |
| 2 | The owner is on Commons' questionable-users list | Auto: read the list through the Commons API (`action=parse`) | listed |
| 3 | The owner allows downloads | Auto: the `usage.candownload` field from `getInfo` | `0` |
| 4 | EXIF | Auto: `flickr.photos.getExif` | the Artist or Copyright tag names someone other than the owner. No EXIF at all lowers confidence. |
| 5 | Owner history | Auto: `flickr.people.getInfo` (photo count, first upload) | very new account or few photos (threshold set by the lane) |
| 6 | A mixed stream | Human: look at the owner's stream | many unrelated cameras, press or agency watermarks, celebrity or event photos |
| 7 | Geotag | Auto: `flickr.photos.geo.getLocation` | not a refusal. Within about 1 km of the verified pin raises confidence. |
| 8 | Visible watermark or signature | Human: the run contact sheet (already part of every review) | present |
| 9 | Same photo elsewhere | Human: a manual reverse-image look for heroes and lead cards. Auto: a perceptual hash against the existing rows (one image, one row). No scraping. | found earlier under another name, or already credited |
| 10 | Upload date against date taken | Auto: `getInfo` | taken long before the account existed, with no EXIF |

Without `FLICKR_API_KEY`, checks 1 and 3–5 rest on Openverse's indexed data. In that mode, nothing is fetched until a person has vetted the candidate.

### 3.4 Verdict on Flickr

Flickr CC is the **highest-yield new source** for the residual gaps: US, German, Belgian and Japanese outdoor landmarks are well covered on Flickr. Its licences fit the gate. The risk is laundering and the API caching clause, not the licence. There are two compliant routes:

- **A. Openverse discovery, then download of downloadable CC files, with vetting by a person.** No key is needed (§4, §8.3).
- **B. Flickr → Commons.** A person with a Commons account imports a vetted Flickr photo through Commons' Flickr import, where it gets licence review and the bad-author check. The **existing** Commons pipeline then fetches it, with no new code and no gate change. This is slower and manual, carries the least risk, and also gives the file back to Commons.

---

## 4. Openverse (api.openverse.org) as a no-key route to Flickr CC

- **What it is:** WordPress.org's search over openly licensed media. It aggregates Flickr, Wikimedia Commons and other sources.
  - The image search is `GET https://api.openverse.org/v1/images/`. Filters include `license=by,by-sa,cc0,pdm`, `license_type=commercial,modification` and `source=flickr`. These come from secondary sources ([jentic](https://jentic.com/apis/openverse.org/openverse), [mcp-openverse](https://www.npmjs.com/package/mcp-openverse)); verify them on the first call.
- **Key:** none needed. "Anonymous requests should be sufficient for most users." You can also register: `POST /v1/auth_tokens/register`, then an OAuth2 client-credentials token. Registered users "are automatically granted slightly higher limits" ([API Evangelist summary of the Openverse auth API](https://apis.apievangelist.com/store/openverse-auth-api/)).
- **Limits:**
  - Anonymous users were throttled to "1 request/second" ([Openverse infrastructure posts](https://make.wordpress.org/openverse/tag/infrastructure/)).
  - Anonymous requests with `page_size` above 20 get a 401 ([Mitigating out-of-terms API usage, 2022](https://make.wordpress.org/openverse/2022/06/17/mitigating-out-of-terms-api-usage/)).
  - Results stop at 20 pages ([2022-08-11](https://make.wordpress.org/openverse/2022/08/11/openverse-api-results-constrained-to-20-pages/)).
  - Going over the limit returns 429, with headers showing permitted and remaining usage.
  - I found no current exact numbers, so the script must read the headers and back off.
  - *Inference:* GitHub-hosted runners share egress IPs, so an anonymous throttle may already be partly used by other people. Registered credentials avoid that.
- **Terms on automated use:**
  - "You must adhere to all rate limits, registration requirements, and comply with all requirements in Openverse documentation."
  - "You must not scrape the content in the Openverse catalog" ([Openverse Terms of Service, archived 2024](https://webcf.waybackmachine.org/web/20240518175049/https://docs.openverse.org/terms_of_service.html)).
  - Using multiple machines to get around the throttles is a terms violation (2022 post).
  - A script that makes one or two targeted queries for each of about 130–200 named gaps, on one runner, is ordinary API use. A runner matrix or a bulk crawl is not.
- **No licence verification:** Openverse "does not verify its licensing status" (ToS). Its About page says the same ([openverse.org/about, archived](https://webcf.waybackmachine.org/web/20231210110130/https://openverse.org/about)). So every licence is re-checked at source (§3.3).
- **Fields returned:** reported by secondary sources and the catalog handbook ([provider API: Flickr](https://make.wordpress.org/openverse/handbook/openverse-handbook/openverse-catalog/provider-api-flickr/), [Go client](https://pkg.go.dev/github.com/tamnd/openverse-cli@v0.1.0/openverse)); fail closed if a field is missing.
  - `id`, `title`, `creator`, `creator_url`;
  - `license` (a slug: `by`, `by-sa`, `cc0`, `pdm`…), `license_version`, `license_url`;
  - `foreign_landing_url` (the photo's page on its own host);
  - `url` (the file itself), `provider` and `source` (for example `flickr`);
  - `attribution` (a ready-made string), `tags`, `width`, `height`.
- **TASL mapping:** Title = `title`; Author = `creator` (+ `creator_url`); Source = `foreign_landing_url`; Licence = `license` + `license_version` → `CC BY 2.0` and so on, with `license_url`. The credit names the original host (Flickr); `via: "openverse"` is kept in the row for the audit.
- **Where the bytes come from:** `url` points at Flickr's own image host, so Flickr's terms (§3.2) govern that one download.

---

## 5. Unsplash (deep dive)

### 5.1 Is the Unsplash License compatible with copies in a public repo?

**Yes, on the licence alone.**
- The licence allows free use, download and modification without permission. Attribution is not required.
- It forbids two things: selling images "without significant modification", and "compiling photos from Unsplash to replicate a similar or competing service" ([unsplash.com/license](https://unsplash.com/license)).
- Unsplash explains the second as "mass scraping or crawling images from Unsplash and using those images to build a site just like Unsplash" ([help article](https://help.unsplash.com/en/articles/2612332-what-do-you-mean-by-compiling-images-to-replicate-a-similar-or-competing-service)).
- A travel guide with a modest number of curated hero and cover photos is not a photo service. Never expose the set as a browsable photo library.
- Unsplash+ is a separate, paid licence ([unsplash.com/plus/license](https://unsplash.com/plus/license)) and stays refused.

**TASL mapping, already in the gate:**
- **Title:** the description or alt text.
- **Author:** `user.name`, linked to the profile with UTM.
- **Source:** `unsplash.com/photos/<slug>` with UTM.
- **Licence:** "Unsplash License", https://unsplash.com/license.

### 5.2 The API rules (separate from the licence)

- **Hotlinking:** "All API uses must use the hotlinked image URLs returned by the API under the photo.urls properties". This applies "to all uses of the image and not just search results" ([Guideline: Hotlinking Images](https://help.unsplash.com/en/articles/2511271-guideline-hotlinking-images)). The API Terms §6 require hotlinking and download notification, and "failure to comply with Section 6 constitutes a material breach" ([unsplash.com/api-terms](https://unsplash.com/api-terms)).
- **Download trigger:** when an app does "something similar to a download, such as when a user chooses the image to include in a blog post, set as a header, etc.", it must request `photo.links.download_location`. That endpoint "is not to be used to embed the photo", and the call must be authorized ([Guideline: Triggering a Download](https://help.unsplash.com/en/articles/2511258-guideline-triggering-a-download)).
- **Attribution:** "must attribute Unsplash, the Unsplash photographer, and contain a link back to their Unsplash profile", with UTM parameters ([Guideline: Attribution](https://help.unsplash.com/en/articles/2511315-guideline-attribution)).
- **Production status:** demo keys get 50 requests an hour and production 1,000 after review. "Apps consumed by the public … should apply for Production status". Approval requires hotlinking and download tracking ([When should I apply for a higher rate limit?](https://help.unsplash.com/en/articles/3887917-when-should-i-apply-for-a-higher-rate-limit), [documentation](https://unsplash.com/documentation)). **A self-hosting app cannot pass that review.**
- **The remix exception:** images "remixed to create a derivative creative image" need not be hotlinked (hotlinking guideline). Resizing and recompressing are not a creative derivative. **Do not rely on this exception.**
- **No route around the API:** the Unsplash Terms bar bots, scripts, crawlers and scrapers except through a browser, a published app, or the API under the API Terms ([unsplash.com/terms](https://unsplash.com/terms)). Scripted downloads from the website, made to avoid the API rules, are not allowed either.
- **Self-hosting by permission:** one search summary of the hotlinking guideline says companies wanting their own hosting should contact the API team about a "photo views beacon" alternative (wording unconfirmed).

### 5.3 Review of `tools/beta/imagery/fetch-unsplash.js`

**What already complies:**
- `GET /photos/:id` with `Client-ID`, refusing premium and Unsplash+ photos (lines 190–196).
- It fires `download_location` with authorization (lines 201–202).
- The credit "Photo by <name> on Unsplash" with profile and photo links carrying `utm_source=cleo_guide&utm_medium=referral` (lines 57, 210–223).
- A budget of 45 calls, under the demo limit of 50 an hour.

**What conflicts:**
- **Lines 203–209** download `urls.raw` with `w=960&fm=webp` and write `beta/assets/img/photos/<name>-960.webp`, and the page then serves that local copy. That is not hotlinking. It breaks the hotlinking guideline and API Terms §6.
- A public site running on a demo key is also outside the production policy.

**Status:** `CREDITS.json` has 0 Unsplash rows, and the workflow skips Unsplash unless `UNSPLASH_ACCESS_KEY` is set. **No breach has occurred.** Keep it that way until the owner picks a fix.

`design/beta/IMAGERY.md` ("One tension for the owner to decide") already names this conflict. The research above confirms that the tension is real and that the API Terms call it a material breach.

### 5.4 Changes that would make it compliant (the owner picks one)

- **(a) Manual and self-hosted. Recommended, because only hero and cover slots need it.**
  - The owner picks each photo on unsplash.com in a browser. They use the site's own Download button (the licence covers it, and the Terms allow browser access), confirm there is no Unsplash+ badge, and add the `CREDITS.json` row by hand. The gate already validates Unsplash rows.
  - Code change: remove the API calls and the image download and file write (lines 179–233). Keep the planner (today's `--dry-run` output). Add a `--row <target>` helper that prints a credit-row template.
  - Workflow change: drop the "Fetch Unsplash photos" step and the `UNSPLASH_ACCESS_KEY` secret.
- **(b) Hotlink mode. Automated, but an owner decision.**
  - The row stores `remote: {base: urls.raw, w, h}` instead of `file`. The renderer emits `<img src="https://images.unsplash.com/…&w=960&fm=webp&q=72" srcset="…w=500 500w, …w=720 720w, …">` with the typographic plate behind it. `download_location` fires once, at selection. Apply for Production.
  - It needs changes to `photos.js` (allow `remote` only for `provider: "unsplash"`, host `images.unsplash.com`), `test-imagery.js`, and the weight budgets (the bytes come from a third party).
  - It needs an **explicit, recorded exception** to IMAGERY.md D-4 ("never hotlinked") and to DECISIONS UX-23 ("no third-party request (privacy)"). Rule 4 still holds to the letter, because the plate keeps the page complete.
  - This is not a Google surface, so `check-google.py` is unaffected.
- **(c) Written permission** from Unsplash's API team to self-host downloaded files for this non-commercial guide. With it, the current script can run unchanged. Record the permission in `docs/BETA-DECISIONS.md`.

---

## 6. Other candidates (brief)

| Source | Licence | Automate from Actions? | Key / limits | TASL mapping | Notes |
|---|---|---|---|---|---|
| **Wikidata P18 / P373 / Commons P180 / geosearch** | the same Commons licences | yes | no key; Commons API etiquette (already in `fetch-commons.js`) | the existing Commons row | P18 is the item's image; P373 its Commons category; P625 its coordinates ([P18 talk](https://www.wikidata.org/wiki/Property_talk:P18), [P625](https://www.wikidata.org/wiki/Property:P625)). The depicts search `haswbstatement:P180=Q…` covers more than 28.5 M files ([Commons: Depiction](https://commons.wikimedia.org/wiki/Commons:Structured_data/Modeling/Depiction)). Geosearch: `list=geosearch&gscoord=lat|lon&gsradius=…&gsnamespace=6` ([Commons:Search by location](https://c.enwp.org/wiki/Commons:Search_by_location)). **Not used today:** the pipeline uses vetted WebSearch titles plus Wikipedia `pageimages`. |
| Mapillary | CC BY-SA 4.0 | yes | access token (`MAPILLARY_ACCESS_TOKEN`) from the developer portal | title, image link, username and profile link, "licensed under CC-BY-SA" ([Mapillary help](https://help.mapillary.com/hc/en-us/articles/115001770409-Licenses), [terms](https://mapillary.com/legal), [OSM wiki](https://wiki.openstreetmap.org/wiki/Mapillary)) | Street-level and often dashcam images; rarely good enough for a card. Low value. |
| Geograph | CC BY-SA 2.0 | yes (feed/API) | feed: "cache … say for 24 hours" ([geograph.org.uk/wallpaper](https://www.geograph.org.uk/wallpaper/)) | author, Geograph page, CC BY-SA 2.0 | Britain and Ireland only. The repo has no UK or Irish guide, so **zero yield**. |
| Pexels | Pexels License (not CC) | yes | key; "show a prominent link to Pexels"; "may not copy our core functionality"; no datasets or AI ([API docs](https://www.pexels.com/api/documentation/), [help](https://help.pexels.com/hc/en-us/articles/900005852323-How-do-I-get-unlimited-requests)) | "Photo by X on Pexels" (the gate needs a new licence string) | Stock photography with low place-specific yield. Rejected for venues in `design/research-2026-10/ux-competitive/evidence/itinerary-photo.md`. |
| Pixabay | Pixabay Content License (not CC) | yes | key; 100 requests per 60 s; "cached for 24 hours"; "permanent hotlinking … not allowed … download the images to your server first"; no systematic mass downloads ([API docs](https://pixabay.com/api/docs/)) | author, Pixabay page (gate needs a new licence string) | Self-hosting is actually *required*, which fits the repo. But it is stock with low place yield. |
| Tourism-board media libraries | custom, usually editorial or tourism promotion only | no (registration and request) | — | credit line as each board asks | Typical terms forbid transfer to third parties; for example, you may not "sell, lend, sublicense or otherwise transfer the image" ([visit-bw.com terms](https://www.visit-bw.com/en/terms-of-use-canto)). See also [Virginia pressroom](https://pressroom.virginia.org/imagerequests). A public repo lets anyone copy the file, and the gate refuses non-free licences. **Rejected**, except where a board publishes under CC BY or BY-SA (then it is just the Flickr or Commons route). |
| Venue press kits / permission | permission-based, not free | no | — | — | Venues are excluded by repo policy. Only a written CC BY or BY-SA grant would pass the gate (best routed to Commons through its permission process). Manual and rare. |

---

## 7. Ranking (expected yield for the current gaps × compliance risk)

Yields are estimates, not measurements.

| Rank | Source | Expected yield | Compliance risk | Effort |
|---|---|---|---|---|
| 1 | **Dispatch the queued Commons candidates** (`scope=all`) | ~240–270 photos (75–80 % of 340) | lowest (the existing gate) | none: one manual dispatch |
| 2 | **Wikidata / Commons category / depicts / geosearch** (`--wikidata`) | perhaps 20–40 % of the ~130–230 left | lowest (no gate change) | medium: extend `fetch-commons.js` |
| 3 | **Openverse → Flickr CC**, vetted by a person (optional `FLICKR_API_KEY`) | perhaps 30–50 % of what is still open, best for US, DE, BE and JP outdoor landmarks | medium: laundering, stale licence data, the Flickr caching clause; mitigated by §3.3 and two-stage vetting | medium: a new script and a gate provider |
| 3b | Flickr → Commons by a person (route B) | small and manual, but each file is reviewed | low | manual |
| 4 | Unsplash, manual path (hero and cover slots only) | the 2 motif heroes plus 19 cover targets; few landmarks | low if manual; **high** if the current storing path runs | low |
| 5 | Mapillary | low (quality) | low | medium |
| 6 | Pixabay, Pexels | low (stock) | low to medium (non-CC licences, a gate change) | medium |
| 7 | Tourism boards, press kits | very low | high (licences incompatible with a public repo) | manual |
| 8 | Geograph | zero (no UK or Irish guides) | — | — |
| ✗ | **Google Maps / Places photos** | — | **not allowed** | — |

---

## 8. Recommendation and build specs

### 8.1 Google Maps

- Do not fetch, store or hotlink Places photos, and do not scrape Maps pages.
- Keep or relabel the existing no-key Maps URL link ("See photos on Google Maps").
- Record the decision in `docs/BETA-DECISIONS.md`, with ToS §3.2.3 and SST §5.3 as reasons, so the question is not reopened.
- Nothing in this plan needs a Google key, so rule 4-ai and `check-google.py` stay as they are.

### 8.2 `fetch-commons.js --wikidata` (imagery lane; no secret; no gate change)

```
for each eligible target with no credit row
    (not a policy skip; a skip only for "no file found" or "only close-ups" reasons):
  qid   = target.qid
          || pageprops(article).wikibase_item
          || wbsearchentities(name, lang), kept only if its P625 is within 300 m of the geocodes.json pin
  files = P18(qid)                                        # the item's image
        + categorymembers(P373(qid), cmtype=file, ≤ 50)   # the place's own Commons category
        + search("haswbstatement:P180=" + qid, ns 6, ≤ 20)
        + geosearch(pin, radius 150 m, ns 6, ≤ 50)        # must still name the place
  for f in unique(files) minus refused minus credited:
      the existing checks: licence, author, depicts names, NOT_A_PHOTO, SIGNAGE, CLOSEUP, viewFrom, size, panorama
      first pass → the existing thumbnail download → the existing CREDITS row, plus via: "wikidata" | "category" | "depicts" | "geosearch"
```

- **Depicts rule:**
  - A P18 or P180 hit counts as confirmed by a structured statement.
  - A category hit passes the existing category-name test.
  - A geosearch hit must still name the place, so a neighbouring building cannot slip through.
- **Budget:** about 4–6 requests per target, so about 1,000 for 200 targets; it fits one `budget=1500` dispatch.
- **Gate and review:** the gate is unchanged (`provider: "wikimedia-commons"`). The run review is the usual contact sheet.

### 8.3 `fetch-openverse.js` (new; Flickr CC via Openverse)

**Stage 1, `--discover` (runner, dispatch only):** this stage commits metadata only, never images.
- **Query:** for each open target, `GET /v1/images/?q="<name>" <city>&license=by,by-sa,cc0,pdm&source=flickr&page_size=20`.
- **Pacing:** one request a second, read the rate-limit headers, stop cleanly on 429, run on one runner and never in a matrix.
- **Filter:** the name must appear in the title or tags (the same normalisation as `fetch-commons.js`); width at least 1,000 px; refuse NC and ND; apply the existing NOT_A_PHOTO, SIGNAGE and CLOSEUP rules (move them into a shared `rules.js`).
- **Output:** write `beta/assets/img/openverse-candidates.json` with `{target, id, title, creator, creator_url, license, license_version, license_url, foreign_landing_url, url, width, height, tags, query, found}`.

**Stage 2, vetting (lane and orchestrator):** apply the human checks in §3.3. Approved lines go into `tools/beta/imagery/manifest/flickr.tsv` with `depicts` and `confidence`. A refusal for a photo fault applies to every target, as today.

**Stage 3, `--fetch` (runner):** for each approved candidate:
- **With `FLICKR_API_KEY`**, call `flickr.photos.getInfo`, `getExif`, `geo.getLocation` and `people.getInfo`, and apply §3.3 checks 1–5, 7 and 10. Also refuse owners on Commons' questionable-users list.
- **Without the key**, fetch only vetted candidates whose Openverse licence is still free.
- **Download:** the 1024 px size from the URL Flickr returns, once. Resize with `sharp` to 960, 720 and 500 px as `<page>--<id>-<w>.jpg`; `recompress.js` then handles weight.
- **Credit row:** `{file, variants, record, title, depicts, author, authorUrl, sourceUrl: "https://www.flickr.com/photos/<owner>/<id>/", licence, licenceUrl, provider: "flickr", via: "openverse", flickrId, openverseId, modified: "resized to … px wide", fetched, confidence, checks:{licenceAt, candownload, exifArtist, geoDistanceM, ownerPhotos}}`.

**Gate (`photos.js` + `test-imagery.js`):**
- `provider: "flickr"` requires `sourceUrl` to match `^https://www\.flickr\.com/photos/[^/\s]+/\d+/?$` (Flickr's link-back rule).
- The licence must be in the existing free list; "No known copyright restrictions" stays refused.
- The author must not be a URL (already enforced).
- A new test: at most 30 Flickr rows per page (the Flickr API display limit).
- One Flickr ID, one row.
- `hostOf()` maps `www.flickr.com` to "Flickr".

**Secrets:** none required. Optional: `OPENVERSE_CLIENT_ID` and `OPENVERSE_CLIENT_SECRET` (registered limits; they avoid shared-IP throttling), and `FLICKR_API_KEY` (needs a Flickr Pro account and a non-commercial key).

**Workflow (owned by the orchestrator):**
- Add a step after Commons and before recompress and the gates: `node tools/beta/imagery/fetch-openverse.js --fetch --budget 200`. It exits 0 when nothing is approved.
- Add a dispatch-only discover job that commits only `openverse-candidates.json`.

### 8.4 Unsplash

- Adopt §5.4(a) unless the owner prefers (b) or obtains (c).
- Until then, leave `UNSPLASH_ACCESS_KEY` unset, which is the current state, so the storing path never runs.

---

## 10. Pexels: API terms on stored copies, and yield (image sources lane, 2026-10-17 14:20Z)

Asked by the orchestrator after D-51. Research was done with WebSearch only, so quotes are from search summaries of Pexels' own
pages. Nothing is mapped or staged; the orchestrator decides.

**(1) Storing or self-hosting versus hotlinking.** No Pexels page found requires hotlinking or forbids stored copies.
- The Terms grant a licence to "download, use, copy, modify or adapt the Content for commercial or non-commercial purposes"
  ([Terms](https://www.pexels.com/terms-of-service/)).
- The API help centre talks only about caching API *responses* ("24 hours is a good amount of time to cache responses for") and notes
  that the returned image URLs are stable ([rate-limit help](https://help.pexels.com/hc/en-us/articles/900006470063-What-steps-can-I-take-to-avoid-hitting-the-rate-limit)).
- It also says "API users are bound to the same Terms and Conditions as Pexels users"
  ([What is the Pexels API?](https://help.pexels.com/hc/en-us/articles/900005304306-What-is-the-Pexels-API)).
- Unlike Unsplash (D-51), there is no hotlink-only rule. Caveat: the absence is not proven. No page states "you may store
  downloaded files" in so many words.

**(2) Attribution.**
- The licence says "attribution is not required" ([licence](https://www.pexels.com/license/)).
- The API guidelines ask for "a prominent link to Pexels" (a text link or the logo) and to "credit our photographers when possible
  (e.g. 'Photo by John Doe on Pexels' with a link to the photo page)"
  ([API docs](https://www.pexels.com/api/documentation/); [credit help](https://help.pexels.com/hc/en-us/articles/900005851903-How-should-I-give-credit-Can-I-use-your-logo)).
- Our TASL caption ("Photo by <name> on Pexels", source link, licence link) satisfies both.

**(3) Limits.**
- 200 requests an hour and 20,000 a month, by default ([API docs](https://www.pexels.com/api/documentation/)).
- "Abuse of the API, including … attempting to work around the rate limit, will lead to termination."
- The API is to "enhance" a product, not replicate Pexels. Wallpaper and image-gallery apps count as replicating, and so does
  redistributing on other stock platforms ([wallpaper help](https://help.pexels.com/hc/en-us/articles/4405588861721-Can-I-use-the-API-as-a-wallpaper-app)).
- Building ML/AI datasets is prohibited without permission.
- A guide that uses a few landmark photos inside place cards is not a gallery app.

**(4) Derivatives.** "You can modify the photos and videos from Pexels" ([licence](https://www.pexels.com/license/)). Our resized
500/720/960 JPEG copies are covered. The limits concern selling unaltered copies, implied endorsement by people or brands, and use in
trademarks; none applies here.

**Yield sample.** 5 searches over the 41 gaps no other source covers (15 tier-1: Japan 6, Germany/Belgium 9; 26 Singapore first-24):

| Target | Result |
|---|---|
| tokyo#takeshita-dori | 2 titled hits ("Crowded Takeshita Street, Harajuku in Tokyo, Japan" 15829196; "Vibrant Nightlife at Takeshita Street in Tokyo" 30961867) |
| kyoto#to-ji | 1 maybe (15830266, a Kyoto pagoda alley tagged "Toji", title does not name Tō-ji) |
| saarland#bremmer-calmont-klettersteig | 1 near-miss (18610633, "Aerial View of Moselle River Bend near Bremm": the Calmont slope, not the climbing route) |
| singapore/punggol#punggol-point-park | 0 |
| singapore/toa-payoh / balestier sights | 0 |

The estimate is about 3–6 usable photos out of the 41: some Japan landmarks, a few German ones, and almost none for the Singapore
neighbourhood sights.

**Recommendation: no, not now.**
- The licence and the API terms permit what we would do: stored, resized, credited, sights only.
- But the realistic yield is a handful of photos, and that doesn't justify a new key, a new gate path (the Pexels licence string is
  still not in LICENCE_OK) and a contact-sheet review cycle.
- Revisit only if the Japan tier-1 gaps become a priority. If so, ask the owner to confirm the API terms page and add PEXELS_API_KEY.
  The pexels.js adapter is already written and tested.

## 9. Sources (all found through WebSearch; quotes are from search summaries)

**Google**
- Google Maps Platform Terms of Service: https://cloud.google.com/maps-platform/terms
- EEA Terms of Service (store/rehost/bulk-download wording): https://cloud.google.com/terms/maps-platform/eea
- Service Specific Terms (current): https://cloud.google.com/maps-platform/terms/maps-service-terms; 2024 version with §5.1–5.4: https://cloud.google.com/maps-platform/terms/maps-service-terms/index-20240522
- Place Photos (New): https://developers.google.com/maps/documentation/places/web-service/place-photos
- Places API policies and attributions: https://developers.google.com/maps/documentation/places/web-service/policies
- Maps JavaScript Place Photos: https://developers.google.com/maps/documentation/javascript/place-photos
- Google ToS (Permission to use your content): https://policies.google.com/terms?hl=en-US
- Google Maps Additional Terms: https://www.google.com/help/terms_maps/
- Maps URLs (no key): https://developers.google.com/maps/documentation/urls/get-started

**Flickr**
- API Terms: https://www.flickr.com/help/terms/api and https://www.flickr.com/services/api/tos/
- Developer Guide, API (3,600 per hour; 24-hour cache; blocking scrapers): https://www.flickr.com/services/developer/api/
- Developer Guide, Community (link-back): https://www.flickr.com/services/developer/community/
- API keys for Pro only; the 1,024 px limit: https://www.flickrhelp.com/hc/en-us/articles/4404070036884-Flickr-API
- Terms of Use (no scraping; downloads): https://www.flickr.com/help/terms
- CC 4.0 on Flickr: https://blog.flickr.net/all/2025/06/18/creative-commons-4-0-has-arrived-on-flickr/, https://www.flickrhelp.com/hc/en-us/articles/40048459562388-Copyright-Licenses-on-Flickr, https://cogdogblog.com/?p=75623
- Older API page (non-commercial; commercial by arrangement): https://www.flickr.com/services/api/
- MSU guide paraphrasing the caching term: https://copeid.ssrc.msstate.edu/wp-content/uploads/2022/06/FINAL-Flickr-Documentation.pdf
- Commons, Flickr washing and the questionable-users list: https://commons.wikimedia.org/wiki/Commons:Questionable_Flickr_images, https://commons.wikimedia.org/wiki/Commons:Flickr_files

**Openverse**
- Terms of Service (archived 2024): https://webcf.waybackmachine.org/web/20240518175049/https://docs.openverse.org/terms_of_service.html
- Out-of-terms usage, 2022: https://make.wordpress.org/openverse/2022/06/17/mitigating-out-of-terms-api-usage/
- 20-page cap: https://make.wordpress.org/openverse/2022/08/11/openverse-api-results-constrained-to-20-pages/
- Infrastructure (1 request a second, anonymous): https://make.wordpress.org/openverse/tag/infrastructure/
- Auth API summary: https://apis.apievangelist.com/store/openverse-auth-api/
- About (licences not verified): https://webcf.waybackmachine.org/web/20231210110130/https://openverse.org/about
- Field names: https://make.wordpress.org/openverse/handbook/openverse-handbook/openverse-catalog/provider-api-flickr/, https://pkg.go.dev/github.com/tamnd/openverse-cli@v0.1.0/openverse, https://jentic.com/apis/openverse.org/openverse

**Unsplash**
- License: https://unsplash.com/license
- Compiling clause explained: https://help.unsplash.com/en/articles/2612332-what-do-you-mean-by-compiling-images-to-replicate-a-similar-or-competing-service
- API Guidelines: https://help.unsplash.com/en/articles/2511245-unsplash-api-guidelines
- Hotlinking: https://help.unsplash.com/en/articles/2511271-guideline-hotlinking-images
- Download trigger: https://help.unsplash.com/en/articles/2511258-guideline-triggering-a-download
- Attribution: https://help.unsplash.com/en/articles/2511315-guideline-attribution
- API Terms (§6, material breach): https://unsplash.com/api-terms
- Terms (no bots except through the API): https://unsplash.com/terms
- Rate limits and production status: https://help.unsplash.com/en/articles/3887917-when-should-i-apply-for-a-higher-rate-limit, https://unsplash.com/documentation

**Others**
- Commons depiction: https://commons.wikimedia.org/wiki/Commons:Structured_data/Modeling/Depiction
- Commons geosearch: https://c.enwp.org/wiki/Commons:Search_by_location
- Wikidata P18 and P625: https://www.wikidata.org/wiki/Property_talk:P18, https://www.wikidata.org/wiki/Property:P625
- Mapillary: https://help.mapillary.com/hc/en-us/articles/115001770409-Licenses, https://mapillary.com/legal, https://wiki.openstreetmap.org/wiki/Mapillary
- Geograph: https://www.geograph.org.uk/wallpaper/
- Pexels: https://www.pexels.com/api/documentation/, https://help.pexels.com/hc/en-us/articles/900005852323-How-do-I-get-unlimited-requests
- Pixabay: https://pixabay.com/api/docs/
- Tourism-board terms (examples): https://www.visit-bw.com/en/terms-of-use-canto, https://pressroom.virginia.org/imagerequests

**Repo files read:**
- `.github/workflows/beta-fetch-unsplash.yml`
- `tools/beta/imagery/{fetch-commons.js, fetch-unsplash.js, photos.js, coverage.js}`
- `tools/engine_guard.py`
- `design/beta/IMAGERY.md`
- `docs/resume/imagery.md`
- `beta/assets/img/{CREDITS.json, commons-candidates.json, photos/README.md}`
