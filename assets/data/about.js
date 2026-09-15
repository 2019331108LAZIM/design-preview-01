// About page long-form content. The four initiatives with their own detail
// page (Gallery Cosmos, Cosmos Atelier 71, WildTeam, Bay of Bengal
// Institute) are summarised here from initiatives.js; the remaining
// sub-initiatives below have no dedicated page and are sourced from the
// Foundation's own existing site (facts only — dates, places, names —
// rewritten in the site's own editorial voice, not copied verbatim).
//
// Every section carries its own photograph (text/image pairing, alternating
// sides down the page — see assets/js/pages/about.js). Images are real
// Foundation photographs from assets/img/cosmosfoundation/ or, for the four
// initiatives with their own dedicated folder, assets/img/initiatives/ (see
// initiatives.js, the single source of truth for those four image sets —
// picked because their actual visible content matches the section (verified
// by eye, not assumed from filename) — except `discovery-ride`, marked
// below, where no cycling-specific photo exists in the source library.
//
// Shape mirrors: GET /api/about-sections
import { INITS } from './initiatives.js';

function heroOf(key) {
  const init = INITS[key];
  const capMatch = init.gallery.find(g => g.src === init.hero);
  return { image: init.hero, imageAlt: capMatch ? capMatch.cap : init.name };
}

export const ABOUT_INTRO = {
  eyebrow: 'About the Foundation',
  title: 'A philanthropic and cultural house',
  lead: 'Cosmos Foundation is the philanthropic arm of the Cosmos Group — a trust built to bring strategic insight and policy thinking to Bangladesh’s future, and to carry the Group’s long-standing commitment to nature and heritage conservation.',
  body: 'It works less like a grant-maker and more like a convener: partnering with individual thinkers, specialist think tanks and scholarly institutions, and drawing on the Group’s media holdings to put the country’s hardest questions in front of a wider public. Conservation work carried out under the Foundation’s umbrella has built working relationships with institutions of international standing, including the Smithsonian.'
};

