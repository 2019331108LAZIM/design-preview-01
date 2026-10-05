// Hand-written copy per event. Client-editable: correct wording here
// without touching scan-events.mjs, then re-run `node tools/scan-events.mjs`.
//
// ── How certainty is handled ────────────────────────────────────────────
// Anything wrapped in [[? … ]] is a DRAFT CLAIM that has not been
// confirmed against a source. It renders on the page highlighted, and
// `node tools/verify.mjs` FAILS while any marker survives — so a draft
// claim physically cannot reach go-live unnoticed. Resolve each one by
// either correcting the text and deleting the brackets, or deleting the
// sentence.
//
// Text with NO marker is either (a) verifiable from the photographs
// themselves — event banners, programme slides and backdrops were read
// directly off the source images — or (b) a statement about how the
// Foundation's own programmes work, drawn from assets/data/about.js.
//
// ── Pull quotes ─────────────────────────────────────────────────────────
// `pullquote` is ONLY ever used for text that was physically printed at
// the event (a session title from the programme slide, say). Never put
// invented words in a real person's mouth — an attributed quotation that
// nobody said is the one error on this page that cannot be walked back.
//
// ── picks ───────────────────────────────────────────────────────────────
// The photographs the site shows for this event, in display order, with
// their captions. This list IS the event's gallery: the generated files
// under assets/data/ contain these and nothing else, and every surface
// that shows event photographs (the event page gallery and slideshow, the
// events-page carousel, the homepage Recent Events strip, the cover and
// og:image) is built from it. There is no "show everything" view and no
// fallback to the whole source folder — an event with `picks: []` is a
// hard build failure.
//
// The first pick is the event's cover unless COVER_OVERRIDES says
// otherwise.
//
// ── changing a selection ────────────────────────────────────────────────
// Photographs outside the selection have been deleted from assets/img/ and
// pruned from assets/data/images/events/<slug>.json, so they can't simply
// be named here. To re-select:
//   1. node tools/convert-images.mjs     # restores every photo from source/
//   2. git show <commit>:tools/pick.html > tools/pick.html   # the picker
//   3. pick, paste the block here
//   4. node tools/scan-events.mjs
// See HANDOVER.md §2 for the full procedure.

