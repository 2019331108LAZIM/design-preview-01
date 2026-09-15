import { bootstrap, initReveal } from '../main.js';
import { loadImageIndex, imgTag, inlineSvg } from '../img.js';
import { INITS, INIT_ORDER } from '../../data/initiatives.js';

function getId() {
  return new URLSearchParams(location.search).get('id');
}

async function render(init, images) {
  const mark = await inlineSvg(init.logo, { ariaLabel: `${init.name} mark` });
  document.getElementById('initiative-root').innerHTML = `
    <section class="init-hero" style="background:${init.ink}">
      <div class="init-hero__bg">${imgTag(images, init.hero, init.name, { sizes: '100vw', priority: true })}</div>
      <div class="init-hero__scrim"></div>
      <div class="init-hero__inner">
        <div class="init-hero__logo-plate">${mark}</div>
        <div class="init-hero__eyebrow">${init.eyebrow}</div>
        <h1 class="init-hero__title">${init.name}</h1>
        <p class="init-hero__tagline">${init.tagline}</p>
      </div>
    </section>

    <section class="init-body">
      <div>
        <p class="init-body__p1">${init.p1}</p>
        ${init.p2 ? `<p class="init-body__p">${init.p2}</p>` : ''}
      </div>
      <aside class="fact-panel">
        <div class="fact-row__k" style="margin-bottom:6px">At a glance</div>
        ${init.facts.map(f => `<div class="fact-row"><div class="fact-row__k">${f.k}</div><div class="fact-row__v">${f.v}</div></div>`).join('')}
        <a class="btn btn--primary btn--block" style="margin-top:22px" href="contact.html">Get in touch</a>
      </aside>
    </section>

    <section class="init-gallery-section">
      <div class="init-gallery-section__head">
        <h2 class="display">${init.galleryTitle}</h2>
        <span class="label-sm">Scroll →</span>
      </div>
      <div class="init-gallery-scroller" data-scroller="1" id="init-gallery"></div>
    </section>

    <section class="init-strip-section">
      <div class="init-strip-section__head">Part of Cosmos Foundation</div>
      <div class="init-strip-grid" id="init-strip"></div>
    </section>
  `;

  document.getElementById('init-gallery').innerHTML = init.gallery.map(g => `
    <figure class="init-gallery-item" data-reveal>
      <div class="init-gallery-item__frame" style="background:${init.ink}">${imgTag(images, g.src, g.cap, { sizes: '300px' })}</div>
      <figcaption>${g.cap}</figcaption>
    </figure>
  `).join('');

  const others = INIT_ORDER.filter(k => k !== init.key).map(k => INITS[k]);
  document.getElementById('init-strip').innerHTML = others.map(o => `
    <a class="init-strip-card" href="initiative.html?id=${o.key}" style="border-top:3px solid ${o.ink}">
      <div class="init-strip-card__name">${o.name}</div>
      <div class="init-strip-card__line">${o.eyebrow}</div>
    </a>
  `).join('');

  document.getElementById('doc-title').textContent = `${init.name} — Cosmos Foundation`;
  document.getElementById('meta-desc').setAttribute('content', init.tagline);
  document.getElementById('canonical').setAttribute('href', `https://www.cosmosfoundationbd.org/initiative.html?id=${init.key}`);
  document.getElementById('og-title').setAttribute('content', `${init.name} — Cosmos Foundation`);
  document.getElementById('og-desc').setAttribute('content', init.tagline);
  document.getElementById('og-url').setAttribute('content', `https://www.cosmosfoundationbd.org/initiative.html?id=${init.key}`);

  initReveal();
}

async function main() {
  await bootstrap();
  const images = await loadImageIndex();
  const id = getId();
  const init = INITS[id];
  if (!init) {
    document.getElementById('initiative-not-found').hidden = false;
    document.getElementById('doc-title').textContent = 'Initiative not found — Cosmos Foundation';
    return;
  }
  await render(init, images);
}

main();
