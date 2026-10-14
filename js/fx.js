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
  var an = null, anL = [], anI = [], anLast = -2;
  var wd = null, wdTrack = null, wdRail = null, wdMax = 0, wdPad = [0, 0], wdDesk = false, wdN = 0, wdCur = -1, wdCount = null, wdBar = null, wdP = 0;
  function collect() {
    pars = [].slice.call(document.querySelectorAll('[data-par]'));
    tiers = document.getElementById('tiers');
    tc = tiers && tiers.querySelector('.tc-n');
    steps = tiers ? [].slice.call(tiers.querySelectorAll('[data-step]')) : [];
    lastN = -1;
    an = document.getElementById('anatomy');
    anL = an ? [].slice.call(an.querySelectorAll('.an-l')) : [];
    anI = an ? [].slice.call(an.querySelectorAll('.an-list li')) : [];
    anLast = -2;
    if (an) {
      var sv = an.querySelector('.an-svg');
      if (sv) sv.setAttribute('viewBox', matchMedia('(max-width: 900px)').matches ? '-4 0 470 520' : '0 0 760 520');
      if (reduced) { an.style.setProperty('--x', 1); an.classList.add('all'); }
    }
    wdSetup();
  }

  /* ---------- svadbe: na desktopu se lista bočno dok stranica ide dole, na mobitelu prevlačenje ---------- */
  function wdSetup() {
    wd = document.getElementById('weddings'); if (!wd) return;
    wdTrack = wd.querySelector('.wd-track'); wdRail = wd.querySelector('.wd-rail');
    wdCount = wd.querySelector('.wd-count b'); wdBar = wd.querySelector('.wd-prog i');
    wdN = wdRail.children.length; wdCur = -1;
    wdDesk = matchMedia('(min-width: 901px)').matches && !reduced;
    root.classList.toggle('wd-h', wdDesk);
    if (wdDesk) {
      wdRail.style.transform = '';
      wdMax = Math.max(0, wdRail.scrollWidth - wdTrack.clientWidth);
      var cs = getComputedStyle(wd); wdPad = [parseFloat(cs.paddingTop) || 0, parseFloat(cs.paddingBottom) || 0];
      wd.style.height = Math.round(innerHeight + wdMax + wdPad[0] + wdPad[1]) + 'px';
    } else { wd.style.height = ''; wdRail.style.transform = ''; wdMax = 0; }
  }
  function wdShow(p) {
    wdP = p;
    var i = Math.max(0, Math.min(wdN - 1, Math.round(p * (wdN - 1))));
    if (wdBar) wdBar.style.transform = 'scaleX(' + Math.max(0.02, p).toFixed(3) + ')';
    if (i !== wdCur) {
      wdCur = i; if (wdCount) wdCount.textContent = String(i + 1).padStart(2, '0');
      [].forEach.call(wdRail.children, function (li, j) { li.classList.toggle('on', j === i); });
    }
  }
  function wdScroll() {
    if (!wd) return;
    if (wdDesk) {
      var r = wd.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      var p = Math.min(1, Math.max(0, (-r.top - wdPad[0]) / Math.max(1, wdMax)));
      wdRail.style.transform = 'translate3d(' + (-p * wdMax).toFixed(1) + 'px,0,0)';
      wdShow(p);
    }
  }
  function wdTrackScroll() {
    if (wdDesk || !wdTrack) return;
    var m = wdTrack.scrollWidth - wdTrack.clientWidth; wdShow(m > 0 ? wdTrack.scrollLeft / m : 0);
  }
  document.addEventListener('np:wd', function (e) {
    if (!wd) return;
    var d = e.detail, i = Math.max(0, Math.min(wdN - 1, wdCur + d));
    if (wdDesk) {
      var top = wd.getBoundingClientRect().top + scrollY + wdPad[0] + wdMax * (wdN > 1 ? i / (wdN - 1) : 0);
      scrollTo({ top: top, behavior: 'smooth' });
    } else {
      var li = wdRail.children[i]; if (li) wdTrack.scrollTo({ left: li.offsetLeft - wdRail.children[0].offsetLeft, behavior: reduced ? 'auto' : 'smooth' });
    }
  });
  /* povlačenje mišem na desktopu pomjera galeriju (klik bez pomjeranja i dalje otvara sliku) */
  (function drag() {
    var x0 = 0, y0 = 0, moved = false, on = false;
    document.addEventListener('pointerdown', function (e) {
      if (!wdDesk || e.pointerType !== 'mouse' || e.button !== 0 || !e.target.closest('.wd-track')) return;
      on = true; moved = false; x0 = e.clientX; y0 = scrollY; e.preventDefault();
    });
    addEventListener('pointermove', function (e) {
      if (!on) return;
      var dx = e.clientX - x0; if (Math.abs(dx) > 4) moved = true;
      if (moved && wdMax) { root.classList.add('dragging'); scrollTo(0, y0 - dx); }
    });
    addEventListener('pointerup', function () { if (!on) return; on = false; root.classList.remove('dragging'); });
    document.addEventListener('click', function (e) { if (moved && e.target.closest('.wd-track')) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
  })();

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
    if (an) {
      var ar = an.getBoundingClientRect(), aspan = ar.height - vh;
      if (ar.bottom > 0 && ar.top < vh) {
        var ap = Math.min(1, Math.max(0, -ar.top / Math.max(1, aspan)));
        var x = Math.min(1, Math.max(0, (ap - 0.06) / 0.42)); x = x * x * (3 - 2 * x);
        an.style.setProperty('--x', x.toFixed(4));
        var ai = ap < 0.5 ? -1 : Math.min(anL.length - 1, Math.floor((ap - 0.5) / 0.46 * anL.length));
        if (ai !== anLast) {
          anLast = ai;
          an.classList.toggle('open', ai >= 0);
          anL.forEach(function (g) { g.classList.toggle('act', +g.getAttribute('data-i') === ai); });
          anI.forEach(function (li, j) { li.classList.toggle('act', j === ai || (ai < 0 && j === 0)); });
        }
      }
    }
    wdScroll();
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', function () { collect(); onScroll(); });

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
      var t = e.target.closest && e.target.closest('a, button, .lb-open, input, textarea, .wd-track');
      var word = '', L = window.NPApp && window.NPApp.L;
      if (t && L && UI) { if (wdDesk && t.closest('.wd-track')) word = L(UI.drag); else if (t.closest('.lb-open')) word = L(UI.view); }
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
    wdTrackScroll(); if (wd && wdCur < 0) wdShow(0);
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
