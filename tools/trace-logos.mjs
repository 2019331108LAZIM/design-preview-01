#!/usr/bin/env node
// Vectorises the 5 lettering+mark logos (Cosmos Foundation and the four
// initiative wordmarks) from their PNG originals in source/logos/ into true
// <path>-based SVGs — not embedded raster — with a transparent background.
// Run: node tools/trace-logos.mjs [--diff]
//
// Every logo here is a mark (icon) + a wordmark (lettering), and the client
// asked for the mark's own colours to stay fixed while the lettering can
// switch to white in contexts where the artwork's dark ink would otherwise
// be unreadable (dark theme, or sitting on a photo). A single raster trace
// can't do that — colour is baked into the pixels — so each logo is split
// into its mark region and its text region (found by scanning for the
// actual transparent gap between them, not eyeballed) and traced
// separately: the mark keeps its traced, literal colours; the text is
// forced to one flat shape and given fill="currentColor" instead of a
// hardcoded hex, so the two live in the same <svg>/<img> file but the
// lettering now answers to CSS `color` on whatever wraps it (see
// assets/css/layout.css .brand__lockup, .footer-brand__mark and
// assets/css/pages/initiative.css .init-hero__logo-plate for how each
// context sets it).
//
// Gallery Cosmos is a further special case on top of that split: its mark
// is a circle with a real red-to-white RADIAL GRADIENT over a solid green
// half, which a flat-colour tracer can only posterize into visible bands.
// That mark is reconstructed as genuine SVG geometry (an ellipse path + a
// real <radialGradient>, sampled from the source pixels) rather than
// traced — see buildGalleryCosmos().

