# W6G2 notes — main-island restaurant geocode + status (todo 51), 2026-10-03

Searches: 28/28 (cap used, no limit error). WebSearch extended, ONE place per query: `<日本語名> <JA street address> 緯度 経度`.
Output: geo/_geoout_okinawa_W6G2.json (25 records). Hit rate 19/26 with a full street address; misses = distilleries/cellars + 2 restaurants.

## Pinned — med (2)
- Michi-no-Eki Yuiyui Kunigami 26.73197,128.16933 (ja.wikipedia / OGB DMS, seconds precision)
- Uema Kashiten (Suppaiman) 26.153056,127.654528 (ja.wikipedia HQ infobox at the same 3-64 Toyosaki address; listing agrees ~15 m)

## Pinned — low (17, aggregator listing coords, each checked against the sourced street address)
CHUBU: Kingetsu Yomitan (201 Kina), Steak Shiki Sonoda (3-1-25), Nemu Isa (4-2-14 Isa), Misato Soba (1-23-12 Higashi),
Komehachi (5-29-6 Awase), Tacoloco (Mihama 9-2 American Village B 2F).
HOKBU: Arayama/Shinzan Soba (1-9-2 Daitō), Kyoda (17-1), Onna no Eki (1656-9 Nakadomari), Manmi (251 Isagawa, Nago),
Emi no Mise (61 Ōganeku), Seaside Drive-In (885 Nakadomari), Okashi Goten Onna (100 Seragaki).
NANBU: Yagiya (1172 Ōgan), Makabe Chinā (223 Makabe), Masahiro Gallery (5-8-7 Nishizaki), Café Kurukuma (1190 Chinen; 4 listings agree,
replaces the W5-rejected TripAdvisor point).

## UNVERIFIED (address confirmed, no coord surfaced) (6)
Yamakawa Shuzō (58 Namizato), Ryū no Kura (245 Kin), KOURI SHRIMP (314 Kouri), Chuko-gura (556-2 Iraha), Kunnatu (460-2 Shikenbaru),
Kamimura Kūsu-gura (570 Ishikawa-Kadekaru; Ishikawa centroid rejected; ja.wikipedia article has no coords).

## Corrections for the orchestrator
- Manmi: address is **Nago** 伊差川251 (Isagawa), not Motobu — card `n` still says "Motobu"; fix the name/area text at merge.
- 新山そば is read **Shinzan** Soba (card says "Arayama").
- Seaside Drive-In and Okashi Goten street numbers (885 Nakadomari, 100 Seragaki) came from the listings, not from the recommender sources.

## Held (searched, not pinned)
- Kaizoku Kōbō: listings only gave the Okinawa Kodomo no Kuni park coordinate (26.327833,127.803417, 5-7-1 Goya) — a facility centroid,
  not the restaurant point → no record written; candidate for a park-map/med decision.

## Not reached (no record written, 26)
CHUBU: Kaizoku Kōbō (see above). HOKBU: Shima-jikan Onna, Sachichan Soba, Maruoki Shōten (need JA street addresses first).
NANBU: Nanbu Soba, Tomigusuku Taco Rice, Rakusui, Yabusachi, Toyosaki michi-no-eki. NAHA (all 16): Ayagu (closed), Ichigin (closed),
Yanbaru Shokudō, Mikado, Buku-Buku, potohoto, Misaki (388-6 Asato), Sangoza Kitchen, Ryūgū (3-1-17 Makishi), Naha-tei, C&C Breakfast,
Utahime, Pork Tamago Onigiri (2-8-35 Matsuo), Fujiya Tomari (2-10-9 Tomari), Yatai-mura, Arakaki Kashiten, Nuchigafū.

## Closures: none found; every record has a current 2024-26 listing / official page as statusSource.
