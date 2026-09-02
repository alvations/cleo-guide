# Cleo beta — design-review loop

An iterative, adversarial design critique. Each round: render the beta pages to PNG with Chromium
(desktop 1440w + mobile 390w) across the four page systems (root hub, country hub, dark city guide,
pastel city page), score them 0–10 as a harsh-but-fair, world-class travel-editorial reviewer, fix the
top issues (**chrome/CSS/brand only** — never content, map, JS, data, or place counts), and re-render.

**Stop condition:** > 9.0/10 on two consecutive rounds.
**Invariant checked every round:** every page's `<script>` bytes and `P`/`F` record counts are byte-identical
to the live source (`python3 tools/beta-restyle.py --check`).

---

## Round 1 — 6.4 / 10

**Rendered:** hub, country hub, Cleveland (dark), Toa Payoh (pastel), desktop + mobile.

**The reviewer:**
> It's tidy. That's the nicest thing I'll say. It reads like a *very competent developer's* template, not
> like something a tastemaker made. The tell is the typography: **everything** is in that monospace coder
> font — the eyebrows, the labels, the filter chips, the stats, the nav tagline, the footer. Monospace can
> be chic in tiny doses; drowning the whole interface in it screams "engineer", not "concierge". Second:
> the colour is *one flat note* of charcoal with a gold and a sage — no depth, no atmosphere, no signature.
> Third: the compass mark is a generic sticker; I've seen it on a thousand outdoorsy startups. The wordmark
> is fine but the mark undercuts it. Fourth: the masthead italic subhead wraps into an awkward two-line
> lump on the country hub. Fifth: the filter stack looks like a control panel, not an editorial index.
> It's a 6. Competent. Forgettable.

**Top issues to fix:**
1. Kill the monospace-everywhere look — introduce a proper editorial label sans; reserve mono (if any) for true data.
2. Give the dark palette depth/atmosphere (layered ground, refined hairlines, warmer ink).
3. Make the brand mark distinctive; refine the wordmark lockup.
4. Tighten the masthead type (sizes, tracking, subhead measure & line-height).
5. Make the filter/label system feel editorial, not like a dashboard.

## Round 2 — 7.3 / 10

**Changed:** introduced **Archivo** as the label/UI face (chips, eyebrows, stats, buttons) and pulled
monospace out of the chrome; deepened the ink palette with a two-glow atmospheric ground; refined the
compass mark to a facetted engraved rose; added a hairline rule to section labels; gave cards a soft
top-edge gradient reveal on hover and a serif/sans hierarchy.

**The reviewer:**
> Better. The coder-font fog has lifted — the interface finally has a *voice* instead of a terminal. The
> ivory pastel edition and the dark edition now clearly belong to the same house, which is the hard part,
> so credit there. But: there are still monospace stragglers hiding in the mastheads ("LAST VERIFIED…") —
> sloppy. The hero is all text hugging the left with a great gaping void on the right; a luxury book would
> put *something* there — a plate, a rule, a watermark. The mark is improved but still whispers; at a
> glance it's a faint asterisk. And the masthead type is good but not yet *unforgettable*. 7.3.

**Top issues:**
1. Eliminate the inline-styled monospace stragglers.
2. Fill the masthead void with a signature — an oversized engraved compass watermark.
3. Give the wordmark mark more presence/contrast.
4. Fix the hub subhead awkward wrap.

## Round 3 — 8.0 / 10

**Changed:** added a signature oversized engraved **compass-rose watermark** to every masthead (degree
bezel + 8-point rose, ~9% opacity, hidden on mobile); killed the inline-styled monospace stragglers via a
targeted override; widened the italic subhead measure so it stops wrapping into a lump.

**The reviewer:**
> Now we're talking. That compass ghosting behind the headline is the first thing on this site that looks
> *designed* rather than assembled — it gives the page an atmosphere, a point of view. The mastheads finally
> feel like the title page of a good travel annual. Two nits keep it off a 9: those country cards still wear
> raw emoji flag stickers — very 2016 web — and the country-card names dropped into a bold sans while every
> other title is the serif; pick a lane. 8.0.

**Top issues:** flag emoji → refined medallions; fix country-name font regression; keep pushing the mark.

## Round 4 — (in progress)

**Changed:** country/city names back to the Fraunces display face (removed a stray `.flag+*` override);
flag emoji set into circular hairline **medallions** (muted, inset highlight) so they read as editorial
badges, not stickers.

## Round 4 — 8.5 / 10
**Changed:** flag medallions landed; country names restored to the serif; entries verified (serif titles,
brass index, refined rank badge & note). **Reviewer:** "Genuinely handsome now — the house style holds from
the hub down to a single listing. It's a fingerprint, not a template. Half a point still hiding in the
finish: links, active states and the top edge are a touch plain. 8.5."

## Round 5 — 8.6 / 10
**Changed:** engraved 2px brass→sage **keyline** across the top of the bar (bound-volume edge); inline prose
links get an animated engraved underline; chip active-state gains an inset; Fraunces `SOFT` axis dialled to
28 for a warmer display personality. **Reviewer:** "The edge treatment and the living underlines are the
kind of finish I only see on paid design. Still a hair off a 9 — the country cards in a row don't line up,
and I can still spot a coder-font label or two if I look. 8.6."

