#!/usr/bin/env node
// Walks source/events/<folder> and generates assets/data/events.js — the
// single source of truth for events.html, event.html and the homepage's
// Recent Events strip. Run after tools/convert-images.mjs (it reads the
// already-converted files in assets/img/events/<slug>/ to build galleries).
//
// Events page has NO category grouping: each of the 14 folders is its own
// section. This script emits a flat EVENTS array sorted by date descending
// — that's the whole "grouping" there is.
//
// Galleries are CURATED. tools/lib/event-copy.mjs carries a hand-picked
// `picks` list per event, and this script writes exactly those photographs
// — in that order, with their captions — to assets/data/galleries/<slug>.json,
// prunes assets/data/images/events/<slug>.json to match, and takes the
// event's cover from the first pick. Unselected photographs are not
// written anywhere; source/events/ still holds every original.
//
// Run: node tools/scan-events.mjs

import { readdir, mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFolderName } from './lib/events-meta.mjs';
import { EVENT_COPY, DEFAULT_VENUE, COVER_OVERRIDES } from './lib/event-copy.mjs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const EVENTS_SRC = path.join(ROOT, 'source', 'events');
const EVENT_IMAGES_DIR = path.join(ROOT, 'assets', 'data', 'images', 'events');
const COVERS_JSON = path.join(ROOT, 'assets', 'data', 'images', 'event-covers.json');
const OUT_FILE = path.join(ROOT, 'assets', 'data', 'events.js');
const GALLERIES_DIR = path.join(ROOT, 'assets', 'data', 'galleries');

// There is no automatic fallback selection any more. Every event carries a
// hand-picked `picks` list, the site shows those photographs and only
// those, and an event that somehow arrives without one is a hard build
// failure rather than a page quietly filled with an arbitrary sample.

