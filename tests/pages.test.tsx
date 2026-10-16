import { readFileSync, existsSync } from 'node:fs';
import { COPY, PAGES, chapterTitle, pageHref } from '@/content/copy';
import { lede } from '@/components/Snippet';
import { renderPage } from './pages';

const CHAPTERS = PAGES.filter((x) => x.id !== 'hero');
const attr = (html: string, re: RegExp) => html.match(re)?.[1];

describe('page entries', () => {
  it('each chapter has its own HTML entry with title, description, canonical, og tags, the theme boot and its own module', () => {
    const vite = readFileSync('vite.config.ts', 'utf8');
    for (const x of CHAPTERS) {
      const html = readFileSync(`bell/${x.id}/index.html`, 'utf8');
      const url = `https://scott.camp/bell/${x.id}`;
      expect(html, x.id).toContain(`<title>${x.label}. Scott Campbell</title>`);
      expect(html).toContain(`<meta property="og:title" content="${x.label}. Scott Campbell">`);
      expect(html).toContain(`<link rel="canonical" href="${url}">`);
      expect(html).toContain(`<meta property="og:url" content="${url}">`);
      expect(html).toContain('<meta property="og:image" content="https://scott.camp/og.png?v=2">');
      const desc = attr(html, /<meta name="description" content="([^"]+)">/)!;
      expect(desc.length, x.id).toBeGreaterThan(20);
      expect(attr(html, /<meta property="og:description" content="([^"]+)">/)).toBe(desc);
      expect(html).toContain("localStorage.getItem('theme')");
      expect(html).toContain(`<script type="module" src="/src/entries/${x.id}.tsx"></script>`);
      expect(html).not.toMatch(/[\u2013\u2014]/);
      const entry = readFileSync(`src/entries/${x.id}.tsx`, 'utf8');
      expect(entry).toContain(`<Shell current="${x.id}">`);
      expect(entry).toMatch(/from '@\/sections\//);
      expect(vite).toContain(`'${x.id}'`);
    }
    expect(readFileSync('bell/index.html', 'utf8')).toContain('<script type="module" src="/src/entries/landing.tsx"></script>');
  });

  it('each chapter page renders its section under the shared chrome', () => {
    for (const x of CHAPTERS) {
      const { container, unmount } = renderPage(x.id);
      const sec = container.querySelector(`main > section#${x.id}`)!;
      expect(sec, x.id).not.toBeNull();
      expect(sec.querySelector('h2'), x.id).toBeNull();
      const cover = container.querySelector('[data-part="cover"][data-chapter]')!;
      expect(cover.querySelector('h1')!.textContent, x.id).toBe(chapterTitle(x.id));
      expect(cover.querySelector('.meta')!.textContent, x.id).toBe(`"${x.label}"`);
      expect([...container.querySelectorAll('h1,h2')].filter((h) => h.textContent === chapterTitle(x.id)).length, x.id).toBe(1);
      expect(cover.compareDocumentPosition(container.querySelector('nav')!) & Node.DOCUMENT_POSITION_FOLLOWING, x.id).toBeTruthy();
      expect(container.querySelector('[data-part="snippet"]'), x.id).toBeNull();
      unmount();
    }
  });
});

describe('old anchors', () => {
  const html = readFileSync('bell/index.html', 'utf8');
  const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]).find((x) => x.includes('location.replace'))!;
  const run = (hash: string) => { const replace = vi.fn(); new Function('location', script)({ hash, replace }); return replace; };

  it('runs in the head, before the module script', () => {
    expect(html.indexOf('location.replace')).toBeLessThan(html.indexOf('type="module"'));
    expect(html.indexOf('location.replace')).toBeLessThan(html.indexOf('</head>'));
  });
  it('maps every old chapter hash to its page with location.replace', () => {
    for (const x of CHAPTERS) {
      const r = run(`#${x.id}`);
      expect(r, x.id).toHaveBeenCalledTimes(1);
      expect(r).toHaveBeenCalledWith(pageHref(x.id));
    }
  });
  it('leaves the landing alone for no hash, the cover, the yellow pages and unknown hashes', () => {
    for (const h of ['', '#hero', '#endpapers', '#nope', '#vantage-x']) expect(run(h), h).not.toHaveBeenCalled();
  });
});

