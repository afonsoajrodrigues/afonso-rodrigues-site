(function () {
  var root = document.documentElement;
  var FS_MIN = 0.85, FS_MAX = 1.4, FS_STEP = 0.1;

  // Theme toggle (persisted) — data-theme is already set pre-paint by the inline
  // snippet in <head>; this just wires up the button and keeps --accent in sync.
  function setTheme(dark) {
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(dark));
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#15140f' : '#fdfcf8');
    try { localStorage.setItem('ar-theme', dark ? 'dark' : 'light'); } catch (e) {}
  }

  // Text size (persisted)
  function setFs(v) {
    v = Math.min(FS_MAX, Math.max(FS_MIN, v));
    root.style.setProperty('--fs', v.toFixed(2));
    try { localStorage.setItem('ar-fs', v.toFixed(2)); } catch (e) {}
  }

  // Rent chart: price/m² <-> rent for 45m² flat (drives illustrative .bar-row
  // lists; the real choropleth map has its own D3 redraw, see js/rent-map.js)
  var FLAT_SIZE = 45, MAX_M2 = 18;
  function renderBars(scope, mode) {
    var rows = scope.querySelectorAll('.bar-row[data-value-m2]');
    rows.forEach(function (row) {
      var m2 = parseFloat(row.dataset.valueM2);
      var isM2 = mode === 'm2';
      var val = isM2 ? m2 : Math.round(m2 * FLAT_SIZE);
      var max = isM2 ? MAX_M2 : MAX_M2 * FLAT_SIZE;
      var fill = row.querySelector('.bar-fill');
      var out = row.querySelector('.bar-value');
      if (fill) fill.style.width = (val / max * 100).toFixed(1) + '%';
      if (out) out.textContent = isM2 ? '€' + m2.toFixed(2) + '/m²' : '€' + val;
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setTheme(root.getAttribute('data-theme') === 'dark');
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () { setTheme(root.getAttribute('data-theme') !== 'dark'); });
    });

    setFs(parseFloat(localStorage.getItem('ar-fs')) || 1);
    document.querySelectorAll('[data-font-smaller]').forEach(function (btn) {
      btn.addEventListener('click', function () { setFs(parseFloat(getComputedStyle(root).getPropertyValue('--fs')) - FS_STEP); });
    });
    document.querySelectorAll('[data-font-bigger]').forEach(function (btn) {
      btn.addEventListener('click', function () { setFs(parseFloat(getComputedStyle(root).getPropertyValue('--fs')) + FS_STEP); });
    });

    // Header slides away while reading down, returns on any upward scroll.
    var header = document.querySelector('.site-header');
    var prose = document.querySelector('article .prose');
    var bar = null;
    if (prose) {
      bar = document.createElement('div');
      bar.className = 'read-progress';
      bar.setAttribute('aria-hidden', 'true');
      document.body.appendChild(bar);
    }
    var lastY = window.scrollY, ticking = false;
    function onScroll() {
      var y = window.scrollY;
      if (header) header.classList.toggle('is-hidden', y > 160 && y > lastY && !header.contains(document.activeElement));
      if (header) header.classList.toggle('is-scrolled', y > 8);
      lastY = y;
      if (bar) {
        var r = prose.getBoundingClientRect();
        var p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
        bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });

    // Table of contents follows the section being read.
    var tocLinks = document.querySelectorAll('.toc a[href^="#"]');
    if (tocLinks.length && 'IntersectionObserver' in window) {
      var byId = {};
      tocLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          tocLinks.forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
          var a = byId[en.target.id];
          if (a) { a.classList.add('is-active'); a.setAttribute('aria-current', 'location'); }
        });
      }, { rootMargin: '-15% 0px -70% 0px' });
      Object.keys(byId).forEach(function (id) { var h = document.getElementById(id); if (h) io.observe(h); });
    }

    document.querySelectorAll('[data-bar-list]').forEach(function (list) {
      renderBars(list, 'm2');
    });
    document.querySelectorAll('[data-metric-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var scope = btn.closest('section') || document;
        var mode = btn.dataset.metricBtn === 'rent_t1_45m2' ? 't1' : 'm2';
        renderBars(scope, mode);
      });
    });
  });
})();
