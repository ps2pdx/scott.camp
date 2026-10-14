function lum(hex: string) {
  const c = hex.replace('#', '').match(/.{2}/g)!.map((h) => parseInt(h, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
const ratio = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const GRAIN = { dark: 0.12, light: 0.18 };
const cases: Array<[string, string, string, 'dark' | 'light']> = [
  ['ink page dark', '#ffffff', '#000000', 'dark'], ['page light', '#000000', '#ffffff', 'light'],
  ['board dark', '#ffffff', '#1c1b19', 'dark'], ['board light', '#000000', '#a8a49c', 'light'],
  ['endpaper dark', '#000000', '#f2dc46', 'dark'], ['endpaper light', '#000000', '#f5e04a', 'light'],
  ['cloth button', '#000000', '#28d941', 'light'], ['volt swatch', '#000000', '#2bf52b', 'light'],
];
for (const [name, fg, bg, mode] of cases) {
  it(`${name} holds 4.5:1 after grain`, () => { expect(ratio(fg, bg) * (1 - GRAIN[mode])).toBeGreaterThanOrEqual(4.5); });
}
