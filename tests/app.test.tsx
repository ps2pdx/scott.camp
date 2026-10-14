import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { App } from '@/App';
import { COPY, SECTIONS } from '@/content/copy';

beforeAll(() => { (globalThis as any).IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} }; });

it('renders the seven sections in order with running heads', () => {
  const { container } = render(<App />);
  expect([...container.querySelectorAll('section')].map((s) => s.id)).toEqual(['hero', 'endpapers', ...SECTIONS.slice(1).map((s) => s.id)]);
  expect(screen.getByText('Scott Campbell, Portland, Oregon')).toBeInTheDocument();
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
  expect(type.match(/font-weight:700/g)!.length).toBe(2);
  expect(type).toMatch(/\.watermark\{font-family:'Courier New'[^}]*font-weight:700/);
});

it('the cover holds only the eyebrow, the name line and the headline, no actions; the Virgil row sits on the yellow pages, once', () => {
  const { container } = render(<App />);
  const cover = container.querySelector('#hero')!;
  expect(cover.querySelector('h1')!.textContent).toBe("Something Click'd");
  expect(cover.querySelector('h1')!.classList.contains('bleed-btn')).toBe(true);
  expect(cover.querySelectorAll('a, button').length).toBe(0);
  expect(cover.querySelector('p, ul, table')).toBeNull();
  expect(cover.textContent).toContain('"I design systems agents ship."');
  const v = COPY.endpapers.virgil;
  expect(v).toEqual({ when: '2015 to 2016', who: 'Virgil', text: 'Virgil Abloh played Euphoria, Portland, the room that is 45 East now. He dapped me up in the crowd. We exchanged pleasantries, as far as club sound at 1 AM allows.' });
  expect(container.querySelector('#endpapers')!.textContent).toContain(v.text);
  expect(container.textContent!.split('dapped me up').length).toBe(2);
  expect(container.querySelectorAll('#endpapers del').length).toBe(0);
  expect(COPY.practice.rows[0].text).toContain('Marquee Mondays');
  expect(COPY.practice.rows[0].text).not.toContain('Virgil');
});
it('sections run cover, yellow pages, Vantage, Nertia, Design system, Work, TerpScout, Practice, Contact', () => {
  const { container } = render(<App />);
  expect([...container.querySelectorAll('section')].map((x) => x.id)).toEqual(['hero', 'endpapers', 'vantage', 'nertia', 'design-system', 'work', 'terpscout', 'practice', 'contact']);
  expect(SECTIONS.map((x) => x.id)).toEqual(['hero', 'vantage', 'nertia', 'design-system', 'work', 'terpscout', 'practice', 'contact']);
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
it('the Nertia block links to the specimen as its documentation, beside the source line', () => {
  render(<App />);
  const a = screen.getAllByRole('link', { name: 'Documentation ↗' })[0];
  expect(a).toHaveAttribute('href', '/specimen');
  expect(a.parentElement!.textContent).toContain('The design system this page is built with, documented on a page, not in a file.');
  expect(a.closest('#nertia')).not.toBeNull();
  expect(a.parentElement!.previousElementSibling!.textContent).toContain('Source on GitHub');
});
it('the cover carries the name as a title page would, once, beside the eyebrow', () => {
  const { container } = render(<App />);
  const line = container.querySelector('#hero [data-part="title-line"]')!;
  expect(line.textContent).toBe('Scott Campbell, Portland, Oregon');
  expect(line.classList.contains('meta')).toBe(true);
  expect(line.previousElementSibling!.textContent).toBe('"I design systems agents ship."');
  expect(container.textContent!.split('Portland, Oregon').length).toBe(2);
});
it('the design system block: the contract in tiers, one change across two presets, the tools, its links and watermark', () => {
  const { container } = render(<App />);
  const d = container.querySelector('#design-system')!;
  expect(d.querySelector('h2')!.textContent).toBe('One contract, every site');
  expect(d.textContent).toContain('Design system [2026]');
  expect([...d.querySelectorAll('table')[0].querySelectorAll('tr')].map((r) => r.children[0].textContent)).toEqual(['Surface', 'Text', 'Line', 'Accent', 'Radius', 'Shadow', 'Motion', 'Type']);
  expect([...d.querySelectorAll('figcaption')].map((f) => f.textContent)).toEqual(['The catalogue site under zinc', 'The same site, one token change, under orange']);
  const tools = [...d.querySelectorAll('table')[1].querySelectorAll('td:first-child')].map((t) => t.textContent);
  for (const t of ['switch_site_skin', 'update_copy', 'publish_site', 'publish_from_github']) expect(tools).toContain(t);
  expect(d.querySelector('a[href="/specimen"]')!.textContent).toBe('Documentation ↗');
  expect(d.querySelector('a[href="https://github.com/ps2pdx/nertia/blob/main/docs/design-system-contract.md"]')!.textContent).toBe('Contract on GitHub ↗');
  expect(container.querySelector('#nertia')!.nextElementSibling).toBe(d);
  expect(d.nextElementSibling!.id).toBe('work');
});
