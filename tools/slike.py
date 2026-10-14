# Obrada fotografija: izrez, topliji ton, blaga vinjeta, WebP u 480/960/1440.
# Pokretanje: python3 tools/slike.py  (izvori su u _izvor/, rezultat ide u assets/img/)
import json, os
from PIL import Image, ImageEnhance, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, '_izvor')
OUT = os.path.join(ROOT, 'assets', 'img')
os.makedirs(OUT, exist_ok=True)
# stari rezultati (samo .webp koje ova skripta pravi)
for f in os.listdir(OUT):
    if f.endswith('.webp'):
        os.remove(os.path.join(OUT, f))

def a(n):  # slika iz članka po broju
    names = sorted(os.listdir(os.path.join(SRC, 'img')))
    return os.path.join('img', names[n - 1])

# id: (izvor, izrez kao udio [l, t, r, b] ili None)
SLIKE = {
    'portret':      ('insta/portret-odijelo.jpg', [0.15, 0.0, 0.93, 0.975]),
    'stepenice':    (a(14), None),
    'portret-crna': (a(21), None),
    'sprat11':      (a(13), None),
    'sprat11-b':    (a(3), None),
    'sprat11-on':   (a(12), None),
    'sprat11-palme':(a(6), None),
    'secer':        ('insta/radobolja-secer.jpg', [0.0, 0.165, 1.0, 0.655]),
    'capljina':     ('insta/president-capljina.jpg', [0.0, 0.215, 1.0, 0.70]),
    'mladenci':     (a(23), None),
    'balon-zlato':  (a(4), None),
    'balon-roze':   (a(5), None),
    'crno-zlato':   (a(7), None),
    'bozic':        (a(10), None),
    'dzungla':      (a(11), None),
    'olimpijska':   (a(18), None),
    'leptiri':      (a(19), None),
    'aldi-maketa':  (a(8), None),
    'aldi-konj':    (a(17), None),
    'diploma-budva':(a(2), None),
    'diploma-brac': (a(24), None),
    'diploma-nis':  (a(15), [0.42, 0.38, 1.0, 1.0]),
    'plating':      (a(25), None),
    'servis':       (a(20), None),
    'kuhinja':      ('shef.jpg', [0.30, 0.0, 0.95, 1.0]),
}

def grade(im):
    im = im.convert('RGB')
    # topliji ton: malo podigni crvenu, spusti plavu
    r, g, b = im.split()
    r = r.point(lambda v: min(255, int(v * 1.035 + 3)))
    b = b.point(lambda v: int(v * 0.95))
    im = Image.merge('RGB', (r, g, b))
    im = ImageEnhance.Contrast(im).enhance(1.04)
    im = ImageEnhance.Color(im).enhance(0.96)
    # blaga vinjeta
    w, h = im.size
    m = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(m)
    d.ellipse([-w * 0.25, -h * 0.2, w * 1.25, h * 1.2], fill=255)
    m = m.filter(ImageFilter.GaussianBlur(min(w, h) * 0.18))
    dark = Image.new('RGB', (w, h), (14, 12, 10))
    return Image.composite(im, Image.blend(im, dark, 0.28), m)

meta = {}
for key, (src, crop) in SLIKE.items():
    im = Image.open(os.path.join(SRC, src))
    if crop:
        W, H = im.size
        im = im.crop((int(crop[0] * W), int(crop[1] * H), int(crop[2] * W), int(crop[3] * H)))
    im = grade(im)
    W, H = im.size
    sizes = []
    for w in sorted(set(min(tw, W) for tw in (480, 960, 1440))):
        h = round(H * w / W)
        im.resize((w, h), Image.LANCZOS).save(os.path.join(OUT, f'{key}-{w}.webp'), 'WEBP', quality=78, method=6)
        sizes.append(w)
    meta[key] = {'w': W, 'h': H, 'sizes': sizes}

# dimenzije i veličine za stranicu (data/slike.js)
with open(os.path.join(ROOT, 'data', 'slike.js'), 'w') as f:
    f.write('/* generisano: python3 tools/slike.py */\nwindow.NP_IMG = ' + json.dumps(meta, separators=(',', ':')) + ';\n')
print(json.dumps(meta))
