import { bootstrap, initReveal } from '../main.js';
import { loadEventImageIndex, imgTag, imgSrc, imgLargestSrc, imgSrcset } from '../img.js';
import { EVENTS } from '../../data/events.js';
import { openLightbox } from '../components/lightbox.js';
import { renderJustifiedGallery } from '../components/gallery.js';

function getId() {
  return new URLSearchParams(location.search).get('id');
}

function formatDate(iso) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

// No more category sections — "previous"/"next" just walks EVENTS, which
// is already sorted by date descending (so "next" is the next-most-recent
// occasion, "previous" the one before it chronologically).
function findNeighbours(event) {
  const idx = EVENTS.findIndex(e => e.id === event.id);
  return {
    prev: EVENTS[idx - 1] ?? null,
    next: EVENTS[idx + 1] ?? null
  };
}

async function loadGallery(id) {
  const res = await fetch(`assets/data/galleries/${id}.json`);
  return res.ok ? res.json() : [];
}

async function render(event, images, gallery) {
  const { prev, next } = findNeighbours(event);

  document.getElementById('event-root').innerHTML = `
    <section class="event-masthead">
      <div class="event-masthead__bg">${imgTag(images, event.cover, event.title, { sizes: '100vw', priority: true })}</div>
      <div class="event-masthead__scrim"></div>
      <div class="event-masthead__inner">
        <a class="event-masthead__back" href="events.html">← All events</a>
        <div class="event-masthead__kicker">${event.kicker}</div>
        <h1 class="event-masthead__title">${event.title}</h1>
        <div class="event-masthead__meta"><span>${formatDate(event.date)}</span><span>${event.venue}</span></div>
        <div class="event-masthead__tags">${event.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      </div>
    </section>

    <section class="event-body">
      <p class="event-body__lede dropcap">${event.excerpt}</p>
      ${event.body.filter(p => !p.startsWith('// TODO')).map(p => `<p class="event-body__p">${p}</p>`).join('')}
    </section>

    <section class="event-gallery-section">
      <div class="event-gallery-section__head">
        <h2 class="display">Gallery</h2>
        <div class="event-gallery-section__head-right">
          <span class="label-sm">${gallery.length} photographs</span>
          <button class="btn btn--outline btn--sm" type="button" id="slideshow-btn">View as slideshow</button>
        </div>
      </div>
      <div class="event-gallery" id="event-gallery" role="list"></div>
    </section>

    <section class="event-footer-nav">
      ${prev ? `<a class="event-nav-card event-nav-card--prev" href="event.html?id=${prev.id}"><div class="event-nav-card__label">← Previous</div><div class="event-nav-card__title">${prev.title}</div></a>` : '<span></span>'}
      ${next ? `<a class="event-nav-card event-nav-card--next" href="event.html?id=${next.id}"><div class="event-nav-card__label">Next →</div><div class="event-nav-card__title">${next.title}</div></a>` : '<span></span>'}
    </section>
    <div class="event-all-events"><a class="text-link" href="events.html">All events →</a></div>
  `;

  // Fullscreen slideshow gets the largest available file plus a full
  // srcset — see img.js — rather than a fixed mid-size guess; the grid
  // thumbnail below stays a normal responsive <img> sized to its own
  // (much smaller) on-page footprint.
  const galleryItems = gallery.map(g => ({
    src: imgLargestSrc(images, g.src),
    srcset: imgSrcset(images, g.src),
    alt: g.caption || event.title,
    caption: g.caption,
    credit: g.credit
  }));

  // Real intrinsic width/height per photo (already known from the image
  // pipeline) drives the justified layout below — falls back to a 3:2
  // ratio only for the (should-never-happen) case of a gallery photo
  // missing from the image index.
  const dims = gallery.map(g => {
    const meta = images[g.src];
    return { w: meta?.w ?? 900, h: meta?.h ?? 600 };
  });

  function renderFigure(_dim, i) {
    const g = gallery[i];
    const fig = document.createElement('div');
    fig.className = 'gallery-item';
    fig.setAttribute('role', 'listitem');
    fig.setAttribute('data-reveal', '');
    fig.innerHTML = `
      <button class="gallery-item__btn" type="button" data-gallery-trigger="${i}" aria-label="Open photograph ${i + 1} of ${gallery.length} in slideshow">
        ${imgTag(images, g.src, g.caption || event.title, { sizes: '(max-width:640px) 50vw, 32vw' })}
      </button>
      <div class="gallery-item__cap">${g.caption || ''}</div>
    `;
    return fig;
  }

  renderJustifiedGallery(document.getElementById('event-gallery'), dims, renderFigure);

  document.querySelectorAll('[data-gallery-trigger]').forEach(btn => {
    btn.addEventListener('click', () => openLightbox(galleryItems, Number(btn.dataset.galleryTrigger), btn));
  });
  document.getElementById('slideshow-btn').addEventListener('click', e => openLightbox(galleryItems, 0, e.currentTarget));

  document.getElementById('doc-title').textContent = `${event.title} — Cosmos Foundation`;
  document.getElementById('meta-desc').setAttribute('content', event.excerpt);
  document.getElementById('canonical').setAttribute('href', `https://www.cosmosfoundationbd.org/event.html?id=${event.id}`);
  document.getElementById('og-title').setAttribute('content', `${event.title} — Cosmos Foundation`);
  document.getElementById('og-desc').setAttribute('content', event.excerpt);
  document.getElementById('og-url').setAttribute('content', `https://www.cosmosfoundationbd.org/event.html?id=${event.id}`);
  const ogImg = document.getElementById('og-image');
  if (ogImg) ogImg.setAttribute('content', imgSrc(images, event.cover, 1440));

  initReveal();
}

async function main() {
  await bootstrap();
  const id = getId();
  const event = EVENTS.find(e => e.id === id);
  if (!event) {
    document.getElementById('event-not-found').hidden = false;
    document.getElementById('doc-title').textContent = 'Event not found — Cosmos Foundation';
    return;
  }
  const [images, gallery] = await Promise.all([loadEventImageIndex(id), loadGallery(id)]);
  await render(event, images, gallery);
}

main();
