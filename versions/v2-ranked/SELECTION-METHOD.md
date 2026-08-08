# How the ranked itinerary was selected

Fully reproducible. Rerun the query against `index.html` and you get the same 34 stops.

---

## Step 1 — Filter to must-see

```js
const P = /* sights array from index.html */;
const F = /* food array */;
const mustSee = P.filter(p => p.t === 1);   // 32
const mustEat = F.filter(p => p.t === 1);   // 14
```

## Step 2 — Order within each region by source count

Tier is editorial. Source count is objective, so it breaks ties:

```js
const cites = (p, table) => new Set(p.s.map(x => table[x[0]].k)).size;
const score = (p, t) => (4 - p.t) * 100 + cites(p, t) * 10 + (p.t === 1 ? 5 : 0);

AREAS.forEach(a => {
  const ranked = P.filter(p => p.a === a.id && p.t === 1)
                  .sort((x, y) => score(y, S) - score(x, S));
});
```

Output, highest first:

| Region | Must-see | Top of the list |
|---|---|---|
| Downtown & The Flats | 10 | Chess Collection, The Arcade, Terminal Tower, GE Chandelier (all 2 sources) |
| University Circle & East | 9 | **Haserot Angel (3 sources — highest in the guide)** |
| West Side & Tremont | 8 | **West Side Market (3 sources)** |
| Suburbs & Metroparks | 5 | Brandywine Falls, Ledges Overlook (2 each) |

## Step 3 — Re-sequence by opening hours

**This is where a ranked list becomes an itinerary, and it is the step people skip.**

Source count tells you what matters. It tells you nothing about whether the door is open. Four
rules, applied in order:

1. **Hard-constrained stops set the weekday of the whole day.** The Dittrick opens Friday and
   Saturday only, so an east-side day is Friday or Saturday and everything else bends around it.
2. **Early closers move earlier regardless of rank.** Wade Memorial Chapel and Rockefeller
   Greenhouse both shut at 4pm; they cannot be evening stops however highly they rank.
3. **Late openers become the evening anchor.** The GE Chandelier is only worth seeing after dark,
   so it closes Saturday. Solstice Steps closes Sunday for the same reason.
4. **Meals go where the geography already puts you.** Superior Phở sits between the Dittrick and
   the cemetery; Presti's is in Little Italy beside the museums. Never detour for food that could
   have been on the line.

## Step 4 — Detect the conflicts and report them

Run every selected stop against every candidate weekday and look for pairs that cannot coexist:

```
Slyman's        = Mon–Fri, closes 14:30
Terminal Tower  = Sat–Sun only
                → cannot share a day. Downtown must be a weekend for the deck,
                  so Slyman's is unreachable on a Thu–Sun trip.
```

Three such conflicts were found and are stated in the README rather than quietly dropped. **A
plan that silently omits stops is worse than one that admits what it cannot fit.**

## Step 5 — Write the notes

Each `notes` field carries the thing that would otherwise ruin the visit, plus the rank signal so
a reader can see why the stop earned its place:

> *"Must-see · HIGHEST-SOURCED PLACE IN THE GUIDE, 3 sources. Section 9, Lot 14. Easy to miss —
> just off the road under trees. Nearest landmark is the Hanna Mausoleum."*

Never describe the place. The pin already carries the name, photo, rating and hours.

## Why not simply take the top N overall

Because ranking globally clusters everything downtown. Tiers are graded **within each region**
precisely so that a per-region filter still yields a workable day anywhere in the city. Taking
the top 34 by raw score would have produced three downtown days and no west side at all.
