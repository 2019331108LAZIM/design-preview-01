// Generic carousel: CSS scroll-snap does the scrolling/touch/trackpad work,
// this file only supplies autoplay, manual controls, keyboard, a desktop
// mouse-drag affordance (touch already gets native drag from the browser),
// and the accessibility wiring the brief calls for.
//
// Expected markup (see renderCarouselShell below):
//   <section class="carousel" data-carousel aria-roledescription="carousel">
//     <div class="carousel__viewport" data-carousel-viewport>
//       <ul class="carousel__track" data-carousel-track>...slides...</ul>
//     </div>
//     <div class="carousel__controls">
//       <button data-carousel-prev>...</button>
//       <div class="carousel__dots" data-carousel-dots></div>
//       <button data-carousel-next>...</button>
//     </div>
//     <div class="sr-only" data-carousel-status aria-live="polite"></div>
//   </section>

const AUTOPLAY_MS = 2000;
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function renderCarouselShell(id, ariaLabel, slidesHTML) {
  return `
    <div class="carousel" data-carousel role="region" aria-roledescription="carousel" aria-label="${ariaLabel}">
      <div class="carousel__viewport" data-carousel-viewport>
        <ul class="carousel__track" data-carousel-track id="${id}-track">${slidesHTML}</ul>
      </div>
      <div class="carousel__controls">
        <button class="carousel__arrow carousel__arrow--prev" type="button" data-carousel-prev aria-label="Previous slide">‹</button>
        <div class="carousel__dots" data-carousel-dots></div>
        <button class="carousel__arrow carousel__arrow--next" type="button" data-carousel-next aria-label="Next slide">›</button>
      </div>
      <div class="sr-only" data-carousel-status aria-live="polite"></div>
    </div>`;
}

function slideTargetLeft(viewport, slide) {
  const vpRect = viewport.getBoundingClientRect();
  const slRect = slide.getBoundingClientRect();
  const delta = (slRect.left + slRect.width / 2) - (vpRect.left + vpRect.width / 2);
  return viewport.scrollLeft + delta;
}

