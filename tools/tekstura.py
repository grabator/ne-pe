"""
Tekstura tamnog mramora: tanke, jedva vidljive zlatne žile na providnoj podlozi (WebP sa alfa kanalom).
Pokretanje: python3 tools/tekstura.py  (treba numpy i Pillow)
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

OUT = Path(__file__).resolve().parent.parent / 'assets' / 'tex'
rng = np.random.default_rng(7)


def noise(w, h, scale):
    """glatki šum: mala nasumična mreža uvećana bikubično"""
    g = rng.random((max(2, h // scale + 2), max(2, w // scale + 2)))
    im = Image.fromarray((g * 255).astype('uint8')).resize((w + scale * 2, h + scale * 2), Image.BICUBIC)
    return np.asarray(im, dtype='float32')[:h, :w] / 255


def fbm(w, h):
    return sum(noise(w, h, s) * a for s, a in ((420, 0.5), (180, 0.28), (70, 0.14), (24, 0.08)))


def marble(w, h, name, strength):
    y, x = np.mgrid[0:h, 0:w].astype('float32')
    t = fbm(w, h)
    v = np.abs(np.sin((x * 0.55 + y * 0.85) / 210 + t * 3.2))
    vein = (1 - v) ** 22                                   # tanke žile
    soft = fbm(w, h) ** 3 * 0.9
    a = np.clip((vein + soft) * strength, 0, 1)
    rgba = np.zeros((h, w, 4), dtype='uint8')
    rgba[..., 0], rgba[..., 1], rgba[..., 2] = 214, 178, 120
    rgba[..., 3] = (a * 255).astype('uint8')
    im = Image.fromarray(rgba, 'RGBA').filter(ImageFilter.GaussianBlur(0.6))
    im.save(OUT / name, 'WEBP', quality=55, method=6)
    print(name, (OUT / name).stat().st_size)


marble(1200, 800, 'mramor.webp', 0.15)
