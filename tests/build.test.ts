import { execSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';

describe('build', () => {
  beforeAll(() => { execSync('npm run build', { stdio: 'inherit' }); }, 120_000);

  it('writes the four pages', () => {
    for (const p of ['out/index.html', 'out/bell/index.html', 'out/specimen/index.html', 'out/404.html']) {
      expect(existsSync(p), p).toBe(true);
    }
  });

  it('root is a redirect sheet under 1 KB that points at /bell', () => {
    const html = readFileSync('out/index.html', 'utf8');
    expect(statSync('out/index.html').size).toBeLessThan(1024);
    expect(html).toContain('url=/bell');
    expect(html).toContain("location.replace('/bell')");
    expect(html).toContain('href="/bell"');
  });

  it('the theme boot script runs before the stylesheet and the module script', () => {
    for (const page of ['out/bell/index.html', 'out/specimen/index.html']) {
      const html = readFileSync(page, 'utf8');
      const boot = html.indexOf("localStorage.getItem('theme')");
      const sheet = html.indexOf('rel="stylesheet"');
      const mod = html.indexOf('type="module"');
      expect(boot, page).toBeGreaterThan(-1);
      expect(sheet, page).toBeGreaterThan(boot);
      expect(mod, page).toBeGreaterThan(boot);
    }
  });

  it('404 carries the link and no refresh', () => {
    const html = readFileSync('out/404.html', 'utf8');
    expect(html).toContain('href="/bell"');
    expect(html).not.toContain('http-equiv="refresh"');
  });
});
