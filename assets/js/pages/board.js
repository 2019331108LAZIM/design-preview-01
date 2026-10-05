import { bootstrap, initReveal } from '../main.js';
import { loadImageIndex, imgTag } from '../img.js';
import { BOARD, GROUPS } from '../../data/board.js';

async function render() {
  const images = await loadImageIndex();
  const container = document.getElementById('board-groups');
  container.innerHTML = GROUPS.map((title, gi) => {
    const people = BOARD.filter(p => p.group === gi);
    if (!people.length) return '';
    return `
      <section class="board-group" aria-labelledby="group-${gi}">
        <div class="board-group__head">
          <h2 class="board-group__title" id="group-${gi}">${title}</h2>
          <span class="board-group__rule" aria-hidden="true"></span>
          <span class="board-group__count">${String(people.length).padStart(2, '0')}</span>
        </div>
        <div class="board-group__grid">
          ${people.map(p => `
            <a class="portrait-card${p.placeholder ? ' portrait-card--placeholder' : ''}" href="board-member.html?id=${p.id}" data-reveal>
              <div class="portrait-card__frame"${p.placeholder ? '' : ` style="background:${p.ink}"`}>
                ${imgTag(images, p.img, p.placeholder ? '' : p.name, { sizes: '(max-width:560px) 46vw, 240px' })}
                ${p.placeholder ? '<span class="portrait-card__flag">Pending</span>' : ''}
              </div>
              <div class="portrait-card__name">${p.name}</div>
              <div class="portrait-card__role">${p.role}</div>
            </a>`).join('')}
        </div>
      </section>`;
  }).join('');
  initReveal();
}

async function main() {
  await bootstrap();
  await render();
}

main();
