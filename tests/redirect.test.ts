import { readFileSync } from 'node:fs';

it('bell entry carries canonical, OG and the theme boot', () => {
  const html = readFileSync('bell/index.html', 'utf8');
  expect(html).toContain('<link rel="canonical" href="https://scott.camp/bell/">');
  expect(html).toContain('<meta property="og:url" content="https://scott.camp/bell/">');
  expect(html).toContain("<title>Something's clicked</title>");
  expect(html).toContain("localStorage.getItem('theme')");
});
