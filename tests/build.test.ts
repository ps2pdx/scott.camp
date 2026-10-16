import { execSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';

describe('build', () => {
  beforeAll(() => { execSync('npm run build', { stdio: 'inherit' }); }, 120_000);

  const CHAPTERS = ['design-system', 'vantage', 'nertia', 'work', 'terpscout', 'practice', 'contact'];
  it('writes the root, the landing, the seven chapter pages, the specimen and the 404', () => {
    for (const p of ['out/index.html', 'out/bell/index.html', ...CHAPTERS.map((c) => `out/bell/${c}/index.html`), 'out/specimen/index.html', 'out/404.html']) {
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
    for (const page of ['out/bell/index.html', ...CHAPTERS.map((c) => `out/bell/${c}/index.html`), 'out/specimen/index.html']) {
      const html = readFileSync(page, 'utf8');
      const boot = html.indexOf("localStorage.getItem('theme')");
      const sheet = html.indexOf('rel="stylesheet"');
      const mod = html.indexOf('type="module"');
      expect(boot, page).toBeGreaterThan(-1);
      expect(sheet, page).toBeGreaterThan(boot);
      expect(mod, page).toBeGreaterThan(boot);
    }
  });

  it('the gallery, the generator, the v1 lib and the sliders load only on their own pages', () => {
    const graph = (page: string) => {
      const seen = new Map<string, string>();
      const walk = (f: string) => {
        if (seen.has(f)) return;
        const js = readFileSync(`out${f}`, 'utf8');
        seen.set(f, js);
        for (const [, d] of js.matchAll(/["'](?:\.\/|\/assets\/)([\w.-]+\.js)["']/g)) walk(`/assets/${d}`);
      };
      for (const [, src] of readFileSync(page, 'utf8').matchAll(/(?:src|href)="(\/assets\/[^"]+\.js)"/g)) walk(src);
      return [...seen].map(([f, js]) => `${f}\n${js}`).join('\n');
    };
    const MARKERS = { gallery: 'ds-contact-sheet', generator: 'brand-generator', v1: 'ZeroPointV1', slider: 'tech-slider', techSheet: 'Tech sheet: ' };
    const has = (g: string) => Object.entries(MARKERS).filter(([, m]) => g.includes(m)).map(([k]) => k);
    expect(has(graph('out/bell/index.html'))).toEqual([]);
    for (const c of ['vantage', 'terpscout', 'contact']) expect(has(graph(`out/bell/${c}/index.html`)), c).toEqual([]);
    expect(has(graph('out/bell/design-system/index.html'))).toEqual(['gallery']);
    expect(has(graph('out/bell/nertia/index.html'))).toEqual(['generator', 'v1', 'slider', 'techSheet']);
    expect(has(graph('out/bell/work/index.html'))).toEqual(['slider', 'techSheet']);
    expect(has(graph('out/bell/practice/index.html'))).toEqual(['techSheet']);
  });

  it('404 carries the link and no refresh', () => {
    const html = readFileSync('out/404.html', 'utf8');
    expect(html).toContain('href="/bell"');
    expect(html).not.toContain('http-equiv="refresh"');
  });
});
