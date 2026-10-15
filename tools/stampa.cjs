/*
 * Izvoz kartica sa stampa.html u fajlove za preuzimanje (assets/print/):
 *   qr-kartica.png / .pdf   A6, 105 x 148 mm
 *   vizitka.png / .pdf      85 x 55 mm
 *   qr-kod.png              samo QR kod
 * PNG je u 300 dpi, PDF je u tačnoj veličini (za štampariju).
 *
 * Pokretanje (lokalni server mora raditi: node serve.mjs 8091):
 *   npm i -g playwright-core && npx playwright-core install chromium
 *   NODE_PATH=$(npm root -g) node tools/stampa.cjs
 */
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const BASE = process.env.NP_URL || 'http://localhost:8091/';
const OUT = path.join(__dirname, '..', 'assets', 'print');
const DPI = 300, PX = 96;
const ITEMS = [
  { id: 'a6', name: 'qr-kartica', w: 105, h: 148, sel: '.a6' },
  { id: 'bc', name: 'vizitka', w: 85, h: 55, sel: '.bc' }
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  for (const it of ITEMS) {
    const mm = v => Math.round(v / 25.4 * PX);
    const p = await b.newPage({ viewport: { width: mm(it.w) + 40, height: mm(it.h) + 40 }, deviceScaleFactor: DPI / PX });
    await p.goto(BASE + 'stampa.html?samo=' + it.id, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await (await p.$(it.sel)).screenshot({ path: path.join(OUT, it.name + '.png') });
    await p.emulateMedia({ media: 'screen' });
    await p.addStyleTag({ content: '@page { size: ' + it.w + 'mm ' + it.h + 'mm; margin: 0 } html, body, .sheet, .item, .biz { margin: 0 !important; padding: 0 !important; display: block !important; } ' + it.sel + ' { margin: 0 !important; }' });
    await p.pdf({ path: path.join(OUT, it.name + '.pdf'), width: it.w + 'mm', height: it.h + 'mm', printBackground: true, pageRanges: '1' });
    await p.close();
    console.log(it.name);
  }
  /* samo QR kod, bijela podloga */
  const p = await b.newPage({ viewport: { width: 400, height: 400 }, deviceScaleFactor: 3 });
  await p.goto(BASE + 'stampa.html', { waitUntil: 'networkidle' });
  await (await p.$('.qr-only')).screenshot({ path: path.join(OUT, 'qr-kod.png') });
  await b.close();
  console.log('qr-kod');
})();
