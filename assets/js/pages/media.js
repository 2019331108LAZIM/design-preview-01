import { bootstrap, initReveal } from '../main.js';
import { svgTag } from '../img.js';
import { PRESS, MARKS } from '../../data/media.js';

function formatDate(iso) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

async function main() {
  await bootstrap();

  document.getElementById('press-list').innerHTML = PRESS.map(c => `
    <a class="press-row" href="#" data-backend="TODO: link to the actual article URL" data-reveal>
      <span class="press-row__outlet">${c.outlet}</span>
      <span class="press-row__title">${c.title}</span>
      <span class="press-row__date">${formatDate(c.date)}</span>
    </a>
  `).join('');

  document.getElementById('marks-grid').innerHTML = MARKS.map(m => `
    <div class="mark-card" data-reveal>
      <div class="mark-card__plate">${svgTag(m.src, m.name, { width: m.w, height: m.h })}</div>
      <div class="mark-card__row"><span class="mark-card__name">${m.name}</span><span class="mark-card__fmt">PNG · SVG</span></div>
    </div>
  `).join('');

  initReveal();
}

main();
