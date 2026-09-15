// Board & fellows — carried over verbatim from the approved mockup content,
// with each bio's opening word restored to full capitalisation (the mockup
// rendered the first letter separately as a decorative drop-cap driven off
// the person's name; the real site drives the drop-cap from the CSS
// `.dropcap` class instead, so bio1 needs to read correctly on its own).
//
// Shape mirrors: GET /api/board-members
export const GROUPS = ['Chairman, President & Members', 'Advisory Board', 'Honorary Emeritus Advisor', 'Fellows'];

export const BOARD = [
  {
    id: 'enayetullah-khan', name: 'Enayetullah Khan', role: 'Chairman',
    img: 'cosmosfoundation/ekhan-900x900-1.webp', group: 0, ink: 'var(--terra)',
    affil: 'Chairman, Cosmos Foundation · Editor-in-Chief, United News of Bangladesh · Cosmos Group, Dhaka',
    bio1: 'Founded the Foundation in 2015 to give the Group’s civic and cultural instincts a permanent institutional home, bringing four decades in publishing and media to the work of convening dialogue in Dhaka.',
    bio2: 'Under his chairmanship the Foundation built two parallel programmes: a diplomatic track that brings former foreign ministers, ambassadors and heads of state into open conversation with a Bangladeshi audience, and an arts track spanning a gallery, a printmaking studio, a conservation organisation and a maritime research institute.',
    quote: 'A small country with a long coastline cannot afford a short conversation.',
    quoteSrc: 'Opening remarks, Distinguished Speakers’ Series',
    bio3: 'He continues to edit and write on regional affairs, and chairs the editorial committee that oversees the Foundation’s publications and exhibition catalogues.'
  },
  {
    id: 'nahar-khan', name: 'Nahar Khan', role: 'Executive Director',
    img: 'cosmosfoundation/nahar-khan.webp', group: 0, ink: 'var(--green)',
    affil: 'Executive Director, Cosmos Foundation · Vice President, Cosmos Group · Director, Gallery Cosmos',
    bio1: 'Leads the Foundation’s day-to-day direction and its arts portfolio, with particular responsibility for Gallery Cosmos and the acquisition programme.',
    bio2: 'Her work has centred on placing Bangladeshi modernism in a regional frame — pairing established painters with young printmakers working at Atelier 71, and taking the collection out of Dhaka through travelling exhibitions.',
    quote: 'A collection is only alive when it is argued with.',
    quoteSrc: 'Gallery Cosmos, curatorial note',
    bio3: 'She sits on the Foundation’s programme committee and represents the institution in regional cultural partnerships.'
  },
  {
    id: 'iftekhar-ahmed-chowdhury', name: 'Dr. Iftekhar Ahmed Chowdhury', role: 'President',
    img: 'cosmosfoundation/diac-900x900-1.webp', group: 0, ink: 'var(--gold)',
    affil: 'President, Cosmos Foundation · Former Foreign Advisor (Foreign Minister), Bangladesh',
    bio1: 'Served as Bangladesh’s Foreign Minister from 2007 to 2009, capping a diplomatic career that began in 1969 and carried him through postings in New York, Geneva and Doha.',
    bio2: 'His UN service included terms as Permanent Representative in both New York and Geneva, alongside ambassadorships covering Qatar, Chile, Peru and the Vatican; since 2009 he has continued the work in academia as a Principal Research Fellow at the National University of Singapore’s Institute of South Asian Studies.',
    quote: 'Diplomacy outlives the desk it was practised from.',
    quoteSrc: 'Foundation dialogue, Dhaka',
    bio3: 'He continues to lecture and publish on international relations and strategic affairs, and lends that experience to the Foundation’s presidency.'
  },
  {
    id: 'farooq-sobhan', name: 'Farooq Sobhan', role: 'Member, Advisory Board',
    img: null, group: 1, ink: 'var(--red)',
    affil: 'Former Foreign Secretary, Bangladesh · President, Bangladesh Enterprise Institute (BEI)',
    bio1: 'Advises the Foundation from a career spanning the Foreign Secretaryship of Bangladesh and ambassadorial postings to India, China, Malaysia and the United Nations.',
    bio2: 'He founded and led the Bangladesh Enterprise Institute, working on investment climate, regional cooperation and corporate governance, and has chaired UN bodies on transnational corporations and the Group of 77.',
    quote: 'Institutions outlast the officials who built them, if they are built well.',
    quoteSrc: 'Foundation dialogue, Dhaka',
    bio3: 'He continues to advise on South Asian regional policy and private-sector development.'
  },
  {
    id: 'kris-srinivasan', name: 'Amb. Kris Srinivasan', role: 'Member, Advisory Board',
    img: 'cosmosfoundation/ks-900x900-1.webp', group: 1, ink: 'var(--terra)',
    affil: 'Former Foreign Secretary of India · Former Deputy Secretary-General, Commonwealth of Nations',
    bio1: 'Brings a career in the Indian Foreign Service, including the Foreign Secretaryship of India and postings to Bangladesh, the Netherlands and across Africa, to the Foundation’s advisory work.',
    bio2: 'After retiring in 1995 he held fellowships at Oxford, Cambridge and Uppsala, and continues to write on diplomatic history and the Commonwealth.',
    quote: 'A foreign service is a long argument for patience.',
    quoteSrc: 'Foundation dialogue, Dhaka',
    bio3: 'He advises the Foundation on South Asian diplomatic history and Commonwealth affairs.'
  },
  {
    id: 'ahmad-tariq-karim', name: 'Amb. Ahmad Tariq Karim', role: 'Advisory Board',
    img: 'cosmosfoundation/ahmad-tariq-karim-900x900-1.webp', group: 1, ink: 'var(--terra)',
    affil: 'Former Ambassador of Bangladesh to the United States and India · Advisory Board, Cosmos Foundation',
    bio1: 'Brings a career in the diplomatic service, including ambassadorships in Washington and New Delhi, to the Foundation’s advisory work on South Asian regional cooperation.',
    bio2: 'He advises the research programme on connectivity, water-sharing and the political economy of the Bay of Bengal region, and is a regular voice in the Foundation’s dialogues.',
    quote: 'Neighbourhood is not geography. It is a practice.',
    quoteSrc: 'Ambassadors’ Lecture Series',
    bio3: 'He writes and lectures widely on Bangladesh–India relations and regional institution building.'
  },
  {
    id: 'danilo-turk', name: 'Dr. Danilo Türk', role: 'Advisory Board',
    img: 'cosmosfoundation/danilo-turk-900x900-1.webp', group: 1, ink: 'var(--teal)',
    affil: 'Former President of Slovenia · Former UN Assistant Secretary-General for Political Affairs',
    bio1: 'Joins the Advisory Board from a career spanning national leadership and the United Nations, where he served as Assistant Secretary-General for Political Affairs.',
    bio2: 'His counsel shapes the Foundation’s work on multilateralism, human rights and the place of smaller states in a contested international order.',
    quote: 'Small states keep multilateralism honest.',
    quoteSrc: 'Distinguished Speakers’ Series, Dhaka',
    bio3: 'He teaches international law and remains active in mediation and preventive diplomacy.'
  },
  {
    id: 'george-moose', name: 'Amb. George Moose', role: 'Advisory Board',
    img: 'cosmosfoundation/george-moose-900x900-1.webp', group: 1, ink: 'var(--green)',
    affil: 'Former US Assistant Secretary of State for African Affairs · Advisory Board, Cosmos Foundation',
    bio1: 'Advises the Foundation on conflict prevention and the practice of quiet diplomacy, drawing on a long career in the United States Foreign Service.',
    bio2: 'He has been a consistent advocate for institutions that convene adversaries early, and for the role of non-governmental conveners in doing so.',
    quote: 'The useful conversation is the one held before it is needed.',
    quoteSrc: 'Distinguished Speakers’ Series',
    bio3: 'He works with peacebuilding institutions in Washington and lectures on preventive diplomacy.'
  },
  {
    id: 'li-debiao', name: 'Prof. Li Debiao', role: 'Advisory Board',
    img: 'cosmosfoundation/li-debiao-900x900-1.webp', group: 1, ink: 'var(--red)',
    affil: 'Professor of International Relations · Advisory Board, Cosmos Foundation',
    bio1: 'Advises on East Asian and Chinese perspectives within the Foundation’s regional research programme.',
    bio2: 'His contribution has focused on connectivity, trade corridors and how Bangladesh reads a shifting Asian order.',
    quote: 'Corridors are built twice — once in concrete, once in trust.',
    quoteSrc: 'Bay of Bengal Institute seminar',
    bio3: 'He publishes on Asian regionalism and teaches graduate seminars on comparative foreign policy.'
  },
  {
    id: 'nojibur-rahman', name: 'Md. Nojibur Rahman', role: 'Honorary Emeritus Advisor',
    img: 'cosmosfoundation/cf-nojibur-rahman.webp', group: 2, ink: 'var(--gold)',
    affil: 'Honorary Emeritus Advisor, Cosmos Foundation · Former Principal Secretary, Government of Bangladesh',
    bio1: 'Brings a career at the senior levels of the Bangladesh civil service to the Foundation’s emeritus advisory role.',
    bio2: 'He advises on governance, public administration and the Foundation’s engagement with national policy processes.',
    quote: 'Policy is a long apprenticeship in listening.',
    quoteSrc: 'Foundation dialogue, Dhaka',
    bio3: 'He mentors the Foundation’s younger research fellows and contributes to its policy briefs.'
  },
  {
    id: 'haider-a-khan', name: 'Prof. Haider A. Khan', role: 'Senior Fellow',
    img: 'cosmosfoundation/haider-a-khan-900x900-1.webp', group: 3, ink: 'var(--teal)',
    affil: 'Senior Fellow, Cosmos Foundation · Professor of Economics',
    bio1: 'Leads economic research at the Foundation, working on development economics, energy transition and computable models of the South Asian economy.',
    bio2: 'His fellowship output includes the Foundation’s work on the blue economy and on climate finance for delta states.',
    quote: 'Growth without a delta strategy is a rounding error.',
    quoteSrc: 'Bay of Bengal Institute working paper',
    bio3: 'He supervises the Foundation’s quantitative research and its collaborations with universities abroad.'
  },
  {
    id: 'kenneth-robbins', name: 'Dr. Kenneth X. Robbins', role: 'Principal Research Fellow',
    img: 'cosmosfoundation/dr-kenneth-x-robbins-updated.webp', group: 3, ink: 'var(--terra)',
    affil: 'Principal Research Fellow, Cosmos Foundation · Historian and collector',
    bio1: 'Works on the visual and social history of South Asia, and on the archival strand of the Foundation’s publishing programme.',
    bio2: 'His research has supported several Gallery Cosmos exhibitions drawing on photographic and print material from the region.',
    quote: 'Every photograph of a court is also a photograph of a claim.',
    quoteSrc: 'Exhibition catalogue essay',
    bio3: 'He has curated and co-authored numerous volumes on South Asian history and material culture.'
  },
  {
    id: 'saihan-khan', name: 'Shayan S. Khan', role: 'Senior Research Fellow',
    img: 'cosmosfoundation/cf-saihan-khan-v2.webp', group: 3, ink: 'var(--teal)',
    affil: 'Senior Research Fellow, Cosmos Foundation · Executive Editor, Dhaka Courier · Senior Editor, UNB',
    bio1: 'Brings a background in journalism and international relations to the Foundation’s research fellowship, alongside his editorial work at the Dhaka Courier and UNB.',
    bio2: 'He holds a degree in Business and Economics from Coventry University and a master’s in Political Science from University College London, and has taught international relations as adjunct faculty at Jahangirnagar University.',
    quote: 'The archive is the argument.',
    quoteSrc: 'Note on the digital archive',
    bio3: 'His research interests span contemporary politics, media’s role in society, and climate change, and he also coordinates the Foundation’s outreach to universities across Bangladesh.'
  },
  {
    id: 'asma-awal', name: 'Rear Admiral A. S. M. A. Awal', role: 'Senior Fellow',
    img: null, group: 3, ink: 'var(--gold)',
    affil: 'Senior Fellow, Cosmos Foundation · NBP, OSP, ndc, psc, MDS, MBA (Retd.)',
    bio1: 'Brings over 36 years in the Bangladesh Navy to the Foundation’s fellowship, including service as Commandant of the Bangladesh Naval Academy and Assistant Chief of Naval Staff.',
    bio2: 'His diplomatic postings included Defence Adviser at the Bangladesh High Commission in Sri Lanka and High Commissioner to the Maldives; he co-founded the Bangladesh Institute of Maritime Research and Development (BIMRAD).',
    quote: 'A coastline is a strategy, not just a border.',
    quoteSrc: 'Foundation dialogue, Dhaka',
    bio3: 'He contributes to the Foundation’s seminars on maritime security, regional geopolitics and counter-terrorism.'
  },
  {
    id: 'asad-ul-iqbal-latif', name: 'Asad-ul Iqbal Latif', role: 'Principal Research Fellow',
    img: null, group: 3, ink: 'var(--red)',
    affil: 'Principal Research Fellow, Cosmos Foundation · Journalist and author',
    bio1: 'Brings three decades in journalism — at The Statesman in Kolkata and later The Business Times and The Straits Times in Singapore — to the Foundation’s research fellowship.',
    bio2: 'A Chevening scholar with a degree in History from Cambridge, he has held fellowships at Harvard and the East-West Center, and has written widely on China, Singapore and India, including India in the Making of Singapore.',
    quote: 'A region is written before it is drawn.',
    quoteSrc: 'Foundation dialogue, Dhaka',
    bio3: 'He is currently completing a manuscript on the cultural legacy of Bengal across borders.'
  },
  {
    id: 'silvia-tieri', name: 'Silvia Tieri', role: 'Research Fellow',
    img: 'cosmosfoundation/silvia-tieri.webp', group: 3, ink: 'var(--green)',
    affil: 'Research Fellow, Cosmos Foundation · South Asian politics and migration',
    bio1: 'Researches identity, borders and migration in South Asia, contributing the Foundation’s younger scholarly voice.',
    bio2: 'Her work at the Foundation has looked at how partition-era categories still shape citizenship debates across the region.',
    quote: 'Borders outlive the reasons given for them.',
    quoteSrc: 'Foundation research seminar',
    bio3: 'She writes for regional policy journals and coordinates the Foundation’s seminar series for graduate researchers.'
  }
];
