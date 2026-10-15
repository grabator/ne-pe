"""
QR kod za štampu (vizit karta, stalak u slastičarni): vodi direktno na kontakt.
Pokretanje: python3 tools/qr.py   (treba: pip install segno)
Adresa se čita iz <link rel="canonical"> u index.html, pa nakon promjene domene samo ponovo pokrenuti.
"""
import re
from pathlib import Path
import segno

ROOT = Path(__file__).resolve().parent.parent
base = re.search(r'<link rel="canonical" href="([^"]+)"', (ROOT / 'index.html').read_text(encoding='utf-8')).group(1)
url = base + '#contact'
qr = segno.make(url, error='m')
qr.save(ROOT / 'assets' / 'qr-kontakt.svg', scale=10, border=2, dark='#1C1712', light=None, xmldecl=False, svgns=True)
print(url)