export const EVENT_COPY = {
  "thai-ambassador-welcome-dinner": {
    // Suppressed: guests holding drinks. Kept so that a fresh
    // convert-images.mjs run (which restores every photo from source/)
    // suppresses them again rather than letting them back in.
    excluded: [
      "events/thai-ambassador-welcome-dinner/thai-ambassador-welcome-dinner-11.webp",
      "events/thai-ambassador-welcome-dinner/thai-ambassador-welcome-dinner-26.webp",
      "events/thai-ambassador-welcome-dinner/thai-ambassador-welcome-dinner-31.webp",
    ],
    kicker: "Welcome Dinner",
    tags: ["Diplomacy"],
    excerpt:
      "Cosmos Centre received the Ambassador of Thailand for a welcome dinner, the Foundation's customary first conversation with an incoming head of mission.",
    body: [
      "The Foundation keeps a quiet diplomatic calendar beside its public lecture programme: a dinner for each new ambassador arriving in Dhaka, held in the same rooms where the Distinguished Speakers' Series meets by day.",
      "The format is deliberately unofficial. There is no podium and no printed programme — the point is a table, a small group, and a few hours in which an incoming envoy can ask the kind of question that does not survive translation into a formal call.",
      "[[? Conversation over the evening ranged across trade, tourism and Thailand's own position in ASEAN — the regional bloc the Foundation's Cosmos Dialogue had examined with George Yeo two years earlier. ]]",
      "[[? The Ambassador was received by the Foundation's Chairman and senior members of its advisory board. ]]",
    ],
    pullquote: null,
    facts: [
      {
        label: "Occasion",
        value: "Welcome dinner for an incoming head of mission",
      },
      {
        label: "Guest of honour",
        value: "[[? Ambassador of the Kingdom of Thailand to Bangladesh ]]",
      },
    ],
    excluded: [
      "events/thai-ambassador-welcome-dinner/thai-ambassador-welcome-dinner-11.webp",
      "events/thai-ambassador-welcome-dinner/thai-ambassador-welcome-dinner-26.webp",
      "events/thai-ambassador-welcome-dinner/thai-ambassador-welcome-dinner-31.webp",
    ],
    picks: [
      {
        src: "events/thai-ambassador-welcome-dinner/thai-ambassador-welcome-dinner-08.webp",
        caption: "",
      },
      {
        src: "events/thai-ambassador-welcome-dinner/thai-ambassador-welcome-dinner-15.webp",
        caption: "",
      },
      {
        src: "events/thai-ambassador-welcome-dinner/thai-ambassador-welcome-dinner-36.webp",
        caption: "",
      },
      {
        src: "events/thai-ambassador-welcome-dinner/thai-ambassador-welcome-dinner-38.webp",
        caption: "",
      },
      {
        src: "events/thai-ambassador-welcome-dinner/thai-ambassador-welcome-dinner-47.webp",
        caption: "",
      },
      {
        src: "events/thai-ambassador-welcome-dinner/thai-ambassador-welcome-dinner-51.webp",
        caption: "",
      },
      {
        src: "events/thai-ambassador-welcome-dinner/thai-ambassador-welcome-dinner-53.webp",
        caption: "",
      },
      {
        src: "events/thai-ambassador-welcome-dinner/thai-ambassador-welcome-dinner-54.webp",
        caption: "",
      },
      {
        src: "events/thai-ambassador-welcome-dinner/thai-ambassador-welcome-dinner-55.webp",
        caption: "",
      },
    ],
  },

  "netherlands-ambassador-welcome-dinner": {
    // Suppressed: guests holding drinks. Kept so that a fresh
    // convert-images.mjs run (which restores every photo from source/)
    // suppresses them again rather than letting them back in.
    excluded: [
      "events/netherlands-ambassador-welcome-dinner/netherlands-ambassador-welcome-dinner-07.webp",
      "events/netherlands-ambassador-welcome-dinner/netherlands-ambassador-welcome-dinner-24.webp",
    ],
    kicker: "Welcome Dinner",
    tags: ["Diplomacy"],
    excerpt:
      "The Ambassador of the Netherlands was welcomed to Dhaka with a dinner at Cosmos Centre, the first formal gathering in what the Foundation hopes will be an active bilateral relationship.",
    body: [
      "Dutch engagement with Bangladesh spans water management, climate adaptation and trade — territory the Foundation's own Bay of Bengal Institute follows closely — which made an early, informal conversation a natural start.",
      "The Institute was set up to work as a conduit between policymakers and civil society across the Bay of Bengal littoral: Track II diplomacy, the blue economy, and the non-traditional security questions that delta countries and low-lying European ones turn out to share more of than either expects.",
      "[[? Delta management was the evening’s recurring subject — the Netherlands has advised on Bangladeshi water planning for decades, and the Delta Plan 2100 drew directly on Dutch practice. ]]",
      "[[? The Ambassador was welcomed by the Foundation’s Chairman, with members of the advisory board and the Institute’s research fellows present. ]]",
    ],
    pullquote: null,
    facts: [
      {
        label: "Occasion",
        value: "Welcome dinner for an incoming head of mission",
      },
      {
        label: "Guest of honour",
        value:
          "[[? Ambassador of the Kingdom of the Netherlands to Bangladesh ]]",
      },
      { label: "Foundation programme", value: "The Bay of Bengal Institute" },
    ],
    excluded: [
      "events/netherlands-ambassador-welcome-dinner/netherlands-ambassador-welcome-dinner-07.webp",
      "events/netherlands-ambassador-welcome-dinner/netherlands-ambassador-welcome-dinner-24.webp",
    ],
    picks: [
      {
        src: "events/netherlands-ambassador-welcome-dinner/netherlands-ambassador-welcome-dinner-11.webp",
        caption: "",
      },
      {
        src: "events/netherlands-ambassador-welcome-dinner/netherlands-ambassador-welcome-dinner-54.webp",
        caption: "",
      },
      {
        src: "events/netherlands-ambassador-welcome-dinner/netherlands-ambassador-welcome-dinner-46.webp",
        caption: "",
      },
      {
        src: "events/netherlands-ambassador-welcome-dinner/netherlands-ambassador-welcome-dinner-16.webp",
        caption: "",
      },
      {
        src: "events/netherlands-ambassador-welcome-dinner/netherlands-ambassador-welcome-dinner-38.webp",
        caption: "",
      },
      {
        src: "events/netherlands-ambassador-welcome-dinner/netherlands-ambassador-welcome-dinner-37.webp",
        caption: "",
      },
    ],
  },

  "korea-ambassador-welcome-dinner": {
    // Suppressed: guests holding drinks. Kept so that a fresh
    // convert-images.mjs run (which restores every photo from source/)
    // suppresses them again rather than letting them back in.
    excluded: [
      "events/korea-ambassador-welcome-dinner/korea-ambassador-welcome-dinner-66.webp",
      "events/korea-ambassador-welcome-dinner/korea-ambassador-welcome-dinner-77.webp",
    ],
    kicker: "Welcome Dinner",
    tags: ["Diplomacy"],
    excerpt:
      "Cosmos Centre hosted a welcome dinner for the Ambassador of the Republic of Korea, opening another chapter in a relationship the Foundation has also followed through its Cosmos Dialogue programme.",
    body: [
      "Korea has featured in the Foundation's dialogue and lecture programmes before, and this dinner continued that thread at a more informal register — introductions ahead of the year's formal engagements.",
      "The sequencing is visible in the Foundation’s own calendar: this dinner in September 2023, then a full Cosmos Dialogue session on Bangladesh–South Korea four months later, in January 2024. The dinner is where that kind of programme usually starts.",
      "[[? Development cooperation and Korean manufacturing investment in Bangladesh were the evening’s main threads. ]]",
      "[[? The Ambassador was received by the Foundation’s Chairman and President. ]]",
    ],
    pullquote: null,
    facts: [
      {
        label: "Occasion",
        value: "Welcome dinner for an incoming head of mission",
      },
      {
        label: "Guest of honour",
        value: "[[? Ambassador of the Republic of Korea to Bangladesh ]]",
      },
      {
        label: "Led to",
        value: "Cosmos Dialogue: Bangladesh–South Korea, January 2024",
      },
    ],
    excluded: [
      "events/korea-ambassador-welcome-dinner/korea-ambassador-welcome-dinner-66.webp",
      "events/korea-ambassador-welcome-dinner/korea-ambassador-welcome-dinner-77.webp",
    ],
    picks: [
      {
        src: "events/korea-ambassador-welcome-dinner/korea-ambassador-welcome-dinner-02.webp",
        caption: "",
      },
      {
        src: "events/korea-ambassador-welcome-dinner/korea-ambassador-welcome-dinner-05.webp",
        caption: "",
      },
      {
        src: "events/korea-ambassador-welcome-dinner/korea-ambassador-welcome-dinner-04.webp",
        caption: "",
      },
      {
        src: "events/korea-ambassador-welcome-dinner/korea-ambassador-welcome-dinner-01.webp",
        caption: "",
      },
      {
        src: "events/korea-ambassador-welcome-dinner/korea-ambassador-welcome-dinner-07.webp",
        caption: "",
      },
      {
        src: "events/korea-ambassador-welcome-dinner/korea-ambassador-welcome-dinner-06.webp",
        caption: "",
      },
      {
        src: "events/korea-ambassador-welcome-dinner/korea-ambassador-welcome-dinner-99.webp",
        caption: "",
      },
      {
        src: "events/korea-ambassador-welcome-dinner/korea-ambassador-welcome-dinner-94.webp",
        caption: "",
      },
      {
        src: "events/korea-ambassador-welcome-dinner/korea-ambassador-welcome-dinner-110.webp",
        caption: "",
      },
      {
        src: "events/korea-ambassador-welcome-dinner/korea-ambassador-welcome-dinner-112.webp",
        caption: "",
      },
      {
        src: "events/korea-ambassador-welcome-dinner/korea-ambassador-welcome-dinner-96.webp",
        caption: "",
      },
      {
        src: "events/korea-ambassador-welcome-dinner/korea-ambassador-welcome-dinner-86.webp",
        caption: "",
      },
    ],
  },

  "philippines-ambassador-welcome-dinner": {
    // Suppressed: guests holding drinks. Kept so that a fresh
    // convert-images.mjs run (which restores every photo from source/)
    // suppresses them again rather than letting them back in.
    excluded: [
      "events/philippines-ambassador-welcome-dinner/philippines-ambassador-welcome-dinner-14.webp",
      "events/philippines-ambassador-welcome-dinner/philippines-ambassador-welcome-dinner-26.webp",
    ],
    kicker: "Welcome Dinner",
    tags: ["Diplomacy"],
    excerpt:
      "The Foundation welcomed the Ambassador of the Philippines to Dhaka with a dinner at Cosmos Centre, extending its practice of opening bilateral relationships around the table rather than the lectern.",
    body: [
      "The evening was one of a run of ambassadorial welcome dinners the Foundation held through 2023, each meant as a first, unhurried conversation rather than a formal call.",
      "Three such dinners fell within two months that year — the British High Commissioner in July, the Philippines in August, Korea in September — a concentration that says less about any one posting than about how many missions were changing hands in Dhaka at once.",
      "[[? Maritime cooperation and labour migration featured in the discussion, both live questions between the two countries. ]]",
      "[[? The Ambassador was received by the Foundation’s Chairman and members of its advisory board. ]]",
    ],
    pullquote: null,
    facts: [
      {
        label: "Occasion",
        value: "Welcome dinner for an incoming head of mission",
      },
      {
        label: "Guest of honour",
        value:
          "[[? Ambassador of the Republic of the Philippines to Bangladesh ]]",
      },
    ],
    excluded: [
      "events/philippines-ambassador-welcome-dinner/philippines-ambassador-welcome-dinner-14.webp",
      "events/philippines-ambassador-welcome-dinner/philippines-ambassador-welcome-dinner-26.webp",
    ],
    excluded: [
      "events/philippines-ambassador-welcome-dinner/philippines-ambassador-welcome-dinner-14.webp",
      "events/philippines-ambassador-welcome-dinner/philippines-ambassador-welcome-dinner-26.webp",
    ],
        excluded: [
      'events/philippines-ambassador-welcome-dinner/philippines-ambassador-welcome-dinner-14.webp',
      'events/philippines-ambassador-welcome-dinner/philippines-ambassador-welcome-dinner-26.webp'
    ],
    picks: [
      { src: 'events/philippines-ambassador-welcome-dinner/philippines-ambassador-welcome-dinner-70.webp', caption: '' },
      { src: 'events/philippines-ambassador-welcome-dinner/philippines-ambassador-welcome-dinner-65.webp', caption: '' },
      { src: 'events/philippines-ambassador-welcome-dinner/philippines-ambassador-welcome-dinner-130.webp', caption: '' },
      { src: 'events/philippines-ambassador-welcome-dinner/philippines-ambassador-welcome-dinner-134.webp', caption: '' },
      { src: 'events/philippines-ambassador-welcome-dinner/philippines-ambassador-welcome-dinner-133.webp', caption: '' },
      { src: 'events/philippines-ambassador-welcome-dinner/philippines-ambassador-welcome-dinner-138.webp', caption: '' },
      { src: 'events/philippines-ambassador-welcome-dinner/philippines-ambassador-welcome-dinner-137.webp', caption: '' },
      { src: 'events/philippines-ambassador-welcome-dinner/philippines-ambassador-welcome-dinner-124.webp', caption: '' },
      { src: 'events/philippines-ambassador-welcome-dinner/philippines-ambassador-welcome-dinner-123.webp', caption: '' },
      { src: 'events/philippines-ambassador-welcome-dinner/philippines-ambassador-welcome-dinner-24.webp', caption: '' }
    ],
  },

  "british-high-commissioner-welcome-dinner": {
    kicker: "Welcome Dinner",
    tags: ["Diplomacy"],
    excerpt:
      "Cosmos Centre hosted a welcome dinner for the British High Commissioner, part of the Foundation’s ongoing engagement with the diplomatic missions based in Dhaka.",
    body: [
      "The UK relationship touches several of the Foundation's programmes, from governance research to the arts, and this dinner was the informal start of the High Commissioner's engagement with that work.",
      "It is a wide surface to introduce in one evening. The Foundation runs a think-tank, a contemporary art gallery holding more than 11,000 works, a printmaking studio, and a conservation organisation separately registered as a charity in England and Wales — the last of which gives the UK relationship a legal footing as well as a diplomatic one.",
      "[[? Climate finance and educational exchange were among the subjects raised over the evening. ]]",
      "[[? The High Commissioner was received by the Foundation’s Chairman, with members of the advisory board present. ]]",
    ],
    pullquote: null,
    facts: [
      {
        label: "Occasion",
        value: "Welcome dinner for an incoming head of mission",
      },
      {
        label: "Guest of honour",
        value: "[[? British High Commissioner to Bangladesh ]]",
      },
      {
        label: "Shared ground",
        value: "WildTeam is registered as a charity in England and Wales",
      },
    ],
      picks: [
      { src: 'events/british-high-commissioner-welcome-dinner/british-high-commissioner-welcome-dinner-83.webp', caption: '' },
      { src: 'events/british-high-commissioner-welcome-dinner/british-high-commissioner-welcome-dinner-21.webp', caption: '' },
      { src: 'events/british-high-commissioner-welcome-dinner/british-high-commissioner-welcome-dinner-07.webp', caption: '' },
      { src: 'events/british-high-commissioner-welcome-dinner/british-high-commissioner-welcome-dinner-06.webp', caption: '' }
    ],
  },

  // ── VERIFIED FROM THE PHOTOGRAPHS ─────────────────────────────────────
  // The programme slide behind the stage (photo 01) is legible at full
  // resolution and gives the series, the session title, the full panel and
  // the media partner. None of that is inferred.
  "cosmos-dialogue-george-yeo": {
    kicker: "Cosmos Dialogue",
    tags: ["Dialogue"],
    excerpt:
      "The Cosmos Dialogue brought George Yeo to Dhaka to ask where Bangladesh stands as the old certainties of a single-pole world give way — a senior statesman in conversation with a room permitted to disagree.",
    body: [
      "Staged under the Distinguished Speaker’s Series, the session took as its title “Bangladesh and ASEAN in a Multipolar World” — a question that sits precisely where the Foundation’s interests meet, between regional economics and the harder business of security alignment.",
      "George Yeo served as Singapore’s Foreign Minister, which makes him an unusually direct witness to how a small, trade-dependent state manages relationships with several larger powers at once without being captured by any of them. That is not an abstract problem for Bangladesh.",
      "Welcome remarks came from Enayetullah Khan, Chairman of the Cosmos Foundation. The panel joined Yeo with Dr. Iftekhar Ahmed Chowdhury, President of the Foundation and a former Foreign Adviser to the Government of Bangladesh — two former foreign ministers, one from each side of the Bay, reading the same map.",
      "Cosmos Dialogue exists for exactly this kind of exchange: an international figure, a full house at Cosmos Centre, and a subject too large for a single lecture to settle. United News of Bangladesh carried the session as media partner.",
    ],
    pullquote: {
      // Printed on the programme slide behind the stage — a session title,
      // not a quotation from any speaker.
      text: "Bangladesh and ASEAN in a Multipolar World",
      source: "Session title, Distinguished Speaker’s Series",
    },
    facts: [
      { label: "Series", value: "Distinguished Speaker’s Series" },
      {
        label: "Speaker",
        value: "Mr. George Yeo, former Foreign Minister of Singapore",
      },
      {
        label: "Welcome remarks",
        value: "Enayetullah Khan, Chairman, Cosmos Foundation",
      },
      {
        label: "On the panel",
        value: "Dr. Iftekhar Ahmed Chowdhury, President, Cosmos Foundation",
      },
      { label: "Media partner", value: "United News of Bangladesh (UNB)" },
    ],
    picks: [
      {
        src: "events/cosmos-dialogue-george-yeo/cosmos-dialogue-george-yeo-05.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-george-yeo/cosmos-dialogue-george-yeo-06.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-george-yeo/cosmos-dialogue-george-yeo-21.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-george-yeo/cosmos-dialogue-george-yeo-22.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-george-yeo/cosmos-dialogue-george-yeo-26.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-george-yeo/cosmos-dialogue-george-yeo-55.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-george-yeo/cosmos-dialogue-george-yeo-50.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-george-yeo/cosmos-dialogue-george-yeo-78.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-george-yeo/cosmos-dialogue-george-yeo-81.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-george-yeo/cosmos-dialogue-george-yeo-90.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-george-yeo/cosmos-dialogue-george-yeo-98.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-george-yeo/cosmos-dialogue-george-yeo-100.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-george-yeo/cosmos-dialogue-george-yeo-109.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-george-yeo/cosmos-dialogue-george-yeo-125.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-george-yeo/cosmos-dialogue-george-yeo-131.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-george-yeo/cosmos-dialogue-george-yeo-136.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-george-yeo/cosmos-dialogue-george-yeo-140.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-george-yeo/cosmos-dialogue-george-yeo-149.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-george-yeo/cosmos-dialogue-george-yeo-155.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-george-yeo/cosmos-dialogue-george-yeo-161.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-george-yeo/cosmos-dialogue-george-yeo-164.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-george-yeo/cosmos-dialogue-george-yeo-168.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-george-yeo/cosmos-dialogue-george-yeo-166.webp",
        caption: "",
      },
    ],
  },

  "cosmos-dialogue-bangladesh-south-korea": {
    kicker: "Cosmos Dialogue",
    tags: ["Dialogue"],
    excerpt:
      "A Cosmos Dialogue session paired Bangladeshi and South Korean voices in conversation, part of the series' running effort to read Bangladesh's regional relationships on their own terms.",
    body: [
      "The Bangladesh–South Korea relationship spans development cooperation and trade, and the Foundation's dialogue format is built to let both sides speak plainly rather than through the usual diplomatic register.",
      "The session followed a welcome dinner the Foundation had given the Korean Ambassador four months earlier — the familiar progression here from an introduction around a table to a programme with an audience and a record.",
      "[[? Panellists took up Korean investment in Bangladeshi manufacturing, the export of labour, and what a middle power’s development path offers a country at a different stage of the same journey. ]]",
      "[[? The session was chaired by the Foundation’s President, with participants joining from Seoul. ]]",
    ],
    pullquote: null,
    facts: [
      { label: "Series", value: "Cosmos Dialogue" },
      {
        label: "Preceded by",
        value: "Korea Ambassador welcome dinner, September 2023",
      },
      { label: "Panel", value: "[[? To be confirmed ]]" },
    ],
    picks: [
      {
        src: "events/cosmos-dialogue-bangladesh-south-korea/cosmos-dialogue-bangladesh-south-korea-05.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-bangladesh-south-korea/cosmos-dialogue-bangladesh-south-korea-11.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-bangladesh-south-korea/cosmos-dialogue-bangladesh-south-korea-18.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-bangladesh-south-korea/cosmos-dialogue-bangladesh-south-korea-13.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-bangladesh-south-korea/cosmos-dialogue-bangladesh-south-korea-28.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-bangladesh-south-korea/cosmos-dialogue-bangladesh-south-korea-39.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-bangladesh-south-korea/cosmos-dialogue-bangladesh-south-korea-48.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-bangladesh-south-korea/cosmos-dialogue-bangladesh-south-korea-52.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-bangladesh-south-korea/cosmos-dialogue-bangladesh-south-korea-61.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-bangladesh-south-korea/cosmos-dialogue-bangladesh-south-korea-66.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-bangladesh-south-korea/cosmos-dialogue-bangladesh-south-korea-71.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-bangladesh-south-korea/cosmos-dialogue-bangladesh-south-korea-75.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-bangladesh-south-korea/cosmos-dialogue-bangladesh-south-korea-87.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-bangladesh-south-korea/cosmos-dialogue-bangladesh-south-korea-89.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-bangladesh-south-korea/cosmos-dialogue-bangladesh-south-korea-86.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-bangladesh-south-korea/cosmos-dialogue-bangladesh-south-korea-88.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-bangladesh-south-korea/cosmos-dialogue-bangladesh-south-korea-04.webp",
        caption: "",
      },
    ],
  },

  // ── VERIFIED FROM THE PHOTOGRAPHS ─────────────────────────────────────
  // The backdrop is fully legible in
  //   source/events/22 June 2023 (Cosmos Dialogue Bangladesh-Nepal)/IMG_7871.jpg
  // (the cover frame has it out of focus; that one is sharp). It gives the
  // series, the session title, all seven panellists with their titles, the
  // programme roles — welcome remarks, keynote, chair, discussants — and
  // the media partner. Nothing below is inferred.
  "cosmos-dialogue-bangladesh-nepal": {
    kicker: "Cosmos Dialogue",
    tags: ["Dialogue"],
    excerpt:
      "The Ambassadors' Lecture Series put Bangladesh's relationship with Nepal on the record under a deliberately forward-looking title — not where the relationship has been, but what it is likely to become.",
    body: [
      "Staged as a Cosmos Dialogue, the session took as its title “Bangladesh–Nepal Relations: Prognosis for the Future”. The two countries share more than a border on the map — connectivity, energy trade and river systems all run through the relationship — and the format let panellists speak to that complexity directly.",
      "Neither country reaches the other without crossing a third. That single geographic fact shapes most of what the two can do together, from hydropower transmission to the transit arrangements that have to precede it, and it is why the relationship gets discussed as a regional question rather than a bilateral one.",
      "The platform was built to put both governments' former insiders in the same room. Masud Khan, Vice President of the Foundation, gave the welcome remarks; the keynote came from H. E. Mr. Ghanshyam Bhandari, Ambassador of Nepal to Bangladesh; and the chair was Ambassador (Retd) Tariq A Karim, former Bangladesh High Commissioner to India and Ambassador to the United States, now Honorary Emeritus Advisor to the Foundation.",
      "The discussants brought the two bureaucracies and the academy to the same table: Mr. Sabbir Ahmed Chowdhury, former Secretary at the Ministry of Foreign Affairs; Mr. Hari Sharma, former Principal Secretary to the Prime Minister of Nepal, joining online; Ms. Lailufar Yasmin of the Department of International Relations at the University of Dhaka; and Mr. Parvez Karim Abbasi of the Department of Economics at East West University.",
      "The Foundation has form here beyond the lectern: it has supported the Bangla Mountaineering and Trekking Club since 2003, including a joint Nepali–Bangladeshi first ascent of Mt. Chekigo in 2010 — a peak since renamed the Nepal–Bangladesh Friendship Peak.",
    ],
    pullquote: {
      // The session title, printed on the backdrop behind the panel.
      text: "Bangladesh–Nepal Relations: Prognosis for the Future",
      source: "Session title, Ambassadors' Lecture Series",
    },
    facts: [
      { label: "Series", value: "Ambassadors' Lecture Series, under Cosmos Dialogue" },
      { label: "Welcome remarks", value: "Masud Khan, Vice President, Cosmos Foundation" },
      {
        label: "Keynote",
        value: "H. E. Mr. Ghanshyam Bhandari, Ambassador of Nepal to Bangladesh",
      },
      {
        label: "Chair",
        value: "Ambassador (Retd) Tariq A Karim — former Bangladesh High Commissioner to India and Ambassador to the United States; Honorary Emeritus Advisor, Cosmos Foundation",
      },
      {
        label: "Discussants",
        value: "Mr. Sabbir Ahmed Chowdhury (former Secretary, Ministry of Foreign Affairs); Mr. Hari Sharma (former Principal Secretary to the Prime Minister of Nepal, online); Ms. Lailufar Yasmin (Professor, International Relations, University of Dhaka); Mr. Parvez Karim Abbasi (Assistant Professor, Economics, East West University)",
      },
      { label: "Media partner", value: "United News of Bangladesh (UNB)" },
      {
        label: "Related work",
        value: "Nepal–Bangladesh Friendship Peak, first ascent 2010",
      },
    ],
    picks: [
      {
        src: "events/cosmos-dialogue-bangladesh-nepal/cosmos-dialogue-bangladesh-nepal-06.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-bangladesh-nepal/cosmos-dialogue-bangladesh-nepal-03.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-bangladesh-nepal/cosmos-dialogue-bangladesh-nepal-09.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-bangladesh-nepal/cosmos-dialogue-bangladesh-nepal-20.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-bangladesh-nepal/cosmos-dialogue-bangladesh-nepal-22.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-bangladesh-nepal/cosmos-dialogue-bangladesh-nepal-47.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-bangladesh-nepal/cosmos-dialogue-bangladesh-nepal-45.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-bangladesh-nepal/cosmos-dialogue-bangladesh-nepal-59.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-bangladesh-nepal/cosmos-dialogue-bangladesh-nepal-64.webp",
        caption: "",
      },
      {
        src: "events/cosmos-dialogue-bangladesh-nepal/cosmos-dialogue-bangladesh-nepal-68.webp",
        caption: "",
      },
    ],
  },

  "live-drawing-and-exhibition": {
    kicker: "Live Event",
    tags: ["Exhibition"],
    excerpt:
      "Gallery Cosmos opened its floor to a live drawing session and exhibition, pairing working artists with the public in the kind of unscripted event the gallery does best.",
    body: [
      "Live drawing sessions strip the studio process down to something anyone can watch — pencil or ink meeting paper in real time — and the accompanying exhibition let the results stand alongside more finished work.",
      "The photographs show the session working outdoors in the garden rather than in a hung gallery space: trestle tables, materials laid out in the open, artists in printed aprons, and visitors close enough to watch a mark being made rather than a finished surface.",
      "That proximity is the argument. A finished picture on a wall conceals every decision that produced it; a drawing made in front of you concedes them all, which is a more useful thing for a public audience to see.",
      "[[? The session was led by artists associated with Cosmos Atelier 71, the Foundation’s printmaking studio, and the works made on the day were shown alongside the exhibition. ]]",
    ],
    pullquote: null,
    facts: [
      { label: "Held by", value: "Gallery Cosmos" },
      {
        label: "Format",
        value: "Live drawing session with accompanying exhibition",
      },
      { label: "Participating artists", value: "[[? To be confirmed ]]" },
    ],
    picks: [
      {
        src: "events/live-drawing-and-exhibition/live-drawing-and-exhibition-02.webp",
        caption: "",
      },
      {
        src: "events/live-drawing-and-exhibition/live-drawing-and-exhibition-01.webp",
        caption: "",
      },
      {
        src: "events/live-drawing-and-exhibition/live-drawing-and-exhibition-04.webp",
        caption: "",
      },
      {
        src: "events/live-drawing-and-exhibition/live-drawing-and-exhibition-06.webp",
        caption: "",
      },
      {
        src: "events/live-drawing-and-exhibition/live-drawing-and-exhibition-08.webp",
        caption: "",
      },
      {
        src: "events/live-drawing-and-exhibition/live-drawing-and-exhibition-09.webp",
        caption: "",
      },
      {
        src: "events/live-drawing-and-exhibition/live-drawing-and-exhibition-23.webp",
        caption: "",
      },
      {
        src: "events/live-drawing-and-exhibition/live-drawing-and-exhibition-31.webp",
        caption: "",
      },
      {
        src: "events/live-drawing-and-exhibition/live-drawing-and-exhibition-35.webp",
        caption: "",
      },
      {
        src: "events/live-drawing-and-exhibition/live-drawing-and-exhibition-47.webp",
        caption: "",
      },
      {
        src: "events/live-drawing-and-exhibition/live-drawing-and-exhibition-53.webp",
        caption: "",
      },
      {
        src: "events/live-drawing-and-exhibition/live-drawing-and-exhibition-72.webp",
        caption: "",
      },
      {
        src: "events/live-drawing-and-exhibition/live-drawing-and-exhibition-73.webp",
        caption: "",
      },
      {
        src: "events/live-drawing-and-exhibition/live-drawing-and-exhibition-63.webp",
        caption: "",
      },
      {
        src: "events/live-drawing-and-exhibition/live-drawing-and-exhibition-18.webp",
        caption: "",
      },
      {
        src: "events/live-drawing-and-exhibition/live-drawing-and-exhibition-07.webp",
        caption: "",
      },
    ],
  },

  "jamil-khan-art-event": {
    kicker: "Gallery Event",
    tags: ["Exhibition"],
    excerpt:
      "Gallery Cosmos hosted an event around the work of artist Jamil Khan, the second of two gatherings the gallery held for him within fifteen months.",
    body: [
      "The event gave visitors an informal, conversational counterpart to the more conventional exhibition format the gallery had shown his work in the previous year.",
      "Where the 2023 exhibition “Inspiration” hung finished canvases in the Garden Gallery, this gathering put the work back out in the open air, on easels, with the artist and his audience in the same space — closer to a studio visit than a private view.",
      "[[? Khan spoke about the working method behind the paintings shown, and several new canvases were seen publicly for the first time. ]]",
      "[[? The gathering was opened by the Gallery’s director. ]]",
    ],
    pullquote: null,
    facts: [
      { label: "Held by", value: "Gallery Cosmos" },
      { label: "Artist", value: "Jamil Khan" },
      {
        label: "Earlier showing",
        value: "“Inspiration”, solo exhibition, 11 November 2023",
      },
    ],
    picks: [
      {
        src: "events/jamil-khan-art-event/jamil-khan-art-event-10.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-event/jamil-khan-art-event-11.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-event/jamil-khan-art-event-12.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-event/jamil-khan-art-event-15.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-event/jamil-khan-art-event-14.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-event/jamil-khan-art-event-13.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-event/jamil-khan-art-event-16.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-event/jamil-khan-art-event-19.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-event/jamil-khan-art-event-20.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-event/jamil-khan-art-event-24.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-event/jamil-khan-art-event-29.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-event/jamil-khan-art-event-32.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-event/jamil-khan-art-event-35.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-event/jamil-khan-art-event-34.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-event/jamil-khan-art-event-43.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-event/jamil-khan-art-event-55.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-event/jamil-khan-art-event-66.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-event/jamil-khan-art-event-64.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-event/jamil-khan-art-event-71.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-event/jamil-khan-art-event-79.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-event/jamil-khan-art-event-98.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-event/jamil-khan-art-event-41.webp",
        caption: "",
      },
    ],
  },

  "rickshaw-art-exhibition": {
    kicker: "Exhibition",
    tags: ["Exhibition"],
    excerpt:
      "Gallery Cosmos exhibited rickshaw art, the vivid, hand-painted vernacular tradition that has decorated Dhaka's streets for generations, framed here as a serious subject for the gallery wall.",
    body: [
      "Rickshaw art rarely gets treated as fine art in its own right — the exhibition argued that it should, hanging panels and painted motifs from the tradition with the same care the gallery gives its modernist collection.",
      "The photographs show the works mounted and framed on easels through the gallery’s brick-walled garden: film-poster faces, tigers, village scenes and dense floral borders, in the high-contrast palette the form has always used because it has to read from a moving vehicle at a distance.",
      "Framing is the whole editorial move. Presented on an easel at eye level rather than bolted to the back of a cycle rickshaw, the same painted panel stops being street furniture and starts being a picture — which is either a promotion or a misreading, and the exhibition was content to leave that open.",
      "[[? The works shown were drawn from Dhaka rickshaw-painting workshops, with several of the painters present at the opening. ]]",
    ],
    pullquote: null,
    facts: [
      { label: "Held by", value: "Gallery Cosmos" },
      { label: "Subject", value: "Hand-painted Bangladeshi rickshaw art" },
      { label: "Painters represented", value: "[[? To be confirmed ]]" },
    ],
    picks: [
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-01.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-02.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-03.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-04.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-05.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-06.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-07.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-08.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-09.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-10.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-11.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-12.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-13.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-14.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-15.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-17.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-18.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-19.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-20.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-21.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-22.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-25.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-26.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-23.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-24.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-36.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-34.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-42.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-50.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-52.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-55.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-66.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-72.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-75.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-79.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-112.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-127.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-166.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-172.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-147.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-146.webp",
        caption: "",
      },
      {
        src: "events/rickshaw-art-exhibition/rickshaw-art-exhibition-140.webp",
        caption: "",
      },
    ],
  },

  // ── VERIFIED FROM THE PHOTOGRAPHS ─────────────────────────────────────
  // The exhibition banner (photo 02) is legible at full resolution: title,
  // date, hours and venue. Note the venue is NOT Cosmos Centre.
  "jamil-khan-art-exhibition": {
    kicker: "Exhibition",
    tags: ["Exhibition"],
    venue: "Garden Gallery, Baridhara, Dhaka",
    // Leads with a letter, not a quotation mark: the .dropcap rule sets the
    // first character in display type, and a lone quote mark set three
    // lines tall reads as a typo.
    excerpt:
      "A solo exhibition of paintings by Jamil Khan, titled “Inspiration”, opened at the Garden Gallery in Baridhara for a single evening — the first of two gallery events built around his practice.",
    body: [
      "The exhibition gave the gallery’s audience a sustained look at a single artist’s work, in keeping with Gallery Cosmos’s curatorial line of Bangladeshi and South Asian art built around research rather than a quick survey.",
      "It ran for one afternoon and evening, from three until nine on Saturday 11 November 2023, at the Garden Gallery on Road 4 in Baridhara. A six-hour window for a solo show is a deliberate choice: it concentrates the audience into a single occasion where the artist is present throughout, rather than spreading thin attendance across a fortnight.",
      "The paintings are abstract and heavily worked — dark grounds broken by weather-like passages of ochre, white and green, several signed and dated 23. Hung against exposed brick and shown on easels through the garden, they were lit as much by the evening as by the gallery.",
      "[[? The exhibition was opened by the Foundation’s Chairman, and the works shown were made over the preceding year. ]]",
    ],
    pullquote: {
      // The exhibition's own title, printed on the banner at the entrance.
      text: "Inspiration",
      source: "Exhibition title, solo show by Jamil Khan",
    },
    facts: [
      {
        label: "Exhibition",
        value: "“Inspiration” — solo exhibition by Jamil Khan",
      },
      { label: "Presented by", value: "Gallery Cosmos" },
      { label: "Hours", value: "03:00 – 09:00 pm, Saturday 11 November 2023" },
      { label: "Full address", value: "Road 4, House 23, Baridhara, Dhaka" },
    ],
    picks: [
      {
        src: "events/jamil-khan-art-exhibition/jamil-khan-art-exhibition-03.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-exhibition/jamil-khan-art-exhibition-10.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-exhibition/jamil-khan-art-exhibition-22.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-exhibition/jamil-khan-art-exhibition-21.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-exhibition/jamil-khan-art-exhibition-20.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-exhibition/jamil-khan-art-exhibition-24.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-exhibition/jamil-khan-art-exhibition-25.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-exhibition/jamil-khan-art-exhibition-26.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-exhibition/jamil-khan-art-exhibition-35.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-exhibition/jamil-khan-art-exhibition-43.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-exhibition/jamil-khan-art-exhibition-46.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-exhibition/jamil-khan-art-exhibition-48.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-exhibition/jamil-khan-art-exhibition-58.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-exhibition/jamil-khan-art-exhibition-55.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-exhibition/jamil-khan-art-exhibition-71.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-exhibition/jamil-khan-art-exhibition-75.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-exhibition/jamil-khan-art-exhibition-81.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-exhibition/jamil-khan-art-exhibition-92.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-exhibition/jamil-khan-art-exhibition-103.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-exhibition/jamil-khan-art-exhibition-110.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-exhibition/jamil-khan-art-exhibition-120.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-exhibition/jamil-khan-art-exhibition-113.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-exhibition/jamil-khan-art-exhibition-99.webp",
        caption: "",
      },
      {
        src: "events/jamil-khan-art-exhibition/jamil-khan-art-exhibition-91.webp",
        caption: "",
      },
    ],
  },

  // ── VERIFIED FROM THE PHOTOGRAPHS ─────────────────────────────────────
  // The projected title slide (photo 01) gives the conference's full name,
  // the chief guest with title and office, the venue and the date.
  "annual-district-correspondent-conference-2026": {
    kicker: "Conference",
    tags: ["Conference"],
    excerpt:
      "Cosmos Centre hosted United News of Bangladesh's Annual District Correspondents' Conference, bringing reporters from across the country's districts together under one roof for a day of shared briefing and discussion.",
    body: [
      "District correspondents carry national reporting into every corner of the country, and the conference is the Foundation’s yearly acknowledgement of that — a chance to compare notes across regions rather than file alone.",
      "The conference is run by United News of Bangladesh, the wire service within the Cosmos Group, and it is the one day in the year when a distributed newsroom is physically in the same room. Most of these reporters work single-handed in their districts and file to Dhaka without ever meeting the desk that edits them.",
      "Mr. Zahir Uddin Swapon, MP, Minister for Information and Broadcasting, attended as chief guest — which puts the correspondents and the ministry that regulates their industry in front of one another for a day, on the record.",
      "The photographs record the shape of it: a full hall, correspondent after correspondent taking the floor at the lectern, and a platform party seated behind. Most of the day was the reporters talking, not being talked at.",
    ],
    pullquote: null,
    facts: [
      {
        label: "Full title",
        value: "Annual District Correspondents’ Conference 2026",
      },
      { label: "Convened by", value: "United News of Bangladesh (UNB)" },
      {
        label: "Chief guest",
        value:
          "Mr. Zahir Uddin Swapon, MP — Hon’ble Minister for Information and Broadcasting, Government of the People’s Republic of Bangladesh",
      },
    ],
    picks: [
      {
        src: "events/annual-district-correspondent-conference-2026/annual-district-correspondent-conference-2026-09.webp",
        caption: "",
      },
      {
        src: "events/annual-district-correspondent-conference-2026/annual-district-correspondent-conference-2026-11.webp",
        caption: "",
      },
      {
        src: "events/annual-district-correspondent-conference-2026/annual-district-correspondent-conference-2026-07.webp",
        caption: "",
      },
      {
        src: "events/annual-district-correspondent-conference-2026/annual-district-correspondent-conference-2026-21.webp",
        caption: "",
      },
      {
        src: "events/annual-district-correspondent-conference-2026/annual-district-correspondent-conference-2026-23.webp",
        caption: "",
      },
      {
        src: "events/annual-district-correspondent-conference-2026/annual-district-correspondent-conference-2026-38.webp",
        caption: "",
      },
      {
        src: "events/annual-district-correspondent-conference-2026/annual-district-correspondent-conference-2026-32.webp",
        caption: "",
      },
      {
        src: "events/annual-district-correspondent-conference-2026/annual-district-correspondent-conference-2026-59.webp",
        caption: "",
      },
      {
        src: "events/annual-district-correspondent-conference-2026/annual-district-correspondent-conference-2026-52.webp",
        caption: "",
      },
      {
        src: "events/annual-district-correspondent-conference-2026/annual-district-correspondent-conference-2026-51.webp",
        caption: "",
      },
      {
        src: "events/annual-district-correspondent-conference-2026/annual-district-correspondent-conference-2026-55.webp",
        caption: "",
      },
      {
        src: "events/annual-district-correspondent-conference-2026/annual-district-correspondent-conference-2026-85.webp",
        caption: "",
      },
      {
        src: "events/annual-district-correspondent-conference-2026/annual-district-correspondent-conference-2026-78.webp",
        caption: "",
      },
      {
        src: "events/annual-district-correspondent-conference-2026/annual-district-correspondent-conference-2026-88.webp",
        caption: "",
      },
      {
        src: "events/annual-district-correspondent-conference-2026/annual-district-correspondent-conference-2026-89.webp",
        caption: "",
      },
      {
        src: "events/annual-district-correspondent-conference-2026/annual-district-correspondent-conference-2026-81.webp",
        caption: "",
      },
      {
        src: "events/annual-district-correspondent-conference-2026/annual-district-correspondent-conference-2026-67.webp",
        caption: "",
      },
      {
        src: "events/annual-district-correspondent-conference-2026/annual-district-correspondent-conference-2026-66.webp",
        caption: "",
      },
    ],
  },

  "keynote-session-ambassador-milam": {
    kicker: "Keynote Session",
    tags: ["Lecture"],
    excerpt:
      "The Foundation's Distinguished Speakers' Series welcomed Ambassador Milam for a keynote session, continuing its run of frank, on-the-record conversations with senior diplomats.",
    body: [
      "The keynote format gives a single speaker room for a fuller argument than the Foundation's usual dialogue panels allow, before the floor opens to the kind of direct questioning the series is known for.",
      "[[? William B. Milam served as United States Ambassador to Bangladesh in the late 1990s and has written on the country’s politics since, which gives his reading of it an unusually long baseline. ]]",
      "The photographs from the day include a presentation in the Foundation’s library — the room’s shelves behind, a volume handed over and held up for the camera — alongside remarks given at the lectern.",
      "The book is Art Against Genocide, still in its wrapper, its cover carrying a painted scene of overloaded boats and a crowd crossing open water. [[? It is a Foundation publication, presented to mark the occasion of the keynote. ]]",
    ],
    pullquote: null,
    facts: [
      { label: "Series", value: "Distinguished Speakers’ Series" },
      { label: "Speaker", value: "[[? Amb. William B. Milam ]]" },
      { label: "Topic", value: "[[? To be confirmed ]]" },
      { label: "Presented on the day", value: "Art Against Genocide" },
    ],
    picks: [
      {
        src: "events/keynote-session-ambassador-milam/keynote-session-ambassador-milam-01.webp",
        caption: "",
      },
      {
        src: "events/keynote-session-ambassador-milam/keynote-session-ambassador-milam-03.webp",
        caption: "",
      },
      {
        src: "events/keynote-session-ambassador-milam/keynote-session-ambassador-milam-06.webp",
        caption: "",
      },
      {
        src: "events/keynote-session-ambassador-milam/keynote-session-ambassador-milam-13.webp",
        caption: "",
      },
      {
        src: "events/keynote-session-ambassador-milam/keynote-session-ambassador-milam-20.webp",
        caption: "",
      },
      {
        src: "events/keynote-session-ambassador-milam/keynote-session-ambassador-milam-19.webp",
        caption: "",
      },
      {
        src: "events/keynote-session-ambassador-milam/keynote-session-ambassador-milam-28.webp",
        caption: "",
      },
      {
        src: "events/keynote-session-ambassador-milam/keynote-session-ambassador-milam-38.webp",
        caption: "",
      },
      {
        src: "events/keynote-session-ambassador-milam/keynote-session-ambassador-milam-45.webp",
        caption: "",
      },
      {
        src: "events/keynote-session-ambassador-milam/keynote-session-ambassador-milam-44.webp",
        caption: "",
      },
      {
        src: "events/keynote-session-ambassador-milam/keynote-session-ambassador-milam-50.webp",
        caption: "",
      },
      {
        src: "events/keynote-session-ambassador-milam/keynote-session-ambassador-milam-51.webp",
        caption: "",
      },
      {
        src: "events/keynote-session-ambassador-milam/keynote-session-ambassador-milam-49.webp",
        caption: "",
      },
    ],
  },
};

export const DEFAULT_VENUE = "Cosmos Centre, Dhaka";
export const COVER_OVERRIDES = {};

// Draft-claim marker. Kept here so scan-events.mjs, verify.mjs and the
// renderer all agree on one syntax: [[? text ]].
export const UNVERIFIED_RE = /\[\[\?([\s\S]*?)\]\]/g;
