# Research C: competitive landscape and platform constraints (as of 2026-10-10)

How this was done: about 38 WebSearch queries. WebFetch was blocked, so every claim below comes from search-result snippets and the summaries the search tool returned. Every URL comes from those results. Where a figure could not be checked against a primary source, or sources disagree, it is marked "(secondary)" or "(unverified)". Inferences for a SWOT analysis are labelled **[inference]**.

---

## 1. Google Maps (Lists, Gemini in Maps, Ask Maps, AI place summaries, Local Guides)

- **Positioning:** the default map and local-search layer, now an AI "ask anything about places" surface. Ask Maps is a Gemini conversational search inside Maps. It was reported in testing in Feb 2026 and launched on **12 Mar 2026** alongside Immersive Navigation. It went first to iOS and Android in the US and India. [storyboard18], [techloy], [gsmarena], [noqta]
- **Scale and data:** Ask Maps reportedly draws on 300M+ places and 500M reviews (single secondary source). [noqta]
- **Core AI features (since Oct 2024):** carousels "Curated with Gemini", with a rating and a review snippet on each card. Gemini **review summaries** on place pages, drawn from user reviews. "Ask about this place" Q&A that cites review snippets and web links. [9to5google-2024], [tomsguide], [silicon]
- **Trust model:** answers are grounded in Maps data. VP Miriam Daniel said "We look at the billions of pieces of information in Maps to almost fact-check those answers." [9to5google-2024]
- **UGC moderation (2025):** over 1B reviews and 80M suggested edits were contributed. Google blocked or removed **292M policy-violating reviews** (about 21% more than the 240M of 2024), blocked 79M inaccurate edits, removed 13M fake Business Profiles and restricted about 782k–783k accounts. Gemini now pre-screens edits and fights review-extortion scams. [seroundtable], [blog.google-protecting], [designrush], [ppc.land-gemini-edits]
- **Freshness:** an ML model replaces likely-wrong hours with predicted hours, using nearby shops, the business's website and Street View signage. It changes hours automatically when "high confidence" and does not tell users when AI changed them. [inc], [blog.google-self-updating]
- **Lists:** users can create, share and follow lists, and followers see later updates. Local Guides had list creation earlier. No 2025–26 creator-list program was found. [venturebeat], [searchengineland-lists], [expertbeacon] (commentary)
- **Local Guides:** points and levels gamification, with 10 levels and Level 10 at 100k points (dates from about 2017). Current perks for 2025–26 were not found. [phonearena-lg], [sej-lg]
- **Personalisation:** thumbs up/down tuning on Gemini carousels, plus the user's saved and history signals. [9to5google-2024]
- **Distribution:** preinstalled on Android and the default for most iOS users, deeply tied to Search. Gemini exports results to a Maps list. [techcrunch-2025-03]
- **Weaknesses and criticisms:**
  - A local bookshop owner could not quickly fix an AI "closed" error despite flagging it repeatedly. [hoodline]
  - **Fake review volume is still huge.** 292M were removed in 2025, which signals how much abuse exists. [seroundtable]
  - **AI Overviews invented a closure** (Anna Mae's Bakery, Ontario) by merging two businesses with the same name. A Montana restaurant asked customers to stop trusting Google AI for its specials because the AI fabricated deals. [ppc.land-annamaes], [pinmeto], [getcoai-montana]
  - Gemini in Maps is good for staples but "falls flat off the beaten path", and one review hit a mislocated result. [ainauten], [letsdatascience-wsj]
  - **[inference]** Provenance is aggregate: "review summary" or "Gemini". There is no single named recommender per place.

## 2. Apple Maps Guides

- **Positioning:** curated, brand-trusted guides built into Apple Maps, free, with no ads in the guide format. [support.apple.com], [iphonelife]
- **Publishers:** more than 70 third-party publishers (2021 analysis), for example Lonely Planet, Culture Trip and Fotospot. Lonely Planet's first collections were SF, NYC, LA and London. Apple later began writing some guides itself. [justinobeirne-apple-publishing], [iphonelife], [travolution-lp], [lonelyplanet]
- **May 2025:** MICHELIN distinctions (Stars, Green Stars, Bib Gourmand, Keys) shown in US Maps, plus curated guides from Michelin, The Infatuation and Golf Digest. [9to5mac-2025-05], [ppc.land-michelin]
- **iOS 26:** the Guides "We Love" and "Browse by Publisher" sections name AllTrails, Complex, The Infatuation, Time Out and The Washington Post (one source also lists Yelp and Michelin). Saved guides **update automatically** when places are added. [appleworld.today], [9to5mac-1001350]
- **Trust model:** publisher brand authority. The editorial is by the publisher, with Apple's place data underneath.
- **Personalisation:** minimal. Guides are browsed by city or publisher.
- **Distribution:** limited to iOS and macOS. The rest of the web cannot see guides **[inference]**.
- **Weaknesses:**
  - **Thin international coverage.** No guides for more than a third of the 40 most-visited cities, and 13 cities (11 American) account for over half of 1,066 guides (2021). [justinobeirne-wwdc2020]
  - Users outside the US say "Apple Maps is still very poor" there (forum anecdote). [macrumors]
  - Guides feel US-centric, for example national-park guides that only cover the US. [pxlnv]
  - No current 2025–26 audit of guide freshness was found.

## 3. Wanderlog

- **Positioning:** a collaborative itinerary and map planner, often called "Google Docs for trips". It was in Y Combinator in 2019 and raised a $1.5M seed from General Catalyst and Abstract Ventures. [phocuswire-wanderlog]
- **Business model:** freemium. A third party lists Pro at **$39.99/yr**. The US App Store shows annual options of about $31.99–$59.99 and monthly $5.99–$16.99, so price varies by tier, region or promotion. No official pricing page was found. [pilotplans], [apps.apple.com-us-wanderlog]
- **Core features:** itinerary with budget. Collaborators by email or link, with edit or view permissions. Google-Maps-based map with routes. Import reservations by email forwarding or Gmail link. Export to Google Maps (full trip on Pro). Pro also adds offline access, PDF export and TripAdvisor integration. Users can publish post-trip "travel guides". [apps.apple.com-us-wanderlog], [pilotplans]
- **Trust model:** user-generated guides plus aggregated place data. There is no per-place sourcing.
- **Personalisation:** user-driven planning plus suggestions.
- **Distribution:** app stores and web. The SEO strategy for its guide pages was not found in results.
- **Weaknesses:**
  - Trustpilot TrustScore of **2/5**, with complaints about bugs, lost itineraries and hard-to-reach support. One reviewer said its content relies on other sites "without validation". [trustpilot-wanderlog]
  - Paywall friction, pop-ups, and difficult multi-country trips. [kimola] (vendor sample, indicative only)

## 4. Mindtrip

- **Positioning:** an AI travel planner and booking companion built on OpenAI technology. It launched in May 2024 and released a mobile app in June (about 2025). [phocuswire-mindtrip-app]
- **Funding:** $7M seed (2023) and $12M Series A (2024), about $19M per CB Insights and Neuronfeed. PhocusWire says $22.5M in total. In **Dec 2025** it took undisclosed strategic investments from **Capital One Ventures and United Airlines Ventures**. Existing investors are Amex Ventures, Costanoa and Forerunner. It acquired guide platform **Thatch** (Mar 2025). [phocuswire-mindtrip-capone], [pulse2], [cbinsights], [neuronfeed], [techleap-thatch]
- **Partnerships and business model:** more than 35 destination-marketing partners, including Brand USA, Visit California, Visit Costa Rica and the Bahamas. These B2B DMO deals sit alongside booking commissions. A May 2026 flight agent uses live **Sabre** booking with PayPal checkout. [phocuswire-mindtrip-capone], [webpronews-mindtrip]
- **Core features:** "Start Anywhere" builds a plan from a TikTok, YouTube video, Reddit post, blog, screenshot or Google Pins. Collections. Group planning and chat with @Mindtrip. Booking hub. [techcrunch-mindtrip-2024], [phocuswire-mindtrip-app]
- **Social and creators:** a creator link program ("up to $10,000/month" claimed). Creators build collections from their social content. [techcrunch-mindtrip-2024], [phocuswire-mindtrip-app]
- **Trust model:** AI answers with maps, links and reviews for cross-checking. [flowingdata] (NYT test summary)
- **Weaknesses:** AI planners in general "often have dated information and can make things up", although Mindtrip was rated the most sophisticated of four tools tested. An early NYT test found it needed more prompting. No Mindtrip-specific audit of hallucinations was found. [craigstoltz], [flowingdata]

## 5. Layla (and the Roam Around merger)

- **History:** founded in Berlin in 2023 by Saad Saeed and Sardar Bali. In **Feb 2024** it acquired Roam Around, an AI itinerary bot with 10M itineraries and about 500k monthly visitors. Founder Shie Gabbai (ex-Google/Waze) became COO. Roam Around brought partnerships with TripAdvisor, Kayak, Viator and GetYourGuide. Terms were undisclosed. [techcrunch-layla], [phocuswire-layla-roam], [travolution-layla]
- **Expedia Group acquired Layla on 31 Jul 2026** (terms undisclosed; Layla had raised about €5M from First Minute Capital and M13). Layla keeps operating alongside Expedia's brands. [ir.expediagroup], [hospitalitynet], [phocuswire-expedia-layla]
- **Positioning and business model:** an AI travel agent that plans and books, earning affiliate or booking revenue plus subscriptions. The premium tier costs about $49–50/yr. Sources disagree on what the free tier includes. [monkeytravel-layla-vs-mindtrip], [endlesstravelplans]
- **Weaknesses:** TechRadar called it "disappointing despite requiring a subscription to even try". CO/AI found the recommendations "lacked the depth and accuracy expected". Trustpilot users report lost or changed itineraries (overall score 4.0). [techradar-layla], [getcoai-3agents], [trustpilot-layla]

## 6. Google Gemini travel features (Gemini app, Deep Research, Gems, AI Mode in Search)

- **Gemini app:** connects to Google Maps, Hotels and Flights to build itineraries. Google's explainer is dated Aug 2026. With "Personal Intelligence", Gemini reads Gmail bookings. Gems are custom assistants, free to all since Mar 2025, for example a "conference travel" Gem. Deep Research writes source-linked trip reports. [blog.google-how-gemini-plans], [techcrunch-2025-03], [afar-google], [ynetnews]
- **AI Mode in Search:** **Canvas** trip planning (US desktop, Labs) combines real-time flight and hotel data, Maps photos and reviews, and web content. Agentic booking is live for restaurants, events and appointments via OpenTable, Resy, Ticketmaster, StubHub and Fresha. **Flight and hotel booking is announced but not live**, with partners Booking.com, Expedia, Marriott and Wyndham. Flight Deals covers 200+ countries. [blog.google-agentic-canvas], [searchenginejournal-agentic], [emarketer], [channelnews]
- **Trust model:** grounded in Google's Maps, Flights and Hotels data, and the Gemini API offers "Grounding with Google Maps" over 250M places. [altexsoft-gemini-maps-api]
- **Distribution:** Search, Android and Gmail, which is unmatched reach **[inference]**.
- **Weaknesses:**
  - In a WSJ test (Mar 2026), Gemini **missed seasonal restaurant hours**, misjudged walkability and flagged rail delays too late. [letsdatascience-wsj]
  - A user reported wrong metro directions five times in a row (anecdote). [sikayetvar]
  - AI Overviews fabricate local facts (see §1). [ppc.land-annamaes]

## 7. ChatGPT travel (apps in ChatGPT, Apps SDK, agent mode)

- **Apps in ChatGPT (Apps SDK on MCP):** launched at OpenAI DevDay (Oct 2025). Expedia and Booking.com were launch partners, with real-time hotel and flight prices and interactive maps. Tripadvisor, Uber and TheFork were to follow. It was not available in the EU at launch, and ChatGPT had about 800M users. App submissions opened to all developers in Dec 2025, listed at chatgpt.com/apps. [phocuswire-openai-apps], [shorttermrentalz], [ecommerce-nation], [skift-2025-12-18]
- **Tripadvisor app in ChatGPT:** US-only, for logged-in Free, Go, Plus and Pro users. Hotel search with a map. Booking redirects to Tripadvisor or partners. [tripadvisor-chatgpt]
- **Checkout:** OpenAI launched Instant Checkout in late 2025 but by Mar 2026 had shifted to leaving checkout to third-party apps. [altexsoft-chatgpt-otas]
- **Agent mode (Jul 2025):** can book OpenTable tables, but slowly (about 30 minutes in one test). It cannot phone restaurants without online booking. Hotel booking stops at checkout without payment details. Usage is capped at 40 per month on Plus and 400 on Pro. Users must explicitly confirm actions with consequences. [tomsguide-chatgpt], [triptease-agent], [seranking]
- **Weaknesses:**
  - The SEO Travel test found **90% of ChatGPT itineraries had at least one error**, about 25% recommended a closed venue, 52% scheduled visits outside opening hours, and some included a fictional Rome eatery. This is a small, non-peer-reviewed marketing-firm study. [travolution-90pct], [rustourismnews]
  - Euronews' Tallinn test found permanently closed restaurants. Afar describes ChatGPT recommending Golden Poppy (Paris), which closed in Jun 2024. [euronews-tallinn], [afar-mistakes]
  - The "Sacred Canyon of Humantay" hallucination sent tourists toward a non-existent place in the Peruvian Andes at about 4,000 m. Reports say ChatGPT or "AI tools", and most trace back to one guide's account. [oecd.ai], [getcoai-peru], [resultsense]
  - A related failure mode: an AI-generated fake video of a Malaysian cable car sent an elderly couple on a 300 km trip (AIID #1634). [incidentdatabase-1634], [thestandard], [itc.ua]
  - A peer-reviewed 2026 study found hallucinations in ChatGPT itineraries cut perceived accuracy, and that eliminating them is "currently impossible". [riuma.uma.es]

## 8. Perplexity travel

- **Mar 2025:** a travel "answer mode" with booking powered by **Selfbook**, using **Tripadvisor** reviews. About 140k properties can be booked in-app, and the rest redirect. Pro users were promised discounts. It launched on the web only. [phocuswire-perplexity-selfbook], [triptease-perplexity], [foster]
- **Oct 2025:** an Expedia partnership on the **Comet** AI browser, offering itineraries and bookings, plus Expedia OneKey Silver status for Comet users. [phocuswire-expedia-comet], [altexsoft-comet]
- **Weakness:** a review said it "felt more like curated aggregation than a seamless booking engine". [foster]
- No 2026 updates were found.

---

## 9. AI Overviews and AI search reducing clicks to travel publishers (2024–2026)

- **Pew (22 Jul 2025):** based on 900 US adults' browsing in Mar 2025. Users clicked a traditional result on **8%** of visits when an AI summary appeared, versus **15%** without one. Links inside the summary got about 1% of clicks. Sessions ended more often (26% vs 16%). Google disputes the methodology. [pew], [npr]
- **The Planet D,** a travel blog, **shut down after a 90% traffic drop** following AI Overviews. [npr]
- **Seer Interactive (late 2025):** organic CTR on queries with AI Overviews fell 61% (from 1.76% to 0.61%). This figure is secondary. [npr-result-set/webpronews] (reported in the search summary, origin unverified)
- **Tripadvisor (Feb 2026):** the CEO cited "ongoing declines in flyby visitors... due to... AI overviews". SEO is expected to drive less than 10% of Experiences gross bookings by end-2026. The company is pivoting to a direct-destination app. [skift-2026-02-12], [altexsoft-tripadvisor-marketing]
- **Travel blogs:** a 2026 study of 100 blogs (Daniel Stanica, Semrush estimates) found a median travel-blog organic traffic loss of 74% between Apr 2022 and Apr 2026. It comes via a vendor blog, so treat it as secondary. [getchatads]
- **Similarweb:** the zero-click rate for news searches rose from about 56% (May 2024) to about 69% (May 2025). Organic news visits fell from over 2.3B to under 1.7B, while ChatGPT referrals rose from under 1M to over 25M. Semrush puts **AI Mode at about 93% zero-click**. Google referrals to publishers fell 33% globally in the year to Nov 2025 (Chartbeat/Reuters Institute via Press Gazette). All of these are secondary. [seotldr], [ppc.land-zero-click], [gist.ai]
- **Counterpoint:** Semrush found the zero-click rate on AI Overview keywords fell from over 45% (Jan 2025) to 38% (Oct 2025). [adexchanger / search summary]
- **[inference]** Publisher traffic from Google is shrinking structurally. A guide that depends on organic search for discovery is exposed. Being the *cited source* inside AI answers, plus direct and social distribution, matters more.

## 10. schema.org TouristAttraction / Restaurant structured data

- **Google supports LocalBusiness markup, including Restaurant subtypes.** It covers hours, departments and reviews (reviews only where the site collects reviews of *other* businesses), and must be validated with the Rich Results Test. The Maps Booking API is the route to reservations. [google-localbusiness]
- Recommended properties include a menu link for food establishments, hours, and aggregate rating (from a 2020 reproduction, possibly outdated). [huckabuy]
- **Carousel** rich results must be combined with Recipe, Course list, **Restaurant** or Movie. This is the main list-style rich result relevant to a restaurant guide. [google-gallery], [google-carousels-beta]
- **TouristAttraction:** no Google rich-result feature for it was found. It is a valid schema.org type that helps Google understand a page, but it is not listed as a rich-result feature in the search gallery. Schema "does not guarantee a visually rich result" and is not a ranking factor. [seoclarity], [dataliberate], [google-gallery]
- **Google is pruning rich results.** On 12 Jun 2025 it dropped 7 types (Book Actions, Course Info, ClaimReview, Estimated Salary, Learning Video, Special Announcement, Vehicle Listing) as part of "simplifying" results, saying ranking is unaffected. Review rich results are limited to first-party reviews, and FAQ results are restricted by vertical. [google-blog-2025-06], [searchengineland-drop], [seoclarity]
- **[inference]** Use `ItemList` with `Restaurant` / `TouristAttraction`, `geo` and `sameAs` markup mainly for machine readability and AI grounding, not for rich snippets. One vendor post even argues that schema "earns no AI citations". [ecorpit] (vendor opinion)

## 11. GitHub Pages usage limits (official docs)

- Published sites may be **no larger than 1 GB**, with a recommended 1 GB source repo. [gh-pages-limits]
- **Soft bandwidth limit of 100 GB/month.** [gh-pages-limits]
- **Soft limit of 10 builds/hour.** This does not apply when building and publishing with a custom GitHub Actions workflow. [gh-pages-limits]
- Deployments time out after 10 minutes. Rate limiting returns HTTP 429. If quotas are exceeded, GitHub may stop serving the site or suggest putting a CDN in front. [gh-pages-limits]
- **[inference]** This is fine for a static guide. Large self-hosted image sets are the main risk to the 1 GB and 100 GB limits.

## 12. Wikimedia Commons image reuse licensing

- **Check each file's licence on its file description page.** The Wikimedia Foundation gives no warranty. Trademark, personality and privacy rights may also apply. [commons-reuse]
- **CC BY-SA:** reusers must attribute the author(s) and give the licence or a link to it. Altered versions must be released under CC BY-SA (share-alike). [commons-reuse], [commons-reuse-licenses]
- Public-domain files may not legally require attribution, but attribution is recommended. [commons-reuse]
- **Best practice is TASL:** Title, Author, Source (link), Licence (link to deed). State "adapted from" if the image was changed. Any reasonable manner suited to the medium is allowed, and 4.0 licences no longer require the title. [cc-wiki-attribution], [uottawa]
- **[inference]** Store author, licence, source URL and modification flag per image, and render a credit line or credits page.

## 13. PWA offline on iOS Safari (storage limits and eviction)

- **Quota (Safari 17 / iOS 17+):** a browser app's origin quota is **up to 60% of total disk**. Other WebKit apps get up to 15%. Cross-origin frames get 10% of the main origin's quota. A **Home Screen web app gets the same quota** as in the browser. Safari no longer prompts users for more space. [webkit-storage-policy]
- **Eviction:** WebKit still evicts data from sites the user has not interacted with for some time (an ITP trigger). [webkit-storage-policy]
- **7-day rule (Safari 13.1, 2020):** script-writable storage (IndexedDB, localStorage, Service Worker registrations and cache) is deleted after 7 *days of Safari use* without interaction with the site. **Home-screen apps have their own day counter**, which resets with use. [searchengineland-7day], [mjtsai]
- A WebKit bug report (iOS 15.3) describes home-screen app users still being logged out after 7 days despite use. This is unresolved, user-reported, and the definition of "interaction" is unclear. [webkit-bug-237350]
- **Older figures:** the commonly quoted "50 MB Cache API limit" on iOS predates Safari 17 and is likely obsolete. Background Sync is minimal and idle service workers are terminated. These are blog sources. [love2dev], [magicbell]
- **[inference]** Treat offline as a best-effort cache. Keep the content-first page renderable without the service worker, and encourage "Add to Home Screen" so eviction runs on the app's own counter.

---

## Sources

**Google Maps**
- [storyboard18]: https://www.storyboard18.com/digital/google-maps-testing-ask-maps-chat-feature-powered-by-gemini-ai-89422.htm
- [techloy]: https://www.techloy.com/google-maps-launches-ask-maps-and-immersive-navigation-both-powered-by-gemini/
- [gsmarena]: https://www.gsmarena.com/google_maps_gets_geminipowered_ask_maps_and_immersive_navigation-news-71935.php
- [noqta]: https://www.noqta.tn/en/news/google-maps-gemini-ai-ask-maps-immersive-navigation-2026
- [9to5google-2024]: https://9to5google.com/2024/10/31/google-maps-gemini/
- [tomsguide]: https://tomsguide.com/computing/mobile-apps/google-maps-just-got-a-huge-upgrade-with-gemini-ai-heres-all-the-new-features
- [silicon]: https://www.silicon.co.uk/ai/google-maps-ai-587188
- [seroundtable]: https://www.seroundtable.com/google-maps-spam-fighting-2025-41176.html
- [blog.google-protecting]: https://blog.google/products-and-platforms/products/maps/new-ways-were-protecting-businesses-on-maps/
- [designrush]: https://news.designrush.com/google-review-crackdown-agencies-compliance
- [ppc.land-gemini-edits]: https://ppc.land/google-maps-uses-gemini-to-stop-fake-edits-and-blocks-review-extortion-scams/
- [inc]: https://www.inc.com/anna-meyer/google-artificial-intelligence-business-hours.html
- [blog.google-self-updating]: https://blog.google/products-and-platforms/products/maps/how-ai-and-imagery-build-self-updating-map/
- [hoodline]: https://hoodline.com/2026/07/google-s-ai-closed-call-hits-willoughby-bookshop-where-it-hurts-6934190/
- [venturebeat]: https://venturebeat.com/mobile/google-maps-now-lets-you-create-share-and-follow-lists-of-places
- [searchengineland-lists]: https://searchengineland.com/google-maps-new-feature-lets-users-create-lists-saved-places-can-shared-accessed-offline-269310
- [expertbeacon]: https://expertbeacon.com/what-does-google-maps-dua-lipa-travel-list-change-for-local-discovery-and-curation/
- [phonearena-lg]: https://www.phonearena.com/news/Google-updates-Local-Guides-program-with-new-incentives-for-contributors-more-levels-to-unlock-and-a-revamped-point-system_id95008
- [sej-lg]: https://www.searchenginejournal.com/google-local-guides-program-earn-points-badges/507061/
- [ppc.land-annamaes]: https://ppc.land/google-ai-overview-forces-anna-maes-bakery-to-deny-fake-july-31-closing/
- [pinmeto]: https://www.pinmeto.com/news/google-ai-overview-false-closure-location-accuracy-2026/
- [getcoai-montana]: https://getcoai.com/news/montana-restaurant-begs-customers-to-stop-using-google-ai-for-specials/
- [ainauten]: https://news.ainauten.com/en/story/i-let-gemini-in-google-maps-plan-my-day-and-it-went-surprisingly-well

**Apple Maps**
- [support.apple.com]: https://support.apple.com/en-us/guide/maps/mps77b2164f4/3.0/mac/11.0
- [iphonelife]: https://iphonelife.com/content/how-to-browse-apple-maps-guides-publisher
- [justinobeirne-apple-publishing]: https://justinobeirne.com/apple-publishing-its-own-apple-maps-guides
- [justinobeirne-wwdc2020]: https://justinobeirne.com/wwdc-2020-one-year-later
- [travolution-lp]: https://www.travolution.com/articles/115858/lonely-planet-curated-content-to-feature-in-new-apple-maps-travel-update
- [lonelyplanet]: https://www.lonelyplanet.com/articles/apple-maps-collections
- [9to5mac-2025-05]: https://9to5mac.com/2025/05/14/apple-maps-now-highlights-expert-ratings/
- [ppc.land-michelin]: https://ppc.land/apple-brings-expert-ratings-to-maps-with-michelin-guide-integration/
- [appleworld.today]: https://appleworld.today/?p=129339
- [9to5mac-1001350]: https://9to5mac.com/?p=1001350
- [macrumors]: https://forums.macrumors.com/threads/apple-maps-now-features-insights-from-expert-sources-like-michelin-guide.2457082/
- [pxlnv]: https://pxlnv.com/linklog/apple-maps-guides/

**Wanderlog**
- [phocuswire-wanderlog]: https://www.phocuswire.com/Wanderlog-1-5M-seed-funding
- [pilotplans]: https://www.pilotplans.com/compare/wanderlog-alternative-feature-comparison
- [apps.apple.com-us-wanderlog]: https://apps.apple.com/us/app/wanderlog/id1476732439
- [trustpilot-wanderlog]: https://www.trustpilot.com/review/wanderlog.com?page=2
- [kimola]: https://kimola.com/reports/wanderlog-app-feedback-report-in-depth-user-insights-app-store-gb-156376

**Mindtrip**
- [phocuswire-mindtrip-capone]: https://www.phocuswire.com/mindtrip-ai-travel-planning-capital-one-ventures-united-airlines-ventures
- [pulse2]: https://pulse2.com/mindtrip-strategic-investments/
- [cbinsights]: https://www.cbinsights.com/company/mindtrip/financials
- [neuronfeed]: https://neuronfeed.com/startups/mindtrip
- [techleap-thatch]: https://finder.techleap.nl/news/feed/mindtrip-acquires-thatch-12m-funding
- [phocuswire-mindtrip-app]: https://www.phocuswire.com/mindtrip-launches-mobile-app-ai-trip-planner
- [techcrunch-mindtrip-2024]: https://techcrunch.com/2024/07/31/travel-startup-mindtrips-new-feature-lets-you-build-an-itinerary-from-a-screenshot-youtube-or-tiktok-video
- [webpronews-mindtrip]: https://www.webpronews.com/mindtrips-ai-tackles-the-chaos-of-flight-booking-that-search-engines-ignore
- [craigstoltz]: https://craigstoltz.substack.com/p/four-ai-travel-planning-programs
- [flowingdata]: https://flowingdata.com/page/29/?id=2367

**Layla**
- [techcrunch-layla]: https://techcrunch.com/2024/02/12/travel-startup-layla-acquires-flyr-backed-ai-itinerary-building-bot
- [phocuswire-layla-roam]: https://www.phocuswire.com/startup-travel-planner-layla-acquires-ai-itinerary-builder-roam-around
- [travolution-layla]: https://travolution.com/news/travel-startup-layla-acquires-ai-powered-itinerary-builder-roam-around
- [ir.expediagroup]: https://ir.expediagroup.com/news-and-events/news/news-details/2026/Expedia-Group-acquires-Layla-accelerating-its-AI-powered-trip-planning-and-booking-strategy/default.aspx
- [hospitalitynet]: https://www.hospitalitynet.org/news/4133792/expedia-group-acquires-layla-accelerating-its-ai-powered-trip-planning-and-booking-strategy
- [phocuswire-expedia-layla]: https://www.phocuswire.com/news/technology/expedia-group-acquires-ai-travel-planning-app-layla
- [monkeytravel-layla-vs-mindtrip]: https://monkeytravel.app/blog/layla-vs-mindtrip-2026
- [endlesstravelplans]: https://www.endlesstravelplans.com/guides/planning-tools/layla-ai-review
- [techradar-layla]: https://www.techradar.com/computing/artificial-intelligence/can-an-ai-travel-agent-remove-the-stress-of-vacation-booking-i-tried-three-to-find-out
- [getcoai-3agents]: https://getcoai.com/news/we-tested-3-ai-travel-agents-and-heres-what-actually-works/
- [trustpilot-layla]: https://www.trustpilot.com/review/layla.ai?page=3

**Gemini / AI Mode**
- [blog.google-how-gemini-plans]: https://blog.google/products-and-platforms/products/gemini/how-gemini-plans-trips/
- [techcrunch-2025-03]: https://techcrunch.com/2025/03/27/google-rolls-out-new-vacation-planning-features-to-search-maps-and-gemini
- [afar-google]: https://www.afar.com/magazine/the-best-ways-to-use-googles-ai-tools-for-travel-planning
- [ynetnews]: https://www.ynetnews.com/travel/article/s146ptdozg
- [blog.google-agentic-canvas]: https://blog.google/products-and-platforms/products/search/agentic-plans-booking-travel-canvas-ai-mode/
- [searchenginejournal-agentic]: https://www.searchenginejournal.com/google-extends-ai-travel-planning-and-agentic-booking-in-search/
- [emarketer]: https://www.emarketer.com/content/google-expands-ai-travel-planning-and-booking-tools
- [channelnews]: https://www.channelnews.com.au/google-ai-mode-gains-global-flight-search-and-trip-planning-canvas-tool/
- [altexsoft-gemini-maps-api]: https://www.altexsoft.com/travel-industry-news/google-integrates-maps-into-gemini-api
- [letsdatascience-wsj]: https://letsdatascience.com/news/travel-writer-tests-gemini-travel-itinerary-3be9b23e
- [sikayetvar]: https://www.sikayetvar.com/en/gemini-ai-us/gemini-ai-gave-wrong-directions-five-times-in-a-row-for-m12-metro-route

**ChatGPT**
- [phocuswire-openai-apps]: https://www.phocuswire.com/openai-chatgpt-apps-expedia-booking-tripadvisor
- [shorttermrentalz]: https://shorttermrentalz.com/news/chatgpt-launches-travel-apps-with-expedia-and-booking-com/
- [ecommerce-nation]: https://www.ecommerce-nation.fr/openai-devoile-les-apps-in-chatgpt/
- [skift-2025-12-18]: https://skift.com/2025/12/18/chatgpt-openai-opens-apps-developers
- [tripadvisor-chatgpt]: https://www.tripadvisor.com/ChatGPT
- [altexsoft-chatgpt-otas]: https://www.altexsoft.com/travel-industry-news/chatgpt-can-inspire-the-trip-but-otas-still-close-the-sale/
- [tomsguide-chatgpt]: https://www.tomsguide.com/ai/chatgpt/i-use-chatgpt-to-do-all-of-my-restaurant-bookings-and-it-saves-me-so-much-time
- [triptease-agent]: https://www.triptease.com/resources/what-chatgpt-agent-could-mean-for-hotel-bookings
- [seranking]: https://seranking.com/blog/chatgpt-agent-digital-marketing-review/
- [travolution-90pct]: https://travolution.com/news/marketing/survey-finds-chatgpt-itineraries-to-be-riddled-with-inaccuracies
- [rustourismnews]: https://www.rustourismnews.com/90-of-ai-travel-itineraries-are-inaccurate/
- [euronews-tallinn]: https://www.euronews.com/travel/2025/03/22/how-good-is-chatgpt-at-planning-holidays-i-put-it-to-the-test-on-a-weekend-trip-to-tallinn
- [afar-mistakes]: https://www.afar.com/magazine/the-most-common-mistakes-ai-makes-when-planning-travel
- [oecd.ai]: https://oecd.ai/en/incidents/2025-09-29-8b4f
- [getcoai-peru]: https://getcoai.com/news/ai-travel-tools-send-tourists-to-fake-dangerous-destinations
- [resultsense]: https://www.resultsense.com/news/2025-09-30-ai-travel-planning-risks-hallucinations/
- [incidentdatabase-1634]: https://incidentdatabase.ai/cite/1634
- [thestandard]: https://www.thestandard.com.hk/world-news/article/306539/AI-generated-fake-tourism-video-lures-Malaysian-couple-on-wild-goose-chase
- [itc.ua]: https://itc.ua/en/news/life-in-the-age-of-ai-an-elderly-couple-traveled-300-km-across-malaysia-to-see-a-building-that-doesn-t-exist
- [riuma.uma.es]: https://riuma.uma.es/entities/publication/fa2391c8-d163-4702-bffa-2e0aa156c052

**Perplexity**
- [phocuswire-perplexity-selfbook]: https://www.phocuswire.com/perplexity-selfbook-agentic-ai-travel-booking-tripadvisor
- [triptease-perplexity]: https://www.triptease.com/resources/perplexity-ai-hotel-search-agent
- [foster]: https://www.foster.com/newsroom/blog/duff-on-hospitality-law/travel-tech-trends-perplexitys-booking-leap-airbnb-incentives-ai-powered-planning/
- [phocuswire-expedia-comet]: https://www.phocuswire.com/expedia-group-perplexity-comet-partnership-ai
- [altexsoft-comet]: https://www.altexsoft.com/travel-industry-news/expedia-adds-perplexitys-browser-to-travel-planning-arsenal

**Zero-click / publisher traffic**
- [pew]: https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/markdown
- [npr]: https://www.npr.org/2025/07/31/nx-s1-5484118/google-ai-overview-online-publishers
- [webpronews]: https://www.webpronews.com/how-googles-ai-overviews-are-destroying-traffic-for-media-publishers-and-content-creators/
- [adexchanger]: https://adexchanger.com/publishers/the-ai-search-reckoning-is-dismantling-open-web-traffic-and-publishers-may-never-recover
- [skift-2026-02-12]: https://skift.com/2026/02/12/tripadvisor-sees-traffic-decline-from-ai-overviews-considers-strategic-alternatives-again/
- [altexsoft-tripadvisor-marketing]: https://www.altexsoft.com/travel-industry-news/tripadvisor-changes-marketing-as-ai-overviews-harm-traffic/
- [getchatads]: https://www.getchatads.com/blog/add-ai-assistant-travel-blog/
- [seotldr]: https://seotldr.substack.com/p/junejuly-core-update-rolling-out
- [ppc.land-zero-click]: https://ppc.land/chatgpt-referrals-surge-as-google-searches-hit-zero-click-records/
- [gist.ai]: https://gist.ai/blog/why-publishers-building-answer-engines

**Structured data**
- [google-localbusiness]: https://developers.google.com/search/docs/data-types/local-business?hl=cs
- [huckabuy]: https://huckabuy.com/2020/09/17/local-business/
- [google-gallery]: https://developers.google.com/structured-data/gallery/
- [google-carousels-beta]: https://developers.google.com/search/docs/advanced/structured-data/carousels-beta
- [seoclarity]: https://www.seoclarity.net/blog/the-best-schema-markup-for-hotels-and-travel-sites
- [dataliberate]: https://dataliberate.com/author/richard-wallis/page/2
- [google-blog-2025-06]: https://developers.google.com/search/blog/2025/06/simplifying-search-results
- [searchengineland-drop]: https://searchengineland.com/google-to-drop-support-for-several-rich-result-types-to-simplify-the-search-results-page-456969
- [ecorpit]: https://ecorpit.com/structured-data-json-ld-ai-search-citations-2026/

**GitHub Pages**
- [gh-pages-limits]: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits

**Wikimedia Commons / CC**
- [commons-reuse]: https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia
- [commons-reuse-licenses]: https://c.enwp.org/wiki/Commons:Reusing_content_outside_Wikimedia/licenses
- [cc-wiki-attribution]: https://wiki.creativecommons.org/Best_practices_for_attribution
- [uottawa]: https://www.uottawa.ca/library/copyright/what-is-copyright/how-attribute-creative-commons-licensed-content-best-practices

**iOS PWA**
- [webkit-storage-policy]: https://webkit.org/?p=14403 (also https://webkit.org/blog/category/storage)
- [searchengineland-7day]: https://searchengineland.com/what-safaris-7-day-cap-on-script-writeable-storage-means-for-pwa-developers-332519
- [mjtsai]: https://mjtsai.com/blog/2020/03/26/safari-13-1-third-party-cookie-blocking-and-7-day-script-writeable-storage/
- [webkit-bug-237350]: https://bugs.webkit.org/show_bug.cgi?id=237350
- [love2dev]: https://love2dev.com/blog/what-is-the-service-worker-cache-storage-limit
- [magicbell]: https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide

## Not found / gaps
- How Local Guides contributions weight the AI summaries; Local Guides perks for 2025–26.
- An official Wanderlog pricing page; Wanderlog's SEO strategy.
- Eater as an Apple Maps publisher; a 2025–26 audit of Apple guide freshness.
- A Google rich-result feature for TouristAttraction (none found; the type is not listed as a rich-result feature).
- Perplexity travel updates in 2026.
- A Mindtrip-specific hallucination audit.
