import { bootstrap, initReveal } from '../main.js';
import { loadImageIndex, imgTag } from '../img.js';
import { inkTextVar } from '../ink.js';
import { ABOUT_INTRO, ABOUT_SECTIONS } from '../../data/about.js';

function renderIntro() {
  document.getElementById('about-eyebrow').textContent = ABOUT_INTRO.eyebrow;
  document.getElementById('about-title').textContent = ABOUT_INTRO.title;
  document.getElementById('about-lead').textContent = ABOUT_INTRO.lead;
  document.getElementById('about-body').textContent = ABOUT_INTRO.body;
}

function renderIndex() {
  document.getElementById('about-index-list').innerHTML = ABOUT_SECTIONS.map(s => `
    <li><a href="#${s.id}" data-index-link="${s.id}">${s.title}</a></li>
  `).join('');
}

// Text/image pairing, alternating sides — see about.css for how
// nth-of-type(even) flips the grid order. Each section keeps the site's
// existing card language: a thin accent-ink rule above the kicker, same as
// the event-nav-card/init-strip-card treatment elsewhere.
function renderSections(images) {
  document.getElementById('about-sections').innerHTML = ABOUT_SECTIONS.map(s => `
    <section class="about-section" id="${s.id}" data-reveal>
      <div class="about-section__text">
        <div class="about-section__rule" style="background:${s.ink}"></div>
        <div class="about-section__kicker" style="color:${inkTextVar(s.ink)}">${s.kicker}</div>
        <h2 class="about-section__title">${s.title}</h2>
        <p class="about-section__body">${s.body}</p>
        ${s.link ? `<a class="text-link about-section__link" href="${s.link.href}">${s.link.label}</a>` : ''}
      </div>
      <div class="about-section__media">${imgTag(images, s.image, s.imageAlt, { sizes: '(max-width:900px) 100vw, 40vw' })}</div>
    </section>
  `).join('');
}

function initScrollSpy() {
  const links = document.querySelectorAll('[data-index-link]');
  const sections = ABOUT_SECTIONS.map(s => document.getElementById(s.id));
  const io = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.toggle('is-active', l.dataset.indexLink === entry.target.id));
      }
    }
  }, { rootMargin: '-20% 0px -70% 0px' });
  sections.forEach(s => s && io.observe(s));
}

async function main() {
  renderIntro();
  renderIndex();
  await bootstrap();
  const images = await loadImageIndex();
  renderSections(images);
  initReveal();
  initScrollSpy();
}

main();
