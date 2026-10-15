/*
 * Recepti iz data/recepti.js: recepti.html je lista kartica (po 6 na stranici), a svaki recept ili tekst
 * ima svoju stranicu (recept-<id>.html, tekst-<id>.html; prave se alatom tools/stranice.py).
 * Sastojci i koraci se mogu označiti (pamti se u pregledniku), recept se može štampati i podijeliti.
 * Zaglavlje, meni, temu i podnožje crta js/app.js (data-page="recepti"), otkrivanje i traku napretka js/fx.js.
 */
(function () {
  'use strict';
  var R = window.NP_REC, P = R.page, ART = window.NP_ART, root = document.documentElement;

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function rich(s) { return esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>'); }
  function load(k) { try { return JSON.parse(localStorage.getItem(k)) || null; } catch (e) { return null; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MODE = document.body.getAttribute('data-page'), ONE = document.body.getAttribute('data-id');
  var PER = 6;

  /* svi unosi na listi: recepti pa tekstovi, svaki sa svojom stranicom */
  var ENTRIES = R.recipes.map(function (r) { return { id: r.id, file: 'recept-' + r.id + '.html', kind: 'r', r: r }; })
    .concat([{ id: R.article.id, file: 'tekst-' + R.article.id + '.html', kind: 'a' }]);

  function count(r) { return r.groups.reduce(function (n, g) { return n + g.items.length; }, 0); }

  /* ---------- lista: kartice i stranice ---------- */
  function card(en, i) {
    if (en.kind === 'r') {
      var r = en.r, c = ART.cake(r.layers, 'c' + i);
      return '<li class="rc-card"><a href="' + en.file + '">' +
        '<span class="rc-card-art">' + c.svg + '</span>' +
        '<span class="rc-card-txt"><small>' + esc(P.recipe) + ' · ' + esc(r.date) + '</small><b class="script">' + esc(r.script) + '</b>' +
        '<span class="rc-card-meta">' + count(r) + ' ' + esc(P.ingCount) + ' · ' + r.steps.length + ' ' + esc(P.stepsShort) + '</span>' +
        '<span class="rc-more">' + esc(P.read) + ' <i aria-hidden="true">→</i></span></span></a></li>';
    }
    var A = R.article;
    return '<li class="rc-card rc-card-art2"><a href="' + en.file + '">' +
      '<span class="rc-card-top"><span class="rc-card-dots" aria-hidden="true"><i></i><i></i><i></i></span>' +
      '<span class="rc-card-pts">' + A.points.map(function (p, k) { return '<span><b>0' + (k + 1) + '</b>' + esc(p.title) + '</span>'; }).join('') + '</span></span>' +
      '<span class="rc-card-txt"><small>' + esc(A.label) + ' · ' + esc(A.date) + '</small><b class="rc-card-q">' + rich(A.title) + '</b>' +
      '<span class="rc-more">' + esc(P.readArticle) + ' <i aria-hidden="true">→</i></span></span></a></li>';
  }
  function pages() { return Math.max(1, Math.ceil(ENTRIES.length / PER)); }
  function curPage() { var n = 1; try { n = parseInt(new URLSearchParams(location.search).get('str'), 10) || 1; } catch (e) {} return Math.min(pages(), Math.max(1, n)); }
  function grid(pg) {
    var from = (pg - 1) * PER, list = ENTRIES.slice(from, from + PER), n = pages();
    var pager = n > 1 ? '<nav class="rc-pager" aria-label="' + esc(P.pages) + '">' +
      '<button type="button" class="rc-pg rc-pg-arrow" data-pg="' + (pg - 1) + '"' + (pg === 1 ? ' disabled' : '') + ' aria-label="' + esc(P.prevPage) + '">←</button>' +
      Array.apply(null, Array(n)).map(function (x, k) { return '<button type="button" class="rc-pg" data-pg="' + (k + 1) + '"' + (k + 1 === pg ? ' aria-current="page"' : '') + ' aria-label="' + esc(P.page) + ' ' + (k + 1) + '">' + (k + 1) + '</button>'; }).join('') +
      '<button type="button" class="rc-pg rc-pg-arrow" data-pg="' + (pg + 1) + '"' + (pg === n ? ' disabled' : '') + ' aria-label="' + esc(P.nextPage) + '">→</button></nav>' : '';
    return '<p class="rc-count" aria-live="polite">' + esc(P.shown) + ' ' + (from + 1) + '–' + (from + list.length) + ' ' + esc(P.of) + ' ' + ENTRIES.length + '</p>' +
      '<ul class="rc-cards">' + list.map(function (en, k) { return card(en, from + k); }).join('') + '</ul>' + pager;
  }
  function listPage() {
    return '<section class="rc-hero" aria-labelledby="rc-h1"><div class="wrap">' +
      '<p class="chapter rv"><i aria-hidden="true"></i>' + esc(P.label) + '</p>' +
      '<div class="rc-hero-grid"><div><p class="rc-hero-script script rv" aria-hidden="true">Recepti</p>' +
      '<h1 class="h2 rc-h1 rv" id="rc-h1">' + rich(P.title) + '</h1></div>' +
      '<p class="lead rc-lead rv">' + esc(P.lead) + '</p></div>' +
      '<div class="rc-listing rv" id="rc-list">' + grid(curPage()) + '</div></div></section>';
  }
  function goPage(n) {
    n = Math.min(pages(), Math.max(1, n));
    var box = document.getElementById('rc-list'); box.innerHTML = grid(n);
    try { history.replaceState(null, '', n > 1 ? '?str=' + n : location.pathname); } catch (e) {}
    box.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
  }

  /* ---------- jedan recept: povratak na listu i prethodni / sljedeći ---------- */
  function backLink() { return '<p class="rc-back rv"><a href="recepti.html"><i aria-hidden="true">←</i> ' + esc(P.back) + '</a></p>'; }
  function neighbours(id) {
    var i = ENTRIES.map(function (x) { return x.id; }).indexOf(id);
    var prev = ENTRIES[i - 1], next = ENTRIES[i + 1];
    function title(en) { return en.kind === 'r' ? esc(en.r.script) : rich(R.article.title); }
    function box(en, cls, lab) {
      return en ? '<a class="rc-nb ' + cls + '" href="' + en.file + '"><small>' + lab + '</small><b class="' + (en.kind === 'r' ? 'script' : 'rc-nb-q') + '">' + title(en) + '</b></a>' : '<span class="rc-nb ' + cls + ' rc-nb-empty"></span>';
    }
    return '<nav class="rc-nbs" aria-label="' + esc(P.more2) + '"><div class="wrap rc-nbs-in">' +
      box(prev, 'rc-nb-prev', '← ' + esc(P.prev)) +
      '<a class="rc-nb-all" href="recepti.html">' + esc(P.back) + '</a>' +
      box(next, 'rc-nb-next', esc(P.next) + ' →') + '</div></nav>';
  }

  /* ---------- jedan recept ---------- */
  function recipe(r, n) {
    var c = ART.cake(r.layers, 'r' + n);
    var ill = '<figure class="rc-ill rv"><div class="rc-ill-in">' + c.svg +
      '<ul class="rc-marks">' + c.marks.map(function (m, i) { return '<li style="top:' + m.at + '%;--n:' + i + '"><i aria-hidden="true"></i><span>' + esc(m.name) + '</span></li>'; }).join('') + '</ul></div>' +
      '<figcaption class="sr-only">' + c.marks.map(function (m) { return esc(m.name); }).join(', ') + '</figcaption></figure>';
    var groups = r.groups.map(function (g, gi) {
      return '<div class="rc-group"><h4>' + esc(g.name) + '</h4><ul>' + g.items.map(function (it, ii) {
        var id = r.id + '-i' + gi + '-' + ii;
        return '<li><input type="checkbox" id="' + id + '" data-ing="' + gi + '-' + ii + '"><label for="' + id + '">' +
          (it[0] ? '<b>' + esc(it[0]) + '</b>' : '<b class="rc-dash" aria-hidden="true">·</b>') + '<span>' + esc(it[1]) + '</span></label></li>';
      }).join('') + '</ul></div>';
    }).join('');
    var steps = r.steps.map(function (s, i) {
      return '<li><button type="button" class="rc-step" data-step="' + i + '" aria-pressed="false"><b>' + (i + 1) + '</b><span>' + esc(s) + '</span></button></li>';
    }).join('');
    var tips = (r.tips || []).map(function (t) {
      return '<aside class="rc-tip rv"><span class="rc-dots" aria-hidden="true"><i></i><i></i><i></i></span><h3 class="script">' + esc(t.script) + '</h3><p>' + esc(t.text) + '</p></aside>';
    }).join('');
    var fact = r.fact ? '<aside class="rc-fact rv"><h3 class="script">' + esc(r.fact.script) + '</h3><p>' + esc(r.fact.text) + '</p></aside>' : '';
    return '<article class="rc" id="' + r.id + '" data-rc="' + r.id + '" aria-labelledby="' + r.id + '-t">' +
      '<div class="wrap">' + backLink() +
      '<header class="rc-head">' +
        '<div class="rc-head-txt">' +
          '<p class="chapter rv"><i aria-hidden="true"></i>' + esc(P.recipe) + ' · Instagram, ' + esc(r.date) + '</p>' +
          '<h1 class="rc-title script rv" id="' + r.id + '-t">' + esc(r.script) + '</h1>' +
          '<p class="rc-intro rv">' + esc(r.intro) + '</p>' +
          '<ul class="rc-chips rv">' + r.chips.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
          fact +
        '</div>' + ill +
      '</header>' +
      '<div class="rc-body">' +
        '<div class="rc-ing rv"><div class="rc-paper">' +
          '<h3 class="script">' + esc(P.ingredients) + '</h3>' + groups + '</div></div>' +
        '<div class="rc-steps">' +
          '<div class="rc-steps-head rv"><h3 class="script">' + esc(P.steps) + '</h3>' +
          '<p class="rc-prog"><span class="rc-prog-t" aria-live="polite"></span><i aria-hidden="true"><i></i></i></p></div>' +
          '<ol class="rc-list">' + steps + '</ol>' + tips +
          '<div class="rc-actions">' +
            '<button type="button" class="btn btn-line btn-sm rc-btn" data-print>' + esc(P.print) + '</button>' +
            '<button type="button" class="btn btn-line btn-sm rc-btn" data-share>' + esc(P.share) + '</button>' +
            '<button type="button" class="rc-reset" data-reset hidden>' + esc(P.reset) + '</button>' +
          '</div>' +
        '</div>' +
      '</div></div></article>';
  }

  /* ---------- tekst: cijena torte ---------- */
  function article() {
    var A = R.article;
    return '<article class="rc-art" id="' + A.id + '" aria-labelledby="' + A.id + '-t"><div class="wrap">' + backLink() +
      '<header class="rc-art-head"><p class="chapter rv"><i aria-hidden="true"></i>' + esc(A.label) + ' · ' + esc(A.date) + '</p>' +
      '<h1 class="h2 rv" id="' + A.id + '-t">' + rich(A.title) + '</h1><p class="lead rv">' + esc(A.intro) + '</p></header>' +
      '<ol class="rc-points">' + A.points.map(function (p, i) {
        return '<li class="rv" style="--d:' + (i % 2) + '"><span class="rc-dots" aria-hidden="true"><i></i><i></i><i></i></span><b class="rc-pn">0' + (i + 1) + '</b><h3>' + esc(p.title) + '</h3><p>' + esc(p.text) + '</p></li>';
      }).join('') + '</ol>' +
      '<div class="rc-close rv"><h3>' + esc(A.close.title) + '</h3><p>' + esc(A.close.text) + '</p>' +
      '<blockquote><p>' + esc(A.close.quote) + '</p><footer class="script">Nemanja</footer></blockquote>' +
      '<a class="btn rc-cta" href="./#contact">Torta po mjeri <i aria-hidden="true">→</i></a></div>' +
      '</div></article>';
  }

  function outro() {
    return '<section class="rc-out"><div class="wrap rv"><p>' + esc(P.more) + '</p>' +
      '<a class="rc-ig" href="https://www.instagram.com/nemanja_petr/" target="_blank" rel="noopener">@nemanja_petr</a></div></section>';
  }

  function render() {
    var main = document.getElementById('main');
    if (MODE === 'recept') {
      var en = ENTRIES.filter(function (x) { return x.id === ONE; })[0];
      if (!en) { location.replace('recepti.html'); return; }
      main.innerHTML = (en.kind === 'r' ? recipe(en.r, 0) : article()) + neighbours(en.id) + outro();
      if (en.kind === 'r') restore(en.r);
      return;
    }
    main.innerHTML = listPage() + outro();
  }

  /* ---------- oznake: sastojci i koraci ---------- */
  function key(id) { return 'np-rec-' + id; }
  function state(el) {
    var ing = [].map.call(el.querySelectorAll('[data-ing]:checked'), function (x) { return x.getAttribute('data-ing'); });
    var st = [].map.call(el.querySelectorAll('.rc-step[aria-pressed="true"]'), function (x) { return +x.getAttribute('data-step'); });
    return { i: ing, s: st };
  }
  function progress(el) {
    var all = el.querySelectorAll('.rc-step'), done = el.querySelectorAll('.rc-step[aria-pressed="true"]').length;
    el.querySelector('.rc-prog-t').innerHTML = '<b>' + done + '</b> ' + esc(P.of) + ' ' + all.length + ' ' + esc(P.stepsShort) + ' ' + esc(P.done);
    el.querySelector('.rc-prog > i > i').style.transform = 'scaleX(' + (all.length ? done / all.length : 0) + ')';
    el.querySelector('.rc-prog').classList.toggle('full', done === all.length);
    var any = done > 0 || el.querySelector('[data-ing]:checked');
    el.querySelector('[data-reset]').hidden = !any;
  }
  function restore(r) {
    var el = document.getElementById(r.id), s = load(key(r.id)) || { i: [], s: [] };
    (s.i || []).forEach(function (k) { var x = el.querySelector('[data-ing="' + k + '"]'); if (x) x.checked = true; });
    (s.s || []).forEach(function (k) { var x = el.querySelector('[data-step="' + k + '"]'); if (x) x.setAttribute('aria-pressed', 'true'); });
    progress(el);
  }
  function store(el) { save(key(el.getAttribute('data-rc')), state(el)); progress(el); }

  /* ---------- štampa i dijeljenje ---------- */
  var toastT = 0;
  function toast(t) {
    var el = document.querySelector('.rc-toast');
    if (!el) { el = document.createElement('div'); el.className = 'rc-toast'; el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite'); document.body.appendChild(el); }
    el.textContent = t; el.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove('on'); }, 2200);
  }
  function share(el) {
    var id = el.id, r = R.recipes.filter(function (x) { return x.id === id; })[0];
    var url = location.href.split('#')[0].split('?')[0], title = r.title.replace(/\*/g, '') + ' · Nemanja Petrović';
    if (navigator.share) { navigator.share({ title: title, text: r.intro, url: url }).catch(function () {}); return; }
    var done = function () { toast(P.copied); };
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () { prompt(title, url); });
    else prompt(title, url);
  }
  function printOne(el) {
    root.classList.add('print-one'); el.classList.add('pr');
    var end = function () { root.classList.remove('print-one'); el.classList.remove('pr'); window.removeEventListener('afterprint', end); };
    window.addEventListener('afterprint', end);
    window.print();
    setTimeout(end, 1500);
  }

  /* ---------- događaji ---------- */
  document.addEventListener('click', function (e) {
    var st = e.target.closest('.rc-step');
    if (st) { st.setAttribute('aria-pressed', String(st.getAttribute('aria-pressed') !== 'true')); store(st.closest('.rc')); return; }
    var el = e.target.closest('.rc');
    if (e.target.closest('[data-print]')) { printOne(el); return; }
    if (e.target.closest('[data-share]')) { share(el); return; }
    if (e.target.closest('[data-reset]')) {
      [].forEach.call(el.querySelectorAll('[data-ing]'), function (x) { x.checked = false; });
      [].forEach.call(el.querySelectorAll('.rc-step'), function (x) { x.setAttribute('aria-pressed', 'false'); });
      store(el); el.querySelector('.rc-list').scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }); return;
    }
  });
  document.addEventListener('click', function (e) {
    var pg = e.target.closest('[data-pg]'); if (pg && !pg.disabled) goPage(+pg.getAttribute('data-pg'));
  });
  document.addEventListener('change', function (e) { if (e.target.matches('[data-ing]')) store(e.target.closest('.rc')); });

  /* stare adrese (recepti.html#luda-torta) vode na stranicu recepta */
  function oldHash() {
    var en = MODE === 'recepti' && location.hash.length > 1 && ENTRIES.filter(function (x) { return x.id === decodeURIComponent(location.hash.slice(1)); })[0];
    if (en) location.replace(en.file);
    return !!en;
  }
  addEventListener('hashchange', oldHash);
  if (oldHash()) return;
  render();
})();
