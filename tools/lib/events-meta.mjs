// Shared parsing logic for source/events/<folder> names.
// Used by both convert-images.mjs (to know the output slug for each event's
// photos) and scan-events.mjs (to build assets/data/events.js). Keeping this
// in one place means the two tools can never disagree on a slug.

const MONTHS = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4,
  may: 5, jun: 6, june: 6, jul: 7, july: 7, aug: 8, august: 8,
  sep: 9, sept: 9, september: 9, oct: 10, october: 10, nov: 11, november: 11,
  dec: 12, december: 12
};

const FOLDER_RE = /^(\d{1,2})\s+([A-Za-z]+)(?:'(\d{2})|\s+(\d{4}))\s*\((.+)\)\s*$/;

// One entry per real folder on disk. Editable here without touching the
// parser below — this is the map the client (or backend dev) adjusts if
// wording needs to change.
export const TITLE_OVERRIDES = {
  "10 Aug'23 (Philippines Ambassador -Welcome Dinner)": 'Philippines Ambassador — Welcome Dinner',
  "11 November 2023 (Jamil Khan-Art Exhibition)": 'Jamil Khan — Art Exhibition',
  "11 Oct'25 (Netherlands Ambassador-Welcome Dinner)": 'Netherlands Ambassador — Welcome Dinner',
  "13 Feb'25 (Jamil Khan-Art Event)": 'Jamil Khan — Art Event',
  "14 Dec'25 (Thai Ambassador-Welcome dinner)": 'Thai Ambassador — Welcome Dinner',
  '14 December 2023 (Rickshaw Art Exhibition)': 'Rickshaw Art Exhibition',
  '19 February 2024 (Cosmos Dialogue-Goerge Yeo)': 'Cosmos Dialogue — George Yeo',
  '22 August 2026 (Annua District Correspodent Conference 2026)': 'Annual District Correspondent Conference 2026',
  "22 Feb'25 (Live Drawing and Exhibition)": 'Live Drawing and Exhibition',
  '22 June 2023 (Cosmos Dialogue Bangladesh-Nepal)': 'Cosmos Dialogue: Bangladesh–Nepal',
  '25 July 2023 (British High Commissioner -Welcome Dinner)': 'British High Commissioner — Welcome Dinner',
  "27 January 2024 (B'Desh-South Korea)": 'Cosmos Dialogue: Bangladesh–South Korea',
  "5 March'25 (Ketnote Session-Ambassador Milam)": 'Keynote Session — Ambassador Milam',
  '7 September 2023 (Korea Ambassador-Welcome Dinner)': 'Korea Ambassador — Welcome Dinner'
};

// Events page has no category grouping — each of the 14 folders is its own
// section, sorted by date. This table only assigns each event its own
// accent ink (by the kind of occasion it is), purely a visual-identity
// lookup, not a rendering/grouping structure. Kept as an editable table
// rather than inferred by regex at runtime.
export const EVENT_INK_GROUPS = [
  { ink: 'var(--terra)',
    slugs: ['thai-ambassador-welcome-dinner', 'netherlands-ambassador-welcome-dinner', 'korea-ambassador-welcome-dinner', 'philippines-ambassador-welcome-dinner', 'british-high-commissioner-welcome-dinner'] },
  { ink: 'var(--teal)',
    slugs: ['cosmos-dialogue-george-yeo', 'cosmos-dialogue-bangladesh-south-korea', 'cosmos-dialogue-bangladesh-nepal'] },
  { ink: 'var(--green)',
    slugs: ['live-drawing-and-exhibition', 'jamil-khan-art-event', 'rickshaw-art-exhibition', 'jamil-khan-art-exhibition'] },
  { ink: 'var(--gold)',
    slugs: ['annual-district-correspondent-conference-2026', 'keynote-session-ambassador-milam'] }
];

export function slugify(text) {
  return text
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/['’]/g, '')
    .replace(/[:–—]/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function parseFolderName(folderName) {
  const m = FOLDER_RE.exec(folderName.trim());
  if (!m) {
    throw new Error(`Cannot parse event folder name: "${folderName}"`);
  }
  const [, dayStr, monthName, yy, yyyy, rawTitleInParens] = m;
  const month = MONTHS[monthName.toLowerCase()];
  if (!month) {
    throw new Error(`Unrecognised month "${monthName}" in folder "${folderName}"`);
  }
  const day = Number(dayStr);
  const year = yyyy ? Number(yyyy) : 2000 + Number(yy);
  const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const title = TITLE_OVERRIDES[folderName.trim()] ?? rawTitleInParens.trim();
  const slug = slugify(title);

  let ink = null;
  for (const g of EVENT_INK_GROUPS) {
    if (g.slugs.includes(slug)) { ink = g.ink; break; }
  }
  if (!ink) {
    throw new Error(`No accent ink assigned for slug "${slug}" (folder "${folderName}"). Add it to EVENT_INK_GROUPS in tools/lib/events-meta.mjs.`);
  }

  return { isoDate: iso, rawTitle: rawTitleInParens.trim(), title, slug, ink };
}
