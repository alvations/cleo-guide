# Re-check of Wikidata-only accepts — 2026-10-16

Four pins were accepted on a Wikidata coordinate whose only "second source" was Wikipedia. Wikipedia usually mirrors
Wikidata P625, so it isn't independent. This re-check asked only independent sources (OSM via Nominatim and
Overpass, the official site's schema.org geo, the US Census geocoder) whether they agree with each **current
registry pin**. Runs: `tools/location-verify.js --names … --sources nominatim,official,overpass,census` on the
Actions runner; raw output in [recheck/san-francisco-ca-2026-10-16.md](recheck/san-francisco-ca-2026-10-16.md) and
[recheck/orlando-fl-2026-10-16.md](recheck/orlando-fl-2026-10-16.md).

| city | place | current pin | verdict | independent evidence |
|---|---|---|---|---|
| san-francisco-ca | Koi Palace | 37.66611, -122.46667 (high) | **corroborated** | OSM POI "Koi Palace" **6 m** — https://www.openstreetmap.org/node/1573655496 |
| san-francisco-ca | Wild Side West | 37.73919, -122.41714 (high) | **corroborated** | OSM POI "Wild Side West" **18 m** — https://www.openstreetmap.org/node/3214153061 · US Census "424 CORTLAND AVE" **15 m** (interpolated) |
| orlando-fl | ABC Commissary | 28.35608, -81.56024 (high) | **corroborated** | OSM POI "ABC Commissary" **37 m** — https://www.openstreetmap.org/way/294899619 (a building way; its centre point is within the 40 m bar) |
| san-francisco-ca | Hotel Utah Saloon | 37.78001, -122.39796 (high) | **moved** | OSM POI "Hotel Utah Saloon" at **37.77938, -122.39811**, **71 m** away — https://www.openstreetmap.org/node/10245940482 |

**Suggested actions (the reviewer decides; nothing here touched the registry):**

1. **Koi Palace, Wild Side West, ABC Commissary:** keep the pins.
   - Add the independent source to each entry's `source`/`note`: the OSM URL above, plus Census for Wild Side West.
   - Confidence stays high.
2. **Hotel Utah Saloon:** the Wikidata point sits about 71 m north of an OSM place object of the same name.
   - Check which one is on the building at **500 4th St** (4th & Bryant) before choosing.
   - If OSM is right, replace the pin with the OSM node, citing its URL; otherwise keep the pin and note the disagreement.
   - Until then, consider grading it med.

_Contains information from OpenStreetMap, © OpenStreetMap contributors, available under the Open Database Licence (ODbL) — https://www.openstreetmap.org/copyright_
