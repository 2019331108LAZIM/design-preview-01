import { test, expect } from '@playwright/test';

const PAGES = [
  '/index.html', '/about.html', '/board.html', '/board-member.html?id=enayetullah-khan',
  '/initiatives.html', '/initiative.html?id=gallery', '/events.html',
  '/event.html?id=cosmos-dialogue-george-yeo', '/media.html', '/contact.html',
  '/speakers.html', '/ambassadors.html', '/system.html',
];

const audit = () => {
  const serifUnder24: string[] = [];
  const lhOutOfBand: string[] = [];
  for (const el of Array.from(document.querySelectorAll('body *'))) {
    const hasText = Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent!.trim());
    if (!hasText) continue;
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden') continue;
    const size = parseFloat(s.fontSize);
    const fam = s.fontFamily.toLowerCase();
    if (/instrument serif|georgia|times/.test(fam) && size < 24) {
      serifUnder24.push(`${el.tagName}.${el.className} @${size}px`);
    }
    if (el.tagName === 'P' && size >= 14 && size <= 20) {
      const r = parseFloat(s.lineHeight) / size;
      if (r < 1.45 || r > 1.75) lhOutOfBand.push(`${el.tagName}.${el.className} ${size}px lh ${r.toFixed(2)}`);
    }
  }
  return { serifUnder24: [...new Set(serifUnder24)], lhOutOfBand: [...new Set(lhOutOfBand)] };
};

for (const p of PAGES) {
  test(`typography rules hold on ${p}`, async ({ page }) => {
    await page.goto(p);
    await page.waitForTimeout(1200);
    const r = await page.evaluate(audit);
    expect(r.serifUnder24, `display serif below 24px on ${p}`).toEqual([]);
    expect(r.lhOutOfBand, `paragraph line-height outside 1.45–1.75 on ${p}`).toEqual([]);
  });
}
