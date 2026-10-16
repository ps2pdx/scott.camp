"""Cuts the texture tiles and the chip slice from design/source. Pillow only."""
import io
import sys
from PIL import Image, ImageOps, ImageChops, ImageFilter, ImageDraw, ImageStat

SRC = 'design/source/'
OUT = 'public/textures/'
Q = int(sys.argv[1]) if len(sys.argv) > 1 else 60

def load(name):
    return ImageOps.exif_transpose(Image.open(SRC + name)).convert('RGB')

def flatten(im, amp):
    g = im.convert('L').filter(ImageFilter.GaussianBlur(1.2))
    blur = g.filter(ImageFilter.GaussianBlur(80))
    hp = ImageChops.subtract(g, blur, scale=1.0, offset=128)
    return Image.blend(Image.new('L', hp.size, 128), hp, amp)

def mirror_tile(im, size):
    im = im.resize((size // 2, size // 2), Image.LANCZOS).convert('RGB')
    w, h = im.size
    t = Image.new('RGB', (w * 2, h * 2))
    t.paste(im, (0, 0)); t.paste(ImageOps.mirror(im), (w, 0))
    t.paste(ImageOps.flip(im), (0, h)); t.paste(ImageOps.flip(ImageOps.mirror(im)), (w, h))
    return t

def gray_tile(name, box, amp, out):
    im = flatten(load(name).crop(box), amp)
    mirror_tile(im, 512).save(f'{OUT}{out}-512.webp', quality=Q)
    return im

def grain_tile(im, out):
    # multiply by m equals black at alpha 1 - m; m is the tile rebased by brightness(2), so alpha is 255 - 2v
    for size in (512, 1024):
        b = io.BytesIO(); mirror_tile(im, size).save(b, 'WEBP', quality=Q)
        g = Image.open(b).convert('L')
        t = Image.new('RGBA', g.size, (0, 0, 0, 0))
        t.putalpha(g.point(lambda v: max(0, 255 - 2 * v)))
        best = None
        for kw in (dict(lossless=True, quality=100, method=6), dict(quality=Q, alpha_quality=20, method=6)):
            b = io.BytesIO(); t.save(b, 'WEBP', **kw)
            best = b if best is None or len(b.getvalue()) < len(best.getvalue()) else best
        open(f'{OUT}{out}-grain-{size}.webp', 'wb').write(best.getvalue())

def gained(img, gain):
    r, g, b = img.split()
    return Image.merge('RGB', tuple(c.point(lambda v, k=k: min(255, int(v * k))) for c, k in zip((r, g, b), gain)))

def lift(img, amount=0.45):
    l = img.convert('L')
    dark = l.point(lambda v: int(max(0, (140 - v)) * 255 / 140) if v < 140 else 0)
    return Image.composite(Image.blend(img, Image.new('RGB', img.size, (236, 244, 230)), amount), img, dark)

def gmask(img):
    r, g, b = img.split()
    m1 = ImageChops.subtract(g, r, 1, -40).point(lambda v: 255 if v > 0 else 0)
    m2 = ImageChops.subtract(g, b, 1, -40).point(lambda v: 255 if v > 0 else 0)
    return ImageChops.multiply(m1, m2)

def cloth_target():
    cover = load('IMG_2975.jpeg')
    return ImageStat.Stat(cover, mask=gmask(cover)).mean

# Weave pitch by FFT, photo px (x, y): IMG_3027 about (41.4, 37.4), IMG_2976 about (45.6, 40.8).
# The chip sheet is IMG_3027 at 0.24, so the tile is IMG_2976 at 0.24 * 41.4 / 45.6: one sheet px is one tile px,
# and with both drawn at 24/76 the weave is one pitch across the inner edge.
CLOTH_TILE, PITCH_X, PITCH_Y = 646, 45.6, 40.8

def wrap_axis(im, n, m, axis):
    """First n px along axis, the first m px faded into the m px past the end, so the tile wraps on itself."""
    w, h = im.size
    if axis == 'x':
        a = im.crop((0, 0, n, h)); ramp = Image.linear_gradient('L').rotate(90).resize((m, h))
        a.paste(Image.composite(a.crop((0, 0, m, h)), im.crop((n, 0, n + m, h)), ramp), (0, 0))
    else:
        a = im.crop((0, 0, w, n)); ramp = Image.linear_gradient('L').resize((w, m))
        a.paste(Image.composite(a.crop((0, 0, w, m)), im.crop((0, n, w, n + m)), ramp), (0, 0))
    return a

def wrap_len(g, axis, lo, hi, span=200):
    """The repeat length in lo..hi where the weave lines up with itself best."""
    g = g.convert('L'); w, h = g.size
    def diff(n):
        a, b = ((0, 0, span, h), (n, 0, n + span, h)) if axis == 'x' else ((0, 0, w, span), (0, n, w, n + span))
        return ImageStat.Stat(ImageChops.difference(g.crop(a), g.crop(b))).mean[0]
    return min(range(lo, hi + 1), key=diff)

def periodic_blur(img, radius):
    w, h = img.size
    mosaic = Image.new(img.mode, (w * 3, h * 3))
    for i in range(3):
        for j in range(3):
            mosaic.paste(img, (i * w, j * h))
    return mosaic.filter(ImageFilter.GaussianBlur(radius)).crop((w, h, 2 * w, 2 * h))

def periodic_flatten(tile, radius):
    """Evens out the light falloff and the focus falloff across the frame (local mean and local contrast),
    measured on a 3 x 3 mosaic so the correction wraps with the tile and no repeat reads as a band."""
    w, h = tile.size
    low = periodic_blur(tile, radius)
    lum = tile.convert('L'); lum_low = low.convert('L')
    amp = periodic_blur(ImageChops.difference(lum, lum_low), radius)
    mean = ImageStat.Stat(tile).mean
    target = ImageStat.Stat(amp).mean[0]
    src, lo, am = tile.load(), low.load(), amp.load()
    out = Image.new('RGB', (w, h)); dst = out.load()
    for y in range(h):
        for x in range(w):
            g = target / max(1.0, am[x, y])
            dst[x, y] = tuple(max(0, min(255, int(m + (c - l) * g + 0.5))) for c, l, m in zip(src[x, y], lo[x, y], mean))
    return out

# The cloth also covers the full-bleed cover, so it must be seamless at that size: about 60 by 72 weave pitches,
# feathers of 280 px (x) and 500 px (y) of the photo, phase-matched repeat lengths, and the light and focus
# falloff across the frame evened out (local mean and contrast) so no repeat reads as a band.
# The tile keeps the button's weave scale: 597 by 646 px, drawn at 189 by 204 CSS px.
CLOTH_PITCHES_X, CLOTH_PITCHES_Y, FEATHER_X, FEATHER_Y = 60, 72, 280, 500

def cloth_tile(target):
    mx, my = FEATHER_X, FEATHER_Y
    im = load('IMG_2976.JPG')
    nx, ny = round(PITCH_X * CLOTH_PITCHES_X), round(PITCH_Y * CLOTH_PITCHES_Y)
    # The repeat lengths are tuned to where the weave lines up with itself, so the seams land in phase.
    cw = wrap_len(im.crop((0, 500, im.width, 500 + ny)), 'x', nx - 23, min(nx + 23, im.width - mx), span=150)
    ch = wrap_len(im.crop((0, 500, cw, 500 + ny + my)), 'y', ny - 20, ny + 20, span=150)
    src = im.crop((0, 500, cw + mx, 500 + ch + my))
    src = lift(gained(src, [t / v for t, v in zip(target, ImageStat.Stat(src).mean)]))
    tile = wrap_axis(wrap_axis(src, cw, mx, 'x'), ch, my, 'y')
    tile = tile.resize((round(CLOTH_TILE * cw / round(PITCH_X * 65)), round(CLOTH_TILE * ch / round(PITCH_Y * 72))), Image.LANCZOS)
    tile = periodic_flatten(tile, 14)
    tile.save(OUT + 'cloth.webp', quality=Q)
    print('cloth tile', tile.size, 'repeat', cw, ch)
    return tile

# IMG_2983: the sharpest, most evenly lit full-height run of the Smyth-sewn spine (glue gloss, black thread,
# white paper, yellow signatures). It leans about 34 px over 3500 rows, so it is turned 0.56 degrees upright
# first. The run is cut at 320 px wide (double the old 160 px cut from IMG_2981), toned to the old tile's
# per-channel mean and spread, and wrapped on itself with a 64 px blended seam so the rail stacks.
SPINE_W, SPINE_SEAM = 320, 64

def spine_tile():
    im = load('IMG_2983.JPG').rotate(0.56, resample=Image.BICUBIC, center=(1665, 2016))
    run = im.crop((1250, 40, 2080, 3990))
    run = run.resize((SPINE_W, round(run.height * SPINE_W / run.width)), Image.LANCZOS)
    old = load('IMG_2981.JPG').crop((1150, 0, 1930, 4032)).resize((160, 827), Image.LANCZOS)
    run = matched(run, ImageStat.Stat(old), ImageStat.Stat(run))
    t = wrap_axis(run, run.height - SPINE_SEAM, SPINE_SEAM, 'y')
    t.save(OUT + 'spine.webp', quality=Q)
    t.transpose(Image.ROTATE_270).save(OUT + 'spine-band.webp', quality=Q)
    print('spine tile', t.size)

def matched(img, ref_stat, own_stat):
    return Image.merge('RGB', tuple(c.point(lambda v, rm=rm, rs=rs, om=om, os_=os_: max(0, min(255, int((v - om) * rs / os_ + rm))))
                                    for c, rm, rs, om, os_ in zip(img.split(), ref_stat.mean, ref_stat.stddev, own_stat.mean, own_stat.stddev)))

def chip_slice(target, tile):
    im = load('IMG_3027.JPG').rotate(-3.03, resample=Image.BICUBIC, center=(1480, 2010))
    cx, cy, IN, OUT_ = 1514, 2032, 260, 60
    W = IN + OUT_; w = int(W * 0.24); half = w // 2; m = 40
    patch = im.crop((cx - IN, cy - IN, cx + OUT_, cy + OUT_))
    gain = [t / v for t, v in zip(target, ImageStat.Stat(patch, mask=gmask(patch)).mean)]
    prep = lambda img: lift(gained(img, gain))
    patch = prep(patch)
    # The edge bands are long straight runs of the same edge, cut to a length where the weave repeats and
    # wrapped on themselves: no flipped pieces, so the band reads as plain cloth at the corner's scale.
    ry = wrap_len(im.crop((cx - IN, cy - IN - 900, cx - 40, cy - IN - 100)), 'y', 290, 345)
    bx = wrap_len(im.crop((cx - IN - 900, cy - IN, cx - IN - 100, cy - 40)), 'x', 290, 345)
    right = prep(wrap_axis(im.crop((cx - IN, cy - IN - 40 - ry - m, cx + OUT_, cy - IN - 40)), ry, m, 'y'))
    bottom = prep(wrap_axis(im.crop((cx - IN - 40 - bx - m, cy - IN, cx - IN - 40, cy + OUT_)), bx, m, 'x'))
    # Tone and contrast follow the cloth tile, measured at the scale both are drawn at (one sheet px = one tile px).
    ref = ImageStat.Stat(tile)
    def to_tile(img, cloth):
        probe = img.crop(cloth); probe = probe.resize((int(probe.width * 0.24), int(probe.height * 0.24)), Image.LANCZOS)
        return matched(img, ref, ImageStat.Stat(probe))
    patch = to_tile(patch, (0, 0, IN - 20, IN - 20))
    right = to_tile(right, (0, 0, IN - 20, ry))
    bottom = to_tile(bottom, (0, 0, bx, IN - 20))
    pm = Image.new('L', patch.size, 0); ImageDraw.Draw(pm).rectangle((0, 0, IN - 1, IN - 1), fill=255)
    pm = pm.filter(ImageFilter.GaussianBlur(1))
    sh = Image.new('L', patch.size, 0); ImageDraw.Draw(sh).rectangle((0, 0, IN + 5, IN + 5), fill=50)
    sh = sh.filter(ImageFilter.GaussianBlur(9))
    alpha = ImageChops.lighter(pm, sh)
    def cut(rgb, pmask, amask):
        out = Image.composite(rgb, Image.new('RGB', rgb.size, (0, 0, 0)), pmask); out.putalpha(amask); return out
    row = lambda mask, n: mask.crop((0, IN // 2, W, IN // 2 + 1)).resize((W, n), Image.NEAREST)
    col = lambda mask, n: mask.crop((IN // 2, 0, IN // 2 + 1, W)).resize((n, W), Image.NEAREST)
    p = cut(patch, pm, alpha).resize((w, w), Image.LANCZOS)
    rb = cut(right, row(pm, ry), row(alpha, ry)).resize((w, w), Image.LANCZOS)
    bb = cut(bottom, col(pm, bx), col(alpha, bx)).resize((w, w), Image.LANCZOS)
    sheet = Image.new('RGBA', (w * 3, w * 3), (0, 0, 0, 0))
    sheet.paste(ImageOps.flip(ImageOps.mirror(p)), (0, 0)); sheet.paste(ImageOps.flip(p), (2 * w, 0))
    sheet.paste(ImageOps.mirror(p), (0, 2 * w)); sheet.paste(p, (2 * w, 2 * w))
    sheet.paste(rb, (2 * w, w)); sheet.paste(ImageOps.mirror(rb), (0, w))
    sheet.paste(bb, (w, 2 * w)); sheet.paste(ImageOps.flip(bb), (w, 0))
    sheet.paste(p.crop((0, 0, half, half)).resize((w, w), Image.LANCZOS), (w, w))
    sheet.save(OUT + 'chip.png', optimize=True)
    print('chip slice', w, 'band repeats', ry, bx)

if __name__ == '__main__':
    target = cloth_target()
    grain_tile(gray_tile('IMG_2939.jpeg', (100, 400, 900, 1200), 2.2, 'board'), 'board')
    grain_tile(gray_tile('IMG_2999.JPG', (200, 1800, 1400, 3000), 1.6, 'paper'), 'paper')
    tile = cloth_tile(target)
    spine_tile()
    chip_slice(target, tile)
