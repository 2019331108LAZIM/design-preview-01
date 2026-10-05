import { bootstrap, initReveal } from '../main.js';
import { loadImageIndex, loadCoversIndex, loadEventImageIndex, imgTag } from '../img.js';
import { MISSION, HOME_STATS, ARCHIVE_STRIP, NEWS } from '../../data/site.js';
import { BOARD } from '../../data/board.js';
import { INITS, INIT_ORDER } from '../../data/initiatives.js';
import { SERIES } from '../../data/series.js';
import { EVENTS } from '../../data/events.js';
import { renderCarouselShell, initCarousels } from '../components/slider.js';

// The hero <video> ships with no <source> children in the HTML — a
// declarative <source src="…missing.mp4"> triggers the browser's own
// resource-load 404 (visible in the console, and worse, Lighthouse treats
// the still-loading <video> as the LCP candidate until it gives up, which
// tanked LCP to 4.4s when that only happened on an arbitrary timeout).
// Instead: a plain fetch() HEAD check resolves in one round trip, doesn't
// log a console error on 404 (unlike a declarative resource load), and the
// CSS-driven Ken Burns fallback is the real LCP element from first paint
// whenever the video isn't there.
async function setupHero() {
  const hero = document.getElementById('hero');
  const video = hero.querySelector('[data-hero-video]');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // The CSS fallback (Ken Burns still, filtered to match) is the default,
  // already-visible state. This only has work to do when a video genuinely
  // takes over — nothing to do on failure, the fallback is already showing.
  if (reduce || !video.canPlayType) return;

  let ok = false;
  try {
    const res = await fetch('assets/video/hero.mp4', { method: 'HEAD' });
    ok = res.ok;
  } catch { /* offline or blocked */ }
  if (!ok) return;

  const type = video.canPlayType('video/webm') ? 'webm' : 'mp4';
  const source = document.createElement('source');
  source.src = `assets/video/hero.${type}`;
  source.type = `video/${type}`;
  video.appendChild(source);
  video.addEventListener('playing', () => hero.classList.add('hero--video-playing'), { once: true });
  video.load();
  video.play?.().catch(() => {});
}

function renderMission() {
  document.getElementById('mission-lead').textContent = MISSION.lead;
  document.getElementById('mission-body').textContent = MISSION.body;
}

function renderStats() {
  document.getElementById('home-stats').innerHTML = HOME_STATS.map(s => `
    <div class="stat-row"><span class="stat-row__n">${s.n}</span><span class="stat-row__label">${s.label}</span></div>
  `).join('');
}

function renderArchive(images) {
  document.getElementById('archive-scroller').innerHTML = ARCHIVE_STRIP.map((a, i) => `
    <figure class="archive-card" data-reveal>
      <div class="archive-card__frame">${imgTag(images, a.src, a.cap, { sizes: '300px' })}</div>
      <figcaption><span class="archive-card__year">${a.year}</span>${a.cap}</figcaption>
    </figure>
  `).join('');
}

function renderInitiatives(images) {
  const spans = { gallery: 'span-7 init-card--tall', atelier: 'span-5 init-card--tall', wild: 'span-5', bobi: 'span-7' };
  document.getElementById('initiatives-cards').innerHTML = INIT_ORDER.map(key => {
    const init = INITS[key];
    return `
      <a class="init-card ${spans[key]}" href="initiative.html?id=${init.key}" data-reveal>
        <div class="init-card__bg">${imgTag(images, init.hero, init.name, { sizes: '(max-width:900px) 100vw, 50vw' })}</div>
        <div class="init-card__scrim"></div>
        <div class="init-card__content">
          <span class="init-card__eyebrow">${init.eyebrow}</span>
          <h3 class="init-card__title">${init.name}</h3>
          <p class="init-card__dek">${init.tagline}</p>
        </div>
      </a>`;
  }).join('');
}

function renderSpeakers(images) {
  document.getElementById('speakers-scroller').innerHTML = SERIES.speakers.people.slice(0, 6).map(p => `
    <a class="speaker-card" href="speakers.html" data-reveal>
      <div class="speaker-card__frame">${imgTag(images, p.img, p.name, { sizes: '240px' })}</div>
      <div class="speaker-card__name">${p.name}</div>
      <div class="speaker-card__role">${p.role}</div>
    </a>
  `).join('');
}

