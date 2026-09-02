# Singapore & Southeast Asia — AUDIT (append-only, one section per stage)

Region = Singapore towns (opening on **Toa Payoh**) + the major cities of Southeast Asia. Built off the
Cleveland engine like every dataset city; the only visual departure is a **pastel light/dark theme** in
`tools/build-singapore.py`. Pipeline + gates are identical to the US cities (docs/PIPELINE.md).

## Stage 0 — scaffold (2026-08-26)
- `consolidate.py` — 10 areas (TPY Toa Payoh · SGC/SGE/SGWN Singapore clusters · MY/TH/VN/ID/PH/IC SEA
  countries), pastel marker palette (`AC`), a Southeast-Asian cuisine taxonomy (Hainanese chicken rice,
  laksa, wok noodles, bak kut teh, hawker/zi char, Malay, Indian/prata, Chinese/dim sum, seafood, Thai,
  Vietnamese, Indonesian, Peranakan, kopitiam, dessert, café, viral), collections (ICON/HERITAGE/TEMPLE/
  MKT/PARK/MUS/VIEW/ARCH/FAM/ODD/FREE), and a SEA source-label map. Outputs `sg_dataset.json`.
- `tools/build-singapore.py` — clone of the engine build with: the **pastel `:root` swap + a
  `@media (prefers-color-scheme:dark)` override** (both modes soft-pastel), a light-default basemap keyed to
  the viewer's colour scheme, a light-mode tile fix, the map **anchored on Toa Payoh** (labels still derived
  from pins; buildcheck only needs the centre inside pin bounds), pastel legend, SEA prose/appendix.
- Registered `singapore` in `tools/research.js` (PAGE_FOR + DATASET_FOR), `tools/geocode-status.py`
  (DATASETS), `tools/rebuild-city.py` (CITY). Index.html "building" card added.
- `_ELITE_SOLO` in the build adds `UNESCO` (World-Heritage sights) alongside Michelin/JamesBeard/NPS/Smithsonian.

## Stage 1 — sources & discovery (2026-08-26, in progress)
- Three discovery agents launched (write distinct files + `_note_<tag>.md`; no shared-file edits):
  Toa Payoh (`FOOD_TOAPAYOH`/`SIGHTS_TOAPAYOH`), the rest of Singapore (`FOOD_SINGAPORE`/`SIGHTS_SINGAPORE`),
  and SEA cities (`FOOD_SEA`/`SIGHTS_SEA`). Ranked SG/SEA source palette in `_AGENT_BRIEF.md`.
- _Fold each agent's `_note_*.md` summary in here after the run (sources used, counts, MEASURED & DROPPED,
  closures)._

## Stage 1 — sources & discovery (DONE 2026-08-26)
- **Toa Payoh:** 20 food + 7 sights; creators Ghib Ojisan (~354K), Dr Leslie Tay/ieatishootipost, Clara
  Chua/Exploding Belly (~112K). **Rest of Singapore (SGC/SGE/SGWN):** 60 food + 32 sights; Michelin
  stars/Bibs, ieatishootipost/Miss Tam Chiak/Seth Lui/Daniel Ang. **SEA cities (MY/TH/VN/ID/PH/IC):** 29
  food + 35 sights; **sources kept SEPARATE per city** — 11 `SOURCES_<city>.json` + 9 `CREATORS_<city>.json`,
  namespaced keys; vetted Mark Wiens (11.7M), Nex Carlos (5.2M), Erwan Heussaff (4.6M + James Beard), KL
  Foodie (~2M), Vietnam Coracle, Wander-Lush. **Total 183 candidates.** register-sources: 76 sources;
  merge-creators: 17 creators + 23 attachments. Yelp/TripAdvisor/Google = 0 throughout; SEO farms rejected.

## Stage 2 — geocode → build → gate (DONE 2026-08-26)
- 4 geocode waves (WebSearch: Wikipedia coords / Google `!3d!4d` / Apple `coordinate=` / OneMap): SGC 48/49,
  TPY+SGE 45/46, SGWN+MY+TH 44/48, VN/ID/PH/IC 26/40 → **163 pinned**, 20 UNVERIFIED held for the browser
  helper. Viewport-traps caught (Kok Kee, Dragon Playground, Babi Guling Ibu Oka). 4 closures flagged &
  kept (Eng Seng, Kim Keat Hokkien Mee, Hup Chong, Romdeng).
- `geo-merge.py singapore` → `rebuild-city.py singapore --build` → **LIVE @ 163 pins** (74 sights + 89 food).
  Gates: sourcecheck FAIL = 1 single-source place (GATE 1 drops it, page clean) · geocheck PASS (3
  block-level to re-verify) · statuscheck CONSISTENT · **buildcheck PASS** (centre 1.3343,103.8479 z13 =
  Toa Payoh, inside pin bounds). Pastel light/dark theme verified in the built HTML; index card relinked live.
- **Tool fixes made this build:** `merge-creators.py` now accepts both `creator`/`creatorKey` attach fields;
  `geo-merge.py` detects the `— CLOSED` marker anywhere in a name (not just as a suffix) to avoid double-marking.
- **NEXT (extension):** browser-helper the 20 UNVERIFIED restaurant pins → deeper per-town food expansion
  toward NYC-level density → re-run `rebuild-city.py singapore --build`.

## Stage 3 — HCMC Vietnamese-language expansion (DONE 2026-08-31)
Goal: HCMC toward NYC density, sourced from **Vietnamese-language** media + Vietnamese KOLs (per user
directive). Three parallel discovery waves, all issuing WebSearch queries IN VIETNAMESE; Foody/Riviu/
Google/TripAdvisor counted as **0** (rating aggregators), editorial articles only.
- **Street food / quán vỉa hè (+35):** FOOD_HCMC_VN_STREET.json. 11 districts. Decades-old institutions
  (Cháo Tiều 1942, Cơm Gà Đông Nguyên 1945, Phở 29 1948, Như Lan 1968, Xôi Tám Cẩu, Bánh Cuốn Hai Tần) +
  viral spots (Súp Cua Nhà Thờ Đức Bà, Hột Vịt Lộn Cô Vân, Lẩu Bò Giáo Toàn); strong Chợ Lớn/người Hoa
  (cz Vietnamese+Hoa). Sources: VnExpress/Ngôi Sao, Thanh Niên ("tiệm xưa quán cũ"), Người Lao Động, ZNews,
  Kênh14. Dropped: Bò Kho Gánh (dup of existing), single-source & unconfirmed-open leads.
- **Cà phê / drinks / dessert (+16):** FOOD_HCMC_VN_CAFE.json. Heritage cafés (Vợt Chú Thanh 2am, Trên Tầng
  Thượng), kem (Bạch Đằng 1983, Bố Già 1975), Chợ Lớn Hoa herbal-tea cluster (Vạn Tế Đường, Nước Sâm Bà
  Bình, Triệu Minh Hiệp), Givral, rooftop bars. Sources: VnExpress, Tuổi Trẻ, Người Đô Thị, ZNews, Kênh14,
  ELLE/Bazaar VN, Vietcetera. KOLs vetted: Khoai Lang Thang, Ninh TiTo. Single-credible leads logged for
  next pass (About Life, Saigon Coffee Roastery, Nomad, etc.).
- **Sights / culture / check-in (+34):** SIGHTS_HCMC_VN.json. Temples (Hoằng Pháp, Vạn Đức, Nam Thiên Nhất
  Trụ), Chợ Lớn national-relic halls (Đình Minh Hương Gia Thạnh 1789, Chùa Bà Hải Nam), Bảo tàng Biệt Động
  Sài Gòn + its 1968 arms bunker, Metro Line 1 (viral), markets (Kim Biên, Thiếc, Bà Hoa), historic bridges,
  craft villages (Tương Bình Hiệp, Tân Triều) out to Bình Dương/Đồng Nai. ~18 have published coords. Sources:
  VnExpress, Tuổi Trẻ, Thanh Niên, Dân trí, ZNews, Kênh14, VietnamNet + official + Wikipedia VI.
