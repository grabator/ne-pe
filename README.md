# Nemanja Petrović · Pastry Chef

Lična stranica slastičara Nemanje Petrovića iz Mostara. Priča, potpisni recepti, torta od jedanaest spratova, svadbe, fondan, nagrade, Akademija slastičarstva i kontakt.

Ovo je **demo** verzija: stranica se ne indeksira, a kontakt podaci su primjeri (označeni sa DEMO).

## Pokretanje

Nema instalacije ni build koraka. Potreban je samo Node.js:

```
node serve.mjs
```

Pa otvoriti http://localhost:8080 (drugi port: `node serve.mjs 8091`).

Jezik se može birati i preko adrese: `?lang=en`, `?lang=de`.

Uvod (monogram NP i zavjesa) se prikaže samo pri prvom otvaranju. Da se vidi ponovo: `?intro` na kraju adrese.

## Gdje je šta

| Fajl | Sadržaj |
| --- | --- |
| `data/np.js` | Sav tekst na tri jezika (bs, en, de), kontakt, nagrade, galerije |
| `data/slike.js` | Dimenzije slika (pravi ga `tools/slike.py`, ne mijenjati ručno) |
| `index.html` | Kostur stranice, prvi ekran, SEO podaci |
| `js/app.js` | Sekcije, meni, jezici, galerija, filter fondana, kontakt forma |
| `js/fx.js` | Efekti: uvod, šećer u prahu, 11 spratova, svadbe (strelice), odbrojavanje, medalje, kursor |
| `js/art.js` | Crteži: potpis, monogram za uvod, ilustracije recepata, slojevi deserta |
| `css/style.css` | Cijeli izgled |
| `assets/img/` | Slike u WebP formatu, tri veličine |
| `assets/fonts/` | Cormorant Garamond i Manrope (OFL licence uz fontove) |
| `tools/slike.py` | Obrada slika: izrez, topli ton, WebP veličine |
| `tools/fontovi.py` | Priprema Cormorant fonta (kvačice č, ć, š, ž spuštene bliže slovu) |
| `tools/tekstura.py` | Tekstura tamnog mramora u pozadini (`assets/tex/mramor.webp`) |
| `tools/dijeljenje.py` | Slike za dijeljenje (`assets/share/`) i stranice `t/<id>.html` za svaku fotografiju svadbi i fondana |
| `tools/qr.py` | QR kod za kontakt (`assets/qr-kontakt.svg`), koristi ga `stampa.html` |
| `tools/presskit.py` | Press kit ZIP (`assets/press/`): fotografije, biografija na tri jezika, logo |
| `stampa.html` | Kartica za štampu: stalak A6, vizit karta i QR kod, svaki se može preuzeti posebno (PNG i PDF) |
| `tools/stampa.cjs` | Pravi fajlove za preuzimanje u `assets/print/` (PNG 300 dpi i PDF u tačnoj veličini) |

Tekst se mijenja samo u `data/np.js`. Riječ između zvjezdica (`*Mostara*`) ispisuje se zlatnim kurzivom.

## Nove slike

1. Originale staviti u `_izvor/` (taj folder ne ide u repo).
2. U `tools/slike.py` dodati red u `SLIKE` (id, izvor, izrez).
3. Pokrenuti `python3 tools/slike.py` (treba Pillow).
4. Id slike upisati na željeno mjesto u `data/np.js`.

## Prije objave (obavezno)

1. `index.html`: obrisati red `<meta name="robots" content="noindex, nofollow">`.
2. `_headers`: obrisati red `X-Robots-Tag: noindex`.
3. `robots.txt`: zamijeniti sadržaj sa:
   ```
   User-agent: *
   Allow: /
   Sitemap: https://PRAVA-DOMENA/sitemap.xml
   ```
4. Adresu `ne-pe.grabafaceit.workers.dev` zamijeniti pravom domenom u `index.html` (canonical, og:url, og:image, JSON-LD) i u `sitemap.xml`, pa ponovo pokrenuti `python3 tools/dijeljenje.py` i `python3 tools/qr.py` (oba čitaju adresu iz `index.html`), a zatim `tools/stampa.cjs` da kartice za preuzimanje dobiju novi QR kod.
   U `tools/dijeljenje.py` i `stampa.html` obrisati red `noindex` (označen sa DEMO).
5. `data/np.js`:
   - `demo: false` (nestaju oznake DEMO i traka u podnožju),
   - upisati `contact.phone`, `contact.viber`, `contact.whatsapp` (samo brojevi, npr. `38761234567`) i `contact.email`,
   - YouTube: upisati pravi link kanala ili playliste i postaviti `youtubeIsSearch: false`,
   - nagrade 2024: upisati takmičenja kad budu poznata,
   - `anatomy.layers`: slojeve deserta prilagoditi pravom receptu (sada su primjer),
   - `academy.upcoming`: pravi datum, mjesto i broj mjesta sljedeće akademije (odbrojavanje radi samo od datuma),
   - `show.episodes`: pravi naslovi; u `video` upisati YouTube ID epizode i ona se pušta direktno na stranici,
   - `works.items[].image`: kad stignu fotografije deserata, upisati id slike (umjesto crteža se prikaže fotografija),
   - `reviews`: utisci su primjer; zamijeniti stvarnim utiscima (uz dozvolu osobe koja ih je napisala),
   - `faq`: odgovori su primjer; Nemanja treba potvrditi rokove, dostavu i pravila,
   - `notes`: tri spoja okusa i gdje su servirani provjeriti sa Nemanjom,
   - press kit: originalne fotografije staviti u `_izvor/press/<id>.jpg` i pokrenuti `python3 tools/presskit.py`.
6. Provjeriti kontakt formu: Viber, WhatsApp i email moraju otvarati Nemanjin broj i adresu.

## Objava (Cloudflare)

Statična stranica, bez builda. Na Cloudflare Pages ili Workers (static assets) kao izvor se stavlja korijen repozitorija. `_headers` postavlja keširanje i sigurnosna zaglavlja.

## Dizajn

- Tamna, topla paleta (ugljen, krem, zlato) jer su fotografije večernje i tople, a zlato veže medalje i šećer.
- Cormorant Garamond za naslove (elegantan, krupan), Manrope za tekst (čitljiv na mobitelu).
- Potpisni efekti: uvod sa monogramom NP, šećer u prahu na prvom ekranu (reaguje na miš), desert sa Brača koji se na klik rastavi na slojeve, torta od 11 spratova koja naraste kad se dođe do nje, potpis koji se ispisuje potezom pera.
- Svadbe: na desktopu strelice lijevo/desno, na mobitelu prevlačenje prstom. Ništa se ne "popunjava" dok se lista.
- Tamna tema je zadana, svijetla (krem i zlato) se bira prekidačem u zaglavlju ili meniju i pamti se.
- Svaka fotografija svadbi i fondana ima dugme "Podijeli": link vodi na stranicu sa posebnom slikom (fotografija + potpis), koja onda otvara tu fotografiju na stranici.
- Lista čekanja za akademiju i prijava šalju poruku preko Vibera ili WhatsAppa; stranica ne čuva nikakve podatke.
- Na mobitelu se recepti, svadbe i epizode prevlače prstom.
- Sekcija Svadbe je svijetla, kao predah između tamnih dijelova.
- Kontakt nije narudžba nego razgovor: tema, ime, poruka, pa slanje preko Vibera, WhatsAppa ili emaila.
- Sve animacije staju van ekrana, a uz postavku "smanji pokrete" stranica je mirna i sve je odmah vidljivo. Bez JavaScripta se vidi prvi ekran i osnovni podaci.
