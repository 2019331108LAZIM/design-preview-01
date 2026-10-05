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
    id: 'enayetullah-khan', name: 'Enayetullah Khan', role: 'Chairman',
    img: 'cosmosfoundation/ekhan-900x900-1.webp', group: 0, ink: 'var(--terra)',
    affil: 'Chairman, Cosmos Foundation · Editor-in-Chief, United News of Bangladesh · Cosmos Group, Dhaka',
    bio1: 'Founded the Foundation in 2015 to give the Group\u2019s civic and cultural instincts a permanent institutional home, bringing four decades in publishing and media to the work of convening dialogue in Dhaka.',
    bio2: 'Under his chairmanship the Foundation built two parallel programmes: a diplomatic track that brings former foreign ministers, ambassadors and heads of state into open conversation with a Bangladeshi audience, and an arts track spanning a gallery, a printmaking studio, a conservation organisation and a maritime research institute.',
    quote: 'A small country with a long coastline cannot afford a short conversation.',
    quoteSrc: 'Opening remarks, Distinguished Speakers\u2019 Series',
    bio3: 'He continues to edit and write on regional affairs, and chairs the editorial committee that oversees the Foundation\u2019s publications and exhibition catalogues.'
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
