# FE-C interface strings, waiting for ja (D-41)

test-i18n needs en.json and ja.json to match key for key, and FE-C never writes ja. So FE-C's new strings wait here
until the i18n lane supplies their Japanese:

- `pending-en.json`: 84 keys:
  - W9-4 trips: `trip.*`;
  - W9-5 base and the walk helper: `geo.*`, `src.*`;
  - W9-7 share cards: `share.*`;
  - W9-1 recognition: `rec.*`.
- `pending-ja.json`: **written by the i18n lane**, with the same keys and the same `{placeholders}`.
- `merge.py`: checks both files and merges them into the catalogues in one step (`--check` reports only).
- `trip-i18n.patch`: client/trip.js converted to `Cleo.t` (`git apply` after the merge).
- `apply.py`: the helper that made the patch (asserted literal replacements, plus the `Cleo.t` key scan).

Two template shapes were found to break the runtime swap and are not used:
- `{a} and {b}` swaps any "X and Y" on the landing page;
- `Recommended by {src}` collides with the card's `card.recby` text node.

Order once pending-ja.json exists:
1. `python3 tools/beta/i18n-fec/merge.py`
2. `git apply tools/beta/i18n-fec/trip-i18n.patch`
3. `cd tools && npm run beta`
4. run the gates
5. push
