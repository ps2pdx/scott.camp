import { render, screen } from '@testing-library/react';
import { Index } from '@/components/Index';
import { VolumeFace } from '@/components/VolumeFace';
import { TechSheet } from '@/components/TechSheet';
import { SpecSheet } from '@/components/SpecSheet';
import { COPY } from '@/content/copy';

it('Index strikes the rows that are not this section and keeps their text', () => {
  const { container } = render(<Index rows={COPY.work.index} />);
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
it('TechSheet draws one box per section and the SRC line', () => {
  const data = COPY.work.tech[0];
  const { container } = render(<TechSheet data={data} />);
  expect(container.querySelectorAll('[data-part="box"]').length).toBe(data.sections.length);
  expect(container.textContent).toContain('RENDERED FROM SITE STRUCTURE');
  expect(screen.getByRole('img', { name: `Tech sheet: ${data.sheet}` })).toBeInTheDocument();
});
it('TechSheet keeps one landscape layout, its text at the Meta size in a viewBox that tracks the rendered width', () => {
  const { container } = render(<TechSheet data={COPY.work.tech[3]} />);
  const steps = [...container.querySelectorAll('[data-part="step"]')];
  const header = container.querySelector('[data-part="header"]')!;
  const headerBottom = Math.max(...[...header.querySelectorAll('text')].map((t) => Number(t.getAttribute('y'))));
  for (const st of steps) expect(Number(st.getAttribute('y')), st.textContent!).toBeGreaterThan(headerBottom + 8);
  const vb = container.querySelector('svg')!.getAttribute('viewBox')!.split(' ').map(Number);
  expect(vb[2]).toBeGreaterThan(vb[3]);
  expect(container.querySelector('[font-size]')).toBeNull();
  expect(container.querySelector('svg')!.classList.contains('meta')).toBe(true);
  const fs = 13 * 0.64;
  const longest = Math.max(...steps.map((st) => st.textContent!.length));
  expect(Number(steps[0].getAttribute('x')) + longest * fs, 'label fits').toBeLessThanOrEqual(vb[2] - 8);
  for (const t of header.querySelectorAll('text')) expect(Number(t.getAttribute('x')) + t.textContent!.length * fs, t.textContent!).toBeLessThanOrEqual(vb[2] - 4);
});
it('SpecSheet omits empty fields and renders the quoted title', () => {
  render(<SpecSheet sheet={{ title: 'Pure Zero', fields: { Sheet: 'purezerophotography.com', Role: 'Design, build', Stack: 'Nertia' }, href: 'https://purezerophotography.com', label: 'purezerophotography.com' }} volume={{ no: '09', year: '2026' }} />);
  expect(screen.getByText('"Pure Zero"')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /purezerophotography\.com/ })).toHaveAttribute('href', 'https://purezerophotography.com');
});
it('the index names companies, never URLs, and the Work faces carry the name while the Sheet field keeps the domain', async () => {
  for (const r of COPY.work.index) expect(r.name, r.no).not.toMatch(/\.(com|shop|cleaning)$/);
  const { App } = await import('@/App');
  const { container } = render(<App />);
  const work = container.querySelector('#work')!;
  const first = work.querySelector('article')!;
  expect(first.textContent).toContain('Pharm to Body');
  expect(first.textContent).toContain('pharmtobody.com');
});
it('phones keep the tables: no two-row nav, no stacked index, no portrait tech sheet', async () => {
  const { readFileSync } = await import('node:fs');
  const nav = readFileSync('src/components/PunchNav.module.css', 'utf8');
  expect(nav).not.toMatch(/repeat\(4,/);
  expect(nav).toContain('grid-template-columns:repeat(7,minmax(0,1fr))');
  const idx = readFileSync('src/components/Index.module.css', 'utf8');
  expect(idx).not.toMatch(/overflow-x|overflow-wrap|display:block/);
  expect(idx).not.toContain('font-size');
  expect(readFileSync('src/components/TechSheet.tsx', 'utf8')).not.toMatch(/NARROW|useNarrow/);
  expect(readFileSync('src/components/Transcript.module.css', 'utf8')).not.toMatch(/grid-template-columns:1fr/);
});
it('one tone per data set: the yellow pages after the cover carry the lead, the facts, the Virgil row and the index; Work is neutral', async () => {
  const { App } = await import('@/App');
  const { container } = render(<App />);
  const y = container.querySelector('#endpapers')!;
  expect(y).toHaveAttribute('data-surface', 'endpaper');
  expect(container.querySelector('#hero')!.nextElementSibling!.contains(y) || container.querySelectorAll('main > section')[0] === y).toBe(true);
  expect(y.querySelector('table')).not.toBeNull();
  expect(y.textContent).toContain(COPY.hero.lead);
  for (const f of COPY.hero.facts) expect(y.textContent).toContain(f.text);
  expect(y.querySelector('article, figure')).toBeNull();
  expect(container.querySelectorAll('[data-surface="endpaper"]').length).toBe(1);
  const work = container.querySelector('#work')!;
  expect(work.querySelector('table')).toBeNull();
  expect(work.querySelectorAll('article').length).toBe(COPY.work.sheets.length);
  expect(work.querySelectorAll('svg[role="img"]').length).toBe(5);
});
it('Work carries five tech sheets, Typeshit last, read from the live site, in one row of 480 px sheets that wraps', () => {
  expect(COPY.work.tech.length).toBe(5);
  expect(COPY.work.tech[4]).toEqual({ sheet: 'TYPESHIT.SHOP', view: 'PHONE, 390', stack: 'NERTIA, PRINTFUL', src: 'RENDERED FROM SITE STRUCTURE', date: '2026', sections: ['HEADER, BRAND', 'NAV, ABOUT, HELP, CART', 'SHOP, PRODUCT GRID', 'ADD TO CART', 'FOOTER, LINK GROUP', 'COPYRIGHT'] });
  const { readFileSync } = require('node:fs');
  expect(readFileSync('src/App.module.css', 'utf8')).toContain('.techGrid{display:flex;flex-wrap:wrap;gap:var(--s-5)}');
});
