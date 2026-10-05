#!/usr/bin/env node
// Image pipeline: source/** -> assets/img/** as WebP, with responsive
// variants, intrinsic dimensions and LQIP placeholders recorded in
// assets/data/images.json. Idempotent: an output newer than its source is
// left alone. Non-image inputs are detected by magic bytes, never by
// extension, and are skipped with a logged reason.
//
// Run: node tools/convert-images.mjs

import sharp from 'sharp';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { walk, detectImageType, slugifyFilename } from './lib/fs-walk.mjs';
import { parseFolderName } from './lib/events-meta.mjs';
import { ssimScore } from './lib/ssim.mjs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SOURCE = path.join(ROOT, 'source');
const OUT_IMG = path.join(ROOT, 'assets', 'img');
const DATA_DIR = path.join(ROOT, 'assets', 'data');
const IMAGES_JSON = path.join(DATA_DIR, 'images.json');

const RESPONSIVE_WIDTHS = [480, 960, 1440, 1920];
const CONCURRENCY = 6;

// Per-initiative source folders (see HANDOVER.md §2 / the initiatives-chunk
// brief): each maps 1:1 to its own assets/img/initiatives/<slug> output dir
// so images.json keys can never drift between initiatives, and so a folder
// scanned by basename can't accidentally merge with the unrelated top-level
// source/cosmos-gallery/ bucket (general exhibition photography, already
// wired elsewhere — left untouched by this pipeline run since that source
// folder no longer exists on disk).
const INITIATIVE_FOLDERS = [
  { dir: 'bayofbengal', slug: 'bay-of-bengal-institute', quality: 92 },
  { dir: 'Cosmos Ateliier', slug: 'cosmos-atelier-71', quality: 92 },
  { dir: 'cosmos-gallery', slug: 'gallery-cosmos', quality: 95 }, // art reproduction — near-lossless
  { dir: 'willdteam', slug: 'wildteam', quality: 92 }
];

// ---- helpers ---------------------------------------------------------

