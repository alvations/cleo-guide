"""Side-by-side R7 | R8 composites (r7/tools/pair.py with the labels taken from arguments).
Usage: python3 pair.py <r7dir> <r8dir> <outdir> name[,name...] [<r8 sha>]   (default label: R8 deploy)"""
import sys, os
from PIL import Image, ImageDraw, ImageFont
r1, r2, out, names = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4].split(',')
os.makedirs(out, exist_ok=True)
try: F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
except Exception: F = ImageFont.load_default()
for n in names:
    for vp in ('m', 'd'):
        a, b = os.path.join(r1, f'{n}-{vp}.jpg'), os.path.join(r2, f'{n}-{vp}.jpg')
        if not os.path.exists(b): continue
        w = 390 if vp == 'm' else 720
        ims = []
        for p, lab in ((a, 'R7 badcc20d'), (b, 'R8 ' + (sys.argv[5] if len(sys.argv) > 5 else 'deploy'))):
            if os.path.exists(p):
                im = Image.open(p).convert('RGB'); im = im.resize((w, round(im.height * w / im.width)))
            else:
                im = Image.new('RGB', (w, 300), (235, 235, 235)); ImageDraw.Draw(im).text((20, 140), 'not in this round', fill=(90, 90, 90), font=F)
            ims.append((im, lab))
        h = max(i.height for i, _ in ims) + 36
        c = Image.new('RGB', (w * 2 + 12, h), (255, 255, 255)); d = ImageDraw.Draw(c)
        for k, (im, lab) in enumerate(ims):
            x = k * (w + 12); c.paste(im, (x, 36)); d.text((x + 6, 6), lab, fill=(20, 20, 20), font=F)
        c.save(os.path.join(out, f'{n}-{vp}-r7-r8.jpg'), quality=72)
print('ok')
