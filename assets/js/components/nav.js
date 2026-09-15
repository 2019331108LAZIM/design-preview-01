// Mobile full-screen overlay (with focus trap) + desktop dropdown
// disclosure + sticky header condense-on-scroll.

export function initHeaderCondense() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  // No eager onScroll() call here: the page always starts at scrollY 0,
  // which already matches the default (non-condensed) CSS state, and
  // reading window.scrollY synchronously right after renderHeader()'s
  // innerHTML write forces an otherwise-avoidable layout flush.
  window.addEventListener('scroll', () => {
    header.classList.toggle('is-condensed', window.scrollY > 40);
  }, { passive: true });
}

export function initDropdowns() {
  document.querySelectorAll('[data-dropdown-trigger]').forEach(trigger => {
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    const item = trigger.closest('.main-nav__item');
    if (!panel || !item) return;

    const open = () => { panel.hidden = false; trigger.setAttribute('aria-expanded', 'true'); };
    const close = () => { panel.hidden = true; trigger.setAttribute('aria-expanded', 'false'); };

    trigger.addEventListener('click', e => {
      e.preventDefault();
      panel.hidden ? open() : close();
    });
    item.addEventListener('mouseenter', open);
    item.addEventListener('mouseleave', close);
    item.addEventListener('focusout', e => {
      if (!item.contains(e.relatedTarget)) close();
    });
    item.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !panel.hidden) { close(); trigger.focus(); }
    });
  });
}

export function initMobileNav() {
  const toggle = document.querySelector('[data-nav-toggle]');
  const overlay = document.querySelector('[data-nav-overlay]');
  if (!toggle || !overlay) return;

  let lastFocused = null;

  function focusable() {
    return Array.from(overlay.querySelectorAll('a, button')).filter(el => el.offsetParent !== null);
  }

  function onKeydown(e) {
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    const items = focusable();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function open() {
    lastFocused = document.activeElement;
    overlay.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const items = focusable();
    if (items[0]) items[0].focus();
    document.addEventListener('keydown', onKeydown);
  }

  function close() {
    overlay.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused instanceof HTMLElement) lastFocused.focus();
  }

  toggle.addEventListener('click', () => (overlay.classList.contains('is-open') ? close() : open()));
  overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}
