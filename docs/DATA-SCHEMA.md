# Data schema

All data lives in plain JavaScript literals inside `index.html`. There is no database and no
build step; edit the arrays and reload.

---

## Sight record — `const P = [ … ]`

```js
{
  t: 1,                                   // tier: 1 must see, 2 worth the detour, 3 deep cut
  a: "DT",                                // area id, must exist in AREAS
  n: "Haserot Angel, Lake View Cemetery", // display name, must be unique across P and F
  ad: "12316 Euclid Ave · Section 9, Lot 14",
  la: 41.513022,                          // latitude, verified via a places API
  ln: -81.590375,                         // longitude
  w: "Formally \"The Angel of Death Victorious.\" …",  // 40+ chars, may contain inline HTML
  k: "Easy to miss — just off the road under trees.",  // optional: know before you go
  warn: 1,                                // optional: renders the note in red for hard constraints
  s: [["AO_ANGEL",""],["N5","#5"],["TSG","#14"]]      // [sourceKey, itemNumber]
}
```

**Field notes**

- `t` drives the badge, the rank filter, the sort, and marker size and opacity.
- `s` is an array of pairs. The second element is the source's own item number, shown on the tag
  so a reader can find it in the original. Empty string where the source did not number.
  Multiple sources on one record is the norm and feeds the "most-sourced" sort.
- `warn: 1` is for genuine planning hazards — two-day-a-week opening, tour-only access, permanent
  closure — not for mild advice.
- `w` and `k` accept `<strong>`, `<em>`, `<br>`. Escape quotes.

## Food record — `const F = [ … ]`

Identical, plus one required field:

```js
{
  t: 1, a: "UC",
  cz: ["VN"],                             // one or more cuisine ids from CUISINES
  n: "Superior Phở",
  …
  s: [["INFAT",""],["FRESH",""],["CLEMAG",""]]
}
```

`cz` may hold several ids: a Taiwanese bakery is `["DES","CN"]`; a Bourdain restaurant is
`["TV","EU"]`. Food records use the **`FS`** source table, not `S`.

## Source tables — `const S` and `const FS`

```js
S = {
  N5: {
    k: "NEWS 5",                                  // tag label and filter value
    t: "100 hidden gems of Cleveland",            // title in the appendix
    u: "https://…",                               // empty string renders as plain text
    l: "News 5 Cleveland · Joe Donatelli & Drew Scofield"  // byline
  }
}
```

Several keys may share a `k`. All four Atlas Obscura keys use `k: "ATLAS OBSCURA"`, so one filter
chip catches them all while each record still links to its own page.

## Areas — `const AREAS`

```js
{ id: "DT", n: "Downtown & The Flats", c: "var(--c-dt)" }
```

Every `id` needs a matching hex in `const AC = { DT: '#74AE99', … }` for marker colour.

## Cuisines — `const CUISINES`

```js
{ id: "VN", n: "Vietnamese" }
```

`TV` is a cross-cutting tag rather than a cuisine, used for places featured on food television.

## Derived at runtime

| Name | Meaning |
|---|---|
| `p.id` | `s0`, `s1`… for sights; `f0`, `f1`… for food. Assigned on load; used by trip and visited sets |
| `p.kind` | `"sight"` or `"food"` |
| `ALL` | `P.concat(F)` |
| `BYID` | id → record |
| `cites(p)` | count of **distinct** source labels, for the most-sourced sort |
| `score(p)` | `(4 - t) * 100 + cites * 10 + (t === 1 ? 5 : 0)`, drives the top-N presets |

## Persisted state

| Key | Contents |
|---|---|
| `cle_trip` | array of ids on the trip list |
| `cle_seen` | array of ids marked visited |
| `cle_gkey` | the reader's own Google Maps API key |

Every access is wrapped in `try/catch`; the guide works with storage disabled, it simply forgets
between visits. Rename these keys per city if several guides share a domain — GitHub Pages serves
all repos from `USER.github.io`, so keys **will** collide otherwise.
