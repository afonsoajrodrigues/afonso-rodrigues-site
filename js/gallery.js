// Photography page: collapsible series + lightbox with prev/next, arrow keys,
// swipe, counter and focus trap. Shared by /photography.html and /pt/photography.html.
function toggleSeries(header) {
  var section = header.closest('.series-section');
  var collapsed = section.classList.toggle('is-collapsed');
  header.querySelector('.series-toggle-btn').setAttribute('aria-expanded', String(!collapsed));
}

document.addEventListener('DOMContentLoaded', function () {
  var pt = document.documentElement.lang.indexOf('pt') === 0;
  var T = pt ? { open: 'abrir em tamanho grande', of: 'de' } : { open: 'open full size', of: 'of' };
  var lb = document.getElementById('lightbox');
  var img = document.getElementById('lightbox-img');
  var cap = document.getElementById('lightbox-caption');
  var count = document.getElementById('lightbox-count');
  var btnClose = document.getElementById('lightbox-close');
  var btnPrev = document.getElementById('lightbox-prev');
  var btnNext = document.getElementById('lightbox-next');
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
  var i = -1, lastTrigger = null;

  // The 1400w derivative is sharp enough for any screen and ~3x lighter than the original.
  function src(el) {
    var thumb = el.querySelector('img');
    var m = thumb && thumb.getAttribute('srcset') && thumb.getAttribute('srcset').match(/(\S+-1400w\.jpg)\s/);
    return m ? m[1] : el.dataset.lightbox;
  }

  function show(n) {
    i = (n + items.length) % items.length;
    var el = items[i];
    img.src = src(el);
    img.alt = el.dataset.alt || '';
    cap.textContent = el.dataset.caption || '';
    count.textContent = (i + 1) + ' ' + T.of + ' ' + items.length;
    new Image().src = src(items[(i + 1) % items.length]); // preload next
  }

  function open(el) {
    lastTrigger = el;
    show(items.indexOf(el));
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    btnClose.focus();
  }

  function close() {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    img.removeAttribute('src');
    if (lastTrigger) lastTrigger.focus();
  }

  items.forEach(function (el) {
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', (el.dataset.alt || 'Photo') + ' — ' + T.open);
    el.addEventListener('click', function () { open(el); });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(el); }
    });
  });

  btnClose.addEventListener('click', function (e) { e.stopPropagation(); close(); });
  btnPrev.addEventListener('click', function (e) { e.stopPropagation(); show(i - 1); });
  btnNext.addEventListener('click', function (e) { e.stopPropagation(); show(i + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });

  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(i - 1);
    else if (e.key === 'ArrowRight') show(i + 1);
    else if (e.key === 'Tab') { // keep focus inside the dialog
      var f = [btnClose, btnPrev, btnNext], k = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(k + (e.shiftKey ? f.length - 1 : 1)) % f.length].focus();
    }
  });

  var x0 = null;
  lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) show(dx < 0 ? i + 1 : i - 1);
    x0 = null;
  });
});
