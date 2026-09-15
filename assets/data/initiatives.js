// The four initiatives. Copy is paraphrased (not pasted verbatim) from the
// facts supplied by the client — see the "initiative images, SVG logos,
// real copy" chunk brief. No dates, numbers or claims beyond what was
// supplied: there is no founding year for Gallery Cosmos or Cosmos Atelier
// 71 in the source material, so none is asserted here. Every hero/gallery
// image is sourced from that initiative's own folder under
// source/Initiatives/ (converted to assets/img/initiatives/<slug>/) — never
// a shared or borrowed bucket — so this file is the single place that maps
// initiative -> image set (see about.js, initiatives.html, initiative.html,
// all of which read hero/gallery/logo from here rather than hardcoding a
// path of their own).
// Shape mirrors: GET /api/initiatives/{key}
export const INITS = {
  gallery: {
    key: 'gallery', name: 'Gallery Cosmos', eyebrow: 'Fine Art Space · Cosmos Centre', ink: 'var(--terra)',
    logo: 'logos/gallery-cosmos.svg', logoW: 967, logoH: 388, hero: 'initiatives/gallery-cosmos/page2-24.webp',
    galleryTitle: 'From the collection',
    tagline: 'A contemporary art space built for creative interventions among Bangladeshi artists — and the home of one of the country’s largest collections of modern and contemporary work.',
    p1: 'Gallery Cosmos hosts creative interventions and collaborations among the artists pushing at the edges of Bangladesh’s art scene, through a programme spanning exhibitions traditional and modern, artist talks, workshops, art camps, exchange programmes, residencies, sponsorships, publishing, grants, scholarships and awards.',
    p2: 'Its holdings are among the country’s largest: more than 11,000 paintings, sculptures, prints and photographs of modern and contemporary work.',
    facts: [
      { k: 'Collection', v: '11,000+ works' }, { k: 'Medium', v: 'Painting · Sculpture · Print · Photography' },
      { k: 'Programme', v: 'Exhibitions · Talks · Workshops · Residencies' }, { k: 'Location', v: 'Cosmos Centre, Dhaka' }
    ],
    gallery: [
      { src: 'initiatives/gallery-cosmos/page2-24.webp', cap: 'A painting from the Gallery Cosmos collection' },
      { src: 'initiatives/gallery-cosmos/page1-10.webp', cap: 'A sculpture from the Gallery Cosmos collection' },
      { src: 'initiatives/gallery-cosmos/cosmos-gallery.webp', cap: 'A work from the Gallery Cosmos collection' },
      { src: 'initiatives/gallery-cosmos/page4-36.webp', cap: '“Art Against Fake News”, a Gallery Cosmos exhibition' },
      { src: 'initiatives/gallery-cosmos/page4-38.webp', cap: 'Visitors at a Gallery Cosmos exhibition opening' },
      { src: 'initiatives/gallery-cosmos/page6-48.webp', cap: 'Printmakers with a finished edition' },
      { src: 'initiatives/gallery-cosmos/page7-60.webp', cap: 'A work from the Gallery Cosmos collection' },
      { src: 'initiatives/gallery-cosmos/wild-team-1.webp', cap: 'A painting from the Gallery Cosmos collection' }
    ]
  },
  atelier: {
    key: 'atelier', name: 'Cosmos Atelier 71', eyebrow: 'Printmaking Studio · Cosmos Centre', ink: 'var(--teal)',
    logo: 'logos/cosmos-atelier-71.svg', logoW: 1241, logoH: 338, hero: 'initiatives/cosmos-atelier-71/cosmos-atelier-1.webp',
    galleryTitle: 'Editions &amp; the studio floor',
    tagline: 'A printmaking studio built around equipment new to Bangladesh — and, with its residency programme, one of South Asia’s more sought-after print destinations.',
    p1: 'Cosmos Atelier 71 is a printmaking studio built around equipment new to Bangladesh, opening fresh ground for the arts here.',
    p2: 'A residency programme brings artists from across the region and beyond to work alongside the studio’s own printmakers — combined with the gallery and printmaking facilities, it has made Atelier 71 one of the more sought-after print destinations in South Asia.',
    facts: [
      { k: 'Discipline', v: 'Printmaking' }, { k: 'Residency', v: 'Artists from the region and beyond' },
      { k: 'Reach', v: 'A leading print studio in South Asia' }, { k: 'Location', v: 'Cosmos Centre, Dhaka' }
    ],
    gallery: [
      { src: 'initiatives/cosmos-atelier-71/cosmos-atelier-1.webp', cap: 'The press floor at Cosmos Atelier 71' },
      { src: 'initiatives/cosmos-atelier-71/cosmos-atelier-2.webp', cap: 'Presses and inking tables' },
      { src: 'initiatives/cosmos-atelier-71/cosmos-atelier-3.webp', cap: 'The studio floor' }
    ]
  },
  wild: {
    key: 'wild', name: 'WildTeam', eyebrow: 'Conservation · Sundarbans', ink: 'var(--green)',
    logo: 'logos/wildteam.svg', logoW: 651, logoH: 659, hero: 'initiatives/wildteam/screenshot-2026-09-08-180102.webp',
    galleryTitle: 'From the field',
    tagline: 'Formerly the Wildlife Trust of Bangladesh — field conservation for the Bengal tiger and the Sundarbans, and the villages at their edge.',
    p1: 'Formerly the Wildlife Trust of Bangladesh, WildTeam was founded in 2003 by a small group of conservationists led by Enayetullah Khan, focused on improving the conservation status of key species and habitats and building the capacity of organisations and individuals to do effective conservation work.',
    p2: 'WildTeam implements USAID’s Bagh (Bengal Tiger) Activity, working to protect tigers and the Sundarbans with technical support from the Smithsonian Institution, and is also a registered charity in England and Wales.',
    facts: [
      { k: 'Founded', v: '2003' }, { k: 'Founding lead', v: 'Enayetullah Khan' },
      { k: 'Focus', v: 'Bengal tiger & the Sundarbans' }, { k: 'Programme', v: 'USAID Bagh (Bengal Tiger) Activity' },
      { k: 'Status', v: 'Registered charity, England & Wales' }
    ],
    gallery: [
      { src: 'initiatives/wildteam/screenshot-2026-09-08-180102.webp', cap: 'WildTeam’s field team caring for a tiger' },
      { src: 'initiatives/wildteam/screenshot-2026-09-08-180333.webp', cap: 'A WildTeam field team at work in the mangrove' },
      { src: 'initiatives/wildteam/screenshot-2026-09-08-180205.webp', cap: 'A resident of a Sundarbans-edge community' },
      { src: 'initiatives/wildteam/screenshot-2026-09-08-180226.webp', cap: 'A resident of a Sundarbans-edge community' },
      { src: 'initiatives/wildteam/screenshot-2026-09-08-180309.webp', cap: 'A WildTeam awareness session at a local school' },
      { src: 'initiatives/wildteam/screenshot-2026-09-08-180353.webp', cap: 'A student with conservation artwork from a WildTeam outreach session' },
      { src: 'initiatives/wildteam/screenshot-2026-09-08-180246.webp', cap: 'A WildTeam community outreach event' },
      { src: 'initiatives/wildteam/screenshot-2026-09-08-180412.webp', cap: 'The WildTeam team' }
    ]
  },
  bobi: {
    key: 'bobi', name: 'The Bay of Bengal Institute', eyebrow: 'Maritime Research · Blue Economy', ink: 'var(--gold)',
    logo: 'logos/bay-of-bengal-institute.svg', logoW: 1700, logoH: 467, hero: 'initiatives/bay-of-bengal-institute/1500x500.webp',
    galleryTitle: 'From the Institute',
    tagline: 'Set up by Cosmos Foundation to promote governance, dialogue and conflict management across a strategically vital stretch of the Indo-Pacific.',
    p1: 'The Bay of Bengal Institute was set up by Cosmos Foundation to promote governance, dialogue and conflict management across a strategically important stretch of the Indo-Pacific, working as a conduit between policymakers and civil society.',
    p2: 'Its focus runs from Track II diplomacy to the political economy of the Bay’s littoral states, the blue economy, and traditional and non-traditional security issues — work that matters directly to Bangladesh, which sits at the apex of the world’s largest bay and depends on it for trade, shipping, fishing and energy security.',
    facts: [
      { k: 'Set up by', v: 'Cosmos Foundation' }, { k: 'Focus', v: 'Track II diplomacy · Blue economy · Security' },
      { k: 'Region', v: 'Bay of Bengal littoral' }, { k: 'Context', v: 'World’s largest bay' }
    ],
    gallery: [
      { src: 'initiatives/bay-of-bengal-institute/1500x500.webp', cap: 'Fishing boats on the Bay of Bengal' },
      { src: 'initiatives/bay-of-bengal-institute/screenshot-2026-09-08-180520.webp', cap: 'Presenting a publication on the Bay of Bengal' }
    ]
  }
};

export const INIT_ORDER = ['gallery', 'atelier', 'wild', 'bobi'];
