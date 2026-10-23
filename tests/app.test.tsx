import { screen } from '@testing-library/react';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { COPY, SECTIONS } from '@/content/copy';
import { renderBook, renderPage } from './pages';
import { FRAMES } from '@/components/BookGallery';

beforeAll(() => { (globalThis as any).IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} }; });

it('the landing renders the cover, the yellow pages and one snippet per chapter in order', () => {
  const { container } = renderPage('hero');
  expect([...container.querySelectorAll('section')].map((s) => s.id)).toEqual(['hero', 'endpapers', ...SECTIONS.slice(1).map((s) => `snippet-${s.id}`)]);
  expect(screen.getByText('Scott Campbell, c/o Nertia.ai, Portland, Oregon')).toBeInTheDocument();
  expect(screen.getByText('"I design systems agents ship."')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Something Click'd");
});
it('carries the code-site line, the provenance line and the resume', () => {
  renderBook();
  expect(screen.getByText(/This page is a code site published by an agent/)).toBeInTheDocument();
  expect(screen.getByText('Textures photographed from one copy of ICONS, 13 October 2026.')).toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: /Resume|Download resume/ })[0]).toHaveAttribute('href', '/Scott_Campbell_Resume.pdf');
});
it('places ten tech sheets across the chapters and fifteen index rows on the landing', () => {
  const { container } = renderBook();
  expect(container.querySelectorAll('figure svg[role="img"]').length).toBe(10);
  expect(container.querySelectorAll('#endpapers tr').length).toBe(15);
});