- **Consolidated:** VN 367 -> 452 (SEA total 654: 254 sights + 400 food); 619 clear >=2-credible; sources
  -> 247, creators -> 27. New Vietnamese outlets/KOLs registered in SOURCES_HCMC_VN*.json / CREATORS_HCMC_VN*.
- **Location-verify:** geocode wave over the 85 new (Vietnamese sights with Wikipedia/official coords pin;
  small eateries return address-only and are HELD for the browser helper — no fabricated/ZIP pins). Then
  geo-merge -> rebuild-city singapore --build -> gates.

## Stage 4 — Bishan HDB-town guide (discovery, 2026-09-01)
New pastel-guide town **Bishan** (area code **BSH**), mirroring the Toa Payoh format/source bar.
Subzones covered: Bishan Street 11/13/22, Sin Ming, Shunfu, Marymount, Bright Hill, Upper Thomson edge.

- **FOOD → FOOD_BISHAN.json (18):** T1 3 · T2 7 · T3 8. Anchors: Ming Kee Chicken Rice (ice-bathed,
  Kim San Leng) · Sin Ming Roti Prata (coin prata, Michelin roti-prata feature) · Rong Cheng Sin Ming
  Bak Kut Teh (Teochew dragon ribs, 1976). Sin Ming cluster (Sin Kian Heng BCM, Shi Xiang Ge Shanxi
  dao xiao mian by ex-Crystal Jade la mian director). Shunfu Mart cluster (Mei Zhen Hakka abacus seeds,
  Leong chicken rice, Lai Heng char kway teow, Wak Limah Malay, Quan Ann prawn mee, Marsiling Teochew
  fish soup, Chocolat N' Spice muffins, Heng Heng popiah). Plus Yang Ming Seafood (lobster chee cheong
  fun, SPH Food Masters 2020), 284 Kway Chap + Ding Ji (Bishan St 22 supper), Kam's Roast (Junction 8),
  Jai Thai. Every place has ≥2 credible outlets OR an award/Michelin editorial feature.
- **SIGHTS → SIGHTS_BISHAN.json (11):** T1 3 · T2 6 · T3 2. Bishan-Ang Mo Kio Park (62ha, naturalised
  Kallang River) · Kong Meng San Phor Kark See Monastery (largest in SG, Bright Hill) · HSBC TreeTop Walk;
  MacRitchie Reservoir Park, Bishan Public Library (LOOK Architects tree-house, President's Design Award
  2007), Kwong Wai Siew Peck San Theng (1870 cemetery that gave Bishan its name), Thomson Nature Park
  (Hainan village ruins), Windsor Nature Park, Lower Peirce Reservoir Park; Central Catchment Nature
  Reserve, Junction 8. Sources: NParks/PUB/NLB/Roots/NAS/Wikipedia/Remember Singapore/Mothership/
  Little Day Out/CapitaLand.
- **SOURCES_BISHAN.json** 23 outlets · **CREATORS_BISHAN.json** 1 verified creator (ieatishootipost /
  Dr Leslie Tay) with 2 attachments (Mei Zhen Hakka, Yang Ming Seafood). Yelp/TripAdvisor/Google/OpenRice/
  Burpple/FoodAdvisor/Lemon8 counted as 0; SEO farms + credit/real-estate blogs rejected (logged).
- **Deliberately excluded:** Lian Shan Shuang Lin Monastery (184 Jalan Toa Payoh) — already in the Toa
  Payoh guide, kept there to avoid a duplicate-name gate failure.
- **Budget note / backlog:** the shared WebSearch budget hit its 200/200 cap mid-research, so the town
  landed at 18 food + 11 sights (Toa-Payoh-comparable, below the ~35+18 stretch target). Sourced-but-held
  candidates needing one more credible voice on a future wave: Uncle Penyet (ayam penyet, Kim San Leng),
  The Wholefood Kitchen, Chi Western (吃Western), Wei Ji Congee, Jiak Mee, Hup Seng Duck Rice, Chindamani
  Indian (KPT), Dong Nan Wanton (Shunfu), Grin Affair & Denzy Gelato (Bishan dessert; Denzy's Bishan
  outlet is CLOSED), Canopy Garden Dining (Bishan Park bistro); plus the remaining stalls on the Eatbook/
  DFD/HerWorld/SethLui Shunfu 10-lists and the ieatishootipost Sin Ming Industrial Estate food trail.
- **NEXT:** resume discovery to lift food→~35 and sights→~18 once search budget resets; then geocode +
  location-verify (addresses carry block + S-postal; a few — Shi Xiang Ge at Bishan Cafeteria, Jai Thai
  Clover Way — flagged for postal confirmation at the geocode stage) → statuscheck → geo-merge → rebuild.

## Stage 4 — Bishan wave 2 (discovery extension, 2026-09-02)
Resumed Bishan discovery to lift density toward the Toa Payoh benchmark. **APPEND-only** to new files
(`FOOD_BISHAN2.json` LIST, `SIGHTS_BISHAN2.json` DICT, `SOURCES_BISHAN2.json`, `CREATORS_BISHAN2.json`);
wave-1 files untouched. Every place cleared **>=2 credible SG sources** (aggregators = 0); deduped against
the 18 food + 11 sights already in wave 1. **Bishan now stands at 34 food + 14 sights = 48.**
- **FOOD → FOOD_BISHAN2.json (16):** t1 0 · t2 7 · t3 9 · 1 closed. **T2:** Uncle Penyet (ayam penyet,
  Kim San Leng — Eatbook+SethLui), Chindamani Indian (crispy prata/biryani, KPT — MissTamChiak+SethLui),
  Dong Nan Wanton Noodle (Shunfu, Malaysian dry wanton — Eatbook+DFD), Jiak Mee (Gen-Z mee hoon kueh, Bishan
  Cafeteria — Eatbook+SethLui+MTC), Sen Yen Charcoal Traditional Toast (Sin Ming, Jin Fa kopitiam —
  Eatbook+MTC+SethLui), Hup Seng Duck Rice (Teochew braised duck, Blk 22 Sin Ming — MTC+Ladyironchef+HGW),
  Two Chefs Eating Place (butter pork ribs, Blk 409 Sin Ming Ave — HGW Bishan list + ieat/SethLui/DFD brand).
  **T3:** Mata Thai (claypot tom yum — SethLui+TheSmartLocal), Taste of Thailand (Thai zi char, Midview City
  — ieat+SethLui), Mr Egg Fried Rice (wok-hei egg fried rice, Blk 151 — SethLui+MTC), Kings Cart Coffee
  (Bishan Library — Eatbook+DFD+Honeycombers), Thus Coffee (Sembawang Hills roastery — SethLui+Timeout),
  Grin Affair (jar cakes, Blk 505D — MTC+Timeout+TheSmartLocal), Canopy Garden Dining (Bishan Park bistro —
  HGW+Honeycombers), **Denzy Gelato (Bishan) — CLOSED** (award gelato, Blk 506; Bishan outlet shut, brand
  lives on in Hougang/Bedok — Eatbook+SethLui), Yue Lai Xiang Delights (blue-pea mee hoon kueh, Sin Ming —
  MTC+ieat).
- **SIGHTS → SIGHTS_BISHAN2.json (3):** all t3. Bishan ActiveSG Stadium & Sports Centre (Lion City Sailors
  home, 7 Bishan St 14 — Wikipedia+AsiaOne+ActiveSG), Old Upper Thomson Road (1961-73 Grand Prix circuit,
  now threading Thomson Nature Park — NAS+NLB+RememberSG), Tse Tho Aum Temple (Sin Ming Buddhist temple +
  private crematorium — Roots(NHB)+Wikipedia).
- **SOURCES_BISHAN2.json** 5 NEW outlets (Ladyironchef, Time Out SG, The Honeycombers, AsiaOne, ActiveSG);
  all other outlets reused from wave 1. **CREATORS_BISHAN2.json** — ieatishootipost with 3 new attachments
  (Two Chefs, Taste of Thailand, Yue Lai Xiang); 13 rejected/held entries logged.
