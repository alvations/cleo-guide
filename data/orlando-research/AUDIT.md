# Orlando & Central Florida — AUDIT (append-only ledger)

## 2026-10-02 · Stage 0 — Scope & taxonomy
- Region: Orlando metro + Walt Disney World (per park) + Universal Orlando (per park incl. Epic Universe,
  opened May 2025) + Kissimmee/Celebration + West Orange + Seminole/Lake (Sanford, Mount Dora, springs) +
  East Orlando/UCF + the Space Coast (KSC, Cocoa Beach). 18 areas (see consolidate.py) — theme parks split
  per park so each park's tiers are graded within itself and its filter is useful; city neighbourhoods
  split along how visitors actually move (Downtown/Thornton Park vs the Mills 50 Vietnamese corridor vs
  Winter Park vs I-Drive/Restaurant Row).
- Cuisine taxonomy: theme-park signature eats are their own layer (`PARK`); Vietnamese (Mills 50),
  Puerto Rican and Cuban are first-class because they are the city-unique canon; `FINE` holds the
  Michelin-starred tasting counters; `FLA` holds Florida-specific flavors (gator, citrus, key lime).
- Collections: theme-park rides/attractions and shows separate from Space & Science, springs/nature and
  wildlife — the four things a Central-Florida visitor filters for.
