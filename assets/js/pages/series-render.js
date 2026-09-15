import { bootstrap, initReveal } from '../main.js';
import { loadImageIndex, imgTag } from '../img.js';
import { inkTextVar } from '../ink.js';
import { SERIES } from '../../data/series.js';

export async function renderSeriesPage(key, crossLink) {
  await bootstrap();
  const images = await loadImageIndex();
  const series = SERIES[key];
  document.documentElement.style.setProperty('--series-ink', series.ink);
  document.documentElement.style.setProperty('--series-ink-ui', inkTextVar(series.ink));

  document.getElementById('series-root').innerHTML = `
    <section class="series-hero">
      <div class="series-hero__wash" aria-hidden="true"></div>
      <div class="series-hero__grain" aria-hidden="true"></div>
      <div class="series-hero__inner">
        <div data-reveal>
          <div class="eyebrow">${series.eyebrow}</div>
          <h1 class="series-hero__title">${series.title}</h1>
          <p class="series-hero__dek">${series.dek}</p>
        </div>
        <div class="series-stats" data-reveal>
          ${series.stats.map(s => `<div class="series-stat"><span class="series-stat__n">${s.n}</span><span class="series-stat__label">${s.label}</span></div>`).join('')}
        </div>
      </div>
    </section>
    <div class="series-cross-link"><a class="text-link" href="${crossLink.href}">${crossLink.label} →</a></div>
    <section class="series-list" id="series-list" role="list"></section>
  `;

  document.getElementById('series-list').innerHTML = series.people.map((p, i) => `
    <article class="series-row" role="listitem" data-reveal>
      <div class="series-row__index">${String(i + 1).padStart(2, '0')}</div>
      <div class="series-row__frame">${imgTag(images, p.img, p.name, { sizes: '100px' })}</div>
      <div>
        <div class="series-row__name">${p.name}</div>
        <div class="series-row__role">${p.role}</div>
        <div class="series-row__talk">“${p.talk}”</div>
        <span class="series-row__badge">${p.date}</span>
      </div>
    </article>
  `).join('');

  initReveal();
}
