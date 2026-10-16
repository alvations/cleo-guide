# Designer (W7) checkpoint

- **Branch:** `claude/peaceful-goodall-i0hsrt`
- **Orchestrator:** session_01PCNcUkfa5S1N1BKGzZA4xx
- **Lane session ids:** in `docs/BETA-RESUME.md`
- **Updated:** 2026-10-16

## Task

The designer owns three things:
- design system v2: `design/beta/tokens.css`, the `design/beta/css/{contract,views,v2}.css` base layer and `beta/assets/constellation.css`, all built into `beta/assets/cleo.css` by `design/beta/tools/build-css.py`;
- the Atlas spec, `design/beta/atlas/SPEC-v3.md`;
- the casing rule, in `design/beta/casing/`.

Current rows:
- **QC-14** (spacing on the 4-pt scale): the designer files are done. The lanes run the tool after their own priority rows.
- **QC-09** (phone view switcher): the spec is written; FE-A builds it.
- **FE-A food covers** (W8 gap 5): reviewed and signed off with three changes.
- **Atlas review loop**: SPEC-v3 rev 4 folds in PANEL-R2 (70.9). FE-1 and FE-2 are building it toward panel round 3.

## Done (SHAs)

- **QC-14:** 82946f4f (merge). 240 values snapped and 521 tokenised in the designer CSS. The tool is `design/beta/tools/snap-spacing.py`.
- **QC-09 spec, switcher selectors and `--cover-food`/`--cover-sight` tokens:** d90233b8 (merge). The spec is DESIGN-SYSTEM §v2.11.
- **Food-cover review:** sent to the orchestrator, who relayed it to FE-A. The three changes:
  - use `var(--cover-food)`;
  - cap the cover word at `--fs-d2`;
  - the cover word is never a source name, and it never repeats the kind line.
- **SPEC-v3:**
  - rev 4 (PANEL-R2): b22d544e
  - rev 3 (PANEL-R1): 55a43890
  - rev 2 (PANEL-R0): cd327e9f
  - §10 one-up: 195c41ea, 4e9e2051
- **Tokens:** tracking and ring tokens in 8ca6dea6.
- **Views SPEC §3.4 Insights link rule** (plain bars for measures, footnote why, W9-1 recognised chart): f0497626. QC was told.
- **QC-09 verification and the corrected < 300 px spec:** 7878c6f1.

## Next

1. **QC-14 follow-up.** Re-measured on 2026-10-16 with snap-spacing.py:
   - fe-a.css: 0 off-scale (287240c2).
   - fe-b.css: 0.
   - fe-c-trip.css: 0.
   - designer CSS: 0.
   - **Only atlas.css is left: 43 off-scale** (FE-1, after rev 5). When it's 0, tell R7 QA (session_017FLWXa5zgGWvqNo4C3UsvH) that QC-14 is ready.
2. **PANEL-R3 (80.7) folded into SPEC-v3 rev 5:**
   - no sun on dots or pills;
   - light circle vs dark square, with a sign-off on real shots;
   - the glyph nouns and `glyph-overrides.json`;
   - phone chips: Area, no counts;
   - the desktop switch inside the 56 px header;
   - no rank badges and no "pin N".

   FE-1 and FE-2 have been briefed. **Next:** when a new head lands, the designer signs off on `real/R4/tokyo-390-light-1-default.jpg` dots; then send the panel "round 4 ready" through FE or the orchestrator. Remind FE-A about the "Numbers on the cards match the pins" copy.
3. **QC-09: closed.** R7 QA verified it independently on adfb052d. QC-06 (768 px, 44 px segments) was verified with it.
5. **FE-C review (W9-4/5/7): signed off** on 70060b332. All ten findings are fixed. The base `.caveat` is now sand, `--ink-3` icon, 14 px, so the estimate note reads as a note, not a warning.
6. **FE-A reviews: all signed off** (ad23309d).
   - QA-67: image-width plates, no bands (Ueno Park 720 = 720).
   - Food covers: the area is never the cover word; glyph-only fallback; Rokurinsha reads "Ramen".
   - Detail: one visible rank number; the view position is for screen readers only.
   - `data-vx` is set in views.js.
7. **PERF-16:** all 8 html-, body- and :root-anchored `:has()` rules in the designer CSS are replaced.
   - `html[data-cleo-page=city]` for the backgrounds and the guidebook hide.
   - `.stamp.stamp-in` for the stamp.
   - `html[data-vx]` for the view cross-fade; views.js sets it on a reader's switch only (FE-A, ad23309d).
   - Platform: remove the 7 entries from the allowlist.
