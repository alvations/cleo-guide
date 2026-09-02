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
