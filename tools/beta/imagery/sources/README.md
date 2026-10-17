# tools/beta/imagery/sources — image sources beyond Commons (D-50)

Lane: image sources (docs/resume/image-sources.md). Matrix and ranking: [docs/BETA-IMAGE-SOURCES.md](../../../../docs/BETA-IMAGE-SOURCES.md).
The credit gate (`../photos.js`), Commons, Flickr/Openverse and Unsplash belong to the imagery lane.

| File | What |
|---|---|
| `lib.js` | the shared engine: options, candidate filter, target checks, licence/identity/historic rules, preview staging, credit rows (`--help`) |
| `loc.js` · `met.js` | Library of Congress, The Met — **no key** |
| `smithsonian.js` · `europeana.js` · `pexels.js` · `pixabay.js` | keys `SMITHSONIAN_API_KEY`, `EUROPEANA_API_KEY`, `PEXELS_API_KEY`, `PIXABAY_API_KEY` (Actions secrets only) |
| `candidates.tsv` | the candidate manifest: one row per (target, source, item) with its identification evidence |
| `add-candidates.js` | merge research rows into candidates.tsv (`--check` validates it) |
| `contact.js` | contact sheet of staged previews → `design/beta/imagery-sources/stage/contact.html`, `sheet-NN.jpg`, `review.tsv` |
| `review.js` | copy the reviewer's verdicts from review.tsv into the `review` column |
| `searched-gaps.tsv` | targets searched with nothing found (so the next wave does not repeat them) |
| `test-sources.js` | offline tests (in `npm test`) |

## Flow (all downloads in GitHub Actions; the authoring sandbox cannot reach these hosts)

1. Research (WebSearch) → rows in candidates.tsv (`add-candidates.js rows.tsv`).
2. Actions: `node tools/beta/imagery/sources/<source>.js --stage --budget N` for each source, then `contact.js`;
   commit `design/beta/imagery-sources/stage/`. Nothing in `beta/` changes.
3. The orchestrator reviews the contact sheet and fills `review.tsv` (ok or a reason); `review.js review.tsv`.
4. Actions: `<source>.js --credit` (only `review = ok` rows) → 500 + 960 JPEGs in beta/assets/img/photos + CREDITS rows,
   then `recompress.js`, `npm run beta` and the gates, as for Commons.

Same CLI for every source: `--stage` (default) | `--credit` | `--dry-run`, `--budget <n>` (API requests), `--key <target>`,
`--min high|med`, `--delay <ms>`. Without a key, or when the hosts are unreachable outside CI, it prints the plan and exits 0.
Exit codes: 0 done/nothing/no key; 1 bad input; 3 host blocked in CI; 4 API failure or > 25 % image downloads failed.
Resumable: staged and credited targets are skipped.

## candidates.tsv columns

`target` (landmark:<page>#<id>) · `source` · `itemId` · `itemUrl` · `title` · `creator` · `date` · `licence` · `licenceEvidence`
· `depicts` · `identityEvidence` (the item's own words naming the place) · `era` (modern | historic) · `stillLooks` (historic:
must start "yes") · `confidence` (high | med) · `refused` (research refusal reason) · `names` (aliases the API text may use,
`;`-separated) · `review` (empty | ok | reason, from the contact sheet).

Rules: never food (stock and historic), never closed or Vietnam; stock (Pexels, Pixabay) for landmarks only; historic dated
and still recognisable; museum objects only on that museum's page; never an invented author, date, licence or identity.
