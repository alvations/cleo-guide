# New York — sourcing audit (sources-of-truth)

_Started 2026-10-17. This audit covers the QC finding that "Yelp is shown as a recommender". The rule is CLAUDE.md "Yelp/TripAdvisor are never the recommender": the ≥2-credible gate counts them as 0._

## 2026-10-17 — Yelp/TripAdvisor-only records (9) and one duplicate

`node tools/research.js --sourcecheck new-york-ny` already counts YELP/TRIPADVISOR as 0 and FAILs. **But `tools/build-newyork.py` never applied the gate**, so 0-credible records reached the live page.

**Fix.** The build now has **GATE 0**: a record needs at least one credible recommender, or it is dropped and logged.

Source upgrades are in `_source_overlay.json`, applied by `consolidate.py`. Every URL was found by sequential WebSearch on 2026-10-17.

| place | was | now | evidence | kept? |
|---|---|---|---|---|
| Hainan Chicken House | YELP | + INFATUATION, WIKIPEDIA | The Infatuation review. The Wikipedia article cites a NYT two-star review (Pete Wells, 11 Jul 2023) and NYT's "12 best new restaurants of 2023". | yes; 2 credible |
| Ralph's Famous Italian Ices | TRIPADVISOR | + NYCGO | NYC Tourism listing: the Port Richmond Ave stand is "the original Ralph's" (1928 / 1949). | yes; 1 credible |
| Awang Kitchen | TRIPADVISOR | + GAYOT | Gayot review (Indonesian, Queens Blvd). | yes; 1 credible |
| Kinokuniya Cafe | TRIPADVISOR | + UNTAPPED | Untapped Cities, best specialty bookstores (the in-store café). | yes; 1 credible |
| Wah Fung No 1 | YELP, t1 | **merged** into "Wah Fung No. 1 Fast Food" | Same address, 79 Chrystie St. The canonical record keeps INFATUATION as its source, with Yelp only as a measurement. | merged; tier t3 per the merit bar, since a t1 can't rest on Yelp |
| Gong Cha (W 38th St) | YELP | — | No Eater, Time Out, Infatuation or creator coverage found. A global chain; it does not meet the merit bar. | **held by GATE 0** |
| Yi Fang Taiwan Fruit Tea | YELP | — | Only listings and review aggregators found. | **held by GATE 0** |
| Meet Fresh (Flushing) | YELP | — | No NYC editorial coverage found; chain write-ups are from other cities. | **held by GATE 0** |
| Cha Cha Matcha (Lafayette) | YELP | — | Only ordering and listing pages and a lifestyle directory found. | **held by GATE 0** |

### Open decision for the orchestrator or owner

About **311 NYC dataset places carry one editorial source** (`--sourcecheck`, after this pass). The full ≥2-credible gate that Silicon Valley enforces in `build-siliconvalley.py` would drop them all from the live page. GATE 0 deliberately does not do that. Enforcing ≥2 for NYC is an editorial call.
