# Itinerary & map-first travel products + photography strategy/law

Research date: 2026-10-10. Method: WebSearch only (30 queries); WebFetch blocked, so claims rest on search-result summaries. Primary docs (HIG, m3.material.io, nngroup.com, unsplash.com/license) did **not** surface directly. Where a claim is not backed by a result, it says so.

---

## PART A — Itinerary & map-first products

### Wanderlog
- Drag-and-drop reordering of places; each added place is pinned on a Google-Maps-based map, with lines joining places in visit order so the route is visible — [Wanderlog App Store listing](https://apps.apple.com/ua/app/id1476732439); [Reeoo screenshots](https://blog.reeoo.com/app-screenshot/wanderlog-travel-planner/)
- A route optimizer reorders stops to save travel time; shows travel time/distance between places and per-day totals — [App Store listing](https://apps.apple.com/ua/app/id1476732439)
- Offline: listings conflict (one says plans stored offline automatically, APKMirror marks offline as Pro) — [App Store listing](https://apps.apple.com/ua/app/id1476732439); [APKMirror](https://www.apkmirror.com/?p=5017791)
- Export to Google Maps (listed as Pro in one store listing) — [App Store listing](https://apps.apple.com/UA/app/id1476732439)
- Real-time collaborative shared itinerary; everyone can contribute — [WhistleOut](https://www.whistleout.com/CellPhones/Apps/wanderlog-group-trip-planning-app); [insidea](https://insidea.com/spotlight/listing/wanderlog/)
- Free tier feels limiting during the trip itself, especially when offline access matters — [WhistleOut](https://www.whistleout.com/CellPhones/Guides/wanderlog-group-trip-planning-app)
- Public trip sharing / community itineraries praised as inspiration; "get inspired by guides" — [Kimola review report](https://kimola.com/reports/unlock-travel-planning-insights-with-our-wanderlog-app-report-app-store-us-151649); [Hunted/Product Hunt](https://webmail.hunted.space/product/wanderlog/launches/wanderlog-for-ios-and-android). How user guides are authored/moderated: **unknown**.
- Even a competitor (Stippl) concedes Wanderlog is "the best map-first organiser" with the stronger map interface — [Stippl vs Wanderlog](https://docs.stippl.io/blog/stippl-vs-wanderlog)

### Google Maps — Lists, Immersive View, Ask Maps, AI itineraries in Search
- Collaborative lists (Nov 2023): start a shared list from a shared place; members add places and vote with emoji (heart = must-see, thumbs-down = skip) — [Google blog Nov 2023](https://blog.google/products/maps/google-maps-updates-november-2023/); [PYMNTS](https://www.pymnts.com/news/2023/google-maps-adds-collaborative-lists-and-emojis/); [Neowin](https://www.neowin.net/news/google-maps-is-getting-collaborative-lists-better-transit-navigation-emoji-reactions/)
- Immersive View for routes (I/O 2023, rolled out Oct 2023) in ~15 cities; indoor restaurant previews via aerial + 360° — [9to5Google](https://9to5google.com/2023/10/26/google-maps-immersive-view-routes-2/); [PhoneArena](https://www.phonearena.com/news/google-maps-update-immersive-view-routes_id151997); [Android Central](https://androidcentral.com/apps-software/google-maps-shows-us-why-its-new-immersive-views-are-better). 2024–26 expansion: unknown from results.
- "Ask Maps" (announced 12 Mar 2026): Gemini conversational layer; plans road trips/vacations from one prompt with follow-ups; draws on 300M+ places incl. community reviews; US + India, iOS/Android — [Noqta](https://noqta.tn/en/blog/google-maps-gemini-ai-ask-maps-immersive-navigation-2026); [Harvard tagteam / Ars feed](https://tagteam.harvard.edu/hub_feeds/3382/feed_items/17358177); [PCWorld](https://www.pcworld.com/article/3086987/gemini-just-became-your-new-google-maps-buddy.html)
- July 2026: Ask Maps prompts surfaced inside route planning (e.g. "most scenic route"), found via app-code teardown, not official — [Ubergizmo](https://www.ubergizmo.com/2026/07/google-maps-gets-ask-maps-gemini-ai-to-plan-your-travels/)
- Hands-on Seattle itinerary test: mostly worked but produced at least one mislocated result; requires user verification — [Let's Data Science](https://letsdatascience.com/news/google-integrates-gemini-into-maps-itinerary-planning-35d9431b)
- Search AI trip plans export to Gmail, Docs or **Google Maps as a custom list**; disclaimer "Generative AI is experimental. Trip ideas may include inaccurate or misleading information." — [TechCrunch Mar 2025](https://techcrunch.com/2025/03/27/google-rolls-out-new-vacation-planning-features-to-search-maps-and-gemini); [Travel Daily News](https://www.traveldailynews.com/technology/google-debuts-new-ai-powered-travel-tools/); [PhocusWire](https://www.phocuswire.com/google-enhances-generative-ai-trip-planning-without-ads-for-now)

### Apple Maps Guides (iOS 14 → 18 → 26)
- Guides partners include Lonely Planet, Washington Post, AllTrails, The Infatuation; users can make their own guides — [MacRumors how-to](https://macrumors.com/how-to/use-guides-in-apple-maps-ios)
- Time Out supplies "custom collections" of food/drink/culture, announced WWDC June 2020 — [Time Out press release](https://www.timeout.com/about/latest-news/time-out-group-to-provide-curated-content-to-apple-maps-later-this-year-062320)
- Trust/attribution: the publisher's **logo sits on the guide cover**; tapping it lists all that publisher's guides; searching a publisher shows a button with its guide count — [iPhoneLife](https://iphonelife.com/content/how-to-browse-apple-maps-guides-publisher)
- iOS 18: Places Library saves places, curated Guides, national-park hikes, custom routes, with personal notes; hikes downloadable offline — [Tom's Guide](https://www.tomsguide.com/phones/apple-maps-just-got-smarter-in-ios-18-heres-how-to-use-the-new-features); [AlternativeTo](https://alternativeto.net/news/2024/9/apple-maps-introduces-national-park-hikes-discovery-custom-routes-and-new-places-library/)
- iOS 26: Liquid Glass refresh most visible on place listings and guide browsing; Visited Places (auto-logged, on-device, E2E-encrypted, retention 3 mo/1 yr/forever); natural-language search ("cafes with free Wi-Fi") — [MacRumors iOS 26 Maps](https://www.macrumors.com/guide/ios-26-maps); [9to5Mac](https://9to5mac.com/?p=1005770); [iGeeksBlog](https://www.igeeksblog.com/apple-maps-new-features-in-ios-26/)
- MapKit: attribution (Apple logo + legal link) kept fixed to the map, 10 pt above the card's lowest resting position — [glama mirror of Apple maps guidance](https://glama.ai/mcp/servers/@tmaasen/apple-dev-mcp/blob/b82f0efe2115dc4539c83a2374a714a84aeb350a/content/universal/maps.md)

### Roadtrippers
- Autopilot AI planner built on "38 million trips"; "Remix" regenerates suggestions; users can add own waypoints (web first) — [RV PRO](https://rv-pro.com/news/roadtrippers-updates-trip-planners-ai-feature/)
- Stops shown on map so users judge detours; up to 150 stops on higher tiers; drive-limit planning shows where to refuel/eat/rest — [Roadtrippers Android page](https://roadtrippers.com/android?); [Roadtrippers membership](https://roadtrippers.com/membership/?fpr=qd7v0)
- Free-tier stop limit inconsistent across pages (7 vs 3) — [membership](https://roadtrippers.com/membership/?via=eric22); [plus](https://roadtrippers.com/plus/?via=tom14)

### Stippl
- Route planner across cities/countries, hour-by-hour day planner, budget, journal, reels — [AppFollow listing](https://apps.appfollow.io/ios/stippl-travel-planner/6443617088?country=ca)
- Per-day map with routing between stops; timeline-led rather than map-led — [Folio (competitor)](https://folio.id/blog/stippl-alternative); [Stippl blog](https://www.stippl.io/blog/stippl-vs-wanderlog)
- Self-admitted early sync issues/crashes on older Android — [Stippl vs Wanderlog](https://docs.stippl.io/blog/stippl-vs-wanderlog)

### Layla AI
- Builds daily schedules; advertises live flight/hotel prices, weather, budget; "8M+ trips" (company claim) — [Atlas AI](https://atlasai.ma/en/ai-tools/ask-layla-ai-travel-trip/)
- Trustpilot ~3.5/5: interface praised; complaints of lost/changed itineraries and irrelevant suggestions — [Trustpilot](https://ca.trustpilot.com/review/layla.ai)

### Mindtrip
- "Slickest and most sophisticated" in AFAR test; itineraries include maps; each item links out with a preview — [AFAR](https://www.afar.com/magazine/we-tested-ai-travel-planning-apps-here-are-the-3-that-actually-worked?p=23)
- NYT tester's favourite because the interface let them **cross-check against maps, links, reviews** — [FlowingData](https://flowingdata.com/?p=75091)
- Itinerary auto-updates as flights/hotels chosen; but chatbot got dates wrong and failed a constraint repeatedly — [Craig Stoltz](https://craigstoltz.substack.com/p/four-ai-travel-planning-programs)
- Group sharing with chat/comments; partner booking (Priceline, Viator) — [Upgraded Points](https://upgradedpoints.com/news/mindtrip-ai-travel-booking-tool/)

### Airbnb (visual language reference)
- 2025 redesign: softer, more curved edges, smooth animation, new playful icons as a "universal language"; app as travel companion — [It's Nice That](https://www.itsnicethat.com/articles/airbnb-app-redesign-140525)
- 3D-rendered icons in the Homes/Experiences/Services tri-tab — the one place illustration is allowed (third-party analysis) — [opendesigner.io](https://opendesigner.io/design-systems/airbnb); [Dive Club](https://dive-club.beehiiv.com/p/shiny-grills)

### Platform guidance: sheets / detents / bottom sheets
- iOS: set `detents`; default is large only; medium+large = resizable; medium only = cannot go full height; grabber can be shown/hidden — [WWDC21 10063](https://developer.apple.com/wwdc21/10063); [WWDC Notes](https://wwdcnotes.com/documentation/wwdc21-10063-customize-and-resize-sheets-in-uikit/)
- iOS 26 glass medium-detent sheets: developers report low-contrast toolbar buttons and the sheet scaling up on interaction — [Apple Dev Forums](https://developer.apple.com/forums/thread/794998)
- Material 3: standard (no scrim, coexists with content) vs modal (scrim); anatomy = container, optional drag handle, scrim; extra-large corners; 640dp max width — [Material Components Android BottomSheet.md](https://gitea.com/784622644/material-components-android/src/branch/master/docs/components/BottomSheet.md); [Flutter BottomSheet](https://api.flutter.dev/flutter/material/BottomSheet-class.html)
- Third-party (not NN/g): visible drag handle, swipe-down dismiss, max ~90% height; dismiss via backdrop/swipe/X; no forced sheets on entry — [Prompt Index mobile design](https://www.thepromptindex.com/skill/584-mobile-design); [skills.cat ss-audit](https://skills.cat/skills/bitjaru/styleseed/engine-claude-skills-ss-audit)
- NN/g article on bottom sheets or list-vs-map: **not found** in results. Academic map heuristics exist: ten usability heuristics for interactive web maps — [SciTePress 2024](https://www.scitepress.org/publishedPapers/2024/126913/pdf/index.html); [SBC WIDE](https://sol.sbc.org.br/index.php/wide/article/view/26873)

### Clustering & list↔map sync
- Clusters hide data and force click/zoom/pan — [Neura Market](https://www.neura.market/directories/copilot/blog/devto-3510665); clustering used to dodge perf without fixing perceived perf — [PeerJ preprint](https://peerj.com/preprints/27858v1.html)
- Cluster only dense regions; hovering a result card expands its cluster / highlights its marker — [MetaLocator](https://support.metalocator.com/en/articles/1659899-map-marker-clustering)
- Hover-sync silently fails for clustered markers unless handled explicitly — [ecoinformatics #6274](https://projects.ecoinformatics.org/ecoinfo/issues/6274)

---

## PART B — Photography strategy & law

### Wikimedia Commons reuse
- Each file's licence is on its file description page; most are CC BY, CC BY-SA, GFDL or PD — [Commons:Reusing content outside Wikimedia](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia)
- CC BY-SA: credit author(s), link the licence, indicate changes; adaptations must be released under CC BY-SA — [Commons reuse/licenses](https://c.enwp.org/wiki/Commons:Reusing_content_outside_Wikimedia/licenses)
- TASL = Title, Author, Source, License; title optional under 4.0; link to deed; note modifications; TASL recommended even for CC0/PD — [CC Recommended practices](https://wiki.creativecommons.org/Best_practices_for_attribution); [CC reusing](https://creativecommons.org/reusing-cc-licensed-content/); [CC Cert 4.3](https://certificates.creativecommons.org/cccertedu/chapter/4-3-finding-and-reusing-cc-licensed-work/)
- Hotlinking is allowed but "problematic" (attribution gaps, bandwidth, fragile URLs); licence obligations still apply — [MediaWiki InstantCommons](https://www.mediawiki.org/wiki/Instant_Commons)
- Since late 2025 unidentified API clients may be throttled/blocked under the WMF User-Agent policy; since early 2026 thumbnails should use standard widths (20…330, 500, 960, 1280, 1920, 3840) — off-step sizes are strictly rate-limited — [MediaWiki InstantCommons](https://www.mediawiki.org/wiki/Instant_Commons)
- Renamed files break upload.wikimedia.org hotlinks (redirects not followed) — [Phabricator T37721](https://phabricator.wikimedia.org/T37721)
- Wikidata P18 = representative Commons image; returns bare filenames — [Wikidata P18](https://www.wikidata.org/wiki/Property:P18); [kmjn notes](https://kmjn.org/notes/images_from_wikidata.html); [Phabricator T428224](https://phabricator.wikimedia.org/T428224)

### Freedom of panorama (FoP)
- Commons requires proof of release for buildings in no-FoP countries — [Commons:Freedom of panorama](https://commons.wikimedia.org/wiki/Freedom_of_panorama)
- **US**: 17 USC §120(a) lets anyone photograph/publish buildings visible from a public place — [Justia §120](https://law.justia.com/codes/us/title-17/chapter-1/sec-120/); [BitLaw](https://www.bitlaw.com/source/17usc/120.html). Sculptures/murals not covered (from general knowledge, not a search result — verify).
- **Germany**: generous §59 Panoramafreiheit; not from private vantage points — [Dandi](https://dandi.media/en/freedom-panorama-france-germany/)
- **France** (2016): narrow — architecture & sculptures on public roads, natural persons, **non-commercial only** — [Dandi 2016 reforms](https://www.dandi.media/en/freedom-of-panorama); [Policy Review](https://policyreview.info/articles/analysis/public-artworks-and-freedom-panorama-controversy-case-wikimedia-influence)
- **Belgium** (2016): commercial + non-commercial allowed, with limits — [Dandi](https://www.dandi.media/en/freedom-of-panorama)
- **Japan**: Art. 46 covers architecture and outdoor artworks, except reproduction solely to sell copies; Commons treats modern Japanese public art as non-free — [Itsartlaw](https://itsartlaw.org/2016/03/30/smaller-world); [Commons 19th-c. statues in Japan](https://commons.wikimedia.org/wiki/Category:19th-century_statues_in_Japan)
- **Singapore**: FoP covers buildings and 3D works, **not 2D** (murals, billboards, signs) — [Commons CRT/Singapore](https://c.enwp.org/wiki/Commons:CRT/Singapore); [ESEAP 2024 talk](https://meta.wikimedia.org/wiki/Talk:ESEAP_Conference_2024/Submissions/Free_the_Freedom_of_Panorama_in_ESEAP)
- **Vietnam**: no FoP in any category (table dated 2024-05-29) — [ESEAP 2024 talk](https://meta.wikimedia.org/wiki/Talk:ESEAP_Conference_2024/Submissions/Free_the_Freedom_of_Panorama_in_ESEAP)

### Unsplash / Pexels
- Unsplash: cannot compile photos to replicate a similar/competing service; identifiable people may need consent — [Pixsy guide](https://pixsy.com/image-licensing/unsplash-guide); [LicenseOrg](https://licenseorg.com/blog/free-stock-photos-licensing-traps); official text: [Unsplash help](https://help.unsplash.com/en/collections/1463188-unsplash-license) (body not retrieved)
- Pexels: no commercial use of depicted trademarks/logos re goods & services; "Don't imply endorsement of your product by people or brands on the image"; no portraying people in a bad light; no political use; no releases or indemnity — [Pexels ToS](https://pexels.com/terms-of-service); [Pexels rules](https://help.pexels.com/hc/en-us/articles/360042332714-What-are-the-rules-for-using-Pexels-photos-or-videos); [LicenseOrg](https://licenseorg.com/blog/free-stock-photos-licensing-traps)
- Implication for a venue guide: a generic stock "ramen bowl" next to a named restaurant **implies it is that venue's food** — a fabrication by juxtaposition (inference, not from a source).

### Restaurants, logos, publicity
- Travel/city guide photos are likely editorial; logos visible from public property generally OK editorially, riskier in ads/endorsement contexts — [ThePhotoForum](https://www.thephotoforum.com/threads/publishing-photos-of-businesses.330036); [Getty editorial-only example](https://www.gettyimages.com/detail/photo/mountain-mike-pizza-sign-and-logo-above-the-royalty-free-image/2042021303)
- Right of publicity applies to identifiable people, not buildings; claims also via false endorsement — [Modern Restaurant Management](https://modernrestaurantmanagement.com/one-hidden-legal-risk-in-restaurant-marketing/); [BCLP](https://www.bclplaw.com/print/v2/content/23019/woman-claims-her-picture-is-worth-2-billion-in-right-of-publicity-suit.pdf)

### OpenStreetMap / ODbL
- Attribution needed when a Produced Work is used publicly; must be visible without interaction, near the work (corner of map) — [OSMF Attribution guideline](https://osmfoundation.org/wiki/Attribution); [OSMF Licence FAQ](https://osmfoundation.org/wiki/Licence_and_Legal_FAQ)
- Standard tiles are a Produced Work: attribute; no share-alike unless data extracted; tile usage policy applies — [OSMF Licence FAQ](https://osmfoundation.org/wiki/Licence_and_Legal_FAQ)
- "© OpenStreetMap contributors" is the common convention — [Phabricator T111224](https://phabricator.wikimedia.org/T111224)

### Illustration/typography-led travel brands
- Herb Lester: pocket fold-out illustrated maps; "a specific lens on a city", less geographic precision; commissioned illustrators — [Metropolis](https://metropolismag.com/projects/pocket-sized-maps-part-infographic-part-travelogue/); [Herb Lester guides](https://www.herblester.com/pages/our-guides)
- Wallpaper* City Guides: tabbed sections, colour-coded city maps — [Rizzoli](https://www.rizzolibookstore.com/product/wallpaper-city-guide-helsinki-2014)
- Louis Vuitton City Guides: per-city colour coding, vintage luggage-label box, Futura; 2025 resort guides illustrated by named artists (Collette, Molas, Fatchurofi, Morgand) — [Lovely Package](https://lovelypackage.com/louis-vuitton-city-guide); [Livres Hebdo](https://www.livreshebdo.fr/article/nouveau-format-pour-les-guides-de-voyage-louis-vuitton); [arun.is](https://arun.is/blog/lv-city-guides/)
- Monocle guides: design/architecture pages, neighbourhood walks, hardback — [Globetrender 2015](https://globetrender.com/2015/11/10/lifestyle-curation-the-rise-of-the-designer-city-guide/). Monocle illustration style, Kinfolk: **unknown** (not searched / not found).

### Generative AI imagery
- Icelandair (interested party) survey: 33% felt deceived by edited/misleading imagery; only 19% would book if main images were AI — [Hotel Online](https://www.hotel-online.com/press_releases/release/ai-in-tourism-faces-backlash-as-consumer-sentiment-sours-icelandair-study-reveals/)
- Celebrity Cruises AI brochure called "false advertising"; Booking.com 2026 AI ads backlash despite disclosure — [The Cool Down](https://thecooldown.com/green-tech/celebrity-cruises-ai-brochure-backlash); [Rental Scale-Up](https://www.rentalscaleup.com/booking-com-ai-advertising-backlash-2026/)
- EU AI Act Art. 50 in force 2 Aug 2026: deepfakes (incl. realistic depictions of existing **places/objects**) must be disclosed at first exposure; fines to €15M/3% — [SRD Rechtsanwälte](https://www.srd-rechtsanwaelte.de/en/blog/deepfake-labelling-under-the-ai-act-what-the-new-eu-guidance-clarifies); [Mondaq](https://www.mondaq.com/advertising-marketing-branding/1825496/eu-ai-act-guidance-expands-ai-disclosure-rules-for-advertisers-and-pr-teams); [didit](https://didit.me/blog/eu-ai-act-deepfake-labelling-2026/)
- Counterpoint: small study (N=68) found AI images rated more credible — [Journal of Smart Tourism](https://journals.sagepub.com/doi/reader/10.1177/27652157261470079)

---

## Recurring patterns
1. **Map + list are one object**: order in the list = line on the map (Wanderlog numbered route lines; Stippl per-day routing; Roadtrippers stops-on-route). — Wanderlog/Stippl/Roadtrippers sources above
2. **Day as the unit of itinerary**, with per-day travel totals and drag-reorder + one-tap optimise. — Wanderlog
3. **Save → list → share → vote**: lightweight collaboration (emoji votes, comments) beats full co-editing for groups. — Google Maps lists, Mindtrip
4. **Curated guides carry a visible publisher mark** (logo on cover, tap to see more from that publisher) — attribution is a navigation affordance, not fine print. — Apple Maps Guides
5. **AI planners win on verifiability, lose on hallucination**: favourite planner was the one letting users cross-check against maps/links/reviews; Google labels outputs as possibly inaccurate; Ask Maps mislocated a place. — Mindtrip/FlowingData, Google
6. **Bottom-sheet over map** as the mobile pattern: medium detent keeps map visible, large for detail; standard (non-modal) sheet coexists with the map. — HIG/WWDC21, Material 3
7. **Attribution pinned to the map**, never hidden behind interaction (Apple MapKit, OSMF). 
8. **Cluster sparingly** and sync list hover/tap to marker, including inside clusters. — MetaLocator, ecoinformatics
9. **Offline is the trip-time pain point**; paywalling it frustrates users. — WhistleOut
10. **Softer, rounder, illustrated system** (Airbnb 2025 3D icons) — illustration used for categories, not to fake places.
11. **Design-led guides lean on colour-coding + type + illustration, not photos** (LV per-city colours, Wallpaper* colour maps, Herb Lester illustrated maps).

## Photography options + legal notes
| Option | Fit for "no fabrication" | Legal notes |
|---|---|---|
| **A. Typographic/illustrated cards (no photos)** — cuisine glyphs, area colour, source badges | Best: nothing implies "this is the venue" | No licensing risk. Precedent: LV / Wallpaper* / Herb Lester. |
| **B. Commons/Wikidata P18 images for landmarks** (museums, parks, bridges) | Good where the file really depicts the subject | TASL credit per image, link licence, note crops; BY-SA adaptations stay BY-SA. FoP: US/DE fine for buildings; FR non-commercial only; SG not for 2D murals/signs; **VN no FoP** — check each file's FoP template. Hotlinking allowed but use standard thumb widths, identifying UA, cache the file metadata; renamed files break links. |
| **C. Stock (Unsplash/Pexels) "mood" images** | Risky: next to a named venue it implies that venue's food/room | Pexels forbids implying endorsement by brands/people; trademark/logo commercial limits; no releases. If used at all, only for generic city/cuisine headers, labelled "illustrative". |
| **D. Own/contributed photos of exteriors** | True but costly | Editorial use of signs from public property generally low-risk; avoid identifiable people (publicity); don't use in ads. |
| **E. OSM-derived map art / static mini-maps per place** | Excellent — it's real data | ODbL: visible "© OpenStreetMap contributors" near the map; tile usage policy for OSM tiles. |
| **F. Generative AI imagery** | **Reject** — fabricates places | EU AI Act Art. 50 (from 2 Aug 2026) requires disclosure of realistic AI depictions of real places; consumer backlash even with disclosure. |

Recommended stack: A + E everywhere, B only for landmarks with verified licence/FoP and visible TASL captions, never C/F beside a named venue.
