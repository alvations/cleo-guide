# Decision log

Every judgement call, with the reasoning and the alternative that was rejected. Written so a
future editor can disagree deliberately rather than by accident.

---

### D1 — Reject unattributed listicles entirely

**Decision.** Use only sources with a byline, photographs and specifics.
**Reasoning.** A generic "hidden gems" search returned a tree-service company's blog, a
car-service marketing page and a university subdomain hosting scraped text. Including them would
dilute every real source and there is no way to verify what they claim.
**Rejected alternative.** Include them with a lower weight. Rejected because a reader cannot audit
a weight, but they can audit a link.

### D2 — Mine the source's own index rather than searching for more sources

**Decision.** When a brief supplies individual entries from a catalogue, read the catalogue's city
index first.
**Reasoning.** Four Atlas Obscura links were supplied; the site holds roughly 33 Cleveland entries.
Reading the index produced Wade Memorial Chapel — a Tiffany interior that is plausibly the best
thing in the guide. No amount of further searching surfaced anything comparable.
**Cost.** One search. **Yield.** Nine entries, one of them exceptional.

### D3 — Keep closed places, clearly flagged

**Decision.** Lolly the Trolley, Sokolowski's and Hot Sauce Williams stay in the file marked
`CLOSED`.
**Reasoning.** These appear in the sources and in readers' memories. Silence makes a reader hunt
for something that no longer exists; an explicit entry saves the trip. For Bourdain's
restaurants the closure is itself the interesting fact.
**Rejected alternative.** Delete them. Rejected because absence carries no information.

### D4 — Keep entries that are not places

**Decision.** News 5 #49, a social media account, gets a card pinned to the organisation's
headquarters, labelled as not a place, with "do not drive here".
**Reasoning.** A missing number in a numbered list reads as a bug. Explaining the gap costs one
card and removes all doubt.

### D5 — Split anything the source numbered separately

**Decision.** One source item = one card.
**Reasoning.** Combining Lucy (#73) and the moon rock (#6) made 100 sources look like 98 cards.
The user noticed the shortfall and reasonably assumed places were missing. Reconciliation only
works when the mapping is one-to-one.

### D6 — Rank within each region, not across the city

**Decision.** Tier is assigned relative to the other places in the same area.
**Reasoning.** Ranked globally, "must see" returns nine downtown stops and almost nothing
elsewhere — useless to someone spending a day on the west side. Ranked per region, the filter
yields a workable day anywhere. `validate.js` asserts every area has at least one must-see.
**Cost.** A suburban must-see is not equivalent to a downtown one. The guide states this openly.

### D7 — Offer a second, objective ranking

**Decision.** Alongside editorial tier, expose a count of distinct sources per place and let the
reader sort by it.
**Reasoning.** Tier is one person's judgement. A reader who distrusts it should have a signal that
does not depend on it. Source count is verifiable from the tags on the card.

### D8 — Cuisine tags require a named dish, not a label

**Decision.** Singaporean requires char kway teow, Hokkien mee, chicken rice, chai tow kway or
laksa on the menu. "Singapore noodles" disqualifies a place.
**Reasoning.** Cuisine labels are applied loosely by restaurants and aggregators alike. A dish
name is falsifiable. This test left exactly one qualifying Singaporean restaurant in the city,
which is the correct answer rather than a disappointing one.
**Extension.** For Chinese, state the regional tradition on the card — Cantonese, Sichuan,
Hokkien — because "Chinese" tells a reader nothing about whether the dim sum is any good.

### D9 — State gaps instead of filling them

**Decision.** The Middle Eastern card says plainly that Cleveland has no Persian restaurant with
the required reputation.
**Reasoning.** A padded recommendation costs a reader an evening. An admitted gap costs nothing
and makes every other entry more credible. Applied again where a Singaporean menu could not be
confirmed to carry two specific dishes — the card says exactly what was verified and what was not.

### D10 — Food gets its own map

**Decision.** Sights and food are separate datasets behind a mode toggle, never merged.
**Reasoning.** Requested, and correct anyway: 183 mixed pins is unreadable, and the two are used
at different moments — planning a day versus choosing dinner.

### D11 — But source-listed eateries stay on the sights map

**Decision.** b.a. Sweetie, Chagrin Falls Popcorn Shop, Great Lakes Brewing and Ball Ball Waffle
remain in the sights list because News 5 numbered them. Restaurants added from general knowledge
live only in food mode.
**Reasoning.** The coverage promise is that every numbered source entry appears in the sights
list. Moving one to satisfy a tidiness instinct breaks the reconciliation check.
**Consequence.** Seven ADD-only restaurants that had been duplicated across both lists were
removed from sights. `validate.js` now fails the build on any duplicate name.

### D12 — OpenStreetMap default, Google by reader's key, Apple by deep link

**Decision.** Five free layers ship enabled. Google layers require the reader's own API key.
Apple is handled by per-place `maps.apple.com` links only.
**Reasoning.** Google forbids tile use outside its own API, which requires a billed key — no
static page can ship it as a default without embedding someone else's credentials. Apple has no
tile service at all; MapKit JS needs a server-signed JWT, impossible from a static file and
leaking the key if attempted. The deep links are what a reader uses for navigation anyway.
**Rejected alternative.** Scrape Google tiles. Rejected: it violates the terms and breaks without
warning.

### D13 — Draw a vector backdrop that never depends on the network

**Decision.** Hard-code the shoreline, river, four arteries and eight neighbourhood labels as
coordinates in the file.
**Reasoning.** Tile servers could not be reached from the build sandbox at all, so their real-world
availability was unverifiable. A map showing floating dots with no geography is worse than useless.
Ten minutes of coordinates guarantees orientation in every failure mode.

### D14 — Render the guide before, and independently of, the map

**Decision.** Lists, filters and exports render immediately. The map mounts separately if Leaflet
arrives.
**Reasoning.** The first architecture deferred all rendering until a map library resolved, so a
blocked CDN meant a blank page. Content must never be hostage to a decoration.

### D15 — Correct sources rather than repeat them

**Decision.** The chess collection card gives 325 Superior Ave and notes that News 5 prints 525.
**Reasoning.** Verification exists to be acted on. Silently repeating a published error passes it
to the reader; silently correcting it leaves them confused when the article disagrees.

### D16 — Ship a shortlist first, then expand

**Decision.** v1 was 19 hand-picked stops in three geographic clusters with a working route map.
v2 became the complete 183.
**Reasoning.** The shortlist was usable within one exchange and proved the format before the
expensive transcription work. It remains the better artefact for a first-time visitor with a
weekend, so it is preserved in `versions/v1-shortlist/`.
**Lesson.** Ship the small honest version first. Keep it when you expand — the complete version
serves a different reader, it does not supersede it.
