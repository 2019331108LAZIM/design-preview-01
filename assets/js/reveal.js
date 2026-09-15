// Scroll reveals via IntersectionObserver with a staggered --i delay.
// Call again (with a container) after injecting new DOM, e.g. after a
// carousel or gallery renders its slides.
export function initReveal(root = document) {
  const els = Array.from(root.querySelectorAll('[data-reveal]:not([data-reveal-bound])'));
  if (!els.length) return;
  els.forEach(el => el.setAttribute('data-reveal-bound', ''));

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const counters = new WeakMap();
  els.forEach(el => {
    const parent = el.parentElement;
    const idx = counters.get(parent) ?? 0;
    el.style.setProperty('--i', idx);
    counters.set(parent, idx + 1);
  });

  const io = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
}
