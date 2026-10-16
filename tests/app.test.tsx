import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { App } from '@/App';
import { COPY, SECTIONS } from '@/content/copy';

beforeAll(() => { (globalThis as any).IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} }; });

it('renders the seven sections in order with running heads', () => {
  const { container } = render(<App />);
  expect([...container.querySelectorAll('section')].map((s) => s.id)).toEqual(['hero', 'endpapers', ...SECTIONS.slice(1).map((s) => s.id)]);
  expect(screen.getByText('Scott Campbell, c/o Nertia.ai, Portland, Oregon')).toBeInTheDocument();
  expect(screen.getByText('"I design systems agents ship."')).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent("Something Click'd");
});
it('carries the code-site line, the provenance line and the resume', () => {
  render(<App />);
  expect(screen.getByText(/This page is a code site published by an agent/)).toBeInTheDocument();
  expect(screen.getByText('Textures photographed from one copy of ICONS, 10.13.26.')).toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: /Resume|Download resume/ })[0]).toHaveAttribute('href', '/Scott_Campbell_Resume.pdf');
});
it('places nine tech sheets and thirteen index rows', () => {
  const { container } = render(<App />);
  expect(container.querySelectorAll('figure svg[role="img"]').length).toBe(9);
  expect(container.querySelectorAll('#endpapers tr').length).toBe(13);
});

describe('theme boot', () => {
  const boot = readFileSync('bell/index.html', 'utf8').match(/<script>([\s\S]*?)<\/script>/)![1];
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
  render(<App />);
  for (const c of ['Event banner, Marquee Mondays 017, District, 5 June 2017', 'Series banner, Marquee Mondays, District, 2017']) expect(screen.getByText(c).closest('figure')!.querySelector('img')!.getAttribute('alt')).toMatch(/Marquee Mondays/);
});
it('every content section carries a tool watermark: its own facts, a unique seeded placement, motion hidden, a static list for screen readers', async () => {
  const { container } = render(<App />);
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
  expect(css).not.toMatch(/rotate|background/);
  const still = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce),(prefers-reduced-data: reduce),(forced-colors: active)'));
  expect(still).toMatch(/\.track\{animation:none/);
  expect(still).toContain('.run+.run{display:none}');
  const type = readFileSync('src/styles/type.css', 'utf8');
  expect(type.match(/font-weight:700/g)!.length).toBe(3);
  expect(type).toMatch(/\.watermark\{font-family:'Courier New'[^}]*font-weight:700/);
});