import sharp from 'sharp';
import ImageTracer from 'imagetracerjs';
import { optimize } from 'svgo';
import { mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SRC = path.join(ROOT, 'source', 'logos');
const OUT = path.join(ROOT, 'assets', 'img', 'logos');
const DIFF_DIR = path.join(ROOT, 'tools', '.logo-diff');

const SVGO_CONFIG = { multipass: true, plugins: ['preset-default'] };

// ---- pixel helpers --------------------------------------------------------

async function rawRGBA(input) {
  return sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
}

// Scans column-by-column (axis 'x') or row-by-row (axis 'y') for the first
// run of at least minGap fully-transparent columns/rows that comes after
// some opaque content — i.e. the actual gap between the mark and the text,
// found from the pixels rather than assumed.
async function findGap(srcPath, axis, minGap = 10) {
  const { data, info } = await rawRGBA(srcPath);
  const W = info.width, H = info.height;
  const count = axis === 'x' ? W : H;
  const hasOpaque = new Array(count).fill(false);
  for (let i = 0; i < count; i++) {
    if (axis === 'x') {
      for (let y = 0; y < H; y++) { if (data[(y * W + i) * 4 + 3] > 10) { hasOpaque[i] = true; break; } }
    } else {
      for (let x = 0; x < W; x++) { if (data[(i * W + x) * 4 + 3] > 10) { hasOpaque[i] = true; break; } }
    }
  }
  let started = false, gapStart = -1;
  for (let i = 0; i < hasOpaque.length; i++) {
    if (hasOpaque[i]) {
      if (started && gapStart >= 0 && i - gapStart >= minGap) return [gapStart, i];
      started = true; gapStart = -1;
    } else if (started && gapStart < 0) {
      gapStart = i;
    }
  }
  return null;
}

async function traceCropToSVG(srcPath, extract, options) {
  const buf = extract ? await sharp(srcPath).extract(extract).toBuffer() : await sharp(srcPath).toBuffer();
  const { data, info } = await rawRGBA(buf);
  const imagedata = { width: info.width, height: info.height, data: new Uint8ClampedArray(data.buffer, data.byteOffset, data.length) };
  return ImageTracer.imagedataToSVG(imagedata, { ...options, viewbox: true, scale: 1 });
}

// Every opaque (opacity="1") path imagetracerjs emits, keeping each one's
// own traced fill colour — used for the mark region, where colour fidelity
// matters and must stay fixed.
function extractColouredPaths(svg) {
  return [...svg.matchAll(/<path fill="(rgb\([^)]+\))"[^>]*opacity="1"[^>]*d="([^"]+)"\s*\/>/g)].map(m => ({ fill: m[1], d: m[2] }));
}

// Every opaque path's geometry only, ignoring the traced colour entirely —
// used for the text region, which becomes one flat currentColor shape
// regardless of how many anti-alias shades the tracer found.
function extractPathData(svg) {
  return [...svg.matchAll(/<path fill="rgb\([^)]+\)"[^>]*opacity="1"[^>]*d="([^"]+)"\s*\/>/g)].map(m => m[1]);
}

// ---- mark + text split jobs (four of the five logos) ---------------------

// imagetracerjs's colour quantiser is a k-means variant, and it turns out
// NEITHER "raise numberofcolors" NOR "leave it low" is reliably safe on its
// own: numberofcolors: 4 on Cosmos Foundation's globe silently blended its
// green and red into one muddy #823929 (caught by eye, not by this tool,
// which is why the expectMarkColors check in buildSplitLogo() exists now);
// raising it to 10 to "fix" that then broke Cosmos Atelier 71's mark the
// same way, because the real culprit was colorquantcycles (k-means
// iteration count) defaulting to 3 — too few to converge cleanly once
// numberofcolors is more than a couple of colours above what's actually in
// the crop. colorquantcycles: 10 below is what actually makes each of
// these converge correctly and repeatably (verified by sweeping both
// parameters against every logo, not by picking whichever run happened to
// look right once) — numberofcolors still has headroom above the real
// count, mincolorratio drops any cluster too small to matter, but the
// convergence itself is what colorquantcycles is fixing.
const LOGO_JOBS = [
  {
    file: 'Cosmos Foundation-01.png', out: 'cosmos-foundation.svg', axis: 'x',
    markOptions: { numberofcolors: 8, colorquantcycles: 10, pathomit: 12, ltres: 0.5, qtres: 0.5, mincolorratio: 0.01, roundcoords: 2, rightangleenhance: false },
    textOptions: { numberofcolors: 2, pathomit: 12, ltres: 0.5, qtres: 0.5, mincolorratio: 0.01, roundcoords: 2, rightangleenhance: false },
    expectMarkColors: 2 // green globe + red globe (white background isn't a "colour" — see extractColouredPaths)
  },
  {
    file: 'Cosmos Atelier 71-01.png', out: 'cosmos-atelier-71.svg', axis: 'x',
    // The mark itself has a dark "C" knocked out of a red circle with a
    // white "a" — that dark ink is the SAME colour as the wordmark text, so
    // this split (not a colour filter) is the only reliable way to keep
    // the monogram fixed while letting the wordmark alone go currentColor.
    markOptions: { numberofcolors: 8, colorquantcycles: 10, pathomit: 10, ltres: 0.5, qtres: 0.5, mincolorratio: 0.01, roundcoords: 2, rightangleenhance: false },
    textOptions: { numberofcolors: 2, pathomit: 10, ltres: 0.5, qtres: 0.5, mincolorratio: 0.01, roundcoords: 2, rightangleenhance: false },
    expectMarkColors: 3 // red circle, dark "C"/"as", white "a"
  },
  {
    file: 'WildTeam-01.png', out: 'wildteam.svg', axis: 'y',
    // Icon above, wordmark below — and both happen to trace to the same
    // magenta, so again the split (not colour) is what separates them.
    markOptions: { numberofcolors: 6, colorquantcycles: 10, pathomit: 10, ltres: 0.5, qtres: 0.5, mincolorratio: 0.01, roundcoords: 2, rightangleenhance: false },
    textOptions: { numberofcolors: 2, pathomit: 10, ltres: 0.5, qtres: 0.5, mincolorratio: 0.01, roundcoords: 2, rightangleenhance: false },
    expectMarkColors: 1 // the heart/hands icon is one flat magenta
  },
  {
    file: 'Bay of Bengal Institute-01.png', out: 'bay-of-bengal-institute.svg', axis: 'y',
    // Multi-tone wave icon above (several close blues — highest colour
    // count and tightest fit tolerance of the set) plus serif lettering
    // below.
    markOptions: { numberofcolors: 14, colorquantcycles: 10, pathomit: 6, ltres: 0.3, qtres: 0.3, mincolorratio: 0.002, roundcoords: 2, rightangleenhance: false },
    textOptions: { numberofcolors: 2, pathomit: 6, ltres: 0.3, qtres: 0.3, mincolorratio: 0.01, roundcoords: 2, rightangleenhance: false },
    expectMarkColors: null // several close, genuinely-blended blues — no single right count to assert
  }
];

async function buildSplitLogo(job) {
  const srcPath = path.join(SRC, job.file);
  const meta = await sharp(srcPath).metadata();
  const gap = await findGap(srcPath, job.axis);
  if (!gap) throw new Error(`${job.file}: no mark/text gap found on axis ${job.axis} — logo isn't a simple mark+text layout, needs its own job`);
  const splitAt = Math.round((gap[0] + gap[1]) / 2);

  const markExtract = job.axis === 'x'
    ? { left: 0, top: 0, width: splitAt, height: meta.height }
    : { left: 0, top: 0, width: meta.width, height: splitAt };
  const textExtract = job.axis === 'x'
    ? { left: splitAt, top: 0, width: meta.width - splitAt, height: meta.height }
    : { left: 0, top: splitAt, width: meta.width, height: meta.height - splitAt };

  const markSVG = await traceCropToSVG(srcPath, markExtract, job.markOptions);
  const markPaths = extractColouredPaths(markSVG);

  const distinctColours = new Set(markPaths.map(p => p.fill)).size;
  if (job.expectMarkColors != null && distinctColours !== job.expectMarkColors) {
    throw new Error(
      `${job.file}: mark region traced to ${distinctColours} distinct colour(s) (${[...new Set(markPaths.map(p => p.fill))].join(', ')}), expected ${job.expectMarkColors}. ` +
      `imagetracerjs's colour quantiser can silently blend two colours into one when numberofcolors is too tight for how separable they are — raise markOptions.numberofcolors and re-run, don't just accept whatever came out.`
    );
  }

  const textSVG = await traceCropToSVG(srcPath, textExtract, job.textOptions);
  const textPaths = extractPathData(textSVG);

  const textTranslate = job.axis === 'x' ? `translate(${splitAt},0)` : `translate(0,${splitAt})`;

  return `<svg viewBox="0 0 ${meta.width} ${meta.height}" xmlns="http://www.w3.org/2000/svg">` +
    `<g>${markPaths.map(p => `<path fill="${p.fill}" d="${p.d}"/>`).join('')}</g>` +
    `<g transform="${textTranslate}" fill="currentColor">${textPaths.map(d => `<path d="${d}"/>`).join('')}</g>` +
    `</svg>`;
}

// ---- Gallery Cosmos: gradient mark (hand-built) + traced text ----------

async function findOpaqueBBox(srcPath, xLimit) {
  const { data, info } = await rawRGBA(srcPath);
  const W = info.width, H = info.height;
  let minX = W, maxX = 0, minY = H, maxY = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < Math.min(xLimit, W); x++) {
      const a = data[(y * W + x) * 4 + 3];
      if (a > 10) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
    }
  }
  return { minX, minY, maxX, maxY, width: W, height: H };
}

