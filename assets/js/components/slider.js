// Generic carousel: CSS scroll-snap does the scrolling/touch/trackpad work,
// this file only supplies autoplay, manual controls, keyboard, a desktop
// mouse-drag affordance (touch already gets native drag from the browser),
// and the accessibility wiring the brief calls for.
//
// The strip is endless: the track carries clones of the slides at each end
// so advancing past the last slide continues forward into an identical
// copy, and the viewport is silently re-anchored to the real slide once the
// transition lands. See the "endless loop" block in initOne.
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

const AUTOPLAY_MS = 2600;
// Deliberately shorter than the steady cadence: the first move is what
// tells a reader the strip is a carousel at all, and on events.html the
// component doesn't even exist until its gallery JSON arrives.
const FIRST_ADVANCE_MS = 900;
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

  const realCount = slides.length;

  // ---- endless loop -------------------------------------------------
  // Advancing off the last slide used to run `index % realCount` back to 0
  // and animate there, which scrolls the whole strip backwards — on a
  // 18-slide section that was a measured 7,069px rewind, and it reads as
  // the carousel snapping back to the start rather than continuing.
  //
  // Instead the track is padded with clones: a copy of the last K slides
  // before the real set and a copy of the first K after it. Moving off
  // either end therefore continues into identical-looking clones, and once
  // the transition lands we shift scrollLeft by exactly one set width with
  // no animation. The pixels under the reader don't change, so the jump is
  // invisible — the motion just keeps going in one direction forever.
  //
  // K is sized to the viewport rather than cloning the whole set: a card
  // shows one slide, events.html shows about three, and a 42-photo gallery
  // ×14 sections would otherwise triple the number of <img> nodes on the
  // page for no visual gain.
  const slideW = slides[0].getBoundingClientRect().width || 1;
  const K = Math.max(1, Math.min(realCount, Math.ceil(viewport.clientWidth / slideW) + 1));

  function cloneSlide(node) {
    const c = node.cloneNode(true);
    c.dataset.carouselClone = '1';
    // Clones duplicate real content, so they must not be reachable by tab
    // or read out by a screen reader — the aria-live status region and the
    // real slides are the accessible view of this component.
    c.setAttribute('aria-hidden', 'true');
    c.querySelectorAll('a, button, [tabindex]').forEach(el => el.setAttribute('tabindex', '-1'));
    return c;
  }

  const leadIn = slides.slice(realCount - K).map(cloneSlide);   // copies of the last K
  const leadOut = slides.slice(0, K).map(cloneSlide);           // copies of the first K
  leadIn.forEach(c => track.insertBefore(c, track.firstChild));
  leadOut.forEach(c => track.appendChild(c));

  const domSlides = Array.from(track.children);
  const OFFSET = K;                 // real slide i lives at domSlides[OFFSET + i]
  let domIndex = OFFSET;            // current position in domSlides
  let index = 0;                    // current position in the real set

  // Distance covered by one full pass through the real set. Measured from
  // layout positions (not scrollLeft) so it's stable regardless of where
  // the viewport currently sits.
  let setWidth = 0;
  function measureSet() {
    setWidth = domSlides[OFFSET + realCount].offsetLeft - domSlides[OFFSET].offsetLeft;
  }
  measureSet();

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
  // well before an event's full gallery does. Past DOTS_MAX, show a compact
  // "N / total" counter instead; either way the controls row is a single
  // fixed-height element, never zero-then-tall, which matters on events.html
  // where a carousel starts with one placeholder slide and is filled in
  // moments later with the real gallery — a growing dot strip was a real,
  // measured layout-shift source there.
  const DOTS_MAX = 12;
  const useDots = realCount <= DOTS_MAX;
  let counterEl = null;
  if (useDots) {
    dotsWrap.setAttribute('role', 'tablist');
    dotsWrap.setAttribute('aria-label', 'Slides');
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel__dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to slide ${i + 1} of ${realCount}`);
      dot.addEventListener('click', () => { goToReal(i, { manual: true }); });
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
    status.textContent = `Slide ${i + 1} of ${realCount}${title ? `: ${title}` : ''}`;
  }

  function updateUI(i) {
    dots.forEach((d, di) => d.setAttribute('aria-current', String(di === i)));
    if (counterEl) counterEl.textContent = `${i + 1} / ${realCount}`;
    prevBtn.disabled = false;
    nextBtn.disabled = false;
  }

  // Pull domIndex back into the real set, shifting scrollLeft by the same
  // amount so nothing moves on screen. Runs with snapping already off (see
  // animateScrollTo's finish) so the browser doesn't try to re-snap the
  // teleport.
  function normalize() {
    if (domIndex >= OFFSET + realCount) {
      domIndex -= realCount;
      viewport.scrollLeft -= setWidth;
    } else if (domIndex < OFFSET) {
      domIndex += realCount;
      viewport.scrollLeft += setWidth;
    }
    index = domIndex - OFFSET;
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
  function animateScrollTo(target, onDone, duration = 320) {
    if (scrollAnimFrame) cancelAnimationFrame(scrollAnimFrame);
    if (scrollAnimFallback) clearTimeout(scrollAnimFallback);
    const start = viewport.scrollLeft;
    const distance = target - start;
    if (Math.abs(distance) < 1) { programmaticScroll = false; if (onDone) onDone(); return; }
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
      // Teleport back into the real set BEFORE snapping is re-enabled,
      // otherwise the browser snaps to wherever the shift landed.
      if (onDone) onDone();
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

  // Move by a signed number of slides. Always travels in the direction
  // asked for — never unwinds across the whole strip to get there.
  function step(delta, { manual = false, smooth = true } = {}) {
    domIndex += delta;
    index = ((domIndex - OFFSET) % realCount + realCount) % realCount;
    const target = slideTargetLeft(viewport, domSlides[domIndex]);
    if (smooth && !reduceMotion()) {
      animateScrollTo(target, normalize);
    } else {
      if (scrollAnimFrame) { cancelAnimationFrame(scrollAnimFrame); scrollAnimFrame = null; }
      const prevSnap = viewport.style.scrollSnapType;
      viewport.style.scrollSnapType = 'none';
      viewport.scrollLeft = target;
      normalize();
      programmaticScroll = false;
      viewport.style.scrollSnapType = prevSnap;
    }
    updateUI(index);
    if (manual) announce(index);
  }

  // Jump straight to a real slide (dot clicks). Stays inside the real set,
  // so there is no wrap to resolve.
  function goToReal(i, opts = {}) {
    step((OFFSET + i) - domIndex, opts);
  }

  prevBtn.addEventListener('click', () => step(-1, { manual: true }));
  nextBtn.addEventListener('click', () => step(1, { manual: true }));

  root.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1, { manual: true }); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); step(1, { manual: true }); }
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
    let closest = domIndex, closestDist = Infinity;
    domSlides.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      const dist = Math.abs((r.left + r.width / 2) - vpCenter);
      if (dist < closestDist) { closestDist = dist; closest = i; }
    });
    if (closest === domIndex) return;
    domIndex = closest;
    // A drag that ends inside the clone buffer gets teleported back to the
    // matching real slide. The clone is pixel-identical, so the correction
    // is invisible — but it has to happen with snapping off, or the browser
    // immediately snaps back to the clone.
    programmaticScroll = true;
    const prevSnap = viewport.style.scrollSnapType;
    viewport.style.scrollSnapType = 'none';
    normalize();
    viewport.style.scrollSnapType = prevSnap;
    programmaticScroll = false;
    updateUI(index);
  }
  viewport.addEventListener('scroll', () => {
    if (programmaticScroll) return;
    if (scrollEndTimer) clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(syncIndexFromScroll, 120);
  }, { passive: true });

  // Slide widths are percentage-based, so a resize changes how far one full
  // pass is. Re-measure, and re-anchor on the current slide.
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      measureSet();
      step(0, { smooth: false });
    }, 150);
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

  // Autoplay, paused on hover / focus-within / hidden tab / off-screen
  // section / reduced motion.
  let offscreen = false;
  const sectionIO = new IntersectionObserver(([entry]) => { offscreen = !entry.isIntersecting; }, { threshold: 0.2 });
  sectionIO.observe(root);

  function paused() {
    if (document.hidden || offscreen || reduceMotion()) return true;
    return root.matches(':hover') || (document.activeElement && root.contains(document.activeElement));
  }

  // A self-rescheduling timeout rather than setInterval, so the first move
  // can come sooner than the steady cadence. On events.html the gallery is
  // fetched after first paint and the carousel only initialises once it
  // lands, so waiting a further full interval on top of that made the
  // strip look inert for seconds after the page had visibly finished.
  function schedule(delay) {
    autoplayTimer = window.setTimeout(() => {
      if (!paused()) step(1);
      schedule(AUTOPLAY_MS);
    }, delay);
  }
  if (!reduceMotion()) schedule(FIRST_ADVANCE_MS);

  // Anchor on the first real slide without animating — the viewport starts
  // at scrollLeft 0, which is inside the lead-in clones.
  viewport.style.scrollSnapType = 'none';
  viewport.scrollLeft = slideTargetLeft(viewport, domSlides[OFFSET]);
  viewport.style.scrollSnapType = '';
  updateUI(0);
}

export function initCarousels(root = document) {
  root.querySelectorAll('[data-carousel]').forEach(initOne);
}
