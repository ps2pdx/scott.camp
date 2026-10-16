import { existsSync, readFileSync, statSync } from 'node:fs';
function pngSize(path: string) { const b = readFileSync(path); return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }; }
it('og.png is 1200 by 630 and favicon.png is 32 by 32', () => {
  expect(existsSync('public/og.png')).toBe(true);
  expect(pngSize('public/og.png')).toEqual({ w: 1200, h: 630 });
  expect(pngSize('public/favicon.png')).toEqual({ w: 32, h: 32 });
});
it('og.png is the cover, under 300 KB, and the og:image URL carries a version', () => {
  expect(statSync('public/og.png').size).toBeLessThan(300 * 1024);
  expect(readFileSync('scripts/faces.ts', 'utf8')).toContain('#og-face > [data-part="cover"]');
  expect(readFileSync('bell/index.html', 'utf8')).toMatch(/og:image" content="https:\/\/scott\.camp\/og\.png\?v=\d+"/);
});
