# Recognition and local favourites: the data (W9-1, W9-9)

Platform owns the data, built by `tools/beta/lib/recognition.js` and tested by `tools/beta/test-recognition.js` (in `npm test`). FE-A builds the card, detail, preview and tray UI; FE-B builds the Insights chart. **Everything is derived from source keys only**, never from a place's name, dish or prose.

## Where it lives

In `beta/data/places/<page>.json` (and on the build model, `row.recog` and `rec.rec` / `rec.lf`, for templates):

```jsonc
"sourceIndex": [ {
  "id": "michelin", "name": "Michelin", …,              // as before (lib/sources.js)
  "type": "editorial",                                  // the registry's raw type string (data/sources.json), or null
  "group": "press",                                     // official | press | local | creator | institution | encyclopaedia | other | null
  "typedFrom": "city",                                  // "city" | "registry" | "registry-host" | "registry-domain" | "guide-key" | "host-pattern" | "key" (award mark) | null (untyped) — see "Typing" below
  "reg": "MICHELIN (tokyo)",                            // the registry entry it was typed from
  "award": true,                                        // institutional-award source (award / michelin / james_beard type, or the Michelin / James Beard key mark)
  "video": false                                        // vetted creator whose registry entry is a video channel
} ],
"places": [ {
  "id": "…", "src": ["wikipedia", "go-tokyo", "michelin"], …,
  "rec": { "award": ["michelin"], "video": ["…"], "cited": 3 },   // only the badges that apply; absent when none
  "lf": 1                                                         // local favourite (W9-9); absent otherwise
} ],
"recognition": {
  "regCities": ["tokyo"],                               // registry cities the page is typed from ([] = none: registry-wide matches only)
  "typed": { "sources": 28, "of": 33 },                 // publishers typed / all (the guide's own excluded)
  "untyped": [{ "k": "…", "name": "…", "hosts": ["…"], "places": 3 }],   // the stated gap on this page (all pages: data/recognition-untyped.json)
  "counts": { "award": 147, "video": 0, "cited": 104 }, // places with each badge
  "byArea": { "<areaId>": { "places": 49, "award": 12, "video": 0, "cited": 9, "any": 18 } },   // for "Recognised places by area"
  "localFavourites": { "rule": "Open places recommended only by …", "n": 0, "gap": "Fewer than 5 places here qualify …" }
}
```

## Typing (W9-9 acc1, 2026-10-16)

A publisher is typed by the **first** route that answers; `typedFrom` names it and the test re-proves it:

1. `city`: the page's own registry city has the publisher key, or one of its entries' registry keys.
2. `registry`: the same keys registry-wide, when every matching entry agrees on the raw type or on the group (`reg` = the entry cited).
3. `registry-host` / `registry-domain`: a registry entry whose URL host (or registrable domain) is one of the publisher's hosts (same agreement rule).
4. `guide-key`: every entry is the guide's own `OFFICIAL…` key ("Official site of the place") → `official`.
5. `host-pattern`: an explicit host rule (`HOST_RULES` in lib/recognition.js): encyclopaedia, government, tourism-board or UNESCO host.

Nothing is typed from a name or a dish. The guide's own request entries (`REQ`, "Asked for by name") are never typed by host.
Everything else stays **untyped** and is listed in `beta/data/recognition-untyped.json` (the stated gap): 2,183 of 2,552 page
publishers are typed, 369 listed (was 1,814 typed). Typing the rest needs registry entries in `data/sources.json` (owner).

## Badges (W9-1)

| Badge | When | Links to |
|---|---|---|
| **Award** | It cites a source whose registry type is an award (`award`, `michelin_guide`, `james_beard`, …), or whose publisher key is Michelin / James Beard (lib/sources.js authority mark). | each id in `rec.award` → `#src=<id>` |
| **Video** | It cites a vetted creator whose registry entry has a `youtube` field or a YouTube/TikTok/Vimeo url. | each id in `rec.video` |
| **Cited by n** | It has ≥ 3 distinct publishers (the guide's "Added by the guide" never counts). | the source list (`#src=`) |

Rules for the UI:
- A closed place keeps its data. **Show its badge only inside the closed treatment**, never as a live recommendation (acceptance 3; FE-A).
- A "Recognised" filter must keep every place reachable via "Show all" (G6 is unchanged).

**Stated gap, video:** today **0** places qualify. No registry creator entry carries a video url, so the badge has no source to stand on. It appears as soon as `data/sources.json` records a creator's channel (an owner edit).

## Local favourites (W9-9)

- **Rule** (printed at the top of the lens): *"Open places recommended only by local press, local writers or vetted creators — none by an official or tourism source, and every source typed in our registry."*
- **A place qualifies** (`lf`) only if it is open and **every** one of its sources is typed `local` or `creator`. One untyped or official source disqualifies it.
- **A page with fewer than 5 qualifying places** gets `localFavourites.gap`, a sentence to show instead of a padded lens.
- **Coverage today:** 4 guides show the lens (135 places). The other 80 state the gap.
  - Why so few: 1,228 registry sources are typed only "editorial", which can't be read as *local*.
  - 735 of 2,512 publishers have no registry entry at all (whole guides such as New York and the Singapore towns aren't in the registry's `cities` block).
  - Widening it means typing those sources in `data/sources.json`, which needs the owner (live data). We don't guess.

## Groups

`GROUP_RULES` in recognition.js is an ordered list of patterns over the **registry's type string**; the first match wins. The test proves that all 386 distinct registry type strings map to one of the groups. Five map to `other`: `aggregator_review`, `directory`, `primary source`, `events`, `venue reviews`. To review the mapping:

    node -e 'const R=require("./tools/beta/lib/recognition");const r=R.registry(".");for(const t of r.types)console.log(R.groupOf(t),"\t",t)' | sort
