import { readFileSync } from 'node:fs';

it('bell entry carries canonical, OG and the theme boot', () => {
  const html = readFileSync('bell/index.html', 'utf8');
  expect(html).toContain('<link rel="canonical" href="https://scott.camp/bell">');
  expect(html).toContain('<meta property="og:url" content="https://scott.camp/bell">');
  expect(html).toContain('<title>Scott Campbell. I design systems agents ship.</title>');
  expect(html).toContain('<meta name="description" content="I design systems agents ship. Design systems, product marketing and agents.">');
  expect(html).toContain('<meta property="og:description" content="I design systems agents ship. Design systems, product marketing and agents.">');
  expect(html).toContain('<meta property="og:image" content="https://scott.camp/og.png?v=2">');
  expect(html).toContain("localStorage.getItem('theme')");
});
it('specimen is canonical to itself, without a trailing slash', () => {
  expect(readFileSync('specimen/index.html', 'utf8')).toContain('<link rel="canonical" href="https://scott.camp/specimen">');
});