8. **QA-74 and QA-55** (2026-10-16):
   - Motion: `--dur-3` is 280 ms; `--dur-grow` and `--dur-pop` are 300 ms.
   - Every one-shot moment is now ≤ 300 ms. Bob, ring, sheen, stamp, pop and door point at `--dur-pop`.
   - Spring easing is used only for the heart and save pops; the looping tile twinkle is removed.
   - Insights `.fn` footnotes are now `--fs-sm` (14 px).
   - QA has been told.
9. **R3 #9/#14 focus rings** (2026-10-16): ruled one ring per card, from contract.css `.pl:has(.pl-n a:focus-visible)`, at −2 px in clipping containers. Asked FE-2 to drop the li tabindex ring inside Atlas, and asked FE-A to drop fe-a.css:291–292 (link plus `::after` rings) and the sheet.js "pin N" text (R3 #2). FE-2 fixed R3 #7 in e7986460 and is working on #8 next. **Closed:** FE-A's a3fd2d68 leaves the card ring as the only ring, and ad23309d (sheet.js) removes the pin numbers; both signed off. FE-A's detail focus change ba6bcc0f3 is signed off too. An optional nit, "All places" instead of "All 488 places", rides FE-A's next push.
10. **SPEC-v3 rev 5a** (FE-1 conflicts, 2026-10-16):
    - Phone search lives only in the header. The chip row is 48 px, the peek 56 px.
    - That gives 75.4 % clear map (50.7 % at 200 %) and 14 controls above the first card, so B-03 passes.
    - The kit `bag` and `spire` (no cross) are to be used. The spire is for churches only; synagogue, mosque and non-Japan temple fall through to the kind glyph.
    - FE-1 has been told. I'm waiting on its head for the dot sign-off.
11. **QC-30 casing** (FE-A, 2026-10-16): approved the place-name rule (whole name, then capitalised runs, then single words not in `generic`). FE-A moves the generic list into `design/beta/casing/allowlist.json` as `"generic"`. **Done:** FE-A shipped 0dc9dabb. `own_words()` is in `sentence_case.py` and the rule is written into DESIGN-SYSTEM §v2.6. Python and JS agree on all 2,745 page labels.
12. **QC-31 (raw colours and radii)**, 2026-10-16:
    - New tokens: `--mask`, `--on-photo`, `--scrim-photo`, `--shade-text(-strong)`, `--on-night-hover`, `--on-night-line`, `--star`, `--city-glow`, `--print-ink/-paper/-rule`, `--r-xxs` (2px).
    - cleo.css and constellation.css are now at 0 raw colours. The grab bars use `--r-pill`.
    - FE-A has the names for fe-a.css (12 colours, 2 radii). Census script: count the beta/assets/*.css colours outside custom-property declarations (qc.js S-01).
13. **R4 dot sign-off** (real/R4 on 45379fbf):
    - **Light: signed off.** Circle 184 against canvas 230; square 92.
    - **Dark: fix sent to FE-1.** The circle fill measured 90 against 77 (1.2:1) and read as rings. Use 45 % circles and 80 % squares, with targets of ≥ 2:1 and ≥ 4.5:1 measured on the tile.
    - Hold "round 4 ready" until the dark set is re-shot and re-signed. The orchestrator has been told.
    - FE-1 has the fix in ec71a4ad, together with rev 5a and the glyphs. **Next:** re-sign the dark set from the next real shots.
    - Decisions written into SPEC §1.1 and §2.2: on phones, "Search as I move" defaults to off; D-43 is declined (no third dot state; low-confidence pins say "Approximate location" in words).
4. **Reconcile SPEC-v3 §10** with `design/beta/eval/ONE-UP.md` when the product lane lands it.

## In flight

- Nothing. The full `npm test` passed on 82946f4f (exit 0, no FAIL). Nothing is unpushed.

## Notes

- **Gates before every push:** `cd tools && npm run validate && npm test && npm run beta:check`. Rebuild with `python3 design/beta/tools/build-css.py` and `npm run beta` after any CSS change.
- **Merge conflicts in `beta/`:** take theirs, then rebuild.
- **Root-scoped tokens only.** A custom property declared on `:root` that reads a per-element variable (`--ac`, `--acq`, `--area`) resolves at `:root` and breaks, so those values stay raw.
- **Rule 6:** no brand names in anything committed.
- **Commit trailer:** the Co-Authored-By line plus `Claude-Session: https://claude.ai/code/session_01PCNcUkfa5S1N1BKGzZA4xx`.
- **Panel contact:** only "round N ready" notices. Never send targets or ask for scores.
