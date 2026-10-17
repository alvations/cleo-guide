# Image sources lane — checkpoint

**Task (D-50, owner directive "fewer blanks on the beta site"):** Pexels, Pixabay, Smithsonian, Met, Europeana, NYPL and
Library of Congress photos for tier-1 sights without a photo, then the first 24 cards of each guide's default view.
Imagery (session_011rg9RMooGaKrmENvBZ7MvX) owns the gate, Commons, Flickr/Openverse and Unsplash. Orchestrator
session_01PCNcUkfa5S1N1BKGzZA4xx owns `.github/workflows/*`. Baseline: tier-1 508/897 (389 gaps: US 164, Europe 137, Japan 76,
SG/MY 12; no photo on food is ever possible from these sources).

**Done:**
- Source matrix + ranking: docs/BETA-IMAGE-SOURCES.md (research notes design/beta/imagery-sources/matrix-research.md).
- Fetchers in tools/beta/imagery/sources/ (lib.js engine; loc, met, smithsonian, europeana, pexels, pixabay), two-stage:
  `--stage` (previews + contact sheet, nothing credited) and `--credit` (review = ok rows only). test-sources.js in npm test.
- Wave 1 candidates (candidates.tsv): 175 rows, 134 candidates for 82 targets (LoC 61, Europeana 29, Pexels 26, Smithsonian 5, Met 2,
  USGS 1 manual), 30 refused rows kept; 22 searched-with-nothing targets in searched-gaps.tsv.

**In flight:**
- Stage run #3 committed 71379343b: 45 LoC previews (3 sheets) + review.tsv; my pre-screen review-suggested.tsv (46d7c580e): 21 ok / 8 second / 16 refuse. Waiting for the orchestrator's verdicts → review.js → loc.js --credit (needs a credit step in the workflow, asked). ~60 LoC candidates still unstaged (budget 60/run); the next candidates.tsv push stages them.
- Wave 2b merged (10:45Z): +66 candidates (LoC 53: Highsmith 43, HABS/HALS/HAER 9, Detroit 1; Europeana/Rijksmuseum 13), +66 searched gaps.
  candidates.tsv = 200 candidates for 126 targets. This push re-triggers beta-image-sources-stage (met, loc).
- The team stopped 03:39–10:2xZ (usage limit). Imagery claimed the gate edits (photos.js/recompress.js/test-imagery.js: historic caption,
  anonymous guard, LoC pre-1930 licence string, selfHosted providers, host checks) at 03:31Z but has not landed them; I offered my
  tested patch ("push it"). Do NOT edit those files unless imagery says so.
- loc.js maps other NKR items to "No known restrictions (LoC, published before 1930)" (lib: historic, year ≤ 1929 only).

**Next:**
1. Send the orchestrator the CLIs + secrets and the imagery lane the gate proposals (done in this push).
2. Orchestrator: add the Actions step (stage per source, contact.js, commit design/beta/imagery-sources/stage/) and the
   secrets PEXELS_API_KEY, PIXABAY_API_KEY, SMITHSONIAN_API_KEY, EUROPEANA_API_KEY. LoC and Met run without keys.
3. Imagery lane: the gate proposals in docs/BETA-IMAGE-SOURCES.md (stock licences, historic caption, recompress providers).
4. After review.tsv comes back: `node tools/beta/imagery/sources/review.js design/beta/imagery-sources/stage/review.tsv`,
   push → Actions `--credit` → coverage before/after to the orchestrator.
5. Wave 2 research (resume in a fresh turn; budget ~35 searches per agent, at most 3 agents at once, cap 200 per turn). Target lists: `node tools/beta/imagery/sources/first-cards.js --tsv` (first-24 gaps) minus candidates.tsv and searched-gaps.tsv; priorities from the agents: HAER/HABS Leap-the-Dips, Bradford House, Boal Mansion, Spring Hill, Nike HM-69, Saturn V Center, Benjamin Harrison Home; Highsmith Brandywine Falls, Noblesville courthouse, Strasburg Rail Road, Old Main, Glamorgan Castle; Pexels Fort Canning, Chatuchak, Rizal Park, Blue Mansion, Chiang Mai, Ryōan-ji, Tenryū-ji, Nishi Hongan-ji, Kabira Bay; Europeana/Rijksmuseum for Ghent, Brussels, Aachen. Old list: LoC for the US guides not yet searched (Akron, Erie, Madison, Silicon Valley, Youngstown, Indianapolis,
   State College, Harrisburg, Cincinnati, rest of Miami/Orlando); the default-view first 24 cards.

**Notes:**
- Bytes: SF page 783 KB and Tokyo 786 KB (ceiling 820): ~37 photos of headroom each; none within 10 KB yet.
- LoC throttles at 20 requests/minute (1-hour block): loc.js `--delay 3200`, budget 60 per run.
- D-52: anonymous creators allowed as "Anonymous (as catalogued by <institution>)" on PD/CC0 historic rows only (lib.js). Stage workflow beta-image-sources-stage.yml (orchestrator) — dispatch API 404 at 02:30Z, likely not on the default branch.