function renderBoardTeaser(images) {
  // Prefer members whose names are confirmed. The board roster is largely
  // placeholder while the new list is awaited (see assets/data/board.js),
  // and a homepage teaser reading "Name to be confirmed" three times would
  // be a poor front door — the full, honestly-marked roster is one click
  // away on the board page. Falls back to placeholders only if there
  // aren't three confirmed names.
  const named = BOARD.filter(p => !p.placeholder);
  const teaser = [...named, ...BOARD.filter(p => p.placeholder)].slice(0, 3);
  document.getElementById('board-teaser').innerHTML = teaser.map(p => `
    <a class="portrait-card${p.placeholder ? ' portrait-card--placeholder' : ''}" href="board-member.html?id=${p.id}" data-reveal>
      <div class="portrait-card__frame">${imgTag(images, p.img, p.placeholder ? '' : p.name, { sizes: '(max-width:560px) 46vw, 200px' })}</div>
      <div class="portrait-card__name">${p.name}</div>
      <div class="portrait-card__role">${p.role}</div>
    </a>
  `).join('');
}

function renderNews(images) {
  document.getElementById('news-cards').innerHTML = NEWS.map(n => `
    <article class="card" data-reveal>
      <div class="card__media">${imgTag(images, n.img, n.title, { sizes: '(max-width:700px) 100vw, 320px' })}</div>
      <div class="card__body">
        <div class="card__meta"><span class="${n.tagClass}">${n.tag}</span><span class="label-sm" style="color:var(--ink3)">${new Date(n.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
        <h3 class="card__title">${n.title}</h3>
        <p class="card__dek">${n.dek}</p>
      </div>
    </article>
  `).join('');
}

// A slide is just that event's own photograph, linking straight into its
// event page — same pattern as events.html's per-event sections
// (assets/js/pages/events.js), just reused here at card width.
function recentEventSlideHTML(photo, images, event) {
  return `
    <li class="carousel__slide">
      <a class="carousel__card" href="event.html?id=${event.id}" aria-label="${event.title}">
        <div class="carousel__media">${imgTag(images, photo.src, photo.caption || event.title, { sizes: '(max-width:560px) 90vw, 320px' })}</div>
      </a>
    </li>`;
}

// Renders instantly with just the cover photo (already-loaded covers
// index, no extra fetch) as a single placeholder slide at the same aspect
// ratio real slides use, so first paint is immediate and CLS-safe; the
// full per-event gallery swaps in moments later — see fillRecentEventCard.
function recentEventCardShellHTML(event, covers) {
  const placeholder = `
    <li class="carousel__slide">
      <a class="carousel__card" href="event.html?id=${event.id}" aria-label="${event.title}">
        <div class="carousel__media">${imgTag(covers, event.cover, event.title, { sizes: '(max-width:560px) 90vw, 320px' })}</div>
      </a>
    </li>`;
  return `
    <article class="card" data-reveal>
      <div class="card__media card__media--carousel">${renderCarouselShell(`${event.id}-home`, event.title, placeholder)}</div>
      <div class="card__body">
        <div class="card__meta"><span class="tag">${event.kicker}</span><span class="label-sm" style="color:var(--ink3)">${new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
        <h3 class="card__title"><a href="event.html?id=${event.id}" style="color:inherit">${event.title}</a></h3>
        <p class="card__dek">${event.excerpt}</p>
      </div>
    </article>`;
}

async function fillRecentEventCard(event) {
  const [images, res] = await Promise.all([
    loadEventImageIndex(event.id),
    fetch(`assets/data/galleries/${event.id}.json`)
  ]);
  const gallery = res.ok ? await res.json() : [];
  // The gallery file is the event's selection, already in display order —
  // the same set the events page and the event's own gallery show.
  const photos = gallery;
  const track = document.getElementById(`${event.id}-home-track`);
  if (!track) return;
  track.innerHTML = photos.map(g => recentEventSlideHTML(g, images, event)).join('');
  initCarousels();
}

async function renderRecentEvents() {
  const covers = await loadCoversIndex();
  const recent = EVENTS.slice(0, 3); // EVENTS is already sorted by date descending
  document.getElementById('recent-events-cards').innerHTML = recent.map(e => recentEventCardShellHTML(e, covers)).join('');
  initCarousels();
  // Deferred a tick past first paint, same reasoning as events.js: the
  // section is already complete and correctly laid out with cover photos
  // at this point, so these 3 gallery fetches shouldn't queue ahead of the
  // rest of the homepage's own render-blocking work.
  setTimeout(() => { recent.forEach(fillRecentEventCard); }, 0);
}

async function main() {
  setupHero();
  renderMission();
  renderStats();
  await bootstrap();
  const images = await loadImageIndex();
  renderArchive(images);
  renderInitiatives(images);
  renderSpeakers(images);
  renderBoardTeaser(images);
  renderNews(images);
  await renderRecentEvents();
  initReveal();
}

main();