- **HELD (single-credible, chase on wave 3):** Wei Ji Congee (Eatbook only), Fu Hui Wantan/Lor Mee (HGW
  only), Huat Heng Fried Prawn Mee (Eatbook only), Palm Garden + Columbus Coffee (Honeycombers only).
  **REJECTED:** Wholefood Kitchen (CLOSED, 1 blog), Chi Western/吃Western (CLOSED, MTC only), Wowffle Burger
  (CLOSED, no credible SG source), J8 chains (not Bishan-unique). Full reasons in CREATORS_BISHAN2 rejected[].
- **Address flags for geocode stage:** most carry block + S-postal from search results; a handful of postals
  were inferred from the HDB block and should be confirmed at geocode — Jiak Mee (514 Bishan St 13 → S570514),
  Two Chefs (409 Sin Ming Ave → S570409), Mata Thai (508 Bishan St 11 → S570508), Mr Egg (151 Bishan St 11 →
  S570151), Grin Affair (505D Bishan St 11 → S570481), Canopy (1382 AMK Ave 1 → S569931), Yue Lai Xiang (Blk 22
  Sin Ming Rd → S570022). Sights Old Upper Thomson Rd & Tse Tho Aum carry descriptive addresses (no postal),
  consistent with wave-1 nature/heritage sights.
- **NEXT:** merge FOOD_BISHAN2/SIGHTS_BISHAN2 into the Bishan dataset → geocode + location-verify (confirm the
  flagged postals; read !3d!4d place-pins) → statuscheck (Denzy already flagged CLOSED) → rebuild. Chase the
  5 held single-credible candidates for a possible wave 3 toward the ~70 Toa Payoh benchmark.

## Stage 1 — Ang Mo Kio (AMK) discovery (DONE 2026-09-01)
Goal: build the Ang Mo Kio HDB-town guide at maximum LEGITIMATE density (no aggregator padding), mirroring
the Toa Payoh file format. Files: `FOOD_AMK.json` (LIST), `SIGHTS_AMK.json` (DICT), `SOURCES_AMK.json`,
`CREATORS_AMK.json`. WebSearch-only; **the shared 200-search budget was fully exhausted mid-run**, which
capped further 2nd-source verification (see NEXT).
- **FOOD: 31 places** (t1 8 · t2 13 · t3 10; 0 closed). Every entry clears >=2 credible SG sources, or a lone
  Michelin. Coverage by node: **724 AMK Central** (Ang Mo Kio Fried Kway Teow — SethLui/ieat/MissTamChiak/
  DFD; Yunos N Family mee rebus 1965; Centre Satay Bee Hoon; Seng Bee Chicken Rice), **Mayflower / Blk 158**
  (Ho Ji Fried Hokkien Mee; Malaysian Hup Kee Fishball — pure-yellowtail), **628 Market** (Ho Bee Roasted
  Food; Song Heng Fishball; Imperial Fish Soup; Sumo Hokkien Mee), **Chong Boon** (Rahim 'Power' Mee Rebus
  1957; Loh Mee Laksa; Cai Ji Fish Soup; Sin Kee Chicken Rice; Yong Xin), **Cheng San** (Ann Hoo Teochew
  Porridge; Top 73+1 Fishball Legacy — halal), **Kebun Baru** (Huang Fu Duck Rice; Hock Kee Wanton; Foo
  Hing Fishball), **Teck Ghee** (Eng Kee Bak Kut Teh), **zi char/seafood** (Mellben crab bee hoon — Michelin
  Plate 2019; Kam Jia Zhuang; Kian Seng), **Jalan Kayu** (Thasevi prata since 1960), **Sin Ming edge** (Sin
  Ming Roti Prata — coin prata), **Sembawang Hills FC** (Jing Ji Fishball; Fresh Fish Soup), plus No Horse
  Run Cafe and Kuai San Dian Xin ($1.30 24h dim sum). Ah Jie Hokkien Mee (Gen-Z viral, Ave 8).
