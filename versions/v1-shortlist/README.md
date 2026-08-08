# v1 — the 19-stop shortlist

The first version, preserved deliberately. **It is not superseded by the full guide.**

The complete edition covers 183 places and answers "what exists here". This one answers a
different and often better question: *"I have a weekend — what should I actually do?"* For a
first-time visitor, this is the more useful artefact.

## Contents

| File | What it is |
|---|---|
| `RECREATE-NATIVE-MAP.md` | **How to rebuild the routed map that worked first** — read this before writing any code |
| `native-map-payload.json` | The exact 19-stop payload, ready to replay in one tool call |
| `guide.html` | The original companion guide — 19 stops, source tags, filter by source (Leaflet) |
| `google-map.html` | The same 19 stops **rendered on Google Maps** — a routed map per day, keyless, no import step |
| `cleveland-shortlist.kml` | The 19 stops as a 3-day routed map, **for Google My Maps** |
| `cleveland-shortlist.geojson` | Same data for any other mapping tool |

## Three maps, three jobs

The routed map in this folder existed in three forms, and they are not substitutes:

| Form | Renders where | Shareable | Use it to |
|---|---|---|---|
| **Native widget** (`native-map-payload.json`) | in the Claude client | no | design and confirm the itinerary, instantly, with zero infrastructure |
| **Google My Maps** (`cleveland-shortlist.kml`) | Google's servers | yes, and syncs to the phone app | hand someone a real map they can keep |
| **Self-hosted** (`../../index.html`) | any browser | yes, and works offline | own the whole thing, filters and all |

The native map is the one that worked immediately and never broke. Build it first.

There is now a fourth form: **[`google-map.html`](google-map.html)** renders the same three days
directly on Google Maps in the browser — one routed map per day. It needs no API key (it uses
Google's classic embed) and no import step; paste a Google Maps Embed API key to upgrade to the
officially supported embed. It is the quickest way to *see* the route on Google's own map without
creating a My Maps.

## Get the map into Google Maps

1. Open [google.com/mymaps](https://www.google.com/mymaps) → **Create a new map**
2. **Import** → upload `cleveland-shortlist.kml`
3. Each day arrives as its own layer, colour it however you like
4. It syncs to the Google Maps app on your phone under **Saved → Maps**

The KML carries three folders — one per day — with the address, suggested arrival time and the
practical warning for each stop.

## The 19 stops

**Day 1 — Downtown Core** *(walkable)*
Soldiers' & Sailors' Monument · Chess Collection at Cleveland Public Library · The Arcade ·
Terminal Tower Observation Deck · Free Stamp · USS Cod

**Day 2 — University Circle & East Side** *(car or rideshare)*
Percy Skuy Collection at the Dittrick · Cleveland Museum of Art · Cleveland Museum of Natural
History · Haserot Angel at Lake View Cemetery · Rockefeller Park Greenhouse · Quintana's Speakeasy

**Day 3 — West Side, Tremont & South** *(car recommended)*
West Side Market · Buckland Museum of Witchcraft & Magick · A Christmas Story House ·
b.a. Sweetie Candy Company · Superelectric Pinball Parlor · The Sanctuary Museum · Solstice Steps

## Three scheduling traps that shape the whole trip

- **The Dittrick** opens Friday 10:30–4 and Saturday 12–4 **only**. It is the tightest constraint
  on the list — build the east-side day around it.
- **West Side Market** is closed Tuesday and Thursday.
- **The Sanctuary Museum** is Wednesday mornings and Saturday afternoons; **Terminal Tower's deck**
  is weekends with advance tickets.

A **Friday–Saturday–Sunday** trip threads all of them. Monday–Wednesday misses several.

## Why this version was built first

Shipping a small honest version early proved the format — source tags, geographic clusters,
hours-first warnings — before committing to transcribing 123 numbered entries. It was usable
within one exchange.

If you are recreating this for another city, **build the shortlist first.** It is cheap, it
validates the structure, and you will want to keep it.
