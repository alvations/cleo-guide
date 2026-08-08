# Doing the research with an AI assistant

Most of the work here is sourcing and verification, which an assistant with web search and a
places API does well — provided you constrain it. These are the prompts and constraints that
produced good output, and the ones that produced slop.

---

## Sequence

**1. Harvest the named sources**

> Fetch each of these URLs and list every place named, with the item number the source gave it.
> Include entries that have closed and entries that are not places — flag them rather than
> dropping them. Do not merge two numbered entries into one.

Insisting on *every* item is what makes later verification possible.

**2. Read the source's own index**

> This source has a city index page listing far more entries than the links I gave you.
> Fetch the index and list what else is there.

This produced the single biggest quality gain in the project. Reading one source properly beats
searching for five more.

**3. Resolve the places**

> For each place, look it up and return the verified coordinates, current address and opening
> hours. Flag any that have closed permanently, and any whose hours are restrictive enough to
> constrain a day's itinerary.

**4. Tier them**

> Assign each place must see, worth the detour, or deep cut — graded within its own area, not
> across the city, so that filtering to must-see still yields a workable day in each area.
> Aim for 15–25% must-see per area. Say which places you found hard to call and why.

**5. Cuisines, if relevant**

> Only tag a place with a cuisine if a named source supports it. For Chinese, state the regional
> tradition. For Singaporean, name the specific dish on the menu that qualifies it —
> "Singapore noodles" does not count. If a category has no worthy candidate in this city, say so
> instead of padding.

## Constraints worth stating explicitly

**Do not use unattributed listicles.** Otherwise you get Wix blog spam and marketing pages. Name
the source types you will accept.

**Say when something does not exist.** Without this, an assistant will fill a requested category
with whatever is nearest. "There is no Persian restaurant here with that reputation" is a more
useful answer than a mediocre suggestion, and it is what a reader deserves.

**Separate what was verified from what was inferred.** One card in this guide says plainly that
two dishes could not be confirmed on a current menu. That honesty is the product working, not
failing.

**Distinguish knowledge from sourcing.** Places added from general knowledge rather than a named
article are tagged `ADDED` and the appendix says so. Never let those masquerade as sourced.

## Where an assistant needs supervision

**Bulk edits to a large file.** A text splice between two markers deleted 143 records here while
leaving valid JavaScript. Require an assertion on record counts before any write, and run
`validate.js` after every batch.

**Claims about TV and film features.** Verify each one. Three of the four restaurants from the
2007 Bourdain episode have closed, and no YouTube channel covers this city's restaurants
specifically despite the category sounding plausible.

**Licensing.** An assistant will happily wire up Google tiles that violate the terms of service.
State up front that only correctly licensed sources may be used, and that commercial map
providers must go through their own APIs with the reader's own key.

**"It works" without evidence.** Require the test output. This guide was declared finished twice
while broken, both times because the check was a mock rather than the real page.
