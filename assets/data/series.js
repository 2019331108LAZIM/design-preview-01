// Distinguished Speakers' Series & Ambassadors' Lecture Series — carried
// over verbatim from the approved mockup.
// Shape mirrors: GET /api/series/{key}
export const SERIES = {
  speakers: {
    key: 'speakers', eyebrow: 'Flagship Programme', title: 'Distinguished Speakers’ Series', ink: 'var(--terra)',
    dek: 'Since 2015 the Foundation has brought former heads of state, foreign ministers and multilateral officials to Dhaka to speak on the record, to a room that is allowed to disagree.',
    stats: [
      { n: '40+', label: 'Lectures delivered in Dhaka' },
      { n: '18', label: 'Countries represented' },
      { n: '2015', label: 'First session, Cosmos Centre' }
    ],
    people: [
      { name: 'Dr. Danilo Türk', role: 'Former President of Slovenia', img: 'cosmosfoundation/danilo-turk-900x900-1.webp', date: 'Session 34', talk: 'Small States and the Future of Multilateralism' },
      { name: 'Amb. George Moose', role: 'Former US Asst. Secretary of State', img: 'cosmosfoundation/george-moose-900x900-1.webp', date: 'Session 31', talk: 'Preventive Diplomacy in a Distracted World' },
      { name: 'Prof. Haider A. Khan', role: 'Senior Fellow, Cosmos Foundation', img: 'cosmosfoundation/haider-a-khan-900x900-1.webp', date: 'Session 29', talk: 'Climate Finance for Delta Economies' },
      { name: 'Prof. Li Debiao', role: 'Professor of International Relations', img: 'cosmosfoundation/li-debiao-900x900-1.webp', date: 'Session 27', talk: 'Asia’s Corridors and Bangladesh’s Choices' },
      { name: 'Dr. Kenneth X. Robbins', role: 'Principal Research Fellow', img: 'cosmosfoundation/dr-kenneth-x-robbins-updated.webp', date: 'Session 24', talk: 'Reading South Asia Through Its Images' },
      { name: 'Md. Nojibur Rahman', role: 'Former Principal Secretary', img: 'cosmosfoundation/cf-nojibur-rahman.webp', date: 'Session 22', talk: 'Administering a Fast-Growing Delta State' }
    ]
  },
  ambassadors: {
    key: 'ambassadors', eyebrow: 'Diplomatic Track', title: 'Ambassadors’ Lecture Series', ink: 'var(--teal)',
    dek: 'A quieter, working series: serving and former ambassadors in Dhaka speak to a smaller room about the practical craft of representing one country inside another.',
    stats: [
      { n: '26', label: 'Lectures since 2017' },
      { n: '90 min', label: 'On the record, then off it' },
      { n: 'Salon', label: 'Format, by invitation' }
    ],
    people: [
      { name: 'Amb. Ahmad Tariq Karim', role: 'Former Ambassador to the US and India', img: 'cosmosfoundation/ahmad-tariq-karim-900x900-1.webp', date: 'Lecture 26', talk: 'Neighbourhood as a Practice' },
      { name: 'Amb. George Moose', role: 'US Foreign Service (ret.)', img: 'cosmosfoundation/george-moose-900x900-1.webp', date: 'Lecture 23', talk: 'What an Embassy Actually Does' },
      { name: 'Dr. Danilo Türk', role: 'Former UN Asst. Secretary-General', img: 'cosmosfoundation/danilo-turk-900x900-1.webp', date: 'Lecture 21', talk: 'Human Rights at the Negotiating Table' },
      { name: 'Silvia Tieri', role: 'Research Fellow, Cosmos Foundation', img: 'cosmosfoundation/silvia-tieri.webp', date: 'Lecture 19', talk: 'Migration, Borders and the Consular Desk' },
      { name: 'Prof. Li Debiao', role: 'Professor of International Relations', img: 'cosmosfoundation/li-debiao-900x900-1.webp', date: 'Lecture 17', talk: 'Reading Beijing From Dhaka' },
      { name: 'Md. Nojibur Rahman', role: 'Former Principal Secretary', img: 'cosmosfoundation/cf-nojibur-rahman.webp', date: 'Lecture 15', talk: 'The Civil Service and Foreign Policy' }
    ]
  }
};
