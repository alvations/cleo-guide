# FE-C interface strings, waiting for ja (D-41)

test-i18n needs en.json and ja.json to match key for key, and FE-C never writes ja. So a new FE-C string waits here
until the i18n lane supplies its Japanese. Then en and ja land in one commit together with the code that uses them.

**All three batches are merged:**
- batch 1 (trip.js + rec.*): FE-C, d1d476cbc;
- batch 2 (base.js, share-card.js, the core walk helper): the i18n lane with FE-C's patch, 50eb108c2;
- batch 3 (trip.html server strings, `page.trip.*`; server keys avoid `swapSkip` prefixes such as `trip.`): FE-C.

**For new FE-C strings:**
1. write them to `pending-en.json` and ask the i18n lane for `pending-ja.json`;
2. run `merge.py`, so en and ja land in one commit together with the code that uses them.

Files:
- `merge.py`: checks and merges in one step (`--check` reports only);
- `apply.py`: the helper for asserted literal replacements, plus the `Cleo.t` key scan.

Three template shapes break the runtime swap and are not used:
- `{a} and {b}`;
- `Recommended by {src}` (it collides with `card.recby`);
- `{dist} from {base} · {walk}`.

The i18n lane notes a test-i18n rule for these.
