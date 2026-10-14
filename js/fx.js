/*
 * Efekti: šećer u prahu (canvas), 11 spratova (sticky), otkrivanje teksta i slika, brojači,
 * paralaks, kursor, zaglavlje (sakrij/pokaži, napredak). Sve staje kad nije na ekranu.
 * Uz "smanji pokrete" sve je odmah vidljivo i mirno.
 */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduced) root.classList.add('rm');

  /* ---------- šećer u prahu na prvom ekranu ---------- */
  (function sugar() {
    var cv = document.querySelector('.sugar'); if (!cv || reduced) return;
    var cx = cv.getContext('2d'), hero = document.getElementById('hero');
    var w = 0, h = 0, parts = [], raf = 0, visible = true, mx = -999, my = -999;
    function size() { w = cv.width = cv.clientWidth; h = cv.height = cv.clientHeight; }
    function make(init) {
      return { x: Math.random() * w, y: init ? Math.random() * h : -10, r: 1 + Math.random() * 1.2, a: 0.25 + Math.random() * 0.55,
        vy: 0.18 + Math.random() * 0.42, ph: Math.random() * 6.28, sw: 0.15 + Math.random() * 0.35, dx: 0 };
    }
    function tick() {
      if (!visible || document.hidden) { raf = 0; return; }
      raf = requestAnimationFrame(tick);
      cx.clearRect(0, 0, w, h);
      /* tri nivoa prozirnosti, svaki u jednom potezu */
      for (var band = 0; band < 3; band++) {
        cx.globalAlpha = 0.3 + band * 0.25; cx.fillStyle = '#F6EFE3'; cx.beginPath();
        for (var i = band; i < parts.length; i += 3) {
          var p = parts[i];
          p.ph += 0.012; p.y += p.vy; p.x += Math.sin(p.ph) * p.sw + p.dx; p.dx *= 0.94;
          var ddx = p.x - mx, ddy = p.y - my, dd = ddx * ddx + ddy * ddy;
          if (dd < 9000) { var k = (9000 - dd) / 9000; p.dx += (ddx > 0 ? 1 : -1) * k * 0.9; p.y -= k * 0.4; }
          if (p.y > h + 10 || p.x < -20 || p.x > w + 20) { parts[i] = make(false); continue; }
          cx.moveTo(p.x + p.r, p.y); cx.arc(p.x, p.y, p.r, 0, 6.283);
        }
        cx.fill();
      }
    }
    function start() { if (!raf && visible && !document.hidden) tick(); }
    size();
    var n = Math.round(Math.min(120, Math.max(60, w / 12)));
    for (var i = 0; i < n; i++) parts.push(make(true));
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; start(); }).observe(hero);
    document.addEventListener('visibilitychange', start);
    addEventListener('resize', size);
    if (fine) hero.addEventListener('pointermove', function (e) { var r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
    hero.addEventListener('pointerleave', function () { mx = my = -999; });
    start();
  })();

  /* ---------- otkrivanje (tekst, slike), brojači ---------- */
  var io = null;
  function countUp(el) {
    var n = +el.getAttribute('data-count'); if (!n || reduced) return;
    var t0 = performance.now(), dur = 1400;
    (function step(t) { var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(n * e); if (k < 1) requestAnimationFrame(step); })(t0);
  }
  function watch() {
    if (io) io.disconnect();
    var els = document.querySelectorAll('.rv, .ri, .stat');
    if (reduced || !('IntersectionObserver' in window)) { [].forEach.call(els, function (e) { e.classList.add('in'); }); return; }
    io = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting) return;
        x.target.classList.add('in');
        var c = x.target.querySelector('[data-count]'); if (c) countUp(c);
        io.unobserve(x.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    [].forEach.call(els, function (e) { if (!e.classList.contains('in')) io.observe(e); });
  }

  /* ---------- animacije pauziraju van ekrana ---------- */
  var io2 = null;
  function pauseOff() {
    if (io2) io2.disconnect();
    io2 = new IntersectionObserver(function (en) { en.forEach(function (x) { x.target.classList.toggle('off', !x.isIntersecting); }); }, { rootMargin: '120px 0px' });
    [].forEach.call(document.querySelectorAll('#main > section, .hero'), function (s) { io2.observe(s); });
  }

  /* ---------- listanje: zaglavlje, napredak, paralaks, 11 spratova ---------- */
  var top = document.getElementById('top'), lastY = 0, ticking = false;
  var pars = [], tiers = null, tc = null, steps = [], lastN = -1;
  var an = null;
  function collect() {
    pars = [].slice.call(document.querySelectorAll('[data-par]'));
    tiers = document.getElementById('tiers');
    tc = tiers && tiers.querySelector('.tc-n');
    steps = tiers ? [].slice.call(tiers.querySelectorAll('[data-step]')) : [];
    lastN = -1;
    an = document.getElementById('anatomy');
    if (an) { var sv = an.querySelector('.an-svg'); if (sv) sv.setAttribute('viewBox', matchMedia('(max-width: 900px)').matches ? '-4 0 470 520' : '0 0 760 520'); }
    wdSetup();
    tiersSetup();
  }

  /* ---------- svadbe: traka sa fotografijama, strelice lijevo/desno, na mobitelu i prstom ---------- */
  var wd = null, wdTrack = null, wdRail = null, wdN = 0, wdCur = -1, wdCount = null, wdBar = null;
  function wdSetup() {
    wd = document.getElementById('weddings'); if (!wd) return;
    wdTrack = wd.querySelector('.wd-track'); wdRail = wd.querySelector('.wd-rail');
    wdCount = wd.querySelector('.wd-count b'); wdBar = wd.querySelector('.wd-prog i');
    wdN = wdRail.children.length; wdCur = -1;
  }
  function wdShow(p, i) {
    if (wdBar) wdBar.style.transform = 'scaleX(' + Math.max(0.04, p).toFixed(3) + ')';
    if (i !== wdCur) {
      wdCur = i; if (wdCount) wdCount.textContent = String(i + 1).padStart(2, '0');
      [].forEach.call(wdRail.children, function (li, j) { li.classList.toggle('on', j === i); });
      var b = wd.querySelectorAll('.wd-btn'); if (b.length) { b[0].disabled = i <= 0 && p <= 0.01; b[1].disabled = p >= 0.99; }
    }
  }
  /* trenutna fotografija je ona čija je lijeva ivica najbliža početku trake */
  function wdTrackScroll() {
    if (!wdTrack) return;
    var m = wdTrack.scrollWidth - wdTrack.clientWidth, x = wdTrack.scrollLeft, o = wdRail.children[0].offsetLeft, best = 0, bd = 1e9;
    [].forEach.call(wdRail.children, function (li, j) { var d = Math.abs(li.offsetLeft - o - x); if (d < bd) { bd = d; best = j; } });
    var p = m > 0 ? x / m : 0; if (p > 0.99) best = wdN - 1;
    wdShow(p, best);
  }
  document.addEventListener('np:wd', function (e) {
    if (!wdTrack) return;
    var i = Math.max(0, Math.min(wdN - 1, wdCur + e.detail)), li = wdRail.children[i];
    if (li) wdTrack.scrollTo({ left: li.offsetLeft - wdRail.children[0].offsetLeft, behavior: reduced ? 'auto' : 'smooth' });
  });

  /* ---------- 11 spratova: kad sekcija uđe u ekran, torta naraste i brojač ide do 11 ---------- */
  var tObs = null;
  function tiersSetup() {
    if (tObs) tObs.disconnect();
    if (!tiers) return;
    if (reduced) { tiersAt(1); return; }
    if (tiers.classList.contains('played')) { tiersAt(1); return; }
    tiersAt(0);
    tObs = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return;
      tObs.disconnect(); tiers.classList.add('played');
      var t0 = performance.now(), dur = 3600;
      (function step(t) {
        var k = Math.min(1, (t - t0) / dur), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        tiersAt(e); if (k < 1) requestAnimationFrame(step);
      })(t0);
    }, { threshold: 0.45 });
    tObs.observe(tiers.querySelector('.tiers-art') || tiers);
  }
  function tiersAt(p) {
    tiers.style.setProperty('--t', p.toFixed(4));
    var n = Math.max(1, Math.min(11, Math.ceil(p * 11)));
    if (n !== lastN && tc) { tc.textContent = String(n).padStart(2, '0'); lastN = n; }
    steps.forEach(function (st, j) { st.classList.toggle('on', p >= [0, 0.4, 0.75][j]); });
    tiers.classList.toggle('done', p > 0.96);
  }

  /* ---------- odbrojavanje do akademije (kuca samo dok se vidi) ---------- */
  var cdTimer = 0;
  function countdown() {
    var box = document.querySelector('.ac-up'); clearInterval(cdTimer); if (!box) return;
    var t = Date.parse(box.getAttribute('data-date')), cells = box.querySelectorAll('[data-cd]');
    function tick() {
      var ms = t - Date.now();
      if (!(ms > 0)) { box.querySelector('.cd').hidden = true; box.querySelector('.cd-done').hidden = false; clearInterval(cdTimer); return; }
      var v = [Math.floor(ms / 864e5), Math.floor(ms / 36e5) % 24, Math.floor(ms / 6e4) % 60, Math.floor(ms / 1e3) % 60];
      for (var i = 0; i < 4; i++) { var x = String(v[i]).padStart(2, '0'); if (cells[i].textContent !== x) cells[i].textContent = x; }
    }
    tick();
    new IntersectionObserver(function (en) { clearInterval(cdTimer); if (en[0].isIntersecting) cdTimer = setInterval(tick, 1000); }).observe(box);
  }

  /* ---------- medalje se naginju za mišem ---------- */
  if (fine && !reduced) {
    document.addEventListener('pointermove', function (e) {
      var tl = e.target.closest && e.target.closest('.tl'); if (!tl) return;
      var m = tl.querySelector('.medals'); if (!m) return;
      var r = m.getBoundingClientRect(), dx = (e.clientX - (r.left + r.width / 2)) / 160, dy = (e.clientY - (r.top + r.height / 2)) / 160;
      m.style.setProperty('--ry', (Math.max(-1, Math.min(1, dx)) * 28).toFixed(1) + 'deg');
      m.style.setProperty('--rx', (Math.max(-1, Math.min(1, -dy)) * 22).toFixed(1) + 'deg');
    }, { passive: true });
    document.addEventListener('pointerout', function (e) { var tl = e.target.closest && e.target.closest('.tl'); if (tl && !tl.contains(e.relatedTarget)) { var m = tl.querySelector('.medals'); if (m) { m.style.removeProperty('--rx'); m.style.removeProperty('--ry'); } } });
  }
  function onScroll() {
    ticking = false;
    var y = scrollY, vh = innerHeight, H = root.scrollHeight - vh;
    top.classList.toggle('solid', y > 40);
    top.classList.toggle('hide', y > lastY && y > vh * 0.9 && !root.classList.contains('locked'));
    lastY = y;
    top.style.setProperty('--p', H > 0 ? (y / H).toFixed(4) : 0);
    if (reduced) return;
    for (var i = 0; i < pars.length; i++) {
      var r = pars[i].getBoundingClientRect(); if (r.bottom < -100 || r.top > vh + 100) continue;
      var k = parseFloat(pars[i].getAttribute('data-par')) || 0.06;
      pars[i].style.setProperty('--py', (((r.top + r.height / 2) - vh / 2) * -k).toFixed(1) + 'px');
    }
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', function () { var sv = an && an.querySelector('.an-svg'); if (sv) sv.setAttribute('viewBox', matchMedia('(max-width: 900px)').matches ? '-4 0 470 520' : '0 0 760 520'); onScroll(); });

  /* ---------- kursor (samo miš) ---------- */
  (function cursor() {
    var c = document.querySelector('.cursor'); if (!c || !fine || reduced) return;
    root.classList.add('has-cursor');
    c.innerHTML = '<i></i><span></span>';
    var lab = c.querySelector('span'), UI = window.NP && window.NP.ui;
    var x = -100, y = -100, cxp = -100, cyp = -100, on = false;
    addEventListener('pointermove', function (e) {
      x = e.clientX; y = e.clientY;
      if (!on) { on = true; cxp = x; cyp = y; loop(); }
      var t = e.target.closest && e.target.closest('a, button, .lb-open, input, textarea');
      var word = '', L = window.NPApp && window.NPApp.L;
      if (t && L && UI && t.closest('.lb-open')) word = L(UI.view);
      if (lab.textContent !== word) lab.textContent = word;
      c.classList.toggle('big', !!t && !word);
      c.classList.toggle('word', !!word);
    }, { passive: true });
    document.addEventListener('pointerleave', function () { on = false; c.style.opacity = 0; });
    function loop() {
      if (!on) return;
      cxp += (x - cxp) * 0.22; cyp += (y - cyp) * 0.22;
      c.style.opacity = 1;
      c.style.transform = 'translate3d(' + cxp.toFixed(1) + 'px,' + cyp.toFixed(1) + 'px,0)';
      requestAnimationFrame(loop);
    }
  })();

  function init() {
    collect(); watch(); pauseOff(); onScroll(); countdown();
    var tio = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('tex'); tio.unobserve(x.target); } }); }, { rootMargin: '700px 0px' });
    [].forEach.call(document.querySelectorAll('.works, .awards, .contact'), function (el) { tio.observe(el); });
    if (wdTrack) wdTrack.addEventListener('scroll', function () { requestAnimationFrame(wdTrackScroll); }, { passive: true });
    wdTrackScroll();
  }
  document.addEventListener('np:render', init);
  init();
  /* ---------- uvod: samo pri prvom otvaranju (ili ?intro), dodir ili tipka ga preskače ---------- */
  var go = function () { root.classList.add('ready'); };
  var introPending = root.classList.contains('intro-on') && window.NP_ART && !reduced;
  if (introPending) {
    var ui = window.NP.ui, L0 = window.NPApp ? window.NPApp.L : function (o) { return o.bs; };
    var el = document.createElement('div'); el.className = 'intro'; el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<div class="intro-in">' + window.NP_ART.mono + '<p class="intro-l">Pastry Chef · Mostar</p></div><span class="intro-skip">' + L0(ui.skipIntro) + '</span><i class="intro-edge"></i>';
    document.body.appendChild(el);
    root.classList.add('locked');
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('go'); }); });
    var ended = false, end = function () {
      if (ended) return; ended = true; clearTimeout(tm);
      el.classList.add('out'); root.classList.remove('locked', 'intro-on'); go();
      removeEventListener('keydown', end); removeEventListener('wheel', end);
      setTimeout(function () { el.remove(); }, 1300);
    };
    var tm = setTimeout(end, 2400);
    el.addEventListener('pointerdown', end); addEventListener('keydown', end); addEventListener('wheel', end, { passive: true });
  } else {
    root.classList.remove('intro-on');
    /* monogram se ispiše kad su fontovi spremni (bez čekanja duže od 0,6 s) */
    if (document.fonts && document.fonts.ready) { Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 600); })]).then(go); } else go();
  }
})();
