import { globSync, readFileSync } from 'node:fs';

// Distinct font declarations: (property, value) pairs for font-family, font-size, font-weight,
// letter-spacing, text-transform and font-style across src/**/*.css, the vendored zero-point-v1 excluded.
// Full scope counts every --t-* breakpoint value; page scope counts each --t-* token once and leaves out
// the OG and favicon faces (images) and the generator's sample fonts (var(--font-*), generated output).
const PROPS = ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'text-transform', 'font-style'];

function count() {
  const full = new Set<string>(), page = new Set<string>();
  for (const f of globSync('src/**/*.css').filter((p) => !p.includes('zero-point-v1'))) {
    const css = readFileSync(f, 'utf8');
    for (const [, sel, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const image = /\.(og|favicon)\b/.test(sel);
      for (const [, prop, value] of body.matchAll(/(?<![\w-])([a-z-]+|--t-[a-z]+):([^;]+)/g)) {
        const v = value.trim();
        if (prop.startsWith('--t-')) { full.add(`${prop}:${v}`); page.add(prop); continue; }
        if (!PROPS.includes(prop)) continue;
        full.add(`${prop}:${v}`);
        if (!image && !v.startsWith('var(--font-')) page.add(`${prop}:${v}`);
      }
    }
  }
  return { full: full.size, page: page.size };
}

it('font declarations stay under the ceiling: page type below 19, everything at most 27 (the consulting sheet's smaller Display clamp is the 27th)', () => {
  const { full, page } = count();
  expect(page).toBeLessThan(19);
  expect(page).toBeLessThanOrEqual(16);
  expect(full).toBeLessThanOrEqual(27);
});
