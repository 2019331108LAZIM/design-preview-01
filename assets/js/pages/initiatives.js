import { bootstrap, initReveal } from '../main.js';
import { loadImageIndex, imgTag } from '../img.js';
import { INITS, INIT_ORDER } from '../../data/initiatives.js';

async function main() {
  await bootstrap();
  const images = await loadImageIndex();
  const spans = { gallery: 'span-7 init-card--tall', atelier: 'span-5 init-card--tall', wild: 'span-5', bobi: 'span-7' };
  document.getElementById('initiatives-cards').innerHTML = INIT_ORDER.map(key => {
    const init = INITS[key];
    return `
      <a class="init-card ${spans[key]}" href="initiative.html?id=${init.key}" data-reveal>
        <div class="init-card__bg">${imgTag(images, init.hero, init.name, { sizes: '(max-width:900px) 100vw, 50vw' })}</div>
        <div class="init-card__scrim"></div>
        <div class="init-card__content">
          <span class="init-card__eyebrow">${init.eyebrow}</span>
          <h2 class="init-card__title">${init.name}</h2>
          <p class="init-card__dek">${init.tagline}</p>
        </div>
      </a>`;
  }).join('');
  initReveal();
}

main();