export const ABOUT_SECTIONS = [
  {
    id: 'gallery',
    title: 'Gallery Cosmos',
    kicker: 'Fine Art Space',
    ink: 'var(--terra)',
    ...heroOf('gallery'),
    body: 'A contemporary art space built to host creative interventions and collaborations among the artists pushing at the edges of Bangladeshi art. The gallery runs exhibitions, art talks, workshops, art camps and exchange programmes, and holds one of the country’s largest collections of modern and contemporary work — more than 11,000 paintings, sculptures, prints and photographs.',
    link: { href: 'initiative.html?id=gallery', label: 'Visit Gallery Cosmos →' }
  },
  {
    id: 'atelier',
    title: 'Cosmos Atelier 71',
    kicker: 'Printmaking Studio · Cosmos Centre',
    ink: 'var(--teal)',
    ...heroOf('atelier'),
    body: 'A printmaking studio built with equipment new to Bangladesh, intended to open fresh ground for the arts here. A residency programme brings artists from across the region and beyond to work alongside the studio’s own printmakers, making Atelier 71 one of the more sought-after print destinations in South Asia.',
    link: { href: 'initiative.html?id=atelier', label: 'Visit Cosmos Atelier 71 →' }
  },
  {
    id: 'wild',
    title: 'WildTeam',
    kicker: 'Conservation · Sundarbans',
    ink: 'var(--green)',
    ...heroOf('wild'),
    body: 'Founded in 2003 under Enayetullah Khan as the Wildlife Trust of Bangladesh, WildTeam works to improve the conservation status of key species and habitats and to build local capacity for conservation work. It has implemented USAID’s Bagh (Bengal Tiger) Activity with technical support from the Smithsonian, and is separately registered as a charity in England and Wales.',
    link: { href: 'initiative.html?id=wild', label: 'Visit WildTeam →' }
  },
  {
    id: 'bobi',
    title: 'The Bay of Bengal Institute',
    kicker: 'Maritime Research · Blue Economy',
    ink: 'var(--gold)',
    ...heroOf('bobi'),
    body: 'Set up to promote governance, dialogue and conflict management across a strategically important stretch of the Indo-Pacific. The Institute works as a conduit between policymakers and civil society on Track II diplomacy, the political economy of the Bay’s littoral states, the blue economy, and traditional and non-traditional security.',
    link: { href: 'initiative.html?id=bobi', label: 'Visit the Bay of Bengal Institute →' }
  },
  {
    id: 'venice',
    title: 'Venice Biennale & Other Art Events',
    kicker: 'International Exhibitions',
    ink: 'var(--red)',
    image: 'cosmosfoundation/d89877c4-b41f-4272-8f24-9e0150bf9347.webp',
    imageAlt: 'Cosmos Foundation representatives at the Venice Biennale, in front of the Bangladesh Pavilion banner',
    body: 'The Foundation has continued to support Bangladesh’s participation at the Venice Biennale, bringing national and international artists together to build the Bangladesh Pavilion. It is also a regular participant at major art fairs, including Art Dubai and Art Basel, working to connect Bangladeshi artists with collectors and galleries abroad.'
  },
  {
    id: 'bmtc',
    title: 'Bangla Mountaineering and Trekking Club',
    kicker: 'Est. 2003',
    ink: 'var(--green)',
    image: 'cosmosfoundation/cg-everest.webp',
    imageAlt: 'BMTC climbers holding a Cosmos Group banner at a Himalayan summit',
    body: 'The Foundation has supported BMTC since its founding in 2003, including a 60km urban trek from Manikganj to Dhaka (2005), an expedition to Chulu West in Nepal at 21,049ft (2007), an expedition to the Frey and Mera peaks of the Himalaya (2008), and a joint Nepali–Bangladeshi team’s first ascent of Mt. Chekigo (6,257m) on 18 October 2010 — a peak since named the Nepal–Bangladesh Friendship Peak.'
  },
  {
    id: 'discovery-ride',
    title: 'Bangladesh Discovery Ride',
    kicker: 'Explore the Diversity',
    ink: 'var(--terra)',
    // No cycling-specific photograph exists in the source library — this is
    // a genuine Foundation reception photo used as an honest placeholder,
    // not a stock/generic graphic. TODO: swap for an actual Discovery Ride
    // photo when the client supplies one.
    image: 'cosmosfoundation/a33i0091-min-scaled.webp',
    imageAlt: 'A Cosmos Foundation gathering', // TODO: replace with an actual Discovery Ride photograph
    body: 'A three-day cycling and cultural exchange in partnership with the Cog-way Japan Cycling and Cultural Exchange Association, bringing more than 100 local and international cyclists to ride through the Chittagong region each year — supporting local tourism and showcasing the region’s landscape and culture.'
  },
  {
    id: 'culture',
    title: 'Promoting Culture',
    kicker: 'Music & Performance',
    ink: 'var(--gold)',
    image: 'cosmosfoundation/cf-pc-1004.webp',
    imageAlt: 'Classical dancers performing at a Cosmos Foundation event',
    body: 'The Foundation has brought Bangladeshi and international performers together on stages at home and abroad: co-sponsoring Baul singer Shafi Mondol’s solo concert at Symphony Space, New York (November 2013) with the World Music Institute; bringing the Latin–Afro-Caribbean band Lokkhi Terra to Dhaka; and hosting a programme of classical dance by Sharmila Banerjee of Chhayanaut.'
  },
  {
    id: 'advisors',
    title: 'Advisors & Affiliates',
    kicker: 'Governance',
    ink: 'var(--teal)',
    image: 'cosmosfoundation/8ce054df-a54e-4565-8a0f-906bc123461a.webp',
    imageAlt: 'Portrait of a Cosmos Foundation advisor',
    body: 'Beyond the Board, the Foundation draws on a wider circle of advisors and research fellows — diplomats, economists, historians and area specialists — who shape its dialogue and research programme. The current roster is on the Board page.',
    link: { href: 'board.html', label: 'Meet the Board →' }
  }
];
