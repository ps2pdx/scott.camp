"""Cuts the yellow pages portrait. Pillow only.
Source: SNY00127-full.jpeg (2048 by 3072, 5.5 MB), kept out of the repo for size, on Scott's Mac at
~/.claude/projects/-Users-aquapurp-code-nertia/scott-camp-assets/portrait/SNY00127-full.jpeg. Pass another path as the first argument."""
import os, sys
from PIL import Image, ImageOps

SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser('~/.claude/projects/-Users-aquapurp-code-nertia/scott-camp-assets/portrait/SNY00127-full.jpeg')
OUT = 'public/evidence/'
Q = 82

def cut_2x3(im):
    w, h = im.size
    if w * 3 > h * 2:
        cw = h * 2 // 3
        return im.crop(((w - cw) // 2, 0, (w - cw) // 2 + cw, h))
    ch = w * 3 // 2
    return im.crop((0, (h - ch) // 2, w, (h - ch) // 2 + ch))

if __name__ == '__main__':
    im = cut_2x3(ImageOps.exif_transpose(Image.open(SRC)).convert('RGB'))
    for width, name in ((480, 'portrait.webp'), (240, 'portrait-240.webp')):
        out = im.resize((width, width * 3 // 2), Image.LANCZOS) if im.width > width else im
        out.save(OUT + name, quality=Q, method=6)
        print(name, out.size)
