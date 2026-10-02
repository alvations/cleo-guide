# Kyoto — AUDIT (append-only, one section per stage/wave)

## 2026-10-02 — scaffold
- Areas (9), Japan taxonomy (`tools/japan_consolidate.py`), wrappers, registry keys. No places yet.

## 2026-10-02 — W1 (HGS) — discovery + fact-check + geocode, PARTIAL (halted by the search budget)
**Sources by channel:** editorial/travel sites: japan-guide.com (8 place pages), Kyoto City Official Travel Guide
kyoto.travel (area + destination pages), Culture Trip; institutional: MICHELIN Guide Kyoto Osaka 2025/2026 (Bib pages
+ ceremony articles); local: Leaf Kyoto; reference: Wikipedia (coordinates + notability). Creators: **0 this wave**.
The §2a creator queries had not run yet when the budget ran out.
**Kept (12):** Kiyomizu-dera, Higashiyama District, Yasaka Shrine, Maruyama Park, Gion & Hanamikoji, Kōdai-ji, Chion-in,
Kennin-ji, Shōren-in, Hōkan-ji (Yasaka Pagoda) [JAPANGUIDE/KYOTOTOURISM/WIKIPEDIA, ≥2 each]; Gion Yorozuya (lone Michelin
Bib, onion udon with Kujō negi); Honke Daiichi-Asahi Takabashi (Leaf Kyoto + Culture Trip; est. 1947).
**Held (single source / incomplete):** see `_PENDING_LEADS.json` — Rokuharamitsu-ji, Sanjūsangen-dō, Tōfuku-ji, Kyoto
National Museum, Shōgunzuka, Sennyū-ji, Rokudō Chinnō-ji, Heian Jingū; Michelin Bib ramen (Touhichi, Rennosuke, Kombu to
Men Kiichi, Fujitora, Muginoyoake, UZU) lack a sourced area/address; Gion Kajisho/Gion Nishikawa lack a sourced dish.
**Measured & dropped:** none. Rejected as sources: cemeterytravel.com, sygic/tripomatic, latitude.to and airbnb pages
(aggregators); gigazine (a news blog, used for status context only).
**Geocode:** Kōdai-ji high (Wikipedia 35.00076,135.78111); Yasaka Pagoda high (Wikipedia 34.99855,135.77925); Yasaka Shrine
med (museum-digital 35.00365,135.77853, re-verify). Kiyomizu-dera, Gion Yorozuya and Daiichi-Asahi are UNVERIFIED: Google
surfaced only a cid link, no `!3d!4d`. Restaurant place-pins do not surface via WebSearch, as in the other cities.
**Correction made:** street numbers first written from memory were replaced with sourced ward/district addresses (rule 4a).
**Closures:** none found. **Blocker:** the session WebSearch budget (200/200, shared across all agents) was exhausted after
about 14 Kyoto searches. Nothing after this point was fabricated, and there is no build or go-live.
