/*
 * Nemanja Petrović · Pastry Chef: crtanje sekcija iz data/np.js, jezik, meni, lightbox, filter i kontakt forma.
 * Efekti (šećer, 11 spratova, otkrivanje, kursor) su u js/fx.js.
 */
(function () {
  'use strict';
  var D = window.NP, IMG = window.NP_IMG || {}, ART = window.NP_ART || {};
  var root = document.documentElement;
  var LANGS = D.languages;
  var lang = LANGS.indexOf(root.lang) !== -1 ? root.lang : LANGS[0];

  /* ---------- pomoćne ---------- */
  function L(o) { return o == null ? '' : (typeof o === 'string' || typeof o === 'number') ? String(o) : (o[lang] != null ? o[lang] : (o.en != null ? o.en : o.bs)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  /* *riječ* u naslovu postaje kurziv (em), ostalo se escapuje */
  function rich(s) { return esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>'); }
  function get(path) { return path.split('.').reduce(function (o, k) { return o && o[k]; }, D); }
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* naslov koji se otkriva riječ po riječ */
  function words(s) {
    /* razmaci unutar <em> ne dijele riječ, a tačka ostaje uz riječ */
    return rich(s.replace(/\*([^*]+)\*/g, function (m, x) { return '*' + x.replace(/ /g, '\u00a0') + '*'; })).split(/[ \n]+/).filter(Boolean).map(function (w, i) {
      return '<span class="w"><span style="--i:' + i + '">' + w + '</span></span>';
    }).join(' ');
  }

  /* slika sa srcset i dimenzijama (nema pomjeranja sadržaja) */
  function img(id, alt, sizes, cls, eager) {
    var m = IMG[id]; if (!m) return '';
    var set = m.sizes.map(function (w) { return 'assets/img/' + id + '-' + w + '.webp ' + w + 'w'; }).join(', ');
    var big = m.sizes[m.sizes.length - 1];
    return '<img' + (cls ? ' class="' + cls + '"' : '') + ' src="assets/img/' + id + '-' + big + '.webp" srcset="' + set + '" sizes="' + (sizes || '100vw') + '" width="' + m.w + '" height="' + m.h + '" alt="' + esc(alt) + '"' + (eager ? '' : ' loading="lazy"') + ' decoding="async">';
  }

  function head(sec, lead) {
    return '<header class="sec-head rv"><p class="chapter"><i aria-hidden="true"></i>' + esc(L(sec.chapter)) + '</p>' +
      '<h2 class="h2 split" id="' + sec._id + '-t">' + words(L(sec.title)) + '</h2>' + (lead ? '<p class="lead">' + esc(lead) + '</p>' : '') + '</header>';
  }

  /* ---------- sekcije ---------- */
  function stats() {
    return '<section class="stats" aria-label="' + esc(L(D.hero.meta)) + '"><ul class="wrap stats-in">' + D.stats.map(function (s, i) {
      return '<li class="stat rv" style="--d:' + i + '"><b class="num" data-count="' + s.n + '">' + s.n + '</b><span>' + esc(L(s.label)) + '</span>' + (s.sub ? '<small>' + esc(s.sub) + '</small>' : '') + '</li>';
    }).join('') + '</ul></section>';
  }

  function story() {
    var S = D.story; S._id = 'story';
    var a = S.images[0], b = S.images[1];
    return '<section class="sec story" id="story" aria-labelledby="story-t"><div class="wrap story-grid">' +
      '<div class="story-text">' + head(S) +
      L(S.text).map(function (p) { return '<p class="body rv">' + esc(p) + '</p>'; }).join('') + '</div>' +
      '<div class="story-art">' +
      '<figure class="ph ph-a ri" data-par="0.08">' + img(a.id, L(a.alt), '(max-width: 900px) 86vw, 40vw') + '</figure>' +
      '<figure class="ph ph-b ri">' + img(b.id, L(b.alt), '(max-width: 900px) 46vw, 18vw') + '</figure></div>' +
      '<blockquote class="quote rv"><p>' + esc(L(S.quote)) + '</p><i aria-hidden="true"></i><cite>' + esc(L(S.quoteNote)) + '</cite>' +
      (ART.sign ? '<div class="sign-wrap">' + ART.sign(esc(L(S.sign))) + '</div>' : '') + '</blockquote>' +
      '</div></section>';
  }

  var ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  function works() {
    var W = D.works; W._id = 'works';
    return '<section class="sec works" id="works" aria-labelledby="works-t"><div class="wrap">' + head(W) +
      '<ol class="cards">' + W.items.map(function (it, i) {
        return '<li class="card rv' + (it.image ? ' has-img' : '') + '" style="--d:' + i + '">' +
          '<figure class="card-art' + (it.image ? ' card-photo' : '') + '">' + (it.image ? img(it.image, L(it.name), '(max-width: 640px) 90vw, (max-width: 1100px) 45vw, 22vw') : (ART.ill ? ART.ill(it.art) : '')) + '</figure>' +
          '<span class="card-n">' + ROMAN[i] + '</span>' +
          '<h3 class="card-name">' + esc(L(it.name)) + '</h3>' +
          '<p class="card-notes">' + esc(L(it.notes)) + '</p><i class="card-line" aria-hidden="true"></i>' +
          '<p class="card-text">' + esc(L(it.text)) + '</p><p class="card-aside">' + esc(L(it.aside)) + '</p></li>';
      }).join('') + '</ol></div></section>';
  }

  /* spojevi okusa: dva sastojka, zašto idu zajedno i gdje su servirani */
  function notes() {
    var N = D.notes; if (!N) return ''; N._id = 'notes';
    return '<section class="sec notes" id="notes" aria-labelledby="notes-t"><div class="wrap">' + head(N, L(N.lead)) +
      '<ol class="nt-grid">' + N.items.map(function (it, i) {
        return '<li class="nt rv" style="--d:' + i + ';--c:' + it.color + '">' +
          '<div class="nt-pair" aria-hidden="true"><span class="nt-ic nt-a">' + (ART.icon ? ART.icon(it.icons[0]) : '') + '</span><i class="nt-x"></i><span class="nt-ic nt-b">' + (ART.icon ? ART.icon(it.icons[1]) : '') + '</span></div>' +
          '<h3 class="nt-name">' + esc(L(it.a)) + ' <em>&amp;</em> ' + esc(L(it.b)) + '</h3>' +
          '<p class="nt-why">' + esc(L(it.why)) + '</p>' +
          '<p class="nt-where"><small>' + esc(L(N.whereLabel)) + '</small><b>' + esc(L(it.where)) + '</b></p></li>';
      }).join('') + '</ol></div></section>';
  }

  /* utisci: klizač sa citatima */
  function reviews() {
    var R = D.reviews; if (!R) return ''; R._id = 'reviews';
    var tag = D.demo ? ' <small class="demo-tag">' + esc(L(D.ui.demoTag)) + '</small>' : '';
    return '<section class="sec reviews" id="reviews" aria-labelledby="reviews-t"><div class="wrap rw-wrap">' + head(R).replace('</p>', tag + '</p>') +
      '<div class="rw rv" aria-roledescription="carousel"><ul class="rw-track">' + R.items.map(function (it, i) {
        return '<li class="rw-item' + (i === 0 ? ' on' : '') + '" aria-hidden="' + (i !== 0) + '"><blockquote><p>' + esc(L(it.text)) + '</p><footer><b>' + esc(it.who) + '</b><span>' + esc(L(it.where)) + '</span></footer></blockquote></li>';
      }).join('') + '</ul>' +
      '<div class="rw-bar"><button type="button" class="rw-btn" data-rw="-1" aria-label="' + esc(L(D.ui.prevReview)) + '">←</button>' +
      '<p class="rw-dots">' + R.items.map(function (x, i) { return '<i' + (i === 0 ? ' class="on"' : '') + '></i>'; }).join('') + '</p>' +
      '<button type="button" class="rw-btn" data-rw="1" aria-label="' + esc(L(D.ui.nextReview)) + '">→</button></div></div></div></section>';
  }

  /* restorani i hoteli */
  function consult() {
    var C = D.consult; if (!C) return ''; C._id = 'consult';
    return '<section class="sec consult" id="consult" aria-labelledby="consult-t"><div class="wrap cs-grid">' +
      '<div class="cs-head">' + head(C, L(C.lead)) + '<a class="btn btn-sm rv" href="#contact" data-topic="collab">' + esc(L(C.cta)) + '<span aria-hidden="true">→</span></a></div>' +
      '<ol class="cs-list">' + C.items.map(function (it, i) {
        return '<li class="rv" style="--d:' + i + '"><span class="cs-n">' + String(i + 1).padStart(2, '0') + '</span><div><h3>' + esc(L(it.title)) + '</h3><p>' + esc(L(it.text)) + '</p></div></li>';
      }).join('') + '</ol></div></section>';
  }

  /* pitanja i odgovori */
  function faq() {
    var F = D.faq; if (!F) return ''; F._id = 'faq';
    var tag = D.demo ? ' <small class="demo-tag">' + esc(L(D.ui.demoTag)) + '</small>' : '';
    return '<section class="sec faq" id="faq" aria-labelledby="faq-t"><div class="wrap fq-grid"><div>' + head(F).replace('</p>', tag + '</p>') + '</div>' +
      '<div class="fq-list">' + F.items.map(function (it, i) {
        return '<details class="fq rv" style="--d:' + i + '"' + (i === 0 ? ' open' : '') + '><summary>' + esc(L(it.q)) + '<i aria-hidden="true"></i></summary><p>' + esc(L(it.a)) + '</p></details>';
      }).join('') + '</div></div></section>';
  }

  var anOpen = false;
  function anatomy() {
    var A = D.anatomy; if (!A || !ART.anatomy) return ''; A._id = 'anatomy';
    var names = A.layers.map(function (l) { return [esc(L(l.name)), esc(L(l.note))]; });
    var open = anOpen ? ' open' : '';
    return '<section class="sec anatomy' + open + '" id="anatomy" aria-labelledby="anatomy-t"><div class="wrap an-grid">' +
      '<div class="an-text">' + head(A) + '<p class="lead an-lead-txt rv">' + esc(L(A.lead)) + '</p>' +
      '<p class="an-dish rv"><span class="label">' + esc(L(A.badge)) + '</span><b>' + esc(L(A.dish)) + '</b></p>' +
      '<button type="button" class="btn btn-line btn-sm an-btn rv" data-an aria-pressed="' + anOpen + '" aria-controls="anatomy-list"><span class="an-b1">' + esc(L(A.open)) + '</span><span class="an-b2">' + esc(L(A.close)) + '</span></button></div>' +
      '<div class="an-art"><button type="button" class="an-hit" data-an aria-hidden="true" tabindex="-1">' + ART.anatomy(A.layers, names) + '<span class="an-hint">' + esc(L(A.hint)) + '</span></button>' +
      '<ol class="an-list" id="anatomy-list">' + A.layers.map(function (l, i) { return '<li data-i="' + i + '" style="--o:' + i + '"><small>' + (i + 1) + '</small><span><b>' + esc(L(l.name)) + '</b><em>' + esc(L(l.note)) + '</em></span></li>'; }).join('') + '</ol></div>' +
      '</div></section>';
  }

  function tiers() {
    var T = D.tiers; T._id = 'tiers';
    return '<section class="tiers" id="tiers" aria-labelledby="tiers-t"><div class="tiers-stage">' +
      '<div class="wrap tiers-grid">' +
      '<div class="tiers-text">' + head(T) +
      '<ol class="tiers-steps">' + T.steps.map(function (s, i) { return '<li data-step="' + i + '">' + esc(L(s)) + '</li>'; }).join('') + '</ol>' +
      '<p class="tiers-count" aria-hidden="true"><b class="tc-n">01</b><span>/ 11 ' + esc(L(T.unit)) + '</span></p>' +
      '<p class="tiers-final">' + esc(L(T.final)) + '</p></div>' +
      '<div class="tiers-art"><i class="tiers-line" aria-hidden="true"></i>' +
      '<figure class="tiers-cake">' + img(T.image.id, L(T.image.alt), '(max-width: 900px) 70vw, 34vw') + '</figure>' +
      '<figure class="tiers-detail">' + img(T.detail.id, L(T.detail.alt), '(max-width: 900px) 40vw, 14vw') + '<figcaption>' + esc(L(T.caption)) + '</figcaption></figure>' +
      '</div></div></div></section>';
  }

  function weddings() {
    var W = D.weddings; W._id = 'weddings';
    var g = W.gallery;
    function tile(it, i, cls, sizes) {
      return '<figure class="wd ' + cls + ' ri"><button class="lb-open" type="button" data-lb="wed" data-i="' + i + '" aria-label="' + esc(L(D.ui.open) + ': ' + L(it.cap)) + '">' +
        img(it.id, L(it.alt), sizes) + '</button><figcaption>' + esc(L(it.cap)) + '</figcaption></figure>';
    }
    return '<section class="weddings light" id="weddings" aria-labelledby="weddings-t"><div class="wd-pin"><div class="wd-inner">' +
      '<div class="wrap wd-top">' + head(W) + '<p class="body rv wd-text">' + esc(L(W.text)) + '</p></div>' +
      '<div class="wd-track" tabindex="0" role="region" aria-label="' + esc(L(W.chapter)) + '"><ul class="wd-rail">' +
      g.map(function (it, i) { return '<li class="wd-slide' + (i === 0 ? ' wd-first' : '') + '">' + tile(it, i, '', '(max-width: 900px) 86vw, 62vw').replace('<figure class="wd  ri">', '<figure class="wd">') + '</li>'; }).join('') +
      '</ul></div>' +
      '<div class="wrap wd-bar"><p class="wd-count" aria-hidden="true"><b>01</b> / ' + String(g.length).padStart(2, '0') + '</p>' +
      '<i class="wd-prog" aria-hidden="true"><i></i></i>' +
      '<p class="wd-nav"><button type="button" class="wd-btn" data-wd="-1" aria-label="' + esc(L(D.ui.prev)) + '">←</button><button type="button" class="wd-btn" data-wd="1" aria-label="' + esc(L(D.ui.next)) + '">→</button></p></div>' +
      '</div></div></section>';
  }

  function fondant() {
    var F = D.fondant; F._id = 'fondant';
    return '<section class="sec fondant" id="fondant" aria-labelledby="fondant-t"><div class="wrap">' + head(F, L(F.lead)) +
      '<div class="filters rv" role="group" aria-label="' + esc(L(F.chapter)) + '">' + F.filters.map(function (f, i) {
        return '<button type="button" class="pill" data-f="' + f.key + '" aria-pressed="' + (i === 0) + '">' + esc(L(f.label)) + '</button>';
      }).join('') + '</div>' +
      '<ul class="masonry">' + F.items.map(function (it, i) {
        return '<li class="mz" data-tags="' + it.tags.join(' ') + '"><button class="lb-open" type="button" data-lb="fon" data-i="' + i + '" aria-label="' + esc(L(D.ui.open) + ': ' + L(it.cap)) + '">' +
          img(it.id, L(F.alt) + L(it.cap), '(max-width: 900px) 46vw, (max-width: 1100px) 30vw, (max-width: 1600px) 23vw, 300px') + '<span class="mz-cap">' + esc(L(it.cap)) + '</span></button></li>';
      }).join('') + '</ul></div></section>';
  }

  function awards() {
    var A = D.awards; A._id = 'awards';
    return '<section class="sec awards" id="awards" aria-labelledby="awards-t"><div class="wrap aw-grid">' + head(A) +
      '<ol class="timeline">' + A.items.map(function (it, i) {
        var medals = '<span class="medals" aria-hidden="true">'; for (var k = 0; k < it.count; k++) medals += '<i class="m3d m-' + it.medal + '"><i class="m-rib"></i><i class="m-disc"><i class="m-face"><b>' + String(it.year).slice(2) + '</b></i></i></i>'; medals += '</span>';
        var place = [L(it.city), L(it.cat)].filter(Boolean).join(' · ');
        return '<li class="tl rv" style="--d:' + i + '"><span class="tl-year">' + it.year + '</span>' +
          medals + '<div class="tl-body"><p class="tl-medal"><b>' + esc(L(it.name)) + '</b></p>' +
          '<p class="tl-event">' + esc(L(it.event)) + '</p>' + (place ? '<p class="tl-place">' + esc(place) + '</p>' : '') +
          (it.image ? '<button type="button" class="link-btn lb-open" data-lb="dip" data-i="' + i + '">' + esc(L(A.diploma)) + '<span aria-hidden="true"> ↗</span></button>' : '') +
          '</div></li>';
      }).join('') + '</ol></div></section>';
  }

  function academy() {
    var A = D.academy; A._id = 'academy';
    return '<section class="sec academy" id="academy" aria-labelledby="academy-t"><div class="wrap ac-grid">' +
      '<div class="ac-art"><figure class="ph ac-a ri">' + img(A.images[0].id, L(A.images[0].alt), '(max-width: 900px) 70vw, 30vw') + '</figure>' +
      '<figure class="ph ac-b ri">' + img(A.images[1].id, L(A.images[1].alt), '(max-width: 900px) 40vw, 14vw') + '</figure></div>' +
      '<div class="ac-text">' + head(A) + L(A.text).map(function (p) { return '<p class="body rv">' + esc(p) + '</p>'; }).join('') +
      '<p class="ac-event rv">' + esc(L(A.event)) + '</p>' +
      '<ul class="ac-list rv">' + A.facts.map(function (f) { return '<li>' + esc(L(f)) + '</li>'; }).join('') + '</ul></div></div>' +
      '<div class="wrap ac-more">' + (A.upcoming ? upcoming(A.upcoming, A) : '<p class="ac-next rv">' + esc(L(A.next)) + '</p>') +
      (A.numbers ? '<ul class="ac-nums">' + A.numbers.map(function (x, i) { return '<li class="rv" style="--d:' + i + '"><b>' + esc(x.n) + '</b><span>' + esc(L(x.label)) + '</span></li>'; }).join('') + '</ul>' : '') +
      (A.cert ? cert(A.cert) : '') + '</div></section>';
  }
  function upcoming(U, A) {
    var u = L(U.units);
    return '<div class="ac-up rv" data-date="' + esc(U.date) + '"><p class="label">' + esc(L(U.label)) + (D.demo ? ' <small class="demo-tag">' + esc(L(D.ui.demoTag)) + '</small>' : '') + '</p>' +
      '<p class="ac-up-t">' + esc(L(U.title)) + '</p><p class="ac-up-p">' + esc(L(U.place)) + ' · ' + esc(L(U.seats)) + '</p>' +
      '<div class="cd" role="timer" aria-live="off">' + u.map(function (x, i) { return '<p><b data-cd="' + i + '">00</b><span>' + esc(x) + '</span></p>'; }).join('') + '</div>' +
      '<p class="cd-done" hidden>' + esc(L(U.started)) + '</p>' +
      '<div class="ac-sign"><a class="send" href="#" data-acad="viber">Viber</a><a class="send" href="#" data-acad="wa" target="_blank" rel="noopener">WhatsApp</a></div>' +
      '<div class="ac-links"><button type="button" class="ac-ask" data-wait aria-expanded="false" aria-controls="ac-wait">' + esc(L(U.wait)) + ' <span aria-hidden="true">+</span></button>' +
      '<a class="ac-ask" href="#contact" data-topic="academy">' + esc(L(A.cta)) + ' <span aria-hidden="true">→</span></a></div>' +
      '<div class="ac-wait" id="ac-wait" hidden><label class="field"><span class="label">' + esc(L(U.waitName)) + '</span><input id="w-name" type="text" autocomplete="name"></label>' +
      '<label class="field"><span class="label">' + esc(L(U.waitPhone)) + '</span><input id="w-phone" type="tel" autocomplete="tel" inputmode="tel"></label>' +
      '<p class="ct-need" id="w-need" aria-live="polite"></p>' +
      '<div class="ac-sign"><a class="send" href="#" data-waitvia="viber">Viber</a><a class="send" href="#" data-waitvia="wa" target="_blank" rel="noopener">WhatsApp</a></div></div></div>';
  }
  function cert(C) {
    return '<figure class="cert rv" aria-label="' + esc(L(C.title)) + '"><div class="cert-in"><p class="cert-k">' + esc(L(C.kicker)) + '</p>' +
      '<p class="cert-t">' + esc(L(C.title)) + '</p><p class="cert-l">' + esc(L(C.line)) + '</p>' +
      '<p class="cert-who"><span></span><small>' + esc(L(C.who)) + '</small></p>' +
      '<div class="cert-foot"><p class="cert-by">' + (ART.sign ? ART.sign('Nemanja').replace(/sg-/g, 'sc-') : '') + '<small>' + esc(L(C.by)) + ' · Nemanja Petrović</small></p>' +
      '<i class="cert-seal" aria-hidden="true"><b>NP</b></i></div></div></figure>';
  }

  function show() {
    var S = D.show; S._id = 'show';
    return '<section class="show" id="show" aria-labelledby="show-t"><div class="wrap show-in rv">' +
      '<p class="chapter"><i aria-hidden="true"></i>' + esc(L(S.chapter)) + '</p>' +
      '<h2 class="show-title split" id="show-t">' + words(L(S.title)) + '</h2>' +
      '<p class="show-meta">' + esc(L(S.meta)) + '</p><p class="show-text">' + esc(L(S.text)) + '</p>' +
      '</div>' + (S.episodes ? '<div class="eps-wrap"><ul class="eps">' + S.episodes.map(function (e, i) {
        return '<li class="ep rv" style="--d:' + i + '"><button type="button" class="ep-btn" data-ep="' + i + '" aria-label="' + esc(L(D.ui.play) + ': ' + L(e.title)) + '">' +
          '<span class="ep-img">' + img(e.img, '', '(max-width: 640px) 72vw, (max-width: 1100px) 40vw, 26vw') + '<i class="ep-play" aria-hidden="true"></i></span>' +
          '<span class="ep-n">' + esc(L(S.epLabel)) + ' ' + String(e.n).padStart(2, '0') + '</span><span class="ep-t">' + esc(L(e.title)) + '</span></button></li>';
      }).join('') + '</ul></div>' : '') +
      '<p class="show-cta"><a class="btn btn-line" href="' + esc(D.youtube) + '" target="_blank" rel="noopener">' + esc(L(S.cta)) + '<span aria-hidden="true">↗</span></a></p>' +
      '</section>';
  }

  function beyond() {
    var B = D.beyond; B._id = 'beyond';
    return '<section class="sec beyond" id="beyond" aria-labelledby="beyond-t"><div class="wrap">' + head(B) +
      '<div class="by-grid">' + B.cols.map(function (c, i) {
        return '<article class="by rv" style="--d:' + i + '"><p class="by-year">' + esc(c.year) + '</p><h3>' + esc(L(c.title)) + '</h3><p>' + esc(L(c.text)) + '</p></article>';
      }).join('') +
      '<article class="by rv" style="--d:2"><p class="by-year">' + esc(L(B.press.title)) + '</p><ul class="press">' + B.press.items.map(function (p) {
        return '<li><a href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.name) + '<span aria-hidden="true">↗</span></a></li>';
      }).join('') + '</ul>' + (B.press.kitFile ? '<a class="kit" href="' + esc(B.press.kitFile) + '" download><span>' + esc(L(B.press.kit)) + (B.press.kitSize ? '<small>' + esc(B.press.kitSize) + '</small>' : '') + '</span><b aria-hidden="true">↓</b></a>' : '') + '</article></div></div>' +
      '<div class="marquee" aria-hidden="true"><div class="mq-track">' + [0, 1].map(function () { return '<p>' + B.press.items.map(function (p) { return '<span>' + esc(p.name) + '</span><i></i>'; }).join('') + '<span>@' + esc(D.contact.instagram) + '</span><i></i></p>'; }).join('') + '</div></div></section>';
  }

  var form = { topic: 'wedding', name: '', date: '', msg: '' };
  /* male ikonice (linije) za dugmad i kontakte */
  var ICO = {
    viber: '<path d="M7 4h10a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-6l-4 3v-3a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z"/><path d="M9.5 8.5c.5 2.5 2.5 4.5 5 5"/>',
    wa: '<path d="M4 20l1.3-3.6A8 8 0 1 1 8 19.3z"/><path d="M9.2 9c.3 2 1.8 3.6 3.8 4"/>',
    mail: '<rect x="3" y="5.5" width="18" height="13" rx="1.5"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/>',
    ig: '<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17" cy="7" r=".6"/>',
    tel: '<path d="M6.5 3.5h3l1.5 4-2 1.5a10 10 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/>',
    pin: '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>'
  };
  function ico(k) { return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">' + ICO[k] + '</svg>'; }
  function contact() {
    var C = D.contactSec, K = D.contact; C._id = 'contact';
    var tag = D.demo ? '<small class="demo-tag">' + esc(L(D.ui.demoTag)) + '</small>' : '';
    function row(icon, label, value, href, ext) {
      var inner = '<span class="ct-ico">' + ico(icon) + '</span><span class="ct-txt"><small>' + esc(label) + '</small><b>' + value + '</b></span>';
      return '<li>' + (href ? '<a href="' + esc(href) + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + inner + '<i aria-hidden="true">' + (ext ? '↗' : '→') + '</i></a>' : '<span class="ct-row">' + inner + '</span>') + '</li>';
    }
    return '<section class="sec contact" id="contact" aria-labelledby="contact-t"><div class="wrap ct-grid">' +
      '<div class="ct-main">' + head(C) +
      '<form class="ct-form rv" id="ct-form" novalidate>' +
      '<fieldset class="topics"><legend class="label">' + esc(L(C.topicLabel)) + '</legend>' + C.topics.map(function (t) {
        return '<button type="button" class="pill" data-topic-pick="' + t.key + '" aria-pressed="' + (form.topic === t.key) + '">' + esc(L(t.label)) + '</button>';
      }).join('') + '</fieldset>' +
      '<div class="ct-row2"><label class="field"><span class="label">' + esc(L(C.name)) + '</span><input id="ct-name" type="text" autocomplete="name" value="' + esc(form.name) + '"></label>' +
      '<label class="field ct-date"' + (form.topic === 'wedding' ? '' : ' hidden') + '><span class="label">' + esc(L(C.date)) + '</span><input id="ct-date" type="date" value="' + esc(form.date) + '"></label></div>' +
      '<label class="field"><span class="label">' + esc(L(C.message)) + '</span><textarea id="ct-msg" rows="3">' + esc(form.msg) + '</textarea></label>' +
      '<p class="ct-need" id="ct-need" aria-live="polite"></p>' +
      '<div class="ct-send"><span class="label">' + esc(L(C.send)) + '</span>' +
      '<a class="send" id="send-viber" href="#" data-via="viber">' + ico('viber') + '<span>Viber</span></a>' +
      '<a class="send" id="send-wa" href="#" data-via="wa" target="_blank" rel="noopener">' + ico('wa') + '<span>WhatsApp</span></a>' +
      '<a class="send" id="send-mail" href="#" data-via="mail">' + ico('mail') + '<span>Email</span></a></div>' +
      '</form></div>' +
      '<aside class="ct-side rv"><div class="ct-me"><figure class="ct-img">' + img(C.image.id, L(C.image.alt), '(max-width: 900px) 30vw, 26vw') + '</figure>' +
      '<div class="ct-me-t"><p class="ct-note">' + esc(L(C.note)) + '</p><p class="ct-who">Nemanja Petrović · Pastry Chef</p></div></div>' +
      '<ul class="ct-links">' +
      row('ig', 'Instagram', '@' + esc(K.instagram), 'https://www.instagram.com/' + K.instagram + '/', true) +
      row('tel', L(C.phone), (K.phone ? esc(K.phone) : esc(K.phoneLabel) + ' ' + tag), K.phone ? 'tel:' + K.phone.replace(/\s/g, '') : null) +
      row('mail', 'Email', (K.email ? esc(K.email) : esc(K.emailLabel) + ' ' + tag), K.email ? 'mailto:' + K.email : null) +
      row('pin', L(C.where), esc(L(C.whereNote)), 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(K.mapQuery), true) +
      '</ul></aside></div></section>';
  }

  function footer() {
    var F = D.footer;
    document.getElementById('foot').innerHTML =
      '<div class="wrap foot-in"><svg class="mono mono-big" viewBox="0 0 108 80" aria-hidden="true"><text x="2" y="64">N</text><text x="44" y="64">P</text></svg>' +
      '<p class="foot-line">' + esc(L(F.line)) + '</p>' +
      '<p class="foot-links"><a href="https://www.instagram.com/' + esc(D.contact.instagram) + '/" target="_blank" rel="noopener">Instagram</a><a href="stampa.html">' + esc(L(D.ui.qr)) + '</a><a href="#hero">' + esc(L(F.top)) + ' ↑</a></p>' +
      '<p class="foot-copy">' + esc(L(F.copy)) + (D.credit ? ' · <a href="' + esc(D.credit.url) + '">' + esc(D.credit.name) + '</a>' : '') + '</p>' +
      (D.demo ? '<p class="demo-bar">' + esc(L(D.ui.demoBar)) + '</p>' : '') + '</div>';
  }

  /* ---------- meni, jezik ---------- */
  var NAV = ['story', 'works', 'weddings', 'awards', 'academy', 'contact'];
  var NAV_SEC = { works: 'works' };
  function nav() {
    document.getElementById('nav').innerHTML = NAV.map(function (k) {
      return '<a href="#' + k + '">' + esc(L(D.ui.nav[k])) + '</a>';
    }).join('');
    document.getElementById('langs').innerHTML = LANGS.map(function (l) {
      return '<button type="button" data-lang="' + l + '" aria-pressed="' + (l === lang) + '" lang="' + l + '">' + l.toUpperCase() + '</button>';
    }).join('');
    document.getElementById('sheet').innerHTML =
      '<div class="sheet-in"><ol class="sheet-nav">' + NAV.map(function (k, i) {
        return '<li style="--i:' + i + '"><a href="#' + k + '"><small>' + String(i + 1).padStart(2, '0') + '</small>' + esc(L(D.ui.nav[k])) + '</a></li>';
      }).join('') + '</ol>' +
      '<div class="sheet-foot"><a href="https://www.instagram.com/' + esc(D.contact.instagram) + '/" target="_blank" rel="noopener">@' + esc(D.contact.instagram) + '</a>' +
      '<button type="button" class="theme-btn" data-theme-btn aria-pressed="false"><i aria-hidden="true"></i><span></span></button>' +
      '<div class="langs" role="group" aria-label="' + esc(L(D.ui.lang)) + '">' + LANGS.map(function (l) {
        return '<button type="button" data-lang="' + l + '" aria-pressed="' + (l === lang) + '" lang="' + l + '">' + l.toUpperCase() + '</button>';
      }).join('') + '</div></div></div>';
    document.getElementById('langs').setAttribute('aria-label', L(D.ui.lang));
  }

  /* statični tekstovi u index.html (data-t="hero.tagline") */
  function staticTexts() {
    [].forEach.call(document.querySelectorAll('[data-t]'), function (el) { var v = get(el.getAttribute('data-t')); if (v) el.textContent = L(v); });
    [].forEach.call(document.querySelectorAll('[data-t-alt]'), function (el) { var v = get(el.getAttribute('data-t-alt')); if (v) el.alt = L(v); });
    document.title = L(D.seo.title);
    var md = document.querySelector('meta[name="description"]'); if (md) md.content = L(D.seo.desc);
    root.lang = lang;
  }

  function render() {
    staticTexts();
    nav();
    document.getElementById('main').innerHTML = stats() + story() + works() + notes() + anatomy() + tiers() + weddings() + reviews() + fondant() + awards() + academy() + consult() + show() + beyond() + faq() + contact();
    footer();
    bindForm();
    applyFilter(curFilter);
    themeSet(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
    rwI = 0; rwAuto();
    document.dispatchEvent(new CustomEvent('np:render'));
  }

  function setLang(l) {
    if (l === lang || LANGS.indexOf(l) === -1) return;
    var y = window.scrollY;
    lang = l; save('np-lang', l);
    render();
    window.scrollTo(0, y);
  }

  /* ---------- mobilni meni ---------- */
  var sheet = document.getElementById('sheet'), menuBtn = document.getElementById('menu-btn'), sheetOpen = false;
  function openSheet() {
    sheetOpen = true; sheet.hidden = false;
    requestAnimationFrame(function () { sheet.classList.add('open'); });
    menuBtn.setAttribute('aria-expanded', 'true'); menuBtn.querySelector('.mb-t').textContent = L(D.ui.close);
    root.classList.add('locked');
    var f = sheet.querySelector('a'); if (f) f.focus({ preventScroll: true });
  }
  function closeSheet(noFocus) {
    if (!sheetOpen) return;
    sheetOpen = false; sheet.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.querySelector('.mb-t').textContent = L(D.ui.menu);
    root.classList.remove('locked');
    setTimeout(function () { if (!sheetOpen) sheet.hidden = true; }, 450);
    if (!noFocus) menuBtn.focus({ preventScroll: true });
  }

  /* ---------- lightbox ---------- */
  var lb = null, lbSet = [], lbI = 0, lbLast = null;
  function lbSets(kind) {
    if (kind === 'wed') return D.weddings.gallery.map(function (g) { return { id: g.id, alt: L(g.alt), cap: L(g.cap) }; });
    if (kind === 'fon') return D.fondant.items.filter(function (it) { return visibleFon(it); }).map(function (it) { return { id: it.id, alt: L(D.fondant.alt) + L(it.cap), cap: L(it.cap), src: it }; });
    if (kind === 'dip') return D.awards.items.filter(function (a) { return a.image; }).map(function (a) { return { id: a.image.id, alt: L(a.image.alt), cap: a.year + ' · ' + L(a.name) + ' · ' + L(a.event), src: a, share: false }; });
    return [];
  }
  function lbOpen(kind, i, trigger) {
    lbSet = lbSets(kind);
    if (kind === 'fon') { var it = D.fondant.items[i]; i = lbSet.findIndex(function (s) { return s.src === it; }); }
    if (kind === 'dip') { var aw = D.awards.items[i]; i = lbSet.findIndex(function (s) { return s.src === aw; }); }
    lbI = Math.max(0, i); lbLast = trigger;
    if (!lb) {
      lb = document.createElement('div'); lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
      document.body.appendChild(lb);
      lb.addEventListener('click', function (e) {
        if (e.target.closest('.lb-x')) return lbClose();
        if (e.target.closest('.lb-share')) return share(lbSet[lbI]);
        if (e.target.closest('.lb-prev')) return lbGo(-1);
        if (e.target.closest('.lb-next')) return lbGo(1);
        if (e.target === lb || e.target.classList.contains('lb-stage')) lbClose();
      });
      var sx = 0;
      lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
      lb.addEventListener('touchend', function (e) { var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) lbGo(dx < 0 ? 1 : -1); });
    }
    lb.setAttribute('aria-label', lbSet[lbI] ? lbSet[lbI].cap : '');
    lb.classList.toggle('lb-paper', kind === 'dip');
    lbDraw();
    lb.hidden = false; requestAnimationFrame(function () { lb.classList.add('open'); });
    root.classList.add('locked');
    lb.querySelector('.lb-x').focus({ preventScroll: true });
  }
  function lbDraw() {
    var s = lbSet[lbI]; if (!s) return;
    var many = lbSet.length > 1;
    lb.innerHTML = '<div class="lb-stage">' + img(s.id, s.alt, '92vw', 'lb-img', true) + '</div>' +
      '<p class="lb-cap"><span>' + esc(s.cap) + '</span>' + (many ? '<small>' + String(lbI + 1).padStart(2, '0') + ' / ' + String(lbSet.length).padStart(2, '0') + '</small>' : '') + '</p>' +
      (many ? '<button class="lb-prev" type="button" aria-label="' + esc(L(D.ui.prev)) + '">←</button><button class="lb-next" type="button" aria-label="' + esc(L(D.ui.next)) + '">→</button>' : '') +
      '<button class="lb-x" type="button" aria-label="' + esc(L(D.ui.close)) + '">' + esc(L(D.ui.close)) + '</button>' +
      (s.share !== false ? '<button class="lb-share" type="button">' + esc(L(D.ui.share)) + ' <span aria-hidden="true">↗</span></button>' : '');
  }
  function lbGo(d) { if (lbSet.length < 2) return; lbI = (lbI + d + lbSet.length) % lbSet.length; lbDraw(); var b = lb.querySelector(d > 0 ? '.lb-next' : '.lb-prev'); if (b) b.focus({ preventScroll: true }); }
  function lbClose() {
    if (!lb || lb.hidden) return;
    lb.classList.remove('open'); root.classList.remove('locked');
    setTimeout(function () { lb.hidden = true; lb.innerHTML = ''; }, 300);
    if (lbLast) lbLast.focus({ preventScroll: true });
  }

  /* ---------- filter fondana ---------- */
  var curFilter = 'all';
  function visibleFon(it) { return curFilter === 'all' || it.tags.indexOf(curFilter) !== -1; }
  function applyFilter(f) {
    curFilter = f;
    var grid = document.querySelector('.masonry'); if (!grid) return;
    [].forEach.call(document.querySelectorAll('.filters .pill'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-f') === f)); });
    var items = [].slice.call(grid.children);
    items.forEach(function (li, i) {
      var show = visibleFon(D.fondant.items[i]);
      if (show && li.hidden) { li.hidden = false; li.classList.add('mz-in'); requestAnimationFrame(function () { requestAnimationFrame(function () { li.classList.remove('mz-in'); }); }); }
      else if (!show) li.hidden = true;
    });
  }

  /* ---------- kontakt forma ---------- */
  function topicLabel() { var t = D.contactSec.topics.filter(function (x) { return x.key === form.topic; })[0]; return t ? L(t.label) : ''; }
  function missing() { var m = []; if (!form.name.trim()) m.push(L(D.contactSec.needName)); if (!form.msg.trim()) m.push(L(D.contactSec.needMsg)); return m; }
  function message() {
    var M = D.contactSec.msg, t = topicLabel(), lines = [L(M.hello).replace('{t}', t)];
    if (form.topic === 'wedding' && form.date) lines.push(L(M.date).replace('{d}', fmtDate(form.date)));
    lines.push(L(M.name).replace('{n}', form.name.trim()));
    lines.push('', form.msg.trim());
    return lines.join('\n');
  }
  function updateForm() {
    var m = missing(), need = document.getElementById('ct-need'); if (!need) return;
    need.textContent = m.length ? m.join(' · ') : L(D.contactSec.ready);
    need.classList.toggle('ok', !m.length);
    [].forEach.call(document.querySelectorAll('#ct-form .send'), function (a) { a.setAttribute('aria-disabled', String(!!m.length)); a.classList.toggle('locked', !!m.length); });
  }
  function bindForm() {
    var n = document.getElementById('ct-name'), d = document.getElementById('ct-date'), t = document.getElementById('ct-msg');
    if (!n) return;
    n.addEventListener('input', function () { form.name = n.value; updateForm(); });
    d.addEventListener('input', function () { form.date = d.value; });
    t.addEventListener('input', function () { form.msg = t.value; updateForm(); });
    updateForm();
  }
  function pickTopic(k) {
    form.topic = k;
    [].forEach.call(document.querySelectorAll('[data-topic-pick]'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-topic-pick') === k)); });
    var dl = document.querySelector('.ct-date'); if (dl) dl.hidden = k !== 'wedding';
  }
  function send(via, a, e) {
    if (missing().length) { e.preventDefault(); updateForm(); var f = !form.name.trim() ? 'ct-name' : 'ct-msg'; document.getElementById(f).focus(); return; }
    var K = D.contact, txt = message();
    if (via === 'viber') a.href = K.viber ? 'viber://chat?number=' + encodeURIComponent(K.viber) + '&draft=' + encodeURIComponent(txt) : 'viber://forward?text=' + encodeURIComponent(txt);
    else if (via === 'wa') a.href = 'https://wa.me/' + (K.whatsapp || '') + '?text=' + encodeURIComponent(txt);
    else a.href = 'mailto:' + (K.email || '') + '?subject=' + encodeURIComponent(L(D.contactSec.msg.subject).replace('{t}', topicLabel())) + '&body=' + encodeURIComponent(txt);
  }

  /* sekcije van ekrana imaju procijenjenu visinu (content-visibility), pa se cilj
     može pomjeriti dok traje glatko listanje; na kraju se poravna ako treba */
  function goTo(target) {
    var smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches, n = 0;
    target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    if (!smooth) { requestAnimationFrame(function () { target.scrollIntoView({ block: 'start' }); }); return; }
    var last = -1, t0 = Date.now();
    (function check() {
      if (Date.now() - t0 > 3000) return;
      if (scrollY !== last) { last = scrollY; return setTimeout(check, 120); }
      if (Math.abs(target.getBoundingClientRect().top - (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0)) > 2 && n++ < 3) { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); last = -1; }
      else return;
      setTimeout(check, 120);
    })();
  }

  /* datum ručno: nije svaki preglednik spreman za bosanski format */
  var MONTHS = {
    bs: ['januara', 'februara', 'marta', 'aprila', 'maja', 'juna', 'jula', 'augusta', 'septembra', 'oktobra', 'novembra', 'decembra'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
  };
  function fmtDate(v) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v); if (!m) return v;
    var d = +m[3], mo = MONTHS[lang][+m[2] - 1];
    return lang === 'en' ? d + ' ' + mo + ' ' + m[1] : d + '. ' + mo + ' ' + m[1];
  }

  /* ---------- dijeljenje fotografije: posebna stranica sa slikom za društvene mreže ---------- */
  function share(item) {
    if (!item) return;
    var url = new URL('t/' + item.id + '.html', location.href).href, title = item.cap + ' · Nemanja Petrović';
    if (navigator.share) { navigator.share({ title: title, url: url }).catch(function () {}); return; }
    var done = function () { toast(L(D.ui.copied)); };
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () { prompt('', url); }); else prompt('', url);
  }
  var toastT = 0;
  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) { t = document.createElement('p'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('on'); }, 2200);
  }
  /* ?foto=id otvara tu fotografiju (link sa stranice za dijeljenje) */
  function openFromUrl() {
    var id = null; try { id = new URLSearchParams(location.search).get('foto'); } catch (e) {}
    if (!id) return;
    var w = D.weddings.gallery.findIndex(function (g) { return g.id === id; });
    if (w >= 0) { lbOpen('wed', w, document.querySelectorAll('#weddings .lb-open')[w]); return; }
    var f = D.fondant.items.findIndex(function (g) { return g.id === id; });
    if (f >= 0) lbOpen('fon', f, document.querySelectorAll('.masonry .lb-open')[f]);
  }

  /* ---------- tema: tamna (zadano) ili svijetla ---------- */
  function themeSet(t) {
    root.setAttribute('data-theme', t); save('np-theme', t);
    var m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = t === 'light' ? '#F6F0E6' : '#0E0C0A';
    [].forEach.call(document.querySelectorAll('[data-theme-btn]'), function (b) { b.setAttribute('aria-pressed', String(t === 'light')); b.setAttribute('aria-label', L(t === 'light' ? D.ui.themeDark : D.ui.themeLight)); var sp = b.querySelector('span'); if (sp) sp.textContent = L(t === 'light' ? D.ui.themeDark : D.ui.themeLight); });
    document.dispatchEvent(new CustomEvent('np:theme'));
  }

  /* ---------- utisci: klizač ---------- */
  var rwI = 0, rwT = 0;
  function rwGo(d, user) {
    var items = document.querySelectorAll('.rw-item'), dots = document.querySelectorAll('.rw-dots i'); if (!items.length) return;
    rwI = (rwI + d + items.length) % items.length;
    [].forEach.call(items, function (x, i) { x.classList.toggle('on', i === rwI); x.setAttribute('aria-hidden', String(i !== rwI)); });
    [].forEach.call(dots, function (x, i) { x.classList.toggle('on', i === rwI); });
    if (user) rwAuto(false);
  }
  function rwAuto(on) { clearInterval(rwT); if (on !== false && !matchMedia('(prefers-reduced-motion: reduce)').matches) rwT = setInterval(function () { if (!document.hidden) rwGo(1); }, 7000); }

  /* ---------- lista čekanja za akademiju ---------- */
  function waitSend(via, a, e) {
    var U = D.academy.upcoming, K = D.contact, n = (document.getElementById('w-name').value || '').trim(), ph = (document.getElementById('w-phone').value || '').trim();
    if (!n || !ph) { e.preventDefault(); document.getElementById('w-need').textContent = L(U.waitNeed); document.getElementById(!n ? 'w-name' : 'w-phone').focus(); return; }
    var txt = L(U.waitMsg).replace('{n}', n).replace('{p}', ph);
    if (via === 'viber') a.href = K.viber ? 'viber://chat?number=' + encodeURIComponent(K.viber) + '&draft=' + encodeURIComponent(txt) : 'viber://forward?text=' + encodeURIComponent(txt);
    else a.href = 'https://wa.me/' + (K.whatsapp || '') + '?text=' + encodeURIComponent(txt);
  }

  /* ---------- akademija: prijava preko Vibera ili WhatsAppa ---------- */
  function acadSend(via, a) {
    var U = D.academy.upcoming, K = D.contact;
    var txt = L(U.msg).replace('{t}', L(U.title)).replace('{p}', L(U.place));
    if (via === 'viber') a.href = K.viber ? 'viber://chat?number=' + encodeURIComponent(K.viber) + '&draft=' + encodeURIComponent(txt) : 'viber://forward?text=' + encodeURIComponent(txt);
    else a.href = 'https://wa.me/' + (K.whatsapp || '') + '?text=' + encodeURIComponent(txt);
  }

  /* ---------- svadbe: dugmad lijevo/desno ---------- */
  function wdGo(d) { document.dispatchEvent(new CustomEvent('np:wd', { detail: d })); }

  /* ---------- epizode: video na stranici (youtube-nocookie) ili YouTube ---------- */
  function playEp(i, btn) {
    var e = D.show.episodes[i];
    if (!e.video) { window.open(D.youtube, '_blank', 'noopener'); return; }
    var box = document.createElement('div'); box.className = 'ep-btn ep-on';
    box.innerHTML = '<span class="ep-img"><iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(e.video) + '?autoplay=1&rel=0" title="' + esc(L(e.title)) + '" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></span>' +
      '<span class="ep-n">' + esc(L(D.show.epLabel)) + ' ' + String(e.n).padStart(2, '0') + '</span><span class="ep-t">' + esc(L(e.title)) + '</span>';
    btn.replaceWith(box);
  }

  /* ---------- događaji ---------- */
  document.addEventListener('click', function (e) {
    var l = e.target.closest('[data-lang]'); if (l) { setLang(l.getAttribute('data-lang')); return; }
    if (e.target.closest('#menu-btn')) { sheetOpen ? closeSheet() : openSheet(); return; }
    var o = e.target.closest('.lb-open'); if (o) { lbOpen(o.getAttribute('data-lb'), +o.getAttribute('data-i'), o); return; }
    var f = e.target.closest('.filters .pill'); if (f) { applyFilter(f.getAttribute('data-f')); return; }
    var tp = e.target.closest('[data-topic-pick]'); if (tp) { pickTopic(tp.getAttribute('data-topic-pick')); return; }
    var th = e.target.closest('[data-theme-btn]'); if (th) { themeSet(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light'); return; }
    var rw = e.target.closest('[data-rw]'); if (rw) { rwGo(+rw.getAttribute('data-rw'), true); return; }
    var wt = e.target.closest('[data-wait]'); if (wt) { var box = document.getElementById('ac-wait'), o = box.hidden; box.hidden = !o; wt.setAttribute('aria-expanded', String(o)); if (o) document.getElementById('w-name').focus(); return; }
    var wv = e.target.closest('[data-waitvia]'); if (wv) { waitSend(wv.getAttribute('data-waitvia'), wv, e); return; }
    var anb = e.target.closest('[data-an]'); if (anb) { anOpen = !anOpen; var sec = document.getElementById('anatomy'); sec.classList.toggle('open', anOpen); [].forEach.call(sec.querySelectorAll('.an-btn'), function (x) { x.setAttribute('aria-pressed', String(anOpen)); }); return; }
    var ac = e.target.closest('[data-acad]'); if (ac) { acadSend(ac.getAttribute('data-acad'), ac); return; }
    var s = e.target.closest('.send'); if (s) { send(s.getAttribute('data-via'), s, e); return; }
    var wb = e.target.closest('[data-wd]'); if (wb) { wdGo(+wb.getAttribute('data-wd')); return; }
    var ep = e.target.closest('[data-ep]'); if (ep) { playEp(+ep.getAttribute('data-ep'), ep); return; }
    var a = e.target.closest('a[href^="#"]');
    if (a) {
      var id = a.getAttribute('href').slice(1), target = id && document.getElementById(id);
      if (a.hasAttribute('data-topic')) pickTopic(a.getAttribute('data-topic'));
      if (target) {
        e.preventDefault();
        closeSheet(true);
        goTo(target);
        if (id !== 'hero') history.replaceState(null, '', '#' + id);
        setTimeout(function () { var fcs = id === 'contact' ? document.getElementById('ct-name') : target; if (fcs) { if (fcs === target) target.setAttribute('tabindex', '-1'); fcs.focus({ preventScroll: true }); } }, 600);
      }
    }
  });
  document.addEventListener('keydown', function (e) {
    if (lb && !lb.hidden) {
      if (e.key === 'Escape') lbClose();
      else if (e.key === 'ArrowRight') lbGo(1);
      else if (e.key === 'ArrowLeft') lbGo(-1);
      else if (e.key === 'Tab') { /* fokus ostaje u lightboxu */
        var f = [].slice.call(lb.querySelectorAll('button')); var i = f.indexOf(document.activeElement);
        e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
      return;
    }
    if (sheetOpen && e.key === 'Escape') closeSheet();
  });

  render();
  openFromUrl();
  window.NPApp = { L: L, lang: function () { return lang; } };
})();
