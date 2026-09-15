import { bootstrap, initReveal } from '../main.js';
import { loadEventImageIndex, imgTag, svgTag } from '../img.js';
import { INKS } from '../../data/site.js';
import { MARKS } from '../../data/media.js';
import { EVENTS } from '../../data/events.js';
import { renderCarouselShell, initCarousels } from '../components/slider.js';

function renderInks() {
  document.getElementById('ink-strip').innerHTML = INKS.map(i => `
    <div class="ink-swatch" style="background:${i.hex}"><span>${i.hex}</span></div>
  `).join('');
  document.getElementById('ink-legend').innerHTML = INKS.map(i => `
    <span style="border-color:${i.hex}">${i.name}</span>
  `).join('');
}

function renderMarks() {
  document.getElementById('marks-preview').innerHTML = MARKS.map(m => `
    <div class="mark-tile"><div class="mark-tile__plate">${svgTag(m.src, m.name, { width: m.w, height: m.h })}</div><div class="mark-tile__name">${m.name}</div></div>
  `).join('');
}

// Demonstrates the real events.html pattern: one carousel = one event's own
// photographs (not a cross-event category list — there is no grouping
// layer any more).
async function renderCarouselDemo() {
  const event = EVENTS[0];
  const [images, gallery] = await Promise.all([
    loadEventImageIndex(event.id),
    fetch(`assets/data/galleries/${event.id}.json`).then(r => (r.ok ? r.json() : []))
  ]);
  const slides = gallery.slice(0, 12).map(g => `
    <li class="carousel__slide">
      <a class="carousel__card" href="event.html?id=${event.id}" aria-label="${event.title}">
        <div class="carousel__media">${imgTag(images, g.src, g.caption || event.title, { sizes: '(max-width:700px) 78vw, 30vw' })}</div>
      </a>
    </li>`).join('');
  document.getElementById('carousel-demo').innerHTML = renderCarouselShell('demo', event.title, slides);
  initCarousels();
}

async function main() {
  renderInks();
  await bootstrap();
  renderMarks();
  await renderCarouselDemo();
  initReveal();
}

main();
