"""Cuts the texture tiles and the chip slice from design/source. Pillow only."""
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
    for size in (512, 1024):
        mirror_tile(im, size).save(f'{OUT}{out}-{size}.webp', quality=Q)

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

def cloth_tile(target):
    sq = load('IMG_2976.JPG').crop((0, 700, 3024, 3724))
    sq = lift(gained(sq, [t / v for t, v in zip(target, ImageStat.Stat(sq).mean)]))
    sq.resize((1024, 1024), Image.LANCZOS).save(OUT + 'cloth.webp', quality=Q)

def spine_tile():
    sp = load('IMG_2981.JPG').crop((1150, 0, 1930, 4032)).resize((160, 827), Image.LANCZOS)
    t = Image.new('RGB', (160, 1654)); t.paste(sp, (0, 0)); t.paste(ImageOps.flip(sp), (0, 827))
    t.save(OUT + 'spine.webp', quality=Q + 5)

def chip_slice(target):
    im = load('IMG_3027.JPG').rotate(-3.03, resample=Image.BICUBIC, center=(1480, 2010))
    cx, cy, IN, OUT_ = 1514, 2032, 260, 60
    patch = im.crop((cx - IN, cy - IN, cx + OUT_, cy + OUT_)); W = patch.size[0]
    pmean = ImageStat.Stat(patch, mask=gmask(patch)).mean
    patch = lift(gained(patch, [t / v for t, v in zip(target, pmean)]))
    pm = Image.new('L', patch.size, 0); ImageDraw.Draw(pm).rectangle((0, 0, IN - 1, IN - 1), fill=255)
    pm = pm.filter(ImageFilter.GaussianBlur(1))
    sh = Image.new('L', patch.size, 0); ImageDraw.Draw(sh).rectangle((0, 0, IN + 5, IN + 5), fill=50)
    sh = sh.filter(ImageFilter.GaussianBlur(9))
    alpha = ImageChops.lighter(pm, sh)
    rgb = Image.composite(patch, Image.new('RGB', patch.size, (0, 0, 0)), pm)
    p = rgb.copy(); p.putalpha(alpha)
    w = int(W * 0.24); p = p.resize((w, w), Image.LANCZOS); half = w // 2; third = w // 3
    br, bl, tr, tl = p, ImageOps.mirror(p), ImageOps.flip(p), ImageOps.flip(ImageOps.mirror(p))
    sheet = Image.new('RGBA', (w * 3, w * 3), (0, 0, 0, 0))
    sheet.paste(tl, (0, 0)); sheet.paste(tr, (2 * w, 0)); sheet.paste(bl, (0, 2 * w)); sheet.paste(br, (2 * w, 2 * w))
    right = p.crop((0, 0, w, third)); bottom = p.crop((0, 0, third, w))
    left, top = ImageOps.mirror(right), ImageOps.flip(bottom)
    for i in range(3):
        sheet.paste(right if i % 2 == 0 else ImageOps.flip(right), (2 * w, w + i * third))
        sheet.paste(left if i % 2 == 0 else ImageOps.flip(left), (0, w + i * third))
        sheet.paste(bottom if i % 2 == 0 else ImageOps.mirror(bottom), (w + i * third, 2 * w))
        sheet.paste(top if i % 2 == 0 else ImageOps.mirror(top), (w + i * third, 0))
    sheet.paste(p.crop((0, 0, half, half)).resize((w, w), Image.LANCZOS), (w, w))
    sheet.save(OUT + 'chip.png')
    print('chip slice', w)

if __name__ == '__main__':
    target = cloth_target()
    gray_tile('IMG_2939.jpeg', (100, 400, 900, 1200), 2.2, 'board')
    gray_tile('IMG_2999.JPG', (200, 1800, 1400, 3000), 1.6, 'paper')
    cloth_tile(target)
    spine_tile()
    chip_slice(target)
