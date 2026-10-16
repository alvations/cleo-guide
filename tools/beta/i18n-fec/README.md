# FE-C interface strings, waiting for ja (D-41)

test-i18n needs en.json and ja.json to match key for key, and FE-C never writes ja. So FE-C's new strings wait here
until the i18n lane supplies their Japanese:

- **Batch 1 is merged** (trip.js + rec.*, 79 keys, en + ja together). trip.html renders in ja; test-i18n checks it.
- `pending-en.json`: **batch 2**, 46 keys:
  - W9-5 base: `base.*`;
  - the walk helper: `geo.walk.*`;
  - W9-7 share cards: `share.*`;
  - trip.html's server strings: `trip.page.*`.
- `pending-ja.json`: **written by the i18n lane**, with the same keys and the same `{placeholders}`.
- `merge.py`: checks both files and merges them into the catalogues in one step (`--check` reports only).
- `fec-i18n.patch`: batch 2's client side. base.js, share-card.js and Cleo.geo.walk in core.js are converted to `Cleo.t` (`git apply` after the merge).
  The server side, lib/render/trip.js `t('trip.page.*')`, is done by hand in the same commit.
  Existing keys are reused wherever the English matches: hub.places, city.card.added, city.been, card.recby, tier.*, card.share.image,
  day.k, day.h, day.kind.*, day.kml, sheet.close, sheet.directions, gal.closed, city.sort.base.
- `apply.py`: the helper that made the patch (asserted literal replacements, plus the `Cleo.t` key scan).

Two template shapes were found to break the runtime swap and are not used:
- `{a} and {b}` swaps any "X and Y" on the landing page;
- `Recommended by {src}` collides with the card's `card.recby` text node;
- `{dist} from {base} · {walk}` matches prose on the landing page. So the base line is composed: dist + `base.from` ("from") + name + walk.

Order once the ja exists (either pending-ja.json, or the i18n lane adds en + ja to the catalogues itself; then skip step 1):
1. `python3 tools/beta/i18n-fec/merge.py`
2. `git apply tools/beta/i18n-fec/fec-i18n.patch`
3. `cd tools && npm run beta`
4. run the gates
5. push
