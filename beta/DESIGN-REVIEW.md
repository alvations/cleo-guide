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

## Round 5 — (in progress)
**Changed:** engraved 2px brass→sage **keyline** across the top of the bar (bound-volume edge); inline prose
links get an animated engraved underline; chip active-state gains an inset; Fraunces `SOFT` axis dialled to
28 for a warmer display personality.
