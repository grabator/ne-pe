"""
Press kit za medije: fotografije, kratka biografija na tri jezika i logo, u jednom ZIP fajlu.
Pokretanje: python3 tools/presskit.py   (treba Pillow)
DEMO: fotografije su najveće verzije sa stranice; kad stignu originali, staviti ih u _izvor/press/ (koriste se umjesto njih).
"""
import io, json, re, zipfile
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'assets' / 'press' / 'nemanja-petrovic-press-kit.zip'
FOTO = ['portret', 'portret-crna', 'stepenice', 'kuhinja', 'plating', 'secer', 'capljina', 'sprat11-b', 'balon-zlato', 'crno-zlato']

BIO = {
    'biografija-bs.txt': """Nemanja Petrović · Pastry Chef · Mostar

Nemanja Petrović je pastry chef iz Mostara, rodom iz Doboja, sa 15 godina iskustva. Zanat je počeo učiti na edukaciji u Zagrebu, a usavršavao se kod vrhunskih slastičara širom Evrope. Danas radi kao pastry chef u Aldi grupi u Mostaru.

Poznat je po restoranskim desertima i neobičnim spojevima okusa (krema od piva i mandarina, panakota s lavandom, bijelo vino i maline), svadbenim tortama i figurama od fondana. Njegova najveća torta imala je jedanaest spratova.

Nagrade: zlatna medalja za restoranski desert (Niš, 2022), srebrna medalja na Prvenstvu Crne Gore (Budva, 2023), bronzana medalja na evropskom takmičenju Bisermora (Brač, 2023), dvije zlatne medalje 2024.

U Akademiji slastičarstva Mostar prenosi znanje mladim slastičarima. Autor je serijala "Slatke priče" (30 emisija i recepata).

Instagram: @nemanja_petr
""",
    'biography-en.txt': """Nemanja Petrović · Pastry Chef · Mostar

Nemanja Petrović is a pastry chef from Mostar, born in Doboj, with 15 years of experience. He began learning the craft at a course in Zagreb and refined it with leading pastry chefs across Europe. Today he is the pastry chef of the Aldi Group in Mostar.

He is known for restaurant desserts and unexpected flavour pairings (beer cream and mandarin, lavender panna cotta, white wine and raspberries), wedding cakes and fondant figures. His largest cake had eleven tiers.

Awards: gold medal for a restaurant dessert (Niš, 2022), silver medal at the Montenegro Championship (Budva, 2023), bronze medal at the Bisermora European competition (Brač, 2023), two gold medals in 2024.

At the Mostar Pastry Academy he passes his knowledge on to young pastry chefs. He is the author of the "Sweet Stories" series (30 episodes and recipes).

Instagram: @nemanja_petr
""",
    'biografie-de.txt': """Nemanja Petrović · Pastry Chef · Mostar

Nemanja Petrović ist Pastry Chef aus Mostar, geboren in Doboj, mit 15 Jahren Erfahrung. Das Handwerk lernte er bei einer Ausbildung in Zagreb und vervollkommnete es bei führenden Konditoren in ganz Europa. Heute ist er Pastry Chef der Aldi Gruppe in Mostar.

Bekannt ist er für Restaurantdesserts und ungewöhnliche Aromen (Biercreme und Mandarine, Lavendel-Panna-Cotta, Weißwein und Himbeeren), Hochzeitstorten und Fondantfiguren. Seine größte Torte hatte elf Etagen.

Auszeichnungen: Goldmedaille für ein Restaurantdessert (Niš, 2022), Silbermedaille bei der Meisterschaft Montenegros (Budva, 2023), Bronzemedaille beim europäischen Wettbewerb Bisermora (Brač, 2023), zwei Goldmedaillen 2024.

In der Konditorei-Akademie Mostar gibt er sein Wissen an junge Konditoren weiter. Er ist Autor der Reihe "Süße Geschichten" (30 Folgen und Rezepte).

Instagram: @nemanja_petr
""",
}


def main():
    img = json.loads(re.search(r'window\.NP_IMG\s*=\s*(\{.*\})', (ROOT / 'data' / 'slike.js').read_text(encoding='utf-8'), re.S).group(1))
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED) as z:
        for name, text in BIO.items():
            z.writestr(name, text)
        z.write(ROOT / 'assets' / 'np.svg', 'logo-np.svg')
        for i in FOTO:
            orig = ROOT / '_izvor' / 'press' / f'{i}.jpg'
            if orig.exists():
                z.write(orig, f'fotografije/{i}.jpg'); continue
            src = ROOT / 'assets' / 'img' / f'{i}-{max(img[i]["sizes"])}.webp'
            buf = io.BytesIO(); Image.open(src).convert('RGB').save(buf, 'JPEG', quality=92); z.writestr(f'fotografije/{i}.jpg', buf.getvalue())
    print(OUT.name, round(OUT.stat().st_size / 1024 / 1024, 1), 'MB')


if __name__ == '__main__':
    main()
