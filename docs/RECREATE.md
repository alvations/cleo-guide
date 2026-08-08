# Building this for another city

A working sequence, in order, with the reasoning. Budget roughly a day for a city the size of
Cleveland. Most of the effort is sourcing and verification, not code.

Steps 1–5 are research, and an AI assistant with web search and a places API is genuinely good at
them. Steps 6–9 are mechanical. Step 10 is not optional.

---

## 1. Find the sources — do not just search

Search results for `hidden gems in CITY` are dominated by unattributed SEO filler. Skip it.
Look specifically for:

- **A local TV station's numbered list.** Nearly every US metro has one, usually
  `100 hidden gems of CITY` or `50 best CITY patios`. These are reported, photographed and
  numbered, which makes them ideal to transcribe and verify against.
- **The Atlas Obscura city index** — `atlasobscura.com/things-to-do/CITY/places`. Read the index
  itself rather than searching for individual entries. It is usually far larger than expected.
- **The alt-weekly** — Cleveland Scene, Chicago Reader, SF Weekly. Best food coverage anywhere.
- **The city magazine** — *Cleveland Magazine*, *Texas Monthly*. Good on neighbourhood dining.
- **The Infatuation** if it covers the city.
- **A local nonprofit news site** — Freshwater Cleveland and its equivalents.
- **The public history project** — Cleveland Historical, run by the state university, and similar.

Reject anything with no byline, no photographs and no specifics.

## 2. Transcribe completely

For every numbered source, capture **every** item, including:

- Places that have closed — flag them; readers need to know rather than hunt.
- Entries that are not places at all — flag them; a missing number looks like an error.
- Entries the source combined — split them, or your card count will not reconcile.

Record for each: name, address, what the source said, the source key, the item number.

## 3. Verify every place

Resolve each name and address through a places API. Take from it:

- **Coordinates.** Never use coordinates printed in an article.
- **Current address.** Articles carry typos; one in this dataset had the wrong street number
  for a major library.
- **Opening hours.** The highest-value field you will collect.
- **Permanent closures.**

Flag anything with hours restrictive enough to break a day: open two days a week, closed at
weekends, tour-only, seasonal, one day a year. These drive the whole itinerary.

## 4. Divide into areas

Three to five geographic clusters that match how locals talk about the city, not compass points.
"University Circle & East Side" is useful; "Northeast" is not. Each becomes a filter and a marker
colour. Aim for roughly balanced sizes.

## 5. Rank

Assign each place a tier of 1 (must see), 2 (worth the detour) or 3 (deep cut),
**graded within its own area**. Rule of thumb:

- **1** — you would regret missing it. Target 15–25% of each area.
- **2** — the default.
- **3** — a plaque, a private house, a two-minute stop, heavily seasonal, or closed.

Then let the data speak too: count how many independent sources named each place and offer that
as an alternative sort. Readers who distrust the curator can trust the crowd.

## 5b. Build the native routed map first

Before touching any code, render the itinerary as a routed map in one tool call. It needs no CDN,
no tiles and no hosting, and it will expose ordering mistakes immediately. Full instructions and a
replay-ready payload: [../versions/v1-shortlist/RECREATE-NATIVE-MAP.md](../versions/v1-shortlist/RECREATE-NATIVE-MAP.md).

Two rules decide whether a route actually draws: stops must sit inside `days[].locations[]`
(a flat `locations[]` never routes), and every `place_id` must be copied verbatim from the
places search.

## 6. Adapt the file

Everything lives in `index.html`. Edit these, in order:

| What | Where | Notes |
|---|---|---|
| Source table | `const S = {…}` | one entry per source: key, title, URL, description |
| Areas | `const AREAS = […]` | ids also used as marker colours in `AC` |
| Sights | `const P = […]` | see [DATA-SCHEMA.md](DATA-SCHEMA.md) |
| Food sources | `const FS = {…}` | separate table, separate filter |
| Cuisines | `const CUISINES = […]` | tailor to the city's actual food scene |
| Food | `const F = […]` | same shape plus `cz` |
| Marker colours | `const AC = {…}` | one hex per area id |
| Map centre | `map.setView([lat, lng], 11)` | |
| Vector backdrop | `SHORE`, `RIVER`, `ARTERIES`, `LABELS` | see below |
| Bounding box | `tools/validate.js`, `const BOX` | catches transposed coordinates |
| Title, headline, footer | HTML above the script | |

### The vector backdrop

The guide draws a coastline, a river, a few arteries and neighbourhood labels as plain
coordinates, so the map still gives orientation when every tile server is unreachable. Replace
these with 15–20 points traced from your city's defining geography — a coastline, a river, a
mountain ridge, a rail spine. Ten minutes of work, and it is the difference between a usable
fallback and floating dots.

Landlocked city? Drop `SHORE`, keep `RIVER` and `ARTERIES`, and add a ring road.

## 7. Cuisine filters, if you want them

Only worth doing if the city has real depth. Write the rules down **in the guide** so a reader
can audit them, and be strict: naming an actual dish that must appear on the menu is a far better
test than a cuisine label. Where a category has no worthy candidate, say so on the card. An
admitted gap beats a padded list.

## 8. Validate

```bash
cd tools && npm install && npm run validate
```

Checks structure, required fields, coordinate sanity against the bounding box, duplicate names,
complete coverage of numbered sources, at least one must-see per area, and known hazards.

Fix everything before moving on.

## 9. Test

```bash
npm test
```

Runs the real page in jsdom with the real Leaflet library, twice: once with the map library
delivered, once with it blocked. Both must pass. See [TESTING.md](TESTING.md).

## 10. Deploy

```bash
git init && git add -A && git commit -m "CITY field guide"
git branch -M main && git remote add origin git@github.com:USER/REPO.git
git push -u origin main
```

**Settings → Pages → Deploy from a branch → `main` / `(root)`.** `.nojekyll` is already present.

---

## Pitfalls, ranked by how much time they cost

1. **Never use `document.write` for a script fallback.** Malformed escaping silently destroys the
   whole document. Append a script element and use `onload` / `onerror`.
2. **Never let content depend on a CDN.** Render the guide immediately; mount the map separately.
   A blocked CDN should cost you a map, not a page.
3. **Assert on record counts in every edit script.** Deleting 143 records leaves valid JavaScript.
   Syntax checks will not save you; `validate.js` will.
4. **Watch scope when wrapping code in a function.** Everything in that range moves inside it.
5. **Check `k == null`, not `k === null`,** after `prompt()`. Blocked dialogs return `undefined`.
6. **Do not scrape Google or Apple tiles.** See METHODOLOGY §6. Use their URL schemes for
   per-place links instead — that is what readers use for navigation anyway.
7. **Verify hours, not just addresses.** A perfect entry for somewhere closed is worse than none.
