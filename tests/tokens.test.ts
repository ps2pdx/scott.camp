import { readFileSync } from 'node:fs';
const css = readFileSync('src/styles/tokens.css', 'utf8');
const REQUIRED = ['--s-ink','--s-page','--s-board','--s-endpaper','--s-cloth','--bg','--fg','--fg-muted','--line','--line-strong','--strike','--accent','--accent-fg','--focus','--halo','--grain','--s-1','--s-8','--t-display','--t-title','--t-text','--t-meta','--motion-chip'];
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
it('section dividers are 2 px cuts that carry the spine band themselves, no page-sized fixed layer, and plain rules under reduced-data', () => {
  const tex = readFileSync('src/styles/textures.css', 'utf8');
  expect(tex).toContain('.cut{position:relative;border-top:2px solid transparent;background-clip:padding-box}');
  const strip = tex.match(/\.cut::after\{[^}]*\}/)![0];
  expect(strip).toMatch(/position:absolute;left:0;right:0;top:-2px;height:2px/);
  expect(strip).toContain('url(/textures/spine-band.webp)');
  expect(strip).not.toMatch(/fixed|filter|mix-blend|will-change/);
  const reduced = tex.slice(tex.indexOf('@media (prefers-reduced-data: reduce),(forced-colors: active)'));
  expect(reduced).toContain('.cut::after{display:none !important}');
  expect(reduced).toContain('.cut{border-top-color:var(--line-strong) !important}');
  expect(readFileSync('src/components/SpineRail.module.css', 'utf8')).not.toContain('.reveal');
  for (const f of ['src/components/Section.module.css', 'src/components/Footer.module.css']) expect(readFileSync(f, 'utf8')).toContain('background-color:var(--bg)');
});
it('the light page is eggshell, and pure white stays for the punch holes and the sheet', () => {
  expect(lightBlock).toContain('--bg:#f3f1ea');
  expect(lightBlock).toContain('--hole:#ffffff');
  expect(lightBlock).toContain('--sheet:#ffffff');
  expect(darkBlock).toContain('--s-page:#f3f1ea');
  expect(darkBlock).toContain('--hole:#ffffff');
  expect(readFileSync('src/components/Punches.module.css', 'utf8')).toContain('background:var(--hole)');
});
it('ink bleed: 0.5 px on nav labels, 0.3 px on the primary button label, a text-shadow in the text colour, gone under forced colors and reduced data', () => {
  const tex = readFileSync('src/styles/textures.css', 'utf8');
  expect(tex).toContain('.bleed-nav{text-shadow:0 0 0.5px currentColor}');
  expect(tex).toContain('.bleed-btn{text-shadow:0 0 0.3px currentColor}');
  expect(tex.slice(tex.indexOf('@media (prefers-reduced-data'))).toContain('.bleed-nav,.bleed-btn{text-shadow:none !important}');
  expect(tex).not.toMatch(/text-stroke/);
  expect(readFileSync('src/components/PunchNav.tsx', 'utf8')).toContain('bleed-nav');
  expect(readFileSync('src/components/Button.tsx', 'utf8')).toContain('chip bleed-btn');
  for (const f of ['src/components/Button.module.css', 'src/components/PunchNav.module.css']) expect(readFileSync(f, 'utf8')).not.toContain('text-shadow');
});
it('type is three roles at four sizes: no other size, no Courier bold, no letter-spacing besides the two roles', async () => {
  const { globSync } = await import('node:fs');
  expect(css).toContain('--t-display:clamp(');
  expect(css).toMatch(/--t-title:36px;--t-text:18px;--t-meta:13px;--meta-stroke:0.2px/);
  expect(css).toContain('@media (max-width:639px){:root{--t-title:24px;--t-text:14px;--t-meta:11px}}');
  expect(css).toMatch(/@media \(prefers-contrast: more\),\(forced-colors: active\)\{:root\{[^}]*--meta-stroke:0\}/);
  expect(css).toContain('@media (min-width:640px) and (max-width:1023px){:root{--t-text:16px}}');
  expect(css).not.toMatch(/--t-(hero|heading|lead|body|meta-sm)/);
  const files = globSync('src/**/*.css').filter((f) => !f.endsWith('tokens.css') && !f.endsWith('VolumeFace.module.css') && !f.endsWith('ToolMark.module.css') && !f.includes('zero-point-v1'));
  for (const f of files) {
    const t = readFileSync(f, 'utf8');
    for (const m of t.matchAll(/font-size:([^;}]+)/g)) expect(m[1], f).toMatch(/^var\(--t-(display|title|text|meta)\)$/);
    for (const m of t.matchAll(/letter-spacing:([^;}]+)/g)) expect(['-0.02em', '0.04em'], f).toContain(m[1]);
    expect(t, f).not.toMatch(/font-weight:(?!400|700)/);
  }
  const type = readFileSync('src/styles/type.css', 'utf8');
  expect(type).toMatch(/\.meta\{font-family:'Courier New'[^}]*font-weight:400/);
  expect(type).toMatch(/\.text\{font-family:'Courier New',Courier,monospace;font-weight:700;font-size:var\(--t-text\)/);
  expect(type).not.toMatch(/meta-sm|t-hero|t-lead|t-body|t-heading/);
});
it('table rules are the 2 px --strike token in the --line colour; the punch nav keeps its 1 px rules', () => {
  for (const f of ['src/components/Index.module.css', 'src/components/DataTable.module.css']) expect(readFileSync(f, 'utf8')).toContain('.table td{border:var(--strike) solid var(--line);');
  expect(readFileSync('src/components/TechSheet.module.css', 'utf8')).toContain('border:var(--strike) solid var(--line)');
  expect(readFileSync('src/components/PunchNav.module.css', 'utf8')).toContain('.cells li{border-right:1px solid var(--line-strong)}');
});
it('the cloth deboss is tokens only, at least 86 percent ink, and drops under forced colors and more contrast', () => {
  const m = css.match(/--emboss-ink:color-mix\(in oklch,#000000 (\d+)%,var\(--s-cloth\)\)/)!;
  expect(Number(m[1])).toBeGreaterThanOrEqual(86);
  expect(css).toContain('@media (prefers-contrast: more),(forced-colors: active){:root{--emboss-ink:#000000;--emboss-text:none;--emboss-meta:none;--meta-stroke:0}}');
  for (const f of ['src/components/Cover.module.css', 'src/components/Consulting.module.css']) expect(readFileSync(f, 'utf8')).toContain('text-shadow:var(--emboss-text)');
});
it('Meta and transcript rows carry the hairline stroke token; Text stays Courier New Bold without it; muted ink turns full ink on the board', () => {
  const type = readFileSync('src/styles/type.css', 'utf8');
  for (const r of ['meta', 'transcript']) expect(type.match(new RegExp(`\\.${r}\\{[^}]*\\}`))![0]).toContain('-webkit-text-stroke:var(--meta-stroke) currentColor');
  expect(type.match(/\.text\{[^}]*\}/)![0]).not.toContain('stroke');
  expect(readFileSync('src/components/Section.module.css', 'utf8')).toContain('.board{background-color:var(--s-board);--paper:var(--s-board);--fg-muted:var(--fg)}');
  expect(readFileSync('src/components/Consulting.module.css', 'utf8')).not.toContain('--t-display');
});
