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
  function collect() {
    pars = [].slice.call(document.querySelectorAll('[data-par]'));
    tiers = document.getElementById('tiers');
    tc = tiers && tiers.querySelector('.tc-n');
    steps = tiers ? [].slice.call(tiers.querySelectorAll('[data-step]')) : [];
    lastN = -1;
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
    if (tiers) {
      var tr = tiers.getBoundingClientRect(), span = tr.height - vh;
      if (tr.bottom > 0 && tr.top < vh) {
        var p = Math.min(1, Math.max(0, -tr.top / Math.max(1, span)));
        tiers.style.setProperty('--t', p.toFixed(4));
        var n = Math.max(1, Math.min(11, Math.ceil(p * 11.6)));
        if (n !== lastN && tc) { tc.textContent = String(n).padStart(2, '0'); lastN = n; }
        steps.forEach(function (s, j) { s.classList.toggle('on', p >= [0, 0.38, 0.7][j]); });
        tiers.classList.toggle('done', p > 0.9);
      }
    }
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);

  /* ---------- kursor (samo miš) ---------- */
  (function cursor() {
    var c = document.querySelector('.cursor'); if (!c || !fine || reduced) return;
    root.classList.add('has-cursor');
    var x = -100, y = -100, cxp = -100, cyp = -100, on = false;
    addEventListener('pointermove', function (e) {
      x = e.clientX; y = e.clientY;
      if (!on) { on = true; cxp = x; cyp = y; loop(); }
      var t = e.target.closest && e.target.closest('a, button, .lb-open, input, textarea');
      c.classList.toggle('big', !!t);
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

  function init() { collect(); watch(); pauseOff(); onScroll(); }
  document.addEventListener('np:render', init);
  init();
  /* monogram se ispiše kad su fontovi spremni (bez čekanja duže od 1,8 s) */
  var go = function () { root.classList.add('ready'); };
  if (document.fonts && document.fonts.ready) { Promise.race([document.fonts.ready, new Promise(function (r) { setTimeout(r, 600); })]).then(go); } else go();
})();
