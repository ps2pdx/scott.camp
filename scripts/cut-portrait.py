"""Cuts the Contact portrait. Pillow only, pixels only (run with python3 -I).
Source: 'Scott Campbell Portrait 1.png' (1684 by 2528, studio headshot on black), kept out of the repo for size, at
~/.claude/projects/-Users-aquapurp-code-nertia/scott-camp-assets/portrait/. Pass another path as the first argument.
A 1:1 crop the full width of the frame, its top TOP px down so the head keeps its headroom (a centred square
would cut through the forehead), at 640 (portrait.webp) and 320 (portrait-320.webp), quality 82."""
import os, sys
from PIL import Image

SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser('~/.claude/projects/-Users-aquapurp-code-nertia/scott-camp-assets/portrait/Scott Campbell Portrait 1.png')
OUT = 'public/evidence/'
Q = 82
TOP = 100

if __name__ == '__main__':
    src = Image.open(SRC).convert('RGBA')
    im = Image.new('RGB', src.size, (0, 0, 0))
    im.paste(src, mask=src.getchannel('A'))
    w, h = im.size
    sq = im.crop((0, TOP, w, TOP + w))
    for width, name in ((640, 'portrait.webp'), (320, 'portrait-320.webp')):
        sq.resize((width, width), Image.LANCZOS).save(OUT + name, quality=Q, method=6)
        print(name, os.path.getsize(OUT + name))