async function findGradientCenter(srcPath, bbox) {
  const { data, info } = await rawRGBA(srcPath);
  const W = info.width;
  let best = null, bestVal = -1;
  const midY = (bbox.minY + bbox.maxY) / 2;
  for (let y = bbox.minY; y < midY; y++) {
    for (let x = bbox.minX; x <= bbox.maxX; x++) {
      const i = (y * W + x) * 4;
      const a = data[i + 3];
      if (a < 200) continue;
      const val = data[i] + data[i + 1] + data[i + 2];
      if (val > bestVal) { bestVal = val; best = { x, y }; }
    }
  }
  return best;
}

async function sampleColor(srcPath, x, y) {
  const { data, info } = await rawRGBA(srcPath);
  const i = (Math.round(y) * info.width + Math.round(x)) * 4;
  return [data[i], data[i + 1], data[i + 2]];
}

function toHex([r, g, b]) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}

async function buildGalleryCosmos() {
  const srcPath = path.join(SRC, 'Gallery Cosmos-01 (1).png');
  const meta = await sharp(srcPath).metadata();
  const gap = await findGap(srcPath, 'x');
  const textCropX = Math.round((gap[0] + gap[1]) / 2);
  const bbox = await findOpaqueBBox(srcPath, textCropX);
  const cx = (bbox.minX + bbox.maxX) / 2, cy = (bbox.minY + bbox.maxY) / 2;
  const rx = (bbox.maxX - bbox.minX) / 2, ry = (bbox.maxY - bbox.minY) / 2;

  const gcenter = await findGradientCenter(srcPath, bbox);
  const outerRed = await sampleColor(srcPath, cx, bbox.minY + 3); // top edge of the arc, close to pure outer colour
  const green = await sampleColor(srcPath, cx, bbox.maxY - 5);
  const gr = Math.hypot(gcenter.x - cx, gcenter.y - bbox.minY) * 1.04; // reach red just past the arc's own edge

  const textSVG = await traceCropToSVG(srcPath, { left: textCropX, top: 0, width: meta.width - textCropX, height: meta.height }, {
    numberofcolors: 2, pathomit: 10, ltres: 0.5, qtres: 0.5, mincolorratio: 0.01, roundcoords: 2, rightangleenhance: false
  });
  const textPaths = extractPathData(textSVG);

  const gradientId = 'galSun';
  return `<svg viewBox="0 0 ${meta.width} ${meta.height}" xmlns="http://www.w3.org/2000/svg">` +
    `<defs><radialGradient id="${gradientId}" cx="${gcenter.x}" cy="${gcenter.y}" r="${gr.toFixed(1)}" gradientUnits="userSpaceOnUse">` +
    `<stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="${toHex(outerRed)}"/></radialGradient></defs>` +
    `<path d="M ${(cx - rx).toFixed(1)} ${cy.toFixed(1)} A ${rx.toFixed(1)} ${ry.toFixed(1)} 0 0 1 ${(cx + rx).toFixed(1)} ${cy.toFixed(1)} Z" fill="url(#${gradientId})"/>` +
    `<path d="M ${(cx - rx).toFixed(1)} ${cy.toFixed(1)} A ${rx.toFixed(1)} ${ry.toFixed(1)} 0 0 0 ${(cx + rx).toFixed(1)} ${cy.toFixed(1)} Z" fill="${toHex(green)}"/>` +
    `<g transform="translate(${textCropX},0)" fill="currentColor">${textPaths.map(d => `<path d="${d}"/>`).join('')}</g>` +
    `</svg>`;
}

