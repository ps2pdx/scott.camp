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
it('TechSheet keeps one landscape layout at every width, step labels clear of the header', () => {
  {
    const { container, unmount } = render(<TechSheet data={COPY.work.tech[3]} />);
    const steps = [...container.querySelectorAll('[data-part="step"]')];
    const header = container.querySelector('[data-part="header"]')!;
    const hy = [...header.querySelectorAll('text')].map((t) => Number(t.getAttribute('y')));
    const headerBottom = Math.max(...hy);
    for (const st of steps) expect(Number(st.getAttribute('y')), st.textContent!).toBeGreaterThan(headerBottom + 8);
    const vb = container.querySelector('svg')!.getAttribute('viewBox')!.split(' ').map(Number);
    const fs = Number(steps[0].parentElement!.getAttribute('font-size'));
    const longest = Math.max(...steps.map((st) => st.textContent!.length));
    expect(Number(steps[0].getAttribute('x')) + longest * fs * 0.6, 'label fits').toBeLessThanOrEqual(vb[2] - 8);
    expect(vb[2]).toBeGreaterThan(vb[3]);
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
  const { App } = await import('@/App');
  const { container } = render(<App />);
  const work = container.querySelector('#work + [data-part="section-body"]')!;
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
  expect(idx).toContain('.table{font-size:10px}');
  expect(readFileSync('src/components/TechSheet.tsx', 'utf8')).not.toMatch(/NARROW|useNarrow/);
  expect(readFileSync('src/components/Transcript.module.css', 'utf8')).not.toMatch(/grid-template-columns:1fr/);
});
it('one tone per data set: the Work index is the yellow page edge to edge, every sheet is neutral', async () => {
  const { readFileSync } = await import('node:fs');
  const { App } = await import('@/App');
  const { container } = render(<App />);
  const work = container.querySelector('#work')!;
  expect(work).toHaveAttribute('data-surface', 'endpaper');
  expect(work.querySelector('table')).not.toBeNull();
  expect(work.querySelector('article, figure')).toBeNull();
  expect(container.querySelectorAll('[data-surface="endpaper"]').length).toBe(1);
  const body = container.querySelector('#work + [data-part="section-body"]')!;
  expect(body.querySelectorAll('article').length).toBe(COPY.work.sheets.length);
  expect(body.querySelector('table')).toBeNull();
  expect(readFileSync('src/components/Section.module.css', 'utf8')).toMatch(/\.endpaper\{background-color:var\(--s-endpaper\);color:#000;--fg:#000;[^}]*--line-strong:#000/);
  expect(readFileSync('src/components/Index.tsx', 'utf8')).not.toContain('Surface');
});
