"""
Rukopisni font (Mrs Saint Delafield) za naslove recepata.
Original nema č, ć, š, ž: ovdje se dodaju (kvačica je okrenut ^, a ć ima akcent iz é) i kopira se kerning osnovnog slova.

Pokretanje: python3 tools/rukopis.py S=950 Z=700   (treba fontTools)
Original: _izvor/MrsSaintDelafield.woff2 (Google Fonts), rezultat: assets/fonts/mrs-saint-delafield-latin-400-normal.woff2
"""
import sys
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen
ROOT=Path(__file__).resolve().parent.parent
SRC=ROOT/'_izvor'/'MrsSaintDelafield.woff2'
f=TTFont(SRC); g=f['glyf']; gs=f.getGlyphSet(); hm=f['hmtx']
# (novi znak, osnova, akcent, centar x akcenta, razmak iznad)
X = {k: float(v) for k, v in (a.split('=') for a in sys.argv[1:])}
plan=[(0x161,'scaron','s','caron',X.get('s',175)),(0x17E,'zcaron','z','caron',X.get('z',150)),
      (0x10D,'ccaron','c','caron',X.get('c',215)),(0x107,'cacute','c','acute',X.get('cc',225)),
      (0x160,'Scaron','S','caron',X.get('S',700)),(0x17D,'Zcaron','Z','caron',X.get('Z',600)),
      (0x10C,'Ccaron','C','caron',X.get('C',520)),(0x106,'Cacute','C','acute',X.get('CC',540))]
cm=f['cmap']
NEW=[]
for code,name,base,acc,cx in plan:
    pen=TTGlyphPen(gs); gs[base].draw(pen)
    B=g[base]
    if acc:
        src='circumflex' if acc=='caron' else 'acute'; A=g[src]
        acx=(A.xMin+A.xMax)/2
        if acc=='caron':
            # okrenut ^: y' = -y + t, dno kvačice 12 jedinica iznad slova
            tr=(1,0,0,-1,cx-acx, B.yMax+12+A.yMax)
        else:
            tr=(1,0,0,1,cx-acx, B.yMax+14-A.yMin)
        gs[src].draw(TransformPen(pen,tr))
    gl=pen.glyph()
    if not acc: continue
    gl.recalcBounds(g)
    NEW.append((name,base))
    g[name]=gl; f.setGlyphOrder(f.getGlyphOrder()+[name]) if name not in f.getGlyphOrder() else None
    hm[name]=(hm[base][0], gl.xMin)
    for t in cm.tables:
        if t.isUnicode(): t.cmap[code]=name
import copy as cp
for L in f['GPOS'].table.LookupList.Lookup:
    for st in L.SubTable:
        if st.Format!=1: continue
        cov=st.Coverage.glyphs
        for name,base in NEW:
            if base in cov:
                i=cov.index(base); ps=cp.deepcopy(st.PairSet[i]); cov.append(name); st.PairSet.append(ps)
        for ps in st.PairSet:
            add=[]
            for pv in ps.PairValueRecord:
                for name,base in NEW:
                    if pv.SecondGlyph==base: n=cp.deepcopy(pv); n.SecondGlyph=name; add.append(n)
            ps.PairValueRecord+=add; ps.PairValueCount=len(ps.PairValueRecord)
        order={n:i for i,n in enumerate(f.getGlyphOrder())}
        pairs=sorted(zip(cov,st.PairSet),key=lambda t:order[t[0]]); st.Coverage.glyphs=[p[0] for p in pairs]; st.PairSet=[p[1] for p in pairs]; st.PairSetCount=len(pairs)
        for ps in st.PairSet: ps.PairValueRecord.sort(key=lambda r:order[r.SecondGlyph])
f['maxp'].numGlyphs=len(f.getGlyphOrder())
f.flavor='woff2'; f.save(ROOT/'assets'/'fonts'/'mrs-saint-delafield-latin-400-normal.woff2')