function initOne(root) {
  // Guards against double-*initializing* (attaching a second set of
  // listeners) — but a carousel that only ever saw 0 or 1 slides (events.html
  // starts every section with a single placeholder slide, then swaps in the
  // real gallery once it loads — see assets/js/pages/events.js) hasn't
  // actually been initialized yet, so it must NOT be marked done here, or
  // the later call with the real slide set would be a no-op forever.
  if (root.dataset.carouselInit) return;
  const viewport = root.querySelector('[data-carousel-viewport]');
  const track = root.querySelector('[data-carousel-track]');
  const prevBtn = root.querySelector('[data-carousel-prev]');
  const nextBtn = root.querySelector('[data-carousel-next]');
  const dotsWrap = root.querySelector('[data-carousel-dots]');
  const status = root.querySelector('[data-carousel-status]');
  const slides = Array.from(track.children);
  if (!slides.length) return;

  root.classList.remove('carousel--single');
  if (slides.length === 1) {
    root.classList.add('carousel--single');
    return;
  }
  root.dataset.carouselInit = '1';

  let index = 0;
  let autoplayTimer = null;
  let isPointerDown = false;
  let pointerMoved = false;
  // Set for the duration of our own animateScrollTo() run, so the native
  // 'scroll' listener below (tracking drags/trackpad/touch) doesn't fight
  // it — without this, a large gallery's index could visibly flicker
  // mid-transition as the animation scrolls past intermediate slides, and
  // occasionally settle on the wrong one once the animation and the
  // scroll-driven sync raced to update `index` in the wrong order.
  let programmaticScroll = false;

  // A dot per slide stops being usable — and stops fitting on one row —
  // well before an event's full gallery (up to 170+ photos) does. Past
  // DOTS_MAX, show a compact "N / total" counter instead; either way the
  // controls row is a single fixed-height element, never zero-then-tall,
  // which matters on events.html where a carousel starts with one
  // placeholder slide (no controls needed yet) and is filled in moments
  // later with the real gallery — a growing dot strip was a real,
  // measured layout-shift source there.
  const DOTS_MAX = 12;
  const useDots = slides.length <= DOTS_MAX;
  let counterEl = null;
  if (useDots) {
    dotsWrap.setAttribute('role', 'tablist');
    dotsWrap.setAttribute('aria-label', 'Slides');
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel__dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to slide ${i + 1} of ${slides.length}`);
      dot.addEventListener('click', () => { goTo(i, { manual: true }); });
      dotsWrap.appendChild(dot);
    });
  } else {
    counterEl = document.createElement('span');
    counterEl.className = 'carousel__counter';
    counterEl.setAttribute('aria-hidden', 'true'); // decorative — the aria-live status region already announces slide changes
    dotsWrap.appendChild(counterEl);
  }
  const dots = Array.from(dotsWrap.querySelectorAll('.carousel__dot'));

  function announce(i) {
    const title = slides[i].querySelector('[data-slide-title]')?.textContent ?? '';
    status.textContent = `Slide ${i + 1} of ${slides.length}${title ? `: ${title}` : ''}`;
  }

  function updateUI(i) {
    dots.forEach((d, di) => d.setAttribute('aria-current', String(di === i)));
    if (counterEl) counterEl.textContent = `${i + 1} / ${slides.length}`;
    prevBtn.disabled = false;
    nextBtn.disabled = false;
  }

  // A fixed-duration eased scroll, not the browser's native
  // scrollTo({behavior:'smooth'}) — native smooth-scroll duration is
  // UA-determined (and tends to feel slow/inconsistent on a wide slide),
  // and it fires 'scroll' events all the way through the animation, which
  // is exactly what made the old IntersectionObserver-based index tracking
  // race against a manual/autoplay transition. ~320ms reads as snappy
  // without being an abrupt cut.
  let scrollAnimFrame = null;
  let scrollAnimFallback = null;
  function animateScrollTo(target, duration = 320) {
    if (scrollAnimFrame) cancelAnimationFrame(scrollAnimFrame);
    if (scrollAnimFallback) clearTimeout(scrollAnimFallback);
    const start = viewport.scrollLeft;
    const distance = target - start;
    if (Math.abs(distance) < 1) { programmaticScroll = false; return; }
    const startTime = performance.now();
    programmaticScroll = true;
    // Same reason the drag handler below turns this off while it writes
    // scrollLeft directly: with scroll-snap-type: x mandatory left on, the
    // browser tries to snap mid-animation against our own frame-by-frame
    // writes, which is fighting, not motion.
    viewport.style.scrollSnapType = 'none';
    function finish() {
      scrollAnimFrame = null;
      if (scrollAnimFallback) { clearTimeout(scrollAnimFallback); scrollAnimFallback = null; }
      viewport.scrollLeft = target;
      programmaticScroll = false;
      viewport.style.scrollSnapType = '';
    }
    function step(now) {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - (1 - t) ** 3; // ease-out cubic
      viewport.scrollLeft = start + distance * eased;
      if (t < 1) scrollAnimFrame = requestAnimationFrame(step);
      else finish();
    }
    scrollAnimFrame = requestAnimationFrame(step);
    // rAF is spec-throttled to never fire on a hidden/backgrounded tab (and
    // some browsers throttle it more aggressively still) — without this,
    // a transition that starts right as the tab backgrounds would leave
    // `index`/the counter already pointing at the new slide (updateUI runs
    // synchronously below, not gated by rAF) while the visible scroll
    // position stays wherever the animation froze, permanently out of
    // sync. A plain timer isn't subject to the same throttling, so it's
    // guaranteed to land on the correct final position even if every
    // animation frame in between got skipped.
    scrollAnimFallback = window.setTimeout(finish, duration + 120);
  }

  function goTo(i, { manual = false, smooth = true } = {}) {
    index = (i + slides.length) % slides.length;
    const target = slideTargetLeft(viewport, slides[index]);
    if (smooth && !reduceMotion()) {
      animateScrollTo(target);
    } else {
      if (scrollAnimFrame) { cancelAnimationFrame(scrollAnimFrame); scrollAnimFrame = null; }
      programmaticScroll = false;
      viewport.scrollLeft = target;
    }
    updateUI(index);
    if (manual) announce(index);
  }

  prevBtn.addEventListener('click', () => goTo(index - 1, { manual: true }));
  nextBtn.addEventListener('click', () => goTo(index + 1, { manual: true }));

  root.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1, { manual: true }); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1, { manual: true }); }
  });

  // Track which slide is most visible, so dots/index stay in sync with
  // native scroll-snap dragging/trackpad/touch scrolling (not just button
  // clicks) — a debounced scroll-end check against each slide's own
  // position, not a per-slide IntersectionObserver. A gallery here can run
  // to 170+ photos, and 170+ observed targets × up to 14 carousels on one
  // page (events.html) was real, measured overhead for what only ever
  // needs to run once scrolling actually stops; it also only reacts to
  // genuine user-driven scrolling, since programmaticScroll is true for
  // the whole span of our own animateScrollTo() run above.
  let scrollEndTimer = null;
  function syncIndexFromScroll() {
    const vpRect = viewport.getBoundingClientRect();
    const vpCenter = vpRect.left + vpRect.width / 2;
    let closest = index, closestDist = Infinity;
    slides.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const dist = Math.abs((r.left + r.width / 2) - vpCenter);
      if (dist < closestDist) { closestDist = dist; closest = i; }
    });
    if (closest !== index) { index = closest; updateUI(index); }
  }
  viewport.addEventListener('scroll', () => {
    if (programmaticScroll) return;
    if (scrollEndTimer) clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(syncIndexFromScroll, 120);
  }, { passive: true });

  // Desktop mouse drag-to-scroll (touch/trackpad already scroll natively).
  // Deliberately NOT using setPointerCapture: capturing the pointer on the
  // viewport can intercept the subsequent click before it ever reaches a
  // slide's <a>, which is exactly the "looks clickable but isn't" bug this
  // component must not have. Move/up listeners live on the document instead
  // (standard drag pattern), added only while a drag is actually in
  // progress, so a plain click never touches this machinery at all.
  let dragStartX = 0;
  let dragStartScroll = 0;

  function onPointerMove(e) {
    const dx = e.clientX - dragStartX;
    if (Math.abs(dx) > 6) pointerMoved = true;
    viewport.scrollLeft = dragStartScroll - dx;
  }
  function onPointerUp() {
    isPointerDown = false;
    viewport.style.scrollSnapType = '';
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
  }
  viewport.addEventListener('pointerdown', e => {
    // Hand control back the instant a real pointer (mouse drag OR a touch
    // that's about to become a native swipe) touches down — otherwise our
    // own rAF loop keeps writing scrollLeft on top of the user's own
    // gesture every frame, and the two visibly fight each other.
    if (scrollAnimFrame) {
      cancelAnimationFrame(scrollAnimFrame);
      scrollAnimFrame = null;
      programmaticScroll = false;
      viewport.style.scrollSnapType = '';
    }
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    isPointerDown = true; pointerMoved = false;
    dragStartX = e.clientX;
    dragStartScroll = viewport.scrollLeft;
    viewport.style.scrollSnapType = 'none';
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  });
  // Only suppress the click that ends a genuine drag (real, sustained
  // pointer movement while down) — never a plain click that happened to
  // land on this element.
  viewport.addEventListener('click', e => {
    if (pointerMoved) { e.preventDefault(); pointerMoved = false; }
  });

  // Autoplay: advances every 5s, paused on hover / focus-within / hidden tab
  // / off-screen section / reduced motion.
  let offscreen = false;
  const sectionIO = new IntersectionObserver(([entry]) => { offscreen = !entry.isIntersecting; }, { threshold: 0.2 });
  sectionIO.observe(root);

  function tick() {
    if (document.hidden || offscreen || reduceMotion()) return;
    if (root.matches(':hover') || (document.activeElement && root.contains(document.activeElement))) return;
    goTo(index + 1, { manual: false });
  }
  if (!reduceMotion()) {
    autoplayTimer = window.setInterval(tick, AUTOPLAY_MS);
  }

  updateUI(0);
}

export function initCarousels(root = document) {
  root.querySelectorAll('[data-carousel]').forEach(initOne);
}
