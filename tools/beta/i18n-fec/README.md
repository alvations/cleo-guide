# FE-C interface strings, waiting for ja (D-41)

test-i18n needs en.json and ja.json to match key for key, and FE-C never writes ja. So a new FE-C string waits here
until the i18n lane supplies its Japanese. Then en and ja land in one commit together with the code that uses them.

**Done so far:**
- batch 1 (trip.js plus rec.*): merged by FE-C in d1d476cbc;
- batch 2 (base.js, share-card.js and the core walk helper): merged by the i18n lane with FE-C's patch in 50eb108c2.

**Now:** `pending-en.json` holds batch 3, trip.html's three server strings (`trip.page.title`, `.desc`, `.nojs`).
The flow:
1. the i18n lane writes `pending-ja.json` with the same keys and `{placeholders}`;
2. run `python3 tools/beta/i18n-fec/merge.py`;
3. convert lib/render/trip.js to `t('trip.page.*')`;
4. `npm run beta`, the gates, push.

Files:
- `merge.py`: checks and merges in one step (`--check` reports only);
- `apply.py`: the helper for asserted literal replacements, plus the `Cleo.t` key scan.

Three template shapes break the runtime swap and are not used:
- `{a} and {b}`;
- `Recommended by {src}` (it collides with `card.recby`);
- `{dist} from {base} · {walk}`.

The i18n lane notes a test-i18n rule for these.
