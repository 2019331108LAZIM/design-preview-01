// Theme toggle wiring. The dark/light *decision* for first paint happens in
// the tiny inline blocking script in each page's <head> (see any page's
// <head> for the literal snippet) — this module only wires up the button
// once the DOM is interactive.
const KEY = 'cosmos-theme';

export function initThemeToggle() {
  const btn = document.querySelector('[data-theme-toggle]');
  if (!btn) return;
  const label = btn.querySelector('[data-theme-label]');

  const sync = () => {
    const t = document.documentElement.getAttribute('data-theme') || 'dark';
    btn.setAttribute('aria-pressed', String(t === 'light'));
    // Label names what pressing the button switches TO, not the current
    // theme — so it reads as an action ("go to Sunlit") rather than a
    // status readout of where you already are.
    if (label) label.textContent = t === 'dark' ? 'Sunlit' : 'Ember';
  };
  sync();

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem(KEY, next); } catch { /* storage unavailable */ }
    sync();
  });
}
