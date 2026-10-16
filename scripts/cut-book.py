"""Cuts the Design system opener, the book's cover edge, from design/source. Pillow only. Same convention as cut-portrait.py.
Full frame, square as shot, no straightening and no crop."""
import sys
from PIL import Image, ImageOps

SRC = sys.argv[1] if len(sys.argv) > 1 else 'design/source/IMG_2975.jpeg'
OUT = 'public/evidence/'
Q = 82

if __name__ == '__main__':
    im = ImageOps.exif_transpose(Image.open(SRC)).convert('RGB')
    for width, name in ((1280, 'book.webp'), (640, 'book-640.webp')):
        out = im.resize((width, round(width * im.height / im.width)), Image.LANCZOS) if im.width > width else im
        out.save(OUT + name, quality=Q, method=6)
        print(name, out.size)
