import { readFileSync } from 'node:fs';

const css = readFileSync('src/styles/tokens.css', 'utf8');
function block(selector: string) {
  const start = css.indexOf(selector + '{');
  const body = css.slice(start + selector.length + 1, css.indexOf('}', start));
  return Object.fromEntries([...body.matchAll(/(--[\w-]+):([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
}
const dark = block(':root');
const light = { ...dark, ...block(':root[data-theme="light"]') };
const MODES = { dark, light } as const;
const GRAIN = { dark: Number(dark['--grain']), light: Number(light['--grain']) };

type RGB = [number, number, number];
function parse(v: string, under: RGB = [0, 0, 0]): RGB {
  const hex = v.match(/^#([0-9a-f]{6})$/i);
  if (hex) return hex[1].match(/.{2}/g)!.map((h) => parseInt(h, 16)) as RGB;
  const rgba = v.match(/^rgba\((\d+),(\d+),(\d+),([\d.]+)\)$/);
  if (!rgba) throw new Error(`unparsed color ${v}`);
  const a = Number(rgba[4]);
  return [1, 2, 3].map((i, k) => Number(rgba[i]) * a + under[k] * (1 - a)) as RGB;
}
function lum(c: RGB) {
  const l = c.map((v) => v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2];
}
const ratio = (a: RGB, b: RGB) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const on = (mode: 'dark' | 'light', fgToken: string, bgToken: string) => {
  const t = MODES[mode]; const bg = parse(t[bgToken]); return ratio(parse(t[fgToken], bg), bg);
};

const text: Array<[string, 'dark' | 'light', string, string]> = [
  ['fg on page', 'dark', '--fg', '--bg'], ['fg on page', 'light', '--fg', '--bg'],
  ['fg on board', 'dark', '--fg', '--s-board'], ['fg on board', 'light', '--fg', '--s-board'],
  ['muted on page', 'dark', '--fg-muted', '--bg'], ['muted on page', 'light', '--fg-muted', '--bg'],
  ['muted on board', 'dark', '--fg-muted', '--s-board'], ['muted on board', 'light', '--fg-muted', '--s-board'],
  ['ink on endpaper', 'dark', '--accent-fg', '--s-endpaper'], ['ink on endpaper', 'light', '--accent-fg', '--s-endpaper'],
  ['ink on volt swatch', 'dark', '--accent-fg', '--s-cloth'],
];
for (const [name, mode, fg, bg] of text) {
  it(`${name} (${mode}) holds 4.5:1 after grain`, () => { expect(on(mode, fg, bg) * (1 - GRAIN[mode])).toBeGreaterThanOrEqual(4.5); });
}
it('ink on the photographed cloth button holds 4.5:1', () => { expect(ratio([0, 0, 0], parse('#28d941')) * (1 - GRAIN.light)).toBeGreaterThanOrEqual(4.5); });

for (const mode of ['dark', 'light'] as const) for (const bg of ['--bg', '--s-board', '--sheet']) {
  it(`focus ring (${mode}) holds 3:1 against ${bg}`, () => { expect(on(mode, '--focus', bg)).toBeGreaterThanOrEqual(3); });
}
it('light focus is not volt', () => { expect(light['--focus']).not.toBe(dark['--focus']); });

// The card tiles (scripts/cut-tiles.py) bake the grain into the surface colour, clamped to the colour times
// 1 - CARD_FLOOR and the colour plus CARD_FLOOR of the way to white, so the grain bound above still holds.
const FLOOR = Number(readFileSync('scripts/cut-tiles.py', 'utf8').match(/^CARD_FLOOR = ([\d.]+)$/m)![1]);
it('card floor is no darker than the grain it replaces', () => { expect(FLOOR).toBeLessThanOrEqual(Math.min(GRAIN.dark, GRAIN.light)); });
it('fg on the dark board card holds 4.5:1 at the brightest fibre', () => {
  const lifted = parse(dark['--s-board']).map((v) => v + FLOOR * (255 - v)) as RGB;
  expect(ratio(parse(dark['--fg']), lifted)).toBeGreaterThanOrEqual(4.5);
});
