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

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Copy in tools/lib/event-copy.mjs marks any claim that hasn't been
// confirmed against a source as [[? … ]]. Those render highlighted rather
// than silently passing as fact, and `node tools/verify.mjs` fails while
// any of them survive — so a draft claim can't reach go-live unnoticed.
// See the header of event-copy.mjs.
function copyHtml(text) {
  return esc(text).replace(
    /\[\[\?([\s\S]*?)\]\]/g,
    (_, inner) => `<mark class="unverified" title="Draft claim — confirm this before launch, then remove the [[? ]] markers in tools/lib/event-copy.mjs">${inner.trim()}</mark>`
  );
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

  // assets/data/galleries/<slug>.json IS the event's selection, already in
  // display order — see tools/lib/event-copy.mjs. Unselected photographs
  // aren't in the file, so there's nothing here to filter or fall back to.
  const shown = gallery;

  const facts = [
    { label: 'Date', value: formatDate(event.date) },
    { label: 'Venue', value: event.venue },
    ...(event.facts ?? []),
    { label: 'Photographs', value: `${shown.length}` }
  ];

  document.getElementById('event-root').innerHTML = `
    <section class="event-masthead">
      <div class="event-masthead__bg">${imgTag(images, event.cover, event.title, { sizes: '100vw', priority: true })}</div>
      <div class="event-masthead__scrim"></div>
      <div class="event-masthead__inner">
        <a class="event-masthead__back" href="events.html">← All events</a>
        <div class="event-masthead__kicker">${esc(event.kicker)}</div>
        <h1 class="event-masthead__title">${esc(event.title)}</h1>
        <div class="event-masthead__meta"><span>${formatDate(event.date)}</span><span>${esc(event.venue)}</span></div>
        <div class="event-masthead__tags">${event.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
      </div>
    </section>

    <div class="event-article">
      <section class="event-body">
        <p class="event-body__lede dropcap">${copyHtml(event.excerpt)}</p>
        ${renderBody(event)}
      </section>

      <aside class="event-facts" aria-label="Event details">
        <h2 class="event-facts__head">Details</h2>
        <dl class="event-facts__list">
          ${facts.map(f => `
            <div class="event-facts__row">
              <dt>${esc(f.label)}</dt>
              <dd>${copyHtml(f.value)}</dd>
            </div>`).join('')}
        </dl>
      </aside>
    </div>

    <section class="event-gallery-section">
      <div class="event-gallery-section__head">
        <h2 class="display">Gallery</h2>
        <div class="event-gallery-section__head-right">
          <span class="label-sm">${shown.length} photograph${shown.length === 1 ? '' : 's'}</span>
          <button class="btn btn--primary btn--slideshow" type="button" id="slideshow-btn">
            <span class="btn__icon" aria-hidden="true">▶</span>
            View as slideshow
          </button>
        </div>
      </div>
      <div class="event-gallery" id="event-gallery" role="list"></div>
    </section>

    <section class="event-footer-nav">
      ${prev ? `<a class="event-nav-card event-nav-card--prev" href="event.html?id=${prev.id}"><div class="event-nav-card__label">← Previous</div><div class="event-nav-card__title">${esc(prev.title)}</div></a>` : '<span></span>'}
      ${next ? `<a class="event-nav-card event-nav-card--next" href="event.html?id=${next.id}"><div class="event-nav-card__label">Next →</div><div class="event-nav-card__title">${esc(next.title)}</div></a>` : '<span></span>'}
    </section>
    <div class="event-all-events"><a class="text-link" href="events.html">All events →</a></div>
  `;

  // Fullscreen slideshow gets the largest available file plus a full
  // srcset — see img.js — rather than a fixed mid-size guess; the grid
  // thumbnail below stays a normal responsive <img> sized to its own
  // (much smaller) on-page footprint.
  //
  // Built over the same set the grid shows — grid and slideshow are two
  // views of one selection, so their indices line up directly.
  const galleryItems = shown.map(g => ({
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
  const dims = shown.map(g => {
    const meta = images[g.src];
    return { w: meta?.w ?? 900, h: meta?.h ?? 600 };
  });

  function renderFigure(_dim, i) {
    const g = shown[i];
    const fig = document.createElement('div');
    fig.className = 'gallery-item' + (g.caption ? '' : ' gallery-item--nocap');
    fig.setAttribute('role', 'listitem');
    fig.setAttribute('data-reveal', '');
    fig.innerHTML = `
      <button class="gallery-item__btn" type="button" data-gallery-trigger="${i}" aria-label="Open photograph ${i + 1} of ${shown.length} in slideshow">
        ${imgTag(images, g.src, g.caption || event.title, { sizes: '(max-width:640px) 50vw, 32vw' })}
      </button>
      ${g.caption ? `<div class="gallery-item__cap">${esc(g.caption)}</div>` : ''}
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

// Body paragraphs, with the pull quote set after the second one — far
// enough in that the reader has the argument, early enough that it still
// breaks up the column. An event with fewer paragraphs than that just
// gets the quote at the end.
function renderBody(event) {
  const paras = (event.body ?? []).filter(p => !p.startsWith('// TODO'));
  const quote = event.pullquote;
  const at = Math.min(2, paras.length);

  const html = paras.map(p => `<p class="event-body__p">${copyHtml(p)}</p>`);
  if (quote) {
    html.splice(at, 0, `
      <figure class="event-pullquote">
        <blockquote>${copyHtml(quote.text)}</blockquote>
        ${quote.source ? `<figcaption>${copyHtml(quote.source)}</figcaption>` : ''}
      </figure>`);
  }
  return html.join('');
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
