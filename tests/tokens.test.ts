import { readFileSync } from 'node:fs';
const css = readFileSync('src/styles/tokens.css', 'utf8');
const REQUIRED = ['--s-ink','--s-page','--s-board','--s-endpaper','--s-cloth','--bg','--fg','--fg-muted','--line','--line-strong','--strike','--accent','--accent-fg','--focus','--halo','--grain','--s-1','--s-8','--t-hero','--t-meta-sm','--motion-chip'];
const darkBlock = css.slice(0, css.indexOf('@media (prefers-color-scheme: light)'));
const lightBlock = css.slice(css.indexOf(':root[data-theme="light"]{'));
const MODE_TOKENS = ['--focus','--tech-ink','--s-board','--s-endpaper','--bg','--fg','--fg-muted','--line','--line-strong','--halo','--sheet','--tech','--grain'];

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
it('anchor jumps clear the sticky nav at both widths', () => {
  const idx = readFileSync('src/styles/index.css', 'utf8');
  expect(idx).toMatch(/html\{[^}]*scroll-padding-top:var\(--nav-h\)/);
  expect(css).toMatch(/--nav-h:9rem/);
  expect(css).toMatch(/@media \(min-width:1024px\)\{:root\{[^}]*--nav-h:7rem/);
});
it('grain tiles are rebased so their mid-grey baseline multiplies to the surface color, not below it', () => {
  const tex = readFileSync('src/styles/textures.css', 'utf8');
  expect(tex).toMatch(/\.grain::before\{[^}]*mix-blend-mode:multiply[^}]*filter:brightness\(2\)/);
});
it('the desktop rail scales with the viewport and draws the spine at its true aspect', () => {
  expect(readFileSync('src/styles/tokens.css', 'utf8')).toMatch(/min-width:1024px\)\{:root\{[^}]*--rail:clamp\(56px,5vw,96px\)/);
  expect(readFileSync('src/components/SpineRail.module.css', 'utf8')).toContain('repeat-y;background-size:100% auto');
});
it('the phone band draws the spine rotated, at its true aspect, twice twice as tall as the rail would be wide', () => {
  const css = readFileSync('src/components/SpineRail.module.css', 'utf8');
  expect(css).toMatch(/\.band\{[^}]*height:clamp\(80px,10vw,112px\)[^}]*url\(\/textures\/spine-band\.webp\) repeat-x;background-size:auto 100%/);
});
it('the primary chip is one cloth weave across the whole box: no 9-slice, no radius, no shadow', () => {
  const css = readFileSync('src/components/Button.module.css', 'utf8');
  const primary = css.match(/\.primary\{[^}]*\}/)![0];
  expect(primary).not.toMatch(/border-image|border-radius|box-shadow/);
  expect(primary).toMatch(/url\(\/textures\/cloth\.webp\)/);
  expect(primary).toMatch(/background-origin:border-box;background-clip:border-box/);
});
it('section dividers are 2 px cuts over one fixed spine layer, and plain rules under reduced-data', () => {
  const tex = readFileSync('src/styles/textures.css', 'utf8');
  expect(tex).toContain('.cut{border-top:2px solid transparent;background-clip:padding-box}');
  const reduced = tex.slice(tex.indexOf('@media (prefers-reduced-data: reduce),(forced-colors: active)'));
  expect(reduced).toContain('.reveal{display:none !important}');
  expect(reduced).toContain('.cut{border-top-color:var(--line-strong) !important}');
  const rail = readFileSync('src/components/SpineRail.module.css', 'utf8');
  const reveal = rail.match(/\.reveal\{[^}]*\}/)![0];
  expect(reveal).toMatch(/position:fixed;inset:0;z-index:-1;pointer-events:none;will-change:transform/);
  expect(reveal).toContain('url(/textures/spine-band.webp)');
  expect(reveal).not.toMatch(/filter|mix-blend|background-attachment/);
  for (const f of ['src/components/Section.module.css', 'src/components/Footer.module.css', 'src/App.module.css']) expect(readFileSync(f, 'utf8')).toContain('background-color:var(--bg)');
});
