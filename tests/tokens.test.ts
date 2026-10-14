import { readFileSync } from 'node:fs';
const css = readFileSync('src/styles/tokens.css', 'utf8');
const REQUIRED = ['--s-ink','--s-page','--s-board','--s-endpaper','--s-cloth','--bg','--fg','--fg-muted','--line','--line-strong','--strike','--accent','--accent-fg','--focus','--halo','--grain','--s-1','--s-8','--t-hero','--t-meta-sm','--motion-chip'];
const darkBlock = css.slice(0, css.indexOf('@media (prefers-color-scheme: light)'));
const lightBlock = css.slice(css.indexOf(':root[data-theme="light"]{'));
const MODE_TOKENS = ['--s-board','--s-endpaper','--bg','--fg','--fg-muted','--line','--line-strong','--halo','--sheet','--tech','--grain'];

it('defines every token named in the spec', () => { for (const t of REQUIRED) expect(css, t).toContain(t + ':'); });
it('light redefines the same mode set the system query does', () => {
  const sys = css.slice(css.indexOf('@media (prefers-color-scheme: light)'), css.indexOf(':root[data-theme="light"]{'));
  for (const t of MODE_TOKENS) { expect(sys, t).toContain(t + ':'); expect(lightBlock, t).toContain(t + ':'); }
});
it('accent text is black in both modes', () => { expect(darkBlock).toContain('--accent-fg:#000000'); expect(lightBlock).not.toContain('--accent-fg:'); });
it('reduced motion zeroes the durations', () => { expect(css).toMatch(/prefers-reduced-motion: reduce\)\{:root\{--motion-fast:0ms;--motion-theme:0ms;--motion-chip:0ms\}\}/); });
it('textures drop under reduced data and forced colors', () => {
  const tex = readFileSync('src/styles/textures.css', 'utf8');
  expect(tex).toContain('@media (prefers-reduced-data: reduce),(forced-colors: active)');
  expect(tex).toContain('.grain::before{display:none}');
});
