"""
Oznake verzija na CSS, JS i data fajlovima u svim HTML stranicama: css/style.css?v=3f2a91c0d1
Oznaka je otisak sadržaja fajla, pa se mijenja samo kad se fajl promijeni. Tako preglednik nakon
objave sigurno uzme nove fajlove (a između objava ih i dalje čuva u kešu).

Pokretanje: python3 tools/verzije.py   (pokreće ga i tools/stranice.py; obavezno prije svakog pusha
ako je mijenjan bilo koji fajl u css/, js/ ili data/)
"""
import hashlib, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REF = re.compile(r'((?:src|href)=")((?:css|js|data)/[^"?#]+)(?:\?v=[0-9a-f]+)?(")')


def stamp(path):
    return hashlib.sha1((ROOT / path).read_bytes()).hexdigest()[:10]


def main():
    for page in sorted(ROOT.glob('*.html')):
        txt = page.read_text(encoding='utf-8')
        new = REF.sub(lambda m: m.group(1) + m.group(2) + '?v=' + stamp(m.group(2)) + m.group(3) if (ROOT / m.group(2)).is_file() else m.group(0), txt)
        if new != txt:
            page.write_text(new, encoding='utf-8'); print(page.name)


if __name__ == '__main__':
    main()
