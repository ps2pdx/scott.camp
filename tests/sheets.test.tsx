import { render, screen } from '@testing-library/react';
import { Index } from '@/components/Index';
import { VolumeFace } from '@/components/VolumeFace';
import { TechSheet } from '@/components/TechSheet';
import { SpecSheet } from '@/components/SpecSheet';
import { COPY } from '@/content/copy';
import { renderBook } from './pages';

it('Index strikes the rows that are not this section and keeps their text', () => {
  const { container } = render(<Index rows={COPY.work.index.map((r, i) => ({ ...r, struck: i < 7 || i > 11 }))} />);
  const table = screen.getByRole('table', { name: /Index/ });
  const rows = screen.getAllByRole('row');
  expect(rows.length).toBe(14);
  const struck = rows.filter((r) => r.querySelector('del'));
  expect(struck.length).toBe(9);
  expect(struck[0].textContent).toContain('Ali Sharifi Rugs');
  expect(rows.filter((r) => !r.querySelector('del')).map((r) => r.children[1].textContent)).toEqual(['Pharm to Body', 'Pure Zero Photography', 'Bend Cleaning', 'Full Scope Supply', 'Typeshit']);
  const scroller = table.parentElement!;
  expect(scroller).toHaveAttribute('data-part', 'index-scroll');
  expect(scroller).not.toHaveAttribute('tabindex');
  expect(rows.every((r) => r.children.length === 4)).toBe(true);
  expect(container.querySelector('table')).toBe(table);
});
it('VolumeFace is a spread: empty verso, recto with number, name, year', () => {
  const { container } = render(<VolumeFace no="08" name="Pharm to Body" year="2026" />);
  expect(container.querySelector('[data-part="verso"]')?.textContent).toBe('');
  expect(screen.getByText('Vol. 08')).toBeInTheDocument();
  expect(screen.getByText('Pharm to Body')).toBeInTheDocument();
  expect(screen.getByText('2026')).toBeInTheDocument();
});
it('fourteen faces number 01 to 14 in index order', () => {
  const { container } = render(<>{COPY.work.index.map((r) => <VolumeFace key={r.no} no={r.no} name={r.name} year={r.year} />)}</>);
  const nos = [...container.querySelectorAll('[data-part="vol"]')].map((e) => e.textContent);
  expect(nos).toEqual(COPY.work.index.map((r) => `Vol. ${r.no}`));
});
const regions = (c: HTMLElement) => [...c.querySelectorAll('[data-part="region"]')];
const numbered = (c: HTMLElement) => regions(c).flatMap((r) => r.getAttribute('data-n')!.split(' ').map(Number)).sort((x, y) => x - y);
const sheet = (figure: string) => [...COPY.nertia.tech, ...COPY.work.tech, COPY.practice.zenHolo.tech].find((t) => t.figure === figure)!;
const drawn = (c: HTMLElement, t: { src: string }) => {
  expect(t.src).toMatch(/^DRAWN FROM /);
  expect(c.querySelector('[data-part="header"]')!.textContent).toContain(`SRC    ${t.src}`);
  expect(c.querySelector('figcaption')!.textContent).toMatch(/^[A-Z0-9 .]+, DRAWN FROM [A-Z ]+, 2026$/);
};
it('every tech sheet picks its figure by a field, and every SRC line says DRAWN', () => {
  for (const t of [...COPY.nertia.tech, ...COPY.work.tech, COPY.practice.zenHolo.tech]) {
    expect(['editor', 'mcp', 'runtime', 'tokens', 'phone', 'pipeline'], t.sheet).toContain(t.figure);
    expect(t.src, t.sheet).toMatch(/^DRAWN FROM /);
    if (t.view.startsWith('PHONE')) expect(t.figure, t.sheet).toBe('phone');
  }
  expect(COPY.nertia.tech.map((t) => t.figure)).toEqual(['editor', 'mcp', 'runtime', 'tokens']);
});
it('editor figure: top bar, preview, insert dock, element panel and chat island, numbered 1 to 5', () => {
  const t = sheet('editor');
  const { container } = render(<TechSheet data={t} />);
  expect(regions(container).length).toBe(5);
  expect(numbered(container)).toEqual([1, 2, 3, 4, 5]);
  expect([...container.querySelectorAll('[data-part="region-n"]')].map((e) => e.textContent)).toEqual(['1', '2', '3', '4', '5']);
  const box = (n: string) => { const r = container.querySelector(`[data-part="region"][data-n="${n}"]`)!; return ['x', 'y', 'width', 'height'].map((k) => Number(r.getAttribute(k))); };
  const [bx, by, bw] = box('1'), [px, , pw] = box('2'), [dx, , dw] = box('3'), [ex] = box('4'), [cx, cy, cw2] = box('5');
  expect(by).toBeLessThan(box('2')[1]);
  expect(bw).toBeGreaterThan(pw);
  expect(dx).toBeGreaterThanOrEqual(px);
  expect(dx + dw).toBeLessThan(px + pw / 4);
  expect(ex).toBeGreaterThan(px + pw / 2);
  expect(cx + cw2).toBeLessThanOrEqual(px + pw);
  expect(cy).toBeGreaterThan(box('2')[1] + box('2')[3] / 2);
  expect(bx).toBe(px);
  drawn(container, t);
});
it('MCP figure: Claude, MCP server, Site in a row, every tool on the middle box', () => {
  const t = sheet('mcp');
  const { container } = render(<TechSheet data={t} />);
  const r = regions(container);
  expect(r.length).toBe(3);
  expect(r.map((e) => e.getAttribute('data-n'))).toEqual(['', t.sections.map((_, i) => i + 1).join(' '), '']);
  expect([...container.querySelectorAll('[data-part="region-n"]')].map((e) => e.textContent)).toEqual(['Claude', 'MCP server', 'Site']);
  drawn(container, t);
});
it('runtime figure: Request, Worker, Render, Static export, each item on its box', () => {
  const t = sheet('runtime');
  const { container } = render(<TechSheet data={t} />);
  expect(regions(container).map((e) => e.getAttribute('data-n'))).toEqual(['', '4', '1 2 3', '5']);
  expect([...container.querySelectorAll('[data-part="region-n"]')].map((e) => e.textContent).join(' ')).toBe('Request Worker Render Static export');
  drawn(container, t);
});
it('design systems figure: five stacked bands, numbered, with 26 beside the presets', () => {
  const t = sheet('tokens');
  const { container } = render(<TechSheet data={t} />);
  const r = regions(container);
  expect(numbered(container)).toEqual([1, 2, 3, 4, 5]);
  const ys = r.map((e) => Number(e.getAttribute('y')));
  expect([...ys].sort((a, b) => a - b)).toEqual(ys);
  expect([...container.querySelectorAll('[data-part="region-n"]')].map((e) => e.textContent)).toEqual(['26', '1', '2', '3', '4', '5']);
  drawn(container, t);
});
it('phone figure: one block per section in order, the nav shortest and the hero tallest, numbered', () => {
  for (const t of COPY.work.tech) {
    const { container, unmount } = render(<TechSheet data={t} />);
    const r = regions(container);
    expect(r.length, t.sheet).toBe(t.sections.length);
    expect(numbered(container)).toEqual(t.sections.map((_, i) => i + 1));
    const hs = r.map((e) => Number(e.getAttribute('height')));
    expect(Math.min(...hs)).toBe(hs[0]);
    expect(Math.max(...hs)).toBe(hs[1]);
    const ys = r.map((e) => Number(e.getAttribute('y')));
    expect([...ys].sort((a, b) => a - b)).toEqual(ys);
    const device = container.querySelector('[data-part="device"]')!;
    expect(Number(device.getAttribute('height')) / Number(device.getAttribute('width'))).toBeCloseTo(19.5 / 9, 2);
    drawn(container, t);
    unmount();
  }
});
it('pipeline figure: Claude Code, Blender MCP, Blender, FFmpeg, YouTube stacked top to bottom, one item per box', () => {
  const t = COPY.practice.zenHolo.tech;
  const { container } = render(<TechSheet data={t} />);
  const r = regions(container);
  expect(r.map((e) => e.getAttribute('data-n'))).toEqual(['1', '2', '3', '4', '5']);
  const ys = r.map((e) => Number(e.getAttribute('y')));
  expect([...ys].sort((a, b) => a - b)).toEqual(ys);
  expect([...container.querySelectorAll('[data-part="region-n"]')].map((e) => e.textContent)).toEqual(['Claude Code', 'Blender MCP', 'Blender', 'FFmpeg', 'YouTube']);
  drawn(container, t);
});
it('leaders: one dotted leader per list item, ending on its region', () => {
  for (const t of [...COPY.nertia.tech, ...COPY.work.tech, COPY.practice.zenHolo.tech]) {
    const { container, unmount } = render(<TechSheet data={t} />);
    const d = container.querySelector('[data-part="leaders"]')!.getAttribute('d')!;
    expect(d.match(/M/g)!.length, t.sheet).toBe(t.sections.length);
    expect(container.querySelector('[data-part="leaders"]')).toHaveAttribute('stroke-dasharray');
    unmount();
  }
});
it('TechSheet is a portrait sheet: header on top, the figure in the middle, the list below, text at the Meta size in a viewBox that tracks the rendered width', () => {
  for (const t of [...COPY.nertia.tech, ...COPY.work.tech, COPY.practice.zenHolo.tech]) {
    const { container, unmount } = render(<TechSheet data={t} />);
    const steps = [...container.querySelectorAll('[data-part="step"]')];
    const header = container.querySelector('[data-part="header"]')!;
    const headerBottom = Math.max(...[...header.querySelectorAll('text')].map((e) => Number(e.getAttribute('y'))));
    const figTop = Math.min(...regions(container).map((e) => Number(e.getAttribute('y'))));
    const figBottom = Math.max(...regions(container).map((e) => Number(e.getAttribute('y')) + Number(e.getAttribute('height'))));
    expect(figTop, t.sheet).toBeGreaterThan(headerBottom + 8);
    for (const st of steps) expect(Number(st.getAttribute('y')) - 13, st.textContent!).toBeGreaterThan(figBottom + 8);
    const vb = container.querySelector('svg')!.getAttribute('viewBox')!.split(' ').map(Number);
    expect(vb[3] / vb[2]).toBeCloseTo(Math.SQRT2, 1);
    expect(container.querySelector('[font-size]')).toBeNull();
    expect(container.querySelector('svg')!.classList.contains('meta')).toBe(true);
    const fs = 13 * 0.64;
    for (const st of steps) expect(Number(st.getAttribute('x')) + st.textContent!.length * fs, st.textContent!).toBeLessThanOrEqual(vb[2] - 8);
    for (const e of header.querySelectorAll('text')) expect(Number(e.getAttribute('x')) + e.textContent!.length * fs, e.textContent!).toBeLessThanOrEqual(vb[2] - 4);
    expect(screen.getByRole('img', { name: `Tech sheet: ${t.sheet}` })).toBeInTheDocument();
    unmount();
  }
});
it('SpecSheet omits empty fields and renders the quoted title', () => {
  render(<SpecSheet sheet={{ title: 'Pure Zero', fields: { Sheet: 'purezerophotography.com', Role: 'Design, build', Stack: 'Nertia' }, href: 'https://purezerophotography.com', label: 'purezerophotography.com' }} volume={{ no: '09', year: '2026' }} />);
  expect(screen.getByText('"Pure Zero"')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /purezerophotography\.com/ })).toHaveAttribute('href', 'https://purezerophotography.com');
});
it('the index names companies, never URLs, and the Work faces carry the name while the Sheet field keeps the domain', async () => {
  for (const r of COPY.work.index) expect(r.name, r.no).not.toMatch(/\.(com|shop|cleaning)$/);
  const { container } = renderBook();
  const work = container.querySelector('#work')!;
  const first = work.querySelector('article')!;
  expect(first.textContent).toContain('Pharm to Body');
  expect(first.textContent).toContain('pharmtobody.com');
});
it('phones keep the tables: no two-row nav, no stacked index, no portrait tech sheet', async () => {
  const { readFileSync } = await import('node:fs');
  const nav = readFileSync('src/components/PunchNav.module.css', 'utf8');
  expect(nav).not.toMatch(/repeat\(4,/);
  expect(nav).toContain('grid-template-columns:repeat(8,minmax(0,1fr))');
  const idx = readFileSync('src/components/Index.module.css', 'utf8');
  expect(idx).not.toMatch(/overflow-x|overflow-wrap|display:block/);
  expect(idx).not.toContain('font-size');
  expect(readFileSync('src/components/TechSheet.tsx', 'utf8')).not.toMatch(/NARROW|useNarrow/);
  expect(readFileSync('src/components/Transcript.module.css', 'utf8')).not.toMatch(/grid-template-columns:1fr/);
});
it('one tone per data set: the yellow pages after the cover carry the lead, the facts, the Virgil row and the index; Work is neutral', async () => {
  const { container } = renderBook();
  const y = container.querySelector('#endpapers')!;
  expect(y).toHaveAttribute('data-surface', 'endpaper');
  expect(container.querySelector('#hero')!.nextElementSibling!.contains(y) || container.querySelectorAll('main > section')[0] === y).toBe(true);
  expect(y.querySelector('table')).not.toBeNull();
  expect(y.textContent).toContain(COPY.hero.lead);
  for (const f of COPY.hero.facts) expect(y.textContent).toContain(f.text);
  expect(y.querySelector('article')).toBeNull();
  expect(y.querySelectorAll('figure').length).toBe(0);
  expect(container.querySelectorAll('[data-surface="endpaper"]').length).toBe(1);
  const work = container.querySelector('#work')!;
  expect(work.querySelector('table')).toBeNull();
  expect(work.querySelectorAll('article').length).toBe(COPY.work.sheets.length);
  const stack = work.querySelector('[data-part="work-sheets"]')!;
  expect([...stack.children].map((c) => c.querySelectorAll('article').length)).toEqual(COPY.work.sheets.map(() => 1));
  expect(work.querySelector('[data-part="cell"]')).toBeNull();
  expect(work.querySelectorAll('svg[role="img"]').length).toBe(5);
});
it('Work carries five tech sheets, Typeshit last, read from the live site, in a scroll-snap slider with Prev and Next', async () => {
  expect(COPY.work.tech.length).toBe(5);
  expect(COPY.work.tech[4]).toEqual({ sheet: 'TYPESHIT.SHOP', figure: 'phone', view: 'PHONE, 390', stack: 'NERTIA, PRINTFUL', src: 'DRAWN FROM SITE STRUCTURE', date: '2026', sections: ['HEADER, BRAND', 'NAV, ABOUT, HELP, CART', 'SHOP, PRODUCT GRID', 'ADD TO CART', 'FOOTER, LINK GROUP', 'COPYRIGHT'] });
  const { readFileSync } = require('node:fs');
  const css = readFileSync('src/components/TechSlider.module.css', 'utf8');
  expect(css).toContain('scroll-snap-type:x mandatory');
  expect(css).toContain('scroll-snap-align:start');
  expect(css).toContain('scrollbar-width:none');
  expect(css).toMatch(/prefers-reduced-motion: reduce\)\{\.track\{scroll-behavior:auto\}/);
  const { container } = renderBook();
  const sliders = [...container.querySelectorAll('[data-part="tech-slider"]')];
  expect(sliders.length).toBe(2);
  for (const sl of sliders) {
    expect([...sl.querySelectorAll('button')].map((b) => b.textContent)).toEqual(['Prev', 'Next']);
    const track = sl.querySelector('[data-part="tech-track"]')!;
    expect(track).toHaveAttribute('tabindex', '0');
    expect(track).toHaveAttribute('role', 'region');
  }
  expect(sliders[1].querySelectorAll('svg[role="img"]').length).toBe(5);
});
it('AboutBox is the book formula: ABOUT over the description, then Place, Type, Year, Source rows, empty rows left out', async () => {
  const { AboutBox } = await import('@/components/AboutBox');
  const { container } = render(<AboutBox about={{ description: 'One sentence.', place: 'pharmtobody.com', type: 'Design, build, Shopify', year: '2026' }} />);
  const box = container.querySelector('[data-part="about"]')!;
  expect(box.firstElementChild!.firstElementChild!.textContent).toBe('About');
  expect(box.querySelector('p.text')!.textContent).toBe('One sentence.');
  expect([...box.querySelectorAll('dt')].map((d) => d.textContent)).toEqual(['Place', 'Type', 'Year']);
  expect([...box.querySelectorAll('dd')].map((d) => d.textContent)).toEqual(['pharmtobody.com', 'Design, build, Shopify', '2026']);
  const css = (await import('node:fs')).readFileSync('src/components/AboutBox.module.css', 'utf8');
  expect(css).toContain('grid-template-columns:minmax(0,2fr) minmax(0,1fr)');
  expect(css).toContain('border:var(--strike) solid var(--line-strong)');
});
it('every piece of work carries exactly one AboutBox: the five Work sites, Zen Holo, Marquee Mondays, TerpScout, Vantage and Nertia', async () => {
  const { ABOUT } = await import('@/content/copy');
  const { container } = renderBook();
  const work = container.querySelector('#work')!;
  const cards = [...work.querySelectorAll('article')];
  expect(cards.length).toBe(5);
  for (const [i, a] of cards.entries()) {
    expect(a.querySelectorAll('[data-part="about"]').length, String(i)).toBe(1);
    const sh = COPY.work.sheets[i];
    const dd = [...a.querySelectorAll('dd')].map((d) => d.textContent);
    expect(dd).toEqual([sh.fields.Sheet, `${sh.fields.Role}, ${sh.fields.Stack}`, COPY.work.index[7 + i].year, 'Live site']);
    expect(sh.body!.startsWith(a.querySelector('[data-part="about"] p')!.textContent!)).toBe(true);
    expect(a.querySelector('.hdr')).toBeNull();
  }
  for (const id of ['vantage', 'nertia', 'terpscout']) expect([...container.querySelectorAll(`#${id} [data-part="about"]`)].filter((b) => !b.closest('[data-part^="specimen-"], [data-part="battlezone"]')).length, id).toBe(1);
  expect(container.querySelectorAll('#practice [data-part="about"]').length).toBe(2);
  expect(ABOUT.zenHolo.source).toBe('Blender render');
  expect(ABOUT.marquee).toMatchObject({ place: 'District', year: '2017', source: 'Event banner' });
  for (const a of Object.values(ABOUT)) for (const v of Object.values(a)) expect(v).toBeTruthy();
});
