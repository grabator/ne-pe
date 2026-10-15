/*
 * Stranica recepata: crta recepte iz data/recepti.js.
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

  function count(r) { return r.groups.reduce(function (n, g) { return n + g.items.length; }, 0); }

  /* ---------- vrh i sadržaj ---------- */
  function hero() {
    var cards = R.recipes.map(function (r, i) {
      var c = ART.cake(r.layers, 'i' + i);
      return '<li class="rc-card rv" style="--d:' + i + '"><a href="#' + r.id + '">' +
        '<span class="rc-card-art">' + c.svg + '</span>' +
        '<span class="rc-card-txt"><small>' + esc(r.date) + '</small><b class="script">' + esc(r.script) + '</b>' +
        '<span class="rc-card-meta">' + count(r) + ' ' + esc(P.ingCount) + ' · ' + r.steps.length + ' ' + esc(P.stepsShort) + '</span>' +
        '<span class="rc-more">' + esc(P.read) + ' <i aria-hidden="true">→</i></span></span></a></li>';
    }).join('');
    var A = R.article;
    cards += '<li class="rc-card rc-card-art2 rv" style="--d:' + R.recipes.length + '"><a href="#' + A.id + '">' +
      '<span class="rc-card-top"><span class="rc-card-dots" aria-hidden="true"><i></i><i></i><i></i></span>' +
      '<span class="rc-card-pts">' + A.points.map(function (p, i) { return '<span><b>0' + (i + 1) + '</b>' + esc(p.title) + '</span>'; }).join('') + '</span></span>' +
      '<span class="rc-card-txt"><small>' + esc(A.label) + ' · ' + esc(A.date) + '</small><b class="rc-card-q">' + rich(A.title) + '</b>' +
      '<span class="rc-more">' + esc(P.readArticle) + ' <i aria-hidden="true">→</i></span></span></a></li>';
    return '<section class="rc-hero" aria-labelledby="rc-h1"><div class="wrap">' +
      '<p class="chapter rv"><i aria-hidden="true"></i>' + esc(P.label) + '</p>' +
      '<div class="rc-hero-grid"><div><p class="rc-hero-script script rv" aria-hidden="true">Recepti</p>' +
      '<h1 class="h2 rc-h1 rv" id="rc-h1">' + rich(P.title) + '</h1></div>' +
      '<p class="lead rc-lead rv">' + esc(P.lead) + '</p></div>' +
      '<ul class="rc-cards">' + cards + '</ul></div></section>';
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
      '<div class="wrap">' +
      '<header class="rc-head">' +
        '<div class="rc-head-txt">' +
          '<p class="chapter rv"><i aria-hidden="true"></i>' + String(n + 1).padStart(2, '0') + ' · ' + 'Instagram, ' + esc(r.date) + '</p>' +
          '<h2 class="rc-title script rv" id="' + r.id + '-t">' + esc(r.script) + '</h2>' +
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
    return '<article class="rc-art" id="' + A.id + '" aria-labelledby="' + A.id + '-t"><div class="wrap">' +
      '<header class="rc-art-head"><p class="chapter rv"><i aria-hidden="true"></i>' + esc(A.label) + ' · ' + esc(A.date) + '</p>' +
      '<h2 class="h2 rv" id="' + A.id + '-t">' + rich(A.title) + '</h2><p class="lead rv">' + esc(A.intro) + '</p></header>' +
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
    document.getElementById('main').innerHTML = hero() + R.recipes.map(recipe).join('') + article() + outro();
    R.recipes.forEach(restore);
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
    var url = location.href.split('#')[0] + '#' + id, title = r.title.replace(/\*/g, '') + ' · Nemanja Petrović';
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
  document.addEventListener('change', function (e) { if (e.target.matches('[data-ing]')) store(e.target.closest('.rc')); });

  render();
  /* otvaranje na #recept: sadržaj nastaje iz JS-a, pa skok ide ovdje */
  var hashT = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (hashT) { hashT.scrollIntoView({ block: 'start' }); addEventListener('load', function () { hashT.scrollIntoView({ block: 'start' }); }); }
})();
