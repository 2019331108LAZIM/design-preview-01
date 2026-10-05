#!/usr/bin/env node
// Automated pre-launch checks: dead internal links, missing images,
// stray references to source/ or uploads/, <img> tags missing width/height
// or alt, duplicate ids, typography rules (the display serif never below
// 24px), and unresolved draft claims in event copy.
// Run: node tools/verify.mjs

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

// Draft claims in event copy — anything wrapped [[? … ]] in
// tools/lib/event-copy.mjs. These render highlighted on the event page on
// purpose, and this check is the gate that stops them reaching go-live:
// each one is either confirmed (correct the text, drop the brackets) or
// cut. Reported separately from the structural problems above because
// they're a content task for the client, not a build error.
const drafts = [];

async function checkDraftClaims() {
  const file = path.join(ROOT, 'tools', 'lib', 'event-copy.mjs');
  if (!(await exists(file))) return;
  filesChecked++;
  const { EVENT_COPY } = await import(`file://${file}`);

  for (const [slug, copy] of Object.entries(EVENT_COPY)) {
    const fields = [
      ['excerpt', copy.excerpt],
      ...(copy.body ?? []).map((b, i) => [`body[${i}]`, b]),
      ...(copy.facts ?? []).map(f => [`facts.${f.label}`, f.value]),
      ...(copy.pullquote ? [['pullquote', copy.pullquote.text]] : [])
    ];
    for (const [where, text] of fields) {
      for (const m of String(text ?? '').matchAll(/\[\[\?([\s\S]*?)\]\]/g)) {
        drafts.push({ slug, where, text: m[1].trim().replace(/\s+/g, ' ') });
      }
    }
  }
}

// Every photo named in a `picks` list must exist in that event's image
// chunk. scan-events.mjs already throws on this, but checking here too
// means a bad paste into event-copy.mjs is caught by the same one command
// the rest of the pre-launch checks run under.
async function checkPicks() {
  const file = path.join(ROOT, 'tools', 'lib', 'event-copy.mjs');
  if (!(await exists(file))) return;
  const { EVENT_COPY } = await import(`file://${file}`);

  for (const [slug, copy] of Object.entries(EVENT_COPY)) {
    const picks = copy.picks ?? [];
    if (!picks.length) continue;
    const chunk = path.join(ROOT, 'assets', 'data', 'images', 'events', `${slug}.json`);
    if (!(await exists(chunk))) {
      fail(chunk, `picks defined for "${slug}" but no image chunk exists`);
      continue;
    }
    const known = new Set(Object.keys(JSON.parse(await readFile(chunk, 'utf8'))));
    for (const pick of picks) {
      if (!known.has(pick.src)) fail(file, `pick for "${slug}" names a photo not in that event: ${pick.src}`);
    }
  }
}

// ---- typography rules (see assets/css/tokens.css) --------------------
// The display serif is a high-contrast face whose thin strokes vanish at
// small sizes, so it is restricted to display type: 24px and up, and never
// on body copy, UI or card/metadata text. This check reads every CSS rule
// that applies var(--font-display) and fails if the same rule sets a
// font-size below the floor — including the floor of a clamp(), which is
// what a narrow viewport actually renders.
const DISPLAY_MIN_PX = 24;

