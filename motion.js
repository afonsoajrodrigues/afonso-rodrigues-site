// Scroll-reveal for [data-reveal] elements — staggered by DOM order within their parent.
document.addEventListener('DOMContentLoaded', () => {
  const revealEls = document.querySelectorAll('[data-reveal]');

  if (!('IntersectionObserver' in window) || !revealEls.length) {
    revealEls.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const groups = new Map();
  revealEls.forEach(el => {
    const parent = el.parentElement;
    const index = groups.has(parent) ? groups.get(parent) : 0;
    el.style.setProperty('--reveal-delay', Math.min(index, 5) * 0.09 + 's');
    groups.set(parent, index + 1);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
});
