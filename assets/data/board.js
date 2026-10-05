// Board & fellows — shape mirrors: GET /api/board-members
//
// ── PLACEHOLDER ROSTER ─────────────────────────────────────────────────
// The previous roster was out of date and the replacement names have not
// been supplied yet. Entries carrying `placeholder: true` are scaffolding,
// not content: the portrait is a drawn silhouette (not a photograph of
// anyone), and every text field describes WHAT BELONGS THERE rather than
// pretending to be real copy. They render with a visible "to be confirmed"
// treatment so nobody mistakes them for finished content.
//
// Confirmed as of this revision: Enayetullah Khan (Chairman), Tehmina
// Enayet (Development Director), Dilshad Rahman (Member), Masud Jamil Khan
// (Member), Nahar Khan (Executive Director). Everything else is a slot.
//
// To fill one in: replace the name/role, swap `img` for the real portrait
// key, write affil/bio1/bio2/bio3, add quote + quoteSrc if there is a real
// one, and delete the `placeholder: true` flag. `node tools/verify.mjs`
// reports how many slots remain.
//
// The previous roster (Dr. Iftekhar Ahmed Chowdhury, Farooq Sobhan, Kris
// Srinivasan, Ahmad Tariq Karim, Danilo Türk, George Moose, Li Debiao,
// Nojibur Rahman, Haider A. Khan, Kenneth X. Robbins, Shayan S. Khan,
// A. S. M. A. Awal, Asad-ul Iqbal Latif, Silvia Tieri) with full bios and
// portraits is preserved in git history — `git log -p assets/data/board.js`.

export const GROUPS = ['Chairman, Directors & Members', 'Advisory Board', 'Honorary Emeritus Advisor', 'Fellows'];

