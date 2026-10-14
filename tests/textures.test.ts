import { statSync, readdirSync } from 'node:fs';
import { TEXTURES, provenance } from '@/content/textures';

it('tile budget holds', () => {
  const files = readdirSync('public/textures');
  const size = (f: string) => statSync(`public/textures/${f}`).size;
  const at512 = files.filter((f) => f.endsWith('-512.webp')).reduce((n, f) => n + size(f), 0);
  const at1024 = files.filter((f) => f.endsWith('-1024.webp') || f === 'cloth.webp' || f === 'spine.webp').reduce((n, f) => n + size(f), 0);
  expect(at512).toBeLessThan(60 * 1024);
  expect(at1024).toBeLessThan(180 * 1024);
  expect(size('chip.png')).toBeLessThan(80 * 1024);
});
it('every tile has provenance', () => {
  for (const t of TEXTURES) expect(provenance(t)).toMatch(/^[A-Z]+ · IMG_\d{4} · IPHONE · 10\.1[34]\.26$/);
  expect(new Set(TEXTURES.map((t) => t.file)).size).toBe(5);
});
