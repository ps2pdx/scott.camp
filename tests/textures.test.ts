import { statSync, readdirSync, readFileSync } from 'node:fs';
import { TEXTURES, provenance } from '@/content/textures';

it('tile budget holds', () => {
  const files = readdirSync('public/textures').filter((f) => !f.startsWith('card-'));
  const size = (f: string) => statSync(`public/textures/${f}`).size;
  const at512 = files.filter((f) => f.endsWith('-512.webp')).reduce((n, f) => n + size(f), 0);
  const at1024 = files.filter((f) => f.endsWith('-1024.webp') || f === 'cloth.webp' || f.startsWith('spine')).reduce((n, f) => n + size(f), 0);
  expect(at512).toBeLessThan(60 * 1024);
  expect(at1024).toBeLessThan(190 * 1024); // the baked grain tiles carry alpha; the grey 2x tiles they replace are gone
  expect(size('chip.png')).toBeLessThan(80 * 1024);
});
it('every tile has provenance', () => {
  for (const t of TEXTURES) expect(provenance(t)).toMatch(/^[A-Z]+, IMG_\d{4}, IPHONE, 1[34] OCTOBER 2026$/);
  expect(new Set(TEXTURES.map((t) => t.file)).size).toBe(5);
});

const CARDS = ['endpaper-dark', 'endpaper-light', 'eggshell', 'board-dark', 'board-light'];
it('card tiles: one opaque tile per surface and theme, 1x and 2x, each under 60 KB', () => {
  const cards = readdirSync('public/textures').filter((f) => f.startsWith('card-'));
  expect(cards.sort()).toEqual(CARDS.flatMap((c) => [`card-${c}-1024.webp`, `card-${c}-512.webp`]).sort());
  for (const f of cards) expect(statSync(`public/textures/${f}`).size).toBeLessThan(60 * 1024);
  const tokens = readFileSync('src/styles/tokens.css', 'utf8');
  for (const c of CARDS) expect(tokens).toContain(`image-set("/textures/card-${c}-512.webp" 1x,"/textures/card-${c}-1024.webp" 2x)`);
});
it('card surfaces are one background-image, no grain overlay, flat when textures are off', () => {
  const css = readFileSync('src/styles/textures.css', 'utf8');
  expect(css).toContain('section.grain::before,nav.grain::before{display:none}');
  expect(css).toMatch(/@media \(prefers-reduced-data: reduce\),\(forced-colors: active\)\{[^]*section\.grain,nav\.grain\{background-image:none !important\}/);
  expect(css).not.toMatch(/blend-mode|filter:(?!none)/);
});
