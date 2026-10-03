# W9D4 notes (2026-10-03): Nanbu + Kerama/Kume food & drink
I used 24 of the 24-call WebSearch cap. There was no limit error.

## Already in the dataset (dup checks, no search spent)
Hamabe no Chaya, Café Kurukuma, Ganso Nakamoto Tempura, Itoman Osakana Center, Kumesen, Ōshiro Tempura, Imaiyu, Washima, Wayama and Boku no Mise are all in `okinawa.dataset.json`. No collisions with the W9 siblings (W9A/D1/D2/D3/D5).

## KEPT 5 (all food), in FOOD_OKINAWA_W9D4.json and geo/_geoout_okinawa_W9D4.json
- **Taco Rice Café Kijimunā, Umikaji Terrace** (NANBU, t2). It created omu-taco in 2003 and has won gourmet-festival awards. Sources: RURUBU 17893 and OKINAWATRAVELER 0118_sp. Pin is **low**: listing point 26.176651,127.640275, about 95 m from the complex point.
- **Oyaji no Maguro, Umikaji Terrace** (NANBU, t3). Line-caught tuna bowls. Sources: RURUBU 17893 and RYUKYUSHIMPO gourmet 988499 (title confirmed). Pin is **low**: listing point.
- **Hawaiian Pancake Cafe KOA, Itoman** (NANBU, t3). Loco moco and pancakes. Sources: RS うちなー味まーい 144 (entry-4535259) and Stripes.
  - Pin is **med**: Stripes printed GPS N26.117810 E127.662568.
  - CAVEAT: I inferred that the Stripes article is "Southern Okinawa offers lovely landscapes…" because it was the top hit in both searches; I did not pinpoint it. The street number was not captured. Re-check both before publishing.
- **Restaurant Namiji, Kume** (KRM, t2). Kuruma-ebi prawns, mozuku and ikasumi-jiru. Sources: OKINAWATIMES 1832345 and KUMEJIMAKANKO eat/2084. Pin is **low**: two listing points agree to within about 4 m.
- **Māsā no Mise, Tokashiki** (KRM, t2). Tuna bowl made with fish caught off Tokashiki; 70 Aharen. Sources: OCVB 600010543 and OKINAWATRAVELER 0066_sp (tw).
  - CAVEAT: I inferred that OT 0066_sp names Māsā no Mise from a result set that included it; this was a W8D4 suspicion, and the attribution was not pinpointed. Re-check before publishing.
  - Pin is **UNVERIFIED**: no coordinate surfaced.

Totals:
- Kept 5: NANBU 3 against an aim of 9–11, and KRM 2 against an aim of 3–4. Both are short.
- Pinned 4: 1 med, 3 low. UNVERIFIED 1. Closures 0.
- Every place has status open, with a source.

## Held (single source)
- Nanbu:
  - Kōganeya, Haebaru (RS 5061950; rurubu 22464 surfaced but did not confirm).
  - Okinawa Soba Cafe Tenten, Yaese (OTV 58111 and OTV ranking 92813, same outlet).
  - Uejō-soba, Yaese (OTV 79252).
  - Honke Kame Soba, Yaese (aggregators and furusato only).
  - Iibaru-ya, Itoman, 27+ yrs, 照屋543 (RS 5172686).
  - Cafe The Palm, Nanjō (Stripes GPS N26.146717 E127.792372 only; the JA search missed).
  - From OTV only: Itoman Uminchu Shokudō (OTV 376), Shokujidokoro Okāsan (OTV 30715), Bē-bē-bē Shokudō goat (OTV 43852).
  - Furumiya Soba (no 2nd source).
- KRM:
  - Kihachi, Kume, 大田543 (rurubu 80043426 only).
  - Restaurant Ryū, Kume, 仲泊1076-2 (kanko-kumejima 2122; jalan; Mapple 47014012 unconfirmed).
  - YUNAMI FACTORY, Kume (kuruma-ebi burger, 兼城1146-1). The only lead is an unconfirmed source in the kume prawn search.

## Creators
I ran 1 creator query (#18, YouTube/IG/TikTok). None kept; 3 rejected because their following could not be verified or the video was about the wrong branch (see CREATORS_OKINAWA_W9D4.json). There are no new outlets, so I wrote no SOURCES_OKINAWA_W9D4.json.

## Channel mix
- Apple Maps (allowed_domains) was tried once (#8) and missed: Japanese-name results came back for other prefectures, with no coordinate.
- Extended `緯度 経度` searches: 3 tries, 3 hits (all low).
- Stripes GPS: 1 (med).
- NAVITIME/OCVB domain search: 1 try, address only.

## Searches
1. こがね家 Haebaru: RS only
2. Yaese soba (domain filter): Tenten, Uejō, Yagiya (dup)
3. 上江門そば: miss
4. 本家亀そば: aggregators only
5. Stripes Itoman/Nanjō: Palm and KOA GPS
6. Cafe The Palm (JA): miss
7. Umikaji gourmet (domain filter): Kijimunā, Oyaji no Maguro
8. Kijimunā Apple Maps: miss
9. Kijimunā confirm (JA): rurubu 10492
10. Kijimunā EN: OT 0118_sp, so KEPT
11. Kijimunā pin (extended): low
12. 喜八 Kume: rurubu only
13. Kume kuruma-ebi (domain filter): Namiji, Ryū, YUNAMI
14. Namiji pin (extended): low
15. レストラン竜: no 2nd source
16. うちなー味まーい Itoman: KOA RS, Iibaru-ya
17. KOA Stripes: GPS confirmed
18. CREATOR, Umikaji YouTube: rejected
19. いーばる家: RS only
20. Tokashiki shokudō: Māsā (OT 0066_sp)
21. Māsā NAVITIME/OCVB: address only
22. 糸満海人食堂: miss
23. 古宮そば: miss
24. 親父のまぐろ pin (extended): low, plus RS title confirmed

Note: of the 24 searches, 1 was a creator query, and 14 were in Japanese (≥1/3).

## Orchestrator fact-check (2026-10-03)
- KOA: Stripes "Southern Okinawa offers lovely landscapes…" confirmed by a site-limited search to name "Hawaiian Café Dining KOA" on the Itoman beach (pancakes ¥1,290, loco moco ¥1,590) → kept.
- Māsā no Mise: orchestrator search `まーさーの店 渡嘉敷 阿波連 マグロ丼` returned only aggregators (4travel, retty, hamoni) — no menu evidence of a tuna bowl (maze soba / taco rice / island-fish teishoku instead) and no confirmation that OT 0066_sp names it → record + geo record REMOVED; held (OCVB 600010543 single source).
