#!/usr/bin/env node
// Automated pre-launch checks: dead internal links, missing images,
// stray references to source/ or uploads/, <img> tags missing width/height
// or alt, and duplicate ids. Run: node tools/verify.mjs

import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { walk } from './lib/fs-walk.mjs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const problems = [];
let filesChecked = 0;

function fail(file, msg) {
  problems.push(`${path.relative(ROOT, file)}: ${msg}`);
}

async function exists(p) {
  try { await stat(p); return true; } catch { return false; }
}

async function pageFiles() {
  const entries = await readdir(ROOT, { withFileTypes: true });
  return entries.filter(e => e.isFile() && e.name.endsWith('.html')).map(e => path.join(ROOT, e.name));
}

function resolveLocal(href, fromFile) {
  if (/^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('data:') || href.startsWith('#')) return null;
  const clean = href.split('#')[0].split('?')[0];
  if (!clean) return null;
  return path.resolve(path.dirname(fromFile), clean);
}

async function checkHtmlFile(file) {
  filesChecked++;
  const html = await readFile(file, 'utf8');

  if (/(^|["'(=])source\//.test(html)) fail(file, 'references source/ (should point at assets/img/ instead)');
  if (/(^|["'(=])uploads\//.test(html)) fail(file, 'references uploads/ (mockup-only path, must not ship)');

  // img tags: width/height + alt
  const imgRe = /<img\b[^>]*>/gi;
  let m;
  while ((m = imgRe.exec(html))) {
    const tag = m[0];
    if (!/\balt\s*=/.test(tag)) fail(file, `<img> missing alt attribute: ${tag.slice(0, 90)}`);
    if (!/\bwidth\s*=/.test(tag) || !/\bheight\s*=/.test(tag)) {
      fail(file, `<img> missing width/height attribute: ${tag.slice(0, 90)}`);
    }
  }

  // duplicate ids
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(x => x[1]);
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) fail(file, `duplicate id="${id}"`);
    seen.add(id);
  }

  // local href/src targets — assets/video/* is exempt: the brief has the
  // homepage build for the hero video's absence, so hero.mp4/hero.webm are
  // intentionally not shipped (see HANDOVER.md).
  const refRe = /\b(?:href|src)=["']([^"']+)["']/g;
  while ((m = refRe.exec(html))) {
    if (m[1].startsWith('assets/video/')) continue;
    const target = resolveLocal(m[1], file);
    if (!target) continue;
    if (!(await exists(target))) fail(file, `dead link/asset reference: ${m[1]}`);
  }

  // single h1 — speakers.html/ambassadors.html render their <h1> entirely
  // from series.js at runtime (the title is data, not static markup), so a
  // static scan can't see it; verified instead by the browser QA pass and
  // by Lighthouse against the live DOM.
  const NO_STATIC_H1 = new Set(['speakers.html', 'ambassadors.html']);
  const h1Count = (html.match(/<h1[\s>]/g) || []).length;
  if (h1Count === 0 && !NO_STATIC_H1.has(path.basename(file))) fail(file, 'no <h1> found');
  if (h1Count > 1) fail(file, `${h1Count} <h1> elements found (expected exactly 1)`);
}

async function checkJsFiles() {
  const jsRoot = path.join(ROOT, 'assets', 'js');
  const files = (await walk(jsRoot)).filter(f => f.endsWith('.js'));
  for (const file of files) {
    filesChecked++;
    const src = await readFile(file, 'utf8');
    if (/(^|["'(=`])source\//.test(src)) fail(file, 'references source/ (should point at assets/img/ instead)');
    if (/(^|["'(=`])uploads\//.test(src)) fail(file, 'references uploads/ (mockup-only path, must not ship)');

    // hardcoded page links like href="foo.html" or href="foo.html?id=${x}"
    const hrefRe = /href=["']([a-zA-Z0-9_-]+\.html)(?:\?[^"']*)?["']/g;
    let m;
    while ((m = hrefRe.exec(src))) {
      const target = path.join(ROOT, m[1]);
      if (!(await exists(target))) fail(file, `dead page link: ${m[1]}`);
    }
  }
}

async function checkImageDataIntegrity() {
  const dataDir = path.join(ROOT, 'assets', 'data');
  let images = {};
  try { images = JSON.parse(await readFile(path.join(dataDir, 'images.json'), 'utf8')); } catch { /* ignore */ }

  const eventChunks = {};
  try {
    const evDir = path.join(dataDir, 'images', 'events');
    for (const f of await readdir(evDir)) {
      if (f.endsWith('.json')) Object.assign(eventChunks, JSON.parse(await readFile(path.join(evDir, f), 'utf8')));
    }
  } catch { /* ignore */ }

  let covers = {};
  try { covers = JSON.parse(await readFile(path.join(dataDir, 'images', 'event-covers.json'), 'utf8')); } catch { /* ignore */ }

  const allKnownKeys = new Set([...Object.keys(images), ...Object.keys(eventChunks), ...Object.keys(covers)]);

  for (const file of ['board.js', 'initiatives.js', 'series.js', 'media.js', 'site.js', 'about.js']) {
    filesChecked++;
    const full = path.join(dataDir, file);
    if (!(await exists(full))) continue;
    const src = await readFile(full, 'utf8');
    const keyRe = /\b(?:img|src|hero|logo|cover)\s*:\s*['"]([a-zA-Z0-9/_.-]+\.webp)['"]/g;
    let m;
    while ((m = keyRe.exec(src))) {
      if (!allKnownKeys.has(m[1])) fail(full, `references image key not present in any images*.json: ${m[1]}`);
    }

    // Hand-built vector logos (tools/trace-logos.mjs) aren't part of the
    // images.json pipeline — the same key regex, but checked directly
    // against the filesystem instead of the generated index.
    const svgRe = /\b(?:img|src|hero|logo|cover)\s*:\s*['"]([a-zA-Z0-9/_.-]+\.svg)['"]/g;
    while ((m = svgRe.exec(src))) {
      if (!(await exists(path.join(ROOT, 'assets', 'img', m[1])))) fail(full, `references logo SVG that doesn't exist: assets/img/${m[1]}`);
    }
  }
}

async function main() {
  for (const f of await pageFiles()) await checkHtmlFile(f);
  await checkJsFiles();
  await checkImageDataIntegrity();

  console.log(`Checked ${filesChecked} files.`);
  if (problems.length) {
    console.log(`\n${problems.length} problem(s) found:\n`);
    for (const p of problems) console.log(`  ✗ ${p}`);
    process.exitCode = 1;
  } else {
    console.log('No problems found.');
  }
}

main().catch(err => { console.error(err); process.exit(1); });
