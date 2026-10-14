"""
Cormorant Garamond za stranicu: statične težine iz Google Fonts varijabilnog fonta,
uz jednu doradu: kvačice i akcenti na malim slovima (č ć š ž ...) su u originalu
visoki i odvojeni od slova, pa ih ovdje skraćujemo i spuštamo bliže slovu.
Font je pod OFL licencom (bez rezervisanog imena), izmjene su dozvoljene.

Pokretanje: python3 tools/fontovi.py <folder sa cg-latin-normal.woff2 itd.>
"""
import math, sys, unicodedata
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

SRC = Path(sys.argv[1] if len(sys.argv) > 1 else '.')
OUT = Path(__file__).resolve().parent.parent / 'assets' / 'fonts'
SCALE, BASE = 0.58, 418  # visina akcenta (udio) i donja ivica akcenta (jedinice od 1000)
VARIANTE = [('normal', 300), ('normal', 400), ('normal', 500), ('italic', 300), ('italic', 400)]


def dotjeraj(t):
    g, cm = t['glyf'], t.getBestCmap()
    xh = t['OS/2'].sxHeight
    nagib = math.tan(math.radians(-t['post'].italicAngle))
    n = 0
    for cp, ime in cm.items():
        ch = chr(cp)
        if not ch.islower() or unicodedata.decomposition(ch) == '':
            continue
        gl = g[ime]
        if gl.isComposite() or gl.numberOfContours <= 0:
            continue
        co, ends, _ = gl.getCoordinates(g)
        s, promjena = 0, False
        for e in ends:
            ys = [co[i][1] for i in range(s, e + 1)]
            lo = min(ys)
            if lo > xh + 40 and max(ys) - lo > 150:  # visok akcent iznad slova
                for i in range(s, e + 1):
                    x, y = co[i]
                    ny = BASE + (y - lo) * SCALE
                    co[i] = (round(x - (y - ny) * nagib), round(ny))
                promjena = True
            s = e + 1
        if promjena:
            gl.coordinates = co
            gl.recalcBounds(g)
            n += 1
    return n


for stil, w in VARIANTE:
    for sub in ('latin', 'latin-ext'):
        t = instantiateVariableFont(TTFont(SRC / f'cg-{sub}-{stil}.woff2'), {'wght': w})
        n = dotjeraj(t)
        # hinting bi vratio akcente na staru visinu, pa ga uklanjamo (i manji fajl)
        for tag in ('fpgm', 'prep', 'cvt ', 'hdmx', 'LTSH', 'VDMX'):
            if tag in t: del t[tag]
        for gn in t.getGlyphOrder():
            t['glyf'][gn].removeHinting()
        t['maxp'].maxSizeOfInstructions = 0
        t.flavor = 'woff2'
        ime = OUT / f'cormorant-garamond-{sub}-{w}-{stil}.woff2'
        t.save(ime)
        print(ime.name, ime.stat().st_size, 'dorađeno:', n)