- **SIGHTS: 13** (t1 3 · t2 8 · t3 2), all >=2 sources incl. institutional NParks/PUB/Roots(NHB)/MUIS:
  Bishan-Ang Mo Kio Park (naturalised Kallang River), Kebun Baru Birdsinging Club (SG's largest), AMK Town
  Garden West & East, Windsor Nature Park, MacRitchie TreeTop Walk (Venus Dr fringe), Lower Peirce Reservoir
  Park, Thomson Nature Park (Hainan village ruins), AMK Heritage Trail (NHB 2023 refresh, 40 sites), Church
  of Christ the King, Clover Block (Blk 259 — SG's only circular-flat block), Chu Sheng Temple, Masjid
  Al-Muttaqin.
- **CREATORS: 2 vetted** — Dr Leslie Tay/ieatishootipost (award-winning blog since 2006; 5 AMK attachments)
  and Tony Boey/Johor Kaki (widely-read hawker blog since 2011; 4 attachments). No new verifiable TikToker/
  YouTuber with follower evidence was confirmable within the search budget — logged, not fabricated.
- **Yelp/TripAdvisor/Google = 0 throughout.** Rejected: SEO/directory sites (kopitiam.com.sg,
  singaporehawkercentres.com, donsignaturecrab.sg), aggregators (Burpple/OpenRice/FoodAdvisor/jointhawker/
  Stampede/Hawkerpedia — measure-only), Lemon8/anon TikTok. **Out-of-area excluded** and noted: Ponggol Nasi
  Lemak (Kovan), Jian Bo Shui Kueh (Tiong Bahru home), Chomp Chomp (Serangoon Gardens); and **'Fishball
  Story'** from the brief is Douglas Ng's Golden Mile/Timbre+ stall, NOT AMK — excluded to avoid a false
  attribution.
- **Sub-areas with thin/single-credible coverage (budget-capped, for next pass):** Yio Chu Kang & Jalan Kayu
  heritage sights; the AMK Joint Temple / Liuxun Sanhemiao (on the trail but no detail captured); 409 AMK
  Market (Yummy Western, Shi Xian mee siam), Teck Ghee (Han Jiang Fish Soup, Belinda's Pancake), Cheng San
  (Mei Ji Niang Dou Foo, Mun Fu Chicken Rice, He Le Prawn Noodles), Mayflower (3 Sisters Prawn Noodle), and
  cafés (Twenty Grammes, Froz, Thus Coffee, F.I.C, Crunch & Cups Vietnamese, Teng Sheng K-BBQ) — each seen
  in only ONE credible outlet so far; hold for a 2nd source before adding.
- **Address note:** AMK HDB postal = "560"+block (search-confirmed for 724/628/158/202/232/532/555). A few
  addresses need geocode-stage confirmation: Kian Seng Seafood (block unknown — marked in file), Ah Jie
  (Food Loft Kopitiam, Ave 8, no block), Ann Hoo (Cheng San Market, no block/postal), Kebun Baru Market
  block/street (226H Ave 1 assumed). NO coordinates were invented — location-verify happens at geocode.
- **NEXT:** resume discovery to lift food→~50+ and sights→~18 once the WebSearch budget resets (many
  single-credible leads above await a 2nd source); then geocode + location-verify (Google !3d!4d / Apple /
  OneMap / Wikipedia coords) → statuscheck → geo-merge → rebuild-city singapore --build → gates.

## Stage 4 — Upper Serangoon (Kovan / Serangoon Gardens / Hougang edge), area code USG (DONE 2026-09-01)
Goal: a new Upper Serangoon town guide as comprehensive as Toa Payoh, mirroring the Toa Payoh JSON
format exactly (FOOD list, SIGHTS dict, SOURCES outlets, CREATORS). WebSearch-only discovery; no
coordinates (full SG address + postal per place); ≥2 credible sources per place (or lone Michelin).
- **FOOD (34):** FOOD_USG.json — T1 3, T2 17, T3 14, 1 flagged closure. Anchored on the area's three
  hawker landmarks:
  - **Chomp Chomp Food Centre** (20 Kensington Park Road, S557269) — 7 stalls: Ah Hock Fried Hokkien Mee
    (Michelin Plate) + Chomp Chomp Satay (Michelin Plate) T1; Chomp Chomp Fried Oyster, Good Luck BBQ
    Chicken Wings, Hai Wei Yuan BBQ (sambal stingray), Ang Sar Lee Satay Bee Hoon, Chia Keng Hokkien Mee.
  - **Serangoon Garden Market & Food Centre** (49A Serangoon Garden Way, S555945) — 10: Aliff Nasi Lemak
    (T1), Ah Seng Braised Duck Rice, Garden Street Kway Chap, Poh Poh Roasted Chicken Rice, Serangoon
    Garden Bakery & Confectionery, Hock Kee Fried Oyster, Lao Song Fa Fishball Noodle, Bee Heng Prawn
    Noodle, Fong Kee Delicacies, Pancake King.
  - **Kovan 209 Market & Food Centre** (209 Hougang Street 21, S530209) — 6: Fatt Soon Kueh, Hougang
    Hainanese Curry Rice, Bedok North 85 Fried Oyster, Yi Shi Jia Wanton Mee, 51 Ming Fa Wanton, Yam Mee
    Teochew Fishball.
  - **Serangoon Gardens / Kovan / Hougang-edge eateries (11):** Pow Sing (chicken rice, since 1983),
    R.K. Eating House (24h prata), Srisun Express (24h prata), Apollo Coffee Bar (cafe), Tian Wai Tian
    Fish Head Steamboat (Kovan Teochew zi char), Ponggol Nasi Lemak (iconic since 1979), Yaowarat Thai
    Kway Chap, Naked Ice Cream (till 2am), Al-Falah (24/7 mamak, Hougang Village), BakeOpedia/The Bread
    Rack (Space@Kovan), Amber Ember (— CLOSED 19 Jan 2025, flagged).
- **SIGHTS (12):** SIGHTS_USG.json — T1 3, T2 3, T3 6. Two National Monuments lead: **Church of the
  Nativity of the Blessed Virgin Mary** (1259 Upper Serangoon Rd, gazetted 2005, Teochew Catholic, Gothic
  1901) and **Hougang Tou Mu Kung / Kew Ong Yah** (779A Upper Serangoon Rd, oldest Nine Emperor Gods
  temple, 2005). Plus Chomp Chomp (landmark), Serangoon Garden Estate & Circus (1950s British/RAF landed
  estate, British street names), Hougang Heritage Trail (NHB, first heartland trail with 2 monuments),
  Punggol Park (16 ha, 5-ha lake), Serangoon Park Connector, myVillage (ex-Paramount Theatre site),
  Montfort Schools (est. 1916 as Holy Innocents'), Lim Tua Tow Market heritage marker, Serangoon
  Stadium & Sport Centre, Nex (NE regional mall / Serangoon MRT).
- **Source bar:** credible SG editorial only — Michelin, SethLui, Eatbook, Daniel Food Diary, Miss Tam
  Chiak, HungryGoWhere, Her World, ladyironchef, City Nomads, The Honeycombers, Mothership; NHB/Roots,
  NLB, NParks, Wikipedia, Remember Singapore for sights. **Creators (2):** ieatishootipost (Dr Leslie
  Tay) and Johor Kaki (Tony Boey) — both verifiable, long-running SG food blogs; attach notes in
  CREATORS_USG.json. Yelp/TripAdvisor/Google = 0. Rejected SEO/directory/aggregator + anonymous social
  logged in CREATORS_USG.json rejected[].
- **Validation:** all four JSON files parse (python3); every food place carries ≥2 credible sources (or a
  lone Michelin Plate), every sight ≥2. NO coordinates recorded (address + postal only, per brief).
- **NEXT:** geocode + location-verify each place (Google !3d!4d / Apple / OneMap / Wikipedia coords) →
  statuscheck (re-confirm the Amber Ember closure + spot-check others) → geo-merge → register USG as a
  Singapore town (region→folder) → rebuild-city singapore --build → gates. Extension leads for a 2nd
  wave: Tom's Palette (Kovan), Lickers, The Larder, Tracy's Sarawak Kitchen, Breakfast Club, Ding Te Le,
  Qi Wei Chicken Claypot — held pending a confirmed 2nd credible source and/or exact address.

### Upper Serangoon (USG) — WAVE 2 discovery (DONE 2026-09-02)
Goal: push USG from ~46 toward the Toa Payoh ~70 benchmark, no padding below the >=2-credible bar.
WebSearch-only; no coordinates (full SG address + postal where known); APPENDED to NEW files
`FOOD_USG2.json` (15), `SIGHTS_USG2.json` (5 sights + 7 source rows), `SOURCES_USG2.json` (5 new outlets),
`CREATORS_USG2.json` (1 creator / 4 attach / 6 rejected). All parse (python3); every record `a="USG"`;
**no name collides with wave 1**; every food place carries >=2 credible sources, every sight >=2; all
source/creator keys resolve against SOURCES_USG(+2)/CREATORS_USG(+2). Running total ≈ 61 (49 food + 17
sights across both waves; wave-1 was 34 food + 12 sights, wave-2 adds 15 + 5).

- **FOOD 15 — tiers t2=8, t3=7 (no new t1).**
  - **Chomp Chomp Food Centre (2 more):** Swee Heng Wanton Noodle (#01-12, 50-yr, in-house char siew/
    wantons), Wang Da Shen Chicken Wing & Satay (pandemic-era stall, only one open till 2am).
  - **Serangoon Garden Market (1 more):** Seng Kee Mushroom Minced Meat Noodle (#01-36, 40-yr bak chor mee).
  - **Kovan 209 Market (2 more):** Fa Ji Minced Meat Fishball Noodle (#01-05), Hajjah Mariam Muslim Food
    (#01-53, halal nasi lemak).
  - **Kovan / Hougang St 21 / Upper Serangoon / myVillage (10):** Tom's Palette Kovan (Blk 212 #01-333 —
    gelato, opened Mar 2024; HONEST NOTE recorded in-card: both outlets set to close Oct 2026, kept
    open=true as it is trading as of Sep 2026), Lola's Cafe (5 Simon Road, brunch), Two Cranes (Blk 211
    #01-291, Korean-fusion cafe), Dessert Bowl (80A Serangoon Garden Way, durian mousse), East Bistro
    (myVillage #02-01, ex-Lei Garden chef Tony Wong, dim sum), Ng Kuan Chilli Pan Mee (943 Upper Serangoon,
    KL ban mian), Nakhon Kitchen (Blk 212 #01-341, pioneer affordable Kovan Thai since 2008), Curry & Curry
    (203 Hougang St 21 #01-45, curry fish head zi char), Sin Heng Kee Porridge (685 Hougang St 61 #01-150,
    long-queue congee), Fragrant Garden (756 Upper Serangoon Rd, Teochew — anchors the 'Au Kang' heritage).
- **SIGHTS 5 — tiers t2=2, t3=3.** Masjid Haji Yusoff (2 Hillside Drive, oldest Hougang mosque 1921,
  Angullia-donated land — Hougang Heritage Trail) and Chee Tong Temple (62 Hougang Ave 3, 1987, Tay Kheng
  Soon / Akitek Tenggara — SG's first modernist Chinese temple, docomomo-documented) lead; plus Church of
  St Vincent de Paul (301 Yio Chu Kang Rd, Kovan western edge, opened 1970), Heartland Mall @ Kovan (205
  Hougang St 21, above Kovan MRT), Sungei Serangoon Park Connector / North-Eastern Riverine Loop.
- **New outlets (SOURCES_USG2):** THESMARTLOCAL, TIMEOUT (Time Out SG), DOCOMOMO (Docomomo Singapore),
  CATHOLICSG (Archdiocese heritage), GCATHOLIC. All other keys reuse the wave-1 registries. **Creator:**
  ieatishootipost (Dr Leslie Tay) re-referenced with 4 new attach notes (East Bistro, Curry & Curry, Sin
  Heng Kee, Fragrant Garden). Yelp/TripAdvisor/Google/Burpple/OpenRice/Lemon8/TikTok = 0.
- **Merit bar — measured then dropped/held (in CREATORS_USG2 rejected[]):** Zuzu Kebab, Denzy Gelato,
  Weng Fatt HK Roast, Prata Lahhh!, Hajime Tonkatsu / iSTEAKS / Waa Cow! (myVillage chains) — single-
  credible or not area-signature. Bee Kee Wanton, Lau Wang Claypot, Suriya Curry House, Song Kee Fishball
  deferred as Serangoon-Central cluster (nearer Serangoon town / Nex than Upper Serangoon-Kovan).
- **NEXT (shared with wave 1):** geo-merge FOOD_USG(+2)/SIGHTS_USG(+2) → geocode + location-verify each new
  place (Google !3d!4d / OneMap / Wikipedia coords) → statuscheck (RE-CONFIRM Tom's Palette Kovan closure
  date — flag `— CLOSED` once it actually shuts in Oct 2026) → rebuild-city singapore → gates.

## Stage 4 — Potong Pasir & MacPherson (PPM) discovery (DONE 2026-09-01)
Two adjacent central areas built to Toa Payoh depth, area code **PPM**, WebSearch-only (WebFetch blocked),
batched to conserve shared budget. Files: `FOOD_PPM.json` (25), `SIGHTS_PPM.json` (12 + 16 source rows),
`SOURCES_PPM.json` (14 outlets), `CREATORS_PPM.json` (3 creators / 5 attach / 5 rejected). All parse
(python3); every record `a="PPM"`; **every place carries >=2 credible sources** (validator GATE-1 clean);
all source keys resolve to their registry.

- **FOOD 25** — tiers t1=4, t2=10, t3=11. Clusters: **Circuit Road Market & Food Centre** (MacPherson's
  50-yr, 2026-renovated centre) — The Fishball Story (Michelin Bib 2016, Douglas Ng), Old Fisherman crab
  bee hoon (ex-actor Huang Yiliang), Tian Seng fried Hokkien mee, Victor Veggie mock-meat satay, Dancing
  Char Kway Teow, Nan Xing Claypot Rice, Briyani by Hamidah Bi, Ghim Guan Fried Oyster. **MacPherson Rd /
  Tai Thong / Potong Pasir** — Julaiha 24h prata, River South (Hoe Nam) Prawn Noodle (est. 1971, 1 Tai
  Thong Cres), Macpherson Minced Meat Noodle (Tai Thong bak chor mee), Kizuna cafe (148 Potong Pasir Ave 1),
  Rise Bakehouse (Poiz Centre), Taste of Home (Seremban Malaysian — Potong Pasir stall closed Mar 2024,
  **reopened Sep 2024** at The Commerze @ Irving, Tai Seng edge; recorded at current address, open).
  **Woodleigh Village Hawker Centre (202C Woodleigh Link) + The Woodleigh Mall (Bidadari)** — Style Palate
  duck confit, Guan Kee Kway Chap (1980s), Ming Chung White Lor Mee (Henghua), Eng Kee Chicken Wings,
  Origanics (vegan), Ji Hui Lai Nasi Kerabu, Fat Fat Food (Cantonese porridge), Pura Vida Cocina (Mexican),
  HK Egglet, Olla Specialty Coffee (barista champ), Surrey Hills Grocer.
- **SIGHTS 12** — tiers t1=3, t2=5, t3=4. Potong Pasir sloping-roof HDB (Blk 101-142, 1984 postmodern),
  Bidadari Park & Alkaff Lake (opened 3 Sep 2024), **Alkaff Upper Serangoon Mosque (68th National
  Monument, 1932)**, St Andrew's Village, Lorong Koo Chye Sheng Hong Temple (City God, MacPherson), Sri
  Manmatha Karuneshvarar Temple (1888, Kallang edge), Sennett Estate (SG's largest 1950s planned estate),
  Bidadari Cemetery heritage & Memorial Garden, The Woodleigh Mall & Village, Kallang River & Bidadari
  Park Connector (Potong Pasir = 'cut sand'), MacPherson estate/road heritage (Col. Ronald MacPherson;
  ex-Jalan Klapa; first 10-storey flats 1961), Potong Pasir Town & Block 142 landmark.
- **Merit bar applied — measured, then dropped:** PP 881 handmade bao (EdgeProp/blog only — 1 credible),
  Ser Seng Herbs turtle soup (johorkaki only), No.10 Noodle House / Yong Lai Fa Ji fish soup / Soon Lee
  Lor Mee / Omar's Thai Beef / Hup Hup Mee Siam (single-credible-list each), Jackson Noodles & Fong Yong
  Tau Foo (aggregator-only), Ms Durian (moved / status unconfirmed), Siam Village & Tian Wai Tian & Gu Ma
  Jia (aggregator-only). Sasanaramsi Burmese Temple & Kwan Im Thong Hood Cho dropped as out-of-area.
- **Sources:** Michelin/Wikipedia + SethLui, Eatbook, Daniel Food Diary, Miss Tam Chiak, Her World, The
  Singapore Women's Weekly, HungryGoWhere, ieatishootipost, Johor Kaki, SG Food on Foot, AsiaOne,
  Honeycombers, TimeOut; sights on NParks/URA/Roots/NLB/NAS/BiblioAsia/MTI + official temple/mosque sites.
  **Yelp/TripAdvisor/Google/Burpple/FoodAdvisor = 0 throughout** (measurement only); kopitiam.com.sg,
  singaporehawkercentres, singaporefoodie & other SEO farms rejected. No coordinates (address + postal
  only), no fabrication; closures=0 (all verified open).
- **NEXT:** geocode/location-verify PPM addresses via browser helper -> geo-merge -> rebuild-city
  singapore --build -> gates (sourcecheck/geocheck/statuscheck), same as Stage 2.

### Stage 4 — PPM wave 2 (DONE 2026-09-02)
Second discovery wave on the same area code **PPM**, WebSearch-only. **Appended to new files** (wave-1
files untouched): `FOOD_PPM2.json` (20, LIST), `SIGHTS_PPM2.json` (3 + 6 source rows, DICT),
`SOURCES_PPM2.json` (4 new outlets), `CREATORS_PPM2.json` (2 creators / 4 attach / 5 rejected). All parse
(python3); every record `a="PPM"`; **every place carries >=2 credible sources**; all source keys resolve
(SOURCES_PPM + SOURCES_PPM2 for food; SIGHTS_PPM2's own `sources` for sights). **De-duped against wave 1**
(0 name collisions in food or sights). Takes PPM from 37 -> **60** (45 food + 15 sights).

- **FOOD +20** — tiers t2=7, t3=13.
  - **Circuit Road Market & Food Centre (chased wave-1 HELD candidates, now 2nd-source-confirmed):**
    No.10 Noodle House (S$2.50 old-school BCM/fishball; SethLui-dedicated + Mothership + Ordinary Patrons),
    Yong Lai Fa Ji Shu Shi (fish soup "on par with Amoy St"; ieat + MissTamChiak + DFD), Omar's Halal Thai
    Beef Noodles (3 dedicated: SethLui + Eatbook + MTC), Soon Lee Lor Mee (since 1970s; SethLui + ieat),
    Hup Hup Mee Siam・Laksa・Lor Mee (Top-10 mee siam; SethLui-dedicated + Entree Kibbles), Three Treasures
    Roast Duck (Women's Weekly + Her World).
  - **MacPherson / Tai Thong / Potong Pasir:** Folk Yard (sandwich cafe; Eatbook + DFD + TimeOut),
    Yuan Wei Seafood (83 MacPherson Lane; $5 crab claws + Penang CKT; Eatbook + ieat), Yi Jia South Village
    Seafood (544 MacPherson Rd; honeydew prawns; ieat + Entree Kibbles), Fullybooked (industrial local cafe;
    Eatbook + DFD + SethLui), Sweet Cheeks Gelato (SMU-grads; DFD + ladyironchef + Entree Kibbles), Ling's
    Patisseries (DFD + HungryGoWhere), No Monkey Business (veg zi char; SethLui + Honeycombers), EVERY
    (Japanese konbini cafe, Poiz Centre; Eatbook + TimeOut).
  - **Woodleigh Village Hawker Centre + The Woodleigh Mall:** Liu Kou Shui (Japanese donburi; Eatbook +
    SethLui + DFD), Kallang Wantan Mee (SethLui + DFD + Eatbook), M+ Fried Rice Paradise (halal; HungryGoWhere
    Hawker-Hustlers + SethLui + AsiaOne), Whampoa Nan Xiang Chicken Rice (SethLui + Eatbook), Liu Da Xia
    (white curry prawn noodles; Eatbook young-hawkers + TimeOut), Beans.Factory (Malaysian tau fu fah;
    Eatbook + HungryGoWhere).
- **SIGHTS +3** — t2=2, t3=1. Istana Bidadari (the vanished Sultan Abu Bakar palace that named the whole
  estate/district — Zubaidah/"bidadari"; Wikipedia + RememberSingapore + Home&Decor), Sri Siva Durga Temple
  (8 Potong Pasir Ave 2; Hindu, est. 1906, rebuilt 2016; Wikipedia + NLB + TimeOut + official), Alkaff
  Gardens (former 1929-64 Japanese-style lake garden, ancestor of the new Alkaff Lake; Wikipedia + Home&Decor).
  Most PPM sight ground was already covered by wave 1 (mosque, temples, Sennett, Bidadari Park/Cemetery,
  sloping-roof HDB, MacPherson/Potong Pasir heritage) — added only genuinely-distinct heritage.
- **Merit bar applied — measured, then HELD/dropped (not padded):** **Ser Seng Herbs turtle soup (39 Tai
  Thong Cres)** — Johor Kaki has a dedicated MacPherson post, but the SethLui/Miss Tam Chiak dedicated
  reviews are the *Geylang sister* branch (Tan Ser Seng), so the MacPherson outlet holds at 1 clear credible
  — HELD. **Nooodon** (Venue Shoppes BCM/donburi) — only Daniel Food Diary is clearly credible (2nd was the
  small jiaksimipng blog) — HELD. **PP 881 handmade bao** (still EdgeProp-only, 1 credible), **Fuel X** (DFD
  only), **Kumari's Veetu Biryani** (Eatbook Bidadari-guide only), **Huang Chao Teochew Fish Soup**
  (Fei Siong chain, thin dedicated coverage) — all HELD pending a 2nd credible. **"Macpherson Bak Chor Mee"**
  correctly EXCLUDED — it is a *Toa Payoh* (Blk 95 Lor 4) stall despite the name, not in PPM.
- **Sources:** existing PPM outlets (SethLui, Eatbook, Daniel Food Diary, Miss Tam Chiak, Her World, Women's
  Weekly, HungryGoWhere, ieatishootipost, AsiaOne, Honeycombers, TimeOut) + **4 new**: Mothership,
  The Ordinary Patrons, ladyironchef, Entree Kibbles (Cavin Teo, added as creator). Sights on
  Wikipedia/NLB/TimeOut + RememberSingapore + Home&Decor + official temple site. **Yelp/TripAdvisor/Google/
  Burpple/FoodAdvisor/OpenRice/foodpanda/eatigo/Quandoo = 0 toward the bar** (address/measurement only);
  SEO farms (voykris, islifearecipe, singaporehawkercentres, hawkerpedia, kopitiam.com.sg, nickblitzz,
  traveltriangle, sglocalnews) + Lemon8/anon TikTok + AI-scrape pages (mindtrip, aroundus) rejected.
  No coordinates (address + postal only; postal omitted rather than guessed where unconfirmed — Fullybooked,
  Folk Yard unit); no fabrication; closures=0 (all verified open).

### Stage 1 — Ang Mo Kio (AMK) wave 2 (DONE 2026-09-02)
Second discovery wave on area code **AMK**, WebSearch-only (WebFetch blocked). **Appended to new files**
(wave-1 files untouched): `FOOD_AMK2.json` (20, LIST), `SIGHTS_AMK2.json` (4 + 5 source rows, DICT),
`SOURCES_AMK2.json` (4 new outlets), `CREATORS_AMK2.json` (2 creators / 5 attach / 7 rejected). All parse
(python3); every record `a="AMK"`; **every place carries >=2 credible sources**; all food source keys resolve
(SOURCES_AMK + SOURCES_AMK2), all sight keys resolve (SIGHTS_AMK2 own `sources`). **De-duped against wave 1**
(0 name collisions in food or sights). Takes AMK from 44 -> **68** (51 food + 17 sights).

- **FOOD +20** — tiers t1=2, t2=15, t3=3.
  - **Standouts (t1):** Plum Village (Singapore's oldest Hakka restaurant, 16 Jalan Leban, AMK/Sembawang
    Hills fringe; Eatbook + MTC + Ordinary Patrons + Johor Kaki + ieat); Xi Xiang Feng Yong Tau Foo (724
    Central, longest queue / best-YTF; DFD + MTC + ieat + Johor Kaki + SethLui best-YTF + Cavinteo + Eatbook).
  - **Chased wave-1 HELD candidates, now 2nd-source-confirmed:** Han Jiang Fish Soup (409; SethLui 409 guide
    + Johor Kaki), Mun Fu Chicken Rice (Cheng San; SethLui Cheng San guide + ieat 'Man Fu'), 3 Sisters Prawn
    Noodle (Mayflower; MTC + SethLui dedicated), Belinda's Pancake (Teck Ghee Court min jiang kueh; MTC +
    Eatbook + SethLui + HGW), Crunch & Cups (Vietnamese, 260 St 21; Eatbook + SethLui), Twenty Grammes (529
    dessert cafe; Eatbook + SethLui waffles + ladyironchef + DFD), F.I.C (void-deck fried-ice-cream cafe;
    Eatbook dedicated + HGW).
  - **New clusters:** Cheng San — Song Kee Fishball Noodle (Johor Kaki + Cavinteo + HGW), Nagara Thai (HGW +
    SethLui). Kebun Baru — Seletar Sheng Mian & Mian Fen Guo (SethLui + MTC), Hong Heng Beef Noodle & Laksa
    (unique beef laksa; SethLui + MTC + Eatbook beef-laksa). Sin Ming/Peirce fringe — Casuarina Curry (60+
    prata flavours; DFD prata guide + Time Out). Bishan-AMK Park — Grub (HGW + MTC). Sembawang Hills — Sin
    Hoe Huat Cafe (kaya toast since 1968; ladyironchef + MTC + Women's Weekly + Her World + DFD). Ave 3/5 —
    Soi 19 Thai Wanton Mee (MTC + Cavinteo + Eatbook), Rasa Sayang Western Food (DFD + Eatbook + SethLui),
    AMK 453 Wanton Mee (Johor Kaki + MTC), Brew & Co cafe (DFD + HGW).
- **SIGHTS +4** — tiers t2=1, t3=3, all >=2 sources incl. institutional Roots(NHB)/NHB. Ang Mo Kio Dragon
  Playground (Blk 570 Ave 3 — surviving vintage sand dragon, mosaic slide; Little Day Out + Roots trail +
  Home&Decor); Ang Mo Kio Joint Temple (1978/2011, Gao Lin Gong 1888; Roots + NHB + SG Magazine); Liuxun
  Sanhemiao (1989, ex-Lak Xun Village, Yio Chu Kang; Roots + NHB); Swee Kow Kuan (Hong-surname clan temple
  est. 1905; Roots hidden gems + NHB). All are Ang Mo Kio Heritage Trail sites (Iconic Landmarks / Hidden
  Gems / Scenic Fringes routes), chasing the wave-1 leads (AMK Joint Temple, Liuxun Sanhemiao, YCK heritage).
- **Merit bar applied — HELD below the 2-credible bar (single credible source only):** Froz Bakery Cafe,
  Thus Coffee, Apiary (Jubilee Square) — DFD AMK-cafes round-up only; Mei Ji Niang Dou Foo, He Le Prawn
  Noodle, Jie Mei YTF, Ms Aiyu (409), Xiang Kee Fishball (Cheng San), Lu Ge Wanton Mee — one SethLui or one
  Johor Kaki appearance each; logged in CREATORS_AMK2 rejected[]. **Dropped:** Yummy Western (409; unit
  taken over by Wang Ji Hainanese Chicken Rice Jan 2025 — gone); Dim Sum Express (555; = wave-1 Kuai San
  Dian Xin, duplicate).
- **Sources:** SethLui, Eatbook, Daniel Food Diary, Miss Tam Chiak, HungryGoWhere, Her World, Women's
  Weekly, ieatishootipost, Johor Kaki, Entree Kibbles (Cavin Teo), ladyironchef, Time Out; sights on
  Roots(NHB)/NHB/Little Day Out/Home&Decor/SG Magazine. **Yelp/TripAdvisor/Google/Burpple/Foursquare/
  Stampede/Lemon8 = 0 throughout** (measure/address only); SEO farms (nickblitzz, donsignaturecrab,
  getgo blog, kopitiam.com.sg, singaporehawkercentres, hawkerpedia, threebestrated, foodadvisor, trip.com)
  rejected. **NO coordinates** (full address + S-postal only; a few blocks/units flagged 'to confirm' for
  the geocode stage — F.I.C block, AMK 453 stall no., AMK Joint Temple / Swee Kow Kuan streets). No
  fabrication; closures among new places = 0.
- **NEXT:** geocode + location-verify each AMK/AMK2 place (Google !3d!4d / Apple / OneMap / Wikipedia
  coords) -> statuscheck -> geo-merge -> register AMK as a Singapore town (region->folder) -> rebuild-city
  singapore --build -> gates (sourcecheck/geocheck/statuscheck). Remaining single-credible HELD leads above
  await a 2nd source for a wave 3 if AMK is pushed past 70.

### Stage 1 — Ang Mo Kio (AMK) wave 3 (DONE 2026-09-02)
Third discovery wave on area code **AMK**, WebSearch-only (WebFetch blocked). **Appended to new files**
(waves 1+2 untouched): `FOOD_AMK3.json` (16, LIST), `SIGHTS_AMK3.json` (3 + 6 source rows, DICT),
`SOURCES_AMK3.json` (2 new outlets), `CREATORS_AMK3.json` (0 new creators / 28 rejected-or-held). All parse
(python3); every record `a="AMK"`; **every food place carries >=2 credible sources** (or lone Michelin); all
food source keys resolve (SOURCES_AMK + AMK2 + AMK3), all sight keys resolve (SIGHTS_AMK3 own `sources`).
**De-duped against waves 1+2** (0 name collisions in food or sights). Takes AMK from 68 -> **87** (67 food + 20 sights).

- **FOOD +16** — tiers t1=1, t2=8, t3=7; 0 closed.
  - **t1:** Hup Hup Minced Meat Noodle (724 Central #01-39 — Michelin Guide-listed ketchup-forward bak chor mee;
    DFD + SethLui + Her World + Women's Weekly).
  - **t2:** Eng Ho Fried Hokkien Prawn Mee (409/Teck Ghee Sq — SethLui 409 guide + MTC; Lianhe Wanbao top-10);
    Zhen Ming Pork Ribs Prawn Noodle (Mayflower 162 — MTC + SethLui best-prawn-noodle-soup; black-sugarcane broth);
    Shu Heng Bi Tai Mak (Kebun Baru — Eatbook + SethLui + Johor Kaki + MTC; JB-style bi tai mak);
    Thohirah Restaurant (258 Jalan Kayu — 24h halal prata/biryani; Eatbook + MTC Jalan Kayu guides);
    Lai Heng Char Kway Teow (Sembawang Hills — MTC + Eatbook + DFD + Johor Kaki; CKT + otah);
    Ayah Dimsum (Blk 260 St 21 — Muslim-owned handmade dim sum; Eatbook + Have Halal Will Travel + 8days);
    Dongsheng Cafe (Blk 163 Ave 4 — 2025 Nanyang cafe, mani cai mee hoon kueh; SethLui + Eatbook);
    Wonders (128 Ave 3 — mahjong-themed gelato cafe; Eatbook + DFD).
  - **t3:** Rosnah's Family Kitchen (628 #01-97 — Malay; SethLui + Eatbook 628); Foy Yin Vegetarian (628 #01-70 —
    SethLui + Eatbook 628); Seng Huat Duck Rice (Sembawang Hills #01-27 — MTC + DFD + SethLui);
    Makan Food Stall (Sembawang Hills #01-17 — halal Malay; MTC + DFD); Xiang Kee Yu Yuan Mian Tang (Cheng San
    527 #01-125 — fishball KT soup; SethLui Cheng San guide + Johor Kaki); Vincent Western Food (724 Central
    #01-08 — 1990s hawker-Western; SethLui old-school Western guide + DFD 724 roundup); Ki-mochi (Blk 446 Ave 10
    #01-1661 — mochi pancakes/waffles cafe; Eatbook + SethLui + Mothership) — **FLAGGED: one unverified report the
    unit changed hands; re-verify at statuscheck before publishing.**
- **SIGHTS +3** — tiers t2=1, t3=2, all >=2 credible incl. institutional Roots(NHB)/NHB/NLB/Wikipedia.
  Old Upper Thomson Road / Thomson Road Grand Prix Circuit (1961-73 SG GP course — Devil's Bend, The Snakes;
  Wikipedia + NLB + Atlas Obscura + Remember Singapore); Teachers' Housing Estate (STU estate, 1969/71, roads
  named after literary figures; Roots + NHB); Sembawang Hills Estate (1950s ex-rubber landed estate; Roots +
  Wikipedia + NHB). All three are Ang Mo Kio Heritage Trail markers (Scenic Fringes / heritage).
- **Chased wave-2 HELD leads → confirmed:** Zhen Ming (now 2nd-sourced), Shu Heng, Lai Heng, Seng Huat, Makan,
  Xiang Kee, Ayah Dimsum, Dongsheng, Wonders, Ki-mochi. **CORRECTION:** wave-2's Penang Delights was NOT added —
  re-check found only ONE clearly-credible source (Cavin Teo); 'Penang Savour'/'Penang Kitchen' are different
  places. Moved to CREATORS_AMK3 rejected/held.
- **New CREDIBLE outlets registered (SOURCES_AMK3):** Have Halal Will Travel (major SG halal food/travel
  publication) and 8days (Mediacorp) — both for Ayah Dimsum, alongside Eatbook. No new individual TikToker/
  YouTuber with verifiable follower evidence was confirmable — logged, not fabricated.
- **HELD below the 2-credible bar (single credible only), logged for a wave 4:** Mikuriya (ex-Sushi Tei donburi),
  Konomi Zen, Donburi No Tatsujin, SteakGrill, Marugoto Shokudou (Broadway Plaza, former cinema), I'm Kim Korean
  BBQ, Thai Baang (AMK Hub), Kopi Soh, Just Love Bread, Zhou Ji Wanton, Huang Ah Yi Noodle, Jia Xiang Curry Rice,
  Teck Kee Cooked Food, OK Chicken Rice & Humfull Laksa, Lao San Kway Chap, Ru Lai Vegetarian, Qi Xiang, Gao Yuan
  Dessert, Wei Ji Braised Duck, Sing Soon Lee Chicken Rice, Xiang Ji Porridge, Nasi Lemak@67, Shi Xian, Jie Mei
  YTF, Ping Kee Popiah, Ang Mo Kio Big Prawn Noodle, Penang Savour, Hup Lee Bee Hoon, Roasted Delight. Froz Bakery
  re-checked (still aggregators only — rejected). Seletar Hills Estate excluded (on AMK trail but Seletar/Serangoon
  geography — area over-reach).
- **Yelp/TripAdvisor/Google/Burpple/OpenRice/Foursquare/Lemon8/abillion/happycow = 0 throughout** (measure/address
  only); SEO farms (kopitiam.com.sg, singaporehawkercentres, donsignaturecrab, getgo, nickblitzz, threebestrated,
  foodadvisor, trip.com, nearme, everydayonsales) rejected. **NO coordinates** (full address + S-postal only; a few
  stall units flagged 'to confirm' for geocode — Shu Heng, Ayah Dimsum, Lai Heng #01-32 vs 01-15). No fabrication.
- **NEXT:** geocode + location-verify each AMK3 place (Google !3d!4d / OneMap / Wikipedia coords) -> statuscheck
  (incl. Ki-mochi closure re-verify) -> geo-merge -> rebuild-city singapore --build -> gates. Single-credible HELD
  leads above await a 2nd source for a wave 4 if AMK is pushed past 90.

### Upper Serangoon (USG) — WAVE 3 discovery (DONE 2026-09-02)
Goal: from ~66, push USG toward 100+ across EVERY subzone (Serangoon Gardens/Chomp Chomp/myVillage,
Kovan/Kovan 209/Heartland Mall, Hougang Ave 1-10/Hougang Central/Hougang Mall/Ci Yuan/Lorong Ah Soo,
Buangkok, the Defu/Lorong Halus edge). No padding below the >=2-credible bar.

**Files:** `FOOD_USG3.json` (33, LIST), `SIGHTS_USG3.json` (5 sights + 8 embedded source rows, DICT),
`SOURCES_USG3.json` (2 new outlets), `CREATORS_USG3.json` (2 creators re-declared / 6 attach / 13 rejected).
All parse (python3 json.load); every record `a="USG"`; every food carries `closed`; DEDUP against
waves 1+2 = 0 collisions (verified programmatically). Every source key resolves against
SOURCES_USG(+2+3)/CREATORS_USG(+2+3)/SIGHTS embedded sources. **Running total = 66 + 38 = 104**
(82 food + 22 sights).

- **FOOD 33 — tiers t1=5, t2=14, t3=14, closures 0.**
  - **t1 (institutional / best-rated):** Nasi Lemak Ayam Taliwang (Ci Yuan #01-40, MICHELIN-listed +
    DFD), Ming Fa Duck Rice (Hainanese Village #02-01, Johor Kaki + MTC + SethLui + Eatbook), Original
    Simon Road Hokkien Mee (Kovan 209 #01-66, same recipe since 1960 — SethLui + DFD + Eatbook),
    Anshun Seafood Soup (174C Hougang Ave 1, SG's best-rated fish soup — ieat + Eatbook + SethLui),
    Hougang Oyster Omelette & Fried Kway Teow (435A Hougang Ave 8, ieat + MTC + Eatbook + SethLui).
  - **Kovan / Kovan 209 / Upper Serangoon:** Davis Prawn Court (#01-37), Yong's Teochew Kueh (1022 UppSer),
    Yi Ji Fried Hokkien Prawn Mee (965 UppSer), Yi Dian Xin HK Dim Sum (973 UppSer), 88 Pocha (957 UppSer),
    Breakfast Club (941 UppSer), Picky Snout (1014 UppSer), Tachinomiya (Blk 211, first heartland izakaya),
    Fatto Catto (15 Simon Rd, matcha cafe by Fat Cat).
  - **Hougang (Ave 1-10 / Central / Rivercourt):** Denzy Gelato (684 Ave 8, 2019 SG Gelato champ), 682 Min
    Jiang Kueh (682 Ave 4), Sweedy Patisserie (377 St 32, viral crookie/Fatcaron), Happy Oven (678 Ave 8),
    5 Star Corner Western (805 Hougang Central), Goldhill Family Restaurant (Blk 6 Ave 3, cai png),
    Kovan Scrambled Egg Rice (relocated 2024 to Blk 335 Ave 7).
  - **Hainanese Village Centre / Lorong Ah Soo (105 Hougang Ave 1) — the Teochew/heartland cluster (7):**
    Ming Fa Duck Rice, Quan Ji Cooked Food, Yi Liu Xiang (First Class Fragrance) Nasi Lemak, Apollo Grilled
    Western Food, Lorong Ah Soo Lor Mee (Fu Yuan Mei Shi), Dong Jin Yuan Dian Xin (fried carrot cake sticks),
    Roasted Pork Belly Nasi Lemak.
  - **Ci Yuan Hawker Centre (51 Hougang Ave 9):** Nasi Lemak Ayam Taliwang, Jade's Chicken (Korean),
    Mei Xi Hakka Yong Tau Foo.
  - **Serangoon Gardens / myVillage:** Hajime Tonkatsu & Ramen (#02-07/8/9), Waa Cow! Yakiniku (#02-10/11),
    The Larder Cafe (66A Serangoon Garden Way), Chindamani Indian Restaurant (108 Ave 1, ieat 'Famous Five'
    prata + Honeycombers).
- **SIGHTS 5 — tiers t1=1, t2=1, t3=3.** **Kampong Lorong Buangkok** (7 Lorong Buangkok — Singapore's last
  mainland village, est. 1956, Trafalgar/Buangkok subzone of Hougang; NLB + TheSmartLocal + Wikipedia) leads.
  **Lorong Halus Wetland / Serangoon Reservoir** (the Defu/industrial edge; NParks + PUB). Plus **Holy
  Innocents' High School** (5 Lorong Low Koon, 1892 mission school; Wikipedia + CatholicSG), **Zi Yun Kai Ji
  Gong** (56 Hougang Ave 3, 1996, three relocated temples — Hougang Heritage Trail 'Architectural Gems';
  Roots + Wikipedia), **Kangkar (Kang Kar) heritage site** (foot of Sungei Serangoon, old fish market at
  7½ milestone; Roots/NHB + Remember Singapore).
- **New outlets (SOURCES_USG3):** WOMENSWEEKLY (The Singapore Women's Weekly), PUB (national water agency,
  for Lorong Halus). All other keys reuse the existing USG registry.
- **Creator attach (CREATORS_USG3):** IEATISHOOTIPOST -> Anshun Seafood Soup, Hougang Oyster Omelette,
  Chindamani; JOHORKAKI -> Ming Fa Duck Rice, Yi Liu Xiang Nasi Lemak, Dong Jin Yuan Dian Xin.
- **Merit bar — measured then HELD/DROPPED (in CREATORS_USG3 rejected[]):** HELD for a 2nd credible source:
  Charlie's by Rise & Grind, Chu and Co/Chulato, 805 Seafood Kitchen, Suriya Curry House (genuinely in-area
  536A UppSer but only aggregators), Chin Kee 77, Yong Seng Teochew Fishball. DROPPED: Munchi Pancakes
  (Ci Yuan outlet SHUTTERED), Relish by Wild Rocket (myVillage CLOSED), iSTEAKS (chain, 1 credible), Bedok
  Chwee Kueh (Hougang-outlet sourcing thin). Out-of-area (area creep): Sheng Hong Temple (Arumugam Rd),
  Rosyth School & Serangoon Garden Sec (Serangoon North), Lau Wang/Bee Kee/Song Kee (Serangoon Central).
  Held-lead 'Froz-type cafe' resolved as not-present in-area.
- **Sources:** Michelin, SethLui, Eatbook, Daniel Food Diary, Miss Tam Chiak, HungryGoWhere, Her World,
  Women's Weekly, Mothership, AsiaOne, ladyironchef, The Honeycombers, ieatishootipost, Johor Kaki; sights
  on NLB / Roots(NHB) / NParks / PUB / CatholicSG / TheSmartLocal / Remember Singapore / Wikipedia.
  **Yelp/TripAdvisor/Google/Burpple/OpenRice/Foursquare/Lemon8/TikTok = 0** (existence/status only). SEO/
  aggregator/personal (kopitiam.com.sg, hawkerpedia, foodadvisor, wanderlog, evendo, thefat.guide,
  sengkangtopunggol, ahmaqqbowl, tidbitsmag, therantingpanda, sgfoodonfoot, ivanteh-runningman) rejected.
  **NO coordinates** (full address + S-postal only; Fatto Catto 15 Simon Rd & Lorong Halus/Buangkok/Kangkar
  postals flagged 'to confirm' at the geocode stage). No fabrication; closures among added places = 0.
- **NEXT (shared with waves 1-2):** geo-merge FOOD_USG(+2+3)/SIGHTS_USG(+2+3) -> geocode + location-verify
  each new place (Google !3d!4d / OneMap / Wikipedia coords) -> statuscheck (RE-CONFIRM the Munchi Ci Yuan &
  Relish myVillage closures; Kovan Scrambled Egg Rice relocation to Blk 335 Ave 7) -> register USG as a
  Singapore town (region->folder) -> rebuild-city -> gates (sourcecheck/geocheck/statuscheck). HELD single-
  credible leads above await a 2nd source for any wave 4.