async function main() {
  let folders;
  try {
    folders = (await readdir(EVENTS_SRC, { withFileTypes: true })).filter(e => e.isDirectory()).map(e => e.name);
  } catch {
    throw new Error(`No source/events directory found at ${EVENTS_SRC}`);
  }

  const events = [];
  const reportRows = [];
  const covers = {};

  for (const folder of folders) {
    // Every failure below throws (not warns-and-continues) — a missing or
    // misparsed event must break the build loudly, never silently drop a
    // folder from the output.
    const meta = parseFolderName(folder); // throws with the folder name on any parse failure

    const copy = EVENT_COPY[meta.slug];
    if (!copy) {
      throw new Error(`No copy entry in tools/lib/event-copy.mjs for slug "${meta.slug}" (folder "${folder}")`);
    }

    let eventImages = {};
    try {
      eventImages = JSON.parse(await readFile(path.join(EVENT_IMAGES_DIR, `${meta.slug}.json`), 'utf8'));
    } catch {
      console.error(`WARNING: no image chunk for "${meta.slug}" — run tools/convert-images.mjs first. Continuing with an empty gallery.`);
    }
    const keys = Object.keys(eventImages).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    // Suppressed photos. Unlike picking (which only decides what the page
    // leads with), exclusion removes a photo from the gallery file
    // altogether — so it is absent from the featured grid AND from the
    // the slideshow, the carousels and the cover — everywhere on the site.
    // Used for frames the client doesn't want published at all.
    //
    // The source files under source/events/ are untouched: this suppresses
    // a photo from the site, it doesn't delete anyone's photograph.
    const excluded = new Set(copy.excluded ?? []);
    for (const src of excluded) {
      if (!keys.includes(src)) {
        // Not an error: once the image chunk has been pruned to the
        // selection (below), a suppressed photo is legitimately absent from
        // it. The entry is kept so that a fresh `node tools/convert-images.mjs`
        // run, which restores every photo from source/, suppresses it again.
        console.warn(`note: exclusion for "${meta.slug}" is not in the current image chunk (already pruned): ${path.basename(src)}`);
      }
    }
    const visibleKeys = keys.filter(k => !excluded.has(k));

    // Hand-picked selection, from event-copy.mjs. Every pick must name a
    // photo that actually exists in this event's image chunk —
    // a typo'd or stale filename is a hard failure, never a silently
    // dropped photo.
    const known = new Set(visibleKeys);
    const picks = copy.picks ?? [];
    for (const pick of picks) {
      if (excluded.has(pick.src)) {
        throw new Error(`Pick for "${meta.slug}" names an EXCLUDED photo — remove it from one list or the other: ${pick.src}`);
      }
      if (!known.has(pick.src)) {
        throw new Error(
          `Pick for "${meta.slug}" names a photo that isn't in this event's image chunk: ${pick.src}\n`
          + `  If you are selecting new photographs, the chunk has been pruned to the previous\n`
          + `  selection — re-run \`node tools/convert-images.mjs\` to restore every photo from source/.`
        );
      }
    }
    const seenPick = new Set();
    for (const pick of picks) {
      if (seenPick.has(pick.src)) throw new Error(`Duplicate pick for "${meta.slug}": ${pick.src}`);
      seenPick.add(pick.src);
    }

    if (!picks.length) {
      throw new Error(
        `No picks for "${meta.slug}". Every event must have a hand-picked selection — `
        + `the site has no fallback to the whole source folder. Select its photographs `
        + `and add a picks: [...] list to tools/lib/event-copy.mjs.`
      );
    }
    const featuredSrcs = picks.map(p => p.src);
    const captionBySrc = new Map(picks.map(p => [p.src, p.caption || '']));

    // The gallery file IS the selection: one entry per selected photograph,
    // already in display order. Unselected photos are not written at all —
    // there is no "show everything" view left to serve them to, and
    // shipping their metadata would just be dead payload on every event
    // page. The source folder still holds every original.
    const gallery = featuredSrcs.map(k => ({
      src: k, // canonical key into assets/data/images/events/<slug>.json — resolved via assets/js/img.js
      caption: captionBySrc.get(k) ?? '',
      credit: ''
    }));

    // The cover is the event's first pick unless overridden. It appears on
    // events.html, the homepage Recent Events strip and as og:image, so it
    // must be one of the selected photographs — otherwise an unselected
    // photo leaks onto the site and its image files stay alive.
    const cover = COVER_OVERRIDES[meta.slug] ?? featuredSrcs[0];
    if (!featuredSrcs.includes(cover)) {
      throw new Error(
        `Cover for "${meta.slug}" is not one of its selected photographs: ${cover}. `
        + `Remove the COVER_OVERRIDES entry or add that photo to picks.`
      );
    }
    if (cover && eventImages[cover]) covers[cover] = eventImages[cover];

    // The full gallery (one entry per photo — up to 170+ for some events)
    // lives in its own per-event file, fetched on demand rather than
    // inlined into events.js, so pages that only need titles/covers for
    // events they aren't currently showing full-size don't pull every
    // event's entire photo list.
    await mkdir(GALLERIES_DIR, { recursive: true });
    await writeFile(path.join(GALLERIES_DIR, `${meta.slug}.json`), JSON.stringify(gallery, null, 2));

    // Prune the image chunk to the selection too. event.html fetches this
    // file on every visit, and metadata (dimensions, variant lists, LQIP
    // data-URIs) for photographs the page can no longer show is pure
    // payload. Restore the full chunk with `node tools/convert-images.mjs`
    // whenever the selection needs to change.
    const prunedChunk = {};
    for (const k of featuredSrcs) if (eventImages[k]) prunedChunk[k] = eventImages[k];
    await writeFile(
      path.join(EVENT_IMAGES_DIR, `${meta.slug}.json`),
      JSON.stringify(prunedChunk, null, 2)
    );

    const event = {
      id: meta.slug,
      title: meta.title,
      date: meta.isoDate,
      // Per-event override, because not every event was at Cosmos Centre —
      // e.g. the Jamil Khan solo show was at the Garden Gallery in
      // Baridhara, which the exhibition banner in its own photos states.
      venue: copy.venue ?? DEFAULT_VENUE,
      kicker: copy.kicker,
      excerpt: copy.excerpt,
      body: copy.body,
      pullquote: copy.pullquote ?? null,
      facts: copy.facts ?? [],
      cover,
      galleryCount: gallery.length,
      excludedCount: excluded.size,
      tags: copy.tags,
      ink: meta.ink
    };
    events.push(event);
    reportRows.push({ slug: meta.slug, iso: meta.isoDate, title: meta.title, images: gallery.length, sourceFolder: folder, excluded: excluded.size });
  }

  if (events.length !== folders.length) {
    throw new Error(`Parsed ${events.length} events but found ${folders.length} folders.`);
  }

  events.sort((a, b) => b.date.localeCompare(a.date));

  const missingImages = reportRows.filter(r => r.images === 0);

  const header = `// AUTO-GENERATED by tools/scan-events.mjs — do not hand-edit.
// Regenerate with: node tools/scan-events.mjs
// Shape mirrors a REST response: GET /api/events (sorted by date, descending)
// Each event's full photo gallery lives separately at
// assets/data/galleries/<slug>.json (GET /api/events/{slug}/gallery),
// fetched on demand — see assets/js/pages/event.js and events.js.
`;
  const body = `export const EVENTS = ${JSON.stringify(events, null, 2)};\n`;

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, header + body);
  await writeFile(COVERS_JSON, JSON.stringify(covers, null, 2));

  console.log('\n=== Event scan report ===');
  console.log(`Folders found: ${folders.length}`);
  console.log(`Events parsed: ${events.length}\n`);
  console.log('slug'.padEnd(46) + 'date'.padEnd(12) + 'selected'.padEnd(10) + 'title');
  for (const r of events) {
    console.log(r.id.padEnd(46) + r.date.padEnd(12) + String(r.galleryCount).padEnd(10) + r.title);
  }

  const totalShown = events.reduce((n, e) => n + e.galleryCount, 0);
  const totalExcluded = events.reduce((n, e) => n + e.excludedCount, 0);
  console.log(`\n${totalShown} selected photographs across ${events.length} events.`);
  if (totalExcluded) {
    console.log(`${totalExcluded} photograph(s) explicitly suppressed (see \`excluded\` in event-copy.mjs); source files untouched.`);
  }
  if (missingImages.length) {
    console.log(`\nWARNING: ${missingImages.length} event(s) have zero images — run tools/convert-images.mjs first if this is unexpected:`);
    for (const r of missingImages) console.log(`  - ${r.slug} (${r.sourceFolder})`);
  }
  console.log(`\nAll ${events.length}/${folders.length} folders parsed successfully.`);
  console.log(`Written to ${path.relative(ROOT, OUT_FILE)}`);
  console.log(`Cover image metadata (${Object.keys(covers).length} entries) written to ${path.relative(ROOT, COVERS_JSON)}`);
  console.log(`Per-event galleries written to ${path.relative(ROOT, GALLERIES_DIR)}`);
}

main().catch(err => { console.error(`FATAL: ${err.message}`); process.exit(1); });