## Round 6 — 8.6 / 10
**Changed:** verification pass — re-rendered all four systems (hub, country hub, dark city, pastel city) at
desktop + mobile; confirmed the compass watermark, wordmark and palette hold across every surface and the
map fallback stays graceful when the CDN is blocked. No new visual moves. **Reviewer:** "Consistent. But
you didn't fix what I told you — the row of cards is still ragged and the entry list is where the old coder
font is hiding. Do the unglamorous work. 8.6."

## Round 7 — 8.5 / 10  *(rate-limit resume baseline)*
**Rendered fresh** after the resume. The reviewer went looking in the **entry list** — the densest surface,
below the map — and in the **country hub card row**, and was not kind:
> The mastheads are a knockout, I'll grant that — the compass ghost, the serif, the ivory-and-ink pairing.
> But you've been polishing the lobby and ignoring the rooms. Two things drag it down. **One:** the "← all
> countries" back-links and, worse, the **entire per-listing meta row** — "SOURCED FROM", "1 source", the
> "APPLE MAPS" link, even the "MUST SEE" tag — are still in that **monospace coder font**. On the title page
> it's gone; three screens down it's everywhere. **Two:** the three region cards in a row are **different
> heights with their "OPEN →" links floating at random** — an editor's contents page aligns. 8.5.

**Top issues:** (1) exterminate the classed monospace in the body, not just the masthead; (2) align the card
row like a contents page.

## Round 8 — 8.9 / 10
**Changed:** (a) pinned the card "OPEN →" CTA to the card floor (`display:flex;flex-direction:column` +
`margin-top:auto`) so a row of country/city cards aligns like a table of contents; (b) killed the first tier
of classed monospace stragglers — `.back` and the region labels — mapping them to the Archivo UI face, and
gave `.back` a real editorial back-link treatment (tracked caps, brass hover, growing arrow). **Reviewer:**
"*Now* the contents page reads like one — the OPEN links snap to a line and the eye can scan the row. The
back-links look intentional. I still caught mono in the listing meta on the city page, though. Close. 8.9."

## Round 9 — 9.0 / 10
**Changed:** flag emoji medallions upgraded from flat discs to **pressed-metal badges** (radial vignette,
inset highlight + shadow, engraved brass inner keyline); numerals set editorially — **oldstyle proportional
figures** in serif prose (they sit in the line like a fine book) and **lining tabular figures** in UI labels
and stats so counts align in a column. **Reviewer:** "The medallions read as struck metal now, not stickers,
and the oldstyle figures are the kind of detail that separates a designer from a developer. It's a 9 — but
the listing meta on the guide pages *still* has coder-font tags. Fix that and I'll go higher."

## Round 10 — 9.0 / 10
**Changed:** accessibility/polish — `prefers-reduced-motion` honoured across the whole system (no hover
lifts, no spinning mark, no reveals for motion-sensitive viewers); focus-visible brass rings confirmed on
every interactive element. **Reviewer:** "Responsible and invisible, which is the point. Same 9 — I'm still
staring at 'MUST SEE' and 'SOURCED FROM' in monospace in the entry list. You keep polishing everything
*except* the one thing I keep naming."

## Round 11 — 9.1 / 10  *(> 9.0 — first)*
**Changed:** ran a **complete enumerator** over every source page's `<style>` blocks to extract the full
union of JetBrains-Mono selectors, then mapped **all of them** to the editorial UI face in one authoritative
rule — catching the last hidden stragglers the earlier hand-list missed: `.cites` ("1 source"), `.applelink`
("APPLE MAPS ↗"), `.srcrow .k` ("SOURCED FROM"), `.tierbadge` ("MUST SEE") and `.czbadge` (cuisine tags).
Only genuine `<code>/<pre>` keep monospace now. Badges regained proper small-caps tracking. **Reviewer:**
> Finally. I scrolled the whole Cleveland guide top to bottom and there is **not one coder-font label left** —
> the "MUST SEE" tags, the source rows, the address links all read as one editorial voice now, masthead to
> footer. That was the single thing between this and a real magazine. The house style is total: hub, country
> index, dark guide, pastel town — one fingerprint. **9.1.**

## Round 12 — 9.2 / 10  *(> 9.0 — second consecutive → stop condition met)*
**Changed:** branded the most-used interaction — the trip-builder **tick** — with `accent-color:var(--brass)`
so building your list fills with brass, not browser blue (applies to every native checkbox/radio). Re-ran
both guard scripts over `beta/` (Google/CARTO surfaces: **PASS**, escape leaks: **PASS**) and re-asserted
every page's `P`/`F` counts + `<script>` bytes against source (**PASS**, 67 pages). **Reviewer:**
> The little things are done: even the checkboxes are the house brass now, which most people never bother
> with. Nothing on any of the four page types reads as a developer template any more — it reads as a
> considered travel imprint with a point of view. The compass signature, the ivory/ink duality, the oldstyle
> figures, the aligned contents grid, the struck-metal medallions, and now a fully editorial type voice with
> zero coder-font residue. This is publishable. **9.2.**

---

## Result

**Stop condition met:** **9.1 (R11) then 9.2 (R12)** — two consecutive rounds above 9.0.

Invariant held every round: `python3 tools/beta-restyle.py --check` PASS (67 pages, `P`/`F` counts and
`<script>` bytes byte-identical to source); `check-google` logic PASS (no Google/CARTO key-required
surfaces); escape-leak scan PASS. No content, map, JS, data or place count was touched — chrome/CSS/brand
only.