describe('theme boot', () => {
  const boot = [...readFileSync('bell/index.html', 'utf8').matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]).find((x) => x.includes('localStorage'))!;
  const run = () => new Function(boot)();
  afterEach(() => { document.documentElement.removeAttribute('data-theme'); localStorage.clear(); });
  it('a stored override wins before paint', () => {
    localStorage.setItem('theme', 'light');
    run();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
  it('with nothing stored the attribute stays off so prefers-color-scheme decides', () => {
    run();
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });
  it('ignores a junk value', () => {
    localStorage.setItem('theme', 'sepia');
    run();
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });
});
it('Practice carries the Marquee Mondays evidence pair with captions and alt text', () => {
  renderPage('practice');
  for (const c of ['Event banner, Marquee Mondays 017, District, 5 June 2017', 'Series banner, Marquee Mondays, District, 2017']) expect(screen.getByText(c).closest('figure')!.querySelector('img')!.getAttribute('alt')).toMatch(/Marquee Mondays/);
});
it('every content section carries a tool watermark: its own facts, a unique seeded placement, motion hidden, a static list for screen readers', async () => {
  const { container } = renderBook();
  const { readFileSync } = await import('node:fs');
  const seen = new Set<string>();
  for (const id of ['vantage', 'nertia', 'design-system', 'work', 'terpscout', 'practice'] as const) {
    const sec = container.querySelector(`#${id}`)!;
    const items = id === 'design-system' ? COPY.designSystem.watermark : COPY[id].tools;
    const wm = sec.querySelector(':scope > [data-part="tools"]')!;
    expect(wm, id).not.toBeNull();
    expect([...wm.querySelectorAll('ul.sr-only li')].map((l) => l.textContent)).toEqual(items);
    const moving = wm.querySelector('[aria-hidden="true"]')!;
    expect(moving.classList.contains('watermark')).toBe(true);
    expect(moving.textContent).toBe(`${items.join(' · ')} · `.repeat(2));
    expect([72, 96, 128, 160]).toContain(Number(wm.getAttribute('data-size')));
    expect([24, 48, 72, 96]).toContain(Number(wm.getAttribute('data-offset')));
    expect(sec.getAttribute('data-wm-size')).toBe(wm.getAttribute('data-size'));
    seen.add(`${wm.getAttribute('data-size')}/${wm.getAttribute('data-offset')}`);
  }
  expect(seen.size).toBe(6);
  expect(container.querySelectorAll('[data-part="tools"]').length).toBe(6);
  expect(container.querySelector('#hero [data-part="tools"], #contact [data-part="tools"], #endpapers [data-part="tools"]')).toBeNull();
  const css = readFileSync('src/components/ToolMark.module.css', 'utf8');
  expect(css).toMatch(/pointer-events:none;color:var\(--fg\);opacity:0.1/);
  expect(css).toMatch(/animation:wm 90s linear infinite/);
  expect(css).not.toMatch(/background/);
  expect(css).toMatch(/transform:rotate\(-4deg\)/);
  expect(css).toMatch(/var\(--wm-k\) \* 0\.9/);
  const still = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce),(prefers-reduced-data: reduce),(forced-colors: active)'));
  expect(still).toMatch(/\.track\{animation:none/);
  expect(still).toContain('.run+.run{display:none}');
  const type = readFileSync('src/styles/type.css', 'utf8');
  expect(type.match(/font-weight:700/g)!.length).toBe(3);
  expect(type).toMatch(/\.watermark\{font-family:'Courier New'[^}]*font-weight:700/);
});

it('the cover holds the eyebrow, the name line, three inline Meta links and the headline, no buttons; the yellow pages open on the name; the Virgil row sits on the yellow pages, once', () => {
  const { container } = renderPage('hero');
  const cover = container.querySelector('#hero')!;
  expect(cover.querySelector('h1')!.textContent).toBe("Something Click'd");
  expect(cover.querySelector('h1')!.classList.contains('bleed-btn')).toBe(true);
  expect(cover.querySelectorAll('button').length).toBe(0);
  const links = [...cover.querySelectorAll('[data-part="cover-links"] a')];
  expect(cover.querySelectorAll('a').length).toBe(4 + COPY.socials.length);
  const socials = [...cover.querySelectorAll('[data-part="cover-socials"] a')];
  expect(socials.map((a) => [a.getAttribute('aria-label'), a.getAttribute('href'), a.getAttribute('target')])).toEqual(COPY.socials.map((x) => [x.label, x.href, '_blank']));
  expect(socials.every((a) => a.querySelector('svg[aria-hidden="true"] path'))).toBe(true);
  expect(links.map((a) => [a.firstChild!.textContent, a.getAttribute('href'), a.getAttribute('target')])).toEqual([['Nertia', '/bell/nertia', null], ['Contact', '/bell/contact', null], ['Resume', '/Scott_Campbell_Resume.pdf', '_blank'], ['Book', 'https://cal.com/scott-campbell/consulting', '_blank']]);
  expect(links.map((a) => a.querySelector('[aria-hidden="true"]')?.textContent ?? null)).toEqual([null, null, ' ↗', ' ↗']);
  const coverCss = readFileSync('src/components/Cover.module.css', 'utf8');
  expect(coverCss).toContain('.links a{color:#000;text-decoration:none;');
  expect(coverCss).toContain('.links a:hover,.links a:focus-visible{text-decoration:underline}');
  expect(readFileSync('src/components/PunchNav.module.css', 'utf8')).toContain('.cell{text-decoration:none;');
  expect(cover.querySelector('[data-part="cover-links"]')!.classList.contains('meta')).toBe(true);
  expect(cover.querySelector('p, table, ul:not([data-part="cover-socials"])')).toBeNull();
  const name = container.querySelector('#endpapers [data-part="yellow-name"]')!;
  expect(name.textContent).toBe('Scott Campbell, c/o Nertia.ai');
  expect(name.classList.contains('meta')).toBe(true);
  expect(name.classList.contains('t-title')).toBe(false);
  const lead = name.nextElementSibling!;
  expect(container.querySelector('#endpapers [data-part="frontispiece"], #endpapers [data-part="portrait"]')).toBeNull();
  expect(lead.textContent).toBe(COPY.hero.lead);
  expect(lead.nextElementSibling!.textContent).toContain(COPY.hero.facts[3].text);
  expect(lead.nextElementSibling!.textContent).not.toContain(COPY.endpapers.virgil.text);
  expect(cover.textContent).toContain('"I design systems agents ship."');
  const v = COPY.endpapers.virgil;
  expect(v).toEqual({ when: '2015 to 2016', who: 'Virgil', text: 'I met Virgil once. He dapped me up at 45 East, Euphoria at the time, after playing a cool set.' });
  expect(container.querySelector('#endpapers')!.textContent).toContain(v.text);
  expect(container.textContent!.split('dapped me up').length).toBe(2);
  expect(container.querySelectorAll('#endpapers del').length).toBe(0);
  expect(COPY.practice.rows[0].text).toContain('Marquee Mondays');
  expect(COPY.practice.rows[0].text).not.toContain('Virgil');
});
it('chapters run Design system, Vantage, Nertia, Work, TerpScout, Practice, Contact; each page holds its own section once', () => {
  for (const id of ['design-system', 'vantage', 'nertia', 'work', 'terpscout', 'practice', 'contact'] as const) {
    const { container, unmount } = renderPage(id);
    expect([...container.querySelectorAll('main > section')].map((x) => x.id), id).toEqual(['contents', id]);
    expect(container.querySelector('#hero, #endpapers'), id).toBeNull();
    unmount();
  }
  expect(SECTIONS.map((x) => x.id)).toEqual(['hero', 'design-system', 'vantage', 'nertia', 'work', 'terpscout', 'practice', 'contact']);
});
it('Practice shows the Zen Holo card, hides Purple Scott until its copy exists, keeps the Marquee Mondays row, its banners and the index rows', () => {
  const { container } = renderBook();
  const p = container.querySelector('#practice')!;
  expect([...p.querySelectorAll('article h3')].map((h) => h.textContent)).toEqual(['"Zen Holo"']);
  expect(p.textContent).not.toMatch(/PLACEHOLDER|Copy pending/);
  expect(p.textContent).toContain('Marquee Mondays');
  expect(p.querySelectorAll('figure img').length).toBe(COPY.practice.evidence.length + COPY.practice.zenHolo.figures.length);
  const names = [...container.querySelectorAll('#endpapers td:nth-child(2)')].map((t) => t.textContent);
  expect(names).toContain('Zen Holo');
  expect(names).toContain('Purple Scott');
});
it('the Nertia block ends on the code-site line; the documentation link lives in the design system section', () => {
  const { container } = renderPage('nertia');
  const n = container.querySelector('#nertia')!;
  expect(n.textContent).not.toContain('documented on a page, not in a file');
  expect(n.querySelector('a[href="/specimen"]')).toBeNull();
  expect(n.querySelector(':scope > div > p:last-of-type')!.textContent).toContain('This page is a code site published by an agent.');
});
it('the cover carries the name as a title page would, once, beside the eyebrow', () => {
  const { container } = renderPage('hero');
  const line = container.querySelector('#hero [data-part="title-line"]')!;
  expect(line.textContent).toBe('Scott Campbell, c/o Nertia.ai, Portland, Oregon');
  expect(line.classList.contains('meta')).toBe(true);
  expect(line.previousElementSibling!.textContent).toBe('"I design systems agents ship."');
  expect(container.textContent!.split('Portland, Oregon').length).toBe(2);
});
it('the design system block is the case study of this site: surfaces, textures with provenance, type, signature parts, designed and built, docs, its own tiers', () => {
  const { container } = renderPage('design-system');
  const d = container.querySelector('#design-system')!;
  expect(d.querySelector('h2')).toBeNull();
  expect(container.querySelector('[data-part="cover"] h1')!.textContent).toBe('ICONS');
  expect(d.textContent).toContain('Design system [2026]');
  expect(COPY.designSystem.lead).not.toContain('ICONS');
  expect(COPY.designSystem.lead).toBe('The system comes from one physical object: my copy of the book Zak Group made for Virgil Abloh and Nike (Taschen, 2021). One layer removed: the cloth, paper, board and spine, not the page layouts. A book about icons, so the site is a book too.');
  expect(COPY.designSystem.lead).toContain('One layer removed');
  expect([...d.querySelectorAll('[data-swatch]')].map((x) => x.getAttribute('data-swatch'))).toEqual(['cloth', 'endpaper', 'eggshell', 'white', 'dark']);
  expect(d.querySelector('[data-part="ds-surfaces"]')!.textContent).toContain('#f3f1ea');
  const tex = d.querySelector('[data-part="ds-textures"]')!;
  for (const src of ['IMG_2976', 'IMG_2983', 'IMG_2999', 'IMG_2939', 'IMG_3027']) expect(tex.textContent).toContain(src);
  expect(tex.textContent).toContain('320 px');
  const chip = tex.querySelector('[data-tile="chip"]')!.parentElement!.querySelector('.muted')!.textContent!;
  expect(chip.startsWith('Retired, ')).toBe(true);
  expect(chip.endsWith(', replaced by the cloth weave on buttons, kept on /specimen')).toBe(true);
  expect([...d.querySelectorAll('[data-part="ds-type"] [data-role]')].map((x) => x.getAttribute('data-role'))).toEqual(['Display', 'Title', 'Text', 'Meta', 'Watermark']);
  expect(d.textContent).toContain('Distinct font declarations reduced from 34 to 19.');
  expect(d.textContent).toContain('a store without price tags');
  expect(d.textContent).toContain('2 px cut that carries a strip of the spine band');
  const figs = [...d.querySelectorAll('[data-part="ds-figures"] figure')];
  expect(figs.map((f) => f.querySelector('img')!.getAttribute('src'))).toEqual(['/evidence/specimen-designed.webp', '/evidence/specimen-built.webp']);
  expect(figs.map((f) => f.querySelector('figcaption')!.textContent!.split(',')[0])).toEqual(['Designed', 'Built']);
  const docs = d.querySelector('a[href="/specimen"]')!;
  expect(docs.textContent).toBe('Documentation ↗');
  expect(docs.parentElement!.textContent).toContain('Designed on a canvas, exported, implemented by agents from that export, documented live on this page.');
  const tiers = d.querySelector('table[aria-label="This site\'s tokens by tier"]')!;
  expect([...tiers.querySelectorAll('tr')].map((r) => r.children[0].textContent)).toEqual(['Primitive', 'Semantic', 'Component', 'Scale', 'Type', 'Motion']);
  expect(d.querySelector('[data-part="brand-generator"]')).toBeNull();
  expect(d.textContent).not.toContain('--card-border');
  expect(d.querySelector('a[href*="design-system-contract"]')).toBeNull();
  expect(d.parentElement!.tagName).toBe('MAIN');
});
it('the Nertia block carries the Zero-Point evolution: the generator, the v1 frame, then the builder with the contract tiers, the MCP tools and the contract link', () => {
  const { container } = renderPage('nertia');
  const n = container.querySelector('#nertia')!;
  const ev = n.querySelector('[data-part="zero-point-evolution"]')!;
  expect(ev.querySelector(':scope > .meta')!.textContent).toBe('"Zero-Point evolution"');
  const steps = [...ev.querySelectorAll(':scope > p.transcript')].map((p) => p.textContent);
  expect(steps).toEqual(COPY.nertia.evolution.steps);
  expect(steps.map((x) => x!.split(':')[0])).toEqual(['December 2025, Battlezone', 'January 2026', 'April 2026, the Butterfly Ring', 'May 2026, the double slit', 'May 2026', 'May 2026 to today']);
  expect(ev.querySelector('[data-part="brand-generator"] figcaption')!.textContent).toContain('Brand System v3.0, nertia 7a576f35, January 2026');
  const frame = ev.querySelector('[data-part="zero-point-frame"]')!;
  expect(frame.querySelector('figcaption')!.textContent).toContain('falls back to the system stack');
  expect(frame.querySelector('[data-part="zero-point-v1"]')).toBeNull();
  const order = [...n.querySelectorAll('[data-part="brand-generator"], [data-part^="specimen-"], [data-part="zero-point-frame"], table')].map((x) => x.getAttribute('data-part') ?? x.getAttribute('aria-label'));
  const bz = ev.querySelector('[data-part="battlezone"]')!;
  expect(bz.previousElementSibling!.textContent).toBe(COPY.nertia.evolution.steps[0]);
  expect(bz.nextElementSibling!.textContent).toBe(COPY.nertia.evolution.steps[1]);
  expect([...bz.querySelectorAll('figure')].map((f) => [f.querySelector('img')!.getAttribute('data-ratio'), f.querySelector('img')!.getAttribute('loading'), f.querySelector('figcaption')!.textContent])).toEqual([
    ['3:2', 'lazy', 'Battlezone gameplay, live site screenshot, January 2026'], ['3:2', 'lazy', 'Battlezone sign in, live site screenshot, January 2026'],
  ]);
  expect([...bz.querySelectorAll('[data-part="about"] dt')].map((d) => d.textContent)).toEqual(['Place', 'Type', 'Year', 'Source']);
  expect([...bz.querySelectorAll('[data-part="about"] dd')].map((d) => d.textContent)).toEqual(['battlezone.app', 'Game, multiplayer', '2025', 'Live site']);
  const play = bz.querySelector('a')!;
  expect(play.getAttribute('href')).toBe('https://www.battlezone.app');
  expect(play.textContent).toBe('Play ↗');
  for (const f of ['battlezone-gameplay', 'battlezone-login']) for (const s of ['', '-640']) expect(statSync(`public/evidence/${f}${s}.webp`).size).toBeLessThan(120 * 1024);
  expect(order).toEqual(['brand-generator', 'specimen-butterfly', 'specimen-slit', 'zero-point-frame', 'Skin contract tokens by tier', 'MCP tools that act on the design system or publish']);
  expect([...n.querySelector('table[aria-label="Skin contract tokens by tier"]')!.querySelectorAll('tr')].map((r) => r.children[0].textContent)).toEqual(['Surface', 'Text', 'Line', 'Accent', 'Radius', 'Shadow', 'Motion', 'Type']);
  const tools = [...n.querySelector('table[aria-label^="MCP"]')!.querySelectorAll('td:first-child')].map((t) => t.textContent);
  expect(tools.length).toBe(8);
  for (const t of ['switch_site_skin', 'update_copy', 'publish_site', 'publish_from_github']) expect(tools).toContain(t);
  expect(n.querySelector('a[href="https://github.com/ps2pdx/nertia/blob/main/docs/design-system-contract.md"]')!.textContent).toBe('Contract on GitHub ↗');
  expect([...n.querySelectorAll('[data-part="brand-sample"] a')].every((a) => a.getAttribute('href') === '#nertia')).toBe(true);
  expect(container.querySelectorAll('nav[aria-label="Pages"] a').length).toBe(8);
});
it('Contact opens on the portrait above the title: 1:1, lazy, alt Scott Campbell, caption under the frame, then the lead, the rows, the resume and the consulting sheet', () => {
  const { container } = renderPage('contact');
  const fig = container.querySelector('#contact [data-part="portrait"]')!;
  const img = fig.querySelector('img')!;
  expect(img.getAttribute('src')).toBe('/evidence/portrait.webp');
  expect(img.getAttribute('srcset')).toBe('/evidence/portrait-320.webp 320w, /evidence/portrait.webp 640w');
  expect(statSync('public/evidence/portrait.webp').size).toBeLessThan(80 * 1024);
  for (const old of ['portrait-240.webp', 'portrait-640.webp']) expect(existsSync(`public/evidence/${old}`)).toBe(false);
  expect(img.getAttribute('alt')).toBe('Scott Campbell');
  expect(img.getAttribute('loading')).toBe('lazy');
  expect(fig.querySelector('figcaption')!.textContent).toBe('Portrait');
  expect(img.getAttribute('data-ratio')).toBe('1:1');
  expect(fig.lastElementChild!.tagName).toBe('FIGCAPTION');
  const head = fig.parentElement!.nextElementSibling!;
  expect(head.querySelector('h2')).toBeNull();
  expect(head.querySelector('p.text')!.textContent).toBe(COPY.contact.lead);
  expect(head.querySelector('[data-part="margin"]')!.textContent).toBe(COPY.contact.runningHead);
  const c = container.querySelector('#contact')!;
  const order = [...c.querySelectorAll('h2, [data-part="portrait"], ul.transcript, a[download], [data-part="booking"]')].map((x) => x.tagName === 'H2' ? 'title' : x.getAttribute('data-part') ?? (x.tagName === 'A' ? 'resume' : 'rows'));
  expect(order).toEqual(['portrait', 'rows', 'resume', 'booking']);
  expect(c.querySelector('[data-part="cal-booking"], iframe')).toBeNull();
  expect(c.textContent).not.toContain('Intro, 20 minutes, free');
  expect(readFileSync('src/components/Section.module.css', 'utf8')).toContain('@media (max-width:639px){.portrait{max-width:calc(240px + 2 * var(--tile-pad) + 2 * var(--strike))}}');
});
it('the Design system section opens on the ICONS gallery: main IMG_2975, the frame clump under it, then the lead', () => {
  const { container } = renderPage('design-system');
  const gal = container.querySelector('#design-system [data-part="ds-book"]')!;
  const main = gal.querySelector('[data-part="ds-book-main"]')!;
  const img = main.querySelector('img')!;
  expect(img.getAttribute('src')).toBe('/evidence/frames/img_2975-1280.webp');
  expect(img.getAttribute('srcset')).toBe('/evidence/frames/img_2975-640.webp 640w, /evidence/frames/img_2975-1280.webp 1280w');
  expect(img.getAttribute('alt')).toBe('The book, cover edge, cloth and swoosh');
  expect(img.getAttribute('loading')).toBe('lazy');
  expect(main.querySelector('figcaption')!.textContent).toBe('ICONS, IMG_2975, iPhone, 13 October 2026');
  expect(gal.previousElementSibling).toBeNull();
  expect(gal.nextElementSibling!.textContent).toBe(COPY.designSystem.lead);
  const sheet = gal.querySelector('[data-part="ds-contact-sheet"]')!;
  expect(sheet.closest('[data-part="ds-book"]')).toBe(gal);
  expect(gal.textContent).toContain(`${FRAMES.length} frames, iPhone, 13 and 14 October 2026`);
  expect(gal.textContent).not.toMatch(/IMG_2939(?!,)/);
});
it('the footer tagline reads Built on Nertia.', () => {
  const { container } = renderPage('hero');
  const footer = container.querySelector('footer')!;
  expect(footer.textContent).toContain('Built on Nertia.');
  expect(footer.textContent).not.toContain('Of course it is');
});
it('the footer renders on the inverse surface with the Nertia mark beside Built on Nertia. and the copyright line', () => {
  const { container } = renderPage('work');
  const footer = container.querySelector('footer')!;
  expect(footer.getAttribute('data-surface')).toBe('inverse');
  const mark = footer.querySelector('[data-part="built-on"] a')!;
  expect(mark.getAttribute('href')).toBe('https://www.nertia.ai');
  expect(mark.getAttribute('aria-label')).toBe('Nertia');
  expect(mark.querySelector('svg path')!.getAttribute('fill')).toBe('currentColor');
  expect(mark.nextElementSibling!.textContent).toBe('Built on Nertia.');
  expect(footer.querySelector('[data-part="copyright"]')!.textContent).toBe('© 2026 Scott Campbell');
  expect(footer.querySelector('[data-part="copyright"]')!.className).toContain('meta');
});
