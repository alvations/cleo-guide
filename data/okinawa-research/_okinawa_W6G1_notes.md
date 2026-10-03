# W6G1 notes: geocoder, Kerama/Kume first (2026-10-03)

Searches: 22/22 (cap used up, no limit error). 16 geo records in `geo/_geoout_okinawa_W6G1.json`.
- Pinned: 2 high, 1 med, 4 low.
- UNVERIFIED (searched): 9.
- Not reached (no record written): 12.

## Pinned
- high: Shimashi Ōzato Castle Ruins at 26.1866,127.7601417 (jawiki 島添大里城 infobox).
- high: Takanazaki & Japan's Southernmost Point Monument at 24.049806,123.805056 (jawiki 高那崎).
- med: Ama Beach, Zamami at 26.226806,127.292028. This is the Stripes GPS 26°13'36.5"N 127°17'31.3"E, found with the search restricted to okinawa.stripes.com. It sits west of Zamami village, which fits Ama and not Furuzamami.
- low: Aharen Beach at 26.170067,127.34594. The same unattributed listing value came back again; W4G5 got it too. It needs a re-verify with a place pin.
- low: Yonejima Shuzō at 26.34575,126.751222. The result came with the official access-map page, but no single page could be named as printing it.
- low: Yan-kō at 26.347458,126.746577 (listing coordinate that matches the address 仲泊509).
- low: Sukeroku at 26.338002,126.764255 (tabelog listing that matches the address 嘉手苅423-1).

KRM now has 8 + 5 new pins (1 med + 4 low) = 13. If the gate counts low pins, that clears the ≥10 bar. If it only counts high/med pins, KRM has 9 and is 1 short.

## UNVERIFIED (searched, with what was tried)
Kumesen distillery (only the island centroid came back, rejected), Ryūtan (the jawiki article came back without coordinates), Tomari International Cemetery (no wiki article), Shinri-hama (address is 大原113), Hiyajō Banta, Takatsukiyama, Aharen-enchi, Marine Box (now trades as "marine Box とかしき本店"), Todoroki Falls.

## Not reached (cap)
Mīfugā, Araha, Azama Sun Sun, Mibaru, Nakanoshima, Yoshino, Sugar Road, Okitsura Gushikawa, Jigen-in, Kinjō Tetsuo Archive, Midori no Yakata Sēfā, Nishihara Kira Kira Beach.

## Lessons
- Navitime-restricted searches return nothing for Kume/Kerama spots. NAVITIME has no spot pages for most of them.
- The query `<名> <full address> 緯度 経度` worked for 3 of 4 Kume restaurants and distilleries.
- jawiki works only when the article has an infobox: 2 of 5 had one.
- The Stripes `allowed_domains` search can return printed GPS for Kerama beaches. Try it next for Furuzamami-area spots and Tokashiki.

## Status
No closures seen. Sukeroku's "open" status rests only on an active tabelog listing, which is weak evidence. Recheck it.
