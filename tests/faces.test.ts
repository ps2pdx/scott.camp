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
it('volume face titles never break inside a word and shrink to fit the longest word', async () => {
  const css = readFileSync('src/components/VolumeFace.module.css', 'utf8');
  expect(css).toMatch(/\.nm\{[^}]*hyphens:manual/);
  expect(css).toMatch(/\.nm\{[^}]*overflow-wrap:normal/);
  expect(css).toMatch(/\.nm\{[^}]*word-break:normal/);
  expect(css).toMatch(/\.recto\{[^}]*container-type:inline-size/);
  const fits = [...css.matchAll(/--t-title:clamp\(12px,([\d.]+)cqi,\d+px\)/g)].map((m) => 100 / Number(m[1]));
  expect(fits).toHaveLength(2);
  // The clamp budgets 8em of recto per word; PHOTOGRAPHY, the longest at 11 letters, measures 7.6em in
  // Helvetica Neue Bold. A longer word needs a fresh measurement: npx tsx scripts/faces-fit-shots.ts.
  const { COPY } = await import('@/content/copy');
  const longest = Math.max(...COPY.work.index.flatMap((r) => r.name.split(/\s+/).map((w) => w.length)));
  expect(longest).toBeLessThanOrEqual(11);
  for (const fit of fits) expect(fit).toBeGreaterThanOrEqual(8);
});
