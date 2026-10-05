import { test, expect } from '@playwright/test';

// Every route, plus one of each detail page. Covers the image pipeline end
// to end: a key in a data file that no longer resolves, or a file pruned
// while still referenced, shows up here as a 404 or a zero-width <img>.
const ROUTES = [
  '/index.html', '/about.html', '/board.html', '/initiatives.html', '/events.html',
  '/media.html', '/contact.html', '/speakers.html', '/ambassadors.html', '/system.html',
  '/board-member.html?id=enayetullah-khan',
  '/board-member.html?id=vice-chairman',
  '/initiative.html?id=gallery',
  '/event.html?id=cosmos-dialogue-george-yeo',
  '/event.html?id=jamil-khan-art-exhibition',
];

// assets/video/hero.* are intentionally absent — see HANDOVER.md §6.
const EXPECTED_MISSING = /\/assets\/video\/hero\.(mp4|webm)$/;

for (const route of ROUTES) {
  for (const theme of ['dark', 'light'] as const) {
    test(`no broken assets on ${route} (${theme})`, async ({ page }) => {
      const failed: string[] = [];
      page.on('response', r => {
        if (r.status() >= 400 && !EXPECTED_MISSING.test(r.url())) {
          failed.push(`${r.status()} ${r.url()}`);
        }
      });

      await page.addInitScript(t => {
        try { localStorage.setItem('cosmos-theme', t as string); } catch {}
      }, theme);

      await page.goto(route, { waitUntil: 'networkidle' });
      await page.evaluate(() => {
        document.querySelectorAll('[data-reveal]').forEach(e => e.classList.add('is-visible'));
      });
      await page.waitForTimeout(900);

      const broken = await page.evaluate(() =>
        Array.from(document.querySelectorAll('img'))
          .filter(i => i.complete && i.naturalWidth === 0)
          .map(i => i.currentSrc || i.src || i.getAttribute('src') || '(no src)')
      );

      expect(failed, `failed requests on ${route}`).toEqual([]);
      expect(broken, `broken <img> on ${route}`).toEqual([]);
    });
  }
}
