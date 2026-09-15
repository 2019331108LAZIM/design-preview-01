// Site-wide chrome & homepage content — nav, footer, contact, stats, the
// "From the archive" strip and "Recent programme" cards. Carried over
// verbatim from the approved mockup. Shape mirrors what a backend would
// otherwise inline into a layout template.

export const NAV_ITEMS = [
  { label: 'Home', href: 'index.html' },
  { label: 'About', href: 'about.html' },
  { label: 'Initiatives', href: 'initiatives.html' },
  { label: 'Board', href: 'board.html' },
  {
    label: 'Programmes', href: 'speakers.html',
    children: [
      { label: 'Distinguished Speakers’ Series', href: 'speakers.html' },
      { label: 'Ambassadors’ Lecture Series', href: 'ambassadors.html' }
    ]
  },
  { label: 'Events', href: 'events.html' },
  { label: 'Media', href: 'media.html' }
];

export const CONTACT_ROWS = [
  { k: 'Address', v: 'Cosmos Centre, 69/1 New Circular Road, Malibagh, Dhaka 1217' },
  { k: 'Telephone', v: '+880 2 8322940' },
  { k: 'General enquiries', v: 'info@cosmosfoundationbd.org' },
  { k: 'Studio & gallery', v: 'atelier71@cosmosfoundationbd.org' }
];

export const FORM_FIELDS = [
  { name: 'name', label: 'Your name', ph: 'Full name', required: true },
  { name: 'email', label: 'Email', ph: 'you@organisation.org', required: true, type: 'email' },
  { name: 'organisation', label: 'Organisation', ph: 'Optional', required: false },
  { name: 'subject', label: 'Subject', ph: 'Programme, studio, press…', required: true }
];

export const SOCIALS = [
  { label: 'FB', href: '#' }, { label: 'IN', href: '#' }, { label: 'X', href: '#' }, { label: 'YT', href: '#' }
];

export const FOOTER_COLS = [
  { title: 'Foundation', links: [
    { label: 'About Us', href: 'about.html' },
    { label: 'Meet the Board', href: 'board.html' },
    { label: 'Fellows & Research', href: 'board.html' },
    { label: 'Annual Report', href: 'media.html' }
  ] },
  { title: 'Programmes', links: [
    { label: 'Distinguished Speakers’ Series', href: 'speakers.html' },
    { label: 'Ambassadors’ Lecture Series', href: 'ambassadors.html' },
    { label: 'Events', href: 'events.html' },
    { label: 'Media & PR', href: 'media.html' }
  ] },
  { title: 'Initiatives', links: [
    { label: 'Gallery Cosmos', href: 'initiative.html?id=gallery' },
    { label: 'Cosmos Atelier 71', href: 'initiative.html?id=atelier' },
    { label: 'WildTeam', href: 'initiative.html?id=wild' },
    { label: 'Bay of Bengal Institute', href: 'initiative.html?id=bobi' }
  ] }
];

export const BRAND = {
  name: 'Cosmos Foundation',
  address: 'Cosmos Centre, 69/1 New Circular Road, Malibagh, Dhaka 1217, Bangladesh',
  phone: '+880 2 8322940',
  email: 'info@cosmosfoundationbd.org',
  logo: 'logos/cosmos-foundation.svg', logoW: 1108, logoH: 409
};

export const HOME_STATS = [
  { n: '40+', label: 'Distinguished lectures since 2015' },
  { n: '4', label: 'Institutions under one roof' },
  { n: '12', label: 'Years of programme archive' },
  { n: '18', label: 'Countries represented on stage' }
];

export const ARCHIVE_STRIP = [
  { src: 'cosmosfoundation/a33i0091-min-scaled.webp', year: '2019', cap: 'Reception before the evening lecture' },
  { src: 'cosmosfoundation/cf-pc-1001.webp', year: '2018', cap: 'Music at the Foundation' },
  { src: 'cosmosfoundation/3-2-min.webp', year: '2021', cap: 'Panel, Cosmos Centre' },
  { src: 'cosmosfoundation/cf-pc-1003.webp', year: '2018', cap: 'Art camp, second day' },
  { src: 'cosmosfoundation/whatsapp-image-2021-10-14-at-13-44-48.webp', year: '2021', cap: 'Field visit, Sundarbans' },
  { src: 'cosmosfoundation/new.webp', year: '2023', cap: 'Dialogue in session' },
  { src: 'cosmosfoundation/cf-pc-1004.webp', year: '2019', cap: 'Opening night, Gallery Cosmos' },
  { src: 'cosmosfoundation/whatsapp-image-2024-10-05-at-5-08-15-pm.webp', year: '2024', cap: 'Ambassadors’ lecture, Dhaka' }
];

export const NEWS = [
  { tag: 'Dialogue', tagClass: 'tag', date: '2026-03-12', img: 'cosmosfoundation/new.webp', title: 'A frank hour on the Indo-Pacific', dek: 'Session 34 of the Distinguished Speakers’ Series drew a full house at Cosmos Centre.' },
  { tag: 'Exhibition', tagClass: 'tag tag--green', date: '2026-02-28', img: 'initiatives/gallery-cosmos/page4-36.webp', title: '“Art Against Fake News” opens at Gallery Cosmos', dek: 'A group exhibition hung across the gallery’s Cosmos Centre floors.' },
  { tag: 'Field', tagClass: 'tag tag--teal', date: '2026-02-09', img: 'initiatives/wildteam/screenshot-2026-09-08-180333.webp', title: 'WildTeam’s field teams continue work in the Sundarbans', dek: 'Village response units keep working the mangrove edge to protect people and tigers alike.' },
  { tag: 'Research', tagClass: 'tag tag--red', date: '2026-01-21', img: 'cosmosfoundation/cf-pc-1002.webp', title: 'Blue economy working paper published', dek: 'The Institute’s fisheries and port-connectivity findings are now open access.' }
];

export const INKS = [
  { name: 'Terracotta · #C1552C', hex: '#C1552C' },
  { name: 'Signal red · #B23A2E', hex: '#B23A2E' },
  { name: 'Mustard gold · #E0A63B', hex: '#E0A63B' },
  { name: 'Bottle green · #2B5C3F', hex: '#2B5C3F' },
  { name: 'Deep teal · #1F5C58', hex: '#1F5C58' }
];

export const MISSION = {
  eyebrow: 'Our Mission',
  lead: 'Cosmos Foundation was established to give the Group’s cultural and civic instincts a permanent home — a think-tank where former foreign ministers, ambassadors and heads of state speak plainly, and a family of arts institutions where printmakers, painters and field conservationists work with the same seriousness.',
  body: 'Everything we publish, hang, print or protect begins in the same building on New Circular Road: a lecture on the Indo-Pacific in the afternoon, an etching pulled from the press upstairs by evening.'
};
