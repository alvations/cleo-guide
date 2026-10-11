# W7 palette directions

There are four directions. Each is a **full light and dark token set** over the same primitives:
- ground (`--paper`), `--surface` and a quiet fill (`--sand`);
- a three-step ink scale;
- two lines;
- **one** signature accent, with its text-safe ink, a wash and the colour that sits on it;
- the state colours;
- the mute (`--area-mute`) that pulls the data's area colours and map pins toward the palette.

The source of all four is [`../tools/palettes.py`](../tools/palettes.py). It writes `<id>.css` and
[`contrast.json`](contrast.json), and exits 1 if any pair falls below AA (46 pairs per direction, light and dark).

All four are shown **on the real beta pages**, not on a mock. [`../tools/shots.js`](../tools/shots.js) layers
`v2-base.css`, the V2 component layer `design/beta/css/v2.css` and the direction's token file onto the generated
pages, and shoots them at 390 and 1440, in light and dark. The pages are the landing, the Japan hub, Tokyo in Gallery
and in Atlas, and the Kanda Myōjin place sheet. Three places are seeded as saved, so the accent shows where it is spent.

| Direction | Ground · ink · accent (light) | Ground · ink · accent (dark) | Read | Score |
|---|---|---|---|---|
| **A Juniper** | `#F7F6F2` · `#1A1C1A` · `#2C5A4C` | `#111312` · `#EDEFEB` · `#8FC3AF` | A stone ground and a deep juniper green. Calm and safe, but the accent is a familiar wellness green. | 74 / 90 |
| **B Bone & Oxblood** ✅ | `#F9F7F3` · `#1C1917` · `#7A2A2A` | `#131110` · `#F2EEEA` · `#E0A19A` | A warm bone ground with soft-black ink and one deep oxblood. It reads like tailoring, not like a signal. | **82 / 90** |
| **C Mist & Petrol** | `#F5F6F6` · `#15191B` · `#1D5568` | `#0F1213` · `#ECEFF0` · `#8EC5D6` | A cool mist ground, graphite ink and petrol blue. The most architectural of the four, and the least warm. | 76 / 90 |
| **D Sable & Ember** | `#F4F1EC` · `#211D1A` · `#9C4423` | `#151312` · `#F3EFEA` · `#EE9C7A` | A greige ground and a burnt ember. The warmest of the four, but the most common travel accent. | 71 / 90 |

Mockups: `shots/<id>/{landing,hub,gallery,atlas,place}-{m,d}-{light,dark}.jpg`.
Side by side: [`../board.html`](../board.html).

**Ruled out before mockups** (per the brief):
- gold or brass gradients;
- neon;
- any purple chrome;
- multicolour chrome, including the R6 per-city skins;
- heavy shadows;
- any accent within ΔE76 < 25 of a reference brand's red.