function smallestPx(fontSize) {
  // clamp(24px, 2.6vw, 32px) -> 24 ; 21px -> 21 ; 4.6em -> null (relative)
  const clamp = fontSize.match(/clamp\(\s*([0-9.]+)px/);
  if (clamp) return parseFloat(clamp[1]);
  const abs = fontSize.match(/^\s*([0-9.]+)px\s*$/);
  if (abs) return parseFloat(abs[1]);
  return null; // em/rem/%/inherit — sized by an ancestor, can't judge here
}

async function checkTypography() {
  const cssRoot = path.join(ROOT, 'assets', 'css');
  const files = (await walk(cssRoot)).filter(f => f.endsWith('.css'));

  for (const file of files) {
    filesChecked++;
    const css = await readFile(file, 'utf8');

    // crude but sufficient rule splitter: selector { declarations }
    for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const [, selector, body] = m;
      if (!/var\(--font-display\)/.test(body)) continue;

      // font-size: <v>;  or the shorthand  font: <weight> <size>/<lh> <family>
      const long = body.match(/font-size:\s*([^;]+)/);
      const short = body.match(/font:\s*[^;]*?([0-9.]+px)\s*\//);
      const size = long ? long[1] : (short ? short[1] : null);
      if (!size) continue;

      const px = smallestPx(size);
      if (px !== null && px < DISPLAY_MIN_PX) {
        fail(file, `display serif at ${px}px on "${selector.trim()}" — `
          + `--font-display is for ${DISPLAY_MIN_PX}px and up; use var(--font-body) below that`);
      }
    }
  }

  // The condensed label family was retired; --font-label now aliases the
  // body face. Catch any attempt to reintroduce a separate condensed
  // stack for small uppercase text.
  // Read the declaration's value and compare it, rather than trying to
  // express "not this value" as a lookahead — `\s*` can match zero
  // characters, which makes the lookahead test the leading space and
  // pass on exactly the value it was meant to accept.
  const tokensPath = path.join(cssRoot, 'tokens.css');
  const tokens = await readFile(tokensPath, 'utf8');
  const label = tokens.match(/--font-label:\s*([^;]+);/);
  if (!label) {
    fail(tokensPath, '--font-label is not defined');
  } else if (label[1].trim() !== 'var(--font-body)') {
    fail(tokensPath,
      `--font-label should alias var(--font-body) (found: ${label[1].trim()}) — `
      + 'small UI text must not use a separate condensed family');
  }
}

// Board entries still waiting on a real name, portrait and biography.
// Reported, not failed: a placeholder roster is a deliberate interim state
// (see the header of assets/data/board.js), unlike a draft claim, which is
// an unverified assertion about a real person and does block go-live.
const boardPending = [];

async function checkBoardPlaceholders() {
  const file = path.join(ROOT, 'assets', 'data', 'board.js');
  if (!(await exists(file))) return;
  filesChecked++;
  // Read as text rather than import(): assets/data/*.js are ES modules but
  // package.json declares CommonJS, so Node refuses to import them. The
  // browser loads them as modules via <script type="module">, which is why
  // the extension has never mattered at runtime.
  const src = await readFile(file, 'utf8');

  const groupsLine = src.match(/export const GROUPS\s*=\s*\[([^\]]*)\]/);
  const groups = groupsLine
    ? [...groupsLine[1].matchAll(/'([^']*)'|"([^"]*)"/g)].map(m => m[1] ?? m[2])
    : [];

  // One record per `{ id: … }` block; only the fields this report needs.
  for (const block of src.split(/\n  \{\n/).slice(1)) {
    if (!/placeholder:\s*true/.test(block)) continue;
    const name = block.match(/name:\s*'([^']*)'/)?.[1] ?? '(unnamed)';
    const role = block.match(/role:\s*'([^']*)'/)?.[1] ?? '(no role)';
    const gi = Number(block.match(/group:\s*(\d+)/)?.[1] ?? -1);
    boardPending.push({ group: groups[gi] ?? '?', name, role });
  }
}

async function main() {
  for (const f of await pageFiles()) await checkHtmlFile(f);
  await checkTypography();
  await checkJsFiles();
  await checkImageDataIntegrity();
  await checkPicks();
  await checkDraftClaims();
  await checkBoardPlaceholders();

  console.log(`Checked ${filesChecked} files.`);
  if (problems.length) {
    console.log(`\n${problems.length} problem(s) found:\n`);
    for (const p of problems) console.log(`  ✗ ${p}`);
  }

  if (drafts.length) {
    const bySlug = new Map();
    for (const d of drafts) {
      if (!bySlug.has(d.slug)) bySlug.set(d.slug, []);
      bySlug.get(d.slug).push(d);
    }
    console.log(`\n${drafts.length} unconfirmed draft claim(s) in event copy, across ${bySlug.size} event(s).`);
    console.log('These are highlighted on the live page and BLOCK go-live. For each one:');
    console.log('confirm it and delete the [[? ]] brackets, or delete the sentence.');
    console.log('Edit tools/lib/event-copy.mjs, then re-run `node tools/scan-events.mjs`.\n');
    for (const [slug, items] of bySlug) {
      console.log(`  ${slug} (${items.length})`);
      for (const d of items) {
        const snip = d.text.length > 88 ? `${d.text.slice(0, 88)}…` : d.text;
        console.log(`    · ${d.where}: ${snip}`);
      }
    }
  }

  if (boardPending.length) {
    const byGroup = new Map();
    for (const p of boardPending) {
      if (!byGroup.has(p.group)) byGroup.set(p.group, []);
      byGroup.get(p.group).push(p);
    }
    console.log(`\n${boardPending.length} board entr(ies) still on placeholder content.`);
    console.log('Not a launch blocker — they are marked as pending on the page — but each');
    console.log('needs a real name, portrait and biography in assets/data/board.js.\n');
    for (const [group, list] of byGroup) {
      console.log(`  ${group} (${list.length})`);
      for (const p of list) console.log(`    · ${p.name} — ${p.role}`);
    }
  }

  if (problems.length || drafts.length) {
    process.exitCode = 1;
  } else {
    console.log('No problems found.');
  }
}

main().catch(err => { console.error(err); process.exit(1); });
