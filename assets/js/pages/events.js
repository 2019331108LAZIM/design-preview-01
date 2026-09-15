import { bootstrap, initReveal } from '../main.js';
import { loadEventImageIndex, loadCoversIndex, imgTag } from '../img.js';
import { inkTextVar } from '../ink.js';
import { EVENTS } from '../../data/events.js';
import { renderCarouselShell, initCarousels } from '../components/slider.js';

function formatDate(iso) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

async function loadGallery(id) {
  const res = await fetch(`assets/data/galleries/${id}.json`);
  return res.ok ? res.json() : [];
}

// A slide is just that event's own photograph — no per-slide title/link;
// the whole section already carries three separate links to the event page
// (first photo doubles as the dominant opening frame, title, "View event").
function slideHTML(photo, images, event) {
  return `
    <li class="carousel__slide">
      <a class="carousel__card" href="event.html?id=${event.id}" aria-label="${event.title}">
        <div class="carousel__media">${imgTag(images, photo.src, photo.caption || event.title, { sizes: '(max-width:700px) 78vw, (max-width:1100px) 46vw, 30vw' })}</div>
      </a>
    </li>`;
}

// Details (title, kicker, excerpt...) come straight from events.js — no
// fetch needed — so every section's text renders on first paint. The
// carousel starts with a single placeholder slide (the cover photo, from
// the tiny 14-entry covers index — no per-event fetch) at the same aspect
// ratio real slides use, so the section's height is already correct before
// its full gallery arrives — swapping the placeholder for the real slide
// set then causes no layout shift. Rendering all 14 sections' full
// galleries before painting anything (the previous version of this page)
// both delayed first paint until the slowest of 28 parallel fetches
// finished AND, when fixed naively by inserting empty carousels up front,
// caused a large layout shift as each one popped to its real height.
function sectionShellHTML(event, covers) {
  const placeholder = `<li class="carousel__slide"><div class="carousel__card"><div class="carousel__media">${imgTag(covers, event.cover, event.title, { sizes: '(max-width:700px) 78vw, (max-width:1100px) 46vw, 30vw' })}</div></div></li>`;
  return `
    <section class="event-section" aria-labelledby="event-title-${event.id}">
      ${renderCarouselShell(event.id, event.title, placeholder)}
      <div class="event-section__details">
        <div class="event-section__details-main">
          <span class="event-section__kicker" style="color:${inkTextVar(event.ink)}">${event.kicker}</span>
          <h2 class="event-section__title" id="event-title-${event.id}">
            <a class="event-section__title-link" href="event.html?id=${event.id}">${event.title}</a>
          </h2>
          <div class="event-section__meta"><span>${formatDate(event.date)}</span><span>${event.venue}</span><span>${event.galleryCount} photographs</span></div>
          <p class="event-section__excerpt">${event.excerpt}</p>
        </div>
        <a class="text-link event-section__view" href="event.html?id=${event.id}">View event →</a>
      </div>
    </section>`;
}

async function fillSection(event) {
  const [images, gallery] = await Promise.all([loadEventImageIndex(event.id), loadGallery(event.id)]);
  const photos = gallery.length ? gallery : [{ src: event.cover, caption: '' }];
  const track = document.getElementById(`${event.id}-track`);
  if (!track) return;
  track.innerHTML = photos.map(g => slideHTML(g, images, event)).join('');
  initCarousels(); // first real init for this section (the placeholder phase never called this) — guarded against re-running on already-wired carousels elsewhere on the page
}

async function main() {
  const [, covers] = await Promise.all([bootstrap(), loadCoversIndex()]);

  document.getElementById('event-sections').innerHTML = EVENTS.map(e => sectionShellHTML(e, covers)).join('');
  initReveal();

  // Each section fills in independently as its own (larger) gallery data
  // arrives, instead of every section waiting on the slowest of all 14.
  // Deferred a tick past first paint (the page is already complete and
  // correctly laid out with cover photos at this point — see
  // sectionShellHTML) so these 28 requests don't queue ahead of the
  // render-blocking CSS a fresh navigation is still fetching.
  // setTimeout, not requestAnimationFrame: rAF callbacks can be held
  // indefinitely on a backgrounded/inactive tab (e.g. a link opened in a
  // background tab), which would leave every gallery stuck on its
  // placeholder — this is core content, not an optional enhancement.
  setTimeout(() => { EVENTS.forEach(fillSection); }, 0);
}

main();
