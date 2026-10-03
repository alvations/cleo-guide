# W4G5 notes — Kerama/Kume + Miyako geocoding (2026-10-02)

Searches: 12/12 (cap reached). Pinned 3 (all `med`, NAVITIME Travel aggregator points that agree with the sourced address).

## Technique that worked
Open `WebSearch` (extended) **with `allowed_domains: ["travel.navitime.com"]`** and the query `<日本語名> 緯度 経度`.
This makes the result attributable: the coordinate is printed on one NAVITIME spot page (spot id `02301-…`). Without a domain
restriction, the search returns coordinates but does not say which page printed them, so they can't be used.
The NAVITIME spot page has to exist. Guide/article pages don't print coordinates.

## Pinned
- Eef Beach (イーフビーチ): 26.331728,126.808881. Source: navitime spot 02301-1300687 (謝名堂)
- Aragusuku Beach (新城海岸): 24.760242,125.424639. Source: navitime spot 02301-pn0002195 (城辺字新城)
- 17END (下地島空港17ENDビーチ): 24.837203,125.138075. Source: navitime spot 02301-pn0001052 (伊良部佐和田)

## Unresolved (not appended, per task: append only resolved)
- Aharen Beach: unrestricted searches returned 26.170067,127.34594, but no page could be identified as printing it
  (candidates: iko-yo 26971, rurubu 80043342, mapple 501175, 4travel 10031880). NAVITIME has no spot page for it.
  Next: retry with allowed_domains set to each of those candidates.
- Takatsukiyama (高月山): the jawiki 高月山 article is about a different mountain. Only the Zamami island centroid surfaced, and it was rejected.
- Yoshino Beach (吉野海岸): the jawiki article exists, but no coordinates surfaced. NAVITIME has no spot page for it. Yahoo map place _GgD6C1Oyvc is a lead.
- Nakanoshima Beach (中の島ビーチ): NAVITIME has only a guide article (TBNarticle31783) for it, with no coordinates.
- Taragawa (多良川): NAVITIME has a guide article (TBNarticle10198) that confirms the address 城辺字砂川85, but it has no coordinates.
- Not attempted (cap): Shinri-hama, Ama Beach, Aharen-enchi, Yukishio Museum, Kumesen, and all restaurants.
- Stripes `site:` search for Miyako GPS: none (Stripes has no N24 GPS coverage, same as for Ishigaki).

## Status
No closures seen.
