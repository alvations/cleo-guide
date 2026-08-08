# Methodology

How this guide was actually built, including the judgement calls and the things that went wrong.

---

## 1. Sourcing

Everything begins with named sources. The guide's core promise is that **no entry exists without
a traceable reason for existing**, so each record carries the source key and, where the source
numbered its list, the item number.

Sources fell into three tiers of usefulness:

**Curated lists with local reporting** — the backbone. News 5 Cleveland's *100 Hidden Gems*,
Atlas Obscura's city catalogue, a travel blogger's *23 Unique Things To Do*. These are worth
transcribing in full.

**Local press for food** — Cleveland Scene, Cleveland Magazine, Freshwater, The Infatuation.
Essential for cuisine claims, because national listicles do not know which Chinese restaurant
serves Cantonese and which serves Sichuan.

**SEO filler** — most "hidden gems in CITY" results. Recycled, unattributed, often wrong.
A generic web search returned Wix blog spam, a car-service marketing page, and a Craigslist
listicle. **None of it was used.** Discarding these is not laziness; including them would have
diluted every real source in the file.

> The single most valuable discovery was that Atlas Obscura catalogues roughly 33 Cleveland
> places while the brief supplied only four links. Reading the *source's own index* rather than
> searching for more sources produced better results than any further searching did.

### Completeness

When a source numbers its entries, transcribe **all** of them and verify programmatically:

```js
const found = new Set([...HTML.matchAll(/\["N5","#(\d+)"\]/g)].map(m => +m[1]));
// then assert 1..100 all present
```

This check lives in `tools/validate.js` and it caught a genuine gap. Two related notes:

- **Combined entries hide gaps.** Putting "Lucy and the moon rock" on one card makes 100 sources
  look like 98 cards. Split anything the source treated separately.
- **Include the dead ones.** Lolly the Trolley closed in 2022; Sokolowski's closed in 2023. They
  stay in the file, flagged as closed, so a reader knows they are gone rather than hunting for
  them. Same for News 5 entry #49, which is a Twitter account and not a place at all.

## 2. Verification

Every place was resolved through a places API to obtain **real coordinates, the current address,
and current opening hours**. Never trust the coordinates or hours printed in an article.

This caught a factual error worth the whole exercise: News 5 lists the Cleveland Public Library
chess collection at *525 Superior Ave*. The Main Library is at **325 Superior Ave**. A reader
following the article would have walked to the wrong building.

Opening hours turned out to be the highest-value field in the entire dataset. Roughly a fifth of
the places have hours restrictive enough to wreck a day's plan — a museum open Friday and
Saturday afternoons only, a market closed Tuesdays and Thursdays, a deli that shuts at 3pm and
does not open at weekends. Every one of these carries a `warn` flag that renders as a red-barred
callout, because a beautifully written entry for somewhere closed is worse than no entry.

## 3. Ranking

Two independent signals, deliberately kept separate:

**Tier** (`t: 1 | 2 | 3`) is editorial judgement — must see, worth the detour, deep cut.
It is graded **within each region, not across the city**. A must-see in the suburbs is not
competing with a must-see downtown. This matters: rank globally and the must-see filter returns
nine downtown stops and nothing anywhere else, which is useless for planning. `validate.js`
asserts every region has at least one must-see.

**Source count** is objective — how many independent sources named this place. Offered as a
separate sort so a reader who does not trust the curator can trust the crowd instead.

Tier 3 is not a synonym for bad. It means a plaque, a private house viewable only from the
pavement, a two-minute stop, or something so seasonal that seeing it takes luck.

## 4. Cuisine rules

Generic cuisine tags are worthless. The rules applied here were deliberately strict and are
stated in the guide itself so a reader can audit them:

| Cuisine | Rule |
|---|---|
| Vietnamese | Vietnamese-owned or family-run, and named by local press |
| Singaporean | Menu must carry real dishes — char kway teow, Hokkien mee, chicken rice, chai tow kway, laksa. "Singapore noodles" is not a Singaporean dish and disqualifies a place |
| Chinese | State the regional tradition on the card (Cantonese, Sichuan, Hokkien). Only places raved about by local food press |
| Unique American | Beyond burgers and pizza. Viral or heavily raved |
| European / Latin American | Viral or heavily raved |
| Middle Eastern | Note Persian specifically where it exists |

**Say so when something does not exist.** Cleveland has no Persian restaurant with the required
reputation. The card says that in plain words rather than padding the list with a mediocre
substitute. A guide that admits a gap is more trustworthy than one that fills it.

Similarly, where a claim could not be fully verified — whether one Singaporean kitchen currently
serves char kway teow — the card states exactly what was confirmed and what was not.

## 5. Television and film

Food TV features age badly. Of the four Cleveland restaurants Anthony Bourdain visited in 2007,
**three have closed**. Two are retained as explicit `CLOSED` entries because knowing a place is
gone has real value to someone planning a trip around it.

Also worth checking: no "weird food history" YouTube channel covers specific restaurants in this
city. They cover topics. Verify before promising a category exists.

## 6. Base maps and licensing

This is where most guides quietly break the rules.

- **Google** does not permit its map tiles outside the Google Maps JavaScript API, and that API
  requires a billed key. No static page can ship Google as a default without embedding someone
  else's key. The guide therefore offers Google layers via the official GoogleMutant plugin,
  activated by the reader's own key, stored only in their browser.
- **Apple** has no tile service at all. MapKit JS requires a JWT signed with a private key from a
  paid developer account and refreshed server-side. It is impossible from a static file, and
  attempting it would leak the key. Apple is handled by per-place `maps.apple.com` links, which
  open the real app on iOS — and that is what a reader actually wants for navigation.
- **Free and correctly licensed**: OpenStreetMap, CARTO, Esri.

## 7. Failure modes that actually happened

Documented because they are not obvious and they cost real time.

**`document.write` destroyed the page.** A Leaflet CDN fallback wrote
`'<script src="..."><\/script>'`. The escaping produced a malformed `<\/script>` closing tag, so
when the primary CDN was blocked the fallback fired and swallowed the rest of the document. The
page went blank. **Never use `document.write` for script fallbacks.** Append a script element
and use its `onload` and `onerror`.

**The guide waited on a CDN before rendering anything.** The first fix still deferred all
rendering until a map library resolved. On a blocked network that meant a blank page for eight
seconds. The guide must render immediately; the map mounts separately if and when it can.

**A find-and-replace silently deleted 143 records.** A text splice between two markers removed
everything in between, and the result was still valid JavaScript that parsed cleanly. Syntax
checking cannot catch content loss. Every edit script now asserts on record counts before writing,
and `validate.js` runs before every commit.

**Scope errors from wrapping code in a function.** Moving map setup into `mountMap()` accidentally
trapped `gmaps()` and `amaps()` inside it, so every card failed to render. Wrapping existing code
in a new function moves every declaration inside it — check what else lived in that range.

**`prompt()` can return `undefined`.** Where dialogs are blocked, `prompt()` returns `undefined`
rather than `null`, so `if (k === null) return;` passes and `k.trim()` throws. Use `k == null`.
