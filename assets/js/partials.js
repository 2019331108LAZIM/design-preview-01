// Renders the header and footer from assets/data/site.js into the
// #site-header / #site-footer mount points every page provides. One source
// of truth — change the nav or footer once here (or in site.js) rather
// than in thirteen HTML files.
import { NAV_ITEMS, FOOTER_COLS, SOCIALS, BRAND } from '../data/site.js';
import { inlineSvg } from './img.js';

function currentPage() {
  return location.pathname.split('/').pop() || 'index.html';
}

function navLinkHTML(item, current) {
  const active = item.href === current;
  return `<a class="main-nav__link" href="${item.href}"${active ? ' aria-current="page"' : ''}>${item.label}</a>`;
}

function navHTML(current) {
  return NAV_ITEMS.map((item, i) => {
    if (!item.children) return navLinkHTML(item, current);
    const panelId = `nav-dropdown-${i}`;
    const activeChild = item.children.some(c => c.href === current);
    return `
      <div class="main-nav__item">
        <button class="main-nav__link" type="button" data-dropdown-trigger aria-haspopup="true" aria-expanded="false" aria-controls="${panelId}"${activeChild ? ' aria-current="page"' : ''}>${item.label}</button>
        <div class="main-nav__dropdown" id="${panelId}" role="menu" hidden>
          ${item.children.map(c => `<a class="main-nav__link" role="menuitem" href="${c.href}"${c.href === current ? ' aria-current="page"' : ''}>${c.label}</a>`).join('')}
        </div>
      </div>`;
  }).join('');
}

function overlayNavHTML(current) {
  const links = NAV_ITEMS.map(item => {
    if (!item.children) {
      return `<a class="nav-overlay__link" href="${item.href}"${item.href === current ? ' aria-current="page"' : ''}>${item.label}</a>`;
    }
    return `
      <a class="nav-overlay__link" href="${item.href}">${item.label}</a>
      <div class="nav-overlay__sub">
        ${item.children.map(c => `<a class="nav-overlay__link" href="${c.href}"${c.href === current ? ' aria-current="page"' : ''}>${c.label}</a>`).join('')}
      </div>`;
  }).join('');
  // The header's own CTA button hides below 560px to stop it overflowing
  // the row (see layout.css), so the overlay carries it instead.
  return `${links}<a class="btn btn--primary nav-overlay__cta" href="contact.html"${current === 'contact.html' ? ' aria-current="page"' : ''}>Contact</a>`;
}

export async function renderHeader() {
  const mount = document.getElementById('site-header');
  if (!mount) return;
  const current = currentPage();
  const cfMark = await inlineSvg(BRAND.logo, { className: 'brand__cf-mark', ariaHidden: true });

  mount.innerHTML = `
    <a class="brand" href="index.html" aria-label="Cosmos Foundation — home">
      <span class="brand__lockup">${cfMark}</span>
    </a>
    <nav class="main-nav" aria-label="Primary">${navHTML(current)}</nav>
    <button class="theme-toggle" type="button" data-theme-toggle title="Toggle Ink &amp; Ember / Sunlit Parchment">
      <span class="theme-toggle__dot" aria-hidden="true"></span><span data-theme-label>Ember</span>
    </button>
    <a class="btn btn--primary" href="contact.html"${current === 'contact.html' ? ' aria-current="page"' : ''}>Contact</a>
    <button class="nav-toggle" type="button" data-nav-toggle aria-label="Open menu" aria-expanded="false" aria-controls="nav-overlay"><span aria-hidden="true"></span></button>
  `;

  let overlay = document.getElementById('nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'nav-overlay';
    overlay.className = 'nav-overlay';
    overlay.setAttribute('data-nav-overlay', '');
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = overlayNavHTML(current);
}

export async function renderFooter() {
  const mount = document.getElementById('site-footer');
  if (!mount) return;
  const logo = await inlineSvg(BRAND.logo, { ariaLabel: BRAND.name });

  mount.innerHTML = `
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="footer-brand__mark">${logo}</div>
        <p>${BRAND.address}</p>
        <div class="footer-brand__contact"><span>${BRAND.phone}</span><span>${BRAND.email}</span></div>
        <div class="footer-socials">${SOCIALS.map(s => `<a href="${s.href}" aria-label="${s.label} (opens in new tab)">${s.label}</a>`).join('')}</div>
      </div>
      ${FOOTER_COLS.map(col => `
        <div>
          <div class="footer-col__title">${col.title}</div>
          <ul class="footer-col__links">${col.links.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}</ul>
        </div>`).join('')}
    </div>
    <div class="newsletter">
      <div class="newsletter__card">
        <div>
          <div class="newsletter__title">The Foundation Letter</div>
          <div class="newsletter__copy">Dialogues, openings and new editions — once a month, on paper-coloured email.</div>
        </div>
        <form class="newsletter__form" data-backend="TODO: wire to newsletter subscription endpoint" novalidate>
          <label class="sr-only" for="newsletter-email">Email address</label>
          <input id="newsletter-email" name="email" type="email" placeholder="your@email" required>
          <button class="btn btn--primary btn--sm" type="submit">Subscribe</button>
        </form>
      </div>
    </div>
    <div class="footer-legal">
      <span>© 2026 Cosmos Foundation · A Cosmos Group Initiative</span>
      <span>Print &amp; Ember</span>
    </div>
  `;

  const form = mount.querySelector('.newsletter__form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (input && !input.checkValidity()) { input.reportValidity(); return; }
    form.innerHTML = '<p style="margin:0;font:500 13px/1.5 var(--font-body);color:var(--ink2)">Thank you — this form is not yet connected to a mailing list. See HANDOVER.md.</p>';
  });
}
