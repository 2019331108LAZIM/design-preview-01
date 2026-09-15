// Resolves an images.json key into a responsive <img>, so every page gets
// srcset/sizes/width/height (zero CLS) from one place. A "key" is the path
// stored in assets/data/images.json, relative to assets/img/.

let cache = null;
const eventCache = new Map();
let coversCache = null;

// The main index: logos, cosmosfoundation, cosmos-gallery, hero. Event
// photos are deliberately excluded — see loadEventImageIndex/loadCoversIndex
// below — so this stays small on every page that isn't showing a gallery.
export async function loadImageIndex() {
  if (!cache) {
    const res = await fetch('assets/data/images.json');
    cache = res.ok ? await res.json() : {};
  }
  return cache;
}

// One event's full gallery metadata — fetched only by event.html for the
// event it's actually rendering.
export async function loadEventImageIndex(slug) {
  if (!eventCache.has(slug)) {
    eventCache.set(slug, (async () => {
      const res = await fetch(`assets/data/images/events/${slug}.json`);
      return res.ok ? res.json() : {};
    })());
  }
  return eventCache.get(slug);
}

// Just the 14 event cover images — used by events.html and the homepage
// Recent Events strip, so neither has to fetch every event's full gallery.
export async function loadCoversIndex() {
  if (!coversCache) {
    const res = await fetch('assets/data/images/event-covers.json');
    coversCache = res.ok ? await res.json() : {};
  }
  return coversCache;
}

function nearestWidth(entries, target) {
  return entries.reduce((a, b) => (Math.abs(Number(a[0]) - target) < Math.abs(Number(b[0]) - target) ? a : b));
}

/**
 * @param {object} images - the loaded images.json index
 * @param {string} key - e.g. "cosmosfoundation/ekhan-900x900-1.webp"
 * @param {string} alt
 * @param {object} [opts]
 * @param {string} [opts.sizes] - sizes attribute for responsive variants
 * @param {boolean} [opts.priority] - true for the LCP image: no lazy, fetchpriority=high
 * @param {string} [opts.className]
 */
export function imgTag(images, key, alt, opts = {}) {
  const { sizes = '100vw', priority = false, className = '' } = opts;
  const cls = className ? ` class="${className}"` : '';
  const safeAlt = String(alt ?? '').replace(/"/g, '&quot;');

  // No key at all (e.g. a board member with no photo on file yet) — render
  // nothing rather than a broken "assets/img/undefined" request. Whatever
  // wraps this (e.g. .portrait-card__frame's background colour) shows
  // through as an honest blank placeholder instead of a broken-image icon.
  if (!key) return '';

  const meta = images[key];

  if (!meta) {
    // Fallback for a key not in the index — still safe to render.
    const loadAttrs = priority ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"';
    return `<img src="assets/img/${key}" alt="${safeAlt}"${cls} ${loadAttrs}>`;
  }

  const { w, h, variants, lqip } = meta;
  const bg = lqip ? ` style="background:center/cover no-repeat url('${lqip}')"` : '';

  if (!variants) {
    const loadAttrs = priority ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"';
    return `<img src="assets/img/${key}" width="${w}" height="${h}" alt="${safeAlt}"${cls} ${loadAttrs}>`;
  }

  const entries = Object.entries(variants);
  const srcset = entries.map(([wd, p]) => `assets/img/${p} ${wd}w`).join(', ');
  const [, defaultPath] = nearestWidth(entries, 960);
  const loadAttrs = priority ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"';
  return `<img src="assets/img/${defaultPath}" srcset="${srcset}" sizes="${sizes}" width="${w}" height="${h}" alt="${safeAlt}"${cls}${bg} ${loadAttrs}>`;
}

// Vector logos (assets/img/logos/*.svg — see tools/trace-logos.mjs) are
// hand-generated, not part of the images.json pipeline: no responsive
// variants and no LQIP, because a vector doesn't need either — it's crisp
// at any size from one file. width/height are the SVG's own viewBox size,
// passed in by the caller (see assets/data/*.js), so the browser still
// reserves the right aspect ratio before the file loads.
export function svgTag(key, alt, { width, height, className = '', priority = false } = {}) {
  const cls = className ? ` class="${className}"` : '';
  const safeAlt = String(alt ?? '').replace(/"/g, '&quot;');
  const loadAttrs = priority ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"';
  return `<img src="assets/img/${key}" width="${width}" height="${height}" alt="${safeAlt}"${cls} ${loadAttrs}>`;
}

// Each of the 5 logos above is a mark (fixed colour) + a wordmark that
// ships with fill="currentColor" (see tools/trace-logos.mjs) specifically
// so its ink can switch — e.g. white lettering over a photo or in dark
// theme, without touching the mark's own colours. That only works if the
// SVG is actually part of the page's DOM: currentColor inside a plain
// <img src="...svg"> resolves in that file's own isolated document, with
// no access to the embedding page's CSS at all, so svgTag() above is a
// dead end for anything that needs to respond to theme or placement.
// inlineSvg() instead fetches the file (cached — every caller of a given
// logo shares one request) and injects its markup directly, so a plain
// CSS `color` on whatever wraps it — see .brand__lockup, .footer-brand,
// .init-hero__logo-plate — reaches the wordmark's currentColor normally.
const inlineSvgCache = new Map();
export async function inlineSvg(key, { className = '', ariaLabel, ariaHidden = false } = {}) {
  if (!inlineSvgCache.has(key)) {
    inlineSvgCache.set(key, fetch(`assets/img/${key}`).then(res => (res.ok ? res.text() : '')));
  }
  const raw = await inlineSvgCache.get(key);
  if (!raw) return '';
  let out = raw;
  if (className) out = out.replace('<svg ', `<svg class="${className}" `);
  // Exactly one of these: aria-hidden when an ancestor (e.g. a linked <a
  // aria-label="...">) already carries the accessible name, so this
  // wouldn't just repeat it; aria-label when the mark itself is the only
  // thing conveying what it is (e.g. the footer, which isn't a link).
  if (ariaHidden) out = out.replace('<svg ', `<svg aria-hidden="true" `);
  else if (ariaLabel) out = out.replace('<svg ', `<svg role="img" aria-label="${String(ariaLabel).replace(/"/g, '&quot;')}" `);
  return out;
}

export function imgSrc(images, key, targetWidth = 960) {
  const meta = images[key];
  if (!meta) return `assets/img/${key}`;
  if (!meta.variants) return `assets/img/${key}`;
  const entries = Object.entries(meta.variants);
  const [, p] = nearestWidth(entries, targetWidth);
  return `assets/img/${p}`;
}

// The largest available variant, regardless of any target — for a
// fullscreen viewer (the lightbox), where the display can legitimately be
// as wide as the screen, "nearest to some fixed guess" (imgSrc's job
// everywhere else) isn't the right question.
export function imgLargestSrc(images, key) {
  const meta = images[key];
  if (!meta || !meta.variants) return `assets/img/${key}`;
  const entries = Object.entries(meta.variants);
  const [, p] = entries.reduce((a, b) => (Number(a[0]) > Number(b[0]) ? a : b));
  return `assets/img/${p}`;
}

// Full srcset string so a fullscreen viewer can let the browser pick the
// right variant for the actual screen (size + DPR) instead of always
// forcing the very largest file on every device.
export function imgSrcset(images, key) {
  const meta = images[key];
  if (!meta || !meta.variants) return '';
  return Object.entries(meta.variants).map(([w, p]) => `assets/img/${p} ${w}w`).join(', ');
}
