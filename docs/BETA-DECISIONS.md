# Beta decisions

> **Owner:** PM lane. The charter says "never stop to ask; make the call, then record it". Each entry answers an
> open question from the research and gives the default the team builds to. The owner can override any of them;
> the **Reversal cost** column says what that would take. Sources: Salon §8
> ([`ux-2026-10`](../design/ux-2026-10/README.md#8-decisions-for-the-owner)), SWOT §9
> ([`swot`](../design/research-2026-10/swot/README.md#9-open-questions-for-the-owner)), and the UX teardown's
> "calls made" and §6–§8 ([`ux-competitive`](../design/research-2026-10/ux-competitive/README.md)).
>
> Wave 0 · 2026-10-10. Append new decisions with the next number; never rewrite an old one — supersede it.

## Direction and brand

| # | Question (source) | Decision | Why | Reversal cost |
|---|---|---|---|---|
| D-01 | Which direction: Salon A, B, C or a mix? (Salon §8 Q1) | **Salon's information architecture and trust components, with a new visual layer.** Keep: inventory-first, split view, detail sheet, "Recommended by", reorder-only "for you", day plan. Replace: the text-column look, with collection rails, typographic + map-art covers, a tier glyph ladder, per-city skins and functional delight. A **new engine** under `tools/beta/`, not a re-skin. | The teardown's verdict (UX §7.2): Salon meets P1/P11/P13/P17/P20 but still reads as "a column of text cards", and the owner rejected re-skins ("looks NOTHING like Airbnb"). | Low: the visual layer sits on tokens. |
| D-02 | Brand name: keep Cleo or rename? (Salon §8 Q2; SWOT Q11) | **Keep "Cleo"** with the existing original wordmark. Tagline: **"Every pick is sourced."** | The wordmark is original and has no borrowed trade dress (UX §7.1). The tagline states the one asset nobody else holds (SWOT §1). A rename is a brand exercise for the owner, not a blocker for beta. | Low: the name is a token and a header component. |
| D-03 | Light-first or dark-first? (Salon §8 Q3; UX C3) | **Light-first.** Night edition follows the system setting, with a toggle. Both themes must pass contrast. | The brief asks for daylight wanderlust; the teardown found no evidence that dark mode is table stakes; the ink-and-brass mood read as "hotel bar after hours" (UX §7.1(5)). Night stays because the beta already has a working dark palette. | Low: a token swap. |
| D-04 | Typography (UX M7) | **Constraint:** exactly 2 families (a display serif that renders macrons and diacritics, plus a humanist sans), sentence case, CJK system fallback. **Default suggestion:** Salon's Newsreader + Figtree. The designer makes the final pick in M0-01 within the constraint. | Salon proved this pair renders "Sensō-ji" correctly; the constraint is what the benchmark measures. | Low. |
| D-05 | Should Singapore/Vietnam keep the pastel edition? (Salon §8 Q6) | **Fold into the one system as a regional skin** (pastel accent tokens on the shared frame), not a third engine. | One system with local skins is the leaders' pattern (UX P8: Belmond, Expedia). A separate engine triples QA. | Medium: would need a second template. |
| D-06 | How much brass / accent? (UX P5) | **One accent per city skin, spent only on actions and distinctions.** Never on eyebrows, borders or decoration. | UX P5, §7.1(2). | Low. |

## Information architecture

| # | Question (source) | Decision | Why | Reversal cost |
|---|---|---|---|---|
| D-07 | Can we move "Filter by source", rank and been-there off the main stack? (Salon §8 Q4) | **Yes.** They move into the filter tray (nothing removed; a parity table proves it). **Sources become navigation instead:** tap a source on any card to see "Everything {source} recommends here". | NN/g faceted search (UX P15); the source filter "exposes the audit trail as a primary filter" (UX §7.1(2)); Apple Maps Guides turn the publisher into a door (UX P20). | Low. |
| D-08 | Concierge default: ribbon prompt or auto-open picker? (Salon §8 Q5) | **Ribbon prompt only.** The first screen is inventory; the picker opens on tap. | An auto-opened picker would push the first place below the fold and fail P1/M1. | Low. |
| D-09 | Top-level model | **Three tabs:** Sights · Eat & drink · Your day (Your day appears with M2). No more than three. | Airbnb's three-tab take, and the critic's "may feel cluttered" warning (UX §4.1). | Low. |
| D-10 | Tier names and ladder | **Must see · Worth the detour · Deep cut**, three original glyphs, always "within {area}". Closed places never show a tier glyph. | UX §4.5 and §5; tiers are graded within region (CLAUDE.md). Michelin's glyphs are never imitated. | Low. |
| D-11 | Long lists: paginate? | **No pagination.** Progressive rendering is allowed only if every place stays reachable by scroll, filter, search and deep link; the metrics harness checks reachability is 100%. | Charter rule 1; QA D5. | n/a (rule). |
| D-12 | Desktop split-view breakpoint | **≥ 1024 px** split view; below it, list-first with map toggle. | UX P11 recommends split view at ≥ 1024 px. | Low. |

## Imagery

| # | Question (source) | Decision | Why | Reversal cost |
|---|---|---|---|---|
| D-13 | Photos or not? (SWOT Q3; UX §6) | **M1: no photographs.** Typographic covers + build-time map art from verified pins + original collection glyphs (UX §6 A, B, C). **M3: Wikimedia Commons, landmarks only**, with TASL credits, freedom-of-panorama check, none in Vietnam, gated on a `data/images.json` registry filed as **LP-02**. **Never** stock beside a named place, never AI, never scraped, never anime frames. | Honesty first (charter rule 3); Louis Vuitton, Wallpaper* and Herb Lester show it can look luxurious (UX §6). Commons needs a data registry, which beta may not write. | Medium: Commons needs the LP-02 pipeline. |

## Personalisation and planning

| # | Question (source) | Decision | Why | Reversal cost |
|---|---|---|---|---|
| D-14 | Itineraries: computed or hand-curated? (Salon §8 Q7) | **Computed suggestions**, clearly labelled "Suggested by the guide from sourced picks — check hours before you go". Built per area from open, pinned places only; legs are straight-line distances, labelled as such. Hand-curated days can override per city later. | Hand-curating 80+ pages blocks the milestone; computation over sourced records stays deterministic and honest (SWOT §6). | Low: a curated day is just a fixed id list. |
| D-15 | How does "for you" work? (UX P17, S6; SWOT gap #2) | **Reorders, never hides.** Interests map to collection and cuisine ids only, never to keywords (the Wenwen rule). Every lifted card says why. | UX P17; CLAUDE.md editorial rules. | n/a (rule). |
| D-16 | "Your guide's note" vs keyword `k` (UX §7.2(4); Salon audit) | **Display rule:** `k` renders as "Your guide's note" only when it reads as prose (ends in sentence punctuation and has more than 6 words); otherwise it renders as "Look for:" tags. Documented in VOICE.md. A proper data flag is filed as **LP-04**. | A butler that speaks in tags feels broken (UX §7.2(4)). This is formatting, not invention. | Low. |

## Strategy questions (SWOT §9)

| # | Question | Decision for beta | Why | Reversal cost |
|---|---|---|---|---|
| D-17 | Analytics? (Q2) | **None in beta.** Success metrics that need traffic are marked "unmeasured" in BETA-QA; product quality is measured by the metrics harness. | A third-party script is an owner decision; beta must not add a network dependency. | Low: one non-blocking script later. |
| D-18 | Goal: public good, brand or business? (Q1) | **Build as a brand and public good.** No monetisation features in beta. | Nothing in M1–M3 depends on revenue; adding it later must not change ranking. | Low. |
| D-19 | Affiliate rules and networks? (Q4) | **No affiliate links in beta.** If the owner later wants them, adopt the SWOT §6 five rules verbatim (only after a place passes the gates; never changes rank; visible label; prefer official site; disclosure page). | Brand-dilution risk (SWOT §7); not needed to beat the benchmark. | Low. |
| D-20 | Pause new countries? (Q5) | **Beta adds no cities and no data.** We recommend the pause for live, but that is the owner's call outside beta. | Charter scope. | n/a. |
| D-21 | Closed places in structured data | **Omitted from JSON-LD** (the page still shows them, flagged). | A `Restaurant` item in JSON-LD reads as a live business to machines; that would contradict rule 4c. | Low. |
| D-22 | Pop-culture scope (Q6) | **A generic "★ signature collection" component.** Japan anime first (about 103 records); any city's ★ collection uses the same rail. Extending pop culture to US film/music is a data job (**LP-06**). | The component costs nothing extra; the data must go through the gates. | Low. |
| D-23 | Languages (Q7) | **M3 ships scaffolding only:** a string catalogue, `lang`/`hreflang`, and a pseudo-locale test. The first reviewed locale is **Japanese**, then **Simplified Chinese**, then **Korean**; UI chrome only. The switcher stays hidden until a locale is human-reviewed. No machine-translated prose. | SWOT gap #9; machine translation without review would be quiet fabrication. | Low. |
| D-24 | Open data `places.json` (Q8) | Beta emits per-city JSON indexes **as app assets**, with **no open-licence claim** until the owner decides on CC BY 4.0. JSON-LD ships regardless. | The licence is a legal and strategic call; the indexes are needed for search and offline anyway. | Low: add a licence file. |
| D-25 | Contributors (Q9) | **"Suggest a correction"** link on every sheet files a GitHub issue (the existing hub pattern). | No server; gives the UGC impulse an honest outlet. | Low. |
| D-26 | Newsletter (Q10) | **Atom feed only** (M3-07). | No third-party provider without owner consent. | Low. |

## Program mechanics

| # | Question | Decision | Why |
|---|---|---|---|
| D-27 | Which pages prove M1? | **Pilot set:** `beta/cleveland.html` (the page the owner reacted to; validator invariants), `beta/cities/tokyo.html` (★ layer, native script, 488 places), `beta/cities/newyork.html` (largest), `beta/Singapore/chinatown.html` (pastel skin), `beta/cities/wheeling.html` (smallest US), plus the beta hub. Then M1-22 rolls out to every beta page. | It covers the extremes of size, script, skin and data shape. |
| D-28 | Where does beta data come from? | **The same data as live, read-only**: the live built pages (the only home of Cleveland's records) plus `data/geocodes.json`, `data/sources.json` and `data/countries.json`. The RFC (M0-02) picks the mechanism; the generator asserts counts and names against live. | Charter "Scope" and rule 1. |
| D-29 | Phase-0 audit fixes (Salon §8 Q8) | **Do them in the beta generator now** (M1-08 closed with no tier, M1-20 computed counts and placeholder, M1-03 empty Food mode). For live, file **LP-01**. | Beta may not touch live; the fixes are cheap in a new generator. |
| D-30 | When can beta deploy? | Only when the PM has accepted a milestone against [`BETA-BENCHMARK.md`](BETA-BENCHMARK.md) **and** QA has signed off in `docs/BETA-QA.md`. The orchestrator deploys; no lane opens or merges a PR. | Charter "Deploy". |
| D-31 | Where is the benchmark? | [`BETA-BENCHMARK.md`](BETA-BENCHMARK.md), owned by the PM. Rows change only by a new decision here. | One fixed bar, so "done" can't drift. |

## Rounds 2–3 (PM, 2026-10-10, head `10615ab2`)

| # | Question | Decision | Why | Reversal cost |
|---|---|---|---|---|
| D-32 | How do we name things now that the owner has ruled on naming (program rule 6)? | **Neutral naming in all new work.** From Round 3 on, no third-party travel, hotel, review or guidebook brand or style is named, referenced or alluded to. This covers docs, briefs, backlog rows, benchmark rows, code, comments, CSS class names, filenames, commit messages and UI copy. New text says "the leaders in the teardown" or names the pattern itself (for example "split view with sticky map", "category rows", "bottom sheet"), never the product. **Exempt:** source attribution (a place recommended by a named publication keeps that credit on its card and in source views), and research, evaluation and Wave 0–2 docs written before the rule, which keep their citations as evidence. Those older rows are not rewritten, and a status-only update leaves their text alone. Any row whose criteria are newly written or rewritten uses neutral wording. QA adds a rule-6 scan over new files (M4-09). | Owner rule, 2026-10-10. Neutral pattern names also describe the requirement better than a brand does, because the benchmark measures behaviour, not resemblance. | Low: it is a wording rule. |
| D-33 | View styles: how do four views fit the trust model? | **The four views are lenses over one record set.** Gallery (art-led category rows), Atlas (the map-centred default plus a ranked-list tray), Guidebook (area chapters) and Insights (captioned SVG charts). They share one filter model, one sheet and one computed summary line. The view lives in the URL hash (`view=`, omitted at the default, validated). The last view is only a stored preference. **Paging is allowed only with page numbers, an "all N places" total and Show all**, and search, filters, deep links, print and JS-off must reach every record in every view (rule 1). Charts account for 100 % of records and act as filters. They chart only data fields: no ratings, prices or popularity. Atlas stays the default until Round 3 QA signs every view. Items M4-01…M4-09; rows B-46…B-49. | Owner request, 2026-10-10. The study of the owner's own site (`design/beta/views/STUDY.md`) shows the lens pattern keeps filters and the count stable across views. Our paging rule is stricter than the study's because no place may be hidden. | Medium: the switcher and hash key are cheap to drop, but each view is a template to maintain. |
| D-34 | Day plans: who computes them? | **One computation.** Platform's build-time `guide.days` index (D-14) is the source of truth. FE-A's renderer either reads it, or a test proves the two produce identical plans. Today they disagree: 164 vs 170 plans. | Two algorithms will drift and show different "suggested" days for the same area, which undercuts the honest label. | Low. |
| D-35 | M1 acceptance with measured gaps | **No criterion is waived.** M1-16's axe-core check has never been measured, so M1-16 is rejected until QA adds an offline axe run to `beta:metrics` (acceptance protocol: no measurement means reject). B-06, B-07 and B-16 are "in re-test" against FE-A `0f0f7b6e`. M1 deploys only after a "QA sign-off: YES" on a green head (D-30). | Keeps "done" from drifting (D-31). | Low. |