// ---- diff rendering (QA, not shipped) -----------------------------------

async function renderDiff(name, srcPath, outPath) {
  await mkdir(DIFF_DIR, { recursive: true });
  const meta = await sharp(srcPath).metadata();
  const w = meta.width, h = meta.height;
  const files = {};
  for (const [tag, hex] of [['src-dark', '#1C1410'], ['src-light', '#F6EEDD']]) {
    const p = path.join(DIFF_DIR, `${name}-${tag}.png`);
    await sharp({ create: { width: w, height: h, channels: 3, background: hex } }).composite([{ input: srcPath }]).png().toFile(p);
    files[tag] = p;
  }
  // currentColor only resolves inside a real document (color inherits from
  // an ancestor) — sharp's SVG rasteriser has no such context, so render
  // the diff once with dark-ink text (typical "on light ground") and once
  // with white text (typical "on dark ground"), each composited onto the
  // theme background it's meant for.
  for (const [tag, bgHex, textHex] of [['svg-light', '#F6EEDD', '#2C2522'], ['svg-dark', '#1C1410', '#F6EEDD']]) {
    const svgSrc = (await import('node:fs/promises')).readFile;
    const raw = await svgSrc(outPath, 'utf8');
    const coloured = raw.replace('<svg ', `<svg style="color:${textHex}" `);
    const rasterized = await sharp(Buffer.from(coloured), { density: 300 }).resize(w, h).toBuffer();
    const p = path.join(DIFF_DIR, `${name}-${tag}.png`);
    await sharp({ create: { width: w, height: h, channels: 3, background: bgHex } }).composite([{ input: rasterized }]).png().toFile(p);
    files[tag] = p;
  }
  return files;
}

// ---- main -----------------------------------------------------------------

async function main() {
  const wantDiff = process.argv.includes('--diff');
  await mkdir(OUT, { recursive: true });

  const results = [];

  for (const job of LOGO_JOBS) {
    const svg = await buildSplitLogo(job);
    const optimized = optimize(svg, SVGO_CONFIG).data;
    const outPath = path.join(OUT, job.out);
    await writeFile(outPath, optimized);
    results.push({ file: job.file, outPath, srcPath: path.join(SRC, job.file) });
  }

  {
    const svg = await buildGalleryCosmos();
    const optimized = optimize(svg, SVGO_CONFIG).data;
    const outPath = path.join(OUT, 'gallery-cosmos.svg');
    await writeFile(outPath, optimized);
    results.push({ file: 'Gallery Cosmos-01 (1).png', outPath, srcPath: path.join(SRC, 'Gallery Cosmos-01 (1).png') });
  }

  for (const r of results) {
    const s = await stat(r.outPath);
    console.log(`${r.file} -> ${path.relative(ROOT, r.outPath)} (${(s.size / 1024).toFixed(1)} KB)`);
    if (wantDiff) {
      const name = path.basename(r.outPath, '.svg');
      const diff = await renderDiff(name, r.srcPath, r.outPath);
      console.log(`  diff: ${Object.values(diff).map(p => path.relative(ROOT, p)).join(', ')}`);
    }
  }
}

main().catch(err => { console.error(err); process.exit(1); });
