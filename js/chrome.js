(function () {
  var root = document.documentElement;
  var FS_MIN = 0.85, FS_MAX = 1.4, FS_STEP = 0.1;

  // Contrast-safe accent blend: mixes accent toward white/black until ~4.5:1 against bg
  function toRgb(hex) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function lum(rgb) {
    var a = rgb.map(function (v) {
      var s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }
  function contrastRatio(a, b) {
    var l1 = lum(a), l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }
  function readableAccent(hex, bgHex, towardWhite) {
    var base = toRgb(hex), bg = toRgb(bgHex);
    var target = towardWhite ? [255, 255, 255] : [0, 0, 0];
    var out = base;
    for (var t = 0; t <= 1.001; t += 0.05) {
      out = base.map(function (c, i) { return Math.round(c + (target[i] - c) * t); });
      if (contrastRatio(out, bg) >= 4.5) break;
    }
    return '#' + out.map(function (c) { return c.toString(16).padStart(2, '0'); }).join('');
  }

  function applyAccent() {
    var isDark = root.getAttribute('data-theme') === 'dark';
    var fill = getComputedStyle(root).getPropertyValue('--accent-fill').trim() || '#1c4b8a';
    var bg = isDark ? '#0d0d0c' : '#ffffff';
    root.style.setProperty('--accent', readableAccent(fill, bg, isDark));
  }

  // Theme toggle (persisted) — data-theme is already set pre-paint by the inline
  // snippet in <head>; this just wires up the button and keeps --accent in sync.
  function setTheme(dark) {
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.textContent = dark ? 'Light' : 'Dark';
    });
    try { localStorage.setItem('ar-theme', dark ? 'dark' : 'light'); } catch (e) {}
    applyAccent();
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
