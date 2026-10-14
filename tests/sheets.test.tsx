import { render, screen } from '@testing-library/react';
import { Index } from '@/components/Index';
import { VolumeFace } from '@/components/VolumeFace';
import { TechSheet } from '@/components/TechSheet';
import { SpecSheet } from '@/components/SpecSheet';
import { COPY } from '@/content/copy';

it('Index strikes the rows that are not this section and keeps their text', () => {
  const { container } = render(<Index rows={COPY.work.index} />);
  const struck = container.querySelectorAll('tr[data-struck]');
  expect(struck.length).toBe(9);
  expect(struck[0].textContent).toContain('Ali Sharifi Rugs');
  expect(container.querySelectorAll('tr').length).toBe(13);
});
it('VolumeFace is a spread: empty verso, recto with number, name, year', () => {
  const { container } = render(<VolumeFace no="08" name="pharmtobody.com" year="2026" />);
  expect(container.querySelector('[data-part="verso"]')?.textContent).toBe('');
  expect(screen.getByText('Vol. 08')).toBeInTheDocument();
  expect(screen.getByText('pharmtobody.com')).toBeInTheDocument();
  expect(screen.getByText('2026')).toBeInTheDocument();
});
it('thirteen faces number 01 to 13 in index order', () => {
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
it('SpecSheet omits empty fields and renders the quoted title', () => {
  render(<SpecSheet sheet={{ title: 'Pure Zero', fields: { Sheet: 'purezerophotography.com', Role: 'Design, build', Stack: 'Nertia' }, href: 'https://purezerophotography.com', label: 'purezerophotography.com' }} volume={{ no: '09', year: '2026' }} />);
  expect(screen.getByText('"Pure Zero"')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /purezerophotography\.com/ })).toHaveAttribute('href', 'https://purezerophotography.com');
});