export const BOARD = [
  {
    // Sourced from enayetullahkhan.com/bio (his own site), October 2026.
    // The quote field is deliberately empty: that page's pull-quote is
    // unreplaced lorem ipsum, and the line previously here — "A small
    // country with a long coastline cannot afford a short conversation" —
    // came from the original mockup with no source behind it. An invented
    // quotation attributed to a living person is the one thing these
    // profiles must not carry. Restore it only if he confirms he said it.
    id: 'enayetullah-khan', name: 'Enayetullah Khan', role: 'Chairman',
    img: 'cosmosfoundation/ekhan-900x900-1.webp', group: 0, ink: 'var(--terra)',
    affil: 'Chairman, Cosmos Foundation · Founder and Managing Director, Cosmos Group · Founder, United News of Bangladesh · Founding Editor, Dhaka Courier',
    bio1: 'Enayetullah Khan is a Bangladeshi entrepreneur, author, journalist and patron of the arts. Born in Dhaka in 1953, he took his Master’s in Mass Communication and Journalism at the University of Dhaka in 1975 and taught briefly in the same department before leaving to begin a business career.',
    bio2: 'He is Founder and Managing Director of the Cosmos Group, which incorporates more than a dozen companies operating at home and abroad across oil and gas, mining, telecommunications, instrumentation, shipping and logistics, media, manufacturing and trading. The group commenced formal operations in 1973, beginning in trading with shipping interests, though its roots reach back to his grandfather Amanat Khan — a prominent figure in Chittagong society, one of the first Muslim members of the Legislative Assembly, and the first chairman of the Chittagong Port Authority. In media he established United News of Bangladesh, the first fully digitalised wire service in South Asia, and is founding editor of the independent newsweekly Dhaka Courier.',
    quote: '',
    quoteSrc: '',
    bio3: 'The arts and conservation run alongside the business. In 2009 he established Cosmos-Atelier71, a printmaking studio equipped to a standard rare in Bangladesh, and he founded Gallery Cosmos as a contemporary space for the country’s artists. He chairs a wildlife conservancy working to protect the Royal Bengal Tiger, and has written or co-written three books on Bangladesh’s heritage: Bangladesh: Splendours of the Past (2001), which drew attention to the archaeology of Wari-Bateshwar; The Bangladesh Sundarbans (2011); and Boats: A Treasure of Bangladesh (2014), with the naval architect Yves Marre.',
  },
  {
    id: 'vice-chairman', name: 'Name to be confirmed', role: 'Vice Chairman',
    img: 'placeholders/portrait-male.webp', group: 0, ink: 'var(--gold)',
    placeholder: true,
    affil: 'Vice Chairman, Cosmos Foundation · further affiliations to be supplied',
    bio1: 'Opening paragraph: who this member is and what they bring to the Foundation — two or three sentences of professional background.',
    bio2: 'Second paragraph: their work with the Foundation specifically — which programmes, committees or institutions they are involved with.',
    quote: '',
    quoteSrc: '',
    bio3: 'Closing paragraph: what they are working on now, and any continuing role held outside the Foundation.'
  },
  {
    id: 'managing-director', name: 'Name to be confirmed', role: 'Managing Director',
    img: 'placeholders/portrait-male.webp', group: 0, ink: 'var(--green)',
    placeholder: true,
    affil: 'Managing Director, Cosmos Foundation · further affiliations to be supplied',
    bio1: 'Opening paragraph: who this member is and what they bring to the Foundation — two or three sentences of professional background.',
    bio2: 'Second paragraph: their work with the Foundation specifically — which programmes, committees or institutions they are involved with.',
    quote: '',
    quoteSrc: '',
    bio3: 'Closing paragraph: what they are working on now, and any continuing role held outside the Foundation.'
  },
  {
    id: 'finance-accounts-director', name: 'Name to be confirmed', role: 'Finance & Accounts Director',
    img: 'placeholders/portrait-male.webp', group: 0, ink: 'var(--teal)',
    placeholder: true,
    affil: 'Finance & Accounts Director, Cosmos Foundation · further affiliations to be supplied',
    bio1: 'Opening paragraph: who this member is and what they bring to the Foundation — two or three sentences of professional background.',
    bio2: 'Second paragraph: their work with the Foundation specifically — which programmes, committees or institutions they are involved with.',
    quote: '',
    quoteSrc: '',
    bio3: 'Closing paragraph: what they are working on now, and any continuing role held outside the Foundation.'
  },
  {
    id: 'tehmina-enayet', name: 'Mrs Tehmina Enayet', role: 'Development Director',
    img: 'placeholders/portrait-female.webp', group: 0, ink: 'var(--red)',
    placeholder: true,
    affil: 'Development Director, Cosmos Foundation · further affiliations to be supplied',
    bio1: 'Opening paragraph: who this member is and what they bring to the Foundation — two or three sentences of professional background.',
    bio2: 'Second paragraph: their work with the Foundation specifically — which programmes, committees or institutions they are involved with.',
    quote: '',
    quoteSrc: '',
    bio3: 'Closing paragraph: what they are working on now, and any continuing role held outside the Foundation.'
  },
  {
    id: 'dilshad-rahman', name: 'Mrs Dilshad Rahman', role: 'Member',
    img: 'placeholders/portrait-female.webp', group: 0, ink: 'var(--terra)',
    placeholder: true,
    affil: 'Member, Cosmos Foundation · further affiliations to be supplied',
    bio1: 'Opening paragraph: who this member is and what they bring to the Foundation — two or three sentences of professional background.',
    bio2: 'Second paragraph: their work with the Foundation specifically — which programmes, committees or institutions they are involved with.',
    quote: '',
    quoteSrc: '',
    bio3: 'Closing paragraph: what they are working on now, and any continuing role held outside the Foundation.'
  },
  {
    id: 'masud-jamil-khan', name: 'Mr Masud Jamil Khan', role: 'Member',
    img: 'placeholders/portrait-male.webp', group: 0, ink: 'var(--gold)',
    placeholder: true,
    affil: 'Member, Cosmos Foundation · further affiliations to be supplied',
    bio1: 'Opening paragraph: who this member is and what they bring to the Foundation — two or three sentences of professional background.',
    bio2: 'Second paragraph: their work with the Foundation specifically — which programmes, committees or institutions they are involved with.',
    quote: '',
    quoteSrc: '',
    bio3: 'Closing paragraph: what they are working on now, and any continuing role held outside the Foundation.'
  },
  {
    id: 'nahar-khan', name: 'Nahar Khan', role: 'Executive Director',
    img: 'cosmosfoundation/nahar-khan.webp', group: 0, ink: 'var(--green)',
    affil: 'Executive Director, Cosmos Foundation · Vice President, Cosmos Group · Director, Gallery Cosmos',
    bio1: 'Leads the Foundation\u2019s day-to-day direction and its arts portfolio, with particular responsibility for Gallery Cosmos and the acquisition programme.',
    bio2: 'Her work has centred on placing Bangladeshi modernism in a regional frame \u2014 pairing established painters with young printmakers working at Atelier 71, and taking the collection out of Dhaka through travelling exhibitions.',
    quote: 'A collection is only alive when it is argued with.',
    quoteSrc: 'Gallery Cosmos, curatorial note',
    bio3: 'She sits on the Foundation\u2019s programme committee and represents the institution in regional cultural partnerships.'
  },
  {
    id: 'board-member-01', name: 'Name to be confirmed', role: 'Designation not yet published',
    img: 'placeholders/portrait-male.webp', group: 0, ink: 'var(--green)',
    placeholder: true,
    affil: 'Designation and affiliations to be supplied',
    bio1: 'Opening paragraph: who this member is and what they bring to the Foundation — two or three sentences of professional background.',
    bio2: 'Second paragraph: their work with the Foundation specifically — which programmes, committees or institutions they are involved with.',
    quote: '',
    quoteSrc: '',
    bio3: 'Closing paragraph: what they are working on now, and any continuing role held outside the Foundation.'
  },
  {
    id: 'board-member-02', name: 'Name to be confirmed', role: 'Designation not yet published',
    img: 'placeholders/portrait-male.webp', group: 0, ink: 'var(--teal)',
    placeholder: true,
    affil: 'Designation and affiliations to be supplied',
    bio1: 'Opening paragraph: who this member is and what they bring to the Foundation — two or three sentences of professional background.',
    bio2: 'Second paragraph: their work with the Foundation specifically — which programmes, committees or institutions they are involved with.',
    quote: '',
    quoteSrc: '',
    bio3: 'Closing paragraph: what they are working on now, and any continuing role held outside the Foundation.'
  },
  {
    id: 'board-member-03', name: 'Name to be confirmed', role: 'Designation not yet published',
    img: 'placeholders/portrait-female.webp', group: 0, ink: 'var(--red)',
    placeholder: true,
    affil: 'Designation and affiliations to be supplied',
    bio1: 'Opening paragraph: who this member is and what they bring to the Foundation — two or three sentences of professional background.',
    bio2: 'Second paragraph: their work with the Foundation specifically — which programmes, committees or institutions they are involved with.',
    quote: '',
    quoteSrc: '',
    bio3: 'Closing paragraph: what they are working on now, and any continuing role held outside the Foundation.'
  },
  {
    id: 'board-member-04', name: 'Name to be confirmed', role: 'Designation not yet published',
    img: 'placeholders/portrait-male.webp', group: 0, ink: 'var(--terra)',
    placeholder: true,
    affil: 'Designation and affiliations to be supplied',
    bio1: 'Opening paragraph: who this member is and what they bring to the Foundation — two or three sentences of professional background.',
    bio2: 'Second paragraph: their work with the Foundation specifically — which programmes, committees or institutions they are involved with.',
    quote: '',
    quoteSrc: '',
    bio3: 'Closing paragraph: what they are working on now, and any continuing role held outside the Foundation.'
  },
  {
    id: 'board-member-05', name: 'Name to be confirmed', role: 'Designation not yet published',
    img: 'placeholders/portrait-male.webp', group: 0, ink: 'var(--gold)',
    placeholder: true,
    affil: 'Designation and affiliations to be supplied',
    bio1: 'Opening paragraph: who this member is and what they bring to the Foundation — two or three sentences of professional background.',
    bio2: 'Second paragraph: their work with the Foundation specifically — which programmes, committees or institutions they are involved with.',
    quote: '',
    quoteSrc: '',
    bio3: 'Closing paragraph: what they are working on now, and any continuing role held outside the Foundation.'
  },
  {
    id: 'board-member-06', name: 'Name to be confirmed', role: 'Designation not yet published',
    img: 'placeholders/portrait-female.webp', group: 0, ink: 'var(--green)',
    placeholder: true,
    affil: 'Designation and affiliations to be supplied',
    bio1: 'Opening paragraph: who this member is and what they bring to the Foundation — two or three sentences of professional background.',
    bio2: 'Second paragraph: their work with the Foundation specifically — which programmes, committees or institutions they are involved with.',
    quote: '',
    quoteSrc: '',
    bio3: 'Closing paragraph: what they are working on now, and any continuing role held outside the Foundation.'
  },
  {
    id: 'board-member-07', name: 'Name to be confirmed', role: 'Designation not yet published',
    img: 'placeholders/portrait-male.webp', group: 0, ink: 'var(--teal)',
    placeholder: true,
    affil: 'Designation and affiliations to be supplied',
    bio1: 'Opening paragraph: who this member is and what they bring to the Foundation — two or three sentences of professional background.',
    bio2: 'Second paragraph: their work with the Foundation specifically — which programmes, committees or institutions they are involved with.',
    quote: '',
    quoteSrc: '',
    bio3: 'Closing paragraph: what they are working on now, and any continuing role held outside the Foundation.'
  },
  {
    id: 'board-member-08', name: 'Name to be confirmed', role: 'Designation not yet published',
    img: 'placeholders/portrait-male.webp', group: 0, ink: 'var(--red)',
    placeholder: true,
    affil: 'Designation and affiliations to be supplied',
    bio1: 'Opening paragraph: who this member is and what they bring to the Foundation — two or three sentences of professional background.',
    bio2: 'Second paragraph: their work with the Foundation specifically — which programmes, committees or institutions they are involved with.',
    quote: '',
    quoteSrc: '',
    bio3: 'Closing paragraph: what they are working on now, and any continuing role held outside the Foundation.'
  },
  {
    id: 'board-member-09', name: 'Name to be confirmed', role: 'Designation not yet published',
    img: 'placeholders/portrait-female.webp', group: 0, ink: 'var(--terra)',
    placeholder: true,
    affil: 'Designation and affiliations to be supplied',
    bio1: 'Opening paragraph: who this member is and what they bring to the Foundation — two or three sentences of professional background.',
    bio2: 'Second paragraph: their work with the Foundation specifically — which programmes, committees or institutions they are involved with.',
    quote: '',
    quoteSrc: '',
    bio3: 'Closing paragraph: what they are working on now, and any continuing role held outside the Foundation.'
  },
  {
    id: 'board-member-10', name: 'Name to be confirmed', role: 'Designation not yet published',
    img: 'placeholders/portrait-male.webp', group: 0, ink: 'var(--gold)',
    placeholder: true,
    affil: 'Designation and affiliations to be supplied',
    bio1: 'Opening paragraph: who this member is and what they bring to the Foundation — two or three sentences of professional background.',
    bio2: 'Second paragraph: their work with the Foundation specifically — which programmes, committees or institutions they are involved with.',
    quote: '',
    quoteSrc: '',
    bio3: 'Closing paragraph: what they are working on now, and any continuing role held outside the Foundation.'
  },
  {
    id: 'advisory-board-01', name: 'Name to be confirmed', role: 'Advisory Board',
    img: 'placeholders/portrait-male.webp', group: 1, ink: 'var(--gold)',
    placeholder: true,
    affil: 'Advisory Board, Cosmos Foundation · further affiliations to be supplied',
    bio1: 'Opening paragraph: who this member is and what they bring to the Foundation — two or three sentences of professional background.',
    bio2: 'Second paragraph: their work with the Foundation specifically — which programmes, committees or institutions they are involved with.',
    quote: '',
    quoteSrc: '',
    bio3: 'Closing paragraph: what they are working on now, and any continuing role held outside the Foundation.'
  },
  {
    id: 'advisory-board-02', name: 'Name to be confirmed', role: 'Advisory Board',
    img: 'placeholders/portrait-male.webp', group: 1, ink: 'var(--green)',
    placeholder: true,
    affil: 'Advisory Board, Cosmos Foundation · further affiliations to be supplied',
    bio1: 'Opening paragraph: who this member is and what they bring to the Foundation — two or three sentences of professional background.',
    bio2: 'Second paragraph: their work with the Foundation specifically — which programmes, committees or institutions they are involved with.',
    quote: '',
    quoteSrc: '',
    bio3: 'Closing paragraph: what they are working on now, and any continuing role held outside the Foundation.'
  },
  {
    id: 'advisory-board-03', name: 'Name to be confirmed', role: 'Advisory Board',
    img: 'placeholders/portrait-female.webp', group: 1, ink: 'var(--teal)',
    placeholder: true,
    affil: 'Advisory Board, Cosmos Foundation · further affiliations to be supplied',
    bio1: 'Opening paragraph: who this member is and what they bring to the Foundation — two or three sentences of professional background.',
    bio2: 'Second paragraph: their work with the Foundation specifically — which programmes, committees or institutions they are involved with.',
    quote: '',
    quoteSrc: '',
    bio3: 'Closing paragraph: what they are working on now, and any continuing role held outside the Foundation.'
  },
  {
    id: 'advisory-board-04', name: 'Name to be confirmed', role: 'Advisory Board',
    img: 'placeholders/portrait-male.webp', group: 1, ink: 'var(--red)',
    placeholder: true,
    affil: 'Advisory Board, Cosmos Foundation · further affiliations to be supplied',
    bio1: 'Opening paragraph: who this member is and what they bring to the Foundation — two or three sentences of professional background.',
    bio2: 'Second paragraph: their work with the Foundation specifically — which programmes, committees or institutions they are involved with.',
    quote: '',
    quoteSrc: '',
    bio3: 'Closing paragraph: what they are working on now, and any continuing role held outside the Foundation.'
  },
  {
    id: 'advisory-board-05', name: 'Name to be confirmed', role: 'Advisory Board',
    img: 'placeholders/portrait-male.webp', group: 1, ink: 'var(--terra)',
    placeholder: true,
    affil: 'Advisory Board, Cosmos Foundation · further affiliations to be supplied',
    bio1: 'Opening paragraph: who this member is and what they bring to the Foundation — two or three sentences of professional background.',
    bio2: 'Second paragraph: their work with the Foundation specifically — which programmes, committees or institutions they are involved with.',
    quote: '',
    quoteSrc: '',
    bio3: 'Closing paragraph: what they are working on now, and any continuing role held outside the Foundation.'
  },
  {
    id: 'advisory-board-06', name: 'Name to be confirmed', role: 'Advisory Board',
    img: 'placeholders/portrait-female.webp', group: 1, ink: 'var(--gold)',
    placeholder: true,
    affil: 'Advisory Board, Cosmos Foundation · further affiliations to be supplied',
    bio1: 'Opening paragraph: who this member is and what they bring to the Foundation — two or three sentences of professional background.',
    bio2: 'Second paragraph: their work with the Foundation specifically — which programmes, committees or institutions they are involved with.',
    quote: '',
    quoteSrc: '',
    bio3: 'Closing paragraph: what they are working on now, and any continuing role held outside the Foundation.'
  },
  {
    id: 'honorary-emeritus-advisor', name: 'Name to be confirmed', role: 'Honorary Emeritus Advisor',
    img: 'placeholders/portrait-male.webp', group: 2, ink: 'var(--terra)',
    placeholder: true,
    affil: 'Honorary Emeritus Advisor, Cosmos Foundation · further affiliations to be supplied',
    bio1: 'Opening paragraph: who this member is and what they bring to the Foundation — two or three sentences of professional background.',
    bio2: 'Second paragraph: their work with the Foundation specifically — which programmes, committees or institutions they are involved with.',
    quote: '',
    quoteSrc: '',
    bio3: 'Closing paragraph: what they are working on now, and any continuing role held outside the Foundation.'
  },
  {
    id: 'fellow-01', name: 'Name to be confirmed', role: 'Fellow',
    img: 'placeholders/portrait-male.webp', group: 3, ink: 'var(--teal)',
    placeholder: true,
    affil: 'Fellow, Cosmos Foundation · further affiliations to be supplied',
    bio1: 'Opening paragraph: who this member is and what they bring to the Foundation — two or three sentences of professional background.',
    bio2: 'Second paragraph: their work with the Foundation specifically — which programmes, committees or institutions they are involved with.',
    quote: '',
    quoteSrc: '',
    bio3: 'Closing paragraph: what they are working on now, and any continuing role held outside the Foundation.'
  },
  {
    id: 'fellow-02', name: 'Name to be confirmed', role: 'Fellow',
    img: 'placeholders/portrait-female.webp', group: 3, ink: 'var(--red)',
    placeholder: true,
    affil: 'Fellow, Cosmos Foundation · further affiliations to be supplied',
    bio1: 'Opening paragraph: who this member is and what they bring to the Foundation — two or three sentences of professional background.',
    bio2: 'Second paragraph: their work with the Foundation specifically — which programmes, committees or institutions they are involved with.',
    quote: '',
    quoteSrc: '',
    bio3: 'Closing paragraph: what they are working on now, and any continuing role held outside the Foundation.'
  },
  {
    id: 'fellow-03', name: 'Name to be confirmed', role: 'Fellow',
    img: 'placeholders/portrait-male.webp', group: 3, ink: 'var(--terra)',
    placeholder: true,
    affil: 'Fellow, Cosmos Foundation · further affiliations to be supplied',
    bio1: 'Opening paragraph: who this member is and what they bring to the Foundation — two or three sentences of professional background.',
    bio2: 'Second paragraph: their work with the Foundation specifically — which programmes, committees or institutions they are involved with.',
    quote: '',
    quoteSrc: '',
    bio3: 'Closing paragraph: what they are working on now, and any continuing role held outside the Foundation.'
  },
  {
    id: 'fellow-04', name: 'Name to be confirmed', role: 'Fellow',
    img: 'placeholders/portrait-female.webp', group: 3, ink: 'var(--gold)',
    placeholder: true,
    affil: 'Fellow, Cosmos Foundation · further affiliations to be supplied',
    bio1: 'Opening paragraph: who this member is and what they bring to the Foundation — two or three sentences of professional background.',
    bio2: 'Second paragraph: their work with the Foundation specifically — which programmes, committees or institutions they are involved with.',
    quote: '',
    quoteSrc: '',
    bio3: 'Closing paragraph: what they are working on now, and any continuing role held outside the Foundation.'
  },
  {
    id: 'fellow-05', name: 'Name to be confirmed', role: 'Fellow',
    img: 'placeholders/portrait-male.webp', group: 3, ink: 'var(--green)',
    placeholder: true,
    affil: 'Fellow, Cosmos Foundation · further affiliations to be supplied',
    bio1: 'Opening paragraph: who this member is and what they bring to the Foundation — two or three sentences of professional background.',
    bio2: 'Second paragraph: their work with the Foundation specifically — which programmes, committees or institutions they are involved with.',
    quote: '',
    quoteSrc: '',
    bio3: 'Closing paragraph: what they are working on now, and any continuing role held outside the Foundation.'
  },
  {
    id: 'fellow-06', name: 'Name to be confirmed', role: 'Fellow',
    img: 'placeholders/portrait-female.webp', group: 3, ink: 'var(--teal)',
    placeholder: true,
    affil: 'Fellow, Cosmos Foundation · further affiliations to be supplied',
    bio1: 'Opening paragraph: who this member is and what they bring to the Foundation — two or three sentences of professional background.',
    bio2: 'Second paragraph: their work with the Foundation specifically — which programmes, committees or institutions they are involved with.',
    quote: '',
    quoteSrc: '',
    bio3: 'Closing paragraph: what they are working on now, and any continuing role held outside the Foundation.'
  }
];
