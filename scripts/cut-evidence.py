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

# The ICONS frames: every book frame Scott shot (13 and 14 October 2026), read from ASSETS/book-frames, pixels only.
# Thumbnails: square centre crops at 96 (1x) and 192 (2x), quality 70, each under 6 KB.
# Main cuts: the frame's native aspect snapped to 1:1 or 2:3 (iPhone 3:4 is cropped to 2:3), 1280 and 640 wide,
# quality 82 stepping down until under 120 KB. Writes public/evidence/frames/ and src/content/book-frames.json.
# IMG_2975.JPG is dropped: IMG_2975.jpeg is Scott's square edit of the same exposure (same timestamp).
import json
from PIL import ImageOps

FRAMES = ASSETS / 'book-frames'
DROP = {'IMG_2975.JPG'}
OUTF = EV / 'frames'
OUTF.mkdir(exist_ok=True)
MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']


def save_under(im, dest, q, cap, floor):
    while True:
        im.save(dest, 'WEBP', quality=q, method=6)
        if dest.stat().st_size < cap or q <= floor:
            return dest.stat().st_size
        q -= 4


def shot_date(im):
    ex = im.getexif()
    raw = ex.get_ifd(0x8769).get(36867) or ex.get(306)
    y, m, d = raw.split(' ')[0].split(':')
    return f'{int(d)} {MONTHS[int(m) - 1]} {y}'


manifest = []
for src in sorted(FRAMES.iterdir()):
    if src.name in DROP or src.suffix.lower() not in ('.jpg', '.jpeg'):
        continue
    frame = src.stem
    raw = Image.open(src)
    date = shot_date(raw)
    im = ImageOps.exif_transpose(raw).convert('RGB')
    w, h = im.size
    ratio = '1:1' if w == h else ('2:3' if h > w else '3:2')
    rw, rh = (int(x) for x in ratio.split(':'))
    sq = centre(im, 1, 1)
    for px in (96, 192):
        save_under(sq.resize((px, px), Image.LANCZOS), OUTF / f'{frame.lower()}-{px}.webp', 70, 6 * 1024, 10)
    main = centre(im, rw, rh)
    for px in (1280, 640):
        save_under(main.resize((px, round(px * rh / rw)), Image.LANCZOS), OUTF / f'{frame.lower()}-{px}.webp', Q, 120 * 1024, 10)
    manifest.append({'frame': frame, 'ratio': ratio, 'width': 1280, 'height': round(1280 * rh / rw), 'date': date})

Path('src/content/book-frames.json').write_text(json.dumps(manifest, indent=1) + '\n')
print(len(manifest), 'frames')

# Zen Holo (Scott's April 2026 article, pixels only): the Stone & Water 001 hummingbird still at 1:1 and the
# Blender MCP viewport screenshot at 16:9, both centred, 1280 and 640 wide, quality 82 stepping down until under 120 KB.
ZH = ASSETS / 'zen-holo'
for src, name, (rw, rh) in [('zen-holo-stone-hummingbird.png', 'zen-holo-hummingbird', (1, 1)), ('blender-mcp-viewport.png', 'blender-mcp-viewport', (16, 9))]:
    cut = centre(Image.open(ZH / src).convert('RGB'), rw, rh)
    for px, dest in ((1280, EV / f'{name}.webp'), (640, EV / f'{name}-640.webp')):
        print(dest.name, save_under(cut.resize((px, round(px * rh / rw)), Image.LANCZOS), dest, Q, 120 * 1024, 10))