it('the cover holds the eyebrow, the name line, three inline Meta links and the headline, no buttons; the yellow pages open on the name; the Virgil row sits on the yellow pages, once', () => {
  const { container } = render(<App />);
  const cover = container.querySelector('#hero')!;
  expect(cover.querySelector('h1')!.textContent).toBe("Something Click'd");
  expect(cover.querySelector('h1')!.classList.contains('bleed-btn')).toBe(true);
  expect(cover.querySelectorAll('button').length).toBe(0);
  const links = [...cover.querySelectorAll('[data-part="cover-links"] a')];
  expect(cover.querySelectorAll('a').length).toBe(3);
  expect(links.map((a) => [a.textContent, a.getAttribute('href'), a.getAttribute('target')])).toEqual([['Zero-Point story', '#nertia', null], ['Contact', '#contact', null], ['Resume', '/Scott_Campbell_Resume.pdf', '_blank']]);
  expect(cover.querySelector('[data-part="cover-links"]')!.classList.contains('meta')).toBe(true);
  expect(cover.querySelector('p, ul, table')).toBeNull();
  const name = container.querySelector('#endpapers [data-part="yellow-name"]')!;
  expect(name.textContent).toBe('Scott Campbell, c/o Nertia.ai');
  expect(name.classList.contains('display') && name.classList.contains('t-title')).toBe(true);
  const front = name.nextElementSibling!;
  expect(front.getAttribute('data-part')).toBe('frontispiece');
  expect(front.firstElementChild!.getAttribute('data-part')).toBe('portrait');
  expect(front.lastElementChild!.firstElementChild!.textContent).toBe(COPY.hero.lead);
  expect(front.lastElementChild!.textContent).toContain(COPY.hero.facts[3].text);
  expect(front.textContent).not.toContain(COPY.endpapers.virgil.text);
  expect(cover.textContent).toContain('"I design systems agents ship."');
  const v = COPY.endpapers.virgil;
  expect(v).toEqual({ when: '2015 to 2016', who: 'Virgil', text: 'I met Virgil once. He dapped me up at 45 East, Euphoria at the time, after playing a cool set.' });
  expect(container.querySelector('#endpapers')!.textContent).toContain(v.text);
  expect(container.textContent!.split('dapped me up').length).toBe(2);
  expect(container.querySelectorAll('#endpapers del').length).toBe(0);
  expect(COPY.practice.rows[0].text).toContain('Marquee Mondays');
  expect(COPY.practice.rows[0].text).not.toContain('Virgil');
});
it('sections run cover, yellow pages, Design system, Vantage, Nertia, Work, TerpScout, Practice, Contact', () => {
  const { container } = render(<App />);
  expect([...container.querySelectorAll('section')].map((x) => x.id)).toEqual(['hero', 'endpapers', 'design-system', 'vantage', 'nertia', 'work', 'terpscout', 'practice', 'contact']);
  expect(SECTIONS.map((x) => x.id)).toEqual(['hero', 'design-system', 'vantage', 'nertia', 'work', 'terpscout', 'practice', 'contact']);
});
it('Practice hides the placeholder cards until copy exists, keeps the Marquee Mondays row, its banners and the index rows', () => {
  const { container } = render(<App />);
  const p = container.querySelector('#practice')!;
  expect(p.querySelector('article')).toBeNull();
  expect(p.textContent).not.toMatch(/PLACEHOLDER|Copy pending/);
  expect(p.textContent).toContain('Marquee Mondays');
  expect(p.querySelectorAll('figure img').length).toBe(COPY.practice.evidence.length);
  const names = [...container.querySelectorAll('#endpapers td:nth-child(2)')].map((t) => t.textContent);
  expect(names).toContain('Zen Holo');
  expect(names).toContain('Purple Scott');
});
it('the Nertia block ends on the code-site line; the documentation link lives in the design system section', () => {
  const { container } = render(<App />);
  const n = container.querySelector('#nertia')!;
  expect(n.textContent).not.toContain('documented on a page, not in a file');
  expect(n.querySelector('a[href="/specimen"]')).toBeNull();
  expect(n.querySelector(':scope > div > p:last-of-type')!.textContent).toContain('This page is a code site published by an agent.');
});
it('the cover carries the name as a title page would, once, beside the eyebrow', () => {
  const { container } = render(<App />);
  const line = container.querySelector('#hero [data-part="title-line"]')!;
  expect(line.textContent).toBe('Scott Campbell, c/o Nertia.ai, Portland, Oregon');
  expect(line.classList.contains('meta')).toBe(true);
  expect(line.previousElementSibling!.textContent).toBe('"I design systems agents ship."');
  expect(container.textContent!.split('Portland, Oregon').length).toBe(2);
});
it('the design system block is the case study of this site: surfaces, textures with provenance, type, signature parts, designed and built, docs, its own tiers', () => {
  const { container } = render(<App />);
  const d = container.querySelector('#design-system')!;
  expect(d.querySelector('h2')!.textContent).toBe('A book about icons, so the site is a book');
  expect(d.textContent).toContain('Design system [2026]');
  expect(COPY.designSystem.lead).toContain('ICONS');
  expect(COPY.designSystem.lead).toContain('one layer removed');
  expect([...d.querySelectorAll('[data-swatch]')].map((x) => x.getAttribute('data-swatch'))).toEqual(['cloth', 'endpaper', 'eggshell', 'white', 'dark']);
  expect(d.querySelector('[data-part="ds-surfaces"]')!.textContent).toContain('#f3f1ea');
  const tex = d.querySelector('[data-part="ds-textures"]')!;
  for (const src of ['IMG_2976', 'IMG_2983', 'IMG_2999', 'IMG_2939', 'IMG_3027']) expect(tex.textContent).toContain(src);
  expect(tex.textContent).toContain('320 px');
  const chip = tex.querySelector('[data-tile="chip"]')!.parentElement!.querySelector('.muted')!.textContent!;
  expect(chip.startsWith('RETIRED · ')).toBe(true);
  expect(chip.endsWith(', replaced by the cloth weave on buttons, kept on /specimen')).toBe(true);
  expect([...d.querySelectorAll('[data-part="ds-type"] [data-role]')].map((x) => x.getAttribute('data-role'))).toEqual(['Display', 'Title', 'Text', 'Meta', 'Watermark']);
  expect(d.textContent).toContain('Distinct font declarations reduced from 34 to 19.');
  expect(d.textContent).toContain('a store without price tags');
  expect(d.textContent).toContain('2 px transparent cut');
  const figs = [...d.querySelectorAll('[data-part="ds-figures"] figure')];
  expect(figs.map((f) => f.querySelector('img')!.getAttribute('src'))).toEqual(['/evidence/specimen-designed.webp', '/evidence/specimen-built.webp']);
  expect(figs.map((f) => f.querySelector('figcaption')!.textContent!.split(':')[0])).toEqual(['Designed', 'Built']);
  const docs = d.querySelector('a[href="/specimen"]')!;
  expect(docs.textContent).toBe('Documentation ↗');
  expect(docs.parentElement!.textContent).toContain('Designed on a canvas, exported, implemented by agents from that export, documented live on this page.');
  const tiers = d.querySelector('table[aria-label="This site\'s tokens by tier"]')!;
  expect([...tiers.querySelectorAll('tr')].map((r) => r.children[0].textContent)).toEqual(['Primitive', 'Semantic', 'Component', 'Scale', 'Type', 'Motion']);
  expect(d.querySelector('[data-part="brand-generator"]')).toBeNull();
  expect(d.textContent).not.toContain('--card-border');
  expect(d.querySelector('a[href*="design-system-contract"]')).toBeNull();
  expect(container.querySelector('#endpapers')!.nextElementSibling).toBe(d);
  expect(d.nextElementSibling!.id).toBe('vantage');
});
it('the Nertia block carries the Zero-Point evolution: the generator, the v1 frame, then the builder with the contract tiers, the MCP tools and the contract link', () => {
  const { container } = render(<App />);
  const n = container.querySelector('#nertia')!;
  const ev = n.querySelector('[data-part="zero-point-evolution"]')!;
  expect(ev.querySelector('h3')!.textContent).toBe('Zero-Point evolution');
  const steps = [...ev.querySelectorAll(':scope > p.meta')].map((p) => p.textContent);
  expect(steps).toEqual(COPY.nertia.evolution.steps);
  expect(steps.map((x) => x!.split(':')[0])).toEqual(['January 2026', 'May 2026', 'May 2026 to today']);
  expect(ev.querySelector('[data-part="brand-generator"] figcaption')!.textContent).toContain('The Zero-Point generator that started Nertia, January 2026');
  const frame = ev.querySelector('[data-part="zero-point-frame"]')!;
  expect(frame.querySelector('figcaption')!.textContent).toContain('falls back to the system stack');
  expect(frame.querySelector('[data-part="zero-point-v1"]')).toBeNull();
  const order = [...ev.querySelectorAll('[data-part="brand-generator"], [data-part="zero-point-frame"], table')].map((x) => x.getAttribute('data-part') ?? x.getAttribute('aria-label'));
  expect(order).toEqual(['brand-generator', 'zero-point-frame', 'Skin contract tokens by tier', 'MCP tools that act on the design system or publish']);
  expect([...ev.querySelector('table[aria-label="Skin contract tokens by tier"]')!.querySelectorAll('tr')].map((r) => r.children[0].textContent)).toEqual(['Surface', 'Text', 'Line', 'Accent', 'Radius', 'Shadow', 'Motion', 'Type']);
  const tools = [...ev.querySelector('table[aria-label^="MCP"]')!.querySelectorAll('td:first-child')].map((t) => t.textContent);
  expect(tools.length).toBe(8);
  for (const t of ['switch_site_skin', 'update_copy', 'publish_site', 'publish_from_github']) expect(tools).toContain(t);
  expect(ev.querySelector('a[href="https://github.com/ps2pdx/nertia/blob/main/docs/design-system-contract.md"]')!.textContent).toBe('Contract on GitHub ↗');
  expect([...n.querySelectorAll('[data-part="brand-sample"] a')].every((a) => a.getAttribute('href') === '#nertia')).toBe(true);
  expect(container.querySelectorAll('nav[aria-label="Sections"] a').length).toBe(8);
});
it('the yellow pages carry the portrait opposite the name: lazy, alt Scott Campbell, caption SNY00127, 2024', () => {
  const { container } = render(<App />);
  const fig = container.querySelector('#endpapers [data-part="portrait"]')!;
  const img = fig.querySelector('img')!;
  expect(img.getAttribute('src')).toBe('/evidence/portrait.webp');
  expect(img.getAttribute('srcset')).toBe('/evidence/portrait-240.webp 240w, /evidence/portrait.webp 480w, /evidence/portrait-640.webp 640w');
  expect(img.getAttribute('alt')).toBe('Scott Campbell');
  expect(img.getAttribute('loading')).toBe('lazy');
  expect(fig.querySelector('figcaption')!.textContent).toBe('SNY00127, 2024');
  expect(fig.parentElement!.previousElementSibling!.getAttribute('data-part')).toBe('yellow-name');
  expect(fig.nextElementSibling!.firstElementChild!.textContent).toBe(COPY.hero.lead);
});
