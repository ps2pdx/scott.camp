"""Cuts the 1x and 2x evidence files (webp) at the allowed ratios: 3:2, 2:3, 1:1, 16:9.

Run from the repo root: python3 scripts/cut-evidence.py
Sources outside the repo are read from ASSETS; everything else is cut from public/evidence.
"""
from pathlib import Path
from PIL import Image

EV = Path('public/evidence')
ASSETS = Path.home() / '.claude/projects/-Users-aquapurp-code-nertia/scott-camp-assets'
Q = 82


def centre(im, rw, rh):
    w, h = im.size
    if w * rh > h * rw:
        cw = round(h * rw / rh)
        x = (w - cw) // 2
        return im.crop((x, 0, x + cw, h))
    ch = round(w * rh / rw)
    y = (h - ch) // 2
    return im.crop((0, y, w, y + ch))


def half(name, src=None):
    im = Image.open(src or EV / f'{name}.webp').convert('RGB')
    w, h = im.size
    out = im.resize((w // 2, round(h * (w // 2) / w)), Image.LANCZOS)
    out.save(EV / f'{name}-{w // 2}.webp', 'WEBP', quality=Q, method=6)


series = centre(Image.open(ASSETS / 'marquee-mondays/marqueemondays.jpg').convert('RGB'), 16, 9)
series.save(EV / 'marquee-mondays-series.webp', 'WEBP', quality=Q, method=6)

for name in ['marquee-mondays-017', 'marquee-mondays-series', 'specimen-designed', 'specimen-built', 'martian-fruit-print', 'terp-scouts-per-image-pricing']:
    half(name)

mark = Image.open(ASSETS / 'terpscout/terpscout-watermark.png').convert('RGBA')
for px in (72, 144):
    mark.resize((px, px), Image.LANCZOS).save(EV / f'terpscout-mark-{px}.webp', 'WEBP', lossless=True, method=6)

# The ICONS contact sheet: square centred crops of the other book frames, 320 (1x) and 640 (2x), each under 40 KB.
from PIL import ImageOps
for frame in ['IMG_2939', 'IMG_2976', 'IMG_2981', 'IMG_2983', 'IMG_2999', 'IMG_3027']:
    src = next(Path('design/source').glob(f'{frame}.*'))
    sq = centre(ImageOps.exif_transpose(Image.open(src)).convert('RGB'), 1, 1)
    for px in (320, 640):
        out, q = sq.resize((px, px), Image.LANCZOS), Q
        while True:
            dest = EV / f'book-{frame.lower()}-{px}.webp'
            out.save(dest, 'WEBP', quality=q, method=6)
            if dest.stat().st_size < 40 * 1024 or q <= 20:
                break
            q -= 4
