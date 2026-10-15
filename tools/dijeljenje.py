"""
Slike i stranice za dijeljenje fotografija (svadbe i fondan).

Za svaku fotografiju nastaju:
  assets/share/<id>.jpg   1200x630, fotografija sa potpisom (za Facebook, WhatsApp, Viber...)
  t/<id>.html             mala stranica sa tom slikom u og: podacima, odmah vodi na svadbe.html ili radovi.html?foto=<id>

Pokretanje: python3 tools/dijeljenje.py   (treba Pillow, fontTools i node)
Adresa stranice se čita iz <link rel="canonical"> u index.html.
"""
import html, json, re, subprocess, tempfile
from pathlib import Path
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
W, H = 1200, 630
INK, GOLD, GOLD2, CREAM, CREAM2 = (14, 12, 10), (201, 164, 106), (226, 198, 144), (243, 234, 219), (168, 155, 136)


def data():
    js = "global.window={};require(process.argv[1]);console.log(JSON.stringify(window.NP))"
    return json.loads(subprocess.check_output(['node', '-e', js, str(ROOT / 'data' / 'np.js')]))


def both(fam, style, tmp):
    """latin i latin-ext su odvojeni fajlovi (zbog brzine stranice), ovdje ih spajamo u jedan"""
    from fontTools.merge import Merger
    parts = []
    for sub in ('latin', 'latin-ext'):
        t = TTFont(ROOT / 'assets' / 'fonts' / f'{fam}-{sub}-{style}.woff2'); t.flavor = None
        out = Path(tmp) / f'{fam}-{sub}-{style}.ttf'; t.save(out); parts.append(str(out))
    out = Path(tmp) / f'{fam}-{style}.ttf'; Merger().merge(parts).save(out); return str(out)


def spaced(d, xy, text, font, fill, track):
    x, y = xy
    for ch in text:
        d.text((x, y), ch, font=font, fill=fill); x += d.textlength(ch, font=font) + track


def wrap(d, text, font, width):
    lines, cur = [], ''
    for w in text.split():
        t = (cur + ' ' + w).strip()
        if d.textlength(t, font=font) <= width: cur = t
        else: lines.append(cur); cur = w
    return lines + [cur]


def card(photo, caption, fonts):
    im = Image.new('RGB', (W, H), INK)
    glow = Image.new('L', (W, H), 0); ImageDraw.Draw(glow).ellipse((-200, 120, 700, 900), fill=60)
    im.paste(Image.new('RGB', (W, H), (40, 32, 20)), mask=glow.filter(ImageFilter.GaussianBlur(120)))
    # fotografija desno, izrezana da popuni okvir
    bx, by, bw, bh = 620, 40, 540, 550
    src = Image.open(photo).convert('RGB'); r = max(bw / src.width, bh / src.height)
    src = src.resize((round(src.width * r), round(src.height * r)), Image.LANCZOS)
    l, t = (src.width - bw) // 2, int((src.height - bh) * 0.35)
    im.paste(src.crop((l, t, l + bw, t + bh)), (bx, by))
    d = ImageDraw.Draw(im)
    d.rectangle((bx - 12, by - 12, bx + bw + 12, by + bh + 12), outline=GOLD, width=1)
    spaced(d, (60, 70), 'PASTRY CHEF · MOSTAR', fonts['label'], GOLD, 4)
    y = 130
    for line in wrap(d, caption, fonts['cap'], 500)[:4]:
        d.text((60, y), line, font=fonts['cap'], fill=CREAM); y += 54
    d.text((52, 350), 'Nemanja', font=fonts['sign'], fill=GOLD2)
    spaced(d, (62, 566), 'NEMANJA PETROVIĆ', fonts['small'], CREAM2, 4)
    return im


def page(base, item_id, title, desc, where):
    img = f'{base}assets/share/{item_id}.jpg'
    to = f'../{where}?foto={item_id}'
    e = html.escape
    return f'''<!doctype html>
<html lang="bs">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title>
<!-- DEMO: obrisati ovaj red prije objave (vidi README) -->
<meta name="robots" content="noindex">
<meta property="og:type" content="article">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:image" content="{img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="{base}t/{item_id}.html">
<meta name="twitter:card" content="summary_large_image">
<meta http-equiv="refresh" content="0; url={to}">
<link rel="canonical" href="{base}{where}?foto={item_id}">
<script>location.replace({json.dumps(to)});</script>
</head>
<body style="background:#0E0C0A;color:#F3EADB;font-family:system-ui,sans-serif;padding:40px">
<p><a href="{to}" style="color:#E2C690">{e(title)}</a></p>
</body>
</html>
'''


def main():
    D = data()
    base = re.search(r'<link rel="canonical" href="([^"]+)"', (ROOT / 'index.html').read_text(encoding='utf-8')).group(1)
    items = [(g['id'], g['cap']['bs'], 'svadbe.html') for g in D['weddings']['gallery']] + [(f['id'], f['cap']['bs'], 'radovi.html') for f in D['fondant']['items']]
    (ROOT / 'assets' / 'share').mkdir(parents=True, exist_ok=True); (ROOT / 't').mkdir(exist_ok=True)
    img = json.loads(re.search(r'window\.NP_IMG\s*=\s*(\{.*\})', (ROOT / 'data' / 'slike.js').read_text(encoding='utf-8'), re.S).group(1))
    with tempfile.TemporaryDirectory() as tmp:
        fonts = {
            'sign': ImageFont.truetype(str(ROOT / 'tools' / 'potpis.ttf'), 120),
        }
        fonts['cap'] = ImageFont.truetype(both('cormorant-garamond', '300-italic', tmp), 46)
        man = both('manrope', '600-normal', tmp)
        fonts['label'], fonts['small'] = ImageFont.truetype(man, 15), ImageFont.truetype(man, 14)
        for item_id, cap, where in items:
            big = max(img[item_id]['sizes'])
            card(ROOT / 'assets' / 'img' / f'{item_id}-{big}.webp', cap, fonts).save(ROOT / 'assets' / 'share' / f'{item_id}.jpg', quality=84, optimize=True, progressive=True)
            (ROOT / 't' / f'{item_id}.html').write_text(page(base, item_id, f'{cap} · Nemanja Petrović', 'Pastry chef iz Mostara. Svadbene torte, fondan i Akademija slastičarstva.', where), encoding='utf-8')
            print(item_id)


if __name__ == '__main__':
    main()
