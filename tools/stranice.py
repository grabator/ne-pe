"""
Podstranice: prica.html, radovi.html, svadbe.html, akademija.html, saradnja.html i recepti.html.
Sve imaju isto zaglavlje, meni i podnožje kao početna; sadržaj crta js/app.js prema data-page.

Pokretanje: python3 tools/stranice.py   (treba node)
Naslovi i opisi se čitaju iz data/np.js (pages), adresa iz <link rel="canonical"> u index.html.
"""
import html, json, re, subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
e = html.escape


def data():
    js = "global.window={};require(process.argv[1]);console.log(JSON.stringify(window.NP))"
    return json.loads(subprocess.check_output(['node', '-e', js, str(ROOT / 'data' / 'np.js')]))


def page(base, key, file, title, desc, extra_css='', extra_js='', body_cls='', noscript=''):
    css = '<link rel="stylesheet" href="css/style.css">' + (f'\n<link rel="stylesheet" href="{extra_css}">' if extra_css else '')
    pre = '<link rel="preload" href="assets/fonts/mrs-saint-delafield-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>'
    scripts = ['data/np.js', 'data/slike.js'] + (['data/recepti.js'] if extra_js else []) + ['js/art.js', 'js/app.js'] + ([extra_js] if extra_js else []) + ['js/fx.js']
    return f'''<!doctype html>
<html lang="bs">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<!-- DEMO: obrisati ovaj red prije objave (vidi README) -->
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#0E0C0A">
<meta name="color-scheme" content="dark">
<link rel="icon" href="assets/np.svg" type="image/svg+xml">
<link rel="canonical" href="{base}{file}">
<meta property="og:type" content="website">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:image" content="{base}assets/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="{base}{file}">
<meta property="og:locale" content="bs_BA">
<meta name="twitter:card" content="summary_large_image">
<link rel="preload" href="assets/fonts/cormorant-garamond-latin-300-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/manrope-latin-500-normal.woff2" as="font" type="font/woff2" crossorigin>
{pre}
{css}
<script>
  /* jezik i tema prije crtanja, da ništa ne trepne (uvod je samo na početnoj) */
  (function () {{
    var d = document.documentElement, l = null;
    try {{ l = new URLSearchParams(location.search).get('lang') || localStorage.getItem('np-lang'); }} catch (e) {{}}
    if (l === 'en' || l === 'de' || l === 'bs') d.lang = l;
    d.className += ' js';
    try {{ if (localStorage.getItem('np-theme') === 'light') d.setAttribute('data-theme', 'light'); }} catch (e) {{}}
  }})();
</script>
</head>
<body data-page="{key}"{f' class="{body_cls}"' if body_cls else ''}>
<a class="skip" href="#main" data-t="ui.skip">Preskoči na sadržaj</a>

<header class="top solid" id="top">
  <a class="brand" href="./" aria-label="Nemanja Petrović, početna">
    <svg class="mono" viewBox="0 0 108 80" aria-hidden="true"><text x="2" y="64">N</text><text x="44" y="64">P</text><path class="mono-line" d="M8 74 H100"/></svg>
    <span class="brand-name">Nemanja Petrović</span>
  </a>
  <span class="brand-page" id="brand-page"></span>
  <div class="top-right">
    <button class="theme-btn theme-top" type="button" data-theme-btn aria-pressed="false" aria-label="Svijetla tema"><i aria-hidden="true"></i></button>
    <div class="langs" id="langs" role="group" aria-label="Jezik"></div>
    <a class="hd-write" id="hd-write" href="#contact">Pišite mi</a>
    <button class="menu-btn" id="menu-btn" type="button" aria-expanded="false" aria-controls="sheet"><span class="mb-l" aria-hidden="true"><i></i><i></i></span><span class="mb-t" data-t="ui.menu">Meni</span></button>
  </div>
  <i class="progress" aria-hidden="true"></i>
</header>

<div class="sheet" id="sheet" hidden></div>

<main id="main" tabindex="-1">
  <noscript>
    <div class="wrap nos">
      <p>{e(noscript or desc)}</p>
      <p>Instagram: <a href="https://www.instagram.com/nemanja_petr/">@nemanja_petr</a></p>
    </div>
  </noscript>
</main>

<footer class="foot" id="foot"></footer>

<div class="cursor" aria-hidden="true"></div>

{chr(10).join(f'<script src="{x}"></script>' for x in scripts)}
</body>
</html>
'''


def main():
    D = data()
    base = re.search(r'<link rel="canonical" href="([^"]+)"', (ROOT / 'index.html').read_text(encoding='utf-8')).group(1)
    for key, P in D['pages'].items():
        out = page(base, key, P['file'], P['seo']['bs'], P['lead']['bs'])
        (ROOT / P['file']).write_text(out, encoding='utf-8'); print(P['file'])
    out = page(base, 'recepti', 'recepti.html', 'Recepti · Nemanja Petrović · Pastry Chef',
               'Recepti Nemanje Petrovića, pastry chefa iz Mostara: Luda torta bez mlijeka i jaja, Doboš torta i šta zapravo određuje cijenu torte.',
               extra_css='css/recepti.css', extra_js='js/recepti.js', body_cls='rc-page',
               noscript='Recepti se prikazuju uz uključen JavaScript.')
    (ROOT / 'recepti.html').write_text(out, encoding='utf-8'); print('recepti.html')


if __name__ == '__main__':
    main()
