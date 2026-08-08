# v2 — the rank-driven itinerary

The same native routed map as v1, but the stops are **selected by the guide's own ranking**
rather than hand-picked. Every one of the 34 stops is a `t: 1` **must see** or **must eat**.

| File | What it is |
|---|---|
| `native-map-payload.json` | Replay-ready payload for `places_map_display_v0` |
| `ranked-itinerary.kml` | The same four days for Google My Maps |
| `SELECTION-METHOD.md` | Exactly how the stops were chosen and ordered |

## How it differs from v1

| | v1 shortlist | v2 ranked |
|---|---|---|
| Selection | editorial judgement, 19 stops | `t === 1` filter on 183 records, 34 stops |
| Ordering within a day | geographic | **source count, then re-sequenced by opening hours** |
| Food | none | 7 must-eat stops woven in as meals |
| Days | 3 | 4 (Thu–Sun) |
| Reproducible | no | yes — rerun the query and you get the same list |

## The days, and why each is that weekday

Nothing here is a preference. Each day is pinned by a constraint:

| Day | Area | Forced by |
|---|---|---|
| **Thursday** | Suburbs & Cuyahoga Valley | Holden Arboretum and Tita Flora's both close Mondays |
| **Friday** | University Circle & East | Dittrick opens Fri/Sat only; art museum runs to 9pm Fridays |
| **Saturday** | Downtown & The Flats | Chess collection closed Sundays; Terminal Tower deck weekends only |
| **Sunday** | West Side & Tremont | West Side Market 10–4; Buckland 12–4 |

## Three must-sees that do not fit, and why

Stating these is the point. A plan that silently drops stops is worse than one that admits it.

1. **Slyman's** — weekdays only, closes 2:30pm. The downtown day must be a Saturday for the
   Terminal Tower deck, so these two can never share a trip. Needs a fifth day.
2. **The Sanctuary Museum** — Wednesdays and Saturdays only, and Saturday is downtown.
3. **78th Street Studios** and **St. Theodosius** — both effectively closed Sunday, when the
   west side runs. St. Theodosius opens Sunday mornings only, during the market.

Add a Wednesday and a weekday to absorb all four.

## Rebuild it

See [SELECTION-METHOD.md](SELECTION-METHOD.md) for the query and the ordering rules, and
[../v1-shortlist/RECREATE-NATIVE-MAP.md](../v1-shortlist/RECREATE-NATIVE-MAP.md) for the two rules
that decide whether the route actually draws.
