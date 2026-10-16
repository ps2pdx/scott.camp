import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';

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

  it('out/ holds only file types nertia serves: no .bin or anything else outside the list', () => {
    const ALLOWED = new Set(['html', 'js', 'css', 'json', 'webp', 'png', 'jpg', 'svg', 'woff2', 'mp4', 'webm', 'pdf', 'ico', 'txt', 'xml']);
    const files = readdirSync('out', { recursive: true, withFileTypes: true }).filter((d) => d.isFile()).map((d) => `${d.parentPath}/${d.name}`);
    expect(files.length).toBeGreaterThan(100);
    expect(files.filter((f) => !ALLOWED.has(/\.([^./]+)$/.exec(f)?.[1] ?? ''))).toEqual([]);
  });

  it('three.js and the Butterfly Ring ship in their own chunk, reached only from the Nertia page, with the vertices in a lazy JS chunk', () => {
    const assets = readdirSync('out/assets');
    const ring = assets.filter((f) => /^ButterflyRing-[\w-]+\.js$/.test(f));
    const verts = assets.filter((f) => /^butterfly-ring-vertices-[\w-]+\.js$/.test(f));
    expect(ring.length).toBe(1);
    expect(verts.length).toBe(1);
    expect(assets.filter((f) => f.endsWith('.js') && readFileSync(`out/assets/${f}`, 'utf8').includes('__THREE__'))).toEqual(ring);
    expect(readFileSync(`out/assets/${ring[0]}`, 'utf8')).toContain(verts[0]);
    const reach = (page: string) => {
      const seen = new Set<string>();
      const walk = (f: string) => { if (seen.has(f)) return; seen.add(f); for (const [, d] of readFileSync(`out/assets/${f}`, 'utf8').matchAll(/["'](?:\.\/|\/assets\/)([\w.-]+\.js)["']/g)) walk(d); };
      for (const [, s] of readFileSync(page, 'utf8').matchAll(/(?:src|href)="\/assets\/([^"]+\.js)"/g)) walk(s);
      return seen;
    };
    const nertia = reach('out/bell/nertia/index.html');
    expect(nertia.has(ring[0]) && nertia.has(verts[0])).toBe(true);
    for (const html of readFileSync('out/bell/nertia/index.html', 'utf8').matchAll(/(?:src|href)="\/assets\/([^"]+\.js)"/g)) expect(html[1]).not.toBe(ring[0]);
    for (const page of ['out/bell/index.html', ...CHAPTERS.filter((c) => c !== 'nertia').map((c) => `out/bell/${c}/index.html`), 'out/specimen/index.html']) {
      const g = reach(page);
      expect(g.has(ring[0]) || g.has(verts[0]), page).toBe(false);
    }
  });

  it('404 carries the link and no refresh', () => {
    const html = readFileSync('out/404.html', 'utf8');
    expect(html).toContain('href="/bell"');
    expect(html).not.toContain('http-equiv="refresh"');
  });
});
