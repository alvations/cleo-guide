# Recreating the native routed map (for a future Claude session)

**This is the map that worked first and worked immediately.** It is not Leaflet, it is not in
`index.html`, and it fetches no tiles of its own. It is rendered by Claude's own client using
Google Places data, which is why it never suffered any of the CDN and tile-server problems that
later broke the HTML build.

If you are a Claude session picking this project up: **build this first.** It proves the itinerary
before anyone writes a line of code, and it renders in one tool call.

---

## Why it worked when the HTML map did not

| | Native map widget | Leaflet in `index.html` |
|---|---|---|
| Renders | in the Claude client | in the reader's browser |
| Map tiles | supplied by the client | fetched from a CDN by our code |
| Failure modes | essentially none | blocked CDN, blocked tiles, blocked JS library |
| Shareable | no — lives in the conversation | yes — any URL, any device, offline |
| Route drawing | built in | would need a routing API and a key |

They are not competitors. **Use the native map to design and confirm the itinerary; use the HTML
build to ship something the person can keep.** The mistake to avoid is assuming the HTML version
supersedes this one.

## The two rules that decide whether a route draws

Both of these are easy to get wrong and produce a silently degraded map.

1. **Routes only draw for day-structured itineraries.** Stops must go inside `days[].locations[]`.
   A flat `locations[]` array renders as plain markers and will **never** draw a route — passing
   `show_route: true` there is refused, and `"mode": "itinerary"` does not rescue it.
2. **`place_id` must be copied verbatim** from the `places_search` result. They are
   case-sensitive. Do not retype them, do not reconstruct them from memory, do not edit them.
   A wrong id silently degrades the pin to a bare coordinate with no photo, hours or rating.

Also: `show_route: false` always wins, and `travel_mode` accepts `driving`, `walking`, `transit`
or `bicycling`.

## The exact sequence

**Step 1 — resolve every stop in batched searches.** Up to 10 queries per call, `max_results: 1`
each. Include the city in every query or you will get the wrong Chelsea, the wrong Springfield.

```
places_search(queries=[
  {query: "Dittrick Medical History Center Case Western Reserve Cleveland", max_results: 1},
  {query: "Lake View Cemetery Cleveland Ohio", max_results: 1},
  ...
])
```

**Step 2 — keep three fields from each result**: `place_id` (verbatim), `latitude`, `longitude`.
Also read `weekday_hours` — it is the field that will restructure your itinerary.

**Step 3 — group geographically, not by theme.** Three to five clusters that match how locals
describe the city. Order the stops within each day so the route is a sensible line, and let the
opening hours override your preferred order.

**Step 4 — call the map tool.** The payload used for Cleveland is in
[`native-map-payload.json`](native-map-payload.json), ready to replay:

```
places_map_display_v0(
  title       = "Cleveland: The Odd & Overlooked",
  narrative   = "...",
  days        = [ {day_number, title, narrative, locations: [...]}, ... ],
  show_route  = true,
  travel_mode = "driving"
)
```

Each location takes `name`, `latitude`, `longitude`, `place_id`, `notes` (your tour-guide tip)
and `arrival_time`.

## What to put in `notes`

This field is the whole value of the map. Do not describe the place — the pin already shows the
name, photo, rating and hours. Use it for **the thing that will otherwise ruin the visit**:

- *"Section 9, Lot 14 — grab a map at the gate. Easy to miss, just off the road under trees."*
- *"Book online in advance; there are no walk-ups. Ride to 32, then transfer elevators to 42."*
- *"Bring cash — most stalls don't take cards. Park toward the back near the beer garden."*
- *"Entry is down a vertical ladder through a deck hatch. Not accessible."*

## Ordering by constraint, not preference

The Cleveland itinerary is shaped almost entirely by opening hours, and this is what makes it
worth more than a list of good places:

- **The Dittrick** opens Friday 10:30–4 and Saturday 12–4 only. It is the hardest constraint in
  the city and the entire east-side day is built around it.
- **Rockefeller Park Greenhouse** closes at 4pm — earlier than everything around it, so it has to
  move before the cemetery rather than after.
- **West Side Market** is closed Tuesday and Thursday, which fixes which day the west side runs.
- **Terminal Tower's deck** is weekends only with advance tickets.

A **Friday–Saturday–Sunday** trip threads all of them. Monday–Wednesday misses several. State
this in the `narrative` — it is the single most useful sentence on the map.

## Limits worth knowing before you promise anything

- The map lives in the conversation. It **cannot be hosted, bookmarked or opened on another
  device.** If the person wants that, they need the HTML build or a My Maps import.
- For a shareable equivalent, `cleveland-shortlist.kml` in this folder imports straight into
  Google My Maps, keeps the three days as separate layers, and syncs to the Google Maps phone app.
- Google Maps *directions* links cap at 10 stops. KML has no such limit.