async function pool(items, limit, fn) {
  const results = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function fmtBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

async function outputIsFresh(outPath, sourceMtimeMs) {
  try {
    const s = await stat(outPath);
    return s.mtimeMs >= sourceMtimeMs && s.size > 0;
  } catch {
    return false;
  }
}

async function makeLqip(sharpImg) {
  const buf = await sharpImg.clone().resize(24).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${buf.toString('base64')}`;
}

// ---- classify every file under source/ --------------------------------

function stripDupSuffix(base) {
  return base.replace(/\s*\(\d+\)\s*$/, '');
}

async function buildJobs() {
  const jobs = [];
  const skipped = [];

  // 1. Hero poster
  const heroPath = path.join(SOURCE, 'Hero Building.jpeg');
  try {
    await stat(heroPath);
    jobs.push({ kind: 'hero', src: heroPath, outDir: OUT_IMG, baseName: 'hero-building' });
  } catch { /* not present */ }

  // 2. Logos (wordmarks) — lossless-ish, single size
  for (const f of await walk(path.join(SOURCE, 'logos'))) {
    jobs.push({ kind: 'mark', src: f, outDir: path.join(OUT_IMG, 'logos') });
  }

  // 3. cosmosfoundation — mixed photos (jpg) + marks (png)
  for (const f of await walk(path.join(SOURCE, 'cosmosfoundation'))) {
    const ext = path.extname(f).toLowerCase();
    if (ext === '.png') {
      jobs.push({ kind: 'mark', src: f, outDir: path.join(OUT_IMG, 'cosmosfoundation') });
    } else {
      jobs.push({ kind: 'photo', src: f, outDir: path.join(OUT_IMG, 'cosmosfoundation'), quality: 78 });
    }
  }

  // 4. cosmos-gallery — fine-art reproductions (flatten any nested dirs)
  for (const f of await walk(path.join(SOURCE, 'cosmos-gallery'))) {
    jobs.push({ kind: 'photo', src: f, outDir: path.join(OUT_IMG, 'cosmos-gallery'), quality: 88 });
  }

  // 4b. source/Initiatives/<folder>/ — one folder per initiative, photography
  // specific to that initiative only (see INITIATIVE_FOLDERS above). Each
  // folder also carries a duplicate copy of that initiative's own wordmark
  // (e.g. "Gallery Cosmos-01 (1).png") for convenience — the canonical
  // source for every wordmark is source/logos/, so those duplicates are
  // skipped here rather than reprocessed as a second, divergent copy.
  for (const { dir, slug, quality } of INITIATIVE_FOLDERS) {
    const files = await walk(path.join(SOURCE, 'Initiatives', dir));
    for (const f of files) {
      const base = stripDupSuffix(path.basename(f, path.extname(f)));
      if (/-01$/i.test(base)) continue; // wordmark duplicate — source/logos/ is canonical
      jobs.push({
        kind: 'photo', src: f, outDir: path.join(OUT_IMG, 'initiatives', slug), quality,
        preserveNative: true, ssimCheck: true
      });
    }
  }

  // 5. events/<folder>/* — renumbered sequentially per event
  const eventsRoot = path.join(SOURCE, 'events');
  let folders = [];
  try {
    folders = (await import('node:fs/promises').then(m => m.readdir(eventsRoot, { withFileTypes: true })))
      .filter(e => e.isDirectory()).map(e => e.name);
  } catch { /* no events dir */ }

  for (const folder of folders) {
    let meta;
    try {
      meta = parseFolderName(folder);
    } catch (err) {
      console.error(`FATAL: ${err.message}`);
      process.exit(1);
    }
    const dir = path.join(eventsRoot, folder);
    const files = await walk(dir);
    // Only files directly image-shaped by extension are considered for
    // ordering; magic-byte check happens per-file during processing, and a
    // file that turns out not to be an image is skipped (and does not
    // consume a sequence number for files after it, since numbering happens
    // after the magic-byte pass below).
    const candidates = [];
    for (const f of files.sort((a, b) => path.basename(a).localeCompare(path.basename(b), undefined, { numeric: true }))) {
      const head = Buffer.alloc(16);
      let fh;
      try {
        fh = await (await import('node:fs/promises')).open(f, 'r');
        await fh.read(head, 0, 16, 0);
      } finally {
        if (fh) await fh.close();
      }
      const type = detectImageType(head);
      if (!type) {
        skipped.push({ file: f, reason: 'not a recognised image (magic bytes)' });
        continue;
      }
      candidates.push(f);
    }
    candidates.forEach((f, i) => {
      jobs.push({
        kind: 'photo',
        src: f,
        outDir: path.join(OUT_IMG, 'events', meta.slug),
        quality: 78,
        forcedBaseName: `${meta.slug}-${String(i + 1).padStart(2, '0')}`,
        eventSlug: meta.slug
      });
    });
  }

  return { jobs, skipped };
}

// ---- process one job ---------------------------------------------------

async function processJob(job, prevImages, report) {
  const buf16 = Buffer.alloc(16);
  const fh = await (await import('node:fs/promises')).open(job.src, 'r');
  await fh.read(buf16, 0, 16, 0);
  await fh.close();
  const type = detectImageType(buf16);
  if (!type) {
    report.skipped.push({ file: job.src, reason: 'not a recognised image (magic bytes)' });
    return;
  }

  const srcStat = await stat(job.src);
  const rawBase = job.forcedBaseName ?? slugifyFilename(stripDupSuffix(path.basename(job.src, path.extname(job.src))));
  await mkdir(job.outDir, { recursive: true });

  let img;
  try {
    img = sharp(job.src, { failOn: 'none' });
    var metadata = await img.metadata();
  } catch (err) {
    report.skipped.push({ file: job.src, reason: `sharp could not read image: ${err.message}` });
    return;
  }
  if (!metadata.width || !metadata.height) {
    report.skipped.push({ file: job.src, reason: 'no readable dimensions' });
    return;
  }

  const relKeyDir = path.relative(OUT_IMG, job.outDir).split(path.sep).join('/');
  const totalIn = srcStat.size;
  let totalOut = 0;

  // Event photos are bucketed per-slug (assets/data/images/events/<slug>.json)
  // instead of the main images.json, so event.html only ever fetches the
  // metadata for the one event it's rendering — not all ~1,400 event photos.
  const bucket = job.eventSlug ? (report.eventImages[job.eventSlug] ??= {}) : report.images;

  if (job.kind === 'mark') {
    const outName = `${rawBase}.webp`;
    const outPath = path.join(job.outDir, outName);
    const key = relKeyDir ? `${relKeyDir}/${outName}` : outName;
    if (await outputIsFresh(outPath, srcStat.mtimeMs) && prevImages[key]) {
      bucket[key] = prevImages[key];
      report.map.push([path.relative(SOURCE, job.src), path.relative(ROOT, outPath), 'skipped (fresh)']);
      return;
    }
    const hasAlpha = metadata.hasAlpha;
    await img.webp({ nearLossless: true, quality: 95, alphaQuality: 100 }).toFile(outPath);
    const outStat = await stat(outPath);
    totalOut += outStat.size;
    bucket[key] = { w: metadata.width, h: metadata.height, lqip: null, variants: null };
    report.map.push([path.relative(SOURCE, job.src), path.relative(ROOT, outPath), `${fmtBytes(totalIn)} -> ${fmtBytes(totalOut)}${hasAlpha ? ' (alpha)' : ''}`]);
    report.bytesIn += totalIn; report.bytesOut += totalOut; report.converted++;
    return;
  }

  if (job.kind === 'hero') {
    const mainName = `${job.baseName}.webp`;
    const mainPath = path.join(job.outDir, mainName);
    const key = mainName;
    const widths = RESPONSIVE_WIDTHS.filter(w => w <= metadata.width);
    if (widths.length === 0) widths.push(metadata.width);
    const allFresh = await outputIsFresh(mainPath, srcStat.mtimeMs) &&
      (await Promise.all(widths.map(w => outputIsFresh(path.join(job.outDir, `${job.baseName}-${w}.webp`), srcStat.mtimeMs)))).every(Boolean);
    if (allFresh && prevImages[key]) {
      bucket[key] = prevImages[key];
      report.map.push([path.relative(SOURCE, job.src), path.relative(ROOT, mainPath), 'skipped (fresh)']);
      return;
    }
    await img.clone().resize({ width: Math.min(1920, metadata.width) }).webp({ quality: 82 }).toFile(mainPath);
    totalOut += (await stat(mainPath)).size;
    const variants = {};
    for (const w of widths) {
      const vName = `${job.baseName}-${w}.webp`;
      const vPath = path.join(job.outDir, vName);
      await img.clone().resize({ width: w }).webp({ quality: 82 }).toFile(vPath);
      totalOut += (await stat(vPath)).size;
      variants[w] = vName;
    }
    const lqip = await makeLqip(img);
    bucket[key] = { w: metadata.width, h: metadata.height, lqip, variants };
    report.map.push([path.relative(SOURCE, job.src), path.relative(ROOT, mainPath), `${fmtBytes(totalIn)} -> ${fmtBytes(totalOut)} (+${widths.length} variants)`]);
    report.bytesIn += totalIn; report.bytesOut += totalOut; report.converted++;
    return;
  }

  // photo / artwork — responsive set, no separate "main" file beyond the
  // largest-appropriate variant, which also serves as the <img src> default.
  // preserveNative jobs (the per-initiative photo folders) additionally keep
  // the source's own native width as a variant on top of the standard grid,
  // so nothing above 1920px ever gets capped away, and — when the source is
  // already WebP — that native-width variant is a byte-for-byte copy rather
  // than a lossy re-encode of a lossy file.
  const widths = RESPONSIVE_WIDTHS.filter(w => w <= metadata.width);
  if (widths.length === 0) widths.push(metadata.width);
  if (job.preserveNative && widths[widths.length - 1] !== metadata.width) widths.push(metadata.width);
  const key = `${relKeyDir}/${rawBase}.webp`;
  const outPaths = widths.map(w => path.join(job.outDir, `${rawBase}-${w}.webp`));
  const allFresh = (await Promise.all(outPaths.map(p => outputIsFresh(p, srcStat.mtimeMs)))).every(Boolean);
  if (allFresh && prevImages[key]) {
    bucket[key] = prevImages[key];
    report.map.push([path.relative(SOURCE, job.src), path.relative(ROOT, outPaths[outPaths.length - 1]), 'skipped (fresh)']);
    return;
  }
  const variants = {};
  let nativeOutPath = null;
  for (let i = 0; i < widths.length; i++) {
    const w = widths[i];
    const vName = `${rawBase}-${w}.webp`;
    const vPath = outPaths[i];
    if (w === metadata.width && type === 'webp') {
      // Already WebP at its own native size — copy verbatim, no re-encode.
      await (await import('node:fs/promises')).copyFile(job.src, vPath);
    } else {
      await img.clone().resize({ width: w }).webp({ quality: job.quality }).toFile(vPath);
    }
    if (w === metadata.width) nativeOutPath = vPath;
    totalOut += (await stat(vPath)).size;
    variants[w] = `${relKeyDir}/${vName}`;
  }
  const lqip = await makeLqip(img);
  bucket[key] = { w: metadata.width, h: metadata.height, lqip, variants };

  let ssimNote = '';
  if (job.ssimCheck && nativeOutPath) {
    try {
      const score = await ssimScore(job.src, nativeOutPath);
      ssimNote = ` [SSIM ${score.toFixed(4)}]`;
      if (score < 0.9) {
        report.map.push([path.relative(SOURCE, job.src), path.relative(ROOT, nativeOutPath), `WARNING: low SSIM fidelity (${score.toFixed(4)})`]);
      }
    } catch (err) {
      ssimNote = ` [SSIM check failed: ${err.message}]`;
    }
  }

  report.map.push([path.relative(SOURCE, job.src), path.relative(ROOT, outPaths[outPaths.length - 1]), `${fmtBytes(totalIn)} -> ${fmtBytes(totalOut)} (${widths.length} variants)${ssimNote}`]);
  report.bytesIn += totalIn; report.bytesOut += totalOut; report.converted++;
}

// ---- main ---------------------------------------------------------------

async function main() {
  await mkdir(OUT_IMG, { recursive: true });
  await mkdir(DATA_DIR, { recursive: true });
  const eventsDataDir = path.join(DATA_DIR, 'images', 'events');
  await mkdir(eventsDataDir, { recursive: true });

  // Freshness checks read across both the main index and any existing
  // per-event chunks — merged, since keys are globally unique.
  let prevImages = {};
  try {
    prevImages = JSON.parse(await readFile(IMAGES_JSON, 'utf8'));
  } catch { /* first run */ }
  try {
    for (const f of await (await import('node:fs/promises')).readdir(eventsDataDir)) {
      if (!f.endsWith('.json')) continue;
      Object.assign(prevImages, JSON.parse(await readFile(path.join(eventsDataDir, f), 'utf8')));
    }
  } catch { /* first run */ }

  const { jobs, skipped: preSkipped } = await buildJobs();
  const report = { images: {}, eventImages: {}, map: [], skipped: [...preSkipped], bytesIn: 0, bytesOut: 0, converted: 0 };

  console.log(`Found ${jobs.length} candidate files across source/. Processing with concurrency ${CONCURRENCY}...`);
  await pool(jobs, CONCURRENCY, job => processJob(job, prevImages, report));

  // assets/data/images.json holds everything EXCEPT event photos (logos,
  // cosmosfoundation, cosmos-gallery, hero). Event photos — ~95% of all
  // entries — are split one JSON file per event under
  // assets/data/images/events/<slug>.json, so event.html and events.html
  // never have to download metadata for events they aren't showing.
  // Placeholder portraits (assets/img/placeholders/) are hand-drawn SVGs
  // rasterised outside this pipeline — there is no source photograph to
  // convert — but they must stay in images.json or every board entry using
  // one renders nothing. Carry them across from the previous index so a
  // re-run doesn't drop them.
  for (const [key, meta] of Object.entries(prevImages)) {
    if (key.startsWith('placeholders/') && !report.images[key]) report.images[key] = meta;
  }

  await writeFile(IMAGES_JSON, JSON.stringify(report.images, null, 2));
  for (const [slug, entries] of Object.entries(report.eventImages)) {
    await writeFile(path.join(eventsDataDir, `${slug}.json`), JSON.stringify(entries, null, 2));
  }

  console.log('\n=== Image pipeline report ===');
  console.log(`Converted: ${report.converted} source files`);
  console.log(`Total in:  ${fmtBytes(report.bytesIn)}`);
  console.log(`Total out: ${fmtBytes(report.bytesOut)}`);
  if (report.bytesIn > 0) {
    const pct = (100 * (1 - report.bytesOut / Math.max(report.bytesIn, 1))).toFixed(1);
    console.log(`Savings:   ${pct}% (on newly converted files only)`);
  }
  console.log(`Skipped:   ${report.skipped.length}`);
  for (const s of report.skipped) console.log(`  - ${path.relative(ROOT, s.file)}: ${s.reason}`);

  const mapPath = path.join(ROOT, 'tools', 'image-map.tsv');
  await writeFile(mapPath, report.map.map(r => r.join('\t')).join('\n') + '\n');
  const eventEntryCount = Object.values(report.eventImages).reduce((n, o) => n + Object.keys(o).length, 0);
  console.log(`\nFull source -> output map written to ${path.relative(ROOT, mapPath)}`);
  console.log(`images.json written to ${path.relative(ROOT, IMAGES_JSON)} (${Object.keys(report.images).length} entries)`);
  console.log(`${Object.keys(report.eventImages).length} per-event chunks written to ${path.relative(ROOT, eventsDataDir)} (${eventEntryCount} entries total)`);
}

main().catch(err => { console.error(err); process.exit(1); });
