// Shared page bootstrap: header/footer, theme toggle, nav wiring, reveals.
// Every page's own assets/js/pages/*.js script imports and awaits this
// before doing its own (page-specific) rendering.
import { renderHeader, renderFooter } from './partials.js';
import { initThemeToggle } from './theme.js';
import { initHeaderCondense, initDropdowns, initMobileNav } from './components/nav.js';
import { initReveal } from './reveal.js';

export async function bootstrap() {
  await Promise.all([renderHeader(), renderFooter()]);
  initThemeToggle();
  initHeaderCondense();
  initDropdowns();
  initMobileNav();
  initReveal();
}

export { initReveal };
