# What are we missing? Strategy, product and market SWOT (2026-10)

> **Status:** a research proposal for the owner. **Nothing here ships.** This folder adds files only. No
> live page, engine, builder, dataset or registry was touched.
>
> **Scope:** strategy, product and market. The UI/UX teardown of competitors is a parallel session's job
> (`design/research-2026-10/ux-competitive/`), and the visual proposal already exists in
> [`design/ux-2026-10/`](../../ux-2026-10/README.md). This document links to both rather than repeating them.
>
> **Method:** we inspected our own product from the repo (datasets, pages, registries, QA). For the market,
> **WebSearch was the only web channel**, because WebFetch and direct fetches are blocked by the org egress
> policy. That came to about 120 searches across 32 competitors, plus market and platform facts.
> - Every external claim links to its source. All 365 URLs are in [`sources.md`](sources.md).
> - The full per-competitor notes are in [`notes/`](notes/).
> - Figures that come from search snippets and that the notes mark *secondary* or *unverified* say so here too.
>
> **Date:** 2026-10-10.

**The owner's brief:** *"Airbnb Experiences meets a hotel butler meets your local tour guide who shares your interests."*
That means history and landmarks × foodie × pop culture, luxury yet fun, and wanderlust-driven.

---

## Contents

1. [Executive summary](#1-executive-summary)
2. [Our product today](#2-our-product-today--a-factual-inventory)
3. [Competitive landscape](#3-competitive-landscape)
4. [SWOT](#4-swot)
5. [Gap analysis](#5-gap-analysis--ranked)
6. [Opportunities and differentiators](#6-opportunities--differentiators)
7. [Risks and threats](#7-risks--threats)
8. [Recommended roadmap](#8-recommended-roadmap--now--next--later)
9. [Open questions for the owner](#9-open-questions-for-the-owner)
10. [Reproduce](#10-reproduce)

---

## 1. Executive summary

**The asset is real and rare.** We have **8,264 places on 83 map pages** across 6 live countries. Every
place has two or more credible sources, a pin from a sourced registry and an open/closed check. In our
research, **no competitor publishes per-place source attribution together with verified coordinates and
dated closure status.** The editors rely on brand and headcount, the marketplaces on reviews, and the AI
planners on synthesis.
- Even so, the product today is a **reference atlas, not a butler.** It does not know who you are.
- It shows no pictures.
- It can't tell you whether a place is open tonight or what it costs, and it can't book it.
- You can't easily share it or find it from a search engine.

### The 5 most important things we're missing

| # | Missing | Why it matters (evidence) |
|---|---|---|
| 1 | **A guide who knows you.** We have no interest profile, no "for you" ordering and no day plans. The trip list is a flat set of saved IDs. | This is the heart of the brief ("shares your interests"). Every leader now personalises: GetYourGuide added personalised search in 2026 ([Skift](https://skift.com/2026/04/22/getyourguide-ai-updates/)), Expedia's Romie learns preferences ([BGR](https://bgr.com/tech/expedias-romie-wants-to-be-your-ai-travel-agent/)), and Google's Ask Maps answers in conversation ([Techloy](https://www.techloy.com/google-maps-launches-ask-maps-and-immersive-navigation-both-powered-by-gemini/)). The concierge and "A day with your guide" are already prototyped in `design/ux-2026-10`. They need to become product. |
| 2 | **Wanderlust imagery.** The site has **0 place images** (QA: the only raster is an OG cover in `beta/`). | Every experiences, OTA and editorial leader leads with photos. A no-photo guide can't sell "luxury" or "wanderlust". The honest route is licensed imagery: Wikimedia Commons with credits (title, author, source, licence), never scraped or AI-generated ([Commons reuse](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia), [CC best practice](https://wiki.creativecommons.org/Best_practices_for_attribution)). |
| 3 | **"Can I go now?" facts.** We record no opening hours, no price level and no reservation or booking path. The data schema has none of these fields ([`docs/DATA-SCHEMA.md`](../../../docs/DATA-SCHEMA.md)). | AI planners fail exactly here. In one test, 52% of ChatGPT itineraries scheduled visits outside opening hours and about 25% included a closed venue ([Travolution](https://travolution.com/news/marketing/survey-finds-chatgpt-itineraries-to-be-riddled-with-inaccuracies)), and Gemini missed seasonal hours ([WSJ test](https://letsdatascience.com/news/travel-writer-tests-gemini-travel-itinerary-3be9b23e)). Sourced, dated practical facts would extend our trust edge into the moment of decision. |
| 4 | **Discoverability and shareability.** We have no per-place URL (no hash or deep link in the engine), no schema.org structured data, no per-city social card, no newsletter and no analytics. | Google clicks are shrinking: people click a result 8% of the time when an AI summary shows, against 15% without ([Pew](https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/markdown)), and The Planet D shut after a 90% traffic drop ([NPR](https://www.npr.org/2025/07/31/nx-s1-5484118/google-ai-overview-online-publishers)). To be found we must be **linkable, citable and machine-readable**, and spread by people sharing a pick. |
| 5 | **An in-destination, phone-first mode.** We have no PWA or offline cache, no "open near me now", and the mobile UI is hard to use: 98% of controls are under 44 px, the first place sits 4.9 screens down on Tokyo, and pages overflow sideways ([UX audit](../../ux-2026-10/README.md#2-audit-of-the-current-site)). The UI is English-only. | Experiences are booked late and on the spot: 38% are booked on the day or up to two days before ([Viator/Trekksoft](https://operatorresources.viator.com/in-destination-bookers-cutoff-time-hours-in-advance/)), and mobile bookers spend almost 50% more ([Arival](https://v2.arival.travel/?p=50921)). Japan had 42.68M visitors in 2025 ([Nissyoku](https://news.nissyoku.co.jp/news/yokotah20260121074409551)), and many read Chinese or Korean, not English. |

### The 3 strengths to double down on

1. **"Every pick is sourced" is a trust brand nobody else holds.**
   - **Our side:** 2,191 registered sources plus 126 creators, and a gate requiring two or more credible sources per place (a lone Michelin or James Beard citation is allowed; Yelp counts for zero).
   - **The alternatives are weak on trust.** Tripadvisor stopped 2.7M fake reviews in 2024, about 8% of submissions ([Hospitality Net](https://www.hospitalitynet.org/news/4126305/tripadvisors-2025-transparency-report-reveals-strong-review-submissions-and-improved-fraud-detection)). Google removed 292M in 2025 ([SER](https://www.seroundtable.com/google-maps-spam-fighting-2025-41176.html)). Tabelog fought an algorithm lawsuit through district court, appeal and, reportedly, the Supreme Court ([Jones Day](https://www.jonesday.com/en/insights/2022/06/algorithm-change-violates-japanese-antitrust-law)).
2. **Verified pins and closure honesty.**
   - **Our side:** 10,543 geocode entries, each with a source, a confidence grade and a status date. 140 are flagged closed and kept. 2,032 pins graded UNVERIFIED are held off the map rather than guessed.
   - **The alternatives get this wrong.** AI tools invent closures ([Anna Mae's Bakery](https://ppc.land/google-ai-overview-forces-anna-maes-bakery-to-deny-fake-july-31-closing/)) and send tourists to places that don't exist ([OECD AI incident](https://oecd.ai/en/incidents/2025-09-29-8b4f)). Our audit trail is the antidote, so we should say so on every page.
3. **The interest triad, rooted in what is unique to each city: landmarks × city-signature food × pop culture.**
   - **Our side:** food and drink is about 50% of places (4,137 of 8,264). Japan has about 103 ★ anime and pop-culture records across 5 maps.
   - **The market for the pop-culture layer is fragmented.** The pilgrimage tools are Japanese-first or Chinese-run: Butaimeguri, the Anime Tourism 88 list, Anitabi and Seichi Map ([notes B §13](notes/B-editorial-japan-anime.md#13-anime-pilgrimage-seichi-junrei-tools)).
   - **Demand is growing:** the share of visitors to Japan who went to film or anime sites rose from 4.6% (2019) to 7.5% (2023) ([Travel Tomorrow](https://traveltomorrow.com/anime-tourism-boom-drives-travel-demand-across-asia-trip-com-data-shows/), secondary).
   - **Nobody else combines all three** with verification.

**One-line strategy:** move **right** on the positioning map, from "reference" towards "plans my day",
**without moving down** from cited trust into crowd reviews or synthesis. Become the **verified layer
that AI and people cite.**

---

## 2. Our product today — a factual inventory

All numbers come from the repo on 2026-10-10. The script is [`notes/count-places.js`](notes/count-places.js) (it parses the `P`/`F` arrays of every
engine page) together with `data/geocodes.json`, `data/sources.json` and `data/countries.json`.

| Dimension | Fact |
|---|---|
| Live countries | 6 in `data/countries.json`: US, Singapore, Vietnam, Germany, Belgium, Japan. Malaysia, Thailand, Indonesia, the Philippines and Indochina are set `live:false`. |
| Pages with place data | **83**: `cleveland.html` + 32 `cities/*.html` + 47 Singapore + 3 Vietnam. 160 HTML pages in total, counting hubs, the `beta/` mirror and `versions/` ([QA](../../../docs/QA-2026-10-03.md)). |
| Places on pages | **8,264**: 4,127 sights and 4,137 food and drink. Engine cities: 3,841 + 3,603. Singapore: 178 + 465. Vietnam: 108 + 69. |
| Largest maps | Tokyo 488 · New York 508 · Okinawa 425 · Hokkaido 412 · Kyoto 398 · San Francisco 396 · Orlando 387 · Osaka 369 · Chicago 367 · Philadelphia 363 |
| Thin pages | 13 Singapore and SEA pages have **0 food** entries ([QA D3](../../../docs/QA-2026-10-03.md)). Several Singapore towns have fewer than 10 places, and Wheeling has 35. |
| Japan pop-culture layer | ★ "Anime & pop culture" records: Tokyo 22 · Osaka 25 · Kyoto 8 · Hokkaido 29 · Okinawa 19 (**about 103**) |
| Sources registry | **2,191 sources and 126 creators** across 31 city entries, plus 9 national creators (`data/sources.json`) |
| Geocode registry | **10,543 entries** over 35 cities. Confidence: high 5,937 · med 2,337 · low 237 · UNVERIFIED 2,032 (held off the map). Status: open 10,288 · **closed 140** (kept and flagged) · unknown 102 · unchecked 10 · missing 2. |
| Closed places on pages | 57 records whose names carry "— CLOSED" |
| Gates | `--sourcecheck`, `--geocheck`, `--statuscheck` and `--validate` ([`docs/PIPELINE.md`](../../../docs/PIPELINE.md)). Build-, test- and commit-time guards stop key-required map tiles from shipping (CLAUDE.md rule 4-ai). |
| Engine features | **Search and filters:** search; filters by area, source, rank tier, collection and cuisine; Sights ↔ Food mode; presets (must-see, most-sourced); "been there". |
| | **Trip list:** stored in `localStorage`, exports to **KML / JSON / Google Maps**, plus "save this whole guide to your device". Geolocation is wired in the engine. |
| | **Resilience:** content renders without the CDN (rule 4), and maps use only OSM and Esri tiles. |
| **Not present** | No accounts, no backend, no photos, no opening hours, no price level, no booking or affiliate links, no reservations, no per-place URL, no schema.org JSON-LD, no `og:image` or Twitter card on city pages, no PWA manifest or service worker, no notifications, no AI concierge, no reviews. The UI language is `lang="en"` everywhere; native names such as 東京 appear in data, and Brussels carries FR+NL names. |
| Quality (QA 2026-10-03) | All 480 loads have no FAILs. All 145 maps mount. The WARNs are design-level: 28 px chips and 9.5–10.5 px labels. The UX audit found 1,149 of 1,169 Tokyo controls under 44 px and **4.9 screens to the first place** on mobile ([UX README](../../ux-2026-10/README.md)). |
| Hosting | GitHub Pages, about 65 MB of site (excluding `.git` and `node_modules`), against a 1 GB site limit and a 100 GB/month soft bandwidth limit ([GitHub docs](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)) |
| Who builds it | 277 commits since 2026-09-01, of which **276 are agent commits** and 1 is the owner's (`git log`). Research runs through sequential WebSearch waves. |
| Business model | **None.** No revenue, no affiliate links, no ads. The hub "suggest a city" box files GitHub issues. |
| Measurement | **No visitor analytics**, so we can't say today how many people use it or which pages they use. |

---

## 3. Competitive landscape

We profiled 32 products in [`notes/`](notes/). For each one the notes cover positioning, audience, business model, features, trust model,
freshness, personalisation, distribution and weaknesses, with citations. The condensed view follows.

### 3.1 Positioning map

The map plots two dimensions:
- **Y axis, trust basis:** what the user is asked to believe.
- **X axis, job:** whether the product inspires and informs, or transacts.

```
                         TRUST = CITED / INSTITUTIONAL / NAMED EDITORS
                                         ▲
         ★ cleo-guide (per-place,        │
           multi-source, dated pins)     │                    Michelin (Keys → hotel booking 10–15%)
                                         │
   Anime Tourism 88 (official list)      │
   Eater · The Infatuation · Time Out    │        Hotel loyalty: Marriott Moments,
   Condé Nast Traveler · Lonely Planet   │        Hilton Experiences, Hyatt FIND
   Japan Guide · Apple Maps Guides       │        (brand-curated, points)
                                         │
   Spotted by Locals                     │   ┌─────────────────────────┐
   Atlas Obscura (crowd → editors) ──────┼──►│   WHITE SPACE:          │
   Tokyo Cheapo (affiliate)              │   │ cited trust + personal  │  Airbnb Experiences
                                         │   │ planning + honest links │  (vetted + reviews; now
 INSPIRE / ─────────────────────────────┼───└─────────────────────────┘─ sells Viator stock) ─► TRANSACT /
 INFORM          AI planners: Mindtrip · Layla(→Expedia) · Gemini · ChatGPT · Perplexity        BOOK
                 (synthesised — trust = "the model"; cite sometimes; hallucinate)
                                         │
   Google Maps (reviews + Gemini         │        GetYourGuide · Viator/Tripadvisor · Klook
   summaries) · Tabelog (weighted        │        KKday · Headout
   crowd score) · Anitabi (crowd pins)   │        Booking.com · Agoda · Expedia
   Wanderlog (user guides)               │
                                         ▼
                         TRUST = CROWD REVIEWS / ALGORITHMIC SCORES
```

**What the map shows:**
- **Upper left (cited, inspiring):** the editors live here. They are getting thinner. Eater laid off a third of its union jobs and left some city sites with no staff ([Boston Globe](https://www.bostonglobe.com/2025/08/14/business/eater-layoffs-food-journalism-future)). Time Out's media revenue fell 26%, which it partly blamed on AI search ([HL](https://www.hl.co.uk/shares/stock-market-news/company--news/archive/time-out-takes-action-to-improve-profitability-as-earnings-slump)). Atlas Obscura reached its first profit only after cuts ([Adweek](https://www.adweek.com/media/atlas-obscura-first-annual-profit/)).
- **Lower right (crowd, transacting):** the marketplaces live here. Their stock is syndicated everywhere: Viator supplies Booking.com and now Airbnb ([Skift](https://skift.com/2026/08/11/airbnb-partners-with-tripadvisor-experiences-drops-build-your-own-strategy/)). They compete on price and on review volume.
- **Centre (synthesised):** the AI planners sit here, and they are spreading fastest. Layla is now owned by Expedia ([Expedia IR](https://ir.expediagroup.com/news-and-events/news/news-details/2026/Expedia-Group-acquires-Layla-accelerating-its-AI-powered-trip-planning-and-booking-strategy/default.aspx)). Booking.com and Expedia have apps inside ChatGPT ([PhocusWire](https://www.phocuswire.com/openai-chatgpt-apps-expedia-booking-tripadvisor)).
- **The white space** is the upper middle: trust you can audit, plus a plan made for you, plus honest next-step links. Nobody holds it. The closest are Michelin (institutional, but only high-end and pay-to-play, per the [Boston Globe](https://bostonglobe.com/2025/05/15/business/michelin-guide-star-tourism-boston-restaurants/)) and Apple Maps Guides (publisher-curated but thin outside the US, per [Justin O'Beirne](https://justinobeirne.com/wwdc-2020-one-year-later)).

### 3.2 Competitor profiles (condensed)

| Competitor | Positioning · audience | Business model | Trust model | Freshness | Personalisation | Distribution | Known weakness (cited) |
|---|---|---|---|---|---|---|---|
| **Airbnb Experiences** | Relaunched May 2025 with Services, in about 650 cities ([AltexSoft](https://www.altexsoft.com/travel-industry-news/airbnb-relaunches-experiences-and-adds-services-will-travelers-care-this-time/)) | About 20% host fee on experiences ([Boostly](https://boostly.co.uk/how-much-does-airbnb-charge-hosts/)) | Airbnb vetting plus reviews | Hosts update listings | Cross-sold in the lodging app | 1st-party app base | Dropped "build your own" supply and now sells Viator stock ([Skift](https://skift.com/2026/08/11/airbnb-partners-with-tripadvisor-experiences-drops-build-your-own-strategy/)) |
| **GetYourGuide** | Largest independent experiences marketplace; >€1B revenue and 33M bookings in 2025 ([StreetInsider](https://www.streetinsider.com/Press+Releases/GetYourGuide+Appoints+Rob+Rekrutiak+as+Chief+Product+Officer/26087170.html)) | Operator commission; affiliates about 8% (3rd-party) ([UpPromote](https://uppromote.com/affiliate-directory/getyourguide/)) | Verified-booker reviews plus AI summaries | Supplier AI tools | Personalised search (2026) | SEO, affiliates, 10k creators | Favoured its own Originals in search ([Skift](https://skift.com/2020/11/04/ceo-of-getyourguide-concedes-it-had-its-own-google-like-bias-issue/)) |
| **Viator / Tripadvisor** | Pivoting to experiences: $924M revenue and 22.9M bookings in 2025 ([PhocusWire](https://www.phocuswire.com/tripadvisor-q4-2025-earnings)) | 20–30% commission; affiliates 4% ([Awin](https://ui.awin.com/merchant-profile/11018)) | About 1B reviews | UGC stream | AI trip builder | SEO (falling); apps in ChatGPT and Claude | 2.7M fake reviews stopped in one year; "free cancellation" claims ([TINA](https://truthinadvertising.org/articles/viators-free-cancellation-claims/)) |
| **Klook** | APAC experiences, 310k offerings ([IPO Scoop](https://www.iposcoop.com/the-ipo-buzz-klook-klk-proposed-files-to-go-public-as-shutdown-nears-end/)) | Commission; affiliates 2–20% by category | Reviews | Supplier-led | ? | KOL promo codes | $99M loss in 2024; refund runarounds ([Renaissance](https://www.renaissancecapital.com/IPO-Center/News/114835/Pan-Asian-travel-booking-platform-Klook-Technology-files-for-an-estimated-$)) |
| **KKday** | Taiwan-based experiences plus Rezio SaaS | Commission plus SaaS | Reviews | Supplier-led | ? | SEO and social | Cut 15% of staff and blamed travellers moving to AI and social ([LTN](https://ec.ltn.com.tw/article/paper/1713362)) |
| **Headout** | City tickets; $130M revenue in 2024 ([CB Insights](https://www.cbinsights.com/company/headout)) | Commission | Reviews | Supplier-led | ? | SEO | Mark-ups and posing as an official seller ([Rick Steves forum](https://community.ricksteves.com/travel-forum/tourist-scams/scammed-by-headout)) |
| **Atlas Obscura** | "Hidden wonders"; 33k+ places | Ads, trips, $8/month membership ([AO](https://join.atlasobscura.com/membership)) | Crowd submissions, edited by staff | Community additions | Saved lists | SEO, newsletter, books | Layoffs and co-founders pushed out ([Semafor](https://www.semafor.com/article/12/04/2025/staff-cuts-and-strategy-squabbles-split-atlas-obscura-leadership)); no open/closed process found |
| **Time Out** | City "best of" plus food halls | Ads plus Markets | Staff editors | Daily editorial | — | SEO, social, physical markets | Media revenue down 26%; Chicago and Boston Markets closed ([Restaurant Business](https://www.restaurantbusinessonline.com/operations/time-out-markets-are-closing-chicago-boston)) |
| **Eater** | Editor-curated restaurant maps (Essential 38, Heatmap) | Ads, affiliate, reservation links | Critics | Periodic refreshes | — | SEO; Penske/PMX since 2026 ([Variety](https://au.variety.com/2026/biz/news/pmc-vox-media-ryan-pauley-verge-eater-37803/)) | City sites with no staff after layoffs |
| **The Infatuation** | Casual-voice restaurant guide, owned by JPMorgan Chase | Card-perk value: curates Sapphire "Exclusive Tables" ([Infatuation](https://www.theinfatuation.com/sapphire-reserve-exclusive-tables)) | Critics (plus Zagat) | Hit Lists | Filters and saved lists | SEO, Instagram, Chase | Conflict-of-interest risk (our inference; no published critique found) |
| **Michelin Guide** | The institutional gold standard; Keys for 2,457 hotels ([Malay Mail](https://www.malaymail.com/news/money/mediaoutreach/2025/10/09/malaysia-joins-the-michelin-guides-global-hotel-excellence-with-michelin-key-distinctions/417160)) | Tourism-board deals ($0.6–2.7M); 10–15% hotel commission ([HANYC](https://hanyc.org/the-washington-post-michelin-guide-to-add-hotel-key-ratings-in-2024/)) | Anonymous inspectors | Annual | App filters | Brand, PR, Apple Maps | Pay-to-play criticism; skews high-end ([Axios](https://www.axios.com/local/washington-dc/2025/04/14/michelin-guide-dc-star-restaurants-virginia-declines?stream=top)) |
| **Culture Trip** | Millennial culture travel, pivoted from media to hotels to tours | Ads, then bookings | Freelance SEO volume | High volume | — | SEO | Sold to U.S. News after raising about $155M ([Skift](https://skift.com/2024/02/29/culture-trips-final-pivot-sells-to-u-s-news-after-raising-155-million/amp/)): **the cautionary tale** |
| **Lonely Planet** | Legacy guidebooks going digital-first (Red Ventures) | Books, affiliate, Journeys trips | Commissioned authors | Slow print cycles | AI assistant over its own guides | Brand, SEO | Editorial cuts after the sale ([Bookseller](https://www.thebookseller.com/news/job-losses-lonely-planet)); exit from China ([Sixth Tone](https://www.sixthtone.com/news/1015405/Lonely%20Planet%20Reaches%20the%20End%20of%20the%20Road%20in%20China)) |
| **Spotted by Locals** | Spots written by vetted residents in 85 cities | Paid app: $3.99 per city or $4.99/month ([App Store](https://apps.apple.com/app/id470967003)) | Named local individuals | Spotter updates | Favourites | App stores | Small scale and a paywall (inferred) |
| **Condé Nast Traveler** | Luxury magazine: Gold List, Readers' Choice | Ads, affiliate commerce | Editors plus reader votes | Annual lists | — | Brand, social | Condé cut about 5% of staff as social traffic fell ([TheWrap](https://thewrap.com/conde-nast-cuts-5-percent-workforce)) |
| **Booking.com** | Largest OTA, "connected trip" with 150k attractions added via FareHarbor ([Skift](https://skift.com/2025/09/29/booking-com-to-add-150000-attractions-with-fareharbor-tie-in/)) | Commission; Genius loyalty; affiliates 4% on attractions | Verified-stay reviews | Partner feeds | AI Trip Planner, Smart Filter | Paid search, ChatGPT app | Fake listings went live with no ID check ([Which?](https://www.which.co.uk/policy-and-insight/article/lack-of-proper-checks-is-leaving-booking.com-wide-open-to-scammers-which-warns-arv5l3b8k7t6)) |
| **Agoda** | Asia OTA plus activities | Commission; affiliates 4–7% | Reviews | Feeds | Gemini planner pilot | Paid search | Fined in South Korea for hidden fees ([Korea Times](https://www.koreatimes.co.kr/amp/business/companies/20260707/agoda-fined-17-mil-for-hidden-fees-obscure-refund-policies)) |
| **Expedia** | OTA; One Key loyalty; bought Layla | Commission, loyalty, B2B | Reviews | Feeds | Romie | Paid search, ChatGPT, Comet | One Key devaluation backlash ([Frequent Miler](https://frequentmiler.com/expedia-one-key-devaluation-one-percent/)) |
| **Marriott Bonvoy** | Moments: points-auctioned experiences for about 283M members | Loyalty | Brand-curated | Drops | Ask Bonvoy AI (2026) ([Hotel Dive](https://www.hoteldive.com/news/marriott-debuts-ai-powered-hotel-search-tool-ask-bonvoy/823130/)) | App | Opaque dynamic award pricing ([VFTW](https://viewfromthewing.com/marriott-dynamic-award-pricing-devaluation-starts-march-29-will-be-worse-in-2023/)) |
| **Hilton Honors** | Experiences auctions (GRAMMYs, F1) | Loyalty | Brand-curated | Drops | AI Planner coming to the app ([Skift](https://skift.com/2026/06/03/hiltons-cio-building-the-ai-trip-planner-and-grappling-with-tokenomics/)) | App, AI Mode, Claude connector | Auctions exclude most members |
| **World of Hyatt** | FIND: about 150 wellbeing experiences | Loyalty | Curated | Small catalogue | — | App | Award prices up as much as 67% in 2026 ([Milelion](https://milelion.com/2026/02/26/world-of-hyatt-revises-award-charts-with-up-to-67-price-increases/)) |
| **Google Maps** | The default local layer, now Ask Maps (Gemini) | Ads (local) | Crowd reviews plus Gemini summaries | ML-predicted hours, changed silently ([Inc](https://www.inc.com/anna-meyer/google-artificial-intelligence-business-hours.html)) | Saved and history signals; thumbs up/down | Preinstalled | Invented closures ([PinMeTo](https://www.pinmeto.com/news/google-ai-overview-false-closure-location-accuracy-2026/)); "falls flat off the beaten path" |
| **Apple Maps Guides** | Publisher guides; Michelin, Infatuation and Time Out in Maps ([9to5Mac](https://9to5mac.com/2025/05/14/apple-maps-now-highlights-expert-ratings/)) | Platform value | Publisher brands | Saved guides update automatically | Minimal | iOS only | Thin outside the US ([O'Beirne](https://justinobeirne.com/wwdc-2020-one-year-later)) |
| **Wanderlog** | Collaborative itinerary planner | Freemium; Pro about $40/yr ([PilotPlans](https://www.pilotplans.com/compare/wanderlog-alternative-feature-comparison)) | User guides plus place data | User-driven | User-driven | App stores | Trustpilot 2/5; content "without validation" ([Trustpilot](https://www.trustpilot.com/review/wanderlog.com?page=2)) |
| **Mindtrip** | AI planner; investment from Capital One and United ([PhocusWire](https://www.phocuswire.com/mindtrip-ai-travel-planning-capital-one-ventures-united-airlines-ventures)) | 35+ DMO deals, bookings, creators | AI plus links | Model plus feeds | High | "Start Anywhere" from TikTok/YouTube | AI planners "make things up" ([Stoltz](https://craigstoltz.substack.com/p/four-ai-travel-planning-programs)) |
| **Layla** | AI travel agent, owned by Expedia since Jul 2026 | Booking plus subscription | AI | Model | High | Expedia | "Disappointing despite requiring a subscription" ([TechRadar](https://www.techradar.com/computing/artificial-intelligence/can-an-ai-travel-agent-remove-the-stress-of-vacation-booking-i-tried-three-to-find-out)) |
| **Gemini / AI Mode** | Canvas trip plans; agentic restaurant booking ([Google](https://blog.google/products-and-platforms/products/search/agentic-plans-booking-travel-canvas-ai-mode/)) | Ads, platform | Grounded in Google data | Live data | Gmail-aware | Search, Android | Missed seasonal hours ([WSJ test](https://letsdatascience.com/news/travel-writer-tests-gemini-travel-itinerary-3be9b23e)) |
| **ChatGPT** | Apps SDK (Expedia, Booking, Tripadvisor); agent mode | Subscription, partners | Model plus app data | Varies | Memory | About 800M users ([Skift](https://skift.com/2025/12/18/chatgpt-openai-opens-apps-developers)) | 90% of itineraries had an error; a non-existent "Sacred Canyon" ([Travolution](https://travolution.com/news/marketing/survey-finds-chatgpt-itineraries-to-be-riddled-with-inaccuracies), [OECD](https://oecd.ai/en/incidents/2025-09-29-8b4f)) |
| **Japan Guide** | English Japan reference since 1996; small staff who visit firsthand ([Gov-Online](https://www.gov-online.go.jp/eng/publicity/book/hlj/html/201410/201410_06_en.html)) | Ads, destination promotion | Firsthand staff | Seasonal reports | — | SEO, forum | Mainstream circuit only; no per-place sources (inferred) |
| **Tabelog** | Japan's restaurant authority: about 100M monthly users and 890k venues ([BusinessWire](https://www.businesswire.com/news/home/20251221963753/en)) | Restaurant fees, reservations, premium tier | Weighted crowd score | Constant UGC | Premium sorting | SEO, Japanese-first | Paid-review agents (2012) and algorithm litigation ([Asiajin](https://asiajin.com/blog/2012/01/tabelog-japans-yelp-reportedly-tainted-by-undercover-positive-review-agents/)) |
| **Tokyo Cheapo** | Budget Japan guides; 500–800k readers a month (company claim) ([about](https://tokyocheapo.com/about/)) | Affiliate (tours, eSIM, rail) | Staff writers | Ongoing | — | IG, YouTube, TikTok; multilingual | Pull towards affiliate income (inferred) |
| **Anime pilgrimage tools** | Butaimeguri (Sony group, AR) · Anime Tourism 88 (100 titles in 2026) ([Sakigake](https://www.sakigake.jp/news/article/20260616PR0037/)) · Anitabi (crowd, CC BY-NC-SA) ([App Store](https://apps.apple.com/app/id6745898838)) | Tie-ups, municipalities | Official (88) or crowd (Anitabi) | Annual or crowd | — | Japanese/Chinese-first | Fragmented; overtourism friction at Kamakura ([Unseen Japan](https://unseen-japan.com/kamakura-tourists-vandalism-urination/)) |

### 3.3 Feature matrix — us vs 32 competitors

**How to read it:**
- **Key:** ● = has it · ◐ = partial or limited · ○ = absent · ? = not verified.
- **Our row** is from the repo.
- **Competitor rows** combine the cited notes with each product's widely known public features as of October 2026. A ? marks a cell we could not verify. Treat the matrix as directional, not audited.

**A. Discovery and planning**

| Product | Search | Filters | Personalisation | Itineraries | Saved lists | Accounts | Reviews/UGC | Photos | Booking/affiliate | Opening hours | Price level |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **cleo-guide** | ● | ● | ○ | ◐ trip list + export | ◐ local only | ○ | ○ by design | ○ | ○ | ○ | ○ |
| Airbnb Experiences | ● | ● | ◐ | ○ | ● | ● | ● | ● | ● | ● slots | ● |
| GetYourGuide | ● | ● | ● | ○ | ● | ● | ● | ● | ● | ● | ● |
| Viator / Tripadvisor | ● | ● | ◐ | ● AI builder | ● | ● | ● | ● | ● | ● | ● |
| Klook | ● | ● | ? | ○ | ● | ● | ● | ● | ● | ● | ● |
| KKday | ● | ● | ? | ○ | ● | ● | ● | ● | ● | ● | ● |
| Headout | ● | ● | ? | ○ | ◐ | ● | ● | ● | ● | ● | ● |
| Atlas Obscura | ● | ◐ | ○ | ◐ trips | ● | ● | ◐ | ● | ◐ trips | ○ | ○ |
| Time Out | ● | ◐ | ○ | ○ | ○ | ◐ | ○ | ● | ◐ offers | ◐ | ◐ |
| Eater | ● | ◐ | ○ | ○ | ● app | ◐ | ○ | ● | ◐ reserve links | ◐ | ● |
| The Infatuation | ● | ● | ○ | ○ | ● | ● | ◐ Zagat | ● | ◐ via Chase/Resy | ◐ | ● |
| Michelin Guide | ● | ● | ◐ | ○ | ● | ● | ○ | ● | ● hotels | ◐ | ● |
| Culture Trip | ● | ◐ | ○ | ◐ | ? | ? | ○ | ● | ◐ | ○ | ○ |
| Lonely Planet | ● | ◐ | ◐ AI | ◐ Journeys | ● | ● | ○ | ● | ● | ◐ | ◐ |
| Spotted by Locals | ● | ◐ | ○ | ○ | ● | ● | ○ | ● | ○ | ◐ | ○ |
| Condé Nast Traveler | ● | ○ | ○ | ○ | ○ | ◐ | ◐ votes | ● | ● affiliate | ○ | ◐ |
| Booking.com | ● | ● | ● | ◐ AI planner | ● | ● | ● | ● | ● | ● | ● |
| Agoda | ● | ● | ● | ◐ pilot | ● | ● | ● | ● | ● | ● | ● |
| Expedia | ● | ● | ● | ● Romie | ● | ● | ● | ● | ● | ● | ● |
| Marriott Bonvoy | ● | ● | ● | ○ | ● | ● | ◐ | ● | ● points | ○ | ● |
| Hilton Honors | ● | ● | ● | ◐ AI planner | ● | ● | ◐ | ● | ● points | ○ | ● |
| World of Hyatt | ● | ● | ◐ | ○ | ● | ● | ◐ | ● | ● points | ○ | ● |
| Google Maps | ● | ● | ● | ◐ | ● | ● | ● | ● | ◐ | ● | ● |
| Apple Maps Guides | ● | ◐ | ○ | ○ | ● | ● | ◐ ratings | ● | ◐ | ● | ● |
| Wanderlog | ● | ◐ | ◐ | ● | ● | ● | ◐ | ● | ◐ | ◐ | ◐ |
| Mindtrip | ● | ● | ● | ● | ● | ● | ◐ | ● | ● | ◐ | ● |
| Layla | ● | ◐ | ● | ● | ● | ● | ○ | ● | ● | ◐ | ● |
| Gemini / AI Mode | ● | ◐ | ● | ● | ◐ | ● | ◐ | ● | ● restaurants | ● | ● |
| ChatGPT | ● | ○ | ● | ● | ◐ | ● | ○ | ◐ | ● via apps | ◐ often wrong | ◐ |
| Japan Guide | ● | ◐ | ○ | ● sample itineraries | ○ | ◐ forum | ◐ forum | ● | ◐ | ● | ● |
| Tabelog | ● | ● | ◐ | ○ | ● | ● | ● | ● | ● reservations | ● | ● |
| Tokyo Cheapo | ● | ◐ | ○ | ◐ | ○ | ○ | ○ | ● | ● affiliate | ◐ | ● |
| Anime pilgrimage tools | ● | ◐ by title | ○ | ○ | ◐ | ◐ | ● Anitabi | ● scene comparisons | ○ | ○ | ○ |

**B. Use, reach and trust**

| Product | Reservations | Offline | Multilingual | Sharing | App/PWA | Notifications | AI concierge | Accessibility | Freshness/closures | Source attribution | Pop-culture layer |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **cleo-guide** | ○ | ◐ content without CDN; page save | ◐ native names only | ◐ export, no permalink | ○ | ○ | ○ (prototype) | ◐ (tap targets/contrast WARN) | **● dated status gate** | **● ≥2 sources per place** | **● Japan** |
| Airbnb Experiences | ● | ◐ | ● | ● | ● | ● | ◐ | ● | ◐ host | ○ | ◐ Originals |
| GetYourGuide | ● | ◐ tickets | ● | ● | ● | ● | ◐ | ● | ◐ supplier | ○ | ○ |
| Viator / Tripadvisor | ● | ◐ | ● | ● | ● | ● | ● | ● | ◐ UGC | ○ | ○ |
| Klook | ● | ◐ | ● | ● | ● | ● | ? | ? | ◐ | ○ | ◐ anime tickets |
| KKday | ● | ◐ | ● | ● | ● | ● | ? | ? | ◐ | ○ | ◐ |
| Headout | ● | ◐ | ● | ● | ● | ● | ? | ? | ◐ | ○ | ○ |
| Atlas Obscura | ◐ trips | ○ | ○ | ● | ● | ◐ | ○ | ? | ◐ | ◐ contributor | ◐ oddities |
| Time Out | ○ | ○ | ● editions | ● | ◐ | ◐ | ○ | ? | ● editorial | ◐ byline | ◐ events |
| Eater | ◐ | ○ | ○ | ● | ● | ◐ | ○ | ? | ◐ shrinking staff | ◐ byline | ○ |
| The Infatuation | ● | ○ | ○ | ● | ● | ● | ○ | ? | ◐ | ◐ byline | ○ |
| Michelin Guide | ● | ○ | ● | ● | ● | ● | ○ | ? | ◐ annual | ● institution | ○ |
| Culture Trip | ○ | ○ | ◐ | ● | ◐ | ? | ○ | ? | ○ | ◐ byline | ○ |
| Lonely Planet | ◐ | ◐ | ◐ | ● | ● | ? | ◐ | ? | ◐ | ◐ author | ○ |
| Spotted by Locals | ○ | ● | ○ | ◐ | ● | ? | ○ | ? | ◐ | ● named local | ○ |
| Condé Nast Traveler | ○ | ○ | ● editions | ● | ◐ | ○ | ○ | ? | ◐ annual | ◐ byline | ○ |
| Booking.com | ● | ◐ | ● | ● | ● | ● | ● | ● | ● feeds | ○ | ○ |
| Agoda | ● | ◐ | ● | ● | ● | ● | ● | ? | ● feeds | ○ | ○ |
| Expedia | ● | ◐ | ● | ● | ● | ● | ● | ● | ● feeds | ○ | ○ |
| Marriott Bonvoy | ● | ◐ | ● | ◐ | ● | ● | ● Ask Bonvoy | ● | ◐ | ○ | ◐ events |
| Hilton Honors | ● | ◐ | ● | ◐ | ● | ● | ● | ● | ◐ | ○ | ◐ events |
| World of Hyatt | ● | ◐ | ● | ◐ | ● | ● | ○ | ● | ◐ | ○ | ○ |
| Google Maps | ● | ● | ● | ● | ● | ● | ● Ask Maps | ● | ◐ ML, silent | ◐ aggregate | ○ |
| Apple Maps Guides | ● | ● | ● | ● | ● | ● | ○ | ● | ◐ auto-update | ● publisher | ○ |
| Wanderlog | ◐ import | ● Pro | ◐ | ● | ● | ● | ◐ | ? | ○ | ○ | ○ |
| Mindtrip | ● | ○ | ◐ | ● | ● | ◐ | ● | ? | ◐ | ◐ links | ○ |
| Layla | ● | ○ | ◐ | ● | ● | ? | ● | ? | ◐ | ○ | ○ |
| Gemini / AI Mode | ● | ○ | ● | ● | ● | ◐ | ● | ● | ◐ | ◐ links | ○ |
| ChatGPT | ● agent | ○ | ● | ● | ● | ◐ | ● | ● | ○ closed venues | ◐ sometimes | ○ |
| Japan Guide | ○ | ○ | ○ EN | ● | ○ web | ○ | ○ | ? | ● seasonal | ◐ staff | ◐ |
| Tabelog | ● | ○ | ◐ inbound EN | ● | ● | ● | ○ | ? | ● UGC | ○ crowd score | ○ |
| Tokyo Cheapo | ○ | ○ | ● 5 languages | ● | ○ | ◐ newsletter | ○ | ? | ◐ | ◐ byline | ◐ |
| Anime pilgrimage tools | ○ | ◐ | ◐ JA/ZH | ● | ● | ◐ | ○ | ? | ◐ | ◐ official list | ● |

**Reading the matrix:**
- We are the **only product with ● in all three of freshness/closures, source attribution and pop-culture layer.**
- Our ○ cells cluster in two places:
  - **Planning and personal:** personalisation, accounts, notifications, AI concierge.
  - **Commercial and practical:** photos, hours, price, booking, reservations.
- Some ○ cells are **deliberate and should stay ○**: reviews/UGC, and our own checkout. Others are fixable inside a static site:
  - personalisation, itineraries, photos, hours and price (sourced), sharing and permalinks, PWA and offline, multilingual UI, structured data.

---

## 4. SWOT

### Strengths (internal)

| # | Strength | Evidence |
|---|---|---|
| S1 | **Per-place provenance:** two or more credible sources, each linked to the article | 2,191 sources plus 126 creators in `data/sources.json`. The `--sourcecheck` gate. Engine F3 fix: chips link to the specific article ([QA](../../../docs/QA-2026-10-03.md)). No competitor does this per place (notes B cross-cutting). |
| S2 | **Verified, graded pins with an audit trail** | 10,543 entries in `data/geocodes.json`, each with a source, a confidence grade and a date. Viewport-vs-pin lesson encoded in rule 4b. UNVERIFIED pins are held, not guessed. |
| S3 | **Closure honesty** | 140 closed entries kept and flagged, with a `--statuscheck` gate. Competitors invent closures ([PPC Land](https://ppc.land/google-ai-overview-forces-anna-maes-bakery-to-deny-fake-july-31-closing/)) or recommend closed venues ([Afar](https://www.afar.com/magazine/the-most-common-mistakes-ai-makes-when-planning-travel)). |
| S4 | **City-unique food canon plus a merit bar** | Food is 50% of places (4,137). The "a mention is not merit" rule is in CLAUDE.md. Food discovery starts from each city's signature dishes. |
| S5 | **Pop-culture layer (Japan)** | About 103 ★ records on 5 Japan maps. |
| S6 | **Robust, cheap, fast static delivery** | Median page 71 KB with FCP of about 100 ms. 480/480 QA loads with no FAILs. Renders without the CDN. No hosting cost. |
| S7 | **A reproducible pipeline that agents can extend** | `docs/PIPELINE.md`, plus an AUDIT/RESUME/brief file in each of 36 research directories. About 8k places in about 6 weeks (`git log`). |
| S8 | **Honest editorial conventions** | Stated gaps ("no Persian restaurant meets the bar"), the `ADD`/`FADD` labels and the cuisine-tag rules are all codified in CLAUDE.md. |

### Weaknesses (internal)

| # | Weakness | Evidence |
|---|---|---|
| W1 | **No personalisation or itinerary** | The trip list is a set of IDs (`cle_trip`). The concierge exists only as a prototype ([UX README §4](../../ux-2026-10/README.md#4-recommended-salon--night-out)). |
| W2 | **No imagery** | 0 place images (QA performance section). |
| W3 | **No practical layer** (hours, price, booking) | The data schema has no fields for them. Only free-text `warn` notes ([DATA-SCHEMA](../../../docs/DATA-SCHEMA.md)). |
| W4 | **Not linkable or shareable at place level; not machine-readable** | No hash or permalink, no JSON-LD and no `og:image` on city pages (grep of `cleveland.html` and `cities/tokyo.html`). |
| W5 | **Mobile UX debt** | 4.9 screens to the first place and 81 controls above it on Tokyo. 98% of controls under 44 px. Sideways overflow on 3 pages ([UX audit](../../ux-2026-10/README.md#2-audit-of-the-current-site)). |
| W6 | **Inconsistent depth and thin pages** | 13 SEA pages with no food. Singapore towns with fewer than 10 places. Hub counts drift from page counts (Tokyo 441 vs 488, per the UX audit). Cleveland copy leaks into Tokyo's search placeholder. |
| W7 | **English-only UI** | `lang="en"` on every page. |
| W8 | **No measurement and no business model** | No analytics. No revenue line. |
| W9 | **Single-owner, agent-built** | 276 of 277 commits are agent commits. The WebSearch-only research channel has a shared budget (CLAUDE.md rule 4b). |
| W10 | **Refresh debt grows with every city** | 102 unknown, 10 unchecked and 2,032 UNVERIFIED pins. Closure checks are point-in-time. `docs/CITIES.md` counts were dated 2026-08-18. |

### Opportunities (external)

| # | Opportunity | Evidence |
|---|---|---|
| O1 | **Trust is scarce, and "cited" is an empty position** | Fake reviews at scale: Tripadvisor 2.7M ([NBC](https://www.nbcsandiego.com/news/business/money-report/heres-how-many-fake-reviews-tripadvisor-found-on-its-website-in-2024/3833586/?os=vb)), Google 292M ([SER](https://www.seroundtable.com/google-maps-spam-fighting-2025-41176.html)). AI itinerary errors in 90% of tests ([Travolution](https://travolution.com/news/marketing/survey-finds-chatgpt-itineraries-to-be-riddled-with-inaccuracies)). A peer-reviewed study says hallucinations can't currently be eliminated ([RIUMA](https://riuma.uma.es/entities/publication/fa2391c8-d163-4702-bffa-2e0aa156c052)). |
| O2 | **Editorial incumbents are retreating** | Eater layoffs and city sites with no staff ([WBEZ](https://www.wbez.org/food-drink/2025/08/12/eater-layoffs-15-staffers-chicago-local-journalism)). Time Out media revenue down 26%. Condé Nast down 5% of staff. Culture Trip's exit. |
| O3 | **The anime and pop-culture travel boom, with fragmented tools** | 42.68M visitors to Japan in 2025. Anime-site visits rose from 4.6% to 7.5% (secondary). JNTO is pushing anime for regional dispersal ([JNTO](https://www.japan.travel/en/au/media-releases/japan-s-anime-locations-entice-fans-beyond-the-golden-route/)). Anime Tourism 88 grew to 100 titles ([Koto City](https://www.city.koto.lg.jp/103000/contents_tourism/anime88-2026.html)). |
| O4 | **Experiences is the fastest-growing, least-online travel segment** | $271B in 2025 rising to $342B by 2029. Only 33% of bookings are online ([TravelDailyNews](https://www.traveldailynews.com/statistics-trends/global-experiences-market-projected-to-reach-342bn-by-2029/)). |
| O5 | **Becoming the source AI cites** | AI assistants now host travel apps (Expedia, Booking, Tripadvisor) ([PhocusWire](https://www.phocuswire.com/openai-chatgpt-apps-expedia-booking-tripadvisor)), and ChatGPT referrals to publishers are growing ([PPC Land](https://ppc.land/chatgpt-referrals-surge-as-google-searches-hit-zero-click-records/), secondary). A clean, sourced, machine-readable dataset is the kind of grounding these assistants need. |
| O6 | **Open licensed imagery** | Commons allows commercial reuse with TASL credit ([Commons](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia)). |
| O7 | **Affiliate links exist for honest monetisation** | Viator 4% ([Awin](https://ui.awin.com/merchant-profile/11018)), Booking.com attractions 4%, GetYourGuide about 8%, Klook by category ([Involve Asia](https://involve.asia/?p=36792)). Tokyo Cheapo shows a disclosed-affiliate guide can be sustainable ([about](https://tokyocheapo.com/about/)). |
| O8 | **Destination and creator partnerships** | Mindtrip has 35+ DMO partners ([PhocusWire](https://www.phocuswire.com/mindtrip-ai-travel-planning-capital-one-ventures-united-airlines-ventures)). Michelin's destination deals show cities pay for guide coverage, although we should not copy pay-to-play (see "what NOT to do"). |

### Threats (external)

| # | Threat | Evidence |
|---|---|---|
| T1 | **AI planners make lists a commodity** | Gemini Canvas plus agentic booking ([Google](https://blog.google/products-and-platforms/products/search/agentic-plans-booking-travel-canvas-ai-mode/)). Expedia bought Layla. ChatGPT has about 800M users. |
| T2 | **Zero-click search** | 8% vs 15% click rate (Pew). Tripadvisor expects SEO to drive under 10% of Experiences bookings by end-2026 ([Skift](https://skift.com/2026/02/12/tripadvisor-sees-traffic-decline-from-ai-overviews-considers-strategic-alternatives-again/)). Median travel-blog traffic down 74% ([GetChatAds](https://www.getchatads.com/blog/add-ai-assistant-travel-blog/), secondary). |
| T3 | **Platform-native curated lists** | Apple Maps carries Michelin, Infatuation and Time Out guides inside Maps ([9to5Mac](https://9to5mac.com/2025/05/14/apple-maps-now-highlights-expert-ratings/)). Google lists can be followed. |
| T4 | **Data staleness at scale** | About 10.5k places that each need periodic re-checks. Google itself uses ML for hours and still gets them wrong ([Inc](https://www.inc.com/anna-meyer/google-artificial-intelligence-business-hours.html)). |
| T5 | **Legal and licensing** | Commons share-alike and personality rights ([Commons](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia)). Anime screenshots are copyrighted (Anitabi's rights status is unclear; notes B). Trademarks such as "Michelin" and anime titles used in labels. Scraping ratings is off-limits. |
| T6 | **Bus factor and the research channel** | One owner. Agents depend on WebSearch alone (WebFetch is blocked). |
| T7 | **GitHub Pages limits** | 1 GB site, 100 GB/month soft bandwidth, 10 builds/hour ([docs](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)). Self-hosted photos are the main risk. |
| T8 | **Overtourism backlash at pop-culture sites** | Kamakura's Slam Dunk crossing now has guards and closed restrooms ([JREF](https://jref.com/threads/kamakura-steps-up-safety-measures-on-slam-dunk-site.577711/latest)). |

---

## 5. Gap analysis — ranked

**Scoring:** **Value** (1–5) is what users get, judged by leader parity and the brief. **Effort** (1–5, where 5 is easy) is for a static site
built by agents. **Fit** (1–5) is fit with our constraints:
- a static site with no backend;
- honest attribution;
- no fabricated places, photos or ratings;
- verified pins;
- closures kept and flagged.

The score is Value × Effort × Fit, with a maximum of 125.

| Rank | Gap (what leaders have that we lack) | Leaders with it | Value | Effort | Fit | Score | How to close it within our rules |
|---|---|---|---|---|---|---|---|
| 1 | **Per-place permalinks and sharing** | Everyone | 4 | 5 | 5 | **100** | `#p=<id>` deep links plus a Web Share button. The detail sheet opens from the URL. Uses only data we already have. |
| 2 | **Interest concierge plus "for you" ordering** | GetYourGuide, Expedia, Google, AI planners | 5 | 4 | 5 | **100** | Ship the `design/ux-2026-10` concierge. It reorders and never hides. Interest tags key on collection or cuisine, never on keywords (the Wenwen rule). Stored only in `localStorage` with try/catch. |
| 3 | **Day itineraries** ("A day with your guide") | Viator AI, Mindtrip, Wanderlog, Japan Guide | 5 | 4 | 5 | **100** | Build plans offline from our own records. Label legs as straight-line distances. State the gaps. Export to the existing KML and Google/Apple links. |
| 4 | **Mobile and in-destination usability** | Every app | 5 | 4 | 5 | **100** | Implement the UX roadmap: places first, 44 px targets, no overflow, "Near me" (already wired). |
| 5 | **Structured data plus an open dataset** | Michelin, Tabelog, OTAs (SEO) | 4 | 5 | 5 | **100** | Publish JSON-LD `ItemList` of `TouristAttraction`/`Restaurant` with `geo` and `sameAs` per page, plus a published `places.json` per city. Purpose: machine readability and AI grounding, not rich results, since Google offers no TouristAttraction rich result ([gallery](https://developers.google.com/structured-data/gallery/)). |
| 6 | **Licensed photos** | Everyone | 5 | 3 | 4 | **60** | Use Commons images only, with full TASL credit and a stored licence. Fall back to typographic plates when no licensed image exists. Never AI-generated or scraped images. Lazy-load, and hotlink Commons or keep a small self-hosted set to stay under the GitHub Pages limits. |
| 7 | **PWA and offline per city** | Google Maps, Spotted by Locals, Wanderlog Pro | 4 | 4 | 4 | **64** | Manifest plus a service worker that caches the city page and visited tiles. Content stays renderable without the service worker. Encourage "Add to Home Screen" because of iOS eviction rules ([WebKit](https://webkit.org/?p=14403)). |
| 8 | **Sourced opening hours, price tier and a "reserve/tickets" link** | Google, Tabelog, OTAs, Michelin | 5 | 2 | 4 | **40** | New fields, each with a source and check date, like the geocodes. Link to the place's **official** booking page. A missing value displays as "check before you go", never a guess. Expensive to keep fresh, so start with must-sees and ticketed sights. |
| 9 | **Multilingual UI (JA/ZH/KO first for Japan; FR/NL for Belgium)** | OTAs, Michelin, Tokyo Cheapo | 4 | 3 | 4 | **48** | Translate UI strings and keep place names in native script. Don't machine-translate the `w` prose without review. Add `hreflang`. |
| 10 | **Honest affiliate or booking deep links** | Tokyo Cheapo, CNT, Eater | 3 | 4 | 3 | **36** | Only where a sourced pick already has a bookable product. Disclose on the card. The link never affects ranking. See §6. |
| 11 | **Newsletter, follow a city, "what changed"** | Atlas Obscura, Time Out, Eater | 3 | 3 | 4 | **36** | Generate a static "changelog" per city from the git diff of the dataset (added, closed, moved). An RSS/Atom feed. An email service would be a third party, so it's an owner decision. |
| 12 | **Accounts and cross-device sync** | Everyone | 3 | 1 | 2 | **6** | Not now. Export/import of the JSON list already covers it. Revisit only if usage proves demand. |
| 13 | **Reviews / UGC** | Marketplaces, Google, Tabelog | 2 | 2 | 1 | **4** | **Don't build.** It contradicts the trust model. Use "suggest a correction" via GitHub issues instead. |
| 14 | **In-house booking or checkout** | OTAs | 2 | 1 | 1 | **2** | **Don't build.** |

---

## 6. Opportunities and differentiators

We assessed each candidate against the brief (butler × local guide × experiences) and our constraints.

| Candidate | Verdict | Why · how |
|---|---|---|
| **"Every pick is sourced" as a trust brand** | **Lead with it** | Make it the tagline and a visible mechanic: "Recommended by" on every card, plus a public **methods page** (the gates, the merit bar, closed-kept). Publish a monthly **trust report** with counts (sources, pins re-verified, closures found). That is the honest counterpart to Tripadvisor's transparency report ([Hospitality Net](https://www.hospitalitynet.org/news/4126305/tripadvisors-2025-transparency-report-reveals-strong-review-submissions-and-improved-fraud-detection)). |
| **Anime and pop-culture layer** | **Expand: our sharpest wedge** | Turn the 103 Japan ★ records into a cross-city **"Pilgrim" collection** with English and Chinese labels. Cross-reference the official Anime Tourism 88 list as an institutional source ([Sakigake](https://www.sakigake.jp/news/article/20260616PR0037/)). Then extend pop culture beyond Japan: film and TV locations and music history (Cleveland's Rock Hall, Pittsburgh's film sites). **Never embed anime screenshots.** Link to official sources instead. Add a manners note at sensitive sites (T8). |
| **Closure honesty** | **Productise** | A "last checked" date on every card. A per-city "recently closed" list. A "this moved" note. It is our cleanest contrast with AI planners. |
| **Interest-based concierge** | **Build now** (prototype exists) | The butler half of the brief. It must stay *deterministic over our data*: no free-text LLM answering outside the dataset, because that is how hallucinations get in. |
| **PWA / offline** | **Next** | In-destination use and the wanderlust "save the city" moment. Manage expectations on iOS eviction. |
| **Shareable itineraries** | **Now / Next** | Encode a day plan in the URL hash (IDs only), so there is no backend. Each shared plan is a distribution loop. |
| **Wikimedia-licensed imagery** | **Next, carefully** | Our biggest emotional gap. Store `{file, author, licence, source, modified}` per image and render a credit line on each image and a credits page. Use images only where a licensed image exists. Respect personality rights. Keep the typographic plate as the fallback. |
| **Multilingual (JA/ZH/KO)** | **Next for Japan** | The UI chrome first, which is cheap. Place names are already native. Reviewed translations of the `w` prose come later. |
| **schema.org structured data** | **Now** | Cheap. It helps AI and search *understand* the pages and makes our dataset citable. Don't expect rich snippets ([Google pruning](https://developers.google.com/search/blog/2025/06/simplifying-search-results)). |
| **Affiliate / booking deep links done honestly** | **Later, with rules** | The rules: (1) a link is only ever added *after* a place passes the gates; (2) it never changes rank, tier or inclusion; (3) a visible "affiliate" label; (4) the official site is preferred when it sells direct; (5) a disclosure page. Economics are thin (4–8%), so this is supplementary income, not the model. |
| **Newsletters / creator collabs** | **Later** | We already cite creators (126 in the registry). A "creator picks" collection credits them and gives them a reason to share. We'd need the owner's call on an email provider. Never pay for inclusion. |
| **Open dataset / API ("verified layer")** | **New idea: Next** | Publish per-city `places.json` under a clear licence. Positions us as grounding data for AI assistants and DMOs (see the Mindtrip DMO deals). A possible B2B line later (open question). |

---

## 7. Risks and threats

| Risk | Likelihood · impact | Mitigation |
|---|---|---|
| **AI planners make lists a commodity** (T1) | High · High | Don't compete on breadth or chat. Compete on **verifiability**: be the cited source. Ship structured data plus an open dataset so assistants can ground on us. Make "checked on <date> by <source>" visible everywhere. |
| **Google and Apple map lists** (T3) | High · Medium | Our edge is multi-source citation, closure honesty, pop culture and city-unique food, not "a list in a map". Export to their maps (we already do) instead of fighting them. |
| **Data staleness at scale** (T4, W10) | High · High | Make refresh a first-class pipeline. Re-check closures on a schedule tiered by risk: food every 3–6 months, institutions yearly. Show `statusChecked` on cards. **Freeze new-country expansion until refresh coverage is measured.** About 10.5k places on a 6-month cycle means about 1,750 checks a month on the WebSearch budget. |
| **Legal / licensing** (T5) | Medium · High | Commons-only images with TASL. No anime frames. Trademarks used only nominatively (for example, "listed in the Michelin Guide"). No scraping of ratings or photos. Keep the existing "Yelp/TripAdvisor never the recommender" rule. Add a takedown/corrections contact. |
| **Single-maintainer bus factor** (T6) | Medium · High | The pipeline docs and agent briefs already help. Add a public "how to contribute a correction" path, and consider a second human editor or trusted co-maintainer (open question). |
| **GitHub Pages limits** (T7) | Low now · Medium with photos | 65 MB today. Hotlink or thumbnail images. Lazy-load. If traffic nears 100 GB/month, put a CDN in front or move to another static host, as GitHub's own docs suggest ([docs](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)). |
| **Overtourism / manners at pop-culture sites** (T8) | Medium · Medium | Add `warn` notes (rule-compliant hard constraints) for sensitive sites. Avoid residential "photo spots". |
| **Brand dilution from monetisation** | Medium · High | The affiliate rules in §6, plus a public disclosure. Never sell placement. Michelin's pay-to-play criticism is the warning ([Boston Globe](https://bostonglobe.com/2025/05/15/business/michelin-guide-star-tourism-boston-restaurants/)). |

---

## 8. Recommended roadmap — Now / Next / Later

Effort is in agent-sessions (one session is a focused agent run plus owner review). Every item keeps the integrity rules and the two
pre-commit checks.

### Now (next ~4–6 weeks): make the asset usable, linkable and personal

| Item | Rationale | Success metric | Effort |
|---|---|---|---|
| **0. Privacy-friendly analytics** (owner decision on the vendor; non-blocking script) | Every other metric depends on it, and today we are blind | Visitors and top pages per city visible weekly | 0.5 |
| **1. Ship the UX "Salon" core on the engine**: places first, 44 px, no overflow ([UX roadmap](../../ux-2026-10/README.md#7-implementation-roadmap)) | Fixes W5. Prerequisite for everything mobile | Mobile screens to first place ≤ 1.2; 0 overflow pages; QA tap-target WARNs down 90% | 3–4 |
| **2. Per-place permalinks plus Web Share** | Distribution loop; low effort; fixes W4 | ≥ 5% of sessions arrive via a `#p=` link within 2 months | 1 |
| **3. Interest concierge plus "for you" ordering** | The heart of the brief (W1) | ≥ 25% of city sessions set interests; saves per session up | 2 |
| **4. JSON-LD plus a published `places.json` per city, with OG cards** | Machine-readable, citable, shareable (O5) | Rich Results Test valid on all pages; pages indexed; first AI-assistant citations observed | 1–2 |
| **5. "Last checked" and "recently closed" on cards; a public methods page** | Productises S2/S3 and states the trust brand | Methods page live; every card shows `statusChecked` | 1 |
| **6. Fix drift**: hub counts computed by the gate, city-specific search placeholders, food mode hidden when empty | Credibility (W6) | 0 count mismatches hub vs page | 1 |

### Next (~1–3 months): plan the day, see the place, use it on the street

| Item | Rationale | Success metric | Effort |
|---|---|---|---|
| **7. "A day with your guide"** itineraries, shareable through the URL | Butler plus local guide; distribution | ≥ 10% of sessions open a day plan; shared-plan arrivals tracked | 2–3 |
| **8. Commons imagery pilot (Tokyo, Kyoto, NYC)** with a TASL credit pipeline | W2, the wanderlust gap | ≥ 60% of must-sees on the pilot cities have a licensed image; 0 licence defects in audit; page weight within budget | 3 |
| **9. PWA plus offline per city** | In-destination (O4) | Install prompts accepted; offline load passes QA | 2 |
| **10. Japanese, Chinese and Korean UI chrome for the Japan pages** | 42.68M visitors to Japan; pop-culture fans across Asia | Non-English share of Japan traffic; bounce rate | 2 |
| **11. Refresh pipeline v1**: risk-tiered closure re-checks, a per-city changelog/RSS and a monthly trust report | T4. Turns maintenance into content | % of places checked in the last 180 days ≥ 80%; changelog published monthly | 3 |
| **12. "Pilgrim" pop-culture collection** across all 5 Japan maps, cross-referenced to Anime Tourism 88; pilot film/music pop culture in 2 US cities | Sharpest wedge (S5/O3) | ★ records +50%; pop-culture filter usage | 2–3 |

### Later (3–12 months): earn, partner, extend

| Item | Rationale | Success metric | Effort |
|---|---|---|---|
| **13. Sourced hours, price tier and official "reserve/tickets" links** for must-sees | Closes the practical gap (W3) | Coverage on tier-1 places ≥ 80%; each with a source and date | 4+ (ongoing) |
| **14. Disclosed affiliate links** (rules in §6) on ticketed sights and experiences | Supplementary revenue, if the owner wants revenue | Revenue per 1k sessions; zero ranking influence (audited) | 2 |
| **15. Newsletter or "follow a city"** plus creator-picks collections | Owned distribution as SEO shrinks (T2) | Subscribers; open rates | 2 |
| **16. Open data licence plus DMO and creator outreach** | Positions us as the verified layer (O5/O8) | One partner or citation agreement | owner-led |
| **17. Resume country expansion** only once refresh coverage is green | Depth before breadth | New country has 4 gates green, plus refresh coverage ≥ 80% everywhere | per city |

### What NOT to do

- **No user reviews, star ratings or "community scores."** They break the trust model and invite the fraud that plagues Tripadvisor, Google and Tabelog.
- **No AI-generated, stock-as-real or scraped photos, and no anime screenshots.** Use only licensed images with credit, or none.
- **No free-form LLM chat that answers beyond our dataset.** The concierge is deterministic over sourced records. An AI layer, if ever built, must only quote our data and its sources.
- **No pay-to-play.** No paid inclusion, no sponsored rank, no tourism-board money tied to coverage. Affiliate links never influence selection.
- **No in-house checkout, accounts or backend** until usage data proves the need.
- **No native apps.** A PWA is enough.
- **Don't chase city count.** No new countries until refresh coverage is measured and green. A stale guide is worse than a small one.
- **No silent "fixes" to hours or closures from estimation.** If it isn't sourced, show "check before you go".
- **Don't duplicate** the UX teardown or the Salon visuals here. Implement them.

---

## 9. Open questions for the owner

1. **Goal:** is this a portfolio and public good, a brand, or a business? That decides whether items 14–16 happen at all.
2. **Analytics:** may we add a privacy-friendly, cookie-less analytics script (third party, non-blocking)? Without it, none of the success metrics can be measured.
3. **Imagery:** are Wikimedia Commons images with on-image credits acceptable to the luxury aesthetic? Or would you prefer typographic plates only, with photos only where an official press kit grants rights?
4. **Monetisation rules:** do you agree with the five affiliate rules in §6? Which networks are acceptable (Viator, GetYourGuide, Klook, Booking)?
5. **Depth vs breadth:** will you accept a **pause on new countries** until a refresh pipeline keeps 80% of places checked within 180 days?
6. **Pop-culture scope:** Japan anime only, or a cross-country "pop culture" pillar (film and TV locations, music history, games)?
7. **Languages:** which come first for Japan: Japanese, Chinese (Simplified or Traditional?) or Korean? Is UI-only acceptable at first?
8. **Open data:** may we publish `places.json` per city under an open licence (for example CC BY 4.0 for our compilation, with sources linked)? It makes us citable, but competitors can reuse it.
9. **Contributors:** would you take on a second human editor or accept public correction pull requests, to reduce the bus factor?
10. **Newsletter:** is an email provider acceptable? If not, RSS/Atom only.
11. **Branding:** the product has no consumer-facing name beyond "cleo-guide" and the city titles. Is a brand name part of the luxury repositioning?

---

## 10. Reproduce

```bash
# Place counts per page and totals (parses P/F arrays of every engine page)
node design/research-2026-10/swot/notes/count-places.js cleveland.html cities/*.html Singapore/*.html Vietnam/*.html

# Registry totals
python3 -c "import json;g=json.load(open('data/geocodes.json'))['cities'];print(sum(len(v) if isinstance(v,list) else len(v.get('places',v)) for v in g.values()))"
python3 -c "import json;s=json.load(open('data/sources.json'))['cities'];print(sum(len(v.get('sources',[])) for v in s.values()), sum(len(v.get('creators',[])) for v in s.values()))"

# Japan pop-culture layer
for c in tokyo osaka kyoto hokkaido okinawa; do echo $c $(grep -o '★ Anime' cities/$c.html | wc -l); done
```

The competitor research lives in [`notes/A-experiences-otas-loyalty.md`](notes/A-experiences-otas-loyalty.md),
[`notes/B-editorial-japan-anime.md`](notes/B-editorial-japan-anime.md) and
[`notes/C-maps-ai-platform.md`](notes/C-maps-ai-platform.md). All URLs are in [`sources.md`](sources.md).

### Calls made while researching (recorded, not asked)

- **Ownership of the research:** the research was split into three WebSearch-only sub-agents (A, B and C), and their raw notes are kept verbatim in `notes/` so every claim stays traceable.
- **Unverified items:** findings the agents flagged as unverified are carried as *secondary* or left out of the executive summary. Examples: the Lonely Planet app shutdowns (not found), Butaimeguri download numbers (not found), the Tabelog Supreme Court outcome (single wiki source) and the anime-site share of 4.6%→7.5% (Trip.com citing the Japan Tourism Agency).
- **Feature matrix:** competitor cells combine the cited notes with public product knowledge. Where a cell could not be checked, it shows `?` rather than a guess.
- **Effort units:** effort is estimated in agent-sessions. That is how this repo is actually built (276 of 277 commits).
- **Overlap with other work:** UI/visual questions are deferred to `design/ux-2026-10/` and the parallel `ux-competitive/` teardown, and are not re-litigated here.
