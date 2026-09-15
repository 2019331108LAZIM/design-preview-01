// Full-screen gallery lightbox — a singleton reused across every trigger on
// the page. Call openLightbox(items, startIndex, triggerEl) where each item
// is { src, alt, caption, credit }.

let root = null;
let imgEl, counterEl, captionEl, creditEl, playBtn, closeBtn, prevBtn, nextBtn;
let list = [];
let index = 0;
let playing = false;
let autoplayTimer = null;
let lastFocused = null;

const AUTOPLAY_MS = 4000;
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function build() {
  root = document.createElement('div');
  root.className = 'lightbox';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Image gallery viewer');
  root.innerHTML = `
    <div class="lightbox__bar">
      <span class="lightbox__counter" data-lb-counter></span>
      <div class="lightbox__actions">
        <button class="lightbox__btn" type="button" data-lb-play aria-label="Pause slideshow">&#10074;&#10074;</button>
        <button class="lightbox__btn" type="button" data-lb-close aria-label="Close gallery">&#10005;</button>
      </div>
    </div>
    <div class="lightbox__stage">
      <button class="lightbox__arrow lightbox__arrow--prev" type="button" data-lb-prev aria-label="Previous image">&#8249;</button>
      <img class="lightbox__img" data-lb-img alt="">
      <button class="lightbox__arrow lightbox__arrow--next" type="button" data-lb-next aria-label="Next image">&#8250;</button>
    </div>
    <div class="lightbox__caption">
      <div class="lightbox__caption-text" data-lb-caption></div>
      <div class="lightbox__credit" data-lb-credit></div>
    </div>`;
  document.body.appendChild(root);

  imgEl = root.querySelector('[data-lb-img]');
  counterEl = root.querySelector('[data-lb-counter]');
  captionEl = root.querySelector('[data-lb-caption]');
  creditEl = root.querySelector('[data-lb-credit]');
  playBtn = root.querySelector('[data-lb-play]');
  closeBtn = root.querySelector('[data-lb-close]');
  prevBtn = root.querySelector('[data-lb-prev]');
  nextBtn = root.querySelector('[data-lb-next]');

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => show(index - 1, { manual: true }));
  nextBtn.addEventListener('click', () => show(index + 1, { manual: true }));
  playBtn.addEventListener('click', togglePlay);

  document.addEventListener('keydown', onKeydown);

  let touchStartX = null;
  root.querySelector('.lightbox__stage').addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  root.querySelector('.lightbox__stage').addEventListener('touchend', e => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1), { manual: true });
    touchStartX = null;
  });
}

function onKeydown(e) {
  if (!root || !root.classList.contains('is-open')) return;
  if (e.key === 'Escape') { closeLightbox(); return; }
  if (e.key === 'ArrowLeft') { show(index - 1, { manual: true }); return; }
  if (e.key === 'ArrowRight') { show(index + 1, { manual: true }); return; }
  if (e.key === ' ') { e.preventDefault(); togglePlay(); return; }
  if (e.key === 'Tab') {
    const focusables = [prevBtn, nextBtn, playBtn, closeBtn];
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
}

function preload(i) {
  for (const offset of [1, 2]) {
    const item = list[(i + offset) % list.length];
    if (!item) continue;
    const im = new Image();
    if (item.srcset) { im.sizes = '100vw'; im.srcset = item.srcset; }
    im.src = item.src;
  }
}

function show(i, { manual = false } = {}) {
  index = (i + list.length) % list.length;
  const item = list[index];
  imgEl.src = item.src;
  // item.srcset (largest-first) lets the browser pick the right file for
  // this screen's actual size + DPR — a phone doesn't fetch the 1920w
  // master just because the overlay is "fullscreen", but a large desktop
  // display gets the full-resolution file rather than a fixed mid-size
  // guess. src above is the fallback for the (now vanishingly rare)
  // browser without srcset support.
  if (item.srcset) { imgEl.srcset = item.srcset; imgEl.sizes = '100vw'; }
  else { imgEl.removeAttribute('srcset'); imgEl.removeAttribute('sizes'); }
  imgEl.alt = item.alt ?? '';
  captionEl.textContent = item.caption || '';
  creditEl.textContent = item.credit || '';
  counterEl.textContent = `${String(index + 1).padStart(2, '0')} / ${String(list.length).padStart(2, '0')}`;
  preload(index);
  if (manual) restartAutoplayIfPlaying();
}

function togglePlay() {
  playing = !playing;
  playBtn.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow');
  playBtn.innerHTML = playing ? '&#10074;&#10074;' : '&#9654;';
  if (playing) startAutoplay(); else stopAutoplay();
}

function startAutoplay() {
  stopAutoplay();
  if (reduceMotion()) return;
  autoplayTimer = window.setInterval(() => show(index + 1), AUTOPLAY_MS);
}
function stopAutoplay() {
  if (autoplayTimer) { window.clearInterval(autoplayTimer); autoplayTimer = null; }
}
function restartAutoplayIfPlaying() {
  if (playing) startAutoplay();
}

export function openLightbox(items, startIndex = 0, triggerEl = null) {
  if (!root) build();
  list = items;
  lastFocused = triggerEl ?? document.activeElement;
  root.classList.add('is-open');
  document.body.classList.add('lightbox-lock');
  playing = false;
  playBtn.innerHTML = '&#9654;';
  playBtn.setAttribute('aria-label', 'Play slideshow');
  show(startIndex, { manual: false });
  closeBtn.focus();
}

export function closeLightbox() {
  if (!root || !root.classList.contains('is-open')) return;
  root.classList.remove('is-open');
  document.body.classList.remove('lightbox-lock');
  stopAutoplay();
  if (lastFocused instanceof HTMLElement) lastFocused.focus();
}

/**
 * Wires up a set of gallery trigger elements (e.g. thumbnail buttons) to
 * open the lightbox at their index. `getItems()` is called lazily on first
 * open so callers can build the list once images are resolved.
 */
export function wireGalleryTriggers(triggers, getItems) {
  triggers.forEach((el, i) => {
    el.addEventListener('click', () => openLightbox(getItems(), i, el));
  });
}
