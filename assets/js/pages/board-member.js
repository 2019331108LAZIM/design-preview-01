import { bootstrap, initReveal } from '../main.js';
import { loadImageIndex, imgTag } from '../img.js';
import { BOARD } from '../../data/board.js';
import { SERIES } from '../../data/series.js';

function getId() {
  return new URLSearchParams(location.search).get('id');
}

// Real, sourced "appearances" — cross-referenced against the Distinguished
// Speakers' / Ambassadors' series data rather than invented. A member with
// no series appearance on record gets an honest empty state, not filler.
function findAppearances(member) {
  const out = [];
  for (const series of [SERIES.speakers, SERIES.ambassadors]) {
    const hit = series.people.find(p => p.name === member.name);
    if (hit) out.push({ date: hit.date, title: hit.talk, series: series.title });
  }
  return out;
}

function renderProfile(member, images) {
  const appearances = findAppearances(member);
  document.getElementById('profile-root').innerHTML = `
    <section class="profile-hero">
      <div class="profile-hero__inner">
        <div class="frame--offset">
          <div class="frame${member.placeholder ? ' frame--placeholder' : ''}" style="aspect-ratio:4/5${member.placeholder ? '' : `;background:${member.ink}`}">${imgTag(images, member.img, member.placeholder ? '' : member.name, { sizes: '380px', priority: true })}</div>
        </div>
        <div>
          <a class="profile-hero__back" href="board.html">← Meet the Board</a>
          <div class="profile-hero__role">${member.role}</div>
          <h1 class="profile-hero__name">${member.name}</h1>
          <p class="profile-hero__affil">${member.affil}</p>
        </div>
      </div>
    </section>
    <section class="profile-body">
      <div>
        ${member.placeholder ? `
          <div class="profile-pending">
            <div class="profile-pending__k">Profile pending</div>
            <p class="profile-pending__p">
              This entry is a placeholder. The portrait above is a drawn
              silhouette, not a photograph, and the text below describes what
              belongs in each paragraph rather than standing in for it.
            </p>
          </div>` : ''}
        <p class="profile-body__lead${member.placeholder ? '' : ' dropcap'}">${member.bio1}</p>
        <p class="profile-body__p">${member.bio2}</p>
        ${member.quote ? `
        <figure class="pull-quote">
          <blockquote>“${member.quote}”</blockquote>
          <figcaption>${member.quoteSrc}</figcaption>
        </figure>` : ''}
        <p class="profile-body__p">${member.bio3}</p>
      </div>
      <aside class="fact-panel">
        <div class="fact-row__k" style="margin-bottom:18px">Appearances</div>
        ${appearances.length ? appearances.map(a => `
          <div class="appearance">
            <div class="appearance__date">${a.date} · ${a.series}</div>
            <div class="appearance__title">${a.title}</div>
          </div>`).join('') : '<p style="margin:0;font:400 13.5px/1.6 var(--font-body);color:var(--ink3)">No public lecture appearances on record yet.</p>'}
        <div class="profile-links">
          <span data-backend="TODO: wire to LinkedIn profile URL">LinkedIn</span>
          <span data-backend="TODO: wire to publications list">Publications</span>
        </div>
      </aside>
    </section>
    <section class="others-section">
      <div class="others-section__head">Other board members</div>
      <div class="others-scroller" data-scroller="1" id="others-scroller"></div>
    </section>
  `;

  const others = BOARD.filter(p => p.id !== member.id).slice(0, 8);
  document.getElementById('others-scroller').innerHTML = others.map(o => `
    <a class="portrait-card" href="board-member.html?id=${o.id}">
      <div class="portrait-card__frame" style="background:${o.ink}">${imgTag(images, o.img, o.name, { sizes: '200px' })}</div>
      <div class="portrait-card__name">${o.name}</div>
    </a>
  `).join('');

  document.getElementById('doc-title').textContent = `${member.name} — Cosmos Foundation`;
  document.getElementById('meta-desc').setAttribute('content', member.affil);
  document.getElementById('canonical').setAttribute('href', `https://www.cosmosfoundationbd.org/board-member.html?id=${member.id}`);
  document.getElementById('og-title').setAttribute('content', `${member.name} — Cosmos Foundation`);
  document.getElementById('og-desc').setAttribute('content', member.affil);
  document.getElementById('og-url').setAttribute('content', `https://www.cosmosfoundationbd.org/board-member.html?id=${member.id}`);

  initReveal();
}

async function main() {
  await bootstrap();
  const images = await loadImageIndex();
  const id = getId();
  const member = BOARD.find(p => p.id === id);
  if (!member) {
    document.getElementById('profile-not-found').hidden = false;
    document.getElementById('doc-title').textContent = 'Profile not found — Cosmos Foundation';
    return;
  }
  renderProfile(member, images);
}

main();