describe('landing snippets', () => {
  it('one snippet per chapter, in nav order, each with its title, a trimmed existing lead and a Continue link to its page', () => {
    const { container } = renderPage('hero');
    const snips = [...container.querySelectorAll('[data-part="snippet"]')];
    expect(snips.map((s) => s.getAttribute('data-page'))).toEqual(CHAPTERS.map((x) => x.id));
    for (const s of snips) {
      const id = s.getAttribute('data-page') as (typeof CHAPTERS)[number]['id'];
      const sec = s.closest('section')!;
      expect(sec.id).toBe(`snippet-${id}`);
      const links = [...s.querySelectorAll('a')].filter((a) => a.textContent === 'Continue');
      expect(links.length, id).toBe(1);
      expect(links[0].getAttribute('href')).toBe(pageHref(id));
      expect(links[0].getAttribute('aria-label')).toBe(`Continue to ${CHAPTERS.find((x) => x.id === id)!.label}`);
      expect(links[0].querySelector('[aria-hidden]')).toBeNull();
      expect(sec.querySelector('h2'), id).not.toBeNull();
      expect(s.querySelectorAll('img').length, id).toBe(id === 'work' ? 0 : 1);
      expect(sec.querySelector('[data-part="tools"], details, video, [data-part="tech-slider"], [data-part="ds-book"], [data-part="brand-generator"]'), id).toBeNull();
    }
    const lead = (id: string) => container.querySelector(`#snippet-${id} h2`)!.nextElementSibling?.textContent;
    expect(lead('vantage')).toBe(lede(COPY.vantage.lead, 1));
    expect(COPY.vantage.lead.startsWith(lead('vantage')!)).toBe(true);
    expect(lead('terpscout')).toBe('A brand I built became a network I sold through, at half the going rate.');
    expect(container.querySelector('#snippet-work article')!.textContent).toContain('Pharm to Body');
    expect(container.querySelector('#snippet-design-system img')!.getAttribute('src')).toBe('/evidence/frames/img_2975-1280.webp');
    expect(container.querySelector('#snippet-practice img')!.getAttribute('src')).toBe('/evidence/zen-holo-hummingbird.webp');
    expect(container.querySelector('#snippet-contact img')!.getAttribute('src')).toBe('/evidence/portrait.webp');
    for (const id of ['vantage', 'nertia', 'terpscout']) expect(container.querySelector(`#snippet-${id} [data-part="mark"]`), id).not.toBeNull();
  });
  it('the landing keeps the cover and the yellow pages exactly as before the split', () => {
    const { container } = renderPage('hero');
    expect(container.querySelector('main > section')!.id).toBe('endpapers');
    expect(container.querySelector('#endpapers [data-part="index"]')).not.toBeNull();
  });
  it('the Continue link underlines on hover only, like the cover links', () => {
    const css = readFileSync('src/components/Snippet.module.css', 'utf8');
    expect(css).toMatch(/\.continue\{[^}]*text-decoration:none/);
    expect(css).toContain('.continue:hover,.continue:focus-visible{text-decoration:underline}');
  });
});

describe('Zen Holo', () => {
  const zh = COPY.practice.zenHolo;
  it('the card is live: no placeholder flag, a YouTube link', () => {
    const card = COPY.practice.sheets.find((s) => s.title === 'Zen Holo')!;
    expect(card.placeholder).toBeUndefined();
    expect(card.href).toBe('https://www.youtube.com/channel/UC9rkFGejFF3rypgemxebUKg');
    expect(COPY.work.index.some((r) => r.name === 'Zen Holo')).toBe(true);
  });
  it('the Practice page carries the case: lead, four moves, the pipeline sheet, two framed figures with alt and captions, the YouTube link', () => {
    const { container } = renderPage('practice');
    const p = container.querySelector('#practice')!;
    const card = [...p.querySelectorAll('article')].find((a) => a.textContent!.includes('"Zen Holo"'))!;
    expect(card.textContent).not.toMatch(/PLACEHOLDER|Copy pending/);
    expect(card.querySelector('a')!.textContent).toBe('YouTube ↗');
    const c = p.querySelector('[data-part="zen-holo"]')!;
    expect(c.textContent).toContain(zh.lead);
    expect(zh.lead).toContain('Stone & Water 001');
    expect([...c.querySelectorAll('ul.transcript li')].map((li) => li.querySelector('[data-part="when"]')!.textContent!.split('\n')[1])).toEqual(['One blend', 'Wing flaps', 'Two machines', 'FFmpeg tail']);
    const sheet = c.querySelector('figure[data-figure="pipeline"]')!;
    expect(sheet.querySelectorAll('[data-part="region"]').length).toBe(5);
    expect(sheet.querySelector('svg')!.getAttribute('aria-label')).toBe('Tech sheet: ZEN HOLO PIPELINE');
    const figs = [...c.querySelectorAll('figure')].filter((f) => f.querySelector('img'));
    expect(figs.map((f) => f.querySelector('figcaption')!.textContent)).toEqual(['Stone & Water 001, Blender render, April 2026', 'Blender MCP viewport, screenshot, April 2026']);
    for (const f of figs) {
      const img = f.querySelector('img')!;
      expect(img.getAttribute('alt')!.length).toBeGreaterThan(40);
      expect(img.getAttribute('srcset')).toMatch(/640w, .*1280w$/);
      expect(existsSync(`public${img.getAttribute('src')}`)).toBe(true);
    }
    expect(figs.map((f) => f.querySelector('img')!.getAttribute('data-ratio'))).toEqual(['1:1', '16:9']);
    expect(c.querySelector('a[href="https://www.youtube.com/channel/UC9rkFGejFF3rypgemxebUKg"]')!.textContent).toBe('YouTube ↗');
    expect(c.textContent).not.toMatch(/Headshot|Diablo|get in touch|[\u2013\u2014]/i);
  });
});
